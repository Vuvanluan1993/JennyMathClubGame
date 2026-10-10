# Jenny LMS – bản thử

Thư mục riêng, không liên kết từ trang trò chơi chính.

## Cài một lần (5 phút)
1. Supabase → **SQL Editor** → New query → dán toàn bộ `setup.sql` → **Run**. Chạy lại nhiều lần cũng được.
2. Supabase → **Authentication → Sign In / Providers → Email**: khi thử nghiệm, tắt **Confirm email**.
   Nếu muốn giữ xác nhận email: vào **Authentication → URL Configuration**, đặt Site URL là `https://vuvanluan1993.github.io/JennyMathClubGame/lms-thu/app.html`.
3. Mở `lms-thu/app.html` → **Tạo tài khoản** → bấm **Nhận quyền quản trị hệ thống**. Chỉ người đầu tiên được nhận quyền này.

## Vai trò
| Vai trò | Làm được |
|---|---|
| Quản trị hệ thống | Tạo trung tâm, đặt số chỗ học sinh, tạo mã kích hoạt gói, soạn kho bài học chung, vào mọi trung tâm |
| Quản trị trung tâm | Mời/xoá giáo viên, tạo lớp, giao lớp cho giáo viên, chuyển/xoá học sinh, kho bài học riêng, nhập mã gói, xem nhật ký |
| Giáo viên | Lớp mình dạy: thêm học sinh, in thẻ, giao bài, lịch học online, điểm danh, kết quả, thông báo |
| Học sinh | Vào bằng mã lớp → chọn tên → mã bí mật (mầm non: 3 hình, lớp lớn: 4 số), làm bài, vào lớp online |

## Bảo vệ dữ liệu
- Mọi bảng bật Row Level Security và không có policy, nên trình duyệt không đọc thẳng được bảng. Trình duyệt chỉ gọi các hàm, và hàm tự kiểm tra quyền.
- Học sinh chỉ có tên gọi, không có ngày sinh, địa chỉ hay ảnh.
- Trang chỉ chứa khoá publishable (khoá công khai). Không đưa khoá secret / service_role vào mã nguồn.
- Trước khi dùng thật: cần phụ huynh đồng ý bằng văn bản và rà theo Luật Bảo vệ dữ liệu cá nhân 2025. Máy chủ ở nước ngoài thì phải lập hồ sơ chuyển dữ liệu ra nước ngoài.

## Game báo kết quả
Hành trình Mầm non nhận tham số `?lms=<mã bài>&isle=&lv=`. Khi học sinh làm xong màn, game gửi số sao và từng câu (kỹ năng, đúng ngay lần đầu, số lần thử, số giây) qua `sdk.js`. Không có tham số thì game chạy như cũ.
