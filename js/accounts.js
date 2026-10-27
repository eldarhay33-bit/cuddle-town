'use strict';
/* =====================================================================
   Accounts — every player can make a profile (name + password) that keeps
   its own saved progress on this device. Progress can be moved between
   devices with a progress code (copy / paste or a file).
   Passwords are never stored: only a salted PBKDF2 (or SHA-256) hash.
   Everything stays in this browser — nothing is sent anywhere.
   ===================================================================== */
Object.assign(UI, {
  ac_btn: T('חשבון', 'Account', 'الحساب', 'Аккаунт', 'Cuenta'),
  ac_title: T('חשבון שחקן', 'Player account', 'حساب اللاعب', 'Аккаунт игрока', 'Cuenta de jugador'),
  ac_intro: T('צרו חשבון כדי לשמור את ההתקדמות שלכם בצורה בטוחה.', 'Create an account to keep your progress safe.', 'أنشئ حسابًا لحفظ تقدّمك بأمان.', 'Создай аккаунт, чтобы сохранить свой прогресс.', 'Crea una cuenta para guardar tu progreso a salvo.'),
  ac_keep: T('להעביר את ההתקדמות הנוכחית לחשבון הזה', 'Move my current progress into this account', 'نقل تقدّمي الحالي إلى هذا الحساب', 'Перенести мой текущий прогресс в этот аккаунт', 'Mover mi progreso actual a esta cuenta'),
  ac_in: T('כניסה', 'Sign in', 'دخول', 'Войти', 'Entrar'),
  ac_up: T('יצירת חשבון', 'Create account', 'إنشاء حساب', 'Создать аккаунт', 'Crear cuenta'),
  ac_name: T('שם משתמש', 'Username', 'اسم المستخدم', 'Имя пользователя', 'Nombre de usuario'),
  ac_pw: T('סיסמה', 'Password', 'كلمة المرور', 'Пароль', 'Contraseña'),
  ac_pw2: T('סיסמה שוב', 'Repeat password', 'أعد كلمة المرور', 'Повтори пароль', 'Repite la contraseña'),
  ac_guest: T('להמשיך כאורח', 'Continue as guest', 'المتابعة كضيف', 'Продолжить как гость', 'Seguir como invitado'),
  ac_hello: T('שלום {n}!', 'Hello {n}!', 'مرحبًا {n}!', 'Привет, {n}!', '¡Hola, {n}!'),
  ac_saved: T('ההתקדמות נשמרת אוטומטית בחשבון הזה.', 'Your progress is saved automatically in this account.', 'يُحفظ تقدّمك تلقائيًا في هذا الحساب.', 'Прогресс автоматически сохраняется в этом аккаунте.', 'Tu progreso se guarda automáticamente en esta cuenta.'),
  ac_local: T('החשבונות שמורים במכשיר הזה בלבד. כדי לעבור למכשיר אחר — השתמשו בקוד התקדמות.', 'Accounts live on this device only. To switch devices, use a progress code.', 'الحسابات محفوظة على هذا الجهاز فقط. للانتقال إلى جهاز آخر استخدم رمز التقدّم.', 'Аккаунты хранятся только на этом устройстве. Чтобы перейти на другое, используй код прогресса.', 'Las cuentas viven solo en este dispositivo. Para cambiar de dispositivo usa un código de progreso.'),
  ac_cta: T('צרו חשבון כדי לשמור התקדמות', 'Create an account to save progress', 'أنشئ حسابًا لحفظ التقدّم', 'Создай аккаунт, чтобы сохранить прогресс', 'Crea una cuenta para guardar el progreso'),
  ac_logout: T('התנתקות', 'Log out', 'تسجيل الخروج', 'Выйти', 'Cerrar sesión'),
  ac_delete: T('מחיקת החשבון', 'Delete account', 'حذف الحساب', 'Удалить аккаунт', 'Eliminar cuenta'),
  ac_delask: T('למחוק את החשבון ואת ההתקדמות שלו? אי אפשר לשחזר.', 'Delete this account and its progress? This cannot be undone.', 'حذف هذا الحساب وتقدّمه؟ لا يمكن التراجع.', 'Удалить аккаунт и его прогресс? Это нельзя отменить.', '¿Eliminar esta cuenta y su progreso? No se puede deshacer.'),
  ac_export: T('גיבוי: קוד התקדמות', 'Backup: progress code', 'نسخة احتياطية: رمز التقدّم', 'Резервная копия: код прогресса', 'Copia: código de progreso'),
  ac_import: T('שחזור מקוד התקדמות', 'Restore from a progress code', 'استعادة من رمز التقدّم', 'Восстановить из кода прогресса', 'Restaurar desde un código'),
  ac_code_hint: T('העתיקו את הקוד ושמרו אותו. אפשר להדביק אותו במכשיר אחר כדי להמשיך משם.', 'Copy this code and keep it safe. Paste it on another device to continue there.', 'انسخ الرمز واحتفظ به. الصقه على جهاز آخر لتكمل هناك.', 'Скопируй код и сохрани его. Вставь его на другом устройстве, чтобы продолжить там.', 'Copia el código y guárdalo. Pégalo en otro dispositivo para seguir allí.'),
  ac_copy: T('העתקה', 'Copy', 'نسخ', 'Копировать', 'Copiar'),
  ac_copied: T('הועתק ✓', 'Copied ✓', 'تم النسخ ✓', 'Скопировано ✓', 'Copiado ✓'),
  ac_file: T('הורדה כקובץ', 'Download as file', 'تنزيل كملف', 'Скачать файлом', 'Descargar archivo'),
  ac_paste: T('הדביקו כאן את קוד ההתקדמות', 'Paste your progress code here', 'الصق رمز التقدّم هنا', 'Вставь сюда код прогресса', 'Pega aquí tu código de progreso'),
  ac_load: T('טעינה', 'Load', 'تحميل', 'Загрузить', 'Cargar'),
  ac_loaded: T('ההתקדמות נטענה! 🎉', 'Progress loaded! 🎉', 'تم تحميل التقدّم! 🎉', 'Прогресс загружен! 🎉', '¡Progreso cargado! 🎉'),
  ac_badcode: T('הקוד לא תקין', 'That code is not valid', 'الرمز غير صالح', 'Код недействителен', 'Ese código no es válido'),
  ac_importask: T('לטעון את ההתקדמות מהקוד? ההתקדמות הנוכחית תוחלף.', 'Load progress from this code? Your current progress will be replaced.', 'تحميل التقدّم من الرمز؟ سيتم استبدال تقدّمك الحالي.', 'Загрузить прогресс из кода? Текущий прогресс будет заменён.', '¿Cargar el progreso del código? Se reemplazará tu progreso actual.'),
  ac_e_name: T('שם: 2–16 תווים (אותיות, ספרות, רווח, - או _)', 'Name: 2–16 characters (letters, numbers, space, - or _)', 'الاسم: 2–16 حرفًا (حروف أو أرقام أو مسافة أو - أو _)', 'Имя: 2–16 символов (буквы, цифры, пробел, - или _)', 'Nombre: 2–16 caracteres (letras, números, espacio, - o _)'),
  ac_e_pw: T('סיסמה: לפחות 4 תווים', 'Password: at least 4 characters', 'كلمة المرور: 4 أحرف على الأقل', 'Пароль: минимум 4 символа', 'Contraseña: al menos 4 caracteres'),
  ac_e_pw2: T('הסיסמאות לא זהות', "The passwords don't match", 'كلمتا المرور غير متطابقتين', 'Пароли не совпадают', 'Las contraseñas no coinciden'),
  ac_e_taken: T('השם הזה כבר תפוס', 'That name is already taken', 'هذا الاسم مستخدم بالفعل', 'Это имя уже занято', 'Ese nombre ya está en uso'),
  ac_e_nouser: T('אין חשבון בשם הזה', 'No account with that name', 'لا يوجد حساب بهذا الاسم', 'Нет аккаунта с таким именем', 'No hay ninguna cuenta con ese nombre'),
  ac_e_badpw: T('סיסמה שגויה', 'Wrong password', 'كلمة المرور خاطئة', 'Неверный пароль', 'Contraseña incorrecta'),
  ac_welcome: T('החשבון נוצר! ההתקדמות נשמרת 💾', 'Account created! Your progress is saved 💾', 'تم إنشاء الحساب! تقدّمك محفوظ 💾', 'Аккаунт создан! Прогресс сохранён 💾', '¡Cuenta creada! Tu progreso está guardado 💾'),
  ac_back: T('חזרה', 'Back', 'رجوع', 'Назад', 'Volver')
});

const ACC = (() => {
  const DBK = 'cuddletown.accounts.v1', GUEST = 'cuddletown.v1', ITER = 120000;
  let db = { users: {}, cur: null };
  try { const j = JSON.parse(localStorage.getItem(DBK) || 'null'); if (j && j.users) db = j; } catch (e) { }
  const persist = () => { try { localStorage.setItem(DBK, JSON.stringify(db)); } catch (e) { } };
  const clean = n => String(n || '').trim().replace(/\s+/g, ' ');
  const norm = n => clean(n).toLowerCase();
  const NAME_RE = /^[\p{L}\p{N}_\- ]{2,16}$/u;
  const keyOf = k => GUEST + '.u.' + k;
  const toHex = b => Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
  const fromHex = h => new Uint8Array((h.match(/../g) || []).map(x => parseInt(x, 16)));
  const rand = n => { const a = new Uint8Array(n); try { crypto.getRandomValues(a); } catch (e) { for (let i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 256); } return a; };
  const b64 = u8 => { let s = ''; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return btoa(s); };
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

  /* plain-JS SHA-256 (used when crypto.subtle is not available) */
  const primes = []; for (let n = 2; primes.length < 64; n++) if (primes.every(p => n % p)) primes.push(n);
  const fr = x => x - Math.floor(x), K32 = primes.map(p => Math.floor(fr(Math.cbrt(p)) * 4294967296) >>> 0), H32 = primes.slice(0, 8).map(p => Math.floor(fr(Math.sqrt(p)) * 4294967296) >>> 0);
  function sha256(msg) {
    const l = msg.length, nb = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(nb); m.set(msg); m[l] = 128; const dv = new DataView(m.buffer); dv.setUint32(nb - 4, (l * 8) >>> 0); dv.setUint32(nb - 8, Math.floor(l * 8 / 4294967296));
    const h = H32.slice(), w = new Uint32Array(64), rr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let o = 0; o < nb; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(o + i * 4);
      for (let i = 16; i < 64; i++) { const a = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ (w[i - 15] >>> 3), b = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + a + w[i - 7] + b) >>> 0; }
      let [a, b, c, d, e, f, g, hh] = h;
      for (let i = 0; i < 64; i++) {
        const t1 = (hh + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & f) ^ (~e & g)) + K32[i] + w[i]) >>> 0, t2 = ((rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
        hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0; h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0; h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
    }
    const out = new Uint8Array(32), ov = new DataView(out.buffer); h.forEach((x, i) => ov.setUint32(i * 4, x)); return out;
  }
  async function hashPw(pw, saltHex, iter) {
    const enc = new TextEncoder(), salt = fromHex(saltHex);
    if (window.crypto && crypto.subtle) {
      try { const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']); return 'p' + toHex(new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, key, 256))); } catch (e) { }
    }
    let h = sha256(Uint8Array.from([...salt, ...enc.encode(pw)])); for (let i = 0; i < 3000; i++) h = sha256(h); return 's' + toHex(h);
  }
  const same = (a, b) => { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; };

  /* progress codes: CT2 = deflate + base64, CT1 = plain base64 */
  async function pack(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    try { if (window.CompressionStream) { const cs = new CompressionStream('deflate'), w = cs.writable.getWriter(); w.write(bytes); w.close(); return 'CT2:' + b64(new Uint8Array(await new Response(cs.readable).arrayBuffer())); } } catch (e) { }
    return 'CT1:' + b64(bytes);
  }
  async function unpack(code) {
    const m = /^CT([12]):([A-Za-z0-9+/=]+)$/.exec(String(code || '').replace(/\s+/g, '')); if (!m) throw new Error('format');
    const bytes = unb64(m[2]); let json;
    if (m[1] === '2') { const ds = new DecompressionStream('deflate'), w = ds.writable.getWriter(); w.write(bytes).catch(() => { }); w.close().catch(() => { }); json = await new Response(ds.readable).text(); } else json = new TextDecoder().decode(bytes);
    const o = JSON.parse(json); if (!o || typeof o !== 'object' || !o.g || typeof o.g !== 'object' || typeof o.g.chars !== 'object') throw new Error('data'); return o;
  }

  const api = {
    sha256, hashPw, pack, unpack,
    user() { const u = db.cur && db.users[db.cur]; return u ? { key: db.cur, name: u.name } : null; },
    key() { const u = api.user(); return u ? keyOf(u.key) : GUEST; },
    count() { return Object.keys(db.users).length; },
    validName: n => NAME_RE.test(clean(n)),
    /* keep = move the guest's current progress into the new account (the guest starts fresh afterwards) */
    async create(name, pw, keep) {
      name = clean(name); const k = norm(name);
      if (!NAME_RE.test(name)) return 'name'; if (String(pw).length < 4 || String(pw).length > 64) return 'pw'; if (db.users[k]) return 'taken';
      const salt = toHex(rand(16)); db.users[k] = { name, salt, iter: ITER, hash: await hashPw(pw, salt, ITER), created: Date.now() };
      const first = keep ? G : Object.assign(defState(), { lang: G.lang, sound: G.sound });
      try { localStorage.setItem(keyOf(k), JSON.stringify(first)); if (keep && !api.user()) localStorage.removeItem(GUEST); } catch (e) { }
      if (!keep) save(); db.cur = k; persist(); api.reload(); return 'ok';
    },
    hasProgress() { return Object.keys(G.chars || {}).some(id => { const c = G.chars[id]; return c.xp > 0 || c.lv > 1 || (c.cnt && c.cnt.act); }); },
    async login(name, pw) {
      const k = norm(name), u = db.users[k]; if (!u) return 'nouser';
      const h = await hashPw(pw, u.salt, u.iter); if (!same(h, u.hash)) return 'badpw';
      save(); db.cur = k; persist(); api.reload(); return 'ok';
    },
    logout() { save(); db.cur = null; persist(); api.reload(); },
    remove() { const u = api.user(); if (!u) return; try { localStorage.removeItem(keyOf(u.key)); } catch (e) { } delete db.users[u.key]; db.cur = null; persist(); api.reload(); },
    /* re-read the save of whoever is active now and redraw everything */
    reload() {
      closeGame(true); if (typeof close3D === 'function') close3D(true);
      load(); LANG = LANGS[G.lang] ? G.lang : 'he'; SND = G.sound !== false;
      UIS.screen = 'menu'; UIS.wid = null; UIS.mtab = 'chars'; UIS.over = null; UIS.busy = false; renderAll(); dailyBonus();
    },
    async importCode(code) { const o = await unpack(code); save(); G = Object.assign(defState(), o.g); save(); api.reload(); }
  };
  return api;
})();

/* ---------- UI ---------- */
const accEsc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let ACC_TAB = 'in';
function accSet(html) { const w = '<div class="accm">' + html + '</div>', m = document.querySelector('.mwrap .modal > .accm'); if (m) m.outerHTML = w; else modal(w); setTimeout(() => ['acc-name', 'acc-pw', 'acc-pw2'].forEach(id => { const i = document.getElementById(id); if (i) i.onkeydown = e => { if (e.key === 'Enter') accGo(); }; }), 30); }
function accChip() {
  const u = ACC.user();
  return `<button class="whoami ${u ? 'on' : ''}" data-a="acc">${u ? '👤 ' + ui('ac_hello', { n: accEsc(u.name) }) : '💾 ' + ui('ac_cta')}</button>`;
}
function accBar() { const b = document.getElementById('btn-acc'); if (b) { b.classList.toggle('on', !!ACC.user()); b.title = ui('ac_btn'); } }
function accOpen() {
  const u = ACC.user();
  if (!u) { ACC_TAB = ACC.count() ? 'in' : 'up'; return accSet(accForm()); }
  accSet(`<div class="mbig">👤</div><h2>${accEsc(u.name)}</h2><p class="mtext">${ui('ac_saved')}</p>
    <button class="btn" data-a="acc_export">📤 ${ui('ac_export')}</button><button class="btn" data-a="acc_import">📥 ${ui('ac_import')}</button>
    <button class="btn" data-a="acc_logout">🚪 ${ui('ac_logout')}</button><button class="btn" data-a="acc_delete">🗑️ ${ui('ac_delete')}</button>
    <p class="mtext small">${ui('ac_local')}</p><button class="btn pri" data-a="mclose">${ui('ok')}</button>`);
}
function accForm(err) {
  const up = ACC_TAB === 'up';
  return `<div class="mbig">👤</div><h2>${ui('ac_title')}</h2><p class="mtext">${up ? ui('ac_intro') : ui('ac_saved')}</p>
    <div class="acc-tabs"><button class="btn ${up ? '' : 'pri'}" data-a="acc_tab" data-v="in">${ui('ac_in')}</button><button class="btn ${up ? 'pri' : ''}" data-a="acc_tab" data-v="up">${ui('ac_up')}</button></div>
    <input id="acc-name" class="accin" type="text" maxlength="16" autocomplete="username" autocapitalize="off" spellcheck="false" placeholder="${ui('ac_name')}">
    <input id="acc-pw" class="accin" type="password" maxlength="64" autocomplete="${up ? 'new-password' : 'current-password'}" placeholder="${ui('ac_pw')}">
    ${up ? `<input id="acc-pw2" class="accin" type="password" maxlength="64" autocomplete="new-password" placeholder="${ui('ac_pw2')}">` : ''}
    ${up && ACC.hasProgress() ? `<label class="accchk"><input type="checkbox" id="acc-keep" checked> ${ui('ac_keep')}</label>` : ''}
    <div class="vipbad" id="acc-err">${err || ''}</div>
    <button class="btn pri" data-a="acc_go">${up ? ui('ac_up') : ui('ac_in')}</button>
    <div class="acc-tabs"><button class="btn" data-a="acc_export">📤 ${ui('ac_export')}</button><button class="btn" data-a="acc_import">📥 ${ui('ac_import')}</button></div><button class="btn ghost" data-a="mclose">${ui('ac_guest')}</button>
    <p class="mtext small">${ui('ac_local')}</p>`;
}
let ACC_BUSY = false;
async function accGo() {
  if (ACC_BUSY) return; const err = m => { const e = document.getElementById('acc-err'); if (e) e.textContent = ui(m); sfx('bad'); };
  const name = (document.getElementById('acc-name') || {}).value || '', pw = (document.getElementById('acc-pw') || {}).value || '', pw2 = document.getElementById('acc-pw2');
  ACC_BUSY = true;
  try {
    if (ACC_TAB === 'up') {
      if (!ACC.validName(name)) return err('ac_e_name'); if (pw.length < 4) return err('ac_e_pw'); if (pw2 && pw2.value !== pw) return err('ac_e_pw2');
      const kp = document.getElementById('acc-keep'), r = await ACC.create(name, pw, !!(kp && kp.checked)); if (r === 'taken') return err('ac_e_taken'); if (r !== 'ok') return err(r === 'pw' ? 'ac_e_pw' : 'ac_e_name');
      closeModal(); sfx('win'); confetti(); toast(ui('ac_welcome'), 'good');
    } else {
      const r = await ACC.login(name, pw); if (r === 'nouser') return err('ac_e_nouser'); if (r === 'badpw') return err('ac_e_badpw');
      closeModal(); sfx('win'); toast(ui('ac_hello', { n: accEsc(ACC.user().name) }), 'good');
    }
    accBar();
  } finally { ACC_BUSY = false; }
}
async function accExport() {
  const u = ACC.user(); save(); const code = await ACC.pack({ v: 1, n: u ? u.name : 'guest', t: Date.now(), g: G });
  accSet(`<div class="mbig">📤</div><h2>${ui('ac_export')}</h2><p class="mtext small">${ui('ac_code_hint')}</p>
    <textarea id="acc-code" class="acctx" readonly rows="5" onclick="this.select()">${code}</textarea>
    <button class="btn pri" data-a="acc_copy">📋 ${ui('ac_copy')}</button><button class="btn" data-a="acc_file">💾 ${ui('ac_file')}</button><button class="btn" data-a="acc_open">${ui('ac_back')}</button>`);
}
function accImport() {
  accSet(`<div class="mbig">📥</div><h2>${ui('ac_import')}</h2><p class="mtext small">${ui('ac_paste')}</p>
    <textarea id="acc-code" class="acctx" rows="5" spellcheck="false" placeholder="CT2:…"></textarea><div class="vipbad" id="acc-err"></div>
    <button class="btn pri" data-a="acc_load">${ui('ac_load')}</button><button class="btn" data-a="acc_open">${ui('ac_back')}</button>`);
}
async function accLoad() {
  const t = document.getElementById('acc-code'), e = document.getElementById('acc-err'); if (!t) return;
  try { await ACC.unpack(t.value); } catch (x) { if (e) e.textContent = ui('ac_badcode'); sfx('bad'); return; }
  accSet(`<div class="mbig">📥</div><h2>${ui('ac_importask')}</h2><textarea id="acc-code" class="acctx" rows="2" readonly style="display:none">${accEsc(t.value)}</textarea>
    <button class="btn pri" data-a="acc_loadyes">${ui('yes')}</button><button class="btn" data-a="acc_import">${ui('no')}</button>`);
}
Object.assign(ACT, {
  acc: () => accOpen(), acc_open: () => accOpen(), acc_tab: e => { ACC_TAB = e.dataset.v; accSet(accForm()); },
  acc_go: () => accGo(), acc_export: () => accExport(), acc_import: () => accImport(), acc_load: () => accLoad(),
  acc_loadyes: async () => { const t = document.getElementById('acc-code'); try { await ACC.importCode(t.value); closeModal(); sfx('win'); confetti(); toast(ui('ac_loaded'), 'good'); accBar(); } catch (x) { accImport(); const e = document.getElementById('acc-err'); if (e) e.textContent = ui('ac_badcode'); } },
  acc_copy: async e => { const t = document.getElementById('acc-code'); if (!t) return; try { await navigator.clipboard.writeText(t.value); } catch (x) { t.select(); try { document.execCommand('copy'); } catch (y) { } } e.textContent = ui('ac_copied'); },
  acc_file: () => { const t = document.getElementById('acc-code'); if (!t) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t.value], { type: 'text/plain' })); a.download = 'cuddle-town-progress.txt'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); },
  acc_logout: () => { closeModal(); ACC.logout(); accBar(); toast('👋', 'good'); },
  acc_delete: () => accSet(`<div class="mbig">⚠️</div><h2>${ui('ac_delask')}</h2><button class="btn" data-a="acc_delyes">${ui('yes')}</button><button class="btn pri" data-a="acc_open">${ui('no')}</button>`),
  acc_delyes: () => { closeModal(); ACC.remove(); accBar(); }
});
