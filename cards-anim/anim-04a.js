window.CA = window.CA || {};
window.CA['04a'] = function (cv) {
  var x = cv.getContext('2d'), W = 0, H = 0;
  var TAU = Math.PI * 2, VIS = [3, 6, 9, 12];
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function sm(v) { v = cl(v); return v * v * (3 - 2 * v); }
  function ang(m) { return -Math.PI / 2 + m * TAU / 12; }
  function num(n, cx, cy, fs, a) {
    if (a <= 0.01) return;
    x.globalAlpha = a; x.fillStyle = 'rgba(190,196,202,1)';
    x.font = '200 ' + fs + 'px Inter,Arial,sans-serif';
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), cx, cy);
  }
  return {
    cycle: 10, still: 8.4,
    resize: function (w, h) { W = w; H = h; },
    draw: function (t) {
      var u = (t % 10) / 10, i, j, a, c, s;
      x.clearRect(0, 0, W, H);
      var m = Math.min(W, H), R = m * 0.34;
      var cx = Math.min(W * 0.58, W * 0.95 - R * 1.2), cy = H * 0.46;
      var g = sm(u / 0.06) * (1 - sm((u - 0.92) / 0.08));
      var p = cl((u - 0.06) / 0.72); p = p * 0.94 + 0.06 * sm(p);
      x.save(); x.lineCap = 'round';
      x.globalAlpha = g * 0.5; x.strokeStyle = 'rgba(160,165,172,.5)'; x.lineWidth = 1;
      x.beginPath(); x.arc(cx, cy, R * 0.74, 0, TAU); x.stroke();
      var cnt = 0, lits = [];
      for (j = 0; j < 4; j++) {
        var l = sm((p * 12 - VIS[j]) / 0.5 + 0.5); if (VIS[j] === 12) l = sm((p * 12 - 11.7) / 0.3);
        lits.push(l); cnt += l;
      }
      for (i = 1; i <= 12; i++) {
        a = ang(i); c = Math.cos(a); s = Math.sin(a);
        var vi = VIS.indexOf(i), lit = vi >= 0 ? lits[vi] : 0, r0 = vi >= 0 ? 0.8 : 0.87;
        x.lineWidth = 1 + lit * 0.6;
        x.strokeStyle = 'rgba(160,165,172,.5)';
        x.globalAlpha = g * (1 - lit); x.beginPath();
        x.moveTo(cx + c * R * r0, cy + s * R * r0); x.lineTo(cx + c * R, cy + s * R); x.stroke();
        if (lit > 0) {
          x.strokeStyle = '#5FBF7D'; x.globalAlpha = g * lit; x.beginPath();
          x.moveTo(cx + c * R * r0, cy + s * R * r0); x.lineTo(cx + c * R, cy + s * R); x.stroke();
          var ck = R * 0.07, mx = cx + c * R * 0.6, my = cy + s * R * 0.6;
          x.lineWidth = 1.4; x.beginPath();
          x.moveTo(mx - ck, my); x.lineTo(mx - ck * 0.3, my + ck * 0.7);
          x.lineTo(mx + ck, my - ck * 0.7); x.stroke();
        }
        x.globalAlpha = g * (0.22 + lit * 0.5);
        x.fillStyle = lit > 0.4 ? '#5FBF7D' : 'rgba(160,165,172,1)';
        x.font = '200 ' + Math.max(7, R * 0.1) + 'px Inter,Arial,sans-serif';
        x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(String(i), cx + c * R * 1.15, cy + s * R * 1.15);
      }
      // trail and travelling dot
      var pa = ang(0) + p * TAU;
      if (p > 0.001) {
        x.strokeStyle = '#23783F'; x.lineWidth = 1.6; x.globalAlpha = g * 0.7;
        x.beginPath(); x.arc(cx, cy, R * 0.74, ang(0), pa); x.stroke();
      }
      var dx = cx + Math.cos(pa) * R * 0.74, dy = cy + Math.sin(pa) * R * 0.74;
      var da = g * (1 - sm((u - 0.8) / 0.06));
      x.globalAlpha = da * 0.25; x.fillStyle = '#5FBF7D';
      x.beginPath(); x.arc(dx, dy, Math.max(6, R * 0.09), 0, TAU); x.fill();
      x.globalAlpha = da; x.beginPath(); x.arc(dx, dy, Math.max(2.5, R * 0.035), 0, TAU); x.fill();
      // centre counter
      var n = Math.floor(cnt + 0.0001), f = cnt - n, fs = R * 0.42;
      if (n >= 4) { n = 4; f = 0; }
      num(n, cx, cy, fs, g * (1 - f) * 0.85);
      if (f > 0) num(n + 1, cx, cy, fs, g * f * 0.85);
      x.restore();
    }
  };
};
