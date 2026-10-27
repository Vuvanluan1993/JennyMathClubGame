# P-22 Blaze 0 đồng + Cloud Functions (chỉ khi Q5 = Blaze)

**Bỏ 26/10/2026 (Q5 = A, giữ Spark):** không làm. Giữ file để xem lại khi có tên thật và thấy gian lận xu.

**Mục tiêu:** chặn hẳn gian lận xu và tự đăng ký bằng hàm chạy ở máy chủ Firebase; tạo tài khoản không cần phiên phụ ở trình duyệt; sao lưu Firestore theo lịch của Google. Vẫn dùng Firebase, không đổi máy chủ.
**Ước lượng:** 14 giờ = 2 phiên (FB7 hàm + rules; FB8 app gọi hàm + chuyển đổi). **Người dùng thấy gì:** không. **Cần trước:** P-21 đã push; thầy nâng gói Blaze và đặt cảnh báo ngân sách.

## Sự thật về Blaze (để thầy quyết Q5)
| Điều | Spark | Blaze |
|---|---|---|
| Cloud Functions | không | có (cần thẻ; hạn miễn phí 2 triệu lần gọi/tháng) |
| Firestore hạn miễn phí 50 000 đọc, 20 000 ghi/ngày | có | **vẫn có**, vượt mới tính tiền (0,06 USD/100 000 đọc) |
| Sao lưu Firestore theo lịch, khôi phục theo thời điểm | không | có (tính theo GB, CLB dưới 1 GB ≈ 0,1 USD/tháng) |
| Chặn tự đăng ký bằng blocking function | không | có (Identity Platform, miễn phí tới 50 000 người dùng/tháng) |
| Cảnh báo ngân sách | — | đặt 1 USD/tháng ở Google Cloud Billing; **cảnh báo không tự tắt dự án**, cần hàm `tatKhiVuot` (dưới) |

Ở quy mô 1 lớp × 12 em: ước ≈ 0 đồng/tháng. Rủi ro: bot gọi hàm hàng loạt → App Check **Enforce** (P-05 đã bật theo dõi) chặn trước khi tính tiền.

## FB7 — hàm (`src/lop-hoc-ao/firebase/functions/`, Node 20, 2nd gen, vùng asia-southeast1)
- `taoTaiKhoan(role, tk, ten, lop)` (callable, chỉ QL): tạo user Auth email ẩn, `users/{uid}`, `hs/{tk}`, `vi/{tk}`; trả mật khẩu một lần. Thay phiên phụ `fbTaoTK` ở `62`.
- `chamXu(k, ref, payload)` (callable, HS): tính xu theo LUAT §6 ở máy chủ (`man`, `tl`, `bvn`, `game` có trần/ván 20), ghi `vi` + `ev` trong transaction. Rules: **HS không còn ghi `vi`** (chỉ hàm).
- `muaDo(loai, id)`: trừ đúng giá `cfg/shop`.
- `xoaHocSinh(tk)` (chỉ QL, có XOA): xuất JSON trước (P-09b) rồi xoá Auth + mọi document của em.
- `beforeUserCreated` (blocking): từ chối mọi tạo user không do `taoTaiKhoan` gọi (đóng hẳn LH-C1).
- `saoLuuHangNgay` (schedule 20:00 UTC): `firestore.export` sang bucket riêng, giữ 30 bản; bổ sung cho P-10 (P-10 vẫn chạy để có bản ngoài Google).
- `tatKhiVuot` (Pub/Sub từ Billing budget): vượt 100% ngân sách → gỡ billing khỏi dự án (dự án về Spark, app vẫn chạy phần không cần hàm).
- `tools/test/functions.test.mjs` trên emulator: 12 ca luật xu + 3 ca tạo tài khoản.

## FB8 — app gọi hàm
- `64-xu.js`: `xuCong`/`xuMua` gọi `httpsCallable` thay ghi trực tiếp; giữ nhánh cũ sau cờ `FB.cf = false` để quay về P-20 trong 30 ngày.
- `62-may-chu.js`: `fbQLTaoHS`, `fbTaoGV`, `fbTaoPH` gọi `taoTaiKhoan`; bỏ `fbTaoTK` và `login/{tk}`.
- `78-xoa-hoc-sinh.js`: gọi `xoaHocSinh`.
- `firestore.rules`: `vi` HS chỉ đọc; `ev` HS chỉ đọc; `users` create chỉ QL. `rules.test.mjs` sửa 6 ca.
- `docs/FIREBASE-CONSOLE.md`: mục Blaze: nâng gói, ngân sách 1 USD, bật Identity Platform, `firebase deploy --only functions`.

## Việc phải xong (DONE)
1. Console `S.st[sid].coins=1e6;save()` và `db.doc('vi/x').update(...)` đều bị từ chối; chỉ `chamXu` đổi xu (test emulator).
2. Tạo user bằng REST signUp với API key công khai → bị `beforeUserCreated` từ chối.
3. Tạo 1 học sinh từ trang QL không mở phiên phụ; mật khẩu hiện trên phiếu in.
4. `firestore.export` chạy thử một lần trên dự án thật; khôi phục vào emulator đủ document.
5. Ngân sách 1 USD có trong Billing; `tatKhiVuot` chạy thử bằng tin Pub/Sub giả.
6. `npm test` in 0; `functions.test.mjs`, `rules.test.mjs` ĐẠT; 7 kiểm tra §7 ĐẠT.

## Bẫy
- Hàm 2nd gen lần đầu deploy cần bật Cloud Build, Artifact Registry, Eventarc: thầy bấm theo liên kết trong lỗi; ghi vào FIREBASE-CONSOLE.
- Callable từ GitHub Pages cần CORS: dùng `onCall` (tự xử lý), không `onRequest`.
- `tatKhiVuot` cần quyền `billing.projectManager` cho service account của hàm; thử trước khi tin.
- Giữ P-20 rules làm lớp phòng thủ thứ hai cho tới khi hàm chạy ổn 30 ngày.
