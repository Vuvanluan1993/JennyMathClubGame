// Trang theo vai (P-14a, 25/10/2026; P-07 bản thật/bản thử): thay tools/_student.py và tools/_teacher.py.
// Nhận bản đầy đủ (chuỗi lop-hoc-ao-jenny.html) → trả chuỗi trang học sinh / giáo viên / phụ huynh / quản lý,
// bản THẬT (chỉ đăng nhập máy chủ) hoặc bản THỬ (thu = true: tài khoản mẫu, dữ liệu trên máy, dải "Bản thử"),
// với ĐÚNG các phép thay của hai file Python (cùng assert). Đoạn mã chèn vào lấy nguyên văn từ Python, nằm ở tools/vite/vai/
// (…-that.* = bản thật, …-thu.* = bản thử). Kiểm chứng giống từng byte với Python: node tools/vite/so-voi-python.mjs
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAI = path.join(path.dirname(fileURLToPath(import.meta.url)), 'vai');
const doc = f => fs.readFileSync(path.join(VAI, f), 'utf8');
const sha256 = s => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

function canCo(t, a) { if (!t.includes(a)) throw new Error('vai.js: không thấy chuỗi cần thay: ' + a.slice(0, 80)); }
/** Thay lần xuất hiện ĐẦU (như str.replace(a,b,1) của Python); không hiểu $& như String.replace. */
function thay1(t, a, b) { canCo(t, a); const i = t.indexOf(a); return t.slice(0, i) + b + t.slice(i + a.length); }
/** Thay MỌI lần xuất hiện (như str.replace(a,b) của Python). */
const thayHet = (t, a, b) => t.split(a).join(b);
/** Chèn sau thẻ </style> đầu tiên: hết <head>, mở <body> (như hai file Python). */
function moBody(t, body) { const i = t.indexOf('</style>') + '</style>'.length; return t.slice(0, i) + '\n</head>\n' + body + '\n' + t.slice(i) + '\n</body></html>\n'; }

/** json.dumps của Python (mặc định: ", " và ": ", ensure_ascii) — để chuỗi ACC giống từng byte. */
function pyJson(v) {
  if (Array.isArray(v)) return '[' + v.map(pyJson).join(', ') + ']';
  if (v && typeof v === 'object') return '{' + Object.entries(v).map(([k, x]) => pyJson(k) + ': ' + pyJson(x)).join(', ') + '}';
  if (typeof v === 'string') return JSON.stringify(v).replace(/[^\x00-\x7f]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
  return JSON.stringify(v);
}

const BOOT = 'if(!load())fresh();\nrender();\n</script>';

/** Bản học sinh: games/lop-hoc-ao/index.html (thu = false) hoặc games/lop-hoc-ao/demo/index.html (thu = true) — như tools/_student.py. */
export function hocSinh(t, thu = false) {
  const hau = thu ? 'thu' : 'that';
  // tài khoản thử (chỉ bản thử): lebaona + jenny01…jenny05, -1…-5; băm SHA-256 "tên:mật khẩu"
  const acc = {};
  if (thu) {
    const h = (u, p) => sha256(`${u.toLowerCase()}:${p}`);
    acc.lebaona = { g: 1, h: h('lebaona', 'jenny123'), name: 'Lê Bảo Na' };
    for (let g = 1; g <= 5; g++) for (const suf of ['', '-1', '-2', '-3', '-4', '-5']) { const u = `jenny0${g}${suf}`; acc[u] = { g, h: h(u, 'jenny123') }; }
  }
  // khoá lưu localStorage giữ nguyên (healAll giữ tiến độ): KEY 'jennyHS' → 'jennyHS2_<tk>' trong đoạn đăng nhập bản thử
  const R = [["const ORG_ON=true;", "const ORG_ON=false;"], ["globalThis.KEY='jennyVirtualDemo_v10'", "globalThis.KEY='jennyHS'"],
    ['<div class="seg" id="tabs" role="group" aria-label="Chọn vai trò"></div>', '<div class="seg" id="tabs" role="group" aria-label="Chọn vai trò"></div><div class="hsme" id="hsme"></div>']];
  for (const [a, b] of R) t = thay1(t, a, b);
  canCo(t, BOOT);
  t = thayHet(t, BOOT, thayHet(doc(`hoc-sinh-dang-nhap-${hau}.js.txt`), '__ACC__', pyJson(acc)));
  t = thay1(t, '<main class="wrap" id="app"></main>', doc(`hoc-sinh-man-dang-nhap-${hau}.html`) + '<main class="wrap" id="app"></main>');
  t = thay1(t, '</style>', doc(`hoc-sinh-${hau}.css`) + '</style>');
  t = doc('hoc-sinh-dau-trang.html') + t;
  if (thu) t = thay1(t, '<title>Lớp học ảo Jenny', '<title>Bản thử · Lớp học ảo Jenny');
  return moBody(t, '<body class="locked px">');
}

/** Ba trang Giáo viên · Phụ huynh · Quản lý (như tools/_teacher.py): bản đầy đủ + màn đăng nhập máy chủ (thật) hoặc mở sẵn vai (thử). */
export const TRANG_GV = [
  { trang: 'gv', ten: 'Giáo viên', dir: 'giao-vien', vai: ['gv', 'ql'] },
  { trang: 'ph', ten: 'Phụ huynh', dir: 'phu-huynh', vai: ['ph'] },
  { trang: 'ql', ten: 'Quản lý trung tâm', dir: 'quan-ly', vai: ['ql'] },
];
export function giaoVien(base, { trang, ten, dir, vai }, thu = false) {
  canCo(base, BOOT);
  const g = [['__TRANG__', trang], ['__VAI__', pyJson(vai)], ['__TIEUDE__', ten], ['__DIR__', dir]]
    .reduce((s, [a, b]) => thayHet(s, a, b), doc(`giao-vien-cong-${thu ? 'thu' : 'that'}.js.txt`));
  let t = thay1(thayHet(base, BOOT, g), '<title>', '<meta name="robots" content="noindex"><title>');
  // khung trang đầy đủ (doctype + viewport) để điện thoại hiển thị đúng khổ màn hình
  t = '<!doctype html>\n<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + t;
  t = moBody(t, '<body class="px">');
  return thay1(t, '<title>Lớp học ảo Jenny', (thu ? '<title>Bản thử · ' : '<title>') + ten + ' · Lớp học ảo Jenny');
}
