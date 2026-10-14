import type {Messages} from "./en";

/**
 * French messages. Typed as Messages, so a missing key is a compile error.
 *
 * Like ja.ts, descriptions say what changes when a setting is on or off rather
 * than translating the English literally. The user is addressed as "vous".
 * Descriptions are plain text, so no Markdown.
 */
const fr: Messages = {
    command: {
        publishPage: "Publier la page",
    },

    general: {
        altText: {
            name: "Nom d'image comme texte alternatif",
            desc: "Activé : le nom de fichier de l'image est placé entre les crochets du lien ('-' et '_' deviennent des espaces). Désactivé : les crochets restent vides. L'affichage ne change pas, seul le texte montré quand l'image ne se charge pas est différent.",
        },
        updateOriginalDoc: {
            name: "Modifier la note d'origine",
            desc: "Activé : les liens d'images de la note d'origine sont remplacés par les URL obtenues après l'envoi. Désactivé : la note d'origine reste intacte ; seul le texte modifié est copié dans le presse-papiers.",
        },
        ignoreProperties: {
            name: "Copier sans les propriétés",
            desc: "Activé : les propriétés (frontmatter) en tête de note sont retirées du texte copié dans le presse-papiers. Désactivé : elles sont copiées aussi. Dans les deux cas, la note d'origine conserve ses propriétés.",
        },
    },

    upload: {
        heading: "Envoi",
        progressModal: {
            name: "Afficher la progression",
            desc: "Activé : une fenêtre indique la réussite ou l'échec de chaque image (elle se ferme après 3 secondes si tout a réussi). Désactivé : une seule ligne dans la barre d'état en bas à droite.",
        },
        webImages: {
            name: "Rapatrier les images web",
            desc: "Activé : les images référencées par une URL http ou https sont téléchargées, renvoyées vers votre propre stockage, et les liens sont remplacés. Elles restent disponibles même si la source disparaît. Désactivé : les URL externes restent telles quelles. Les images déjà présentes sur votre stockage sont ignorées dans les deux cas.",
        },
    },

    webp: {
        heading: "Conversion WebP",
        enabled: {
            name: "Convertir les images en WebP",
            desc: "Activé : les images locales sont converties en WebP avant l'envoi, et la note pointe vers le fichier WebP. Les images web et les diagrammes Mermaid ne sont pas convertis. Désactivé : les images sont envoyées dans leur format d'origine.",
        },
        extensions: {
            name: "Extensions à convertir",
            desc: "Séparées par des virgules, sans le point. GIF et SVG sont exclus par défaut car la conversion passe par un canvas : un GIF animé ne garde que sa première image, et un SVG est rastérisé et perd sa netteté à l'agrandissement.",
            placeholder: "png, jpg, jpeg",
        },
        quality: {
            name: "Qualité",
            desc: "Qualité de compression WebP. Plus elle est basse, plus le fichier est petit et plus la perte est visible. Repères : environ 75 pour les photos, environ 90 pour les schémas avec du texte. Si le WebP est plus lourd que l'original, c'est l'original qui est envoyé.",
        },
        keepOriginal: {
            name: "Envoyer aussi l'original",
            desc: "Activé : le fichier original non modifié est envoyé en plus, comme copie d'archive. La note pointe toujours vers le WebP. Désactivé : seul le WebP est envoyé ; l'original n'est pas stocké.",
        },
        originalPath: {
            name: "Chemin des originaux",
            desc: "Emplacement des originaux archivés. Accepte les mêmes variables que le chemin cible. Choisissez un chemin différent du chemin cible pour ne pas mélanger WebP et originaux.",
            placeholder: "/originals/{year}/{mon}/{day}/{filename}",
        },
        originalPathUnsupported: "Ce service de stockage n'accepte pas de modèle de chemin : les originaux sont placés à côté des fichiers WebP. Leurs extensions diffèrent, rien n'est donc écrasé.",
        frontmatterProperty: {
            name: "Propriété par note",
            desc: "Nom de la propriété de note qui décide de la conversion pour une note donnée. true convertit cette note, false la laisse telle quelle. Laissez vide pour désactiver ce réglage par note.",
            placeholder: "webp",
        },
        frontmatterDefault: {
            name: "Par défaut sans propriété",
            desc: "S'applique aux notes qui ne définissent pas la propriété. Désactivé : seules les notes qui la mettent explicitement à true sont converties.",
        },
    },

    cache: {
        heading: "Historique des envois",
        enabled: {
            name: "Ne pas renvoyer les images inchangées",
            desc: "Activé : le contenu des fichiers déjà envoyés est mémorisé, et la même URL est réutilisée par la suite. Une image modifiée est renvoyée, de même après un changement de bucket ou de domaine. Désactivé : tout est envoyé à chaque publication.",
        },
        clear: {
            name: "Effacer l'historique des envois",
            desc: "Oublie tous les envois enregistrés : la prochaine publication renverra toutes les images. Les fichiers déjà envoyés ne sont pas supprimés. Utile quand une note pointe vers une URL qui ne fonctionne plus.",
            button: "Effacer",
        },
        entries: (count: number) => count <= 1 ? `${count} envoi enregistré` : `${count} envois enregistrés`,
        cleared: (count: number) => count <= 1 ? `${count} envoi enregistré effacé` : `${count} envois enregistrés effacés`,
    },

    mermaid: {
        heading: "Mermaid",
        convert: {
            name: "Convertir les diagrammes Mermaid",
            desc: "Activé : à la publication, les blocs de code Mermaid sont rendus en PNG, envoyés et remplacés par des liens d'image. Utile pour coller le texte là où Mermaid n'est pas pris en charge. Désactivé : les blocs de code restent tels quels.",
        },
        scale: {
            name: "Échelle Mermaid",
            desc: "Résolution des PNG exportés. À 2, l'image a deux fois plus de pixels que la taille d'affichage du diagramme. Plus la valeur est haute, plus l'image est nette et lourde. 2 convient aux écrans haute résolution.",
        },
        theme: {
            name: "Thème Mermaid",
            desc: "Palette des diagrammes exportés. Elle ne suit pas le thème d'Obsidian et reste celle choisie ici.",
            options: {
                default: "Par défaut",
                dark: "Sombre",
                forest: "Forêt",
                neutral: "Neutre",
                base: "Base",
            },
        },
    },

    network: {
        heading: "Réseau",
        mode: {
            name: "Proxy",
            desc: "Indique si les connexions vers Amazon S3, Cloudflare R2 et Backblaze B2 passent par un proxy. Ces trois services communiquent directement via le SDK AWS, sans passer par Obsidian : les réglages proxy de Windows ou macOS ne s'appliquent donc pas. Derrière un proxy d'entreprise, les envois expirent si ce réglage n'est pas fait. Les autres services ne sont pas concernés.",
            options: {
                auto: "Depuis les variables d'environnement",
                off: "Ne pas utiliser de proxy",
                manual: "Saisir l'URL manuellement",
            },
        },
        url: {
            name: "URL du proxy",
            desc: "Par exemple http://proxy.example.com:8080. Pour un proxy avec authentification : http://utilisateur:motdepasse@proxy.example.com:8080.",
            placeholder: "http://host:port",
        },
        detected: (url: string) => `Détecté dans les variables d'environnement, les envois passent par ce proxy : ${url}`,
        notDetected: "Aucune variable d'environnement HTTPS_PROXY / HTTP_PROXY trouvée. Les envois se connectent directement. Derrière un proxy, ils échoueront : choisissez alors « Saisir l'URL manuellement ».",
        manualActive: (url: string) => `Les envois passent par ce proxy : ${url}`,
        manualEmpty: "Le champ ci-dessous est vide. Les envois se connecteront donc directement, sans proxy.",
        disabled: "Les envois se connectent directement. Les variables d'environnement éventuelles sont ignorées.",
    },

    language: {
        name: "Langue",
        desc: "Langue de ces réglages et des notifications. « Automatique » suit la langue d'Obsidian. Le changement s'applique immédiatement.",
        options: {
            auto: "Automatique",
        },
    },

    imageStore: {
        heading: "Service de stockage",
        select: {
            name: "Service de stockage",
            desc: "Où envoyer les images. En changeant de service, les champs ci-dessous affichent les réglages du service choisi. Les réglages sont enregistrés séparément pour chaque service et ne sont pas perdus au changement.",
        },
    },

    filter: {
        heading: "Dossiers à envoyer",
        scope: {
            name: "Portée de l'envoi",
            desc: "Quelles images locales ce service de stockage reçoit. Les dossiers sont enregistrés séparément pour chaque service.",
            options: {
                all: "Tous les dossiers",
                selected: "Dossiers sélectionnés uniquement",
            },
        },
        hint: "Les sous-dossiers sont inclus. Les liens vers les images exclues restent tels quels.",
        include: {
            name: "Dossiers cibles",
            add: "Ajouter un dossier",
            empty: "Ajoutez un dossier cible. D'ici là, aucune image locale n'est envoyée vers ce service.",
        },
        exclude: {
            name: "Dossiers exclus",
            desc: "Les images de ces dossiers ne sont jamais envoyées, même à l'intérieur d'un dossier cible.",
            add: "Ajouter un dossier exclu",
            empty: "Aucun dossier exclu.",
        },
        remove: "Retirer",
        missing: "Dossier introuvable. Il a été supprimé ou déplacé pendant que le plugin était désactivé ; la condition est conservée jusqu'à ce que vous la retiriez.",
        pickFolder: "Choisir un dossier",
        test: {
            name: "Tester les conditions",
            desc: "Affiche les images qui seraient envoyées avec les conditions ci-dessus, sans rien envoyer.",
            button: "Tester",
        },
    },

    filterTest: {
        title: "Test des conditions d'envoi",
        disclaimer: "Seule la portée de l'envoi est vérifiée. La connexion et les identifiants ne sont pas testés.",
        store: (name: string) => `Service de stockage : ${name}`,
        scopeNote: "Images d'une note",
        scopeVault: "Toutes les images du coffre",
        note: (path: string) => `Note : ${path}`,
        noNote: "Aucune note sélectionnée.",
        changeNote: "Choisir la note",
        pickNote: "Choisir une note",
        search: "Rechercher un chemin",
        allVerdicts: "Tous les résultats",
        verdict: {
            included: "Envoyée",
            excluded: "Dans un dossier exclu",
            outOfScope: "Hors des dossiers cibles",
            notFound: "Image introuvable",
        },
        column: {
            path: "Image",
            verdict: "Résultat",
            reason: "Raison",
            refs: "Liens",
        },
        reason: {
            allFolders: "Tous les dossiers sont inclus.",
            inTarget: (folders: string) => `Dans le dossier cible ${folders}.`,
            noTarget: "Aucun dossier cible sélectionné.",
            notInTarget: "Dans aucun dossier cible.",
            excluded: (folders: string) => `Dans le dossier exclu ${folders}.`,
            excludedOverTarget: (excluded: string, target: string) =>
                `Dans le dossier exclu ${excluded} et le dossier cible ${target} ; l'exclusion l'emporte.`,
            notFound: (link: string) => `Aucun fichier du coffre ne correspond au lien ${link}.`,
        },
        count: (label: string, n: number) => `${label} : ${n}`,
        page: (current: number, total: number, shown: number) =>
            `Page ${current} sur ${total} (${shown} ${shown <= 1 ? "image" : "images"})`,
        prev: "Précédent",
        next: "Suivant",
        empty: "Aucune image à afficher.",
        otherHeading: "Non concernés par les conditions de dossier",
        webOn: (n: number, hosted: number) =>
            `Images web : ${n}. Téléchargées et envoyées à la publication` + (hosted > 0 ? `, sauf ${hosted} déjà sur ce service.` : "."),
        webOff: (n: number) => `Images web : ${n}. Laissées telles quelles (« Rapatrier les images web » est désactivé).`,
        mermaidOn: (n: number) => `Diagrammes Mermaid : ${n}. Rendus et envoyés à la publication.`,
        mermaidOff: (n: number) => `Diagrammes Mermaid : ${n}. Laissés sous forme de code (« Convertir les diagrammes Mermaid » est désactivé).`,
        readFailed: (message: string) => `Impossible de lire la note : ${message}`,
    },

    common: {
        bucketName: {
            name: "Nom du bucket",
            desc: "Nom du bucket qui stocke les images. Il doit déjà exister.",
            placeholder: "Saisir le nom du bucket",
        },
        targetPath: {
            name: "Chemin cible",
            desc: "Emplacement des images dans le bucket. Variables disponibles : {year} {mon} {day} {random} {filename} {foldername} {notename}. Par exemple, avec /{year}/{mon}/{day}/{filename}, pic.jpg est stocké sous /2026/08/24/pic.jpg. {foldername} est le dossier de la note et {notename} la note elle-même : img/{notename}/{filename} regroupe les images de chaque note. Pour une note à la racine du coffre, {foldername} est vide et le segment disparaît. Si le champ est vide, seul le nom de fichier est utilisé et des fichiers homonymes peuvent s'écraser.",
            placeholder: "/{year}/{mon}/{day}/{filename}",
        },
        customDomain: {
            name: "Domaine public",
            desc: "Partie domaine des liens écrits dans la note, par exemple avec un CDN comme CloudFront en amont. Avec cdn.example.com, les liens deviennent https://cdn.example.com/<chemin cible>. Laissez vide pour utiliser l'URL d'origine du stockage. L'emplacement d'envoi ne change pas.",
            placeholder: "cdn.example.com",
        },
    },

    imgur: {
        clientId: {
            name: "Client ID",
            placeholder: "Saisir le Client ID",
        },
        descPrefix: "La valeur par défaut est un ID partagé par tous les utilisateurs du plugin, vite limité en cas d'envois nombreux. Créez votre propre Client ID ici : ",
    },

    gyazo: {
        accessToken: {
            name: "Jeton d'accès",
            placeholder: "Saisir le jeton d'accès",
        },
        tokenDescPrefix: "Créez une application et générez un jeton d'accès sur Gyazo : ",
        accessPolicy: {
            name: "Visibilité",
            desc: "Qui peut voir les images envoyées. Avec « Moi uniquement », les URL collées dans la note ne s'ouvrent pas pour d'autres personnes ni depuis des sites externes. Pour une note partagée, choisissez « Tout le monde ».",
            options: {
                anyone: "Tout le monde",
                onlyMe: "Moi uniquement",
            },
        },
        commonDescription: {
            name: "Description commune",
            desc: "Description identique ajoutée à chaque image envoyée, pour les retrouver plus facilement dans Gyazo. Laissez vide pour ne pas en ajouter.",
            placeholder: "Saisir une description commune (facultatif)",
        },
    },

    oss: {
        region: {
            name: "Région",
            desc: "Centre de données où le bucket a été créé. S'il ne correspond pas au bucket, l'envoi échoue. Le point de terminaison suit la région choisie.",
        },
        accessKeyId: {
            name: "ID de clé d'accès",
            desc: "AccessKey ID créé dans Aliyun RAM.",
            placeholder: "Saisir l'ID de clé d'accès",
        },
        accessKeySecret: {
            name: "Secret de clé d'accès",
            desc: "Chaîne secrète générée avec l'AccessKey ID. Elle n'est affichée qu'à la création.",
            placeholder: "Saisir le secret de clé d'accès",
        },
    },

    imagekit: {
        id: {
            name: "ImageKit ID",
            placeholder: "Saisir votre ImageKit ID",
        },
        descPrefix: "L'ID et les clés se trouvent dans le tableau de bord : ",
        folder: {
            name: "Dossier",
            desc: "Dossier d'ImageKit où placer les images. Laissez vide pour envoyer à la racine.",
            placeholder: "Saisir le nom du dossier",
        },
        publicKey: {
            name: "Clé publique",
            placeholder: "Saisir votre clé publique",
        },
        privateKey: {
            name: "Clé privée",
            placeholder: "Saisir votre clé privée",
        },
    },

    s3: {
        accessKeyId: {
            name: "ID de clé d'accès",
            desc: "ID de clé d'accès d'un utilisateur IAM : 20 caractères commençant par AKIA. Nécessite l'autorisation PutObject sur le bucket.",
            placeholder: "AKIA...",
        },
        secretAccessKey: {
            name: "Clé d'accès secrète",
            desc: "Chaîne secrète générée avec l'ID de clé d'accès. Elle n'est affichée qu'à la création ; si vous ne l'avez pas notée, créez-en une nouvelle.",
            placeholder: "Saisir votre clé d'accès secrète",
        },
        region: {
            name: "Région",
            desc: "Région où le bucket a été créé, par exemple eu-west-3 (Paris). Si elle ne correspond pas au bucket, l'envoi échoue. Elle figure dans la liste des buckets de la console AWS.",
            placeholder: "eu-west-3",
        },
        bucketName: {
            name: "Nom du bucket",
            desc: "Nom du bucket S3 qui stocke les images.",
            placeholder: "Saisir le nom du bucket",
        },
        endpoint: {
            name: "Point de terminaison S3",
            desc: "Laissez vide pour AWS S3. Pour un service compatible S3 comme MinIO, DigitalOcean Spaces, Wasabi ou Ceph, saisissez son URL. L'adressage se fait alors par chemin : le bucket devient le premier segment du chemin de l'URL, et un domaine personnalisé doit pointer vers le serveur plutôt que vers le bucket. La région ne sert alors qu'à signer les requêtes ; vide, elle vaut us-east-1.",
            placeholder: "https://minio.example.com",
        },
    },

    cos: {
        region: {
            name: "Région",
            desc: "Centre de données où le bucket a été créé. S'il ne correspond pas au bucket, l'envoi échoue.",
        },
        secretId: {
            name: "Secret ID",
            desc: "SecretId créé dans la gestion des accès de Tencent Cloud.",
            placeholder: "Saisir le Secret ID",
        },
        secretKey: {
            name: "Secret Key",
            desc: "Chaîne secrète générée avec le SecretId.",
            placeholder: "Saisir la Secret Key",
        },
    },

    qiniu: {
        accessKey: {
            name: "Access Key",
            desc: "Access Key de Qiniu.",
            placeholder: "Saisir l'Access Key",
        },
        secretKey: {
            name: "Secret Key",
            desc: "Chaîne secrète générée avec l'Access Key.",
            placeholder: "Saisir la Secret Key",
        },
    },

    github: {
        repositoryName: {
            name: "Dépôt",
            desc: "Dépôt qui accueille les images, au format owner/repo, par exemple octocat/my-images. Avec un dépôt public, les liens sont accessibles directement depuis l'extérieur.",
            placeholder: "owner/repo",
        },
        branchName: {
            name: "Branche",
            desc: "Branche dans laquelle les commits sont faits. Par défaut : main. Une branche inexistante fait échouer l'envoi.",
            placeholder: "main",
        },
        token: {
            name: "Jeton d'accès personnel",
            placeholder: "Saisir ghp_...",
        },
        tokenDescPrefix: "Sans jeton doté du scope 'repo', aucun commit n'est possible. Créez-en un ici : ",
    },

    r2: {
        accessKeyId: {
            name: "ID de clé d'accès",
            desc: "ID de clé d'accès créé comme jeton d'API R2 dans Cloudflare.",
            placeholder: "Saisir l'ID de clé d'accès",
        },
        secretAccessKey: {
            name: "Clé d'accès secrète",
            desc: "Chaîne secrète générée avec l'ID de clé d'accès. Elle n'est affichée qu'à la création.",
            placeholder: "Saisir la clé d'accès secrète",
        },
        endpoint: {
            name: "Point de terminaison",
            desc: "Point de terminaison compatible S3 pour l'envoi. Copiez tel quel le https://<account-id>.r2.cloudflarestorage.com affiché sur la page du bucket R2.",
            placeholder: "https://<account-id>.r2.cloudflarestorage.com",
        },
        bucketName: {
            name: "Nom du bucket",
            desc: "Nom du bucket R2 qui stocke les images.",
            placeholder: "Saisir le nom du bucket",
        },
        customDomain: {
            name: "Domaine public",
            desc: "Obligatoire. Partie domaine des liens écrits dans la note : l'URL R2.dev activée (https://pub-xxxx.r2.dev) ou un domaine personnalisé associé au bucket. Le point de terminaison R2 n'est pas lisible publiquement, donc les envois échouent tant que ce champ est vide.",
            placeholder: "pub-xxxx.r2.dev",
        },
    },

    b2: {
        accessKeyId: {
            name: "ID de clé d'application",
            desc: "ID (keyID) de la clé d'application créée dans Backblaze B2.",
            placeholder: "Saisir l'ID de clé d'application",
        },
        secretAccessKey: {
            name: "Clé d'application",
            desc: "Chaîne secrète générée avec le keyID. Elle n'est affichée qu'à la création.",
            placeholder: "Saisir la clé d'application",
        },
        region: {
            name: "Région",
            desc: "Région du bucket, par exemple us-west-004. C'est la partie entre s3. et .backblazeb2.com dans le point de terminaison affiché sur la page du bucket B2.",
            placeholder: "us-west-004",
        },
        bucketName: {
            name: "Nom du bucket",
            desc: "Nom du bucket B2 qui stocke les images. Avec un bucket privé, les liens ne s'ouvrent pas.",
            placeholder: "Saisir le nom du bucket",
        },
        customDomain: {
            name: "Domaine public",
            desc: "Partie domaine des liens écrits dans la note, par exemple avec un CDN ou un domaine personnalisé en amont. Laissez vide pour utiliser l'URL d'origine de B2.",
            placeholder: "Saisir un domaine personnalisé (facultatif)",
        },
    },

    modal: {
        title: "Envoi des images",
        titleComplete: "Envoi terminé",
        titlePartial: "Envoi terminé avec des erreurs",
        titleFailed: "Échec de l'envoi",
        uploading: "Envoi en cours...",
        complete: "Terminé",
        failed: "Échec",
        completedWithErrors: (failed: number) =>
            `Terminé avec des erreurs (${failed} ${failed <= 1 ? "échec" : "échecs"})`,
        succeeded: (count: number) => count <= 1 ? `${count} réussi` : `${count} réussis`,
        failedCount: (count: number) => count <= 1 ? `${count} échec` : `${count} échecs`,
        modeWebp: (quality: number) => `Conversion WebP activée (qualité ${quality})`,
        modeWebpKeepOriginal: (quality: number) =>
            `Conversion WebP activée (qualité ${quality}, originaux conservés)`,
        modeWebpSkipped: "Conversion WebP ignorée pour cette note",
        modeHistory: "Historique des envois activé",
        reused: "réutilisé depuis l'historique",
        reusedCount: (count: number) => `${count} depuis l'historique`,
        sizeConverted: (from: string, to: string) => `${from} → ${to}`,
        compareConverted: (size: string) => `Converti ${size}`,
        compareSaved: (size: string) => `Économisé ${size}`,
        compareOriginal: (size: string, delta: string) => `Original ${size} (${delta})`,
    },

    notice: {
        uploaderSetupFailed: "Échec de l'initialisation de l'envoi. Vérifiez les réglages.",
        publishFailed: (message: string) => `Échec de la publication : ${message}`,
        copiedToClipboard: "Copié dans le presse-papiers",
        cannotLocate: (name: string, path: string) =>
            `Impossible de trouver ${name} à l'emplacement ${path}. Vérifiez le chemin de l'image ou les réglages des pièces jointes.`,
        webImageUploadFailed: (path: string, message: string) =>
            `Échec de l'envoi de l'image web ${path} : ${message}`,
        uploadFailed: (path: string, message: string) =>
            `Échec de l'envoi de ${path}. Réponse du serveur : ${message}`,
        originalUploadFailed: (path: string, message: string) =>
            `Le WebP de ${path} a été envoyé, mais l'archivage de l'original a échoué : ${message}`,
        readFileFailed: (path: string) => `Impossible de lire le fichier : ${path}`,
        filteredOut: (excluded: number, outOfScope: number) =>
            `Images laissées en local à cause des conditions de dossier : ${excluded} dans un dossier exclu, ${outOfScope} hors des dossiers cibles.`,
        mermaidRendering: (count: number) =>
            count <= 1 ? `Rendu de ${count} diagramme Mermaid...` : `Rendu de ${count} diagrammes Mermaid...`,
        mermaidInitFailed: (message: string) => `Échec de l'initialisation de Mermaid : ${message}`,
        mermaidBlockFailed: (index: number, message: string) =>
            `Impossible de rendre le bloc Mermaid ${index} : ${message}`,
    },
};

export default fr;
