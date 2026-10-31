window.CA = window.CA || {};
window.CA['01a'] = function (cv) {
  var x = cv.getContext('2d'), W = 0, H = 0;
  var N = 4;
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function sm(v) { v = cl(v); return v * v * (3 - 2 * v); }
  function mix(a, b, k) { return a + (b - a) * k; }
  function rgb(k, a) { // grey -> green
    return 'rgba(' + Math.round(mix(160, 95, k)) + ',' + Math.round(mix(165, 191, k)) + ',' + Math.round(mix(172, 125, k)) + ',' + a + ')';
  }
  function rr(l, t, w, h, r) {
    x.beginPath();
    x.moveTo(l + r, t); x.lineTo(l + w - r, t); x.arcTo(l + w, t, l + w, t + r, r);
    x.lineTo(l + w, t + h - r); x.arcTo(l + w, t + h, l + w - r, t + h, r);
    x.lineTo(l + r, t + h); x.arcTo(l, t + h, l, t + h - r, r);
    x.lineTo(l, t + r); x.arcTo(l, t, l + r, t, r);
    x.closePath();
  }
  function plen(p) {
    var s = 0, i;
    for (i = 1; i < p.length; i++) s += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    return s;
  }
  function pat(p, d) {
    var i, l;
    for (i = 1; i < p.length; i++) {
      l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
      if (d <= l || i === p.length - 1) {
        var k = l ? cl(d / l) : 0;
        return [mix(p[i - 1][0], p[i][0], k), mix(p[i - 1][1], p[i][1], k)];
      }
      d -= l;
    }
    return p[0];
  }
  var o = {
    cycle: 10,
    still: 7.6,
    resize: function (w, h) { W = w; H = h; },
    draw: function (t) {
      x.clearRect(0, 0, W, H);
      var u = (t % o.cycle) / o.cycle, i, k;
      var A = sm(u / 0.05) * (1 - sm((u - 0.92) / 0.07));
      x.save();
      x.globalAlpha = A;
      x.lineCap = 'round'; x.lineJoin = 'round';
      // outdoor unit
      var ox = W * 0.62, oy = H * 0.07, ow = W * 0.30, oh = H * 0.19;
      x.lineWidth = 1.2; x.strokeStyle = 'rgba(160,165,172,.6)';
      rr(ox, oy, ow, oh, 5); x.stroke();
      var fr = Math.min(ow, oh) * 0.36, fx = ox + ow * 0.5, fy = oy + oh * 0.5;
      x.lineWidth = 1; x.strokeStyle = 'rgba(160,165,172,.5)';
      x.beginPath(); x.arc(fx, fy, fr, 0, 6.2832); x.stroke();
      var rot = t * 1.6;
      x.strokeStyle = 'rgba(95,191,125,.55)';
      for (k = 0; k < 3; k++) {
        var a = rot + k * 2.0944;
        x.beginPath(); x.moveTo(fx, fy);
        x.quadraticCurveTo(fx + Math.cos(a + 0.5) * fr * 0.7, fy + Math.sin(a + 0.5) * fr * 0.7, fx + Math.cos(a + 1.0) * fr * 0.92, fy + Math.sin(a + 1.0) * fr * 0.92);
        x.stroke();
      }
      // pipes
      var tx = W * 0.46, uw = W * 0.30, uh = Math.min(H * 0.095, 30);
      var ux = W * 0.62, ys = [], paths = [], lens = [], s0 = [], D = 0.15, GL = 0.05;
      var startY = oy + oh * 0.5;
      for (i = 0; i < N; i++) {
        ys[i] = H * (0.40 + i * 0.16);
        paths[i] = [[ox, startY], [tx, startY], [tx, ys[i]], [ux, ys[i]]];
        lens[i] = plen(paths[i]);
        s0[i] = 0.07 + i * 0.15;
      }
      x.lineWidth = 1.3; x.strokeStyle = 'rgba(160,165,172,.42)';
      x.beginPath(); x.moveTo(ox, startY); x.lineTo(tx, startY); x.lineTo(tx, ys[N - 1]); x.stroke();
      for (i = 0; i < N; i++) {
        x.beginPath(); x.moveTo(tx, ys[i]); x.lineTo(ux, ys[i]); x.stroke();
      }
      // indoor units
      var g = [], gs = 0;
      for (i = 0; i < N; i++) {
        g[i] = sm((u - s0[i] - D) / GL); gs += g[i];
        var uy = ys[i] - uh / 2;
        if (g[i] > 0.01) {
          var gr = x.createRadialGradient(ux + uw / 2, ys[i], 2, ux + uw / 2, ys[i], uw * 0.7);
          gr.addColorStop(0, 'rgba(95,191,125,' + (0.16 * g[i]) + ')'); gr.addColorStop(1, 'rgba(95,191,125,0)');
          x.fillStyle = gr; x.fillRect(ux - uw * 0.3, ys[i] - uw * 0.7, uw * 1.6, uw * 1.4);
        }
        x.lineWidth = 1.2; x.strokeStyle = rgb(g[i], mix(0.55, 0.9, g[i]));
        rr(ux, uy, uw, uh, 6); x.stroke();
        x.lineWidth = 1; x.strokeStyle = rgb(g[i], 0.35);
        for (k = 0; k < 3; k++) {
          var sy = uy + uh * (0.58 + k * 0.12);
          x.beginPath(); x.moveTo(ux + uw * 0.14, sy); x.lineTo(ux + uw * 0.7, sy); x.stroke();
        }
        x.fillStyle = rgb(g[i], mix(0.5, 1, g[i]));
        x.beginPath(); x.arc(ux + uw * 0.86, uy + uh * 0.3, 2 + g[i] * 1.2, 0, 6.2832); x.fill();
      }
      // flow particles
      for (i = 0; i < N; i++) {
        var q = cl((u - s0[i]) / D);
        if (q <= 0) continue;
        var head = q * lens[i], gap = lens[i] / 9, ph = (u * 3.2 * lens[i]) % gap;
        for (k = 0; k < 9; k++) {
          var d = (k * gap + ph) % lens[i];
          if (d > head) continue;
          var p = pat(paths[i], d), fa = (q < 1 ? 1 : 0.55) * Math.min(1, (head - d) / 6 + 0.3);
          x.fillStyle = 'rgba(95,191,125,' + (0.85 * fa) + ')';
          x.beginPath(); x.arc(p[0], p[1], 1.7, 0, 6.2832); x.fill();
        }
      }
      // gauge
      var gR = Math.min(W * 0.17, H * 0.15), gx = W * 0.2, gy = H * 0.28;
      var v = 0.08 + 0.67 * (gs / N), PI = Math.PI;
      x.lineWidth = 1.2; x.strokeStyle = 'rgba(160,165,172,.5)';
      x.beginPath(); x.arc(gx, gy, gR, PI, 2 * PI); x.closePath(); x.stroke();
      x.lineWidth = 3; x.strokeStyle = 'rgba(35,120,63,.9)';
      x.beginPath(); x.arc(gx, gy, gR * 0.8, PI + PI * 0.6, PI + PI * 0.9); x.stroke();
      x.lineWidth = 1; x.strokeStyle = 'rgba(160,165,172,.55)';
      for (k = 0; k <= 10; k++) {
        var ta = PI + PI * k / 10, c = Math.cos(ta), s = Math.sin(ta), r1 = gR * (k % 5 ? 0.9 : 0.86);
        x.beginPath(); x.moveTo(gx + c * r1, gy + s * r1); x.lineTo(gx + c * gR * 0.97, gy + s * gR * 0.97); x.stroke();
      }
      var na = PI + PI * v, inz = sm((v - 0.55) / 0.1);
      x.lineWidth = 1.5; x.strokeStyle = rgb(inz, 0.95);
      x.beginPath(); x.moveTo(gx, gy); x.lineTo(gx + Math.cos(na) * gR * 0.78, gy + Math.sin(na) * gR * 0.78); x.stroke();
      x.fillStyle = rgb(inz, 0.95);
      x.beginPath(); x.arc(gx, gy, 2.6, 0, 6.2832); x.fill();
      x.restore();
    }
  };
  return o;
};
