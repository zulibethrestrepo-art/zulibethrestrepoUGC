/* Servidor estatico minimo para revisar el portafolio en local.
   Soporta peticiones Range, necesarias para adelantar/retroceder video. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT) || 4321;
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.mp4': 'video/mp4', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2',
};

http.createServer(function (req, res) {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/Portafolio.html';
  const file = path.join(ROOT, rel.replace(/^[/]+/, ''));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('prohibido'); return; }

  fs.stat(file, function (err, st) {
    if (err || !st.isFile()) {
      console.log('404', rel);
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('no existe: ' + rel);
      return;
    }
    const tipo = TIPOS[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const rango = req.headers.range;
    if (rango && /^bytes=\d*-\d*$/.test(rango)) {
      const p = rango.replace('bytes=', '').split('-');
      const ini = p[0] ? parseInt(p[0], 10) : 0;
      const fin = p[1] ? parseInt(p[1], 10) : st.size - 1;
      res.writeHead(206, {
        'content-type': tipo,
        'content-range': 'bytes ' + ini + '-' + fin + '/' + st.size,
        'accept-ranges': 'bytes',
        'content-length': fin - ini + 1,
      });
      fs.createReadStream(file, { start: ini, end: fin }).pipe(res);
    } else {
      res.writeHead(200, { 'content-type': tipo, 'content-length': st.size, 'accept-ranges': 'bytes' });
      fs.createReadStream(file).pipe(res);
    }
  });
}).listen(PORT, function () {
  console.log('Portafolio en http://localhost:' + PORT + '/Portafolio.html');
});
