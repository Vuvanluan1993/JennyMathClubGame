// Gom lời đọc CỐ ĐỊNH của một lớp thành danh sách để thu giọng (cần đã chạy tools/build.py).
//   node tools/giong/gom-loi-doc.js 1      → ../../tools/giong/lop1.json
// Gom: bài giảng Jenny (mọi slide), lời giới thiệu đảo, câu khen/nhắc cố định, lời mở đầu trò chơi,
// và (lớp 1–2) SO_DE câu đọc đề gặp nhiều nhất + lời trong trò chơi (luật, câu Ếch/Câu cá/Trồng cây, SO_LEO câu Leo núi).
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
const SO_LEO = Number(process.env.SO_LEO || 2000); // số câu Leo núi gặp nhiều nhất
const MAU_ECH = Number(process.env.MAU_ECH || 600); // số lần lấy mẫu câu Ếch/Câu cá/Trồng cây mỗi đảo (lấy hết)

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
  const r = await p.evaluate(([g, fixed, SO_DE, MAU, SO_LEO, MAU_ECH]) => {
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
    // TRÒ CHƠI (lớp 1–2): chạy thật từng trò "Chơi thêm" của mỗi đảo, ghi lại lời Jenny nói (luật chơi, câu đầu);
    // rồi lấy mẫu câu hỏi trong trò: Ếch nhảy / Thả mồi câu cá / Trồng cây (frogQ → frogSay) lấy hết,
    // Leo núi (climbQ → climbSayText) lấy SO_LEO câu gặp nhiều nhất.
    const tc = { luat: 0, ech: 0, leo: 0 };
    if (g <= 2) {
      let h = 20261110; const R0 = Math.random;
      Math.random = () => { h |= 0; h = h + 0x6D2B79F5 | 0; let t = Math.imul(h ^ h >>> 15, 1 | h); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 };
      const nghe = new Set(), S0 = sayJ, TO = window.setTimeout;
      sayJ = t => { try { if (t) nghe.add(spoken(String(t))) } catch (e) {} };
      window.setTimeout = (f, ms, ...a) => TO(f, Math.min(ms || 0, 5), ...a);  // cho lời nói trễ chạy ngay
      const ech = new Map(), leo = new Map(), dem = (M, t) => { if (t) { t = spoken(t); M.set(t, (M.get(t) || 0) + 1) } };
      const acts = [];
      for (const x of isl) {
        try { go({ k: 'island', id: x.id }) } catch (e) { continue }
        const a = [...document.querySelectorAll('.oplist .opt')].map(b => b.getAttribute('onclick')).filter(Boolean);
        a.forEach(s => acts.push([x, s]));
        const modes = a.map(s => (s.match(/start\w*\('?(\w+)'?/) || [])[1]);
        try { XG_KT = ktOf(x) } catch (e) {}
        if (a.some(s => /'(frog|bait|plant)'/.test(s))) for (let i = 0; i < MAU_ECH; i++) { try { dem(ech, frogSay(frogQ(x))) } catch (e) {} }
        if (a.some(s => /'climb'/.test(s))) for (let i = 0; i < 150; i++) { try { dem(leo, climbSayText(climbQ(x, new Set()))) } catch (e) {} }
      }
      Math.random = R0;
      const cho = ms => new Promise(r => TO(r, ms));
      return (async () => {
        for (const [x, s] of acts) for (let r = 0; r < 4; r++) {
          try { (0, eval)(s) } catch (e) {}
          await cho(20);
          try { stopXG() } catch (e) {} try { stopMini() } catch (e) {}
          try { const q = scr && scr.q; if (q) nghe.add(spoken(scr.mode === 'climb' ? climbSayText(q) : frogSay(q))) } catch (e) {}
        }
        sayJ = S0; window.setTimeout = TO;
        nghe.forEach(t => { if (t && !seen.has(t)) { seen.add(t); out.push({ loai: 'tro-choi', text: t }); tc.luat++ } });
        [...ech.keys()].forEach(t => { if (!seen.has(t)) { seen.add(t); out.push({ loai: 'tro-choi', text: t }); tc.ech++ } });
        [...leo.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).filter(([t]) => !seen.has(t)).slice(0, SO_LEO)
          .forEach(([t]) => { seen.add(t); out.push({ loai: 'tro-choi', text: t }); tc.leo++ });
        return { out, phu: out.phu, tc };
      })();
    }
    return { out, phu: out.phu, tc };
  }, [g, fixed, SO_DE, MAU, SO_LEO, MAU_ECH]).then(x => {
    if (x.phu) console.log('Đọc đề: phủ', x.phu, 'số lần đọc đề (theo mẫu)');
    if (x.tc && (x.tc.luat + x.tc.ech + x.tc.leo)) console.log('Trò chơi: lời luật/câu đầu', x.tc.luat, '· câu Ếch/Câu cá/Trồng cây', x.tc.ech, '· câu Leo núi', x.tc.leo);
    return x.out });
  await b.close(); fs.unlinkSync(tmp);
  if (er.length) console.log('Lỗi trang:', er.slice(0, 3));
  const ds = r.map(c => ({ id: crypto.createHash('sha1').update(c.text).digest('hex').slice(0, 12), loai: c.loai, text: c.text }));
  const f = path.join(REPO, 'tools', 'giong', `lop${g}.json`);
  // Giữ lại câu đọc đề/trò chơi của danh sách cũ (đã thu rồi) dù lần lấy mẫu này không chọn lại — tránh mất file đã thu.
  // Đặt GIU_CU=0 để bỏ (vd. khi nội dung đổi nhiều).
  if (process.env.GIU_CU !== '0' && fs.existsSync(f)) {
    const co = new Set(ds.map(c => c.id)); let giu = 0;
    JSON.parse(fs.readFileSync(f, 'utf8')).forEach(c => { if (!co.has(c.id) && (c.loai === 'doc-de' || c.loai === 'tro-choi')) { ds.push(c); co.add(c.id); giu++ } });
    if (giu) console.log('Giữ lại', giu, 'câu của danh sách cũ');
  }
  fs.writeFileSync(f, '[\n' + ds.map(c => ' ' + JSON.stringify(c)).join(',\n') + '\n]\n');
  const dem = ds.reduce((a, c) => (a[c.loai] = (a[c.loai] || 0) + 1, a), {});
  console.log(`Lớp ${g}: ${ds.length} lời, ${ds.reduce((a, c) => a + c.text.length, 0)} ký tự →`, path.relative(REPO, f), dem);
})();
