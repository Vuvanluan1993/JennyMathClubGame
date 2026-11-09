// Gom lời đọc CỐ ĐỊNH của một lớp thành danh sách để thu giọng (cần đã chạy tools/build.py).
//   node tools/giong/gom-loi-doc.js 1      → ../../tools/giong/lop1.json
// Gom: bài giảng Jenny (mọi slide), lời giới thiệu đảo, câu khen/nhắc cố định, lời mở đầu trò chơi,
// và (lớp 1–2) SO_DE câu đọc đề gặp nhiều nhất.
// Câu đọc đề hiếm và lời giải khi sai không gom — dùng giọng máy.
// Mỗi lời: {id, text}. id = mã của chính lời đọc (đã qua spoken()), nên sửa lời → id mới → thu lại.
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..');
const REPO = path.resolve(ROOT, '..', '..');
const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const g = Number(process.argv[2] || 1);
const SO_DE = Number(process.env.SO_DE || 6000);   // số câu đọc đề thu nguyên câu (thầy chọn 6000, 09/11/2026)
const MAU = Number(process.env.MAU || 400);        // số lần lấy mẫu mỗi dạng câu

// Câu cố định trong mã: sayJ('…') hoặc sayJ(a ? '…' : '…'), không có ${…}, không nối chuỗi.
function cauCoDinh() {
  const out = new Set();
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(f => {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p); else if (p.endsWith('.js')) {
      const s = fs.readFileSync(p, 'utf8');
      const lit = `'([^'\\\\$+]{2,})'|"([^"\\\\$+]{2,})"`;
      const one = new RegExp(`sayJ\\(\\s*(?:${lit})\\s*\\)`, 'g');
      const tern = new RegExp(`sayJ\\(\\s*[\\w.!=']+\\s*\\?\\s*(?:${lit})\\s*:\\s*(?:${lit})\\s*\\)`, 'g');
      let m;
      while ((m = one.exec(s))) out.add(m[1] || m[2]);
      while ((m = tern.exec(s))) [m[1] || m[2], m[3] || m[4]].forEach(t => t && out.add(t));
      // danh sách chọn ngẫu nhiên: sayJ(pick(T('A|B|C', …))) và sayJ(pick(['A','B']))
      const pk = /sayJ\(pick\(T\('([^']+)'/g;
      while ((m = pk.exec(s))) m[1].split('|').forEach(t => out.add(t));
      const pa = /sayJ\(pick\(\[([^\]]+)\]/g;
      while ((m = pa.exec(s))) (m[1].match(/'([^']+)'/g) || []).forEach(t => out.add(t.slice(1, -1)));
      // lời mở đầu trò chơi cố định: say:'…' (không nối chuỗi), chỉ ở file trò chơi js/core/3x
      const sy = /\bsay:'([^'\\$]{8,})'\s*[},]/g;
      if (/[\\/]core[\\/](3\d|39)/.test(p)) while ((m = sy.exec(s))) out.add(m[1]);  // chỉ file trò chơi tiểu học
      // lời khen/động viên màn Vẽ hình
      const dr = /const DRAW_(?:OK|BAD)=\{vi:\[([^\]]+)\]/g;
      while ((m = dr.exec(s))) (m[1].match(/'([^']+)'/g) || []).forEach(t => out.add(t.slice(1, -1)));
    }
  });
  walk(path.join(ROOT, 'js'));
  return [...out].filter(t => /[a-zà-ỹ]/i.test(t) && !/^[A-Z][a-z' ]+[.!]?$/.test(t)); // bỏ câu tiếng Anh
}

(async () => {
  const b = await chromium.launch({ executablePath: fs.existsSync(EXE) ? EXE : undefined });
  const tmp = path.join(ROOT, 'dist', '_gom.html');
  fs.writeFileSync(tmp, '<!doctype html><html><head><meta charset="utf-8"></head><body>' +
    fs.readFileSync(path.join(ROOT, 'dist', 'lop-hoc-ao-jenny.html'), 'utf8') + '</body></html>');
  const p = await b.newPage();
  const er = []; p.on('pageerror', e => er.push(e.message));
  await p.goto('file://' + tmp); await p.waitForTimeout(400);
  const fixed = cauCoDinh();
  const r = await p.evaluate(([g, fixed, SO_DE, MAU]) => {
    try { localStorage.clear() } catch (e) {}
    fresh(); role = 'hs'; (0, eval)("sid='" + { 1: 'na', 2: 'lam', 3: 'quan', 4: 'thao', 5: 'duc' }[g] + "'");
    const out = [], seen = new Set();
    const add = (loai, t) => { t = spoken(t); if (t && !seen.has(t)) { seen.add(t); out.push({ loai, text: t }) } };
    const dv = s => { const d = document.createElement('textarea'); d.innerHTML = s; return d.value };
    const isl = PRIM[g].isl, bai = new Set();
    for (const x of isl) {
      // lời giới thiệu đảo (nút 🔊 ở trang đảo)
      add('gioi-thieu', `${dv(esc(x.title))}. Hôm nay em học: ${dv(esc(x.goal))}. Mỗi màn có khoảng ${g <= 2 ? 5 : 8} câu.${g <= 2 ? ' Jenny sẽ đọc đề cho em nghe.' : ''}`);
      const L = lesOf(x); if (!L || bai.has(L)) continue; bai.add(L);
      L.forEach(sl => add('bai-giang', sayFull(sl.say, sl.h)));
    }
    fixed.forEach(t => add('cau-co-dinh', t));
    // ĐỌC ĐỀ: lấy mẫu mọi dạng câu (hạt ngẫu nhiên cố định → danh sách ổn định giữa các lần gom),
    // xếp theo số lần gặp, lấy SO_DE câu phổ biến nhất. Chỉ lớp tự đọc đề (lớp 1–2).
    if (g <= 2 && SO_DE > 0) {
      let h = 20261109; const R0 = Math.random;
      Math.random = () => { h |= 0; h = h + 0x6D2B79F5 | 0; let t = Math.imul(h ^ h >>> 15, 1 | h); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 };
      const F = new Map();
      for (const x of isl) x.lv.forEach(L => L.forEach(gn => { for (let k = 0; k < MAU; k++) { let q; try { q = gn() } catch (e) { break } const t = spoken(sayFull(q.say, q.q)); if (t) F.set(t, (F.get(t) || 0) + 1) } }));
      Math.random = R0;
      const tong = [...F.values()].reduce((a, b) => a + b, 0);
      const top = [...F.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).filter(([t]) => !seen.has(t)).slice(0, SO_DE);
      top.forEach(([t]) => { seen.add(t); out.push({ loai: 'doc-de', text: t }) });
      out.phu = (100 * top.reduce((a, c) => a + c[1], 0) / tong).toFixed(1) + '%';
    }
    return { out, phu: out.phu };
  }, [g, fixed, SO_DE, MAU]).then(x => { if (x.phu) console.log('Đọc đề: phủ', x.phu, 'số lần đọc đề (theo mẫu)'); return x.out });
  await b.close(); fs.unlinkSync(tmp);
  if (er.length) console.log('Lỗi trang:', er.slice(0, 3));
  const ds = r.map(c => ({ id: crypto.createHash('sha1').update(c.text).digest('hex').slice(0, 12), loai: c.loai, text: c.text }));
  const f = path.join(REPO, 'tools', 'giong', `lop${g}.json`);
  fs.writeFileSync(f, '[\n' + ds.map(c => ' ' + JSON.stringify(c)).join(',\n') + '\n]\n');
  const dem = ds.reduce((a, c) => (a[c.loai] = (a[c.loai] || 0) + 1, a), {});
  console.log(`Lớp ${g}: ${ds.length} lời, ${ds.reduce((a, c) => a + c.text.length, 0)} ký tự →`, path.relative(REPO, f), dem);
})();
