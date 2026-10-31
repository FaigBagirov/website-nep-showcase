window.CA = window.CA || {};
window.CA['02a'] = function (cv) {
  var x = cv.getContext('2d'), W = 0, H = 0;
  // traces in board-normalised coords (0..1), orthogonal polylines
  var TR = [
    [[0, .12], [.3, .12], [.3, .3], [.55, .3]],
    [[0, .45], [.2, .45], [.2, .62], [.42, .62]],
    [[0, .86], [.35, .86], [.35, .72], [.6, .72]],
    [[.55, .3], [.7, .3], [.7, .12], [1, .12]],
    [[.58, .5], [.8, .5], [.8, .3], [1, .3]],
    [[.6, .72], [.85, .72], [.85, .55], [1, .55]],
    [[.42, .62], [.42, .5], [.58, .5]],
    [[.3, .12], [.3, 0], [.65, 0]],
    [[.65, 0], [.9, 0], [.9, .12]],
    [[.5, 1], [.5, .86], [.75, .86], [.75, .72]],
    [[.12, .3], [.12, .62]],
    [[.85, .55], [.85, .86], [1, .86]]
  ];
  var IC = [[.42, .34, .16, .24], [.1, .66, .14, .16]];
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function sm(v) { v = cl(v); return v * v * (3 - 2 * v); }
  function mix(a, b, k) { return a + (b - a) * k; }
  function hs(n) { var s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); }
  function plen(p) { var s = 0, i; for (i = 1; i < p.length; i++) s += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return s; }
  function pat(p, d) {
    var i, l;
    for (i = 1; i < p.length; i++) {
      l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
      if (d <= l || i === p.length - 1) { var k = l ? cl(d / l) : 0; return [mix(p[i - 1][0], p[i][0], k), mix(p[i - 1][1], p[i][1], k)]; }
      d -= l;
    }
    return p[0];
  }
  var o = {
    cycle: 11,
    still: 9.2,
    resize: function (w, h) { W = w; H = h; },
    draw: function (t) {
      x.clearRect(0, 0, W, H);
      var u = (t % o.cycle) / o.cycle, i, k, j;
      var A = sm(u / 0.05) * (1 - sm((u - 0.92) / 0.07));
      var sw = sm((u - 0.1) / 0.7);          // sweep progress / cleaning
      var bx = W * 0.08, by = H * 0.07, bw = W * 0.84, bh = H * 0.46;
      var sx = bx + bw * sw;
      x.save();
      x.globalAlpha = A;
      x.lineCap = 'round'; x.lineJoin = 'round';
      // board outline
      x.lineWidth = 1; x.strokeStyle = 'rgba(160,165,172,.18)';
      x.strokeRect(bx - 4, by - 4, bw + 8, bh + 8);
      function P(q) { return [bx + q[0] * bw, by + q[1] * bh]; }
      // ICs
      for (i = 0; i < IC.length; i++) {
        var c = IC[i], il = bx + c[0] * bw, it = by + c[1] * bh, iw = c[2] * bw, ih = c[3] * bh;
        var lit = sm((sx - il) / (iw + 1));
        x.lineWidth = 1.2; x.strokeStyle = 'rgba(' + Math.round(mix(160, 95, lit)) + ',' + Math.round(mix(165, 191, lit)) + ',' + Math.round(mix(172, 125, lit)) + ',' + mix(0.5, 0.75, lit) + ')';
        x.fillStyle = 'rgba(160,165,172,.05)';
        x.fillRect(il, it, iw, ih); x.strokeRect(il, it, iw, ih);
        x.lineWidth = 1;
        for (k = 1; k < 5; k++) {
          var ky = it + ih * k / 5, kx = il + iw * k / 5;
          x.beginPath(); x.moveTo(il - 3, ky); x.lineTo(il, ky); x.moveTo(il + iw, ky); x.lineTo(il + iw + 3, ky); x.stroke();
          x.beginPath(); x.moveTo(kx, it - 3); x.lineTo(kx, it); x.moveTo(kx, it + ih); x.lineTo(kx, it + ih + 3); x.stroke();
        }
      }
      // traces
      for (i = 0; i < TR.length; i++) {
        var tr = TR[i], pts = [];
        for (k = 0; k < tr.length; k++) pts.push(P(tr[k]));
        var mxp = Math.max(pts[0][0], pts[pts.length - 1][0]);
        var mnp = Math.min(pts[0][0], pts[pts.length - 1][0]);
        var lit2 = sm((sx - (mnp + mxp) / 2) / (bw * 0.12));
        x.lineWidth = 1.1;
        x.strokeStyle = 'rgba(' + Math.round(mix(160, 95, lit2 * 0.8)) + ',' + Math.round(mix(165, 191, lit2 * 0.8)) + ',' + Math.round(mix(172, 125, lit2 * 0.8)) + ',' + mix(0.3, 0.55, lit2) + ')';
        x.beginPath(); x.moveTo(pts[0][0], pts[0][1]);
        for (k = 1; k < pts.length; k++) x.lineTo(pts[k][0], pts[k][1]);
        x.stroke();
        x.fillStyle = 'rgba(160,165,172,' + mix(0.5, 0.75, lit2) + ')';
        for (k = 0; k < pts.length; k += pts.length - 1) { x.beginPath(); x.arc(pts[k][0], pts[k][1], 2, 0, 6.2832); x.fill(); }
        // pulses
        var L = plen(pts);
        for (j = 0; j < 2; j++) {
          var d = ((u * 5.5 + hs(i + 1) + j * 0.5) % 1) * L, pp = pat(pts, d);
          var pa = sm((sx - pp[0]) / 14) * 0.9 * sm(u / 0.15);
          if (pa < 0.02) continue;
          x.fillStyle = 'rgba(95,191,125,' + pa + ')';
          x.beginPath(); x.arc(pp[0], pp[1], 2, 0, 6.2832); x.fill();
        }
      }
      // scan line
      if (u > 0.08 && u < 0.88) {
        var sa = sm((u - 0.08) / 0.05) * (1 - sm((u - 0.8) / 0.08));
        var gr = x.createLinearGradient(sx - 22, 0, sx, 0);
        gr.addColorStop(0, 'rgba(95,191,125,0)'); gr.addColorStop(1, 'rgba(95,191,125,' + (0.16 * sa) + ')');
        x.fillStyle = gr; x.fillRect(sx - 22, by - 6, 22, bh + 12 + (H * 0.62 - by - bh) );
        x.lineWidth = 1.3; x.strokeStyle = 'rgba(95,191,125,' + (0.9 * sa) + ')';
        x.beginPath(); x.moveTo(sx, by - 6); x.lineTo(sx, H * 0.93); x.stroke();
      }
      // oscilloscope
      var ox = bx, ow = bw, oy = H * 0.64, oh = H * 0.29, cy = oy + oh / 2, amp = oh * 0.34;
      x.lineWidth = 1; x.strokeStyle = 'rgba(160,165,172,.22)';
      x.strokeRect(ox, oy, ow, oh);
      x.strokeStyle = 'rgba(160,165,172,.12)';
      for (k = 1; k < 6; k++) { x.beginPath(); x.moveTo(ox + ow * k / 6, oy); x.lineTo(ox + ow * k / 6, oy + oh); x.stroke(); }
      x.beginPath(); x.moveTo(ox, cy); x.lineTo(ox + ow, cy); x.stroke();
      var n = Math.max(2, Math.floor(ow / 2)), reveal = sx;
      var cyc = Math.max(3, Math.round(ow / 70)), ph = t * 2.2;
      x.lineWidth = 1.5; x.strokeStyle = 'rgba(95,191,125,.9)';
      x.beginPath();
      var started = false;
      for (i = 0; i <= n; i++) {
        var px = ox + ow * i / n;
        if (px > reveal) break;
        var s = Math.sin(i / n * 6.2832 * cyc + ph);
        var bad = (hs(i) - 0.5) * 1.1 + 0.5 * Math.sin(i * 0.37 + 1.3) + 0.45 * Math.sin(i / n * 6.2832 * cyc * 2.7 + 2) ;
        var ampv = 1 + 0.5 * Math.sin(i * 0.11);
        var local = sm((reveal - px) / (ow * 0.25));    // older (left) part cleaner
        var cln = Math.max(sw * 0.7, local * 0.5 + sw * 0.5);
        cln = sm(cl(cln * 1.0 + (sw > 0.97 ? 1 : 0)));
        var yv = cy - amp * (s * mix(ampv, 1, cln) + bad * (1 - cln) * 0.8);
        yv = Math.max(oy + 2, Math.min(oy + oh - 2, yv));
        if (!started) { x.moveTo(px, yv); started = true; } else x.lineTo(px, yv);
      }
      x.stroke();
      x.restore();
    }
  };
  return o;
};
