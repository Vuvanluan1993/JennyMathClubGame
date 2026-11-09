# Nhãn cảnh báo

Nhãn ngắn (1–4 từ) báo trạng thái, và dòng ⚠ báo việc cần làm. Màu luôn đi kèm từ hoặc kí hiệu (⚠ ✓ ✕) để không ai phải đoán theo màu.

- **Pill**: mặc định (chữ phụ trên `surface-2`) · `ok` (`-ok` / `-ok-soft`) · `warn` (`-warn` / `-warn-soft`) · `bad` (`-bad` / `-bad-soft`). Pixel góc vuông, viền 1px khi mặc định; Classroom viên bo 16, 13/500.
- **Dòng ⚠** (`jc-qlw`, 13.5px `-warn`) và **✓ Đủ** (`jc-qlok`): trong ô Quản lý và thẻ lớp. **Hàng cảnh báo** (`jc-al`): vạch trái 3px `-warn`/`-bad`, gạch dưới mảnh. **Thanh demo** (`jc-demobar`): nền `lms-warn-soft`, chỉ ở bản demo.
- **Cặp chờ thầy**: `px-leaf`/`px-leaf-soft` 3,23:1 và `lms-warn`/`lms-warn-soft` 4,34:1 dưới 4,5 — giữ đúng mã, ghi trong usage.
- **Cỡ**: cao 24–28px, không phải nút; nếu bấm được thì là Nút nhỏ. **Không**: nhãn dài hơn 4 từ; hơn 2 nhãn cạnh nhau.
