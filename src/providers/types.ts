import type ObsidianPublish from "../publish";
import type ImageStore from "../imageStore";
import type ImageUploader from "../uploader/imageUploader";

/**
 * Single registration point for a storage provider: its ImageStore entry,
 * uploader construction, hosted-URL detection and settings UI all live in
 * one descriptor instead of being spread across parallel switches.
 */
export interface ProviderDescriptor {
    store: ImageStore;
    /** Build the uploader for this provider from the current settings. */
    build: (settings: ObsidianPublish["settings"]) => ImageUploader;
    /** Whether the URL already points at this provider (skips re-upload). */
    isHosted: (url: string, settings: ObsidianPublish["settings"]) => boolean;
    /** Render the provider-specific section of the settings tab. */
    drawSettings: (parentEl: HTMLElement, plugin: ObsidianPublish) => void;

    // ── Beyond upstream's descriptor, for this fork's WebP archiving and
    // upload cache. Both are optional so a descriptor written against
    // upstream's shape stays valid here.

    /**
     * A copy of `settings` whose store writes to `path` instead of its
     * configured template, for sending the preserved originals somewhere of
     * their own. Absent for the stores that decide the remote key themselves,
     * where the WebP and the original land side by side — harmless, because
     * their extensions differ.
     */
    withPath?: (settings: ObsidianPublish["settings"], path: string) => ObsidianPublish["settings"];

    /**
     * What identifies this destination beyond the store id, for the upload
     * cache key: change any of it and the same bytes belong at a new URL.
     * Credentials are deliberately excluded, since the cache file is meant to
     * be safe to sync. The path template is excluded too, because URLs
     * already handed out stay valid.
     */
    cacheKeyParts?: (settings: ObsidianPublish["settings"]) => (string | undefined)[];
}
