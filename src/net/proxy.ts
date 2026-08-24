import {HttpsProxyAgent} from "https-proxy-agent";
import {getProxyForUrl} from "proxy-from-env";
import {NodeHttpHandler} from "@smithy/node-http-handler";
import type {Agent as HttpsAgent} from "https";

/**
 * Proxy support for the S3-compatible uploaders (Amazon S3, Cloudflare R2,
 * Backblaze B2).
 *
 * Those three are the only backends that do not go through Obsidian's
 * `requestUrl`. They use the AWS SDK, which the plugin bundles for
 * `platform: "node"`, so requests are issued by Node's `https` module — and Node
 * honours neither the *_PROXY environment variables nor the OS proxy settings.
 * Behind a corporate proxy they therefore fail to connect at all, while every
 * other backend keeps working.
 */

export type ProxyMode = "auto" | "off" | "manual";

export interface ProxySetting {
    mode: ProxyMode;
    url: string;
}

export const DEFAULT_PROXY_SETTING: ProxySetting = {
    mode: "auto",
    url: "",
};

/**
 * The proxy the environment would use for `targetUrl`, or "" if none applies.
 * NO_PROXY is honoured, which is why the target URL matters.
 */
export function detectProxyForUrl(targetUrl: string): string {
    try {
        const direct = getProxyForUrl(targetUrl);
        if (direct) return direct;

        // getProxyForUrl selects the variable by protocol, so an https:// target
        // never looks at HTTP_PROXY. Many corporate setups define only
        // HTTP_PROXY, so fall back to it — re-running the lookup against an
        // http:// URL for the same host keeps NO_PROXY handling intact instead
        // of reimplementing it. (NO_PROXY entries that pin an explicit port are
        // matched against the rewritten port, which is the one rough edge.)
        const url = new URL(targetUrl);
        if (url.protocol !== "https:") return "";
        url.protocol = "http:";
        return getProxyForUrl(url.toString()) || "";
    } catch {
        return "";
    }
}

/**
 * The raw *_PROXY environment value, ignoring NO_PROXY. Used only to tell the
 * user in the settings tab whether their environment defines a proxy at all.
 */
export function detectEnvProxy(): string {
    const env: Record<string, string | undefined> =
        typeof process !== "undefined" && process.env ? process.env : {};
    for (const name of ["HTTPS_PROXY", "https_proxy", "HTTP_PROXY", "http_proxy"]) {
        const value = env[name];
        if (value && value.trim()) return value.trim();
    }
    return "";
}

/** The proxy URL to use for `targetUrl` under the given setting. */
export function resolveProxyUrl(targetUrl: string, setting?: ProxySetting): string {
    const mode = setting?.mode ?? DEFAULT_PROXY_SETTING.mode;
    switch (mode) {
        case "off":
            return "";
        case "manual":
            return (setting?.url ?? "").trim();
        default:
            return detectProxyForUrl(targetUrl);
    }
}

/**
 * A `requestHandler` for `S3Client`, or undefined to leave the SDK default in
 * place (a plain https.Agent with no proxy awareness).
 */
export function buildS3RequestHandler(
    targetUrl: string,
    setting?: ProxySetting,
): NodeHttpHandler | undefined {
    const proxyUrl = resolveProxyUrl(targetUrl, setting);
    if (!proxyUrl) return undefined;

    let agent: HttpsProxyAgent<string>;
    try {
        agent = new HttpsProxyAgent(proxyUrl, {keepAlive: true, maxSockets: 50});
    } catch (e) {
        console.error(
            `Image upload toolkit: invalid proxy URL "${proxyUrl}", falling back to a direct connection`,
            e,
        );
        return undefined;
    }

    // console.debug rather than log: the plugin's lint rules forbid console.log,
    // and the settings tab already shows which proxy is in effect.
    console.debug(`Image upload toolkit: routing ${targetUrl} through proxy ${redact(proxyUrl)}`);
    // HttpsProxyAgent extends http.Agent (through agent-base) rather than
    // https.Agent, so the structural types do not line up even though
    // NodeHttpHandler handles it fine: it only ever hands the agent to
    // https.request(), which accepts any Agent-shaped object.
    return new NodeHttpHandler({httpsAgent: agent as unknown as HttpsAgent});
}

/** Strips embedded credentials so a proxy URL can safely be logged. */
export function redact(proxyUrl: string): string {
    try {
        const url = new URL(proxyUrl);
        if (url.username || url.password) {
            url.username = "***";
            url.password = "";
        }
        return url.toString();
    } catch {
        return proxyUrl;
    }
}
