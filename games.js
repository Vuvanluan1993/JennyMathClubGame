/*
  DANH SÁCH GAME — muốn thêm game mới, chỉ cần thêm 1 dòng vào đây.
  - id:     tên thư mục, không dấu (vd "o-so-bi-an-lop-8")
  - series: tên bộ game (các game cùng bộ đứng cạnh nhau)
  - title:  tên hiện trên thẻ
  - grade:  "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Tiểu học"...
  - topic:  chủ đề toán (vd "Số học", "Hình học", "Tổ hợp")
  - desc:   1 câu giới thiệu
  - puzzles, minutes: số câu đố, thời gian chơi
  - url:    đường dẫn tới game
  - status: "live" (chơi được) hoặc "soon" (sắp ra mắt)
  - added:  ngày thêm (YYYY-MM-DD)
  - mode:   "Cá nhân" (mỗi em tự chơi) hoặc "Cả lớp" (chơi chung trên máy chiếu)
  - thumb:  (tuỳ chọn) kiểu hình đại diện: "grid" (lưới số, mặc định) hoặc "pieces" (mảnh ghép)
  - saveKey: (tuỳ chọn) khoá lưu tiến độ của game, để trang chủ hiện "Đang chơi dở"
*/
window.GAMES = [
  {
    id: "o-so-bi-an-lop-6",
    series: "Ô Số Bí Ẩn",
    title: "Ô Số Bí Ẩn Lớp 6",
    grade: "Lớp 6",
    topic: "Ô chữ số",
    mode: "Cá nhân",
    desc: "Giải 18 câu đố để lấp đầy lưới số. Ô giao nhau phải khớp cả Ngang lẫn Dọc.",
    puzzles: 18,
    minutes: 60,
    url: "games/o-so-bi-an/lop-6/",
    saveKey: "osba6",
    status: "live",
    added: "2026-10-08"
  },
  {
    id: "o-so-bi-an-lop-7",
    series: "Ô Số Bí Ẩn",
    title: "Ô Số Bí Ẩn Lớp 7",
    grade: "Lớp 7",
    topic: "Ô chữ số",
    mode: "Cá nhân",
    desc: "17 câu đố về tỉ lệ, góc, phần trăm và lũy thừa trong một lưới số.",
    puzzles: 17,
    minutes: 60,
    url: "games/o-so-bi-an/lop-7/",
    saveKey: "osba7",
    status: "live",
    added: "2026-10-08"
  },
  {
    id: "manh-ghep-bi-mat-lop-9",
    series: "Mảnh Ghép Bí Mật",
    title: "Mảnh Ghép Bí Mật Lớp 9",
    grade: "Lớp 9",
    topic: "Tổng hợp",
    mode: "Cả lớp",
    thumb: "pieces",
    desc: "Cả lớp giải toán để mở 15 mảnh tranh và lật từng chữ cái của cụm từ bí mật.",
    puzzles: 15,
    url: "games/manh-ghep-bi-mat/lop-9/",
    status: "live",
    added: "2026-10-09"
  },
  {
    id: "o-so-bi-an-lop-8",
    series: "Ô Số Bí Ẩn",
    title: "Ô Số Bí Ẩn Lớp 8",
    grade: "Lớp 8",
    topic: "Ô chữ số",
    mode: "Cá nhân",
    desc: "Sắp ra mắt.",
    status: "soon"
  },
  {
    id: "o-so-bi-an-lop-9",
    series: "Ô Số Bí Ẩn",
    title: "Ô Số Bí Ẩn Lớp 9",
    grade: "Lớp 9",
    topic: "Ô chữ số",
    mode: "Cá nhân",
    desc: "Sắp ra mắt.",
    status: "soon"
  }
];
