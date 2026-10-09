# Học Toán cùng Jenny – Góc trò chơi toán

Kho trò chơi toán của CLB **Học Toán cùng Jenny**, cho học sinh tiểu học và THCS.

Trang chơi: https://vuvanluan1993.github.io/JennyMathClubGame/

## Game hiện có

| Bộ game | Lớp | Số câu | Đường dẫn |
|---|---|---|---|
| Ô Số Bí Ẩn | Lớp 6 | 18 | `games/o-so-bi-an/lop-6/` |
| Ô Số Bí Ẩn | Lớp 7 | 17 | `games/o-so-bi-an/lop-7/` |

## Cấu trúc thư mục

```
index.html              Trang chủ: danh sách game, lọc theo lớp
games.js                Danh sách game (trang chủ đọc từ đây)
assets/                 Logo, hình dùng chung
games/
  <bo-game>/            Mỗi bộ game một thư mục
    lop-6/index.html    Mỗi game là 1 file HTML chạy độc lập
    lop-7/index.html
```

## Thêm game mới

1. Tạo thư mục `games/<bo-game>/<ten-game>/` và đặt file game vào, đặt tên `index.html`.
2. Mở `games.js`, thêm 1 khối mới (chép khối có sẵn rồi sửa tên, lớp, đường dẫn).
3. Đổi `status` thành `"live"` khi game sẵn sàng.

Quy ước:
- Tên thư mục viết thường, không dấu, nối bằng dấu gạch (`o-so-bi-an`, `lop-8`).
- Mỗi game dùng một khoá lưu riêng (`saveKey`) để không ghi đè tiến độ của game khác.
