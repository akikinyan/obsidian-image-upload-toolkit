import {Setting} from "obsidian";
import type ObsidianPublish from "../../publish";
import ImageStore from "../../imageStore";
import type {ProviderDescriptor} from "../../providers/types";
import {i18n} from "../../i18n";
import KodoUploader from "./kodoUploader";
import {drawCustomDomain, drawBucketName} from "../../ui/settingFields";

function drawSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.qiniu.accessKey.name)
        .setDesc(t.qiniu.accessKey.desc)
        .addText(text =>
            text
                .setPlaceholder(t.qiniu.accessKey.placeholder)
                .setValue(plugin.settings.kodoSetting.accessKey)
                .onChange(value => plugin.settings.kodoSetting.accessKey = value))
    new Setting(parentEl)
        .setName(t.qiniu.secretKey.name)
        .setDesc(t.qiniu.secretKey.desc)
        .addText(text =>
            text
                .setPlaceholder(t.qiniu.secretKey.placeholder)
                .setValue(plugin.settings.kodoSetting.secretKey)
                .onChange(value => plugin.settings.kodoSetting.secretKey = value))
    drawBucketName(parentEl,
        () => plugin.settings.kodoSetting.bucket,
        value => plugin.settings.kodoSetting.bucket = value)

    drawCustomDomain(parentEl,
        () => plugin.settings.kodoSetting.customDomainName,
        value => plugin.settings.kodoSetting.customDomainName = value)
}

export const KODO_PROVIDER: ProviderDescriptor = {
    store: ImageStore.QINIU_KUDO,
    build: settings => new KodoUploader(settings.kodoSetting),
    isHosted: (url, settings) => {
        const hostname = new URL(url).hostname;
        if (settings.kodoSetting?.customDomainName) {
            return hostname.includes(settings.kodoSetting.customDomainName);
        }
        return hostname.includes("qiniudn.com") || hostname.includes("clouddn.com");
    },
    withPath: (settings, path) => ({...settings, kodoSetting: {...settings.kodoSetting, path}}),
    getPath: settings => settings.kodoSetting?.path ?? "",
    cacheKeyParts: settings => [settings.kodoSetting?.bucket, settings.kodoSetting?.customDomainName],
    drawSettings,
};
