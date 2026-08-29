# Ruta de FFmpeg instalado por winget
FF="C:/Users/sophi/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe"
FP="C:/Users/sophi/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffprobe.exe"

# El numero del slot es el mismo que se ve en la pagina.
#   01-12  seccion "Beauty & Lifestyle"
#   13-16  seccion "Productos para bebe"
slot_name() { printf 'video-%s' "$1"; }

slot_title() {
  case "$1" in
    01) echo "Abib / Bloqueador Airy Sunstick" ;;
    02) echo "Abib / Protectores solares" ;;
    03) echo "Double Up Cream / Locion y tratamiento" ;;
    04) echo "Rutina en duo / Piel luminosa" ;;
    05) echo "Mascarilla facial de oro" ;;
    06) echo "Limpieza facial profesional" ;;
    07) echo "Maybelline / Mascara Sky High" ;;
    08) echo "Brujeria Capilar / Mascarilla" ;;
    09) echo "Unboxing YesStyle" ;;
    10) echo "Unboxing / Rizador de cabello" ;;
    11) echo "Unboxing sorpresa" ;;
    12) echo "Feria de Belleza y Salud" ;;
    13) echo "Panales Ekono Pants" ;;
    14) echo "Panitos humedos Farmatodo" ;;
    15) echo "Crema Almilpro" ;;
    16) echo "Panales Huggies DermaCare" ;;
    *) echo "" ;;
  esac
}
