'use strict';
/* ---------- helpers ---------- */
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuf = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function mk(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

/* tiny synth sound effects */
let AC = null, SND = true;
function sfx(t) {
  if (!SND) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const seqs = { tap: [[520, .05]], ok: [[660, .07], [880, .1]], win: [[523, .1], [659, .1], [784, .1], [1046, .22]], bad: [[220, .14], [160, .18]], eat: [[300, .05], [360, .05], [300, .05]], lvl: [[392, .1], [523, .1], [659, .1], [784, .1], [1046, .25]], pop: [[760, .04]], coin: [[988, .06], [1319, .12]] };
    let t0 = AC.currentTime;
    (seqs[t] || []).forEach(([f, d]) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(.12, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + d);
      o.connect(g); g.connect(AC.destination); o.start(t0); o.stop(t0 + d); t0 += d * .9;
    });
  } catch (e) { }
}

function killer() {
  const ids = [], ints = [], offs = []; let raf = 0, dead = false;
  return {
    loop(fn) { let last = performance.now(); const f = t => { if (dead) return; const dt = Math.min(.05, (t - last) / 1000) * (window.__TURBO || 1); last = t; fn(dt, t); if (!dead) raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); },
    after(fn, ms) { const id = setTimeout(() => { if (!dead) fn(); }, ms / (window.__TURBO || 1)); ids.push(id); return id; },
    every(fn, ms) { const id = setInterval(() => { if (!dead) fn(); }, ms); ints.push(id); return id; },
    on(t, e, fn, o) { t.addEventListener(e, fn, o); offs.push(() => t.removeEventListener(e, fn, o)); },
    stop() { dead = true; cancelAnimationFrame(raf); ids.forEach(clearTimeout); ints.forEach(clearInterval); offs.forEach(f => f()); },
    get dead() { return dead; }
  };
}
function mkCanvas(host, W, H) {
  const cv = document.createElement('canvas'); const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = W * dpr; cv.height = H * dpr; cv.className = 'gcv'; cv.style.aspectRatio = W + '/' + H;
  const cx = cv.getContext('2d'); cx.scale(dpr, dpr); host.appendChild(cv); return { cv, cx };
}
function cpos(e, cv, W, H) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
function hudEl(host) { const h = mk('div', 'g-hud', '<span class="h1"></span><span class="h2"></span>'); host.appendChild(h); return { a: h.children[0], b: h.children[1] }; }
function emo(cx, e, x, y, s) { cx.font = s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(e, x, y); }
const PADCOL = ['#ef5350', '#fdd835', '#66bb6a', '#42a5f5', '#ab47bc', '#ff7043'];

const GAMES = {};

/* 1. TIMING — stop the marker in the green zone */
GAMES.timing = (host, cfg, fin) => {
  const K = killer(), R = cfg.rounds || 5, d = cfg.d || .3;
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="tm-target">${cfg.icon || '🎯'}</div><div class="tm-bar"><div class="tm-zone"></div><div class="tm-mark"></div></div><div class="tm-msg">&nbsp;</div><button class="bigbtn">${ui('tapbtn')}</button>`;
  const zone = host.querySelector('.tm-zone'), mark = host.querySelector('.tm-mark'), msg = host.querySelector('.tm-msg'), h1 = host.querySelector('.h1'), h2 = host.querySelector('.h2'), btn = host.querySelector('.bigbtn');
  let round = 0, pos = 0, dir = 1, zc = .5, zw = .3, speed = 1, total = 0, active = false;
  function setup() {
    round++; zw = clamp(.32 - d * .13 - round * .02, .09, .4); zc = rnd(zw / 2 + .04, 1 - zw / 2 - .04);
    speed = .8 + d * .8 + round * .1; zone.style.left = (zc - zw / 2) * 100 + '%'; zone.style.width = zw * 100 + '%';
    pos = Math.random() < .5 ? 0 : 1; dir = pos ? -1 : 1; h1.textContent = ui('round') + ' ' + round + '/' + R; h2.textContent = '⭐ ' + Math.round(total / Math.max(1, round - 1) || 0); msg.innerHTML = '&nbsp;'; active = true;
  }
  K.loop(dt => { if (!active) return; pos += dir * speed * dt; if (pos > 1) { pos = 1; dir = -1; } if (pos < 0) { pos = 0; dir = 1; } mark.style.left = pos * 100 + '%'; });
  function tap() {
    if (!active) return; active = false;
    const dist = Math.abs(pos - zc); let pts;
    if (dist <= zw / 2) { pts = dist < zw * .1 ? 100 : 100 - (dist / (zw / 2)) * 34; msg.textContent = pts >= 95 ? ui('perfect') : ui('good'); sfx('ok'); }
    else { pts = Math.max(0, 28 - (dist - zw / 2) * 130); msg.textContent = ui('miss'); sfx('bad'); }
    total += pts; msg.className = 'tm-msg ' + (pts >= 65 ? 'okk' : 'bad');
    K.after(() => { if (round >= R) fin(total / R); else setup(); }, 750);
  }
  btn.onclick = tap; K.on(document, 'keydown', e => { if (e.code === 'Space') { e.preventDefault(); tap(); } });
  setup(); return () => K.stop();
};

/* 2. CATCH — move the basket */
GAMES.catch = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, TT = cfg.time || 22, W = 360, H = 460;
  const hud = hudEl(host); const { cv, cx } = mkCanvas(host, W, H);
  let bx = W / 2, tx = bx, left = TT, items = [], sp = .4, gotG = 0, hitB = 0, spG = 0, done = false, fl = 0;
  const good = cfg.good || ['🍎', '🍌', '🍓'], bad = cfg.bad || ['💣'], me = cfg.me || '🧺', keys = {};
  K.on(cv, 'pointermove', e => { tx = cpos(e, cv, W, H).x; }); K.on(cv, 'pointerdown', e => { tx = cpos(e, cv, W, H).x; });
  K.on(document, 'keydown', e => { keys[e.code] = 1; }); K.on(document, 'keyup', e => { keys[e.code] = 0; });
  K.loop(dt => {
    if (done) return; left -= dt; sp -= dt; fl = Math.max(0, fl - dt);
    if (keys.ArrowLeft || keys.KeyA) tx -= 320 * dt; if (keys.ArrowRight || keys.KeyD) tx += 320 * dt;
    tx = clamp(tx, 30, W - 30); bx += (tx - bx) * Math.min(1, dt * 14);
    if (sp <= 0 && left > 1.4) { sp = .62 - d * .26 + rnd(0, .22); const b = Math.random() < .2 + d * .14; if (!b) spG++; items.push({ x: rnd(26, W - 26), y: -24, v: rnd(120, 170) + d * 140, e: b ? pick(bad) : pick(good), b }); }
    items.forEach(it => it.y += it.v * dt);
    items = items.filter(it => { if (it.y > H - 66 && it.y < H - 18 && Math.abs(it.x - bx) < 46) { if (it.b) { hitB++; fl = .3; sfx('bad'); } else { gotG++; sfx('coin'); } return false; } return it.y < H + 30; });
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = fl > 0 ? 'rgba(255,80,80,.25)' : 'rgba(255,255,255,.0)'; cx.fillRect(0, 0, W, H);
    items.forEach(it => emo(cx, it.e, it.x, it.y, 34)); emo(cx, me, bx, H - 40, 52);
    hud.a.textContent = ui('time') + ': ' + Math.max(0, Math.ceil(left)); hud.b.textContent = '✅ ' + gotG + '   💥 ' + hitB;
    if (left <= 0) { done = true; fin(clamp((gotG - hitB * 1.2) / Math.max(1, spG) * 105, 0, 100)); }
  });
  return () => K.stop();
};

/* 3. MEMORY — match pairs */
GAMES.memory = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, pairs = clamp(Math.round(5 + d * 4), 5, 9);
  const pool = (cfg.cards || []).concat(['🍎', '🍌', '⭐', '🎈', '🎵', '🌸', '🍓', '🐟', '🍪', '🍩']);
  const em = [...new Set(pool)].slice(0, pairs), cards = shuf(em.concat(em));
  const cols = cards.length <= 12 ? 4 : cards.length <= 16 ? 4 : 6;
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="mem-grid" style="grid-template-columns:repeat(${cols},1fr)"></div>`;
  const grid = host.querySelector('.mem-grid'), h1 = host.querySelector('.h1'), h2 = host.querySelector('.h2');
  let first = null, lock = false, moves = 0, found = 0;
  cards.forEach((e, i) => {
    const c = mk('button', 'mem-card', `<span class="mf">${e}</span><span class="mb">${cfg.back || '❓'}</span>`); c.dataset.e = e;
    c.onclick = () => {
      if (lock || c.classList.contains('up') || c.classList.contains('ok')) return; sfx('tap'); c.classList.add('up');
      if (!first) { first = c; return; }
      moves++; h1.textContent = '👣 ' + moves;
      if (first.dataset.e === c.dataset.e) { first.classList.add('ok'); c.classList.add('ok'); first = null; found++; h2.textContent = '✅ ' + found + '/' + pairs; sfx('ok'); if (found === pairs) K.after(() => fin(clamp(100 - (moves - pairs) * (100 / (pairs * 1.6)), 5, 100)), 600); }
      else { lock = true; const f = first; first = null; K.after(() => { f.classList.remove('up'); c.classList.remove('up'); lock = false; }, 700); }
    };
    grid.appendChild(c);
  });
  h1.textContent = '👣 0'; h2.textContent = '✅ 0/' + pairs;
  return () => K.stop();
};

/* 4. TAP — tap fast */
GAMES.tap = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, secs = cfg.secs || 8, goal = cfg.goal || Math.round(secs * (3.1 + d * 1.7));
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="prog"><i></i></div><button class="tapbig">${cfg.icon || '👆'}</button><div class="tm-msg">${cfg.label || ''}</div>`;
  const bar = host.querySelector('.prog i'), btn = host.querySelector('.tapbig'), h1 = host.querySelector('.h1'), h2 = host.querySelector('.h2');
  let n = 0, left = secs, started = false, done = false;
  const tap = () => { if (done) return; started = true; n++; sfx('pop'); btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse'); bar.style.width = Math.min(100, n / goal * 100) + '%'; h2.textContent = '👆 ' + n; if (n >= goal) { done = true; K.after(() => fin(100), 300); } };
  btn.onpointerdown = e => { e.preventDefault(); tap(); }; K.on(document, 'keydown', e => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); tap(); } });
  K.loop(dt => { if (done || !started) { h1.textContent = ui('time') + ': ' + Math.ceil(left); return; } left -= dt; h1.textContent = ui('time') + ': ' + Math.max(0, Math.ceil(left)); if (left <= 0) { done = true; fin(clamp(n / goal * 100, 0, 99)); } });
  return () => K.stop();
};

/* 5. TUG — tug of war */
GAMES.tug = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, TT = cfg.secs || 12;
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="tug"><span class="tf">${cfg.foe || '🐶'}</span><div class="rope"><i class="flag">🚩</i></div><span class="tf">${cfg.icon || '🐕'}</span></div><button class="tapbig">💪</button>`;
  const flag = host.querySelector('.flag'), btn = host.querySelector('.tapbig'), h1 = host.querySelector('.h1'), h2 = host.querySelector('.h2');
  let p = 0, left = TT, started = false, done = false, surge = 0;
  const tap = () => { if (done) return; started = true; p += .05; sfx('pop'); btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse'); };
  btn.onpointerdown = e => { e.preventDefault(); tap(); }; K.on(document, 'keydown', e => { if (e.code === 'Space') { e.preventDefault(); tap(); } });
  K.loop(dt => {
    if (done) return;
    if (started) { left -= dt; surge -= dt; if (surge <= 0) surge = rnd(.5, 1.4); p -= (.22 + d * .34 + (surge < .3 ? .2 : 0)) * dt; }
    p = clamp(p, -1, 1); flag.style.left = (50 + p * 46) + '%'; h1.textContent = ui('time') + ': ' + Math.max(0, Math.ceil(left)); h2.textContent = p > 0 ? '👍' : '😬';
    if (p >= 1) { done = true; sfx('win'); fin(100); } else if (p <= -1) { done = true; sfx('bad'); fin(12); } else if (left <= 0) { done = true; fin(clamp((p + 1) / 2 * 90, 0, 90)); }
  });
  return () => K.stop();
};

/* 6. SIMON — repeat the sequence */
GAMES.simon = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, R = cfg.rounds || 5, pads = cfg.pads || ['🔴', '🟡', '🟢', '🔵'];
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="tm-msg big">&nbsp;</div><div class="simon"></div>`;
  const grid = host.querySelector('.simon'), msg = host.querySelector('.tm-msg'), h1 = host.querySelector('.h1'), h2 = host.querySelector('.h2');
  const els = pads.map((e, i) => { const b = mk('button', 'spad', e); b.style.background = PADCOL[i % PADCOL.length]; b.onclick = () => press(i); grid.appendChild(b); return b; });
  let seq = [], idx = 0, accept = false, lives = 2, rounds = 0;
  const flash = (i, ms) => { els[i].classList.add('lit'); sfx('tap'); K.after(() => els[i].classList.remove('lit'), ms || 350); };
  function play() {
    accept = false; msg.textContent = ui('watch'); idx = 0; const gap = Math.max(380, 760 - d * 260);
    seq.forEach((s, i) => K.after(() => flash(s, gap * .6), 600 + i * gap));
    K.after(() => { accept = true; msg.textContent = ui('yourturn'); }, 600 + seq.length * gap);
  }
  function next() { seq.push(ri(0, pads.length - 1)); if (seq.length < (cfg.start || 2)) { next(); return; } h1.textContent = ui('round') + ' ' + (rounds + 1) + '/' + R; h2.textContent = '❤️'.repeat(lives); play(); }
  function press(i) {
    if (!accept) return; flash(i, 220);
    if (seq[idx] === i) { idx++; if (idx >= seq.length) { accept = false; rounds++; sfx('ok'); if (rounds >= R) { K.after(() => fin(lives === 2 ? 100 : 82), 500); return; } K.after(next, 800); } }
    else { sfx('bad'); lives--; accept = false; h2.textContent = '❤️'.repeat(Math.max(0, lives)); if (lives <= 0) { msg.textContent = ui('miss'); K.after(() => fin(clamp(rounds / R * 80, 0, 80)), 800); } else { msg.textContent = ui('miss'); K.after(play, 900); } }
  }
  next(); return () => K.stop();
};

/* 7. WHACK — tap good popups, avoid bad */
GAMES.whack = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, TT = cfg.secs || 20, good = cfg.good || ['🐹'], bad = cfg.bad || ['💣'];
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="holes"></div>`;
  const hg = host.querySelector('.holes'), h1 = host.querySelector('.h1'), h2 = host.querySelector('.h2');
  const holes = [...Array(9)].map(() => { const b = mk('button', 'hole', '<span></span>'); hg.appendChild(b); const o = { b, s: b.firstChild, t: 0, bad: false }; b.onpointerdown = e => { e.preventDefault(); hit(o); }; return o; });
  let left = TT, sp = .5, hits = 0, bads = 0, spG = 0, done = false;
  function hit(o) { if (o.t <= 0) return; o.t = 0; o.b.classList.remove('up'); if (o.bad) { bads++; sfx('bad'); } else { hits++; sfx('coin'); } h2.textContent = '✅ ' + hits + '  💥 ' + bads; }
  K.loop(dt => {
    if (done) return; left -= dt; sp -= dt;
    if (sp <= 0 && left > 1) { sp = .62 - d * .3 + rnd(0, .2); const free = holes.filter(h => h.t <= 0); if (free.length) { const o = pick(free); o.bad = Math.random() < .22 + d * .1; o.s.textContent = o.bad ? pick(bad) : pick(good); o.t = 1.25 - d * .5 + rnd(0, .25); o.b.classList.add('up'); if (!o.bad) spG++; } }
    holes.forEach(o => { if (o.t > 0) { o.t -= dt; if (o.t <= 0) o.b.classList.remove('up'); } });
    h1.textContent = ui('time') + ': ' + Math.max(0, Math.ceil(left));
    if (left <= 0) { done = true; fin(clamp((hits - bads * 1.5) / Math.max(1, spG) * 104, 0, 100)); }
  });
  return () => K.stop();
};

/* 8. COOK — ingredients in order, then stir */
GAMES.cook = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, steps = (cfg.steps || ['🥚', '🥛', '🧈', '🍅']).slice(0, clamp(Math.round(3 + d * 3), 3, cfg.steps ? cfg.steps.length : 6));
  const extra = (cfg.extra || ['🧦', '🥕', '🌶️', '🍋']).filter(e => !steps.includes(e)).slice(0, 3);
  const TTOT = 11 + steps.length * 2.4;
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="recipe"></div><div class="prog"><i></i></div><div class="tiles"></div><div class="tm-msg">&nbsp;</div>`;
  const rec = host.querySelector('.recipe'), tiles = host.querySelector('.tiles'), bar = host.querySelector('.prog i'), msg = host.querySelector('.tm-msg'), h1 = host.querySelector('.h1'), h2 = host.querySelector('.h2');
  rec.innerHTML = steps.map((e, i) => `<span class="rs" data-i="${i}"><b>${i + 1}</b>${e}</span>`).join('<em>›</em>');
  let idx = 0, mist = 0, left = TTOT, phase = 0, done = false;
  shuf(steps.concat(extra)).forEach(e => {
    const t = mk('button', 'tile', e);
    t.onclick = () => {
      if (phase !== 0 || t.disabled) return;
      if (e === steps[idx]) { t.disabled = true; t.classList.add('ok'); rec.children[idx * 2].classList.add('done'); idx++; sfx('ok'); if (idx >= steps.length) stir(); }
      else { mist++; left -= 1.5; sfx('bad'); t.classList.add('shake'); K.after(() => t.classList.remove('shake'), 400); }
    };
    tiles.appendChild(t);
  });
  function stir() {
    phase = 1; const need = 10 + Math.round(d * 8); let n = 0, t = 4;
    rec.style.display = 'none'; tiles.innerHTML = `<button class="tapbig">${cfg.pot || '🍲'}</button>`; msg.textContent = '🥄 ' + ui('tapbtn');
    const b = tiles.firstChild; const tap = () => { if (phase !== 1) return; n++; sfx('pop'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); bar.style.width = Math.min(100, n / need * 100) + '%'; if (n >= need) end(1); };
    b.onpointerdown = e => { e.preventDefault(); tap(); }; bar.style.width = '0%'; stirT = t; stirN = () => n / need; stirNeed = need;
  }
  let stirT = 4, stirN = () => 0, stirNeed = 1;
  function end(sf) { if (done) return; done = true; const base = clamp(100 - mist * 13, 40, 100); const timeB = clamp(left / TTOT, 0, 1); fin(clamp(base * .72 + clamp(sf, 0, 1) * 22 + timeB * 6, 0, 100)); }
  K.loop(dt => {
    if (done) return;
    if (phase === 0) { left -= dt; bar.style.width = Math.max(0, left / TTOT * 100) + '%'; h1.textContent = ui('time') + ': ' + Math.max(0, Math.ceil(left)); h2.textContent = '🍳 ' + idx + '/' + steps.length; if (left <= 0) { done = true; fin(clamp(idx / steps.length * 55, 0, 55)); } }
    else { stirT -= dt; h1.textContent = ui('time') + ': ' + Math.max(0, Math.ceil(stirT)); if (stirT <= 0) end(stirN()); }
  });
  return () => K.stop();
};

/* 9. RUNNER — three lanes */
GAMES.runner = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, TT = cfg.time || 24, W = 360, H = 460, lanes = [70, 180, 290];
  const hud = hudEl(host); const { cv, cx } = mkCanvas(host, W, H);
  let lane = 1, px = lanes[1], left = TT, items = [], sp = .3, gotG = 0, hitB = 0, spG = 0, off = 0, done = false, fl = 0, sx = 0;
  const good = cfg.good || ['🪙'], bad = cfg.bad || ['🪨'], me = cfg.me || '🏃';
  const go = dx => { lane = clamp(lane + dx, 0, 2); sfx('tap'); };
  K.on(document, 'keydown', e => { if (e.code === 'ArrowLeft' || e.code === 'KeyA') go(-1); if (e.code === 'ArrowRight' || e.code === 'KeyD') go(1); });
  K.on(cv, 'pointerdown', e => { sx = cpos(e, cv, W, H).x; cv._sx = sx; });
  K.on(cv, 'pointerup', e => { const x = cpos(e, cv, W, H).x; const dx = x - (cv._sx ?? x); if (Math.abs(dx) > 30) go(dx > 0 ? 1 : -1); else go(x > W / 2 ? 1 : -1); });
  K.loop(dt => {
    if (done) return; left -= dt; sp -= dt; fl = Math.max(0, fl - dt); off = (off + (220 + d * 120) * dt) % 60; px += (lanes[lane] - px) * Math.min(1, dt * 16);
    if (sp <= 0 && left > 1.6) { sp = .55 - d * .2 + rnd(0, .16); const n = pick([1, 1, 2]); shuf([0, 1, 2]).slice(0, n).forEach(l => { const b = Math.random() < .3 + d * .15; if (!b) spG++; items.push({ l, y: -30, v: 220 + d * 120, e: b ? pick(bad) : pick(good), b }); }); }
    items.forEach(it => it.y += it.v * dt);
    items = items.filter(it => { if (it.y > H - 100 && it.y < H - 40 && Math.abs(lanes[it.l] - px) < 36) { if (it.b) { hitB++; fl = .3; sfx('bad'); } else { gotG++; sfx('coin'); } return false; } return it.y < H + 30; });
    cx.clearRect(0, 0, W, H); cx.fillStyle = cfg.road || 'rgba(255,255,255,.25)'; cx.fillRect(10, 0, W - 20, H);
    cx.fillStyle = 'rgba(255,255,255,.7)'; for (let y = -60 + off; y < H; y += 60) { cx.fillRect(124, y, 4, 30); cx.fillRect(234, y, 4, 30); }
    if (fl > 0) { cx.fillStyle = 'rgba(255,60,60,.25)'; cx.fillRect(0, 0, W, H); }
    items.forEach(it => emo(cx, it.e, lanes[it.l], it.y, 40)); emo(cx, me, px, H - 70 + Math.sin(performance.now() / 90) * 3, 54);
    hud.a.textContent = ui('time') + ': ' + Math.max(0, Math.ceil(left)); hud.b.textContent = '✅ ' + gotG + '   💥 ' + hitB;
    if (left <= 0) { done = true; fin(clamp((gotG - hitB) / Math.max(1, spG) * 105, 0, 100)); }
  });
  return () => K.stop();
};

/* 10. AIM — lock x then y */
GAMES.aim = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, N = cfg.shots || 5, W = 300, H = 200;
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="aim-area" style="width:${W}px;height:${H}px;${cfg.bgstyle || ''}"><div class="aim-target">${cfg.target || '🎯'}</div><div class="aim-keeper">${cfg.keeper || ''}</div><div class="aim-ball">${cfg.ball || '⚽'}</div><div class="aim-cross">✛</div></div><div class="tm-msg">&nbsp;</div><button class="bigbtn">${ui('tapbtn')}</button>`;
  const q = s => host.querySelector(s), tg = q('.aim-target'), kp = q('.aim-keeper'), ball = q('.aim-ball'), cr = q('.aim-cross'), msg = q('.tm-msg'), h1 = q('.h1'), h2 = q('.h2'), btn = q('.bigbtn');
  const R = 30 - d * 10; let shot = 0, stage = 0, cxp = 0, cyp = H / 2, tx = 0, ty = 0, total = 0, t = 0, active = false, kx = W / 2, sxs = 2.3 + d * 2, sys = 2.6 + d * 2;
  tg.style.width = tg.style.height = R * 2 + 'px'; tg.style.fontSize = R * 1.5 + 'px';
  function setup() { shot++; stage = 0; tx = rnd(60, W - 60); ty = rnd(50, H - 40); tg.style.left = tx - R + 'px'; tg.style.top = ty - R + 'px'; ball.style.opacity = 0; ball.style.left = W / 2 - 14 + 'px'; ball.style.top = H - 26 + 'px'; h1.textContent = ui('round') + ' ' + shot + '/' + N; h2.textContent = '⭐ ' + Math.round(total / Math.max(1, shot - 1) || 0); msg.innerHTML = '&nbsp;'; t = 0; active = true; msg.className = 'tm-msg'; }
  K.loop(dt => {
    if (!active) return; t += dt;
    if (stage === 0) { cxp = (Math.sin(t * sxs) + 1) / 2 * W; cyp = H / 2; } else cyp = (Math.sin(t * sys) + 1) / 2 * H;
    cr.style.left = cxp - 14 + 'px'; cr.style.top = cyp - 14 + 'px';
    if (cfg.keeper) { kx = W / 2 + Math.sin(performance.now() / 1000 * (1.3 + d)) * (W / 2 - 32); kp.style.left = kx - 26 + 'px'; kp.style.top = H - 74 + 'px'; }
  });
  function tap() {
    if (!active) return;
    if (stage === 0) { stage = 1; t = 0; sfx('tap'); return; }
    active = false; ball.style.opacity = 1; ball.style.left = cxp - 14 + 'px'; ball.style.top = cyp - 14 + 'px';
    const dist = Math.hypot(cxp - tx, cyp - ty); let pts;
    if (cfg.keeper && Math.abs(cxp - kx) < 30 && cyp > H - 90) { pts = 0; msg.textContent = ui('saved'); sfx('bad'); msg.classList.add('bad'); }
    else { pts = dist <= R ? 100 : Math.max(0, 100 - (dist - R) / 100 * 100); msg.textContent = pts >= 95 ? ui('perfect') : pts >= 55 ? ui('good') : ui('miss'); sfx(pts >= 55 ? 'ok' : 'bad'); msg.classList.add(pts >= 55 ? 'okk' : 'bad'); }
    total += pts; K.after(() => { if (shot >= N) fin(total / N); else setup(); }, 900);
  }
  btn.onclick = tap; K.on(document, 'keydown', e => { if (e.code === 'Space') { e.preventDefault(); tap(); } });
  setup(); return () => K.stop();
};

/* 11. QUIZ — math / patterns / counting */
GAMES.quiz = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, N = cfg.n || 8, kind = cfg.kind || 'mix', TQ = 10 - d * 3;
  function qmath() { const mx = Math.round(9 + d * 40); let a = ri(1, mx), b = ri(1, mx), op = pick(d > .3 ? ['+', '-', '×'] : ['+', '-']); if (op === '×') { a = ri(2, Math.round(5 + d * 7)); b = ri(2, Math.round(5 + d * 7)); } if (op === '-' && b > a) [a, b] = [b, a]; return { q: `${a} ${op} ${b} = ?`, ans: op === '+' ? a + b : op === '-' ? a - b : a * b }; }
  function qseq() { const s = ri(1, 9), k = ri(2, Math.round(4 + d * 6)); return { q: [0, 1, 2, 3].map(i => s + k * i).join(', ') + ', ?', ans: s + k * 4 }; }
  function qcount() { const e = pick(['🍎', '⭐', '🎈', '🐟', '🍪', '🌸']), n = ri(3, Math.round(8 + d * 8)); return { q: e.repeat(n), ans: n }; }
  function gen() { const k = kind === 'mix' ? pick(['math', 'seq', 'count']) : kind; return k === 'math' ? qmath() : k === 'seq' ? qseq() : qcount(); }
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="prog"><i></i></div><div class="qbox"></div><div class="qopts"></div>`;
  const qb = host.querySelector('.qbox'), qo = host.querySelector('.qopts'), bar = host.querySelector('.prog i'), h1 = host.querySelector('.h1'), h2 = host.querySelector('.h2');
  let n = 0, ok = 0, left = TQ, cur, active = false;
  function nextQ() {
    if (n >= N) { fin(ok / N * 100); return; } n++; cur = gen(); left = TQ; active = true; qb.textContent = cur.q;
    const opts = new Set([cur.ans]); let g = 0; while (opts.size < 4 && g++ < 50) { const v = cur.ans + ri(-5, 5); if (v >= 0 && v !== cur.ans) opts.add(v); }
    qo.innerHTML = ''; shuf([...opts]).forEach(v => { const b = mk('button', 'qopt', String(v)); b.onclick = () => ans(b, v); qo.appendChild(b); }); h1.textContent = n + '/' + N; h2.textContent = '✅ ' + ok;
  }
  function ans(b, v) { if (!active) return; active = false; if (v === cur.ans) { ok++; b.classList.add('ok'); sfx('ok'); } else { b.classList.add('no'); sfx('bad'); } h2.textContent = '✅ ' + ok; K.after(nextQ, 600); }
  K.loop(dt => { if (!active) return; left -= dt; bar.style.width = Math.max(0, left / TQ * 100) + '%'; if (left <= 0) { active = false; sfx('bad'); K.after(nextQ, 400); } });
  nextQ(); return () => K.stop();
};

/* 12. SORT — items to bins */
GAMES.sort = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, N = cfg.n || 14, TI = 3.2 - d * 1.2, bins = cfg.bins, items = cfg.items;
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="prog"><i></i></div><div class="sitem">&nbsp;</div><div class="sbins"></div>`;
  const si = host.querySelector('.sitem'), sb = host.querySelector('.sbins'), bar = host.querySelector('.prog i'), h1 = host.querySelector('.h1'), h2 = host.querySelector('.h2');
  bins.forEach((b, i) => { const e = mk('button', 'sbin', `<span>${b.e}</span><small>${b.l ? tx(b.l) : ''}</small>`); e.onclick = () => choose(b.k); sb.appendChild(e); });
  K.on(document, 'keydown', e => { if (e.code === 'ArrowLeft' && bins[0]) choose(bins[0].k); if (e.code === 'ArrowRight' && bins[bins.length - 1]) choose(bins[bins.length - 1].k); });
  let n = 0, ok = 0, left = TI, cur, active = false;
  function nextI() { if (n >= N) { fin(ok / N * 100); return; } n++; cur = pick(items); left = TI; active = true; si.textContent = cur.e; si.className = 'sitem pop'; h1.textContent = n + '/' + N; h2.textContent = '✅ ' + ok; }
  function choose(k) { if (!active) return; active = false; if (k === cur.k) { ok++; sfx('ok'); si.className = 'sitem good'; } else { sfx('bad'); si.className = 'sitem bad'; } K.after(nextI, 350); }
  K.loop(dt => { if (!active) return; left -= dt; bar.style.width = Math.max(0, left / TI * 100) + '%'; if (left <= 0) { active = false; sfx('bad'); si.className = 'sitem bad'; K.after(nextI, 350); } });
  nextI(); return () => K.stop();
};

/* 13. SCRUB — rub the dirt away */
GAMES.scrub = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, TT = cfg.secs || 14, S = 300;
  host.innerHTML = `<div class="g-hud"><span class="h1"></span><span class="h2"></span></div><div class="scrub-box" style="width:${S}px;height:${S}px"><div class="scrub-base">${cfg.base || '🧸'}</div></div>`;
  const box = host.querySelector('.scrub-box'), h1 = host.querySelector('.h1'), h2 = host.querySelector('.h2');
  const cv = mk('canvas', 'scrub-cv'); cv.width = S; cv.height = S; box.appendChild(cv); const c = cv.getContext('2d');
  c.fillStyle = cfg.dirt || '#7b5a3a'; const nb = 16 + Math.round(d * 8);
  for (let i = 0; i < nb; i++) { const a = rnd(0, 6.28), r = rnd(0, 92); c.globalAlpha = .88; c.beginPath(); c.arc(S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r, rnd(24, 40), 0, 7); c.fill(); }
  c.globalAlpha = 1;
  const CS = 6, G = S / CS, dirty = new Uint8Array(G * G), img = c.getImageData(0, 0, S, S).data; let total = 0, cleaned = 0;
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) { if (img[((y * CS + 3) * S + x * CS + 3) * 4 + 3] > 120) { dirty[y * G + x] = 1; total++; } }
  let down = false, lx = 0, ly = 0, left = TT, done = false; const BR = 24;
  function wipe(x, y) { c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(x, y, BR, 0, 7); c.fill(); c.globalCompositeOperation = 'source-over'; const gx = Math.floor(x / CS), gy = Math.floor(y / CS), r = Math.ceil(BR / CS); for (let yy = gy - r; yy <= gy + r; yy++) for (let xx = gx - r; xx <= gx + r; xx++) { if (xx < 0 || yy < 0 || xx >= G || yy >= G) continue; const i = yy * G + xx; if (dirty[i] === 1 && Math.hypot(xx * CS + 3 - x, yy * CS + 3 - y) < BR - 2) { dirty[i] = 2; cleaned++; } } }
  function move(e) { if (!down || done) return; const p = cpos(e, cv, S, S); const dx = p.x - lx, dy = p.y - ly, n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 8)); for (let i = 1; i <= n; i++) wipe(lx + dx * i / n, ly + dy * i / n); lx = p.x; ly = p.y; if (Math.random() < .15) sfx('pop'); }
  K.on(cv, 'pointerdown', e => { down = true; const p = cpos(e, cv, S, S); lx = p.x; ly = p.y; wipe(lx, ly); try { cv.setPointerCapture(e.pointerId); } catch (err) { } }); K.on(cv, 'pointermove', move); K.on(cv, 'pointerup', () => down = false); K.on(cv, 'pointercancel', () => down = false);
  K.loop(dt => { if (done) return; left -= dt; const pc = total ? cleaned / total : 1; h1.textContent = ui('time') + ': ' + Math.max(0, Math.ceil(left)); h2.textContent = '✨ ' + Math.round(pc * 100) + '%'; if (pc >= .95) { done = true; sfx('win'); K.after(() => fin(clamp(100 - (1 - left / TT) * 10, 90, 100)), 400); } else if (left <= 0) { done = true; fin(clamp(pc * 92, 0, 92)); } });
  return () => K.stop();
};

/* 14. STACK — build high */
GAMES.stack = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, N = cfg.floors || 10, W = 360, H = 460, BH = 30;
  const hud = hudEl(host); const { cv, cx } = mkCanvas(host, W, H);
  let blocks = [{ x: 110, w: 140 }], cur = { x: 0, w: 140, dir: 1 }, sp = 150 + d * 120, cam = 0, camT = 0, placed = 0, done = false, fall = null;
  const drop = () => {
    if (done) return; const pv = blocks[blocks.length - 1]; const o0 = Math.max(cur.x, pv.x), o1 = Math.min(cur.x + cur.w, pv.x + pv.w); let ov = o1 - o0;
    if (ov <= 4) { done = true; sfx('bad'); fall = { x: cur.x, w: cur.w, y: 0, v: 0 }; K.after(() => fin(clamp(placed / N * 100, 0, 100)), 900); return; }
    let nx = o0; if (Math.abs(cur.x - pv.x) < 6) { nx = pv.x; ov = pv.w; sfx('win'); } else sfx('ok');
    blocks.push({ x: nx, w: ov }); placed++; cur = { x: nx, w: ov, dir: Math.random() < .5 ? 1 : -1 }; cur.x = cur.dir > 0 ? 0 : W - ov; sp += 6; camT = Math.max(0, (blocks.length - 6) * BH);
    if (placed >= N) { done = true; K.after(() => fin(100), 700); }
  };
  K.on(cv, 'pointerdown', e => { e.preventDefault(); drop(); }); K.on(document, 'keydown', e => { if (e.code === 'Space') { e.preventDefault(); drop(); } });
  K.loop(dt => {
    cam += (camT - cam) * Math.min(1, dt * 6);
    if (!done) { cur.x += cur.dir * sp * dt; if (cur.x + cur.w > W) { cur.x = W - cur.w; cur.dir = -1; } if (cur.x < 0) { cur.x = 0; cur.dir = 1; } }
    cx.clearRect(0, 0, W, H); cx.fillStyle = 'rgba(0,0,0,.18)'; cx.fillRect(0, H - 50 + cam, W, 60);
    blocks.forEach((b, i) => { const y = H - 50 - (i + 1) * BH + cam; cx.fillStyle = `hsl(${(i * 31) % 360},65%,58%)`; cx.fillRect(b.x, y, b.w, BH - 2); cx.fillStyle = 'rgba(255,255,255,.35)'; for (let wx = b.x + 8; wx < b.x + b.w - 14; wx += 22) cx.fillRect(wx, y + 7, 12, 14); });
    if (!done) { const y = H - 50 - (blocks.length + 1) * BH + cam; cx.fillStyle = `hsl(${(blocks.length * 31) % 360},65%,58%)`; cx.fillRect(cur.x, y, cur.w, BH - 2); emo(cx, cfg.top || '🏗️', cur.x + cur.w / 2, y - 22, 34); }
    if (fall) { fall.v += 900 * dt; fall.y += fall.v * dt; const y = H - 50 - (blocks.length + 1) * BH + cam + fall.y; cx.fillStyle = 'rgba(200,60,60,.9)'; cx.fillRect(fall.x, y, fall.w, BH - 2); }
    hud.a.textContent = '🏢 ' + placed + '/' + N; hud.b.textContent = '';
  });
  return () => K.stop();
};
