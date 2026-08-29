/*
 * Saca a uploads/ + posters/ un video que venia incrustado en el bundle
 * original, tal cual estaba (mismos bytes, sin recodificar).
 *
 * Los 12 videos del bundle original se llaman internamente:
 *   v1 v2 v3 v4   la vieja seccion "Skincare"
 *   b1 b2 b3 b4   "Productos para bebe"
 *   e1 e2 e3 e4   la vieja seccion "Mas videos"
 *
 * Uso:  node tools/extraer.js b1=video-13 b2=video-14
 *
 * Asi se armo la seccion de bebe: se conservo el video original en vez de
 * recodificarlo, porque no hay fuente en mejor calidad de la que partir.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'tools', 'Portafolio.original.html');
const FF = 'C:/Users/sophi/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe';

const pares = process.argv.slice(2);
if (!pares.length) {
  console.log('Uso: node tools/extraer.js b1=video-13 [b2=video-14 ...]');
  process.exit(1);
}
if (!fs.existsSync(SRC)) {
  throw new Error('falta ' + SRC + '\nRecuperalo con:  git show <commit>:Portafolio.html > tools/Portafolio.original.html');
}

const html = fs.readFileSync(SRC, 'utf8');
function block(type) {
  const tag = '<script type="__bundler/' + type + '">';
  const i = html.indexOf(tag);
  const s = i + tag.length;
  return html.slice(s, html.indexOf('</script>', s)).trim();
}
const manifest = JSON.parse(block('manifest'));
const porId = {};
JSON.parse(block('ext_resources')).forEach(r => { porId[r.id] = r.uuid; });

fs.mkdirSync(path.join(ROOT, 'uploads'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'posters'), { recursive: true });

for (const par of pares) {
  const [id, nombre] = par.split('=');
  if (!id || !nombre) { console.log('  ! formato invalido: ' + par + ' (se espera id=nombre)'); continue; }
  const uuid = porId[id];
  if (!uuid || !manifest[uuid]) { console.log('  ! "' + id + '" no esta en el bundle original'); continue; }

  const bytes = Buffer.from(manifest[uuid].data, 'base64');
  const destino = path.join(ROOT, 'uploads', nombre + '.mp4');
  fs.writeFileSync(destino, bytes);

  const poster = path.join(ROOT, 'posters', nombre + '.jpg');
  const base = ['-hide_banner', '-loglevel', 'error', '-y'];
  try {
    execFileSync(FF, base.concat(['-ss', '1', '-i', destino, '-frames:v', '1', '-q:v', '4', poster]), { stdio: 'pipe' });
  } catch (e) {
    execFileSync(FF, base.concat(['-i', destino, '-frames:v', '1', '-q:v', '4', poster]), { stdio: 'pipe' });
  }
  console.log(id + ' -> ' + nombre + '.mp4  (' + (bytes.length / 1048576).toFixed(2) + ' MB) + portada');
}
