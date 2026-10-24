# Luật đã chốt với thầy Luân (đọc trước khi làm bất cứ việc gì)

Tệp này ghi các quyết định thầy đã duyệt. Phiên làm việc mới phải theo đúng, không tự đổi.
Khi thầy chốt điều mới → ghi thêm vào đây (kèm ngày) trong cùng commit.

## 1. Cách làm việc với thầy
- Trả lời tiếng Việt, ngắn, từ ngữ đơn giản; trình bày **STAR** (Tình huống – Nhiệm vụ – Hành động – Kết quả) và **luôn có khuyến nghị**.
- Tính năng hình ảnh mới: gửi **ảnh mẫu** để thầy duyệt trước khi làm thật (khi thầy yêu cầu duyệt).
- Mỗi lần xong việc: build → test → cập nhật `CHANGELOG.md`, `TASKS.md` → commit, push → đăng lại artifact bản đầy đủ.

## 2. Phong cách
- Giữ cỡ ô pixel hiện tại (Jenny 16 ô ngang) — thầy không chọn bản mịn (24/10).
- Nhân vật: **Bạn nữ (Jenny)** và **Bạn nam**, theo **giới tính quản lý nhập** khi tạo/sửa tài khoản; học sinh không tự chọn (chưa nhập = bạn nữ). Cửa hàng có đồ riêng cho từng bạn và đồ chung (24/10).
- **Pixel ở mọi nơi**: khung khía góc (`var(--f2)`), bóng đổ cứng, chữ VT323 cho tiêu đề/nút, Be Vietnam Pro cho chữ thường; bảng màu logo Clb (`PXC` trong `22-do-hoa-pixel…`).
- Hình vẽ là sprite pixel tự vẽ (`PXS`), không dùng ảnh ngoài, không vẽ nhân vật có bản quyền.
- **Chế độ tối** (MacBook để tối): mọi màu chữ/nền dùng biến (`--ink`, `--surface`, `--muted`, `--sun-soft`…). Chỗ nền sáng cố định (khung trời/cát, hộp Hướng dẫn) thì ghi màu chữ đậm cố định. Luôn chụp thử cả chế độ tối.
- Mặt trời/mặt trăng trên biển: luôn trong tầm nhìn, trôi ngang chậm; không vật thể nào được đổi chỗ ngẫu nhiên mỗi khung hình (gây chớp nháy) (23/10).
- Kiểm tra giao diện ở khổ 320, 375, 414px (và 900px máy tính): không tràn ngang.
- Thanh trên (bản học sinh): logo đám mây pixel + chữ **JennyClub** (tên tạm) · VI|EN · nhạc · nút **Đăng xuất** pixel hiện sẵn.
- Thẻ chào (trang Bản đồ): [hình Jenny] [Vịnh · Lớp / Chào …!] [cột sát bên phải chữ: ô sao trên, ô xu "🪙 số ▸" dưới]; không có nút "Nghe Jenny", không chữ "Đảo nhà" (23/10).
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
- ~~Bắt buộc luyện lỗi sau mỗi màn~~ → **thay bằng (24/10/2026):** sai thì ghi vào Sổ lỗi sai, em **tự luyện nếu muốn** (không bắt buộc; màn kết thúc có nút "Luyện lại câu sai"). Chỉ khi **cô giao Luyện lỗi** ở trang giáo viên thì mới bắt buộc (bài về nhà). Lỗi cô **không giao** thì **tự bỏ sau 7 ngày** kể từ lần sai gần nhất. Em **làm xong bài Luyện lỗi cô giao** (một lượt, mỗi lỗi 2 câu số mới) thì các lỗi đó **ra khỏi Sổ lỗi sai**.
- Hướng dẫn theo dạng: lớp 1 cộng/trừ trong 10 = **hai bàn tay ngửa** (giơ ngón theo thứ tự trỏ, giữa, áp út, út, cái; **đếm trái → phải**); đếm = khoanh lần lượt; lớp 2 = tia số; lời văn = trắc nghiệm dẫn dắt; tổng = móc nhọn dọc, hiệu = móc ngang; so sánh = chỉ bảng hàng; nhân/chia = dãy đếm cách đều, hàng cân bằng, tách rời; giao hoán = nhắc tính chất (không dạy lại phép cộng).
- Bản đồ: từ tab khác về → vị trí "Đang học"; từ đảo về → đúng đảo đó.

## 5. Tiếng Anh
- Bấm EN thì **toàn bộ** chuyển tiếng Anh: giao diện, đề, lời giải, hình, hướng dẫn, giọng đọc.
- Anh – Anh, thuật ngữ Cambridge. Giữ tên Việt (Lan, Nam…) và tiền đồng.
- Làm từng lớp: lớp 1 xong (`48b-en-lop1.js`), thầy duyệt rồi mới làm lớp 2→5. Rà bằng `tools/test/tieng-anh.js` (phải 0 chuỗi sót).
- **Giọng đọc (chốt 24/10/2026):** dùng **Google Cloud Chirp 3 HD · Tiếng Việt · Despina** (`vi-VN-Chirp3-HD-Despina`). Thu sẵn thành file mp3 (không đọc trực tiếp lúc học): lời cố định (bài giảng, hướng dẫn, lời Jenny) thu trước; câu có số thay đổi tạm dùng giọng máy. File chia theo lớp/bài, tải khi cần, tải trước câu kế tiếp; lỗi mạng thì quay về giọng máy. Thu bằng GitHub Actions (`.github/workflows/giong-doc.yml`), có lưu đệm: chỉ thu lại câu đã sửa. **Thầy không gắn thanh toán Google Cloud** → dùng **Gemini TTS (AI Studio, gói miễn phí), giọng Despina**, khóa `GEMINI_API_KEY` trong Secrets; thu chậm, hết lượt ngày thì hôm sau thu tiếp. Khi có thanh toán mới chuyển sang Cloud Chirp 3 HD (`GOOGLE_TTS_KEY`). Không dùng giọng hệ thống của Mac để thu (giấy phép Apple cấm dùng thương mại). Giọng tiếng Anh: chọn sau.

## 6. Xu, Cửa hàng, Đảo nhà, thú cưng (chốt 20/10/2026)
- Tên gọi thống nhất: **Cửa hàng** / "Cửa hàng Jenny" (không dùng "Gian hàng", 23/10).
- Bảng giá: Áo 120–400 · Mũ kính 60–250 · Khung 60–300 · Đảo nhà 40–140 · Đồ nuôi 5–200 · Vé game tư duy 30 xu = 5 phút, tối đa 3 vé/ngày (chờ có game tư duy).
- Vào Đảo nhà: chạm ảnh Jenny ở thẻ chào, hoặc Nhà em › Đảo nhà. Trên đảo **không có hình học sinh**, chỉ có thú cưng và đồ trang trí.
- Loài thêm 24/10: Ếch xanh 180 xu (60–80 ngày), Mèo con 280 (110–150), Cún con 300 (120–160); mỗi loài có 4 hình giai đoạn lớn lên; Mèo, Cún không đẻ trứng.
- Thú cưng: nuôi **1 loài**, tối đa **2 con**; bắt đầu 2 loài: **Gà con 40–50 ngày (150 xu)**, **Rùa biển 100–200 ngày (250 xu)**; có mô tả khi mua.
- Thời gian theo **ngày thật** (cả cuối tuần). Chỉ số No/Vui/Sạch/Sức khoẻ; ốm cần Thuốc.
- Bỏ đói/ốm nặng liên tục 3 ngày → thú **bỏ đi** (thư tạm biệt). Già thì mất, ghi vào Sổ kỷ niệm. Sau đó **chờ 3 ngày** mới nuôi con mới.
- 2 con cùng loài trưởng thành + Ổ rơm → đẻ trứng; Máy ấp 3 ngày cho nở; trứng không ấp hỏng sau 2 ngày.
- Đảo nhà bố cục cố định (56-dao-nha-bo-cuc.js): cây dừa cỏ trái, cờ cỏ phải, hải đăng mỏm đá ngoài biển, lâu đài cát trước, ô che nắng cát trước phải, thuyền trên nước; ổ rơm/máy ấp bãi cỏ giữa; thú cưng trên bãi cát. Đồ mới phải có chỗ đặt hợp lý (23/10).
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

## 6h. Trang giáo viên (23/10/2026)
- Tạm thời (cách 1): bản demo có mật khẩu trên GitHub, dữ liệu mẫu. Cách 2 (máy chủ, kết quả thật) làm khi thầy có tài khoản Firebase/Supabase.
- Bảng "Tiến độ từng em" **không có Toán Jenny**. Toán Jenny là phần riêng, chỉ hiện khi đã mở khóa (có em đã kích hoạt); chưa mở thì ẩn (chốt 23/10/2026).
- **Lớp, giáo viên, quản lý (chốt 23/10/2026):**
  - Mỗi khối có nhiều lớp (1A, 1B…). Một giáo viên dạy 1 hoặc nhiều lớp, khác khối cũng được; một lớp có thể có nhiều giáo viên.
  - Tài khoản học sinh tách khỏi lớp: em ở lớp nào là bản ghi "ghi danh" theo năm học. Chuyển lớp, lên lớp không mất sao, xu, Sổ lỗi sai.
  - Một em chỉ ở **1 lớp chính** trong một năm học.
  - **Toán Jenny mở theo lớp** (gói gắn với lớp). Ngoại lệ từng em (học bù, chuyển lớp) chỉ quản lý làm, mặc định tắt.
  - Khóa/mở 3 tầng: Gói (quản lý) → Lớp (giáo viên) → Từng em; tầng dưới không vượt tầng trên.
  - 3 vai trò quản lý: **Quản trị hệ thống** (thầy: trung tâm, nội dung, mã gói) · **Quản lý trung tâm** (năm học, lớp, tài khoản, phân công, xếp/chuyển lớp, gắn gói, báo cáo) · **Giáo viên** (chỉ lớp được phân công).
  - Giáo viên không tạo lớp, không thêm em vào lớp. Màn đầu của giáo viên là **"Lớp của tôi"** (thẻ lớp xếp theo khối).
  - Không xóa hẳn, mọi thao tác quản lý có nhật ký.
- **Hồ sơ học sinh (chốt 23/10/2026):** kiểu trang giáo viên (không pixel), 5 thẻ: Tổng quan · Học tập · Lỗi & bài về nhà · Hoạt động · Ghi chú & giao bài; có đủ số liệu của "Hồ sơ của em". Ghi thêm: đúng ngay lần đầu, thời gian mỗi câu, số lần mở hướng dẫn, ghi chú riêng của cô. Liên hệ phụ huynh để khi có máy chủ. Không lưu địa chỉ, số định danh, ảnh khuôn mặt, sức khỏe.
- **Hồ sơ học sinh — chỉnh (23/10/2026):** 4 thẻ (Tổng quan · Hoạt động học tập · Lỗi & bài về nhà · Ghi chú & giao bài). Sức mạnh Toán = biểu đồ mạng nhện; bỏ khung "Gợi ý cho cô", gợi ý thành nhãn trong Cảnh báo.
- **Giao phiếu tự động theo dạng yếu (23/10/2026):** dạng yếu = đúng dưới 50% và làm ít nhất 4 lần; app tự soạn phiếu 8 câu (dễ → vừa), từ đảo đã học, hạn 2 ngày, đạt 80%; **cô chỉ quyết định Giao hay Bỏ qua** (có Xem trước câu hỏi); không cho cô tự chọn tiết; kết quả phiếu tính vào tỉ lệ đúng của dạng.
- **Bài về nhà bắt buộc đã có trong bản GitHub (23/10/2026):** phiếu theo dạng yếu, phiếu cả lớp mới và Luyện lỗi có mục tiêu đều bắt buộc; chặn toàn bộ app học sinh tới khi xong; xong được +20 xu. Lưu ý: trang giáo viên và app học sinh trên GitHub chưa chung dữ liệu (cần máy chủ) — thử trọn vòng ở bản demo (đổi vai Giáo viên ↔ Học sinh).
- **Sức mạnh Toán (23/10/2026):** không so theo tháng; 3 đường: em 3 tháng gần nhất · em 6 tháng gần nhất · TB học sinh Jenny (cùng khối).
- **Nhận xét (23/10/2026):** bỏ "Ghi nhận và nhận xét" ở trang lớp; giáo viên **tự viết** nhận xét gửi phụ huynh trong hồ sơ từng em.
- **Trang phụ huynh (23/10/2026):** đủ thông tin như trang giáo viên (Tổng quan, Hoạt động học tập, Lỗi & bài về nhà) + **Lời nhắn của giáo viên** (mới nhất ở trên).
- **Dữ liệu mẫu (23/10/2026):** giả định đã học 8 tháng; sẽ reset khi có dữ liệu thật.
- **Chỉ tiểu học (23/10/2026):** bỏ tài khoản lớp 6–9. Dữ liệu mẫu: khối 1 và 2 mỗi khối 2 lớp × 12 em.

## 6i. Máy chủ (chốt 24/10/2026)
- Dùng **Firebase gói miễn phí (Spark)**, dự án `jenny-lop-hoc-ao`, Firestore vùng **asia-southeast1**; tắt Gemini và Google Analytics; không sao lưu tự động (cần gói trả phí).
- Trang vẫn đặt trên GitHub Pages (chưa cần tên miền riêng).
- Quy tắc bảo mật ở `firebase/firestore.rules` (dán vào Firestore › Rules mỗi khi đổi). Em chỉ xem dữ liệu của mình; cô chỉ xem lớp được phân công; phụ huynh chỉ xem con; chỉ quản lý tạo tài khoản.
- Thử nghiệm dùng tài khoản thử, chưa nhập tên thật của học sinh.
- **3 trang tách riêng** (24/10/2026): Giáo viên, Phụ huynh, Quản lý — mỗi trang một vai; app học sinh riêng.

- Sức mạnh Toán 6 trục: Số · Phép tính · Tư duy – Logic · Hình học · Đo lường · Thống kê. Bài lời văn tính vào trục nội dung của nó; tỉ lệ đúng bài lời văn hiện riêng (24/10/2026).
- Điểm Logic = A 40% bài thuần logic + B 40% bài suy luận ở các mạch (tìm thành phần chưa biết, nhiều bước, so sánh kết quả, ước lượng, đúng/sai) + C 20% thói quen (đúng ngay lần đầu, không bấm bừa); thiếu phần nào thì chia lại trọng số; cần A + B ≥ 5 câu (24/10/2026).
- Khủng long chạy miễn phí từ đầu: không mua, không tốn lượt; riêng 10 ván/ngày (24/10/2026).
- Bấm logo Clb ở thanh trên → về trang chủ (mọi trang) (24/10/2026).
- **Tự luyện = Vở bài tập Jenny (chốt 24/10/2026):** mỗi đảo đã qua mở 1 trang vở 4–5 bài trộn dạng (số mới mỗi lần) + 1 bài ★ Thử thách cuối trang; em tự chọn, không bắt buộc. Cô **không giao**, chỉ ⭐ gợi ý trang và xem kết quả. Xu lấy từ quỹ tự luyện (150 xu/ngày); sai vào Sổ lỗi sai; không tính sao, không mở đảo. VBT tham khảo (Chân trời sáng tạo) chỉ là nguồn **dạng bài**, ghép theo kiến thức với KNTT, không chép chữ/số/hình. Bảng dạng bài: `docs/tu-luyen-dang-bai-lop1-tap1.md`. Thầy duyệt ảnh mẫu 24/10: mỗi trang 5 bài + 1 ★, làm từng bài một; 5 xu/bài, ★ 15 xu, trong quỹ 150 xu/ngày; Thử thách hôm nay 1 lượt/ngày. Đã có lớp 1, 2.

## 6i. Đăng nhập và sửa thông tin học sinh (24/10/2026)
- Học sinh đăng nhập chỉ bằng tên đăng nhập + mật khẩu, không tự nhập tên.
- Quản lý › Học sinh › ✎ Sửa: Họ tên, Tên đăng nhập, Mật khẩu + hồ sơ (Giới tính, Ngày sinh, Năm sinh, Điện thoại phụ huynh, Gmail phụ huynh). Không sửa khối, xu, sao, đồ, tiến độ. Có ghi Nhật ký.

## 6j. Trang Quản lý (24/10/2026)
- Thêm lớp/học sinh/giáo viên bằng **nút → bảng nhập** (không để ô nhập dài trên trang). Học sinh: họ, tên, giới tính, ngày tháng năm sinh, lớp, điện thoại & gmail phụ huynh.
- Có nút bỏ khỏi lớp, chuyển lớp, xếp nhiều em vào lớp.
- **1 tài khoản phụ huynh – nhiều con** (anh chị em cùng bố mẹ).

## 7. Kiểm tra bắt buộc (NODE_PATH trỏ tới node_modules có playwright)
- `node tools/test/kiem-tra.js <lớp>` — lớp 1–5 phải ĐẠT.
- `node tools/test/kien-thuc-tro-choi.js` — trò không vượt kiến thức.
- `node tools/test/khung-hinh.js` — không lỗi khung hình.
- `node tools/test/tieng-anh.js` — 0 chuỗi tiếng Việt sót khi bật EN.
- `node tools/test/the-ghep-doi.js` — thẻ ghép đôi đúng giá trị.
- `node tools/test/tu-luyen.js` — Tự luyện lớp 1–2 ĐẠT.

## 8. Video giới thiệu
- Công cụ ở `tools/video/` (quay bằng Playwright + CDP screencast 2×, thu tiếng app qua Web Audio, bàn tay pixel chạm, ghép bằng ffmpeg). Xem `tools/video/README.md`.
- Bản đã duyệt (20/10): 8 phần, bỏ Bài giảng, Song ngữ, Giáo viên & phụ huynh. Lời Jenny hiện bằng khung chữ "Jenny nói".
