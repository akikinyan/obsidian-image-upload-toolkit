export class UploaderUtils {
    static generateName(pathTmpl: string | undefined, imageName: string): string {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = this.generateRandomString(20);

        return pathTmpl != undefined && pathTmpl.trim().length > 0 ? pathTmpl
                .replace('{year}', year)
                .replace('{mon}', month)
                .replace('{day}', day)
                .replace('{random}', random)
                .replace('{filename}', imageName)
            : imageName
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
