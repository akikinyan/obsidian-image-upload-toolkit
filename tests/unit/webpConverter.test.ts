import {describe, expect, it} from "vitest";
import {
    DEFAULT_WEBP_SETTING,
    formatExtensions,
    matchesExtension,
    parseExtensions,
    resolveNoteOptIn,
    toWebpName,
} from "../../src/uploader/webpConverter";

describe("parseExtensions", () => {
    it("splits, trims, lowercases and drops the dot", () => {
        expect(parseExtensions(" PNG, .Jpg ,jpeg ")).toEqual(["png", "jpg", "jpeg"]);
    });

    it("drops empty entries so a trailing comma is harmless", () => {
        expect(parseExtensions("png,,jpg,")).toEqual(["png", "jpg"]);
    });

    it("returns an empty list for an empty field", () => {
        expect(parseExtensions("   ")).toEqual([]);
    });

    it("round-trips through formatExtensions", () => {
        expect(parseExtensions(formatExtensions(["png", "jpg"]))).toEqual(["png", "jpg"]);
    });
});

describe("matchesExtension", () => {
    const exts = DEFAULT_WEBP_SETTING.extensions;

    it("matches regardless of case", () => {
        expect(matchesExtension("Photo.PNG", exts)).toBe(true);
        expect(matchesExtension("Pasted image 20260824080301.png", exts)).toBe(true);
    });

    it("does not match extensions outside the list", () => {
        expect(matchesExtension("diagram.svg", exts)).toBe(false);
        expect(matchesExtension("anim.gif", exts)).toBe(false);
        expect(matchesExtension("already.webp", exts)).toBe(false);
    });

    it("uses the last dot, not the first", () => {
        expect(matchesExtension("archive.tar.png", exts)).toBe(true);
        expect(matchesExtension("photo.png.bak", exts)).toBe(false);
    });

    it("does not match a file without an extension", () => {
        expect(matchesExtension("README", exts)).toBe(false);
    });

    it("matches nothing when the list is empty", () => {
        expect(matchesExtension("photo.png", [])).toBe(false);
    });
});

describe("toWebpName", () => {
    it("replaces the extension", () => {
        expect(toWebpName("Pasted image 20260824.png")).toBe("Pasted image 20260824.webp");
    });

    it("appends when there is no extension", () => {
        expect(toWebpName("screenshot")).toBe("screenshot.webp");
    });

    it("keeps dots that are part of the name", () => {
        expect(toWebpName("v1.2.photo.jpeg")).toBe("v1.2.photo.webp");
    });
});

describe("resolveNoteOptIn", () => {
    it("falls back when the note has no frontmatter", () => {
        expect(resolveNoteOptIn(undefined, "webp", true)).toBe(true);
        expect(resolveNoteOptIn(null, "webp", false)).toBe(false);
    });

    it("falls back when the property is absent", () => {
        expect(resolveNoteOptIn({title: "x"}, "webp", true)).toBe(true);
        expect(resolveNoteOptIn({title: "x"}, "webp", false)).toBe(false);
    });

    // The point of the boolean form: the switch works in both directions.
    it("lets a note opt out of a default-on setting", () => {
        expect(resolveNoteOptIn({webp: false}, "webp", true)).toBe(false);
    });

    it("lets a note opt in to a default-off setting", () => {
        expect(resolveNoteOptIn({webp: true}, "webp", false)).toBe(true);
    });

    it("accepts the usual YAML string spellings", () => {
        for (const yes of ["true", "TRUE", " yes ", "on", "1"]) {
            expect(resolveNoteOptIn({webp: yes}, "webp", false)).toBe(true);
        }
        for (const no of ["false", "No", "off", "0"]) {
            expect(resolveNoteOptIn({webp: no}, "webp", true)).toBe(false);
        }
    });

    it("falls back on a value it cannot read", () => {
        expect(resolveNoteOptIn({webp: "maybe"}, "webp", true)).toBe(true);
        expect(resolveNoteOptIn({webp: 42}, "webp", false)).toBe(false);
    });

    it("falls back when no property name is configured", () => {
        expect(resolveNoteOptIn({webp: false}, "", true)).toBe(true);
    });
});
