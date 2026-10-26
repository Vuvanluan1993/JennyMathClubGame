// Chụp ảnh các trang Lớp học ảo để so trước/sau khi đổi mã (P-14b, 26/10/2026). Cần build trước; dùng playwright + pngjs ở node_modules gốc kho.
//   node src/lop-hoc-ao/tools/vite/so-anh.mjs <thư mục ra>          chụp 7 trang (+4 màn bản đầy đủ) × 4 khổ (320/375/414/900) = 44 ảnh
//   node src/lop-hoc-ao/tools/vite/so-anh.mjs <thư mục A> <thư mục B> so từng ảnh, in % điểm ảnh khác, thoát 1 nếu > 0,1 %
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const KHO = [320, 375, 414, 900];
// trang: [tên, đường dẫn, các bước trước khi chụp]
const TRANG = [
  ['hoc-sinh', 'games/lop-hoc-ao/index.html'],
  ['giao-vien', 'games/lop-hoc-ao/giao-vien/index.html'],
  ['phu-huynh', 'games/lop-hoc-ao/phu-huynh/index.html'],
  ['quan-ly', 'games/lop-hoc-ao/quan-ly/index.html'],
  ['day-du', 'src/lop-hoc-ao/dist/lop-hoc-ao-jenny.html'],
  ['thu-hoc-sinh', 'games/lop-hoc-ao/demo/index.html'],
  ['thu-giao-vien', 'games/lop-hoc-ao/demo/giao-vien/index.html'],
];
// bản đầy đủ: thêm vài màn sâu hơn (đăng nhập sẵn dữ liệu demo): đảo lớp 1, giáo viên, phụ huynh, hồ sơ
const MAN = {
  'day-du': [
    ['home', null],
    ['gv', () => { setRole('gv'); }],
    ['ph', () => { setRole('ph'); }],
    ['hoso', () => { setRole('hs'); go({ k: 'home', tab: 'hoso' }); }],
    ['nha', () => { go({ k: 'home', tab: 'nha' }); }],
  ],
};

async function chup(ra) {
  fs.mkdirSync(ra, { recursive: true });
  const b = await chromium.launch();
  for (const [ten, f] of TRANG) for (const w of KHO) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 600 ? 740 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.route(/^https?:/, r => r.abort());
    const loi = []; p.on('pageerror', e => loi.push(e.message));
    await p.goto('file://' + path.join(ROOT, f), { waitUntil: 'load' });
    await p.waitForTimeout(600);
    for (const [man, buoc] of MAN[ten] || [['', null]]) {
      if (buoc) { await p.evaluate(buoc); await p.waitForTimeout(400); }
      await p.evaluate(() => { document.querySelectorAll('canvas').forEach(c => c.style.visibility = 'hidden'); document.querySelectorAll('.ver,#ver,[data-ver]').forEach(e => e.style.visibility = 'hidden'); });
      await p.screenshot({ path: path.join(ra, `${ten}${man ? '-' + man : ''}-${w}.png`), animations: 'disabled', caret: 'hide' });
    }
    if (loi.length) fs.writeFileSync(path.join(ra, `${ten}-${w}.loi.txt`), loi.join('\n'));
    await ctx.close();
  }
  await b.close();
  console.log('đã chụp', fs.readdirSync(ra).filter(f => f.endsWith('.png')).length, 'ảnh →', path.relative(ROOT, ra));
}

function so(a, b) {
  let xau = 0;
  for (const f of fs.readdirSync(a).filter(f => f.endsWith('.png')).sort()) {
    const fb = path.join(b, f);
    if (!fs.existsSync(fb)) { console.log(`THIẾU  ${f}`); xau++; continue; }
    const A = PNG.sync.read(fs.readFileSync(path.join(a, f))), B = PNG.sync.read(fs.readFileSync(fb));
    if (A.width !== B.width || A.height !== B.height) { console.log(`KHÁC KHỔ ${f} ${A.width}×${A.height} / ${B.width}×${B.height}`); xau++; continue; }
    let k = 0; for (let i = 0; i < A.data.length; i += 4) if (A.data[i] !== B.data[i] || A.data[i + 1] !== B.data[i + 1] || A.data[i + 2] !== B.data[i + 2]) k++;
    const pt = k / (A.width * A.height) * 100;
    console.log(`${pt > 0.1 ? 'KHÁC ' : 'ok   '} ${pt.toFixed(3).padStart(7)} %  ${f}`);
    if (pt > 0.1) xau++;
  }
  console.log(xau ? `✗ ${xau} ảnh khác > 0,1 %` : '✓ mọi ảnh ≤ 0,1 %');
  process.exit(xau ? 1 : 0);
}
const [a, b] = process.argv.slice(2);
if (!a) { console.error('cần thư mục ra'); process.exit(2); }
if (b) so(a, b); else await chup(a);
