import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import UploadProgressModal, {type UploadModes} from "../../src/ui/uploadProgressModal";

function makeModal(): UploadProgressModal {
    const app = {} as any;
    const m = new UploadProgressModal(app);
    return m;
}

describe("UploadProgressModal", () => {
    let modal: UploadProgressModal;

    beforeEach(() => {
        vi.useFakeTimers();
        modal = makeModal();
    });

    afterEach(() => {
        vi.useRealTimers();
        try { modal.close(); } catch { /* noop */ }
    });

    it("renders Complete + auto-close timer on full success", () => {
        modal.initialize([{name: "a.png"}, {name: "b.png"}]);
        modal.updateProgress("a.png", true);
        modal.updateProgress("b.png", true);

        const text = modal.modalEl.textContent ?? "";
        expect(text).toContain("Complete");
        expect(text).toContain("2/2 (100%)");
        expect(text).toContain("2 succeeded");
        expect(text).not.toContain("failed");

        // auto-close fires after 3s on full success
        const closeSpy = vi.spyOn(modal, "close");
        vi.advanceTimersByTime(3000);
        expect(closeSpy).toHaveBeenCalled();
    });

    it("renders Failed and does NOT auto-close when all uploads fail", () => {
        modal.initialize([{name: "a.png"}]);
        modal.updateProgress("a.png", false);

        const text = modal.modalEl.textContent ?? "";
        expect(text).toContain("Failed");
        expect(text).toContain("0 succeeded");
        expect(text).toContain("1 failed");

        const closeSpy = vi.spyOn(modal, "close");
        vi.advanceTimersByTime(10000);
        expect(closeSpy).not.toHaveBeenCalled();
    });

    it("renders 'Completed with errors' on partial failure and does NOT auto-close", () => {
        modal.initialize([{name: "ok.png"}, {name: "bad.png"}, {name: "alsobad.png"}]);
        modal.updateProgress("ok.png", true);
        modal.updateProgress("bad.png", false);
        modal.updateProgress("alsobad.png", false);

        const text = modal.modalEl.textContent ?? "";
        expect(text).toContain("Completed with errors");
        expect(text).toContain("2 failed");
        expect(text).toContain("1 succeeded");
        expect(text).toContain("2 failed");

        const closeSpy = vi.spyOn(modal, "close");
        vi.advanceTimersByTime(10000);
        expect(closeSpy).not.toHaveBeenCalled();
    });

    it("marks failed image icons distinctly from pending", () => {
        modal.initialize([{name: "ok.png"}, {name: "bad.png"}]);
        modal.updateProgress("ok.png", true);
        modal.updateProgress("bad.png", false);

        const icons = modal.modalEl.querySelectorAll(".image-status-icon");
        const classes = Array.from(icons).map(el => el.className);
        expect(classes.some(c => c.includes("success"))).toBe(true);
        expect(classes.some(c => c.includes("failed"))).toBe(true);
        // No icon should be left in `pending` after both images report
        expect(classes.some(c => c.includes("pending"))).toBe(false);
    });

    it("adds has-failures class to the progress bar when any upload fails", () => {
        modal.initialize([{name: "a.png"}, {name: "b.png"}]);
        modal.updateProgress("a.png", true);
        modal.updateProgress("b.png", false);

        const bar = modal.modalEl.querySelector(".progress-bar");
        expect(bar?.classList.contains("has-failures")).toBe(true);
    });
});

describe("UploadProgressModal — conversion and history reporting", () => {
    const modals: UploadProgressModal[] = [];

    function withModes(modes: UploadModes): UploadProgressModal {
        const m = new UploadProgressModal({} as any, modes);
        modals.push(m);
        return m;
    }

    beforeEach(() => vi.useFakeTimers());

    afterEach(() => {
        vi.useRealTimers();
        while (modals.length) {
            try { modals.pop()?.close(); } catch { /* noop */ }
        }
    });

    const ON: UploadModes = {webp: "on", webpQuality: 80, keepOriginal: false, historyEnabled: true};

    it("says nothing about modes when both features are off", () => {
        const modal = withModes({webp: "off", webpQuality: 80, keepOriginal: false, historyEnabled: false});
        modal.initialize([{name: "a.png"}]);
        expect(modal.modalEl.querySelector(".progress-modes")).toBeNull();
    });

    it("announces conversion with its quality and the history", () => {
        const modal = withModes(ON);
        modal.initialize([{name: "a.png"}]);

        const text = modal.modalEl.querySelector(".progress-modes")?.textContent ?? "";
        expect(text).toContain("WebP conversion on (quality 80)");
        expect(text).toContain("Upload history on");
    });

    it("mentions that the originals are kept", () => {
        const modal = withModes({...ON, keepOriginal: true});
        modal.initialize([{name: "a.png"}]);
        expect(modal.modalEl.textContent).toContain("originals kept");
    });

    // Otherwise a note that opted out looks identical to the feature being off.
    it("distinguishes a note that opted out from the feature being off", () => {
        const modal = withModes({...ON, webp: "skipped"});
        modal.initialize([{name: "a.png"}]);
        expect(modal.modalEl.textContent).toContain("skipped for this note");
    });

    it("shows the size change of a converted image", () => {
        const modal = withModes(ON);
        modal.initialize([{name: "a.png"}]);
        modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 280, converted: true});

        const row = modal.modalEl.querySelector(".image-detail")?.textContent ?? "";
        expect(row).toBe("1000 B → 280 B (-72%)");
    });

    it("shows only the size when the image was not converted", () => {
        const modal = withModes(ON);
        modal.initialize([{name: "a.png"}]);
        modal.updateProgress("a.png", true, {originalSize: 2048, uploadedSize: 2048});

        expect(modal.modalEl.querySelector(".image-detail")?.textContent).toBe("2 KB");
    });

    // A reused URL means nothing was converted this run, so claiming a size
    // change would be inventing a number.
    it("marks a reused image without claiming a size change", () => {
        const modal = withModes(ON);
        modal.initialize([{name: "a.png"}]);
        modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 1000, reused: true});

        expect(modal.modalEl.querySelector(".image-detail")?.textContent).toBe("reused from history");
        expect(modal.modalEl.querySelector(".image-status-icon")?.classList.contains("reused")).toBe(true);
    });

    it("totals only the converted images, and counts the reused ones separately", () => {
        const modal = withModes(ON);
        modal.initialize([{name: "a.png"}, {name: "b.png"}, {name: "c.png"}]);
        modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 250, converted: true});
        modal.updateProgress("b.png", true, {originalSize: 3000, uploadedSize: 750, converted: true});
        modal.updateProgress("c.png", true, {originalSize: 9999, uploadedSize: 9999, reused: true});

        const text = modal.modalEl.textContent ?? "";
        expect(text).toContain("1 from history");
        // 4000 → 1000, and the reused image is not folded into the total.
        expect(text).toContain("Converted: 3.9 KB → 1000 B (-75%)");
    });

    it("omits the size total when nothing was converted", () => {
        const modal = withModes({...ON, webp: "off"});
        modal.initialize([{name: "a.png"}]);
        modal.updateProgress("a.png", true, {originalSize: 1000, uploadedSize: 1000});

        expect(modal.modalEl.querySelector(".progress-size-summary")).toBeNull();
    });
});
