// Kiểm tra: không trang nào gọi ra ngoài (Google Fonts, translate_tts…) khi tải; không lỗi CSP; không lỗi JS.
//   node tools/test/khong-goi-ngoai.mjs          (chạy sau: npm run build)
// Mở mọi trang game + trang chủ + 4 trang Lớp học ảo (+ demo, dist nếu có) qua máy chủ tĩnh nội bộ,
// ghi mọi yêu cầu mạng; chỉ cho phép cùng nguồn và danh sách Firebase dưới đây. Thoát 1 nếu có vi phạm.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CHO_PHEP = [/^https:\/\/www\.gstatic\.com\/firebasejs\//, /^https:\/\/[a-z0-9-]+\.googleapis\.com\//,
  /^https:\/\/[a-z0-9-]+\.firebaseio\.com\//, /^wss:\/\/[a-z0-9-]+\.firebaseio\.com\//, /^https:\/\/jenny-lop-hoc-ao\.firebaseapp\.com\//];
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp3': 'audio/mpeg', '.enc': 'application/octet-stream' };

const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(ROOT, u); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const trang = [
  ...fs.readdirSync(path.join(ROOT, 'games')).filter(d => d !== 'lop-hoc-ao').flatMap(d =>
    fs.readdirSync(path.join(ROOT, 'games', d)).filter(g => !g.startsWith('_') && fs.existsSync(path.join(ROOT, 'games', d, g, 'index.html')))
      .map(g => `games/${d}/${g}/index.html`)),
  'index.html',
  'games/lop-hoc-ao/index.html', 'games/lop-hoc-ao/giao-vien/index.html', 'games/lop-hoc-ao/phu-huynh/index.html', 'games/lop-hoc-ao/quan-ly/index.html',
  'games/lop-hoc-ao/demo/index.html', 'src/lop-hoc-ao/dist/lop-hoc-ao-jenny.html',
].filter(p => fs.existsSync(path.join(ROOT, p)));

const br = await chromium.launch();
const ctx = await br.newContext({ viewport: { width: 390, height: 760 } });
let loi = 0;
for (const p of trang) {
  const pg = await ctx.newPage();
  const ngoai = [], csp = [], jsErr = [], hong = [];
  pg.on('request', r => { const u = r.url(); if (!u.startsWith(BASE) && !CHO_PHEP.some(re => re.test(u)) && !u.startsWith('data:') && !u.startsWith('blob:')) ngoai.push(u); });
  pg.on('response', r => { if (r.url().startsWith(BASE) && r.status() >= 400) hong.push(`${r.status()} ${r.url().slice(BASE.length)}`); });
  pg.on('console', m => { const t = m.text(); if (/Content Security Policy|Refused to/.test(t)) csp.push(t.slice(0, 160)); });
  pg.on('pageerror', e => jsErr.push(String(e.message || e).slice(0, 160)));
  try { await pg.goto(`${BASE}/${p}`, { waitUntil: 'networkidle', timeout: 30000 }); } catch (e) { jsErr.push('goto: ' + e.message.slice(0, 100)); }
  await pg.waitForTimeout(800);
  const xau = ngoai.length + csp.length + jsErr.length + hong.length;
  console.log(`${xau ? 'LỖI ' : 'ĐẠT '} ${p}`);
  for (const u of ngoai) console.log('    gọi ngoài:', u.slice(0, 140));
  for (const t of csp) console.log('    CSP:', t);
  for (const t of jsErr) console.log('    JS:', t);
  for (const t of hong) console.log('    hỏng:', t);
  loi += xau; await pg.close();
}
await br.close(); server.close();
console.log(`\n${trang.length} trang, ${loi} vi phạm → ${loi ? 'LỖI' : 'ĐẠT'}`);
process.exit(loi ? 1 : 0);
