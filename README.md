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

Game Tư Duy Bebras tạo đề ngẫu nhiên mỗi lần chơi, có 3 mức Dễ / Vừa / Khó.

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
