/**
 * Remembers which file contents have already been uploaded, and to what URL.
 *
 * Without this the plugin re-reads and re-uploads every local image on every
 * run of "Publish page". With a deterministic path template that only overwrites
 * the same object, but a template containing {random} accumulates a new copy
 * each time — and WebP conversion doubles both the encode work and the traffic.
 *
 * Entries are keyed by the SHA-256 of the bytes that would be uploaded, so
 * editing an image invalidates its entry on its own. The key also carries a
 * fingerprint of the destination, so pointing the plugin at a different bucket
 * or custom domain does not hand back a URL from the old one.
 *
 * The store lives in its own file rather than in data.json: data.json holds
 * credentials and is usually excluded from vault sync, whereas this file is
 * safe to sync and is worth sharing between machines.
 */

export const CACHE_FILE_NAME = "upload-cache.json";

/** Oldest entries are dropped past this count, so the file cannot grow forever. */
const MAX_ENTRIES = 5000;

const CACHE_VERSION = 1;

interface CacheEntry {
    url: string;
    /** Epoch milliseconds, used for pruning and for the settings tab summary. */
    at: number;
}

interface CacheFile {
    version: number;
    entries: Record<string, CacheEntry>;
}

/**
 * The slice of Obsidian's DataAdapter this needs. Narrowing it keeps the cache
 * testable without standing up a vault.
 */
export interface CacheStorage {
    read(path: string): Promise<string>;
    write(path: string, data: string): Promise<void>;
    exists(path: string): Promise<boolean>;
}

export async function sha256(data: BufferSource): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * A short id for where uploads land. Anything that would change the resulting
 * URL belongs in `parts`; the path template deliberately does not, because an
 * object uploaded under an older template is still reachable at its old URL.
 *
 * Callers pass identifying configuration only (bucket, region, domain) and
 * never credentials, so that this file stays safe to sync.
 */
export async function destinationId(parts: (string | undefined)[]): Promise<string> {
    const raw = parts.map(p => (p ?? "").trim()).join("|");
    return (await sha256(new TextEncoder().encode(raw))).slice(0, 12);
}

export function cacheKey(destination: string, variant: string, hash: string): string {
    return `${destination}::${variant}::${hash}`;
}

export default class UploadCache {
    private entries: Record<string, CacheEntry> = {};
    private loaded = false;
    private dirty = false;

    constructor(
        private readonly storage: CacheStorage,
        private readonly filePath: string,
    ) {}

    async load(): Promise<void> {
        if (this.loaded) return;
        this.loaded = true;
        try {
            if (!(await this.storage.exists(this.filePath))) return;
            const raw = await this.storage.read(this.filePath);
            const parsed = JSON.parse(raw) as Partial<CacheFile>;
            // A file written by a future version is discarded rather than
            // half-read: a wrong hit would silently publish the wrong URL.
            if (parsed?.version === CACHE_VERSION && parsed.entries) {
                this.entries = parsed.entries;
            }
        } catch (e) {
            console.warn("Image upload toolkit: could not read the upload cache, starting empty", e);
            this.entries = {};
        }
    }

    get(key: string): string | null {
        const entry = this.entries[key];
        return entry ? entry.url : null;
    }

    set(key: string, url: string, now: number): void {
        this.entries[key] = {url, at: now};
        this.dirty = true;
    }

    size(): number {
        return Object.keys(this.entries).length;
    }

    async clear(): Promise<void> {
        this.entries = {};
        this.dirty = true;
        await this.save();
    }

    async save(): Promise<void> {
        if (!this.dirty) return;
        this.prune();
        const payload: CacheFile = {version: CACHE_VERSION, entries: this.entries};
        try {
            await this.storage.write(this.filePath, JSON.stringify(payload, null, 2));
            this.dirty = false;
        } catch (e) {
            console.error("Image upload toolkit: could not write the upload cache", e);
        }
    }

    private prune(): void {
        const keys = Object.keys(this.entries);
        if (keys.length <= MAX_ENTRIES) return;
        const sorted = keys.sort((a, b) => this.entries[b].at - this.entries[a].at);
        const kept: Record<string, CacheEntry> = {};
        for (const key of sorted.slice(0, MAX_ENTRIES)) {
            kept[key] = this.entries[key];
        }
        this.entries = kept;
    }
}
