# Làm video giới thiệu

Cần: Chromium (`/opt/pw-browsers/...`), Playwright, ffmpeg, font `@fontsource/vt323` và `@fontsource/be-vietnam-pro` (npm).

1. Tạo `fontcss.css` (các `@font-face` trỏ tới file .woff2 của fontsource) và `blank.html` (`<html></html>`) trong thư mục này.
   Sửa đường dẫn ảnh logo / Jenny trong `panels.js` (cloud.svg.txt, jenny_px.txt) nếu chạy ở máy khác.
2. Build app: `python3 tools/build.py`.
3. Quay: `NODE_PATH=… node scenes.js` (hoặc `node scenes.js s03,s04` để quay lại vài cảnh; s03 phải đi trước s04).
4. Xem nhanh: `python3 sheet.py s01 s03` → ảnh tóm tắt từng cảnh.
5. Lời & thứ tự phần: sửa `caps.json` (bỏ khoá = bỏ phần). Dựng khung: `node panels.js`.
6. Ghép: `python3 compose.py` → `JennyClub_gioi_thieu.mp4`.
