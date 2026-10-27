'use strict';
/* =====================================================================
   Stage3D — the selected character as a live 3D model on top of the 2D
   scene: studio lights + reflections, soft shadow, idle animation, drag to
   turn, tap to jump. Falls back to the 2D art when WebGL / three.js is
   missing (e.g. offline).
   ===================================================================== */
const Stage3D = (() => {
  const ok = typeof THREE !== 'undefined' && window.M3D && window.M3K && !window.THREE_FAIL;
  if (!ok) return { available: false, sync() { }, on: () => false };
  const C = window.M3K.C;
  let R = null, broken = false, host = null, canvas = null, sig = '', main = null, comp = null, cameo = null, raf = 0, last = 0, T = 0;
  let spin = 0, spinV = 0, idleT = 0, jump = 0, blinkT = 3, blink = 0, mood = 'happy', moodFn = null, hearts = [], heartT = 0, drag = null, size = [0, 0];
  const dispose = o => { if (!o) return; o.traverse(m => { if (m.geometry) m.geometry.dispose(); if (m.material) [].concat(m.material).forEach(mt => { ['map', 'bumpMap', 'emissiveMap'].forEach(k => { if (mt[k]) mt[k].dispose(); }); mt.dispose(); }); }); if (o.parent) o.parent.remove(o); };

  function makeEnv(rd) {
    const s = new THREE.Scene(); s.add(new THREE.Mesh(new THREE.BoxGeometry(24, 14, 24), new THREE.MeshBasicMaterial({ color: C('#6c7899'), side: THREE.BackSide })));
    [[-7, 5, 5, '#ffffff', 6, 5, 3], [7, 4, -3, '#ffe0b8', 4, 4, 3], [0, 10, 0, '#fff4e6', 7, 6, 6], [0, 3, -10, '#a7b8ff', 3.5, 8, 3], [-9, 2, -2, '#ffd6e8', 2.5, 4, 4]].forEach(p => { const m = new THREE.Mesh(new THREE.PlaneGeometry(p[5], p[6]), new THREE.MeshBasicMaterial({ color: new THREE.Color(p[3]).convertSRGBToLinear().multiplyScalar(p[4]), side: THREE.DoubleSide })); m.position.set(p[0], p[1], p[2]); m.lookAt(0, 1, 0); s.add(m); });
    const pm = new THREE.PMREMGenerator(rd), rt = pm.fromScene(s, .035); pm.dispose(); return rt.texture;
  }
  function init() {
    if (R || broken) return !!R;
    try {
      const rd = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      rd.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75)); rd.outputEncoding = THREE.sRGBEncoding; rd.toneMapping = THREE.ACESFilmicToneMapping; rd.toneMappingExposure = .92;
      rd.shadowMap.enabled = true; rd.shadowMap.type = THREE.PCFSoftShadowMap; rd.setClearColor(0x000000, 0);
      const scene = new THREE.Scene(); scene.environment = makeEnv(rd);
      const cam = new THREE.PerspectiveCamera(30, 1.2, .1, 100);
      scene.add(new THREE.HemisphereLight(C('#dfeaff'), C('#9a7a5a'), .55));
      const key = new THREE.DirectionalLight(C('#fff1dd'), 1.7); key.position.set(-3.5, 7, 6); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -5; key.shadow.camera.right = 5; key.shadow.camera.top = 6; key.shadow.camera.bottom = -2; key.shadow.camera.near = 1; key.shadow.camera.far = 20; key.shadow.bias = -.0004; key.shadow.radius = 5; scene.add(key);
      const rim1 = new THREE.DirectionalLight(C('#9db4ff'), 1.5); rim1.position.set(5, 4, -5); scene.add(rim1); const rim2 = new THREE.DirectionalLight(C('#ffb3e6'), 1.1); rim2.position.set(-5, 3, -4); scene.add(rim2);
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: .3 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
      const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: window.M3K.cv(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }), transparent: true, depthWrite: false })); blob.rotation.x = -Math.PI / 2; blob.position.y = .005; scene.add(blob);
      const pivot = new THREE.Group(); scene.add(pivot);
      canvas = rd.domElement; canvas.className = 's3cv'; canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
      canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); broken = true; unmount(); });
      R = { rd, scene, cam, key, blob, pivot }; return true;
    } catch (e) { broken = true; console.warn('3D stage unavailable', e); return false; }
  }
  /* ---- input: drag to turn, tap to poke ---- */
  function down(e) { drag = { x: e.clientX, y: e.clientY, moved: false, sx: spin }; try { canvas.setPointerCapture(e.pointerId); } catch (x) { } idleT = 0; }
  function move(e) { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 5) drag.moved = true; if (drag.moved) { const ns = drag.sx + dx * .013; spinV = (ns - spin) * 14; spin = ns; idleT = 0; } }
  function up() { const d = drag; drag = null; if (d && !d.moved) { jump = 1; if (typeof ACT !== 'undefined' && ACT.poke) ACT.poke(); } }

  /* ---- build the models for the open world ---- */
  function wantSig() {
    const id = UIS.wid, w = W(id), c = cs(id);
    return [id, JSON.stringify(c.worn), w.outfit ? dirtLv(id) : 0, c.st.chill !== undefined && c.st.chill < 30 ? 'melt' : '', w.comp ? UIS.room : '', w.cameo ? (w.cameo[UIS.room] || '') : '', LANG].join('|');
  }
  function mk(artId, o) { const f = window.M3D.build[artId]; if (!f) return null; try { const m = f(o || {}); m.root.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; [].concat(n.material).forEach(mt => { if (mt && mt.envMapIntensity !== undefined) mt.envMapIntensity = .55; }); } }); return m; } catch (e) { console.warn('3D model failed', artId, e); return null; } }
  function rebuild() {
    const id = UIS.wid, w = W(id), c = cs(id);
    [main, comp, cameo].forEach(m => m && dispose(m.root)); main = comp = cameo = null; hearts.forEach(h => dispose(h.s)); hearts = [];
    main = mk(w.art, { worn: wornMap(c), dirt: w.outfit ? dirtLv(id) : 0, melt: c.st.chill !== undefined && c.st.chill < 30 });
    if (!main) return false;
    if (w.comp) comp = mk(w.comp.art, w.compRoom ? (w.compRoom[UIS.room] || {}) : {});
    const ca = w.cameo && w.cameo[UIS.room]; if (ca) cameo = mk(ca, {});
    [main, comp, cameo].forEach(m => m && R.pivot.add(m.root)); layout(); return true;
  }
  function layout() {
    if (!R || !main || !size[0]) return;
    const asp = size[0] / size[1], hv = 2.55 / .76;           // world height shown by the view
    const fov = R.cam.fov * Math.PI / 180, dist = (hv / 2) / Math.tan(fov / 2), yc = hv * .47;
    R.cam.aspect = asp; R.cam.position.set(0, yc + hv * .06, dist); R.cam.lookAt(0, yc - hv * .02, 0); R.cam.updateProjectionMatrix();
    const vw = hv * asp, sc = 2.55 / main.h;
    main.root.scale.setScalar(sc); main.root.userData.baseSc = sc;
    const place = (m, hFrac, xFrac) => { if (!m) return; const s = hv * hFrac / m.h; m.root.scale.setScalar(s); m.root.position.set(vw * xFrac, 0, -.1); m.root.userData.baseSc = s; };
    main.root.position.set(comp || cameo ? -vw * .06 : 0, 0, 0);
    place(comp, .56, .31); place(cameo, .44, -.34);
    R.blob.scale.set(1.9, 1.9, 1); R.blob.position.x = main.root.position.x;
  }
  /* ---- mount / unmount into the 2D scene ---- */
  function mount(el) {
    if (!init()) return false;
    const w = W(UIS.wid); if (!window.M3D.build[w.art]) return false;
    host = el; if (canvas.parentNode !== el) el.appendChild(canvas);
    const s = wantSig(); if (s !== sig || !main) { sig = s; if (!rebuild()) return false; }
    resize(); el.classList.add('is3d'); start(); return true;
  }
  function unmount() { stop(); if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas); if (host) host.classList.remove('is3d'); host = null; }
  function resize() { if (!host || !R) return; const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; if (w !== size[0] || h !== size[1]) { size = [w, h]; R.rd.setSize(w, h, false); canvas.style.width = '100%'; canvas.style.height = '100%'; layout(); } }
  function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  /* ---- animation ---- */
  function heart() { const t = window.M3K.cv(64, 64, (c, w, h) => { c.font = '48px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('💗', w / 2, h / 2 + 3); }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false })); s.scale.set(.4, .4, 1); s.position.set((Math.random() - .5) * 1.2, 1.7 + Math.random() * .4, .8); s.renderOrder = 9; R.scene.add(s); hearts.push({ s, age: 0, vx: (Math.random() - .5) * .3 }); }
  function loop(now) {
    raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now; T += dt;
    if (!host || !main) return; if (document.hidden || (typeof GAME !== 'undefined' && GAME)) return;
    if (host.clientWidth !== size[0] || host.clientHeight !== size[1]) resize();
    if (moodFn) mood = moodFn();
    const st = { happy: mood === 'happy' || mood === 'love', love: mood === 'love', sad: mood === 'sad', sleep: mood === 'sleep', eat: mood === 'eat', wow: mood === 'wow' };
    // turning: spring back to the front when idle
    if (!drag) { idleT += dt; spin += spinV * dt; spinV *= Math.exp(-dt * 5); if (idleT > 1.4) spin *= Math.exp(-dt * 2.2); }
    R.pivot.rotation.y = spin + Math.sin(T * .55) * .07;
    jump = Math.max(0, jump - dt * 1.7); const jy = Math.sin(Math.PI * (1 - jump)) * (jump > 0 ? .5 : 0);
    const bob = Math.sin(T * 2.1) * .012 + (st.happy ? Math.abs(Math.sin(T * 4.2)) * .02 : 0);
    [main, comp, cameo].forEach((m, i) => { if (!m) return; const sc = m.root.userData.baseSc || 1; const k = i === 0 ? 1 : .8; m.root.position.y = (i === 0 ? jy : 0) + bob * (i ? .6 : 1) * 2; const br = 1 + Math.sin(T * 2.1 + i) * .012 * k; m.root.scale.set(sc, sc * br, sc); if (m.update) m.update(T + i * 1.7, dt, i === 0 ? st : { happy: true }); });
    // blinking / sleeping eyes
    blinkT -= dt; if (blinkT <= 0) { blink = .13; blinkT = 2.4 + Math.random() * 3; } blink = Math.max(0, blink - dt);
    [main, comp, cameo].forEach((m, i) => { if (!m || !m.eyes) return; const closed = (i === 0 && st.sleep) ? .08 : blink > 0 ? .1 : (i === 0 && st.wow ? 1.25 : 1); m.eyes.forEach(g => { g.scale.y += (closed - g.scale.y) * Math.min(1, dt * 22); }); });
    // love hearts
    if (st.love) { heartT -= dt; if (heartT <= 0) { heartT = .35; heart(); } }
    hearts = hearts.filter(h => { h.age += dt; h.s.position.y += dt * .7; h.s.position.x += h.vx * dt; h.s.material.opacity = Math.max(0, 1 - h.age / 1.6); if (h.age > 1.6) { dispose(h.s); return false; } return true; });
    R.rd.render(R.scene, R.cam);
  }
  window.addEventListener('resize', () => { if (host) resize(); });
  return {
    available: true,
    on: () => !!host,
    snap() { if (!R || !host || !main) return null; resize(); R.rd.render(R.scene, R.cam); return canvas.toDataURL('image/png'); }, // for tests / screenshots
    sync() {
      const root = document.getElementById('scene'), w = UIS.wid && W(UIS.wid);
      if (UIS.screen !== 'world' || !w || !root || G.stage3d === false || !window.M3D.build[w.art]) { if (host) unmount(); return false; }
      moodFn = () => moodOf(UIS.wid);
      const was = host; if (was && was !== root) { unmount(); }
      return mount(root);
    }
  };
})();
