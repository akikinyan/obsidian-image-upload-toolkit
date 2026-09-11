import {Setting} from "obsidian";
import type ObsidianPublish from "../../publish";
import ImageStore from "../../imageStore";
import type {ProviderDescriptor} from "../../providers/types";
import {i18n} from "../../i18n";
import ImgurAnonymousUploader from "./imgurAnonymousUploader";
import {linkDescription} from "../../ui/settingFields";

function drawSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.imgur.clientId.name)
        .setDesc(linkDescription(t.imgur.descPrefix, "https://api.imgur.com/oauth2/addclient"))
        .addText(text =>
            text
                .setPlaceholder(t.imgur.clientId.placeholder)
                .setValue(plugin.settings.imgurAnonymousSetting.clientId)
                .onChange(value => plugin.settings.imgurAnonymousSetting.clientId = value)
        )
}

export const IMGUR_PROVIDER: ProviderDescriptor = {
    store: ImageStore.IMGUR,
    build: settings => new ImgurAnonymousUploader(settings.imgurAnonymousSetting.clientId),
    isHosted: url => {
        const hostname = new URL(url).hostname;
        return hostname.includes("imgur.com") || hostname.includes("i.imgur.com");
    },
    drawSettings,
};
