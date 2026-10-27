'use strict';
/* =====================================================================
   WASH — full cleaning game: soap -> scrub -> rinse -> dry (and variants:
   cleaning, shoe polishing, fur brushing). Works on any character / object.
   ===================================================================== */
GAMES.wash = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460, TT = cfg.secs || 70;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const mode = cfg.mode || 'bath';
  const PH = { bath: ['soap', 'scrub', 'rinse', 'dry'], clean: ['scrub', 'dry'], polish: ['wax', 'buff'], brush: ['brush', 'shine'] }[mode] || ['scrub', 'dry'];
  const TOOL = { soap: '🧼', scrub: mode === 'brush' ? '🪮' : '🧽', rinse: '🚿', dry: '🧻', wax: '🖌️', buff: '🧽', brush: '🪮', shine: '🧻' };
  const LAB = { soap: T('סבון!', 'Soap up!', 'صابون!', 'Намыль!', '¡Jabón!'), scrub: T('שפשפו!', 'Scrub!', 'افرك!', 'Три!', '¡Frota!'), rinse: T('שטפו!', 'Rinse!', 'اشطف!', 'Смой!', '¡Aclara!'), dry: T('נגבו!', 'Dry!', 'جفّف!', 'Вытри!', '¡Seca!'), wax: T('משחה!', 'Wax on!', 'ضع الشمع!', 'Нанеси воск!', '¡Cera!'), buff: T('צחצחו!', 'Buff it!', 'لمّع!', 'Натри!', '¡Pule!'), brush: T('סרקו!', 'Brush!', 'سرّح!', 'Расчеши!', '¡Cepilla!'), shine: T('ברק!', 'Shine!', 'لمعان!', 'Блеск!', '¡Brillo!') };
  const CS = 10, GX0 = 50, GY0 = 100, GW = 26, GH = 26; // grid over the subject area (260x260)
  const N = GW * GH, mask = new Uint8Array(N), st = new Float32Array(N), foam = new Float32Array(N), wet = new Uint8Array(N), kind = new Uint8Array(N);
  const cxm = GX0 + GW * CS / 2, cym = GY0 + GH * CS / 2;
  for (let i = 0; i < N; i++) { const x = GX0 + (i % GW) * CS + CS / 2, y = GY0 + Math.floor(i / GW) * CS + CS / 2; mask[i] = Math.hypot((x - cxm) / 118, (y - cym) / 118) < 1 ? 1 : 0; }
  const mask0 = mask.slice(), nb = 9 + Math.round(d * 7); const stainCols = { 0: '#7b5a3a', 1: '#4b5563', 2: '#b45309' };
  const dirtyAt0 = new Uint8Array(N); let dirtyTotal = 0;
  function seedStains() { // stains only land on cells that belong to the subject
    st.fill(0); kind.fill(0); dirtyAt0.fill(0); const cells = []; for (let i = 0; i < N; i++) if (mask[i]) cells.push(i);
    const blobs = Math.max(4, Math.round(nb * Math.min(1, cells.length / 430)));
    for (let b = 0; b < blobs; b++) { const ci = cells.length ? pick(cells) : 0, bx = GX0 + (ci % GW) * CS + CS / 2 + rnd(-4, 4), by = GY0 + Math.floor(ci / GW) * CS + CS / 2 + rnd(-4, 4), br = rnd(13, 26), kd = ri(0, 2); for (let i = 0; i < N; i++) { if (!mask[i]) continue; const x = GX0 + (i % GW) * CS + CS / 2, y = GY0 + Math.floor(i / GW) * CS + CS / 2; if (Math.hypot(x - bx, y - by) < br * (.7 + .5 * Math.sin(i))) { st[i] = kd === 1 ? 2.4 : kd === 2 ? 1.6 : 1; kind[i] = kd; } } }
    dirtyTotal = 0; for (let i = 0; i < N; i++) if (st[i] > 0) { dirtyTotal++; dirtyAt0[i] = 1; }
  }
  seedStains();
  function maskFromImage() { // use the artwork's silhouette instead of a plain circle
    try {
      const oc = document.createElement('canvas'); oc.width = W; oc.height = H; const ox = oc.getContext('2d'), ar = img.width / img.height;
      ox.drawImage(img, cxm - 120 * ar * .98, cym - 120 + 4, 240 * ar * .98 * .98, 240 * .98);
      const px = ox.getImageData(0, 0, W, H).data; let cnt = 0;
      for (let i = 0; i < N; i++) { const x = GX0 + (i % GW) * CS + CS / 2, y = GY0 + Math.floor(i / GW) * CS + CS / 2; mask[i] = px[((y | 0) * W + (x | 0)) * 4 + 3] > 70 ? 1 : 0; cnt += mask[i]; }
      if (cnt < 24) mask.set(mask0);
    } catch (e) { mask.set(mask0); }
    seedStains();
  }
  let phaseReady = false, phase = 0, left = TT, t = 0, over = false, ptr = { x: 180, y: 380, down: false, px: 180, py: 380, spd: 0, trail: [] }, prog = 0, phaseScore = [], target = 1, duckList = [], ducks = 0, img = null, foamTotal = 0, wetTotal = 0, bonusT = 4;
  const subj = cfg.art ? GK.artImg(cfg.art, { mood: 'sad' }, im => { img = im; if (!phaseReady && phase === 0) maskFromImage(); }) : null;
  GK.input(K, c, { down(p) { ptr.down = true; ptr.x = ptr.px = p.x; ptr.y = ptr.py = p.y; ptr.trail = [{ x: p.x, y: p.y }]; duckTap(p); }, move(p) { if (ptr.down) { const a = ptr.trail.length ? ptr.trail[ptr.trail.length - 1] : { x: ptr.x, y: ptr.y }; const n = Math.max(1, Math.ceil(Math.hypot(p.x - a.x, p.y - a.y) / 6)); for (let k = 1; k <= n; k++) ptr.trail.push({ x: GK.lerp(a.x, p.x, k / n), y: GK.lerp(a.y, p.y, k / n) }); } ptr.x = p.x; ptr.y = p.y; }, up() { ptr.down = false; } });
  function duckTap(p) { duckList.forEach(dk => { if (!dk.dead && Math.hypot(dk.x - p.x, dk.y - p.y) < 30) { dk.dead = true; ducks++; sfx('coin'); fx.text('+3', dk.x, dk.y, '#fde047', 22); fx.burst(dk.x, dk.y, 10, { spd: 120, e: '🫧', size: 3 }); } }); }
  const cur = () => PH[phase];
  function cellsNear(x, y, r, fn) { const gx = Math.floor((x - GX0) / CS), gy = Math.floor((y - GY0) / CS), rr = Math.ceil(r / CS); for (let yy = gy - rr; yy <= gy + rr; yy++) for (let xx = gx - rr; xx <= gx + rr; xx++) { if (xx < 0 || yy < 0 || xx >= GW || yy >= GH) continue; const i = yy * GW + xx; if (mask[i] && Math.hypot(GX0 + xx * CS + CS / 2 - x, GY0 + yy * CS + CS / 2 - y) < r) fn(i); } }
  function startPhase() {
    const p = cur(); target = 1;
    if (p === 'wax') { for (let i = 0; i < N; i++) st[i] = 0; }
    if (p === 'buff') { for (let i = 0; i < N; i++) if (foam[i] > 0) foam[i] = 1; }
    if (p === 'dry' || p === 'shine') { for (let i = 0; i < N; i++) if (mask[i]) wet[i] = 1; wetTotal = mask.reduce((a, b) => a + b, 0); }
    if (p === 'rinse' || p === 'buff') { foamTotal = 0; for (let i = 0; i < N; i++) if (foam[i] > 0) foamTotal++; }
    phaseReady = true; GK.flash(c.wrap, K, tx(LAB[p]), 800);
  }
  function measure() {
    const p = cur(); let a = 0, b = 0;
    if (p === 'soap') { for (let i = 0; i < N; i++) if (st[i] > 0) { b++; if (foam[i] > 0) a++; } return b ? a / b : 1; }
    if (p === 'scrub' || p === 'brush') { for (let i = 0; i < N; i++) if (mask[i] && kind[i] >= 0 && dirtyAt0[i]) { b++; if (st[i] <= 0) a++; } return b ? a / b : 1; }
    if (p === 'rinse' || p === 'buff') { if (!foamTotal) return 1; let r = 0; for (let i = 0; i < N; i++) if (foam[i] > 0) r++; return 1 - r / foamTotal; }
    if (p === 'wax') { let m = 0; for (let i = 0; i < N; i++) if (mask[i]) { m++; if (foam[i] > 0) a++; } return a / m; }
    if (p === 'dry' || p === 'shine') { let r = 0; for (let i = 0; i < N; i++) if (wet[i]) r++; return 1 - r / Math.max(1, wetTotal); }
    return 1;
  }
  function end(done) { if (over) return; over = true; sfx(done ? 'win' : 'bad'); const base = phaseScore.reduce((a, b) => a + b, 0) / PH.length * 78; K.after(() => fin(clamp(base + (done ? 12 + left / TT * 10 : 0) + ducks * 2, 0, 100), ['🧼 ' + phaseScore.length + '/' + PH.length, '🦆 ' + ducks]), 700); }
  function advance() { phaseReady = false; phaseScore.push(1); sfx('ok'); fx.burst(180, 230, 24, { spd: 190, e: '✨', size: 4 }); phase++; if (phase >= PH.length) { end(true); } else K.after(startPhase, 600); }
  K.loop(dt => {
    if (over) return; t += dt; left -= dt; fx.update(dt); bonusT -= dt;
    const p = cur(); let pts = ptr.trail.length ? ptr.trail : [{ x: ptr.x, y: ptr.y }], pl = 0, lx = ptr.px, ly = ptr.py; pts.forEach(q => { pl += Math.hypot(q.x - lx, q.y - ly); lx = q.x; ly = q.y; }); ptr.spd = pl / Math.max(dt, .001); ptr.px = ptr.x; ptr.py = ptr.y; ptr.trail = [];
    if (bonusT <= 0 && mode === 'bath') { bonusT = rnd(5, 9); duckList.push({ x: rnd(60, 300), y: 56, vx: rnd(-30, 30), vy: 0, dead: false, life: 6 }); }
    duckList.forEach(dk => { dk.life -= dt; dk.x += dk.vx * dt; dk.y = 56 + Math.sin(t * 3 + dk.x) * 4; if (dk.life <= 0) dk.dead = true; }); duckList = duckList.filter(dk => !dk.dead);
    if (ptr.down && phase < PH.length && phaseReady) {
      const R = p === 'rinse' ? 34 : 26; let acted = 0; const dtp = dt / Math.max(1, Math.min(pts.length, 40)); const step = Math.max(1, Math.ceil(pts.length / 40));
      for (let pi = 0; pi < pts.length; pi += step) {
        cellsNear(pts[pi].x, pts[pi].y, R, i => {
          if (p === 'soap') { if (st[i] > 0 && !foam[i]) { foam[i] = 1; acted++; } }
          else if (p === 'scrub' || p === 'brush') { if (st[i] > 0 && (mode !== 'bath' || foam[i] > 0) && ptr.spd > 40) { st[i] -= dtp * (4.5 - kind[i] * .6) * step; if (st[i] <= 0) { st[i] = 0; acted++; } } }
          else if (p === 'rinse') { if (foam[i] > 0) { foam[i] -= dtp * 6 * step; if (foam[i] <= 0) { foam[i] = 0; acted++; } } wet[i] = 1; }
          else if (p === 'dry' || p === 'shine') { if (wet[i] && ptr.spd > 30) { wet[i] = 0; acted++; } }
          else if (p === 'wax') { if (!foam[i]) { foam[i] = 1; acted++; } }
          else if (p === 'buff') { if (foam[i] > 0 && ptr.spd > 40) { foam[i] -= dtp * 4 * step; if (foam[i] <= 0) { foam[i] = 0; acted++; } } }
        });
      }
      if (acted && Math.random() < .35) { sfx('pop'); if (p === 'rinse') fx.burst(ptr.x, ptr.y, 2, { spd: 60, life: .4, size: 3, col: '#7dd3fc', g: 200 }); if (p === 'scrub') fx.burst(ptr.x, ptr.y, 2, { spd: 50, life: .4, size: 2, col: '#d6b98c' }); }
      if ((p === 'scrub' && mode === 'bath') && !acted && ptr.spd > 60 && Math.random() < .03) fx.text('🧼?', ptr.x, ptr.y - 20, '#fff', 18);
    }
    prog = phaseReady && phase < PH.length ? clamp(measure(), 0, 1) : 0; const need = (p === 'rinse' || p === 'buff') ? .94 : .93; if (phase < PH.length && phaseReady && prog >= need) advance();
    if (left <= 0) end(false);
    cx.clearRect(0, 0, W, H); fx.begin(cx);
    if (mode === 'bath') { GK.grad(cx, W, H, ['#a5f3fc', '#e0f2fe']); cx.fillStyle = 'rgba(255,255,255,.55)'; for (let y = 0; y < H; y += 46) for (let x = (y / 46 % 2) * 23; x < W; x += 46) { cx.strokeStyle = 'rgba(14,116,144,.14)'; cx.strokeRect(x, y, 46, 46); } } else GK.grad(cx, W, H, ['#fef3c7', '#fde68a']);
    cx.fillStyle = mode === 'bath' ? 'rgba(125,211,252,.55)' : 'rgba(0,0,0,.08)'; cx.beginPath(); cx.ellipse(180, 350, 150, 40, 0, 0, 7); cx.fill();
    if (img) cx.drawImage(img, cxm - 120 * (img.width / img.height) * .98, cym - 120 + 10 - 6, 240 * (img.width / img.height) * .98 * .98, 240 * .98); else GK.draw(cx, cfg.base || '🧸', cxm, cym, 200);
    for (let i = 0; i < N; i++) {
      if (!mask[i]) continue; const x = GX0 + (i % GW) * CS + CS / 2, y = GY0 + Math.floor(i / GW) * CS + CS / 2;
      if (wet[i]) { cx.fillStyle = 'rgba(125,211,252,.22)'; cx.fillRect(x - 5, y - 5, 10, 10); }
      if (st[i] > 0) { cx.globalAlpha = clamp(.45 + st[i] * .3, .45, .95); cx.fillStyle = stainCols[kind[i]] || '#7b5a3a'; cx.beginPath(); cx.arc(x, y, 7.5, 0, 7); cx.fill(); cx.globalAlpha = 1; }
      if (foam[i] > 0) { cx.fillStyle = (cur() === 'wax' || cur() === 'buff') ? 'rgba(251,191,36,' + (.3 + foam[i] * .5) + ')' : 'rgba(255,255,255,' + (.55 + foam[i] * .4) + ')'; cx.beginPath(); cx.arc(x + Math.sin(i) * 2, y + Math.cos(i * 1.7) * 2, 7 * Math.min(1, foam[i] + .3), 0, 7); cx.fill(); if (i % 5 === 0) { cx.fillStyle = 'rgba(186,230,253,.8)'; cx.beginPath(); cx.arc(x + 2, y - 2, 2, 0, 7); cx.fill(); } }
    }
    if (phase >= PH.length) for (let k = 0; k < 8; k++) { const a = t * 2 + k * .8; GK.draw(cx, '✨', cxm + Math.cos(a) * 100, cym + Math.sin(a * 1.3) * 90, 20); }
    duckList.forEach(dk => GK.draw(cx, '🦆', dk.x, dk.y, 44, Math.sin(t * 5) * .15));
    if (ptr.down || true) { const tool = phase < PH.length ? TOOL[cur()] : '✨'; GK.draw(cx, tool, ptr.x + 14, ptr.y - 8, 50, ptr.down ? Math.sin(t * 22) * .3 : -.3, false, ptr.down ? 1 : .5); }
    GK.bar(cx, 30, 408, 300, 16, phase >= PH.length ? 1 : prog, '#22c55e'); cx.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i < PH.length; i++) { GK.txt(cx, TOOL[PH[i]], 30 + (i + .5) * 300 / PH.length, 440, 22); if (i < phase) GK.txt(cx, '✓', 30 + (i + .5) * 300 / PH.length + 12, 430, 14, '#4ade80'); }
    fx.draw(cx); fx.end(cx);
    hud.set('⏱ ' + Math.max(0, Math.ceil(left)), phase < PH.length ? TOOL[cur()] + ' ' + tx(LAB[cur()]) + ' ' + Math.round(prog * 100) + '%' : '✨', '🦆 ' + ducks);
  });
  GK.count(c.wrap, K, startPhase, '👆 ' + TOOL[PH[0]]);
  return () => K.stop();
};

/* =====================================================================
   COOK — multi-step kitchen game: add, chop, mix, bake, season
   steps: ['add:🥚','chop:🥕','mix','bake','season', ...]
   ===================================================================== */
GAMES.cook = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 460;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  let steps = (cfg.steps || ['🥚', '🥛', '🧈']).map(s => /^(add|chop|mix|bake|season):?/.test(s) ? s : 'add:' + s);
  if (!cfg.steps || !cfg.steps.some(s => /^(chop|mix|bake|season)/.test(s))) { const adds = steps.filter(s => s.startsWith('add')); steps = []; adds.forEach((s, i) => { steps.push(s); if (i === 1) steps.push('mix'); if (i === adds.length - 1) steps.push('bake'); }); if (adds.length > 3) steps.splice(2, 0, 'chop:' + adds[0].slice(4)); }
  const extra = (cfg.extra || ['🧦', '🥕', '🌶️', '🍋']), potE = cfg.pot || '🍲';
  const blankS = () => ({ done: true, pieces: [], tiles: [], n: 0, need: 1, ang: 0, inZone: 0, temp: 0, zc: .6, zw: .2, hit: 0, beats: 0, ring: 0 });
  let si = 0, scores = [], t = 0, over = false, mistakes = 0, stepT = 0, S = blankS(), tiles = [], pot = { fill: 0, wob: 0 }, steam = 0;
  const type = () => (steps[si] || '').split(':')[0], arg = () => (steps[si] || '').split(':')[1];
  function beginStep() {
    stepT = 0; S = {}; const ty = type();
    if (ty === 'add') { const all = shuf([arg()].concat(extra.filter(e => e !== arg()).slice(0, 4), steps.filter(s => s.startsWith('add')).map(s => s.slice(4)).filter(e => e !== arg()).slice(0, 1))); S.tiles = all.map((e, i) => ({ e, x: 36 + (i % 3) * 96, y: 290 + Math.floor(i / 3) * 80, right: e === arg(), shake: 0 })); S.limit = 9; }
    else if (ty === 'chop') { S.need = 6 + Math.round(d * 3); S.n = 0; S.limit = 8; S.pieces = []; }
    else if (ty === 'mix') { S.ang = 0; S.need = (3 + d * 2) * Math.PI * 2; S.last = null; S.limit = 9; S.good = 0; }
    else if (ty === 'bake') { S.temp = .2; S.zc = rnd(.5, .75); S.zw = .24 - d * .07; S.hold = false; S.inZone = 0; S.need = 3.2; S.limit = 10; S.burn = 0; }
    else if (ty === 'season') { S.beats = 0; S.hit = 0; S.need = 5; S.next = .6; S.limit = 8; S.ring = 0; }
    GK.flash(c.wrap, K, ({ add: '➕', chop: '🔪', mix: '🥄', bake: '🔥', season: '🧂' })[ty] + ' ' + (ty === 'add' ? arg() : ''), 700);
  }
  function stepDone(sc) { scores.push(clamp(sc, 0, 100)); sfx(sc > 60 ? 'win' : 'ok'); fx.burst(180, 150, 18, { spd: 160, e: sc > 80 ? '⭐' : null, size: 4 }); si++; S = blankS(); if (si >= steps.length) { over = true; sfx('win'); const avg = scores.reduce((a, b) => a + b, 0) / scores.length; K.after(() => fin(clamp(avg - mistakes * 3, 0, 100), ['👨‍🍳 ' + steps.length + '/' + steps.length]), 800); } else K.after(beginStep, 700); }
  let drag = null;
  GK.input(K, c, {
    down(p) {
      if (over) return; const ty = type();
      if (ty === 'add') { S.tiles.forEach(tl => { if (Math.abs(p.x - (tl.x + 40)) < 44 && Math.abs(p.y - (tl.y + 32)) < 36 && !S.done) { if (tl.right) { S.done = true; pot.fill += 1; pot.wob = .5; fx.burst(180, 190, 14, { spd: 110, e: tl.e, size: 3 }); sfx('pop'); stepDone(clamp(100 - stepT * 6, 55, 100)); } else { tl.shake = .4; mistakes++; sfx('bad'); S.pen = (S.pen || 0) + 1; } } }); }
      else if (ty === 'chop') { S.n++; S.knife = .15; sfx('pop'); S.pieces.push({ x: 150 + rnd(-40, 40), y: 260 + rnd(-10, 10), vx: rnd(-60, 60), vy: rnd(-200, -120) }); fx.burst(180, 260, 4, { spd: 60, life: .3, size: 2, col: '#fff' }); if (S.n >= S.need) stepDone(clamp(100 - stepT * 7 + 10, 45, 100)); }
      else if (ty === 'mix') { S.last = Math.atan2(p.y - 250, p.x - 180); S.dragging = true; }
      else if (ty === 'bake') { S.hold = true; }
      else if (ty === 'season') { const e = Math.abs(S.ring - 0); S.tapped = true; const dd = Math.abs(S.next - stepT); if (dd < .28) { S.hit++; fx.text('✨', 180, 200, '#fde047', 28); sfx('ok'); } else { sfx('bad'); mistakes++; } }
    },
    move(p, e, down) { if (type() === 'mix' && down && S.last != null) { const a = Math.atan2(p.y - 250, p.x - 180), r = Math.hypot(p.x - 180, p.y - 250); let da = a - S.last; if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2; if (r > 25 && r < 130) { S.ang += Math.abs(da); S.good += Math.abs(da); } S.last = a; S.sp = { x: p.x, y: p.y }; if (S.ang >= S.need) { S.last = null; stepDone(clamp(100 - stepT * 6 + 10, 50, 100)); } } },
    up() { if (type() === 'bake') S.hold = false; if (type() === 'mix') S.last = null; }
  });
  GK.keys(K, code => { if (type() === 'season' && code === 'Space') { const dd = Math.abs(S.next - stepT); if (dd < .28) { S.hit++; sfx('ok'); } else { sfx('bad'); mistakes++; } } });
  K.loop(dt => {
    if (over) return; t += dt; stepT += dt; fx.update(dt); pot.wob = Math.max(0, pot.wob - dt); steam += dt; const ty = type();
    if (S.limit && stepT > S.limit && !S.done) { S.done = true; stepDone(ty === 'add' ? 30 : ty === 'chop' ? (S.n / S.need) * 60 : ty === 'mix' ? (S.ang / S.need) * 60 : ty === 'bake' ? (S.inZone / S.need) * 70 : (S.hit / S.need) * 70); }
    if (ty === 'bake' && !S.done) { S.temp += (S.hold ? .42 : -.3) * dt + Math.sin(t * 5) * .05 * dt; S.temp = clamp(S.temp, 0, 1); if (Math.abs(S.temp - S.zc) < S.zw / 2) { S.inZone += dt; } if (S.temp > .95) S.burn += dt; if (S.inZone >= S.need) { S.done = true; stepDone(clamp(100 - S.burn * 20 - stepT * 2, 50, 100)); } }
    if (ty === 'season' && !S.done) { if (stepT > S.next + .3) { S.beats++; S.next += .75; if (S.beats >= S.need) { S.done = true; stepDone(S.hit / S.need * 100); } } S.ring = (S.next - stepT); }
    if (ty === 'chop' && S.pieces) S.pieces.forEach(p => { p.vy += 800 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }); if (S.knife) S.knife = Math.max(0, S.knife - dt);
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, ['#fef3c7', '#fed7aa']); cx.fillStyle = '#92400e'; cx.fillRect(0, 280, W, 180); cx.fillStyle = '#b45309'; cx.fillRect(0, 280, W, 8);
    cx.fillStyle = 'rgba(255,255,255,.55)'; GK.rr(cx, 14, 10, 332, 44, 14); cx.fill(); steps.forEach((s, i) => { const sx = 24 + i * Math.min(48, 300 / steps.length), e = s.startsWith('add') ? s.slice(4) : s.startsWith('chop') ? '🔪' : s.startsWith('mix') ? '🥄' : s.startsWith('bake') ? '🔥' : '🧂'; GK.draw(cx, e, sx + 12, 32, i === si ? 34 : 24, 0, false, i < si ? .3 : 1); if (i === si) { cx.strokeStyle = '#7c3aed'; cx.lineWidth = 3; cx.strokeRect(sx - 6, 14, 36, 36); } });
    GK.shadow(cx, 180, 250, 90, .25); GK.draw(cx, potE, 180, 205 + (pot.wob > 0 ? Math.sin(t * 40) * 3 : 0), 130); for (let i = 0; i < 4; i++) { const sy = 120 - ((steam * 40 + i * 25) % 70); cx.globalAlpha = .4 * (1 - (120 - sy) / 70); GK.draw(cx, '💨', 160 + i * 14 + Math.sin(steam * 2 + i) * 6, sy, 24); cx.globalAlpha = 1; }
    if (ty === 'add' && S.tiles) S.tiles.forEach(tl => { const ox = tl.shake > 0 ? Math.sin(t * 60) * 5 : 0; tl.shake = Math.max(0, tl.shake - dt); cx.fillStyle = tl.shake > 0 ? '#fecaca' : '#fff'; GK.rr(cx, tl.x + ox, tl.y, 80, 64, 16); cx.fill(); cx.fillStyle = 'rgba(0,0,0,.12)'; GK.rr(cx, tl.x + ox, tl.y + 56, 80, 8, 4); cx.fill(); GK.draw(cx, tl.e, tl.x + 40 + ox, tl.y + 32, 42); });
    if (ty === 'chop') { cx.fillStyle = '#d6b98c'; GK.rr(cx, 40, 270, 280, 90, 14); cx.fill(); GK.draw(cx, arg(), 150, 290, 70, 0, false, 1 - S.n / S.need * .6); S.pieces.forEach(p => GK.draw(cx, arg(), p.x, p.y, 22)); GK.draw(cx, '🔪', 210, 300 - (S.knife || 0) * 120, 70, -.7 + (S.knife ? .6 : 0)); GK.bar(cx, 40, 372, 280, 14, S.n / S.need, '#22c55e'); GK.txt(cx, '👆 ' + S.n + '/' + S.need, 180, 410, 20); }
    if (ty === 'mix') { cx.strokeStyle = 'rgba(124,58,237,.4)'; cx.lineWidth = 3; cx.setLineDash([8, 8]); cx.beginPath(); cx.arc(180, 250, 80, 0, 7); cx.stroke(); cx.setLineDash([]); const a = S.last != null && S.sp ? Math.atan2(S.sp.y - 250, S.sp.x - 180) : t * .8; GK.draw(cx, '🥄', 180 + Math.cos(a) * 60, 250 + Math.sin(a) * 40, 60, a); GK.bar(cx, 40, 372, 280, 14, S.ang / S.need, '#a855f7'); GK.txt(cx, '🔄', 180, 410, 26); }
    if (ty === 'bake') { GK.bar(cx, 30, 300, 24, 130, 1, 'rgba(255,255,255,.2)', 'rgba(0,0,0,.4)'); cx.fillStyle = 'rgba(34,197,94,.75)'; cx.fillRect(30, 300 + 130 * (1 - S.zc - S.zw / 2), 24, 130 * S.zw); cx.fillStyle = '#fff'; cx.fillRect(26, 300 + 130 * (1 - S.temp) - 3, 32, 6); GK.txt(cx, S.temp > .9 ? '🔥🔥' : '🔥', 42, 290, 24); GK.bar(cx, 80, 376, 240, 14, S.inZone / S.need, '#f97316'); GK.txt(cx, S.hold ? '🔥⬆️' : '👆 ' + ui('gm_hold'), 200, 330, 24); }
    if (ty === 'season') { for (let i = 0; i < S.need; i++) GK.draw(cx, i < S.hit ? '✨' : '🧂', 70 + i * 55, 340, 34, 0, false, i < S.beats ? .5 : 1); const u = clamp(S.ring / .75, 0, 1); cx.strokeStyle = '#fde047'; cx.lineWidth = 5; cx.beginPath(); cx.arc(180, 410, 18 + u * 44, 0, 7); cx.stroke(); cx.strokeStyle = '#fff'; cx.beginPath(); cx.arc(180, 410, 18, 0, 7); cx.stroke(); GK.txt(cx, '🧂', 180, 410, 22); }
    fx.draw(cx); fx.end(cx);
    hud.set('👨‍🍳 ' + (si + 1) + '/' + steps.length, ty === 'add' ? '➕ ' + arg() : '', '⏱ ' + Math.max(0, Math.ceil((S.limit || 0) - stepT)));
  });
  GK.count(c.wrap, K, beginStep, '🍳');
  return () => K.stop();
};

/* =====================================================================
   DECORATE — customers order a look; recreate it from the palette
   ===================================================================== */
GAMES.decorate = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, CUST = cfg.customers || 3;
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const base = cfg.base || '🍩', slotsN = clamp(cfg.slots || 3 + Math.round(d * 1), 3, 4), pool = cfg.items || ['🍓', '🍫', '🌈', '⭐', '🍬', '🥜', '🍒', '🌸'];
  const SP = [[180, 150], [110, 250], [250, 250], [180, 330]].slice(0, slotsN);
  let cust = 0, order = [], placed = [], sel = 0, t = 0, over = false, tl = 0, scores = [], palette = [], timeMax = 24;
  const bgi = cfg.art ? GK.artImg(cfg.art, {}, im => { img = im; }) : null; let img = null;
  function newCust() {
    cust++; if (cust > CUST) return end(); order = SP.map(() => pick(pool)); placed = SP.map(() => null); sel = 0; tl = timeMax - d * 6; palette = shuf(pool).slice(0, 7); order.forEach(o => { if (!palette.includes(o)) palette[ri(0, 6)] = o; });
  }
  GK.input(K, c, { down(p) {
    if (over) return; let hit = false;
    SP.forEach((s, i) => { if (Math.hypot(p.x - s[0], p.y - s[1]) < 38) { sel = i; hit = true; sfx('tap'); } });
    palette.forEach((e, i) => { const x = 28 + i * 44 + (i > 3 ? 0 : 0), y = 432; if (Math.abs(p.x - (x + 20)) < 22 && Math.abs(p.y - y) < 28) { placed[sel] = e; sfx('pop'); fx.burst(SP[sel][0], SP[sel][1], 8, { spd: 80, life: .4, size: 3 }); let nx = placed.findIndex(v => v === null); if (nx >= 0) sel = nx; } });
  } });
  function submit() { if (over) return; const ok = placed.filter((e, i) => e === order[i]).length; const sc = ok / SP.length * 82 + clamp(tl / timeMax, 0, 1) * 18 * (ok / SP.length); scores.push(sc); sfx(ok === SP.length ? 'win' : ok > 0 ? 'ok' : 'bad'); fx.text(ok + '/' + SP.length + (ok === SP.length ? ' ⭐' : ''), 180, 90, ok === SP.length ? '#fde047' : '#fff', 30); if (ok === SP.length) fx.burst(180, 200, 28, { spd: 190, e: '⭐', size: 4 }); K.after(newCust, 900); tl = 999; }
  GK.keys(K, code => { if (code === 'Enter') submit(); });
  function end() { if (over) return; over = true; fin(clamp(scores.reduce((a, b) => a + b, 0) / CUST, 0, 100), ['🎨 ' + scores.length + '/' + CUST]); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); if (tl < 900) { tl -= dt; if (tl <= 0) submit(); }
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, cfg.bg || ['#fde68a', '#fbcfe8']); cx.fillStyle = 'rgba(255,255,255,.7)'; GK.rr(cx, 20, 10, 320, 72, 18); cx.fill(); GK.txt(cx, '🙋', 46, 46, 34); GK.rr(cx, 80, 18, 250, 56, 14); cx.fillStyle = '#fff'; cx.fill(); order.forEach((o, i) => { GK.draw(cx, o, 112 + i * 62, 46, 38); if (placed[i] != null) GK.txt(cx, placed[i] === o ? '✓' : '✗', 112 + i * 62 + 18, 66, 16, placed[i] === o ? '#4ade80' : '#f87171'); });
    cx.fillStyle = 'rgba(255,255,255,.55)'; cx.beginPath(); cx.ellipse(180, 255, 150, 100, 0, 0, 7); cx.fill();
    if (img) { const h = 200, w = h * img.width / img.height; cx.globalAlpha = .9; cx.drawImage(img, 180 - w / 2, 150, w, h); cx.globalAlpha = 1; } else GK.draw(cx, base, 180, 240, 150);
    SP.forEach((s, i) => { cx.strokeStyle = i === sel ? '#7c3aed' : 'rgba(0,0,0,.35)'; cx.lineWidth = i === sel ? 5 : 3; cx.setLineDash(i === sel ? [] : [6, 6]); cx.beginPath(); cx.arc(s[0], s[1], 34, 0, 7); cx.stroke(); cx.setLineDash([]); if (placed[i]) GK.draw(cx, placed[i], s[0], s[1], 44, 0, false, 1, 1 + Math.sin(t * 4) * .02); else GK.txt(cx, String(i + 1), s[0], s[1], 20, 'rgba(0,0,0,.35)'); });
    palette.forEach((e, i) => { const x = 28 + i * 44; cx.fillStyle = '#fff'; GK.rr(cx, x, 412, 40, 40, 12); cx.fill(); cx.fillStyle = 'rgba(0,0,0,.1)'; GK.rr(cx, x, 446, 40, 6, 3); cx.fill(); GK.draw(cx, e, x + 20, 432, 28); });
    cx.fillStyle = '#22c55e'; GK.rr(cx, 110, 360, 140, 40, 20); cx.fill(); GK.txt(cx, '✓ OK', 180, 380, 20);
    GK.bar(cx, 30, 464, 300, 8, tl > 900 ? 0 : tl / (timeMax - d * 6), '#f97316');
    fx.draw(cx); fx.end(cx);
    hud.set('🙋 ' + Math.min(cust, CUST) + '/' + CUST, '🎨 ' + placed.filter(v => v).length + '/' + SP.length, '⏱ ' + (tl > 900 ? 0 : Math.max(0, Math.ceil(tl))));
  });
  K.on(c.cv, 'pointerdown', e => { const p = c.pos(e); if (p.x > 110 && p.x < 250 && p.y > 360 && p.y < 400) submit(); });
  GK.count(c.wrap, K, newCust, '🙋 ' + ui('gm_order'));
  return () => K.stop();
};
