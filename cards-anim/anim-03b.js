window.CA = window.CA || {};
window.CA['03b'] = function (cv) {
  var x = cv.getContext('2d'), W = 0, H = 0, CYC = 10;
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ss(a, b, v) { v = cl((v - a) / (b - a)); return v * v * (3 - 2 * v); }
  // glyphs as polylines in a 1 x 2 box (y down)
  var G = {
    E: [[[1, 0], [0, 0], [0, 2], [1, 2]], [[0, 1], [0.8, 1]]],
    '4': [[[0.05, 0], [0.05, 1.15], [1, 1.15]], [[0.78, 0], [0.78, 2]]],
    O: [[[0, 0], [1, 0], [1, 2], [0, 2], [0, 0]]],
    K: [[[0, 0], [0, 2]], [[1, 0], [0, 1.05], [1, 2]]]
  };
  function glyph(ch, ox, oy, gw, gh, col, lw) {
    var S = G[ch], i, j;
    x.strokeStyle = col; x.lineWidth = lw; x.lineCap = 'round'; x.lineJoin = 'round';
    for (i = 0; i < S.length; i++) {
      x.beginPath();
      for (j = 0; j < S[i].length; j++) {
        var px = ox + S[i][j][0] * gw, py = oy + S[i][j][1] * gh / 2;
        if (j) x.lineTo(px, py); else x.moveTo(px, py);
      }
      x.stroke();
    }
  }
  function rr(a, b, w, h, r) {
    x.beginPath();
    if (x.roundRect) x.roundRect(a, b, w, h, r); else x.rect(a, b, w, h);
  }
  return {
    cycle: CYC,
    still: 7.8,
    resize: function (w, h) { W = w; H = h; },
    draw: function (t) {
      var T = t % CYC, u = T / CYC;
      x.clearRect(0, 0, W, H);
      var env = ss(0, 0.08, u) * (1 - ss(0.9, 1, u));
      if (env <= 0.001) return;
      var c = ss(0.42, 0.58, u);
      var sw = W * 0.74, sh = Math.min(H * 0.46, sw * 0.62);
      var sx = W * 0.92 - sw, sy = H * 0.12;
      var cx = sx + sw / 2, cy = sy + sh / 2;
      // frame glow and body
      x.save();
      x.shadowColor = 'rgba(95,191,125,' + (0.9 * c * env).toFixed(3) + ')';
      x.shadowBlur = 18 * c;
      x.strokeStyle = 'rgba(' + Math.round(160 + (95 - 160) * c) + ',' + Math.round(165 + (191 - 165) * c) + ',' +
        Math.round(172 + (125 - 172) * c) + ',' + ((0.5 + 0.3 * c) * env).toFixed(3) + ')';
      x.lineWidth = 1 + 0.5 * c;
      rr(sx, sy, sw, sh, Math.min(14, sh * 0.12)); x.stroke();
      x.restore();
      // inner glow
      var ig = x.createRadialGradient(cx, cy, 0, cx, cy, sw * 0.6);
      ig.addColorStop(0, 'rgba(' + Math.round(160 + (95 - 160) * c) + ',' + Math.round(165 + (191 - 165) * c) + ',' +
        Math.round(172 + (125 - 172) * c) + ',' + ((0.07 + 0.06 * c) * env).toFixed(3) + ')');
      ig.addColorStop(1, 'rgba(95,191,125,0)');
      x.fillStyle = ig; rr(sx + 1, sy + 1, sw - 2, sh - 2, Math.min(14, sh * 0.12)); x.fill();
      // status dot
      x.fillStyle = c > 0.5 ? 'rgba(95,191,125,' + (0.8 * env * c).toFixed(3) + ')' : 'rgba(160,165,172,' + (0.4 * env * (1 - c)).toFixed(3) + ')';
      x.beginPath(); x.arc(sx + sh * 0.14, sy + sh * 0.14, 2.2, 0, 6.2832); x.fill();
      // glyphs
      var gh = sh * 0.46, gw = gh * 0.46, gap = gw * 0.55;
      var gx = cx - (2 * gw + gap) / 2, gy = cy - gh / 2 - sh * 0.04, lw = Math.max(2, gh * 0.09);
      var breath = 0.6 + 0.22 * Math.sin(T * 1.2);
      var ae = (1 - c) * breath * env;
      if (ae > 0.002) {
        var col = 'rgba(175,180,186,' + ae.toFixed(3) + ')';
        glyph('E', gx, gy, gw, gh, col, lw);
        glyph('4', gx + gw + gap, gy, gw, gh, col, lw);
      }
      if (c > 0.002) {
        var ao = c * env;
        x.save();
        x.shadowColor = 'rgba(95,191,125,' + (0.7 * ao).toFixed(3) + ')'; x.shadowBlur = 10;
        var gc = 'rgba(95,191,125,' + ao.toFixed(3) + ')';
        glyph('O', gx, gy, gw, gh, gc, lw);
        glyph('K', gx + gw + gap, gy, gw, gh, gc, lw);
        x.restore();
        // small check, draws itself
        var cp = ss(0.56, 0.7, u), s = sh * 0.05, kx = cx, ky = gy + gh + sh * 0.14;
        if (cp > 0) {
          var pts = [[-1.2, 0], [-0.4, 0.9], [1.3, -1]], l1 = 1.2, l2 = 2.0, d = cp * (l1 + l2);
          x.strokeStyle = 'rgba(95,191,125,' + (0.95 * env).toFixed(3) + ')'; x.lineWidth = 1.8;
          x.beginPath(); x.moveTo(kx + pts[0][0] * s, ky + pts[0][1] * s);
          if (d <= l1) {
            var f = d / l1;
            x.lineTo(kx + (pts[0][0] + (pts[1][0] - pts[0][0]) * f) * s, ky + (pts[0][1] + (pts[1][1] - pts[0][1]) * f) * s);
          } else {
            var f2 = (d - l1) / l2;
            x.lineTo(kx + pts[1][0] * s, ky + pts[1][1] * s);
            x.lineTo(kx + (pts[1][0] + (pts[2][0] - pts[1][0]) * f2) * s, ky + (pts[1][1] + (pts[2][1] - pts[1][1]) * f2) * s);
          }
          x.stroke();
        }
      }
    }
  };
};
