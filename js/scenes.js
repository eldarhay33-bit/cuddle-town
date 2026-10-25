'use strict';
/* ---------- SVG scenery for every world / room (replaces flat emoji backdrops) ---------- */
const SCENES = {};
const SV = (inner, defs) => `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><defs>${defs || ''}</defs>${inner}</svg>`;
const LG = (id, stops, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 || 0}" y2="${y2 == null ? 1 : y2}">${stops.map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const cld = (x, y, s, o) => `<g fill="#fff" opacity="${o || .85}"><circle cx="${x}" cy="${y}" r="${14 * s}"/><circle cx="${x + 16 * s}" cy="${y - 6 * s}" r="${11 * s}"/><circle cx="${x - 16 * s}" cy="${y - 3 * s}" r="${10 * s}"/><circle cx="${x + 30 * s}" cy="${y + 2 * s}" r="${9 * s}"/></g>`;
const rnds = (n, f) => { let s = ''; for (let i = 0; i < n; i++) s += f(i, ((i * 9301 + 49297) % 233280) / 233280, ((i * 7919 + 1313) % 4093) / 4093); const o = new String(s); o.join = () => s; return o; };
const tree = (x, y, s, c1, c2) => `<rect x="${x - 4 * s}" y="${y}" width="${8 * s}" height="${36 * s}" fill="#8d5a2e"/><circle cx="${x}" cy="${y - 4 * s}" r="${26 * s}" fill="${c1 || '#3f9d4a'}"/><circle cx="${x - 12 * s}" cy="${y + 6 * s}" r="${18 * s}" fill="${c2 || '#4cb35a'}"/><circle cx="${x + 12 * s}" cy="${y + 6 * s}" r="${18 * s}" fill="${c2 || '#4cb35a'}"/>`;

SCENES.dubi = () => SV(`
  <rect width="400" height="300" fill="url(#s)"/>
  <rect x="0" y="60" width="400" height="100" fill="url(#st)"/>
  ${[0, 1, 2, 3, 4].map(r => rnds(36, (i, a, b) => `<circle cx="${8 + i * 11 + (r % 2) * 5}" cy="${74 + r * 17 + b * 3}" r="4" fill="${['#16a34a', '#fff', '#16a34a', '#bbf7d0', '#fde047'][(i + r) % 5]}" opacity=".85"/>`)).join('')}
  <rect x="0" y="150" width="400" height="8" fill="#14532d"/>
  ${[30, 370].map(x => `<rect x="${x - 3}" y="10" width="6" height="150" fill="#6b7280"/><rect x="${x - 22}" y="6" width="44" height="16" rx="4" fill="#fef9c3"/>${[0, 1, 2, 3].map(i => `<circle cx="${x - 15 + i * 10}" cy="14" r="3.5" fill="#fff"/>`).join('')}`).join('')}
  <path d="M0 62 Q200 40 400 62" stroke="#16a34a" stroke-width="5" fill="none"/>${rnds(14, (i) => `<path d="M${14 + i * 28} 58 l8 14 l8 -14Z" fill="${i % 2 ? '#fff' : '#16a34a'}"/>`)}
  <rect x="0" y="158" width="400" height="142" fill="url(#p)"/>
  ${rnds(8, i => `<rect x="${i * 50}" y="158" width="25" height="142" fill="#fff" opacity=".05"/>`)}
  <g stroke="#fff" stroke-width="3" fill="none" opacity=".8"><ellipse cx="200" cy="262" rx="70" ry="22"/><path d="M0 220 H400"/><path d="M130 158 V200 H270 V158"/></g>
  <g fill="#fff"><rect x="150" y="150" width="4" height="30"/><rect x="246" y="150" width="4" height="30"/><rect x="150" y="150" width="100" height="4"/></g>`, LG('s', ['#7ec8ff', '#d9f2ff']) + LG('st', ['#334155', '#1e293b']) + LG('p', ['#2fb457', '#157a35']));

SCENES.efro = () => SV(`
  <rect width="400" height="300" fill="url(#s)"/><circle cx="330" cy="50" r="46" fill="#fde68a" opacity=".35"/><circle cx="330" cy="50" r="28" fill="#fbbf24"/>${cld(70, 50, 1.2)}${cld(210, 80, 1)}
  <path d="M0 170 Q100 120 200 160 Q300 190 400 140 V300 H0Z" fill="#a5dc7a"/><path d="M0 200 Q120 160 240 190 Q330 215 400 180 V300 H0Z" fill="#7bc84f"/>
  <rect x="28" y="112" width="84" height="66" fill="#c0392b"/><path d="M20 114 L70 76 L120 114Z" fill="#7f1d1d"/><rect x="52" y="134" width="36" height="44" fill="#fff" stroke="#7f1d1d" stroke-width="3"/><path d="M52 134 L88 178 M88 134 L52 178" stroke="#c0392b" stroke-width="3"/><circle cx="70" cy="104" r="6" fill="#fff"/>
  <rect x="120" y="96" width="22" height="82" fill="#cbd5e1"/><path d="M118 98 Q131 80 144 98Z" fill="#94a3b8"/>
  <g fill="#a16207">${rnds(12, i => `<rect x="${i * 36 - 4}" y="196" width="6" height="30"/>`)}<rect x="0" y="204" width="400" height="5"/><rect x="0" y="216" width="400" height="5"/></g>
  <g fill="#f59e0b"><ellipse cx="340" cy="228" rx="30" ry="20"/><ellipse cx="320" cy="236" rx="22" ry="14" fill="#fbbf24"/></g>
  ${rnds(26, (i, a, b) => `<circle cx="${a * 400}" cy="${240 + b * 54}" r="3.5" fill="${['#f87171', '#fde047', '#fff', '#c084fc'][i % 4]}"/>`)}`, LG('s', ['#bfe9ff', '#eaf8ff']));

SCENES.lemi = () => SV(`
  <rect width="400" height="300" fill="url(#w)"/>${rnds(10, i => `<rect x="${i * 44}" y="0" width="22" height="190" fill="#fff" opacity=".08"/>`)}
  <rect x="0" y="150" width="400" height="14" fill="#f9a8d4"/><rect x="0" y="164" width="400" height="136" fill="url(#f)"/>
  ${rnds(10, i => rnds(4, j => `<path d="M${i * 44 + (j % 2) * 22} ${176 + j * 30} l22 15 l-22 15 l-22 -15Z" fill="${(i + j) % 2 ? '#fff' : '#fbcfe8'}" opacity=".85"/>`)).join('')}
  <g><path d="M30 190 V70 Q30 20 78 20 Q126 20 126 70 V190Z" fill="#fde68a"/><path d="M40 190 V72 Q40 30 78 30 Q116 30 116 72 V190Z" fill="url(#m)"/><path d="M52 170 L72 60 M70 170 L96 50" stroke="#fff" stroke-width="6" opacity=".4"/></g>
  <g><rect x="268" y="150" width="108" height="46" rx="22" fill="#fff" stroke="#e5e7eb" stroke-width="3"/><rect x="278" y="196" width="10" height="12" fill="#f59e0b"/><rect x="356" y="196" width="10" height="12" fill="#f59e0b"/><rect x="368" y="110" width="8" height="40" fill="#cbd5e1"/><circle cx="372" cy="106" r="9" fill="#94a3b8"/>${rnds(10, (i, a, b) => `<circle cx="${280 + a * 90}" cy="${142 + b * 12}" r="${5 + a * 7}" fill="#fff" stroke="#bae6fd" stroke-width="2" opacity=".9"/>`)}</g>
  <g>${[160, 190, 216].map((x, i) => `<rect x="${x}" y="${96 - i * 6}" width="14" height="${50 + i * 6}" rx="4" fill="#fff"/><path d="M${x + 7} ${92 - i * 6} q-3 -10 0 -14 q3 4 0 14" fill="#fbbf24"/>`).join('')}<rect x="150" y="146" width="84" height="8" rx="3" fill="#d97706"/></g>
  <g fill="#34d399">${rnds(5, i => `<path d="M${330 + i * 8} 104 q-30 -40 -${20 + i * 5} -${30 - i * 3} q24 10 ${30 + i * 5} ${34}Z"/>`)}</g><rect x="316" y="100" width="40" height="8" rx="3" fill="#a16207"/>`, LG('w', ['#ffe4f0', '#ffd0e6']) + LG('f', ['#fbcfe8', '#f9a8d4']) + LG('m', ['#e0f2fe', '#bae6fd']));

SCENES.ruchi = () => SV(`
  <rect width="400" height="300" fill="url(#s)"/>${rnds(60, (i, a, b) => `<circle cx="${a * 400}" cy="${b * 170}" r="${.7 + a * 1.6}" fill="#fff" opacity="${.4 + b * .5}"/>`)}
  <circle cx="318" cy="64" r="70" fill="#fde68a" opacity=".16"/><circle cx="318" cy="64" r="44" fill="#fef3c7"/><circle cx="304" cy="54" r="8" fill="#fde68a"/><circle cx="332" cy="76" r="6" fill="#fde68a"/><circle cx="324" cy="48" r="4" fill="#fde68a"/>
  <path d="M0 200 Q100 160 200 190 Q300 215 400 175 V300 H0Z" fill="#25205a"/>
  <g fill="#17133f"><rect x="40" y="100" width="70" height="100"/><rect x="26" y="70" width="26" height="130"/><path d="M22 72 L39 36 L56 72Z"/><rect x="100" y="84" width="24" height="116"/><path d="M96 86 L112 50 L128 86Z"/><rect x="70" y="60" width="22" height="50"/><path d="M66 62 L81 28 L96 62Z"/></g>
  ${[[34, 108], [34, 140], [106, 100], [106, 130], [78, 78], [60, 130], [86, 150]].map(w => `<rect x="${w[0]}" y="${w[1]}" width="9" height="14" rx="4" fill="#fde047"/>`).join('')}
  <path d="M0 230 Q120 206 220 226 Q320 246 400 214 V300 H0Z" fill="#312e81"/>
  <g fill="#a5b4fc" opacity=".16"><ellipse cx="90" cy="236" rx="120" ry="14"/><ellipse cx="300" cy="250" rx="110" ry="12"/></g>
  <g fill="#0f0c29"><path d="M240 80 q10 -8 20 0 q-10 -2 -20 0Z M270 110 q8 -6 16 0 q-8 -2 -16 0Z"/></g>`, LG('s', ['#0f0c29', '#302b63', '#4b3a8f']));

SCENES.dubila = () => SV(`
  <rect width="400" height="300" fill="url(#s)"/>${cld(300, 44, 1, .6)}
  ${[[40, 20, 1.1], [120, 40, .8], [330, 20, 1.2], [370, 60, .8]].map(t => `<rect x="${t[0] - 5 * t[2]}" y="${t[1]}" width="${10 * t[2]}" height="${150 * t[2]}" fill="#d6d3d1"/><ellipse cx="${t[0]}" cy="${t[1] + 4}" rx="${34 * t[2]}" ry="${24 * t[2]}" fill="#6b8f71"/><ellipse cx="${t[0] - 14 * t[2]}" cy="${t[1] + 22 * t[2]}" rx="${22 * t[2]}" ry="${14 * t[2]}" fill="#86a98c"/><ellipse cx="${t[0] + 16 * t[2]}" cy="${t[1] + 26 * t[2]}" rx="${22 * t[2]}" ry="${14 * t[2]}" fill="#86a98c"/>`).join('')}
  <path d="M0 190 Q140 170 260 190 Q340 205 400 186 V300 H0Z" fill="#9bd36a"/><rect x="0" y="210" width="400" height="90" fill="#8bc34a"/>
  <g transform="translate(200 250)"><path d="M-130 -26 L130 -26 L160 26 L-160 26Z" fill="#ef4444"/>${rnds(10, i => `<path d="M${-130 + i * 26} -26 L${-130 + i * 26 + 13} -26 L${-160 + i * 32 + 16} 26 L${-160 + i * 32} 26Z" fill="#fff" opacity=".55"/>`)}</g>
  <circle cx="70" cy="238" r="20" fill="#fde68a"/><circle cx="330" cy="240" r="22" fill="#fbcfe8"/><circle cx="310" cy="262" r="16" fill="#bfdbfe"/>
  <rect x="60" y="215" width="40" height="28" rx="5" fill="#92400e"/><path d="M62 215 q18 -22 36 0" stroke="#92400e" stroke-width="4" fill="none"/>
  ${rnds(16, (i, a, b) => `<path d="M${a * 400} ${220 + b * 70} q4 -10 8 0 q-4 4 -8 0Z" fill="#6b8f71" opacity=".8"/>`)}`, LG('s', ['#f6f0d4', '#e6f1c9']));

SCENES.marsh = () => SV(`
  <rect width="400" height="300" fill="url(#s)"/>
  ${['#f87171', '#fbbf24', '#4ade80', '#60a5fa', '#c084fc'].map((c, i) => `<path d="M30 190 Q200 ${20 + i * 10} 370 190" stroke="${c}" stroke-width="9" fill="none" opacity=".55" transform="translate(0 ${i * 0})"/>`).join('')}
  ${cld(70, 44, 1, .8)}${cld(330, 60, .9, .8)}
  ${[[60, 90, 26, '#f472b6'], [340, 100, 22, '#38bdf8'], [300, 70, 16, '#fbbf24']].map(l => `<rect x="${l[0] - 3}" y="${l[1]}" width="6" height="${130}" fill="#fff"/><circle cx="${l[0]}" cy="${l[1]}" r="${l[2]}" fill="${l[3]}"/><path d="M${l[0] - l[2]} ${l[1]} q${l[2]} ${-l[2]} ${l[2] * 2} 0" stroke="#fff" stroke-width="4" fill="none"/><circle cx="${l[0]}" cy="${l[1]}" r="${l[2] * .5}" fill="none" stroke="#fff" stroke-width="3"/>`).join('')}
  <g><rect x="150" y="150" width="8" height="60" fill="#fff"/><path d="M154 150 q0 -26 20 -26" stroke="#ef4444" stroke-width="8" fill="none"/><path d="M154 190 l0 20" stroke="#ef4444" stroke-width="8"/></g>
  <path d="M0 190 Q80 150 160 190 Q240 150 320 190 Q370 170 400 190 V300 H0Z" fill="#fbcfe8"/><path d="M0 220 Q100 190 200 220 Q300 190 400 220 V300 H0Z" fill="#f9a8d4"/>
  <path d="M0 232 q10 20 20 0 q10 26 20 0 q10 18 20 0 q10 22 20 0 q10 24 20 0 q10 18 20 0 q10 26 20 0 q10 20 20 0 q10 22 20 0 q10 18 20 0 q10 26 20 0 q10 20 20 0 q10 22 20 0 q10 18 20 0 q10 26 20 0 q10 20 20 0 q10 22 20 0 q10 18 20 0 q10 24 20 0 q10 20 20 0" fill="#fff" opacity=".9"/>
  ${rnds(40, (i, a, b) => `<rect x="${a * 400}" y="${236 + b * 60}" width="8" height="3" rx="1.5" fill="${['#ef4444', '#3b82f6', '#fbbf24', '#22c55e'][i % 4]}" transform="rotate(${i * 37} ${a * 400} ${236 + b * 60})"/>`)}`, LG('s', ['#ffd1e8', '#c9f1ff']));

SCENES.mish = () => SV(`
  <rect width="400" height="300" fill="url(#s)"/>${cld(80, 44, 1.2)}${cld(280, 70, 1)}
  <path d="M0 160 Q100 130 200 156 Q300 180 400 150 V300 H0Z" fill="#8fd35f"/>${tree(50, 100, 1.2)}${tree(360, 90, 1.1)}${tree(300, 120, .8, '#2f8f46', '#3ca557')}
  <rect x="0" y="172" width="400" height="128" fill="#6cc047"/>
  <path d="M120 300 Q170 230 260 190 Q320 170 400 170 L400 190 Q330 195 290 215 Q240 245 220 300Z" fill="#e7d3a8"/>
  <g transform="translate(330 190)"><ellipse cx="0" cy="26" rx="46" ry="12" fill="#94a3b8"/><ellipse cx="0" cy="18" rx="40" ry="9" fill="#7dd3fc"/><rect x="-5" y="-12" width="10" height="30" fill="#cbd5e1"/><path d="M0 -12 q-22 6 -26 30 M0 -12 q22 6 26 30 M0 -12 q0 -24 0 -10" stroke="#bae6fd" stroke-width="4" fill="none" stroke-linecap="round"/></g>
  <g transform="translate(60 214)"><rect x="0" y="0" width="60" height="6" rx="2" fill="#92400e"/><rect x="0" y="-16" width="60" height="5" rx="2" fill="#92400e"/><rect x="6" y="6" width="5" height="18" fill="#6b4423"/><rect x="50" y="6" width="5" height="18" fill="#6b4423"/><rect x="6" y="-16" width="5" height="16" fill="#6b4423"/><rect x="50" y="-16" width="5" height="16" fill="#6b4423"/></g>
  ${rnds(30, (i, a, b) => `<circle cx="${a * 400}" cy="${196 + b * 100}" r="3.2" fill="${['#fde047', '#f472b6', '#fff', '#c084fc'][i % 4]}"/>`)}`, LG('s', ['#a9ddff', '#e6f7ff']));

/* ---- Hugsy rooms ---- */
const wood = (y) => `<rect x="0" y="${y}" width="400" height="${300 - y}" fill="url(#fl)"/>${rnds(12, i => `<path d="M0 ${y + 10 + i * 12} H400" stroke="#0003" stroke-width="1.5"/>`)}${rnds(30, (i, a) => `<path d="M${a * 400} ${y} v${300 - y}" stroke="#0001" stroke-width="1"/>`)}`;
SCENES['hugsy.living'] = () => SV(`
  <rect width="400" height="300" fill="url(#w)"/><rect x="0" y="0" width="400" height="14" fill="#c48a4f"/>${wood(180)}<rect x="0" y="172" width="400" height="10" fill="#8d5a2e"/>
  <g><rect x="22" y="38" width="96" height="84" fill="#93c5fd" stroke="#7c3aed" stroke-width="7"/><path d="M70 38 V122 M22 80 H118" stroke="#7c3aed" stroke-width="4"/><g fill="#475569">${rnds(7, (i, a, b) => `<rect x="${24 + i * 13}" y="${96 + b * 20}" width="10" height="${30 - b * 10}"/>`)}</g></g>
  <g><rect x="150" y="104" width="100" height="14" rx="3" fill="#5b3b1d"/><rect x="156" y="62" width="88" height="44" rx="5" fill="#0f172a"/><rect x="161" y="67" width="78" height="34" rx="3" fill="url(#tv)"/></g>
  <g><rect x="276" y="46" width="64" height="76" rx="3" fill="#fff" stroke="#8d5a2e" stroke-width="5"/><ellipse cx="308" cy="90" rx="16" ry="22" fill="#1f2933"/><ellipse cx="308" cy="96" rx="10" ry="15" fill="#fff"/><circle cx="302" cy="82" r="2" fill="#000"/><circle cx="314" cy="82" r="2" fill="#000"/><path d="M304 86 h8 l-4 5Z" fill="#f59e0b"/></g>
  <g><rect x="340" y="40" width="4" height="100" fill="#444"/><path d="M326 40 h32 l-6 22 h-20Z" fill="#fde68a"/></g>
  <g><rect x="40" y="156" width="130" height="34" rx="4" fill="#3a7d44"/><rect x="36" y="148" width="138" height="12" rx="3" fill="#6b4a2b"/>${rnds(4, i => `<rect x="${62 + i * 28}" y="132" width="5" height="50" fill="#d1d5db"/>`)}</g>
  <rect x="190" y="226" width="150" height="46" rx="20" fill="#f59e0b" opacity=".7"/>`, LG('w', ['#f9d9a8', '#f2c488']) + LG('fl', ['#b57a45', '#8d5a2e']) + LG('tv', ['#60a5fa', '#1d4ed8']));

SCENES['hugsy.kitchen'] = () => SV(`
  <rect width="400" height="300" fill="#dff1fb"/>${rnds(14, i => rnds(6, j => `<rect x="${i * 30}" y="${j * 30}" width="29" height="29" fill="#fff" opacity=".4"/>`)).join('')}
  <rect x="0" y="36" width="400" height="56" fill="#fff" stroke="#cbd5e1" stroke-width="3"/>${rnds(8, i => `<rect x="${8 + i * 50}" y="42" width="42" height="44" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/><circle cx="${40 + i * 50}" cy="72" r="3" fill="#94a3b8"/>`)}
  <g><rect x="22" y="84" width="82" height="150" rx="8" fill="#e5e7eb" stroke="#cbd5e1" stroke-width="3"/><rect x="28" y="92" width="70" height="56" rx="3" fill="#f3f4f6"/><rect x="28" y="154" width="70" height="72" rx="3" fill="#f3f4f6"/><rect x="88" y="104" width="5" height="30" rx="2" fill="#9ca3af"/><rect x="88" y="166" width="5" height="40" rx="2" fill="#9ca3af"/></g>
  <rect x="120" y="170" width="200" height="14" fill="#9ca3af"/><rect x="120" y="184" width="200" height="60" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/><g><rect x="160" y="146" width="50" height="24" rx="3" fill="#f59e0b"/><rect x="214" y="150" width="50" height="20" rx="3" fill="#fbbf24"/></g>
  <rect x="0" y="236" width="400" height="64" fill="#e7e2d0"/>${rnds(14, i => rnds(2, j => `<rect x="${i * 30 + (j % 2) * 15}" y="${240 + j * 30}" width="15" height="30" fill="#cfc8b0" opacity=".6"/>`)).join('')}
  <g><circle cx="350" cy="140" r="30" fill="#fff" stroke="#9ca3af" stroke-width="4"/><path d="M350 140 V122 M350 140 L362 148" stroke="#374151" stroke-width="3"/></g>`);

SCENES['hugsy.gym'] = () => SV(`
  <rect width="400" height="300" fill="#e0e7ff"/><rect x="0" y="40" width="400" height="140" fill="url(#mr)"/>${rnds(4, i => `<path d="M${i * 110 + 20} 40 L${i * 110 + 60} 180" stroke="#fff" stroke-width="8" opacity=".35"/>`)}
  <rect x="0" y="180" width="400" height="120" fill="#374151"/>${rnds(12, i => `<path d="M${i * 34} 180 V300" stroke="#4b5563" stroke-width="2"/>`)}<rect x="30" y="226" width="340" height="60" rx="8" fill="#2563eb" opacity=".85"/>
  <g><rect x="320" y="120" width="60" height="70" fill="#6b7280"/>${rnds(4, i => `<rect x="${324 + i * 14}" y="134" width="10" height="44" rx="4" fill="${['#ef4444', '#3b82f6', '#fbbf24', '#10b981'][i]}"/>`)}</g>
  <g><rect x="20" y="170" width="70" height="14" rx="4" fill="#111827"/><rect x="26" y="184" width="6" height="22" fill="#9ca3af"/><rect x="78" y="184" width="6" height="22" fill="#9ca3af"/></g>
  <g><circle cx="200" cy="30" r="20" fill="#fff" stroke="#6b7280" stroke-width="4"/><path d="M200 30 V16 M200 30 L210 36" stroke="#111827" stroke-width="3"/></g>`, LG('mr', ['#dbeafe', '#93c5fd']));

SCENES['hugsy.studio'] = () => SV(`
  <rect width="400" height="300" fill="url(#bg)"/><rect x="60" y="20" width="280" height="190" rx="10" fill="#fbbf24"/><rect x="68" y="28" width="264" height="174" rx="8" fill="#fde68a"/>
  <g transform="translate(200 116)"><rect x="-44" y="-62" width="88" height="124" rx="6" fill="#ef4444"/><rect x="-38" y="-56" width="76" height="40" rx="4" fill="#fff"/><ellipse cx="0" cy="-36" rx="22" ry="14" fill="#1f2933"/><ellipse cx="0" cy="-32" rx="13" ry="9" fill="#fff"/><text x="0" y="12" font-size="22" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial">HUGSY</text><text x="0" y="36" font-size="18" font-weight="900" text-anchor="middle" fill="#fde68a" font-family="Arial Black,Arial">FLAKES</text><ellipse cx="0" cy="52" rx="20" ry="6" fill="#fff" opacity=".4"/></g>
  <rect x="0" y="210" width="400" height="90" fill="#fff7e0"/><ellipse cx="200" cy="236" rx="170" ry="26" fill="#fff" opacity=".6"/>
  ${[[34, 90], [366, 90]].map(l => `<rect x="${l[0] - 2}" y="${l[1]}" width="4" height="150" fill="#374151"/><rect x="${l[0] - 26}" y="${l[1] - 36}" width="52" height="44" rx="6" fill="#fff" stroke="#9ca3af" stroke-width="3"/><circle cx="${l[0]}" cy="${l[1] - 14}" r="14" fill="#fef9c3"/><path d="M${l[0] - 24} ${l[1] + 8} L${l[0] + (l[0] < 200 ? 90 : -90)} 190" stroke="#fef9c3" stroke-width="10" opacity=".25"/>`).join('')}`, LG('bg', ['#fff3c4', '#ffe08a']));

SCENES['hugsy.set'] = () => SV(`
  <rect width="400" height="300" fill="#e0f2fe"/><rect x="0" y="0" width="400" height="14" fill="#bae6fd"/>
  <rect x="150" y="30" width="100" height="30" rx="6" fill="#ef4444"/><text x="200" y="52" font-size="18" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial">+ DR. HUGSY</text>
  <rect x="0" y="200" width="400" height="100" fill="#94a3b8"/>${rnds(12, i => `<path d="M${i * 34} 200 V300" stroke="#64748b" stroke-width="1.5"/>`)}
  <g><rect x="24" y="110" width="150" height="64" rx="8" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><rect x="24" y="150" width="150" height="26" fill="#93c5fd"/><rect x="30" y="174" width="6" height="28" fill="#9ca3af"/><rect x="162" y="174" width="6" height="28" fill="#9ca3af"/><rect x="24" y="96" width="30" height="40" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/></g>
  <g><rect x="262" y="100" width="62" height="48" rx="4" fill="#111827"/><path d="M268 126 l10 0 l6 -14 l8 26 l8 -26 l6 14 l16 0" stroke="#22c55e" stroke-width="3" fill="none"/><rect x="290" y="148" width="8" height="54" fill="#6b7280"/><rect x="278" y="200" width="32" height="6" rx="3" fill="#6b7280"/></g>
  <g><rect x="344" y="60" width="4" height="140" fill="#9ca3af"/><rect x="334" y="60" width="24" height="4" fill="#9ca3af"/><rect x="338" y="70" width="14" height="26" rx="6" fill="#bfdbfe" stroke="#60a5fa" stroke-width="2"/></g>
  <rect x="0" y="40" width="22" height="160" fill="#86efac" opacity=".9"/>`);

SCENES['hugsy.bedroom'] = () => SV(`
  <rect width="400" height="300" fill="url(#bg)"/>${rnds(30, (i, a, b) => `<circle cx="${a * 400}" cy="${b * 100}" r="${.8 + a * 1.2}" fill="#fff" opacity=".6"/>`)}
  <g><rect x="270" y="30" width="96" height="104" rx="6" fill="#1e1b4b" stroke="#a78bfa" stroke-width="6"/><circle cx="320" cy="72" r="22" fill="#fef3c7"/><circle cx="326" cy="68" r="19" fill="#312e81"/>${rnds(8, (i, a, b) => `<circle cx="${280 + a * 76}" cy="${42 + b * 84}" r="1.4" fill="#fff"/>`)}</g>
  <rect x="0" y="200" width="400" height="100" fill="#3730a3"/><ellipse cx="200" cy="250" rx="150" ry="24" fill="#6366f1" opacity=".5"/>
  <g><rect x="24" y="130" width="170" height="70" rx="10" fill="#a5b4fc"/><rect x="24" y="116" width="26" height="90" rx="8" fill="#6366f1"/><rect x="34" y="136" width="150" height="44" rx="12" fill="#818cf8"/><rect x="40" y="130" width="46" height="20" rx="8" fill="#fff" opacity=".9"/></g>
  <g><rect x="212" y="164" width="40" height="40" rx="4" fill="#4338ca"/><path d="M222 164 h20 l-4 -26 h-12Z" fill="#fde68a"/><circle cx="232" cy="150" r="30" fill="#fde68a" opacity=".16"/></g>`, LG('bg', ['#1e1b4b', '#312e81']));

SCENES['hugsy.monica'] = () => SV(`
  <rect width="400" height="300" fill="url(#w)"/>${rnds(16, i => `<rect x="${i * 26}" y="0" width="13" height="200" fill="#fff" opacity=".07"/>`)}
  <rect x="0" y="206" width="400" height="94" fill="#7c3aed" opacity=".9"/><ellipse cx="200" cy="248" rx="160" ry="22" fill="#a78bfa" opacity=".55"/>
  <g><rect x="22" y="40" width="96" height="170" rx="5" fill="#7c3aed"/><rect x="14" y="34" width="112" height="182" rx="8" fill="none" stroke="#fde047" stroke-width="10"/><circle cx="70" cy="86" r="10" fill="#fde047" stroke="#b45309" stroke-width="2"/><circle cx="70" cy="86" r="4" fill="#111827"/><circle cx="108" cy="134" r="5" fill="#fde047"/><rect x="50" y="150" width="40" height="8" rx="3" fill="#a78bfa"/></g>
  <g><rect x="150" y="50" width="120" height="60" rx="4" fill="#fff" stroke="#fde047" stroke-width="6"/><rect x="156" y="56" width="108" height="48" fill="#93c5fd"/><path d="M156 56 L264 104 M264 56 L156 104" stroke="#fff" stroke-width="3" opacity=".6"/></g>
  <g><rect x="290" y="130" width="90" height="12" rx="4" fill="#f5f5f5"/><rect x="296" y="142" width="78" height="64" fill="#fef3c7"/>${rnds(3, i => `<circle cx="${312 + i * 26}" cy="124" r="10" fill="#d8b4fe"/>`)}</g>
  <g>${[170, 214].map(x => `<rect x="${x}" y="150" width="34" height="8" rx="3" fill="#b45309"/><rect x="${x + 4}" y="158" width="5" height="40" fill="#92400e"/><rect x="${x + 25}" y="158" width="5" height="40" fill="#92400e"/>`).join('')}</g>`, LG('w', ['#cfa8ef', '#b78ad8']));

/* ---- Family worlds ---- */
SCENES.mom = () => SV(`
  <rect width="400" height="300" fill="url(#w)"/>
  <path d="M0 26 Q100 50 200 28 Q300 8 400 30" stroke="#a16207" stroke-width="3" fill="none"/>${rnds(8, i => `<rect x="${10 + i * 48}" y="${28 + (i % 2) * 6}" width="${20 + (i % 3) * 8}" height="${22 + (i % 2) * 10}" rx="3" fill="${['#f472b6', '#60a5fa', '#fde047', '#fff', '#a78bfa', '#34d399'][i % 6]}"/><circle cx="${20 + i * 48}" cy="${26 + (i % 2) * 6}" r="2.5" fill="#6b7280"/>`)}
  <g><rect x="24" y="76" width="96" height="84" fill="#93c5fd" stroke="#fff" stroke-width="7"/><path d="M72 76 V160 M24 118 H120" stroke="#fff" stroke-width="4"/><path d="M14 70 Q40 110 18 168 M130 70 Q104 110 126 168" stroke="#f9a8d4" stroke-width="12" fill="none"/></g>
  <g><rect x="170" y="130" width="130" height="86" rx="6" fill="#e5e7eb" stroke="#cbd5e1" stroke-width="3"/><rect x="180" y="142" width="50" height="32" rx="4" fill="#374151"/><circle cx="262" cy="150" r="10" fill="#9ca3af"/><circle cx="286" cy="150" r="10" fill="#9ca3af"/><ellipse cx="205" cy="124" rx="24" ry="8" fill="#6b7280"/><rect x="183" y="100" width="44" height="24" rx="4" fill="#9ca3af"/></g>
  <rect x="0" y="216" width="400" height="84" fill="#d4a76a"/>${rnds(14, i => `<path d="M${i * 30} 216 V300" stroke="#b9854a" stroke-width="1.5"/>`)}
  <g><rect x="320" y="150" width="50" height="66" rx="6" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><circle cx="345" cy="188" r="16" fill="#bfdbfe" stroke="#94a3b8" stroke-width="3"/></g>`, LG('w', ['#fff4d6', '#ffe0a8']));

SCENES.sis18 = () => SV(`
  <rect width="400" height="300" fill="url(#s)"/>${cld(300, 40, 1, .6)}
  <path d="M0 150 Q100 120 200 144 Q300 168 400 138 V300 H0Z" fill="#8a9a6a"/>
  <g><path d="M30 150 L80 90 L130 150Z" fill="#5d6f3d"/><rect x="58" y="120" width="44" height="30" fill="#3f4f2e"/><path d="M80 90 V150" stroke="#2f3b20" stroke-width="2"/></g>
  <g><path d="M260 160 L300 110 L340 160Z" fill="#6b7d47"/><rect x="282" y="136" width="36" height="24" fill="#3f4f2e"/></g>
  <g><rect x="196" y="40" width="5" height="120" fill="#9ca3af"/><path d="M201 44 h46 l-8 14 l8 14 h-46Z" fill="#3b82f6"/><path d="M212 52 l12 6 l-12 6Z" fill="#fff"/></g>
  <rect x="0" y="176" width="400" height="124" fill="#7a6a4a"/>${rnds(30, (i, a, b) => `<ellipse cx="${a * 400}" cy="${184 + b * 110}" rx="${6 + a * 10}" ry="3" fill="#5f5139" opacity=".5"/>`)}
  <g fill="#c8b98a" stroke="#a89a6c" stroke-width="2">${rnds(7, i => `<rect x="${20 + i * 18}" y="190" width="30" height="16" rx="8"/>`)}</g>
  <g><rect x="320" y="170" width="60" height="40" fill="#8a6a3a"/><rect x="326" y="150" width="50" height="22" fill="#a07a42"/></g>`, LG('s', ['#cbd5e1', '#e2e8f0']));

SCENES.dad = () => SV(`
  <rect width="400" height="300" fill="url(#s)"/>${cld(70, 40, 1, .7)}${cld(320, 70, .9, .7)}
  <g stroke="#475569" stroke-width="4" fill="none"><rect x="230" y="80" width="130" height="130"/><path d="M230 124 H360 M230 168 H360 M274 80 V210 M318 80 V210"/><path d="M230 80 L274 124 L318 80" stroke-width="3"/></g><g fill="#94a3b8" opacity=".5"><rect x="230" y="168" width="130" height="42"/></g>
  <g><rect x="60" y="30" width="10" height="180" fill="#f59e0b"/><rect x="20" y="30" width="170" height="10" fill="#f59e0b"/><path d="M60 30 L20 40 M60 30 L110 40" stroke="#f59e0b" stroke-width="3"/><rect x="164" y="40" width="3" height="64" fill="#475569"/><path d="M158 104 q9 12 18 0" stroke="#475569" stroke-width="4" fill="none"/><rect x="120" y="28" width="20" height="14" fill="#374151"/><rect x="40" y="44" width="28" height="8" fill="#6b7280"/></g>
  <rect x="0" y="210" width="400" height="90" fill="#c9b48a"/>${rnds(26, (i, a, b) => `<ellipse cx="${a * 400}" cy="${214 + b * 80}" rx="${8 + a * 12}" ry="3" fill="#a68a5c" opacity=".5"/>`)}
  <g><path d="M300 250 L330 210 L360 250Z" fill="#a8956a"/>${[40, 100].map(x => `<path d="M${x} 242 l10 -26 l10 26Z" fill="#f97316"/><rect x="${x + 4}" y="228" width="12" height="4" fill="#fff"/>`).join('')}</g>
  `, LG('s', ['#bfdbfe', '#e0f2fe']));

SCENES.bro14 = () => SV(`
  <rect width="400" height="300" fill="#2f7d46"/><rect x="0" y="0" width="400" height="90" fill="#d1fae5"/>
  ${rnds(9, i => `<rect x="${i * 46}" y="30" width="40" height="56" fill="#9ca3af"/>${rnds(3, j => `<circle cx="${i * 46 + 10 + j * 10}" cy="${44 + (i % 2) * 8}" r="4" fill="${['#f87171', '#fff', '#fbbf24'][(i + j) % 3]}"/>`)}`).join('')}
  <path d="M30 300 L100 100 H300 L370 300Z" fill="#2563eb"/><path d="M30 300 L100 100 H300 L370 300Z" fill="none" stroke="#fff" stroke-width="5"/><path d="M62 200 H338 M200 100 V300 M90 140 H310" stroke="#fff" stroke-width="3" opacity=".8"/>
  <g><rect x="60" y="182" width="280" height="6" fill="#f3f4f6"/>${rnds(30, i => `<rect x="${64 + i * 9}" y="184" width="3" height="3" fill="#6b7280"/>`)}<rect x="56" y="178" width="4" height="30" fill="#374151"/><rect x="340" y="178" width="4" height="30" fill="#374151"/></g>
  <g><rect x="336" y="40" width="54" height="50" rx="4" fill="#fff" stroke="#9ca3af" stroke-width="3"/><rect x="344" y="60" width="38" height="5" fill="#6b7280"/><circle cx="346" cy="62" r="6" fill="#374151"/><circle cx="380" cy="62" r="6" fill="#374151"/></g>`);

SCENES.sis8 = () => SV(`
  <rect width="400" height="300" fill="url(#w)"/>
  <rect x="0" y="40" width="400" height="14" fill="#ea580c"/><rect x="0" y="54" width="400" height="60" fill="#fed7aa"/>${rnds(14, i => `<path d="M${i * 30} 54 V114" stroke="#fdba74" stroke-width="2"/>`)}
  <g><rect x="270" y="70" width="86" height="58" rx="3" fill="#fff" stroke="#9ca3af" stroke-width="4"/><rect x="296" y="96" width="34" height="26" fill="none" stroke="#ef4444" stroke-width="3"/><circle cx="313" cy="134" r="14" fill="none" stroke="#f97316" stroke-width="5"/><path d="M301 138 q12 24 24 0" stroke="#fff" stroke-width="2" fill="none"/></g>
  <rect x="0" y="180" width="400" height="120" fill="url(#fl)"/>${rnds(10, i => `<path d="M0 ${190 + i * 12} H400" stroke="#0002" stroke-width="1.5"/>`)}<g stroke="#fff" stroke-width="4" fill="none" opacity=".85"><path d="M40 300 L120 190 H280 L360 300"/><ellipse cx="200" cy="260" rx="56" ry="18"/></g>
  <g><rect x="30" y="64" width="150" height="40" fill="#7c2d12"/><text x="105" y="92" font-size="22" font-weight="900" text-anchor="middle" fill="#fde68a" font-family="Arial Black,Arial">SCHOOL STARS</text></g>`, LG('w', ['#ffe8c4', '#fff3de']) + LG('fl', ['#e9a863', '#c9803a']));

/* pick the right scene for a world / room */
function sceneKey(w, room) { return w.rooms ? w.id + '.' + (room || 'living') : w.id; }
function sceneSVG(w, room) { const f = SCENES[sceneKey(w, room)]; return f ? f() : ''; }
