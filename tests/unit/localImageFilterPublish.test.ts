import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "obsidian";
import ImageTagProcessor, { ACTION_PUBLISH } from "../../src/uploader/imageTagProcessor";
import type ImageUploader from "../../src/uploader/imageUploader";
import type { PublishSettings } from "../../src/publish";
import ImageStore from "../../src/imageStore";
import { DEFAULT_WEBP_SETTING } from "../../src/uploader/webpConverter";
import { testNote, testVault } from "../../src/uploader/filterTest";

const STORE = ImageStore.TENCENTCLOUD_COS.id;

const makeSettings = (overrides: any = {}) =>
  ({
    imageAltText: true,
    replaceOriginalDoc: false,
    ignoreProperties: false,
    imageStore: STORE,
    uploadWebImages: false,
    convertMermaid: false,
    webpSetting: DEFAULT_WEBP_SETTING,
    ...overrides,
  }) as any as PublishSettings;

const excludeWeather = {
  [STORE]: { scope: "all", includeFolders: [], excludeFolders: ["90_Attachments/Weather"] },
};

const LINKS: Record<string, string> = {
  "sun.png": "90_Attachments/Weather/sun.png",
  "old.png": "90_Attachments/WeatherOld/old.png",
  "pic.png": "90_Attachments/pic.png",
  "../90_Attachments/pic.png": "90_Attachments/pic.png",
  "x.png": "elsewhere/x.png",
};

/**
 * A stub vault where `LINKS` is the link index and its values are the files
 * that exist. `extraFiles` exist on disk without being in the link index.
 */
function setup(markdown: string, extraFiles: string[] = []) {
  const app = new App() as any;
  const setValue = vi.fn();
  app.workspace.getActiveFile = () => ({ path: "notes/note.md", name: "note.md" });
  app.workspace.getActiveViewOfType = () => ({ editor: { getValue: () => markdown, setValue } });
  app.metadataCache.getFirstLinkpathDest = (link: string) => {
    const resolved = LINKS[link];
    return resolved ? { path: resolved, name: resolved.split("/").pop() } : null;
  };
  const existing = new Set([...Object.values(LINKS), ...extraFiles]);
  app.vault.getAbstractFileByPath = (p: string) => (existing.has(p) ? { path: p } : null);

  const uploadedPaths: string[] = [];
  const uploader: ImageUploader = {
    upload: vi.fn(async (image: File, fullPath: string) => {
      uploadedPaths.push(fullPath.replace("/mock/vault/", ""));
      return `https://cdn.example.com/${image.name}`;
    }),
  };
  return { app, setValue, uploader, uploadedPaths };
}

let writeText: ReturnType<typeof vi.fn>;

beforeEach(() => {
  writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(globalThis.navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
});

describe("publishing with folder filters", () => {
  it("leaves excluded images local and still uploads their neighbours", async () => {
    const { app, uploader, uploadedPaths } = setup("![[sun.png]] ![[old.png]] ![[pic.png]]");
    const settings = makeSettings({ localImageFilters: excludeWeather });

    await new ImageTagProcessor(app, settings, uploader, false).process(ACTION_PUBLISH);

    expect(uploadedPaths.sort()).toEqual(["90_Attachments/WeatherOld/old.png", "90_Attachments/pic.png"]);
    expect(writeText).toHaveBeenCalledWith(
      "![[sun.png]] ![old](https://cdn.example.com/old.png) ![pic](https://cdn.example.com/pic.png)",
    );
  });

  it("keeps the old behavior for settings saved before filters existed", async () => {
    const { app, uploader, uploadedPaths } = setup("![[sun.png]]");

    await new ImageTagProcessor(app, makeSettings(), uploader, false).process(ACTION_PUBLISH);

    expect(uploadedPaths).toEqual(["90_Attachments/Weather/sun.png"]);
  });

  it("does not look up or reuse a cached URL for an excluded image", async () => {
    const cache = {
      load: vi.fn(async () => {}),
      save: vi.fn(async () => {}),
      get: vi.fn(() => "https://cdn.example.com/cached.png"),
      set: vi.fn(),
    };
    const { app, uploader } = setup("![[sun.png]]");
    const settings = makeSettings({ localImageFilters: excludeWeather });

    await new ImageTagProcessor(app, settings, uploader, false, cache as any).process(ACTION_PUBLISH);

    expect(cache.get).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
    expect(uploader.upload).not.toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith("![[sun.png]]");
  });

  it("uploads nothing local when only selected folders count and none is chosen", async () => {
    const { app, uploader } = setup("![[pic.png]]");
    const settings = makeSettings({
      localImageFilters: { [STORE]: { scope: "selected", includeFolders: [], excludeFolders: [] } },
    });

    await new ImageTagProcessor(app, settings, uploader, false).process(ACTION_PUBLISH);

    expect(uploader.upload).not.toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith("![[pic.png]]");
  });

  it("applies the filter of the selected store only", async () => {
    const { app, uploader, uploadedPaths } = setup("![[sun.png]]");
    const settings = makeSettings({
      imageStore: ImageStore.AWS_S3.id,
      localImageFilters: excludeWeather,
    });

    await new ImageTagProcessor(app, settings, uploader, false).process(ACTION_PUBLISH);

    expect(uploadedPaths).toEqual(["90_Attachments/Weather/sun.png"]);
  });

  it("uploads an image once but rewrites every link to it", async () => {
    const { app, uploader, uploadedPaths } = setup("![[pic.png]] and ![](../90_Attachments/pic.png)");

    await new ImageTagProcessor(app, makeSettings(), uploader, false).process(ACTION_PUBLISH);

    expect(uploadedPaths).toEqual(["90_Attachments/pic.png"]);
    expect(writeText).toHaveBeenCalledWith(
      "![pic](https://cdn.example.com/pic.png) and ![pic](https://cdn.example.com/pic.png)",
    );
  });

  it("rewrites every link in the note when updating the original, and only those", async () => {
    const { app, uploader, setValue } = setup("![[pic.png]] ![](../90_Attachments/pic.png) ![[sun.png]]");
    const settings = makeSettings({ localImageFilters: excludeWeather, replaceOriginalDoc: true });

    await new ImageTagProcessor(app, settings, uploader, false).process(ACTION_PUBLISH);

    expect(setValue).toHaveBeenCalledWith(
      "![pic](https://cdn.example.com/pic.png) ![pic](https://cdn.example.com/pic.png) ![[sun.png]]",
    );
  });

  it("accepts a link the link index misses when the vault holds that exact path", async () => {
    const { app, uploader, uploadedPaths } = setup("![](90_Attachments/Weather/rain.png)", [
      "90_Attachments/Weather/rain.png",
    ]);

    await new ImageTagProcessor(app, makeSettings(), uploader, false).process(ACTION_PUBLISH);
    expect(uploadedPaths).toEqual(["90_Attachments/Weather/rain.png"]);

    // ...and the folder filter applies to it like any other image.
    const filteredRun = setup("![](90_Attachments/Weather/rain.png)", ["90_Attachments/Weather/rain.png"]);
    const settings = makeSettings({ localImageFilters: excludeWeather });
    await new ImageTagProcessor(filteredRun.app, settings, filteredRun.uploader, false).process(ACTION_PUBLISH);
    expect(filteredRun.uploader.upload).not.toHaveBeenCalled();
  });

  it("does not upload a link that matches no file", async () => {
    const { app, uploader } = setup("![](missing/ghost.png)");

    await new ImageTagProcessor(app, makeSettings(), uploader, false).process(ACTION_PUBLISH);

    expect(uploader.upload).not.toHaveBeenCalled();
  });
});

describe("filter test dry run", () => {
  const selected = {
    [STORE]: { scope: "selected", includeFolders: ["90_Attachments"], excludeFolders: ["90_Attachments/Weather"] },
  };
  const markdown = [
    "![[sun.png]] ![[old.png]] ![[x.png]] ![](nope.png) ![[pic.png]] ![](../90_Attachments/pic.png)",
    "![w](https://example.com/w.png) ![w](https://example.com/w.png)",
    "```mermaid",
    "graph TD",
    "```",
  ].join("\n");

  it("gives the verdicts that publishing acts on", async () => {
    const { app, uploader, uploadedPaths } = setup(markdown);
    const settings = makeSettings({ localImageFilters: selected });

    const result = testNote(app, settings, markdown, "notes/note.md");
    expect(Object.fromEntries(result.rows.map(r => [r.path, [r.verdict, r.refs]]))).toEqual({
      "90_Attachments/Weather/sun.png": ["excluded", 1],
      "90_Attachments/WeatherOld/old.png": ["included", 1],
      "90_Attachments/pic.png": ["included", 2],
      "elsewhere/x.png": ["outOfScope", 1],
      "nope.png": ["notFound", 1],
    });
    expect(result.web).toEqual({ total: 1, hosted: 0 });
    expect(result.mermaid).toBe(1);

    await new ImageTagProcessor(app, settings, uploader, false).process(ACTION_PUBLISH);
    const expected = result.rows.filter(r => r.verdict === "included").map(r => r.path);
    expect(uploadedPaths.sort()).toEqual(expected.sort());
  });

  it("names both folders when an exclusion overrides a target folder", () => {
    const { app } = setup(markdown);
    const row = testNote(app, makeSettings({ localImageFilters: selected }), markdown, "notes/note.md")
      .rows.find(r => r.verdict === "excluded");

    expect(row?.reason).toContain("90_Attachments/Weather");
    expect(row?.reason).toMatch(/90_Attachments[^/]/);
  });

  it("does not upload, write the clipboard or change the editor", () => {
    const { app, uploader, setValue } = setup(markdown);
    app.vault.getFiles = () => [
      { path: "90_Attachments/Weather/sun.png" },
      { path: "90_Attachments/WeatherOld/old.png" },
      { path: "notes/note.md" },
    ];
    const settings = makeSettings({ localImageFilters: selected, uploadWebImages: true, convertMermaid: true });

    testNote(app, settings, markdown, "notes/note.md");
    const vaultRows = testVault(app, settings);

    expect(vaultRows.map(r => [r.path, r.verdict])).toEqual([
      ["90_Attachments/Weather/sun.png", "excluded"],
      ["90_Attachments/WeatherOld/old.png", "included"],
    ]);
    expect(uploader.upload).not.toHaveBeenCalled();
    expect(setValue).not.toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });
});
