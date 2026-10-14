import type {Messages} from "./en";

/** Spanish messages. Typed as Messages, so a missing key is a compile error. */
const es: Messages = {
    command: {
        publishPage: "Publicar página",
    },

    general: {
        altText: {
            name: "Usar el nombre de la imagen como texto alternativo",
            desc: "Activado: el nombre del archivo de la imagen se escribe entre los corchetes del enlace (los guiones «-» y «_» se convierten en espacios). Desactivado: los corchetes quedan vacíos. La imagen se ve igual; solo cambia el texto que aparece si no se puede cargar.",
        },
        updateOriginalDoc: {
            name: "Actualizar la nota original",
            desc: "Activado: los enlaces a imágenes de la nota original se reemplazan por las URL subidas. Desactivado: la nota original no se toca y solo se copia al portapapeles el texto con los enlaces reemplazados.",
        },
        ignoreProperties: {
            name: "Omitir las propiedades al copiar",
            desc: "Activado: el texto copiado al portapapeles no incluye las propiedades (frontmatter) del inicio de la nota. Desactivado: se copian también las propiedades. En ambos casos las propiedades se conservan en la nota original.",
        },
    },

    upload: {
        heading: "Subida",
        progressModal: {
            name: "Mostrar el progreso en un cuadro de diálogo",
            desc: "Activado: se abre un cuadro de diálogo con el resultado de cada imagen (si todo sale bien, se cierra solo a los 3 segundos). Desactivado: solo se muestra una línea en la barra de estado.",
        },
        webImages: {
            name: "Subir también las imágenes web",
            desc: "Activado: las imágenes que la nota enlaza con URL http/https se descargan, se vuelven a subir a tu almacenamiento y se actualiza el enlace, así no se pierden si desaparecen del sitio original. Desactivado: las URL externas se dejan como están. Las imágenes que ya están en tu almacenamiento se omiten en ambos casos.",
        },
    },

    webp: {
        heading: "Conversión a WebP",
        enabled: {
            name: "Convertir las imágenes a WebP",
            desc: "Activado: las imágenes locales se convierten a WebP antes de subirlas y la nota enlaza el archivo WebP. Solo afecta a las imágenes locales; las imágenes web y los diagramas de Mermaid no se convierten. Desactivado: se suben en su formato original.",
        },
        extensions: {
            name: "Extensiones que se convierten",
            desc: "Separadas por comas y sin el punto. GIF y SVG quedan fuera por defecto porque la conversión pasa por un canvas: de un GIF animado solo se conserva el primer fotograma y un SVG se rasteriza, por lo que deja de escalar sin pérdida.",
            placeholder: "png, jpg, jpeg",
        },
        quality: {
            name: "Calidad",
            desc: "Calidad de compresión de WebP. Cuanto más baja, más pequeño el archivo y mayor la pérdida. Como referencia, unos 75 para fotos y unos 90 para imágenes con texto. Si el WebP resulta más grande que el original, se sube el original.",
        },
        keepOriginal: {
            name: "Subir también el original",
            desc: "Activado: además del WebP se sube el archivo original sin modificar como copia de archivo. La nota sigue enlazando el WebP. Desactivado: solo se sube el WebP y el original no queda en el almacenamiento.",
        },
        originalPath: {
            name: "Ruta de los originales",
            desc: "Dónde se guardan las copias de los originales. Admite las mismas variables que la ruta de destino. Usa una ruta distinta de la de destino para que los archivos no se sobrescriban entre sí.",
            placeholder: "/originals/{year}/{mon}/{day}/{filename}",
        },
        originalPathUnsupported: "Este almacenamiento no permite indicar una ruta, así que los originales se suben junto a los archivos WebP. Como la extensión es distinta, no se sobrescriben.",
        frontmatterProperty: {
            name: "Propiedad para decidir por nota",
            desc: "Nombre de la propiedad de nota que decide la conversión en una nota concreta. Ponla en true para convertir esa nota y en false para no convertirla. Déjalo vacío para desactivar esta opción por nota.",
            placeholder: "webp",
        },
        frontmatterDefault: {
            name: "Valor por defecto si falta la propiedad",
            desc: "Se aplica a las notas que no tienen la propiedad. Desactívalo para convertir solo las notas que lo pidan explícitamente.",
        },
    },

    cache: {
        heading: "Historial de subidas",
        enabled: {
            name: "No volver a subir imágenes sin cambios",
            desc: "Activado: se recuerda qué contenidos de archivo ya se subieron al destino actual y se reutiliza la URL en lugar de subirlos de nuevo. Si editas una imagen, se vuelve a subir; lo mismo ocurre si cambias de bucket o de dominio. Desactivado: todas las imágenes se suben en cada publicación.",
        },
        clear: {
            name: "Borrar el historial de subidas",
            desc: "Olvida todas las subidas registradas, así que la próxima publicación vuelve a subirlo todo. Los archivos ya subidos no se eliminan. Úsalo cuando una nota enlace a una URL que ya no funciona.",
            button: "Borrar",
        },
        entries: (count: number) => count === 1 ? `${count} subida registrada` : `${count} subidas registradas`,
        cleared: (count: number) => count === 1 ? `Se borró ${count} subida registrada` : `Se borraron ${count} subidas registradas`,
    },

    mermaid: {
        heading: "Mermaid",
        convert: {
            name: "Convertir los diagramas de Mermaid en imágenes",
            desc: "Activado: al publicar, los bloques de código mermaid se convierten en PNG, se suben y se reemplazan por un enlace a la imagen. Útil para pegar el texto en sitios que no admiten Mermaid. Desactivado: se dejan como bloques de código.",
        },
        scale: {
            name: "Escala de las imágenes de Mermaid",
            desc: "Resolución del PNG exportado (de 1x a 4x). Con 2, la imagen tiene el doble de píxeles que el tamaño de visualización del diagrama. Un valor más alto da más nitidez y archivos más grandes. Para pantallas de alta resolución se recomienda 2.",
        },
        theme: {
            name: "Tema de Mermaid",
            desc: "Colores de los diagramas exportados. No sigue el tema de apariencia de Obsidian: siempre se usan los colores elegidos aquí.",
            options: {
                default: "Predeterminado",
                dark: "Oscuro",
                forest: "Bosque",
                neutral: "Neutro",
                base: "Base",
            },
        },
    },

    network: {
        heading: "Red",
        mode: {
            name: "Proxy",
            desc: "Si se usa un proxy para conectarse a Amazon S3, Cloudflare R2 y Backblaze B2. Estos tres se comunican directamente a través del SDK de AWS, sin pasar por Obsidian, por lo que no aplican la configuración de proxy del sistema. Detrás de un proxy corporativo, las subidas agotan el tiempo de espera si no lo configuras aquí. No afecta a los demás almacenamientos.",
            options: {
                auto: "Detectar desde las variables de entorno",
                off: "No usar proxy",
                manual: "Indicar manualmente",
            },
        },
        url: {
            name: "URL del proxy",
            desc: "Por ejemplo, http://proxy.example.com:8080. Si el proxy requiere autenticación, incluye las credenciales así: http://user:pass@host:port.",
            placeholder: "http://host:port",
        },
        detected: (url: string) => `Detectado en las variables de entorno. Se usará este proxy: ${url}`,
        notDetected: "No se encontraron las variables de entorno HTTPS_PROXY / HTTP_PROXY. Las subidas se conectarán directamente. Si estás detrás de un proxy, fallarán: cambia a «Indicar manualmente».",
        manualActive: (url: string) => `Se usará este proxy: ${url}`,
        manualEmpty: "El campo de abajo está vacío. Mientras lo esté, las subidas se conectarán directamente.",
        disabled: "Las subidas se conectan directamente, sin proxy, aunque haya variables de entorno definidas.",
    },

    language: {
        name: "Idioma",
        desc: "Idioma de la configuración y de los avisos de este plugin. «Automático» sigue el idioma configurado en Obsidian. El cambio se aplica al instante.",
        options: {
            auto: "Automático",
        },
    },

    imageStore: {
        heading: "Almacenamiento de imágenes",
        select: {
            name: "Servicio de almacenamiento",
            desc: "Dónde se suben las imágenes. Al cambiarlo, los campos de abajo pasan a ser los de ese servicio. La configuración de cada servicio se guarda por separado, así que no pierdes lo que escribiste al cambiar.",
        },
    },

    filter: {
        heading: "Carpetas que se suben",
        scope: {
            name: "Alcance de la subida",
            desc: "Qué imágenes locales se envían a este almacenamiento. Cada almacenamiento guarda sus propias carpetas.",
            options: {
                all: "Todas las carpetas",
                selected: "Solo las carpetas elegidas",
            },
        },
        hint: "Se incluyen las subcarpetas. Los enlaces a las imágenes que quedan fuera no se modifican.",
        include: {
            name: "Carpetas de destino",
            add: "Añadir carpeta",
            empty: "Añade una carpeta de destino. Hasta entonces, no se sube ninguna imagen local a este almacenamiento.",
        },
        exclude: {
            name: "Carpetas excluidas",
            desc: "Las imágenes de estas carpetas nunca se suben, aunque estén dentro de una carpeta de destino.",
            add: "Añadir carpeta excluida",
            empty: "No hay carpetas excluidas.",
        },
        remove: "Quitar",
        missing: "No se encuentra la carpeta. Se eliminó o se movió mientras el plugin estaba desactivado; la condición se conserva hasta que la quites.",
        pickFolder: "Elige una carpeta",
        test: {
            name: "Probar las condiciones",
            desc: "Muestra qué imágenes se subirían con las condiciones de arriba, sin subir nada.",
            button: "Probar",
        },
    },

    filterTest: {
        title: "Prueba de las condiciones de subida",
        disclaimer: "Solo comprueba qué imágenes entran en el alcance. No prueba la conexión ni las credenciales.",
        store: (name: string) => `Almacenamiento: ${name}`,
        scopeNote: "Imágenes de una nota",
        scopeVault: "Todas las imágenes de la bóveda",
        note: (path: string) => `Nota: ${path}`,
        noNote: "No hay ninguna nota seleccionada.",
        changeNote: "Elegir nota",
        pickNote: "Elige una nota",
        search: "Buscar rutas",
        allVerdicts: "Todos los resultados",
        verdict: {
            included: "Se sube",
            excluded: "En una carpeta excluida",
            outOfScope: "Fuera de las carpetas de destino",
            notFound: "Imagen no encontrada",
        },
        column: {
            path: "Imagen",
            verdict: "Resultado",
            reason: "Motivo",
            refs: "Enlaces",
        },
        reason: {
            allFolders: "Todas las carpetas están en el alcance.",
            inTarget: (folders: string) => `Está en la carpeta de destino ${folders}.`,
            noTarget: "No hay ninguna carpeta de destino seleccionada.",
            notInTarget: "No está dentro de ninguna carpeta de destino.",
            excluded: (folders: string) => `Está en la carpeta excluida ${folders}.`,
            excludedOverTarget: (excluded: string, target: string) =>
                `Está en la carpeta excluida ${excluded} y en la carpeta de destino ${target}; la exclusión tiene prioridad.`,
            notFound: (link: string) => `Ningún archivo de la bóveda coincide con el enlace ${link}.`,
        },
        count: (label: string, n: number) => `${label}: ${n}`,
        page: (current: number, total: number, shown: number) =>
            `Página ${current} de ${total} (${shown} ${shown === 1 ? "imagen" : "imágenes"})`,
        prev: "Anterior",
        next: "Siguiente",
        empty: "No hay imágenes que mostrar.",
        otherHeading: "No afectadas por las condiciones de carpeta",
        webOn: (n: number, hosted: number) =>
            `Imágenes web: ${n}. Se descargan y se suben al publicar` + (hosted > 0 ? `, salvo ${hosted} que ya están en este almacenamiento.` : "."),
        webOff: (n: number) => `Imágenes web: ${n}. Se dejan como están («Subir también las imágenes web» está desactivado).`,
        mermaidOn: (n: number) => `Diagramas de Mermaid: ${n}. Se convierten en imagen y se suben al publicar.`,
        mermaidOff: (n: number) => `Diagramas de Mermaid: ${n}. Se dejan como código («Convertir los diagramas de Mermaid en imágenes» está desactivado).`,
        readFailed: (message: string) => `No se pudo leer la nota: ${message}`,
    },

    common: {
        bucketName: {
            name: "Nombre del bucket",
            desc: "Nombre del bucket donde se guardan las imágenes. Debe existir de antemano.",
            placeholder: "Introduce el nombre del bucket",
        },
        targetPath: {
            name: "Ruta de destino",
            desc: "Dónde se guarda cada imagen dentro del bucket. Admite las variables {year} {mon} {day} {random} {filename} {foldername} {notename}. Por ejemplo, con /{year}/{mon}/{day}/{filename}, pic.jpg se guarda como /2023/06/08/pic.jpg. {foldername} es la carpeta en la que está la nota y {notename} el nombre de la propia nota, así que img/{notename}/{filename} agrupa las imágenes de cada nota. En una nota en la raíz de la bóveda, {foldername} queda vacío y ese segmento se omite. Si lo dejas vacío, solo se usa el nombre del archivo y los archivos con el mismo nombre pueden sobrescribirse.",
            placeholder: "/{year}/{mon}/{day}/{filename}",
        },
        customDomain: {
            name: "Dominio personalizado",
            desc: "Dominio que se usa en los enlaces escritos en la nota, por ejemplo si tienes una CDN delante. Con cdn.example.com, el enlace queda como https://cdn.example.com/ruta-de-destino. Si lo dejas vacío, se usa la URL propia del almacenamiento. No cambia adónde se sube.",
            placeholder: "cdn.example.com",
        },
    },

    imgur: {
        clientId: {
            name: "ID de cliente",
            placeholder: "Introduce el ID de cliente",
        },
        descPrefix: "El valor inicial es un ID compartido por todos los usuarios del plugin y puede alcanzar el límite de solicitudes. Genera tu propio ID de cliente en ",
    },

    gyazo: {
        accessToken: {
            name: "Token de acceso",
            placeholder: "Introduce el token de acceso",
        },
        tokenDescPrefix: "Crea una aplicación y genera un token de acceso en ",
        accessPolicy: {
            name: "Visibilidad",
            desc: "Quién puede ver las imágenes subidas. Con «Solo yo», otras personas y sitios externos no pueden abrir la URL de la imagen pegada en la nota. Si vas a compartir la nota, elige «Cualquiera».",
            options: {
                anyone: "Cualquiera",
                onlyMe: "Solo yo",
            },
        },
        commonDescription: {
            name: "Descripción común",
            desc: "Se añade la misma descripción de Gyazo a todas las imágenes subidas, lo que facilita encontrarlas después en tu lista de Gyazo. Si lo dejas vacío, no se añade descripción.",
            placeholder: "Introduce una descripción común (opcional)",
        },
    },

    oss: {
        region: {
            name: "Región",
            desc: "Región del centro de datos donde creaste el bucket. Si no coincide con la del bucket, la subida falla.",
        },
        accessKeyId: {
            name: "ID de clave de acceso",
            desc: "ID de clave de acceso generado en Aliyun RAM.",
            placeholder: "Introduce el ID de clave de acceso",
        },
        accessKeySecret: {
            name: "Secreto de la clave de acceso",
            desc: "Cadena secreta que se genera junto con el ID de clave de acceso en Aliyun RAM. Solo se muestra al crearla.",
            placeholder: "Introduce el secreto de la clave de acceso",
        },
    },

    imagekit: {
        id: {
            name: "ImageKit ID",
            placeholder: "Introduce tu ImageKit ID",
        },
        descPrefix: "Encontrarás el ID y las claves en ",
        folder: {
            name: "Carpeta",
            desc: "Carpeta de ImageKit donde se guardan las imágenes. Si lo dejas vacío, se guardan en la raíz.",
            placeholder: "Introduce el nombre de la carpeta",
        },
        publicKey: {
            name: "Clave pública",
            placeholder: "Introduce tu clave pública",
        },
        privateKey: {
            name: "Clave privada",
            placeholder: "Introduce tu clave privada",
        },
    },

    s3: {
        accessKeyId: {
            name: "ID de clave de acceso de AWS S3",
            desc: "ID de clave de acceso del usuario de IAM (20 caracteres, empieza por AKIA). Necesita permiso PutObject sobre el bucket.",
            placeholder: "AKIA...",
        },
        secretAccessKey: {
            name: "Clave de acceso secreta de AWS S3",
            desc: "Cadena secreta que se genera junto con el ID de clave de acceso. Solo se muestra al crearla; si no la guardaste, crea una nueva.",
            placeholder: "Introduce tu clave de acceso secreta",
        },
        region: {
            name: "Región de AWS S3",
            desc: "Región en la que creaste el bucket, por ejemplo eu-west-1. Si no coincide con la del bucket, la subida falla. Puedes consultarla en la lista de buckets de la consola de AWS.",
            placeholder: "eu-west-1",
        },
        bucketName: {
            name: "Nombre del bucket de AWS S3",
            desc: "Nombre del bucket de S3 donde se guardan las imágenes.",
            placeholder: "Introduce el nombre del bucket",
        },
        endpoint: {
            name: "Punto de enlace compatible con S3",
            desc: "Déjalo vacío para AWS S3. Indica aquí la URL de un servicio compatible con S3 (MinIO, DigitalOcean Spaces, Wasabi, Ceph) para usarlo en su lugar. Las solicitudes pasan a usar direccionamiento de estilo ruta, por lo que el bucket es el primer segmento de la ruta de la URL, y un dominio personalizado debe apuntar al servidor, no al bucket. Con un punto de enlace definido, la región solo se usa para firmar las solicitudes y, si la dejas vacía, es us-east-1.",
            placeholder: "https://minio.example.com",
        },
    },

    cos: {
        region: {
            name: "Región",
            desc: "Región del centro de datos donde creaste el bucket. Si no coincide con la del bucket, la subida falla.",
        },
        secretId: {
            name: "SecretId",
            desc: "SecretId generado en la gestión de acceso de Tencent Cloud.",
            placeholder: "Introduce el SecretId",
        },
        secretKey: {
            name: "SecretKey",
            desc: "Cadena secreta que se genera junto con el SecretId.",
            placeholder: "Introduce la SecretKey",
        },
    },

    qiniu: {
        accessKey: {
            name: "Clave de acceso",
            desc: "Clave de acceso (AccessKey) de Qiniu.",
            placeholder: "Introduce la clave de acceso",
        },
        secretKey: {
            name: "Clave secreta",
            desc: "Cadena secreta que se genera junto con la clave de acceso.",
            placeholder: "Introduce la clave secreta",
        },
    },

    github: {
        repositoryName: {
            name: "Repositorio",
            desc: "Repositorio de GitHub donde se guardan las imágenes, en formato owner/repo. Si el repositorio es público, los enlaces se pueden abrir desde cualquier sitio.",
            placeholder: "owner/repo",
        },
        branchName: {
            name: "Rama",
            desc: "Rama en la que se hacen los commits. Por defecto, main. Si la rama no existe, la subida falla.",
            placeholder: "main",
        },
        token: {
            name: "Token de acceso personal",
            placeholder: "Introduce tu token de acceso personal de GitHub",
        },
        tokenDescPrefix: "Sin el ámbito 'repo' no se pueden hacer commits. Genera un token de acceso personal con ese ámbito en ",
    },

    r2: {
        accessKeyId: {
            name: "ID de clave de acceso de Cloudflare R2",
            desc: "ID de clave de acceso generado como token de API de R2 en Cloudflare.",
            placeholder: "Introduce tu ID de clave de acceso",
        },
        secretAccessKey: {
            name: "Clave de acceso secreta de Cloudflare R2",
            desc: "Cadena secreta que se genera junto con el ID de clave de acceso. Solo se muestra al crearla.",
            placeholder: "Introduce tu clave de acceso secreta",
        },
        endpoint: {
            name: "Punto de enlace de Cloudflare R2",
            desc: "Punto de enlace compatible con S3 al que se sube. Copia el que aparece en la página del bucket de R2, por ejemplo https://account-id.r2.cloudflarestorage.com.",
            placeholder: "https://<account-id>.r2.cloudflarestorage.com",
        },
        bucketName: {
            name: "Nombre del bucket de Cloudflare R2",
            desc: "Nombre del bucket de R2 donde se guardan las imágenes.",
            placeholder: "Introduce el nombre del bucket",
        },
        customDomain: {
            name: "URL de R2.dev o dominio personalizado",
            desc: "Obligatorio. Un bucket de R2 no se puede leer a través de su propio punto de enlace, así que el enlace escrito en la nota debe usar un nombre de host público: la URL de R2.dev que hayas activado (https://pub-xxxx.r2.dev) o un dominio personalizado vinculado al bucket. Mientras esté vacío, las subidas fallan con un error.",
            placeholder: "pub-xxxx.r2.dev",
        },
    },

    b2: {
        accessKeyId: {
            name: "ID de clave de aplicación de Backblaze B2",
            desc: "ID (keyID) de la clave de aplicación generada en Backblaze B2.",
            placeholder: "Introduce el ID de clave de aplicación",
        },
        secretAccessKey: {
            name: "Clave de aplicación de Backblaze B2",
            desc: "Cadena secreta que se genera junto con el keyID. Solo se muestra al crearla.",
            placeholder: "Introduce la clave de aplicación",
        },
        region: {
            name: "Región de Backblaze B2",
            desc: "Región del bucket, por ejemplo us-west-004. Es la parte entre s3. y .backblazeb2.com del punto de enlace que aparece en la página del bucket de B2.",
            placeholder: "us-west-004",
        },
        bucketName: {
            name: "Nombre del bucket de Backblaze B2",
            desc: "Nombre del bucket de B2 donde se guardan las imágenes. Si el bucket es privado, los enlaces no se pueden abrir.",
            placeholder: "Introduce el nombre del bucket",
        },
        customDomain: {
            name: "Dominio personalizado",
            desc: "Dominio que se usa en los enlaces escritos en la nota, si tienes una CDN o un dominio propio delante. Si lo dejas vacío, se usa la URL predeterminada de B2.",
            placeholder: "Introduce un dominio personalizado (opcional)",
        },
    },

    modal: {
        title: "Subiendo imágenes",
        titleComplete: "Subida completada",
        titlePartial: "Subida completada con errores",
        titleFailed: "La subida falló",
        uploading: "Subiendo...",
        complete: "Completado",
        failed: "Error",
        completedWithErrors: (failed: number) =>
            `Completado con errores (${failed} ${failed === 1 ? "fallida" : "fallidas"})`,
        succeeded: (count: number) => `${count} ${count === 1 ? "correcta" : "correctas"}`,
        failedCount: (count: number) => `${count} ${count === 1 ? "fallida" : "fallidas"}`,
        modeWebp: (quality: number) => `Conversión a WebP activada (calidad ${quality})`,
        modeWebpKeepOriginal: (quality: number) =>
            `Conversión a WebP activada (calidad ${quality}, se conservan los originales)`,
        modeWebpSkipped: "Conversión a WebP omitida en esta nota",
        modeHistory: "Historial de subidas activado",
        reused: "reutilizada del historial",
        reusedCount: (count: number) => `${count} del historial`,
        sizeConverted: (from: string, to: string) => `${from} → ${to}`,
        compareConverted: (size: string) => `Convertida ${size}`,
        compareSaved: (size: string) => `Ahorro ${size}`,
        compareOriginal: (size: string, delta: string) => `Original ${size} (${delta})`,
    },

    notice: {
        uploaderSetupFailed: "No se pudo inicializar el uploader de imágenes. Revisa la configuración.",
        publishFailed: (message: string) => `Error al publicar: ${message}`,
        copiedToClipboard: "Copiado al portapapeles",
        cannotLocate: (name: string, path: string) =>
            `No se encuentra ${name} en ${path}. Revisa la ruta de la imagen o la opción de archivos adjuntos en la configuración del plugin.`,
        webImageUploadFailed: (path: string, message: string) =>
            `No se pudo subir la imagen web ${path}: ${message}`,
        uploadFailed: (path: string, message: string) =>
            `No se pudo subir ${path}; el servidor devolvió un error: ${message}`,
        originalUploadFailed: (path: string, message: string) =>
            `El WebP de ${path} se subió, pero no se pudo archivar el original: ${message}`,
        readFileFailed: (path: string) => `No se pudo leer el archivo: ${path}`,
        filteredOut: (excluded: number, outOfScope: number) =>
            `Imágenes que se quedan en local por las carpetas de subida: ${excluded} en una carpeta excluida, ${outOfScope} fuera de las carpetas de destino.`,
        mermaidRendering: (count: number) =>
            count === 1 ? `Convirtiendo ${count} diagrama de Mermaid...` : `Convirtiendo ${count} diagramas de Mermaid...`,
        mermaidInitFailed: (message: string) => `No se pudo inicializar Mermaid: ${message}`,
        mermaidBlockFailed: (index: number, message: string) =>
            `No se pudo convertir el bloque de Mermaid ${index}: ${message}`,
    },
};

export default es;
