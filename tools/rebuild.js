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
// Los titulos se escriben dentro de comillas simples en el JS de la pagina,
// asi que un apostrofo (Johnson's) romperia el archivo si no se escapa.
function comillaSimple(s) {
  return String(s).replace(/\\/g, BARRA + BARRA).replace(/'/g, BARRA + "'");
}
function listado(nombre, filas) {
  const lineas = filas.map(function (v) {
    return "        { id: '" + v.id + "', num: '" + v.num + "', title: '" + comillaSimple(v.title) +
      "', video: 'uploads/video-" + v.num + ".mp4', poster: 'posters/video-" + v.num + ".jpg' },";
  });
  return NL + '      ' + nombre + ': [' + NL + lineas.join(NL) + NL + '      ],';
}
function regexLista(nombre) {
  return new RegExp(NL + '      ' + nombre + ': \\[[^]*?' + NL + '      \\],');
}
function reemplazarLista(nombre, filas) {
  const re = regexLista(nombre);
  exigir(re.test(t), 'no se encontro el listado ' + nombre);
  t = t.replace(re, listado(nombre, filas));
}
reemplazarLista('videos', CONT.beauty);
reemplazarLista('moreVideos', CONT.bebe);

// extraVideos alimentaba la seccion "Mas videos", que ahora desaparece.
const reExtra = regexLista('extraVideos');
exigir(reExtra.test(t), 'no se encontro el listado extraVideos');
t = t.replace(reExtra, '');
console.log('Listados: Beauty & Lifestyle ' + CONT.beauty.length +
  ', bebe ' + CONT.bebe.length + ' (extraVideos eliminado)');

function cambiar(viejo, nuevo, que) {
  exigir(t.indexOf(viejo) >= 0, 'no se encontro ' + que);
  t = t.replace(viejo, nuevo);
}

// ---------- 3b. estadisticas ----------
// El portafolio traia barras de sexo/ciudades/paises con datos viejos. Se
// reemplazan por el resumen de cifras del media kit, que salen de las
// analiticas nativas de TikTok e Instagram.
const EST = path.join(ROOT, 'tools', 'estadisticas.html');
if (fs.existsSync(EST)) {
  const iniEst = t.indexOf('<section id="estadisticas"');
  exigir(iniEst >= 0, 'no se encontro la seccion de estadisticas');
  const finEst = t.indexOf('</section>', iniEst) + '</section>'.length;
  const nuevo = fs.readFileSync(EST, 'utf8')
    .replace(/^<!--[^]*?-->\s*/, '')   // quitar el comentario de cabecera
    .trimEnd();
  t = t.slice(0, iniEst) + nuevo + t.slice(finEst);

  // Los tres arreglos de barras quedan sin uso.
  ['sexo', 'ciudades', 'paises'].forEach(function (k) {
    const re = regexLista(k);
    exigir(re.test(t), 'no se encontro el listado ' + k);
    t = t.replace(re, '');
  });
  console.log('Estadisticas: resumen del media kit (sexo/ciudades/paises eliminados)');
}

// ---------- 4. renombrar la seccion 03 y ajustar la navegacion ----------
// La antigua seccion "Skincare" pasa a ser la unica de video: "Beauty &
// Lifestyle", con los 12. Al borrar la de "Mas videos", la de bebe queda
// de ultima, que es donde debe ir.
cambiar('>03 — Videos UGC</span>',
  '>03 — Beauty &amp; Lifestyle</span>', 'la etiqueta de la seccion 03');
cambiar('><em style="color:var(--acento,#c26a44)">Skincare</em></h2>',
  '>Beauty &amp; <em style="color:var(--acento,#c26a44)">Lifestyle</em></h2>', 'el titulo de la seccion 03');
cambiar('<sc-for list="{{ videos }}" as="v" hint-placeholder-count="4">',
  '<sc-for list="{{ videos }}" as="v" hint-placeholder-count="12">', 'el contador de la seccion 03');

// Borrar la seccion "Mas videos" completa, con su comentario.
const COMENTARIO = '<!-- ============ MÁS VIDEOS ============ -->';
const iniSec = t.indexOf(COMENTARIO);
exigir(iniSec >= 0, 'no se encontro el comentario de la seccion 05');
const cierreSec = t.indexOf('</section>', t.indexOf('<section id="mas-videos"', iniSec));
exigir(cierreSec > iniSec, 'no se encontro el cierre de la seccion 05');
// El texto anterior ya termina con el salto y la sangria del comentario
// siguiente, asi que se recorta el espacio sobrante del resto.
t = t.slice(0, iniSec) + t.slice(cierreSec + '</section>'.length).replace(/^\s*/, '');
exigir(t.indexOf('mas-videos') < 0 || t.indexOf('<section id="mas-videos"') < 0,
  'quedaron restos de la seccion 05');
// Al desaparecer la 05, las siguientes se corren para que no quede un hueco
// en la numeracion (iba 01, 02, 03, 04, 06...).
[['06 — Estadísticas', '05 — Estadísticas'],
 ['07 — Tarifas', '06 — Tarifas'],
 ['08 — Contacto', '07 — Contacto']].forEach(function (par) {
  cambiar('>' + par[0] + '<', '>' + par[1] + '<', 'la etiqueta "' + par[0] + '"');
});
console.log('Seccion "Mas videos": eliminada; secciones renumeradas 01-07');

// Navegacion: un solo enlace de video, y bebe queda de ultimo.
cambiar('#videos" style="color:#5f544a;text-decoration:none">Videos</a>',
  '#videos" style="color:#5f544a;text-decoration:none">Beauty</a>', 'el enlace de nav a Videos');
cambiar(NL + '      <a href="#mas-videos" style="color:#5f544a;text-decoration:none">Más videos</a>',
  '', 'el enlace de nav a Mas videos');
console.log('Navegacion: "Beauty" y "Bebé", sin "Más videos"');

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
// Dos etiquetas: la de "Beauty & Lifestyle" y la de "Productos para bebe".
exigir(tags === 2 && preloads === 2, 'etiquetas <video> inesperadas (' + tags + '/' + preloads + ')');
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
