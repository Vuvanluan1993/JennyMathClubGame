/*
  DANH SÁCH GAME — muốn thêm game mới, chỉ cần thêm 1 dòng vào đây.
  - id:     tên thư mục, không dấu (vd "o-so-bi-an-lop-8")
  - series: tên bộ game (các game cùng bộ đứng cạnh nhau)
  - title:  tên hiện trên thẻ
  - grade:  "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Tiểu học"...
  - topic:  chủ đề toán (vd "Số học", "Hình học", "Tổ hợp")
  - desc:   1 câu giới thiệu
  - puzzles, minutes: số câu đố, thời gian chơi
  - unit:   (tuỳ chọn) đơn vị đếm thay cho "câu" (vd "mức độ")
  - url:    đường dẫn tới game
  - status: "live" (chơi được) hoặc "soon" (sắp ra mắt)
  - added:  ngày thêm (YYYY-MM-DD)
  - mode:   "Cá nhân" (mỗi em tự chơi) hoặc "Cả lớp" (chơi chung trên máy chiếu)
  - thumb:  (tuỳ chọn) kiểu hình đại diện: "grid" (lưới số, mặc định) "pieces" (mảnh ghép) hoặc "code" (ổ khóa mật mã) hoặc "bb" (hình biểu tượng, chọn bằng icon)
  - icon:   (khi thumb là "bb") robot | rotate | tubes | wheel | map | layers
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
    id: "mat-ma-bi-an",
    series: "Mật Mã Bí Ẩn",
    title: "Mật Mã Bí Ẩn",
    grade: "Mọi lớp",
    topic: "Suy luận logic",
    mode: "Cá nhân",
    thumb: "code",
    desc: "Đoán mật mã trong 10 lượt. Chấm xanh, chấm vàng giúp em suy luận từng chữ số.",
    puzzles: 3,
    unit: "mức độ",
    url: "games/mat-ma-bi-an/moi-lop/",
    saveKey: "mmba",
    status: "live",
    added: "2026-10-09"
  },
  {
    id: "manh-ghep-bi-mat-lop-6",
    series: "Mảnh Ghép Bí Mật",
    title: "Mảnh Ghép Bí Mật Lớp 6",
    grade: "Lớp 6",
    topic: "Tổng hợp",
    mode: "Cả lớp",
    thumb: "pieces",
    desc: "Cả lớp giải toán để mở 15 mảnh tranh và lật từng chữ cái của cụm từ bí mật.",
    puzzles: 15,
    url: "games/manh-ghep-bi-mat/lop-6/",
    status: "live",
    added: "2026-10-09"
  },
  {
    id: "robot-tim-duong",
    series: "Tư Duy Bebras",
    title: "Robot Tìm Đường",
    grade: "Mọi lớp",
    topic: "Lập trình",
    mode: "Cá nhân",
    thumb: "bb",
    icon: "robot",
    desc: "Xếp mũi tên lệnh để robot nhặt kim cương, tránh cây, đá và bẫy. Khó có lệnh lặp.",
    puzzles: 10,
    unit: "màn × 3 mức",
    url: "games/tu-duy-bebras/robot-tim-duong/",
    saveKey: "bb-robot",
    status: "live",
    added: "2026-10-09"
  },
  {
    id: "xoay-lat-hinh",
    series: "Tư Duy Bebras",
    title: "Xoay Lật Hình",
    grade: "Mọi lớp",
    topic: "Hình học",
    mode: "Cá nhân",
    thumb: "bb",
    icon: "rotate",
    desc: "Xoay hoặc lật hình mẫu để được đúng hình đích. Có câu ngược: đoán phép đã dùng.",
    puzzles: 10,
    unit: "màn × 3 mức",
    url: "games/tu-duy-bebras/xoay-lat-hinh/",
    saveKey: "bb-xoaylat",
    status: "live",
    added: "2026-10-09"
  },
  {
    id: "xep-ong-bi",
    series: "Tư Duy Bebras",
    title: "Xếp Ống Bi",
    grade: "Mọi lớp",
    topic: "Suy luận logic",
    mode: "Cá nhân",
    thumb: "bb",
    icon: "tubes",
    desc: "Chuyển bi để mỗi ống chỉ còn một màu, càng ít lượt càng nhiều sao.",
    puzzles: 10,
    unit: "màn × 3 mức",
    url: "games/tu-duy-bebras/xep-ong-bi/",
    saveKey: "bb-ongbi",
    status: "live",
    added: "2026-10-09"
  },
  {
    id: "giai-ma-thu",
    series: "Tư Duy Bebras",
    title: "Giải Mã Thư",
    grade: "Mọi lớp",
    topic: "Mật mã",
    mode: "Cá nhân",
    thumb: "bb",
    icon: "wheel",
    desc: "Xoay bánh xe mật mã để đọc lá thư bí mật: dịch chữ, số thành chữ, chữ gương.",
    puzzles: 8,
    unit: "màn × 3 mức",
    url: "games/tu-duy-bebras/giai-ma-thu/",
    saveKey: "bb-giaima",
    status: "live",
    added: "2026-10-09"
  },
  {
    id: "duong-di-re-nhat",
    series: "Tư Duy Bebras",
    title: "Đường Đi Rẻ Nhất",
    grade: "Mọi lớp",
    topic: "Đồ thị",
    mode: "Cá nhân",
    thumb: "bb",
    icon: "map",
    desc: "Tìm đường đi ít tiền nhất qua bản đồ làng. Khó có đường một chiều và điểm bắt buộc.",
    puzzles: 8,
    unit: "màn × 3 mức",
    url: "games/tu-duy-bebras/duong-di-re-nhat/",
    saveKey: "bb-duongdi",
    status: "live",
    added: "2026-10-09"
  },
  {
    id: "chong-hinh",
    series: "Tư Duy Bebras",
    title: "Chồng Hình",
    grade: "Mọi lớp",
    topic: "Logic",
    mode: "Cá nhân",
    thumb: "bb",
    icon: "layers",
    desc: "Chồng hai tấm hình theo luật HOẶC, VÀ, KHÁC NHAU để tìm ra hình kết quả.",
    puzzles: 10,
    unit: "màn × 3 mức",
    url: "games/tu-duy-bebras/chong-hinh/",
    saveKey: "bb-chonghinh",
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
