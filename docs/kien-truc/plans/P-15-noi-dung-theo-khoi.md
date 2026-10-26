# P-15 Nội dung theo khối, tải động

**Mục tiêu:** em lớp 1 chỉ tải nội dung lớp 1. Trang học sinh từ ~2,1 MB xuống dưới 700 KB lần đầu; nội dung lớp 6–9 không ship cho bản thật.
**Ước lượng:** 12 giờ. **Người dùng thấy gì:** mở nhanh hơn trên điện thoại. **Cần trước:** P-14 đã push.

⟳ 26/10 (RF3, nhánh `claude/noi-dung-theo-khoi-52a610`, PR vào `tich-hop/kien-truc-2026-10`): **P-15a xong** — `js/content/**` (26 file) → `src/lop-hoc-ao/content/lop-1` … `lop-5`, `lop-6-9`
(32 file; mỗi thư mục `index.js` `export function dangKy(reg)`, `reg` = `{PRIM, P1BY, ALLP1, P2, LES, MG, MGT, addTopic}` từ `js/core/30a-dang-ky-khoi.js`). Helper dùng ≥ 2 lớp (52 tên) và
bộ máy tiểu học (44 tên core dùng) → `js/core/30b–30f`, khung bài giảng → `js/core/30-bai-giang-jenny.js`; bộ câu chỉ một lớp dùng ở `content/lop-N/10-hk1.js`. `MG` (chủ đề 1) rời `core/31`.
Dựng: `noi-file.js` gói mỗi thư mục khối thành một phạm vi hàm, gọi `dangKyKhoi('lop-N', {dangKy})` **tại chỗ cũ** (vẫn tĩnh, một script); `vite.config.js` có `manualChunks: chunkKhoi` (chưa sinh chunk).
Dữ liệu đăng ký so với trước (Math.random cố định): `PRIM` (804 đảo), `P1BY`, `ALLP1`, `P2`, `MG`, `MGT` giống hệt; `LES` 345 bài cùng khoá, 6 slide khác chỉ ở toạ độ hình vẽ ngẫu nhiên.
Gzip trang học sinh 670 → 685 KB (tách khối làm gzip ít gộp chữ giữa các lớp); core 437 KB, mỗi khối 18–50 KB → P-15b ước 489–515 KB.
**Cho P-15b (RF4):** đổi dòng `/*@include content/lop-N/index.js*/` thành `dangKyKhoi(k, await import(…))`; bốn chỗ core đọc nội dung **lúc nạp** phải chạy lại sau mỗi lần đăng ký khối
(gợi ý `hooks.khi('khoi:sau', g => …)` trong `dangKyKhoi`): `core/21` `HINT6` (P1BY[6]), `core/33d` đổi `PRIM[g].boss`, `core/45` và `core/48` bọc hàm sinh câu trong `PRIM[g].isl`.
Chunk ES cho `import()`: transform bỏ dòng import từ `js/core` trong `content/**` (tên core là toàn cục của script chung) rồi để Rollup tách theo `chunkKhoi`.

## File sửa
- Di chuyển: `src/lop-hoc-ao/js/content/hk1/*`, `hk2/*`, `lessons/*` → `src/lop-hoc-ao/content/lop-1/index.js` … `lop-5/index.js`, `lop-6-9/index.js` (mỗi thư mục `export function dangKy(reg)` gọi `addTopic`, `LES[g]`, `MG/MGT`).
- `js/core/30-bai-giang-jenny…js`, `34-khoi-dong.js`: sau đăng nhập biết khối → `await import(`../content/lop-${g}/index.js`)` rồi `render()`; màn chờ pixel "Jenny đang chuẩn bị bài…".
- `vite.config.js`: `manualChunks` theo thư mục `content/lop-*`.
- Bản QL/GV/PH: tải khối theo lớp đang xem (`import()` khi mở lớp), hoặc tất cả khi in báo cáo.
- Test: `tools/test/kich-co.mjs` — fail nếu `hoc-sinh.html` + chunk bắt buộc > 700 KB gzip hoặc chunk `lop-6-9` có trong bản học sinh thật.

## Việc phải xong (DONE)
1. Lighthouse mobile trang học sinh: LCP < 2,5 s trên 4G giả lập; tổng tải lần đầu < 700 KB gzip.
2. 7 kiểm tra §7 ĐẠT cho lớp 1–5 (chạy với `import()` thật).
3. Đổi lớp (lên lớp) tải chunk mới không cần tải lại trang.

## Bẫy
- Hàm sinh câu của khối sau dùng helper khối trước (`frogQ`, `ktPrev` lấy 4 đảo trước): helper chung ở `core`, chỉ **dữ liệu/đăng ký** vào `content/lop-*`.
- `kiem-tra.js` chờ `PRIM[g]` sẵn: thêm `await window.__ready(g)`.
