# P-02 Build và deploy Pages từ CI; bỏ file sinh ra khỏi git

**Mục tiêu:** `main` chỉ chứa mã nguồn; GitHub Actions build rồi đưa lên Pages. Hết xung đột file sinh ra khi gộp nhánh.
**Ước lượng:** 5 giờ. **Người dùng thấy gì:** không (trang vẫn như cũ). **Cần trước:** P-01 đã push (dùng chung bước cài Node/Playwright).

## File sửa
- Mới: `.github/workflows/deploy.yml` (on push `main`: build → `actions/upload-pages-artifact` → `actions/deploy-pages`; `permissions: pages: write, id-token: write`).
  ⟳ 25/10: bước build gọi `tools/build_all.py` (mới), file này chạy mọi `tools/build_*.py` theo tên — P-19 thêm `build_tham_tu.py` mà không sửa workflow.
- Sửa: `.github/workflows/giong-doc.yml` — input qua `env:`, `fetch-depth: 0`, bỏ `if: always()`, kết quả đẩy lên nhánh `giong/<ngày>` và mở PR (`gh pr create`), không push `main`.
- Sửa: `.gitignore` thêm `games/lop-hoc-ao/**/index.html`, `src/lop-hoc-ao/dist/`, `tools/__pycache__/`; `git rm --cached` 4 file index đã sinh, 3 file `.pyc`.
- Sửa: `CLAUDE.md` gốc quy tắc 4 (không còn build trên `main`), `src/lop-hoc-ao/CLAUDE.md` bước 6–7, `README.md` mục "Lớp Học Ảo".
- Sửa: `src/lop-hoc-ao/tools/build.py:16` — dấu giờ lấy từ `GITHUB_SHA`/`git rev-parse --short HEAD` thay giờ máy (build lặp lại cho cùng kết quả).

## Việc phải xong (DONE)
1. Push lên `main` → trang https://vuvanluan1993.github.io/JennyMathClubGame/games/lop-hoc-ao/ vẫn mở, có số bản = sha.
2. `git ls-files | grep -c 'games/lop-hoc-ao/.*index.html'` = 0; `.pyc` = 0.
3. Workflow giọng đọc mở PR thay vì push `main` (chạy thử với `cau-mau.json`).
4. Tài liệu 3 file đã đổi theo.

## Việc thầy làm (E)
- Settings › Pages › Source = **GitHub Actions** (một lần).
- Settings › Branches › bảo vệ `main`: bắt buộc PR + check `ci` xanh.

## Bẫy
- Deploy từ Actions cần `.nojekyll` trong artifact (đã có ở gốc).
- Trong lúc chuyển, nhánh `wip/t27-tu-luyen-dang-them` còn chứa file sinh ra: gộp nó trước, hoặc `git checkout origin/main -- games/lop-hoc-ao` khi gộp.
