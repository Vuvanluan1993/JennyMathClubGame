# Kiến trúc

Ứng dụng là **một file HTML duy nhất** (không cần máy chủ), ghép từ nhiều file nguồn bằng `tools/build.py`.
Mọi file JS chạy chung một phạm vi toàn cục, theo đúng thứ tự trong `app.template.html`, nên file sau dùng được hàm/hằng của file trước.
Lưu ý: khai báo `function` trùng tên thì bản viết sau thắng (một số màn hình đã được viết lại theo cách này).

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

`tools/_student.py` lấy bản đầy đủ rồi: đổi khoá lưu theo tài khoản, thêm màn đăng nhập (mật khẩu băm SHA-256),
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
