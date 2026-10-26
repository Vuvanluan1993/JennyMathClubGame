# Hướng dẫn cho Claude khi làm việc với dự án này

Dự án: **Lớp học ảo Jenny** — app học Toán dạng trò chơi pixel cho Clb Học Toán cùng Jenny (chủ: thầy Luân).
Đọc **`docs/LUAT-DA-CHOT.md` trước tiên** (mọi quyết định thầy đã duyệt), rồi `README.md`, `docs/KIEN-TRUC.md`, `docs/THEM-NOI-DUNG.md`, `CHANGELOG.md` (mục mới nhất) và chọn việc trong `TASKS.md`.
Thầy chốt điều mới → ghi ngay vào `docs/LUAT-DA-CHOT.md`.

## Cách trả lời thầy Luân
- Tiếng Việt, ngắn, từ ngữ đơn giản.
- Mọi quyết định/kết quả trình bày theo **STAR** (Tình huống – Nhiệm vụ – Hành động – Kết quả) và **luôn có khuyến nghị**.

## Quy trình mỗi task
1. Sửa trong `src/lop-hoc-ao/` (không sửa tay `dist/` hay `games/lop-hoc-ao/index.html`).
2. `python3 tools/build.py`
3. `node tools/test/kiem-tra.js [lớp] [chủ đề]` — phải ĐẠT. Xem lại các dòng "xem lại phép tính". Các bài kiểm tra khác: xem mục 7 của `docs/LUAT-DA-CHOT.md`.
4. Kiểm tra trực quan khổ 320/375/414px và **chế độ tối** (Playwright, Chromium cài bằng `npx playwright install chromium` sau `npm ci` ở gốc kho) khi đổi giao diện.
5. Cập nhật `CHANGELOG.md` và đánh dấu `TASKS.md`.
6. Commit (kèm dòng ghi công theo hướng dẫn phiên). `dist/` và `games/lop-hoc-ao/**/index.html` **không nằm trong git**
   (`.gitignore`), không commit. Phiên Code: đẩy nhánh, mở PR (CI chạy `npm test`); Cowork: `git pull --rebase`, `git push`
   thẳng `main` (thầy chốt Q3 = B; CI chạy trên mỗi push `main`). Gộp vào `main` xong, GitHub Actions tự dựng
   (`tools/build_all.py`) và đưa lên Pages; không cần build hay commit "Dựng lại bản".
7. Nếu phiên có công cụ Artifact: đăng lại `dist/lop-hoc-ao-jenny.html` lên artifact
   https://claude.ai/artifact/6HBRFgdwbmKHCXWEp7DwBB (bản đầy đủ có giáo viên/phụ huynh/demo).
   Bản đồ đảo (kế hoạch): https://claude.ai/artifact/VX1QMuDQJscrbkmkdBqV5D

## Nguyên tắc nội dung
- Bám kiến thức từng tiết của Vở BT-TH Toán 1–5 (Kết nối tri thức); **viết lại đề, không chép sách**.
- Mỗi tiết = 1 đảo; mỗi chủ đề = 1 vùng biển; đảo cuối chủ đề có Trùm.
- Lớp 1–2: 5 câu/màn, Jenny đọc to; lớp 3–5: 8 câu/màn, bài lời văn ít câu hơn.
- Phương án chọn: cùng cỡ chữ trong một câu; chữ/hình quá bé thì 2 hoặc 1 phương án mỗi hàng (đã tự động).
- Phong cách pixel, bảng màu logo Clb; mọi khung là khung pixel.
- Khi đổi cấu trúc lưu trữ, phải giữ được tiến độ cũ của học sinh (xem `healAll()`).

## Các trang trên GitHub Pages
- Học sinh: `games/lop-hoc-ao/` (đăng nhập jenny01…jenny05 / jenny123, chỉ tiểu học; thử: lebaona / jenny123).
- Giáo viên `games/lop-hoc-ao/giao-vien/` · Phụ huynh `games/lop-hoc-ao/phu-huynh/` · Quản lý `games/lop-hoc-ao/quan-ly/` (3 trang tạo từ `tools/vite/vai.js`) — đăng nhập tài khoản thật (Firebase, `js/core/62-may-chu.js`); bản thử `demo/` mở sẵn vai, không mật khẩu (`tools/vite/vai.js`).
- Máy chủ: Firebase `jenny-lop-hoc-ao` (Firestore asia-southeast1). Quy tắc: `firebase/firestore.rules` — đổi quy tắc thì nhờ thầy dán lại vào Firestore › Rules. Chạy thử bằng Playwright cần `proxy:{server:process.env.HTTPS_PROXY}`, `ignoreHTTPSErrors:true`, `waitUntil:'domcontentloaded'`.

## Lưu ý kĩ thuật
- Mỗi file JS là ES module (import/export do `node tools/vite/tim-import.mjs` sinh, chạy lại sau khi sửa/rebase); khi chạy vẫn nối thành một script thường. `npm run lint` phải 0 lỗi.
- Không khai báo `function` trùng tên, không gán lại hàm của file khác: đè bằng `hooks.on('ten', cu => …)` (xem `js/core/00-hooks.js`, `docs/KIEN-TRUC.md` mục Module và hooks).
- Bàn phím số chỉ nhập số nguyên ≥ 0.
- Đảo/màn **khoá mặc định**, mở dần theo tiến độ (`UNL` tính lại mỗi lần vẽ trong `55-khoa-dao-tai-khoan.js`). Tài khoản thử **Lê Bảo Na** (`na`, `lebaona`/jenny123, hoặc tên "Lê Bảo Na") mở tất cả + 10 000 xu. Muốn làm mới dữ liệu mọi máy: đổi khoá lưu (`KEY` ở 09, `jennyHS2_` ở `tools/vite/vai/hoc-sinh-dang-nhap-thu.js.txt`).
