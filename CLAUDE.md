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
.github/workflows/        ci.yml (kiểm tra PR), deploy.yml (dựng + đưa lên Pages khi đẩy main), sao-luu.yml (sao lưu tuần), giong-doc.yml (thu giọng, chạy tay)
tools/sao-luu/            Sao lưu Firestore mỗi tuần → release kho riêng tư Vuvanluan1993/jenny-backup (mã hoá age); khôi phục: tools/sao-luu/README.md
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
4. **File sinh ra không nằm trong git.** `src/lop-hoc-ao/dist/`, `games/lop-hoc-ao/**/index.html` (trừ `giong-mau/`)
   và `__pycache__/` đã vào `.gitignore`. Build trên máy chỉ để kiểm tra: `python3 tools/build_all.py` (dựng mọi bản) hoặc
   `python3 src/lop-hoc-ao/tools/build.py`; không commit, không còn bước "Dựng lại bản" khi gộp, hết xung đột file sinh ra.
   Mỗi lần đẩy vào `main`, GitHub Actions (`.github/workflows/deploy.yml`) dựng lại rồi đưa cả kho lên Pages
   (cần một lần: Settings › Pages › Source = GitHub Actions). Số bản ở góc thẻ chào = ngày commit · sha.
   Sau khi CI deploy chạy, Cowork cũng nên qua PR (chờ thầy chốt Q3 trong `docs/kien-truc/KE-HOACH.md`).
5. **Hai phiên không sửa cùng một file.** Mỗi task một khu vực (một bộ game, một dạng bài, một trang). Các file dễ đụng
   nhau là `CHANGELOG.md`, `TASKS.md`, `LUAT-DA-CHOT.md`: ghi mục mới lên **đầu** danh sách; xung đột thì giữ cả hai bên.
6. Hết việc: cập nhật `CHANGELOG.md`/`TASKS.md` (nếu thuộc Lớp học ảo), commit kèm dòng ghi công theo hướng dẫn phiên,
   đẩy nhánh, mở PR. Thầy (hoặc phiên Cowork) gộp và build lại trên `main`.

## Công cụ trên máy Mac này (25/10/2026)
- `python3` 3.9 có sẵn → `build.py`, `check_fit.py` chạy được (cần `pip install playwright` cho check_fit).
- `brew` **chưa cài**, nên Node cài tay từ tarball chính thức (không cần quyền quản trị):
  tải `node-v22.x-darwin-arm64.tar.gz` ở https://nodejs.org/dist/latest-v22.x/ (máy `arm64`, xem `uname -m`),
  giải nén vào `~/.local/node`, thêm `export PATH="$HOME/.local/node/bin:$PATH"` vào `~/.zprofile`.
  Có Homebrew thì `brew install node` cũng được.
- Bộ kiểm tra (một lệnh, từ gốc kho): `npm ci` (lần đầu, cài Playwright) → `npx playwright install chromium`
  (lần đầu, tải ~150 MB) → `npm run build && npm test`. `npm test` chạy `tools/test/chay-tat-ca.mjs`: mọi
  `tools/test/*.mjs` và `src/lop-hoc-ao/tools/test/*.js`, ghi mã lỗi chung vào `.ci/rc.txt` (0 = ĐẠT), từng bài vào
  `.ci/ket-qua.txt`. Chạy một bài: `npm test -- kiem-tra`. Trình duyệt ở chỗ khác: đặt `PW_DIR` (hoặc `CHROME`).
  GitHub Actions (`.github/workflows/ci.yml`) chạy đúng chuỗi này trên mọi PR và khi đẩy vào `main`.
  Khi máy chưa có Node, ghi rõ trong báo cáo là chưa chạy bộ kiểm tra.
- `gh` (GitHub CLI) 2.103 đã cài ở `~/.local/bin` (PATH thêm trong `~/.zprofile`), đã đăng nhập tài khoản Vuvanluan1993
  qua SSH → mở PR bằng `gh pr create --fill`.
