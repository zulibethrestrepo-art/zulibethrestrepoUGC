/*
 * Reconstruye Portafolio.html a partir del bundle original:
 *  - saca del HTML los 12 videos que venian incrustados en base64
 *  - reescribe los tres listados de video segun tools/contenido.js
 *  - amplia "Beauty & Lifestyle" a 6 videos y renombra esa seccion
 *  - agrega portada (poster) a cada video
 *  - inyecta tools/lazy.js para que solo se descargue lo que esta a la vista
 *  - reemplaza la foto de perfil PNG por la JPEG optimizada
 *
 * Uso:  node tools/rebuild.js
 * Parte siempre de tools/Portafolio.original.html, asi que se puede repetir.
 */
const fs = require('fs');
const path = require('path');
const CONT = require('./contenido.js');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'tools', 'Portafolio.original.html');
const OUT = path.join(ROOT, 'Portafolio.html');
const PERFIL_OPT = path.join(ROOT, 'tools', 'perfil-opt.jpg');
const LAZY_JS = path.join(ROOT, 'tools', 'lazy.js');

const NL = String.fromCharCode(10);
const BARRA = String.fromCharCode(92);
const VIDEO_IDS = ['v1', 'v2', 'v3', 'v4', 'b1', 'b2', 'b3', 'b4', 'e1', 'e2', 'e3', 'e4'];

// Serializa a JSON escapando "<". Sin esto, un "</script>" dentro del template
// cerraria la etiqueta <script> antes de tiempo y romperia toda la pagina.
function jsonSeguro(v) {
  return JSON.stringify(v).replace(/</g, BARRA + 'u003C');
}

function exigir(cond, mensaje) {
  if (!cond) throw new Error('rebuild: ' + mensaje);
}

if (!fs.existsSync(SRC)) {
  throw new Error('falta ' + SRC + NL +
    'Recuperalo del historial:  git show <commit>:Portafolio.html > tools/Portafolio.original.html');
}
const html = fs.readFileSync(SRC, 'utf8');

function block(type) {
  const tag = '<script type="__bundler/' + type + '">';
  const i = html.indexOf(tag);
  exigir(i >= 0, 'no se encontro el bloque ' + type);
  const start = i + tag.length;
  const end = html.indexOf('</script>', start);
  return { start: start, end: end, text: html.slice(start, end).trim() };
}
const mB = block('manifest');
const eB = block('ext_resources');
const tB = block('template');

const manifest = JSON.parse(mB.text);
const ext = JSON.parse(eB.text);
let t = JSON.parse(tB.text);

// ---------- 1. sacar los videos del bundle ----------
const drop = new Set(ext.filter(r => VIDEO_IDS.includes(r.id)).map(r => r.uuid));
let liberado = 0;
for (const uuid of drop) {
  if (manifest[uuid]) {
    liberado += Buffer.from(manifest[uuid].data, 'base64').length;
    delete manifest[uuid];
  }
}
const extNuevo = ext.filter(r => !VIDEO_IDS.includes(r.id));
console.log('Videos sacados del bundle:', drop.size, '(' + (liberado / 1048576).toFixed(2) + ' MB)');

// ---------- 2. foto de perfil optimizada ----------
if (fs.existsSync(PERFIL_OPT)) {
  const perfil = ext.find(r => r.id === 'perfil');
  if (perfil && manifest[perfil.uuid]) {
    const antes = Buffer.from(manifest[perfil.uuid].data, 'base64').length;
    const jpg = fs.readFileSync(PERFIL_OPT);
    manifest[perfil.uuid].data = jpg.toString('base64');
    manifest[perfil.uuid].mime = 'image/jpeg';
    console.log('Foto de perfil:', (antes / 1048576).toFixed(2), 'MB PNG ->', (jpg.length / 1024).toFixed(0), 'KB JPEG');
  }
}

// ---------- 3. reescribir los listados de video ----------
function listado(nombre, filas) {
  const lineas = filas.map(function (v) {
    return "        { id: '" + v.id + "', num: '" + v.num + "', title: '" + v.title +
      "', video: 'uploads/" + v.file + ".mp4', poster: 'posters/" + v.file + ".jpg' },";
  });
  return NL + '      ' + nombre + ': [' + NL + lineas.join(NL) + NL + '      ],';
}
function reemplazarLista(nombre, filas) {
  const re = new RegExp(NL + '      ' + nombre + ': \\[[^]*?' + NL + '      \\],');
  exigir(re.test(t), 'no se encontro el listado ' + nombre);
  t = t.replace(re, listado(nombre, filas));
}
reemplazarLista('videos', CONT.skincare);
reemplazarLista('moreVideos', CONT.bebe);
reemplazarLista('extraVideos', CONT.beauty);
console.log('Listados reescritos: skincare ' + CONT.skincare.length +
  ', bebe ' + CONT.bebe.length + ', beauty ' + CONT.beauty.length);

// ---------- 4. renombrar la seccion 05 y ajustar la navegacion ----------
function cambiar(viejo, nuevo, que) {
  exigir(t.indexOf(viejo) >= 0, 'no se encontro ' + que);
  t = t.replace(viejo, nuevo);
}
cambiar('>05 — Más videos</span>',
  '>05 — Beauty &amp; Lifestyle</span>', 'la etiqueta de la seccion 05');
cambiar('>Más <em style="color:var(--acento,#c26a44)">videos</em></h2>',
  '>Beauty &amp; <em style="color:var(--acento,#c26a44)">Lifestyle</em></h2>', 'el titulo de la seccion 05');
cambiar('#videos" style="color:#5f544a;text-decoration:none">Videos</a>',
  '#videos" style="color:#5f544a;text-decoration:none">Skincare</a>', 'el enlace de nav a Videos');
cambiar('#mas-videos" style="color:#5f544a;text-decoration:none">Más videos</a>',
  '#mas-videos" style="color:#5f544a;text-decoration:none">Beauty</a>', 'el enlace de nav a Mas videos');
cambiar('<sc-for list="{{ extraVideos }}" as="e" hint-placeholder-count="4">',
  '<sc-for list="{{ extraVideos }}" as="e" hint-placeholder-count="6">', 'el contador de la seccion 05');

// La reja de la seccion 05 pasa a 3 columnas: con 6 videos quedan dos filas
// parejas de 3, en vez de una de 4 y otra de 2 a medio llenar.
const REJA = 'grid-template-columns:repeat(4,1fr)';
const marca = t.indexOf('{{ extraVideos }}');
exigir(marca > 0, 'no se ubico la seccion 05');
const posReja = t.lastIndexOf(REJA, marca);
exigir(posReja > 0, 'no se ubico la reja de la seccion 05');
t = t.slice(0, posReja) + 'grid-template-columns:repeat(3,1fr)' + t.slice(posReja + REJA.length);
console.log('Seccion 05: renombrada a "Beauty & Lifestyle", ampliada a 6 videos en reja de 3');

// ---------- 5. poster en las etiquetas <video> y descarga diferida ----------
// El video y la portada viajan en data-src / data-poster, no en src / poster.
// Durante el primer render el runtime pinta el template sin sustituir, y un
// src="{{ v.video }}" hace que el navegador pida esa ruta literal y falle con
// 404. Ademas asi ningun video puede empezar a descargarse antes de que
// lazy.js decida que esta a la vista.
let tags = 0;
t = t.replace(/src="\{\{ ([vme])\.video \}\}"/g, function (m, k) {
  tags++;
  return 'data-src="{{ ' + k + '.video }}" data-poster="{{ ' + k + '.poster }}"';
});
const preloads = (t.match(/preload="metadata"/g) || []).length;
t = t.replace(/preload="metadata"/g, 'preload="none"');
exigir(tags === 3 && preloads === 3, 'etiquetas <video> inesperadas (' + tags + '/' + preloads + ')');
console.log('Etiquetas <video> con poster: ' + tags + ' | preload diferido: ' + preloads);

// ---------- 6. script de carga diferida ----------
const LAZY = NL + '<script>' + NL + fs.readFileSync(LAZY_JS, 'utf8').trim() + NL + '</script>' + NL;
const cierre = t.lastIndexOf('</body>');
exigir(cierre >= 0, 'no se encontro </body>');
t = t.slice(0, cierre) + LAZY + t.slice(cierre);
console.log('Script de carga diferida: insertado');

// ---------- 7. rearmar el archivo ----------
const salida =
  html.slice(0, mB.start) + NL + jsonSeguro(manifest) + NL +
  html.slice(mB.end, eB.start) + NL + jsonSeguro(extNuevo) + NL +
  html.slice(eB.end, tB.start) + NL + jsonSeguro(t) + NL +
  html.slice(tB.end);

fs.writeFileSync(OUT, salida);
console.log(NL + 'Portafolio.html: ' + (html.length / 1048576).toFixed(2) +
  ' MB -> ' + (salida.length / 1048576).toFixed(2) + ' MB');
