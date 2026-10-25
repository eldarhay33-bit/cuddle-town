'use strict';
/* ---------- Hand-drawn SVG characters (shaded, outlined, no external assets) ---------- */
const ART = {};
let _uid = 0; const uid = () => 'a' + (++_uid);
function svgw(inner, vb) { return `<svg viewBox="${vb || '0 0 200 220'}" class="art" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`; }
const rg = (id, c1, c2, fx, fy, r) => `<radialGradient id="${id}" cx="${fx || '38%'}" cy="${fy || '30%'}" r="${r || '78%'}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>`;
const lg = (id, c1, c2, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 || 0}" y2="${y2 == null ? 1 : y2}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
function shade(hex, p) { // p>0 lighten, p<0 darken
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, t = p < 0 ? 0 : 255, q = Math.abs(p);
  const f = v => Math.round((t - v) * q + v); return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
}
const OL = 'stroke="#00000033" stroke-width="2"';

function eyesSVG(lx, rx, y, m, o) {
  o = o || {};
  const r = o.r || 7, c = o.c || '#2b2b3a';
  if (m === 'sleep') return `<path d="M${lx - r} ${y}q${r} ${r * 1.1} ${2 * r} 0M${rx - r} ${y}q${r} ${r * 1.1} ${2 * r} 0" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if (m === 'love') return `<text x="${lx}" y="${y}" font-size="${r * 2.5}" text-anchor="middle" dominant-baseline="central">❤️</text><text x="${rx}" y="${y}" font-size="${r * 2.5}" text-anchor="middle" dominant-baseline="central">❤️</text>`;
  const ry = m === 'wow' ? r * 1.4 : r * 1.18;
  let s = `<g class="blink"><ellipse cx="${lx}" cy="${y}" rx="${r}" ry="${ry}" fill="${c}"/><ellipse cx="${rx}" cy="${y}" rx="${r}" ry="${ry}" fill="${c}"/><circle cx="${lx + r * .32}" cy="${y - r * .42}" r="${r * .4}" fill="#fff"/><circle cx="${rx + r * .32}" cy="${y - r * .42}" r="${r * .4}" fill="#fff"/><circle cx="${lx - r * .35}" cy="${y + r * .4}" r="${r * .18}" fill="#fff" opacity=".8"/><circle cx="${rx - r * .35}" cy="${y + r * .4}" r="${r * .18}" fill="#fff" opacity=".8"/></g>`;
  if (o.lash) s += `<path d="M${lx - r} ${y - r * .6}l-4 -5M${lx + r} ${y - r * .6}l4 -5M${rx - r} ${y - r * .6}l-4 -5M${rx + r} ${y - r * .6}l4 -5" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
  if (m === 'sad') s += `<path d="M${lx - r} ${y - r - 2}l${2 * r} -5M${rx - r} ${y - r - 7}l${2 * r} 5" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
  return s;
}
function mouthSVG(cx, y, m, o) {
  o = o || {};
  const w = o.w || 12, c = o.c || '#7a3b2e';
  const st = `stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"`;
  switch (m) {
    case 'sad': return `<path d="M${cx - w} ${y + 5}q${w} ${-w * .9} ${2 * w} 0" ${st}/>`;
    case 'ok': return `<path d="M${cx - w * .7} ${y + 2}h${w * 1.4}" ${st}/>`;
    case 'eat': return `<ellipse class="chew" cx="${cx}" cy="${y + 3}" rx="${w * .6}" ry="${w * .55}" fill="${c}"/>`;
    case 'wow': return `<ellipse cx="${cx}" cy="${y + 3}" rx="${w * .5}" ry="${w * .7}" fill="${c}"/>`;
    case 'sleep': return `<path d="M${cx - w * .5} ${y + 2}q${w * .5} ${w * .5} ${w} 0" ${st}/>`;
    default: return `<path d="M${cx - w} ${y}q${w} ${w * 1.1} ${2 * w} 0" ${st}/>`;
  }
}
function cheeks(lx, rx, y, r) { r = r || 8; return `<ellipse cx="${lx}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#ff6f91" opacity=".42"/><ellipse cx="${rx}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#ff6f91" opacity=".42"/>`; }
function wearSVG(w, anc) {
  if (!w) return '';
  let s = '';
  for (const k in anc) if (w[k]) s += `<text x="${anc[k][0]}" y="${anc[k][1]}" font-size="${anc[k][2]}" text-anchor="middle" dominant-baseline="central">${w[k]}</text>`;
  return s;
}
const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="8" fill="#000" opacity=".16"/>`;
const gloss = (cx, cy, rx, ry, rot) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot || -25} ${cx} ${cy})" fill="#fff" opacity=".2"/>`;

/* ===== Hugsy (penguin) ===== */
ART.hugsy = function (o) {
  const m = o.mood || 'happy', a = uid(), b = uid(), c = uid();
  const anc = { head: [100, 46, 46], face: [100, 84, 44], neck: [100, 118, 38], body: [100, 160, 54] };
  return svgw(`<defs>${rg(a, '#4d6073', '#141b24')}${rg(b, '#ffffff', '#d9e2ec')}${lg(c, '#ffc857', '#ee8200')}</defs>${shadow(100, 208, 62)}
  <g class="bob">
  <ellipse cx="72" cy="199" rx="21" ry="9" fill="url(#${c})" ${OL}/><ellipse cx="128" cy="199" rx="21" ry="9" fill="url(#${c})" ${OL}/>
  <path d="M60 198l-4 5M72 202v5M84 198l4 5M116 198l-4 5M128 202v5M140 198l4 5" stroke="#c76b00" stroke-width="3" stroke-linecap="round"/>
  <g class="wingL"><path d="M50 118 Q12 150 38 178 Q60 156 62 124Z" fill="url(#${a})" ${OL}/></g>
  <g class="wingR"><path d="M150 118 Q188 150 162 178 Q140 156 138 124Z" fill="url(#${a})" ${OL}/></g>
  <ellipse cx="100" cy="128" rx="57" ry="74" fill="url(#${a})" ${OL}/>
  <ellipse cx="100" cy="148" rx="39" ry="54" fill="url(#${b})"/>
  <ellipse cx="100" cy="158" rx="30" ry="40" fill="#fff" opacity=".35"/>
  <circle cx="79" cy="86" r="19" fill="url(#${b})"/><circle cx="121" cy="86" r="19" fill="url(#${b})"/>
  ${eyesSVG(79, 121, 86, m, { r: 7.5 })}
  <path d="M85 100 Q100 93 115 100 Q100 124 85 100Z" fill="url(#${c})" ${OL}/><path d="M92 99 Q100 96 108 99" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>
  ${m === 'eat' ? '<ellipse class="chew" cx="100" cy="112" rx="8" ry="6" fill="#d96a00"/>' : ''}
  ${m === 'sad' ? '<path d="M92 126q8 -6 16 0" stroke="#555" stroke-width="3" fill="none" stroke-linecap="round"/>' : ''}
  ${cheeks(62, 138, 102, 9)}${gloss(76, 62, 14, 26, -20)}
  ${wearSVG(o.worn, anc)}
  </g>`);
};

/* ===== Dubi MH (bear, green jersey) ===== */
ART.dubi = function (o) {
  const m = o.mood || 'happy', a = uid(), b = uid(), c = uid();
  const anc = { head: [100, 30, 46], face: [100, 78, 42], neck: [100, 122, 40], body: [100, 160, 48] };
  return svgw(`<defs>${rg(a, '#dba46c', '#b27438')}${lg(b, '#27c260', '#0a7a33', 0, 1)}${rg(c, '#fbe3c0', '#efc795')}</defs>${shadow(100, 208, 60)}
  <g class="bob">
  <ellipse cx="76" cy="199" rx="21" ry="11" fill="url(#${a})" ${OL}/><ellipse cx="124" cy="199" rx="21" ry="11" fill="url(#${a})" ${OL}/>
  <rect x="62" y="166" width="76" height="30" rx="12" fill="#fff" ${OL}/><path d="M100 170v24" stroke="#d1d5db" stroke-width="2"/>
  <g class="wingL"><ellipse cx="46" cy="152" rx="14" ry="26" transform="rotate(14 46 152)" fill="url(#${a})" ${OL}/></g>
  <g class="wingR"><ellipse cx="154" cy="152" rx="14" ry="26" transform="rotate(-14 154 152)" fill="url(#${a})" ${OL}/></g>
  <path d="M54 130 Q100 110 146 130 L154 180 Q100 192 46 180Z" fill="url(#${b})" ${OL}/>
  <path d="M70 126v56M130 126v56M85 120v62M115 120v62" stroke="#ffffff" stroke-opacity=".16" stroke-width="5"/>
  <path d="M82 123 Q100 140 118 123" fill="#fff" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>
  <ellipse cx="62" cy="136" rx="14" ry="11" fill="url(#${b})" ${OL}/><ellipse cx="138" cy="136" rx="14" ry="11" fill="url(#${b})" ${OL}/>
  <text x="100" y="170" font-size="30" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial">1</text>
  <circle cx="58" cy="50" r="22" fill="url(#${a})" ${OL}/><circle cx="58" cy="50" r="12" fill="#f0c597"/>
  <circle cx="142" cy="50" r="22" fill="url(#${a})" ${OL}/><circle cx="142" cy="50" r="12" fill="#f0c597"/>
  <circle cx="100" cy="84" r="50" fill="url(#${a})" ${OL}/>
  <ellipse cx="100" cy="102" rx="25" ry="19" fill="url(#${c})"/>
  <ellipse cx="100" cy="94" rx="10" ry="7" fill="#3b2314"/><ellipse cx="97" cy="92" rx="3" ry="2" fill="#fff" opacity=".5"/>
  ${eyesSVG(78, 122, 76, m, { r: 7.5 })}${mouthSVG(100, 104, m, { w: 9 })}${cheeks(66, 134, 96, 9)}${gloss(80, 62, 14, 22, -25)}
  ${wearSVG(o.worn, anc)}
  </g>`);
};

/* ===== Efrochi (big chick) + mother hen ===== */
ART.efro = function (o) {
  const m = o.mood || 'happy', a = uid(), b = uid(), c = uid();
  const anc = { head: [100, 40, 44], face: [100, 88, 44], neck: [100, 124, 38], body: [100, 160, 48] };
  return svgw(`<defs>${rg(a, '#fff08a', '#ffc619')}${rg(b, '#fffbd0', '#ffe98a')}${lg(c, '#ffb347', '#f07c00')}</defs>${shadow(100, 208, 62)}
  <g class="bob">
  <path d="M80 196 l-14 12 M80 196 l0 14 M80 196 l14 12 M120 196 l-14 12 M120 196 l0 14 M120 196 l14 12" stroke="#f07c00" stroke-width="5" stroke-linecap="round"/>
  <g class="wingL"><ellipse cx="40" cy="138" rx="18" ry="34" transform="rotate(18 40 138)" fill="url(#${a})" ${OL}/><path d="M30 120q8 20 6 40" stroke="#e8a900" stroke-width="2" fill="none"/></g>
  <g class="wingR"><ellipse cx="160" cy="138" rx="18" ry="34" transform="rotate(-18 160 138)" fill="url(#${a})" ${OL}/><path d="M170 120q-8 20 -6 40" stroke="#e8a900" stroke-width="2" fill="none"/></g>
  <circle cx="100" cy="128" r="72" fill="url(#${a})" ${OL}/>
  <ellipse cx="100" cy="150" rx="44" ry="42" fill="url(#${b})"/>
  <path d="M70 140q6 6 12 0M96 150q6 6 12 0M118 138q6 6 12 0M84 168q6 6 12 0M110 172q6 6 12 0" stroke="#f1c40f" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M92 60 Q84 30 74 38 M100 58 Q100 24 98 28 M108 60 Q118 30 128 38" stroke="#ffc619" stroke-width="8" fill="none" stroke-linecap="round"/>
  ${eyesSVG(76, 124, 96, m, { r: 9 })}
  <path d="M88 108 L112 108 L100 127Z" fill="url(#${c})" stroke="#e07000" stroke-width="3" stroke-linejoin="round"/><path d="M93 111l14 0" stroke="#fff" stroke-width="2" opacity=".5"/>
  ${m === 'eat' ? '<ellipse class="chew" cx="100" cy="124" rx="8" ry="5" fill="#d96a00"/>' : ''}
  ${cheeks(60, 140, 112, 10)}${gloss(70, 80, 16, 26, -25)}
  ${wearSVG(o.worn, anc)}
  </g>`);
};
ART.hen = function (o) {
  const m = o.mood || 'happy', a = uid(), b = uid();
  return svgw(`<defs>${rg(a, '#ffffff', '#f3e3c3')}${lg(b, '#ff8aa8', '#e0457a')}</defs>${shadow(60, 124, 36)}
  <g class="bob">
  <path d="M44 116 l-6 10 M44 116 l4 10 M76 116 l-4 10 M76 116 l6 10" stroke="#f07c00" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="60" cy="86" rx="38" ry="34" fill="url(#${a})" ${OL}/>
  <path d="M92 80 Q114 84 106 106 Q90 98 88 88Z" fill="url(#${a})" ${OL}/>
  <path d="M46 36 q4 -16 10 -6 q4 -14 10 -2 q10 -6 6 10Z" fill="#e53935" ${OL}/>
  <circle cx="60" cy="50" r="22" fill="url(#${a})" ${OL}/>
  <path d="M40 74 Q60 90 80 74 L76 98 Q60 106 44 98Z" fill="url(#${b})" ${OL}/>
  <circle cx="60" cy="88" r="4" fill="#fff" opacity=".7"/>
  ${eyesSVG(51, 69, 48, m, { r: 4 })}
  <path d="M55 56 L65 56 L60 65Z" fill="#ff8c1a"/>
  ${cheeks(44, 76, 58, 5)}
  ${o.prop ? `<text x="98" y="88" font-size="24" text-anchor="middle" dominant-baseline="central">${o.prop}</text>` : ''}
  </g>`, '0 0 120 135');
};

/* ===== Lemilam — a pampered fluffy LLAMA model ===== */
ART.lemi = function (o) {
  const m = o.mood || 'happy', a = uid(), b = uid(), c = uid();
  const anc = { head: [100, 12, 40], face: [100, 52, 34], neck: [100, 116, 34], body: [100, 164, 42] };
  const wool = [[60, 160, 30], [140, 160, 30], [100, 176, 34], [78, 142, 28], [122, 142, 28], [100, 150, 30], [64, 182, 22], [136, 182, 22]];
  return svgw(`<defs>${rg(a, '#fffafc', '#ffd9e9')}${rg(b, '#fff6fa', '#ffe0ee')}${lg(c, '#ffb3d1', '#e66aa0')}</defs>${shadow(100, 210, 60)}
  <g class="bob">
  <g fill="#f6c7da" ${OL}><rect x="68" y="182" width="12" height="26" rx="6"/><rect x="88" y="186" width="12" height="22" rx="6"/><rect x="104" y="186" width="12" height="22" rx="6"/><rect x="124" y="182" width="12" height="26" rx="6"/></g>
  <g fill="#c98aa6"><rect x="68" y="203" width="12" height="6" rx="3"/><rect x="88" y="203" width="12" height="6" rx="3"/><rect x="104" y="203" width="12" height="6" rx="3"/><rect x="124" y="203" width="12" height="6" rx="3"/></g>
  <circle cx="160" cy="170" r="12" fill="url(#${a})" ${OL}/>
  <g fill="url(#${a})" ${OL}>${wool.map(w => `<circle cx="${w[0]}" cy="${w[1]}" r="${w[2]}"/>`).join('')}</g>
  <g fill="url(#${a})">${wool.map(w => `<circle cx="${w[0]}" cy="${w[1]}" r="${w[2] - 1.5}"/>`).join('')}</g>
  <path d="M82 66 L118 66 L124 150 L76 150Z" fill="url(#${b})" ${OL}/>
  <g fill="url(#${a})" ${OL}><circle cx="82" cy="140" r="15"/><circle cx="118" cy="140" r="15"/><circle cx="100" cy="146" r="17"/></g>
  <g fill="url(#${a})"><circle cx="82" cy="140" r="13.5"/><circle cx="118" cy="140" r="13.5"/><circle cx="100" cy="146" r="15.5"/></g><path d="M86 84 L114 84" stroke="#ffd0e2" stroke-width="3" opacity=".5"/><path d="M84 100 L116 100 M86 116 L114 116" stroke="#ffd0e2" stroke-width="2" opacity=".4"/>
  <path d="M76 38 Q58 6 76 4 Q92 18 90 40Z" fill="url(#${b})" ${OL}/><path d="M124 38 Q142 6 124 4 Q108 18 110 40Z" fill="url(#${b})" ${OL}/>
  <path d="M78 34 Q68 14 76 12 Q84 22 84 36Z" fill="#ffc2da"/><path d="M122 34 Q132 14 124 12 Q116 22 116 36Z" fill="#ffc2da"/>
  <ellipse cx="100" cy="50" rx="26" ry="32" fill="url(#${b})" ${OL}/>
  <g fill="url(#${a})" ${OL}><circle cx="86" cy="24" r="12"/><circle cx="100" cy="18" r="14"/><circle cx="114" cy="24" r="12"/></g>
  <g fill="url(#${a})"><circle cx="86" cy="24" r="10.5"/><circle cx="100" cy="18" r="12.5"/><circle cx="114" cy="24" r="10.5"/></g>
  <path d="M112 14 l16 -12 l0 24Z M112 14 l-4 -16 l22 4Z" fill="url(#${c})" ${OL}/><circle cx="114" cy="14" r="5" fill="#e6397d"/>
  <ellipse cx="100" cy="68" rx="17" ry="14" fill="#ffd3e4" ${OL}/>
  <ellipse cx="94" cy="66" rx="2.4" ry="3" fill="#b0466f"/><ellipse cx="106" cy="66" rx="2.4" ry="3" fill="#b0466f"/>
  ${eyesSVG(88, 112, 46, m, { r: 6.5, lash: true })}${mouthSVG(100, 72, m, { w: 6, c: '#b0466f' })}${cheeks(78, 122, 58, 6)}
  ${wearSVG(o.worn, anc)}
  </g>`);
};

/* ===== Ruchi (little ghost) ===== */
ART.ruchi = function (o) {
  const m = o.mood || 'happy', a = uid();
  const anc = { head: [100, 40, 44], face: [100, 88, 42], neck: [100, 126, 38], body: [100, 158, 46] };
  return svgw(`<defs>${lg(a, '#ffffff', '#d8dcff', 0, 1)}<radialGradient id="${a}g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#c7d2fe" stop-opacity=".6"/><stop offset="1" stop-color="#c7d2fe" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="100" cy="206" rx="40" ry="7" fill="#7a86c8" opacity=".25"/>
  <g class="float"><circle cx="100" cy="115" r="92" fill="url(#${a}g)"/>
  <path d="M42 188 V104 Q42 36 100 36 Q158 36 158 104 V188 Q142 172 128 188 Q114 204 100 188 Q86 172 72 188 Q58 204 42 188Z" fill="url(#${a})" stroke="#b9c3f2" stroke-width="3"/>
  <g class="wingL"><ellipse cx="38" cy="130" rx="12" ry="20" transform="rotate(24 38 130)" fill="url(#${a})" stroke="#b9c3f2" stroke-width="3"/></g>
  <g class="wingR"><ellipse cx="162" cy="130" rx="12" ry="20" transform="rotate(-24 162 130)" fill="url(#${a})" stroke="#b9c3f2" stroke-width="3"/></g>
  ${eyesSVG(78, 122, 96, m, { r: 9.5 })}${mouthSVG(100, 118, m, { w: 9 })}${cheeks(64, 136, 116, 10)}${gloss(76, 64, 14, 26, -25)}
  <text x="150" y="60" font-size="16">✨</text><text x="40" y="170" font-size="12">✨</text>
  ${wearSVG(o.worn, anc)}
  </g>`);
};

/* ===== Dubila (bear in a koala costume) ===== */
ART.dubila = function (o) {
  const m = o.mood || 'happy', a = uid(), b = uid(), c = uid();
  const anc = { head: [100, 26, 44], face: [100, 84, 40], neck: [100, 128, 38], body: [100, 165, 46] };
  return svgw(`<defs>${rg(a, '#b8c2cd', '#7f8b99')}${rg(b, '#eef2f6', '#cdd5de')}${rg(c, '#f1d5ae', '#dcb680')}</defs>${shadow(100, 208, 62)}
  <g class="bob">
  <ellipse cx="74" cy="198" rx="20" ry="11" fill="url(#${a})" ${OL}/><ellipse cx="126" cy="198" rx="20" ry="11" fill="url(#${a})" ${OL}/>
  <g class="wingL"><ellipse cx="44" cy="150" rx="14" ry="28" transform="rotate(14 44 150)" fill="url(#${a})" ${OL}/></g>
  <g class="wingR"><ellipse cx="156" cy="150" rx="14" ry="28" transform="rotate(-14 156 150)" fill="url(#${a})" ${OL}/></g>
  <ellipse cx="100" cy="152" rx="60" ry="54" fill="url(#${a})" ${OL}/>
  <ellipse cx="100" cy="160" rx="38" ry="40" fill="url(#${b})"/>
  <path d="M100 120 V196" stroke="#7d8896" stroke-width="2.5" stroke-dasharray="5 4"/><rect x="95" y="124" width="10" height="14" rx="3" fill="#ffc83d" ${OL}/>
  <path d="M60 140q8 5 14 0M126 140q8 5 14 0M80 170q8 5 14 0M110 176q8 5 14 0" stroke="#aab4c0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="40" cy="54" r="32" fill="url(#${a})" stroke="#f1f5f9" stroke-width="6"/><circle cx="40" cy="54" r="18" fill="#f5c6d1"/>
  <circle cx="160" cy="54" r="32" fill="url(#${a})" stroke="#f1f5f9" stroke-width="6"/><circle cx="160" cy="54" r="18" fill="#f5c6d1"/>
  <circle cx="100" cy="84" r="52" fill="url(#${a})" ${OL}/>
  <ellipse cx="100" cy="92" rx="38" ry="34" fill="url(#${c})"/>
  <circle cx="68" cy="66" r="10" fill="#b9814f"/><circle cx="132" cy="66" r="10" fill="#b9814f"/>
  <ellipse cx="100" cy="104" rx="17" ry="12" fill="#f7e6c8"/><ellipse cx="100" cy="97" rx="15" ry="11" fill="#23262d"/><ellipse cx="95" cy="93" rx="4" ry="2.5" fill="#fff" opacity=".4"/>
  ${eyesSVG(82, 118, 84, m, { r: 6.5 })}${mouthSVG(100, 108, m, { w: 8 })}${cheeks(72, 128, 100, 8)}${gloss(78, 58, 16, 20, -25)}
  ${wearSVG(o.worn, anc)}
  </g>`);
};

/* ===== Marshmallow Cat ===== */
ART.marsh = function (o) {
  const m = o.mood || 'happy', a = uid(), b = uid(); const melt = o.melt;
  const anc = { head: [100, 30, 44], face: [100, 94, 42], neck: [100, 134, 38], body: [100, 166, 46] };
  return svgw(`<defs>${rg(a, '#ffffff', '#ffe0ea')}${lg(b, '#ffb3c8', '#ff7fa3')}</defs>${shadow(100, 208, 62)}
  <g class="bob">
  <path d="M150 170 Q196 160 186 118 Q180 100 168 112" stroke="#ffd0dc" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M150 170 Q196 160 186 118" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/>
  <path d="M56 64 L62 26 L92 54Z" fill="url(#${a})" stroke="#ffc4d4" stroke-width="3" stroke-linejoin="round"/><path d="M63 52 L66 36 L80 50Z" fill="url(#${b})"/>
  <path d="M144 64 L138 26 L108 54Z" fill="url(#${a})" stroke="#ffc4d4" stroke-width="3" stroke-linejoin="round"/><path d="M137 52 L134 36 L120 50Z" fill="url(#${b})"/>
  <g class="${melt ? 'meltsag' : ''}"><rect x="44" y="52" width="112" height="${melt ? 140 : 144}" rx="${melt ? 58 : 46}" fill="url(#${a})" stroke="#ffc4d4" stroke-width="3"/></g>
  <path d="M60 110q4 4 8 0M130 150q4 4 8 0M72 176q4 4 8 0M118 92q4 4 8 0" stroke="#ffd0dc" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <rect x="62" y="162" width="76" height="10" rx="5" fill="#ffd0dc" opacity=".55"/>
  ${melt ? '<path d="M60 194 q-2 14 4 14 q6 0 4 -14Z M96 196 q-2 18 4 18 q6 0 4 -18Z M130 194 q-2 12 4 12 q6 0 4 -12Z" fill="#ffc4d4"/><text x="150" y="60" font-size="22">💧</text>' : ''}
  ${eyesSVG(78, 122, 96, m, { r: 7.5 })}
  <path d="M96 108 h8 l-4 5Z" fill="#ff6f9a"/>${mouthSVG(100, 114, m, { w: 8 })}
  <path d="M60 108 l-22 -4 M60 114 l-22 4 M140 108 l22 -4 M140 114 l22 4" stroke="#e9b7c6" stroke-width="2.5" stroke-linecap="round"/>
  ${cheeks(64, 136, 112, 9)}${gloss(72, 76, 14, 26, -20)}
  ${wearSVG(o.worn, anc)}
  </g>`);
};

/* ===== Mishmish (chubby dog) ===== */
ART.mish = function (o) {
  const m = o.mood || 'happy', a = uid(), b = uid();
  const anc = { head: [100, 34, 42], face: [100, 84, 40], neck: [100, 128, 38], body: [100, 164, 46] };
  return svgw(`<defs>${rg(a, '#f5c984', '#d9983c')}${rg(b, '#fff1d6', '#f4d9a8')}</defs>${shadow(100, 208, 66)}
  <g class="bob">
  <path d="M158 160 Q196 150 184 118" stroke="#e0a550" stroke-width="16" fill="none" stroke-linecap="round"/>
  <ellipse cx="72" cy="198" rx="20" ry="11" fill="#cf8f3d" ${OL}/><ellipse cx="128" cy="198" rx="20" ry="11" fill="#cf8f3d" ${OL}/>
  <ellipse cx="100" cy="152" rx="66" ry="52" fill="url(#${a})" ${OL}/>
  <ellipse cx="100" cy="164" rx="40" ry="36" fill="url(#${b})"/>
  <ellipse cx="148" cy="136" rx="10" ry="8" fill="#b8742b" opacity=".55"/>
  <g class="earL"><ellipse cx="56" cy="84" rx="17" ry="34" transform="rotate(14 56 84)" fill="#b97f3b" ${OL}/></g>
  <g class="earR"><ellipse cx="144" cy="84" rx="17" ry="34" transform="rotate(-14 144 84)" fill="#b97f3b" ${OL}/></g>
  <circle cx="100" cy="88" r="46" fill="url(#${a})" ${OL}/>
  <ellipse cx="100" cy="106" rx="26" ry="19" fill="url(#${b})"/>
  <ellipse cx="100" cy="97" rx="10" ry="7" fill="#2b2b3a"/><ellipse cx="97" cy="95" rx="3" ry="2" fill="#fff" opacity=".6"/>
  ${eyesSVG(80, 120, 78, m, { r: 7.5 })}
  ${m === 'happy' || m === 'love' || m === 'wow' ? '<path d="M94 112 q6 18 12 0Z" fill="#ff7a93"/>' : ''}
  ${mouthSVG(100, 108, m === 'happy' ? 'happy' : m, { w: 8 })}${cheeks(66, 134, 100, 8)}${gloss(80, 66, 12, 18, -25)}
  ${o.leash === false ? '' : '<path d="M104 112 Q150 130 170 206" stroke="#e53935" stroke-width="5" fill="none" stroke-linecap="round"/>'}
  ${wearSVG(o.worn, anc)}
  </g>`);
};

/* ===== People: realistic proportions (Joey, friends, family) ===== */
ART.person = function (o) {
  o = Object.assign({ skin: '#f1c7a1', hair: '#3a2a20', hs: 'short', shirt: '#4aa3df', pants: '#3b4a6b', shoes: '#222', hat: '', prop: '', mood: 'happy', s: 1, extra: '', worn: null, fem: false }, o);
  const m = o.mood, hc = o.hair, sk = o.skin, sa = uid(), sb = uid(), sc = uid(), sd = uid();
  const sk2 = shade(sk, -.18), hi = shade(hc, .35), shirt2 = shade(o.shirt, -.22), pants2 = shade(o.pants, -.25);
  let back = '', front = '';
  switch (o.hs) {
    case 'long': back = `<path d="M48 40 Q46 10 70 10 Q94 10 92 40 L96 100 Q70 112 44 100Z" fill="${hc}"/>`; front = `<path d="M51 34 Q56 12 70 13 Q86 12 90 34 Q78 24 70 26 Q60 24 51 34Z" fill="${hc}"/><path d="M58 20q10 -6 22 0" stroke="${hi}" stroke-width="3" fill="none" opacity=".6"/>`; break;
    case 'bob': back = `<path d="M50 44 Q47 12 70 12 Q93 12 90 44 L88 74 Q70 80 52 74Z" fill="${hc}"/>`; front = `<path d="M51 34 Q58 12 72 13 Q88 14 90 36 Q78 22 66 26 Q58 28 51 34Z" fill="${hc}"/><path d="M60 19q10 -5 20 0" stroke="${hi}" stroke-width="3" fill="none" opacity=".6"/>`; break;
    case 'pony': back = `<ellipse cx="94" cy="44" rx="7" ry="22" transform="rotate(-14 94 44)" fill="${hc}"/><rect x="86" y="26" width="6" height="8" rx="2" fill="#e11d48"/>`; front = `<path d="M51 36 Q52 12 70 12 Q90 12 90 36 Q78 24 70 26 Q58 24 51 36Z" fill="${hc}"/><path d="M58 19q10 -5 20 0" stroke="${hi}" stroke-width="3" fill="none" opacity=".6"/>`; break;
    case 'pig': back = `<circle cx="48" cy="38" r="11" fill="${hc}"/><circle cx="92" cy="38" r="11" fill="${hc}"/><rect x="45" y="30" width="6" height="5" rx="2" fill="#f472b6"/><rect x="89" y="30" width="6" height="5" rx="2" fill="#f472b6"/>`; front = `<path d="M51 36 Q52 12 70 12 Q90 12 90 36 Q78 24 70 26 Q58 24 51 36Z" fill="${hc}"/>`; break;
    case 'bun': back = `<circle cx="70" cy="8" r="11" fill="${hc}"/>`; front = `<path d="M51 36 Q52 12 70 12 Q90 12 90 36 Q78 24 70 26 Q58 24 51 36Z" fill="${hc}"/><path d="M58 19q10 -5 20 0" stroke="${hi}" stroke-width="3" fill="none" opacity=".6"/>`; break;
    case 'curly': back = `<g fill="${hc}"><circle cx="52" cy="28" r="12"/><circle cx="88" cy="28" r="12"/><circle cx="60" cy="16" r="12"/><circle cx="80" cy="16" r="12"/><circle cx="70" cy="12" r="12"/></g>`; break;
    case 'spiky': front = `<path d="M51 36 L53 14 L62 24 L66 6 L74 22 L82 8 L86 24 L92 14 L90 36 Q80 24 70 26 Q60 24 51 36Z" fill="${hc}"/><path d="M60 22l5 -8M76 22l4 -9" stroke="${hi}" stroke-width="2.5" opacity=".55"/>`; break;
    case 'bald': front = '<ellipse cx="62" cy="22" rx="8" ry="4" fill="#fff" opacity=".4"/>'; break;
    default: front = `<path d="M51 36 Q50 12 70 12 Q90 12 90 36 Q82 24 70 26 Q58 24 51 36Z" fill="${hc}"/><path d="M58 18q12 -5 22 1" stroke="${hi}" stroke-width="3" fill="none" opacity=".55"/>`;
  }
  let hat = '';
  switch (o.hat) {
    case 'army': hat = '<path d="M48 30 Q70 -4 92 30Z" fill="#55683f" stroke="#2f3b20" stroke-width="2"/><rect x="45" y="27" width="50" height="7" rx="3" fill="#3f4f2e"/><circle cx="70" cy="16" r="3.5" fill="#ffd54f"/>'; break;
    case 'hard': hat = '<path d="M47 30 Q70 -8 93 30Z" fill="#ffc107" stroke="#c79100" stroke-width="2"/><rect x="43" y="27" width="54" height="8" rx="4" fill="#ffb300"/><rect x="64" y="2" width="12" height="16" rx="3" fill="#ffb300"/>'; break;
    case 'band': hat = '<rect x="50" y="20" width="40" height="8" rx="4" fill="#e53935"/>'; break;
    case 'visor': hat = '<path d="M50 26 H90 Q104 28 108 34 H52Z" fill="#fff" stroke="#d1d5db" stroke-width="2"/><rect x="50" y="20" width="40" height="8" rx="4" fill="#fff"/>'; break;
    case 'chef': hat = '<g fill="#fff" stroke="#e5e7eb" stroke-width="1.5"><circle cx="58" cy="8" r="11"/><circle cx="82" cy="8" r="11"/><circle cx="70" cy="0" r="12"/><rect x="52" y="8" width="36" height="20" rx="4"/></g>'; break;
    case 'cap': hat = '<path d="M50 30 Q70 -4 90 30Z" fill="#e53935"/><path d="M88 28 H110 Q108 36 92 36Z" fill="#c62828"/>'; break;
  }
  let extra = '';
  if (o.extra === 'apron') extra = `<path d="M50 96 H90 L94 160 H46Z" fill="#fff" opacity=".93" stroke="#e5e7eb" stroke-width="1.5"/><rect x="60" y="116" width="20" height="16" rx="3" fill="#ffd1dc"/><path d="M50 96l-6 -14M90 96l6 -14" stroke="#e5e7eb" stroke-width="2"/>`;
  if (o.extra === 'tie') extra = '<path d="M66 84 L74 84 L77 108 L70 118 L63 108Z" fill="#d9363e" stroke="#9f1c24" stroke-width="1.5"/>';
  if (o.extra === 'vest') extra = '<path d="M42 80 H98 L100 156 H40Z" fill="#ff7a00" opacity=".95"/><path d="M52 84 V154 M88 84 V154" stroke="#fff59d" stroke-width="5"/><rect x="58" y="110" width="24" height="3" fill="#fff59d"/>';
  if (o.extra === 'army') extra = '<path d="M42 80 H98 L100 156 H40Z" fill="#55683f" stroke="#3a4a28" stroke-width="2"/><rect x="48" y="96" width="16" height="12" rx="2" fill="#3f4f2e"/><rect x="76" y="96" width="16" height="12" rx="2" fill="#3f4f2e"/><path d="M70 82V156" stroke="#3a4a28" stroke-width="2"/>';
  if (o.extra === 'coat') extra = '<path d="M40 80 L100 80 L104 160 L36 160Z" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><path d="M70 80 V160" stroke="#cfd8dc" stroke-width="2"/><rect x="46" y="110" width="14" height="14" rx="2" fill="none" stroke="#cfd8dc" stroke-width="2"/>';
  const anc = { head: [70, 10, 30], face: [70, 42, 26], neck: [70, 84, 26], body: [70, 118, 34] };
  const tr = o.s !== 1 ? ` transform="translate(70 290) scale(${o.s}) translate(-70 -290)"` : '';
  const legs = o.skirt
    ? `<path d="M46 150 L94 150 L100 196 L40 196Z" fill="url(#${sc})"/><rect x="52" y="194" width="14" height="72" rx="6" fill="${sk}"/><rect x="74" y="194" width="14" height="72" rx="6" fill="${sk}"/>`
    : `<path d="M48 150 L70 150 L67 266 L52 266Z" fill="url(#${sc})"/><path d="M70 150 L92 150 L88 266 L73 266Z" fill="url(#${sc})"/><path d="M70 152v112" stroke="${pants2}" stroke-width="1.5"/>`;
  return svgw(`<defs>${rg(sa, shade(sk, .25), sk)}${lg(sb, shade(o.shirt, .2), o.shirt, 1, 1)}${lg(sc, shade(o.pants, .12), pants2)}${lg(sd, shade(o.shoes, .25), o.shoes)}</defs>
  <ellipse cx="70" cy="284" rx="40" ry="6" fill="#000" opacity=".16"/>
  <g class="bob"${tr}>
  ${o.kid ? '' : back}
  ${legs}
  <path d="M46 262 q-4 10 4 14 h22 q4 -6 -2 -14Z" fill="url(#${sd})" stroke="#0004" stroke-width="1.5"/><path d="M70 262 q-4 10 4 14 h22 q6 -4 2 -14Z" fill="url(#${sd})" stroke="#0004" stroke-width="1.5"/>
  <g class="wingL"><path d="M40 82 Q26 90 26 118 L28 146 L40 146 L42 118 L46 92Z" fill="url(#${sb})" stroke="${shirt2}" stroke-width="1.5"/><ellipse cx="33" cy="152" rx="7" ry="9" fill="url(#${sa})"/></g>
  <g class="wingR"><path d="M100 82 Q114 90 114 118 L112 146 L100 146 L98 118 L94 92Z" fill="url(#${sb})" stroke="${shirt2}" stroke-width="1.5"/><ellipse cx="107" cy="152" rx="7" ry="9" fill="url(#${sa})"/></g>
  <path d="M40 82 Q70 70 100 82 L98 158 L42 158Z" fill="url(#${sb})" stroke="${shirt2}" stroke-width="1.5"/>
  <path d="M58 78 L70 96 L82 78" fill="none" stroke="${shirt2}" stroke-width="2"/>
  ${extra}
  <rect x="62" y="56" width="16" height="26" fill="${sk2}"/><path d="M62 74 Q70 82 78 74 V66 H62Z" fill="#00000012"/>
  <g${o.kid ? ' transform="translate(70 70) scale(1.3) translate(-70 -70)"' : ''}>${o.kid ? back : ''}
  <ellipse cx="52" cy="44" rx="4" ry="6" fill="${sk}"/><ellipse cx="88" cy="44" rx="4" ry="6" fill="${sk}"/>
  <ellipse cx="70" cy="40" rx="19" ry="23" fill="url(#${sa})" stroke="${sk2}" stroke-width="1.5"/>
  ${front}
  <path d="M57 35q6 -3 11 0M72 35q6 -3 11 0" stroke="${shade(hc, -.15)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${m === 'sleep' ? `<path d="M57 42q5 4 10 0M73 42q5 4 10 0" stroke="#3a2a20" stroke-width="2.4" fill="none" stroke-linecap="round"/>` : m === 'love' ? `<text x="62" y="42" font-size="10" text-anchor="middle" dominant-baseline="central">❤️</text><text x="78" y="42" font-size="10" text-anchor="middle" dominant-baseline="central">❤️</text>` : `<g class="blink"><ellipse cx="62" cy="42" rx="5" ry="${m === 'wow' ? 6.4 : 5}" fill="#fff"/><ellipse cx="78" cy="42" rx="5" ry="${m === 'wow' ? 6.4 : 5}" fill="#fff"/><circle cx="62.6" cy="42.4" r="3" fill="#4a3426"/><circle cx="78.6" cy="42.4" r="3" fill="#4a3426"/><circle cx="62.6" cy="42.4" r="1.5" fill="#111"/><circle cx="78.6" cy="42.4" r="1.5" fill="#111"/><circle cx="63.6" cy="41.2" r=".9" fill="#fff"/><circle cx="79.6" cy="41.2" r=".9" fill="#fff"/></g>`}
  ${o.fem ? '<path d="M56 38l-3 -3M84 38l3 -3" stroke="#2b1b12" stroke-width="1.6" stroke-linecap="round"/>' : ''}
  <path d="M70 44 q-3 7 1 8" stroke="${sk2}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  ${m === 'sad' ? `<path d="M63 62q7 -6 14 0" stroke="#a8473b" stroke-width="2.4" fill="none" stroke-linecap="round"/>` : m === 'ok' ? `<path d="M64 60h12" stroke="#a8473b" stroke-width="2.4" stroke-linecap="round"/>` : m === 'eat' || m === 'wow' ? `<ellipse class="chew" cx="70" cy="61" rx="4.5" ry="4" fill="#8f2d2d"/>` : `<path d="M62 58q8 8 16 0" stroke="#a8473b" stroke-width="2.4" fill="#fff" stroke-linecap="round"/><path d="M62 58q8 8 16 0" fill="#fff" opacity=".8"/>`}
  <ellipse cx="57" cy="52" rx="5" ry="3" fill="#ff7a93" opacity=".3"/><ellipse cx="83" cy="52" rx="5" ry="3" fill="#ff7a93" opacity=".3"/>
  ${hat}
  </g>
  ${o.prop ? `<text x="116" y="150" font-size="38" text-anchor="middle" dominant-baseline="central">${o.prop}</text>` : ''}
  ${wearSVG(o.worn, anc)}
  </g>`, '0 0 140 300');
};

/* People presets (friends & family) */
const PEOPLE = {
  joey: { skin: '#e9b98f', hair: '#2a1b13', hs: 'spiky', shirt: '#d97a2b', pants: '#3b4a6b' },
  monica: { skin: '#f3cba5', hair: '#3b2418', hs: 'bob', shirt: '#8e44ad', pants: '#37474f', extra: 'apron', fem: true },
  chandler: { skin: '#efc59d', hair: '#6b4a2b', hs: 'short', shirt: '#5f86b8', pants: '#4b4b4b' },
  rachel: { skin: '#f3cba5', hair: '#a06a38', hs: 'long', shirt: '#ff7fa8', pants: '#5c6bc0', fem: true },
  ross: { skin: '#e8bd94', hair: '#3b2a1e', hs: 'short', shirt: '#6d4c41', pants: '#394557' },
  phoebe: { skin: '#f3cba5', hair: '#e5be4e', hs: 'long', shirt: '#6fcfc4', pants: '#8e6bbf', fem: true },
  mom: { skin: '#f3cba5', hair: '#7a4a2b', hs: 'bun', shirt: '#ec6f9f', pants: '#5c6bc0', extra: 'apron', fem: true },
  sis18: { skin: '#f3cba5', hair: '#f0d070', hs: 'pony', shirt: '#55683f', pants: '#4a5a36', shoes: '#2b2b2b', hat: 'army', extra: 'army', fem: true },
  dad: { skin: '#e2ae85', hair: '#000', hs: 'bald', shirt: '#4a8fd0', pants: '#37474f', shoes: '#5d4037', hat: 'hard', extra: 'vest' },
  bro14: { skin: '#f3cba5', hair: '#f0d070', hs: 'short', shirt: '#fafafa', pants: '#26a69a', hat: 'band', prop: '🎾' },
  sis8: { skin: '#f3cba5', hair: '#1c1c28', hs: 'pig', shirt: '#ff8a3d', pants: '#3b82f6', s: .74, prop: '🏀', fem: true, kid: true }
};
ART.joey = o => ART.person(Object.assign({}, PEOPLE.joey, o));
ART.monica = o => ART.person(Object.assign({}, PEOPLE.monica, o));
ART.chandler = o => ART.person(Object.assign({}, PEOPLE.chandler, o));
ART.rachel = o => ART.person(Object.assign({}, PEOPLE.rachel, o));
ART.ross = o => ART.person(Object.assign({}, PEOPLE.ross, o));
ART.phoebe = o => ART.person(Object.assign({}, PEOPLE.phoebe, o));
['mom', 'sis18', 'dad', 'bro14', 'sis8'].forEach(k => ART[k] = o => ART.person(Object.assign({}, PEOPLE[k], o)));

function artOf(id, o) {
  const f = ART[id] || ART.person;
  return f(o || {});
}
