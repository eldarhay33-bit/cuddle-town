'use strict';
/* =====================================================================
   Core: state, screens, activities, food, shop, missions, story, VIP
   ===================================================================== */
const SAVE_KEY = 'cuddletown.v1';
const VIP_CODE = 'el135791';
const PETS = ['hugsy', 'dubi', 'efro', 'lemi', 'ruchi', 'dubila', 'marsh', 'mish'];
const FAMILY = ['mom', 'sis18', 'dad', 'bro14', 'sis8'];
const BG_SPOTS = [[9, 50], [90, 50], [24, 20], [76, 18]];
let G;
const UIS = { screen: 'menu', mtab: 'chars', wid: null, ptab: 'acts', room: 'living', over: null, busy: false };
const $ = s => document.querySelector(s);
const W = id => WORLDS[id];

/* ---------- save / load ---------- */
function defState() { return { lang: 'he', vip: false, sound: true, coins: 150, streak: 0, lastDay: '', chars: {} }; }
const saveKey = () => (typeof ACC !== 'undefined' ? ACC.key() : SAVE_KEY); // guest or the signed-in account
function load() { try { G = Object.assign(defState(), JSON.parse(localStorage.getItem(saveKey()) || '{}')); } catch (e) { G = defState(); } }
function save() { try { localStorage.setItem(saveKey(), JSON.stringify(G)); } catch (e) { } }
function today() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
function cs(id) {
  let c = G.chars[id];
  if (!c) {
    c = G.chars[id] = { xp: 0, lv: 1, st: {}, own: {}, worn: {}, bg: [], cnt: {}, best: {}, ch: 0, base: {}, t: Date.now(), m: null };
    W(id).stats.forEach(s => c.st[s] = s === 'fame' ? 5 : 80);
  }
  return c;
}
const xpNeed = lv => 45 + lv * 38;
const starsOf = s => s < 35 ? 0 : s < 62 ? 1 : s < 85 ? 2 : 3;

/* ---------- stats ---------- */
function refreshChar(id) {
  const c = cs(id), w = W(id), now = Date.now();
  let dt = (now - c.t) / 60000; c.t = now;
  if (dt <= 0.02) return; if (dt > 240) dt = 240; if (dt > 3) dt *= .35;
  w.stats.forEach(s => { const m = STATMETA[s]; c.st[s] = clamp(c.st[s] - m.dec * dt, 0, 100); });
}
function addStat(c, k, v) { if (c.st[k] !== undefined) c.st[k] = clamp(c.st[k] + v, 0, 100); }
function moodOf(id) {
  const c = cs(id), w = W(id), core = w.stats.filter(s => s !== 'fame');
  if (UIS.over && UIS.over.id === id && Date.now() < UIS.over.until) return UIS.over.mood;
  if (c.st.energy !== undefined && c.st.energy < 14) return 'sleep';
  if (c.st.chill !== undefined && c.st.chill < 28) return 'sad';
  const avg = core.reduce((a, s) => a + c.st[s], 0) / core.length;
  return avg >= 68 ? 'happy' : avg >= 42 ? 'ok' : 'sad';
}
const moodPct = id => { const c = cs(id), core = W(id).stats.filter(s => s !== 'fame'); return Math.round(core.reduce((a, s) => a + c.st[s], 0) / core.length); };

/* ---------- coins / xp ---------- */
function addCoins(n) { G.coins += n; if (n > 0) bumpAll('earn', n); updateCoins(); }
function addXp(id, n) {
  const c = cs(id); c.xp += n; let up = 0;
  while (c.xp >= xpNeed(c.lv) && c.lv < 40) { c.xp -= xpNeed(c.lv); c.lv++; up++; }
  if (up) {
    sfx('lvl'); const w = W(id);
    const news = [].concat(w.acts.filter(a => a.lv === c.lv).map(a => a.e), w.foods.map(f => FOODS[f]).filter(f => f.lv === c.lv).map(f => f.e), w.items.map(i => ITEMS[i]).filter(i => i.lv === c.lv).map(i => i.e));
    toast(ui('lvlup') + ' ' + ui('lv', { n: c.lv }) + (news.length ? '  ' + ui('newunlock') + ' ' + news.join(' ') : ''), 'good');
    react(id, 'level'); maybeCameo();
  }
}
function updateCoins() { document.querySelectorAll('.coinsv').forEach(e => e.textContent = G.coins); }

/* ---------- missions ---------- */
const MT = [
  { k: 'act', n: [2, 3, 4], e: '🎮', t: 'm_act' }, { k: 'feed', n: [1, 2, 3], e: '🍽️', t: 'm_feed', care: 'feed' },
  { k: 'stars', n: [3, 5, 7], e: '⭐', t: 'm_stars' }, { k: 'three', n: [1], e: '🌟', t: 'm_three' },
  { k: 'cuddle', n: [2, 3], e: '💗', t: 'm_cuddle', care: 'cuddle' }, { k: 'earn', n: [40, 70, 100], e: '🪙', t: 'm_earn' },
  { k: 'wash', n: [1], e: '🛁', t: 'm_wash', care: 'wash' }, { k: 'sleep', n: [1], e: '😴', t: 'm_sleep', care: 'sleep' },
  { k: 'laundry', n: [1], e: '🧺', t: 'm_laundry', only: 'outfit' }
];
function ensureMissions(id) {
  const c = cs(id), w = W(id);
  if (c.m && c.m.d === today()) return;
  const pool = MT.filter(m => (!m.care || w.care.includes(m.care)) && !m.only);
  const list = shuf(pool).slice(0, w.outfit ? 3 : 4); if (w.outfit) list.push(MT.find(m => m.k === 'laundry'));
  c.m = { d: today(), bonus: false, list: list.map((m, i) => ({ k: m.k, n: pick(m.n), p: 0, r: 18 + i * 8, cl: false })) };
}
function bump(id, k, amt) { ensureMissions(id); const c = cs(id); c.m.list.forEach(m => { if (m.k === k && !m.cl) m.p = Math.min(m.n, m.p + (amt || 1)); }); }
function bumpAll(k, amt) { if (UIS.wid) bump(UIS.wid, k, amt); }
function claimMission(i) {
  const id = UIS.wid, c = cs(id); ensureMissions(id); const m = c.m.list[i];
  if (!m || m.cl || m.p < m.n) return;
  m.cl = true; G.coins += m.r; addXp(id, 14); sfx('coin');
  if (!c.m.bonus && c.m.list.every(x => x.cl)) { c.m.bonus = true; G.coins += 50; toast('🎉 +50 🪙', 'good'); confetti(); }
  save(); updateCoins(); renderPanel(); renderTop();
}

/* ---------- story ---------- */
function prog(id, ch) {
  const c = cs(id), b = c.base || {};
  switch (ch.k) {
    case 'actid': return (c.cnt['act_' + ch.a] || 0) - (b['act_' + ch.a] || 0);
    case 'poi': return (c.cnt['poi_' + ch.a] || 0) - (b['poi_' + ch.a] || 0);
    case 'lv': return c.lv;
    case 'own': return Object.keys(c.own).length;
    default: return (c.cnt[ch.k] || 0) - (b[ch.k] || 0);
  }
}
function checkStory(id) {
  const w = W(id), c = cs(id);
  for (let guard = 0; guard < 6; guard++) {
    const ch = w.story[c.ch]; if (!ch || prog(id, ch) < ch.n) return;
    const num = c.ch + 1; c.ch++; c.base = Object.assign({}, c.cnt);
    G.coins += ch.r.c; if (ch.r.i && !c.own[ch.r.i]) { c.own[ch.r.i] = 1; }
    const gift = ch.r.i ? ITEMS[ch.r.i] : null; const last = c.ch >= w.story.length;
    queueModal(`<div class="mbig">📖</div><h2>${ui('chdone')}</h2><p class="mtext">${ui('chapter', { n: num })}</p><p class="mtext">${tx(ch.d)}</p>${ch.q && G.vip ? `<p class="quote">“${ch.q}” — Joey</p>` : ''}<div class="rew">+${ch.r.c} 🪙 &nbsp; +${ch.r.x} ⭐${gift ? ` &nbsp; ${gift.e}` : ''}</div>${last ? `<p class="mtext">${ui('allchapters')}</p>` : ''}<button class="btn pri" data-a="mclose">${ui('ok')}</button>`);
    sfx('win'); confetti(); addXp(id, ch.r.x); react(id, 'chapter'); updateCoins();
  }
  save();
}

/* ---------- UI helpers ---------- */
function toast(msg, cls) {
  const t = mk('div', 'toast ' + (cls || ''), msg); $('#toasts').appendChild(t);
  setTimeout(() => t.classList.add('out'), 3200); setTimeout(() => t.remove(), 3700);
}
function maybeCameo() {
  if (!G.vip || Math.random() > .4) return;
  const q = pick(FQ); toast(`<b>${q[0]}:</b> “${q[1]}”`, 'cameo');
}
function confetti() {
  const L = $('#toasts'); const em = ['🎉', '⭐', '✨', '🎊', '💖'];
  for (let i = 0; i < 22; i++) { const s = mk('span', 'conf', pick(em)); s.style.left = rnd(5, 95) + 'vw'; s.style.animationDelay = rnd(0, .5) + 's'; s.style.fontSize = ri(18, 32) + 'px'; L.appendChild(s); setTimeout(() => s.remove(), 2600); }
}
function floatFx(emoji, n) {
  const f = $('#fx'); if (!f) return;
  for (let i = 0; i < (n || 3); i++) { const s = mk('span', 'ffx', emoji); s.style.left = rnd(34, 66) + '%'; s.style.animationDelay = i * .12 + 's'; f.appendChild(s); setTimeout(() => s.remove(), 1700); }
}
/* modal queue */
const MQ = []; let MOPEN = false;
function queueModal(html) { MQ.push(html); if (!MOPEN) nextModal(); }
function modal(html) { queueModal(html); }
function nextModal() {
  const L = $('#layer'); const old = L.querySelector('.mwrap'); if (old) old.remove();
  if (!MQ.length) { MOPEN = false; return; }
  MOPEN = true; const w = mk('div', 'mwrap', `<div class="modal">${MQ.shift()}</div>`); L.appendChild(w);
}
function closeModal() { nextModal(); }

/* ---------- speech / reactions ---------- */
let bubbleT = 0;
function say(text, who) {
  const b = $('#bubble'); if (!b) return;
  b.innerHTML = (who ? `<small>${who}</small>` : '') + text; b.style.direction = who === 'Joey' ? 'ltr' : ''; b.classList.add('show');
  clearTimeout(bubbleT); bubbleT = setTimeout(() => b.classList.remove('show'), 3800);
}
const ROOM_KIND = { living: 'living', kitchen: 'kitchen', gym: 'gym', studio: 'photo', set: 'act', monica: 'friends', bedroom: 'sleep' };
function react(id, kind) {
  if (UIS.screen !== 'world' || UIS.wid !== id) return;
  const w = W(id);
  if (w.joey) { const k = kind === 'idle' ? (ROOM_KIND[UIS.room] || 'greet') : kind; const arr = JOEY[k] || JOEY.greet; say(pick(arr), 'Joey'); }
  else if (w.quotes && w.quotes.length) say(tx(pick(w.quotes)), tx(w.n));
}
function bounce(cls) { const ch = $('#char'); if (!ch) return; ch.classList.remove('jump', 'shake'); void ch.offsetWidth; ch.classList.add(cls || 'jump'); }
function setOver(id, mood, ms) { UIS.over = { id, mood, until: Date.now() + ms }; renderChar(); setTimeout(renderChar, ms + 30); }

/* ---------- art composition ---------- */
function wornMap(c) { const m = {}; ['head', 'face', 'neck', 'body'].forEach(s => { const it = ITEMS[c.worn[s]]; if (it) m[s] = it.e; }); return m; }
function sceneOf(w) { return w.rooms ? w.rooms[UIS.room] || w.rooms.living : w.scene; }
const dirtLv = id => { const d = cs(id).dirt || 0; return d >= 66 ? 3 : d >= 40 ? 2 : d >= 16 ? 1 : 0; };
function charArt(id) {
  const w = W(id), c = cs(id), m = moodOf(id);
  return artOf(w.art, { mood: m, worn: wornMap(c), melt: c.st.chill !== undefined && c.st.chill < 30, dirt: w.outfit ? dirtLv(id) : 0 });
}
function compArt(id) {
  const w = W(id); if (!w.comp) return '';
  const m = moodOf(id); const mm = m === 'eat' ? 'happy' : m;
  const o = Object.assign({ mood: mm }, w.compRoom ? (w.compRoom[UIS.room] || {}) : {});
  if (w.comp.art === 'hen') o.prop = UIS.over && UIS.over.mood === 'eat' ? '🥄' : '';
  return artOf(w.comp.art, o);
}
function cameoArt(id) { const w = W(id); if (!w.cameo) return ''; const a = w.cameo[UIS.room]; return a ? artOf(a, { mood: 'happy' }) : ''; }
function renderChar() {
  const ch = $('#char'); if (!ch || UIS.screen !== 'world') return;
  ch.innerHTML = charArt(UIS.wid);
  const cp = $('#comp'); if (cp) cp.innerHTML = compArt(UIS.wid);
}

/* =====================================================================
   Screens
   ===================================================================== */
function goHome() {
  if (typeof close3D === 'function') close3D(true);
  UIS.screen = 'menu'; UIS.wid = null; renderMenu(); if (typeof Stage3D !== 'undefined') Stage3D.sync();
}
function renderAll() {
  document.documentElement.lang = LANG; document.documentElement.dir = LANGS[LANG].dir;
  document.body.style.setProperty('--tdir', LANGS[LANG].dir);
  renderBar();
  if (UIS.screen === 'world' && UIS.wid) renderWorld(); else if (UIS.screen === 'menu') renderMenu();
}
function renderBar() {
  $('#btn-vip').innerHTML = `⭐ ${ui('vip_btn')}${G.vip ? ' ✓' : ''}`;
  $('#btn-vip').classList.toggle('on', !!G.vip);
  $('#btn-snd').textContent = SND ? '🔊' : '🔇';
  if (typeof accBar === 'function') accBar();
  document.title = ui('title');
}
function card(id) {
  const w = W(id), c = cs(id);
  return `<button class="card ${w.vip ? 'vipcard' : ''}" style="--c:${w.col}" data-a="world" data-id="${id}">
    <div class="cav">${artOf(w.art, { mood: moodOf(id) })}${w.comp && w.comp.art === 'joey' ? `<span class="cavs">${artOf('joey', { mood: 'happy' })}</span>` : ''}</div>
    <div class="cname">${w.e} ${tx(w.n)}</div><div class="cdesc">${tx(w.desc)}</div>
    <div class="cmeta"><span>${ui('lv', { n: c.lv })}</span><span class="mbar"><i style="width:${moodPct(id)}%"></i></span></div>${w.vip ? '<span class="ribbon">VIP ⭐</span>' : ''}</button>`;
}
function renderMenu() {
  const fam = UIS.mtab === 'fam';
  const list = fam ? FAMILY : PETS.filter(id => !W(id).vip || G.vip);
  $('#screens').innerHTML = `<section class="menu">
    <div class="hero"><h1>${ui('title')}</h1><p>${ui('sub')}</p><div class="coinsbig">🪙 <b class="coinsv">${G.coins}</b></div>${typeof accChip === 'function' ? `<div>${accChip()}</div>` : ''}</div>
    <div class="mtabs"><button class="${fam ? '' : 'on'}" data-a="mtab" data-v="chars">🐾 ${ui('tab_chars')}</button><button class="${fam ? 'on' : ''}" data-a="mtab" data-v="fam">👨‍👩‍👧‍👦 ${ui('tab_family')}</button></div>
    ${fam ? `<p class="note">${ui('fam_sub')}</p>` : ''}
    <div class="cards">${list.map(card).join('')}</div></section>`;
}
function openWorld(id) {
  UIS.screen = 'world'; UIS.wid = id; UIS.ptab = 'acts'; UIS.room = 'living'; UIS.over = null;
  refreshChar(id); ensureMissions(id); renderWorld(); window.scrollTo(0, 0);
  setTimeout(() => react(id, 'greet'), 500);
  if (W(id).outfit && dirtLv(id) >= 2) setTimeout(() => react(id, 'dirty'), 4800);
}
function renderWorld() {
  const id = UIS.wid, w = W(id);
  $('#screens').innerHTML = `<section class="world" style="--c:${w.col}">
    <header class="wtop" id="wtop"></header>
    <div class="wmain"><div class="left"><div class="scenewrap" id="sceneWrap"></div><div class="stats" id="stats"></div><div class="care" id="care"></div></div>
    <div class="right"><nav class="ptabs" id="ptabs"></nav><div class="panel" id="panel"></div></div></div></section>`;
  renderTop(); renderScene(); renderStats(); renderCare(); renderTabs(); renderPanel();
}
function renderTop() {
  const id = UIS.wid, w = W(id), c = cs(id), t = $('#wtop'); if (!t) return;
  t.innerHTML = `<button class="btn ghost" data-a="home">${LANGS[LANG].dir === 'rtl' ? '→' : '←'} ${ui('back')}</button>
    <div class="wname">${w.e} ${tx(w.n)}</div>
    <div class="lvl"><span>${ui('lv', { n: c.lv })}</span><div class="xpbar"><i style="width:${Math.round(c.xp / xpNeed(c.lv) * 100)}%"></i></div></div>
    <div class="coins">🪙 <b class="coinsv">${G.coins}</b></div>`;
}
function renderScene() {
  const id = UIS.wid, w = W(id), c = cs(id), sc = sceneOf(w), sw = $('#sceneWrap'); if (!sw) return;
  const deco = sc.deco.map(d => `<span class="deco" style="left:${d[1]}%;top:${d[2]}%;font-size:${d[3]}px">${d[0]}</span>`).join('');
  const bgi = c.bg.map((iid, i) => { const s = BG_SPOTS[i % 4]; return `<span class="deco bgi" style="left:${s[0]}%;top:${s[1]}%">${ITEMS[iid].e}</span>`; }).join('');
  const svgBg = sceneSVG(w, UIS.room);
  sw.innerHTML = `<div class="scene" id="scene" style="background:${sc.bg}">${svgBg ? `<div class="sbg">${svgBg}</div>` : deco}${bgi}
    ${w.cameo && w.cameo[UIS.room] ? `<div class="cameo" id="cameo">${cameoArt(id)}</div>` : ''}
    ${w.comp ? `<div class="comp" id="comp">${compArt(id)}</div>` : ''}
    <div class="charwrap"><div class="char" id="char" data-a="poke">${charArt(id)}</div></div>
    <div class="bubble" id="bubble"></div><div class="fxlayer" id="fx"></div><div class="nightveil" id="veil"></div>
    ${typeof Stage3D !== 'undefined' && Stage3D.available && window.M3D && M3D.build[w.art] ? `<button class="s3btn" data-a="stage3d">${G.stage3d === false ? '🧊 3D' : '🖼️ 2D'}</button>` : ''}</div>`;
  if (typeof Stage3D !== 'undefined') Stage3D.sync();
}
function renderStats() {
  const id = UIS.wid, w = W(id), c = cs(id), s = $('#stats'); if (!s) return;
  const outfitBar = w.outfit ? `<div class="stat ${dirtLv(id) >= 2 ? 'low' : ''}"><span class="se">🧺</span><div class="sb"><i style="width:${100 - Math.round(c.dirt || 0)}%;background:#a78bfa"></i></div><small>${ui('outfit')}</small></div>` : '';
  s.innerHTML = w.stats.map(k => { const m = STATMETA[k], v = Math.round(c.st[k]); return `<div class="stat ${v < 25 && k !== 'fame' ? 'low' : ''}"><span class="se">${m.e}</span><div class="sb"><i style="width:${v}%;background:${m.col}"></i></div><small>${ui(m.k)}</small></div>`; }).join('') + outfitBar;
}
function careLabel(w, k) {
  if (k === 'wash' && w.wash && w.wash.n) return `${w.wash.e || '🛁'} ${tx(w.wash.n)}`;
  const fam = w.kind === 'fam';
  const map = { feed: [fam ? '🍎' : '🍽️', fam ? 'c_snack' : 'c_feed'], wash: ['🛁', 'c_wash'], sleep: [fam ? '☕' : '😴', fam ? 'c_rest' : 'c_sleep'], cuddle: ['💗', 'c_cuddle'] };
  return `${map[k][0]} ${ui(map[k][1])}`;
}
function renderCare() {
  const w = W(UIS.wid), el = $('#care'); if (!el) return;
  el.innerHTML = w.care.map(k => `<button class="btn care-b" data-a="care" data-v="${k}">${careLabel(w, k)}</button>`).join('') +
    (w.id === 'hugsy' ? `<button class="btn pri care-b g3d" data-a="go3d">${ui('go3d')}</button>` : '');
}
function renderTabs() {
  const el = $('#ptabs'); if (!el) return;
  const tabs = [['acts', '🎮', 't_acts'], ['food', '🍽️', 't_food'], ['shop', '🛍️', 't_shop'], ['missions', '📋', 't_missions'], ['story', '📖', 't_story']];
  el.innerHTML = tabs.map(t => `<button class="${UIS.ptab === t[0] ? 'on' : ''}" data-a="ptab" data-v="${t[0]}">${t[1]} <span>${ui(t[2])}</span></button>`).join('');
}
function renderPanel() {
  const el = $('#panel'); if (!el) return;
  const top = el.scrollTop; const id = UIS.wid;
  const f = { acts: panelActs, food: panelFood, shop: panelShop, missions: panelMissions, story: panelStory }[UIS.ptab];
  el.innerHTML = f(id); el.scrollTop = top;
}
function setPtab(v) {
  UIS.ptab = v;
  const w = W(UIS.wid);
  if (w.rooms) { const want = v === 'food' ? 'kitchen' : null; if (want && UIS.room !== want) { UIS.room = want; renderScene(); } }
  renderTabs(); renderPanel();
}

/* ---------- panels ---------- */
function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
function panelActs(id) {
  const w = W(id), c = cs(id);
  let chips = '', list = w.acts;
  if (w.cats) {
    chips = `<div class="chips">${w.cats.map(k => `<button class="${UIS.room === k.k ? 'on' : ''}" data-a="cat" data-v="${k.k}">${k.e} ${tx(k.n)}</button>`).join('')}</div>`;
    list = w.acts.filter(a => a.room === UIS.room);
  }
  return chips + `<div class="grid">${list.map(a => {
    const lock = c.lv < a.lv, b = c.best[a.id] || 0;
    const need = w.outfit && a.id === 'laundry' && dirtLv(id) >= 2;
    return `<button class="tile-card ${lock ? 'lock' : ''} ${need ? 'need' : ''}" data-a="act" data-v="${a.id}">${need ? '<span class="needb">!</span>' : ''}<span class="ti">${a.e}</span><b>${tx(a.n)}</b>
      <small>${lock ? ui('locked', { n: a.lv }) : `<span class="stars">${stars(b)}</span> · ⚡${a.cost || 7}`}</small></button>`;
  }).join('')}</div>`;
}
function fxChips(fx) { return Object.keys(fx).map(k => { const m = STATMETA[k]; return `<span class="fxc ${fx[k] < 0 ? 'neg' : ''}">${m ? m.e : ''}${fx[k] > 0 ? '+' : ''}${fx[k]}</span>`; }).join(''); }
function panelFood(id) {
  const w = W(id), c = cs(id);
  return `<div class="grid">${w.foods.map(fid => {
    const f = FOODS[fid], lock = c.lv < f.lv;
    return `<button class="tile-card ${lock ? 'lock' : ''}" data-a="food" data-v="${fid}"><span class="ti">${f.e}</span><b>${tx(f.n)}</b>
      <small>${lock ? ui('locked', { n: f.lv }) : `🪙 ${f.c}`}</small><div class="fxrow">${lock ? '' : fxChips(f.fx)}</div></button>`;
  }).join('')}</div>`;
}
function panelShop(id) {
  const w = W(id), c = cs(id);
  return `<div class="grid">${w.items.map(iid => {
    const it = ITEMS[iid], lock = c.lv < it.lv && !c.own[iid], own = c.own[iid];
    const on = it.slot === 'bg' ? c.bg.includes(iid) : c.worn[it.slot] === iid;
    const label = own ? (on ? (it.slot === 'bg' ? ui('placed') : ui('worn')) : (it.slot === 'bg' ? ui('place') : ui('wear'))) : lock ? ui('locked', { n: it.lv }) : `🪙 ${it.c}`;
    return `<button class="tile-card ${lock ? 'lock' : ''} ${on ? 'worn' : ''}" data-a="${own ? 'wear' : 'buy'}" data-v="${iid}"><span class="ti">${it.e}</span><b>${tx(it.n)}</b><small>${label}</small></button>`;
  }).join('')}</div>`;
}
function panelMissions(id) {
  ensureMissions(id); const c = cs(id);
  return `<h3 class="ph">${ui('m_title')}</h3><p class="note">${ui('m_new')} · ${ui('streak', { n: G.streak })}</p>` + c.m.list.map((m, i) => {
    const t = MT.find(x => x.k === m.k), pct = Math.round(m.p / m.n * 100), ready = m.p >= m.n && !m.cl;
    return `<div class="mrow ${m.cl ? 'done' : ''}"><span class="me">${t.e}</span><div class="mm"><b>${ui(t.t, { n: m.n })}</b><div class="pbar"><i style="width:${pct}%"></i></div><small>${m.p}/${m.n}</small></div>
      <button class="btn ${ready ? 'pri' : ''}" ${ready ? '' : 'disabled'} data-a="claim" data-v="${i}">${m.cl ? ui('claimed') : `${ui('claim')} +${m.r}🪙`}</button></div>`;
  }).join('');
}
function chapterHint(id, ch) {
  const w = W(id), c = cs(id);
  if (ch.k === 'actid') { const a = w.acts.find(x => x.id === ch.a); return a ? `${a.e} ${tx(a.n)}${c.lv < a.lv ? ' — ' + ui('locked', { n: a.lv }) : ''}` : ''; }
  if (ch.k === 'feed') return '🍽️ ' + ui('t_food');
  if (ch.k === 'stars') return '⭐';
  if (ch.k === 'lv') return '⬆️';
  if (ch.k === 'poi') return '🟣 ' + tx(w.cats ? w.cats.find(x => x.k === ch.a)?.n || '' : '');
  return '';
}
function panelStory(id) {
  const w = W(id), c = cs(id);
  let h = `<h3 class="ph">${ui('s_title')}</h3>`;
  w.story.forEach((ch, i) => {
    if (i < c.ch) h += `<div class="chap done"><b>✓ ${ui('chapter', { n: i + 1 })}</b><p>${tx(ch.d)}</p></div>`;
    else if (i === c.ch) { const p = Math.min(ch.n, prog(id, ch)); h += `<div class="chap cur"><b>▶ ${ui('chapter', { n: i + 1 })}</b><p>${tx(ch.d)}</p>${ch.q && G.vip ? `<p class="quote">“${ch.q}”</p>` : ''}<div class="pbar"><i style="width:${Math.round(p / ch.n * 100)}%"></i></div><small>${ui('goal')}: ${chapterHint(id, ch)} — ${p}/${ch.n}</small></div>`; }
    else h += `<div class="chap lock"><b>🔒 ${ui('chapter', { n: i + 1 })}</b></div>`;
  });
  if (c.ch >= w.story.length) h += `<p class="note">${ui('allchapters')}</p>`;
  return h;
}

/* =====================================================================
   Actions
   ===================================================================== */
function setCat(k) {
  UIS.room = k; const id = UIS.wid;
  if (k === 'monica') { const c = cs(id); c.cnt.poi_monica = (c.cnt.poi_monica || 0) + 1; checkStory(id); }
  renderScene(); renderPanel(); react(id, 'idle');
}
function fxApply(c, fx) { for (const k in fx) addStat(c, k, fx[k]); }
function feed(fid) {
  const id = UIS.wid, c = cs(id), f = FOODS[fid]; refreshChar(id);
  if (c.lv < f.lv) return toast(ui('locked', { n: f.lv }));
  if (c.st.hunger >= 96) return toast(ui('full'));
  if (G.coins < f.c) return toast(ui('nocoins'));
  G.coins -= f.c; fxApply(c, f.fx); c.cnt.feed = (c.cnt.feed || 0) + 1; bump(id, 'feed'); if (W(id).outfit) c.dirt = Math.min(100, (c.dirt || 0) + 3);
  sfx('eat'); setOver(id, 'eat', 1500); bounce('jump'); floatFx(f.e, 4); react(id, 'eat'); maybeCameo();
  save(); updateCoins(); renderStats(); renderPanel(); checkStory(id);
}
function cuddle() {
  const id = UIS.wid, c = cs(id); if (UIS.busy) return;
  addStat(c, 'love', 8); addStat(c, 'fun', 4); addStat(c, 'mood', 5); c.cnt.cuddle = (c.cnt.cuddle || 0) + 1; bump(id, 'cuddle');
  sfx('ok'); setOver(id, 'love', 1200); bounce('jump'); floatFx('💗', 5); react(id, 'cuddle'); save(); renderStats(); checkStory(id);
}
function doSleep() {
  const id = UIS.wid, w = W(id), c = cs(id); if (UIS.busy) return; refreshChar(id);
  if (c.st.energy > 88) return toast(ui('notsleepy'));
  UIS.busy = true; const prevRoom = UIS.room; if (w.rooms) { UIS.room = 'bedroom'; renderScene(); }
  $('#veil').classList.add('on'); setOver(id, 'sleep', 2800); floatFx('💤', 4); say(tx(w.sleep), w.joey ? 'Joey' : '');
  if (w.joey) setTimeout(() => say(pick(JOEY.sleep), 'Joey'), 1600);
  setTimeout(() => {
    addStat(c, 'energy', 60); addStat(c, 'hunger', -6); addStat(c, 'mood', 6); c.cnt.sleep = (c.cnt.sleep || 0) + 1; bump(id, 'sleep');
    if (w.rooms) { UIS.room = prevRoom === 'bedroom' ? 'living' : prevRoom; renderScene(); }
    UIS.busy = false; save(); renderStats(); renderPanel(); checkStory(id); react(id, 'greet');
  }, 2900);
}
function doWash() {
  const id = UIS.wid, w = W(id), c = cs(id); const cfg = w.wash || { g: 'scrub', cfg: { base: w.e, dirt: '#8a6a4b' } };
  openGame({ wid: id, title: T('רחצה', 'Wash', 'استحمام', 'Мытьё', 'Lavado'), icon: '🛁', game: cfg.g, cfg: Object.assign({ d: .2 }, cfg.cfg), onDone(score) {
    const st = starsOf(score), stat = cfg.stat || 'clean'; addStat(c, stat, 25 + score * .45); addStat(c, 'love', 3);
    const coins = 4 + st * 3; c.cnt.wash = (c.cnt.wash || 0) + 1; bump(id, 'wash'); addCoins(coins); addXp(id, 6 + st * 3); save(); checkStory(id);
    return { st, coins, xp: 6 + st * 3, noRetry: false };
  } });
}
function careAct(k) {
  const id = UIS.wid;
  if (k === 'feed') return setPtab('food');
  if (k === 'cuddle') return cuddle();
  if (k === 'sleep') return doSleep();
  if (k === 'wash') return doWash();
}
function buy(iid) {
  const id = UIS.wid, c = cs(id), it = ITEMS[iid];
  if (c.lv < it.lv) return toast(ui('locked', { n: it.lv }));
  if (G.coins < it.c) return toast(ui('nocoins'));
  G.coins -= it.c; c.own[iid] = 1; sfx('coin'); toast(ui('bought'), 'good'); save(); updateCoins(); wear(iid); react(id, 'shop'); bump(id, 'shop');
}
function wear(iid) {
  const id = UIS.wid, c = cs(id), it = ITEMS[iid];
  if (it.slot === 'bg') { const i = c.bg.indexOf(iid); if (i >= 0) c.bg.splice(i, 1); else { c.bg.push(iid); if (c.bg.length > 4) c.bg.shift(); } }
  else c.worn[it.slot] = c.worn[it.slot] === iid ? null : iid;
  sfx('tap'); save(); renderScene(); renderPanel(); checkStory(id);
}

/* ---------- activities ---------- */
function startAct(aid) {
  const id = UIS.wid, w = W(id), c = cs(id), a = w.acts.find(x => x.id === aid); refreshChar(id);
  if (!a) return;
  if (c.lv < a.lv) return toast(ui('locked', { n: a.lv }));
  const ec = a.cost || 7;
  if (c.st.energy !== undefined && c.st.energy < ec) return toast(ui(w.kind === 'fam' ? 'tired_m' : 'tired'));
  if (w.rooms && a.room && UIS.room !== a.room) { UIS.room = a.room; renderScene(); }
  const d = clamp(.16 + (a.lv - 1) * .07 + (c.lv - 1) * .03, .12, 1);
  openGame({ wid: id, title: a.n, icon: a.e, game: a.g, cfg: Object.assign({ d }, a.cfg), onDone: score => finishAct(id, a, score),
    canPlay: () => { refreshChar(id); if (c.st.energy !== undefined && c.st.energy < ec) { toast(ui(w.kind === 'fam' ? 'tired_m' : 'tired')); return false; } return true; } });
}
function finishAct(id, a, score) {
  const w = W(id), c = cs(id), st = starsOf(score), mood = moodOf(id);
  const mult = mood === 'happy' ? 1.1 : mood === 'sad' ? .8 : 1;
  const base = 12 + a.lv * 3, coins = Math.round(base * (.3 + st * .45) * mult), xp = Math.round((8 + a.lv * 2) * (.5 + st * .5));
  addStat(c, 'energy', -(a.cost || 7)); addStat(c, 'hunger', -3); addStat(c, 'fun', 8 + st * 4); addStat(c, 'mood', 4 + st * 2);
  fxApply(c, a.fx || {});
  if (w.outfit) {
    const was = dirtLv(id);
    if (a.id === 'laundry') { c.dirt = st >= 1 ? 0 : Math.max(0, (c.dirt || 0) - 40); if (st >= 1) { bump(id, 'laundry'); setTimeout(() => toast(ui('laundry_done'), 'good'), 900); } }
    else { c.dirt = Math.min(100, (c.dirt || 0) + (a.room === 'kitchen' || a.room === 'gym' ? 8 : 5)); if (was < 2 && dirtLv(id) >= 2) setTimeout(() => toast(ui('hg_dirty')), 1100); }
  }
  c.cnt.act = (c.cnt.act || 0) + 1; c.cnt['act_' + a.id] = (c.cnt['act_' + a.id] || 0) + 1; c.cnt.stars = (c.cnt.stars || 0) + st; if (st === 3) c.cnt.three = (c.cnt.three || 0) + 1;
  const prev = c.best[a.id] || 0, newBest = st > prev; if (newBest) c.best[a.id] = st;
  bump(id, 'act'); bump(id, 'stars', st); if (st === 3) bump(id, 'three');
  addCoins(coins); addXp(id, xp); save(); checkStory(id);
  if (st >= 2) { sfx('win'); } else if (st === 0) sfx('bad');
  return { st, coins, xp, newBest, score: Math.round(score), kind: st >= 2 ? 'win' : st === 0 ? 'lose' : 'win' };
}

/* ---------- game overlay ---------- */
let GAME = null;
function openGame(o) {
  closeGame(true);
  const L = $('#layer'); const ov = mk('div', 'gov');
  ov.innerHTML = `<div class="gbox"><div class="ghead"><span class="gi">${o.icon}</span><b>${tx(o.title)}</b><button class="x" data-a="gquit">✕</button></div>
    <div class="ginstr">${ui('g_' + o.game)}</div><div class="stage" id="stage"></div></div>`;
  L.appendChild(ov); GAME = { o, ov, cleanup: null, done: false };
  showIntro();
}
function showIntro() {
  const g = GAME; if (!g) return; const st = $('#stage');
  st.innerHTML = `<div class="intro"><div class="introe">${g.o.icon}</div><button class="btn pri big" data-a="gstart">${ui('start')}</button></div>`;
}
function startGame() {
  const g = GAME; if (!g) return; const st = $('#stage'); st.innerHTML = ''; g.done = false;
  try {
    g.cleanup = GAMES[g.o.game](st, g.o.cfg, (score, info) => {
      if (g.done) return; g.done = true; g.info = info;
      setTimeout(() => { if (GAME !== g) return; if (g.cleanup) g.cleanup(); showResult(score); }, 350);
    });
  } catch (e) { console.error(e); toast('⚠️ ' + e.message); closeGame(); }
}
function showResult(score) {
  const g = GAME; if (!g) return; const r = g.o.onDone(score) || {}; const st = $('#stage');
  const stt = r.st || 0;
  st.innerHTML = `<div class="result"><div class="rstars">${[0, 1, 2].map(i => `<span class="${i < stt ? 'on' : ''}" style="animation-delay:${i * .25}s">★</span>`).join('')}</div>
    <h2>${ui('res' + stt)}</h2>${r.newBest ? `<div class="nb">${ui('newbest')}</div>` : ''}${g.info && g.info.length ? `<div class="rinfo">${g.info.map(x => `<span>${x}</span>`).join('')}</div>` : ''}<div class="rscore">${ui('score')}: ${Math.round(score)}</div>
    <div class="rew">${r.coins != null ? `+${r.coins} 🪙 &nbsp; +${r.xp} ⭐` : ''}</div>
    <div class="rbtns">${r.noRetry ? '' : `<button class="btn" data-a="gagain">${ui('again')}</button>`}<button class="btn pri" data-a="gback">${ui('back')}</button></div></div>`;
  g.res = r;
  if (typeof window.onGameResult === 'function') window.onGameResult(g.o, r);
  if (UIS.screen === 'world') { renderStats(); renderTop(); renderPanel(); setOver(UIS.wid, stt >= 1 ? 'wow' : 'sad', 1400); bounce(stt >= 1 ? 'jump' : 'shake'); react(UIS.wid, stt >= 2 ? 'win' : stt === 0 ? 'lose' : (W(UIS.wid).joey ? 'win' : 'idle')); }
  if (stt >= 2) { confetti(); maybeCameo(); }
}
function closeGame(silent) {
  if (!GAME) return;
  if (GAME.cleanup) { try { GAME.cleanup(); } catch (e) { } }
  GAME.ov.remove(); const g = GAME; GAME = null;
  if (!silent && typeof window.onGameClosed === 'function') window.onGameClosed(g.o);
}

/* ---------- VIP / settings ---------- */
function vipClick() {
  if (G.vip) modal(`<div class="mbig">⭐</div><h2>${ui('vip_active')}</h2><p class="mtext">${ui('lang_note')}</p><button class="btn" data-a="vipoff">${ui('vip_off')}</button><button class="btn pri" data-a="mclose">${ui('ok')}</button>`);
  else modal(`<div class="mbig">⭐</div><h2>${ui('vip_title')}</h2><p class="mtext">${ui('vip_ask')}</p><input id="vipin" class="vipin" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" dir="ltr" placeholder="••••••••"><div class="vipbad" id="vipbad"></div><button class="btn pri" data-a="vipgo">${ui('vip_go')}</button><button class="btn" data-a="mclose">${ui('close')}</button>`);
  setTimeout(() => { const i = $('#vipin'); if (i) { i.focus(); i.onkeydown = e => { if (e.key === 'Enter') tryVip(); }; } }, 60);
}
function tryVip() {
  const i = $('#vipin'); if (!i) return; const v = i.value.trim().toLowerCase();
  if (v === VIP_CODE) { G.vip = true; save(); closeModal(); sfx('win'); confetti(); toast(ui('vip_on'), 'good'); renderAll(); }
  else { $('#vipbad').textContent = ui('vip_bad'); i.classList.remove('shake'); void i.offsetWidth; i.classList.add('shake'); sfx('bad'); }
}
function vipOff() {
  G.vip = false; save(); closeModal(); if (UIS.wid === 'hugsy' || UIS.screen === '3d') goHome();
  toast(ui('vip_off_done')); renderAll();
}
function settingsModal() {
  modal(`<h2>⚙️ ${ui('lang')}</h2><div class="langs">${LORDER.map(l => `<button class="btn ${l === LANG ? 'pri' : ''}" data-a="lang" data-v="${l}">${LANGS[l].f} ${LANGS[l].n}</button>`).join('')}</div>
    ${G.vip ? `<p class="mtext small">${ui('lang_note')}</p>` : ''}<button class="btn" data-a="reset">🗑️ ${ui('reset')}</button><button class="btn pri" data-a="mclose">${ui('ok')}</button>`);
}
function setLang(l) {
  LANG = l; G.lang = l; save(); closeModal(); renderAll();
}

/* ---------- event delegation ---------- */
const ACT = {
  home: () => goHome(), mtab: e => { UIS.mtab = e.dataset.v; renderMenu(); },
  world: e => openWorld(e.dataset.id), ptab: e => setPtab(e.dataset.v), cat: e => setCat(e.dataset.v),
  act: e => startAct(e.dataset.v), food: e => feed(e.dataset.v), buy: e => buy(e.dataset.v), wear: e => wear(e.dataset.v),
  claim: e => claimMission(+e.dataset.v), care: e => careAct(e.dataset.v), poke: () => { bounce('jump'); sfx('pop'); react(UIS.wid, 'idle'); },
  stage3d: () => { G.stage3d = G.stage3d === false; save(); renderScene(); },
  lang: e => setLang(e.dataset.v), settings: () => settingsModal(), vip: () => vipClick(), vipgo: () => tryVip(), vipoff: () => vipOff(),
  sound: () => { SND = !SND; G.sound = SND; save(); renderBar(); }, mclose: () => closeModal(),
  reset: () => modal(`<h2>${ui('reset_ask')}</h2><button class="btn" data-a="resetyes">${ui('yes')}</button><button class="btn pri" data-a="mclose">${ui('no')}</button>`),
  resetyes: () => { try { localStorage.removeItem(saveKey()); } catch (e) { } location.reload(); },
  gstart: () => startGame(), gquit: () => closeGame(), gback: () => closeGame(),
  gagain: () => { if (GAME && GAME.o.canPlay && !GAME.o.canPlay()) return; showIntro(); },
  go3d: () => { if (typeof open3D === 'function') open3D(); else toast(ui('no3d')); }
};
document.addEventListener('click', e => {
  const t = e.target.closest('[data-a]'); if (!t) return;
  const f = ACT[t.dataset.a]; if (f) { sfx('tap'); f(t, e); }
});

/* ---------- boot ---------- */
function dailyBonus() {
  const t = today(); if (G.lastDay === t) return;
  const y = new Date(); y.setDate(y.getDate() - 1); const ys = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
  G.streak = G.lastDay === ys ? G.streak + 1 : 1; G.lastDay = t;
  const n = 20 + Math.min(G.streak, 10) * 5; G.coins += n; save();
  modal(`<div class="mbig">🎁</div><h2>${ui('daily', { n })}</h2><p class="mtext">${ui('streak', { n: G.streak })}</p><button class="btn pri" data-a="mclose">${ui('ok')}</button>`);
}
function boot() {
  load(); LANG = LANGS[G.lang] ? G.lang : 'he'; SND = G.sound !== false;
  $('#btn-vip').dataset.a = 'vip'; $('#btn-set').dataset.a = 'settings'; $('#btn-snd').dataset.a = 'sound'; $('#btn-acc').dataset.a = 'acc';
  renderAll(); dailyBonus();
  setInterval(() => {
    if (UIS.screen !== 'world' || !UIS.wid) return;
    refreshChar(UIS.wid); renderStats(); if (!MOPEN && !GAME && !UIS.busy && Math.random() < .45) react(UIS.wid, 'idle');
  }, 9000);
  setInterval(() => { if (UIS.screen === 'world' && !GAME) { save(); } }, 20000);
}
window.addEventListener('DOMContentLoaded', boot);
