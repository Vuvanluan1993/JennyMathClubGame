// Plugin Vite "nối file" (P-14a, 25/10/2026; P-14b 26/10: file JS là ES module, nối xong vẫn là một script thường).
// - Đọc app.template.html, nối mọi /*@include …*/ theo ĐÚNG thứ tự trong template (như build.py cũ),
//   thay __APP_VER__ → ra bản đầy đủ (dist/lop-hoc-ao-jenny.html, một file, bộ kiểm tra §7 và Artifact dùng).
// - Mỗi trang vai (vai.js) tách khối <style> chính → assets/lop-hoc-ao-[hash].css (chung) và khối <script> chính
//   → assets/<trang>-[hash].js. JS vẫn là MỘT <script> thường (không type=module), cùng chỗ cũ cuối <body>:
//   giữ phạm vi toàn cục, hoisting "function trùng tên bản sau thắng", onclick="…" gọi được hàm.
//   Rollup không đọc mã này (asset), nên không đổi tên biến, không tree-shake, không minify.
// - Các script nhỏ trong <head> (data-theme light, chữ tự host, CSP) giữ nguyên chỗ, chạy TRƯỚC CSS.
// - Đường dẫn asset ghi tương đối (../assets/…) nên một bản chạy được cả trên Pages (base), máy chủ thử ở "/" và dist/.
// - Xong build: chép 4 trang thật + 4 trang thử sang games/lop-hoc-ao/ (assets/.gitignore tự sinh = "*", không vào git).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { hocSinh, giaoVien, TRANG_GV } from './vai.js';
import { boModule, docFileJs, kiemTraLienKet } from './module.js';

const INC = /\/\*@include ([^*]+?)\*\//g;
const MOC = { cssDau: '<!--@vite:css-->', cssCuoi: '<!--/@vite:css-->', jsDau: '<!--@vite:js-->', jsCuoi: '<!--/@vite:js-->' };
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

function noi(goc, text, sau = 0) {
  if (sau >= 5) throw new Error('include lồng quá sâu');
  return text.replace(INC, (_, f) => {
    f = f.trim();
    let m = fs.readFileSync(path.join(goc, f), 'utf8');
    if (f.endsWith('.js')) m = boModule(m, f); // P-14b: file JS là ES module; khi nối thành một script thường thì bỏ dòng import và chữ "export "
    return noi(goc, m.replace(/\n$/, ''), sau + 1);
  });
}

/** Danh sách file theo thứ tự nối (CSS rồi JS), kể cả include lồng (vd. content/lessons/*, content/hk2/* trong file 30) — đọc từ app.template.html, không danh sách cứng. */
export function thuTu(goc, tep = 'app.template.html', sau = 0) {
  if (sau >= 5) throw new Error('include lồng quá sâu');
  const t = fs.readFileSync(path.join(goc, tep), 'utf8');
  return [...t.matchAll(INC)].flatMap(m => { const f = m[1].trim(); return [f, ...thuTu(goc, f, sau + 1)]; });
}

/** Bản đầy đủ. coMoc = true: đánh dấu khối CSS/JS chính để tách ra file (mốc là chú thích HTML, nằm ngoài thẻ). */
export function banDayDu(goc, coMoc = false) {
  const lk = kiemTraLienKet(docFileJs(goc, thuTu(goc))); // import phải khớp export của file đích (như bộ liên kết module)
  if (lk.length) throw new Error('import/export không khớp (chạy node tools/vite/tim-import.mjs):\n' + lk.join('\n'));
  let t = fs.readFileSync(path.join(goc, 'app.template.html'), 'utf8');
  for (const [re, dau, cuoi] of [[KHOI_CSS, MOC.cssDau, MOC.cssCuoi], [KHOI_JS, MOC.jsDau, MOC.jsCuoi]]) {
    const n = (t.match(re) || []).length;
    if (n !== 1) throw new Error(`app.template.html: cần đúng 1 khối ${dau} (chỉ gồm dòng /*@include*/), thấy ${n}`);
    if (coMoc) t = t.replace(re, k => dau + k + cuoi);
  }
  return noi(goc, t).split('__APP_VER__').join(soBan(goc));
}

/** Bỏ mốc → trang một file (y như build cũ). */
export const motFile = t => Object.values(MOC).reduce((s, m) => s.split(m).join(''), t);

/** Tách trang có mốc → { truoc, css, giua, js, sau }. */
export function tach(t) {
  const lay = (dau, cuoi, the) => {
    const i = t.indexOf(dau), j = t.indexOf(cuoi);
    if (i < 0 || j < i || t.indexOf(dau, i + 1) >= 0 || t.indexOf(cuoi, j + 1) >= 0) throw new Error('tach: mốc ' + dau + ' hỏng');
    const k = t.slice(i + dau.length, j), m = k.match(new RegExp(`^<${the}>([\\s\\S]*)</${the}>$`));
    if (!m) throw new Error('tach: khối ' + dau + ' không phải <' + the + '>…</' + the + '>');
    return { i, j: j + cuoi.length, noi: m[1] };
  };
  const c = lay(MOC.cssDau, MOC.cssCuoi, 'style'), s = lay(MOC.jsDau, MOC.jsCuoi, 'script');
  if (!(c.j <= s.i)) throw new Error('tach: khối CSS phải đứng trước khối JS');
  return { truoc: t.slice(0, c.i), css: c.noi, giua: t.slice(c.j, s.i), js: s.noi, sau: t.slice(s.j) };
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp3': 'audio/mpeg', '.ico': 'image/x-icon' };

/**
 * @param {{goc:string, repo:string, trang:Record<string,string>, base:string}} o
 *   goc = src/lop-hoc-ao, repo = gốc kho, trang = { entry: đường ra trong dist }, base = base của vite.config.js
 */
export default function noiFile({ goc, repo, trang, base }) {
  const ao = Object.fromEntries(Object.entries(trang).map(([ten, f]) => [path.join(goc, f), ten])); // id ảo → tên entry
  const ra = {}; // tên entry → { phan, cssRef, jsRef }
  const BAN_RA = path.join(repo, 'games', 'lop-hoc-ao');
  return {
    name: 'jenny-noi-file',
    enforce: 'pre',
    resolveId(id) { const p = path.resolve(goc, id); return ao[p] ? p : null; },
    load(id) { return ao[id] ? '<!doctype html>\n<html><head></head><body></body></html>\n' : null; },

    buildStart() {
      const ban = banDayDu(goc, true), css = new Map();
      for (const ten of Object.values(ao)) {
        const phan = tach(LAM[ten](ban));
        if (!css.has(phan.css)) css.set(phan.css, this.emitFile({ type: 'asset', name: 'lop-hoc-ao.css', source: phan.css }));
        ra[ten] = { phan, cssRef: css.get(phan.css), jsRef: this.emitFile({ type: 'asset', name: ten + '.js', source: phan.js }) };
      }
      this.emitFile({ type: 'asset', fileName: 'lop-hoc-ao-jenny.html', source: motFile(ban) });
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
          const { phan, cssRef, jsRef } = ra[ten];
          ra[ten].tep = [f, this.getFileName(cssRef), this.getFileName(jsRef)];
          a.source = phan.truoc + `<link rel="stylesheet" href="${toi(cssRef)}">` + phan.giua + `<script src="${toi(jsRef)}"></script>` + phan.sau;
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
