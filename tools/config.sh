# Ruta de FFmpeg instalado por winget
FF="C:/Users/sophi/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe"
FP="C:/Users/sophi/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffprobe.exe"

# El numero del slot es el mismo que se ve en la pagina.
#   01-12  seccion "Beauty & Lifestyle"
#   13-16  seccion "Productos para bebe"
slot_name() { printf 'video-%s' "$1"; }

slot_title() {
  case "$1" in
    01) echo "Feria de Belleza y Salud" ;;
    02) echo "Abib / Bloqueador Airy Sunstick" ;;
    03) echo "Abib / Protectores solares" ;;
    04) echo "Epii / Double Up Cream" ;;
    05) echo "Epii / Rutina en duo" ;;
    06) echo "Mascarilla facial de oro" ;;
    07) echo "Limpieza facial profesional" ;;
    08) echo "Pestanina / heavy full figure" ;;
    09) echo "Vive Beauty / Mantequilla" ;;
    10) echo "Unboxing YesStyle" ;;
    11) echo "Unboxing / Epii" ;;
    12) echo "Unboxing sorpresa" ;;
    13) echo "Panales Ekono Pants" ;;
    14) echo "Johnsons baby / Shampoo" ;;
    15) echo "Almipro / Unguento" ;;
    16) echo "Panales Huggies DermaCare" ;;
    *) echo "" ;;
  esac
}
