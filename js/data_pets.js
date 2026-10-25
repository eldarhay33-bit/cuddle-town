'use strict';
/* ---------- Pet worlds: Dubi MH, Efrochi, Lemilam, Ruchi, Dubila, Marshmallow Cat, Mishmish ---------- */
const PET_STATS = ['hunger', 'fun', 'energy', 'clean', 'love'];

/* ===== 1. Dubi MH — Maccabi Haifa fan bear ===== */
WORLDS.dubi = {
  id: 'dubi', e: '🐻', col: '#16a34a', art: 'dubi', kind: 'pet',
  n: T('דובי MH', 'Dubi MH', 'دوبي MH', 'Дуби MH', 'Dubi MH'),
  desc: T('דוב אוהד מכבי חיפה באצטדיון סמי עופר', 'A Maccabi Haifa fan bear at Sammy Ofer Stadium', 'دب مشجع لمكابي حيفا في ملعب سامي عوفر', 'Медведь-болельщик «Маккаби Хайфа» на стадионе Сэмми Офер', 'Un oso hincha del Maccabi Haifa en el estadio Sammy Ofer'),
  stats: PET_STATS, care: ['feed', 'wash', 'sleep', 'cuddle'],
  scene: { bg: 'linear-gradient(180deg,#8fd3ff 0%,#d9f2ff 45%,#2faa55 46%,#1d7f3c 100%)', deco: [['🏟️', 50, 17, 86], ['🚩', 9, 40, 34], ['🚩', 91, 40, 34], ['📣', 18, 10, 28], ['⚽', 80, 68, 26]] },
  acts: [
    A('penalty', '⚽', T('בעיטות עונשין', 'Penalty kicks', 'ركلات الجزاء', 'Пенальти', 'Penaltis'), 'aim', { keeper: '🧤', ball: '⚽', target: '🎯', bgstyle: 'background:linear-gradient(#37b35d,#1b7a3a)' }, 1),
    A('sing', '🎶', T('שירת אוהדים', 'Fan chants', 'أهازيج المشجعين', 'Кричалки болельщиков', 'Cantos de la hinchada'), 'simon', { pads: ['🥁', '🎺', '📣', '🎶'], rounds: 5 }, 1),
    A('cheer', '📣', T('עידוד היציע', 'Stand cheering', 'تشجيع المدرجات', 'Поддержка трибун', 'Animar a la grada'), 'tap', { icon: '📣', secs: 8 }, 2),
    A('mealday', '🌭', T('דוכן אוכל ליום משחק', 'Match-day food stand', 'كشك طعام يوم المباراة', 'Ларёк еды в день матча', 'Puesto de comida del partido'), 'cook', { steps: ['🥖', '🌭', '🧅', '🍟', '🥤'], extra: ['🧦', '🥕', '🍋'], pot: '🍳' }, 2),
    A('flags', '🚩', T('תפיסת דגלים וצעיפים', 'Catch flags & scarves', 'التقاط الأعلام والأوشحة', 'Лови флаги и шарфы', 'Atrapa banderas y bufandas'), 'catch', { good: ['🚩', '🧣', '⚽'], bad: ['🍅', '👟'], me: '🧺' }, 3),
    A('facepaint', '🎨', T('איפור אוהדים', 'Fan face-paint', 'مكياج المشجعين', 'Аквагрим болельщика', 'Maquillaje de hincha'), 'memory', { cards: ['🖌️', '🟢', '⚪', '🎨', '🚩', '⭐'] }, 3),
    A('mascot', '🧸', T('ריקוד המזל', 'Lucky mascot dance', 'رقصة التميمة', 'Танец талисмана', 'Baile de la mascota'), 'simon', { pads: ['⬅️', '⬆️', '➡️', '⬇️'], rounds: 6 }, 4),
    A('tifo', '🟩', T('תצוגת יציע', 'Stand display', 'عرض المدرجات', 'Перфоманс трибун', 'Mosaico de la grada'), 'whack', { good: ['🟩', '🚩'], bad: ['⬛'] }, 5),
    A('goal', '🥅', T('הגול המנצח!', 'The winning goal!', 'هدف الفوز!', 'Победный гол!', '¡El gol de la victoria!'), 'timing', { icon: '⚽', rounds: 6 }, 6, { fit: 4 })
  ],
  foods: ['seeds', 'hotdog', 'soda', 'popcorn', 'falafel', 'shawarma', 'cake'],
  items: ['cap', 'scarf', 'shades', 'flag', 'ball', 'drum', 'medal', 'balloons', 'trophy'],
  story: [
    S(T('המשחק הגדול מתקרב! בואו נתחמם עם כמה בעיטות עונשין.', 'The big match is coming! Warm up with some penalty kicks.', 'المباراة الكبيرة تقترب! لنسخّن ببعض ركلات الجزاء.', 'Скоро большой матч! Разомнёмся пенальти.', '¡Se acerca el gran partido! Calentemos con unos penaltis.'), 'actid', 'penalty', 2, { c: 30, x: 25 }),
    S(T('אוהד אמיתי יודע את כל שירי העידוד. בואו נתאמן!', 'A true fan knows every chant. Time to practice!', 'المشجع الحقيقي يعرف كل الأهازيج. لنتدرّب!', 'Настоящий болельщик знает все кричалки. Потренируемся!', 'Un buen hincha se sabe todos los cantos. ¡A practicar!'), 'actid', 'sing', 2, { c: 35, x: 30 }),
    S(T('בטן ריקה לא צועקת "יאללה"! הגיע הזמן לאוכל.', "An empty tummy can't shout! Time to eat.", 'البطن الفارغة لا تصرخ! حان وقت الأكل.', 'Пустой живот не кричит! Пора поесть.', '¡Con la tripa vacía no se grita! Hora de comer.'), 'feed', null, 2, { c: 30, x: 25 }),
    S(T('אספו 6 כוכבים בפעילויות כדי להרגיש כמו אלופים.', 'Collect 6 stars in activities to feel like champions.', 'اجمع 6 نجوم في الأنشطة لتشعر كالأبطال.', 'Собери 6 звёзд, чтобы почувствовать себя чемпионом.', 'Consigue 6 estrellas para sentirte campeón.'), 'stars', null, 6, { c: 45, x: 35 }),
    S(T('הגיעו לרמה 3 — היציע מחכה לכם!', 'Reach level 3 — the stands are waiting!', 'صلْ إلى المستوى 3 — المدرجات تنتظرك!', 'Достигни 3 уровня — трибуны ждут!', 'Llega al nivel 3: ¡la grada te espera!'), 'lv', null, 3, { c: 60, x: 20 }),
    S(T('פתחו דוכן אוכל ליום משחק והאכילו את האוהדים!', 'Open a match-day food stand and feed the fans!', 'افتح كشك طعام للمباراة وأطعم المشجعين!', 'Открой ларёк в день матча и накорми болельщиков!', '¡Abre un puesto de comida y alimenta a los hinchas!'), 'actid', 'mealday', 2, { c: 55, x: 40 }),
    S(T('איפור אוהדים בצבעי הקבוצה — כולם מחכים בתור!', 'Face paint in team colors — everyone is queueing up!', 'مكياج بألوان الفريق — الجميع في الطابور!', 'Аквагрим в цветах команды — все в очереди!', 'Maquillaje con los colores del equipo: ¡todos hacen cola!'), 'actid', 'facepaint', 2, { c: 60, x: 45 }),
    S(T('הגול המנצח! הגיעו לרמה 6 ובעטו את הכדור האחרון.', 'The winning goal! Reach level 6 and take the final shot.', 'هدف الفوز! صلْ إلى المستوى 6 وسدّد الكرة الأخيرة.', 'Победный гол! Достигни 6 уровня и забей последний мяч.', '¡El gol de la victoria! Llega al nivel 6 y chuta el último balón.'), 'actid', 'goal', 2, { c: 150, x: 100, i: 'trophy' })
  ],
  quotes: [
    T('יאללה, הירוקים!', 'Come on, green team!', 'هيا يا فريق الأخضر!', 'Давай, зелёные!', '¡Vamos, equipo verde!'),
    T('הירוק הוא הצבע הכי יפה!', 'Green is the prettiest color!', 'الأخضر أجمل لون!', 'Зелёный — самый красивый цвет!', '¡El verde es el color más bonito!'),
    T('אני מרגיש את האצטדיון רועד!', 'I can feel the stadium shaking!', 'أشعر أن الملعب يهتز!', 'Чувствую, как дрожит стадион!', '¡Siento temblar el estadio!'),
    T('גול! גוווול!', 'Goal! Gooooal!', 'هدف! هددف!', 'Гол! Гоооол!', '¡Gol! ¡Goooool!'),
    T('עוד שיר אחד ואני מוכן!', 'One more chant and I am ready!', 'أنشودة أخرى وأكون جاهزًا!', 'Ещё одна кричалка — и я готов!', '¡Un canto más y estoy listo!')
  ],
  sleep: T('לילה טוב! חולמים על גולים... ⚽', 'Good night! Dreaming of goals... ⚽', 'ليلة سعيدة! أحلم بالأهداف... ⚽', 'Спокойной ночи! Снятся голы... ⚽', '¡Buenas noches! Soñando con goles... ⚽')
};

/* ===== 2. Efrochi — big chick + mother hen ===== */
WORLDS.efro = {
  id: 'efro', e: '🐥', col: '#f59e0b', art: 'efro', kind: 'pet',
  comp: { art: 'hen', cls: 'hen' },
  n: T('אפרוחי', 'Efrochi', 'إفروتشي', 'Эфрочи', 'Efrochi'),
  desc: T('אפרוח גדול בחצר כפרית, ואמא תרנגולת קטנה שדואגת לו', 'A big chick on a country farm, looked after by a tiny mother hen', 'فرخ كبير في مزرعة ريفية ترعاه أمٌّ دجاجة صغيرة', 'Большой цыплёнок на ферме и маленькая курица-мама', 'Un pollito grande en una granja con su pequeña mamá gallina'),
  stats: PET_STATS, care: ['feed', 'wash', 'sleep', 'cuddle'],
  scene: { bg: 'linear-gradient(180deg,#bfe9ff 0%,#eaf8ff 42%,#9bd66a 43%,#6fbf45 100%)', deco: [['🏡', 20, 25, 72], ['🌻', 86, 54, 38], ['🌾', 9, 60, 34], ['☀️', 86, 9, 38], ['🪵', 66, 40, 28]] },
  acts: [
    A('feedhen', '🥣', T('ארוחת בוקר מאמא', 'Breakfast with Mama Hen', 'فطور مع ماما الدجاجة', 'Завтрак с мамой-курицей', 'Desayuno con mamá gallina'), 'cook', { steps: ['🌽', '🌾', '🥚', '🥛'], extra: ['🧦', '🌶️'], pot: '🥣' }, 1),
    A('hideseek', '🙈', T('מחבואים בחצר', 'Hide & seek in the yard', 'غميضة في الفناء', 'Прятки во дворе', 'Escondite en el corral'), 'whack', { good: ['🐥'], bad: ['🦊'] }, 1),
    A('eggs', '🥚', T('איסוף ביצים', 'Egg collecting', 'جمع البيض', 'Сбор яиц', 'Recoger huevos'), 'catch', { good: ['🥚', '🥚', '🐣'], bad: ['🪨'], me: '🧺' }, 1),
    A('dustbath', '🪶', T('ניקוי נוצות', 'Feather cleaning', 'تنظيف الريش', 'Чистка пёрышек', 'Limpieza de plumas'), 'scrub', { base: '🐥', dirt: '#8d6e63' }, 2),
    A('flylearn', '🪽', T('לימוד תעופה', 'Flying lessons', 'دروس الطيران', 'Уроки полёта', 'Clases de vuelo'), 'runner', { me: '🐥', good: ['🪶', '⭐'], bad: ['🦅'], road: 'rgba(255,255,255,.35)' }, 2),
    A('peck', '🌽', T('ניקור גרגרים', 'Seed pecking', 'نقر الحبوب', 'Клевание зёрен', 'Picoteo de granos'), 'tap', { icon: '🌽', secs: 8 }, 3),
    A('songchick', '🎵', T('שירת בוקר', 'Morning song', 'أغنية الصباح', 'Утренняя песенка', 'Canción de la mañana'), 'simon', { pads: ['🐓', '🐥', '🌅', '🎵'], rounds: 5 }, 3),
    A('tidy', '🧺', T('סידור הלול', 'Tidy the coop', 'ترتيب خم الدجاج', 'Уборка в курятнике', 'Ordenar el gallinero'), 'sort', { bins: [{ e: '🥚', k: 'e', l: T('ביצים', 'Eggs', 'بيض', 'Яйца', 'Huevos') }, { e: '🌾', k: 's', l: T('קש', 'Straw', 'قش', 'Солома', 'Paja') }, { e: '🗑️', k: 't', l: T('זבל', 'Trash', 'قمامة', 'Мусор', 'Basura') }], items: [{ e: '🥚', k: 'e' }, { e: '🐣', k: 'e' }, { e: '🌾', k: 's' }, { e: '🍂', k: 's' }, { e: '🧦', k: 't' }, { e: '🍌', k: 't' }] }, 4),
    A('haystack', '🌾', T('מגדל חציר', 'Haystack tower', 'برج القش', 'Башня из сена', 'Torre de heno'), 'stack', { top: '🌾', floors: 10 }, 5),
    A('flyfinal', '☁️', T('טיסה מעל החווה', 'Flight over the farm', 'التحليق فوق المزرعة', 'Полёт над фермой', 'Vuelo sobre la granja'), 'runner', { me: '🐥', good: ['☁️', '⭐', '🪶'], bad: ['🦅', '⛈️'], time: 30, road: 'rgba(180,220,255,.5)' }, 6)
  ],
  foods: ['grain', 'corn', 'worm', 'watermelon', 'milk', 'apple', 'cake'],
  items: ['strawhat', 'bow', 'bowtie', 'shades', 'scarf', 'flower', 'plant', 'kite', 'balloons'],
  story: [
    S(T('אמא תרנגולת מכינה ארוחת בוקר — עזרו לה במטבח!', 'Mama Hen is making breakfast — help her in the kitchen!', 'ماما الدجاجة تحضّر الفطور — ساعدها في المطبخ!', 'Мама-курица готовит завтрак — помоги ей!', 'Mamá gallina prepara el desayuno: ¡ayúdala!'), 'actid', 'feedhen', 2, { c: 30, x: 25 }),
    S(T('בואו נשחק מחבואים בחצר לפני שהשועל יבוא!', 'Let us play hide & seek before the fox shows up!', 'لنلعب الغميضة قبل أن يأتي الثعلب!', 'Сыграем в прятки, пока лиса не пришла!', '¡Juguemos al escondite antes de que llegue el zorro!'), 'actid', 'hideseek', 2, { c: 35, x: 30 }),
    S(T('אספו 3 סלים של ביצים טריות.', 'Gather three baskets of fresh eggs.', 'اجمع ثلاث سلال من البيض الطازج.', 'Собери три корзины свежих яиц.', 'Recoge tres cestas de huevos frescos.'), 'actid', 'eggs', 3, { c: 40, x: 30 }),
    S(T('אפרוחי התלכלך! הגיע זמן לניקוי נוצות.', 'Efrochi got dusty! Time to clean those feathers.', 'إفروتشي اتّسخ! حان وقت تنظيف الريش.', 'Эфрочи испачкался! Пора почистить пёрышки.', '¡Efrochi se ha ensuciado! Toca limpiar plumas.'), 'actid', 'dustbath', 2, { c: 45, x: 35 }),
    S(T('הגיעו לרמה 3 — כמעט מוכנים להתעופף!', 'Reach level 3 — almost ready to fly!', 'صلْ إلى المستوى 3 — أوشكنا على الطيران!', 'Достигни 3 уровня — почти готов взлететь!', 'Llega al nivel 3: ¡casi listo para volar!'), 'lv', null, 3, { c: 60, x: 20 }),
    S(T('אמא מלמדת אותו לעוף. תרגלו שיעורי תעופה!', 'Mama teaches him to fly. Practice flying lessons!', 'ماما تعلّمه الطيران. تدرّب على دروس الطيران!', 'Мама учит летать. Занимайся полётами!', 'Mamá le enseña a volar. ¡Practica las clases!'), 'actid', 'flylearn', 3, { c: 60, x: 45 }),
    S(T('שיר בוקר מלא כוח! שירו יחד עם כל החצר.', 'A big morning song — sing with the whole yard!', 'أغنية صباح كبيرة — غنِّ مع كل الفناء!', 'Большая утренняя песня — пой со всем двором!', 'Una gran canción matutina: ¡canta con todo el corral!'), 'actid', 'songchick', 2, { c: 60, x: 45 }),
    S(T('היום הגדול: הגיעו לרמה 6 וטוסו מעל החווה!', 'The big day: reach level 6 and soar over the farm!', 'اليوم الكبير: صلْ إلى المستوى 6 وحلّق فوق المزرعة!', 'Великий день: достигни 6 уровня и взлети над фермой!', 'El gran día: llega al nivel 6 y vuela sobre la granja.'), 'actid', 'flyfinal', 1, { c: 150, x: 100, i: 'kite' })
  ],
  quotes: [
    T('פיפ פיפ! אמא, ראית אותי?', 'Peep peep! Mama, did you see me?', 'بيب بيب! ماما، هل رأيتِني؟', 'Пи-пи! Мама, ты видела?', '¡Pío pío! Mamá, ¿me has visto?'),
    T('אמא תרנגולת אמרה שאני כבר גדול!', 'Mama Hen says I am a big chick now!', 'ماما الدجاجة تقول إنني كبرت!', 'Мама говорит, что я уже большой!', '¡Mamá gallina dice que ya soy grande!'),
    T('נראה לי שאני מתחיל לעוף...', 'I think I am starting to fly...', 'أظن أنني بدأت أطير...', 'Кажется, я начинаю летать...', 'Creo que estoy empezando a volar...'),
    T('איזה ריח טוב של תירס!', 'What a lovely smell of corn!', 'ما أجمل رائحة الذرة!', 'Как вкусно пахнет кукуруза!', '¡Qué rico huele el maíz!'),
    T('קוקוריקו! בוקר טוב!', 'Cock-a-doodle-doo! Good morning!', 'كوكوريكو! صباح الخير!', 'Кукареку! Доброе утро!', '¡Quiquiriquí! ¡Buenos días!')
  ],
  sleep: T('אמא תרנגולת מכסה אותו בשמיכת נוצות... לילה טוב 🌙', 'Mama Hen tucks him in with a feather blanket... good night 🌙', 'ماما الدجاجة تغطيه ببطانية من الريش... ليلة سعيدة 🌙', 'Мама укрывает его пуховым одеялом... спокойной ночи 🌙', 'Mamá gallina lo arropa con una manta de plumas... buenas noches 🌙')
};

/* ===== 3. Lemilam — pampered model with a spa salon ===== */
WORLDS.lemi = {
  id: 'lemi', e: '🦙', col: '#ec4899', art: 'lemi', kind: 'pet',
  n: T('למילם', 'Lemilam', 'ليميلام', 'Лемилам', 'Lemilam'),
  desc: T('דוגמנית מפונקת בסלון ספא מפואר', 'A pampered model in a fancy spa salon', 'عارضة أزياء مدلّلة في صالون سبا فاخر', 'Избалованная модель в роскошном спа-салоне', 'Una modelo mimada en un lujoso salón spa'),
  stats: PET_STATS, care: ['feed', 'wash', 'sleep', 'cuddle'],
  scene: { bg: 'linear-gradient(180deg,#ffe3f1 0%,#ffd0e8 55%,#f6b8d8 56%,#f0a1c9 100%)', deco: [['🪞', 14, 28, 54], ['💎', 85, 12, 30], ['🛁', 86, 46, 50], ['🌺', 10, 62, 32], ['🕯️', 70, 22, 26]] },
  acts: [
    A('fur', '🧴', T('טיפוח פרווה', 'Fur pampering', 'العناية بالفرو', 'Уход за шёрсткой', 'Cuidado del pelaje'), 'scrub', { base: '🦙', dirt: '#b9a38f' }, 1),
    A('ribbon', '🎀', T('עיצוב סרט לשיער', 'Hair-bow design', 'تصميم شريطة الشعر', 'Дизайн банта', 'Diseño de lazos'), 'memory', { cards: ['🎀', '🌸', '💎', '⭐', '🦋', '🌈'] }, 1),
    A('shake', '🥭', T('שייק אקזוטי', 'Exotic shake mixing', 'تحضير شيك استوائي', 'Экзотический шейк', 'Batido exótico'), 'cook', { steps: ['🥭', '🥥', '🍍', '🍓', '🧊'], extra: ['🧦', '🧅'], pot: '🥤' }, 1),
    A('runway', '👠', T('מסלול תצוגת אופנה', 'Fashion runway', 'منصة عرض الأزياء', 'Подиум', 'Pasarela de moda'), 'runner', { me: '💃', good: ['⭐', '💎', '🌸'], bad: ['🍌', '🪨'], road: 'rgba(255,255,255,.4)' }, 2),
    A('pose', '📸', T('פוזות לצילום', 'Photo poses', 'وضعيات التصوير', 'Позы для фото', 'Poses de foto'), 'simon', { pads: ['💋', '💃', '😎', '🤩'], rounds: 5 }, 2),
    A('mani', '💅', T('מניקור פרסות', 'Hoof manicure', 'مانيكير الحوافر', 'Маникюр для копытец', 'Manicura de pezuñas'), 'timing', { icon: '💅', rounds: 5 }, 3),
    A('wardrobe', '👗', T('סידור ארון בגדים', 'Wardrobe sorting', 'ترتيب خزانة الملابس', 'Разбор гардероба', 'Ordenar el armario'), 'sort', { bins: [{ e: '👗', k: 'd', l: T('שמלות', 'Dresses', 'فساتين', 'Платья', 'Vestidos') }, { e: '👒', k: 'h', l: T('כובעים', 'Hats', 'قبعات', 'Шляпы', 'Sombreros') }, { e: '👠', k: 's', l: T('נעליים', 'Shoes', 'أحذية', 'Туфли', 'Zapatos') }], items: [{ e: '👗', k: 'd' }, { e: '👚', k: 'd' }, { e: '👒', k: 'h' }, { e: '🎩', k: 'h' }, { e: '👠', k: 's' }, { e: '👡', k: 's' }] }, 3),
    A('bubbles', '🫧', T('פיצוץ בועות בג׳קוזי', 'Jacuzzi bubble pop', 'فرقعة فقاعات الجاكوزي', 'Пузыри в джакузи', 'Burbujas en el jacuzzi'), 'whack', { good: ['🫧'], bad: ['🪨'] }, 4),
    A('flowers', '💐', T('סידור פרחים', 'Flower arranging', 'تنسيق الزهور', 'Составление букетов', 'Arreglo floral'), 'catch', { good: ['🌸', '🌺', '🌷'], bad: ['🌵'], me: '🏺' }, 5),
    A('fashionshow', '👑', T('תצוגת האופנה הגדולה', 'The grand fashion show', 'عرض الأزياء الكبير', 'Большой показ мод', 'El gran desfile'), 'timing', { icon: '👑', rounds: 7 }, 6)
  ],
  foods: ['mango', 'coconut', 'berry', 'kiwi', 'strawberry', 'cupcake', 'grapes'],
  items: ['bow', 'crown', 'shades', 'pearls', 'dress', 'gem', 'bouquet', 'mirror', 'rainbow'],
  story: [
    S(T('הלקוחה הראשונה של הסלון: פנקו את הפרווה!', "The salon's first client: pamper that fur!", 'أول زبونة في الصالون: دلّل الفرو!', 'Первая клиентка салона: побалуй шёрстку!', 'La primera clienta del salón: ¡a mimar ese pelaje!'), 'actid', 'fur', 2, { c: 30, x: 25 }),
    S(T('שייק אקזוטי אחרי הטיפוח — כי מגיע לה.', 'An exotic shake after the treatment — she deserves it.', 'شيك استوائي بعد العناية — فهي تستحق!', 'Экзотический шейк после ухода — она заслужила.', 'Un batido exótico tras el tratamiento: se lo merece.'), 'actid', 'shake', 2, { c: 35, x: 30 }),
    S(T('סרט לשיער חדש! עצבו אותו עם הזוגות הנכונים.', 'A brand-new hair bow! Design it with the right pairs.', 'شريطة شعر جديدة! صمّمها بالأزواج الصحيحة.', 'Новый бантик! Составь его из верных пар.', '¡Un lazo nuevo! Diseñalo con las parejas correctas.'), 'actid', 'ribbon', 2, { c: 40, x: 30 }),
    S(T('המסלול מחכה: צעדו שתי הליכות הדגמה.', 'The runway awaits: do two catwalk rounds.', 'المنصة تنتظر: قم بجولتي عرض.', 'Подиум ждёт: пройди два показа.', 'La pasarela espera: haz dos pases.'), 'actid', 'runway', 2, { c: 50, x: 40 }),
    S(T('הגיעו לרמה 4 — הצילומים מתקרבים!', 'Reach level 4 — the photo shoot is near!', 'صلْ إلى المستوى 4 — جلسة التصوير قريبة!', 'Достигни 4 уровня — скоро фотосессия!', 'Llega al nivel 4: ¡la sesión de fotos se acerca!'), 'lv', null, 4, { c: 70, x: 25 }),
    S(T('צילומי האופנה: שלוש פוזות מושלמות!', 'The fashion shoot: three perfect poses!', 'جلسة تصوير الأزياء: ثلاث وضعيات مثالية!', 'Фотосессия: три идеальные позы!', 'La sesión de moda: ¡tres poses perfectas!'), 'actid', 'pose', 3, { c: 60, x: 45 }),
    S(T('סדרו את הארון לפני התצוגה הגדולה.', 'Sort the wardrobe before the big show.', 'رتّب الخزانة قبل العرض الكبير.', 'Разбери гардероб перед большим показом.', 'Ordena el armario antes del gran desfile.'), 'actid', 'wardrobe', 2, { c: 60, x: 45 }),
    S(T('התצוגה הגדולה! הגיעו לרמה 6 וזכו בכתר.', 'The grand show! Reach level 6 and win the crown.', 'العرض الكبير! صلْ إلى المستوى 6 وفُز بالتاج.', 'Большой показ! Достигни 6 уровня и получи корону.', '¡El gran desfile! Llega al nivel 6 y gana la corona.'), 'actid', 'fashionshow', 1, { c: 150, x: 100, i: 'crown' })
  ],
  quotes: [
    T('דרלינג, הפרווה שלי חייבת לנצנץ!', 'Darling, my fur must sparkle!', 'عزيزي، فروي يجب أن يلمع!', 'Дорогой, моя шёрстка должна сиять!', '¡Querido, mi pelaje debe brillar!'),
    T('הסרט הזה לא מתאים לגוון שלי...', 'This bow does not match my shade...', 'هذه الشريطة لا تناسب لوني...', 'Этот бантик не подходит к моему оттенку...', 'Este lazo no combina con mi tono...'),
    T('אני מוכנה לקלוז־אפ!', 'I am ready for my close-up!', 'أنا جاهزة للقطة القريبة!', 'Я готова к крупному плану!', '¡Estoy lista para mi primer plano!'),
    T('עוד שייק אקזוטי, בבקשה!', 'Another exotic shake, please!', 'شيك استوائي آخر من فضلك!', 'Ещё один экзотический шейк, пожалуйста!', '¡Otro batido exótico, por favor!'),
    T('הכוכבת נולדה... שוב.', 'A star is born... again.', 'وُلدت نجمة... مجددًا.', 'Звезда родилась… опять.', 'Nace una estrella... otra vez.')
  ],
  sleep: T('מסכת פנים, כרית משי... לילה טוב 💤', 'Face mask, silk pillow... good night 💤', 'قناع للوجه ووسادة حرير... ليلة سعيدة 💤', 'Маска для лица, шёлковая подушка... спокойной ночи 💤', 'Mascarilla y almohada de seda... buenas noches 💤')
};

/* ===== 4. Ruchi — little ghost in a moonlit castle ===== */
WORLDS.ruchi = {
  id: 'ruchi', e: '👻', col: '#7c3aed', art: 'ruchi', kind: 'pet',
  n: T('רוחי', 'Ruchi', 'روحي', 'Рухи', 'Ruji'),
  desc: T('רוח חמודה בטירה קסומה מתחת לירח', 'A cute little ghost in an enchanted castle under the moon', 'شبح لطيف في قلعة ساحرة تحت القمر', 'Милый призрак в волшебном замке под луной', 'Un fantasmita en un castillo encantado bajo la luna'),
  stats: PET_STATS, care: ['feed', 'wash', 'sleep', 'cuddle'],
  scene: { bg: 'linear-gradient(180deg,#1c1b4d 0%,#3a2f7d 60%,#4b3a8f 61%,#2c2461 100%)', deco: [['🌙', 84, 12, 54], ['🏰', 18, 32, 86], ['✨', 50, 8, 26], ['🦇', 66, 26, 26], ['⭐', 8, 10, 22]] },
  acts: [
    A('float', '🎈', T('תרגול רחיפה', 'Floating practice', 'تمرين الطفو', 'Тренировка парения', 'Práctica de flotar'), 'runner', { me: '👻', good: ['✨', '⭐'], bad: ['🦇'], road: 'rgba(255,255,255,.14)' }, 1),
    A('cotton', '🍭', T('הכנת צמר גפן מתוק', 'Cotton-candy spinning', 'تحضير غزل البنات', 'Сладкая вата', 'Hacer algodón de azúcar'), 'tap', { icon: '🍭', secs: 8 }, 1),
    A('scare', '😱', T('הבהלות חמודות', 'Cute scares', 'مفاجآت لطيفة', 'Милые испуги', 'Sustos adorables'), 'whack', { good: ['😱'], bad: ['😎'] }, 1),
    A('lost', '🔍', T('חיפוש חפצים אבודים', 'Lost & found hunt', 'البحث عن الأغراض المفقودة', 'Поиск потерянных вещей', 'Búsqueda de objetos perdidos'), 'memory', { cards: ['🔑', '🧦', '🧸', '🕯️', '📖', '🪞'] }, 2),
    A('lantern', '🏮', T('הדלקת פנסים', 'Light the lanterns', 'إشعال الفوانيس', 'Зажги фонарики', 'Enciende los faroles'), 'simon', { pads: ['🏮', '🕯️', '🔥', '💡'], rounds: 5 }, 2),
    A('castle', '🏰', T('ניקוי אבק מהטירה', 'Castle dust-off', 'نفض غبار القلعة', 'Уборка пыли в замке', 'Quitar el polvo al castillo'), 'scrub', { base: '🏰', dirt: '#6b6b7a' }, 3),
    A('moonjump', '🌙', T('קפיצה על הירח', 'Moon hops', 'قفزات على القمر', 'Прыжки по луне', 'Saltos lunares'), 'timing', { icon: '🌙', rounds: 5 }, 3),
    A('books', '📚', T('ספרייה קסומה', 'Magic library', 'مكتبة سحرية', 'Волшебная библиотека', 'Biblioteca mágica'), 'sort', { bins: [{ e: '📘', k: 'b' }, { e: '📕', k: 'r' }, { e: '📗', k: 'g' }], items: [{ e: '📘', k: 'b' }, { e: '📕', k: 'r' }, { e: '📗', k: 'g' }] }, 4),
    A('ghostdance', '💃', T('ריקוד רפאים', 'Ghost waltz', 'رقصة الأشباح', 'Вальс призраков', 'Vals fantasma'), 'simon', { pads: ['🌙', '⭐', '☁️', '✨'], rounds: 6 }, 5),
    A('moonflight', '🚀', T('טיסת ירח', 'Moonlight flight', 'رحلة ضوء القمر', 'Полёт при луне', 'Vuelo a la luz de la luna'), 'runner', { me: '👻', good: ['🌟', '✨', '🍬'], bad: ['🦇', '☁️'], time: 30, road: 'rgba(255,255,255,.18)' }, 6)
  ],
  foods: ['cottoncandy', 'candy', 'cheese', 'cookie', 'hotchoc', 'cupcake', 'popcorn'],
  items: ['tophat', 'bow', 'shades', 'bowtie', 'scarf', 'candle', 'bats', 'sparkles', 'pumpkin'],
  story: [
    S(T('ברוכים הבאים לטירה! נתחיל בתרגול רחיפה.', 'Welcome to the castle! We begin with floating practice.', 'مرحبًا بك في القلعة! نبدأ بتمرين الطفو.', 'Добро пожаловать в замок! Начнём с парения.', '¡Bienvenido al castillo! Empezamos flotando.'), 'actid', 'float', 2, { c: 30, x: 25 }),
    S(T('רוחי רעב — הכינו צמר גפן מתוק!', 'Ruchi is hungry — spin some cotton candy!', 'روحي جائع — حضّر غزل البنات!', 'Рухи голоден — накрути сладкой ваты!', 'Ruji tiene hambre: ¡prepara algodón de azúcar!'), 'actid', 'cotton', 2, { c: 35, x: 30 }),
    S(T('הבהלות חמודות לאורחים הישנוניים. בו!', 'Cute scares for the sleepy visitors. Boo!', 'مفاجآت لطيفة للزوار النعسانين. بوو!', 'Милые испуги для сонных гостей. Бу!', 'Sustos adorables para los visitantes dormilones. ¡Buu!'), 'actid', 'scare', 3, { c: 40, x: 30 }),
    S(T('מישהו איבד חפצים בטירה. עזרו לחפש.', 'Someone lost things in the castle. Help find them.', 'أحدهم أضاع أغراضًا في القلعة. ساعد في البحث.', 'В замке кто-то потерял вещи. Помоги найти.', 'Alguien perdió cosas en el castillo. Ayuda a buscarlas.'), 'actid', 'lost', 2, { c: 50, x: 40 }),
    S(T('הגיעו לרמה 3 — הפנסים מחכים.', 'Reach level 3 — the lanterns are waiting.', 'صلْ إلى المستوى 3 — الفوانيس تنتظر.', 'Достигни 3 уровня — фонарики ждут.', 'Llega al nivel 3: los faroles esperan.'), 'lv', null, 3, { c: 60, x: 20 }),
    S(T('הדליקו את הפנסים לפי הסדר הנכון.', 'Light the lanterns in the right order.', 'أشعل الفوانيس بالترتيب الصحيح.', 'Зажги фонарики в правильном порядке.', 'Enciende los faroles en el orden correcto.'), 'actid', 'lantern', 3, { c: 55, x: 45 }),
    S(T('נקו את אבק הטירה לפני נשף הירח.', 'Dust the castle before the Moon Ball.', 'نظّف غبار القلعة قبل حفل القمر.', 'Смахни пыль перед Лунным балом.', 'Quita el polvo antes del Baile de la Luna.'), 'actid', 'castle', 2, { c: 60, x: 45 }),
    S(T('נשף הירח! הגיעו לרמה 6 וטוסו בין הכוכבים.', 'The Moon Ball! Reach level 6 and fly among the stars.', 'حفل القمر! صلْ إلى المستوى 6 وحلّق بين النجوم.', 'Лунный бал! Достигни 6 уровня и лети среди звёзд.', '¡El Baile de la Luna! Llega al nivel 6 y vuela entre las estrellas.'), 'actid', 'moonflight', 1, { c: 150, x: 100, i: 'rainbow' })
  ],
  quotes: [
    T('בוּוּ! ...סליחה, בטעות.', 'Boo! ...sorry, by accident.', 'بوو! ... آسف، عن غير قصد.', 'Бу! ...ой, случайно.', '¡Buu! ...perdón, sin querer.'),
    T('אני כל כך קל שאני מרחף!', 'I am so light I am floating!', 'أنا خفيف جدًا لدرجة أنني أطفو!', 'Я такой лёгкий, что парю!', '¡Soy tan ligero que floto!'),
    T('הירח הערב כל כך יפה.', 'The moon is so pretty tonight.', 'القمر جميل جدًا الليلة.', 'Луна сегодня такая красивая.', 'La luna está preciosa esta noche.'),
    T('איפה שמתי את הכרית שלי?', 'Where did I leave my pillow?', 'أين تركت وسادتي؟', 'Куда я дел подушку?', '¿Dónde dejé mi almohada?'),
    T('צמר גפן מתוק — האוכל של הרוחות!', 'Cotton candy — the food of ghosts!', 'غزل البنات — طعام الأشباح!', 'Сладкая вата — еда призраков!', '¡Algodón de azúcar, la comida de los fantasmas!')
  ],
  sleep: T('הירח שר שיר ערש... לילה טוב 🌙', 'The moon hums a lullaby... good night 🌙', 'القمر يدندن ترنيمة النوم... ليلة سعيدة 🌙', 'Луна напевает колыбельную... спокойной ночи 🌙', 'La luna tararea una nana... buenas noches 🌙')
};

/* ===== 5. Dubila — bear in a koala costume ===== */
WORLDS.dubila = {
  id: 'dubila', e: '🐨', col: '#64748b', art: 'dubila', kind: 'pet',
  n: T('דובילה', 'Dubila', 'دوبيلا', 'Дубила', 'Dubila'),
  desc: T('דוב בתחפושת קואלה, זולל מעדנים ואוהב כריות', 'A bear in a koala costume who loves treats and pillows', 'دب بزيّ كوالا يحب الحلويات والوسائد', 'Медведь в костюме коалы, любит лакомства и подушки', 'Un oso con disfraz de koala que ama los manjares y los cojines'),
  stats: PET_STATS, care: ['feed', 'wash', 'sleep', 'cuddle'],
  wash: { g: 'scrub', cfg: { base: '🐨', dirt: '#8a6a4b' } },
  scene: { bg: 'linear-gradient(180deg,#f6f0d4 0%,#e6f1c9 50%,#b7d98a 51%,#8fc56a 100%)', deco: [['🌿', 11, 30, 40], ['🍽️', 86, 36, 40], ['🛏️', 16, 64, 42], ['🌳', 88, 62, 52], ['🍗', 70, 12, 28]] },
  acts: [
    A('washcostume', '🧼', T('ניקוי התחפושת', 'Costume cleaning', 'تنظيف الزي', 'Чистка костюма', 'Limpiar el disfraz'), 'scrub', { base: '🐨', dirt: '#8a6a4b' }, 1),
    A('taste', '👅', T('טעימת מתכונים', 'Recipe tasting', 'تذوق الوصفات', 'Дегустация рецептов', 'Cata de recetas'), 'memory', { cards: ['🍗', '🍝', '🥗', '🍲', '🍰', '🥐'] }, 1),
    A('schnitzel', '🍗', T('שנצלים על כריות', 'Pillow schnitzel picnic', 'نزهة شنيتسل على الوسائد', 'Шницели на подушках', 'Picnic de escalopes en cojines'), 'catch', { good: ['🍗', '🍗', '🥔'], bad: ['🌶️', '🧦'], me: '🧺' }, 1),
    A('bake', '🥧', T('אפיית מעדנים', 'Baking treats', 'خَبز الحلويات', 'Выпечка лакомств', 'Hornear delicias'), 'cook', { steps: ['🥚', '🧈', '🍯', '🍎', '🥧'], extra: ['🧦', '🌶️'], pot: '🥧' }, 2),
    A('eucalyptus', '🌿', T('קטיף אקליפטוס', 'Eucalyptus picking', 'قطف الأوكالبتوس', 'Сбор эвкалипта', 'Recoger eucalipto'), 'runner', { me: '🐨', good: ['🌿', '🍃'], bad: ['🐍', '🪨'], road: 'rgba(120,200,90,.35)' }, 2),
    A('pillowtower', '🛏️', T('מגדל כריות', 'Pillow tower', 'برج الوسائد', 'Башня из подушек', 'Torre de cojines'), 'stack', { top: '🛏️', floors: 9 }, 3),
    A('fridge', '🧊', T('סידור המקרר', 'Fridge organizing', 'ترتيب الثلاجة', 'Порядок в холодильнике', 'Ordenar la nevera'), 'sort', { bins: [{ e: '🥬', k: 'v', l: T('ירקות', 'Veggies', 'خضار', 'Овощи', 'Verduras') }, { e: '🍖', k: 'm', l: T('בשר', 'Meat', 'لحم', 'Мясо', 'Carne') }, { e: '🍰', k: 's', l: T('מתוקים', 'Sweets', 'حلويات', 'Сладкое', 'Dulces') }], items: [{ e: '🥬', k: 'v' }, { e: '🥕', k: 'v' }, { e: '🍖', k: 'm' }, { e: '🍗', k: 'm' }, { e: '🍰', k: 's' }, { e: '🍩', k: 's' }] }, 3),
    A('secret', '🧂', T('מתכון סודי', 'Secret recipe', 'وصفة سرية', 'Секретный рецепт', 'Receta secreta'), 'simon', { pads: ['🧂', '🌶️', '🍯', '🍋'], rounds: 6 }, 4),
    A('sweethunt', '🧁', T('צייד המעדנים', 'Treat hunt', 'صيد الحلويات', 'Охота за лакомствами', 'Caza de manjares'), 'whack', { good: ['🧁', '🍩', '🍪'], bad: ['🧅'] }, 5),
    A('feast', '🍽️', T('הסעודה הגדולה', 'The great feast', 'الوليمة الكبرى', 'Великий пир', 'El gran banquete'), 'cook', { steps: ['🥩', '🥔', '🥕', '🧄', '🌿', '🍷'], extra: ['🧦', '🍋', '🌶️'], pot: '🍽️' }, 6)
  ],
  foods: ['schnitzel', 'pasta', 'eucalyptus', 'soup', 'croissant', 'donut', 'cake'],
  items: ['bow', 'glasses', 'scarf', 'pearls', 'tee', 'plant', 'picture', 'lamp', 'crown'],
  story: [
    S(T('התחפושת מלוכלכת מארוחת אתמול. נקו אותה!', 'The costume is stained from yesterday’s dinner. Clean it!', 'الزي متّسخ من عشاء أمس. نظّفه!', 'Костюм испачкан после вчерашнего ужина. Почисти его!', 'El disfraz está manchado de la cena de ayer. ¡Límpialo!'), 'actid', 'washcostume', 2, { c: 30, x: 25 }),
    S(T('טעימת מתכונים עם עיניים עצומות — זכרו מה טעים!', 'Recipe tasting — remember what is yummy!', 'تذوّق الوصفات — تذكّر ما هو لذيذ!', 'Дегустация рецептов — запомни, что вкусно!', 'Cata de recetas: ¡recuerda lo que está rico!'), 'actid', 'taste', 2, { c: 35, x: 30 }),
    S(T('פיקניק של שנצלים על כריות רכות.', 'A schnitzel picnic on soft pillows.', 'نزهة شنيتسل على وسائد ناعمة.', 'Пикник со шницелями на мягких подушках.', 'Picnic de escalopes sobre cojines blandos.'), 'actid', 'schnitzel', 3, { c: 40, x: 35 }),
    S(T('דובילה רעב! האכילו אותו שלוש פעמים.', 'Dubila is hungry! Feed him three times.', 'دوبيلا جائع! أطعمه ثلاث مرات.', 'Дубила голоден! Накорми его трижды.', '¡Dubila tiene hambre! Aliméntalo tres veces.'), 'feed', null, 3, { c: 45, x: 35 }),
    S(T('הגיעו לרמה 3 — המטבח נפתח לרווחה.', 'Reach level 3 — the kitchen opens wide.', 'صلْ إلى المستوى 3 — المطبخ يفتح أبوابه.', 'Достигни 3 уровня — кухня открывается.', 'Llega al nivel 3: la cocina se abre de par en par.'), 'lv', null, 3, { c: 60, x: 20 }),
    S(T('אפו מעדנים טריים לכל השכונה.', 'Bake fresh treats for the whole neighborhood.', 'اخبز حلويات طازجة لكل الحي.', 'Испеки свежие лакомства для всего района.', 'Hornea manjares frescos para todo el barrio.'), 'actid', 'bake', 2, { c: 60, x: 45 }),
    S(T('סדרו את המקרר לפני הסעודה הגדולה.', 'Organize the fridge before the great feast.', 'رتّب الثلاجة قبل الوليمة الكبرى.', 'Наведи порядок в холодильнике перед пиром.', 'Ordena la nevera antes del gran banquete.'), 'actid', 'fridge', 2, { c: 60, x: 45 }),
    S(T('הסעודה הגדולה! הגיעו לרמה 6 והכינו את כל המנות.', 'The great feast! Reach level 6 and cook every dish.', 'الوليمة الكبرى! صلْ إلى المستوى 6 واطبخ كل الأطباق.', 'Великий пир! Достигни 6 уровня и приготовь все блюда.', '¡El gran banquete! Llega al nivel 6 y cocina todos los platos.'), 'actid', 'feast', 1, { c: 150, x: 100, i: 'lamp' })
  ],
  quotes: [
    T('עוד נגיסה אחת... ועוד אחת...', 'Just one more bite... and another...', 'قضمة أخرى... وأخرى...', 'Ещё один кусочек... и ещё...', 'Un bocado más... y otro...'),
    T('התחפושת הזו הכי נוחה בעולם!', 'This costume is the coziest ever!', 'هذا الزي هو الأكثر راحة في العالم!', 'Этот костюм — самый уютный на свете!', '¡Este disfraz es el más cómodo del mundo!'),
    T('כרית + שניצל = אושר.', 'Pillow + schnitzel = happiness.', 'وسادة + شنيتسل = سعادة.', 'Подушка + шницель = счастье.', 'Cojín + escalope = felicidad.'),
    T('אני לא קואלה אמיתי, אבל אני מאמין!', 'I am not a real koala, but I believe!', 'لست كوالا حقيقيًا لكنني أؤمن!', 'Я не настоящая коала, но я верю!', 'No soy un koala de verdad, ¡pero creo!'),
    T('מי אמר מתכון? אני כבר מריח.', 'Did someone say recipe? I can already smell it.', 'من قال وصفة؟ أشمّها بالفعل.', 'Кто сказал «рецепт»? Я уже чувствую запах.', '¿Alguien dijo receta? Ya la huelo.')
  ],
  sleep: T('מתכרבל בין הכריות... לילה טוב 😴', 'Snuggling between the pillows... good night 😴', 'يتكوّر بين الوسائد... ليلة سعيدة 😴', 'Зарылся между подушек... спокойной ночи 😴', 'Se acurruca entre los cojines... buenas noches 😴')
};

/* ===== 6. Marshmallow Cat ===== */
WORLDS.marsh = {
  id: 'marsh', e: '🐱', col: '#f472b6', art: 'marsh', kind: 'pet',
  n: T('חתול מרשמלו', 'Marshmallow Cat', 'قط المارشميلو', 'Кот-маршмеллоу', 'Gato Malvavisco'),
  desc: T('חתול רך בעולם ממתקים — רק שלא יימס!', 'A soft cat in Candy Land — just do not let him melt!', 'قط ناعم في عالم الحلوى — فقط لا تدعه يذوب!', 'Мягкий кот в мире сладостей — только не дай ему растаять!', 'Un gato blandito en el País de los Dulces: ¡que no se derrita!'),
  stats: ['hunger', 'fun', 'energy', 'chill', 'love'], care: ['feed', 'wash', 'sleep', 'cuddle'],
  wash: { g: 'tap', cfg: { icon: '🪭', secs: 7, label: '❄️' }, stat: 'chill', n: T('קירור', 'Cool down', 'تبريد', 'Охладить', 'Enfriar'), e: '🪭' },
  scene: { bg: 'linear-gradient(180deg,#bff1ff 0%,#ffe0f3 55%,#ffc7e6 56%,#ffb0d9 100%)', deco: [['🍭', 12, 26, 44], ['🍩', 88, 32, 40], ['🌈', 50, 11, 70], ['🧁', 11, 64, 34], ['🍬', 86, 64, 30], ['☁️', 72, 9, 34]] },
  acts: [
    A('shade', '⛱️', T('הגנה מהחום', 'Heat shield', 'الحماية من الحر', 'Защита от жары', 'Escudo contra el calor'), 'catch', { good: ['🧊', '❄️', '🍦'], bad: ['☀️', '🔥'], me: '☂️' }, 1, { chill: 14 }),
    A('choco', '☕', T('הכנת שוקו חם', 'Hot-chocolate making', 'تحضير الشوكولاتة الساخنة', 'Горячий шоколад', 'Preparar chocolate caliente'), 'cook', { steps: ['🥛', '🍫', '🍬', '☕'], extra: ['🧦', '🌶️'], pot: '☕' }, 1, { love: 6 }),
    A('softjump', '🦘', T('קפיצות רכות', 'Soft bounces', 'قفزات ناعمة', 'Мягкие прыжки', 'Saltos blanditos'), 'runner', { me: '🐱', good: ['🍬', '⭐', '🍭'], bad: ['🔥'], road: 'rgba(255,255,255,.4)' }, 1, { chill: -6 }),
    A('haircut', '✂️', T('תספורת צמר גפן', 'Cotton-fluff haircut', 'قصّة غزل البنات', 'Стрижка из сахарной ваты', 'Corte de algodón'), 'timing', { icon: '✂️', rounds: 5 }, 2),
    A('candyhunt', '🍬', T('ציד ממתקים', 'Candy hunt', 'صيد الحلوى', 'Охота за конфетами', 'Caza de caramelos'), 'whack', { good: ['🍬', '🍭', '🍩'], bad: ['🌶️'] }, 2),
    A('igloo', '🧊', T('בניית איגלו קרח', 'Ice igloo building', 'بناء بيت جليدي', 'Ледяное иглу', 'Construir un iglú'), 'stack', { top: '🧊', floors: 9 }, 3, { chill: 12 }),
    A('rainbowpaint', '🌈', T('צביעת קשת', 'Rainbow painting', 'تلوين قوس قزح', 'Раскрась радугу', 'Pintar el arcoíris'), 'simon', { pads: ['🔴', '🟡', '🟢', '🔵'], rounds: 6 }, 3),
    A('donuts', '🍩', T('קישוט דונאטס', 'Donut decorating', 'تزيين الدونات', 'Украшение пончиков', 'Decorar dónuts'), 'memory', { cards: ['🍩', '🧁', '🍪', '🍬', '🍭', '🍫'] }, 4),
    A('freezeray', '❄️', T('קרן הקיפאון', 'Freeze-ray aim', 'شعاع التجميد', 'Ледяной луч', 'Rayo congelador'), 'aim', { target: '🔥', ball: '🧊', bgstyle: 'background:linear-gradient(#ffd6e8,#ffb0d9)' }, 5, { chill: 10 }),
    A('parade', '🎠', T('מצעד הממתקים', 'Candy parade', 'موكب الحلوى', 'Парад сладостей', 'Desfile de dulces'), 'runner', { me: '🐱', good: ['🍬', '🍭', '🧁', '⭐'], bad: ['🔥', '☀️'], time: 30, road: 'rgba(255,255,255,.45)' }, 6, { chill: -8 })
  ],
  foods: ['icecube', 'icecream', 'hotchoc', 'candy', 'donut', 'cupcake', 'marshmallow'],
  items: ['shades', 'scarf', 'bow', 'crown', 'bell', 'parasol', 'rainbow', 'balloons', 'sparkles'],
  story: [
    S(T('השמש חזקה! הגנו על חתול מרשמלו כדי שלא יימס.', 'The sun is strong! Shield Marshmallow Cat so he does not melt.', 'الشمس قوية! احمِ قط المارشميلو كي لا يذوب.', 'Солнце печёт! Защити кота, чтобы он не растаял.', '¡El sol aprieta! Protege al gato para que no se derrita.'), 'actid', 'shade', 2, { c: 30, x: 25 }),
    S(T('שוקו חם להפסקה — אבל לא יותר מדי!', 'Hot chocolate for a break — but not too much!', 'شوكولاتة ساخنة للراحة — لكن ليس كثيرًا!', 'Горячий шоколад для перерыва — но не слишком много!', 'Chocolate caliente para descansar, ¡pero no demasiado!'), 'actid', 'choco', 2, { c: 35, x: 30 }),
    S(T('קפיצות רכות בין הענני סוכר.', 'Soft bounces between the sugar clouds.', 'قفزات ناعمة بين غيوم السكر.', 'Мягкие прыжки между сахарными облаками.', 'Saltos blanditos entre las nubes de azúcar.'), 'actid', 'softjump', 3, { c: 40, x: 30 }),
    S(T('תספורת צמר גפן — זהירות עם המספריים!', 'A cotton-fluff haircut — careful with the scissors!', 'قصة غزل البنات — احذر من المقص!', 'Стрижка из сахарной ваты — аккуратно с ножницами!', 'Corte de algodón: ¡cuidado con las tijeras!'), 'actid', 'haircut', 2, { c: 50, x: 40 }),
    S(T('הגיעו לרמה 3 — העולם המתוק נפתח.', 'Reach level 3 — the sweet world opens up.', 'صلْ إلى المستوى 3 — العالم الحلو ينفتح.', 'Достигни 3 уровня — сладкий мир открывается.', 'Llega al nivel 3: el mundo dulce se abre.'), 'lv', null, 3, { c: 60, x: 20 }),
    S(T('ציד ממתקים מסביב לעיר הסוכר.', 'A candy hunt around Sugar Town.', 'صيد الحلوى حول مدينة السكر.', 'Охота за конфетами в Сахарном городе.', 'Caza de caramelos por la Ciudad Azúcar.'), 'actid', 'candyhunt', 3, { c: 55, x: 45 }),
    S(T('בנו איגלו קרח כדי להתקרר.', 'Build an ice igloo to cool down.', 'ابنِ بيتًا جليديًا لتبرد.', 'Построй ледяное иглу, чтобы охладиться.', 'Construye un iglú para refrescarte.'), 'actid', 'igloo', 2, { c: 60, x: 45 }),
    S(T('מצעד הממתקים! הגיעו לרמה 6 והובילו את המצעד.', 'The Candy Parade! Reach level 6 and lead the parade.', 'موكب الحلوى! صلْ إلى المستوى 6 وقُد الموكب.', 'Парад сладостей! Достигни 6 уровня и веди парад.', '¡El Desfile de Dulces! Llega al nivel 6 y lidera el desfile.'), 'actid', 'parade', 1, { c: 150, x: 100, i: 'rainbow' })
  ],
  quotes: [
    T('מיאו־מלו! קצת חם פה...', 'Mew-mallow! It is a bit warm here...', 'مياو-مالو! الجو حار قليلًا هنا...', 'Мяу-мэллоу! Тут немного жарко...', '¡Miau-malvavisco! Aquí hace algo de calor...'),
    T('אני רך כמו ענן!', 'I am soft as a cloud!', 'أنا ناعم كالسحابة!', 'Я мягкий, как облако!', '¡Soy suave como una nube!'),
    T('שוקו חם? כן בבקשה!', 'Hot chocolate? Yes please!', 'شوكولاتة ساخنة؟ نعم من فضلك!', 'Горячий шоколад? Да, пожалуйста!', '¿Chocolate caliente? ¡Sí, por favor!'),
    T('אל תתקרבו עם הגפרור!', 'Keep the matches away!', 'أبعدوا أعواد الثقاب!', 'Уберите спички подальше!', '¡Lejos las cerillas!'),
    T('מרשמלו אחד, חתול אחד, המון אהבה.', 'One marshmallow, one cat, lots of love.', 'مارشميلو واحد، قط واحد، الكثير من الحب.', 'Один маршмеллоу, один кот, много любви.', 'Un malvavisco, un gato y mucho cariño.')
  ],
  sleep: T('מתכרבל על ענן סוכר... לילה טוב 🍬', 'Curling up on a sugar cloud... good night 🍬', 'يتكوّر على سحابة سكر... ليلة سعيدة 🍬', 'Свернулся на сахарном облаке... спокойной ночи 🍬', 'Se acurruca en una nube de azúcar... buenas noches 🍬')
};

/* ===== 7. Mishmish — the chubby happy dog ===== */
WORLDS.mish = {
  id: 'mish', e: '🐶', col: '#d97706', art: 'mish', kind: 'pet',
  n: T('מישמיש', 'Mishmish', 'ميشميش', 'Мишмиш', 'Mishmish'),
  desc: T('כלבה שמנמנה ושמחה שמחכה ליד הדלת עם הרצועה בפה', 'A chubby, joyful dog waiting by the door with the leash in her mouth', 'كلبة ممتلئة ومرحة تنتظر عند الباب والمقود في فمها', 'Пухленькая весёлая собачка ждёт у двери с поводком в зубах', 'Una perrita regordeta y feliz que espera en la puerta con la correa en la boca'),
  stats: PET_STATS, care: ['feed', 'wash', 'sleep', 'cuddle'],
  wash: { g: 'scrub', cfg: { base: '🐶', dirt: '#9a7b5a' } },
  scene: { bg: 'linear-gradient(180deg,#a9ddff 0%,#e6f7ff 44%,#79c957 45%,#55ac3a 100%)', deco: [['🌳', 11, 27, 72], ['⛲', 87, 44, 58], ['🌼', 70, 66, 26], ['🌳', 91, 16, 54], ['🐿️', 20, 64, 26]] },
  acts: [
    A('bigwalk', '🚶', T('הטיול הגדול', 'The Big Walk', 'النزهة الكبيرة', 'Большая прогулка', 'El gran paseo'), 'runner', { me: '🐕', good: ['🪙', '🦋', '🌼'], bad: ['🪨', '🕳️'], time: 30, road: 'rgba(210,180,140,.55)' }, 1, {}, { cost: 9 }),
    A('frisbee', '🥏', T('תופסת צלחת מעופפת', 'Frisbee catch', 'التقاط القرص الطائر', 'Ловим фрисби', 'Atrapa el frisbee'), 'timing', { icon: '🥏', rounds: 5 }, 1),
    A('belly', '🫶', T('עיסוי בטן וסירוק', 'Belly rub & brushing', 'تدليك البطن والتمشيط', 'Почесать пузико и расчесать', 'Masaje de barriga y cepillado'), 'scrub', { base: '🐶', dirt: '#a1887f', secs: 15 }, 1, { love: 10 }),
    A('leash', '🪢', T('המלחמה ברצועה', 'Leash tug-of-war', 'شدّ المقود', 'Перетягивание поводка', 'Tira y afloja con la correa'), 'tug', { foe: '🐶', icon: '🧑' }, 1),
    A('sniff', '🌸', T('הרחת פרחים', 'Flower sniffing', 'شمّ الزهور', 'Нюхаем цветы', 'Oler flores'), 'memory', { cards: ['🌼', '🌷', '🌹', '🌻', '🌺', '🪻'] }, 2),
    A('butterfly', '🦋', T('מרדף פרפרים', 'Butterfly chase', 'مطاردة الفراشات', 'Погоня за бабочками', 'Perseguir mariposas'), 'whack', { good: ['🦋'], bad: ['🐝'] }, 2),
    A('fountain', '⛲', T('התיזה במזרקה', 'Fountain splash', 'الرش في النافورة', 'Брызги у фонтана', 'Chapoteo en la fuente'), 'catch', { good: ['💦', '🫧'], bad: ['🪨'], me: '🐶' }, 3),
    A('fetch', '🦴', T('הבאת עצם', 'Fetch the bone', 'جلب العظمة', 'Принеси косточку', 'Trae el hueso'), 'aim', { target: '🐶', ball: '🦴', bgstyle: 'background:linear-gradient(#bde8ff,#79c957)' }, 3),
    A('tricks', '🐾', T('תרגילי ציות', 'Obedience tricks', 'تمارين الطاعة', 'Команды и трюки', 'Trucos de obediencia'), 'simon', { pads: ['🦴', '🐾', '🥎', '🥏'], rounds: 6 }, 4),
    A('golden', '🏆', T('גינת הכלבים המוזהבת', 'The Golden Dog Park', 'حديقة الكلاب الذهبية', 'Золотой собачий парк', 'El Parque Dorado'), 'runner', { me: '🐕', good: ['🪙', '🦴', '🌼', '⭐'], bad: ['🪨', '🕳️'], time: 34, road: 'rgba(255,215,0,.35)' }, 6, {}, { cost: 10 })
  ],
  foods: ['bone', 'meatveg', 'dogice', 'carrot', 'apple', 'cookie', 'water'],
  items: ['bell', 'bow', 'scarf', 'strawhat', 'shades', 'backpack', 'flower', 'ball', 'medal'],
  story: [
    S(T('היום מתחילים סיירת טיולים! הטיול הגדול הראשון בפארק.', 'Today the Neighborhood Walking Patrol begins! The first Big Walk in the park.', 'اليوم تبدأ دورية النزهات! أول نزهة كبيرة في الحديقة.', 'Сегодня начинается Прогулочный патруль! Первая большая прогулка в парке.', '¡Hoy empieza la Patrulla de Paseos! El primer gran paseo por el parque.'), 'actid', 'bigwalk', 2, { c: 30, x: 25 }),
    S(T('משחקי פריזבי עם הילדים בדשא.', 'Frisbee games with the kids on the lawn.', 'ألعاب القرص الطائر مع الأطفال على العشب.', 'Игры с фрисби с детьми на лужайке.', 'Partidas de frisbee con los niños en el césped.'), 'actid', 'frisbee', 2, { c: 35, x: 30 }),
    S(T('טיול עושה רעב — האכילו אותה פעמיים.', 'Walks make her hungry — feed her twice.', 'النزهات تفتح الشهية — أطعمها مرتين.', 'После прогулки аппетит — накорми её дважды.', 'Los paseos dan hambre: aliméntala dos veces.'), 'feed', null, 2, { c: 30, x: 25 }),
    S(T('עיסוי בטן וסירוק אחרי הטיול.', 'Belly rub and brushing after the walk.', 'تدليك البطن والتمشيط بعد النزهة.', 'Почесать пузико и расчесать после прогулки.', 'Masaje de barriga y cepillado tras el paseo.'), 'actid', 'belly', 2, { c: 45, x: 35 }),
    S(T('הגיעו לרמה 3 — שבילים חדשים בפארק!', 'Reach level 3 — new trails in the park!', 'صلْ إلى المستوى 3 — مسارات جديدة في الحديقة!', 'Достигни 3 уровня — новые тропы в парке!', 'Llega al nivel 3: ¡nuevos senderos en el parque!'), 'lv', null, 3, { c: 60, x: 20 }),
    S(T('מלחמת רצועה ידידותית — מי חזק יותר?', 'A friendly leash tug-of-war — who is stronger?', 'شدّ مقود ودّي — من الأقوى؟', 'Дружеское перетягивание поводка — кто сильнее?', 'Un tira y afloja amistoso: ¿quién es más fuerte?'), 'actid', 'leash', 3, { c: 55, x: 45 }),
    S(T('תרגילי ציות כדי להצטרף לסיירת הרשמית.', 'Obedience tricks to join the official patrol.', 'تمارين الطاعة للانضمام إلى الدورية الرسمية.', 'Команды и трюки, чтобы вступить в патруль.', 'Trucos de obediencia para unirse a la patrulla oficial.'), 'actid', 'tricks', 2, { c: 60, x: 45 }),
    S(T('גינת הכלבים המוזהבת! הגיעו לרמה 6 וסיימו את המסלול.', 'The Golden Dog Park! Reach level 6 and finish the trail.', 'حديقة الكلاب الذهبية! صلْ إلى المستوى 6 وأنهِ المسار.', 'Золотой собачий парк! Достигни 6 уровня и пройди тропу.', '¡El Parque Dorado! Llega al nivel 6 y completa el sendero.'), 'actid', 'golden', 1, { c: 150, x: 100, i: 'medal' })
  ],
  quotes: [
    T('אב־אב! הרצועה כבר בפה!', 'Woof woof! The leash is already in my mouth!', 'هاو هاو! المقود في فمي بالفعل!', 'Гав-гав! Поводок уже в зубах!', '¡Guau guau! ¡Ya tengo la correa en la boca!'),
    T('מישהו אמר טיול?', 'Did somebody say walk?', 'هل قال أحدهم نزهة؟', 'Кто-то сказал «гулять»?', '¿Alguien dijo paseo?'),
    T('הפרפר הזה חייב להיות שלי!', 'That butterfly has to be mine!', 'هذه الفراشة يجب أن تكون لي!', 'Эта бабочка должна быть моей!', '¡Esa mariposa tiene que ser mía!'),
    T('בטן, בטן, בטן — בבקשה!', 'Belly, belly, belly — please!', 'البطن، البطن، البطن — من فضلك!', 'Пузико, пузико — пожалуйста!', 'Barriguita, barriguita, ¡por favor!'),
    T('גינת הכלבים המוזהבת, אני באה!', 'Golden Dog Park, here I come!', 'حديقة الكلاب الذهبية، أنا قادمة!', 'Золотой собачий парк, я иду!', '¡Parque Dorado, allá voy!')
  ],
  sleep: T('מתפלשת על הספה... לילה טוב 🐾', 'Flopping onto the couch... good night 🐾', 'ترتمي على الأريكة... ليلة سعيدة 🐾', 'Плюхается на диван... спокойной ночи 🐾', 'Se tumba en el sofá... buenas noches 🐾')
};
