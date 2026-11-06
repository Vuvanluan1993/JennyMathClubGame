# P-14 Vite + ES module cho Lớp học ảo

**Mục tiêu:** thay `build.py` nối chuỗi bằng Vite; mã thành module; 4 trang vai dùng chung chunk; hành vi không đổi.
⟳ 25/10: 14b sửa mọi file `js/core/*` (dòng import) nên **đụng** lane Firebase (`62`, `64`, `11`, `49`, `51`, `58`). Luật: RF2 mở sau khi PR Firebase (P-06a + P-20) đã gộp vào `main`; mỗi lần lane Firebase gộp thêm (P-09b, P-21), RF rebase lên `main` và **chạy lại** `tools/vite/tim-import.mjs` thay vì giải xung đột tay.

**Ước lượng:** 16 giờ = 2 phiên (14a Vite bọc mã cũ; 14b chuyển dần sang module). **Người dùng thấy gì:** trang tải nhanh hơn. **Cần trước:** P-01 (`package.json`), P-07 (`_student.py` đã tách demo), P-08 (`app.template.html` đã có CSP) đều đã push.

## 14a — Vite bọc mã cũ (không đổi 90 file)
- Mới: `src/lop-hoc-ao/vite.config.js` (multi-page: `hoc-sinh.html`, `giao-vien.html`, `phu-huynh.html`, `quan-ly.html`, `demo.html`; `base: '/JennyMathClubGame/games/lop-hoc-ao/'`), `src/lop-hoc-ao/js/00-globals.js` (nối các file theo đúng thứ tự `app.template.html:28-130` bằng plugin `vite-plugin-concat` tự viết 40 dòng, giữ phạm vi toàn cục).
- Chuyển việc của `_student.py`/`_teacher.py` thành plugin Vite `tools/vite/vai.js` (cùng các `replace` có `assert`); `build.py` còn là `npm run build` (giữ lệnh cũ cho tài liệu).
- `package.json`: `scripts.build = vite build`, `scripts.dev = vite`.
- DONE 14a: `npm run build` ra 4 trang chạy y như build cũ (so ảnh chụp + 7 kiểm tra §7); `dist/` có hash tên file; `games/lop-hoc-ao/` không còn trong git (P-02).

## 14b — module hoá
- Thứ tự: `01-tien-ich` → `export`; mọi file `core/*` thêm `import` những gì dùng (script `tools/vite/tim-import.mjs` liệt kê biến toàn cục dùng/định nghĩa mỗi file bằng acorn → sinh dòng import); hàm "đè" (`save`, `render`, `header`… bọc 3–8 lần) đổi thành **chuỗi hook** rõ: `hooks.on('render:after', fn)` trong `core/00-hooks.js`.
- Bỏ `document.write`, bỏ `'unsafe-inline'` khỏi CSP của trang Lớp học ảo.
- DONE 14b: `grep -c "^function render\b"` còn 1; không `window.*` ngầm (ESLint `no-undef` xanh); 7 kiểm tra §7 ĐẠT; ảnh chụp giống.

## Bẫy
- 24/10 thầy chốt "luôn nền sáng": `data-theme=light` inline script phải thành module `theme.js` chạy **trước** CSS (đặt trong `<head>` với `type=module` không được vì defer → dùng `<script>` nhỏ có hash CSP).
- `healAll()` phải giữ tiến độ cũ: khoá localStorage không đổi.
- Lane `wip/t27-tu-luyen-dang-them` sửa `72-tu-luyen.js`: gộp nó trước khi 14b chạm file đó.
