import {Setting} from "obsidian";
import type ObsidianPublish from "../../publish";
import ImageStore from "../../imageStore";
import type {ProviderDescriptor} from "../../providers/types";
import {i18n} from "../../i18n";
import OssUploader from "./ossUploader";
import {drawTargetPath, drawCustomDomain, drawBucketName} from "../../ui/settingFields";
import {AliYunRegionList} from "./common";

function drawSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.oss.region.name)
        .setDesc(t.oss.region.desc)
        .addDropdown(dropdown =>
            dropdown
                .addOptions(AliYunRegionList)
                .setValue(plugin.settings.ossSetting.region)
                .onChange(value => {
                    plugin.settings.ossSetting.region = value;
                    plugin.settings.ossSetting.endpoint = `https://${value}.aliyuncs.com/`;
                })
        )
    new Setting(parentEl)
        .setName(t.oss.accessKeyId.name)
        .setDesc(t.oss.accessKeyId.desc)
        .addText(text =>
            text
                .setPlaceholder(t.oss.accessKeyId.placeholder)
                .setValue(plugin.settings.ossSetting.accessKeyId)
                .onChange(value => plugin.settings.ossSetting.accessKeyId = value))
    new Setting(parentEl)
        .setName(t.oss.accessKeySecret.name)
        .setDesc(t.oss.accessKeySecret.desc)
        .addText(text =>
            text
                .setPlaceholder(t.oss.accessKeySecret.placeholder)
                .setValue(plugin.settings.ossSetting.accessKeySecret)
                .onChange(value => plugin.settings.ossSetting.accessKeySecret = value))
    drawBucketName(parentEl,
        () => plugin.settings.ossSetting.bucket,
        value => plugin.settings.ossSetting.bucket = value)

    drawTargetPath(parentEl,
        () => plugin.settings.ossSetting.path,
        value => plugin.settings.ossSetting.path = value)

    drawCustomDomain(parentEl,
        () => plugin.settings.ossSetting.customDomainName,
        value => plugin.settings.ossSetting.customDomainName = value)
}

export const OSS_PROVIDER: ProviderDescriptor = {
    store: ImageStore.ALIYUN_OSS,
    build: settings => new OssUploader(settings.ossSetting),
    isHosted: (url, settings) => {
        const hostname = new URL(url).hostname;
        if (settings.ossSetting?.customDomainName) {
            return hostname.includes(settings.ossSetting.customDomainName);
        }
        return hostname.includes("aliyuncs.com");
    },
    withPath: (settings, path) => ({...settings, ossSetting: {...settings.ossSetting, path}}),
    getPath: settings => settings.ossSetting?.path ?? "",
    cacheKeyParts: settings => [settings.ossSetting?.bucket, settings.ossSetting?.region, settings.ossSetting?.customDomainName],
    drawSettings,
};
