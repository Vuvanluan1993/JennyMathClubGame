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
7. `core/31–33` tính năng chơi thêm (Trùm lớp, Đua giờ, Kho báu, Sưu tập, Câu cá, Bóng bay). `core/34` khởi động.

## Dữ liệu chính

| Tên | Ý nghĩa |
|---|---|
| `S` | Toàn bộ trạng thái, lưu `localStorage[KEY]`. `S.st[sid]` = một học sinh (grade, coins, p1, mist…). |
| `PRIM[g]` | Lớp `g` (1–5): `T` danh sách chủ đề, `isl` mảng đảo, `boss` trùm từng chủ đề. |
| đảo `x` | `{id, title, lesson, b (số bài), tiet, ntiet, ti (chủ đề, từ 0), lv:[[gen Màn1],[gen Màn2],[gen Trùm]?], nm, boss, goal}` |
| `s1(st,id)` | Tiến độ một đảo của học sinh: `{m:[đã qua màn?], fails:[], les:đã xem bài giảng}` |
| `MG[g]` | Luật Câu cá / Bóng bay chủ đề 1. `MGT[ti][g]` cho chủ đề `ti ≥ 1`. |
| `LES[g][bài]` | Slide Bài giảng Jenny: `[{t, h, say}]`. Trang cuối luôn là "Em nhớ nhé". |
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
