# Luật đã chốt với thầy Luân (đọc trước khi làm bất cứ việc gì)

Tệp này ghi các quyết định thầy đã duyệt. Phiên làm việc mới phải theo đúng, không tự đổi.
Khi thầy chốt điều mới → ghi thêm vào đây (kèm ngày) trong cùng commit.

## 1. Cách làm việc với thầy
- Trả lời tiếng Việt, ngắn, từ ngữ đơn giản; trình bày **STAR** (Tình huống – Nhiệm vụ – Hành động – Kết quả) và **luôn có khuyến nghị**.
- Tính năng hình ảnh mới: gửi **ảnh mẫu** để thầy duyệt trước khi làm thật (khi thầy yêu cầu duyệt).
- Mỗi lần xong việc: build → test → cập nhật `CHANGELOG.md`, `TASKS.md` → commit, push → đăng lại artifact bản đầy đủ.

## 2. Phong cách
- **Pixel ở mọi nơi**: khung khía góc (`var(--f2)`), bóng đổ cứng, chữ VT323 cho tiêu đề/nút, Be Vietnam Pro cho chữ thường; bảng màu logo Clb (`PXC` trong `22-do-hoa-pixel…`).
- Hình vẽ là sprite pixel tự vẽ (`PXS`), không dùng ảnh ngoài, không vẽ nhân vật có bản quyền.
- **Chế độ tối** (MacBook để tối): mọi màu chữ/nền dùng biến (`--ink`, `--surface`, `--muted`, `--sun-soft`…). Chỗ nền sáng cố định (khung trời/cát, hộp Hướng dẫn) thì ghi màu chữ đậm cố định. Luôn chụp thử cả chế độ tối.
- Kiểm tra giao diện ở khổ 320, 375, 414px (và 900px máy tính): không tràn ngang.
- Thanh trên (bản học sinh): logo đám mây pixel + chữ **JennyClub** (tên tạm) · VI|EN · nhạc · nút **Đăng xuất** pixel hiện sẵn.
- Thanh dưới (tiểu học): Bản đồ · Toán Jenny · Luyện lỗi · **Nhà em** · **Cửa hàng**. "Nhà em" mở 3 ô: Đảo nhà, Sưu tập, Hồ sơ.

## 3. Nội dung
- Bám từng tiết Vở BT-TH Toán 1–5 (Kết nối tri thức); **viết lại đề, không chép sách**, không để chữ gốc của sách trong repo.
- Mỗi tiết = 1 đảo; mỗi chủ đề = 1 vùng biển; đảo cuối chủ đề có Trùm. Lớp 1–2: 5 câu/màn, Jenny đọc to; lớp 3–5: 8 câu/màn.
- Tên chủ đề: cùng cỡ 24px, tối đa 2 dòng, dòng 1 cạnh nhãn "CHỦ ĐỀ n". Dòng 2: [vùng biển][★ a/b]; dòng 3: "Bài … · n đảo · trùm …". Tên trùm không ghi "· Hệ …".
- Câu hỏi hai chiều: "lớn nhất"/"bé nhất", "bé→lớn"/"lớn→bé" đều có (`45-hai-chieu-cau-hoi.js`).
- Lời giải leo núi: chỉ lời dẫn + phép tính, đơn vị ở dòng cuối; không ghi "Bài giải", "Đáp số".
- Trò "Lật thẻ ghép đôi": thẻ phép tính phải trọn vẹn (không ☐, không =, không ?); mỗi cặp cùng giá trị, không hai cặp trùng giá trị.

## 4. Hướng dẫn khi sai & luyện lỗi
- **Không** hiện hướng dẫn khi đang làm màn hay chơi trò. Lỗi được ghi lại (cả lỗi trong trò chơi).
- Luyện lỗi: hiện lại đúng câu cũ kèm "Lần trước em chọn/ghi X"; sai nữa → hướng dẫn tự mở; luôn có nút "Xem cách làm"; sau đó 1 câu tương tự số mới.
- **Bắt buộc luyện lỗi**: có lỗi sau một màn/trò thì phải luyện một lượt rồi mới chơi màn/trò khác.
- Hướng dẫn theo dạng: lớp 1 cộng/trừ trong 10 = **hai bàn tay ngửa** (giơ ngón theo thứ tự trỏ, giữa, áp út, út, cái; **đếm trái → phải**); đếm = khoanh lần lượt; lớp 2 = tia số; lời văn = trắc nghiệm dẫn dắt; tổng = móc nhọn dọc, hiệu = móc ngang; so sánh = chỉ bảng hàng; nhân/chia = dãy đếm cách đều, hàng cân bằng, tách rời; giao hoán = nhắc tính chất (không dạy lại phép cộng).
- Bản đồ: từ tab khác về → vị trí "Đang học"; từ đảo về → đúng đảo đó.

## 5. Tiếng Anh
- Bấm EN thì **toàn bộ** chuyển tiếng Anh: giao diện, đề, lời giải, hình, hướng dẫn, giọng đọc.
- Anh – Anh, thuật ngữ Cambridge. Giữ tên Việt (Lan, Nam…) và tiền đồng.
- Làm từng lớp: lớp 1 xong (`48b-en-lop1.js`), thầy duyệt rồi mới làm lớp 2→5. Rà bằng `tools/test/tieng-anh.js` (phải 0 chuỗi sót).
- Giọng đọc: trình duyệt mỗi máy một giọng (đọc chưa chuẩn). Khuyến nghị đã gửi thầy: giọng AI trên máy chủ (Google/Microsoft) có lưu đệm — **chờ thầy tạo tài khoản**.

## 6. Xu, Cửa hàng, Đảo nhà, thú cưng (chốt 20/10/2026)
- Bảng giá: Áo 120–400 · Mũ kính 60–250 · Khung 60–300 · Đảo nhà 40–140 · Đồ nuôi 5–200 · Vé game tư duy 30 xu = 5 phút, tối đa 3 vé/ngày (chờ có game tư duy).
- Vào Đảo nhà: chạm ảnh Jenny ở thẻ chào, hoặc Nhà em › Đảo nhà. Trên đảo **không có hình học sinh**, chỉ có thú cưng và đồ trang trí.
- Thú cưng: nuôi **1 loài**, tối đa **2 con**; bắt đầu 2 loài: **Gà con 40–50 ngày (150 xu)**, **Rùa biển 100–200 ngày (250 xu)**; có mô tả khi mua.
- Thời gian theo **ngày thật** (cả cuối tuần). Chỉ số No/Vui/Sạch/Sức khoẻ; ốm cần Thuốc.
- Bỏ đói/ốm nặng liên tục 3 ngày → thú **bỏ đi** (thư tạm biệt). Già thì mất, ghi vào Sổ kỷ niệm. Sau đó **chờ 3 ngày** mới nuôi con mới.
- 2 con cùng loài trưởng thành + Ổ rơm → đẻ trứng; Máy ấp 3 ngày cho nở; trứng không ấp hỏng sau 2 ngày.
- Đồ cũ dần theo thời gian; bán thanh lý = 50% giá × độ mới. Qua màn → thú vui thêm.

## 6b. Màn Vẽ hình (chốt 22/10/2026)
- Là màn THÊM ở đảo hình học, không thay màn cũ. 4 hình/màn, 3 tim.
- Phản hồi chỉ "Đúng rồi!" / "Chưa đúng" kèm câu động viên — không giải thích lý do sai.
- Hình vuông/chữ nhật lưng chừng: chấp nhận cả hai (không làm khó lớp 1).

## 6c. Kho trò chơi (chốt 23/10/2026)
- 3 trò: Bowling, Đẩy thùng, Khủng long chạy (không gắn Toán). Mua trò 150 xu kèm 10 lượt; vé 10 lượt 60 xu; 1 lần vào chơi = 1 lượt; tối đa 5 lượt/ngày.
- Thưởng: cúp Đồng/Bạc/Vàng; 3 cúp Vàng một trò → đồ hiếm cho Jenny/thú cưng.

## 6d. Tủ đồ (23/10/2026)
- Nhà em › khung **Tủ đồ** › Phối đồ: chạm món đã có là mặc ngay (áo, mũ/kính, khung). Đồ thú cưng mặc ở Đảo nhà.

## 7. Kiểm tra bắt buộc (NODE_PATH trỏ tới node_modules có playwright)
- `node tools/test/kiem-tra.js <lớp>` — lớp 1–5 phải ĐẠT.
- `node tools/test/kien-thuc-tro-choi.js` — trò không vượt kiến thức.
- `node tools/test/khung-hinh.js` — không lỗi khung hình.
- `node tools/test/tieng-anh.js` — 0 chuỗi tiếng Việt sót khi bật EN.
- `node tools/test/the-ghep-doi.js` — thẻ ghép đôi đúng giá trị.

## 8. Video giới thiệu
- Công cụ ở `tools/video/` (quay bằng Playwright + CDP screencast 2×, thu tiếng app qua Web Audio, bàn tay pixel chạm, ghép bằng ffmpeg). Xem `tools/video/README.md`.
- Bản đã duyệt (20/10): 8 phần, bỏ Bài giảng, Song ngữ, Giáo viên & phụ huynh. Lời Jenny hiện bằng khung chữ "Jenny nói".
