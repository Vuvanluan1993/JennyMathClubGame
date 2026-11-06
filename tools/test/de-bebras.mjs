// Kiểm tra đề tự tạo của 6 game Tư duy Bebras (TIEU_CHI.md §1: đề do máy tạo phải được kiểm hàng nghìn lần).
//   node tools/test/de-bebras.mjs                → 6 game (+ 4 bản ?kid=1 dùng trong Hành trình Tiểu học) × 3 mức × 1000 seed
//   SO_SEED=200 node tools/test/de-bebras.mjs     → ít seed hơn (chạy nhanh khi sửa tay)
//   node tools/test/de-bebras.mjs robot ong-bi    → chỉ game có tên chứa chuỗi này
// Mỗi đề: gọi __kit.make(lv, r, seed) (kit.js) với seed cố định → tái hiện được; r = seed % 10 để phủ cả 10 màn.
// Kiểm: không ném lỗi, không undefined/NaN, có lời giải và lời giải chạy lại đúng (đi tới đích, xếp xong,
// giải mã ra câu, tô ra hình đích…), bài chọn thì đúng 1 đáp án và các lựa chọn không trùng.
// Lỗi đã ghi nhận (chờ việc khác sửa) nằm ở DA_BIET: in "ĐÃ BIẾT", không làm đỏ. Lỗi mới → rc 1.
// Báo cáo HTML: $BAO_CAO_DIR/de-bebras.html (mặc định .ci/bao-cao/).
// Biến môi trường: PW_DIR (thư mục trình duyệt Playwright), CHROME (đường dẫn chrome cụ thể).
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

if (process.env.PW_DIR && !process.env.PLAYWRIGHT_BROWSERS_PATH) process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PW_DIR;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BAO_CAO_DIR = process.env.BAO_CAO_DIR || path.join(ROOT, '.ci', 'bao-cao');
const SO_SEED = +(process.env.SO_SEED || 1000);
const CHON = process.argv.slice(2);
const MUC = ['Dễ', 'Vừa', 'Khó'];

/* Lỗi đã biết: { game, lv, seed, viec } — game khớp theo tên; seed/lv bỏ trống = mọi seed/mức. */
const DA_BIET = [];

/* ---------- máy chủ tĩnh nhỏ (không cần python) ---------- */
const MIME = { html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json',
  png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', mp3: 'audio/mpeg', woff2: 'font/woff2', woff: 'font/woff', ico: 'image/x-icon', webp: 'image/webp' };
function phucVu(root) {
  return new Promise(res => {
    const s = http.createServer((req, r) => {
      let u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (u.endsWith('/')) u += 'index.html';
      const f = path.join(root, u);
      if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
      r.writeHead(200, { 'content-type': MIME[path.extname(f).slice(1)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(r);
    });
    s.listen(0, '127.0.0.1', () => res({ server: s, base: `http://127.0.0.1:${s.address().port}/` }));
  });
}

/* ---------- bộ kiểm từng game (chạy trong trang; nhận (P, lv, r), trả về mảng lỗi) ---------- */
const robot = (P, lv) => {
  const e = [], n = P.n, DIRS = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] }, chan = t => ['tree', 'pine', 'rock', 'water'].includes(t);
  if (!Array.isArray(P.sol) || !P.sol.length) return ['không có lời giải'];
  let [r, c] = P.start; const qua = new Set();
  for (const d of P.sol) {
    if (!DIRS[d]) { e.push('lệnh lạ ' + d); break; }
    r += DIRS[d][0]; c += DIRS[d][1];
    if (r < 0 || c < 0 || r >= n || c >= n) { e.push('lời giải đi ra ngoài bản đồ'); break; }
    if (chan(P.grid[r][c])) { e.push('lời giải đi vào ô chặn'); break; }
    qua.add(r + ',' + c);
  }
  if (r !== P.goal[0] || c !== P.goal[1]) e.push('lời giải không tới đích');
  for (const g of P.gems) if (!qua.has(g[0] + ',' + g[1])) e.push('lời giải bỏ sót ngọc');
  if (chan(P.grid[P.start[0]][P.start[1]]) || chan(P.grid[P.goal[0]][P.goal[1]])) e.push('xuất phát/đích nằm trên ô chặn');
  let chiPhi = P.sol.length;
  if (P.repeat) { chiPhi = 0; let i = 0; while (i < P.sol.length) { let j = i; while (j < P.sol.length && P.sol[j] === P.sol[i]) j++; chiPhi += Math.ceil((j - i) / 3); i = j; } }
  if (chiPhi !== P.best) e.push(`best ${P.best} ≠ chi phí lời giải ${chiPhi}`);
  return e;
};
const ongBi = (P, lv) => {
  const e = [], T = P.tubes, cap = P.cap, dem = {};
  T.forEach(t => { if (t.length > cap) e.push('ống quá đầy'); t.forEach(b => dem[b] = (dem[b] || 0) + 1); });
  for (const k in dem) if (dem[k] !== cap) e.push(`màu ${k} có ${dem[k]} bi, cần ${cap}`);
  if (T.some(t => t.length === cap && t.every(b => b === t[0]))) e.push('có ống đã xong sẵn');
  const sol = window.__ongbi.solve(T.map(t => t.slice()), cap);
  if (!sol) return e.concat(['không tìm được lời giải']);
  const S = T.map(t => t.slice());
  for (const [i, j] of sol) { const a = S[i], b = S[j]; if (!a.length || b.length >= cap || (b.length && b[b.length - 1] !== a[a.length - 1])) { e.push('nước đi trong lời giải không hợp lệ'); break; } b.push(a.pop()); }
  if (!S.every(t => !t.length || (t.length === cap && t.every(b => b === t[0])))) e.push('lời giải chưa xếp xong');
  if (!(P.par >= 1)) e.push('par không hợp lệ');
  if (lv < 2 && sol.length !== P.par) e.push(`par ${P.par} ≠ lời giải ngắn nhất ${sol.length}`);
  return e;
};
const xoayLat = (P) => {
  const e = [], n = P.n, OPS = ['R', 'H', 'V'];
  const ap = (p, op) => { let o = ''; for (let rr = 0; rr < n; rr++) for (let c = 0; c < n; c++) { if (op === 'R') o += p[(n - 1 - c) * n + rr]; else if (op === 'H') o += p[rr * n + (n - 1 - c)]; else o += p[(n - 1 - rr) * n + c]; } return o; };
  if (typeof P.pic !== 'string' || P.pic.length !== n * n || /[^01]/.test(P.pic)) return ['hình không hợp lệ'];
  const dist = new Map([[P.pic, 0]]), qu = [P.pic];
  while (qu.length) { const cur = qu.shift(); for (const op of OPS) { const nx = ap(cur, op); if (!dist.has(nx)) { dist.set(nx, dist.get(cur) + 1); qu.push(nx); } } }
  if (dist.size !== 8) e.push('hình có tính đối xứng (chỉ ' + dist.size + ' ảnh khác nhau)');
  if (P.rev) {
    if (!Array.isArray(P.seq) || !P.seq.length || P.seq.some(o => !OPS.includes(o))) e.push('dãy phép biến hình lạ');
    const res = (P.seq || []).reduce((a, op) => ap(a, op), P.pic);
    if (res === P.pic) e.push('kết quả trùng hình gốc');
    if (!Array.isArray(P.choices) || P.choices.length !== 4) e.push('không đủ 4 lựa chọn');
    else {
      if (new Set(P.choices).size !== 4) e.push('lựa chọn trùng nhau');
      const dung = P.choices.filter(c => c === res).length; if (dung !== 1) e.push('có ' + dung + ' lựa chọn đúng');
      if (P.choices[P.answer] !== res) e.push('answer không trỏ vào lựa chọn đúng');
    }
  } else {
    if (P.target === P.pic) e.push('hình đích trùng hình gốc');
    if (!dist.has(P.target)) e.push('hình đích không tới được');
    else if (dist.get(P.target) !== P.best) e.push(`best ${P.best} ≠ số bước ít nhất ${dist.get(P.target)}`);
    if (![1, 2, 3].includes(P.best)) e.push('best lạ ' + P.best);
  }
  return e;
};
const maThu = (P) => {
  const e = [], AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', mod = (a, n = 26) => ((a % n) + n) % n;
  if (!/^[A-Z]+( [A-Z]+)*$/.test(P.answer || '')) e.push('câu trả lời không hợp lệ: ' + P.answer);
  if (!['caesar', 'num', 'mirror'].includes(P.type)) e.push('loại mã lạ ' + P.type);
  if (!Number.isInteger(P.k) || P.k < 0 || P.k > 25) e.push('k lạ ' + P.k);
  if (P.type === 'caesar' && P.k === 0) e.push('dịch 0 nấc: thư để lộ đáp án');
  const giai = c => P.type === 'mirror' ? mod(P.k - c) : mod(c - P.k);
  const txt = (P.code || []).map(w => w.map(c => AZ[giai(c)]).join('')).join(' ');
  if (txt !== P.answer) e.push('giải mã không ra câu trả lời: ' + txt);
  if ((P.words || []).join(' ') !== P.answer) e.push('words khác answer');
  if (P.seed) { const ma = p => P.type === 'mirror' ? mod(P.k - p) : mod(p + P.k); if (ma(P.seed.p) !== P.seed.c) e.push('chữ mồi sai'); if (!P.answer.includes(AZ[P.seed.p])) e.push('chữ mồi không có trong câu'); }
  return e;
};
const duongDi = (P, lv) => {
  const e = [], D = window.__dd, L = D.LEVELS[lv];
  if (P.n < L.n[0] || P.n > L.n[1]) e.push('số điểm ' + P.n + ' ngoài mức');
  if (!Array.isArray(P.route) || P.route.length < 2) return ['không có đường đi'];
  if (P.route[0] !== P.start) e.push('không bắt đầu ở nhà');
  if (P.route[P.route.length - 1] !== P.goal) e.push('không kết thúc ở trường');
  for (let i = 1; i < P.route.length; i++) if (!D.edgeFor(P, P.route[i - 1], P.route[i])) { e.push('đường đi qua đoạn không có hoặc ngược chiều'); break; }
  if (e.length) return e;
  for (const q of P.req) if (!P.route.includes(q)) e.push('bỏ sót điểm phải ghé');
  const c = D.costOf(P, P.route); if (c !== P.best) e.push(`best ${P.best} ≠ chi phí đường đi ${c}`);
  const s = D.solve(P, 0, P.req); if (!s) e.push('solve không ra lời giải'); else if (s.cost !== P.best) e.push(`solve ${s.cost} ≠ best ${P.best}`);
  if (P.edges.some(x => !(x.c >= 1 && x.c <= L.pmax))) e.push('chi phí đoạn ngoài mức');
  return e;
};
const chongHinh = (P) => {
  const e = [], st = window.__chong.stack, same = (X, Y) => X.length === Y.length && X.every((v, i) => v === Y[i]), cnt = X => X.reduce((s, v) => s + v, 0), N = P.n * P.n;
  const F = { or: (a, b) => a | b, and: (a, b) => a & b, xor: (a, b) => a ^ b };
  if (P.kind === 'paint') {
    if (P.A.length !== N || P.T.length !== N || P.sol.length !== N) e.push('kích cỡ tấm sai');
    if (!same(st(P.A, P.sol, P.rule), P.T)) e.push('lời giải tô không ra hình đích');
    if (cnt(P.sol) !== P.min) e.push('min ≠ số ô của lời giải');
    if (cnt(P.sol) === 0) e.push('lời giải rỗng (không phải tô gì)');
  } else if (P.kind === 'pick') {
    if (!Array.isArray(P.cands) || P.cands.length !== 3) return ['không đủ 3 tấm để chọn'];
    const ok = P.cands.map(d => same(st(P.A, d, 'or'), P.T));
    if (ok.filter(Boolean).length !== 1) e.push('có ' + ok.filter(Boolean).length + ' tấm đúng');
    if (!ok[P.ans]) e.push('ans không phải tấm đúng');
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (same(P.cands[i], P.cands[j])) e.push('hai tấm trùng nhau');
  } else if (P.kind === 'guess') {
    if (!Array.isArray(P.ex) || P.ex.length < 2) e.push('thiếu ví dụ');
    const khop = P.opts.filter(r => P.ex.every(x => same(x.A.map((a, i) => F[r](a, x.B[i])), x.T)));
    if (khop.length !== 1) e.push('có ' + khop.length + ' luật khớp mọi ví dụ');
    if (P.opts[P.ans] !== P.rule || khop[0] !== P.rule) e.push('ans/rule không khớp');
    if (new Set(P.opts).size !== P.opts.length) e.push('lựa chọn luật trùng');
  } else e.push('kind lạ ' + P.kind);
  return e;
};

const GAMES = [
  { ten: 'robot-tim-duong', url: 'games/tu-duy-bebras/robot-tim-duong/', kiem: robot },
  { ten: 'xep-ong-bi', url: 'games/tu-duy-bebras/xep-ong-bi/', kiem: ongBi },
  { ten: 'xoay-lat-hinh', url: 'games/tu-duy-bebras/xoay-lat-hinh/', kiem: xoayLat },
  { ten: 'giai-ma-thu', url: 'games/tu-duy-bebras/giai-ma-thu/', kiem: maThu },
  { ten: 'duong-di-re-nhat', url: 'games/tu-duy-bebras/duong-di-re-nhat/', kiem: duongDi },
  { ten: 'chong-hinh', url: 'games/tu-duy-bebras/chong-hinh/', kiem: chongHinh },
  // bản Tiểu học (?kid=1) do Hành trình Tiểu học mở
  { ten: 'robot-tim-duong (kid)', url: 'games/tu-duy-bebras/robot-tim-duong/?kid=1', kiem: robot },
  { ten: 'xep-ong-bi (kid)', url: 'games/tu-duy-bebras/xep-ong-bi/?kid=1', kiem: ongBi },
  { ten: 'giai-ma-thu (kid)', url: 'games/tu-duy-bebras/giai-ma-thu/?kid=1', kiem: maThu },
  { ten: 'chong-hinh (kid)', url: 'games/tu-duy-bebras/chong-hinh/?kid=1', kiem: chongHinh },
].filter(g => !CHON.length || CHON.some(c => g.ten.includes(c)));

/* chạy trong trang: tạo đề cho một loạt seed rồi kiểm */
const chayTrongTrang = ({ src, lv, seeds }) => {
  const kiem = (0, eval)('(' + src + ')');
  const quet = v => { if (v === undefined || (typeof v === 'number' && !Number.isFinite(v))) return true; if (v && typeof v === 'object') for (const k in v) if (quet(v[k])) return true; return false; };
  const bad = [];
  for (const seed of seeds) {
    const r = seed % 10; let P;
    try { P = window.__kit.make(lv, r, seed); } catch (err) { bad.push({ seed, r, loi: 'make ném lỗi: ' + (err && err.message || err) }); continue; }
    if (!P || typeof P !== 'object') { bad.push({ seed, r, loi: 'make không trả về đề' }); continue; }
    if (quet(P)) bad.push({ seed, r, loi: 'đề có undefined/NaN' });
    let e; try { e = kiem(P, lv, r); } catch (err) { e = ['bộ kiểm ném lỗi: ' + (err && err.message || err)]; }
    if (e.length) bad.push({ seed, r, loi: e.join('; ') });
  }
  return bad;
};

async function kiemGame(browser, base, g) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
  const loiJS = []; page.on('pageerror', e => loiJS.push(e.message));
  await page.route(/^(?!http:\/\/127\.0\.0\.1)/, r => r.abort());   // không gọi ra ngoài (font, TTS…)
  const kq = { ten: g.ten, muc: [], loiJS, giay: 0 };
  const t0 = Date.now();
  try {
    await page.goto(base + g.url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__kit && window.__kit.make, null, { timeout: 15000 });
    for (let lv = 0; lv < 3; lv++) {
      const bad = [];
      for (let s = 1; s <= SO_SEED; s += 100) {
        const seeds = []; for (let k = s; k < s + 100 && k <= SO_SEED; k++) seeds.push(k);
        bad.push(...await page.evaluate(chayTrongTrang, { src: g.kiem.toString(), lv, seeds }));
      }
      const daBiet = bad.filter(b => DA_BIET.some(d => g.ten.includes(d.game) && (d.lv == null || d.lv === lv) && (d.seed == null || d.seed === b.seed)));
      kq.muc.push({ lv, soDe: SO_SEED, bad, daBiet });
    }
  } catch (err) { kq.loiJS.push('không chạy được: ' + err.message); }
  kq.giay = (Date.now() - t0) / 1000;
  await page.close();
  return kq;
}

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function vietBaoCao(kqs, rc) {
  fs.mkdirSync(BAO_CAO_DIR, { recursive: true });
  const rows = [];
  for (const k of kqs) for (const m of k.muc) {
    const moi = m.bad.filter(b => !m.daBiet.includes(b));
    rows.push(`<tr class="${moi.length || k.loiJS.length ? 'bad' : m.daBiet.length ? 'warn' : 'ok'}"><td>${esc(k.ten)}</td><td>${MUC[m.lv]}</td><td>${m.soDe}</td><td>${moi.length}</td><td>${m.daBiet.length}</td><td>${m.bad.slice(0, 5).map(b => `seed ${b.seed} (màn ${b.r + 1}): ${esc(b.loi)}`).join('<br>')}${m.bad.length > 5 ? '<br>…' : ''}</td></tr>`);
  }
  const js = kqs.filter(k => k.loiJS.length).map(k => `<li><b>${esc(k.ten)}</b>: ${k.loiJS.map(esc).join('; ')}</li>`).join('');
  const html = `<!doctype html><html lang="vi"><meta charset="utf-8"><title>Kiểm tra đề Bebras</title>
<style>body{font-family:system-ui,sans-serif;margin:20px;max-width:1100px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left;vertical-align:top;font-size:14px}
tr.ok td:nth-child(4){color:#1a7f37}tr.bad{background:#ffe9e9}tr.warn{background:#fff6d6}</style>
<h1>Kiểm tra đề Bebras — ${rc ? 'CHƯA ĐẠT' : 'ĐẠT'}</h1><p>${new Date().toLocaleString('vi-VN')} · ${SO_SEED} seed mỗi mức · seed cố định (r = seed % 10) để tái hiện: mở game rồi gõ <code>__kit.make(lv, r, seed)</code>.</p>
${js ? `<h2>Lỗi JS</h2><ul>${js}</ul>` : ''}
<table><tr><th>Game</th><th>Mức</th><th>Số đề</th><th>Lỗi mới</th><th>Đã biết</th><th>Ví dụ</th></tr>${rows.join('')}</table></html>`;
  fs.writeFileSync(path.join(BAO_CAO_DIR, 'de-bebras.html'), html);
}

(async () => {
  const { server, base } = await phucVu(ROOT);
  const EXE = process.env.CHROME;
  const browser = await chromium.launch({ executablePath: EXE && fs.existsSync(EXE) ? EXE : undefined });
  const t0 = Date.now();
  const kqs = await Promise.all(GAMES.map(g => kiemGame(browser, base, g)));
  await browser.close(); server.close();
  let rc = 0, tongDe = 0, tongMoi = 0, tongBiet = 0;
  for (const k of kqs) {
    console.log(`\n${k.ten} (${k.giay.toFixed(1)} s)`);
    for (const m of k.muc) {
      const moi = m.bad.filter(b => !m.daBiet.includes(b));
      tongDe += m.soDe; tongMoi += moi.length; tongBiet += m.daBiet.length;
      console.log(`  ${moi.length ? '✗' : '✓'} ${MUC[m.lv].padEnd(4)} ${m.soDe} đề · ${moi.length} lỗi mới · ${m.daBiet.length} đã biết`);
      for (const b of moi.slice(0, 8)) console.log(`      seed ${b.seed} (màn ${b.r + 1}): ${b.loi}`);
      if (moi.length > 8) console.log(`      … còn ${moi.length - 8} đề lỗi, xem báo cáo HTML`);
      for (const b of m.daBiet.slice(0, 3)) console.log(`      ĐÃ BIẾT seed ${b.seed}: ${b.loi}`);
      if (moi.length) rc = 1;
    }
    if (k.loiJS.length) { rc = 1; console.log('  ✗ lỗi JS: ' + k.loiJS.slice(0, 3).join(' | ')); }
  }
  vietBaoCao(kqs, rc);
  console.log(`\nTổng: ${tongDe} đề · ${tongMoi} lỗi mới · ${tongBiet} đã biết · ${((Date.now() - t0) / 1000).toFixed(0)} s → ${rc ? 'CHƯA ĐẠT' : 'ĐẠT'}`);
  console.log('Báo cáo: ' + path.relative(ROOT, path.join(BAO_CAO_DIR, 'de-bebras.html')));
  process.exit(rc);
})().catch(e => { console.error(e); process.exit(2); });
