# Lớp của tôi

Trang đầu của giáo viên (theme Classroom): thanh trên trắng, thanh demo (chỉ bản thử), tiêu đề `lms-h1` + dòng phụ, ô chọn tài khoản xem thử, khung mỗi khối chứa Thẻ lớp. Ghép từ: Thanh điều hướng (Classroom), Nhãn cảnh báo (thanh demo), Khung pixel (Classroom), Thẻ lớp, Nút nhỏ.

- Thẻ lớp xếp một cột ở 375px (hai cột từ ~560px), dải màu theo thứ tự lớp: 1A `blue`, 1B `px-leaf`.
- "Cần chú ý n" màu `lms-warn`; nhãn "Toán Jenny" `ok`.

## Khác biệt so với ảnh gốc 25/10 (`04-lop-cua-toi-375.png`)

1. Ảnh gốc: thanh trên có sprite Jenny 34px ở góc trái thay cho tên app; mẫu giữ sprite (ô PXS), không hiện chữ "Lớp học ảo Jenny" (giống ảnh).
2. Ảnh gốc: thanh demo xếp 2 hàng (Ngày 240 · Mở khoá / Sang ngày mới · Làm lại demo); mẫu để các nút tự xuống dòng.
3. Nút thanh demo trong ảnh gốc cao ~36px, viền; mẫu dùng Nút nhỏ Classroom 32px (đúng mã `btn.sm`) — khác 4px, chờ thầy chốt cỡ.
4. Ảnh gốc ô chọn tài khoản bo 8px, chữ 15; mẫu ô nhập Classroom bo 4px — đề xuất thống nhất 4px cho mọi ô nhập.
Không đổi: dải màu thẻ, chữ trong thẻ, dòng chú thích cuối.
