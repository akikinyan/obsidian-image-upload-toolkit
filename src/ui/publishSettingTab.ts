import {App, Notice, PluginSettingTab, Setting} from "obsidian";
import ObsidianPublish from "../publish";
import ImageStore from "../imageStore";
import {AliYunRegionList} from "../uploader/oss/common";
import {TencentCloudRegionList} from "../uploader/cos/common";
import {i18n, setLocaleOverride, type LocaleSetting} from "../i18n";
import {detectEnvProxy, redact, type ProxyMode} from "../net/proxy";
import {formatExtensions, parseExtensions} from "../uploader/webpConverter";
import {storeSupportsPath} from "../uploader/imageUploaderBuilder";

export default class PublishSettingTab extends PluginSettingTab {
    private plugin: ObsidianPublish;
    private imageStoreDiv: HTMLDivElement;
    private networkDiv: HTMLDivElement;
    private webpDiv: HTMLDivElement;
    private cacheDiv: HTMLDivElement;

    constructor(app: App, plugin: ObsidianPublish) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        const t = i18n();
        containerEl.empty()
        this.plugin.settings.imageStore = ImageStore.normalizeId(this.plugin.settings.imageStore);

        // ── General ──
        new Setting(containerEl)
            .setName(t.language.name)
            .setDesc(t.language.desc)
            .addDropdown(dd => {
                dd.addOption("auto", t.language.options.auto);
                dd.addOption("en", t.language.options.en);
                dd.addOption("ja", t.language.options.ja);
                dd.setValue(this.plugin.settings.locale);
                dd.onChange(value => {
                    const locale = value as LocaleSetting;
                    this.plugin.settings.locale = locale;
                    setLocaleOverride(locale);
                    // Re-render so the whole tab switches language immediately.
                    this.display();
                });
            });

        new Setting(containerEl)
            .setName(t.general.altText.name)
            .setDesc(t.general.altText.desc)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.imageAltText)
                    .onChange(value => this.plugin.settings.imageAltText = value)
            );

        new Setting(containerEl)
            .setName(t.general.updateOriginalDoc.name)
            .setDesc(t.general.updateOriginalDoc.desc)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.replaceOriginalDoc)
                    .onChange(value => this.plugin.settings.replaceOriginalDoc = value)
            );

        new Setting(containerEl)
            .setName(t.general.ignoreProperties.name)
            .setDesc(t.general.ignoreProperties.desc)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.ignoreProperties)
                    .onChange(value => this.plugin.settings.ignoreProperties = value)
            );

        // ── Upload ──
        new Setting(containerEl).setName(t.upload.heading).setHeading();

        new Setting(containerEl)
            .setName(t.upload.progressModal.name)
            .setDesc(t.upload.progressModal.desc)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.showProgressModal)
                    .onChange(value => this.plugin.settings.showProgressModal = value)
            );

        new Setting(containerEl)
            .setName(t.upload.webImages.name)
            .setDesc(t.upload.webImages.desc)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.uploadWebImages)
                    .onChange(value => this.plugin.settings.uploadWebImages = value)
            );

        // ── WebP ──
        new Setting(containerEl).setName(t.webp.heading).setHeading();
        this.webpDiv = containerEl.createDiv();
        this.drawWebpSettings(this.webpDiv);

        // ── Upload history ──
        new Setting(containerEl).setName(t.cache.heading).setHeading();
        this.cacheDiv = containerEl.createDiv();
        this.drawCacheSettings(this.cacheDiv);

        // ── Mermaid ──
        new Setting(containerEl).setName(t.mermaid.heading).setHeading();

        new Setting(containerEl)
            .setName(t.mermaid.convert.name)
            .setDesc(t.mermaid.convert.desc)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.convertMermaid)
                    .onChange(value => this.plugin.settings.convertMermaid = value)
            );

        new Setting(containerEl)
            .setName(t.mermaid.scale.name)
            .setDesc(t.mermaid.scale.desc)
            .addSlider(slider =>
                slider
                    .setLimits(1, 4, 1)
                    .setValue(this.plugin.settings.mermaidScale)
                    .setDynamicTooltip()
                    .onChange(value => this.plugin.settings.mermaidScale = value)
            );

        new Setting(containerEl)
            .setName(t.mermaid.theme.name)
            .setDesc(t.mermaid.theme.desc)
            .addDropdown(dd => {
                const themes: Record<string, string> = {
                    "default": t.mermaid.theme.options.default,
                    "dark": t.mermaid.theme.options.dark,
                    "forest": t.mermaid.theme.options.forest,
                    "neutral": t.mermaid.theme.options.neutral,
                    "base": t.mermaid.theme.options.base,
                };
                Object.entries(themes).forEach(([value, label]) => { dd.addOption(value, label); });
                dd.setValue(this.plugin.settings.mermaidTheme);
                dd.onChange(value => this.plugin.settings.mermaidTheme = value);
            });

        // ── Network ──
        new Setting(containerEl).setName(t.network.heading).setHeading();
        this.networkDiv = containerEl.createDiv();
        this.drawNetworkSettings(this.networkDiv);

        // ── Image Store ──
        new Setting(containerEl).setName(t.imageStore.heading).setHeading();

        const imageStoreTypeDiv = containerEl.createDiv();
        this.imageStoreDiv = containerEl.createDiv();

        new Setting(imageStoreTypeDiv)
            .setName(t.imageStore.select.name)
            .setDesc(t.imageStore.select.desc)
            .addDropdown(dd => {
                ImageStore.lists.forEach(s => {
                    dd.addOption(s.id, s.description);
                });
                dd.setValue(this.plugin.settings.imageStore);
                dd.onChange(async (v) => {
                    this.plugin.settings.imageStore = v;
                    this.plugin.setupImageUploader();
                    // Whether a separate path for the originals is available
                    // depends on the store, so that section needs a redraw too.
                    this.drawWebpSettings(this.webpDiv);
                    await this.drawImageStoreSettings(this.imageStoreDiv);
                });
            });
        void this.drawImageStoreSettings(this.imageStoreDiv);
    }

    hide(): void {
        void this.plugin.saveSettings().then(() => {
            this.plugin.setupImageUploader();
        }).catch(err => {
            console.error("Image upload toolkit: saveSettings failed", err);
        });
    }

    /**
     * WebP conversion. Rendered into its own div because the dependent fields
     * only make sense once the feature is on, and the originals path only once
     * the store actually has a path template.
     */
    private drawWebpSettings(parentEL: HTMLDivElement) {
        parentEL.empty();
        const t = i18n();
        const webp = this.plugin.settings.webpSetting;

        new Setting(parentEL)
            .setName(t.webp.enabled.name)
            .setDesc(t.webp.enabled.desc)
            .addToggle(toggle =>
                toggle
                    .setValue(webp.enabled)
                    .onChange(value => {
                        webp.enabled = value;
                        this.drawWebpSettings(parentEL);
                    })
            );

        if (!webp.enabled) return;

        new Setting(parentEL)
            .setName(t.webp.extensions.name)
            .setDesc(t.webp.extensions.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.webp.extensions.placeholder)
                    .setValue(formatExtensions(webp.extensions))
                    .onChange(value => webp.extensions = parseExtensions(value))
            );

        new Setting(parentEL)
            .setName(t.webp.quality.name)
            .setDesc(t.webp.quality.desc)
            .addSlider(slider =>
                slider
                    .setLimits(1, 100, 1)
                    .setValue(webp.quality)
                    .setDynamicTooltip()
                    .onChange(value => webp.quality = value)
            );

        new Setting(parentEL)
            .setName(t.webp.keepOriginal.name)
            .setDesc(t.webp.keepOriginal.desc)
            .addToggle(toggle =>
                toggle
                    .setValue(webp.keepOriginal)
                    .onChange(value => {
                        webp.keepOriginal = value;
                        this.drawWebpSettings(parentEL);
                    })
            );

        if (webp.keepOriginal) {
            if (storeSupportsPath(this.plugin.settings.imageStore)) {
                new Setting(parentEL)
                    .setName(t.webp.originalPath.name)
                    .setDesc(t.webp.originalPath.desc)
                    .addText(text =>
                        text
                            .setPlaceholder(t.webp.originalPath.placeholder)
                            .setValue(webp.originalPath)
                            .onChange(value => webp.originalPath = value)
                    );
            } else {
                parentEL.createDiv({
                    cls: "setting-item-description",
                    text: t.webp.originalPathUnsupported,
                });
            }
        }

        new Setting(parentEL)
            .setName(t.webp.frontmatterProperty.name)
            .setDesc(t.webp.frontmatterProperty.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.webp.frontmatterProperty.placeholder)
                    .setValue(webp.frontmatterProperty)
                    .onChange(value => webp.frontmatterProperty = value.trim())
            );

        new Setting(parentEL)
            .setName(t.webp.frontmatterDefault.name)
            .setDesc(t.webp.frontmatterDefault.desc)
            .addToggle(toggle =>
                toggle
                    .setValue(webp.frontmatterDefault)
                    .onChange(value => webp.frontmatterDefault = value)
            );
    }

    /** Upload history: the on/off switch, the entry count, and the reset button. */
    private drawCacheSettings(parentEL: HTMLDivElement) {
        parentEL.empty();
        const t = i18n();

        new Setting(parentEL)
            .setName(t.cache.enabled.name)
            .setDesc(t.cache.enabled.desc)
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.rememberUploads)
                    .onChange(value => {
                        this.plugin.settings.rememberUploads = value;
                        this.drawCacheSettings(parentEL);
                    })
            );

        if (!this.plugin.settings.rememberUploads) return;

        const countEl = parentEL.createDiv({cls: "setting-item-description"});
        const showCount = () => {
            const cache = this.plugin.uploadCache();
            if (!cache) return;
            void cache.load()
                .then(() => countEl.setText(t.cache.entries(cache.size())))
                .catch(err => console.error("Image upload toolkit: could not read the upload cache", err));
        };
        showCount();

        new Setting(parentEL)
            .setName(t.cache.clear.name)
            .setDesc(t.cache.clear.desc)
            .addButton(button =>
                button
                    .setButtonText(t.cache.clear.button)
                    .setWarning()
                    .onClick(() => {
                        void this.plugin.clearUploadCache()
                            .then(removed => {
                                new Notice(i18n().cache.cleared(removed));
                                showCount();
                            })
                            .catch(err => console.error("Image upload toolkit: could not clear the upload cache", err));
                    })
            );
    }

    /**
     * Proxy settings for the S3-compatible uploaders. Rendered into its own div
     * so switching modes can redraw just this part, which is what surfaces the
     * detected environment proxy without a full tab refresh.
     */
    private drawNetworkSettings(parentEL: HTMLDivElement) {
        parentEL.empty();
        const t = i18n();
        const proxy = this.plugin.settings.proxySetting;

        new Setting(parentEL)
            .setName(t.network.mode.name)
            .setDesc(t.network.mode.desc)
            .addDropdown(dd => {
                dd.addOption("auto", t.network.mode.options.auto);
                dd.addOption("off", t.network.mode.options.off);
                dd.addOption("manual", t.network.mode.options.manual);
                dd.setValue(proxy.mode);
                dd.onChange(value => {
                    proxy.mode = value as ProxyMode;
                    this.drawNetworkSettings(parentEL);
                });
            });

        // Status line: tells the user what will actually be used.
        const status = parentEL.createDiv({cls: "setting-item-description"});
        if (proxy.mode === "off") {
            status.setText(t.network.disabled);
        } else if (proxy.mode === "manual") {
            const url = proxy.url.trim();
            status.setText(url ? t.network.manualActive(redact(url)) : t.network.manualEmpty);
        } else {
            const detected = detectEnvProxy();
            status.setText(detected ? t.network.detected(redact(detected)) : t.network.notDetected);
        }

        if (proxy.mode === "manual") {
            new Setting(parentEL)
                .setName(t.network.url.name)
                .setDesc(t.network.url.desc)
                .addText(text =>
                    text
                        .setPlaceholder(t.network.url.placeholder)
                        .setValue(proxy.url)
                        .onChange(value => proxy.url = value)
                );
        }
    }

    private async drawImageStoreSettings(parentEL: HTMLDivElement) {
        parentEL.empty();
        switch (ImageStore.normalizeId(this.plugin.settings.imageStore)) {
            case ImageStore.IMGUR.id:
                this.drawImgurSetting(parentEL);
                break;
            case ImageStore.GYAZO.id:
                this.drawGyazoSetting(parentEL);
                break;
            case ImageStore.ALIYUN_OSS.id:
                this.drawOSSSetting(parentEL);
                break;
            case ImageStore.ImageKit.id:
                this.drawImageKitSetting(parentEL);
                break;
            case ImageStore.AWS_S3.id:
                this.drawAwsS3Setting(parentEL);
                break;
            case ImageStore.TENCENTCLOUD_COS.id:
                this.drawTencentCloudCosSetting(parentEL);
                break;
            case ImageStore.QINIU_KUDO.id:
                this.drawQiniuSetting(parentEL);
                break
            case ImageStore.GITHUB.id:
                this.drawGitHubSetting(parentEL);
                break;
            case ImageStore.CLOUDFLARE_R2.id:
                this.drawR2Setting(parentEL);
                break;
            case ImageStore.BACKBLAZE_B2.id:
                this.drawB2Setting(parentEL);
                break;
            default:
                throw new Error(
                    "Should not reach here!"
                )
        }
    }

    /** Shared renderer for the "target path" field every object store has. */
    private drawTargetPath(parentEL: HTMLDivElement, get: () => string, set: (value: string) => void) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.common.targetPath.name)
            .setDesc(t.common.targetPath.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.common.targetPath.placeholder)
                    .setValue(get())
                    .onChange(set))
    }

    /** Shared renderer for the "custom domain name" field. */
    private drawCustomDomain(parentEL: HTMLDivElement, get: () => string, set: (value: string) => void) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.common.customDomain.name)
            .setDesc(t.common.customDomain.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.common.customDomain.placeholder)
                    .setValue(get())
                    .onChange(set))
    }

    /** Shared renderer for the "bucket name" field. */
    private drawBucketName(parentEL: HTMLDivElement, get: () => string, set: (value: string) => void) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.common.bucketName.name)
            .setDesc(t.common.bucketName.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.common.bucketName.placeholder)
                    .setValue(get())
                    .onChange(set))
    }

    /** Description that ends in a clickable URL. */
    private static linkDescription(prefix: string, url: string) {
        return createFragment(frag => {
            frag.append(prefix);
            frag.createEl("a", { text: url, href: url });
        });
    }

    // Imgur Setting
    private drawImgurSetting(parentEL: HTMLDivElement) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.imgur.clientId.name)
            .setDesc(PublishSettingTab.linkDescription(t.imgur.descPrefix, "https://api.imgur.com/oauth2/addclient"))
            .addText(text =>
                text
                    .setPlaceholder(t.imgur.clientId.placeholder)
                    .setValue(this.plugin.settings.imgurAnonymousSetting.clientId)
                    .onChange(value => this.plugin.settings.imgurAnonymousSetting.clientId = value)
            )
    }

    private drawGyazoSetting(parentEL: HTMLDivElement) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.gyazo.accessToken.name)
            .setDesc(PublishSettingTab.linkDescription(t.gyazo.tokenDescPrefix, "https://gyazo.com/oauth/applications"))
            .addText(text =>
                text
                    .setPlaceholder(t.gyazo.accessToken.placeholder)
                    .setValue(this.plugin.settings.gyazoSetting.accessToken)
                    .onChange(value => this.plugin.settings.gyazoSetting.accessToken = value)
            );

        new Setting(parentEL)
            .setName(t.gyazo.accessPolicy.name)
            .setDesc(t.gyazo.accessPolicy.desc)
            .addDropdown(dropdown =>
                dropdown
                    .addOption("anyone", t.gyazo.accessPolicy.options.anyone)
                    .addOption("only_me", t.gyazo.accessPolicy.options.onlyMe)
                    .setValue(this.plugin.settings.gyazoSetting.accessPolicy)
                    .onChange((value: "anyone" | "only_me") => this.plugin.settings.gyazoSetting.accessPolicy = value)
            );

        new Setting(parentEL)
            .setName(t.gyazo.commonDescription.name)
            .setDesc(t.gyazo.commonDescription.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.gyazo.commonDescription.placeholder)
                    .setValue(this.plugin.settings.gyazoSetting.desc)
                    .onChange(value => this.plugin.settings.gyazoSetting.desc = value)
            );
    }

    // Aliyun OSS Setting
    private drawOSSSetting(parentEL: HTMLDivElement) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.oss.region.name)
            .setDesc(t.oss.region.desc)
            .addDropdown(dropdown =>
                dropdown
                    .addOptions(AliYunRegionList)
                    .setValue(this.plugin.settings.ossSetting.region)
                    .onChange(value => {
                        this.plugin.settings.ossSetting.region = value;
                        this.plugin.settings.ossSetting.endpoint = `https://${value}.aliyuncs.com/`;
                    })
            )
        new Setting(parentEL)
            .setName(t.oss.accessKeyId.name)
            .setDesc(t.oss.accessKeyId.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.oss.accessKeyId.placeholder)
                    .setValue(this.plugin.settings.ossSetting.accessKeyId)
                    .onChange(value => this.plugin.settings.ossSetting.accessKeyId = value))
        new Setting(parentEL)
            .setName(t.oss.accessKeySecret.name)
            .setDesc(t.oss.accessKeySecret.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.oss.accessKeySecret.placeholder)
                    .setValue(this.plugin.settings.ossSetting.accessKeySecret)
                    .onChange(value => this.plugin.settings.ossSetting.accessKeySecret = value))
        this.drawBucketName(parentEL,
            () => this.plugin.settings.ossSetting.bucket,
            value => this.plugin.settings.ossSetting.bucket = value)

        this.drawTargetPath(parentEL,
            () => this.plugin.settings.ossSetting.path,
            value => this.plugin.settings.ossSetting.path = value)

        this.drawCustomDomain(parentEL,
            () => this.plugin.settings.ossSetting.customDomainName,
            value => this.plugin.settings.ossSetting.customDomainName = value)
    }

    private drawImageKitSetting(parentEL: HTMLDivElement) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.imagekit.id.name)
            .setDesc(PublishSettingTab.linkDescription(t.imagekit.descPrefix, "https://imagekit.io/dashboard/developer/api-keys"))
            .addText(text =>
                text
                    .setPlaceholder(t.imagekit.id.placeholder)
                    .setValue(this.plugin.settings.imagekitSetting.imagekitID)
                    .onChange(value => {
                        this.plugin.settings.imagekitSetting.imagekitID = value
                        this.plugin.settings.imagekitSetting.endpoint = `https://ik.imagekit.io/${value}/`
                    }))

        new Setting(parentEL)
            .setName(t.imagekit.folder.name)
            .setDesc(t.imagekit.folder.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.imagekit.folder.placeholder)
                    .setValue(this.plugin.settings.imagekitSetting.folder)
                    .onChange(value => this.plugin.settings.imagekitSetting.folder = value))

        new Setting(parentEL)
            .setName(t.imagekit.publicKey.name)
            .addText(text =>
                text
                    .setPlaceholder(t.imagekit.publicKey.placeholder)
                    .setValue(this.plugin.settings.imagekitSetting.publicKey)
                    .onChange(value => this.plugin.settings.imagekitSetting.publicKey = value))

        new Setting(parentEL)
            .setName(t.imagekit.privateKey.name)
            .addText(text =>
                text
                    .setPlaceholder(t.imagekit.privateKey.placeholder)
                    .setValue(this.plugin.settings.imagekitSetting.privateKey)
                    .onChange(value => this.plugin.settings.imagekitSetting.privateKey = value))
    }

    private drawAwsS3Setting(parentEL: HTMLDivElement) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.s3.accessKeyId.name)
            .setDesc(t.s3.accessKeyId.desc)
            .addText(text => text
                .setPlaceholder(t.s3.accessKeyId.placeholder)
                .setValue(this.plugin.settings.awsS3Setting?.accessKeyId || '')
                .onChange(value => this.plugin.settings.awsS3Setting.accessKeyId = value
                ));

        new Setting(parentEL)
            .setName(t.s3.secretAccessKey.name)
            .setDesc(t.s3.secretAccessKey.desc)
            .addText(text => text
                .setPlaceholder(t.s3.secretAccessKey.placeholder)
                .setValue(this.plugin.settings.awsS3Setting?.secretAccessKey || '')
                .onChange(value => this.plugin.settings.awsS3Setting.secretAccessKey = value));

        new Setting(parentEL)
            .setName(t.s3.region.name)
            .setDesc(t.s3.region.desc)
            .addText(text => text
                .setPlaceholder(t.s3.region.placeholder)
                .setValue(this.plugin.settings.awsS3Setting?.region || '')
                .onChange(value => this.plugin.settings.awsS3Setting.region = value));

        new Setting(parentEL)
            .setName(t.s3.bucketName.name)
            .setDesc(t.s3.bucketName.desc)
            .addText(text => text
                .setPlaceholder(t.s3.bucketName.placeholder)
                .setValue(this.plugin.settings.awsS3Setting?.bucketName || '')
                .onChange(value => this.plugin.settings.awsS3Setting.bucketName = value));

        this.drawTargetPath(parentEL,
            () => this.plugin.settings.awsS3Setting.path,
            value => this.plugin.settings.awsS3Setting.path = value)

        this.drawCustomDomain(parentEL,
            () => this.plugin.settings.awsS3Setting.customDomainName,
            value => this.plugin.settings.awsS3Setting.customDomainName = value)
    }

    private drawTencentCloudCosSetting(parentEL: HTMLDivElement) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.cos.region.name)
            .setDesc(t.cos.region.desc)
            .addDropdown(dropdown =>
                dropdown
                    .addOptions(TencentCloudRegionList)
                    .setValue(this.plugin.settings.cosSetting.region)
                    .onChange(value => {
                        this.plugin.settings.cosSetting.region = value;
                    })
            )
        new Setting(parentEL)
            .setName(t.cos.secretId.name)
            .setDesc(t.cos.secretId.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.cos.secretId.placeholder)
                    .setValue(this.plugin.settings.cosSetting.secretId)
                    .onChange(value => this.plugin.settings.cosSetting.secretId = value))
        new Setting(parentEL)
            .setName(t.cos.secretKey.name)
            .setDesc(t.cos.secretKey.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.cos.secretKey.placeholder)
                    .setValue(this.plugin.settings.cosSetting.secretKey)
                    .onChange(value => this.plugin.settings.cosSetting.secretKey = value))
        this.drawBucketName(parentEL,
            () => this.plugin.settings.cosSetting.bucket,
            value => this.plugin.settings.cosSetting.bucket = value)

        this.drawTargetPath(parentEL,
            () => this.plugin.settings.cosSetting.path,
            value => this.plugin.settings.cosSetting.path = value)

        this.drawCustomDomain(parentEL,
            () => this.plugin.settings.cosSetting.customDomainName,
            value => this.plugin.settings.cosSetting.customDomainName = value)
    }

    private drawQiniuSetting(parentEL: HTMLDivElement) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.qiniu.accessKey.name)
            .setDesc(t.qiniu.accessKey.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.qiniu.accessKey.placeholder)
                    .setValue(this.plugin.settings.kodoSetting.accessKey)
                    .onChange(value => this.plugin.settings.kodoSetting.accessKey = value))
        new Setting(parentEL)
            .setName(t.qiniu.secretKey.name)
            .setDesc(t.qiniu.secretKey.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.qiniu.secretKey.placeholder)
                    .setValue(this.plugin.settings.kodoSetting.secretKey)
                    .onChange(value => this.plugin.settings.kodoSetting.secretKey = value))
        this.drawBucketName(parentEL,
            () => this.plugin.settings.kodoSetting.bucket,
            value => this.plugin.settings.kodoSetting.bucket = value)

        this.drawCustomDomain(parentEL,
            () => this.plugin.settings.kodoSetting.customDomainName,
            value => this.plugin.settings.kodoSetting.customDomainName = value)
    }

    private drawGitHubSetting(parentEL: HTMLDivElement) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.github.repositoryName.name)
            .setDesc(t.github.repositoryName.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.github.repositoryName.placeholder)
                    .setValue(this.plugin.settings.githubSetting.repositoryName)
                    .onChange(value => this.plugin.settings.githubSetting.repositoryName = value)
            );

        new Setting(parentEL)
            .setName(t.github.branchName.name)
            .setDesc(t.github.branchName.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.github.branchName.placeholder)
                    .setValue(this.plugin.settings.githubSetting.branchName)
                    .onChange(value => this.plugin.settings.githubSetting.branchName = value)
            );

        new Setting(parentEL)
            .setName(t.github.token.name)
            .setDesc(PublishSettingTab.linkDescription(t.github.tokenDescPrefix, "https://github.com/settings/tokens"))
            .addText(text =>
                text
                    .setPlaceholder(t.github.token.placeholder)
                    .setValue(this.plugin.settings.githubSetting.token)
                    .onChange(value => this.plugin.settings.githubSetting.token = value)
            );
    }

    private drawR2Setting(parentEL: HTMLDivElement) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.r2.accessKeyId.name)
            .setDesc(t.r2.accessKeyId.desc)
            .addText(text => text
                .setPlaceholder(t.r2.accessKeyId.placeholder)
                .setValue(this.plugin.settings.r2Setting?.accessKeyId || '')
                .onChange(value => this.plugin.settings.r2Setting.accessKeyId = value
                ));

        new Setting(parentEL)
            .setName(t.r2.secretAccessKey.name)
            .setDesc(t.r2.secretAccessKey.desc)
            .addText(text => text
                .setPlaceholder(t.r2.secretAccessKey.placeholder)
                .setValue(this.plugin.settings.r2Setting?.secretAccessKey || '')
                .onChange(value => this.plugin.settings.r2Setting.secretAccessKey = value));

        new Setting(parentEL)
            .setName(t.r2.endpoint.name)
            .setDesc(t.r2.endpoint.desc)
            .addText(text => text
                .setPlaceholder(t.r2.endpoint.placeholder)
                .setValue(this.plugin.settings.r2Setting?.endpoint || '')
                .onChange(value => this.plugin.settings.r2Setting.endpoint = value));

        new Setting(parentEL)
            .setName(t.r2.bucketName.name)
            .setDesc(t.r2.bucketName.desc)
            .addText(text => text
                .setPlaceholder(t.r2.bucketName.placeholder)
                .setValue(this.plugin.settings.r2Setting?.bucketName || '')
                .onChange(value => this.plugin.settings.r2Setting.bucketName = value));

        this.drawTargetPath(parentEL,
            () => this.plugin.settings.r2Setting.path,
            value => this.plugin.settings.r2Setting.path = value)

        new Setting(parentEL)
            .setName(t.r2.customDomain.name)
            .setDesc(t.r2.customDomain.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.r2.customDomain.placeholder)
                    .setValue(this.plugin.settings.r2Setting.customDomainName)
                    .onChange(value => this.plugin.settings.r2Setting.customDomainName = value));
    }

    private drawB2Setting(parentEL: HTMLDivElement) {
        const t = i18n();
        new Setting(parentEL)
            .setName(t.b2.accessKeyId.name)
            .setDesc(t.b2.accessKeyId.desc)
            .addText(text => text
                .setPlaceholder(t.b2.accessKeyId.placeholder)
                .setValue(this.plugin.settings.b2Setting?.accessKeyId || '')
                .onChange(value => this.plugin.settings.b2Setting.accessKeyId = value
                ));

        new Setting(parentEL)
            .setName(t.b2.secretAccessKey.name)
            .setDesc(t.b2.secretAccessKey.desc)
            .addText(text => text
                .setPlaceholder(t.b2.secretAccessKey.placeholder)
                .setValue(this.plugin.settings.b2Setting?.secretAccessKey || '')
                .onChange(value => this.plugin.settings.b2Setting.secretAccessKey = value));

        new Setting(parentEL)
            .setName(t.b2.region.name)
            .setDesc(t.b2.region.desc)
            .addText(text => text
                .setPlaceholder(t.b2.region.placeholder)
                .setValue(this.plugin.settings.b2Setting?.region || '')
                .onChange(value => this.plugin.settings.b2Setting.region = value));

        new Setting(parentEL)
            .setName(t.b2.bucketName.name)
            .setDesc(t.b2.bucketName.desc)
            .addText(text => text
                .setPlaceholder(t.b2.bucketName.placeholder)
                .setValue(this.plugin.settings.b2Setting?.bucketName || '')
                .onChange(value => this.plugin.settings.b2Setting.bucketName = value));

        this.drawTargetPath(parentEL,
            () => this.plugin.settings.b2Setting.path,
            value => this.plugin.settings.b2Setting.path = value)

        new Setting(parentEL)
            .setName(t.b2.customDomain.name)
            .setDesc(t.b2.customDomain.desc)
            .addText(text =>
                text
                    .setPlaceholder(t.b2.customDomain.placeholder)
                    .setValue(this.plugin.settings.b2Setting.customDomainName)
                    .onChange(value => this.plugin.settings.b2Setting.customDomainName = value));
    }
}
