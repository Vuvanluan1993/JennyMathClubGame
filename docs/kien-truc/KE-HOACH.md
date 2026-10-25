# Kế hoạch cải tiến kiến trúc — JennyMathClubGame

Bản 25/10/2026. Đích: `KIEN-TRUC-DICH.md`. Lý do: `AUDIT-2026-10-25.md`. Lộ trình chạy song song: `KE-HOACH-ROUTES-2026-10-25.md`.
Mỗi hàng có một kế hoạch con trong `plans/P-xx-*.md` (file sửa, việc phải xong, cách kiểm tra, ước lượng).

Trạng thái: ☐ chưa làm · ◐ đang làm · ☑ xong · ⏸ chờ thầy.

⟳ 25/10/2026 **THỨ TỰ CHẠY** (theo `KE-HOACH-ROUTES-2026-10-25.md`, không theo giai đoạn): ngày 1 mở cùng lúc P-01 · P-03 · P-04 · P-07+P-09a (· P-11 nếu Q1 = B); ngày 2 P-02 · P-08 · P-05 · P-10 (· P-12a); ngày 3 P-17 · P-19 · P-18 · P-06a · P-14a (· P-12b); ngày 4–7 P-06b, P-09b, P-14b, P-15a, P-15b, P-16 (· P-13). Độ rộng 4 (5 với B); đường tới hạn P-03 → P-08 → P-14 → P-15 → P-16 = 7 phiên.

## Quyết định thầy cần cho trước khi chạy
| Mã | Quyết định | Ảnh hưởng |
|---|---|---|
| Q1 | **Đã chốt 25/10/2026: A — giữ Firebase**, vá theo P-04, P-05, P-06. Supabase (P-11..P-13) để sau, chỉ xem lại khi có >1 lớp thật | A → làm P-04..P-06; P-11..P-13 ⏸ |
| Q2 | Bỏ ngày sinh đầy đủ, chỉ giữ năm sinh? (LUAT 6i đang ghi ngày sinh) | P-09 |
| Q3 | Cowork cũng qua PR sau khi CI deploy chạy? | P-02 |
| Q4 | Tạo design system trong Claude Design (2 theme Pixel + Classroom)? | P-18 |

## Giai đoạn 0 — Nền (chạy được mọi kiểm tra, build trên CI)
- ☑ **P-01 Node + CI kiểm tra** (25/10, nhánh `claude/ci-kiem-tra-d60209` `3a62601`, `npm test` 8/8 ĐẠT) — `package.json` gốc, `npm test` chạy 7 kiểm tra của LUAT §7; GitHub Actions chạy trên mỗi PR. `plans/P-01-ci-kiem-tra.md`
  ⟳ 25/10: `npm test` chạy mọi `tools/test/*.mjs` theo tên file (không danh sách cứng) để P-17 chỉ thêm file. Push ngay khi xong: mọi lane rebase lên tip này.
- ◐ **P-02 Build và deploy Pages từ CI; bỏ file sinh ra khỏi git** — `deploy.yml`; `.gitignore` thêm `games/lop-hoc-ao/**/index.html`, `dist/`; workflow thu giọng mở PR thay vì push `main`. `plans/P-02-deploy-ci.md`
  ⟳ 25/10: tạo `tools/build_all.py` chạy mọi `tools/build_*.py` theo tên để P-19 không sửa `deploy.yml`.
- ☑ **P-03 Token thiết kế chung** (25/10, nhánh `claude/fe-sach-329fd2` `419ae20`; 36 cặp đo, 4 cặp chữ thường dưới 4.5 chờ thầy quyết: `.pill.ok` 3.90 và 3.23, `.flag.done` trang chủ 2.37, `.qlnote` 4.34) — `design/tokens.css` + `tokens.json`; `app.css`, `kit.css`, `index.html` dùng chung qua alias; kiểm tra tương phản. `plans/P-03-design-tokens.md`

## Giai đoạn 1 — Vá bảo mật bản đang chạy (Firebase)
- ☑ **P-04 Siết Firestore rules** (25/10, nhánh `fix/firebase-va` `19220b1`; `rules.test.mjs` 22 ca chưa chạy tại máy vì thiếu Java, chạy trên CI khi có PR) — `asg` đọc theo lớp; `hs/{tk}` kiểm tra kiểu/cỡ; bỏ `login/{tk}` đọc công khai. `plans/P-04-firestore-rules.md`
- ◐ **P-05 Firebase Auth cứng hơn** — App Check, bảo vệ liệt kê email, mật khẩu ≥ 8, tắt tự đăng ký (console) + mã khởi tạo App Check. `plans/P-05-firebase-auth.md`
- ☐ **P-06 Tách blob `org/main.j` và chống sửa xu/sao** — chia document theo lớp/học sinh; ví xu chỉ quản lý ghi; GV chỉ sửa lớp mình. (Chỉ khi Q1 = A.) `plans/P-06-tach-org-blob.md`
- ☑ **P-07 Bỏ tài khoản thử** (25/10, nhánh `chore/bo-demo-rieng-tu` `8b5ae1a`; 12 chữ `jenny123` còn lại là `MK0`, P-05 xử lý) và băm mật khẩu khỏi bản học sinh thật** — bản demo tách riêng `games/lop-hoc-ao/demo/`. `plans/P-07-bo-demo-khoi-ban-that.md`
  ⟳ 25/10: không chạm `62-may-chu.js`; dòng xoá localStorage khi đăng xuất do P-05 làm. Chạy cùng phiên với P-09a.
- ◐ **P-08 CSP, SRI, chữ tự host, bỏ `document.write`** — mọi trang và game. `plans/P-08-csp-font-sri.md`

## Giai đoạn 2 — Riêng tư và dữ liệu
- ◐ **P-09 Riêng tư theo PDPL 2025** (09a văn bản ☑ 25/10 bản nháp trên `chore/bo-demo-rieng-tu`, chờ thầy duyệt; 09b chờ Q2) — trang chính sách, mẫu đồng ý, dữ liệu tối thiểu, nút Xuất dữ liệu một em, thời hạn lưu. `plans/P-09-rieng-tu.md`
- ◐ **P-10 Sao lưu hàng tuần** — workflow có lịch xuất dữ liệu, mã hoá, lưu kho riêng tư; thử khôi phục. `plans/P-10-sao-luu.md`

## Giai đoạn 3 — Máy chủ Supabase (⏸ Q1 = A ngày 25/10; chỉ xem lại khi có >1 lớp thật)
- ⏸ **P-11 Vá `lms-thu/setup.sql` thành migration** — sửa H1, H2, M1–M7 của audit; `supabase/migrations/`. `plans/P-11-supabase-migration.md`
- ⏸ **P-12 Lớp đồng bộ Supabase cho Lớp học ảo** — `62b-may-chu-supabase.js` cùng giao diện hàm với `62`; chấm xu/sao ở máy chủ. `plans/P-12-dong-bo-supabase.md`
- ⏸ **P-13 Chuyển dữ liệu và cắt chuyển** — script chuyển Firebase → Supabase, chạy song song 1 tuần, tắt Firebase. `plans/P-13-chuyen-du-lieu.md`

## Giai đoạn 4 — Tái cấu trúc front-end
- ☐ **P-14 Vite + ES module cho Lớp học ảo** — thay `build.py` bằng Vite, giữ hành vi; 4 entry dùng chung chunk. `plans/P-14-vite-module.md`
- ☐ **P-15 Nội dung theo khối, tải động** — `js/content/**` thành gói mỗi khối, `import()` khi đăng nhập. `plans/P-15-noi-dung-theo-khoi.md`
- ☐ **P-16 PWA ngoại tuyến** — manifest, service worker, nút "có bản mới". `plans/P-16-pwa.md`
- ◐ **P-17 Kiểm tra giao diện tự động** — axe-core, tương phản, `check_fit` trên CI. `plans/P-17-kiem-tra-giao-dien.md`
  ⟳ 25/10: chỉ thêm file test mới + `giao-dien.yml`; không sửa `ci.yml`, `chay-tat-ca.mjs`. Mở từ tip P-01, chạy song song với P-19, P-18.

## Giai đoạn 5 — Hệ thống thiết kế và game lẻ
- ☐ **P-18 Design system trong Claude Design** — 2 theme Pixel + Classroom, xuất token khớp P-03. `plans/P-18-design-system.md`
- ☐ **P-19 Game lẻ dùng kit + token chung** — gom mã trùng của 4 game cũ vào `_kit`, bỏ font ngoài. `plans/P-19-game-le-dung-kit.md`
  ⟳ 25/10: không sửa `deploy.yml`; `tham-tu` sinh bởi `tools/build_tham_tu.py` do `build_all.py` gọi. Mở từ tip P-08.

## Nhật ký quyết định (STAR)
- **25/10/2026 — Lập kế hoạch.** Tình huống: app chạy thật trên `main`, máy chủ Firebase mới nối 24/10, chưa có CI, chưa nhập tên thật. Nhiệm vụ: audit và vạch đường tới kiến trúc an toàn. Hành động: audit 3 khu (Lớp học ảo + Firebase, lms-thu Supabase, game lẻ + công cụ), viết đích và 19 việc. Kết quả: chờ thầy trả lời Q1–Q4; thứ tự chạy ở file ROUTES.
- **25/10/2026 — Cắt lộ trình song song.** Tình huống: 19 hàng xếp theo giai đoạn sẽ chạy lần lượt ≈ 19 phiên. Nhiệm vụ: tìm thứ tự chạy nhanh nhất mà không đụng file. Hành động: đọc file mỗi kế hoạch con, 4 luật F-c (P-07/62, P-17/ci.yml, P-19/deploy.yml, P-12/include), gộp 19 hàng thành 9 gói, 22 phiên trong 9 lane. Kết quả: độ rộng 4 (5 với B), đường tới hạn 7 phiên, 3 walk; thầy gộp PR nhánh `chore/audit-kien-truc` là lời đồng ý với lộ trình.
- **25/10/2026 — Thầy chốt Q1 = A và bắt đầu lộ trình.** Tình huống: thầy trả lời "giữ Firebase, vá theo P-04, P-05, P-06" và "bắt đầu lộ trình". Nhiệm vụ: mở ngày 1. Hành động: ghi Q1, ⏸ giai đoạn 3, mở 4 phiên CI1 · FE1 · FB1 · T1 đọc kế hoạch từ nhánh `chore/audit-kien-truc` tới khi PR #2 gộp. Kết quả: Q2, Q3, Q4 còn chờ (chỉ gate P-09b, một dòng CLAUDE.md ở P-02, P-18).
