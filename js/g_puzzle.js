'use strict';
/* =====================================================================
   RHYTHM — falling notes in lanes, perfect/good timing, combo, life bar
   ===================================================================== */
GAMES.rhythm = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, W = 360, H = 480, pads = cfg.pads || ['🥁', '🎺', '📣', '🎶'], L = pads.length, LW = W / L, HITY = 392, N = cfg.notes || 34, th = TH(cfg.theme || 'night');
  const hud = GK.hud(host), c = GK.canvas(host, W, H), cx = c.cx, fx = new GK.Fx();
  const me = cfg.me || '🧑', FALL = 1.7 - d * .35, notes = []; let tt = 1.6, last = -1;
  const gap = [.5, .5, .5, .25, .75, 1]; for (let i = 0; i < N; i++) { let ln = ri(0, L - 1); if (ln === last && Math.random() < .5) ln = (ln + 1) % L; last = ln; notes.push({ t: tt, l: ln, done: false, hit: 0 }); tt += pick(gap) * (.95 - d * .25) + .1; if (i % 8 === 7) tt += .3; }
  const dur = notes[notes.length - 1].t + 1.6; let t = 0, combo = 0, best = 0, pts = 0, perf = 0, good = 0, ok = 0, miss = 0, life = .6, over = false, beat = 0, flashL = [];
  const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'];
  function press(l) {
    if (over) return; flashL[l] = .15; let nn = null, bd = .3; notes.forEach(n => { if (!n.done && n.l === l) { const dd = Math.abs(n.t - t); if (dd < bd) { bd = dd; nn = n; } } });
    if (!nn) { sfx('tap'); return; } nn.done = true; const x = l * LW + LW / 2;
    if (bd < .075) { perf++; combo++; pts += 100 + combo * 4; life = Math.min(1, life + .04); fx.text(ui('perfect'), x, HITY - 50, '#fde047', 20); fx.burst(x, HITY, 14, { spd: 150, e: pads[l], size: 3 }); sfx('win'); nn.hit = 1; }
    else if (bd < .15) { good++; combo++; pts += 60; fx.text(ui('good'), x, HITY - 50, '#fff', 18); fx.burst(x, HITY, 8, { spd: 100, col: colors[l] }); sfx('ok'); nn.hit = 1; }
    else { ok++; combo = 0; pts += 20; fx.text('~', x, HITY - 50, '#cbd5e1', 18); sfx('tap'); nn.hit = 1; }
    best = Math.max(best, combo);
  }
  GK.input(K, c, { down(p) { press(clamp(Math.floor(p.x / LW), 0, L - 1)); } });
  GK.keys(K, code => { const m = { KeyD: 0, KeyF: 1, KeyJ: 2, KeyK: 3, ArrowLeft: 0, ArrowDown: 1, ArrowUp: 2, ArrowRight: 3 }; if (m[code] != null && m[code] < L) press(m[code]); });
  function end() { if (over) return; over = true; fin(clamp((perf + good * .65 + ok * .25) / N * 100, 0, 100), ['🎯 ' + perf + ' / ' + good + ' / ' + miss, '🔥 ' + best]); }
  K.loop(dt => {
    if (over) return; t += dt; fx.update(dt); beat += dt * 5; flashL = flashL.map(v => Math.max(0, (v || 0) - dt));
    notes.forEach(n => { if (!n.done && t > n.t + .2) { n.done = true; miss++; combo = 0; life = Math.max(0, life - .06); fx.text('✗', n.l * LW + LW / 2, HITY - 40, '#f87171', 20); } });
    if (t > dur) end();
    cx.clearRect(0, 0, W, H); fx.begin(cx); GK.grad(cx, W, H, [th.sky[0], th.sky[1]]); for (let i = 0; i < 12; i++) { cx.fillStyle = 'rgba(255,255,255,' + (.06 + .05 * Math.sin(t * 2 + i)) + ')'; cx.beginPath(); cx.moveTo(30 * i, 0); cx.lineTo(30 * i + 60, 0); cx.lineTo(180, 150); cx.fill(); }
    for (let l = 0; l < L; l++) { cx.fillStyle = 'rgba(0,0,0,' + (l % 2 ? .22 : .32) + ')'; cx.fillRect(l * LW, 110, LW, H - 110); if (flashL[l] > 0) { cx.fillStyle = 'rgba(255,255,255,' + flashL[l] * 2.2 + ')'; cx.fillRect(l * LW, HITY - 30, LW, 60); } }
    cx.fillStyle = '#fff'; cx.fillRect(0, HITY - 2, W, 4);
    pads.forEach((p, l) => { cx.fillStyle = colors[l % 5]; cx.globalAlpha = .85; GK.rr(cx, l * LW + 6, HITY + 14, LW - 12, 60, 16); cx.fill(); cx.globalAlpha = 1; GK.draw(cx, p, l * LW + LW / 2, HITY + 44, 36, 0, false, 1, 1 + (flashL[l] > 0 ? .2 : 0), 1 + (flashL[l] > 0 ? .2 : 0)); });
    notes.forEach(n => { if (n.done && !n.hit) return; const y = HITY - (n.t - t) / FALL * (HITY - 110); if (y < 100 || y > H) return; const x = n.l * LW + LW / 2; cx.globalAlpha = n.done ? Math.max(0, 1 - (t - n.t) * 5) : 1; cx.fillStyle = colors[n.l % 5]; cx.beginPath(); cx.arc(x, y, 26, 0, 7); cx.fill(); cx.strokeStyle = '#fff'; cx.lineWidth = 3; cx.stroke(); GK.draw(cx, pads[n.l], x, y, 30); cx.globalAlpha = 1; });
    GK.draw(cx, me, 180, 70 - Math.abs(Math.sin(beat)) * 10, 70, Math.sin(beat * .5) * .15); GK.bar(cx, 30, 14, 300, 10, life, life < .25 ? '#ef4444' : '#22c55e');
    if (combo > 3) GK.txt(cx, '🔥 ' + combo, 300, 80, 24, '#fde047');
    fx.draw(cx); fx.end(cx);
    hud.set('🎵 ' + Math.round(clamp(t / dur, 0, 1) * 100) + '%', '⭐ ' + pts, '🔥 ' + best);
  });
  GK.count(c.wrap, K, () => { }, '👆 ' + pads.join(' '));
  return () => K.stop();
};

/* =====================================================================
   MEMORY — flip cards, two rounds, peek power-up, combos
   ===================================================================== */
GAMES.memory = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3; const hud = GK.hud(host);
  const pool = [...new Set((cfg.cards || []).concat(['🍎', '🍌', '⭐', '🎈', '🎵', '🌸', '🍓', '🐟', '🍪', '🍩', '🎁', '🌈']))];
  const wrap = mk('div', 'gk-wrap'); const grid = mk('div', 'mem-grid'); wrap.appendChild(grid); host.appendChild(wrap);
  const peekBtn = mk('button', 'btn', '👀 ' + ui('gm_peek')); peekBtn.style.marginTop = '8px'; host.appendChild(peekBtn);
  let round = 0, first = null, lock = true, moves = 0, found = 0, pairs = 0, scores = [], over = false, combo = 0, bestC = 0, peeks = 1, tl = 60, ttot = 60;
  function build() {
    round++; if (round > 2) return end();
    pairs = clamp(Math.round(4 + round * 2 + d * 2), 5, 9); const em = shuf(pool).slice(0, pairs), cards = shuf(em.concat(em));
    grid.innerHTML = ''; grid.style.gridTemplateColumns = 'repeat(' + (cards.length <= 16 ? 4 : 6) + ',1fr)'; first = null; moves = 0; found = 0; combo = 0; tl = 50 - d * 10 + pairs * 3; ttot = tl;
    cards.forEach(e => { const b = mk('button', 'mem-card', `<span class="mf">${e}</span><span class="mb">${cfg.back || '❓'}</span>`); b.dataset.e = e; b.onclick = () => flip(b); grid.appendChild(b); });
    lock = true; K.after(peek, 300);
  }
  function peek() { if (peeks <= 0) { lock = false; return; } peeks--; lock = true; peekBtn.disabled = peeks <= 0; grid.querySelectorAll('.mem-card').forEach(b => b.classList.add('up')); sfx('ok'); K.after(() => { grid.querySelectorAll('.mem-card:not(.ok)').forEach(b => b.classList.remove('up')); lock = false; }, 1500); }
  peekBtn.onclick = () => { if (!lock && peeks > 0 && round > 0) peek(); };
  function flip(b) {
    if (lock || over || b.classList.contains('up') || b.classList.contains('ok')) return; sfx('tap'); b.classList.add('up');
    if (!first) { first = b; return; } moves++;
    if (first.dataset.e === b.dataset.e) {
      first.classList.add('ok'); b.classList.add('ok'); first = null; found++; combo++; bestC = Math.max(bestC, combo); sfx('win');
      if (found === pairs) { scores.push(clamp(100 - (moves - pairs) * (100 / (pairs * 1.5)) + tl / ttot * 12, 20, 100)); lock = true; K.after(build, 900); }
    } else { combo = 0; lock = true; const f = first; first = null; f.classList.add('shake'); b.classList.add('shake'); sfx('bad'); K.after(() => { f.classList.remove('up', 'shake'); b.classList.remove('up', 'shake'); lock = false; }, 750); }
  }
  function end() { if (over) return; over = true; fin(clamp(scores.reduce((a, b) => a + b, 0) / 2, 0, 100), ['🧠 ' + scores.map(s => Math.round(s)).join(' / '), '🔥 ' + bestC]); }
  K.loop(dt => {
    if (over) return;
    if (round > 0 && !lock) { tl -= dt; if (tl <= 0) { scores.push(clamp(found / pairs * 55, 0, 55)); lock = true; if (round >= 2) end(); else build(); } }
    hud.set('⏱ ' + Math.max(0, Math.ceil(tl)), '🃏 ' + Math.min(round, 2) + '/2 · ' + found + '/' + pairs, '🔥 ' + combo + ' · 👣 ' + moves);
  });
  GK.count(wrap, K, build, '🧠');
  return () => K.stop();
};
/* =====================================================================
   REACTION — the director shows a feeling/pose, tap the matching face fast
   ===================================================================== */
GAMES.reaction = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, N = cfg.n || 14, set = cfg.set || ['😀', '😢', '😡', '😮', '😴', '🤩'], host2 = cfg.host || '🎬';
  const hud = GK.hud(host); const stage = mk('div', 'rx-stage', `<div class="rx-dir"><span class="rx-h">${host2}</span><div class="rx-b"></div></div><div class="prog"><i></i></div><div class="rx-opts"></div>`); host.appendChild(stage);
  const bub = stage.querySelector('.rx-b'), bar = stage.querySelector('.prog i'), opts = stage.querySelector('.rx-opts');
  let n = 0, ok = 0, streak = 0, best = 0, lives = 3, tl = 0, TQ = 3 - d * 1.2, active = false, over = false, pts = 0, target = '';
  function next() {
    n++; if (n > N) return end(); target = pick(set); const o = shuf(set.filter(e => e !== target)).slice(0, 3).concat([target]); bub.textContent = target; bub.className = 'rx-b pop'; tl = TQ; active = true; opts.innerHTML = '';
    shuf(o).forEach(e => { const b = mk('button', 'rx-opt', e); b.onclick = () => answer(b, e); opts.appendChild(b); });
  }
  function answer(b, e) { if (!active) return; active = false; if (e === target) { ok++; streak++; best = Math.max(best, streak); pts += 10 + Math.round(tl / TQ * 10) + Math.min(10, streak); b.classList.add('ok'); sfx('win'); bub.classList.add('good'); } else { streak = 0; lives--; b.classList.add('no'); sfx('bad'); opts.querySelectorAll('.rx-opt').forEach(x => { if (x.textContent === target) x.classList.add('ok'); }); if (lives <= 0) { K.after(end, 700); return; } } K.after(next, 600); }
  function end() { if (over) return; over = true; fin(clamp(ok / N * 90 + best * .7, 0, 100), ['🎭 ' + ok + '/' + N, '🔥 ' + best]); }
  K.loop(dt => { if (over) return; if (active) { tl -= dt; bar.style.width = Math.max(0, tl / TQ * 100) + '%'; if (tl <= 0) { active = false; streak = 0; lives--; sfx('bad'); if (lives <= 0) { K.after(end, 600); return; } K.after(next, 500); } } hud.set('🎬 ' + Math.min(n, N) + '/' + N, '⭐ ' + pts + (streak > 2 ? ' 🔥' + streak : ''), '❤️'.repeat(Math.max(0, lives))); });
  const cd = mk('div', 'gk-wrap'); host.appendChild(cd); GK.count(cd, K, next, '🎭');
  return () => K.stop();
};

/* =====================================================================
   QUIZ — game-show quiz with streaks, timer and a 50:50 lifeline
   ===================================================================== */
GAMES.quiz = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, N = cfg.n || 10, kind = cfg.kind || 'mix', TQ = 12 - d * 4, hostE = cfg.host || '🧑‍🏫';
  const hud = GK.hud(host); const stage = mk('div', 'qz-stage', `<div class="qz-top"><span class="qz-h">${hostE}</span><div class="qbox"></div></div><div class="prog"><i></i></div><div class="qopts"></div><button class="btn qz-5050">✂️ 50:50</button>`); host.appendChild(stage);
  const qb = stage.querySelector('.qbox'), bar = stage.querySelector('.prog i'), qo = stage.querySelector('.qopts'), life = stage.querySelector('.qz-5050');
  function qmath() { const mx = Math.round(9 + d * 30); const op = pick(d > .25 ? ['+', '-', '×', '÷'] : ['+', '-']); let a = ri(1, mx), b = ri(1, mx); if (op === '×') { a = ri(2, 4 + Math.round(d * 7)); b = ri(2, 4 + Math.round(d * 7)); } if (op === '÷') { b = ri(2, 3 + Math.round(d * 6)); a = b * ri(2, 3 + Math.round(d * 7)); } if (op === '-' && b > a) [a, b] = [b, a]; return { q: a + ' ' + op + ' ' + b + ' = ?', ans: op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : a / b }; }
  function qseq() { const s = ri(1, 9), k = ri(2, 4 + Math.round(d * 6)); const geo = d > .5 && Math.random() < .4; const arr = geo ? [s, s * 2, s * 4, s * 8] : [0, 1, 2, 3].map(i => s + k * i); return { q: arr.join(', ') + ', ?', ans: geo ? s * 16 : s + k * 4 }; }
  function qcount() { const e = pick(['🍎', '⭐', '🎈', '🐟', '🍪', '🌸']), n = ri(3, 8 + Math.round(d * 8)); return { q: e.repeat(n), ans: n }; }
  function qcmp() { const a = ri(10, 60 + Math.round(d * 100)), b = ri(10, 60 + Math.round(d * 100)); return { q: a + '  ⚖️  ' + b + '  →  ?', ans: Math.max(a, b), custom: [a, b] }; }
  const gen = () => { const k = kind === 'mix' ? pick(['math', 'seq', 'count', 'cmp']) : kind; return k === 'math' ? qmath() : k === 'seq' ? qseq() : k === 'cmp' ? qcmp() : qcount(); };
  let n = 0, ok = 0, streak = 0, best = 0, tl = TQ, cur, active = false, over = false, pts = 0, used = false, lives = 3;
  function nextQ() {
    n++; if (n > N) return end(); cur = gen(); tl = TQ; active = true; qb.textContent = cur.q; qb.className = 'qbox pop'; qo.innerHTML = '';
    const set = new Set(cur.custom || [cur.ans]); let g = 0; if (!cur.custom) while (set.size < 4 && g++ < 60) { const v = cur.ans + ri(-6, 6) * (cur.ans > 40 ? 2 : 1); if (v >= 0 && v !== cur.ans) set.add(v); } else set.add(cur.ans);
    shuf([...set]).forEach(v => { const b = mk('button', 'qopt', String(v)); b.onclick = () => ans(b, v); qo.appendChild(b); });
  }
  function ans(b, v) { if (!active) return; active = false; if (v === cur.ans) { ok++; streak++; best = Math.max(best, streak); pts += 10 + Math.round(tl / TQ * 10) + Math.min(10, streak * 2); b.classList.add('ok'); sfx('win'); } else { streak = 0; lives--; b.classList.add('no'); sfx('bad'); qo.querySelectorAll('.qopt').forEach(x => { if (x.textContent === String(cur.ans)) x.classList.add('ok'); }); if (lives <= 0) { K.after(end, 800); return; } } K.after(nextQ, 700); }
  life.onclick = () => { if (used || !active) return; used = true; life.disabled = true; let rm = 0; qo.querySelectorAll('.qopt').forEach(x => { if (x.textContent !== String(cur.ans) && rm < 2 && qo.children.length > 2) { x.style.visibility = 'hidden'; x.disabled = true; rm++; } }); sfx('ok'); };
  function end() { if (over) return; over = true; fin(clamp(ok / N * 92 + best * .6, 0, 100), ['🧠 ' + ok + '/' + N, '🔥 ' + best]); }
  K.loop(dt => { if (over) return; if (active) { tl -= dt; bar.style.width = Math.max(0, tl / TQ * 100) + '%'; if (tl <= 0) { active = false; streak = 0; lives--; sfx('bad'); qo.querySelectorAll('.qopt').forEach(x => { if (x.textContent === String(cur.ans)) x.classList.add('ok'); }); if (lives <= 0) { K.after(end, 800); return; } K.after(nextQ, 800); } } hud.set('❓ ' + Math.min(n, N) + '/' + N, '⭐ ' + pts + (streak > 2 ? ' 🔥' + streak : ''), '❤️'.repeat(Math.max(0, lives))); });
  const cd = mk('div', 'gk-wrap'); host.appendChild(cd); GK.count(cd, K, nextQ, '🧠');
  return () => K.stop();
};

/* =====================================================================
   LIGHTS — lantern puzzle: tap a lantern to toggle it and its neighbours
   ===================================================================== */
GAMES.lights = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, LV = 3; const hud = GK.hud(host); const gridEl = mk('div', 'lg-grid'); host.appendChild(gridEl);
  const on = cfg.on || '🏮', off = cfg.off || '⚫';
  let lvl = 0, G = 3, st = [], moves = 0, k = 0, scores = [], over = false, busy = true;
  function build() {
    lvl++; if (lvl > LV) return end(); G = lvl === 1 ? 3 : lvl === 2 ? 3 : 4; st = Array(G * G).fill(true); k = 3 + lvl + Math.round(d * 2); moves = 0; const seq = shuf([...Array(G * G).keys()]).slice(0, k); seq.forEach(i => toggle(i, true)); if (st.every(v => v)) toggle(0, true); draw(); busy = false;
  }
  function toggle(i, silent) { const r = Math.floor(i / G), q = i % G; [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const rr = r + a, qq = q + b; if (rr >= 0 && rr < G && qq >= 0 && qq < G) st[rr * G + qq] = !st[rr * G + qq]; }); }
  function draw() { gridEl.style.gridTemplateColumns = 'repeat(' + G + ',1fr)'; gridEl.innerHTML = ''; st.forEach((v, i) => { const b = mk('button', 'lg-cell ' + (v ? 'on' : ''), v ? on : off); b.onclick = () => tap(i); gridEl.appendChild(b); }); }
  function tap(i) { if (busy || over) return; toggle(i); moves++; sfx('tap'); draw(); if (st.every(v => v)) { busy = true; const sc = clamp(100 - (moves - k) * 9, 35, 100); scores.push(sc); sfx('win'); K.after(build, 900); } }
  function end() { if (over) return; over = true; fin(clamp(scores.reduce((a, b) => a + b, 0) / LV, 0, 100), ['🏮 ' + scores.map(s => Math.round(s)).join(' / ')]); }
  K.loop(() => { hud.set('🏮 ' + Math.min(lvl, LV) + '/' + LV, '👣 ' + moves, '🎯 ≤' + k); });
  const cd = mk('div', 'gk-wrap'); host.appendChild(cd); GK.count(cd, K, build, '🏮 → 🏮🏮🏮');
  return () => K.stop();
};

/* =====================================================================
   SIMON — repeat the growing sequence of lit pads (3 lives, 6 rounds)
   ===================================================================== */
GAMES.simon = (host, cfg, fin) => {
  const K = killer(), d = cfg.d || .3, R = cfg.rounds || 6, pads = cfg.pads || ['🔴', '🟡', '🟢', '🔵']; const hud = GK.hud(host);
  host.insertAdjacentHTML('beforeend', `<div class="tm-msg big">&nbsp;</div><div class="simon"></div>`);
  const grid = host.querySelector('.simon'), msg = host.querySelector('.tm-msg');
  const els = pads.map((e, i) => { const b = mk('button', 'spad', e); b.style.background = PADCOL[i % PADCOL.length]; b.onclick = () => press(i); grid.appendChild(b); return b; });
  const tones = [330, 392, 494, 587, 659, 784]; let seq = [], idx = 0, accept = false, lives = 3, rounds = 0, over = false, pts = 0;
  const tone = i => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = tones[i % 6]; g.gain.setValueAtTime(.14, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + .3); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + .3); } catch (e) { } };
  const flash = (i, ms) => { els[i].classList.add('lit'); if (SND) tone(i); K.after(() => els[i].classList.remove('lit'), ms || 380); };
  function play() { accept = false; msg.textContent = ui('watch'); idx = 0; const gap = Math.max(380, 780 - d * 260 - rounds * 20); seq.forEach((s, i) => K.after(() => flash(s, gap * .6), 600 + i * gap)); K.after(() => { accept = true; msg.textContent = ui('yourturn'); }, 600 + seq.length * gap); }
  function next() { seq.push(ri(0, pads.length - 1)); while (seq.length < (cfg.start || 2)) seq.push(ri(0, pads.length - 1)); play(); }
  function press(i) {
    if (!accept || over) return; flash(i, 220);
    if (seq[idx] === i) { idx++; pts += 5; if (idx >= seq.length) { accept = false; rounds++; sfx('win'); msg.textContent = '👏'; if (rounds >= R) { over = true; K.after(() => fin(lives === 3 ? 100 : lives === 2 ? 88 : 74, ['🎵 ' + rounds + '/' + R]), 600); return; } K.after(next, 900); } }
    else { sfx('bad'); lives--; accept = false; msg.textContent = '😬'; if (lives <= 0) { over = true; K.after(() => fin(clamp(rounds / R * 75, 0, 75), ['🎵 ' + rounds + '/' + R]), 800); } else K.after(play, 1000); }
  }
  K.loop(() => hud.set('🎵 ' + Math.min(rounds + 1, R) + '/' + R, '⭐ ' + pts, '❤️'.repeat(Math.max(0, lives))));
  const cd = mk('div', 'gk-wrap'); host.insertBefore(cd, grid); GK.count(cd, K, next, '👀 → 👆');
  return () => K.stop();
};

/* =====================================================================
   CHAIN — a grand finale made of several full games in a row
   parts: [{g:'penalty', cfg:{...}}, ...]  (score = average)
   ===================================================================== */
GAMES.chain = (host, cfg, fin) => {
  const parts = cfg.parts || []; let i = 0, scores = [], infos = [], cleanup = null, dead = false;
  const bar = mk('div', 'chain-bar'); host.appendChild(bar); const box = mk('div', 'chain-box'); host.appendChild(box);
  function run() {
    if (dead) return; box.innerHTML = ''; bar.innerHTML = parts.map((p, k) => `<span class="${k < i ? 'done' : k === i ? 'cur' : ''}">${p.icon || '⭐'}</span>`).join('');
    const p = parts[i], sub = Object.assign({ d: cfg.d }, p.cfg);
    cleanup = GAMES[p.g](box, sub, (s, info) => { if (dead) return; scores.push(s); if (info) infos.push(info.join(' ')); i++; if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; } if (i >= parts.length) { fin(scores.reduce((a, b) => a + b, 0) / scores.length, scores.map(x => Math.round(x) + '%')); } else { sfx('win'); box.innerHTML = `<div class="intro"><div class="introe">${p.icon || '⭐'}</div><b>${Math.round(s)}%</b></div>`; setTimeout(run, 900); } });
  }
  run();
  return () => { dead = true; if (cleanup) { try { cleanup(); } catch (e) { } } };
};
