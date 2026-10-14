import type {Messages} from "./en";

/** Korean messages. Typed as Messages, so a missing key is a compile error. */
const ko: Messages = {
    command: {
        publishPage: "페이지 게시",
    },

    general: {
        altText: {
            name: "이미지 이름을 대체 텍스트로 사용",
            desc: "켜면: 링크의 대괄호 안에 이미지 파일 이름이 들어갑니다('-'와 '_'는 공백으로 바뀝니다). 끄면: 대괄호 안이 비어 있습니다. 화면 표시는 그대로이고, 이미지를 불러오지 못했을 때 보이는 글자만 달라집니다.",
        },
        updateOriginalDoc: {
            name: "원본 노트 수정",
            desc: "켜면: 원본 노트의 이미지 링크를 업로드된 URL로 바꿉니다. 끄면: 원본 노트는 그대로 두고, 링크를 바꾼 본문을 클립보드에 복사하기만 합니다.",
        },
        ignoreProperties: {
            name: "속성을 빼고 복사",
            desc: "켜면: 클립보드에 복사하는 본문에서 노트 맨 앞의 속성(프런트매터)을 제거합니다. 끄면: 속성까지 함께 복사합니다. 어느 쪽이든 원본 노트의 속성은 지워지지 않습니다.",
        },
    },

    upload: {
        heading: "업로드",
        progressModal: {
            name: "진행 상황을 대화 상자로 표시",
            desc: "켜면: 이미지별 성공·실패를 보여 주는 대화 상자를 띄웁니다(모두 성공하면 3초 뒤 자동으로 닫힙니다). 끄면: 화면 오른쪽 아래 상태 표시줄에 한 줄로만 표시합니다.",
        },
        webImages: {
            name: "웹 이미지도 업로드",
            desc: "켜면: 노트에서 http / https URL로 참조하는 이미지도 내려받아 내 스토리지에 다시 업로드하고 링크를 바꿉니다. 원본 사이트에서 이미지가 사라져도 남아 있습니다. 끄면: 외부 URL을 그대로 둡니다. 이미 내 스토리지에 있는 이미지는 어느 쪽이든 건너뜁니다.",
        },
    },

    webp: {
        heading: "WebP 변환",
        enabled: {
            name: "이미지를 WebP로 변환",
            desc: "켜면: 업로드 전에 로컬 이미지를 WebP로 변환하고, 노트에는 WebP 링크를 씁니다. 로컬 이미지에만 적용되며 웹 이미지와 Mermaid 다이어그램은 변환하지 않습니다. 끄면: 원래 형식 그대로 업로드합니다.",
        },
        extensions: {
            name: "변환할 확장자",
            desc: "쉼표로 구분하며 점은 붙이지 않습니다. GIF와 SVG가 기본값에서 빠져 있는 것은 변환이 canvas를 거치기 때문입니다. 움직이는 GIF는 첫 프레임만 남고, SVG는 래스터화되어 확대하면 깨집니다.",
            placeholder: "png, jpg, jpeg",
        },
        quality: {
            name: "품질",
            desc: "WebP 압축 품질입니다. 낮출수록 파일이 작아지고 화질 손실도 커집니다. 사진은 75 안팎, 글자가 들어간 그림은 90 안팎이 적당합니다. 변환 후 파일이 원본보다 커지면 자동으로 원본을 업로드합니다.",
        },
        keepOriginal: {
            name: "원본도 함께 업로드",
            desc: "켜면: 변환하지 않은 원본 파일도 보관용으로 업로드합니다. 노트에 쓰이는 링크는 그대로 WebP입니다. 끄면: WebP만 업로드하고 원본은 스토리지에 남지 않습니다.",
        },
        originalPath: {
            name: "원본 저장 경로",
            desc: "보관용 원본 파일을 둘 위치입니다. '저장 경로'와 같은 변수를 쓸 수 있습니다. 같은 경로로 지정하면 WebP와 원본이 섞이므로 다른 위치로 지정하세요.",
            placeholder: "/originals/{year}/{mon}/{day}/{filename}",
        },
        originalPathUnsupported: "이 업로드 대상은 경로를 지정할 수 없어 원본 파일이 WebP와 같은 위치에 저장됩니다. 확장자가 다르므로 덮어쓰지는 않습니다.",
        frontmatterProperty: {
            name: "노트별 전환 속성",
            desc: "노트 속성의 이름입니다. 어떤 노트에서 true로 두면 그 노트는 변환하고, false로 두면 변환하지 않습니다. 비워 두면 노트별 전환을 사용하지 않습니다.",
            placeholder: "webp",
        },
        frontmatterDefault: {
            name: "속성이 없을 때의 기본값",
            desc: "속성을 적지 않은 노트에 적용됩니다. 끄면 속성으로 명시한 노트만 변환합니다.",
        },
    },

    cache: {
        heading: "업로드 기록",
        enabled: {
            name: "바뀌지 않은 이미지는 다시 업로드하지 않음",
            desc: "켜면: 업로드한 파일 내용을 기록해 두고, 다음부터는 같은 URL을 재사용합니다. 이미지를 편집하면 다시 업로드되며, 버킷이나 도메인을 바꿨을 때도 기록은 쓰이지 않습니다. 끄면: 실행할 때마다 매번 업로드합니다.",
        },
        clear: {
            name: "업로드 기록 지우기",
            desc: "기록을 모두 지우고, 다음 실행 때 모든 이미지를 다시 업로드합니다. 이미 업로드된 파일은 삭제되지 않습니다. 노트의 링크가 열리지 않을 때 사용하세요.",
            button: "지우기",
        },
        entries: (count: number) => `기록 ${count}건`,
        cleared: (count: number) => `업로드 기록 ${count}건을 지웠습니다`,
    },

    mermaid: {
        heading: "Mermaid",
        convert: {
            name: "Mermaid 다이어그램을 이미지로 변환",
            desc: "켜면: 게시할 때 mermaid 코드 블록을 PNG로 변환해 업로드하고 이미지 링크로 바꿉니다. Mermaid를 지원하지 않는 곳에 붙여 넣을 때 사용합니다. 끄면: 코드 블록 그대로 둡니다.",
        },
        scale: {
            name: "Mermaid 이미지 배율",
            desc: "내보내는 PNG의 해상도입니다. 2이면 다이어그램 표시 크기의 2배 픽셀로 내보냅니다. 값을 올리면 선명해지지만 파일 크기도 커집니다. 고해상도 디스플레이라면 2가 적당합니다.",
        },
        theme: {
            name: "Mermaid 테마",
            desc: "내보내는 다이어그램의 색 구성입니다. Obsidian의 테마와 연동되지 않으므로 여기서 지정한 색으로 고정됩니다.",
            options: {
                default: "기본",
                dark: "다크",
                forest: "포레스트",
                neutral: "뉴트럴",
                base: "베이스",
            },
        },
    },

    network: {
        heading: "네트워크",
        mode: {
            name: "프록시",
            desc: "Amazon S3 / Cloudflare R2 / Backblaze B2에 연결할 때 프록시를 거칠지 정합니다. 이 세 곳만은 Obsidian을 거치지 않고 AWS SDK가 직접 통신하므로 Windows나 macOS의 프록시 설정이 적용되지 않습니다. 사내 프록시 환경에서는 여기를 설정하지 않으면 업로드가 시간 초과됩니다. 다른 업로드 대상에는 영향이 없습니다.",
            options: {
                auto: "환경 변수에서 자동 감지",
                off: "프록시 사용 안 함",
                manual: "URL 직접 입력",
            },
        },
        url: {
            name: "프록시 URL",
            desc: "예: http://proxy.example.com:8080. 인증이 필요한 프록시라면 http://사용자이름:비밀번호@proxy.example.com:8080 형식으로 입력합니다.",
            placeholder: "http://host:port",
        },
        detected: (url: string) => `환경 변수에서 감지했습니다. 이 프록시를 거칩니다: ${url}`,
        notDetected: "환경 변수 HTTPS_PROXY / HTTP_PROXY를 찾을 수 없습니다. 프록시 없이 직접 연결합니다. 프록시 환경이라면 업로드가 실패하므로 'URL 직접 입력'으로 바꾸세요.",
        manualActive: (url: string) => `이 프록시를 거칩니다: ${url}`,
        manualEmpty: "아래 입력란이 비어 있습니다. 이대로 두면 프록시 없이 직접 연결합니다.",
        disabled: "프록시 없이 직접 연결합니다. 환경 변수가 설정되어 있어도 무시합니다.",
    },

    language: {
        name: "언어",
        desc: "이 설정 화면과 알림 메시지의 표시 언어입니다. '자동'은 Obsidian의 언어 설정을 따릅니다. 바꾸면 바로 적용됩니다.",
        options: {
            auto: "자동",
        },
    },

    imageStore: {
        heading: "업로드 대상",
        select: {
            name: "업로드 대상 서비스",
            desc: "이미지를 어디에 업로드할지 정합니다. 바꾸면 아래 입력 항목이 해당 서비스용으로 바뀝니다. 서비스별 설정은 따로 저장되므로 전환해도 이전 입력은 사라지지 않습니다.",
        },
    },

    filter: {
        heading: "업로드할 폴더",
        scope: {
            name: "업로드 범위",
            desc: "이 업로드 대상으로 보낼 로컬 이미지의 범위입니다. 폴더 지정은 업로드 대상마다 따로 저장됩니다.",
            options: {
                all: "모든 폴더",
                selected: "선택한 폴더만",
            },
        },
        hint: "하위 폴더도 포함됩니다. 대상에서 빠진 이미지의 링크는 그대로 남습니다.",
        include: {
            name: "대상 폴더",
            add: "폴더 추가",
            empty: "대상 폴더를 추가하세요. 추가하기 전까지는 로컬 이미지가 이 업로드 대상으로 하나도 업로드되지 않습니다.",
        },
        exclude: {
            name: "제외 폴더",
            desc: "이 폴더에 있는 이미지는 대상 폴더 안에 있더라도 업로드하지 않습니다.",
            add: "제외 폴더 추가",
            empty: "제외 폴더가 없습니다.",
        },
        remove: "삭제",
        missing: "폴더를 찾을 수 없습니다. 삭제되었거나 플러그인이 꺼져 있는 동안 이동되었을 수 있습니다. 직접 삭제할 때까지 조건은 남아 있습니다.",
        pickFolder: "폴더 선택",
        test: {
            name: "조건 테스트",
            desc: "위 조건으로 어떤 이미지가 업로드되는지 확인합니다. 실제로 업로드하지는 않습니다.",
            button: "테스트",
        },
    },

    filterTest: {
        title: "업로드 조건 테스트",
        disclaimer: "업로드 범위만 확인합니다. 연결이나 인증 정보는 확인하지 않습니다.",
        store: (name: string) => `업로드 대상: ${name}`,
        scopeNote: "노트의 이미지",
        scopeVault: "보관함 전체의 이미지",
        note: (path: string) => `노트: ${path}`,
        noNote: "선택된 노트가 없습니다.",
        changeNote: "노트 선택",
        pickNote: "노트를 선택하세요",
        search: "경로 검색",
        allVerdicts: "모든 결과",
        verdict: {
            included: "업로드됨",
            excluded: "제외 폴더에 해당",
            outOfScope: "대상 폴더에 없음",
            notFound: "이미지를 찾을 수 없음",
        },
        column: {
            path: "이미지",
            verdict: "결과",
            reason: "이유",
            refs: "링크 수",
        },
        reason: {
            allFolders: "모든 폴더가 대상입니다.",
            inTarget: (folders: string) => `대상 폴더 ${folders}에 포함됩니다.`,
            noTarget: "선택된 대상 폴더가 없습니다.",
            notInTarget: "어느 대상 폴더에도 포함되지 않습니다.",
            excluded: (folders: string) => `제외 폴더 ${folders}에 포함됩니다.`,
            excludedOverTarget: (excluded: string, target: string) =>
                `제외 폴더 ${excluded}, 대상 폴더 ${target} 양쪽에 포함됩니다. 제외가 우선합니다.`,
            notFound: (link: string) => `보관함에 링크 ${link}에 해당하는 파일이 없습니다.`,
        },
        count: (label: string, n: number) => `${label}: ${n}건`,
        page: (current: number, total: number, shown: number) => `${total}페이지 중 ${current}페이지 (이미지 ${shown}개)`,
        prev: "이전",
        next: "다음",
        empty: "표시할 이미지가 없습니다.",
        otherHeading: "폴더 조건의 영향을 받지 않음",
        webOn: (n: number, hosted: number) =>
            `웹 이미지: ${n}개. 게시할 때 내려받아 업로드합니다` + (hosted > 0 ? `(이 업로드 대상에 이미 있는 ${hosted}개는 제외).` : "."),
        webOff: (n: number) => `웹 이미지: ${n}개. 그대로 둡니다('웹 이미지도 업로드'가 꺼져 있음).`,
        mermaidOn: (n: number) => `Mermaid 다이어그램: ${n}개. 게시할 때 이미지로 변환해 업로드합니다.`,
        mermaidOff: (n: number) => `Mermaid 다이어그램: ${n}개. 코드 그대로 둡니다('Mermaid 다이어그램을 이미지로 변환'이 꺼져 있음).`,
        readFailed: (message: string) => `노트를 읽을 수 없습니다: ${message}`,
    },

    common: {
        bucketName: {
            name: "버킷 이름",
            desc: "이미지를 저장할 버킷의 이름입니다. 미리 만들어 두어야 합니다.",
            placeholder: "버킷 이름 입력",
        },
        targetPath: {
            name: "저장 경로",
            desc: "버킷 안 어디에 둘지 정합니다. {year} {mon} {day} {random} {filename} {foldername} {notename} 변수를 쓸 수 있습니다. 예를 들어 /{year}/{mon}/{day}/{filename}이면 pic.jpg는 /2026/08/24/pic.jpg로 저장됩니다. {foldername}은 노트가 들어 있는 폴더 이름, {notename}은 노트 자체의 이름이므로 img/{notename}/{filename}으로 지정하면 노트별로 이미지가 모입니다. 보관함 최상위에 있는 노트는 {foldername}이 비어 그 구간이 생략됩니다. 비워 두면 파일 이름만 쓰이므로 같은 이름의 파일을 덮어쓸 수 있습니다.",
            placeholder: "/{year}/{mon}/{day}/{filename}",
        },
        customDomain: {
            name: "공개용 도메인",
            desc: "노트에 쓰는 링크의 도메인 부분입니다. CloudFront 같은 CDN을 앞에 둔 경우에 지정합니다. cdn.example.com을 입력하면 링크는 https://cdn.example.com/저장경로 가 됩니다. 비워 두면 스토리지 본래의 URL을 그대로 씁니다. 업로드 위치는 바뀌지 않습니다.",
            placeholder: "cdn.example.com",
        },
    },

    imgur: {
        clientId: {
            name: "클라이언트 ID",
            placeholder: "클라이언트 ID 입력",
        },
        descPrefix: "기본값은 플러그인 공용 ID입니다. 업로드가 많으면 횟수 제한에 걸리므로 직접 ID를 발급받아 바꾸세요: ",
    },

    gyazo: {
        accessToken: {
            name: "액세스 토큰",
            placeholder: "액세스 토큰 입력",
        },
        tokenDescPrefix: "Gyazo에서 애플리케이션을 만들고 액세스 토큰을 발급받으세요: ",
        accessPolicy: {
            name: "공개 범위",
            desc: "업로드한 이미지를 누가 볼 수 있는지 정합니다. '나만'으로 하면 노트에 붙인 URL을 다른 사람이나 외부 사이트에서 열 수 없습니다. 공유하는 노트에 쓸 거라면 '모든 사람'을 선택하세요.",
            options: {
                anyone: "모든 사람",
                onlyMe: "나만",
            },
        },
        commonDescription: {
            name: "공통 설명",
            desc: "업로드하는 모든 이미지에 같은 설명을 붙입니다. 나중에 Gyazo 목록에서 찾기 쉬워집니다. 비워 두면 설명을 붙이지 않습니다.",
            placeholder: "공통 설명 입력(선택 사항)",
        },
    },

    oss: {
        region: {
            name: "리전",
            desc: "버킷을 만든 데이터 센터의 위치입니다. 버킷과 일치하지 않으면 업로드에 실패합니다. 선택하면 엔드포인트도 자동으로 바뀝니다.",
        },
        accessKeyId: {
            name: "액세스 키 ID",
            desc: "Aliyun RAM에서 발급한 액세스 키 ID입니다.",
            placeholder: "액세스 키 ID 입력",
        },
        accessKeySecret: {
            name: "액세스 키 시크릿",
            desc: "액세스 키 ID와 함께 발급되는 비밀 문자열입니다. 발급할 때만 표시됩니다.",
            placeholder: "액세스 키 시크릿 입력",
        },
    },

    imagekit: {
        id: {
            name: "ImageKit ID",
            placeholder: "ImageKit ID 입력",
        },
        descPrefix: "ID와 각 키는 대시보드에서 확인할 수 있습니다: ",
        folder: {
            name: "저장 폴더",
            desc: "ImageKit 안의 어느 폴더에 둘지 정합니다. 비워 두면 루트에 저장됩니다.",
            placeholder: "폴더 이름 입력",
        },
        publicKey: {
            name: "공개 키",
            placeholder: "공개 키 입력",
        },
        privateKey: {
            name: "비공개 키",
            placeholder: "비공개 키 입력",
        },
    },

    s3: {
        accessKeyId: {
            name: "액세스 키 ID",
            desc: "IAM 사용자의 액세스 키 ID로, AKIA로 시작하는 20자입니다. 버킷에 대한 PutObject 권한이 필요합니다.",
            placeholder: "AKIA...",
        },
        secretAccessKey: {
            name: "보안 액세스 키",
            desc: "액세스 키 ID와 함께 발급되는 비밀 문자열입니다. 만들 때만 표시되므로 적어 두지 않았다면 새로 만드세요.",
            placeholder: "보안 액세스 키 입력",
        },
        region: {
            name: "리전",
            desc: "버킷을 만든 리전입니다. 예: ap-northeast-2(서울). 버킷과 일치하지 않으면 업로드에 실패합니다. AWS 콘솔의 버킷 목록에서 확인할 수 있습니다.",
            placeholder: "ap-northeast-2",
        },
        bucketName: {
            name: "버킷 이름",
            desc: "이미지를 저장할 S3 버킷의 이름입니다.",
            placeholder: "버킷 이름 입력",
        },
        endpoint: {
            name: "S3 호환 엔드포인트",
            desc: "AWS S3를 쓴다면 비워 둡니다. MinIO, DigitalOcean Spaces, Wasabi, Ceph 같은 S3 호환 서비스를 쓸 때 그 URL을 입력합니다. 지정하면 경로 방식 주소를 쓰게 되어 버킷 이름이 URL의 첫 번째 경로가 됩니다. 사용자 지정 도메인을 함께 쓴다면 버킷이 아니라 서버를 가리키도록 설정하세요. 리전은 요청 서명에만 쓰이며, 비워 두면 us-east-1이 됩니다.",
            placeholder: "https://minio.example.com",
        },
    },

    cos: {
        region: {
            name: "리전",
            desc: "버킷을 만든 데이터 센터의 위치입니다. 버킷과 일치하지 않으면 업로드에 실패합니다.",
        },
        secretId: {
            name: "SecretId",
            desc: "Tencent Cloud 액세스 관리에서 발급한 SecretId입니다.",
            placeholder: "SecretId 입력",
        },
        secretKey: {
            name: "SecretKey",
            desc: "SecretId와 함께 발급되는 비밀 문자열입니다.",
            placeholder: "SecretKey 입력",
        },
    },

    qiniu: {
        accessKey: {
            name: "액세스 키",
            desc: "Qiniu의 액세스 키(AccessKey)입니다.",
            placeholder: "액세스 키 입력",
        },
        secretKey: {
            name: "시크릿 키",
            desc: "액세스 키와 함께 발급되는 비밀 문자열입니다.",
            placeholder: "시크릿 키 입력",
        },
    },

    github: {
        repositoryName: {
            name: "저장소",
            desc: "이미지를 둘 저장소를 owner/repo 형식으로 지정합니다. 예: octocat/my-images. 공개 저장소라면 링크를 외부에서 그대로 열 수 있습니다.",
            placeholder: "owner/repo",
        },
        branchName: {
            name: "브랜치",
            desc: "커밋할 브랜치입니다. 기본값은 main입니다. 존재하지 않는 브랜치를 지정하면 업로드에 실패합니다.",
            placeholder: "main",
        },
        token: {
            name: "개인 액세스 토큰",
            placeholder: "ghp_... 입력",
        },
        tokenDescPrefix: "'repo' 범위를 가진 토큰을 발급받으세요. 이 범위가 없으면 커밋할 수 없습니다: ",
    },

    r2: {
        accessKeyId: {
            name: "액세스 키 ID",
            desc: "Cloudflare에서 R2 API 토큰으로 발급한 액세스 키 ID입니다.",
            placeholder: "액세스 키 ID 입력",
        },
        secretAccessKey: {
            name: "보안 액세스 키",
            desc: "액세스 키 ID와 함께 발급되는 비밀 문자열입니다. 발급할 때만 표시됩니다.",
            placeholder: "보안 액세스 키 입력",
        },
        endpoint: {
            name: "엔드포인트",
            desc: "업로드할 S3 호환 엔드포인트입니다. R2 버킷 화면에 표시되는 https://계정ID.r2.cloudflarestorage.com 을 그대로 입력합니다.",
            placeholder: "https://<account-id>.r2.cloudflarestorage.com",
        },
        bucketName: {
            name: "버킷 이름",
            desc: "이미지를 저장할 R2 버킷의 이름입니다.",
            placeholder: "버킷 이름 입력",
        },
        customDomain: {
            name: "공개용 도메인",
            desc: "필수입니다. 노트에 쓰는 링크의 도메인 부분으로, R2 공개 설정에서 활성화한 https://pub-xxxx.r2.dev 또는 버킷에 연결한 사용자 지정 도메인을 입력합니다. R2 엔드포인트는 외부에서 직접 열 수 없으므로 비워 두면 업로드가 오류로 끝납니다.",
            placeholder: "pub-xxxx.r2.dev",
        },
    },

    b2: {
        accessKeyId: {
            name: "애플리케이션 키 ID",
            desc: "Backblaze B2에서 발급한 애플리케이션 키의 ID(keyID)입니다.",
            placeholder: "애플리케이션 키 ID 입력",
        },
        secretAccessKey: {
            name: "애플리케이션 키",
            desc: "keyID와 함께 발급되는 비밀 문자열입니다. 발급할 때만 표시됩니다.",
            placeholder: "애플리케이션 키 입력",
        },
        region: {
            name: "리전",
            desc: "버킷의 리전입니다. 예: us-west-004. B2 버킷 화면에 표시되는 엔드포인트에서 s3.와 .backblazeb2.com 사이 부분입니다.",
            placeholder: "us-west-004",
        },
        bucketName: {
            name: "버킷 이름",
            desc: "이미지를 저장할 B2 버킷의 이름입니다. 비공개 버킷이면 링크를 열 수 없습니다.",
            placeholder: "버킷 이름 입력",
        },
        customDomain: {
            name: "공개용 도메인",
            desc: "노트에 쓰는 링크의 도메인 부분입니다. CDN이나 사용자 지정 도메인을 앞에 둔 경우에 지정합니다. 비워 두면 B2 본래의 URL을 씁니다.",
            placeholder: "사용자 지정 도메인 입력(선택 사항)",
        },
    },

    modal: {
        title: "이미지 업로드 중",
        titleComplete: "업로드 완료",
        titlePartial: "업로드 완료(일부 실패)",
        titleFailed: "업로드 실패",
        uploading: "업로드 중...",
        complete: "완료",
        failed: "실패",
        completedWithErrors: (failed: number) => `오류 있음(${failed}건 실패)`,
        succeeded: (count: number) => `성공 ${count}건`,
        failedCount: (count: number) => `실패 ${count}건`,
        modeWebp: (quality: number) => `WebP 변환 켜짐(품질 ${quality})`,
        modeWebpKeepOriginal: (quality: number) => `WebP 변환 켜짐(품질 ${quality}, 원본도 저장)`,
        modeWebpSkipped: "이 노트는 WebP 변환 대상이 아님",
        modeHistory: "업로드 기록 켜짐",
        reused: "기록에서 재사용",
        reusedCount: (count: number) => `기록에서 ${count}건`,
        sizeConverted: (from: string, to: string) => `${from} → ${to}`,
        compareConverted: (size: string) => `변환 후 ${size}`,
        compareSaved: (size: string) => `절감 ${size}`,
        compareOriginal: (size: string, delta: string) => `원본 ${size}(${delta})`,
    },

    notice: {
        uploaderSetupFailed: "업로더를 초기화하지 못했습니다. 설정을 확인하세요.",
        publishFailed: (message: string) => `게시에 실패했습니다: ${message}`,
        copiedToClipboard: "클립보드에 복사했습니다",
        cannotLocate: (name: string, path: string) =>
            `${path}에서 ${name}을(를) 찾을 수 없습니다. 이미지 경로나 플러그인 설정의 첨부 파일 옵션을 확인하세요.`,
        webImageUploadFailed: (path: string, message: string) =>
            `웹 이미지 ${path} 업로드에 실패했습니다: ${message}`,
        uploadFailed: (path: string, message: string) =>
            `${path} 업로드에 실패했습니다. 서버 응답: ${message}`,
        originalUploadFailed: (path: string, message: string) =>
            `${path}의 WebP는 업로드했지만 원본 보관에 실패했습니다: ${message}`,
        readFileFailed: (path: string) => `파일을 읽을 수 없습니다: ${path}`,
        filteredOut: (excluded: number, outOfScope: number) =>
            `업로드 범위 설정에 따라 로컬에 남겨 둔 이미지가 있습니다(제외 폴더: ${excluded}개, 대상 폴더 밖: ${outOfScope}개).`,
        mermaidRendering: (count: number) => `Mermaid 다이어그램 ${count}개를 변환하는 중...`,
        mermaidInitFailed: (message: string) => `Mermaid 초기화에 실패했습니다: ${message}`,
        mermaidBlockFailed: (index: number, message: string) =>
            `${index}번째 Mermaid 블록을 변환하지 못했습니다: ${message}`,
    },
};

export default ko;
