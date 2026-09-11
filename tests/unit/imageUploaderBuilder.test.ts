import {describe, expect, it} from "vitest";
import {destinationParts, storeSupportsPath, withPathTemplate} from "../../src/uploader/imageUploaderBuilder";
import type {PublishSettings} from "../../src/publish";

function settings(overrides: Partial<PublishSettings> = {}): PublishSettings {
    return {
        imageStore: "AWS_S3",
        awsS3Setting: {
            accessKeyId: "AKIAEXAMPLE",
            secretAccessKey: "super-secret",
            region: "ap-northeast-1",
            bucketName: "my-bucket",
            path: "/{year}/{mon}/{day}/{filename}",
            customDomainName: "cdn.example.com",
        },
        r2Setting: {
            accessKeyId: "r2-key",
            secretAccessKey: "r2-secret",
            endpoint: "https://acct.r2.cloudflarestorage.com",
            bucketName: "r2-bucket",
            path: "/img/{filename}",
            customDomainName: "pub-x.r2.dev",
        },
        imgurAnonymousSetting: {clientId: "client-id"},
        ...overrides,
    } as unknown as PublishSettings;
}

describe("storeSupportsPath", () => {
    it("is true for the object stores that expose a path template", () => {
        for (const store of ["AWS_S3", "CLOUDFLARE_R2", "BACKBLAZE_B2", "ALIYUN_OSS", "TENCENTCLOUD_COS", "QINIU_KUDO"]) {
            expect(storeSupportsPath(store)).toBe(true);
        }
    });

    it("is false for the stores that decide the path themselves", () => {
        for (const store of ["IMGUR", "GYAZO", "Imagekit", "GITHUB"]) {
            expect(storeSupportsPath(store)).toBe(false);
        }
    });

    it("understands the lower-case aliases", () => {
        expect(storeSupportsPath("s3")).toBe(true);
        expect(storeSupportsPath("imgur")).toBe(false);
    });
});

describe("withPathTemplate", () => {
    it("overrides only the active store's path", () => {
        const base = settings();
        const originals = withPathTemplate(base, "/originals/{filename}");

        expect(originals.awsS3Setting.path).toBe("/originals/{filename}");
        // The inactive store is left alone.
        expect(originals.r2Setting.path).toBe("/img/{filename}");
    });

    it("does not mutate the settings it was given", () => {
        const base = settings();
        withPathTemplate(base, "/originals/{filename}");
        expect(base.awsS3Setting.path).toBe("/{year}/{mon}/{day}/{filename}");
    });

    it("keeps the other fields of the store intact", () => {
        const originals = withPathTemplate(settings(), "/originals/{filename}");
        expect(originals.awsS3Setting.bucketName).toBe("my-bucket");
        expect(originals.awsS3Setting.region).toBe("ap-northeast-1");
    });

    it("returns the settings untouched for a store without a path", () => {
        const base = settings({imageStore: "IMGUR"});
        expect(withPathTemplate(base, "/originals/{filename}")).toBe(base);
    });
});

describe("destinationParts", () => {
    // The cache file is meant to be safe to sync, so nothing secret may reach it.
    it("never includes credentials", () => {
        const joined = destinationParts(settings()).join("|");
        expect(joined).not.toContain("super-secret");
        expect(joined).not.toContain("AKIAEXAMPLE");
    });

    it("includes what changes the resulting URL", () => {
        const parts = destinationParts(settings());
        expect(parts).toContain("my-bucket");
        expect(parts).toContain("ap-northeast-1");
        expect(parts).toContain("cdn.example.com");
    });

    it("leads with the store id so two stores never collide", () => {
        expect(destinationParts(settings({imageStore: "IMGUR"}))[0]).toBe("IMGUR");
        expect(destinationParts(settings())[0]).toBe("AWS_S3");
    });

    it("separates the same bucket on AWS from one on a custom endpoint", () => {
        const aws = destinationParts(settings()).join("|");
        const minio = destinationParts(settings({
            awsS3Setting: {...settings().awsS3Setting, endpoint: "https://minio.example.com"},
        })).join("|");

        expect(minio).not.toBe(aws);
    });

    it("does not include the path template, since old URLs stay valid", () => {
        const before = destinationParts(settings()).join("|");
        const after = destinationParts(withPathTemplate(settings(), "/somewhere/else/{filename}")).join("|");
        expect(after).toBe(before);
    });
});
