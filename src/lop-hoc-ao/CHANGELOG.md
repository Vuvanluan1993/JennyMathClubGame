# Lịch sử thay đổi

## 24/10/2026 — Bỏ ô "Tên của em" khi đăng nhập; quản lý sửa thông tin học sinh
- Trang đăng nhập học sinh chỉ còn Tên đăng nhập + Mật khẩu. Tên hiển thị do quản lý nhập.
- Quản lý › Học sinh: mỗi em có nút **✎ Sửa**: Họ tên, Khối, Nhân vật (nữ/nam/em tự chọn), Xu, Kích hoạt Toán Jenny, **Làm lại tiến độ** (bấm 2 lần mới xoá). Đổi khối thì em ra khỏi lớp khác khối. Mọi thay đổi ghi Nhật ký thao tác.
- Bản có máy chủ: lưu cả lên máy chủ (hồ sơ học sinh, tên trong tài khoản); máy chủ từ chối thì báo lỗi.

## 24/10/2026 — Thú cưng mới, các giai đoạn lớn lên
- Thêm **Ếch xanh** 180 xu (60–80 ngày, đẻ trứng), **Mèo con** 280 xu (110–150 ngày), **Cún con** 300 xu (120–160 ngày). Mèo, Cún không đẻ trứng.
- Mọi loài có **4 hình theo giai đoạn**: Bé → Lớn dần → Trưởng thành → Già. Gà: gà con → gà choai → gà mái; Ếch: nòng nọc → ếch con còn đuôi → ếch lớn; Rùa: mai lớn dần; Mèo, Cún: con nhỏ → lớn. Già: màu nhạt, lông mày bạc.
- Đổi mã phụ kiện Khăn quàng đỏ, Bờm tai mèo để không trùng đồ thú cưng (khăn của thú cưng hiện đúng như cũ).

## 24/10/2026 — Thêm 18 mặt hàng Cửa hàng
- Áo váy: Áo Bạc hà 130, Áo Sô-cô-la 160, Váy Dâu tây 180 (nữ), Váy Oải hương 200 (nữ), Áo Cướp biển 220 (nam), Áo Bác sĩ nhí 260.
- Mũ kính: Kẹp ngôi sao 60 (nữ, tóc), Khăn quàng đỏ 70 (cổ), Bờm tai mèo 90 (nữ, mũ), Mặt nạ siêu nhân 120 (mặt), Mũ đầu bếp 140, Mũ cướp biển 160 (nam).
- Khung: Khung Hoa 150, Khung Kẹo ngọt 180, Khung Đêm sao 250 (hiện cả ở Tủ đồ và thẻ chào).
- Đảo nhà: Hoa hướng dương 40 (cỏ trái), Lửa trại 60 (cát trái), Rương kho báu 100 (cát phải) — có chỗ đặt riêng.

## 24/10/2026 — Nhân vật Nam, đồ cho bạn nam
- Giữ phong cách pixel cũ (thầy chốt không đổi cỡ ô).
- **Bạn nam**: tóc ngắn dựng, không búi, không nơ; dùng chung thân, biểu cảm, áo, mũ kính với Jenny.
- Lần đầu vào, học sinh chọn **Bạn nữ / Bạn nam**; đổi lại ở Tủ đồ (hàng "Nhân vật"). Nhân vật đã chọn hiện ở thẻ chào, khi làm bài, Tủ đồ, Cửa hàng. "Tủ đồ của Jenny" → "Tủ đồ của em".
- Cửa hàng thêm: Áo cầu thủ 150, Áo Ninja 200, Áo phi hành gia 250; Nơ cổ 60, Băng đô ninja 80, Kính râm 100, Tai nghe 150, Mũ bảo hiểm 180.
- Đồ riêng (Váy Hoa đào, Nơ đỏ, Kẹp hoa cho bạn nữ; Áo cầu thủ, Áo Ninja, Nơ cổ, Băng đô cho bạn nam) chỉ hiện với bạn đó; đồ chung hiện cho cả hai.
- Phụ kiện thêm chỗ đeo "Tai" (tai nghe) và "Cổ" (nơ cổ): đeo cùng lúc được mũ + kính + tóc + tai + cổ.

## 24/10/2026 — Tự luyện: chốt ý tưởng Vở bài tập Jenny
- Thầy chốt: Tự luyện là trang vở theo đảo đã qua + bài ★ Thử thách; cô chỉ gợi ý, không giao (ghi ở `docs/LUAT-DA-CHOT.md`).
- Thêm bảng dạng bài lớp 1 tập 1 rà từ VBT tham khảo: `docs/tu-luyen-dang-bai-lop1-tap1.md` (chỉ ghi dạng bài, không chép sách).

## 24/10/2026 — Khủng long chạy miễn phí từ đầu
- Em nào cũng có sẵn trò **Khủng long chạy** ở Cửa hàng › Trò chơi và Nhà em, không cần mua (trước đây 150 xu), không tốn lượt chơi.
- Giới hạn riêng 10 ván/ngày, không trừ vào 10 lượt/ngày của Bowling, Đẩy thùng. Cúp và đồ hiếm (Khăn khủng long) vẫn như cũ.
- File mới: `js/core/66-dino-mien-phi.js`.

## 24/10/2026 — Giọng đọc: dùng Gemini TTS miễn phí (không cần thẻ)
- Thầy không gắn thanh toán Google Cloud. `tools/giong/tao-giong.py` thêm nguồn **Gemini TTS** (khóa AI Studio `GEMINI_API_KEY`), giọng Despina; tự thử các tên mô hình TTS, đổi âm thanh sang mp3 bằng ffmpeg.
- Gói miễn phí: nghỉ 7 giây giữa các câu, lỗi 429 thì chờ rồi thử lại, hết lượt trong ngày thì lưu phần đã thu và dừng. Bước lưu vào repo chạy cả khi bước thu dừng giữa chừng.
- Vẫn giữ nguồn Cloud Chirp 3 HD (`GOOGLE_TTS_KEY`) cho sau này.

## 24/10/2026 — Chốt giọng đọc Google Chirp 3 HD · Despina; công cụ thu sẵn
- Thầy chọn giọng **Chirp 3 HD · Tiếng Việt · Despina**. Ghi vào `docs/LUAT-DA-CHOT.md` mục 5.
- `tools/giong/tao-giong.py`: gọi Google Text-to-Speech, ghi mp3 theo danh sách JSON; có lưu đệm (`_ma.json`) nên chỉ thu lại câu đã sửa.
- `.github/workflows/giong-doc.yml`: bấm chạy trên GitHub (Actions › Thu giọng đọc) để thu và lưu file vào repo. Khóa API đặt ở Secrets `GOOGLE_TTS_KEY`.
- Trang nghe thử `games/lop-hoc-ao/giong-mau/` với 7 câu mẫu (`tools/giong/cau-mau.json`): dấu hỏi/ngã, đọc số, câu hỏi, bài giảng, hướng dẫn, lời khen, câu có kí hiệu toán.
- Chưa gắn vào app.

## 24/10/2026 — Điểm Tư duy – Logic kết hợp mọi mạch
- Công thức (thầy duyệt; theo TIMSS, câu suy luận nằm rải trong mọi mạch): **A 40%** bài thuần logic (quy luật, tìm nhóm khác, suy luận…) · **B 40%** bài suy luận ở các mạch khác (tìm thành phần chưa biết, bài nhiều bước, so sánh kết quả, ước lượng, câu đúng/sai — vẫn tính vào mạch của nó) · **C 20%** thói quen: đúng ngay lần đầu × (1 − tỉ lệ trả lời dưới 3 giây).
- Phần chưa có dữ liệu thì chia lại trọng số; hiện điểm khi A + B có từ 5 câu. Lớp chưa mở Toán Jenny vẫn có điểm Logic.
- Hồ sơ giáo viên/phụ huynh: dưới thanh Logic có dòng "Bài logic · Suy luận ở các mạch · Thói quen".
- "Luyện" theo trục yếu: trục Logic lấy cả bài suy luận ở các mạch. Dữ liệu mẫu tạo lại.

## 24/10/2026 — Trục Lời văn thay bằng Tư duy – Logic
- Sức mạnh Toán giờ có 6 trục: Số · Phép tính · **Tư duy – Logic** · Hình học · Đo lường · Thống kê.
- Logic: bài quy luật, dãy số theo quy luật, tìm nhóm khác, xếp hình – suy luận, cân thăng bằng (Toán Jenny và sách). Chưa có bài thì hiện "chưa học".
- Bài lời văn tính vào trục nội dung: thêm/bớt, bảng nhân chia, nhiều bước, tổng – hiệu, tổng – tỉ → Phép tính; kg, lít, độ dài, thời gian, vận tốc, tiền → Đo lường; diện tích, thể tích, hình tròn → Hình học; phân số, số thập phân, phần trăm, tỉ lệ bản đồ → Số.
- Hồ sơ giáo viên/phụ huynh: thêm dòng **Giải toán lời văn: đúng x%**; bảng dạng bài có nhãn "lời văn".
- Dữ liệu cũ tự chuyển sang trục mới; dữ liệu mẫu 8 tháng tạo lại.

## 24/10/2026 — Sửa: Sức mạnh Toán hiện điểm Hình học sai (lớp 1)
- Nguyên nhân: Toán Jenny lớp 1 Buổi 1 "Quy luật xếp hình" có dạng "Quy luật lặp 2 hình / 3 hình" (táo, sao, bóng…). Luật gắn mạch thấy chữ "hình" nên tính vào **Hình học**. Học sinh mới học Bài 1–2 (như Đặng Phương Dung) vì thế có điểm Hình học dù chưa học hình.
- Sửa (`35-ho-so.js`): dạng "Quy luật lặp…" tính vào mạch **Số**. "Quy luật xếp hình" ở Bài 8 (xếp hình vuông, tròn…) vẫn là Hình học.
- Dữ liệu cũ tự sửa: khi mở hồ sơ, các dạng bài được gắn lại mạch đúng; mạch chưa đủ 5 câu thì bỏ khỏi biểu đồ (hiện "chưa đủ"/"chưa học"). Học sinh mở app là lưu bản đã sửa lên máy chủ.

## 24/10/2026 — Bấm logo Clb để về trang chủ
- Thanh trên cùng: bấm (hoặc chạm) logo "JennyClub / Clb Học Toán cùng Jenny" là về trang chủ (Bản đồ), từ bất cứ tab nào (Cửa hàng, Nhà em, Sổ lỗi sai…). Trang giáo viên, phụ huynh, quản lý: về màn đầu của vai đó.
- Trong màn chơi, thanh trên được ẩn nên không lỡ tay thoát. Nếu đang có bài về nhà bắt buộc thì vẫn hiện màn bài về nhà.
- File mới: `js/core/65-logo-ve-trang-chu.js`.

## 24/10/2026 — Sửa: chơi trò chơi xong không được xu
- Nguyên nhân: mỗi câu đúng trong màn +5 xu và trò chơi dùng **chung** giới hạn 150 xu/ngày. Học vài màn (khoảng 30 câu đúng) là hết giới hạn → trò chơi kết thúc được 0 xu mà không báo gì (test01, test02 đều đã chạm 150 hôm nay).
- Sửa (`64-xu.js`): trò chơi (trò chơi đảo, câu cá, bóng bay, đua giờ, kéo co) có **giới hạn riêng 100 xu/ngày**, mỗi lượt tối đa 20 xu; câu đúng trong màn vẫn giới hạn 150/ngày. Hết giới hạn trò chơi thì màn kết thúc báo "Hôm nay em đã nhận đủ 100 xu từ trò chơi".
- Đã chạy thử 13 trò chơi đảo + câu cá, bóng bay, đua giờ: trò nào cũng cộng xu đúng.
- Sửa dòng "Kiếm xu" ở Cửa hàng cho đúng thực tế: mỗi câu đúng +5 (tối đa 150/ngày) · qua màn +10, trùm đảo +30 · sửa xong 1 lỗi +5 · trò chơi tới +20 mỗi lượt (tối đa 100/ngày) · trùm lớp +20–30 · bài về nhà +20 (có bản tiếng Anh).

## 24/10/2026 — Sửa: lớp 1A không hiện "Giao phiếu bài cho lớp"
- Nguyên nhân: khung phiếu cả lớp đọc cả bài Luyện lỗi riêng của em (chưa có kết quả) nên bị lỗi và không vẽ ra (gặp ở lớp 1A của cô Thử).
- Sửa: khung "Giao phiếu bài cho lớp" chỉ liệt kê phiếu cả lớp; bài riêng từng em xem ở hồ sơ em. Thêm chặn lỗi khi bài chưa có kết quả.
- Đã thử đặt lại mật khẩu thật cho test02: mật khẩu cũ bị từ chối, mật khẩu mới vào được, dữ liệu giữ nguyên.

## 24/10/2026 — Quản lý: danh sách tài khoản + đặt lại mật khẩu
- Trang Quản lý có mục **Tài khoản**: họ tên, vai trò, tên đăng nhập, lớp/con của mọi giáo viên, học sinh, phụ huynh; nút **Đặt lại mật khẩu** (gợi ý mật khẩu mới, hiện lại "Vừa đặt lại: tk / mật khẩu").
- Gói miễn phí không đổi được mật khẩu người khác, nên đặt lại = tạo tài khoản đăng nhập mới cho **cùng tên đăng nhập**, chuyển vai trò sang, bỏ tài khoản cũ; bảng `login/{tk}` cho biết tên đăng nhập dùng email ẩn nào. Dữ liệu học, nhận xét, bài về nhà giữ nguyên (gắn theo tên đăng nhập).
- Quy tắc Firestore thêm `login/{tk}` (ai cũng đọc được để đăng nhập; chỉ quản lý ghi) — cần dán lại quy tắc.

## 24/10/2026 — Làm xong bài Luyện lỗi cô giao thì bỏ các lỗi đó khỏi Sổ lỗi sai
- Bài Luyện lỗi cô giao: em luyện xong **một lượt** (mỗi lỗi 2 câu số mới) là xong bài; các lỗi trong bài **ra khỏi Sổ lỗi sai** (không cần đúng 2 lần liền nữa). Lỗi khác cô không giao vẫn giữ (tự bỏ sau 7 ngày).
- Dữ liệu cũ: bài đã xong trước đây cũng được dọn các lỗi tương ứng (ghi trước/trong ngày làm xong).
- Sửa chữ ở màn bài về nhà, màn kết thúc, trang giáo viên và phụ huynh cho khớp luật mới.

## 24/10/2026 — Sửa: bài Luyện lỗi cô giao bị mở lại khi em sai lại
- Lỗi: bài "Luyện lỗi" đã xong lại thành "chưa xong" khi em sai lại đúng dạng đó → app chặn bắt làm lại (gặp ở tài khoản test01).
- Sửa: sửa hết các lỗi cô giao một lần là bài **xong hẳn** (`asgR.xong`); sai lại sau đó chỉ ghi vào Sổ lỗi sai (tự luyện, tự bỏ sau 7 ngày). Lỗi của bài đã xong không còn được giữ khỏi việc tự bỏ.

## 24/10/2026 — Trang phụ huynh: nhắc lỗi tự bỏ sau 7 ngày
- Khung "Nhắc bố mẹ" (dưới Lời nhắn của giáo viên) khi con có lỗi trong Sổ lỗi sai: số lỗi, bao nhiêu lỗi cô đã giao, bao nhiêu lỗi sẽ tự bỏ sau 7 ngày (báo riêng lỗi chỉ còn 1–2 ngày), lời khuyên con luyện 5 phút mỗi ngày ở mục Luyện lỗi.
- Thẻ "Lỗi & bài về nhà" của phụ huynh: câu giải thích viết cho bố mẹ; cột "Tự bỏ sau" cho từng lỗi.

## 24/10/2026 — Màn đăng nhập dễ đọc + nút hiện mật khẩu
- 3 trang Giáo viên/Phụ huynh/Quản lý: ô nhập luôn nền trắng chữ xanh đậm (trước bị nền tối khi máy để chế độ tối), viền vàng khi đang gõ, nút Đăng nhập xanh rõ.
- Nút hình con mắt trong ô mật khẩu (cả app học sinh): bấm để hiện/ẩn mật khẩu.
- Dịch nút "Quản lý" sang tiếng Anh (bài kiểm tra tiếng Anh còn 0 chuỗi sót).

## 24/10/2026 — Luyện lỗi không bắt buộc; lỗi cô không giao tự bỏ sau 7 ngày
- Bỏ chặn "luyện lỗi trước rồi mới chơi tiếp" (`46-bat-buoc-luyen-loi.js`). Màn kết thúc có lỗi: nút "Luyện lại câu sai (n)" — không bắt buộc.
- Lỗi vẫn ghi vào Sổ lỗi sai. Cô giao "Luyện lỗi" (hồ sơ › Lỗi & bài về nhà) → bài về nhà bắt buộc như cũ.
- `63-loi-tu-bo.js`: lỗi không nằm trong bài cô giao tự bỏ sau 7 ngày kể từ lần sai gần nhất; lỗi cô đã giao giữ tới khi em làm xong. Bảng Sổ lỗi sai của cô có cột "Tự bỏ sau" (x ngày / cô đã giao).

## 24/10/2026 — Sửa hiển thị trên điện thoại (trang Giáo viên, Phụ huynh, Quản lý)
- Nguyên nhân chính: 3 trang thiếu khung trang (`<!doctype>` + `meta viewport`) nên điện thoại vẽ như màn 980px rồi bóp lại → chữ bị chèn, cột dồn. `tools/_teacher.py` thêm khung trang như bản học sinh.
- Bảng trên điện thoại (≤640px) chuyển thành thẻ: ô đầu là tiêu đề, các ô sau "NHÃN … giá trị" (Tiến độ từng em, Tiến độ SGK, Dạng bài, Sổ lỗi sai, Bài về nhà, Lớp học, Học sinh…).
- Thanh 4 thẻ hồ sơ thành lưới 2 × 2; thanh tài khoản (tên · Đổi mật khẩu · Đăng xuất) gọn hơn.
- Đã quét tự động ở khổ 320/360/390 (giả lập điện thoại), chế độ tối và 1280px: không tràn, không chữ bị bóp.

## 24/10/2026 — Tách 3 trang: Giáo viên, Phụ huynh, Quản lý
- `tools/_teacher.py` tạo 3 trang riêng: `games/lop-hoc-ao/giao-vien/` (tài khoản giáo viên; quản lý cũng vào được để dạy), `phu-huynh/` (chỉ phụ huynh), `quan-ly/` (chỉ quản lý, có "Thiết lập lần đầu"). Mỗi trang chỉ một vai, không còn thanh chọn vai.
- Đăng nhập sai trang → báo "Đây là tài khoản …" kèm link đúng trang. Mỗi trang vẫn có "Xem bản demo" của vai đó (mật khẩu `giaovien123`).

## 24/10/2026 — Nối máy chủ Firebase (dữ liệu dùng chung thật)
- `js/core/62-may-chu.js` + quy tắc `firebase/firestore.rules` (đã dán vào Firestore). Dự án Firebase `jenny-lop-hoc-ao`, vùng asia-southeast1, gói miễn phí.
- **Trang giáo viên & phụ huynh** (`games/lop-hoc-ao/giao-vien/`): đăng nhập bằng tài khoản thật; vẫn có "Xem bản demo" (mật khẩu `giaovien123`) và "Thiết lập lần đầu". Vai trò theo tài khoản: Quản lý (Giáo viên + Quản lý + xem như phụ huynh), Giáo viên (chỉ lớp được phân công), Phụ huynh (chỉ con mình). Có Đổi mật khẩu, Đăng xuất, trạng thái "Đã lưu lên máy chủ".
- **Quản lý** tạo tài khoản thật: giáo viên (tên đăng nhập + mật khẩu), học sinh (tự gợi ý tên đăng nhập, mật khẩu mặc định jenny123), phụ huynh (gắn với con).
- **App học sinh**: đăng nhập tài khoản trung tâm cấp → tiến độ lưu lên máy chủ; bài về nhà cô giao hiện ngay (thời gian thực); tài khoản thử cũ (jenny01…05, lebaona) vẫn chạy kiểu lưu trên máy.
- Dữ liệu: `users/{uid}`, `org/main`, `hs/{tk}` (em ghi), `hsgv/{tk}` (cô ghi: nhận xét, thẻ, ghi chú), `asg/{id}` (bài về nhà). Tên đăng nhập đổi thành email ẩn `tk@jenny-lop-hoc-ao.firebaseapp.com`.
- Đã thử trọn vòng trên máy chủ thật: quản lý tạo lớp/giáo viên/học sinh/phụ huynh → em làm bài → cô giao luyện lỗi → em bị chặn ngay, làm xong → cô thấy "Đã sửa xong" → phụ huynh đọc lời nhắn. Phụ huynh và em khác không đọc được dữ liệu em khác (bị chặn đúng).

## 23/10/2026 — Bố cục cân đối khi đổi độ rộng màn hình
- `js/core/61-bo-cuc-can-doi.js`: dãy ô số liệu và thẻ lớp chọn số cột theo số ô — 6 ô = 3 cột × 2 hàng (điện thoại 2 × 3), 4 ô = 4 cột (máy nhỏ 2 × 2), 3 ô = 3 cột; không còn hàng cuối lẻ một ô.
- Các cặp khung (Sức mạnh Toán / Điểm từng mạch, Phần thưởng / Hoạt động gần đây, Ghi chú / Nhận xét, Giáo viên / Nhật ký) chia đều 2 cột, dưới 900px xếp 1 cột.
- Lịch học và Khung giờ học nằm cạnh nhau; bảng dạng bài hiện 10 dạng yếu nhất, còn lại ở "Xem thêm".
- Trang lớp: "Cần chú ý" 2 cột, 6 mục; cột bảng tiến độ không xuống dòng lộn xộn.
- Quản lý: lọc theo lớp, tìm tên, hiện 20 em mỗi lần ("Hiện thêm"); lọc khối và tạo lớp chỉ khối 1–5.
- Dữ liệu mẫu: các đảo đã qua phần lớn hoàn thành (bớt "Kẹt" giả); tạo lại một lần.

## 23/10/2026 — Sức mạnh Toán 3 đường, nhận xét tự viết, trang phụ huynh đầy đủ, dữ liệu mẫu 8 tháng
- Sức mạnh Toán (mạng nhện) có 3 đường: **em · 3 tháng gần nhất**, **em · 6 tháng gần nhất**, **trung bình học sinh Jenny cùng khối** (nét đứt). Điểm từng mạch: thanh = 3 tháng, vạch = TB khối, dòng phụ "6 tháng · khối (±)". Tính từ ảnh chụp điểm hằng tháng `st.skm`.
- Bỏ thẻ "Ghi nhận và nhận xét" ở trang lớp. Hồ sơ › Ghi chú & giao bài: **"Nhận xét gửi phụ huynh"** — cô tự viết (ô chữ), xem lại 5 lời nhắn đã gửi; vẫn tặng thẻ được.
- **Trang phụ huynh** (lớp 1–5): đầu trang có tình hình hôm nay, số bài về nhà chưa xong; mục **Lời nhắn của giáo viên** (mới nhất ở trên, xem lời nhắn cũ, thẻ cô tặng); 3 thẻ như giáo viên: Tổng quan · Hoạt động học tập · Lỗi & bài về nhà (không có ghi chú riêng của cô, không có nút giao bài).
- **Dữ liệu mẫu 8 tháng** (5/9/2026 → 2/5/2027, ngày demo 240) cho mọi học sinh trừ Lê Bảo Na: lịch học (nghỉ Tết ít học), điểm mạch tăng dần theo tháng, tiến độ đảo, dạng bài, Sổ lỗi sai, 3–6 bài về nhà đã làm (khoảng 1/4 em có 1 bài đang chờ), 3–7 lời nhắn của cô, thẻ, xu. Sẽ xóa khi có dữ liệu thật.
- Bài giao mới trong bản demo lấy theo ngày demo (`gvNow`).

## 23/10/2026 — Bài về nhà bắt buộc trong bản GitHub
- `js/core/60-bai-ve-nha.js`: bài cô giao (`a.bat=1`) phải làm xong trước mọi việc khác. Em chỉ thấy màn "★ BÀI VỀ NHÀ CÔ GIAO" (bài đầu tiên + nút Làm ngay/Làm tiếp/Làm lại, các bài tiếp theo xếp lần lượt). Chỉ Đăng xuất dùng được.
- Hai loại: **Phiếu** (theo dạng yếu hoặc phiếu cả lớp) — đạt khi đúng từ 80%, chưa đạt thì làm phiếu mới; **Luyện lỗi có mục tiêu** — mỗi lỗi 2 câu số mới, đúng 2 lần liền mới ra khỏi sổ, còn lỗi thì làm lại.
- Xong bài: +20 xu (thêm vào xu phiếu sẵn có).
- Hồ sơ › Lỗi & bài về nhà: tích chọn lỗi, nút "Giao luyện tất cả" / "Giao các lỗi đã chọn"; bảng "Bài về nhà cô đã giao" có kết quả (còn x lỗi, chưa đạt, đạt…).
- Phiếu cả lớp mới giao (thẻ Giao phiếu bài cho lớp) và phiếu theo dạng yếu đều là bài bắt buộc. Phiếu mẫu cũ không bắt buộc.
- Sửa khóa lỗi mẫu cho khớp với luyện lỗi.

## 23/10/2026 — Hồ sơ học sinh: 4 thẻ, biểu đồ mạng nhện, giao phiếu tự động theo dạng yếu
- Hồ sơ còn 4 thẻ: Tổng quan · **Hoạt động học tập** (gộp Học tập + Hoạt động: lịch học + khung giờ, tiến độ SGK, tỉ lệ đúng từng dạng, phần thưởng, hoạt động gần đây) · Lỗi & bài về nhà · Ghi chú & giao bài.
- Tổng quan: **Sức mạnh Toán vẽ bằng biểu đồ mạng nhện** (SVG, tháng này + tháng trước nét đứt; mạch chưa đủ bài để xám, có ghi chú khi dưới 3 mạch). Bên phải: điểm từng mạch + Cảnh báo. Bỏ khung "Gợi ý cho cô"; các gợi ý còn lại thành nhãn trong Cảnh báo (Nhắc đọc kỹ đề, Ôn lại cách làm, Cần hỗ trợ nhiều, Nhắn phụ huynh, Khen em).
- **Giao phiếu theo dạng bài em còn yếu**: dạng đúng dưới 50% (làm ít nhất 4 lần) có thẻ gợi ý; app tự soạn phiếu 8 câu (dễ trước, vừa sau) từ các đảo em đã học, hạn 2 ngày, đạt 80%. Cô chỉ bấm Giao / Xem trước câu hỏi / Bỏ qua (hiện lại được). Dạng đã giao chưa làm ghi "chờ em làm". Dạng 50–70% ghi "Nên luyện thêm". Bảng tỉ lệ đúng từng dạng ở mục mở rộng, dòng yếu tô đỏ. Bỏ cách cô tự chọn tiết.
- Kết quả phiếu theo dạng tính vào tỉ lệ đúng của dạng đó (`a.kinds`, `a.ten`; `phQs`, `phSubmit` được bọc).
- Sửa lỗi ô "Nhận xét" tràn khỏi khung; thanh thẻ hồ sơ không còn rơi xuống cuối trang trên điện thoại.

## 23/10/2026 — Hồ sơ học sinh cho giáo viên; chỉ còn tài khoản tiểu học
- Bấm tên em (bảng Tiến độ, Cần chú ý) → **Hồ sơ học sinh** kiểu trang giáo viên, 5 thẻ (`js/core/59-ho-so-giao-vien.js`):
  - Tổng quan: chuỗi ngày, số ngày học, số câu, đúng ngay lần đầu, giây/câu (và % trả lời dưới 3 giây), số lần mở hướng dẫn; Sức mạnh Toán 6 mạch so tháng trước; Gợi ý cho cô; cảnh báo.
  - Học tập: lịch học cả năm (bấm ô xem ngày), tiến độ SGK theo chủ đề + đảo bị kẹt, tỉ lệ đúng từng dạng bài.
  - Lỗi & bài về nhà: Sổ lỗi sai, phiếu đã giao và kết quả.
  - Hoạt động: sao, xu, thú cưng, thẻ, nhận xét, khung giờ học, hoạt động gần đây.
  - Ghi chú & giao bài: ghi chú riêng của cô (em, phụ huynh không thấy), tặng thẻ, nhận xét, **giao phiếu riêng cho 1 em**.
- Ghi thêm mỗi câu (mọi bản, kể cả bản học sinh): đúng ngay lần đầu, đúng sau khi sửa, trả lời dưới 3 giây, số lần mở hướng dẫn, khung giờ (`st.dd[ngày].f/fc/fx/fast/gd/h`).
- Phiếu bài lọc theo lớp và theo em (`a.lop`, `a.hs`).
- **Bỏ tài khoản lớp 6–9** (bản đầy đủ và bản học sinh `jenny06…09`). Dữ liệu mẫu: khối 1 (1A, 1B) và khối 2 (2A, 2B), mỗi lớp 12 em; Cô Jenny 1A, 1B · Cô Hoa 2B, 5A, 5B · Thầy Minh 2A, 3A, 4A. Dữ liệu học mẫu 5 tuần (ngày demo 36).

## 23/10/2026 — Nhiều lớp, nhiều giáo viên, trang Quản lý trung tâm
- Dữ liệu mới (`js/core/58-lop-va-quan-ly.js`): Trung tâm → Năm học → Lớp (khối, tên, gói Toán Jenny) → Học sinh (ghi danh 1 lớp chính). Giáo viên ↔ lớp nhiều–nhiều. Dữ liệu mẫu: Cô Jenny (1A, 1B), Cô Hoa (1C, 5A, 5B), Thầy Minh (2A…9A); thêm 5 học sinh mẫu.
- Giáo viên: màn đầu là **"Lớp của tôi"** (thẻ lớp theo khối: sĩ số, học hôm nay, cần chú ý, nhãn Toán Jenny). Vào lớp có nút "← Lớp của tôi" và đổi lớp nhanh. Bản thử có ô chọn tài khoản giáo viên.
- Toán Jenny **theo lớp**: em được học khi lớp có gói hoặc quản lý bật ngoại lệ. Buổi mở theo từng lớp. Bỏ thẻ "Kích hoạt Toán Jenny" ở trang giáo viên. Phiếu bài giao theo lớp.
- Vai mới **Quản lý**: tạo lớp, phân công/bỏ phân công giáo viên (bấm 2 lần), xếp và chuyển lớp (giữ dữ liệu), thêm học sinh (tự tạo tên đăng nhập), thêm giáo viên, gắn/tắt gói Toán Jenny, ngoại lệ từng em, nhật ký thao tác.
- Bản học sinh không đổi (`ORG_ON=false` trong `tools/_student.py`).

## 23/10/2026 — Trang giáo viên: tách Toán Jenny khỏi bảng tiến độ
- Bảng "Tiến độ từng em" bỏ cột Toán Jenny; cột Cảnh báo không còn mục "Chưa xong … Toán Jenny".
- Toán Jenny thành phần riêng (mở buổi + tiến độ từng em đã kích hoạt), chỉ hiện khi lớp có ít nhất 1 em đã kích hoạt. Chưa ai kích hoạt thì ẩn cả phần này và ô số liệu Toán Jenny; thẻ "Kích hoạt Toán Jenny" vẫn còn để mở.

## 23/10/2026 — Trang giáo viên tạm trên GitHub (cách 1)
- Trang mới `games/lop-hoc-ao/giao-vien/` = bản demo đầy đủ + màn mật khẩu (`giaovien123`), mở sẵn vai Giáo viên, Lớp 1. Không cho máy tìm kiếm lập chỉ mục.
- Dữ liệu là dữ liệu mẫu, lưu trên máy người xem; chưa xem được kết quả thật của học sinh (cần máy chủ — cách 2).
- `tools/build.py` tự tạo trang này cùng trang học sinh (`tools/_teacher.py`).

## 23/10/2026 — Thẻ chào gọn
- Bỏ nút "Nghe Jenny" và chữ "Đảo nhà" dưới hình Jenny (chạm hình vẫn vào Đảo nhà).
- Ô sao và ô xu thành cột 2 hàng, đặt ngay sát bên phải "Vịnh … · Lớp n" / "Chào …!" (không đẩy ra mép phải). Ô xu chỉ còn "🪙 số ▸", chạm vẫn mở Cửa hàng. Giữ dòng "Bản …".

## 23/10/2026 — Dịch "Sổ đang trống…" sang tiếng Anh
- Sổ lỗi trống (tài khoản mới) có câu tiếng Anh.

## 23/10/2026 — Đảo nhà: bố cục mới
- Khung cảnh vẽ lại: đảo cát to có bãi cỏ phía sau, mỏm đá ngoài biển, sóng, mây; giữ tỉ lệ 16:10 và phóng theo màn hình (điện thoại, máy tính đều cân).
- Mỗi đồ có chỗ hợp lý, đứng trên mặt đất: cây dừa (cỏ trái), cờ CLB (cỏ phải), hải đăng (mỏm đá ngoài biển), lâu đài cát (cát trước), ô che nắng (cát trước phải), thuyền buồm (mặt nước phải); ổ rơm, máy ấp trên bãi cỏ giữa; máng ăn bên trái; thú cưng đi lại trên bãi cát giữa. Vật ở gần (thấp) che vật ở xa.
- Cửa hàng › Đảo nhà xem trước bằng đúng bố cục này.

## 23/10/2026 — Bỏ dòng nhắc ở Mũ & kính và Khung ảnh
- Bỏ dòng "Em đeo được nhiều món cùng lúc…" và "Khung hiện quanh ảnh Jenny…" (chức năng giữ nguyên).

## 23/10/2026 — Mặt trời, mặt trăng trôi ngang trong tầm nhìn
- Biển Hoàng hôn (mặt trời) và Biển Đêm sao (mặt trăng): mặt trời/trăng luôn nằm trong phần biển đang thấy và trôi ngang chậm từ trái sang phải (khoảng 50 giây một lượt), cả khi em kéo bản đồ sang ngang.

## 23/10/2026 — Sửa mặt trời Biển Hoàng hôn chớp nháy
- Mặt trời bị đặt lại chỗ ngẫu nhiên mỗi khung hình nên nhảy lung tung, chớp nháy. Nay đặt 1 lần, đứng yên; vệt nắng dưới mặt trời lung linh chậm, nhẹ hơn. (Biển Hoàng hôn = chủ đề cuối năm mọi lớp.)

## 23/10/2026 — Dùng thật: khoá đảo, làm mới tài khoản, tài khoản thử Lê Bảo Na
- **Khoá đảo và màn** cho mọi học sinh: mở dần theo tiến độ (qua Màn 1 mở đảo sau; hạ trùm chủ đề mở chủ đề sau; màn sau mở khi qua màn trước). Xong T-01.
- **Làm mới toàn bộ tài khoản**: bản học sinh lưu khoá mới `jennyHS2_…` (xoá dữ liệu cũ), bản đầy đủ `_v10`; mọi học sinh bắt đầu từ đầu (40 xu).
- **Tài khoản thử Lê Bảo Na**: mở tất cả + 10 000 xu, có bài cô giao mẫu. Bản học sinh: đăng nhập `lebaona` / `jenny123` (hoặc tài khoản nào đặt tên đúng "Lê Bảo Na"). Bản đầy đủ: học sinh Lê Bảo Na.
- Học sinh thật không còn bài cô giao mẫu. Nút "Mở khóa tất cả" chỉ còn ở thanh demo bản đầy đủ (mặc định khoá).

## 23/10/2026 — Tủ đồ: khung không tràn, khung hiện rõ, đeo nhiều phụ kiện
- Khung ảnh vẽ vào phía trong (không tràn đè lên phần khác) ở Tủ đồ, Cửa hàng và ô chọn khung.
- Chọn khung → cả khung cảnh Jenny trong Tủ đồ có viền khung đó; ảnh Jenny ở thẻ chào (Bản đồ) cũng có khung (trước bị CSS khác che mất).
- **Đeo nhiều món cùng lúc**: 1 mũ (lưỡi trai, phù thuỷ, vương miện…) + 1 kính + 1 nơ/kẹp tóc. Chạm món đang đeo để bỏ ra; chọn mũ khác thì thay mũ cũ. Ô "Bỏ hết". Jenny ở mọi nơi (thẻ chào, câu hỏi, Cửa hàng) đeo đủ các món. Tiến độ cũ (1 món) được giữ.

## 23/10/2026 — Tủ đồ: mỗi loại đồ là một trang riêng
- Trang Tủ đồ: Jenny lớn + 3 nút Áo váy · Mũ & kính · Khung ảnh. Chạm nút → sang trang riêng của loại đó (Jenny nhỏ ở trên để xem ngay, lưới đồ, "Mua thêm …"); nút "← Tủ đồ" để quay lại.

## 23/10/2026 — Đổi tên "Gian hàng" thành "Cửa hàng"
- Tiêu đề "Cửa hàng Jenny" và mọi chỗ nhắc (Đảo nhà, máy ấp, thẻ chào…) thống nhất với nút "Cửa hàng" ở thanh dưới.

## 23/10/2026 — Cửa hàng: thử 1 dòng trượt ngang rồi bỏ
- Thầy thấy dạng trượt không ổn → trở lại 2 dòng như trước.

## 23/10/2026 — Nút chọn nhóm đồ nuôi
- **Túi đồ** (Đảo nhà) và **Cửa hàng › Đồ nuôi** có 5 nút: Thức ăn · Thuốc & tắm · Đồ chơi · Đồ mặc · Nhà & máy. Chạm nút nào hiện đồ nhóm đó; Túi đồ ghi số món mỗi nhóm, nhóm trống có nút "Mua ở Cửa hàng".
- Đảo nhà: nút xu ghi "Cửa hàng ▸" (thay "Gian hàng").

## 23/10/2026 — Bỏ "Đang có: n" ở dạng Thêm cho đủ
- Dạng "Thêm cho đủ … / Bớt" không còn hiện số đang có; Jenny cũng không đọc sẵn số đã có mà nhắc "Em đếm xem đang có mấy …" (cả màn đảo và phiếu bài).

## 23/10/2026 — Tủ đồ gọn hơn
- Bỏ 3 ô "Mua ở Cửa hàng" lặp lại ở từng mục; mục chưa có đồ hiện dòng chữ nhỏ. Chỉ giữ nút "Mua thêm đồ" cuối trang và nút xu "Cửa hàng ▸" trên cùng.
- Ô đồ không còn kéo giãn quá to trên máy tính.
- 3 mục **Áo váy · Mũ & kính · Khung ảnh** thành 3 nút trên một hàng (hiện món đang dùng và số món). Chạm nút nào thì chỉ hiện đồ của mục đó. "Mua thêm đồ" mở đúng mục đó trong Cửa hàng.

## 23/10/2026 — Chỉ dẫn thông báo
- Nút thanh dưới có số/"!" đỏ → vào trang thấy khung vàng **"Jenny nhắc em"** nói rõ việc cần làm, có nút đi tới.
- Chỗ cần chú ý **nhấp nháy viền đỏ** + nhãn **Mới**: đảo mới mở (Bản đồ), buổi Toán Jenny mới, ô Bài cô giao / Luyện lỗi / Đảo nhà (Nhà em), từng bài chưa làm (Bài cô giao). Đảo nhà liệt kê thú cưng cần gì (đói, ốm, bẩn, chưa đặt tên, trứng chưa ấp).

## 23/10/2026 — Sửa lỗi "Làm tiếp" phiếu bài
- Bấm Làm tiếp/Làm bài bị lỗi khi câu đầu là dạng kéo số vào ô (Bài 1 Tiết 3 lớp 1). Đã sửa; thử 280 lần mở/làm tiếp ở lớp 1–5 không lỗi.

## 23/10/2026 — Bài cô giao thành Phiếu bài, tách riêng khỏi đảo
- Cô chọn **1 hay nhiều tiết**, **số câu** (5–20), **hạn nộp**. Câu lấy từ kho câu các tiết đó; mỗi em cùng dạng nhưng số khác (đề lưu bằng seed, xem lại được).
- Làm kiểu vở bài tập: không tim, không trùm, không báo đúng/sai từng câu; nút **Để sau**, **Nộp bài** (hỏi lại nếu còn câu chưa làm). Thoát giữa chừng vẫn giữ bài đang làm ("Đang làm x/n" → "Làm tiếp").
- Nộp xong: trang kết quả (điểm, lời khen, từng câu đúng/sai + đáp án, cả đáp án dạng hình). Câu sai vào Sổ lỗi, không bắt luyện ngay. Nộp lần đầu +10 xu. **Không** cộng sao, không mở đảo.
- Làm lại = số mới; lưu lần đầu, lần gần nhất, lần tốt nhất.
- Trang giáo viên: khung **Giao phiếu bài** (chọn nhiều tiết, số câu, hạn); pill điểm lần đầu → tốt nhất; dòng "Dạng sai nhiều".

## 23/10/2026 — Phòng học của em
- Nhà em có khung **Phòng học của em** (dưới khung Nhà, trên Tủ đồ) với 3 ô: **Bài cô giao**, **Luyện lỗi**, **Tự luyện** (sắp có).
- **Luyện lỗi** bỏ khỏi thanh dưới; thanh dưới còn 4 nút. Nút Nhà em báo số bài chưa làm (hoặc "!" khi có lỗi cần sửa).
- **Bài cô giao**: cô giao 1 màn của 1 tiết cho cả lớp, có hạn nộp. Học sinh thấy 2 phần: "Cần làm" (bài mới nhất lên đầu, gắn Mới/Chưa làm/Chưa đạt/Quá hạn) và "Đã làm" (kết quả tốt nhất, số lần làm, kết quả lần đầu, ngày nộp). Được làm lại để cải thiện.
- Trang giáo viên (bản đầy đủ): khung **Giao bài** — chọn tiết, màn, hạn; xem kết quả từng em; xoá bài giao.

## 23/10/2026 — Trò chơi: 10 lượt/ngày
- Mỗi ngày chơi tối đa **10 lượt** (trước 5). Giá giữ nguyên.

## 23/10/2026 — Tủ đồ: phối đồ cho Jenny
- Nhà em có khung mới **Tủ đồ** (dưới 3 ô, trên Trò chơi): xem Jenny đang mặc gì, số món đang có, nút **Phối đồ ▸**.
- Trang Tủ đồ: Jenny lớn ở trên; 3 nhóm **Áo váy** (áo Hộ chiếu + áo mua), **Mũ & kính**, **Khung ảnh**. Chạm là mặc ngay và lưu; có ô "Không đội/Không khung", "Áo xanh gốc" để bỏ ra. Món đang dùng có viền xanh "Đang dùng". Chưa có món nào thì có ô "Mua ở Cửa hàng".
- Đồ cho thú cưng vẫn mặc ở Đảo nhà.
- Nút **Phối đồ ▸** thu nhỏ, đặt góc phải dưới, cùng kiểu nút "Mua thêm trò chơi".

## 23/10/2026 — Sửa theo góp ý: xà phòng, thanh mua, nút đóng hướng dẫn
- Cửa hàng › Đồ nuôi: hiện **Xà phòng (5 lần)** trong nhóm "Thuốc & tắm" (trước bị ẩn vì sai nhóm).
- Chọn món nào trong Cửa hàng thì **thanh mua nổi** hiện ngay trên thanh dưới (tên, mô tả, nút Mua/Dùng, nút bỏ chọn) — không phải kéo lên đầu trang.
- Hộp Hướng dẫn: nút **"Đóng ✕"** nền vàng, nhìn rõ (trước đó nút bị cùng màu nền nên như không có).

## 23/10/2026 — Bowling mới, Đẩy thùng 48 màn
- **Bowling** làm lại: nhìn từ sau người ném (phối cảnh), kéo bóng chọn chỗ đứng, **vuốt lên để lăn** (hướng + lực theo cú vuốt, vuốt cong = bóng xoáy), ki bay đổ dây chuyền, **STRIKE!/SPARE!** có pháo giấy, bảng điểm 5 lượt tính như bowling thật. Cúp 60/90/120 điểm (thử 240 ván giả lập ở 3 mức tay nghề).
- **Đẩy thùng**: 48 màn (8 tự vẽ + 40 sinh tự động bằng cách "kéo ngược" thùng từ đích, đã giải lại bằng máy để chắc giải được và biết số bước ít nhất). Mỗi lượt chơi 3 màn liên tiếp; Vàng = xong 3 màn với tổng bước ≤ 1,25 × ít nhất + 2; Bạc = xong 3 màn; Đồng = xong ≥ 1 màn.

## 23/10/2026 — Kho trò chơi (vé chơi game)
- Cửa hàng › **Trò chơi**: 3 trò không cần Toán — **Bowling**, **Đẩy thùng** (8 màn, đã kiểm tra giải được), **Khủng long chạy**.
- Nhà em: giữ 3 ô như cũ; thêm khung **Trò chơi** bên dưới, liệt kê các trò em đã mua để vào chơi.
- Mua trò 150 xu (kèm 10 lượt); vé 10 lượt 60 xu; lượt dùng chung; mỗi lần vào chơi = 1 lượt; tối đa 5 lượt/ngày.
- Cúp Đồng/Bạc/Vàng: Bowling 15/25/33 điểm · Khủng long 150/400/800 · Đẩy thùng theo số bước (Vàng ≤ ít nhất + 2).
- 3 cúp Vàng ở một trò → đồ hiếm: Mũ vô địch Bowling, Mũ thợ mỏ (Jenny), Khăn khủng long (thú cưng, không cũ đi).
- Bản đầy đủ: học sinh thử Lê Bảo Na có 10 000 xu để thầy kiểm tra (nạp một lần).

## 22/10/2026 — Màn "Vẽ hình" (vẽ tay)
- Thêm **màn vẽ hình** ở các đảo hình học (không thay màn cũ): lớp 1 Bài 7, Bài 9; lớp 2 Bài 26, Bài 34; lớp 3 Bài 19, Bài 20; lớp 5 Bài 25, Bài 32.
- Học sinh vẽ tay hình vuông, hình chữ nhật, hình tam giác (lớp 2–5 có thêm hình tứ giác) trên giấy chấm; 4 hình mỗi màn, 3 tim; sai 2 lần hiện chấm gợi ý.
- Phản hồi chỉ "Đúng rồi!" / "Chưa đúng" + câu động viên; có tiếng Anh khi bật EN.
- Màn này lưu sao riêng (`s.draw`), không ảnh hưởng mở khoá đảo, sao chủ đề, hộ chiếu.
- Nhận dạng: bao lồi → khớp tam giác/tứ giác → kiểm tra khép kín → góc vuông, tỉ lệ cạnh (`js/core/50-ve-hinh.js`).
- Sửa: hình chữ nhật hơi gần vuông (cạnh dài gấp 1,15–1,3 lần cạnh ngắn) giờ được chấp nhận là hình chữ nhật (trước đây bị chấm là hình vuông).

## 20/10/2026 — Sửa trò Lật thẻ ghép đôi
- Lỗi: thẻ "phép tính" có thể là câu tìm số còn thiếu (ví dụ "6 + ☐ = 14" ghép với 8, "390 = 300 + ☐" ghép với 90, "33% × 4 = ?%" ghép với 132) — nhìn như hai thẻ không cùng giá trị.
- Sửa: chỉ lấy phép tính trọn vẹn (không ô trống, không dấu =, không dấu ?) làm thẻ.
- Thêm kiểm tra `tools/test/the-ghep-doi.js`: 20 100 bộ thẻ lớp 1–5, mọi cặp đúng giá trị, không hai cặp trùng giá trị.

## 20/10/2026 — Gian hàng Jenny, Đảo nhà & thú cưng, tiếng Anh lớp 1
- **Gian hàng Jenny** (bảng giá thầy duyệt): Áo váy, Mũ kính, Khung, Đảo nhà, Thú cưng, Đồ nuôi, Vé game (sắp có). Chạm để thử miễn phí, Mua bằng xu. Vào bằng ô xu ở thẻ chào.
- Jenny đội mũ/kính đã mua ở mọi nơi; khung ảnh hiện quanh ảnh Jenny ở thẻ chào.
- **Đảo nhà của em**: chạm ảnh Jenny ở thẻ chào. Thú cưng sống trên đảo, chỉ số No/Vui/Sạch/Sức khoẻ theo ngày thật; cho ăn, tắm, chơi, chữa, mặc đồ, cưng nựng; đặt tên.
  - Nuôi 1 loài, tối đa 2 con; vòng đời ~6 tuần (Bé → Lớn dần → Trưởng thành → Già); mất khi già, có Sổ kỷ niệm; chờ 3 ngày mới nuôi con mới.
  - Bỏ đói/ốm nặng liên tục 3 ngày → thú bỏ đi (thư tạm biệt).
  - 2 con trưởng thành + Ổ rơm → có thể đẻ trứng; Máy ấp 3 ngày cho nở; trứng không ấp hỏng sau 2 ngày; bán được trứng.
  - Đồ dùng cũ dần; Túi đồ có bán thanh lý (nửa giá × độ mới). Máng ăn tự động cho ăn khi em vắng.
  - Mỗi lần qua màn, thú cưng vui thêm. Dấu ! đỏ ở ảnh Jenny khi thú cần chăm.
- Đảo nhà: bỏ hình học sinh (Jenny) trên đảo, chỉ còn thú cưng và đồ trang trí.
- Chế độ tối (MacBook): Gian hàng, Đảo nhà, Nhà em dùng màu theo chế độ tối — chữ không còn hoà vào nền.
- **Thanh dưới mới**: Bản đồ · Toán Jenny · Luyện lỗi · **Nhà em** · **Cửa hàng**. "Nhà em" mở 3 ô: Đảo nhà, Sưu tập, Hồ sơ (Hồ sơ vẫn có nút Đăng xuất).
- **Thú cưng bắt đầu 2 loài**, có mô tả và tuổi thọ: Gà con 40–50 ngày (150 xu), Rùa biển 100–200 ngày (250 xu). Các giai đoạn lớn tính theo tuổi thọ từng con.
- **Tiếng Anh lớp 1** bật: đề, lời giải, hình, hướng dẫn, bài giảng, Jenny đọc giọng Anh – Anh. Công cụ rà `tools/test/tieng-anh.js`: 0 chuỗi sót.

## 20/10/2026 — Nút Đăng xuất hiện sẵn
- Bản học sinh: bỏ ô chữ cái tên (J) và menu thả; nút **Đăng xuất** nằm ngay trên thanh trên cùng (EN: Log out).
- Màn rất hẹp (≤440px): ẩn chữ "Toán cùng Jenny", giữ ngôi sao để vừa hàng.
- Sửa chế độ tối: hộp Hướng dẫn luôn nền sáng, chữ xanh đậm (trước đây chữ trắng trên nền kem, rất khó đọc).
- Tên tạm **JennyClub** + logo đám mây pixel (chữ J ba màu logo Clb), chữ "Jenny" nhiều màu, nhãn "Club" xanh lá; điện thoại: chữ xếp 2 dòng.
- Nút Đăng xuất kiểu pixel: khung viền khía góc, bóng đổ, chữ VT323, biểu tượng cánh cửa pixel; bấm lún xuống.
- Thêm khung dịch tiếng Anh (48, 48b) — chưa bật, chờ dịch xong lớp 1.

## 2026-10-20 — Nút Đăng xuất dễ tìm hơn
- Ô chữ cái tên có thêm dấu ▾ để biết chạm vào sẽ mở bảng (có nút Đăng xuất).
- Cuối trang Hồ sơ có thêm nút Đăng xuất.
- Lưu ý: bản đầy đủ (giáo viên/phụ huynh/demo) không có đăng nhập nên không có Đăng xuất; chỉ bản học sinh có.

## 2026-10-20 — Đầu trang gọn; nút ngôn ngữ VI | EN (giai đoạn 1: giao diện)
- Bản học sinh: thanh trên cùng chỉ còn "Toán cùng Jenny" (ngôi sao), nút [VI | EN], nút nhạc và ô chữ cái tên. Chạm ô tên mở bảng nhỏ: tên, lớp, tài khoản, nút Đăng xuất (đỏ). Bỏ hình đại diện, tên, lớp lặp với thẻ "Chào".
- Nút VI | EN (cả bản đầy đủ): EN đổi chữ giao diện — thanh điều hướng, nút bấm, thông báo đúng/sai, kết thúc màn, hướng dẫn, nhắc luyện lỗi, Hồ sơ, Sưu tập, trang đảo (phần khung). Lựa chọn được nhớ trên máy.
- Chưa dịch (giai đoạn 2, làm theo từng lớp): đề bài, tên chủ đề, tên đảo, bài giảng, lời Jenny đọc.

## 2026-10-20 — Bắt buộc luyện lỗi trước khi chơi tiếp; bản đồ về "Đang học"
- Câu sai trong màn học hoặc trò chơi được ghi lại. Xong màn/trò đó, muốn vào màn hay trò khác thì Jenny nhắc "Em vừa làm sai n câu. Mình luyện lại một lượt rồi chơi tiếp nhé!" kèm nút "Luyện ngay". Màn hình kết thúc có thêm dòng nhắc và nút "Luyện lỗi (n)" đứng đầu.
- Lượt luyện chỉ gồm các câu vừa sai (≤ 3 lỗi: mỗi lỗi câu cũ + 1 câu giống vậy; nhiều hơn: mỗi lỗi 1 câu cũ). Làm hết lượt là mở khoá; có hướng dẫn khi sai như Luyện lỗi. Lỗi chưa đúng 2 lần liền vẫn nằm trong sổ để luyện tiếp sau.
- Bản đồ: đi từ tab Toán Jenny, Luyện lỗi, Sưu tập, Hồ sơ về thì màn hình đặt đúng chỗ "Đang học"; từ trong đảo về thì về đúng đảo vừa vào.

## 2026-10-20 — Rà soát khung hình và cân bằng hai chiều câu hỏi
- So sánh qua hình ("Chọn dấu đúng: 5 … 4"): hai nhóm luôn nằm ngang hàng hai bên dấu "…", đồ vật tự thu nhỏ cho vừa.
- Hai hàng ghép đôi (bóng bay – cá…): mỗi đồ vật nằm trong một ô cùng bề rộng nên thẳng cột từng cặp, cả khung luôn vừa màn hình 360px.
- Bảng số liệu, biểu đồ tranh trong màn chơi (lớp 2–5): không còn tràn ra ngoài màn hình (trước bị bảng chung của trang giáo viên ép rộng 640px); đủ viền mọi ô; hình trong ô thu nhỏ cho vừa.
- Lớp 1 "Chạm vào khung có … nhất": một nửa hỏi ít nhất, một nửa hỏi nhiều nhất. Lớp 2 "Loại đồ vật nào có …": nhiều nhất hoặc ít nhất.
- Mọi bài sắp xếp (lớp 1–5, số, phân số, số thập phân, số đo): một nửa hỏi "từ bé đến lớn", một nửa "từ lớn đến bé".
- Bài "… nào lớn nhất?" / "… nào bé nhất?" (kết quả phép tính, phân số, số…): một nửa đổi chiều khi tính được giá trị các phương án.
- Thêm công cụ rà khung hình: mọi dạng câu của lớp 1–5 được dựng ở khổ 360px, kiểm tra phần tử tràn màn hình, tràn khung, hai nhóm so sánh không ngang hàng.

## 2026-10-20 — Hướng dẫn bài dùng tính chất
- "Biết 1 + 7 = 8. Vậy 7 + 1 = ?" (lớp 1) và "a + b = b + ☐" (lớp 4): không hướng dẫn cách cộng nữa mà nhắc tính chất. Hai phép tính tô cùng màu cho cùng một số, mũi tên ⇄; Jenny nói "Đổi chỗ các số hạng thì tổng không đổi. Không cần tính lại!"; hỏi trắc nghiệm rồi chốt "7 cộng 1 cũng bằng 8".
- "Biết 2 × 10 = 20. Vậy 20 : 2 = ?" (lớp 2): "Từ một phép nhân viết được hai phép chia — lấy tích chia cho thừa số này thì được thừa số kia".

## 2026-10-20 — Bàn tay: đếm lần lượt từ trái sang phải
- Hướng dẫn bằng bàn tay (lớp 1): giơ ngón như cũ (trỏ, giữa, áp út, út, cái), nhưng khi đếm thì đếm các ngón đã giơ lần lượt từ trái sang phải trên màn hình. Đếm thêm: giơ các ngón mới cùng lúc (viền vàng) rồi đếm tiếp từ trái sang phải. Phép trừ: gập và đếm số ngón gập cũng từ trái sang phải, rồi đếm số ngón còn lại.
## 2026-10-20 — Hướng dẫn chỉ có trong Luyện lỗi; lỗi trò chơi vào sổ; thêm 3 dạng đếm
- Thống nhất với thầy: màn học và trò chơi không hiện hướng dẫn, học sinh làm/chơi bình thường; câu sai lần đầu được ghi vào sổ lỗi kèm đúng câu đó và đáp án em đã chọn/ghi.
- Lỗi trong trò chơi (Ếch nhảy, Thả mồi, Trồng cây, Leo núi, Đập chuột…) cũng được ghi vào sổ lỗi, có tên trò.
- Luyện lỗi: câu 1 là đúng câu em đã sai, có dòng "Lần trước em chọn 8, chưa đúng. Em làm lại nhé!"; câu 2 là câu giống vậy với số mới. Có nút "Xem cách làm" để xem trước. Sai thì hướng dẫn tự mở ngay; xem xong làm lại câu đó (không tính vào sửa lỗi). Đúng 2 lần liền thì lỗi ra khỏi sổ như cũ. Thẻ "Chưa đúng" trong Luyện lỗi không còn ghi "mất 1 tim".
- Thêm hướng dẫn đếm lớp 1: tìm khung có đúng số lượng (đếm từng khung, ghi số dưới khung, khung đúng tô xanh); xếp hình bằng hình vuông (đánh số từng ô); đếm khối lập phương (đếm từng cột, từ dưới lên, ghi "2 + 2 = 4").
- Chỉ lưu lại nguyên câu cũ cho 30 lỗi gần nhất để không đầy bộ nhớ máy; lỗi cũ hơn thì luyện bằng câu cùng dạng.

## 2026-10-20 — Hướng dẫn khi đếm sai (lớp 1)
- Bài "Có mấy …?" và "Có mấy hình …?" trong phạm vi 10: hướng dẫn khoanh lần lượt từng đối tượng bằng vòng pixel đỏ, đánh số 1, 2, 3… ngay góc vòng, Jenny đếm to; đối tượng cuối cùng được khoanh là số cần tìm.
- Jenny nhắc cách đếm: từ trái sang phải, từ trên xuống dưới, đếm cái nào khoanh cái đó để không sót, không đếm hai lần.
- Đếm hình: các hình khác loại được làm mờ, chỉ khoanh đúng loại hình được hỏi.

## 2026-10-20 — Hướng dẫn khi làm sai · Lô 2a đã bật
- Đặt tính có nhớ (lớp 2–4): cộng, trừ, nhân với số có một chữ số. Bảng có hàng C, Đ (Tr, N); cột đang tính sáng vàng; câu trắc nghiệm ở hàng có nhớ đầu tiên; cộng: số nhớ đỏ trên hàng bên trái; trừ: số 1 nhớ đỏ nhỏ cạnh chữ số của số trừ ("2 thêm 1 bằng 3").
- So sánh số (lớp 1–4): chỉ dùng bảng hàng (N, Tr, C, Đ). Hàng bằng nhau tô xanh, hàng khác nhau tô vàng; hỏi "số nào lớn hơn?" rồi chọn dấu.
- Bảng nhân, bảng chia (lớp 2–3): dãy đếm thêm cách đều (5, 10, 15, 20), chia đều các dòng (8 số → 4 + 4, 7 số → 4 + 3), hai dòng tách rời, chỗ số chưa hiện được giữ sẵn để dãy không xô lệch; ghi số lần đếm; chia là đếm thêm số chia đến số bị chia rồi đếm số lần.
- Câu tương tự cho dạng "Đặt tính rồi tính" so cả phép tính trong hình, không chỉ chữ đề.
- Bài có dư không dùng câu hỏi gợi ý lời văn (để Lô 2b).

## 2026-10-20 — Số bản; đơn vị trong lời giải leo núi; câu tương tự đúng chiều; khung Lô 2a (chưa bật)
- Thẻ chào trên bản đồ có dòng nhỏ "Bản ngày/tháng · giờ:phút" (thời điểm dựng), để biết đang mở bản mới hay cũ.
- Leo núi: phép tính cuối của lời giải có đơn vị, ví dụ "29 + 24 = 53 (cái bánh)".
- Hướng dẫn khi sai: câu tương tự giữ đúng chiều câu vừa sai (cùng phép tính, cùng chỗ trống, cùng kiểu thêm/bớt, nhiều hơn/ít hơn).
- Lô 2a (đặt tính có nhớ, so sánh số, bảng nhân chia): đã dựng hoạt cảnh, đang chờ thầy duyệt nên chưa bật (GD_EXT .on = false).

## 2026-10-20 — Sơ đồ: tổng dùng móc nhọn dọc, hiệu dùng móc nhọn ngang
- Hiệu – tỉ và tổng – hiệu: phần dài hơn của đoạn lớn tô hồng, phía trên có móc nhọn ngang ôm đúng phần đó, ghi "Hiệu: …".
- Móc nhọn tổng khớp đúng mép trên đoạn lớn và mép dưới đoạn bé.
- Sơ đồ tổng – hiệu, tổng – tỉ: thay đường ngang bằng móc nhọn dọc "}" bên phải ôm cả hai đoạn, chữ "Tổng: …" đứng cạnh mũi móc, giống cách vẽ trong sách.

## 2026-10-20 — Hướng dẫn khi làm sai (Lô 1); số sao chủ đề cạnh tên vùng biển
- Sai lần 1: thẻ "Chưa đúng" có thêm nút "Xem hướng dẫn". Sai lần 2: hướng dẫn tự mở. Xem xong, em làm lại đúng câu đó (không mất tim), đúng thì làm thêm 1 câu tương tự (+2 xu). Chỉ trong màn học và Luyện lỗi; Đua giờ, Kho báu, Trùm lớp không có.
- Khung hướng dẫn: hoạt cảnh pixel chạy từng bước, Jenny đọc lời, nút Xem lại, Chậm hơn, Em làm lại.
- Lớp 1, cộng/trừ trong phạm vi 10: hai bàn tay ngửa. Cộng gộp (mỗi tay một số, đếm hết), đếm thêm từ số lớn (ngón mới viền vàng, số đỏ), trừ gập bớt (ngón đang gập viền đỏ, ▼) rồi đếm số ngón còn lại, tìm số còn thiếu.
- Lớp 2, cộng/trừ trong phạm vi 20: ếch nhảy trên tia số. Qua 10 thì hỏi trắc nghiệm "thêm/lùi mấy để về 10?", nhảy tới 10 rồi nhảy tiếp; có 2 khung 10 ô. Câu có ô trống thì đếm số bước nhảy.
- Toán có lời văn (lớp 2–5, cả lớp 1 với số lớn hơn 10): tô vàng các số, gạch chân câu hỏi; từng bước hỏi trắc nghiệm "Cần làm phép tính gì?" và "Phép tính đúng là?", chọn sai thì Jenny gợi ý từ khoá.
- Tổng – hiệu (lớp 4), tổng – tỉ, hiệu – tỉ (lớp 5): sơ đồ đoạn thẳng pixel và 3–4 câu trắc nghiệm theo các bước giải.
- Chỉ hiện hướng dẫn khi đọc được chắc chắn phép tính trong lời giải (khoảng 3 000 dạng câu). Bài có %, phân số ở kết quả hoặc đổi đơn vị chưa có hướng dẫn (để Lô 2).
- Bản đồ: dòng 2 của mỗi chủ đề là [vùng biển] [★ số sao]; dòng 3 là "Bài … · … đảo · trùm …". Đủ sao thì nhãn sao xanh lá.

## 2026-10-19 — Bỏ chữ "Hệ …" sau tên trùm
- Tên trùm không còn đuôi "· Hệ Kẹo ngọt", "· Hệ Độc", "· Hệ Lửa"… (bản đồ, đảo, trận trùm). Màu trùm theo vùng biển vẫn giữ.

## 2026-10-19 — Tên chủ đề trên bản đồ: cùng cỡ chữ, tối đa 2 dòng
- Mọi chủ đề cùng một cỡ chữ (24px). Dòng 1 của tên nằm ngay cạnh nhãn "CHỦ ĐỀ n"; tên dài xuống dòng 2. Riêng tên dài hơn 2 dòng thì nhỏ bớt vừa đủ 2 dòng (hiện chỉ lớp 3 chủ đề 5 trên điện thoại hẹp).

## 2026-10-19 — Leo núi: lời giải gọn
- Khung lời giải chỉ còn câu dẫn và các phép tính; bỏ chữ "Bài giải" và dòng "Đáp số" (cả phần Jenny đọc).

## 2026-10-19 — Leo núi: bài giải có câu dẫn, chờ em đọc xong; Thả mồi xoá thông báo cũ
- Leo núi: sai 2 lần thì hiện khung "Bài giải" (chỉ một lần chữ này), có câu dẫn dựng từ câu hỏi (vd "Số quyển vở cửa hàng có là:"), từng phép tính một dòng, "Đáp số" có đơn vị. Jenny đọc bài giải.
- Không tự chuyển bài nữa: đồng hồ dừng, em bấm "Em hiểu rồi, leo tiếp ▶" mới sang bài mới. Chữ trong khung dùng phông dễ đọc có dấu.
- Thả mồi câu cá: thả mồi mới thì thông báo đúng/sai của câu trước biến mất.

## 2026-10-19 — Leo núi 5 chặng có khởi động; bản đồ quay lại đúng chủ đề
- Leo núi còn 5 chặng: 3 chặng đầu là bài khởi động rất đơn giản (một phép tính đã học, số nhỏ), 2 chặng sau là bài lời văn của tiết như trước.
- Bản đồ: vào đảo của chủ đề nào (hoặc chạm thẻ chủ đề nào) thì khi quay lại bản đồ sẽ ở đúng chủ đề đó, biển cuộn tới đúng đảo vừa vào.

## 2026-10-19 — Trò mới: Leo núi tìm kho báu
- Trò cho các tiết toán có lời văn. Jenny đeo ba lô leo núi 6 chặng. Mỗi bài toán giải đúng, Jenny leo dây lên trại kế tiếp, hiện "Chặng n/6 ✓". Lên cao: mây ở dưới, đại bàng bay qua, gần đỉnh có tuyết, trời ngả hoàng hôn.
- Sai 1 lần: đá lăn, "Cẩn thận!", đáp án sai bị khoá. Sai 2 lần: Jenny nghỉ ở trại, hiện đáp án đúng và lời giải ngắn, sang bài khác, không mất chặng nào. Không có tim, 300 giây.
- Lên đỉnh: mở rương báu (vàng, đá quý), pháo giấy, nhận huy hiệu "Nhà leo núi".
- Đề là bài lời văn của chính tiết, thiếu thì lấy của 1–4 tiết trước, luôn trong kiến thức đã học. Lớp 1–2 Jenny tự đọc đề, lớp 3–5 bấm loa để nghe.
- Có ở khoảng 27–47 đảo mỗi lớp (đảo có bài lời văn). Chia trò gộp về một chỗ, mỗi trò có bảng ưu tiên riêng theo lớp.

## 2026-10-19 — Trồng cây: vẽ lại Jenny tưới và cây lớn
- Jenny cầm bình đứng chờ; trả lời đúng thì bước tới luống, nghiêng bình, tia nước vòng cung rơi xuống gốc khoảng 1 giây, đất ướt, nước bắn; xong quay về. Đúng thì Jenny nhảy vui, sai thì mặt lo.
- Cây vẽ lại có viền và bóng, to hơn (cuối cùng cao gần nửa khung). 9 bậc khác nhau rõ: hạt trong hố → mầm 2 lá → 2 lá thật → cây non → cây cao (mưa, cầu vồng) → nụ → hoa → quả xanh → quả chín.
- Mỗi loài một dáng: táo tán tròn, cam tán dày, xoài tán cao và quả dài, dâu tây là bụi thấp quả treo, hướng dương thân cao bông to. Mỗi lần lớn có hiệu ứng phóng to và lấp lánh.
- Giữ nguyên cách chơi, giờ, điểm, cỏ dại, ốc sên, thu hoạch (`core/39k2-trong-cay-ve.js`).

## 2026-10-19 — Trò mới: Trồng cây
- Trò chuyển cảnh như Ếch nhảy: mỗi câu trả lời đúng, Jenny cầm bình tưới cây một lần (bình nghiêng, giọt nước rơi, lấp lánh), cây lớn thêm một bậc và hiện "Lần tưới n/8 ✓". Cây lớn qua 9 bậc: hạt → nảy mầm → hai lá → cây non → cây cao có cành → nụ → hoa nở → quả xanh → quả chín, rồi quả rơi vào giỏ.
- Cảnh đổi dần: sáng → trưa → chiều; có mưa rào và cầu vồng khi cây có cành; bướm, ong bay, mây trôi, hoa cỏ lay.
- Sai 1 lần: cây rũ xuống, mọc cỏ dại, thử lại. Sai 2 lần: ốc sên gặm lá, lượt đó cây không lớn, hiện đáp án đúng rồi sang câu khác. Không mất bậc đã lớn, không có tim.
- Mỗi đảo một loài cây: táo, cam, xoài, dâu tây, hướng dương. Ưu tiên lớp 1–2 (35 và 50 đảo), lớp 3–5 khoảng 22–25 đảo. Câu hỏi không vượt kiến thức đã học.

## 2026-10-19 — Trò mới: Thả mồi câu cá
- Cảnh pixel động: Jenny ngồi trên cầu gỗ cầm cần câu, hồ nước, lau sậy, mây, thùng cá. Chạm "Thả mồi" → dây quăng vòng cung, phao rơi xuống nước, chờ 1–3 giây, bóng cá bơi tới, phao chìm "Cá cắn câu!" → hiện câu hỏi (cùng nguồn câu đã lọc kiến thức như Ếch nhảy).
- Đúng: kéo cá lên, cá bay vào thùng, bảng "Con cá n/8 ✓". Sai 1 lần: cá giãy, đáp án sai bị khoá. Sai 2 lần: cá chạy mất, hiện đáp án đúng, thả lại mồi. Không mất tim. Câu đủ 8 con hoặc hết 120 giây thì kết thúc.
- Mỗi con cá trời đổi dần từ sáng tới hoàng hôn, mặt trời đi theo vòng cung; có vịt, rùa bơi ngang ở vài lượt. Có ở khoảng 26–46 đảo mỗi lớp (`core/39j-tha-moi-cau-ca.js`).

## 2026-10-19 — Sửa cá nhấp nháy
- Câu cá: hai khung vẫy đuôi gộp thành một tấm ảnh, đổi khung bằng cách dịch nền theo bước nên cá không còn nhấp nháy.

## 2026-10-19 — Cá pixel mới, nhãn phép tính một dòng
- Câu cá: vẽ lại cá pixel (6 màu) với 2 khung hình vẫy đuôi, nhấp nhô; nhãn (số, phép tính, tên đồ vật) luôn nằm trong khung trắng dưới bụng cá, không che cá.
- Nhãn phép tính dài (ví dụ "50 cm + 50 cm") không còn bị xuống dòng: chữ tự thu nhỏ cho vừa một dòng trong biển chuột, bóng bay, sao, cá. Chỉ phép tính rất dài (ví dụ "85 000 + 15 000") mới xuống 2 dòng gọn tại dấu phép tính, không tách số. Đã kiểm tra gần 10 000 nhãn ở 5 lớp.

## 2026-10-19 — Cá bơi, bóng đung đưa
- Câu cá: cá uốn mình vẫy đuôi khi bơi, nhịp mỗi con khác nhau, nhả bọt nước phía sau. Bóng bay: bóng đung đưa qua lại, phồng xẹp nhẹ, dây lắc theo; nhãn số lắc theo bóng. Tắt hiệu ứng khi máy bật "giảm chuyển động".

## 2026-10-19 — Cửa hàng Jenny: chậm lại, chỉ quầy hàng chuyển, tiền có màu như thật
- Sửa nút "Đưa lại", "Trả tiền" bị mất viền dưới (khung cửa hàng cắt mất bóng viền).
- Chuyển lượt chậm hơn (khoảng 3 giây): bảng "Khách n/8 ✓ Cảm ơn!" hiện đủ lâu để đọc. Chỉ phần quầy hàng (mái che, kệ, câu hỏi) trượt đi và trượt vào; phần "Em đưa", ví tiền, nút Đưa lại, Trả tiền đứng yên.
- Tờ tiền có màu gần với tiền Việt Nam thật (1 000 tím, 2 000 nâu, 5 000 xanh lam, 10 000 vàng xanh, 20 000 xanh dương, 50 000 hồng tím, 100 000 xanh lá, 200 000 đỏ nâu, 500 000 xanh ngọc; 100/200/500 đồng nâu ô liu / nâu cam / hồng đỏ); dùng cùng màu cho tờ tiền trong bài học lớp 2.

## 2026-10-19 — Nhãn dài không che hình
- Câu cá, Bóng bay, Hứng sao, Đập chuột, Ếch nhảy, Tàu hoả: nhãn được xếp theo độ dài. Tên đồ vật (ví dụ "Hộp sữa tươi") thành thẻ tên 2 dòng đặt dưới con cá / ngôi sao (cá to hơn), trong lòng bóng bay thì xuống dòng, chữ nhỏ lại; phép tính dài ("3 cm + 11 cm") chữ nhỏ lại. Đã rà các đảo có nhãn dài ở cả 5 lớp (khoảng 120 đảo mỗi trò).

## 2026-10-19 — Cửa hàng Jenny: chuyển lượt rõ ràng
- Mỗi lượt là một quầy khác (Quầy bánh, Sạp trái cây, Tiệm đồ chơi, Hiệu sách, Quầy kem, Tiệm hoa, Sạp rau, Quầy nước) với mái che, màu, tên quầy và số khách "Khách n/8". Trả đúng: tiền bay vào máy tính tiền (ting!), món hàng nhảy vào túi, bảng "Khách n/8 ✓ Cảm ơn!", quầy cũ trượt sang trái, quầy mới trượt vào từ bên phải.

## 2026-10-19 — Ghép hình: vẽ khối chính xác
- Khối trụ: mặt đáy trên là elip đủ, hai đường sinh thẳng, nửa elip đáy dưới (nửa sau nét đứt), có bóng sáng tối. Khối lập phương, khối hộp chữ nhật: đủ mặt trước, mặt trên, mặt bên và các cạnh; hình lớn có cạnh khuất nét đứt. Khối cầu: có bóng, đốm sáng và đường xích đạo (trước nét liền, sau nét đứt) để phân biệt với hình tròn.

## 2026-10-19 — Ếch nhảy: chuyển hàng rõ ràng
- Trả lời đúng: hiện bảng "Hàng n/8 ✓", lá súng mang ếch trôi xuống thành chỗ đứng mới, các lá khác trôi đi, nước cuộn, rồi hàng lá mới trôi vào từ phía trên. Mỗi hàng có cảnh khác nhau (đá, khúc gỗ, rùa, vịt, chuồn chuồn, khóm sen; nước sâu dần ở giữa sông); hàng đầu đứng trên bãi cỏ, các hàng sau đứng trên lá súng; bờ đích có cờ chỉ hiện khi gần tới.

## 2026-10-19 — Bối cảnh sống động cho mọi trò chơi thêm
- Mỗi màn có thêm lớp trang trí pixel chuyển động (`core/39g-boi-canh-song-dong.js`), không che vật chơi, tự dừng khi rời màn: Câu cá (tia nắng, rong rêu đung đưa, bong bóng, cá xa bơi), Bóng bay (mặt trời toả tia, mây 2 lớp trôi, chim vỗ cánh, cỏ cây lay), Hứng sao (sao nhấp nháy, sao băng, đồi xa, đom đóm), Đập chuột (mây trôi, cỏ lay, hoa đung đưa, bướm bay), Ghép hình (mây, mặt trời, vạch đường chạy, cờ bay), Cân (tường có cửa sổ mây trôi, đèn trần đung đưa, chậu cây treo), Cửa hàng (mái hiên phấp phới, chim nhỏ chớp mắt, thẻ giá đung đưa), Tàu hoả (mây và hàng cây trôi, chim, khói tàu), Kéo co (bụi dưới chân, dây rung), Đua giờ, Lật thẻ, Đồng hồ (dải biển nhỏ có mây và sóng). Máy bật "giảm chuyển động" thì chỉ hiện khung tĩnh.
- Sửa: bấm "Ghép hình pixel" có lúc chưa hiện màn chơi.

## 2026-10-19 — Ao ếch sống động
- Ếch nhảy: mặt nước lấp lánh trôi, cá nhỏ bơi qua lại dưới nước, gợn sóng; lau sậy và cỏ hai bờ đung đưa; hoa sen, lá súng nhấp nhô; cờ đích bay. Câu hỏi đầu lớp 1 dùng bể cá ("Bể có mấy con cá?").

## 2026-10-19 — Lật thẻ, Ếch nhảy lớp 1: bể cá thay chấm tròn
- Ở các đảo chưa học phép tính, thẻ và câu hỏi dùng bể cá pixel có 0–5 con cá (bể trống là 0) thay cho chấm tròn: "Bể có mấy con cá?". Lời hướng dẫn Lật thẻ đổi thành "ghép bể cá với số con cá".

## 2026-10-19 — Lời Jenny khớp luật trò chơi
- Câu cá, Bóng bay, Hứng sao, Đập chuột: Jenny đọc đúng dòng luật đang hiện trên màn hình (ví dụ "Em hứng sao mang số 4 nhé."). Đã kiểm tra 909 lượt ở 5 lớp, không còn chỗ lệch.

## 2026-10-19 — Chơi thêm không vượt kiến thức của bài
- Mỗi lớp có "dòng kiến thức": học tới đảo nào thì biết những gì (phép cộng, trừ, nhân, chia, so sánh, phân số, số thập phân, tiền, giờ, đơn vị đo, tên hình, số lớn nhất đã học). Lớp sau mang theo kiến thức lớp trước (`core/39e-kien-thuc-tro-choi.js`).
- Trò chỉ mở ở đảo khi đủ kiến thức; nội dung được nắn theo bài: Lật thẻ và Ếch nhảy lấy câu của chính đảo, rồi vài đảo ngay trước; chưa học phép tính thì ghép "nhóm chấm ↔ số" (ví dụ lớp 1 Số 0–5). Phép cộng chỉ xuất hiện từ bài Phép cộng, phép trừ từ bài Phép trừ.
- Câu cá, Bóng bay, Hứng sao, Đập chuột: luật của chủ đề vượt bài thì đổi sang luật hợp bài (chọn số 3; số lớn hơn 6 khi đã học so sánh; phép cộng có kết quả bằng 8 khi đã học cộng…).
- Tàu hoả chỉ có từ bài So sánh; Cửa hàng chỉ có từ bài Tiền (lớp 1 không có), giá không vượt số đã học; Đồng hồ lớp 1 chỉ giờ đúng; Ghép hình chỉ dùng hình đã học; Cân không dùng phép tính chưa học.
- Chọn 3 trò mỗi đảo: ưu tiên trò luyện đúng nội dung của đảo, rồi chia đều trong lớp. Kết quả cố định.
- Kiểm tra mới `tools/test/kien-thuc-tro-choi.js`: trước sửa 159 cặp đảo–trò vượt kiến thức (lớp 1: 55), sau sửa 0.

## 2026-10-19 — Ếch nhảy: hiệu ứng nhảy, rơi, bơi về bờ
- Chạm lá súng: ếch nhảy vòng cung từ bờ lên lá đó. Đúng thì đứng trên lá rồi sang hàng mới. Sai thì lá chìm, ếch rơi xuống nước (bọt bắn, mất tim), rồi bơi về bờ (thấy đầu ếch, có gợn sóng); về tới bờ mới chọn lá khác được (`core/39d-ech-nhay.js`).

## 2026-10-19 — Cân lại trò chơi thêm lớp 4–5
- Lớp 4–5: mỗi đảo giữ trò bắt buộc theo nội dung (Ghép hình, Cửa hàng, Cân), rồi lấp đủ 3 trò bằng trò phù hợp đang ít dùng nhất (`core/39c-can-bang-tro-choi.js`). Mỗi trò nay có ở khoảng 35–49 đảo; Đập chuột lớp 5 giảm từ 88 xuống 48; Ghép hình lớp 4 tăng từ 6 lên 16 (thêm đảo Luyện tập, Ôn tập của chủ đề hình học).

## 2026-10-19 — Chơi thêm đợt 3
- Đập chuột chũi: chuột thò lên từ 9 hang, cầm biển số; đập con đúng luật của đảo (+1, búa, sao nổ), đập sai mất tim. Chuột trốn nhanh dần. 60 giây, 3 tim.
- Ếch nhảy lá súng: hồ sen pixel, 3 lá súng mang đáp án cho câu của đảo; chọn đúng thì ếch nhảy lên, sai thì ếch rơi xuống nước và mất tim. Qua 8 hàng là thắng. Có ghi vào Sức mạnh Toán.
- Ghép hình pixel (đảo hình học): bức tranh rô-bốt, tên lửa, xe ô tô có chỗ trống nhấp nháy; chọn đúng hình (hình vuông, tròn, tam giác, chữ nhật; khối lập phương, hộp, trụ, cầu; góc vuông, nhọn, tù, bẹt; bình hành, thoi, thang — theo lớp và bài). Đủ tranh thì bừng màu. 2 tranh, 3 tim. Ghi vào trục Hình học.
- Cửa hàng Jenny có thêm ở lớp 1–3 (đảo Luyện tập, Ôn tập, bài lời văn); lớp 1 trả tiền chẵn nghìn từ 1 000 đến 10 000 đồng.

## 2026-10-19 — Cân thăng bằng: đồ hoạ pixel
- Vẽ lại cân bằng pixel (`core/38b-can-pixel.js`): đế bậc thang, cột gỗ, trục vàng, đòn cân nghiêng theo từng bậc, xích và đĩa cân hình bát; quả cân và vật bên trái là hình pixel. Lệch ít vẫn nghiêng rõ; cân bằng thì trục và đĩa chuyển xanh, có dấu "=" nhấp nháy.

## 2026-10-19 — Chơi thêm: 3 trò mới (đợt 2)
- **Cân thăng bằng**: chạm quả cân để đặt lên đĩa phải (chạm lại để bỏ), cân nghiêng theo từng quả, bấm "Cân!" khi hai bên bằng nhau. Bên trái là số hoặc phép tính (lớp 1 ≤ 10, lớp 2 ≤ 100, lớp 3 ≤ 1 000, lớp 4–5 lớn hơn); ở đảo khối lượng dùng kg, g, yến, tạ. Sai thì cân tự đặt lại cách đúng cho em xem. 8 lượt, 3 tim.
- **Cửa hàng Jenny**: chạm tờ tiền trong ví để trả đúng giá món hàng (chạm tờ đã đưa để lấy lại). Lớp 2 dùng tờ 100–1 000 đồng; lớp 3 đến 100 000 đồng và thêm câu "cô trả lại bao nhiêu"; lớp 4–5 thêm mua 2–3 món và giảm giá. 8 lượt, 3 tim.
- **Tàu hoả xếp số**: chạm các toa theo thứ tự từ bé đến lớn (hoặc từ lớn đến bé) để nối vào đầu tàu, chạm toa cuối để tháo; đúng thì tàu chạy đi. Số theo lớp và bài: lớp 1 đến 5, 10 hoặc 100; lớp 2 đến 1 000; lớp 3–4 số có 5–6 chữ số gần nhau; lớp 4–5 phân số, số thập phân. 6 lượt, 3 tim.
- Đảo học tiền luôn có Cửa hàng Jenny, đảo học khối lượng luôn có Cân thăng bằng; các đảo khác nhận trò mới theo nội dung, vẫn 2–3 trò mỗi đảo. Kết quả vào Hồ sơ: Cân → Phép tính (đảo khối lượng → Đo lường), Cửa hàng → Đo lường (mua nhiều món → Lời văn), Tàu hoả → Số.

## 2026-10-19 — Chơi thêm: 4 trò mới (đợt 1)
- **Hứng sao rơi**: di giỏ (kéo, chạm hai bên hoặc phím mũi tên) hứng sao có số đúng luật của đảo, 60 giây, 3 tim, nền trời đêm.
- **Lật thẻ ghép đôi**: 12 thẻ (6 cặp) ghép phép tính với kết quả, lấy từ câu của đảo (thiếu thì tự tạo phép tính hợp lớp), 90 giây, lật sai không mất tim.
- **Kéo co với trùm**: trả lời câu của đảo, đúng thì kéo dây về phía Jenny, sai hoặc đứng yên 6 giây thì trùm kéo lại; 90 giây.
- **Đồng hồ thần kì** (chỉ ở đảo học xem giờ): kéo kim hoặc bấm +/− cho đúng giờ, 8 lượt, 3 tim; lớp 1 giờ đúng, lớp 2 giờ rưỡi, 15 phút, 5 phút, lớp 3 trở lên đúng từng phút.
- Mỗi đảo hiện 2–3 trò chơi thêm, chọn theo nội dung tiết và cố định theo đảo, để mỗi đảo một khác. Kết quả các trò được ghi vào Hồ sơ (Chuỗi ngày chăm chỉ; Kéo co và Đồng hồ còn vào Sức mạnh Toán).

## 2026-10-19 — Thông báo trên thanh điều hướng
- Bản đồ: hiện số đảo vừa mở mà em chưa vào (tính theo tiến độ thật).
- Toán Jenny: hiện số buổi cô mới giao; nếu chưa kích hoạt (bản miễn phí) thì icon mờ kèm ổ khoá.
- Sưu tập: hiện số món mới (thẻ sinh vật, dấu hộ chiếu) em chưa xem.
- Số đỏ + rung nhẹ giống Luyện lỗi; tự mất khi em vào xem. Lưu ở `st.seen` (`core/36-thong-bao.js`).

## 2026-10-19 — Sổ lỗi sai lên thanh điều hướng
- Số lỗi nằm gọn trong thanh điều hướng, không bị che trên điện thoại.
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
