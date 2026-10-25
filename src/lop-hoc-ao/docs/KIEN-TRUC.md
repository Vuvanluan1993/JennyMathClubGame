# Kiến trúc

Ứng dụng ghép từ nhiều file nguồn bằng **Vite** (`npm run build`, từ P-14a; `python3 tools/build.py` vẫn chạy được và gọi lệnh này).
Mọi file JS nối thành **một** `<script>` thường (không phải module), chạy chung một phạm vi toàn cục, theo đúng thứ tự trong `app.template.html`, nên file sau dùng được hàm/hằng của file trước.
Lưu ý: khai báo `function` trùng tên thì bản viết sau thắng (một số màn hình đã được viết lại theo cách này).

## Dựng bản (Vite, P-14a — 25/10/2026)

| Lệnh | Làm gì |
|---|---|
| `npm run build` (= `vite build src/lop-hoc-ao`; `python3 tools/build.py` gọi lệnh này, tự `npm ci` nếu chưa có `node_modules`) | Ra `dist/` rồi chép 4 trang + `assets/` sang `games/lop-hoc-ao/` |
| `npm run dev` (= `vite src/lop-hoc-ao`) | http://localhost:5173/JennyMathClubGame/games/lop-hoc-ao/ — dựng lại mỗi lần tải trang (một file, không hash); `/JennyMathClubGame/…` phục vụ file tĩnh của kho (chữ tự host…). Sửa file rồi tải lại trang |
| `node tools/vite/so-voi-python.mjs` | So `vai.js` với `_student.py`/`_teacher.py` (phải giống từng byte). Chạy lại sau mỗi lần rebase có Python mới |

- `vite.config.js`: 5 entry (`hoc-sinh` → `index.html`, `giao-vien/`, `phu-huynh/`, `quan-ly/`, `demo` → `demo.html`), `base: '/JennyMathClubGame/games/lop-hoc-ao/'`. Trang là ảo: không có file `.html` trên đĩa.
- `tools/vite/noi-file.js` (plugin): đọc `app.template.html`, nối `/*@include …*/` theo đúng thứ tự (khối `<style>` và khối `<script>` chỉ gồm dòng include, mỗi loại đúng 1 khối — sai thì build dừng), thay `__APP_VER__` (ngày commit · sha). Từ bản đầy đủ, `vai.js` dựng từng trang; plugin tách khối CSS → `assets/lop-hoc-ao-[hash].css` (chung 5 trang) và khối JS → `assets/<trang>-[hash].js`. Mã JS là asset: Rollup không đọc, không đổi tên, không minify.
- Giữ y bản cũ: script nhỏ trong `<head>` (`data-theme=light`, chữ tự host P-08, CSP, referrer) vẫn inline, chạy **trước** CSS; `<link>` CSS và `<script src>` đứng đúng chỗ khối cũ (thứ tự CSS, giờ chạy JS không đổi). Mỗi trang JS vẫn là **một** script (tách đôi sẽ đổi hoisting của hàm trùng tên). Khoá `localStorage` không đổi (mã giống từng byte).
- Đường dẫn asset ghi **tương đối** (`assets/…`, `../assets/…`): cùng một bản chạy trên Pages (dưới `base`), ở máy chủ thử phục vụ gốc kho tại `/` (`npm test`) và trong `dist/`.
- `dist/lop-hoc-ao-jenny.html`: bản đầy đủ **một file** (CSS/JS inline, không doctype) — y build cũ; bộ kiểm tra §7 và Artifact dùng file này. `dist/demo.html` = cùng nội dung nhưng CSS/JS ra file có hash.
- `games/lop-hoc-ao/assets/` sinh ra mỗi lần build (xoá cũ trước), có `.gitignore` tự sinh (`*`) nên không vào git.
- So với build Python (25/10/2026, tip 78be60f): 4 trang dạng một file giống từng byte; ảnh 4 trang × 4 khổ (320/375/414/900) giống từng byte; `demo.html` ≤ 0,001 %.

## Thứ tự nạp (rút gọn)

1. `core/01` tiện ích (`R`, `pick`, `shuf`, `range`, `esc`…), `content/hk1/02–08` dữ liệu lớp 6–9 và Toán Jenny lớp 6.
2. `core/09–20` dữ liệu demo, lưu trữ, giao diện chung, học sinh / giáo viên / phụ huynh, chơi màn lớp 6.
3. `core/23b` vùng biển: `BIOME` (màu nước, kiểu đảo, hiệu ứng), `BIOME_ORDER[lớp]`, `OCEAN[lớp]`, `biomeOf(lớp, chủ đề, tên)`, `biomeFx()`.
   `core/22–23` đồ hoạ pixel (`PXS`, `spr()`, `pixelize()`), biển động (`startSea()`).
4. `content/hk1/24` **bộ máy tiểu học**: `startG1`, `ans1`, `render` các dạng câu, `viewIsland1`, bản đồ chủ đề…
   (nằm chung với Chủ đề 1 lớp 1). `core/25` Sổ lỗi sai và Toán Jenny tiểu học.
5. `content/hk1/26–29` lớp 2–5 Chủ đề 1, Chủ đề 2–5 lớp 1–5. `content/hk1/30` khung Bài giảng Jenny,
   trong đó ghép `content/lessons/*` và `content/hk2/*`, rồi `addTopic`, `lesOf`, `viewLes`.
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
| `MG[g]` | Luật Câu cá / Bóng bay chủ đề 1. `MGT[ti][g]` cho chủ đề `ti ≥ 1`. |
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

`tools/vite/vai.js` (`hocSinh`; trước P-14a là `tools/_student.py`, còn giữ để so) lấy bản đầy đủ rồi: đổi khoá lưu theo tài khoản, thêm màn đăng nhập (mật khẩu băm SHA-256),
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
