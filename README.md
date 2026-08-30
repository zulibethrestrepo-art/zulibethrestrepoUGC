# Portafolio UGC — Zulibeth Restrepo

Sitio publicado en
<https://zulibethrestrepo-art.github.io/zulibethrestrepoUGC/Portafolio.html>

Media kit en
<https://zulibethrestrepo-art.github.io/zulibethrestrepoUGC/MediaKit.html>

## Como esta armado

- `MediaKit.html` — el media kit para marcas (~0,22 MB). Archivo autonomo:
  lleva la foto incrustada y toma las tipografias de Google Fonts.
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
| Beauty & Lifestyle | 01–12 | 12 |
| Productos para bebe | 13–16 | 4 |

El numero del slot es el que se ve en la pagina y tambien el nombre del
archivo: el 07 vive en `uploads/video-07.mp4` y `posters/video-07.jpg`.

## Cambiar un video

Ver `originales/LEEME.txt`. En resumen: copia el original como `NN.mp4`,
corre `bash tools/encode.sh NN` y publica con git.

## Cambiar un titulo o reordenar

Los titulos y el orden viven en `tools/contenido.js`. Editalos y corre:

    node tools/rebuild.js

## Revisar antes de publicar

    node tools/serve.js

y abre <http://localhost:4321/Portafolio.html>

## Rehacer el HTML desde cero

    node tools/rebuild.js

Necesita `tools/Portafolio.original.html`, el bundle original (no se sube a
GitHub). Si no lo tienes, recuperalo del historial:

    git show d6452ad:Portafolio.html > tools/Portafolio.original.html

## Otros scripts

- `tools/extraer.js b1=video-13` — saca un video del bundle original tal
  cual estaba, sin recodificar. Asi se armo la seccion de bebe, porque no
  hay fuente en mejor calidad de la que partir.

## Calidad

En `tools/encode.sh`: `CRF=25`, ancho maximo 1080, 30 fps, H.264 perfil
High, audio AAC 128 kbps y `+faststart` (empieza a reproducir sin
descargar todo el archivo). Bajar `CRF` mejora la calidad y sube el peso.
Nunca se hace upscale: si la fuente viene a 478x850, se queda ahi.
