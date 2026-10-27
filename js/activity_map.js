'use strict';
/* =====================================================================
   Maps every activity to one of the full game engines, with a skin /
   ruleset that makes each character's games feel different.
   Format:  'world.activity': ['engine', {cfg}]   (cfg === null keeps old cfg)
   ===================================================================== */
const ARROWS = ['⬅️', '⬆️', '➡️', '⬇️'];
const AM = {
  /* ---- Dubi MH: football fan ---- */
  'dubi.penalty': ['penalty', { kicks: 5 }],
  'dubi.sing': ['rhythm', { pads: ['🥁', '🎺', '📣', '🎶'], me: '🐻', theme: 'stadium', notes: 30 }],
  'dubi.cheer': ['osu', { icon: '📣', theme: 'stadium', n: 24 }],
  'dubi.mealday': ['cook', { steps: ['add:🥖', 'add:🌭', 'bake', 'chop:🧅', 'season'], extra: ['🧦', '🍋', '🥕'], pot: '🌭' }],
  'dubi.flags': ['catch', { good: ['🚩', '🧣', '⚽'], bad: ['🍅', '👟'], me: '🧺', theme: 'stadium', time: 30 }],
  'dubi.facepaint': ['trace', { shapes: ['circle', 'star', 'heart'], tool: '🖌️', colors: ['#16a34a', '#f8fafc'], bg: ['#bbf7d0', '#dcfce7'] }],
  'dubi.mascot': ['simon', { pads: ARROWS, rounds: 6 }],
  'dubi.tifo': ['mosaic', { c1: '#16a34a' }],
  'dubi.goal': ['penalty', { kicks: 6, wall: true, keep: false }],

  /* ---- Efrochi: farm chick ---- */
  'efro.feedhen': ['cook', { steps: ['add:🌽', 'add:🌾', 'mix', 'add:🥛'], extra: ['🧦', '🌶️'], pot: '🥣' }],
  'efro.hideseek': ['seek', { hider: '🐥', decoy: ['🦊'], spots: ['🌾', '🏠', '🪣', '🌻', '🛻', '🧺'], theme: 'farm', hiders: 4 }],
  'efro.eggs': ['catch', { good: ['🥚', '🥚', '🐣'], bad: ['🪨'], me: '🧺', fragile: true, theme: 'farm', time: 30 }],
  'efro.dustbath': ['wash', { mode: 'clean', art: 'efro' }],
  'efro.flylearn': ['flappy', { me: '🐥', star: '🪶', pillar: 'tree', theme: 'farm', gaps: 12 }],
  'efro.peck': ['osu', { icon: '🌽', theme: 'farm', n: 24 }],
  'efro.songchick': ['rhythm', { pads: ['🐓', '🐥', '🌅', '🎵'], me: '🐓', theme: 'sky', notes: 30 }],
  'efro.tidy': ['sort', { theme: 'farm' }],
  'efro.haystack': ['stack', { theme: 'farm', floors: 9 }],
  'efro.flyfinal': ['flappy', { me: '🐥', star: '⭐', pillar: 'cloud', theme: 'sky', gaps: 18 }],

  /* ---- Lemilam: pampered llama model ---- */
  'lemi.fur': ['wash', { mode: 'brush', art: 'lemi' }],
  'lemi.ribbon': ['decorate', { base: '🎀', items: ['🎀', '🌸', '💎', '⭐', '🦋', '🌈', '🍓', '🌼'], bg: ['#fbcfe8', '#fde68a'] }],
  'lemi.shake': ['cook', { steps: ['add:🥭', 'chop:🍍', 'add:🥥', 'mix', 'add:🧊'], extra: ['🧦', '🧅'], pot: '🥤' }],
  'lemi.runway': ['runner', { me: '🦙', theme: 'candy', obs: ['low', 'wall'], skin: { low: '🍌', wall: '📸', coin: '💎', bonus: '👑' }, time: 30 }],
  'lemi.pose': ['photo', { art: 'lemi', poses: ['💋', '💃', '😎', '🤩'], bg: ['#fbcfe8', '#f9a8d4'] }],
  'lemi.mani': ['trace', { shapes: ['circle', 'heart', 'bow'], tool: '💅', color: '#ec4899', colors: ['#ec4899', '#a855f7'], bg: ['#fce7f3', '#fbcfe8'] }],
  'lemi.wardrobe': ['sort', { theme: 'candy' }],
  'lemi.bubbles': ['bubbles', { inner: ['🫧', '🐠', '⭐'], bad: '🪨' }],
  'lemi.flowers': ['decorate', { base: '🏺', items: ['🌸', '🌺', '🌷', '🌻', '🌹', '🌼', '🍃'], slots: 4, bg: ['#d1fae5', '#fce7f3'] }],
  'lemi.fashionshow': ['chain', { parts: [{ g: 'runner', icon: '👠', cfg: { me: '🦙', theme: 'candy', obs: ['low', 'wall'], skin: { low: '🍌', wall: '📸', coin: '💎' }, time: 24 } }, { g: 'photo', icon: '📸', cfg: { art: 'lemi', poses: ['💋', '💃', '😎', '🤩'], shots: 6, bg: ['#fbcfe8', '#f9a8d4'] } }, { g: 'decorate', icon: '👑', cfg: { base: '🎀', items: ['🎀', '🌸', '💎', '⭐', '🦋', '🌈', '🍓', '🌼'], customers: 2, bg: ['#fbcfe8', '#fde68a'] } }] }],

  /* ---- Ruchi: ghost in the moonlit castle ---- */
  'ruchi.float': ['flappy', { me: '👻', star: '✨', pillar: 'tower', theme: 'castle', gaps: 12 }],
  'ruchi.cotton': ['cotton', { n: 3 }],
  'ruchi.scare': ['whack', { good: ['😱'], bad: ['😎'], gold: '🤴', boss: '🧙', hole: '#312e81', theme: 'castle' }],
  'ruchi.lost': ['maze', { me: '👻', item: '🔑', enemy: '🦇', fog: 2.8, theme: 'castle', items: 6 }],
  'ruchi.lantern': ['lights', {}],
  'ruchi.castle': ['wash', { mode: 'clean', base: '🏰' }],
  'ruchi.moonjump': ['doodle', { me: '👻', plat: '☁️', item: '⭐', theme: 'castle' }],
  'ruchi.books': ['sort', { theme: 'castle' }],
  'ruchi.ghostdance': ['rhythm', { pads: ['🌙', '⭐', '☁️', '✨'], me: '👻', theme: 'castle', notes: 34 }],
  'ruchi.moonflight': ['chain', { parts: [{ g: 'flappy', icon: '🌙', cfg: { me: '👻', star: '🌟', pillar: 'tower', theme: 'castle', gaps: 10 } }, { g: 'doodle', icon: '☁️', cfg: { me: '👻', plat: '☁️', item: '🌟', theme: 'castle', height: 1800 } }] }],

  /* ---- Dubila: bear in a koala costume ---- */
  'dubila.washcostume': ['wash', { mode: 'bath', art: 'dubila' }],
  'dubila.taste': ['memory', { cards: ['🍗', '🍝', '🥗', '🍲', '🍰', '🥐'] }],
  'dubila.schnitzel': ['catch', { good: ['🍗', '🍗', '🥔'], bad: ['🌶️', '🧦'], me: '🧺', theme: 'kitchen', time: 30 }],
  'dubila.bake': ['cook', { steps: ['add:🥚', 'add:🧈', 'mix', 'add:🍎', 'bake'], extra: ['🧦', '🌶️'], pot: '🥧' }],
  'dubila.eucalyptus': ['runner', { me: '🐨', theme: 'park', skin: { low: '🪨', high: '🐍', coin: '🌿', bonus: '🍯' }, time: 30 }],
  'dubila.pillowtower': ['stack', { theme: 'kitchen', floors: 9 }],
  'dubila.fridge': ['sort', { theme: 'kitchen' }],
  'dubila.secret': ['simon', { pads: ['🧂', '🌶️', '🍯', '🍋'], rounds: 6 }],
  'dubila.sweethunt': ['chase', { good: ['🧁', '🍩', '🍪'], bad: ['🧅'], theme: 'kitchen' }],
  'dubila.feast': ['chain', { parts: [{ g: 'cook', icon: '🥩', cfg: { steps: ['chop:🥔', 'add:🥩', 'add:🌿', 'bake'], extra: ['🧦', '🍋'], pot: '🍖' } }, { g: 'catch', icon: '🍗', cfg: { good: ['🍗', '🥔', '🍰'], bad: ['🌶️'], me: '🧺', theme: 'kitchen', time: 18 } }, { g: 'cook', icon: '🍰', cfg: { steps: ['add:🥚', 'mix', 'add:🍓', 'bake'], extra: ['🧦'], pot: '🍰' } }] }],

  /* ---- Marshmallow Cat: candy land ---- */
  'marsh.shade': ['catch', { good: ['🧊', '❄️', '🍦'], bad: ['☀️', '🔥'], me: '☂️', theme: 'candy', time: 30 }],
  'marsh.choco': ['cook', { steps: ['add:🥛', 'bake', 'add:🍫', 'mix', 'add:🍬'], extra: ['🧦', '🌶️'], pot: '☕' }],
  'marsh.softjump': ['doodle', { me: '🐱', plat: '☁️', item: '🍬', theme: 'candy' }],
  'marsh.haircut': ['trace', { shapes: ['scissors', 'wave', 'circle'], tool: '✂️', color: '#f472b6', bg: ['#fce7f3', '#fbcfe8'] }],
  'marsh.candyhunt': ['whack', { good: ['🍬', '🍭', '🍩'], bad: ['🌶️'], gold: '🍰', boss: '🍫', hole: '#be185d', theme: 'candy' }],
  'marsh.igloo': ['stack', { theme: 'ice', floors: 9 }],
  'marsh.rainbowpaint': ['trace', { shapes: ['rainbow', 'wave', 'spiral'], tool: '🖌️', colors: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'], bg: ['#e0f2fe', '#fce7f3'] }],
  'marsh.donuts': ['decorate', { base: '🍩', items: ['🍓', '🍫', '🌈', '⭐', '🍬', '🥜', '🍒', '🌸'], bg: ['#fbcfe8', '#a5f3fc'] }],
  'marsh.freezeray': ['shooter', { foe: '🔥', ammo: '🧊', base: '🍬', turret: '🔦', theme: 'candy' }],
  'marsh.parade': ['runner', { me: '🐱', theme: 'candy', skin: { coin: '🍬', low: '🍩', high: '🍭', bonus: '🧁' }, time: 32 }],

  /* ---- Mishmish: the chubby dog in the park ---- */
  'mish.bigwalk': ['runner', { me: '🐕', theme: 'park', skin: { coin: '🪙', bonus: '🦋', low: '🪨', high: '🌿' }, time: 34 }],
  'mish.frisbee': ['frisbee', { me: '🐕' }],
  'mish.belly': ['wash', { mode: 'brush', art: 'mish' }],
  'mish.leash': ['tug', { foe: '🐶', icon: '🧑' }],
  'mish.sniff': ['maze', { me: '🐶', item: '🌼', enemy: false, fog: 3.4, theme: 'park', items: 7 }],
  'mish.butterfly': ['chase', { good: ['🦋'], bad: ['🐝'], theme: 'park' }],
  'mish.fountain': ['catch', { good: ['💦', '🫧'], bad: ['🪨'], me: '🐶', theme: 'park', time: 30 }],
  'mish.fetch': ['hoops', { mode: 'target', ball: '🦴', target: '🐶', shots: 8 }],
  'mish.tricks': ['reaction', { set: ['🪑', '🔄', '🐾', '🗣️', '🥎', '✋'], host: '🧑' }],
  'mish.golden': ['chain', { parts: [{ g: 'runner', icon: '🐕', cfg: { me: '🐕', theme: 'park', skin: { coin: '🪙', bonus: '🦴' }, time: 22 } }, { g: 'frisbee', icon: '🥏', cfg: { me: '🐕', throws: 5 } }, { g: 'hoops', icon: '🦴', cfg: { mode: 'target', ball: '🦴', target: '🐶', shots: 5 } }] }],

  /* ---- Hugsy (VIP): Joey's penguin ---- */
  'hugsy.tv': ['memory', null],
  'hugsy.foosball': ['foosball', {}],
  'hugsy.dance': ['rhythm', { pads: ['💃', '🕺', '🎵', '🪩'], me: '🐧', theme: 'night', notes: 32 }],
  'hugsy.hidepeng': ['seek', { hider: '🐧', decoy: ['🦆', '🐔'], spots: ['🛋️', '🪴', '📦', '🚪', '🛏️', '📺'], theme: 'kitchen', hiders: 4 }],
  'hugsy.pillow': ['stack', { theme: 'kitchen', floors: 9 }],
  'hugsy.special': ['guard', { food: '🍕', thieves: ['🦆', '🐔', '🐶'], slices: 8, theme: 'kitchen' }],
  'hugsy.pour': ['pour', { fill: '#fbbf24' }],
  'hugsy.groceries': ['sort', { theme: 'kitchen' }],
  'hugsy.moistmaker': ['cook', { steps: ['add:🦃', 'chop:🥔', 'add:🍞', 'mix', 'bake'], extra: ['🧦', '🍋'], pot: '🥪' }],
  'hugsy.waddle': ['runner', { me: '🐧', theme: 'ice', skin: { low: '🧊', high: '❄️', coin: '🐟', bonus: '⭐' }, time: 30 }],
  'hugsy.pushups': ['gym', { kind: 'push', me: '🐧' }],
  'hugsy.stretch': ['gym', { kind: 'stretch', me: '🐧' }],
  'hugsy.weights': ['gym', { kind: 'lift', me: '🐧' }],
  'hugsy.poses': ['photo', { art: 'hugsy', poses: ['😎', '🤩', '😘', '🥰'] }],
  'hugsy.shutter': ['photo', { art: 'hugsy', shots: 10, poses: ['🥣', '📦', '😎', '🌟'], bg: ['#fef3c7', '#fcd34d'] }],
  'hugsy.style': ['decorate', { art: 'hugsy', items: ['🎩', '🕶️', '🧣', '🎀', '🧢', '👑', '🎧', '🤠'], bg: ['#fde68a', '#fbcfe8'] }],
  'hugsy.flakes': ['catch', { good: ['🌽', '🥣', '⭐'], bad: ['🧦'], me: '📦', theme: 'kitchen', time: 30 }],
  'hugsy.lines': ['reaction', { set: ['😀', '😢', '😡', '😮', '😴', '🤩'], host: '🎬' }],
  'hugsy.operate': ['surgery', { patient: '🧸' }],
  'hugsy.mark': ['spotlight', { me: '🐧' }],
  'hugsy.cuecards': ['catch', { good: ['📝'], list: ['📝'], bad: ['🍌'], me: '🐧', theme: 'night', time: 28 }],
  'hugsy.audition': ['chain', { parts: [{ g: 'reaction', icon: '🎭', cfg: { set: ['😀', '😢', '😡', '😮', '😴', '🤩'], host: '🎬', n: 10 } }, { g: 'spotlight', icon: '🔦', cfg: { me: '🐧', secs: 20 } }, { g: 'photo', icon: '📸', cfg: { art: 'hugsy', shots: 6, poses: ['🩺', '😮', '😎', '🥼'], bg: ['#e0f2fe', '#bae6fd'] } }] }],
  'hugsy.duckchick': ['catch', { good: ['🌾', '🍞'], bad: ['🌶️'], me: '🦆', theme: 'farm', time: 28 }],
  'hugsy.smelly': ['rhythm', { pads: ['🎸', '🎤', '🥁', '🎹'], me: '🧑‍🎤', theme: 'night', notes: 34 }],
  'hugsy.jokes': ['whack', { good: ['😂'], bad: ['😐'], gold: '🤣', boss: '🤪', hole: '#7c3aed', theme: 'night' }],
  'hugsy.pivot': ['pivot', {}],
  'hugsy.laundry': ['chain', { parts: [{ g: 'wash', icon: '🦺', cfg: { mode: 'bath', art: 'hvest', secs: 75 } }, { g: 'wash', icon: '🧢', cfg: { mode: 'clean', art: 'hbeanie', secs: 60 } }, { g: 'wash', icon: '🥽', cfg: { mode: 'clean', art: 'hgoggles', secs: 60 } }, { g: 'wash', icon: '🧣', cfg: { mode: 'clean', art: 'hscarf', secs: 60 } }] }],
  'hugsy.monicacook': ['cook', { steps: ['add:🍝', 'chop:🍅', 'add:🧀', 'mix', 'bake', 'season'], extra: ['🧦', '🍋', '🥕'], pot: '🍲' }],

  /* ---- Mom ---- */
  'mom.laundry': ['sort', { theme: 'kitchen' }],
  'mom.clean': ['wash', { mode: 'clean', base: '🪟' }],
  'mom.organize': ['memory', null],
  'mom.cook_pasta': ['cook', { steps: ['add:💧', 'add:🍝', 'bake', 'chop:🍅', 'mix', 'season'], extra: ['🧦', '🍋'], pot: '🍝' }],
  'mom.dishes': ['wash', { mode: 'clean', base: '🍽️' }],
  'mom.cook_soup': ['cook', { steps: ['chop:🥕', 'chop:🧅', 'add:🥔', 'add:🍗', 'bake', 'season'], extra: ['🧦', '🍫'], pot: '🍲' }],
  'mom.shop': ['catch', { good: ['🍎', '🥕', '🥛', '🍞'], list: ['🍎', '🥕', '🥛', '🍞'], bad: ['🪨', '🧨'], me: '🛒', theme: 'kitchen', time: 30 }],
  'mom.cook_cake': ['cook', { steps: ['add:🥚', 'add:🥛', 'add:🧈', 'mix', 'bake', 'add:🍓'], extra: ['🧦', '🧅'], pot: '🎂' }],
  'mom.cook_salad': ['cook', { steps: ['chop:🥬', 'chop:🍅', 'chop:🥒', 'add:🫒', 'mix', 'season'], extra: ['🧦', '🍫'], pot: '🥗' }],
  'mom.cook_pizza': ['cook', { steps: ['add:🍞', 'add:🍅', 'add:🧀', 'chop:🍄', 'bake', 'season'], extra: ['🧦', '🍫', '🍓'], pot: '🍕' }],
  'mom.cook_feast': ['chain', { parts: [{ g: 'cook', icon: '🦃', cfg: { steps: ['add:🦃', 'chop:🥔', 'add:🧄', 'bake', 'season'], extra: ['🧦'], pot: '🦃' } }, { g: 'cook', icon: '🥧', cfg: { steps: ['add:🥚', 'add:🍎', 'mix', 'bake'], extra: ['🧦'], pot: '🥧' } }, { g: 'sort', icon: '🍽️', cfg: { bins: [{ e: '🍽️', k: 'a', l: T('לשולחן', 'To the table', 'إلى الطاولة', 'На стол', 'A la mesa') }, { e: '🗑️', k: 'b', l: T('לפח', 'Trash', 'قمامة', 'В мусор', 'Basura') }], items: [{ e: '🦃', k: 'a' }, { e: '🥧', k: 'a' }, { e: '🥔', k: 'a' }, { e: '🧦', k: 'b' }, { e: '🍌', k: 'b' }], n: 10, theme: 'kitchen' } }] }],

  /* ---- Sister 18 (army) ---- */
  'sis18.bootcamp': ['runner', { me: '🏃‍♀️', theme: 'army', obs: ['low', 'high'], skin: { low: '🧱', high: '🪢', coin: '⭐', bonus: '🏅' }, time: 32 }],
  'sis18.shoes': ['wash', { mode: 'polish', base: '🥾' }],
  'sis18.gear': ['sort', { theme: 'army' }],
  'sis18.pushup': ['gym', { kind: 'push', me: '👩‍✈️' }],
  'sis18.march': ['simon', { pads: ARROWS, rounds: 7 }],
  'sis18.ropeclimb': ['climb', { me: '🧗‍♀️' }],
  'sis18.nav': ['maze', { me: '🏃‍♀️', item: '📍', enemy: false, fog: 3.2, theme: 'army', items: 6 }],
  'sis18.marathon': ['runner', { me: '🏃‍♀️', theme: 'army', skin: { low: '🪨', high: '🌿', coin: '💧', bonus: '🍌' }, time: 38 }],
  'sis18.mess': ['cook', { steps: ['chop:🥔', 'chop:🥕', 'add:🍖', 'add:🧅', 'bake', 'season'], extra: ['🧦', '🍫'], pot: '🍲' }],
  'sis18.firstaid': ['surgery', { patient: '🤕' }],

  /* ---- Dad (builder) ---- */
  'dad.tower': ['stack', { theme: 'build', floors: 10 }],
  'dad.crane': ['crane', {}],
  'dad.bricks': ['catch', { good: ['🧱', '🧱', '🪵'], bad: ['💣', '🪨'], me: '🚜', theme: 'build', time: 30 }],
  'dad.hammer': ['osu', { icon: '🔩', theme: 'build', n: 24 }],
  'dad.sitemgr': ['sort', { theme: 'build' }],
  'dad.sell': ['quiz', { kind: 'math', host: '🏠', n: 10 }],
  'dad.showflat': ['memory', null],
  'dad.blueprint': ['trace', { shapes: ['house', 'bow', 'star'], tool: '✏️', color: '#2563eb', bg: ['#dbeafe', '#bfdbfe'] }],
  'dad.concrete': ['cook', { steps: ['add:🪨', 'add:💧', 'add:🏖️', 'mix', 'mix'], extra: ['🧦', '🍫'], pot: '🛢️' }],
  'dad.inspect': ['seek', { hider: '⚠️', decoy: ['✅'], spots: ['🧱', '📦', '🚧', '🛢️', '🪜', '⚙️'], hiders: 4, theme: 'build' }],
  'dad.deal': ['haggle', {}],

  /* ---- Brother 14 (tennis + gym + school) ---- */
  'bro14.serve': ['hoops', { mode: 'target', ball: '🎾', target: '🎯', shots: 8 }],
  'bro14.rally': ['tennis', { points: 4 }],
  'bro14.ballpick': ['catch', { good: ['🎾'], bad: ['🪨'], me: '🧺', theme: 'court', time: 30 }],
  'bro14.weights': ['gym', { kind: 'lift', me: '🧑' }],
  'bro14.treadmill': ['runner', { me: '🏃', theme: 'gym', skin: { low: '🧱', high: '🎽', coin: '⚡', bonus: '💧' }, time: 30 }],
  'bro14.study': ['quiz', { kind: 'math', host: '👨‍🏫', n: 10 }],
  'bro14.strength': ['reaction', { set: ['🦵', '💪', '🤸', '🧘', '🏃', '🏋️'], host: '🏋️' }],
  'bro14.study2': ['quiz', { kind: 'seq', host: '🧪', n: 10 }],
  'bro14.stretch': ['gym', { kind: 'stretch', me: '🧑' }],
  'bro14.tournament': ['chain', { parts: [{ g: 'tennis', icon: '🎾', cfg: { points: 3 } }, { g: 'tug', icon: '💪', cfg: { foe: '🤾', icon: '🎾' } }, { g: 'tennis', icon: '🏆', cfg: { points: 3 } }] }],
  'bro14.agility': ['rhythm', { pads: ARROWS, me: '🏃', theme: 'gym', notes: 32 }],

  /* ---- Sister 8 (basketball + school) ---- */
  'sis8.hoops': ['hoops', { mode: 'hoop', ball: '🏀' }],
  'sis8.study_a': ['quiz', { kind: 'math', host: '👩‍🏫', n: 8 }],
  'sis8.study_b': ['quiz', { kind: 'count', host: '🧸', n: 8 }],
  'sis8.jumprope': ['jumprope', { me: '👧' }],
  'sis8.dribble': ['rhythm', { pads: ARROWS, me: '⛹️‍♀️', theme: 'court', notes: 28 }],
  'sis8.game': ['runner', { me: '⛹️‍♀️', theme: 'court', skin: { low: '🧱', high: '🪧', coin: '🏀', bonus: '⭐' }, time: 28 }],
  'sis8.study_c': ['quiz', { kind: 'seq', host: '🧩', n: 8 }],
  'sis8.art': ['trace', { shapes: ['house', 'star', 'heart'], tool: '🖍️', colors: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'], bg: ['#fef9c3', '#fde68a'] }],
  'sis8.lunch': ['sort', { theme: 'park' }],
  'sis8.recess': ['chase', { good: ['😄'], bad: ['😴'], theme: 'park' }]
};
(function applyMap() {
  for (const key in AM) {
    const [wid, aid] = key.split('.'), w = WORLDS[wid]; if (!w) { console.warn('map: no world', wid); continue; }
    const a = w.acts.find(x => x.id === aid); if (!a) { console.warn('map: no activity', key); continue; }
    a.g = AM[key][0]; if (AM[key][1] !== null) a.cfg = Object.assign({}, a.cfg && AM[key][0] === a.g && ['sort', 'memory'].includes(a.g) ? a.cfg : {}, AM[key][1]);
  }
  // every activity must have a registered engine
  for (const id in WORLDS) WORLDS[id].acts.forEach(a => { if (!GAMES[a.g]) console.warn('missing engine', id, a.id, a.g); });
})();
