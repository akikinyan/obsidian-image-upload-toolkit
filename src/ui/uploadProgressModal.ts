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

export default class UploadProgressModal extends Modal {
    private totalImages: number = 0;
    private completedImages: number = 0;
    private successCount: number = 0;
    private failureCount: number = 0;
    private reusedCount: number = 0;
    private convertedCount: number = 0;
    private convertedFromBytes: number = 0;
    private convertedToBytes: number = 0;
    private progressBarEl: HTMLElement;
    private progressTextEl: HTMLElement;
    private summaryEl: HTMLElement | null = null;
    private sizeSummaryEl: HTMLElement | null = null;
    private imageListEl: HTMLElement;
    private statusEl: HTMLElement;
    private imageStatus: Map<string, UploadStatus> = new Map();
    private imageDetails: Map<string, UploadDetail> = new Map();
    private autoCloseTimer: number | null = null;
    private readonly modes: UploadModes | null;

    constructor(app: App, modes: UploadModes | null = null) {
        super(app);
        this.modes = modes;
        this.titleEl.setText(i18n().modal.title);
    }

    onClose(): void {
        if (this.autoCloseTimer !== null) {
            activeWindow.clearTimeout(this.autoCloseTimer);
            this.autoCloseTimer = null;
        }
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
            // Initialize image status map
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

        // Main content container
        const contentEl = this.contentEl.createDiv({cls: "upload-progress-content"});

        // Progress section
        const progressSection = contentEl.createDiv({cls: "progress-section"});

        // Status indicator (uploading/complete)
        this.statusEl = progressSection.createDiv({cls: "status-indicator"});
        const statusIconContainer = this.statusEl.createSpan({cls: "status-icon"});
        setIcon(statusIconContainer, "upload-cloud");
        this.statusEl.createSpan({text: i18n().modal.uploading, cls: "status-text"});

        this.renderModes(progressSection);

        // Progress bar container
        const progressBarContainer = progressSection.createDiv({cls: "progress-bar-container"});
        this.progressBarEl = progressBarContainer.createDiv({cls: "progress-bar"});

        // Progress text (e.g., "3/10 (30%)")
        this.progressTextEl = progressSection.createDiv({cls: "progress-text"});
        this.updateProgressText();

        // Image list (if we have image names)
        if (this.imageStatus.size > 0) {
            const imageListContainer = contentEl.createDiv({cls: "image-list-container"});
            imageListContainer.createDiv({cls: "image-list-heading", text: i18n().modal.images});
            this.imageListEl = imageListContainer.createDiv({cls: "image-list"});
            this.renderImageList();
        }
    }

    /**
     * Announce the settings that change what this run does, so the numbers below
     * are readable without opening the settings tab.
     */
    private renderModes(parentEl: HTMLElement): void {
        if (!this.modes) return;
        const t = i18n();
        const labels: string[] = [];
        if (this.modes.webp === "on") {
            labels.push(this.modes.keepOriginal
                ? t.modal.modeWebpKeepOriginal(this.modes.webpQuality)
                : t.modal.modeWebp(this.modes.webpQuality));
        } else if (this.modes.webp === "skipped") {
            labels.push(t.modal.modeWebpSkipped);
        }
        if (this.modes.historyEnabled) {
            labels.push(t.modal.modeHistory);
        }
        if (labels.length === 0) return;
        parentEl.createDiv({cls: "progress-modes", text: labels.join(" · ")});
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

        // Update progress bar
        const percent = this.totalImages > 0 ? (this.completedImages / this.totalImages) * 100 : 0;
        this.progressBarEl.style.width = `${percent}%`;
        if (this.failureCount > 0) {
            this.progressBarEl.classList.add("has-failures");
        }

        // Update progress text
        this.updateProgressText();

        // Update image list if we have it
        if (this.imageListEl && imageName) {
            this.renderImageList();
        }

        // If complete, update the status indicator
        if (this.completedImages >= this.totalImages) {
            this.statusEl.empty();
            const statusIconContainer = this.statusEl.createSpan({cls: "status-icon"});
            const T = i18n();
            if (this.failureCount === 0) {
                setIcon(statusIconContainer, "check");
                this.statusEl.createSpan({text: T.modal.complete, cls: "status-text"});
                this.statusEl.classList.remove("has-failures");
                // Auto-close after 3 seconds only on full success
                this.autoCloseTimer = activeWindow.setTimeout(() => {
                    this.autoCloseTimer = null;
                    this.close();
                }, 3000);
            } else if (this.successCount === 0) {
                setIcon(statusIconContainer, "x-circle");
                this.statusEl.createSpan({text: T.modal.failed, cls: "status-text"});
                this.statusEl.classList.add("has-failures");
            } else {
                setIcon(statusIconContainer, "alert-triangle");
                this.statusEl.createSpan({
                    text: T.modal.completedWithErrors(this.failureCount),
                    cls: "status-text",
                });
                this.statusEl.classList.add("has-failures");
            }
            this.renderSummary();
        }
    }

    /**
     * Update the progress text display
     */
    private updateProgressText(): void {
        const percent = this.totalImages > 0 ? Math.round((this.completedImages / this.totalImages) * 100) : 0;
        this.progressTextEl.setText(`${this.completedImages}/${this.totalImages} (${percent}%)`);
    }

    /**
     * Render or refresh the success/failure summary line shown once the run finishes.
     */
    private renderSummary(): void {
        if (!this.summaryEl) {
            this.summaryEl = this.progressTextEl.parentElement?.createDiv({cls: "progress-summary"}) ?? null;
        }
        if (!this.summaryEl) return;
        const T = i18n();
        this.summaryEl.empty();
        const okSpan = this.summaryEl.createSpan({cls: "summary-success"});
        okSpan.setText(T.modal.succeeded(this.successCount));
        if (this.failureCount > 0) {
            this.summaryEl.createSpan({text: " · ", cls: "summary-sep"});
            const failSpan = this.summaryEl.createSpan({cls: "summary-failed"});
            failSpan.setText(T.modal.failedCount(this.failureCount));
        }
        if (this.reusedCount > 0) {
            this.summaryEl.createSpan({text: " · ", cls: "summary-sep"});
            this.summaryEl.createSpan({
                text: T.modal.reusedCount(this.reusedCount),
                cls: "summary-reused",
            });
        }
        this.renderSizeSummary();
    }

    /** Total bytes saved by conversion, shown only when anything was converted. */
    private renderSizeSummary(): void {
        if (this.convertedCount === 0) return;
        if (!this.sizeSummaryEl) {
            this.sizeSummaryEl = this.summaryEl?.parentElement?.createDiv({cls: "progress-size-summary"}) ?? null;
        }
        if (!this.sizeSummaryEl) return;
        this.sizeSummaryEl.setText(i18n().modal.totalSize(
            formatBytes(this.convertedFromBytes),
            formatBytes(this.convertedToBytes),
            formatSizeDelta(this.convertedFromBytes, this.convertedToBytes),
        ));
    }

    /**
     * Render the list of images with their status
     */
    private renderImageList(): void {
        if (!this.imageListEl) return;

        this.imageListEl.empty();

        for (const [name, status] of this.imageStatus.entries()) {
            const itemEl = this.imageListEl.createDiv({cls: "image-item"});
            const detail = this.imageDetails.get(name);

            // Status icon
            const iconContainer = itemEl.createSpan({cls: "image-status-icon"});
            if (status === "success") {
                setIcon(iconContainer, detail?.reused ? "history" : "check-circle");
                iconContainer.classList.add(detail?.reused ? "reused" : "success");
            } else if (status === "failed") {
                setIcon(iconContainer, "x-circle");
                iconContainer.classList.add("failed");
            } else {
                setIcon(iconContainer, "circle");
                iconContainer.classList.add("pending");
            }

            // Image name
            itemEl.createSpan({text: name, cls: "image-name"});

            const note = this.detailText(detail, status);
            if (note) {
                itemEl.createSpan({text: note, cls: "image-detail"});
            }
        }
    }

    /** The trailing note on a list row: what happened to this particular image. */
    private detailText(detail: UploadDetail | undefined, status: UploadStatus): string {
        if (!detail || status !== "success") return "";
        const T = i18n();
        if (detail.reused) return T.modal.reused;
        if (detail.converted && detail.originalSize && detail.uploadedSize) {
            return T.modal.sizeConverted(
                formatBytes(detail.originalSize),
                formatBytes(detail.uploadedSize),
                formatSizeDelta(detail.originalSize, detail.uploadedSize),
            );
        }
        if (detail.uploadedSize) return formatBytes(detail.uploadedSize);
        return "";
    }
}
