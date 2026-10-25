'use strict';
/* =====================================================================
   FULL GAME 1: FOOSBALL — real table, 8 rods, ball physics, AI opponent
   ===================================================================== */
GAMES.foosball = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const FX0 = 24, FX1 = 336, FY0 = 40, FY1 = 440, GX0 = 132, GX1 = 228, BR = 8, WIN = cfg.goals || 3, TT = cfg.secs || 80;
  const defs = [['A', 1], ['A', 2], ['P', 3], ['A', 5], ['P', 5], ['A', 3], ['P', 2], ['P', 1]];
  const rods = defs.map((df, i) => {
    const n = df[1], sp = n === 1 ? 0 : n === 2 ? 112 : n === 3 ? 100 : 64, mid = 180;
    const lo = FX0 + 15 - (mid - (n - 1) / 2 * sp), hi = FX1 - 15 - (mid + (n - 1) / 2 * sp);
    return { i, y: FY0 + 34 + i * ((FY1 - FY0 - 68) / 7), own: df[0], n, sp, mid, off: 0, lastOff: 0, vx: 0, kt: 0, dir: df[0] === 'P' ? -1 : 1, lo: n === 1 ? -88 : lo, hi: n === 1 ? 88 : hi, cd: 0 };
  });
  const P = rods.filter(r => r.own === 'P'), A = rods.filter(r => r.own === 'A');
  let sel = 2, ball = { x: 180, y: 240, vx: 0, vy: 0 }, score = { p: 0, a: 0 }, left = TT, state = 'count', rest = 0, t = 0, over = false, still = 0;
  const KT = .17;
  const manX = (r, k) => r.mid + r.off + (k - (r.n - 1) / 2) * r.sp;
  const manY = r => r.y + r.dir * Math.sin(Math.PI * clamp(1 - r.kt / KT, 0, 1)) * (r.kt > 0 ? 17 : 0);
  function kick(r) { if (r.kt <= 0 && state === 'play') { r.kt = KT; sfx('pop'); } }
  const keys = GK.keys(K, code => { if (code === 'KeyW' || code === 'ArrowUp') sel = Math.max(0, sel - 1); if (code === 'KeyS' || code === 'ArrowDown') sel = Math.min(3, sel + 1); if (code === 'Space') kick(P[sel]); });
  let drag = null;
  GK.input(K, c, {
    down(p) { let b = 0, bd = 1e9; P.forEach((r, i) => { const dd = Math.abs(r.y - p.y); if (dd < bd) { bd = dd; b = i; } }); sel = b; drag = { x: p.x, off: P[b].off, t: performance.now(), moved: 0 }; },
    move(p, e, down) { if (!down || !drag) return; const r = P[sel]; drag.moved = Math.max(drag.moved, Math.abs(p.x - drag.x)); r.off = clamp(drag.off + (p.x - drag.x) * 1.25, r.lo, r.hi); },
    up() { if (drag && performance.now() - drag.t < 240 && drag.moved < 12) kick(P[sel]); drag = null; }
  });
  function resetBall(dirY) { ball = { x: 180 + rnd(-40, 40), y: 240, vx: rnd(-60, 60), vy: dirY * 190 }; still = 0; }
  function goal(who) {
    state = 'goal'; rest = 1.4; score[who]++; sfx(who === 'p' ? 'win' : 'bad'); fx.shake(.5);
    const gy = who === 'p' ? FY0 : FY1; fx.burst(180, gy, 36, { spd: 240, e: who === 'p' ? '⚽' : null, size: 5 });
    GK.flash(c.wrap, K, who === 'p' ? ui('gm_goal') : '😬', 1100, who === 'p' ? 'good' : 'bad');
    if (score.p >= WIN || score.a >= WIN) K.after(finish, 1200);
  }
  function finish() { if (over) return; over = true; const diff = score.p - score.a; const sc = clamp(50 + diff * 17 + (diff > 0 ? 12 : 0), 6, 100); fin(sc, [score.p + ' - ' + score.a]); }
  function step(dt) {
    t += dt;
    rods.forEach(r => { r.vx = (r.off - r.lastOff) / Math.max(dt, .001); r.lastOff = r.off; if (r.kt > 0) r.kt = Math.max(0, r.kt - dt); r.cd = Math.max(0, r.cd - dt); });
    // keyboard move for selected rod
    const sr = P[sel]; if (keys.KeyA || keys.ArrowLeft) sr.off = clamp(sr.off - 240 * dt, sr.lo, sr.hi); if (keys.KeyD || keys.ArrowRight) sr.off = clamp(sr.off + 240 * dt, sr.lo, sr.hi);
    // AI
    const spd = 95 + d * 250;
    A.forEach(r => {
      let best = 0, bd = 1e9; for (let k = 0; k < r.n; k++) { const dd = Math.abs(manX(r, k) - ball.x); if (dd < bd) { bd = dd; best = k; } }
      const near = Math.abs(ball.y - r.y) < 135, ahead = r.dir > 0 ? ball.y > r.y - 30 : ball.y < r.y + 30;
      let want = near || ahead ? ball.x + Math.sin(t * 1.9 + r.i) * 16 * (1.1 - d) : 180;
      let tOff = clamp(want - (r.mid + (best - (r.n - 1) / 2) * r.sp), r.lo, r.hi); if (!near && !ahead) tOff = clamp(0, r.lo, r.hi);
      const dx = tOff - r.off; r.off += clamp(dx, -spd * dt, spd * dt);
      if (state === 'play' && r.cd <= 0 && Math.abs(ball.y - (r.y + r.dir * 10)) < 22 && Math.abs(manX(r, best) - ball.x) < 15 && Math.random() < .05 + d * .12) { kick(r); r.cd = .45 + (1 - d) * .5; }
    });
    // player assist auto-kick
    if (state === 'play') P.forEach(r => { if (r.kt > 0 || r.cd > 0) return; for (let k = 0; k < r.n; k++) { if (Math.hypot(manX(r, k) - ball.x, manY(r) - ball.y) < 24 && Math.abs(ball.y - r.y) < 16 && Math.random() < (.18 + (1 - d) * .25)) { kick(r); r.cd = .5; break; } } });
    if (state === 'goal') { rest -= dt; if (rest <= 0 && !over) { state = 'play'; resetBall(score.p > score.a ? 1 : -1); } return; }
    if (state !== 'play') return;
    left -= dt; if (left <= 0) { state = 'end'; finish(); return; }
    const sub = 3, h = dt / sub;
    for (let s = 0; s < sub; s++) {
      ball.x += ball.vx * h; ball.y += ball.vy * h; const sp0 = Math.hypot(ball.vx, ball.vy), fr = Math.pow(.78, h); ball.vx *= fr; ball.vy *= fr;
      if (ball.x < FX0 + BR) { ball.x = FX0 + BR; ball.vx = Math.abs(ball.vx) * .85; } if (ball.x > FX1 - BR) { ball.x = FX1 - BR; ball.vx = -Math.abs(ball.vx) * .85; }
      if (ball.y < FY0 + BR) { if (ball.x > GX0 && ball.x < GX1) { if (ball.y < FY0 - 6) { goal('p'); return; } } else { ball.y = FY0 + BR; ball.vy = Math.abs(ball.vy) * .85; } }
      if (ball.y > FY1 - BR) { if (ball.x > GX0 && ball.x < GX1) { if (ball.y > FY1 + 6) { goal('a'); return; } } else { ball.y = FY1 - BR; ball.vy = -Math.abs(ball.vy) * .85; } }
      rods.forEach(r => {
        if (Math.abs(ball.y - r.y) > 40) return; const my = manY(r);
        const kv = r.kt > 0 ? r.dir * 17 * Math.PI / KT * Math.cos(Math.PI * clamp(1 - r.kt / KT, 0, 1)) : 0;
        for (let k = 0; k < r.n; k++) {
          const mx = manX(r, k), dx = ball.x - mx, dy = ball.y - my, dd = Math.hypot(dx, dy), mr = 11 + BR;
          if (dd < mr && dd > .01) {
            const nx = dx / dd, ny = dy / dd; ball.x = mx + nx * mr; ball.y = my + ny * mr;
            const rvx = ball.vx - r.vx, rvy = ball.vy - kv, vn = rvx * nx + rvy * ny;
            if (vn < 0) { ball.vx += -(1 + .62) * vn * nx; ball.vy += -(1 + .62) * vn * ny; }
            if (r.kt > 0 && kv * r.dir > 0) { ball.vy += r.dir * 210; ball.vx += r.vx * .3 + rnd(-30, 30); fx.burst(ball.x, ball.y, 6, { spd: 80, life: .3, size: 3, col: '#fff' }); sfx('pop'); }
            const sp = Math.hypot(ball.vx, ball.vy); if (sp > 640) { ball.vx *= 640 / sp; ball.vy *= 640 / sp; }
          }
        }
      });
    }
    if (Math.hypot(ball.vx, ball.vy) < 14) { still += dt; if (still > 1.6) { ball.vy = (Math.random() < .5 ? 1 : -1) * 110; ball.vx = rnd(-60, 60); still = 0; } } else still = 0;
  }
  function drawMan(r, k) {
    const x = manX(r, k), y = manY(r), col = r.own === 'P' ? ['#3b82f6', '#1d4ed8'] : ['#ef4444', '#b91c1c'];
    GK.shadow(cx, x + 2, y + 8, 12, .25);
    cx.fillStyle = '#e5e7eb'; cx.fillRect(x - 3, y + (r.dir > 0 ? 8 : -17), 6, 9);
    const g = cx.createLinearGradient(x - 9, 0, x + 9, 0); g.addColorStop(0, col[0]); g.addColorStop(1, col[1]); cx.fillStyle = g; GK.rr(cx, x - 9, y - 11, 18, 22, 6); cx.fill();
    cx.fillStyle = '#fde68a'; cx.beginPath(); cx.arc(x, y, 5, 0, 7); cx.fill(); cx.fillStyle = 'rgba(0,0,0,.15)'; cx.fillRect(x - 9, y + 3, 18, 3);
  }
  function draw() {
    fx.begin(cx);
    GK.grad(cx, W, H, ['#78350f', '#a16207', '#78350f']);
    GK.rr(cx, 8, 22, W - 16, H - 44, 16); cx.fillStyle = '#5a2d0c'; cx.fill();
    const g = cx.createLinearGradient(0, FY0, 0, FY1); g.addColorStop(0, '#15803d'); g.addColorStop(.5, '#22a24f'); g.addColorStop(1, '#15803d'); cx.fillStyle = g; cx.fillRect(FX0, FY0, FX1 - FX0, FY1 - FY0);
    for (let i = 0; i < 8; i++) { cx.fillStyle = i % 2 ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.05)'; cx.fillRect(FX0, FY0 + i * 50, FX1 - FX0, 50); }
    cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = 2; cx.strokeRect(FX0, FY0, FX1 - FX0, FY1 - FY0); cx.beginPath(); cx.moveTo(FX0, 240); cx.lineTo(FX1, 240); cx.stroke(); cx.beginPath(); cx.arc(180, 240, 34, 0, 7); cx.stroke();
    cx.strokeRect(GX0 - 14, FY0, GX1 - GX0 + 28, 42); cx.strokeRect(GX0 - 14, FY1 - 42, GX1 - GX0 + 28, 42);
    [[FY0 - 22], [FY1 + 2]].forEach(a => { cx.fillStyle = 'rgba(255,255,255,.18)'; cx.fillRect(GX0, a[0], GX1 - GX0, 22); cx.strokeStyle = 'rgba(255,255,255,.4)'; cx.lineWidth = 1; for (let x = GX0; x <= GX1; x += 8) { cx.beginPath(); cx.moveTo(x, a[0]); cx.lineTo(x, a[0] + 22); cx.stroke(); } });
    cx.fillStyle = '#fff'; cx.fillRect(GX0 - 3, FY0 - 22, 4, 26); cx.fillRect(GX1 - 1, FY0 - 22, 4, 26); cx.fillRect(GX0 - 3, FY1 - 4, 4, 26); cx.fillRect(GX1 - 1, FY1 - 4, 4, 26);
    rods.forEach(r => {
      const sd = r.own === 'P';
      cx.fillStyle = 'rgba(0,0,0,.28)'; cx.fillRect(FX0 - 14, r.y + 3, FX1 - FX0 + 28, 4);
      const rg = cx.createLinearGradient(0, r.y - 3, 0, r.y + 3); rg.addColorStop(0, '#f3f4f6'); rg.addColorStop(1, '#6b7280'); cx.fillStyle = rg; cx.fillRect(FX0 - 14, r.y - 3, FX1 - FX0 + 28, 6);
      cx.fillStyle = sd ? '#1e3a8a' : '#7f1d1d'; GK.rr(cx, sd ? FX1 + 4 : FX0 - 16, r.y - 7, 12, 14, 4); cx.fill();
      if (sd && r === P[sel]) { cx.strokeStyle = '#fde047'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(FX0 - 14, r.y + 14); cx.lineTo(FX1 + 14, r.y + 14); cx.stroke(); }
      for (let k = 0; k < r.n; k++) drawMan(r, k);
    });
    GK.shadow(cx, ball.x + 3, ball.y + 6, 8, .3); GK.draw(cx, '⚽', ball.x, ball.y, 19, ball.x * .1 + ball.y * .1);
    fx.draw(cx); fx.end(cx);
    if (state === 'goal' || state === 'play') { }
  }
  K.loop(dt => {
    if (over) return; fx.update(dt); if (state === 'play' || state === 'goal') step(dt);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), '<b style="color:#60a5fa">🔵 ' + score.p + '</b> - <b style="color:#f87171">' + score.a + ' 🔴</b>', '🎯 ' + WIN); draw();
  });
  GK.count(c.wrap, K, () => { state = 'play'; resetBall(1); }, '👆 ↔');
  return () => K.stop();
};

/* =====================================================================
   FULL GAME 2: PENALTY SHOOTOUT — shoot (aim + power) and keep (dive)
   ===================================================================== */
GAMES.penalty = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, N = cfg.kicks || 5;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const GL = 66, GR = 294, GT = 118, GB = 244; // goal frame
  let phase = 'shoot', n = 0, scored = 0, saved = 0, state = 'aim', t = 0, over = false;
  let aim = { x: 180, y: 180 }, power = 0, charging = false, ball = null, keeper = { x: 180, y: 206, dive: 0, tx: 180, ty: 206, rot: 0, t: 0 }, res = '', flightT = 0, shot = null, kick = null, wall = null;
  if (cfg.wall) wall = [150, 180, 210];
  function resetRound() { state = 'aim'; ball = null; shot = null; kick = null; keeper = { x: 180, y: 206, dive: 0, tx: 180, ty: 206, rot: 0, t: 0 }; power = 0; charging = false; res = ''; }
  GK.input(K, c, {
    down(p) {
      if (state === 'aim' && phase === 'shoot') { charging = true; power = 0; aim = { x: clamp(p.x, 40, 320), y: clamp(p.y, 90, 280) }; }
      else if (phase === 'keep') diveTo(p.x < 135 ? -1 : p.x > 225 ? 1 : 0, p.y < 170 ? 1 : 0);
    },
    move(p, e, down) { if (state === 'aim' && phase === 'shoot') aim = { x: clamp(p.x, 40, 320), y: clamp(p.y, 90, 280) }; },
    up() { if (charging && state === 'aim' && phase === 'shoot') shoot(); }
  });
  const keys = GK.keys(K, code => { if (phase === 'keep' && state === 'wait') { if (code === 'ArrowLeft' || code === 'KeyA') diveTo(-1, 0); if (code === 'ArrowRight' || code === 'KeyD') diveTo(1, 0); if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') diveTo(0, 1); } });
  function shoot() {
    charging = false; state = 'fly'; flightT = 0; sfx('pop');
    const p = power, err = Math.abs(p - .72) * 70 * (.5 + d * .7) + 4;
    let tx = aim.x + rnd(-err, err), ty = aim.y + rnd(-err, err);
    if (p > .93) ty -= 70; if (p < .22) { ty = Math.max(ty, 214); }
    shot = { x: tx, y: ty, dur: GK.lerp(1.0, .42, p), p };
    // keeper decides
    const read = .12 + d * .4, side = Math.random() < read ? Math.sign(aim.x - 180) : pick([-1, 0, 1]);
    const hi = Math.random() < (read && aim.y < 170 ? .65 : .35);
    keeper.dive = 1; keeper.t = 0; keeper.tx = 180 + side * pick([60, 80, 100]); keeper.ty = hi ? 168 : 214; if (side === 0) { keeper.tx = 180; keeper.ty = 200; }
    keeper.delay = .08 + (1 - d) * .08; keeper.dur = .38 - d * .08;
  }
  function diveTo(side, hi) {
    if (keeper.dive || phase !== 'keep') return;
    if (state === 'wait') { state = 'fly'; flightT = 0; } else if (!(state === 'fly' && flightT < .28)) return;
    keeper.dive = 1; keeper.t = 0; keeper.delay = 0; keeper.dur = .32; keeper.tx = 180 + side * 84; keeper.ty = hi ? 166 : (side === 0 ? 196 : 214); keeper.mine = true;
  }
  function aiShot() {
    state = 'run'; t = 0; const zone = pick([-1, 0, 1, -1, 1]), hi = Math.random() < .45;
    shot = { x: 180 + zone * (zone === 0 ? rnd(-20, 20) : rnd(60, 100)), y: hi ? rnd(135, 165) : rnd(200, 232), dur: .62 - d * .1, p: .8 };
    keeper.tx = 180; keeper.ty = 206;
  }
  function resolve() {
    state = 'done'; let outcome;
    const kx = keeper.x, ky = keeper.y, bx = shot.x, by = shot.y;
    const inside = bx > GL + 6 && bx < GR - 6 && by > GT + 4 && by < GB;
    const blockedWall = phase === 'shoot' && wall && by > 188 && bx > 130 && bx < 230 && shot.p < .8;
    const reach = keeper.mine ? 52 : 46;
    const savedBall = inside && Math.hypot((bx - kx) * .85, by - ky) < reach && (keeper.dive || Math.abs(bx - 180) < 28);
    if (phase === 'shoot') {
      if (blockedWall) { outcome = 'wall'; } else if (!inside) outcome = 'miss'; else if (savedBall) outcome = 'save'; else outcome = 'goal';
      if (outcome === 'goal') { scored++; sfx('win'); fx.burst(bx, by, 30, { spd: 220, e: '⚽', size: 4 }); fx.shake(.45); GK.flash(c.wrap, K, ui('gm_goal'), 900, 'good'); }
      else { sfx('bad'); GK.flash(c.wrap, K, outcome === 'save' ? ui('saved') : outcome === 'wall' ? '🧱' : ui('miss'), 800, 'bad'); }
    } else {
      if (inside && !savedBall) { outcome = 'goal'; sfx('bad'); fx.shake(.4); GK.flash(c.wrap, K, ui('gm_goal'), 800, 'bad'); }
      else { outcome = 'save'; saved++; sfx('win'); GK.flash(c.wrap, K, inside ? ui('saved') : '👍', 800, 'good'); fx.burst(kx, ky, 18, { spd: 160, col: '#fde047' }); }
    }
    ball = { x: shot.x, y: shot.y, s: 16 }; K.after(nextRound, 1250);
  }
  function nextRound() {
    n++;
    if (n >= N && phase === 'shoot') { if (cfg.keep === false) return end(); phase = 'keep'; n = 0; resetRound(); state = 'run'; t = 0; GK.flash(c.wrap, K, '🧤', 900); K.after(aiShot, 900); return; }
    if (n >= N && phase === 'keep') return end();
    resetRound(); if (phase === 'keep') { state = 'run'; t = 0; K.after(aiShot, 700); }
  }
  function end() { if (over) return; over = true; const sc = cfg.keep === false ? scored / N * 100 : scored / N * 58 + saved / N * 42; fin(clamp(sc, 0, 100), ['⚽ ' + scored + '/' + N, '🧤 ' + saved + '/' + N]); }
  function drawKeeper() {
    const k = keeper; const u = k.dive ? clamp((k.t - (k.delay || 0)) / k.dur, 0, 1) : 0, e = GK.ease.out(u);
    k.x = GK.lerp(180, k.tx, e); k.y = GK.lerp(206, k.ty, e); const rot = (k.tx - 180) / 90 * e * 1.2;
    cx.save(); cx.translate(k.x, k.y + 18); cx.rotate(rot); cx.translate(0, -18);
    GK.shadow(cx, 0, 38, 20, .2);
    cx.fillStyle = '#1f2937'; GK.rr(cx, -12, 14, 9, 28, 4); cx.fill(); GK.rr(cx, 3, 14, 9, 28, 4); cx.fill();
    cx.fillStyle = '#fbbf24'; GK.rr(cx, -15, -14, 30, 34, 10); cx.fill();
    cx.strokeStyle = '#fbbf24'; cx.lineWidth = 7; cx.lineCap = 'round'; const up = k.dive ? e : 0; cx.beginPath(); cx.moveTo(-14, -8); cx.lineTo(-32 - up * 6, -10 - up * 20); cx.moveTo(14, -8); cx.lineTo(32 + up * 6, -10 - up * 20); cx.stroke();
    cx.fillStyle = '#34d399'; cx.beginPath(); cx.arc(-33 - up * 6, -11 - up * 20, 7, 0, 7); cx.arc(33 + up * 6, -11 - up * 20, 7, 0, 7); cx.fill();
    cx.fillStyle = '#f5cba7'; cx.beginPath(); cx.arc(0, -24, 10, 0, 7); cx.fill(); cx.fillStyle = '#3b2a1e'; cx.beginPath(); cx.arc(0, -27, 10, Math.PI, 0); cx.fill();
    cx.restore();
  }
  function drawField() {
    const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1e3a8a'); g.addColorStop(.3, '#60a5fa'); g.addColorStop(.31, '#16a34a'); g.addColorStop(1, '#14532d'); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    for (let i = 0; i < 90; i++) { cx.fillStyle = ['#f87171', '#fbbf24', '#fff', '#34d399', '#60a5fa'][i % 5]; cx.globalAlpha = .55; cx.fillRect((i * 37) % W, 30 + ((i * 53) % 70), 5, 8); } cx.globalAlpha = 1;
    for (let i = 0; i < 6; i++) { cx.fillStyle = i % 2 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'; cx.fillRect(0, 250 + i * 38, W, 38); }
    cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(0, 266); cx.lineTo(W, 266); cx.stroke(); cx.beginPath(); cx.arc(180, 410, 4, 0, 7); cx.stroke();
    // net
    cx.fillStyle = 'rgba(0,0,0,.28)'; cx.fillRect(GL, GT, GR - GL, GB - GT); cx.strokeStyle = 'rgba(255,255,255,.35)'; cx.lineWidth = 1; for (let x = GL; x <= GR; x += 12) { cx.beginPath(); cx.moveTo(x, GT); cx.lineTo(x, GB); cx.stroke(); } for (let y = GT; y <= GB; y += 12) { cx.beginPath(); cx.moveTo(GL, y); cx.lineTo(GR, y); cx.stroke(); }
  }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); keeper.t += dt;
    if (state === 'fly') { flightT += dt; const u = clamp(flightT / shot.dur, 0, 1); ball = { x: GK.lerp(180, shot.x, u), y: GK.lerp(410, shot.y, u) - Math.sin(u * Math.PI) * 26, s: GK.lerp(36, 17, u) }; if (u >= 1) resolve(); }
    if (state === 'run') { if (phase === 'keep') { if (t > 1.0 && !shot) { } } }
    if (phase === 'keep' && state === 'run' && shot && t > .45) { state = 'wait'; flightT = 0; ball = { x: 180, y: 410, s: 36 }; K.after(() => { if (state === 'wait') { state = 'fly'; flightT = 0; } }, 260); }
    if (state === 'wait' && phase === 'keep') { /* player has ~0.42s to dive; ball already launched visually */ flightT += dt * .0; }
    if (charging) power = (Math.sin(t * 3.4) + 1) / 2;
    cx.clearRect(0, 0, W, H); fx.begin(cx); drawField();
    if (wall && phase === 'shoot') wall.forEach(x => { GK.draw(cx, '🧍', x, 262, 34); });
    drawKeeper();
    if (ball) { GK.shadow(cx, ball.x, Math.min(430, ball.y + 20), ball.s * .5, .2); GK.draw(cx, '⚽', ball.x, ball.y, ball.s, t * 6); }
    else if (state === 'aim' || state === 'run' || state === 'wait') GK.draw(cx, '⚽', 180, 410, 36);
    if (state === 'aim' && phase === 'shoot') {
      cx.strokeStyle = '#fde047'; cx.lineWidth = 3; cx.beginPath(); cx.arc(aim.x, aim.y, 14, 0, 7); cx.moveTo(aim.x - 20, aim.y); cx.lineTo(aim.x + 20, aim.y); cx.moveTo(aim.x, aim.y - 20); cx.lineTo(aim.x, aim.y + 20); cx.stroke();
      GK.bar(cx, 326, 300, 14, 150, 1, 'rgba(255,255,255,.12)', 'rgba(0,0,0,.4)'); cx.fillStyle = 'rgba(34,197,94,.7)'; cx.fillRect(326, 300 + 150 * (1 - .85), 14, 150 * .3); const py = 300 + 150 * (1 - power); cx.fillStyle = '#fff'; cx.fillRect(322, py - 3, 22, 6);
      GK.txt(cx, '⚡', 333, 288, 18);
    }
    if (phase === 'keep' && (state === 'wait' || state === 'run')) { GK.txt(cx, '⬅️  ⬆️  ➡️', 180, 330, 22); }
    fx.draw(cx); fx.end(cx);
    hud.set(phase === 'shoot' ? '⚽ ' + (n + 1) + '/' + N : '🧤 ' + (n + 1) + '/' + N, '⚽ ' + scored + '   🧤 ' + saved, phase === 'shoot' ? '👆 ' + ui('gm_aim') : '👆 ⬅️⬆️➡️');
  });
  GK.count(c.wrap, K, () => { resetRound(); }, ui('gm_aim'));
  return () => K.stop();
};
