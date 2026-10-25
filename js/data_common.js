'use strict';
/* ---------- shared catalogs & helpers ---------- */
const WORLDS = {};
const FOODS = {}, ITEMS = {};
const F = (id, e, n, c, fx, lv) => { FOODS[id] = { id, e, n, c, fx, lv: lv || 1 }; };
const I = (id, e, n, slot, c, lv) => { ITEMS[id] = { id, e, n, slot, c, lv: lv || 1 }; };
/* activity: id, emoji, name, game, cfg, level, fx, extra */
const A = (id, e, n, g, cfg, lv, fx, extra) => Object.assign({ id, e, n, g, cfg: cfg || {}, lv: lv || 1, cost: 7, fx: fx || {} }, extra || {});
/* story chapter: text, need kind, activity id, count, reward, (english quote) */
const S = (d, k, a, n, r, q) => ({ d, k, a, n, r: r || { c: 40, x: 30 }, q });

const STATMETA = {
  hunger: { e: '🍽️', k: 's_hunger', col: '#f59e0b', dec: .55 },
  fun: { e: '🎈', k: 's_fun', col: '#ec4899', dec: .5 },
  energy: { e: '⚡', k: 's_energy', col: '#22c55e', dec: .28 },
  clean: { e: '🛁', k: 's_clean', col: '#38bdf8', dec: .35 },
  love: { e: '💗', k: 's_love', col: '#f43f5e', dec: .25 },
  chill: { e: '❄️', k: 's_chill', col: '#06b6d4', dec: 1.0 },
  fit: { e: '💪', k: 's_fit', col: '#8b5cf6', dec: .16 },
  focus: { e: '📚', k: 's_focus', col: '#6366f1', dec: .22 },
  mood: { e: '😊', k: 's_mood', col: '#ec4899', dec: .35 },
  fame: { e: '🌟', k: 's_fame', col: '#eab308', dec: 0 }
};

/* ===== FOODS ===== */
F('apple', '🍎', T('תפוח', 'Apple', 'تفاحة', 'Яблоко', 'Manzana'), 5, { hunger: 12, energy: 3 });
F('banana', '🍌', T('בננה', 'Banana', 'موزة', 'Банан', 'Plátano'), 6, { hunger: 14, energy: 5 });
F('carrot', '🥕', T('גזר', 'Carrot', 'جزرة', 'Морковь', 'Zanahoria'), 5, { hunger: 12, clean: 2 });
F('cookie', '🍪', T('עוגייה', 'Cookie', 'بسكويت', 'Печенье', 'Galleta'), 8, { hunger: 10, fun: 6 });
F('cake', '🍰', T('עוגה', 'Cake', 'كعكة', 'Торт', 'Tarta'), 18, { hunger: 22, fun: 12, love: 4 }, 3);
F('icecream', '🍦', T('גלידה', 'Ice cream', 'بوظة', 'Мороженое', 'Helado'), 14, { hunger: 12, fun: 12, chill: 18 }, 2);
F('pizza', '🍕', T('פיצה', 'Pizza', 'بيتزا', 'Пицца', 'Pizza'), 16, { hunger: 30, fun: 6 }, 2);
F('burger', '🍔', T('המבורגר', 'Burger', 'برغر', 'Бургер', 'Hamburguesa'), 18, { hunger: 32, energy: 4 }, 3);
F('hotdog', '🌭', T('נקניקייה בלחמניה', 'Hot dog', 'هوت دوغ', 'Хот-дог', 'Perrito caliente'), 12, { hunger: 24 });
F('milk', '🥛', T('חלב', 'Milk', 'حليب', 'Молоко', 'Leche'), 6, { hunger: 8, energy: 8 });
F('juice', '🧃', T('מיץ', 'Juice', 'عصير', 'Сок', 'Zumo'), 7, { hunger: 8, fun: 5, energy: 3 });
F('salad', '🥗', T('סלט', 'Salad', 'سلطة', 'Салат', 'Ensalada'), 10, { hunger: 20, clean: 2 }, 2);
F('soup', '🍲', T('מרק', 'Soup', 'شوربة', 'Суп', 'Sopa'), 12, { hunger: 26, energy: 4 }, 2);
F('fish', '🐟', T('דג', 'Fish', 'سمك', 'Рыба', 'Pescado'), 14, { hunger: 28, love: 3 }, 2);
F('sushi', '🍣', T('סושי', 'Sushi', 'سوشي', 'Суши', 'Sushi'), 20, { hunger: 30, fun: 6 }, 4);
F('chocolate', '🍫', T('שוקולד', 'Chocolate', 'شوكولاتة', 'Шоколад', 'Chocolate'), 9, { hunger: 10, fun: 8, energy: 6 });
F('hotchoc', '☕', T('שוקו חם', 'Hot chocolate', 'شوكولاتة ساخنة', 'Горячий шоколад', 'Chocolate caliente'), 10, { hunger: 10, love: 8, fun: 5, chill: -10 });
F('popcorn', '🍿', T('פופקורן', 'Popcorn', 'فشار', 'Попкорн', 'Palomitas'), 8, { hunger: 12, fun: 8 });
F('donut', '🍩', T('דונאט', 'Donut', 'دونات', 'Пончик', 'Dónut'), 10, { hunger: 12, fun: 10 }, 2);
F('pretzel', '🥨', T('בייגלה', 'Pretzel', 'كعك مملح', 'Крендель', 'Pretzel'), 7, { hunger: 14, energy: 4 });
F('pasta', '🍝', T('פסטה', 'Pasta', 'معكرونة', 'Паста', 'Pasta'), 16, { hunger: 30, energy: 6 }, 2);
F('corn', '🌽', T('תירס', 'Corn', 'ذرة', 'Кукуруза', 'Maíz'), 6, { hunger: 14 });
F('grain', '🌾', T('גרגרי חיטה', 'Wheat grains', 'حبوب القمح', 'Пшеничные зёрна', 'Granos de trigo'), 5, { hunger: 14, energy: 4 });
F('worm', '🪱', T('תולעת טעימה', 'Tasty worm', 'دودة لذيذة', 'Вкусный червячок', 'Gusanito rico'), 9, { hunger: 18, fun: 6 }, 2);
F('watermelon', '🍉', T('אבטיח', 'Watermelon', 'بطيخ', 'Арбуз', 'Sandía'), 10, { hunger: 16, chill: 10 });
F('strawberry', '🍓', T('תות', 'Strawberry', 'فراولة', 'Клубника', 'Fresa'), 8, { hunger: 12, fun: 4 });
F('grapes', '🍇', T('ענבים', 'Grapes', 'عنب', 'Виноград', 'Uvas'), 8, { hunger: 12, energy: 3 });
F('candy', '🍬', T('סוכריה', 'Candy', 'حلوى', 'Конфета', 'Caramelo'), 6, { hunger: 6, fun: 9 });
F('lollipop', '🍭', T('סוכרייה על מקל', 'Lollipop', 'مصاصة', 'Леденец', 'Piruleta'), 7, { hunger: 6, fun: 10 });
F('cottoncandy', '🍥', T('צמר גפן מתוק', 'Cotton candy', 'غزل البنات', 'Сладкая вата', 'Algodón de azúcar'), 12, { hunger: 12, fun: 14 }, 2);
F('marshmallow', '🍡', T('שיפוד מרשמלו', 'Marshmallow skewer', 'مارشميلو', 'Маршмеллоу', 'Pincho de nube'), 10, { hunger: 14, love: 5 });
F('cupcake', '🧁', T('קאפקייק', 'Cupcake', 'كب كيك', 'Капкейк', 'Cupcake'), 12, { hunger: 16, fun: 8 }, 2);
F('icecube', '🧊', T('קוביית קרח', 'Ice cube', 'مكعب ثلج', 'Кубик льда', 'Cubito de hielo'), 4, { hunger: 2, chill: 30 });
F('cheese', '🧀', T('גבינה', 'Cheese', 'جبنة', 'Сыр', 'Queso'), 9, { hunger: 15, energy: 3 });
F('croissant', '🥐', T('קרואסון', 'Croissant', 'كرواسان', 'Круассан', 'Cruasán'), 9, { hunger: 16, fun: 4 });
F('sandwich', '🥪', T('כריך', 'Sandwich', 'ساندويتش', 'Бутерброд', 'Sándwich'), 12, { hunger: 24, energy: 4 });
F('coffee', '☕', T('קפה', 'Coffee', 'قهوة', 'Кофе', 'Café'), 8, { energy: 14, hunger: 2 });
F('steak', '🥩', T('סטייק', 'Steak', 'ستيك', 'Стейк', 'Filete'), 22, { hunger: 36, energy: 6 }, 3);
F('rice', '🍚', T('אורז', 'Rice', 'أرز', 'Рис', 'Arroz'), 10, { hunger: 22, energy: 5 });
F('pancakes', '🥞', T('פנקייק', 'Pancakes', 'بان كيك', 'Блины', 'Tortitas'), 13, { hunger: 24, fun: 5 });
F('water', '💧', T('מים', 'Water', 'ماء', 'Вода', 'Agua'), 3, { hunger: 2, energy: 4, clean: 2 });
F('sports', '🥤', T('משקה ספורט', 'Sports drink', 'مشروب رياضي', 'Спортивный напиток', 'Bebida deportiva'), 8, { energy: 14, hunger: 4 });
F('eggs', '🍳', T('ביצים', 'Eggs', 'بيض', 'Яйца', 'Huevos'), 10, { hunger: 20, energy: 5, fit: 3 });
F('seeds', '🌻', T('גרעינים', 'Sunflower seeds', 'بذور دوار الشمس', 'Семечки', 'Pipas'), 5, { hunger: 10, fun: 5 });
F('falafel', '🧆', T('פלאפל', 'Falafel', 'فلافل', 'Фалафель', 'Falafel'), 12, { hunger: 26 }, 2);
F('shawarma', '🥙', T('שווארמה בפיתה', 'Shawarma pita', 'شاورما', 'Шаурма', 'Shawarma'), 16, { hunger: 32, energy: 4 }, 3);
F('soda', '🥤', T('שתייה קלה', 'Soda', 'مشروب غازي', 'Лимонад', 'Refresco'), 6, { hunger: 4, fun: 6, energy: 5 });
F('bone', '🦴', T('חטיף עצם פריכה', 'Crunchy bone treat', 'عظمة مقرمشة', 'Хрустящая косточка', 'Hueso crujiente'), 8, { hunger: 14, fun: 6 });
F('meatveg', '🍖', T('קערת בשר וירקות', 'Meat & veggie bowl', 'وعاء لحم وخضار', 'Миска мяса с овощами', 'Cuenco de carne y verduras'), 16, { hunger: 34, energy: 6 }, 2);
F('dogice', '🍨', T('גלידת כלבים', 'Doggy ice cream', 'بوظة للكلاب', 'Собачье мороженое', 'Helado para perros'), 12, { hunger: 10, fun: 12, chill: 15 });
F('schnitzel', '🍗', T('שניצל', 'Schnitzel', 'شنيتسل', 'Шницель', 'Escalope'), 16, { hunger: 30, love: 3 });
F('eucalyptus', '🌿', T('עלי אקליפטוס', 'Eucalyptus leaves', 'أوراق الأوكالبتوس', 'Листья эвкалипта', 'Hojas de eucalipto'), 8, { hunger: 16, clean: 3, love: 2 });
F('mango', '🥭', T('שייק מנגו', 'Mango shake', 'شيك المانجو', 'Манго-шейк', 'Batido de mango'), 12, { hunger: 14, fun: 8, chill: 6 });
F('coconut', '🥥', T('שייק קוקוס', 'Coconut shake', 'شيك جوز الهند', 'Кокосовый шейк', 'Batido de coco'), 12, { hunger: 14, fun: 8, chill: 6 });
F('berry', '🫐', T('שייק פירות יער', 'Berry shake', 'شيك التوت', 'Ягодный шейк', 'Batido de frutos rojos'), 12, { hunger: 14, fun: 8, chill: 6 });
F('kiwi', '🥝', T('שייק קיווי', 'Kiwi shake', 'شيك الكيوي', 'Киви-шейк', 'Batido de kiwi'), 12, { hunger: 14, fun: 8, chill: 6 });
F('cheesecake', '🍰', T('עוגת גבינה', 'Cheesecake', 'تشيز كيك', 'Чизкейк', 'Tarta de queso'), 20, { hunger: 24, fun: 12, love: 4 }, 3);
/* Hugsy / Joey world (VIP) */
F('special', '🍕', 'The Joey Special 🍕🍕', 22, { hunger: 52, fun: 10, love: 5 });
F('moist', '🥪', 'The Moist Maker', 30, { hunger: 36, fun: 8, energy: 6 }, 2);
F('flakes', '🥣', 'Hugsy Flakes', 14, { hunger: 26, energy: 10 });
F('lasagna', '🍝', T('הלזניה של מוניקה', "Monica's lasagna", 'لازانيا مونيكا', 'Лазанья Моники', 'La lasaña de Monica'), 24, { hunger: 40, love: 6 }, 3);
F('turkey', '🦃', T('תרנגול הודו של חג ההודיה', 'Thanksgiving turkey', 'ديك رومي عيد الشكر', 'Индейка на День благодарения', 'Pavo de Acción de Gracias'), 34, { hunger: 50, love: 8, fun: 8 }, 5);

/* ===== ITEMS ===== */
I('crown', '👑', T('כתר', 'Crown', 'تاج', 'Корона', 'Corona'), 'head', 120, 4);
I('tophat', '🎩', T('מגבעת', 'Top hat', 'قبعة عالية', 'Цилиндр', 'Sombrero de copa'), 'head', 60, 2);
I('cap', '🧢', T('כובע מצחייה', 'Cap', 'قبعة كاب', 'Кепка', 'Gorra'), 'head', 30, 1);
I('strawhat', '👒', T('כובע קש', 'Straw hat', 'قبعة قش', 'Соломенная шляпа', 'Sombrero de paja'), 'head', 40, 1);
I('cowboy', '🤠', T('כובע בוקרים', 'Cowboy hat', 'قبعة راعي البقر', 'Ковбойская шляпа', 'Sombrero vaquero'), 'head', 70, 3);
I('helmet', '⛑️', T('קסדת עבודה', 'Hard hat', 'خوذة عمل', 'Каска', 'Casco de obra'), 'head', 50, 2);
I('armyhelm', '🪖', T('קסדה', 'Helmet', 'خوذة', 'Шлем', 'Casco'), 'head', 50, 2);
I('bow', '🎀', T('סרט לשיער', 'Hair bow', 'شريطة شعر', 'Бантик', 'Lazo'), 'head', 25, 1);
I('flower', '🌸', T('פרח בשיער', 'Hair flower', 'وردة في الشعر', 'Цветок в волосах', 'Flor en el pelo'), 'head', 20, 1);
I('headphones', '🎧', T('אוזניות', 'Headphones', 'سماعات', 'Наушники', 'Auriculares'), 'head', 60, 3);
I('grad', '🎓', T('כובע בוגרים', 'Graduation cap', 'قبعة التخرج', 'Шапочка выпускника', 'Birrete'), 'head', 90, 5);
I('shades', '🕶️', T('משקפי שמש', 'Sunglasses', 'نظارات شمسية', 'Солнечные очки', 'Gafas de sol'), 'face', 40, 1);
I('glasses', '👓', T('משקפיים', 'Glasses', 'نظارات', 'Очки', 'Gafas'), 'face', 30, 1);
I('mask', '🎭', T('מסכה', 'Mask', 'قناع', 'Маска', 'Máscara'), 'face', 45, 2);
I('scarf', '🧣', T('צעיף', 'Scarf', 'وشاح', 'Шарф', 'Bufanda'), 'neck', 30, 1);
I('bowtie', '🎀', T('פפיון', 'Bow tie', 'ربطة فراشة', 'Бабочка', 'Pajarita'), 'neck', 25, 1);
I('pearls', '📿', T('חרוזים', 'Pearls', 'لآلئ', 'Жемчуг', 'Perlas'), 'neck', 55, 2);
I('medal', '🏅', T('מדליה', 'Medal', 'ميدالية', 'Медаль', 'Medalla'), 'neck', 70, 3);
I('stetho', '🩺', T('סטטוסקופ', 'Stethoscope', 'سماعة طبيب', 'Стетоскоп', 'Estetoscopio'), 'neck', 65, 3);
I('camera', '📸', T('מצלמה', 'Camera', 'كاميرا', 'Фотоаппарат', 'Cámara'), 'neck', 60, 3);
I('bell', '🔔', T('פעמון', 'Bell', 'جرس', 'Колокольчик', 'Cascabel'), 'neck', 20, 1);
I('gem', '💎', T('שרשרת יהלום', 'Diamond necklace', 'قلادة ألماس', 'Алмазное колье', 'Collar de diamantes'), 'neck', 110, 5);
I('tie', '👔', T('עניבה', 'Tie', 'ربطة عنق', 'Галстук', 'Corbata'), 'neck', 40, 2);
I('labcoat', '🥼', T('חלוק רופא', 'Doctor coat', 'معطف طبيب', 'Докторский халат', 'Bata de médico'), 'body', 80, 4);
I('vest', '🦺', T('אפוד זוהר', 'Safety vest', 'سترة عاكسة', 'Сигнальный жилет', 'Chaleco reflectante'), 'body', 45, 2);
I('coat', '🧥', T('מעיל', 'Coat', 'معطف', 'Пальто', 'Abrigo'), 'body', 60, 3);
I('tee', '👕', T('חולצה', 'T-shirt', 'قميص', 'Футболка', 'Camiseta'), 'body', 30, 1);
I('dress', '👗', T('שמלה', 'Dress', 'فستان', 'Платье', 'Vestido'), 'body', 70, 3);
I('backpack', '🎒', T('תיק גב', 'Backpack', 'حقيبة ظهر', 'Рюкзак', 'Mochila'), 'body', 45, 2);
I('guitar', '🎸', T('גיטרה', 'Guitar', 'غيتار', 'Гитара', 'Guitarra'), 'body', 75, 4);
I('drum', '🥁', T('תוף', 'Drum', 'طبل', 'Барабан', 'Tambor'), 'body', 60, 3);
I('trophy', '🏆', T('גביע', 'Trophy', 'كأس', 'Кубок', 'Trofeo'), 'body', 95, 5);
I('pumpkin', '🎃', T('דלעת', 'Pumpkin', 'يقطينة', 'Тыква', 'Calabaza'), 'body', 35, 1);
I('hbox', '📦', 'Hugsy Flakes box', 'body', 80, 2);
I('plant', '🪴', T('עציץ', 'Plant', 'نبتة', 'Растение', 'Planta'), 'bg', 30, 1);
I('picture', '🖼️', T('תמונה', 'Painting', 'لوحة', 'Картина', 'Cuadro'), 'bg', 35, 1);
I('balloons', '🎈', T('בלונים', 'Balloons', 'بالونات', 'Воздушные шары', 'Globos'), 'bg', 25, 1);
I('rainbow', '🌈', T('קשת', 'Rainbow', 'قوس قزح', 'Радуга', 'Arcoíris'), 'bg', 80, 3);
I('sparkles', '✨', T('נצנוצים', 'Sparkles', 'لمعان', 'Блёстки', 'Destellos'), 'bg', 50, 2);
I('mirror', '🪞', T('מראה', 'Mirror', 'مرآة', 'Зеркало', 'Espejo'), 'bg', 60, 2);
I('bouquet', '💐', T('זר פרחים', 'Bouquet', 'باقة ورد', 'Букет', 'Ramo'), 'bg', 35, 1);
I('candle', '🕯️', T('נר', 'Candle', 'شمعة', 'Свеча', 'Vela'), 'bg', 25, 1);
I('bats', '🦇', T('עטלפים', 'Bats', 'خفافيش', 'Летучие мыши', 'Murciélagos'), 'bg', 40, 2);
I('flag', '🚩', T('דגל', 'Flag', 'علم', 'Флаг', 'Bandera'), 'bg', 20, 1);
I('ball', '⚽', T('כדור', 'Ball', 'كرة', 'Мяч', 'Balón'), 'bg', 30, 1);
I('fountain', '⛲', T('מזרקה', 'Fountain', 'نافورة', 'Фонтан', 'Fuente'), 'bg', 90, 4);
I('kite', '🪁', T('עפיפון', 'Kite', 'طائرة ورقية', 'Воздушный змей', 'Cometa'), 'bg', 30, 1);
I('parasol', '⛱️', T('שמשייה', 'Parasol', 'مظلة شمسية', 'Зонтик от солнца', 'Sombrilla'), 'bg', 40, 2);
I('crane', '🏗️', T('מנוף קטן', 'Little crane', 'رافعة صغيرة', 'Маленький кран', 'Grúa pequeña'), 'bg', 85, 4);
I('lamp', '💡', T('מנורה', 'Lamp', 'مصباح', 'Лампа', 'Lámpara'), 'bg', 30, 1);
I('tent', '⛺', T('אוהל', 'Tent', 'خيمة', 'Палатка', 'Tienda'), 'bg', 45, 2);
I('tennisball', '🎾', T('כדור טניס', 'Tennis ball', 'كرة تنس', 'Теннисный мяч', 'Pelota de tenis'), 'bg', 30, 1);
I('hoop', '🏀', T('כדורסל', 'Basketball', 'كرة سلة', 'Баскетбольный мяч', 'Balón de baloncesto'), 'bg', 30, 1);
I('poster', '🖼️', 'Hugsy poster', 'bg', 40, 1);
I('neon', '🐧', 'Hugsy neon', 'bg', 70, 3);
I('hoplant', '🌴', T('דקל', 'Palm tree', 'نخلة', 'Пальма', 'Palmera'), 'bg', 50, 2);

/* ===== Joey + friends quotes (always English, VIP only) ===== */
const JOEY = {
  greet: ["How you doin'?", 'Hugsy, my main man!', 'Ready for a big day, buddy?'],
  eat: ["Joey doesn't share food! ...okay, a little.", 'Mmm! Now THAT is what I am talking about!', 'The Joey Special, buddy. Two pizzas!', 'Could this BE any more delicious?'],
  gym: ['Come on, Hugsy! One more!', 'Feel the burn, pal!', "Penguins don't quit!"],
  photo: ['Work it, Hugsy! The camera loves you!', "How you doin'? Yeah, THAT'S the look!", 'Hold it... hold it...'],
  act: ["That's acting! Real acting!", 'Dr. Hugsy is in the house!', 'Say it like you mean it, pal!'],
  living: ['Best seat in the house, buddy.', "Hugsy, grab the remote!", "It's a moo point."],
  kitchen: ["Joey doesn't share food!", 'Is that the Moist Maker I smell?', 'Pizza time, pizza time!'],
  win: ["YES! That's my guy!", 'Nailed it!', 'Hugsy, you are a STAR!'],
  lose: ['Aw, shake it off, buddy.', 'Even the greats miss sometimes!', 'Next time, pal. Next time!'],
  sleep: ['Sweet dreams, buddy.', "Night, Hugsy. I'll keep the couch warm."],
  cuddle: ['Aww, group hug!', "Who's a good penguin? You are!", 'Hugsy loves hugs!'],
  shop: ["Ooh, fancy! You'd look great in that!"],
  level: ['Whoa! Level up! That is my penguin!'],
  chapter: ['We did it, Hugsy! High five! ...flipper five!'],
  friends: ['The gang is all here!', 'Say hi to everybody, buddy!']
};
const FQ = [
  ['Joey', "How you doin'?"], ['Joey', "Joey doesn't share food!"], ['Joey', 'The Joey Special!'], ['Joey', "It's a moo point."],
  ['Chandler', 'Could this BE any more fun?'], ['Ross', 'PIVOT!'], ['Ross', 'Unagi.'], ['Ross', 'We were on a break!'], ['Ross', 'The Moist Maker!'],
  ['Phoebe', 'Smelly Cat!'], ['Phoebe', 'Regina Phalange!'], ['Monica', 'I KNOW!']
];
