import {Setting} from "obsidian";
import type ObsidianPublish from "../../publish";
import ImageStore from "../../imageStore";
import type {ProviderDescriptor} from "../../providers/types";
import {i18n} from "../../i18n";
import GyazoUploader from "./gyazoUploader";
import {linkDescription} from "../../ui/settingFields";

function drawSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.gyazo.accessToken.name)
        .setDesc(linkDescription(t.gyazo.tokenDescPrefix, "https://gyazo.com/oauth/applications"))
        .addText(text =>
            text
                .setPlaceholder(t.gyazo.accessToken.placeholder)
                .setValue(plugin.settings.gyazoSetting.accessToken)
                .onChange(value => plugin.settings.gyazoSetting.accessToken = value)
        );

    new Setting(parentEl)
        .setName(t.gyazo.accessPolicy.name)
        .setDesc(t.gyazo.accessPolicy.desc)
        .addDropdown(dropdown =>
            dropdown
                .addOption("anyone", t.gyazo.accessPolicy.options.anyone)
                .addOption("only_me", t.gyazo.accessPolicy.options.onlyMe)
                .setValue(plugin.settings.gyazoSetting.accessPolicy)
                .onChange((value: "anyone" | "only_me") => plugin.settings.gyazoSetting.accessPolicy = value)
        );

    new Setting(parentEl)
        .setName(t.gyazo.commonDescription.name)
        .setDesc(t.gyazo.commonDescription.desc)
        .addText(text =>
            text
                .setPlaceholder(t.gyazo.commonDescription.placeholder)
                .setValue(plugin.settings.gyazoSetting.desc)
                .onChange(value => plugin.settings.gyazoSetting.desc = value)
        );
}

export const GYAZO_PROVIDER: ProviderDescriptor = {
    store: ImageStore.GYAZO,
    build: settings => new GyazoUploader(settings.gyazoSetting),
    isHosted: url => {
        const hostname = new URL(url).hostname;
        return hostname.includes("gyazo.com") || hostname.includes("i.gyazo.com") || hostname.includes("thumb.gyazo.com");
    },
    drawSettings,
};
