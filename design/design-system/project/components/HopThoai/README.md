# Hộp thoại

Hộp thoại thay cho `prompt()`, `confirm()`, `alert()` của trình duyệt (P-05 đã bỏ `prompt()`): hỏi lại trước việc khó hoàn tác, hỏi mật khẩu, báo một điều phải đọc.

- **Cấu trúc** (chung với Bảng nhập, cùng lớp `.jc-modal`): đầu `.hd` có tiêu đề là câu hỏi ("Bỏ khỏi lớp?") + nút ✕ · thân `.bd` một đoạn, tên người/lớp in đậm · chân `.ft` ≤ 2 nút, nút nguy hiểm bên phải và là `danger`, nút an toàn bên trái.
- **Pixel**: viền 3px `px-frame`, bóng cứng 5px, đầu navy chữ VT323 22 trắng, nút ✕ vàng. **Classroom**: bo 8, bóng mềm sâu, đầu trắng 18/500, ✕ xám.
- **Nền mờ**: `rgba(19,38,58,.45)` phủ cả màn; hộp rộng `min(380–440px, 100%)`, luôn cách mép ≥ 16px; z-index trên cổng đăng nhập (10050 > 9999).
- **Cỡ chạm**: nút ≥ 48 (Pixel), ✕ ≥ 44×36. Bàn phím: Esc = nút an toàn; Enter = nút chính chỉ khi không nguy hiểm.
- **Không**: hộp thoại lồng hộp thoại; hơn hai nút; câu hỏi phủ định ("Không bỏ chứ?").
