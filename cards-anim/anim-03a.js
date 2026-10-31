window.CA = window.CA || {};
window.CA['03a'] = function (cv) {
  var x = cv.getContext('2d'), W = 0, H = 0, CYC = 10;
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ss(a, b, v) { v = cl((v - a) / (b - a)); return v * v * (3 - 2 * v); }
  function mix(a, b, k) { return Math.round(a + (b - a) * k); }
  var OFF = [0, 0.04, -0.01, -0.17, -0.06, 0.03, 0.02]; // crooked offsets (x H)
  var N = OFF.length, KINK = 3, JNT = 5;
  function rgba(k, al) {
    return 'rgba(' + mix(160, 95, k) + ',' + mix(165, 191, k) + ',' + mix(172, 125, k) + ',' + al.toFixed(3) + ')';
  }
  return {
    cycle: CYC,
    still: 8.0,
    resize: function (w, h) { W = w; H = h; },
    draw: function (t) {
      var T = t % CYC, u = T / CYC, i;
      x.clearRect(0, 0, W, H);
      var env = ss(0, 0.08, u) * (1 - ss(0.92, 1, u));
      if (env <= 0.001) return;
      var e = ss(0.34, 0.64, u), done = ss(0.62, 0.74, u);
      var X0 = W * 0.1, X1 = W * 0.93, base = H * 0.4, pw = Math.max(7, H * 0.05);
      var P = [];
      for (i = 0; i < N; i++) P.push([X0 + (X1 - X0) * i / (N - 1), base + OFF[i] * H * (1 - e)]);
      // normals
      var A = [], B = [];
      for (i = 0; i < N; i++) {
        var a = P[Math.max(0, i - 1)], b = P[Math.min(N - 1, i + 1)];
        var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = -dy / l, ny = dx / l;
        A.push([P[i][0] + nx * pw / 2, P[i][1] + ny * pw / 2]);
        B.push([P[i][0] - nx * pw / 2, P[i][1] - ny * pw / 2]);
      }
      x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = 1.3;
      var col = rgba(e * 0.45, 0.6 * env);
      x.strokeStyle = col;
      [A, B].forEach(function (L) {
        x.beginPath(); x.moveTo(L[0][0], L[0][1]);
        for (var j = 1; j < N; j++) x.lineTo(L[j][0], L[j][1]);
        x.stroke();
      });
      // joints
      x.lineWidth = 1;
      for (i = 0; i < N; i++) {
        x.strokeStyle = rgba(e * 0.45, 0.55 * env);
        x.beginPath(); x.arc(P[i][0], P[i][1], pw * 0.75, 0, 6.2832); x.stroke();
        x.fillStyle = rgba(e * 0.45, 0.7 * env);
        x.beginPath(); x.arc(P[i][0], P[i][1], 1.6, 0, 6.2832); x.fill();
      }
      // offset sleeve at JNT, slides into place
      var sa = P[JNT - 1], sb = P[JNT + 1];
      var ang = Math.atan2(sb[1] - sa[1], sb[0] - sa[0]);
      var sx = P[JNT][0] + W * 0.035 * (1 - e), sy = P[JNT][1] + H * 0.075 * (1 - e);
      var sl = pw * 2.2, sh = pw * 1.7;
      x.save(); x.translate(sx, sy); x.rotate(ang);
      x.strokeStyle = rgba(done, (0.7) * env); x.lineWidth = 1.4;
      x.beginPath();
      if (x.roundRect) x.roundRect(-sl / 2, -sh / 2, sl, sh, 3); else x.rect(-sl / 2, -sh / 2, sl, sh);
      x.stroke();
      x.restore();
      // defect markers: dashed rings
      var mk = [[P[KINK][0], P[KINK][1], pw * 2.3], [sx, sy, pw * 2.3]];
      var ringA = ss(0.1, 0.22, u);
      for (i = 0; i < 2; i++) {
        var m = mk[i], al = (0.65 * ringA) * env;
        x.strokeStyle = rgba(done, al); x.lineWidth = 1.2;
        x.setLineDash(done > 0.5 ? [] : [4, 4]);
        x.lineDashOffset = -T * 4;
        x.beginPath(); x.arc(m[0], m[1], m[2], 0, 6.2832); x.stroke();
      }
      x.setLineDash([]);
      // check mark draws itself near the fixed joint
      var cp = ss(0.7, 0.84, u), s = Math.min(W, H) * 0.045;
      if (cp > 0) {
        var cx = P[JNT][0], cy = P[JNT][1] - pw * 2.3 - s * 2.2;
        var pts = [[-1.1, 0], [-0.3, 0.9], [1.2, -1]];
        x.strokeStyle = 'rgba(95,191,125,' + (0.95 * env).toFixed(3) + ')'; x.lineWidth = 2;
        x.beginPath(); x.moveTo(cx + pts[0][0] * s, cy + pts[0][1] * s);
        var l1 = 1.1, l2 = 1.9, tot = l1 + l2, d = cp * tot;
        if (d <= l1) {
          var f = d / l1;
          x.lineTo(cx + (pts[0][0] + (pts[1][0] - pts[0][0]) * f) * s, cy + (pts[0][1] + (pts[1][1] - pts[0][1]) * f) * s);
        } else {
          var f2 = (d - l1) / l2;
          x.lineTo(cx + pts[1][0] * s, cy + pts[1][1] * s);
          x.lineTo(cx + (pts[1][0] + (pts[2][0] - pts[1][0]) * f2) * s, cy + (pts[1][1] + (pts[2][1] - pts[1][1]) * f2) * s);
        }
        x.stroke();
      }
    }
  };
};
