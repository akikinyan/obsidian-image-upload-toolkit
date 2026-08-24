/**
 * WebP conversion for local images.
 *
 * Conversion happens in the Obsidian renderer through a canvas, the same route
 * MermaidProcessor uses to rasterize diagrams, so no encoder dependency is
 * needed. That also sets the limits: a canvas holds one frame and one raster,
 * so animated GIFs would lose every frame but the first and SVGs would lose
 * their scalability. Neither is in the default extension list for that reason.
 */

export interface WebpSetting {
    /** Master switch for the whole feature. */
    enabled: boolean;
    /** Extensions to convert, lower case and without the dot. */
    extensions: string[];
    /** Encoder quality, 1–100. */
    quality: number;
    /** Also upload the untouched original alongside the WebP. */
    keepOriginal: boolean;
    /** Path template for the originals, used only by stores that have one. */
    originalPath: string;
    /** Frontmatter property that turns conversion on or off for one note. */
    frontmatterProperty: string;
    /** Applied when the note does not define that property. */
    frontmatterDefault: boolean;
}

export const DEFAULT_WEBP_SETTING: WebpSetting = {
    enabled: false,
    extensions: ["png", "jpg", "jpeg"],
    quality: 80,
    keepOriginal: false,
    originalPath: "/originals/{year}/{mon}/{day}/{filename}",
    frontmatterProperty: "webp",
    frontmatterDefault: true,
};

/**
 * Chromium refuses to allocate a canvas past roughly this size in either
 * dimension. Rather than silently downscaling — which would change the image
 * without the user asking — oversized inputs are left unconverted.
 */
const MAX_CANVAS_DIMENSION = 16384;

/** Parse the comma-separated extension list from the settings field. */
export function parseExtensions(raw: string): string[] {
    return raw
        .split(",")
        .map(part => part.trim().toLowerCase().replace(/^\./, ""))
        .filter(part => part.length > 0);
}

/** Render an extension list back into the settings field. */
export function formatExtensions(extensions: string[]): string {
    return extensions.join(", ");
}

export function matchesExtension(fileName: string, extensions: string[]): boolean {
    const dot = fileName.lastIndexOf(".");
    if (dot < 0) return false;
    const ext = fileName.slice(dot + 1).toLowerCase();
    return extensions.includes(ext);
}

/**
 * Whether the active note opts in to conversion.
 *
 * The property is read as a tri-state: `true` and `false` decide, and anything
 * else (absent, empty, unparseable) falls back to the configured default. That
 * is what makes the switch work in both directions — leave the default on and
 * mark the odd note `false`, or leave it off and mark the odd note `true`.
 */
export function resolveNoteOptIn(
    frontmatter: Record<string, unknown> | undefined | null,
    property: string,
    fallback: boolean,
): boolean {
    if (!frontmatter || !property) return fallback;
    const raw = frontmatter[property];
    if (typeof raw === "boolean") return raw;
    if (typeof raw === "string") {
        const value = raw.trim().toLowerCase();
        if (["true", "yes", "on", "1"].includes(value)) return true;
        if (["false", "no", "off", "0"].includes(value)) return false;
    }
    return fallback;
}

/** Replace the extension of a file name with `.webp`. */
export function toWebpName(fileName: string): string {
    const dot = fileName.lastIndexOf(".");
    return (dot < 0 ? fileName : fileName.slice(0, dot)) + ".webp";
}

/**
 * Encode `file` as WebP, or return null when that is not possible: an image the
 * renderer cannot decode, a raster too large for a canvas, or an encoder that
 * declines. Callers fall back to the original in every one of those cases.
 *
 * Alpha is preserved — unlike the mermaid path, the canvas is not pre-filled
 * with white, so transparent PNGs stay transparent.
 */
export async function convertToWebp(file: File, quality: number): Promise<File | null> {
    const clamped = Math.min(100, Math.max(1, Math.round(quality))) / 100;

    let bitmap: ImageBitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch (e) {
        console.warn(`Image upload toolkit: could not decode ${file.name} for WebP conversion`, e);
        return null;
    }

    try {
        if (bitmap.width > MAX_CANVAS_DIMENSION || bitmap.height > MAX_CANVAS_DIMENSION) {
            console.warn(
                `Image upload toolkit: ${file.name} is ${bitmap.width}x${bitmap.height}, ` +
                `too large to convert without downscaling; uploading the original`,
            );
            return null;
        }

        const canvas = activeDocument.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(bitmap, 0, 0);

        const blob = await new Promise<Blob | null>(resolve => {
            canvas.toBlob(resolve, "image/webp", clamped);
        });
        // A renderer without a WebP encoder hands back a PNG instead of failing.
        if (!blob || blob.type !== "image/webp") return null;

        return new File([blob], toWebpName(file.name), {type: "image/webp"});
    } finally {
        bitmap.close();
    }
}
