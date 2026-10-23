/* NEP Servis — объёмная заставка логотипа (CSS 3D, без библиотек). Цикл 8.5 с, запуск при появлении в экране,
   prefers-reduced-motion / слабое устройство → финальный кадр. Для проверки: window.nepLogo.seek(секунды). */
(function () {
  var host = document.querySelector('.l3d');
  if (!host) return;
  var DUR = 8.5, LAY = 14;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var weak = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || (navigator.deviceMemory && navigator.deviceMemory <= 2);
  if (host.clientWidth < 600) LAY = 9;
  var scene = document.createElement('div'); scene.className = 'l3d-scene'; scene.setAttribute('aria-hidden', 'true');
  var shadow = document.createElement('div'); shadow.className = 'l3d-shadow';
  host.appendChild(shadow); host.appendChild(scene);
  var veil = document.createElement('div'); veil.className = 'l3d-veil'; host.appendChild(veil);

  function layers(cls, html, n, step, within) {
    var g = document.createElement('div'); g.className = 'l3d-g ' + cls; g.style.transformStyle = 'preserve-3d';
    for (var k = 0; k < n; k++) {
      var l = document.createElement('i'); l.className = 'l3d-l' + (k === 0 ? ' front' : '');
      l.style.transform = 'translateZ(' + (-k * step) + 'px)';
      l.style.zIndex = n - k;
      l.style.setProperty('--br', (1 - k / (n * 1.5)).toFixed(2));
      l.innerHTML = html; g.appendChild(l);
    }
    (within || scene).appendChild(g); return g;
  }
  // буквы: x, y — финальное положение (px от центра); старт — откуда «пролетают»
  var L = [
    { ch: 'N', x: -230, y: -105, s: { x: -1100, y: -420, z: 900, rx: 50, ry: -70, rz: 28 }, d: 0.0 },
    { ch: 'E', x: 0, y: -105, s: { x: 260, y: -560, z: 1100, rx: -55, ry: 45, rz: -34 }, d: 0.25 },
    { ch: 'P', x: 215, y: -105, s: { x: 1200, y: 240, z: 800, rx: 35, ry: 80, rz: 42 }, d: 0.5 }
  ];
  var items = L.map(function (o) {
    var g = layers('ltr', o.ch, LAY, 3.2); g.setAttribute('aria-hidden', 'true'); o.el = g; return o;
  });
  // «servis»
  var sv = layers('srv', 'servis', 6, 2, scene); sv.style.setProperty('--x', '0px'); var SV = { el: sv, x: 0, y: 150, s: { x: 0, y: 700, z: 1200, rx: 70, ry: 0, rz: 0 }, d: 0.9 };
  // завитки (свои): оранжевая и бирюзовая ленты
  var ribO = '<svg viewBox="0 0 700 260" width="540" height="201"><path d="M10 170C150 20 300 230 470 110S640 60 690 30C560 150 420 90 300 200S100 120 10 170Z" fill="#DC8426"/></svg>';
  var ribT = '<svg viewBox="0 0 700 260" width="540" height="201"><path d="M20 210C170 90 320 250 480 150S650 120 690 90C560 210 430 150 310 235S110 170 20 210Z" fill="#005575"/></svg>';
  var RO = { el: layers('rib rib-o', ribO, 8, 2.5), x: 10, y: 5, z0: -40, s: { x: -1400, y: 300, z: 600, rx: 20, ry: 55, rz: -12 }, d: 0.35 };
  var RT = { el: layers('rib rib-t', ribT, 8, 2.5), x: 0, y: 30, z0: -55, s: { x: 1500, y: -300, z: 700, rx: -20, ry: -60, rz: 10 }, d: 0.7 };
  var all = items.concat([SV, RO, RT]);
  all.forEach(function (o) { o.el.style.position = 'absolute'; });

  function ease(x) { x = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - x, 3); }
  function ease2(x) { x = Math.max(0, Math.min(1, x)); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  var scale = 1;
  function fit() { scale = Math.min(1, host.clientWidth / 760); }

  function render(t) {
    t = t % DUR;
    var cam = ease2(t / 4.6);               // отъезд камеры
    var fade = t > 7.6 ? 1 - (t - 7.6) / 0.9 : 1;
    var inFade = t < 0.25 ? t / 0.25 : 1;
    veil.style.opacity = (1 - Math.max(0, Math.min(1, fade * inFade))).toFixed(2);
    scene.style.transform = 'translateZ(' + (-120 + (1 - cam) * 520 + Math.sin(t * 0.7) * 14) + 'px) rotateY(' + ((1 - cam) * -14 + Math.sin(t * 0.6) * 3.2) + 'deg) rotateX(' + ((1 - cam) * 8) + 'deg) scale(' + scale + ')';
    var blurK = 0;
    all.forEach(function (o) {
      var p = ease((t - o.d) / 3.6);
      var q = 1 - p, s = o.s;
      var x = o.x + s.x * q, y = o.y + s.y * q, z = s.z * q + (o.z0 || 0);
      o.el.style.transform = 'translate(-50%,-50%) translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,' + z.toFixed(1) + 'px) rotateX(' + (s.rx * q).toFixed(1) + 'deg) rotateY(' + (s.ry * q).toFixed(1) + 'deg) rotateZ(' + (s.rz * q).toFixed(1) + 'deg)';
      var b = Math.pow(q, 1.6) * 14;
      o.el.style.setProperty('--b', b.toFixed(1) + 'px');
      o.el.style.setProperty('--ca', (q * 9).toFixed(1) + 'px');
      blurK = Math.max(blurK, b);
    });
    shadow.style.opacity = (ease((t - 2.6) / 2) * 0.5 * Math.max(0, Math.min(1, fade))).toFixed(2);
  }

  var t0 = 0, raf = 0, running = false, final = reduce || weak;
  function frame(now) {
    if (!running) return;
    render((now - t0) / 1000);
    raf = requestAnimationFrame(frame);
  }
  var visible = false;
  function start() { if (running || final) return; running = true; host.classList.add('animating'); t0 = performance.now(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); host.classList.remove('animating'); }
  fit(); window.addEventListener('resize', fit);
  host.classList.add('on');
  window.nepLogo = { seek: function (t) { stop(); render(t); }, final: function () { stop(); render(6); } };
  if (final) { render(6); return; }
  render(0);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; visible && !document.hidden ? start() : stop(); }); }, { threshold: 0.3 }).observe(host);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (visible) start(); });
    if (window.matchMedia) { var mq = matchMedia('(prefers-reduced-motion: reduce)'); var onmq = function () { if (mq.matches) { final = true; stop(); render(6); } }; mq.addEventListener ? mq.addEventListener('change', onmq) : mq.addListener(onmq); }
  } else start();
})();
(function(){var c=document.querySelector('.vcard');if(!c)return;var v=c.querySelector('video'),b=c.querySelector('.play');
b.addEventListener('click',function(){c.classList.add('on');v.controls=true;v.play()});
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){v.loop=false}})();
