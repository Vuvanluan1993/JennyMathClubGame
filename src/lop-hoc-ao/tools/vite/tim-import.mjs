// Sinh dòng import/export cho mọi file JS trong app.template.html (P-14b, 26/10/2026).
//   node tools/vite/tim-import.mjs          phân tích rồi GHI LẠI dòng import (đầu file) và chữ "export " (trước khai báo được file khác dùng)
//   node tools/vite/tim-import.mjs --xem    chỉ in báo cáo, không ghi
// Chạy lại được bất cứ lúc nào (sau mỗi lần rebase): bỏ hết import/export cũ rồi sinh mới, phần mã còn lại giữ nguyên từng byte.
// Cách tính (acorn + eslint-scope): mỗi file có tập "khai báo" (tên ở phạm vi module) và tập "dùng tự do" (tên không khai báo trong file).
//   - tên dùng tự do do đúng một file khác khai báo → import từ file đó (file đó được thêm "export ");
//   - tên do ≥ 2 file khai báo ("trùng") → import từ file SAU CÙNG (như script thường: bản sau thắng) và báo để xoá bản thừa;
//   - tên được GÁN ở file không khai báo nó ("gán chéo": S=…, render=function…) → lỗi: phải thành trạng thái toàn cục tường minh
//     (window.*) hoặc hooks (core/00-hooks.js); không sinh import cho tên đó;
//   - tên không file nào khai báo: phải là builtin trình duyệt/JS (gói globals), gán tường minh globalThis.X=…/window.X=… ở file nào đó
//     (ghi ra tools/vite/toan-cuc-sinh.json cho ESLint), hoặc có trong tools/vite/toan-cuc.json (mã chèn từ vai.js, bộ kiểm tra)
//     → không import; còn lại là lỗi "chưa khai báo".
// Nội dung theo khối (P-15a): file trong content/lop-N/ chỉ thấy tên của chính thư mục đó và của core (mỗi khối gói một phạm vi riêng khi nối);
//   core không bao giờ import từ content (core đọc nội dung qua đăng ký: dangKyKhoi ở core/30a); content/lop-N/index.js luôn export dangKy.
// Thoát 1 khi còn lỗi (vẫn ghi file để sửa dần). eslint.config.mjs (gốc kho) đọc cùng toan-cuc.json nên no-undef và script này cùng một luật.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import { thuTu } from './noi-file.js';
import { phanTich, nhapXuat, tenKhaiBao, lucNap, boModule, docFileJs, kiemTraLienKet } from './module.js';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const chiXem = process.argv.includes('--xem');
const TOAN_CUC = JSON.parse(fs.readFileSync(path.join(goc, 'tools', 'vite', 'toan-cuc.json'), 'utf8'));
const SINH = path.join(goc, 'tools', 'vite', 'toan-cuc-sinh.json'); // ghi ở bước 3: tên gán tường minh globalThis.X / window.X
const BUILTIN = new Set([...Object.keys(globals.browser), ...Object.keys(globals.es2025), ...Object.keys(TOAN_CUC.ten)]);
const RONG = 110; // độ dài tối đa một dòng import

const files = docFileJs(goc, thuTu(goc)).map(f => ({ ...f, code: boModule(f.code, f.ten) })); // mã sạch, không import/export
const viTri = new Map(files.map((f, i) => [f.ten, i]));

// 1. Phân tích từng file
for (const f of files) {
  const { ast, module } = phanTich(f.code, f.ten);
  f.ast = ast;
  f.khai = new Map(); // tên → kiểu khai báo
  for (const v of module.variables) if (v.defs.length) f.khai.set(v.name, v.defs[0].type === 'FunctionName' ? 'function' : v.defs[0].type === 'ClassName' ? 'class' : v.defs[0].parent.kind);
  f.tuDo = new Map(); // tên → { doc, ghi, lucNap }
  for (const r of module.through) {
    const n = r.identifier.name, o = f.tuDo.get(n) || { doc: false, ghi: false, lucNap: false };
    if (r.isRead()) o.doc = true; if (r.isWrite()) o.ghi = true; if (lucNap(r)) o.lucNap = true;
    f.tuDo.set(n, o);
  }
  f.tuongMinh = new Map(); // window.X = … / globalThis.X = … → tên → cách gán
  (function di(n) {
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && !n.left.computed && n.left.object.type === 'Identifier' && ['window', 'globalThis'].includes(n.left.object.name)) f.tuongMinh.set(n.left.property.name, n.left.object.name);
    for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(di); else if (v && typeof v.type === 'string') di(v); }
  })(ast);
}
const khoiCua = ten => (ten.match(/^content\/(lop-[^/]+)\//) || [])[1]; // P-15a: file thuộc khối nào (không: core)
const khaiBoi = new Map(); // tên → [file core]
const khaiKhoi = new Map(); // khối → Map(tên → [file của khối])
for (const f of files) {
  const k = khoiCua(f.ten), m = k ? (khaiKhoi.get(k) || khaiKhoi.set(k, new Map()).get(k)) : khaiBoi;
  for (const n of f.khai.keys()) (m.get(n) || m.set(n, []).get(n)).push(f.ten);
}
const tuongMinh = new Map(); // tên → mô tả (file nào gán)
for (const f of files) for (const [n, cach] of f.tuongMinh) tuongMinh.set(n, (tuongMinh.get(n) || (cach === 'globalThis' ? 'trạng thái dùng chung (globalThis.*), đặt ở' : 'gán tường minh window.*, ở')) + ' ' + f.ten);

// 2. Giải từng tên dùng tự do
const loi = [], trung = [...khaiBoi, ...[...khaiKhoi.values()].flatMap(m => [...m])].filter(([, fs]) => fs.length > 1), ganCheo = new Map(), chuaKhai = new Map(), nguoc = [];
for (const f of files) {
  f.nhap = new Map(); // file nguồn → Set tên
  for (const [n, o] of f.tuDo) {
    const k = khoiCua(f.ten), nguon = (k && khaiKhoi.get(k).get(n)) || khaiBoi.get(n);
    if (nguon) {
      const tu = nguon[nguon.length - 1];
      if (o.ghi) { (ganCheo.get(n) || ganCheo.set(n, []).get(n)).push(f.ten); continue; }
      (f.nhap.get(tu) || f.nhap.set(tu, new Set()).get(tu)).add(n);
      if (viTri.get(tu) > viTri.get(f.ten) && o.lucNap) nguoc.push(`${f.ten} dùng ${n} của ${tu} ngay lúc nạp`);
      continue;
    }
    if (BUILTIN.has(n) || tuongMinh.has(n)) continue;
    (chuaKhai.get(n) || chuaKhai.set(n, []).get(n)).push(f.ten);
  }
}
for (const [n, fs] of ganCheo) loi.push(`gán chéo: ${n} (khai báo ở ${(khaiBoi.get(n) || []).join(', ')}) bị gán ở ${[...new Set(fs)].join(', ')}`);
for (const [n, fs] of chuaKhai) loi.push(`chưa khai báo: ${n} dùng ở ${[...new Set(fs)].join(', ')}`);

// 3. Ghi
const dungBoiKhac = new Map(); // file → Set tên được file khác import
for (const f of files) for (const [tu, ten] of f.nhap) for (const n of ten) (dungBoiKhac.get(tu) || dungBoiKhac.set(tu, new Set()).get(tu)).add(n);
for (const f of files) if (/^content\/lop-[^/]+\/index\.js$/.test(f.ten)) { // P-15a: lối vào của khối, dangKyKhoi / import() gọi
  if (!f.khai.has('dangKy')) loi.push(`${f.ten}: thiếu function dangKy(reg)`);
  (dungBoiKhac.get(f.ten) || dungBoiKhac.set(f.ten, new Set()).get(f.ten)).add('dangKy');
}
for (const [k, m] of khaiKhoi) for (const [n, fs] of m) if (fs.length > 1) loi.push(`khối ${k}: ${n} khai báo ở ${fs.join(', ')} (cùng một phạm vi khi nối, đổi tên)`);
let soImport = 0, soExport = 0;
for (const f of files) {
  const xuat = dungBoiKhac.get(f.ten) || new Set();
  const chen = []; // [vị trí, chuỗi]
  for (const n of f.ast.body) {
    if (!['VariableDeclaration', 'FunctionDeclaration', 'ClassDeclaration'].includes(n.type)) continue;
    if (tenKhaiBao(n).some(t => xuat.has(t))) { chen.push([n.start, 'export ']); soExport++; }
  }
  const dong = [];
  for (const [tu, ten] of [...f.nhap].sort((a, b) => viTri.get(a[0]) - viTri.get(b[0]))) {
    let rel = path.relative(path.dirname(f.duong), path.join(goc, tu)).split(path.sep).join('/');
    if (!rel.startsWith('.')) rel = './' + rel;
    const ds = [...ten].sort((a, b) => a.localeCompare(b, 'en'));
    let d = `import { ${ds[0]}`;
    for (const t of ds.slice(1)) { if (d.length + t.length + 2 > RONG) { dong.push(d + ','); d = '  ' + t; } else d += ', ' + t; }
    dong.push(d + ` } from '${rel}';`);
    soImport++;
  }
  const dau = f.ast.body.length ? f.ast.body[0].start : f.code.length; // sau chú thích đầu file
  if (dong.length) chen.push([dau, dong.join('\n') + '\n', 0]); // khối import đứng trước chữ "export " cùng vị trí
  chen.sort((a, b) => a[0] - b[0] || (a[2] ?? 1) - (b[2] ?? 1));
  let ra = '', i = 0;
  for (const [vt, s] of chen) { ra += f.code.slice(i, vt) + s; i = vt; }
  f.moi = ra + f.code.slice(i);
}

// 4. Báo cáo
console.log(`${files.length} file · ${[...khaiBoi.keys()].length} tên khai báo · ${soImport} dòng import · ${soExport} khai báo export`);
console.log(`trùng tên (${trung.length}): ${trung.map(([n, fs]) => `${n} [${fs.map(x => path.basename(x)).join(' → ')}]`).join('; ') || 'không'}`);
console.log(`dùng của file sau ngay lúc nạp (${nguoc.length}): ${nguoc.slice(0, 20).join('; ')}${nguoc.length > 20 ? ' …' : ''}`);
for (const l of loi) console.log('LỖI ' + l);
if (!chiXem) {
  fs.writeFileSync(SINH, JSON.stringify({ mo_ta: 'SINH RA bởi tools/vite/tim-import.mjs từ mã (globalThis.X=… / window.X=…), không sửa tay. eslint.config.mjs đọc file này.', ten: Object.fromEntries([...tuongMinh].sort()) }, null, 2) + '\n');
  let doi = 0;
  for (const f of files) { const cu = fs.readFileSync(f.duong, 'utf8'); if (cu !== f.moi) { fs.writeFileSync(f.duong, f.moi); doi++; } }
  const lk = kiemTraLienKet(docFileJs(goc, thuTu(goc)));
  for (const l of lk) console.log('LỖI liên kết ' + l);
  console.log(`đã ghi ${doi} file${lk.length ? '' : ' · liên kết import/export khớp'}`);
  if (lk.length) loi.push(...lk);
}
console.log(loi.length ? `✗ ${loi.length} lỗi` : '✓ không lỗi');
process.exit(loi.length ? 1 : 0);
