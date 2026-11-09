Design system **Jenny** của Clb Học Toán cùng Jenny: một bảng màu, hai theme. Mọi màn hình mới của Lớp học ảo và các game vẽ từ token và thành phần ở đây; nguồn token trong mã là `design/tokens.json` (xuất qua lại bằng `design/design-system/xuat-token.py`, khác 0 giá trị).

## Hai theme, một thương hiệu

| | **Pixel** — học sinh, game | **Classroom** — giáo viên, phụ huynh, quản lý |
|---|---|---|
| Họ chữ | `pixel` (VT323) cho tiêu đề, nút, số; `body` (Be Vietnam Pro) cho câu chữ | `lms` (Lexend) cho tất cả, tiêu đề 500 |
| Bo góc | `radius-pixel` = 0 ở mọi chỗ | `radius-lms` = 8px cho thẻ, hộp thoại; nút và ô nhập 4px; nhãn tròn 16px |
| Viền, bóng | khung `px-frame` 3px (hoặc khuyết góc `frame-2`/`frame-3`), bóng cứng `0 4px 0 0 px-frame` | viền 1px `lms-line`, không bóng |
| Màu nhấn | `px-sea` (= `blue`) | `lms-pri` (= `blue`) |
| Nền trang | `px-bg` | `white`, luôn nền sáng |

Cả hai theme đọc cùng 25 màu logo (`navy`, `blue`, `amber`, `coral`…); theme chỉ chọn họ chữ và bo góc. Thuộc tính `data-theme` của tokens.css vì thế cho giá trị như nhau ở hai cột — đó là điều cố ý. Trong mã, theme đặt bằng `body.px` (Pixel) và `body.px.lms` (Classroom); trong thành phần của design system là `.jc-pixel` / `.jc-lms` trên phần tử bao ngoài.

## Luật đã chốt (không đổi ở đây)

- Học sinh dùng phong cách pixel ở mọi nơi; GV/PH/QL kiểu Google Classroom; **luôn nền sáng** (LUAT-DA-CHOT.md §2, §6j).
- Hình vẽ là sprite pixel tự vẽ (`PXS` trong mã), nhân vật **Bạn nữ (Jenny)** và **Bạn nam**; design system chỉ tham chiếu, không vẽ lại; không nhân vật có bản quyền, không ảnh ngoài.
- Thanh trên học sinh: logo đám mây + chữ JennyClub · VI|EN · nhạc · Đăng xuất. Thanh dưới tiểu học: Bản đồ · Toán Jenny · Nhà em · Cửa hàng.
- Thẻ chào: [hình Jenny] [Vịnh · Lớp / Chào …!] [cột sao trên, xu dưới]. Trang Quản lý = 4 nút lớn.

## Màu

- Chữ chính `app-ink` trên `app-surface`, `px-bg`; Classroom dùng `lms-ink` trên `white`. Chữ phụ `app-muted` / `lms-mute`.
- Trạng thái: đúng `px-leaf`/`lms-ok` trên nền `-soft` tương ứng; cảnh báo `px-sun-ink`/`lms-warn`; sai, nguy hiểm `px-coral`/`lms-bad`. Luôn kèm chữ hoặc biểu tượng, không chỉ dựa vào màu (⚠, ✓, ✕).
- Nút chính: chữ `app-sea-ink` (trắng) trên `px-sea`; Classroom chữ `white` trên `lms-pri`. Nút vàng: chữ `#2b1a00` trên `px-sun`.
- Bốn cặp dưới 4,5:1 giữ nguyên giá trị của mã, ghi trong usage, **chờ thầy quyết**: `app-leaf`/`app-leaf-soft` 3,90 · `px-leaf`/`px-leaf-soft` 3,23 · `home-paper`/`home-mint` 2,37 · `lms-warn`/`lms-warn-soft` 4,34. Nút (ngưỡng 3:1) đều đạt.
- Tiêu điểm bàn phím: Pixel viền 3px `px-sun`; Classroom viền 2px `lms-pri`, cách 2px.

## Chữ

- Pixel: tiêu đề/nút `px-h2` 28, `px-h3` 25, thẻ chào `px-hero` 40 (co tới 30), thanh dưới `px-nav` 18, số lớn `px-number` 46. Câu chữ `body` 15/1.5, ô phương án `option` 19/700, nút `button` 14.5/600, nhãn `pill` 12.5. **Không** đặt đoạn dài bằng VT323.
- Classroom: `lms-h1` 28/500, `lms-h2` 18, `lms-body` 15, nút `lms-button` 14.5/500, nhãn `lms-pill` 13, cột bảng `lms-th` 12.5. Không viết hoa, không giãn chữ.
- Trang chủ games: `home-h1`/`home-h2` (Baloo 2), `home-body` (Nunito) — không dùng trong Lớp học ảo.
- Trong app, chữ tự host ở `assets/fonts/` (P-08, 48 file woff2); design system không chứa file font, preview tải cùng họ chữ từ Google Fonts để hiển thị.

## Khoảng cách, cỡ chạm

- Bậc `space-1…5` = 4 · 8 · 12 · 16 · 24. Lề trang hai bên ≥ `space-4` (16px); khe giữa ô phương án, ô Quản lý `space-3`.
- Mọi nút, ô bấm của học sinh cao ≥ `size-tap` (48px); nhãn, chip không phải nút được nhỏ hơn. Kiểm tra ở khổ 320, 375, 414 và 900px: không tràn ngang.
- Nút Classroom hiện cao 36px (nhỏ 32px) — ghi đúng mã; đề xuất nâng lên 44/48 chờ thầy.

## Thành phần (12)

Mỗi thành phần có trang riêng với trạng thái và cỡ chạm; mọi ví dụ là chữ thật của app. **Màn hình mới phải ghép từ các thành phần này**, không vẽ nút/thẻ/nhãn mới.

1. **Nút** — chính · phụ · nguy hiểm · mờ · đã tắt · nhỏ; nút VÀO HỌC.
2. **Ô phương án** — 1, 2, 3 cột tự co; đang chọn, đúng, sai, đã dùng.
3. **Khung pixel** — thẻ viền 3px + bóng cứng; khuyết góc 2/3px; Classroom thành thẻ viền mảnh.
4. **Thẻ lớp** — dải màu đầu thẻ (Classroom), bản pixel cho học sinh.
5. **Bảng nhập** — tiêu đề dính trên, nút dính đáy, ô nhập cao 48.
6. **Toast** — một dòng, 2,8 giây.
7. **Hộp thoại** — thay `prompt()`/`confirm()`: hỏi mật khẩu, hỏi lại trước khi xoá.
8. **Thanh điều hướng** — trên (pixel · Classroom) và dưới (pixel).
9. **Huy hiệu mức** — Mới bắt đầu → Đang tập → Khá → Tốt → Vững.
10. **Thẻ chào** — trang Bản đồ.
11. **Nhãn cảnh báo** — pill ok/warn/bad, dòng ⚠, thanh demo.
12. **Ô Quản lý** — 4 nút lớn có số và cảnh báo.

Sáu mẫu trang (nhóm "Mẫu trang") ghép từ các thành phần trên: Bản đồ, Màn chơi, Phòng học, Lớp của tôi, Quản lý 4 nút, Đăng nhập. README của mỗi mẫu ghi khác biệt so với ảnh chụp app ngày 25/10/2026 (nhóm tài sản "Anh goc").

## Đề xuất chờ thầy duyệt (chưa đưa vào tokens.json của mã)

- Token mới: `drop-4` = `0 4px 0 0 px-frame` (bóng cứng), `border-3` = 3px, `radius-lms-btn` = 4px, `radius-lms-pill` = 16px, hai màu dải thẻ `#0E8FB8`, `#B07800`, màu nhãn Club `#28B568` (gần `green` #2AB563).
- Toast học sinh hiện còn bo 14px (app.css) — đề xuất 0 cho đúng theme Pixel.
- Nút Classroom 36px → 44px.

## Cách thêm thành phần

Thêm thư mục `components/<Tên>/` với `preview.html` (dòng 1 `<!-- @dsCard group="…" height=… -->`, bao ngoài `class="jc jc-pixel"` hoặc `jc jc-lms`, chỉ dùng `var(--token)`) và `README.md` (câu đầu = tóm tắt; trạng thái; cỡ chạm; ví dụ tiếng Việt thật; nên/không nên). Kiểu chung viết vào `components/bundle.css`. Giá trị mới phải vào `design/tokens.json` trước rồi chạy `xuat-token.py`.
