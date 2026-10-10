const ACTS = {};
/* ---------- nét vẽ kiểu sách tô màu: đen trắng, viền đậm ---------- */
const INK = '#1a1a1a';
function lum(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }
function inkify(s) {
  return s.replace(/fill="(#[0-9a-fA-F]{3,6})"/g, (m, c) => `fill="${lum(c) < .32 ? INK : '#fff'}"`)
    .replace(/stroke="#[0-9a-fA-F]{3,6}"/g, `stroke="${INK}"`).replace(/opacity="[^"]*"/g, '');
}
const ink = (k, o) => inkify(ART[k](o || {}));
const silh = s => s.replace(/fill="#[0-9a-fA-F]{3,6}"/g, `fill="${INK}"`);
// đặt một hình ART (viewBox 100) vào trong SVG lớn
const place = (svg, x, y, w, h, extra = '') => svg.replace('<svg ', `<svg x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(h ?? w).toFixed(1)}" ${extra} `);
let UID = 0; const uid = p => p + (++UID);
function pane(vb, inner, cls = '') { const d = el('div', 'pane ' + cls); d.innerHTML = `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`; return d; }
function svgPt(svg, e) { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
const TT_CHARS = [['rabbit', 'Thỏ'], ['bear', 'Gấu'], ['cat', 'Mèo'], ['hedgehog', 'Nhím'], ['frog', 'Ếch'], ['dog', 'Cún'], ['mouse', 'Chuột'], ['duck', 'Vịt'], ['chicken', 'Gà con']];
const lvPick = (lv, arr) => arr[Math.min(lv, arr.length - 1)];

/* ===================== 1. MÊ CUNG ===================== */
const MAZE_PAIRS = [['rabbit', 'carrot', 'Thỏ'], ['bee', 'flower', 'Ong'], ['mouse', 'cake', 'Chuột'], ['dog', 'ball', 'Cún'], ['bear', 'basket', 'Gấu'], ['butterfly', 'flower', 'Bướm'], ['hedgehog', 'apple', 'Nhím'], ['chicken', 'house', 'Gà con']];
function makeMaze(n) {
  const W = Array.from({ length: n }, () => Array.from({ length: n }, () => ({ N: 1, S: 1, E: 1, W: 1 })));
  const seen = Array.from({ length: n }, () => Array(n).fill(false)), st = [[0, 0]]; seen[0][0] = true;
  const D = [['N', -1, 0, 'S'], ['S', 1, 0, 'N'], ['E', 0, 1, 'W'], ['W', 0, -1, 'E']];
  while (st.length) {
    const [r, c] = st[st.length - 1];
    const nb = shuf(D).filter(([, dr, dc]) => { const a = r + dr, b = c + dc; return a >= 0 && b >= 0 && a < n && b < n && !seen[a][b]; });
    if (!nb.length) { st.pop(); continue; }
    const [d, dr, dc, o] = nb[0]; W[r][c][d] = 0; W[r + dr][c + dc][o] = 0; seen[r + dr][c + dc] = true; st.push([r + dr, c + dc]);
  }
  return W;
}
function mazeOpen(W, a, b) {
  const [r, c] = a, [r2, c2] = b;
  if (r2 === r - 1 && c2 === c) return !W[r][c].N; if (r2 === r + 1 && c2 === c) return !W[r][c].S;
  if (c2 === c + 1 && r2 === r) return !W[r][c].E; if (c2 === c - 1 && r2 === r) return !W[r][c].W; return false;
}
function mazePath(W, n) {
  const prev = {}, q = [[0, 0]], key = p => p[0] * n + p[1]; prev[0] = -1;
  while (q.length) { const p = q.shift(); if (p[0] === n - 1 && p[1] === n - 1) break;
    [[p[0] - 1, p[1]], [p[0] + 1, p[1]], [p[0], p[1] - 1], [p[0], p[1] + 1]].forEach(x => { if (x[0] < 0 || x[1] < 0 || x[0] >= n || x[1] >= n || prev[key(x)] !== undefined || !mazeOpen(W, p, x)) return; prev[key(x)] = key(p); q.push(x); }); }
  const out = []; let k = key([n - 1, n - 1]); while (k !== -1 && k !== undefined) { out.unshift([Math.floor(k / n), k % n]); k = prev[k]; } return out;
}
ACTS.maze = {
  gen(lv) {
    const n = [4, 4, 5, 5, 6, 6, 7, 7][lv], [who, what, name] = pick1(MAZE_PAIRS);
    return { n, W: makeMaze(n), who, what, ask: `Giúp ${name} tìm đường đến ${nm(what)}.`, say: `Con giúp ${name} tìm đường đến ${nm(what)} nhé. Con dùng ngón tay vẽ đường đi trong mê cung.` };
  },
  check(q) { const p = mazePath(q.W, q.n); return p.length >= q.n && p[0][0] === 0 ? null : 'không có đường'; },
  render(q, st, api) {
    const n = q.n, C = 40, P = 4, Z = n * C + P * 2;
    let w = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const x = P + c * C, y = P + r * C, o = q.W[r][c];
      if (o.N) w += `M${x} ${y}h${C}`; if (o.W) w += `M${x} ${y}v${C}`;
      if (r === n - 1 && o.S) w += `M${x} ${y + C}h${C}`; if (c === n - 1 && o.E) w += `M${x + C} ${y}v${C}`;
    }
    const a = el('div', 'act col');
    const pn = pane(`0 0 ${Z} ${Z}`, `<rect x="${P}" y="${P}" width="${n * C}" height="${n * C}" fill="#fff"/>
      <polyline class="mzpath" points="" fill="none" stroke="#9a9a9a" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>
      ${place(ink(q.what), P + (n - 1) * C + 3, P + (n - 1) * C + 3, C - 6)}
      <path d="${w}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <g class="mzme">${place(ink(q.who), 0, 0, C - 6)}</g>`, 'maze');
    a.appendChild(pn); st.appendChild(a);
    const svg = pn.querySelector('svg'), line = svg.querySelector('.mzpath'), me = svg.querySelector('.mzme');
    let path = [[0, 0]], down = false, done = false;
    const draw = () => {
      line.setAttribute('points', path.map(([r, c]) => `${P + c * C + C / 2},${P + r * C + C / 2}`).join(' '));
      const [r, c] = path[path.length - 1]; me.setAttribute('transform', `translate(${P + c * C + 3} ${P + r * C + 3})`);
    };
    const go = cell => {
      if (done) return; const h = path[path.length - 1];
      if (cell[0] === h[0] && cell[1] === h[1]) return;
      const p2 = path[path.length - 2];
      if (p2 && p2[0] === cell[0] && p2[1] === cell[1]) { path.pop(); draw(); return; }
      if (path.some(p => p[0] === cell[0] && p[1] === cell[1])) { const i = path.findIndex(p => p[0] === cell[0] && p[1] === cell[1]); path = path.slice(0, i + 1); draw(); return; }
      if (!mazeOpen(q.W, h, cell)) return;
      path.push(cell); draw(); sfx.tap && sfx.tap();
      if (cell[0] === n - 1 && cell[1] === n - 1) { done = true; api.ok(pn); }
    };
    const cellAt = e => { const p = svgPt(svg, e); const c = Math.floor((p.x - P) / C), r = Math.floor((p.y - P) / C); return r >= 0 && c >= 0 && r < n && c < n ? [r, c] : null; };
    svg.style.touchAction = 'none';
    svg.addEventListener('pointerdown', e => { down = true; svg.setPointerCapture(e.pointerId); const c = cellAt(e); if (c) go(c); });
    svg.addEventListener('pointermove', e => { if (!down) return; const c = cellAt(e); if (c) go(c); });
    svg.addEventListener('pointerup', () => down = false); svg.addEventListener('pointercancel', () => down = false);
    draw();
    q.explain = 'Con đi theo lối trống, gặp ngõ cụt thì quay lại nhé.';
    api.hint = () => { const sol = mazePath(q.W, n); const nx = sol.find(p => !path.some(x => x[0] === p[0] && x[1] === p[1])); return null; };
    api.solve = () => mazePath(q.W, n).forEach(go);
  }
};

/* ===================== 2. DÂY RỐI ===================== */
const TANGLE_GOODS = ['carrot', 'apple', 'cake', 'ball', 'flower', 'house', 'mushroom', 'balloon', 'candy', 'basket', 'strawberry', 'kite'];
ACTS.tangle = {
  gen(lv) {
    const k = [2, 3, 3, 3, 4, 4, 4, 4][lv], tops = pickN(TT_CHARS, k), goods = pickN(TANGLE_GOODS, k);
    let perm; do { perm = shuf([...Array(k).keys()]); } while (perm.every((v, i) => v === i));
    const askI = [...Array(k).keys()].filter(i => perm[i] !== i)[0] ?? 0;
    const seg = lv >= 5 ? 3 : 2;
    const xs = i => 400 * (i + .5) / k;
    const paths = tops.map((_, i) => {
      const pts = [[xs(i), 62]];
      for (let s = 1; s < seg; s++) pts.push([ri(30, 370), 62 + (226 - 62) * s / seg + ri(-12, 12)]);
      pts.push([xs(perm[i]), 226]);
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let j = 1; j < pts.length; j++) { const [x0, y0] = pts[j - 1], [x1, y1] = pts[j], dy = (y1 - y0) * .55; d += ` C${x0} ${y0 + dy} ${x1} ${y1 - dy} ${x1} ${y1}`; }
      return d;
    });
    const askI2 = pick1([...Array(k).keys()].filter(i => perm[i] !== i));
    const [ck, cn] = tops[askI2];
    return { k, tops, goods, perm, paths, ai: askI2, ans: perm[askI2], ask: `${cn} đi theo sợi dây sẽ đến đâu?`, say: `Con nhìn theo sợi dây của bạn ${cn}. Bạn ${cn} sẽ đến chỗ nào?`,
      explain: `Con dò theo sợi dây từ bạn ${cn} đi xuống, dây dẫn tới ${nm(goods[perm[askI2]])}.` };
  },
  check(q) { return q.perm.length === q.k && new Set(q.perm).size === q.k ? null : 'perm'; },
  render(q, st, api) {
    const xs = i => 400 * (i + .5) / q.k, S = q.k > 3 ? 62 : 70;
    let g = q.paths.map((d, i) => `<path class="tl${i}" d="${d}" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`).join('');
    const ty = 64 - S;
    g += q.tops.map(([k], i) => place(ink(k), xs(i) - S / 2, ty, S)).join('');
    g += q.tops.map(([k], i) => i === q.ai ? `<circle cx="${xs(i)}" cy="${ty + S / 2}" r="${S / 2 + 4}" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="6 5"/>` : '').join('');
    g += q.goods.map((k, j) => `<g class="tg" data-j="${j}" style="cursor:pointer"><rect x="${xs(j) - S / 2 - 4}" y="${232}" width="${S + 8}" height="${S + 6}" rx="12" fill="#fff" stroke="${INK}" stroke-width="2.5"/>${place(ink(k), xs(j) - S / 2, 234, S)}</g>`).join('');
    const a = el('div', 'act col'), pn = pane(`0 ${ty - 8} 400 ${240 + S - ty + 8}`, g, 'tangle'); a.appendChild(pn); st.appendChild(a);
    pn.querySelectorAll('.tg').forEach(t => t.addEventListener('click', () => +t.dataset.j === q.ans ? api.ok(t) : api.bad(t)));
    api.hint = () => { const p = pn.querySelector('.tl' + q.ai); p.setAttribute('stroke-width', '7'); p.setAttribute('stroke', '#777'); return pn.querySelector(`.tg[data-j="${q.ans}"]`); };
    api.solve = () => pn.querySelector(`.tg[data-j="${q.ans}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }
};

/* ===================== 3. MẢNH GHÉP CÒN THIẾU (giấy dán tường) ===================== */
const PAT_T = ['stripe', 'dots', 'check', 'motif', 'zig', 'brick'];
function randPat(t) {
  t = t || pick1(PAT_T);
  if (t === 'stripe') return { t, a: pick1([0, 45, 90, 135]), s: pick1([14, 22]) };
  if (t === 'dots') return { t, f: pick1([0, 1]), s: pick1([22, 30]) };
  if (t === 'check') return { t, s: pick1([18, 28]) };
  if (t === 'motif') return { t, m: pick1(['star', 'heart', 'tri']), f: pick1([0, 1]), s: 34 };
  if (t === 'zig') return { t, a: pick1([0, 90]), s: 20 };
  return { t, s: pick1([16, 24]) };
}
function patMut(p) {   // biến đổi nhỏ (khác rõ khi nhìn)
  const m = [];
  if (p.t === 'stripe') { [0, 45, 90, 135].filter(a => a !== p.a).forEach(a => m.push({ ...p, a })); }
  if (p.t === 'dots' || p.t === 'motif') m.push({ ...p, f: 1 - p.f });
  if (p.t === 'motif') ['star', 'heart', 'tri'].filter(x => x !== p.m).forEach(x => m.push({ ...p, m: x }));
  if (p.t === 'zig') m.push({ ...p, a: 90 - p.a });
  if (p.t === 'check' || p.t === 'brick') m.push({ ...p, s: p.s === 16 || p.s === 18 ? p.s + 12 : p.s - 10 });
  if (p.t === 'dots') m.push({ ...p, s: p.s === 22 ? 32 : 18 });
  return m;
}
function patDef(id, p) {
  const s = p.s, I = `stroke="${INK}"`;
  let body = '', w = s, h = s, tr = '';
  if (p.t === 'stripe') { body = `<rect width="${s}" height="${s}" fill="#fff"/><rect width="${s / 2}" height="${s}" fill="${INK}"/>`; tr = `rotate(${p.a})`; }
  if (p.t === 'dots') body = `<rect width="${s}" height="${s}" fill="#fff"/><circle cx="${s / 2}" cy="${s / 2}" r="${s * .22}" fill="${p.f ? INK : '#fff'}" ${I} stroke-width="2.5"/>`;
  if (p.t === 'check') body = `<rect width="${s}" height="${s}" fill="#fff"/><rect width="${s / 2}" height="${s / 2}" fill="${INK}"/><rect x="${s / 2}" y="${s / 2}" width="${s / 2}" height="${s / 2}" fill="${INK}"/>`;
  if (p.t === 'motif') {
    const f = p.f ? INK : '#fff', c = s / 2, r = s * .3;
    const sh = p.m === 'star' ? `<path d="M${c} ${c - r}l${r * .29} ${r * .6} ${r * .66} ${r * .06}-${r * .5} ${r * .44} ${r * .15} ${r * .64}-${r * .6}-${r * .33}-${r * .6} ${r * .33} ${r * .15}-${r * .64}-${r * .5}-${r * .44} ${r * .66}-${r * .06}z"`
      : p.m === 'heart' ? `<path d="M${c} ${c + r * .9}C${c - r * 1.6} ${c - r * .1} ${c - r * .6} ${c - r * 1.3} ${c} ${c - r * .35}C${c + r * .6} ${c - r * 1.3} ${c + r * 1.6} ${c - r * .1} ${c} ${c + r * .9}z"`
      : `<path d="M${c} ${c - r}L${c + r} ${c + r * .8}H${c - r}z"`;
    body = `<rect width="${s}" height="${s}" fill="#fff"/>${sh} fill="${f}" ${I} stroke-width="2.2" stroke-linejoin="round"/>`;
  }
  if (p.t === 'zig') { body = `<rect width="${s}" height="${s}" fill="#fff"/><path d="M0 ${s * .7}L${s / 2} ${s * .3}L${s} ${s * .7}" fill="none" ${I} stroke-width="3.5"/>`; tr = `rotate(${p.a})`; }
  if (p.t === 'brick') { w = s * 2; body = `<rect width="${w}" height="${s}" fill="#fff"/><path d="M0 0H${w}M0 ${s / 2}H${w}M${s / 2} 0V${s / 2}M${s * 1.5} 0V${s / 2}M${s} ${s / 2}V${s}M0 ${s / 2}V${s}" ${I} stroke-width="2.5"/>`; }
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}" ${tr ? `patternTransform="${tr}"` : ''}>${body}</pattern>`;
}
const sameP = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function holePoly(cx, cy, rx, ry) {
  const n = 10, pts = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2, k = i % 2 ? .62 + R() * .15 : 1; pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]); }
  return pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
}
// vẽ bức tường: nền A, có thể có vùng B (nửa trái/phải, chéo, hình tròn)
function wallSvg(spec, clipPoly, box) {
  const a = uid('pa'), b = uid('pb'), cb = uid('cb'), ch = uid('ch');
  let defs = patDef(a, spec.A) + (spec.B ? patDef(b, spec.B) : ''), reg = '';
  if (spec.B) {
    const sp = spec.sp, shape = sp.k === 'v' ? `<rect x="${sp.x}" y="-10" width="500" height="400"/>` : sp.k === 'h' ? `<rect x="-10" y="${sp.y}" width="500" height="400"/>` : `<circle cx="${sp.x}" cy="${sp.y}" r="${sp.r}"/>`;
    defs += `<clipPath id="${cb}">${shape}</clipPath>`;
    reg = `<rect x="-10" y="-10" width="500" height="400" fill="url(#${b})" clip-path="url(#${cb})"/>` + (sp.k === 'c' ? `<circle cx="${sp.x}" cy="${sp.y}" r="${sp.r}" fill="none" stroke="${INK}" stroke-width="3"/>` : sp.k === 'v' ? `<path d="M${sp.x} -10V400" stroke="${INK}" stroke-width="3"/>` : `<path d="M-10 ${sp.y}H500" stroke="${INK}" stroke-width="3"/>`);
  }
  let body = `<rect x="-10" y="-10" width="500" height="400" fill="url(#${a})"/>${reg}`;
  if (clipPoly) { defs += `<clipPath id="${ch}"><polygon points="${clipPoly}"/></clipPath>`; body = `<g clip-path="url(#${ch})">${body}</g><polygon points="${clipPoly}" fill="none" stroke="${INK}" stroke-width="3"/>`; }
  return `<defs>${defs}</defs>${body}`;
}
ACTS.piece = {
  gen(lv) {
    const two = lv >= 4, nopt = lv < 2 ? 3 : 4;
    const A = randPat(); let B = null, sp = null;
    const cx = two ? 0 : ri(110, 250), cy = two ? 0 : ri(85, 155);
    let hc = [cx, cy];
    if (two) {
      do { B = randPat(); } while (B.t === A.t);
      const k = pick1(['v', 'h', 'c']);
      if (k === 'v') { sp = { k, x: ri(150, 210) }; hc = [sp.x + ri(-12, 12), ri(90, 150)]; }
      else if (k === 'h') { sp = { k, y: ri(105, 135) }; hc = [ri(120, 240), sp.y + ri(-10, 10)]; }
      else { sp = { k, x: ri(170, 190), y: ri(110, 130), r: 70 }; hc = [sp.x + sp.r * .9 * pick1([-1, 1]), sp.y + ri(-12, 12)]; }
    }
    const right = { A, B, sp };
    const opts = [right], key = o => JSON.stringify(o);
    const cands = [];
    if (!two) {
      patMut(A).forEach(m => cands.push({ A: m, B: null, sp: null }));
      if (lv < 2 || cands.length < nopt) PAT_T.filter(t => t !== A.t).forEach(t => cands.push({ A: randPat(t), B: null, sp: null }));
      if (lv >= 2) cands.splice(0, 0, ...shuf(cands.splice(0)));   // trộn
    } else {
      cands.push({ A: B, B: A, sp });                                   // đổi chỗ hai mẫu
      patMut(A).forEach(m => cands.push({ A: m, B, sp }));
      patMut(B).forEach(m => cands.push({ A, B: m, sp }));
      if (sp.k === 'v') cands.push({ A, B, sp: { ...sp, x: sp.x + pick1([-38, 38]) } });
      if (sp.k === 'h') cands.push({ A, B, sp: { ...sp, y: sp.y + pick1([-34, 34]) } });
      cands.push({ A, B: null, sp: null });
    }
    for (const c of shuf(cands)) { if (opts.length >= nopt) break; if (!opts.some(o => key(o) === key(c))) opts.push(c); }
    const rx = two ? 58 : 52, ry = two ? 50 : 46;
    return { right, opts: shuf(opts), hole: holePoly(hc[0], hc[1], rx, ry), hb: [hc[0] - rx - 6, hc[1] - ry - 6, rx * 2 + 12, ry * 2 + 12],
      ask: 'Mảnh nào vừa với chỗ bị rách?', say: 'Giấy dán tường bị rách một miếng. Con tìm mảnh giấy vừa khít với chỗ trống nhé.', explain: 'Con nhìn kỹ hoa văn quanh chỗ rách rồi tìm mảnh có hoa văn giống hệt.' };
  },
  check(q) { const ks = q.opts.map(o => JSON.stringify(o)); return new Set(ks).size === ks.length && ks.includes(JSON.stringify(q.right)) && ks.length >= 3 ? null : 'opts'; },
  render(q, st, api) {
    const a = el('div', 'act col');
    const pic = pane('0 0 360 240', `<rect x="0" y="0" width="360" height="240" fill="#fff"/>${wallSvg(q.right, null)}<polygon points="${q.hole}" fill="#fff" stroke="${INK}" stroke-width="3" stroke-dasharray="7 5"/><rect x="1.5" y="1.5" width="357" height="237" fill="none" stroke="${INK}" stroke-width="3"/>`, 'piece');
    a.appendChild(pic);
    const row = el('div', 'choices');
    q.opts.forEach((o, i) => {
      const b = el('button', 'cbtn pic piece-o', `<svg viewBox="${q.hb.join(' ')}" xmlns="http://www.w3.org/2000/svg">${wallSvg(o, q.hole)}</svg>`);
      b.dataset.v = i; b.onclick = () => o === q.right ? api.ok(b) : api.bad(b); row.appendChild(b);
    });
    a.appendChild(row); st.appendChild(a);
    const ri2 = q.opts.indexOf(q.right);
    api.hint = () => row.children[ri2]; api.solve = () => row.children[ri2].click();
  }
};

/* ===================== 4. BÓNG ===================== */
const SH_POOL = ['apple', 'pear', 'banana', 'strawberry', 'carrot', 'mushroom', 'grapes', 'cherry', 'car', 'teddy', 'balloon', 'kite', 'drum', 'pyramid', 'boat', 'doll',
  'cat', 'dog', 'rabbit', 'duck', 'chicken', 'fish', 'bird', 'butterfly', 'bee', 'hedgehog', 'bear', 'frog', 'mouse', 'snail', 'turtle', 'house', 'tree', 'flower', 'sun', 'star', 'cup', 'umbrella', 'hat', 'cake', 'leaf', 'sock', 'chair', 'basket'];
const SH_SAME = [['apple', 'tomato', 'orange', 'ball', 'cherry'], ['box', 'block', 'table'], ['cat', 'dog', 'bear', 'rabbit', 'mouse', 'hedgehog'], ['duck', 'chicken', 'bird'], ['flower', 'sun', 'star'], ['car', 'boat', 'drum'], ['pear', 'banana', 'carrot', 'strawberry'], ['cup', 'hat', 'basket', 'sock', 'umbrella', 'chair', 'cake']];
ACTS.shadow = {
  gen(lv) {
    const n = lv < 2 ? 3 : 4, rev = lv >= 6 && R() < .6;
    let k, others;
    if (lv < 4) { k = pick1(SH_POOL); others = pickN(SH_POOL.filter(x => x !== k && !SH_SAME.some(g => g.includes(x) && g.includes(k))), n - 1); }
    else { const g = pick1(SH_SAME.filter(g => g.filter(x => SH_POOL.includes(x)).length >= n)); const gg = g.filter(x => SH_POOL.includes(x)); k = pick1(gg); others = pickN(gg.filter(x => x !== k), n - 1); }
    const flip = R() < .5;
    return { k, rev, flip, opts: shuf([k, ...others]), ask: rev ? 'Cái bóng này là của ai?' : `Bóng nào là của ${nm(k)}?`, say: rev ? 'Con nhìn cái bóng màu đen. Đây là bóng của hình nào?' : `Con tìm cái bóng đen đúng của ${nm(k)} nhé.`,
      explain: `Bóng có hình dáng giống hệt ${nm(k)}.` };
  },
  check(q) { return new Set(q.opts).size === q.opts.length && q.opts.includes(q.k) ? null : 'opts'; },
  render(q, st, api) {
    const a = el('div', 'act col');
    const look = (k, sh) => sh ? silh(ink(k, { flip: q.flip })) : ink(k, { flip: q.flip });
    const main = pane('0 0 100 100', place(look(q.k, q.rev), 4, 4, 92), 'shadow'); a.appendChild(main);
    const row = choiceRow(q.opts, (v, b) => v === q.k ? api.ok(b) : api.bad(b), v => look(v, !q.rev));
    row.querySelectorAll('.cbtn').forEach(b => b.classList.add('pic', 'big'));
    a.appendChild(row); st.appendChild(a);
    api.hint = () => row.querySelector(`[data-v="${q.k}"]`); api.solve = () => row.querySelector(`[data-v="${q.k}"]`).click();
  }
};

/* ===================== 5. CHỖ VÔ LÝ ===================== */
const Z_SKY = ['bird', 'butterfly', 'bee', 'balloon', 'kite'], Z_WATER = ['fish', 'turtle', 'duck'], Z_LAND = ['cat', 'dog', 'rabbit', 'hedgehog', 'mouse', 'chicken', 'bear', 'snail', 'tree', 'car', 'flower', 'mushroom', 'house'];
const Z_ODD = { sky: ['car', 'house', 'tree', 'cat', 'dog', 'rabbit', 'bear', 'hedgehog', 'snail', 'fish', 'chair', 'table'], water: ['car', 'house', 'tree', 'cat', 'dog', 'rabbit', 'bear', 'hedgehog', 'mouse', 'chicken', 'bee', 'chair'], land: ['fish'] };
const Z_NAME = { sky: 'trên trời', water: 'dưới nước', land: 'trên cỏ' };
ACTS.wrong = {
  gen(lv) {
    const tot = 4 + Math.floor(lv / 2), zone = pick1(lv < 2 ? ['sky', 'water'] : ['sky', 'water', 'water', 'sky', 'land']);
    const odd = pick1(Z_ODD[zone]);
    const per = { sky: [], land: [], water: [] };
    const want = { sky: Math.ceil((tot - 1) / 3), water: Math.ceil((tot - 1) / 3) }; want.land = tot - 1 - want.sky - want.water;
    per.sky = pickN(Z_SKY.filter(x => x !== odd), want.sky); per.water = Array.from({ length: want.water }, () => pick1(Z_WATER)); per.land = pickN(Z_LAND.filter(x => x !== odd), want.land);
    per[zone].splice(ri(0, per[zone].length), 0, '*');
    const why = odd === 'fish' ? (zone === 'sky' ? 'Cá sống dưới nước, không bay trên trời được.' : 'Cá phải sống dưới nước, không ở trên cỏ.')
      : zone === 'sky' ? `${nm(odd)[0].toUpperCase() + nm(odd).slice(1)} không bay trên trời được.` : `${nm(odd)[0].toUpperCase() + nm(odd).slice(1)} không ở dưới nước.`;
    return { per, odd, zone, ask: 'Hình vẽ này có gì sai?', say: 'Con nhìn kỹ bức tranh. Có một thứ ở sai chỗ. Con chạm vào thứ đó nhé.', explain: why, why };
  },
  check(q) { const all = [...q.per.sky, ...q.per.land, ...q.per.water]; return all.filter(x => x === '*').length === 1 ? null : 'odd'; },
  render(q, st, api) {
    const Y = { sky: [8, 92], land: [110, 196], water: [212, 298] };
    let g = `<rect width="400" height="300" fill="#fff"/>
      <path d="M30 40q10-18 28-10q14-16 30 2q16 2 10 16h-70q-12-2 2-8zM280 28q10-14 26-6q14-10 24 4q14 4 6 14h-58q-10-4 2-12z" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
      <path d="M0 104q50-10 100 0t100 0t100 0t100 0" fill="none" stroke="${INK}" stroke-width="3"/>
      ${[30, 90, 150, 230, 300, 360].map(x => `<path d="M${x} 190l4-12M${x + 6} 190l2-14M${x + 12} 190l-1-11" stroke="${INK}" stroke-width="2"/>`).join('')}
      <path d="M0 204q25-12 50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0V300H0z" fill="#fff" stroke="${INK}" stroke-width="3"/>
      ${[[40, 250], [140, 270], [250, 240], [340, 275]].map(([x, y]) => `<path d="M${x} ${y}q10-6 20 0t20 0" fill="none" stroke="${INK}" stroke-width="2"/>`).join('')}`;
    let k = 0;
    ['sky', 'land', 'water'].forEach(z => {
      const arr = q.per[z], n = arr.length, [y0, y1] = Y[z], S = Math.min(70, y1 - y0 - 6);
      arr.forEach((it, i) => {
        const key = it === '*' ? q.odd : it, x = 400 * (i + .5) / n - S / 2 + ri(-12, 12), y = y0 + (y1 - y0 - S) / 2 + ri(-4, 4);
        g += `<g class="wz" data-o="${it === '*' ? 1 : 0}" style="cursor:pointer"><rect x="${x}" y="${y}" width="${S}" height="${S}" fill="transparent"/>${place(ink(key, { flip: R() < .5 }), x, y, S)}</g>`; k++;
      });
    });
    const a = el('div', 'act col'), pn = pane('0 0 400 300', g, 'wscene'); a.appendChild(pn); st.appendChild(a);
    pn.querySelectorAll('.wz').forEach(t => t.addEventListener('click', () => t.dataset.o === '1' ? api.ok(t, q.why) : api.bad(t)));
    api.hint = () => pn.querySelector('.wz[data-o="1"]');
    api.solve = () => pn.querySelector('.wz[data-o="1"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }
};

/* ===================== 6. ĐẾM HÌNH CHỒNG NHAU ===================== */
const pencilD = L => { const h = L / 2; return `M${-h} -10H${h - 26}L${h} 0L${h - 26} 10H${-h}Z M${h - 26} -10V10 M${h - 10} -3.8L${h} 0L${h - 10} 3.8Z M${-h + 14} -10V10`; };
const brushD = L => { const h = L / 2; return `M${-h} -4H${h - 40}V4H${-h}Z M${h - 40} -7H${h - 28}V7H${h - 40}Z M${h - 28} -8Q${h} -12 ${h} 0Q${h} 12 ${h - 28} 8Z`; };
ACTS.overlap = {
  gen(lv) {
    const n = lv < 2 ? ri(3, 4) : lv < 4 ? ri(4, 6) : ri(5, 8), b = lv >= 6 ? ri(1, 2) : 0, m = n + b;
    const kinds = shuf([...Array(n).fill('p'), ...Array(b).fill('b')]), step = 180 / m;
    const items = kinds.map((kd, i) => ({ kd, a: (i * step + ri(-Math.round(step * .2), Math.round(step * .2)) + 360) % 360 * (R() < .5 ? 1 : 1) + (R() < .5 ? 180 : 0), dx: ri(-14, 14), dy: ri(-14, 14), L: ri(220, 250) }));
    return { n, b, items: shuf(items), ask: 'Có bao nhiêu chiếc bút chì?', say: b ? 'Con đếm xem có bao nhiêu chiếc bút chì. Chú ý: cây bút lông không phải bút chì nhé. Con chạm vào từng chiếc để đếm.' : 'Các chiếc bút chì nằm chồng lên nhau. Con chạm vào từng chiếc để đếm nhé.',
      opts: nums(n, 1, 10), explain: `Đếm từng đầu bút nhọn: có ${n} chiếc bút chì.` };
  },
  check(q) { const a = q.items.map(i => i.a % 180).sort((x, y) => x - y); for (let i = 1; i < a.length; i++) if (a[i] - a[i - 1] < 180 / a.length * .55) return 'gần'; return q.opts.includes(q.n) ? null : 'opts'; },
  render(q, st, api) {
    const w = q.items.length >= 8 ? .85 : 1;
    let g = `<rect width="300" height="300" fill="#fff"/>`;
    q.items.forEach((it, i) => { g += `<g class="pc" data-i="${i}" transform="translate(${150 + it.dx} ${150 + it.dy}) rotate(${it.a}) scale(1 ${w})" style="cursor:pointer"><path d="${it.kd === 'p' ? pencilD(it.L) : brushD(it.L)}" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>`; });
    g += '<g class="marks"></g>';
    const a = el('div', 'act col'), pn = pane('0 0 300 300', g, 'overlap'); a.appendChild(pn);
    a.appendChild(choiceRow(q.opts, (v, b) => v === q.n ? api.ok(b) : api.bad(b))); st.appendChild(a);
    const marks = pn.querySelector('.marks'); let c = 0;
    pn.querySelectorAll('.pc').forEach(p => p.addEventListener('click', () => {
      const it = q.items[+p.dataset.i]; if (p.dataset.c || it.kd !== 'p') { if (it.kd !== 'p') { p.classList.remove('shake'); void p.getBBox(); } return; }
      p.dataset.c = ++c; const t = it.a * Math.PI / 180, x = 150 + it.dx + Math.cos(t) * (it.L / 2 - 30), y = 150 + it.dy + Math.sin(t) * (it.L / 2 - 30);
      marks.insertAdjacentHTML('beforeend', `<circle cx="${x}" cy="${y}" r="13" fill="${INK}"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="17" font-weight="800" fill="#fff" font-family="Baloo 2,sans-serif">${c}</text>`);
      sfx.tap(); speak(String(c), { quiet: true });
    }));
    api.hint = () => a.querySelector(`.cbtn[data-v="${q.n}"]`); api.solve = () => api.hint().click();
  }
};

/* ===================== 7. QUY LUẬT – TIẾP CHUỖI ===================== */
const SQ_SH = ['circle', 'square', 'tri', 'star', 'heart', 'diamond'];
function tileSvg(t, x, y, S = 56) {
  const c = S / 2, r = S * .34, f = t.f === 'b' ? INK : '#fff', hid = uid('h');
  const fill = t.f === 'h' ? `url(#${hid})` : f, I = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  let s = '';
  if (t.n) { const pos = [[.5, .5], [.3, .3, .7, .7], [.25, .25, .5, .5, .75, .75], [.3, .3, .7, .3, .3, .7, .7, .7], [.25, .25, .75, .25, .5, .5, .25, .75, .75, .75]][t.n - 1];
    for (let i = 0; i < pos.length; i += 2) s += `<circle cx="${pos[i] * S}" cy="${pos[i + 1] * S}" r="${S * .09}" fill="${INK}"/>`; }
  else if (t.sh === 'arrow') s = `<path d="M${c} ${c - r}L${c + r * .8} ${c}H${c + r * .3}V${c + r}H${c - r * .3}V${c}H${c - r * .8}Z" fill="${fill}" ${I} transform="rotate(${t.rot || 0} ${c} ${c})"/>`;
  else {
    const d = { circle: `<circle cx="${c}" cy="${c}" r="${r}"`, square: `<rect x="${c - r * .9}" y="${c - r * .9}" width="${r * 1.8}" height="${r * 1.8}"`, tri: `<path d="M${c} ${c - r}L${c + r} ${c + r * .8}H${c - r}Z"`,
      diamond: `<path d="M${c} ${c - r}L${c + r} ${c}L${c} ${c + r}L${c - r} ${c}Z"`, heart: `<path d="M${c} ${c + r * .9}C${c - r * 1.6} ${c - r * .1} ${c - r * .6} ${c - r * 1.3} ${c} ${c - r * .35}C${c + r * .6} ${c - r * 1.3} ${c + r * 1.6} ${c - r * .1} ${c} ${c + r * .9}z"`,
      star: `<path d="M${c} ${c - r}l${r * .29} ${r * .6} ${r * .66} ${r * .06}-${r * .5} ${r * .44} ${r * .15} ${r * .64}-${r * .6}-${r * .33}-${r * .6} ${r * .33} ${r * .15}-${r * .64}-${r * .5}-${r * .44} ${r * .66}-${r * .06}z"` }[t.sh];
    s = `${d} fill="${fill}" ${I}/>`;
  }
  const defs = t.f === 'h' ? `<defs><pattern id="${hid}" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)"><rect width="7" height="7" fill="#fff"/><rect width="3" height="7" fill="${INK}"/></pattern></defs>` : '';
  return `<g transform="translate(${x} ${y})">${defs}${s}</g>`;
}
const tkey = t => JSON.stringify(t);
ACTS.seq = {
  gen(lv) {
    const kinds = [['ab', 'aab'], ['ab', 'abb', 'aab'], ['abc', 'aab', 'grow'], ['abc', 'abb', 'grow'], ['rot', 'abc', 'fill'], ['rot', 'fill', 'grow'], ['two', 'rot', 'abcd'], ['two', 'abcd', 'fill']][lv];
    const kd = pick1(kinds), L = lv < 2 ? 6 : 7;
    const sh = pickN(SQ_SH, 4), f0 = lv < 4 ? 'w' : pick1(['w', 'b']);
    let at;
    if (kd === 'grow') { const s0 = 1; at = i => ({ n: Math.min(5, s0 + i) }); }
    else if (kd === 'rot') { const d = pick1([90, -90]); at = i => ({ sh: 'arrow', rot: (i * d % 360 + 360) % 360, f: 'w' }); }
    else if (kd === 'fill') { const fl = ['w', 'b', 'h']; at = i => ({ sh: sh[0], f: fl[i % 3] }); }
    else if (kd === 'two') { const fl = ['w', 'b']; at = i => ({ sh: sh[i % 3], f: fl[i % 2] }); }
    else { const pat = { ab: [0, 1], aab: [0, 0, 1], abb: [0, 1, 1], abc: [0, 1, 2], abcd: [0, 1, 2, 3] }[kd]; at = i => ({ sh: sh[pat[i % pat.length]], f: f0 }); }
    let len = L; if (kd === 'grow') len = 4;
    const seq = Array.from({ length: len }, (_, i) => at(i)), ans = at(len);
    // phương án nhiễu
    const pool = [];
    for (let i = 0; i < len + 3; i++) pool.push(at(i));
    if (kd === 'grow') pool.push({ n: ans.n - 1 }, { n: Math.max(1, ans.n - 2) }, { n: 3 });
    if (kd === 'rot') [0, 90, 180, 270].forEach(r => pool.push({ sh: 'arrow', rot: r, f: 'w' }));
    if (kd === 'two' || kd === 'fill') pool.push({ ...ans, f: ans.f === 'b' ? 'w' : 'b' });
    sh.forEach(s => pool.push({ sh: s, f: ans.f || f0 }));
    const opts = [ans];
    for (const p of shuf(pool)) { if (opts.length >= 3) break; if (!opts.some(o => tkey(o) === tkey(p)) && !(p.n === 0)) opts.push(p); }
    return { kd, seq, ans, opts: shuf(opts), ask: 'Hình nào tiếp theo?', say: 'Con nhìn quy luật của dãy hình. Hình nào sẽ ở chỗ dấu hỏi?', explain: kd === 'grow' ? 'Mỗi ô có thêm một chấm.' : kd === 'rot' ? 'Mũi tên quay đều mỗi lần một góc vuông.' : 'Các hình lặp lại theo một nhóm giống nhau.' };
  },
  check(q) { const ks = q.opts.map(tkey); return new Set(ks).size === 3 && ks.includes(tkey(q.ans)) && (q.ans.n == null || q.ans.n <= 5) ? null : 'opts'; },
  render(q, st, api) {
    const n = q.seq.length + 1, S = 56, G = 10, cols = n > 5 && st.clientWidth < 560 ? Math.ceil(n / 2) : n, rows = Math.ceil(n / cols), W = cols * (S + G) + G;
    const X = i => G + (i % cols) * (S + G), Y = i => G + Math.floor(i / cols) * (S + G + 8);
    let g = q.seq.map((t, i) => `<rect x="${X(i)}" y="${Y(i)}" width="${S}" height="${S}" rx="10" fill="#fff" stroke="${INK}" stroke-width="2.5"/>` + tileSvg(t, X(i), Y(i), S)).join('');
    g += `<rect class="qslot" x="${X(n - 1)}" y="${Y(n - 1)}" width="${S}" height="${S}" rx="10" fill="#fff" stroke="${INK}" stroke-width="3" stroke-dasharray="6 5"/><text class="qmark" x="${X(n - 1) + S / 2}" y="${Y(n - 1) + S / 2 + 12}" text-anchor="middle" font-size="34" font-weight="800" font-family="Baloo 2,sans-serif" fill="#aaa">?</text><g class="qfill"></g>`;
    const a = el('div', 'act col'), pn = pane(`0 0 ${W} ${rows * (S + G + 8) + G - 8}`, g, 'seq'); a.appendChild(pn);
    const row = el('div', 'choices');
    q.opts.forEach((o, i) => { const b = el('button', 'cbtn pic', `<svg viewBox="0 0 ${S} ${S}">${tileSvg(o, 0, 0, S)}</svg>`); b.dataset.v = i;
      b.onclick = () => { if (tkey(o) === tkey(q.ans)) { pn.querySelector('.qmark').remove(); pn.querySelector('.qfill').innerHTML = tileSvg(o, X(n - 1), Y(n - 1), S); api.ok(b); } else api.bad(b); }; row.appendChild(b); });
    a.appendChild(row); st.appendChild(a);
    const ci = q.opts.findIndex(o => tkey(o) === tkey(q.ans));
    api.hint = () => row.children[ci]; api.solve = () => row.children[ci].click();
  }
};

/* ===================== 8. NỐI ĐIỂM ===================== */
const DOT_SHAPES = [
  { name: 'cái diều', p: [[50, 8], [82, 40], [50, 92], [18, 40]] },
  { name: 'ngôi nhà', p: [[50, 8], [92, 44], [76, 44], [76, 88], [24, 88], [24, 44], [8, 44]] },
  { name: 'ngôi nhà', p: [[50, 12], [86, 44], [86, 88], [14, 88], [14, 44]] },
  { name: 'chiếc thuyền', p: [[50, 8], [80, 56], [92, 60], [76, 86], [24, 86], [8, 60], [50, 60]] },
  { name: 'vương miện', p: [[12, 84], [12, 30], [31, 56], [50, 18], [69, 56], [88, 30], [88, 84]] },
  { name: 'cái cốc', p: [[20, 18], [70, 18], [70, 34], [88, 34], [88, 62], [70, 62], [66, 88], [24, 88]] },
  { name: 'con cá', p: [[8, 50], [28, 30], [54, 24], [74, 40], [94, 24], [94, 76], [74, 60], [54, 76], [28, 70]] },
  { name: 'ngôi sao', p: [...Array(10)].map((_, i) => { const t = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 19 : 44; return [50 + r * Math.cos(t), 54 + r * Math.sin(t)]; }) },
  { name: 'trái tim', p: [[50, 90], [24, 66], [10, 44], [14, 22], [32, 12], [50, 26], [68, 12], [86, 22], [90, 44], [76, 66]] },
  { name: 'cây thông', p: [[50, 6], [72, 34], [62, 34], [82, 60], [58, 60], [58, 90], [42, 90], [42, 60], [18, 60], [38, 34], [28, 34]] }
];
ACTS.dots = {
  gen(lv) {
    const pool = DOT_SHAPES.filter(s => lv < 2 ? s.p.length <= 5 : lv < 4 ? s.p.length >= 5 && s.p.length <= 8 : s.p.length >= 8 && s.p.length <= (lv < 6 ? 10 : 11));
    const s = pick1(pool); let pts = s.p.map(p => p.slice());
    if (lv >= 6) { const k = ri(0, pts.length - 1); pts = pts.slice(k).concat(pts.slice(0, k)); if (R() < .5) pts = [pts[0], ...pts.slice(1).reverse()]; }
    return { name: s.name, pts, ask: `Nối các chấm theo thứ tự 1, 2, 3… Con sẽ thấy hình gì?`, say: 'Con nối các chấm theo thứ tự số một, hai, ba. Xem con vẽ được hình gì nhé.', explain: 'Con tìm số tiếp theo rồi nối tới đó.' };
  },
  check(q) { for (let i = 0; i < q.pts.length; i++) for (let j = i + 1; j < q.pts.length; j++) if (Math.hypot(q.pts[i][0] - q.pts[j][0], q.pts[i][1] - q.pts[j][1]) < 9.5) return 'gần'; return q.pts.length <= 11 ? null : 'nhiều'; },
  render(q, st, api) {
    const P = q.pts, cx = P.reduce((a, p) => a + p[0], 0) / P.length, cy = P.reduce((a, p) => a + p[1], 0) / P.length;
    let g = `<rect x="-14" y="-14" width="128" height="128" fill="#fff"/><polygon class="dfill" points="" fill="#eee" stroke="none"/><polyline class="dline" points="" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    P.forEach(([x, y], i) => {
      const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1, lx = x + dx / d * 8, ly = y + dy / d * 8 + 2.5;
      g += `<g class="dt" data-i="${i}"><circle cx="${x}" cy="${y}" r="7" fill="transparent"/><circle class="dd" cx="${x}" cy="${y}" r="2.6" fill="${INK}"/><text x="${lx}" y="${ly}" text-anchor="middle" font-size="7" font-weight="800" font-family="Baloo 2,sans-serif" fill="${INK}">${i + 1}</text></g>`;
    });
    const a = el('div', 'act col'), pn = pane('-14 -14 128 128', g, 'dots'); a.appendChild(pn); st.appendChild(a);
    const svg = pn.querySelector('svg'), line = svg.querySelector('.dline'); let k = 0, down = false;
    const nodes = [...svg.querySelectorAll('.dt')];
    const redraw = () => { line.setAttribute('points', P.slice(0, k).map(p => p.join(',')).join(' ') + (k === P.length ? ' ' + P[0].join(',') : '')); nodes.forEach((n, i) => n.querySelector('.dd').setAttribute('r', i < k ? 3.4 : i === k ? 3.4 : 2.6)); };
    const hit = e => { const p = svgPt(svg, e); let best = -1, bd = 9; P.forEach((q2, i) => { const d = Math.hypot(q2[0] - p.x, q2[1] - p.y); if (d < bd) { bd = d; best = i; } }); return best; };
    const take = (i, tap) => {
      if (k >= P.length || i < 0) return;
      if (i === k) { k++; redraw(); sfx.tap(); speak(String(k), { quiet: true }); if (k === P.length) { svg.querySelector('.dfill').setAttribute('points', P.map(p => p.join(',')).join(' ')); redraw(); api.ok(pn, `Đó là ${q.name}!`); } }
      else if (tap && i >= k) api.bad(nodes[i]);
    };
    svg.style.touchAction = 'none';
    svg.addEventListener('pointerdown', e => { down = true; svg.setPointerCapture(e.pointerId); take(hit(e), true); });
    svg.addEventListener('pointermove', e => { if (down) { const i = hit(e); if (i === k) take(i, false); } });
    svg.addEventListener('pointerup', () => down = false); svg.addEventListener('pointercancel', () => down = false);
    redraw();
    api.hint = () => nodes[k]; api.solve = () => { while (k < P.length) take(k, true); };
  }
};

/* ===================== 9. ĐỐI XỨNG (soi gương) ===================== */
ACTS.mirror = {
  gen(lv) {
    const h = [2, 2, 2, 3, 3, 3, 4, 4][lv], r = [3, 3, 4, 4, 4, 5, 5, 5][lv];
    let L; do { L = Array.from({ length: r }, () => Array.from({ length: h }, () => R() < .42 ? 1 : 0)); } while (L.flat().reduce((a, b) => a + b, 0) < Math.max(2, Math.floor(r * h * .3)) || L.flat().every(x => x));
    return { h, r, L, ask: 'Tô các ô bên phải cho giống soi gương.', say: 'Đường kẻ ở giữa là chiếc gương. Con chạm vào các ô bên phải để tô cho giống hình bên trái trong gương nhé. Xong rồi con bấm nút Xong.', explain: 'Ô nào sát gương bên trái thì ô sát gương bên phải cũng tô.' };
  },
  check(q) { return q.L.flat().some(x => x) ? null : 'trống'; },
  render(q, st, api) {
    const C = 40, W = q.h * 2 * C, H = q.r * C, cur = Array.from({ length: q.r }, () => Array(q.h).fill(0));
    let g = `<rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>`;
    for (let i = 0; i < q.r; i++) for (let j = 0; j < q.h * 2; j++) {
      const left = j < q.h, on = left && q.L[i][j];
      g += `<rect class="${left ? '' : 'mc'}" data-r="${i}" data-c="${j - q.h}" x="${j * C}" y="${i * C}" width="${C}" height="${C}" fill="${on ? INK : '#fff'}" stroke="${INK}" stroke-width="1.6" style="${left ? '' : 'cursor:pointer'}"/>`;
    }
    g += `<path d="M${W / 2} -6V${H + 6}" stroke="${INK}" stroke-width="5" stroke-dasharray="9 6"/>`;
    const a = el('div', 'act col'), pn = pane(`-8 -8 ${W + 16} ${H + 16}`, g, 'mirror'); a.appendChild(pn);
    const go = el('button', 'cbtn ok', 'Xong'); const row = el('div', 'choices'); row.appendChild(go); a.appendChild(row); st.appendChild(a);
    const cell = (i, j) => pn.querySelector(`.mc[data-r="${i}"][data-c="${j}"]`);
    pn.querySelectorAll('.mc').forEach(c => c.addEventListener('click', () => { const i = +c.dataset.r, j = +c.dataset.c; cur[i][j] ^= 1; c.setAttribute('fill', cur[i][j] ? INK : '#fff'); sfx.tap(); }));
    const want = (i, j) => q.L[i][q.h - 1 - j];
    const firstBad = () => { for (let i = 0; i < q.r; i++) for (let j = 0; j < q.h; j++) if (cur[i][j] !== want(i, j)) return [i, j]; return null; };
    go.onclick = () => { const b = firstBad(); if (!b) api.ok(go); else { api.bad(null); const c = cell(b[0], b[1]); c.setAttribute('stroke-width', '4'); setTimeout(() => c.setAttribute('stroke-width', '1.6'), 900); } };
    api.hint = () => null;
    api.solve = () => { for (let i = 0; i < q.r; i++) for (let j = 0; j < q.h; j++) if (cur[i][j] !== want(i, j)) cell(i, j).dispatchEvent(new MouseEvent('click', { bubbles: true })); go.click(); };
  }
};

/* ===================== 10. ĐỒNG HỒ ===================== */
function clockInk(h) {
  const a = (h % 12) * 30 * Math.PI / 180;
  let s = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  for (let i = 1; i <= 12; i++) { const t = i * 30 * Math.PI / 180; s += `<text x="${50 + 34 * Math.sin(t)}" y="${50 - 34 * Math.cos(t) + 4.5}" text-anchor="middle" font-size="12" font-weight="800" font-family="Baloo 2,sans-serif" fill="${INK}">${i}</text>`; }
  s += `<path d="M50 50L${50 + 21 * Math.sin(a)} ${50 - 21 * Math.cos(a)}" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/><path d="M50 50V18" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><circle cx="50" cy="50" r="3.6" fill="${INK}"/></svg>`;
  return s;
}
const hourOpts = (h, n = 3) => { const s = new Set([h]); while (s.size < n) { const v = ((h + pick1([-3, -2, -1, 1, 2, 3, 6]) - 1) % 12 + 12) % 12 + 1; s.add(v); } return shuf([...s]); };
ACTS.time = {
  gen(lv) {
    const mode = lv < 2 ? 'read' : lv < 4 ? pick1(['pick', 'read']) : lv < 6 ? 'after' : pick1(['after', 'before']);
    if (mode === 'read' || mode === 'pick') { const h = ri(1, 12); return { mode, h, ans: h, opts: hourOpts(h), ask: mode === 'read' ? 'Đồng hồ chỉ mấy giờ?' : `Đồng hồ nào chỉ ${h} giờ?`, say: mode === 'read' ? 'Kim ngắn chỉ giờ. Đồng hồ đang chỉ mấy giờ?' : `Con tìm đồng hồ chỉ ${h} giờ nhé. Kim dài chỉ số mười hai, kim ngắn chỉ số ${h}.`, explain: `Kim ngắn chỉ số ${h}, kim dài chỉ số 12: ${h} giờ.` }; }
    const k = ri(1, lv < 6 ? 2 : 3);
    const h = mode === 'after' ? ri(1, 12 - k) : ri(1 + k, 12), ans = mode === 'after' ? h + k : h - k;
    return { mode, h, k, ans, opts: hourOpts(ans), ask: mode === 'after' ? `Thêm ${k} giờ nữa là mấy giờ?` : `${k} giờ trước là mấy giờ?`, say: mode === 'after' ? `Bây giờ là ${h} giờ. Thêm ${k} giờ nữa là mấy giờ?` : `Bây giờ là ${h} giờ. Cách đây ${k} giờ là mấy giờ?`, explain: mode === 'after' ? `${h} giờ, đếm thêm ${k}: ${ans} giờ.` : `${h} giờ, đếm lùi ${k}: ${ans} giờ.` };
  },
  check(q) { return q.opts.includes(q.ans) && q.ans >= 1 && q.ans <= 12 && new Set(q.opts).size === 3 ? null : 'opts'; },
  render(q, st, api) {
    const a = el('div', 'act col');
    if (q.mode === 'pick') {
      const g = el('div', 'grp pickable big clocks'); q.opts.forEach(v => { const b = el('button', 'it', clockInk(v)); b.dataset.v = v; b.onclick = () => v === q.ans ? api.ok(b) : api.bad(b); g.appendChild(b); });
      a.appendChild(g); st.appendChild(a); api.hint = () => g.querySelector(`[data-v="${q.ans}"]`);
    } else {
      a.appendChild(pane('0 0 100 100', place(clockInk(q.h), 2, 2, 96), 'clock'));
      a.appendChild(choiceRow(q.opts, (v, b) => v === q.ans ? api.ok(b) : api.bad(b), v => v + ' giờ')); st.appendChild(a);
      api.hint = () => a.querySelector(`.cbtn[data-v="${q.ans}"]`);
    }
    api.solve = () => api.hint().click();
  }
};

/* ===================== 11. TOÁN VUI: THƯ VÀ HỘP THƯ ===================== */
const ENV_SVG = `<svg viewBox="0 0 100 64" class="env" aria-hidden="true"><rect x="3" y="3" width="94" height="58" rx="5" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M3 6L50 38L97 6" fill="none" stroke="${INK}" stroke-width="3.5"/></svg>`;
const BOX_SVG = `<svg viewBox="0 0 100 70" class="mbox" aria-hidden="true"><rect x="4" y="8" width="92" height="58" rx="8" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="22" y="22" width="56" height="10" rx="4" fill="${INK}"/></svg>`;
ACTS.mail = {
  gen(lv) {
    const k = lv < 2 ? 2 : 3, max = lv < 4 ? 5 : 10, minus = lv >= 6;
    const vals = pickN([...Array(max - 1).keys()].map(x => x + 2), k);
    const items = vals.map(v => { if (minus && R() < .5) { const a = ri(v + 1, Math.min(10, v + 5)); return { v, t: `${a} − ${a - v}` }; } const a = ri(1, v - 1); return { v, t: `${a} + ${v - a}` }; });
    const boxes = shuf(lv >= 6 ? [...vals, pick1([...Array(max).keys()].map(x => x + 1).filter(x => !vals.includes(x)))] : vals.slice());
    return { items, boxes, ask: 'Đưa mỗi lá thư vào hộp thư có số đúng.', say: 'Mỗi lá thư có một phép tính. Con tính xem bằng mấy, rồi chạm lá thư và chạm vào hộp thư có số đó nhé.', explain: 'Con tính phép tính trên lá thư rồi tìm hộp có số bằng kết quả.' };
  },
  check(q) { return new Set(q.items.map(i => i.v)).size === q.items.length && q.items.every(i => q.boxes.includes(i.v) && (i.t.includes('+') ? i.t.split(' + ').reduce((x, y) => +x + +y) : i.t.split(' − ').reduce((x, y) => +x - +y)) === i.v) ? null : 'mail'; },
  render(q, st, api) {
    const a = el('div', 'act mail'), top = el('div', 'choices envs'), bot = el('div', 'choices boxes');
    let sel = null, left = q.items.length;
    const pickE = b => { top.querySelectorAll('.envb').forEach(x => x.classList.remove('on')); sel = b; b.classList.add('on'); sfx.tap(); };
    const put = (e, bx) => {
      if (+e.dataset.v !== +bx.dataset.v) { api.bad(bx); return false; }
      e.style.visibility = 'hidden'; e.classList.remove('on'); sel = null; bx.classList.add('got'); bx.querySelector('.cnt').textContent = '✓';
      if (--left === 0) api.ok(bx); else api.good(bx); return true;
    };
    q.items.forEach(it => { const b = el('button', 'cbtn envb', `${ENV_SVG}<b>${it.t.replace('−', '&minus;')}</b>`); b.dataset.v = it.v; b.onclick = () => pickE(b);
      makeDrag(b, z => put(b, z)); top.appendChild(b); });
    q.boxes.forEach(v => { const b = el('button', 'cbtn boxb dz', `${BOX_SVG}<b>${v}</b><i class="cnt"></i>`); b.dataset.v = v; b.onclick = () => { if (!sel) { toast('Con chạm vào một lá thư trước nhé'); return; } put(sel, b); }; bot.appendChild(b); });
    a.append(top, bot); st.appendChild(a);
    api.hint = () => { const e = sel || [...top.children].find(x => x.style.visibility !== 'hidden'); return e && bot.querySelector(`[data-v="${e.dataset.v}"]`); };
    api.solve = () => [...top.children].forEach(e => { if (e.style.visibility === 'hidden') return; e.click(); bot.querySelector(`[data-v="${e.dataset.v}"]`).click(); });
  }
};

/* ===================== 12. CÂN THĂNG BẰNG ===================== */
const SCALE_ITEMS = ['apple', 'pear', 'carrot', 'mushroom', 'strawberry', 'candy', 'ball', 'block'];
ACTS.scale = {
  gen(lv) {
    const max = lv < 4 ? 5 : 10, a = ri(lv < 2 ? 2 : 3, max), b = ri(lv < 2 ? Math.max(1, a - 2) : 0, a - 1), k = pick1(SCALE_ITEMS);
    return { a, b, k, ans: a - b, opts: nums(a - b, 1, max), ask: `Thêm mấy ${un(k)} vào đĩa bên phải để cân thăng bằng?`, say: `Bên trái có ${a} ${nm(k)}, bên phải có ${b}. Cần thêm mấy ${un(k)} vào bên phải để hai bên bằng nhau?`, explain: `${a} bớt ${b} còn ${a - b}. Thêm ${a - b} ${un(k)} thì hai bên bằng nhau.` };
  },
  check(q) { return q.ans >= 1 && q.opts.includes(q.ans) ? null : 'ans'; },
  render(q, st, api) {
    const S = 30, pan = (cx, n) => { let s = ''; for (let i = 0; i < n; i++) { const row = Math.floor(i / 5), col = i % 5, cnt = row ? n - 5 : Math.min(5, n); s += place(ink(q.k), cx - cnt * S / 2 + col * S, 148 - (row + 1) * S, S); } return s; };
    const g = `<rect width="460" height="240" fill="#fff"/><path d="M230 52V214M186 228H274L230 208Z" stroke="${INK}" stroke-width="5" fill="#fff" stroke-linejoin="round"/>
      <path d="M100 52H360" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="230" cy="52" r="8" fill="${INK}"/>
      <path d="M100 52L22 148M100 52L178 148M360 52L282 148M360 52L438 148" stroke="${INK}" stroke-width="2"/>
      <path d="M14 148H186Q176 172 100 172Q24 172 14 148ZM274 148H446Q436 172 360 172Q284 172 274 148Z" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
      ${pan(100, q.a)}${pan(360, q.b)}<text x="360" y="200" text-anchor="middle" font-size="24" font-weight="800" font-family="Baloo 2,sans-serif" fill="${INK}">+ ?</text>`;
    const a = el('div', 'act col'); a.appendChild(pane('0 0 460 240', g, 'scale'));
    a.appendChild(choiceRow(q.opts, (v, b) => v === q.ans ? api.ok(b) : api.bad(b))); st.appendChild(a);
    api.hint = () => a.querySelector(`.cbtn[data-v="${q.ans}"]`); api.solve = () => api.hint().click();
  }
};
