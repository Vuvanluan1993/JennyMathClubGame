# Học Toán cùng Jenny – Góc trò chơi toán

Kho trò chơi toán của CLB **Học Toán cùng Jenny**, cho học sinh tiểu học và THCS.

Trang chơi: https://vuvanluan1993.github.io/JennyMathClubGame/

## Game hiện có

| Bộ game | Lớp | Số câu | Đường dẫn |
|---|---|---|---|
| Ô Số Bí Ẩn | Lớp 6 | 18 | `games/o-so-bi-an/lop-6/` |
| Ô Số Bí Ẩn | Lớp 7 | 17 | `games/o-so-bi-an/lop-7/` |
| Mảnh Ghép Bí Mật (cả lớp chơi chung) | Lớp 6 | 15 | `games/manh-ghep-bi-mat/lop-6/` |
| Mật Mã Bí Ẩn (3 mức độ) | Mọi lớp | – | `games/mat-ma-bi-an/moi-lop/` |
| Tư Duy Bebras · Robot Tìm Đường | Mọi lớp | 10 màn × 3 mức | `games/tu-duy-bebras/robot-tim-duong/` |
| Tư Duy Bebras · Xoay Lật Hình | Mọi lớp | 10 màn × 3 mức | `games/tu-duy-bebras/xoay-lat-hinh/` |
| Tư Duy Bebras · Xếp Ống Bi | Mọi lớp | 10 màn × 3 mức | `games/tu-duy-bebras/xep-ong-bi/` |
| Tư Duy Bebras · Giải Mã Thư | Mọi lớp | 8 màn × 3 mức | `games/tu-duy-bebras/giai-ma-thu/` |
| Tư Duy Bebras · Đường Đi Rẻ Nhất | Mọi lớp | 8 màn × 3 mức | `games/tu-duy-bebras/duong-di-re-nhat/` |
| Tư Duy Bebras · Chồng Hình | Mọi lớp | 10 màn × 3 mức | `games/tu-duy-bebras/chong-hinh/` |

| Hành Trình Của Jenny (đi màn + toán, cần mã CLB) | Lớp 6 | 30 màn + 673 bài | `games/hanh-trinh-jenny/lop-6/` |

| Hành Trình Của Jenny Mầm non | 5–6 tuổi | 48 màn tương tác | `games/hanh-trinh-jenny/mam-non/` |
| Hành Trình Của Jenny Tiểu học (cần mã CLB) | Lớp 1–4 | 40 màn + 120 bài toán tư duy | `games/hanh-trinh-jenny/tieu-hoc/` |

Hiện trang chủ chỉ hiện bản Mầm non và Tiểu học; các game khác có `hidden: true` trong `games.js` (bỏ dòng đó để hiện lại).

Game Tư Duy Bebras tạo đề ngẫu nhiên mỗi lần chơi, có 3 mức Dễ / Vừa / Khó.

## Tiêu chí chất lượng

Mọi game kiểm tra theo `TIEU_CHI.md` (mục tiêu học tập, đề bài, hình ảnh, tương tác, phản hồi, động lực, an toàn).

## Cấu trúc thư mục

```
index.html              Trang chủ: danh sách game, lọc theo lớp
games.js                Danh sách game (trang chủ đọc từ đây)
assets/                 Logo, hình dùng chung
games/
  <bo-game>/            Mỗi bộ game một thư mục
    lop-6/index.html    Mỗi game là 1 file HTML chạy độc lập
    lop-7/index.html
  tu-duy-bebras/
    _kit/               Khung dùng chung cho game Bebras (thanh trên, màn, sao,
                        bóng đèn gợi ý, đồng hồ, lưu tiến độ, Jenny, âm thanh)
    <ten-game>/index.html   Chỉ viết phần đề và cách chơi, gọi Kit.run({...})
```

## Thêm game mới

1. Tạo thư mục `games/<bo-game>/<ten-game>/` và đặt file game vào, đặt tên `index.html`.
2. Mở `games.js`, thêm 1 khối mới (chép khối có sẵn rồi sửa tên, lớp, đường dẫn).
3. Đổi `status` thành `"live"` khi game sẵn sàng.

Quy ước:
- Tên thư mục viết thường, không dấu, nối bằng dấu gạch (`o-so-bi-an`, `lop-8`).
- Ảnh trong game nên nén (JPEG/WebP), mỗi game dưới 1 MB để mở nhanh trên máy chiếu và điện thoại.
- Nút/logo "Về trang chủ" trong game trỏ về `../../../`.
- Mỗi game dùng một khoá lưu riêng (`saveKey`) để không ghi đè tiến độ của game khác.
- **Vừa 1 màn hình:** mọi game phải chơi được mà không cần kéo lên xuống, trên mọi thiết bị.

## Kiểm tra "vừa 1 màn hình"

`tools/check_fit.py` mở từng game trên 8 cỡ màn hình (điện thoại dọc/ngang, máy tính bảng, laptop, máy chiếu, màn lớn) và báo chỗ phải kéo, bị cắt hoặc bị đè.

```
pip install playwright && python -m playwright install chromium
python -m http.server 8765        # cửa sổ 1, ở thư mục gốc repo
python tools/check_fit.py         # cửa sổ 2
```

Thêm game mới thì thêm vài dòng vào `CASES` cuối file đó.

## Hành Trình Của Jenny

- Bản đồ 2 đảo × 15 màn. Mỗi màn là 1 đề Bebras cố định (game Bebras mở ở chế độ `?saga=...&seed=...`).
- Trạm toán: bài MATHCOUNTS (đã dịch). Giải đúng được xu (Dễ 10, Vừa 20, Khó 40; tối đa 300 xu/ngày) và năng lượng (mỗi màn tốn 1).
- Vườn: cây và thú lớn lên theo số bài giải đúng. Tiến độ lưu trên máy, có mã sao lưu để chuyển máy.
- Kho bài `bank.enc` được mã hoá bằng mã CLB. Tạo lại kho (hoặc đổi mã):

```
pip install cryptography
python tools/build_bank.py <_pool_lop6.json> games/hanh-trinh-jenny/lop-6/bank.enc <MÃ CLB>
```

### Bản Tiểu học
- 4 đảo × 10 màn: Rô bốt, Ống bi, Chồng hình, Mật thư. Các game Bebras mở với `?kid=1` dùng mức tiểu học.
- Trạm toán: 120 bài toán tư duy (60 lớp 1–2, 60 lớp 3–4) đã dịch và vẽ lại hình; bài đáp số là số thì điền số, còn lại chọn 1 trong 3. Có nút "Đọc đề" nếu máy có giọng tiếng Việt.
- Tạo lại kho: `python tools/build_bank_th.py <toan_tu_duy_tieu_hoc.json> games/hanh-trinh-jenny/tieu-hoc/bank.enc <MÃ CLB>`

### Bản Mầm non
- 6 đảo theo chủ đề × 8 màn, mỗi màn 5 câu do máy tự tạo (không cần mã CLB): Hình và Màu (hình khác biệt, tìm chỗ khác nhau, tô màu, quy luật), Đếm Số (đếm, nối, so sánh), Cộng Trừ, Bài Toán (có lời văn), Thứ Tự và Giờ (số thứ tự, đồng hồ giờ đúng), Phương Hướng (trên, dưới, trái, phải, trong, ngoài).
- Màn 1–4 dùng số đến 5, màn 5–8 đến 10. Mỗi câu máy tự đọc yêu cầu (chậm), sai 2 lần thì Jenny gợi ý.
- Hình vẽ ở `art.js` (vẽ bằng SVG). Thêm dạng bài mới: thêm vào `ACTS` trong `index.html`.
