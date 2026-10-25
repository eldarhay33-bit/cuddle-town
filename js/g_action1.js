'use strict';
/* =====================================================================
   Themes shared by action games
   ===================================================================== */
const THEMES = {
  sky: { sky: ['#7dd3fc', '#e0f2fe'], ground: '#84cc16', road: '#d6b98c', side: '🌳' },
  night: { sky: ['#1e1b4b', '#6d28d9'], ground: '#312e81', road: '#4c1d95', side: '🕯️' },
  kitchen: { sky: ['#fde68a', '#fed7aa'], ground: '#d97706', road: '#fef3c7', side: '🥖' },
  candy: { sky: ['#fbcfe8', '#a5f3fc'], ground: '#f9a8d4', road: '#fff1f2', side: '🍭' },
  farm: { sky: ['#bae6fd', '#dcfce7'], ground: '#65a30d', road: '#d6b98c', side: '🌾' },
  stadium: { sky: ['#60a5fa', '#bfdbfe'], ground: '#16a34a', road: '#4ade80', side: '🚩' },
  park: { sky: ['#a5d8ff', '#e0f7ff'], ground: '#4ade80', road: '#e7d3a8', side: '🌳' },
  army: { sky: ['#cbd5e1', '#e2e8f0'], ground: '#65723e', road: '#a8946b', side: '🌲' },
  castle: { sky: ['#312e81', '#7c3aed'], ground: '#4338ca', road: '#6d28d9', side: '🏰' },
  court: { sky: ['#fed7aa', '#fef3c7'], ground: '#c2410c', road: '#fdba74', side: '🏀' },
  ice: { sky: ['#bae6fd', '#f0f9ff'], ground: '#e0f2fe', road: '#fff', side: '❄️' },
  build: { sky: ['#bfdbfe', '#e0f2fe'], ground: '#a8a29e', road: '#d6d3d1', side: '🏗️' },
  gym: { sky: ['#e0e7ff', '#c7d2fe'], ground: '#4338ca', road: '#818cf8', side: '🏋️' }
};
const TH = n => THEMES[n] || THEMES.sky;

/* =====================================================================
   CATCH — falling items, golden items, power-ups, combo, lives
   ===================================================================== */
GAMES.catch = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, TT = cfg.time || 30, th = TH(cfg.theme);
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const good = cfg.good || ['🍎'], bad = cfg.bad || ['💣'], me = cfg.me || '🧺', list = cfg.list || null;
  let bx = W / 2, tx = bx, left = TT, items = [], sp = .5, lives = 3, pts = 0, combo = 0, spG = 0, got = 0, gold = 0, t = 0, over = false, magnet = 0, shield = 0, slow = 0, squash = 0, hitFlash = 0, fragile = !!cfg.fragile, listIdx = 0;
  const keys = GK.keys(K);
  GK.input(K, c, { down(p) { tx = p.x; }, move(p, e, down) { tx = p.x; } });
  function spawn() {
    const r = Math.random(); let it = { x: rnd(28, W - 28), y: -30, v: rnd(110, 160) + d * 120 + (TT - left) * 3, rot: rnd(-.3, .3), spin: rnd(-1, 1) };
    if (r < .06) { it.k = 'gold'; it.e = '🌟'; } else if (r < .1) { const p = pick(['🧲', '🛡️', '⏳']); it.k = 'pw'; it.e = p; } else if (r < .24 + d * .14) { it.k = 'bad'; it.e = pick(bad); }
    else { it.k = 'good'; it.e = list ? (Math.random() < .55 ? list[0] : pick(list)) : pick(good); spG++; }
    items.push(it);
  }
  function hurt() { if (shield > 0) { shield = 0; fx.text('🛡️', bx, 380, '#fff', 26); sfx('tap'); return; } lives--; combo = 0; hitFlash = .35; sfx('bad'); fx.shake(.4); if (lives <= 0) end(); }
  function end() { if (over) return; over = true; const pct = (got / Math.max(1, spG)) * 92 + gold * 2 - (3 - lives) * 4; K.after(() => fin(clamp(pct, 0, 100), ['✅ ' + got + '/' + spG, '⭐ ' + pts]), 500); }
  K.loop(dt => {
    if (over) return; t += dt; const dts = slow > 0 ? dt * .55 : dt; left -= dt; sp -= dt; fx.update(dt); hitFlash = Math.max(0, hitFlash - dt); squash = Math.max(0, squash - dt * 4); magnet = Math.max(0, magnet - dt); slow = Math.max(0, slow - dt);
    if (keys.ArrowLeft || keys.KeyA) tx -= 330 * dt; if (keys.ArrowRight || keys.KeyD) tx += 330 * dt; tx = clamp(tx, 36, W - 36); bx += (tx - bx) * Math.min(1, dt * 15);
    if (sp <= 0 && left > 1.2) { sp = clamp(.62 - d * .22 - (TT - left) * .004, .26, .7) + rnd(0, .18); spawn(); }
    items.forEach(it => {
      if (magnet > 0 && it.k === 'good') it.x += clamp(bx - it.x, -140 * dt, 140 * dt); it.y += it.v * dts; it.rot += it.spin * dt;
      if (it.y > 392 && it.y < 436 && Math.abs(it.x - bx) < 46 && !it.done) {
        it.done = true;
        if (it.k === 'good') { got++; combo++; const m = 1 + Math.min(4, Math.floor(combo / 4)); pts += 10 * m; squash = 1; sfx('coin'); fx.text('+' + 10 * m, it.x, 380, m > 1 ? '#fde047' : '#fff', 20 + m * 2); fx.burst(it.x, 400, 6, { spd: 90, life: .4, size: 3 }); }
        else if (it.k === 'gold') { gold++; pts += 50; squash = 1; sfx('win'); fx.text('+50', it.x, 380, '#fde047', 28); fx.burst(it.x, 400, 20, { spd: 190, e: '⭐', size: 4 }); }
        else if (it.k === 'pw') { sfx('ok'); if (it.e === '🧲') magnet = 7; else if (it.e === '🛡️') shield = 1; else slow = 6; fx.text(it.e, it.x, 380, '#fff', 30); }
        else { hurt(); fx.burst(it.x, 400, 14, { spd: 150, col: '#f87171' }); }
      } else if (it.y > 470 && !it.done) { it.done = true; if (it.k === 'good' && fragile) { hurt(); fx.text('💥', it.x, 440, '#fff', 28); } else if (it.k === 'good') combo = 0; }
    });
    items = items.filter(it => it.y < 500 && !(it.done && it.y < 440));
    if (left <= 0) end();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, th.sky); GK.cloud(cx, 70 + (t * 6) % 300, 70, 1.3); GK.cloud(cx, 280 - (t * 4) % 320, 140, 1);
    cx.fillStyle = th.ground; cx.fillRect(0, 440, W, 40); cx.fillStyle = 'rgba(0,0,0,.08)'; cx.fillRect(0, 440, W, 5);
    items.forEach(it => { if (it.done) return; GK.shadow(cx, it.x, 446, 10, .15); const s = it.k === 'gold' ? 40 : 36; if (it.k === 'gold') { cx.fillStyle = 'rgba(253,224,71,.35)'; cx.beginPath(); cx.arc(it.x, it.y, 28 + Math.sin(t * 9) * 3, 0, 7); cx.fill(); } GK.draw(cx, it.e, it.x, it.y, s, it.rot); });
    GK.shadow(cx, bx, 446, 36, .25); if (magnet > 0) { cx.strokeStyle = 'rgba(239,68,68,.45)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(bx, 410, 60 + Math.sin(t * 10) * 4, 0, 7); cx.stroke(); } if (shield > 0) { cx.strokeStyle = 'rgba(96,165,250,.8)'; cx.lineWidth = 4; cx.beginPath(); cx.arc(bx, 412, 44, 0, 7); cx.stroke(); }
    GK.draw(cx, me, bx, 414, 64, hitFlash > 0 ? Math.sin(t * 60) * .15 : 0, false, 1, 1 + squash * .12, 1 - squash * .1);
    if (list) { GK.rr(cx, 120, 8, 120, 30, 12); cx.fillStyle = 'rgba(255,255,255,.7)'; cx.fill(); GK.txt(cx, '🛒 ' + list.join(' '), 180, 24, 18, '#1e3a8a'); }
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), '⭐ ' + pts + (combo > 3 ? ' 🔥' + combo : ''), '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '↔');
  return () => K.stop();
};

/* =====================================================================
   RUNNER — pseudo-3D lanes, jump / slide / switch lanes, coins, hearts
   ===================================================================== */
GAMES.runner = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, TT = cfg.time || 32, th = TH(cfg.theme), HZ = 150;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const kinds = cfg.obs || ['low', 'high', 'wall'], skin = Object.assign({ low: '🪨', high: '🌿', wall: '🧱', coin: '🪙', bonus: '⭐' }, cfg.skin || {}), me = cfg.me || '🏃';
  let lane = 1, px = 1, y = 0, vy = 0, slide = 0, lives = 3, t = 0, left = TT, objs = [], sp = .5, coins = 0, spC = 0, over = false, hurt = 0, speed = 1, dist = 0, magnet = 0, shield = 0;
  const lanex = (l, z) => 180 + (l - 1) * (20 + 74 * z) * 1.5;
  const sy = z => HZ + (H - HZ - 30) * Math.pow(z, 1.7), sc = z => .22 + .95 * z;
  const jump = () => { if (y <= 0 && slide <= 0) { vy = 560; sfx('tap'); } }, slideDn = () => { if (y <= 0) { slide = .6; sfx('tap'); } };
  const go = dx => { lane = clamp(lane + dx, 0, 2); sfx('tap'); };
  GK.keys(K, code => { if (code === 'ArrowLeft' || code === 'KeyA') go(-1); if (code === 'ArrowRight' || code === 'KeyD') go(1); if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') jump(); if (code === 'ArrowDown' || code === 'KeyS') slideDn(); });
  let sx0 = 0, sy0 = 0, st0 = 0;
  GK.input(K, c, { down(p) { sx0 = p.x; sy0 = p.y; st0 = performance.now(); }, up(p) { const dx = p.x - sx0, dy = p.y - sy0; if (Math.abs(dx) < 18 && Math.abs(dy) < 18) { if (p.y < 330) jump(); else go(p.x > 180 ? 1 : -1); } else if (Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? 1 : -1); else if (dy < 0) jump(); else slideDn(); } });
  function spawnRow() {
    const k = pick(kinds), lanes = [0, 1, 2], block = ri(0, 2);
    if (Math.random() < .55) { const l = ri(0, 2); objs.push({ z: 0, l, k, w: 1 }); if (k === 'wall' && Math.random() < .5) { const l2 = (l + ri(1, 2)) % 3; objs.push({ z: 0, l: l2, k: 'wall', w: 1 }); } }
    else { const l = ri(0, 2); for (let i = 0; i < 5; i++) objs.push({ z: -i * .07, l, k: 'coin', w: 1 }); spC += 5; }
    if (Math.random() < .08) objs.push({ z: -.2, l: ri(0, 2), k: pick(['mag', 'shd']), w: 1 });
    if (Math.random() < .06) { objs.push({ z: -.1, l: ri(0, 2), k: 'bonus', w: 1 }); spC += 3; }
  }
  function end(finished) { if (over) return; over = true; const cp = coins / Math.max(1, spC); const sc = finished ? 40 + cp * 35 + (lives / 3) * 25 : cp * 35 * (1 - left / TT); K.after(() => fin(clamp(sc, 0, 100), ['🪙 ' + coins + '/' + spC, '❤️ ' + lives]), 500); }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; fx.update(dt); hurt = Math.max(0, hurt - dt); magnet = Math.max(0, magnet - dt); speed = 1 + (TT - left) * .012 + d * .5; dist += speed * dt * 14; px += (lane - px) * Math.min(1, dt * 14);
    if (y > 0 || vy > 0) { vy -= 1700 * dt; y += vy * dt; if (y <= 0) { y = 0; vy = 0; } } slide = Math.max(0, slide - dt);
    sp -= dt; if (sp <= 0 && left > 3) { sp = clamp(1.05 - d * .35 - (TT - left) * .008, .4, 1.1); spawnRow(); }
    objs.forEach(o => {
      o.z += dt * .42 * speed; if (o.z < .86 || o.z > .98 || !o.w) return;
      const near = Math.abs(o.l - px) < .55;
      if (!near) return;
      if (o.k === 'coin') { o.w = 0; coins++; sfx('coin'); fx.burst(lanex(o.l, .9), 400, 4, { spd: 80, life: .35, size: 3, col: '#fde047' }); }
      else if (o.k === 'bonus') { o.w = 0; coins += 3; sfx('win'); fx.text('+3', lanex(o.l, .9), 360, '#fde047', 26); }
      else if (o.k === 'mag') { o.w = 0; magnet = 7; sfx('ok'); }
      else if (o.k === 'shd') { o.w = 0; shield = 1; sfx('ok'); }
      else if ((o.k === 'low' && y < 55) || (o.k === 'high' && slide <= 0) || o.k === 'wall') { o.w = 0; if (shield > 0) { shield = 0; fx.text('🛡️', lanex(o.l, .9), 360, '#fff', 28); } else { lives--; hurt = .6; sfx('bad'); fx.shake(.5); if (lives <= 0) end(false); } }
    });
    if (magnet > 0) objs.forEach(o => { if (o.k === 'coin' && o.w && o.z > .55) o.l += clamp(px - o.l, -2 * dt, 2 * dt); });
    objs = objs.filter(o => o.z < 1.12 && (o.w || o.z < .9));
    if (left <= 0) end(true);
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, [th.sky[0], th.sky[1]], 0, 0, 0, HZ + 20);
    cx.fillStyle = th.ground; cx.fillRect(0, HZ, W, H - HZ); GK.cloud(cx, 70 + (t * 5) % 340, 60, 1.2); GK.cloud(cx, 300 - (t * 3) % 340, 100, .9);
    for (let i = 0; i < 6; i++) { cx.fillStyle = i % 2 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'; const z0 = ((i + (dist * .06 % 2)) / 6) % 1, z1 = z0 + .17; cx.fillRect(0, sy(z0), W, sy(Math.min(1, z1)) - sy(z0)); }
    cx.fillStyle = th.road; cx.beginPath(); cx.moveTo(lanex(1, 0) - 36, HZ); cx.lineTo(lanex(1, 0) + 36, HZ); cx.lineTo(lanex(1, 1) + 190, H); cx.lineTo(lanex(1, 1) - 190, H); cx.fill();
    cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.lineWidth = 3; [.5, 1.5].forEach(l => { cx.beginPath(); cx.setLineDash([22, 18]); cx.lineDashOffset = -dist * 4; cx.moveTo(180 + (l - 1) * 25 * .5, HZ); cx.lineTo(180 + (l - 1) * 190 * 1.0 / 1.0 * .98, H); cx.stroke(); }); cx.setLineDash([]);
    for (let i = 0; i < 6; i++) { const z = ((i / 6) + (dist * .004)) % 1; [-1, 1].forEach(sd => GK.draw(cx, th.side, 180 + sd * (60 + 240 * z * 1.1), sy(z) - 10 * sc(z), 70 * sc(z))); }
    const sorted = objs.slice().sort((a, b) => a.z - b.z);
    sorted.forEach(o => {
      if (o.z < 0 || !o.w) return; const z = o.z, s = sc(z), x = lanex(o.l, z), yy = sy(z); GK.shadow(cx, x, yy + 4 * s, 26 * s, .2);
      if (o.k === 'coin') GK.draw(cx, skin.coin, x, yy - 18 * s, 34 * s, 0, false, 1, Math.abs(Math.cos(t * 6 + o.z * 9)) * .6 + .4, 1);
      else if (o.k === 'bonus') GK.draw(cx, skin.bonus, x, yy - 20 * s, 44 * s);
      else if (o.k === 'mag') GK.draw(cx, '🧲', x, yy - 20 * s, 40 * s); else if (o.k === 'shd') GK.draw(cx, '🛡️', x, yy - 20 * s, 40 * s);
      else if (o.k === 'low') GK.draw(cx, skin.low, x, yy - 18 * s, 56 * s); else if (o.k === 'high') { GK.draw(cx, skin.high, x, yy - 64 * s, 62 * s); cx.fillStyle = 'rgba(0,0,0,.2)'; cx.fillRect(x - 28 * s, yy - 4 * s, 56 * s, 3); } else GK.draw(cx, skin.wall, x, yy - 30 * s, 84 * s);
    });
    const pxx = lanex(px, .92), py = sy(.92); GK.shadow(cx, pxx, py + 4, 30 * (1 - Math.min(.5, y / 300)), .3); if (shield > 0) { cx.strokeStyle = 'rgba(96,165,250,.8)'; cx.lineWidth = 4; cx.beginPath(); cx.arc(pxx, py - 40 - y * .6, 46, 0, 7); cx.stroke(); }
    GK.draw(cx, me, pxx, py - 40 - y * .6 + (slide > 0 ? 26 : 0), 78, slide > 0 ? .9 : Math.sin(t * 16) * .07, false, hurt > 0 ? .55 + Math.sin(t * 60) * .3 : 1, 1, slide > 0 ? .55 : 1);
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), '🪙 ' + coins, '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '⬆️ ⬇️ ⬅️ ➡️');
  return () => K.stop();
};

/* =====================================================================
   FLAPPY — tap to fly through gaps and collect stars
   ===================================================================== */
GAMES.flappy = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, GOAL = cfg.gaps || 14, th = TH(cfg.theme);
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const me = cfg.me || '🐥', star = cfg.star || '⭐', pil = cfg.pillar || 'cloud';
  let by = 230, vy = 0, lives = 3, pillars = [], px = 380, passed = 0, stars = 0, t = 0, over = false, inv = 0, started = false, spawnX = 420;
  const flap = () => { if (over) return; started = true; vy = -330; sfx('tap'); fx.burst(88, by + 14, 3, { spd: 40, life: .4, size: 3, col: '#fff', g: 40 }); };
  GK.input(K, c, { down() { flap(); } }); GK.keys(K, code => { if (code === 'Space' || code === 'ArrowUp') flap(); });
  function addPillar() { const gap = 142 - d * 28, gy = rnd(110, H - 110 - gap); pillars.push({ x: spawnX, gy, gap, got: false, star: Math.random() < .6, scored: false }); spawnX += 210 - d * 20; }
  for (let i = 0; i < 4; i++) addPillar();
  function drawPil(x, y0, y1, top) {
    if (pil === 'tower') { const g = cx.createLinearGradient(x, 0, x + 60, 0); g.addColorStop(0, '#6b7280'); g.addColorStop(1, '#9ca3af'); cx.fillStyle = g; cx.fillRect(x, y0, 60, y1 - y0); cx.fillStyle = '#374151'; for (let yy = y0 + 10; yy < y1; yy += 26) cx.fillRect(x + 6, yy, 14, 4); cx.fillStyle = '#7c3aed'; cx.fillRect(x - 6, top ? y1 - 18 : y0, 72, 18); }
    else if (pil === 'tree') { cx.fillStyle = '#92400e'; cx.fillRect(x + 12, y0, 36, y1 - y0); cx.fillStyle = '#16a34a'; cx.beginPath(); cx.arc(x + 30, top ? y1 : y0, 40, 0, 7); cx.fill(); }
    else { cx.fillStyle = 'rgba(255,255,255,.95)'; GK.rr(cx, x, y0, 60, y1 - y0, 26); cx.fill(); cx.fillStyle = 'rgba(147,197,253,.5)'; GK.rr(cx, x + 40, y0, 16, y1 - y0, 8); cx.fill(); }
  }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); inv = Math.max(0, inv - dt);
    if (started) { vy += 900 * dt; by += vy * dt; pillars.forEach(p => p.x -= (118 + d * 40 + passed * 2) * dt); spawnX -= (118 + d * 40 + passed * 2) * dt; }
    if (pillars[0] && pillars[0].x < -80) { pillars.shift(); addPillar(); }
    const bx = 90;
    pillars.forEach(p => {
      if (!p.scored && p.x + 60 < bx) { p.scored = true; passed++; sfx('ok'); fx.text('+1', bx + 30, by - 30, '#fff', 22); }
      if (p.star && !p.got && Math.abs(p.x + 30 - bx) < 28 && Math.abs(p.gy + p.gap / 2 - by) < 30) { p.got = true; stars++; sfx('coin'); fx.burst(bx, by, 14, { spd: 130, e: star, size: 3 }); }
      if (inv <= 0 && bx + 18 > p.x && bx - 18 < p.x + 60 && (by - 18 < p.gy || by + 18 > p.gy + p.gap)) hit();
    });
    if (by > H - 24) { by = H - 24; hit(true); } if (by < 20) { by = 20; vy = 40; }
    if (passed >= GOAL && !over) { over = true; sfx('win'); K.after(() => fin(clamp(78 + stars * 3 + lives * 3, 78, 100), ['🚀 ' + passed, '⭐ ' + stars]), 600); }
    function hit(floor) { if (inv > 0) return; lives--; inv = 1.1; vy = -260; sfx('bad'); fx.shake(.5); fx.burst(bx, by, 10, { spd: 120, col: '#f87171' }); if (lives <= 0) { over = true; K.after(() => fin(clamp(passed / GOAL * 72 + stars, 0, 78), ['🚀 ' + passed, '⭐ ' + stars]), 600); } }
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, th.sky); for (let i = 0; i < 4; i++) GK.cloud(cx, ((i * 120 - t * 14) % 480 + 480) % 480 - 60, 60 + i * 80, 1.2); cx.fillStyle = th.ground; cx.fillRect(0, H - 14, W, 14);
    pillars.forEach(p => { drawPil(p.x, -10, p.gy, true); drawPil(p.x, p.gy + p.gap, H, false); if (p.star && !p.got) GK.draw(cx, star, p.x + 30, p.gy + p.gap / 2, 30 + Math.sin(t * 6) * 3); });
    GK.draw(cx, me, bx, by, 54, clamp(vy / 700, -.5, .7), false, inv > 0 ? .5 + Math.abs(Math.sin(t * 30)) * .5 : 1);
    if (!started) GK.txt(cx, '👆', 180, 330, 40);
    fx.draw(cx); fx.end(cx);
    hud.set('🚀 ' + passed + '/' + GOAL, '⭐ ' + stars, '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '👆');
  return () => K.stop();
};

/* =====================================================================
   DOODLE — bouncing jump up platforms, springs, candy, moving/breaking
   ===================================================================== */
GAMES.doodle = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, GOAL = cfg.height || 2600, th = TH(cfg.theme);
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const me = cfg.me || '🐱', plat = cfg.plat || '☁️', item = cfg.item || '🍬';
  let p = { x: 180, y: 380, vy: -520 }, cam = 0, plats = [], tx = 180, best = 0, items = 0, t = 0, over = false, topY = 420;
  function mkPlat(y) { const r = Math.random(); const x = rnd(40, W - 40); const pl = { x, y, w: 74, k: r < .1 + d * .12 ? 'move' : r < .2 + d * .15 ? 'break' : 'norm', dx: rnd(40, 70) * (Math.random() < .5 ? -1 : 1), broke: 0 }; if (Math.random() < .25) pl.item = true; if (Math.random() < .07 && pl.k === 'norm') pl.spring = true; plats.push(pl); topY = y; }
  plats.push({ x: 180, y: 430, w: 120, k: 'norm', dx: 0 }); topY = 430; while (topY > -60) mkPlat(topY - rnd(52, 70 + d * 24));
  GK.input(K, c, { down(pp) { tx = pp.x; }, move(pp, e, down) { tx = pp.x; } }); const keys = GK.keys(K);
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt);
    if (keys.ArrowLeft || keys.KeyA) tx -= 360 * dt; if (keys.ArrowRight || keys.KeyD) tx += 360 * dt; tx = clamp(tx, 20, W - 20);
    p.x += clamp(tx - p.x, -420 * dt, 420 * dt); p.vy += 980 * dt; const py0 = p.y; p.y += p.vy * dt;
    plats.forEach(pl => { if (pl.k === 'move') { pl.x += pl.dx * dt; if (pl.x < 40 || pl.x > W - 40) pl.dx *= -1; } if (pl.broke) pl.broke += dt; });
    if (p.vy > 0) plats.forEach(pl => { if (pl.broke) return; if (py0 + 26 <= pl.y && p.y + 26 >= pl.y && Math.abs(p.x - pl.x) < pl.w / 2 + 12) { if (pl.k === 'break') { pl.broke = .001; sfx('bad'); return; } p.vy = pl.spring ? -880 : -540; sfx(pl.spring ? 'win' : 'pop'); fx.burst(p.x, pl.y, 6, { spd: 60, life: .4, size: 3, col: '#fff' }); if (pl.spring) fx.text('🚀', p.x, pl.y - 30, '#fff', 26); } });
    plats.forEach(pl => { if (pl.item && Math.hypot(pl.x - p.x, pl.y - 30 - p.y) < 30) { pl.item = false; items++; sfx('coin'); fx.text('+5', pl.x, pl.y - 50, '#fde047', 20); } });
    if (p.y < cam + 220) cam = p.y - 220; best = Math.max(best, 380 - p.y);
    while (topY > cam - 80) mkPlat(topY - rnd(52, 70 + d * 24 + Math.min(20, best / 260)));
    plats = plats.filter(pl => pl.y < cam + H + 80 && pl.broke < .6);
    if (p.y > cam + H + 40) { over = true; sfx('bad'); K.after(() => fin(clamp(best / GOAL * 82 + items * 2, 0, 90), ['📏 ' + Math.round(best / 10) + 'm', '🍬 ' + items]), 600); }
    if (best >= GOAL) { over = true; sfx('win'); K.after(() => fin(clamp(90 + items, 90, 100), ['📏 ' + Math.round(best / 10) + 'm', '🍬 ' + items]), 600); }
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, th.sky); for (let i = 0; i < 4; i++) GK.cloud(cx, (i * 110 + 30) % 360, ((i * 140 + (cam * -.2)) % 520 + 520) % 520 - 30, 1.3); cx.save(); cx.translate(0, -cam);
    plats.forEach(pl => { const al = pl.broke ? 1 - pl.broke / .6 : 1, sy = pl.broke ? 1 + pl.broke * 3 : 1; GK.draw(cx, plat, pl.x, pl.y + 8 + pl.broke * 120, 78, 0, false, al, 1.3, .8); if (pl.k === 'move') { cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = 2; cx.strokeRect(pl.x - 36, pl.y - 2, 72, 6); } if (pl.spring) GK.draw(cx, '🔼', pl.x, pl.y - 12, 22); if (pl.item) GK.draw(cx, item, pl.x, pl.y - 34 + Math.sin(t * 5 + pl.x) * 4, 28); });
    GK.draw(cx, me, p.x, p.y, 58, clamp(p.vy / 1500, -.3, .3), false, 1, 1, p.vy < 0 ? 1.06 : .94); cx.restore();
    fx.draw(cx); fx.end(cx); GK.bar(cx, 346, 40, 8, 400, best / GOAL, '#22c55e'); GK.draw(cx, '🏁', 350, 30, 20);
    hud.set('📏 ' + Math.max(0, Math.round(best / 10)) + 'm', '🍬 ' + items, '↔');
  });
  GK.count(c.wrap, K, () => { }, '↔');
  return () => K.stop();
};

/* =====================================================================
   WHACK — creatures pop up, golden bonus, bombs, boss with 3 hits, combo
   ===================================================================== */
GAMES.whack = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, TT = cfg.secs || 30, th = TH(cfg.theme);
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const good = cfg.good || ['🐹'], bad = cfg.bad || ['💣'], gold = cfg.gold || '👑', hole = cfg.hole || '#6b4423';
  const spots = []; for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) spots.push({ x: 70 + q * 110, y: 150 + r * 106, t: 0, k: 'good', e: '', hp: 1, max: 1, hit: 0, life: 1 });
  let left = TT, sp = .6, pts = 0, combo = 0, spG = 0, hits = 0, miss = 0, lives = 3, over = false, t = 0, hx = 0, hy = 0, hammer = 0, bossT = 9;
  GK.input(K, c, { down(p) {
    hx = p.x; hy = p.y; hammer = .18; let hitAny = false;
    spots.forEach(s => { if (s.t > 0 && Math.hypot(p.x - s.x, p.y - (s.y - 12)) < 52) { hitAny = true; whack(s); } });
    if (!hitAny) { sfx('tap'); if (combo > 0) combo = 0; }
  } });
  function whack(s) {
    s.hp--; s.hit = .2; if (s.hp > 0) { sfx('pop'); fx.text('💥', s.x, s.y - 50, '#fff', 22); return; }
    if (s.k === 'bad') { lives--; combo = 0; sfx('bad'); fx.shake(.5); fx.burst(s.x, s.y - 30, 14, { spd: 160, col: '#f87171' }); fx.text('💥 -1', s.x, s.y - 60, '#f87171', 24); if (lives <= 0) end(); }
    else { const m = 1 + Math.min(4, Math.floor(combo / 4)); const add = (s.k === 'gold' ? 30 : s.k === 'boss' ? 40 : 10) * m; combo++; hits++; pts += add; sfx(s.k === 'good' ? 'coin' : 'win'); fx.text('+' + add, s.x, s.y - 60, s.k === 'good' ? '#fff' : '#fde047', 20 + m * 2); fx.burst(s.x, s.y - 30, s.k === 'good' ? 8 : 20, { spd: 150, e: s.k === 'good' ? null : '⭐', size: 4 }); }
    s.t = .001; s.gone = true;
  }
  function end() { if (over) return; over = true; K.after(() => fin(clamp(pts / Math.max(80, spG * 14) * 100, 0, 100), ['🔨 ' + hits, '⭐ ' + pts]), 400); }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; sp -= dt; bossT -= dt; fx.update(dt); hammer = Math.max(0, hammer - dt);
    if (sp <= 0 && left > 1.2) {
      sp = clamp(.7 - d * .28 - (TT - left) * .006, .28, .8); const free = spots.filter(s => s.t <= 0); if (free.length) { const s = pick(free), r = Math.random();
        s.gone = false; s.t = 1; s.hit = 0; if (bossT <= 0) { bossT = 11; s.k = 'boss'; s.e = cfg.boss || '👹'; s.hp = s.max = 3; s.life = 2.2; spG += 3; } else if (r < .1) { s.k = 'gold'; s.e = gold; s.hp = s.max = 1; s.life = .8; spG += 3; } else if (r < .28 + d * .1) { s.k = 'bad'; s.e = pick(bad); s.hp = s.max = 1; s.life = 1.3 - d * .3; } else { s.k = 'good'; s.e = pick(good); s.hp = s.max = 1; s.life = 1.25 - d * .4 - (TT - left) * .004; spG++; } s.age = 0; }
    }
    spots.forEach(s => { if (s.t > 0) { s.age += dt; if (s.gone) { s.t -= dt * 4; if (s.t <= 0) s.t = 0; } else if (s.age > s.life) { s.t = 0; if (s.k === 'good' || s.k === 'boss') { combo = 0; miss++; } } } s.hit = Math.max(0, s.hit - dt); });
    if (left <= 0) end();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, th.sky); cx.fillStyle = th.ground; cx.fillRect(0, 110, W, H);
    for (let i = 0; i < 14; i++) { cx.fillStyle = 'rgba(0,0,0,.06)'; cx.fillRect(i * 28, 110, 14, H); }
    spots.forEach(s => {
      cx.fillStyle = 'rgba(0,0,0,.25)'; cx.beginPath(); cx.ellipse(s.x, s.y + 18, 44, 15, 0, 0, 7); cx.fill(); cx.fillStyle = hole; cx.beginPath(); cx.ellipse(s.x, s.y + 14, 40, 13, 0, 0, 7); cx.fill();
      if (s.t > 0) { const u = s.gone ? s.t : Math.min(1, s.age * 7) * (s.age > s.life - .25 ? Math.max(0, (s.life - s.age) * 4) : 1); cx.save(); cx.beginPath(); cx.rect(s.x - 50, s.y - 70, 100, 92); cx.clip(); GK.draw(cx, s.e, s.x + (s.hit > 0 ? Math.sin(t * 60) * 5 : 0), s.y + 26 - u * 66, s.k === 'boss' ? 74 : 62, 0, false, 1, 1, 1 - s.hit * .5); cx.restore(); if (s.k === 'boss') GK.bar(cx, s.x - 24, s.y - 62, 48, 7, s.hp / s.max, '#ef4444'); }
      cx.fillStyle = hole; cx.beginPath(); cx.ellipse(s.x, s.y + 20, 42, 9, 0, 0, Math.PI); cx.fill();
    });
    if (hammer > 0) { cx.save(); cx.translate(hx, hy - 10); cx.rotate(-.6 + (hammer / .18) * 1.1); GK.draw(cx, '🔨', 0, -10, 56); cx.restore(); }
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), '⭐ ' + pts + (combo > 3 ? ' 🔥' + combo : ''), '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '👆');
  return () => K.stop();
};

/* =====================================================================
   SHOOTER — defend the base: tap to fire, enemies with HP, waves
   ===================================================================== */
GAMES.shooter = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, TT = cfg.secs || 32, th = TH(cfg.theme);
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const foe = cfg.foe || '🔥', ammo = cfg.ammo || '❄️', base = cfg.base || '🍬', turret = cfg.turret || '🔫';
  let foes = [], shots = [], left = TT, sp = .5, lives = 4, kills = 0, spawned = 0, t = 0, over = false, aim = 180, cd = 0, combo = 0, rapid = 0;
  GK.input(K, c, { down(p) { aim = p.x; fire(p); }, move(p, e, down) { aim = p.x; if (down) fire(p); } });
  function fire(p) { if (cd > 0) return; cd = rapid > 0 ? .1 : .22; const a = Math.atan2(p.y - 430, p.x - 180); shots.push({ x: 180, y: 430, vx: Math.cos(a) * 640, vy: Math.sin(a) * 640 }); sfx('pop'); }
  function end() { if (over) return; over = true; K.after(() => fin(clamp(kills / Math.max(1, spawned) * 82 + lives * 4.5, 0, 100), ['💥 ' + kills + '/' + spawned, '❤️ ' + lives]), 500); }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; sp -= dt; cd -= dt; rapid = Math.max(0, rapid - dt); fx.update(dt);
    if (sp <= 0 && left > 2) { sp = clamp(.9 - d * .3 - (TT - left) * .012, .3, 1); const big = Math.random() < .18, pw = Math.random() < .05; spawned++; foes.push({ x: rnd(36, W - 36), y: -30, v: 48 + d * 55 + (TT - left) * 1.4 + (big ? -14 : 0), hp: big ? 3 : 1, max: big ? 3 : 1, big, pw, drift: rnd(-25, 25), ph: rnd(0, 6) }); }
    foes.forEach(f => { f.y += f.v * dt; f.x += Math.sin(t * 2 + f.ph) * f.drift * dt; if (f.y > 405) { f.dead = true; lives--; sfx('bad'); fx.shake(.5); fx.burst(f.x, 410, 14, { spd: 130, col: '#f87171' }); if (lives <= 0) end(); } });
    shots.forEach(s => { s.x += s.vx * dt; s.y += s.vy * dt; foes.forEach(f => { if (!f.dead && !s.dead && Math.hypot(s.x - f.x, s.y - f.y) < (f.big ? 36 : 26)) { s.dead = true; f.hp--; fx.burst(f.x, f.y, 6, { spd: 100, life: .35, size: 3, col: '#bae6fd' }); if (f.hp <= 0) { f.dead = true; kills++; combo++; sfx('coin'); fx.burst(f.x, f.y, 14, { spd: 150, e: ammo, size: 3 }); fx.text('+' + (f.big ? 3 : 1), f.x, f.y - 20, '#fff', 20); if (f.pw) { rapid = 5; fx.text('⚡', f.x, f.y - 40, '#fde047', 28); } } else sfx('tap'); } }); });
    foes = foes.filter(f => !f.dead); shots = shots.filter(s => !s.dead && s.x > -20 && s.x < W + 20 && s.y > -20 && s.y < H);
    if (left <= 0 && foes.length === 0) end(); else if (left <= -4) end();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, th.sky); cx.fillStyle = th.ground; cx.fillRect(0, 410, W, 70);
    foes.forEach(f => { GK.shadow(cx, f.x, 412, 16, .15); GK.draw(cx, f.pw ? '⚡' : foe, f.x, f.y, f.big ? 70 : 46, Math.sin(t * 4 + f.ph) * .15); if (f.big) GK.bar(cx, f.x - 20, f.y - 44, 40, 6, f.hp / f.max, '#ef4444'); });
    shots.forEach(s => GK.draw(cx, ammo, s.x, s.y, 24, t * 10));
    for (let i = 0; i < 5; i++) GK.draw(cx, base, 40 + i * 70, 440, 40, 0, false, lives * 1.25 > i ? 1 : .25);
    const a = Math.atan2(aim * 0 + 100 - 430, aim - 180); cx.save(); cx.translate(180, 432); cx.rotate(a + Math.PI / 2); GK.draw(cx, turret, 0, -10, 52); cx.restore();
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), '💥 ' + kills + (rapid > 0 ? ' ⚡' : ''), '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '👆 🎯');
  return () => K.stop();
};
