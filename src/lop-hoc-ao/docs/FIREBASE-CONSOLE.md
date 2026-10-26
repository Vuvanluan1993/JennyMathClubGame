# Việc thầy bật trên Firebase console (dự án `jenny-lop-hoc-ao`)

Danh sách này đi kèm P-04 (rules) và P-05 (Auth) của kế hoạch kiến trúc 25/10/2026. Mỗi mục một lần, mất khoảng 10 phút.
Trang console: https://console.firebase.google.com/project/jenny-lop-hoc-ao

## 1. Dán quy tắc Firestore (mỗi khi `firebase/firestore.rules` đổi)
1. Firestore Database › **Rules**.
2. Xoá hết, dán nguyên nội dung file `src/lop-hoc-ao/firebase/firestore.rules` trên `main`, bấm **Publish**.
3. Collection `login`: nếu trống thì xoá (chỉ có bản ghi khi quản lý đã bấm "Đặt lại mật khẩu").
4. Thử nhanh: đăng nhập app học sinh bằng tài khoản thử → vẫn lưu được ("Đã lưu lên máy chủ" ở trang cô).

## 2. Authentication › Settings
| Mục | Đặt | Vì sao |
|---|---|---|
| **User actions › Email enumeration protection** | **Bật** | Người lạ không dò được tên đăng nhập nào có thật (lỗi sai mật khẩu và không có tài khoản trả về giống nhau). App đã xử lý mã lỗi `auth/invalid-credential`. |
| **Password policy** | Bật, **tối thiểu 8 kí tự**, bắt buộc **có chữ** và **có số**; chọn "Require enforcement" cho tài khoản mới | Khớp với kiểm tra trong app (`fbMKLoi`): mật khẩu tạm ngẫu nhiên 8 kí tự dạng `kuta5831`. Tài khoản cũ `jenny123` vẫn đăng nhập được cho tới khi đổi. |
| **Sign-in method** | Giữ **Email/Password**. **Không** bật Anonymous, Google hay nhà cung cấp khác | Quản lý tạo tài khoản bằng một phiên phụ nên vẫn cần Email/Password; đăng ký ẩn danh sẽ cho người lạ qua `hasMe()` nếu có lỗi khác. |
| **User account management › Create (sign-up)** | Nếu console có mục "Disable sign-up for new users" (Identity Platform) thì **chưa bật** | App tạo tài khoản học sinh bằng `createUserWithEmailAndPassword` từ trình duyệt quản lý; bật mục này sẽ hỏng nút Thêm/Excel. Việc chặn người lạ đã do rules P-04 (không có hồ sơ `users` thì không đọc được gì). |

## 3. App Check (chống gọi Firestore từ ngoài app) — chế độ theo dõi
1. **App Check › Apps** › chọn web app `jenny-lop-hoc-ao` › **reCAPTCHA v3** › Register. Lấy **site key** (khoá công khai, dạng `6Lc…`).
2. Dán site key vào `src/lop-hoc-ao/js/core/62-may-chu.js` ở `FB_CFG.appCheckKey:""` (giữa hai dấu nháy), build, đưa lên `main`.
   App chỉ **khởi tạo** App Check khi ô này khác rỗng; trống thì bỏ qua, không lỗi.
3. **App Check › APIs › Cloud Firestore**: để **Unenforced** (theo dõi). Xem biểu đồ "Verified / Unverified" một tuần.
4. Chỉ bấm **Enforce** khi biểu đồ gần 100% Verified **và** thầy xác nhận. **Bẫy:** Enforce với sai site key làm **mọi** đọc/ghi Firestore hỏng cho mọi người — nếu lỡ, bấm Unenforce ngay.
5. reCAPTCHA v3 cần tên miền `vuvanluan1993.github.io` trong danh sách domain của khoá (Google reCAPTCHA admin › Settings › Domains).

## 4. Sau khi bật xong
- Đăng nhập trang Quản lý, mở một lớp, bấm **🔑 Đặt lại mật khẩu cả lớp** cho các em đang dùng `jenny123`: app tạo mật khẩu tạm ngẫu nhiên, mở phiếu in; lần đăng nhập sau em phải tự đặt mật khẩu mới.
- Mật khẩu tạm chỉ hiện trên phiếu in (học sinh, phụ huynh) và mục "Tài khoản" của Quản lý trong phiên đang mở; đăng xuất là mất. Không có cách xem lại — quên thì đặt lại lần nữa.
- Chưa có: thư đặt lại mật khẩu (email ẩn không nhận thư) — đặt lại luôn qua Quản lý.

## 5. Đặt cảnh báo 80% hạn đọc Firestore (P-21, 26/10/2026)
Gói Spark cho **50 000 đọc, 20 000 ghi, 20 000 xoá mỗi ngày**; quá hạn thì app báo "Chưa lưu được" tới nửa đêm (giờ Thái Bình Dương).
Firebase không gửi thư khi gần hạn, nên đặt một cảnh báo ở Google Cloud Monitoring (miễn phí) để nhận thư ở mức **40 000 đọc/ngày (80%)**:
1. Mở https://console.cloud.google.com/monitoring/alerting?project=jenny-lop-hoc-ao › **Create policy**.
2. **Select a metric** › gõ `Firestore` › chọn **Cloud Firestore › Document reads** (`firestore.googleapis.com/document/read_count`). Nếu chưa thấy, bỏ chọn "Show only active resources & metrics".
3. Rolling window **1 day**, function **sum**; Across time series: **sum**. Condition: **Threshold › Above › 40000**. Đặt tên "Firestore đọc 80% hạn ngày".
4. **Notification channels** › Manage › thêm email của thầy; bật **Notify on incident closure**. Save.
5. Làm lần hai cho **Document writes** (`document/write_count`) ngưỡng **16000**.
Xem số đọc hôm nay bất cứ lúc nào: Firebase › Firestore Database › **Usage** (biểu đồ Reads/Writes theo ngày).

Ước lượng đọc mỗi ngày (sau P-21, bộ nhớ đệm bền đã bật nên lần mở sau chỉ tốn đọc cho tài liệu **đổi**):
| Ai | Lần mở đầu trên máy | Lần mở sau | 20 phút học/dạy |
|---|---|---|---|
| Học sinh | ~8 (users, org/main, hs, lop, vi, cfg/shop, hsgv, asg) | 2–4 | +1 mỗi lần cô mở đảo/giao bài, +1 mỗi lần ví được máy chủ xác nhận |
| Cô, lớp 12 em | ~3·12 + 6 ≈ 42 (hs, vi, hsgv từng em + org, gv, lop, hsdm, asg, nk) | chỉ em có bài mới (~1–3/em) | +1 mỗi lần em lưu bài |
| 100 em + 5 cô/ngày | ≈ 1 000 ngày đầu | ≈ 400–800 | — |
Số thật của một phiên: DevTools › Application › Local Storage › `jennyDem` (`doc` = đọc máy chủ, `cache` = từ đệm, `ghi`, `nghe` = listener đang mở); đăng xuất thì in ra Console.

## 6. Dự án thử `jenny-lop-hoc-ao-thu` (Q6, kế hoạch kiến trúc)
Nhánh tích hợp `tich-hop/kien-truc-2026-10` được thử trên dự án riêng này; dự án thật `jenny-lop-hoc-ao` giữ nguyên tới khi gộp vào `main`.
1. Tạo dự án Spark, Firestore vùng `asia-southeast1`, Authentication › Email/Password, tắt Analytics.
2. Dán `firebase/firestore.rules` của nhánh tích hợp (mục 1), tạo chỉ mục theo `firebase/firestore.indexes.json`: `d` (`k` tăng, `t` giảm), `asg` (`lop` tăng, `t` giảm), và `t` của `d` phạm vi Collection group (hoặc `firebase deploy --only firestore:indexes --project jenny-lop-hoc-ao-thu`).
3. Làm mục 2 (Authentication) như dự án thật; App Check (mục 3) không cần ở dự án thử.
4. Cấu hình web (Project settings › Your apps › Web) đưa vào khối `thu` của `firebase/cau-hinh.json` khi công tắc `FB_ENV` có (goal riêng của P-21); bản dựng `FB_ENV=thu` hiện dải "Bản thử".
5. Thử ngoại tuyến: mở trang học sinh lần hai, DevTools › Network › Offline, làm 1 bài, bật mạng → `vi/{tk}` và `ev/{tk}/d` lên đúng.
