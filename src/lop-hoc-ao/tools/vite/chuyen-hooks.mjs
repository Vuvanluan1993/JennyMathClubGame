// Chuyển kiểu "đè" cũ sang hooks (P-14b, 26/10/2026) — chạy lại được (chỉ đổi những chỗ còn kiểu cũ), dùng sau mỗi lần rebase.
//   node tools/vite/chuyen-hooks.mjs          đổi mã trong js/** và tools/vite/vai/*.js.txt (rồi chạy tim-import.mjs)
//   node tools/vite/chuyen-hooks.mjs --xem    chỉ in sẽ đổi gì
// Bốn việc, theo phân tích phạm vi (acorn + eslint-scope), mã còn lại giữ nguyên từng byte:
// 1. Hàm trùng tên (function X ở ≥ 2 file): xoá bản ở file TRƯỚC (script thường: bản sau thắng từ đầu nên bản trước là mã chết).
// 2. Hàm bị gán lại ở file khác ("hàm đè"): ở file định nghĩa → function X(...a){return hooks.goi('X',this,a)} + hooks.ham('X',function(…){…});
//    (hoặc const X=hooks.ham('X',<hàm>)); ở chỗ gán X=<hàm> → hooks.de('X',<hàm>); chỗ giữ bản cũ const _x=X → const _x=hooks.cu('X');
//    rồi (bước 4, lần chạy sau) cặp cu+de liền nhau → hooks.on('X',_x=><hàm>) — dạng đè chính.
//    mã vai.js chèn (tools/vite/vai/*.js.txt) khai báo function X trùng tên → hooks.goc('X',function(){…}) (thay bản gốc, như hoisting cũ).
// 3. Biến (không phải hàm) bị gán ở file khác ("trạng thái dùng chung"): let X=… ở file định nghĩa → globalThis.X=…;
//    tim-import.mjs thấy globalThis.X= thì ghi X vào tools/vite/toan-cuc-sinh.json để ESLint coi là toàn cục tường minh.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import { thuTu } from './noi-file.js';
import { phanTich, tenKhaiBao, boModule, docFileJs } from './module.js';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const chiXem = process.argv.includes('--xem');
const VAI = path.join(goc, 'tools', 'vite', 'vai');
const laHam = n => n && (n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression');
const BUILTIN = new Set([...Object.keys(globals.browser), ...Object.keys(globals.es2025)]);

// Nguồn: file JS theo app.template.html (mã sạch, không import/export) + mã chèn của vai.js (ảo, đứng cuối)
// P-15a: bỏ qua content/lop-* (mỗi khối một phạm vi riêng khi nối, không đè hàm của core; tim-import.mjs bắt gán chéo)
const files = docFileJs(goc, thuTu(goc)).filter(f => !f.ten.startsWith('content/')).map(f => ({ ...f, code: boModule(f.code, f.ten), that: true }));
for (const f of fs.readdirSync(VAI).filter(f => f.endsWith('.js.txt')).sort()) { // mã chèn kết thúc bằng </script>: tách ra khi phân tích
  const code = fs.readFileSync(path.join(VAI, f), 'utf8'), duoi = code.endsWith('</script>') ? '</script>' : '';
  files.push({ ten: 'tools/vite/vai/' + f, duong: path.join(VAI, f), code: code.slice(0, code.length - duoi.length), duoi, that: false });
}
for (const f of files) {
  const { ast, module, scopes } = phanTich(f.code, f.ten);
  f.ast = ast; f.module = module; f.scopes = scopes; f.khai = new Map(); f.doi = []; // doi: [từ, đến, chuỗi mới]
  for (const v of module.variables) if (v.defs.length) f.khai.set(v.name, v.defs[0]);
  /** Gán lại tên do chính file này khai báo (X=function…; không tính dòng khai báo) → [tham chiếu ghi] */
  f.ganTrong = n => { const v = module.set.get(n); return v ? v.references.filter(r => r.isWrite() && !r.init && r.writeExpr) : []; };
  f.ganNgoai = new Map(); // tên tự do bị gán → [tham chiếu ghi]
  for (const r of module.through) if (r.isWrite() && r.writeExpr) (f.ganNgoai.get(r.identifier.name) || f.ganNgoai.set(r.identifier.name, []).get(r.identifier.name)).push(r);
  f.docTuDo = n => module.through.filter(r => r.isRead() && !r.isWrite() && r.identifier.name === n).map(r => r.identifier);
}
const khaiBoi = new Map();
for (const f of files) for (const n of f.khai.keys()) (khaiBoi.get(n) || khaiBoi.set(n, []).get(n)).push(f);
const loi = [], ghiChu = [];

// 1. Hàm trùng tên → xoá bản trước
for (const [n, fsx] of khaiBoi) {
  if (fsx.length < 2) continue;
  const that = fsx.filter(f => f.that);
  if (that.length < 2) continue; // trùng với mã chèn: xử lý ở bước 2 (hooks.goc)
  for (const f of that.slice(0, -1)) {
    const d = f.khai.get(n);
    if (d.type !== 'FunctionName' || d.node.type !== 'FunctionDeclaration' || !f.ast.body.includes(d.node)) { loi.push(`trùng ${n}: bản ở ${f.ten} không phải function khai báo đầu file, xoá tay`); continue; }
    const nd = d.node, cuoi = f.code[nd.end] === '\n' ? nd.end + 1 : nd.end;
    f.doi.push([nd.start, cuoi, '']); ghiChu.push(`xoá ${n} thừa ở ${path.basename(f.ten)} (bản dùng: ${path.basename(that[that.length - 1].ten)})`);
  }
}

// 2 + 3. Tên bị gán ở file khác
const trangThai = {};
for (const [n, fsx] of khaiBoi) {
  const D = fsx.filter(f => f.that).pop() || fsx[fsx.length - 1]; // file định nghĩa (bản sau cùng của mã thật)
  if (!fsx.some(f => f.that)) continue; // chỉ mã chèn khai báo (TRANG…): mỗi trang một bản, không đụng nhau
  const ganO = files.filter(f => f !== D && f.ganNgoai.has(n));
  const khaiLai = files.filter(f => f !== D && f.khai.has(n) && !f.that); // mã chèn khai báo function trùng tên
  if (!ganO.length && !khaiLai.length) continue;
  const d = D.khai.get(n), nd = d.node;
  const laHamGoc = d.type === 'FunctionName' ? nd.type === 'FunctionDeclaration' : d.type === 'Variable' && laHam(nd.init);
  const ganToanHam = ganO.every(f => f.ganNgoai.get(n).every(r => laHam(r.writeExpr) || r.writeExpr.type === 'Identifier' || r.writeExpr.type === 'CallExpression'));
  if (laHamGoc && (ganToanHam || nd.type === 'FunctionDeclaration')) {
    // hàm đè
    if (nd.type === 'FunctionDeclaration') {
      if (nd.generator) { loi.push(`${n}: generator, chuyển tay`); continue; }
      const th = D.code.slice(nd.id.end, nd.end); // "(params){body}"
      D.doi.push([nd.start, nd.end, `function ${n}(...a){return hooks.goi('${n}',this,a)}\nhooks.ham('${n}',${nd.async ? 'async ' : ''}function${th});`]);
    } else {
      const vd = nd, decl = d.parent; // VariableDeclarator, VariableDeclaration
      if (decl.declarations.length !== 1) { loi.push(`${n}: khai báo chung dòng với biến khác ở ${D.ten}, tách tay`); continue; }
      D.doi.push([decl.start, vd.id.end, `const ${n}`], [vd.init.start, vd.init.start, `hooks.ham('${n}',`], [vd.init.end, vd.init.end, ')']);
    }
    for (const [f, refs] of [...ganO.map(f => [f, f.ganNgoai.get(n)]), [D, D.ganTrong(n)]]) for (const r of refs) {
      const ae = timCha(f.ast, r.identifier); // AssignmentExpression
      if (!ae || ae.type !== 'AssignmentExpression' || ae.operator !== '=' || ae.left !== r.identifier) { loi.push(`${n}: gán lạ ở ${f.ten}:${r.identifier.loc.start.line}`); continue; }
      f.doi.push([ae.start, ae.right.start, `hooks.de('${n}',`], [ae.end, ae.end, ')']);
      for (const d of f.docTuDo(n)) if (d.start >= ae.right.start && d.end <= ae.right.end) f.doi.push([d.start, d.end, `hooks.cu('${n}')`]);
    }
    for (const f of files) for (const v of layCapture(f, n)) f.doi.push([v.init.start, v.init.end, `hooks.cu('${n}')`]);
    for (const f of khaiLai) {
      const k = f.khai.get(n).node;
      if (k.type !== 'FunctionDeclaration') { loi.push(`${n}: mã chèn ${f.ten} khai báo không phải function`); continue; }
      f.doi.push([k.start, k.id.end, `hooks.goc('${n}',${k.async ? 'async ' : ''}function`], [k.end, k.end, ');']);
      ghiChu.push(`mã chèn ${path.basename(f.ten)}: function ${n} → hooks.goc`);
    }
    ghiChu.push(`hàm đè ${n}: gốc ${path.basename(D.ten)}, đè ở ${ganO.map(f => path.basename(f.ten)).join(', ')}`);
  } else {
    // trạng thái dùng chung
    if (d.type !== 'Variable' || !D.ast.body.includes(d.parent)) { loi.push(`${n}: khai báo ở ${D.ten} không phải let/var/const đầu file (${d.type}), chuyển tay`); continue; }
    if (BUILTIN.has(n)) { loi.push(`${n}: trùng tên toàn cục của trình duyệt, đổi tên tay`); continue; }
    const decl = d.parent;
    if (!decl._daDoi) { // đổi cả câu khai báo một lần (có thể chứa nhiều biến, vài biến là trạng thái)
      decl._daDoi = true; decl._trangThai = new Set();
      D.doi.push([decl.start, decl.end, () => {
        const phan = [];
        let giu = [];
        const xa = () => { if (giu.length) { phan.push(decl.kind + ' ' + giu.join(', ') + ';'); giu = []; } };
        for (const v of decl.declarations) {
          const ten = tenKhaiBao({ type: 'VariableDeclaration', declarations: [v] });
          if (ten.length === 1 && decl._trangThai.has(ten[0])) { xa(); phan.push(`globalThis.${ten[0]}=${v.init ? D.code.slice(v.init.start, v.init.end) : 'undefined'};`); }
          else giu.push(D.code.slice(v.start, v.end));
        }
        xa(); return phan.join('');
      }]);
    }
    decl._trangThai.add(n);
    trangThai[n] = `trạng thái dùng chung, đặt ở ${D.ten}, gán ở ${ganO.map(f => path.basename(f.ten)).join(', ')}`;
  }
}

// 2b. Tên đã chuyển (khai báo là function X(...a){return hooks.goi('X',…)}) nhưng file còn chỗ gán lại kiểu cũ (vd. sau rebase)
for (const f of files) for (const [n, d] of f.khai) {
  if (d.type !== 'FunctionName' || d.node.type !== 'FunctionDeclaration' || !f.code.slice(d.node.start, d.node.end).includes(`hooks.goi('${n}'`)) continue;
  for (const r of f.ganTrong(n)) {
    const ae = timCha(f.ast, r.identifier);
    if (!ae || ae.type !== 'AssignmentExpression' || ae.operator !== '=' || ae.left !== r.identifier) { loi.push(`${n}: gán lạ ở ${f.ten}:${r.identifier.loc.start.line}`); continue; }
    if (f.doi.some(([a]) => a === ae.start)) continue; // đã đổi ở bước 2
    f.doi.push([ae.start, ae.right.start, `hooks.de('${n}',`], [ae.end, ae.end, ')']);
    for (const x of f.docTuDo(n)) if (x.start >= ae.right.start && x.end <= ae.right.end) f.doi.push([x.start, x.end, `hooks.cu('${n}')`]);
    ghiChu.push(`gán lại trong file định nghĩa: ${n} ở ${path.basename(f.ten)}:${r.identifier.loc.start.line} → hooks.de`);
  }
}

function timCha(ast, nut) { let ra = null; (function di(n, cha) { if (ra || !n || typeof n.type !== 'string') return; if (n === nut) { ra = cha; return; } for (const k in n) { if (k === 'loc') continue; const v = n[k]; if (Array.isArray(v)) v.forEach(x => di(x, n)); else if (v && typeof v.type === 'string') di(v, n); } })(ast, null); return ra; }
/** const _x = N; (khai báo biến, giá trị là đúng tên N) ở bất kì phạm vi nào trong file */
function layCapture(f, n) { const ra = []; (function di(x) { if (!x || typeof x.type !== 'string') return; if (x.type === 'VariableDeclarator' && x.init && x.init.type === 'Identifier' && x.init.name === n && x.id.type === 'Identifier') ra.push(x); for (const k in x) { if (k === 'loc') continue; const v = x[k]; if (Array.isArray(v)) v.forEach(di); else if (v && typeof v.type === 'string') di(v); } })(f.ast); return ra; }

// 4. Cặp liền nhau  const _x=hooks.cu('X');  hooks.de('X',<hàm>)  → hooks.on('X',_x=><hàm>)  (chỉ ở file chưa có phép đổi nào ở bước 1–3)
for (const f of files) {
  if (f.doi.length) continue;
  const la = (n, k) => n && n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && n.callee.object.name === 'hooks' && n.callee.property.name === k && n.arguments[0] && n.arguments[0].type === 'Literal';
  (function di(x) {
    if (!x || typeof x.type !== 'string') return;
    const body = x.type === 'Program' || x.type === 'BlockStatement' ? x.body : null;
    if (body) for (let i = 0; i + 1 < body.length; i++) {
      const a = body[i], b = body[i + 1];
      if (a.type !== 'VariableDeclaration' || a.declarations.length !== 1 || a.declarations[0].id.type !== 'Identifier' || !la(a.declarations[0].init, 'cu')) continue;
      if (b.type !== 'ExpressionStatement' || !la(b.expression, 'de') || b.expression.arguments.length !== 2) continue;
      const ten = a.declarations[0].init.arguments[0].value;
      if (b.expression.arguments[0].value !== ten) continue;
      const bien = a.declarations[0].id.name, fn = b.expression.arguments[1];
      // biến giữ bản cũ chỉ được dùng trong hàm đè (nếu còn dùng chỗ khác thì giữ nguyên cu + de)
      const v = f.scopes.scopes.flatMap(s => s.variables).find(v => v.name === bien && v.defs[0] && v.defs[0].node === a.declarations[0]);
      if (!v || v.references.some(r => !r.init && (r.identifier.start < fn.start || r.identifier.end > fn.end))) continue;
      f.doi.push([a.start, fn.start, `hooks.on('${ten}',${bien}=>`]);
      ghiChu.push(`cu+de → on: ${ten} ở ${path.basename(f.ten)}:${a.loc.start.line}`);
    }
    for (const k in x) { if (k === 'loc') continue; const v = x[k]; if (Array.isArray(v)) v.forEach(di); else if (v && typeof v.type === 'string') di(v); }
  })(f.ast);
}

// Ghi
let soFile = 0;
for (const f of files) {
  if (!f.doi.length) continue;
  f.doi.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let ra = '', i = 0;
  for (const [a, b, s] of f.doi) { if (a < i) { loi.push(`${f.ten}: hai phép đổi chồng nhau ở ${a}`); continue; } ra += f.code.slice(i, a) + (typeof s === 'function' ? s() : s); i = b; }
  f.moi = ra + f.code.slice(i) + (f.duoi || ''); soFile++;
  if (!chiXem) fs.writeFileSync(f.duong, f.moi);
}
for (const g of ghiChu) console.log('· ' + g);
console.log(`trạng thái dùng chung (${Object.keys(trangThai).length}): ${Object.keys(trangThai).join(', ')}`);
for (const l of loi) console.log('LỖI ' + l);
console.log(`${chiXem ? 'sẽ đổi' : 'đã đổi'} ${soFile} file${loi.length ? ` · ✗ ${loi.length} lỗi` : ' · ✓'}`);
process.exit(loi.length ? 1 : 0);
