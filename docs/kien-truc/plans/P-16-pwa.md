# P-16 PWA ngoại tuyến

**Mục tiêu:** cài lên màn hình điện thoại; chơi khi mất mạng; có nút "Có bản mới". Đóng T-11 trong `TASKS.md`.
**Ước lượng:** 6 giờ. **Người dùng thấy gì:** biểu tượng Jenny trên màn hình; chạy khi không có mạng. **Cần trước:** P-14 đã push (tên file có hash).

## File sửa
- Mới: `src/lop-hoc-ao/public/manifest.webmanifest` (tên, màu `#1F2A5A`, icon pixel 192/512 từ `PXJ`), icon trong `public/icons/`.
- `vite.config.js`: `vite-plugin-pwa` (Workbox, `registerType: 'prompt'`), precache shell + chunk khối của em (runtime cache `content/lop-*`), **không** cache yêu cầu Firebase/Supabase.
- `js/core/34-khoi-dong.js`: khi SW báo bản mới → thanh pixel "Có bản mới · Tải lại"; dùng `79-dong-bo.js` hàng đợi khi mất mạng.
- Trang chủ `index.html` + game lẻ: manifest riêng nhỏ (chỉ cài được, cache tĩnh) — làm ở P-19.

## Việc phải xong (DONE)
1. Lighthouse PWA: installable; tắt mạng sau khi mở 1 đảo → vẫn học được, lưu `answers_pending`, nối mạng gửi hết.
2. Đẩy bản mới → trong 1 phút thiết bị đang mở hiện "Có bản mới".
3. 7 kiểm tra §7 ĐẠT.

## Bẫy
- SW cache nhầm trang đăng nhập cũ sau khi đổi máy chủ: `navigateFallbackDenylist` cho `/giao-vien/`… và bump `cacheId` khi đổi `MAY_CHU`.
- Dung lượng cache mỗi khối ~300 KB; iOS giới hạn ~50 MB — ổn.
