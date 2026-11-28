// VAO POS · avisos de versión (v1, 26/11/2026). Lo comparten todas las páginas.
// Cada página declara ANTES de este archivo:  window.VAO_PAGINA = { id: 'inventario', nombre: 'Inventario', version: '1' }
//   (opcional) anterior(): versión vista con el sistema viejo · ocupado(): true mientras no conviene interrumpir (p. ej. un cobro)
// B) La primera vez que se abre una versión nueva: «✅ Inventario se actualizó a v2» (verde, unos segundos). La primera vez que se usa, no avisa.
// C) Si la página queda abierta y se publica otra más nueva (versiones.json): «🔄 Hay una versión nueva · Tocá para actualizar».
//    Se revisa al volver a la pestaña y cada 15 minutos. NUNCA recarga sola: recarga solo si se toca el cartel.
(function () {
  'use strict';
  var P = window.VAO_PAGINA;
  if (!P || !P.id || !P.version) return;
  var CLAVE = 'vao_ver_' + P.id, CADA_MS = 15 * 60 * 1000;

  function cmp(a, b) {   // compara '43.51' con '43.5' por partes numéricas: -1 / 0 / 1
    var x = String(a).split('.'), y = String(b).split('.');
    for (var i = 0; i < Math.max(x.length, y.length); i++) {
      var p = Number(x[i] || 0), q = Number(y[i] || 0);
      if (p !== q) return p < q ? -1 : 1;
    }
    return 0;
  }
  window.VAO_VERSION = { cmp: cmp, pagina: P };

  function cartel(id, texto, color, persistente, alTocar) {
    var viejo = document.getElementById(id); if (viejo) viejo.remove();
    var d = document.createElement('div'); d.id = id; d.setAttribute('role', 'status');
    d.style.cssText = 'position:fixed;bottom:124px;left:50%;transform:translateX(-50%);z-index:100000;max-width:min(92vw,420px);width:max-content;box-sizing:border-box;' +   // centrado y abajo, sobre la barra de Cobrar: no tapa botones
      'display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:14px;color:#fff;font:700 14px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;' +
      'box-shadow:0 6px 18px rgba(0,0,0,.25);background:' + color + ';' + (alTocar ? 'cursor:pointer;' : '');
    var t = document.createElement('span'); t.textContent = texto; d.appendChild(t);
    if (persistente) {
      var x = document.createElement('button'); x.type = 'button'; x.textContent = '✕'; x.setAttribute('aria-label', 'Cerrar el aviso');
      x.style.cssText = 'background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;padding:2px 8px;font:inherit;cursor:pointer;';
      x.addEventListener('click', function (e) { e.stopPropagation(); d.remove(); try { sessionStorage.setItem(CLAVE + '_cerrado', String(hayNueva)); } catch (er) {} });
      d.appendChild(x);
    } else setTimeout(function () { d.remove(); }, 4500);
    if (alTocar) d.addEventListener('click', alTocar);
    document.body.appendChild(d);
    return d;
  }

  // B) «se actualizó»
  function avisoActualizada() {
    var ant = null;
    try {
      ant = localStorage.getItem(CLAVE);
      if (!ant && typeof P.anterior === 'function') ant = P.anterior();
      localStorage.setItem(CLAVE, String(P.version));
    } catch (e) { return; }
    if (ant && cmp(ant, P.version) < 0) cartel('vaoVerActualizada', '✅ ' + (P.nombre || 'VAO POS') + ' se actualizó a v' + P.version, '#2E7D32', false, null);
  }

  // C) «hay una versión nueva»
  var hayNueva = null, ultimo = 0;
  function ofrecer() {
    if (!hayNueva) return;
    try { if (sessionStorage.getItem(CLAVE + '_cerrado') === String(hayNueva)) return; } catch (e) {}
    if (typeof P.ocupado === 'function') { var oc = false; try { oc = !!P.ocupado(); } catch (e) { oc = false; } if (oc) { setTimeout(ofrecer, 20000); return; } }
    cartel('vaoVerNueva', '🔄 Versión nueva (v' + hayNueva + ') · Tocá para actualizar', '#1565C0', true, function () {
      if (typeof P.ocupado === 'function') { var oc = false; try { oc = !!P.ocupado(); } catch (e) {} if (oc) return; }
      location.reload();
    });
  }
  function revisar(forzar) {
    if (document.hidden) return;
    var ahora = Date.now(); if (!forzar && ahora - ultimo < 60000) return; ultimo = ahora;
    if (typeof fetch !== 'function') return;
    fetch('versiones.json?t=' + ahora, { cache: 'no-store' })
      .then(function (r) { return r && r.ok ? r.json() : null; })
      .then(function (j) {
        var v = j && j.paginas ? j.paginas[P.id] : null;
        if (v && cmp(P.version, v) < 0) { hayNueva = String(v); ofrecer(); }
      }).catch(function () {});
  }
  window.VAO_VERSION.revisar = revisar;

  function iniciar() {
    avisoActualizada();
    setTimeout(function () { revisar(true); }, 3000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) revisar(false); });
    setInterval(function () { revisar(true); }, CADA_MS);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
