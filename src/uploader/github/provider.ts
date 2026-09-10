import {Setting} from "obsidian";
import type ObsidianPublish from "../../publish";
import ImageStore from "../../imageStore";
import type {ProviderDescriptor} from "../../providers/types";
import {i18n} from "../../i18n";
import GitHubUploader from "./gitHubUploader";
import {drawTargetPath, linkDescription} from "../../ui/settingFields";

function drawSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    const t = i18n();
    new Setting(parentEl)
        .setName(t.github.repositoryName.name)
        .setDesc(t.github.repositoryName.desc)
        .addText(text =>
            text
                .setPlaceholder(t.github.repositoryName.placeholder)
                .setValue(plugin.settings.githubSetting.repositoryName)
                .onChange(value => plugin.settings.githubSetting.repositoryName = value)
        );

    new Setting(parentEl)
        .setName(t.github.branchName.name)
        .setDesc(t.github.branchName.desc)
        .addText(text =>
            text
                .setPlaceholder(t.github.branchName.placeholder)
                .setValue(plugin.settings.githubSetting.branchName)
                .onChange(value => plugin.settings.githubSetting.branchName = value)
        );

    new Setting(parentEl)
        .setName(t.github.token.name)
        .setDesc(linkDescription(t.github.tokenDescPrefix, "https://github.com/settings/tokens"))
        .addText(text =>
            text
                .setPlaceholder(t.github.token.placeholder)
                .setValue(plugin.settings.githubSetting.token)
                .onChange(value => plugin.settings.githubSetting.token = value)
        );

    drawTargetPath(parentEl,
        () => plugin.settings.githubSetting.path,
        value => plugin.settings.githubSetting.path = value)
}

export const GITHUB_PROVIDER: ProviderDescriptor = {
    store: ImageStore.GITHUB,
    build: settings => new GitHubUploader(settings.githubSetting),
    isHosted: (url, settings) => {
        const hostname = new URL(url).hostname;
        const isGitHubHost = hostname.includes("github.com") || hostname.includes("githubusercontent.com");
        if (settings.githubSetting?.repositoryName) {
            // GitHubUploader returns raw.githubusercontent.com/{owner}/{repo}/...
            // which does not contain "github.com", so the host check must
            // accept githubusercontent hosts too
            return isGitHubHost && url.includes(settings.githubSetting.repositoryName);
        }
        return isGitHubHost;
    },
    drawSettings,
};
