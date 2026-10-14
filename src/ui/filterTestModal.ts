import {App, ButtonComponent, DropdownComponent, MarkdownView, Modal, TextComponent, TFile} from "obsidian";
import type ObsidianPublish from "../publish";
import ImageStore from "../imageStore";
import {i18n} from "../i18n";
import {errorMessage} from "../uploader/errorUtils";
import type {Verdict} from "../uploader/localImageFilter";
import {countVerdicts, filterRows, testNote, testVault, type NoteTestResult, type TestRow} from "../uploader/filterTest";
import PathSuggestModal from "./pathSuggestModal";

const PAGE_SIZE = 100;
const VERDICTS: Verdict[] = ["included", "excluded", "outOfScope", "notFound"];

type TestScope = "note" | "vault";

/**
 * Shows which images the selected store would upload under the current
 * folder conditions. Read-only: see uploader/filterTest.ts for what it
 * deliberately does not touch.
 */
export default class FilterTestModal extends Modal {
    private testScope: TestScope = "note";
    private rows: TestRow[] = [];
    private noteExtras: NoteTestResult | null = null;
    private verdict: Verdict | "all" = "all";
    private query = "";
    private page = 0;
    /** Bumped per run so a slow note read cannot overwrite a newer result. */
    private runId = 0;
    private resultsEl: HTMLElement;
    private noteRowEl: HTMLElement;

    constructor(app: App, private readonly plugin: ObsidianPublish, private note: TFile | null) {
        super(app);
    }

    onOpen(): void {
        const t = i18n().filterTest;
        const {contentEl} = this;
        contentEl.empty();
        contentEl.addClass("iut-filter-test");
        this.titleEl.setText(t.title);

        contentEl.createDiv({cls: "iut-filter-test-disclaimer", text: t.disclaimer});
        const storeId = ImageStore.normalizeId(this.plugin.settings.imageStore);
        const storeName = ImageStore.lists.find(s => s.id === storeId)?.description ?? storeId;
        contentEl.createDiv({cls: "setting-item-description", text: t.store(storeName)});

        const scopeEl = contentEl.createDiv({cls: "iut-filter-test-scope"});
        const noteButton = new ButtonComponent(scopeEl).setButtonText(t.scopeNote);
        const vaultButton = new ButtonComponent(scopeEl).setButtonText(t.scopeVault);
        const selectScope = (scope: TestScope) => {
            this.testScope = scope;
            noteButton.buttonEl.toggleClass("mod-cta", scope === "note");
            vaultButton.buttonEl.toggleClass("mod-cta", scope === "vault");
            this.noteRowEl.toggle(scope === "note");
            void this.run();
        };
        noteButton.onClick(() => selectScope("note"));
        vaultButton.onClick(() => selectScope("vault"));

        this.noteRowEl = contentEl.createDiv({cls: "iut-filter-test-note"});
        const controlsEl = contentEl.createDiv({cls: "iut-filter-test-controls"});
        new DropdownComponent(controlsEl)
            .addOption("all", t.allVerdicts)
            .addOptions(Object.fromEntries(VERDICTS.map(v => [v, t.verdict[v]])))
            .setValue(this.verdict)
            .onChange(value => {
                this.verdict = value as Verdict | "all";
                this.page = 0;
                this.renderResults();
            });
        new TextComponent(controlsEl)
            .setPlaceholder(t.search)
            .onChange(value => {
                this.query = value;
                this.page = 0;
                this.renderResults();
            });

        this.resultsEl = contentEl.createDiv({cls: "iut-filter-test-results"});
        selectScope("note");
    }

    onClose(): void {
        this.contentEl.empty();
    }

    private renderNoteRow(): void {
        const t = i18n().filterTest;
        this.noteRowEl.empty();
        this.noteRowEl.createSpan({text: this.note ? t.note(this.note.path) : t.noNote});
        new ButtonComponent(this.noteRowEl)
            .setButtonText(t.changeNote)
            .onClick(() => {
                const notes = this.app.vault.getMarkdownFiles().sort((a, b) => a.path.localeCompare(b.path));
                new PathSuggestModal(this.app, notes, t.pickNote, note => {
                    this.note = note;
                    void this.run();
                }).open();
            });
    }

    /**
     * Unsaved edits count: a note open in an editor is read from that editor,
     * which is also what publishing reads. Any other note comes from disk.
     */
    private async readNote(note: TFile): Promise<string> {
        for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
            const view = leaf.view;
            if (view instanceof MarkdownView && view.file?.path === note.path) {
                return view.editor.getValue();
            }
        }
        return this.app.vault.cachedRead(note);
    }

    private async run(): Promise<void> {
        const runId = ++this.runId;
        this.page = 0;
        this.noteExtras = null;
        this.rows = [];
        if (this.testScope === "vault") {
            this.rows = testVault(this.app, this.plugin.settings);
            this.renderResults();
            return;
        }
        this.renderNoteRow();
        if (!this.note) {
            this.renderResults();
            return;
        }
        try {
            const text = await this.readNote(this.note);
            if (runId !== this.runId) return;
            this.noteExtras = testNote(this.app, this.plugin.settings, text, this.note.path);
            this.rows = this.noteExtras.rows;
        } catch (e) {
            if (runId !== this.runId) return;
            this.resultsEl.empty();
            this.resultsEl.createDiv({cls: "mod-warning", text: i18n().filterTest.readFailed(errorMessage(e))});
            return;
        }
        this.renderResults();
    }

    private renderResults(): void {
        const t = i18n().filterTest;
        const el = this.resultsEl;
        el.empty();

        const counts = countVerdicts(this.rows);
        const summary = el.createDiv({cls: "iut-filter-test-summary"});
        for (const v of VERDICTS) {
            summary.createSpan({cls: `iut-verdict-${v}`, text: t.count(t.verdict[v], counts[v])});
        }

        const visible = filterRows(this.rows, this.verdict, this.query);
        if (visible.length === 0) {
            el.createDiv({cls: "setting-item-description", text: t.empty});
        } else {
            const pages = Math.ceil(visible.length / PAGE_SIZE);
            this.page = Math.min(this.page, pages - 1);
            const table = el.createEl("table", {cls: "iut-filter-test-table"});
            const head = table.createEl("thead").createEl("tr");
            head.createEl("th", {text: t.column.path});
            head.createEl("th", {text: t.column.verdict});
            head.createEl("th", {text: t.column.reason});
            if (this.testScope === "note") head.createEl("th", {text: t.column.refs});
            const body = table.createEl("tbody");
            for (const row of visible.slice(this.page * PAGE_SIZE, (this.page + 1) * PAGE_SIZE)) {
                const tr = body.createEl("tr");
                tr.createEl("td", {cls: "iut-filter-test-path", text: row.path});
                tr.createEl("td", {cls: `iut-verdict-${row.verdict}`, text: t.verdict[row.verdict]});
                tr.createEl("td", {text: row.reason});
                if (this.testScope === "note") tr.createEl("td", {text: String(row.refs)});
            }

            if (pages > 1) {
                const pager = el.createDiv({cls: "iut-filter-test-pager"});
                new ButtonComponent(pager).setButtonText(t.prev).setDisabled(this.page === 0)
                    .onClick(() => { this.page--; this.renderResults(); });
                pager.createSpan({text: t.page(this.page + 1, pages, visible.length)});
                new ButtonComponent(pager).setButtonText(t.next).setDisabled(this.page >= pages - 1)
                    .onClick(() => { this.page++; this.renderResults(); });
            }
        }

        if (this.testScope === "note" && this.noteExtras) {
            const {web, mermaid} = this.noteExtras;
            const settings = this.plugin.settings;
            if (web.total > 0 || mermaid > 0) {
                const other = el.createDiv({cls: "iut-filter-test-other"});
                other.createDiv({cls: "iut-filter-test-other-heading", text: t.otherHeading});
                if (web.total > 0) {
                    other.createDiv({text: settings.uploadWebImages ? t.webOn(web.total, web.hosted) : t.webOff(web.total)});
                }
                if (mermaid > 0) {
                    other.createDiv({text: settings.convertMermaid ? t.mermaidOn(mermaid) : t.mermaidOff(mermaid)});
                }
            }
        }
    }
}
