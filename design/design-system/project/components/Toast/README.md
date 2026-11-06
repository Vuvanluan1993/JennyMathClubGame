# Toast

Một dòng báo kết quả ngay sau một thao tác, tự tắt sau 2,8 giây, không cần bấm; không bao giờ dùng để hỏi.

- **Vị trí**: giữa đáy màn, cách đáy 20px + safe-area; rộng tối đa màn trừ 32px; một toast một lúc (toast mới thay toast cũ).
- **Pixel**: nền `app-ink`, chữ `white` 14.5/600, bo theo `radius-pixel` (mã hiện tại còn bo 14px — chờ thầy duyệt đổi về 0). **Classroom**: nền #323232, chữ trắng 400, bo 4px, bóng mềm.
- **Chữ**: bắt đầu bằng "Đã …" khi xong việc; câu nhắc nhẹ cho học sinh có "nhé".
- **Không**: toast có nút; nhiều hơn một dòng rưỡi; báo lỗi cần người dùng sửa (dùng dòng đỏ dưới ô nhập hoặc Hộp thoại).
