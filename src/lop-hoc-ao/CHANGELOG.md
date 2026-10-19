# Lịch sử thay đổi

## 2026-10-19 — Sửa máy tính và giọng đọc
- Câu cá, Bóng bay: chọn sai đã trừ tim nhưng tim không đổi trên màn hình vì thiếu hình "tim rỗng" (heartE). Đã thêm hình; rà toàn bộ tên hình, không còn hình nào thiếu.
- Trò chơi nhỏ (Câu cá, Bóng bay) bị lệch sang trái trên MacBook/màn hình thấp: bố cục "điện thoại xoay ngang" chỉ áp cho máy cảm ứng; trò chơi nhỏ luôn căn giữa, rộng tối đa 720px.
- Giọng Jenny đọc **mọi phép tính hiện trên màn hình** (slide và câu hỏi): lời Jenny chưa nhắc tới dòng nào thì tự đọc thêm dòng đó (ví dụ 53 = 50 + 3 và 71 = 70 + 1). Câu điền dấu đọc cả hai vế ("47 và 41"), dãy số đọc "chỗ trống".
- Giọng Jenny: đọc đủ mọi phép so sánh (trước đây xoá nhầm đoạn giữa dấu < và >), đọc kí hiệu thành lời (lớn hơn, bé hơn, bằng, nhân, chia, phần, phẩy, đơn vị đo), giữ cao độ chuẩn (pitch 1) để không lệch thanh điệu (bé → bớ), ưu tiên giọng tiếng Việt chất lượng cao.

## 2026-10-19 — Đóng gói thành dự án
- Tách file HTML 1,1 MB thành mã nguồn: `css/`, `js/core/`, `js/content/`, khung `app.template.html`.
- `tools/build.py` ghép lại (kết quả trùng khớp từng byte với bản cũ) và tạo bản học sinh.
- `tools/test/kiem-tra.js` kiểm tra tự động cả 5 lớp.
- Thêm README, CLAUDE.md, TASKS.md, docs/.

## 2026-10-18
- Lớp 1–5 đủ cả năm (Chủ đề 6 trở đi): 474 đảo mới, trò chơi nhỏ theo chủ đề, bài giảng.
- Bài giảng Jenny cho 138 bài Chủ đề 1–5.
- Cỡ chữ phương án đồng đều, tự chuyển 2/1 phương án mỗi hàng khi chữ quá bé.
- Tự vừa màn hình khi điện thoại bật "Trang web cho máy tính"; sửa thanh menu tràn trên máy 360px.
- Sửa lỗi không hiện bài khi có tiến độ cũ (`healAll`).
- Chủ đề 2–5 lớp 1–5; mặc định mở khoá tất cả đảo để kiểm tra.
- Bản học sinh lên GitHub với tài khoản Jenny01–Jenny09.
