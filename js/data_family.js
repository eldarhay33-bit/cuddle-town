'use strict';
/* ---------- Family Mode: Mom, Sister 18, Dad, Brother 14, Sister 8 ---------- */
const WS = T('סדנת בישול', 'Cooking workshop', 'ورشة طبخ', 'Кулинарный мастер-класс', 'Taller de cocina');
const wsName = (he, en, ar, ru, es) => T('סדנת בישול: ' + he, 'Cooking workshop: ' + en, 'ورشة طبخ: ' + ar, 'Кулинарный мастер-класс: ' + ru, 'Taller de cocina: ' + es);
const studyBin = (id, e, n, kind, lv, x) => A(id, e, n, 'quiz', { kind, n: 8 }, lv, { focus: 8 }, x || {});

/* ===== Mom ===== */
WORLDS.mom = {
  id: 'mom', e: '👩', col: '#ec4899', art: 'mom', kind: 'fam',
  n: T('אמא', 'Mom', 'ماما', 'Мама', 'Mamá'),
  desc: T('מטלות הבית (כביסה, ניקיון, ארגון) וסדנת בישול עשירה', 'Household chores (laundry, cleaning, organizing) and a rich cooking workshop', 'أعمال المنزل (غسيل، تنظيف، ترتيب) وورشة طبخ غنية', 'Домашние дела (стирка, уборка, порядок) и богатый кулинарный мастер-класс', 'Tareas del hogar (colada, limpieza, orden) y un rico taller de cocina'),
  stats: ['hunger', 'energy', 'mood'], care: ['feed', 'sleep'],
  scene: { bg: 'linear-gradient(180deg,#fff4d6 0%,#ffe7b0 55%,#e9c78f 56%,#d4a76a 100%)', deco: [['🪟', 14, 26, 56], ['🍳', 86, 30, 44], ['🧺', 12, 66, 40], ['🌿', 90, 62, 36], ['🥘', 50, 12, 32]] },
  acts: [
    A('laundry', '🧺', T('כביסה: מיון צבעים', 'Laundry: color sorting', 'الغسيل: فرز الألوان', 'Стирка: сортировка по цветам', 'Colada: separar colores'), 'sort', { bins: [{ e: '🤍', k: 'w', l: T('לבנים', 'Whites', 'أبيض', 'Белое', 'Blancos') }, { e: '🖤', k: 'd', l: T('כהים', 'Darks', 'داكن', 'Тёмное', 'Oscuros') }, { e: '🌈', k: 'c', l: T('צבעוניים', 'Colors', 'ملوّن', 'Цветное', 'Colores') }], items: [{ e: '🤍', k: 'w' }, { e: '⬜', k: 'w' }, { e: '🖤', k: 'd' }, { e: '⬛', k: 'd' }, { e: '❤️', k: 'c' }, { e: '💙', k: 'c' }, { e: '💛', k: 'c' }] }, 1),
    A('clean', '🧹', T('ניקיון הבית', 'House cleaning', 'تنظيف البيت', 'Уборка дома', 'Limpieza de la casa'), 'scrub', { base: '🪟', dirt: '#8d8d8d' }, 1),
    A('organize', '🗂️', T('ארגון הארון', 'Closet organizing', 'ترتيب الخزانة', 'Порядок в шкафу', 'Ordenar el armario'), 'memory', { cards: ['👕', '👖', '🧦', '🧥', '👗', '🧣'] }, 1),
    A('cook_pasta', '🍝', wsName('פסטה', 'Pasta', 'المعكرونة', 'паста', 'pasta'), 'cook', { steps: ['💧', '🍝', '🍅', '🧄', '🧀'], extra: ['🧦', '🍋'], pot: '🍝' }, 1),
    A('dishes', '🍽️', T('שטיפת כלים', 'Dishwashing', 'غسل الأطباق', 'Мытьё посуды', 'Fregar los platos'), 'scrub', { base: '🍽️', dirt: '#a67c52' }, 2),
    A('cook_soup', '🍲', wsName('מרק', 'Soup', 'الشوربة', 'суп', 'sopa'), 'cook', { steps: ['🥕', '🧅', '🥔', '🍗', '🧂'], extra: ['🧦', '🍫'], pot: '🍲' }, 2),
    A('shop', '🛒', T('קניות בשוק', 'Market shopping', 'التسوق من السوق', 'Покупки на рынке', 'Compras en el mercado'), 'catch', { good: ['🍎', '🥕', '🥛', '🍞'], bad: ['🪨'], me: '🛒' }, 2),
    A('cook_cake', '🎂', wsName('עוגה', 'Cake', 'الكعكة', 'торт', 'tarta'), 'cook', { steps: ['🥚', '🥛', '🧈', '🍫', '🍓'], extra: ['🧦', '🧅'], pot: '🎂' }, 3),
    A('cook_salad', '🥗', wsName('סלט', 'Salad', 'السلطة', 'салат', 'ensalada'), 'cook', { steps: ['🥬', '🍅', '🥒', '🧅', '🫒'], extra: ['🧦', '🍫'], pot: '🥗' }, 4),
    A('cook_pizza', '🍕', wsName('פיצה', 'Pizza', 'البيتزا', 'пицца', 'pizza'), 'cook', { steps: ['🍞', '🍅', '🧀', '🍄', '🌿'], extra: ['🧦', '🍫', '🍓'], pot: '🍕' }, 5),
    A('cook_feast', '🦃', wsName('ארוחת חג', 'Holiday feast', 'وليمة العيد', 'праздничный пир', 'banquete festivo'), 'cook', { steps: ['🦃', '🥔', '🥕', '🌽', '🧄', '🍷'], extra: ['🧦', '🍫', '🍓'], pot: '🍽️' }, 7, {}, { cost: 10 })
  ],
  foods: ['coffee', 'cookie', 'sandwich', 'soup', 'salad', 'cake'],
  items: ['flower', 'glasses', 'pearls', 'scarf', 'tee', 'plant', 'bouquet', 'picture', 'lamp'],
  story: [
    S(T('יום חדש, כביסה חדשה: מיינו את הצבעים.', 'New day, new laundry: sort the colors.', 'يوم جديد، غسيل جديد: افرز الألوان.', 'Новый день, новая стирка: рассортируй цвета.', 'Nuevo día, nueva colada: separa los colores.'), 'actid', 'laundry', 2, { c: 30, x: 25 }),
    S(T('סדנת הבישול הראשונה: פסטה לכל המשפחה!', 'The first cooking workshop: pasta for the whole family!', 'أول ورشة طبخ: معكرونة لكل العائلة!', 'Первый мастер-класс: паста для всей семьи!', 'El primer taller de cocina: ¡pasta para toda la familia!'), 'actid', 'cook_pasta', 2, { c: 40, x: 30 }),
    S(T('הבית צריך ניקיון מהיר לפני האורחים.', 'The house needs a quick clean before the guests.', 'البيت يحتاج تنظيفًا سريعًا قبل الضيوف.', 'Дому нужна быстрая уборка до гостей.', 'La casa necesita una limpieza rápida antes de los invitados.'), 'actid', 'clean', 2, { c: 45, x: 35 }),
    S(T('הגיעו לרמה 3 — המטבח נפתח לסדנאות חדשות.', 'Reach level 3 — the kitchen opens up new workshops.', 'صلْ إلى المستوى 3 — المطبخ يفتح ورشًا جديدة.', 'Достигни 3 уровня — кухня откроет новые мастер-классы.', 'Llega al nivel 3: la cocina abre nuevos talleres.'), 'lv', null, 3, { c: 60, x: 20 }),
    S(T('סדנת עוגה: יום הולדת בבית!', 'Cake workshop: a birthday at home!', 'ورشة الكعكة: عيد ميلاد في البيت!', 'Мастер-класс по торту: день рождения дома!', 'Taller de tarta: ¡cumpleaños en casa!'), 'actid', 'cook_cake', 2, { c: 70, x: 50 }),
    S(T('ארוחת החג הגדולה! הגיעו לרמה 7 והכינו את הכול.', 'The big holiday feast! Reach level 7 and cook it all.', 'وليمة العيد الكبرى! صلْ إلى المستوى 7 واطبخ كل شيء.', 'Большой праздничный пир! Достигни 7 уровня и приготовь всё.', '¡El gran banquete! Llega al nivel 7 y cocínalo todo.'), 'actid', 'cook_feast', 1, { c: 160, x: 110, i: 'bouquet' })
  ],
  quotes: [
    T('מי רוצה עוד קצת פסטה?', 'Who wants some more pasta?', 'من يريد المزيد من المعكرونة؟', 'Кто хочет ещё пасты?', '¿Quién quiere más pasta?'),
    T('הכול במקום, הכול נקי!', 'Everything in its place, everything clean!', 'كل شيء في مكانه، وكل شيء نظيف!', 'Всё на своих местах, всё чисто!', '¡Todo en su sitio y todo limpio!'),
    T('הריח מהמטבח הכי טוב בעולם.', 'The kitchen smells like the best place on Earth.', 'رائحة المطبخ أجمل رائحة في العالم.', 'Запах с кухни — лучший на свете.', 'La cocina huele de maravilla.'),
    T('בית נקי — לב שמח.', 'A clean home, a happy heart.', 'بيت نظيف، قلب سعيد.', 'Чистый дом — радостное сердце.', 'Casa limpia, corazón contento.')
  ],
  sleep: T('כוס תה וחמש דקות של שקט... ☕', 'A cup of tea and five quiet minutes... ☕', 'كوب شاي وخمس دقائق من الهدوء... ☕', 'Чашка чая и пять тихих минут... ☕', 'Una taza de té y cinco minutos de calma... ☕')
};

/* ===== Sister, 18, in the army ===== */
WORLDS.sis18 = {
  id: 'sis18', e: '🪖', col: '#55683f', art: 'sis18', kind: 'fam',
  n: T('אחות (18)', 'Big sister (18)', 'الأخت الكبرى (18)', 'Старшая сестра (18)', 'Hermana mayor (18)'),
  desc: T('בצבא — אימונים קשים במתחם הכושר, צחצוח נעליים וארגון ציוד', 'In the army — tough fitness-camp training, boot polishing and gear organizing', 'في الجيش — تدريبات صعبة وتلميع الأحذية وترتيب العتاد', 'В армии — тяжёлые тренировки, чистка ботинок и порядок в снаряжении', 'En el ejército: entrenamientos duros, limpiar botas y ordenar el equipo'),
  stats: ['hunger', 'energy', 'fit', 'mood'], care: ['feed', 'sleep'],
  scene: { bg: 'linear-gradient(180deg,#d7e8c5 0%,#bcd5a1 55%,#8f7a55 56%,#6f5d3f 100%)', deco: [['⛺', 14, 36, 62], ['🚩', 88, 30, 40], ['🏋️', 86, 62, 44], ['🎖️', 52, 12, 32], ['🥾', 12, 72, 28]] },
  acts: [
    A('bootcamp', '🏃', T('אימון קשה: מסלול משוכות', 'Hard training: obstacle course', 'تدريب شاق: مسار عوائق', 'Тяжёлая тренировка: полоса препятствий', 'Entrenamiento duro: pista de obstáculos'), 'runner', { me: '🏃‍♀️', good: ['⭐', '💧'], bad: ['🪵', '🧱'], time: 28, road: 'rgba(120,100,70,.4)' }, 1, { fit: 6 }, { cost: 9 }),
    A('shoes', '🥾', T('צחצוח נעליים', 'Boot polishing', 'تلميع الأحذية', 'Чистка ботинок', 'Limpiar las botas'), 'scrub', { base: '🥾', dirt: '#5d4037' }, 1),
    A('gear', '🎒', T('ארגון ציוד', 'Gear organizing', 'ترتيب العتاد', 'Порядок в снаряжении', 'Ordenar el equipo'), 'sort', { bins: [{ e: '🎒', k: 'b', l: T('תיק', 'Pack', 'حقيبة', 'Рюкзак', 'Mochila') }, { e: '📦', k: 'c', l: T('ארגז', 'Crate', 'صندوق', 'Ящик', 'Caja') }], items: [{ e: '🧭', k: 'b' }, { e: '🔦', k: 'b' }, { e: '🍫', k: 'b' }, { e: '⛺', k: 'c' }, { e: '🪖', k: 'c' }, { e: '🥾', k: 'c' }] }, 1),
    A('pushup', '💪', T('שכיבות סמיכה', 'Push-ups', 'تمارين الضغط', 'Отжимания', 'Flexiones'), 'tap', { icon: '💪', secs: 8 }, 1, { fit: 6 }, { cost: 9 }),
    A('march', '🥁', T('מסדר וצעידה', 'Drill & march', 'طابور ومسير', 'Построение и марш', 'Formación y marcha'), 'simon', { pads: ['⬅️', '⬆️', '➡️', '⬇️'], rounds: 6 }, 2),
    A('ropeclimb', '🧗', T('טיפוס חבל', 'Rope climbing', 'تسلّق الحبل', 'Подъём по канату', 'Trepar la cuerda'), 'tug', { foe: '⬇️', icon: '🧗', secs: 12 }, 3, { fit: 6 }),
    A('nav', '🧭', T('תרגיל ניווט', 'Navigation drill', 'تمرين الملاحة', 'Тренировка навигации', 'Ejercicio de navegación'), 'aim', { target: '📍', ball: '🧭', bgstyle: 'background:linear-gradient(#cfe8b5,#9bbd7a)' }, 3),
    A('marathon', '🏅', T('ריצת סיבולת', 'Endurance run', 'جري التحمّل', 'Забег на выносливость', 'Carrera de resistencia'), 'runner', { me: '🏃‍♀️', good: ['⭐', '💧', '🍌'], bad: ['🪵', '🪨'], time: 32, road: 'rgba(120,100,70,.4)' }, 4, { fit: 8 }, { cost: 10 }),
    A('mess', '🍲', T('מטבח הבסיס', 'Base kitchen duty', 'مطبخ القاعدة', 'Дежурство на кухне', 'Cocina de la base'), 'cook', { steps: ['🥔', '🥕', '🧅', '🍖', '🍲'], extra: ['🧦', '🍫'], pot: '🍲' }, 4),
    A('firstaid', '🩹', T('עזרה ראשונה', 'First-aid drill', 'تمرين الإسعافات الأولية', 'Тренировка первой помощи', 'Primeros auxilios'), 'sort', { bins: [{ e: '🩹', k: 'a', l: T('ערכה', 'Kit', 'حقيبة', 'Аптечка', 'Botiquín') }, { e: '🗑️', k: 'x', l: T('לא שייך', 'Not for kit', 'ليست للحقيبة', 'Не для аптечки', 'No va') }], items: [{ e: '🩹', k: 'a' }, { e: '💊', k: 'a' }, { e: '🧴', k: 'a' }, { e: '🌡️', k: 'a' }, { e: '🍕', k: 'x' }, { e: '🧦', k: 'x' }] }, 5)
  ],
  foods: ['chocolate', 'banana', 'water', 'sandwich', 'rice', 'pasta', 'apple'],
  items: ['armyhelm', 'shades', 'medal', 'backpack', 'flag', 'tent', 'tee', 'vest'],
  story: [
    S(T('הבוקר מתחיל בשכיבות סמיכה. אפס בלגן!', 'The morning starts with push-ups. No messing around!', 'الصباح يبدأ بتمارين الضغط. بلا مزاح!', 'Утро начинается с отжиманий. Без шуток!', 'La mañana empieza con flexiones. ¡Sin tonterías!'), 'actid', 'pushup', 2, { c: 30, x: 25 }),
    S(T('נעליים מצוחצחות — מסדר בעוד שעה.', 'Polished boots — inspection in an hour.', 'أحذية ملمّعة — التفتيش بعد ساعة.', 'Начищенные ботинки — проверка через час.', 'Botas relucientes: inspección en una hora.'), 'actid', 'shoes', 2, { c: 35, x: 30 }),
    S(T('ארגון ציוד לפני היציאה לשטח.', 'Organize the gear before heading out.', 'رتّب العتاد قبل الخروج للميدان.', 'Разложи снаряжение перед выходом.', 'Ordena el equipo antes de salir.'), 'actid', 'gear', 2, { c: 40, x: 30 }),
    S(T('מסלול משוכות קשוח — שתי ריצות.', 'A tough obstacle course — two runs.', 'مسار عوائق صعب — جريتان.', 'Тяжёлая полоса препятствий — два забега.', 'Una pista de obstáculos dura: dos carreras.'), 'actid', 'bootcamp', 2, { c: 50, x: 40 }),
    S(T('הגיעו לרמה 4 — סיבולת מתחילה.', 'Reach level 4 — endurance starts.', 'صلْ إلى المستوى 4 — يبدأ التحمّل.', 'Достигни 4 уровня — начинается выносливость.', 'Llega al nivel 4: empieza la resistencia.'), 'lv', null, 4, { c: 70, x: 25 }),
    S(T('ריצת סיבולת סוף חודש — תנו את הכול!', 'The end-of-month endurance run — give it everything!', 'جري التحمّل نهاية الشهر — أعطِ كل ما لديك!', 'Забег на выносливость в конце месяца — выложись!', 'La carrera de resistencia de fin de mes: ¡a darlo todo!'), 'actid', 'marathon', 1, { c: 140, x: 100, i: 'medal' })
  ],
  quotes: [
    T('בסדר, בסדר, עוד סיבוב אחד!', 'Okay, okay, one more lap!', 'حسنًا، حسنًا، لفة أخرى!', 'Ладно, ладно, ещё один круг!', '¡Vale, vale, una vuelta más!'),
    T('הנעליים הכי מבריקות בבסיס.', 'The shiniest boots on the base.', 'أكثر الأحذية لمعانًا في القاعدة.', 'Самые блестящие ботинки на базе.', 'Las botas más brillantes de la base.'),
    T('כל יום קצת יותר חזקה.', 'A little stronger every day.', 'أقوى قليلًا كل يوم.', 'С каждым днём чуть сильнее.', 'Un poco más fuerte cada día.')
  ],
  sleep: T('חמש דקות על הדרגש בקסרקטין... 😴', 'Five minutes in the barracks bunk... 😴', 'خمس دقائق في سرير الثكنة... 😴', 'Пять минут на койке в казарме... 😴', 'Cinco minutos en la litera... 😴')
};

/* ===== Dad, builder & apartment seller ===== */
WORLDS.dad = {
  id: 'dad', e: '👷', col: '#f59e0b', art: 'dad', kind: 'fam',
  n: T('אבא', 'Dad', 'بابا', 'Папа', 'Papá'),
  desc: T('בונה בניינים, מנהל אתר בנייה ומנופים, ומוכר דירות לקונים', 'Builds buildings, runs the construction site & cranes, and sells apartments to buyers', 'يبني العمارات ويدير موقع البناء والرافعات ويبيع الشقق للمشترين', 'Строит дома, руководит стройкой и кранами и продаёт квартиры', 'Construye edificios, dirige la obra y las grúas, y vende pisos'),
  stats: ['hunger', 'energy', 'mood'], care: ['feed', 'sleep'],
  scene: { bg: 'linear-gradient(180deg,#bfe6ff 0%,#e9f6ff 50%,#c9b48a 51%,#a68a5c 100%)', deco: [['🏗️', 16, 28, 76], ['🏢', 88, 30, 62], ['🚧', 84, 66, 38], ['🚜', 14, 70, 40], ['☁️', 52, 10, 34]] },
  acts: [
    A('tower', '🏢', T('בניית מגדל (מנוף)', 'Tower building (crane)', 'بناء برج (رافعة)', 'Строим башню (кран)', 'Construir una torre (grúa)'), 'stack', { top: '🏗️', floors: 10 }, 1),
    A('crane', '🏗️', T('מפעיל מנוף', 'Crane operator', 'مشغّل الرافعة', 'Крановщик', 'Gruista'), 'aim', { target: '🧱', ball: '📦', bgstyle: 'background:linear-gradient(#bde4ff,#e0c79a)' }, 1),
    A('bricks', '🧱', T('הובלת לבנים', 'Brick hauling', 'نقل الطوب', 'Перевозка кирпичей', 'Acarrear ladrillos'), 'catch', { good: ['🧱', '🧱', '🪵'], bad: ['💣', '🪨'], me: '🚜' }, 1),
    A('hammer', '🔨', T('פטישים וקירות', 'Hammer time', 'وقت المطرقة', 'Время молотка', 'Hora del martillo'), 'tap', { icon: '🔨', secs: 8 }, 2),
    A('sitemgr', '📋', T('ניהול אתר הבנייה', 'Site management', 'إدارة موقع البناء', 'Управление стройкой', 'Gestión de la obra'), 'sort', { bins: [{ e: '👷', k: 'w', l: T('פועלים', 'Workers', 'عمّال', 'Рабочие', 'Obreros') }, { e: '🚚', k: 't', l: T('משאיות', 'Trucks', 'شاحنات', 'Грузовики', 'Camiones') }, { e: '📦', k: 'm', l: T('חומרים', 'Materials', 'مواد', 'Материалы', 'Materiales') }], items: [{ e: '👷', k: 'w' }, { e: '👷‍♀️', k: 'w' }, { e: '🚚', k: 't' }, { e: '🚜', k: 't' }, { e: '🧱', k: 'm' }, { e: '🪵', k: 'm' }, { e: '📦', k: 'm' }] }, 2),
    A('sell', '🏠', T('מכירת דירות (חשבון)', 'Selling apartments (math)', 'بيع الشقق (حساب)', 'Продажа квартир (счёт)', 'Vender pisos (mates)'), 'quiz', { kind: 'math', n: 8 }, 2, { focus: 6 }),
    A('showflat', '🔑', T('סיור בדירה לדוגמה', 'Show-flat tour', 'جولة في الشقة النموذجية', 'Тур по образцовой квартире', 'Visita al piso piloto'), 'memory', { cards: ['🔑', '🏠', '🛋️', '🪴', '🖼️', '🚪'] }, 3),
    A('blueprint', '📐', T('שרטוט תוכניות', 'Blueprints', 'رسم المخططات', 'Чертежи', 'Planos'), 'simon', { pads: ['📐', '📏', '✏️', '🧮'], rounds: 6 }, 3),
    A('concrete', '🛢️', T('ערבול בטון', 'Concrete mixing', 'خلط الخرسانة', 'Замес бетона', 'Mezclar hormigón'), 'cook', { steps: ['🪨', '💧', '🏖️', '🌀'], extra: ['🧦', '🍫'], pot: '🛢️' }, 4),
    A('inspect', '🦺', T('בדיקות בטיחות', 'Safety inspection', 'فحص السلامة', 'Проверка безопасности', 'Inspección de seguridad'), 'whack', { good: ['⚠️'], bad: ['✅'] }, 5),
    A('deal', '🤝', T('חתימת עסקה', 'Closing the deal', 'إتمام الصفقة', 'Заключение сделки', 'Cerrar el trato'), 'timing', { icon: '🤝', rounds: 6 }, 5)
  ],
  foods: ['coffee', 'sandwich', 'steak', 'soup', 'burger', 'water'],
  items: ['helmet', 'glasses', 'vest', 'tie', 'cap', 'crane', 'tent', 'trophy'],
  story: [
    S(T('הבוקר מתחיל במגדל חדש. בנו שתי קומות לפחות!', 'The morning starts with a new tower. Build it up!', 'الصباح يبدأ ببرج جديد. ابنِه!', 'Утро начинается с новой башни. Строй!', 'La mañana empieza con una torre nueva. ¡A construir!'), 'actid', 'tower', 2, { c: 30, x: 25 }),
    S(T('המנוף צריך להניח את הקורות במקום המדויק.', 'The crane has to place the beams in the exact spot.', 'على الرافعة وضع العوارض في المكان الدقيق.', 'Кран должен поставить балки точно на место.', 'La grúa debe colocar las vigas en el punto exacto.'), 'actid', 'crane', 2, { c: 35, x: 30 }),
    S(T('לבנים מגיעות! תפסו אותן לפני שהן נופלות.', 'Bricks are arriving! Catch them before they drop.', 'الطوب يصل! التقطه قبل أن يسقط.', 'Кирпичи едут! Лови их, пока не упали.', '¡Llegan ladrillos! Atrápalos antes de que caigan.'), 'actid', 'bricks', 2, { c: 40, x: 30 }),
    S(T('הגיעו לרמה 3 — אתר הבנייה גדל.', 'Reach level 3 — the site is growing.', 'صلْ إلى المستوى 3 — موقع البناء يكبر.', 'Достигни 3 уровня — стройка растёт.', 'Llega al nivel 3: la obra crece.'), 'lv', null, 3, { c: 60, x: 20 }),
    S(T('קונים מגיעים! מכרו דירות בחשבון מדויק.', 'Buyers are here! Sell apartments with exact math.', 'المشترون هنا! بع الشقق بحساب دقيق.', 'Пришли покупатели! Продавай квартиры точно.', '¡Llegan compradores! Vende pisos con cuentas exactas.'), 'actid', 'sell', 2, { c: 55, x: 45 }),
    S(T('סיור בדירה לדוגמה — זכרו איפה כל חדר.', 'A show-flat tour — remember where each room is.', 'جولة في الشقة النموذجية — تذكّر مكان كل غرفة.', 'Тур по образцовой квартире — запомни комнаты.', 'Visita al piso piloto: recuerda dónde está cada sala.'), 'actid', 'showflat', 2, { c: 60, x: 45 }),
    S(T('העסקה הגדולה! הגיעו לרמה 5 וחתמו.', 'The big deal! Reach level 5 and sign it.', 'الصفقة الكبرى! صلْ إلى المستوى 5 ووقّعها.', 'Большая сделка! Достигни 5 уровня и подпиши.', '¡El gran trato! Llega al nivel 5 y fírmalo.'), 'actid', 'deal', 1, { c: 150, x: 100, i: 'crane' })
  ],
  quotes: [
    T('עוד קומה, עוד קומה!', 'One more floor, one more floor!', 'طابق آخر، طابق آخر!', 'Ещё этаж, ещё этаж!', '¡Un piso más, un piso más!'),
    T('הבטיחות מעל לכול.', 'Safety first, always.', 'السلامة أولًا دائمًا.', 'Безопасность прежде всего.', 'La seguridad, lo primero.'),
    T('לדירה הזו יש נוף מדהים!', 'This apartment has an amazing view!', 'هذه الشقة لها إطلالة رائعة!', 'У этой квартиры потрясающий вид!', '¡Este piso tiene unas vistas increíbles!')
  ],
  sleep: T('כוס קפה, כיסא נוח ושקט... 😴', 'A coffee, a comfy chair and some quiet... 😴', 'قهوة وكرسي مريح وهدوء... 😴', 'Кофе, удобное кресло и тишина... 😴', 'Un café, un sillón cómodo y silencio... 😴')
};

/* ===== Brother, 14: tennis, gym, school ===== */
WORLDS.bro14 = {
  id: 'bro14', e: '🎾', col: '#16a34a', art: 'bro14', kind: 'fam',
  n: T('אח (14)', 'Brother (14)', 'الأخ (14)', 'Брат (14)', 'Hermano (14)'),
  desc: T('שחקן טניס בטורנירים — מתאמן גם בחדר כושר לכוח וסיבולת, ויושב על ספסל הלימודים', 'A tournament tennis player — also trains in the gym for power and endurance, and hits the books', 'لاعب تنس في البطولات — يتدرّب أيضًا في النادي لبناء القوة والتحمّل ويدرس', 'Теннисист-турнирщик — тренируется и в зале ради силы и выносливости, и учится', 'Tenista de torneos: también entrena en el gimnasio fuerza y resistencia, y estudia'),
  stats: ['hunger', 'energy', 'fit', 'focus'], care: ['feed', 'sleep'],
  scene: { bg: 'linear-gradient(180deg,#cfeeff 0%,#e9f8ff 48%,#3f9d5a 49%,#2f7d46 100%)', deco: [['🏟️', 14, 28, 62], ['🏋️', 88, 36, 48], ['📚', 86, 68, 36], ['🎾', 14, 70, 26], ['⏱️', 52, 10, 30]] },
  acts: [
    A('serve', '🎾', T('הגשות בטניס', 'Tennis serves', 'إرسال التنس', 'Подачи в теннисе', 'Saques de tenis'), 'aim', { target: '🎯', ball: '🎾', bgstyle: 'background:linear-gradient(#bfe9c9,#4aa564)' }, 1, { fit: 3 }),
    A('rally', '🏸', T('חילופי כדורים', 'Rally', 'تبادل الكرات', 'Розыгрыш', 'Peloteo'), 'timing', { icon: '🎾', rounds: 6 }, 1, { fit: 3 }),
    A('ballpick', '🧺', T('איסוף כדורים', 'Ball collecting', 'جمع الكرات', 'Сбор мячей', 'Recoger pelotas'), 'catch', { good: ['🎾'], bad: ['🪨'], me: '🧺' }, 1),
    A('weights', '🏋️', T('חדר כושר: משקולות', 'Gym: weights', 'النادي: الأثقال', 'Зал: штанга', 'Gimnasio: pesas'), 'tap', { icon: '🏋️', secs: 9, goal: 38 }, 1, { fit: 7 }, { cost: 9 }),
    A('treadmill', '🏃', T('חדר כושר: הליכון', 'Gym: treadmill', 'النادي: جهاز المشي', 'Зал: беговая дорожка', 'Gimnasio: cinta'), 'runner', { me: '🏃', good: ['⭐', '💧'], bad: ['🧱'], time: 26, road: 'rgba(80,80,90,.45)' }, 1, { fit: 6 }, { cost: 9 }),
    A('study', '📚', T('ספסל לימודים: מתמטיקה', 'Study bench: math', 'مقعد الدراسة: رياضيات', 'Учёба: математика', 'Estudio: mates'), 'quiz', { kind: 'math', n: 8 }, 1, { focus: 9 }),
    A('strength', '💪', T('כוח וחיזוק לטניס', 'Tennis strength drills', 'قوة وتقوية للتنس', 'Силовые упражнения для тенниса', 'Fuerza para el tenis'), 'simon', { pads: ['🦵', '💪', '🤸', '🧘'], rounds: 5 }, 2, { fit: 6 }),
    A('study2', '🧪', T('ספסל לימודים: חשיבה', 'Study bench: logic', 'مقعد الدراسة: منطق', 'Учёба: логика', 'Estudio: lógica'), 'quiz', { kind: 'seq', n: 8 }, 2, { focus: 9 }),
    A('stretch', '🧘', T('מתיחות והתאוששות', 'Stretch & recovery', 'إطالة واستشفاء', 'Растяжка и восстановление', 'Estirar y recuperar'), 'timing', { icon: '🧘', rounds: 5 }, 2),
    A('tournament', '🏆', T('טורניר', 'Tournament', 'بطولة', 'Турнир', 'Torneo'), 'tug', { foe: '🤾', icon: '🎾', secs: 14 }, 3, { fit: 5 }, { cost: 10 }),
    A('agility', '🪜', T('סולם זריזות', 'Agility ladder', 'سلّم الرشاقة', 'Лестница ловкости', 'Escalera de agilidad'), 'runner', { me: '🏃', good: ['⚡', '⭐'], bad: ['🧱'], time: 26, road: 'rgba(80,120,200,.35)' }, 3, { fit: 5 })
  ],
  foods: ['banana', 'eggs', 'pasta', 'rice', 'sports', 'sandwich', 'apple'],
  items: ['tennisball', 'shades', 'medal', 'trophy', 'cap', 'headphones', 'backpack', 'glasses'],
  story: [
    S(T('פותחים בהגשות — בלי כוח אין פגיעה.', 'We open with serves — no power, no aces.', 'نبدأ بالإرسال — بلا قوة لا ضربات ساحقة.', 'Начинаем с подач — без силы нет эйсов.', 'Empezamos con saques: sin fuerza no hay aces.'), 'actid', 'serve', 2, { c: 30, x: 25 }),
    S(T('חדר הכושר: משקולות לבניית כוח.', 'The gym: weights to build power.', 'النادي: أثقال لبناء القوة.', 'Зал: штанга для силы.', 'El gimnasio: pesas para ganar fuerza.'), 'actid', 'weights', 2, { c: 40, x: 30 }),
    S(T('שיעורי בית! ספסל לימודים — מתמטיקה.', 'Homework time! Study bench — math.', 'وقت الواجبات! مقعد الدراسة — رياضيات.', 'Домашка! Учёба — математика.', '¡Deberes! Estudio de mates.'), 'actid', 'study', 2, { c: 40, x: 30 }),
    S(T('הגיעו לרמה 4 — הטורניר הראשון קרוב.', 'Reach level 4 — the first tournament is near.', 'صلْ إلى المستوى 4 — البطولة الأولى قريبة.', 'Достигни 4 уровня — первый турнир близко.', 'Llega al nivel 4: el primer torneo se acerca.'), 'lv', null, 4, { c: 70, x: 25 }),
    S(T('הליכון וסולם זריזות — סיבולת לטורניר.', 'Treadmill and agility ladder — endurance for the tournament.', 'جهاز المشي وسلّم الرشاقة — تحمّل للبطولة.', 'Дорожка и лестница ловкости — выносливость для турнира.', 'Cinta y escalera de agilidad: resistencia para el torneo.'), 'actid', 'treadmill', 2, { c: 55, x: 45 }),
    S(T('הטורניר! נצחו במשיכת החבל מול היריב.', 'The tournament! Win the tug against your rival.', 'البطولة! اربح الشدّ أمام منافسك.', 'Турнир! Победи соперника в перетягивании.', '¡El torneo! Gana el pulso a tu rival.'), 'actid', 'tournament', 2, { c: 140, x: 100, i: 'trophy' })
  ],
  quotes: [
    T('אייס! זה היה אייס?', 'Ace! Was that an ace?', 'ضربة ساحقة! هل كانت كذلك؟', 'Эйс! Это был эйс?', '¡Ace! ¿Eso fue un ace?'),
    T('עוד סט אחד ואני גמור.', 'One more set and I am done.', 'مجموعة أخرى وأنتهي.', 'Ещё один сет — и я готов.', 'Un set más y termino.'),
    T('כוח זה לא רק משקולות — זה גם ראש.', 'Power is not only weights — it is also brains.', 'القوة ليست أثقالًا فقط، بل عقل أيضًا.', 'Сила — это не только штанга, но и голова.', 'La fuerza no son solo pesas: también es cabeza.')
  ],
  sleep: T('מקלחת, מתיחות, ושינה עמוקה... 😴', 'Shower, stretching and deep sleep... 😴', 'دش وإطالة ونوم عميق... 😴', 'Душ, растяжка и крепкий сон... 😴', 'Ducha, estiramientos y sueño profundo... 😴')
};

/* ===== Sister, 8: basketball & school ===== */
WORLDS.sis8 = {
  id: 'sis8', e: '🏀', col: '#f97316', art: 'sis8', kind: 'fam',
  n: T('אחות (8)', 'Little sister (8)', 'الأخت الصغرى (8)', 'Младшая сестра (8)', 'Hermana pequeña (8)'),
  desc: T('שחקנית כדורסל וספסל הלימודים', 'A basketball player and a star student', 'لاعبة كرة سلة وطالبة مجتهدة', 'Баскетболистка и ученица', 'Jugadora de baloncesto y estudiante'),
  stats: ['hunger', 'energy', 'fun', 'focus'], care: ['feed', 'sleep'],
  scene: { bg: 'linear-gradient(180deg,#ffe8c4 0%,#fff3de 50%,#e9a863 51%,#d58f45 100%)', deco: [['🏀', 14, 30, 44], ['🏫', 88, 30, 58], ['📚', 86, 66, 36], ['🎒', 14, 70, 34], ['⭐', 52, 10, 28]] },
  acts: [
    A('hoops', '🏀', T('קליעה לסל', 'Free throws', 'رميات حرة', 'Штрафные броски', 'Tiros libres'), 'aim', { target: '⭕', ball: '🏀', bgstyle: 'background:linear-gradient(#ffd8a8,#f0a45a)' }, 1),
    A('study_a', '📖', T('ספסל לימודים: חשבון', 'Study bench: arithmetic', 'مقعد الدراسة: حساب', 'Учёба: арифметика', 'Estudio: cálculo'), 'quiz', { kind: 'math', n: 7 }, 1, { focus: 9 }),
    A('study_b', '🔢', T('ספסל לימודים: ספירה', 'Study bench: counting', 'مقعد الدراسة: العدّ', 'Учёба: счёт', 'Estudio: contar'), 'quiz', { kind: 'count', n: 7 }, 1, { focus: 9 }),
    A('jumprope', '🪢', T('קפיצה בחבל', 'Jump rope', 'نط الحبل', 'Скакалка', 'Saltar a la comba'), 'timing', { icon: '🪢', rounds: 5 }, 1),
    A('dribble', '⛹️', T('כדרור', 'Dribbling', 'المراوغة', 'Ведение мяча', 'Regate'), 'simon', { pads: ['⬅️', '⬆️', '➡️', '⬇️'], rounds: 4 }, 1),
    A('game', '🏆', T('משחק קבוצתי', 'Team game', 'مباراة جماعية', 'Командная игра', 'Partido de equipo'), 'runner', { me: '⛹️‍♀️', good: ['🏀', '⭐'], bad: ['🧱'], time: 26, road: 'rgba(200,140,60,.4)' }, 2),
    A('study_c', '🧩', T('ספסל לימודים: תבניות', 'Study bench: patterns', 'مقعد الدراسة: الأنماط', 'Учёба: закономерности', 'Estudio: patrones'), 'quiz', { kind: 'seq', n: 7 }, 2, { focus: 9 }),
    A('art', '🎨', T('שיעור ציור', 'Art class', 'حصة الرسم', 'Урок рисования', 'Clase de dibujo'), 'memory', { cards: ['🎨', '🖍️', '✂️', '📎', '🖌️', '📏'] }, 2),
    A('lunch', '🥪', T('אריזת קופסת אוכל', 'Packing the lunch box', 'تعبئة علبة الغداء', 'Собираем ланч-бокс', 'Preparar la fiambrera'), 'sort', { bins: [{ e: '🥪', k: 'm', l: T('ארוחה', 'Meal', 'وجبة', 'Еда', 'Comida') }, { e: '🍎', k: 's', l: T('פרי', 'Fruit', 'فاكهة', 'Фрукт', 'Fruta') }, { e: '🧃', k: 'd', l: T('שתייה', 'Drink', 'شراب', 'Напиток', 'Bebida') }], items: [{ e: '🥪', k: 'm' }, { e: '🍝', k: 'm' }, { e: '🍎', k: 's' }, { e: '🍌', k: 's' }, { e: '🧃', k: 'd' }, { e: '🥛', k: 'd' }] }, 2),
    A('recess', '🛝', T('הפסקה: מרדפים', 'Recess games', 'ألعاب الاستراحة', 'Игры на перемене', 'Juegos del recreo'), 'whack', { good: ['😄'], bad: ['😴'] }, 3)
  ],
  foods: ['milk', 'sandwich', 'apple', 'juice', 'cookie', 'banana'],
  items: ['bow', 'shades', 'medal', 'backpack', 'hoop', 'flower', 'balloons', 'trophy'],
  story: [
    S(T('אימון כדורסל ראשון! תרגלי קליעה לסל.', 'First basketball practice! Practice free throws.', 'أول تدريب كرة سلة! تمرّني على الرميات الحرة.', 'Первая тренировка по баскетболу! Потренируй броски.', '¡Primer entrenamiento de baloncesto! Practica tiros libres.'), 'actid', 'hoops', 2, { c: 30, x: 25 }),
    S(T('שיעורי בית: חשבון בספסל הלימודים.', 'Homework: arithmetic at the study bench.', 'الواجبات: حساب على مقعد الدراسة.', 'Домашка: арифметика за партой.', 'Deberes: cálculo en el pupitre.'), 'actid', 'study_a', 2, { c: 35, x: 30 }),
    S(T('כדרור בין החרוטים — כמעט בלי טעויות.', 'Dribbling between the cones — almost no mistakes.', 'مراوغة بين الأقماع — بلا أخطاء تقريبًا.', 'Ведение между конусами — почти без ошибок.', 'Regate entre conos: casi sin fallos.'), 'actid', 'dribble', 2, { c: 40, x: 30 }),
    S(T('הגיעו לרמה 3 — הנבחרת מחכה.', 'Reach level 3 — the team is waiting.', 'صلْ إلى المستوى 3 — الفريق ينتظر.', 'Достигни 3 уровня — команда ждёт.', 'Llega al nivel 3: el equipo espera.'), 'lv', null, 3, { c: 60, x: 20 }),
    S(T('המשחק הגדול של הכיתה! שחקי עם הקבוצה.', 'The big class game! Play with your team.', 'مباراة الصف الكبيرة! العبي مع فريقك.', 'Большая игра класса! Играй с командой.', '¡El gran partido de la clase! Juega con tu equipo.'), 'actid', 'game', 2, { c: 130, x: 90, i: 'hoop' })
  ],
  quotes: [
    T('אני קולעת! ראיתם?', 'I scored! Did you see?', 'سجّلت! هل رأيتم؟', 'Я забила! Вы видели?', '¡He encestado! ¿Lo habéis visto?'),
    T('עוד תרגיל אחד ואחר כך משחק!', 'One more exercise, then a game!', 'تمرين آخر ثم لعبة!', 'Ещё одно упражнение, а потом игра!', '¡Un ejercicio más y luego a jugar!'),
    T('המורה אמרה שכתבתי יפה.', 'The teacher said my writing is lovely.', 'قالت المعلمة إن خطي جميل.', 'Учительница сказала, что я пишу красиво.', 'La profe dijo que escribo muy bien.')
  ],
  sleep: T('סיפור לפני השינה... לילה טוב 🌙', 'A bedtime story... good night 🌙', 'قصة قبل النوم... ليلة سعيدة 🌙', 'Сказка на ночь... спокойной ночи 🌙', 'Un cuento antes de dormir... buenas noches 🌙')
};
