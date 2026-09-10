import {App, Editor, FileSystemAdapter, MarkdownView, normalizePath, Notice} from "obsidian";
import path from "path";
import ImageUploader from "./imageUploader";
import {PublishSettings} from "../publish";
import UploadProgressModal, {type UploadDetail} from "../ui/uploadProgressModal";
import {WebImageDownloader} from "./webImageDownloader";
import MermaidProcessor from "./mermaidProcessor";
import ImageStore from "../imageStore";
import {errorMessage} from "./errorUtils";
import {getProvider} from "../providers/registry";
import {i18n} from "../i18n";
import {convertToWebp, matchesExtension, resolveNoteOptIn} from "./webpConverter";
import UploadCache, {cacheKey, destinationId, sha256} from "./uploadCache";
import buildUploader, {destinationParts, storeSupportsPath, withPathTemplate} from "./imageUploaderBuilder";

export const MD_REGEX = /!\[([^\]]*)\]\(([^)]*)\)/g;
export const WIKI_REGEX = /!\[\[([^\]|#]*\.(png|jpg|jpeg|gif|svg|webp|excalidraw))(#[^\]|]*)?(\|[^\]]*)?\]\]/gi;
export const PROPERTIES_REGEX = /^---[\s\S]+?---\n/;

export function isAlreadyHosted(url: string, settings: PublishSettings): boolean {
    try {
        new URL(url);
        return getProvider(ImageStore.normalizeId(settings.imageStore))?.isHosted(url, settings) ?? false;
    } catch {
        return false;
    }
}

interface Image {
    name: string;
    path: string;
    url: string;
    source: string;
    isWebImage?: boolean; // Flag to indicate if this is a web image
}

// Return type for resolveImagePath method
interface ResolvedImagePath {
    resolvedPath: string;
    name: string;
}

export const ACTION_PUBLISH: string = "PUBLISH";

export default class ImageTagProcessor {
    private readonly app: App;
    private readonly imageUploader: ImageUploader;
    private settings: PublishSettings;
    private adapter: FileSystemAdapter;
    private progressModal: UploadProgressModal | null = null;
    private readonly useModal: boolean = true; // Set to true to use modal, false to use status bar
    private readonly cache: UploadCache | null;
    /** Short id of the current destination, resolved once per run. */
    private destination = "";
    /** Second uploader writing to the originals path, built only when needed. */
    private originalUploaderInstance: ImageUploader | null = null;

    constructor(
        app: App,
        settings: PublishSettings,
        imageUploader: ImageUploader,
        useModal: boolean = true,
        cache: UploadCache | null = null,
    ) {
        this.app = app;
        this.adapter = this.app.vault.adapter as FileSystemAdapter;
        this.settings = settings;
        this.imageUploader = imageUploader;
        this.useModal = useModal;
        this.cache = cache;
    }

    public async process(action: string): Promise<void> {
        let value = this.getValue();
        const basePath = this.adapter.getBasePath();
        const promises: Promise<Image>[] = [];
        this.destination = await destinationId(destinationParts(this.settings));
        await this.cache?.load();
        // Resolved once per run: the note's frontmatter cannot change mid-publish.
        const allowWebp = this.noteAllowsWebp();
        // Convert mermaid code blocks to images if enabled
        let mermaidUrls = new Set<string>();
        if (this.settings.convertMermaid) {
            const mermaidProcessor = new MermaidProcessor(this.imageUploader, this.settings.mermaidScale, this.settings.mermaidTheme);
            const result = await mermaidProcessor.process(value);
            value = result.value;
            mermaidUrls = result.generatedUrls;
        }

        const images = this.getImageLists(value, mermaidUrls);
        const uploader = this.imageUploader;
        
        // Initialize progress display
        if (this.useModal && images.length > 0) {
            const webpSetting = this.settings.webpSetting;
            this.progressModal = new UploadProgressModal(this.app, {
                webp: allowWebp ? "on" : (webpSetting?.enabled ? "skipped" : "off"),
                webpQuality: webpSetting?.quality ?? 0,
                keepOriginal: webpSetting?.keepOriginal ?? false,
                historyEnabled: this.cache !== null,
            });
            this.progressModal.open();
            this.progressModal.initialize(images);
        }
        
        for (const image of images) {
            // Handle web images differently
            if (image.isWebImage) {
                promises.push((async (): Promise<Image> => {
                    try {
                        // Download the web image
                        const downloadResult = await WebImageDownloader.download(image.path);
                        const file = new File([downloadResult.buffer], downloadResult.filename);
                        
                        // Upload to cloud storage - use just the filename as fullPath for web images
                        // since they don't have a real file system path
                        const imgUrl = await uploader.upload(file, downloadResult.filename);
                        image.url = imgUrl;
                        
                        // Update progress on successful upload
                        if (this.progressModal) {
                            this.progressModal.updateProgress(image.name, true);
                        }
                        return image;
                    } catch (e) {
                        // Update progress on failed upload
                        if (this.progressModal) {
                            this.progressModal.updateProgress(image.name, false);
                        }
                        const errorMessageText = i18n().notice.webImageUploadFailed(image.path, errorMessage(e));
                        new Notice(errorMessageText, 10000);
                        console.error('Web image upload error:', e);
                        throw new Error(errorMessageText);
                    }
                })());
                continue;
            }
            
            // Handle local images
            if (this.app.vault.getAbstractFileByPath(normalizePath(image.path)) == null) {
                new Notice(i18n().notice.cannotLocate(image.name, image.path), 10000);
                console.warn(`${normalizePath(image.path)} not exist`);
                // Update the progress modal with the failure
                if (this.progressModal) {
                    this.progressModal.updateProgress(image.name, false);
                }
                continue; // Skip to the next image
            }
            
            promises.push(this.uploadLocalImage(image, basePath, allowWebp));
        }

        if (promises.length === 0) {
            if (this.progressModal) {
                this.progressModal.close();
            }
            // Still proceed to output — mermaid conversion may have transformed the value
            // even though no local/web images need uploading
        }

        let successfulImages: Image[] = [];
        if (promises.length > 0) {
            const results = await Promise.all(promises.map(p => p.catch(e => {
                console.error(e);
                return null;
            })));
            successfulImages = results.filter(img => img !== null) as Image[];

            let altText;
            for (const image of successfulImages) {
                altText = this.settings.imageAltText ?
                    path.parse(image.name)?.name?.replaceAll("-", " ")?.replaceAll("_", " ") :
                    '';
                value = value.replaceAll(image.source, `![${altText}](${image.url})`);
            }
        }

        if (this.settings.replaceOriginalDoc) {
            if (successfulImages.length > 0 && this.getEditor()) {
                let docValue = this.getValue();
                let altText;
                for (const image of successfulImages) {
                    altText = this.settings.imageAltText ?
                        path.parse(image.name)?.name?.replaceAll("-", " ")?.replaceAll("_", " ") :
                        '';
                    docValue = docValue.replaceAll(image.source, `![${altText}](${image.url})`);
                }
                this.getEditor()?.setValue(docValue);
            }
        } else {
            const webImages = successfulImages.filter(img => img.isWebImage);
            if (webImages.length > 0 && this.getEditor()) {
                let docValue = this.getValue();
                let altText;
                for (const image of webImages) {
                    altText = this.settings.imageAltText ?
                        path.parse(image.name)?.name?.replaceAll("-", " ")?.replaceAll("_", " ") :
                        '';
                    docValue = docValue.replaceAll(image.source, `![${altText}](${image.url})`);
                }
                this.getEditor()?.setValue(docValue);
            }
        }

        if (this.settings.ignoreProperties) {
            value = value.replace(PROPERTIES_REGEX, '');
        }

        await this.cache?.save();

        switch (action) {
            case ACTION_PUBLISH:
                await navigator.clipboard.writeText(value);
                new Notice(i18n().notice.copiedToClipboard);
                break;
            default:
                throw new Error("invalid action!");
        }
    }

    /**
     * Read one local image, optionally convert it to WebP, and upload it.
     *
     * The WebP is used only when it is actually smaller. Converting a small
     * PNG frequently produces a larger file, and publishing the bigger of the
     * two would defeat the point of the feature.
     */
    private async uploadLocalImage(image: Image, basePath: string, allowWebp: boolean): Promise<Image> {
        let original: File;
        try {
            const buf = await this.adapter.readBinary(image.path);
            original = new File([buf], image.name);
        } catch (error) {
            console.error(`Failed to read file: ${image.path}`, error);
            new Notice(i18n().notice.readFileFailed(image.path), 5000);
            this.progressModal?.updateProgress(image.name, false);
            throw error instanceof Error ? error : new Error(String(error));
        }

        const fullPath = basePath + '/' + image.path;
        const webpSetting = this.settings.webpSetting;
        const willConvert = allowWebp && matchesExtension(image.name, webpSetting.extensions);

        // Keyed on the bytes on disk rather than the bytes uploaded, so a hit
        // skips the conversion as well as the upload. The quality is folded
        // into the variant, so changing it re-converts rather than returning a
        // URL encoded at the old setting.
        const sourceHash = this.cache ? await sha256(await original.arrayBuffer()) : "";
        const displayVariant = willConvert ? `display:webp:q${webpSetting.quality}` : "display:raw";
        const detail: UploadDetail = {originalSize: original.size, uploadedSize: original.size};

        try {
            const displayKey = cacheKey(this.destination, displayVariant, sourceHash);
            const cached = this.cache?.get(displayKey);
            if (cached) {
                console.debug(`Image upload toolkit: reusing ${cached} for ${image.name}`);
                image.url = cached;
                detail.reused = true;
            } else {
                let display = original;
                if (willConvert) {
                    const webp = await convertToWebp(original, webpSetting.quality);
                    if (webp && webp.size < original.size) {
                        display = webp;
                        detail.converted = true;
                        detail.uploadedSize = webp.size;
                    } else if (webp) {
                        console.debug(
                            `Image upload toolkit: ${image.name} grew from ${original.size} to ${webp.size} bytes ` +
                            `as WebP, uploading the original instead`,
                        );
                    }
                }
                image.url = await this.imageUploader.upload(display, fullPath);
                this.cache?.set(displayKey, image.url, Date.now());
            }

            // On a cache hit we cannot tell whether conversion had applied, so
            // the archive is ensured whenever it would have. The source key
            // makes that a no-op after the first time.
            if (webpSetting.keepOriginal && (detail.converted || (detail.reused && willConvert))) {
                await this.archiveOriginal(original, fullPath, sourceHash, image.path);
            }

            this.progressModal?.updateProgress(image.name, true, detail);
            return image;
        } catch (e) {
            this.progressModal?.updateProgress(image.name, false);
            const errorMessageText = i18n().notice.uploadFailed(image.path, errorMessage(e));
            new Notice(errorMessageText, 10000);
            throw new Error(errorMessageText);
        }
    }

    /**
     * Upload the untouched original as an archive copy. Failure is reported but
     * never propagated: the WebP is already published, and undoing that to
     * signal a missing backup would be the wrong trade.
     */
    private async archiveOriginal(
        original: File,
        fullPath: string,
        sourceHash: string,
        notePath: string,
    ): Promise<void> {
        const key = cacheKey(this.destination, "source", sourceHash);
        if (this.cache?.get(key)) return;
        try {
            const url = await this.originalUploader().upload(original, fullPath);
            this.cache?.set(key, url, Date.now());
        } catch (e) {
            console.error(`Image upload toolkit: failed to archive the original of ${notePath}`, e);
            new Notice(i18n().notice.originalUploadFailed(notePath, errorMessage(e)), 8000);
        }
    }

    /**
     * Uploader for the preserved originals. Stores without a path template
     * cannot separate the two, so they reuse the main uploader: the originals
     * land beside the WebP files, distinguished only by their extension.
     */
    private originalUploader(): ImageUploader {
        if (!storeSupportsPath(this.settings.imageStore)) {
            return this.imageUploader;
        }
        if (!this.originalUploaderInstance) {
            this.originalUploaderInstance = buildUploader(
                withPathTemplate(this.settings, this.settings.webpSetting.originalPath),
            );
        }
        return this.originalUploaderInstance;
    }

    /** Whether the active note opts in to WebP conversion. */
    private noteAllowsWebp(): boolean {
        const webpSetting = this.settings.webpSetting;
        if (!webpSetting?.enabled) return false;
        const file = this.app.workspace.getActiveFile();
        const frontmatter = file ? this.app.metadataCache.getFileCache(file)?.frontmatter : undefined;
        return resolveNoteOptIn(frontmatter, webpSetting.frontmatterProperty, webpSetting.frontmatterDefault);
    }

    private getImageLists(value: string, mermaidUrls: Set<string> = new Set()): Image[] {
        const images: Image[] = [];
        
        try {
            const wikiMatches = value.matchAll(WIKI_REGEX);
            for (const match of wikiMatches) {
                this.processMatched(match[1], match[0], images);
            }
            
            const mdMatches = value.matchAll(MD_REGEX);
            for (const match of mdMatches) {
                const imageUrl = match[2];
                
                // Check if it's a web image and if upload web images is enabled
                if (WebImageDownloader.isWebImage(imageUrl)) {
                    if (this.settings.uploadWebImages && !this.isAlreadyHosted(imageUrl) && !mermaidUrls.has(imageUrl)) {
                        // Add as web image to be downloaded and uploaded
                        this.processWebImage(imageUrl, match[0], images);
                    }
                    // Skip if setting is disabled or already hosted
                    continue;
                }
                
                // Skip non-image local files (e.g., .pdf, .txt) to prevent invalid uploads
                const localPath = imageUrl.split('?')[0];
                if (!/\.(png|jpg|jpeg|gif|svg|webp|excalidraw)$/i.test(localPath)) {
                    continue;
                }

                const decodedName = decodeURI(imageUrl);
                this.processMatched(decodedName, match[0], images);
            }
        } catch (error) {
            console.error("Error processing image lists:", error);
        }
        
        return images;
    }

    private processMatched(path: string, src: string, images: Image[]){    
        try {
            const {resolvedPath, name} = this.resolveImagePath(path);
            // check the item with same resolvedPath 
            const existingImage = images.find(image => image.path === resolvedPath);
            if (!existingImage) {
                images.push({
                    name,
                    path: resolvedPath,
                    source: src,
                    url: '',
                });
            }
        } catch (error) {
            console.error(`Failed to process image: ${src}`, error);
        }
    }

    /**
     * Process web image URL
     */
    private processWebImage(url: string, src: string, images: Image[]) {
        try {
            // Extract a friendly name from URL
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const segments = pathname.split('/').filter(s => s.length > 0);
            const name = segments.length > 0 ? segments[segments.length - 1] : `web-image-${Date.now()}`;
            
            // Check if already in list
            const existingImage = images.find(image => image.path === url);
            if (!existingImage) {
                images.push({
                    name: decodeURIComponent(name),
                    path: url, // Store the URL as path for web images
                    source: src,
                    url: '',
                    isWebImage: true
                });
            }
        } catch (error) {
            console.error(`Failed to process web image: ${url}`, error);
        }
    }

    private isAlreadyHosted(url: string): boolean {
        return isAlreadyHosted(url, this.settings);
    }

    private resolveImagePath(imageName: string): ResolvedImagePath {
        // Obsidian attachment folder options:
        // 1. Vault folder: "/image.png"
        // 2. In the folder specified below: such as "Attachments", then "Attachments/image.png"
        // 3. Same folder as current file: "./image.png"
        // 4. In subfolder under current folder: such as "attachments", then "attachments/image.png"
        const sourcePath = this.app.workspace.getActiveFile()?.path || "";
        const targetFile = this.app.metadataCache.getFirstLinkpathDest(imageName, sourcePath);
        // `name` must stay a bare filename: it is what feeds the {filename} path
        // variable, so any directory part of the link text (notably the `../`
        // segments Obsidian emits for relative links) would leak into the remote
        // object key. See resolveImagePath callers and UploaderUtils.generateName.
        if (targetFile) {
            return {resolvedPath: targetFile.path, name: targetFile.name};
        }
        return {resolvedPath: imageName, name: path.basename(imageName)};

    }

    private getValue(): string {
        const editor = this.getEditor();
        return editor ? editor.getValue() : "";
    }

    private getEditor(): Editor | null {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        return activeView ? activeView.editor : null;
    }
}
