// Bỏ thuộc tính sự kiện inline (P-14c, 27/10/2026): onclick="…" / onchange / oninput / onkeydown / onsubmit / onpointerdown
// trong HTML tĩnh (app.template.html, tools/vite/vai/*.html) và trong chuỗi template JS sinh HTML (js/**, content/**, tools/vite/vai/*.js.txt)
// → data-act="<id>" (click) hoặc data-act-<sự kiện>="<id>", tham số ở data-arg / data-arg-<sự kiện> (JSON, sinh bằng hd.arg / hd.argEv),
// và hàm xử lý đăng ký ở CUỐI CHÍNH FILE ĐÓ: hd.dangKy({ '<id>': function(event, a){ … } }) (this = phần tử, như inline cũ).
// Trình uỷ quyền sự kiện (một listener trên document): js/core/02-hanh-dong.js. Thuộc tính trong app.template.html / vai/*.html đăng ký ở 02.
//   node tools/vite/bo-inline.mjs          đổi và ghi file; in danh sách chỗ PHẢI SỬA TAY (biểu thức sinh mã, ${…} có dấu `, regex…)
//   node tools/vite/bo-inline.mjs --xem    chỉ in báo cáo, không ghi
// Chạy lại được sau rebase: id đã có (đọc từ các khối hd.dangKy trong file) giữ nguyên; thân hàm trùng → dùng lại id, không đăng ký thêm.
// Sau khi chạy: node tools/vite/tim-import.mjs (sinh dòng import cho hd và tên dùng trong hàm), rồi npm run lint.
// Cách đổi một thuộc tính on<sk>="MÃ":
//   - ${…} nằm TRONG chuỗi '…' của MÃ: cả chuỗi → a[n], tham số = String(biểu thức) (bỏ esc(…) bọc ngoài: data-arg tự thoát HTML);
//     chuỗi có nhiều ${…} hoặc chữ kèm → tham số = `…` (template) ;
//   - ${…} đứng trần (số, ví dụ gvGrade=${g}, moleTap(${i},event)) → a[n], tham số = biểu thức y nguyên;
//   - ${…} có dấu ` bên trong, đứng sau "." hoặc trước "(" (sinh tên/mã), MÃ không phân tích được → SỬA TAY (giữ nguyên, in ra);
//   - thuộc tính có "\(" hay "\\" (regex khớp HTML cũ) → bỏ qua, in ra để sửa tay.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as acorn from 'acorn';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const chiXem = process.argv.includes('--xem');
const BANG = 'js/core/02-hanh-dong.js'; // nơi đăng ký cho HTML tĩnh
const SU_KIEN = ['click', 'input', 'change', 'keydown', 'submit', 'pointerdown'];
const DAU = '/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */';

/** Mọi file cần quét, theo thứ tự ổn định. */
function dsFile() {
  const ra = ['app.template.html'];
  const di = d => { for (const f of fs.readdirSync(path.join(goc, d)).sort()) { const p = d + '/' + f; if (fs.statSync(path.join(goc, p)).isDirectory()) di(p); else if (f.endsWith('.js')) ra.push(p); } };
  di('js'); di('content');
  for (const f of fs.readdirSync(path.join(goc, 'tools/vite/vai')).sort()) if (/\.(js\.txt|html)$/.test(f)) ra.push('tools/vite/vai/' + f);
  return ra;
}
/** File đăng ký hàm cho một file nguồn. */
const noiDangKy = f => (f.endsWith('.js') || f.endsWith('.js.txt')) ? f : BANG;

/* ---------- quét chuỗi ---------- */
function boQuaChuoi(s, i) { // s[i] = ' hoặc " ; trả chỉ số sau dấu đóng
  const q = s[i]; i++;
  while (i < s.length && s[i] !== q) { if (s[i] === '\\') i++; i++; }
  return i + 1;
}
function boQuaTemplate(s, i) { // s[i] = ` ; trả chỉ số sau dấu đóng
  i++;
  while (i < s.length && s[i] !== '`') {
    if (s[i] === '\\') { i += 2; continue; }
    if (s[i] === '$' && s[i + 1] === '{') { i = docHole(s, i).to; continue; }
    i++;
  }
  return i + 1;
}
/** s[i..] = "${" → { from, to (sau "}"), noi, coBacktick } */
function docHole(s, i) {
  let j = i + 2, d = 1, bt = false;
  while (j < s.length && d > 0) {
    const c = s[j];
    if (c === '`') { bt = true; j = boQuaTemplate(s, j); continue; }
    if (c === "'" || c === '"') { j = boQuaChuoi(s, j); continue; }
    if (c === '{') d++; else if (c === '}') d--;
    j++;
  }
  return { from: i, to: j, noi: s.slice(i + 2, j - 1), coBacktick: bt };
}
/** Từ sau dấu " mở của on*="…" → { end: chỉ số dấu " đóng, holes } hoặc null. */
function docThuocTinh(s, i) {
  const holes = [];
  while (i < s.length) {
    const c = s[i];
    if (c === '$' && s[i + 1] === '{') { const h = docHole(s, i); holes.push(h); i = h.to; continue; }
    if (c === '"') return { end: i, holes };
    if (c === '\n') return null;
    i++;
  }
  return null;
}
const giaiMaHtml = t => t.replace(/&(amp|lt|gt|quot|#39|#x27);/g, (_, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", '#x27': "'" }[e]));

/* ---------- sinh hàm ---------- */
const PH = n => `\u0001${n}\u0001`;
const RE_PH = /\u0001(\d+)\u0001/g;
/** Bỏ esc(…) bọc ngoài một biểu thức (data-arg tự thoát HTML). */
function boEsc(e) {
  const m = e.match(/^esc\(([\s\S]*)\)$/);
  if (!m) return e;
  let d = 0; // "(" phải khớp tới cuối mới là bọc ngoài
  for (let i = 4; i < e.length - 1; i++) { const c = e[i]; if (c === '(') d++; else if (c === ')') { d--; if (d < 0) return e; } else if (c === "'" || c === '"' || c === '`') { i = (c === '`' ? boQuaTemplate : boQuaChuoi)(e, i) - 1; } }
  return m[1];
}
/**
 * Mã inline (holes thay bằng PH) → { than, args[], thamSoA } hoặc { loi }.
 * than: thân hàm (a[n] thay cho tham số), args: biểu thức JS cho từng a[n].
 */
function sinh(code, holes) {
  const args = []; let than = '';
  let i = 0, trongChuoi = false, dauChuoi = -1;
  const ph = [...code.matchAll(RE_PH)];
  // đi qua skeleton, theo dõi chuỗi '…'
  const bo = [];// [from,to,thay] trên code
  let k = 0; // placeholder index theo thứ tự
  const PHS = ph.map(m => ({ i: m.index, n: +m[1], len: m[0].length }));
  while (i < code.length) {
    const c = code[i];
    const p = PHS.find(x => x.i === i);
    if (p) {
      const h = holes[p.n];
      if (h.coBacktick) return { loi: 'biểu thức ${…} có dấu ` (sinh mã)' };
      if (trongChuoi) { (bo[bo.length - 1].holes ||= []).push(p.n); }
      else {
        const truoc = code.slice(0, i).replace(/\s+$/, '').slice(-1), sau = code.slice(i + p.len).replace(/^\s+/, '')[0] || '';
        if (truoc === '.' || sau === '(' || /[\w$]/.test(truoc) || /[\w$.]/.test(sau)) return { loi: `\${${h.noi}} đứng trần sinh tên/mã (trước "${truoc}", sau "${sau}")` };
        bo.push({ from: i, to: i + p.len, arg: h.noi });
      }
      i += p.len; continue;
    }
    if (c === "'") {
      if (!trongChuoi) { trongChuoi = true; dauChuoi = i; bo.push({ from: i, to: -1, chuoi: true }); }
      else { trongChuoi = false; const b = bo[bo.length - 1]; b.to = i + 1; if (!b.holes) bo.pop(); else { const noi = code.slice(dauChuoi + 1, i); const one = noi.match(/^\u0001(\d+)\u0001$/); b.arg = one ? `String(${boEsc(holes[+one[1]].noi)})` : '`' + noi.replace(RE_PH, (_, n) => '${' + holes[+n].noi + '}') + '`'; } }
      i++; continue;
    }
    if (c === '\\' && trongChuoi) { i += 2; continue; }
    i++;
  }
  if (trongChuoi) return { loi: "chuỗi '…' không đóng" };
  // ghép thân hàm
  let j = 0; const dung = bo.filter(b => b.arg !== undefined);
  for (const b of dung) { than += code.slice(j, b.from) + `a[${args.length}]`; args.push(b.arg); j = b.to; }
  than += code.slice(j);
  if (than.includes('\u0001')) return { loi: 'còn ${…} chưa xử lý' };
  const thamSoA = args.length ? (/(^|[^\w$.])a(?=[^\w$]|$)/.test(code.replace(/'[^']*'/g, '')) ? 'aa' : 'a') : '';
  if (thamSoA === 'aa') than = than.replace(/a\[(\d+)\]/g, 'aa[$1]');
  const dungEvent = /\bevent\b/.test(than);
  const thamSo = thamSoA ? `event,${thamSoA}` : dungEvent ? 'event' : '';
  const ham = `function(${thamSo}){${than}}`;
  try { acorn.parse('(' + ham + ')', { ecmaVersion: 'latest' }); } catch (e) { return { loi: 'không phân tích được: ' + e.message }; }
  return { ham, args };
}
/** id dễ đọc từ thân hàm: tên hàm gọi, thuộc tính/biến gán, chuỗi ngắn. */
function datId(ham, daCo) {
  const than = ham.replace(/^function\([^)]*\)\{/, '').replace(/\}$/, '');
  const t = [];
  const them = x => { if (x && !t.includes(x) && !['a', 'aa', 'event', 'this', 'try', 'catch', 'if', 'return', 'const', 'let', 'for', 'of', 'in', 'new', 'null', 'true', 'false', 'String'].includes(x)) t.push(x); };
  const sach = than.replace(/\ba{1,2}\[\d+\]/g, '').replace(/'[^']*'/g, s => /^'[\w-]{1,24}'$/.test(s) ? s : "''");
  for (const m of sach.matchAll(/([A-Za-z_$][\w$]*)\s*\(|\.([A-Za-z_$][\w$]*)\s*(?:=(?!=)|\+\+|--|\+=|-=)|(?:^|[;{(,])\s*([A-Za-z_$][\w$]*)\s*(?:=(?!=)|\+\+|--|\+=|-=)|'([\w-]{1,24})'|(?:^|[^\w.])(\d+)(?![\w.])/g)) them(m[1] || m[2] || m[3] || m[4] || m[5]);
  let goc = t.slice(0, 4).join('-') || 'hd';
  let id = goc, n = 1;
  while (daCo.has(id)) id = `${goc}-${++n}`;
  return id;
}

/* ---------- đọc đăng ký đã có ---------- */
const daDangKy = new Map(); // ham → id
const idDaCo = new Set();
const files = dsFile().map(f => ({ ten: f, code: fs.readFileSync(path.join(goc, f), 'utf8') }));
for (const f of files) for (const m of f.code.matchAll(/^  '([^']+)':(function\([^)]*\)\{.*\}),$/gm)) { idDaCo.add(m[1]); if (!daDangKy.has(m[2])) daDangKy.set(m[2], m[1]); }
for (const f of files) for (const m of f.code.matchAll(/^\s*'([^']+)':\s*function\b/gm)) idDaCo.add(m[1]);

/* ---------- quét & đổi ---------- */
const themVao = new Map(); // file đăng ký → [[id, ham]]
const suaTay = [], thongKe = { tuDong: 0, tay: 0, dungLai: 0 };
const RE_ATTR = /\bon([a-z]+)="/g;
for (const f of files) {
  f.chuThich = [...f.code.matchAll(/\/\*[\s\S]*?\*\//g)].map(m => [m.index, m.index + m[0].length]); // khoảng chú thích /* … */ (không đổi bên trong)
  let ra = '', i = 0, m;
  const dong = idx => f.code.slice(0, idx).split('\n').length;
  RE_ATTR.lastIndex = 0;
  while ((m = RE_ATTR.exec(f.code))) {
    const sk = m[1], batDau = m.index, sauMo = batDau + m[0].length;
    if (!SU_KIEN.includes(sk)) { suaTay.push(`${f.ten}:${dong(batDau)} sự kiện on${sk} không trong danh sách ${SU_KIEN.join(',')}`); continue; }
    const dongTruoc = f.code.slice(f.code.lastIndexOf('\n', batDau) + 1, batDau).trim();
    if (/^(\/\*|\/\/|\*)/.test(dongTruoc) || f.chuThich.some(([a, b]) => batDau > a && batDau < b)) { suaTay.push(`${f.ten}:${dong(batDau)} nằm trong chú thích (sửa chữ cho khỏi lẫn): ${f.code.slice(batDau, batDau + 60)}`); continue; }
    const tt = docThuocTinh(f.code, sauMo);
    if (!tt) { suaTay.push(`${f.ten}:${dong(batDau)} không thấy dấu " đóng`); continue; }
    const raw = f.code.slice(sauMo, tt.end);
    if (/\\[(\\]/.test(raw)) { suaTay.push(`${f.ten}:${dong(batDau)} regex khớp HTML cũ (sửa tay theo data-act): ${raw.slice(0, 80)}`); RE_ATTR.lastIndex = tt.end + 1; continue; }
    // skeleton: hole → PH(n)
    let sk2 = '', p = sauMo; const holes = [];
    for (const h of tt.holes) { sk2 += f.code.slice(p, h.from) + PH(holes.length); holes.push(h); p = h.to; }
    sk2 += f.code.slice(p, tt.end);
    const code = giaiMaHtml(sk2);
    if (/&[a-z#0-9]+;/.test(code.replace(RE_PH, ''))) { suaTay.push(`${f.ten}:${dong(batDau)} còn thực thể HTML lạ: ${raw.slice(0, 80)}`); RE_ATTR.lastIndex = tt.end + 1; continue; }
    if (!code.trim()) { suaTay.push(`${f.ten}:${dong(batDau)} on${sk}="" rỗng → đặt data-act="khong" (hàm rỗng đăng ký ở file đó)`); thongKe.tay++; RE_ATTR.lastIndex = tt.end + 1; continue; }
    if (/^\s*\u0001\d+\u0001\s*$/.test(code)) { suaTay.push(`${f.ten}:${dong(batDau)} cả mã là \${…} (chuỗi mã truyền từ chỗ khác) → nơi tạo chuỗi dùng hd.attr('<id>', …), chỗ này ghi \${…}: on${sk}="${raw}"`); thongKe.tay++; RE_ATTR.lastIndex = tt.end + 1; continue; }
    const r = sinh(code, holes);
    if (r.loi) { suaTay.push(`${f.ten}:${dong(batDau)} ${r.loi}: on${sk}="${raw.slice(0, 100)}"`); thongKe.tay++; RE_ATTR.lastIndex = tt.end + 1; continue; }
    let id = daDangKy.get(r.ham);
    if (id) thongKe.dungLai++;
    else { id = datId(r.ham, idDaCo); idDaCo.add(id); daDangKy.set(r.ham, id); (themVao.get(noiDangKy(f.ten)) || themVao.set(noiDangKy(f.ten), []).get(noiDangKy(f.ten))).push([id, r.ham]); }
    const hau = sk === 'click' ? '' : '-' + sk;
    let moi = `data-act${hau}="${id}"`;
    if (r.args.length) moi += ' ${' + (sk === 'click' ? `hd.arg(${r.args.join(',')})` : `hd.argEv('${sk}',${r.args.join(',')})`) + '}';
    ra += f.code.slice(i, batDau) + moi; i = tt.end + 1; thongKe.tuDong++;
    RE_ATTR.lastIndex = i;
  }
  f.moi = ra + f.code.slice(i);
}
/* ---------- ghi khối đăng ký ---------- */
for (const [ten, ds] of themVao) {
  const f = files.find(x => x.ten === ten);
  if (!f) throw new Error('không thấy file đăng ký ' + ten);
  const khoi = ds.map(([id, ham]) => `  '${id}':${ham},`).join('\n');
  let t = f.moi ?? f.code;
  if (t.includes(DAU)) { // đã có khối (chạy lại): thêm mục vào cuối khối
    const i = t.indexOf(DAU), j = t.indexOf('\n});', i);
    if (j < 0) throw new Error(ten + ': khối hd.dangKy hỏng');
    t = t.slice(0, j) + '\n' + khoi + t.slice(j);
  } else {
    const them = `\n${DAU}\nhd.dangKy({\n${khoi}\n});\n`;
    if (/<\/script>\n?$/.test(t)) t = t.replace(/<\/script>\n?$/, s => them + s); // vai/*.js.txt kết thúc bằng </script>
    else t = t.replace(/\n*$/, '\n') + them;
  }
  f.moi = t;
}
/* ---------- id dùng trong HTML phải có hàm đăng ký ---------- */
const dungMaChuaCo = [];
for (const f of files) for (const m of (f.moi ?? f.code).matchAll(/data-act(?:-[a-z]+)?="([A-Za-z][\w-]*)"/g)) if (!idDaCo.has(m[1])) dungMaChuaCo.push(`${f.ten}: ${m[1]}`);
if (dungMaChuaCo.length) { console.log(`\nID DÙNG MÀ CHƯA ĐĂNG KÝ (${dungMaChuaCo.length}):`); for (const s of [...new Set(dungMaChuaCo)]) console.log('  ' + s); }
/* ---------- báo cáo & ghi ---------- */
let doi = 0;
for (const f of files) if (f.moi !== undefined && f.moi !== f.code) { doi++; if (!chiXem) fs.writeFileSync(path.join(goc, f.ten), f.moi); }
console.log(`${thongKe.tuDong} thuộc tính đổi tự động (${thongKe.dungLai} dùng lại id đã có) · ${[...themVao.values()].reduce((s, d) => s + d.length, 0)} hàm đăng ký mới · ${doi} file ${chiXem ? 'sẽ đổi (--xem, chưa ghi)' : 'đã ghi'}`);
if (suaTay.length) { console.log(`\nPHẢI SỬA TAY (${suaTay.length}):`); for (const s of suaTay) console.log('  ' + s); }
console.log(`\nTiếp: node tools/vite/tim-import.mjs && npm run lint (ở gốc kho); còn lại: grep -rnE 'on[a-z]+="' app.template.html js content tools/vite/vai`);
