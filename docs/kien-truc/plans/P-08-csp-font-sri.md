# P-08 CSP, SRI, chữ tự host, bỏ `document.write` và `translate_tts`

**Mục tiêu:** đóng GL-H3, GL-M1, GL-M3, GL-M4, LH-M5. Trang không gọi Google khi tải; script ngoài có SRI; có CSP qua `<meta>`.
**Ước lượng:** 8 giờ. **Người dùng thấy gì:** trang mở nhanh hơn, chạy khi mất mạng tốt hơn; 3 game mầm non/tiểu học đọc đề bằng giọng máy thay giọng Google. **Cần trước:** P-03 đã push (cùng sửa `index.html`, `app.template.html`, `kit.css`).

## File sửa
- Mới: `assets/fonts/*.woff2` (Baloo 2 600/700/800, Nunito 500–900, VT323, Be Vietnam Pro 400–700, Lexend 400–700; latin + vietnamese subset) + `assets/fonts/fonts.css` (`font-display: swap`).
- `index.html`: bỏ `<link>` Google Fonts (`:9-10`); `:150-151` bỏ `document.write`, dùng `<script src="games.js?v=__SHA__">` (CI điền) ; thêm `<meta http-equiv="Content-Security-Policy">` và `<meta name="referrer" content="no-referrer">`.
- `src/lop-hoc-ao/app.template.html:6`: như trên; CSP cho phép `https://www.gstatic.com` (Firebase), `https://*.googleapis.com`, `https://*.firebaseio.com`, `wss:`; `js/core/62-may-chu.js:16` thêm `integrity` + `crossorigin` cho 3 file Firebase compat 10.12.2 (hash ghi trong `docs/SRI.md`).
- 17 trang game `games/**/index.html`: bỏ Google Fonts, thêm 2 `<meta>`; `games/hanh-trinh-jenny/{mam-non:1111,tham-tu:1317,tieu-hoc:806}` bỏ `translate_tts`, chỉ `speechSynthesis` (đã có) và MP3 thu sẵn khi có.
- `games/tu-duy-bebras/_kit/kit.js:96,198`: `n` ép số (`+P.get('n')||0`).
- `tools/build_tham_tu.py` nếu có: sinh lại `tham-tu` từ `mam-non` sau khi sửa.

## CSP đề xuất (trang tĩnh)
`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'`
Trang Lớp học ảo thêm nguồn Firebase vào `script-src`/`connect-src`. `'unsafe-inline'` còn vì mã inline; P-14 (module) sẽ bỏ.

## Việc phải xong (DONE)
1. Mở từng trang với DevTools › Network: không yêu cầu nào tới `fonts.googleapis.com`, `fonts.gstatic.com`, `translate.google.com` (script Playwright `tools/test/khong-goi-ngoai.mjs` kiểm tra 17 trang + 4 trang Lớp học ảo, cho phép đúng danh sách Firebase).
2. Console không có lỗi CSP khi chơi hết 1 màn mỗi game (`check_fit.py` bắt `pageerror`).
3. Chữ hiển thị đúng họ (so ảnh chụp với P-03 baseline, sai số ≤ 0.5%).
4. `games.js` được cache (header 304 lần 2).

## Bẫy
- Firebase compat đổi phiên bản thì hash SRI đổi: ghi phiên bản ở một chỗ (`FB_VER`).
- `speechSynthesis` tiếng Việt không có trên mọi máy: giữ nút loa báo "Máy không có giọng tiếng Việt" (đã có logic ở mầm non).
- Font subset vietnamese bắt buộc (dấu tiếng Việt).
