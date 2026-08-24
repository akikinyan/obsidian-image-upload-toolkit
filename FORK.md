# Fork notes

This fork of [addozhang/obsidian-image-upload-toolkit](https://github.com/addozhang/obsidian-image-upload-toolkit)
adds two things: HTTP proxy support for the S3-compatible uploaders, and a Japanese UI.

Install with [BRAT](https://github.com/TfTHacker/obsidian42-brat) — "Add beta plugin" →
`akikinyan/obsidian-image-upload-toolkit`. The plugin `id` is unchanged
(`image-upload-toolkit`), so BRAT overwrites the community-store installation in
place and your existing `data.json` settings carry over.

Versions start at **1.7.0** so they sort above upstream's latest release and
Obsidian does not offer the store version as an "update".

## Proxy support

### The problem

Of the ten storage backends, seven talk to the network through Obsidian's
`requestUrl`, which goes via Electron's network stack and therefore honours the
operating system's proxy settings. Three do not:

| Backend | Transport |
|---|---|
| Amazon S3 | AWS SDK v3 → Node `https` |
| Cloudflare R2 | AWS SDK v3 → Node `https` |
| Backblaze B2 | AWS SDK v3 → Node `https` |

The plugin bundles the AWS SDK for `platform: "node"`, so those three issue
requests through Node's `https` module — which consults neither the `*_PROXY`
environment variables nor the OS proxy configuration. Behind a corporate proxy
they cannot connect at all, while every other backend keeps working. The failure
surfaces as a connect timeout, which is easy to misread as a credentials problem.

### The fix

[`src/net/proxy.ts`](src/net/proxy.ts) resolves a proxy URL and hands the S3
client a `NodeHttpHandler` backed by an `HttpsProxyAgent`, so requests go out
over an HTTP `CONNECT` tunnel. Proxy resolution uses
[`proxy-from-env`](https://github.com/Rob--W/proxy-from-env), which implements
the conventional `HTTPS_PROXY` / `HTTP_PROXY` / `NO_PROXY` semantics rather than
a hand-rolled approximation.

Two deliberate deviations from `proxy-from-env`'s defaults:

- **`HTTP_PROXY` is used as a fallback for `https://` targets.** `getProxyForUrl`
  selects the variable strictly by protocol, so an `https://` URL never looks at
  `HTTP_PROXY`. Many corporate setups define only `HTTP_PROXY`. The fallback
  re-runs the lookup against an `http://` URL for the same host, which keeps
  `NO_PROXY` handling intact instead of reimplementing it.
- **`NO_PROXY` matching is whatever `proxy-from-env` does**, i.e. bare entries
  such as `example.com` match that exact host only; use `.example.com` or
  `*.example.com` for suffix matching. This follows curl.

### Settings

**Settings → Image Upload Toolkit → Network → Proxy**:

| Mode | Behaviour |
|---|---|
| Auto-detect from environment (default) | Reads `HTTPS_PROXY` / `HTTP_PROXY`, honouring `NO_PROXY` |
| Do not use a proxy | Always connect directly |
| Specify manually | Use the URL from the "Proxy URL" field, ignoring the environment |

The section shows a status line with the proxy that will actually be used, with
any embedded credentials redacted, so the effective configuration is visible
without opening the developer console. A proxy URL may carry credentials as
`http://user:pass@host:port`.

Note that a proxy that terminates TLS (a MITM inspection proxy) needs its CA in
Node's trust store, e.g. via `NODE_EXTRA_CA_CERTS`; that is outside the plugin's
control.

## Japanese UI

The interface follows Obsidian's own language setting, and can be pinned with
**Settings → Image Upload Toolkit → Language** (Auto / English / 日本語).

Translated: the settings tab, the upload progress modal, all `Notice`
messages, and the "Publish page" command name. Region lists for Aliyun OSS and
Tencent COS stay in English — they are place names.

[`src/i18n/locales/en.ts`](src/i18n/locales/en.ts) is the source of truth and its
strings are byte-identical to the previous hardcoded values, so the English UI is
unchanged. Other locales are typed as `Messages`, which makes a missing or
misspelled key a compile error rather than a blank label at runtime. Messages are
looked up as plain nested properties (`t.s3.region.name`) rather than by string
key, so the whole catalogue is type-checked.

Adding a locale means writing `src/i18n/locales/<code>.ts`, registering it in
`CATALOGUES`, and extending `detectLocale()`.

## Fixed: spaces in object keys were not percent-encoded

Obsidian names pasted screenshots `Pasted image 20260824080301.png`, so object
keys routinely contain spaces. `UploaderUtils.customizeDomainName` only
percent-encoded the path in its bare-object-key branch, added by upstream
[#84](https://github.com/addozhang/obsidian-image-upload-toolkit/pull/84). Every
backend that hands in a full URL — S3, Aliyun OSS, Tencent COS — took the other
branch, which merely swapped the hostname with a regex and let raw spaces
through into the note:

```
![Pasted image 20260824080301](https://cdn.example.com/2026/08/24/Pasted image 20260824080301.png)
```

A literal space terminates the URL in a markdown link, so the image silently
fails to load. Both branches now encode, and the encoding is idempotent
(`decodeURIComponent` then `encodeURIComponent`, falling back to plain encoding
when the key contains a literal `%`), so backends that already encode their own
keys are unaffected.

The uploaded object key itself is unchanged — S3 keys may contain spaces, and
the SDK signs them correctly. Only the URL written into the note changes.

## Other changes

- `display()` in `publishSettingTab.ts` was declared `: unknown` but returned
  nothing, which `tsc` rejects. Changed to `: void`. (Upstream CI runs eslint and
  vitest but not `tsc`, so this went unnoticed.)
- `tsconfig.json` gained a `paths` entry for `https-proxy-agent`, whose v9
  publishes types only through an `exports` map that the classic `node` module
  resolution cannot read. esbuild resolves it correctly; the mapping is for
  `tsc` alone.
- Repeated settings fields ("target path", "custom domain name", "bucket name")
  are now rendered by shared helpers instead of being copy-pasted per backend.

## Releasing

Upstream's `release.yml` builds and attaches release assets on a tag push.
GitHub Actions is disabled by default on forks, so releases here are cut locally:

```bash
npm install --legacy-peer-deps
npm run lint && npm test && npm run build
gh release create <version> --title <version> --notes "..." \
  dist/main.js dist/manifest.json src/styles.css
```

Those are the same three assets the upstream workflow publishes, and the three
BRAT downloads. Bump `version` in both `manifest.json` and `package.json`, and
add the new version to `versions.json`.

On Windows with Node 24, `npm test` can fail with "Timeout waiting for worker to
respond" — vitest workers timing out at startup, unrelated to this plugin
(jsdom environment setup alone accounts for most of the runtime, so a slow
filesystem or an on-access virus scanner is the likely cause). This invocation is
reliable:

```bash
npx vitest run --pool=threads --no-file-parallelism
```

## Tracking upstream

```bash
git fetch upstream
git rebase upstream/main
```

The proxy and i18n changes are additive; the main conflict risk is
`publishSettingTab.ts`, where upstream string edits need mirroring into
`src/i18n/locales/`.
