window.CA = window.CA || {};
window.CA['02b'] = function (cv) {
  var x = cv.getContext('2d'), W = 0, H = 0, CYC = 10;
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ss(a, b, v) { v = cl((v - a) / (b - a)); return v * v * (3 - 2 * v); }
  function g(p, c, w) { var d = (p - c) / w; return Math.exp(-d * d); }
  // clean PQRST, period 1 s
  function ecg(a) {
    var p = ((a % 1) + 1) % 1;
    return 0.14 * g(p, 0.18, 0.045) - 0.12 * g(p, 0.355, 0.012) + 1.0 * g(p, 0.385, 0.014) -
      0.22 * g(p, 0.415, 0.014) + 0.26 * g(p, 0.62, 0.07);
  }
  // irregular: wobble, dropouts and spikes at fixed times
  function bad(a) {
    var v = 0.30 * Math.sin(a * 7.1) + 0.22 * Math.sin(a * 13.7 + 1.0) + 0.16 * Math.sin(a * 29.3 + 2.0);
    var drop = 1 - 0.95 * (g(a, 1.3, 0.22) + g(a, 3.15, 0.3));
    v *= drop < 0 ? 0 : drop;
    v += 0.95 * g(a, 0.55, 0.03) - 0.8 * g(a, 0.9, 0.025) + 0.7 * g(a, 2.2, 0.03) - 1.0 * g(a, 2.55, 0.025) +
      0.85 * g(a, 3.9, 0.03) - 0.6 * g(a, 4.1, 0.03) + 0.5 * g(a, 4.7, 0.04);
    return v;
  }
  function mix(a, b, k) { return Math.round(a + (b - a) * k); }
  return {
    cycle: CYC,
    still: 7.6,
    resize: function (w, h) { W = w; H = h; },
    draw: function (t) {
      var T = t % CYC, u = T / CYC, i;
      x.clearRect(0, 0, W, H);
      var env = ss(0, 0.07, u) * (1 - ss(0.92, 1, u));
      if (env <= 0.001) return;
      var mx = W * 0.08, my = H * 0.1, cx0 = mx, cx1 = W - mx, cy = H * 0.42, amp = H * 0.22;
      var headX = cx1 - W * 0.04, speed = 70 + W * 0.12; // px per second of signal
      var tspan = 1 / speed; // seconds per px
      // grid
      x.lineWidth = 1;
      var gs = Math.max(18, W / 12), gx, gy;
      x.strokeStyle = 'rgba(160,165,172,' + (0.05 * env).toFixed(3) + ')';
      x.beginPath();
      var off = (T * speed * 0.5) % gs;
      for (gx = cx1 - off; gx >= cx0; gx -= gs) { x.moveTo(gx, my); x.lineTo(gx, H - my); }
      for (gy = cy % gs; gy < H; gy += gs) { if (gy > my && gy < H - my) { x.moveTo(cx0, gy); x.lineTo(cx1, gy); } }
      x.stroke();
      x.strokeStyle = 'rgba(160,165,172,' + (0.12 * env).toFixed(3) + ')';
      x.beginPath(); x.moveTo(cx0, cy); x.lineTo(cx1, cy); x.stroke();
      // trace
      var t0 = 0.4 * CYC, t1 = 0.62 * CYC;
      x.lineWidth = 1.5; x.lineCap = 'round'; x.lineJoin = 'round';
      var px = null, py = 0, step = 2, n = Math.floor((headX - cx0) / step);
      for (i = 0; i <= n; i++) {
        var X = headX - i * step, a = T - i * step * tspan;
        var q = ss(t0, t1, a);
        var v = (1 - q) * bad(a) * 0.9 + q * ecg(a) * 1.0;
        var Y = cy - v * amp;
        if (px !== null) {
          var fade = Math.pow(1 - i / n, 0.8) * env;
          var al = (0.25 + 0.5 * q) * fade;
          x.strokeStyle = 'rgba(' + mix(160, 95, q) + ',' + mix(165, 191, q) + ',' + mix(172, 125, q) + ',' + al.toFixed(3) + ')';
          x.beginPath(); x.moveTo(px, py); x.lineTo(X, Y); x.stroke();
        }
        px = X; py = Y;
        if (i === 0) { var hy = Y, hq = q; }
      }
      // head glow
      var gr = Math.max(8, H * 0.05);
      var hr = mix(190, 95, hq), hg = mix(195, 191, hq), hb = mix(200, 125, hq);
      var rg = x.createRadialGradient(headX, hy, 0, headX, hy, gr * 2.4);
      rg.addColorStop(0, 'rgba(' + hr + ',' + hg + ',' + hb + ',' + (0.55 * env).toFixed(3) + ')');
      rg.addColorStop(1, 'rgba(' + hr + ',' + hg + ',' + hb + ',0)');
      x.fillStyle = rg; x.beginPath(); x.arc(headX, hy, gr * 2.4, 0, 6.2832); x.fill();
      x.fillStyle = 'rgba(' + hr + ',' + hg + ',' + hb + ',' + (0.95 * env).toFixed(3) + ')';
      x.beginPath(); x.arc(headX, hy, 2.4, 0, 6.2832); x.fill();
      x.fillStyle = 'rgba(255,255,255,' + (0.7 * env).toFixed(3) + ')';
      x.beginPath(); x.arc(headX, hy, 1, 0, 6.2832); x.fill();
      // small amplitude ticks at right edge (readout bar)
      var qn = ss(t0, t1, T);
      x.lineWidth = 1;
      x.strokeStyle = 'rgba(' + mix(160, 95, qn) + ',' + mix(165, 191, qn) + ',' + mix(172, 125, qn) + ',' + (0.5 * env).toFixed(3) + ')';
      var bx = cx1 + 0 - 2, bh = amp * (0.5 + 0.5 * qn);
      x.beginPath(); x.moveTo(bx, cy - bh); x.lineTo(bx, cy + bh * 0.4); x.stroke();
    }
  };
};
