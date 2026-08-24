import {App, Modal, setIcon} from "obsidian";
import {i18n} from "../i18n";
import {formatBytes, formatSizeDelta} from "../format";

interface NamedImage {
    name?: string;
}

type UploadStatus = "pending" | "success" | "failed";

/** What the modal announces about how this run is configured. */
export interface UploadModes {
    /**
     * "on" when this note will be converted, "skipped" when the feature is on
     * but this note opted out through its frontmatter, "off" otherwise. The
     * middle case is worth showing: otherwise a note that quietly skips
     * conversion looks identical to the feature being disabled.
     */
    webp: "off" | "on" | "skipped";
    webpQuality: number;
    keepOriginal: boolean;
    historyEnabled: boolean;
}

/** Per-image outcome, used to show what conversion and the history actually did. */
export interface UploadDetail {
    /** Size of the file on disk. */
    originalSize?: number;
    /** Size of what was sent; equals originalSize when nothing was converted. */
    uploadedSize?: number;
    converted?: boolean;
    /** The URL came from the upload history, so nothing was sent. */
    reused?: boolean;
}

/** How long the modal lingers on a fully successful run before closing itself. */
const AUTO_CLOSE_MS = 5000;

export default class UploadProgressModal extends Modal {
    private totalImages = 0;
    private completedImages = 0;
    private successCount = 0;
    private failureCount = 0;
    private reusedCount = 0;
    private convertedCount = 0;
    private convertedFromBytes = 0;
    private convertedToBytes = 0;

    private bodyEl: HTMLElement;
    private imageListEl: HTMLElement | null = null;
    private progressBarEl: HTMLElement | null = null;
    private progressTextEl: HTMLElement | null = null;
    private statusIconEl: HTMLElement;
    private statusTextEl: HTMLElement;
    private autoCloseBarEl: HTMLElement | null = null;

    private imageStatus: Map<string, UploadStatus> = new Map();
    private imageDetails: Map<string, UploadDetail> = new Map();

    /**
     * The body shows a progress bar while work is in flight and a size
     * comparison once it is done. They answer different questions, so the two
     * are separate layouts rather than one layout that goes stale.
     */
    private phase: "uploading" | "done" = "uploading";

    private autoCloseTimer: number | null = null;
    /** Milliseconds left when the countdown was paused by a hover. */
    private autoCloseRemaining = 0;
    private autoCloseDeadline = 0;
    private readonly modes: UploadModes | null;

    constructor(app: App, modes: UploadModes | null = null) {
        super(app);
        this.modes = modes;
        this.titleEl.setText(i18n().modal.title);
    }

    onClose(): void {
        this.cancelAutoClose();
        super.onClose?.();
    }

    /**
     * Initialize the modal with the total number of images to upload
     * @param images Array of image objects or total count of images
     */
    public initialize(images: NamedImage[] | number): void {
        if (typeof images === 'number') {
            this.totalImages = images;
        } else {
            this.totalImages = images.length;
            images.forEach(img => {
                if (img.name) {
                    this.imageStatus.set(img.name, "pending");
                }
            });
        }

        this.completedImages = 0;
        this.successCount = 0;
        this.failureCount = 0;
        this.modalEl.classList.add("upload-progress-modal");

        const content = this.contentEl.createDiv({cls: "upload-progress-content"});

        // Header: status on the left, active modes on the right.
        const header = content.createDiv({cls: "progress-header"});
        this.statusIconEl = header.createSpan({cls: "status-icon"});
        setIcon(this.statusIconEl, "upload-cloud");
        this.statusTextEl = header.createSpan({text: i18n().modal.uploading, cls: "status-text"});
        this.renderModes(header);

        this.bodyEl = content.createDiv({cls: "progress-body"});
        this.renderBody();

        if (this.imageStatus.size > 0) {
            this.imageListEl = content.createDiv({cls: "image-list"});
            this.renderImageList();
        }
    }

    /** Chips for the settings that change what this run does. */
    private renderModes(parentEl: HTMLElement): void {
        if (!this.modes) return;
        const t = i18n();
        const chips: {icon: string; text: string}[] = [];
        if (this.modes.webp === "on") {
            chips.push({
                icon: "image",
                text: this.modes.keepOriginal
                    ? t.modal.modeWebpKeepOriginal(this.modes.webpQuality)
                    : t.modal.modeWebp(this.modes.webpQuality),
            });
        } else if (this.modes.webp === "skipped") {
            chips.push({icon: "image-off", text: t.modal.modeWebpSkipped});
        }
        if (this.modes.historyEnabled) {
            chips.push({icon: "history", text: t.modal.modeHistory});
        }
        if (chips.length === 0) return;

        const holder = parentEl.createDiv({cls: "progress-modes"});
        for (const chip of chips) {
            const el = holder.createSpan({cls: "progress-chip"});
            setIcon(el.createSpan({cls: "chip-icon"}), chip.icon);
            el.createSpan({text: chip.text});
        }
    }

    private renderBody(): void {
        this.bodyEl.empty();
        this.progressBarEl = null;
        this.progressTextEl = null;

        if (this.phase === "uploading") {
            const track = this.bodyEl.createDiv({cls: "progress-bar-container"});
            this.progressBarEl = track.createDiv({cls: "progress-bar"});
            this.progressTextEl = this.bodyEl.createDiv({cls: "progress-text"});
            this.updateProgressText();
            return;
        }

        this.renderSizeComparison();
        this.renderCounts();
    }

    /**
     * The size comparison replaces the progress bar once the run is over. A bar
     * that reads 100% says nothing; the same strip showing converted against
     * original says exactly what the feature achieved.
     */
    private renderSizeComparison(): void {
        if (this.convertedCount === 0 || this.convertedFromBytes <= 0) return;
        const t = i18n();
        const saved = Math.max(0, this.convertedFromBytes - this.convertedToBytes);

        // The two labels name the two segments of the bar below them.
        const labels = this.bodyEl.createDiv({cls: "size-compare-labels"});
        labels.createSpan({text: t.modal.compareConverted(formatBytes(this.convertedToBytes))});
        labels.createSpan({
            text: t.modal.compareSaved(formatBytes(saved)),
            cls: "size-compare-saved-label",
        });

        // The track is the original size. Its left part, in a neutral tone, is
        // what still gets uploaded; the green remainder is what was saved.
        // Colouring the uploaded part green would read as "more green is
        // better" while meaning the opposite.
        const track = this.bodyEl.createDiv({cls: "size-compare-track"});
        const ratio = Math.max(0, Math.min(1, this.convertedToBytes / this.convertedFromBytes));
        track.createDiv({cls: "size-compare-fill"}).style.width = `${ratio * 100}%`;

        this.bodyEl.createDiv({
            cls: "size-compare-origin",
            text: t.modal.compareOriginal(
                formatBytes(this.convertedFromBytes),
                formatSizeDelta(this.convertedFromBytes, this.convertedToBytes),
            ),
        });
    }

    /**
     * One line of counts, and only when it adds something. A lone success
     * repeats what the header already says.
     */
    private renderCounts(): void {
        if (this.successCount <= 1 && this.failureCount === 0 && this.reusedCount === 0) return;
        const t = i18n();
        const counts = this.bodyEl.createDiv({cls: "progress-counts"});
        counts.createSpan({text: t.modal.succeeded(this.successCount), cls: "count-success"});
        if (this.reusedCount > 0) {
            counts.createSpan({text: " · ", cls: "count-sep"});
            counts.createSpan({text: t.modal.reusedCount(this.reusedCount), cls: "count-reused"});
        }
        if (this.failureCount > 0) {
            counts.createSpan({text: " · ", cls: "count-sep"});
            counts.createSpan({text: t.modal.failedCount(this.failureCount), cls: "count-failed"});
        }
    }

    /**
     * Update progress for a specific image or increment the overall progress
     * @param imageName Optional image name
     * @param success Whether the upload was successful
     * @param detail What conversion and the upload history did for this image
     */
    public updateProgress(imageName?: string, success: boolean = true, detail?: UploadDetail): void {
        if (imageName && this.imageStatus.has(imageName)) {
            this.imageStatus.set(imageName, success ? "success" : "failed");
        }
        if (imageName && detail) {
            this.imageDetails.set(imageName, detail);
        }

        if (detail?.reused) {
            this.reusedCount++;
        }
        if (detail?.converted && detail.originalSize && detail.uploadedSize) {
            this.convertedCount++;
            this.convertedFromBytes += detail.originalSize;
            this.convertedToBytes += detail.uploadedSize;
        }

        this.completedImages++;
        if (success) {
            this.successCount++;
        } else {
            this.failureCount++;
        }

        if (this.progressBarEl) {
            const percent = this.totalImages > 0 ? (this.completedImages / this.totalImages) * 100 : 0;
            this.progressBarEl.style.width = `${percent}%`;
            if (this.failureCount > 0) {
                this.progressBarEl.classList.add("has-failures");
            }
        }
        this.updateProgressText();

        if (this.imageListEl && imageName) {
            this.renderImageList();
        }

        if (this.completedImages >= this.totalImages && this.phase === "uploading") {
            this.phase = "done";
            this.renderStatus();
            this.renderBody();
            if (this.failureCount === 0) {
                this.startAutoClose();
            }
        }
    }

    /**
     * Swap the header for the terminal state, title included: leaving the title
     * on "Uploading images" contradicts a body that says the run has finished.
     */
    private renderStatus(): void {
        const t = i18n();
        this.statusIconEl.empty();
        this.statusTextEl.classList.remove("has-failures");
        if (this.failureCount === 0) {
            setIcon(this.statusIconEl, "check");
            this.statusTextEl.setText(t.modal.complete);
            this.titleEl.setText(t.modal.titleComplete);
        } else if (this.successCount === 0) {
            setIcon(this.statusIconEl, "x-circle");
            this.statusTextEl.setText(t.modal.failed);
            this.statusTextEl.classList.add("has-failures");
            this.titleEl.setText(t.modal.titleFailed);
        } else {
            setIcon(this.statusIconEl, "alert-triangle");
            this.statusTextEl.setText(t.modal.completedWithErrors(this.failureCount));
            this.statusTextEl.classList.add("has-failures");
            this.titleEl.setText(t.modal.titlePartial);
        }
    }

    private updateProgressText(): void {
        if (!this.progressTextEl) return;
        const percent = this.totalImages > 0 ? Math.round((this.completedImages / this.totalImages) * 100) : 0;
        this.progressTextEl.setText(`${this.completedImages}/${this.totalImages} (${percent}%)`);
    }

    private renderImageList(): void {
        if (!this.imageListEl) return;
        this.imageListEl.empty();

        for (const [name, status] of this.imageStatus.entries()) {
            const itemEl = this.imageListEl.createDiv({cls: "image-item"});
            const detail = this.imageDetails.get(name);

            const iconContainer = itemEl.createSpan({cls: "image-status-icon"});
            if (status === "success" && detail?.reused) {
                setIcon(iconContainer, "history");
                iconContainer.classList.add("reused");
            } else if (status === "success") {
                setIcon(iconContainer, "check");
                iconContainer.classList.add("success");
            } else if (status === "failed") {
                setIcon(iconContainer, "x");
                iconContainer.classList.add("failed");
            } else {
                setIcon(iconContainer, "circle");
                iconContainer.classList.add("pending");
            }

            itemEl.createSpan({text: name, cls: "image-name", attr: {title: name}});
            this.renderRowResult(itemEl, detail, status);
        }
    }

    /**
     * The right-hand column of a list row. A converted image gets a miniature
     * of the comparison bar, so a long list shows at a glance which files
     * actually compressed.
     */
    private renderRowResult(itemEl: HTMLElement, detail: UploadDetail | undefined, status: UploadStatus): void {
        if (!detail || status !== "success") return;
        const t = i18n();

        if (detail.reused) {
            itemEl.createSpan({text: t.modal.reused, cls: "image-detail muted"});
            return;
        }

        if (detail.converted && detail.originalSize && detail.uploadedSize) {
            // With a single image the comparison above the list already says
            // this, in a more readable form. Repeating it in the row was the
            // duplication this redesign set out to remove.
            if (this.totalImages === 1) return;
            const ratio = Math.max(0, Math.min(1, detail.uploadedSize / detail.originalSize));
            const bar = itemEl.createSpan({cls: "row-bar"});
            bar.createSpan({cls: "row-bar-fill"}).style.width = `${ratio * 100}%`;
            itemEl.createSpan({
                text: t.modal.sizeConverted(
                    formatBytes(detail.originalSize),
                    formatBytes(detail.uploadedSize),
                ),
                cls: "image-detail",
            });
            return;
        }

        if (detail.uploadedSize) {
            itemEl.createSpan({text: formatBytes(detail.uploadedSize), cls: "image-detail muted"});
        }
    }

    /**
     * Close on a clean run, but give the result time to be read, and stop the
     * clock while the pointer is over the modal — someone reading the numbers
     * should not have them yanked away.
     */
    private startAutoClose(): void {
        const bar = this.contentEl.createDiv({cls: "auto-close-bar"});
        this.autoCloseBarEl = bar;
        // The widths live in CSS classes and the duration in a custom property,
        // so the countdown stays themeable and nothing is written to .style.
        bar.setCssProps({"--iut-autoclose-duration": `${AUTO_CLOSE_MS}ms`});
        activeWindow.requestAnimationFrame(() => bar.classList.add("is-running"));

        this.scheduleClose(AUTO_CLOSE_MS);

        this.modalEl.addEventListener("mouseenter", () => this.pauseAutoClose());
        this.modalEl.addEventListener("mouseleave", () => this.resumeAutoClose());
    }

    private scheduleClose(ms: number): void {
        this.autoCloseRemaining = ms;
        this.autoCloseDeadline = Date.now() + ms;
        this.autoCloseTimer = activeWindow.setTimeout(() => {
            this.autoCloseTimer = null;
            this.close();
        }, ms);
    }

    private pauseAutoClose(): void {
        if (this.autoCloseTimer === null) return;
        activeWindow.clearTimeout(this.autoCloseTimer);
        this.autoCloseTimer = null;
        // Freeze what is left now: the deadline keeps sliding into the past
        // while paused, so it cannot be the source of truth on resume.
        this.autoCloseRemaining = Math.max(0, this.autoCloseDeadline - Date.now());
        const bar = this.autoCloseBarEl;
        if (bar) {
            // Capture the width the animation reached before freezing it,
            // otherwise the bar snaps back to full.
            bar.setCssProps({"--iut-autoclose-width": activeWindow.getComputedStyle(bar).width});
            bar.classList.add("is-paused");
        }
    }

    private resumeAutoClose(): void {
        if (this.autoCloseTimer !== null || this.autoCloseRemaining <= 0) return;
        const remaining = this.autoCloseRemaining;
        const bar = this.autoCloseBarEl;
        if (bar) {
            bar.setCssProps({"--iut-autoclose-duration": `${remaining}ms`});
            activeWindow.requestAnimationFrame(() => bar.classList.remove("is-paused"));
        }
        this.scheduleClose(remaining);
    }

    private cancelAutoClose(): void {
        if (this.autoCloseTimer !== null) {
            activeWindow.clearTimeout(this.autoCloseTimer);
            this.autoCloseTimer = null;
        }
        this.autoCloseRemaining = 0;
        this.autoCloseDeadline = 0;
    }
}
