# DANH MỤC DỮ LIỆU CÁ NHÂN — LỚP HỌC ẢO JENNY

> **Bản nháp, chờ thầy duyệt** (25/10/2026). Lấy từ mã nguồn ngày 25/10/2026: `js/core/70-sua-hoc-sinh.js` (bảng Sửa học sinh), `75-nhap-excel.js` (cột Excel), `77-phu-huynh-tu-dong.js` (tài khoản phụ huynh), `62-may-chu.js` (bộ sưu tập Firestore). Khi đổi trường dữ liệu trong mã, cập nhật bảng này.

Ký hiệu nơi lưu: **FS** = Firestore (Singapore, `asia-southeast1`) · **Auth** = Firebase Authentication (Google, toàn cầu) · **Máy** = trình duyệt trên máy người dùng (`localStorage`/`sessionStorage`) · **Giấy** = phiếu giấy tại Clb.

## 1. Học sinh

| Trường | Nguồn | Mục đích | Nơi lưu | Thời hạn | Ai xem |
|---|---|---|---|---|---|
| Họ và tên (`ten`, `st.name`) | Quản lý nhập (bảng Thêm/Sửa, hoặc cột "Họ và đệm", "Tên" trong Excel) | Gọi tên em, hiện trong trang cô và phụ huynh | FS `users/{uid}.ten`, `org/main.j` (danh sách), `hs/{tk}.j` | Thời gian học + 24 tháng | Em, cô lớp mình, phụ huynh của em, quản lý |
| Tên đăng nhập (`tk`) | Quản lý đặt hoặc app tự gợi ý | Đăng nhập; khoá tài liệu | FS `users/{uid}.tk`, `login/{tk}`; Auth (email ẩn `tk@jenny-lop-hoc-ao.firebaseapp.com`) | Như trên | Em, cô, phụ huynh, quản lý |
| Mật khẩu | Quản lý cấp (mặc định `jenny123`, kế hoạch P-05 đổi sang ngẫu nhiên) | Đăng nhập | Auth (băm, Clb không đọc được). Mật khẩu vừa tạo giữ tạm trong phiên quản lý (`window.qlMK`) để in phiếu | Auth: tới khi đổi; `qlMK`: hết phiên | Chỉ chủ tài khoản |
| Giới tính (`hoso.gt`, `st.gender`) | Quản lý (bảng/Excel "Giới tính") | Chọn nhân vật nam/nữ trong trò chơi | FS `org/main.j.hoso`, `hs/{tk}.j` | Như trên | Em, cô, phụ huynh, quản lý |
| Ngày, tháng sinh (`hoso.ng`, `hoso.th`) | Quản lý (bảng/Excel "Ngày sinh") | Phân biệt em trùng tên khi nhập Excel | FS `org/main.j.hoso` | Như trên | Quản lý, cô | 
| Năm sinh (`hoso.nam`) | Quản lý | Kiểm tra khối, phân biệt trùng tên | FS `org/main.j.hoso` | Như trên | Quản lý, cô |
| Lớp, khối, năm học (`org.gd`, `lop`, `khoi`, `st.namHoc`) | Quản lý xếp lớp | Chọn chương trình, phân quyền cô giáo | FS `org/main.j`, `users.khoi`, `hs/{tk}.lop` | Như trên | Em, cô, phụ huynh, quản lý |
| Kết quả học: câu đúng/sai, thời gian mỗi câu, số lần mở hướng dẫn, sao, xu, đồ, thú cưng, sổ lỗi sai, tự luyện (`st.p1`, `st.p2`, `coins`, `items`…) | Sinh ra khi em học | Hiện tiến độ, mở đảo, gợi ý bài luyện, trò chơi | FS `hs/{tk}.j`; bản sao trên Máy (`jennyHSc_<tk>`) | FS: như trên. Máy: tới khi đăng xuất/xoá dữ liệu trình duyệt | Em, cô, phụ huynh, quản lý |
| Sự kiện gần đây (xAPI: ai, làm gì, khi nào, kết quả) (`hs/{tk}.ev`, `S.events`) | Sinh ra khi em học | Hoạt động gần đây trong hồ sơ, báo cáo cho cô | FS `hs/{tk}.ev` (chỉ giữ gần đây) | Như trên | Em, cô, phụ huynh, quản lý |
| Nhận xét, thẻ khen, ghi chú riêng, dạng bỏ qua của cô (`comments`, `badges`, `gvNote`, `gvSkip`) | Cô giáo | Hỗ trợ em học | FS `hsgv/{tk}.j` | Như trên | Cô, phụ huynh (trừ ghi chú riêng `gvNote`: chỉ cô và quản lý) |
| Bài cô giao và kết quả (`asg/{id}`) | Cô giao, em làm | Bài về nhà | FS `asg/{id}` | Như trên | Em, cô, phụ huynh |
| Trạng thái Nghỉ học / Học xong, lịch sử lên lớp (`org.hosoNam`) | Quản lý | Lên lớp, khoá đăng nhập | FS `org/main.j` | Như trên | Quản lý, cô |

## 2. Phụ huynh

| Trường | Nguồn | Mục đích | Nơi lưu | Thời hạn | Ai xem |
|---|---|---|---|---|---|
| Số điện thoại (`hoso.dt`, `phInfo.dt`) | Phụ huynh đăng ký; quản lý nhập (bảng/Excel "Điện thoại phụ huynh") | Nhận biết anh chị em (gom 1 tài khoản phụ huynh), liên hệ | FS `org/main.j.hoso`, `org/main.j.phInfo` | Như học sinh | Quản lý, cô lớp |
| Gmail (`hoso.mail`, `phInfo.mail`) | Như trên ("Gmail phụ huynh") | Như trên (dự kiến bỏ nếu đã có SĐT — Q2) | FS như trên | Như trên | Quản lý, cô lớp |
| Tên đăng nhập phụ huynh (`ph.<tk của con>` hoặc `ph` + 6 số cuối SĐT) | App tự tạo | Đăng nhập trang phụ huynh | FS `users/{uid}` (`role:'ph'`, `tk`, `con[]`), Auth | Như trên | Phụ huynh, quản lý |
| Danh sách con (`users.con[]`, `org.ph`) | App | Phụ huynh chỉ xem con mình | FS | Như trên | Phụ huynh, quản lý |
| Họ tên phụ huynh (`phInfo.ten`) | **Không thu** (LUAT §6j 24/10/2026: bỏ ô này); trường còn trong mã, để trống | — | FS (trống) | — | — |
| Mật khẩu phụ huynh | App cấp (mặc định `jenny123`, P-05 đổi) | Đăng nhập | Auth (băm) | Tới khi đổi | Chủ tài khoản |

## 3. Giáo viên và quản lý

| Trường | Nguồn | Mục đích | Nơi lưu | Thời hạn | Ai xem |
|---|---|---|---|---|---|
| Họ tên, tên đăng nhập, mật khẩu, lớp phân công (`users` role `gv`/`ql`, `org.gv`, `org.pc`) | Quản lý tạo | Đăng nhập, phân quyền | FS `users/{uid}`, `org/main.j`; Auth | Thời gian làm việc + 12 tháng | Quản lý |
| Nhật ký thao tác (`org.nk`: ngày, ai, làm gì) | App ghi khi quản lý thao tác | Truy vết | FS `org/main.j.nk` (200 dòng gần nhất) | 200 dòng gần nhất | Quản lý |

## 4. Dữ liệu kỹ thuật và dữ liệu không có tên

| Trường | Nguồn | Mục đích | Nơi lưu | Thời hạn | Ai xem |
|---|---|---|---|---|---|
| Địa chỉ IP, loại trình duyệt, thời điểm đăng nhập | Tự động khi dùng | Google ghi nhật ký an ninh cho Auth; GitHub Pages ghi nhật ký máy chủ khi tải trang | Auth (Google), GitHub (máy chủ Pages) | Theo chính sách Google / GitHub | Google, GitHub; Clb chỉ xem thời điểm đăng nhập gần nhất trong bảng Auth |
| Cài đặt trên máy: âm thanh, ngôn ngữ (`jennySound`, `jennyMute`, `jennyLang`) | Em chọn | Tiện dùng | Máy | Tới khi xoá dữ liệu trình duyệt | Chỉ máy đó |
| Tiến độ Hành Trình Của Jenny, Tư Duy Bebras (`jenny-saga-*`, `bb-*`) — **không có tên, không tài khoản** | Em chơi | Lưu màn đã qua | Máy | Như trên | Chỉ máy đó |
| Mã CLB (`jenny-club-code`) | Em nhập | Mở kho bài có bản quyền | Máy, `sessionStorage` (xoá khi đóng thẻ) | Hết phiên | Chỉ máy đó |
| Bản thử (`games/lop-hoc-ao/demo/`): tài khoản mẫu Jenny01…, dữ liệu mẫu | Clb tạo | Duyệt giao diện | Máy (`jennyHS2_*`, `jennyVirtualDemo_*`) | Tới khi xoá dữ liệu trình duyệt | Chỉ máy đó; không phải dữ liệu thật |

## 5. Giấy

| Trường | Nguồn | Mục đích | Nơi lưu | Thời hạn | Ai xem |
|---|---|---|---|---|---|
| Phiếu đồng ý (tên con, tên và SĐT/Gmail bố mẹ, chữ ký) | Phụ huynh ký | Bằng chứng đồng ý | Giấy, tủ khoá tại Clb | Thời gian học + 24 tháng | Thầy Luân |
| Phiếu đăng nhập in (tên, tên đăng nhập, mật khẩu ban đầu) | App in khi tạo tài khoản | Phát cho em | Giấy, phát cho phụ huynh | Phụ huynh giữ | Phụ huynh, em |

## 6. Không thu thập

Địa chỉ nhà · ảnh, giọng nói, khuôn mặt · số định danh/CCCD · thông tin sức khoẻ · vị trí · thông tin thanh toán (LUAT §6h). Hành Trình Của Jenny Mầm non, Tiểu học và các game Bebras không cần tài khoản.

## 7. Việc còn phải làm (P-09b, chờ Q2)

- Bỏ ngày, tháng sinh đầy đủ, chỉ giữ năm sinh; cân nhắc bỏ Gmail nếu đã có SĐT.
- Nút **Xuất dữ liệu của em** (JSON) cho quyền nhận bản sao.
- Nhắc xoá theo thời hạn 24 tháng cho em đã nghỉ (xoá vẫn do người bấm).
