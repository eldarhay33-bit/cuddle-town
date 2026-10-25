'use strict';
/* =====================================================================
   TRACE — draw along shapes without wasting ink (blueprints, paint, bows)
   ===================================================================== */
const SHAPES = {
  circle: () => [...Array(60)].map((_, i) => { const a = i / 59 * Math.PI * 2 - Math.PI / 2; return [180 + Math.cos(a) * 100, 230 + Math.sin(a) * 100]; }),
  heart: () => [...Array(70)].map((_, i) => { const a = i / 69 * Math.PI * 2; return [180 + 11 * 16 * Math.pow(Math.sin(a), 3) / 1.15 * .72, 215 - (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * 8]; }),
  star: () => { const p = []; for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI * 2 * 2 % (Math.PI * 2) - Math.PI / 2 + (i === 10 ? 0 : 0); const aa = (i * 144 - 90) * Math.PI / 180; p.push([180 + Math.cos(aa) * 110, 240 + Math.sin(aa) * 110]); } return densify(p); },
  wave: () => [...Array(60)].map((_, i) => [30 + i / 59 * 300, 230 + Math.sin(i / 59 * Math.PI * 4) * 70]),
  zigzag: () => densify([[40, 140], [110, 320], [180, 140], [250, 320], [320, 140]]),
  rainbow: () => [...Array(50)].map((_, i) => { const a = Math.PI + i / 49 * Math.PI; return [180 + Math.cos(a) * 130, 330 + Math.sin(a) * 130]; }),
  house: () => densify([[70, 330], [70, 220], [180, 120], [290, 220], [290, 330], [70, 330], [70, 220], [290, 220]]),
  spiral: () => [...Array(80)].map((_, i) => { const a = i / 79 * Math.PI * 5, r = 12 + i / 79 * 100; return [180 + Math.cos(a) * r, 235 + Math.sin(a) * r]; }),
  bow: () => densify([[60, 170], [180, 240], [60, 310], [60, 170], [60, 170]].concat([[180, 240], [300, 170], [300, 310], [180, 240]])),
  scissors: () => [...Array(50)].map((_, i) => { const x = 30 + i / 49 * 300; return [x, 240 + Math.sin(i * .6) * 14 + Math.cos(i / 49 * 6) * 60]; })
};
function densify(p) { const o = []; for (let i = 0; i < p.length - 1; i++) { const n = 18; for (let k = 0; k < n; k++) o.push([GK.lerp(p[i][0], p[i + 1][0], k / n), GK.lerp(p[i][1], p[i + 1][1], k / n)]); } o.push(p[p.length - 1]); return o; }

GAMES.trace = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, names = cfg.shapes || ['circle', 'wave', 'heart'], TOL = 23 - d * 6;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const tool = cfg.tool || '🖌️', col = cfg.color || '#ec4899', cols = cfg.colors || null;
  let si = 0, path = [], cov = [], strokes = [], ink = 1, down = false, left = 24, t = 0, over = false, scores = [], pend = false, last = null, started = false;
  function newShape() { if (si >= names.length) return end(); path = SHAPES[names[si]](); cov = path.map(() => false); strokes = []; ink = 1; left = 24; pend = false; started = false; }
  function done(early) { if (pend) return; pend = true; const covered = cov.filter(Boolean).length / path.length; const sc = clamp(covered * 100 * (.55 + ink * .45), 0, 100); scores.push(sc); sfx(sc > 70 ? 'win' : 'ok'); fx.text(Math.round(covered * 100) + '%', 180, 70, sc > 70 ? '#fde047' : '#fff', 30); if (sc > 75) fx.burst(180, 240, 24, { spd: 200, e: '✨', size: 4 }); si++; K.after(newShape, 1000); }
  function addPoint(p) {
    if (pend) return; let md = 1e9, mi = -1; path.forEach((q, i) => { const dd = Math.hypot(q[0] - p.x, q[1] - p.y); if (dd < md) { md = dd; mi = i; } });
    if (md < TOL) { for (let i = 0; i < path.length; i++) if (Math.hypot(path[i][0] - p.x, path[i][1] - p.y) < TOL) cov[i] = true; } else if (md > TOL + 8) { ink -= .0075; if (ink <= 0) { ink = 0; done(); } }
    strokes[strokes.length - 1].push([p.x, p.y, md < TOL]); if (cov.filter(Boolean).length / path.length > .96) done(true);
  }
  GK.input(K, c, { down(p) { if (pend) return; down = true; started = true; strokes.push([]); addPoint(p); last = p; }, move(p, e, dn) { if (dn && down && last) { const n = Math.max(1, Math.ceil(Math.hypot(p.x - last.x, p.y - last.y) / 8)); for (let i = 1; i <= n; i++) addPoint({ x: GK.lerp(last.x, p.x, i / n), y: GK.lerp(last.y, p.y, i / n) }); last = p; if (Math.random() < .08) sfx('pop'); } ptr = p; }, up() { down = false; last = null; } });
  let ptr = { x: 180, y: 400 };
  function end() { if (over) return; over = true; fin(clamp(scores.reduce((a, b) => a + b, 0) / names.length, 0, 100), ['✏️ ' + scores.length + '/' + names.length]); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); if (started && !pend) { left -= dt; if (left <= 0) done(); }
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, cfg.bg || ['#e0f2fe', '#bae6fd']); cx.strokeStyle = 'rgba(30,64,175,.1)'; cx.lineWidth = 1; for (let x = 0; x < W; x += 24) { cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x, H); cx.stroke(); } for (let y = 0; y < H; y += 24) { cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); }
    if (path.length) { cx.lineWidth = 18; cx.lineCap = 'round'; cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.beginPath(); path.forEach((q, i) => i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1])); cx.stroke(); cx.strokeStyle = 'rgba(99,102,241,.35)'; cx.lineWidth = 3; cx.setLineDash([9, 8]); cx.beginPath(); path.forEach((q, i) => i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1])); cx.stroke(); cx.setLineDash([]); cx.fillStyle = '#22c55e'; path.forEach((q, i) => { if (cov[i]) { cx.beginPath(); cx.arc(q[0], q[1], 5, 0, 7); cx.fill(); } }); GK.draw(cx, '🏁', path[0][0], path[0][1] - 14, 28); }
    strokes.forEach(s => { cx.lineWidth = 8; cx.lineJoin = 'round'; for (let i = 1; i < s.length; i++) { cx.strokeStyle = s[i][2] ? (cols ? cols[Math.floor(i / 6) % cols.length] : col) : '#9ca3af'; cx.beginPath(); cx.moveTo(s[i - 1][0], s[i - 1][1]); cx.lineTo(s[i][0], s[i][1]); cx.stroke(); } });
    GK.draw(cx, tool, ptr.x + 14, ptr.y - 14, 44, -.3, false, down ? 1 : .55); GK.bar(cx, 30, 420, 300, 14, ink, ink < .3 ? '#ef4444' : '#38bdf8'); GK.txt(cx, '💧', 20, 427, 18);
    fx.draw(cx); fx.end(cx);
    hud.set('✏️ ' + Math.min(si + 1, names.length) + '/' + names.length, '🎯 ' + Math.round(cov.filter(Boolean).length / Math.max(1, path.length) * 100) + '%', '⏱ ' + Math.max(0, Math.ceil(left)));
  });
  GK.count(c.wrap, K, newShape, '👆 ✏️');
  return () => K.stop();
};

/* =====================================================================
   SURGERY — sanitise germs, stitch the wound, place bandages in order
   ===================================================================== */
GAMES.surgery = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, patient = cfg.patient || '🧸';
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let ph = 0, t = 0, over = false, scores = [], germs = [], gN = 0, gHit = 0, gSp = .3, gT = 11, wound = null, ptr = { x: 180, y: 380, down: false }, bandages = [], bi = 0, bT = 9, bMiss = 0, pT = 0;
  const NG = 8 + Math.round(d * 3);
  function startPhase() {
    pT = 0; if (ph === 0) { germs = []; gN = 0; gHit = 0; gSp = .2; gT = 11; }
    if (ph === 1) { const pts = [...Array(40)].map((_, i) => [80 + i / 39 * 200, 270 + Math.sin(i / 39 * Math.PI * 2) * 18]); wound = { pts, cov: pts.map(() => false), started: false, T: 12 }; }
    if (ph === 2) { bandages = [[150, 200], [220, 250], [140, 300], [230, 190]].slice(0, 3 + Math.round(d)).map(p => ({ x: p[0], y: p[1], done: false })); bi = 0; bT = 9; bMiss = 0; }
    GK.flash(c.wrap, K, ['🧴', '🪡', '🩹'][ph], 700);
  }
  function phaseDone(sc) { scores.push(clamp(sc, 0, 100)); sfx(sc > 65 ? 'win' : 'ok'); fx.burst(180, 240, 22, { spd: 170, e: '⭐', size: 4 }); ph++; if (ph >= 3) { over = true; K.after(() => fin(scores.reduce((a, b) => a + b, 0) / 3, ['🩺 ' + scores.map(Math.round).join(' / ')]), 800); } else K.after(startPhase, 800); }
  GK.input(K, c, {
    down(p) { ptr = { x: p.x, y: p.y, down: true }; if (over) return;
      if (ph === 0) { let hit = false; germs.forEach(g => { if (!g.dead && Math.hypot(g.x - p.x, g.y - p.y) < 34) { g.dead = true; hit = true; gHit++; sfx('coin'); fx.burst(g.x, g.y, 10, { spd: 100, col: '#bae6fd', life: .4 }); fx.text('+1', g.x, g.y - 16, '#fff', 18); } }); if (!hit) sfx('tap'); }
      if (ph === 2) { const b = bandages[bi]; if (b && Math.hypot(b.x - p.x, b.y - p.y) < 36) { b.done = true; bi++; sfx('ok'); fx.burst(b.x, b.y, 10, { spd: 100, e: '💖', size: 3 }); if (bi >= bandages.length) phaseDone(clamp(100 - bMiss * 18 - pT * 3, 40, 100)); } else { bMiss++; sfx('bad'); } }
      if (ph === 1 && wound) wound.started = true; },
    move(p, e, down) { ptr.x = p.x; ptr.y = p.y; if (ph === 1 && down && wound) { wound.pts.forEach((q, i) => { if (Math.hypot(q[0] - p.x, q[1] - p.y) < 20) wound.cov[i] = true; }); if (Math.random() < .1) sfx('pop'); if (wound.cov.filter(Boolean).length / wound.pts.length > .95) { const sc = 100 - pT * 3; wound = null; phaseDone(clamp(sc, 55, 100)); } } },
    up() { ptr.down = false; }
  });
  K.loop(dt => {
    if (over) return; t += dt; pT += dt; fx.update(dt);
    if (ph === 0) { gT -= dt; gSp -= dt; if (gSp <= 0 && gN < NG) { gSp = clamp(.9 - d * .3, .4, 1); gN++; const a = rnd(0, 6.28), r = rnd(0, 80); germs.push({ x: 180 + Math.cos(a) * r, y: 250 + Math.sin(a) * r * .9, life: 1.8 - d * .5, dead: false }); } germs.forEach(g => { g.life -= dt; if (g.life <= 0) g.dead = true; }); if (gN >= NG && germs.every(g => g.dead || g.life <= 0) || gT <= 0) { if (!over) { const sc = gHit / NG * 100; ph === 0 && phaseDone(sc); ph = ph; } } }
    if (ph === 1 && wound) { if (wound.started) wound.T -= dt; if (wound.T <= 0) { const sc = wound.cov.filter(Boolean).length / wound.pts.length * 100; wound = null; phaseDone(sc * .9); } }
    if (ph === 2) { bT -= dt; if (bT <= 0) { phaseDone(bi / bandages.length * 70); bT = 99; } }
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, ['#ecfeff', '#cffafe']); cx.fillStyle = '#e2e8f0'; GK.rr(cx, 30, 120, 300, 260, 30); cx.fill(); cx.fillStyle = '#cbd5e1'; GK.rr(cx, 30, 360, 300, 30, 12); cx.fill();
    GK.shadow(cx, 180, 350, 100, .2); GK.draw(cx, patient, 180, 245, 190);
    GK.txt(cx, '➕', 40, 100, 28, '#ef4444'); GK.draw(cx, '🩺', 320, 100, 30);
    if (ph === 0) germs.forEach(g => { if (!g.dead) { GK.draw(cx, '🦠', g.x, g.y, 42, Math.sin(t * 6 + g.x) * .3, false, Math.min(1, g.life * 2)); } });
    if (ph === 1 && wound) { cx.strokeStyle = '#7f1d1d'; cx.lineWidth = 7; cx.lineCap = 'round'; cx.beginPath(); wound.pts.forEach((q, i) => i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1])); cx.stroke(); cx.strokeStyle = '#fecaca'; cx.lineWidth = 3; cx.setLineDash([8, 8]); cx.stroke(); cx.setLineDash([]); wound.pts.forEach((q, i) => { if (wound.cov[i]) { cx.strokeStyle = '#1e293b'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(q[0] - 6, q[1] - 7); cx.lineTo(q[0] + 6, q[1] + 7); cx.stroke(); } }); GK.draw(cx, '🪡', ptr.x + 10, ptr.y - 14, 40, .5); }
    if (ph === 2) bandages.forEach((b, i) => { if (b.done) GK.draw(cx, '🩹', b.x, b.y, 46, .4); else { cx.strokeStyle = i === bi ? '#fde047' : 'rgba(255,255,255,.7)'; cx.lineWidth = 4; cx.beginPath(); cx.arc(b.x, b.y, 28 + (i === bi ? Math.sin(t * 8) * 3 : 0), 0, 7); cx.stroke(); GK.txt(cx, String(i + 1), b.x, b.y, 24); } });
    fx.draw(cx); fx.end(cx);
    hud.set(['🧴', '🪡', '🩹'][Math.min(ph, 2)] + ' ' + (ph + 1) + '/3', ph === 0 ? '🦠 ' + gHit + '/' + NG : ph === 1 && wound ? '🪡 ' + Math.round(wound.cov.filter(Boolean).length / wound.pts.length * 100) + '%' : ph === 2 ? '🩹 ' + bi + '/' + bandages.length : '', '⏱ ' + Math.max(0, Math.ceil(ph === 0 ? gT : ph === 1 && wound ? wound.T : bT)));
  });
  GK.count(c.wrap, K, startPhase, '🩺');
  return () => K.stop();
};

/* =====================================================================
   PHOTO — match the photographer's pose and click the shutter on time
   ===================================================================== */
GAMES.photo = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, N = cfg.shots || 8, poses = cfg.poses || ['😎', '🤩', '😘', '🥰'];
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx(); let img = null;
  if (cfg.art) GK.artImg(cfg.art, { mood: 'happy' }, im => { img = im; });
  let shot = 0, want = 0, cur = 0, u = 0, slot = .85 - d * .2, t = 0, over = false, strip = [], flash = 0, tShot = 0, locked = false, scoreSum = 0, perfect = 0;
  function newShot() { shot++; if (shot > N) return end(); want = ri(0, poses.length - 1); cur = (want + ri(1, poses.length - 1)) % poses.length; u = 0; tShot = 0; locked = false; }
  function click() {
    if (over || locked || shot < 1) return; locked = true; flash = .25; sfx('pop'); const match = cur === want, timing = 1 - Math.abs(u - .5) * 2; const q = match ? clamp(.35 + timing * .65, 0, 1) : 0; const sc = q * 100; scoreSum += sc; if (q > .85) perfect++; strip.push({ pose: poses[cur], q });
    fx.text(match ? (q > .85 ? '📸 ' + ui('perfect') : '📸 ' + ui('good')) : '😕', 180, 130, match ? (q > .85 ? '#fde047' : '#fff') : '#f87171', 26); if (match && q > .85) fx.burst(180, 250, 24, { spd: 180, e: '⭐', size: 4 }); K.after(newShot, 1000);
  }
  GK.input(K, c, { down() { click(); } }); GK.keys(K, code => { if (code === 'Space') click(); });
  function end() { if (over) return; over = true; fin(clamp(scoreSum / N, 0, 100), ['📸 ' + perfect + '/' + N]); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); flash = Math.max(0, flash - dt);
    if (shot >= 1 && !locked) { tShot += dt; u += dt / slot; if (u >= 1) { u = 0; cur = Math.random() < .42 ? want : ri(0, poses.length - 1); } if (tShot > 6) { locked = true; strip.push({ pose: '❌', q: 0 }); K.after(newShot, 700); } }
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, cfg.bg || ['#fde68a', '#f59e0b']); cx.fillStyle = 'rgba(255,255,255,.18)'; cx.beginPath(); cx.moveTo(60, 0); cx.lineTo(300, 0); cx.lineTo(360, 420); cx.lineTo(0, 420); cx.fill(); cx.fillStyle = '#fef3c7'; cx.beginPath(); cx.ellipse(180, 395, 150, 30, 0, 0, 7); cx.fill();
    GK.rr(cx, 110, 12, 140, 58, 16); cx.fillStyle = 'rgba(255,255,255,.85)'; cx.fill(); GK.txt(cx, '🎬', 140, 41, 28); GK.draw(cx, poses[want], 205, 41, 38);
    const sy = 235; GK.shadow(cx, 180, 395, 70, .25); if (img) { const h = 270, w = h * img.width / img.height; cx.drawImage(img, 180 - w / 2, 110, w, h); } else GK.draw(cx, cfg.me || '🐧', 180, sy + 50, 190);
    GK.rr(cx, 120, 98, 120, 54, 27); cx.fillStyle = 'rgba(255,255,255,.9)'; cx.fill(); GK.draw(cx, poses[cur], 180, 125, 44, 0, false, 1, 1 + Math.sin(t * 8) * .03);
    const ring = 160 - Math.abs(u - .5) * 0; cx.strokeStyle = cur === want ? '#22c55e' : '#fff'; cx.lineWidth = 5; cx.beginPath(); cx.arc(180, 235, 96 + (1 - Math.abs(u - .5) * 2) * 0 + (Math.abs(u - .5)) * 70, 0, 7); cx.stroke(); cx.strokeStyle = 'rgba(255,255,255,.5)'; cx.lineWidth = 2; cx.beginPath(); cx.arc(180, 235, 96, 0, 7); cx.stroke();
    cx.fillStyle = '#ef4444'; cx.beginPath(); cx.arc(180, 440, 28, 0, 7); cx.fill(); GK.draw(cx, '📸', 180, 440, 32);
    strip.forEach((s, i) => { GK.draw(cx, s.pose, 20 + i * 42, 408, 24, 0, false, .5 + s.q * .5); });
    if (flash > 0) { cx.fillStyle = 'rgba(255,255,255,' + flash * 3 + ')'; cx.fillRect(0, 0, W, H); }
    fx.draw(cx); fx.end(cx);
    hud.set('📸 ' + Math.min(shot, N) + '/' + N, '⭐ ' + Math.round(scoreSum / Math.max(1, strip.length)) + '%', '🎯 ' + poses[want]);
  });
  GK.count(c.wrap, K, newShot, '📸');
  return () => K.stop();
};

/* =====================================================================
   HAGGLE — sell the apartment for the best price before the buyer walks
   ===================================================================== */
GAMES.haggle = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, N = cfg.deals || 4;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let n = 0, list = 0, R = 0, offer = 0, pat = 3, face = '🙂', scores = [], t = 0, over = false, done = false, buyer = '🙋', houseE = '🏠', lastHint = '';
  function newDeal() { n++; if (n > N) return end(); list = ri(30, 90) * 10; R = Math.round(list * rnd(.6, .98) / 10) * 10; offer = Math.round(list * 1.05 / 10) * 10; pat = 4 - Math.round(d); face = '🙂'; done = false; buyer = pick(['🙋', '🙋‍♂️', '👩‍💼', '👨‍💼', '🧓']); houseE = pick(['🏠', '🏢', '🏡', '🏘️']); lastHint = ''; }
  const step = () => Math.max(10, Math.round(list * .03 / 10) * 10);
  function adjust(dir) { if (done || over) return; offer = clamp(offer + dir * step(), 10, Math.round(list * 1.4)); sfx('tap'); }
  function propose() {
    if (done || over) return; if (offer <= R) { done = true; const sc = clamp(offer / R * 100, 0, 100) * (offer >= R * .92 ? 1 : .8); scores.push(sc); face = offer < R * .85 ? '😍' : '😄'; sfx(sc > 85 ? 'win' : 'ok'); fx.text('🤝 ' + offer, 180, 150, '#fde047', 30); fx.burst(180, 230, 22, { spd: 170, e: '💰', size: 4 }); K.after(newDeal, 1200); }
    else { pat--; const over2 = offer / R; face = over2 > 1.15 ? '😠' : over2 > 1.04 ? '😕' : '😐'; lastHint = over2 > 1.15 ? '🔥' : over2 > 1.04 ? '🌡️' : '❄️'; sfx('bad'); fx.shake(.3); if (pat <= 0) { done = true; scores.push(0); face = '😤'; fx.text('👋', 180, 150, '#f87171', 36); K.after(newDeal, 1200); } }
  }
  GK.input(K, c, { down(p) { if (p.y > 360) { if (p.x < 100) adjust(-1); else if (p.x > 260) adjust(1); else propose(); } else if (p.y > 300) { adjust(p.x < 180 ? -1 : 1); } } });
  GK.keys(K, code => { if (code === 'ArrowLeft' || code === 'ArrowDown') adjust(-1); if (code === 'ArrowRight' || code === 'ArrowUp') adjust(1); if (code === 'Space' || code === 'Enter') propose(); });
  function end() { if (over) return; over = true; fin(clamp(scores.reduce((a, b) => a + b, 0) / N, 0, 100), ['🤝 ' + scores.filter(s => s > 0).length + '/' + N]); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt);
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, ['#dbeafe', '#bfdbfe']); cx.fillStyle = '#86efac'; cx.fillRect(0, 300, W, 160);
    GK.draw(cx, houseE, 180, 170, 150); GK.rr(cx, 90, 20, 180, 44, 14); cx.fillStyle = '#fff'; cx.fill(); GK.txt(cx, '🏷️ ' + list + 'K', 180, 42, 24, '#1e3a8a');
    GK.draw(cx, buyer, 60, 290, 80); GK.draw(cx, face, 60, 242, 38); GK.rr(cx, 232, 262, 100, 36, 14); cx.fillStyle = '#fff'; cx.fill(); GK.txt(cx, '❤️'.repeat(Math.max(0, pat)), 282, 280, 18);
    if (lastHint) GK.txt(cx, lastHint, 120, 230, 36);
    cx.fillStyle = '#fff'; GK.rr(cx, 40, 320, 280, 36, 18); cx.fill(); GK.bar(cx, 52, 332, 256, 12, offer / (list * 1.4), '#7c3aed', 'rgba(0,0,0,.15)'); GK.txt(cx, '💰 ' + offer + 'K', 180, 340, 18, '#1e3a8a');
    [['➖', 60], ['🤝', 180], ['➕', 300]].forEach(b => { cx.fillStyle = b[0] === '🤝' ? '#22c55e' : '#7c3aed'; GK.rr(cx, b[1] - (b[0] === '🤝' ? 70 : 44), 372, b[0] === '🤝' ? 140 : 88, 64, 22); cx.fill(); GK.txt(cx, b[0], b[1], 404, 34); });
    fx.draw(cx); fx.end(cx);
    hud.set('🏠 ' + Math.min(n, N) + '/' + N, '⭐ ' + Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length)), '❤️ ' + pat);
  });
  GK.count(c.wrap, K, newDeal, '➖ 🤝 ➕');
  return () => K.stop();
};

/* =====================================================================
   MOSAIC — memorise the pattern (stand display), then rebuild it
   ===================================================================== */
GAMES.mosaic = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 440, G = 5, CS = 58, OX = 35, OY = 70, ROUNDS = 3;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const c1 = cfg.c1 || '#16a34a', c2 = cfg.c2 || '#f8fafc';
  let r = 0, pat = [], mine = [], state = 'show', t = 0, over = false, scores = [], tt = 0, tl = 0;
  function newRound() { r++; if (r > ROUNDS) return end(); const k = 6 + r * 2 + Math.round(d * 2); pat = Array(G * G).fill(false); shuf([...Array(G * G).keys()]).slice(0, k).forEach(i => pat[i] = true); mine = Array(G * G).fill(false); state = 'show'; tt = 3.2 - d * .6; }
  GK.input(K, c, { down(p) { if (state !== 'play') return; const q = Math.floor((p.x - OX) / CS), w = Math.floor((p.y - OY) / CS); if (q < 0 || w < 0 || q >= G || w >= G) { if (p.y > 380) submit(); return; } mine[w * G + q] = !mine[w * G + q]; sfx('tap'); } });
  GK.keys(K, code => { if (code === 'Enter') submit(); });
  function submit() { if (state !== 'play') return; state = 'res'; let right = 0, wrong = 0, tot = pat.filter(Boolean).length; for (let i = 0; i < G * G; i++) { if (pat[i] && mine[i]) right++; else if (!pat[i] && mine[i]) wrong++; } const sc = clamp((right - wrong * .6) / tot * 100, 0, 100); scores.push(sc); sfx(sc > 80 ? 'win' : 'ok'); fx.text(Math.round(sc) + '%', 180, 40, sc > 80 ? '#fde047' : '#fff', 30); tt = 1.6; }
  function end() { if (over) return; over = true; fin(clamp(scores.reduce((a, b) => a + b, 0) / ROUNDS, 0, 100), ['🟩 ' + scores.map(s => Math.round(s) + '%').join(' / ')]); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); tt -= dt;
    if (state === 'show' && tt <= 0) { state = 'play'; tl = 14; } if (state === 'play') { tl -= dt; if (tl <= 0) submit(); } if (state === 'res' && tt <= 0) newRound();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, ['#1e293b', '#0f172a']); cx.fillStyle = '#334155'; GK.rr(cx, 20, 56, 320, 320, 20); cx.fill();
    for (let i = 0; i < G * G; i++) { const x = OX + (i % G) * CS, y = OY + Math.floor(i / G) * CS, on = state === 'show' ? pat[i] : state === 'res' ? pat[i] : mine[i]; cx.fillStyle = on ? c1 : '#475569'; GK.rr(cx, x + 3, y + 3, CS - 6, CS - 6, 10); cx.fill(); if (on) { cx.fillStyle = 'rgba(255,255,255,.25)'; GK.rr(cx, x + 3, y + 3, CS - 6, 14, 8); cx.fill(); } if (state === 'res') { if (pat[i] && mine[i]) GK.txt(cx, '✓', x + CS / 2, y + CS / 2, 22, '#fff'); else if (!pat[i] && mine[i]) { cx.fillStyle = 'rgba(239,68,68,.8)'; GK.rr(cx, x + 3, y + 3, CS - 6, CS - 6, 10); cx.fill(); GK.txt(cx, '✗', x + CS / 2, y + CS / 2, 22, '#fff'); } else if (pat[i] && !mine[i]) { cx.strokeStyle = '#fde047'; cx.lineWidth = 3; GK.rr(cx, x + 4, y + 4, CS - 8, CS - 8, 10); cx.stroke(); } } }
    GK.txt(cx, state === 'show' ? '👀 ' + Math.ceil(tt) : state === 'play' ? '👆 ' + Math.ceil(tl) : '', 180, 30, 26);
    if (state === 'play') { cx.fillStyle = '#22c55e'; GK.rr(cx, 120, 392, 120, 40, 20); cx.fill(); GK.txt(cx, '✓ OK', 180, 412, 20); }
    fx.draw(cx); fx.end(cx);
    hud.set('🟩 ' + Math.min(r, ROUNDS) + '/' + ROUNDS, '⭐ ' + Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length)) + '%', '');
  });
  GK.count(c.wrap, K, newRound, '👀');
  return () => K.stop();
};

/* =====================================================================
   COTTON — add sugar, then spin circles to wind a big fluffy cloud
   ===================================================================== */
GAMES.cotton = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, N = cfg.n || 3, col = cfg.color || '#f9a8d4';
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let n = 0, ph = 'sugar', t = 0, over = false, ang = 0, size = 0, last = null, scores = [], tp = 0, needA = 0, sugarQ = 0, sugarN = 0, cd = 0, pointer = { x: 180, y: 300 }, idle = 0;
  function newCandy() { n++; if (n > N) return end(); ph = 'sugar'; sugarN = 0; sugarQ = 0; size = 0; ang = 0; needA = (5 + d * 3) * Math.PI * 2; tp = 0; cd = 0; }
  function scoop() { if (ph !== 'sugar') return; const q = 1 - Math.abs(((t * 1.6) % 2) - 1 - 0) ; const u = Math.abs(Math.sin(t * 2.4)); const good = u > .8; sugarN++; sugarQ += good ? 1 : .35; sfx(good ? 'ok' : 'tap'); fx.burst(180, 250, 8, { spd: 70, life: .5, size: 3, col: '#fff' }); fx.text(good ? '✨' : '·', 180, 220, '#fff', 22); if (sugarN >= 3) { ph = 'spin'; tp = 0; GK.flash(c.wrap, K, '🔄', 600); } }
  GK.input(K, c, { down(p) { if (ph === 'sugar') scoop(); else if (ph === 'spin') last = Math.atan2(p.y - 290, p.x - 180); pointer = p; }, move(p, e, down) { pointer = p; if (ph !== 'spin' || !down || last == null) return; const a = Math.atan2(p.y - 290, p.x - 180), r = Math.hypot(p.x - 180, p.y - 290); let da = a - last; if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2; last = a; if (r > 40 && r < 140 && da > 0) { ang += da * (.7 + sugarQ / 6); idle = 0; if (Math.random() < .1) sfx('pop'); } else if (r > 40 && da < 0) ang = Math.max(0, ang - Math.abs(da) * .3); size = clamp(ang / needA, 0, 1); if (size >= 1) { done(); } }, up() { last = null; } });
  GK.keys(K, code => { if (code === 'Space') scoop(); });
  function done() { if (ph !== 'spin') return; ph = 'done'; const sc = clamp(70 + sugarQ * 5 - tp * 1.2 + 10, 40, 100); scores.push(sc); sfx('win'); fx.burst(180, 200, 30, { spd: 200, e: '🍭', size: 4 }); K.after(newCandy, 1200); }
  function end() { if (over) return; over = true; fin(clamp(scores.reduce((a, b) => a + b, 0) / N, 0, 100), ['🍭 ' + scores.length + '/' + N]); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); if (ph === 'spin') { tp += dt; idle += dt; if (idle > .5 && ang > 0) ang = Math.max(0, ang - dt * 1.4); size = clamp(ang / needA, 0, 1); if (tp > 28) { ph = 'done'; scores.push(size * 70); K.after(newCandy, 900); } }
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, ['#fce7f3', '#fbcfe8']); for (let i = 0; i < 8; i++) { cx.fillStyle = i % 2 ? '#f9a8d4' : '#fff'; cx.fillRect(i * 45, 0, 22, 60); } cx.fillStyle = '#ec4899'; cx.fillRect(0, 56, W, 8);
    cx.fillStyle = '#d1d5db'; cx.beginPath(); cx.ellipse(180, 300, 150, 50, 0, 0, 7); cx.fill(); cx.fillStyle = '#9ca3af'; cx.beginPath(); cx.ellipse(180, 300, 150, 50, 0, 0, Math.PI); cx.fill(); cx.fillStyle = '#e5e7eb'; cx.beginPath(); cx.ellipse(180, 292, 120, 38, 0, 0, 7); cx.fill();
    for (let i = 0; i < 20; i++) { const a = t * 6 + i * .4; cx.strokeStyle = 'rgba(244,114,182,' + (.3 + (ph === 'spin' ? .4 : 0)) + ')'; cx.lineWidth = 2; cx.beginPath(); cx.arc(180, 292, 30 + (i % 5) * 18, a, a + .7); cx.stroke(); }
    if (ph === 'spin' || ph === 'done') { const r = 22 + size * 78; for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2 + t * .8; cx.fillStyle = col; cx.globalAlpha = .75; cx.beginPath(); cx.arc(180 + Math.cos(a) * r * .55, 250 + Math.sin(a) * r * .5, r * .55, 0, 7); cx.fill(); } cx.globalAlpha = 1; cx.fillStyle = '#fbcfe8'; cx.beginPath(); cx.arc(180, 250, r * .8, 0, 7); cx.fill(); cx.fillStyle = '#92400e'; cx.fillRect(176, 250, 8, 120 + 40); }
    if (ph === 'spin') { cx.strokeStyle = 'rgba(236,72,153,.4)'; cx.lineWidth = 3; cx.setLineDash([8, 8]); cx.beginPath(); cx.arc(180, 290, 90, 0, 7); cx.stroke(); cx.setLineDash([]); GK.bar(cx, 40, 410, 280, 16, size, '#ec4899'); GK.txt(cx, '🔄 ' + Math.round(size * 100) + '%', 180, 392, 20); }
    if (ph === 'sugar') { const u = Math.abs(Math.sin(t * 2.4)); GK.draw(cx, '🥄', 80 + u * 200, 200, 52, -.6); GK.bar(cx, 40, 390, 280, 16, u, u > .8 ? '#22c55e' : '#fbbf24'); GK.txt(cx, '🍬 ' + sugarN + '/3', 180, 420, 22); }
    fx.draw(cx); fx.end(cx);
    hud.set('🍭 ' + Math.min(n, N) + '/' + N, ph === 'sugar' ? '👆 🍬' : '🔄', '⏱ ' + Math.max(0, Math.ceil(28 - tp)));
  });
  GK.count(c.wrap, K, newCandy, '👆 🍬 → 🔄');
  return () => K.stop();
};
