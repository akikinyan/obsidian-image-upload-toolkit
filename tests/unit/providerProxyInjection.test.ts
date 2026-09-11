import {afterEach, describe, expect, it, vi} from "vitest";

/**
 * Proxy injection used to live in one place: the switch in buildUploader
 * passed settings.proxySetting to the three AWS-SDK uploaders. The provider
 * descriptors spread that across ten files, where omitting it for one store
 * is a silent failure — the uploader simply bypasses the proxy, and that
 * only shows up on a machine behind one.
 */

// vi.mock is hoisted above the module scope, so the spy has to be too.
const {requestHandlerMock} = vi.hoisted(() => ({requestHandlerMock: vi.fn()}));

vi.mock("../../src/net/proxy", async importOriginal => {
    const actual = await importOriginal<typeof import("../../src/net/proxy")>();
    return {...actual, buildS3RequestHandler: requestHandlerMock};
});

vi.mock("@aws-sdk/client-s3", () => {
    class S3Client {
        constructor(public config: unknown) {}
        send = vi.fn();
    }
    class PutObjectCommand {
        constructor(public input: unknown) {}
    }
    return {S3Client, PutObjectCommand};
});

import buildUploader from "../../src/uploader/imageUploaderBuilder";
import ImageStore from "../../src/imageStore";
import {PROVIDERS} from "../../src/providers/registry";

const PROXY = {mode: "manual" as const, url: "http://proxy.internal:8080"};

function settings(imageStore: string): any {
    return {
        imageStore,
        proxySetting: PROXY,
        imgurAnonymousSetting: {clientId: "cid"},
        gyazoSetting: {accessToken: "t", accessPolicy: "anyone", desc: ""},
        ossSetting: {region: "oss-cn-hangzhou", endpoint: "https://oss-cn-hangzhou.aliyuncs.com/"},
        imagekitSetting: {imagekitID: "id", endpoint: "https://ik.imagekit.io/id/"},
        awsS3Setting: {region: "us-east-1", bucketName: "b"},
        cosSetting: {region: "ap-guangzhou"},
        kodoSetting: {bucket: "b", customDomainName: "cdn.example.com"},
        githubSetting: {repositoryName: "owner/repo", branchName: "main", token: "t", path: ""},
        r2Setting: {endpoint: "https://acct.r2.cloudflarestorage.com", bucketName: "b"},
        b2Setting: {region: "us-west-004", bucketName: "b"},
    };
}

/** The stores whose uploaders go through the AWS SDK, and so need the proxy. */
const PROXY_AWARE = [ImageStore.AWS_S3.id, ImageStore.CLOUDFLARE_R2.id, ImageStore.BACKBLAZE_B2.id];

afterEach(() => {
    requestHandlerMock.mockClear();
});

describe("provider descriptors and the proxy setting", () => {
    it.each(PROXY_AWARE)("%s forwards the configured proxy to its request handler", storeId => {
        buildUploader(settings(storeId));

        expect(requestHandlerMock).toHaveBeenCalledTimes(1);
        expect(requestHandlerMock.mock.calls[0][1]).toEqual(PROXY);
    });

    it("points the proxy decision at S3's custom endpoint, not at amazonaws", () => {
        const withEndpoint = settings(ImageStore.AWS_S3.id);
        withEndpoint.awsS3Setting.endpoint = "https://minio.internal";

        buildUploader(withEndpoint);

        // NO_PROXY commonly exempts exactly the internal host a self-hosted S3
        // runs on, so the handler has to be built for the host actually
        // contacted.
        expect(requestHandlerMock.mock.calls[0][0]).toBe("https://minio.internal");
        expect(requestHandlerMock.mock.calls[0][1]).toEqual(PROXY);
    });

    it("leaves the other stores alone", () => {
        const others = PROVIDERS
            .map(provider => provider.store.id)
            .filter(id => !PROXY_AWARE.includes(id));

        for (const storeId of others) {
            buildUploader(settings(storeId));
        }

        expect(requestHandlerMock).not.toHaveBeenCalled();
    });
});
