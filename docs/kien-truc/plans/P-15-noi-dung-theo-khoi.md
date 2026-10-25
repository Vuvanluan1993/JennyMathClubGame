# P-15 Nội dung theo khối, tải động

**Mục tiêu:** em lớp 1 chỉ tải nội dung lớp 1. Trang học sinh từ ~2,1 MB xuống dưới 700 KB lần đầu; nội dung lớp 6–9 không ship cho bản thật.
**Ước lượng:** 12 giờ. **Người dùng thấy gì:** mở nhanh hơn trên điện thoại. **Cần trước:** P-14 đã push.

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
