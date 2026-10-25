// Chuyển dữ liệu trung tâm v2 (một khối JSON org/main.j) sang v3 (nhiều document) — P-06a, 25/10/2026.
// Dùng đúng hàm orgV3Tach / orgV3Gop trong bản build (js/core/62-may-chu.js), không chép lại logic.
//   node src/lop-hoc-ao/tools/chuyen-org-v3.mjs                 → chạy thử với dữ liệu demo: đếm doc, cỡ, kiểm tra chạy lại không đổi
//   node src/lop-hoc-ao/tools/chuyen-org-v3.mjs org.json [ra.json] → chuyển một file org (dán từ Firestore › org/main › j) ra các doc
// Trên máy chủ thật, quản lý bấm nút "⬆ Nâng cấp dữ liệu v3" ở trang Quản lý › Tài khoản (fbNangCapV3) — cùng hàm orgV3Tach.
// Cần: npm ci (playwright) và đã build (npm run build).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist', 'lop-hoc-ao-jenny.html');
if (!fs.existsSync(DIST)) { console.error('Chưa có dist/lop-hoc-ao-jenny.html — chạy npm run build trước.'); process.exit(2); }
const vao = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : null;

const b = await chromium.launch();
const p = await b.newPage();
await p.route(/^https?:/, r => r.abort());
await p.goto('file://' + DIST, {waitUntil: 'domcontentloaded'});
await p.waitForTimeout(400);
const kq = await p.evaluate(org => {
  if (!org) {
    try { setRole('ql'); } catch (e) {}
    org = JSON.parse(JSON.stringify(S.org));
    /* demo không có danh sách em/hồ sơ → thêm vài dòng để thử đủ loại doc */
    org.hs = STUDENTS.slice(0, 5).map(s => [s[0], s[1], s[2]]);
    org.hoso = {[org.hs[0][0]]: {gt: 'nu', ng: 1, th: 2, nam: 2019, dt: '0912345678', mail: 'ph@gmail.com'}};
    org.ph = {[org.hs[0][0]]: 'ph.na'}; org.phInfo = {'ph.na': {ten: 'Phụ huynh Na', dt: '0912345678', mail: 'ph@gmail.com'}};
    org.hosoNam = {[org.hs[1][0]]: [{nam: '2025–2026', lop: '1A', khoi: 1, sao: 12, kq: 'len'}]};
    org.nk = [{d: 1, ai: 'Quản lý trung tâm', t: 'Tạo lớp 1A'}, {d: 2, ai: 'Cô Jenny', t: 'Mở đảo j1 · lớp 1A'}];
    org.nghi = {[org.hs[2][0]]: {ly: 'nghi', nam: '2025–2026'}};
  }
  const D = orgV3Tach(org);
  const V = {main: D.main, lop: D.lop, hsdm: D.hsdm, hoso: D.hoso, gv: D.gv, ph: D.ph, nk: org.nk || [], san: {}};
  const O2 = orgV3Gop(V);
  const D2 = orgV3Tach(O2);
  const dem = c => Object.keys(D[c]).length, co = x => JSON.stringify(x).length;
  const khac = [];
  ['main', 'lop', 'hsdm', 'hoso', 'gv', 'ph'].forEach(c => { if (fbJ3(D[c]) !== fbJ3(D2[c])) khac.push(c); });
  /* các trường app dùng phải còn sau khi gộp */
  ['ten', 'nam', 'gd', 'lop', 'mo', 'gv', 'hs', 'ph', 'phInfo', 'hoso', 'hosoNam', 'nl', 'nk', 'nghi', 'namCu', 'xoa'].forEach(k => { if (O2[k] === undefined) khac.push('thiếu ' + k); });
  if (fbJ3(O2.gd) !== fbJ3(org.gd || {})) khac.push('gd');
  if (fbJ3(O2.mo) !== fbJ3(Object.fromEntries((org.lop || []).map(l => [l.id, (org.mo || {})[l.id] || {}])))) khac.push('mo');
  if (fbJ3(O2.hoso) !== fbJ3(org.hoso || {})) khac.push('hoso');
  if (fbJ3(O2.phInfo) !== fbJ3(org.phInfo || {})) khac.push('phInfo');
  return {doc: {main: 1, lop: dem('lop'), hsdm: dem('hsdm'), hoso: dem('hoso'), gv: dem('gv'), ph: dem('ph'), nk: (org.nk || []).length},
    co: {orgCu: co(org), main: co(D.main), lop: co(D.lop), hsdm: co(D.hsdm), hoso: co(D.hoso)}, khac, D};
}, vao);
await b.close();

console.log('Doc v3:', JSON.stringify(kq.doc));
console.log('Cỡ (kí tự):', JSON.stringify(kq.co));
if (process.argv[3]) { fs.writeFileSync(process.argv[3], JSON.stringify(kq.D, null, 1)); console.log('Đã ghi ' + process.argv[3]); }
const ok = !kq.khac.length;
console.log(`Chuyển v3: ${ok ? 'ĐẠT' : 'CHƯA ĐẠT'} — tách → gộp → tách ${ok ? 'không đổi' : 'khác ở: ' + kq.khac.join(', ')}`);
process.exit(ok ? 0 : 1);
