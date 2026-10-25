# Lịch sử lộ trình 25/10/2026 (phần đã đóng)

Chuyển nguyên chữ từ `KE-HOACH-ROUTES-2026-10-25.md` khi cắt lại chiều 25/10: bảng trạng thái sáng 25/10 và khối lệnh của các phiên đã đóng (CI1, CI2, FE1, FE2, FB1, FB2, T1, T2) cùng các phiên Supabase không mở (SB1–SB4). Lộ trình sống: `KE-HOACH-PARALLEL-2026-10-25.md`.

## Trạng thái đo ngày 25/10 (nguồn ở cột cuối)
| Việc đo | Kết quả | Nguồn |
|---|---|---|
| `origin/main` | `952e7a5`, 25/10 | `git log origin/main` |
| Lane đang chạy | `wip/t27-tu-luyen-dang-them` (24/10): `72-tu-luyen.js`, `tools/test/tu-luyen.js`, CHANGELOG, TASKS, LUAT, 4 file build | `git diff --name-only origin/main...origin/wip/t27…` |
| PR mở | 0 | `gh pr list` |
| Worktree | chỉ `chore/audit-kien-truc` (phiên này) | `git worktree list` |
| Node / Playwright trên Mac thầy | **chưa có** / chưa có → 7 kiểm tra §7 chưa chạy được tại máy | `which node`, `python3 -c "import playwright"` |
| Khoá kiểm tra dùng chung | không có; mỗi worktree build `dist/` riêng → không giới hạn độ rộng | `tools/build.py`, `tools/test/*.js` |
| Ghi chú nhớ của thầy về kế hoạch | chưa có | thư mục memory trống |
| Thư mục `~/Documents` | không đồng bộ iCloud | `ls ~/Library/Mobile Documents` |

## Khối lệnh từng phiên (dán nguyên khối; dưới là các dòng `/goal` thầy gõ theo thứ tự)

### CI1 — P-01
```
Bạn là phiên CI1 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/ci-kiem-tra, cắt từ origin/main. Hàng: P-01. Cùng lúc có thể đang chạy FE1, FB1, T1 (và SB1); không chạm nhánh của họ.

Đọc trước, từ origin/main (git show origin/main:<đường dẫn>): CLAUDE.md gốc · docs/kien-truc/KE-HOACH.md · docs/kien-truc/plans/P-01-ci-kiem-tra.md (dòng ⟳ thắng dòng dưới nó) · src/lop-hoc-ao/docs/LUAT-DA-CHOT.md §7 · src/lop-hoc-ao/tools/test/kiem-tra.js.

Trước khi viết gì: node --version và npx playwright --version chạy được (nếu không, báo thầy brew install node rồi dừng) · git log -1 cho thấy lane cắt từ origin/main · python3 src/lop-hoc-ao/tools/build.py thoát 0 trên lane chưa sửa · đo lại dòng "Node / Playwright" ở bảng trạng thái và nói gì đã đổi.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Push ngay khi P-01 xong (mọi lane khác rebase lên tip này) rồi mới làm gì khác.

Kết phiên: push lane · báo cáo 6 dòng cho hàng · cập nhật trạng thái P-01 trong KE-HOACH.md và một dòng CHANGELOG (nhánh này, thầy gộp) · dòng walk · trả lại tip đã push hoặc link PR, việc thầy làm tiếp, lane nào rebase lên bạn được rồi. Không gì khác.
```
```
/goal P-01 xong: package.json gốc có scripts test và build; tools/test/chay-tat-ca.mjs chạy mọi tools/test/*.mjs và src/lop-hoc-ao/tools/test/*.js theo tên file (không danh sách cứng), ghi .ci/rc.txt; đường dẫn /opt/pw-browsers trong test đổi thành process.env.PW_DIR có mặc định; .github/workflows/ci.yml chạy build rồi npm test trên pull_request và push main; CLAUDE.md gốc ghi cách cài Node; .gitignore có .ci/ và node_modules/. Sự thật: kiem-tra.js cần dist/ đã build trước; không commit games/lop-hoc-ao/**/index.html. npm test in 0 từ cat .ci/rc.txt trong transcript; git status chỉ hiện package.json, package-lock.json, .github/workflows/ci.yml, tools/test/chay-tat-ca.mjs, src/lop-hoc-ao/tools/test/*.js, CLAUDE.md, .gitignore; lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
```

### CI2 — P-02
```
Bạn là phiên CI2 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/ci-kiem-tra, tiếp từ tip CI1. Hàng: P-02. Cùng lúc có thể đang chạy FE2, FB2, T2 (và SB2); không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-02-deploy-ci.md (dòng ⟳ thắng) · .github/workflows/giong-doc.yml · src/lop-hoc-ao/tools/build.py · src/lop-hoc-ao/CLAUDE.md. Trên lane: package.json và ci.yml mà CI1 đã tạo.

Trước khi viết gì: git log -1 là tip CI1 · npm test in 0 trên lane chưa sửa · git ls-files | grep -c 'games/lop-hoc-ao/.*index.html' (ghi số, phải về 0 cuối phiên) · kiểm tra lại nhánh wip/t27-tu-luyen-dang-them còn chứa file build hay không.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-02 trong KE-HOACH.md + CHANGELOG · dòng walk ("Settings › Pages › Source = GitHub Actions; bảo vệ main") · link PR (tiêu đề "CI: kiểm tra và deploy Pages", base main). Không gì khác.
```
```
/goal P-02 xong: .github/workflows/deploy.yml build rồi deploy Pages khi push main; tools/build_all.py chạy mọi tools/build_*.py theo tên (P-19 chỉ thêm script, không sửa workflow); giong-doc.yml lấy input qua env:, fetch-depth 0, bỏ if: always(), mở PR thay vì push main; .gitignore có games/lop-hoc-ao/**/index.html, src/lop-hoc-ao/dist/, tools/__pycache__/ và các file đó đã git rm --cached; build.py lấy số bản từ GITHUB_SHA hoặc git rev-parse --short HEAD; CLAUDE.md gốc quy tắc 4, src/lop-hoc-ao/CLAUDE.md bước 6–7, README.md đã sửa. Sự thật: deploy Pages cần .nojekyll trong artifact. npm test in 0 từ cat .ci/rc.txt; git status chỉ hiện các file trên; lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
```

### FE1 — P-03
```
Bạn là phiên FE1 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/fe-sach, cắt từ origin/main. Hàng: P-03. Cùng lúc có thể đang chạy CI1, FB1, T1 (và SB1); không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-03-design-tokens.md (dòng ⟳ thắng) · src/lop-hoc-ao/docs/LUAT-DA-CHOT.md §2 và §6j · src/lop-hoc-ao/js/core/22-do-hoa-pixel-mau-logo-clb.js dòng 1–3 · src/lop-hoc-ao/js/core/80-phong-cach-lms.js · khối :root của src/lop-hoc-ao/css/app.css, index.html, games/tu-duy-bebras/_kit/kit.css.

Trước khi viết gì: git log -1 cho thấy lane cắt từ origin/main · python3 src/lop-hoc-ao/tools/build.py thoát 0 · chụp ảnh gốc 320/375/414/900 của app học sinh (demo), trang Quản lý, trang chủ, game robot-tim-duong bằng Playwright python vào .ci/anh-goc/ (không commit) · nói sẽ rebase lên tip CI1 khi nó push.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Rebase lên tip CI1 khi nó push và khi kết phiên; sau đó npm test in 0. Push ngay khi P-03 xong (DS cần).

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-03 trong KE-HOACH.md + CHANGELOG · dòng walk · tip đã push. Không gì khác.
```
```
/goal P-03 xong: design/tokens.json là nguồn, tools/tokens.py sinh design/tokens.css (git diff trống khi sinh lại); app.css, kit.css, index.html giữ tên biến cũ trỏ sang --jc-*; app.template.html include tokens.css trước app.css; tools/check_contrast.py in 0 cặp dưới 4.5/3.0 hoặc liệt kê cặp cần thầy quyết; ảnh chụp 4 trang × 4 khổ so với .ci/anh-goc sai số ≤ 0.1%. Sự thật: PXC trong JS vẽ canvas không đọc CSS, chỉ ghi chú nguồn; học sinh pixel, LMS kiểu Classroom, luôn nền sáng, không đổi. Chỉ sửa design/, tools/tokens.py, tools/check_contrast.py, app.css, kit.css, index.html, app.template.html; build.py thoát 0 (npm test in 0 nếu CI1 đã push); lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
```

### FE2 — P-08
```
Bạn là phiên FE2 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/fe-sach, tiếp từ tip FE1. Hàng: P-08. Cùng lúc có thể đang chạy CI2, FB2, T2 (và SB2); không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-08-csp-font-sri.md (dòng ⟳ thắng) · docs/kien-truc/AUDIT-2026-10-25.md mục 3 (GL-H3, GL-M1, GL-M3, GL-M4) · TIEU_CHI.md §7 · src/lop-hoc-ao/js/core/62-may-chu.js dòng 10–17 · games/tu-duy-bebras/_kit/kit.js dòng 90–100 và 195–200. Trên lane: design/tokens.css của FE1.

Trước khi viết gì: git log -1 là tip FE1 · npm test in 0 (hoặc build.py thoát 0 nếu CI1 chưa push) · liệt kê bằng grep mọi URL fonts.googleapis, fonts.gstatic, translate.google trong *.html, *.js, *.py (ghi số, phải về 0 trừ docs) · xác nhận không lane nào khác sửa games/**/index.html lúc này (git branch -r, diff).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Push ngay khi P-08 xong (RF1 và GL mở từ tip này).

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-08 + CHANGELOG · dòng walk ("mở 1 game mỗi họ, không yêu cầu ra Google trong Network") · link PR (tiêu đề "FE sạch: token chung, CSP, chữ tự host", base main). Không gì khác.
```
```
/goal P-08 xong: assets/fonts/*.woff2 (subset vietnamese) + fonts.css; 17 trang game và index.html, app.template.html không còn link Google Fonts, có meta Content-Security-Policy và referrer no-referrer; index.html bỏ document.write, games.js?v=__SHA__; 62-may-chu.js tải 3 file Firebase compat có integrity và crossorigin, hash ghi docs/SRI.md; mam-non, tham-tu, tieu-hoc bỏ translate_tts; kit.js ép n thành số; tools/test/khong-goi-ngoai.mjs duyệt 21 trang và in 0 yêu cầu ra ngoài danh sách cho phép. Sự thật: đổi FB_VER thì hash SRI đổi; speechSynthesis không có tiếng Việt trên mọi máy nên giữ nút loa báo. npm test in 0; check_fit.py không pageerror; git status chỉ hiện assets/fonts, index.html, app.template.html, 62-may-chu.js, games/**/index.html, kit.js, tools/test/khong-goi-ngoai.mjs, docs/SRI.md; lane đã push. Hoặc dừng sau 50 lượt và báo cáo.
```

### FB1 — P-04
```
Bạn là phiên FB1 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: fix/firebase-va, cắt từ origin/main. Hàng: P-04. Cùng lúc có thể đang chạy CI1, FE1, T1 (và SB1); không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · src/lop-hoc-ao/CLAUDE.md · docs/kien-truc/plans/P-04-firestore-rules.md (dòng ⟳ thắng) · docs/kien-truc/AUDIT-2026-10-25.md mục 1 · src/lop-hoc-ao/firebase/firestore.rules · src/lop-hoc-ao/js/core/62-may-chu.js dòng 1–60 · src/lop-hoc-ao/docs/LUAT-DA-CHOT.md §6i.

Trước khi viết gì: git log -1 cho thấy lane cắt từ origin/main · build.py thoát 0 · firebase emulators cài được (npx firebase-tools --version; cần Java) — nếu không, báo và dùng cách chạy tay · nói sẽ rebase lên tip CI1 khi nó push.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Rebase lên tip CI1 khi nó push và khi kết phiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-04 + CHANGELOG + LUAT §6i (luật mới, còn LH-H1) · dòng walk ("dán rules mới vào Firestore › Rules; xoá collection login nếu trống") · tip đã push. Không gì khác.
```
```
/goal P-04 xong: firestore.rules mới theo kế hoạch con (org/main đọc cần hasMe; users đọc chỉ chính chủ hoặc QL; hs ghi chỉ các khoá j, ev, lop, t, j là string dưới 900000, lop không đổi; login đọc false; asg đọc/ghi theo lớp); 62-may-chu.js không tra login/ trước đăng nhập; tools/test/rules.test.mjs 12 ca đạt trên emulator (hoặc kết quả chạy tay dán vào transcript); node tools/test/dong-bo.js ĐẠT; CHANGELOG ghi còn LH-H1 cho P-06. Sự thật: org() là một get, tối đa 10 get mỗi yêu cầu; GV vẫn ghi j ở bước này. git status chỉ hiện firestore.rules, firebase.json, 62-may-chu.js, tools/test/rules.test.mjs, CHANGELOG.md, LUAT-DA-CHOT.md; lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
```

### FB2 — P-05
```
Bạn là phiên FB2 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: fix/firebase-va, tiếp từ tip FB1. Hàng: P-05 (gồm một dòng của P-07: xoá jennyHSc_*, jennyVirtualDemo_v10, window.qlMK khi đăng xuất ở 62-may-chu.js, theo luật F-c 25/10). Cùng lúc có thể đang chạy CI2, FE2, T2 (và SB2); không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-05-firebase-auth.md (dòng ⟳ thắng) · plans/P-07-bo-demo-khoi-ban-that.md mục "62-may-chu.js:29" · src/lop-hoc-ao/js/core/75-nhap-excel.js dòng 1–12 · 77-phu-huynh-tu-dong.js dòng 1–10 · 62-may-chu.js dòng 130–150 · LUAT-DA-CHOT.md §6j (phiếu in mật khẩu).

Trước khi viết gì: git log -1 là tip FB1 · npm test in 0 · grep -rn jenny123 src/lop-hoc-ao/js | wc -l (ghi số, phải về 0).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-05 + CHANGELOG · dòng walk (4 nút trong docs/FIREBASE-CONSOLE.md) · link PR (tiêu đề "Firebase: siết rules, mật khẩu ngẫu nhiên, App Check", base main). Không gì khác.
```
```
/goal P-05 xong: tạo học sinh (nút Thêm, Excel) và phụ huynh dùng fbMKGoiY, ghi mustChange true, mật khẩu chỉ hiện trên phiếu in trong phiên, window.qlMK xoá khi đăng xuất; đăng nhập có mustChange thì hộp thoại pixel bắt đổi (không prompt()); App Check reCAPTCHA v3 khởi tạo ở chế độ theo dõi; rules cho chính chủ sửa đúng trường mustChange; nút QL đặt lại mật khẩu ngẫu nhiên cả lớp; fbDangXuat xoá jennyHSc_*, jennyVirtualDemo_v10; src/lop-hoc-ao/docs/FIREBASE-CONSOLE.md 4 việc thầy bật; grep jenny123 trong src/lop-hoc-ao/js = 0. Sự thật: Enforce App Check sai khoá làm hỏng mọi đọc ghi, chỉ theo dõi. npm test in 0; node tools/test/dong-bo.js ĐẠT; git status chỉ hiện 62, 75, 77, firestore.rules, FIREBASE-CONSOLE.md, CHANGELOG.md; lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
```

### T1 — P-07 + P-09a
```
Bạn là phiên T1 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: chore/bo-demo-rieng-tu, cắt từ origin/main. Hàng: P-07 rồi P-09a. Cùng lúc có thể đang chạy CI1, FE1, FB1 (và SB1); không chạm nhánh của họ. Luật F-c 25/10: không sửa 62-may-chu.js (dòng xoá localStorage do FB2 làm).

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-07-bo-demo-khoi-ban-that.md và P-09-rieng-tu.md phần P-09a (dòng ⟳ thắng) · AUDIT mục 3 (GL-C1, GL-M2) và mục 4 · src/lop-hoc-ao/tools/_student.py, _teacher.py, build.py · tools/check_fit.py dòng 120–130 · README.md mục Hành Trình và Lớp Học Ảo · TIEU_CHI.md §7.

Trước khi viết gì: git log -1 cho thấy lane cắt từ origin/main · build.py thoát 0 · git grep -i -c jenny123 (ghi số) · nói sẽ rebase lên tip CI1 khi nó push.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Rebase lên tip CI1 khi nó push và khi kết phiên. Push ngay khi P-07 xong (RF1 cần).

Kết phiên: push lane · báo cáo 6 dòng mỗi hàng · trạng thái P-07, P-09a + CHANGELOG · dòng walk ("đổi mã CLB, chạy build_bank.py và build_bank_th.py, commit bank.enc mới; duyệt 4 văn bản riêng tư") · tip đã push. Không gì khác.
```
```
/goal P-07 xong: _student.py có --demo; bản thật không còn ACC và nhánh offline hash; bản demo ở games/lop-hoc-ao/demo/ có noindex và dải "Bản thử"; _teacher.py bỏ PW giaovien123, bản demo GV/PH/QL dưới demo/; build.py gọi cả hai; check_fit.py đọc JENNY_CLB_CODE từ môi trường; lop-6 và tieu-hoc dùng sessionStorage cho jenny-club-code; games.js có thẻ demo hidden; README bảng tài khoản ghi "chỉ bản thử". Sự thật: không chạm 62-may-chu.js; lebaona giữ ở demo. grep jenny123 và giaovien123 trong games/lop-hoc-ao/index.html và */index.html ngoài demo/ = 0; git grep -i jenny123 -- ':!docs' = 0; build.py thoát 0; git status chỉ hiện _student.py, _teacher.py, build.py, check_fit.py, 2 index.html saga, games.js, README.md, .gitignore; lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
```
```
/goal P-09a xong: rieng-tu/index.html (trang chính sách ngắn cho phụ huynh), docs/rieng-tu/PHIEU-DONG-Y.md, HO-SO-CHUYEN-DU-LIEU.md, DANH-MUC-DU-LIEU.md (bảng trường · nguồn · mục đích · nơi lưu · thời hạn · ai xem) theo kế hoạch con; index.html chân trang và màn đăng nhập (_student.py overlay) có liên kết Riêng tư. Sự thật: văn bản chờ thầy duyệt, ghi "bản nháp" ở đầu. git status chỉ hiện rieng-tu/, docs/rieng-tu/, index.html, _student.py; lane đã push. Hoặc dừng sau 25 lượt và báo cáo.
```

### T2 — P-10
```
Bạn là phiên T2 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: chore/bo-demo-rieng-tu, tiếp từ tip T1. Hàng: P-10. Cùng lúc có thể đang chạy CI2, FE2, FB2 (và SB2); không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-10-sao-luu.md (dòng ⟳ thắng) · AUDIT mục 4 · src/lop-hoc-ao/js/core/62-may-chu.js dòng 1–12 (tên collection) · .github/workflows/giong-doc.yml (mẫu workflow).

Trước khi viết gì: git log -1 là tip T1 · npm test in 0 · hỏi thầy đã tạo kho jenny-backup, service account, khoá age và 3 secret chưa (nếu chưa, xây workflow và script, chạy thử với emulator Firestore, đánh dấu E).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-10 + CHANGELOG + CLAUDE.md gốc ghi nơi sao lưu · dòng walk ("dán 3 secret, chạy workflow_dispatch, giải mã trên máy") · link PR (tiêu đề "Bỏ demo khỏi bản thật, riêng tư, sao lưu tuần", base main). Không gì khác.
```
```
/goal P-10 xong: .github/workflows/sao-luu.yml chạy cron chủ nhật 20:00 UTC và workflow_dispatch, permissions contents read, dùng FIREBASE_SA_JSON, BACKUP_PUBKEY, BACKUP_REPO_TOKEN; tools/sao-luu/firestore-dump.mjs xuất mọi collection, mã hoá age, gh release upload lên kho riêng tư, giữ 12 bản; firestore-restore.mjs khôi phục vào emulator đủ số document; tools/sao-luu/README.md 5 bước khôi phục. Sự thật: Spark không có gcloud export; service account chỉ ở Secrets. Chạy thử trên emulator dán vào transcript; npm test in 0; git status chỉ hiện sao-luu.yml, tools/sao-luu/, CLAUDE.md, CHANGELOG.md; lane đã push. Hoặc dừng sau 35 lượt và báo cáo.
```

### SB1 — P-11 (chỉ khi Q1 = B)
```
Bạn là phiên SB1 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/supabase, cắt từ origin/main. Hàng: P-11. Thầy đã trả lời Q1 = B trong KE-HOACH.md; nếu chưa, dừng và báo. Cùng lúc có thể đang chạy CI1, FE1, FB1, T1; không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · lms-thu/HUONG_DAN.md · docs/kien-truc/plans/P-11-supabase-migration.md (dòng ⟳ thắng) · AUDIT mục 2 (SB-H1, SB-H2, SB-M1…M7, bảng RPC) · lms-thu/setup.sql toàn bộ · lms-thu/sdk.js, app.html dòng 100–130 và 480–495.

Trước khi viết gì: git log -1 cho thấy lane cắt từ origin/main · supabase CLI và Docker chạy được (supabase start) — nếu không, báo thầy cài và dừng · supabase db reset với setup.sql hiện tại chạy sạch · nói sẽ rebase lên tip CI1 khi nó push.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Rebase lên tip CI1 khi nó push và khi kết phiên. Push ngay khi P-11 xong (SB2 tiếp).

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-11 + CHANGELOG · AUDIT đánh ☑ các mã SB · dòng walk ("Supabase › Auth tắt đăng ký công khai; đặt settings.admin_emails; supabase db push") · tip đã push. Không gì khác.
```
```
/goal P-11 xong: supabase/config.toml, migrations/0001_init.sql (= setup.sql), 0002_bao_mat.sql gồm 9 mục của kế hoạch con (khoá advisory + login_attempts có index + lùi theo cấp số, s_class không trả id; admin theo settings.admin_emails; pin_hash bcrypt; s_logout + phiên 7 ngày trượt; l_save kiểm item; k_set_attendance kiểm lớp; deleted_at + updated_at trigger; check correct <= total + trần 30/giờ; index còn thiếu, log còn thiếu, revoke all on all tables); test 20 s_login song song sai PIN chỉ 5 được xử lý; app.html có rel noopener dòng 488, sdk.js không hiện lỗi thô; HUONG_DAN.md cập nhật; app.html và hs.html chạy trọn vòng trên supabase start. Sự thật: Free tạm dừng sau 7 ngày không dùng — thêm giu-am.yml; advisory lock không gọi trong vòng lặp. git status chỉ hiện supabase/, lms-thu/, .github/workflows/giu-am.yml, CHANGELOG, AUDIT; lane đã push. Hoặc dừng sau 50 lượt và báo cáo.
```

### SB2, SB3 — P-12a, P-12b (chỉ khi Q1 = B)
```
Bạn là phiên SB2 (hoặc SB3) của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/supabase, tiếp từ tip SB1 (SB3: tip SB2). Hàng: P-12a schema + RPC (SB3: P-12b lớp đồng bộ trong app). Cùng lúc có thể đang chạy CI2, FE2, FB2, T2 (SB3: KT, GL, DS, RF1); không chạm nhánh của họ. Luật F-c 25/10: dòng include 62b thêm ở cuối danh sách include của app.template.html.

Đọc trước, từ origin/main: CLAUDE.md gốc · src/lop-hoc-ao/CLAUDE.md · docs/kien-truc/plans/P-12-dong-bo-supabase.md (dòng ⟳ thắng) · KIEN-TRUC-DICH.md mục 4 · 62-may-chu.js toàn bộ (tên hàm phải giữ) · 79-dong-bo.js · 11, 64, 49, 51, 18 phần cộng xu/sao · LUAT §6 (luật xu). Trên lane: migrations 0001, 0002.

Trước khi viết gì: git log -1 đúng tip · supabase db reset sạch · npm test in 0 · grep mọi chỗ sửa st.coins và sao (số dòng).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-12 + CHANGELOG · dòng walk (SB3: "supabase functions deploy tao-tai-khoan; supabase db push") · SB3: link PR (tiêu đề "Supabase: máy chủ cho Lớp học ảo", base main). Không gì khác.
```
```
/goal P-12a xong: migrations/0003_lop_hoc_ao.sql với các bảng accounts, enrollments, guardians, guardian_students, progress, answers, wallet, wallet_log, teacher_notes, class_settings; RPC h_boot, h_answer (tính xu sao theo LUAT §6, ghi wallet_log), h_buy, h_game_end (trần 20), h_save_misc (≤ 200 KB), các q_* ánh xạ 1-1 hàm QL hiện có và ghi audit_log; Edge Function tao-tai-khoan (service role, chỉ QL); pgTAP hoặc test node cho h_answer (10 ca luật xu). Sự thật: khoá service role không bao giờ vào trang. supabase db reset sạch; test đạt; git status chỉ hiện supabase/; lane đã push. Hoặc dừng sau 50 lượt và báo cáo.
```
```
/goal P-12b xong: js/core/62b-may-chu-supabase.js cùng tên hàm với 62 nhưng gọi supabase.rpc; window.MAY_CHU chọn máy chủ; 11, 64, 49, 51, 18 đọc xu sao từ RPC khi MAY_CHU là supabase; 79-dong-bo.js có hàng đợi answers_pending gửi lại theo thứ tự với client_id unique; tools/test/dong-bo-supabase.js ĐẠT; trọn vòng 4 vai trên supabase start; console coins=1e6 không đổi xu sau tải lại; mất mạng giữa màn rồi nối lại không trùng câu. Sự thật: giữ 62-may-chu.js để quay lại Firebase; include 62b ở cuối danh sách. npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện 62b, 11, 64, 49, 51, 18, 79, app.template.html, dong-bo-supabase.js, CHANGELOG; lane đã push. Hoặc dừng sau 60 lượt và báo cáo.
```

### SB4 — P-13 (chỉ khi Q1 = B)
```
Bạn là phiên SB4 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/supabase, tiếp từ tip SB3. Hàng: P-13. Cùng lúc có thể đang chạy FB5, RF2; không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-13-chuyen-du-lieu.md (dòng ⟳ thắng) · tools/sao-luu/README.md (T2) · 62-may-chu.js dòng 1–12 · LUAT §6i.

Trước khi viết gì: git log -1 là tip SB3 · npm test in 0 · có ít nhất 1 bản sao lưu P-10 đã chạy (hỏi thầy; nếu chưa, xây script trên dữ liệu demo và đánh dấu E).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-13 + CHANGELOG + LUAT §6i (đổi máy chủ, ngày) + README, src/lop-hoc-ao/CLAUDE.md mục máy chủ · dòng walk ("chạy script chuyển trên máy thầy; duyệt bảng so sánh; chọn ngày cắt") · link PR (tiêu đề "Chuyển máy chủ sang Supabase", base main). Không gì khác.
```
```
/goal P-13 xong: tools/chuyen/firebase-sang-supabase.mjs đọc bản sao lưu JSON và ghi qua service role với on conflict do nothing, in bảng so sánh số học sinh, lớp, đảo đã qua, xu; tools/chuyen/README.md bảng ánh xạ; cờ MAY_CHU có giá trị ca-hai cho tuần song song và script so khớp hằng ngày; sao-luu.yml thêm pg_dump; tài liệu cắt chuyển và tắt Firebase sau 30, 90 ngày. Sự thật: mật khẩu Firebase scrypt nhập qua supabase auth import, thử 1 tài khoản trước; không chạy chuyển hai lần không có on conflict. Chạy thử trên dữ liệu demo dán vào transcript; npm test in 0; git status chỉ hiện tools/chuyen/, sao-luu.yml, app.template.html, README.md, CLAUDE.md, LUAT, CHANGELOG; lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
```

