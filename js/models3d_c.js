'use strict';
/* =====================================================================
   3D models — part C: people (Joey, the friends and the family).
   Same option names as the apartment's mkPerson, so it replaces it.
   ===================================================================== */
(function () {
  if (typeof THREE === 'undefined' || !window.M3K || !window.W3D) return;
  const { C, cv, glossy, soft, add, sph, cyl, cone, tor, grp, rnd } = window.M3K, B = window.M3D.build;
  const lathe = (pts, seg) => new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg || 36);
  const MALE = [[0, 0], [.16, 0], [.175, .12], [.17, .3], [.19, .5], [.205, .6], [.17, .68], [.07, .72], [0, .73]];
  const FEM = [[0, 0], [.15, 0], [.162, .1], [.135, .28], [.158, .45], [.182, .58], [.16, .67], [.07, .72], [0, .73]];
  const COAT = [[0, -.5], [.2, -.5], [.215, -.2], [.18, 0], [.17, .3], [.19, .5], [.205, .6], [.17, .68], [.07, .72], [0, .73]];
  const camo = () => cv(256, 256, (c, w, h) => { c.fillStyle = '#5c6b3a'; c.fillRect(0, 0, w, h); ['#3f4a27', '#8a8f55', '#2f351d'].forEach(col => { c.fillStyle = col; for (let i = 0; i < 26; i++) { c.beginPath(); c.ellipse(rnd(0, w), rnd(0, h), rnd(12, 34), rnd(8, 22), rnd(0, 3), 0, 7); c.fill(); } }); });

  function person(o) {
    o = Object.assign({ skin: '#f0c29a', hair: '#3a2a20', hs: 'short', shirt: '#4aa3df', pants: '#3b4a6b', shoes: '#2a2a2a', sc: 1, fem: false }, o);
    const root = new THREE.Group(), g = grp(root);
    const sk = soft(o.skin, { roughness: .52 }), hr = soft(o.hair, { roughness: .42 }), pa = soft(o.pants, { roughness: .85 }), shoe = soft(o.shoes, { roughness: .5 });
    const army = o.extra === 'army', shirtM = army ? new THREE.MeshStandardMaterial({ map: camo(), roughness: .9 }) : soft(o.jacket || o.shirt, { roughness: .85 }), under = soft(o.shirt, { roughness: .85 });
    const legs = [-1, 1].map(s => {
      const pv = grp(g, s * .1, .98, 0); cyl(pv, .092, .072, .52, pa, 0, -.26, 0, 20); sph(pv, .072, pa, 0, -.52, 0); cyl(pv, .068, .056, .44, pa, 0, -.75, 0, 20);
      sph(pv, 1, shoe, 0, -.955, .07, .075, .055, .165); return pv;
    });
    shirtM.side = THREE.DoubleSide; const torso = add(g, lathe(o.extra === 'coat' ? COAT : o.fem ? FEM : MALE), shirtM, 0, .98, 0); torso.scale.z = .68;
    add(g, lathe([[0, 0], [.168, 0], [.17, .1], [.0, .1]], 28), pa, 0, .98, 0).scale.z = .68;
    if (o.extra === 'apron') { add(g, new THREE.BoxGeometry(.3, .52, .03), soft(o.apron || '#ffffff', { roughness: .9 }), 0, 1.2, .135); add(g, new THREE.BoxGeometry(.08, .04, .03), soft(o.apron || '#fff'), 0, 1.5, .13); }
    if (o.extra === 'vest') { const v = add(g, lathe([[0, .08], [.172, .08], [.19, .3], [.2, .52], [.21, .6], [.18, .67], [.1, .7], [.05, .7], [0, .7]]), soft('#ff7a1a', { roughness: .7 }), 0, .98, 0); v.scale.set(1.03, 1, .7); [.28, .46].forEach(y => { const r = tor(g, .19, .012, glossy('#d9dde2', { roughness: .3 }), 0, .98 + y, 0); r.rotation.x = Math.PI / 2; r.scale.set(1, .7, 1); }); }
    cyl(g, .056, .066, .13, sk, 0, 1.67, 0, 14);
    if (o.sweater) tor(g, .066, .02, under, 0, 1.64, 0).rotation.x = Math.PI / 2;
    const sleeveM = o.sweater || o.jacket || army ? shirtM : under, longSl = !!(o.sweater || o.jacket || army);
    const arms = [-1, 1].map(s => {
      const pv = grp(g, s * .245, 1.56, 0); sph(pv, .078, shirtM, 0, 0, 0); cyl(pv, .064, .054, .32, shirtM, 0, -.17, 0, 14); sph(pv, .054, shirtM, 0, -.34, 0);
      cyl(pv, .05, .043, .27, longSl ? sleeveM : sk, 0, -.48, 0, 14); sph(pv, 1, sk, 0, -.65, 0, .05, .06, .04); return pv;
    });
    const sc = o.kid ? 1.28 : 1, head = grp(g, 0, 1.78 + (o.kid ? .02 : 0), 0); head.scale.setScalar(sc);
    sph(head, 1, o.hs === 'bald' ? glossy(o.skin, { roughness: .35, clearcoat: .3 }) : sk, 0, 0, 0, .109, .134, .118);
    sph(head, .026, sk, 0, -.012, .117, .9, 1.1, 1); [-1, 1].forEach(s => sph(head, .028, sk, s * .108, 0, 0, .5, 1, .8));
    const eyeL = [-1, 1].map(s => { const e = grp(head, s * .043, .02, .099); sph(e, .021, glossy('#ffffff', { roughness: .15, clearcoat: .4 }), 0, 0, 0); sph(e, .0125, glossy('#4a3426', { roughness: .1 }), 0, 0, .016); sph(e, .0065, soft('#101010'), 0, 0, .024); sph(e, .004, soft('#ffffff', { emissive: C('#fff') }), .004, .006, .028); return e; });
    [-1, 1].forEach(s => { const b = add(head, new THREE.BoxGeometry(.056, .009, .01), hr, s * .043, .058, .105); b.rotation.z = s * -.12; });
    const mouth = add(head, new THREE.TorusGeometry(.028, .006, 8, 16, Math.PI), soft(o.fem ? '#b5475a' : '#9b4b3b', { roughness: .4 }), 0, -.045, .106); mouth.rotation.z = Math.PI;
    if (o.fem) [-1, 1].forEach(s => sph(head, 1, soft('#ff8aa5', { transparent: true, opacity: .4 }), s * .065, -.03, .097, .022, .013, .007));
    const cap = (r, y, z, rx) => { const c = add(head, new THREE.SphereGeometry(r, 28, 18, 0, Math.PI * 2, 0, Math.PI * .56), hr, 0, y, z); c.rotation.x = rx || -.12; return c; };
    const hs = o.hs; if (hs !== 'bald') cap(.13, .018, -.004);
    if (hs === 'long') { add(head, new THREE.BoxGeometry(.25, .44, .08), hr, 0, -.17, -.1); [-1, 1].forEach(s => add(head, new THREE.BoxGeometry(.04, .3, .12), hr, s * .115, -.1, -.03)); }
    if (hs === 'bob') { add(head, new THREE.BoxGeometry(.27, .17, .2), hr, 0, -.06, -.04); [-1, 1].forEach(s => add(head, new THREE.BoxGeometry(.04, .14, .14), hr, s * .12, -.04, 0)); }
    if (hs === 'spiky') for (let i = 0; i < 7; i++) { const c = cone(head, .035, .12, hr, -.09 + i * .03, .13, .01 + (i % 2) * .02, 8); c.rotation.z = (i - 3) * .12; }
    if (hs === 'short') add(head, new THREE.BoxGeometry(.2, .04, .05), hr, 0, .085, .09);
    if (hs === 'bun') { sph(head, .064, hr, 0, .155, -.075); tor(head, .066, .012, soft('#e9e3d8'), 0, .155, -.075); }
    if (hs === 'pony') { const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, .09, -.12), new THREE.Vector3(0, .02, -.2), new THREE.Vector3(0, -.12, -.2)]), 16, .036, 10, false), hr); t.castShadow = true; head.add(t); sph(head, .04, soft('#d946ef'), 0, .08, -.125); }
    if (hs === 'pig') [-1, 1].forEach(s => { sph(head, .05, hr, s * .15, .0, -.03); sph(head, .036, soft('#ef4444'), s * .125, .03, -.02); sph(head, .045, hr, s * .17, -.07, -.03); });
    if (o.hat === 'hard') { sph(head, 1, glossy('#ffd21f', { roughness: .3 }), 0, .045, 0, .135, .1, .135); add(head, new THREE.CylinderGeometry(.165, .165, .012, 28), glossy('#ffd21f', { roughness: .3 }), 0, .062, .015); const r = cyl(head, .012, .012, .18, glossy('#ffd21f'), 0, .14, 0, 8); r.rotation.x = Math.PI / 2; }
    if (o.hat === 'army') { sph(head, 1, soft('#5b6b36', { roughness: .85 }), 0, .045, -.005, .132, .098, .136); const v = add(head, new THREE.CylinderGeometry(.095, .095, .01, 24, 1, false, -.9, 1.8), soft('#4a5a2a'), 0, .052, .115); v.scale.z = .9; }
    if (o.hat === 'band') tor(head, .121, .013, soft('#ffffff'), 0, .045, 0).rotation.x = Math.PI / 2;
    // props held in the right hand
    if (o.prop) { const p = grp(arms[1], 0, -.66, .04);
      if (o.prop === 'racket') { cyl(p, .014, .014, .28, soft('#222'), 0, -.1, .1, 8).rotation.x = .6; const hd = tor(p, .095, .011, soft('#e53935'), 0, -.26, .26); hd.scale.y = 1.25; hd.rotation.x = .6; const ns = add(p, new THREE.CircleGeometry(.09, 20), soft('#ffffff', { transparent: true, opacity: .32, side: THREE.DoubleSide }), 0, -.26, .26); ns.scale.y = 1.25; ns.rotation.x = .6; }
      if (o.prop === 'ball') { sph(p, .1, soft('#e8761e', { roughness: .8 }), 0, -.09, .08); [0, Math.PI / 2].forEach(a => { const r = tor(p, .1, .004, soft('#2a1a10'), 0, -.09, .08); r.rotation.y = a; }); } }
    { const s0 = (o.sc || 1) * (o.kid ? .76 : 1); g.scale.set(s0 * 1.1, s0, s0 * 1.1); } root.userData = { legL: legs[0], legR: legs[1], armL: arms[0], armR: arms[1], head, walk: 0 };
    return { root, h: 2.08, eyes: eyeL, head, update(t, dt, st) { arms[0].rotation.z = .06 + Math.sin(t * 1.8) * .03; arms[1].rotation.z = -.06 - Math.sin(t * 1.8) * .03; if (st.happy) { arms[1].rotation.z = 2.5 + Math.sin(t * 6) * .22; } head.rotation.y = Math.sin(t * .8) * .22; head.rotation.x = st.sad ? .25 : st.sleep ? .3 : 0; mouth.scale.y = st.happy ? 1 : st.sad ? -1 : .6; } };
  }
  window.M3D.person = person;
  const P = typeof PEOPLE !== 'undefined' ? PEOPLE : {};
  const preset = (k, extra) => o => person(Object.assign({}, P[k], { sc: 1 }, extra || {}, o || {}));
  B.joey = preset('joey'); B.monica = preset('monica'); B.chandler = preset('chandler'); B.rachel = preset('rachel'); B.ross = preset('ross'); B.phoebe = preset('phoebe');
  B.mom = preset('mom'); B.sis18 = preset('sis18'); B.dad = preset('dad'); B.bro14 = preset('bro14', { prop: 'racket' }); B.sis8 = preset('sis8', { prop: 'ball' });
  // room-dependent outfits for Joey's companion (same fields the 2D art uses)
  // the VIP apartment gets the same nicer people
  const old = W3D.mkPerson;
  W3D.mkPerson = function (o) { try { const m = person(Object.assign({}, o, { sc: 1 })); const g = new THREE.Group(); g.add(m.root); g.userData = m.root.userData; g.scale.setScalar((o && o.sc) || 1); return g; } catch (e) { return old(o); } };
})();
