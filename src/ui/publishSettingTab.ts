import {App, Notice, PluginSettingTab, Setting} from "obsidian";
import ObsidianPublish from "../publish";
import ImageStore from "../imageStore";
import {requireProvider} from "../providers/registry";
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
                    this.drawImageStoreSettings(this.imageStoreDiv);
                });
            });
        this.drawImageStoreSettings(this.imageStoreDiv);
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

    private drawImageStoreSettings(parentEL: HTMLDivElement) {
        parentEL.empty();
        requireProvider(ImageStore.normalizeId(this.plugin.settings.imageStore))
            .drawSettings(parentEL, this.plugin);
    }
}
