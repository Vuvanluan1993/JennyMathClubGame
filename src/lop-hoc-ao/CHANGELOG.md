# Lịch sử thay đổi

## 28/10/2026 — Trang Quản lý: bỏ bảng "Tài khoản" gom, nút 🔑 đặt lại mật khẩu ở từng dòng (PR vào `tich-hop/kien-truc-2026-10`)
- **Bỏ** bảng "Tài khoản" (P-05 chèn vào cuối trang Phụ huynh) liệt kê mọi giáo viên, học sinh, phụ huynh: trùng 3 trang đã có, không lọc, không chia trang,
  lại in mật khẩu tạm ra giữa trang. Thầy chốt 28/10 (xem `LUAT-DA-CHOT.md` 6j).
- **Nút 🔑** (đặt lại mật khẩu, chỉ bản máy chủ) ở từng dòng trang Học sinh, Giáo viên, Phụ huynh, cạnh ✎ Sửa; không hiện ở dòng của chính người đang đăng nhập
  (dùng "Đổi mật khẩu"). Nút "Đặt lại mật khẩu cả lớp" ở trang một lớp giữ nguyên.
- **Dòng mật khẩu tạm** (`fbMKPhienDong`, đầu trang chính và 3 trang danh sách): chỉ ghi số người và tên đăng nhập vừa đặt lại trong phiên + nút 🖨 In phiếu; mật khẩu
  không in ra trang nữa, chỉ có trên phiếu. `qlInPhieu(ids,'auto')` tự chia học sinh / phụ huynh / giáo viên; thêm mẫu "PHIẾU ĐĂNG NHẬP GIÁO VIÊN" (trang `giao-vien/`).
- Hai hộp quản trị (Nâng cấp dữ liệu v3, Ví xu P-20) chuyển sang hộp **Máy chủ** (`fbMayChuBox`) ở cuối trang chính Quản lý.
- Mục "Tài khoản" riêng (lọc theo vai trò, trạng thái, khoá tài khoản, xuất dữ liệu) để làm cùng T-07b khi cần.

## 28/10/2026 — Sửa: nút Lưu/Tạo trong các bảng của trang Quản lý không chạy (sau P-14c, PR vào `tich-hop/kien-truc-2026-10`)
- **Lỗi**: ở bản dựng nhánh tích hợp, bấm "Tạo tài khoản" trong bảng Thêm học sinh (và Thêm giáo viên, Thêm lớp, Xếp lớp, Tài khoản phụ huynh,
  Sửa giáo viên/phụ huynh) không thấy gì: không tạo, không báo lỗi. Nguyên nhân: `bo-inline.mjs` đổi `onsubmit="event.preventDefault();${ok}"`
  (`ok` là *chuỗi mã* như `qlLuuHS()`) thành hành động `preventDefault` có thân `event.preventDefault();a[0]` — chỉ đọc chuỗi, không gọi hàm.
  Trang thật trên `main` không bị (vẫn dùng `onsubmit`).
- **Sửa** (`71-quan-ly-gon.js`, `81-sua-gv-ph.js`): `modal()`/`hop()` nhận `ok` là **tên hàm toàn cục** (`'qlLuuHS'`) hoặc `[tên, ...tham số]`
  (`['qlLuuXep', lid]`, `['qlLuuSuaGV', id]`); form ghi `data-act-submit="qlModalLuu"`, hành động `qlModalLuu` gọi `window[tên](...tham số)`
  (qua `window` để các lớp bọc ở 77/79 — phụ huynh tự động, chống bấm trùng — vẫn chạy). Bỏ id `preventDefault`.
- Đã thử trên bản `demo/quan-ly/` (FB_ENV=thu): 5 bảng lưu được, tự đóng, không lỗi console. Chưa thử lại với tài khoản thật trên dự án Firebase thử.

## 27/10/2026 — Bỏ `'unsafe-inline'` khỏi CSP (P-14c, PR vào `tich-hop/kien-truc-2026-10`)
- **CSP** của `app.template.html`: `script-src 'self' https://www.gstatic.com;` (không còn `'unsafe-inline'`; `style-src` giữ nguyên). 8 trang vai và `dist/day-du.html`
  không chạy một dòng JS inline nào. Riêng **bản một file** `dist/lop-hoc-ao-jenny.html` (bộ kiểm tra §7, Artifact) và `npm run dev` nối cả JS vào `<script>` nên
  `motFile()` trong `noi-file.js` thêm lại `'unsafe-inline'` cho đúng bản đó.
- **Hết thuộc tính sự kiện inline**: 522 chỗ `onclick=` / `onchange=` / `oninput=` / `onkeydown=` / `onsubmit=` / `onpointerdown=` (517 trong `js/core` + template, 5 trong
  `tools/vite/vai/*.js.txt`) → `data-act="<id>"` (click) hoặc `data-act-<sự kiện>="<id>"`, tham số ở `data-arg` / `data-arg-<sự kiện>` (JSON, sinh bằng `${hd.arg(x)}`
  / `${hd.argEv('change', x)}`; hành động chọn bằng mã: `hd.attr('<id>', …)`). Mới **`js/core/02-hanh-dong.js`**: đối tượng `hd` + **một listener uỷ quyền trên `document`**
  cho 6 sự kiện, đi từ phần tử bấm lên trên, gọi hàm đã đăng ký (`this` = phần tử, `event`, `a` = tham số — y hệt inline cũ; dừng khi `stopPropagation`). Hàm xử lý đăng ký
  **ở cuối chính file có HTML đó**: `hd.dangKy({ 'go-island-3': function(event,a){go({k:'island',id:a[0]})} })` (cùng thân → dùng chung một id; trùng id khác hàm → lỗi lúc nạp).
  Listener đăng ký lúc nạp `02` (đầu script) nên chạy trước listener `document` của `65` và `vai.js` — cùng thứ tự với inline cũ.
- **Công cụ `tools/vite/bo-inline.mjs`** (`--xem` để xem trước; chạy lại được sau rebase, chỉ thêm mục mới, id cũ giữ nguyên): 480 chỗ đổi tự động; **42 chỗ sửa tay**:
  10 chỗ truyền *chuỗi mã* làm handler (`act:\`go(...)\``, `tile(\`…\`)`, `shopNote(…)`, `tdCard(…)`, `ntfGo`) → `hd.attr(id, …)`; 13 chỗ **regex đọc/sửa HTML đã sinh**
  (`40`, `49b`, `53`, `54` ×3, `66` ×2, `71`, `72` ×2, `78`) đổi sang khớp `data-act="…" data-arg="\[&quot;id&quot;\]"`; 6 chỗ `${…}` sinh mã (`30b` ×2, `33e`, `49b:104`,
  `51`, `73:56`); 3 chỗ đọc thuộc tính (`62` tab vai, `39h` tờ tiền, `39m` cuộn tới đảo); `onclick=""` ở `35` → `data-act="khong"`; 2 chú thích. Công cụ in rõ từng chỗ phải sửa tay
  và kiểm **id dùng trong HTML mà chưa đăng ký**. Sau đó `tim-import.mjs` sinh import (`hd` + tên dùng trong hàm; thêm `_qlT` vào `toan-cuc-sinh.json`), `npm run lint` 0 lỗi.
- **Ba script nhỏ trong `<head>`** (đặt `data-theme=light` trước CSS, chèn `<link>` chữ tự host, zoom "trang web cho máy tính") gom thành **`js/dau-trang.js`**, template ghi
  `<script>/*@include js/dau-trang.js*/</script>` một dòng trước CSS; `noi-file.js` tách thành `assets/dau-trang-[hash].js` tải **đồng bộ** đúng chỗ (không `type=module`, không `defer`),
  bản một file nối thẳng. PWA precache thêm `assets/dau-trang-*.js`. Không cần hash CSP.
- Bộ kiểm tra: `tools/test/kich-co.mjs` đếm đảo bằng `[data-act^="go-island"]`, `tools/test/tu-luyen.js` xem `tile.dataset.act==='go-home-tl'`;
  `tools/test/giao-dien.spec.mjs` mở context `bypassCSP: true` (tiêm axe-core bằng `addScriptTag` là script inline, bị CSP mới chặn; CSP đã có `khong-goi-ngoai.mjs` kiểm).
  `.github/workflows/giao-dien.yml`: job check_fit `timeout-minutes` 10 → 25 (hay bị huỷ vì tải Chromium).
- **Kiểm tra** (máy thầy, `FB_ENV=thu`): `grep -rnE 'on[a-z]+="' app.template.html js content tools/vite/vai` → 0; `khong-goi-ngoai.mjs` 20 trang 0 vi phạm (không lỗi CSP);
  kịch bản Playwright bấm thử **12 luồng** (bản thử HS: đăng nhập, bản đồ 104 đảo, vào đảo, chơi màn, cửa hàng mua đồ 10 000 → 9 880 xu, các tab; bản thử GV/PH/QL; 4 trang thật
  màn đăng nhập + hiện mật khẩu + gửi form; `day-du.html` đổi vai; bản một file) → 0 lỗi CSP, 0 lỗi JS, 0 "hd: chưa đăng ký"; **`npm test` 14/14 ĐẠT** (7 kiểm tra §7 ĐẠT; `giao-dien.spec` ĐẠT sau khi thêm `bypassCSP`), `npm run lint` 0 lỗi, `tim-import` 0 lỗi.
- **Chưa chắc / lưu ý**: hàm xử lý chạy ở `document` (giai đoạn nổi bọt) thay vì tại phần tử: nếu sau này có listener trên phần tử *giữa* (vd `#app`) thì nó chạy **trước** hành động;
  hiện không có. Thêm nút mới: viết `data-act` + `hd.dangKy` ở cuối file (xem đầu `02-hanh-dong.js`), không viết `onclick`.
  Phần "cho Rollup gộp thật (`format: 'iife'`)" của kế hoạch 14c **không làm** trong PR này: không cần cho CSP, và đổi tên biến sẽ phá `page.evaluate` của bộ kiểm tra.

## 27/10/2026 — PWA ngoại tuyến (P-16, RF5, PR vào `tich-hop/kien-truc-2026-10`)
- **Cài lên màn hình điện thoại.** Mới `public/manifest.webmanifest` (tên "Lớp học ảo Jenny", `start_url`/`scope` `./`, `display` standalone, `theme_color` `#1F2A5A`, nền `#3FC1EC`)
  và icon pixel `public/icons/jenny-192.png`, `jenny-512.png`, `jenny-512-maskable.png` **sinh từ sprite `PXJ`** (`js/core/22`) lúc dựng (`iconPXJ` trong `vite.config.js`, pngjs; hình trong 80 % giữa, nền trời `#7FD3F0`) — đổi PXJ là icon đổi theo.
  Trang học sinh có `<link rel="manifest">`, `<meta name="theme-color">`, `apple-touch-icon` (plugin `jennyPwa` chèn sau `noi-file`). `vite.config.js` đặt `publicDir: 'public'`.
- **Service worker** `sw.js` + `workbox-*.js` do `vite-plugin-pwa` 2.0.0 (Workbox 7, `generateSW`, `registerType: 'prompt'`) sinh vào `dist/` rồi chép sang `games/lop-hoc-ao/` (`.gitignore`, không vào git).
  Đường dẫn trong `sw.js` tương đối (không gắn `base`) nên cùng bản chạy trên Pages, máy chủ thử ở gốc kho (`npm test`) và `dist/`.
  - **Precache** (vỏ trang học sinh): `index.html`, `assets/lop-hoc-ao-*.css`, `assets/hoc-sinh-*.js`, manifest, icon (7 mục, 1,44 MB thô). `navigateFallback: index.html`;
    **denylist** `/giao-vien/`, `/phu-huynh/`, `/quan-ly/`, `/demo/`, `/giong-mau/` và mọi URL có đuôi file → trang cô/phụ huynh/quản lý/bản thử **luôn lấy mạng**, không bao giờ bị cache.
  - **Runtime cache** (CacheFirst): chunk khối `assets/lop-N-[hash].js` (tối đa 12, 90 ngày) — tải khi em đăng nhập, mất mạng vẫn mở đảo lớp mình; chữ tự host `/assets/fonts/` (60 file, 180 ngày);
    SDK Firebase compat `www.gstatic.com/firebasejs/` (có SRI, 180 ngày) — cần để mở app khi không có mạng.
  - **Không cache Firebase**: `firestore.googleapis.com`, `identitytoolkit`, `securetoken`, `firebaseinstallations`, `*.firebaseio.com`, `*.firebaseapp.com` ghi tường minh `NetworkOnly` (dữ liệu do bộ nhớ đệm bền Firestore của P-21 lo).
  - `cacheId` = `jenny-lha-1` (`CACHE_ID` trong `vite.config.js`): **đổi số khi đổi cấu trúc dữ liệu lưu trên máy hay đổi máy chủ** → cache cũ bỏ hết.
  - `clientsClaim: true` (lần cài đầu SW nhận điều khiển trang ngay, để chunk khối tải sau đăng nhập đi qua SW), `skipWaiting: false` (bản mới chờ em bấm).
- **`core/34`**: đăng ký `sw.js` chỉ ở trang có manifest (bản học sinh; không ở `file://`, bản một file, trang cô). Worker mới đã cài và đang chờ → **thanh pixel "Có bản mới · Tải lại"** (`#swmoi`, navy viền vàng, góc dưới);
  bấm → gửi `SKIP_WAITING` → `controllerchange` → tải lại. `reg.update()` **mỗi 60 giây** và khi quay lại tab → thiết bị đang mở biết bản mới trong 1 phút. `swNong()`: khối đã tải lúc SW chưa điều khiển (lần mở đầu / vừa đổi SW) được nạp lại qua SW để vào cache (gọi khi SW sẵn sàng, khi nhận điều khiển, sau `khoi:sau`).
- **`core/79`** (P-16 sở hữu): sự kiện `offline` → toast "Mất mạng. Em cứ học tiếp, bài sẽ gửi khi có mạng."; `online` → toast "Có mạng rồi, đang gửi bài em làm." và `fbDay()` ngay (không chờ 20 giây). Ghi lúc mất mạng vẫn do Firestore (P-21) tự xếp hàng.
- CSP của P-08 **không phải đổi**: `worker-src` không khai thì theo `script-src 'self'`, `manifest-src` theo `default-src 'self'`; `khong-goi-ngoai.mjs` 0 vi phạm.
- `package.json`: `vite-plugin-pwa@2.0.0` **cài lúc dựng** (`npm i --no-save` trong script `build:lop-hoc-ao`, không vào `devDependencies`/lock — theo /goal chỉ sửa 7 file; khuyến nghị phiên gốc chuyển vào `devDependencies` + `package-lock.json` khi gộp). `games/lop-hoc-ao/.gitignore` **tự sinh khi build** (ignore chính nó, `sw.js`, `workbox-*.js`, `manifest.webmanifest`, `icons/`), `.gitignore` gốc không đổi.
- **Kiểm tra** (máy thầy, Chromium Playwright, `python3 -m http.server`): **Lighthouse 11.7.1 PWA = 1,0, installable** (trước: 0,38, "no manifest"; Lighthouse 12 đã bỏ mục PWA nên dùng bản 11).
  SW cục bộ: precache 7 mục; tắt mạng tải lại trang học sinh → mở được (màn đăng nhập), trang cô ngoại tuyến → lỗi mạng (đúng, không cache); đổi `sw.js` trên đĩa mà không điều hướng → thanh "Có bản mới" hiện **đúng 60 giây** sau khi tải trang, bấm Tải lại → SW mới, precache có revision mới.
  **Trên dự án thử `jenny-lop-hoc-ao-thu`** (bản nháp thay cấu hình, kho không đổi — công tắc `FB_ENV` chưa có): em thử đăng nhập → SW điều khiển ngay, cache có chunk `lop-1`; chơi 1 màn trực tuyến (+35 xu, ví máy chủ 90 → 125);
  **tắt mạng, tải lại trang → vào app** (controller SW, SDK từ cache, Auth/Firestore từ IndexedDB), chơi 1 màn "Bài 1 · Tiết 1" (+35 xu), mở "Bài 1 · Tiết 2"; **bật mạng → ví máy chủ 125 → 160**, sổ `ev` có dòng `man 25`, hàng đợi 0, toast "Có mạng rồi…". `FB.dem` phiên: đọc máy chủ 11, đệm 17, ghi 6.
  `npm test` **14/14 ĐẠT, rc 0** (7 kiểm tra §7 ĐẠT; `rules.test.js` BỎ QUA tại máy, không Java). `tim-import` 0 việc, `npm run lint` 0 lỗi.
- `docs/KIEN-TRUC.md` chưa thêm mục PWA (theo /goal chỉ sửa 7 file); phiên gốc thêm khi gộp, lấy nội dung từ mục này.
- **Chưa làm / lưu ý**: trang chủ `index.html` và game lẻ chưa có manifest (P-19). Lần mở đầu sau khi đẩy bản mới, HTML cũ trong precache trỏ chunk cũ; chunk đã vào cache thì vẫn chạy, chưa có thì màn "Mạng chậm quá" cho tới khi em bấm Tải lại ở thanh "Có bản mới" (≤ 1 phút). iOS: cài từ Safari › Chia sẻ › Thêm vào màn hình chính (không có hộp thoại tự cài).

## 27/10/2026 — Công tắc dự án Firebase `FB_ENV`, sửa Thiết lập lần đầu (P-21 phần còn sót, lane FB7, PR vào `tich-hop/kien-truc-2026-10`)
- **Mới `firebase/cau-hinh.json`**: cấu hình web Firebase nằm **một chỗ duy nhất**, hai khối `that` (dự án thật `jenny-lop-hoc-ao`) và `thu` (dự án thử `jenny-lop-hoc-ao-thu`), mỗi khối có `appCheckKey` (P-05, để trống = không bật). Khoá web là khoá công khai nên ghi vào kho là đúng; an toàn nằm ở rules và Authentication.
- `62-may-chu.js`: `FB_CFG=JSON.parse('__FB_CAU_HINH__')` — không còn khối cấu hình cứng. Chưa thay thì `JSON.parse` ném lỗi ngay khi nạp (cố ý, không âm thầm trỏ sai dự án). `fbEmail` vẫn dùng đuôi `@jenny-lop-hoc-ao.firebaseapp.com` cho cả hai dự án (chỉ là địa chỉ hình thức của Auth, không phụ thuộc dự án).
- **Công tắc lúc dựng** (`tools/vite/vai.js`: `fbMoiTruong`, `fbCauHinh`, `thayCauHinh`): biến môi trường `FB_ENV` = `that` (mặc định) | `thu`, khác thì dừng build. `noi-file.js` gọi `thayCauHinh` ở `banDayDu` (một dòng) nên bản đầy đủ, `npm run dev` và 8 trang vai đều được thay. `tools/build.py` in dòng `FB_ENV=… → dự án …` và chặn giá trị sai; `build_all.py` không đổi (biến môi trường truyền xuyên). Ví dụ: `FB_ENV=thu python3 tools/build.py`.
- **Dải "Bản thử · máy chủ jenny-lop-hoc-ao-thu"** (`FB_ENV=thu`, 4 trang thật): một nhãn nhỏ 16px cố định giữa mép trên (`.fbthu`, z-index trên màn đăng nhập, `pointer-events:none`), **không đẩy bố cục** (không như dải vàng 24px của bản thử P-07); 4 trang `demo/` không chèn thêm. `.github/workflows/ci.yml`: bước dựng đặt `FB_ENV` = `that` khi `main`/PR vào `main`, còn lại (`tich-hop/**` và PR vào đó) = `thu`; `deploy.yml` không đổi (mặc định `that`).
- **Sửa `fbThietLap`** (Thiết lập lần đầu của Quản lý; lỗi có sẵn FB6 ghi 26/10): trước đây đọc `org/main` ngay sau khi tạo tài khoản Auth, mà rules chỉ cho đọc khi đã có `users/{uid}` → dự án trống báo *permission-denied*. Nay: tạo Auth → **ghi thẳng `org/main`** (rules chỉ cho `create` khi chưa có; đã có thì thành `update`, bị từ chối vì chưa `isQL` → báo "Trung tâm đã có quản lý", xoá lại tài khoản Auth vừa tạo) → tạo `users/{uid}` **sau** (rules cần `uid ∈ org().admins`). Bọc v3 (đọc `org/main` sau khi đã có hồ sơ) không đổi. **Rules không đổi, `rules.test.js` không thêm ca** (không chạm rules; thứ tự này đã nằm trong ca 5 và luật `create` của `org/main`).
- Kiểm tra: `npm run lint` 0 lỗi; dựng `that` → 8 trang + bản đầy đủ chứa `projectId jenny-lop-hoc-ao`, không dải; dựng `thu` → `jenny-lop-hoc-ao-thu` ở mọi trang, dải ở 4 trang thật, không ở `demo/`; `FB_ENV=xyz` dừng build. Trình duyệt (bản dựng `thu`, máy chủ tĩnh): dải hiện ở trang học sinh và quản lý, không lỗi console; bấm **Thiết lập lần đầu** với tên mới khi dự án thử đã có `org/main` → "Trung tâm đã có quản lý" (không còn permission-denied), tài khoản Auth tạm tự xoá. **Đường "dự án trống → vào thẳng Quản lý" chưa thử trực tiếp** (thầy chọn không xoá dữ liệu thử cũ 27/10); thứ tự mới bám đúng luật `create` của `org/main` và `users` nên về lý là qua; thầy thử khi làm lại dự án thử từ đầu (FIREBASE-CONSOLE mục 6). `npm test` trên bản dựng `thu`: 14/14 ĐẠT, rc 0 (7 kiểm tra §7 ĐẠT; `rules.test.js` BỎ QUA tại máy vì không Java, CI chạy). Không chạm file của RF5 (vite.config.js, 34, 79, public/, package.json, app.template.html). CSP `frame-src` trong `app.template.html` vẫn ghi cứng `jenny-lop-hoc-ao.firebaseapp.com` (chỉ cần cho đăng nhập popup, app dùng email/mật khẩu nên không ảnh hưởng dự án thử; chỉnh khi RF5 xong nếu cần).

## 26/10/2026 — Nội dung tải theo khối (P-15b, RF4, PR vào `tich-hop/kien-truc-2026-10`)
- **Các trang không còn nối nội dung.** Mỗi khối `content/lop-1` … `lop-5`, `lop-6-9` là một file riêng `assets/lop-N-[hash].js` (chunk ES do Rollup dựng; `tools/vite/noi-file.js` bỏ dòng import từ `js/core` vì tên core là toàn cục của script chung).
  Trang ghi `<script type="application/json" id="khoi-url">` (khối → đường dẫn) ngay trước `<script src>`. Bản học sinh (thật và thử) chỉ có 5 khối tiểu học, **không có lop-6-9**.
  Bản một file `dist/lop-hoc-ao-jenny.html` (Artifact, 6 bộ kiểm tra §7 còn lại) và `npm run dev` vẫn nối nội dung tĩnh như P-15a. `vite.config.js` bỏ `manualChunks` (gom theo thư mục sinh thêm file rỗng).
- **`core/30a`**: `napKhoi(k)` tải khối bằng `import()` (một lần; lỗi mạng thì lần sau thử lại), `khoiCua(lớp)`, `khoiXong`, `khoiCo`, `window.__ready(g)` cho bộ kiểm tra; sau mỗi lần đăng ký chạy `hooks.run('khoi:sau', k)`.
- **`core/34`**: `render()` chờ đủ khối của màn đang vẽ, trong lúc chờ hiện **màn chờ pixel** "Jenny đang chuẩn bị bài…" (5 ô màu logo; mất mạng: "Mạng chậm quá" + nút Thử lại). Khối cần:
  học sinh = lớp của em (biết sau đăng nhập; màn đăng nhập chưa tải gì) · phụ huynh = lớp của con đang xem · cô = lớp đang mở, chưa vào lớp thì các lớp của cô · quản lý = lớp đang xem chi tiết, trang khác thì các khối có học sinh ·
  bản thử mở lần đầu (chưa có dữ liệu mẫu, `core/59` `gvMau`) = mọi khối có học sinh; máy chủ thật luôn có cờ `mauHS7` nên không vào nhánh này.
  **Đổi lớp không tải lại trang**: lên lớp, chọn em khác, cô vào lớp khác hay đổi tài khoản xem → `render()` tải khối mới rồi vẽ lại.
- **Chỗ core xử lý nội dung lúc nạp chạy lại cho khối tải sau** (`hooks.khi('khoi:sau', …)`, có cờ để không làm hai lần): `33d` đổi màu trùm theo vùng biển (`bossHe`), `45` bọc câu hai chiều, `48` bọc tiếng Anh + `enSwapAll`, `72` gắn câu đặt tính lớp 2 (`x.dt`). `21` tính `HINT6` khi dùng lần đầu. `09` `blankP1` chịu được khối chưa tải; `30b` `healAll` điền ô `p1` (lớp 6–9) / `p2` còn thiếu theo đúng mẫu `blankP1`/`blankP2`, không đụng ô đã có (giữ tiến độ). `58` phơi `window.lopCuaToi`.
- **Kiến thức trò chơi** (`core/39e` `ktGrade(G)`) cần kiến thức cuối lớp G−1: mỗi khối lớp 2–5 mang sẵn số này (`content/lop-N/90-kien-thuc-truoc.js`, 17–43 dấu hiệu, sinh bằng `node tools/test/kich-co.mjs --ghi`), nên em lớp 5 không phải tải lớp 1–4.
- **Mới `tools/test/kich-co.mjs`** (vào `npm test`): (1) trang học sinh thật + chunk khối lớn nhất ≤ 700 KB gzip; (2) không có lop-6-9 trong bản học sinh thật và thử; (3) chạy thật trên bản thử: học sinh Jenny03 thấy màn chờ, chỉ tải lop-3, lên lớp 4 tải lop-4 không tải lại trang; cô chỉ tải khối lớp mình, đổi tài khoản xem + vào lớp khác khối tải thêm khối mới; phụ huynh chỉ tải khối của con, xem con khác lớp tải thêm; (4) dữ liệu từng khối (đảo, số hàm sinh câu và lớp bọc, chủ đề, trùm, bài giảng, trò chơi nhỏ, lớp 6–9) và kiến thức trò chơi lớp 1–5 khi tải theo khối **giống hệt bản một file**; `90-kien-thuc-truoc.js` khớp số tính lại.
  `kiem-tra.js` chạy trên `dist/day-du.html` qua máy chủ cục bộ, `await window.__ready(g)` (import() thật).
- **Số đo** (gzip -9, chưa tính chữ woff2 tải theo glyph): trang học sinh **679,8 KB → 491,6 KB (lớp 1) … 516,5 KB (lớp 5)** = HTML 3,8 + CSS 24,9 + JS 440,6 + một khối (lop-1 22,2 · lop-2 39,2 · lop-3 44,1 · lop-4 41,1 · lop-5 46,9; lop-6-9 17,5 chỉ ở trang cô/quản lý/thử).
  **Lighthouse mobile** trang học sinh (Lighthouse 12.8, `--preset=perf --form-factor=mobile`, 4G giả lập, máy thầy, `python3 -m http.server` không nén, 3 lần): **LCP 2,1 s → 1,9 s** (< 2,5 s ĐẠT), TBT 220 → 70–130 ms, điểm 0,93 → 0,97–0,98; JS tải lần đầu 2 139 → 1 318 KB thô. LCP là màn đăng nhập, do CSS chặn vẽ quyết định; phần lợi lớn hơn là sau đăng nhập (chỉ một khối 22–47 KB gzip thay cả 6 khối). Cờ mặc định (không `--preset`): LCP 2,3 s.
- Khoá `localStorage` không đổi; CSP và SRI giữ nguyên (chunk cùng nguồn `'self'`); không chạm `79-dong-bo.js`. `tim-import` 0 lỗi, `npm run lint` 0 lỗi, `npm test` **14/14 ĐẠT, rc 0** (7 kiểm tra §7 ĐẠT; `kiem-tra.js` lớp 1–5 ĐẠT với `import()` thật; `rules.test.js` BỎ QUA tại máy vì không có Java, CI chạy).

## 26/10/2026 — Nội dung theo khối (P-15a, RF3, PR vào `tich-hop/kien-truc-2026-10`)
- **`js/content/**` (26 file) → `content/lop-1` … `lop-5`, `content/lop-6-9`** (32 file). Mỗi thư mục có `index.js` `export function dangKy(reg)`;
  lớp 1–5: `10-hk1.js` (đảo chủ đề 1–5, bộ câu chỉ lớp đó dùng, luật `MG`/`MGT`), `20-bai-giang.js` (slide), `30/31-hk2-phan-a/b.js`.
  `reg` = `{PRIM, P1BY, ALLP1, P2, LES, MG, MGT, addTopic}` do `js/core/30a-dang-ky-khoi.js` đưa vào (`dangKyKhoi`).
- **Helper dùng chung lên core**: `js/core/30b` bộ máy tiểu học (phần chung của hk1/24), `30c` câu hỏi chung (`NQ`, `CQ`, `SG`, `ORD`, `F`, `buildIsl`…), `30d` hình phẳng/góc/đồng hồ,
  `30e` hình học/số lớn, `30f` hình vẽ/lời văn, `30-bai-giang-jenny.js` khung Bài giảng. Helper lớp sau dùng của lớp trước nằm ở core, không ở content.
  Bảng `MG` (chủ đề 1) rời `core/31`; `PRIM={}` ở `core/25`; `core/12`, `21` đọc `P1BY[6]` thay `P1_6`. 35 file core khác chỉ đổi dòng import (sinh lại).
- **Dựng**: `tools/vite/noi-file.js` gói mỗi thư mục khối thành một phạm vi hàm và gọi `dangKyKhoi` **tại chỗ cũ** (vẫn tĩnh, một script, thứ tự chạy như trước).
  `tim-import.mjs` hiểu khối (tên trong khối chỉ thấy trong khối; core không import content); `chuyen-hooks.mjs` bỏ qua `content/`; ESLint thêm `content/**`;
  `vite.config.js` `manualChunks: chunkKhoi` (mỗi `content/lop-*` một chunk, dùng từ P-15b).
- Không đổi hành vi: `PRIM` (804 đảo), `P1BY`, `ALLP1`, `P2`, `MG`, `MGT` giống hệt bản trước; `LES` 345 bài cùng khoá (6 slide khác toạ độ hình vẽ ngẫu nhiên);
  44 ảnh ≤ 0,1 %; khoá `localStorage` không đổi; `npm test` 13/13 ĐẠT (kiem-tra lớp 1–5 ĐẠT); `npm run lint` 0 lỗi; `tim-import` 0 lỗi.
- Gzip trang học sinh 670 → 685 KB (đủ 6 khối, tĩnh). Core 437 KB, mỗi khối 18–50 KB → P-15b (chỉ tải khối của em) ước 489–515 KB.

## 26/10/2026 — Hàm đè viết bằng `hooks.on` (P-14b, RF2 — tiếp)
- `js/core/00-hooks.js`: `hooks.on('render', cu => function(){ … cu.apply(this,arguments) … })` là cách đè chính (bọc bản ngay trước); `hooks.de` chỉ còn cho chỗ thay hẳn hoặc đè tạm, `hooks.cu` cho chỗ giữ bản cũ dùng ở nhiều nơi; hook sự kiện đổi tên `hooks.on` → `hooks.khi` (`run` giữ). `tools/vite/chuyen-hooks.mjs` bước 4 gộp cặp `cu`+`de` liền nhau thành `on` (218 chỗ; còn 27 `de`, 12 `cu`).
- Không đổi hành vi: ESLint 0 lỗi, 44 ảnh giống (cùng số bản), `npm test` 13/13.

## 26/10/2026 — Firestore ngoại tuyến, tiết kiệm đọc (P-21, lane FB6, PR vào `tich-hop/kien-truc-2026-10`)
- **Mới `js/core/63-firestore-tiet-kiem.js`** (include ngay sau `62`): `fbTietKiem()` bật bộ nhớ đệm bền `enablePersistence({synchronizeTabs:true})` ngay khi tạo `FB` (lỗi `failed-precondition`/`unimplemented` chỉ `console.info`); `fbNghe(ref, cb, err)` — **một listener thật cho mỗi document/truy vấn**, chỗ gọi thứ hai cùng ref chỉ nhận thêm bản chụp; lần đầu trên máy (`localStorage.jennyV3 !== '1'`) bỏ qua bản từ đệm, chờ bản máy chủ rồi đặt cờ; `fbNgheTat()` tắt hết khi bắt đầu `fbHsBoot`/`fbGvBoot` (đổi vai, đăng nhập lại) và khi đăng xuất; `FB.dem` đếm `doc` (đọc máy chủ), `cache`, `ghi`, `nghe` (listener đang mở) qua nguyên mẫu SDK + trong `fbNghe`, lưu `localStorage.jennyDem`, in Console khi đăng xuất; đăng xuất → `terminate()` + `clearPersistence()` (máy dùng chung không giữ dữ liệu em), xoá cờ `jennyV3`; `fbNangCapV3` xoá cờ để máy QL lấy máy chủ trước.
- `62-may-chu.js`: **chỉ** thêm một dòng gọi `fbTietKiem()` trong `fbInit` và đổi 17 chỗ `X.onSnapshot(cb, err)` → `fbNghe(X, cb, err)` (đổi tên hàm, không đổi logic; `grep -c onSnapshot` = 0). **Không chạm `79-dong-bo.js`** (P-16); listener `hs/{tk}` của 79 và `vi/{tk}` của 64 vẫn gọi `onSnapshot` thẳng (2 chỗ ngoài 63).
- `firebase/firestore.indexes.json`: thêm chỉ mục ghép `asg (lop ↑, t ↓)`; chỉ mục `t` của sổ xu `ev/{tk}/d` (cả Collection group) đã có từ P-20 — đường dẫn `ev/{tk}/{id}` không hợp lệ nên "ev(t)" chính là `d.t`. `firebase.json` đã trỏ tới file này (không đổi). Thầy dán vào dự án thử (và dự án thật khi gộp `main`).
- `docs/FIREBASE-CONSOLE.md`: mục 5 **cảnh báo 80% hạn đọc** (Cloud Monitoring, `document/read_count` > 40 000/ngày, ghi > 16 000) + bảng ước lượng đọc/ngày; mục 6 **dự án thử** `jenny-lop-hoc-ao-thu`.
- **Listener theo vai ≤ 4 document** (63, `fbNgheSong`): sống lâu chỉ còn — HS `hs/{tk}` (79) + `vi/{tk}` (64) + `hsgv/{tk}` + `asg` lớp = 4; GV `lop/{id}` lớp mình + `asg`; PH `hs/{con}`, `hsgv/{con}` + `asg` lớp con; QL `org/main`, `lop`, `hsdm`. Mọi tài liệu khác (HS `org/main`, `lop`; cô `hs`, `vi`, `hsgv` từng em, `gv`, `hsdm`; QL `asg`, `nk`, `hoso`, `gv`, `ph`, từng em…) **nghe một lần**: mở listener, nhận bản đệm rồi bản máy chủ là tắt (mất mạng: bản đệm rồi tắt; quá 8 giây chưa có bản máy chủ cũng tắt). Chỗ gọi trong 62 không đổi, vẫn nhận bản chụp; cái mất là **cập nhật trực tiếp** của các tài liệu đó: cô không thấy em vừa làm bài cho tới khi tải lại trang, em không thấy cô vừa mở đảo cho tới khi tải lại, QL đổi lớp của em thì em thấy ở lần mở sau. Đường dẫn truy vấn đọc từ nội bộ SDK compat (`_delegate._query.path`), đã thử với `firebase` 11.10 (app dùng 10.12.2 cùng cấu trúc); đọc không ra thì listener sống như cũ.
- Công tắc `FB_ENV`/`firebase/cau-hinh.json` (dòng ⟳ 25/10) **chưa làm** trong goal này; bản dựng vẫn trỏ dự án thật.
- Kiểm tra: `npm test` trước và sau khi sửa đều **13/13 ĐẠT, rc 0** (7 kiểm tra §7 ĐẠT; `rules.test.js` BỎ QUA tại máy vì không có Java, CI chạy). Kiểm tra giả lập riêng cho `fbNghe` (Node, Firestore giả): 2 chỗ gọi cùng doc → 1 listener thật, cả hai nhận bản đầu và bản đổi; đếm `doc` chỉ tăng khi nội dung đổi; tắt lần hai không âm; `fbHsBoot` tắt listener cũ; nghe một lần nhận 1 bản rồi tắt; 21 ca danh sách sống theo 4 vai — ĐẠT. `grep -c onSnapshot js/core/62-may-chu.js` = 0 (trước 17). **Đã thử trên dự án thử `jenny-lop-hoc-ao-thu`** (26/10, Playwright, bản dựng ở thư mục nháp thay cấu hình, kho không đổi): (1) DevTools Offline không tải lại, làm 1 bài (+10 xu) → bật mạng: `vi` 0 → 10, sổ `ev` có dòng `tl 10`, hàng đợi 0 — ĐẠT; (2) mở lại trang khi không tới được Firebase (chặn `*.googleapis.com`, trang tĩnh vẫn tải, giống khi P-16 cache phần tĩnh; chưa có Service Worker nên Offline thật thì trang không mở được): app vào từ đệm, làm 1 bài → nối lại: `vi` 10 → 20, `ev` có dòng — ĐẠT. **Số đọc phiên học sinh 20 phút** (mở trang 1 lần, 10 bài cách 2 phút, đếm bằng `FB.dem`, gồm cả listener 79 và 64): **trước P-21 35 đọc** (mở trang 15, 6 listener) · **sau P-21 31 đọc** (mở trang 11, 4 listener: `hsgv`, `asg`, `hs`, `vi`); đích ≤ 60 ĐẠT. Mỗi bài tốn ~2 đọc ở cả hai bản (ví và `hs` của chính em đổi). Quản lý mở trang: 14 đọc, 3 listener. Trang cô lớp 12 em chưa đo (dự án thử mới có 2 em). `FB.dem.ngoai` (mới) đếm listener mở thẳng `onSnapshot` ngoài `fbNghe` (79, 64) bằng cách bọc nguyên mẫu SDK trong 63, không sửa 79/64. Rules và chỉ mục không đổi so với tip tích hợp `d0d7ad7` (đã dán vào dự án thử). **Lỗi có sẵn, chưa sửa (không thuộc P-21, 62 bị khoá):** `fbThietLap` đọc `org/main` trước khi tạo hồ sơ `users`, rules chỉ cho đọc khi có hồ sơ → trên dự án trống bấm "Thiết lập lần đầu" báo *permission-denied* (tài khoản Auth vẫn được tạo). Lúc thử đã làm tay các bước thiết lập. Walk của thầy: dán rules + indexes vào dự án thử; tắt mạng, học 1 bài, bật mạng → xem `vi/{tk}` và `ev/{tk}/d` trên console Firestore; `localStorage.jennyDem` ở DevTools › Application.

## 26/10/2026 — Mã nguồn thành ES module, hàm đè qua hooks (P-14b, RF2)
- **Mỗi file JS là một ES module**: đầu file có `import { … } from '…'` đúng những tên nó dùng; khai báo được file khác dùng có `export`. Dòng import do `tools/vite/tim-import.mjs` sinh (acorn + eslint-scope), chạy lại được sau mỗi lần rebase (bỏ import/export cũ, sinh mới; phần mã còn lại giữ nguyên). 118 file (kể cả `content/lessons/*`, `content/hk2/*` include lồng trong file 30), 832 dòng import, 437 khai báo export; `01-tien-ich.js` export 8 tiện ích.
- **Khi chạy vẫn là một `<script>` thường**: plugin `tools/vite/noi-file.js` bỏ dòng import và chữ `export ` rồi nối theo `app.template.html` như cũ (`tools/vite/module.js`), nên hoisting, `onclick="…"`, mã `vai.js` chèn, bộ kiểm tra `page.evaluate` không đổi; build dừng nếu import không khớp export. Bước sau (14c) mới cho Rollup gộp thật.
- **Hàm đè → hooks** (`js/core/00-hooks.js`, nạp đầu tiên): hết kiểu `render=function…`/`function` trùng tên. File định nghĩa: `function render(...a){return hooks.goi('render',this,a)}` + `hooks.ham('render',function(){…})` (giữ khai báo `function` để hoisting); file sau: `hooks.de('render',…)`, bản trước lấy bằng `hooks.cu('render')`; mã `vai.js` chèn thay bản gốc bằng `hooks.goc` (như function trùng tên thắng từ đầu); `hooks.on/run` cho mã mới. 110 hàm có bản gốc, 243 chỗ đè (render 24, save 3, header 3, viewPH 10, fbHsBoot 2…), `tools/vite/chuyen-hooks.mjs` làm tự động và chạy lại được. Xoá 22 bản `function` trùng tên (mã chết ở file trước). `ktAuditBefore` (39e) đè tạm bằng `hooks.de`/`hooks.bo`.
- **Trạng thái dùng chung** (gán ở ≥ 2 file: `S`, `role`, `sid`, `scr`, `KEY`, `STUDENTS`, `CLOUD`, `LANG`, `UNL`… 23 tên) khai báo tường minh `globalThis.X=…` tại chỗ cũ; danh sách sinh ra ở `tools/vite/toan-cuc-sinh.json`, tên do mã chèn/SDK đặt ở `tools/vite/toan-cuc.json` (có lý do).
- **ESLint** (`eslint.config.mjs` gốc kho, `npm run lint`): `no-undef` + `no-import-assign` trên 178 file → 0 lỗi.
- `vai.js` thêm bản thử (`--demo` của P-07): 4 trang thật + 4 trang thử (`demo/`), 9 entry Vite (`day-du.html` = bản đầy đủ). Xoá `tools/_student.py`, `tools/_teacher.py`, `so-voi-python.mjs` (vai.js đã giống Python 8/8 trang từng byte trước khi đổi mã). `tools/build.py` = `npm run build:lop-hoc-ao` (`npm run build` vẫn là `tools/build_all.py`).
- Kiểm tra: ảnh 7 trang (+4 màn bản đầy đủ) × 4 khổ = 44 ảnh giống bản trước **0,000 %** (`tools/vite/so-anh.mjs`); `npm test` 13/13 ĐẠT; khoá `localStorage`, CSP, SRI không đổi. **Chưa làm:** bỏ `'unsafe-inline'` khỏi `script-src` — còn 520 thuộc tính `onclick="…"` trong chuỗi HTML (244 có `${…}`), cần viết lại thành `data-*` + uỷ quyền sự kiện (việc riêng, 14c); `document.write` vốn không có.

## 25/10/2026 — Dựng bản bằng Vite, bọc mã cũ (P-14a, RF1)
- `npm run build:lop-hoc-ao` = `vite build src/lop-hoc-ao` (`src/lop-hoc-ao/vite.config.js`; 26/10: 9 entry — 4 trang thật, 4 trang thử, `day-du.html`; `base` `/JennyMathClubGame/games/lop-hoc-ao/`). `npm run dev` = `vite src/lop-hoc-ao`. `python3 tools/build.py` vẫn dùng được: gọi `npm run build` (tự `npm ci` nếu thiếu). Vite 8.3.4 ghim bản.
- Plugin `tools/vite/noi-file.js` nối file theo đúng thứ tự `app.template.html`, giữ phạm vi toàn cục (một `<script>` thường mỗi trang); CSS/JS ra `dist/assets/*-[hash].css|js`, chép sang `games/lop-hoc-ao/assets/` (tự có `.gitignore`). `dist/lop-hoc-ao-jenny.html` vẫn là bản một file như cũ.
- `tools/vite/vai.js` thay `_student.py` và `_teacher.py` (cùng các phép thay, có kiểm tra chuỗi phải có); đoạn mã chèn lấy nguyên văn vào `tools/vite/vai/`. `node tools/vite/so-voi-python.mjs`: 4 trang giống bản Python từng byte. Hai file Python còn giữ (để so khi rebase), build không gọi nữa.
- Giao diện, khoá lưu, CSP, chữ tự host không đổi: ảnh 4 trang × 4 khổ giống từng byte với bản trước; `npm test` ĐẠT.

## 25/10/2026 — P-10 sao lưu tuần Firestore (lane chore/bo-demo-rieng-tu)
- `.github/workflows/sao-luu.yml`: Chủ nhật 20:00 UTC + chạy tay; `permissions: contents: read`; đọc Firestore bằng Admin SDK (`tools/sao-luu/firestore-dump.mjs`, Spark không có gcloud export), mã hoá `age` bằng `BACKUP_PUBKEY`, đưa lên release kho riêng tư `Vuvanluan1993/jenny-backup` (`BACKUP_REPO_TOKEN`), giữ 12 bản.
- `tools/sao-luu/firestore-restore.mjs` (emulator mặc định, dự án thật cần `--that`), `_chung.mjs`, `thu-gia-lap.mjs` (thử vòng xuất → nạp bằng Firestore giả lập, ĐẠT), `README.md` 5 bước khôi phục. `CLAUDE.md` gốc ghi nơi sao lưu.
- Chưa chạy thật: thầy tạo kho `jenny-backup`, service account chỉ đọc, khoá age, 3 secret; emulator cần Java.

## 25/10/2026 — P-07 bỏ tài khoản thử khỏi bản thật · P-09a văn bản riêng tư (lane chore/bo-demo-rieng-tu)
- **Bản học sinh thật** (`games/lop-hoc-ao/`): chỉ đăng nhập máy chủ; không còn tài khoản Jenny01…/lebaona, không còn băm mật khẩu trong trang. `tools/_student.py` thêm `--demo`.
- **Bản thử** (`games/lop-hoc-ao/demo/` + `demo/giao-vien|phu-huynh|quan-ly/`): tài khoản mẫu, dữ liệu chỉ trên máy, dải "Bản thử — dữ liệu chỉ trên máy này", `noindex`; **không commit** (`.gitignore`), chỉ có trên Pages sau khi build trên `main`. Trang GV/PH/QL bản thử mở thẳng vai, bỏ mật khẩu `giaovien…` (`tools/_teacher.py`).
- `tools/build.py` gọi mỗi script 2 lần (thật, `--demo`). Mã CLB của `tools/check_fit.py` đọc từ biến môi trường `JENNY_CLB_CODE`; Hành Trình lop-6/tieu-hoc giữ mã trong `sessionStorage`.
- **Riêng tư (bản nháp, chờ thầy duyệt)**: `rieng-tu/index.html` (chính sách ngắn cho phụ huynh), `docs/rieng-tu/PHIEU-DONG-Y.md`, `HO-SO-CHUYEN-DU-LIEU.md`, `DANH-MUC-DU-LIEU.md`; liên kết Riêng tư ở chân trang chủ và màn đăng nhập học sinh.
- Chưa làm (P-05, lane Firebase): mật khẩu mặc định `MK0` ở `js/core` 58, 71, 75, 77. Thầy: đổi mã CLB, chạy `build_bank.py` và `build_bank_th.py`, commit `bank.enc` mới.
## 25/10/2026 — Xuất dữ liệu một học sinh, nhắc thời hạn lưu 24 tháng (P-09b, kế hoạch kiến trúc)
- **Thầy đã chốt Q2 = B:** giữ ngày sinh đầy đủ và Gmail phụ huynh trong `hoso/{tk}` (chỉ quản lý đọc ghi). Vì vậy **không đổi trường hồ sơ**, không đổi cột Ngày sinh ở Excel. P-09b chỉ còn 2 việc dưới đây.
- **⬇ Xuất dữ liệu** (`78-xoa-hoc-sinh.js`, hàm `qlXuatHS(tk)`): nút ở bảng ✎ Sửa học sinh, cạnh 🗑 Xoá. Tải file `jenny-<tk>-<yyyy-mm-dd>.json` gồm: `hoso` (giới tính, ngày sinh, SĐT, Gmail phụ huynh, kèm `hosoNam` các năm học cũ và `nghi`), `hsdm` (tên, khối, lớp, tk phụ huynh), `hs` (`j` = dữ liệu học của em, `ev` = sự kiện xAPI của em), `vi` (ví xu `vi/{tk}`; bản không máy chủ lấy từ `st.coins`, `st.items`), `evXu` (sổ xu `ev/{tk}/d` 90 ngày gần nhất, chỉ khi dùng máy chủ; bản demo để `null`), `hsgv` (nhận xét, huy hiệu, ghi chú của cô). Mỗi lần xuất ghi một dòng Nhật ký "Xuất dữ liệu của <tên> (<tk>) — file …".
- Hộp xác nhận Xoá (gõ XOA) thêm lời nhắc "Nên bấm ⬇ Xuất dữ liệu trước khi xoá" (LUAT §6h: xuất rồi mới xoá). Xoá trên máy chủ nay xoá thêm `vi/{tk}`, `hsdm/{tk}`, `hoso/{tk}` (trước chỉ `users`, `hs`, `hsgv`, `login`). **Sổ xu `ev/{tk}/d` không xoá được** (rules chỉ-thêm, cấm cả quản lý); sổ chỉ có `k, d, ref, t`, không có tên hay thông tin cá nhân.
- **Nhắc thời hạn lưu** (`76-len-lop.js`): khi Kết thúc năm học đánh dấu Nghỉ học / Học xong, app ghi thêm `luc` (thời điểm). Thẻ "Nghỉ học · Đã học xong" hiện "từ dd/mm/yyyy"; bản ghi cũ chưa có `luc` thì suy từ cuối năm học (31/5 của năm sau trong `nam`, ghi "(ước)"). Em nghỉ **quá 24 tháng** có nhãn đỏ "Quá 24 tháng · xoá theo thời hạn" và 2 nút ⬇ Xuất, 🗑 Xoá (vẫn gõ XOA); đầu thẻ có một dòng tóm tắt số em quá hạn. **App không xoá tự động.**
- Kiểm tra: bản demo Quản lý, Lê Bảo Na: bấm Xuất → tải file JSON đủ 6 khoá, mở được; dựng một em nghỉ cách đây 25 tháng và một em bản cũ năm 2023–2024 → thấy nhãn quá hạn và 2 nút; em vừa nghỉ thì không. Khổ 320/414/1200 ổn. `npm test` rc 0 (`rules.test.js` BỎ QUA tại máy vì không có Java, CI chạy). Nhánh máy chủ của Xuất (đọc `vi/{tk}`, sổ `ev/{tk}/d` 90 ngày) chưa thử trên Firebase thật: thầy thử một em sau khi gộp.

## 25/10/2026 — Ví xu và đồ mua kiểm soát bằng Firestore rules (P-20, thay P-06b; đóng phần "em tự ghi xu" của LH-C2)
- **Thầy cần làm (sau khi gộp lên `main`):** dán `firebase/firestore.rules` mới; dán chỉ mục `firebase/firestore.indexes.json` (hoặc `firebase deploy --only firestore:indexes`); trang Quản lý › Tài khoản › bấm **⬆ Nâng cấp dữ liệu v3** (nếu chưa) — nút này nay tạo luôn ví `vi/{tk}` cho từng em từ xu/đồ đang có và ghi bảng giá `cfg/shop`; đã nâng cấp rồi thì bấm **Tạo ví + bảng giá** (chạy lại không trùng: chỉ tạo em chưa có ví, ghi lại bảng giá). Thử: đăng nhập học sinh, gõ trên console `S.st[sid].coins=1e6;save()` → xu trở về số cũ ngay và sau khi tải lại.
- **Sự thật: đây là giảm mạnh gian lận, chưa chặn hẳn.** Em vẫn có thể gọi `xuCong(40)` mỗi 3 giây bằng console (tối đa ~48 000 xu/giờ nếu kiên trì, và mỗi lần đều để lại một dòng sổ cô nhìn thấy). Chặn hẳn cần hàm chạy ở máy chủ (P-22, chờ thầy chốt Q5 Blaze).
- Cấu trúc mới (`firebase/firestore.rules`): `vi/{tk}` `{coins, items:{mã:số}, pets:{loài:số}, tudo:{mã:số}, m:{loai,id}, t}` — em chỉ **cộng** 0 < Δ ≤ `cfg/shop.tranMan` (40), cách lần ghi trước ≥ 3 giây, `t` phải là giờ máy chủ (`serverTimestamp()`), không đụng đồ; hoặc **mua** đúng một mã `m.id` ở nhóm `m.loai` có trong `cfg/shop`, số lượng +1, Δ = −giá, không âm xu. `ev/{tk}/d/{id}` `{k, d, ref, t}` sổ sự kiện **chỉ-thêm** (`k` ∈ man, tl, bvn, game, mua, ban, ql, khac; |d| ≤ 400; không ai sửa, xoá — kể cả quản lý). `cfg/shop` bảng giá: quản lý ghi, ai có hồ sơ đọc. Cô lớp, phụ huynh, quản lý đọc ví và sổ của em. Mỗi lần ghi ví tốn 3 `get()` (users, org, cfg), dưới trần 10.
- `js/core/64-xu.js`: hai hàm duy nhất đổi xu — `xuCong(delta, k, ref)` và `xuMua(loai, id)`; đổi `st.coins` ngay, xếp hàng đợi ghi `vi` + `ev` trong **một batch**, cộng lớn chia nhiều lần ≤ 40 cách 3,2 giây; hàng đợi lưu `localStorage` (`jennyXu_<tk>`) nên mất mạng/tải lại không mất xu; máy chủ từ chối → thử lại 2 lần rồi bỏ dòng, đọc lại ví, `console.warn`. `st.coins` trên máy luôn = xu máy chủ + hàng đợi; `save()` thấy lệch: lệch dương ≤ 50 xu coi là thưởng của mã cũ chưa đổi (k = `khac`, các file 25, 31-5, 32, 35, 50, 53, 60 cộng thẳng +5…+30), còn lại trả về số đúng. `xuBangGia()` dựng `cfg/shop` từ chính danh mục trong app (Cửa hàng `GH`, Đồ nuôi `CARE`, loài `PET_SP`, trò chơi `ARC` 150 + vé `ve` 60, quà trùm đảo 0 xu): tudo = áo váy, mũ kính, khung · items = đảo nhà, đồ nuôi, trò chơi, vé, quà · pets = loài. Khi em chưa có ví (chưa nâng cấp, bản demo, học không máy chủ) hai hàm chỉ đổi `st.coins` như cũ.
- Gọi hai hàm thay sửa `st.coins`: `11` (`addCoins` → `xuCong`, thêm tham số `k`), `18` (quà trùm đảo → `xuMua('items', …)` giá 0; câu đúng vẫn qua `addCoins`), `49` (Cửa hàng → `xuMua`), `51` (mua trò `game:<mã>`, vé `ve` → `xuMua`), `72` (`addCoins(…,'self','tl')`). `49b` (thú cưng, đồ nuôi, bán thanh lý) ngoài danh sách file nên **bọc hàm** trong `64` (`petBuy`, `careBuy` → ghi mua; `bagSell`, `gearSell`, `eggSell` → `xuCong(…,'ban')`), không sửa file.
- `62-may-chu.js`: `fbTach` bỏ `coins`, `items` khỏi `hs.j` khi ví đang bật; `fbHsBoot` (v3) đọc `vi/{tk}` + `cfg/shop`, nối hàng đợi còn dở, **gỡ đồ** trong `hs.j` (Cửa hàng `shop.own`, trò chơi `arc.own`, quà `items`) mà ví không có; cô/quản lý/phụ huynh nghe `vi/{tk}` để hiện xu (`fbVi`); quản lý tạo học sinh → tạo ví 0 xu; `fbNangCapV3` gọi `fbTaoVi(true)`; nút **Tạo ví + bảng giá** ở Tài khoản (hiện số em chưa có ví). Trang cô (`58`): thẻ **Xu hôm nay** (truy vấn `ev/{tk}/d` `where t >= đầu ngày`, mỗi em một truy vấn, cache 60 giây, nút Làm mới), nhãn **Xu tăng lạ** (> 300 xu/ngày hoặc > 15 dòng `man`/giờ), nút **Xem sổ** (30 dòng gần nhất). `firebase/firestore.indexes.json`: chỉ mục `d` theo `t` (cả nhóm collection) và `(k, t)`; `firebase.json` trỏ tới file này.
- Khác với kế hoạch P-20 một chút, có lý do: (1) đường dẫn `ev/{tk}/{id}` không hợp lệ ở Firestore (lẻ đoạn) → dùng `ev/{tk}/d/{id}`; (2) ví có thêm khoá `m` (món vừa mua) vì rules không lấy được tên khoá từ `diff().affectedKeys()` để tra giá; (3) `st.pets` (trạng thái nuôi: no, vui, tuổi…) và `st.shop` (đồ đang dùng, túi đồ) vẫn ở `hs.j` vì đổi liên tục không gắn xu — ví chỉ giữ **sở hữu** (`pets` = số con mỗi loài đã mua, `items`/`tudo` = mã đã mua) và app gỡ đồ không có trong ví khi vào; (4) `k` thêm `ban` (bán thanh lý) và `khac`.
- Lưu ý: tài khoản thử (Lê Bảo Na, 10 000 xu đặt thẳng ở `55`/`51`) khi dùng máy chủ sẽ bị trả về số trong ví — quản lý đặt xu cho em thử bằng cách sửa `vi/{tk}` (quản lý ghi tự do). Giá hiện trên nút Mua lấy từ danh mục trong app; nếu quản lý sửa `cfg/shop` khác danh mục, xu bị trừ theo `cfg/shop`.
- Kiểm tra: `tools/test/rules.test.js` thêm 14 ca (35–48, tổng 48; chạy thêm ~20 giây vì luật 3 giây): cộng 40 ĐƯỢC, cộng lại ngay / 41 / 1 000 000 / bớt xu không mua BỊ CHẶN; `t` giờ máy, thiếu/thừa khoá, vừa cộng vừa thêm đồ BỊ CHẶN; mua đúng giá ĐƯỢC, món lạ / sai giá / hai món / +2 / âm xu BỊ CHẶN; tạo ví 0 xu ĐƯỢC, có sẵn xu BỊ CHẶN; `ev` thêm ĐƯỢC (cả trong batch với `vi`), sửa/xoá/k lạ/d > 400/t giờ máy/sổ em khác BỊ CHẶN. Máy thầy không có Java → ca này BỎ QUA tại máy, CI chạy. `tools/chuyen-org-v3.mjs` in thêm số ví và bảng giá, kiểm mọi mã trong ví có trong `cfg/shop` (53 ví, 31+5+39 mã). Thử thêm trong trình duyệt với Firestore giả (có batch, luật Δ ≤ 40 / 3 giây / đúng giá): vào app lấy xu từ ví; `xuCong(100)` → 3 lần ghi 40+40+20 cách 3,2 giây, 3 dòng `ev`; `coins=1e6;save()` trả về ngay; +5 ngoài luồng được giữ và lên máy chủ; mua Cây dừa đúng giá lên ví; mua bị từ chối → bỏ dòng, xu và đồ về theo máy chủ; tải lại lấy xu từ ví — ĐẠT. `npm test` rc 0.

## 25/10/2026 — Tách dữ liệu trung tâm `org/main.j` thành nhiều document (P-06a, dữ liệu v3)
- **Thầy cần làm (sau khi gộp và đưa lên `main`):** dán `firebase/firestore.rules` mới; đăng nhập trang Quản lý › mục Tài khoản › bấm **⬆ Nâng cấp dữ liệu v3** (một lần, chạy lại không trùng); mọi người tải lại trang (app tự tải lại khi thấy `org/main.v = 3`). Bản cũ `org/main.j` vẫn giữ 30 ngày (`jCu` là lúc nâng cấp) rồi xoá tay.
- Cấu trúc mới (`62-may-chu.js`, phần P-06a): `org/main` chỉ còn phần chung (`ten, nam, admins, gd, pc, nl, nghi, xoa, namCu`); `lop/{id}` (tên, khối, cô dạy, gói Toán Jenny, đảo mở `mo`); `hsdm/{tk}` danh mục em (tên, khối, lớp, tk phụ huynh — không PII); `hoso/{tk}` hồ sơ cá nhân (ngày sinh, SĐT, Gmail, năm học cũ) **chỉ quản lý đọc ghi**; `ph/{tk}` thông tin phụ huynh (quản lý; chính chủ đọc); `gv/{id}`; `nk/{id}` nhật ký thao tác (thêm, không sửa xoá, quản lý đọc 200 dòng mới nhất).
- **Đóng LH-H1, LH-H4:** cô không còn ghi `org/main`; cô chỉ sửa được `mo` của lớp mình và thêm `nk`. Trung tâm không còn bị trần 1 MiB của một document; hai người sửa hai thứ khác nhau không ghi đè nhau (mỗi doc một lần ghi).
- Lớp tương thích để 90 file khác không đổi cách đọc: `orgV3Gop(V3)` dựng `S.org` đúng hình cũ từ các doc; `orgV3Tach(S.org)` chiếu ngược; `fbDay` so từng doc với bản đã đồng bộ và **chỉ ghi doc đổi** (QL: thêm/sửa/xoá doc; cô: `mo` + `nk`); `orgSet(path, value)` sửa một chỗ rồi đẩy ngay. Quản lý chuyển lớp cho em → `runTransaction` ghi `org/main.gd` và `hsdm/{tk}` cùng lúc.
- Trang cô chỉ nhận `lop` mình dạy (theo `org/main.pc`) và `hsdm` từng lớp (`where lop`); phụ huynh nhận `hsdm`/`lop` của con; học sinh đọc `org/main` + `lop/{lớp}` (`fbOrgHS`), nghe `lop` để nhận đảo mở/gói và `org/main` để nhận ngoại lệ; `76-len-lop.js` kiểm tra nghỉ học qua `fbOrgHS` thay vì đọc `j`. `79-dong-bo.js` thử lại cả doc v3 khi ghi lỗi.
- Thiết lập lần đầu (`fbThietLap`) tạo thẳng v3. Chưa nâng cấp thì app vẫn chạy kiểu cũ (`j`), rules cho cô ghi `j` chỉ khi `org/main.v != 3`.
- Mới `tools/chuyen-org-v3.mjs`: chạy `orgV3Tach`/`orgV3Gop` thật trong bản build với dữ liệu demo (tách → gộp → tách không đổi, đếm doc và cỡ); có file org thì xuất các doc ra JSON. `rules.test.js` thêm 9 ca cho `lop, hsdm, hoso, ph, gv, nk, org/main v3` (34 ca). Đã thử trên trình duyệt với Firestore giả: nâng cấp, vào trang QL/GV/PH/HS ở v3 không ghi thừa, mỗi thay đổi đúng một doc, cô không ghi được `nl`/`hsdm`, xoá em xoá `hsdm`, chuyển lớp đồng bộ hai nơi.
- **Chưa làm (P-06b):** ví xu chỉ quản lý ghi (em vẫn tự ghi `coins` trong `hs/{tk}.j`); 15 ca test ví; cắt `org/main.j` cũ sau 30 ngày. `hs/{tk}` và `hsgv/{tk}` (GV_F) giữ nguyên.

## 25/10/2026 — Mật khẩu ngẫu nhiên, bắt đổi lần đầu, App Check theo dõi (P-05, kế hoạch kiến trúc)
- **Thầy cần làm** (`docs/FIREBASE-CONSOLE.md`): dán `firestore.rules` mới (có thêm luật `mustChange`); Authentication › bật *Email enumeration protection*, Password policy ≥ 8 kí tự có chữ và số, giữ Email/Password, không bật ẩn danh; App Check › đăng ký reCAPTCHA v3, dán site key vào `FB_CFG.appCheckKey` (62), để **Unenforced** theo dõi một tuần. Sau đó mở từng lớp bấm **🔑 Đặt lại mật khẩu cả lớp** cho các em còn mật khẩu cũ.
- Không còn mật khẩu mặc định `jenny123` trong mã app (`grep -rn jenny123 src/lop-hoc-ao/js` = 0). Tạo học sinh (nút Thêm, Excel), giáo viên, phụ huynh (tay và tự động) → mật khẩu tạm **ngẫu nhiên 8 kí tự dễ đọc** (`fbMKGoiY`, dạng `kuta5831`), `users.mustChange:true`; quản lý gõ mật khẩu riêng thì phải ≥ 8 kí tự có chữ và số. Mật khẩu tạm **chỉ hiện trên phiếu in** (học sinh, phụ huynh) và mục Tài khoản của Quản lý trong phiên; đăng xuất là mất.
- **Đăng nhập lần đầu bắt đổi mật khẩu** (học sinh, cô, phụ huynh): hộp thoại pixel không đóng được, nhập 2 lần, ≥ 8 kí tự có chữ và số; xong app ghi `mustChange:false` (rules: chính chủ chỉ sửa được đúng trường này về `false`). Áp cả khi đăng nhập tự động. Phiên quá cũ → báo đăng nhập lại.
- Bỏ hết `prompt()` trong `62-may-chu.js`: Đổi mật khẩu, Đặt lại mật khẩu dùng hộp thoại pixel `fbHoiMK` (ô mật khẩu che, tick "Hiện mật khẩu"); xác nhận dùng `fbXacNhan`.
- Quản lý › trang một lớp: nút **🔑 Đặt lại mật khẩu cả lớp** — mỗi em một mật khẩu tạm mới, `mustChange:true`, xong tự mở phiếu in (`qlInPhieu`). "Đặt lại mật khẩu" từng người cũng đặt `mustChange:true`.
- **App Check** (reCAPTCHA v3): khởi tạo khi `FB_CFG.appCheckKey` khác rỗng (nạp thêm `firebase-app-check-compat.js`); trống thì bỏ qua. Chỉ theo dõi; Enforce sai khoá làm hỏng mọi đọc/ghi nên chỉ bật khi thầy xác nhận.
- Đăng xuất (nhận từ P-07): xoá `jennyVirtualDemo_v10`, bản lưu `jennyHSc_*` (chỉ khi đã đẩy xong lên máy chủ và đang có mạng — làm bài lúc mất mạng rồi đăng xuất vẫn giữ để lần sau đẩy lên), `window.qlMK` và danh sách mật khẩu tạm.
- Kiểm tra: `rules.test.mjs` → đổi thành `rules.test.js` (CommonJS) để `npm test` tự nhặt; thêm 3 ca `mustChange` (25 ca). `package.json` thêm `firebase`, `@firebase/rules-unit-testing`; emulator chạy qua `npx firebase-tools` (CI có Java; máy thầy không có → BỎ QUA, thoát 0).
- Ngoài lane nhưng cần để bỏ `jenny123`: `58-lop-va-quan-ly.js` (bỏ giá trị mặc định 2 ô mật khẩu, sửa chữ), `71-quan-ly-gon.js` (ô mật khẩu học sinh "Bỏ trống = ngẫu nhiên"; phụ huynh tạo tay cũng ngẫu nhiên + `mustChange`).

## 25/10/2026 — Siết quy tắc Firestore (P-04, kế hoạch kiến trúc `docs/kien-truc/`)
- **Thầy cần làm:** dán `firebase/firestore.rules` mới vào Firebase › Firestore › Rules; collection `login` nếu trống thì xoá. Dán rules **trước hoặc cùng lúc** đưa bản này lên `main` (bản cũ vẫn chạy với rules mới, chỉ bài về nhà của cô/phụ huynh cần bản mới để lọc theo lớp).
- `firebase/firestore.rules` đóng các phát hiện của audit 25/10:
  - LH-C1: `org/main` chỉ đọc được khi đã có hồ sơ `users` (người lạ tự đăng ký không đọc được trung tâm nữa).
  - LH-C2 (phần kiểu/cỡ): em chỉ ghi `hs/{tk}` với đúng 4 khoá `j, ev, lop, t`; `j`, `ev` là chuỗi, `j` dưới 900 000 kí tự, `t` là dấu giờ máy chủ; `lop` giữ nguyên hoặc đúng lớp quản lý đã xếp (`org.gd`). Em vẫn tự ghi xu/sao trong `j` — P-06 (ví xu) mới chặn.
  - LH-H2: `users` chỉ chính chủ hoặc quản lý đọc (cô không đọc hồ sơ người khác); `login` không liệt kê được, không còn `uid`.
  - LH-M4: bài về nhà `asg` đọc/ghi theo lớp: cô chỉ ghi/xoá bài lớp mình dạy (`org.pc`), em đọc bài lớp mình, phụ huynh đọc bài lớp của con (tối đa 4 con), quản lý tất cả. Bài phải có khoá `lop`.
  - LH-M1: `org/main` chỉ tạo được đúng hình dạng và người tạo là admin duy nhất; đóng hẳn khi P-05 tắt tự đăng ký.
  - **Còn LH-H1** (cô vẫn ghi đè cả `org/main.j`): để P-06 tách `org/main` thành nhiều document.
- `js/core/62-may-chu.js`: đăng nhập dùng thẳng email ẩn chuẩn `tk@jenny-lop-hoc-ao.firebaseapp.com`, **không** tra `login/{tk}` trước nữa; chỉ khi sai mật khẩu/tài khoản mới `get` đúng một bản ghi `login/{tk}` (có sau khi quản lý "Đặt lại mật khẩu", vì gói Spark không đổi được mật khẩu người khác). Kế hoạch con ghi `login` đọc `false`; giữ `get` để nút Đặt lại mật khẩu (P-05 còn dùng) không làm em bị khoá — thầy muốn bỏ hẳn thì đổi 1 dòng rules và bỏ nhánh `catch` trong `fbDangNhap`.
- `62-may-chu.js`: bài về nhà nghe theo lớp (`where('lop','==',…)`): em lớp mình; cô từng lớp mình dạy; phụ huynh từng lớp của con; quản lý cả kho. Cô giao bài chưa chọn lớp thì không đẩy lên máy chủ (ghi `console.warn`).
- Mới `tools/test/rules.test.mjs` (22 ca, `@firebase/rules-unit-testing`) + `firebase/firebase.json` (emulator cổng 8089). Chạy `node src/lop-hoc-ao/tools/test/rules.test.mjs`: tự bật emulator khi có Java; máy không có Java in "BỎ QUA" và thoát 0 (CI Ubuntu có Java). Cần `package.json` có `firebase`, `@firebase/rules-unit-testing`, `firebase-tools` (nhờ lane CI thêm).
- Máy thầy 25/10 chưa có Node và Java: chưa chạy được `rules.test.mjs` lẫn `tools/test/dong-bo.js`; đã rà tay từng luật theo bảng ca thử và kiểm tra cú pháp `62-may-chu.js`. Khi có Node: `node tools/test/dong-bo.js` phải ĐẠT (bản giả lập không có `where` nên `fbAsgLop` tự lùi về cả collection).

## 25/10/2026 — Design system Jenny trong Claude Design (P-18, DS)
- Mới design system "Jenny" (công cụ Artifact, kiểu Design System; link và quy tắc "màn mới dùng thành phần" ở `design/README.md`): 2 theme Pixel/Classroom cùng bảng màu, khác họ chữ và bo góc; 5 trang token; 12 thành phần có trạng thái và cỡ chạm (Nút, Ô phương án, Khung pixel, Thẻ lớp, Bảng nhập, Toast, Hộp thoại, Thanh điều hướng, Huy hiệu mức, Thẻ chào, Nhãn cảnh báo, Ô Quản lý); 6 mẫu trang ghép từ thành phần, mỗi mẫu ghi khác biệt so với ảnh app 25/10 (ảnh gốc đính kèm trong design system).
- Mới `design/design-system/xuat-token.py`: sinh `design/design-system/project/tokens.json` từ `design/tokens.json`; `--check` so hai chiều → khác 0 giá trị (96 token + 6 họ chữ; thang chữ 29 kiểu chỉ có ở design system). Bản sao file design system ở `design/design-system/project/`.
- Không đổi luật đã chốt; không vẽ nhân vật (sprite PXS chỉ tham chiếu). Đề xuất chờ thầy duyệt ghi ở `design/README.md` (4 cặp tương phản, token mới, cỡ nút Classroom, toast học sinh).
- LUAT §2 thêm một dòng "Màn hình mới vẽ từ design system Jenny".

## 25/10/2026 — Game lẻ dùng kit và token chung (P-19, GL)
- **Ô Số Bí Ẩn** lớp 6, 7: bỏ đoạn `<head>` lạ ở đầu file, có `lang="vi"`, `<title>` về đúng chỗ. Giao diện và cách chơi chung ở `games/o-so-bi-an/_chung.css` + `_chung.js`; mỗi lớp chỉ còn dữ liệu câu đố (20 dòng). Khoá lưu giữ `osba6`, `osba7`.
- **Hành trình của Jenny** lớp 6 + tiểu học: phần chung (hình vẽ, tiến độ, âm thanh, bản đồ, vườn, cửa hàng, sao lưu, mở kho bài) ở `games/hanh-trinh-jenny/_saga/saga.js` + `saga.css`; mỗi bản giữ HTML, cấu hình đảo và Trạm toán riêng. Khoá lưu giữ `jenny-saga-6`, `jenny-saga-th`.
- **Khôi phục mã sao lưu an toàn** ở lớp 6, tiểu học, mầm non, thám tử: `_saga/khoi-phuc.js` hàm `khoiPhucAnToan(o, fresh)` chỉ chép các khoá có trong tiến độ mới, đúng kiểu, bỏ `__proto__`/`constructor`/`prototype` (trước đây mã dán vào chép được mọi khoá và đổi được prototype).
- **Thám tử** (`tham-tu/index.html`) ra khỏi git, sinh bởi `tools/build_tham_tu.py` (do `tools/build_all.py` gọi theo tên, cả trên GitHub Actions khi deploy). Sửa mầm non hoặc `tools/tham_tu_acts.js` rồi dựng lại.
- **Nút ≥ 48px**: `.ib` của khung Bebras và `.chip` trang chủ dùng `--jc-tap` (= `--jc-size-tap` 48px). Màn dọc ≤ 440px bớt logo (đã có nút Về trang chủ), ≤ 360px bớt đồng hồ để thanh trên không tràn. Màn ngang thấp: thanh trên cao thêm 16px, nên `kit.js` thêm bước co cuối `html.tighter` (bớt vài px khoảng cách) chỉ khi đã co chữ hết mà vẫn tràn (Robot · Khó, dãy lệnh dài ở 740×360).
- Sửa 6 ca `check_fit.py` đỏ từ trước: **Thám tử** (mảnh ghép, cái bóng, thư và hộp thư ở 360×640, 390×700) hàng 4 lựa chọn / 4 hộp thư co lại vừa khung (ô còn 77px), trước đây kéo cả trang rộng thêm 14–40px (`tools/build_tham_tu.py`); **Hành trình lớp 6** vườn, cửa hàng ở 1920×950: chữ cỡ 32px cạnh con vật thò khỏi ô 4px, thêm đệm dưới `.pen .side` (`_saga/saga.css`).
- `tools/giong/tao-giong.py`: khoá Gemini và Cloud TTS đi trong header `x-goog-api-key`, không nằm trên URL.
- Mới `manifest.webmanifest` + icon `assets/icons/jenny-192.png`, `jenny-512.png`: cài trang chủ lên màn hình điện thoại (chưa có chạy ngoại tuyến, việc đó ở P-16).
- README: bảng game đủ 16 dòng, có cột Trang chủ (Hiện/Ẩn theo `games.js`) và Khoá lưu; Ô Số lớp 7 hiện đang **hiện** trên trang chủ.
- Kiểm tra: so vị trí + kiểu mọi phần tử bản cũ/bản mới (Ô Số 42 ca, Hành trình 161 ca) giống nhau, trừ 1 thuộc tính `display` của hình Jenny nằm trong hàng đã ẩn ở tiểu học khổ ngang thấp; thanh trên Bebras 108 ca vừa, nút ≥ 48; khôi phục mã thật giữ nguyên tiến độ, mã độc bị chặn ở cả 4 bản.

## 25/10/2026 — CSP, chữ tự host, SRI Firebase, bỏ giọng Google (P-08, FE2)
- Mọi trang (14 game, trang chủ, Lớp học ảo) có `<meta http-equiv="Content-Security-Policy">` và `<meta name="referrer" content="no-referrer">`; trang Lớp học ảo cho phép thêm Firebase (gstatic, *.googleapis.com, *.firebaseio.com, wss, firebaseapp.com).
- Chữ Baloo 2, Nunito, VT323, Be Vietnam Pro, Lexend tự host ở `assets/fonts/` (48 file woff2 ≈ 1 MB, subset vietnamese + latin-ext + latin đúng như Google đưa, `font-display: swap`; tải lại bằng `assets/fonts/tai-font.py`); không trang nào gọi Google Fonts nữa. So ảnh và kiểu hiển thị 4 trang × 4 khổ với bản trước P-08: giống hệt (chỉ khác ô giờ build). `80-phong-cach-lms.js` không chèn Lexend từ Google.
- `62-may-chu.js`: 3 file Firebase compat 10.12.2 tải kèm `integrity` + `crossorigin` (hash ở `docs/SRI.md`).
- Mầm non, Thám tử, Tiểu học: bỏ `translate_tts` (nội dung câu không gửi ra Google); chỉ `speechSynthesis`; máy không có giọng tiếng Việt thì báo.
- Bebras kit: tham số `?n=` ép thành số. Trang chủ bỏ `document.write`, dùng `games.js?v=__SHA__` (CI điền ở P-02).
- Mới `tools/test/khong-goi-ngoai.mjs` (trong `npm test`): mở 20 trang, kiểm không yêu cầu ra ngoài danh sách cho phép, không lỗi CSP/JS, không 404.

## 25/10/2026 — Token thiết kế chung (P-03, FE1)
- Mới `design/tokens.json` (nguồn) → `design/tokens.css` sinh bằng `tools/tokens.py` (`--check` để so). 102 token `--jc-*`: 25 màu logo (= PXC), bộ app/pixel/trang chủ/LMS, họ chữ, khoảng cách, cỡ chạm, bo góc, khung pixel.
- `app.css` (`:root` + `body.px`), `games/tu-duy-bebras/_kit/kit.css`, `index.html` giữ tên biến cũ (`--ink`, `--sea`, `--paper`…) nhưng trỏ sang `--jc-*`; `app.template.html` include `tokens.css` trước `app.css`. Giao diện không đổi (so kiểu hiển thị 4 trang × 4 khổ: 0 khác).
- Mới `tools/check_contrast.py`: đo 36 cặp chữ/nền; 4 cặp dưới 4.5 chờ thầy quyết (xem kết quả in ra của lệnh).

## 25/10/2026 — Kiểm tra đề và giao diện tự động trên CI (P-17)
- Ba bài kiểm mới, `npm test` tự nhặt (glob `tools/test/*.mjs`), kèm workflow `.github/workflows/giao-dien.yml` (3 việc song song, mỗi việc ≤ 10 phút, báo cáo HTML là artifact) và `check_fit.py` chạy bằng Python Playwright:
  - `tools/test/de-bebras.mjs`: 6 game Bebras + 4 bản `?kid=1` (Hành trình Tiểu học) × 3 mức × 1000 seed qua `__kit.make(lv, r, seed)`, r = seed % 10. Kiểm: không lỗi JS, không undefined/NaN, lời giải chạy lại đúng (robot tới đích đủ ngọc, ống bi xếp xong, xoay lật đúng số bước, mật thư giải ra câu, đường đi hợp lệ và rẻ nhất, chồng hình tô ra hình đích), bài chọn đúng 1 đáp án, lựa chọn không trùng. **30 000 đề: 0 lỗi** (chạy thêm 150 000 đề với `SO_SEED=5000`: 0 lỗi, 47 s).
  - `tools/test/de-mam-non.mjs`: 2000 câu qua `__mn.test(type, lv)` (14 dạng × 8 màn), seed cố định bằng cách thay `Math.random` trước khi trang chạy (`addInitScript`, vì trang gắn `R = Math.random` lúc tải). Kiểm: đáp án trong lựa chọn, lựa chọn không trùng, không số âm, phép tính đúng, 1 chỗ khác/1 hình khác, quy luật dãy đúng, màn hình có dựng nút đáp án. **2000 câu mặc định: 0 lỗi.**
  - `tools/test/giao-dien.spec.mjs`: 12 trạng thái trang (4 trang Lớp học ảo sau build, trang chủ, 1 game mỗi họ, Mầm non bản đồ + bài đếm) × 4 khổ 320/375/414/900, trong `prefers-reduced-motion: reduce`: axe-core không serious/critical; ô chạm ≥ 44 px (≥ 48 px mầm non, trừ liên kết chữ inline; hộp kiểm tính cả nhãn); không tràn ngang (bỏ phần tử trong khung tự cuộn ngang); không animation còn chạy; không lỗi JS.
- Cách giữ `npm test` xanh mà vẫn liệt kê lỗi thật: mỗi file có danh sách `DA_BIET` (phát hiện đã ghi, kèm seed/selector và việc sẽ sửa) → in "ĐÃ BIẾT", không làm đỏ; phát hiện **mới** mới làm đỏ. Không sửa lỗi nào ở hàng này.
- **Lỗi thật tìm được (chưa sửa):**
  - Mầm non, dạng **word** chế độ chọn phép tính (`ACTS.word`, `mode: 'op'`, màn 5–8): 2 phép tính cùng ra kết quả đúng, ví dụ `["3 − 1","3 + 3","1 + 1"]` (đáp số 2). 9/30 000 câu; tái hiện: `SO_CAU=30000 node tools/test/de-mam-non.mjs word` → seed 8238, 10254, 11430, 13446, 16302, 17086, 25780, 26046, 27404 (seed = số thứ tự câu, màn = seed % 8 + 1). Sửa gợi ý: lọc `wrong` theo giá trị ≠ `ans`, không chỉ theo chuỗi. Cũng thấy phương án "3 − 0" (bớt 0) là phương án nhiễu yếu.
  - Giao diện, 418 dòng ở 12 trang × 4 khổ gom thành 75 nhóm (xem `DA_BIET` trong `giao-dien.spec.mjs`, mỗi dòng có kích cỡ đo được):
    - **Ô chạm dưới 44 px** (P-19): `.ib` của kit Bebras 42 px, co còn **34 px** ở khổ ≤ 414 (`kit.css`); `.chip` trang chủ 40 px (`index.html:49`); Ô Số/Mật Mã `.icon-btn`, `.bulb`, `#prevBtn/#nextBtn` 34 px, ô chữ `.cell` 23 px ở 320/375, `.nd` ghi chú 22×26, chip câu 42×28; Mảnh Ghép `.tool` 34×29, `.primary/.secondary` cao 34–40; Mầm non `.ib` **36 px** (cần 48) ở mọi khổ, 42 ở 900.
    - **Ô chạm dưới 44 px, Lớp học ảo** (task riêng): màn đăng nhập `.pweye` 40×36, `summary` "Xem bản demo" cao 21, `div.brand` 32, `.btn.sm` cao 25–34, nút VI/EN 40×32, `.chip.ghchip` cao 28, `.tre` cao 33, `select#who` cao 32, ô ghi nhớ `#lgR` cả nhãn 42.
    - **Tràn ngang**: Robot 320 px nút Tạm dừng `#kPause` lòi phải 24 px (thanh trên không co đủ); Ô Số 320/375 `#pauseBtn` lòi 31 px; Lớp học ảo (giáo viên/phụ huynh/quản lý, màn demo) 320–414: `.herochips` lòi 133 px, `img.px.pxe` 74 px, `b` 92 px, `.hcarr` 68 px.
    - **axe serious/critical**: `color-contrast` ở Lớp học ảo (`.appver` + 8 chỗ) và trang chủ (1 nút lọc) — trùng 4 cặp màu FE1 đã đo chờ thầy; `label-content-name-mismatch` ở nút bóng đèn (kit `.bulb`, Ô Số, Lớp học ảo): chữ hiện (số lần) không nằm trong aria-label theo cách axe đọc; Ô Số: `html` thiếu `lang` (serious), `#board` role thiếu phần tử con theo ARIA (critical) — khớp phát hiện L của audit, P-19.
    - Giảm chuyển động: **đạt** ở cả 12 trang (không animation còn chạy).
    - Trên CI Linux (không có phông Baloo/Trebuchet, chữ thay thế rộng hơn) thanh trên tràn thêm: Ô Số 320/375 `#sndBtn` lòi 3–4 px; Mật Mã 900 trang cuộn ngang 25 px (`#pauseBtn`). Máy Mac không thấy → danh sách đã biết ghi cả hai môi trường.
  - `check_fit.py` (73 ca × 8 khổ, 18 phút trên Mac → workflow chia 8 phần song song, `continue-on-error` tới khi sửa): **6 ca ✗** sẵn có trên main: Hành trình lớp 6 · vườn và · cửa hàng ở 1920×950 "side tràn"; Thám tử · piece, · shadow ở 360×640 bị cắt 4 phần tử; Thám tử · mail ở 360×640 (cắt 4) và 390×700 (cắt 3). → P-19.
- `TIEU_CHI.md` mục "Cách kiểm tra trước khi đưa lên" ghi tên 3 lệnh. Thêm `axe-core` vào devDependencies.

## 24/10/2026 — Tự luyện: 6 dạng mới từ VBT lớp 1 tập 2, lớp 2 tập 1–2 (T-27)
- Đã rà 362 trang VBT tham khảo; phần lớn dạng bài đã có. Thêm 6 dạng (viết lại, không chép sách), đều nhập bằng ô số:
  - **Chuỗi phép tính**: số đầu → (+a) → □ → (−b) → □ → … (lớp 1 bài 29–33, 39 không nhớ; lớp 2 bài 5–14, 19–24, 33, 45, 59–63, 69–70).
  - **Bảng thành phần phép tính**: Số hạng/Tổng, Số bị trừ/Hiệu, Thừa số/Tích, Số bị chia/Thương; 3 cột, mỗi cột ẩn 1 ô (lớp 2 bài 3, 5–6, 38–45).
  - **★ Chữ số bí ẩn**: phép đặt tính ẩn vài chữ số, mỗi cột ẩn tối đa 1 nên chỉ có một cách điền (lớp 1 bài 29–33 không nhớ; lớp 2 bài 19–24, 33, 60–63, 69–70 có nhớ).
  - **★ Mỗi hình là một số**: ▲ + ▲ = …, ▲ + ● = …, ● − ■ = … (lớp 1 bài 12–13, 18, 20, 38; lớp 2 bài 10, 14, 19–24, 45 có phép nhân).
  - **Tách số theo hàng**: 623 = □ + 20 + □ (lớp 1 bài 21–24, lớp 2 bài 1–2, 48–54).
  - **Đếm nhảy**: dãy cách đều 1, 2, 5, 10, 100, thêm hoặc bớt; bắt đầu từ bội của bước (lớp 1 bài 21–24, lớp 2 bài 1–2, 39, 40, 48–54).
- `tools/test/tu-luyen.js` kiểm tra luật từng dạng (Chữ số bí ẩn: thử mọi chữ số, phải đúng 1 cách điền).

## 24/10/2026 — Đồng bộ tiến độ an toàn hơn (T-06)
- Dữ liệu học của em (đảo, Tự luyện, Sổ lỗi, bài về nhà, số liệu hồ sơ, xu…) vốn đã lưu lên máy chủ `hs/{tk}` mỗi lần lưu. Sửa 4 chỗ dễ mất dữ liệu:
  - Ghi lỗi (mất mạng) thì tự thử lại sau 20 giây và lần lưu sau vẫn ghi (trước: bỏ qua vì tưởng đã ghi).
  - Làm bài lúc mất mạng rồi tải lại trang: so dấu thời gian `st._t` giữa bản trên máy và bản máy chủ, bản mới hơn được giữ và đẩy lên.
  - Học trên 2 máy: máy này nghe thay đổi của chính em trên máy chủ, bản mới hơn thì nhận ngay, không ghi đè lên bản mới bằng bản cũ.
  - Đăng xuất lúc mất mạng không bị treo (chờ tối đa 4 giây).
- Dữ liệu gần giới hạn 1 MB thì bỏ bản lưu câu cũ trong Sổ lỗi sai. Thử đo: em mẫu học 8 tháng ≈ 40 KB.
- Kiểm tra mới `node tools/test/dong-bo.js` (giả lập máy chủ, không cần mạng). File mới `js/core/79-dong-bo.js`.

## 24/10/2026 — Đặt tính rồi tính trong đảo, phiếu bài, Luyện lỗi (T-05)
- Lớp 2, các bài có nhớ (19–24, 33, 60, 62, 63, 69, 70): thêm dạng "Đặt tính rồi tính" vào Màn 1 và Màn 2 của đảo. Phiếu bài (Bài cô giao), Luyện lỗi, Tự luyện lấy câu từ đảo nên cũng có.
- Ngoài Tự luyện: câu sai lần 1 chỉ xoá chữ số sai, giữ chữ số đúng; vẫn mất 1 tim như câu khác của màn.
- Hướng dẫn khi sai (đặt tính có nhớ, từng hàng, số nhớ đỏ) đọc được dạng mới.

## 24/10/2026 — Tự luyện: dạng "Đặt tính rồi tính" (lớp 2, có nhớ)
- Hai số viết thẳng cột, có dấu và vạch kẻ; em điền từng chữ số kết quả **từ phải sang trái** (ô tự lùi sang trái). Ô nhỏ màu đỏ trên đầu cột để em tự ghi "nhớ 1" (không chấm).
- Luôn có nhớ. Phép theo bài: bài 19 (2 chữ số + 1 chữ số), 20 (2 + 2), 21 cộng; 22 (2 − 1), 23 (2 − 2) trừ; 24, 33, 69 trộn; bài 60 cộng, 62 trừ trong 1000; 63, 70 trộn.
- Lời giải theo từng hàng: "Hàng đơn vị: 8 + 4 = 12, viết 2, nhớ 1. Hàng chục: …".
- `tools/test/tu-luyen.js` kiểm tra kết quả, có nhớ, đúng phép của bài.

## 24/10/2026 — Khủng long chạy: 30 ván/ngày, không hiện số ván
- Mức chơi miễn phí tăng lên **30 ván/ngày**. Không hiện số ván đã chơi cho em (chỉ đếm ngầm).
- Chơi tới 30 ván thì báo: "Hôm nay em đã chơi nhiều lần, hẹn em ngày mai nhé!"

## 24/10/2026 — Tô màu theo kết quả: phép tính luôn một dòng
- Phép tính trong ô không còn bị xuống dòng (trước: "10 −" / "4"). Ô chật thì cả lưới thu nhỏ cùng một cỡ chữ. Đã thử 320/375/414px.

## 24/10/2026 — Tự luyện: thêm 3 dạng bài (T-26)
- **Lưới phép tính**: hàng ngang, cột dọc là 4 phép cộng/trừ đan nhau; ẩn 3 ô (lớp 1) hoặc 4 ô (lớp 2), luôn giải được lần lượt. Dùng làm ★ Thử thách.
- **Tô màu theo kết quả**: 12 ô phép tính, 3 màu ứng với 3 kết quả; chọn màu rồi chạm ô, tô đúng hiện hình. Ô sai được đánh dấu để tô lại.
- **Đúng hay sai (Đ/S nhiều ý)**: 4 ý so sánh số, phép cộng, phép trừ; chạm Đ hoặc S từng ý.
- Gắn theo bài: lớp 1 bài 4–6, 10–13, 18, 20, 22, 29–33, 38–39; lớp 2 bài 3, 5–14, 19–24, 33, 69. `tools/test/tu-luyen.js` kiểm tra luật cả 7 dạng.

## 24/10/2026 — Sức mạnh Toán: tính chặt hơn, hiện mức thay số
- Điểm mỗi dạng co về 50% theo số câu (thêm 2 câu "nửa đúng"): làm ít câu không còn được 100. Điểm mạch tính theo số câu, cần ≥ 10 câu (trước là 5).
- Bỏ số chi tiết: hiện **mức** Mới bắt đầu · Đang tập · Khá · Tốt · Vững ở hồ sơ học sinh, trang giáo viên, phụ huynh, kết quả màn Luyện. So với khối ghi "cao hơn / ngang / thấp hơn".
- Ảnh chụp tháng cũ hạ theo cách tính mới (`st.scv=2`), tháng gần nhất tính lại. Dữ liệu mẫu trang giáo viên tạo lại (`mauHS7`), điểm thấp hơn trước.
- Màu thanh: xanh từ mức Tốt (≥75), vàng từ Khá (≥60).

## 24/10/2026 — Bỏ giới hạn xu trong ngày
- Thầy chốt: không giới hạn số xu em kiếm được trong ngày. Bỏ giới hạn 150 xu/ngày (câu đúng trong màn, Tự luyện) và 100 xu/ngày (trò chơi). Bỏ các dòng "đã đủ xu hôm nay".
- Giữ nguyên: xu mỗi ván trò chơi theo luật từng trò (tối đa 20 xu/ván), giới hạn lượt chơi (vé, Khủng long 10 ván/ngày), Thử thách hôm nay 1 lượt/ngày.
- Vẫn ghi số xu theo ngày (`selfCoins`, `gameCoins`) để thống kê. Sửa ở `01`, `11`, `14`, `18`, `49`, `64`, `72`.

## 24/10/2026 — Tự luyện · Vở bài tập Jenny (lớp 1, 2)
- Nhà em › Phòng học › **Tự luyện** đã dùng được (trước là "Sắp có"). Mỗi đảo qua Màn 1 mở 1 **trang vở**: 5 bài trộn dạng, số mới mỗi lần, + 1 bài **★ Thử thách**. Làm dở thoát ra vẫn giữ.
- Mỗi bài: sai lần 1 được thử lại (không mất tim; ô sai tự xoá), sai lần 2 xem đáp án. Câu của đảo sai lần đầu vào Sổ lỗi sai. +5 xu/bài đúng, ★ +15 xu (quỹ tự luyện 150 xu/ngày). Không tính sao, không mở đảo.
- **Thử thách hôm nay**: 1 lượt/ngày, +15 xu.
- 4 dạng bài mới (kiểu ô điền số, bàn phím số): **Nhà số**, **Gia đình phép tính** (sơ đồ tách–gộp → 2 phép cộng, 2 phép trừ), **Tháp số**, **Tam giác số**. Gắn theo bài KNTT: lớp 1 bài 5–6, 10–13, 18, 20, 29–33, 38–39; lớp 2 bài 3, 5–14, 19–24, 33, 69. Trang khác: ★ là câu mức trùm của đảo.
- Trang giáo viên (trang lớp, lớp 1–2): khung **Tự luyện** — cô ⭐ gợi ý trang (không giao, không bắt buộc), bảng từng em: số trang 7 ngày, tổng trang, % đúng, số ★. Gợi ý lưu trong `S.asg` (`loai:'goiy'`, không lẫn vào Bài cô giao, đồng bộ máy chủ như bài cô giao).
- Lớp 3–5: ô Tự luyện vẫn "Sắp có".
- Kiểm tra mới: `node tools/test/tu-luyen.js` (mọi trang lớp 1–2 đủ 5 bài + ★, đáp án dạng mới đúng luật, làm thử trọn 1 trang, Thử thách hôm nay, gợi ý của cô, không tràn 320px).
- File mới: `js/core/72-tu-luyen.js`.

## 2026-10-24
- Quản lý: nút ✎ Sửa thông tin giáo viên (tên, giới tính, SĐT, Gmail, mật khẩu) và phụ huynh (SĐT, Gmail, mật khẩu); nút 👪 Con để sửa con.
- Quản lý › Học sinh: bỏ ô tích chọn từng em và ô "Chọn cả trang".
- Quản lý: nút 🗑 Xoá cạnh ✎ Sửa ở từng dòng học sinh (trang Học sinh, trang Lớp); bảng nhập/sửa có nút Lưu/Xoá luôn hiện ở đáy, không phải kéo xuống.
- Trang Quản lý, Giáo viên, Phụ huynh: phong cách mới kiểu Google Classroom (chữ Lexend, thanh trên trắng tab gạch chân, thẻ viền mảnh bo 8px, dải màu đầu thẻ, nút phẳng). Trang học sinh giữ pixel.
- Luôn nền sáng trắng ở mọi trang (học sinh, giáo viên, phụ huynh, quản lý), không đổi theo chế độ tối của máy; nhãn Mới/Chưa làm/Đã làm đậm màu hơn.
- Quản lý: chống bấm nhiều lần khi tạo/lưu (khoá nút, không tạo trùng); hỏi lại khi tạo em trùng họ tên; trang Phụ huynh bỏ nút tạo tay, "Sửa con" → "✎ Sửa".
- Sửa lỗi không vào được trang Quản lý/Giáo viên/Phụ huynh (máy chủ) khi có em chưa xếp lớp (khối 0 làm lỗi tạo dữ liệu học).
- Quản lý: bỏ Họ tên phụ huynh (bảng Thêm học sinh, file Excel mẫu); thêm Xoá học sinh (từng em trong bảng Sửa, hoặc chọn nhiều em; gõ XOA để xác nhận; xoá cả tài khoản trên máy chủ và phụ huynh ph.… không còn con).
- Quản lý: tài khoản phụ huynh tự động khi tạo học sinh (gắn theo SĐT/Gmail có sẵn, hoặc tạo ph.<tên đăng nhập em>); gộp khi bổ sung SĐT sau; nút tạo cho các em chưa có; ô Họ tên phụ huynh ở bảng Thêm học sinh. Nhập Excel dùng cùng luật.
- Quản lý: Kết thúc năm học · Lên lớp (3 bước: lớp mới, từng học sinh, xác nhận); Ở lại lớp / Nghỉ học / Học xong; lọc "Nghỉ học / Đã học xong" + Mở lại; lưu Các năm học trước; máy chủ tự lên lớp khi em đăng nhập.
- Quản lý: Nhập danh sách từ Excel/CSV (file mẫu, xem trước, báo lỗi từng dòng, cập nhật không trùng, gom anh chị em chung phụ huynh), Tải danh sách .xlsx, In phiếu đăng nhập học sinh/phụ huynh (đen trắng, 8 phiếu/A4). Bảng nhập luôn nền sáng ở chế độ tối.
- Chế độ tối: nút phụ nền sáng hơn, ô nhập/ô chọn nền tối riêng, ô tích viền sáng, nút bị khoá rõ chữ, khung pixel sáng hơn; nhãn mờ ở Sức mạnh Toán đậm hơn. Quản lý: "+ Tạo tài khoản học sinh" thành nút như các nút khác.
- Quản lý: Thêm học sinh vào lớp chỉ gợi ý 5 em chưa xếp lớp, gõ tên để tìm thêm; bỏ nút Xếp lớp ở trang Học sinh; sửa lệch khung mọi danh sách (máy tính, điện thoại 320–414px, chế độ tối).
- Quản lý: xếp lớp ngay ở trang Học sinh (ô chọn lớp từng em) và ngay trong trang Lớp (khung Thêm học sinh vào lớp: tìm, tích chọn, Đưa vào lớp).
- Quản lý: trang chính 4 nút lớn (Học sinh, Phụ huynh, Giáo viên, Lớp) + trang con, Nhật ký, Năm học (sắp có lên lớp). Trang Học sinh có lọc, tìm, chọn nhiều em, phân trang; trang Lớp có thêm học sinh, phân công GV, gói Toán Jenny.
- Quản lý: bỏ ô Lớp khi tạo học sinh; em mới "Chưa xếp lớp", xếp lớp nào thì khối theo lớp đó; chưa xếp lớp thì chưa đăng nhập được.
- Đảo nhà: bỏ khung tiền "🪙 n Cửa hàng ▸" ở thanh trên.

## 24/10/2026 — Rà lệch khung các bảng nhập Quản lý
- Bỏ chữ phụ trong nhãn (đưa vào chữ mờ trong ô) để nhãn 1 dòng; ô trong cùng hàng canh đáy, cao bằng nhau (42px).
- Rà tự động 6 bảng (Thêm HS, Thêm GV, Thêm lớp, Xếp lớp, Phụ huynh, Sửa tài khoản) × 4 khổ (320, 390, 600, 1100) × sáng/tối × có/không máy chủ: không ô nào lệch hay tràn.

## 24/10/2026 — Sửa lọc học sinh theo Khối ở trang Quản lý
- Bấm Khối 1…5, chọn lớp, tìm tên, "Hiện thêm" trước không có tác dụng (biến lọc bị khoá trong hàm). Nay lọc đúng; bỏ chọn Phân công cũng hoạt động.

## 24/10/2026 — Sửa lệch ô trong bảng nhập Quản lý
- Các bảng Thêm giáo viên, Thêm học sinh, Sửa tài khoản: ô không còn tràn ra ngoài khung; xếp 2 cột đều (Giới tính · Điện thoại/Năm sinh), Gmail và Ngày sinh (ngày, tháng) một hàng riêng.

## 24/10/2026 — Quản lý: nút + bảng nhập; xếp lớp; 1 phụ huynh nhiều con
- Bỏ các ô nhập dài trên trang Quản lý; thay bằng nút **+ Thêm lớp**, **+ Thêm học sinh**, **+ Thêm giáo viên**, **⇄ Xếp lớp**, **👪 Tài khoản phụ huynh**. Bấm nút → bảng nhập.
- Thêm học sinh: Họ và đệm, Tên, Giới tính (bắt buộc — để chọn nhân vật), Ngày/Tháng/Năm sinh, Lớp, Điện thoại & Gmail phụ huynh (+ tên đăng nhập, mật khẩu khi có máy chủ).
- Thêm giáo viên: Họ tên, Giới tính, Điện thoại, Gmail (+ tên đăng nhập, mật khẩu). Thêm lớp: Khối, Tên lớp, Giáo viên.
- Bảng Học sinh: nút **Bỏ khỏi lớp** từng em (chuyển lớp vẫn bằng ô chọn lớp). **Xếp lớp**: chọn lớp, tích nhiều em cùng khối để đưa vào.
- **Phụ huynh**: 1 tài khoản gắn nhiều con (anh chị em cùng bố mẹ); thẻ "Phụ huynh" liệt kê tài khoản và các con, nút "Sửa con". Máy chủ: danh sách con lưu trong tài khoản phụ huynh.

## 24/10/2026 — Nhân vật theo giới tính quản lý nhập
- Học sinh **không còn tự chọn** bạn nữ/bạn nam: bỏ hàng "Nhân vật" trong Tủ đồ và bỏ ô hỏi khi vào lần đầu. Tủ đồ chỉ có nhân vật của em.
- Quản lý chọn **Giới tính** khi tạo tài khoản (ô "Thêm học sinh") hoặc khi ✎ Sửa → em đăng nhập là nhân vật tương ứng (Nam = bạn nam, Nữ hoặc chưa nhập = bạn nữ). Cửa hàng hiện đồ theo giới tính đó.
- Bản có máy chủ: giới tính được ghi vào hồ sơ học sinh trên máy chủ để máy của em nhận được.

## 24/10/2026 — Hồ sơ học sinh trong trang Quản lý
- Ô ✎ Sửa thêm: **Giới tính · Ngày sinh (ngày, tháng) · Năm sinh · Điện thoại phụ huynh · Gmail phụ huynh**. Kiểm tra số điện thoại, gmail, ngày có thật.
- Bảng Học sinh hiện dòng hồ sơ dưới tên (vd "Nữ · 12/3/2019 · PH 0912345678 · …"); em chưa có hồ sơ ghi màu cam "Chưa có hồ sơ".
- Lưu ở dữ liệu trung tâm (theo tên đăng nhập, đổi tên đăng nhập vẫn giữ); có ghi Nhật ký.
- Sửa: ô "Chọn nhân vật" không hiện khi đang ở vai Giáo viên/Quản lý/Phụ huynh.

## 24/10/2026 — Sửa tài khoản học sinh: chỉ Họ tên, Tên đăng nhập, Mật khẩu
- Theo thầy: bỏ sửa khối, nhân vật, xu, Toán Jenny, làm lại tiến độ. Ô Sửa chỉ còn **Họ tên · Tên đăng nhập · Mật khẩu mới** (để trống nếu không đổi).
- Đổi tên đăng nhập: dữ liệu học (sao, xu, đồ, lớp, phụ huynh) chuyển theo, không mất; không cho trùng tên đã có.
- Bản có máy chủ: đổi cả tài khoản, hồ sơ, liên kết phụ huynh trên máy chủ; đổi mật khẩu như "Đặt lại mật khẩu". Bản demo: mật khẩu không đổi được (không có máy chủ).

## 24/10/2026 — Bỏ ô "Tên của em" khi đăng nhập; quản lý sửa thông tin học sinh
- Trang đăng nhập học sinh chỉ còn Tên đăng nhập + Mật khẩu. Tên hiển thị do quản lý nhập.
- Quản lý › Học sinh: mỗi em có nút **✎ Sửa**: Họ tên, Khối, Nhân vật (nữ/nam/em tự chọn), Xu, Kích hoạt Toán Jenny, **Làm lại tiến độ** (bấm 2 lần mới xoá). Đổi khối thì em ra khỏi lớp khác khối. Mọi thay đổi ghi Nhật ký thao tác.
- Bản có máy chủ: lưu cả lên máy chủ (hồ sơ học sinh, tên trong tài khoản); máy chủ từ chối thì báo lỗi.

## 24/10/2026 — Thú cưng mới, các giai đoạn lớn lên
- Thêm **Ếch xanh** 180 xu (60–80 ngày, đẻ trứng), **Mèo con** 280 xu (110–150 ngày), **Cún con** 300 xu (120–160 ngày). Mèo, Cún không đẻ trứng.
- Mọi loài có **4 hình theo giai đoạn**: Bé → Lớn dần → Trưởng thành → Già. Gà: gà con → gà choai → gà mái; Ếch: nòng nọc → ếch con còn đuôi → ếch lớn; Rùa: mai lớn dần; Mèo, Cún: con nhỏ → lớn. Già: màu nhạt, lông mày bạc.
- Đổi mã phụ kiện Khăn quàng đỏ, Bờm tai mèo để không trùng đồ thú cưng (khăn của thú cưng hiện đúng như cũ).

## 24/10/2026 — Thêm 18 mặt hàng Cửa hàng
- Áo váy: Áo Bạc hà 130, Áo Sô-cô-la 160, Váy Dâu tây 180 (nữ), Váy Oải hương 200 (nữ), Áo Cướp biển 220 (nam), Áo Bác sĩ nhí 260.
- Mũ kính: Kẹp ngôi sao 60 (nữ, tóc), Khăn quàng đỏ 70 (cổ), Bờm tai mèo 90 (nữ, mũ), Mặt nạ siêu nhân 120 (mặt), Mũ đầu bếp 140, Mũ cướp biển 160 (nam).
- Khung: Khung Hoa 150, Khung Kẹo ngọt 180, Khung Đêm sao 250 (hiện cả ở Tủ đồ và thẻ chào).
- Đảo nhà: Hoa hướng dương 40 (cỏ trái), Lửa trại 60 (cát trái), Rương kho báu 100 (cát phải) — có chỗ đặt riêng.

## 24/10/2026 — Nhân vật Nam, đồ cho bạn nam
- Giữ phong cách pixel cũ (thầy chốt không đổi cỡ ô).
- **Bạn nam**: tóc ngắn dựng, không búi, không nơ; dùng chung thân, biểu cảm, áo, mũ kính với Jenny.
- Lần đầu vào, học sinh chọn **Bạn nữ / Bạn nam**; đổi lại ở Tủ đồ (hàng "Nhân vật"). Nhân vật đã chọn hiện ở thẻ chào, khi làm bài, Tủ đồ, Cửa hàng. "Tủ đồ của Jenny" → "Tủ đồ của em".
- Cửa hàng thêm: Áo cầu thủ 150, Áo Ninja 200, Áo phi hành gia 250; Nơ cổ 60, Băng đô ninja 80, Kính râm 100, Tai nghe 150, Mũ bảo hiểm 180.
- Đồ riêng (Váy Hoa đào, Nơ đỏ, Kẹp hoa cho bạn nữ; Áo cầu thủ, Áo Ninja, Nơ cổ, Băng đô cho bạn nam) chỉ hiện với bạn đó; đồ chung hiện cho cả hai.
- Phụ kiện thêm chỗ đeo "Tai" (tai nghe) và "Cổ" (nơ cổ): đeo cùng lúc được mũ + kính + tóc + tai + cổ.

## 24/10/2026 — Tự luyện: chốt ý tưởng Vở bài tập Jenny
- Thầy chốt: Tự luyện là trang vở theo đảo đã qua + bài ★ Thử thách; cô chỉ gợi ý, không giao (ghi ở `docs/LUAT-DA-CHOT.md`).
- Thêm bảng dạng bài lớp 1 tập 1 rà từ VBT tham khảo: `docs/tu-luyen-dang-bai-lop1-tap1.md` (chỉ ghi dạng bài, không chép sách).

## 24/10/2026 — Khủng long chạy miễn phí từ đầu
- Em nào cũng có sẵn trò **Khủng long chạy** ở Cửa hàng › Trò chơi và Nhà em, không cần mua (trước đây 150 xu), không tốn lượt chơi.
- Giới hạn riêng 10 ván/ngày, không trừ vào 10 lượt/ngày của Bowling, Đẩy thùng. Cúp và đồ hiếm (Khăn khủng long) vẫn như cũ.
- File mới: `js/core/66-dino-mien-phi.js`.

## 24/10/2026 — Giọng đọc: dùng Gemini TTS miễn phí (không cần thẻ)
- Thầy không gắn thanh toán Google Cloud. `tools/giong/tao-giong.py` thêm nguồn **Gemini TTS** (khóa AI Studio `GEMINI_API_KEY`), giọng Despina; tự thử các tên mô hình TTS, đổi âm thanh sang mp3 bằng ffmpeg.
- Gói miễn phí: nghỉ 7 giây giữa các câu, lỗi 429 thì chờ rồi thử lại, hết lượt trong ngày thì lưu phần đã thu và dừng. Bước lưu vào repo chạy cả khi bước thu dừng giữa chừng.
- Vẫn giữ nguồn Cloud Chirp 3 HD (`GOOGLE_TTS_KEY`) cho sau này.

## 24/10/2026 — Chốt giọng đọc Google Chirp 3 HD · Despina; công cụ thu sẵn
- Thầy chọn giọng **Chirp 3 HD · Tiếng Việt · Despina**. Ghi vào `docs/LUAT-DA-CHOT.md` mục 5.
- `tools/giong/tao-giong.py`: gọi Google Text-to-Speech, ghi mp3 theo danh sách JSON; có lưu đệm (`_ma.json`) nên chỉ thu lại câu đã sửa.
- `.github/workflows/giong-doc.yml`: bấm chạy trên GitHub (Actions › Thu giọng đọc) để thu và lưu file vào repo. Khóa API đặt ở Secrets `GOOGLE_TTS_KEY`.
- Trang nghe thử `games/lop-hoc-ao/giong-mau/` với 7 câu mẫu (`tools/giong/cau-mau.json`): dấu hỏi/ngã, đọc số, câu hỏi, bài giảng, hướng dẫn, lời khen, câu có kí hiệu toán.
- Chưa gắn vào app.

## 24/10/2026 — Điểm Tư duy – Logic kết hợp mọi mạch
- Công thức (thầy duyệt; theo TIMSS, câu suy luận nằm rải trong mọi mạch): **A 40%** bài thuần logic (quy luật, tìm nhóm khác, suy luận…) · **B 40%** bài suy luận ở các mạch khác (tìm thành phần chưa biết, bài nhiều bước, so sánh kết quả, ước lượng, câu đúng/sai — vẫn tính vào mạch của nó) · **C 20%** thói quen: đúng ngay lần đầu × (1 − tỉ lệ trả lời dưới 3 giây).
- Phần chưa có dữ liệu thì chia lại trọng số; hiện điểm khi A + B có từ 5 câu. Lớp chưa mở Toán Jenny vẫn có điểm Logic.
- Hồ sơ giáo viên/phụ huynh: dưới thanh Logic có dòng "Bài logic · Suy luận ở các mạch · Thói quen".
- "Luyện" theo trục yếu: trục Logic lấy cả bài suy luận ở các mạch. Dữ liệu mẫu tạo lại.

## 24/10/2026 — Trục Lời văn thay bằng Tư duy – Logic
- Sức mạnh Toán giờ có 6 trục: Số · Phép tính · **Tư duy – Logic** · Hình học · Đo lường · Thống kê.
- Logic: bài quy luật, dãy số theo quy luật, tìm nhóm khác, xếp hình – suy luận, cân thăng bằng (Toán Jenny và sách). Chưa có bài thì hiện "chưa học".
- Bài lời văn tính vào trục nội dung: thêm/bớt, bảng nhân chia, nhiều bước, tổng – hiệu, tổng – tỉ → Phép tính; kg, lít, độ dài, thời gian, vận tốc, tiền → Đo lường; diện tích, thể tích, hình tròn → Hình học; phân số, số thập phân, phần trăm, tỉ lệ bản đồ → Số.
- Hồ sơ giáo viên/phụ huynh: thêm dòng **Giải toán lời văn: đúng x%**; bảng dạng bài có nhãn "lời văn".
- Dữ liệu cũ tự chuyển sang trục mới; dữ liệu mẫu 8 tháng tạo lại.

## 24/10/2026 — Sửa: Sức mạnh Toán hiện điểm Hình học sai (lớp 1)
- Nguyên nhân: Toán Jenny lớp 1 Buổi 1 "Quy luật xếp hình" có dạng "Quy luật lặp 2 hình / 3 hình" (táo, sao, bóng…). Luật gắn mạch thấy chữ "hình" nên tính vào **Hình học**. Học sinh mới học Bài 1–2 (như Đặng Phương Dung) vì thế có điểm Hình học dù chưa học hình.
- Sửa (`35-ho-so.js`): dạng "Quy luật lặp…" tính vào mạch **Số**. "Quy luật xếp hình" ở Bài 8 (xếp hình vuông, tròn…) vẫn là Hình học.
- Dữ liệu cũ tự sửa: khi mở hồ sơ, các dạng bài được gắn lại mạch đúng; mạch chưa đủ 5 câu thì bỏ khỏi biểu đồ (hiện "chưa đủ"/"chưa học"). Học sinh mở app là lưu bản đã sửa lên máy chủ.

## 24/10/2026 — Bấm logo Clb để về trang chủ
- Thanh trên cùng: bấm (hoặc chạm) logo "JennyClub / Clb Học Toán cùng Jenny" là về trang chủ (Bản đồ), từ bất cứ tab nào (Cửa hàng, Nhà em, Sổ lỗi sai…). Trang giáo viên, phụ huynh, quản lý: về màn đầu của vai đó.
- Trong màn chơi, thanh trên được ẩn nên không lỡ tay thoát. Nếu đang có bài về nhà bắt buộc thì vẫn hiện màn bài về nhà.
- File mới: `js/core/65-logo-ve-trang-chu.js`.

## 24/10/2026 — Sửa: chơi trò chơi xong không được xu
- Nguyên nhân: mỗi câu đúng trong màn +5 xu và trò chơi dùng **chung** giới hạn 150 xu/ngày. Học vài màn (khoảng 30 câu đúng) là hết giới hạn → trò chơi kết thúc được 0 xu mà không báo gì (test01, test02 đều đã chạm 150 hôm nay).
- Sửa (`64-xu.js`): trò chơi (trò chơi đảo, câu cá, bóng bay, đua giờ, kéo co) có **giới hạn riêng 100 xu/ngày**, mỗi lượt tối đa 20 xu; câu đúng trong màn vẫn giới hạn 150/ngày. Hết giới hạn trò chơi thì màn kết thúc báo "Hôm nay em đã nhận đủ 100 xu từ trò chơi".
- Đã chạy thử 13 trò chơi đảo + câu cá, bóng bay, đua giờ: trò nào cũng cộng xu đúng.
- Sửa dòng "Kiếm xu" ở Cửa hàng cho đúng thực tế: mỗi câu đúng +5 (tối đa 150/ngày) · qua màn +10, trùm đảo +30 · sửa xong 1 lỗi +5 · trò chơi tới +20 mỗi lượt (tối đa 100/ngày) · trùm lớp +20–30 · bài về nhà +20 (có bản tiếng Anh).

## 24/10/2026 — Sửa: lớp 1A không hiện "Giao phiếu bài cho lớp"
- Nguyên nhân: khung phiếu cả lớp đọc cả bài Luyện lỗi riêng của em (chưa có kết quả) nên bị lỗi và không vẽ ra (gặp ở lớp 1A của cô Thử).
- Sửa: khung "Giao phiếu bài cho lớp" chỉ liệt kê phiếu cả lớp; bài riêng từng em xem ở hồ sơ em. Thêm chặn lỗi khi bài chưa có kết quả.
- Đã thử đặt lại mật khẩu thật cho test02: mật khẩu cũ bị từ chối, mật khẩu mới vào được, dữ liệu giữ nguyên.

## 24/10/2026 — Quản lý: danh sách tài khoản + đặt lại mật khẩu
- Trang Quản lý có mục **Tài khoản**: họ tên, vai trò, tên đăng nhập, lớp/con của mọi giáo viên, học sinh, phụ huynh; nút **Đặt lại mật khẩu** (gợi ý mật khẩu mới, hiện lại "Vừa đặt lại: tk / mật khẩu").
- Gói miễn phí không đổi được mật khẩu người khác, nên đặt lại = tạo tài khoản đăng nhập mới cho **cùng tên đăng nhập**, chuyển vai trò sang, bỏ tài khoản cũ; bảng `login/{tk}` cho biết tên đăng nhập dùng email ẩn nào. Dữ liệu học, nhận xét, bài về nhà giữ nguyên (gắn theo tên đăng nhập).
- Quy tắc Firestore thêm `login/{tk}` (ai cũng đọc được để đăng nhập; chỉ quản lý ghi) — cần dán lại quy tắc.

## 24/10/2026 — Làm xong bài Luyện lỗi cô giao thì bỏ các lỗi đó khỏi Sổ lỗi sai
- Bài Luyện lỗi cô giao: em luyện xong **một lượt** (mỗi lỗi 2 câu số mới) là xong bài; các lỗi trong bài **ra khỏi Sổ lỗi sai** (không cần đúng 2 lần liền nữa). Lỗi khác cô không giao vẫn giữ (tự bỏ sau 7 ngày).
- Dữ liệu cũ: bài đã xong trước đây cũng được dọn các lỗi tương ứng (ghi trước/trong ngày làm xong).
- Sửa chữ ở màn bài về nhà, màn kết thúc, trang giáo viên và phụ huynh cho khớp luật mới.

## 24/10/2026 — Sửa: bài Luyện lỗi cô giao bị mở lại khi em sai lại
- Lỗi: bài "Luyện lỗi" đã xong lại thành "chưa xong" khi em sai lại đúng dạng đó → app chặn bắt làm lại (gặp ở tài khoản test01).
- Sửa: sửa hết các lỗi cô giao một lần là bài **xong hẳn** (`asgR.xong`); sai lại sau đó chỉ ghi vào Sổ lỗi sai (tự luyện, tự bỏ sau 7 ngày). Lỗi của bài đã xong không còn được giữ khỏi việc tự bỏ.

## 24/10/2026 — Trang phụ huynh: nhắc lỗi tự bỏ sau 7 ngày
- Khung "Nhắc bố mẹ" (dưới Lời nhắn của giáo viên) khi con có lỗi trong Sổ lỗi sai: số lỗi, bao nhiêu lỗi cô đã giao, bao nhiêu lỗi sẽ tự bỏ sau 7 ngày (báo riêng lỗi chỉ còn 1–2 ngày), lời khuyên con luyện 5 phút mỗi ngày ở mục Luyện lỗi.
- Thẻ "Lỗi & bài về nhà" của phụ huynh: câu giải thích viết cho bố mẹ; cột "Tự bỏ sau" cho từng lỗi.

## 24/10/2026 — Màn đăng nhập dễ đọc + nút hiện mật khẩu
- 3 trang Giáo viên/Phụ huynh/Quản lý: ô nhập luôn nền trắng chữ xanh đậm (trước bị nền tối khi máy để chế độ tối), viền vàng khi đang gõ, nút Đăng nhập xanh rõ.
- Nút hình con mắt trong ô mật khẩu (cả app học sinh): bấm để hiện/ẩn mật khẩu.
- Dịch nút "Quản lý" sang tiếng Anh (bài kiểm tra tiếng Anh còn 0 chuỗi sót).

## 24/10/2026 — Luyện lỗi không bắt buộc; lỗi cô không giao tự bỏ sau 7 ngày
- Bỏ chặn "luyện lỗi trước rồi mới chơi tiếp" (`46-bat-buoc-luyen-loi.js`). Màn kết thúc có lỗi: nút "Luyện lại câu sai (n)" — không bắt buộc.
- Lỗi vẫn ghi vào Sổ lỗi sai. Cô giao "Luyện lỗi" (hồ sơ › Lỗi & bài về nhà) → bài về nhà bắt buộc như cũ.
- `63-loi-tu-bo.js`: lỗi không nằm trong bài cô giao tự bỏ sau 7 ngày kể từ lần sai gần nhất; lỗi cô đã giao giữ tới khi em làm xong. Bảng Sổ lỗi sai của cô có cột "Tự bỏ sau" (x ngày / cô đã giao).

## 24/10/2026 — Sửa hiển thị trên điện thoại (trang Giáo viên, Phụ huynh, Quản lý)
- Nguyên nhân chính: 3 trang thiếu khung trang (`<!doctype>` + `meta viewport`) nên điện thoại vẽ như màn 980px rồi bóp lại → chữ bị chèn, cột dồn. `tools/_teacher.py` thêm khung trang như bản học sinh.
- Bảng trên điện thoại (≤640px) chuyển thành thẻ: ô đầu là tiêu đề, các ô sau "NHÃN … giá trị" (Tiến độ từng em, Tiến độ SGK, Dạng bài, Sổ lỗi sai, Bài về nhà, Lớp học, Học sinh…).
- Thanh 4 thẻ hồ sơ thành lưới 2 × 2; thanh tài khoản (tên · Đổi mật khẩu · Đăng xuất) gọn hơn.
- Đã quét tự động ở khổ 320/360/390 (giả lập điện thoại), chế độ tối và 1280px: không tràn, không chữ bị bóp.

## 24/10/2026 — Tách 3 trang: Giáo viên, Phụ huynh, Quản lý
- `tools/_teacher.py` tạo 3 trang riêng: `games/lop-hoc-ao/giao-vien/` (tài khoản giáo viên; quản lý cũng vào được để dạy), `phu-huynh/` (chỉ phụ huynh), `quan-ly/` (chỉ quản lý, có "Thiết lập lần đầu"). Mỗi trang chỉ một vai, không còn thanh chọn vai.
- Đăng nhập sai trang → báo "Đây là tài khoản …" kèm link đúng trang. Mỗi trang vẫn có "Xem bản demo" của vai đó (mật khẩu `giaovien123`).

## 24/10/2026 — Nối máy chủ Firebase (dữ liệu dùng chung thật)
- `js/core/62-may-chu.js` + quy tắc `firebase/firestore.rules` (đã dán vào Firestore). Dự án Firebase `jenny-lop-hoc-ao`, vùng asia-southeast1, gói miễn phí.
- **Trang giáo viên & phụ huynh** (`games/lop-hoc-ao/giao-vien/`): đăng nhập bằng tài khoản thật; vẫn có "Xem bản demo" (mật khẩu `giaovien123`) và "Thiết lập lần đầu". Vai trò theo tài khoản: Quản lý (Giáo viên + Quản lý + xem như phụ huynh), Giáo viên (chỉ lớp được phân công), Phụ huynh (chỉ con mình). Có Đổi mật khẩu, Đăng xuất, trạng thái "Đã lưu lên máy chủ".
- **Quản lý** tạo tài khoản thật: giáo viên (tên đăng nhập + mật khẩu), học sinh (tự gợi ý tên đăng nhập, mật khẩu mặc định jenny123), phụ huynh (gắn với con).
- **App học sinh**: đăng nhập tài khoản trung tâm cấp → tiến độ lưu lên máy chủ; bài về nhà cô giao hiện ngay (thời gian thực); tài khoản thử cũ (jenny01…05, lebaona) vẫn chạy kiểu lưu trên máy.
- Dữ liệu: `users/{uid}`, `org/main`, `hs/{tk}` (em ghi), `hsgv/{tk}` (cô ghi: nhận xét, thẻ, ghi chú), `asg/{id}` (bài về nhà). Tên đăng nhập đổi thành email ẩn `tk@jenny-lop-hoc-ao.firebaseapp.com`.
- Đã thử trọn vòng trên máy chủ thật: quản lý tạo lớp/giáo viên/học sinh/phụ huynh → em làm bài → cô giao luyện lỗi → em bị chặn ngay, làm xong → cô thấy "Đã sửa xong" → phụ huynh đọc lời nhắn. Phụ huynh và em khác không đọc được dữ liệu em khác (bị chặn đúng).

## 23/10/2026 — Bố cục cân đối khi đổi độ rộng màn hình
- `js/core/61-bo-cuc-can-doi.js`: dãy ô số liệu và thẻ lớp chọn số cột theo số ô — 6 ô = 3 cột × 2 hàng (điện thoại 2 × 3), 4 ô = 4 cột (máy nhỏ 2 × 2), 3 ô = 3 cột; không còn hàng cuối lẻ một ô.
- Các cặp khung (Sức mạnh Toán / Điểm từng mạch, Phần thưởng / Hoạt động gần đây, Ghi chú / Nhận xét, Giáo viên / Nhật ký) chia đều 2 cột, dưới 900px xếp 1 cột.
- Lịch học và Khung giờ học nằm cạnh nhau; bảng dạng bài hiện 10 dạng yếu nhất, còn lại ở "Xem thêm".
- Trang lớp: "Cần chú ý" 2 cột, 6 mục; cột bảng tiến độ không xuống dòng lộn xộn.
- Quản lý: lọc theo lớp, tìm tên, hiện 20 em mỗi lần ("Hiện thêm"); lọc khối và tạo lớp chỉ khối 1–5.
- Dữ liệu mẫu: các đảo đã qua phần lớn hoàn thành (bớt "Kẹt" giả); tạo lại một lần.

## 23/10/2026 — Sức mạnh Toán 3 đường, nhận xét tự viết, trang phụ huynh đầy đủ, dữ liệu mẫu 8 tháng
- Sức mạnh Toán (mạng nhện) có 3 đường: **em · 3 tháng gần nhất**, **em · 6 tháng gần nhất**, **trung bình học sinh Jenny cùng khối** (nét đứt). Điểm từng mạch: thanh = 3 tháng, vạch = TB khối, dòng phụ "6 tháng · khối (±)". Tính từ ảnh chụp điểm hằng tháng `st.skm`.
- Bỏ thẻ "Ghi nhận và nhận xét" ở trang lớp. Hồ sơ › Ghi chú & giao bài: **"Nhận xét gửi phụ huynh"** — cô tự viết (ô chữ), xem lại 5 lời nhắn đã gửi; vẫn tặng thẻ được.
- **Trang phụ huynh** (lớp 1–5): đầu trang có tình hình hôm nay, số bài về nhà chưa xong; mục **Lời nhắn của giáo viên** (mới nhất ở trên, xem lời nhắn cũ, thẻ cô tặng); 3 thẻ như giáo viên: Tổng quan · Hoạt động học tập · Lỗi & bài về nhà (không có ghi chú riêng của cô, không có nút giao bài).
- **Dữ liệu mẫu 8 tháng** (5/9/2026 → 2/5/2027, ngày demo 240) cho mọi học sinh trừ Lê Bảo Na: lịch học (nghỉ Tết ít học), điểm mạch tăng dần theo tháng, tiến độ đảo, dạng bài, Sổ lỗi sai, 3–6 bài về nhà đã làm (khoảng 1/4 em có 1 bài đang chờ), 3–7 lời nhắn của cô, thẻ, xu. Sẽ xóa khi có dữ liệu thật.
- Bài giao mới trong bản demo lấy theo ngày demo (`gvNow`).

## 23/10/2026 — Bài về nhà bắt buộc trong bản GitHub
- `js/core/60-bai-ve-nha.js`: bài cô giao (`a.bat=1`) phải làm xong trước mọi việc khác. Em chỉ thấy màn "★ BÀI VỀ NHÀ CÔ GIAO" (bài đầu tiên + nút Làm ngay/Làm tiếp/Làm lại, các bài tiếp theo xếp lần lượt). Chỉ Đăng xuất dùng được.
- Hai loại: **Phiếu** (theo dạng yếu hoặc phiếu cả lớp) — đạt khi đúng từ 80%, chưa đạt thì làm phiếu mới; **Luyện lỗi có mục tiêu** — mỗi lỗi 2 câu số mới, đúng 2 lần liền mới ra khỏi sổ, còn lỗi thì làm lại.
- Xong bài: +20 xu (thêm vào xu phiếu sẵn có).
- Hồ sơ › Lỗi & bài về nhà: tích chọn lỗi, nút "Giao luyện tất cả" / "Giao các lỗi đã chọn"; bảng "Bài về nhà cô đã giao" có kết quả (còn x lỗi, chưa đạt, đạt…).
- Phiếu cả lớp mới giao (thẻ Giao phiếu bài cho lớp) và phiếu theo dạng yếu đều là bài bắt buộc. Phiếu mẫu cũ không bắt buộc.
- Sửa khóa lỗi mẫu cho khớp với luyện lỗi.

## 23/10/2026 — Hồ sơ học sinh: 4 thẻ, biểu đồ mạng nhện, giao phiếu tự động theo dạng yếu
- Hồ sơ còn 4 thẻ: Tổng quan · **Hoạt động học tập** (gộp Học tập + Hoạt động: lịch học + khung giờ, tiến độ SGK, tỉ lệ đúng từng dạng, phần thưởng, hoạt động gần đây) · Lỗi & bài về nhà · Ghi chú & giao bài.
- Tổng quan: **Sức mạnh Toán vẽ bằng biểu đồ mạng nhện** (SVG, tháng này + tháng trước nét đứt; mạch chưa đủ bài để xám, có ghi chú khi dưới 3 mạch). Bên phải: điểm từng mạch + Cảnh báo. Bỏ khung "Gợi ý cho cô"; các gợi ý còn lại thành nhãn trong Cảnh báo (Nhắc đọc kỹ đề, Ôn lại cách làm, Cần hỗ trợ nhiều, Nhắn phụ huynh, Khen em).
- **Giao phiếu theo dạng bài em còn yếu**: dạng đúng dưới 50% (làm ít nhất 4 lần) có thẻ gợi ý; app tự soạn phiếu 8 câu (dễ trước, vừa sau) từ các đảo em đã học, hạn 2 ngày, đạt 80%. Cô chỉ bấm Giao / Xem trước câu hỏi / Bỏ qua (hiện lại được). Dạng đã giao chưa làm ghi "chờ em làm". Dạng 50–70% ghi "Nên luyện thêm". Bảng tỉ lệ đúng từng dạng ở mục mở rộng, dòng yếu tô đỏ. Bỏ cách cô tự chọn tiết.
- Kết quả phiếu theo dạng tính vào tỉ lệ đúng của dạng đó (`a.kinds`, `a.ten`; `phQs`, `phSubmit` được bọc).
- Sửa lỗi ô "Nhận xét" tràn khỏi khung; thanh thẻ hồ sơ không còn rơi xuống cuối trang trên điện thoại.

## 23/10/2026 — Hồ sơ học sinh cho giáo viên; chỉ còn tài khoản tiểu học
- Bấm tên em (bảng Tiến độ, Cần chú ý) → **Hồ sơ học sinh** kiểu trang giáo viên, 5 thẻ (`js/core/59-ho-so-giao-vien.js`):
  - Tổng quan: chuỗi ngày, số ngày học, số câu, đúng ngay lần đầu, giây/câu (và % trả lời dưới 3 giây), số lần mở hướng dẫn; Sức mạnh Toán 6 mạch so tháng trước; Gợi ý cho cô; cảnh báo.
  - Học tập: lịch học cả năm (bấm ô xem ngày), tiến độ SGK theo chủ đề + đảo bị kẹt, tỉ lệ đúng từng dạng bài.
  - Lỗi & bài về nhà: Sổ lỗi sai, phiếu đã giao và kết quả.
  - Hoạt động: sao, xu, thú cưng, thẻ, nhận xét, khung giờ học, hoạt động gần đây.
  - Ghi chú & giao bài: ghi chú riêng của cô (em, phụ huynh không thấy), tặng thẻ, nhận xét, **giao phiếu riêng cho 1 em**.
- Ghi thêm mỗi câu (mọi bản, kể cả bản học sinh): đúng ngay lần đầu, đúng sau khi sửa, trả lời dưới 3 giây, số lần mở hướng dẫn, khung giờ (`st.dd[ngày].f/fc/fx/fast/gd/h`).
- Phiếu bài lọc theo lớp và theo em (`a.lop`, `a.hs`).
- **Bỏ tài khoản lớp 6–9** (bản đầy đủ và bản học sinh `jenny06…09`). Dữ liệu mẫu: khối 1 (1A, 1B) và khối 2 (2A, 2B), mỗi lớp 12 em; Cô Jenny 1A, 1B · Cô Hoa 2B, 5A, 5B · Thầy Minh 2A, 3A, 4A. Dữ liệu học mẫu 5 tuần (ngày demo 36).

## 23/10/2026 — Nhiều lớp, nhiều giáo viên, trang Quản lý trung tâm
- Dữ liệu mới (`js/core/58-lop-va-quan-ly.js`): Trung tâm → Năm học → Lớp (khối, tên, gói Toán Jenny) → Học sinh (ghi danh 1 lớp chính). Giáo viên ↔ lớp nhiều–nhiều. Dữ liệu mẫu: Cô Jenny (1A, 1B), Cô Hoa (1C, 5A, 5B), Thầy Minh (2A…9A); thêm 5 học sinh mẫu.
- Giáo viên: màn đầu là **"Lớp của tôi"** (thẻ lớp theo khối: sĩ số, học hôm nay, cần chú ý, nhãn Toán Jenny). Vào lớp có nút "← Lớp của tôi" và đổi lớp nhanh. Bản thử có ô chọn tài khoản giáo viên.
- Toán Jenny **theo lớp**: em được học khi lớp có gói hoặc quản lý bật ngoại lệ. Buổi mở theo từng lớp. Bỏ thẻ "Kích hoạt Toán Jenny" ở trang giáo viên. Phiếu bài giao theo lớp.
- Vai mới **Quản lý**: tạo lớp, phân công/bỏ phân công giáo viên (bấm 2 lần), xếp và chuyển lớp (giữ dữ liệu), thêm học sinh (tự tạo tên đăng nhập), thêm giáo viên, gắn/tắt gói Toán Jenny, ngoại lệ từng em, nhật ký thao tác.
- Bản học sinh không đổi (`ORG_ON=false` trong `tools/_student.py`).

## 23/10/2026 — Trang giáo viên: tách Toán Jenny khỏi bảng tiến độ
- Bảng "Tiến độ từng em" bỏ cột Toán Jenny; cột Cảnh báo không còn mục "Chưa xong … Toán Jenny".
- Toán Jenny thành phần riêng (mở buổi + tiến độ từng em đã kích hoạt), chỉ hiện khi lớp có ít nhất 1 em đã kích hoạt. Chưa ai kích hoạt thì ẩn cả phần này và ô số liệu Toán Jenny; thẻ "Kích hoạt Toán Jenny" vẫn còn để mở.

## 23/10/2026 — Trang giáo viên tạm trên GitHub (cách 1)
- Trang mới `games/lop-hoc-ao/giao-vien/` = bản demo đầy đủ + màn mật khẩu (`giaovien123`), mở sẵn vai Giáo viên, Lớp 1. Không cho máy tìm kiếm lập chỉ mục.
- Dữ liệu là dữ liệu mẫu, lưu trên máy người xem; chưa xem được kết quả thật của học sinh (cần máy chủ — cách 2).
- `tools/build.py` tự tạo trang này cùng trang học sinh (`tools/_teacher.py`).

## 23/10/2026 — Thẻ chào gọn
- Bỏ nút "Nghe Jenny" và chữ "Đảo nhà" dưới hình Jenny (chạm hình vẫn vào Đảo nhà).
- Ô sao và ô xu thành cột 2 hàng, đặt ngay sát bên phải "Vịnh … · Lớp n" / "Chào …!" (không đẩy ra mép phải). Ô xu chỉ còn "🪙 số ▸", chạm vẫn mở Cửa hàng. Giữ dòng "Bản …".

## 23/10/2026 — Dịch "Sổ đang trống…" sang tiếng Anh
- Sổ lỗi trống (tài khoản mới) có câu tiếng Anh.

## 23/10/2026 — Đảo nhà: bố cục mới
- Khung cảnh vẽ lại: đảo cát to có bãi cỏ phía sau, mỏm đá ngoài biển, sóng, mây; giữ tỉ lệ 16:10 và phóng theo màn hình (điện thoại, máy tính đều cân).
- Mỗi đồ có chỗ hợp lý, đứng trên mặt đất: cây dừa (cỏ trái), cờ CLB (cỏ phải), hải đăng (mỏm đá ngoài biển), lâu đài cát (cát trước), ô che nắng (cát trước phải), thuyền buồm (mặt nước phải); ổ rơm, máy ấp trên bãi cỏ giữa; máng ăn bên trái; thú cưng đi lại trên bãi cát giữa. Vật ở gần (thấp) che vật ở xa.
- Cửa hàng › Đảo nhà xem trước bằng đúng bố cục này.

## 23/10/2026 — Bỏ dòng nhắc ở Mũ & kính và Khung ảnh
- Bỏ dòng "Em đeo được nhiều món cùng lúc…" và "Khung hiện quanh ảnh Jenny…" (chức năng giữ nguyên).

## 23/10/2026 — Mặt trời, mặt trăng trôi ngang trong tầm nhìn
- Biển Hoàng hôn (mặt trời) và Biển Đêm sao (mặt trăng): mặt trời/trăng luôn nằm trong phần biển đang thấy và trôi ngang chậm từ trái sang phải (khoảng 50 giây một lượt), cả khi em kéo bản đồ sang ngang.

## 23/10/2026 — Sửa mặt trời Biển Hoàng hôn chớp nháy
- Mặt trời bị đặt lại chỗ ngẫu nhiên mỗi khung hình nên nhảy lung tung, chớp nháy. Nay đặt 1 lần, đứng yên; vệt nắng dưới mặt trời lung linh chậm, nhẹ hơn. (Biển Hoàng hôn = chủ đề cuối năm mọi lớp.)

## 23/10/2026 — Dùng thật: khoá đảo, làm mới tài khoản, tài khoản thử Lê Bảo Na
- **Khoá đảo và màn** cho mọi học sinh: mở dần theo tiến độ (qua Màn 1 mở đảo sau; hạ trùm chủ đề mở chủ đề sau; màn sau mở khi qua màn trước). Xong T-01.
- **Làm mới toàn bộ tài khoản**: bản học sinh lưu khoá mới `jennyHS2_…` (xoá dữ liệu cũ), bản đầy đủ `_v10`; mọi học sinh bắt đầu từ đầu (40 xu).
- **Tài khoản thử Lê Bảo Na**: mở tất cả + 10 000 xu, có bài cô giao mẫu. Bản học sinh: đăng nhập `lebaona` / `jenny123` (hoặc tài khoản nào đặt tên đúng "Lê Bảo Na"). Bản đầy đủ: học sinh Lê Bảo Na.
- Học sinh thật không còn bài cô giao mẫu. Nút "Mở khóa tất cả" chỉ còn ở thanh demo bản đầy đủ (mặc định khoá).

## 23/10/2026 — Tủ đồ: khung không tràn, khung hiện rõ, đeo nhiều phụ kiện
- Khung ảnh vẽ vào phía trong (không tràn đè lên phần khác) ở Tủ đồ, Cửa hàng và ô chọn khung.
- Chọn khung → cả khung cảnh Jenny trong Tủ đồ có viền khung đó; ảnh Jenny ở thẻ chào (Bản đồ) cũng có khung (trước bị CSS khác che mất).
- **Đeo nhiều món cùng lúc**: 1 mũ (lưỡi trai, phù thuỷ, vương miện…) + 1 kính + 1 nơ/kẹp tóc. Chạm món đang đeo để bỏ ra; chọn mũ khác thì thay mũ cũ. Ô "Bỏ hết". Jenny ở mọi nơi (thẻ chào, câu hỏi, Cửa hàng) đeo đủ các món. Tiến độ cũ (1 món) được giữ.

## 23/10/2026 — Tủ đồ: mỗi loại đồ là một trang riêng
- Trang Tủ đồ: Jenny lớn + 3 nút Áo váy · Mũ & kính · Khung ảnh. Chạm nút → sang trang riêng của loại đó (Jenny nhỏ ở trên để xem ngay, lưới đồ, "Mua thêm …"); nút "← Tủ đồ" để quay lại.

## 23/10/2026 — Đổi tên "Gian hàng" thành "Cửa hàng"
- Tiêu đề "Cửa hàng Jenny" và mọi chỗ nhắc (Đảo nhà, máy ấp, thẻ chào…) thống nhất với nút "Cửa hàng" ở thanh dưới.

## 23/10/2026 — Cửa hàng: thử 1 dòng trượt ngang rồi bỏ
- Thầy thấy dạng trượt không ổn → trở lại 2 dòng như trước.

## 23/10/2026 — Nút chọn nhóm đồ nuôi
- **Túi đồ** (Đảo nhà) và **Cửa hàng › Đồ nuôi** có 5 nút: Thức ăn · Thuốc & tắm · Đồ chơi · Đồ mặc · Nhà & máy. Chạm nút nào hiện đồ nhóm đó; Túi đồ ghi số món mỗi nhóm, nhóm trống có nút "Mua ở Cửa hàng".
- Đảo nhà: nút xu ghi "Cửa hàng ▸" (thay "Gian hàng").

## 23/10/2026 — Bỏ "Đang có: n" ở dạng Thêm cho đủ
- Dạng "Thêm cho đủ … / Bớt" không còn hiện số đang có; Jenny cũng không đọc sẵn số đã có mà nhắc "Em đếm xem đang có mấy …" (cả màn đảo và phiếu bài).

## 23/10/2026 — Tủ đồ gọn hơn
- Bỏ 3 ô "Mua ở Cửa hàng" lặp lại ở từng mục; mục chưa có đồ hiện dòng chữ nhỏ. Chỉ giữ nút "Mua thêm đồ" cuối trang và nút xu "Cửa hàng ▸" trên cùng.
- Ô đồ không còn kéo giãn quá to trên máy tính.
- 3 mục **Áo váy · Mũ & kính · Khung ảnh** thành 3 nút trên một hàng (hiện món đang dùng và số món). Chạm nút nào thì chỉ hiện đồ của mục đó. "Mua thêm đồ" mở đúng mục đó trong Cửa hàng.

## 23/10/2026 — Chỉ dẫn thông báo
- Nút thanh dưới có số/"!" đỏ → vào trang thấy khung vàng **"Jenny nhắc em"** nói rõ việc cần làm, có nút đi tới.
- Chỗ cần chú ý **nhấp nháy viền đỏ** + nhãn **Mới**: đảo mới mở (Bản đồ), buổi Toán Jenny mới, ô Bài cô giao / Luyện lỗi / Đảo nhà (Nhà em), từng bài chưa làm (Bài cô giao). Đảo nhà liệt kê thú cưng cần gì (đói, ốm, bẩn, chưa đặt tên, trứng chưa ấp).

## 23/10/2026 — Sửa lỗi "Làm tiếp" phiếu bài
- Bấm Làm tiếp/Làm bài bị lỗi khi câu đầu là dạng kéo số vào ô (Bài 1 Tiết 3 lớp 1). Đã sửa; thử 280 lần mở/làm tiếp ở lớp 1–5 không lỗi.

## 23/10/2026 — Bài cô giao thành Phiếu bài, tách riêng khỏi đảo
- Cô chọn **1 hay nhiều tiết**, **số câu** (5–20), **hạn nộp**. Câu lấy từ kho câu các tiết đó; mỗi em cùng dạng nhưng số khác (đề lưu bằng seed, xem lại được).
- Làm kiểu vở bài tập: không tim, không trùm, không báo đúng/sai từng câu; nút **Để sau**, **Nộp bài** (hỏi lại nếu còn câu chưa làm). Thoát giữa chừng vẫn giữ bài đang làm ("Đang làm x/n" → "Làm tiếp").
- Nộp xong: trang kết quả (điểm, lời khen, từng câu đúng/sai + đáp án, cả đáp án dạng hình). Câu sai vào Sổ lỗi, không bắt luyện ngay. Nộp lần đầu +10 xu. **Không** cộng sao, không mở đảo.
- Làm lại = số mới; lưu lần đầu, lần gần nhất, lần tốt nhất.
- Trang giáo viên: khung **Giao phiếu bài** (chọn nhiều tiết, số câu, hạn); pill điểm lần đầu → tốt nhất; dòng "Dạng sai nhiều".

## 23/10/2026 — Phòng học của em
- Nhà em có khung **Phòng học của em** (dưới khung Nhà, trên Tủ đồ) với 3 ô: **Bài cô giao**, **Luyện lỗi**, **Tự luyện** (sắp có).
- **Luyện lỗi** bỏ khỏi thanh dưới; thanh dưới còn 4 nút. Nút Nhà em báo số bài chưa làm (hoặc "!" khi có lỗi cần sửa).
- **Bài cô giao**: cô giao 1 màn của 1 tiết cho cả lớp, có hạn nộp. Học sinh thấy 2 phần: "Cần làm" (bài mới nhất lên đầu, gắn Mới/Chưa làm/Chưa đạt/Quá hạn) và "Đã làm" (kết quả tốt nhất, số lần làm, kết quả lần đầu, ngày nộp). Được làm lại để cải thiện.
- Trang giáo viên (bản đầy đủ): khung **Giao bài** — chọn tiết, màn, hạn; xem kết quả từng em; xoá bài giao.

## 23/10/2026 — Trò chơi: 10 lượt/ngày
- Mỗi ngày chơi tối đa **10 lượt** (trước 5). Giá giữ nguyên.

## 23/10/2026 — Tủ đồ: phối đồ cho Jenny
- Nhà em có khung mới **Tủ đồ** (dưới 3 ô, trên Trò chơi): xem Jenny đang mặc gì, số món đang có, nút **Phối đồ ▸**.
- Trang Tủ đồ: Jenny lớn ở trên; 3 nhóm **Áo váy** (áo Hộ chiếu + áo mua), **Mũ & kính**, **Khung ảnh**. Chạm là mặc ngay và lưu; có ô "Không đội/Không khung", "Áo xanh gốc" để bỏ ra. Món đang dùng có viền xanh "Đang dùng". Chưa có món nào thì có ô "Mua ở Cửa hàng".
- Đồ cho thú cưng vẫn mặc ở Đảo nhà.
- Nút **Phối đồ ▸** thu nhỏ, đặt góc phải dưới, cùng kiểu nút "Mua thêm trò chơi".

## 23/10/2026 — Sửa theo góp ý: xà phòng, thanh mua, nút đóng hướng dẫn
- Cửa hàng › Đồ nuôi: hiện **Xà phòng (5 lần)** trong nhóm "Thuốc & tắm" (trước bị ẩn vì sai nhóm).
- Chọn món nào trong Cửa hàng thì **thanh mua nổi** hiện ngay trên thanh dưới (tên, mô tả, nút Mua/Dùng, nút bỏ chọn) — không phải kéo lên đầu trang.
- Hộp Hướng dẫn: nút **"Đóng ✕"** nền vàng, nhìn rõ (trước đó nút bị cùng màu nền nên như không có).

## 23/10/2026 — Bowling mới, Đẩy thùng 48 màn
- **Bowling** làm lại: nhìn từ sau người ném (phối cảnh), kéo bóng chọn chỗ đứng, **vuốt lên để lăn** (hướng + lực theo cú vuốt, vuốt cong = bóng xoáy), ki bay đổ dây chuyền, **STRIKE!/SPARE!** có pháo giấy, bảng điểm 5 lượt tính như bowling thật. Cúp 60/90/120 điểm (thử 240 ván giả lập ở 3 mức tay nghề).
- **Đẩy thùng**: 48 màn (8 tự vẽ + 40 sinh tự động bằng cách "kéo ngược" thùng từ đích, đã giải lại bằng máy để chắc giải được và biết số bước ít nhất). Mỗi lượt chơi 3 màn liên tiếp; Vàng = xong 3 màn với tổng bước ≤ 1,25 × ít nhất + 2; Bạc = xong 3 màn; Đồng = xong ≥ 1 màn.

## 23/10/2026 — Kho trò chơi (vé chơi game)
- Cửa hàng › **Trò chơi**: 3 trò không cần Toán — **Bowling**, **Đẩy thùng** (8 màn, đã kiểm tra giải được), **Khủng long chạy**.
- Nhà em: giữ 3 ô như cũ; thêm khung **Trò chơi** bên dưới, liệt kê các trò em đã mua để vào chơi.
- Mua trò 150 xu (kèm 10 lượt); vé 10 lượt 60 xu; lượt dùng chung; mỗi lần vào chơi = 1 lượt; tối đa 5 lượt/ngày.
- Cúp Đồng/Bạc/Vàng: Bowling 15/25/33 điểm · Khủng long 150/400/800 · Đẩy thùng theo số bước (Vàng ≤ ít nhất + 2).
- 3 cúp Vàng ở một trò → đồ hiếm: Mũ vô địch Bowling, Mũ thợ mỏ (Jenny), Khăn khủng long (thú cưng, không cũ đi).
- Bản đầy đủ: học sinh thử Lê Bảo Na có 10 000 xu để thầy kiểm tra (nạp một lần).

## 22/10/2026 — Màn "Vẽ hình" (vẽ tay)
- Thêm **màn vẽ hình** ở các đảo hình học (không thay màn cũ): lớp 1 Bài 7, Bài 9; lớp 2 Bài 26, Bài 34; lớp 3 Bài 19, Bài 20; lớp 5 Bài 25, Bài 32.
- Học sinh vẽ tay hình vuông, hình chữ nhật, hình tam giác (lớp 2–5 có thêm hình tứ giác) trên giấy chấm; 4 hình mỗi màn, 3 tim; sai 2 lần hiện chấm gợi ý.
- Phản hồi chỉ "Đúng rồi!" / "Chưa đúng" + câu động viên; có tiếng Anh khi bật EN.
- Màn này lưu sao riêng (`s.draw`), không ảnh hưởng mở khoá đảo, sao chủ đề, hộ chiếu.
- Nhận dạng: bao lồi → khớp tam giác/tứ giác → kiểm tra khép kín → góc vuông, tỉ lệ cạnh (`js/core/50-ve-hinh.js`).
- Sửa: hình chữ nhật hơi gần vuông (cạnh dài gấp 1,15–1,3 lần cạnh ngắn) giờ được chấp nhận là hình chữ nhật (trước đây bị chấm là hình vuông).

## 20/10/2026 — Sửa trò Lật thẻ ghép đôi
- Lỗi: thẻ "phép tính" có thể là câu tìm số còn thiếu (ví dụ "6 + ☐ = 14" ghép với 8, "390 = 300 + ☐" ghép với 90, "33% × 4 = ?%" ghép với 132) — nhìn như hai thẻ không cùng giá trị.
- Sửa: chỉ lấy phép tính trọn vẹn (không ô trống, không dấu =, không dấu ?) làm thẻ.
- Thêm kiểm tra `tools/test/the-ghep-doi.js`: 20 100 bộ thẻ lớp 1–5, mọi cặp đúng giá trị, không hai cặp trùng giá trị.

## 20/10/2026 — Gian hàng Jenny, Đảo nhà & thú cưng, tiếng Anh lớp 1
- **Gian hàng Jenny** (bảng giá thầy duyệt): Áo váy, Mũ kính, Khung, Đảo nhà, Thú cưng, Đồ nuôi, Vé game (sắp có). Chạm để thử miễn phí, Mua bằng xu. Vào bằng ô xu ở thẻ chào.
- Jenny đội mũ/kính đã mua ở mọi nơi; khung ảnh hiện quanh ảnh Jenny ở thẻ chào.
- **Đảo nhà của em**: chạm ảnh Jenny ở thẻ chào. Thú cưng sống trên đảo, chỉ số No/Vui/Sạch/Sức khoẻ theo ngày thật; cho ăn, tắm, chơi, chữa, mặc đồ, cưng nựng; đặt tên.
  - Nuôi 1 loài, tối đa 2 con; vòng đời ~6 tuần (Bé → Lớn dần → Trưởng thành → Già); mất khi già, có Sổ kỷ niệm; chờ 3 ngày mới nuôi con mới.
  - Bỏ đói/ốm nặng liên tục 3 ngày → thú bỏ đi (thư tạm biệt).
  - 2 con trưởng thành + Ổ rơm → có thể đẻ trứng; Máy ấp 3 ngày cho nở; trứng không ấp hỏng sau 2 ngày; bán được trứng.
  - Đồ dùng cũ dần; Túi đồ có bán thanh lý (nửa giá × độ mới). Máng ăn tự động cho ăn khi em vắng.
  - Mỗi lần qua màn, thú cưng vui thêm. Dấu ! đỏ ở ảnh Jenny khi thú cần chăm.
- Đảo nhà: bỏ hình học sinh (Jenny) trên đảo, chỉ còn thú cưng và đồ trang trí.
- Chế độ tối (MacBook): Gian hàng, Đảo nhà, Nhà em dùng màu theo chế độ tối — chữ không còn hoà vào nền.
- **Thanh dưới mới**: Bản đồ · Toán Jenny · Luyện lỗi · **Nhà em** · **Cửa hàng**. "Nhà em" mở 3 ô: Đảo nhà, Sưu tập, Hồ sơ (Hồ sơ vẫn có nút Đăng xuất).
- **Thú cưng bắt đầu 2 loài**, có mô tả và tuổi thọ: Gà con 40–50 ngày (150 xu), Rùa biển 100–200 ngày (250 xu). Các giai đoạn lớn tính theo tuổi thọ từng con.
- **Tiếng Anh lớp 1** bật: đề, lời giải, hình, hướng dẫn, bài giảng, Jenny đọc giọng Anh – Anh. Công cụ rà `tools/test/tieng-anh.js`: 0 chuỗi sót.

## 20/10/2026 — Nút Đăng xuất hiện sẵn
- Bản học sinh: bỏ ô chữ cái tên (J) và menu thả; nút **Đăng xuất** nằm ngay trên thanh trên cùng (EN: Log out).
- Màn rất hẹp (≤440px): ẩn chữ "Toán cùng Jenny", giữ ngôi sao để vừa hàng.
- Sửa chế độ tối: hộp Hướng dẫn luôn nền sáng, chữ xanh đậm (trước đây chữ trắng trên nền kem, rất khó đọc).
- Tên tạm **JennyClub** + logo đám mây pixel (chữ J ba màu logo Clb), chữ "Jenny" nhiều màu, nhãn "Club" xanh lá; điện thoại: chữ xếp 2 dòng.
- Nút Đăng xuất kiểu pixel: khung viền khía góc, bóng đổ, chữ VT323, biểu tượng cánh cửa pixel; bấm lún xuống.
- Thêm khung dịch tiếng Anh (48, 48b) — chưa bật, chờ dịch xong lớp 1.

## 2026-10-20 — Nút Đăng xuất dễ tìm hơn
- Ô chữ cái tên có thêm dấu ▾ để biết chạm vào sẽ mở bảng (có nút Đăng xuất).
- Cuối trang Hồ sơ có thêm nút Đăng xuất.
- Lưu ý: bản đầy đủ (giáo viên/phụ huynh/demo) không có đăng nhập nên không có Đăng xuất; chỉ bản học sinh có.

## 2026-10-20 — Đầu trang gọn; nút ngôn ngữ VI | EN (giai đoạn 1: giao diện)
- Bản học sinh: thanh trên cùng chỉ còn "Toán cùng Jenny" (ngôi sao), nút [VI | EN], nút nhạc và ô chữ cái tên. Chạm ô tên mở bảng nhỏ: tên, lớp, tài khoản, nút Đăng xuất (đỏ). Bỏ hình đại diện, tên, lớp lặp với thẻ "Chào".
- Nút VI | EN (cả bản đầy đủ): EN đổi chữ giao diện — thanh điều hướng, nút bấm, thông báo đúng/sai, kết thúc màn, hướng dẫn, nhắc luyện lỗi, Hồ sơ, Sưu tập, trang đảo (phần khung). Lựa chọn được nhớ trên máy.
- Chưa dịch (giai đoạn 2, làm theo từng lớp): đề bài, tên chủ đề, tên đảo, bài giảng, lời Jenny đọc.

## 2026-10-20 — Bắt buộc luyện lỗi trước khi chơi tiếp; bản đồ về "Đang học"
- Câu sai trong màn học hoặc trò chơi được ghi lại. Xong màn/trò đó, muốn vào màn hay trò khác thì Jenny nhắc "Em vừa làm sai n câu. Mình luyện lại một lượt rồi chơi tiếp nhé!" kèm nút "Luyện ngay". Màn hình kết thúc có thêm dòng nhắc và nút "Luyện lỗi (n)" đứng đầu.
- Lượt luyện chỉ gồm các câu vừa sai (≤ 3 lỗi: mỗi lỗi câu cũ + 1 câu giống vậy; nhiều hơn: mỗi lỗi 1 câu cũ). Làm hết lượt là mở khoá; có hướng dẫn khi sai như Luyện lỗi. Lỗi chưa đúng 2 lần liền vẫn nằm trong sổ để luyện tiếp sau.
- Bản đồ: đi từ tab Toán Jenny, Luyện lỗi, Sưu tập, Hồ sơ về thì màn hình đặt đúng chỗ "Đang học"; từ trong đảo về thì về đúng đảo vừa vào.

## 2026-10-20 — Rà soát khung hình và cân bằng hai chiều câu hỏi
- So sánh qua hình ("Chọn dấu đúng: 5 … 4"): hai nhóm luôn nằm ngang hàng hai bên dấu "…", đồ vật tự thu nhỏ cho vừa.
- Hai hàng ghép đôi (bóng bay – cá…): mỗi đồ vật nằm trong một ô cùng bề rộng nên thẳng cột từng cặp, cả khung luôn vừa màn hình 360px.
- Bảng số liệu, biểu đồ tranh trong màn chơi (lớp 2–5): không còn tràn ra ngoài màn hình (trước bị bảng chung của trang giáo viên ép rộng 640px); đủ viền mọi ô; hình trong ô thu nhỏ cho vừa.
- Lớp 1 "Chạm vào khung có … nhất": một nửa hỏi ít nhất, một nửa hỏi nhiều nhất. Lớp 2 "Loại đồ vật nào có …": nhiều nhất hoặc ít nhất.
- Mọi bài sắp xếp (lớp 1–5, số, phân số, số thập phân, số đo): một nửa hỏi "từ bé đến lớn", một nửa "từ lớn đến bé".
- Bài "… nào lớn nhất?" / "… nào bé nhất?" (kết quả phép tính, phân số, số…): một nửa đổi chiều khi tính được giá trị các phương án.
- Thêm công cụ rà khung hình: mọi dạng câu của lớp 1–5 được dựng ở khổ 360px, kiểm tra phần tử tràn màn hình, tràn khung, hai nhóm so sánh không ngang hàng.

## 2026-10-20 — Hướng dẫn bài dùng tính chất
- "Biết 1 + 7 = 8. Vậy 7 + 1 = ?" (lớp 1) và "a + b = b + ☐" (lớp 4): không hướng dẫn cách cộng nữa mà nhắc tính chất. Hai phép tính tô cùng màu cho cùng một số, mũi tên ⇄; Jenny nói "Đổi chỗ các số hạng thì tổng không đổi. Không cần tính lại!"; hỏi trắc nghiệm rồi chốt "7 cộng 1 cũng bằng 8".
- "Biết 2 × 10 = 20. Vậy 20 : 2 = ?" (lớp 2): "Từ một phép nhân viết được hai phép chia — lấy tích chia cho thừa số này thì được thừa số kia".

## 2026-10-20 — Bàn tay: đếm lần lượt từ trái sang phải
- Hướng dẫn bằng bàn tay (lớp 1): giơ ngón như cũ (trỏ, giữa, áp út, út, cái), nhưng khi đếm thì đếm các ngón đã giơ lần lượt từ trái sang phải trên màn hình. Đếm thêm: giơ các ngón mới cùng lúc (viền vàng) rồi đếm tiếp từ trái sang phải. Phép trừ: gập và đếm số ngón gập cũng từ trái sang phải, rồi đếm số ngón còn lại.
## 2026-10-20 — Hướng dẫn chỉ có trong Luyện lỗi; lỗi trò chơi vào sổ; thêm 3 dạng đếm
- Thống nhất với thầy: màn học và trò chơi không hiện hướng dẫn, học sinh làm/chơi bình thường; câu sai lần đầu được ghi vào sổ lỗi kèm đúng câu đó và đáp án em đã chọn/ghi.
- Lỗi trong trò chơi (Ếch nhảy, Thả mồi, Trồng cây, Leo núi, Đập chuột…) cũng được ghi vào sổ lỗi, có tên trò.
- Luyện lỗi: câu 1 là đúng câu em đã sai, có dòng "Lần trước em chọn 8, chưa đúng. Em làm lại nhé!"; câu 2 là câu giống vậy với số mới. Có nút "Xem cách làm" để xem trước. Sai thì hướng dẫn tự mở ngay; xem xong làm lại câu đó (không tính vào sửa lỗi). Đúng 2 lần liền thì lỗi ra khỏi sổ như cũ. Thẻ "Chưa đúng" trong Luyện lỗi không còn ghi "mất 1 tim".
- Thêm hướng dẫn đếm lớp 1: tìm khung có đúng số lượng (đếm từng khung, ghi số dưới khung, khung đúng tô xanh); xếp hình bằng hình vuông (đánh số từng ô); đếm khối lập phương (đếm từng cột, từ dưới lên, ghi "2 + 2 = 4").
- Chỉ lưu lại nguyên câu cũ cho 30 lỗi gần nhất để không đầy bộ nhớ máy; lỗi cũ hơn thì luyện bằng câu cùng dạng.

## 2026-10-20 — Hướng dẫn khi đếm sai (lớp 1)
- Bài "Có mấy …?" và "Có mấy hình …?" trong phạm vi 10: hướng dẫn khoanh lần lượt từng đối tượng bằng vòng pixel đỏ, đánh số 1, 2, 3… ngay góc vòng, Jenny đếm to; đối tượng cuối cùng được khoanh là số cần tìm.
- Jenny nhắc cách đếm: từ trái sang phải, từ trên xuống dưới, đếm cái nào khoanh cái đó để không sót, không đếm hai lần.
- Đếm hình: các hình khác loại được làm mờ, chỉ khoanh đúng loại hình được hỏi.

## 2026-10-20 — Hướng dẫn khi làm sai · Lô 2a đã bật
- Đặt tính có nhớ (lớp 2–4): cộng, trừ, nhân với số có một chữ số. Bảng có hàng C, Đ (Tr, N); cột đang tính sáng vàng; câu trắc nghiệm ở hàng có nhớ đầu tiên; cộng: số nhớ đỏ trên hàng bên trái; trừ: số 1 nhớ đỏ nhỏ cạnh chữ số của số trừ ("2 thêm 1 bằng 3").
- So sánh số (lớp 1–4): chỉ dùng bảng hàng (N, Tr, C, Đ). Hàng bằng nhau tô xanh, hàng khác nhau tô vàng; hỏi "số nào lớn hơn?" rồi chọn dấu.
- Bảng nhân, bảng chia (lớp 2–3): dãy đếm thêm cách đều (5, 10, 15, 20), chia đều các dòng (8 số → 4 + 4, 7 số → 4 + 3), hai dòng tách rời, chỗ số chưa hiện được giữ sẵn để dãy không xô lệch; ghi số lần đếm; chia là đếm thêm số chia đến số bị chia rồi đếm số lần.
- Câu tương tự cho dạng "Đặt tính rồi tính" so cả phép tính trong hình, không chỉ chữ đề.
- Bài có dư không dùng câu hỏi gợi ý lời văn (để Lô 2b).

## 2026-10-20 — Số bản; đơn vị trong lời giải leo núi; câu tương tự đúng chiều; khung Lô 2a (chưa bật)
- Thẻ chào trên bản đồ có dòng nhỏ "Bản ngày/tháng · giờ:phút" (thời điểm dựng), để biết đang mở bản mới hay cũ.
- Leo núi: phép tính cuối của lời giải có đơn vị, ví dụ "29 + 24 = 53 (cái bánh)".
- Hướng dẫn khi sai: câu tương tự giữ đúng chiều câu vừa sai (cùng phép tính, cùng chỗ trống, cùng kiểu thêm/bớt, nhiều hơn/ít hơn).
- Lô 2a (đặt tính có nhớ, so sánh số, bảng nhân chia): đã dựng hoạt cảnh, đang chờ thầy duyệt nên chưa bật (GD_EXT .on = false).

## 2026-10-20 — Sơ đồ: tổng dùng móc nhọn dọc, hiệu dùng móc nhọn ngang
- Hiệu – tỉ và tổng – hiệu: phần dài hơn của đoạn lớn tô hồng, phía trên có móc nhọn ngang ôm đúng phần đó, ghi "Hiệu: …".
- Móc nhọn tổng khớp đúng mép trên đoạn lớn và mép dưới đoạn bé.
- Sơ đồ tổng – hiệu, tổng – tỉ: thay đường ngang bằng móc nhọn dọc "}" bên phải ôm cả hai đoạn, chữ "Tổng: …" đứng cạnh mũi móc, giống cách vẽ trong sách.

## 2026-10-20 — Hướng dẫn khi làm sai (Lô 1); số sao chủ đề cạnh tên vùng biển
- Sai lần 1: thẻ "Chưa đúng" có thêm nút "Xem hướng dẫn". Sai lần 2: hướng dẫn tự mở. Xem xong, em làm lại đúng câu đó (không mất tim), đúng thì làm thêm 1 câu tương tự (+2 xu). Chỉ trong màn học và Luyện lỗi; Đua giờ, Kho báu, Trùm lớp không có.
- Khung hướng dẫn: hoạt cảnh pixel chạy từng bước, Jenny đọc lời, nút Xem lại, Chậm hơn, Em làm lại.
- Lớp 1, cộng/trừ trong phạm vi 10: hai bàn tay ngửa. Cộng gộp (mỗi tay một số, đếm hết), đếm thêm từ số lớn (ngón mới viền vàng, số đỏ), trừ gập bớt (ngón đang gập viền đỏ, ▼) rồi đếm số ngón còn lại, tìm số còn thiếu.
- Lớp 2, cộng/trừ trong phạm vi 20: ếch nhảy trên tia số. Qua 10 thì hỏi trắc nghiệm "thêm/lùi mấy để về 10?", nhảy tới 10 rồi nhảy tiếp; có 2 khung 10 ô. Câu có ô trống thì đếm số bước nhảy.
- Toán có lời văn (lớp 2–5, cả lớp 1 với số lớn hơn 10): tô vàng các số, gạch chân câu hỏi; từng bước hỏi trắc nghiệm "Cần làm phép tính gì?" và "Phép tính đúng là?", chọn sai thì Jenny gợi ý từ khoá.
- Tổng – hiệu (lớp 4), tổng – tỉ, hiệu – tỉ (lớp 5): sơ đồ đoạn thẳng pixel và 3–4 câu trắc nghiệm theo các bước giải.
- Chỉ hiện hướng dẫn khi đọc được chắc chắn phép tính trong lời giải (khoảng 3 000 dạng câu). Bài có %, phân số ở kết quả hoặc đổi đơn vị chưa có hướng dẫn (để Lô 2).
- Bản đồ: dòng 2 của mỗi chủ đề là [vùng biển] [★ số sao]; dòng 3 là "Bài … · … đảo · trùm …". Đủ sao thì nhãn sao xanh lá.

## 2026-10-19 — Bỏ chữ "Hệ …" sau tên trùm
- Tên trùm không còn đuôi "· Hệ Kẹo ngọt", "· Hệ Độc", "· Hệ Lửa"… (bản đồ, đảo, trận trùm). Màu trùm theo vùng biển vẫn giữ.

## 2026-10-19 — Tên chủ đề trên bản đồ: cùng cỡ chữ, tối đa 2 dòng
- Mọi chủ đề cùng một cỡ chữ (24px). Dòng 1 của tên nằm ngay cạnh nhãn "CHỦ ĐỀ n"; tên dài xuống dòng 2. Riêng tên dài hơn 2 dòng thì nhỏ bớt vừa đủ 2 dòng (hiện chỉ lớp 3 chủ đề 5 trên điện thoại hẹp).

## 2026-10-19 — Leo núi: lời giải gọn
- Khung lời giải chỉ còn câu dẫn và các phép tính; bỏ chữ "Bài giải" và dòng "Đáp số" (cả phần Jenny đọc).

## 2026-10-19 — Leo núi: bài giải có câu dẫn, chờ em đọc xong; Thả mồi xoá thông báo cũ
- Leo núi: sai 2 lần thì hiện khung "Bài giải" (chỉ một lần chữ này), có câu dẫn dựng từ câu hỏi (vd "Số quyển vở cửa hàng có là:"), từng phép tính một dòng, "Đáp số" có đơn vị. Jenny đọc bài giải.
- Không tự chuyển bài nữa: đồng hồ dừng, em bấm "Em hiểu rồi, leo tiếp ▶" mới sang bài mới. Chữ trong khung dùng phông dễ đọc có dấu.
- Thả mồi câu cá: thả mồi mới thì thông báo đúng/sai của câu trước biến mất.

## 2026-10-19 — Leo núi 5 chặng có khởi động; bản đồ quay lại đúng chủ đề
- Leo núi còn 5 chặng: 3 chặng đầu là bài khởi động rất đơn giản (một phép tính đã học, số nhỏ), 2 chặng sau là bài lời văn của tiết như trước.
- Bản đồ: vào đảo của chủ đề nào (hoặc chạm thẻ chủ đề nào) thì khi quay lại bản đồ sẽ ở đúng chủ đề đó, biển cuộn tới đúng đảo vừa vào.

## 2026-10-19 — Trò mới: Leo núi tìm kho báu
- Trò cho các tiết toán có lời văn. Jenny đeo ba lô leo núi 6 chặng. Mỗi bài toán giải đúng, Jenny leo dây lên trại kế tiếp, hiện "Chặng n/6 ✓". Lên cao: mây ở dưới, đại bàng bay qua, gần đỉnh có tuyết, trời ngả hoàng hôn.
- Sai 1 lần: đá lăn, "Cẩn thận!", đáp án sai bị khoá. Sai 2 lần: Jenny nghỉ ở trại, hiện đáp án đúng và lời giải ngắn, sang bài khác, không mất chặng nào. Không có tim, 300 giây.
- Lên đỉnh: mở rương báu (vàng, đá quý), pháo giấy, nhận huy hiệu "Nhà leo núi".
- Đề là bài lời văn của chính tiết, thiếu thì lấy của 1–4 tiết trước, luôn trong kiến thức đã học. Lớp 1–2 Jenny tự đọc đề, lớp 3–5 bấm loa để nghe.
- Có ở khoảng 27–47 đảo mỗi lớp (đảo có bài lời văn). Chia trò gộp về một chỗ, mỗi trò có bảng ưu tiên riêng theo lớp.

## 2026-10-19 — Trồng cây: vẽ lại Jenny tưới và cây lớn
- Jenny cầm bình đứng chờ; trả lời đúng thì bước tới luống, nghiêng bình, tia nước vòng cung rơi xuống gốc khoảng 1 giây, đất ướt, nước bắn; xong quay về. Đúng thì Jenny nhảy vui, sai thì mặt lo.
- Cây vẽ lại có viền và bóng, to hơn (cuối cùng cao gần nửa khung). 9 bậc khác nhau rõ: hạt trong hố → mầm 2 lá → 2 lá thật → cây non → cây cao (mưa, cầu vồng) → nụ → hoa → quả xanh → quả chín.
- Mỗi loài một dáng: táo tán tròn, cam tán dày, xoài tán cao và quả dài, dâu tây là bụi thấp quả treo, hướng dương thân cao bông to. Mỗi lần lớn có hiệu ứng phóng to và lấp lánh.
- Giữ nguyên cách chơi, giờ, điểm, cỏ dại, ốc sên, thu hoạch (`core/39k2-trong-cay-ve.js`).

## 2026-10-19 — Trò mới: Trồng cây
- Trò chuyển cảnh như Ếch nhảy: mỗi câu trả lời đúng, Jenny cầm bình tưới cây một lần (bình nghiêng, giọt nước rơi, lấp lánh), cây lớn thêm một bậc và hiện "Lần tưới n/8 ✓". Cây lớn qua 9 bậc: hạt → nảy mầm → hai lá → cây non → cây cao có cành → nụ → hoa nở → quả xanh → quả chín, rồi quả rơi vào giỏ.
- Cảnh đổi dần: sáng → trưa → chiều; có mưa rào và cầu vồng khi cây có cành; bướm, ong bay, mây trôi, hoa cỏ lay.
- Sai 1 lần: cây rũ xuống, mọc cỏ dại, thử lại. Sai 2 lần: ốc sên gặm lá, lượt đó cây không lớn, hiện đáp án đúng rồi sang câu khác. Không mất bậc đã lớn, không có tim.
- Mỗi đảo một loài cây: táo, cam, xoài, dâu tây, hướng dương. Ưu tiên lớp 1–2 (35 và 50 đảo), lớp 3–5 khoảng 22–25 đảo. Câu hỏi không vượt kiến thức đã học.

## 2026-10-19 — Trò mới: Thả mồi câu cá
- Cảnh pixel động: Jenny ngồi trên cầu gỗ cầm cần câu, hồ nước, lau sậy, mây, thùng cá. Chạm "Thả mồi" → dây quăng vòng cung, phao rơi xuống nước, chờ 1–3 giây, bóng cá bơi tới, phao chìm "Cá cắn câu!" → hiện câu hỏi (cùng nguồn câu đã lọc kiến thức như Ếch nhảy).
- Đúng: kéo cá lên, cá bay vào thùng, bảng "Con cá n/8 ✓". Sai 1 lần: cá giãy, đáp án sai bị khoá. Sai 2 lần: cá chạy mất, hiện đáp án đúng, thả lại mồi. Không mất tim. Câu đủ 8 con hoặc hết 120 giây thì kết thúc.
- Mỗi con cá trời đổi dần từ sáng tới hoàng hôn, mặt trời đi theo vòng cung; có vịt, rùa bơi ngang ở vài lượt. Có ở khoảng 26–46 đảo mỗi lớp (`core/39j-tha-moi-cau-ca.js`).

## 2026-10-19 — Sửa cá nhấp nháy
- Câu cá: hai khung vẫy đuôi gộp thành một tấm ảnh, đổi khung bằng cách dịch nền theo bước nên cá không còn nhấp nháy.

## 2026-10-19 — Cá pixel mới, nhãn phép tính một dòng
- Câu cá: vẽ lại cá pixel (6 màu) với 2 khung hình vẫy đuôi, nhấp nhô; nhãn (số, phép tính, tên đồ vật) luôn nằm trong khung trắng dưới bụng cá, không che cá.
- Nhãn phép tính dài (ví dụ "50 cm + 50 cm") không còn bị xuống dòng: chữ tự thu nhỏ cho vừa một dòng trong biển chuột, bóng bay, sao, cá. Chỉ phép tính rất dài (ví dụ "85 000 + 15 000") mới xuống 2 dòng gọn tại dấu phép tính, không tách số. Đã kiểm tra gần 10 000 nhãn ở 5 lớp.

## 2026-10-19 — Cá bơi, bóng đung đưa
- Câu cá: cá uốn mình vẫy đuôi khi bơi, nhịp mỗi con khác nhau, nhả bọt nước phía sau. Bóng bay: bóng đung đưa qua lại, phồng xẹp nhẹ, dây lắc theo; nhãn số lắc theo bóng. Tắt hiệu ứng khi máy bật "giảm chuyển động".

## 2026-10-19 — Cửa hàng Jenny: chậm lại, chỉ quầy hàng chuyển, tiền có màu như thật
- Sửa nút "Đưa lại", "Trả tiền" bị mất viền dưới (khung cửa hàng cắt mất bóng viền).
- Chuyển lượt chậm hơn (khoảng 3 giây): bảng "Khách n/8 ✓ Cảm ơn!" hiện đủ lâu để đọc. Chỉ phần quầy hàng (mái che, kệ, câu hỏi) trượt đi và trượt vào; phần "Em đưa", ví tiền, nút Đưa lại, Trả tiền đứng yên.
- Tờ tiền có màu gần với tiền Việt Nam thật (1 000 tím, 2 000 nâu, 5 000 xanh lam, 10 000 vàng xanh, 20 000 xanh dương, 50 000 hồng tím, 100 000 xanh lá, 200 000 đỏ nâu, 500 000 xanh ngọc; 100/200/500 đồng nâu ô liu / nâu cam / hồng đỏ); dùng cùng màu cho tờ tiền trong bài học lớp 2.

## 2026-10-19 — Nhãn dài không che hình
- Câu cá, Bóng bay, Hứng sao, Đập chuột, Ếch nhảy, Tàu hoả: nhãn được xếp theo độ dài. Tên đồ vật (ví dụ "Hộp sữa tươi") thành thẻ tên 2 dòng đặt dưới con cá / ngôi sao (cá to hơn), trong lòng bóng bay thì xuống dòng, chữ nhỏ lại; phép tính dài ("3 cm + 11 cm") chữ nhỏ lại. Đã rà các đảo có nhãn dài ở cả 5 lớp (khoảng 120 đảo mỗi trò).

## 2026-10-19 — Cửa hàng Jenny: chuyển lượt rõ ràng
- Mỗi lượt là một quầy khác (Quầy bánh, Sạp trái cây, Tiệm đồ chơi, Hiệu sách, Quầy kem, Tiệm hoa, Sạp rau, Quầy nước) với mái che, màu, tên quầy và số khách "Khách n/8". Trả đúng: tiền bay vào máy tính tiền (ting!), món hàng nhảy vào túi, bảng "Khách n/8 ✓ Cảm ơn!", quầy cũ trượt sang trái, quầy mới trượt vào từ bên phải.

## 2026-10-19 — Ghép hình: vẽ khối chính xác
- Khối trụ: mặt đáy trên là elip đủ, hai đường sinh thẳng, nửa elip đáy dưới (nửa sau nét đứt), có bóng sáng tối. Khối lập phương, khối hộp chữ nhật: đủ mặt trước, mặt trên, mặt bên và các cạnh; hình lớn có cạnh khuất nét đứt. Khối cầu: có bóng, đốm sáng và đường xích đạo (trước nét liền, sau nét đứt) để phân biệt với hình tròn.

## 2026-10-19 — Ếch nhảy: chuyển hàng rõ ràng
- Trả lời đúng: hiện bảng "Hàng n/8 ✓", lá súng mang ếch trôi xuống thành chỗ đứng mới, các lá khác trôi đi, nước cuộn, rồi hàng lá mới trôi vào từ phía trên. Mỗi hàng có cảnh khác nhau (đá, khúc gỗ, rùa, vịt, chuồn chuồn, khóm sen; nước sâu dần ở giữa sông); hàng đầu đứng trên bãi cỏ, các hàng sau đứng trên lá súng; bờ đích có cờ chỉ hiện khi gần tới.

## 2026-10-19 — Bối cảnh sống động cho mọi trò chơi thêm
- Mỗi màn có thêm lớp trang trí pixel chuyển động (`core/39g-boi-canh-song-dong.js`), không che vật chơi, tự dừng khi rời màn: Câu cá (tia nắng, rong rêu đung đưa, bong bóng, cá xa bơi), Bóng bay (mặt trời toả tia, mây 2 lớp trôi, chim vỗ cánh, cỏ cây lay), Hứng sao (sao nhấp nháy, sao băng, đồi xa, đom đóm), Đập chuột (mây trôi, cỏ lay, hoa đung đưa, bướm bay), Ghép hình (mây, mặt trời, vạch đường chạy, cờ bay), Cân (tường có cửa sổ mây trôi, đèn trần đung đưa, chậu cây treo), Cửa hàng (mái hiên phấp phới, chim nhỏ chớp mắt, thẻ giá đung đưa), Tàu hoả (mây và hàng cây trôi, chim, khói tàu), Kéo co (bụi dưới chân, dây rung), Đua giờ, Lật thẻ, Đồng hồ (dải biển nhỏ có mây và sóng). Máy bật "giảm chuyển động" thì chỉ hiện khung tĩnh.
- Sửa: bấm "Ghép hình pixel" có lúc chưa hiện màn chơi.

## 2026-10-19 — Ao ếch sống động
- Ếch nhảy: mặt nước lấp lánh trôi, cá nhỏ bơi qua lại dưới nước, gợn sóng; lau sậy và cỏ hai bờ đung đưa; hoa sen, lá súng nhấp nhô; cờ đích bay. Câu hỏi đầu lớp 1 dùng bể cá ("Bể có mấy con cá?").

## 2026-10-19 — Lật thẻ, Ếch nhảy lớp 1: bể cá thay chấm tròn
- Ở các đảo chưa học phép tính, thẻ và câu hỏi dùng bể cá pixel có 0–5 con cá (bể trống là 0) thay cho chấm tròn: "Bể có mấy con cá?". Lời hướng dẫn Lật thẻ đổi thành "ghép bể cá với số con cá".

## 2026-10-19 — Lời Jenny khớp luật trò chơi
- Câu cá, Bóng bay, Hứng sao, Đập chuột: Jenny đọc đúng dòng luật đang hiện trên màn hình (ví dụ "Em hứng sao mang số 4 nhé."). Đã kiểm tra 909 lượt ở 5 lớp, không còn chỗ lệch.

## 2026-10-19 — Chơi thêm không vượt kiến thức của bài
- Mỗi lớp có "dòng kiến thức": học tới đảo nào thì biết những gì (phép cộng, trừ, nhân, chia, so sánh, phân số, số thập phân, tiền, giờ, đơn vị đo, tên hình, số lớn nhất đã học). Lớp sau mang theo kiến thức lớp trước (`core/39e-kien-thuc-tro-choi.js`).
- Trò chỉ mở ở đảo khi đủ kiến thức; nội dung được nắn theo bài: Lật thẻ và Ếch nhảy lấy câu của chính đảo, rồi vài đảo ngay trước; chưa học phép tính thì ghép "nhóm chấm ↔ số" (ví dụ lớp 1 Số 0–5). Phép cộng chỉ xuất hiện từ bài Phép cộng, phép trừ từ bài Phép trừ.
- Câu cá, Bóng bay, Hứng sao, Đập chuột: luật của chủ đề vượt bài thì đổi sang luật hợp bài (chọn số 3; số lớn hơn 6 khi đã học so sánh; phép cộng có kết quả bằng 8 khi đã học cộng…).
- Tàu hoả chỉ có từ bài So sánh; Cửa hàng chỉ có từ bài Tiền (lớp 1 không có), giá không vượt số đã học; Đồng hồ lớp 1 chỉ giờ đúng; Ghép hình chỉ dùng hình đã học; Cân không dùng phép tính chưa học.
- Chọn 3 trò mỗi đảo: ưu tiên trò luyện đúng nội dung của đảo, rồi chia đều trong lớp. Kết quả cố định.
- Kiểm tra mới `tools/test/kien-thuc-tro-choi.js`: trước sửa 159 cặp đảo–trò vượt kiến thức (lớp 1: 55), sau sửa 0.

## 2026-10-19 — Ếch nhảy: hiệu ứng nhảy, rơi, bơi về bờ
- Chạm lá súng: ếch nhảy vòng cung từ bờ lên lá đó. Đúng thì đứng trên lá rồi sang hàng mới. Sai thì lá chìm, ếch rơi xuống nước (bọt bắn, mất tim), rồi bơi về bờ (thấy đầu ếch, có gợn sóng); về tới bờ mới chọn lá khác được (`core/39d-ech-nhay.js`).

## 2026-10-19 — Cân lại trò chơi thêm lớp 4–5
- Lớp 4–5: mỗi đảo giữ trò bắt buộc theo nội dung (Ghép hình, Cửa hàng, Cân), rồi lấp đủ 3 trò bằng trò phù hợp đang ít dùng nhất (`core/39c-can-bang-tro-choi.js`). Mỗi trò nay có ở khoảng 35–49 đảo; Đập chuột lớp 5 giảm từ 88 xuống 48; Ghép hình lớp 4 tăng từ 6 lên 16 (thêm đảo Luyện tập, Ôn tập của chủ đề hình học).

## 2026-10-19 — Chơi thêm đợt 3
- Đập chuột chũi: chuột thò lên từ 9 hang, cầm biển số; đập con đúng luật của đảo (+1, búa, sao nổ), đập sai mất tim. Chuột trốn nhanh dần. 60 giây, 3 tim.
- Ếch nhảy lá súng: hồ sen pixel, 3 lá súng mang đáp án cho câu của đảo; chọn đúng thì ếch nhảy lên, sai thì ếch rơi xuống nước và mất tim. Qua 8 hàng là thắng. Có ghi vào Sức mạnh Toán.
- Ghép hình pixel (đảo hình học): bức tranh rô-bốt, tên lửa, xe ô tô có chỗ trống nhấp nháy; chọn đúng hình (hình vuông, tròn, tam giác, chữ nhật; khối lập phương, hộp, trụ, cầu; góc vuông, nhọn, tù, bẹt; bình hành, thoi, thang — theo lớp và bài). Đủ tranh thì bừng màu. 2 tranh, 3 tim. Ghi vào trục Hình học.
- Cửa hàng Jenny có thêm ở lớp 1–3 (đảo Luyện tập, Ôn tập, bài lời văn); lớp 1 trả tiền chẵn nghìn từ 1 000 đến 10 000 đồng.

## 2026-10-19 — Cân thăng bằng: đồ hoạ pixel
- Vẽ lại cân bằng pixel (`core/38b-can-pixel.js`): đế bậc thang, cột gỗ, trục vàng, đòn cân nghiêng theo từng bậc, xích và đĩa cân hình bát; quả cân và vật bên trái là hình pixel. Lệch ít vẫn nghiêng rõ; cân bằng thì trục và đĩa chuyển xanh, có dấu "=" nhấp nháy.

## 2026-10-19 — Chơi thêm: 3 trò mới (đợt 2)
- **Cân thăng bằng**: chạm quả cân để đặt lên đĩa phải (chạm lại để bỏ), cân nghiêng theo từng quả, bấm "Cân!" khi hai bên bằng nhau. Bên trái là số hoặc phép tính (lớp 1 ≤ 10, lớp 2 ≤ 100, lớp 3 ≤ 1 000, lớp 4–5 lớn hơn); ở đảo khối lượng dùng kg, g, yến, tạ. Sai thì cân tự đặt lại cách đúng cho em xem. 8 lượt, 3 tim.
- **Cửa hàng Jenny**: chạm tờ tiền trong ví để trả đúng giá món hàng (chạm tờ đã đưa để lấy lại). Lớp 2 dùng tờ 100–1 000 đồng; lớp 3 đến 100 000 đồng và thêm câu "cô trả lại bao nhiêu"; lớp 4–5 thêm mua 2–3 món và giảm giá. 8 lượt, 3 tim.
- **Tàu hoả xếp số**: chạm các toa theo thứ tự từ bé đến lớn (hoặc từ lớn đến bé) để nối vào đầu tàu, chạm toa cuối để tháo; đúng thì tàu chạy đi. Số theo lớp và bài: lớp 1 đến 5, 10 hoặc 100; lớp 2 đến 1 000; lớp 3–4 số có 5–6 chữ số gần nhau; lớp 4–5 phân số, số thập phân. 6 lượt, 3 tim.
- Đảo học tiền luôn có Cửa hàng Jenny, đảo học khối lượng luôn có Cân thăng bằng; các đảo khác nhận trò mới theo nội dung, vẫn 2–3 trò mỗi đảo. Kết quả vào Hồ sơ: Cân → Phép tính (đảo khối lượng → Đo lường), Cửa hàng → Đo lường (mua nhiều món → Lời văn), Tàu hoả → Số.

## 2026-10-19 — Chơi thêm: 4 trò mới (đợt 1)
- **Hứng sao rơi**: di giỏ (kéo, chạm hai bên hoặc phím mũi tên) hứng sao có số đúng luật của đảo, 60 giây, 3 tim, nền trời đêm.
- **Lật thẻ ghép đôi**: 12 thẻ (6 cặp) ghép phép tính với kết quả, lấy từ câu của đảo (thiếu thì tự tạo phép tính hợp lớp), 90 giây, lật sai không mất tim.
- **Kéo co với trùm**: trả lời câu của đảo, đúng thì kéo dây về phía Jenny, sai hoặc đứng yên 6 giây thì trùm kéo lại; 90 giây.
- **Đồng hồ thần kì** (chỉ ở đảo học xem giờ): kéo kim hoặc bấm +/− cho đúng giờ, 8 lượt, 3 tim; lớp 1 giờ đúng, lớp 2 giờ rưỡi, 15 phút, 5 phút, lớp 3 trở lên đúng từng phút.
- Mỗi đảo hiện 2–3 trò chơi thêm, chọn theo nội dung tiết và cố định theo đảo, để mỗi đảo một khác. Kết quả các trò được ghi vào Hồ sơ (Chuỗi ngày chăm chỉ; Kéo co và Đồng hồ còn vào Sức mạnh Toán).

## 2026-10-19 — Thông báo trên thanh điều hướng
- Bản đồ: hiện số đảo vừa mở mà em chưa vào (tính theo tiến độ thật).
- Toán Jenny: hiện số buổi cô mới giao; nếu chưa kích hoạt (bản miễn phí) thì icon mờ kèm ổ khoá.
- Sưu tập: hiện số món mới (thẻ sinh vật, dấu hộ chiếu) em chưa xem.
- Số đỏ + rung nhẹ giống Luyện lỗi; tự mất khi em vào xem. Lưu ở `st.seen` (`core/36-thong-bao.js`).

## 2026-10-19 — Sổ lỗi sai lên thanh điều hướng
- Số lỗi nằm gọn trong thanh điều hướng, không bị che trên điện thoại.
- Bỏ thẻ Sổ lỗi sai trên bản đồ. Khi có lỗi cần sửa, icon Luyện lỗi ở thanh dưới hiện số lỗi và rung nhẹ.

## 2026-10-19 — Biển đầy khung, bỏ thẻ trùng
- Chủ đề ít đảo trên màn hình rộng (laptop): biển tự kéo đầy khung, các đảo nằm giữa; tự chỉnh lại khi đổi cỡ cửa sổ.
- Bỏ thẻ "Cô vừa mở Toán Jenny" trên bản đồ (đã có ở tab Toán Jenny).

## 2026-10-19 — Hồ sơ của em (lớp 1–5)
- Tab mới **Hồ sơ** ở thanh dưới (icon bảng có đường đi lên), giữ nguyên các icon cũ.
- **Chuỗi ngày chăm chỉ**: mỗi ô là 1 ngày của năm học 2026–2027 (từ 05/09 đến 31/05), có tên tháng; màu đậm dần theo số câu (0, 1–9, 10–24, 25–49, từ 50); hôm nay viền vàng; chạm ô để xem "Thứ Hai 19/10: 32 câu · đúng 28 · 18 phút". Trên điện thoại vuốt ngang, tự mở ở tuần hiện tại.
- 4 ô số liệu: chuỗi ngày học hiện tại, chuỗi dài nhất, số ngày học, tổng số câu.
- **Sức mạnh Toán**: biểu đồ mạng nhện pixel 6 trục (Số, Phép tính, Giải toán lời văn, Hình học, Đo lường, Thống kê – Xác suất). Điểm mỗi trục = tỉ lệ đúng 10 lần làm gần nhất của từng dạng bài; câu Trùm tính gấp đôi; cần ít nhất 5 câu mới hiện điểm ("chưa đủ"); trục lớp chưa học hiện "chưa học". Nét chấm là tháng trước.
- **Luyện**: Jenny gợi ý trục yếu nhất; 8 câu (6 câu dạng yếu, 2 câu dạng đã vững) lấy từ chính các đảo em đã học; không mất tim, sai thì hiện lời giải ngay; +5 xu; hết lượt xem điểm trục trước → sau. Không phát nhạc nền.
- Ghi nhận mới (giữ tiến độ cũ, tự điền lại số liệu ngày từ nhật kí cũ): `st.dd` theo ngày, `st.sk` theo dạng bài, `st.skm` theo tháng. Mọi dạng bài đã gắn trục (`tools/test/truc-kien-thuc.js`).

## 2026-10-19 — Mọi vùng biển đều chuyển động
- Trước đây chỉ vùng biển của chủ đề đang học mới chuyển động (để đỡ tốn máy). Nay mọi vùng đều chuyển động; vùng nào khuất màn hình thì tạm dừng vẽ để đỡ tốn pin.

## 2026-10-19 — Vùng biển đúng tên, trùm và nhạc theo vùng, Hộ chiếu đại dương
- Vẽ lại 10 đảo (26×18 ô) cho đúng tên vùng: dừa + phao (Nhiệt đới), lều tuyết + cánh cụt (Băng), núi lửa dung nham, ốc đảo xương rồng + kim tự tháp, bánh kem + kẹo mút, cụm pha lê, cây rừng dây leo, cây lá đỏ + nấm, hải đăng, dừa bóng tối hoàng hôn.
- Trong nước có vật thể của vùng: san hô + cá; tảng băng, cánh cụt bơi, cực quang; đá bazan, dung nham, khói; cồn cát, rùa; kẹo trôi, cốm rơi; pha lê nhô khỏi mặt nước, mảnh pha lê, tia cầu vồng; lá súng, sen, ếch, đom đóm; lá thu trôi, thuyền giấy; trăng, sứa phát sáng, sao băng, đèn hải đăng quét; mặt trời lặn, chim và thuyền bóng tối. Cá voi/thuyền/hải âu chỉ còn ở Nhiệt đới. Bộ sinh hình: `tools/sprite/vung-bien-gen.py`.
- Trùm theo vùng: trùm chủ đề và Trùm lớp mang hệ màu của vùng (10 hệ, thêm Cát, Pha lê, Lá Thu, Hoàng hôn).
- Nhạc theo vùng: 10 bản nhạc bản đồ, phát theo vùng đang học.
- Hộ chiếu đại dương (tab Sưu tập): hạ trùm cuối chủ đề → đóng dấu vùng biển (có hiệu ứng, âm thanh); mỗi vùng mở 1 trang phục Jenny, đủ vùng → Trang phục Huyền thoại. Tiến độ cũ được tự đóng dấu bù.

## 2026-10-19 — Vùng biển khác nhau
- Mỗi chủ đề là một vùng biển riêng (`core/23b`, `BIOME`, `biomeOf()`): 10 vùng — Nhiệt đới, Kẹo ngọt, Rừng xanh, Pha lê, Biển Băng, Lá Thu, Ốc đảo Sa mạc, Núi lửa, Đêm sao, Hoàng hôn. Mỗi vùng có màu nước, kiểu đảo (dừa, thông tuyết, núi lửa, xương rồng, nấm kẹo, pha lê, cây tròn, cây lá đỏ) và hiệu ứng động riêng (tuyết rơi + băng trôi, tàn lửa bay, kẹo trôi + bong bóng, pha lê lấp lánh, lá súng, lá thu rơi, sao + trăng, mặt trời lặn, cồn cát).
- Mỗi lớp là một đại dương có tên và màu nhấn riêng (Vịnh Tí Hon, Biển Ngọc Bích, Quần đảo Mây Trắng, Đại dương Sao Băng, Biển Huyền Thoại); thứ tự vùng biển mỗi lớp khác nhau. Ôn tập học kì 1 luôn là Biển Băng, Ôn tập cuối năm luôn là Biển Hoàng hôn.

## 2026-10-19 — Sửa giọng đọc (lần 2)
- Bỏ chữ "mấy" thừa ở cuối câu hỏi: dấu "?" cuối câu không còn bị đọc thành "mấy"; chỉ ô trống trong phép tính (☐, "12 + ? = 20") mới đọc là "mấy".
- Chọn giọng tiếng Việt tốt nhất trên máy (ưu tiên giọng tự nhiên của Edge, Google Tiếng Việt của Chrome, giọng nâng cao của Mac), chờ danh sách giọng nạp xong; có thể ghim giọng bằng `localStorage.jennyVoice`.
- Câu cá lớp 1 Chủ đề 5: luật "lớn hơn 9" có quá ít cá đúng; nay chọn mốc 3–6.
- Máy không có giọng tiếng Việt (nguyên nhân đọc "bé" thành "bớ", đọc không rõ): hiện hướng dẫn cài giọng "Linh" trên Mac hoặc mở bằng Chrome/Edge.

## 2026-10-19 — Trùm hoạt hình
- Jenny có biểu cảm (`core/33d`, `jenny(size, mood)`): chờ thì thở và nháy mắt; đúng thì mắt cười, miệng mở, nhảy, lấp lánh; sai thì lo lắng, rơm rớm nước mắt, lắc đầu; qua màn/hạ trùm thì giơ hai tay ăn mừng.
- Trùm lớp dùng chung hoạt hình trùm (chờ, bị đánh, nổi giận, sắp thua, bị hạ) và có 6 hệ màu: Lửa, Băng, Độc, Vàng, Bóng đêm, Kẹo ngọt (đổi bảng màu sprite, cố định theo đảo, tên thêm "· Hệ …").
- Trùm có hoạt hình pixel và biểu cảm (`core/33c`, `bossHTML()`): thở/nhún khi chờ; bị đánh thì loé trắng, bật lùi, sao nổ, hiện "-1"; học sinh sai thì trùm lao tới, đỏ mặt, gân giận, "Hừm!" kèm tiếng gầm; sắp thua thì run và đổ mồ hôi; bị hạ thì xoay, bẹp xuống, sao quay vòng; thắng thì nhảy cười "HA HA!" kèm tiếng cười.
- Biểu tượng trùm trên bản đồ và ô Trùm lớp cũng nhún nhảy.
- Đặt lại tên trùm lớp 2–5 theo chủ đề (trước bị cắt dở, ví dụ "Cá mập Và bổ sung").

## 2026-10-19 — Âm thanh và hiệu ứng
- Nhạc nền 8-bit tự tổng hợp (không cần file), đổi theo màn: bản đồ, bài giảng, màn chơi, đánh trùm, Câu cá, Bóng bay, Đua giờ.
- Hiệu ứng riêng từng trò: Câu cá (câu được, cá vẫy tuột), Bóng bay (nổ bóng, bóng xì hơi), Đua giờ (tích tắc 10 giây cuối, hết giờ), trùm (đòn đánh, hạ trùm), kho báu (mở rương), slide (lật trang), thắng/thua.
- Mất tim: tim nảy đỏ, màn hình rung nhẹ và loé đỏ, điện thoại rung (nếu hỗ trợ).
- Các màn "Học trên đảo" (Màn 1, Màn 2, Trùm đảo), Sổ lỗi sai: không phát nhạc nền, chỉ giữ hiệu ứng. Nhạc chỉ còn ở bản đồ, Trùm lớp, Kho báu, Câu cá, Bóng bay, Đua giờ.
- Tắt nhạc nền khi hiện lời giải (sau khi trả lời sai), khi xem Bài giảng Jenny, video, ví dụ, Toán Jenny; nhạc tự nhỏ lại khi Jenny đang nói.
- Nút âm thanh (đầu trang và trong màn chơi): bật cả hai → chỉ hiệu ứng → tắt hết. Lưu ở `localStorage.jennySound`.

## 2026-10-19 — Sửa máy tính và giọng đọc
- Câu cá, Bóng bay: chọn sai đã trừ tim nhưng tim không đổi trên màn hình vì thiếu hình "tim rỗng" (heartE). Đã thêm hình; rà toàn bộ tên hình, không còn hình nào thiếu.
- Trò chơi nhỏ (Câu cá, Bóng bay) bị lệch sang trái trên MacBook/màn hình thấp: bố cục "điện thoại xoay ngang" chỉ áp cho máy cảm ứng; trò chơi nhỏ luôn căn giữa, rộng tối đa 720px.
- Giọng Jenny đọc **mọi phép tính hiện trên màn hình** (slide và câu hỏi): lời Jenny chưa nhắc tới dòng nào thì tự đọc thêm dòng đó (ví dụ 53 = 50 + 3 và 71 = 70 + 1). Câu điền dấu đọc cả hai vế ("47 và 41"), dãy số đọc "chỗ trống".
- Giọng Jenny: đọc đủ mọi phép so sánh (trước đây xoá nhầm đoạn giữa dấu < và >), đọc kí hiệu thành lời (lớn hơn, bé hơn, bằng, nhân, chia, phần, phẩy, đơn vị đo), giữ cao độ chuẩn (pitch 1) để không lệch thanh điệu (bé → bớ), ưu tiên giọng tiếng Việt chất lượng cao.

## 2026-10-19 — Đóng gói thành dự án
- Tách file HTML 1,1 MB thành mã nguồn: `css/`, `js/core/`, `js/content/`, khung `app.template.html`.
- `tools/build.py` ghép lại (kết quả trùng khớp từng byte với bản cũ) và tạo bản học sinh.
- `tools/test/kiem-tra.js` kiểm tra tự động cả 5 lớp.
- Thêm README, CLAUDE.md, TASKS.md, docs/.

## 2026-10-18
- Lớp 1–5 đủ cả năm (Chủ đề 6 trở đi): 474 đảo mới, trò chơi nhỏ theo chủ đề, bài giảng.
- Bài giảng Jenny cho 138 bài Chủ đề 1–5.
- Cỡ chữ phương án đồng đều, tự chuyển 2/1 phương án mỗi hàng khi chữ quá bé.
- Tự vừa màn hình khi điện thoại bật "Trang web cho máy tính"; sửa thanh menu tràn trên máy 360px.
- Sửa lỗi không hiện bài khi có tiến độ cũ (`healAll`).
- Chủ đề 2–5 lớp 1–5; mặc định mở khoá tất cả đảo để kiểm tra.
- Bản học sinh lên GitHub với tài khoản Jenny01–Jenny09.
