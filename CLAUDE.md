# Hướng dẫn cho Claude — kho JennyMathClubGame

Kho trò chơi toán của Clb **Học Toán cùng Jenny** (chủ: thầy Luân). Nhánh `main` được GitHub Pages
đưa lên https://vuvanluan1993.github.io/JennyMathClubGame/ nên **mọi thứ trên `main` là bản đang dùng thật**.

Trả lời thầy bằng tiếng Việt, ngắn, từ ngữ đơn giản.

## Đọc gì trước
- `README.md` (danh sách game, cấu trúc, quy ước đặt tên), `TIEU_CHI.md` (tiêu chí chất lượng mọi game).
- Làm việc trong **Lớp học ảo** (`src/lop-hoc-ao/`): đọc `src/lop-hoc-ao/CLAUDE.md` và `src/lop-hoc-ao/docs/LUAT-DA-CHOT.md`
  trước, rồi `TASKS.md`, `CHANGELOG.md` ở đó. Các luật đã chốt với thầy nằm ở `LUAT-DA-CHOT.md`, không tự đổi.
- `lms-thu/` là bản thử LMS riêng (Supabase), đọc `lms-thu/HUONG_DAN.md`; không liên kết từ trang chính.

## Bản đồ kho
```
index.html, games.js      Trang chủ + danh sách game (game ẩn có hidden: true)
games/<bo-game>/<lop>/    Mỗi game 1 file HTML chạy độc lập
games/tu-duy-bebras/_kit/ Khung chung cho game Bebras
games/hanh-trinh-jenny/   Game đi màn; kho bài bank.enc mã hoá bằng mã CLB (tools/build_bank*.py)
games/lop-hoc-ao/         *** FILE SINH RA từ src/lop-hoc-ao (học sinh, giao-vien, phu-huynh, quan-ly) — không sửa tay
src/lop-hoc-ao/           Mã nguồn Lớp học ảo: python3 tools/build.py → dist/ + games/lop-hoc-ao/
tools/                    check_fit.py (vừa 1 màn hình), build_bank*.py, giong/ (thu giọng đọc)
lms-thu/                  LMS bản thử (Supabase)
.github/workflows/        Thu giọng đọc (chạy tay trên GitHub Actions)
```

## Hai nơi cùng làm việc trên kho này: Cowork và Claude Code
Cowork và Claude Code có thể chạy song song. Quy tắc để không giẫm chân nhau:

1. **Cowork làm thẳng trên `main`**: sửa → build → test → commit → `git pull --rebase` → `git push` (như quy trình cũ
   trong `src/lop-hoc-ao/CLAUDE.md`).
2. **Claude Code: mỗi phiên một worktree + nhánh riêng.** Tên nhánh: `feature/…`, `fix/…`, `chore/…`, `wip/…`
   (chữ thường, không dấu, nối bằng gạch). **Không commit thẳng vào `main` từ phiên Code.**
   Khi đang ở worktree, các bước "push lên main" / "đăng artifact" trong `src/lop-hoc-ao/CLAUDE.md` đổi thành:
   commit vào nhánh của mình, đẩy nhánh lên `origin`, mở Pull Request (hoặc báo thầy gộp).
3. **Bắt đầu phiên**: `git fetch origin && git rebase origin/main` để lấy việc Cowork vừa làm.
4. **File sinh ra không commit trên nhánh phụ.** `src/lop-hoc-ao/dist/` và `games/lop-hoc-ao/**/index.html` được build
   ghi kèm dấu thời gian nên **luôn** xung đột khi gộp. Trên nhánh phụ: build để kiểm tra, nhưng trước khi commit chạy
   `git checkout -- games/lop-hoc-ao` và chỉ commit `src/`, `CHANGELOG.md`, `TASKS.md`, tài liệu.
   Khi gộp vào `main`: gộp xong → `cd src/lop-hoc-ao && python3 tools/build.py` → commit "Dựng lại bản" → push.
   Gặp xung đột ở file sinh ra thì **không giải tay**, chạy lại build rồi `git add`.
5. **Hai phiên không sửa cùng một file.** Mỗi task một khu vực (một bộ game, một dạng bài, một trang). Các file dễ đụng
   nhau là `CHANGELOG.md`, `TASKS.md`, `LUAT-DA-CHOT.md`: ghi mục mới lên **đầu** danh sách; xung đột thì giữ cả hai bên.
6. Hết việc: cập nhật `CHANGELOG.md`/`TASKS.md` (nếu thuộc Lớp học ảo), commit kèm dòng ghi công theo hướng dẫn phiên,
   đẩy nhánh, mở PR. Thầy (hoặc phiên Cowork) gộp và build lại trên `main`.

## Công cụ trên máy Mac này (25/10/2026)
- `python3` 3.9 có sẵn → `build.py`, `check_fit.py` chạy được (cần `pip install playwright` cho check_fit).
- `node` **chưa cài** → `node tools/test/kiem-tra.js` chưa chạy được. Cài: `brew install node` rồi
  `npm i -D playwright && npx playwright install chromium`. Khi chưa có Node, ghi rõ trong báo cáo là chưa chạy bộ kiểm tra.
- `gh` (GitHub CLI) 2.103 đã cài ở `~/.local/bin` (PATH thêm trong `~/.zprofile`), đã đăng nhập tài khoản Vuvanluan1993
  qua SSH → mở PR bằng `gh pr create --fill`.
