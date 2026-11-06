# P-05 Firebase Auth cứng hơn

**Mục tiêu:** đóng LH-H3 (mật khẩu mặc định) và giảm LH-C1 (tự đăng ký) trong khi vẫn ở gói Spark.
**Ước lượng:** 5 giờ. **Người dùng thấy gì:** lần đầu đăng nhập phải đổi mật khẩu; phiếu đăng nhập in mật khẩu ngẫu nhiên. **Cần trước:** P-04 đã push (cùng file `62`).

## File sửa
- `src/lop-hoc-ao/js/core/62-may-chu.js`: khởi tạo App Check (reCAPTCHA v3, khoá site trong `FB_CFG`), cờ `mustChange` trong `users/{uid}` → sau `fbNapMe` nếu `mustChange` thì bắt đổi mật khẩu (dùng hộp thoại pixel thay `prompt()` ở `:30,135`).
- `src/lop-hoc-ao/js/core/75-nhap-excel.js:8`, `77-phu-huynh-tu-dong.js:7`: `MK0` → `fbMKGoiY()` (đã có ở `62:134`), ghi `mustChange:true`; mật khẩu chỉ hiện ở phiếu in trong phiên (đúng LUAT §6j), xoá `window.qlMK` khi đăng xuất.
- `src/lop-hoc-ao/firebase/firestore.rules`: `users` update bởi chính chủ **chỉ** trường `mustChange` → false.
- Mới: `src/lop-hoc-ao/docs/FIREBASE-CONSOLE.md` — danh sách nút thầy bật.
- ⟳ 25/10 (nhận từ P-07): `62-may-chu.js:29` `fbDangXuat` xoá `jennyHSc_*`, `jennyVirtualDemo_v10` khỏi `localStorage` và `window.qlMK`.

## Việc thầy làm (E) — ghi trong FIREBASE-CONSOLE.md
1. Authentication › Settings › **Email enumeration protection: bật**.
2. Authentication › Settings › Password policy: tối thiểu 8, có chữ và số.
3. App Check › đăng ký web app với reCAPTCHA v3, **Enforce** cho Firestore sau 1 tuần theo dõi.
4. Authentication › Sign-in method: giữ Email/Password (QL tạo tài khoản bằng phiên phụ cần nó); **không** bật đăng ký ẩn danh.

## Việc phải xong (DONE)
1. Tạo học sinh mới (nút Thêm và Excel) → mật khẩu ngẫu nhiên 8 kí tự dễ đọc, in trên phiếu, không còn `jenny123` trong mã (`grep -rn jenny123 src/lop-hoc-ao/js` = 0; chỉ còn trong `_student.py` cho bản demo, P-07 xử lý).
2. Đăng nhập lần đầu bắt đổi mật khẩu; đổi xong vào bình thường; `node tools/test/dong-bo.js` ĐẠT.
3. App Check chạy ở chế độ theo dõi, console không báo lỗi token.

## Bẫy
- Tài khoản đã có mật khẩu `jenny123`: thêm nút QL "Đặt lại mật khẩu ngẫu nhiên cho cả lớp" (dùng `fbDatLaiMK` có sẵn `62:139`) thay vì tự đổi hàng loạt.
- App Check sai khoá site làm **mọi** đọc/ghi Firestore hỏng khi Enforce: chỉ Enforce sau khi thầy xác nhận.
