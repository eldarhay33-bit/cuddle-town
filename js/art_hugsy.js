'use strict';
/* =====================================================================
   Hugsy — fluffy white penguin plush with his outfit:
   striped knit beanie, brown aviator goggles, quilted golden zip vest
   (striped knit hem) and a knit scarf. Every garment can get dirty
   (o.dirt = 0..3) and is also available on its own for the laundry game.
   ===================================================================== */
const HGC = { mar: '#8c1d40', marD: '#4d0d22', cream: '#f5ead0', blk: '#1d1c24', brn: '#7b4a22', brnD: '#2d1809' };
const hgRand = seed => { let s = seed * 9301 + 49297; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
const hf = v => (Math.round(v * 10) / 10);

/* scalloped outline = plush fur edge */
function hgFluff(cx, cy, rx, ry, n, amp) {
  const pt = (a, k) => (cx + Math.cos(a) * rx * k).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * k).toFixed(1);
  let d = 'M' + pt(0, 1);
  for (let i = 1; i <= n; i++) { const a0 = (i - 1) / n * 6.2832, a1 = i / n * 6.2832; d += 'Q' + pt((a0 + a1) / 2, 1 + amp) + ' ' + pt(a1, 1); }
  return d + 'Z';
}
/* little fur tufts */
function hgFur(seed, n, cx, cy, rx, ry, col) {
  const r = hgRand(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const a = r() * 6.2832, k = Math.sqrt(r()) * .88, x = cx + Math.cos(a) * rx * k, y = cy + Math.sin(a) * ry * k, l = 3.5 + r() * 3.5, t = (r() - .5) * 3;
    s += `M${hf(x)} ${hf(y)}q${hf(l * .5 + t)} ${hf(-l * .9)} ${hf(l)} ${hf(-l * .15)}`;
  }
  return `<path d="${s}" stroke="${col || '#c9d3df'}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".75"/>`;
}
/* mud / food stains (level 0..3) */
function hgDirt(seed, lv, x, y, w, h) {
  if (!lv) return '';
  const r = hgRand(seed), n = [0, 5, 11, 18][lv]; let out = '';
  for (let i = 0; i < n; i++) {
    const cx = x + r() * w, cy = y + r() * h, rr = 1.8 + r() * (1.6 + lv * 1.5), ry = rr * (.55 + r() * .5);
    out += `<ellipse cx="${hf(cx)}" cy="${hf(cy)}" rx="${hf(rr)}" ry="${hf(ry)}" transform="rotate(${(r() * 180) | 0} ${hf(cx)} ${hf(cy)})" fill="#5a3516" opacity="${(.3 + r() * .32).toFixed(2)}"/>`;
    if (r() > .5) out += `<circle cx="${hf(cx + rr)}" cy="${hf(cy - rr * .7)}" r="${hf(.9 + r() * 1.5)}" fill="#3d2410" opacity=".6"/>`;
  }
  if (lv >= 2) out += `<path d="M${hf(x + w * .15)} ${hf(y + h * .35)}q${hf(w * .3)} ${hf(h * .22)} ${hf(w * .65)} ${hf(h * .04)}" stroke="#5a3516" stroke-width="${lv * 1.5}" opacity=".2" fill="none" stroke-linecap="round"/>`;
  if (lv >= 3) out += `<ellipse cx="${hf(x + w * .62)}" cy="${hf(y + h * .55)}" rx="${hf(w * .16)}" ry="${hf(h * .11)}" fill="#6b4420" opacity=".34"/>`;
  return out;
}

/* ---------- garments (all drawn in Hugsy's own coordinate system) ---------- */
function hgBeanie(lv) {
  const d = uid(), cl = uid(), bc = uid(); let ribs = '', st = '', fine = '';
  for (let x = 54; x <= 146; x += 10.2) ribs += `M${hf(x)} 58Q${hf(100 + (x - 100) * .76)} 32 ${hf(100 + (x - 100) * .08)} 12`;
  for (let k = 0; k < 9; k++) st += `<rect x="${hf(38 + k * 14.4)}" y="40" width="7.2" height="46" fill="${HGC.blk}"/>`;
  for (let x = 44; x <= 158; x += 3.6) fine += `M${x} 44V84`;
  const dome = 'M47 62C43 30 68 12 100 11C132 12 157 30 153 62Z', band = 'M45 50Q100 60 155 50L157 66Q100 78 43 66Z';
  return {
    defs: rg(d, '#bd2f5c', '#6a1432', '36%', '24%', '92%'),
    g: `<clipPath id="${cl}"><path d="${dome}"/></clipPath><clipPath id="${bc}"><path d="${band}"/></clipPath>
    <path d="${dome}" fill="url(#${d})" stroke="#3d0a1b" stroke-opacity=".6" stroke-width="2"/>
    <g clip-path="url(#${cl})"><path d="${ribs}" stroke="#4a0c22" stroke-opacity=".36" stroke-width="1.8" fill="none"/><path d="${ribs}" stroke="#ee8aa3" stroke-opacity=".2" stroke-width="1.2" fill="none" transform="translate(2.4 0)"/>
      <ellipse cx="79" cy="29" rx="17" ry="8" transform="rotate(-28 79 29)" fill="#fff" opacity=".24"/>${hgDirt(11, lv, 52, 14, 96, 38)}</g>
    <path d="${band}" fill="${HGC.cream}"/><g clip-path="url(#${bc})">${st}<path d="${fine}" stroke="#000" stroke-opacity=".13" stroke-width="1" fill="none"/>
      <path d="M45 50Q100 60 155 50" stroke="#fff" stroke-opacity=".55" stroke-width="2.6" fill="none"/><path d="M43 66Q100 78 157 66" stroke="#000" stroke-opacity=".22" stroke-width="3" fill="none"/>${hgDirt(12, lv, 50, 50, 100, 20)}</g>
    <path d="${band}" fill="none" stroke="#2b1a14" stroke-opacity=".6" stroke-width="2" stroke-linejoin="round"/>`
  };
}
function hgGoggles(lv) {
  const l = uid(), lens = cx => {
    const cy = 86, a = cx < 100 ? -1 : 1;
    return `<circle cx="${cx}" cy="${cy}" r="15" fill="url(#${l})" opacity=".4"/>
      <circle cx="${cx}" cy="${cy}" r="16.2" fill="none" stroke="${HGC.brnD}" stroke-width="6.6"/><circle cx="${cx}" cy="${cy}" r="16.2" fill="none" stroke="${HGC.brn}" stroke-width="4.4"/>
      <path d="M${cx - 12.5} ${cy - 9}A16.2 16.2 0 0 1 ${cx - 2} ${cy - 15.6}" stroke="#e0b184" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M${cx - 8.5} ${cy - 3}q2.5 -8 9.5 -9.5" stroke="#fff" stroke-opacity=".8" stroke-width="2.7" fill="none" stroke-linecap="round"/><circle cx="${cx + 6}" cy="${cy + 7.5}" r="1.7" fill="#fff" opacity=".55"/>
      <circle cx="${cx + a * 15.2}" cy="${cy - 5.5}" r="1.9" fill="#d6d3d1" stroke="${HGC.brnD}" stroke-width=".8"/><circle cx="${cx + a * 15.2}" cy="${cy + 5.5}" r="1.9" fill="#d6d3d1" stroke="${HGC.brnD}" stroke-width=".8"/>
      ${lv ? `<ellipse cx="${cx + a * 3}" cy="${cy + 5}" rx="${5 + lv * 2}" ry="${3 + lv}" transform="rotate(${-a * 25} ${cx} ${cy})" fill="#6b4420" opacity="${.1 + lv * .09}"/>${lv > 1 ? `<circle cx="${cx - a * 6}" cy="${cy - 4}" r="${1.4 + lv * .5}" fill="#4a2c12" opacity=".4"/>` : ''}` : ''}`;
  };
  const strap = s => { const x0 = s < 0 ? 64.5 : 135.5, x1 = s < 0 ? 50 : 150; return `<path d="M${x0} 82.5L${x1} 79.5Q${x1 + s * 3.5} 86 ${x1} 93.5L${x0} 90Z" fill="${HGC.brn}" stroke="${HGC.brnD}" stroke-width="1.6" stroke-linejoin="round"/><path d="M${x0 + s * 2.5} 86.2H${x1 - s * 3}" stroke="#d9b48a" stroke-width="1.2" stroke-dasharray="2.2 2.2" opacity=".85"/><rect x="${s < 0 ? 54 : 141}" y="80.2" width="5" height="12.4" rx="1.6" fill="none" stroke="#d9b24a" stroke-width="1.6"/>`; };
  return {
    defs: rg(l, '#ffd990', '#8f4f10', '34%', '26%', '88%'),
    g: `${strap(-1)}${strap(1)}${lens(80)}${lens(120)}
    <path d="M94.5 84.5Q100 79.5 105.5 84.5" stroke="${HGC.brnD}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M94.5 84.5Q100 79.5 105.5 84.5" stroke="${HGC.brn}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    ${lv ? `<g opacity=".9">${hgDirt(21, lv, 47, 78, 22, 16)}${hgDirt(22, lv, 131, 78, 22, 16)}</g>` : ''}`
  };
}
function hgVest(lv, flat) {
  const g1 = uid(), g2 = uid(), g3 = uid(), cp = uid(), hc = uid(), pt = uid();
  const ell = '<ellipse cx="100" cy="148" rx="55.5" ry="59.5"/>', fl = '<path d="M62 112L90 112Q100 128 110 112L138 112Q156 124 148 150L153 203Q100 214 47 203L52 150Q44 124 62 112Z"/>';
  const shape = flat ? fl : ell;
  let q = '', hi = '', ribs = '';
  [134, 148, 162, 176].forEach(y => { q += `M40 ${y}Q100 ${y + 9} 160 ${y}`; hi += `M46 ${y + 5}Q100 ${y + 14} 154 ${y + 5}`; });
  let st = ''; for (let k = 0; k < 18; k++) st += `<rect x="${hf(34 + k * 8)}" y="170" width="4" height="50" fill="${k % 2 ? HGC.cream : HGC.mar}"/>`;
  return {
    defs: lg(g1, '#ffeb85', '#eba000', .3, 1) + `<linearGradient id="${g2}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#7a4400" stop-opacity=".3"/></linearGradient>
      <linearGradient id="${g3}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4400" stop-opacity=".0"/><stop offset="1" stop-color="#7a4400" stop-opacity=".3"/></linearGradient>
      <clipPath id="${cp}">${shape}</clipPath><clipPath id="${hc}"><path d="M30 180Q100 192 170 180V230H30Z"/></clipPath>
      <pattern id="${pt}" width="2.8" height="8" patternUnits="userSpaceOnUse"><rect width="1.1" height="8" fill="#000" opacity=".16"/></pattern>`,
    g: `<g clip-path="url(#${cp})">
      <rect x="36" y="106" width="130" height="112" fill="url(#${g1})"/>
      <path d="${hi}" stroke="#fffbd0" stroke-opacity=".6" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="${q}" stroke="#b97800" stroke-opacity=".78" stroke-width="1.8" fill="none"/><path d="${q}" stroke="#fff5b0" stroke-opacity=".55" stroke-width="1" fill="none" transform="translate(0 1.9)"/>
      <rect x="36" y="106" width="130" height="112" fill="url(#${g2})"/><rect x="36" y="106" width="130" height="112" fill="url(#${g3})"/>
      <ellipse cx="72" cy="150" rx="7" ry="26" transform="rotate(14 72 150)" fill="#fff" opacity=".3"/>
      <path d="M62 158L74 177M138 158L126 177" stroke="#a86b00" stroke-width="2.2" stroke-linecap="round"/><path d="M65 156.5L77 175.5M135 156.5L123 175.5" stroke="#fff3a8" stroke-width="1" stroke-dasharray="2.6 2.2" opacity=".85"/>
      <g clip-path="url(#${hc})">${st}<rect x="30" y="176" width="140" height="50" fill="url(#${pt})"/><path d="M30 180Q100 192 170 180" stroke="#000" stroke-opacity=".28" stroke-width="2.6" fill="none"/><path d="M30 183Q100 195 170 183" stroke="#fff" stroke-opacity=".3" stroke-width="1.4" fill="none"/>${hgDirt(42, lv, 50, 184, 100, 20)}</g>
      <rect x="97.6" y="106" width="4.8" height="106" fill="#c58500" opacity=".85"/><path d="M100 106V212" stroke="#4b5563" stroke-width="4.2" opacity=".55"/><path d="M100 106V212" stroke="#f1f5f9" stroke-width="2.8" stroke-dasharray="2.1 1.9"/>
      <rect x="94.8" y="137" width="10.4" height="13" rx="3.4" fill="#d1d5db" stroke="#4b5563" stroke-width="1.2"/><path d="M96.5 139.5h7" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="100" cy="156" rx="3.4" ry="5.2" fill="none" stroke="#9ca3af" stroke-width="1.8"/>
      ${hgDirt(41, lv, 52, 124, 96, 58)}</g>
    <path d="${flat ? 'M62 112L90 112Q100 128 110 112L138 112Q156 124 148 150L153 203Q100 214 47 203L52 150Q44 124 62 112Z' : 'M100 88.5A55.5 59.5 0 1 0 100.01 88.5Z'}" fill="none" stroke="#9a6200" stroke-opacity=".55" stroke-width="2.2"/>`
  };
}
function hgScarf(lv) {
  const wrap = 'M58 120Q100 146 142 120', tail = 'M124 133Q135 160 130 188', tail2 = 'M111 138Q108 160 116 180', mk = uid(), mk2 = uid();
  const tube = (d, w, cap) => `<path d="${d}" stroke="#3b0f1f" stroke-opacity=".55" stroke-width="${w + 2.6}" fill="none" stroke-linecap="${cap}"/><path d="${d}" stroke="${HGC.cream}" stroke-width="${w}" fill="none" stroke-linecap="${cap}"/>
    <path d="${d}" stroke="${HGC.mar}" stroke-width="${w}" fill="none" stroke-dasharray="6 18" stroke-linecap="butt"/><path d="${d}" stroke="${HGC.blk}" stroke-width="${w}" fill="none" stroke-dasharray="6 18" stroke-dashoffset="-12" stroke-linecap="butt"/>
    <path d="${d}" stroke="#000" stroke-opacity=".12" stroke-width="${w}" fill="none" stroke-dasharray="1 2.4"/>`;
  return {
    defs: `<mask id="${mk}"><path d="${wrap}" stroke="#fff" stroke-width="15" fill="none" stroke-linecap="round"/><path d="${tail}" stroke="#fff" stroke-width="16" fill="none"/></mask>`,
    g: `${tube(tail2, 14, 'butt')}${tube(tail, 16, 'butt')}
    <path d="M122.5 188l-1 9M126 188.5l0 10M129.5 189l1 10M133 188.5l2 9M136 187.5l3 8" stroke="#e9d9b2" stroke-width="1.8" stroke-linecap="round"/><path d="M112 180l-1.5 8M115.5 181l0 9M119 180l1.5 8" stroke="#e9d9b2" stroke-width="1.6" stroke-linecap="round"/>
    ${tube(wrap, 15, 'round')}<path d="${wrap}" transform="translate(0 -4.4)" stroke="#fff" stroke-opacity=".3" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="124" cy="131" rx="10.5" ry="9.5" fill="${HGC.mar}" stroke="#3b0f1f" stroke-opacity=".6" stroke-width="2"/><path d="M115 129.5Q124 125 133 129.5M116 135Q124 139 132 135" stroke="${HGC.cream}" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="121" cy="128" rx="4" ry="2.4" fill="#fff" opacity=".25"/>
    <g mask="url(#${mk})">${hgDirt(31, lv, 50, 112, 98, 34)}${hgDirt(32, lv, 118, 134, 20, 56)}</g>`
  };
}

/* ---------- standalone garment art (square canvas, for the laundry game) ---------- */
const hgSolo = (part, tx, ty, s) => o => { const p = part(o.dirt || 0, o.flat !== false); return svgw(`<defs>${p.defs}</defs><g transform="translate(${tx} ${ty}) scale(${s})">${p.g}</g>`, '0 0 200 200'); };
ART.hbeanie = hgSolo(hgBeanie, -50, 38.5, 1.5);
ART.hgoggles = hgSolo(hgGoggles, -62, -39, 1.62);
ART.hvest = hgSolo(hgVest, -50, -143, 1.5);
ART.hscarf = hgSolo(hgScarf, -47, -132, 1.5);

/* ---------- Hugsy himself ---------- */
ART.hugsy = function (o) {
  const m = o.mood || 'happy', w = o.worn || {}, lv = o.dirt || 0, a = uid(), b = uid(), c = uid(), bk = uid(), fe = uid();
  const anc = { head: [100, 36, 52], face: [100, 88, 46], neck: [100, 130, 40], body: [100, 170, 54] };
  const vest = hgVest(lv, false), beanie = hgBeanie(lv), gog = hgGoggles(lv), scarf = hgScarf(lv);
  const outfit = !w.body ? vest : null, hat = !w.head ? beanie : null, eyewear = !w.face ? gog : null, scf = !w.neck ? scarf : null;
  const dirtCoat = lv ? `<ellipse cx="100" cy="150" rx="54" ry="58" fill="#8a6a45" opacity="${lv * .035}"/>` : '';
  return svgw(`<defs>${rg(a, '#ffffff', '#dfe6ee', '38%', '26%', '82%')}${rg(b, '#4b4f5e', '#14151b', '36%', '24%')}${lg(c, '#ffdd55', '#f29a00')}${lg(fe, '#ffd23f', '#f08a00')}
    ${outfit ? outfit.defs : ''}${hat ? hat.defs : ''}${eyewear ? eyewear.defs : ''}${scf ? scf.defs : ''}</defs>${shadow(100, 212, 66)}
  <g class="bob">
  <g class="wingL"><path d="M50 122C14 138 4 172 28 192C46 180 60 158 62 132Z" fill="url(#${b})" stroke="#000" stroke-opacity=".3" stroke-width="2"/><path d="M26 160q4 14 12 22" stroke="#5a5f70" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>${hgFur(3, 8, 32, 160, 14, 24, '#6b7080')}</g>
  <g class="wingR"><path d="M150 122C186 138 196 172 172 192C154 180 140 158 138 132Z" fill="url(#${b})" stroke="#000" stroke-opacity=".3" stroke-width="2"/><path d="M174 160q-4 14 -12 22" stroke="#5a5f70" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>${hgFur(4, 8, 168, 160, 14, 24, '#6b7080')}</g>
  <ellipse cx="100" cy="148" rx="60" ry="64" fill="url(#${b})"/>
  <path d="${hgFluff(100, 148, 56, 60, 30, .045)}" fill="url(#${a})" stroke="#9aa6b6" stroke-opacity=".5" stroke-width="1.6"/>
  ${hgFur(7, 26, 100, 160, 48, 44)}${dirtCoat}
  ${outfit ? outfit.g : ''}
  <g stroke="#b86a00" stroke-width="1.6" stroke-opacity=".6"><path d="M52 203q-5 4 -3 10q10 -1 15 -6" fill="url(#${fe})"/><path d="M148 203q5 4 3 10q-10 -1 -15 -6" fill="url(#${fe})"/></g>
  <ellipse cx="73" cy="204" rx="23" ry="10" fill="url(#${fe})" stroke="#b86a00" stroke-opacity=".6" stroke-width="1.6"/><ellipse cx="127" cy="204" rx="23" ry="10" fill="url(#${fe})" stroke="#b86a00" stroke-opacity=".6" stroke-width="1.6"/>
  <path d="M58 207q4 4 8 0M69 209q4 4 8 0M80 207q4 4 8 0M112 207q4 4 8 0M123 209q4 4 8 0M134 207q4 4 8 0" stroke="#c76b00" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="${hgFluff(100, 78, 49, 49, 26, .05)}" fill="url(#${a})" stroke="#9aa6b6" stroke-opacity=".5" stroke-width="1.6"/>
  ${hgFur(9, 16, 100, 86, 40, 34)}
  <ellipse cx="100" cy="124" rx="38" ry="5" fill="#000" opacity=".1"/>
  ${cheeks(66, 134, 104, 9)}
  ${eyesSVG(80, 120, 86, m, { r: 6.8, c: '#17161d' })}
  <path d="M85 97Q100 89 115 97Q113 114 100 117Q87 114 85 97Z" fill="url(#${c})" stroke="#b86a00" stroke-opacity=".7" stroke-width="2"/><path d="M92 97Q100 93.5 108 97" stroke="#fff" stroke-width="2.2" fill="none" opacity=".7" stroke-linecap="round"/><path d="M89 103Q100 109 111 103" stroke="#b86a00" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round"/>
  ${m === 'eat' ? `<ellipse class="chew" cx="100" cy="109" rx="7" ry="5" fill="#c25f00"/>` : ''}${m === 'sad' ? '<path d="M91 124q9 -7 18 0" stroke="#6b7080" stroke-width="3" fill="none" stroke-linecap="round"/>' : ''}${m === 'wow' ? `<ellipse cx="100" cy="108" rx="6" ry="7" fill="#c25f00"/>` : ''}
  ${scf ? scf.g : ''}
  ${eyewear ? eyewear.g : ''}
  ${hat ? hat.g : ''}
  ${wearSVG(w, anc)}
  </g>`);
};
