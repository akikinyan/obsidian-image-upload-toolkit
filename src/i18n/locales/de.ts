import type {Messages} from "./en";

/**
 * German messages. Typed as Messages, so a missing key is a compile error.
 *
 * Like ja.ts, descriptions say what changes when a setting is on or off rather
 * than translating the English literally. Neutral or imperative phrasing is
 * preferred; "Sie" is used where addressing the user is unavoidable.
 * Descriptions are plain text, so no Markdown.
 */
const de: Messages = {
    command: {
        publishPage: "Seite veröffentlichen",
    },

    general: {
        altText: {
            name: "Bildname als Alternativtext",
            desc: "An: Der Dateiname des Bildes steht in den eckigen Klammern des Links ('-' und '_' werden zu Leerzeichen). Aus: Die eckigen Klammern bleiben leer. Die Anzeige ändert sich nicht, nur der Text, der erscheint, wenn das Bild nicht geladen werden kann.",
        },
        updateOriginalDoc: {
            name: "Originalnotiz ändern",
            desc: "An: Die Bildlinks in der Originalnotiz werden durch die URLs nach dem Hochladen ersetzt. Aus: Die Originalnotiz bleibt unverändert; nur der geänderte Text wird in die Zwischenablage kopiert.",
        },
        ignoreProperties: {
            name: "Ohne Eigenschaften kopieren",
            desc: "An: Die Eigenschaften (Frontmatter) am Anfang der Notiz werden aus dem kopierten Text entfernt. Aus: Die Eigenschaften werden mitkopiert. In beiden Fällen bleiben die Eigenschaften in der Originalnotiz erhalten.",
        },
    },

    upload: {
        heading: "Hochladen",
        progressModal: {
            name: "Fortschritt im Dialog anzeigen",
            desc: "An: Ein Dialog zeigt Erfolg oder Fehler für jedes Bild (schließt sich nach 3 Sekunden, wenn alles erfolgreich war). Aus: Nur eine kurze Zeile in der Statusleiste unten rechts.",
        },
        webImages: {
            name: "Webbilder übernehmen",
            desc: "An: Bilder, auf die die Notiz per http- oder https-URL verweist, werden heruntergeladen, in den eigenen Speicher hochgeladen und die Links ersetzt. So bleiben sie erhalten, auch wenn die Quelle verschwindet. Aus: Externe URLs bleiben unverändert. Bilder, die bereits im eigenen Speicher liegen, werden in beiden Fällen übersprungen.",
        },
    },

    webp: {
        heading: "WebP-Konvertierung",
        enabled: {
            name: "Bilder in WebP umwandeln",
            desc: "An: Lokale Bilder werden vor dem Hochladen in WebP umgewandelt, und die Notiz verlinkt die WebP-Datei. Webbilder und Mermaid-Diagramme werden nicht umgewandelt. Aus: Bilder werden im Originalformat hochgeladen.",
        },
        extensions: {
            name: "Umzuwandelnde Endungen",
            desc: "Kommagetrennt, ohne Punkt. GIF und SVG sind standardmäßig ausgenommen, weil die Umwandlung über ein Canvas läuft: Von animierten GIFs bleibt nur das erste Bild, und SVGs werden gerastert und verlieren ihre Skalierbarkeit.",
            placeholder: "png, jpg, jpeg",
        },
        quality: {
            name: "Qualität",
            desc: "Kompressionsqualität für WebP. Niedrigere Werte ergeben kleinere Dateien mit stärkeren Verlusten. Richtwerte: etwa 75 für Fotos, etwa 90 für Grafiken mit Text. Ist die WebP-Datei größer als das Original, wird automatisch das Original hochgeladen.",
        },
        keepOriginal: {
            name: "Original zusätzlich hochladen",
            desc: "An: Die unveränderte Originaldatei wird als Archivkopie mit hochgeladen. Die Notiz verlinkt weiterhin die WebP-Datei. Aus: Nur die WebP-Datei wird hochgeladen; das Original landet nicht im Speicher.",
        },
        originalPath: {
            name: "Pfad für Originale",
            desc: "Ablageort der archivierten Originale. Es gelten dieselben Variablen wie beim Zielpfad. Einen anderen Pfad als den Zielpfad wählen, damit WebP-Dateien und Originale nicht vermischt werden.",
            placeholder: "/originals/{year}/{mon}/{day}/{filename}",
        },
        originalPathUnsupported: "Dieser Speicherdienst unterstützt keine Pfadvorlage, daher liegen die Originale neben den WebP-Dateien. Da die Endungen verschieden sind, wird nichts überschrieben.",
        frontmatterProperty: {
            name: "Eigenschaft pro Notiz",
            desc: "Name der Notiz-Eigenschaft, die die Umwandlung für eine einzelne Notiz steuert. true wandelt diese Notiz um, false lässt sie unverändert. Leer lassen, um die Steuerung pro Notiz zu deaktivieren.",
            placeholder: "webp",
        },
        frontmatterDefault: {
            name: "Standard ohne Eigenschaft",
            desc: "Gilt für Notizen, die die Eigenschaft nicht setzen. Aus: Nur Notizen, die die Eigenschaft ausdrücklich auf true setzen, werden umgewandelt.",
        },
    },

    cache: {
        heading: "Upload-Verlauf",
        enabled: {
            name: "Unveränderte Bilder nicht erneut hochladen",
            desc: "An: Bereits hochgeladene Dateiinhalte werden gespeichert, und beim nächsten Mal wird dieselbe URL wiederverwendet. Ein bearbeitetes Bild wird erneut hochgeladen, ebenso nach einem Wechsel von Bucket oder Domain. Aus: Bei jedem Veröffentlichen wird alles hochgeladen.",
        },
        clear: {
            name: "Upload-Verlauf löschen",
            desc: "Verwirft alle Einträge, sodass beim nächsten Veröffentlichen alle Bilder erneut hochgeladen werden. Bereits hochgeladene Dateien werden nicht gelöscht. Hilfreich, wenn ein Link in einer Notiz nicht mehr funktioniert.",
            button: "Löschen",
        },
        entries: (count: number) => count === 1 ? "1 Eintrag gespeichert" : `${count} Einträge gespeichert`,
        cleared: (count: number) => count === 1 ? "1 Eintrag aus dem Upload-Verlauf gelöscht" : `${count} Einträge aus dem Upload-Verlauf gelöscht`,
    },

    mermaid: {
        heading: "Mermaid",
        convert: {
            name: "Mermaid-Diagramme als Bilder",
            desc: "An: Beim Veröffentlichen werden Mermaid-Codeblöcke als PNG gerendert, hochgeladen und durch Bildlinks ersetzt. Nützlich für Ziele, die Mermaid nicht unterstützen. Aus: Die Codeblöcke bleiben erhalten.",
        },
        scale: {
            name: "Mermaid-Skalierung",
            desc: "Auflösung der exportierten PNGs. Bei 2 wird mit doppelt so vielen Pixeln wie die Anzeigegröße exportiert. Höhere Werte sind schärfer, aber größer. Für hochauflösende Bildschirme ist 2 ein guter Richtwert.",
        },
        theme: {
            name: "Mermaid-Design",
            desc: "Farbschema der exportierten Diagramme. Es folgt nicht dem Obsidian-Design, sondern bleibt fest auf dem hier gewählten Schema.",
            options: {
                default: "Standard",
                dark: "Dunkel",
                forest: "Wald",
                neutral: "Neutral",
                base: "Basis",
            },
        },
    },

    network: {
        heading: "Netzwerk",
        mode: {
            name: "Proxy",
            desc: "Ob Verbindungen zu Amazon S3, Cloudflare R2 und Backblaze B2 über einen Proxy laufen. Nur diese drei kommunizieren direkt über das AWS SDK statt über Obsidian, daher greifen die Proxy-Einstellungen von Windows oder macOS nicht. Hinter einem Firmen-Proxy laufen Uploads ohne diese Einstellung in eine Zeitüberschreitung. Andere Speicherdienste sind nicht betroffen.",
            options: {
                auto: "Aus Umgebungsvariablen",
                off: "Keinen Proxy verwenden",
                manual: "URL manuell eingeben",
            },
        },
        url: {
            name: "Proxy-URL",
            desc: "Beispiel: http://proxy.example.com:8080. Für Proxys mit Anmeldung: http://benutzer:passwort@proxy.example.com:8080.",
            placeholder: "http://host:port",
        },
        detected: (url: string) => `Aus Umgebungsvariablen erkannt, Uploads laufen über diesen Proxy: ${url}`,
        notDetected: "Keine Umgebungsvariable HTTPS_PROXY / HTTP_PROXY gefunden. Uploads verbinden sich direkt. Hinter einem Proxy schlägt das fehl; wechseln Sie dann zu „URL manuell eingeben“.",
        manualActive: (url: string) => `Uploads laufen über diesen Proxy: ${url}`,
        manualEmpty: "Das Feld unten ist leer. So verbinden sich Uploads direkt ohne Proxy.",
        disabled: "Uploads verbinden sich direkt. Gesetzte Umgebungsvariablen werden ignoriert.",
    },

    language: {
        name: "Sprache",
        desc: "Sprache dieser Einstellungen und der Benachrichtigungen. „Automatisch“ folgt der Spracheinstellung von Obsidian. Änderungen wirken sofort.",
        options: {
            auto: "Automatisch",
        },
    },

    imageStore: {
        heading: "Speicherdienst",
        select: {
            name: "Speicherdienst",
            desc: "Wohin die Bilder hochgeladen werden. Beim Wechsel zeigen die Felder darunter die Einstellungen des gewählten Dienstes. Die Einstellungen werden pro Dienst gespeichert und gehen beim Wechsel nicht verloren.",
        },
    },

    filter: {
        heading: "Hochzuladende Ordner",
        scope: {
            name: "Upload-Bereich",
            desc: "Welche lokalen Bilder an diesen Speicherdienst gehen. Die Ordnerauswahl wird pro Speicherdienst gespeichert.",
            options: {
                all: "Alle Ordner",
                selected: "Nur ausgewählte Ordner",
            },
        },
        hint: "Unterordner sind eingeschlossen. Links zu ausgeschlossenen Bildern bleiben unverändert.",
        include: {
            name: "Zielordner",
            add: "Ordner hinzufügen",
            empty: "Bitte einen Zielordner hinzufügen. Bis dahin wird kein lokales Bild an diesen Speicherdienst hochgeladen.",
        },
        exclude: {
            name: "Ausgeschlossene Ordner",
            desc: "Bilder in diesen Ordnern werden nie hochgeladen, auch nicht innerhalb eines Zielordners.",
            add: "Ausgeschlossenen Ordner hinzufügen",
            empty: "Keine ausgeschlossenen Ordner.",
        },
        remove: "Entfernen",
        missing: "Ordner nicht gefunden. Er wurde gelöscht oder verschoben, während das Plugin deaktiviert war. Die Bedingung bleibt bestehen, bis sie entfernt wird.",
        pickFolder: "Ordner auswählen",
        test: {
            name: "Bedingungen testen",
            desc: "Zeigt, welche Bilder mit den obigen Bedingungen hochgeladen würden. Es wird nichts hochgeladen.",
            button: "Testen",
        },
    },

    filterTest: {
        title: "Upload-Bedingungen testen",
        disclaimer: "Geprüft wird nur, welche Bilder im Upload-Bereich liegen. Verbindung und Zugangsdaten werden nicht getestet.",
        store: (name: string) => `Speicherdienst: ${name}`,
        scopeNote: "Bilder in einer Notiz",
        scopeVault: "Alle Bilder im Tresor",
        note: (path: string) => `Notiz: ${path}`,
        noNote: "Keine Notiz ausgewählt.",
        changeNote: "Notiz wählen",
        pickNote: "Notiz auswählen",
        search: "Pfade durchsuchen",
        allVerdicts: "Alle Ergebnisse",
        verdict: {
            included: "Wird hochgeladen",
            excluded: "In ausgeschlossenem Ordner",
            outOfScope: "Nicht in einem Zielordner",
            notFound: "Bild nicht gefunden",
        },
        column: {
            path: "Bild",
            verdict: "Ergebnis",
            reason: "Grund",
            refs: "Links",
        },
        reason: {
            allFolders: "Alle Ordner sind eingeschlossen.",
            inTarget: (folders: string) => `Im Zielordner ${folders}.`,
            noTarget: "Kein Zielordner ausgewählt.",
            notInTarget: "In keinem Zielordner.",
            excluded: (folders: string) => `Im ausgeschlossenen Ordner ${folders}.`,
            excludedOverTarget: (excluded: string, target: string) =>
                `Im ausgeschlossenen Ordner ${excluded} und im Zielordner ${target}; der Ausschluss hat Vorrang.`,
            notFound: (link: string) => `Keine Datei im Tresor passt zum Link ${link}.`,
        },
        count: (label: string, n: number) => `${label}: ${n}`,
        page: (current: number, total: number, shown: number) =>
            `Seite ${current} von ${total} (${shown} ${shown === 1 ? "Bild" : "Bilder"})`,
        prev: "Zurück",
        next: "Weiter",
        empty: "Keine Bilder anzuzeigen.",
        otherHeading: "Nicht von Ordnerbedingungen betroffen",
        webOn: (n: number, hosted: number) =>
            `Webbilder: ${n}. Werden beim Veröffentlichen heruntergeladen und hochgeladen` + (hosted > 0 ? `, außer ${hosted} bereits auf diesem Speicherdienst.` : "."),
        webOff: (n: number) => `Webbilder: ${n}. Bleiben unverändert („Webbilder übernehmen“ ist aus).`,
        mermaidOn: (n: number) => `Mermaid-Diagramme: ${n}. Werden beim Veröffentlichen gerendert und hochgeladen.`,
        mermaidOff: (n: number) => `Mermaid-Diagramme: ${n}. Bleiben als Code („Mermaid-Diagramme als Bilder“ ist aus).`,
        readFailed: (message: string) => `Notiz konnte nicht gelesen werden: ${message}`,
    },

    common: {
        bucketName: {
            name: "Bucket-Name",
            desc: "Name des Buckets, in dem die Bilder gespeichert werden. Der Bucket muss bereits existieren.",
            placeholder: "Bucket-Name eingeben",
        },
        targetPath: {
            name: "Zielpfad",
            desc: "Wo im Bucket die Bilder abgelegt werden. Verfügbare Variablen: {year} {mon} {day} {random} {filename} {foldername} {notename}. Beispiel: Mit /{year}/{mon}/{day}/{filename} wird pic.jpg als /2026/08/24/pic.jpg gespeichert. {foldername} ist der Ordner der Notiz und {notename} die Notiz selbst; mit img/{notename}/{filename} liegen die Bilder einer Notiz zusammen. Bei Notizen im Stammverzeichnis des Tresors ist {foldername} leer und der Abschnitt entfällt. Ist das Feld leer, wird nur der Dateiname verwendet, und gleichnamige Dateien können sich überschreiben.",
            placeholder: "/{year}/{mon}/{day}/{filename}",
        },
        customDomain: {
            name: "Öffentliche Domain",
            desc: "Domain-Teil der Links, die in die Notiz geschrieben werden, etwa wenn ein CDN wie CloudFront vorgeschaltet ist. Mit cdn.example.com lauten die Links https://cdn.example.com/<Zielpfad>. Leer lassen, um die Standard-URL des Speichers zu verwenden. Der Upload-Ort ändert sich nicht.",
            placeholder: "cdn.example.com",
        },
    },

    imgur: {
        clientId: {
            name: "Client-ID",
            placeholder: "Client-ID eingeben",
        },
        descPrefix: "Voreingestellt ist eine vom Plugin gemeinsam genutzte ID, die bei vielen Uploads an ihr Limit stößt. Eine eigene Client-ID lässt sich hier erstellen: ",
    },

    gyazo: {
        accessToken: {
            name: "Zugriffstoken",
            placeholder: "Zugriffstoken eingeben",
        },
        tokenDescPrefix: "Erstellen Sie eine Anwendung und ein Zugriffstoken bei Gyazo: ",
        accessPolicy: {
            name: "Sichtbarkeit",
            desc: "Wer die hochgeladenen Bilder sehen kann. Bei „Nur ich“ lassen sich die URLs in der Notiz von anderen Personen oder externen Seiten nicht öffnen. Für geteilte Notizen „Alle“ wählen.",
            options: {
                anyone: "Alle",
                onlyMe: "Nur ich",
            },
        },
        commonDescription: {
            name: "Gemeinsame Beschreibung",
            desc: "Feste Beschreibung für jedes hochgeladene Bild, damit es sich in Gyazo später leichter finden lässt. Leer lassen, um keine Beschreibung zu setzen.",
            placeholder: "Gemeinsame Beschreibung eingeben (optional)",
        },
    },

    oss: {
        region: {
            name: "Region",
            desc: "Rechenzentrum, in dem der Bucket angelegt wurde. Stimmt es nicht mit dem Bucket überein, schlägt der Upload fehl. Der Endpunkt wird passend zur Auswahl gesetzt.",
        },
        accessKeyId: {
            name: "Zugriffsschlüssel-ID",
            desc: "In Aliyun RAM erstellte AccessKey-ID.",
            placeholder: "Zugriffsschlüssel-ID eingeben",
        },
        accessKeySecret: {
            name: "Zugriffsschlüssel-Secret",
            desc: "Geheime Zeichenfolge, die zusammen mit der AccessKey-ID erstellt wird. Sie wird nur bei der Erstellung angezeigt.",
            placeholder: "Zugriffsschlüssel-Secret eingeben",
        },
    },

    imagekit: {
        id: {
            name: "ImageKit ID",
            placeholder: "ImageKit ID eingeben",
        },
        descPrefix: "ID und Schlüssel stehen im Dashboard: ",
        folder: {
            name: "Ordner",
            desc: "Ordner in ImageKit, in dem die Bilder abgelegt werden. Leer lassen, um ins Stammverzeichnis hochzuladen.",
            placeholder: "Ordnername eingeben",
        },
        publicKey: {
            name: "Öffentlicher Schlüssel",
            placeholder: "Öffentlichen Schlüssel eingeben",
        },
        privateKey: {
            name: "Privater Schlüssel",
            placeholder: "Privaten Schlüssel eingeben",
        },
    },

    s3: {
        accessKeyId: {
            name: "Zugriffsschlüssel-ID",
            desc: "Zugriffsschlüssel-ID eines IAM-Benutzers, 20 Zeichen, beginnt mit AKIA. Benötigt die Berechtigung PutObject für den Bucket.",
            placeholder: "AKIA...",
        },
        secretAccessKey: {
            name: "Geheimer Zugriffsschlüssel",
            desc: "Geheime Zeichenfolge, die zusammen mit der Zugriffsschlüssel-ID erstellt wird. Sie wird nur bei der Erstellung angezeigt; falls nicht notiert, einen neuen Schlüssel erstellen.",
            placeholder: "Geheimen Zugriffsschlüssel eingeben",
        },
        region: {
            name: "Region",
            desc: "Region, in der der Bucket angelegt wurde, z. B. eu-central-1 (Frankfurt). Stimmt sie nicht mit dem Bucket überein, schlägt der Upload fehl. Sie steht in der Bucket-Liste der AWS-Konsole.",
            placeholder: "eu-central-1",
        },
        bucketName: {
            name: "Bucket-Name",
            desc: "Name des S3-Buckets, in dem die Bilder gespeichert werden.",
            placeholder: "Bucket-Name eingeben",
        },
        endpoint: {
            name: "S3-kompatibler Endpunkt",
            desc: "Für AWS S3 leer lassen. Für einen S3-kompatiblen Dienst wie MinIO, DigitalOcean Spaces, Wasabi oder Ceph dessen URL eintragen. Dann wird Pfad-Adressierung verwendet: Der Bucket wird zum ersten Pfadabschnitt der URL, und eine eigene Domain muss auf den Server statt auf den Bucket zeigen. Die Region dient dann nur zum Signieren der Anfragen; leer bedeutet us-east-1.",
            placeholder: "https://minio.example.com",
        },
    },

    cos: {
        region: {
            name: "Region",
            desc: "Rechenzentrum, in dem der Bucket angelegt wurde. Stimmt es nicht mit dem Bucket überein, schlägt der Upload fehl.",
        },
        secretId: {
            name: "Secret ID",
            desc: "In der Zugriffsverwaltung von Tencent Cloud erstellte SecretId.",
            placeholder: "Secret ID eingeben",
        },
        secretKey: {
            name: "Secret Key",
            desc: "Geheime Zeichenfolge, die zusammen mit der SecretId erstellt wird.",
            placeholder: "Secret Key eingeben",
        },
    },

    qiniu: {
        accessKey: {
            name: "Access Key",
            desc: "Access Key von Qiniu.",
            placeholder: "Access Key eingeben",
        },
        secretKey: {
            name: "Secret Key",
            desc: "Geheime Zeichenfolge, die zusammen mit dem Access Key erstellt wird.",
            placeholder: "Secret Key eingeben",
        },
    },

    github: {
        repositoryName: {
            name: "Repository",
            desc: "Repository für die Bilder im Format owner/repo, z. B. octocat/my-images. Bei einem öffentlichen Repository sind die Links direkt von außen erreichbar.",
            placeholder: "owner/repo",
        },
        branchName: {
            name: "Branch",
            desc: "Branch, in den committet wird. Standard ist main. Ein nicht existierender Branch lässt den Upload fehlschlagen.",
            placeholder: "main",
        },
        token: {
            name: "Persönliches Zugriffstoken",
            placeholder: "ghp_... eingeben",
        },
        tokenDescPrefix: "Ohne ein Token mit 'repo' scope sind keine Commits möglich. Token erstellen unter: ",
    },

    r2: {
        accessKeyId: {
            name: "Zugriffsschlüssel-ID",
            desc: "Als R2-API-Token in Cloudflare erstellte Zugriffsschlüssel-ID.",
            placeholder: "Zugriffsschlüssel-ID eingeben",
        },
        secretAccessKey: {
            name: "Geheimer Zugriffsschlüssel",
            desc: "Geheime Zeichenfolge, die zusammen mit der Zugriffsschlüssel-ID erstellt wird. Sie wird nur bei der Erstellung angezeigt.",
            placeholder: "Geheimen Zugriffsschlüssel eingeben",
        },
        endpoint: {
            name: "Endpunkt",
            desc: "S3-kompatibler Endpunkt für den Upload. Die auf der R2-Bucket-Seite angezeigte Adresse https://<account-id>.r2.cloudflarestorage.com unverändert eintragen.",
            placeholder: "https://<account-id>.r2.cloudflarestorage.com",
        },
        bucketName: {
            name: "Bucket-Name",
            desc: "Name des R2-Buckets, in dem die Bilder gespeichert werden.",
            placeholder: "Bucket-Name eingeben",
        },
        customDomain: {
            name: "Öffentliche Domain",
            desc: "Pflichtfeld. Domain-Teil der Links in der Notiz: entweder die aktivierte R2.dev-URL (https://pub-xxxx.r2.dev) oder eine dem Bucket zugewiesene eigene Domain. Über den R2-Endpunkt selbst sind die Bilder nicht abrufbar, daher schlagen Uploads fehl, solange das Feld leer ist.",
            placeholder: "pub-xxxx.r2.dev",
        },
    },

    b2: {
        accessKeyId: {
            name: "Application Key ID",
            desc: "ID (keyID) des in Backblaze B2 erstellten Application Keys.",
            placeholder: "Application Key ID eingeben",
        },
        secretAccessKey: {
            name: "Application Key",
            desc: "Geheime Zeichenfolge, die zusammen mit der keyID erstellt wird. Sie wird nur bei der Erstellung angezeigt.",
            placeholder: "Application Key eingeben",
        },
        region: {
            name: "Region",
            desc: "Region des Buckets, z. B. us-west-004. Das ist der Teil zwischen s3. und .backblazeb2.com im Endpunkt, der auf der B2-Bucket-Seite angezeigt wird.",
            placeholder: "us-west-004",
        },
        bucketName: {
            name: "Bucket-Name",
            desc: "Name des B2-Buckets, in dem die Bilder gespeichert werden. Bei einem privaten Bucket lassen sich die Links nicht öffnen.",
            placeholder: "Bucket-Name eingeben",
        },
        customDomain: {
            name: "Öffentliche Domain",
            desc: "Domain-Teil der Links in der Notiz, etwa wenn ein CDN oder eine eigene Domain vorgeschaltet ist. Leer lassen, um die Standard-URL von B2 zu verwenden.",
            placeholder: "Eigene Domain eingeben (optional)",
        },
    },

    modal: {
        title: "Bilder werden hochgeladen",
        titleComplete: "Hochladen abgeschlossen",
        titlePartial: "Hochladen mit Fehlern abgeschlossen",
        titleFailed: "Hochladen fehlgeschlagen",
        uploading: "Wird hochgeladen...",
        complete: "Fertig",
        failed: "Fehlgeschlagen",
        completedWithErrors: (failed: number) => `Mit Fehlern abgeschlossen (${failed} fehlgeschlagen)`,
        succeeded: (count: number) => `${count} erfolgreich`,
        failedCount: (count: number) => `${count} fehlgeschlagen`,
        modeWebp: (quality: number) => `WebP-Konvertierung an (Qualität ${quality})`,
        modeWebpKeepOriginal: (quality: number) =>
            `WebP-Konvertierung an (Qualität ${quality}, Originale behalten)`,
        modeWebpSkipped: "WebP-Konvertierung für diese Notiz übersprungen",
        modeHistory: "Upload-Verlauf an",
        reused: "aus Verlauf wiederverwendet",
        reusedCount: (count: number) => `${count} aus Verlauf`,
        sizeConverted: (from: string, to: string) => `${from} → ${to}`,
        compareConverted: (size: string) => `Umgewandelt ${size}`,
        compareSaved: (size: string) => `Gespart ${size}`,
        compareOriginal: (size: string, delta: string) => `Original ${size} (${delta})`,
    },

    notice: {
        uploaderSetupFailed: "Einrichtung des Uploaders fehlgeschlagen. Bitte die Einstellungen prüfen.",
        publishFailed: (message: string) => `Veröffentlichen fehlgeschlagen: ${message}`,
        copiedToClipboard: "In die Zwischenablage kopiert",
        cannotLocate: (name: string, path: string) =>
            `${name} wurde unter ${path} nicht gefunden. Bitte den Bildpfad oder die Anhang-Einstellungen prüfen.`,
        webImageUploadFailed: (path: string, message: string) =>
            `Hochladen des Webbildes ${path} fehlgeschlagen: ${message}`,
        uploadFailed: (path: string, message: string) =>
            `Hochladen von ${path} fehlgeschlagen. Antwort des Servers: ${message}`,
        originalUploadFailed: (path: string, message: string) =>
            `Die WebP-Datei von ${path} wurde hochgeladen, das Archivieren des Originals ist aber fehlgeschlagen: ${message}`,
        readFileFailed: (path: string) => `Datei konnte nicht gelesen werden: ${path}`,
        filteredOut: (excluded: number, outOfScope: number) =>
            `Wegen der Ordnerbedingungen lokal belassen: ${excluded} in ausgeschlossenen Ordnern, ${outOfScope} außerhalb der Zielordner.`,
        mermaidRendering: (count: number) =>
            count === 1 ? "1 Mermaid-Diagramm wird gerendert..." : `${count} Mermaid-Diagramme werden gerendert...`,
        mermaidInitFailed: (message: string) => `Initialisierung von Mermaid fehlgeschlagen: ${message}`,
        mermaidBlockFailed: (index: number, message: string) =>
            `Mermaid-Block ${index} konnte nicht gerendert werden: ${message}`,
    },
};

export default de;
