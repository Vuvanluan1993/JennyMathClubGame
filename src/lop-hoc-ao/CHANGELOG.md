# Lịch sử thay đổi

## 2026-10-19 — Sửa giọng đọc (lần 2)
- Bỏ chữ "mấy" thừa ở cuối câu hỏi: dấu "?" cuối câu không còn bị đọc thành "mấy"; chỉ ô trống trong phép tính (☐, "12 + ? = 20") mới đọc là "mấy".
- Chọn giọng tiếng Việt tốt nhất trên máy (ưu tiên giọng tự nhiên của Edge, Google Tiếng Việt của Chrome, giọng nâng cao của Mac), chờ danh sách giọng nạp xong; có thể ghim giọng bằng `localStorage.jennyVoice`.
- Câu cá lớp 1 Chủ đề 5: luật "lớn hơn 9" có quá ít cá đúng; nay chọn mốc 3–6.
- Máy không có giọng tiếng Việt (nguyên nhân đọc "bé" thành "bớ", đọc không rõ): hiện hướng dẫn cài giọng "Linh" trên Mac hoặc mở bằng Chrome/Edge.

## 2026-10-19 — Trùm hoạt hình
- Jenny có biểu cảm (`core/33d`, `jenny(size, mood)`): chờ thì thở và nháy mắt; đúng thì mắt cười, miệng mở, nhảy, lấp lánh; sai thì lo lắng, rơm rớm nước mắt, lắc đầu; qua màn/hạ trùm thì giơ hai tay ăn mừng.
- Trùm lớp dùng chung hoạt hình trùm (chờ, bị đánh, nổi giận, sắp thua, bị hạ) và có 6 hệ màu: Lửa, Băng, Độc, Vàng, Bóng đêm, Kẹo ngọt (đổi bảng màu sprite, cố định theo đảo, tên thêm "· Hệ …").
- Trùm có hoạt hình pixel và biểu cảm (`core/33c`, `bossHTML()`): thở/nhún khi chờ; bị đánh thì loé trắng, bật lùi, sao nổ, hiện "-1"; học sinh sai thì trùm lao tới, đỏ mặt, gân giận, "Hừm!" kèm tiếng gầm; sắp thua thì run và đổ mồ hôi; bị hạ thì xoay, bẹp xuống, sao quay vòng; thắng thì nhảy cười "HA HA!" kèm tiếng cười.
- Biểu tượng trùm trên bản đồ và ô Trùm lớp cũng nhún nhảy.
- Đặt lại tên trùm lớp 2–5 theo chủ đề (trước bị cắt dở, ví dụ "Cá mập Và bổ sung").

## 2026-10-19 — Âm thanh và hiệu ứng
- Nhạc nền 8-bit tự tổng hợp (không cần file), đổi theo màn: bản đồ, bài giảng, màn chơi, đánh trùm, Câu cá, Bóng bay, Đua giờ.
- Hiệu ứng riêng từng trò: Câu cá (câu được, cá vẫy tuột), Bóng bay (nổ bóng, bóng xì hơi), Đua giờ (tích tắc 10 giây cuối, hết giờ), trùm (đòn đánh, hạ trùm), kho báu (mở rương), slide (lật trang), thắng/thua.
- Mất tim: tim nảy đỏ, màn hình rung nhẹ và loé đỏ, điện thoại rung (nếu hỗ trợ).
- Các màn "Học trên đảo" (Màn 1, Màn 2, Trùm đảo), Sổ lỗi sai: không phát nhạc nền, chỉ giữ hiệu ứng. Nhạc chỉ còn ở bản đồ, Trùm lớp, Kho báu, Câu cá, Bóng bay, Đua giờ.
- Tắt nhạc nền khi hiện lời giải (sau khi trả lời sai), khi xem Bài giảng Jenny, video, ví dụ, Toán Jenny; nhạc tự nhỏ lại khi Jenny đang nói.
- Nút âm thanh (đầu trang và trong màn chơi): bật cả hai → chỉ hiệu ứng → tắt hết. Lưu ở `localStorage.jennySound`.

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
