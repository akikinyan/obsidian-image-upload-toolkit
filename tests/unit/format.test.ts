import {describe, expect, it} from "vitest";
import {formatBytes, formatSizeDelta} from "../../src/format";

describe("formatBytes", () => {
    it("keeps bytes whole", () => {
        expect(formatBytes(0)).toBe("0 B");
        expect(formatBytes(512)).toBe("512 B");
        expect(formatBytes(1023)).toBe("1023 B");
    });

    it("switches unit at 1024", () => {
        expect(formatBytes(1024)).toBe("1 KB");
        expect(formatBytes(1536)).toBe("1.5 KB");
        expect(formatBytes(1024 * 1024)).toBe("1 MB");
        expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
    });

    it("drops a trailing .0 so round sizes read cleanly", () => {
        expect(formatBytes(2048)).toBe("2 KB");
        expect(formatBytes(3 * 1024 * 1024)).toBe("3 MB");
    });

    it("stops at GB rather than inventing a unit", () => {
        expect(formatBytes(5 * 1024 * 1024 * 1024)).toBe("5 GB");
    });

    it("renders nonsense input as a dash instead of NaN", () => {
        expect(formatBytes(Number.NaN)).toBe("-");
        expect(formatBytes(-1)).toBe("-");
    });
});

describe("formatSizeDelta", () => {
    it("reports a shrink as a negative percentage", () => {
        expect(formatSizeDelta(1000, 280)).toBe("-72%");
    });

    it("reports growth with an explicit plus, so the direction is unambiguous", () => {
        expect(formatSizeDelta(1000, 1200)).toBe("+20%");
    });

    it("reports no change as 0%", () => {
        expect(formatSizeDelta(1000, 1000)).toBe("0%");
    });

    it("returns nothing when there is no meaningful ratio", () => {
        expect(formatSizeDelta(0, 100)).toBe("");
        expect(formatSizeDelta(Number.NaN, 100)).toBe("");
    });
});
