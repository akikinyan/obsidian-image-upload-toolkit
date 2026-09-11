import {Setting} from "obsidian";
import type ObsidianPublish from "../../publish";
import ImageStore from "../../imageStore";
import type {ProviderDescriptor} from "../../providers/types";
import {i18n} from "../../i18n";
import B2Uploader from "./b2Uploader";
import {drawTargetPath} from "../../ui/settingFields";

function drawSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.b2.accessKeyId.name)
        .setDesc(t.b2.accessKeyId.desc)
        .addText(text => text
            .setPlaceholder(t.b2.accessKeyId.placeholder)
            .setValue(plugin.settings.b2Setting?.accessKeyId || '')
            .onChange(value => plugin.settings.b2Setting.accessKeyId = value
            ));

    new Setting(parentEl)
        .setName(t.b2.secretAccessKey.name)
        .setDesc(t.b2.secretAccessKey.desc)
        .addText(text => text
            .setPlaceholder(t.b2.secretAccessKey.placeholder)
            .setValue(plugin.settings.b2Setting?.secretAccessKey || '')
            .onChange(value => plugin.settings.b2Setting.secretAccessKey = value));

    new Setting(parentEl)
        .setName(t.b2.region.name)
        .setDesc(t.b2.region.desc)
        .addText(text => text
            .setPlaceholder(t.b2.region.placeholder)
            .setValue(plugin.settings.b2Setting?.region || '')
            .onChange(value => plugin.settings.b2Setting.region = value));

    new Setting(parentEl)
        .setName(t.b2.bucketName.name)
        .setDesc(t.b2.bucketName.desc)
        .addText(text => text
            .setPlaceholder(t.b2.bucketName.placeholder)
            .setValue(plugin.settings.b2Setting?.bucketName || '')
            .onChange(value => plugin.settings.b2Setting.bucketName = value));

    drawTargetPath(parentEl,
        () => plugin.settings.b2Setting.path,
        value => plugin.settings.b2Setting.path = value)

    new Setting(parentEl)
        .setName(t.b2.customDomain.name)
        .setDesc(t.b2.customDomain.desc)
        .addText(text =>
            text
                .setPlaceholder(t.b2.customDomain.placeholder)
                .setValue(plugin.settings.b2Setting.customDomainName)
                .onChange(value => plugin.settings.b2Setting.customDomainName = value));
}

export const BACKBLAZE_B2_PROVIDER: ProviderDescriptor = {
    store: ImageStore.BACKBLAZE_B2,
    build: settings => new B2Uploader(settings.b2Setting, settings.proxySetting),
    isHosted: (url, settings) => {
        const hostname = new URL(url).hostname;
        if (settings.b2Setting?.customDomainName) {
            return hostname.includes(settings.b2Setting.customDomainName);
        }
        return hostname.includes("backblazeb2.com");
    },
    withPath: (settings, path) => ({...settings, b2Setting: {...settings.b2Setting, path}}),
    getPath: settings => settings.b2Setting?.path ?? "",
    cacheKeyParts: settings => [settings.b2Setting?.bucketName, settings.b2Setting?.region, settings.b2Setting?.customDomainName],
    drawSettings,
};
