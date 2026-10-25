'use strict';
/* =====================================================================
   3D builders (VIP): realistic apartments, furniture, textures, people.
   Exposes window.W3D for world3d.js.  (three.js r128)
   ===================================================================== */
(function () {
  if (typeof THREE === 'undefined') { window.W3D = null; return; }
  const D = { scene: null, built: false, baseSolids: 0 }, solids = [];
  const C = h => new THREE.Color(h).convertSRGBToLinear();
  const cache = {};
  function mat(c, o) {
    const k = c + (o ? JSON.stringify(o) : ''); if (cache[k]) return cache[k];
    const p = Object.assign({ roughness: .75, metalness: 0 }, o || {}); p.color = C(c); if (p.emissive != null) p.emissive = C(p.emissive);
    return cache[k] = new THREE.MeshStandardMaterial(p);
  }
  function tex(draw, w, h, rx, ry) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx || 1, ry || 1); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t;
  }
  const rr = (a, b) => a + Math.random() * (b - a);
  /* ---------- procedural textures ---------- */
  const TEX = {
    wood: (rx, ry) => tex((c, w, h) => {
      const pal = ['#b5793f', '#a86d38', '#bd8346', '#a2672f', '#b97f42', '#ad7239']; const ph = h / 8;
      for (let i = 0; i < 8; i++) {
        c.fillStyle = pal[i % pal.length]; c.fillRect(0, i * ph, w, ph);
        for (let k = 0; k < 40; k++) { c.strokeStyle = `rgba(70,35,10,${rr(.04, .13)})`; c.lineWidth = rr(.6, 1.6); c.beginPath(); const y = i * ph + rr(2, ph - 2); c.moveTo(0, y); c.bezierCurveTo(w * .3, y + rr(-3, 3), w * .6, y + rr(-3, 3), w, y + rr(-2, 2)); c.stroke(); }
        if (Math.random() < .6) { c.fillStyle = 'rgba(70,35,10,.28)'; c.beginPath(); c.ellipse(rr(40, w - 40), i * ph + ph / 2, rr(5, 9), rr(2, 4), 0, 0, 7); c.fill(); }
        c.fillStyle = 'rgba(30,12,0,.5)'; c.fillRect(0, i * ph, w, 2); c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(0, i * ph + 2, w, 2);
        const sx = rr(60, w - 60); c.fillStyle = 'rgba(30,12,0,.45)'; c.fillRect(sx, i * ph, 2, ph);
      }
    }, 512, 512, rx || 4, ry || 4),
    tile: (rx, ry, a, b) => tex((c, w, h) => {
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.fillStyle = (i + j) % 2 ? (b || '#e3d7ba') : (a || '#f6eedc'); c.fillRect(i * 64, j * 64, 64, 64); }
      c.strokeStyle = '#b9ae92'; c.lineWidth = 3; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64, 256); c.moveTo(0, i * 64); c.lineTo(256, i * 64); c.stroke(); }
      for (let k = 0; k < 400; k++) { c.fillStyle = `rgba(0,0,0,${rr(.02, .06)})`; c.fillRect(rr(0, 256), rr(0, 256), 2, 2); }
    }, 256, 256, rx || 4, ry || 4),
    paint: (base, stripe, rx, ry) => tex((c, w, h) => {
      c.fillStyle = base; c.fillRect(0, 0, w, h);
      if (stripe) { c.fillStyle = stripe; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h); }
      for (let k = 0; k < 900; k++) { c.fillStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '0,0,0'},${rr(.015, .045)})`; c.fillRect(rr(0, w), rr(0, h), rr(1, 3), rr(1, 3)); }
    }, 128, 128, rx || 3, ry || 1),
    carpet: (c1, c2, rx, ry) => tex((c, w, h) => { c.fillStyle = c1; c.fillRect(0, 0, w, h); for (let k = 0; k < 1800; k++) { c.fillStyle = c2; c.globalAlpha = rr(.1, .35); c.fillRect(rr(0, w), rr(0, h), 2, 2); } c.globalAlpha = 1; }, 128, 128, rx || 2, ry || 8),
    rug: (c1, c2, c3) => tex((c, w, h) => {
      c.fillStyle = c1; c.fillRect(0, 0, w, h); c.strokeStyle = c2; c.lineWidth = 10; c.strokeRect(14, 14, w - 28, h - 28); c.strokeStyle = c3; c.lineWidth = 4; c.strokeRect(34, 34, w - 68, h - 68);
      c.fillStyle = c2; c.beginPath(); c.moveTo(w / 2, 56); c.lineTo(w - 56, h / 2); c.lineTo(w / 2, h - 56); c.lineTo(56, h / 2); c.fill(); c.fillStyle = c3; c.beginPath(); c.moveTo(w / 2, 90); c.lineTo(w - 90, h / 2); c.lineTo(w / 2, h - 90); c.lineTo(90, h / 2); c.fill();
      for (let k = 0; k < 600; k++) { c.fillStyle = 'rgba(0,0,0,.05)'; c.fillRect(rr(0, w), rr(0, h), 2, 2); }
    }, 256, 256, 1, 1),
    books: () => tex((c, w, h) => { c.fillStyle = '#3b2a1a'; c.fillRect(0, 0, w, h); let x = 2; const cols = ['#b91c1c', '#1d4ed8', '#15803d', '#a16207', '#7e22ce', '#0f766e', '#be185d', '#374151', '#ea580c']; while (x < w - 6) { const bw = rr(5, 11), bh = rr(h * .55, h * .92); c.fillStyle = cols[Math.floor(Math.random() * cols.length)]; c.fillRect(x, h - bh, bw, bh); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x + 1, h - bh + 6, bw - 2, 2); x += bw + 1; } }, 128, 64, 1, 1),
    screen: () => tex((c, w, h) => { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#5cb2ff'); g.addColorStop(1, '#6a4cff'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(w * .3, h * .45, h * .22, 0, 7); c.fill(); c.fillStyle = '#ffd23f'; c.fillRect(w * .52, h * .3, w * .36, h * .1); c.fillStyle = '#fff'; c.fillRect(w * .52, h * .5, w * .3, h * .07); }, 128, 72, 1, 1),
    foos: () => tex((c, w, h) => { c.fillStyle = '#2f8f48'; c.fillRect(0, 0, w, h); c.strokeStyle = '#fff'; c.lineWidth = 3; c.strokeRect(6, 6, w - 12, h - 12); c.beginPath(); c.moveTo(w / 2, 6); c.lineTo(w / 2, h - 6); c.stroke(); c.beginPath(); c.arc(w / 2, h / 2, h * .2, 0, 7); c.stroke(); }, 256, 128, 1, 1),
    plaque: (txt, bg) => tex((c, w, h) => { c.fillStyle = bg || '#caa24a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#6b4e12'; c.lineWidth = 4; c.strokeRect(3, 3, w - 6, h - 6); c.fillStyle = '#3a2706'; c.font = 'bold 44px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w / 2, h / 2 + 2); }, 128, 64, 1, 1),
    sky: () => tex((c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#6ab7ff'); g.addColorStop(1, '#d6efff'); c.fillStyle = g; c.fillRect(0, 0, w, h); for (let i = 0; i < 14; i++) { c.fillStyle = `hsl(${210 + Math.random() * 30},20%,${55 + Math.random() * 25}%)`; const bw = rr(14, 30), bh = rr(30, 100); c.fillRect(i * 20 + rr(-4, 4), h - bh, bw, bh); for (let k = 0; k < 6; k++) { c.fillStyle = 'rgba(255,240,170,.8)'; c.fillRect(i * 20 + rr(2, bw - 5), h - bh + rr(4, bh - 8), 3, 4); } } }, 256, 128, 1, 1)
  };

  /* ---------- helpers ---------- */
  function add(o) { D.scene.add(o); return o; }
  function grp(x, y, z, ry) { const g = new THREE.Group(); g.position.set(x, y || 0, z); g.rotation.y = ry || 0; add(g); return g; }
  function bx(g, w, h, d, color, x, y, z, o) { o = o || {}; const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.m || mat(color, o.mo)); m.position.set(x, y, z); m.castShadow = !o.ns; m.receiveShadow = true; g.add(m); return m; }
  function cy(g, rt, rb, h, color, x, y, z, o) { o = o || {}; const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg || 20), o.m || mat(color, o.mo)); m.position.set(x, y, z); if (o.rx) m.rotation.x = o.rx; if (o.rz) m.rotation.z = o.rz; m.castShadow = !o.ns; m.receiveShadow = true; g.add(m); return m; }
  function sp(g, r, color, x, y, z, sx, sy, sz, o) { o = o || {}; const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), o.m || mat(color, o.mo)); m.position.set(x, y, z); m.scale.set(sx || 1, sy || 1, sz || 1); m.castShadow = !o.ns; m.receiveShadow = true; g.add(m); return m; }
  function rgeo(w, h, d, r) {
    const s = new THREE.Shape(), q = Math.min(r, w / 2 - .001, h / 2 - .001);
    s.moveTo(-w / 2 + q, -h / 2); s.lineTo(w / 2 - q, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + q); s.lineTo(w / 2, h / 2 - q); s.quadraticCurveTo(w / 2, h / 2, w / 2 - q, h / 2); s.lineTo(-w / 2 + q, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - q); s.lineTo(-w / 2, -h / 2 + q); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + q, -h / 2);
    const dp = Math.max(.01, d - q * 1.2), g = new THREE.ExtrudeGeometry(s, { depth: dp, bevelEnabled: true, bevelThickness: q * .6, bevelSize: q * .6, bevelSegments: 3, curveSegments: 6 }); g.translate(0, 0, -dp / 2); return g;
  }
  function rb(g, w, h, d, r, color, x, y, z, o) { o = o || {}; const m = new THREE.Mesh(rgeo(w, h, d, r), o.m || mat(color, o.mo)); m.position.set(x, y, z); m.castShadow = !o.ns; m.receiveShadow = true; g.add(m); return m; }
  function solid(x, z, w, d) { solids.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2 }); }
  const blocked = (x, z, r) => solids.some(s => x > s.x0 - r && x < s.x1 + r && z > s.z0 - r && z < s.z1 + r);

  /* ---------- furniture ---------- */
  function sofa(x, z, ry, color, w, o) {
    o = o || {}; w = w || 4.2; const g = grp(x, 0, z, ry), fab = { roughness: .92 };
    rb(g, w, .5, 1.3, .12, color, 0, .45, 0, { mo: fab }); rb(g, w, .85, .38, .14, color, 0, .95, -.5, { mo: fab });
    [-1, 1].forEach(s => rb(g, .38, .75, 1.3, .12, color, s * (w / 2 - .19), .75, 0, { mo: fab }));
    const n = Math.round((w - .8) / 1.15); for (let i = 0; i < n; i++) { const cw = (w - .8) / n; rb(g, cw - .06, .24, 1.0, .1, color, -w / 2 + .4 + cw * (i + .5), .78, .1, { mo: fab }); }
    [-1, 1].forEach(s => [-1, 1].forEach(t => cy(g, .05, .04, .14, '#3a2414', s * (w / 2 - .12), .07, t * .5)));
    if (o.pillow) { rb(g, .5, .5, .16, .08, o.pillow, -w / 2 + .75, 1.0, -.1, { mo: fab }).rotation.z = .3; }
    return g;
  }
  function armchair(x, z, ry, color, o) {
    o = o || {}; const g = grp(x, 0, z, ry), fab = { roughness: .9 };
    rb(g, 1.5, .5, 1.5, .14, color, 0, .45, 0, { mo: fab }); rb(g, 1.5, 1.0, .4, .16, color, 0, .95, -.55, { mo: fab }); rb(g, .32, .75, 1.5, .12, color, -.59, .75, 0, { mo: fab }); rb(g, .32, .75, 1.5, .12, color, .59, .75, 0, { mo: fab });
    rb(g, 1.0, .22, 1.0, .1, color, 0, .75, .08, { mo: fab }); if (o.foot) { rb(g, 1.0, .2, .7, .08, color, 0, .3, 1.0, { mo: fab }).rotation.x = -.15; }
    [-1, 1].forEach(s => [-1, 1].forEach(t => cy(g, .05, .04, .14, '#2a1a0e', s * .6, .07, t * .6)));
    return g;
  }
  function tvUnit(x, z, ry) {
    const g = grp(x, 0, z, ry); bx(g, 3.2, .62, .85, '#5b3b1d', 0, .31, 0, { mo: { roughness: .55 } }); bx(g, 3.0, .04, .8, '#7a5230', 0, .63, 0); [-1.2, 0, 1.2].forEach(i => bx(g, .8, .46, .02, '#4a2f16', i, .31, .43));
    bx(g, 2.0, 1.1, .1, '#0b0d12', 0, 1.25, -.1, { mo: { roughness: .3 } }); bx(g, 1.84, .95, .02, 0, 0, 1.25, -.04, { m: new THREE.MeshStandardMaterial({ map: TEX.screen(), emissive: C('#9ec5ff'), emissiveMap: TEX.screen(), emissiveIntensity: .75, roughness: .25 }) });
    bx(g, .6, .04, .3, '#111', 0, .66, .1); return g;
  }
  function fridge(x, z, ry) {
    const g = grp(x, 0, z, ry), M = { roughness: .35, metalness: .25 }; bx(g, 1.5, 2.3, 1.4, '#e8edf2', 0, 1.15, 0, { mo: M }); bx(g, 1.46, .03, 1.38, '#cbd5e1', 0, 1.55, .02); bx(g, .06, .8, .08, '#9ca3af', .52, 1.9, .72); bx(g, .06, .9, .08, '#9ca3af', .52, .95, .72);
    [['#ef4444', -.4, 1.9], ['#3b82f6', -.2, 1.75], ['#fbbf24', .1, 1.95]].forEach(m => bx(g, .12, .12, .02, m[0], m[1], m[2], .72, { ns: true })); bx(g, .5, .35, .01, '#fff', -.3, 1.2, .71, { ns: true }); return g;
  }
  function counter(x, z, ry, len, o) {
    o = o || {}; const g = grp(x, 0, z, ry); bx(g, len, .86, .9, o.cab || '#f3efe6', 0, .43, 0, { mo: { roughness: .5 } }); bx(g, len + .06, .06, .96, o.top || '#8b8f96', 0, .89, 0, { mo: { roughness: .25, metalness: .2 } });
    const n = Math.max(1, Math.round(len / .9)); for (let i = 0; i < n; i++) { const px = -len / 2 + (i + .5) * len / n; bx(g, len / n - .06, .5, .02, '#e5ded0', px, .45, .46); bx(g, .1, .02, .03, '#9ca3af', px, .62, .48); }
    if (o.stove) { [[-.25, -.1], [.25, -.1], [-.25, .22], [.25, .22]].forEach(p => cy(g, .13, .13, .02, '#111827', o.stove + p[0], .93, p[1])); bx(g, .9, .26, .06, '#d1d5db', o.stove, 1.3, -.4); }
    if (o.sink) { bx(g, .7, .04, .5, '#cbd5e1', o.sink, .92, 0); cy(g, .02, .02, .35, '#9ca3af', o.sink, 1.05, -.3); }
    return g;
  }
  function table(x, z, r, h, color) {
    const g = grp(x, 0, z, 0); cy(g, r, r, .06, color || '#c58a52', 0, h || .78, 0, { mo: { roughness: .45 }, seg: 28 }); cy(g, .07, .09, h || .78, '#6b4a2b', 0, (h || .78) / 2, 0); cy(g, r * .5, r * .5, .04, '#6b4a2b', 0, .03, 0); return g;
  }
  function chair(x, z, ry, color) {
    const g = grp(x, 0, z, ry); rb(g, .46, .06, .46, .03, color || '#7c2d12', 0, .46, 0); bx(g, .46, .5, .05, color || '#7c2d12', 0, .74, -.2); [-1, 1].forEach(s => [-1, 1].forEach(t => cy(g, .025, .02, .46, '#4a2a14', s * .19, .23, t * .19))); return g;
  }
  function bookshelf(x, z, ry, w) {
    const g = grp(x, 0, z, ry); bx(g, w, 1.95, .7, '#6b4a2b', 0, .98, 0, { mo: { roughness: .6 } }); const bt = TEX.books(); [.35, .8, 1.25, 1.7].forEach(y => { bx(g, w - .14, .36, .5, 0, 0, y, .12, { m: new THREE.MeshStandardMaterial({ map: bt, roughness: .8 }) }); bx(g, w - .1, .04, .62, '#8b5e34', 0, y - .2, .06); });
    return g;
  }
  function plant(x, z, s) {
    const g = grp(x, 0, z, 0); s = s || 1; cy(g, .32 * s, .24 * s, .5 * s, '#9a5a2e', 0, .25 * s, 0, { mo: { roughness: .8 } }); cy(g, .28 * s, .28 * s, .04, '#3b2a1a', 0, .5 * s, 0);
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, m = sp(g, .22 * s, i % 2 ? '#2f8f46' : '#3fa857', Math.cos(a) * .22 * s, (.85 + (i % 3) * .1) * s, Math.sin(a) * .22 * s, 1, 1.5, .5); m.rotation.y = -a; m.rotation.z = Math.cos(a) * .3; } return g;
  }
  function lamp(x, z, h, warm) {
    const g = grp(x, 0, z, 0); cy(g, .18, .22, .06, '#444', 0, .03, 0); cy(g, .025, .025, h || 1.5, '#555', 0, (h || 1.5) / 2, 0); cy(g, .12, .2, .3, '#fde9b8', 0, (h || 1.5) + .05, 0, { mo: { emissive: '#ffd27a', emissiveIntensity: .7, roughness: .9 } });
    if (warm) { const l = new THREE.PointLight(0xffd9a0, .8, 9); l.position.set(0, (h || 1.5) + .1, 0); g.add(l); } return g;
  }
  function frame(x, y, z, ry, w, h, content) {
    const g = grp(x, y, z, ry); bx(g, w + .1, h + .1, .05, '#6b4a2b', 0, 0, 0); bx(g, w, h, .03, content || '#fff', 0, 0, .03, content && content.map ? {} : {}); return g;
  }
  function windowAt(x, y, z, ry, w, h) {
    const g = grp(x, y, z, ry); bx(g, w + .2, h + .2, .12, '#f5f5f5', 0, 0, 0); bx(g, w, h, .04, 0, 0, 0, .05, { m: new THREE.MeshStandardMaterial({ map: TEX.sky(), emissive: C('#cfe8ff'), emissiveMap: TEX.sky(), emissiveIntensity: .9, roughness: .2 }) });
    bx(g, .06, h, .08, '#f5f5f5', 0, 0, .08); bx(g, w, .06, .08, '#f5f5f5', 0, 0, .08); return g;
  }
  function curtain(g, w, h, x, y, z, color) { bx(g, w, h, .06, color, x, y, z, { mo: { roughness: 1 } }); }

  /* ---------- characters ---------- */
  function mkPerson(o) {
    o = Object.assign({ skin: 0xf0c29a, hair: 0x3a2a20, hs: 'short', shirt: 0x4aa3df, pants: 0x3b4a6b, shoes: 0x2a2a2a, sc: 1, fem: false, apron: 0, sweater: 0, jacket: 0 }, o);
    const g = new THREE.Group(), sk = mat(o.skin, { roughness: .55 }), sh = mat(o.shirt, { roughness: .85 }), pa = mat(o.pants, { roughness: .85 }), hr = mat(o.hair, { roughness: .45 }), shoe = mat(o.shoes, { roughness: .5 });
    const part = (geo, m, x, y, z, parent) => { const mm = new THREE.Mesh(geo, m); mm.position.set(x, y, z); mm.castShadow = true; mm.receiveShadow = true; (parent || g).add(mm); return mm; };
    const limb = (x, y, name, color, rt, len, parent) => { const pv = new THREE.Group(); pv.position.set(x, y, 0); (parent || g).add(pv); return pv; };
    // legs
    const legs = [-1, 1].map(s => {
      const pv = new THREE.Group(); pv.position.set(s * .1, .98, 0); g.add(pv);
      part(new THREE.CylinderGeometry(.085, .068, .52, 14), pa, 0, -.26, 0, pv); part(new THREE.SphereGeometry(.07, 12, 10), pa, 0, -.52, 0, pv); part(new THREE.CylinderGeometry(.066, .055, .42, 14), pa, 0, -.74, 0, pv);
      const sw = part(new THREE.BoxGeometry(.12, .08, .26), shoe, 0, -.95, .05, pv); sw.geometry.translate(0, 0, 0); part(new THREE.SphereGeometry(.062, 10, 8), shoe, 0, -.93, .17, pv);
      return pv;
    });
    // torso
    const tor = part(new THREE.CylinderGeometry(.2, .165, .64, 22), o.jacket ? mat(o.jacket, { roughness: .8 }) : sh, 0, 1.3, 0); tor.scale.z = .66;
    part(new THREE.CylinderGeometry(.165, .17, .12, 20), pa, 0, 1.0, 0).scale.z = .66;
    part(new THREE.SphereGeometry(.2, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), o.jacket ? mat(o.jacket) : sh, 0, 1.6, 0).scale.set(1, .35, .66);
    if (o.jacket) { part(new THREE.BoxGeometry(.18, .5, .02), sh, 0, 1.3, .135); }
    if (o.apron) part(new THREE.BoxGeometry(.3, .55, .03), mat(o.apron, { roughness: .9 }), 0, 1.15, .13);
    part(new THREE.CylinderGeometry(.055, .065, .12, 12), sk, 0, 1.66, 0);
    // arms
    const arms = [-1, 1].map(s => {
      const pv = new THREE.Group(); pv.position.set(s * .245, 1.55, 0); g.add(pv);
      const sl = o.jacket ? mat(o.jacket, { roughness: .8 }) : sh;
      part(new THREE.SphereGeometry(.075, 12, 10), sl, 0, 0, 0, pv); part(new THREE.CylinderGeometry(.062, .052, .32, 12), sl, 0, -.17, 0, pv); part(new THREE.SphereGeometry(.052, 10, 8), sl, 0, -.34, 0, pv);
      part(new THREE.CylinderGeometry(.05, .042, .27, 12), o.sweater || o.jacket ? sl : sk, 0, -.48, 0, pv); part(new THREE.SphereGeometry(.05, 10, 8), sk, 0, -.64, 0, pv).scale.set(1, 1.15, .8);
      return pv;
    });
    // head
    const head = new THREE.Group(); head.position.set(0, 1.78, 0); g.add(head);
    part(new THREE.SphereGeometry(.118, 22, 18), sk, 0, 0, 0, head).scale.set(.92, 1.12, 1);
    part(new THREE.SphereGeometry(.026, 10, 8), sk, 0, -.01, .115, head).scale.set(.9, 1.1, 1); [-1, 1].forEach(s => part(new THREE.SphereGeometry(.028, 8, 8), sk, s * .108, 0, 0, head).scale.set(.5, 1, .8));
    [-1, 1].forEach(s => { part(new THREE.SphereGeometry(.021, 10, 8), mat(0xffffff, { roughness: .2 }), s * .042, .02, .098, head); part(new THREE.SphereGeometry(.0125, 10, 8), mat(0x3a2418, { roughness: .2 }), s * .042, .02, .115, head); part(new THREE.SphereGeometry(.006, 6, 6), mat(0xffffff, { emissive: 0xffffff }), s * .042 + .004, .026, .125, head); part(new THREE.BoxGeometry(.055, .009, .01), hr, s * .042, .058, .105, head).rotation.z = s * -.12; });
    part(new THREE.BoxGeometry(.06, .009, .008), mat(o.fem ? 0xb5475a : 0x9b4b3b, { roughness: .4 }), 0, -.062, .104, head);
    if (o.fem) [-1, 1].forEach(s => part(new THREE.SphereGeometry(.022, 8, 6), mat(0xff8aa5, { roughness: 1, transparent: true, opacity: .45 }), s * .065, -.03, .095, head).scale.set(1, .6, .3));
    // hair
    const hs = o.hs;
    if (hs !== 'bald') { const cap = part(new THREE.SphereGeometry(.128, 20, 14, 0, Math.PI * 2, 0, Math.PI * .56), hr, 0, .018, -.004, head); cap.rotation.x = -.12; }
    if (hs === 'long') { part(new THREE.BoxGeometry(.25, .42, .08), hr, 0, -.18, -.1, head); [-1, 1].forEach(s => part(new THREE.BoxGeometry(.04, .3, .12), hr, s * .115, -.1, -.03, head)); }
    if (hs === 'bob') { part(new THREE.BoxGeometry(.27, .16, .2), hr, 0, -.06, -.04, head); [-1, 1].forEach(s => part(new THREE.BoxGeometry(.04, .13, .14), hr, s * .12, -.04, 0, head)); }
    if (hs === 'spiky') for (let i = 0; i < 7; i++) { const c = part(new THREE.ConeGeometry(.035, .11, 6), hr, -.09 + i * .03, .12, .01 + (i % 2) * .02, head); c.rotation.z = (i - 3) * .12; }
    if (hs === 'short') { part(new THREE.BoxGeometry(.2, .04, .05), hr, 0, .085, .09, head); }
    // sweater collar / belt
    if (o.sweater) part(new THREE.TorusGeometry(.065, .02, 8, 14), sh, 0, 1.64, 0).rotation.x = Math.PI / 2;
    g.userData = { legL: legs[0], legR: legs[1], armL: arms[0], armR: arms[1], head, walk: 0 }; g.scale.setScalar(o.sc || 1); return g;
  }
  function mkHugsy() {
    const g = new THREE.Group(), felt = { roughness: .95 };
    const body = sp(g, .5, '#232b36', 0, .72, 0, 1, 1.25, .95, { mo: felt });
    sp(g, .4, '#fbfcfd', 0, .66, .26, .88, 1.12, .55, { mo: felt });
    sp(g, .28, '#232b36', 0, 1.2, .02, 1.1, .9, 1, { mo: felt }); sp(g, .2, '#fbfcfd', 0, 1.14, .24, 1.1, .8, .5, { mo: felt });
    const beak = new THREE.Mesh(new THREE.ConeGeometry(.1, .24, 12), mat('#ff9f1c', { roughness: .4 })); beak.rotation.x = Math.PI / 2; beak.position.set(0, 1.12, .5); beak.castShadow = true; g.add(beak);
    [-1, 1].forEach(s => { sp(g, .1, '#ffffff', s * .15, 1.27, .36, 1, 1, .9, { mo: { roughness: .2 } }); sp(g, .06, '#0b0f14', s * .15, 1.27, .45, 1, 1, .8, { mo: { roughness: .1 } }); sp(g, .02, '#fff', s * .13, 1.3, .5, 1, 1, 1, { mo: { emissive: '#fff' } }); sp(g, .05, '#ff8aa5', s * .27, 1.14, .3, 1, .6, .4, { mo: { roughness: 1 } }); });
    const fl = x => { const p = new THREE.Group(); p.position.set(x, .9, 0); g.add(p); const m = sp(p, .24, '#232b36', x > 0 ? .13 : -.13, -.2, 0, .35, 1, .8, { mo: felt }); return p; };
    const flL = fl(-.5), flR = fl(.5);
    [-1, 1].forEach(s => { sp(g, .16, '#ff9f1c', s * .2, .05, .12, 1.1, .35, 1.5, { mo: { roughness: .5 } }); });
    g.userData = { flL, flR, body, walk: 0 }; return g;
  }
  function mkDuck() {
    const g = new THREE.Group(); sp(g, .28, '#ffd93d', 0, .3, 0, 1, .8, 1.25); sp(g, .17, '#ffd93d', 0, .6, .26); [-1, 1].forEach(s => sp(g, .16, '#f4c20d', s * .26, .3, -.02, .35, .8, 1)); sp(g, .08, '#f4c20d', 0, .34, -.34, 1, 1, 1);
    const k = new THREE.Mesh(new THREE.ConeGeometry(.06, .16, 8), mat('#ff8c1a')); k.rotation.x = Math.PI / 2; k.scale.set(1.3, 1, .6); k.position.set(0, .58, .44); g.add(k); [-1, 1].forEach(s => { sp(g, .026, '#111', s * .08, .66, .38); sp(g, .06, '#ff8c1a', s * .1, .03, .06, 1, .3, 1.5); }); return g;
  }
  function mkChicken() {
    const g = new THREE.Group(); sp(g, .3, '#fffaf0', 0, .34, 0, 1, .95, 1.2); sp(g, .16, '#fffaf0', 0, .7, .22); [-1, 1].forEach(s => sp(g, .18, '#f3ead8', s * .28, .34, 0, .3, .8, 1)); sp(g, .1, '#f3ead8', 0, .42, -.36, .6, 1.5, 1);
    sp(g, .05, '#e53935', 0, .88, .22, .5, 1.2, 1.4); sp(g, .035, '#e53935', 0, .6, .36);
    const k = new THREE.Mesh(new THREE.ConeGeometry(.045, .12, 8), mat('#ff8c1a')); k.rotation.x = Math.PI / 2; k.position.set(0, .68, .37); g.add(k); [-1, 1].forEach(s => { sp(g, .022, '#111', s * .08, .74, .3); cy(g, .015, .015, .12, '#ff8c1a', s * .08, .06, .06); }); return g;
  }

  /* ---------- the world ---------- */
  function wallBox(g, cx, cz, w, d, h, color, tx) {
    const m = bx(g, w, h, d, color, cx, h / 2, cz, { m: tx ? new THREE.MeshStandardMaterial({ map: tx, roughness: .9 }) : mat(color, { roughness: .9 }) });
    bx(g, w + .02, .14, d + .02, '#f1ece2', cx, .07, cz, { ns: true }); bx(g, w + .04, .06, d + .04, '#f8f5ee', cx, h - .03, cz, { ns: true }); solid(cx, cz, w, d); return m;
  }
  function floorPlane(x0, x1, z0, z1, map, y) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshStandardMaterial({ map, roughness: .6 })); m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, y || 0, (z0 + z1) / 2); m.receiveShadow = true; add(m); return m;
  }
  function buildWorld() {
    const S = D.scene = new THREE.Scene(), root = new THREE.Group(); S.background = C('#9ad0ff'); S.fog = new THREE.Fog(C('#a8d4ff'), 50, 120);
    S.add(new THREE.HemisphereLight(C('#cfe6ff'), C('#8a6a4a'), .75)); S.add(new THREE.AmbientLight(0xffffff, .22));
    const sun = new THREE.DirectionalLight(C('#fff0d6'), 1.5); sun.position.set(14, 26, 18); sun.castShadow = true; const mob = matchMedia('(pointer:coarse)').matches; sun.shadow.mapSize.set(mob ? 1024 : 2048, mob ? 1024 : 2048); sun.shadow.bias = -.0004; const sc = sun.shadow.camera; sc.left = -30; sc.right = 30; sc.top = 22; sc.bottom = -22; sc.near = 1; sc.far = 80; S.add(sun);
    [[-10, -2, 0xffd9a0, 1.1], [10, -2, 0xffcaf0, 1.0], [0, -2, 0xfff0d0, .7]].forEach(l => { const p = new THREE.PointLight(l[2], l[3], 20); p.position.set(l[0], 3.6, l[1]); S.add(p); });
    // ground, floors
    const gr = new THREE.Mesh(new THREE.PlaneGeometry(260, 200), new THREE.MeshStandardMaterial({ color: C('#5b6472'), roughness: 1 })); gr.rotation.x = -Math.PI / 2; gr.position.y = -.4; gr.receiveShadow = true; S.add(gr);
    floorPlane(-18, -2, -9, 5, TEX.wood(5, 5)); floorPlane(2, 18, -9, 5, TEX.wood(5, 5)); floorPlane(-2, 2, -9, 5, TEX.carpet('#5a3c78', '#9b7bc0', 1, 7)); floorPlane(-18, 18, 5, 9, TEX.paint('#9ea3ad', null, 14, 2));
    floorPlane(-18.0, -15.2, -9, -2.8, TEX.tile(2, 4), .012);
    // walls
    const G = new THREE.Group(); S.add(G); const H = 2.7;
    const wJ = TEX.paint('#f0cf9a', null, 4, 1), wM = TEX.paint('#a878d0', '#9d6bc8', 5, 1), wH = TEX.paint('#e6dfd1', null, 2, 1);
    wallBox(G, -10, -8.9, 16, .24, H, '#f0cf9a', wJ); wallBox(G, 10, -8.9, 16, .24, H, '#a878d0', wM); wallBox(G, 0, -8.9, 4, .24, H, '#e6dfd1', wH);
    wallBox(G, -17.9, -2, .24, 14, H, '#f0cf9a', wJ); wallBox(G, 17.9, -2, .24, 14, H, '#a878d0', wM);
    [[-18, -11.5, '#f0cf9a', wJ], [-8.5, -2, '#f0cf9a', wJ], [2, 8.5, '#a878d0', wM], [11.5, 18, '#a878d0', wM]].forEach(s => wallBox(G, (s[0] + s[1]) / 2, 5, s[1] - s[0], .24, 1.35, s[2], s[3]));
    wallBox(G, -2, -6.5, .24, 5, H, '#e6dfd1', wH); wallBox(G, -2, 2, .24, 6, H, '#e6dfd1', wH); wallBox(G, 2, -6.5, .24, 5, H, '#e6dfd1', wH); wallBox(G, 2, 2, .24, 6, H, '#e6dfd1', wH);
    // door frames + numbers
    [[-10, 5, '#7a5230'], [10, 5, '#ffd23f']].forEach(p => { const g = grp(p[0], 0, p[1], 0); bx(g, .25, 2.5, .3, p[2], -1.5, 1.25, 0); bx(g, .25, 2.5, .3, p[2], 1.5, 1.25, 0); bx(g, 3.25, .25, .3, p[2], 0, 2.5, 0); });
    [[2, '#ffd23f'], [-2, '#7a5230']].forEach(p => { const g = grp(p[0], 0, -2.5, 0); bx(g, .3, 2.4, .22, p[1], 0, 1.2, -1.5); bx(g, .3, 2.4, .22, p[1], 0, 1.2, 1.5); bx(g, .3, .25, 3.2, p[1], 0, 2.4, 0); });
    // Monica's iconic purple door with the peephole frame (inside apt, on the front wall)
    { const g = grp(10, 0, 4.82, Math.PI); bx(g, 1.2, 2.2, .06, '#7c3aed', 3.4, 1.1, 0); bx(g, 1.3, .08, .08, '#ffd23f', 3.4, 2.24, 0); bx(g, .08, 2.3, .08, '#ffd23f', 2.77, 1.12, 0); bx(g, .08, 2.3, .08, '#ffd23f', 4.03, 1.12, 0); const pe = cy(g, .06, .06, .03, '#ffd23f', 3.4, 1.6, .06, { rx: Math.PI / 2 }); cy(g, .02, .02, .04, '#111', 3.4, 1.6, .07, { rx: Math.PI / 2 }); bx(g, .3, .2, .02, 0, 3.4, 1.95, .05, { m: new THREE.MeshStandardMaterial({ map: TEX.plaque('20'), roughness: .5 }) }); }
    { const g = grp(-10, 0, 4.82, Math.PI); bx(g, .3, .2, .02, 0, -2.4, 1.95, .05, { m: new THREE.MeshStandardMaterial({ map: TEX.plaque('19'), roughness: .5 }) }); }
    // balcony rail, planters, string lights, bench, telescope
    const rail = (x0, z0, x1, z1) => { const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, w = Math.abs(x1 - x0) || .12, d = Math.abs(z1 - z0) || .12; bx(G, w, .06, d, '#374151', cx, .95, cz); bx(G, w, .05, d, '#4b5563', cx, .5, cz); for (let i = 0; i <= Math.max(w, d) * 2.5; i++) { const t = i / (Math.max(w, d) * 2.5); bx(G, .03, .9, .03, '#4b5563', x0 + (x1 - x0) * t, .5, z0 + (z1 - z0) * t); } solid(cx, cz, w, d); };
    rail(-18, 9, 18, 9); rail(-18, 5, -18, 9); rail(18, 5, 18, 9);
    for (let x = -16; x <= 16; x += 4) { const g = grp(x, 0, 8.3, 0); cy(g, .45, .35, .5, '#8d5a2e', 0, .25, 0); for (let i = 0; i < 7; i++) sp(g, .26, i % 2 ? '#2f8f46' : '#3fa857', (i - 3) * .12, .75 + (i % 3) * .12, ((i * 7) % 5 - 2) * .06, 1, 1.1, 1); solid(x, 8.3, 1.1, 1.1); }
    for (let i = 0; i < 24; i++) { const x = -17 + i * 1.48; sp(G, .08, i % 3 ? '#fff3b0' : '#ffd27a', x, 2.3 - Math.sin(i / 23 * Math.PI) * .35 * -1 - .35, 8.9, 1, 1, 1, { mo: { emissive: '#ffd27a', emissiveIntensity: 1.2 } }); }
    { const g = grp(-6, 0, 8.0, 0); rb(g, 2.4, .12, .8, .04, '#8b5e34', 0, .48, 0); bx(g, 2.4, .5, .08, '#8b5e34', 0, .78, .36); [-1, 1].forEach(s => bx(g, .1, .48, .7, '#6b4a2b', s * 1.1, .24, 0)); solid(-6, 8.0, 2.4, .8); }
    { const g = grp(4.2, 0, 8.2, 0); cy(g, .02, .06, 1.3, '#333', 0, .65, 0); const t = cy(g, .1, .14, .9, '#b0b6c0', .2, 1.4, 0, { rz: Math.PI / 2.6 }); }

    /* ---- Joey & Chandler's apartment ---- */
    fridge(-17.2, -7.9, Math.PI / 2 * 0); solid(-17.2, -7.9, 1.5, 1.4);
    counter(-17.3, -4.8, Math.PI / 2, 3.8, { cab: '#f3efe6', top: '#8b8f96', sink: 0, stove: 1.1 }); solid(-17.2, -4.8, 1.5, 3.8);
    table(-13.5, -7.2, 1.0, .78, '#c58a52'); solid(-13.5, -7.2, 2, 2); chair(-14.8, -7.2, Math.PI / 2, '#8a3b12'); chair(-12.2, -7.2, -Math.PI / 2, '#8a3b12'); chair(-13.5, -8.3, 0, '#8a3b12');
    { const g = grp(-13.5, .84, -7.2, 0); bx(g, .4, .05, .4, '#fff', .2, .03, .1); bx(g, .4, .05, .4, '#d946ef', -.25, .03, -.1, { ns: true }); }
    counter(-11, -8.4, 0, 2.4, { cab: '#e5d8c5', top: '#7a5230' }); solid(-11, -8.4, 2.4, .9);
    tvUnit(-9, -8.4, 0); solid(-9, -8.4, 3.2, .9);
    sofa(-9, -5.4, Math.PI, '#e8892b', 4.2, { pillow: '#2b6cb0' }); solid(-9, -5.4, 4.2, 1.5);
    armchair(-12.6, -4.9, Math.PI * .85, '#8b5e34', { foot: true }); solid(-12.6, -4.9, 1.5, 1.5);
    armchair(-5.0, -5.6, -Math.PI / 2, '#3b6fd6', { foot: true }); solid(-5.0, -5.6, 1.5, 1.5);
    bookshelf(-4, -8.4, 0, 2.4); solid(-4, -8.4, 2.4, .9);
    { const g = grp(-4.3, 1.6, -8.0, 0); bx(g, .55, .65, .05, '#fff', 0, 0, 0); bx(g, .45, .55, .02, '#2b2f36', 0, 0, .03); sp(g, .16, '#222b35', 0, -.04, .05, 1, 1.2, .3); sp(g, .1, '#fff', 0, -.08, .07, 1, 1.2, .3); }
    // foosball table (the iconic one)
    { const g = grp(-13.8, 0, .2, 0); bx(g, 3, .22, 1.5, '#4a2f16', 0, .85, 0); bx(g, 2.7, .02, 1.25, 0, 0, .97, 0, { m: new THREE.MeshStandardMaterial({ map: TEX.foos(), roughness: .5 }) }); [[-1.4, -.65], [1.4, -.65], [-1.4, .65], [1.4, .65]].forEach(p => bx(g, .16, .86, .16, '#3a230f', p[0], .43, p[1]));
      [[-.9, 1], [-.3, 2], [.3, 3], [.9, 4]].forEach((rd, ri) => { cy(g, .025, .025, 1.9, '#c0c6cf', rd[0], 1.15, 0, { rx: Math.PI / 2, mo: { metalness: .8, roughness: .2 } }); cy(g, .08, .08, .12, '#111827', rd[0], 1.15, .98, { rx: Math.PI / 2 }); for (let k = 0; k < 3; k++) { const col = ri % 2 ? '#ef4444' : '#2563eb'; bx(g, .1, .24, .12, col, rd[0], 1.1, -.4 + k * .4, { ns: true }); sp(g, .05, '#f3cba5', rd[0], 1.27, -.4 + k * .4, 1, 1, 1, { ns: true }); } }); sp(g, .05, '#fff', .2, 1.0, .1, 1, 1, 1, { ns: true }); solid(-13.8, .2, 3, 1.5); }
    // gym corner
    { const g = grp(-16, 0, 3.2, 0); bx(g, 3, .06, 2.4, '#2563eb', 0, .03, 0, { ns: true }); cy(g, .28, .28, .1, '#111827', .4, .1, .4); cy(g, .2, .2, .08, '#111827', .8, .08, .5); cy(g, .22, .22, .08, '#374151', -.6, .08, -.5); rb(g, 1.2, .1, .45, .04, '#111827', -.9, .5, -.9); [-1, 1].forEach(s => bx(g, .06, .5, .06, '#9ca3af', -.9 + s * .5, .25, -.9)); cy(g, .02, .02, 1.5, '#9ca3af', -.9, .9, -1.2, { rz: Math.PI / 2 }); cy(g, .1, .1, .06, '#111827', -.2, .9, -1.2, { rz: Math.PI / 2 }); cy(g, .1, .1, .06, '#111827', -1.6, .9, -1.2, { rz: Math.PI / 2 }); }
    solid(-17.2, 1.6, 1.2, .5);
    // photo studio
    { const g = grp(-8.2, 0, 2.9, 0); rb(g, 4, .14, 2.6, .05, '#f5f0e6', 0, .07, 0, { ns: true }); bx(g, 4, 1.5, .15, '#fbbf24', 0, .75, -1.5); bx(g, 1.8, 1.2, .05, '#fff', 0, .75, -1.4, { ns: true }); bx(g, 1.2, .9, .05, '#ef4444', 0, 1.1, -1.38, { ns: true }); [-2.2, 2.2].forEach(x => { cy(g, .04, .04, 2.3, '#333', x, 1.15, .9); bx(g, .55, .4, .1, '#fff', x, 2.3, .9, { mo: { emissive: '#fff4c2', emissiveIntensity: .9 } }); }); cy(g, .03, .03, 1.3, '#333', 0, .65, 1.5); bx(g, .35, .25, .3, '#111827', 0, 1.35, 1.5); cy(g, .08, .08, .1, '#6b7280', 0, 1.35, 1.7, { rx: Math.PI / 2 }); solid(-8.2, 1.4, 4, .15); }
    // hospital set
    { const g = grp(-4.6, 0, 3.5, 0); rb(g, 2.2, .5, 1, .06, '#f3f4f6', 0, .45, 0); rb(g, 2.0, .16, .9, .05, '#93c5fd', 0, .78, 0); rb(g, .5, .14, .6, .05, '#fff', -.8, .9, 0); bx(g, .06, 1.2, .06, '#9ca3af', 1.2, .6, .5); solid(-4.6, 3.5, 2.2, 1); const m = grp(-6.3, 0, 3.3, 0); cy(m, .04, .04, 1.4, '#6b7280', 0, .7, 0); bx(m, .6, .42, .1, '#111827', 0, 1.5, 0); bx(m, .5, .3, .02, '#22c55e', 0, 1.5, .06, { mo: { emissive: '#22c55e', emissiveIntensity: .8 } }); solid(-6.3, 3.3, .5, .5); const c = grp(-2.9, 0, 2.4, 0); bx(c, .1, 1.9, 2.4, '#86efac', 0, .95, 0, { mo: { roughness: 1 } }); solid(-2.9, 2.4, .15, 2.4); }
    // coop bowls
    { const g = grp(-12.5, 0, 4.2, 0); cy(g, .3, .25, .12, '#f59e0b', -.4, .06, 0); cy(g, .3, .25, .12, '#38bdf8', .4, .06, 0); }
    [[-17.2, 4.2], [-3.2, 4.2]].forEach(p => { plant(p[0], p[1], 1.2); solid(p[0], p[1], .8, .8); });
    { const g = grp(-9, .015, -2.4, 0); const r = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.6), new THREE.MeshStandardMaterial({ map: TEX.rug('#c0392b', '#f1c27a', '#2c3e7a'), roughness: 1 })); r.rotation.x = -Math.PI / 2; r.receiveShadow = true; g.add(r); }
    { const g = grp(-13.8, .012, 2.3, 0); const r = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.2), new THREE.MeshStandardMaterial({ map: TEX.rug('#2f4f8f', '#e6c27a', '#7a2f2f'), roughness: 1 })); r.rotation.x = -Math.PI / 2; g.add(r); }
    windowAt(-17.75, 1.7, -1.5, Math.PI / 2, 1.8, 1.3); windowAt(-17.75, 1.7, 1.2, Math.PI / 2, 1.8, 1.3);
    lamp(-6.6, -7.9, 1.6, true); lamp(-15.0, -1.5, 1.5, false);
    { const g = grp(-10.4, 1.7, -8.76, 0); bx(g, .7, .5, .04, '#6b4a2b', 0, 0, 0); bx(g, .6, .4, .03, '#1d4e89', 0, 0, .03); bx(g, 0, 0, 0, 0, 0, 0, 0); }

    /* ---- Monica's apartment ---- */
    counter(8, -8.4, 0, 8, { cab: '#f5f5f5', top: '#6b7280', stove: 1.5, sink: -2.5 }); solid(8, -8.4, 8, .9);
    for (let i = 0; i < 6; i++) bx(G, 1.2, .8, .4, '#f5f5f5', 4.6 + i * 1.3, 2.0, -8.65);
    { const g = grp(7.0, 1.55, -8.55, 0); [0, 1, 2].forEach(i => { cy(g, .12 + i * .02, .12 + i * .02, .16, '#9ca3af', i * .5, .1, 0, { mo: { metalness: .8, roughness: .3 } }); }); bx(g, 2.8, .04, .3, '#7a5230', .5, -.02, 0); }
    counter(8, -5.2, 0, 4.2, { cab: '#fef3c7', top: '#9ca3af' }); solid(8, -5.2, 4.2, 1.3);
    table(13.4, -3.8, 1.1, .78, '#b45309'); solid(13.4, -3.8, 2.4, 2.4); [[0, -1.2, 0], [0, 1.2, Math.PI], [1.2, 0, -Math.PI / 2], [-1.2, 0, Math.PI / 2]].forEach(c => chair(13.4 + c[0], -3.8 + c[1], c[2], '#7c2d12'));
    sofa(16.4, 2.6, -Math.PI / 2, '#8e44ad', 4, { pillow: '#fbbf24' }); solid(16.4, 2.6, 1.5, 4);
    { const g = grp(13.0, 0, 2.6, 0); rb(g, 1.5, .08, .9, .04, '#6b4a2b', 0, .4, 0); [-1, 1].forEach(s => [-1, 1].forEach(t => cy(g, .04, .03, .38, '#3a2414', s * .6, .2, t * .35))); }
    { const g = grp(16.7, 0, -8.7, 0); bx(g, 1.3, 2.0, .1, '#e5e7eb', 0, 1, 0); bx(g, 1.1, 1.8, .02, '#a5d0f0', 0, 1.0, .06, { mo: { metalness: .9, roughness: .05 } }); solid(16.7, -8.7, 1.3, .3); }
    { const g = grp(10, .015, 1.3, 0); const r = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.4), new THREE.MeshStandardMaterial({ map: TEX.rug('#6d28d9', '#fbbf24', '#f9a8d4'), roughness: 1 })); r.rotation.x = -Math.PI / 2; r.receiveShadow = true; g.add(r); }
    plant(3.2, 4.2, 1.2); solid(3.2, 4.2, .8, .8); windowAt(10, 1.9, -8.75, 0, 2.6, 1.3); windowAt(17.75, 1.8, -3, -Math.PI / 2, 1.8, 1.3); lamp(17.0, -7.4, 1.6, true); bookshelf(13.0, -8.4, 0, 2.2);
    // hallway
    { const g = grp(1.0, 0, -8.2, 0); bx(g, 1.2, .8, .8, '#6b4a2b', 0, .4, 0); bx(g, .9, .5, .05, '#fef3c7', 0, 1.2, -.5, { ns: true }); solid(1.0, -8.2, 1.2, .8); lamp(-1.0, -7.8, 1.5, false); }
    // skyline backdrop
    for (let i = 0; i < 42; i++) {
      const side = i % 2 ? 1 : -1, w = 5 + Math.random() * 6, h = 8 + Math.random() * 28, x = -64 + Math.floor(i / 2) * 6.4 + Math.random() * 2, z = side > 0 ? 26 + Math.random() * 16 : -26 - Math.random() * 16;
      const hue = ['#cbd5e1', '#e2c9a8', '#b7c4d6', '#d9b8c4', '#c7d8c3'][i % 5];
      const wt = tex((c, ww, hh) => { c.fillStyle = hue; c.fillRect(0, 0, ww, hh); for (let yy = 4; yy < hh; yy += 10) for (let xx = 4; xx < ww; xx += 10) { c.fillStyle = Math.random() < .5 ? '#ffe9a8' : '#6f94c4'; c.fillRect(xx, yy, 5, 6); } }, 32, 64, 1, h / 8);
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), new THREE.MeshStandardMaterial({ map: wt, roughness: .9, emissive: C('#ffe08a'), emissiveMap: wt, emissiveIntensity: .12 })); b.position.set(x, h / 2 - .4, z); S.add(b);
    }
    D.built = true; D.baseSolids = solids.length;
  }
  window.W3D = { D, solids, solid, blocked, mat, mkPerson, mkHugsy, mkDuck, mkChicken, buildWorld, C };
})();
