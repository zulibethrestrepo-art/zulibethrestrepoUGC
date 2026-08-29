/*
 * Saca a uploads/ + posters/ los videos que venian incrustados en el bundle
 * original, tal cual estan (misma calidad, mismos bytes).
 * Sirve para los slots que no se van a reemplazar por un original nuevo.
 *
 * Uso:  node tools/extraer.js 05 06 07 08
 *       node tools/extraer.js            -> los 12
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'tools', 'Portafolio.original.html');
const FF = 'C:/Users/sophi/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe';

const SLOTS = {
  '01': ['v1', 'skincare-1'], '02': ['v2', 'skincare-2'], '03': ['v3', 'skincare-3'], '04': ['v4', 'skincare-4'],
  '05': ['b1', 'bebe-1'],     '06': ['b2', 'bebe-2'],     '07': ['b3', 'bebe-3'],     '08': ['b4', 'bebe-4'],
  '09': ['e1', 'extra-1'],    '10': ['e2', 'extra-2'],    '11': ['e3', 'extra-3'],    '12': ['e4', 'extra-4'],
};

const html = fs.readFileSync(SRC, 'utf8');
function block(type) {
  const tag = '<script type="__bundler/' + type + '">';
  const i = html.indexOf(tag);
  const s = i + tag.length;
  return html.slice(s, html.indexOf('</script>', s)).trim();
}
const manifest = JSON.parse(block('manifest'));
const ext = JSON.parse(block('ext_resources'));
const porId = {};
ext.forEach(r => { porId[r.id] = r.uuid; });

const pedidos = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SLOTS);
fs.mkdirSync(path.join(ROOT, 'uploads'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'posters'), { recursive: true });

for (const n of pedidos) {
  const par = SLOTS[n];
  if (!par) { console.log('  ! slot', n, 'no valido'); continue; }
  const [id, nombre] = par;
  const uuid = porId[id];
  if (!uuid || !manifest[uuid]) { console.log('  ! no esta', id, 'en el bundle'); continue; }

  const bytes = Buffer.from(manifest[uuid].data, 'base64');
  const destino = path.join(ROOT, 'uploads', nombre + '.mp4');
  fs.writeFileSync(destino, bytes);

  const poster = path.join(ROOT, 'posters', nombre + '.jpg');
  try {
    execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', '1', '-i', destino,
      '-frames:v', '1', '-q:v', '4', poster], { stdio: 'pipe' });
  } catch (e) {
    execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', destino,
      '-frames:v', '1', '-q:v', '4', poster], { stdio: 'pipe' });
  }
  console.log('[' + n + '] ' + nombre + '.mp4  ' + (bytes.length / 1048576).toFixed(2) + ' MB  + portada');
}
