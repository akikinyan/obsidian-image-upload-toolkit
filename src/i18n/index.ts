import en, {type Messages} from "./locales/en";
import ja from "./locales/ja";

export type LocaleId = "en" | "ja";
export type LocaleSetting = "auto" | LocaleId;

const CATALOGUES: Record<LocaleId, Messages> = {en, ja};

let override: LocaleSetting = "auto";

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
    return raw.toLowerCase().startsWith("ja") ? "ja" : "en";
}

export function setLocaleOverride(setting: LocaleSetting | undefined): void {
    override = setting === "en" || setting === "ja" ? setting : "auto";
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
