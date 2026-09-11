# 📸 Obsidian Image Upload Toolkit

> Seamlessly upload and manage images for your Obsidian notes across multiple cloud platforms

> **Fork notice** — this is [akikinyan's fork](https://github.com/akikinyan/obsidian-image-upload-toolkit) of
> [addozhang/obsidian-image-upload-toolkit](https://github.com/addozhang/obsidian-image-upload-toolkit).
> It adds HTTP proxy support for the S3-compatible uploaders and a Japanese UI.
> Install it with [BRAT](https://github.com/TfTHacker/obsidian42-brat), not from the community plugin store.
> See [FORK.md](FORK.md) for what differs and why.

> 日本語版のドキュメントは [README_JA.md](README_JA.md) にあります。

## 📋 Table of Contents
- [🚀 Quick Start](#-quick-start)
- [✨ Features](#-features)
- [🛠️ Installation & Configuration](#️-installation--configuration)
- [📖 Usage Guide](#-usage-guide)
- [🔧 Storage Service Configuration](#-storage-service-configuration)
- [🔒 Privacy & Network Use](#-privacy--network-use)
- [🔍 Troubleshooting](#-troubleshooting)
- [📈 Best Practices](#-best-practices)
- [👥 Contributing](#-contributing)
- [📝 Changelog](#-changelog)
- [🙏 Acknowledgements](#-acknowledgements)

## 🚀 Quick Start

### 5-Minute Setup
1. **Install Plugin** - Add `akikinyan/obsidian-image-upload-toolkit` as a BRAT beta plugin
2. **Basic Configuration** - Select Imgur and set up your Client ID
3. **Start Using** - Run the "Publish Page" command in any note
4. **View Results** - Images are automatically uploaded and URLs are copied to clipboard

### System Requirements
- Obsidian 0.12.16 or later
- Desktop only (Windows, macOS, Linux)
- Mobile is not supported

#### Why mobile is not supported

The plugin cannot be enabled in Obsidian on a phone or a tablet.

Getting an image to your storage takes two things: reading the image file out of
the vault folder, and sending it to the storage service. Both rely on facilities
that only the desktop app provides, and the mobile app has no equivalent. It is
not a limitation the plugin can work around.

Images you have already uploaded still display on mobile. What ends up in the
note is an ordinary image URL, no different from a picture on any other website,
so uploading from a desktop machine is enough for the result to render
everywhere.

## ✨ Features

### Core Functionality
Inherited from the upstream plugin.

- ✅ **Smart Image Detection** - Automatically recognizes Markdown and Wiki link formats
- ✅ **Multi-Format Support** - PNG, JPG, JPEG, GIF, SVG, WebP, Excalidraw
- ✅ **Batch Processing** - Upload multiple images simultaneously
- ✅ **Real-Time Progress** - Optional progress modal with detailed feedback
- ✅ **Flexible Paths** - Support for relative paths and dynamic path variables
- ✅ **Web Image Upload** - Download and re-upload web images to your storage (optional)
- ✅ **Mermaid Conversion** - Automatically convert mermaid diagrams to PNG images during publish (optional)

### Added in This Fork
- ✅ **Proxy Support** - Route the S3-compatible uploaders through an HTTP proxy ([details](FORK.md#proxy-support))
- ✅ **WebP Conversion** - Convert local images to WebP before upload, optionally archiving the originals (off by default, [details](FORK.md#webp-conversion))
- ✅ **Upload History** - Skip re-uploading images whose contents have not changed (on by default, [details](FORK.md#upload-history))
- ✅ **Japanese UI** - Follows Obsidian's own language setting ([details](FORK.md#japanese-ui))
- ✅ **S3-compatible endpoints** - Point the AWS S3 store at MinIO, DigitalOcean Spaces, Wasabi or Ceph ([details](FORK.md#s3-compatible-endpoints))

The fork also carries bug fixes, some backported from upstream and some found
here. Those are recorded in the [Changelog](#-changelog) rather than listed as
features. [README_JA.md](README_JA.md) documents the four additions above in
full; this file links to [FORK.md](FORK.md) instead of repeating it.

### Supported Storage Services (10 providers)
| Service | Rating | Best For |
|---------|---------|----------|
| Imgur | ⭐⭐⭐ | Personal blogs |
| GitHub | ⭐⭐⭐⭐ | Open source projects |
| Cloudflare R2 | ⭐⭐⭐⭐⭐ | Professional use |
| AWS S3 | ⭐⭐⭐⭐ | Enterprise, or any S3-compatible service |
| Aliyun OSS | ⭐⭐⭐⭐ | Chinese users |
| TencentCloud COS | ⭐⭐⭐⭐ | Chinese users |
| Qiniu Kodo | ⭐⭐⭐⭐ | Chinese users |
| ImageKit | ⭐⭐⭐⭐ | CDN optimization |
| Backblaze B2 | ⭐⭐⭐⭐ | Cost-effective storage |
| Gyazo | ⭐⭐⭐⭐ | Fast sharing workflows |

Perfect for publishing to static sites like [GitHub Pages](https://pages.github.com) or any platform requiring externally hosted images.

## 🛠️ Installation & Configuration

### Step 1: Install Plugin
This fork is not listed in the community plugin store, so it is installed with
[BRAT](https://github.com/TfTHacker/obsidian42-brat).

1. Install and enable "Obsidian42 - BRAT" from Community Plugins
2. In BRAT's settings, choose "Add beta plugin"
3. Enter `akikinyan/obsidian-image-upload-toolkit`
4. Enable "Image Upload Toolkit" under Settings → Community Plugins

The plugin id is the same as upstream's, so a store installation is overwritten
in place and your existing `data.json` settings carry over. BRAT checks for
updates at startup, so new releases arrive on their own.

### Step 2: Basic Settings
- **Use image name as Alt Text**: ✅ Recommended (uses filename as alt text)
- **Update original document**: ❌ Suggested disabled (preserves original notes)
- **Ignore note properties**: ✅ Recommended (removes frontmatter when publishing)
- **Show progress modal**: ✅ Recommended (better user experience)
- **Upload web images**: ❌ Optional (downloads and re-uploads web images to prevent link rot)
- **Convert mermaid diagrams**: ❌ Optional (converts mermaid code blocks to PNG images during publish)
- **Mermaid scale**: 2 (image resolution multiplier, 1-4x)
- **Mermaid theme**: default (options: default/dark/forest/neutral/base)

Those are all inherited from upstream. This fork adds four more settings:

- **Language**: auto (follows Obsidian's own language setting; can be pinned to English or Japanese)
- **Proxy**: auto-detect from environment ([details](FORK.md#proxy-support))
- **WebP conversion**: off by default ([details](FORK.md#webp-conversion))
- **Upload history**: on by default ([details](FORK.md#upload-history))
- **S3-compatible endpoint**: empty by default, meaning real AWS S3 ([details](FORK.md#s3-compatible-endpoints))

### Step 3: Choose Storage Service
Select your preferred storage service from the dropdown. See [Storage Service Configuration](#-storage-service-configuration) for detailed setup instructions.

## 📖 Usage Guide

### Basic Usage
1. Open any note with local images
2. Use Command Palette (Ctrl/Cmd + P)
3. Type "Publish Page" and select the command
4. All local images will be uploaded to your configured storage
5. Updated markdown with new URLs is copied to clipboard

![screenshot](https://github.com/user-attachments/assets/d20abcac-78a3-4275-b391-818ad781c219)

### Advanced Usage
- **Custom Paths**: Use variables like `{year}/{mon}/{day}/{filename}` in path settings
- **Relative Paths**: Support for `./` and `../` relative path formats
- **Dynamic Attachments**: Works with Obsidian's attachment folder settings
- **Web Image Upload**: Enable in settings to automatically download and re-upload web images (http/https URLs) to your storage service. Images already hosted on your configured storage are automatically skipped.

## 🔧 Storage Service Configuration

### Service Selection Guide
- **Personal Use**: Imgur (simple and free)
- **Open Source**: GitHub (version control integration)
- **Quick Sharing**: Gyazo (simple token-based upload)
- **Professional**: Cloudflare R2 (high performance)
- **Enterprise**: AWS S3 (full-featured)
- **Chinese Users**: Aliyun OSS (optimized for China)
- **Budget-Friendly**: Backblaze B2 (low-cost with generous free tier)

### Detailed Configuration

#### Imgur (Recommended for Beginners)
```markdown
1. Visit https://api.imgur.com/oauth2/addclient
2. Create application (select "OAuth 2 authorization without a callback URL")
3. Copy Client ID to plugin settings
4. No additional keys required
```

#### GitHub (Recommended for Developers)
```markdown
1. Create Personal Access Token with 'repo' scope
2. Prepare a public repository for image storage
3. Configure repository information and access token
Note: Images are committed as regular files to the repository
```

#### Gyazo
```markdown
1. Visit https://gyazo.com/oauth/applications
2. Create a Gyazo application
3. Issue an access token from the application dashboard
4. No OAuth callback server is required for this plugin. It uses the issued access token directly.
5. Configure in plugin:
   - Access Token
   - Access Policy: anyone or only_me
   - Common Description: optional shared desc value for every upload
Note: only_me uploads may not be usable for public publishing workflows
```

#### Cloudflare R2 (Recommended for Professional Use)
```markdown
1. Sign up at https://dash.cloudflare.com/sign-up
2. Enable R2 storage in your Cloudflare dashboard
3. Create an R2 bucket for images
4. Generate API credentials:
   - Go to R2 → Overview → Manage R2 API Tokens
   - Create token with read/write permissions
5. Configure in plugin:
   - Access Key ID and Secret Access Key
   - Endpoint: https://<account-id>.r2.cloudflarestorage.com
   - Bucket Name: Your bucket name
   - Custom Domain: Optional (R2.dev URL or custom domain)
```

#### AWS S3
```markdown
1. Create AWS account at https://aws.amazon.com
2. Create S3 bucket with public read access
3. Generate IAM credentials with S3 permissions
4. Configure in plugin:
   - Access Key ID and Secret Access Key
   - Region: AWS region of your bucket
   - Bucket Name: Your S3 bucket name
   - Custom Domain: Optional CDN domain
```

#### Aliyun OSS (阿里云对象存储)
```markdown
1. Create Alibaba Cloud account
2. Create OSS bucket with appropriate permissions
3. Generate AccessKey pair from RAM console
4. Configure in plugin:
   - Access Key ID and Secret
   - Region: e.g., oss-cn-hangzhou
   - Bucket Name: Your OSS bucket
   - Custom Domain: Optional CDN domain
```

#### ImageKit
```markdown
1. Create account at https://imagekit.io/registration/
2. Get API credentials from dashboard
3. Configure in plugin:
   - Public Key and Private Key
   - URL Endpoint: https://ik.imagekit.io/your_imagekit_id/
   - Folder: Optional organization folder
```

#### TencentCloud COS (腾讯云对象存储)
```markdown
1. Create Tencent Cloud account
2. Create COS bucket with appropriate permissions
3. Generate SecretId and SecretKey from CAM console
4. Configure in plugin:
   - Secret ID and Secret Key
   - Region: e.g., ap-guangzhou
   - Bucket Name: Your COS bucket
   - Custom Domain: Optional CDN domain
```

#### Qiniu Kodo (七牛云存储)
```markdown
1. Create Qiniu Cloud account
2. Create Kodo bucket
3. Generate Access Key and Secret Key
4. Configure in plugin:
   - Access Key and Secret Key
   - Bucket Name: Your Kodo bucket
   - Custom Domain: Domain bound to your bucket
```

#### Backblaze B2
```markdown
1. Create Backblaze account at https://www.backblaze.com/b2/sign-up.html
2. Create a B2 bucket for images
3. Generate Application Key from App Keys page
4. Configure in plugin:
   - Key ID: Your application key ID
   - Application Key: Your application key
   - Bucket ID: Your B2 bucket ID
   - Bucket Name: Your B2 bucket name
   - Custom Domain: Optional (Cloudflare CDN or custom domain)
```

## 🔒 Privacy & Network Use

This plugin makes outbound network requests **only** to the storage service you explicitly select and configure in the settings tab. No telemetry, analytics, or tracking requests are sent anywhere. All requests are made through Obsidian's built-in `requestUrl` API or the official AWS SDK (used for S3-compatible services).

### Endpoints contacted

The plugin will contact one of the following hostnames depending on which storage service is configured. If a service is not configured, no requests are made to its endpoint.

| Service | Endpoint(s) |
|---|---|
| Imgur | `api.imgur.com` |
| Gyazo | `upload.gyazo.com` |
| Aliyun OSS | `<bucket>.<region>.aliyuncs.com` (region you configure) |
| ImageKit | `upload.imagekit.io` |
| AWS S3 | `s3.<region>.amazonaws.com` (region you configure) |
| Tencent COS | `<bucket>.cos.<region>.myqcloud.com` (region you configure) |
| Qiniu Kodo | `upload.qiniup.com` |
| GitHub | `api.github.com` |
| Cloudflare R2 | `<account-id>.r2.cloudflarestorage.com` (account you configure) |
| Backblaze B2 | `s3.<region>.backblazeb2.com` (region you configure) |

### Optional features that make additional requests

- **Upload web images** (off by default): when enabled, the plugin downloads images referenced by `http(s)://` URLs in your note before re-uploading them to your configured storage. Requests go to whichever hostnames those URLs point to.
- **Convert Mermaid diagrams to images** (off by default): Mermaid rendering happens entirely in the local Obsidian renderer; no network requests are made for diagram rendering itself. The resulting PNG is uploaded through your configured storage like any other image.

### Credentials & data handling

- API keys, tokens, and secrets you enter are stored in Obsidian's plugin data file (`.obsidian/plugins/image-upload-toolkit/data.json`) on your device only.
- The upload history (fork addition) is kept separately in `.obsidian/plugins/image-upload-toolkit/upload-cache.json` and holds no credentials — only content hashes and the resulting URLs. Because the whole file is rewritten on every publish, excluding it from vault sync is recommended; add `upload-cache.json` to a `.gitignore` in that folder.
- Credentials are sent only to the corresponding storage service's official endpoint, using the request signing required by that service.
- The plugin does not transmit your note contents to any service beyond the images you upload.

## 🔍 Troubleshooting

### Common Issues

#### "Cannot locate image" Error
**Cause**: Incorrect image path configuration or missing files
**Solution**:
1. Check Obsidian's attachment folder settings
2. Verify image files exist at specified paths
3. Try using absolute paths for testing

#### Imgur Upload Failures
**Cause**: API limits or network issues
**Solution**:
1. Verify Client ID is correct
2. Wait a few minutes and retry (Imgur has rate limits)
3. Consider alternative storage services

#### Relative Paths Not Working
**Cause**: Plugin version or path resolution issues
**Solution**:
1. Update to latest version
2. Use relative paths starting with `./` or `../`
3. Check Obsidian's attachment settings

#### Progress Modal Not Showing
**Cause**: Settings issue or plugin conflicts
**Solution**:
1. Verify "Show progress modal" setting is enabled
2. Restart Obsidian
3. Check for conflicting plugins

#### Upload Errors with Special Characters
**Cause**: Filename encoding issues
**Solution**:
1. Avoid special characters in filenames
2. Use only alphanumeric characters, hyphens, and underscores
3. Check filename encoding in your file system

#### Uploads Time Out Behind a Corporate Proxy
**Cause**: AWS S3, Cloudflare R2 and Backblaze B2 use the AWS SDK, which issues requests through Node's `https` module. Node honours neither the `*_PROXY` environment variables nor the OS proxy settings, so those three cannot connect while the other seven backends keep working.
**Solution**:
1. Open Settings → Network → Proxy
2. Leave it on "Auto-detect from environment" if `HTTPS_PROXY` or `HTTP_PROXY` is set, otherwise choose "Specify manually" and enter the URL
3. The status line under the dropdown shows the proxy actually in effect
4. See [FORK.md](FORK.md#proxy-support) for the details, including `NO_PROXY` matching rules

#### Web Image Download Failures
**Cause**: Network issues, CORS restrictions, or authentication requirements
**Solution**:
1. Check your internet connection
2. Verify the web image URL is accessible
3. Some images may require authentication and cannot be downloaded
4. Disable "Upload web images" if you only want to process local images

## 📈 Best Practices

### Workflow Recommendations
1. **Backup Important Data** - Always backup before uploading
2. **Test Configuration** - Use test images to verify setup
3. **Choose Appropriate Storage** - Match service to your use case
4. **Monitor Links** - Regularly check uploaded image URLs

### Performance Optimization
- Process smaller files first when batch uploading
- Use local storage services when network is unstable
- Regularly clean up unused configuration cache

### Security Guidelines
- Never share API keys publicly
- Rotate access credentials regularly
- Use minimum required permissions for storage services

### File Organization
- Use consistent naming conventions
- Organize images by date or project
- Consider using path variables for automatic organization

## 👥 Contributing

### How to Contribute
1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup
```bash
git clone https://github.com/akikinyan/obsidian-image-upload-toolkit.git
cd obsidian-image-upload-toolkit
npm install --legacy-peer-deps
npm run dev
```

### Code Standards
- Use TypeScript strict mode
- Follow existing code style
- Include proper error handling
- Add meaningful commit messages

### Testing Requirements
- Test on multiple platforms if possible
- Verify functionality with different storage services
- Ensure backward compatibility

## 📝 Changelog

### Unreleased (this fork)
- 🐛 **WebP archiving now works for the GitHub store.** Keeping the untouched original alongside the WebP silently reused the WebP's own path there, so both landed in the same folder. GitHub gained a working Target Path in 10.0.0 but was still registered as a store that has none, so the archive path field was hidden and the template ignored

### v10.1.0 (this fork)
- ✨ **S3-compatible endpoints.** The AWS S3 store takes an optional endpoint, so it can address MinIO, DigitalOcean Spaces, Wasabi, Ceph or any other S3-compatible service. Requests switch to path-style addressing when it is set, region becomes a signing detail that defaults to `us-east-1`, and the endpoint host feeds both the proxy decision and the already-hosted check. Based on [upstream #55](https://github.com/addozhang/obsidian-image-upload-toolkit/pull/55) by @njzc, which is still open there

### v10.0.0 (this fork)
Bug fixes backported from upstream 1.6.8 – 1.8.0. The provider-descriptor refactor those releases also carried is not included.
- 🐛 The GitHub uploader ignored Target Path — every image was committed to the repository root — and the setting was not even rendered, so there was nothing to notice. Raw URLs are now percent-encoded too, which filenames with spaces need (upstream #88)
- 🐛 The directory part of a link leaked into the remote object key, so the `../` segments Obsidian emits for relative links broke pre-signed keys: the HTTP layer normalizes them away before the request leaves Electron, and Tencent COS then answered `SignatureDoesNotMatch` because it signed the collapsed path (upstream #89, by kba977)
- 🐛 Backblaze B2 returned a relative path instead of a URL when no custom domain was set, and Qiniu Kodo joined the domain and key without a scheme, which is what a domain entered without `https://` produces. Both broke the image link
- 🐛 A Target Path without `{filename}` — such as `images` or `images/{year}` — collapsed every upload onto one remote key, each upload overwriting the last. Affected OSS, COS, Kodo, S3, R2 and B2
- 🐛 Settings were merged shallowly, so a `data.json` written by an older version replaced a whole provider block and every field added since came back `undefined` instead of falling back to its default. Prototype-polluting keys in `data.json` are now dropped
- 🔖 Fork releases move to their own major lane. The plugin `id` is shared with upstream, so the fork's version has to outrank the community-store version or Obsidian offers the store build as an "update"; starting one minor above upstream stopped working when upstream shipped two minors in one week. See [FORK.md](FORK.md) for the reasoning
- 🔧 `manifest.json`, `package.json`, `versions.json` and the release tag are now checked against each other by the production build, so a tag pushed without the matching bump fails before the release is created

### v1.8.1 (this fork)
- 🐛 The AWS S3 uploader never set `Content-Type`, so objects were stored as `binary/octet-stream` and opening an image URL directly downloaded the file instead of displaying it. `<img>` tags sniff the bytes and render either way, which is why this went unnoticed
- 🔧 Content-Type resolution is now shared by the S3, R2 and B2 uploaders. R2 previously emitted `image/jpg`, which is not a registered media type, and an unknown extension produced a fabricated `image/<ext>`; both now resolve properly, falling back to `application/octet-stream`

### v1.8.0 (this fork)
- ✨ WebP conversion for local images, off by default. Configurable extension list (`png, jpg, jpeg`), quality, and a per-note frontmatter override that works in both directions
- ✨ Optionally archive the untouched original alongside the WebP, at its own path template
- ✨ Upload history: images whose contents have not changed reuse their existing URL instead of being uploaded again. Stored in `upload-cache.json`, with a Clear button in the settings tab
- 🔧 The WebP is used only when it is actually smaller than the original, so small PNGs are not made worse

### v1.7.0 (this fork)
- ✨ HTTP proxy support for AWS S3, Cloudflare R2 and Backblaze B2, with auto-detection from the environment, a manual override, and an off switch
- ✨ Japanese UI for the settings tab, progress modal, notices and command name; follows Obsidian's language setting and can be pinned in the settings tab
- 🐛 Fixed object paths not being percent-encoded by the uploaders that build a full URL (S3, Aliyun OSS, Tencent COS), which broke image links for filenames containing spaces
- 🔧 Fixed `display()` in `publishSettingTab.ts` being declared `: unknown` while returning nothing, which `tsc` rejects

### Upstream v1.5.0 – v1.6.7
Not previously recorded in this changelog. Highlights:
- ✨ Added Gyazo support
- 🔧 Migrated the AWS SDK from v2 to the modular v3
- 🔧 Replaced the Aliyun OSS, Tencent COS and Qiniu Kodo SDKs with `requestUrl` plus inline request signing
- 🐛 Surfaced upload failures, and trimmed whitespace from AWS-family credentials
- 🐛 Serialized GitHub uploads
- 🐛 Encoded object paths when a custom domain is configured
- ✅ Added a vitest test suite

### v1.4.0
- 🔖 Version bump release — same features as v1.3.0 with corrected release tagging

### v1.3.0
- ✨ Added mermaid diagram conversion to PNG images during publish
- ✨ Added Backblaze B2 storage support
- ✨ Configurable mermaid scale factor (1-4x) and theme (default/dark/forest/neutral/base)
- 🐛 Fixed double-upload of mermaid-generated images when "Upload web images" is enabled
- 🐛 Mermaid source blocks are preserved when "Update original document" is enabled
- 🔧 Migrated ImageKit from SDK to Obsidian's built-in `requestUrl` API
- 🔧 Improved B2 MIME type detection and URL derivation

### v1.2.0
- ✨ Added web image upload feature (addresses #37)
- ✨ Smart detection to skip images already hosted on your storage
- 📝 Improved documentation and error messages

### v1.1.3
- ✨ Added Cloudflare R2 support
- 🐛 Fixed relative path handling issues
- 📝 Improved error messages

### v1.1.2
- ✨ Added Qiniu Kodo support
- 🐛 Fixed subfolder attachment path issues
- 🎨 Enhanced progress display interface

### v1.1.1
- ✨ Added GitHub repository storage support
- 🐛 Fixed dynamic path variable issues
- 📖 Updated configuration documentation

### v1.1.0
- ✨ Added TencentCloud COS support
- 🐛 Fixed various upload issues
- 🎨 Improved user interface

### v1.0.0
- 🚀 Initial release
- ✨ Support for Imgur, Aliyun OSS, ImageKit, AWS S3
- 📖 Basic documentation

## 🙏 Acknowledgements

This plugin was inspired by the powerful markdown editor [MWeb Pro](https://www.mweb.im) and builds upon the work of several exceptional projects:

- [obsidian-imgur-plugin](https://github.com/gavvvr/obsidian-imgur-plugin) - Reference implementation for Imgur upload functionality
- [obsidian-image-auto-upload-plugin](https://github.com/renmu123/obsidian-image-auto-upload-plugin) - Inspiration for additional features
- [create-obsidian-plugin](https://www.npmjs.com/package/create-obsidian-plugin) - Tooling for plugin development

---

<div align="center">

**Made with ❤️ by [Addo Zhang](https://github.com/addozhang)**

[🌟 Star this repo](https://github.com/addozhang/obsidian-image-upload-toolkit) | [🐛 Report Issues](https://github.com/addozhang/obsidian-image-upload-toolkit/issues) | [📖 Documentation](https://github.com/addozhang/obsidian-image-upload-toolkit#readme)

*Seamlessly upload and manage images for your Obsidian notes across multiple cloud platforms*

</div>
