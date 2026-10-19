# Lịch sử thay đổi

## 2026-10-19 — Sổ lỗi sai lên thanh điều hướng
- Bỏ thẻ Sổ lỗi sai trên bản đồ. Khi có lỗi cần sửa, icon Luyện lỗi ở thanh dưới hiện số lỗi và rung nhẹ.

## 2026-10-19 — Biển đầy khung, bỏ thẻ trùng
- Chủ đề ít đảo trên màn hình rộng (laptop): biển tự kéo đầy khung, các đảo nằm giữa; tự chỉnh lại khi đổi cỡ cửa sổ.
- Bỏ thẻ "Cô vừa mở Toán Jenny" trên bản đồ (đã có ở tab Toán Jenny).

## 2026-10-19 — Hồ sơ của em (lớp 1–5)
- Tab mới **Hồ sơ** ở thanh dưới (icon bảng có đường đi lên), giữ nguyên các icon cũ.
- **Chuỗi ngày chăm chỉ**: mỗi ô là 1 ngày của năm học 2026–2027 (từ 05/09 đến 31/05), có tên tháng; màu đậm dần theo số câu (0, 1–9, 10–24, 25–49, từ 50); hôm nay viền vàng; chạm ô để xem "Thứ Hai 19/10: 32 câu · đúng 28 · 18 phút". Trên điện thoại vuốt ngang, tự mở ở tuần hiện tại.
- 4 ô số liệu: chuỗi ngày học hiện tại, chuỗi dài nhất, số ngày học, tổng số câu.
- **Sức mạnh Toán**: biểu đồ mạng nhện pixel 6 trục (Số, Phép tính, Giải toán lời văn, Hình học, Đo lường, Thống kê – Xác suất). Điểm mỗi trục = tỉ lệ đúng 10 lần làm gần nhất của từng dạng bài; câu Trùm tính gấp đôi; cần ít nhất 5 câu mới hiện điểm ("chưa đủ"); trục lớp chưa học hiện "chưa học". Nét chấm là tháng trước.
- **Luyện**: Jenny gợi ý trục yếu nhất; 8 câu (6 câu dạng yếu, 2 câu dạng đã vững) lấy từ chính các đảo em đã học; không mất tim, sai thì hiện lời giải ngay; +5 xu; hết lượt xem điểm trục trước → sau. Không phát nhạc nền.
- Ghi nhận mới (giữ tiến độ cũ, tự điền lại số liệu ngày từ nhật kí cũ): `st.dd` theo ngày, `st.sk` theo dạng bài, `st.skm` theo tháng. Mọi dạng bài đã gắn trục (`tools/test/truc-kien-thuc.js`).

## 2026-10-19 — Mọi vùng biển đều chuyển động
- Trước đây chỉ vùng biển của chủ đề đang học mới chuyển động (để đỡ tốn máy). Nay mọi vùng đều chuyển động; vùng nào khuất màn hình thì tạm dừng vẽ để đỡ tốn pin.

## 2026-10-19 — Vùng biển đúng tên, trùm và nhạc theo vùng, Hộ chiếu đại dương
- Vẽ lại 10 đảo (26×18 ô) cho đúng tên vùng: dừa + phao (Nhiệt đới), lều tuyết + cánh cụt (Băng), núi lửa dung nham, ốc đảo xương rồng + kim tự tháp, bánh kem + kẹo mút, cụm pha lê, cây rừng dây leo, cây lá đỏ + nấm, hải đăng, dừa bóng tối hoàng hôn.
- Trong nước có vật thể của vùng: san hô + cá; tảng băng, cánh cụt bơi, cực quang; đá bazan, dung nham, khói; cồn cát, rùa; kẹo trôi, cốm rơi; pha lê nhô khỏi mặt nước, mảnh pha lê, tia cầu vồng; lá súng, sen, ếch, đom đóm; lá thu trôi, thuyền giấy; trăng, sứa phát sáng, sao băng, đèn hải đăng quét; mặt trời lặn, chim và thuyền bóng tối. Cá voi/thuyền/hải âu chỉ còn ở Nhiệt đới. Bộ sinh hình: `tools/sprite/vung-bien-gen.py`.
- Trùm theo vùng: trùm chủ đề và Trùm lớp mang hệ màu của vùng (10 hệ, thêm Cát, Pha lê, Lá Thu, Hoàng hôn).
- Nhạc theo vùng: 10 bản nhạc bản đồ, phát theo vùng đang học.
- Hộ chiếu đại dương (tab Sưu tập): hạ trùm cuối chủ đề → đóng dấu vùng biển (có hiệu ứng, âm thanh); mỗi vùng mở 1 trang phục Jenny, đủ vùng → Trang phục Huyền thoại. Tiến độ cũ được tự đóng dấu bù.

## 2026-10-19 — Vùng biển khác nhau
- Mỗi chủ đề là một vùng biển riêng (`core/23b`, `BIOME`, `biomeOf()`): 10 vùng — Nhiệt đới, Kẹo ngọt, Rừng xanh, Pha lê, Biển Băng, Lá Thu, Ốc đảo Sa mạc, Núi lửa, Đêm sao, Hoàng hôn. Mỗi vùng có màu nước, kiểu đảo (dừa, thông tuyết, núi lửa, xương rồng, nấm kẹo, pha lê, cây tròn, cây lá đỏ) và hiệu ứng động riêng (tuyết rơi + băng trôi, tàn lửa bay, kẹo trôi + bong bóng, pha lê lấp lánh, lá súng, lá thu rơi, sao + trăng, mặt trời lặn, cồn cát).
- Mỗi lớp là một đại dương có tên và màu nhấn riêng (Vịnh Tí Hon, Biển Ngọc Bích, Quần đảo Mây Trắng, Đại dương Sao Băng, Biển Huyền Thoại); thứ tự vùng biển mỗi lớp khác nhau. Ôn tập học kì 1 luôn là Biển Băng, Ôn tập cuối năm luôn là Biển Hoàng hôn.

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
