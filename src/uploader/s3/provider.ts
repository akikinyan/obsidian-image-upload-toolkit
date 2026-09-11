import {Setting} from "obsidian";
import type ObsidianPublish from "../../publish";
import ImageStore from "../../imageStore";
import type {ProviderDescriptor} from "../../providers/types";
import {i18n} from "../../i18n";
import AwsS3Uploader from "./awsS3Uploader";
import {drawTargetPath, drawCustomDomain} from "../../ui/settingFields";

function drawSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.s3.accessKeyId.name)
        .setDesc(t.s3.accessKeyId.desc)
        .addText(text => text
            .setPlaceholder(t.s3.accessKeyId.placeholder)
            .setValue(plugin.settings.awsS3Setting?.accessKeyId || '')
            .onChange(value => plugin.settings.awsS3Setting.accessKeyId = value
            ));

    new Setting(parentEl)
        .setName(t.s3.secretAccessKey.name)
        .setDesc(t.s3.secretAccessKey.desc)
        .addText(text => text
            .setPlaceholder(t.s3.secretAccessKey.placeholder)
            .setValue(plugin.settings.awsS3Setting?.secretAccessKey || '')
            .onChange(value => plugin.settings.awsS3Setting.secretAccessKey = value));

    new Setting(parentEl)
        .setName(t.s3.region.name)
        .setDesc(t.s3.region.desc)
        .addText(text => text
            .setPlaceholder(t.s3.region.placeholder)
            .setValue(plugin.settings.awsS3Setting?.region || '')
            .onChange(value => plugin.settings.awsS3Setting.region = value));

    new Setting(parentEl)
        .setName(t.s3.endpoint.name)
        .setDesc(t.s3.endpoint.desc)
        .addText(text => text
            .setPlaceholder(t.s3.endpoint.placeholder)
            .setValue(plugin.settings.awsS3Setting.endpoint || '')
            .onChange(value => plugin.settings.awsS3Setting.endpoint = value));

    new Setting(parentEl)
        .setName(t.s3.bucketName.name)
        .setDesc(t.s3.bucketName.desc)
        .addText(text => text
            .setPlaceholder(t.s3.bucketName.placeholder)
            .setValue(plugin.settings.awsS3Setting?.bucketName || '')
            .onChange(value => plugin.settings.awsS3Setting.bucketName = value));

    drawTargetPath(parentEl,
        () => plugin.settings.awsS3Setting.path,
        value => plugin.settings.awsS3Setting.path = value)

    drawCustomDomain(parentEl,
        () => plugin.settings.awsS3Setting.customDomainName,
        value => plugin.settings.awsS3Setting.customDomainName = value)
}

export const AWS_S3_PROVIDER: ProviderDescriptor = {
    store: ImageStore.AWS_S3,
    build: settings => new AwsS3Uploader(settings.awsS3Setting, settings.proxySetting),
    isHosted: (url, settings) => {
        const hostname = new URL(url).hostname;
        if (settings.awsS3Setting?.customDomainName) {
            return hostname === settings.awsS3Setting.customDomainName;
        }
        const endpoint = settings.awsS3Setting?.endpoint?.trim();
        if (endpoint) {
            // With a custom endpoint configured, that host is the only one the
            // uploader emits. Without this arm, images already sitting on a
            // self-hosted S3 read as someone else's and get re-uploaded on
            // every publish.
            try {
                return hostname === new URL(endpoint).hostname;
            } catch {
                return false;
            }
        }
        // AwsS3Uploader only ever returns *.amazonaws.com hosts or the
        // configured custom domain, so a third-party host that merely
        // contains ".s3." is not ours
        return hostname.endsWith(".amazonaws.com");
    },
    withPath: (settings, path) => ({...settings, awsS3Setting: {...settings.awsS3Setting, path}}),
    cacheKeyParts: settings => [settings.awsS3Setting?.bucketName, settings.awsS3Setting?.region, settings.awsS3Setting?.customDomainName, settings.awsS3Setting?.endpoint],
    drawSettings,
};
