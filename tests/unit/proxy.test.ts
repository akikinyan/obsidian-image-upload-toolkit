import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {
    buildS3RequestHandler,
    detectEnvProxy,
    detectProxyForUrl,
    redact,
    resolveProxyUrl,
} from "../../src/net/proxy";

const PROXY_VARS = ["HTTP_PROXY", "http_proxy", "HTTPS_PROXY", "https_proxy", "NO_PROXY", "no_proxy", "ALL_PROXY", "all_proxy"];

const S3 = "https://s3.ap-northeast-1.amazonaws.com";

describe("proxy resolution", () => {
    let saved: Record<string, string | undefined>;

    beforeEach(() => {
        saved = {};
        for (const name of PROXY_VARS) {
            saved[name] = process.env[name];
            delete process.env[name];
        }
    });

    afterEach(() => {
        for (const name of PROXY_VARS) {
            if (saved[name] === undefined) delete process.env[name];
            else process.env[name] = saved[name];
        }
    });

    it("returns nothing when the environment defines no proxy", () => {
        expect(detectEnvProxy()).toBe("");
        expect(detectProxyForUrl(S3)).toBe("");
        expect(resolveProxyUrl(S3, {mode: "auto", url: ""})).toBe("");
        expect(buildS3RequestHandler(S3, {mode: "auto", url: ""})).toBeUndefined();
    });

    it("picks up HTTPS_PROXY in auto mode", () => {
        process.env.HTTPS_PROXY = "http://10.0.0.1:8080";
        expect(detectEnvProxy()).toBe("http://10.0.0.1:8080");
        expect(resolveProxyUrl(S3, {mode: "auto", url: ""})).toBe("http://10.0.0.1:8080");
        expect(buildS3RequestHandler(S3, {mode: "auto", url: ""})).toBeDefined();
    });

    it("falls back to HTTP_PROXY for an https target, and accepts lower-case names", () => {
        process.env.http_proxy = "http://10.0.0.2:3128";
        expect(detectEnvProxy()).toBe("http://10.0.0.2:3128");
        expect(resolveProxyUrl(S3, {mode: "auto", url: ""})).toBe("http://10.0.0.2:3128");
    });

    it("prefers HTTPS_PROXY over HTTP_PROXY for an https target", () => {
        process.env.HTTP_PROXY = "http://plain:3128";
        process.env.HTTPS_PROXY = "http://secure:8080";
        expect(resolveProxyUrl(S3, {mode: "auto", url: ""})).toBe("http://secure:8080");
    });

    it("does not fall back to HTTP_PROXY when NO_PROXY excludes the host", () => {
        process.env.HTTP_PROXY = "http://plain:3128";
        process.env.NO_PROXY = ".amazonaws.com";
        expect(detectEnvProxy()).toBe("http://plain:3128");
        expect(resolveProxyUrl(S3, {mode: "auto", url: ""})).toBe("");
    });

    it("honours a NO_PROXY suffix pattern for the target host", () => {
        process.env.HTTPS_PROXY = "http://10.0.0.1:8080";
        process.env.NO_PROXY = ".amazonaws.com";
        // The environment still defines a proxy...
        expect(detectEnvProxy()).toBe("http://10.0.0.1:8080");
        // ...but it must not be used for this host.
        expect(resolveProxyUrl(S3, {mode: "auto", url: ""})).toBe("");
        expect(buildS3RequestHandler(S3, {mode: "auto", url: ""})).toBeUndefined();
        // A host outside NO_PROXY still goes through the proxy.
        expect(resolveProxyUrl("https://s3.example.org", {mode: "auto", url: ""})).toBe("http://10.0.0.1:8080");
    });

    it("treats a bare NO_PROXY domain as an exact host match", () => {
        // proxy-from-env only does suffix matching for entries starting with
        // "." or "*", matching curl's documented behaviour for bare names.
        process.env.HTTPS_PROXY = "http://10.0.0.1:8080";
        process.env.NO_PROXY = "amazonaws.com";
        expect(resolveProxyUrl(S3, {mode: "auto", url: ""})).toBe("http://10.0.0.1:8080");
        expect(resolveProxyUrl("https://amazonaws.com", {mode: "auto", url: ""})).toBe("");
    });

    it("honours a NO_PROXY wildcard pattern", () => {
        process.env.HTTPS_PROXY = "http://10.0.0.1:8080";
        process.env.NO_PROXY = "*.amazonaws.com";
        expect(resolveProxyUrl(S3, {mode: "auto", url: ""})).toBe("");
    });

    it("ignores the environment in off mode", () => {
        process.env.HTTPS_PROXY = "http://10.0.0.1:8080";
        expect(resolveProxyUrl(S3, {mode: "off", url: "http://ignored:1"})).toBe("");
        expect(buildS3RequestHandler(S3, {mode: "off", url: ""})).toBeUndefined();
    });

    it("uses the configured URL in manual mode, overriding the environment", () => {
        process.env.HTTPS_PROXY = "http://from-env:8080";
        process.env.NO_PROXY = "amazonaws.com"; // must not suppress a manual proxy
        expect(resolveProxyUrl(S3, {mode: "manual", url: "  http://manual:3128 "})).toBe("http://manual:3128");
        expect(buildS3RequestHandler(S3, {mode: "manual", url: "http://manual:3128"})).toBeDefined();
    });

    it("treats an empty manual URL as no proxy", () => {
        expect(resolveProxyUrl(S3, {mode: "manual", url: "   "})).toBe("");
        expect(buildS3RequestHandler(S3, {mode: "manual", url: ""})).toBeUndefined();
    });

    it("defaults to auto when no setting is supplied", () => {
        process.env.HTTPS_PROXY = "http://10.0.0.1:8080";
        expect(resolveProxyUrl(S3)).toBe("http://10.0.0.1:8080");
    });

    it("falls back to a direct connection when the proxy URL is unusable", () => {
        expect(buildS3RequestHandler(S3, {mode: "manual", url: "not a url"})).toBeUndefined();
    });
});

describe("redact", () => {
    it("hides embedded credentials", () => {
        const out = redact("http://alice:s3cret@proxy.example.com:8080");
        expect(out).toContain("proxy.example.com:8080");
        expect(out).not.toContain("s3cret");
        expect(out).not.toContain("alice");
    });

    it("leaves credential-free URLs recognisable", () => {
        expect(redact("http://10.0.0.1:8080")).toContain("10.0.0.1:8080");
    });

    it("returns the input unchanged when it cannot be parsed", () => {
        expect(redact("not a url")).toBe("not a url");
    });
});
