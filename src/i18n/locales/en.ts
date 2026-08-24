/**
 * English strings. This file is the source of truth for the message catalogue:
 * every other locale is typed as `typeof en`, so a missing or misspelled key is
 * a compile error rather than a blank label at runtime.
 *
 * Strings here are kept byte-identical to the pre-i18n hardcoded values so the
 * English UI does not change.
 */
const en = {
    command: {
        publishPage: "Publish page",
    },

    general: {
        altText: {
            name: "Use image name as alt text",
            desc: "Use the image name as alt text, replacing '-' and '_' with spaces.",
        },
        updateOriginalDoc: {
            name: "Update original document",
            desc: "Whether to replace internal link with store link.",
        },
        ignoreProperties: {
            name: "Ignore note properties",
            desc: "Where to ignore note properties when copying to clipboard. This won't affect original note.",
        },
    },

    upload: {
        heading: "Upload",
        progressModal: {
            name: "Show progress modal",
            desc: "Show a modal dialog with detailed progress when uploading images (auto close in 3s). If disabled, a simpler status indicator will be used.",
        },
        webImages: {
            name: "Upload web images",
            desc: "When enabled, web images (http/https URLs) are downloaded and re-uploaded to your configured storage. Images already hosted on your storage service are skipped.",
        },
    },

    webp: {
        heading: "WebP conversion",
        enabled: {
            name: "Convert images to WebP",
            desc: "Convert local images to WebP before uploading, and link the WebP from the note. Applies to local images only; web images and Mermaid diagrams are untouched.",
        },
        extensions: {
            name: "Extensions to convert",
            desc: "Comma-separated, without the dot. GIF and SVG are excluded by default: conversion goes through a canvas, which keeps only the first frame of an animation and rasterizes vector art.",
            placeholder: "png, jpg, jpeg",
        },
        quality: {
            name: "Quality",
            desc: "WebP encoder quality. Lower means smaller and lossier. If the WebP ends up larger than the original, the original is uploaded instead.",
        },
        keepOriginal: {
            name: "Also upload the original",
            desc: "Upload the untouched original alongside the WebP as an archive copy. The note still links to the WebP.",
        },
        originalPath: {
            name: "Path for originals",
            desc: "Where the archived originals go. Supports the same variables as the target path. Keep it distinct from the target path so the two do not overwrite each other.",
            placeholder: "/originals/{year}/{mon}/{day}/{filename}",
        },
        originalPathUnsupported: "This image store has no path template, so the originals are uploaded next to the WebP files. Their extensions differ, so they do not collide.",
        frontmatterProperty: {
            name: "Frontmatter property",
            desc: "Name of the note property that overrides conversion for a single note. Set it to true to convert that note, false to leave it alone. Leave this field empty to disable the override.",
            placeholder: "webp",
        },
        frontmatterDefault: {
            name: "Default when the property is absent",
            desc: "Applied to notes that do not set the property. Turn it off to convert only the notes that opt in explicitly.",
        },
    },

    cache: {
        heading: "Upload history",
        enabled: {
            name: "Skip re-uploading unchanged images",
            desc: "Remember which file contents have already been uploaded to the current destination, and reuse the URL instead of uploading again. Editing an image uploads it again; changing bucket or domain does too.",
        },
        clear: {
            name: "Clear the upload history",
            desc: "Forget every recorded upload, so the next publish uploads everything again. Uploaded files are not deleted. Use this when a note links to a URL that no longer works.",
            button: "Clear",
        },
        entries: (count: number) => `${count} recorded uploads`,
        cleared: (count: number) => `Cleared ${count} recorded uploads`,
    },

    mermaid: {
        heading: "Mermaid",
        convert: {
            name: "Convert Mermaid diagrams to images",
            desc: "Render Mermaid code blocks as PNG images and upload them during publish.",
        },
        scale: {
            name: "Mermaid image scale",
            desc: "Scale factor for exported images (1x–4x). 2x recommended for retina displays.",
        },
        theme: {
            name: "Mermaid theme",
            desc: "Color theme for rendered diagrams.",
            options: {
                default: "Default",
                dark: "Dark",
                forest: "Forest",
                neutral: "Neutral",
                base: "Base",
            },
        },
    },

    network: {
        heading: "Network",
        mode: {
            name: "Proxy",
            desc: "How to reach S3-compatible storage (Amazon S3, Cloudflare R2, Backblaze B2). Those uploaders talk to the network directly and do not follow Obsidian's system proxy settings.",
            options: {
                auto: "Auto-detect from environment",
                off: "Do not use a proxy",
                manual: "Specify manually",
            },
        },
        url: {
            name: "Proxy URL",
            desc: "For example http://proxy.example.com:8080. Credentials may be embedded as http://user:pass@host:port.",
            placeholder: "http://host:port",
        },
        detected: (url: string) => `Detected from environment: ${url}`,
        notDetected: "No HTTPS_PROXY / HTTP_PROXY environment variable found. Uploads will connect directly.",
        manualActive: (url: string) => `Using: ${url}`,
        manualEmpty: "Enter a proxy URL below, otherwise uploads will connect directly.",
        disabled: "Proxy is disabled. Uploads will connect directly.",
    },

    language: {
        name: "Language",
        desc: "Language of this plugin's interface. 'Auto' follows Obsidian's language setting.",
        options: {
            auto: "Auto",
            en: "English",
            ja: "日本語",
        },
    },

    imageStore: {
        heading: "Image store",
        select: {
            name: "Image store",
            desc: "Remote image store for upload images to.",
        },
    },

    // Fields that several image stores share.
    common: {
        bucketName: {
            name: "Bucket name",
            desc: "The name of the bucket to store images.",
            placeholder: "Enter bucket name",
        },
        targetPath: {
            name: "Target path",
            desc: "The path to store images. Supports {year} {mon} {day} {random} {filename} vars. For example, /{year}/{mon}/{day}/{filename} with uploading pic.jpg stores it as /2023/06/08/pic.jpg.",
            placeholder: "Enter path",
        },
        customDomain: {
            name: "Custom domain name",
            desc: "If the custom domain name is example.com, you can use https://example.com/pic.jpg to access pic.img.",
            placeholder: "Enter path",
        },
    },

    imgur: {
        clientId: {
            name: "Client ID",
            placeholder: "Enter client ID",
        },
        descPrefix: "Generate your own Client ID at ",
    },

    gyazo: {
        accessToken: {
            name: "Access token",
            placeholder: "Enter access token",
        },
        tokenDescPrefix: "Create an application and issue an access token at ",
        accessPolicy: {
            name: "Access policy",
            desc: "Set image visibility. Choose 'Only me' only if you do not need other people or external sites to access the uploaded image URL.",
            options: {
                anyone: "Anyone",
                onlyMe: "Only me",
            },
        },
        commonDescription: {
            name: "Common description",
            desc: "A fixed Gyazo description applied to every upload. Leave empty to skip the description field.",
            placeholder: "Enter a shared description (optional)",
        },
    },

    oss: {
        region: {
            name: "Region",
            desc: "OSS data center region.",
        },
        accessKeyId: {
            name: "Access key ID",
            desc: "The access key ID of Aliyun RAM.",
            placeholder: "Enter access key ID",
        },
        accessKeySecret: {
            name: "Access key secret",
            desc: "The access key secret of Aliyun RAM.",
            placeholder: "Enter access key secret",
        },
    },

    imagekit: {
        id: {
            name: "ImageKit ID",
            placeholder: "Enter your ImageKit ID",
        },
        descPrefix: "Obtain id and keys from ",
        folder: {
            name: "Folder name",
            desc: "The directory name. Leave blank to upload to the root folder.",
            placeholder: "Enter the folder name",
        },
        publicKey: {
            name: "Public key",
            placeholder: "Enter your public key",
        },
        privateKey: {
            name: "Private key",
            placeholder: "Enter your private key",
        },
    },

    s3: {
        accessKeyId: {
            name: "AWS S3 access key ID",
            desc: "Your AWS S3 access key ID.",
            placeholder: "Enter your access key ID",
        },
        secretAccessKey: {
            name: "AWS S3 secret access key",
            desc: "Your AWS S3 secret access key.",
            placeholder: "Enter your secret access key",
        },
        region: {
            name: "AWS S3 region",
            desc: "Your AWS S3 region.",
            placeholder: "Enter your region",
        },
        bucketName: {
            name: "AWS S3 bucket name",
            desc: "Your AWS S3 bucket name.",
            placeholder: "Enter your bucket name",
        },
    },

    cos: {
        region: {
            name: "Region",
            desc: "COS data center region.",
        },
        secretId: {
            name: "Secret ID",
            desc: "The secret ID of Tencent Cloud.",
            placeholder: "Enter secret ID",
        },
        secretKey: {
            name: "Secret key",
            desc: "The secret key of Tencent Cloud.",
            placeholder: "Enter secret key",
        },
    },

    qiniu: {
        accessKey: {
            name: "Access key",
            desc: "The access key of Qiniu.",
            placeholder: "Enter access key",
        },
        secretKey: {
            name: "Secret key",
            desc: "The secret key of Qiniu.",
            placeholder: "Enter secret key",
        },
    },

    github: {
        repositoryName: {
            name: "Repository name",
            desc: "The name of the GitHub repository to store images (format: owner/repo).",
            placeholder: "Enter repository name (e.g., username/repo)",
        },
        branchName: {
            name: "Branch name",
            desc: "The branch to store images in (defaults to 'main').",
            placeholder: "Enter branch name",
        },
        token: {
            name: "Personal access token",
            placeholder: "Enter your GitHub personal access token",
        },
        tokenDescPrefix: "Generate a personal access token with 'repo' scope at ",
    },

    r2: {
        accessKeyId: {
            name: "Cloudflare R2 access key ID",
            desc: "Your Cloudflare R2 access key ID.",
            placeholder: "Enter your access key ID",
        },
        secretAccessKey: {
            name: "Cloudflare R2 secret access key",
            desc: "Your Cloudflare R2 secret access key.",
            placeholder: "Enter your secret access key",
        },
        endpoint: {
            name: "Cloudflare R2 endpoint",
            desc: "Your Cloudflare R2 endpoint URL (e.g., https://account-id.r2.cloudflarestorage.com).",
            placeholder: "Enter your R2 endpoint",
        },
        bucketName: {
            name: "Cloudflare R2 bucket name",
            desc: "Your Cloudflare R2 bucket name.",
            placeholder: "Enter your bucket name",
        },
        customDomain: {
            name: "R2.dev URL or custom domain name",
            desc: "You can use the R2.dev URL such as https://pub-xxxx.r2.dev, or a custom domain. If the custom domain name is example.com, you can use https://example.com/pic.jpg to access pic.img.",
            placeholder: "Enter domain name",
        },
    },

    b2: {
        accessKeyId: {
            name: "Backblaze B2 access key ID",
            desc: "Your Backblaze B2 application key ID.",
            placeholder: "Enter your application key ID",
        },
        secretAccessKey: {
            name: "Backblaze B2 secret access key",
            desc: "Your Backblaze B2 application key.",
            placeholder: "Enter your application key",
        },
        region: {
            name: "Backblaze B2 region",
            desc: "Your Backblaze B2 region (e.g., us-west-004).",
            placeholder: "Enter your region",
        },
        bucketName: {
            name: "Backblaze B2 bucket name",
            desc: "Your Backblaze B2 bucket name.",
            placeholder: "Enter your bucket name",
        },
        customDomain: {
            name: "Custom domain name",
            desc: "If you have configured a custom domain, you can use https://example.com/pic.jpg to access pic.img. Otherwise, leave it empty to use the default B2 URL.",
            placeholder: "Enter custom domain (optional)",
        },
    },

    modal: {
        title: "Uploading images",
        titleComplete: "Upload complete",
        titlePartial: "Upload finished with errors",
        titleFailed: "Upload failed",
        uploading: "Uploading...",
        complete: "Complete",
        failed: "Failed",
        completedWithErrors: (failed: number) => `Completed with errors (${failed} failed)`,
        succeeded: (count: number) => `${count} succeeded`,
        failedCount: (count: number) => `${count} failed`,
        modeWebp: (quality: number) => `WebP conversion on (quality ${quality})`,
        modeWebpKeepOriginal: (quality: number) =>
            `WebP conversion on (quality ${quality}, originals kept)`,
        modeWebpSkipped: "WebP conversion skipped for this note",
        modeHistory: "Upload history on",
        reused: "reused from history",
        reusedCount: (count: number) => `${count} from history`,
        sizeConverted: (from: string, to: string) => `${from} → ${to}`,
        compareConverted: (size: string) => `Converted ${size}`,
        compareSaved: (size: string) => `Saved ${size}`,
        compareOriginal: (size: string, delta: string) => `Original ${size} (${delta})`,
    },

    notice: {
        uploaderSetupFailed: "Image uploader setup failed, please check setting.",
        publishFailed: (message: string) => `Publish failed: ${message}`,
        copiedToClipboard: "Copied to clipboard",
        cannotLocate: (name: string, path: string) =>
            `Can NOT locate ${name} with ${path}, please check image path or attachment option in plugin setting!`,
        webImageUploadFailed: (path: string, message: string) =>
            `Upload web image ${path} failed: ${message}`,
        uploadFailed: (path: string, message: string) =>
            `Upload ${path} failed, remote server returned an error: ${message}`,
        originalUploadFailed: (path: string, message: string) =>
            `The WebP of ${path} was uploaded, but archiving the original failed: ${message}`,
        readFileFailed: (path: string) => `Failed to read file: ${path}`,
        mermaidRendering: (count: number) => `Rendering ${count} mermaid diagram(s)...`,
        mermaidInitFailed: (message: string) => `Mermaid initialization failed: ${message}`,
        mermaidBlockFailed: (index: number, message: string) =>
            `Failed to render mermaid block ${index}: ${message}`,
    },
};

/**
 * Shape every other locale must implement. Note the absence of `as const`:
 * widening the literals to `string` is deliberate so translations are allowed
 * to differ in wording while still being checked for completeness.
 */
export type Messages = typeof en;

export default en;
