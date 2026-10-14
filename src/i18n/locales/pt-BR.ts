import type {Messages} from "./en";

/** Brazilian Portuguese messages. Typed as Messages, so a missing key is a compile error. */
const ptBR: Messages = {
    command: {
        publishPage: "Publicar página",
    },

    general: {
        altText: {
            name: "Usar o nome da imagem como texto alternativo",
            desc: "Ativado: o nome do arquivo da imagem é escrito entre os colchetes do link (\"-\" e \"_\" viram espaços). Desativado: os colchetes ficam vazios. A imagem aparece igual; só muda o texto exibido quando ela não carrega.",
        },
        updateOriginalDoc: {
            name: "Atualizar a nota original",
            desc: "Ativado: os links de imagem da nota original são substituídos pelas URLs enviadas. Desativado: a nota original não é alterada e apenas o texto com os links substituídos é copiado para a área de transferência.",
        },
        ignoreProperties: {
            name: "Ignorar as propriedades ao copiar",
            desc: "Ativado: o texto copiado para a área de transferência não inclui as propriedades (frontmatter) do início da nota. Desativado: as propriedades também são copiadas. Em ambos os casos, as propriedades continuam na nota original.",
        },
    },

    upload: {
        heading: "Envio",
        progressModal: {
            name: "Mostrar o progresso em uma caixa de diálogo",
            desc: "Ativado: abre uma caixa de diálogo com o resultado de cada imagem (se tudo der certo, ela fecha sozinha após 3 segundos). Desativado: mostra apenas uma linha na barra de status.",
        },
        webImages: {
            name: "Enviar também as imagens da web",
            desc: "Ativado: as imagens que a nota referencia por URL http/https são baixadas, reenviadas para o seu armazenamento e o link é atualizado, assim elas não se perdem se sumirem do site original. Desativado: as URLs externas ficam como estão. Imagens que já estão no seu armazenamento são ignoradas em ambos os casos.",
        },
    },

    webp: {
        heading: "Conversão para WebP",
        enabled: {
            name: "Converter as imagens para WebP",
            desc: "Ativado: as imagens locais são convertidas para WebP antes do envio e a nota passa a apontar para o arquivo WebP. Vale só para imagens locais; imagens da web e diagramas do Mermaid não são convertidos. Desativado: as imagens são enviadas no formato original.",
        },
        extensions: {
            name: "Extensões a converter",
            desc: "Separadas por vírgula, sem o ponto. GIF e SVG ficam de fora por padrão porque a conversão passa por um canvas: de um GIF animado sobra só o primeiro quadro, e um SVG é rasterizado e deixa de ampliar sem perda.",
            placeholder: "png, jpg, jpeg",
        },
        quality: {
            name: "Qualidade",
            desc: "Qualidade de compressão do WebP. Quanto menor, menor o arquivo e maior a perda. Como referência, cerca de 75 para fotos e cerca de 90 para imagens com texto. Se o WebP ficar maior que o original, o original é enviado no lugar.",
        },
        keepOriginal: {
            name: "Enviar também o original",
            desc: "Ativado: além do WebP, o arquivo original sem alterações é enviado como cópia de arquivo. A nota continua apontando para o WebP. Desativado: só o WebP é enviado e o original não fica no armazenamento.",
        },
        originalPath: {
            name: "Caminho dos originais",
            desc: "Onde ficam as cópias dos originais. Aceita as mesmas variáveis do caminho de destino. Use um caminho diferente do de destino para que um arquivo não sobrescreva o outro.",
            placeholder: "/originals/{year}/{mon}/{day}/{filename}",
        },
        originalPathUnsupported: "Este armazenamento não permite definir um caminho, então os originais são enviados ao lado dos arquivos WebP. Como as extensões são diferentes, nada é sobrescrito.",
        frontmatterProperty: {
            name: "Propriedade para decidir por nota",
            desc: "Nome da propriedade da nota que decide a conversão em uma nota específica. Defina como true para converter essa nota e false para não converter. Deixe este campo vazio para desativar a escolha por nota.",
            placeholder: "webp",
        },
        frontmatterDefault: {
            name: "Padrão quando a propriedade não existe",
            desc: "Aplicado às notas que não definem a propriedade. Desative para converter apenas as notas que pedirem isso explicitamente.",
        },
    },

    cache: {
        heading: "Histórico de envios",
        enabled: {
            name: "Não reenviar imagens sem alterações",
            desc: "Ativado: registra quais conteúdos de arquivo já foram enviados para o destino atual e reutiliza a URL em vez de enviar de novo. Editar uma imagem faz com que ela seja enviada de novo; trocar de bucket ou de domínio também. Desativado: todas as imagens são enviadas a cada publicação.",
        },
        clear: {
            name: "Limpar o histórico de envios",
            desc: "Esquece todos os envios registrados, então a próxima publicação envia tudo de novo. Os arquivos já enviados não são excluídos. Use quando uma nota apontar para uma URL que não funciona mais.",
            button: "Limpar",
        },
        entries: (count: number) => count === 1 ? `${count} envio registrado` : `${count} envios registrados`,
        cleared: (count: number) => count === 1 ? `${count} envio registrado foi apagado` : `${count} envios registrados foram apagados`,
    },

    mermaid: {
        heading: "Mermaid",
        convert: {
            name: "Converter diagramas do Mermaid em imagens",
            desc: "Ativado: ao publicar, os blocos de código mermaid são convertidos em PNG, enviados e substituídos por um link para a imagem. Útil para colar o texto em lugares que não suportam Mermaid. Desativado: ficam como blocos de código.",
        },
        scale: {
            name: "Escala das imagens do Mermaid",
            desc: "Resolução do PNG exportado (de 1x a 4x). Com 2, a imagem tem o dobro de pixels do tamanho de exibição do diagrama. Valores maiores deixam a imagem mais nítida e o arquivo maior. Para telas de alta resolução, 2 é o recomendado.",
        },
        theme: {
            name: "Tema do Mermaid",
            desc: "Cores dos diagramas exportados. Não acompanha o tema de aparência do Obsidian: as cores escolhidas aqui são sempre usadas.",
            options: {
                default: "Padrão",
                dark: "Escuro",
                forest: "Floresta",
                neutral: "Neutro",
                base: "Base",
            },
        },
    },

    network: {
        heading: "Rede",
        mode: {
            name: "Proxy",
            desc: "Se um proxy é usado para conectar ao Amazon S3, Cloudflare R2 e Backblaze B2. Esses três se comunicam diretamente pelo SDK da AWS, sem passar pelo Obsidian, por isso não seguem as configurações de proxy do sistema. Atrás de um proxy corporativo, os envios atingem o tempo limite se você não configurar isto aqui. Não afeta os outros armazenamentos.",
            options: {
                auto: "Detectar pelas variáveis de ambiente",
                off: "Não usar proxy",
                manual: "Informar manualmente",
            },
        },
        url: {
            name: "URL do proxy",
            desc: "Por exemplo, http://proxy.example.com:8080. Se o proxy exigir autenticação, inclua as credenciais assim: http://user:pass@host:port.",
            placeholder: "http://host:port",
        },
        detected: (url: string) => `Detectado nas variáveis de ambiente. Este proxy será usado: ${url}`,
        notDetected: "As variáveis de ambiente HTTPS_PROXY / HTTP_PROXY não foram encontradas. Os envios vão conectar diretamente. Se você estiver atrás de um proxy, eles vão falhar: mude para \"Informar manualmente\".",
        manualActive: (url: string) => `Este proxy será usado: ${url}`,
        manualEmpty: "O campo abaixo está vazio. Enquanto estiver assim, os envios vão conectar diretamente.",
        disabled: "Os envios conectam diretamente, sem proxy, mesmo que haja variáveis de ambiente definidas.",
    },

    language: {
        name: "Idioma",
        desc: "Idioma das configurações e dos avisos deste plugin. \"Automático\" segue o idioma definido no Obsidian. A mudança é aplicada na hora.",
        options: {
            auto: "Automático",
        },
    },

    imageStore: {
        heading: "Armazenamento de imagens",
        select: {
            name: "Serviço de armazenamento",
            desc: "Para onde as imagens são enviadas. Ao trocar, os campos abaixo passam a ser os desse serviço. As configurações de cada serviço são salvas separadamente, então você não perde o que já preencheu ao trocar.",
        },
    },

    filter: {
        heading: "Pastas a enviar",
        scope: {
            name: "Escopo do envio",
            desc: "Quais imagens locais são enviadas para este armazenamento. Cada armazenamento guarda as próprias pastas.",
            options: {
                all: "Todas as pastas",
                selected: "Apenas as pastas escolhidas",
            },
        },
        hint: "As subpastas estão incluídas. Os links das imagens que ficam de fora não são alterados.",
        include: {
            name: "Pastas de destino",
            add: "Adicionar pasta",
            empty: "Adicione uma pasta de destino. Até lá, nenhuma imagem local é enviada para este armazenamento.",
        },
        exclude: {
            name: "Pastas excluídas",
            desc: "As imagens nessas pastas nunca são enviadas, mesmo dentro de uma pasta de destino.",
            add: "Adicionar pasta excluída",
            empty: "Nenhuma pasta excluída.",
        },
        remove: "Remover",
        missing: "Pasta não encontrada. Ela foi excluída ou movida enquanto o plugin estava desativado; a condição é mantida até você removê-la.",
        pickFolder: "Escolha uma pasta",
        test: {
            name: "Testar as condições",
            desc: "Mostra quais imagens seriam enviadas com as condições acima, sem enviar nada.",
            button: "Testar",
        },
    },

    filterTest: {
        title: "Teste das condições de envio",
        disclaimer: "Isto só verifica quais imagens estão no escopo. Não testa a conexão nem as credenciais.",
        store: (name: string) => `Armazenamento: ${name}`,
        scopeNote: "Imagens de uma nota",
        scopeVault: "Todas as imagens do cofre",
        note: (path: string) => `Nota: ${path}`,
        noNote: "Nenhuma nota selecionada.",
        changeNote: "Escolher nota",
        pickNote: "Escolha uma nota",
        search: "Pesquisar caminhos",
        allVerdicts: "Todos os resultados",
        verdict: {
            included: "Enviada",
            excluded: "Em uma pasta excluída",
            outOfScope: "Fora das pastas de destino",
            notFound: "Imagem não encontrada",
        },
        column: {
            path: "Imagem",
            verdict: "Resultado",
            reason: "Motivo",
            refs: "Links",
        },
        reason: {
            allFolders: "Todas as pastas estão no escopo.",
            inTarget: (folders: string) => `Está na pasta de destino ${folders}.`,
            noTarget: "Nenhuma pasta de destino foi selecionada.",
            notInTarget: "Não está dentro de nenhuma pasta de destino.",
            excluded: (folders: string) => `Está na pasta excluída ${folders}.`,
            excludedOverTarget: (excluded: string, target: string) =>
                `Está na pasta excluída ${excluded} e na pasta de destino ${target}; a exclusão tem prioridade.`,
            notFound: (link: string) => `Nenhum arquivo do cofre corresponde ao link ${link}.`,
        },
        count: (label: string, n: number) => `${label}: ${n}`,
        page: (current: number, total: number, shown: number) =>
            `Página ${current} de ${total} (${shown} ${shown === 1 ? "imagem" : "imagens"})`,
        prev: "Anterior",
        next: "Próxima",
        empty: "Nenhuma imagem para mostrar.",
        otherHeading: "Não afetadas pelas condições de pasta",
        webOn: (n: number, hosted: number) =>
            `Imagens da web: ${n}. Baixadas e enviadas ao publicar` + (hosted > 0 ? `, exceto ${hosted} que já estão neste armazenamento.` : "."),
        webOff: (n: number) => `Imagens da web: ${n}. Ficam como estão ("Enviar também as imagens da web" está desativado).`,
        mermaidOn: (n: number) => `Diagramas do Mermaid: ${n}. Convertidos em imagem e enviados ao publicar.`,
        mermaidOff: (n: number) => `Diagramas do Mermaid: ${n}. Ficam como código ("Converter diagramas do Mermaid em imagens" está desativado).`,
        readFailed: (message: string) => `Não foi possível ler a nota: ${message}`,
    },

    common: {
        bucketName: {
            name: "Nome do bucket",
            desc: "Nome do bucket onde as imagens são guardadas. Ele precisa existir antes.",
            placeholder: "Digite o nome do bucket",
        },
        targetPath: {
            name: "Caminho de destino",
            desc: "Onde cada imagem fica dentro do bucket. Aceita as variáveis {year} {mon} {day} {random} {filename} {foldername} {notename}. Por exemplo, com /{year}/{mon}/{day}/{filename}, pic.jpg é salvo como /2023/06/08/pic.jpg. {foldername} é a pasta em que a nota está e {notename} é o nome da própria nota, então img/{notename}/{filename} agrupa as imagens de cada nota. Para uma nota na raiz do cofre, {foldername} fica vazio e esse segmento é removido. Se ficar vazio, só o nome do arquivo é usado e arquivos com o mesmo nome podem se sobrescrever.",
            placeholder: "/{year}/{mon}/{day}/{filename}",
        },
        customDomain: {
            name: "Domínio personalizado",
            desc: "Domínio usado nos links escritos na nota, por exemplo quando há uma CDN na frente. Com cdn.example.com, o link fica https://cdn.example.com/caminho-de-destino. Se ficar vazio, é usada a URL do próprio armazenamento. Não muda para onde o arquivo é enviado.",
            placeholder: "cdn.example.com",
        },
    },

    imgur: {
        clientId: {
            name: "ID do cliente",
            placeholder: "Digite o ID do cliente",
        },
        descPrefix: "O valor inicial é um ID compartilhado por todos os usuários do plugin e pode atingir o limite de requisições. Gere o seu próprio ID do cliente em ",
    },

    gyazo: {
        accessToken: {
            name: "Token de acesso",
            placeholder: "Digite o token de acesso",
        },
        tokenDescPrefix: "Crie um aplicativo e gere um token de acesso em ",
        accessPolicy: {
            name: "Visibilidade",
            desc: "Quem pode ver as imagens enviadas. Com \"Só eu\", outras pessoas e sites externos não conseguem abrir a URL da imagem colada na nota. Se você vai compartilhar a nota, escolha \"Qualquer pessoa\".",
            options: {
                anyone: "Qualquer pessoa",
                onlyMe: "Só eu",
            },
        },
        commonDescription: {
            name: "Descrição comum",
            desc: "Adiciona a mesma descrição do Gyazo a todas as imagens enviadas, o que facilita encontrá-las depois na sua lista do Gyazo. Se ficar vazio, nenhuma descrição é adicionada.",
            placeholder: "Digite uma descrição comum (opcional)",
        },
    },

    oss: {
        region: {
            name: "Região",
            desc: "Região do data center onde o bucket foi criado. Se não for a mesma do bucket, o envio falha.",
        },
        accessKeyId: {
            name: "ID da chave de acesso",
            desc: "ID da chave de acesso gerado no Aliyun RAM.",
            placeholder: "Digite o ID da chave de acesso",
        },
        accessKeySecret: {
            name: "Segredo da chave de acesso",
            desc: "Texto secreto gerado junto com o ID da chave de acesso no Aliyun RAM. Só é exibido na criação.",
            placeholder: "Digite o segredo da chave de acesso",
        },
    },

    imagekit: {
        id: {
            name: "ImageKit ID",
            placeholder: "Digite o seu ImageKit ID",
        },
        descPrefix: "O ID e as chaves estão disponíveis em ",
        folder: {
            name: "Pasta",
            desc: "Pasta do ImageKit onde as imagens ficam. Se ficar vazio, elas vão para a raiz.",
            placeholder: "Digite o nome da pasta",
        },
        publicKey: {
            name: "Chave pública",
            placeholder: "Digite a sua chave pública",
        },
        privateKey: {
            name: "Chave privada",
            placeholder: "Digite a sua chave privada",
        },
    },

    s3: {
        accessKeyId: {
            name: "ID da chave de acesso do AWS S3",
            desc: "ID da chave de acesso do usuário do IAM (20 caracteres, começa com AKIA). Precisa da permissão PutObject no bucket.",
            placeholder: "AKIA...",
        },
        secretAccessKey: {
            name: "Chave de acesso secreta do AWS S3",
            desc: "Texto secreto gerado junto com o ID da chave de acesso. Só é exibido na criação; se você não o guardou, crie uma nova chave.",
            placeholder: "Digite a sua chave de acesso secreta",
        },
        region: {
            name: "Região do AWS S3",
            desc: "Região onde o bucket foi criado, por exemplo sa-east-1 (São Paulo). Se não for a mesma do bucket, o envio falha. Você pode conferir na lista de buckets do console da AWS.",
            placeholder: "sa-east-1",
        },
        bucketName: {
            name: "Nome do bucket do AWS S3",
            desc: "Nome do bucket do S3 onde as imagens são guardadas.",
            placeholder: "Digite o nome do bucket",
        },
        endpoint: {
            name: "Endpoint compatível com S3",
            desc: "Deixe vazio para o AWS S3. Informe aqui a URL de um serviço compatível com S3 (MinIO, DigitalOcean Spaces, Wasabi, Ceph) para usá-lo no lugar. As requisições passam a usar endereçamento no estilo de caminho, então o bucket vira o primeiro segmento do caminho da URL, e um domínio personalizado precisa apontar para o servidor, não para o bucket. Com um endpoint definido, a região só é usada para assinar as requisições e, se ficar vazia, é us-east-1.",
            placeholder: "https://minio.example.com",
        },
    },

    cos: {
        region: {
            name: "Região",
            desc: "Região do data center onde o bucket foi criado. Se não for a mesma do bucket, o envio falha.",
        },
        secretId: {
            name: "SecretId",
            desc: "SecretId gerado no gerenciamento de acesso da Tencent Cloud.",
            placeholder: "Digite o SecretId",
        },
        secretKey: {
            name: "SecretKey",
            desc: "Texto secreto gerado junto com o SecretId.",
            placeholder: "Digite a SecretKey",
        },
    },

    qiniu: {
        accessKey: {
            name: "Chave de acesso",
            desc: "Chave de acesso (AccessKey) do Qiniu.",
            placeholder: "Digite a chave de acesso",
        },
        secretKey: {
            name: "Chave secreta",
            desc: "Texto secreto gerado junto com a chave de acesso.",
            placeholder: "Digite a chave secreta",
        },
    },

    github: {
        repositoryName: {
            name: "Repositório",
            desc: "Repositório do GitHub onde as imagens ficam, no formato owner/repo. Se o repositório for público, os links podem ser abertos de qualquer lugar.",
            placeholder: "owner/repo",
        },
        branchName: {
            name: "Branch",
            desc: "Branch que recebe os commits. O padrão é main. Se o branch não existir, o envio falha.",
            placeholder: "main",
        },
        token: {
            name: "Token de acesso pessoal",
            placeholder: "Digite o seu token de acesso pessoal do GitHub",
        },
        tokenDescPrefix: "Sem o escopo 'repo' não é possível fazer commits. Gere um token de acesso pessoal com esse escopo em ",
    },

    r2: {
        accessKeyId: {
            name: "ID da chave de acesso do Cloudflare R2",
            desc: "ID da chave de acesso gerado como token de API do R2 na Cloudflare.",
            placeholder: "Digite o seu ID da chave de acesso",
        },
        secretAccessKey: {
            name: "Chave de acesso secreta do Cloudflare R2",
            desc: "Texto secreto gerado junto com o ID da chave de acesso. Só é exibido na criação.",
            placeholder: "Digite a sua chave de acesso secreta",
        },
        endpoint: {
            name: "Endpoint do Cloudflare R2",
            desc: "Endpoint compatível com S3 que recebe os envios. Copie o que aparece na página do bucket do R2, por exemplo https://account-id.r2.cloudflarestorage.com.",
            placeholder: "https://<account-id>.r2.cloudflarestorage.com",
        },
        bucketName: {
            name: "Nome do bucket do Cloudflare R2",
            desc: "Nome do bucket do R2 onde as imagens são guardadas.",
            placeholder: "Digite o nome do bucket",
        },
        customDomain: {
            name: "URL do R2.dev ou domínio personalizado",
            desc: "Obrigatório. Um bucket do R2 não pode ser lido pelo próprio endpoint, então o link escrito na nota precisa usar um nome de host público: a URL do R2.dev que você ativou (https://pub-xxxx.r2.dev) ou um domínio personalizado vinculado ao bucket. Enquanto estiver vazio, os envios falham com um erro.",
            placeholder: "pub-xxxx.r2.dev",
        },
    },

    b2: {
        accessKeyId: {
            name: "ID da chave de aplicativo do Backblaze B2",
            desc: "ID (keyID) da chave de aplicativo gerada no Backblaze B2.",
            placeholder: "Digite o ID da chave de aplicativo",
        },
        secretAccessKey: {
            name: "Chave de aplicativo do Backblaze B2",
            desc: "Texto secreto gerado junto com o keyID. Só é exibido na criação.",
            placeholder: "Digite a chave de aplicativo",
        },
        region: {
            name: "Região do Backblaze B2",
            desc: "Região do bucket, por exemplo us-west-004. É a parte entre s3. e .backblazeb2.com do endpoint exibido na página do bucket do B2.",
            placeholder: "us-west-004",
        },
        bucketName: {
            name: "Nome do bucket do Backblaze B2",
            desc: "Nome do bucket do B2 onde as imagens são guardadas. Se o bucket for privado, os links não abrem.",
            placeholder: "Digite o nome do bucket",
        },
        customDomain: {
            name: "Domínio personalizado",
            desc: "Domínio usado nos links escritos na nota, quando há uma CDN ou um domínio próprio na frente. Se ficar vazio, é usada a URL padrão do B2.",
            placeholder: "Digite um domínio personalizado (opcional)",
        },
    },

    modal: {
        title: "Enviando imagens",
        titleComplete: "Envio concluído",
        titlePartial: "Envio concluído com erros",
        titleFailed: "Falha no envio",
        uploading: "Enviando...",
        complete: "Concluído",
        failed: "Falhou",
        completedWithErrors: (failed: number) =>
            `Concluído com erros (${failed} ${failed === 1 ? "falha" : "falhas"})`,
        succeeded: (count: number) => count === 1 ? `${count} enviada` : `${count} enviadas`,
        failedCount: (count: number) => `${count} ${count === 1 ? "falha" : "falhas"}`,
        modeWebp: (quality: number) => `Conversão para WebP ativada (qualidade ${quality})`,
        modeWebpKeepOriginal: (quality: number) =>
            `Conversão para WebP ativada (qualidade ${quality}, originais mantidos)`,
        modeWebpSkipped: "Conversão para WebP ignorada nesta nota",
        modeHistory: "Histórico de envios ativado",
        reused: "reutilizada do histórico",
        reusedCount: (count: number) => `${count} do histórico`,
        sizeConverted: (from: string, to: string) => `${from} → ${to}`,
        compareConverted: (size: string) => `Convertida ${size}`,
        compareSaved: (size: string) => `Economia de ${size}`,
        compareOriginal: (size: string, delta: string) => `Original ${size} (${delta})`,
    },

    notice: {
        uploaderSetupFailed: "Falha ao configurar o envio de imagens. Verifique as configurações.",
        publishFailed: (message: string) => `Falha ao publicar: ${message}`,
        copiedToClipboard: "Copiado para a área de transferência",
        cannotLocate: (name: string, path: string) =>
            `Não foi possível encontrar ${name} em ${path}. Verifique o caminho da imagem ou a opção de anexos nas configurações do plugin.`,
        webImageUploadFailed: (path: string, message: string) =>
            `Falha ao enviar a imagem da web ${path}: ${message}`,
        uploadFailed: (path: string, message: string) =>
            `Falha ao enviar ${path}; o servidor retornou um erro: ${message}`,
        originalUploadFailed: (path: string, message: string) =>
            `O WebP de ${path} foi enviado, mas o arquivamento do original falhou: ${message}`,
        readFileFailed: (path: string) => `Falha ao ler o arquivo: ${path}`,
        filteredOut: (excluded: number, outOfScope: number) =>
            `Imagens mantidas locais pelas pastas de envio: ${excluded} em uma pasta excluída, ${outOfScope} fora das pastas de destino.`,
        mermaidRendering: (count: number) =>
            count === 1 ? `Convertendo ${count} diagrama do Mermaid...` : `Convertendo ${count} diagramas do Mermaid...`,
        mermaidInitFailed: (message: string) => `Falha ao inicializar o Mermaid: ${message}`,
        mermaidBlockFailed: (index: number, message: string) =>
            `Falha ao converter o bloco do Mermaid ${index}: ${message}`,
    },
};

export default ptBR;
