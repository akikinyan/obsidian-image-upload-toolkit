import {Setting} from "obsidian";
import type ObsidianPublish from "../../publish";
import ImageStore from "../../imageStore";
import type {ProviderDescriptor} from "../../providers/types";
import {i18n} from "../../i18n";
import ImagekitUploader from "./imagekitUploader";
import {linkDescription} from "../../ui/settingFields";

function drawSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.imagekit.id.name)
        .setDesc(linkDescription(t.imagekit.descPrefix, "https://imagekit.io/dashboard/developer/api-keys"))
        .addText(text =>
            text
                .setPlaceholder(t.imagekit.id.placeholder)
                .setValue(plugin.settings.imagekitSetting.imagekitID)
                .onChange(value => {
                    plugin.settings.imagekitSetting.imagekitID = value
                    plugin.settings.imagekitSetting.endpoint = `https://ik.imagekit.io/${value}/`
                }))

    new Setting(parentEl)
        .setName(t.imagekit.folder.name)
        .setDesc(t.imagekit.folder.desc)
        .addText(text =>
            text
                .setPlaceholder(t.imagekit.folder.placeholder)
                .setValue(plugin.settings.imagekitSetting.folder)
                .onChange(value => plugin.settings.imagekitSetting.folder = value))

    new Setting(parentEl)
        .setName(t.imagekit.publicKey.name)
        .addText(text =>
            text
                .setPlaceholder(t.imagekit.publicKey.placeholder)
                .setValue(plugin.settings.imagekitSetting.publicKey)
                .onChange(value => plugin.settings.imagekitSetting.publicKey = value))

    new Setting(parentEl)
        .setName(t.imagekit.privateKey.name)
        .addText(text =>
            text
                .setPlaceholder(t.imagekit.privateKey.placeholder)
                .setValue(plugin.settings.imagekitSetting.privateKey)
                .onChange(value => plugin.settings.imagekitSetting.privateKey = value))
}

export const IMAGEKIT_PROVIDER: ProviderDescriptor = {
    store: ImageStore.ImageKit,
    build: settings => new ImagekitUploader(settings.imagekitSetting),
    isHosted: url => new URL(url).hostname.includes("imagekit.io"),
    cacheKeyParts: settings => [settings.imagekitSetting?.imagekitID, settings.imagekitSetting?.folder],
    drawSettings,
};
