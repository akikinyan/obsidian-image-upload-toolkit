import {Setting} from "obsidian";
import type ObsidianPublish from "../../publish";
import ImageStore from "../../imageStore";
import type {ProviderDescriptor} from "../../providers/types";
import {i18n} from "../../i18n";
import R2Uploader from "./r2Uploader";
import {drawTargetPath} from "../../ui/settingFields";

function drawSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.r2.accessKeyId.name)
        .setDesc(t.r2.accessKeyId.desc)
        .addText(text => text
            .setPlaceholder(t.r2.accessKeyId.placeholder)
            .setValue(plugin.settings.r2Setting?.accessKeyId || '')
            .onChange(value => plugin.settings.r2Setting.accessKeyId = value
            ));

    new Setting(parentEl)
        .setName(t.r2.secretAccessKey.name)
        .setDesc(t.r2.secretAccessKey.desc)
        .addText(text => text
            .setPlaceholder(t.r2.secretAccessKey.placeholder)
            .setValue(plugin.settings.r2Setting?.secretAccessKey || '')
            .onChange(value => plugin.settings.r2Setting.secretAccessKey = value));

    new Setting(parentEl)
        .setName(t.r2.endpoint.name)
        .setDesc(t.r2.endpoint.desc)
        .addText(text => text
            .setPlaceholder(t.r2.endpoint.placeholder)
            .setValue(plugin.settings.r2Setting?.endpoint || '')
            .onChange(value => plugin.settings.r2Setting.endpoint = value));

    new Setting(parentEl)
        .setName(t.r2.bucketName.name)
        .setDesc(t.r2.bucketName.desc)
        .addText(text => text
            .setPlaceholder(t.r2.bucketName.placeholder)
            .setValue(plugin.settings.r2Setting?.bucketName || '')
            .onChange(value => plugin.settings.r2Setting.bucketName = value));

    drawTargetPath(parentEl,
        () => plugin.settings.r2Setting.path,
        value => plugin.settings.r2Setting.path = value)

    new Setting(parentEl)
        .setName(t.r2.customDomain.name)
        .setDesc(t.r2.customDomain.desc)
        .addText(text =>
            text
                .setPlaceholder(t.r2.customDomain.placeholder)
                .setValue(plugin.settings.r2Setting.customDomainName)
                .onChange(value => plugin.settings.r2Setting.customDomainName = value));
}

export const CLOUDFLARE_R2_PROVIDER: ProviderDescriptor = {
    store: ImageStore.CLOUDFLARE_R2,
    build: settings => new R2Uploader(settings.r2Setting, settings.proxySetting),
    isHosted: (url, settings) => {
        const hostname = new URL(url).hostname;
        if (settings.r2Setting?.customDomainName) {
            return hostname.includes(settings.r2Setting.customDomainName);
        }
        return hostname.includes("r2.dev") || hostname.includes("r2.cloudflarestorage.com");
    },
    withPath: (settings, path) => ({...settings, r2Setting: {...settings.r2Setting, path}}),
    cacheKeyParts: settings => [settings.r2Setting?.bucketName, settings.r2Setting?.endpoint, settings.r2Setting?.customDomainName],
    drawSettings,
};
