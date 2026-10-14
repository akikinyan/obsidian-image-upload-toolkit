import {Setting, TFolder} from "obsidian";
import type ObsidianPublish from "../publish";
import ImageStore from "../imageStore";
import {i18n} from "../i18n";
import {emptyFilter, normalizeFolder, type FilterScope, type LocalImageFilter} from "../uploader/localImageFilter";
import PathSuggestModal from "./pathSuggestModal";
import FilterTestModal from "./filterTestModal";

/**
 * The selected store's filter, created on first edit. Reading without
 * creating keeps data.json free of entries for stores the user only looked at.
 */
function storeFilter(plugin: ObsidianPublish, create: boolean): LocalImageFilter | undefined {
    const id = ImageStore.normalizeId(plugin.settings.imageStore);
    const filters = plugin.settings.localImageFilters;
    if (!filters[id] && create) {
        filters[id] = emptyFilter();
    }
    return filters[id];
}

function vaultFolders(plugin: ObsidianPublish): TFolder[] {
    return plugin.app.vault.getAllLoadedFiles()
        .filter((f): f is TFolder => f instanceof TFolder && normalizeFolder(f.path) !== "")
        .sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * Folder conditions for the selected image store. Like every other section of
 * the tab, edits land in plugin.settings right away and are saved when the
 * tab closes.
 */
export function drawImageFilterSettings(parentEl: HTMLElement, plugin: ObsidianPublish): void {
    parentEl.empty();
    const t = i18n();
    const redraw = () => drawImageFilterSettings(parentEl, plugin);
    const scope: FilterScope = storeFilter(plugin, false)?.scope === "selected" ? "selected" : "all";

    new Setting(parentEl).setName(t.filter.heading).setHeading();

    new Setting(parentEl)
        .setName(t.filter.scope.name)
        .setDesc(t.filter.scope.desc)
        .addDropdown(dd => {
            dd.addOption("all", t.filter.scope.options.all);
            dd.addOption("selected", t.filter.scope.options.selected);
            dd.setValue(scope);
            dd.onChange(value => {
                const target = storeFilter(plugin, true);
                if (target) target.scope = value as FilterScope;
                redraw();
            });
        });

    parentEl.createDiv({cls: "setting-item-description", text: t.filter.hint});

    if (scope === "selected") {
        drawFolderList(parentEl, plugin, "includeFolders", {
            name: t.filter.include.name,
            add: t.filter.include.add,
            empty: t.filter.include.empty,
            emptyIsWarning: true,
        }, redraw);
    }

    drawFolderList(parentEl, plugin, "excludeFolders", {
        name: t.filter.exclude.name,
        desc: t.filter.exclude.desc,
        add: t.filter.exclude.add,
        empty: t.filter.exclude.empty,
        emptyIsWarning: false,
    }, redraw);

    new Setting(parentEl)
        .setName(t.filter.test.name)
        .setDesc(t.filter.test.desc)
        .addButton(button => button
            .setButtonText(t.filter.test.button)
            .onClick(() => {
                // While the settings modal is up, the active file is still the
                // note the user was on before opening it.
                const note = plugin.app.workspace.getActiveFile();
                new FilterTestModal(plugin.app, plugin, note?.extension === "md" ? note : null).open();
            }));
}

interface FolderListLabels {
    name: string;
    desc?: string;
    add: string;
    empty: string;
    emptyIsWarning: boolean;
}

function drawFolderList(
    parentEl: HTMLElement,
    plugin: ObsidianPublish,
    key: "includeFolders" | "excludeFolders",
    labels: FolderListLabels,
    redraw: () => void,
): void {
    const t = i18n();
    const folders = foldersOf(storeFilter(plugin, false), key);

    const header = new Setting(parentEl).setName(labels.name);
    if (labels.desc) header.setDesc(labels.desc);
    header.addButton(button => button
        .setButtonText(labels.add)
        .onClick(() => {
            const chosen = new Set(folders);
            const candidates = vaultFolders(plugin).filter(f => !chosen.has(f.path));
            new PathSuggestModal(plugin.app, candidates, t.filter.pickFolder, folder => {
                const target = storeFilter(plugin, true);
                if (!target) return;
                const path = normalizeFolder(folder.path);
                const current = foldersOf(target, key);
                if (!current.includes(path)) {
                    target[key] = [...current, path];
                }
                redraw();
            }).open();
        }));

    if (folders.length === 0) {
        parentEl.createDiv({
            cls: labels.emptyIsWarning ? "setting-item-description mod-warning" : "setting-item-description",
            text: labels.empty,
        });
        return;
    }

    const listEl = parentEl.createDiv({cls: "iut-folder-list"});
    for (const folder of folders) {
        const row = new Setting(listEl).setName(folder);
        if (!(plugin.app.vault.getAbstractFileByPath(folder) instanceof TFolder)) {
            row.setDesc(t.filter.missing);
            row.descEl.addClass("mod-warning");
        }
        row.addExtraButton(button => button
            .setIcon("trash")
            .setTooltip(t.filter.remove)
            .onClick(() => {
                const target = storeFilter(plugin, false);
                if (target) target[key] = foldersOf(target, key).filter(f => f !== folder);
                redraw();
            }));
    }
}

/** The folder list as saved, tolerating a hand-edited data.json. */
function foldersOf(filter: LocalImageFilter | undefined, key: "includeFolders" | "excludeFolders"): string[] {
    const value: unknown = filter?.[key];
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}
