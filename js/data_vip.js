'use strict';
/* ---------- VIP world: Hugsy & Joey (only exists after the VIP code) ---------- */
const HUGSY_ROOMS = {
  living: { bg: 'linear-gradient(180deg,#f9d9a8 0%,#f6c88a 58%,#b57a45 59%,#8d5a2e 100%)', deco: [['📺', 16, 30, 56], ['🖼️', 52, 10, 40], ['🛋️', 86, 42, 70], ['⚽', 10, 66, 28], ['🦆', 78, 74, 26], ['🐔', 90, 76, 26]] },
  kitchen: { bg: 'linear-gradient(180deg,#d6f1ff 0%,#bfe6fa 58%,#e8e2d0 59%,#cfc8b0 100%)', deco: [['🧊', 14, 34, 66], ['🍕', 84, 52, 44], ['🍳', 52, 14, 34], ['🥣', 12, 70, 28], ['🍞', 90, 24, 30]] },
  gym: { bg: 'linear-gradient(180deg,#e0e7ff 0%,#c7d2fe 58%,#6b7280 59%,#4b5563 100%)', deco: [['🏋️', 14, 40, 60], ['🚴', 86, 44, 54], ['⏱️', 52, 12, 34], ['💧', 88, 74, 26], ['📣', 10, 14, 28]] },
  studio: { bg: 'linear-gradient(180deg,#fff3c4 0%,#ffe08a 58%,#f59e0b 59%,#d97706 100%)', deco: [['📸', 14, 36, 56], ['💡', 86, 20, 44], ['🥣', 84, 56, 52], ['📦', 50, 12, 40], ['🎞️', 10, 70, 28]] },
  set: { bg: 'linear-gradient(180deg,#e0f2fe 0%,#bae6fd 58%,#94a3b8 59%,#64748b 100%)', deco: [['🏥', 50, 14, 52], ['🎬', 14, 38, 50], ['🩺', 88, 44, 40], ['💡', 86, 14, 34], ['🛏️', 84, 70, 44]] },
  bedroom: { bg: 'linear-gradient(180deg,#1e1b4b 0%,#312e81 58%,#4338ca 59%,#3730a3 100%)', deco: [['🌙', 84, 12, 48], ['⭐', 18, 14, 24], ['🛏️', 16, 60, 70], ['🧸', 88, 64, 34], ['💤', 50, 12, 30]] },
  monica: { bg: 'linear-gradient(180deg,#e9d5ff 0%,#d8b4fe 58%,#a78bfa 59%,#7c3aed 100%)', deco: [['🚪', 12, 36, 62], ['🍝', 86, 52, 40], ['🛋️', 14, 68, 44], ['🪟', 52, 14, 46], ['🦆', 80, 78, 24]] }
};
const HUGSY_COMP = {
  living: { prop: '📺' }, kitchen: { prop: '🍕', extra: 'apron' }, gym: { prop: '🏋️', shirt: '#e53935', hat: 'band' },
  studio: { prop: '📸', shirt: '#2f2f3a' }, set: { prop: '🎬', extra: 'coat' }, bedroom: { prop: '🌙', shirt: '#7fb3ff' }, monica: { prop: '🍝' }
};
const HUGSY_CAMEO = { kitchen: 'monica', studio: 'rachel', set: 'chandler', gym: 'ross', monica: 'phoebe' };

WORLDS.hugsy = {
  id: 'hugsy', e: '🐧', col: '#1d4ed8', art: 'hugsy', kind: 'pet', vip: true, outfit: true,
  n: T('האגזי', 'Hugsy', 'هاغزي', 'Хагзи', 'Hugsy'),
  desc: T("הפינגווין של ג'ואי — כוכב קופסת הדגנים והרופא של הדרמה", "Joey's penguin pal — cereal-box star and soap-opera doctor", 'صديق جوي البطريق — نجم علبة الحبوب وطبيب المسلسل', 'Пингвин Джои — звезда коробки хлопьев и доктор из сериала', 'El pingüino de Joey: estrella de la caja de cereales y doctor de la serie'),
  stats: ['hunger', 'fun', 'energy', 'clean', 'love', 'fame'], care: ['feed', 'wash', 'sleep', 'cuddle'],
  comp: { art: 'joey', cls: 'joey' }, rooms: HUGSY_ROOMS, compRoom: HUGSY_COMP, cameo: HUGSY_CAMEO, joey: true,
  cats: [
    { k: 'living', e: '🛋️', n: T('סלון', 'Living room', 'غرفة المعيشة', 'Гостиная', 'Salón') },
    { k: 'kitchen', e: '🍕', n: T('מטבח', 'Kitchen', 'المطبخ', 'Кухня', 'Cocina') },
    { k: 'gym', e: '🏋️', n: T('אימונים', 'Training', 'التدريب', 'Тренировки', 'Entrenamiento') },
    { k: 'studio', e: '📸', n: T('צילומי דגנים', 'Cereal shoot', 'تصوير الحبوب', 'Съёмка хлопьев', 'Sesión de cereales') },
    { k: 'set', e: '🎬', n: T('דרמה: דוקטור האגזי', 'Drama: Dr. Hugsy', 'الدراما: الدكتور هاغزي', 'Сериал: Доктор Хагзи', 'Serie: Dr. Hugsy') },
    { k: 'monica', e: '🟣', n: T('החברים', 'The gang', 'الشلّة', 'Компания друзей', 'La pandilla') }
  ],
  scene: HUGSY_ROOMS.living,
  acts: [
    /* living room */
    A('tv', '📺', T("ערב סרט עם ג'ואי", 'Movie night with Joey', 'سهرة فيلم مع جوي', 'Киновечер с Джои', 'Noche de cine con Joey'), 'memory', { cards: ['📺', '🍿', '🎬', '🛋️', '🍕', '🐧'] }, 1, {}, { room: 'living' }),
    A('foosball', '⚽', T('כדורגל שולחן', 'Foosball match', 'كرة الطاولة', 'Настольный футбол', 'Futbolín'), 'timing', { icon: '⚽', rounds: 5 }, 1, {}, { room: 'living' }),
    A('dance', '💃', T('מסיבת ריקודים', 'Dance party', 'حفلة رقص', 'Танцевальная вечеринка', 'Fiesta de baile'), 'simon', { pads: ['💃', '🕺', '🎵', '🪩'], rounds: 5 }, 2, {}, { room: 'living' }),
    A('hidepeng', '🙈', T('מחבואים בדירה', 'Hide & seek in the apartment', 'غميضة في الشقة', 'Прятки в квартире', 'Escondite en el piso'), 'whack', { good: ['🐧'], bad: ['🦆', '🐔'] }, 2, {}, { room: 'living' }),
    A('laundry', '🧺', T('כביסה: הבגדים של האגזי', "Laundry day: Hugsy's outfit", 'يوم الغسيل: ملابس هاغزي', 'Стирка: одежда Хагзи', 'Día de colada: la ropa de Hugsy'), 'wash', {}, 1, { clean: 4 }, { room: 'living', cost: 8 }),
    A('pillow', '🛋️', T('מבצר כריות', 'Cushion fortress', 'حصن الوسائد', 'Крепость из подушек', 'Fortaleza de cojines'), 'stack', { top: '🛋️', floors: 9 }, 3, {}, { room: 'living' }),
    /* kitchen */
    A('special', '🍕', 'The Joey Special 🍕🍕', 'tug', { foe: '🦆', icon: '🐧' }, 1, { hunger: 8 }, { room: 'kitchen' }),
    A('pour', '🥣', T('מזיגת Hugsy Flakes', 'Pouring Hugsy Flakes', 'سكب Hugsy Flakes', 'Насыпаем Hugsy Flakes', 'Sirviendo Hugsy Flakes'), 'timing', { icon: '🥣', rounds: 5 }, 2, {}, { room: 'kitchen' }),
    A('groceries', '🛒', T('פריקת קניות', 'Unpacking groceries', 'تفريغ المشتريات', 'Разбор покупок', 'Guardar la compra'), 'sort', { bins: [{ e: '🧊', k: 'f', l: T('מקרר', 'Fridge', 'ثلاجة', 'Холодильник', 'Nevera') }, { e: '🥫', k: 'p', l: T('ארון', 'Pantry', 'خزانة', 'Шкаф', 'Despensa') }], items: [{ e: '🥛', k: 'f' }, { e: '🧀', k: 'f' }, { e: '🥩', k: 'f' }, { e: '🍦', k: 'f' }, { e: '🥫', k: 'p' }, { e: '🍝', k: 'p' }, { e: '🥣', k: 'p' }, { e: '🍪', k: 'p' }] }, 2, {}, { room: 'kitchen' }),
    A('moistmaker', '🥪', 'The Moist Maker', 'cook', { steps: ['🦃', '🥔', '🍞', '🍲'], extra: ['🧦', '🍋'], pot: '🥪' }, 3, {}, { room: 'kitchen' }),
    /* training */
    A('waddle', '🐧', T('ריצת פינגווין', 'Penguin waddle run', 'ركض البطريق', 'Забег пингвина', 'Carrera de pingüino'), 'runner', { me: '🐧', good: ['🐟', '⭐'], bad: ['🧊'], road: 'rgba(255,255,255,.4)' }, 1, { fit: 5 }, { room: 'gym' }),
    A('pushups', '💪', T("שכיבות סמיכה עם ג'ואי", 'Push-ups with Joey', 'تمارين الضغط مع جوي', 'Отжимания с Джои', 'Flexiones con Joey'), 'tap', { icon: '💪', secs: 8 }, 2, { fit: 5 }, { room: 'gym', cost: 9 }),
    A('stretch', '🧘', T('מתיחות', 'Stretching', 'تمارين الإطالة', 'Растяжка', 'Estiramientos'), 'timing', { icon: '🧘', rounds: 6 }, 3, {}, { room: 'gym' }),
    A('weights', '🏋️', T('הרמת משקולות', 'Weight lifting', 'رفع الأثقال', 'Поднятие штанги', 'Levantamiento de pesas'), 'tap', { icon: '🏋️', secs: 9, goal: 40 }, 4, { fit: 6 }, { room: 'gym', cost: 10 }),
    /* cereal-box shoot */
    A('poses', '😎', T('פוזות לדגמנות', 'Modeling poses', 'وضعيات العرض', 'Позы для съёмки', 'Poses de modelo'), 'simon', { pads: ['😎', '🤩', '😘', '🥰'], rounds: 5 }, 2, { fame: 3 }, { room: 'studio' }),
    A('shutter', '📷', T('הצלם: הרגע המושלם', 'The photographer: perfect moment', 'المصوّر: اللحظة المثالية', 'Фотограф: идеальный момент', 'El fotógrafo: el momento perfecto'), 'timing', { icon: '📷', rounds: 6 }, 3, { fame: 3 }, { room: 'studio' }),
    A('style', '👗', T("סטיילינג עם רייצ'ל", 'Styling with Rachel', 'تنسيق الأزياء مع ريتشل', 'Стиль с Рэйчел', 'Estilismo con Rachel'), 'memory', { cards: ['🎩', '🕶️', '🧣', '🎀', '🧢', '👑'] }, 3, { fame: 2 }, { room: 'studio' }),
    A('flakes', '🌽', T('תפסו את הפתיתים', 'Catch the flakes', 'التقط الرقائق', 'Лови хлопья', 'Atrapa los copos'), 'catch', { good: ['🌽', '🥣', '⭐'], bad: ['🧦'], me: '📦' }, 4, { fame: 3 }, { room: 'studio' }),
    /* soap-opera set */
    A('lines', '🎭', T('חזרה על הטקסט', 'Line rehearsal', 'التدرّب على النص', 'Репетиция реплик', 'Ensayo de frases'), 'simon', { pads: ['😀', '😢', '😡', '😮'], rounds: 6 }, 3, { fame: 3 }, { room: 'set' }),
    A('operate', '🩺', T('חדר ניתוחים (דוקטור האגזי)', 'Operating room (Dr. Hugsy)', 'غرفة العمليات (الدكتور هاغزي)', 'Операционная (доктор Хагзи)', 'Quirófano (Dr. Hugsy)'), 'sort', { bins: [{ e: '🩺', k: 't', l: T('כלי רפואה', 'Tools', 'أدوات طبية', 'Инструменты', 'Instrumentos') }, { e: '🗑️', k: 'x', l: T('לא שייך', 'Not tools', 'ليست أدوات', 'Не инструменты', 'No son') }], items: [{ e: '💉', k: 't' }, { e: '🩹', k: 't' }, { e: '🔬', k: 't' }, { e: '🧪', k: 't' }, { e: '🍕', k: 'x' }, { e: '🧦', k: 'x' }, { e: '🎸', k: 'x' }] }, 4, { fame: 4 }, { room: 'set' }),
    A('mark', '🎬', T('לעמוד על הסימן', 'Hit your mark', 'الوقوف على العلامة', 'Встать на отметку', 'Pisar la marca'), 'aim', { target: '⭐', ball: '🎬', bgstyle: 'background:linear-gradient(#1e293b,#475569)' }, 5, { fame: 4 }, { room: 'set' }),
    A('cuecards', '📝', T('כרטיסי רמזים', 'Cue cards', 'بطاقات التلقين', 'Карточки-подсказки', 'Tarjetas de ayuda'), 'catch', { good: ['📝', '🎬'], bad: ['🍌'], me: '🐧' }, 5, { fame: 4 }, { room: 'set' }),
    A('audition', '🌟', T('האודישן הגדול', 'The big audition', 'الاختبار الكبير', 'Большое прослушивание', 'La gran audición'), 'timing', { icon: '🌟', rounds: 7 }, 7, { fame: 8 }, { room: 'set', cost: 10 }),
    /* the gang */
    A('duckchick', '🦆', T('האכלת הברווז והתרנגולת', 'Feeding the duck & chicken', 'إطعام البطة والدجاجة', 'Кормим утку и курицу', 'Dar de comer al pato y la gallina'), 'catch', { good: ['🌾', '🍞'], bad: ['🌶️'], me: '🧺' }, 1, {}, { room: 'monica' }),
    A('smelly', '🎸', T('"Smelly Cat" עם פיבי', '"Smelly Cat" with Phoebe', '"Smelly Cat" مع فيبي', '«Smelly Cat» с Фиби', '«Smelly Cat» con Phoebe'), 'simon', { pads: ['🎸', '🎤', '🥁', '🎹'], rounds: 5 }, 2, { fun: 6 }, { room: 'monica' }),
    A('jokes', '😂', T("בדיחות עם צ'נדלר", 'Jokes with Chandler', 'نكات مع تشاندلر', 'Шутки с Чендлером', 'Chistes con Chandler'), 'whack', { good: ['😂'], bad: ['😐'] }, 3, { fun: 6 }, { room: 'monica' }),
    A('pivot', '🛋️', T('PIVOT! עם רוס', 'PIVOT! with Ross', 'PIVOT! مع روس', 'PIVOT! с Россом', '¡PIVOT! con Ross'), 'timing', { icon: '🛋️', rounds: 5 }, 4, {}, { room: 'monica' }),
    A('monicacook', '👩‍🍳', T('המטבח של מוניקה', "Monica's kitchen", 'مطبخ مونيكا', 'Кухня Моники', 'La cocina de Monica'), 'cook', { steps: ['🍝', '🧀', '🍅', '🧄', '🌿'], extra: ['🧦', '🍋', '🥕'], pot: '🍲' }, 4, {}, { room: 'monica' })
  ],
  foods: ['special', 'moist', 'flakes', 'fish', 'sushi', 'lasagna', 'cheesecake', 'milk', 'apple', 'pretzel', 'icecream', 'turkey'],
  items: ['bowtie', 'shades', 'tophat', 'scarf', 'camera', 'cowboy', 'headphones', 'stetho', 'hbox', 'labcoat', 'guitar', 'crown', 'medal', 'poster', 'plant', 'neon', 'trophy'],
  story: [
    S(T('הדגנים "Hugsy Flakes" רוצים את האגזי על הקופסה! קודם כל — ארוחת בוקר טובה.', 'The "Hugsy Flakes" cereal wants Hugsy on the box! First, a hearty breakfast.', 'حبوب "Hugsy Flakes" تريد هاغزي على العلبة! أولًا، فطور جيد.', 'Хлопья «Hugsy Flakes» хотят Хагзи на коробке! Сначала — сытный завтрак.', '¡Los cereales «Hugsy Flakes» quieren a Hugsy en la caja! Primero, un buen desayuno.'), 'feed', null, 2, { c: 40, x: 30 }, "Hugsy Flakes wants YOU on the box, buddy!"),
    S(T('חימום לפני הצילומים: שתי ריצות פינגווין.', 'A warm-up before the shoot: two penguin waddle runs.', 'إحماء قبل التصوير: ركضتان للبطريق.', 'Разминка перед съёмкой: два забега пингвина.', 'Calentamiento antes de la sesión: dos carreras de pingüino.'), 'actid', 'waddle', 2, { c: 40, x: 30 }, 'Gotta look sharp for the box, buddy!'),
    S(T("רייצ'ל מסדרת לו את הלוק. עזרו לה בסטיילינג.", 'Rachel is sorting his look. Help her with the styling.', 'ريتشل تجهّز إطلالته. ساعدها في التنسيق.', 'Рэйчел готовит его образ. Помоги со стилем.', 'Rachel prepara su look. Ayúdala con el estilismo.'), 'actid', 'style', 2, { c: 50, x: 40 }, "How you doin'? That's the look!"),
    S(T('תרגול פוזות לדגמנות — שלוש פעמים לפחות.', 'Practice modeling poses — at least three times.', 'تمرّن على وضعيات العرض — ثلاث مرات على الأقل.', 'Потренируй позы модели — минимум три раза.', 'Practica poses de modelo: al menos tres veces.'), 'actid', 'poses', 3, { c: 55, x: 45 }, 'Work it, Hugsy! The camera loves you!'),
    S(T('ביקור בדירה של מוניקה — בחרו את חדר "החברים".', "A visit to Monica's apartment — open the \"The gang\" room.", 'زيارة شقة مونيكا — افتح غرفة "الشلّة".', 'Визит в квартиру Моники — открой комнату «Компания друзей».', 'Visita al piso de Monica: abre la sala «La pandilla».'), 'poi', 'monica', 1, { c: 45, x: 35 }, 'The gang is all here!'),
    S(T('הצלם מחכה: שני רגעים מושלמים בצילום.', 'The photographer is waiting: two perfect shutter moments.', 'المصوّر ينتظر: لحظتان مثاليتان في التصوير.', 'Фотограф ждёт: два идеальных кадра.', 'El fotógrafo espera: dos momentos perfectos.'), 'actid', 'shutter', 2, { c: 60, x: 50 }, 'Hold it... hold it...'),
    S(T('צילום הקופסה הגדול! תפסו את הפתיתים בסלסלה.', 'The big box shoot! Catch the flakes in the box.', 'تصوير العلبة الكبير! التقط الرقائق في العلبة.', 'Большая съёмка коробки! Лови хлопья.', '¡La gran sesión de la caja! Atrapa los copos.'), 'actid', 'flakes', 2, { c: 120, x: 80, i: 'hbox' }, 'Hugsy, you are a STAR!'),
    S(T('פרק חדש: דוקטור האגזי בדרמה "ימים בחיינו"! חזרו על הטקסט.', 'A new chapter: Dr. Hugsy in the drama "Days of Our Lives"! Rehearse the lines.', 'فصل جديد: الدكتور هاغزي في مسلسل "Days of Our Lives"! تدرّب على النص.', 'Новая глава: доктор Хагзи в сериале «Days of Our Lives»! Репетируй реплики.', 'Nuevo capítulo: ¡el Dr. Hugsy en «Days of Our Lives»! Ensaya las frases.'), 'actid', 'lines', 3, { c: 60, x: 50 }, 'Dr. Hugsy is in the house!'),
    S(T('חדר הניתוחים: מיינו את הכלים הנכונים.', 'The operating room: sort the right tools.', 'غرفة العمليات: صنّف الأدوات الصحيحة.', 'Операционная: разложи нужные инструменты.', 'El quirófano: clasifica los instrumentos correctos.'), 'actid', 'operate', 2, { c: 70, x: 55 }, "That's acting! Real acting!"),
    S(T('רוס מתאמן איתו על תנועה: צעקו PIVOT בזמן הנכון!', 'Ross rehearses movement with him: yell PIVOT at the right time!', 'روس يتدرّب معه على الحركة: اصرخ PIVOT في الوقت المناسب!', 'Росс репетирует с ним движение: крикни PIVOT вовремя!', 'Ross ensaya el movimiento con él: ¡grita PIVOT en el momento justo!'), 'actid', 'pivot', 2, { c: 70, x: 55 }, 'PIVOT! PIVOT!'),
    S(T("צ'נדלר מלמד אותו תזמון קומי. אספו את הבדיחות.", 'Chandler teaches him comic timing. Collect the jokes.', 'تشاندلر يعلّمه التوقيت الكوميدي. اجمع النكات.', 'Чендлер учит его комическому таймингу. Лови шутки.', 'Chandler le enseña el timing cómico. Recoge los chistes.'), 'actid', 'jokes', 2, { c: 70, x: 55 }, 'Could this BE any more funny?'),
    S(T('כרטיסי רמזים ועמידה על הסימן — האולפן מוכן.', 'Cue cards and hitting your mark — the studio is ready.', 'بطاقات التلقين والوقوف على العلامة — الاستوديو جاهز.', 'Карточки и отметка — студия готова.', 'Tarjetas y marca: el estudio está listo.'), 'actid', 'cuecards', 2, { c: 80, x: 60 }, 'Say it like you mean it, pal!'),
    S(T('הגיעו לרמה 9 — האודישן מתקרב.', 'Reach level 9 — the audition is near.', 'صلْ إلى المستوى 9 — الاختبار يقترب.', 'Достигни 9 уровня — прослушивание близко.', 'Llega al nivel 9: la audición se acerca.'), 'lv', null, 9, { c: 100, x: 40 }, 'Almost there, buddy!'),
    S(T('האודישן הגדול! האגזי מקבל את תפקיד הרופא.', 'The big audition! Hugsy lands the doctor role.', 'الاختبار الكبير! هاغزي ينال دور الطبيب.', 'Большое прослушивание! Хагзи получает роль доктора.', '¡La gran audición! Hugsy consigue el papel de doctor.'), 'actid', 'audition', 1, { c: 250, x: 150, i: 'labcoat' }, 'WE DID IT! Dr. Hugsy, ladies and gentlemen!'),
    S(T('אפילוג: יום כביסה! אפילו כוכבים מכבסים את הווסט, הכובע, המשקפיים והצעיף.', "Epilogue: laundry day! Even stars wash the vest, beanie, goggles and scarf.", 'خاتمة: يوم الغسيل! حتى النجوم تغسل السترة والقبعة والنظارات والوشاح.', 'Эпилог: день стирки! Даже звёзды стирают жилет, шапку, очки и шарф.', 'Epílogo: ¡día de colada! Hasta las estrellas lavan el chaleco, el gorro, las gafas y la bufanda.'), 'actid', 'laundry', 1, { c: 60, x: 50 }, 'Fresh vest, fresh start, buddy!')
  ],
  quotes: [],
  sleep: T("ג'ואי מכסה אותו בשמיכה... לילה טוב 🌙", 'Joey tucks him in... good night 🌙', 'جوي يغطّيه بالبطانية... ليلة سعيدة 🌙', 'Джои укрывает его одеялом... спокойной ночи 🌙', 'Joey lo arropa... buenas noches 🌙')
};
