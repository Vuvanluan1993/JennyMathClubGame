# P-03 Token thiết kế chung

**Mục tiêu:** một nguồn màu/chữ/khoảng cách/cỡ chạm cho app học sinh, trang LMS, trang chủ và Bebras kit. Không đổi giao diện mắt thấy.
**Ước lượng:** 6 giờ. **Người dùng thấy gì:** không (giao diện giữ nguyên). **Cần trước:** không.

## File sửa
- Mới: `design/tokens.json` (nguồn), `design/tokens.css` (sinh từ JSON bằng `tools/tokens.py`), `tools/tokens.py`, `tools/check_contrast.py` (đo tương phản từng cặp chữ/nền trong tokens, ngưỡng 4.5 và 3.0).
- Sửa: `src/lop-hoc-ao/css/app.css` khối `:root` (giữ tên cũ `--ink`, `--sea`… trỏ sang `--jc-*`), `games/tu-duy-bebras/_kit/kit.css` `:root`, `index.html` `:root`.
- Sửa: `src/lop-hoc-ao/app.template.html` thêm `/*@include ../../design/tokens.css*/` trước `app.css`; `index.html`, `kit.css` import `design/tokens.css`.

## Token (lấy từ `PXC` ở `22-do-hoa-pixel-mau-logo-clb.js:2` và bảng Classroom ở `80-phong-cach-lms.js`)
- Màu: 25 màu logo (`--jc-navy #1F2A5A`, `--jc-coral #F26249`, `--jc-green #2AB563`, `--jc-sky #12B5E8`, `--jc-blue #0079C1`, `--jc-purple #8656A8`, `--jc-orange #F37A1F`, `--jc-sun #FCD655`…) + nền/sáng.
- Chữ: `--jc-font-pixel: VT323`, `--jc-font-body: 'Be Vietnam Pro'`, `--jc-font-lms: Lexend`, `--jc-font-home: 'Baloo 2'`, `--jc-font-home-body: Nunito`.
- Khoảng cách 4/8/12/16/24; cỡ chạm `--jc-tap: 48px`; khung pixel `--jc-frame-2/3` (= `--f2/--f3`); bo `--jc-radius-pixel: 0`, `--jc-radius-lms: 8px`.
- Hai theme: `[data-theme-family=pixel]` và `[data-theme-family=lms]` chỉ đổi họ chữ và bo góc.

## Việc phải xong (DONE)
1. Ảnh chụp 320/375/414/900 của app học sinh, trang Quản lý, trang chủ, 1 game Bebras **trước và sau** giống nhau từng pixel (so bằng Playwright `toHaveScreenshot`, sai số 0.1%).
2. `python3 tools/check_contrast.py` in 0 cặp dưới ngưỡng, hoặc liệt kê cặp cần thầy quyết.
3. `tokens.css` sinh lại từ JSON cho cùng kết quả (`git diff` trống).

## Bẫy
- `PXC` trong JS vẽ canvas, không đọc CSS; chỉ thêm chú thích "nguồn: design/tokens.json", không đổi mã vẽ.
- Luật đã chốt: học sinh pixel, LMS kiểu Classroom, luôn nền sáng (LUAT §6j). Token chỉ gom, không đổi.
- P-08 cũng sửa `index.html` và `app.template.html` (phần `<link>`/`<meta>`): P-08 chạy **sau** P-03 trong cùng lane.
