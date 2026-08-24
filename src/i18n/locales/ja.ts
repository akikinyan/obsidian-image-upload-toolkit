import type {Messages} from "./en";

/**
 * 日本語メッセージ。`Messages` で型を縛っているため、キーの欠落・綴り間違いは
 * コンパイルエラーになる。
 */
const ja: Messages = {
    command: {
        publishPage: "ページを公開",
    },

    general: {
        altText: {
            name: "画像名を代替テキストに使う",
            desc: "画像のファイル名を alt テキストとして使います。'-' と '_' は空白に置き換えられます。",
        },
        updateOriginalDoc: {
            name: "元のノートを書き換える",
            desc: "ノート内の内部リンクをアップロード先のリンクに置き換えるかどうか。",
        },
        ignoreProperties: {
            name: "ノートのプロパティを除外する",
            desc: "クリップボードにコピーする際にプロパティ（フロントマター）を除外します。元のノートには影響しません。",
        },
    },

    upload: {
        heading: "アップロード",
        progressModal: {
            name: "進行状況をダイアログで表示",
            desc: "アップロード中の詳細をダイアログで表示します（完了後 3 秒で自動的に閉じます）。無効にするとステータスバーに簡易表示します。",
        },
        webImages: {
            name: "Web 上の画像もアップロードする",
            desc: "有効にすると、http/https の URL で参照している画像をダウンロードし、設定したストレージへ再アップロードします。すでに自分のストレージ上にある画像はスキップされます。",
        },
    },

    mermaid: {
        heading: "Mermaid",
        convert: {
            name: "Mermaid 図を画像に変換する",
            desc: "Mermaid のコードブロックを PNG としてレンダリングし、公開時にアップロードします。",
        },
        scale: {
            name: "Mermaid 画像の倍率",
            desc: "書き出す画像の拡大率（1〜4 倍）。Retina ディスプレイでは 2 倍を推奨します。",
        },
        theme: {
            name: "Mermaid のテーマ",
            desc: "レンダリングする図の配色テーマ。",
            options: {
                default: "デフォルト",
                dark: "ダーク",
                forest: "フォレスト",
                neutral: "ニュートラル",
                base: "ベース",
            },
        },
    },

    network: {
        heading: "ネットワーク",
        mode: {
            name: "プロキシ",
            desc: "S3 互換ストレージ（Amazon S3 / Cloudflare R2 / Backblaze B2）への接続方法。これらのアップローダーはネットワークへ直接接続するため、Obsidian のシステムプロキシ設定に従いません。",
            options: {
                auto: "環境変数から自動検出",
                off: "プロキシを使わない",
                manual: "手動で指定",
            },
        },
        url: {
            name: "プロキシ URL",
            desc: "例: http://proxy.example.com:8080 。認証が必要な場合は http://user:pass@host:port の形式で指定できます。",
            placeholder: "http://host:port",
        },
        detected: (url: string) => `環境変数から検出: ${url}`,
        notDetected: "HTTPS_PROXY / HTTP_PROXY 環境変数が見つかりません。直接接続でアップロードします。",
        manualActive: (url: string) => `使用中: ${url}`,
        manualEmpty: "下の欄にプロキシ URL を入力してください。空のままだと直接接続になります。",
        disabled: "プロキシは無効です。直接接続でアップロードします。",
    },

    language: {
        name: "言語",
        desc: "このプラグインの表示言語。「自動」は Obsidian の言語設定に従います。",
        options: {
            auto: "自動",
            en: "English",
            ja: "日本語",
        },
    },

    imageStore: {
        heading: "画像ストア",
        select: {
            name: "画像ストア",
            desc: "画像のアップロード先。",
        },
    },

    common: {
        bucketName: {
            name: "バケット名",
            desc: "画像を保存するバケットの名前。",
            placeholder: "バケット名を入力",
        },
        targetPath: {
            name: "保存パス",
            desc: "画像を保存するパス。{year} {mon} {day} {random} {filename} が使えます。例えば /{year}/{mon}/{day}/{filename} を指定して pic.jpg をアップロードすると /2023/06/08/pic.jpg に保存されます。",
            placeholder: "パスを入力",
        },
        customDomain: {
            name: "独自ドメイン名",
            desc: "独自ドメインが example.com なら、https://example.com/pic.jpg で画像にアクセスできるようになります。",
            placeholder: "パスを入力",
        },
    },

    imgur: {
        clientId: {
            name: "クライアント ID",
            placeholder: "クライアント ID を入力",
        },
        descPrefix: "自分のクライアント ID はこちらで発行できます: ",
    },

    gyazo: {
        accessToken: {
            name: "アクセストークン",
            placeholder: "アクセストークンを入力",
        },
        tokenDescPrefix: "アプリケーションを作成してアクセストークンを発行してください: ",
        accessPolicy: {
            name: "公開範囲",
            desc: "画像の公開範囲。アップロードした URL を他の人や外部サイトから参照する必要がない場合のみ「自分のみ」を選んでください。",
            options: {
                anyone: "全員",
                onlyMe: "自分のみ",
            },
        },
        commonDescription: {
            name: "共通の説明文",
            desc: "すべてのアップロードに付ける固定の説明文。空欄にすると説明文を送りません。",
            placeholder: "共通の説明文を入力（省略可）",
        },
    },

    oss: {
        region: {
            name: "リージョン",
            desc: "OSS のデータセンターのリージョン。",
        },
        accessKeyId: {
            name: "アクセスキー ID",
            desc: "Aliyun RAM のアクセスキー ID。",
            placeholder: "アクセスキー ID を入力",
        },
        accessKeySecret: {
            name: "アクセスキーシークレット",
            desc: "Aliyun RAM のアクセスキーシークレット。",
            placeholder: "アクセスキーシークレットを入力",
        },
    },

    imagekit: {
        id: {
            name: "ImageKit ID",
            placeholder: "ImageKit ID を入力",
        },
        descPrefix: "ID とキーはこちらで取得できます: ",
        folder: {
            name: "フォルダ名",
            desc: "保存先のディレクトリ名。空欄にするとルートフォルダにアップロードします。",
            placeholder: "フォルダ名を入力",
        },
        publicKey: {
            name: "パブリックキー",
            placeholder: "パブリックキーを入力",
        },
        privateKey: {
            name: "プライベートキー",
            placeholder: "プライベートキーを入力",
        },
    },

    s3: {
        accessKeyId: {
            name: "AWS S3 アクセスキー ID",
            desc: "AWS S3 のアクセスキー ID。",
            placeholder: "アクセスキー ID を入力",
        },
        secretAccessKey: {
            name: "AWS S3 シークレットアクセスキー",
            desc: "AWS S3 のシークレットアクセスキー。",
            placeholder: "シークレットアクセスキーを入力",
        },
        region: {
            name: "AWS S3 リージョン",
            desc: "バケットのリージョン（例: ap-northeast-1）。",
            placeholder: "リージョンを入力",
        },
        bucketName: {
            name: "AWS S3 バケット名",
            desc: "AWS S3 のバケット名。",
            placeholder: "バケット名を入力",
        },
    },

    cos: {
        region: {
            name: "リージョン",
            desc: "COS のデータセンターのリージョン。",
        },
        secretId: {
            name: "シークレット ID",
            desc: "Tencent Cloud のシークレット ID。",
            placeholder: "シークレット ID を入力",
        },
        secretKey: {
            name: "シークレットキー",
            desc: "Tencent Cloud のシークレットキー。",
            placeholder: "シークレットキーを入力",
        },
    },

    qiniu: {
        accessKey: {
            name: "アクセスキー",
            desc: "Qiniu のアクセスキー。",
            placeholder: "アクセスキーを入力",
        },
        secretKey: {
            name: "シークレットキー",
            desc: "Qiniu のシークレットキー。",
            placeholder: "シークレットキーを入力",
        },
    },

    github: {
        repositoryName: {
            name: "リポジトリ名",
            desc: "画像を保存する GitHub リポジトリ（owner/repo の形式）。",
            placeholder: "リポジトリ名を入力（例: username/repo）",
        },
        branchName: {
            name: "ブランチ名",
            desc: "画像を保存するブランチ（既定は main）。",
            placeholder: "ブランチ名を入力",
        },
        token: {
            name: "パーソナルアクセストークン",
            placeholder: "GitHub のパーソナルアクセストークンを入力",
        },
        tokenDescPrefix: "repo スコープを付けたパーソナルアクセストークンをこちらで発行してください: ",
    },

    r2: {
        accessKeyId: {
            name: "Cloudflare R2 アクセスキー ID",
            desc: "Cloudflare R2 のアクセスキー ID。",
            placeholder: "アクセスキー ID を入力",
        },
        secretAccessKey: {
            name: "Cloudflare R2 シークレットアクセスキー",
            desc: "Cloudflare R2 のシークレットアクセスキー。",
            placeholder: "シークレットアクセスキーを入力",
        },
        endpoint: {
            name: "Cloudflare R2 エンドポイント",
            desc: "R2 のエンドポイント URL（例: https://account-id.r2.cloudflarestorage.com）。",
            placeholder: "R2 のエンドポイントを入力",
        },
        bucketName: {
            name: "Cloudflare R2 バケット名",
            desc: "Cloudflare R2 のバケット名。",
            placeholder: "バケット名を入力",
        },
        customDomain: {
            name: "R2.dev の URL または独自ドメイン",
            desc: "https://pub-xxxx.r2.dev のような R2.dev の URL、または独自ドメインを指定できます。独自ドメインが example.com なら https://example.com/pic.jpg で画像にアクセスできます。",
            placeholder: "ドメイン名を入力",
        },
    },

    b2: {
        accessKeyId: {
            name: "Backblaze B2 アクセスキー ID",
            desc: "Backblaze B2 のアプリケーションキー ID。",
            placeholder: "アプリケーションキー ID を入力",
        },
        secretAccessKey: {
            name: "Backblaze B2 シークレットアクセスキー",
            desc: "Backblaze B2 のアプリケーションキー。",
            placeholder: "アプリケーションキーを入力",
        },
        region: {
            name: "Backblaze B2 リージョン",
            desc: "Backblaze B2 のリージョン（例: us-west-004）。",
            placeholder: "リージョンを入力",
        },
        bucketName: {
            name: "Backblaze B2 バケット名",
            desc: "Backblaze B2 のバケット名。",
            placeholder: "バケット名を入力",
        },
        customDomain: {
            name: "独自ドメイン名",
            desc: "独自ドメインを設定している場合は https://example.com/pic.jpg で画像にアクセスできます。空欄にすると B2 の既定 URL を使います。",
            placeholder: "独自ドメインを入力（省略可）",
        },
    },

    modal: {
        title: "画像をアップロード中",
        uploading: "アップロード中...",
        complete: "完了",
        failed: "失敗",
        completedWithErrors: (failed: number) => `エラーあり（${failed} 件失敗）`,
        images: "画像",
        succeeded: (count: number) => `成功 ${count} 件`,
        failedCount: (count: number) => `失敗 ${count} 件`,
    },

    notice: {
        uploaderSetupFailed: "アップローダーの初期化に失敗しました。設定を確認してください。",
        publishFailed: (message: string) => `公開に失敗しました: ${message}`,
        copiedToClipboard: "クリップボードにコピーしました",
        cannotLocate: (name: string, path: string) =>
            `${name} が ${path} に見つかりません。画像のパス、またはプラグイン設定の添付ファイルの設定を確認してください。`,
        webImageUploadFailed: (path: string, message: string) =>
            `Web 画像 ${path} のアップロードに失敗しました: ${message}`,
        uploadFailed: (path: string, message: string) =>
            `${path} のアップロードに失敗しました。リモートサーバーがエラーを返しました: ${message}`,
        readFileFailed: (path: string) => `ファイルの読み込みに失敗しました: ${path}`,
        mermaidRendering: (count: number) => `Mermaid 図を ${count} 件レンダリング中...`,
        mermaidInitFailed: (message: string) => `Mermaid の初期化に失敗しました: ${message}`,
        mermaidBlockFailed: (index: number, message: string) =>
            `${index} 番目の Mermaid ブロックのレンダリングに失敗しました: ${message}`,
    },
};

export default ja;
