# Kiến trúc

Ứng dụng ghép từ nhiều file nguồn bằng **Vite** (`npm run build:lop-hoc-ao`, từ P-14a; `python3 tools/build.py` vẫn chạy được và gọi lệnh này; `npm run build` ở gốc kho = `tools/build_all.py` dựng cả kho).
Từ P-14b (26/10/2026) **mỗi file JS là một ES module**: đầu file `import { … }` đúng những tên nó dùng, khai báo được file khác dùng có `export`
(dòng import do `tools/vite/tim-import.mjs` sinh, không viết tay). Khi dựng, plugin bỏ import/export rồi nối thành **một** `<script>` thường theo đúng thứ tự
trong `app.template.html` (một phạm vi chung, hoisting như cũ) — xem mục "Module và hooks". Không còn `function` trùng tên hay gán lại hàm của file khác: đè bằng `hooks.de`.

## Dựng bản (Vite, P-14a — 25/10/2026)

| Lệnh | Làm gì |
|---|---|
| `npm run build` (= `vite build src/lop-hoc-ao`; `python3 tools/build.py` gọi lệnh này, tự `npm ci` nếu chưa có `node_modules`) | Ra `dist/` rồi chép 4 trang + `assets/` sang `games/lop-hoc-ao/` |
| `npm run dev` (= `vite src/lop-hoc-ao`) | http://localhost:5173/JennyMathClubGame/games/lop-hoc-ao/ — dựng lại mỗi lần tải trang (một file, không hash); `/JennyMathClubGame/…` phục vụ file tĩnh của kho (chữ tự host…). Sửa file rồi tải lại trang |
| `node tools/vite/tim-import.mjs` (`--xem`: chỉ báo) | Sinh lại dòng import/export mọi file JS + `toan-cuc-sinh.json`; lỗi khi còn tên chưa khai báo / gán chéo |
| `node tools/vite/chuyen-hooks.mjs` (`--xem`) | Đổi chỗ còn kiểu đè cũ (`X=function`, `function` trùng tên) sang hooks; chạy rồi mới `tim-import` |
| `npm run lint` (gốc kho) | ESLint `no-undef` + `no-import-assign` trên `src/lop-hoc-ao/js/**` (`eslint.config.mjs`) |
| `node tools/vite/so-anh.mjs <ra>` · `so-anh.mjs <A> <B>` | Chụp 44 ảnh (7 trang × 4 khổ, bản đầy đủ thêm 4 màn) rồi so hai thư mục, ngưỡng 0,1 % |

- `vite.config.js`: 9 entry (`hoc-sinh` → `index.html`, `giao-vien/`, `phu-huynh/`, `quan-ly/`; bản thử `thu-*` → `demo/…` (P-07, không vào git); `day-du` → `day-du.html` bản đầy đủ chỉ ở `dist/`), `base: '/JennyMathClubGame/games/lop-hoc-ao/'`. Trang là ảo: không có file `.html` trên đĩa.
- `tools/vite/noi-file.js` (plugin): đọc `app.template.html`, nối `/*@include …*/` theo đúng thứ tự (khối `<style>` và khối `<script>` chỉ gồm dòng include, mỗi loại đúng 1 khối — sai thì build dừng), file `.js` bỏ import/export (`tools/vite/module.js`), kiểm tra import khớp export, thay `__APP_VER__` (ngày commit · sha). Từ bản đầy đủ, `vai.js` dựng từng trang; plugin tách khối CSS → `assets/lop-hoc-ao-[hash].css` (chung 5 trang) và khối JS → `assets/<trang>-[hash].js`. Mã JS là asset: Rollup không đọc, không đổi tên, không minify.
- Giữ y bản cũ: script nhỏ trong `<head>` (`data-theme=light`, chữ tự host P-08, CSP, referrer) vẫn inline, chạy **trước** CSS; `<link>` CSS và `<script src>` đứng đúng chỗ khối cũ (thứ tự CSS, giờ chạy JS không đổi). Mỗi trang JS vẫn là **một** script (tách đôi sẽ đổi hoisting của hàm trùng tên). Khoá `localStorage` không đổi (mã giống từng byte).
- Đường dẫn asset ghi **tương đối** (`assets/…`, `../assets/…`): cùng một bản chạy trên Pages (dưới `base`), ở máy chủ thử phục vụ gốc kho tại `/` (`npm test`) và trong `dist/`.
- `dist/lop-hoc-ao-jenny.html`: bản đầy đủ **một file** (CSS/JS inline, không doctype) — y build cũ; bộ kiểm tra §7 và Artifact dùng file này. `dist/day-du.html` = cùng nội dung nhưng CSS/JS ra file có hash.
- `games/lop-hoc-ao/assets/` sinh ra mỗi lần build (xoá cũ trước), có `.gitignore` tự sinh (`*`) nên không vào git.
- So với build Python (25/10/2026, tip 78be60f): 4 trang dạng một file giống từng byte; ảnh 4 trang × 4 khổ (320/375/414/900) giống từng byte; `demo.html` ≤ 0,001 %.

## Module và hooks (P-14b — 26/10/2026)

- **Import/export**: mỗi file khai báo ở phạm vi module; tên dùng mà không khai báo phải import từ đúng file khai báo nó. `tools/vite/tim-import.mjs` tính bằng acorn + eslint-scope rồi ghi lại đầu file (bỏ import/export cũ, sinh mới; mã còn lại giữ từng byte) — **sau mỗi lần rebase chạy lại lệnh này, không giải xung đột tay ở dòng import**. Import "ngược" (file trước dùng hàm của file sau) được phép vì chỉ gọi trong thân hàm; không file nào dùng giá trị của file sau ngay lúc nạp (tim-import kiểm).
- **Khi chạy**: vẫn một script thường (plugin bỏ import/export rồi nối) → hoisting, `onclick="…"`, mã `vai.js` chèn, `page.evaluate` của bộ kiểm tra như cũ. Bước 14c (chưa làm): cho Rollup gộp thật — cần hết `onclick` inline (xem CSP) và lớp phơi tên ra `window`.
- **Hooks** (`js/core/00-hooks.js`, nạp trước `01`): thay kiểu đè bằng gán lại / `function` trùng tên.
  - File định nghĩa: `function render(...a){return hooks.goi('render',this,a)}` rồi `hooks.ham('render',function(){…})` (vẫn là khai báo `function` → hoisting, `window.render`, `onclick` như cũ; hàm dạng biến: `const X=hooks.ham('X',…)`).
  - File sau đè (cách chính): `hooks.on('render', cu => function(){ … cu.apply(this,arguments) … })` — `cu` là bản ngay trước. Thay hẳn không cần bản trước: `hooks.de('render',fn)`; giữ bản cũ để dùng nhiều nơi: `const cu=hooks.cu('render')`. Đè tạm: `hooks.de` … `hooks.bo`. Mã `vai.js` chèn cuối trang thay **bản gốc**: `hooks.goc('header',…)` (đúng như khai báo `function` trùng tên thắng từ đầu nhờ hoisting). Thứ tự đè = thứ tự file. Hook sự kiện cho mã mới: `hooks.khi('render:sau',fn)`/`hooks.run`.
  - Xem mọi chỗ đè: `grep -nE "hooks.(on|de)\('" js/**/*.js` (218 `on`, 27 `de`). `tools/vite/chuyen-hooks.mjs` đổi tự động chỗ còn kiểu cũ (sau rebase): bước 1–3 ra `cu`+`de`, chạy lần nữa bước 4 gộp thành `on`.
- **Trạng thái dùng chung** (biến được gán ở ≥ 2 file: `S`, `role`, `sid`, `scr`, `KEY`, `STUDENTS`, `CLOUD`, `LANG`, `UNL`, `gvGrade`… 23 tên): khai báo `globalThis.X=…` tại chỗ cũ (toàn cục tường minh, không import). Danh sách sinh ra: `tools/vite/toan-cuc-sinh.json`; tên do mã chèn/SDK đặt (`ACC`, `firebase`, `fbMKVua`): `tools/vite/toan-cuc.json` (viết tay, có lý do). ESLint đọc cả hai.
- **ESLint** (`eslint.config.mjs` gốc kho, `npm run lint`): `no-undef`, `no-import-assign` → 0 lỗi trên 178 file.

## Nội dung theo khối (P-15a — 26/10/2026)

- Nội dung bài học nằm ở `content/lop-1` … `content/lop-5`, `content/lop-6-9` (ngoài `js/`). Mỗi thư mục: `index.js` **`export function dangKy(reg)`** + các file con
  (`10-hk1.js` đảo chủ đề 1–5 và bộ câu chỉ lớp đó dùng, `20-bai-giang.js` slide, `30-hk2-phan-a.js`, `31-hk2-phan-b.js`; lớp 6–9: `02`…`08` như số cũ).
  `dangKy` đổ vào trạng thái chung qua `reg` = `{PRIM, P1BY, ALLP1, P2, LES, MG, MGT, addTopic}` (`core/30a-dang-ky-khoi.js`; `PRIM` khai ở `core/25`).
- **Helper dùng từ hai lớp trở lên ở core** (`core/30b` bộ máy tiểu học, `30c` câu hỏi chung `NQ/CQ/SG/ORD/F/buildIsl`, `30d` hình phẳng/góc/đồng hồ, `30e` hình học/số lớn,
  `30f` hình vẽ/lời văn, `30` khung Bài giảng). Bộ câu chỉ một lớp dùng (`QT2`, `QL5`, `QDC5`…) ở `content/lop-N/10-hk1.js`. Content chỉ import từ core hoặc thư mục mình.
- **Khi dựng** (`tools/vite/noi-file.js`): dòng `/*@include content/lop-N/index.js*/` trong `app.template.html` = cả thư mục, gói thành **một phạm vi hàm riêng**
  rồi gọi `dangKyKhoi('lop-N', {dangKy})` ngay tại chỗ (tên trùng giữa các khối không đụng nhau). `lop-6-9` đứng sau `core/30a` (trước `core/09`: `core/21` đọc `P1BY[6]`
  lúc nạp), `lop-1` … `lop-5` sau `core/30-bai-giang` (trước `core/33d`, `45`, `48`: ba file này duyệt `PRIM` lúc nạp) → thứ tự chạy như trước P-15a.
- `tim-import.mjs`: tên khai báo trong một khối chỉ thấy trong khối đó; core không import từ content; `dangKy` của `index.js` luôn export. `chuyen-hooks.mjs` bỏ qua `content/`.
- `vite.config.js`: P-15a đặt `manualChunks` = `chunkKhoi`; P-15b bỏ (mỗi khối là một điểm vào, xem mục dưới).
- Gzip (26/10): core 437 KB · lop-1 24 · lop-2 42 · lop-3 47 · lop-4 44 · lop-5 50 · lop-6-9 18 KB. Trang học sinh hiện 685 KB (tĩnh, đủ 6 khối); khi chỉ tải một khối ≈ 489–515 KB.

### Tải theo khối (P-15b — 26/10/2026)
- **Các trang** (học sinh, giáo viên, phụ huynh, quản lý, bản thử `demo/…`, `dist/day-du.html`) không nối nội dung: dòng include khối thành chú thích. Mỗi khối là chunk ES
  `assets/lop-N-[hash].js` (`noi-file.js` `emitFile` điểm vào `content/lop-N/index.js`; transform bỏ dòng import từ `js/core`: tên core là toàn cục của script chung, module đọc được).
  Trang có `<script type="application/json" id="khoi-url">{"lop-1":"assets/lop-1-….js",…}</script>` ngay trước `<script src>`. **Bản học sinh không có `lop-6-9`.**
  **Bản một file** (`dist/lop-hoc-ao-jenny.html`) và `npm run dev` vẫn nối tĩnh như P-15a (Artifact, 6 kiểm tra §7 mở file này qua `file://`).
- `core/30a`: `napKhoi(k)` → `import(new URL(đường, document.baseURI))` rồi `dangKyKhoi(k, module)` → `hooks.run('khoi:sau', k)`. `khoiCua(lớp)` (1–5 → `lop-N`, ≥ 6 → `lop-6-9`),
  `khoiXong(k)`, `khoiCo(k)` (trang có khối này), `window.__ready(g)` (bộ kiểm tra chờ trước khi đọc `PRIM[g]`).
- `core/34`: hook ngoài cùng của `render()` tính khối cần (`khoiCan`: học sinh/phụ huynh = lớp của em đang xem; cô = lớp đang mở hoặc các lớp của cô; quản lý = lớp đang xem chi tiết hoặc mọi khối có học sinh;
  bản thử chưa có dữ liệu mẫu = mọi khối), thiếu thì hiện màn chờ pixel và tải, xong gọi lại `render()`. `body.locked` (màn đăng nhập) thì chỉ hiện màn chờ, chưa tải.
  Màn vẽ lỗi vì cần khối của em khác → tải thêm khối của mọi em trong danh sách rồi vẽ lại (`console.warn` ghi lại).
- **Mã core đụng nội dung lúc nạp phải chạy lại cho khối đến sau**: viết thành hàm, gọi ngay một lần (bản một file) và `hooks.khi('khoi:sau', hàm)`, có cờ để chạy lại không làm hai lần
  (`33d` `bossHe`, `45` `gdFlip`, `48` `en`, `72` `x.dt`). Không đọc `P1BY`/`PRIM` ở cấp module (`21` `hint6()` tính khi dùng). `kich-co.mjs` so dữ liệu từng khối với bản một file để bắt chỗ sót.
- Học sinh tạo khi chưa có khối (`newStudent` → `blankP1` rỗng): `healAll` (`30b`) điền ô `p1`/`p2` còn thiếu theo mẫu `blankP1`/`blankP2`.
- Kiến thức trò chơi (`core/39e` `ktGrade(G)`) cần đảo cuối của lớp G−1: khối lớp 2–5 mang `KT_TRUOC` (`content/lop-N/90-kien-thuc-truoc.js`, sinh bằng `node tools/test/kich-co.mjs --ghi`;
  `npm test` báo khi lệch — sinh lại sau khi đổi nội dung lớp dưới hoặc `39e`).
- Kích cỡ (26/10, gzip -9): trang học sinh 3,8 + CSS 24,9 + JS 440,6 + một khối 22–47 KB = 492–517 KB (trước 680 KB). `tools/test/kich-co.mjs` fail nếu > 700 KB hoặc bản học sinh có `lop-6-9`.

## Thứ tự nạp (rút gọn)

1. `core/00` hooks; `core/01` tiện ích (`R`, `pick`, `shuf`, `range`, `esc`…), `core/03`, `core/30a` đăng ký khối, rồi khối `content/lop-6-9` (lớp 6–9, Toán Jenny lớp 6).
2. `core/09–20` dữ liệu demo, lưu trữ, giao diện chung, học sinh / giáo viên / phụ huynh, chơi màn lớp 6.
3. `core/23b` vùng biển: `BIOME` (màu nước, kiểu đảo, hiệu ứng), `BIOME_ORDER[lớp]`, `OCEAN[lớp]`, `biomeOf(lớp, chủ đề, tên)`, `biomeFx()`.
   `core/22–23` đồ hoạ pixel (`PXS`, `spr()`, `pixelize()`), biển động (`startSea()`).
4. `core/30b` **bộ máy tiểu học**: `startG1`, `ans1`, `render` các dạng câu, `viewIsland1`, bản đồ chủ đề…
   `core/25` Sổ lỗi sai và Toán Jenny tiểu học (`PRIM={}`).
5. `core/30c–30f` helper câu hỏi, hình vẽ dùng chung; `core/30` khung Bài giảng Jenny (`addTopic`, `lesOf`, `viewLes`);
   rồi khối `content/lop-1` … `lop-5` (mỗi khối đăng ký đảo chủ đề 1–5, slide, học kì 2).
6. `core/33b` âm thanh: `sfx(tên)` (thư viện `SFX`), nhạc nền `THEMES` chọn theo màn trong `musicTheme()`, `hurtFx()` hiệu ứng mất tim; bọc `render()` để đổi nhạc và vẽ nút âm thanh.
7. `core/33c–33e`: trùm hoạt hình, Jenny biểu cảm + hệ màu trùm theo vùng (`BIOME_HE`), Hộ chiếu đại dương (`st.pass`, `st.outfit`, `ofVariant`).
8. `core/35` Hồ sơ của em: ghi nhận (`hsRec` bọc `ans1`), 6 trục (`HS_AX`, `hsAxOf`), điểm trục (`hsScores`), màn Luyện (`startLuyen`, chạy trên chế độ Sổ lỗi sai với cờ `lz`), giao diện `viewHoSo`.
9. `core/31–33` tính năng chơi thêm (Trùm lớp, Đua giờ, Kho báu, Sưu tập, Câu cá, Bóng bay). `core/34` khởi động.

## Dữ liệu chính

| Tên | Ý nghĩa |
|---|---|
| `S` | Toàn bộ trạng thái, lưu `localStorage[KEY]`. `S.st[sid]` = một học sinh (grade, coins, p1, mist…). |
| `PRIM[g]` | Lớp `g` (1–5): `T` danh sách chủ đề, `isl` mảng đảo, `boss` trùm từng chủ đề. |
| đảo `x` | `{id, title, lesson, b (số bài), tiet, ntiet, ti (chủ đề, từ 0), lv:[[gen Màn1],[gen Màn2],[gen Trùm]?], nm, boss, goal}` |
| `s1(st,id)` | Tiến độ một đảo của học sinh: `{m:[đã qua màn?], fails:[], les:đã xem bài giảng}` |
| `MG[g]` | Luật Câu cá / Bóng bay chủ đề 1. `MGT[ti][g]` cho chủ đề `ti ≥ 1`. Khai ở `core/30a`, khối `content/lop-N` đăng ký. |
| `LES[g][bài]` | Slide Bài giảng Jenny: `[{t, h, say}]`. Trang cuối luôn là "Em nhớ nhé". |
| `st.dd` | Số liệu theo ngày `'YYYY-MM-DD' → {n câu, c đúng, sec giây}` (bản học sinh theo lịch thật; bản demo: ngày 1 = 05/09/2026). |
| `st.sk` | Theo dạng bài (`q.kind`): `{r:[10 kết quả gần nhất 1/0], t:lần cuối, ax:trục}`. Câu Trùm ghi 2 lần. |
| `st.skm` | Điểm trục theo tháng `'YYYY-MM' → {trục: điểm}` (vẽ nét "tháng trước"). |
| Trục | `so` Số · `pt` Phép tính · `lv` Giải toán lời văn · `hh` Hình học · `dl` Đo lường · `tk` Thống kê – Xác suất. Gắn bằng luật từ khoá `HS_RULES`; kiểm tra `node tools/test/truc-kien-thuc.js`. |
| `UNL` | Mở khoá tất cả đảo (mặc định bật; khoá lại bằng `localStorage.jennyLockOn='1'`). |

## Câu hỏi

Một bộ sinh câu là hàm trả về `q`:

```js
{type:'opt'|'num'|'tf'|'pick'|'order'|'slots'|'build', q:'đề (HTML)', say:'lời Jenny đọc', a:đáp án, sol:'lời giải', kind:'tên dạng', opts?, pic?, big?, cols?}
```

Helper hay dùng: `NQ` (nhập số), `CQ` (chọn 1), `SG` (dấu >, <, =), `ORD` (sắp xếp), `OQ` (chọn số có hình), `WQ` (lời văn),
`fN` (số có dấu cách), `dz/dv` (thập phân), `F` (phân số), các hình SVG `polySvg`, `angSvg`, `clockSvg`, `circSvg`, `rulerSvg`…

Bàn phím chỉ nhập **số nguyên ≥ 0** → đáp án thập phân, phân số, chữ phải dùng `CQ`.
Kích thước chữ phương án tự co cho vừa nút và đồng đều (`optLay`, `fitOpts`); quá bé thì tự chuyển 2 hoặc 1 phương án mỗi hàng.

## Bản học sinh

`tools/vite/vai.js` (`hocSinh`; trước P-14a là `tools/_student.py`, đã xoá 26/10) lấy bản đầy đủ rồi: đổi khoá lưu theo tài khoản, thêm màn đăng nhập (mật khẩu băm SHA-256),
ẩn vai trò giáo viên/phụ huynh và thanh demo, tính "ngày học" theo lịch (từ 05/09/2026).

## Chơi thêm (lớp 1–5)
`core/37-tro-choi-dot-1.js`: `islOpts2(x)` chọn 2–3 trò cho đảo (theo nội dung, cố định theo mã đảo); trang đảo dựng lại mục "Chơi thêm".
`core/38-tro-choi-dot-2.js`: thêm `scale` (Cân thăng bằng), `shop` (Cửa hàng Jenny), `train` (Tàu hoả xếp số) vào `XGN`; bọc `islOpts2` (đảo tiền → shop, đảo khối lượng → scale, còn lại theo nội dung và mã đảo), `startXG`, `viewXG`, `xgAfterRender`, `musicTheme`; kết thúc bằng `xg2End()`. Bảng trò từng đảo: chạy `islOpts2(x)`.
`core/38b-can-pixel.js`: vẽ Cân thăng bằng trên canvas pixel. `core/39-tro-choi-dot-3.js`: thêm `mole` (Đập chuột chũi, luật MGT/MG như Hứng sao), `frog` (Ếch nhảy lá súng, câu ngắn của đảo, 8 hàng), `shape` (Ghép hình pixel, đảo hình học, bộ hình theo lớp/bài: hình phẳng, khối, góc, bình hành/thoi/thang) vào `XGN`; bọc `islOpts2` (đảo hình học luôn có `shape`; lớp 1–3 thêm `shop` ở đảo Luyện tập/Ôn tập, lời văn); lớp 1 Cửa hàng dùng tiền chẵn nghìn (`shopNotes`, `shopPrice`). Cảnh vẽ trên canvas thấp (×3, `image-rendering: pixelated`).
Trò mới chạy ở màn `scr.k==='xg'` (`startXG(mode,id)`, `viewXG`, `xgEnd`): `star`, `pair`, `clock`. Kéo co dùng máy Đua giờ với cờ `scr.tug` (`startTug`).
Kỷ lục ở `st.mg['đảo:trò']`; ghi Hồ sơ qua `hsRec`.

## Chơi thêm theo kiến thức (`core/39e`)

- `ktGrade(lớp)` → mảng theo thứ tự đảo; mỗi phần tử `{f: tập dấu hiệu đã học, max: mức số}`. Dấu hiệu lấy từ tên/mục tiêu đảo và câu hỏi thật của đảo (phép tính chỉ lấy từ tên bài; số lấy từ đáp án đúng). Lớp sau bắt đầu bằng kiến thức cuối lớp trước. Tính một lần, số ngẫu nhiên cố định (`ktSeeded`).
- `ktViol(K, nội dung)` → các dấu hiệu chưa học hoặc số vượt mức. `ktAllowed(đảo, trò)` = yêu cầu tối thiểu + lấy mẫu không vi phạm.
- Nắn nội dung: `ktRule` (luật Câu cá/Bóng bay/Hứng sao/Đập chuột), `pairDeck`/`frogQ` (câu đảo này → 4 đảo trước → phép tính đã học → đếm chấm), `scaleRound`, `trainRound`, `shopRound`/`shopPrice`/`shopNotes`, `clockTarget`, `shapeSet`.
- `islOpts2` = `ktBalance(lớp)`: trò bắt buộc theo nội dung (Đồng hồ, Ghép hình, Cửa hàng, Cân) → một trò luyện đúng bài → lấp tới 3 bằng trò ít dùng nhất.
- Kiểm tra: `node tools/test/kien-thuc-tro-choi.js [lớp]` (cần playwright; `PW_DIR`, `OUT_DIR`, `CHROME` tùy chọn) → in vi phạm trước/sau, ghi `vi-pham.csv`, `cho-choi.csv`, `kien-thuc.json`.

## Trò Thả mồi câu cá (`core/39j`)
`startXG('bait', id)`: pha `idle → cast → wait → bite → reel/escape`, vẽ trên canvas 114×100 mỗi 120 ms (`baitDraw`), câu hỏi lấy từ `frogQ(x)` (đã lọc kiến thức ở `core/39e`). Được chia trò như Ếch nhảy (`ktAllowed`/`ktOwn`/`ktSample` ánh xạ `bait → frog`). Kỷ lục `st.mg['đảo:bait']`.

## Trò Trồng cây (`core/39k`)
- Mode `plant`. Cảnh canvas 114×100 (phóng ×3); cây vẽ với ô gấp đôi để nổi bật. 9 bậc (`g.stage` 0–8): hạt → mầm → hai lá → cây non → cây cao có cành (mưa rào + cầu vồng) → nụ → hoa → quả xanh → quả chín → thu hoạch vào giỏ.
- Loài cây theo đảo (`plantSp(id)`, băm mã đảo): táo, cam, xoài (cây ăn quả), dâu tây (bụi), hướng dương.
- Câu hỏi: `frogQ(x)` (đã lọc kiến thức như Ếch nhảy); `ktAllowed/ktOwn/ktSample/xgElig` coi `plant` như `frog`.
- Đúng: tưới, cây lớn 1 bậc. Sai 1: cây rũ, cỏ dại, khoá đáp án sai. Sai 2: ốc sên gặm lá, lượt này không lớn, sang câu khác. Không tim; 8 lần tưới hoặc 150 giây.
- Chia trò: một hàm `ktBalance0` duy nhất ở 39e; mỗi trò khai ưu tiên theo lớp trong `XG_BIAS[mode]` (số âm = được chọn nhiều hơn). Trồng cây: `XG_BIAS.plant` ưu tiên lớp 1–2.
- Lưu: kỷ lục `st.mg['đảo:plant']`, xu tối đa 20, nhật kí "Trồng cây · …", câu trả lời ghi `st.dd`, `st.sk` qua `xgRec`.

## Trò Leo núi tìm kho báu (`core/39l`)
- Mode `climb`, dành cho tiết toán có lời văn. Cảnh 114×84 (phóng ×3); núi dựng sẵn một lần vào canvas phụ 114×288 (`climbWorld`), mỗi 120 ms chỉ vẽ trời, mây, đại bàng, tuyết, Jenny, rương (`climbDraw`); camera đi theo Jenny.
- 6 chặng + đỉnh có rương. Đúng: leo dây lên chặng sau, bảng "Chặng n/6 ✓". Sai 1: đá lăn, khoá đáp án sai. Sai 2: nghỉ ở trại, hiện đáp án và lời giải, sang bài khác, không mất chặng. 300 giây, không tim.
- Đề: `climbQ(x)` lấy bài lời văn (`climbIsWord`) của đảo, thiếu thì của 1–4 đảo trước (`ktPrev`), lọc `ktViol`. Câu số: đáp án + 2 phương án gần (±1, ±10, làm nhầm phép tính), không âm, kèm đơn vị lấy từ lời giải.
- Chia trò: chỉ đảo có bài lời văn (`climbHas`); "đúng nội dung" khi chính đảo có nhiều bài lời văn (`climbOwn`); `XG_BIAS.climb`.
- Lưu: kỷ lục `st.mg['đảo:climb']`, xu tối đa 20, nhật kí "Leo núi · …", `st.dd`, `st.sk` qua `xgRec`.



## Hướng dẫn khi làm sai (js/core/40-huong-dan-khi-sai.js)
- `gdKind(q)` nhận dạng: `hand` (lớp 1, ≤10), `line` (lớp 2, ≤20), `word` (các bước tính trong `q.sol`), `sd` tổng–hiệu, `sr` tổng–tỉ, `dr` hiệu–tỉ. Không đọc chắc được thì trả `null` và không hiện nút.
- `gdOpen(q,auto)` mở khung; các khung `{h,say,dur,mcq}`. `gdHand/gdHands` vẽ bàn tay ngửa pixel (có cache).
- Gắn vào `sheet1`, `ans1`, `q1`, `next1`, `g1AfterRender`: `scr.gdRedo` ('same' → 'sim'), `scr.gdPq` là câu tương tự (sinh lại từ `q.src`).
- Bản đồ: `moveTopicStars()` trong 39n đưa số sao vào cạnh nhãn vùng biển.
