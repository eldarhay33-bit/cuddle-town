'use strict';
/* =====================================================================
   3D models — part A: the modelling kit + Hugsy with his full outfit
   (striped beanie, aviator goggles, quilted golden vest, knit scarf).
   three.js r128. Everything is procedural: no external assets.
   ===================================================================== */
(function () {
  if (typeof THREE === 'undefined' || !window.W3D) return;
  const C = h => new THREE.Color(h).convertSRGBToLinear();
  const rnd = (a, b) => a + Math.random() * (b - a);
  const cv = (w, h, draw, o) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; if (!(o && o.lin)) t.encoding = THREE.sRGBEncoding; return t; };
  let _fur, _fuzz;
  const furBump = () => _fur || (_fur = cv(256, 256, (c, w, h) => { c.fillStyle = '#808080'; c.fillRect(0, 0, w, h); for (let i = 0; i < 6000; i++) { const x = rnd(0, w), y = rnd(0, h), a = rnd(0, 6.28), l = rnd(3, 8); c.strokeStyle = Math.random() < .5 ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); } }, { lin: true }));
  const knitBump = () => _fuzz || (_fuzz = cv(128, 128, (c, w, h) => { c.fillStyle = '#808080'; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 8) { const g = c.createLinearGradient(x, 0, x + 8, 0); g.addColorStop(0, '#404040'); g.addColorStop(.5, '#d8d8d8'); g.addColorStop(1, '#404040'); c.fillStyle = g; c.fillRect(x, 0, 8, h); } }, { lin: true }));
  /* materials */
  const fur = (c, o) => { const t = furBump().clone(); t.needsUpdate = true; t.repeat.set(3, 3); return new THREE.MeshStandardMaterial(Object.assign({ color: C(c), roughness: .95, metalness: 0, bumpMap: t, bumpScale: .3 }, o || {})); };
  const glossy = (c, o) => new THREE.MeshPhysicalMaterial(Object.assign({ color: C(c), roughness: .2, metalness: 0, clearcoat: 1, clearcoatRoughness: .1 }, o || {}));
  const soft = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: C(c), roughness: .8, metalness: 0 }, o || {}));
  const glow = (c, i) => new THREE.MeshStandardMaterial({ color: C(c), emissive: C(c), emissiveIntensity: i || 1, roughness: .3 });
  /* mesh helpers */
  const add = (p, geo, m, x, y, z, sx, sy, sz) => { const o = new THREE.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); if (sx != null) o.scale.set(sx, sy == null ? sx : sy, sz == null ? sx : sz); o.castShadow = true; o.receiveShadow = true; p.add(o); return o; };
  const sph = (p, r, m, x, y, z, sx, sy, sz) => add(p, new THREE.SphereGeometry(r, 36, 26), m, x, y, z, sx, sy, sz);
  const cyl = (p, rt, rb, h, m, x, y, z, seg) => add(p, new THREE.CylinderGeometry(rt, rb, h, seg || 28), m, x, y, z);
  const cone = (p, r, h, m, x, y, z, seg) => add(p, new THREE.ConeGeometry(r, h, seg || 24), m, x, y, z);
  const tor = (p, R, r, m, x, y, z, arc, seg) => add(p, new THREE.TorusGeometry(R, r, 14, seg || 48, arc || Math.PI * 2), m, x, y, z);
  const grp = (p, x, y, z) => { const g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); p.add(g); return g; };
  /* rounded "marshmallow" solid: a super-ellipsoid */
  const roundBox = (n, w, h, d) => { const g = new THREE.SphereGeometry(1, 48, 36), p = g.attributes.position; for (let i = 0; i < p.count; i++) { let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const k = Math.pow(Math.pow(Math.abs(x), n) + Math.pow(Math.abs(y), n) + Math.pow(Math.abs(z), n), 1 / n) || 1; p.setXYZ(i, x / k * w, y / k * h, z / k * d); } g.computeVertexNormals(); return g; };
  /* a pair of big glossy eyes (groups so they can blink) */
  function eyes(p, sx, y, z, r, o) {
    o = o || {}; const L = [];
    [-1, 1].forEach(s => { const g = grp(p, s * sx, y, z); sph(g, r, glossy(o.c || '#14121a', { roughness: .06 }), 0, 0, 0, 1, o.sy || 1.15, .78); sph(g, r * .3, glow('#ffffff', .9), r * .34, r * .4, r * .6, 1, 1, .5); sph(g, r * .15, glow('#ffffff', .8), -r * .3, -r * .33, r * .66, 1, 1, .5); if (o.lash) { [.55, .15, -.25].forEach(a => { const l = cyl(g, r * .05, r * .05, r * .7, soft('#14121a'), s * r * .95, r * .8 + a * r, 0, 6); l.rotation.z = s * (-1.1 + a); }); } L.push(g); });
    return L;
  }
  /* dirt blobs painted on a canvas texture */
  function stain(c, lv, w, h, x0, y0, x1, y1) {
    if (!lv) return; const n = [0, 7, 16, 30][lv];
    for (let i = 0; i < n; i++) { const x = rnd(x0, x1), y = rnd(y0, y1), r = rnd(3, 6 + lv * 6); c.fillStyle = `rgba(${74 + (rnd(0, 20) | 0)},${44 + (rnd(0, 14) | 0)},${18},${rnd(.28, .6)})`; c.beginPath(); c.ellipse(x, y, r, r * rnd(.5, 1), rnd(0, 3), 0, 7); c.fill(); if (Math.random() < .5) { c.fillStyle = 'rgba(52,30,12,.6)'; c.beginPath(); c.arc(x + r, y - r * .6, rnd(1, 3), 0, 7); c.fill(); } }
  }

  /* ===================== Hugsy ===================== */
  function hugsy(o) {
    o = o || {}; const w = o.worn || {}, lv = o.dirt || 0, root = new THREE.Group(), body = grp(root, 0, 0, 0);
    const Hh = 1.67; // head centre height
    // two-tone plush: white front, black back (texture wraps around the sphere, front = u .25)
    const two = (soft0) => cv(512, 256, (c, W, H) => { c.fillStyle = '#16171d'; c.fillRect(0, 0, W, H); const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.03, 'rgba(255,255,255,0)'); g.addColorStop(.1, '#fbfcfe'); g.addColorStop(.4, '#fbfcfe'); g.addColorStop(.47, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); });
    const tw = two(), wt = () => new THREE.MeshStandardMaterial({ map: tw, roughness: .9, metalness: 0 });
    const bellyM = wt(), headM = wt();
    sph(body, 1, bellyM, 0, .8, 0, .68, .72, .62);                      // torso
    const head = grp(body, 0, Hh, .03); sph(head, 1, headM, 0, 0, 0, .52, .52, .5);
    // beak, cheeks, eyes
    const beakM = glossy('#f7a912', { roughness: .32, clearcoat: .6 });
    const beak = add(head, new THREE.ConeGeometry(.17, .36, 28), beakM, 0, -.15, .49); beak.rotation.x = Math.PI / 2 + .1; beak.scale.set(1.35, 1, .62);
    add(head, new THREE.SphereGeometry(.09, 20, 14), beakM, 0, -.08, .45, 1.7, .6, .9);
    const mouth = sph(head, .05, soft('#c25f00'), 0, -.23, .47, 1.4, .25, .8); mouth.visible = false;
    [-1, 1].forEach(s => sph(head, .075, soft('#ff8fa3', { transparent: true, opacity: .55 }), s * .34, -.17, .34, 1, .6, .35));
    const eyeL = eyes(head, .2, -.06, .455, .07, {});
    // flippers
    const fl = s => { const p = grp(body, s * .64, 1.2, 0); const m = sph(p, 1, soft('#17181f', { roughness: .85 }), s * .09, -.3, 0, .13, .46, .25); m.rotation.z = -s * .2; return p; };
    const flL = fl(-1), flR = fl(1);
    // feet + tail
    const footM = soft('#f2a20a', { roughness: .5 });
    [-1, 1].forEach(s => { sph(body, 1, footM, s * .28, .05, .36, .25, .08, .33); [-1, 0, 1].forEach(t => sph(body, .06, footM, s * .28 + t * .12, .05, .62, 1, .7, 1.3)); });
    const tail = cone(body, .1, .3, soft('#17181f'), 0, .28, -.64); tail.rotation.x = -2.2;

    /* ---- outfit ---- */
    // quilted golden vest (partial sphere wrapped around the torso; front zipper at u = .25)
    if (!w.body) {
      const vt = cv(1024, 512, (c, W, H) => {
        const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f3a800'); g.addColorStop(.55, '#ea9a00'); g.addColorStop(1, '#d17f00'); c.fillStyle = g; c.fillRect(0, 0, W, H);
        const hemY = H * .82, rows = 7, rh = hemY / rows;
        for (let r = 0; r < rows; r++) { const y = r * rh; const gg = c.createLinearGradient(0, y, 0, y + rh); gg.addColorStop(0, 'rgba(110,60,0,.16)'); gg.addColorStop(.35, 'rgba(255,236,140,.16)'); gg.addColorStop(.7, 'rgba(255,255,255,0)'); gg.addColorStop(1, 'rgba(110,60,0,.2)'); c.fillStyle = gg; c.fillRect(0, y, W, rh); c.strokeStyle = 'rgba(150,92,0,.55)'; c.lineWidth = 2; c.setLineDash([]); c.beginPath(); c.moveTo(0, y + rh); c.lineTo(W, y + rh); c.stroke(); c.strokeStyle = 'rgba(255,245,170,.4)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, y + rh + 3); c.lineTo(W, y + rh + 3); c.stroke(); }
        for (let i = 0; i < 64; i++) { c.fillStyle = i % 2 ? '#f5ead0' : '#8c1d40'; c.fillRect(i * W / 64, hemY, W / 64 + 1, H - hemY); }
        for (let x = 0; x < W; x += 5) { c.fillStyle = 'rgba(0,0,0,.16)'; c.fillRect(x, hemY, 1.6, H - hemY); } c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, hemY - 2, W, 4);
        const zx = W * .25; c.fillStyle = '#b97b00'; c.fillRect(zx - 11, 0, 22, hemY + 6); c.strokeStyle = '#4b5563'; c.lineWidth = 11; c.beginPath(); c.moveTo(zx, 0); c.lineTo(zx, hemY + 4); c.stroke(); c.strokeStyle = '#f1f5f9'; c.lineWidth = 7; c.setLineDash([5, 5]); c.beginPath(); c.moveTo(zx, 0); c.lineTo(zx, hemY + 4); c.stroke(); c.setLineDash([]);
        c.fillStyle = '#d1d5db'; c.strokeStyle = '#4b5563'; c.lineWidth = 3; c.beginPath(); c.roundRect ? c.roundRect(zx - 16, 36, 32, 46, 9) : c.rect(zx - 16, 36, 32, 46); c.fill(); c.stroke(); c.strokeStyle = '#9ca3af'; c.lineWidth = 5; c.beginPath(); c.ellipse(zx, 100, 9, 15, 0, 0, 7); c.stroke();
        [-1, 1].forEach(s => { c.strokeStyle = '#a86b00'; c.lineWidth = 5; c.beginPath(); c.moveTo(zx + s * 90, hemY - 110); c.lineTo(zx + s * 138, hemY - 8); c.stroke(); });
        stain(c, lv, W, H, 0, 20, W, H - 20);
      });
      const bump = cv(512, 256, (c, W, H) => { c.fillStyle = '#707070'; c.fillRect(0, 0, W, H); const hemY = H * .82, rh = hemY / 7; for (let r = 0; r < 7; r++) { const g = c.createLinearGradient(0, r * rh, 0, (r + 1) * rh); g.addColorStop(0, '#585858'); g.addColorStop(.5, '#b4b4b4'); g.addColorStop(1, '#585858'); c.fillStyle = g; c.fillRect(0, r * rh, W, rh); } for (let i = 0; i < 64; i++) { c.fillStyle = i % 2 ? '#a0a0a0' : '#606060'; c.fillRect(i * W / 64, hemY, W / 128, H - hemY); } }, { lin: true });
      const vm = new THREE.MeshStandardMaterial({ map: vt, bumpMap: bump, bumpScale: .6, roughness: .46, metalness: .03, envMapIntensity: .4 });
      const vest = add(body, new THREE.SphereGeometry(1, 72, 40, 0, Math.PI * 2, 1.0, 1.76), vm, 0, .8, 0, .715, .755, .655); vest.material.side = THREE.DoubleSide;
      const col = tor(body, 1, .045, soft('#ffd23a', { roughness: .4 }), 0, 1.21, 0); col.rotation.x = Math.PI / 2; col.scale.set(.6, .55, .6);
    }
    // striped scarf
    if (!w.neck) {
      const st = cv(512, 64, (c, W, H) => { const cs = ['#8c1d40', '#f5ead0', '#1d1c24', '#f5ead0']; for (let i = 0; i < 4; i++) { c.fillStyle = cs[i]; c.fillRect(i * W / 4, 0, W / 4 + 1, H); } for (let y = 0; y < H; y += 4) { c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, y, W, 1.4); } stain(c, lv, W, H, 0, 0, W, H); });
      st.repeat.set(7, 1); const sbump = knitBump().clone(); sbump.needsUpdate = true; sbump.repeat.set(9, 2);
      const sm = new THREE.MeshStandardMaterial({ map: st, bumpMap: sbump, bumpScale: 1.3, roughness: .92 });
      const pts = []; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, z = Math.sin(a); pts.push(new THREE.Vector3(Math.cos(a) * .62, 1.19 + (z > 0 ? -.06 * z : .03 * -z), z * .57)); }
      add(body, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 90, .12, 16, true), sm);
      const tg = grp(body, .3, 1.1, .56); tg.scale.z = .42; const tm = sm.clone(); tm.map = st.clone(); tm.map.needsUpdate = true; tm.map.repeat.set(3, 1);
      add(tg, new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(.05, -.3, .03), new THREE.Vector3(.06, -.62, .02)]), 24, .12, 12, false), tm);
      [-.07, -.025, .02, .065].forEach(x => cyl(body, .012, .012, .12, soft('#f1e4c0'), .36 + x, .42, .59, 6));
      const knot = sph(body, .14, sm, .3, 1.17, .6, 1, .95, .8);
    }
    // beanie: maroon knit dome + black/cream striped cuff
    if (!w.head) {
      const dt = cv(512, 256, (c, W, H) => { c.fillStyle = '#8a1b3d'; c.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 16) { c.fillStyle = 'rgba(30,2,14,.4)'; c.fillRect(x, 0, 3, H); c.fillStyle = 'rgba(255,150,170,.1)'; c.fillRect(x + 5, 0, 2, H); } stain(c, lv, W, H, 0, 0, W, H * .85); });
      const dm = new THREE.MeshStandardMaterial({ map: dt, bumpMap: knitBump().clone(), bumpScale: .9, roughness: .95 }); dm.bumpMap.needsUpdate = true; dm.bumpMap.repeat.set(10, 3);
      const bt = cv(512, 128, (c, W, H) => { for (let i = 0; i < 24; i++) { c.fillStyle = i % 2 ? '#f5ead0' : '#1d1c24'; c.fillRect(i * W / 24, 0, W / 24 + 1, H); } for (let x = 0; x < W; x += 5) { c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(x, 0, 1.5, H); } stain(c, lv, W, H, 0, 0, W, H); });
      const bm = new THREE.MeshStandardMaterial({ map: bt, roughness: .95, side: THREE.DoubleSide });
      const hat = grp(head, 0, 0, -.012); hat.rotation.x = -.16;
      add(hat, new THREE.SphereGeometry(.575, 56, 32, 0, Math.PI * 2, 0, 1.1), dm, 0, 0, 0, 1, 1.18, 1);
      const band = add(hat, new THREE.SphereGeometry(.588, 64, 6, 0, Math.PI * 2, 1.0, .35), bm, 0, 0, 0); band.material.side = THREE.DoubleSide;
      [[.575, 1.0], [.588, 1.35]].forEach(a => { const rr = .588 * Math.sin(a[1]), rim = tor(hat, rr, .022, soft('#f5ead0'), 0, .588 * Math.cos(a[1]), 0); rim.rotation.x = Math.PI / 2; });
    }
    // aviator goggles
    let lensM = null;
    if (!w.face) {
      const lm = new THREE.MeshPhysicalMaterial({ color: C('#ffb347'), roughness: .05, metalness: 0, transparent: true, opacity: .42, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false });
      const fm = glossy('#7b4a22', { roughness: .45 });
      [-1, 1].forEach(s => { const gg = grp(head, s * .21, -.06, .535); tor(gg, .145, .035, fm, 0, 0, 0); tor(gg, .176, .012, soft('#2d1809'), 0, 0, -.015); add(gg, new THREE.CircleGeometry(.14, 36), lm, 0, 0, .0); const cup = add(gg, new THREE.CylinderGeometry(.15, .17, .12, 32, 1, true), soft('#5a3516', { roughness: .6, side: THREE.DoubleSide }), 0, 0, -.06); cup.rotation.x = Math.PI / 2; [.9, 3.6].forEach(a => sph(gg, .016, glossy('#d6d3d1', { metalness: .8, roughness: .2 }), Math.cos(a) * .18, Math.sin(a) * .18, .02)); if (lv) sph(gg, .09, soft('#5a3516', { transparent: true, opacity: .1 + lv * .1 }), s * .02, -.03, .02, 1.1, .7, .1); });
      cyl(head, .02, .02, .1, fm, 0, -.06, .54, 10).rotation.z = Math.PI / 2;
      const strap = grp(head, 0, -.06, 0); const sr = add(strap, new THREE.TorusGeometry(.53, .045, 12, 64, Math.PI * 2 - 1.5), soft('#7b4a22', { roughness: .6 }), 0, 0, 0); sr.rotation.x = Math.PI / 2; strap.rotation.y = -Math.PI / 2 - .75;
    }
    // emoji items from the shop are shown as flat badges (same slots as in 2D)
    const slots = { head: [0, .62, .2, .34], face: [0, -.02, .62, .26], neck: [0, 1.28, .72, .26], body: [0, .75, .7, .46] };
    const badge = (slot, e) => { const s = slots[slot]; if (!e) return; const t = cv(128, 128, (c, W, H) => { c.font = '96px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(e, W / 2, H / 2 + 6); }); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false })); sp.scale.set(s[3] * 2.2, s[3] * 2.2, 1); sp.position.set(s[0], slot === 'head' ? head.position.y + s[1] + .35 : slot === 'face' ? head.position.y + s[1] : s[1], s[2] + .12); sp.renderOrder = 5; (slot === 'head' || slot === 'face' ? body : body).add(sp); };
    ['head', 'face', 'neck', 'body'].forEach(k => badge(k, w[k]));
    root.userData = { flL, flR, body, walk: 0 };
    return { root, h: 2.5, eyes: eyeL, head, mouth, parts: { flL, flR, tail }, update(t, dt, st) { flL.rotation.z = Math.sin(t * 2) * .06 + (st.happy ? Math.sin(t * 9) * .25 : 0); flR.rotation.z = -flL.rotation.z; head.rotation.z = st.sad ? .12 : Math.sin(t * 1.3) * .03; head.rotation.x = st.sad ? .25 : st.sleep ? .3 : 0; mouth.visible = !!st.eat; if (st.eat) mouth.scale.y = .25 + Math.abs(Math.sin(t * 14)) * .35; tail.rotation.z = Math.sin(t * 5) * .15; } };
  }

  window.M3K = { C, rnd, cv, fur, glossy, soft, glow, add, sph, cyl, cone, tor, grp, roundBox, eyes, stain, furBump, knitBump };
  window.M3D = window.M3D || { build: {} };
  window.M3D.build.hugsy = hugsy;
  // the VIP apartment uses the same Hugsy (scaled to its old size, same animation handles)
  W3D.mkHugsy = function () { const m = hugsy({}), g = new THREE.Group(); m.root.scale.setScalar(.66); g.add(m.root); g.userData = m.root.userData; return g; };
})();
