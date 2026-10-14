import {App, FuzzySuggestModal, type TAbstractFile} from "obsidian";

/**
 * Searchable picker over vault entries, shown by their full path so two
 * folders or notes with the same name stay distinguishable.
 */
export default class PathSuggestModal<T extends TAbstractFile> extends FuzzySuggestModal<T> {
    constructor(
        app: App,
        private readonly items: T[],
        placeholder: string,
        private readonly onChoose: (item: T) => void,
    ) {
        super(app);
        this.setPlaceholder(placeholder);
    }

    getItems(): T[] {
        return this.items;
    }

    getItemText(item: T): string {
        return item.path;
    }

    onChooseItem(item: T): void {
        this.onChoose(item);
    }
}
