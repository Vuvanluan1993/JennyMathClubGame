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
- Mặt trời/mặt trăng trên biển: luôn trong tầm nhìn, trôi ngang chậm; không vật thể nào được đổi chỗ ngẫu nhiên mỗi khung hình (gây chớp nháy) (23/10).
- Kiểm tra giao diện ở khổ 320, 375, 414px (và 900px máy tính): không tràn ngang.
- Thanh trên (bản học sinh): logo đám mây pixel + chữ **JennyClub** (tên tạm) · VI|EN · nhạc · nút **Đăng xuất** pixel hiện sẵn.
- Thanh dưới (tiểu học): Bản đồ · Toán Jenny · **Nhà em** · **Cửa hàng** (Luyện lỗi chuyển vào Phòng học, 23/10). "Nhà em" mở 3 ô: Đảo nhà, Sưu tập, Hồ sơ.

## 3. Nội dung
- Bám từng tiết Vở BT-TH Toán 1–5 (Kết nối tri thức); **viết lại đề, không chép sách**, không để chữ gốc của sách trong repo.
- Mỗi tiết = 1 đảo; mỗi chủ đề = 1 vùng biển; đảo cuối chủ đề có Trùm. Lớp 1–2: 5 câu/màn, Jenny đọc to; lớp 3–5: 8 câu/màn.
- Tên chủ đề: cùng cỡ 24px, tối đa 2 dòng, dòng 1 cạnh nhãn "CHỦ ĐỀ n". Dòng 2: [vùng biển][★ a/b]; dòng 3: "Bài … · n đảo · trùm …". Tên trùm không ghi "· Hệ …".
- Câu hỏi hai chiều: "lớn nhất"/"bé nhất", "bé→lớn"/"lớn→bé" đều có (`45-hai-chieu-cau-hoi.js`).
- Lời giải leo núi: chỉ lời dẫn + phép tính, đơn vị ở dòng cuối; không ghi "Bài giải", "Đáp số".
- Không hiện sẵn số lượng ("Đang có: n") ở dạng câu mà học sinh phải tự đếm (23/10).
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
- Tên gọi thống nhất: **Cửa hàng** / "Cửa hàng Jenny" (không dùng "Gian hàng", 23/10).
- Bảng giá: Áo 120–400 · Mũ kính 60–250 · Khung 60–300 · Đảo nhà 40–140 · Đồ nuôi 5–200 · Vé game tư duy 30 xu = 5 phút, tối đa 3 vé/ngày (chờ có game tư duy).
- Vào Đảo nhà: chạm ảnh Jenny ở thẻ chào, hoặc Nhà em › Đảo nhà. Trên đảo **không có hình học sinh**, chỉ có thú cưng và đồ trang trí.
- Thú cưng: nuôi **1 loài**, tối đa **2 con**; bắt đầu 2 loài: **Gà con 40–50 ngày (150 xu)**, **Rùa biển 100–200 ngày (250 xu)**; có mô tả khi mua.
- Thời gian theo **ngày thật** (cả cuối tuần). Chỉ số No/Vui/Sạch/Sức khoẻ; ốm cần Thuốc.
- Bỏ đói/ốm nặng liên tục 3 ngày → thú **bỏ đi** (thư tạm biệt). Già thì mất, ghi vào Sổ kỷ niệm. Sau đó **chờ 3 ngày** mới nuôi con mới.
- 2 con cùng loài trưởng thành + Ổ rơm → đẻ trứng; Máy ấp 3 ngày cho nở; trứng không ấp hỏng sau 2 ngày.
- Đồ cũ dần theo thời gian; bán thanh lý = 50% giá × độ mới. Qua màn → thú vui thêm.

- Nhiều loại đồ thì dùng **nút chọn nhóm** (chạm nút hiện đồ nhóm đó), không xếp chồng tất cả: Tủ đồ, Túi đồ, Cửa hàng › Đồ nuôi (23/10). Không dùng hàng nút trượt ngang; hàng mục Cửa hàng giữ 2 dòng.

## 6b. Màn Vẽ hình (chốt 22/10/2026)
- Là màn THÊM ở đảo hình học, không thay màn cũ. 4 hình/màn, 3 tim.
- Phản hồi chỉ "Đúng rồi!" / "Chưa đúng" kèm câu động viên — không giải thích lý do sai.
- Hình vuông/chữ nhật lưng chừng: chấp nhận cả hai (không làm khó lớp 1).

## 6c. Kho trò chơi (chốt 23/10/2026)
- 3 trò: Bowling, Đẩy thùng, Khủng long chạy (không gắn Toán). Mua trò 150 xu kèm 10 lượt; vé 10 lượt 60 xu; 1 lần vào chơi = 1 lượt; tối đa **10 lượt/ngày** (đổi 23/10).
- Thưởng: cúp Đồng/Bạc/Vàng; 3 cúp Vàng một trò → đồ hiếm cho Jenny/thú cưng.

## 6d. Tủ đồ (23/10/2026)
- Nhà em › khung **Tủ đồ** › Phối đồ: 3 nút Áo váy · Mũ & kính · Khung ảnh, chạm nút nào sang trang riêng của mục đó (← Tủ đồ để quay lại); chạm món đã có là mặc ngay. Phụ kiện đeo cùng lúc tối đa 1 mũ + 1 kính + 1 nơ/kẹp tóc. Khung hiện quanh khung cảnh Jenny và ảnh ở thẻ chào; khung vẽ vào trong, không tràn. Đồ thú cưng mặc ở Đảo nhà.

## 6e. Phòng học của em (23/10/2026)
- Nhà em: khung Nhà (3 ô) → **Phòng học của em** → Tủ đồ → Trò chơi.
- Phòng học: Bài cô giao · Luyện lỗi (không còn ở thanh dưới) · Tự luyện (thầy đang nghĩ thêm).
- Bài cô giao = **Phiếu bài tách riêng khỏi đảo** (thầy chọn hướng 1): cô chọn tiết (1 hay nhiều), số câu, hạn; câu lấy từ kho có sẵn, mỗi em số khác.
- Làm như vở bài tập: không tim/trùm, không báo đúng sai từng câu, có "Để sau", "Nộp bài"; nộp xong mới xem điểm và đáp án. Không cộng sao, không mở đảo; nộp lần đầu +10 xu; câu sai vào Sổ lỗi (không bắt luyện ngay).
- Danh sách: bài mới lên đầu, nhãn Mới / Chưa làm / Đang làm / Quá hạn (vẫn làm được); phần Đã nộp ở dưới. Lưu lần đầu + tốt nhất; làm lại là số mới.
- Hướng 2 (cô tự soạn câu hỏi): làm khi có máy chủ.
- Thanh dưới: Bản đồ · Toán Jenny · Nhà em · Cửa hàng.

## 6f. Thông báo (23/10/2026)
- Có số/"!" đỏ trên thanh dưới thì trang đó phải có khung "Jenny nhắc em" (việc gì + nút đi tới) và chỗ cần chú ý nhấp nháy viền đỏ, nhãn "Mới". Tính năng mới có thông báo cũng phải làm như vậy.

## 6g. Dùng thật (23/10/2026)
- Mọi tài khoản học sinh: đảo, màn **khoá**, mở dần theo tiến độ. Đã làm mới toàn bộ tài khoản.
- **Lê Bảo Na = tài khoản thử**: mở tất cả, 10 000 xu (bản học sinh: `lebaona` / `jenny123`, hoặc đặt tên "Lê Bảo Na"; bản đầy đủ: học sinh Lê Bảo Na).
- Học sinh thật không có bài cô giao mẫu.

## 7. Kiểm tra bắt buộc (NODE_PATH trỏ tới node_modules có playwright)
- `node tools/test/kiem-tra.js <lớp>` — lớp 1–5 phải ĐẠT.
- `node tools/test/kien-thuc-tro-choi.js` — trò không vượt kiến thức.
- `node tools/test/khung-hinh.js` — không lỗi khung hình.
- `node tools/test/tieng-anh.js` — 0 chuỗi tiếng Việt sót khi bật EN.
- `node tools/test/the-ghep-doi.js` — thẻ ghép đôi đúng giá trị.

## 8. Video giới thiệu
- Công cụ ở `tools/video/` (quay bằng Playwright + CDP screencast 2×, thu tiếng app qua Web Audio, bàn tay pixel chạm, ghép bằng ffmpeg). Xem `tools/video/README.md`.
- Bản đã duyệt (20/10): 8 phần, bỏ Bài giảng, Song ngữ, Giáo viên & phụ huynh. Lời Jenny hiện bằng khung chữ "Jenny nói".
