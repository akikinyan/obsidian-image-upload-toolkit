import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import UploadProgressModal, {type UploadModes} from "../../src/ui/uploadProgressModal";

const MODES_ON: UploadModes = {webp: "on", webpQuality: 80, keepOriginal: false, historyEnabled: true};

describe("UploadProgressModal", () => {
    const opened: UploadProgressModal[] = [];

    function make(modes: UploadModes | null = null): UploadProgressModal {
        const modal = new UploadProgressModal({} as any, modes);
        opened.push(modal);
        return modal;
    }

    const text = (modal: UploadProgressModal) => modal.modalEl.textContent ?? "";

    beforeEach(() => vi.useFakeTimers());

    afterEach(() => {
        vi.useRealTimers();
        while (opened.length) {
            try { opened.pop()?.close(); } catch { /* noop */ }
        }
    });

    describe("while uploading", () => {
        it("shows the progress bar and the counter", () => {
            const modal = make();
            modal.initialize([{name: "a.png"}, {name: "b.png"}]);
            modal.updateProgress("a.png", true);

            expect(text(modal)).toContain("1/2 (50%)");
            const bar = modal.modalEl.querySelector<HTMLElement>(".progress-bar");
            expect(bar?.style.width).toBe("50%");
        });

        it("recolors the bar as soon as one upload fails", () => {
            const modal = make();
            modal.initialize([{name: "a.png"}, {name: "b.png"}]);
            modal.updateProgress("a.png", false);

            const bar = modal.modalEl.querySelector(".progress-bar");
            expect(bar?.classList.contains("has-failures")).toBe(true);
        });
    });

    describe("on completion", () => {
        // The bar reads 100% and says nothing at that point, so it is replaced.
        it("drops the progress bar and counter", () => {
            const modal = make();
            modal.initialize([{name: "a.png"}]);
            modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 250, converted: true});

            expect(modal.modalEl.querySelector(".progress-bar")).toBeNull();
            expect(text(modal)).not.toContain("1/1 (100%)");
        });

        it("reports success and starts the auto-close countdown", () => {
            const modal = make();
            modal.initialize([{name: "a.png"}, {name: "b.png"}]);
            modal.updateProgress("a.png", true);
            modal.updateProgress("b.png", true);

            expect(text(modal)).toContain("Complete");
            expect(text(modal)).toContain("2 succeeded");
            expect(text(modal)).not.toContain("failed");

            const closeSpy = vi.spyOn(modal, "close");
            vi.advanceTimersByTime(4000);
            expect(closeSpy).not.toHaveBeenCalled();
            vi.advanceTimersByTime(1500);
            expect(closeSpy).toHaveBeenCalled();
        });

        // A title still reading "Uploading images" contradicts a finished body.
        it("retitles itself for the terminal state", () => {
            const modal = make();
            modal.initialize([{name: "a.png"}]);
            expect(modal.titleEl.textContent).toBe("Uploading images");

            modal.updateProgress("a.png", true);
            expect(modal.titleEl.textContent).toBe("Upload complete");
        });

        it("drops the counts line when it only repeats the header", () => {
            const modal = make();
            modal.initialize([{name: "a.png"}]);
            modal.updateProgress("a.png", true);

            expect(modal.modalEl.querySelector(".progress-counts")).toBeNull();
        });

        it("keeps the counts line as soon as it carries something", () => {
            const modal = make();
            modal.initialize([{name: "a.png"}, {name: "b.png"}]);
            modal.updateProgress("a.png", true, {reused: true});
            modal.updateProgress("b.png", true);

            expect(text(modal)).toContain("1 from history");
        });

        it("reports a total failure", () => {
            const modal = make();
            modal.initialize([{name: "a.png"}]);
            modal.updateProgress("a.png", false);

            expect(text(modal)).toContain("Failed");
            expect(text(modal)).toContain("0 succeeded");
            expect(text(modal)).toContain("1 failed");
        });

        it("reports a partial failure and does not close itself", () => {
            const modal = make();
            modal.initialize([{name: "a.png"}, {name: "b.png"}]);
            modal.updateProgress("a.png", true);
            modal.updateProgress("b.png", false);

            expect(text(modal)).toContain("Completed with errors");
            expect(text(modal)).toContain("1 succeeded");
            expect(text(modal)).toContain("1 failed");

            const closeSpy = vi.spyOn(modal, "close");
            vi.advanceTimersByTime(10000);
            expect(closeSpy).not.toHaveBeenCalled();
        });
    });

    describe("auto-close countdown", () => {
        function completed(): UploadProgressModal {
            const modal = make();
            modal.initialize([{name: "a.png"}]);
            modal.updateProgress("a.png", true);
            return modal;
        }

        it("renders a countdown bar", () => {
            expect(completed().modalEl.querySelector(".auto-close-bar")).not.toBeNull();
        });

        // Someone reading the numbers should not have them pulled away.
        it("pauses while the pointer is over the modal", () => {
            const modal = completed();
            const closeSpy = vi.spyOn(modal, "close");

            vi.advanceTimersByTime(2000);
            modal.modalEl.dispatchEvent(new MouseEvent("mouseenter"));
            vi.advanceTimersByTime(60000);
            expect(closeSpy).not.toHaveBeenCalled();
            expect(modal.modalEl.querySelector(".auto-close-bar")?.classList.contains("is-paused")).toBe(true);
        });

        it("resumes with the time that was left, not a fresh countdown", () => {
            const modal = completed();
            const closeSpy = vi.spyOn(modal, "close");

            vi.advanceTimersByTime(4000);
            modal.modalEl.dispatchEvent(new MouseEvent("mouseenter"));
            vi.advanceTimersByTime(60000);
            modal.modalEl.dispatchEvent(new MouseEvent("mouseleave"));

            // 1s was left when the pointer arrived, so a little more finishes it.
            vi.advanceTimersByTime(900);
            expect(closeSpy).not.toHaveBeenCalled();
            vi.advanceTimersByTime(200);
            expect(closeSpy).toHaveBeenCalled();
        });
    });

    describe("modes", () => {
        it("says nothing when neither feature is active", () => {
            const modal = make({webp: "off", webpQuality: 80, keepOriginal: false, historyEnabled: false});
            modal.initialize([{name: "a.png"}]);
            expect(modal.modalEl.querySelector(".progress-modes")).toBeNull();
        });

        it("announces conversion with its quality, and the history", () => {
            const modal = make(MODES_ON);
            modal.initialize([{name: "a.png"}]);

            const chips = modal.modalEl.querySelector(".progress-modes")?.textContent ?? "";
            expect(chips).toContain("WebP conversion on (quality 80)");
            expect(chips).toContain("Upload history on");
        });

        it("mentions that originals are kept", () => {
            const modal = make({...MODES_ON, keepOriginal: true});
            modal.initialize([{name: "a.png"}]);
            expect(text(modal)).toContain("originals kept");
        });

        // Otherwise a note that opted out looks identical to the feature being off.
        it("distinguishes a note that opted out from the feature being off", () => {
            const modal = make({...MODES_ON, webp: "skipped"});
            modal.initialize([{name: "a.png"}]);
            expect(text(modal)).toContain("skipped for this note");
        });
    });

    describe("size comparison", () => {
        it("labels the two segments and the original", () => {
            const modal = make(MODES_ON);
            modal.initialize([{name: "a.png"}, {name: "b.png"}]);
            modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 250, converted: true});
            modal.updateProgress("b.png", true, {originalSize: 3000, uploadedSize: 750, converted: true});

            const body = text(modal);
            expect(body).toContain("Converted 1000 B");
            expect(body).toContain("Saved 2.9 KB");
            expect(body).toContain("Original 3.9 KB (-75%)");
        });

        // The neutral fill covers what still gets uploaded, so the green left
        // showing is the saving. Filling green would mean the reverse.
        it("fills only the part that still gets uploaded", () => {
            const modal = make(MODES_ON);
            modal.initialize([{name: "a.png"}, {name: "b.png"}]);
            modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 250, converted: true});
            modal.updateProgress("b.png", true, {originalSize: 3000, uploadedSize: 750, converted: true});

            const fill = modal.modalEl.querySelector<HTMLElement>(".size-compare-fill");
            expect(fill?.style.width).toBe("25%");
        });

        it("is omitted when nothing was converted", () => {
            const modal = make(MODES_ON);
            modal.initialize([{name: "a.png"}]);
            modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 1000});

            expect(modal.modalEl.querySelector(".size-compare-track")).toBeNull();
        });

        // Nothing was converted on this run, so a percentage would be invented.
        it("excludes reused images from the total and counts them separately", () => {
            const modal = make(MODES_ON);
            modal.initialize([{name: "a.png"}, {name: "b.png"}]);
            modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 250, converted: true});
            modal.updateProgress("b.png", true, {originalSize: 9999, uploadedSize: 9999, reused: true});

            const body = text(modal);
            expect(body).toContain("1 from history");
            expect(body).toContain("Original 1000 B");
            expect(body).not.toContain("9.8 KB");
        });
    });

    describe("image rows", () => {
        it("shows the size change and a proportional bar for a converted image", () => {
            const modal = make(MODES_ON);
            modal.initialize([{name: "a.png"}, {name: "b.png"}]);
            modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 400, converted: true});

            expect(modal.modalEl.querySelector(".image-detail")?.textContent).toBe("1000 B → 400 B");
            const fill = modal.modalEl.querySelector<HTMLElement>(".row-bar-fill");
            expect(fill?.style.width).toBe("40%");
        });

        // With one image the comparison above the list already says this.
        it("drops the row result for a single converted image", () => {
            const modal = make(MODES_ON);
            modal.initialize([{name: "a.png"}]);
            modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 400, converted: true});

            expect(modal.modalEl.querySelector(".image-detail")).toBeNull();
            expect(modal.modalEl.querySelector(".row-bar")).toBeNull();
            // The name is still the row's reason for existing.
            expect(text(modal)).toContain("a.png");
        });

        it("shows only the size when nothing was converted", () => {
            const modal = make(MODES_ON);
            modal.initialize([{name: "a.png"}]);
            modal.updateProgress("a.png", true, {originalSize: 2048, uploadedSize: 2048});

            expect(modal.modalEl.querySelector(".image-detail")?.textContent).toBe("2 KB");
            expect(modal.modalEl.querySelector(".row-bar")).toBeNull();
        });

        it("marks a reused image without claiming a size change", () => {
            const modal = make(MODES_ON);
            modal.initialize([{name: "a.png"}]);
            modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 1000, reused: true});

            expect(modal.modalEl.querySelector(".image-detail")?.textContent).toBe("reused from history");
            expect(modal.modalEl.querySelector(".image-status-icon")?.classList.contains("reused")).toBe(true);
        });

        it("distinguishes failed, successful and pending rows", () => {
            const modal = make();
            modal.initialize([{name: "a.png"}, {name: "b.png"}, {name: "c.png"}]);
            modal.updateProgress("a.png", true);
            modal.updateProgress("b.png", false);

            const classes = Array.from(modal.modalEl.querySelectorAll(".image-status-icon"))
                .map(el => el.className);
            expect(classes.some(c => c.includes("success"))).toBe(true);
            expect(classes.some(c => c.includes("failed"))).toBe(true);
            expect(classes.some(c => c.includes("pending"))).toBe(true);
        });

        it("keeps the full name available when it is truncated", () => {
            const modal = make();
            const name = "Pasted image 20260824123708.png";
            modal.initialize([{name}]);
            expect(modal.modalEl.querySelector(".image-name")?.getAttribute("title")).toBe(name);
        });
    });
});
