/* Carga diferida de video.
   El runtime de la pagina pone a reproducir los 12 videos en bucle apenas
   carga; sin esto el visitante se descarga los ~240 MB completos de una.
   A los videos que no estan a la vista se les quita el src (eso corta la
   descarga) y se les devuelve cuando se acercan a la pantalla.
   Se usa scroll/resize como disparador principal, con IntersectionObserver
   como refuerzo, porque el observer no entrega eventos en todos los
   contextos (pestanas en segundo plano, vistas previas incrustadas). */
(function () {
  var MARGEN = 400; // px de anticipacion antes de entrar en pantalla

  function cerca(v) {
    var r = v.getBoundingClientRect();
    if (!r.width && !r.height) return false;
    var alto = window.innerHeight || document.documentElement.clientHeight;
    return r.top < alto + MARGEN && r.bottom > -MARGEN;
  }

  function dormir(v) {
    var s = v.getAttribute('src');
    if (s) {
      v.setAttribute('data-src', s);
      v.removeAttribute('src');
    }
    if (!v.paused) { try { v.pause(); } catch (e) {} }
    try { v.load(); } catch (e) {} // corta la descarga en curso
  }

  function despertar(v) {
    var d = v.getAttribute('data-src');
    // En el primer render data-src todavia trae el marcador sin sustituir.
    if (d && d.indexOf('{{') >= 0) return;
    if (d && !v.getAttribute('src')) {
      v.setAttribute('src', d);
      try { v.load(); } catch (e) {}
    }
    if (v.paused) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  // La portada viaja en data-poster para que el navegador no intente pedir
  // el marcador "{{ v.poster }}" durante el primer render del template.
  function portada(v) {
    var d = v.getAttribute('data-poster');
    if (!d || d.indexOf('{{') >= 0) return;
    if (v.getAttribute('poster') !== d) v.setAttribute('poster', d);
  }

  function revisar() {
    var vids = document.getElementsByTagName('video');
    for (var i = 0; i < vids.length; i++) {
      var v = vids[i];
      if (!v.getAttribute('data-lazy')) {
        v.setAttribute('data-lazy', '1');
        // evita que cortar la descarga ensucie la consola
        v.addEventListener('error', function (ev) { ev.stopPropagation(); }, true);
        if (io) { try { io.observe(v); } catch (e) {} }
      }
      portada(v);
      if (cerca(v)) despertar(v); else dormir(v);
    }
  }

  var pendiente = false;
  function programar() {
    if (pendiente) return;
    pendiente = true;
    setTimeout(function () { pendiente = false; revisar(); }, 120);
  }

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(programar, { rootMargin: MARGEN + 'px 0px', threshold: 0.01 });
  }

  addEventListener('scroll', programar, { passive: true });
  addEventListener('resize', programar);
  addEventListener('orientationchange', programar);
  addEventListener('load', programar);
  if ('MutationObserver' in window) {
    new MutationObserver(programar).observe(document.documentElement, { childList: true, subtree: true });
  }

  // La maquetacion se acomoda mientras cargan tipografias e imagenes:
  // se repasa unas cuantas veces al principio.
  [0, 200, 600, 1500, 3000].forEach(function (ms) { setTimeout(revisar, ms); });

  window.__revisarVideos = revisar; // util para depurar
})();
