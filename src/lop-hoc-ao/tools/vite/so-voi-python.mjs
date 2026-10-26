// So vai.js với tools/_student.py + tools/_teacher.py (P-14a): phải GIỐNG TỪNG BYTE.
//   node src/lop-hoc-ao/tools/vite/so-voi-python.mjs      (cần python3; không cần build trước)
// 8 trang: 4 bản thật + 4 bản thử (--demo, P-07). Rebase lên bản Python mới: chạy, thấy KHÁC thì sửa vai.js / vai/* cho tới khi GIỐNG.
// Chạy Python trong thư mục tạm (không ghi vào games/ của kho). Thoát 1 nếu khác hoặc thiếu file Python.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { banDayDu, LAM } from './noi-file.js';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'so-vai-'));
const tGoc = path.join(tam, 'src', 'lop-hoc-ao');
fs.mkdirSync(path.join(tGoc, 'tools'), { recursive: true });
fs.mkdirSync(path.join(tGoc, 'dist'), { recursive: true });
fs.mkdirSync(path.join(tam, 'games', 'lop-hoc-ao'), { recursive: true });
const ban = banDayDu(goc);
fs.writeFileSync(path.join(tGoc, 'dist', 'lop-hoc-ao-jenny.html'), ban);
let loi = 0;
for (const f of ['_student.py', '_teacher.py']) {
  const src = path.join(goc, 'tools', f);
  if (!fs.existsSync(src)) { console.log('Không có tools/' + f); loi++; continue; }
  fs.copyFileSync(src, path.join(tGoc, 'tools', f));
  for (const them of [[], ['--demo']]) execFileSync('python3', [path.join(tGoc, 'tools', f), ...them], { cwd: tGoc, stdio: ['ignore', 'ignore', 'inherit'] });
}
const TRANG = [['hoc-sinh', 'index.html'], ['giao-vien', 'giao-vien/index.html'], ['phu-huynh', 'phu-huynh/index.html'], ['quan-ly', 'quan-ly/index.html']];
for (const [ten, f] of [...TRANG, ...TRANG.map(([ten, f]) => ['thu-' + ten, 'demo/' + f])]) {
  const py = path.join(tam, 'games', 'lop-hoc-ao', f);
  const a = fs.existsSync(py) ? fs.readFileSync(py, 'utf8') : null, b = LAM[ten](ban);
  if (a === b) { console.log(`GIỐNG  ${ten}  ${b.length} kí tự`); continue; }
  loi++;
  if (a === null) { console.log(`KHÁC   ${ten}  Python không ra ${f}`); continue; }
  let i = 0; while (a[i] === b[i]) i++;
  console.log(`KHÁC   ${ten}  lệch ở kí tự ${i}\n  python: ${JSON.stringify(a.slice(Math.max(0, i - 40), i + 80))}\n  vai.js: ${JSON.stringify(b.slice(Math.max(0, i - 40), i + 80))}`);
}
fs.rmSync(tam, { recursive: true, force: true });
console.log(loi ? `✗ ${loi} trang khác` : '✓ vai.js = Python');
process.exit(loi ? 1 : 0);
