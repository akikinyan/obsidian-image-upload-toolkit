import { afterEach, describe, expect, it } from "vitest";
import {
  activeLocale,
  catalogue,
  LOCALE_IDS,
  LOCALE_NAMES,
  resolveLocale,
  setLocaleOverride,
} from "../../src/i18n";

type Leaf = string | ((...args: never[]) => string);

/** Flatten a catalogue into dotted key paths, so two locales can be compared leaf by leaf. */
function leaves(node: unknown, prefix = ""): Map<string, Leaf> {
  const out = new Map<string, Leaf>();
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string" || typeof value === "function") {
      out.set(path, value as Leaf);
    } else {
      for (const [k, v] of leaves(value, path)) out.set(k, v);
    }
  }
  return out;
}

const english = leaves(catalogue("en"));

describe("resolveLocale", () => {
  it.each([
    ["", "en"],
    ["en", "en"],
    ["ja", "ja"],
    ["zh", "zh-CN"],
    ["zh-CN", "zh-CN"],
    ["zh-TW", "zh-TW"],
    ["zh-HK", "zh-TW"],
    ["ko", "ko"],
    ["de", "de"],
    ["es", "es"],
    ["fr", "fr"],
    ["pt-BR", "pt-BR"],
    ["pt", "pt-BR"],
    ["ru", "ru"],
    ["it", "en"],
    ["xx-YY", "en"],
  ])("maps Obsidian's %j to %s", (raw, expected) => {
    expect(resolveLocale(raw)).toBe(expected);
  });
});

describe("locale selection", () => {
  afterEach(() => {
    setLocaleOverride("auto");
    window.localStorage.removeItem("language");
  });

  it("follows Obsidian's language when set to auto", () => {
    window.localStorage.setItem("language", "zh");
    setLocaleOverride("auto");
    expect(activeLocale()).toBe("zh-CN");
  });

  it("pins any shipped locale regardless of Obsidian's language", () => {
    window.localStorage.setItem("language", "ja");
    for (const id of LOCALE_IDS) {
      setLocaleOverride(id);
      expect(activeLocale()).toBe(id);
    }
  });

  it("falls back to auto for unknown or missing settings", () => {
    window.localStorage.setItem("language", "ko");
    setLocaleOverride("xx" as never);
    expect(activeLocale()).toBe("ko");
    setLocaleOverride(undefined);
    expect(activeLocale()).toBe("ko");
  });
});

describe("catalogues", () => {
  it("names every locale in the language dropdown", () => {
    expect(Object.keys(LOCALE_NAMES).sort()).toEqual([...LOCALE_IDS].sort());
  });

  describe.each(LOCALE_IDS)("%s", (id) => {
    const messages = leaves(catalogue(id));

    it("has exactly the English keys", () => {
      expect([...messages.keys()].sort()).toEqual([...english.keys()].sort());
    });

    it("has no empty strings", () => {
      for (const [path, value] of messages) {
        if (typeof value === "string") expect(value.trim(), path).not.toBe("");
      }
    });

    it("interpolates every argument of every message function", () => {
      for (const [path, value] of messages) {
        if (typeof value !== "function") continue;
        expect(value.length, path).toBe((english.get(path) as (...a: never[]) => string).length);
        // Distinct positive numbers, so a dropped or swapped argument cannot hide
        // and English's "only if > 0" branches are all taken.
        const args = Array.from({ length: value.length }, (_, i) => 7001 + i);
        const text = (value as (...a: number[]) => string)(...args);
        for (const arg of args) expect(text, path).toContain(String(arg));
      }
    });
  });
});
