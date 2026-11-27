# Lộ trình chạy song song, bản cắt lại chiều 25/10/2026

Cắt lại từ `KE-HOACH-ROUTES-2026-10-25.md` sau khi thầy bỏ giai đoạn Supabase (giữ Firebase) và chốt Q2 = B, Q3 = B, Q4 = A. Phiên đã đóng nằm ở `KE-HOACH-ROUTES-2026-10-25-HISTORY.md`.

Từ dùng trong file này:

- **lane**: một nhánh git chạy liền một dãy phiên.
- **phiên**: một lần mở Claude Code mới, tối đa 8–9 giờ việc.
- **tip**: commit đã push của một lane.
- **walk**: thầy tự kiểm tra trên trang thật.

## Trạng thái đo chiều 25/10 (nguồn ở cột cuối)
| Việc đo | Kết quả | Nguồn |
|---|---|---|
| `origin/main` | `952e7a5`; PR #2 (kế hoạch) **còn mở** | `git log origin/main`, `gh pr list` |
| PR mở | #2 kế hoạch · #3 T (P-07, P-09a, P-10) · #4 CI (P-01, P-02) · #5 FB (P-04, P-05) · #6 KT (P-17) | `gh pr list` |
| CI | #6 xanh; #5 đỏ (lỗi font `tu-luyen.js`, cần rebase lên tip CI1 `53e84d8`); #3, #4 đang chạy lại | `statusCheckRollup` |
| Phiên đang chạy | FE2 (P-08, chờ thầy duyệt tải 5 font woff2) · FB3 (P-06a, nhánh `fix/firebase-tach-org`) · KT (xong, PR #6) | bảng phiên liên kết |
| Lane FE sửa | `design/`, `app.css`, `kit.css`, `index.html`, `app.template.html`, test §7 | `git diff --name-only origin/main...origin/claude/fe-sach-329fd2` |
| Lane FB sửa | `firestore.rules`, `firebase.json`, `62`, `58`, `71`, `75`, `77`, `rules.test.js` | cùng lệnh, `origin/fix/firebase-va` |
| Lane KT sửa | `giao-dien.yml`, 3 file test mới, `TIEU_CHI.md` | cùng lệnh |
| `wip/t27` | `72-tu-luyen.js`, 4 file build; **chưa gộp** | cùng lệnh |
| Node, Playwright trên Mac thầy | Node 22 ở `~/.local/node`; Chromium đã tải | phiên CI1 |
| Ghi chú nhớ | `memory/ke-hoach-kien-truc-2026-10.md` | thư mục memory |

## Người dùng thấy gì, và gói
Một vòng = một PR + CI xanh + thầy xem và gộp (≈ 30–45 phút của thầy). Hàng dưới 4 giờ không đáng một vòng riêng.

| Gói | Hàng còn lại | Người dùng thấy gì | Giờ |
|---|---|---|---|
| G-FE | P-08 (đang chạy) | trang mở nhanh hơn; 3 game đọc đề bằng giọng máy | 8 |
| G-FB | P-06a (đang chạy) → P-20 → P-09b → P-21 | cô thấy nhãn "Xu tăng lạ"; nút Xuất dữ liệu; mở lại trang tức thì, mất mạng vẫn học | 25 |
| G-CF | P-22 (chỉ khi Q5 = Blaze) | không; gian lận xu bị chặn hẳn | 14 |
| G-RF | P-14a → P-14b → P-15a → P-15b → P-16 | nhanh hơn, cài lên điện thoại, chạy ngoại tuyến | 42 |
| G-KT | P-17 (PR #6) | không | 0 |
| G-GL | P-19 | nút to hơn, o-so-bi-an chuẩn HTML | 8 |
| G-DS | P-18 | không trực tiếp; màn mới nhất quán | 6 |

Vòng = gói: 6 gói (7 với Q5) cho 13 phiên còn lại. P-09b còn 3 giờ nên đi chung PR với P-20.

## Phụ thuộc mới và luật file chung
| Hàng | Chung file với | Loại | Xử lý |
|---|---|---|---|
| P-20 ↔ P-06a | `62`, `64`, `11`, `49`, `51`, `firestore.rules` | F-s | một lane `fix/firebase-tach-org`, P-20 sau P-06a |
| P-09b ↔ P-06a | `76`, `78` | F-s | cùng lane, sau P-20; theo Q2 = B chỉ còn 3 giờ |
| P-21 ↔ P-16 | `79-dong-bo.js` | F-c | Luật 25/10: P-16 sở hữu `79`; P-21 thêm file `63-firestore-tiet-kiem.js`, sửa `62` một dòng |
| P-14b ↔ lane FB | mọi `js/core/*` (dòng import) | X | Luật 25/10: RF2 mở sau khi PR Firebase (P-06a + P-20) gộp; mỗi lần FB gộp thêm, RF rebase và chạy lại `tim-import.mjs` |
| P-14b ↔ `wip/t27` | `72-tu-luyen.js` | X | gộp t27 vào `main` trước RF2 (luật cũ còn hiệu lực) |
| P-22 | Q5 | E | xây chỉ khi thầy nâng Blaze; không mở phiên trước |
| P-21 DONE 2 | số đọc/phiên | D | đo trong phiên FB6 bằng `FB.dem`; đọc lại sau 7 ngày thật |
| Mọi hàng | `CHANGELOG.md`, `TASKS.md`, `LUAT-DA-CHOT.md` | F-c đã có luật | ghi mục mới lên đầu; xung đột giữ cả hai |

## Bảng phiên còn lại
| Phiên | Lane (nhánh) | Hàng | Giờ | Mở từ | Rebase lên, khi nào | Hạ cánh |
|---|---|---|---|---|---|---|
| FE2 | `claude/fe-sach-329fd2` | P-08 | 8 | đang chạy | — ; push ngay khi xong (GL, RF1 cần) | PR FE |
| FB3 | `fix/firebase-tach-org` | P-06a | 8 | đang chạy | tip CI1 `53e84d8` (lỗi font CI) | PR FB2 |
| DS | `chore/design-system` | P-18 | 6 | tip FE1 `419ae20` | — | PR riêng |
| GL | `chore/game-le-kit` | P-19 | 8 | tip FE2 | `main` sau khi PR #4 gộp (lấy `build_all.py`) | PR riêng |
| FB4 | cùng FB3 | P-20 | 8 | tip FB3 | — ; push ngay khi xong (RF2 chờ) | PR FB2 |
| FB5 | cùng FB3 | P-09b | 3 | tip FB4 | — | PR FB2 |
| FB6 | cùng FB3 | P-21 | 6 | tip FB5 | `main` sau khi PR FB2 gộp | PR FB3 |
| FB7, FB8 | cùng FB3 | P-22 (Q5) | 8 + 6 | tip FB6 | — | PR FB4 |
| RF1 | `feature/vite-module` | P-14a | 8 | tip FE2 | `main` sau khi PR #3, #4 gộp | PR RF |
| RF2 | cùng lane | P-14b | 8 | tip RF1 | `main` sau khi PR FB2 gộp; t27 đã gộp | PR RF |
| RF3, RF4 | cùng lane | P-15a, P-15b | 6 + 6 | tip RF2 | `main` sau mỗi PR FB | PR RF |
| RF5 | cùng lane | P-16 | 6 | tip RF4 | — | PR RF |

**Độ rộng:** 4 phiên cùng lúc. Bất kì tập con nào cũng chạy được; phần còn lại xếp hàng.

**Đường tới hạn:** FE2 → RF1 → RF2 → RF3 → RF4 → RF5 = 42 giờ = 6 phiên. Lane Firebase (FB3 → FB6 = 25 giờ) không nằm trên đường này.

## Bảng ngày (1 phiên mỗi lane mỗi ngày)
| Ngày | Phiên chạy | Thầy làm |
|---|---|---|
| 2 (25/10, hôm nay) | FE2 · FB3 · DS | gộp PR #2, #3, #4, #5, #6 khi CI xanh; duyệt tải font woff2 (FE2); dán `firestore.rules`; 4 nút Firebase console; Pages Source = Actions; bảo vệ `main` có bypass chủ kho; kho `jenny-backup` + 3 secret |
| 3 | GL · FB4 · RF1 · DS | **walk đợt 1** trên Pages (4 vai, 1 đảo, 1 game Bebras, trang chủ); gộp PR FE |
| 4 | FB5 · RF2 | gộp PR FB2 (P-06a, P-20, P-09b); dán rules; bấm "Nâng cấp dữ liệu v3"; duyệt ảnh design system; trả **Q5** |
| 5 | FB6 · RF3 | **walk đợt 2** (xu không tự sửa được, nút Xuất dữ liệu); gộp PR GL, DS |
| 6 | RF4 · (FB7) | gộp PR FB3 (P-21); tạo chỉ mục theo liên kết console |
| 7 | RF5 · (FB8) | **walk đợt 3** (cài PWA, tắt mạng, học 1 đảo); gộp PR RF |
| 8–14 | — | đọc số: App Check bật Enforce; `FB.dem` đọc/ngày; (Blaze: ngân sách 1 USD, gộp PR FB4) |

Đường đo (M): số đọc/phiên (P-21), kích cỡ trang (P-15), Lighthouse (P-15, P-16), CI dưới 10 phút (P-17). Đọc ở walk của đợt tương ứng.

Thứ tự bỏ nếu thiếu thời gian: P-22 → DS → GL → RF5 → RF4 → P-21. **Không bỏ** P-20 trước khi nhập tên thật.

## Luật mọi lane
- Mỗi lane là một worktree trong `~/worktrees/` (không đặt trong `~/Documents`): `git -C ~/Documents/JennyMathClubGame worktree add --no-track -b <lane> ~/worktrees/<lane> origin/<tip>` rồi `git -C ~/worktrees/<lane> push -u origin <lane>`. Sau đó `export PATH=$HOME/.local/node/bin:$PATH`, `npm ci`.
- Không commit `games/lop-hoc-ao/**/index.html`, `src/lop-hoc-ao/dist/`.
- Kiểm tra: `npm test` ghi `.ci/rc.txt` = 0, dán vào transcript; `git status` chỉ hiện file trong đường dẫn cho phép của hàng.
- Mỗi PR một việc; tiêu đề tiếng Việt; base `main`. Claude Code luôn qua PR; Cowork đẩy thẳng `main` (Q3 = B).
- Chế độ: **có thầy ngồi cùng** (thầy gõ từng `/goal`).
- Phiên cuối (RF5) xoá worktree đã gộp: `git -C ~/Documents/JennyMathClubGame worktree remove ~/worktrees/<lane>`.

## So sánh trước và sau
| Đo | Lộ trình sáng 25/10 | Bản cắt lại | Vì sao |
|---|---|---|---|
| Phiên còn lại | 15 (A) hoặc 19 (B) | 13 (+2 nếu Q5) | bỏ 4 phiên Supabase; P-06b thành P-20; thêm P-21 |
| Độ rộng | 4 (5 với B) | 4 | không đổi |
| Đường tới hạn | 7 phiên (FE1 → RF5) | 6 phiên (FE2 → RF5) | FE1 đã xong |
| Lịch tới "xây xong" | 7 ngày (+ 1 tuần song song với B) | 7 ngày | lane Firebase ngắn hơn đường RF |
| Việc thầy phải cài | Supabase CLI + Docker (B) | không | chỉ Firebase console |
| Chặn gian lận xu | chặn hẳn (B) · giảm (A, P-06b) | giảm mạnh (P-20) · chặn hẳn nếu Q5 = Blaze | hàm máy chủ vẫn cần Blaze |

## Việc tiếp theo, theo mốc
Luật 27/10: mọi phiên của lộ trình đã đóng (PR #3–#19 gộp vào `tich-hop/kien-truc-2026-10`, tip `805351e`; thêm RF6 · P-14c và FB7 · công tắc `FB_ENV` ngoài bảng trên). Các bước 1–6 cũ đã qua; còn:
1. **Thầy:** thử bản dựng `FB_ENV=thu` trên điện thoại (PWA, 4G) theo mục "Cách thầy thử" trong `TICH-HOP-2026-10-25.md`; gõ mã CLB trong phiên TH để chạy check_fit Hành trình.
2. **Thầy quyết:** mở PR `tich-hop/kien-truc-2026-10` → `main` và gộp. Sau gộp: `python3 tools/build.py`, commit "Dựng lại bản", dán rules + chỉ mục vào dự án Firebase thật, 4 mục trong `FIREBASE-CONSOLE.md`.
3. **Sau gộp:** xoá các worktree đã gộp trong app (mục Worktrees), đổi mã CLB và dựng lại `bank.enc`, sao lưu kho + 3 secret, đặt nguồn Pages và bảo vệ nhánh.
4. **Sửa thêm trước khi gộp** (nếu thầy thấy lỗi khi thử): cắt nhánh mới từ tip nhánh tích hợp, PR về nhánh tích hợp, TH gộp.

---

## Khối lệnh từng phiên (dán nguyên khối; dưới là các dòng `/goal` thầy gõ theo thứ tự)

Khối của FE2, FB3, KT đã dán, nằm ở `KE-HOACH-ROUTES-2026-10-25-HISTORY.md` và `KE-HOACH-ROUTES-2026-10-25.md`.

### DS — P-18
```
Bạn là phiên DS của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-PARALLEL-2026-10-25.md). Lane: chore/design-system, cắt từ tip FE1 (origin/claude/fe-sach-329fd2 commit 419ae20; nếu FE2 đã push tip mới, cắt từ tip mới). Hàng: P-18. Thầy đã chốt Q4 = A trong KE-HOACH.md. Cùng lúc đang chạy FE2, FB3, GL, RF1; không chạm nhánh của họ.

Đọc trước, từ nhánh chore/audit-kien-truc (git show origin/chore/audit-kien-truc:<đường dẫn>) cho tới khi PR #2 gộp: CLAUDE.md gốc · docs/kien-truc/plans/P-18-design-system.md (dòng ⟳ thắng) · KIEN-TRUC-DICH.md mục 7 · src/lop-hoc-ao/docs/LUAT-DA-CHOT.md §1 (ảnh mẫu), §2, §6j · src/lop-hoc-ao/js/core/80-phong-cach-lms.js. Trên lane: design/tokens.json, design/tokens.css của FE1.

Trước khi viết gì: git log -1 là tip FE1 · export PATH=$HOME/.local/node/bin:$PATH; npm ci; npm test in 0 · công cụ Artifact có kiểu Design System (quickstart intent other); nếu không, báo và dừng · chụp 6 màn mẫu hiện tại (Bản đồ, Màn chơi, Phòng học, Lớp của tôi, Quản lý 4 nút, Đăng nhập) vào .ci/anh-goc/ để so.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-18 + CHANGELOG + LUAT §2 một dòng · dòng walk ("duyệt ảnh mẫu design system") · link PR (tiêu đề "Design system Jenny: tài liệu và token", base main) và link design system. Không gì khác.
```
```
/goal P-18 xong: design system Jenny trong Claude Design từ design/tokens.json với 2 theme Pixel và Classroom (cùng bảng màu, khác họ chữ và bo góc): 5 trang token, 12 thành phần có trạng thái và cỡ chạm, 6 mẫu trang vẽ từ thành phần và ghi khác biệt so với ảnh gốc; design/README.md có liên kết và quy tắc "màn mới dùng thành phần"; tokens.json xuất ngược khác 0 giá trị hoặc liệt kê thay đổi chờ thầy duyệt; LUAT §2 thêm một dòng. Sự thật: không nhân vật có bản quyền; không đổi luật đã chốt. git status chỉ hiện design/, LUAT-DA-CHOT.md, CHANGELOG; lane đã push. Hoặc dừng sau 30 lượt và báo cáo.
```

### GL — P-19
```
Bạn là phiên GL của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-PARALLEL-2026-10-25.md). Lane: chore/game-le-kit, cắt từ tip FE2 (origin/claude/fe-sach-329fd2 sau khi FE2 push). Hàng: P-19. Cùng lúc đang chạy FB4, DS, RF1; không chạm nhánh của họ. Luật F-c 25/10: không sửa deploy.yml; sinh tham-tu bằng tools/build_tham_tu.py do tools/build_all.py gọi theo tên.

Đọc trước, từ origin/main (hoặc origin/chore/audit-kien-truc nếu PR #2 chưa gộp): CLAUDE.md gốc · README.md · docs/kien-truc/plans/P-19-game-le-dung-kit.md (dòng ⟳ thắng) · AUDIT mục 3 (bảng game, L1–L5) · games/o-so-bi-an/lop-6/index.html và lop-7 (diff hai file) · games/hanh-trinh-jenny/lop-6/index.html và tieu-hoc (diff) · games/tu-duy-bebras/_kit/kit.css dòng 30–40.

Trước khi viết gì: git log -1 là tip FE2 · export PATH=$HOME/.local/node/bin:$PATH; npm ci; npm test in 0 · wc -l mọi games/**/*.html *.js (ghi tổng, phải giảm ≥ 1200) · tools/build_all.py đã có trên main chưa (PR #4 gộp chưa); nếu chưa, build_tham_tu.py vẫn viết, gọi tay.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Rebase lên main sau khi PR #4 gộp (lấy build_all.py) rồi npm test lại.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-19 + CHANGELOG + README bảng game · dòng walk ("chơi 1 ván mỗi game trên Pages") · link PR (tiêu đề "Game lẻ: dùng kit và token chung", base main). Không gì khác.
```
```
/goal P-19 xong: o-so-bi-an lop-6, lop-7 bỏ wrapper head lạ, có lang vi, dùng chung _chung.js và _chung.css; games/hanh-trinh-jenny/_saga/saga.js gom 680 dòng chung, hai index.html import; tham-tu/index.html ra khỏi git và sinh bởi tools/build_tham_tu.py; kit.css .ib và index.html .chip dùng --jc-tap 48px; khôi phục mã sao lưu qua khoiPhucAnToan chỉ chép khoá cho phép; tao-giong.py dùng header x-goog-api-key; manifest.webmanifest gốc; README bảng game đủ tham-tu và lop-7 hidden. Sự thật: giữ URL và saveKey cũ; tham-tu ra khỏi git chỉ khi build_all.py đã sinh nó. check_fit.py xanh mọi game; giao-dien.spec.mjs (nếu KT đã gộp) không lỗi cỡ nút; tổng dòng giảm ≥ 1200 ghi trong PR; npm test in 0; git status chỉ hiện games/, tools/build_tham_tu.py, tools/giong/tao-giong.py, manifest.webmanifest, README.md, .gitignore, CHANGELOG; lane đã push. Hoặc dừng sau 50 lượt và báo cáo.
```

### FB4 — P-20
```
Bạn là phiên FB4 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-PARALLEL-2026-10-25.md). Lane: fix/firebase-tach-org, tiếp từ tip FB3 (P-06a đã push). Hàng: P-20 ví xu và sao kiểm soát bằng rules (thay P-06b cũ; thầy đã bỏ Supabase, Q1 = A). Cùng lúc đang chạy GL, DS, RF1; không chạm nhánh của họ. Luật 25/10: không sửa 79-dong-bo.js quá phần P-06a đã có; push ngay khi xong vì RF2 chờ PR này gộp.

Đọc trước, từ origin/chore/audit-kien-truc (hoặc origin/main nếu PR #2 đã gộp): CLAUDE.md gốc · src/lop-hoc-ao/CLAUDE.md · docs/kien-truc/plans/P-20-vi-xu-rules.md · plans/P-06-tach-org-blob.md (dòng ⟳ thắng) · LUAT §4 (bảng giá), §6 (luật xu), §6i · AUDIT mục 1 (LH-C2). Trên lane: firebase/firestore.rules, 62-may-chu.js, 64-xu.js, 11-sao-va-mo-khoa.js, 49-gian-hang.js, 51-kho-game.js, 18-choi-man.js, 72-tu-luyen.js (chỉ dòng cộng xu), 58-lop-va-quan-ly.js, tools/test/rules.test.mjs, tools/chuyen-org-v3.mjs.

Trước khi viết gì: git log -1 là tip FB3 · export PATH=$HOME/.local/node/bin:$PATH; npm test in 0 · grep -n "coins\|items\|pets\|tudo" js/core/11*.js 64*.js 49*.js 51*.js 18*.js 72*.js (ghi số dòng) · emulator Firestore chạy được (cần Java); nếu không, báo và chạy test trên CI.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-20 + CHANGELOG + LUAT §6i một dòng ("xu kiểm soát bằng rules: giảm mạnh, chưa chặn hẳn") · dòng walk ("dán rules; bấm Nâng cấp dữ liệu v3; thử sửa xu bằng console") · chưa mở PR (FB5 mở chung). Không gì khác.
```
```
/goal P-20 xong: collection vi/{tk} (coins, items, pets, tudo, t), ev/{tk}/{id} (k, d, ref, t) chỉ-thêm, cfg/shop từ bảng giá LUAT §4; rules: em chỉ cộng 0 < delta ≤ cfg.tranMan (40) cách lần trước ≥ 3 giây với t == request.time, hoặc mua đúng một khoá có trong cfg/shop với delta == -giá; ev không sửa không xoá; 64-xu.js có xuCong(delta, k, ref) và xuMua(loai, id) ghi vi + ev trong một batch, cộng lớn chia nhiều lần cách 3 giây; 11, 49, 51, 18, 72 gọi hai hàm đó thay sửa st.coins; fbTach bỏ coins, items, pets, tudo khỏi hs.j; Nâng cấp dữ liệu v3 tạo vi/{tk} và cfg/shop; trang cô có cột Xu hôm nay và nhãn Xu tăng lạ (> 300 xu/ngày hoặc > 15 dòng man/giờ); firestore.indexes.json có ev theo t; rules.test.mjs thêm 14 ca. Sự thật: đây là giảm mạnh, không chặn hẳn; t phải là serverTimestamp(). Console S.st[sid].coins=1e6;save() không đổi xu sau tải lại; npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện 64, 11, 49, 51, 18, 72, 62, 58, firestore.rules, firestore.indexes.json, rules.test.mjs, chuyen-org-v3.mjs, CHANGELOG, LUAT; lane đã push. Hoặc dừng sau 60 lượt và báo cáo.
```

### FB5 — P-09b
```
Bạn là phiên FB5 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-PARALLEL-2026-10-25.md). Lane: fix/firebase-tach-org, tiếp từ tip FB4. Hàng: P-09b theo Q2 = B (giữ ngày sinh và Gmail; chỉ còn nút Xuất dữ liệu và nhắc thời hạn lưu). Cùng lúc đang chạy RF2; không chạm nhánh của họ.

Đọc trước, từ origin/main (hoặc origin/chore/audit-kien-truc nếu PR #2 chưa gộp): CLAUDE.md gốc · docs/kien-truc/plans/P-09-rieng-tu.md phần P-09b (dòng ⟳ thắng) · docs/rieng-tu/DANH-MUC-DU-LIEU.md (T1 đã viết, PR #3) · 78-xoa-hoc-sinh.js · 76-len-lop.js phần Nghỉ học · LUAT §6h, §6i.

Trước khi viết gì: git log -1 là tip FB4 · npm test in 0 · mở bản demo Quản lý, bấm Xoá một em để xem hộp thoại hiện có (chụp ảnh vào .ci/anh-goc/).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-09 + CHANGELOG · dòng walk ("xuất JSON một em thử, mở file") · link PR (tiêu đề "Firebase: tách dữ liệu trung tâm, ví xu theo rules, xuất dữ liệu", base main, gồm P-06a, P-20, P-09b). Không gì khác.
```
```
/goal P-09b xong: nút ⬇ Xuất dữ liệu của em trong 78-xoa-hoc-sinh.js trả JSON (hoso, hsdm, hs.j, vi, ev 90 ngày, hsgv) và ghi nhật ký nk; em Nghỉ học hoặc Học xong quá 24 tháng có nhắc "xoá theo thời hạn" ở 76-len-lop.js (xoá vẫn gõ XOA, xuất trước khi xoá). Sự thật: không đổi trường hồ sơ (Q2 = B); không xoá tự động. npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện 76, 78, CHANGELOG.md; lane đã push; PR đã mở. Hoặc dừng sau 25 lượt và báo cáo.
```

### FB6 — P-21
```
Bạn là phiên FB6 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-PARALLEL-2026-10-25.md). Lane: fix/firebase-tach-org, rebase lên origin/main sau khi PR FB (P-06a, P-20, P-09b) gộp. Hàng: P-21 Firestore ngoại tuyến và tiết kiệm đọc. Cùng lúc đang chạy RF3; không chạm nhánh của họ. Luật 25/10: không sửa 79-dong-bo.js (P-16 sở hữu); 62-may-chu.js chỉ thêm một dòng gọi và đổi tên onSnapshot thành fbNghe.

Đọc trước, từ origin/main: CLAUDE.md gốc · src/lop-hoc-ao/CLAUDE.md · docs/kien-truc/plans/P-21-firestore-ngoai-tuyen.md · 62-may-chu.js toàn bộ (mọi onSnapshot, get) · docs/FIREBASE-CONSOLE.md · firebase/firebase.json.

Trước khi viết gì: git log -1 là origin/main sau gộp · npm test in 0 · grep -c onSnapshot js/core/62-may-chu.js (ghi số) · đếm đọc một phiên học 20 phút hiện tại trên bản demo nối Firebase thử (DevTools Network, lọc firestore; ghi số).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-21 + CHANGELOG (số đọc trước và sau) + FIREBASE-CONSOLE mục cảnh báo dùng · dòng walk ("tắt mạng, học 1 bài, bật mạng; tạo chỉ mục theo liên kết console") · link PR (tiêu đề "Firebase: ngoại tuyến và tiết kiệm đọc", base main). Không gì khác.
```
```
/goal P-21 xong: js/core/63-firestore-tiet-kiem.js bật enablePersistence({synchronizeTabs:true}) trong fbInit qua một dòng gọi, fbNghe(path, cb) một listener mỗi document và tắt khi đổi vai hay đăng xuất, FB.dem đếm đọc ghi và lưu localStorage jennyDem, clearPersistence khi đăng xuất; 62 không còn onSnapshot trực tiếp; listener theo vai ≤ 4 document (HS: hs, vi, hsgv, asg lớp; GV: lop mình, asg; PH: hs, hsgv, asg con; QL: org, lop, hsdm); firebase/firestore.indexes.json có asg(lop, t), ev(t) và firebase.json trỏ tới; FIREBASE-CONSOLE.md mục cảnh báo 80% hạn đọc. Sự thật: không chạm 79; fbNghe lần đầu lấy server nếu localStorage.jennyV3 khác '1'. DevTools Offline: mở lại trang, làm 1 bài, bật mạng thì vi và ev lên đúng; số đọc phiên 20 phút ≤ 60 ghi vào CHANGELOG; npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện 63, 62, app.template.html (một dòng include), firestore.indexes.json, firebase.json, FIREBASE-CONSOLE.md, CHANGELOG; lane đã push. Hoặc dừng sau 45 lượt và báo cáo.
```

### FB7, FB8 — P-22 (chỉ khi Q5 = Blaze)
```
Bạn là phiên FB7 (hoặc FB8) của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-PARALLEL-2026-10-25.md). Lane: fix/firebase-tach-org, tiếp từ tip FB6 (FB8: tip FB7). Hàng: P-22 Blaze 0 đồng + Cloud Functions; FB7 viết hàm và rules, FB8 cho app gọi hàm. Thầy đã trả lời Q5 = Blaze trong KE-HOACH.md và đã nâng gói, đặt ngân sách 1 USD; nếu chưa, dừng và báo. Cùng lúc đang chạy RF4 (FB8: RF5); không chạm nhánh của họ.

Đọc trước, từ origin/main: CLAUDE.md gốc · src/lop-hoc-ao/CLAUDE.md · docs/kien-truc/plans/P-22-blaze-functions.md · plans/P-20-vi-xu-rules.md · LUAT §6 (luật xu) · 62-may-chu.js (fbTaoTK, fbQLTaoHS, fbTaoGV, fbTaoPH) · 64-xu.js · 78-xoa-hoc-sinh.js · firebase/firestore.rules · docs/FIREBASE-CONSOLE.md.

Trước khi viết gì: git log -1 đúng tip · npm test in 0 · npx firebase-tools --version và emulator functions chạy được (cần Java) · FB7: gcloud billing của dự án đã là Blaze (thầy xác nhận) · FB8: hàm của FB7 deploy được trên dự án thật chưa (hỏi thầy).

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-22 + CHANGELOG + LUAT §6i (xu chấm ở máy chủ) + FIREBASE-CONSOLE mục Blaze · dòng walk (FB7: "firebase deploy --only functions; bật Identity Platform"; FB8: "tạo 1 học sinh thử từ trang QL; thử sửa xu bằng console") · FB8: link PR (tiêu đề "Firebase: Cloud Functions chấm xu, tạo tài khoản, sao lưu", base main). Không gì khác.
```
```
/goal P-22 phần hàm xong: src/lop-hoc-ao/firebase/functions/ Node 20 2nd gen vùng asia-southeast1 với taoTaiKhoan (chỉ QL), chamXu (luật §6, trần game 20/ván, transaction vi + ev), muaDo (giá cfg/shop), xoaHocSinh (xuất JSON rồi xoá), beforeUserCreated từ chối mọi tạo user ngoài taoTaiKhoan, saoLuuHangNgay (export 20:00 UTC, giữ 30 bản), tatKhiVuot (gỡ billing khi vượt ngân sách); rules: HS chỉ đọc vi và ev, users create chỉ QL; tools/test/functions.test.mjs 15 ca đạt trên emulator; rules.test.mjs sửa 6 ca. Sự thật: dùng onCall, không onRequest; lần deploy đầu thầy bật Cloud Build, Artifact Registry, Eventarc theo liên kết lỗi. npm test in 0; git status chỉ hiện firebase/functions/, firestore.rules, functions.test.mjs, rules.test.mjs, FIREBASE-CONSOLE.md, CHANGELOG; lane đã push. Hoặc dừng sau 60 lượt và báo cáo.
```
```
/goal P-22 phần app xong: 64-xu.js gọi httpsCallable chamXu, muaDo khi FB.cf true, giữ nhánh P-20 khi false; 62 fbQLTaoHS, fbTaoGV, fbTaoPH gọi taoTaiKhoan, bỏ fbTaoTK và login/{tk}; 78 gọi xoaHocSinh; tạo 1 học sinh từ trang QL không mở phiên phụ và mật khẩu hiện trên phiếu in; console sửa vi bị từ chối; REST signUp với API key bị beforeUserCreated từ chối; firestore.export chạy thử một lần, khôi phục vào emulator đủ document; LUAT §6i ghi xu chấm ở máy chủ. Sự thật: giữ P-20 rules làm lớp hai 30 ngày. npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện 64, 62, 78, firestore.rules, LUAT, CHANGELOG, FIREBASE-CONSOLE.md; lane đã push; PR đã mở. Hoặc dừng sau 45 lượt và báo cáo.
```

### RF1, RF2 — P-14a, P-14b
```
Bạn là phiên RF1 (hoặc RF2) của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-PARALLEL-2026-10-25.md). Lane: feature/vite-module, cắt từ tip FE2 (origin/claude/fe-sach-329fd2 sau khi FE2 push) rồi rebase lên origin/main khi PR #3, #4 gộp (RF2: tiếp từ tip RF1, rebase lên origin/main sau khi PR Firebase P-06a + P-20 gộp). Hàng: P-14a Vite bọc mã cũ (RF2: P-14b module hoá). Cùng lúc đang chạy GL, DS, FB4 (RF2: FB5); không chạm nhánh của họ. Luật 25/10 (RF2): mỗi lần lane Firebase gộp thêm, rebase lên main và chạy lại tools/vite/tim-import.mjs thay giải xung đột tay.

Đọc trước, từ origin/main: CLAUDE.md gốc · src/lop-hoc-ao/CLAUDE.md · docs/kien-truc/plans/P-14-vite-module.md (dòng ⟳ thắng) · docs/KIEN-TRUC.md (thứ tự nạp) · app.template.html toàn bộ · tools/build.py, _student.py, _teacher.py (bản sau PR #3) · AUDIT mục 1 "Kiến trúc". RF2 thêm: tools/vite/ của RF1; git diff origin/main...origin/wip/t27-tu-luyen-dang-them.

Trước khi viết gì: git log -1 đúng tip · export PATH=$HOME/.local/node/bin:$PATH; npm ci; npm test in 0 · (RF1) ảnh gốc 4 trang × 4 khổ vào .ci/anh-goc/ · (RF2) PR Firebase P-06a + P-20 đã gộp và wip/t27 đã gộp vào main chưa; nếu chưa, dừng và báo thầy gộp trước.

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

RF1 push ngay khi xong.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-14 + CHANGELOG + docs/KIEN-TRUC.md mục build · dòng walk · RF2: link PR (tiêu đề "Lớp học ảo: Vite và ES module", base main). Không gì khác.
```
```
/goal P-14a xong: src/lop-hoc-ao/vite.config.js multi-page 5 entry với base /JennyMathClubGame/games/lop-hoc-ao/; plugin nối file theo đúng thứ tự app.template.html dòng 28–130 giữ phạm vi toàn cục; tools/vite/vai.js thay _student.py và _teacher.py với cùng các replace có assert; package.json scripts build = vite build, dev = vite; build.py gọi npm run build; 4 trang ra giống bản cũ (ảnh so .ci/anh-goc sai số ≤ 0.1%); dist/ có hash tên file. Sự thật: data-theme light phải chạy trước CSS; khoá localStorage không đổi để healAll giữ tiến độ. npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện vite.config.js, tools/vite/, package.json, package-lock.json, build.py, app.template.html, CHANGELOG, KIEN-TRUC.md; lane đã push. Hoặc dừng sau 60 lượt và báo cáo.
```
```
/goal P-14b xong: 01-tien-ich export; mọi file core import điều mình dùng (tools/vite/tim-import.mjs sinh dòng import bằng acorn, chạy lại được sau mỗi rebase); hàm đè (save, render, header, viewPH, fbHsBoot…) đổi thành hooks.on trong core/00-hooks.js, grep "^function render\b" còn 1; ESLint no-undef xanh; trang Lớp học ảo bỏ document.write và bỏ 'unsafe-inline' khỏi CSP; ảnh so .ci/anh-goc sai số ≤ 0.1%. Sự thật: PR Firebase P-06a + P-20 và wip/t27 đã gộp trước khi chạm 62, 64, 72. npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện src/lop-hoc-ao/js/**, tools/vite/, app.template.html, .eslintrc, package.json, CHANGELOG, KIEN-TRUC.md; lane đã push. Hoặc dừng sau 80 lượt và báo cáo.
```

### RF3, RF4 — P-15a, P-15b
```
Bạn là phiên RF3 (hoặc RF4) của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-PARALLEL-2026-10-25.md). Lane: feature/vite-module, tiếp từ tip RF2 (RF4: tip RF3); rebase lên origin/main nếu lane Firebase vừa gộp (P-09b, P-21) và chạy lại tools/vite/tim-import.mjs. Hàng: P-15a chuyển nội dung sang content/lop-N (RF4: P-15b tải động + bản QL/GV/PH + test kích cỡ). Cùng lúc đang chạy FB6 (RF3) hoặc FB7 (RF4); không chạm nhánh của họ.

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
Bạn là phiên RF5 của kế hoạch kiến trúc JennyMathClubGame (docs/kien-truc/KE-HOACH-PARALLEL-2026-10-25.md). Lane: feature/vite-module, tiếp từ tip RF4; rebase lên origin/main nếu PR P-21 (hoặc P-22) vừa gộp và chạy lại tools/vite/tim-import.mjs. Hàng: P-16. Luật 25/10: P-16 sở hữu 79-dong-bo.js; Firestore đã bật persistence (P-21) nên không cache yêu cầu Firestore trong service worker. Có thể còn FB8 đang chạy; không chạm nhánh của họ. Đây là phiên cuối: sau khi PR RF gộp, xoá mọi worktree của lộ trình.

Đọc trước, từ origin/main: CLAUDE.md gốc · docs/kien-truc/plans/P-16-pwa.md (dòng ⟳ thắng) · plans/P-21-firestore-ngoai-tuyen.md · TASKS.md T-11 · js/core/34-khoi-dong.js, 63-firestore-tiet-kiem.js và 79-dong-bo.js (bản sau RF4) · vite.config.js.

Trước khi viết gì: git log -1 là tip RF4 · npm test in 0 · Lighthouse PWA hiện tại (ghi "not installable").

Báo cáo 6 dòng. Không xây gì cho tới khi thầy gõ goal đầu tiên.

Kết phiên: push lane · báo cáo 6 dòng · trạng thái P-16 + CHANGELOG + TASKS T-11 · dòng walk ("cài lên điện thoại, tắt mạng, học 1 đảo, bật mạng") · link PR (tiêu đề "Lớp học ảo: Vite, nội dung theo khối, PWA", base main) · sau khi thầy gộp: git -C ~/Documents/JennyMathClubGame worktree remove ~/worktrees/<lane> cho mọi lane đã gộp, liệt kê. Không gì khác.
```
```
/goal P-16 xong: public/manifest.webmanifest và icon pixel 192/512 từ PXJ; vite-plugin-pwa registerType prompt, precache shell + chunk khối của em, runtime cache content/lop-*, không cache firestore.googleapis.com và identitytoolkit, navigateFallbackDenylist cho /giao-vien/ /phu-huynh/ /quan-ly/; 34-khoi-dong.js hiện thanh "Có bản mới · Tải lại"; Lighthouse installable; tắt mạng sau khi mở 1 đảo vẫn học được và ghi lên máy chủ khi nối lại (Firestore persistence của P-21); đẩy bản mới thì thiết bị đang mở báo trong 1 phút. Sự thật: bump cacheId khi đổi cấu trúc dữ liệu. npm test in 0; 7 kiểm tra §7 ĐẠT; git status chỉ hiện public/, vite.config.js, 34-khoi-dong.js, 79-dong-bo.js, package.json, CHANGELOG, TASKS.md; lane đã push. Hoặc dừng sau 40 lượt và báo cáo.
```
