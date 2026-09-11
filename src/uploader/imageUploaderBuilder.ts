import {PublishSettings} from "../publish";
import ImageUploader from "./imageUploader";
import ImageStore from "../imageStore";
import {getProvider, requireProvider} from "../providers/registry";
import {UploaderUtils} from "./uploaderUtils";

/**
 * Whether the active store exposes a path template, which is what lets the
 * preserved originals go to a prefix of their own.
 */
export function storeSupportsPath(imageStore: string): boolean {
    return getProvider(ImageStore.normalizeId(imageStore))?.withPath !== undefined;
}

/**
 * A copy of `settings` whose active store writes to `path` instead of its
 * configured template. Building a second uploader from this is what lets the
 * originals go to their own prefix without changing the uploader interface,
 * which all ten implementations would otherwise have to follow.
 */
export function withPathTemplate(settings: PublishSettings, path: string): PublishSettings {
    const provider = getProvider(ImageStore.normalizeId(settings.imageStore));
    return provider?.withPath?.(settings, path) ?? settings;
}

/**
 * The identifying configuration of the current destination, for the upload
 * cache key. Credentials are deliberately excluded: the cache file is meant to
 * be safe to sync.
 */
export function destinationParts(settings: PublishSettings): (string | undefined)[] {
    const store = ImageStore.normalizeId(settings.imageStore);
    return [store, ...(getProvider(store)?.cacheKeyParts?.(settings) ?? [])];
}

/**
 * A copy of `settings` whose active store has {foldername} and {notename}
 * filled in from the note being published, or the same object when the
 * template uses neither.
 *
 * Returning the input unchanged is load-bearing: the caller uses identity to
 * decide whether an uploader built for the current settings is still correct
 * for this note, and rebuilding one per publish otherwise would throw away the
 * instance the plugin already holds.
 */
export function withNoteVariables(settings: PublishSettings, notePath: string): PublishSettings {
    const provider = getProvider(ImageStore.normalizeId(settings.imageStore));
    const template = provider?.getPath?.(settings);
    if (!provider?.withPath || !template) {
        return settings;
    }
    const expanded = UploaderUtils.expandNoteVariables(template, notePath);
    return expanded === template ? settings : provider.withPath(settings, expanded);
}

export default function buildUploader(settings: PublishSettings): ImageUploader {
    return requireProvider(ImageStore.normalizeId(settings.imageStore)).build(settings);
}
