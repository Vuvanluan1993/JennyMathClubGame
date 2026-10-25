// Kiểm tra đề tự tạo của Hành trình Mầm non (TIEU_CHI.md §1): 2000 câu qua __mn.test(type, lv).
//   node tools/test/de-mam-non.mjs             → 2000 câu, 14 dạng × 8 màn, seed cố định
//   SO_CAU=300 node tools/test/de-mam-non.mjs  → ít câu hơn
//   node tools/test/de-mam-non.mjs add sub      → chỉ dạng có tên này
// Trang gắn R = Math.random lúc tải nên thay Math.random bằng bộ sinh có seed TRƯỚC khi trang chạy (addInitScript);
// mỗi câu: __reseed(seed) → __mn.test(type, lv) (trang dựng câu thật) → lấy câu hỏi qua móc gen → kiểm.
// Kiểm: đáp án nằm trong lựa chọn, lựa chọn không trùng, không số âm, phép tính đúng, chỉ 1 chỗ khác/1 hình khác,
// quy luật dãy hình đúng, không undefined/NaN, màn hình có dựng ra lựa chọn, không lỗi JS.
// Tái hiện: mở games/hanh-trinh-jenny/mam-non/, thay Math.random bằng mulberry32(seed) rồi gọi __mn.ACTS[type].gen(lv).
// Lỗi đã ghi nhận (chờ việc khác sửa) nằm ở DA_BIET: in "ĐÃ BIẾT", không làm đỏ. Lỗi mới → rc 1.
// Báo cáo HTML: $BAO_CAO_DIR/de-mam-non.html (mặc định .ci/bao-cao/).
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

if (process.env.PW_DIR && !process.env.PLAYWRIGHT_BROWSERS_PATH) process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PW_DIR;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BAO_CAO_DIR = process.env.BAO_CAO_DIR || path.join(ROOT, '.ci', 'bao-cao');
const SO_CAU = +(process.env.SO_CAU || 2000);
const URL_GAME = 'games/hanh-trinh-jenny/mam-non/';
const TAT_CA = ['count', 'match', 'compare', 'add', 'sub', 'split', 'word', 'odd', 'spot', 'color', 'pattern', 'ordinal', 'clock', 'space'];
const TYPES = TAT_CA.filter(t => !process.argv.slice(2).length || process.argv.slice(2).includes(t));   // lọc dạng nhưng giữ nguyên seed → dạng

/* Lỗi đã biết: { type, seed, viec } — seed bỏ trống = mọi seed của dạng đó.
   25/10/2026: dạng word chế độ chọn phép tính có 2 phép tính cùng ra kết quả đúng (vd "3 − 1" và "1 + 1"), 9/30 000 câu,
   tìm bằng SO_CAU=30000; không rơi vào 2000 câu mặc định. Chờ task riêng sửa gen của ACTS.word (lọc wrong theo giá trị). */
const DA_BIET = [
  { type: 'word', seed: 8238, viec: 'TASKS.md: word 2 phép tính cùng kết quả' },
  { type: 'word', seed: 10254, viec: 'TASKS.md: word 2 phép tính cùng kết quả' },
  { type: 'word', seed: 11430, viec: 'TASKS.md: word 2 phép tính cùng kết quả' },
  { type: 'word', seed: 13446, viec: 'TASKS.md: word 2 phép tính cùng kết quả' },
  { type: 'word', seed: 16302, viec: 'TASKS.md: word 2 phép tính cùng kết quả' },
  { type: 'word', seed: 17086, viec: 'TASKS.md: word 2 phép tính cùng kết quả' },
  { type: 'word', seed: 25780, viec: 'TASKS.md: word 2 phép tính cùng kết quả' },
  { type: 'word', seed: 26046, viec: 'TASKS.md: word 2 phép tính cùng kết quả' },
  { type: 'word', seed: 27404, viec: 'TASKS.md: word 2 phép tính cùng kết quả' },
];

/* ---------- máy chủ tĩnh nhỏ ---------- */
const MIME = { html: 'text/html; charset=utf-8', js: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg',
  svg: 'image/svg+xml', mp3: 'audio/mpeg', woff2: 'font/woff2', woff: 'font/woff', ico: 'image/x-icon', webp: 'image/webp' };
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

/* ---------- bộ kiểm một câu (chạy trong trang) ---------- */
const kiemCau = (q, type, lv, dom) => {
  const e = [], MAXN = lv < 4 ? 5 : 10, J = x => JSON.stringify(x);
  const khacNhau = a => new Set(a.map(J)).size === a.length;
  const soTot = a => a.every(v => typeof v === 'number' && Number.isInteger(v) && v >= 0);
  const co = (opts, ans) => opts.some(v => J(v) === J(ans));
  if (!q) return ['không lấy được câu hỏi'];
  if (typeof q.ask !== 'string' || !q.ask.trim()) e.push('thiếu ask');
  if (typeof q.say !== 'string' || !q.say.trim()) e.push('thiếu say (lời đọc)');
  if (/undefined|NaN|\[object/.test(J(q))) e.push('có undefined/NaN trong câu');
  const luaChon = (opts, ans, lo) => {
    if (!Array.isArray(opts) || opts.length < 2) { e.push('thiếu lựa chọn'); return; }
    if (!khacNhau(opts)) e.push('lựa chọn trùng ' + J(opts));
    if (!co(opts, ans)) e.push('đáp án ' + J(ans) + ' không có trong lựa chọn ' + J(opts));
    if (!soTot(opts)) e.push('lựa chọn âm hoặc không nguyên ' + J(opts));
    if (lo != null && opts.some(v => v < lo)) e.push('lựa chọn dưới ' + lo);
  };
  switch (type) {
    case 'count': if (!(q.n >= 1 && q.n <= MAXN)) e.push('n ngoài mức'); luaChon(q.opts, q.n, 1); break;
    case 'match':
      if (!Array.isArray(q.ns) || q.ns.length !== 3 || !khacNhau(q.ns)) e.push('số trùng hoặc không đủ 3');
      if (!khacNhau(q.ks)) e.push('nhóm đồ vật trùng');
      if (J(q.right.slice().sort()) !== J(q.ns.slice().sort())) e.push('cột số không khớp nhóm');
      if (q.ns.some(v => v < 1 || v > MAXN)) e.push('số ngoài mức'); break;
    case 'compare':
      if (!(q.a >= 1 && q.b >= 1 && q.a <= MAXN && q.b <= MAXN)) e.push('số ngoài mức');
      if (q.mode === 'eq') { if (Math.abs(q.a - q.b) > 1) e.push('bằng nhau?: lệch quá 1'); }
      else { if (q.a === q.b) e.push('hai bên bằng nhau mà hỏi nhiều/ít hơn'); if (q.k1 === q.k2) e.push('hai nhóm cùng loại đồ vật'); }
      break;
    case 'add': if (q.x + q.y !== q.s) e.push('x+y≠s'); if (q.x < 1 || q.y < 1) e.push('số hạng < 1'); if (q.s > MAXN) e.push('tổng vượt mức'); luaChon(q.opts, q.s, 0); break;
    case 'sub': if (q.x - q.y !== q.s) e.push('x−y≠s'); if (q.s < 0) e.push('kết quả âm'); if (q.y < 1) e.push('bớt 0'); if (q.x > MAXN) e.push('số vượt mức'); luaChon(q.opts, q.s, 0); break;
    case 'split': if (q.a + q.b !== q.s) e.push('a+b≠s'); if (q.a < 1 || q.b < 0) e.push('phần âm'); luaChon(q.opts, q.b, 0); break;
    case 'word': {
      const ans = q.add ? q.x + q.y : q.x - q.y;
      if (ans !== q.ans) e.push('ans sai'); if (q.ans < 0) e.push('kết quả âm'); if (!q.add && q.y >= q.x) e.push('trừ ra âm hoặc 0');
      if (!/\d/.test(q.ask)) e.push('đề thiếu số');
      if (q.mode === 'num') luaChon(q.opts, q.ans, 0);
      else {
        if (!Array.isArray(q.opts) || q.opts.length < 2) e.push('thiếu lựa chọn phép tính');
        else {
          if (!khacNhau(q.opts)) e.push('phép tính trùng ' + J(q.opts));
          if (!q.opts.includes(q.right)) e.push('phép tính đúng không có trong lựa chọn');
          for (const o of q.opts) { const m = /^(\d+) − (\d+)$/.exec(o); if (m && +m[1] < +m[2]) e.push('phép trừ ra âm: ' + o); }
          const dung = q.opts.filter(o => { const m = /^(\d+) ([+−]) (\d+)$/.exec(o); if (!m) return false; return (m[2] === '+' ? +m[1] + +m[3] : +m[1] - +m[3]) === q.ans; });
          if (dung.length !== 1) e.push('có ' + dung.length + ' phép tính cho ra kết quả đúng: ' + J(q.opts));
        }
      }
      break;
    }
    case 'odd': {
      if (!Array.isArray(q.items) || q.items.length < 4) { e.push('thiếu hình'); break; }
      if (!(q.odd >= 0 && q.odd < q.items.length)) { e.push('odd ngoài mảng'); break; }
      const o = J(q.items[q.odd]), khac = q.items.filter((_, i) => i !== q.odd).map(J);
      if (khac.includes(o)) e.push('hình "khác" lại giống một hình kia');
      if (!q.why) e.push('thiếu lời giải thích'); break;
    }
    case 'spot': {
      const n = q.ks.length;
      if (!(q.d >= 0 && q.d < n)) { e.push('d ngoài mảng'); break; }
      if (q.rk[q.d] === q.ks[q.d] && q.rc[q.d] === q.cs[q.d]) e.push('chỗ khác không khác gì');
      for (let i = 0; i < n; i++) if (i !== q.d && (q.rk[i] !== q.ks[i] || q.rc[i] !== q.cs[i])) e.push('có hơn 1 chỗ khác');
      break;
    }
    case 'color': {
      const kinds = [...new Set(q.items)];
      if (!khacNhau(q.rules.map(r => r.kind))) e.push('luật trùng hình'); if (!khacNhau(q.rules.map(r => r.col))) e.push('luật trùng màu');
      for (const r of q.rules) if (!kinds.includes(r.kind)) e.push('luật nói tới hình không có trên màn');
      if (kinds.length <= q.rules.length) e.push('không còn hình nào để trắng'); break;
    }
    case 'pattern': {
      const s = q.seq.map(J); let L = null;
      for (const l of [2, 3]) if (s.every((x, i) => x === s[i % l])) { L = l; break; }
      if (!L) e.push('dãy không theo chu kì 2 hay 3'); else if (s[s.length % L] !== J(q.next)) e.push('hình tiếp theo sai');
      if (!khacNhau(q.opts.map(o => o.v))) e.push('lựa chọn trùng');
      if (q.opts.filter(o => J(o.v) === J(q.next)).length !== 1) e.push('số lựa chọn đúng ≠ 1');
      if (q.opts.length < 2) e.push('thiếu lựa chọn'); break;
    }
    case 'ordinal': { const n = q.ks.length; if (!khacNhau(q.ks)) e.push('bạn trùng'); if (!(q.k >= 1 && q.k <= n)) e.push('thứ k ngoài hàng'); luaChon(q.opts, q.k, 1); if (q.opts.some(v => v > n)) e.push('lựa chọn vượt số bạn'); break; }
    case 'clock': if (!(q.h >= 1 && q.h <= 12)) e.push('giờ lạ'); luaChon(q.opts, q.h, 1); if (q.opts.some(v => v > 12)) e.push('giờ > 12 trong lựa chọn'); break;
    case 'space':
      if (q.mode === 'who') { if (!khacNhau(q.ks)) e.push('bạn trùng'); if (!q.places.includes(q.pos)) e.push('vị trí hỏi không có'); if (q.ks.length !== q.places.length) e.push('số bạn ≠ số vị trí'); }
      else if (q.mode === 'box') { if (q.k1 === q.k2) e.push('hai bạn giống nhau'); }
      else if (q.mode !== 'drag') e.push('mode lạ ' + q.mode);
      break;
    default: e.push('dạng lạ ' + type);
  }
  if (dom) {
    if (!dom.n) e.push('màn hình trống sau khi dựng');
    if (dom.thieuNut) e.push('nút đáp án ' + dom.ans + ' không có trên màn hình');
    if (!dom.ask) e.push('không hiện đề bài');
  }
  return e;
};

/* chạy trong trang: một loạt câu */
const chayTrongTrang = ({ src, viec }) => {
  const kiem = (0, eval)('(' + src + ')'), bad = [];
  const ACTS = window.__mn.ACTS;
  if (!window.__mocGen) {   // móc gen để lấy câu hỏi mà trang vừa dựng
    window.__mocGen = true;
    for (const k of Object.keys(ACTS)) { const goc = ACTS[k].gen; ACTS[k].gen = function (lv) { const q = goc.call(this, lv); window.__cauCuoi = q; return q; }; }
  }
  for (const { seed, type, lv } of viec) {
    window.__cauCuoi = null; window.__reseed(seed);
    try { window.__mn.test(type, lv); } catch (err) { bad.push({ seed, type, lv, loi: '__mn.test ném lỗi: ' + (err && err.message || err) }); continue; }
    const q = window.__cauCuoi, st = document.querySelector('#pStage');
    const dom = { n: st ? st.children.length : 0, ask: !!((document.querySelector('#pAsk') || {}).textContent || '').trim() };
    const ansV = q && { count: q.n, add: q.s, sub: q.s, split: q.b, word: q.mode === 'num' ? q.ans : q.right, ordinal: q.mode === 'num' ? q.k : null, clock: q.mode === 'read' ? q.h : null }[type];
    if (ansV != null && st && st.querySelector('[data-v]')) { dom.ans = ansV; dom.thieuNut = ![...st.querySelectorAll('[data-v]')].some(b => b.dataset.v === String(ansV)); }
    let e; try { e = kiem(q, type, lv, dom); } catch (err) { e = ['bộ kiểm ném lỗi: ' + (err && err.message || err)]; }
    if (e.length) bad.push({ seed, type, lv, loi: e.join('; ') });
  }
  return bad;
};

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

(async () => {
  const { server, base } = await phucVu(ROOT);
  const EXE = process.env.CHROME;
  const browser = await chromium.launch({ executablePath: EXE && fs.existsSync(EXE) ? EXE : undefined });
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  const loiJS = []; page.on('pageerror', e => loiJS.push(e.message));
  await page.route(/^(?!http:\/\/127\.0\.0\.1)/, r => r.abort());   // không gọi ra ngoài (TTS, font)
  await page.addInitScript(() => {   // mulberry32 có seed, thay Math.random trước khi trang gắn R = Math.random
    let a = 1;
    Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    window.__reseed = s => { a = s; };
  });
  const t0 = Date.now();
  await page.goto(base + URL_GAME, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__mn && window.__mn.ACTS && window.__mn.test, null, { timeout: 15000 });
  await page.evaluate(() => { const b = document.querySelector('#bSnd'); if (b && !b.classList.contains('off')) b.click(); });   // tắt tiếng

  const viec = []; for (let seed = 1; seed <= SO_CAU; seed++) { const type = TAT_CA[seed % TAT_CA.length]; if (TYPES.includes(type)) viec.push({ seed, type, lv: seed % 8 }); }
  const bad = [];
  for (let i = 0; i < viec.length; i += 40) bad.push(...await page.evaluate(chayTrongTrang, { src: kiemCau.toString(), viec: viec.slice(i, i + 40) }));
  await browser.close(); server.close();

  const daBiet = bad.filter(b => DA_BIET.some(d => d.type === b.type && (d.seed == null || d.seed === b.seed)));
  const moi = bad.filter(b => !daBiet.includes(b));
  let rc = moi.length || loiJS.length ? 1 : 0;
  console.log(`Mầm non: ${viec.length} câu · ${TYPES.length} dạng · ${moi.length} lỗi mới · ${daBiet.length} đã biết · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  for (const t of TYPES) {
    const n = viec.filter(v => v.type === t).length, m = moi.filter(b => b.type === t), k = daBiet.filter(b => b.type === t);
    console.log(`  ${m.length ? '✗' : '✓'} ${t.padEnd(8)} ${n} câu · ${m.length} lỗi mới · ${k.length} đã biết`);
    for (const b of m.slice(0, 12)) console.log(`      seed ${b.seed} (màn ${b.lv + 1}): ${b.loi}`);
    if (m.length > 12) console.log(`      … còn ${m.length - 12}, xem báo cáo HTML`);
    for (const b of k.slice(0, 2)) console.log(`      ĐÃ BIẾT seed ${b.seed}: ${b.loi}`);
  }
  if (loiJS.length) console.log('  ✗ lỗi JS: ' + [...new Set(loiJS)].slice(0, 5).join(' | '));

  fs.mkdirSync(BAO_CAO_DIR, { recursive: true });
  const rows = TYPES.map(t => { const n = viec.filter(v => v.type === t).length, m = moi.filter(b => b.type === t), k = daBiet.filter(b => b.type === t);
    return `<tr class="${m.length ? 'bad' : k.length ? 'warn' : 'ok'}"><td>${t}</td><td>${n}</td><td>${m.length}</td><td>${k.length}</td><td>${[...m, ...k].slice(0, 6).map(b => `seed ${b.seed} (màn ${b.lv + 1}): ${esc(b.loi)}`).join('<br>')}</td></tr>`; });
  fs.writeFileSync(path.join(BAO_CAO_DIR, 'de-mam-non.html'), `<!doctype html><html lang="vi"><meta charset="utf-8"><title>Kiểm tra đề Mầm non</title>
<style>body{font-family:system-ui,sans-serif;margin:20px;max-width:1100px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left;vertical-align:top;font-size:14px}
tr.bad{background:#ffe9e9}tr.warn{background:#fff6d6}</style>
<h1>Kiểm tra đề Mầm non — ${rc ? 'CHƯA ĐẠT' : 'ĐẠT'}</h1><p>${new Date().toLocaleString('vi-VN')} · ${SO_CAU} câu · seed = số thứ tự câu, dạng = TYPES[seed % 14], màn = seed % 8 + 1.</p>
${loiJS.length ? `<h2>Lỗi JS</h2><ul>${[...new Set(loiJS)].map(x => '<li>' + esc(x) + '</li>').join('')}</ul>` : ''}
<table><tr><th>Dạng</th><th>Số câu</th><th>Lỗi mới</th><th>Đã biết</th><th>Ví dụ</th></tr>${rows.join('')}</table></html>`);
  console.log(`→ ${rc ? 'CHƯA ĐẠT' : 'ĐẠT'} · báo cáo: ${path.relative(ROOT, path.join(BAO_CAO_DIR, 'de-mam-non.html'))}`);
  process.exit(rc);
})().catch(e => { console.error(e); process.exit(2); });
