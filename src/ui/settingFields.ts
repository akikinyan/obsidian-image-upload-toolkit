import {Setting} from "obsidian";
import {i18n} from "../i18n";

/**
 * The settings fields several providers share. These were private methods on
 * the settings tab until each provider's UI moved into its own descriptor;
 * they never needed the tab itself, only the element to draw into and the
 * accessors for the field being edited.
 */

/** Shared renderer for the "target path" field every object store has. */
export function drawTargetPath(parentEl: HTMLElement, get: () => string, set: (value: string) => void): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.common.targetPath.name)
        .setDesc(t.common.targetPath.desc)
        .addText(text =>
            text
                .setPlaceholder(t.common.targetPath.placeholder)
                .setValue(get())
                .onChange(set))
}

/** Shared renderer for the "custom domain name" field. */
export function drawCustomDomain(parentEl: HTMLElement, get: () => string, set: (value: string) => void): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.common.customDomain.name)
        .setDesc(t.common.customDomain.desc)
        .addText(text =>
            text
                .setPlaceholder(t.common.customDomain.placeholder)
                .setValue(get())
                .onChange(set))
}

/** Shared renderer for the "bucket name" field. */
export function drawBucketName(parentEl: HTMLElement, get: () => string, set: (value: string) => void): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.common.bucketName.name)
        .setDesc(t.common.bucketName.desc)
        .addText(text =>
            text
                .setPlaceholder(t.common.bucketName.placeholder)
                .setValue(get())
                .onChange(set))
}

/** Description that ends in a clickable URL. */
export function linkDescription(prefix: string, url: string): DocumentFragment {
    return createFragment(frag => {
        frag.append(prefix);
        frag.createEl("a", { text: url, href: url });
    });
}
