#!/usr/bin/env bash
# Convierte los videos de originales/ a MP4 optimizados para web + portadas.
# Uso:  bash tools/encode.sh          -> procesa todos los que encuentre
#       bash tools/encode.sh 05 07    -> procesa solo esos slots
set -u
cd "$(dirname "$0")/.."
source tools/config.sh

CRF=25          # calidad: casi indistinguible del original a ~3.5 Mbps
MAXW=1080       # ancho maximo; no se hace upscale de fuentes menores
MAXFPS=30

slots=("$@")
if [ ${#slots[@]} -eq 0 ]; then slots=(01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16); fi

hechos=0; faltan=()
for n in "${slots[@]}"; do
  name=$(slot_name "$n")
  [ -z "$(slot_title "$n")" ] && { echo "  ! slot $n no valido"; continue; }

  src=""
  for ext in mp4 mov MP4 MOV m4v webm mkv avi; do
    [ -f "originales/$n.$ext" ] && { src="originales/$n.$ext"; break; }
  done
  [ -z "$src" ] && { faltan+=("$n  $(slot_title "$n")"); continue; }

  echo "-> [$n] $(slot_title "$n")"
  echo "   fuente: $src"

  "$FF" -hide_banner -loglevel error -stats -y -i "$src" \
    -map 0:v:0 -map 0:a:0? \
    -c:v libx264 -profile:v high -level 4.1 -preset slow -crf $CRF \
    -maxrate 4M -bufsize 8M -pix_fmt yuv420p \
    -vf "scale='min($MAXW,iw)':-2:flags=lanczos,fps='min($MAXFPS,source_fps)'" \
    -c:a aac -b:a 128k -ar 48000 -ac 2 \
    -movflags +faststart \
    "uploads/$name.mp4" || { echo "   FALLO al codificar"; continue; }

  "$FF" -hide_banner -loglevel error -y -ss 1 -i "uploads/$name.mp4" \
    -frames:v 1 -q:v 4 "posters/$name.jpg" 2>/dev/null \
    || "$FF" -hide_banner -loglevel error -y -i "uploads/$name.mp4" \
         -frames:v 1 -q:v 4 "posters/$name.jpg"

  vmb=$(du -m "uploads/$name.mp4" | cut -f1)
  pkb=$(du -k "posters/$name.jpg" | cut -f1)
  echo "   listo: uploads/$name.mp4 (${vmb} MB) + posters/$name.jpg (${pkb} KB)"
  hechos=$((hechos+1))
done

echo
echo "==================================="
echo "Codificados: $hechos"
if [ ${#faltan[@]} -gt 0 ]; then
  echo "Faltan originales para:"
  for f in "${faltan[@]}"; do echo "   $f"; done
fi
