# Lộ trình chạy song song — kế hoạch kiến trúc (cắt ngày 25/10/2026)

Cắt từ `docs/kien-truc/KE-HOACH.md` theo file nào dùng chung, việc nào chờ ai; chạy rộng nhất có thể.

Từ dùng trong file này:

- **lane**: một nhánh git chạy liền một dãy phiên.
- **phiên**: một lần mở Claude Code mới, tối đa 8–9 giờ việc.
- **tip**: commit đã push của một lane.
- **walk**: thầy tự kiểm tra trên trang thật.

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

## Bảng "người dùng thấy gì" và gói (bundle)
Một vòng = một PR + CI xanh + thầy xem và gộp (≈ 30–45 phút của thầy). Hàng dưới 4 giờ không đáng một vòng riêng → gộp.

| Gói | Hàng | Người dùng thấy gì | Giờ |
|---|---|---|---|
| G-CI | P-01 → P-02 | không (nền; Pages vẫn như cũ) | 10 |
| G-FE | P-03 → P-08 | trang mở nhanh hơn, 3 game đọc đề bằng giọng máy | 14 |
| G-FB | P-04 → P-05 → P-06a → P-06b → P-09b | đổi mật khẩu lần đầu; phiếu in mật khẩu ngẫu nhiên; ô Năm sinh | 31 |
| G-T | P-07 + P-09a → P-10 | bản thật không còn `jenny01`; trang Riêng tư; (sao lưu: không) | 12 |
| G-SB | P-11 → P-12a → P-12b → P-13 | không (cùng màn hình), chỉ khi Q1 = B | 38 |
| G-RF | P-14a → P-14b → P-15a → P-15b → P-16 | nhanh hơn, cài lên điện thoại, chạy ngoại tuyến | 42 |
| G-KT | P-17 | không | 6 |
| G-GL | P-19 | nút to hơn, o-so-bi-an chuẩn HTML | 8 |
| G-DS | P-18 | không trực tiếp; chỉ khi Q4 = có | 6 |

Vòng = gói, không phải hàng: 9 gói cho 19 hàng. P-09a (3 giờ, văn bản) đi cùng P-07 vì cùng một phiên nhỏ và không chạm file nào của lane khác.

## Phân loại phụ thuộc và luật F-c (file chung do chọn, bỏ bằng một luật)
| Hàng | Chung file với | Loại | Xử lý |
|---|---|---|---|
| P-02 ↔ P-01 | `CLAUDE.md`, `package.json` | F-s | một lane, P-02 sau P-01 |
| P-08 ↔ P-03 | `index.html`, `app.template.html`, `kit.css` | F-s | một lane, P-08 sau P-03 |
| P-05, P-06 ↔ P-04 | `62-may-chu.js`, `firestore.rules` | F-s | một lane |
| P-07 ↔ P-05 | `62-may-chu.js:29` (1 dòng xoá localStorage) | **F-c** | Luật 25/10: P-07 không chạm `62`; P-05 thêm dòng đó |
| P-17 ↔ P-01 | `ci.yml`, `chay-tat-ca.mjs` | **F-c** | Luật 25/10: P-01 cho `npm test` chạy mọi `tools/test/*.mjs` theo tên; P-17 chỉ thêm file + `giao-dien.yml` |
| P-19 ↔ P-02 | `deploy.yml` (sinh `tham-tu`) | **F-c** | Luật 25/10: P-02 tạo `tools/build_all.py` chạy mọi `tools/build_*.py`; P-19 chỉ thêm script |
| P-12 ↔ P-08/P-14 | `app.template.html` (1 dòng include) | **F-c** | Luật 25/10: P-12 thêm include ở cuối danh sách; rebase tầm thường |
| P-12b ↔ P-06 | `11`, `64`, `49`, `51`, `79` | loại trừ nhau theo Q1 | không bao giờ cùng chạy |
| P-14b ↔ lane `wip/t27` | `72-tu-luyen.js` | X | gộp t27 vào `main` trước phiên RF2 |
| P-09b ↔ P-06 | `70`, `75`, `78` | F-s | cuối lane G-FB (A) hoặc sau P-12b (B) |
| Mọi hàng | `CHANGELOG.md`, `TASKS.md`, `LUAT-DA-CHOT.md` | F-c đã có luật | ghi mục mới lên đầu; xung đột giữ cả hai (CLAUDE.md quy tắc 5) |
| P-14a | tip của P-01, P-07, P-08 | chờ push | mở khi 3 tip đã push (sớm nhất ngày 3) |
| P-05, P-06, P-10, P-11, P-13, P-18 | thầy bật nút / dán rules / duyệt | E | xây trước, **đọc** kết quả sau khi thầy làm |
| P-05 App Check Enforce; P-13 chạy song song | 1 tuần số liệu | D | bật theo dõi ngay, đọc số sau 7 ngày |
| P-06, P-11–13, P-09b, P-18 | Q1, Q2, Q4 | E (quyết định) | **chỉ xây** khi thầy đã trả lời; không mở phiên trước |

Sau luật F-c: 9 gói chỉ còn chia sẻ file **bên trong** gói → độ rộng = số gói mở được cùng lúc.

## Bảng phiên
| Phiên | Lane (nhánh) | Hàng | Giờ | Mở từ | Rebase lên, khi nào | Hạ cánh |
|---|---|---|---|---|---|---|
| CI1 | `feature/ci-kiem-tra` | P-01 | 5 | `origin/main` | — ; **push ngay khi xong** (mọi lane rebase lên) | PR đợt 1 |
| CI2 | cùng lane | P-02 | 5 | tip CI1 | — | PR đợt 1 |
| FE1 | `feature/fe-sach` | P-03 | 6 | `origin/main` | tip CI1 khi push (để chạy `npm test`) | PR đợt 1 |
| FE2 | cùng lane | P-08 | 8 | tip FE1 | — ; push ngay khi xong (RF, GL cần) | PR đợt 1 |
| FB1 | `fix/firebase-va` | P-04 | 5 | `origin/main` | tip CI1 khi push | PR đợt 1 |
| FB2 | cùng lane | P-05 | 5 | tip FB1 | — | PR đợt 1 |
| FB3, FB4 | cùng lane | P-06a, P-06b (Q1 = A) | 8 + 8 | tip FB2 | — | PR đợt 2 |
| FB5 | cùng lane | P-09b (Q2) | 5 | tip FB4 (A) / SB3 (B) | — | PR đợt 2 |
| T1 | `chore/bo-demo-rieng-tu` | P-07 + P-09a | 7 | `origin/main` | tip CI1 khi push; push ngay khi xong (RF cần) | PR đợt 1 |
| T2 | cùng lane | P-10 | 5 | tip T1 | — | PR đợt 1 |
| SB1–SB4 | `feature/supabase` (Q1 = B) | P-11 → P-12a → P-12b → P-13 | 8+8+8+6 | `origin/main` | tip CI1 khi push | PR đợt 2 |
| KT | `feature/kiem-tra-giao-dien` | P-17 | 6 | tip CI1 | — | PR đợt 2 |
| GL | `chore/game-le-kit` | P-19 | 8 | tip FE2 | — | PR đợt 2 |
| DS | `chore/design-system` (Q4) | P-18 | 6 | tip FE1 | — | PR đợt 2 |
| RF1–RF5 | `feature/vite-module` | P-14a → P-14b → P-15a → P-15b → P-16 | 8+8+6+6+6 | tip CI1 + T1 + FE2 | `main` sau khi đợt 1 gộp; t27 trước RF2 | PR đợt 3 |

**Độ rộng:** 4 phiên cùng lúc (5 khi Q1 = B). Bất kì tập con nào cũng chạy được; phần còn lại xếp hàng.

**Đường tới hạn:** FE1 → FE2 → RF1 → RF2 → RF3 → RF4 → RF5 = 48 giờ = 7 phiên; không gì xong sớm hơn.

## Bảng ngày (1 phiên mỗi lane mỗi ngày)
| Ngày | Phiên chạy | Thầy làm |
|---|---|---|
| 0 | — | trả lời Q1–Q4 trong `KE-HOACH.md`; `brew install node` |
| 1 | CI1 · FE1 · FB1 · T1 · (SB1) | duyệt văn bản riêng tư (P-09a); đổi mã CLB, build `bank.enc` mới |
| 2 | CI2 · FE2 · FB2 · T2 · (SB2) | dán `firestore.rules`; Pages Source = Actions; bảo vệ `main`; 4 nút Firebase console; tạo kho sao lưu + 3 secret |
| 3 | KT · GL · DS · FB3 · (SB3) · RF1 | **walk đợt 1** trên Pages (đăng nhập 4 vai, chơi 1 đảo, 1 game Bebras, trang chủ); gộp PR đợt 1 |
| 4 | FB4 · RF2 · (SB4) | duyệt ảnh design system; (B: chạy script chuyển, chọn ngày cắt) |
| 5 | FB5 · RF3 | **walk đợt 2**; gộp PR đợt 2 |
| 6 | RF4 | — |
| 7 | RF5 | **walk đợt 3** (cài PWA lên điện thoại, tắt mạng, học 1 đảo); gộp PR đợt 3 |
| 8–14 | — | đọc số: App Check (bật Enforce), (B: so khớp song song rồi cắt chuyển) |

Đường đo (M): kích cỡ trang (P-15 DONE 1), Lighthouse (P-15, P-16), 20 đăng nhập song song sai PIN (P-11), thời gian CI < 10 phút (P-17). Đọc ở walk của đợt tương ứng.

Thứ tự bỏ nếu thiếu thời gian (bỏ cuối trước): DS → GL → RF5 → RF4 → KT. **Không bỏ** FB1, FB2, T1, CI1 trước khi nhập tên thật.

## Luật mọi lane
- Mỗi lane là một worktree trong `~/worktrees/` (không đặt trong `~/Documents`): `git -C ~/Documents/JennyMathClubGame worktree add --no-track -b <lane> ~/worktrees/<lane> origin/main && git -C ~/worktrees/<lane> push -u origin <lane>`. Sau đó `npm ci` (khi CI1 đã push), `pip install playwright`.
- Không commit `games/lop-hoc-ao/**/index.html`, `src/lop-hoc-ao/dist/` (quy tắc 4 `CLAUDE.md` gốc; sau CI2 chúng ra khỏi git).
- Kiểm tra: trước khi CI1 push → `python3 src/lop-hoc-ao/tools/build.py` thoát 0 + DONE của hàng; sau → `npm test` ghi `.ci/rc.txt` = 0, dán vào transcript.
- `git status` chỉ hiện file trong đường dẫn cho phép của hàng (ghi trong kế hoạch con).
- Phiên cuối của lộ trình xoá worktree đã gộp: `git -C ~/Documents/JennyMathClubGame worktree remove ~/worktrees/<lane>`.
- Chế độ: **có thầy ngồi cùng** (thầy gõ từng `/goal`). Phiên qua đêm không dùng ở lộ trình này vì mỗi hàng cần thầy duyệt một điểm.

## So sánh trước và sau
| Đo | Kế hoạch theo giai đoạn | Lộ trình này | Vì sao |
|---|---|---|---|
| Phiên và cỡ | 19 hàng chạy lần lượt, 2 hàng 16 giờ | 22 phiên ≤ 8 giờ, trong 9 lane | hàng 16 giờ tách đôi; không phiên nào đọc lại ngữ cảnh sau nén |
| Độ rộng | 1 | 4 (5 khi B) | 4 luật F-c; file chung còn lại nằm trong gói |
| Lịch tới "xây xong" | ≈ 19 ngày | 7 ngày (A); 7 ngày + 1 tuần chạy song song (B) | chỉ chuỗi FE → RF còn trên đường tới hạn |
| Lịch tới "chạy thật" | 19 ngày + walk sau mỗi hàng | 3 walk (ngày 3, 5, 7) | walk gộp theo đợt |
| Lần thầy chạm | ≈ 19 lần gộp + 19 lần xem | 3 walk + ≈ 9 lần gộp PR + 10 việc console (bảng ngày) | lane của một đợt gộp cùng lúc |
| Giá của lộ trình | — | 4 luật F-c trên hàng chưa xây; 3 lần rebase có tên; thầy theo 4 phiên cùng lúc ngày 1–3 | |

## Việc tiếp theo, theo mốc
1. **Ngay:** thầy trả lời Q1–Q4 (`KE-HOACH.md`); gộp PR của nhánh `chore/audit-kien-truc` để kế hoạch lên `main`; `brew install node`.
2. **Ngày 1:** mở 4 phiên CI1, FE1, FB1, T1 bằng 4 khối lệnh dưới (mỗi khối một worktree). Q1 = B thì mở thêm SB1.
3. **Khi CI1 push:** FE1, FB1, T1 (và SB1) rebase lên tip CI1, chạy `npm test`.
4. **Khi FE2 và T1 push** (CI1 đã push trước đó): mở RF1.
5. **Walk đợt 1 (ngày 3):** gộp PR CI, FE, FB (P-04, P-05), T; chạy build trên `main` (CI tự deploy sau CI2).
6. **Walk đợt 2 và 3** (ngày 5, ngày 7): như trên. Sau đợt 3: xoá worktree, ghi CHANGELOG.

---

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

### FB3, FB4 — P-06a, P-06b (chỉ khi Q1 = A)
```
Bạn là phiên FB3 (hoặc FB4) của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: fix/firebase-va, tiếp từ tip FB2 (FB4: tip FB3). Hàng: P-06a cấu trúc + chuyển đổi (FB4: P-06b ví xu + rules + test). Thầy đã trả lời Q1 = A trong KE-HOACH.md; nếu chưa, dừng và báo. Cùng lúc có thể đang chạy KT, GL, DS, RF1 (FB4: RF2); không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · src/lop-hoc-ao/CLAUDE.md · docs/kien-truc/plans/P-06-tach-org-blob.md (dòng ⟳ thắng) · AUDIT mục 1 (LH-H1, LH-H4) · 62-may-chu.js, 79-dong-bo.js, 58-lop-va-quan-ly.js toàn bộ · docs/KIEN-TRUC.md mục Dữ liệu chính · LUAT §6h, §6i, §6j.

Trước khi viết gì: git log -1 đúng tip · npm test in 0 · đo cỡ org/main.j hiện tại trong dữ liệu mẫu (JSON.stringify(S.org).length ở bản demo) · liệt kê mọi chỗ ghi S.org và st.coins bằng grep (số dòng).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-06 + CHANGELOG · dòng walk (FB4: "bấm Nâng cấp dữ liệu v3 ở trang Quản lý, dán rules") · FB4: link PR (tiêu đề "Firebase: tách dữ liệu trung tâm, ví xu", base main). Không gì khác.
```
```
/goal P-06a xong: các collection org/main, lop, hsdm, hoso, gv, nk theo kế hoạch con; orgView() dựng S.org tương thích từ các doc, orgSet(path, value) ghi; 62, 79, 58, 70, 75, 76, 77, 78, 81 đọc ghi qua hai hàm đó; QL sửa lop bằng runTransaction; tools/chuyen-org-v3.mjs chuyển một lần, chạy lại không trùng; trang QL/GV/PH chạy với dữ liệu đã chuyển. Sự thật: giữ GV_F/hsgv như cũ; giữ org/main.j cũ 30 ngày. npm test in 0; git status chỉ hiện các file core trên, chuyen-org-v3.mjs, CHANGELOG.md; lane đã push. Hoặc dừng sau 60 lượt và báo cáo.
```
```
/goal P-06b xong: collection vi/{tk} và vi_yc/{tk}/{id}; 11, 64, 49, 51 gọi viYeuCau(delta, lyDo) thay sửa st.coins; rules kiểm tra delta theo lyDo (man ≤ 30, game ≤ 20, mua âm) và chỉ QL ghi vi; trình duyệt QL/GV đang mở duyệt yêu cầu; rules.test.mjs thêm 15 ca đạt (GV không đọc ghi lớp khác, PH không thấy SĐT người khác); console S.st[sid].coins=1e6;save() không đổi xu sau tải lại; org/main dưới 50 KB; healAll giữ tiến độ bản lưu mẫu 8 tháng; CHANGELOG ghi rõ đây là giảm, không chặn, gian lận. npm test in 0; 7 kiểm tra §7 ĐẠT; lane đã push. Hoặc dừng sau 60 lượt và báo cáo.
```

### FB5 — P-09b (chỉ khi Q2 đã trả lời)
```
Bạn là phiên FB5 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: fix/firebase-va, tiếp từ tip FB4 (Q1 = B: lane feature/supabase, tiếp từ tip SB3). Hàng: P-09b. Thầy đã trả lời Q2 trong KE-HOACH.md; nếu chưa, dừng và báo. Cùng lúc có thể đang chạy RF3; không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-09-rieng-tu.md phần P-09b (dòng ⟳ thắng) · docs/rieng-tu/DANH-MUC-DU-LIEU.md (T1 đã viết) · 70-sua-hoc-sinh.js dòng 50–70 · 75-nhap-excel.js phần cột · 78-xoa-hoc-sinh.js · 76-len-lop.js phần Nghỉ học · LUAT §6i, §6j.

Trước khi viết gì: git log -1 đúng tip · npm test in 0 · mở bản demo Quản lý, nhập file Excel mẫu cũ thành công (ghi lại số dòng).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-09 + CHANGELOG + LUAT §6i ghi Q2 · dòng walk · link PR (tiêu đề "Riêng tư: dữ liệu tối thiểu, xuất dữ liệu", base main). Không gì khác.
```
```
/goal P-09b xong: hoso chỉ còn năm sinh theo Q2; cột Excel "Năm sinh" nhận cả ngày đầy đủ và chỉ giữ năm; trang Học sinh hiện năm; nút ⬇ Xuất dữ liệu của em trả JSON (hồ sơ, tiến độ, sổ lỗi, nhận xét) và ghi nhật ký; em Nghỉ học quá 24 tháng có nhắc xoá theo thời hạn (xoá vẫn gõ XOA). Sự thật: ghép anh chị em vẫn cần SĐT; không xoá tự động. File Excel cũ nhập được; npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện 70, 73, 75, 76, 78, CHANGELOG.md, LUAT-DA-CHOT.md; lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
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

### KT — P-17
```
Bạn là phiên KT của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/kiem-tra-giao-dien, cắt từ tip CI1 (origin/feature/ci-kiem-tra sau khi CI1 push). Hàng: P-17. Cùng lúc có thể đang chạy GL, DS, FB3, RF1; không chạm nhánh của họ. Luật F-c 25/10: không sửa ci.yml hay chay-tat-ca.mjs; chỉ thêm file test mới và giao-dien.yml.

Đọc trước, từ origin/main: CLAUDE.md gốc · TIEU_CHI.md · docs/kien-truc/plans/P-17-kiem-tra-giao-dien.md (dòng ⟳ thắng) · AUDIT mục 3 (GL-M5, L2) · games/tu-duy-bebras/_kit/kit.js dòng 300–320 · games/hanh-trinh-jenny/mam-non/index.html dòng 1450–1465 · tools/check_fit.py.

Trước khi viết gì: git log -1 là tip CI1 · npm test in 0 · chạy __kit.make 10 seed trên 1 game bằng Playwright để biết hình dạng dữ liệu trả về (ghi lại).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-17 + CHANGELOG + TIEU_CHI.md một dòng lệnh · dòng walk · link PR (tiêu đề "Kiểm tra đề và giao diện tự động", base main). Không gì khác.
```
```
/goal P-17 xong: tools/test/de-bebras.mjs (6 game × 3 mức × 1000 seed: có lời giải, một đáp án, không lỗi), de-mam-non.mjs (2000 câu: đáp án trong lựa chọn, không trùng, không âm), giao-dien.spec.mjs (axe-core không serious/critical; ô chạm ≥ 44, ≥ 48 ở mầm non; không tràn ngang; reduced-motion) cho 4 trang Lớp học ảo, trang chủ, 1 game mỗi họ ở 320/375/414/900; .github/workflows/giao-dien.yml chạy check_fit.py và 3 file, dưới 10 phút, báo cáo HTML là artifact; lỗi thật liệt kê kèm seed trong CHANGELOG, không sửa ở đây. Sự thật: nút 42px và chip 40px sẽ đỏ, ghi là phát hiện cho P-19; seed cố định. npm test in 0; git status chỉ hiện tools/test/de-bebras.mjs, de-mam-non.mjs, giao-dien.spec.mjs, giao-dien.yml, TIEU_CHI.md, CHANGELOG; lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
```

### GL — P-19
```
Bạn là phiên GL của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: chore/game-le-kit, cắt từ tip FE2 (origin/feature/fe-sach sau khi FE2 push). Hàng: P-19. Cùng lúc có thể đang chạy KT, DS, FB3, RF1; không chạm nhánh của họ. Luật F-c 25/10: không sửa deploy.yml; sinh tham-tu bằng tools/build_tham_tu.py do tools/build_all.py gọi theo tên.

Đọc trước, từ origin/main: CLAUDE.md gốc · README.md · docs/kien-truc/plans/P-19-game-le-dung-kit.md (dòng ⟳ thắng) · AUDIT mục 3 (bảng game, L1–L5) · games/o-so-bi-an/lop-6/index.html và lop-7 (diff hai file) · games/hanh-trinh-jenny/lop-6/index.html và tieu-hoc (diff) · games/tu-duy-bebras/_kit/kit.css dòng 30–40.

Trước khi viết gì: git log -1 là tip FE2 · npm test in 0 · cloc hoặc wc -l mọi games/**/*.html *.js (ghi tổng, phải giảm ≥ 1200) · tools/build_all.py đã có trên main chưa (CI2 gộp chưa); nếu chưa, build_tham_tu.py vẫn viết, gọi tay.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Rebase lên main sau khi PR đợt 1 gộp (lấy build_all.py) rồi npm test lại.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-19 + CHANGELOG + README bảng game · dòng walk ("chơi 1 ván mỗi game trên Pages") · link PR (tiêu đề "Game lẻ: dùng kit và token chung", base main). Không gì khác.
```
```
/goal P-19 xong: o-so-bi-an lop-6, lop-7 bỏ wrapper head lạ, có lang vi, dùng chung _chung.js và _chung.css; games/hanh-trinh-jenny/_saga/saga.js gom 680 dòng chung, hai index.html import; tham-tu/index.html ra khỏi git và sinh bởi tools/build_tham_tu.py; kit.css .ib và index.html .chip dùng --jc-tap 48px; khôi phục mã sao lưu qua khoiPhucAnToan chỉ chép khoá cho phép; tao-giong.py dùng header x-goog-api-key; manifest.webmanifest gốc; README bảng game đủ tham-tu và lop-7 hidden. Sự thật: giữ URL và saveKey cũ; tham-tu ra khỏi git chỉ khi build_all.py đã sinh nó. check_fit.py xanh mọi game; giao-dien.spec.mjs (nếu KT đã gộp) không lỗi cỡ nút; tổng dòng giảm ≥ 1200 ghi trong PR; npm test in 0; git status chỉ hiện games/, tools/build_tham_tu.py, tools/giong/tao-giong.py, manifest.webmanifest, README.md, .gitignore, CHANGELOG; lane đã push. Hoặc dừng sau 50 lượt và báo cáo.
```

### DS — P-18 (chỉ khi Q4 = có)
```
Bạn là phiên DS của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: chore/design-system, cắt từ tip FE1 (origin/feature/fe-sach sau khi FE1 push). Hàng: P-18. Thầy đã trả lời Q4 = có trong KE-HOACH.md; nếu chưa, dừng và báo. Cùng lúc có thể đang chạy KT, GL, FB3, RF1; không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-18-design-system.md (dòng ⟳ thắng) · KIEN-TRUC-DICH.md mục 7 · LUAT-DA-CHOT.md §1 (ảnh mẫu), §2, §6j · src/lop-hoc-ao/js/core/80-phong-cach-lms.js. Trên lane: design/tokens.json của FE1.

Trước khi viết gì: git log -1 là tip FE1 · npm test in 0 · công cụ Artifact có kiểu Design System (quickstart intent other) — nếu không, báo và dừng · chụp 6 màn mẫu hiện tại (Bản đồ, Màn chơi, Phòng học, Lớp của tôi, Quản lý 4 nút, Đăng nhập) vào .ci/anh-goc/ để so.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-18 + CHANGELOG + LUAT §2 một dòng · dòng walk ("duyệt ảnh mẫu design system") · link PR (tiêu đề "Design system Jenny: tài liệu và token", base main) và link design system. Không gì khác.
```
```
/goal P-18 xong: design system Jenny trong Claude Design từ design/tokens.json với 2 theme Pixel và Classroom (cùng bảng màu, khác họ chữ và bo góc): 5 trang token, 12 thành phần có trạng thái và cỡ chạm, 6 mẫu trang vẽ từ thành phần và ghi khác biệt so với ảnh gốc; design/README.md có liên kết và quy tắc "màn mới dùng thành phần"; tokens.json xuất ngược khác 0 giá trị hoặc liệt kê thay đổi chờ thầy duyệt; LUAT §2 thêm một dòng. Sự thật: không nhân vật có bản quyền; không đổi luật đã chốt. git status chỉ hiện design/, LUAT-DA-CHOT.md, CHANGELOG; lane đã push. Hoặc dừng sau 30 lượt và báo cáo.
```

### RF1, RF2 — P-14a, P-14b
```
Bạn là phiên RF1 (hoặc RF2) của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/vite-module, cắt từ tip CI1 rồi rebase lên tip T1 và FE2 (RF2: tiếp từ tip RF1). Hàng: P-14a Vite bọc mã cũ (RF2: P-14b module hoá). Cùng lúc có thể đang chạy KT, GL, DS, FB3 (RF2: FB4, SB4); không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · src/lop-hoc-ao/CLAUDE.md · docs/kien-truc/plans/P-14-vite-module.md (dòng ⟳ thắng) · docs/KIEN-TRUC.md (thứ tự nạp) · app.template.html toàn bộ · tools/build.py, _student.py, _teacher.py (bản sau T1) · AUDIT mục 1 "Kiến trúc". RF2 thêm: tools/vite/ của RF1; git diff origin/main...origin/wip/t27-tu-luyen-dang-them.

Trước khi viết gì: git log -1 đúng tip · npm test in 0 · (RF1) ảnh gốc 4 trang × 4 khổ vào .ci/anh-goc/ · (RF2) nhánh wip/t27 đã gộp vào main chưa; nếu chưa, dừng và báo thầy gộp trước.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Rebase lên main sau khi PR đợt 1 gộp; npm test in 0 sau đó. RF1 push ngay khi xong.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-14 + CHANGELOG + docs/KIEN-TRUC.md mục build · dòng walk · RF2: link PR (tiêu đề "Lớp học ảo: Vite và ES module", base main). Không gì khác.
```
```
/goal P-14a xong: src/lop-hoc-ao/vite.config.js multi-page 5 entry với base /JennyMathClubGame/games/lop-hoc-ao/; plugin nối file theo đúng thứ tự app.template.html dòng 28–130 giữ phạm vi toàn cục; tools/vite/vai.js thay _student.py và _teacher.py với cùng các replace có assert; package.json scripts build = vite build, dev = vite; build.py gọi npm run build; 4 trang ra giống bản cũ (ảnh so .ci/anh-goc sai số ≤ 0.1%); dist/ có hash tên file. Sự thật: data-theme light phải chạy trước CSS; khoá localStorage không đổi để healAll giữ tiến độ. npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện vite.config.js, tools/vite/, package.json, package-lock.json, build.py, app.template.html, CHANGELOG, KIEN-TRUC.md; lane đã push. Hoặc dừng sau 60 lượt và báo cáo.
```
```
/goal P-14b xong: 01-tien-ich export; mọi file core import điều mình dùng (tools/vite/tim-import.mjs sinh dòng import bằng acorn); hàm đè (save, render, header, viewPH, fbHsBoot…) đổi thành hooks.on trong core/00-hooks.js, grep "^function render\b" còn 1; ESLint no-undef xanh; trang Lớp học ảo bỏ document.write và bỏ 'unsafe-inline' khỏi CSP; ảnh so .ci/anh-goc sai số ≤ 0.1%. Sự thật: wip/t27 đã gộp trước khi chạm 72-tu-luyen.js. npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện src/lop-hoc-ao/js/**, tools/vite/, app.template.html, .eslintrc, package.json, CHANGELOG, KIEN-TRUC.md; lane đã push. Hoặc dừng sau 80 lượt và báo cáo.
```

### RF3, RF4 — P-15a, P-15b
```
Bạn là phiên RF3 (hoặc RF4) của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/vite-module, tiếp từ tip RF2 (RF4: tip RF3). Hàng: P-15a chuyển nội dung sang content/lop-N (RF4: P-15b tải động + bản QL/GV/PH + test kích cỡ). Cùng lúc có thể đang chạy FB5 (RF3); không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · src/lop-hoc-ao/CLAUDE.md · docs/kien-truc/plans/P-15-noi-dung-theo-khoi.md (dòng ⟳ thắng) · docs/KIEN-TRUC.md mục Thứ tự nạp và Dữ liệu chính · js/core/30-bai-giang… và 34-khoi-dong.js · TASKS.md T-12. Trên lane: vite.config.js, core/00-hooks.js.

Trước khi viết gì: git log -1 đúng tip · npm test in 0 · đo gzip của hoc-sinh.html + chunk bắt buộc hiện tại (ghi số; đích < 700 KB).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-15 + CHANGELOG + TASKS T-12 · dòng walk (RF4: "mở trang học sinh trên điện thoại 4G, đổi lớp") · tip đã push. Không gì khác.
```
```
/goal P-15a xong: js/content/hk1, hk2, lessons chuyển thành content/lop-1 … lop-5 và lop-6-9, mỗi thư mục export function dangKy(reg) gọi addTopic, LES, MG/MGT; core chỉ còn helper chung; vite.config.js manualChunks theo content/lop-*; chưa tải động (vẫn import tĩnh) nên hành vi y cũ. Sự thật: helper khối sau dùng helper khối trước nằm ở core, không ở content. npm test in 0; 7 kiểm tra §7 ĐẠT lớp 1–5; git status chỉ hiện src/lop-hoc-ao/content/**, js/core/30*, 34*, vite.config.js, CHANGELOG, KIEN-TRUC.md; lane đã push. Hoặc dừng sau 50 lượt và báo cáo.
```
```
/goal P-15b xong: sau đăng nhập biết khối thì await import content/lop-N rồi render, màn chờ pixel; bản QL/GV/PH tải khối theo lớp đang xem; kiem-tra.js chờ window.__ready(g); tools/test/kich-co.mjs fail nếu hoc-sinh.html + chunk bắt buộc > 700 KB gzip hoặc chunk lop-6-9 có trong bản học sinh thật; Lighthouse mobile LCP < 2,5 s ghi số vào CHANGELOG; đổi lớp tải chunk mới không tải lại trang. npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện 30*, 34*, các file QL/GV mở lớp, kiem-tra.js, kich-co.mjs, CHANGELOG, TASKS.md; lane đã push. Hoặc dừng sau 50 lượt và báo cáo.
```

### RF5 — P-16
```
Bạn là phiên RF5 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-ROUTES-2026-10-25.md). Lane: feature/vite-module, tiếp từ tip RF4. Hàng: P-16. Không lane nào khác đang chạy; đây là phiên cuối: sau khi PR đợt 3 gộp, xoá mọi worktree của lộ trình.

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-16-pwa.md (dòng ⟳ thắng) · TASKS.md T-11 · js/core/34-khoi-dong.js và 79-dong-bo.js (bản sau RF4) · vite.config.js.

Trước khi viết gì: git log -1 là tip RF4 · npm test in 0 · Lighthouse PWA hiện tại (ghi "not installable").

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-16 + CHANGELOG + TASKS T-11 · dòng walk ("cài lên điện thoại, tắt mạng, học 1 đảo, bật mạng") · link PR (tiêu đề "Lớp học ảo: Vite, nội dung theo khối, PWA", base main) · sau khi thầy gộp: git -C ~/Documents/JennyMathClubGame worktree remove ~/worktrees/<lane> cho mọi lane đã gộp, liệt kê. Không gì khác.
```
```
/goal P-16 xong: public/manifest.webmanifest và icon pixel 192/512 từ PXJ; vite-plugin-pwa registerType prompt, precache shell + chunk khối của em, runtime cache content/lop-*, không cache Firebase/Supabase, navigateFallbackDenylist cho /giao-vien/ /phu-huynh/ /quan-ly/; 34-khoi-dong.js hiện thanh "Có bản mới · Tải lại"; Lighthouse installable; tắt mạng sau khi mở 1 đảo vẫn học được và answers_pending gửi hết khi nối lại; đẩy bản mới thì thiết bị đang mở báo trong 1 phút. Sự thật: bump cacheId khi đổi MAY_CHU. npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện public/, vite.config.js, 34-khoi-dong.js, 79-dong-bo.js, package.json, CHANGELOG, TASKS.md; lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
```
