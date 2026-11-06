/* Hành trình của Jenny — phần chung của bản lớp 6 và tiểu học (P-19): hình vẽ, tiến độ, âm thanh, bản đồ, vườn, sao lưu, mở kho bài.
   Trang nạp theo thứ tự:
     1. <script> const SAGA = { key, back, islands, colsTall, query, fresh } </script>   (khoá lưu giữ nguyên tên cũ)
     2. ../_saga/khoi-phuc.js, ../_saga/saga.js (file này)
     3. <script> Trạm toán riêng của trang (drawMath, fitText, ...) rồi bootSaga(); </script>
   Không bọc hàm: các khai báo let/const ở đây dùng chung phạm vi toàn cục với script Trạm toán của trang.
   Móc tuỳ chọn của trang: SAGA.onShow(v), beforeTab(v) → true để chặn, setRow() → HTML thêm vào bảng tiến độ, setReady(panel), onStart(), afterStart(). */
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const KEY = SAGA.key, CODEKEY = 'jenny-club-code' /* chỉ giữ trong phiên (sessionStorage), máy dùng chung không lộ mã */, BACK = SAGA.back;
const EN_MAX = 10, DAY_XU = 300, XU = [10, 20, 40], EN = [1, 1, 2], DIFF = ['Dễ', 'Vừa', 'Khó'];

/* ================= art ================= */
const K = 'stroke="#1D2B53" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
const I = {
  bolt: `<svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="#FFC93C" ${K}/></svg>`,
  coin: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#FFC93C" ${K}/><circle cx="12" cy="12" r="5.5" fill="none" stroke="#C98A00" stroke-width="2"/></svg>`,
  star: `<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.2 6.6.7-5 4.5 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z" fill="currentColor" stroke="#1D2B53" stroke-width="1.4" stroke-linejoin="round" style="color:#FFC93C"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V14M4 10V4M12 20V12M12 8V4M20 20V16M20 12V4M2 14h4M10 8h4M18 16h4"/></svg>`,
  snd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>`,
  left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`,
  right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>`,
  map: `<svg viewBox="0 0 24 24"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="#DCEBFF" ${K}/><path d="M9 4v14M15 6v14" ${K} fill="none"/></svg>`,
  calc: `<svg viewBox="0 0 24 24"><rect x="4" y="2.5" width="16" height="19" rx="3" fill="#D5F6E8" ${K}/><rect x="7" y="5.5" width="10" height="4" rx="1" fill="#fff" ${K} stroke-width="1.8"/><path d="M8 13.5h0M12 13.5h0M16 13.5h0M8 17.5h0M12 17.5h0M16 17.5h0" ${K} stroke-width="3"/></svg>`,
  sprout: `<svg viewBox="0 0 24 24"><path d="M12 21v-9" ${K} fill="none"/><path d="M12 13C12 8 8 6 4 6c0 4 3 7 8 7zM12 11c0-4 3-7 8-7 0 5-3 7-8 7z" fill="#2DBE8C" ${K}/><path d="M5 21h14" ${K}/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h3l2.4 11h10.2L21 7H7"/><circle cx="10" cy="19.5" r="1.6"/><circle cx="17" cy="19.5" r="1.6"/></svg>`,
  swap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H20v14H9l-6-7z"/><path d="M12 9l5 6M17 9l-5 6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>`,
  lock: `<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="#B8C6DD" ${K}/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" ${K}/></svg>`,
  jenny: `<svg class="jsvg" viewBox="0 0 120 140" aria-hidden="true" stroke="#1D2B53" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 70 Q14 28 60 18 Q106 28 98 70 Q101 90 93 101 L84 97 Q88 82 86 66 L34 66 Q32 82 36 97 L27 101 Q19 90 22 70 Z" fill="#2B1E1A"/><ellipse cx="60" cy="63" rx="26" ry="29" fill="#FFDCC2"/><path d="M34 58 Q38 32 64 31 Q86 33 87 56 Q78 45 66 46 Q60 38 50 47 Q42 47 34 58 Z" fill="#2B1E1A"/><ellipse cx="50" cy="65" rx="3.2" ry="4.2" fill="#1D2B53"/><ellipse cx="70" cy="65" rx="3.2" ry="4.2" fill="#1D2B53"/><circle cx="51" cy="63.5" r="1" fill="#fff" stroke="none"/><circle cx="71" cy="63.5" r="1" fill="#fff" stroke="none"/><ellipse cx="42" cy="75" rx="4.5" ry="2.6" fill="#FF9E8C" stroke="none"/><ellipse cx="78" cy="75" rx="4.5" ry="2.6" fill="#FF9E8C" stroke="none"/><path class="m-norm" d="M52 78 q8 7 16 0" fill="none"/><path class="m-happy" d="M50 77 q10 13 20 0 z" fill="#B3261E"/><ellipse class="m-oops" cx="60" cy="81" rx="3.4" ry="4" fill="#B3261E"/><path d="M54 91 v7 M66 91 v7" fill="none"/><path d="M22 124 L34 104 Q44 99 54 98 Q60 103 66 98 Q76 99 86 104 L98 124 L88 128 L86 121 L86 139 L34 139 L34 121 L32 128 Z" fill="#8E6BD8"/><path d="M40 103 L82 131" stroke="#7A4B2A" stroke-width="3.4" fill="none"/><rect x="78" y="127" width="15" height="11" rx="3" fill="#D9A066"/></svg>`
};
const starSvg = on => `<svg viewBox="0 0 24 24" class="${on ? '' : 'dim'}" fill="currentColor" stroke="#1D2B53" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5l2.9 6.2 6.6.7-5 4.5 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z"/></svg>`;
function paintIcons(root = document) {
  root.querySelectorAll('span[data-i]').forEach(e => {
    const t = document.createElement('div'); t.innerHTML = I[e.dataset.i]; const svg = t.firstElementChild;
    const st = e.getAttribute('style'); if (st) svg.setAttribute('style', st);
    e.replaceWith(svg);
  });
}

/* plants: stage 0 seed, 1 sprout, 2 growing, 3 ripe */
const S2 = 'stroke="#1D2B53" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
function leaves(c = '#2DBE8C') { return `<path d="M20 30V20" ${S2} fill="none"/><path d="M20 22c0-5-4-7-9-7 0 5 4 7 9 7zM20 21c0-5 4-8 9-8 0 6-4 8-9 8z" fill="${c}" ${S2}/>`; }
const PLANTS = {
  carrot: { name: 'Cà rốt', cost: 15, need: 3, sell: 25, ripe: `<path d="M20 36l-6-16h12z" fill="#FF8A3D" ${S2}/><path d="M16 24h4M17 28h3" ${S2}/><path d="M20 20c-3-5-7-6-9-5M20 20c0-6 2-9 5-10M20 20c3-4 7-5 9-3" fill="none" stroke="#2DBE8C" stroke-width="3" stroke-linecap="round"/>` },
  sunflower: { name: 'Hướng dương', cost: 20, need: 4, sell: 35, ripe: `<path d="M20 38V20" ${S2} fill="none"/><path d="M20 30c-4-3-8-2-9 0 3 2 6 2 9 0z" fill="#2DBE8C" ${S2}/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cx="20" cy="9" rx="3" ry="5" transform="rotate(${a} 20 15)" fill="#FFC93C" ${S2}/>`).join('')}<circle cx="20" cy="15" r="5" fill="#7A4B2A" ${S2}/>` },
  tomato: { name: 'Cà chua', cost: 25, need: 5, sell: 45, ripe: `<path d="M20 38V14" ${S2} fill="none"/><path d="M20 26c-5-1-9-5-9-9 5 0 9 4 9 9zM20 20c5-1 9-5 9-9-5 0-9 4-9 9z" fill="#2DBE8C" ${S2}/><circle cx="12" cy="28" r="5" fill="#FF6B57" ${S2}/><circle cx="28" cy="25" r="5.5" fill="#FF6B57" ${S2}/><circle cx="21" cy="9" r="4.5" fill="#FF6B57" ${S2}/>` },
  melon: { name: 'Dưa hấu', cost: 40, need: 8, sell: 75, ripe: `<path d="M6 16c4-6 10-6 14-2" fill="none" stroke="#2DBE8C" stroke-width="3" stroke-linecap="round"/><ellipse cx="20" cy="27" rx="15" ry="10" fill="#2DBE8C" ${S2}/><path d="M10 20c2 6 2 11 0 15M17 18c2 6 2 12 0 18M24 18c-2 6-2 12 0 18M31 20c-2 6-2 11 0 15" stroke="#1A8F68" stroke-width="2" fill="none"/>` },
  pumpkin: { name: 'Bí ngô', cost: 60, need: 12, sell: 110, ripe: `<path d="M20 15c0-4 2-6 5-7" fill="none" ${S2}/><ellipse cx="13" cy="26" rx="8" ry="10" fill="#FF8A3D" ${S2}/><ellipse cx="27" cy="26" rx="8" ry="10" fill="#FF8A3D" ${S2}/><ellipse cx="20" cy="26" rx="7" ry="11" fill="#FFA45C" ${S2}/>` }
};
function plantSvg(k, stage) {
  let b = '';
  if (stage === 0) b = `<ellipse cx="20" cy="32" rx="9" ry="4" fill="#7A4B2A" ${S2}/><circle cx="17" cy="30" r="1.6" fill="#FFF0C2"/><circle cx="23" cy="31" r="1.6" fill="#FFF0C2"/>`;
  else if (stage === 1) b = `<g transform="translate(0 6) scale(1)">${leaves()}</g>`;
  else if (stage === 2) b = `<g transform="translate(-4 -2) scale(1.2)">${leaves('#43C78F')}</g><circle cx="20" cy="22" r="3" fill="${k === 'tomato' ? '#FFB3A6' : k === 'sunflower' ? '#FFE08A' : '#BFE7C9'}" ${S2}/>`;
  else b = PLANTS[k].ripe;
  return `<svg viewBox="0 0 40 40" aria-hidden="true">${b}</svg>`;
}
const ANIMALS = {
  ga: { name: 'Gà mái', cost: 80, prod: 'Trứng', sell: 15, need: 3 },
  tho: { name: 'Thỏ', cost: 120, prod: 'Cà rốt vàng', sell: 22, need: 3 },
  bo: { name: 'Bò sữa', cost: 200, prod: 'Sữa', sell: 35, need: 3 }
};
function animalSvg(k, mood) {
  const eye = mood === 'sad' ? `<path d="M-3 0h3" ${S2}/>` : `<circle r="1.8" fill="#1D2B53"/>`;
  const mouth = mood === 'sad' ? 'M-3 3q3 -3 6 0' : 'M-3 1q3 3 6 0';
  if (k === 'ga') return `<svg viewBox="0 0 48 44" aria-hidden="true"><path d="M8 26c0-10 8-14 16-12l4-6c4 0 6 3 5 7l6 2-5 3c2 10-6 18-16 18-6 0-10-5-10-12z" fill="#fff" ${S2}/><path d="M29 6c1-3 4-3 5 0 2-2 5 0 3 3" fill="#FF6B57" ${S2}/><path d="M38 17l5 1-5 2" fill="#FFC93C" ${S2}/><g transform="translate(33 13)">${eye}</g><path d="M14 26c4 4 10 4 13 0" fill="none" ${S2}/><path d="M18 38v5M24 38v5" ${S2}/></svg>`;
  if (k === 'tho') return `<svg viewBox="0 0 48 44" aria-hidden="true"><ellipse cx="18" cy="8" rx="4" ry="9" fill="#F4F0FF" ${S2}/><ellipse cx="30" cy="8" rx="4" ry="9" fill="#F4F0FF" ${S2}/><ellipse cx="24" cy="31" rx="15" ry="11" fill="#F4F0FF" ${S2}/><circle cx="24" cy="20" r="9" fill="#F4F0FF" ${S2}/><g transform="translate(20 19)">${eye}</g><g transform="translate(28 19)">${eye}</g><circle cx="24" cy="23" r="1.6" fill="#FF9E8C"/><path d="${mouth}" transform="translate(24 24)" fill="none" ${S2}/></svg>`;
  return `<svg viewBox="0 0 52 44" aria-hidden="true"><rect x="10" y="16" width="34" height="20" rx="9" fill="#fff" ${S2}/><path d="M20 18c3 4 0 8-4 8M34 30c4-2 6 2 4 5" fill="#1D2B53" stroke="none"/><path d="M14 36v6M22 36v6M32 36v6M40 36v6" ${S2}/><rect x="2" y="9" width="17" height="15" rx="7" fill="#fff" ${S2}/><path d="M3 9l-2-4M18 9l2-4" ${S2}/><ellipse cx="10.5" cy="21" rx="7" ry="4" fill="#FFB8A8" ${S2}/><g transform="translate(7 14)">${eye}</g><g transform="translate(14 14)">${eye}</g></svg>`;
}
const PROD = {
  ga: `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="13" rx="7" ry="9" fill="#FFF7DD" ${K}/></svg>`,
  tho: `<svg viewBox="0 0 24 24"><path d="M12 22L7 9h10z" fill="#FFC93C" ${K}/><path d="M12 9c-2-4-4-5-6-4M12 9c1-4 3-6 5-6" fill="none" stroke="#2DBE8C" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  bo: `<svg viewBox="0 0 24 24"><path d="M8 3h8v3l2 4v11H6V10l2-4z" fill="#fff" ${K}/><path d="M6 13h12" ${K}/><rect x="8" y="3" width="8" height="3" fill="#2F7DE1" ${K}/></svg>`
};
const DECOS = {
  fence: { name: 'Hàng rào', cost: 40, svg: `<svg viewBox="0 0 60 40"><path d="M4 18h52M4 30h52" ${S2} stroke-width="3"/>${[8, 20, 32, 44, 56].map(x => `<path d="M${x - 4} 38V10l4-5 4 5v28z" fill="#E9C38E" ${S2}/>`).join('')}</svg>` },
  tree: { name: 'Cây táo', cost: 60, svg: `<svg viewBox="0 0 40 50"><path d="M17 48V30h6v18z" fill="#A9764E" ${S2}/><circle cx="20" cy="20" r="16" fill="#2DBE8C" ${S2}/><circle cx="13" cy="17" r="2.8" fill="#FF6B57" ${S2}/><circle cx="25" cy="12" r="2.8" fill="#FF6B57" ${S2}/><circle cx="26" cy="25" r="2.8" fill="#FF6B57" ${S2}/></svg>` },
  bench: { name: 'Ghế đá', cost: 50, svg: `<svg viewBox="0 0 50 34"><rect x="3" y="12" width="44" height="8" rx="3" fill="#C9D3E2" ${S2}/><path d="M9 20v12M41 20v12" ${S2} stroke-width="4"/><rect x="5" y="3" width="40" height="6" rx="3" fill="#C9D3E2" ${S2}/></svg>` },
  pond: { name: 'Hồ cá', cost: 120, svg: `<svg viewBox="0 0 60 30"><ellipse cx="30" cy="18" rx="27" ry="10" fill="#62B5F7" ${S2}/><path d="M22 18c4-4 8-4 10 0-2 4-6 4-10 0zM32 18l4-3v6z" fill="#FF8A3D" ${S2}/></svg>` },
  mill: { name: 'Cối xay gió', cost: 200, svg: `<svg viewBox="0 0 40 60"><path d="M13 58l4-36h6l4 36z" fill="#FFF0C2" ${S2}/><rect x="17" y="46" width="6" height="12" fill="#A9764E" ${S2}/>${[0, 90, 180, 270].map(a => `<path d="M20 20l-3-17h6z" transform="rotate(${a + 20} 20 20)" fill="#fff" ${S2}/>`).join('')}<circle cx="20" cy="20" r="3" fill="#FF6B57" ${S2}/></svg>` }
};
const DECO_ORDER = ['tree', 'fence', 'mill', 'bench', 'pond'];

/* ================= islands ================= */
const ISLANDS = SAGA.islands, MAXST = ISLANDS.reduce((a, is) => a + is.lv.length * 3, 0);

/* ================= state ================= */
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const dayNum = s => Math.round(new Date(s + 'T00:00:00').getTime() / 864e5);
function fresh() {
  return Object.assign({ saga: 1, xu: 50, en: 5, stars: {}, solved: {}, miss: {}, day: today(), dayXu: 0, grow: 0, right: 0, wrong: 0,
    plots: Array(8).fill(null), pens: [null, null, null], deco: {}, isle: 0, diff: 0, cur: null, pending: null, done: false }, SAGA.fresh);
}
let S = load();
function load() { try { const v = JSON.parse(localStorage.getItem(KEY)); if (v && v.saga) return Object.assign(fresh(), v); } catch (e) {} return fresh(); }
function save() { S.done = ISLANDS.every(is => is.lv.every((_, i) => (S.stars[is.id + (i + 1)] || 0) === 3)); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function rollDay() { const t = today(); if (S.day !== t) { S.day = t; S.dayXu = 0; } }
const totalStars = (isle) => Object.entries(S.stars).reduce((a, [k, v]) => a + (!isle || k[0] === isle ? v : 0), 0);

/* ================= sound ================= */
let AC = null, sndOn = true;
function tone(f, d = .12, type = 'triangle', vol = .14, when = 0) {
  if (!sndOn) return; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { return; }
  const t = AC.currentTime + when, o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02);
}
const sfx = {
  tap() { tone(880, .05, 'sine', .07); },
  good() { [523, 659, 784, 1047].forEach((f, i) => tone(f, .16, 'triangle', .14, i * .08)); },
  bad() { tone(196, .16, 'sawtooth', .07); tone(147, .22, 'sawtooth', .07, .14); },
  coin() { tone(988, .08, 'square', .06); tone(1319, .18, 'square', .06, .08); }
};

/* ================= confetti ================= */
const fx = $('#fx'), fctx = fx.getContext('2d'); let parts = [], fxRun = false;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
function sizeFx() { fx.width = innerWidth * devicePixelRatio; fx.height = innerHeight * devicePixelRatio; }
sizeFx(); addEventListener('resize', sizeFx);
function burst(el, n = 30) {
  if (RM || !el) return; const r = el.getBoundingClientRect(), d = devicePixelRatio, cols = ['#FFC93C', '#FF6B57', '#2DBE8C', '#2F7DE1', '#8E6BD8'];
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = 2 + Math.random() * 5;
    parts.push({ x: (r.left + r.width / 2) * d, y: (r.top + r.height / 2) * d, vx: Math.cos(a) * v * d, vy: (Math.sin(a) * v - 3) * d, s: (4 + Math.random() * 5) * d, c: cols[i % 5], r: 0, life: 70 }); }
  if (!fxRun) { fxRun = true; requestAnimationFrame(step); }
}
function step() {
  fctx.clearRect(0, 0, fx.width, fx.height); parts = parts.filter(p => p.life > 0);
  for (const p of parts) { p.x += p.vx; p.y += p.vy; p.vy += .18 * devicePixelRatio; p.r += .15; p.life--;
    fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.r); fctx.fillStyle = p.c; fctx.globalAlpha = Math.min(1, p.life / 30); fctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .66); fctx.restore(); }
  if (parts.length) requestAnimationFrame(step); else { fxRun = false; fctx.clearRect(0, 0, fx.width, fx.height); }
}

/* ================= ui helpers ================= */
let toastT;
function toast(html) { document.querySelectorAll('.toast').forEach(t => t.remove()); const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; document.body.appendChild(t); clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2300); }
function hud(flash) {
  $('#vEn').textContent = S.en; $('#vXu').textContent = S.xu; $('#vSt').textContent = totalStars();
  if (flash) flash.split(',').forEach(id => { const e = $(id); e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); });
  const ready = gardenReady(); $('#gdot').hidden = !ready; $('#gdot').textContent = ready;
}
let moodT;
function say(msg, mood) {
  $('#say').innerHTML = msg;
  if (view === 'math' && mood && !$('.jrow').offsetParent) toast(msg);
  document.querySelectorAll('#vMath .jsvg').forEach(j => { j.classList.remove('happy', 'oops', 'bounce'); void j.offsetWidth; if (mood) j.classList.add(mood); if (mood === 'happy') j.classList.add('bounce'); });
  clearTimeout(moodT); moodT = setTimeout(() => document.querySelectorAll('#vMath .jsvg').forEach(j => j.classList.remove('happy', 'oops', 'bounce')), 2200);
}
function openOv(html, onReady) { const p = $('#panel'); p.innerHTML = html; paintIcons(p); $('#ov').hidden = false; fitPanel(); onReady && onReady(p); const f = p.querySelector('[data-focus]') || p.querySelector('button'); f && f.focus(); }
function closeOv() { $('#ov').hidden = true; $('#panel').style.transform = ''; }
$('#ov').addEventListener('click', e => { if (e.target.id === 'ov') closeOv(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#ov').hidden) closeOv(); });
function fitPanel() {
  const p = $('#panel'); p.style.transform = ''; if ($('#ov').hidden) return;
  const r = p.getBoundingClientRect(), s = Math.min(1, (innerHeight - 20) / r.height, (innerWidth - 20) / r.width);
  if (s < 1) { p.style.transform = `scale(${s.toFixed(3)})`; }
}

/* ================= views ================= */
let view = 'map';
function show(v) {
  view = v;
  document.querySelectorAll('.view').forEach(x => x.classList.toggle('on', x.id === 'v' + v[0].toUpperCase() + v.slice(1)));
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.v === v));
  $('#tabs').style.visibility = v === 'lock' ? 'hidden' : '';
  if (SAGA.onShow) SAGA.onShow(v);
  if (v === 'map') drawMap(); if (v === 'math') drawMath(); if (v === 'garden') drawGarden();
}
document.querySelectorAll('.tab').forEach(t => t.onclick = () => { sfx.tap(); if (SAGA.beforeTab && SAGA.beforeTab(t.dataset.v)) return; show(t.dataset.v); });

/* ================= map ================= */
function lvUnlocked(is, i) { return islandOpen(is) && (i === 0 || (S.stars[is.id + i] || 0) > 0); }
function islandOpen(is) { return !is.need || totalStars(ISLANDS[ISLANDS.indexOf(is) - 1].id) >= is.need; }
function drawMap() {
  const is = ISLANDS[S.isle], open = islandOpen(is);
  $('#isName').innerHTML = `${is.name}<small>${is.sub} · ${totalStars(is.id)}/${is.lv.length * 3} sao</small>`;
  $('#isPrev').disabled = S.isle === 0; $('#isNext').disabled = S.isle === ISLANDS.length - 1;
  $('#isPrev').style.opacity = S.isle === 0 ? .35 : 1; $('#isNext').style.opacity = S.isle === ISLANDS.length - 1 ? .35 : 1;
  const box = $('#mapbox'), W = Math.max(box.clientWidth, 10), H = Math.max(box.clientHeight, 10);
  const NN = is.lv.length, wide = W / H > 1.15, cols = wide ? 5 : SAGA.colsTall, rows = Math.ceil(NN / cols);
  const cw = W / cols, ch = H / rows, R = Math.max(12, Math.min(cw, ch) * .27);
  const pts = [];
  for (let i = 0; i < NN; i++) {
    const row = Math.floor(i / cols), k = i % cols, col = row % 2 ? cols - 1 - k : k;
    const wob = ((i * 37) % 7 - 3) / 3 * ch * .08;
    pts.push([cw * (col + .5), H - ch * (row + .5) + wob]);
  }
  let path = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < NN; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const mx = (x0 + x1) / 2, my = (y0 + y1) / 2; path += ` Q${x0 === x1 ? x0 + (Math.floor(i / cols) % 2 ? -cw * .45 : cw * .45) : mx} ${y0 === y1 ? my : my} ${x1} ${y1}`; }
  // decorations: trees and rocks scattered with fixed positions
  let deco = '';
  for (let k = 0; k < 14; k++) {
    const x = ((k * 97 + 13) % 100) / 100 * W, y = ((k * 61 + 29) % 100) / 100 * H, s = Math.min(cw, ch) * .16;
    if (pts.some(([px, py]) => Math.hypot(px - x, py - y) < R * 1.9)) continue;
    deco += k % 3 ? `<g transform="translate(${x} ${y}) scale(${s / 10})"><path d="M-1.5 9v-6h3v6z" fill="#A9764E" ${S2} stroke-width=".8"/><circle cy="-1" r="6" fill="${['#2DBE8C', '#7BC96F', '#43C78F', '#8E6BD8'][S.isle % 4]}" ${S2} stroke-width=".8"/></g>`
      : `<g transform="translate(${x} ${y}) scale(${s / 10})"><path d="M-7 5c0-6 4-9 7-9s7 3 7 9z" fill="#C9D3E2" ${S2} stroke-width=".8"/></g>`;
  }
  const next = is.lv.findIndex((_, i) => !(S.stars[is.id + (i + 1)] > 0));
  let nodes = '';
  pts.forEach(([x, y], i) => {
    const id = is.id + (i + 1), st = S.stars[id] || 0, unl = lvUnlocked(is, i), lv = is.lv[i][0];
    const face = !unl ? '#D6DEEA' : st ? '#FFC93C' : '#fff', ringC = ['#2DBE8C', '#2F7DE1', '#8E6BD8'][lv];
    const sr = R * .34;
    const stars = unl ? [0, 1, 2].map(k => `<path transform="translate(${x + (k - 1) * sr * 2.1} ${y + R + sr * 1.1}) scale(${sr / 10})" d="M0 -10l2.9 6.2 6.6.7-5 4.5 1.4 6.6L0 4.7l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z" fill="${k < st ? '#FFC93C' : '#fff'}" stroke="#1D2B53" stroke-width="1.6" stroke-linejoin="round"/>`).join('') : '';
    nodes += `<g class="node" tabindex="0" role="button" data-n="${i}" aria-label="Màn ${i + 1}${unl ? ', ' + st + ' sao' : ', đang khoá'}">
      ${i === next && unl ? `<circle class="ring" cx="${x}" cy="${y}" r="${R * 1.12}" fill="none" stroke="#FFC93C" stroke-width="${R * .22}"/>` : ''}
      <circle cx="${x}" cy="${y + R * .12}" r="${R}" fill="#1D2B53"/>
      <circle class="face" cx="${x}" cy="${y}" r="${R}" fill="${face}" stroke="#1D2B53" stroke-width="3"/>
      <circle cx="${x}" cy="${y}" r="${R * .8}" fill="none" stroke="${ringC}" stroke-width="${R * .1}" opacity="${unl ? 1 : .3}"/>
      ${unl ? `<text x="${x}" y="${y + R * .36}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="${R * 1.05}" fill="#1D2B53">${i + 1}</text>`
        : `<g transform="translate(${x - R * .5} ${y - R * .5}) scale(${R / 24})">${I.lock.replace('<svg viewBox="0 0 24 24">', '').replace('</svg>', '')}</g>`}
      ${stars}</g>`;
  });
  const jx = next >= 0 && open ? pts[next] : null;
  const jen = jx ? `<g transform="translate(${jx[0] - R * .95} ${jx[1] - R * 3.15}) scale(${R / 62})" pointer-events="none">${I.jenny.replace(/<svg[^>]*>/, '').replace('</svg>', '')}</g>` : '';
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" aria-label="Bản đồ ${is.name}">
    <rect x="3" y="3" width="${W - 6}" height="${H - 6}" rx="26" fill="${is.color}" stroke="${is.edge}" stroke-width="4"/>
    ${deco}
    <path d="${path}" fill="none" stroke="#fff" stroke-width="${R * .55}" stroke-linecap="round" opacity=".85"/>
    <path d="${path}" fill="none" stroke="#B8C6DD" stroke-width="${R * .12}" stroke-dasharray="${R * .3} ${R * .35}" stroke-linecap="round"/>
    ${nodes}${jen}
    ${open ? '' : `<rect x="3" y="3" width="${W - 6}" height="${H - 6}" rx="26" fill="rgba(29,43,83,.35)"/>
      <g transform="translate(${W / 2} ${H / 2})"><rect x="${-Math.min(W * .45, 210)}" y="-46" width="${Math.min(W * .9, 420)}" height="92" rx="18" fill="#fff" stroke="#1D2B53" stroke-width="3"/>
      <text text-anchor="middle" y="-8" font-family="Baloo 2, sans-serif" font-weight="800" font-size="22" fill="#1D2B53">Đảo đang khoá</text>
      <text text-anchor="middle" y="22" font-family="Nunito, sans-serif" font-weight="800" font-size="15" fill="#4A5878">Cần ${is.need} sao ở ${esc(ISLANDS[S.isle - 1].name)} (có ${totalStars(ISLANDS[S.isle - 1].id)})</text></g>`}
  </svg>`;
  box.querySelectorAll('.node').forEach(n => { n.onclick = () => openLevel(+n.dataset.n); n.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLevel(+n.dataset.n); } }; });
}
$('#isPrev').onclick = () => { if (S.isle > 0) { S.isle--; save(); sfx.tap(); drawMap(); } };
$('#isNext').onclick = () => { if (S.isle < ISLANDS.length - 1) { S.isle++; save(); sfx.tap(); drawMap(); } };

function openLevel(i) {
  const is = ISLANDS[S.isle], id = is.id + (i + 1), st = S.stars[id] || 0, [lv] = is.lv[i];
  sfx.tap();
  if (!islandOpen(is)) { toast(`Cần ${is.need} sao ở ${ISLANDS[S.isle - 1].name} để mở đảo này`); return; }
  if (!lvUnlocked(is, i)) { toast('Qua màn trước để mở màn này nhé!'); return; }
  const noEn = S.en < 1;
  openOv(`<h2>${esc(is.name)} · Màn ${i + 1}</h2>
    <div class="stars">${[0, 1, 2].map(k => starSvg(k < st)).join('')}</div>
    <p>Mức <b>${DIFF[lv]}</b>. Vào màn tốn <b>1 năng lượng</b> <span data-i="bolt" style="width:18px;height:18px;vertical-align:-3px"></span>. Đạt 3 sao được trả lại năng lượng.</p>
    ${noEn ? '<p style="color:#B3261E">Em hết năng lượng rồi! Giải vài bài ở Trạm toán để nạp thêm nhé.</p>' : ''}
    <div class="row">${noEn ? '<button class="btn g" id="goMath" data-focus>Đến Trạm toán</button>' : '<button class="btn y" id="goPlay" data-focus>Chơi</button>'}<button class="btn" id="goClose">Đóng</button></div>`, p => {
    p.querySelector('#goClose').onclick = closeOv;
    if (noEn) p.querySelector('#goMath').onclick = () => { closeOv(); show('math'); };
    else p.querySelector('#goPlay').onclick = () => play(is, i);
  });
}
function play(is, i) {
  if (S.en < 1) return;
  S.en--; S.pending = is.id + (i + 1); save();
  const [lv, r, seed] = is.lv[i];
  location.href = `${is.url}?${SAGA.query || ''}saga=${encodeURIComponent(BACK)}&id=${is.id}${i + 1}&lv=${lv}&r=${r}&seed=${seed}&n=${i + 1}`;
}
function takeResult() {
  let res = null; try { res = JSON.parse(localStorage.getItem('jenny-saga-result')); localStorage.removeItem('jenny-saga-result'); } catch (e) {}
  const pend = S.pending; S.pending = null;
  if (!res || !pend || res.id !== pend) { save(); return; }
  const before = S.stars[res.id] || 0, st = Math.max(1, Math.min(3, res.stars | 0));
  S.stars[res.id] = Math.max(before, st);
  let msg = `Màn ${res.id.slice(1)}: ${'★'.repeat(st)}${'☆'.repeat(3 - st)}`;
  if (st === 3) { S.en = Math.min(EN_MAX, S.en + 1); msg += ' · được trả lại 1 năng lượng'; }
  S.isle = Math.max(0, ISLANDS.findIndex(x => x.id === res.id[0]));
  save(); setTimeout(() => { toast(msg); hud('#pSt,#pEn'); }, 300);
}

/* ================= garden ================= */
function petMood(p) { if (!p.fed) return 'sad'; const gap = dayNum(today()) - dayNum(p.fed); return gap === 0 ? 'happy' : gap === 1 ? 'hungry' : 'sad'; }
function gardenReady() {
  let n = 0;
  S.plots.forEach(p => { if (p && S.grow - p.at >= PLANTS[p.k].need) n++; });
  S.pens.forEach(p => { if (p && p.fedAt != null && !p.got && S.grow - p.fedAt >= ANIMALS[p.k].need) n++; });
  return n;
}
function drawGarden() {
  const sc = $('#scene');
  const deco = DECO_ORDER.map(k => `<div title="${DECOS[k].name}">${S.deco[k] ? DECOS[k].svg : `<span class="slot">${DECOS[k].svg}</span>`}</div>`).join('');
  const plots = S.plots.map((p, i) => {
    if (!p) return `<button class="plot" data-p="${i}" aria-label="Ô đất trống, bấm để trồng cây"><span class="plus">+</span></button>`;
    const P = PLANTS[p.k], g = Math.min(P.need, S.grow - p.at), ripe = g >= P.need, stage = ripe ? 3 : g === 0 ? 0 : g / P.need < .5 ? 1 : 2;
    return `<button class="plot${ripe ? ' ripe' : ''}" data-p="${i}" aria-label="${P.name}${ripe ? ' đã chín, bấm để thu hoạch' : ', còn ' + (P.need - g) + ' bài đúng nữa'}">${plantSvg(p.k, stage)}${ripe ? '' : `<span class="bar2"><i style="width:${g / P.need * 100}%"></i></span>`}</button>`;
  }).join('');
  const pens = S.pens.map((p, i) => {
    if (!p) return `<button class="pen" data-n="${i}" aria-label="Chuồng trống, bấm để mua con vật" style="grid-template-columns:1fr"><span class="plus" style="color:#C9A86A">+</span></button>`;
    const A = ANIMALS[p.k], mood = petMood(p), fedToday = p.fed === today();
    const ready = p.fedAt != null && !p.got && S.grow - p.fedAt >= A.need;
    let side;
    if (ready) side = `<span class="prod">${PROD[p.k]}</span><span>Thu ${A.prod.toLowerCase()}</span>`;
    else if (!fedToday) side = `<span class="hungry">Đói</span><span>Cho ăn 10${I.coin}</span>`;
    else if (p.got) side = `<span>${I.check}</span><span>Mai cho ăn tiếp</span>`;
    else { const g = Math.min(A.need, S.grow - p.fedAt); side = `<span>${PROD[p.k]}</span><span>${g}/${A.need} bài</span>`; }
    return `<button class="pen${ready ? ' ripe' : ''}" data-n="${i}" aria-label="${A.name}"><span class="ani">${animalSvg(p.k, mood === 'happy' ? 'happy' : mood === 'sad' ? 'sad' : 'ok')}</span><span class="side">${side}</span></button>`;
  }).join('');
  sc.innerHTML = `<div class="deco">${deco}</div><div class="plots">${plots}</div><div class="pens">${pens}</div>`;
  sc.querySelectorAll('.plot').forEach(b => b.onclick = () => tapPlot(+b.dataset.p, b));
  sc.querySelectorAll('.pen').forEach(b => b.onclick = () => tapPen(+b.dataset.n, b));
  const ready = gardenReady();
  $('#ginfo').innerHTML = ready ? `Có <b>${ready}</b> thứ đã sẵn sàng để thu hoạch!` : 'Mỗi bài toán em giải đúng giúp cây và thú lớn thêm. Thú cần cho ăn mỗi ngày.';
  hud();
}
function tapPlot(i, el) {
  const p = S.plots[i];
  if (!p) {
    openOv(`<h2>Trồng cây</h2><p>Chọn hạt giống. Cây lớn lên khi em <b>giải đúng bài toán</b>. Chín rồi bán lấy xu.</p>
      <div class="shopgrid">${Object.entries(PLANTS).map(([k, P]) => `<button class="item" data-k="${k}" ${S.xu < P.cost ? 'disabled' : ''}>${plantSvg(k, 3).replace('<svg', '<svg class="pic"')}<b>${P.name}</b><span class="price">${P.cost}${I.coin}</span><span>${P.need} bài · bán ${P.sell}</span></button>`).join('')}</div>
      <div class="row"><button class="btn" id="cl">Đóng</button></div>`, pn => {
      pn.querySelector('#cl').onclick = closeOv;
      pn.querySelectorAll('.item').forEach(b => b.onclick = () => { const P = PLANTS[b.dataset.k]; if (S.xu < P.cost) return; S.xu -= P.cost; S.plots[i] = { k: b.dataset.k, at: S.grow }; save(); sfx.coin(); closeOv(); drawGarden(); toast(`Đã trồng ${P.name}. Giải đúng ${P.need} bài để cây chín!`); });
    });
    return;
  }
  const P = PLANTS[p.k], g = S.grow - p.at;
  if (g >= P.need) { S.xu += P.sell; S.plots[i] = null; save(); sfx.coin(); burst(el, 24); drawGarden(); hud('#pXu'); toast(`Thu hoạch ${P.name}: +${P.sell} xu`); }
  else toast(`${P.name} cần thêm ${P.need - g} bài đúng nữa`);
}
function tapPen(i, el) {
  const p = S.pens[i];
  if (!p) { openShop('ani'); return; }
  const A = ANIMALS[p.k];
  if (p.fedAt != null && !p.got && S.grow - p.fedAt >= A.need) { p.got = 1; S.xu += A.sell; save(); sfx.coin(); burst(el, 20); drawGarden(); hud('#pXu'); toast(`Thu ${A.prod.toLowerCase()}: +${A.sell} xu`); return; }
  if (p.fed !== today()) {
    if (S.xu < 10) { toast('Cần 10 xu để mua thức ăn. Ra Trạm toán kiếm xu nhé!'); return; }
    S.xu -= 10; p.fed = today(); p.fedAt = S.grow; p.got = 0; save(); sfx.tap(); drawGarden(); hud('#pXu');
    toast(`${A.name} no rồi! Giải đúng ${A.need} bài để thu ${A.prod.toLowerCase()}.`); return;
  }
  toast(p.got ? `${A.name} đã cho ${A.prod.toLowerCase()} hôm nay. Mai cho ăn tiếp nhé!` : `${A.name} cần thêm ${A.need - (S.grow - p.fedAt)} bài đúng nữa`);
}
let shopTab = 'ani';
function openShop(tab) {
  shopTab = tab || shopTab;
  const items = shopTab === 'ani'
    ? Object.entries(ANIMALS).map(([k, A]) => { const full = !S.pens.includes(null); return `<button class="item" data-k="${k}" ${S.xu < A.cost || full ? 'disabled' : ''}>${animalSvg(k, 'happy').replace('<svg', '<svg class="pic"')}<b>${A.name}</b><span class="price">${A.cost}${I.coin}</span><span>Cho ${A.prod.toLowerCase()}: ${A.sell} xu</span></button>`; }).join('')
    : DECO_ORDER.map(k => { const D = DECOS[k], own = S.deco[k]; return `<button class="item${own ? ' own' : ''}" data-k="${k}" ${own || S.xu < D.cost ? 'disabled' : ''}>${D.svg.replace('<svg', '<svg class="pic"')}<b>${D.name}</b><span class="price">${own ? 'Đã có' : D.cost + I.coin}</span></button>`; }).join('');
  openOv(`<h2>Cửa hàng của Jenny</h2>
    <div class="stabs"><button aria-pressed="${shopTab === 'ani'}" data-t="ani">Con vật</button><button aria-pressed="${shopTab === 'deco'}" data-t="deco">Trang trí</button></div>
    <div class="shopgrid">${items}</div>
    <p style="font-size:13.5px">${shopTab === 'ani' ? 'Vườn có 3 chuồng. Thú cần ăn mỗi ngày (10 xu).' : 'Đồ trang trí làm vườn đẹp hơn.'} Em đang có <b>${S.xu} xu</b>.</p>
    <div class="row"><button class="btn" id="cl">Đóng</button></div>`, pn => {
    pn.querySelector('#cl').onclick = closeOv;
    pn.querySelectorAll('.stabs button').forEach(b => b.onclick = () => { sfx.tap(); openShop(b.dataset.t); });
    pn.querySelectorAll('.item').forEach(b => b.onclick = () => {
      const k = b.dataset.k;
      if (shopTab === 'ani') { const A = ANIMALS[k], slot = S.pens.indexOf(null); if (slot < 0 || S.xu < A.cost) return; S.xu -= A.cost; S.pens[slot] = { k, fed: null, fedAt: null, got: 0 }; toast(`Chào mừng ${A.name} về vườn! Nhớ cho ăn nhé.`); }
      else { const D = DECOS[k]; if (S.deco[k] || S.xu < D.cost) return; S.xu -= D.cost; S.deco[k] = 1; toast(`Đã đặt ${D.name} vào vườn!`); }
      save(); sfx.coin(); closeOv(); drawGarden(); hud('#pXu');
    });
  });
}
$('#bShop').onclick = () => { sfx.tap(); openShop(); };

/* ================= settings / backup ================= */
function backupCode() { return 'JNY1:' + btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
$('#bSet').onclick = () => {
  sfx.tap();
  const acc = S.right + S.wrong ? Math.round(S.right / (S.right + S.wrong) * 100) : 0;
  openOv(`<h2>Tiến độ của em</h2>
    <div class="kv"><div><b>${Object.keys(S.solved).length}</b><span>Bài đã giải đúng</span></div><div><b>${acc}%</b><span>Lần trả lời đúng</span></div><div><b>${totalStars()}/${MAXST}</b><span>Sao trên bản đồ</span></div></div>${SAGA.setRow ? '\n    ' + SAGA.setRow() : ''}
    <p style="font-size:13.5px"><b>Mã sao lưu:</b> chép mã này để chơi tiếp trên máy khác.</p>
    <textarea class="code" id="bk" readonly>${backupCode()}</textarea>
    <div class="row"><button class="btn" id="cp">Chép mã</button><button class="btn" id="rs">Dán mã khôi phục</button></div>
    <div class="row"><button class="btn y" id="cl" data-focus>Đóng</button></div>`, pn => {
    pn.querySelector('#cl').onclick = closeOv;
    if (SAGA.setReady) SAGA.setReady(pn);
    pn.querySelector('#cp').onclick = () => { const t = pn.querySelector('#bk'); t.select(); try { navigator.clipboard.writeText(t.value).then(() => toast('Đã chép mã sao lưu'), () => document.execCommand('copy')); } catch (e) { document.execCommand('copy'); toast('Đã chép mã sao lưu'); } };
    pn.querySelector('#rs').onclick = () => {
      const t = pn.querySelector('#bk'); t.readOnly = false; t.value = ''; t.placeholder = 'Dán mã sao lưu vào đây'; t.focus();
      const b = pn.querySelector('#rs'); b.textContent = 'Khôi phục'; b.classList.add('y');
      b.onclick = () => {
        try { const v = t.value.trim(); if (!v.startsWith('JNY1:')) throw 0; const o = JSON.parse(decodeURIComponent(escape(atob(v.slice(5))))); if (!o.saga) throw 0;
          S = khoiPhucAnToan(o, fresh); save(); closeOv(); hud(); show(view); toast('Đã khôi phục tiến độ!'); }
        catch (e) { toast('Mã sao lưu không đúng'); }
      };
    };
  });
};
$('#bSnd').onclick = () => { sndOn = !sndOn; $('#bSnd').classList.toggle('off', !sndOn); };

/* ================= unlock bank ================= */
let BANK = null;
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
let ENC = null;
async function getEnc() { if (!ENC) { const r = await fetch('bank.enc', { cache: 'no-cache' }); ENC = await r.json(); } return ENC; }
async function unlock(code) {
  const e = await getEnc();
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(code.trim().toUpperCase()), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(e.salt), iterations: e.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(e.iv) }, key, b64(e.data));
  return JSON.parse(new TextDecoder().decode(pt));
}
async function tryCode(code, quiet) {
  const err = $('#codeErr'); if (!quiet) { err.textContent = 'Đang mở…'; $('#codeGo').disabled = true; }
  try { BANK = await unlock(code); try { sessionStorage.setItem(CODEKEY, code.trim().toUpperCase()); } catch (e) {} err.textContent = ''; start(); return true; }
  catch (e) { if (!quiet) { err.textContent = navigator.onLine === false ? 'Không tải được dữ liệu. Em kiểm tra mạng nhé.' : 'Mã chưa đúng. Em hỏi lại thầy cô nhé!'; sfx.bad(); } return false; }
  finally { $('#codeGo').disabled = false; }
}
$('#codeGo').onclick = () => tryCode($('#code').value);
$('#code').addEventListener('keydown', e => { if (e.key === 'Enter') tryCode($('#code').value); });

function start() { takeResult(); rollDay(); hud(); if (SAGA.onStart) SAGA.onStart(); show(new URLSearchParams(location.search).get('v') || 'map'); if (SAGA.afterStart) SAGA.afterStart(); }

/* ================= boot (trang gọi bootSaga() sau khi khai báo Trạm toán) ================= */
function bootSaga() {
  paintIcons();
  hud();
  addEventListener('resize', () => { if (view === 'map') drawMap(); if (view === 'math') fitText(); fitPanel(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (view === 'map') drawMap(); if (view === 'math') fitText(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && BANK) { rollDay(); hud(); if (view === 'garden') drawGarden(); } });
  show('lock');
  const saved = (() => { try { localStorage.removeItem(CODEKEY); } catch (e) {} try { return sessionStorage.getItem(CODEKEY); } catch (e) { return null; } })();
  if (saved) tryCode(saved, true).then(ok => { if (!ok) $('#code').focus(); });
  else $('#code').focus();
}
window.__saga = { get S() { return S; }, set S(v) { S = v; }, get bank() { return BANK; }, show, save, drawGarden };
