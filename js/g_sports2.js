'use strict';
/* =====================================================================
   HOOPS / THROW — slingshot physics: basketball, fetch, target throws
   ===================================================================== */
GAMES.hoops = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, N = cfg.shots || 10, mode = cfg.mode || 'hoop', G = 900, BR = 14;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const ballE = cfg.ball || '🏀';
  let shotN = 0, pts = 0, streak = 0, ball = null, state = 'wait', start = { x: 60, y: 400 }, drag = null, t = 0, over = false, rim = false, bd = 0, netSwing = 0, restT = 0, hits = 0;
  const hoop = { x: 280, y: 196, r: 28 };
  function hoopY() { return hoop.y + (shotN > 3 && d > .3 ? Math.sin(t * (.8 + d)) * 38 : 0); }
  function targetX() { return 250 + Math.sin(t * (.9 + d * .8)) * 62; }
  function next() { shotN++; if (shotN > N) return end(); start = { x: ri(40, 120), y: ri(380, 420) }; ball = { x: start.x, y: start.y, vx: 0, vy: 0, rot: 0 }; state = 'aim'; rim = false; bd = 0; restT = 0; }
  function end() { if (over) return; over = true; const mx = mode === 'hoop' ? N * 2.5 : N * 3; fin(GK.stars100(pts, 0, mx * .85), ['🎯 ' + hits + '/' + N, '⭐ ' + pts]); }
  function sim(p, steps) {
    const out = []; let x = p.x, y = p.y, vx = p.vx, vy = p.vy; for (let i = 0; i < steps; i++) { vy += G * .035; x += vx * .035; y += vy * .035; out.push([x, y]); } return out;
  }
  const vel = p => { let dx = start.x - p.x, dy = start.y - p.y, m = Math.hypot(dx, dy), k = 5.4; if (m > 150) { dx *= 150 / m; dy *= 150 / m; } return { vx: dx * k, vy: dy * k, m: Math.min(m, 150) }; };
  GK.input(K, c, {
    down(p) { if (state === 'aim') drag = p; },
    move(p, e, down) { if (down && state === 'aim' && drag) drag = p; },
    up(p) { if (state === 'aim' && drag) { const v = vel(p); drag = null; if (v.m < 28) return; ball.vx = v.vx; ball.vy = v.vy; state = 'fly'; sfx('pop'); } }
  });
  function score(swish) {
    hits++; streak++; const add = (swish ? 3 : 2) + (streak >= 3 ? 1 : 0); pts += add; netSwing = 1; sfx('win'); state = 'score'; restT = .9;
    fx.text('+' + add + (swish ? ' 🔥' : ''), hoop.x, hoopY() - 40, '#fde047', 26); fx.burst(hoop.x, hoopY() + 10, 22, { spd: 190, e: mode === 'hoop' ? null : '⭐', size: 4 });
  }
  function step(dt) {
    const sub = 4, h = dt / sub, hy = hoopY();
    for (let s = 0; s < sub; s++) {
      const py = ball.y; ball.vy += G * h; ball.x += ball.vx * h; ball.y += ball.vy * h; ball.rot += ball.vx * h * .02; bd += h;
      if (mode === 'hoop') {
        if (ball.x > 318 - BR && ball.y > hy - 84 && ball.y < hy + 8 && ball.vx > 0) { ball.x = 318 - BR; ball.vx *= -.55; rim = true; sfx('tap'); }
        [[hoop.x - hoop.r, hy], [hoop.x + hoop.r, hy]].forEach(r => { const dx = ball.x - r[0], dy = ball.y - r[1], dd = Math.hypot(dx, dy); if (dd < BR + 4 && dd > .1) { const nx = dx / dd, ny = dy / dd; ball.x = r[0] + nx * (BR + 4); ball.y = r[1] + ny * (BR + 4); const vn = ball.vx * nx + ball.vy * ny; if (vn < 0) { ball.vx -= 1.55 * vn * nx; ball.vy -= 1.55 * vn * ny; rim = true; sfx('tap'); netSwing = .5; } } });
        if (state === 'fly' && py < hy && ball.y >= hy && ball.vy > 0 && Math.abs(ball.x - hoop.x) < hoop.r - 3) score(!rim);
      } else {
        const tx = targetX(), ty = 418; if (state === 'fly' && ball.vy > 0 && Math.hypot(ball.x - tx, ball.y - ty) < 40) { hits++; streak++; const add = Math.hypot(ball.x - tx, ball.y - ty) < 18 ? 4 : 3; pts += add; state = 'score'; restT = .8; sfx('win'); fx.text('+' + add, tx, ty - 50, '#fde047', 26); fx.burst(tx, ty - 20, 24, { spd: 200, e: '⭐', size: 4 }); }
      }
      if (ball.y > 448) { ball.y = 448; ball.vy *= -.4; ball.vx *= .7; if (state === 'fly') { state = 'miss'; restT = 1; streak = 0; } }
      if (ball.x < -30 || ball.x > W + 30) { if (state === 'fly') { state = 'miss'; restT = .6; streak = 0; } }
    }
  }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); netSwing = Math.max(0, netSwing - dt * 1.6);
    if (state === 'fly' || state === 'miss' || state === 'score') { if (ball) step(dt); if (state !== 'fly') { restT -= dt; if (restT <= 0) next(); } }
    const hy = hoopY(); cx.clearRect(0, 0, W, H); fx.begin(cx);
    const bg = mode === 'hoop' ? ['#fdba74', '#fb923c', '#7c2d12'] : ['#bae6fd', '#e0f2fe', '#65a30d'];
    GK.grad(cx, W, H, bg.length === 3 ? [bg[0], bg[1]] : bg); cx.fillStyle = mode === 'hoop' ? '#9a5b2a' : '#4d8f2a'; cx.fillRect(0, 440, W, 40);
    if (mode === 'hoop') { cx.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 6; i++) cx.fillRect(i * 62, 20, 30, 120); cx.strokeStyle = 'rgba(255,255,255,.6)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(180, 470, 130, Math.PI, 0); cx.stroke(); }
    else { GK.cloud(cx, 70, 70, 1.3); GK.cloud(cx, 280, 110, 1); }
    if (mode === 'hoop') {
      cx.fillStyle = '#6b7280'; cx.fillRect(322, hy - 60, 8, 400); cx.fillStyle = '#fff'; GK.rr(cx, 316, hy - 84, 12, 96, 3); cx.fill(); cx.strokeStyle = '#ef4444'; cx.lineWidth = 3; cx.strokeRect(316, hy - 30, 12, 38);
      cx.strokeStyle = '#f97316'; cx.lineWidth = 5; cx.beginPath(); cx.moveTo(hoop.x - hoop.r, hy); cx.lineTo(hoop.x + hoop.r, hy); cx.stroke();
      cx.strokeStyle = 'rgba(255,255,255,.85)'; cx.lineWidth = 1.6; const sw = Math.sin(t * 22) * 7 * netSwing; for (let i = 0; i <= 6; i++) { const x0 = hoop.x - hoop.r + i * (hoop.r * 2 / 6), x1 = hoop.x - hoop.r * .55 + i * (hoop.r * 1.1 / 6) + sw; cx.beginPath(); cx.moveTo(x0, hy); cx.lineTo(x1, hy + 44); cx.stroke(); }
      cx.beginPath(); cx.moveTo(hoop.x - hoop.r * .85 + sw * .5, hy + 14); cx.lineTo(hoop.x + hoop.r * .85 + sw * .5, hy + 14); cx.moveTo(hoop.x - hoop.r * .7 + sw, hy + 28); cx.lineTo(hoop.x + hoop.r * .7 + sw, hy + 28); cx.stroke();
    } else { const tx = targetX(); GK.shadow(cx, tx, 436, 30, .25); GK.draw(cx, cfg.target || '🐶', tx, 410, 62, 0, false, 1, 1, 1 + Math.sin(t * 6) * .04); }
    if (state === 'aim' && drag) {
      const v = vel(drag), pr = sim({ x: start.x, y: start.y, vx: v.vx, vy: v.vy }, 26); cx.fillStyle = '#fff'; pr.forEach((p, i) => { cx.globalAlpha = 1 - i / 28; cx.beginPath(); cx.arc(p[0], p[1], 4 - i * .07, 0, 7); cx.fill(); }); cx.globalAlpha = 1;
      cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(start.x, start.y); cx.lineTo(start.x - v.vx / 5.4, start.y - v.vy / 5.4); cx.stroke();
    }
    if (ball) { GK.shadow(cx, ball.x, 446, 14 * (1 - Math.min(1, (446 - ball.y) / 500)), .2); GK.draw(cx, ballE, ball.x, ball.y, 32, ball.rot); }
    if (state === 'aim' && !drag) { GK.txt(cx, '👆 ⇠', start.x + 6, start.y + 34, 16); }
    fx.draw(cx); fx.end(cx);
    hud.set('🏀 ' + Math.min(shotN, N) + '/' + N, '⭐ ' + pts + (streak >= 2 ? ' 🔥' + streak : ''), '🎯 ' + hits);
  });
  GK.count(c.wrap, K, next, '👆 ⇠ ⇢');
  return () => K.stop();
};

/* =====================================================================
   TENNIS — real rally match with tennis scoring and an AI opponent
   ===================================================================== */
GAMES.tennis = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, TARGET = cfg.points || 4;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const me = { x: 180, w: 66, y: 424, vx: 0, swing: 0 }, ai = { x: 180, w: 66, y: 56, swing: 0, err: 0, tx: 180 };
  let ball = { x: 180, y: 410, vx: 0, vy: 0, z: 0 }, pp = 0, pa = 0, state = 'serve', server = 'p', speed = 340, rally = 0, t = 0, over = false, rest = 0, tgt = 180, hitFlash = 0;
  const T = ['0', '15', '30', '40', 'GAME'];
  GK.input(K, c, { down(p) { tgt = p.x; swing(); }, move(p) { tgt = p.x; } });
  const keys = GK.keys(K, code => { if (code === 'Space') swing(); });
  function swing() { if (me.swing <= 0) { me.swing = .22; if (state === 'serve' && server === 'p') { ball.vx = rnd(-60, 60); ball.vy = -speed; state = 'play'; sfx('pop'); } } }
  function point(p) {
    if (p) pp++; else pa++; state = 'rest'; rest = 1.1; sfx(p ? 'win' : 'bad'); fx.burst(ball.x, Math.min(H - 20, Math.max(20, ball.y)), 20, { spd: 160 }); GK.flash(c.wrap, K, p ? '👏' : '😬', 700, p ? 'good' : 'bad');
    if (pp >= TARGET || pa >= TARGET) K.after(finish, 900); rally = 0; speed = 340; server = server === 'p' ? 'a' : 'p';
  }
  function finish() { if (over) return; over = true; const win = pp > pa; fin(clamp(win ? 55 + (TARGET - pa) * 11 : pp * 12, 5, 100), [T[Math.min(pp, 4)] + ' - ' + T[Math.min(pa, 4)]]); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); me.swing = Math.max(0, me.swing - dt); ai.swing = Math.max(0, ai.swing - dt); hitFlash = Math.max(0, hitFlash - dt);
    const px = me.x; me.x += clamp(tgt - me.x, -520 * dt, 520 * dt); me.x = clamp(me.x, 40 + me.w / 2, 320 - me.w / 2); me.vx = (me.x - px) / Math.max(dt, .001);
    if (state === 'rest') { rest -= dt; if (rest <= 0 && !over) { state = 'serve'; ball = { x: server === 'p' ? me.x : ai.x, y: server === 'p' ? 410 : 74, vx: 0, vy: 0 }; if (server === 'a') K.after(() => { if (state === 'serve') { ball.vx = rnd(-70, 70); ball.vy = speed * .9; state = 'play'; ai.swing = .2; } }, 900); } }
    if (state === 'serve' && server === 'p') { ball.x = me.x; ball.y = 410; }
    if (state === 'serve' && server === 'a') { ball.x = ai.x; ball.y = 74; }
    if (state === 'play') {
      ball.x += ball.vx * dt; ball.y += ball.vy * dt;
      if (ball.x < 46) { ball.x = 46; ball.vx = Math.abs(ball.vx); } if (ball.x > 314) { ball.x = 314; ball.vx = -Math.abs(ball.vx); }
      // AI move
      const reaction = 215 + d * 330; const aimX = ball.vy < 0 ? ball.x + ai.err : 180; ai.x += clamp(aimX - ai.x, -reaction * dt, reaction * dt); ai.x = clamp(ai.x, 40 + ai.w / 2, 320 - ai.w / 2);
      // player hit
      if (ball.vy > 0 && ball.y >= me.y - 12 && ball.y <= me.y + 14 && Math.abs(ball.x - me.x) < me.w / 2 + 10) {
        const rel = (ball.x - me.x) / (me.w / 2); const boost = me.swing > 0 ? 1.22 : 1; rally++; speed = Math.min(640, 340 + rally * 16);
        ball.vy = -speed * boost; ball.vx = rel * 230 + me.vx * .25; ball.y = me.y - 13; sfx('pop'); hitFlash = .15; fx.burst(ball.x, ball.y, 8, { spd: 100, life: .3, size: 3, col: '#fff' }); ai.err = rnd(-1, 1) * (30 + (1 - d) * 60) + (rally > 5 ? rnd(-30, 30) * (rally - 5) * .2 : 0);
      }
      // ai hit
      if (ball.vy < 0 && ball.y <= ai.y + 14 && ball.y >= ai.y - 14 && Math.abs(ball.x - ai.x) < ai.w / 2 + 10) {
        const missChance = clamp(.03 + (speed - 340) / 1500 - d * .05, .02, .35);
        if (Math.random() > missChance) { rally++; speed = Math.min(640, 340 + rally * 16); ball.vy = speed; ball.vx = (ball.x - ai.x) / (ai.w / 2) * 220 + rnd(-90, 90); ball.y = ai.y + 15; ai.swing = .2; sfx('tap'); hitFlash = .1; }
      }
      if (ball.y > H + 10) point(false); else if (ball.y < -10) point(true);
    }
    cx.clearRect(0, 0, W, H); fx.begin(cx);
    GK.grad(cx, W, H, ['#14532d', '#16a34a', '#14532d']); cx.fillStyle = '#2563eb'; cx.fillRect(40, 30, 280, 420); cx.fillStyle = '#1d4ed8'; for (let i = 0; i < 10; i++) if (i % 2) cx.fillRect(40, 30 + i * 42, 280, 42);
    cx.strokeStyle = '#fff'; cx.lineWidth = 3; cx.strokeRect(46, 36, 268, 408); cx.strokeRect(80, 36, 200, 408); cx.beginPath(); cx.moveTo(80, 160); cx.lineTo(280, 160); cx.moveTo(80, 320); cx.lineTo(280, 320); cx.moveTo(180, 160); cx.lineTo(180, 320); cx.stroke();
    cx.fillStyle = '#f3f4f6'; cx.fillRect(30, 236, 300, 8); cx.fillStyle = 'rgba(0,0,0,.35)'; cx.fillRect(30, 244, 300, 4);
    for (let x = 34; x < 330; x += 8) { cx.fillStyle = 'rgba(255,255,255,.5)'; cx.fillRect(x, 238, 3, 3); }
    const rk = (r, col, swing, up) => { GK.shadow(cx, r.x, r.y + 14, 30, .25); cx.save(); cx.translate(r.x, r.y); cx.rotate(swing > 0 ? (up ? -.5 : .5) * (swing / .22) : 0); cx.fillStyle = '#374151'; cx.fillRect(-3, up ? -30 : 4, 6, 26); cx.strokeStyle = col; cx.lineWidth = 6; cx.beginPath(); cx.ellipse(0, up ? 14 : -14, r.w / 2.4, 12, 0, 0, 7); cx.stroke(); cx.fillStyle = 'rgba(255,255,255,.35)'; cx.beginPath(); cx.ellipse(0, up ? 14 : -14, r.w / 2.4 - 3, 9, 0, 0, 7); cx.fill(); cx.restore(); };
    rk(me, '#fbbf24', me.swing, false); rk(ai, '#f87171', ai.swing, true);
    const scl = .85 + .5 * clamp(ball.y / H, 0, 1); GK.shadow(cx, ball.x + 6, ball.y + 12, 8 * scl, .3); GK.draw(cx, '🎾', ball.x, ball.y, 20 * scl, t * 8);
    if (state === 'serve' && server === 'p') GK.txt(cx, '👆 ' + ui('gm_serve'), 180, 380, 18);
    fx.draw(cx); fx.end(cx);
    hud.set('🎾 ' + rally, '<b style="color:#fde047">' + T[Math.min(pp, 4)] + '</b> - <b style="color:#fca5a5">' + T[Math.min(pa, 4)] + '</b>', '🏆 ' + TARGET);
  });
  GK.count(c.wrap, K, () => { state = 'serve'; ball = { x: me.x, y: 410, vx: 0, vy: 0 }; }, '↔ 👆');
  return () => K.stop();
};

/* =====================================================================
   FRISBEE — the dog runs under the flight and leaps to catch it.
   Every throw lands inside the field; a shadow shows where it will come down.
   ===================================================================== */
GAMES.frisbee = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, N = cfg.throws || 8;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const GY = 400; let dog = { x: 190, y: GY, vy: 0, tx: 190, f: 1 }, fr = null, throwN = 0, pts = 0, catches = 0, wind = 0, t = 0, over = false, state = 'wait', waitT = 0;
  const jumpBtn = mk('button', 'bigbtn', '⬆️ ' + ui('gm_jump')); jumpBtn.style.margin = '4px 0 0'; jumpBtn.style.fontSize = '20px'; jumpBtn.style.padding = '10px 40px'; host.appendChild(jumpBtn);
  function jump() { if (dog.y >= GY - 1) { dog.vy = -520; sfx('tap'); } }
  jumpBtn.onpointerdown = e => { e.preventDefault(); jump(); }; const keys = GK.keys(K, code => { if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') jump(); });
  GK.input(K, c, { down(p) { dog.tx = clamp(p.x, 30, W - 30); }, move(p, e, down) { if (down) dog.tx = clamp(p.x, 30, W - 30); } });
  function launch() {
    throwN++; if (throwN > N) return end();
    wind = rnd(-60, 60) * (.4 + d);
    const xt = rnd(120, 305), T = rnd(1.9, 2.7) - d * .45, arc = rnd(120, 190);
    fr = { x0: 56, y0: 260, xt, T, arc, u: 0, x: 56, y: 260, rot: 0, got: false };
    state = 'fly'; sfx('pop');
  }
  function end() { if (over) return; over = true; fin(GK.stars100(pts, 0, N * 11), ['🥏 ' + catches + '/' + N, '⭐ ' + pts]); }
  const path = (f, u) => ({ x: f.x0 + (f.xt - f.x0) * u + wind * Math.sin(Math.PI * u) * .3, y: f.y0 + (GY - 14 - f.y0) * u * u - f.arc * Math.sin(Math.PI * u) * (1 - u * .35) });
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt);
    if (keys.ArrowLeft || keys.KeyA) dog.tx = clamp(dog.tx - 300 * dt, 30, W - 30); if (keys.ArrowRight || keys.KeyD) dog.tx = clamp(dog.tx + 300 * dt, 30, W - 30);
    const dx = dog.tx - dog.x; if (Math.abs(dx) > 3) { dog.x += clamp(dx, -280 * dt, 280 * dt); dog.f = dx > 0 ? 1 : -1; }
    dog.vy += 1350 * dt; dog.y += dog.vy * dt; if (dog.y > GY) { dog.y = GY; dog.vy = 0; }
    if (state === 'wait') { waitT -= dt; if (waitT <= 0) launch(); }
    if (fr && state === 'fly') {
      fr.u = Math.min(1, fr.u + dt / fr.T); const q = path(fr, fr.u); fr.x = q.x; fr.y = q.y; fr.rot += dt * 14;
      const mx = dog.x + dog.f * 16, my = dog.y - 30;
      if (!fr.got && Math.hypot(fr.x - mx, fr.y - my) < 36) {
        fr.got = true; state = 'caught'; catches++; const air = dog.y < GY - 25, perf = Math.hypot(fr.x - mx, fr.y - my) < 16; const add = 8 + (air ? 4 : 0) + (perf ? 2 : 0); pts += add; sfx('win'); fx.text('+' + add + (air ? ' 🦘' : ''), fr.x, fr.y - 24, '#fde047', 26); fx.burst(fr.x, fr.y, 22, { spd: 170, e: '⭐', size: 4 }); waitT = 1.1;
      } else if (fr.u >= 1) { state = 'miss'; waitT = 1; sfx('bad'); fx.text('😢', fr.x, GY - 30, '#fff', 30); }
    }
    if (state === 'miss' || state === 'caught') { waitT -= dt; if (waitT <= 0) { fr = null; state = 'wait'; waitT = .2; } }
    cx.clearRect(0, 0, W, H); fx.begin(cx);
    GK.grad(cx, W, H, ['#7dd3fc', '#e0f2fe']); GK.cloud(cx, 60 + (t * 8) % 340, 70, 1.4); GK.cloud(cx, 250 - (t * 5) % 300, 130, 1); cx.fillStyle = '#16a34a'; cx.beginPath(); cx.moveTo(0, 330); cx.quadraticCurveTo(100, 290, 220, 330); cx.quadraticCurveTo(300, 360, W, 320); cx.lineTo(W, H); cx.lineTo(0, H); cx.fill();
    cx.fillStyle = '#4ade80'; cx.fillRect(0, GY + 6, W, H - GY); for (let i = 0; i < 14; i++) { cx.fillStyle = 'rgba(0,0,0,.08)'; cx.fillRect(i * 28 + (i % 2) * 6, GY + 6, 2, 80); }
    GK.draw(cx, '🌳', 330, 340, 62);
    GK.draw(cx, '🧍', 40, 340, 64, 0, false); GK.draw(cx, '🫲', 62, 330, 22, -.4);
    if (fr && state === 'fly' && fr.u > .3) { cx.globalAlpha = Math.min(.55, (fr.u - .3) * 1.4); cx.fillStyle = '#065f46'; cx.beginPath(); cx.ellipse(fr.xt, GY + 6, 22, 7, 0, 0, 7); cx.fill(); cx.globalAlpha = 1; cx.strokeStyle = 'rgba(253,224,71,.9)'; cx.lineWidth = 3; cx.setLineDash([5, 5]); cx.beginPath(); cx.ellipse(fr.xt, GY + 6, 26, 9, 0, 0, 7); cx.stroke(); cx.setLineDash([]); }
    GK.shadow(cx, dog.x, GY + 8, 24 * (1 - (GY - dog.y) / 260), .25); GK.draw(cx, cfg.me || '🐕', dog.x, dog.y - 24, 60, 0, dog.f < 0, 1, 1, dog.vy < -50 ? 1.1 : 1);
    if (fr) { GK.shadow(cx, fr.x, GY + 8, 10, .18); GK.draw(cx, '🥏', fr.x, fr.y, 30, 0, false, 1, 1, .55 + Math.abs(Math.sin(fr.rot)) * .3); }
    cx.fillStyle = '#fff'; GK.rr(cx, 140, 18, 80, 26, 10); cx.globalAlpha = .6; cx.fill(); cx.globalAlpha = 1; GK.txt(cx, (wind > 8 ? '🌬️ →' : wind < -8 ? '← 🌬️' : '🌬️ ·'), 180, 31, 16, '#1e3a8a');
    fx.draw(cx); fx.end(cx);
    hud.set('🥏 ' + Math.min(throwN, N) + '/' + N, '⭐ ' + pts, '🐾 ' + catches);
  });
  GK.count(c.wrap, K, () => { state = 'wait'; waitT = .4; }, '↔ ⬆️');
  return () => K.stop();
};
/* =====================================================================
   GYM — rep-timing workout with stamina, sets and heavier weights
   ===================================================================== */
GAMES.gym = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 440, kind = cfg.kind || 'lift', SETS = 3, REPS = cfg.reps || (4 + Math.round(d * 2));
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let set = 0, rep = 0, stam = 1, pts = 0, combo = 0, needle = 0, dir = 1, zc = .5, zw = .24, lift = 0, liftDir = 0, t = 0, over = false, rest = 0, shake = 0, perfects = 0, total = 0, ok = 0;
  const me = cfg.me || '🧑';
  function zone() { zw = clamp(.26 - set * .035 - d * .06, .1, .3); zc = rnd(zw / 2 + .08, 1 - zw / 2 - .08); }
  function hit() {
    if (over || rest > 0 || liftDir !== 0) return; total++;
    const dd = Math.abs(needle - zc);
    if (dd < zw / 2) { const pf = dd < zw * .18; ok++; combo++; const add = 10 + (pf ? 5 : 0) + Math.min(5, combo); pts += add; if (pf) perfects++; sfx(pf ? 'win' : 'ok'); fx.text((pf ? ui('perfect') : ui('good')) + ' +' + add, 180, 120, pf ? '#fde047' : '#fff', 24); fx.burst(180, 200, 14, { spd: 130 }); liftDir = 1; rep++; stam = Math.min(1, stam + .04); }
    else { combo = 0; stam -= .24; sfx('bad'); shake = .4; fx.text('💦', 180, 160, '#fff', 30); if (stam <= 0) { over = true; K.after(() => fin(GK.stars100(pts, 0, SETS * REPS * 13 * .85), ['💪 ' + ok + '/' + total]), 800); } }
    if (!over) zone();
  }
  GK.input(K, c, { down() { hit(); } }); GK.keys(K, code => { if (code === 'Space') hit(); });
  K.loop(dt => {
    if (over && stam > 0) return; t += dt; fx.update(dt); shake = Math.max(0, shake - dt);
    if (rest > 0) { rest -= dt; if (rest <= 0) { zone(); } }
    else { needle += dir * (.9 + set * .22 + d * .5) * dt; if (needle > 1) { needle = 1; dir = -1; } if (needle < 0) { needle = 0; dir = 1; } }
    if (liftDir === 1) { lift += dt * 2.6; if (lift >= 1) { lift = 1; liftDir = -1; } } else if (liftDir === -1) { lift -= dt * 2.6; if (lift <= 0) { lift = 0; liftDir = 0; if (rep >= REPS) { set++; rep = 0; if (set >= SETS) { over = true; K.after(() => fin(GK.stars100(pts, 0, SETS * REPS * 13 * .85), ['💪 ' + ok + '/' + total, '🔥 ' + perfects]), 700); } else { rest = 1.4; stam = Math.min(1, stam + .35); fx.text('💨 ' + ui('gm_rest'), 180, 150, '#bae6fd', 24); } } } }
    cx.clearRect(0, 0, W, H); fx.begin(cx);
    GK.grad(cx, W, H, ['#e0e7ff', '#c7d2fe']); cx.fillStyle = '#4338ca'; cx.fillRect(0, 300, W, 140); cx.fillStyle = 'rgba(255,255,255,.18)'; for (let i = 0; i < 5; i++) cx.fillRect(18 + i * 70, 24, 52, 160); cx.fillStyle = '#312e81'; cx.fillRect(0, 300, W, 6);
    GK.draw(cx, '🏋️', 40, 270, 40, 0, false, .5); GK.draw(cx, '🚴', 320, 270, 40, 0, false, .5);
    const ox = shake > 0 ? Math.sin(t * 70) * 6 : 0;
    if (kind === 'lift') {
      const by = 255 - lift * 120; GK.shadow(cx, 180, 340, 60, .25); GK.draw(cx, me, 180 + ox, 290 - lift * 18, 108);
      cx.strokeStyle = '#9ca3af'; cx.lineWidth = 7; cx.beginPath(); cx.moveTo(40, by); cx.lineTo(320, by); cx.stroke();
      const pl = ['#ef4444', '#3b82f6', '#fbbf24', '#10b981']; for (let s = 0; s <= set + 1; s++) [1, -1].forEach(sd => { cx.fillStyle = pl[s % 4]; GK.rr(cx, 180 + sd * (124 + s * 13) - 6, by - 28 + s * 3, 12, 56 - s * 6, 4); cx.fill(); });
    } else if (kind === 'push') {
      GK.shadow(cx, 180, 330, 80, .25); GK.draw(cx, me, 180 + ox, 290 + (1 - lift) * 4 + lift * -14, 104, -1.35 + lift * .12);
    } else { GK.shadow(cx, 180, 335, 70, .25); GK.draw(cx, me, 180 + ox, 285, 104, Math.sin(lift * Math.PI) * -.35, false, 1, 1 + lift * .2, 1 - lift * .05); cx.fillStyle = '#f472b6'; cx.fillRect(70, 332, 220, 8); }
    // meter
    GK.rr(cx, 30, 372, 300, 30, 15); cx.fillStyle = 'rgba(15,23,42,.55)'; cx.fill(); GK.rr(cx, 30 + (zc - zw / 2) * 300, 372, zw * 300, 30, 15); cx.fillStyle = '#22c55e'; cx.fill(); GK.rr(cx, 30 + (zc - zw * .09) * 300, 372, zw * .18 * 300, 30, 10); cx.fillStyle = '#fde047'; cx.fill();
    cx.fillStyle = '#fff'; cx.fillRect(30 + needle * 300 - 3, 366, 6, 42);
    GK.bar(cx, 30, 346, 300, 12, Math.max(0, stam), stam < .3 ? '#ef4444' : '#38bdf8');
    fx.draw(cx); fx.end(cx);
    hud.set('🏋️ ' + (set + 1) + '/' + SETS + ' · ' + rep + '/' + REPS, '⭐ ' + pts + (combo > 2 ? ' 🔥' + combo : ''), '❤️ ' + Math.round(Math.max(0, stam) * 100) + '%');
  });
  GK.count(c.wrap, K, zone, '👆 ' + ui('gm_inzone'));
  return () => K.stop();
};

/* =====================================================================
   TUG OF WAR — best of three rounds with stamina and surges
   ===================================================================== */
GAMES.tug = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 360, ROUNDS = 3;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let q = 0, stam = 1, rw = 0, rl = 0, round = 0, surge = 1, t = 0, state = 'wait', over = false, tapT = 0, margin = 0;
  const foe = cfg.foe || '🐶', me = cfg.icon || '🧑';
  function tap() { if (state !== 'play') return; const f = stam > .15 ? 1 : .35; q -= .052 * f; stam = Math.max(0, stam - .028); tapT = .12; sfx('pop'); fx.burst(120 + q * 50, 250, 3, { spd: 60, life: .35, size: 3, col: '#d6b98c', g: 0 }); }
  GK.input(K, c, { down() { tap(); } }); GK.keys(K, code => { if (code === 'Space') tap(); });
  function roundEnd(won) {
    state = 'rest'; if (won) rw++; else rl++; margin += won ? 1 - Math.abs(q) * 0 : 0; sfx(won ? 'win' : 'bad'); GK.flash(c.wrap, K, won ? '💪' : '😵', 900, won ? 'good' : 'bad'); round++;
    if (rw >= 2 || rl >= 2 || round >= ROUNDS) K.after(() => { if (over) return; over = true; fin(rw > rl ? 70 + (rw - rl) * 15 : 20 + rw * 25, [rw + ' - ' + rl]); }, 1000);
    else K.after(() => { q = 0; stam = 1; surge = 1; state = 'play'; }, 1100);
  }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); tapT = Math.max(0, tapT - dt); stam = Math.min(1, stam + (tapT > 0 ? .0 : .22) * dt);
    if (state === 'play') { surge = Math.sin(t * 1.3) > .55 ? 1.9 : 1; q += (.2 + d * .3) * surge * dt * (1 + round * .08); if (q <= -1) roundEnd(true); else if (q >= 1) roundEnd(false); }
    cx.clearRect(0, 0, W, H); fx.begin(cx);
    GK.grad(cx, W, H, ['#fde68a', '#fbbf24']); cx.fillStyle = '#a16207'; cx.fillRect(0, 260, W, 100); cx.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 8; i++) cx.fillRect(i * 50, 260, 24, 100);
    for (let i = 0; i < 16; i++) GK.draw(cx, ['😀', '😃', '🥳', '😮'][i % 4], 14 + i * 22, 70 + (i % 2) * 10, 22, 0, false, .75);
    const fx0 = 180 + q * 100; cx.strokeStyle = '#7c2d12'; cx.lineWidth = 8; cx.beginPath(); cx.moveTo(40, 255); cx.lineTo(320, 255); cx.stroke(); cx.strokeStyle = '#d97706'; cx.lineWidth = 3; cx.setLineDash([10, 10]); cx.stroke(); cx.setLineDash([]);
    cx.fillStyle = '#22c55e'; cx.fillRect(64, 200, 4, 70); cx.fillStyle = '#ef4444'; cx.fillRect(292, 200, 4, 70); GK.draw(cx, '🚩', fx0, 232, 42);
    const lean = -.12 + tapT * -.4 + (q > 0 ? .1 : 0);
    GK.shadow(cx, 86 + q * 70, 285, 36, .25); GK.draw(cx, me, 86 + q * 70, 238, 76, lean, false); GK.shadow(cx, 274 + q * 70, 285, 36, .25); GK.draw(cx, foe, 274 + q * 70, 238, 76, -lean * .7, true);
    GK.bar(cx, 40, 310, 280, 14, stam, stam < .2 ? '#ef4444' : '#38bdf8'); GK.txt(cx, '⚡', 28, 317, 18);
    if (surge > 1.2) GK.txt(cx, '😤 !!', 270, 150, 26, '#ef4444');
    fx.draw(cx); fx.end(cx);
    hud.set(ui('round') + ' ' + Math.min(round + 1, ROUNDS) + '/' + ROUNDS, '🟢 ' + rw + ' - ' + rl + ' 🔴', '👆 ⚡');
  });
  GK.count(c.wrap, K, () => { state = 'play'; }, '👆👆👆');
  return () => K.stop();
};

/* =====================================================================
   CLIMB — alternate left/right grips, manage stamina, dodge falling rocks
   ===================================================================== */
GAMES.climb = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, GOAL = 100, TT = cfg.secs || 45;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let h = 0, side = 0, stam = 1, left = TT, t = 0, over = false, rocks = [], rt = 2, dodge = 0, slip = 0, idle = 0;
  const me = cfg.me || '🧗';
  function grip(s) {
    if (over || slip > 0) return; if (side !== 0 && s === side) { h = Math.max(0, h - 1.5); stam -= .05; sfx('bad'); fx.text('💦', 180, 300, '#fff', 24); return; }
    side = s; const f = stam > .12 ? 1 : .3; h += 2.6 * f; stam = Math.max(0, stam - .035); idle = 0; sfx('tap');
  }
  GK.input(K, c, { down(p) { if (p.y > 360) { if (p.x < 120) grip(-1); else if (p.x > 240) grip(1); else doDodge(); } else grip(p.x < 180 ? -1 : 1); } });
  GK.keys(K, code => { if (code === 'ArrowLeft' || code === 'KeyA') grip(-1); if (code === 'ArrowRight' || code === 'KeyD') grip(1); if (code === 'Space' || code === 'ArrowDown') doDodge(); });
  function doDodge() { if (dodge <= 0) { dodge = .55; sfx('pop'); } }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; fx.update(dt); idle += dt; dodge = Math.max(0, dodge - dt); slip = Math.max(0, slip - dt); stam = Math.min(1, stam + (idle > .3 ? .35 : .04) * dt);
    rt -= dt; if (rt <= 0) { rt = rnd(1.1, 2.4) - d * .6; rocks.push({ y: -40, x: 180 + rnd(-8, 8), v: 260 + d * 150, w: 1 }); }
    rocks.forEach(r => { r.y += r.v * dt; if (r.y > 280 && r.y < 340 && r.w && dodge <= 0 && slip <= 0) { r.w = 0; slip = .8; h = Math.max(0, h - 8); sfx('bad'); fx.shake(.4); fx.text('-8', 180, 250, '#f87171', 28); } });
    rocks = rocks.filter(r => r.y < 520);
    if (h >= GOAL) { over = true; sfx('win'); K.after(() => fin(clamp(80 + (left / TT) * 20, 80, 100), ['🧗 ' + Math.round(h) + 'm']), 600); }
    else if (left <= 0) { over = true; K.after(() => fin(clamp(h / GOAL * 78, 0, 78), ['🧗 ' + Math.round(h) + 'm']), 500); }
    cx.clearRect(0, 0, W, H); fx.begin(cx);
    GK.grad(cx, W, H, ['#7dd3fc', '#fef3c7']); cx.fillStyle = '#92400e'; cx.fillRect(0, 0, 70, H); cx.fillRect(290, 0, 70, H); cx.fillStyle = 'rgba(0,0,0,.12)'; for (let y = -((h * 22) % 60); y < H; y += 60) { cx.fillRect(0, y, 70, 4); cx.fillRect(290, y, 70, 4); }
    cx.strokeStyle = '#d6b36a'; cx.lineWidth = 10; cx.beginPath(); cx.moveTo(180, 0); cx.lineTo(180, H); cx.stroke(); cx.strokeStyle = '#a16207'; cx.lineWidth = 2; for (let y = -((h * 22) % 18); y < H; y += 18) { cx.beginPath(); cx.moveTo(176, y); cx.lineTo(184, y + 9); cx.stroke(); }
    for (let m = 0; m <= GOAL; m += 10) { const y = 300 - (m - h) * 22; if (y > -20 && y < H + 20) GK.txt(cx, m + 'm', 36, y, 18, '#fde68a'); }
    rocks.forEach(r => { GK.draw(cx, '🪨', r.x, r.y, 44, r.y * .03); if (r.y < 270) { cx.fillStyle = 'rgba(239,68,68,.35)'; cx.beginPath(); cx.ellipse(180, 330, 30, 8, 0, 0, 7); cx.fill(); } });
    const sway = Math.sin(t * 9) * (side ? 4 : 1) + (slip > 0 ? Math.sin(t * 40) * 6 : 0); GK.draw(cx, me, 180 + sway + (dodge > 0 ? 34 : 0), 300, 84, side * .08, side > 0);
    GK.bar(cx, 40, 420, 280, 16, stam, stam < .2 ? '#ef4444' : '#38bdf8'); GK.txt(cx, '⬅️', 70, 455, 24); GK.txt(cx, '🛡️', 180, 455, 22); GK.txt(cx, '➡️', 290, 455, 24);
    GK.bar(cx, 316, 90, 12, 240, h / GOAL, '#22c55e'); GK.draw(cx, '🏁', 322, 84, 24);
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), '🧗 ' + Math.round(h) + '/' + GOAL, '⚡ ' + Math.round(stam * 100));
  });
  GK.count(c.wrap, K, () => { }, '⬅️ ➡️');
  return () => K.stop();
};

/* =====================================================================
   JUMP ROPE — rope speed rises, time your jumps, 3 lives
   ===================================================================== */
GAMES.jumprope = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 420, GY = 340, GOAL = cfg.goal || 30;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let ang = 0, spd = 3.0 + d * 1.2, y = 0, vy = 0, jumps = 0, lives = 3, combo = 0, best = 0, t = 0, over = false, passed = true, hitFlash = 0;
  const me = cfg.me || '👧';
  function jump() { if (y === 0 && !over) { vy = 520; sfx('tap'); } }
  GK.input(K, c, { down() { jump(); } }); GK.keys(K, code => { if (code === 'Space' || code === 'ArrowUp') jump(); });
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); hitFlash = Math.max(0, hitFlash - dt); const prev = ang; ang += spd * dt;
    if (y > 0 || vy > 0) { vy -= 1500 * dt; y += vy * dt; if (y <= 0) { y = 0; vy = 0; } }
    // rope passes the feet when angle crosses pi (bottom)
    const cross = Math.floor((ang - Math.PI) / (Math.PI * 2)) > Math.floor((prev - Math.PI) / (Math.PI * 2));
    if (cross) { if (y > 34) { jumps++; combo++; best = Math.max(best, combo); sfx('ok'); fx.text(combo > 3 ? '🔥' + combo : '+1', 180, GY - 130, '#fde047', 24); if (jumps % 5 === 0) { spd += .38; GK.flash(c.wrap, K, '⚡', 500); } } else { lives--; combo = 0; hitFlash = .4; sfx('bad'); fx.shake(.4); if (lives <= 0) { over = true; K.after(() => fin(GK.stars100(jumps, 0, GOAL), ['🪢 ' + jumps]), 700); } } }
    if (jumps >= GOAL && !over) { over = true; sfx('win'); K.after(() => fin(100, ['🪢 ' + jumps]), 600); }
    cx.clearRect(0, 0, W, H); fx.begin(cx);
    GK.grad(cx, W, H, ['#fbcfe8', '#fde68a']); cx.fillStyle = '#84cc16'; cx.fillRect(0, GY + 10, W, H); cx.fillStyle = 'rgba(0,0,0,.1)'; cx.fillRect(0, GY + 10, W, 6);
    GK.draw(cx, '🌳', 40, GY - 20, 70); GK.draw(cx, '🌳', 320, GY - 10, 70);
    const rx = 180, ry = GY - 70 - y * .0; const rr = 118, a = ang % (Math.PI * 2), rye = Math.cos(a) * -1; // rope: back half behind player, front half in front
    const ropeY = ry + 52 + Math.cos(a) * 82, behind = Math.sin(a) < 0;
    const drawRope = front => { cx.strokeStyle = '#ef4444'; cx.lineWidth = 6; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(78, GY - 30); cx.quadraticCurveTo(rx, ropeY + (ropeY - (GY - 30)) * .6, 282, GY - 30); cx.stroke(); };
    if (behind) drawRope(false); GK.shadow(cx, 180, GY + 12, 34 * (1 - y / 400), .25); GK.draw(cx, me, 180, GY - 38 - y, 84, hitFlash > 0 ? Math.sin(t * 60) * .2 : 0); if (!behind) drawRope(true);
    cx.fillStyle = '#f59e0b'; GK.rr(cx, 62, GY - 46, 22, 30, 6); cx.fill(); GK.rr(cx, 276, GY - 46, 22, 30, 6); cx.fill();
    fx.draw(cx); fx.end(cx);
    hud.set('🪢 ' + jumps + '/' + GOAL, '🔥 ' + combo + ' (' + best + ')', '❤️'.repeat(Math.max(0, lives)));
  });
  GK.count(c.wrap, K, () => { }, '👆 ⬆️');
  return () => K.stop();
};
