'use strict';
/* =====================================================================
   3D free-roam mode (VIP): Hugsy + Joey in the apartment, balcony and
   Monica's apartment. Built with three.js r128 (loaded from cdnjs).
   ===================================================================== */
(function () {
  let R = null; // runtime (null when the mode is closed)

  /* ---------- stations (interaction spots) ---------- */
  const ST = [
    { id: 'fridge', x: -16.1, z: -7.3, e: '🧊', kind: 'food', n: T('המקרר', 'The fridge', 'الثلاجة', 'Холодильник', 'La nevera'), line: "Joey doesn't share food!" },
    { id: 'pour', x: -15.9, z: -5.2, e: '🥣', acts: ['pour'], line: 'Hugsy Flakes! Breakfast of champions!' },
    { id: 'groceries', x: -15.9, z: -3.4, e: '🛒', acts: ['groceries'], line: 'Groceries! Do we have pizza in there?' },
    { id: 'special', x: -13.5, z: -5.5, e: '🍕', acts: ['special'], line: 'The Joey Special! Two pizzas!' },
    { id: 'moist', x: -11.0, z: -7.3, e: '🥪', acts: ['moistmaker'], line: 'Is that the Moist Maker I smell?' },
    { id: 'tv', x: -9.0, z: -3.5, e: '📺', acts: ['tv'], line: 'Movie night, buddy!' },
    { id: 'hide', x: -4.4, z: -7.3, e: '🙈', acts: ['hidepeng'], line: 'Hide and seek! You hide, I count!' },
    { id: 'pillow', x: -14.8, z: -3.0, e: '🛋️', acts: ['pillow'], line: 'Cushion fort time!' },
    { id: 'foos', x: -13.8, z: 1.6, e: '⚽', acts: ['foosball'], line: "Foosball! Let's go, buddy!" },
    { id: 'dance', x: -9.3, z: -0.3, e: '💃', acts: ['dance'], line: "How you doin'? Wanna dance?" },
    { id: 'gym', x: -15.6, z: 3.0, e: '🏋️', acts: ['pushups', 'weights', 'stretch'], line: "Penguins don't quit!" },
    { id: 'run', x: -11.5, z: 7.3, e: '🐧', acts: ['waddle'], line: 'Waddle run on the balcony!' },
    { id: 'studio', x: -8.2, z: 2.9, e: '📸', acts: ['poses', 'shutter', 'flakes'], line: 'Hugsy Flakes photo shoot! Work it!' },
    { id: 'set', x: -4.6, z: 2.0, e: '🎬', acts: ['lines', 'operate', 'mark', 'cuecards', 'audition'], line: 'Dr. Hugsy is in the house!' },
    { id: 'duck', x: -12.4, z: 3.8, e: '🦆', acts: ['duckchick'], line: 'The duck and the chicken are hungry!' },
    { id: 'chandler', x: -5.1, z: -3.7, e: '😂', acts: ['jokes'], npc: 'chandler', line: 'Could this BE any more fun?' },
    { id: 'ross', x: 0, z: -5.6, e: '🛋️', acts: ['pivot'], npc: 'ross', line: 'PIVOT! PIVOT!' },
    { id: 'monica', x: 8.7, z: -6.5, e: '🍝', acts: ['monicacook'], npc: 'monica', line: 'I KNOW!' },
    { id: 'phoebe', x: 13.7, z: 2.6, e: '🎸', acts: ['smelly'], npc: 'phoebe', line: 'Smelly Cat!' },
    { id: 'rachel', x: 15.3, z: -6.0, e: '👗', acts: ['style'], npc: 'rachel', line: "How you doin'? That's the look!" },
    { id: 'view', x: 4.0, z: 7.4, e: '🔭', kind: 'view', n: T('נוף העיר', 'City view', 'منظر المدينة', 'Вид на город', 'Vista de la ciudad'), line: 'Look at that view, buddy!' }
  ];
  const stName = s => s.n ? tx(s.n) : (s.acts ? tx(W('hugsy').acts.find(a => a.id === s.acts[0]).n) : '');

  const { D, solids, solid, blocked, mat, mkPerson, mkHugsy, mkDuck, mkChicken, buildWorld } = W3D;

  /* ---------- runtime ---------- */
  const keys = {};
  let joyV = { x: 0, y: 0 };
  const NPC_DEF = {
    chandler: { x: -5.0, z: -5.6, rot: -1.57, o: { skin: 0xefc59d, hair: 0x6b4a2b, hs: 'short', shirt: 0x7d8fa3, sweater: 1, pants: 0x3f3f46 }, n: 'Chandler' },
    ross: { x: 0, z: -6.6, rot: 0, o: { skin: 0xe8bd94, hair: 0x3b2a1e, hs: 'short', shirt: 0x6d4c41, sweater: 1, pants: 0x394557 }, n: 'Ross' },
    monica: { x: 7.4, z: -6.8, rot: 0, o: { skin: 0xf3cba5, hair: 0x3b2418, hs: 'bob', shirt: 0x8e44ad, apron: 0xffffff, fem: true, pants: 0x37474f }, n: 'Monica' },
    phoebe: { x: 15.6, z: 2.6, rot: -1.57, o: { skin: 0xf3cba5, hair: 0xe5be4e, hs: 'long', shirt: 0x6fcfc4, fem: true, pants: 0x8e6bbf }, n: 'Phoebe' },
    rachel: { x: 14.6, z: -6.4, rot: 3.1, o: { skin: 0xf3cba5, hair: 0xa06a38, hs: 'long', shirt: 0xff7fa8, fem: true, pants: 0x5c6bc0 }, n: 'Rachel' }
  };

  function buildHud(root) {
    root.innerHTML = `<canvas id="c3d"></canvas>
      <div class="h3 h3-top"><button class="btn" data-a="exit3d">✕ ${ui('exit3d')}</button><div class="h3-pill">🪙 <b class="coinsv">${G.coins}</b></div><div class="h3-pill" id="h3lv"></div></div>
      <div class="h3 h3-quest" id="h3q"></div>
      <div class="h3 h3-act hidden" id="h3act"><button data-a="act3d" id="h3actb"></button></div>
      <div class="h3 h3-joy" id="joy"><div class="h3-knob" id="knob"></div></div>
      <div class="h3 h3-ctrl">${ui('ctrl3d')}</div>
      <div class="h3" id="h3labels" style="inset:0;pointer-events:none"></div>`;
  }
  function mkLabel(text, cls) { const e = document.createElement('div'); e.className = cls || 'h3-lab'; e.textContent = text; e.style.position = 'absolute'; e.style.pointerEvents = 'none'; R.labels.appendChild(e); return e; }

  function setupRuntime() {
    const root = $('#s3d'); buildHud(root);
    const cv = $('#c3d');
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, matchMedia('(pointer:coarse)').matches ? 1.4 : 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    const cam = new THREE.PerspectiveCamera(50, 1, .1, 200);
    R = { renderer, cam, root, cv, labels: $('#h3labels'), yaw: 0, pitch: .95, dist: 11, last: 0, t: 0, near: null, raf: 0, joyId: null, quoteT: 0, drag: null, inMonica: false, coins: [], ball: null, ballT: 12, markers: [], npcs: {}, animals: [], joeyT: 0, lastLine: {} };
    // Hugsy & Joey
    R.hug = mkHugsy(); R.hug.position.set(-11.2, 0, -1.2); D.scene.add(R.hug);
    R.joey = mkPerson({ skin: 0xe9b98f, hair: 0x2a1b13, hs: 'spiky', shirt: 0xf3efe6, jacket: 0xc9772e, pants: 0x34445f }); R.joey.position.set(-9.8, 0, 0.2); D.scene.add(R.joey);
    R.labH = mkLabel('Hugsy'); R.labJ = mkLabel('Joey');
    R.jb = document.createElement('div'); R.jb.className = 'h3-bubble'; R.jb.style.cssText = 'position:absolute;opacity:0;transition:opacity .25s;pointer-events:none'; R.labels.appendChild(R.jb);
    // NPCs
    for (const k in NPC_DEF) { const d = NPC_DEF[k], m = mkPerson(d.o); m.position.set(d.x, 0, d.z); m.rotation.y = d.rot; D.scene.add(m); solid(d.x, d.z, .8, .8); R.npcs[k] = { m, lab: mkLabel(d.n), base: d, ph: Math.random() * 6 }; }
    // phoebe's guitar
    const gt = new THREE.Group(); const gb = new THREE.Mesh(new THREE.SphereGeometry(.17, 14, 10), mat(0xc2762b)); gb.scale.set(1, 1.2, .35); gt.add(gb); const gn = new THREE.Mesh(new THREE.BoxGeometry(.05, .55, .04), mat(0x4a2f16)); gn.position.y = .42; gt.add(gn); const gh = new THREE.Mesh(new THREE.TorusGeometry(.05, .015, 6, 12), mat(0x111111)); gh.position.set(0, -.02, .07); gt.add(gh); gt.position.set(.0, 1.1, .2); gt.rotation.set(.1, 0, .9); R.npcs.phoebe.m.add(gt);
    // animals
    [[mkDuck(), -11, 2], [mkChicken(), -12.8, 3]].forEach(a => { a[0].position.set(a[1], 0, a[2]); D.scene.add(a[0]); R.animals.push({ m: a[0], tx: a[1], tz: a[2], wait: 0 }); });
    // station markers
    ST.forEach(s => { const el = document.createElement('div'); el.className = 'h3-lab'; el.style.cssText = 'position:absolute;font-size:26px;pointer-events:none;text-shadow:0 2px 6px #0008'; el.textContent = s.e; R.labels.appendChild(el); R.markers.push({ s, el }); });
    R.arrow = document.createElement('div'); R.arrow.className = 'h3-arrow'; R.arrow.textContent = '👇'; R.arrow.style.position = 'absolute'; R.arrow.style.pointerEvents = 'none'; R.labels.appendChild(R.arrow);
    spawnCoins(22);
    resize3d();
    // input
    window.addEventListener('resize', resize3d); window.addEventListener('keydown', onKeyDown); window.addEventListener('keyup', onKeyUp);
    cv.addEventListener('pointerdown', e => { R.drag = { x: e.clientX, y: e.clientY }; cv.setPointerCapture && cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (!R.drag) return; R.yaw -= (e.clientX - R.drag.x) * .008; R.pitch = clamp(R.pitch + (e.clientY - R.drag.y) * .004, .5, 1.25); R.drag = { x: e.clientX, y: e.clientY }; });
    const endDrag = () => R.drag = null; cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);
    const joy = $('#joy'), knob = $('#knob');
    const jmove = e => { const r = joy.getBoundingClientRect(); let x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2); const m = Math.hypot(x, y), mx = 50; if (m > mx) { x = x / m * mx; y = y / m * mx; } knob.style.transform = `translate(${x}px,${y}px)`; joyV = { x: x / mx, y: y / mx }; };
    joy.addEventListener('pointerdown', e => { R.joyId = e.pointerId; joy.setPointerCapture(e.pointerId); jmove(e); e.stopPropagation(); });
    joy.addEventListener('pointermove', e => { if (R.joyId === e.pointerId) jmove(e); });
    const jend = e => { if (R.joyId === e.pointerId) { R.joyId = null; joyV = { x: 0, y: 0 }; knob.style.transform = ''; } };
    joy.addEventListener('pointerup', jend); joy.addEventListener('pointercancel', jend);
  }
  function teardownRuntime() {
    window.removeEventListener('resize', resize3d); window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp);
    cancelAnimationFrame(R.raf);
    [R.hug, R.joey].concat(Object.keys(R.npcs).map(k => R.npcs[k].m), R.animals.map(a => a.m), R.coins.map(c => c.m), R.ball ? [R.ball.m] : []).forEach(o => D.scene.remove(o));
    solids.length = D.baseSolids; R.renderer.dispose(); $('#s3d').innerHTML = ''; R = null; joyV = { x: 0, y: 0 };
    for (const k in keys) keys[k] = false;
  }
  function resize3d() { if (!R) return; const w = innerWidth, h = innerHeight; R.renderer.setSize(w, h, false); R.cam.aspect = w / h; R.cam.fov = w / h < 1 ? 68 : 50; R.cam.updateProjectionMatrix(); }
  const paused = () => !!(GAME || MOPEN);
  function onKeyDown(e) { if (!R) return; keys[e.code] = true; if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) { if (!GAME && !MOPEN) e.preventDefault(); } if ((e.code === 'Space' || e.code === 'KeyF' || e.code === 'Enter') && !paused()) interact(); }
  function onKeyUp(e) { keys[e.code] = false; }

  function spawnCoins(n) {
    for (let i = 0; i < n; i++) {
      let x, z, g = 0; do { const side = Math.random(); x = side < .55 ? rnd(-17, -2.6) : side < .9 ? rnd(2.6, 17) : rnd(-16, 16); z = x > -17 && Math.random() < .12 ? rnd(5.6, 8.4) : rnd(-8, 4.4); g++; } while (blocked(x, z, .5) && g < 40);
      addCoin(x, z);
    }
  }
  function addCoin(x, z) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .05, 24), mat(0xf5a30a, { emissive: 0x8a4500, emissiveIntensity: .7, metalness: .7, roughness: .3 })); m.rotation.x = Math.PI / 2; m.position.set(x, .75, z); m.castShadow = true; D.scene.add(m); R.coins.push({ m, x, z, ph: Math.random() * 6 });
  }

  /* ---------- Joey speech ---------- */
  function joySay(text, ms) {
    if (!R) return; R.jb.textContent = text; R.jb.style.opacity = 1; clearTimeout(R.jbT); R.jbT = setTimeout(() => { if (R) R.jb.style.opacity = 0; }, ms || 3600);
  }
  const lineCool = (k, sec) => { const n = performance.now(); if (R.lastLine[k] && n - R.lastLine[k] < sec * 1000) return false; R.lastLine[k] = n; return true; };

  /* ---------- quest / guide ---------- */
  function targetStation() {
    const w = W('hugsy'), c = cs('hugsy'), ch = w.story[c.ch]; if (!ch) return null;
    if (ch.k === 'actid') return ST.find(s => s.acts && s.acts.includes(ch.a));
    if (ch.k === 'feed') return ST.find(s => s.id === 'fridge');
    if (ch.k === 'poi') return { x: 8, z: 0, e: '🟣', n: T('הדירה של מוניקה', "Monica's apartment", 'شقة مونيكا', 'Квартира Моники', 'El piso de Monica') };
    const okAct = w.acts.filter(a => a.lv <= c.lv); const pool = ST.filter(s => s.acts && s.acts.some(id => okAct.find(a => a.id === id)));
    return pool.length ? pool[(c.cnt.act || 0) % pool.length] : null;
  }
  function renderQuest() {
    const w = W('hugsy'), c = cs('hugsy'), ch = w.story[c.ch], q = $('#h3q'), lv = $('#h3lv'); if (!q) return;
    lv.textContent = ui('lv', { n: c.lv }) + ' · ⭐ ' + Math.round(c.st.fame);
    if (!ch) { q.innerHTML = `<b>${ui('s_title')}</b>${ui('allchapters')}<div class="quote">${ui('coin3d')}</div>`; return; }
    const t = targetStation(), p = Math.min(ch.n, prog('hugsy', ch));
    q.innerHTML = `<b>${ui('chapter', { n: c.ch + 1 })} · ${ui('nextgoal')}</b>${tx(ch.d)}<div class="quote">${ch.q || ''}</div><small>${t ? (t.e + ' ' + (t.n ? tx(t.n) : stName(t))) : ''} — ${p}/${ch.n}</small>`;
  }

  /* ---------- interaction ---------- */
  function nearStation() {
    let best = null, bd = 1e9; const p = R.hug.position;
    ST.forEach(s => { const d = Math.hypot(p.x - s.x, p.z - s.z); if (d < 1.9 && d < bd) { bd = d; best = s; } });
    return best;
  }
  function interact() {
    if (!R || !R.near) return; const s = R.near;
    if (s.kind === 'food') return fridgeModal();
    if (s.kind === 'view') return viewAct();
    if (s.acts.length === 1) return start3d(s.acts[0]);
    const w = W('hugsy'), c = cs('hugsy');
    modal(`<h2>${s.e} ${stName(s)}</h2><div class="grid">${s.acts.map(id => { const a = w.acts.find(x => x.id === id), lock = c.lv < a.lv; return `<button class="tile-card ${lock ? 'lock' : ''}" data-a="act3dgo" data-v="${id}"><span class="ti">${a.e}</span><b>${tx(a.n)}</b><small>${lock ? ui('locked', { n: a.lv }) : '⚡' + (a.cost || 7)}</small></button>`; }).join('')}</div><button class="btn" data-a="mclose">${ui('close')}</button>`);
  }
  function start3d(aid) {
    UIS.wid = 'hugsy'; const w = W('hugsy'), a = w.acts.find(x => x.id === aid); if (!a) return;
    if (R) joySay(pick(JOEY[ROOM_KIND[a.room]] || JOEY.greet), 2600);
    startAct(aid);
  }
  function viewAct() {
    const c = cs('hugsy'); if (!lineCool('view', 20)) return joySay('Take a deep breath, buddy.');
    addStat(c, 'love', 8); addStat(c, 'fun', 6); addCoins(6); save(); sfx('ok'); joySay('Look at that view, buddy! Best apartment in the city.'); renderQuest();
  }
  function fridgeModal() {
    const grid = () => { const c = cs('hugsy'); return `<div class="grid">${W('hugsy').foods.map(fid => { const f = FOODS[fid], lock = c.lv < f.lv; return `<button class="tile-card ${lock ? 'lock' : ''}" data-a="food3d" data-v="${fid}"><span class="ti">${f.e}</span><b>${tx(f.n)}</b><small>${lock ? ui('locked', { n: f.lv }) : '🪙 ' + f.c}</small><div class="fxrow">${lock ? '' : fxChips(f.fx)}</div></button>`; }).join('')}</div>`; };
    const c = cs('hugsy'); refreshChar('hugsy');
    modal(`<h2>🧊 ${tx(ST[0].n)}</h2><div class="stat"><span class="se">🍽️</span><div class="sb"><i id="hbar" style="width:${Math.round(c.st.hunger)}%;background:#f59e0b"></i></div><small>${ui('s_hunger')}</small></div><div id="fgrid">${grid()}</div><button class="btn pri" data-a="mclose">${ui('close')}</button>`);
    R.fridgeGrid = grid;
    joySay("Joey doesn't share food! ...but Hugsy can have some.");
  }
  ACT.food3d = e => { feed(e.dataset.v); const g = $('#fgrid'); if (g && R) { g.innerHTML = R.fridgeGrid(); const b = $('#hbar'); if (b) b.style.width = Math.round(cs('hugsy').st.hunger) + '%'; joySay(pick(JOEY.eat)); } renderQuest(); };
  ACT.act3dgo = e => { closeModal(); start3d(e.dataset.v); };
  ACT.act3d = () => interact();
  ACT.exit3d = () => close3D(false);

  window.onGameResult = (o, r) => {
    if (!R) return; const st = r.st || 0; joySay(pick(st >= 2 ? JOEY.win : st === 0 ? JOEY.lose : JOEY.win)); renderQuest();
  };
  window.onGameClosed = () => { if (R) renderQuest(); };

  /* ---------- update loop ---------- */
  function moveEntity(o, dx, dz, r) {
    const p = o.position; let nx = p.x + dx, nz = p.z;
    if (!blocked(nx, nz, r)) p.x = nx; nx = p.x; nz = p.z + dz; if (!blocked(nx, nz, r)) p.z = nz;
    p.x = clamp(p.x, -17.4, 17.4); p.z = clamp(p.z, -8.4, 8.5);
  }
  function walkAnim(o, moving, t, spd) {
    const u = o.userData; u.walk = moving ? u.walk + spd : u.walk * .85;
    const s = Math.sin(u.walk) * (moving ? .75 : 0);
    if (u.legL) { u.legL.rotation.x = s; u.legR.rotation.x = -s; u.armL.rotation.x = -s * .8; u.armR.rotation.x = s * .8; }
  }
  const lerpAng = (a, b, t) => { let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; return a + d * t; };
  function update(dt) {
    R.t += dt; const t = R.t, hug = R.hug, jo = R.joey;
    const go = !paused();
    let ix = 0, iy = 0;
    if (go) {
      if (keys.KeyA || keys.ArrowLeft) ix -= 1; if (keys.KeyD || keys.ArrowRight) ix += 1; if (keys.KeyW || keys.ArrowUp) iy -= 1; if (keys.KeyS || keys.ArrowDown) iy += 1;
      ix += joyV.x; iy += joyV.y; if (keys.KeyQ) R.yaw += dt * 1.8; if (keys.KeyE) R.yaw -= dt * 1.8;
    }
    const mag = Math.min(1, Math.hypot(ix, iy)); let moving = false;
    if (mag > .08) {
      const l = Math.hypot(ix, iy) || 1; const nx = ix / l, ny = iy / l;
      const dx = Math.cos(R.yaw) * nx + Math.sin(R.yaw) * ny, dz = -Math.sin(R.yaw) * nx + Math.cos(R.yaw) * ny, sp = 4.4 * mag;
      moveEntity(hug, dx * sp * dt, dz * sp * dt, .45); hug.rotation.y = lerpAng(hug.rotation.y, Math.atan2(dx, dz), Math.min(1, dt * 12)); moving = true;
    }
    hug.userData.walk = moving ? hug.userData.walk + dt * 11 : hug.userData.walk * .85;
    const hw = Math.sin(hug.userData.walk); hug.userData.body.rotation.z = moving ? hw * .13 : 0; hug.userData.flL.rotation.z = moving ? hw * .7 : Math.sin(t * 2) * .05; hug.userData.flR.rotation.z = moving ? -hw * .7 : -Math.sin(t * 2) * .05;
    hug.position.y = moving ? Math.abs(Math.sin(hug.userData.walk)) * .06 : 0;
    // Joey follows
    const jx = hug.position.x - jo.position.x, jz = hug.position.z - jo.position.z, jd = Math.hypot(jx, jz);
    let jm = false;
    if (jd > 11) { jo.position.set(hug.position.x + 1.5, 0, hug.position.z + 1.5); }
    else if (jd > 2.3) { const sp = Math.min(5.2, 2 + (jd - 2.3) * 1.6); moveEntity(jo, jx / jd * sp * dt, jz / jd * sp * dt, .45); jm = true; }
    if (jd > .1) jo.rotation.y = lerpAng(jo.rotation.y, Math.atan2(jx, jz), Math.min(1, dt * 8));
    walkAnim(jo, jm, t, dt * 10); if (!jm) { jo.userData.head.rotation.z = Math.sin(t * 1.5) * .05; }
    // NPCs idle
    for (const k in R.npcs) { const n = R.npcs[k]; n.m.position.y = k === 'phoebe' || k === 'chandler' ? -.18 : 0; n.m.userData.head.rotation.y = Math.sin(t * .8 + n.ph) * .35; n.m.userData.armR.rotation.x = k === 'ross' ? Math.sin(t * 3) * .3 : (k === 'phoebe' ? Math.sin(t * 6) * .35 : 0); }
    // animals wander
    R.animals.forEach(a => {
      const m = a.m, dx = a.tx - m.position.x, dz = a.tz - m.position.z, d = Math.hypot(dx, dz);
      if (a.wait > 0) { a.wait -= dt; if (a.wait <= 0) { let g = 0, x, z; do { x = rnd(-16.5, -3); z = rnd(-7, 4.4); g++; } while (blocked(x, z, .4) && g < 20); a.tx = x; a.tz = z; } return; }
      if (d < .25) { a.wait = rnd(1, 3.5); m.position.y = 0; return; }
      moveEntity(m, dx / d * 1.1 * dt, dz / d * 1.1 * dt, .3); m.rotation.y = lerpAng(m.rotation.y, Math.atan2(dx, dz), .1); m.position.y = Math.abs(Math.sin(t * 9)) * .05;
    });
    // coins
    for (let i = R.coins.length - 1; i >= 0; i--) {
      const c = R.coins[i]; c.m.rotation.z = t * 2.4 + c.ph; c.m.position.y = .75 + Math.sin(t * 2 + c.ph) * .1;
      if (Math.hypot(hug.position.x - c.x, hug.position.z - c.z) < .85) { D.scene.remove(c.m); R.coins.splice(i, 1); G.coins += 2; sfx('coin'); updateCoins(); bump('hugsy', 'earn', 2); setTimeout(() => { if (R) { let x, z, g = 0; do { x = rnd(-17, 17); z = rnd(-8, 4.4); g++; } while (blocked(x, z, .5) && g < 40); addCoin(x, z); } }, 25000); if (R.coins.length % 5 === 0) save(); }
    }
    // ball fetch
    R.ballT -= dt;
    if (!R.ball && R.ballT <= 0 && go) {
      let x, z, g = 0; do { x = hug.position.x + rnd(-5, 5); z = hug.position.z + rnd(-4, 4); g++; } while ((blocked(x, z, .5) || x < -17 || x > 17 || z < -8 || z > 4.5) && g < 40);
      const m = new THREE.Mesh(new THREE.SphereGeometry(.25, 14, 12), mat(0xfacc15)); m.position.set(x, .3, z); m.castShadow = true; D.scene.add(m); R.ball = { m, x, z }; joySay('Hugsy, fetch the ball! Go go go!');
    }
    if (R.ball) { R.ball.m.position.y = .3 + Math.abs(Math.sin(t * 5)) * .35; if (Math.hypot(hug.position.x - R.ball.x, hug.position.z - R.ball.z) < .9) { D.scene.remove(R.ball.m); R.ball = null; R.ballT = rnd(25, 40); G.coins += 6; addStat(cs('hugsy'), 'fun', 5); sfx('win'); updateCoins(); bump('hugsy', 'earn', 6); save(); joySay('Nice catch, buddy! That is my penguin!'); } }
    // monica apartment region
    const inM = hug.position.x > 2.4 && hug.position.z < 5.2;
    if (inM && !R.inMonica) { const c = cs('hugsy'); c.cnt.poi_monica = (c.cnt.poi_monica || 0) + 1; checkStory('hugsy'); renderQuest(); joySay("Welcome to Monica's! Don't touch anything."); }
    R.inMonica = inM;
    // nearest station & Joey comments
    const ns = nearStation(); const was = R.near; R.near = ns;
    const act = $('#h3act'), ab = $('#h3actb');
    if (ns && !paused()) { act.classList.remove('hidden'); ab.textContent = ns.e + ' ' + (ns.kind === 'food' ? ui('c_feed') : stName(ns)); if (ns !== was && lineCool('st_' + ns.id, 18)) joySay(ns.line, 3200); } else act.classList.add('hidden');
    // idle chatter
    R.quoteT -= dt; if (R.quoteT <= 0 && go) { R.quoteT = rnd(16, 28); if (!ns) joySay(pick(Math.random() < .35 ? ['How you doin\'?', 'It\'s a moo point.', 'Joey doesn\'t share food!', 'Pivot! Pivot!'] : JOEY.greet)); }
    // camera
    const cx = hug.position.x + Math.sin(R.yaw) * Math.cos(R.pitch) * R.dist, cz = hug.position.z + Math.cos(R.yaw) * Math.cos(R.pitch) * R.dist, cy = Math.sin(R.pitch) * R.dist + 1;
    R.cam.position.x += (cx - R.cam.position.x) * Math.min(1, dt * 6); R.cam.position.y += (cy - R.cam.position.y) * Math.min(1, dt * 6); R.cam.position.z += (cz - R.cam.position.z) * Math.min(1, dt * 6);
    R.cam.lookAt(hug.position.x, 1.0, hug.position.z);
  }
  const _v = new THREE.Vector3();
  function placeLabel(el, x, y, z, hide) {
    _v.set(x, y, z).project(R.cam);
    if (hide || _v.z > 1) { el.style.display = 'none'; return; }
    el.style.display = ''; el.style.left = (_v.x * .5 + .5) * innerWidth + 'px'; el.style.top = (-_v.y * .5 + .5) * innerHeight + 'px';
  }
  function updateLabels() {
    const t = R.t, hp = R.hug.position;
    placeLabel(R.labH, hp.x, 2.0, hp.z); placeLabel(R.labJ, R.joey.position.x, 2.75, R.joey.position.z);
    placeLabel(R.jb, R.joey.position.x, 3.15, R.joey.position.z);
    if (R.jb.style.display !== 'none') { const bw = R.jb.offsetWidth / 2 + 8; R.jb.style.left = clamp(parseFloat(R.jb.style.left) || 0, bw, innerWidth - bw) + 'px'; R.jb.style.top = Math.max(parseFloat(R.jb.style.top) || 0, 110) + 'px'; }
    for (const k in R.npcs) { const n = R.npcs[k]; placeLabel(n.lab, n.m.position.x, 2.7, n.m.position.z); }
    R.markers.forEach(mk => { const d = Math.hypot(hp.x - mk.s.x, hp.z - mk.s.z); const show = d < 12; placeLabel(mk.el, mk.s.x, 1.8 + Math.sin(t * 3 + mk.s.x) * .12, mk.s.z, !show); mk.el.style.fontSize = (R.near === mk.s ? 36 : 26) + 'px'; });
    const tg = targetStation(); if (tg) placeLabel(R.arrow, tg.x, 3.1 + Math.sin(t * 4) * .25, tg.z); else R.arrow.style.display = 'none';
  }
  function loop(now) {
    if (!R) return; R.raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - (R.last || now)) / 1000); R.last = now;
    try { update(dt); updateLabels(); R.renderer.render(D.scene, R.cam); } catch (e) { console.error(e); cancelAnimationFrame(R.raf); toast('⚠️ ' + e.message); }
  }

  /* ---------- open / close ---------- */
  window.open3D = function () {
    if (typeof THREE === 'undefined' || window.THREE_FAIL) return toast(ui('no3d'));
    if (!G.vip) return;
    try {
      if (!D.built) buildWorld();
      UIS.screen = '3d'; UIS.wid = 'hugsy';
      $('#screens').classList.add('hidden'); $('#s3d').classList.remove('hidden'); document.body.classList.add('in3d');
      setupRuntime(); R.cam.position.set(-10, 9, 9);
      renderQuest(); R.raf = requestAnimationFrame(loop);
      setTimeout(() => joySay("How you doin'? Walk around, buddy! Follow the arrow!"), 600);
      window.scrollTo(0, 0);
    } catch (e) { console.error(e); toast(ui('no3d')); $('#s3d').classList.add('hidden'); $('#screens').classList.remove('hidden'); document.body.classList.remove('in3d'); UIS.screen = 'world'; R = null; }
  };
  window.debug3D = () => R && { x: +R.hug.position.x.toFixed(2), z: +R.hug.position.z.toFixed(2), near: R.near && R.near.id, yaw: R.yaw, coins: R.coins.length, t: +R.t.toFixed(2), keys: Object.keys(keys).filter(k => keys[k]), paused: paused(), raf: R.raf };
  window.reach3D = function () {
    const step = .3, key = (i, j) => i + ',' + j, seen = new Set([key(Math.round(-11.2 / step), Math.round(-1.2 / step))]), q = [[Math.round(-11.2 / step), Math.round(-1.2 / step)]];
    while (q.length) { const [i, j] = q.pop(); for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ni = i + a, nj = j + b, x = ni * step, z = nj * step; if (x < -17.4 || x > 17.4 || z < -8.4 || z > 8.5 || seen.has(key(ni, nj)) || blocked(x, z, .45)) continue; seen.add(key(ni, nj)); q.push([ni, nj]); } }
    return ST.filter(s => { for (const k of seen) { const [i, j] = k.split(',').map(Number); if (Math.hypot(i * step - s.x, j * step - s.z) < 1.8) return false; } return true; }).map(s => s.id);
  };
  window.close3D = function (silent) {
    if (!R) return;
    if (GAME) closeGame(true);
    teardownRuntime(); $('#s3d').classList.add('hidden'); $('#screens').classList.remove('hidden'); document.body.classList.remove('in3d');
    save();
    if (!silent) openWorld('hugsy');
  };
})();
