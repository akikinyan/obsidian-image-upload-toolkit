import type {Messages} from "./en";

/**
 * 日本語メッセージ。`Messages` で型を縛っているため、キーの欠落・綴り間違いは
 * コンパイルエラーになる。
 *
 * 説明文は英語版の直訳ではなく、「この項目を変えると何がどうなるか」を書く方針。
 * 設定画面を初めて見た人が、項目名だけでは判断できずに手が止まるのを避けるため。
 * 値の例と、オン／オフそれぞれの結果を具体的に示す。
 * なお Obsidian の説明欄はプレーンテキストなので、Markdown 記法は使わない。
 */
const ja: Messages = {
    command: {
        publishPage: "ページを公開",
    },

    general: {
        altText: {
            name: "画像名を代替テキストにする",
            desc: "オン: リンクの角括弧の中に画像のファイル名が入ります（「-」と「_」は空白に変換）。オフ: 角括弧の中は空になります。表示は変わらず、画像が読み込めなかったときに出る文字が変わります。",
        },
        updateOriginalDoc: {
            name: "元のノートを書き換える",
            desc: "オン: 元のノート内の画像リンクを、アップロード後の URL に置き換えます。オフ: 元のノートには手を触れず、置き換え後の本文をクリップボードにコピーするだけです。",
        },
        ignoreProperties: {
            name: "プロパティを除いてコピーする",
            desc: "オン: クリップボードにコピーする本文から、ノート先頭のプロパティ（フロントマター）を取り除きます。オフ: プロパティも含めてコピーします。どちらでも元のノートからプロパティは消えません。",
        },
    },

    upload: {
        heading: "アップロード",
        progressModal: {
            name: "進行状況をダイアログで表示",
            desc: "オン: 画像ごとの成否が分かるダイアログを出します（全部成功すると 3 秒後に自動で閉じます）。オフ: 画面右下のステータスバーに 1 行だけ表示します。",
        },
        webImages: {
            name: "外部サイトの画像も取り込む",
            desc: "オン: ノート内で http / https の URL を参照している画像もダウンロードし、自分のストレージへアップロードし直してリンクを差し替えます。参照先が消えても画像が残ります。オフ: 外部の URL はそのまま残します。すでに自分のストレージ上にある画像は、どちらでも対象外です。",
        },
    },

    webp: {
        heading: "WebP 変換",
        enabled: {
            name: "画像を WebP に変換する",
            desc: "オン: アップロードの前にローカル画像を WebP に変換し、ノートには WebP のリンクを書きます。対象はローカル画像だけで、外部サイトの画像と Mermaid 図は変換しません。オフ: 元の形式のままアップロードします。",
        },
        extensions: {
            name: "変換する拡張子",
            desc: "カンマ区切りで、ドットは不要です。GIF と SVG を既定から外しているのは、変換が canvas 経由のためです。アニメーション GIF は1コマ目だけになり、SVG はラスタライズされて拡大に耐えなくなります。",
            placeholder: "png, jpg, jpeg",
        },
        quality: {
            name: "品質",
            desc: "WebP の圧縮品質。下げるほど小さく、劣化も大きくなります。写真は 75 前後、文字を含む図は 90 前後が目安です。変換後のほうが大きくなった画像は、自動的に元のファイルでアップロードします。",
        },
        keepOriginal: {
            name: "オリジナルも保存する",
            desc: "オン: 無変換の元ファイルも保管用にアップロードします。ノートに書かれるのは WebP のリンクのままです。オフ: WebP だけをアップロードし、元ファイルはストレージに残りません。",
        },
        originalPath: {
            name: "オリジナルの保存先パス",
            desc: "保管用の元ファイルを置く場所。「保存先のパス」と同じ変数が使えます。同じパスにすると WebP と元ファイルが混在するため、別の場所にしてください。",
            placeholder: "/originals/{year}/{mon}/{day}/{filename}",
        },
        originalPathUnsupported: "このアップロード先はパスを指定できないため、元ファイルは WebP と同じ場所に置かれます。拡張子が違うので上書きは起きません。",
        frontmatterProperty: {
            name: "ノート単位で切り替えるプロパティ",
            desc: "ノートのプロパティ名。そのノートで true にすると変換し、false にすると変換しません。空欄にするとノート単位の切り替えを無効にします。",
            placeholder: "webp",
        },
        frontmatterDefault: {
            name: "プロパティが無いときの既定",
            desc: "プロパティを書いていないノートに適用されます。オフにすると、プロパティで明示したノートだけを変換する運用になります。",
        },
    },

    cache: {
        heading: "アップロード履歴",
        enabled: {
            name: "変更のない画像を再アップロードしない",
            desc: "オン: アップロード済みのファイル内容を記録し、次回以降は同じ URL を使い回します。画像を編集すれば再アップロードされ、バケットやドメインを変えたときも記録は使われません。オフ: 実行のたびに毎回アップロードします。",
        },
        clear: {
            name: "アップロード履歴を消去",
            desc: "記録をすべて破棄し、次回の実行で全画像をアップロードし直します。アップロード済みのファイル自体は削除されません。ノートのリンク先が開けなくなったときに使ってください。",
            button: "消去",
        },
        entries: (count: number) => `記録件数 ${count} 件`,
        cleared: (count: number) => `アップロード履歴を ${count} 件消去しました`,
    },

    mermaid: {
        heading: "Mermaid",
        convert: {
            name: "Mermaid 図を画像に変換する",
            desc: "オン: 公開時に mermaid のコードブロックを PNG に変換してアップロードし、画像リンクに置き換えます。Mermaid に対応していない場所へ貼るときに使います。オフ: コードブロックのまま残します。",
        },
        scale: {
            name: "Mermaid 画像の倍率",
            desc: "書き出す PNG の細かさ。2 なら図の表示サイズの 2 倍の画素数で書き出します。数値を上げると鮮明になり、ファイルサイズも増えます。高解像度ディスプレイなら 2 が目安です。",
        },
        theme: {
            name: "Mermaid のテーマ",
            desc: "書き出す図の配色。Obsidian の外観テーマとは連動しないため、ここで指定した配色で固定されます。",
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
            desc: "Amazon S3 / Cloudflare R2 / Backblaze B2 に接続するときプロキシを経由するかどうか。この 3 つだけは Obsidian を通さず AWS SDK が直接通信するため、Windows や macOS のプロキシ設定が効きません。社内プロキシ配下では、ここを設定しないとアップロードがタイムアウトします。他のアップロード先には影響しません。",
            options: {
                auto: "環境変数から自動で使う",
                off: "プロキシを使わない",
                manual: "URL を手入力する",
            },
        },
        url: {
            name: "プロキシ URL",
            desc: "例: http://proxy.example.com:8080 。認証が必要なプロキシなら http://ユーザー名:パスワード@proxy.example.com:8080 の形で書きます。",
            placeholder: "http://host:port",
        },
        detected: (url: string) => `環境変数から検出しました。このプロキシを経由します: ${url}`,
        notDetected: "環境変数 HTTPS_PROXY / HTTP_PROXY が見つかりません。プロキシを経由せず直接接続します。プロキシ配下ならここで失敗するので、「URL を手入力する」に切り替えてください。",
        manualActive: (url: string) => `このプロキシを経由します: ${url}`,
        manualEmpty: "下の欄が空です。このままだとプロキシを経由せず直接接続します。",
        disabled: "プロキシを経由せず直接接続します。環境変数が設定されていても無視します。",
    },

    language: {
        name: "言語",
        desc: "この設定画面と通知メッセージの表示言語。「自動」は Obsidian 本体の言語設定に従います。切り替えると即座に反映されます。",
        options: {
            auto: "自動",
            en: "English",
            ja: "日本語",
        },
    },

    imageStore: {
        heading: "アップロード先",
        select: {
            name: "アップロード先のサービス",
            desc: "画像をどこにアップロードするか。ここを変えると、下に並ぶ入力項目がそのサービス用のものに切り替わります。サービスごとの設定は個別に保存されるので、切り替えても前の入力は消えません。",
        },
    },

    common: {
        bucketName: {
            name: "バケット名",
            desc: "画像を保存するバケットの名前。あらかじめ作成しておく必要があります。",
            placeholder: "バケット名を入力",
        },
        targetPath: {
            name: "保存先のパス",
            desc: "バケット内のどこに置くか。{year} {mon} {day} {random} {filename} が使えます。例えば /{year}/{mon}/{day}/{filename} なら、pic.jpg は /2026/08/24/pic.jpg として保存されます。空欄にするとファイル名だけになり、同名ファイルが上書きされる恐れがあります。",
            placeholder: "/{year}/{mon}/{day}/{filename}",
        },
        customDomain: {
            name: "公開に使うドメイン",
            desc: "ノートに書き込むリンクのドメイン部分。CloudFront などを手前に置いている場合に指定します。cdn.example.com と入れると、リンクは https://cdn.example.com/保存先のパス になります。空欄ならストレージ本来の URL をそのまま使います。アップロード先は変わりません。",
            placeholder: "cdn.example.com",
        },
    },

    imgur: {
        clientId: {
            name: "クライアント ID",
            placeholder: "クライアント ID を入力",
        },
        descPrefix: "初期値はプラグイン共用の ID です。アップロードが多いと回数制限に当たるので、自分の ID を発行して差し替えてください: ",
    },

    gyazo: {
        accessToken: {
            name: "アクセストークン",
            placeholder: "アクセストークンを入力",
        },
        tokenDescPrefix: "Gyazo でアプリケーションを作り、アクセストークンを発行してください: ",
        accessPolicy: {
            name: "公開範囲",
            desc: "アップロードした画像を誰が見られるか。「自分のみ」にすると、ノートに貼った URL を他の人や外部サイトから開けなくなります。共有するノートに貼るなら「全員」を選んでください。",
            options: {
                anyone: "全員",
                onlyMe: "自分のみ",
            },
        },
        commonDescription: {
            name: "共通の説明文",
            desc: "アップロードするすべての画像に同じ説明文を付けます。Gyazo の一覧で後から探しやすくなります。空欄なら説明文を付けません。",
            placeholder: "共通の説明文を入力（省略可）",
        },
    },

    oss: {
        region: {
            name: "リージョン",
            desc: "バケットを作成したデータセンターの場所。バケットと一致していないとアップロードに失敗します。選ぶとエンドポイントも自動で切り替わります。",
        },
        accessKeyId: {
            name: "アクセスキー ID",
            desc: "Aliyun RAM で発行したアクセスキー ID。",
            placeholder: "アクセスキー ID を入力",
        },
        accessKeySecret: {
            name: "アクセスキーシークレット",
            desc: "アクセスキー ID とペアで発行される秘密の文字列。発行時にしか表示されません。",
            placeholder: "アクセスキーシークレットを入力",
        },
    },

    imagekit: {
        id: {
            name: "ImageKit ID",
            placeholder: "ImageKit ID を入力",
        },
        descPrefix: "ID と各キーはダッシュボードで確認できます: ",
        folder: {
            name: "保存先フォルダ",
            desc: "ImageKit 内のどのフォルダに置くか。空欄にするとルートに置かれます。",
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
            name: "アクセスキー ID",
            desc: "IAM ユーザーのアクセスキー ID。AKIA で始まる 20 文字です。バケットへの PutObject 権限が必要です。",
            placeholder: "AKIA...",
        },
        secretAccessKey: {
            name: "シークレットアクセスキー",
            desc: "アクセスキー ID とペアで発行される秘密の文字列。作成時にしか表示されないので、控えていない場合は作り直してください。",
            placeholder: "シークレットアクセスキーを入力",
        },
        region: {
            name: "リージョン",
            desc: "バケットを作成したリージョン。例: ap-northeast-1（東京）。バケットと一致していないとアップロードに失敗します。AWS コンソールのバケット一覧で確認できます。",
            placeholder: "ap-northeast-1",
        },
        bucketName: {
            name: "バケット名",
            desc: "画像を保存する S3 バケットの名前。",
            placeholder: "バケット名を入力",
        },
    },

    cos: {
        region: {
            name: "リージョン",
            desc: "バケットを作成したデータセンターの場所。バケットと一致していないとアップロードに失敗します。",
        },
        secretId: {
            name: "シークレット ID",
            desc: "Tencent Cloud のアクセス管理で発行した SecretId。",
            placeholder: "シークレット ID を入力",
        },
        secretKey: {
            name: "シークレットキー",
            desc: "SecretId とペアで発行される秘密の文字列。",
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
            desc: "アクセスキーとペアで発行される秘密の文字列。",
            placeholder: "シークレットキーを入力",
        },
    },

    github: {
        repositoryName: {
            name: "リポジトリ",
            desc: "画像を置くリポジトリを owner/repo の形で指定します。例: akikinyan/my-images。公開リポジトリなら、リンクをそのまま外部から参照できます。",
            placeholder: "owner/repo",
        },
        branchName: {
            name: "ブランチ",
            desc: "コミット先のブランチ。既定は main です。存在しないブランチを指定するとアップロードに失敗します。",
            placeholder: "main",
        },
        token: {
            name: "パーソナルアクセストークン",
            placeholder: "ghp_... を入力",
        },
        tokenDescPrefix: "repo スコープを付けたトークンを発行してください。これがないとコミットできません: ",
    },

    r2: {
        accessKeyId: {
            name: "アクセスキー ID",
            desc: "Cloudflare の R2 API トークンとして発行したアクセスキー ID。",
            placeholder: "アクセスキー ID を入力",
        },
        secretAccessKey: {
            name: "シークレットアクセスキー",
            desc: "アクセスキー ID とペアで発行される秘密の文字列。発行時にしか表示されません。",
            placeholder: "シークレットアクセスキーを入力",
        },
        endpoint: {
            name: "エンドポイント",
            desc: "アップロード先の S3 互換エンドポイント。R2 のバケット画面に表示される https://アカウントID.r2.cloudflarestorage.com をそのまま入れます。",
            placeholder: "https://<account-id>.r2.cloudflarestorage.com",
        },
        bucketName: {
            name: "バケット名",
            desc: "画像を保存する R2 バケットの名前。",
            placeholder: "バケット名を入力",
        },
        customDomain: {
            name: "公開に使うドメイン",
            desc: "ノートに書き込むリンクのドメイン部分。R2 の公開設定で有効にした https://pub-xxxx.r2.dev か、割り当てた独自ドメインを入れます。R2 のエンドポイントは外部から直接参照できないため、ここは実質必須です。",
            placeholder: "pub-xxxx.r2.dev",
        },
    },

    b2: {
        accessKeyId: {
            name: "アプリケーションキー ID",
            desc: "Backblaze B2 で発行したアプリケーションキーの ID（keyID）。",
            placeholder: "アプリケーションキー ID を入力",
        },
        secretAccessKey: {
            name: "アプリケーションキー",
            desc: "keyID とペアで発行される秘密の文字列。発行時にしか表示されません。",
            placeholder: "アプリケーションキーを入力",
        },
        region: {
            name: "リージョン",
            desc: "バケットのリージョン。例: us-west-004。B2 のバケット画面に表示されるエンドポイントの s3. と .backblazeb2.com の間の部分です。",
            placeholder: "us-west-004",
        },
        bucketName: {
            name: "バケット名",
            desc: "画像を保存する B2 バケットの名前。非公開バケットだとリンクを開けません。",
            placeholder: "バケット名を入力",
        },
        customDomain: {
            name: "公開に使うドメイン",
            desc: "ノートに書き込むリンクのドメイン部分。CDN や独自ドメインを手前に置いている場合に指定します。空欄なら B2 本来の URL を使います。",
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
        modeWebp: (quality: number) => `WebP 変換 有効（品質 ${quality}）`,
        modeWebpKeepOriginal: (quality: number) => `WebP 変換 有効（品質 ${quality}、オリジナルも保存）`,
        modeWebpSkipped: "WebP 変換 このノートは対象外",
        modeHistory: "アップロード履歴 有効",
        reused: "履歴から再利用",
        reusedCount: (count: number) => `履歴から ${count} 件`,
        sizeConverted: (from: string, to: string, delta: string) => `${from} → ${to}（${delta}）`,
        totalSize: (from: string, to: string, delta: string) => `変換分の合計 ${from} → ${to}（${delta}）`,
    },

    notice: {
        uploaderSetupFailed: "アップローダーの初期化に失敗しました。設定を確認してください。",
        publishFailed: (message: string) => `公開に失敗しました: ${message}`,
        copiedToClipboard: "クリップボードにコピーしました",
        cannotLocate: (name: string, path: string) =>
            `${name} が ${path} に見つかりません。画像のパス、またはプラグイン設定の添付ファイルの設定を確認してください。`,
        webImageUploadFailed: (path: string, message: string) =>
            `外部画像 ${path} のアップロードに失敗しました: ${message}`,
        uploadFailed: (path: string, message: string) =>
            `${path} のアップロードに失敗しました。サーバーからの応答: ${message}`,
        originalUploadFailed: (path: string, message: string) =>
            `${path} の WebP はアップロードできましたが、元ファイルの保管に失敗しました: ${message}`,
        readFileFailed: (path: string) => `ファイルを読み込めませんでした: ${path}`,
        mermaidRendering: (count: number) => `Mermaid 図を ${count} 件変換しています...`,
        mermaidInitFailed: (message: string) => `Mermaid の初期化に失敗しました: ${message}`,
        mermaidBlockFailed: (index: number, message: string) =>
            `${index} 番目の Mermaid ブロックを変換できませんでした: ${message}`,
    },
};

export default ja;
