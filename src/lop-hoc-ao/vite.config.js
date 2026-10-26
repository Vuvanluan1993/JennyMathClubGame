// Vite cho Lớp học ảo (P-14a, 25/10/2026): bọc mã cũ, không đổi 90 file JS.
//   npm run build   (= vite build src/lop-hoc-ao) → dist/ (tên file có hash) + chép 4 trang thật + 4 trang thử sang games/lop-hoc-ao/
//   npm run dev     (= vite src/lop-hoc-ao)       → http://localhost:5173/JennyMathClubGame/games/lop-hoc-ao/
// Cách nối file và tách CSS/JS: tools/vite/noi-file.js. Trang theo vai: tools/vite/vai.js. Xem docs/KIEN-TRUC.md mục "Dựng bản".
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
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

export default defineConfig({
  root: goc,
  base,
  publicDir: false,
  plugins: [noiFile({ goc, repo, trang, base })],
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
