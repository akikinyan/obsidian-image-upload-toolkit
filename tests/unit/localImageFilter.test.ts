import { describe, expect, it } from "vitest";
import {
  classify,
  filterFor,
  isInFolder,
  renameFolderInFilters,
  type LocalImageFilter,
} from "../../src/uploader/localImageFilter";
import type { PublishSettings } from "../../src/publish";

const filter = (overrides: Partial<LocalImageFilter> = {}): LocalImageFilter => ({
  scope: "all",
  includeFolders: [],
  excludeFolders: [],
  ...overrides,
});

describe("isInFolder", () => {
  it("matches the folder and anything below it", () => {
    expect(isInFolder("90_Attachments/Weather/a.png", "90_Attachments/Weather")).toBe(true);
    expect(isInFolder("90_Attachments/Weather/2026/10/a.png", "90_Attachments/Weather")).toBe(true);
  });

  it("respects path segment boundaries", () => {
    expect(isInFolder("90_Attachments/WeatherOld/a.png", "90_Attachments/Weather")).toBe(false);
    expect(isInFolder("90_Attachments/Weather.png", "90_Attachments/Weather")).toBe(false);
  });

  it("ignores leading and trailing slashes on the folder", () => {
    expect(isInFolder("90_Attachments/Weather/a.png", "/90_Attachments/Weather/")).toBe(true);
  });
});

describe("classify", () => {
  it("uploads everything when the store has no filter, as before", () => {
    expect(classify("anywhere/a.png", undefined).verdict).toBe("included");
  });

  it("reports an unresolved image as not found before any folder rule", () => {
    const f = filter({ excludeFolders: ["90_Attachments/Weather"] });
    expect(classify(null, f).verdict).toBe("notFound");
  });

  it("excludes only the excluded folder when the scope is all", () => {
    const f = filter({ excludeFolders: ["90_Attachments/Weather"] });
    expect(classify("90_Attachments/Weather/a.png", f).verdict).toBe("excluded");
    expect(classify("90_Attachments/WeatherOld/a.png", f).verdict).toBe("included");
    expect(classify("elsewhere/a.png", f).verdict).toBe("included");
  });

  it("lets exclusion win over a target folder and keeps both reasons", () => {
    const f = filter({
      scope: "selected",
      includeFolders: ["90_Attachments"],
      excludeFolders: ["90_Attachments/Weather"],
    });
    const result = classify("90_Attachments/Weather/a.png", f);
    expect(result.verdict).toBe("excluded");
    expect(result.includeHits).toEqual(["90_Attachments"]);
    expect(result.excludeHits).toEqual(["90_Attachments/Weather"]);
    expect(classify("90_Attachments/b.png", f).verdict).toBe("included");
    expect(classify("other/c.png", f).verdict).toBe("outOfScope");
  });

  it("uploads nothing when only selected folders count and none is selected", () => {
    const f = filter({ scope: "selected" });
    expect(classify("90_Attachments/a.png", f).verdict).toBe("outOfScope");
  });

  it("ignores target folders while the scope is all", () => {
    const f = filter({ scope: "all", includeFolders: ["90_Attachments"] });
    const result = classify("other/a.png", f);
    expect(result.verdict).toBe("included");
    expect(result.includeHits).toEqual([]);
  });

  it("tolerates hand-edited lists that are not arrays", () => {
    const f = { scope: "all", includeFolders: "x", excludeFolders: null } as unknown as LocalImageFilter;
    expect(classify("a.png", f).verdict).toBe("included");
  });
});

describe("filterFor", () => {
  it("looks the filter up by the normalized store id", () => {
    const f = filter({ excludeFolders: ["x"] });
    const settings = { imageStore: "AWS_S3", localImageFilters: { AWS_S3: f } } as unknown as PublishSettings;
    expect(filterFor(settings)).toBe(f);
  });

  it("returns undefined for settings without filters", () => {
    expect(filterFor({ imageStore: "AWS_S3" } as unknown as PublishSettings)).toBeUndefined();
  });
});

describe("renameFolderInFilters", () => {
  it("follows a rename of the folder itself in every store", () => {
    const filters = {
      s3: filter({ excludeFolders: ["90_Attachments/Weather"] }),
      r2: filter({ scope: "selected", includeFolders: ["90_Attachments/Weather"] }),
    };
    expect(renameFolderInFilters(filters, "90_Attachments/Weather", "90_Attachments/Climate")).toBe(true);
    expect(filters.s3.excludeFolders).toEqual(["90_Attachments/Climate"]);
    expect(filters.r2.includeFolders).toEqual(["90_Attachments/Climate"]);
  });

  it("follows a rename of a parent folder", () => {
    const filters = {
      s3: filter({ includeFolders: ["90_Attachments"], excludeFolders: ["90_Attachments/Weather"] }),
    };
    expect(renameFolderInFilters(filters, "90_Attachments", "Attachments")).toBe(true);
    expect(filters.s3.includeFolders).toEqual(["Attachments"]);
    expect(filters.s3.excludeFolders).toEqual(["Attachments/Weather"]);
  });

  it("is a no-op for the descendant events that follow the parent rename", () => {
    const filters = { s3: filter({ excludeFolders: ["Attachments/Weather"] }) };
    expect(renameFolderInFilters(filters, "90_Attachments/Weather", "Attachments/Weather")).toBe(false);
    expect(filters.s3.excludeFolders).toEqual(["Attachments/Weather"]);
  });

  it("does not touch folders that merely share a name prefix", () => {
    const filters = { s3: filter({ excludeFolders: ["90_Attachments/WeatherOld"] }) };
    expect(renameFolderInFilters(filters, "90_Attachments/Weather", "x")).toBe(false);
    expect(filters.s3.excludeFolders).toEqual(["90_Attachments/WeatherOld"]);
  });

  it("drops a duplicate created by moving one listed folder onto another", () => {
    const filters = { s3: filter({ excludeFolders: ["a", "b"] }) };
    expect(renameFolderInFilters(filters, "a", "b")).toBe(true);
    expect(filters.s3.excludeFolders).toEqual(["b"]);
  });
});
