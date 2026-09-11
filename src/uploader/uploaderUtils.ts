const EXTENSION_MIME_MAP: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    bmp: "image/bmp",
    avif: "image/avif",
    ico: "image/x-icon",
    tif: "image/tiff",
    tiff: "image/tiff",
};

export class UploaderUtils {
    /**
     * The Content-Type an upload should be stored under.
     *
     * Omitting it makes S3 fall back to binary/octet-stream, which sends a
     * browser to a download prompt when the URL is opened directly. `<img>`
     * tags sniff the bytes and render regardless, so the omission survives
     * casual testing.
     *
     * The file's own type wins where it has one — the WebP converter sets it —
     * and the extension decides otherwise, because files read out of the vault
     * are constructed without a type. An unrecognised extension falls back to
     * octet-stream rather than to a fabricated `image/<ext>`, which is not a
     * registered media type and helps nobody.
     */
    static resolveContentType(file: File): string {
        if (file.type) return file.type;
        const dot = file.name.lastIndexOf(".");
        const ext = dot < 0 ? "" : file.name.slice(dot + 1).toLowerCase();
        return EXTENSION_MIME_MAP[ext] ?? "application/octet-stream";
    }

    /**
     * The note-derived path variables for a vault-relative note path.
     *
     * `folderName` is the name of the folder the note sits in, not the whole
     * relative path: a note at `notes/2026/trip.md` gives `2026`. A note at the
     * vault root has no folder, so it gives "".
     *
     * Derived from the path rather than from TFile.parent/basename so it stays
     * a pure function, testable without a vault.
     */
    static noteVariables(notePath: string): {folderName: string; noteName: string} {
        const segments = (notePath ?? "").split("/").filter(segment => segment.length > 0);
        const fileName = segments.pop() ?? "";
        return {
            folderName: segments.pop() ?? "",
            noteName: fileName.replace(/\.md$/i, ""),
        };
    }

    /**
     * Substitute {foldername} and {notename} into a path template.
     *
     * Returns the template unchanged when it uses neither, so callers can tell
     * that nothing note-specific is in play and skip rebuilding an uploader.
     *
     * A note at the vault root expands {foldername} to "", which would leave
     * `images/{foldername}/{filename}` as `images//pic.png`. An empty path
     * segment is not the same key as none: S3-family stores accept it and
     * serve a URL with a double slash that is awkward to type and easy to
     * break later. So runs of slashes collapse to one.
     */
    static expandNoteVariables(pathTmpl: string, notePath: string): string {
        if (!pathTmpl.includes("{foldername}") && !pathTmpl.includes("{notename}")) {
            return pathTmpl;
        }
        const {folderName, noteName} = this.noteVariables(notePath);
        return pathTmpl
            .replaceAll("{foldername}", folderName)
            .replaceAll("{notename}", noteName)
            .replace(/\/{2,}/g, "/");
    }

    static generateName(pathTmpl: string | undefined, imageName: string): string {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = this.generateRandomString(20);

        if (pathTmpl == undefined || pathTmpl.trim().length === 0) {
            return imageName;
        }

        // A template without {filename} (e.g. "images" or "images/{year}")
        // would otherwise collapse every upload onto the same remote key,
        // each upload overwriting the previous one.
        const template = pathTmpl.includes('{filename}') || pathTmpl.includes('{random}')
            ? pathTmpl
            : `${pathTmpl.replace(/\/+$/, '')}/{filename}`;

        return template
                .replace('{year}', year)
                .replace('{mon}', month)
                .replace('{day}', day)
                .replace('{random}', random)
                .replace('{filename}', imageName)
            ;
    }

    private static generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    /**
     * Build the public URL of an uploaded object: swap in the custom domain when
     * one is configured, and percent-encode the object path.
     *
     * The encoding is not cosmetic. Obsidian names pasted screenshots
     * "Pasted image 20260824080301.png", so object keys routinely contain
     * spaces, and a literal space in the URL makes the resulting markdown link
     * invalid — the image silently fails to load. Previously only the
     * bare-key branch encoded, so every backend that hands in a full URL
     * (S3, OSS, COS) leaked raw spaces into the note.
     *
     * `url` is either a full URL or a bare object key. Encoding is idempotent,
     * so backends that already encode their keys are unaffected.
     */
    static customizeDomainName(url: string, customDomainName: string): string {
        const domain = (customDomainName ?? "").replaceAll('https://', '');
        const hasDomain = domain.trim() !== "";

        const absolute = /^(https?:\/\/)([^/]+)(\/.*)?$/.exec(url);
        if (absolute) {
            const [, scheme, originalHost, path = ""] = absolute;
            return `${scheme}${hasDomain ? domain : originalHost}${this.encodePath(path)}`;
        }

        const key = this.encodePath(url);
        return hasDomain ? `https://${domain}/${key}` : key;
    }

    private static encodePath(path: string): string {
        return path.split('/').map((segment) => {
            try {
                return encodeURIComponent(decodeURIComponent(segment));
            } catch {
                return encodeURIComponent(segment);
            }
        }).join('/');
    }

    /**
     * Strip leading/trailing whitespace (including newlines) from a credential
     * field. Returns an empty string for null/undefined input so downstream
     * callers don't need to guard.
     *
     * Pasting credentials from the web frequently introduces trailing newlines
     * or spaces. AWS-family SDKs reject these with cryptic signing errors, so
     * we normalize at the boundary.
     */
    static trimCredential(value: string | undefined | null): string {
        return (value ?? "").trim();
    }

    /**
     * Normalize an S3/R2/B2 endpoint URL: trims whitespace and removes any
     * trailing slash so the AWS SDK's URL composition does not produce a
     * double-slashed path that hangs or 400s.
     */
    static normalizeEndpoint(endpoint: string | undefined | null): string {
        const trimmed = (endpoint ?? "").trim();
        return trimmed.replace(/\/+$/, "");
    }
}
