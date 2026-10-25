'use strict';
/* =====================================================================
   SEEK — real hide & seek: lift hiding spots, warm/cold hints, decoys
   ===================================================================== */
GAMES.seek = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, th = TH(cfg.theme), HID = cfg.hiders || 4, TT = cfg.secs || 60;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const spotsE = cfg.spots || ['🌳', '📦', '🛋️', '🚪', '🪴', '🛏️'], hider = cfg.hider || '🐧', decoys = cfg.decoy || ['🦆'];
  const n = 9, spots = []; const pos = shuf([...Array(n).keys()]);
  for (let i = 0; i < n; i++) { const r = Math.floor(i / 3), q = i % 3; spots.push({ x: 66 + q * 114 + rnd(-8, 8), y: 130 + r * 110 + rnd(-6, 6), e: spotsE[i % spotsE.length], lift: 0, opened: false, what: null }); }
  pos.slice(0, HID).forEach(i => spots[i].what = 'hider'); pos.slice(HID, HID + 2).forEach(i => spots[i].what = 'decoy');
  let tries = HID * 3 + 3, found = 0, left = TT, t = 0, over = false, hint = '', hintT = 0, pts = 0, wrong = 0;
  GK.input(K, c, { down(p) {
    if (over) return; let s = null, bd = 60; spots.forEach(q => { const dd = Math.hypot(p.x - q.x, p.y - q.y); if (dd < bd && !q.opened) { bd = dd; s = q; } }); if (!s) return;
    s.opened = true; tries--; sfx('tap');
    if (s.what === 'hider') { found++; pts += 20; sfx('win'); fx.text('😄 +20', s.x, s.y - 30, '#fde047', 24); fx.burst(s.x, s.y, 20, { spd: 170, e: '⭐', size: 4 }); hint = ''; }
    else if (s.what === 'decoy') { wrong++; sfx('bad'); fx.text('😅', s.x, s.y - 30, '#fff', 28); hint = ''; }
    else { let md = 1e9; spots.forEach(q => { if (q.what === 'hider' && !q.opened) md = Math.min(md, Math.hypot(q.x - s.x, q.y - s.y)); }); hint = md < 130 ? '🔥' : md < 210 ? '🌡️' : '❄️'; hintT = 1.4; sfx('pop'); }
    if (found >= HID) end(true); else if (tries <= 0) end(false);
  } });
  function end(win) { if (over) return; over = true; sfx(win ? 'win' : 'bad'); K.after(() => fin(clamp(found / HID * 78 + (win ? 10 + tries / (HID * 3 + 3) * 6 + left / TT * 6 : 0), 0, 100), ['🔎 ' + found + '/' + HID]), 700); }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; fx.update(dt); hintT = Math.max(0, hintT - dt); if (left <= 0) end(false);
    spots.forEach(s => { s.lift += ((s.opened ? 1 : 0) - s.lift) * Math.min(1, dt * 9); });
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, th.sky); cx.fillStyle = th.ground; cx.fillRect(0, 90, W, H); for (let i = 0; i < 12; i++) { cx.fillStyle = 'rgba(0,0,0,.05)'; cx.fillRect(i * 32, 90, 16, H); }
    spots.forEach(s => {
      GK.shadow(cx, s.x, s.y + 38, 38, .22);
      if (s.what === 'hider' || s.what === 'decoy') GK.draw(cx, s.what === 'hider' ? hider : pick(decoys), s.x, s.y + 6 - s.lift * 14 + Math.sin(t * 3 + s.x) * 1.5 * s.lift, 54, 0, false, s.opened ? 1 : 0);
      else if (s.opened) { GK.txt(cx, '✓', s.x, s.y + 4, 22, 'rgba(255,255,255,.6)'); }
      GK.draw(cx, s.e, s.x - s.lift * 56, s.y, 78, -s.lift * .5, false, 1 - s.lift * .75, 1, 1);
    });
    if (hint && hintT > 0) { cx.globalAlpha = Math.min(1, hintT); GK.txt(cx, hint, 180, 60, 48); cx.globalAlpha = 1; }
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), hider + ' ' + found + '/' + HID, '👆 ' + tries);
  });
  GK.count(c.wrap, K, () => { }, '👆 🔎');
  return () => K.stop();
};

/* =====================================================================
   MAZE — explore with fog of war, collect items, avoid patrols, find exit
   ===================================================================== */
GAMES.maze = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, COLS = 9, ROWS = 11, CS = 38, OX = 9, OY = 21, TT = cfg.secs || 75, ITEMS = cfg.items || 6;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const me = cfg.me || '🧑', item = cfg.item || '✨', enemyE = cfg.enemy === false ? null : (cfg.enemy || '👻'), th = TH(cfg.theme), fog = cfg.fog == null ? 3.6 : cfg.fog;
  const g = []; for (let r = 0; r < ROWS; r++) { g.push([]); for (let q = 0; q < COLS; q++) g[r].push({ n: 1, e: 1, s: 1, w: 1, v: 0 }); }
  (function carve() { const st = [[0, 0]]; g[0][0].v = 1; while (st.length) { const [r, q] = st[st.length - 1]; const nb = shuf([[-1, 0, 'n', 's'], [0, 1, 'e', 'w'], [1, 0, 's', 'n'], [0, -1, 'w', 'e']]).filter(m => { const rr = r + m[0], qq = q + m[1]; return rr >= 0 && rr < ROWS && qq >= 0 && qq < COLS && !g[rr][qq].v; }); if (!nb.length) { st.pop(); continue; } const m = nb[0], rr = r + m[0], qq = q + m[1]; g[r][q][m[2]] = 0; g[rr][qq][m[3]] = 0; g[rr][qq].v = 1; st.push([rr, qq]); } for (let i = 0; i < 12; i++) { const r = ri(0, ROWS - 2), q = ri(0, COLS - 2); if (Math.random() < .5) { g[r][q].e = 0; g[r][q + 1].w = 0; } else { g[r][q].s = 0; g[r + 1][q].n = 0; } } })();
  const player = { r: 0, q: 0, x: 0, y: 0 }; player.x = OX + CS / 2; player.y = OY + CS / 2;
  const exit = { r: ROWS - 1, q: COLS - 1 }; let coll = [], foes = [], got = 0, left = TT, lives = 3, t = 0, over = false, inv = 0, queue = null;
  const used = new Set(['0,0', exit.r + ',' + exit.q]);
  while (coll.length < ITEMS) { const r = ri(0, ROWS - 1), q = ri(0, COLS - 1), k = r + ',' + q; if (!used.has(k)) { used.add(k); coll.push({ r, q, got: false }); } }
  if (enemyE) for (let i = 0; i < 1 + Math.round(d * 1.6); i++) { const r = ri(3, ROWS - 1), q = ri(2, COLS - 1); foes.push({ r, q, x: OX + q * CS + CS / 2, y: OY + r * CS + CS / 2, tr: r, tq: q, wait: rnd(0, 1), last: null }); }
  function tryMove(dr, dq) { if (over) return; const cell = g[player.r][player.q]; if (dr === -1 && cell.n || dr === 1 && cell.s || dq === 1 && cell.e || dq === -1 && cell.w) { sfx('tap'); return; } if (Math.abs(player.x - (OX + player.q * CS + CS / 2)) > 4 || Math.abs(player.y - (OY + player.r * CS + CS / 2)) > 4) { queue = [dr, dq]; return; } player.r += dr; player.q += dq; }
  GK.keys(K, code => { if (code === 'ArrowUp' || code === 'KeyW') tryMove(-1, 0); if (code === 'ArrowDown' || code === 'KeyS') tryMove(1, 0); if (code === 'ArrowLeft' || code === 'KeyA') tryMove(0, -1); if (code === 'ArrowRight' || code === 'KeyD') tryMove(0, 1); });
  let sp0 = null; const held = { dr: 0, dq: 0 };
  GK.input(K, c, { down(p) { sp0 = p; }, move(p, e, down) { if (down && sp0) { const dx = p.x - sp0.x, dy = p.y - sp0.y; if (Math.hypot(dx, dy) > 22) { if (Math.abs(dx) > Math.abs(dy)) tryMove(0, dx > 0 ? 1 : -1); else tryMove(dy > 0 ? 1 : -1, 0); sp0 = p; } } }, up(p) { if (sp0 && Math.hypot(p.x - sp0.x, p.y - sp0.y) < 14) { const dx = p.x - player.x, dy = p.y - player.y; if (Math.abs(dx) > Math.abs(dy)) tryMove(0, dx > 0 ? 1 : -1); else tryMove(dy > 0 ? 1 : -1, 0); } sp0 = null; } });
  function end(win) { if (over) return; over = true; sfx(win ? 'win' : 'bad'); K.after(() => fin(clamp(got / ITEMS * 45 + (win ? 40 + left / TT * 15 : 0), 0, 100), ['✨ ' + got + '/' + ITEMS]), 600); }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; inv = Math.max(0, inv - dt); fx.update(dt); if (left <= 0) end(false);
    const tx = OX + player.q * CS + CS / 2, ty = OY + player.r * CS + CS / 2; player.x += clamp(tx - player.x, -240 * dt, 240 * dt); player.y += clamp(ty - player.y, -240 * dt, 240 * dt);
    if (queue && Math.abs(player.x - tx) < 3 && Math.abs(player.y - ty) < 3) { const [a, b] = queue; queue = null; tryMove(a, b); }
    coll.forEach(o => { if (!o.got && o.r === player.r && o.q === player.q) { o.got = true; got++; sfx('coin'); fx.burst(player.x, player.y, 12, { spd: 110, e: item, size: 3 }); fx.text('+1', player.x, player.y - 20, '#fde047', 20); } });
    if (player.r === exit.r && player.q === exit.q && got >= Math.ceil(ITEMS * .5)) end(true);
    foes.forEach(f => {
      const ftx = OX + f.tq * CS + CS / 2, fty = OY + f.tr * CS + CS / 2, sp = 55 + d * 55; f.x += clamp(ftx - f.x, -sp * dt, sp * dt); f.y += clamp(fty - f.y, -sp * dt, sp * dt);
      if (Math.abs(f.x - ftx) < 2 && Math.abs(f.y - fty) < 2) { f.r = f.tr; f.q = f.tq; const cell = g[f.r][f.q]; const opts = []; if (!cell.n) opts.push([-1, 0]); if (!cell.s) opts.push([1, 0]); if (!cell.e) opts.push([0, 1]); if (!cell.w) opts.push([0, -1]); let pick2 = opts.filter(o => !(f.last && o[0] === -f.last[0] && o[1] === -f.last[1])); if (!pick2.length) pick2 = opts; if (Math.random() < .35 + d * .3) { pick2.sort((a, b) => Math.hypot(f.r + a[0] - player.r, f.q + a[1] - player.q) - Math.hypot(f.r + b[0] - player.r, f.q + b[1] - player.q)); const o = pick2[0]; f.tr = f.r + o[0]; f.tq = f.q + o[1]; f.last = o; } else { const o = pick(pick2); f.tr = f.r + o[0]; f.tq = f.q + o[1]; f.last = o; } }
      if (inv <= 0 && Math.hypot(f.x - player.x, f.y - player.y) < 24) { lives--; inv = 1.5; sfx('bad'); fx.shake(.5); fx.text('💥', player.x, player.y - 20, '#fff', 28); player.r = 0; player.q = 0; player.x = OX + CS / 2; player.y = OY + CS / 2; if (lives <= 0) end(false); }
    });
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, [th.sky[0], th.sky[1]]); cx.fillStyle = th.ground; cx.fillRect(OX, OY, COLS * CS, ROWS * CS);
    for (let r = 0; r < ROWS; r++) for (let q = 0; q < COLS; q++) { cx.fillStyle = (r + q) % 2 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'; cx.fillRect(OX + q * CS, OY + r * CS, CS, CS); }
    cx.strokeStyle = '#1e1b4b'; cx.lineWidth = 5; cx.lineCap = 'round'; cx.beginPath();
    for (let r = 0; r < ROWS; r++) for (let q = 0; q < COLS; q++) { const x = OX + q * CS, y = OY + r * CS, ce = g[r][q]; if (ce.n) { cx.moveTo(x, y); cx.lineTo(x + CS, y); } if (ce.w) { cx.moveTo(x, y); cx.lineTo(x, y + CS); } if (r === ROWS - 1 && ce.s) { cx.moveTo(x, y + CS); cx.lineTo(x + CS, y + CS); } if (q === COLS - 1 && ce.e) { cx.moveTo(x + CS, y); cx.lineTo(x + CS, y + CS); } if (ce.e && q < COLS - 1) { cx.moveTo(x + CS, y); cx.lineTo(x + CS, y + CS); } if (ce.s && r < ROWS - 1) { cx.moveTo(x, y + CS); cx.lineTo(x + CS, y + CS); } }
    cx.stroke();
    GK.draw(cx, '🚪', OX + exit.q * CS + CS / 2, OY + exit.r * CS + CS / 2, 28, 0, false, got >= Math.ceil(ITEMS * .5) ? 1 : .45);
    coll.forEach(o => { if (!o.got) GK.draw(cx, item, OX + o.q * CS + CS / 2, OY + o.r * CS + CS / 2 + Math.sin(t * 4 + o.q) * 2, 24); });
    foes.forEach(f => GK.draw(cx, enemyE, f.x, f.y, 28, Math.sin(t * 5 + f.q) * .15));
    GK.shadow(cx, player.x, player.y + 12, 12, .25); GK.draw(cx, me, player.x, player.y, 30, 0, false, inv > 0 ? .5 + Math.abs(Math.sin(t * 25)) * .5 : 1);
    if (fog < 6) { const rad = fog * CS; const gr = cx.createRadialGradient(player.x, player.y, rad * .55, player.x, player.y, rad); gr.addColorStop(0, 'rgba(10,6,40,0)'); gr.addColorStop(1, 'rgba(10,6,40,.93)'); cx.fillStyle = gr; cx.fillRect(0, 0, W, H); cx.fillStyle = 'rgba(10,6,40,.93)'; cx.beginPath(); cx.rect(0, 0, W, H); cx.arc(player.x, player.y, rad, 0, 7, true); cx.fill('evenodd'); }
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), item + ' ' + got + '/' + ITEMS, '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '👆 ⬅️⬆️➡️⬇️');
  return () => K.stop();
};

/* =====================================================================
   STACK — crane pendulum, drop blocks, trim overhang, perfect streaks
   ===================================================================== */
GAMES.stack = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, N = cfg.floors || 10, th = TH(cfg.theme || 'build'), BH = 34;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const blocks = [{ x: 105, w: 150, c: 0 }]; let cam = 0, camT = 0, lives = 3, perfects = 0, streak = 0, t = 0, over = false, cur = { w: 150, drop: false, x: 0, y: 0, vx: 0, vy: 0 }, fall = [], placed = 0;
  const topY = () => 420 - blocks.length * BH, A = .85 + d * .25, om = 1.5 + d * 1.0;
  function hang() { const th2 = Math.sin(t * om) * A; return { x: 180 + Math.sin(th2) * 130, y: 70 + Math.cos(th2) * 130 - cam, th: th2 }; }
  function drop() { if (over || cur.drop) return; const h = hang(); cur.drop = true; cur.x = h.x - cur.w / 2; cur.y = h.y + cam; cur.vx = Math.cos(h.th) * A * om * 130 * Math.cos(t * om) * .55; cur.vy = 0; sfx('tap'); }
  GK.input(K, c, { down() { drop(); } }); GK.keys(K, code => { if (code === 'Space' || code === 'ArrowDown') drop(); });
  function land() {
    const pv = blocks[blocks.length - 1], o0 = Math.max(cur.x, pv.x), o1 = Math.min(cur.x + cur.w, pv.x + pv.w), ov = o1 - o0;
    if (ov < 8) { lives--; streak = 0; sfx('bad'); fx.shake(.5); fall.push({ x: cur.x, y: cur.y, w: cur.w, vy: 0, c: blocks.length }); GK.flash(c.wrap, K, '💥', 600, 'bad'); resetCur(cur.w); if (lives <= 0) end(); return; }
    let nx = o0, nw = ov; if (Math.abs(cur.x - pv.x) < 7) { nx = pv.x; nw = pv.w; perfects++; streak++; sfx('win'); fx.text('PERFECT' + (streak > 1 ? ' x' + streak : ''), 180, 200, '#fde047', 24); fx.burst(180, topY() - cam, 16, { spd: 150 }); if (streak >= 3) nw = Math.min(150, nw + 6); } else { streak = 0; sfx('ok'); if (cur.x < o0) fall.push({ x: cur.x, y: topY(), w: o0 - cur.x, vy: 0, c: blocks.length }); if (cur.x + cur.w > o1) fall.push({ x: o1, y: topY(), w: cur.x + cur.w - o1, vy: 0, c: blocks.length }); }
    blocks.push({ x: nx, w: nw, c: blocks.length }); placed++; camT = Math.max(0, (blocks.length - 7) * BH);
    if (placed >= N) end(true); else resetCur(nw);
  }
  function resetCur(w) { cur = { w, drop: false, x: 0, y: 0, vx: 0, vy: 0 }; }
  function end(win) { if (over) return; over = true; sfx(win ? 'win' : 'bad'); K.after(() => fin(clamp(placed / N * 82 + perfects * 3 + (win ? 6 : 0), 0, 100), ['🏢 ' + placed + '/' + N, '✨ ' + perfects]), 700); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); cam += (camT - cam) * Math.min(1, dt * 5);
    if (cur.drop) { cur.vy += 1500 * dt; cur.y += cur.vy * dt; cur.x += cur.vx * dt * .4; cur.vx *= .98; if (cur.y + BH >= topY() + 0) { cur.y = topY(); land(); } }
    fall.forEach(f => { f.vy += 1100 * dt; f.y += f.vy * dt; }); fall = fall.filter(f => f.y < 700);
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, th.sky); GK.cloud(cx, 70, 90 + cam * .3 % 400, 1.3); GK.cloud(cx, 280, 200 + cam * .2 % 400, 1);
    cx.fillStyle = '#78716c'; cx.fillRect(0, 420 + cam, W, 80); cx.fillStyle = '#a8a29e'; cx.fillRect(0, 420 + cam, W, 6);
    const col = i => `hsl(${(i * 37 + 190) % 360},60%,${52 + (i % 2) * 6}%)`;
    blocks.forEach((b, i) => { const y = 420 - (i + 1) * BH + cam; cx.fillStyle = col(b.c); GK.rr(cx, b.x, y, b.w, BH - 1, 4); cx.fill(); cx.fillStyle = 'rgba(255,255,255,.4)'; for (let wx = b.x + 10; wx < b.x + b.w - 14; wx += 24) cx.fillRect(wx, y + 8, 12, 16); cx.fillStyle = 'rgba(0,0,0,.12)'; cx.fillRect(b.x, y + BH - 6, b.w, 5); });
    fall.forEach(f => { cx.fillStyle = col(f.c); cx.fillRect(f.x, f.y + cam - BH + 0, f.w, BH - 1); });
    const h = hang(); cx.strokeStyle = '#374151'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(180, 40 - Math.min(cam, 40)); cx.lineTo(180, 40 - Math.min(cam, 40)); cx.stroke(); cx.fillStyle = '#f59e0b'; cx.fillRect(176, -10, 8, 54 - Math.min(cam, 0)); cx.fillRect(100, 38 - Math.min(cam, 38) * 0, 160, 8); GK.draw(cx, '🏗️', 180, 24, 36);
    if (!cur.drop) { cx.strokeStyle = '#d1d5db'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(180, 46); cx.lineTo(h.x, h.y - 6); cx.stroke(); cx.fillStyle = col(blocks.length); GK.rr(cx, h.x - cur.w / 2, h.y, cur.w, BH - 1, 4); cx.fill(); cx.fillStyle = 'rgba(255,255,255,.4)'; for (let wx = h.x - cur.w / 2 + 10; wx < h.x + cur.w / 2 - 14; wx += 24) cx.fillRect(wx, h.y + 8, 12, 16); }
    else { cx.fillStyle = col(blocks.length); GK.rr(cx, cur.x, cur.y - BH + cam + 0, cur.w, BH - 1, 4); cx.fill(); }
    fx.draw(cx); fx.end(cx);
    hud.set('🏢 ' + placed + '/' + N, '✨ ' + perfects + (streak > 1 ? ' 🔥' + streak : ''), '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '👆');
  return () => K.stop();
};

/* =====================================================================
   SORTBELT — conveyor of items, send them to the right bin, speed rises
   ===================================================================== */
GAMES.sort = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, N = cfg.n || 18, bins = cfg.bins, items = cfg.items, th = TH(cfg.theme);
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let belt = [], spawned = 0, ok = 0, lives = 3, combo = 0, best = 0, t = 0, over = false, sp = .6, speed = 70 + d * 60, off = 0;
  const bw = W / bins.length;
  function choose(k) {
    if (over) return; const it = belt.filter(b => !b.done).sort((a, b) => b.x - a.x)[0]; if (!it) return; it.done = true;
    if (it.k === k) { ok++; combo++; best = Math.max(best, combo); sfx('ok'); const bi = bins.findIndex(b => b.k === k); it.tx = bw * (bi + .5); it.good = true; fx.text('+' + (10 + Math.min(10, combo)), it.x, 180, '#fde047', 20); fx.burst(it.tx, 340, 8, { spd: 100, life: .4, size: 3 }); }
    else { lives--; combo = 0; sfx('bad'); it.bad = true; fx.shake(.4); fx.text('✗', it.x, 180, '#f87171', 28); if (lives <= 0) end(); }
  }
  GK.input(K, c, { down(p) { if (p.y > 330) choose(bins[Math.min(bins.length - 1, Math.floor(p.x / bw))].k); } });
  GK.keys(K, code => { if (code.startsWith('Digit') && bins[+code.slice(5) - 1]) choose(bins[+code.slice(5) - 1].k); if (code === 'ArrowLeft') choose(bins[0].k); if (code === 'ArrowRight') choose(bins[bins.length - 1].k); if (code === 'ArrowDown' && bins[1]) choose(bins[Math.floor(bins.length / 2)].k); });
  function end() { if (over) return; over = true; K.after(() => fin(clamp(ok / N * 90 + best * .8 - (3 - lives) * 3, 0, 100), ['✅ ' + ok + '/' + N, '🔥 ' + best]), 500); }
  K.loop(dt => {
    if (over) return; t += dt; sp -= dt; fx.update(dt); off = (off + speed * dt) % 24; speed = 70 + d * 60 + t * 1.8;
    if (sp <= 0 && spawned < N) { sp = clamp(1.25 - d * .4 - t * .01, .55, 1.4); spawned++; const it = pick(items); belt.push({ x: -30, e: it.e, k: it.k, done: false }); }
    belt.forEach(b => { if (!b.done) { b.x += speed * dt; if (b.x > W + 20) { b.done = true; b.bad = true; lives--; combo = 0; sfx('bad'); fx.shake(.4); fx.text('😬', 330, 180, '#fff', 28); if (lives <= 0) end(); } } else { b.fy = (b.fy || 0) + dt * 700; if (b.tx != null) b.x += (b.tx - b.x) * Math.min(1, dt * 8); } });
    belt = belt.filter(b => !b.done || (b.fy || 0) < 260);
    if (spawned >= N && belt.every(b => b.done)) end();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, [th.sky[0], th.sky[1]]); cx.fillStyle = '#374151'; cx.fillRect(0, 180, W, 60); cx.fillStyle = '#4b5563'; for (let x = -24 + off; x < W; x += 24) cx.fillRect(x, 184, 12, 52); cx.fillStyle = '#9ca3af'; cx.fillRect(0, 176, W, 6); cx.fillRect(0, 238, W, 6);
    [20, 130, 240, 340].forEach(x => { cx.fillStyle = '#6b7280'; cx.beginPath(); cx.arc(x, 244, 8, 0, 7); cx.fill(); });
    const front = belt.filter(b => !b.done).sort((a, b) => b.x - a.x)[0];
    belt.forEach(b => { const yy = 196 + (b.done ? (b.fy || 0) : 0); GK.shadow(cx, b.x, 236, 20, .2); GK.draw(cx, b.e, b.x, yy, 50, b.done ? (b.bad ? .6 : 0) : 0, false, b.done ? Math.max(0, 1 - (b.fy || 0) / 240) : 1); if (b === front) { cx.strokeStyle = '#fde047'; cx.lineWidth = 3; cx.beginPath(); cx.arc(b.x, 196, 32, 0, 7); cx.stroke(); } });
    bins.forEach((b, i) => { const x = i * bw; cx.fillStyle = ['#3b82f6', '#22c55e', '#f59e0b', '#ec4899'][i % 4]; GK.rr(cx, x + 8, 340, bw - 16, 100, 18); cx.fill(); cx.fillStyle = 'rgba(255,255,255,.2)'; GK.rr(cx, x + 8, 340, bw - 16, 32, 18); cx.fill(); GK.draw(cx, b.e, x + bw / 2, 382, 46); if (b.l) GK.txt(cx, tx(b.l), x + bw / 2, 424, 13); GK.txt(cx, String(i + 1), x + 22, 354, 14, 'rgba(255,255,255,.8)'); });
    fx.draw(cx); fx.end(cx);
    hud.set('📦 ' + Math.min(spawned, N) + '/' + N, '✅ ' + ok + (combo > 2 ? ' 🔥' + combo : ''), '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '👆 ⬇️');
  return () => K.stop();
};

/* =====================================================================
   CRANE — release the crate so it lands on the moving truck
   ===================================================================== */
GAMES.crane = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, N = cfg.crates || 9, th = TH('build');
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let tr = { x: 60, dir: 1 }, crate = null, truck = { x: -80, v: 90, w: 90 }, n = 0, pts = 0, ok = 0, t = 0, over = false, combo = 0, wait = 0;
  const crateE = cfg.crate || '📦', truckE = cfg.truck || '🚚';
  function nextTruck() { truck = { x: Math.random() < .5 ? -90 : 450, v: (80 + d * 90 + n * 5) * (Math.random() < .5 ? 1 : -1), w: 92 }; if (truck.x > 0) truck.v = -Math.abs(truck.v); else truck.v = Math.abs(truck.v); }
  nextTruck();
  function drop() { if (over || crate || wait > 0) return; crate = { x: tr.x, y: 96, vy: 0 }; n++; sfx('tap'); }
  GK.input(K, c, { down() { drop(); } }); GK.keys(K, code => { if (code === 'Space' || code === 'ArrowDown') drop(); });
  function end() { if (over) return; over = true; K.after(() => fin(clamp(ok / N * 82 + pts / (N * 15) * 18, 0, 100), ['📦 ' + ok + '/' + N]), 700); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); wait = Math.max(0, wait - dt); tr.x += tr.dir * (90 + d * 90) * dt; if (tr.x > 320) { tr.x = 320; tr.dir = -1; } if (tr.x < 40) { tr.x = 40; tr.dir = 1; }
    truck.x += truck.v * dt; if ((truck.v > 0 && truck.x > 470) || (truck.v < 0 && truck.x < -110)) { if (!crate) nextTruck(); else truck.v *= -1; }
    if (crate) {
      crate.vy += 1300 * dt; crate.y += crate.vy * dt;
      if (crate.y > 372 && crate.y < 420) { const dx = Math.abs(crate.x - truck.x); if (dx < truck.w / 2 + 6) { ok++; combo++; const pf = dx < 14, add = 10 + (pf ? 5 : 0); pts += add; sfx(pf ? 'win' : 'ok'); fx.text((pf ? '⭐ ' : '') + '+' + add, truck.x, 330, '#fde047', 24); fx.burst(truck.x, 380, pf ? 22 : 10, { spd: 140 }); crate = null; wait = .6; if (n >= N) end(); else nextTruck(); } }
      if (crate && crate.y > 440) { combo = 0; sfx('bad'); fx.shake(.4); fx.burst(crate.x, 440, 12, { spd: 130, col: '#d6b98c' }); fx.text('💥', crate.x, 410, '#fff', 28); crate = null; wait = .6; if (n >= N) end(); }
    }
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, th.sky); for (let i = 0; i < 4; i++) GK.draw(cx, '🏢', 40 + i * 96, 330, 80, 0, false, .5);
    cx.fillStyle = '#6b7280'; cx.fillRect(0, 420, W, 60); cx.fillStyle = '#fbbf24'; for (let x = 0; x < W; x += 40) cx.fillRect(x + ((t * 40) % 40), 450, 20, 4);
    cx.fillStyle = '#f59e0b'; cx.fillRect(0, 56, W, 10); cx.fillStyle = '#92400e'; cx.fillRect(20, 56, 8, 364); cx.fillRect(332, 56, 8, 364);
    cx.strokeStyle = '#374151'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(tr.x, 66); cx.lineTo(tr.x, crate ? 96 : 96); cx.stroke(); GK.draw(cx, '🏗️', tr.x, 74, 34); if (!crate) GK.draw(cx, crateE, tr.x, 104, 40);
    if (crate) { GK.draw(cx, crateE, crate.x, crate.y, 40, crate.y * .01); cx.strokeStyle = 'rgba(255,255,255,.4)'; cx.setLineDash([4, 6]); cx.beginPath(); cx.moveTo(crate.x, crate.y + 20); cx.lineTo(crate.x, 420); cx.stroke(); cx.setLineDash([]); }
    GK.shadow(cx, truck.x, 424, 44, .2); GK.draw(cx, truckE, truck.x, 396, 76, 0, truck.v > 0);
    fx.draw(cx); fx.end(cx);
    hud.set('📦 ' + Math.min(n, N) + '/' + N, '⭐ ' + pts, '🎯 ' + ok);
  });
  GK.count(c.wrap, K, () => { }, '👆 🚚');
  return () => K.stop();
};

/* =====================================================================
   GUARD — protect the food from thieves (Joey Special / picnic)
   ===================================================================== */
GAMES.guard = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, TT = cfg.secs || 32, th = TH(cfg.theme);
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const food = cfg.food || '🍕', thieves = cfg.thieves || ['🦆', '🐔', '🐶'], N0 = cfg.slices || 8;
  let slices = N0, foes = [], left = TT, sp = .5, t = 0, over = false, shoo = 0, combo = 0, hits = 0, spawned = 0, hx = 180, hy = 300;
  GK.input(K, c, { down(p) { hx = p.x; hy = p.y; shoo = .18; let any = false; foes.forEach(f => { if (!f.dead && Math.hypot(f.x - p.x, f.y - p.y) < 44) { any = true; f.hp--; if (f.hp <= 0) { f.dead = true; f.fly = 1; hits++; combo++; sfx('coin'); fx.text('+' + (1 + (combo > 3 ? 1 : 0)), f.x, f.y - 20, '#fde047', 22); fx.burst(f.x, f.y, 10, { spd: 140, e: '💨', size: 3 }); } else { sfx('pop'); f.x += (f.x > 180 ? 30 : -30); } } }); if (!any) { sfx('tap'); combo = 0; } } });
  function end() { if (over) return; over = true; K.after(() => fin(clamp(slices / N0 * 62 + hits / Math.max(1, spawned) * 38, 0, 100), ['🍕 ' + slices + '/' + N0, '🖐️ ' + hits]), 500); }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; sp -= dt; fx.update(dt); shoo = Math.max(0, shoo - dt);
    if (sp <= 0 && left > 1.5) { sp = clamp(.9 - d * .3 - (TT - left) * .012, .3, 1); const side = ri(0, 3), big = Math.random() < .15; spawned++; const f = { x: side === 0 ? -30 : side === 1 ? W + 30 : rnd(30, W - 30), y: side === 2 ? -30 : side === 3 ? H : rnd(60, 360), e: pick(thieves), hp: big ? 2 : 1, big, v: 55 + d * 50 + (TT - left) * 1.2, ph: rnd(0, 6) }; foes.push(f); }
    foes.forEach(f => { if (f.dead) { f.fly += dt * 3; f.y -= 200 * dt; return; } const dx = 180 - f.x, dy = 280 - f.y, dd = Math.hypot(dx, dy); f.x += dx / dd * f.v * dt + Math.sin(t * 5 + f.ph) * 22 * dt; f.y += dy / dd * f.v * dt; if (dd < 52) { f.dead = true; f.stole = true; f.fly = 1; slices--; combo = 0; sfx('bad'); fx.shake(.4); fx.text('😋 -1', f.x, f.y - 20, '#f87171', 22); if (slices <= 0) end(); } });
    foes = foes.filter(f => !f.dead || f.fly < 3);
    if (left <= 0) end();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, [th.sky[0], th.sky[1]]); cx.fillStyle = th.ground; cx.fillRect(0, 130, W, H);
    cx.fillStyle = '#92400e'; cx.beginPath(); cx.ellipse(180, 292, 112, 52, 0, 0, 7); cx.fill(); cx.fillStyle = '#b45309'; cx.beginPath(); cx.ellipse(180, 282, 112, 52, 0, 0, 7); cx.fill(); cx.fillStyle = '#fef3c7'; cx.beginPath(); cx.ellipse(180, 282, 88, 38, 0, 0, 7); cx.fill();
    for (let i = 0; i < N0; i++) { const a = i / N0 * Math.PI * 2 - Math.PI / 2; if (i < slices) GK.draw(cx, food, 180 + Math.cos(a) * 52, 282 + Math.sin(a) * 22, 36); }
    foes.forEach(f => { GK.shadow(cx, f.x, f.y + 22, 18, .2); GK.draw(cx, f.e, f.x, f.y, f.big ? 66 : 50, f.dead ? f.fly * 2 : Math.sin(t * 8 + f.ph) * .12, f.x < 180, f.dead ? 1 - f.fly / 3 : 1); if (f.big && !f.dead) GK.txt(cx, '❤️'.repeat(f.hp), f.x, f.y - 38, 14); });
    if (shoo > 0) { cx.save(); cx.translate(hx, hy); cx.rotate(-.5 + shoo * 4); GK.draw(cx, '🖐️', 0, 0, 54); cx.restore(); }
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), food + ' ' + slices + '/' + N0, '🖐️ ' + hits);
  });
  GK.count(c.wrap, K, () => { }, '👆 🖐️');
  return () => K.stop();
};

/* =====================================================================
   CHASE — creatures flee from your touch; catch them with the net
   ===================================================================== */
GAMES.chase = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, TT = cfg.secs || 32, th = TH(cfg.theme);
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const good = cfg.good || ['🦋'], bad = cfg.bad || ['🐝'];
  let cr = [], left = TT, sp = .3, pts = 0, lives = 3, t = 0, over = false, net = 0, nx = 180, ny = 300, caught = 0, spawned = 0, combo = 0;
  function spawn() { const isBad = Math.random() < .2 + d * .08; const gold = !isBad && Math.random() < .08; if (!isBad) spawned++; cr.push({ x: Math.random() < .5 ? -20 : W + 20, y: rnd(80, 380), vx: rnd(-60, 60), vy: rnd(-40, 40), e: isBad ? pick(bad) : gold ? '🌟' : pick(good), bad: isBad, gold, ph: rnd(0, 6) }); }
  GK.input(K, c, { down(p) { nx = p.x; ny = p.y; net = .2; let hit = false; cr.forEach(f => { if (!f.dead && Math.hypot(f.x - p.x, f.y - p.y) < 46) { hit = true; f.dead = true; if (f.bad) { lives--; combo = 0; sfx('bad'); fx.shake(.4); fx.text('😖', f.x, f.y - 20, '#fff', 26); if (lives <= 0) end(); } else { caught++; combo++; const add = (f.gold ? 25 : 10) * (1 + Math.min(3, Math.floor(combo / 3))); pts += add; sfx('coin'); fx.text('+' + add, f.x, f.y - 20, '#fde047', 22); fx.burst(f.x, f.y, 12, { spd: 130, e: '✨', size: 3 }); } } }); if (!hit) { sfx('tap'); combo = 0; } },
    move(p) { nx = p.x; ny = p.y; } });
  function end() { if (over) return; over = true; K.after(() => fin(clamp(caught / Math.max(1, spawned) * 95, 0, 100), ['🦋 ' + caught + '/' + spawned, '⭐ ' + pts]), 500); }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; sp -= dt; net = Math.max(0, net - dt); fx.update(dt);
    if (sp <= 0 && left > 1.5) { sp = clamp(.8 - d * .25, .35, .9); spawn(); }
    cr.forEach(f => { if (f.dead) return; const dx = f.x - nx, dy = f.y - ny, dd = Math.hypot(dx, dy); if (dd < 110) { f.vx += dx / dd * 260 * dt; f.vy += dy / dd * 260 * dt; } f.vx += Math.sin(t * 2 + f.ph) * 60 * dt; f.vy += Math.cos(t * 2.4 + f.ph) * 60 * dt; const s = Math.hypot(f.vx, f.vy), mx = 120 + d * 80; if (s > mx) { f.vx *= mx / s; f.vy *= mx / s; } f.x += f.vx * dt; f.y += f.vy * dt; if (f.y < 60 || f.y > 410) f.vy *= -1; if (f.x < -40 || f.x > W + 40) f.out = true; });
    cr = cr.filter(f => !f.dead && !f.out); if (left <= 0) end();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, th.sky); cx.fillStyle = th.ground; cx.fillRect(0, 380, W, 100); for (let i = 0; i < 10; i++) GK.draw(cx, ['🌼', '🌷', '🌺'][i % 3], 20 + i * 36, 420 + (i % 2) * 14, 24, 0, false, .9); GK.draw(cx, '🌳', 40, 320, 80); GK.draw(cx, '🌳', 330, 330, 80);
    cr.forEach(f => GK.draw(cx, f.e, f.x, f.y, f.gold ? 46 : 40, Math.sin(t * 12 + f.ph) * .25, f.vx < 0));
    if (net > 0) { cx.save(); cx.translate(nx, ny); cx.rotate(-.4 + net * 3); GK.draw(cx, '🥅', 0, 0, 60); cx.restore(); } else GK.draw(cx, '🥅', nx, ny, 48, 0, false, .5);
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), '⭐ ' + pts + (combo > 2 ? ' 🔥' + combo : ''), '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '👆 🥅');
  return () => K.stop();
};

/* =====================================================================
   BUBBLES — pop rising bubbles, golden ones, avoid urchins
   ===================================================================== */
GAMES.bubbles = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, TT = cfg.secs || 28;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const bad = cfg.bad || '🪨', inner = cfg.inner || ['🧼', '⭐', '🐠', '🍬'];
  let bs = [], left = TT, sp = .3, pts = 0, popped = 0, spawned = 0, lives = 3, t = 0, over = false, combo = 0;
  GK.input(K, c, { down(p) { let hit = false; bs.forEach(b => { if (!b.dead && Math.hypot(b.x - p.x, b.y - p.y) < b.r + 8) { hit = true; b.dead = true; if (b.bad) { lives--; combo = 0; sfx('bad'); fx.shake(.4); fx.text('💥', b.x, b.y, '#fff', 28); if (lives <= 0) end(); } else { popped++; combo++; const add = b.gold ? 30 : 10; pts += add; sfx('pop'); fx.text('+' + add, b.x, b.y, '#fde047', 20); fx.burst(b.x, b.y, 12, { spd: 120, col: '#bae6fd', life: .5 }); } } }); if (!hit) combo = 0; } });
  function end() { if (over) return; over = true; K.after(() => fin(clamp(popped / Math.max(1, spawned) * 95, 0, 100), ['🫧 ' + popped + '/' + spawned]), 500); }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; sp -= dt; fx.update(dt);
    if (sp <= 0 && left > 1.5) { sp = clamp(.55 - d * .2, .22, .6); const r = Math.random(), isBad = r < .16 + d * .08, gold = !isBad && r > .93; if (!isBad) spawned++; bs.push({ x: rnd(36, W - 36), y: H + 40, r: rnd(24, 38), v: rnd(60, 110) + d * 60, ph: rnd(0, 6), bad: isBad, gold, e: isBad ? bad : gold ? '🌟' : pick(inner) }); }
    bs.forEach(b => { b.y -= b.v * dt; b.x += Math.sin(t * 2 + b.ph) * 22 * dt; if (b.y < -50 && !b.dead) { b.dead = true; if (!b.bad) combo = 0; } }); bs = bs.filter(b => !b.dead);
    if (left <= 0) end();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, ['#7dd3fc', '#e0f2fe', '#fdf2f8']); for (let i = 0; i < 6; i++) { cx.fillStyle = 'rgba(255,255,255,.35)'; cx.beginPath(); cx.arc((i * 71 + t * 6) % 360, 90 + (i * 53) % 340, 6 + i, 0, 7); cx.fill(); }
    bs.forEach(b => { cx.fillStyle = b.bad ? 'rgba(248,113,113,.28)' : b.gold ? 'rgba(253,224,71,.4)' : 'rgba(186,230,253,.45)'; cx.strokeStyle = b.bad ? 'rgba(239,68,68,.7)' : 'rgba(255,255,255,.85)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(b.x, b.y, b.r, 0, 7); cx.fill(); cx.stroke(); cx.fillStyle = 'rgba(255,255,255,.7)'; cx.beginPath(); cx.arc(b.x - b.r * .4, b.y - b.r * .4, b.r * .2, 0, 7); cx.fill(); GK.draw(cx, b.e, b.x, b.y, b.r * 1.1); });
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), '⭐ ' + pts + (combo > 3 ? ' 🔥' + combo : ''), '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '👆 🫧');
  return () => K.stop();
};

/* =====================================================================
   OSU — tap shrinking rings in time (pecking seeds, cheering, flicks)
   ===================================================================== */
GAMES.osu = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, N = cfg.n || 26, th = TH(cfg.theme), e0 = cfg.icon || '🌽';
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let notes = [], t = 0, idx = 0, combo = 0, best = 0, pts = 0, miss = 0, over = false, nextT = .8, perf = 0, good = 0; const AP = 1.05 - d * .3;
  GK.input(K, c, { down(p) { let hitN = null, bd = 1e9; notes.forEach(n => { if (!n.done) { const dd = Math.hypot(n.x - p.x, n.y - p.y); if (dd < 50 && n.t - t < AP * .9 && dd < bd) { bd = dd; hitN = n; } } });
    if (!hitN) { sfx('tap'); return; } const e = Math.abs(hitN.t - t); hitN.done = true;
    if (e < .09) { perf++; combo++; pts += 100 + combo * 5; fx.text(ui('perfect'), hitN.x, hitN.y - 40, '#fde047', 20); sfx('win'); fx.burst(hitN.x, hitN.y, 14, { spd: 130, e: e0, size: 3 }); } else if (e < .2) { good++; combo++; pts += 60; fx.text(ui('good'), hitN.x, hitN.y - 40, '#fff', 18); sfx('ok'); fx.burst(hitN.x, hitN.y, 8, { spd: 100, col: '#fff' }); } else { combo = 0; miss++; fx.text(ui('miss'), hitN.x, hitN.y - 40, '#f87171', 18); sfx('bad'); } best = Math.max(best, combo); } });
  function end() { if (over) return; over = true; K.after(() => fin(clamp((perf * 1 + good * .6) / N * 100, 0, 100), ['🎯 ' + perf + ' / ' + good + ' / ' + miss, '🔥 ' + best]), 600); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt);
    if (idx < N && t > nextT - AP) { idx++; const prev = notes[notes.length - 1]; const x = rnd(50, W - 50), y = rnd(100, H - 60); notes.push({ x, y, t: nextT, done: false }); nextT += clamp(.7 - d * .25, .34, .75) + rnd(0, .18); }
    notes.forEach(n => { if (!n.done && t > n.t + .2) { n.done = true; combo = 0; miss++; fx.text('✗', n.x, n.y, '#f87171', 22); sfx('bad'); } });
    notes = notes.filter(n => !n.done || t < n.t + .3);
    if (idx >= N && notes.every(n => n.done)) end();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, th.sky); cx.fillStyle = th.ground; cx.fillRect(0, 380, W, 80);
    notes.slice().reverse().forEach(n => { if (n.done) return; const u = clamp((n.t - t) / AP, 0, 1.2), a = clamp(1 - u + .2, .2, 1); cx.globalAlpha = a; GK.draw(cx, e0, n.x, n.y, 50); cx.strokeStyle = '#fde047'; cx.lineWidth = 4; cx.beginPath(); cx.arc(n.x, n.y, 26 + u * 46, 0, 7); cx.stroke(); cx.strokeStyle = 'rgba(255,255,255,.8)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(n.x, n.y, 28, 0, 7); cx.stroke(); cx.globalAlpha = 1; });
    fx.draw(cx); fx.end(cx);
    hud.set('🎯 ' + Math.min(idx, N) + '/' + N, '⭐ ' + pts + (combo > 3 ? ' 🔥' + combo : ''), '😬 ' + miss);
  });
  GK.count(c.wrap, K, () => { }, '👆 ⭕');
  return () => K.stop();
};

/* =====================================================================
   SPOTLIGHT — hit your mark: keep the actor inside the moving spotlight
   ===================================================================== */
GAMES.spotlight = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, TT = cfg.secs || 28;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const me = cfg.me || '🐧'; let a = { x: 180, y: 330 }, tx = 180, ty = 330, s = { x: 180, y: 250, ph: rnd(0, 6) }, inside = 0, left = TT, t = 0, over = false, marks = 0, mk = null, mt = 0;
  GK.input(K, c, { down(p) { tx = p.x; ty = clamp(p.y, 150, 420); }, move(p, e, down) { tx = p.x; ty = clamp(p.y, 150, 420); } });
  function end() { if (over) return; over = true; K.after(() => fin(clamp(inside / TT * 100 * 1.15 + marks * 3, 0, 100), ['🔦 ' + Math.round(inside / TT * 100) + '%', '⭐ ' + marks]), 500); }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; fx.update(dt); a.x += clamp(tx - a.x, -230 * dt, 230 * dt); a.y += clamp(ty - a.y, -230 * dt, 230 * dt);
    const sp = .8 + d * 1.1; s.x = 180 + Math.sin(t * sp + s.ph) * 120 + Math.sin(t * sp * 2.3) * 36; s.y = 280 + Math.cos(t * sp * 1.2) * 80; const r = 62 - d * 10;
    const on = Math.hypot(a.x - s.x, a.y - s.y) < r; if (on) { inside += dt; if (Math.random() < .2) fx.burst(a.x, a.y - 30, 1, { spd: 40, life: .4, size: 2, col: '#fde047', g: -60 }); }
    mt -= dt; if (!mk && mt <= 0 && left > 4) { mk = { x: rnd(60, 300), y: rnd(200, 400), life: 3 }; } if (mk) { mk.life -= dt; if (Math.hypot(a.x - mk.x, a.y - mk.y) < 24) { marks++; sfx('win'); fx.text('+⭐', mk.x, mk.y - 20, '#fde047', 24); fx.burst(mk.x, mk.y, 16, { spd: 150, e: '⭐', size: 3 }); mk = null; mt = rnd(1.5, 3); } else if (mk.life <= 0) { mk = null; mt = 1.5; } }
    if (left <= 0) end();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, ['#0f172a', '#1e293b']); cx.fillStyle = '#7f1d1d'; cx.fillRect(0, 60, 40, 330); cx.fillRect(320, 60, 40, 330); cx.fillStyle = '#92400e'; cx.fillRect(0, 380, W, 80); cx.fillStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 9; i++) cx.fillRect(i * 40, 380, 20, 80);
    const g = cx.createRadialGradient(s.x, s.y, 8, s.x, s.y, r * 1.3); g.addColorStop(0, on ? 'rgba(253,224,71,.65)' : 'rgba(253,244,200,.5)'); g.addColorStop(1, 'rgba(253,244,200,0)'); cx.fillStyle = g; cx.beginPath(); cx.moveTo(s.x - 20, 0); cx.lineTo(s.x + 20, 0); cx.lineTo(s.x + r * 1.3, s.y + 40); cx.lineTo(s.x - r * 1.3, s.y + 40); cx.fill(); cx.beginPath(); cx.arc(s.x, s.y, r * 1.3, 0, 7); cx.fill(); cx.strokeStyle = on ? '#fde047' : '#fff'; cx.lineWidth = 3; cx.beginPath(); cx.arc(s.x, s.y, r, 0, 7); cx.stroke();
    if (mk) { cx.strokeStyle = '#34d399'; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(mk.x - 16, mk.y - 16); cx.lineTo(mk.x + 16, mk.y + 16); cx.moveTo(mk.x + 16, mk.y - 16); cx.lineTo(mk.x - 16, mk.y + 16); cx.stroke(); }
    GK.shadow(cx, a.x, a.y + 26, 28, .35); GK.draw(cx, me, a.x, a.y, 66, Math.sin(t * 8) * .06); GK.bar(cx, 40, 20, 280, 10, inside / TT, '#fde047');
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), '🔦 ' + Math.round(inside / Math.max(.1, TT - left) * 100) + '%', '⭐ ' + marks);
  });
  GK.count(c.wrap, K, () => { }, '👆 🔦');
  return () => K.stop();
};

/* =====================================================================
   POUR — hold to pour, release at the line, don't overflow
   ===================================================================== */
GAMES.pour = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 440, N = cfg.bowls || 5;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const bottle = cfg.bottle || '🥣', fill = cfg.fill || '#fbbf24', bowl = cfg.bowl || '🥣';
  let n = 0, lvl = 0, line = .7, pouring = false, state = 'go', total = 0, t = 0, over = false, ok = 0, flow = 0;
  function newBowl() { n++; if (n > N) return end(); lvl = 0; line = rnd(.45, .85); state = 'go'; }
  function stop() { if (!pouring || state !== 'go') return; pouring = false; state = 'done'; const e = lvl - line; let sc; if (lvl > 1) { sc = 0; sfx('bad'); fx.text('💦', 180, 200, '#fff', 34); } else if (Math.abs(e) < .03) { sc = 100; ok++; sfx('win'); fx.text(ui('perfect'), 180, 180, '#fde047', 28); fx.burst(180, 240, 22, { spd: 170 }); } else if (Math.abs(e) < .1) { sc = 70 - Math.abs(e) * 200; ok++; sfx('ok'); fx.text(ui('good'), 180, 180, '#fff', 24); } else { sc = Math.max(10, 50 - Math.abs(e) * 150); sfx('bad'); fx.text(e < 0 ? '👇' : '👆', 180, 180, '#fff', 30); } total += sc; K.after(newBowl, 900); }
  GK.input(K, c, { down() { if (state === 'go') { pouring = true; flow = 0; } }, up() { stop(); } }); GK.keys(K, code => { if (code === 'Space') { if (state === 'go') pouring = true; } }); K.on(document, 'keyup', e => { if (e.code === 'Space') stop(); });
  function end() { if (over) return; over = true; K.after(() => fin(clamp(total / N, 0, 100), ['🥣 ' + ok + '/' + N]), 500); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt);
    if (pouring) { flow = Math.min(1, flow + dt * 2.5); lvl += flow * dt * (.4 + d * .25 + n * .03); if (lvl > 1.12) { stop(); } }
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, ['#fef3c7', '#fde68a']); cx.fillStyle = '#b45309'; cx.fillRect(0, 380, W, 60);
    GK.shadow(cx, 180, 392, 90, .25); cx.save(); cx.translate(180, 396); cx.fillStyle = '#e5e7eb'; cx.beginPath(); cx.moveTo(-84, -150); cx.lineTo(84, -150); cx.lineTo(60, 0); cx.lineTo(-60, 0); cx.closePath(); cx.fill(); cx.strokeStyle = '#9ca3af'; cx.lineWidth = 4; cx.stroke();
    cx.beginPath(); cx.moveTo(-82 + 20 * (1 - lvl * .15), -150 * Math.min(1, lvl)); cx.save(); cx.clip(); cx.restore(); const fh = 146 * Math.min(1.1, lvl); cx.fillStyle = fill; cx.beginPath(); cx.moveTo(-60 - 22 * Math.min(1, lvl), -fh); cx.lineTo(60 + 22 * Math.min(1, lvl), -fh); cx.lineTo(58, -2); cx.lineTo(-58, -2); cx.fill();
    const ly = -146 * line; cx.strokeStyle = '#ef4444'; cx.lineWidth = 4; cx.setLineDash([10, 6]); cx.beginPath(); cx.moveTo(-100, ly); cx.lineTo(100, ly); cx.stroke(); cx.setLineDash([]); cx.restore();
    cx.save(); cx.translate(190, 90); cx.rotate(pouring ? 2.2 : 0); GK.draw(cx, '🥛', 0, 0, 90); cx.restore();
    if (pouring) { cx.strokeStyle = fill; cx.lineWidth = 8 * flow; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(196, 170); cx.lineTo(180, 396 - 146 * Math.min(lvl, 1.05)); cx.stroke(); }
    fx.draw(cx); fx.end(cx);
    hud.set('🥣 ' + Math.min(n, N) + '/' + N, '⭐ ' + Math.round(total / Math.max(1, n - (state === 'done' ? 0 : 1))), '👆 ⏳');
  });
  GK.count(c.wrap, K, newBowl, '👆 ' + ui('gm_hold'));
  return () => K.stop();
};

/* =====================================================================
   PIVOT — get the sofa around the corners: rotate at exactly the right time
   ===================================================================== */
GAMES.pivot = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, N = cfg.corners || 5;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  // staircase path: alternating right/down segments
  const pts = [{ x: 40, y: 60 }]; for (let i = 0; i < N; i++) { const l = pts[pts.length - 1]; pts.push({ x: l.x + (i % 2 === 0 ? 110 : 0), y: l.y + (i % 2 === 0 ? 0 : 80) }); } pts.push({ x: pts[pts.length - 1].x + 80, y: pts[pts.length - 1].y });
  const segs = []; for (let i = 0; i < pts.length - 1; i++) segs.push({ a: pts[i], b: pts[i + 1], ang: pts[i + 1].x === pts[i].x ? 90 : 0 });
  let segBumps = 0, si = 0, u = 0, ang = 0, tang = 0, speed = 55 + d * 35, bumps = 0, clean = 0, t = 0, over = false, cd = 0, ok = true, pause = 0, scale = 1;
  function pivot() { if (cd > 0 || over) return; tang = tang === 0 ? 90 : 0; cd = .2; sfx('pop'); fx.text('PIVOT!', W / 2, 60, '#fde047', 28); }
  GK.input(K, c, { down() { pivot(); } }); GK.keys(K, code => { if (code === 'Space') pivot(); });
  const sof = () => { const s = segs[si], l = Math.hypot(s.b.x - s.a.x, s.b.y - s.a.y), x = GK.lerp(s.a.x, s.b.x, u / l), y = GK.lerp(s.a.y, s.b.y, u / l); return { x, y, l }; };
  function end() { if (over) return; over = true; sfx('win'); K.after(() => fin(clamp(clean / N * 80 + (N - bumps) / N * 20, 0, 100), ['🛋️ ' + clean + '/' + N, '💥 ' + bumps]), 700); }
  K.loop(dt => {
    if (over) return; t += dt; cd -= dt; fx.update(dt); if (t > 80) { end(); return; } ang += clamp(tang - ang, -420 * dt, 420 * dt); pause = Math.max(0, pause - dt);
    const s = segs[si], p = sof(), need = s.ang, mis = Math.abs(((ang - need) % 180 + 180) % 180), off = Math.min(mis, 180 - mis);
    const inCorner = p.l - u < 26 && si < segs.length - 1; const nextNeed = segs[Math.min(si + 1, segs.length - 1)].ang; const offN = Math.min(Math.abs(((ang - nextNeed) % 180 + 180) % 180), 180 - Math.abs(((ang - nextNeed) % 180 + 180) % 180));
    let blocked = false;
    if (off > 28 && u > 6 && u < p.l - 10) { blocked = true; } if (inCorner && offN > 28) blocked = true;
    if (blocked) { if (pause <= 0) { bumps++; segBumps++; pause = .5; sfx('bad'); fx.shake(.4); fx.text('💥', p.x, p.y - 20, '#fff', 26); u = Math.max(0, u - 14); if (si > 0 && u < 2) { } } } else if (pause <= 0) u += speed * dt * (1 - Math.min(.5, off / 120));
    if (u >= p.l) { if (offN <= 28 || si >= segs.length - 1) { if (segBumps === 0) clean++; segBumps = 0; if (si < segs.length - 1) { sfx('ok'); fx.text('✓', p.x, p.y - 20, '#4ade80', 24); } si++; u = 0; if (si >= segs.length) { end(); } } else { u = p.l - 8; pause = .4; bumps++; segBumps++; sfx('bad'); } }
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, ['#fde68a', '#fcd34d']); cx.fillStyle = '#7c2d12'; cx.fillRect(0, 0, W, H); cx.fillStyle = '#9a3412'; for (let i = 0; i < 12; i++) cx.fillRect(0, i * 40, W, 3);
    cx.lineCap = 'butt'; cx.lineJoin = 'miter'; cx.strokeStyle = '#fef3c7'; cx.lineWidth = 56; cx.beginPath(); pts.forEach((q, i) => i ? cx.lineTo(q.x, q.y + 100) : cx.moveTo(q.x, q.y + 100)); cx.stroke(); cx.strokeStyle = '#d6b98c'; cx.lineWidth = 50; cx.beginPath(); pts.forEach((q, i) => i ? cx.lineTo(q.x, q.y + 100) : cx.moveTo(q.x, q.y + 100)); cx.stroke();
    pts.forEach((q, i) => { if (i > 0 && i < pts.length - 1) { cx.fillStyle = 'rgba(239,68,68,.25)'; cx.beginPath(); cx.arc(q.x, q.y + 100, 30, 0, 7); cx.fill(); } });
    const sp2 = sof(); cx.save(); cx.translate(sp2.x, sp2.y + 100); cx.rotate(ang * Math.PI / 180); cx.fillStyle = '#ea580c'; GK.rr(cx, -36, -14, 72, 28, 8); cx.fill(); cx.fillStyle = '#c2410c'; GK.rr(cx, -36, -14, 72, 8, 4); cx.fill(); cx.fillStyle = '#fb923c'; GK.rr(cx, -30, -4, 60, 14, 5); cx.fill(); cx.restore();
    GK.txt(cx, '🛋️', W / 2 - 100, 28, 30); const bw = 200; cx.fillStyle = 'rgba(0,0,0,.4)'; GK.rr(cx, 60, 360, 240, 70, 20); cx.fill(); GK.txt(cx, 'PIVOT!', 180, 395, 36, '#fde047');
    fx.draw(cx); fx.end(cx);
    hud.set('🛋️ ' + Math.min(si, segs.length - 1) + '/' + (segs.length - 1), '✓ ' + clean, '💥 ' + bumps);
  });
  GK.count(c.wrap, K, () => { }, '👆 PIVOT!');
  return () => K.stop();
};
