# Portafolio UGC — Zulibeth Restrepo

Sitio publicado en
<https://zulibethrestrepo-art.github.io/zulibethrestrepoUGC/Portafolio.html>

## Como esta armado

- `Portafolio.html` — la pagina (~0,5 MB). Antes pesaba 18,78 MB porque
  llevaba los videos incrustados en base64; eso obligaba a comprimirlos
  hasta 121–445 kbps y por eso se veian mal.
- `uploads/` — los videos, en 1080x1920 H.264 a ~3.500 kbps.
- `posters/` — la portada de cada video. Se muestra al instante y el video
  solo se descarga cuando entra en pantalla.
- `originales/` — los videos fuente (no se suben a GitHub, ver `.gitignore`).
- `tools/` — los scripts de mantenimiento.

## Secciones

| Seccion | Slots | Videos |
|---------|-------|--------|
| Skincare | 01–04 | 4 |
| Productos para bebe | 05–08 | 4 |
| Beauty & Lifestyle | 09–14 | 6 |

## Cambiar un video

Ver `originales/LEEME.txt`. En resumen: copia el original como `NN.mp4`,
corre `bash tools/encode.sh NN` y publica con git.

## Cambiar un titulo o agregar un video

Los titulos viven en `tools/contenido.js`. Editalos y corre:

    node tools/rebuild.js

## Rehacer el HTML desde cero

    node tools/rebuild.js

Necesita `tools/Portafolio.original.html` (el bundle original, no se sube
a GitHub). Si no lo tienes, recuperalo del historial:

    git show <commit-anterior>:Portafolio.html > tools/Portafolio.original.html

## Otros scripts

- `tools/extraer.js NN` — saca un video del bundle original tal cual estaba,
  sin recodificar. Se uso para la seccion de bebe.
- `tools/serve.js` — servidor local para revisar antes de publicar:

      node tools/serve.js

## Calidad

En `tools/encode.sh`: `CRF=25`, ancho maximo 1080, 30 fps, H.264 perfil
High, audio AAC 128 kbps y `+faststart` (empieza a reproducir sin
descargar todo el archivo). Bajar `CRF` mejora la calidad y sube el peso.
