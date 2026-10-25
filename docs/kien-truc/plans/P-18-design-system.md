# P-18 Design system trong Claude Design (chỉ khi Q4 = có)

**Mục tiêu:** một design system "Jenny" với 2 theme (Pixel cho học sinh và game, Classroom cho GV/PH/QL) làm nguồn cho `design/tokens.json`; thầy duyệt một lần, mọi màn hình mới vẽ từ đó.
**Ước lượng:** 6 giờ (3 giờ dựng, 3 giờ duyệt và chỉnh). **Người dùng thấy gì:** không trực tiếp; màn hình mới nhất quán hơn. **Cần trước:** P-03 đã push (token nền).

## Việc
1. Trong Claude (Code tab, công cụ Artifact → kiểu "Design System"): tạo từ `design/tokens.json` của P-03; trang: Màu (25 màu logo + vai trò: nền, chữ, nhấn, nguy hiểm, đúng/sai), Chữ (VT323, Be Vietnam Pro, Lexend, Baloo 2, Nunito; thang 12–34), Khoảng cách & cỡ chạm, Khung pixel và bóng cứng, Bo góc theo theme.
2. Thành phần: Nút (chính/phụ/nguy hiểm/đã tắt), Ô phương án (1–2–3 cột tự co), Khung pixel, Thẻ lớp (dải màu đầu thẻ), Bảng nhập có tiêu đề dính và nút dính đáy, Toast, Hộp thoại (thay `prompt()`), Thanh trên (học sinh pixel · LMS trắng), Huy hiệu mức (Mới bắt đầu → Vững), Thẻ chào, Nhãn cảnh báo. Mỗi thành phần: trạng thái, cỡ chạm, ví dụ tiếng Việt thật.
3. Mẫu trang: Bản đồ, Màn chơi, Phòng học, Lớp của tôi, Quản lý 4 nút, Đăng nhập — vẽ **từ thành phần**, so với ảnh chụp hiện tại; chỉ ghi khác biệt, không đổi luật đã chốt.
4. Đồng bộ ngược: xuất token → `design/tokens.json` (so `git diff`), tài liệu `design/README.md` (liên kết design system, cách thêm thành phần, quy tắc "màn mới phải dùng thành phần").
5. Thầy duyệt ảnh mẫu (theo LUAT §1: tính năng hình ảnh mới gửi ảnh mẫu trước).

## Việc phải xong (DONE)
1. Design system có liên kết trong `design/README.md`, 5 trang token + 12 thành phần + 6 mẫu trang.
2. `design/tokens.json` xuất từ design system bằng JSON đang dùng (khác 0 giá trị, hoặc liệt kê thay đổi đã được thầy duyệt).
3. `LUAT-DA-CHOT.md §2` thêm một dòng: "Màn hình mới vẽ từ design system Jenny; token ở `design/tokens.json`".

## Bẫy
- Không vẽ nhân vật có bản quyền; sprite pixel tự vẽ (`PXS`) là tài sản của app, chỉ tham chiếu.
- Hai theme khác họ chữ và bo góc; **không** khác bảng màu (một thương hiệu).
