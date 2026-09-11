import {afterEach, describe, expect, it, vi} from "vitest";

const s3ClientMock = vi.fn();
const sendMock = vi.fn().mockResolvedValue({});

vi.mock("@aws-sdk/client-s3", () => {
    class S3Client {
        config: any;
        constructor(config: any) {
            // Resolve credentials provider eagerly so the test can introspect them.
            const credsAsync = typeof config.credentials === "function"
                ? config.credentials()
                : Promise.resolve(config.credentials);
            this.config = {
                ...config,
                _resolvedCredentialsPromise: credsAsync,
            };
            s3ClientMock(config);
        }
        send = sendMock;
    }
    class PutObjectCommand {
        input: any;
        constructor(input: any) { this.input = input; }
    }
    return {S3Client, PutObjectCommand};
});

import R2Uploader from "../../src/uploader/r2/r2Uploader";

afterEach(() => {
    s3ClientMock.mockClear();
    sendMock.mockClear();
});

describe("R2Uploader credential sanitization", () => {
    it("trims whitespace from accessKeyId and secretAccessKey", async () => {
        new R2Uploader({
            accessKeyId: "  AKIA-test-key  ",
            secretAccessKey: "secret-key\n",
            endpoint: "https://acct.r2.cloudflarestorage.com",
            bucketName: "blog",
            path: "",
            customDomainName: "",
        });

        expect(s3ClientMock).toHaveBeenCalledTimes(1);
        const config = s3ClientMock.mock.calls[0][0];
        expect(config.credentials.accessKeyId).toBe("AKIA-test-key");
        expect(config.credentials.secretAccessKey).toBe("secret-key");
    });

    it("strips trailing slash from endpoint", () => {
        new R2Uploader({
            accessKeyId: "k",
            secretAccessKey: "s",
            endpoint: "https://acct.r2.cloudflarestorage.com/",
            bucketName: "blog",
            path: "",
            customDomainName: "",
        });

        const config = s3ClientMock.mock.calls[0][0];
        expect(config.endpoint).toBe("https://acct.r2.cloudflarestorage.com");
    });

    it("trims whitespace from bucket name", async () => {
        const uploader = new R2Uploader({
            accessKeyId: "k",
            secretAccessKey: "s",
            endpoint: "https://acct.r2.cloudflarestorage.com",
            bucketName: "  blog\n",
            path: "{filename}",
            customDomainName: "cdn.example.com",
        });

        const file = new File([new Uint8Array([1, 2, 3])], "a.png", {type: "image/png"});
        await uploader.upload(file, "a.png");

        expect(sendMock).toHaveBeenCalledTimes(1);
        const command = sendMock.mock.calls[0][0];
        expect(command.input.Bucket).toBe("blog");
        expect(command.input.Key).toBe("a.png");
    });

    it("always uses region 'auto' and forcePathStyle for R2", () => {
        new R2Uploader({
            accessKeyId: "k",
            secretAccessKey: "s",
            endpoint: "https://acct.r2.cloudflarestorage.com",
            bucketName: "blog",
            path: "",
            customDomainName: "",
        });

        const config = s3ClientMock.mock.calls[0][0];
        expect(config.region).toBe("auto");
        expect(config.forcePathStyle).toBe(true);
    });
});

describe("R2Uploader public URL requirement", () => {
    function setting(customDomainName: string) {
        return {
            accessKeyId: "k",
            secretAccessKey: "s",
            endpoint: "https://acct.r2.cloudflarestorage.com",
            bucketName: "blog",
            path: "{filename}",
            customDomainName,
        };
    }

    it("refuses to upload without a public domain instead of emitting a relative path", async () => {
        const uploader = new R2Uploader(setting(""));

        await expect(uploader.upload(new File(["x"], "a.png"), "a.png")).rejects.toThrow(/required for Cloudflare R2/);
        // and it fails before spending the upload
        expect(sendMock).not.toHaveBeenCalled();
    });

    it("treats a whitespace-only domain as absent", async () => {
        const uploader = new R2Uploader(setting("   "));

        await expect(uploader.upload(new File(["x"], "a.png"), "a.png")).rejects.toThrow(/required for Cloudflare R2/);
    });

    it("returns an absolute url once a domain is configured", async () => {
        const uploader = new R2Uploader(setting("pub-abc123.r2.dev"));
        const url = await uploader.upload(new File(["x"], "a.png", {type: "image/png"}), "a.png");

        expect(url).toBe("https://pub-abc123.r2.dev/a.png");
    });

    it("percent-encodes a key with spaces, as pasted screenshots produce", async () => {
        const uploader = new R2Uploader(setting("cdn.example.com"));
        const url = await uploader.upload(new File(["x"], "Pasted image 1.png"), "Pasted image 1.png");

        expect(url).toBe("https://cdn.example.com/Pasted%20image%201.png");
    });
});
