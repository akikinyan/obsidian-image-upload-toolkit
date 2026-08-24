/** Human-readable byte counts and size deltas, shared by the progress modal. */

const UNITS = ["B", "KB", "MB", "GB"];

/**
 * Format a byte count for display. Deliberately locale-independent: the unit
 * suffixes are the same in every language this plugin ships, and a translated
 * "1.2 MB" would only differ in the decimal separator.
 */
export function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes < 0) return "-";
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < UNITS.length - 1) {
        value /= 1024;
        unit++;
    }
    // Bytes are whole; larger units get one decimal, dropped when it is zero.
    const rounded = unit === 0 ? String(Math.round(value)) : value.toFixed(1).replace(/\.0$/, "");
    return `${rounded} ${UNITS[unit]}`;
}

/**
 * The size change from `from` to `to`, as a signed percentage string such as
 * "-72%". Negative means smaller, which is the outcome conversion aims for.
 */
export function formatSizeDelta(from: number, to: number): string {
    if (!Number.isFinite(from) || from <= 0 || !Number.isFinite(to) || to < 0) return "";
    const change = Math.round(((to - from) / from) * 100);
    return `${change > 0 ? "+" : ""}${change}%`;
}
