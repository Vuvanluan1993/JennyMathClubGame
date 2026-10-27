// Plugin Vite "nối file" (P-14a, 25/10/2026; P-14b 26/10: file JS là ES module, nối xong vẫn là một script thường).
// - Đọc app.template.html, nối mọi /*@include …*/ theo ĐÚNG thứ tự trong template (như build.py cũ),
//   thay __APP_VER__ → ra bản đầy đủ (dist/lop-hoc-ao-jenny.html, một file, bộ kiểm tra §7 và Artifact dùng).
// - Mỗi trang vai (vai.js) tách khối <style> chính → assets/lop-hoc-ao-[hash].css (chung) và khối <script> chính
//   → assets/<trang>-[hash].js. JS vẫn là MỘT <script> thường (không type=module), cùng chỗ cũ cuối <body>:
//   giữ phạm vi toàn cục, hoisting "function trùng tên bản sau thắng", onclick="…" gọi được hàm.
//   Rollup không đọc mã này (asset), nên không đổi tên biến, không tree-shake, không minify.
// - P-14c (27/10/2026): CSP không còn 'unsafe-inline'. Ba script nhỏ trong <head> (data-theme light, chữ tự host, zoom) gom ở js/dau-trang.js,
//   template ghi <script>/*@include js/dau-trang.js*/</script> (một dòng, trước CSS): trang vai tách thành assets/dau-trang-[hash].js tải đồng bộ
//   cùng chỗ; bản một file và dev nối thẳng vào <script> rồi motFile() thêm lại 'unsafe-inline' (chỉ bản đó chạy JS inline).
// - Đường dẫn asset ghi tương đối (../assets/…) nên một bản chạy được cả trên Pages (base), máy chủ thử ở "/" và dist/.
// - Xong build: chép 4 trang thật + 4 trang thử sang games/lop-hoc-ao/ (assets/.gitignore tự sinh = "*", không vào git).
// - P-15b (26/10/2026): nội dung theo khối (content/lop-*) KHÔNG nối vào trang; mỗi khối là một chunk ES (assets/lop-N-[hash].js, Rollup dựng,
//   bỏ dòng import từ js/core vì tên core là toàn cục của script chung). Trang ghi <script type="application/json" id="khoi-url"> (khối → đường dẫn)
//   ngay trước <script src>; core/30a napKhoi() tải bằng import(). Bản học sinh (thật + thử) không có lop-6-9.
//   Bản một file (lop-hoc-ao-jenny.html) và npm run dev vẫn nối nội dung tại chỗ (tĩnh) như P-15a.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { hocSinh, giaoVien, TRANG_GV, thayCauHinh } from './vai.js';
import { boModule, docFileJs, kiemTraLienKet } from './module.js';

const INC = /\/\*@include ([^*]+?)\*\//g;
const MOC = { dauDau: '<!--@vite:dau-->', dauCuoi: '<!--/@vite:dau-->', cssDau: '<!--@vite:css-->', cssCuoi: '<!--/@vite:css-->', jsDau: '<!--@vite:js-->', jsCuoi: '<!--/@vite:js-->' };
const KHOI_DAU = /<script>\/\*@include js\/dau-trang\.js\*\/<\/script>/g; // P-14c: script đầu trang, một dòng, trước CSS
const CSP_CHAT = "script-src 'self' https://www.gstatic.com;", CSP_INLINE = "script-src 'self' 'unsafe-inline' https://www.gstatic.com;";
const KHOI_CSS = /<style>\n(?:\/\*@include [^*]+\*\/\n)+<\/style>/g;
const KHOI_JS = /<script>\n(?:\/\*@include [^*]+\*\/\n)+<\/script>/g;

/** Vai → hàm dựng trang từ bản đầy đủ. Tên = tên entry trong vite.config.js. */
export const LAM = {
  'hoc-sinh': t => hocSinh(t, false),
  'giao-vien': t => giaoVien(t, TRANG_GV[0], false),
  'phu-huynh': t => giaoVien(t, TRANG_GV[1], false),
  'quan-ly': t => giaoVien(t, TRANG_GV[2], false),
  'thu-hoc-sinh': t => hocSinh(t, true),
  'thu-giao-vien': t => giaoVien(t, TRANG_GV[0], true),
  'thu-phu-huynh': t => giaoVien(t, TRANG_GV[1], true),
  'thu-quan-ly': t => giaoVien(t, TRANG_GV[2], true),
  'day-du': t => t, // bản đầy đủ y lop-hoc-ao-jenny.html (không doctype, như build cũ), chỉ khác CSS/JS ra file có hash
};

/** Số bản ở góc thẻ chào: '<ngày commit> · <sha ngắn>' (như so_ban() của build.py cũ). */
export function soBan(goc) {
  let sha = (process.env.GITHUB_SHA || '').slice(0, 7);
  try {
    const env = { ...process.env, TZ: 'Asia/Ho_Chi_Minh' }; // ngày theo giờ Việt Nam: CI (UTC) và máy thầy ra cùng chuỗi
    const g = (...a) => execFileSync('git', ['-C', goc, ...a], { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    sha = sha || g('rev-parse', '--short=7', 'HEAD');
    return g('log', '-1', '--format=%cd', '--date=format:%d/%m') + ' · ' + sha;
  } catch {
    if (sha) return sha;
    const d = new Date(Date.now() + 7 * 3600e3), p = n => String(n).padStart(2, '0');
    return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)} · ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
  }
}

// Nội dung theo khối (P-15a): dòng include content/lop-N/index.js = cả thư mục content/lop-N.
export const KHOI = /^content\/(lop-[^/]+)\/index\.js$/;
/** File của một khối theo thứ tự chạy: tên tăng dần (10-…, 20-…), index.js cuối. */
export function tepKhoi(goc, k) {
  const d = path.join(goc, 'content', k);
  return fs.readdirSync(d).filter(f => f.endsWith('.js')).sort((a, b) => (a === 'index.js') - (b === 'index.js') || a.localeCompare(b, 'en'))
    .map(f => `content/${k}/${f}`);
}
/** Gói một khối thành MỘT câu lệnh trong script chung: mỗi khối một phạm vi hàm riêng (tên trùng giữa các khối không đụng nhau),
 *  import/export bỏ như file core; tên của core dùng thẳng (cùng script). Gọi dangKyKhoi (core/30a) ngay tại chỗ → thứ tự chạy y như trước.
 *  P-15b thay câu này bằng dangKyKhoi(k, await import('./content/…')). */
function goiKhoi(goc, k) {
  const ma = tepKhoi(goc, k).map(f => boModule(fs.readFileSync(path.join(goc, f), 'utf8'), f).replace(/\n$/, '')).join('\n');
  return `dangKyKhoi('${k}',(()=>{\n${ma}\nreturn {dangKy};\n})());`;
}

function noi(goc, text, sau = 0, tinh = true) {
  if (sau >= 5) throw new Error('include lồng quá sâu');
  return text.replace(INC, (_, f) => {
    f = f.trim();
    const k = f.match(KHOI);
    if (k) return tinh ? goiKhoi(goc, k[1]) : `/* khối ${k[1]}: tải bằng import() (core/30a napKhoi) */`;
    let m = fs.readFileSync(path.join(goc, f), 'utf8');
    if (f.endsWith('.js')) m = boModule(m, f); // P-14b: file JS là ES module; khi nối thành một script thường thì bỏ dòng import và chữ "export "
    return noi(goc, m.replace(/\n$/, ''), sau + 1, tinh);
  });
}

/** Danh sách file theo thứ tự nối (CSS rồi JS), kể cả include lồng và mọi file của khối content/lop-* — đọc từ app.template.html, không danh sách cứng. */
export function thuTu(goc, tep = 'app.template.html', sau = 0) {
  if (sau >= 5) throw new Error('include lồng quá sâu');
  const t = fs.readFileSync(path.join(goc, tep), 'utf8');
  return [...t.matchAll(INC)].flatMap(m => { const f = m[1].trim(), k = f.match(KHOI); return k ? tepKhoi(goc, k[1]) : [f, ...thuTu(goc, f, sau + 1)]; });
}

/** Các khối nội dung theo thứ tự trong app.template.html: ['lop-6-9', 'lop-1', …]. */
export function dsKhoi(goc) {
  return [...fs.readFileSync(path.join(goc, 'app.template.html'), 'utf8').matchAll(INC)].map(m => (m[1].trim().match(KHOI) || [])[1]).filter(Boolean);
}
/** Bản học sinh chỉ có tiểu học: không đưa khối lop-6-9 vào danh sách tải. */
export const khoiCuaTrang = (ten, ds) => /hoc-sinh$/.test(ten) ? ds.filter(k => k !== 'lop-6-9') : ds;

/** Bản đầy đủ. coMoc = true: đánh dấu khối CSS/JS chính để tách ra file (mốc là chú thích HTML, nằm ngoài thẻ).
 *  tinh = true: nối nội dung các khối tại chỗ (bản một file, dev); false: bỏ, trang tải khối bằng import() (P-15b). */
export function banDayDu(goc, coMoc = false, tinh = true) {
  const lk = kiemTraLienKet(docFileJs(goc, thuTu(goc))); // import phải khớp export của file đích (như bộ liên kết module)
  if (lk.length) throw new Error('import/export không khớp (chạy node tools/vite/tim-import.mjs):\n' + lk.join('\n'));
  let t = fs.readFileSync(path.join(goc, 'app.template.html'), 'utf8');
  if (!t.includes(CSP_CHAT)) throw new Error('app.template.html: CSP phải là ' + CSP_CHAT + " (P-14c: không 'unsafe-inline')");
  for (const [re, dau, cuoi] of [[KHOI_DAU, MOC.dauDau, MOC.dauCuoi], [KHOI_CSS, MOC.cssDau, MOC.cssCuoi], [KHOI_JS, MOC.jsDau, MOC.jsCuoi]]) {
    const n = (t.match(re) || []).length;
    if (n !== 1) throw new Error(`app.template.html: cần đúng 1 khối ${dau} (chỉ gồm dòng /*@include*/), thấy ${n}`);
    if (coMoc) t = t.replace(re, k => dau + k + cuoi);
  }
  return thayCauHinh(noi(goc, t, 0, tinh).split('__APP_VER__').join(soBan(goc))); // P-21: __FB_CAU_HINH__ của 62 ← firebase/cau-hinh.json theo FB_ENV (vai.js)
}

/** Bỏ mốc → trang một file (y như build cũ). Bản này chạy toàn bộ JS inline nên CSP thêm lại 'unsafe-inline'
 *  (chỉ dist/lop-hoc-ao-jenny.html cho bộ kiểm tra §7 / Artifact và npm run dev; 8 trang vai + day-du.html giữ CSP chặt). */
export const motFile = t => Object.values(MOC).reduce((s, m) => s.split(m).join(''), t).split(CSP_CHAT).join(CSP_INLINE);

/** Tách trang có mốc → { truoc, dau, giua0, css, giua, js, sau } (dau = script đầu trang, P-14c). */
export function tach(t) {
  const lay = (dau, cuoi, the) => {
    const i = t.indexOf(dau), j = t.indexOf(cuoi);
    if (i < 0 || j < i || t.indexOf(dau, i + 1) >= 0 || t.indexOf(cuoi, j + 1) >= 0) throw new Error('tach: mốc ' + dau + ' hỏng');
    const k = t.slice(i + dau.length, j), m = k.match(new RegExp(`^<${the}>([\\s\\S]*)</${the}>$`));
    if (!m) throw new Error('tach: khối ' + dau + ' không phải <' + the + '>…</' + the + '>');
    return { i, j: j + cuoi.length, noi: m[1] };
  };
  const d = lay(MOC.dauDau, MOC.dauCuoi, 'script'), c = lay(MOC.cssDau, MOC.cssCuoi, 'style'), s = lay(MOC.jsDau, MOC.jsCuoi, 'script');
  if (!(d.j <= c.i && c.j <= s.i)) throw new Error('tach: thứ tự phải là script đầu trang → CSS → JS');
  return { truoc: t.slice(0, d.i), dau: d.noi, giua0: t.slice(d.j, c.i), css: c.noi, giua: t.slice(c.j, s.i), js: s.noi, sau: t.slice(s.j) };
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp3': 'audio/mpeg', '.ico': 'image/x-icon' };

/**
 * @param {{goc:string, repo:string, trang:Record<string,string>, base:string}} o
 *   goc = src/lop-hoc-ao, repo = gốc kho, trang = { entry: đường ra trong dist }, base = base của vite.config.js
 */
export default function noiFile({ goc, repo, trang, base }) {
  const ao = Object.fromEntries(Object.entries(trang).map(([ten, f]) => [path.join(goc, f), ten])); // id ảo → tên entry
  const ra = {}; // tên entry → { phan, dauRef, cssRef, jsRef }
  const BAN_RA = path.join(repo, 'games', 'lop-hoc-ao');
  const khoi = {}; // P-15b: tên khối → referenceId chunk
  const thuMucNoiDung = path.join(goc, 'content') + path.sep;
  const IMPORT_CORE = /^import \{[^}]*\} from '(?:\.\.\/)+js\/core\/[^']+';\n/gm;
  return {
    name: 'jenny-noi-file',
    enforce: 'pre',
    resolveId(id) { const p = path.resolve(goc, id); return ao[p] ? p : null; },
    load(id) { return ao[id] ? '<!doctype html>\n<html><head></head><body></body></html>\n' : null; },

    // P-15b: file trong content/** là ES module của chunk khối; tên của core (import từ js/core) là toàn cục của script chung → bỏ dòng import đó
    transform(code, id) {
      if (!id.startsWith(thuMucNoiDung)) return null;
      return { code: code.replace(IMPORT_CORE, m => '\n'.repeat(m.split('\n').length - 1)), map: null };
    },

    buildStart() {
      for (const k of dsKhoi(goc)) khoi[k] = this.emitFile({ type: 'chunk', id: path.join(goc, 'content', k, 'index.js'), name: k, preserveSignature: 'strict' });
      const ban = banDayDu(goc, true, false), css = new Map(), dau = new Map();
      for (const ten of Object.values(ao)) {
        const phan = tach(LAM[ten](ban));
        if (!css.has(phan.css)) css.set(phan.css, this.emitFile({ type: 'asset', name: 'lop-hoc-ao.css', source: phan.css }));
        if (!dau.has(phan.dau)) dau.set(phan.dau, this.emitFile({ type: 'asset', name: 'dau-trang.js', source: phan.dau })); // P-14c: chung cho mọi trang
        ra[ten] = { phan, dauRef: dau.get(phan.dau), cssRef: css.get(phan.css), jsRef: this.emitFile({ type: 'asset', name: ten + '.js', source: phan.js }) };
      }
      this.emitFile({ type: 'asset', fileName: 'lop-hoc-ao-jenny.html', source: motFile(banDayDu(goc, true, true)) }); // một file: nội dung tĩnh
    },

    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        for (const [k, c] of Object.entries(bundle)) // trang không có module ES: bỏ chunk JS rỗng Vite sinh cho entry HTML
          if (c.type === 'chunk' && ao[c.facadeModuleId]) { if (c.code.replace(/\/\/.*|\s/g, '')) this.error('chunk JS không rỗng: ' + k); delete bundle[k]; }
        for (const [id, ten] of Object.entries(ao)) {
          const f = path.relative(goc, id).split(path.sep).join('/'), a = bundle[f];
          if (!a || a.type !== 'asset') this.error('không thấy trang ' + f + ' trong bundle');
          const toi = ref => path.posix.relative(path.posix.dirname(f), this.getFileName(ref)) || '.';
          const { phan, dauRef, cssRef, jsRef } = ra[ten];
          const ks = khoiCuaTrang(ten, Object.keys(khoi)), url = JSON.stringify(Object.fromEntries(ks.map(k => [k, toi(khoi[k])])));
          ra[ten].tep = [f, this.getFileName(dauRef), this.getFileName(cssRef), this.getFileName(jsRef), ...ks.map(k => this.getFileName(khoi[k]))];
          a.source = phan.truoc + `<script src="${toi(dauRef)}"></script>` + phan.giua0 + `<link rel="stylesheet" href="${toi(cssRef)}">` + phan.giua
            + `<script type="application/json" id="khoi-url">${url}</script><script src="${toi(jsRef)}"></script>` + phan.sau;
        }
      },
    },

    writeBundle(opts, bundle) {
      // games/lop-hoc-ao/ = 4 trang thật + 4 trang thử (demo/) + assets chúng dùng (day-du.html, lop-hoc-ao-jenny.html chỉ ở dist/)
      const dist = opts.dir, oAssets = path.join(BAN_RA, 'assets');
      fs.rmSync(oAssets, { recursive: true, force: true });
      fs.mkdirSync(oAssets, { recursive: true });
      fs.writeFileSync(path.join(oAssets, '.gitignore'), '# file sinh ra (vite build), không vào git\n*\n');
      const chep = f => { fs.mkdirSync(path.dirname(path.join(BAN_RA, f)), { recursive: true }); fs.copyFileSync(path.join(dist, f), path.join(BAN_RA, f)); };
      for (const ten of Object.values(ao)) {
        if (ten === 'day-du') continue;
        ra[ten].tep.forEach(chep);
      }
      this.info?.(`đã chép 4 trang thật + 4 trang thử (demo/) + assets sang ${path.relative(repo, BAN_RA)}/`);
    },

    // npm run dev: phục vụ trang dựng lại mỗi lần tải (một file, như build cũ) + file tĩnh của kho dưới /JennyMathClubGame/
    configureServer(server) {
      const kho = base.replace(/games\/lop-hoc-ao\/$/, '');
      const duong = Object.fromEntries(Object.entries(trang).flatMap(([ten, f]) => [[f, ten], [f.replace(/index\.html$/, ''), ten]]));
      server.middlewares.use((req, res, next) => {
        const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        if (p === '/') { res.writeHead(302, { Location: base }); return res.end(); }
        if (p.startsWith(base) && (duong[p.slice(base.length)] || p.slice(base.length) === 'lop-hoc-ao-jenny.html')) {
          const ten = duong[p.slice(base.length)], ban = banDayDu(goc, true);
          res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
          return res.end(motFile(ten ? LAM[ten](ban) : ban));
        }
        if (!p.startsWith(kho)) return next();
        let f = path.join(repo, p.slice(kho.length));
        if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
        if (!f.startsWith(repo) || !fs.existsSync(f)) return next();
        res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
        fs.createReadStream(f).pipe(res);
      });
    },
  };
}
