/* NEP Servis — поведение страниц. Тексты здесь НЕ хранятся: все строки лежат в html (data-атрибуты форм). */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  clearTimeout(window.__nt); /* скрипт запустился — страховка «показать блоки без JS» больше не нужна */

  /* ---- Появление блоков и счётчик (один раз, ≤1,2 с) ---- */
  const countUp = el => {
    const end = +el.dataset.count;
    if (reduced || !end) return;
    const dur = 1100;
    let t0 = null;
    const step = t => {
      t0 = t0 || t;
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: .15 });
  $$('.rv').forEach(el => io.observe(el));

  /* ---- Фильтр каталога ---- */
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    $$('.card').forEach(card => {
      card.classList.toggle('hide', chip.dataset.f !== 'all' && card.dataset.c !== chip.dataset.f);
    });
  }));

  /* ---- Формы: проверка при уходе из поля, ошибка снимается при исправлении, сообщение на месте ---- */
  const phoneOk = v => {
    const d = v.replace(/\D/g, '');
    return (d.startsWith('994') && d.length === 12) || (d.startsWith('0') && d.length === 10) || d.length === 9;
  };
  const check = (input, form) => {
    const v = input.value.trim();
    let msg = '';
    if (input.name === 'n' && v.length < 2) msg = form.dataset.errName;
    if (input.name === 'p' && !phoneOk(v)) msg = form.dataset.errPhone;
    const err = document.getElementById(input.id + '-e');
    if (err) err.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };
  $$('[data-form]').forEach(form => {
    const fields = $$('input[required]', form);
    fields.forEach(input => {
      input.addEventListener('blur', () => { if (input.value || input.dataset.touched) { input.dataset.touched = '1'; check(input, form); } });
      input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') check(input, form); });
    });
    const again = $('[data-again]', form);
    if (again) again.addEventListener('click', () => {
      form.reset();
      form.classList.remove('is-done');
      $('.form-ok', form).hidden = true;
      fields.forEach(i => { i.removeAttribute('aria-invalid'); delete i.dataset.touched; });
      if (fields[0]) fields[0].focus();
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const bad = fields.filter(i => { i.dataset.touched = '1'; return !check(i, form); });
      if (bad.length) { bad[0].focus(); return; }
      /* Заявка уходит ТОЛЬКО в WhatsApp: wa.me с данными формы (решение заказчика, DESIGN-SPEC §0.1). */
      const val = n => { const f = form.elements[n]; return f ? f.value.trim() : ''; };
      const topic = form.dataset.waTopic || val('s');
      const text = form.dataset.waPrefix + topic + ': ' + [val('n'), val('p'), val('o')].filter(Boolean).join(', ');
      const url = 'https://wa.me/994503308916?text=' + encodeURIComponent(text);
      const ok = $('.form-ok', form);
      $('[data-wa]', ok).href = url;
      form.classList.add('is-done');
      ok.hidden = false;
      ok.setAttribute('tabindex', '-1');
      ok.focus();
      window.open(url, '_blank', 'noopener');
    });
  });

  /* ---- Вентилятор: скорость копится от прокрутки (направление = направление прокрутки), затухает до полной остановки.
          Вечного вращения нет. reduced-motion — вращение выключено. ---- */
  const scene = $('.scene'), grid = $('.hero-grid');
  /* Hero закреплён только если содержимое помещается в окно (WCAG 1.4.12 / увеличенный шрифт) */
  const fit = () => {
    if (!scene || !grid) return;
    if (matchMedia('(max-width:1023px)').matches) { scene.classList.remove('free'); return; }
    scene.classList.toggle('free', grid.offsetHeight + 64 + 32 > innerHeight);
  };
  fit();
  addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  const fan = $('#fan');
  if (!fan || reduced) return;
  const VMAX = 1500, GAIN = 3, TAU = 1.5, STOP = 8;
  let ang = 0, v = 0, last = 0, raf = 0, lastY = scrollY, heroVisible = true;
  const heroOpen = () => scrollY < (scene ? scene.offsetHeight : 0);
  const loop = t => {
    const dt = Math.min((t - last) / 1000, .1);
    last = t;
    v *= Math.exp(-dt / TAU);
    if (Math.abs(v) < STOP) { v = 0; raf = 0; return; }
    ang = (ang + v * dt) % 360;
    fan.setAttribute('transform', 'rotate(' + ang.toFixed(1) + ' 210 190)');
    raf = requestAnimationFrame(loop);
  };
  const kick = () => {
    if (!raf && heroVisible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); }
  };
  addEventListener('scroll', () => {
    const dy = scrollY - lastY;
    lastY = scrollY;
    if (!dy) return;
    /* hero закрыт наезжающей секцией — вращение не нужно, цикл не запускаем */
    heroVisible = heroOpen();
    if (!heroVisible) { v = 0; cancelAnimationFrame(raf); raf = 0; return; }
    v = Math.max(-VMAX, Math.min(VMAX, v + dy * GAIN));
    kick();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else kick(); });
  v = 60; kick(); /* плавный старт при загрузке, затухает за ~3 с */
})();
