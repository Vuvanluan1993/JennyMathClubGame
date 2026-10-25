# Ô Quản lý

Bốn nút lớn của trang chính Quản lý (LUAT §6j, 24/10): 🎒 Học sinh · 👪 Phụ huynh · 👩‍🏫 Giáo viên · 🏫 Lớp, mỗi ô có **số** và **cảnh báo** (em chưa xếp lớp, em chưa có phụ huynh, giáo viên chưa có lớp, lớp chưa có giáo viên). Chỉ có ở theme Classroom.

- **Cấu trúc**: dải màu đầu ô 76px (chữ trắng 22/500, màu luân phiên như Thẻ lớp) · biểu tượng tròn trắng 56px đè lên mép dải · số lớn `n` 28/600 · dòng ⚠ `jc-qlw` hoặc ✓ `jc-qlok` · chân "Mở ▸" (`lms-pri`, gạch trên `lms-line-2`).
- **Lưới**: 2 cột từ 320px (`minmax(min(200px,44%),1fr)`), khe 12px; ô cao ≥ 170px (140 trên điện thoại). Cả ô là nút; rê: bóng nhẹ; tiêu điểm: viền `lms-pri`.
- **Dưới 4 ô**: hai nút nhỏ Nhật ký thao tác, Năm học · Lên lớp (Nút Classroom thường).
- **Không**: thêm ô thứ 5; đặt nhiều hơn một dòng cảnh báo trong ô (gộp thành "n việc cần làm").
