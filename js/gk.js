'use strict';
/* =====================================================================
   GK — shared kit for the full mini-games (sprites, particles, HUD,
   countdown, input helpers, drawing helpers)
   ===================================================================== */
const GK = {};
GK.ease = { out: t => 1 - Math.pow(1 - t, 3), inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 };
GK.EMOJI_FONT = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';

/* emoji -> cached sprite canvas (crisp, rotatable, fast) */
GK.sprCache = {};
GK.spr = function (e, s) {
  s = Math.max(8, Math.round(s));
  const k = e + '|' + s; let c = GK.sprCache[k]; if (c) return c;
  const dpr = 2, sz = Math.ceil(s * 1.45);
  c = document.createElement('canvas'); c.width = c.height = sz * dpr;
  const x = c.getContext('2d'); x.scale(dpr, dpr); x.font = s + 'px ' + GK.EMOJI_FONT; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(e, sz / 2, sz / 2 + s * .05); c.sz = sz; GK.sprCache[k] = c; return c;
};
GK.draw = function (cx, e, x, y, s, rot, flip, alpha, sx, sy) {
  const c = GK.spr(e, s); const f = s / Math.round(s) * 1;
  cx.save(); cx.translate(x, y); if (rot) cx.rotate(rot); cx.scale((flip ? -1 : 1) * (sx || 1), sy || 1);
  if (alpha != null) cx.globalAlpha = alpha; cx.drawImage(c, -c.sz / 2, -c.sz / 2, c.sz, c.sz); cx.restore();
};

/* canvas with wrapper (for overlays) and pointer mapping */
GK.canvas = function (host, W, H) {
  const wrap = mk('div', 'gk-wrap'); host.appendChild(wrap);
  const cv = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = W * dpr; cv.height = H * dpr; cv.className = 'gcv'; cv.style.aspectRatio = W + '/' + H; wrap.appendChild(cv);
  const cx = cv.getContext('2d'); cx.scale(dpr, dpr);
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; };
  return { wrap, cv, cx, W, H, pos };
};
GK.input = function (K, c, h) {
  let down = false;
  K.on(c.cv, 'pointerdown', e => { e.preventDefault(); down = true; try { c.cv.setPointerCapture(e.pointerId); } catch (_) { } if (h.down) h.down(c.pos(e), e); });
  K.on(c.cv, 'pointermove', e => { if (h.move) h.move(c.pos(e), e, down); });
  const up = e => { const was = down; down = false; if (was && h.up) h.up(c.pos(e), e); };
  K.on(c.cv, 'pointerup', up); K.on(c.cv, 'pointercancel', up);
  return { get down() { return down; } };
};
GK.keys = function (K, onPress) {
  const k = {};
  K.on(document, 'keydown', e => { if (!k[e.code] && onPress) onPress(e.code, e); k[e.code] = true; if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault(); });
  K.on(document, 'keyup', e => { k[e.code] = false; });
  return k;
};

/* HUD above the canvas */
GK.hud = function (host) {
  const h = mk('div', 'gk-hud', '<span class="l"></span><span class="c"></span><span class="r"></span>'); host.appendChild(h);
  const [l, c, r] = h.children;
  return { set(a, b, d) { if (a != null) l.innerHTML = a; if (b != null) c.innerHTML = b; if (d != null) r.innerHTML = d; }, el: h };
};
/* 3-2-1-GO countdown over a wrapper */
GK.count = function (wrap, K, cb, hint) {
  const o = mk('div', 'gk-count'); wrap.appendChild(o); let n = 3;
  const tick = () => {
    if (n > 0) { o.innerHTML = '<b>' + n + '</b>' + (hint ? '<small>' + hint + '</small>' : ''); sfx('tap'); n--; K.after(tick, 620); }
    else { o.innerHTML = '<b>' + ui('gm_go') + '</b>'; sfx('win'); K.after(() => { o.remove(); cb(); }, 480); }
  };
  tick();
};
/* big flash message */
GK.flash = function (wrap, K, text, ms, cls) {
  const o = mk('div', 'gk-flash ' + (cls || ''), text); wrap.appendChild(o); K.after(() => o.remove(), ms || 900);
};

/* particles + floating text + camera shake */
GK.Fx = class {
  constructor() { this.p = []; this.t = []; this.sh = 0; }
  burst(x, y, n, o) {
    o = o || {};
    for (let i = 0; i < n; i++) {
      const a = o.a0 != null ? rnd(o.a0, o.a1) : rnd(0, 6.283), s = rnd(o.spd0 || 40, o.spd || 170);
      this.p.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (o.up || 0), life: o.life || .8, max: o.life || .8, e: o.e, col: o.col || pick(['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#fff']), size: o.size || 5, g: o.g == null ? 320 : o.g });
    }
  }
  text(s, x, y, col, size) { this.t.push({ s, x, y, col: col || '#fff', size: size || 24, life: 1, vy: -46 }); }
  shake(a) { this.sh = Math.max(this.sh, a || .3); }
  update(dt) {
    this.p = this.p.filter(q => { q.life -= dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += q.g * dt; return q.life > 0; });
    this.t = this.t.filter(q => { q.life -= dt; q.y += q.vy * dt; return q.life > 0; }); this.sh = Math.max(0, this.sh - dt);
  }
  begin(cx) { cx.save(); if (this.sh > 0) cx.translate(rnd(-1, 1) * this.sh * 14, rnd(-1, 1) * this.sh * 14); }
  end(cx) { cx.restore(); }
  draw(cx) {
    this.p.forEach(q => { cx.globalAlpha = Math.max(0, q.life / q.max); if (q.e) GK.draw(cx, q.e, q.x, q.y, q.size * 3); else { cx.fillStyle = q.col; cx.beginPath(); cx.arc(q.x, q.y, q.size * (.4 + .6 * q.life / q.max), 0, 7); cx.fill(); } });
    cx.globalAlpha = 1;
    this.t.forEach(q => { cx.globalAlpha = Math.min(1, q.life * 1.8); GK.txt(cx, q.s, q.x, q.y, q.size, q.col); });
    cx.globalAlpha = 1;
  }
};

/* drawing helpers */
GK.txt = function (cx, s, x, y, size, col, align) {
  cx.font = '800 ' + (size || 20) + 'px Rubik,"Segoe UI",Arial,sans-serif'; cx.textAlign = align || 'center'; cx.textBaseline = 'middle';
  cx.lineWidth = Math.max(3, size / 6); cx.strokeStyle = 'rgba(20,10,50,.65)'; cx.lineJoin = 'round'; cx.strokeText(s, x, y); cx.fillStyle = col || '#fff'; cx.fillText(s, x, y);
};
GK.rr = function (cx, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); };
GK.grad = function (cx, W, H, stops, x0, y0, x1, y1) {
  const g = cx.createLinearGradient(x0 || 0, y0 || 0, x1 == null ? 0 : x1, y1 == null ? H : y1);
  stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c)); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
};
GK.shadow = function (cx, x, y, rw, a) { cx.fillStyle = 'rgba(0,0,0,' + (a == null ? .22 : a) + ')'; cx.beginPath(); cx.ellipse(x, y, rw, rw * .28, 0, 0, 7); cx.fill(); };
GK.cloud = function (cx, x, y, s) { cx.fillStyle = 'rgba(255,255,255,.85)'; [[0, 0, 16], [14, -6, 13], [-14, -3, 11], [28, 2, 10]].forEach(p => { cx.beginPath(); cx.arc(x + p[0] * s, y + p[1] * s, p[2] * s, 0, 7); cx.fill(); }); };
GK.bar = function (cx, x, y, w, h, v, col, bg) { cx.fillStyle = bg || 'rgba(0,0,0,.35)'; GK.rr(cx, x, y, w, h, h / 2); cx.fill(); cx.fillStyle = col || '#22c55e'; GK.rr(cx, x, y, Math.max(h, w * clamp(v, 0, 1)), h, h / 2); if (v > .01) cx.fill(); };
GK.lerp = (a, b, t) => a + (b - a) * t;
GK.dist = (a, b, c, d) => Math.hypot(c - a, d - b);

/* SVG art (from art.js) -> Image for canvas games */
GK.artImg = function (id, opts, cb) {
  const svg = artOf(id, opts || {}); const m = /viewBox="0 0 (\d+) (\d+)"/.exec(svg); const w = m ? +m[1] : 200, h = m ? +m[2] : 220;
  const img = new Image(); img.onload = () => cb(img); img.width = w * 2; img.height = h * 2;
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', `<svg width="${w * 2}" height="${h * 2}" `)); return img;
};

/* how-to + score helpers shared by games */
GK.stars100 = (v, lo, hi) => clamp((v - lo) / (hi - lo) * 100, 0, 100);
