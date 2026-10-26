// Kích cỡ và tải nội dung theo khối (P-15b, 26/10/2026). Cần đã build (npm run build).
//   node tools/test/kich-co.mjs          → kiểm tra (npm test chạy file này)
//   node tools/test/kich-co.mjs --ghi    → sinh lại src/lop-hoc-ao/content/lop-2…5/90-kien-thuc-truoc.js rồi kiểm tra
// Kiểm tra:
//   1. Trang học sinh thật (games/lop-hoc-ao/index.html): HTML + CSS + JS + chunk khối lớn nhất (mỗi em chỉ tải một khối) ≤ 700 KB gzip.
//      (Chữ tự host woff2 tải theo glyph, không tính.)
//   2. Chunk lop-6-9 không có trong bản học sinh thật và bản thử học sinh (danh sách khối, HTML, JS), JS không nối khối nào.
//   3. Chạy thật (Playwright, máy chủ cục bộ):
//      a. bản thử học sinh: đăng nhập Jenny03 → màn chờ pixel → chỉ tải lop-3; lên lớp 4 → tải lop-4, không tải lại trang;
//      b. bản thử giáo viên: chỉ tải khối các lớp của cô; vào lớp khác khối → tải khối đó, không tải lại trang;
//      c. bản thử phụ huynh: chỉ tải khối của con đang xem.
//   4. Kiến thức trò chơi (core/39e ktGrade) khi chỉ tải một khối = bản một file (đủ khối); KT_TRUOC trong khối khớp số tính lại.
// Biến môi trường: PW_DIR (thư mục trình duyệt Playwright), CHROME (đường dẫn chrome cụ thể).
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

if (process.env.PW_DIR && !process.env.PLAYWRIGHT_BROWSERS_PATH) process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PW_DIR;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const APP = path.join(ROOT, 'src', 'lop-hoc-ao');
const BAN = path.join(ROOT, 'games', 'lop-hoc-ao');
const DICH = 700_000; // byte gzip
const GHI = process.argv.includes('--ghi');
let loi = 0;
const dat = (ok, s) => { console.log(`${ok ? 'ĐẠT     ' : 'CHƯA ĐẠT'}  ${s}`); if (!ok) loi++; };
const gz = f => zlib.gzipSync(fs.readFileSync(f), { level: 9 }).length;
const kb = n => (n / 1000).toFixed(1).replace('.', ',') + ' KB';

/** Trang đã dựng → { html, css[], js[], khoi{ten: đường dẫn tuyệt đối} } */
function docTrang(f) {
  const html = fs.readFileSync(f, 'utf8'), d = path.dirname(f), tuyet = u => path.resolve(d, u);
  const m = html.match(/<script type="application\/json" id="khoi-url">([^<]*)<\/script>/);
  const khoi = Object.fromEntries(Object.entries(m ? JSON.parse(m[1]) : {}).map(([k, u]) => [k, tuyet(u)]));
  return { f, html, css: [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map(x => tuyet(x[1])),
    js: [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(x => tuyet(x[1])), khoi, coKhoiUrl: !!m };
}

// ---------- 1, 2: kích cỡ, lop-6-9 ----------
const hs = docTrang(path.join(BAN, 'index.html')), thu = docTrang(path.join(BAN, 'demo', 'index.html')), gv = docTrang(path.join(BAN, 'giao-vien', 'index.html'));
const tinh = [hs.f, ...hs.css, ...hs.js].map(f => [path.relative(BAN, f), gz(f)]);
const khoiGz = Object.entries(hs.khoi).map(([k, f]) => [k, gz(f)]).sort((a, b) => a[0].localeCompare(b[0], 'en', { numeric: true }));
const nen = tinh.reduce((a, x) => a + x[1], 0), lon = khoiGz.reduce((a, x) => (x[1] > a[1] ? x : a), ['', 0]);
console.log('Trang học sinh thật, gzip -9:');
for (const [f, n] of tinh) console.log(`   ${f.padEnd(34)} ${kb(n).padStart(10)}`);
for (const [k, n] of khoiGz) console.log(`   khối ${k.padEnd(28)} ${kb(n).padStart(10)}   → tổng khi học lớp ${k.slice(4)}: ${kb(nen + n)}`);
dat(hs.coKhoiUrl && khoiGz.length === 5, `trang học sinh có danh sách 5 khối tiểu học (${khoiGz.map(x => x[0]).join(', ') || 'không có'})`);
dat(nen + lon[1] <= DICH, `HTML + CSS + JS + khối lớn nhất (${lon[0]}) = ${kb(nen + lon[1])} ≤ ${kb(DICH)}`);
const k69 = gv.khoi['lop-6-9'];
dat(!!k69 && fs.existsSync(k69), 'trang giáo viên có chunk lop-6-9');
for (const t of [hs, thu]) {
  const ten = path.relative(ROOT, t.f), js = t.js.map(f => fs.readFileSync(f, 'utf8')).join('\n'), chunk = k69 ? path.basename(k69) : 'lop-6-9-';
  dat(!('lop-6-9' in t.khoi) && !t.html.includes(chunk) && !js.includes(chunk) && !/dangKyKhoi\('lop-/.test(js),
    `${ten}: không có chunk lop-6-9, JS không nối khối nội dung nào`);
}

// ---------- 3, 4: chạy thật ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
const may = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname), f;
  if (p === '/dist/_day-du.html') { // bản đầy đủ (dist/day-du.html, không doctype như build cũ) bọc doctype như kiem-tra.js
    res.writeHead(200, { 'Content-Type': MIME['.html'] });
    return res.end('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(APP, 'dist', 'day-du.html'), 'utf8') + '</body></html>');
  }
  if (p.startsWith('/dist/')) f = path.join(APP, p); else f = path.join(ROOT, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => may.listen(0, '127.0.0.1', r));
const GOC = `http://127.0.0.1:${may.address().port}`;
const EXE = process.env.CHROME;
const b = await chromium.launch({ executablePath: EXE && fs.existsSync(EXE) ? EXE : undefined });

/** Trang mới, ghi lại khối đã tải, số lần điều hướng khung chính, lỗi JS. cham: ms trễ mỗi chunk (để thấy màn chờ). */
async function moTrang(url, cham = 0) {
  const p = await b.newPage({ viewport: { width: 375, height: 760 } });
  const o = { p, khoi: [], dieuHuong: 0, loi: [] };
  p.on('pageerror', e => o.loi.push(e.message));
  p.on('framenavigated', f => { if (f === p.mainFrame()) o.dieuHuong++; });
  await p.route(/\/assets\/lop-[0-9-]+-[\w-]+\.js$/, async r => { o.khoi.push(r.request().url().match(/\/(lop-[0-9-]+?)-[\w-]+\.js$/)[1]); if (cham) await new Promise(x => setTimeout(x, cham)); await r.continue(); });
  await p.goto(GOC + url, { waitUntil: 'load' });
  return o;
}
const daCo = (p, g) => p.waitForFunction(g => { try { return !!(PRIM[g] && PRIM[g].isl.length) && !/Jenny đang chuẩn bị bài/.test(document.getElementById('app').textContent); } catch { return false; } }, g, { timeout: 15000 });
const ds = a => [...new Set(a)].sort().join(', ') || 'không';

// 3a. bản thử học sinh
{
  const o = await moTrang('/games/lop-hoc-ao/demo/', 600), p = o.p;
  dat(!o.khoi.length, `học sinh · màn đăng nhập chưa tải khối nào (đã tải: ${ds(o.khoi)})`);
  await p.fill('#lgU', 'jenny03'); await p.fill('#lgP', 'jenny123'); await p.click('#lgForm button[type=submit]');
  const cho = await p.waitForFunction(() => /Jenny đang chuẩn bị bài/.test(document.getElementById('app').textContent), null, { timeout: 5000 }).then(() => true, () => false);
  dat(cho, 'học sinh · có màn chờ "Jenny đang chuẩn bị bài…" khi đang tải khối');
  await daCo(p, 3);
  dat(ds(o.khoi) === 'lop-3', `học sinh lớp 3 · chỉ tải lop-3 (đã tải: ${ds(o.khoi)})`);
  const nav = o.dieuHuong;
  await p.evaluate(() => { S.st[sid].grade = 4; save(); go({ k: 'home' }); }); // lên lớp ngay trên trang
  await daCo(p, 4);
  const ve = await p.evaluate(() => document.querySelectorAll('#app .isl, #app [onclick*="island"]').length);
  dat(ds(o.khoi) === 'lop-3, lop-4' && o.dieuHuong === nav && ve > 0, `học sinh lên lớp 4 · tải thêm lop-4, không tải lại trang, bản đồ có ${ve} đảo (đã tải: ${ds(o.khoi)})`);
  dat(!o.loi.length, 'học sinh · không lỗi JS' + (o.loi.length ? ': ' + o.loi.slice(0, 3).join(' | ') : ''));
  await p.close();
}
// 3b. bản thử giáo viên
{
  const o = await moTrang('/games/lop-hoc-ao/demo/giao-vien/'), p = o.p;
  await p.waitForFunction(() => S.org && S.org.mauHS7 && !/Jenny đang chuẩn bị bài/.test(document.getElementById('app').textContent), null, { timeout: 15000 });
  dat(ds(o.khoi) === 'lop-1, lop-2, lop-3, lop-4, lop-5', `giáo viên · bản thử mở lần đầu tải đủ khối để tạo dữ liệu mẫu (đã tải: ${ds(o.khoi)})`);
  o.khoi.length = 0; await p.reload({ waitUntil: 'load' }); // lần mở sau: dữ liệu mẫu đã có (localStorage)
  const info = await p.evaluate(async () => { await new Promise(r => setTimeout(r, 300)); render(); const mine = lopCuaToi(); return { mine: mine.map(l => ({ id: l.id, khoi: l.khoi })), all: S.org.lop.map(l => ({ id: l.id, khoi: l.khoi })) }; });
  await p.waitForFunction(() => !/Jenny đang chuẩn bị bài/.test(document.getElementById('app').textContent), null, { timeout: 15000 });
  const can = ds(info.mine.map(l => l.khoi >= 6 ? 'lop-6-9' : 'lop-' + l.khoi));
  dat(ds(o.khoi) === can, `giáo viên · danh sách lớp chỉ tải khối các lớp của cô (cần: ${can}; đã tải: ${ds(o.khoi)})`);
  // đổi sang thầy/cô có lớp khối khác (ô "Đang xem với tài khoản" của bản thử) rồi vào lớp đó
  const doi = await p.evaluate(daTai => { const gvs = S.org.gv.map(g => ({ id: g.id, lop: S.org.lop.filter(l => l.gv.includes(g.id)) }));
    const g = gvs.find(x => x.lop.some(l => l.khoi <= 5 && !daTai.includes('lop-' + l.khoi))); return g && { id: g.id, khoi: [...new Set(g.lop.map(l => l.khoi))], lop: g.lop.find(l => !daTai.includes('lop-' + l.khoi)).id }; }, o.khoi);
  if (doi) {
    const nav = o.dieuHuong, truocDo = ds(o.khoi);
    await p.evaluate(id => { gvMe = id; gvLop = null; go({ k: 'home' }); }, doi.id);
    for (const g of doi.khoi) await daCo(p, g);
    await p.evaluate(id => vaoLop(id), doi.lop);
    const ten = await p.evaluate(() => (gvLop && lopById(gvLop).ten) || '');
    dat(ds(o.khoi) === ds([...o.khoi.filter(k => truocDo.includes(k)), ...doi.khoi.map(g => 'lop-' + g)]) && o.dieuHuong === nav && !!ten,
      `giáo viên · đổi sang ${doi.id} (khối ${doi.khoi.join(', ')}) rồi vào lớp ${ten} → tải thêm khối mới, không tải lại trang (đã tải: ${ds(o.khoi)})`);
  } else dat(false, 'giáo viên · bản thử không có thầy/cô nào dạy khối khác để thử');
  dat(!o.loi.length, 'giáo viên · không lỗi JS' + (o.loi.length ? ': ' + o.loi.slice(0, 3).join(' | ') : ''));
  await p.close();
}
// 3c. bản thử phụ huynh
{
  const o = await moTrang('/games/lop-hoc-ao/demo/phu-huynh/'), p = o.p;
  await p.waitForFunction(() => S.org && S.org.mauHS7 && !/Jenny đang chuẩn bị bài/.test(document.getElementById('app').textContent), null, { timeout: 15000 });
  o.khoi.length = 0; await p.reload({ waitUntil: 'load' }); // bỏ lần đầu (tạo dữ liệu mẫu, tải đủ khối)
  await p.waitForFunction(() => !/Jenny đang chuẩn bị bài/.test(document.getElementById('app').textContent), null, { timeout: 15000 });
  const g = await p.evaluate(() => S.st[sid].grade), can = g >= 6 ? 'lop-6-9' : 'lop-' + g;
  dat(ds(o.khoi) === can, `phụ huynh · chỉ tải khối của con đang xem (lớp ${g}; đã tải: ${ds(o.khoi)})`);
  const khac = await p.evaluate(g => (STUDENTS.find(s => s[2] !== g && s[2] <= 5) || [])[0], g);
  if (khac) {
    const nav = o.dieuHuong;
    const g2 = await p.evaluate(id => { sid = id; go({ k: 'home' }); return S.st[id].grade; }, khac);
    await daCo(p, g2);
    dat(o.khoi.includes('lop-' + g2) && o.dieuHuong === nav, `phụ huynh · xem con lớp ${g2} → tải lop-${g2}, không tải lại trang`);
  }
  dat(!o.loi.length, 'phụ huynh · không lỗi JS' + (o.loi.length ? ': ' + o.loi.slice(0, 3).join(' | ') : ''));
  await p.close();
}

// 4. kiến thức trò chơi: bản một file (đủ khối, tĩnh) và bản tải theo khối
const KT_JS = `(G=>{for(const k in KT)delete KT[k];const id=(STUDENTS.find(s=>s[2]===G)||[])[0];(0,eval)("sid='"+id+"'");role='hs';LANG='vi';
  return ktGrade(G).map(x=>({id:x.id,f:[...x.f],mx:x.mx,max:x.max}))})`;
const tinhKT = {}, truoc = {}, tinhDL = {};
const DL69 = `JSON.stringify({p1:[6,7,8,9].map(g=>(P1BY[g]||[]).map(x=>[x.id,x.title,(x.slides||[]).length,!!x.video,(x.lv||[]).map(gs=>gs.length)])),p2:P2.map(x=>[x.id,x.title]),
  allp1:ALLP1.filter(x=>!/^g\\d/.test(String(x.id))).length,hint:(()=>{try{return Object.keys(hint6()).length}catch(e){return -1}})()})`;
// dữ liệu một khối (đảo, số hàm sinh câu và lớp bọc của từng màn, chủ đề, trùm, bài giảng, trò chơi nhỏ): bản tải theo khối phải giống bản một file
const DL_JS = `(G=>JSON.stringify({isl:PRIM[G].isl.map(x=>[x.id,x.ti,x.b,x.title,x.nm,(x.lv||[]).map(gs=>gs.map(g=>(g.gdFlip?'f':'')+(g.en?'e':'')+String(g).length))]),
  T:PRIM[G].T,boss:PRIM[G].boss,bossThem:(PRIM[G].boss||[]).map(b=>b&&[b.base,b.he,b.bk]),les:Object.entries(LES[G]||{}).map(([k,v])=>[k,v.length,v.map(s=>s.t)]),
  mg:Object.keys(MG[G]||{}),mgt:Object.keys(MGT).filter(t=>MGT[t][G]),p1by:(P1BY[G]||[]).length,allp1:ALLP1.filter(x=>String(x.id).startsWith('g'+G)).length}))`;
{
  const p = await b.newPage();
  const tam = path.join(APP, 'dist', '_kich-co.html');
  fs.writeFileSync(tam, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(APP, 'dist', 'lop-hoc-ao-jenny.html'), 'utf8') + '</body></html>');
  for (let G = 1; G <= 5; G++) { // mỗi lớp một trang mới (như một em mở trang): hàm nhớ kết quả lần đầu không lẫn giữa các lớp
    await p.goto('file://' + tam); await p.waitForTimeout(300);
    tinhDL[G] = await p.evaluate(`${DL_JS}(${G})`);
    tinhKT[G] = await p.evaluate(`${KT_JS}(${G})`);
    if (G > 1) truoc[G] = await p.evaluate(`(L=>({mx:L.mx,f:[...L.f]}))(KT[${G - 1}][KT[${G - 1}].length-1])`);
  }
  await p.goto('file://' + tam); await p.waitForTimeout(300); tinhDL[6] = await p.evaluate(DL69);
  fs.unlinkSync(tam); await p.close();
}
const tepTruoc = G => path.join(APP, 'content', `lop-${G}`, '90-kien-thuc-truoc.js');
if (GHI) {
  for (let G = 2; G <= 5; G++) {
    const s = fs.readFileSync(tepTruoc(G), 'utf8');
    fs.writeFileSync(tepTruoc(G), s.replace(/export const KT_TRUOC_LOP=[\s\S]*$/, `export const KT_TRUOC_LOP=${JSON.stringify(truoc[G])};\n`));
  }
  console.log('đã ghi content/lop-2…5/90-kien-thuc-truoc.js — chạy lại npm run build rồi kiểm tra lại');
}
for (let G = 2; G <= 5; G++) {
  const m = fs.readFileSync(tepTruoc(G), 'utf8').match(/export const KT_TRUOC_LOP=(.*);\s*$/);
  dat(m && m[1] === JSON.stringify(truoc[G]), `content/lop-${G}/90-kien-thuc-truoc.js khớp kiến thức cuối lớp ${G - 1} (${truoc[G].f.length} dấu hiệu)` + (m && m[1] === JSON.stringify(truoc[G]) ? '' : ' — chạy: node tools/test/kich-co.mjs --ghi'));
}
for (const G of [1, 2, 3, 4, 5]) {
  const o = await moTrang('/dist/_day-du.html'), p = o.p;
  {
    const lop = await p.evaluate(async G => { await window.__ready(G); return Object.keys(PRIM).join(','); }, G);
    const dl = await p.evaluate(`${DL_JS}(${G})`);
    if (dl !== tinhDL[G]) { let i = 0; while (dl[i] === tinhDL[G][i]) i++; console.log(`   khác: …${dl.slice(Math.max(0, i - 80), i + 60)}…\n   bản một file: …${tinhDL[G].slice(Math.max(0, i - 80), i + 60)}…`); }
    dat(dl === tinhDL[G], `dữ liệu khối lớp ${G} khi tải theo khối = bản một file (đảo, hàm sinh câu, trùm, bài giảng, trò chơi nhỏ)`);
    const dong = await p.evaluate(`${KT_JS}(${G})`);
    if (JSON.stringify(dong) !== JSON.stringify(tinhKT[G])) { const i = dong.findIndex((x, k) => JSON.stringify(x) !== JSON.stringify(tinhKT[G][k])), A = dong[i] || {}, B = tinhKT[G][i] || {};
      console.log(`   khác từ đảo thứ ${i} (${A.id}): mx ${A.mx}/${B.mx} · max ${A.max}/${B.max} · thiếu ${(B.f || []).filter(v => !(A.f || []).includes(v)).join(',')} · thừa ${(A.f || []).filter(v => !(B.f || []).includes(v)).join(',')}`); }
    dat(JSON.stringify(dong) === JSON.stringify(tinhKT[G]), `kiến thức trò chơi lớp ${G} khi tải theo khối (khối có: ${lop}) = bản một file (${dong.length} đảo)`);
  }
  dat(!o.loi.length, `day-du.html lớp ${G} · không lỗi JS` + (o.loi.length ? ': ' + o.loi.slice(0, 3).join(' | ') : ''));
  await p.close();
}

{ // khối lop-6-9 (trang giáo viên, quản lý, bản thử)
  const o = await moTrang('/dist/_day-du.html'), p = o.p;
  await p.evaluate(() => window.__ready(6));
  dat(await p.evaluate(DL69) === tinhDL[6] && !o.loi.length, 'dữ liệu khối lớp 6–9 khi tải theo khối = bản một file (Phần I lớp 6–9, Toán Jenny lớp 6, gợi ý lớp 6)');
  await p.close();
}
await b.close(); may.close();
console.log(loi ? `\n${loi} mục CHƯA ĐẠT` : '\nKích cỡ, tải theo khối: ĐẠT');
process.exit(loi ? 1 : 0);
