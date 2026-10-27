# P-14 Vite + ES module cho Lớp học ảo

**Mục tiêu:** thay `build.py` nối chuỗi bằng Vite; mã thành module; 4 trang vai dùng chung chunk; hành vi không đổi.
⟳ 25/10: 14b sửa mọi file `js/core/*` (dòng import) nên **đụng** lane Firebase (`62`, `64`, `11`, `49`, `51`, `58`). Luật: RF2 mở sau khi PR Firebase (P-06a + P-20) đã gộp vào `main`; mỗi lần lane Firebase gộp thêm (P-09b, P-21), RF rebase lên `main` và **chạy lại** `tools/vite/tim-import.mjs` thay vì giải xung đột tay.

**Ước lượng:** 16 giờ = 2 phiên (14a Vite bọc mã cũ; 14b chuyển dần sang module). **Người dùng thấy gì:** trang tải nhanh hơn. **Cần trước:** P-01 (`package.json`), P-07 (`_student.py` đã tách demo), P-08 (`app.template.html` đã có CSP) đều đã push.

## 14a — Vite bọc mã cũ (không đổi 90 file)
- Mới: `src/lop-hoc-ao/vite.config.js` (multi-page: `hoc-sinh.html`, `giao-vien.html`, `phu-huynh.html`, `quan-ly.html`, `demo.html`; `base: '/JennyMathClubGame/games/lop-hoc-ao/'`), `src/lop-hoc-ao/js/00-globals.js` (nối các file theo đúng thứ tự `app.template.html:28-130` bằng plugin `vite-plugin-concat` tự viết 40 dòng, giữ phạm vi toàn cục).
- Chuyển việc của `_student.py`/`_teacher.py` thành plugin Vite `tools/vite/vai.js` (cùng các `replace` có `assert`); `build.py` còn là `npm run build` (giữ lệnh cũ cho tài liệu).
- `package.json`: `scripts.build = vite build`, `scripts.dev = vite`.
- DONE 14a: `npm run build` ra 4 trang chạy y như build cũ (so ảnh chụp + 7 kiểm tra §7); `dist/` có hash tên file; `games/lop-hoc-ao/` không còn trong git (P-02).

⟳ 26/10 (RF2, nhánh `claude/vite-es-module-ed2d3e`, PR vào `tich-hop/kien-truc-2026-10`): 14b **xong phần module + hooks**: 118 file có import/export sinh bởi `tim-import.mjs`; `00-hooks.js` (`ham/goi/on/de/cu/goc/bo/khi/run`), 110 hàm gốc + 245 chỗ đè (218 `hooks.on(cu=>…)`, 27 `de`), 0 `function` trùng tên, 23 trạng thái dùng chung `globalThis.*`; ESLint `no-undef` + `no-import-assign` 0 lỗi; 44 ảnh giống 0,000 %; `npm test` 13/13. Khi chạy vẫn **một script thường** (plugin bỏ import/export rồi nối) — Rollup gộp thật để sang 14c. **Chưa làm:** bỏ `'unsafe-inline'` khỏi `script-src`: còn 520 `onclick="…"` trong chuỗi HTML (244 có `${…}`), phải viết lại thành `data-*` + uỷ quyền sự kiện → tách thành 14c. `document.write` vốn không có. Thêm: vai.js có bản thử (P-07), xoá `_student.py`/`_teacher.py`.

## 14b — module hoá
- Thứ tự: `01-tien-ich` → `export`; mọi file `core/*` thêm `import` những gì dùng (script `tools/vite/tim-import.mjs` liệt kê biến toàn cục dùng/định nghĩa mỗi file bằng acorn → sinh dòng import); hàm "đè" (`save`, `render`, `header`… bọc 3–8 lần) đổi thành **chuỗi hook** rõ: `hooks.on('render:after', fn)` trong `core/00-hooks.js`.
- Bỏ `document.write`, bỏ `'unsafe-inline'` khỏi CSP của trang Lớp học ảo.
- DONE 14b: `grep -c "^function render\b"` còn 1; không `window.*` ngầm (ESLint `no-undef` xanh); 7 kiểm tra §7 ĐẠT; ảnh chụp giống. (26/10: đạt, trừ `'unsafe-inline'` → 14c.)

⟳ 27/10 (P-14c, nhánh `claude/p14c-bo-unsafe-inline-d573c3`, PR vào `tich-hop/kien-truc-2026-10`): **14c xong phần CSP**: `script-src 'self' https://www.gstatic.com;` (bản một file `lop-hoc-ao-jenny.html` và dev được `motFile()` thêm lại `'unsafe-inline'`). 522 thuộc tính inline → `data-act` + `js/core/02-hanh-dong.js` (một listener uỷ quyền trên `document`, hàm đăng ký `hd.dangKy` ở cuối từng file); công cụ `tools/vite/bo-inline.mjs` đổi 480 chỗ, 42 chỗ sửa tay (chuỗi mã truyền handler, regex sửa HTML đã sinh, `${…}` sinh mã, chỗ đọc thuộc tính). 3 script `<head>` → `js/dau-trang.js` tải đồng bộ (`assets/dau-trang-[hash].js`), **không cần hash CSP**. **Chạy lại sau rebase**: `cd src/lop-hoc-ao && node tools/vite/bo-inline.mjs` (in chỗ phải sửa tay + id chưa đăng ký) → `node tools/vite/tim-import.mjs` → `npm run lint`. **Không làm**: Rollup gộp `iife` (không cần cho CSP, đổi tên biến phá `page.evaluate`). Chi tiết: `src/lop-hoc-ao/CHANGELOG.md` 27/10.

## 14c — gộp thật bằng Rollup, bỏ `'unsafe-inline'` (27/10: bỏ `'unsafe-inline'` ĐÃ LÀM, Rollup iife không làm)
- Viết lại 520 `onclick="…"` (244 có `${…}`) thành `data-act` + một trình uỷ quyền sự kiện (không eval); lớp phơi tên ra `window` cho mã `vai.js` chèn và `page.evaluate`; đổi `hooks.goc` của mã chèn thành module riêng theo vai; sau đó cho Rollup gộp (`format: 'iife'`), bỏ `'unsafe-inline'` khỏi `script-src`, 3 script nhỏ trong `<head>` ra file.

## Bẫy
- 24/10 thầy chốt "luôn nền sáng": `data-theme=light` inline script phải thành module `theme.js` chạy **trước** CSS (đặt trong `<head>` với `type=module` không được vì defer → dùng `<script>` nhỏ có hash CSP).
- `healAll()` phải giữ tiến độ cũ: khoá localStorage không đổi.
- Lane `wip/t27-tu-luyen-dang-them` sửa `72-tu-luyen.js`: gộp nó trước khi 14b chạm file đó.
