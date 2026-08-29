# Ruta de FFmpeg instalado por winget
FF="C:/Users/sophi/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe"
FP="C:/Users/sophi/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffprobe.exe"

# Mapa: numero de slot -> nombre del archivo en uploads/
#   01-04  seccion "Skincare"
#   05-08  seccion "Productos para bebe"
#   09-14  seccion "Beauty & Lifestyle"
slot_name() {
  case "$1" in
    01) echo "skincare-1" ;; 02) echo "skincare-2" ;; 03) echo "skincare-3" ;; 04) echo "skincare-4" ;;
    05) echo "bebe-1" ;;     06) echo "bebe-2" ;;     07) echo "bebe-3" ;;     08) echo "bebe-4" ;;
    09) echo "extra-1" ;;    10) echo "extra-2" ;;    11) echo "extra-3" ;;
    12) echo "extra-4" ;;    13) echo "extra-5" ;;    14) echo "extra-6" ;;
    *) echo "" ;;
  esac
}
slot_title() {
  case "$1" in
    01) echo "Abib / Bloqueador Airy Sunstick" ;;
    02) echo "Abib / Protectores solares" ;;
    03) echo "Double Up Cream / Locion y tratamiento" ;;
    04) echo "Rutina en duo / Piel luminosa" ;;
    05) echo "Panales Ekono Pants" ;;
    06) echo "Panitos humedos Farmatodo" ;;
    07) echo "Crema Almilpro" ;;
    08) echo "Panales Huggies DermaCare" ;;
    09) echo "Mascarilla facial de oro" ;;
    10) echo "Limpieza facial profesional" ;;
    11) echo "Maybelline / Mascara Sky High" ;;
    12) echo "Brujeria Capilar / Mascarilla" ;;
    13) echo "Unboxing YesStyle" ;;
    14) echo "Unboxing / Rizador de cabello" ;;
    *) echo "" ;;
  esac
}
