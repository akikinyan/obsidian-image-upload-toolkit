import type {Messages} from "./en";

/** Simplified Chinese messages. Typed as Messages, so a missing key is a compile error. */
const zhCN: Messages = {
    command: {
        publishPage: "发布页面",
    },

    general: {
        altText: {
            name: "用图片名作为替代文本",
            desc: "开启：链接方括号内填入图片文件名（“-”和“_”替换为空格）。关闭：方括号内留空。显示效果不变，只影响图片无法加载时显示的文字。",
        },
        updateOriginalDoc: {
            name: "改写原笔记",
            desc: "开启：把原笔记中的图片链接替换为上传后的 URL。关闭：不改动原笔记，只把替换后的正文复制到剪贴板。",
        },
        ignoreProperties: {
            name: "复制时去掉笔记属性",
            desc: "开启：复制到剪贴板的正文不包含笔记开头的属性（Front Matter）。关闭：连同属性一起复制。无论哪种，原笔记中的属性都不会被删除。",
        },
    },

    upload: {
        heading: "上传",
        progressModal: {
            name: "用对话框显示上传进度",
            desc: "开启：弹出对话框，逐张显示成功或失败（全部成功时 3 秒后自动关闭）。关闭：只在右下角状态栏显示一行进度。",
        },
        webImages: {
            name: "同时上传网络图片",
            desc: "开启：笔记中引用 http / https URL 的图片也会被下载，重新上传到你的存储并替换链接，即使原网址失效图片也能保留。关闭：外部 URL 保持原样。已经位于你自己存储上的图片，无论开关都会跳过。",
        },
    },

    webp: {
        heading: "WebP 转换",
        enabled: {
            name: "将图片转换为 WebP",
            desc: "开启：上传前把本地图片转换为 WebP，笔记中写入 WebP 的链接。只处理本地图片，网络图片和 Mermaid 图表不转换。关闭：按原格式上传。",
        },
        extensions: {
            name: "要转换的扩展名",
            desc: "用逗号分隔，不带点。默认不包含 GIF 和 SVG，因为转换通过 canvas 进行：动图只会保留第一帧，SVG 会被栅格化，放大后不再清晰。",
            placeholder: "png, jpg, jpeg",
        },
        quality: {
            name: "质量",
            desc: "WebP 的压缩质量。数值越低文件越小，画质损失也越大。照片约 75、含文字的图约 90 比较合适。若转换后反而比原图大，会自动改为上传原文件。",
        },
        keepOriginal: {
            name: "同时上传原图",
            desc: "开启：把未经转换的原文件也上传一份作为存档，笔记中仍然链接 WebP。关闭：只上传 WebP，存储中不保留原文件。",
        },
        originalPath: {
            name: "原图保存路径",
            desc: "存档原文件的存放位置，可使用与“保存路径”相同的变量。请与保存路径区分开，否则 WebP 和原文件会混在一起。",
            placeholder: "/originals/{year}/{mon}/{day}/{filename}",
        },
        originalPathUnsupported: "该上传目标不支持指定路径，原文件将与 WebP 放在同一位置。两者扩展名不同，不会互相覆盖。",
        frontmatterProperty: {
            name: "按笔记切换的属性",
            desc: "笔记属性的名称。在某篇笔记中设为 true 则转换，设为 false 则不转换。留空则停用按笔记切换。",
            placeholder: "webp",
        },
        frontmatterDefault: {
            name: "未设置属性时的默认值",
            desc: "应用于没有写该属性的笔记。关闭后，只有通过属性明确开启的笔记才会转换。",
        },
    },

    cache: {
        heading: "上传记录",
        enabled: {
            name: "不重复上传未改动的图片",
            desc: "开启：记录已上传的文件内容，之后直接复用同一个 URL。编辑过的图片会重新上传，更换存储桶或域名后记录也不再使用。关闭：每次发布都重新上传。",
        },
        clear: {
            name: "清除上传记录",
            desc: "丢弃所有记录，下次发布时重新上传全部图片。已上传的文件本身不会被删除。笔记中的链接打不开时可以使用。",
            button: "清除",
        },
        entries: (count: number) => `已记录 ${count} 条`,
        cleared: (count: number) => `已清除 ${count} 条上传记录`,
    },

    mermaid: {
        heading: "Mermaid",
        convert: {
            name: "将 Mermaid 图表转换为图片",
            desc: "开启：发布时把 mermaid 代码块渲染为 PNG 并上传，替换为图片链接。适合粘贴到不支持 Mermaid 的地方。关闭：保留代码块。",
        },
        scale: {
            name: "Mermaid 图片倍率",
            desc: "导出 PNG 的清晰度。设为 2 时，按图表显示尺寸的 2 倍像素导出。数值越大越清晰，文件也越大。高分辨率屏幕建议 2。",
        },
        theme: {
            name: "Mermaid 主题",
            desc: "导出图表的配色。不随 Obsidian 的外观主题变化，固定使用此处指定的配色。",
            options: {
                default: "默认",
                dark: "深色",
                forest: "森林",
                neutral: "中性",
                base: "基础",
            },
        },
    },

    network: {
        heading: "网络",
        mode: {
            name: "代理",
            desc: "连接 Amazon S3 / Cloudflare R2 / Backblaze B2 时是否经过代理。这三者不经过 Obsidian，而是由 AWS SDK 直接通信，因此 Windows 或 macOS 的系统代理设置对它们无效。在公司代理环境下，不在这里设置的话上传会超时。不影响其他上传目标。",
            options: {
                auto: "从环境变量自动获取",
                off: "不使用代理",
                manual: "手动输入 URL",
            },
        },
        url: {
            name: "代理 URL",
            desc: "例如 http://proxy.example.com:8080。需要认证的代理可写成 http://用户名:密码@proxy.example.com:8080。",
            placeholder: "http://host:port",
        },
        detected: (url: string) => `已从环境变量检测到代理，将经由：${url}`,
        notDetected: "未找到环境变量 HTTPS_PROXY / HTTP_PROXY，将不经代理直接连接。如果处于代理环境下会因此失败，请切换到“手动输入 URL”。",
        manualActive: (url: string) => `将经由此代理：${url}`,
        manualEmpty: "下方输入框为空，这样会不经代理直接连接。",
        disabled: "不经代理直接连接，即使设置了环境变量也会忽略。",
    },

    language: {
        name: "语言",
        desc: "本设置页面和通知消息的显示语言。“自动”跟随 Obsidian 的语言设置。切换后立即生效。",
        options: {
            auto: "自动",
        },
    },

    imageStore: {
        heading: "上传目标",
        select: {
            name: "上传服务",
            desc: "图片上传到哪里。更改后，下方的输入项会切换为该服务对应的项目。各服务的设置分别保存，切换后之前填写的内容不会丢失。",
        },
    },

    filter: {
        heading: "要上传的文件夹",
        scope: {
            name: "上传范围",
            desc: "此上传目标上传哪些本地图片。文件夹设置按上传目标分别保存。",
            options: {
                all: "所有文件夹",
                selected: "仅所选文件夹",
            },
        },
        hint: "包含子文件夹。未纳入范围的图片，其链接保持原样。",
        include: {
            name: "目标文件夹",
            add: "添加文件夹",
            empty: "请添加目标文件夹。添加之前，不会有任何本地图片上传到此上传目标。",
        },
        exclude: {
            name: "排除的文件夹",
            desc: "这些文件夹中的图片始终不上传，即使位于目标文件夹内。",
            add: "添加排除的文件夹",
            empty: "没有排除的文件夹。",
        },
        remove: "移除",
        missing: "找不到该文件夹。可能已被删除，或在插件停用期间被移动。此条件会一直保留，直到你将其移除。",
        pickFolder: "选择文件夹",
        test: {
            name: "测试条件",
            desc: "查看按上述条件哪些图片会被上传，不会实际上传。",
            button: "测试",
        },
    },

    filterTest: {
        title: "上传条件测试",
        disclaimer: "这里只检查上传范围，不检查连接和凭据。",
        store: (name: string) => `上传目标：${name}`,
        scopeNote: "笔记中的图片",
        scopeVault: "整个仓库的图片",
        note: (path: string) => `笔记：${path}`,
        noNote: "未选择笔记。",
        changeNote: "选择笔记",
        pickNote: "选择笔记",
        search: "按路径搜索",
        allVerdicts: "全部结果",
        verdict: {
            included: "上传",
            excluded: "匹配排除的文件夹",
            outOfScope: "不在目标文件夹中",
            notFound: "找不到图片",
        },
        column: {
            path: "图片",
            verdict: "结果",
            reason: "原因",
            refs: "链接数",
        },
        reason: {
            allFolders: "所有文件夹都在范围内。",
            inTarget: (folders: string) => `位于目标文件夹 ${folders} 中。`,
            noTarget: "未选择目标文件夹。",
            notInTarget: "不在任何目标文件夹下。",
            excluded: (folders: string) => `位于排除的文件夹 ${folders} 中。`,
            excludedOverTarget: (excluded: string, target: string) =>
                `同时位于排除的文件夹 ${excluded} 和目标文件夹 ${target} 中，排除优先。`,
            notFound: (link: string) => `仓库中没有与链接 ${link} 匹配的文件。`,
        },
        count: (label: string, n: number) => `${label}：${n} 张`,
        page: (current: number, total: number, shown: number) => `第 ${current} / ${total} 页（${shown} 张）`,
        prev: "上一页",
        next: "下一页",
        empty: "没有可显示的图片。",
        otherHeading: "不受文件夹条件影响",
        webOn: (n: number, hosted: number) =>
            `网络图片：${n} 张。发布时下载并上传` + (hosted > 0 ? `（已在此上传目标上的 ${hosted} 张除外）。` : "。"),
        webOff: (n: number) => `网络图片：${n} 张。保持原样（“同时上传网络图片”已关闭）。`,
        mermaidOn: (n: number) => `Mermaid 图表：${n} 个。发布时渲染为图片并上传。`,
        mermaidOff: (n: number) => `Mermaid 图表：${n} 个。保留为代码（“将 Mermaid 图表转换为图片”已关闭）。`,
        readFailed: (message: string) => `无法读取笔记：${message}`,
    },

    common: {
        bucketName: {
            name: "存储桶名称",
            desc: "用于保存图片的存储桶（Bucket）名称，需要事先创建。",
            placeholder: "输入存储桶名称",
        },
        targetPath: {
            name: "保存路径",
            desc: "图片放在存储桶中的什么位置。可使用 {year} {mon} {day} {random} {filename} {foldername} {notename}。例如 /{year}/{mon}/{day}/{filename} 会把 pic.jpg 保存为 /2026/08/24/pic.jpg。{foldername} 是笔记所在文件夹的名称，{notename} 是笔记本身的名称，因此写成 img/{notename}/{filename} 就能按笔记归类图片。仓库根目录下的笔记，{foldername} 为空，该段会被省略。留空则只用文件名，同名文件可能被覆盖。",
            placeholder: "/{year}/{mon}/{day}/{filename}",
        },
        customDomain: {
            name: "自定义域名",
            desc: "写入笔记的链接所用的域名。前面接了 CDN 时填写。填入 cdn.example.com 后，链接变为 https://cdn.example.com/保存路径。留空则直接使用存储本身的 URL。上传位置不变。",
            placeholder: "cdn.example.com",
        },
    },

    imgur: {
        clientId: {
            name: "Client ID",
            placeholder: "输入 Client ID",
        },
        descPrefix: "默认值是插件共用的 ID，上传较多时会触发次数限制，建议生成自己的 Client ID 替换：",
    },

    gyazo: {
        accessToken: {
            name: "访问令牌",
            placeholder: "输入访问令牌",
        },
        tokenDescPrefix: "请在 Gyazo 创建应用并生成访问令牌：",
        accessPolicy: {
            name: "公开范围",
            desc: "谁可以查看上传的图片。选择“仅自己”后，其他人和外部网站将无法打开笔记中的 URL。用于分享的笔记请选择“所有人”。",
            options: {
                anyone: "所有人",
                onlyMe: "仅自己",
            },
        },
        commonDescription: {
            name: "统一描述",
            desc: "为每张上传的图片附加相同的描述，方便日后在 Gyazo 列表中查找。留空则不附加描述。",
            placeholder: "输入统一描述（可选）",
        },
    },

    oss: {
        region: {
            name: "地域",
            desc: "存储桶所在的地域。与存储桶不一致时上传会失败。选择后 Endpoint 也会自动切换。",
        },
        accessKeyId: {
            name: "AccessKey ID",
            desc: "在阿里云 RAM 中创建的 AccessKey ID。",
            placeholder: "输入 AccessKey ID",
        },
        accessKeySecret: {
            name: "AccessKey Secret",
            desc: "与 AccessKey ID 配对的密钥，只在创建时显示一次。",
            placeholder: "输入 AccessKey Secret",
        },
    },

    imagekit: {
        id: {
            name: "ImageKit ID",
            placeholder: "输入 ImageKit ID",
        },
        descPrefix: "ID 和各密钥可在控制台中查看：",
        folder: {
            name: "保存文件夹",
            desc: "放在 ImageKit 中的哪个文件夹。留空则放在根目录。",
            placeholder: "输入文件夹名称",
        },
        publicKey: {
            name: "公钥",
            placeholder: "输入公钥",
        },
        privateKey: {
            name: "私钥",
            placeholder: "输入私钥",
        },
    },

    s3: {
        accessKeyId: {
            name: "访问密钥 ID",
            desc: "IAM 用户的访问密钥 ID，以 AKIA 开头，共 20 个字符。需要对存储桶有 PutObject 权限。",
            placeholder: "AKIA...",
        },
        secretAccessKey: {
            name: "私有访问密钥",
            desc: "与访问密钥 ID 配对的密钥，只在创建时显示。如果没有记下，请重新创建。",
            placeholder: "输入私有访问密钥",
        },
        region: {
            name: "区域",
            desc: "创建存储桶时选择的区域，例如 ap-east-1（香港）。与存储桶不一致时上传会失败，可在 AWS 控制台的存储桶列表中确认。",
            placeholder: "ap-east-1",
        },
        bucketName: {
            name: "存储桶名称",
            desc: "用于保存图片的 S3 存储桶名称。",
            placeholder: "输入存储桶名称",
        },
        endpoint: {
            name: "S3 兼容端点",
            desc: "使用 AWS S3 时留空。使用 MinIO、DigitalOcean Spaces、Wasabi、Ceph 等 S3 兼容服务时填入其 URL。填写后改用路径形式访问，存储桶名称成为 URL 的第一段路径；同时使用自定义域名时，应指向服务器而不是存储桶。此时区域只用于请求签名，留空则为 us-east-1。",
            placeholder: "https://minio.example.com",
        },
    },

    cos: {
        region: {
            name: "地域",
            desc: "存储桶所在的地域。与存储桶不一致时上传会失败。",
        },
        secretId: {
            name: "SecretId",
            desc: "在腾讯云访问管理（CAM）中创建的 SecretId。",
            placeholder: "输入 SecretId",
        },
        secretKey: {
            name: "SecretKey",
            desc: "与 SecretId 配对的密钥。",
            placeholder: "输入 SecretKey",
        },
    },

    qiniu: {
        accessKey: {
            name: "AccessKey",
            desc: "七牛云密钥管理中的 AccessKey。",
            placeholder: "输入 AccessKey",
        },
        secretKey: {
            name: "SecretKey",
            desc: "与 AccessKey 配对的密钥。",
            placeholder: "输入 SecretKey",
        },
    },

    github: {
        repositoryName: {
            name: "仓库",
            desc: "以 owner/repo 的形式指定存放图片的仓库，例如 octocat/my-images。公开仓库的链接可以直接从外部访问。",
            placeholder: "owner/repo",
        },
        branchName: {
            name: "分支",
            desc: "提交到的分支，默认为 main。指定不存在的分支会导致上传失败。",
            placeholder: "main",
        },
        token: {
            name: "个人访问令牌",
            placeholder: "输入 ghp_...",
        },
        tokenDescPrefix: "请生成带有 'repo' 权限范围的令牌，否则无法提交：",
    },

    r2: {
        accessKeyId: {
            name: "访问密钥 ID",
            desc: "在 Cloudflare 创建 R2 API 令牌时得到的访问密钥 ID。",
            placeholder: "输入访问密钥 ID",
        },
        secretAccessKey: {
            name: "机密访问密钥",
            desc: "与访问密钥 ID 配对的密钥，只在创建时显示一次。",
            placeholder: "输入机密访问密钥",
        },
        endpoint: {
            name: "端点",
            desc: "上传用的 S3 兼容端点。直接填入 R2 存储桶页面显示的 https://账户ID.r2.cloudflarestorage.com。",
            placeholder: "https://<account-id>.r2.cloudflarestorage.com",
        },
        bucketName: {
            name: "存储桶名称",
            desc: "用于保存图片的 R2 存储桶名称。",
            placeholder: "输入存储桶名称",
        },
        customDomain: {
            name: "R2.dev URL 或自定义域名",
            desc: "必填。写入笔记的链接所用的域名：填入在 R2 公开访问设置中启用的 https://pub-xxxx.r2.dev，或绑定到存储桶的自定义域名。R2 的端点无法从外部直接访问，留空时上传会报错。",
            placeholder: "pub-xxxx.r2.dev",
        },
    },

    b2: {
        accessKeyId: {
            name: "应用密钥 ID",
            desc: "在 Backblaze B2 中创建的应用密钥 ID（keyID）。",
            placeholder: "输入应用密钥 ID",
        },
        secretAccessKey: {
            name: "应用密钥",
            desc: "与 keyID 配对的密钥（applicationKey），只在创建时显示一次。",
            placeholder: "输入应用密钥",
        },
        region: {
            name: "区域",
            desc: "存储桶所在的区域，例如 us-west-004。即 B2 存储桶页面显示的端点中 s3. 与 .backblazeb2.com 之间的部分。",
            placeholder: "us-west-004",
        },
        bucketName: {
            name: "存储桶名称",
            desc: "用于保存图片的 B2 存储桶名称。私有存储桶的链接无法打开。",
            placeholder: "输入存储桶名称",
        },
        customDomain: {
            name: "自定义域名",
            desc: "写入笔记的链接所用的域名。前面接了 CDN 或自定义域名时填写。留空则使用 B2 默认的 URL。",
            placeholder: "输入自定义域名（可选）",
        },
    },

    modal: {
        title: "正在上传图片",
        titleComplete: "上传完成",
        titlePartial: "上传完成（部分失败）",
        titleFailed: "上传失败",
        uploading: "上传中...",
        complete: "完成",
        failed: "失败",
        completedWithErrors: (failed: number) => `已完成，但有错误（${failed} 张失败）`,
        succeeded: (count: number) => `成功 ${count} 张`,
        failedCount: (count: number) => `失败 ${count} 张`,
        modeWebp: (quality: number) => `WebP 转换已开启（质量 ${quality}）`,
        modeWebpKeepOriginal: (quality: number) => `WebP 转换已开启（质量 ${quality}，保留原图）`,
        modeWebpSkipped: "此笔记跳过 WebP 转换",
        modeHistory: "上传记录已开启",
        reused: "复用记录",
        reusedCount: (count: number) => `复用记录 ${count} 张`,
        sizeConverted: (from: string, to: string) => `${from} → ${to}`,
        compareConverted: (size: string) => `转换后 ${size}`,
        compareSaved: (size: string) => `节省 ${size}`,
        compareOriginal: (size: string, delta: string) => `原图 ${size}（${delta}）`,
    },

    notice: {
        uploaderSetupFailed: "上传器初始化失败，请检查设置。",
        publishFailed: (message: string) => `发布失败：${message}`,
        copiedToClipboard: "已复制到剪贴板",
        cannotLocate: (name: string, path: string) =>
            `在 ${path} 找不到 ${name}，请检查图片路径或插件设置中的附件选项。`,
        webImageUploadFailed: (path: string, message: string) =>
            `网络图片 ${path} 上传失败：${message}`,
        uploadFailed: (path: string, message: string) =>
            `${path} 上传失败，服务器返回错误：${message}`,
        originalUploadFailed: (path: string, message: string) =>
            `${path} 的 WebP 已上传，但原图存档失败：${message}`,
        readFileFailed: (path: string) => `无法读取文件：${path}`,
        filteredOut: (excluded: number, outOfScope: number) =>
            `根据上传文件夹设置，部分图片保留在本地（排除的文件夹：${excluded} 张，目标文件夹以外：${outOfScope} 张）。`,
        mermaidRendering: (count: number) => `正在渲染 ${count} 个 Mermaid 图表...`,
        mermaidInitFailed: (message: string) => `Mermaid 初始化失败：${message}`,
        mermaidBlockFailed: (index: number, message: string) =>
            `第 ${index} 个 Mermaid 代码块渲染失败：${message}`,
    },
};

export default zhCN;
