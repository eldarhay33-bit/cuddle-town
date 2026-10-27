'use strict';
/* =====================================================================
   3D models — part B: the plush pets (Dubi MH, Efrochi + mother hen,
   Lemilam the llama, Ruchi the ghost, Dubila, Marshmallow Cat, Mishmish)
   ===================================================================== */
(function () {
  if (typeof THREE === 'undefined' || !window.M3K) return;
  const { C, cv, fur, glossy, soft, glow, add, sph, cyl, cone, tor, grp, roundBox, eyes } = window.M3K, B = window.M3D.build;
  const tube = (p, pts, r, m, seg) => add(p, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(a => new THREE.Vector3(a[0], a[1], a[2]))), seg || 32, r, 12, false), m);
  const cheeks = (p, x, y, z, r) => [-1, 1].forEach(s => sph(p, r, soft('#ff8fa8', { transparent: true, opacity: .5 }), s * x, y, z, 1, .62, .3));
  const orange = () => glossy('#ff9a1a', { roughness: .35, clearcoat: .5 });

  /* ---- Dubi MH: football-mad bear in a green #1 jersey ---- */
  B.dubi = function () {
    const root = new THREE.Group(), body = grp(root), br = fur('#a96a3b'), tan = fur('#dcb287');
    [-1, 1].forEach(s => { sph(body, 1, br, s * .34, .17, .2, .28, .19, .38); sph(body, 1, tan, s * .34, .1, .42, .18, .08, .2); cyl(body, .3, .27, .5, soft('#f7f7f7', { roughness: .85 }), s * .28, .6, 0); });
    const jt = cv(512, 256, (c, W, H) => { c.fillStyle = '#17a54a'; c.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 28) { c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(x, 0, 14, H); } c.fillStyle = '#fff'; c.fillRect(0, H * .88, W, H * .12); c.font = '800 120px Arial Black, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; [.25, .75].forEach(u => c.fillText('1', W * u, H * .55)); });
    sph(body, 1, new THREE.MeshStandardMaterial({ map: jt, roughness: .85 }), 0, 1.12, 0, .66, .68, .54);
    cyl(body, .27, .3, .1, soft('#ffffff'), 0, 1.74, 0).scale.z = .8;
    const arm = s => { const p = grp(body, s * .68, 1.5, 0); sph(p, 1, soft('#17a54a'), s * .03, -.04, 0, .25, .2, .25); const a = sph(p, 1, br, s * .08, -.34, .02, .19, .38, .19); a.rotation.z = s * .12; return p; };
    const armL = arm(-1), armR = arm(1);
    const head = grp(body, 0, 2.05, .03); sph(head, 1, br, 0, 0, 0, .58, .55, .54);
    [-1, 1].forEach(s => { sph(head, 1, br, s * .42, .46, -.02, .21, .21, .17); sph(head, 1, tan, s * .42, .46, .08, .12, .12, .06); });
    sph(head, 1, tan, 0, -.14, .38, .3, .23, .24); const nose = sph(head, 1, glossy('#2a1a14', { roughness: .15 }), 0, -.04, .6, .1, .075, .08); nose.scale.set(.12, .085, .09);
    const mouth = tor(head, .07, .014, soft('#4a2a20'), 0, -.23, .56, Math.PI); mouth.rotation.z = Math.PI;
    cheeks(head, .36, -.12, .42, .08);
    const eyL = eyes(head, .22, .08, .46, .075);
    return { root, h: 2.7, eyes: eyL, update(t, dt, st) { armL.rotation.z = Math.sin(t * 2) * .05 + (st.happy ? Math.sin(t * 8) * .3 : 0); armR.rotation.z = -armL.rotation.z; head.rotation.z = st.sad ? .12 : Math.sin(t * 1.4) * .03; head.rotation.x = st.sad ? .22 : st.sleep ? .3 : 0; } };
  };

  /* ---- Efrochi: the big round chick ---- */
  B.efro = function () {
    const root = new THREE.Group(), body = grp(root), y = fur('#ffd23a', { roughness: .9 });
    sph(body, 1, y, 0, 1.05, 0, .98, .94, .93); sph(body, 1, fur('#fff0a8'), 0, .92, .38, .68, .72, .55);
    [-.22, 0, .22].forEach((x, i) => { const c = cone(body, .07, .4, y, x, 2.05 + (i === 1 ? .08 : 0), .02, 10); c.rotation.z = -x * 2.2; });
    const wing = s => { const p = grp(body, s * .92, 1.1, 0); const w = sph(p, 1, fur('#f6bc1f'), s * .1, -.15, 0, .17, .44, .38); w.rotation.z = -s * .35; return p; };
    const wL = wing(-1), wR = wing(1);
    const beak = cone(body, .15, .32, orange(), 0, 1.02, .93); beak.rotation.x = Math.PI / 2; beak.scale.set(1.3, 1, .7);
    cheeks(body, .6, 1.0, .66, .11); const eyL = eyes(body, .34, 1.28, .82, .105);
    [-1, 1].forEach(s => { cyl(body, .045, .045, .2, orange(), s * .32, .1, .1, 10); [-1, 0, 1].forEach(t => { const c = cone(body, .05, .22, orange(), s * .32 + t * .1, .03, .3, 8); c.rotation.x = Math.PI / 2; c.scale.y = 1; }); });
    return { root, h: 2.3, eyes: eyL, update(t, dt, st) { wL.rotation.z = Math.sin(t * 2.2) * .07 + (st.happy ? Math.sin(t * 11) * .35 : 0); wR.rotation.z = -wL.rotation.z; body.rotation.z = st.sad ? .05 : Math.sin(t * 1.6) * .02; } };
  };
  /* the mother hen */
  B.hen = function (o) {
    const root = new THREE.Group(), body = grp(root), w = fur('#fffaf0');
    sph(body, 1, w, 0, .62, -.05, .62, .54, .78); sph(body, 1, fur('#f1e6cf'), 0, .68, -.62, .3, .42, .26).rotation.x = -.5;
    [-1, 1].forEach(s => { const x = sph(body, 1, fur('#f3e8d2'), s * .5, .64, -.02, .14, .38, .5); x.rotation.z = -s * .2; });
    const head = grp(body, 0, 1.16, .5); sph(head, 1, w, 0, 0, 0, .3, .3, .3); [-.1, 0, .1].forEach((x, i) => sph(head, 1, glossy('#e53935'), x, .3 + (i === 1 ? .04 : 0), -.02, .07, .1, .1)); sph(head, 1, glossy('#e53935'), 0, -.28, .12, .07, .13, .07);
    const k = cone(head, .06, .16, orange(), 0, -.03, .32, 12); k.rotation.x = Math.PI / 2; const eyL = eyes(head, .13, .06, .26, .04, { sy: 1 });
    [-1, 1].forEach(s => cyl(body, .03, .03, .26, orange(), s * .2, .13, .05, 8));
    return { root, h: 1.6, eyes: eyL, update(t) { head.rotation.x = Math.sin(t * 3) * .08; head.position.z = .5 + Math.max(0, Math.sin(t * 3)) * .05; } };
  };

  /* ---- Lemilam: the pampered fluffy llama ---- */
  B.lemi = function () {
    const root = new THREE.Group(), body = grp(root), wool = fur('#fff1f7'), woolD = fur('#ffe3ef'), pink = fur('#ffc9de');
    sph(body, 1, woolD, 0, 1.2, -.05, .78, .66, 1.0);
    for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2, rr = .72 + (i % 3) * .06; sph(body, 1, i % 2 ? wool : woolD, Math.cos(a) * .68, 1.2 + Math.sin(a * 2) * .22 + (i % 4) * .05, Math.sin(a) * .9 - .05, rr * .3, rr * .3, rr * .3); }
    [-1, 1].forEach(s => [-1, 1].forEach(t => { cyl(body, .12, .1, 1.0, fur('#f7c6d9'), s * .38, .52, t * .55, 16); cyl(body, .12, .12, .13, soft('#c98aa6'), s * .38, .07, t * .55, 16); }));
    sph(body, 1, wool, 0, 1.2, -1.0, .26, .26, .24);
    const neck = grp(body, 0, 1.5, .62); neck.rotation.x = .18; cyl(neck, .23, .31, 1.2, wool, 0, .55, 0, 24); sph(neck, 1, wool, 0, .15, 0, .32, .3, .34);
    const head = grp(neck, 0, 1.25, .08); head.rotation.x = -.18; sph(head, 1, wool, 0, 0, 0, .31, .4, .35); sph(head, 1, pink, 0, -.13, .28, .21, .17, .22);
    [-1, 1].forEach(s => { const e = sph(head, 1, wool, s * .22, .42, -.03, .1, .33, .08); e.rotation.z = -s * .28; const ei = sph(head, 1, pink, s * .225, .4, .02, .06, .24, .04); ei.rotation.z = -s * .28; });
    [-.15, 0, .15].forEach((x, i) => sph(head, 1, wool, x, .44 - Math.abs(x) * .3, .12 + i * .01, .15, .15, .15));
    const bow = grp(head, .26, .48, .18); [-1, 1].forEach(s => { const c = cone(bow, .1, .24, glossy('#ff5fa2'), s * .13, 0, 0, 3); c.rotation.z = s * Math.PI / 2; }); sph(bow, 1, glossy('#e6397d'), 0, 0, 0, .06, .06, .06);
    sph(head, 1, glossy('#b0466f'), 0, -.08, .46, .035, .045, .03); const eyL = eyes(head, .17, .1, .31, .065, { lash: true }); cheeks(head, .22, -.04, .28, .06);
    return { root, h: 3.3, eyes: eyL, update(t, dt, st) { neck.rotation.x = .18 + Math.sin(t * 1.3) * .03 + (st.sad ? .12 : 0); head.rotation.z = Math.sin(t * 1.7) * .04; } };
  };

  /* ---- Ruchi: the little glowing ghost ---- */
  B.ruchi = function () {
    const root = new THREE.Group(), g = grp(root);
    const pts = [[0, 2.35], [.34, 2.3], [.6, 2.08], [.76, 1.7], [.82, 1.2], [.8, .8], [.82, .5]].map(a => new THREE.Vector2(a[0], a[1]));
    const geo = new THREE.LatheGeometry(pts, 72), pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); if (y < .95) { const a = Math.atan2(pos.getZ(i), pos.getX(i)); pos.setY(i, y - (.95 - y) * .25 * (Math.sin(a * 5) * .5 + .5) * 1.4 - Math.max(0, .55 - y) * .6 * (Math.sin(a * 5) * .5 + .5)); } }
    geo.computeVertexNormals();
    const sheet = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: C('#f4f6ff'), emissive: C('#9fb2ff'), emissiveIntensity: .28, roughness: .5, clearcoat: .5, transparent: true, opacity: .96, side: THREE.DoubleSide })); sheet.castShadow = true; g.add(sheet);
    const arm = s => { const p = grp(g, s * .84, 1.35, .05); const a = sph(p, 1, sheet.material, s * .12, -.12, 0, .17, .3, .2); a.rotation.z = -s * .6; return p; }; const aL = arm(-1), aR = arm(1);
    const eyL = eyes(g, .28, 1.6, .66, .13, { sy: 1.25 }); cheeks(g, .46, 1.38, .6, .12);
    const m = sph(g, 1, soft('#3b3550'), 0, 1.26, .74, .09, .07, .04);
    const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: cv(128, 128, (c, w, h) => { const r = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); r.addColorStop(0, 'rgba(190,205,255,.75)'); r.addColorStop(1, 'rgba(190,205,255,0)'); c.fillStyle = r; c.fillRect(0, 0, w, h); }), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); gl.scale.set(4.2, 4.2, 1); gl.position.set(0, 1.4, -.6); g.add(gl);
    const sp = []; for (let i = 0; i < 3; i++) { const s = sph(g, 1, glow('#fff6a8', 1.5), 0, 0, 0, .06, .06, .06); sp.push(s); }
    return { root, h: 2.9, eyes: eyL, update(t, dt, st) { g.position.y = .3 + Math.sin(t * 1.8) * .1; aL.rotation.z = Math.sin(t * 3) * .25; aR.rotation.z = -aL.rotation.z; sp.forEach((s, i) => { const a = t * 1.2 + i * 2.1; s.position.set(Math.cos(a) * 1.2, 1.4 + Math.sin(a * 1.7) * .5, Math.sin(a) * .8); s.scale.setScalar(.06 + Math.abs(Math.sin(t * 4 + i)) * .05); }); gl.material.opacity = .75 + Math.sin(t * 2) * .2; } };
  };

  /* ---- Dubila: a bear in a koala costume ---- */
  B.dubila = function () {
    const root = new THREE.Group(), body = grp(root), gr = fur('#9aa5b3'), wh = fur('#eef2f6');
    [-1, 1].forEach(s => sph(body, 1, gr, s * .36, .15, .22, .28, .17, .36));
    sph(body, 1, gr, 0, 1.0, 0, .74, .74, .62); sph(body, 1, wh, 0, .95, .34, .52, .58, .42);
    for (let i = 0; i < 10; i++) cyl(body, .018, .018, .08, soft('#8794a3'), 0, 1.55 - i * .12, .76 - i * .012 * (i > 6 ? 2 : 0), 6);
    cyl(body, .04, .04, .14, glossy('#ffc83d'), 0, 1.5, .78, 10);
    const arm = s => { const p = grp(body, s * .74, 1.35, 0); const a = sph(p, 1, gr, s * .1, -.32, 0, .2, .44, .22); a.rotation.z = s * .16; return p; }; const aL = arm(-1), aR = arm(1);
    const head = grp(body, 0, 2.0, .02); sph(head, 1, gr, 0, 0, 0, .6, .56, .56);
    [-1, 1].forEach(s => { const e = grp(head, s * .62, .38, -.08); sph(e, 1, gr, 0, 0, 0, .34, .34, .22); const r = tor(e, .31, .06, wh, 0, 0, .1); sph(e, 1, soft('#f6c6d2'), 0, 0, .12, .2, .2, .08); });
    sph(head, 1, fur('#f0d4ac'), 0, -.1, .38, .44, .38, .26);
    [-1, 1].forEach(s => sph(head, 1, soft('#b9814f'), s * .3, .12, .5, .13, .15, .06));
    sph(head, 1, fur('#f7e8cc'), 0, -.2, .56, .2, .14, .16); sph(head, 1, glossy('#1f2229', { roughness: .15 }), 0, -.08, .66, .17, .12, .11);
    const eyL = eyes(head, .28, .13, .53, .07); cheeks(head, .4, -.1, .4, .08);
    return { root, h: 2.8, eyes: eyL, update(t, dt, st) { aL.rotation.z = Math.sin(t * 2) * .05 + (st.happy ? Math.sin(t * 8) * .3 : 0); aR.rotation.z = -aL.rotation.z; head.rotation.z = st.sad ? .12 : Math.sin(t * 1.3) * .035; head.rotation.x = st.sleep ? .3 : 0; } };
  };

  /* ---- Marshmallow Cat: a squishy pillow of a cat (melts when too warm) ---- */
  B.marsh = function (o) {
    const root = new THREE.Group(), g = grp(root), melt = !!o.melt, wm = soft('#fff4f7', { roughness: .65, emissive: C('#ffd0de'), emissiveIntensity: .12 }), pk = soft('#ffb3c8', { roughness: .6 });
    const bodyM = add(g, roundBox(3.2, .8, 1.05, .72), wm, 0, 1.08, 0); if (melt) bodyM.scale.set(1.1, .85, 1.1), bodyM.position.y = .95;
    [-1, 1].forEach(s => { const e = cone(g, .3, .62, wm, s * .5, 2.28, 0, 3); e.rotation.z = -s * .25; e.scale.z = .5; const i = cone(g, .17, .4, pk, s * .5, 2.22, .06, 3); i.rotation.z = -s * .25; i.scale.z = .35; });
    const tail = tube(g, [[.7, .5, -.35], [1.15, .55, -.5], [1.2, 1.1, -.45], [.95, 1.6, -.3]], .13, wm, 28);
    [-1, 1].forEach(s => add(g, roundBox(2.6, .22, .14, .26), wm, s * .38, .12, .45));
    const eyL = eyes(g, .27, 1.55, .66, .085); const nose = cone(g, .05, .07, glossy('#ff6f9a'), 0, 1.38, .72, 3); nose.rotation.x = Math.PI; nose.scale.z = .6;
    const m = tor(g, .05, .012, soft('#c4506f'), 0, 1.3, .72, Math.PI); m.rotation.z = Math.PI; cheeks(g, .45, 1.32, .64, .1);
    [[-1, 1], [-1, -1], [1, 1], [1, -1]].forEach(a => { const w = cyl(g, .006, .006, .5, soft('#e9b7c6'), a[0] * .62, 1.36 + a[1] * .05, .62, 6); w.rotation.z = Math.PI / 2 + a[0] * a[1] * .18; });
    if (melt) [-.45, .1, .55].forEach((x, i) => sph(g, 1, pk, x, .14, .66 + i * .02, .1, .14, .1));
    return { root, h: 2.6, eyes: eyL, update(t, dt, st) { tail.rotation.y = Math.sin(t * 2.2) * .12; bodyM.rotation.z = Math.sin(t * 1.5) * .02; } };
  };

  /* ---- Mishmish: the chubby dog ---- */
  B.mish = function () {
    const root = new THREE.Group(), body = grp(root), tn = fur('#e2a24e'), br = fur('#b8793a'), cr = fur('#fff0d2');
    sph(body, 1, tn, 0, .86, -.05, .9, .72, .82); sph(body, 1, cr, 0, .78, .35, .56, .5, .42); sph(body, 1, br, .5, 1.1, -.2, .22, .16, .16);
    [-1, 1].forEach(s => { sph(body, 1, br, s * .34, .12, .6, .22, .13, .3); sph(body, 1, br, s * .66, .14, .05, .26, .15, .34); });
    const head = grp(body, 0, 1.88, .22); sph(head, 1, tn, 0, 0, 0, .64, .6, .6); sph(head, 1, cr, 0, -.2, .43, .33, .26, .28); sph(head, 1, glossy('#2b2b3a', { roughness: .15 }), 0, -.08, .68, .13, .095, .1);
    const tongue = sph(head, 1, soft('#ff7a93'), 0, -.4, .62, .08, .13, .05);
    const ear = s => { const p = grp(head, s * .56, .25, -.02); const e = sph(p, 1, br, s * .1, -.3, 0, .2, .46, .16); e.rotation.z = s * .18; return p; }; const eaL = ear(-1), eaR = ear(1);
    const eyL = eyes(head, .27, .13, .52, .08); cheeks(head, .46, -.12, .38, .08);
    tor(body, .46, .045, glossy('#e53935'), 0, 1.4, .16).rotation.x = Math.PI / 2 - .25;
    tube(body, [[.4, 1.32, .45], [.9, .8, .5], [1.25, .2, .45], [1.4, .04, .2]], .035, glossy('#e53935'), 24);
    const tail = grp(body, 0, .9, -.8); tube(tail, [[0, 0, 0], [.1, .3, -.2], [.12, .65, -.2]], .09, tn, 16);
    return { root, h: 2.6, eyes: eyL, update(t, dt, st) { tail.rotation.z = Math.sin(t * (st.happy ? 11 : 4)) * .45; eaL.rotation.z = Math.sin(t * 2.4) * .06; eaR.rotation.z = -eaL.rotation.z; tongue.visible = st.happy || st.eat; head.rotation.z = st.sad ? .1 : 0; head.rotation.x = st.sad ? .2 : st.sleep ? .3 : 0; } };
  };
})();
