# Lớp học ảo Jenny

Ứng dụng học Toán dạng trò chơi pixel của **Clb Học Toán cùng Jenny**.
Mỗi tiết trong Vở bài tập Toán (Kết nối tri thức) là một **đảo**; mỗi chủ đề là một **vùng biển**.

- Bản học sinh (có đăng nhập): `games/lop-hoc-ao/index.html` → https://vuvanluan1993.github.io/JennyMathClubGame/games/lop-hoc-ao/
- Bản đầy đủ (học sinh, giáo viên, phụ huynh, chế độ demo): `src/lop-hoc-ao/dist/lop-hoc-ao-jenny.html` (tạo ra khi build)

## Hiện có

| Lớp | Chủ đề | Đảo | Bài giảng Jenny |
|---|---|---|---|
| 1 | 10 (cả năm) | 104 | 41 bài |
| 2 | 14 (cả năm) | 175 | 75 bài |
| 3 | 16 (cả năm) | 175 | 81 bài |
| 4 | 13 (cả năm) | 175 | 73 bài |
| 5 | 12 (cả năm) | 175 | 75 bài |
| 6–9 | Chương I (bản cũ) | — | có video slide |

Mỗi đảo tiểu học: Bài giảng Jenny (không bắt buộc) → Màn 1 → Màn 2 → (đảo cuối chủ đề: Trùm).
Mỗi đảo có Trùm lớp (cả lớp cùng đánh), và tuỳ chọn Câu cá, Bóng bay, Đua giờ 60 giây.
Ngoài ra: Sổ lỗi sai, Toán Jenny (phần nâng cao), Kho báu trên biển, Sưu tập thẻ.
Lớp 1–2: 5 câu/màn, Jenny tự đọc đề. Lớp 3–5: 8 câu/màn, bài lời văn ít câu hơn.

## Cấu trúc thư mục

```
src/lop-hoc-ao/
  app.template.html      khung trang: <head>, chỗ ghép CSS, khung HTML, danh sách file JS (/*@include ...*/)
  css/app.css            toàn bộ giao diện (pixel, khung, điện thoại)
  js/core/               phần chạy chung: tiện ích, dữ liệu demo, giao diện, chơi màn, giáo viên, phụ huynh,
                         đồ hoạ pixel, biển động, Sổ lỗi sai, tính năng chơi thêm, trò chơi nhỏ, khởi động
  content/lop-1 … lop-5  nội dung từng lớp (P-15a): 10-hk1 (chủ đề 1–5), 20-bai-giang (slide), 30/31-hk2; index.js export dangKy(reg)
  content/lop-6-9/       lớp 6–9 chương I, Toán Jenny lớp 6
  data/plan.json         cấu trúc vở bài tập: chủ đề → bài → số tiết (dùng để kiểm tra số đảo)
  tools/build.py         = npm run build:lop-hoc-ao (Vite): bản đầy đủ + 4 trang thật + 4 trang thử
  tools/vite/            vite plugin nối file (noi-file.js), trang theo vai (vai.js), sinh import (tim-import.mjs),
                         chuyển hàm đè sang hooks (chuyen-hooks.mjs), so ảnh (so-anh.mjs)
  tools/test/kiem-tra.js kiểm tra tự động
  docs/                  kiến trúc, cách thêm nội dung
  TASKS.md               danh sách việc tiếp theo
  CHANGELOG.md           lịch sử thay đổi
```

## Làm việc

```bash
cd src/lop-hoc-ao
python3 tools/build.py                 # ghép → dist/ và games/lop-hoc-ao/index.html
node tools/test/kiem-tra.js            # kiểm tra cả 5 lớp (cần Node + Playwright + Chromium)
node tools/test/kiem-tra.js 4 10,11    # chỉ lớp 4, chủ đề 10 và 11
```

Sửa ở `src/`, **không sửa tay** `dist/` hay `games/lop-hoc-ao/index.html` (sẽ bị ghi đè khi build).

## Tài khoản học sinh (bản GitHub)

`Jenny01` … `Jenny09` ứng với lớp 1 … 9, mật khẩu `jenny123`. Mỗi lớp có thêm 5 tài khoản dự phòng `Jenny0X-1` … `Jenny0X-5`.
Tiến độ lưu trong trình duyệt của từng máy (localStorage, khoá `jennyHS_<tài khoản>`).

## Ghi chú bản quyền

Đề bài và slide đều **viết lại** theo kiến thức từng tiết (đổi đồ vật, bối cảnh, số liệu), không chép nguyên văn sách.
Không đưa file PDF hay văn bản trích từ sách vào kho mã.
