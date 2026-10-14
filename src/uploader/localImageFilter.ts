import ImageStore from "../imageStore";
import type {PublishSettings} from "../publish";

/**
 * Which local images a store uploads, chosen by folder.
 *
 * "all" uploads everything outside the excluded folders. "selected" uploads
 * only what sits under a target folder, so an empty target list means nothing
 * is uploaded: reading it as "everything" would silently publish images the
 * user meant to keep local.
 */
export type FilterScope = "all" | "selected";

export interface LocalImageFilter {
    scope: FilterScope;
    includeFolders: string[];
    excludeFolders: string[];
}

export type Verdict = "included" | "excluded" | "outOfScope" | "notFound";

export interface Classification {
    verdict: Verdict;
    /** Target folders the path is under. Empty when the scope is "all". */
    includeHits: string[];
    /** Excluded folders the path is under. Exclusion always wins. */
    excludeHits: string[];
}

export function emptyFilter(): LocalImageFilter {
    return {scope: "all", includeFolders: [], excludeFolders: []};
}

/** Vault-relative folder path without leading or trailing slashes. */
export function normalizeFolder(folder: string): string {
    return folder.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
}

/**
 * Whether `path` lies inside `folder`, at any depth. Compared on whole path
 * segments, so "Weather" does not swallow "WeatherOld".
 */
export function isInFolder(path: string, folder: string): boolean {
    const f = normalizeFolder(folder);
    if (f === "") return true;
    return path === f || path.startsWith(f + "/");
}

/** The filter of the selected store, or undefined when it has none yet. */
export function filterFor(settings: PublishSettings): LocalImageFilter | undefined {
    return settings.localImageFilters?.[ImageStore.normalizeId(settings.imageStore)];
}

function folderList(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

/**
 * Decide whether one local image is uploaded.
 *
 * @param path vault-relative path of the image file, or null when the link
 *             could not be matched to any file
 * @param filter the store's filter; undefined keeps the pre-filter behavior
 *               of uploading everything
 */
export function classify(path: string | null, filter: LocalImageFilter | undefined): Classification {
    if (path === null) {
        return {verdict: "notFound", includeHits: [], excludeHits: []};
    }
    const excludeHits = folderList(filter?.excludeFolders).filter(f => isInFolder(path, f));
    const selected = filter?.scope === "selected";
    const includeHits = selected ? folderList(filter?.includeFolders).filter(f => isInFolder(path, f)) : [];
    if (excludeHits.length > 0) {
        return {verdict: "excluded", includeHits, excludeHits};
    }
    if (selected && includeHits.length === 0) {
        return {verdict: "outOfScope", includeHits, excludeHits};
    }
    return {verdict: "included", includeHits, excludeHits};
}

function renamed(folder: string, oldPath: string, newPath: string): string {
    if (folder === oldPath) return newPath;
    if (folder.startsWith(oldPath + "/")) return newPath + folder.slice(oldPath.length);
    return folder;
}

function renameList(list: unknown, oldPath: string, newPath: string): {next: string[]; changed: boolean} {
    const current = folderList(list);
    const next = [...new Set(current.map(f => renamed(f, oldPath, newPath)))];
    const changed = next.length !== current.length || next.some((f, i) => f !== current[i]);
    return {next, changed};
}

/**
 * Follow a folder rename or move in every store's filter, including folders
 * nested under the renamed one. Applying the same rename twice is a no-op,
 * which matters because Obsidian also reports each renamed descendant.
 *
 * @returns whether any filter changed
 */
export function renameFolderInFilters(
    filters: Record<string, LocalImageFilter> | undefined,
    oldPath: string,
    newPath: string,
): boolean {
    if (!filters) return false;
    let changed = false;
    for (const filter of Object.values(filters)) {
        if (!filter || typeof filter !== "object") continue;
        const include = renameList(filter.includeFolders, oldPath, newPath);
        const exclude = renameList(filter.excludeFolders, oldPath, newPath);
        if (include.changed) filter.includeFolders = include.next;
        if (exclude.changed) filter.excludeFolders = exclude.next;
        changed = changed || include.changed || exclude.changed;
    }
    return changed;
}
