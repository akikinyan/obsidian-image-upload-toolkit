import type {Messages} from "./en";

/** Traditional Chinese (Taiwan) messages. Typed as Messages, so a missing key is a compile error. */
const zhTW: Messages = {
    command: {
        publishPage: "發布頁面",
    },

    general: {
        altText: {
            name: "以圖片名稱作為替代文字",
            desc: "開啟：連結的方括號內會填入圖片檔名（「-」和「_」會換成空格）。關閉：方括號內留空。顯示效果不變，只影響圖片無法載入時顯示的文字。",
        },
        updateOriginalDoc: {
            name: "改寫原始筆記",
            desc: "開啟：將原始筆記中的圖片連結替換為上傳後的 URL。關閉：不更動原始筆記，只把替換後的內文複製到剪貼簿。",
        },
        ignoreProperties: {
            name: "複製時移除筆記屬性",
            desc: "開啟：複製到剪貼簿的內文不包含筆記開頭的屬性（Front Matter）。關閉：連同屬性一起複製。無論哪一種，原始筆記中的屬性都不會被刪除。",
        },
    },

    upload: {
        heading: "上傳",
        progressModal: {
            name: "以對話方塊顯示上傳進度",
            desc: "開啟：跳出對話方塊，逐張顯示成功或失敗（全部成功時 3 秒後自動關閉）。關閉：只在右下角狀態列顯示一行進度。",
        },
        webImages: {
            name: "一併上傳網路圖片",
            desc: "開啟：筆記中引用 http / https URL 的圖片也會先下載，再重新上傳到你的儲存空間並替換連結，即使原網址失效，圖片也能保留。關閉：外部 URL 維持原樣。已經位於你自己儲存空間上的圖片，無論開關都會略過。",
        },
    },

    webp: {
        heading: "WebP 轉換",
        enabled: {
            name: "將圖片轉換為 WebP",
            desc: "開啟：上傳前將本機圖片轉換為 WebP，筆記中寫入 WebP 的連結。只處理本機圖片，網路圖片和 Mermaid 圖表不會轉換。關閉：以原格式上傳。",
        },
        extensions: {
            name: "要轉換的副檔名",
            desc: "以逗號分隔，不需加點。預設不包含 GIF 和 SVG，因為轉換是透過 canvas 進行：動畫只會保留第一格，SVG 會被點陣化，放大後不再清晰。",
            placeholder: "png, jpg, jpeg",
        },
        quality: {
            name: "品質",
            desc: "WebP 的壓縮品質。數值越低檔案越小，畫質損失也越大。照片約 75、含文字的圖約 90 較為合適。若轉換後反而比原圖大，會自動改為上傳原始檔案。",
        },
        keepOriginal: {
            name: "一併上傳原始圖片",
            desc: "開啟：將未經轉換的原始檔案也上傳一份作為封存，筆記中仍然連結 WebP。關閉：只上傳 WebP，儲存空間中不保留原始檔案。",
        },
        originalPath: {
            name: "原始圖片的儲存路徑",
            desc: "封存原始檔案的存放位置，可使用與「儲存路徑」相同的變數。請與儲存路徑區分開來，否則 WebP 和原始檔案會混在一起。",
            placeholder: "/originals/{year}/{mon}/{day}/{filename}",
        },
        originalPathUnsupported: "這個上傳目標不支援指定路徑，原始檔案會與 WebP 放在同一個位置。兩者副檔名不同，不會互相覆寫。",
        frontmatterProperty: {
            name: "依筆記切換的屬性",
            desc: "筆記屬性的名稱。在某篇筆記中設為 true 就轉換，設為 false 就不轉換。留空則停用依筆記切換。",
            placeholder: "webp",
        },
        frontmatterDefault: {
            name: "未設定屬性時的預設值",
            desc: "套用於沒有寫這個屬性的筆記。關閉後，只有透過屬性明確開啟的筆記才會轉換。",
        },
    },

    cache: {
        heading: "上傳紀錄",
        enabled: {
            name: "不重複上傳未變更的圖片",
            desc: "開啟：記錄已上傳的檔案內容，之後直接沿用同一個 URL。編輯過的圖片會重新上傳，更換儲存貯體或網域後也不再使用紀錄。關閉：每次發布都重新上傳。",
        },
        clear: {
            name: "清除上傳紀錄",
            desc: "捨棄所有紀錄，下次發布時重新上傳全部圖片。已上傳的檔案本身不會被刪除。筆記中的連結打不開時可以使用。",
            button: "清除",
        },
        entries: (count: number) => `已記錄 ${count} 筆`,
        cleared: (count: number) => `已清除 ${count} 筆上傳紀錄`,
    },

    mermaid: {
        heading: "Mermaid",
        convert: {
            name: "將 Mermaid 圖表轉換為圖片",
            desc: "開啟：發布時將 mermaid 程式碼區塊繪製成 PNG 並上傳，替換為圖片連結。適合貼到不支援 Mermaid 的地方。關閉：保留程式碼區塊。",
        },
        scale: {
            name: "Mermaid 圖片倍率",
            desc: "輸出 PNG 的精細程度。設為 2 時，會以圖表顯示尺寸的 2 倍像素輸出。數值越大越清晰，檔案也越大。高解析度螢幕建議設為 2。",
        },
        theme: {
            name: "Mermaid 主題",
            desc: "輸出圖表的配色。不會隨 Obsidian 的外觀主題變化，固定使用這裡指定的配色。",
            options: {
                default: "預設",
                dark: "深色",
                forest: "森林",
                neutral: "中性",
                base: "基礎",
            },
        },
    },

    network: {
        heading: "網路",
        mode: {
            name: "代理伺服器",
            desc: "連線到 Amazon S3 / Cloudflare R2 / Backblaze B2 時是否經過代理伺服器。這三者不經過 Obsidian，而是由 AWS SDK 直接連線，因此 Windows 或 macOS 的系統代理伺服器設定對它們無效。在公司代理伺服器環境下，若不在這裡設定，上傳會逾時。不影響其他上傳目標。",
            options: {
                auto: "從環境變數自動取得",
                off: "不使用代理伺服器",
                manual: "手動輸入 URL",
            },
        },
        url: {
            name: "代理伺服器 URL",
            desc: "例如 http://proxy.example.com:8080。需要驗證的代理伺服器可寫成 http://使用者名稱:密碼@proxy.example.com:8080。",
            placeholder: "http://host:port",
        },
        detected: (url: string) => `已從環境變數偵測到代理伺服器，將經由：${url}`,
        notDetected: "找不到環境變數 HTTPS_PROXY / HTTP_PROXY，將不經代理伺服器直接連線。如果位於代理伺服器環境下會因此失敗，請切換為「手動輸入 URL」。",
        manualActive: (url: string) => `將經由此代理伺服器：${url}`,
        manualEmpty: "下方欄位是空的，這樣會不經代理伺服器直接連線。",
        disabled: "不經代理伺服器直接連線，即使設定了環境變數也會忽略。",
    },

    language: {
        name: "語言",
        desc: "此設定頁面與通知訊息的顯示語言。「自動」會跟隨 Obsidian 的語言設定。切換後立即生效。",
        options: {
            auto: "自動",
        },
    },

    imageStore: {
        heading: "上傳目標",
        select: {
            name: "上傳服務",
            desc: "圖片要上傳到哪裡。變更後，下方的輸入欄位會切換為該服務對應的項目。各服務的設定分別儲存，切換後先前填寫的內容不會遺失。",
        },
    },

    filter: {
        heading: "要上傳的資料夾",
        scope: {
            name: "上傳範圍",
            desc: "這個上傳目標要上傳哪些本機圖片。資料夾設定依上傳目標分別儲存。",
            options: {
                all: "所有資料夾",
                selected: "僅限所選資料夾",
            },
        },
        hint: "包含子資料夾。未納入範圍的圖片，其連結維持原樣。",
        include: {
            name: "目標資料夾",
            add: "新增資料夾",
            empty: "請新增目標資料夾。新增之前，不會有任何本機圖片上傳到這個上傳目標。",
        },
        exclude: {
            name: "排除的資料夾",
            desc: "這些資料夾中的圖片一律不上傳，即使位於目標資料夾內。",
            add: "新增排除的資料夾",
            empty: "沒有排除的資料夾。",
        },
        remove: "移除",
        missing: "找不到這個資料夾。可能已被刪除，或在外掛停用期間被移動。此條件會保留，直到你將它移除。",
        pickFolder: "選擇資料夾",
        test: {
            name: "測試條件",
            desc: "查看依照上述條件哪些圖片會被上傳，不會實際上傳。",
            button: "測試",
        },
    },

    filterTest: {
        title: "上傳條件測試",
        disclaimer: "這裡只檢查上傳範圍，不檢查連線和憑證。",
        store: (name: string) => `上傳目標：${name}`,
        scopeNote: "筆記中的圖片",
        scopeVault: "整個儲存庫的圖片",
        note: (path: string) => `筆記：${path}`,
        noNote: "尚未選擇筆記。",
        changeNote: "選擇筆記",
        pickNote: "選擇筆記",
        search: "依路徑搜尋",
        allVerdicts: "所有結果",
        verdict: {
            included: "上傳",
            excluded: "符合排除的資料夾",
            outOfScope: "不在目標資料夾中",
            notFound: "找不到圖片",
        },
        column: {
            path: "圖片",
            verdict: "結果",
            reason: "原因",
            refs: "連結數",
        },
        reason: {
            allFolders: "所有資料夾都在範圍內。",
            inTarget: (folders: string) => `位於目標資料夾 ${folders} 中。`,
            noTarget: "尚未選擇目標資料夾。",
            notInTarget: "不在任何目標資料夾底下。",
            excluded: (folders: string) => `位於排除的資料夾 ${folders} 中。`,
            excludedOverTarget: (excluded: string, target: string) =>
                `同時位於排除的資料夾 ${excluded} 和目標資料夾 ${target} 中，以排除為優先。`,
            notFound: (link: string) => `儲存庫中沒有與連結 ${link} 相符的檔案。`,
        },
        count: (label: string, n: number) => `${label}：${n} 張`,
        page: (current: number, total: number, shown: number) => `第 ${current} / ${total} 頁（${shown} 張）`,
        prev: "上一頁",
        next: "下一頁",
        empty: "沒有可顯示的圖片。",
        otherHeading: "不受資料夾條件影響",
        webOn: (n: number, hosted: number) =>
            `網路圖片：${n} 張。發布時下載並上傳` + (hosted > 0 ? `（已在此上傳目標上的 ${hosted} 張除外）。` : "。"),
        webOff: (n: number) => `網路圖片：${n} 張。維持原樣（「一併上傳網路圖片」已關閉）。`,
        mermaidOn: (n: number) => `Mermaid 圖表：${n} 個。發布時繪製成圖片並上傳。`,
        mermaidOff: (n: number) => `Mermaid 圖表：${n} 個。保留為程式碼（「將 Mermaid 圖表轉換為圖片」已關閉）。`,
        readFailed: (message: string) => `無法讀取筆記：${message}`,
    },

    common: {
        bucketName: {
            name: "儲存貯體名稱",
            desc: "用來儲存圖片的儲存貯體（Bucket）名稱，需要事先建立。",
            placeholder: "輸入儲存貯體名稱",
        },
        targetPath: {
            name: "儲存路徑",
            desc: "圖片要放在儲存貯體中的哪個位置。可使用 {year} {mon} {day} {random} {filename} {foldername} {notename}。例如 /{year}/{mon}/{day}/{filename} 會將 pic.jpg 儲存為 /2026/08/24/pic.jpg。{foldername} 是筆記所在資料夾的名稱，{notename} 是筆記本身的名稱，因此寫成 img/{notename}/{filename} 就能依筆記整理圖片。儲存庫根目錄下的筆記，{foldername} 為空，該段會被省略。留空則只使用檔名，同名檔案可能會被覆寫。",
            placeholder: "/{year}/{mon}/{day}/{filename}",
        },
        customDomain: {
            name: "自訂網域",
            desc: "寫入筆記的連結所使用的網域。前面接了 CDN 時填寫。填入 cdn.example.com 後，連結會變成 https://cdn.example.com/儲存路徑。留空則直接使用儲存服務本身的 URL。上傳位置不變。",
            placeholder: "cdn.example.com",
        },
    },

    imgur: {
        clientId: {
            name: "Client ID",
            placeholder: "輸入 Client ID",
        },
        descPrefix: "預設值是外掛共用的 ID，上傳較多時會碰到次數限制，建議產生自己的 Client ID 替換：",
    },

    gyazo: {
        accessToken: {
            name: "存取權杖",
            placeholder: "輸入存取權杖",
        },
        tokenDescPrefix: "請在 Gyazo 建立應用程式並產生存取權杖：",
        accessPolicy: {
            name: "公開範圍",
            desc: "誰可以檢視上傳的圖片。選擇「僅限自己」後，其他人和外部網站將無法開啟筆記中的 URL。用於分享的筆記請選擇「所有人」。",
            options: {
                anyone: "所有人",
                onlyMe: "僅限自己",
            },
        },
        commonDescription: {
            name: "統一說明",
            desc: "為每張上傳的圖片附加相同的說明，方便日後在 Gyazo 清單中尋找。留空則不附加說明。",
            placeholder: "輸入統一說明（選填）",
        },
    },

    oss: {
        region: {
            name: "區域",
            desc: "儲存貯體所在的區域。與儲存貯體不一致時上傳會失敗。選擇後端點也會自動切換。",
        },
        accessKeyId: {
            name: "AccessKey ID",
            desc: "在阿里雲 RAM 中建立的 AccessKey ID。",
            placeholder: "輸入 AccessKey ID",
        },
        accessKeySecret: {
            name: "AccessKey Secret",
            desc: "與 AccessKey ID 配對的金鑰，只在建立時顯示一次。",
            placeholder: "輸入 AccessKey Secret",
        },
    },

    imagekit: {
        id: {
            name: "ImageKit ID",
            placeholder: "輸入 ImageKit ID",
        },
        descPrefix: "ID 和各金鑰可在主控台中查看：",
        folder: {
            name: "儲存資料夾",
            desc: "要放在 ImageKit 中的哪個資料夾。留空則放在根目錄。",
            placeholder: "輸入資料夾名稱",
        },
        publicKey: {
            name: "公開金鑰",
            placeholder: "輸入公開金鑰",
        },
        privateKey: {
            name: "私密金鑰",
            placeholder: "輸入私密金鑰",
        },
    },

    s3: {
        accessKeyId: {
            name: "存取金鑰 ID",
            desc: "IAM 使用者的存取金鑰 ID，以 AKIA 開頭，共 20 個字元。需要對儲存貯體具備 PutObject 權限。",
            placeholder: "AKIA...",
        },
        secretAccessKey: {
            name: "私密存取金鑰",
            desc: "與存取金鑰 ID 配對的金鑰，只在建立時顯示。如果沒有記下來，請重新建立。",
            placeholder: "輸入私密存取金鑰",
        },
        region: {
            name: "區域",
            desc: "建立儲存貯體時選擇的區域，例如 ap-east-2（台北）。與儲存貯體不一致時上傳會失敗，可在 AWS 主控台的儲存貯體清單中確認。",
            placeholder: "ap-east-2",
        },
        bucketName: {
            name: "儲存貯體名稱",
            desc: "用來儲存圖片的 S3 儲存貯體名稱。",
            placeholder: "輸入儲存貯體名稱",
        },
        endpoint: {
            name: "S3 相容端點",
            desc: "使用 AWS S3 時請留空。使用 MinIO、DigitalOcean Spaces、Wasabi、Ceph 等 S3 相容服務時，填入其 URL。填寫後會改用路徑形式存取，儲存貯體名稱成為 URL 的第一段路徑；若同時使用自訂網域，應指向伺服器而不是儲存貯體。此時區域只用於請求簽章，留空則為 us-east-1。",
            placeholder: "https://minio.example.com",
        },
    },

    cos: {
        region: {
            name: "區域",
            desc: "儲存貯體所在的區域。與儲存貯體不一致時上傳會失敗。",
        },
        secretId: {
            name: "SecretId",
            desc: "在騰訊雲存取管理（CAM）中建立的 SecretId。",
            placeholder: "輸入 SecretId",
        },
        secretKey: {
            name: "SecretKey",
            desc: "與 SecretId 配對的金鑰。",
            placeholder: "輸入 SecretKey",
        },
    },

    qiniu: {
        accessKey: {
            name: "AccessKey",
            desc: "七牛雲金鑰管理中的 AccessKey。",
            placeholder: "輸入 AccessKey",
        },
        secretKey: {
            name: "SecretKey",
            desc: "與 AccessKey 配對的金鑰。",
            placeholder: "輸入 SecretKey",
        },
    },

    github: {
        repositoryName: {
            name: "儲存庫",
            desc: "以 owner/repo 的形式指定存放圖片的儲存庫，例如 octocat/my-images。公開儲存庫的連結可以直接從外部存取。",
            placeholder: "owner/repo",
        },
        branchName: {
            name: "分支",
            desc: "要提交到的分支，預設為 main。指定不存在的分支會導致上傳失敗。",
            placeholder: "main",
        },
        token: {
            name: "個人存取權杖",
            placeholder: "輸入 ghp_...",
        },
        tokenDescPrefix: "請產生具有 'repo' 權限範圍的權杖，否則無法提交：",
    },

    r2: {
        accessKeyId: {
            name: "存取金鑰 ID",
            desc: "在 Cloudflare 建立 R2 API 權杖時取得的存取金鑰 ID。",
            placeholder: "輸入存取金鑰 ID",
        },
        secretAccessKey: {
            name: "秘密存取金鑰",
            desc: "與存取金鑰 ID 配對的金鑰，只在建立時顯示一次。",
            placeholder: "輸入秘密存取金鑰",
        },
        endpoint: {
            name: "端點",
            desc: "上傳用的 S3 相容端點。直接填入 R2 儲存貯體頁面顯示的 https://帳戶ID.r2.cloudflarestorage.com。",
            placeholder: "https://<account-id>.r2.cloudflarestorage.com",
        },
        bucketName: {
            name: "儲存貯體名稱",
            desc: "用來儲存圖片的 R2 儲存貯體名稱。",
            placeholder: "輸入儲存貯體名稱",
        },
        customDomain: {
            name: "R2.dev URL 或自訂網域",
            desc: "必填。寫入筆記的連結所使用的網域：填入在 R2 公開存取設定中啟用的 https://pub-xxxx.r2.dev，或繫結到儲存貯體的自訂網域。R2 的端點無法從外部直接存取，留空時上傳會出錯。",
            placeholder: "pub-xxxx.r2.dev",
        },
    },

    b2: {
        accessKeyId: {
            name: "應用程式金鑰 ID",
            desc: "在 Backblaze B2 中建立的應用程式金鑰 ID（keyID）。",
            placeholder: "輸入應用程式金鑰 ID",
        },
        secretAccessKey: {
            name: "應用程式金鑰",
            desc: "與 keyID 配對的金鑰（applicationKey），只在建立時顯示一次。",
            placeholder: "輸入應用程式金鑰",
        },
        region: {
            name: "區域",
            desc: "儲存貯體所在的區域，例如 us-west-004。也就是 B2 儲存貯體頁面顯示的端點中，s3. 與 .backblazeb2.com 之間的部分。",
            placeholder: "us-west-004",
        },
        bucketName: {
            name: "儲存貯體名稱",
            desc: "用來儲存圖片的 B2 儲存貯體名稱。私人儲存貯體的連結無法開啟。",
            placeholder: "輸入儲存貯體名稱",
        },
        customDomain: {
            name: "自訂網域",
            desc: "寫入筆記的連結所使用的網域。前面接了 CDN 或自訂網域時填寫。留空則使用 B2 預設的 URL。",
            placeholder: "輸入自訂網域（選填）",
        },
    },

    modal: {
        title: "正在上傳圖片",
        titleComplete: "上傳完成",
        titlePartial: "上傳完成（部分失敗）",
        titleFailed: "上傳失敗",
        uploading: "上傳中...",
        complete: "完成",
        failed: "失敗",
        completedWithErrors: (failed: number) => `已完成，但有錯誤（${failed} 張失敗）`,
        succeeded: (count: number) => `成功 ${count} 張`,
        failedCount: (count: number) => `失敗 ${count} 張`,
        modeWebp: (quality: number) => `WebP 轉換已開啟（品質 ${quality}）`,
        modeWebpKeepOriginal: (quality: number) => `WebP 轉換已開啟（品質 ${quality}，保留原始圖片）`,
        modeWebpSkipped: "此筆記略過 WebP 轉換",
        modeHistory: "上傳紀錄已開啟",
        reused: "沿用紀錄",
        reusedCount: (count: number) => `沿用紀錄 ${count} 張`,
        sizeConverted: (from: string, to: string) => `${from} → ${to}`,
        compareConverted: (size: string) => `轉換後 ${size}`,
        compareSaved: (size: string) => `節省 ${size}`,
        compareOriginal: (size: string, delta: string) => `原始 ${size}（${delta}）`,
    },

    notice: {
        uploaderSetupFailed: "上傳器初始化失敗，請檢查設定。",
        publishFailed: (message: string) => `發布失敗：${message}`,
        copiedToClipboard: "已複製到剪貼簿",
        cannotLocate: (name: string, path: string) =>
            `在 ${path} 找不到 ${name}，請檢查圖片路徑或外掛設定中的附件選項。`,
        webImageUploadFailed: (path: string, message: string) =>
            `網路圖片 ${path} 上傳失敗：${message}`,
        uploadFailed: (path: string, message: string) =>
            `${path} 上傳失敗，伺服器傳回錯誤：${message}`,
        originalUploadFailed: (path: string, message: string) =>
            `${path} 的 WebP 已上傳，但封存原始圖片失敗：${message}`,
        readFileFailed: (path: string) => `無法讀取檔案：${path}`,
        filteredOut: (excluded: number, outOfScope: number) =>
            `依照上傳資料夾設定，部分圖片保留在本機（排除的資料夾：${excluded} 張，目標資料夾以外：${outOfScope} 張）。`,
        mermaidRendering: (count: number) => `正在繪製 ${count} 個 Mermaid 圖表...`,
        mermaidInitFailed: (message: string) => `Mermaid 初始化失敗：${message}`,
        mermaidBlockFailed: (index: number, message: string) =>
            `第 ${index} 個 Mermaid 程式碼區塊繪製失敗：${message}`,
    },
};

export default zhTW;
