import {Setting} from "obsidian";
import type ObsidianPublish from "../../publish";
import ImageStore from "../../imageStore";
import type {ProviderDescriptor} from "../../providers/types";
import {i18n} from "../../i18n";
import CosUploader from "./cosUploader";
import {drawTargetPath, drawCustomDomain, drawBucketName} from "../../ui/settingFields";
import {TencentCloudRegionList} from "./common";

function drawSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.cos.region.name)
        .setDesc(t.cos.region.desc)
        .addDropdown(dropdown =>
            dropdown
                .addOptions(TencentCloudRegionList)
                .setValue(plugin.settings.cosSetting.region)
                .onChange(value => {
                    plugin.settings.cosSetting.region = value;
                })
        )
    new Setting(parentEl)
        .setName(t.cos.secretId.name)
        .setDesc(t.cos.secretId.desc)
        .addText(text =>
            text
                .setPlaceholder(t.cos.secretId.placeholder)
                .setValue(plugin.settings.cosSetting.secretId)
                .onChange(value => plugin.settings.cosSetting.secretId = value))
    new Setting(parentEl)
        .setName(t.cos.secretKey.name)
        .setDesc(t.cos.secretKey.desc)
        .addText(text =>
            text
                .setPlaceholder(t.cos.secretKey.placeholder)
                .setValue(plugin.settings.cosSetting.secretKey)
                .onChange(value => plugin.settings.cosSetting.secretKey = value))
    drawBucketName(parentEl,
        () => plugin.settings.cosSetting.bucket,
        value => plugin.settings.cosSetting.bucket = value)

    drawTargetPath(parentEl,
        () => plugin.settings.cosSetting.path,
        value => plugin.settings.cosSetting.path = value)

    drawCustomDomain(parentEl,
        () => plugin.settings.cosSetting.customDomainName,
        value => plugin.settings.cosSetting.customDomainName = value)
}

export const COS_PROVIDER: ProviderDescriptor = {
    store: ImageStore.TENCENTCLOUD_COS,
    build: settings => new CosUploader(settings.cosSetting),
    isHosted: (url, settings) => {
        const hostname = new URL(url).hostname;
        if (settings.cosSetting?.customDomainName) {
            return hostname.includes(settings.cosSetting.customDomainName);
        }
        return hostname.includes("myqcloud.com");
    },
    drawSettings,
};
