window.CA = window.CA || {};
window.CA['04b'] = function (cv) {
  var x = cv.getContext('2d'), W = 0, H = 0;
  var TAU = Math.PI * 2, N = 6, TEETH = 12;
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function sm(v) { v = cl(v); return v * v * (3 - 2 * v); }
  return {
    cycle: 10, still: 8.4,
    resize: function (w, h) { W = w; H = h; },
    draw: function (t) {
      var u = (t % 10) / 10, i, k, m = Math.min(W, H);
      x.clearRect(0, 0, W, H);
      var Ro = m * 0.37, Rg = m * 0.2;
      var cx = Math.min(W * 0.58, W * 0.95 - Ro * 1.1), cy = H * 0.47;
      var g = sm(u / 0.06) * (1 - sm((u - 0.92) / 0.08));
      var p = cl((u - 0.06) / 0.72);
      var rot = t * 0.1; // continuous in t, independent of loop position
      x.save(); x.lineCap = 'round'; x.lineJoin = 'round';
      // orbit
      x.globalAlpha = g * 0.4; x.strokeStyle = 'rgba(160,165,172,.55)'; x.lineWidth = 1;
      x.beginPath(); x.arc(cx, cy, Ro, 0, TAU); x.stroke();
      // gear
      var P = TAU / TEETH, r1 = Rg * 0.83;
      x.globalAlpha = g * 0.8; x.lineWidth = 1.2; x.beginPath();
      for (k = 0; k < TEETH; k++) {
        var a = rot + k * P;
        var pts = [[0, r1], [0.1, r1], [0.2, Rg], [0.45, Rg], [0.55, r1]];
        for (i = 0; i < pts.length; i++) {
          var aa = a + pts[i][0] * P, rr = pts[i][1], px = cx + Math.cos(aa) * rr, py = cy + Math.sin(aa) * rr;
          if (k === 0 && i === 0) x.moveTo(px, py); else x.lineTo(px, py);
        }
      }
      x.closePath(); x.stroke();
      x.globalAlpha = g * 0.45; x.lineWidth = 1;
      x.beginPath(); x.arc(cx, cy, Rg * 0.32, 0, TAU); x.stroke();
      x.beginPath(); x.arc(cx, cy, Rg * 0.6, 0, TAU); x.stroke();
      for (k = 0; k < 6; k++) { // spokes rotate with the gear
        var sa = rot + k * TAU / 6;
        x.globalAlpha = g * 0.25; x.beginPath();
        x.moveTo(cx + Math.cos(sa) * Rg * 0.32, cy + Math.sin(sa) * Rg * 0.32);
        x.lineTo(cx + Math.cos(sa) * Rg * 0.6, cy + Math.sin(sa) * Rg * 0.6); x.stroke();
      }
      // markers
      var rm = Math.max(3.5, Ro * 0.075);
      for (k = 0; k < N; k++) {
        var ma = -Math.PI / 2 + k * TAU / N, mx = cx + Math.cos(ma) * Ro, my = cy + Math.sin(ma) * Ro;
        var lit = sm((p * N - k) / 0.4 + 0.1); if (k === 0) lit = sm((p * N - 5.7) / 0.3);
        x.globalAlpha = g * (1 - lit) * 0.8; x.strokeStyle = 'rgba(160,165,172,.7)'; x.lineWidth = 1;
        x.beginPath(); x.arc(mx, my, rm, 0, TAU); x.stroke();
        if (lit > 0) {
          x.globalAlpha = g * lit; x.fillStyle = '#23783F'; x.strokeStyle = '#5FBF7D'; x.lineWidth = 1.2;
          x.beginPath(); x.arc(mx, my, rm, 0, TAU); x.fill(); x.stroke();
          var c = rm * 0.45; x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 1.2; x.beginPath();
          x.moveTo(mx - c, my); x.lineTo(mx - c * 0.3, my + c * 0.7); x.lineTo(mx + c, my - c * 0.6); x.stroke();
        }
      }
      // travelling dot
      var pa = -Math.PI / 2 + p * TAU, dx = cx + Math.cos(pa) * Ro, dy = cy + Math.sin(pa) * Ro;
      if (p > 0.001) {
        x.strokeStyle = '#23783F'; x.lineWidth = 1.5; x.globalAlpha = g * 0.6;
        x.beginPath(); x.arc(cx, cy, Ro, -Math.PI / 2, pa); x.stroke();
      }
      var da = g * (1 - sm((u - 0.8) / 0.06));
      x.fillStyle = '#5FBF7D'; x.globalAlpha = da * 0.25;
      x.beginPath(); x.arc(dx, dy, rm * 1.8, 0, TAU); x.fill();
      x.globalAlpha = da; x.beginPath(); x.arc(dx, dy, Math.max(2.5, rm * 0.6), 0, TAU); x.fill();
      x.restore();
    }
  };
};
