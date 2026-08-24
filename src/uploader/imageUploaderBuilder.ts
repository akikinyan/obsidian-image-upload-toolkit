import {PublishSettings} from "../publish";
import ImageUploader from "./imageUploader";
import ImageStore from "../imageStore";
import ImgurAnonymousUploader from "./imgur/imgurAnonymousUploader";
import GyazoUploader from "./gyazo/gyazoUploader";
import OssUploader from "./oss/ossUploader";
import ImagekitUploader from "./imagekit/imagekitUploader";
import AwsS3Uploader from "./s3/awsS3Uploader";
import CosUploader from "./cos/cosUploader";
import KodoUploader from "./qiniu/kodoUploader";
import GitHubUploader from "./github/gitHubUploader";
import R2Uploader from "./r2/r2Uploader";
import B2Uploader from "./b2/b2Uploader";

/**
 * Image stores whose settings carry a path template. Only these can send the
 * preserved originals somewhere other than the WebP files; for the rest the two
 * land side by side, which is harmless because their extensions differ.
 */
export function storeSupportsPath(imageStore: string): boolean {
    switch (ImageStore.normalizeId(imageStore)) {
        case ImageStore.ALIYUN_OSS.id:
        case ImageStore.AWS_S3.id:
        case ImageStore.TENCENTCLOUD_COS.id:
        case ImageStore.QINIU_KUDO.id:
        case ImageStore.CLOUDFLARE_R2.id:
        case ImageStore.BACKBLAZE_B2.id:
            return true;
        default:
            return false;
    }
}

/**
 * A copy of `settings` whose active store writes to `path` instead of its
 * configured template. Building a second uploader from this is what lets the
 * originals go to their own prefix without changing the uploader interface,
 * which all ten implementations would otherwise have to follow.
 */
export function withPathTemplate(settings: PublishSettings, path: string): PublishSettings {
    switch (ImageStore.normalizeId(settings.imageStore)) {
        case ImageStore.ALIYUN_OSS.id:
            return {...settings, ossSetting: {...settings.ossSetting, path}};
        case ImageStore.AWS_S3.id:
            return {...settings, awsS3Setting: {...settings.awsS3Setting, path}};
        case ImageStore.TENCENTCLOUD_COS.id:
            return {...settings, cosSetting: {...settings.cosSetting, path}};
        case ImageStore.QINIU_KUDO.id:
            return {...settings, kodoSetting: {...settings.kodoSetting, path}};
        case ImageStore.CLOUDFLARE_R2.id:
            return {...settings, r2Setting: {...settings.r2Setting, path}};
        case ImageStore.BACKBLAZE_B2.id:
            return {...settings, b2Setting: {...settings.b2Setting, path}};
        default:
            return settings;
    }
}

/**
 * The identifying configuration of the current destination, for the upload
 * cache key. Credentials are deliberately excluded: the cache file is meant to
 * be safe to sync.
 */
export function destinationParts(settings: PublishSettings): (string | undefined)[] {
    const store = ImageStore.normalizeId(settings.imageStore);
    switch (store) {
        case ImageStore.ALIYUN_OSS.id:
            return [store, settings.ossSetting?.bucket, settings.ossSetting?.region, settings.ossSetting?.customDomainName];
        case ImageStore.ImageKit.id:
            return [store, settings.imagekitSetting?.imagekitID, settings.imagekitSetting?.folder];
        case ImageStore.AWS_S3.id:
            return [store, settings.awsS3Setting?.bucketName, settings.awsS3Setting?.region, settings.awsS3Setting?.customDomainName];
        case ImageStore.TENCENTCLOUD_COS.id:
            return [store, settings.cosSetting?.bucket, settings.cosSetting?.region, settings.cosSetting?.customDomainName];
        case ImageStore.QINIU_KUDO.id:
            return [store, settings.kodoSetting?.bucket, settings.kodoSetting?.customDomainName];
        case ImageStore.GITHUB.id:
            return [store, settings.githubSetting?.repositoryName, settings.githubSetting?.branchName];
        case ImageStore.CLOUDFLARE_R2.id:
            return [store, settings.r2Setting?.bucketName, settings.r2Setting?.endpoint, settings.r2Setting?.customDomainName];
        case ImageStore.BACKBLAZE_B2.id:
            return [store, settings.b2Setting?.bucketName, settings.b2Setting?.region, settings.b2Setting?.customDomainName];
        default:
            return [store];
    }
}

export default function buildUploader(settings: PublishSettings): ImageUploader {
    switch (ImageStore.normalizeId(settings.imageStore)) {
        case ImageStore.IMGUR.id:
            return new ImgurAnonymousUploader(settings.imgurAnonymousSetting.clientId);
        case ImageStore.GYAZO.id:
            return new GyazoUploader(settings.gyazoSetting);
        case ImageStore.ALIYUN_OSS.id:
            return new OssUploader(settings.ossSetting);
        case ImageStore.ImageKit.id:
            return new ImagekitUploader(settings.imagekitSetting);
        case ImageStore.AWS_S3.id:
            return new AwsS3Uploader(settings.awsS3Setting, settings.proxySetting);
        case ImageStore.TENCENTCLOUD_COS.id:
            return new CosUploader(settings.cosSetting);
        case ImageStore.QINIU_KUDO.id:
            return new KodoUploader(settings.kodoSetting);
        case ImageStore.GITHUB.id:
            return new GitHubUploader(settings.githubSetting);
        case ImageStore.CLOUDFLARE_R2.id:
            return new R2Uploader(settings.r2Setting, settings.proxySetting);
        case ImageStore.BACKBLAZE_B2.id:
            return new B2Uploader(settings.b2Setting, settings.proxySetting);
        default:
            throw new Error('should not reach here!');
    }
}
