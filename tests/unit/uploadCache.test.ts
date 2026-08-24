import {beforeEach, describe, expect, it} from "vitest";
import UploadCache, {
    CACHE_FILE_NAME,
    type CacheStorage,
    cacheKey,
    destinationId,
    sha256,
} from "../../src/uploader/uploadCache";

/** In-memory stand-in for Obsidian's DataAdapter. */
class MemoryStorage implements CacheStorage {
    files = new Map<string, string>();
    writes = 0;

    read(path: string): Promise<string> {
        const data = this.files.get(path);
        if (data === undefined) return Promise.reject(new Error(`ENOENT ${path}`));
        return Promise.resolve(data);
    }

    write(path: string, data: string): Promise<void> {
        this.writes++;
        this.files.set(path, data);
        return Promise.resolve();
    }

    exists(path: string): Promise<boolean> {
        return Promise.resolve(this.files.has(path));
    }
}

const PATH = `plugins/image-upload-toolkit/${CACHE_FILE_NAME}`;

describe("sha256", () => {
    it("produces the known digest of the empty input", async () => {
        expect(await sha256(new Uint8Array())).toBe(
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        );
    });

    it("changes when a single byte changes", async () => {
        const a = await sha256(new Uint8Array([1, 2, 3]));
        const b = await sha256(new Uint8Array([1, 2, 4]));
        expect(a).not.toBe(b);
    });
});

describe("destinationId", () => {
    it("is stable for the same configuration", async () => {
        const parts = ["AWS_S3", "my-bucket", "ap-northeast-1", "cdn.example.com"];
        expect(await destinationId(parts)).toBe(await destinationId([...parts]));
    });

    it("changes when the bucket changes, so old URLs are not reused", async () => {
        const before = await destinationId(["AWS_S3", "bucket-a", "ap-northeast-1", ""]);
        const after = await destinationId(["AWS_S3", "bucket-b", "ap-northeast-1", ""]);
        expect(before).not.toBe(after);
    });

    it("changes when the custom domain changes", async () => {
        const before = await destinationId(["AWS_S3", "b", "r", ""]);
        const after = await destinationId(["AWS_S3", "b", "r", "cdn.example.com"]);
        expect(before).not.toBe(after);
    });

    it("treats undefined and empty the same, so an unset field is not a new destination", async () => {
        expect(await destinationId(["AWS_S3", "b", undefined])).toBe(await destinationId(["AWS_S3", "b", ""]));
    });
});

describe("UploadCache", () => {
    let storage: MemoryStorage;
    let cache: UploadCache;

    beforeEach(() => {
        storage = new MemoryStorage();
        cache = new UploadCache(storage, PATH);
    });

    it("starts empty when there is no cache file", async () => {
        await cache.load();
        expect(cache.size()).toBe(0);
        expect(cache.get("anything")).toBeNull();
    });

    it("returns a stored url and persists it", async () => {
        await cache.load();
        cache.set("k1", "https://cdn.example.com/a.webp", 1000);
        await cache.save();

        const reopened = new UploadCache(storage, PATH);
        await reopened.load();
        expect(reopened.get("k1")).toBe("https://cdn.example.com/a.webp");
        expect(reopened.size()).toBe(1);
    });

    it("does not write when nothing changed", async () => {
        await cache.load();
        await cache.save();
        expect(storage.writes).toBe(0);
    });

    it("clear empties the store and persists that", async () => {
        await cache.load();
        cache.set("k1", "https://cdn.example.com/a.webp", 1000);
        await cache.save();
        await cache.clear();

        const reopened = new UploadCache(storage, PATH);
        await reopened.load();
        expect(reopened.size()).toBe(0);
    });

    // A wrong hit would publish a URL pointing at the wrong object, so an
    // unreadable or unknown-version file has to be discarded, not guessed at.
    it("starts empty on a corrupt cache file", async () => {
        storage.files.set(PATH, "{not json");
        await cache.load();
        expect(cache.size()).toBe(0);
    });

    it("starts empty on a cache file from a newer version", async () => {
        storage.files.set(PATH, JSON.stringify({version: 999, entries: {k1: {url: "u", at: 1}}}));
        await cache.load();
        expect(cache.get("k1")).toBeNull();
    });

    it("survives a storage that cannot be written to", async () => {
        const failing: CacheStorage = {
            read: () => Promise.reject(new Error("nope")),
            write: () => Promise.reject(new Error("read only")),
            exists: () => Promise.resolve(false),
        };
        const readOnly = new UploadCache(failing, PATH);
        await readOnly.load();
        readOnly.set("k1", "https://example.com/a.webp", 1);
        await expect(readOnly.save()).resolves.toBeUndefined();
        // The entry is still usable for the rest of the session.
        expect(readOnly.get("k1")).toBe("https://example.com/a.webp");
    });

    it("prunes the oldest entries past the cap", async () => {
        await cache.load();
        for (let i = 0; i < 5010; i++) {
            cache.set(`k${i}`, `https://example.com/${i}.webp`, i);
        }
        await cache.save();

        const reopened = new UploadCache(storage, PATH);
        await reopened.load();
        expect(reopened.size()).toBe(5000);
        // Newest kept, oldest dropped.
        expect(reopened.get("k5009")).toBe("https://example.com/5009.webp");
        expect(reopened.get("k0")).toBeNull();
    });
});

describe("cacheKey", () => {
    it("separates the displayed image from the archived original", () => {
        const hash = "abc123";
        expect(cacheKey("dest", "display", hash)).not.toBe(cacheKey("dest", "source", hash));
    });

    it("separates destinations", () => {
        expect(cacheKey("dest-a", "display", "h")).not.toBe(cacheKey("dest-b", "display", "h"));
    });
});
