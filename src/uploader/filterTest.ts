import type {App} from "obsidian";
import type {PublishSettings} from "../publish";
import {i18n} from "../i18n";
import {IMAGE_EXTENSION_REGEX, isAlreadyHosted, MD_REGEX, planImages} from "./imageTagProcessor";
import {classify, filterFor, type Classification, type LocalImageFilter, type Verdict} from "./localImageFilter";
import {MERMAID_REGEX} from "./mermaidProcessor";
import {WebImageDownloader} from "./webImageDownloader";

/**
 * Dry run of the folder conditions, for the test modal.
 *
 * Everything here only reads: the note text it is handed, the link index and
 * the vault tree. It never touches an uploader, the upload cache, the
 * clipboard or an editor, and it neither renders Mermaid nor downloads web
 * images. Local images go through planImages, the same function publishing
 * uses, so a verdict shown here is the verdict a publish would act on.
 */

export interface TestRow {
    path: string;
    verdict: Verdict;
    reason: string;
    /** Number of distinct links to the image in the note; 0 in a vault-wide test. */
    refs: number;
}

export interface NoteTestResult {
    rows: TestRow[];
    /** Distinct web image URLs in the note, and how many of them the store already hosts. */
    web: {total: number; hosted: number};
    mermaid: number;
}

const list = (folders: string[]) => folders.join(", ");

export function reasonFor(result: Classification, filter: LocalImageFilter | undefined, link: string): string {
    const r = i18n().filterTest.reason;
    switch (result.verdict) {
        case "notFound":
            return r.notFound(link);
        case "excluded":
            return result.includeHits.length > 0
                ? r.excludedOverTarget(list(result.excludeHits), list(result.includeHits))
                : r.excluded(list(result.excludeHits));
        case "outOfScope":
            return (filter?.includeFolders?.length ?? 0) === 0 ? r.noTarget : r.notInTarget;
        case "included":
            return result.includeHits.length > 0 ? r.inTarget(list(result.includeHits)) : r.allFolders;
    }
}

export function testNote(app: App, settings: PublishSettings, value: string, sourcePath: string): NoteTestResult {
    const filter = filterFor(settings);
    const rows: TestRow[] = [];
    for (const {image, result} of planImages(app, settings, value, sourcePath)) {
        if (!result) continue;
        rows.push({
            path: image.path,
            verdict: result.verdict,
            reason: reasonFor(result, filter, image.sources[0] ?? image.path),
            refs: image.sources.length,
        });
    }

    const webUrls = new Set<string>();
    for (const match of value.matchAll(MD_REGEX)) {
        if (WebImageDownloader.isWebImage(match[2])) webUrls.add(match[2]);
    }
    const hosted = [...webUrls].filter(url => isAlreadyHosted(url, settings)).length;

    return {
        rows,
        web: {total: webUrls.size, hosted},
        mermaid: [...value.matchAll(MERMAID_REGEX)].length,
    };
}

export function testVault(app: App, settings: PublishSettings): TestRow[] {
    const filter = filterFor(settings);
    return app.vault.getFiles()
        .filter(file => IMAGE_EXTENSION_REGEX.test(file.path))
        .map(file => {
            const result = classify(file.path, filter);
            return {path: file.path, verdict: result.verdict, reason: reasonFor(result, filter, file.path), refs: 0};
        })
        .sort((a, b) => a.path.localeCompare(b.path));
}

/** Rows matching the verdict filter and a case-insensitive path search. */
export function filterRows(rows: TestRow[], verdict: Verdict | "all", query: string): TestRow[] {
    const q = query.trim().toLowerCase();
    return rows.filter(row =>
        (verdict === "all" || row.verdict === verdict) &&
        (q === "" || row.path.toLowerCase().includes(q)));
}

export function countVerdicts(rows: TestRow[]): Record<Verdict, number> {
    const counts: Record<Verdict, number> = {included: 0, excluded: 0, outOfScope: 0, notFound: 0};
    for (const row of rows) counts[row.verdict]++;
    return counts;
}
