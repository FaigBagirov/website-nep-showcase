window.CA = window.CA || {};
window.CA['01b'] = function (cv) {
  var x = cv.getContext('2d'), W = 0, H = 0;
  var labels = ['vakuum', 'doldurma', 'işə salma'];
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function sm(v) { v = cl(v); return v * v * (3 - 2 * v); }
  function mix(a, b, k) { return a + (b - a) * k; }
  function rgb(k, a) {
    return 'rgba(' + Math.round(mix(160, 95, k)) + ',' + Math.round(mix(165, 191, k)) + ',' + Math.round(mix(172, 125, k)) + ',' + a + ')';
  }
  var o = {
    cycle: 10,
    still: 8,
    resize: function (w, h) { W = w; H = h; },
    draw: function (t) {
      x.clearRect(0, 0, W, H);
      var u = (t % o.cycle) / o.cycle, i, k;
      var A = sm(u / 0.05) * (1 - sm((u - 0.92) / 0.07));
      // progress: three stages with short pauses
      var p = 0, loc;
      for (i = 0; i < 3; i++) {
        loc = sm((u - (0.08 + i * 0.22)) / 0.18);
        p += loc / 3;
      }
      x.save();
      x.globalAlpha = A;
      x.lineCap = 'round';
      var L = W * 0.1, R = W * 0.9, w = R - L, y = H * 0.42, seg = w / 3;
      var fs = Math.max(9, Math.min(14, W * 0.032));
      x.font = '300 ' + fs + 'px Inter,Arial,sans-serif';
      while (fs > 7) {
        var ok = true;
        for (i = 0; i < 3; i++) if (x.measureText(labels[i]).width > seg * 0.94) ok = false;
        if (ok) break;
        fs -= 0.5; x.font = '300 ' + fs + 'px Inter,Arial,sans-serif';
      }
      // track
      x.lineWidth = 5; x.strokeStyle = 'rgba(160,165,172,.2)';
      x.beginPath(); x.moveTo(L, y); x.lineTo(R, y); x.stroke();
      // minor ticks
      x.lineWidth = 1; x.strokeStyle = 'rgba(160,165,172,.25)';
      for (i = 0; i <= 30; i++) {
        var mx = L + w * i / 30, th = i % 10 === 0 ? 0 : 3;
        if (!th) continue;
        x.beginPath(); x.moveTo(mx, y + 8); x.lineTo(mx, y + 8 + th); x.stroke();
      }
      // fill
      var fx = L + w * p;
      if (p > 0.002) {
        var gr = x.createLinearGradient(L, 0, R, 0);
        gr.addColorStop(0, 'rgba(35,120,63,.95)'); gr.addColorStop(1, 'rgba(95,191,125,.95)');
        x.strokeStyle = gr; x.lineWidth = 5;
        x.beginPath(); x.moveTo(L, y); x.lineTo(fx, y); x.stroke();
        var hg = x.createRadialGradient(fx, y, 0, fx, y, 14);
        hg.addColorStop(0, 'rgba(95,191,125,' + (0.35 * (1 - sm((p - 0.97) / 0.03))) + ')'); hg.addColorStop(1, 'rgba(95,191,125,0)');
        x.fillStyle = hg; x.fillRect(fx - 14, y - 14, 28, 28);
      }
      // stage ticks, dots, labels
      x.textAlign = 'center'; x.textBaseline = 'top';
      for (i = 0; i < 3; i++) {
        var tx = L + seg * (i + 1), cx = L + seg * (i + 0.5);
        var pass = sm((p - (i + 1) / 3 + 0.03) / 0.04);
        var act = (p > i / 3 && p < (i + 1) / 3) ? 0.25 : 0;
        var kk = Math.max(pass, act);
        // tick dot
        x.fillStyle = 'rgba(27,31,29,1)';
        x.beginPath(); x.arc(tx, y, 6, 0, 6.2832); x.fill();
        x.lineWidth = 1.2; x.strokeStyle = rgb(pass, mix(0.55, 0.95, pass));
        x.beginPath(); x.arc(tx, y, 6, 0, 6.2832); x.stroke();
        if (pass > 0.01) {
          x.fillStyle = 'rgba(95,191,125,' + (0.25 * pass) + ')';
          x.beginPath(); x.arc(tx, y, 6, 0, 6.2832); x.fill();
          x.lineWidth = 1.4; x.strokeStyle = 'rgba(255,255,255,' + (0.85 * pass) + ')';
          x.beginPath(); x.moveTo(tx - 2.6, y); x.lineTo(tx - 0.7, y + 2.2); x.lineTo(tx + 2.8, y - 2.2); x.stroke();
        }
        x.fillStyle = rgb(kk, mix(0.55, 0.95, kk));
        x.fillText(labels[i], cx, y + 22);
        // stage number small
        x.fillStyle = rgb(kk, 0.4);
        x.fillText(String(i + 1), cx, y + 22 + fs * 1.5);
      }
      // percent
      x.textAlign = 'right'; x.textBaseline = 'bottom';
      x.font = '300 ' + Math.max(11, fs * 1.5) + 'px Inter,Arial,sans-serif';
      x.fillStyle = rgb(sm((p - 0.95) / 0.05), 0.7);
      x.fillText(Math.round(p * 100) + '%', R, y - 16);
      x.restore();
    }
  };
  return o;
};
