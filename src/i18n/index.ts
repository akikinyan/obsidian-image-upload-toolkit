import en, {type Messages} from "./locales/en";
import ja from "./locales/ja";
import zhCN from "./locales/zh-CN";
import zhTW from "./locales/zh-TW";
import ko from "./locales/ko";
import de from "./locales/de";
import es from "./locales/es";
import fr from "./locales/fr";
import ptBR from "./locales/pt-BR";
import ru from "./locales/ru";

export type LocaleId = "en" | "ja" | "zh-CN" | "zh-TW" | "ko" | "de" | "es" | "fr" | "pt-BR" | "ru";
export type LocaleSetting = "auto" | LocaleId;

const CATALOGUES: Record<LocaleId, Messages> = {
    en,
    ja,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
    ko,
    de,
    es,
    fr,
    "pt-BR": ptBR,
    ru,
};

/** Every shipped locale, in the order the language dropdown lists them. */
export const LOCALE_IDS = Object.keys(CATALOGUES) as LocaleId[];

/**
 * Each language's name for itself. Kept out of the catalogues because these
 * labels read the same whatever language the interface is in.
 */
export const LOCALE_NAMES: Record<LocaleId, string> = {
    en: "English",
    ja: "日本語",
    "zh-CN": "简体中文",
    "zh-TW": "繁體中文",
    ko: "한국어",
    de: "Deutsch",
    es: "Español",
    fr: "Français",
    "pt-BR": "Português (Brasil)",
    ru: "Русский",
};

let override: LocaleSetting = "auto";

function isLocaleId(value: unknown): value is LocaleId {
    return typeof value === "string" && (LOCALE_IDS as string[]).includes(value);
}

/**
 * Map an Obsidian language code to a shipped locale. Obsidian stores Simplified
 * Chinese as "zh" and Traditional as "zh-TW"; Hong Kong and Macau variants are
 * treated as Traditional, and any Portuguese falls back to the Brazilian one.
 */
export function resolveLocale(raw: string): LocaleId {
    const code = raw.toLowerCase();
    if (/^zh[-_](tw|hk|mo|hant)/.test(code)) return "zh-TW";
    if (code.startsWith("zh")) return "zh-CN";
    if (code.startsWith("pt")) return "pt-BR";
    const base = code.split(/[-_]/)[0];
    return isLocaleId(base) ? base : "en";
}

/**
 * Obsidian stores the UI language in localStorage under "language" (empty for
 * English). Reading it directly avoids pulling in `moment`, which keeps the unit
 * tests free of extra mocks.
 */
function detectLocale(): LocaleId {
    let raw = "";
    try {
        raw = window.localStorage.getItem("language") ?? "";
    } catch {
        // localStorage can be unavailable in exotic contexts; fall through to English.
    }
    return resolveLocale(raw);
}

export function setLocaleOverride(setting: LocaleSetting | undefined): void {
    override = isLocaleId(setting) ? setting : "auto";
}

export function activeLocale(): LocaleId {
    return override === "auto" ? detectLocale() : override;
}

/**
 * The message catalogue for the active locale.
 *
 * Resolved on every call rather than cached, so switching the language in the
 * settings tab takes effect on the next render without a plugin reload.
 */
export function i18n(): Messages {
    return CATALOGUES[activeLocale()];
}

/** The catalogue for a specific locale, for tests that check every translation. */
export function catalogue(locale: LocaleId): Messages {
    return CATALOGUES[locale];
}
