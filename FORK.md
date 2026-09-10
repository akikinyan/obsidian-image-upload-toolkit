# Fork notes

This fork of [addozhang/obsidian-image-upload-toolkit](https://github.com/addozhang/obsidian-image-upload-toolkit)
adds two things: HTTP proxy support for the S3-compatible uploaders, and a Japanese UI.

Install with [BRAT](https://github.com/TfTHacker/obsidian42-brat) — "Add beta plugin" →
`akikinyan/obsidian-image-upload-toolkit`. The plugin `id` is unchanged
(`image-upload-toolkit`), so BRAT overwrites the community-store installation in
place and your existing `data.json` settings carry over.

## Versioning

Because the plugin `id` is shared with upstream, Obsidian compares this fork's
`manifest.json` version against the community-store version and offers the store
build as an "update" whenever the store number is higher. The fork's version
therefore has to stay above upstream's, permanently.

The first releases (`1.7.0`, `1.8.0`, `1.8.1`) tried to buy that headroom by
starting one minor above upstream's latest. It lasted two weeks: upstream shipped
`1.7.0` and `1.8.0` in the same week of September 2026, and the fork was left a
single patch ahead of a repository that moves faster than it does.

**Releases from `10.0.0` onwards use their own major lane.** The number is the
fork's alone and is incremented independently of upstream — a fork release is
never "upstream 1.9 plus changes", so mirroring upstream's minor was always
describing a relationship that does not exist. Ten leaves upstream room to reach
2.x or 3.x without the question coming back.

Tags in this repository share one namespace with upstream's, since the fork
inherited `1.0.0`–`1.6.7` and `git fetch upstream --tags` brings in more. Never
run `git push --tags`: `release.yml` fires on `tags: ["*"]`, so pushing an
upstream tag would publish a fork release built from upstream's tree. Push the
one tag you mean, by name.

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

## WebP conversion

Local images can be converted to WebP before upload, with the note linking to
the WebP. Off by default.

Conversion runs in the renderer through a canvas — the same route
`MermaidProcessor` already uses to rasterize diagrams — so there is no encoder
dependency. That also fixes the limits: a canvas holds one frame and one raster,
so animated GIFs would lose every frame but the first and SVGs would lose their
scalability. Neither is in the default extension list (`png, jpg, jpeg`), though
the list is editable for anyone who wants that trade.

Three decisions worth recording:

- **The WebP is used only when it is smaller.** Converting a small PNG regularly
  produces a *larger* file. Publishing the bigger of the two would defeat the
  point, so `uploadLocalImage` compares and falls back to the original.
- **Alpha is preserved.** Unlike the mermaid path, the canvas is not pre-filled
  with white, so transparent PNGs stay transparent.
- **Failure is never fatal.** An image the renderer cannot decode, a raster past
  the 16384px canvas limit, or a renderer without a WebP encoder (`toBlob` hands
  back a PNG rather than failing) all fall back to uploading the original.

`Also upload the original` archives the untouched file alongside the WebP. It
goes to its own path template through a second uploader built by
`withPathTemplate`, which keeps the single-method `ImageUploader` interface
intact — extending it would have meant touching all ten implementations. Stores
with no path template (Imgur, Gyazo, ImageKit, GitHub) put both files in the same
place, which is harmless because their extensions differ. If archiving fails the
publish still succeeds: the WebP is already up, and losing it to save a backup
copy would be the wrong trade.

Per-note control is a frontmatter property, read as a tri-state: `true` and
`false` decide, anything else falls back to the configured default. That makes
the switch work in both directions — leave the default on and mark the odd note
`false`, or leave it off and mark the odd note `true`.

Conversion applies to local images only. Web images and mermaid diagrams are
untouched.

## Upload history

Before this, every local image was re-read and re-uploaded on every run of
"Publish page". With a deterministic path template that only overwrites the same
object, but a template containing `{random}` accumulates a fresh copy each time —
and WebP conversion doubles both the encode work and the traffic.

`UploadCache` records the SHA-256 of the bytes that were uploaded against the
resulting URL, so a second publish of an unchanged image reuses the URL instead
of uploading again. Editing an image changes its hash and invalidates the entry
on its own.

The key also carries a short hash of the destination — store id, bucket, region,
endpoint, custom domain — so repointing the plugin at a different bucket does not
hand back a URL from the old one. `destinationParts` deliberately excludes
credentials and the path template: credentials because the cache file is meant to
be safe to sync, the path template because an object uploaded under an older
template is still reachable at its old URL.

The store lives in `upload-cache.json` in the plugin folder rather than in
`data.json`, which stays a settings file and gains exactly one boolean. The cache
is capped at 5000 entries, oldest dropped first, and a corrupt or
unknown-version file is discarded rather than half-read: a wrong hit would
publish a URL pointing at the wrong object.

Excluding that file from vault sync is the documented recommendation. Its
contents are safe to sync — `destinationParts` keeps credentials out
deliberately — but the whole file is rewritten on every publish, so a synced
copy grows the vault's git history on every commit. At roughly 260 bytes per
entry that is ~130KB for 500 images and ~1.3MB at the cap. The cost of excluding
it is that each machine keeps its own history, so the first publish on a second
machine re-uploads everything once.

Settings → Upload history has the on/off switch, the entry count, and a Clear
button for when a note links to a URL that no longer works.

Keying on the source bytes rather than the uploaded ones is deliberate: it lets a
hit skip the conversion as well as the upload. The encoder quality is folded into
the variant string, so lowering it re-converts rather than returning a URL
encoded at the old setting.

## The progress modal

The modal was four lines of centred text of differing widths, saying the same
thing three ways: "Complete", "1/1 (100%)" and "1 succeeded" are one fact, and
with a single image the per-row size repeated the total. It is now left aligned
against one edge with tabular figures, and the redundant lines are gone.

**The progress bar becomes a size comparison when the run ends.** A bar reading
100% carries no information; the same strip showing converted against original
is the clearest statement of what the feature achieved. The two are separate
layouts rather than one that goes stale, because "how much longer" and "what did
it save" are different questions. Each converted row carries a miniature of the
same bar, so a long list shows at a glance which files actually compressed.

The comparison bar's track is the original size, and the green segment at its
right end is what was saved, so green grows as compression improves. Filling the
uploaded part with green instead reads as "more green is better" while meaning
the exact opposite.

The green is a child element rather than a track colour showing through a
neutral overlay. The overlay version looked right in theory and failed in the
app: Obsidian's border colours are translucent in several themes, so the
"neutral" fill tinted the green instead of covering it and the bar read as
almost entirely green regardless of the ratio. Drawing the segment directly
removes the dependency on a variable's opacity.

The settings in effect are chips in the header rather than a sentence, the boxed
list and its "Images" heading are gone in favour of row separators, and long
names ellipsize with the full name on the row's `title`.

Three details are deliberate:

- **A note that opted out reads as "skipped for this note", not as the feature
  being off.** Those two states are otherwise indistinguishable, which sends the
  reader to the settings tab to work out why nothing was converted.
- **A reused image shows no size change.** Nothing was converted on that run, so
  a percentage would be a number the plugin never measured.
- **Auto-close runs 5s with a countdown bar, and pauses while the pointer is
  over the modal.** Showing results and yanking them away after 3s work against
  each other. The remaining time is frozen on pause rather than recomputed from
  the deadline, which keeps sliding into the past while paused.
- **Anything that would say the same thing twice is dropped.** With one image
  the row repeats the comparison above it, so the row keeps only its name; a
  lone success repeats the header, so the counts line disappears; and the title
  moves off "Uploading images" once the run has finished.

The countdown's widths live in CSS classes and its duration in a custom
property, because the plugin's lint rules reject static assignments to
`element.style`.

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

## Fixed: S3 uploads carried no Content-Type

`AwsS3Uploader` sent only `Bucket`, `Key` and `Body`, so S3 applied its default
of `binary/octet-stream`. Opening an image URL directly downloaded the file
instead of displaying it, and anything that trusts the header — link unfurls,
feed readers, static site generators — saw a binary blob. `<img>` tags sniff the
bytes and render regardless, which is why the omission survived: the images
looked fine everywhere they were actually embedded.

Resolution now lives in `UploaderUtils.resolveContentType` and is shared by the
S3, R2 and B2 uploaders. It prefers the `File`'s own type (the WebP converter
sets one) and falls back to an extension table, because files read out of the
vault are constructed without a type.

That fixed two smaller things on the way. R2 built its header as
`image/${extension}`, which emits `image/jpg` for `.jpg` — not a registered
media type. And both R2 and B2 fell back to a fabricated `image/<ext>` for
anything unrecognised; the shared version returns `application/octet-stream`,
which is at least true.

Objects uploaded before this stay as they were. Re-uploading them means clearing
the upload history first, or the type can be replaced in place with
`aws s3 cp --metadata-directive REPLACE` without changing any URL.

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

Actions has been enabled on this fork, so `release.yml` runs on a tag push and
publishes the release itself. Bump `version` in `manifest.json` and
`package.json`, add the version to `versions.json`, then:

```bash
npm run check:version
git tag <version> && git push origin <version>
gh run watch
```

The workflow lints, tests, builds, and attaches `dist/main.js`,
`dist/manifest.json` and `src/styles.css` — the three files BRAT downloads.

`npm run check:version` is the same guard the build runs, so the local call is
only to hear about a mismatch before the tag exists rather than after. It
compares `manifest.json`, `package.json` and `versions.json` against each other,
and — when a tag push is what is building — against the tag as well. Nothing
else does: the release is named after the tag while Obsidian reads the version
out of the attached manifest, so a tag pushed without the matching bump yields a
release whose assets advertise the previous version, and Obsidian keeps offering
an update it has already installed.

The guard runs from `esbuild.config.mjs` on a production build rather than as a
step of its own, because `npm run build` is already the workflow's build step
and putting it there covers local production builds too. A failure aborts the
run before `gh release create`, so a mismatched tag never yields a release.

A fork's inherited workflows stay inert until the owner enables them once in the
repository's Actions tab, and neither `gh workflow list` nor the Actions API
reflects that gate: both reported `active` while pushing tag `1.7.0` produced
zero runs. That is why `1.7.0` was published by hand. If runs ever stop
appearing, check that gate first, and fall back to:

```bash
npm install --legacy-peer-deps
npm run lint && npm test && npm run build
gh release create <version> --title <version> --notes-file notes.md \
  dist/main.js dist/manifest.json src/styles.css
```

`.github/workflows/` can be pushed from the CLI: the token carries the
`workflow` scope. It did not always — an earlier revision of these notes said
the files had to be edited in the GitHub web UI — so if a push is ever rejected
for that reason, check `gh auth status` before believing the workaround.

The step ordering in `release.yml` is load-bearing. Lint, test, build and
attestation all run before `gh release create`, so anything that fails takes the
whole run down without publishing a release. That is what makes it safe to
discover a `release.yml` problem at release time: there is no half-created
release to clean up, and pushing the same tag again after a fix re-runs it.

On Windows with Node 24, `npm test` can fail with "Timeout waiting for worker to
respond" — vitest workers timing out at startup, unrelated to this plugin
(jsdom environment setup alone accounts for most of the runtime, so a slow
filesystem or an on-access virus scanner is the likely cause). It is specific to
Windows: CI runs the same suite on Node 24 under `ubuntu-latest` without it.
This invocation is reliable:

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
