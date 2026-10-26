// Đọc file nguồn dạng ES module (P-14b): phân tích phạm vi, bỏ dòng import/export khi nối thành một script thường.
// Dùng chung cho tools/vite/noi-file.js (lúc build) và tools/vite/tim-import.mjs (sinh dòng import).
import fs from 'node:fs';
import path from 'node:path';
import * as acorn from 'acorn';
import * as eslintScope from 'eslint-scope';

export const PHAN_TICH = { ecmaVersion: 'latest', sourceType: 'module', locations: true, ranges: true, allowHashBang: false };

/** Cây cú pháp + bộ phạm vi (eslint-scope) của một file. */
export function phanTich(code, ten = '') {
  let ast;
  try { ast = acorn.parse(code, PHAN_TICH); } catch (e) { throw new Error(`${ten}: ${e.message}`); }
  const scopes = eslintScope.analyze(ast, { ecmaVersion: 2025, sourceType: 'module', nodejsScope: false, impliedStrict: true });
  const toanCuc = scopes.acquire(ast);
  const module = toanCuc.childScopes.find(s => s.type === 'module');
  return { ast, scopes, toanCuc, module };
}

/** Tham chiếu có nằm ngoài mọi hàm không (chạy ngay lúc nạp module)? */
export function lucNap(ref) {
  for (let s = ref.from; s; s = s.upper) { if (s.type === 'function' || s.type === 'class-field-initializer' || s.type === 'class-static-block') return false; if (s.type === 'module') return true; }
  return true;
}

/**
 * Danh sách import/export của file: { nhap: [{node, tu, ten:[{nhap, cucBo}]}], xuat: [{node, kieu:'khai-bao'|'danh-sach', ten:[...] }] }
 * Chỉ cho phép: import { a, b } from './x.js' và export trước khai báo hoặc export { a, b }. Không default, không *, không import().
 */
export function nhapXuat(ast, ten = '') {
  const nhap = [], xuat = [];
  for (const n of ast.body) {
    if (n.type === 'ImportDeclaration') {
      for (const s of n.specifiers) if (s.type !== 'ImportSpecifier') throw new Error(`${ten}: chỉ dùng import { a, b } from '…' (dòng ${n.loc.start.line})`);
      nhap.push({ node: n, tu: n.source.value, ten: n.specifiers.map(s => ({ nhap: s.imported.name, cucBo: s.local.name })) });
    } else if (n.type === 'ExportNamedDeclaration') {
      if (n.source) throw new Error(`${ten}: không dùng export … from (dòng ${n.loc.start.line})`);
      if (n.declaration) xuat.push({ node: n, kieu: 'khai-bao', ten: tenKhaiBao(n.declaration) });
      else xuat.push({ node: n, kieu: 'danh-sach', ten: n.specifiers.map(s => s.local.name) });
    } else if (n.type === 'ExportDefaultDeclaration' || n.type === 'ExportAllDeclaration') {
      throw new Error(`${ten}: không dùng export default / export * (dòng ${n.loc.start.line})`);
    }
  }
  return { nhap, xuat };
}

/** Tên do một khai báo đặt ra (function/class/var/let/const, kể cả tách mẫu). */
export function tenKhaiBao(d) {
  if (d.type === 'FunctionDeclaration' || d.type === 'ClassDeclaration') return [d.id.name];
  const ra = [];
  const mau = p => {
    if (!p) return;
    if (p.type === 'Identifier') ra.push(p.name);
    else if (p.type === 'ObjectPattern') p.properties.forEach(q => mau(q.type === 'RestElement' ? q.argument : q.value));
    else if (p.type === 'ArrayPattern') p.elements.forEach(mau);
    else if (p.type === 'RestElement') mau(p.argument);
    else if (p.type === 'AssignmentPattern') mau(p.left);
  };
  if (d.type === 'VariableDeclaration') d.declarations.forEach(x => mau(x.id));
  return ra;
}

/** Bỏ dòng import và chữ "export " → mã chạy được như script thường (nối theo app.template.html). Giữ nguyên mọi byte khác. */
export function boModule(code, ten = '') {
  const { ast } = phanTich(code, ten);
  const { nhap, xuat } = nhapXuat(ast, ten);
  const cat = []; // [từ, đến) cần bỏ
  for (const { node } of nhap) cat.push([node.start, code[node.end] === '\n' ? node.end + 1 : node.end]);
  for (const { node, kieu } of xuat) {
    if (kieu === 'khai-bao') cat.push([node.start, node.declaration.start]); // "export "
    else cat.push([node.start, code[node.end] === '\n' ? node.end + 1 : node.end]);
  }
  cat.sort((a, b) => a[0] - b[0]);
  let ra = '', i = 0;
  for (const [a, b] of cat) { ra += code.slice(i, a); i = b; }
  return ra + code.slice(i);
}

/** Đọc mọi file JS theo thứ tự app.template.html: [{ten, duong, code}]. */
export function docFileJs(goc, thuTu) {
  return thuTu.filter(f => f.endsWith('.js')).map(ten => ({ ten, duong: path.join(goc, ten), code: fs.readFileSync(path.join(goc, ten), 'utf8') }));
}

/**
 * Kiểm tra liên kết: mỗi tên import phải được file đích export; không import chính mình. Trả danh sách lỗi (chuỗi).
 * xuatCua: Map(tên file → Set tên export).
 */
export function kiemTraLienKet(files) {
  const xuatCua = new Map(), loi = [];
  const pt = files.map(f => { const { ast } = phanTich(f.code, f.ten); const nx = nhapXuat(ast, f.ten); xuatCua.set(f.ten, new Set(nx.xuat.flatMap(x => x.ten))); return { ...f, nx }; });
  const theoDuong = new Map(files.map(f => [path.normalize(f.duong), f.ten]));
  for (const f of pt) for (const { tu, ten } of f.nx.nhap) {
    const dich = theoDuong.get(path.normalize(path.resolve(path.dirname(f.duong), tu)));
    if (!dich) { loi.push(`${f.ten}: import từ '${tu}' không nằm trong app.template.html`); continue; }
    if (dich === f.ten) loi.push(`${f.ten}: import chính mình`);
    for (const { nhap } of ten) if (!xuatCua.get(dich).has(nhap)) loi.push(`${f.ten}: '${nhap}' không được ${dich} export`);
  }
  return loi;
}
