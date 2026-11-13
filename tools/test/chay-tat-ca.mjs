// Chạy mọi bài kiểm tra của kho, gom mã lỗi, ghi .ci/rc.txt (0 = tất cả ĐẠT).
//   npm test                 → chạy hết (cần build trước: npm run build)
//   node tools/test/chay-tat-ca.mjs kiem-tra tieng-anh   → chỉ chạy các file có tên chứa chuỗi này
// Tìm theo tên file (glob), không danh sách cứng:
//   tools/test/*.mjs                 (trừ chính file này)
//   src/lop-hoc-ao/tools/test/*.js   (các kiểm tra LUAT-DA-CHOT.md mục 7)
// Biến môi trường: PW_DIR (thư mục trình duyệt Playwright, mặc định của Playwright), CHROME (đường dẫn chrome cụ thể).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CI_DIR = path.join(ROOT, '.ci');
const ME = path.resolve(fileURLToPath(import.meta.url));
const TIMEOUT_MS = 20 * 60 * 1000;
const chon = process.argv.slice(2);

const list = (dir, ext) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => f.endsWith(ext) && !f.startsWith('_')).sort()
        .map(f => path.join(dir, f))
    : [];
let tests = [
  ...list(path.join(ROOT, 'tools', 'test'), '.mjs'),
  ...list(path.join(ROOT, 'src', 'lop-hoc-ao', 'tools', 'test'), '.js'),
].filter(f => path.resolve(f) !== ME);
if (chon.length) tests = tests.filter(f => chon.some(c => path.basename(f).includes(c)));

fs.mkdirSync(CI_DIR, { recursive: true });
const ghi = rc => fs.writeFileSync(path.join(CI_DIR, 'rc.txt'), String(rc) + '\n');

if (!tests.length) { console.error('Không tìm thấy bài kiểm tra nào.'); ghi(2); process.exit(2); }
const dist = path.join(ROOT, 'src', 'lop-hoc-ao', 'dist', 'lop-hoc-ao-jenny.html');
if (!fs.existsSync(dist)) {
  console.error('Chưa có ' + path.relative(ROOT, dist) + ' — chạy "npm run build" trước.');
  ghi(2); process.exit(2);
}

const env = { ...process.env, OUT_DIR: process.env.OUT_DIR || path.join(CI_DIR, 'kien-thuc') };
if (env.PW_DIR && !env.PLAYWRIGHT_BROWSERS_PATH) env.PLAYWRIGHT_BROWSERS_PATH = env.PW_DIR;

const kq = [];
for (const f of tests) {
  const ten = path.relative(ROOT, f);
  console.log('\n' + '='.repeat(70) + '\n▶ ' + ten + '\n' + '='.repeat(70));
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [f], { cwd: path.dirname(f), env, stdio: 'inherit', timeout: TIMEOUT_MS });
  let rc = r.status;
  if (r.error && r.error.code === 'ETIMEDOUT') { console.error('⏱ Quá ' + TIMEOUT_MS / 60000 + ' phút, dừng.'); rc = 124; }
  else if (rc === null) { console.error('Bị ngắt bởi tín hiệu ' + r.signal); rc = 125; }
  kq.push({ ten, rc, giay: Math.round((Date.now() - t0) / 1000) });
}

const rcChung = kq.some(k => k.rc !== 0) ? 1 : 0;
console.log('\n' + '-'.repeat(70) + '\nTỔNG KẾT');
for (const k of kq) console.log(`  ${k.rc === 0 ? 'ĐẠT     ' : 'CHƯA ĐẠT'}  rc=${k.rc}  ${k.giay}s  ${k.ten}`);
console.log(`  → rc chung = ${rcChung} (${kq.filter(k => k.rc === 0).length}/${kq.length} ĐẠT)`);
fs.writeFileSync(path.join(CI_DIR, 'ket-qua.txt'), kq.map(k => `${k.rc}\t${k.giay}s\t${k.ten}`).join('\n') + '\n');
ghi(rcChung);
process.exit(rcChung);
