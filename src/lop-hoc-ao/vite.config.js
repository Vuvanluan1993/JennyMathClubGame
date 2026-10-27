// Vite cho Lớp học ảo (P-14a, 25/10/2026): bọc mã cũ, không đổi 90 file JS.
//   npm run build   (= vite build src/lop-hoc-ao) → dist/ (tên file có hash) + chép 4 trang thật + 4 trang thử sang games/lop-hoc-ao/
//   npm run dev     (= vite src/lop-hoc-ao)       → http://localhost:5173/JennyMathClubGame/games/lop-hoc-ao/
// Cách nối file và tách CSS/JS: tools/vite/noi-file.js. Trang theo vai: tools/vite/vai.js. Xem docs/KIEN-TRUC.md mục "Dựng bản".
// P-16 (27/10/2026) PWA: public/manifest.webmanifest + icon sinh từ PXJ (jennyPwa bên dưới), vite-plugin-pwa sinh sw.js (Workbox, registerType prompt).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import pngjs from 'pngjs';
import noiFile from './tools/vite/noi-file.js';

const goc = path.dirname(fileURLToPath(import.meta.url));
/** content/lop-1/…, content/lop-6-9/… → khối 'lop-1', 'lop-6-9' (P-15a; P-15b: một chunk mỗi khối). */
export const chunkKhoi = id => (id.split(path.sep).join('/').match(/\/content\/(lop-[^/]+)\//) || [])[1];
const repo = path.resolve(goc, '..', '..');
const base = '/JennyMathClubGame/games/lop-hoc-ao/';

// 9 entry (multi-page). Trang là "ảo": plugin dựng từ app.template.html + vai.js, không có file .html nào trên đĩa.
// Đường ra trong dist/ = đường trên Pages dưới games/lop-hoc-ao/.
const trang = {
  'hoc-sinh': 'index.html',
  'giao-vien': 'giao-vien/index.html',
  'phu-huynh': 'phu-huynh/index.html',
  'quan-ly': 'quan-ly/index.html',
  // bản THỬ (P-07): tài khoản mẫu, dữ liệu trên máy; games/lop-hoc-ao/demo/ không vào git (.gitignore)
  'thu-hoc-sinh': 'demo/index.html',
  'thu-giao-vien': 'demo/giao-vien/index.html',
  'thu-phu-huynh': 'demo/phu-huynh/index.html',
  'thu-quan-ly': 'demo/quan-ly/index.html',
  'day-du': 'day-du.html', // bản đầy đủ (mọi vai + thanh demo), chỉ ở dist/
};

/* ===================== P-16 PWA ===================== */
// Đổi số này khi đổi cấu trúc dữ liệu lưu trên máy (khoá localStorage, hình dữ liệu Firestore) hoặc đổi máy chủ:
// cache cũ của Workbox bị bỏ hết, thiết bị đang mở nhận bản mới (thanh "Có bản mới · Tải lại").
const CACHE_ID = 'jenny-lha-1';
const MAU_NEN = '#1F2A5A'; // theme_color (thanh trên của điện thoại khi cài), trùng manifest.webmanifest

/** Vẽ icon PNG vuông cỡ n từ sprite PXJ (16×19 ô, màu PXC) trong js/core/22; hình nằm trong 80 % ở giữa (vùng an toàn maskable), nền trời. */
function iconPXJ(n) {
  const src = fs.readFileSync(path.join(goc, 'js/core/22-do-hoa-pixel-mau-logo-clb.js'), 'utf8');
  const PXC = Object.fromEntries([...src.match(/export const PXC=\{([^}]*)\}/)[1].matchAll(/(\w):'(#[0-9A-Fa-f]{6})'/g)].map(m => [m[1], m[2]]));
  const PXJ = [...src.match(/const PXJ=\[([\s\S]*?)\]\.map/)[1].matchAll(/"([^"]+)"/g)].map(m => m[1].slice(0, 16));
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const o = Math.floor(n * 0.8 / PXJ.length), w = 16 * o, h = PXJ.length * o, ox = (n - w) >> 1, oy = (n - h) >> 1;
  const png = new pngjs.PNG({ width: n, height: n }), nen = hex('#7FD3F0'); // PXC.x: trời
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const r = PXJ[Math.floor((y - oy) / o)], c = r && r[Math.floor((x - ox) / o)], m = c && c !== '.' && PXC[c] ? hex(PXC[c]) : nen, i = (y * n + x) * 4;
    png.data[i] = m[0]; png.data[i + 1] = m[1]; png.data[i + 2] = m[2]; png.data[i + 3] = 255;
  }
  return pngjs.PNG.sync.write(png);
}

/** Plugin nhỏ của P-16: sinh icon vào public/icons/ (từ PXJ, giống nhau mỗi lần dựng), chèn manifest + theme-color vào trang học sinh,
 *  và chép sw.js, workbox-*.js, manifest, icons từ dist/ sang games/lop-hoc-ao/ (noi-file.js chỉ chép trang + assets ở writeBundle; sw.js sinh ở closeBundle). */
function jennyPwa() {
  const BAN_RA = path.join(repo, 'games', 'lop-hoc-ao');
  return {
    name: 'jenny-pwa',
    buildStart() {
      const d = path.join(goc, 'public', 'icons'); fs.mkdirSync(d, { recursive: true });
      for (const [f, n] of [['jenny-192.png', 192], ['jenny-512.png', 512], ['jenny-512-maskable.png', 512]]) fs.writeFileSync(path.join(d, f), iconPXJ(n));
    },
    generateBundle: { // sau jenny-noi-file (enforce pre) — plugin đó ghi đè cả trang nên phải chèn ở đây
      order: 'post',
      handler(_, bundle) {
        const a = bundle[trang['hoc-sinh']];
        if (!a || a.type !== 'asset') return;
        a.source = String(a.source).replace('</head>', `<link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="${MAU_NEN}"><link rel="apple-touch-icon" href="icons/jenny-192.png">\n</head>`);
      },
    },
    closeBundle: { // sau vite-plugin-pwa (cũng sequential) → sw.js đã có trong dist/
      sequential: true, order: 'post',
      handler() {
        const dist = path.join(goc, 'dist');
        for (const f of fs.readdirSync(BAN_RA)) if (/^(sw\.js|workbox-.*\.js|manifest\.webmanifest)$/.test(f)) fs.rmSync(path.join(BAN_RA, f));
        const ds = fs.readdirSync(dist).filter(f => /^(sw\.js|workbox-.*\.js|manifest\.webmanifest)$/.test(f)).concat(fs.readdirSync(path.join(dist, 'icons')).map(f => 'icons/' + f));
        for (const f of ds) { fs.mkdirSync(path.dirname(path.join(BAN_RA, f)), { recursive: true }); fs.copyFileSync(path.join(dist, f), path.join(BAN_RA, f)); }
        // file sinh ra không vào git: games/lop-hoc-ao/.gitignore tự sinh và tự ignore chính nó (như assets/.gitignore của noi-file.js)
        fs.writeFileSync(path.join(BAN_RA, '.gitignore'), '# P-16: file sinh ra khi build (vite-plugin-pwa + jennyPwa trong src/lop-hoc-ao/vite.config.js), không vào git\n.gitignore\nsw.js\nworkbox-*.js\nmanifest.webmanifest\nicons/\n');
        console.log(`[jenny-pwa] đã chép ${ds.join(', ')} sang games/lop-hoc-ao/`);
      },
    },
  };
}

export default defineConfig({
  root: goc,
  base,
  publicDir: 'public', // P-16: manifest.webmanifest + icons/ chép nguyên sang dist/ (trước đó false)
  plugins: [
    noiFile({ goc, repo, trang, base }),
    // P-16: service worker Workbox (generateSW). Đường dẫn trong sw.js tương đối với sw.js (không gắn base) nên cùng một bản chạy trên Pages,
    // máy chủ thử ở gốc kho (npm test) và dist/. Đăng ký SW + thanh "Có bản mới" tự viết ở js/core/34-khoi-dong.js (injectRegister false,
    // mã app không qua Rollup nên không import được virtual:pwa-register). Manifest giữ ở public/, không để plugin sinh (manifest false).
    VitePWA({
      registerType: 'prompt', injectRegister: false, manifest: false, filename: 'sw.js',
      workbox: {
        cacheId: CACHE_ID,
        // precache = "vỏ" trang học sinh: HTML, CSS chung, JS chung, manifest, icon. Trang cô/phụ huynh/quản lý/bản thử không precache (luôn lấy mạng).
        globPatterns: ['index.html', 'assets/lop-hoc-ao-*.css', 'assets/hoc-sinh-*.js', 'manifest.webmanifest', 'icons/*.png'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/\/giao-vien\//, /\/phu-huynh\//, /\/quan-ly\//, /\/demo\//, /\/giong-mau\//, /\.[a-z0-9]+$/i],
        // clientsClaim: lần cài ĐẦU, SW nhận điều khiển trang ngay (không chờ lần mở sau) để chunk khối import() sau đăng nhập đi qua SW và vào cache;
        // skipWaiting false: bản MỚI vẫn chờ tới khi em bấm "Tải lại" (34-khoi-dong.js gửi SKIP_WAITING).
        cleanupOutdatedCaches: true, skipWaiting: false, clientsClaim: true,
        runtimeCaching: [
          // KHÔNG cache Firebase: Firestore (dữ liệu, P-21 đã có bộ nhớ đệm bền riêng), đăng nhập, token. Ghi rõ NetworkOnly để không ai thêm nhầm.
          { urlPattern: /^https:\/\/(firestore|identitytoolkit|securetoken|firebaseinstallations|content-firebaseappcheck)\.googleapis\.com\//, handler: 'NetworkOnly' },
          { urlPattern: /^https:\/\/[^/]*\.(firebaseio|firebaseapp)\.com\//, handler: 'NetworkOnly' },
          // chunk khối content/lop-* (tên có hash → cache-first an toàn): tải khi em đăng nhập lần đầu, mất mạng vẫn mở được đảo của lớp mình
          { urlPattern: /\/assets\/lop-[0-9-]+-[^/]+\.js$/, handler: 'CacheFirst', options: { cacheName: CACHE_ID + '-khoi', expiration: { maxEntries: 12, maxAgeSeconds: 90 * 86400 } } },
          // chữ tự host (P-08) ở gốc kho /assets/fonts/ (ngoài phạm vi SW nhưng trang học sinh gọi nên SW vẫn thấy)
          { urlPattern: ({ url }) => url.origin === self.location.origin && /\/assets\/fonts\//.test(url.pathname), handler: 'CacheFirst', options: { cacheName: CACHE_ID + '-chu', expiration: { maxEntries: 60, maxAgeSeconds: 180 * 86400 } } },
          // SDK Firebase compat (phiên bản trong URL, có SRI): cần để mở app khi không có mạng
          { urlPattern: /^https:\/\/www\.gstatic\.com\/firebasejs\//, handler: 'CacheFirst', options: { cacheName: CACHE_ID + '-sdk', expiration: { maxEntries: 8, maxAgeSeconds: 180 * 86400 }, cacheableResponse: { statuses: [0, 200] } } },
        ],
      },
    }),
    jennyPwa(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: Object.fromEntries(Object.entries(trang).map(([ten, f]) => [ten, path.join(goc, f)])),
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        // P-15b: mỗi khối content/lop-*/index.js là một chunk điểm vào (noi-file.js emitFile) → assets/lop-N-[hash].js, tải bằng import().
        // Không dùng manualChunks: gom theo thư mục sẽ sinh thêm file "mặt tiền" rỗng. chunkKhoi giữ để đối chiếu tên chunk (tools/test/kich-co.mjs).
      },
    },
  },
  server: { port: 5173, strictPort: false },
});
