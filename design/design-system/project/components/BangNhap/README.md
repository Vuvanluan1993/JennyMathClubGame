# Bảng nhập

Bảng nhập mở khi bấm "Thêm…"/"Sửa…" (LUAT §6j: thêm lớp, học sinh, giáo viên bằng nút → bảng nhập, không để ô nhập dài trên trang). Tiêu đề **dính trên**, nút **dính đáy**, phần ô nhập ở giữa cuộn được.

- **Cấu trúc**: `.hd` (tên bảng + nút Đóng ✕) · `.bd` (nhãn trên ô, thứ tự nhãn → ô, lưới một cột) · `.ft` (Huỷ bên trái, nút chính bên phải).
- **Ô nhập**: Pixel `frame-2` khuyết góc, nền `app-surface-2`, chữ 17px, cao ≥ 48; Classroom viền 1px, bo 4px, cao 40, khi chọn viền `lms-pri`.
- **Cỡ**: rộng `min(440px, 100%)`; bảng Excel rộng 980px. Cao tối đa = màn hình trừ 32px; trên điện thoại chiếm gần hết màn.
- **Trạng thái**: ô lỗi viền `-bad` + dòng chữ đỏ dưới ô; nút chính tắt khi thiếu ô bắt buộc.
- **Nên**: mỗi bảng một việc; chữ nút = việc ("Lưu", "Đưa vào lớp"). **Không**: hỏi hơn 7 ô một lần; dùng `prompt()` của trình duyệt.
