# Kế hoạch cải tiến kiến trúc — JennyMathClubGame

Bản 25/10/2026. Đích: `KIEN-TRUC-DICH.md`. Lý do: `AUDIT-2026-10-25.md`. Lộ trình chạy song song: `KE-HOACH-PARALLEL-2026-10-25.md` (bản cắt lại; bản đầu `KE-HOACH-ROUTES-2026-10-25.md`).
Mỗi hàng có một kế hoạch con trong `plans/P-xx-*.md` (file sửa, việc phải xong, cách kiểm tra, ước lượng).

Trạng thái: ☐ chưa làm · ◐ đang làm · ☑ xong · ⏸ chờ thầy · ✗ bỏ.

⟳ 27/10/2026 **LỘ TRÌNH ĐÃ XÂY XONG.** PR cuối #19 (P-14c) gộp vào `tich-hop/kien-truc-2026-10`, tip `805351e`, CI 11/11, `npm test` 14/14 (bảng gộp: `TICH-HOP-2026-10-25.md`, 28 hàng). Mọi hàng còn làm đều ☑ hoặc ✗. Còn lại là việc của thầy: thử bản dựng `FB_ENV=thu` trên dự án Firebase thử, rồi quyết định gộp nhánh tích hợp vào `main` (một PR, thầy gộp); sau khi gộp: dựng lại, dán rules + chỉ mục vào dự án thật, 4 mục console.

⟳ 25/10/2026 **THỨ TỰ CHẠY** (bản cắt lại, theo `KE-HOACH-PARALLEL-2026-10-25.md`): đã xong P-01, P-02, P-03, P-04, P-05, P-07, P-09a, P-10 (PR #3, #4, #5); đang chạy P-08 · P-17 · P-06a; mở ngay P-18; khi P-08 push: P-19 · P-14a; lane Firebase tiếp P-20 → P-09b → P-21 (→ P-22 nếu Q5 = Blaze). Độ rộng 4; đường tới hạn P-08 → P-14 → P-15 → P-16 = 6 phiên.

## Quyết định của thầy
| Mã | Quyết định | Ảnh hưởng |
|---|---|---|
| Q1 | **Chốt 25/10: A — giữ Firebase.** Bỏ hẳn giai đoạn Supabase (P-11..P-13 ✗). An toàn và hiệu quả làm bằng Firestore rules, sổ sự kiện chỉ-thêm, bộ nhớ ngoại tuyến (P-20, P-21). Chặn hẳn gian lận xu cần Cloud Functions → Q5 | P-06, P-20, P-21, P-22 |
| Q2 | **Chốt 25/10: B — giữ ngày sinh đầy đủ và Gmail phụ huynh**, tách sang `hoso/{tk}` chỉ quản lý đọc ghi (P-06a). P-09b còn: nút Xuất dữ liệu, nhắc thời hạn lưu | P-06a, P-09b |
| Q3 | **Chốt 25/10: B — Cowork vẫn đẩy thẳng `main`**; bảo vệ nhánh bắt buộc PR + CI xanh nhưng chủ kho được miễn (bypass). Claude Code vẫn qua PR. CI vẫn chạy trên mỗi push `main` để thấy đỏ ngay | P-02 (dòng `CLAUDE.md`, cách bật bảo vệ) |
| Q4 | **Chốt 25/10: A — dựng design system Jenny trong Claude Design**, 2 theme Pixel + Classroom, mở từ tip FE1 | P-18 |
| Q6 | **Chốt 25/10: không gộp gì vào `main` cho tới khi cả kế hoạch xong.** Mọi PR gộp vào nhánh tích hợp `tich-hop/kien-truc-2026-10` (phiên TH, bảng kết quả `TICH-HOP-2026-10-25.md`); thử bằng **dự án Firebase thử riêng** `jenny-lop-hoc-ao-thu` (Spark; đổi lại 25/10 tối: dự án đang chạy giữ nguyên để bản `main` không lỗi). Đã tạo 26/10 qua Claude in Chrome: không Gemini, không Analytics; Firestore asia-southeast1 production; Auth Email/Password; app web `lop-hoc-ao-thu`; rules và chỉ mục của tip `d0d7ad7` đã dán. FB6 thêm công tắc cấu hình theo bản dựng (`FB_ENV=thu` → cấu hình dự án thử). RF2, FB6 cắt từ tip nhánh tích hợp; cuối cùng một PR tích hợp → `main` | mọi hàng còn lại |
| Q5 | **Chốt 26/10: A — giữ Spark, không nâng Blaze.** P-22 ✗. P-20 là mức bảo vệ cuối cho xu (giảm mạnh, không chặn hẳn); tự đăng ký để bật vì tạo tài khoản bằng phiên phụ; sao lưu chỉ P-10. Xem lại khi có tên thật và thấy gian lận xu | P-22 ✗ |

## Giai đoạn 0 — Nền (chạy được mọi kiểm tra, build trên CI)
- ☑ **P-01 Node + CI kiểm tra** (25/10, PR #4, `npm test` 8/8 ĐẠT). `plans/P-01-ci-kiem-tra.md`
  ⟳ 25/10: `npm test` chạy mọi `tools/test/*.mjs` theo tên file (không danh sách cứng) để P-17 chỉ thêm file.
- ☑ **P-02 Build và deploy Pages từ CI; bỏ file sinh ra khỏi git** (25/10, PR #4; CI đỏ 2 lần ở `tu-luyen.js` vì font chưa tải và thanh vai trò rộng hơn 1px trên Linux, đã sửa `726bc6a`, `53e84d8`; theo Q3, bảo vệ `main` bật với bypass cho chủ kho). `plans/P-02-deploy-ci.md`
  ⟳ 25/10: tạo `tools/build_all.py` chạy mọi `tools/build_*.py` theo tên để P-19 không sửa `deploy.yml`.
- ☑ **P-03 Token thiết kế chung** (25/10, nhánh `claude/fe-sach-329fd2`; 4 cặp chữ thường dưới 4.5 chờ thầy quyết: `.pill.ok` 3.90 và 3.23, `.flag.done` trang chủ 2.37, `.qlnote` 4.34). `plans/P-03-design-tokens.md`

## Giai đoạn 1 — Vá bảo mật bản đang chạy (Firebase)
- ☑ **P-04 Siết Firestore rules** (25/10, PR #5; 22 ca `rules.test.mjs` chạy trên CI). `plans/P-04-firestore-rules.md`
- ☑ **P-05 Firebase Auth cứng hơn** (25/10, PR #5; thầy còn 4 việc console trong `src/lop-hoc-ao/docs/FIREBASE-CONSOLE.md`). `plans/P-05-firebase-auth.md`
- ◐ **P-06 Tách blob `org/main.j`** — 06a cấu trúc + chuyển đổi đang chạy (FB3, nhánh `fix/firebase-tach-org`); PII (ngày sinh, SĐT, Gmail) vào `hoso/{tk}` chỉ QL đọc ghi theo Q2. `plans/P-06-tach-org-blob.md`
  ⟳ 25/10: phần 06b "ví xu duyệt bởi QL" **bỏ**, thay bằng P-20 (rules giới hạn, sổ sự kiện chỉ-thêm).
- ☑ **P-07 Bỏ tài khoản thử và băm mật khẩu khỏi bản học sinh thật** (25/10, PR #3). `plans/P-07-bo-demo-khoi-ban-that.md`
  ⟳ 25/10: không chạm `62-may-chu.js`; dòng xoá localStorage khi đăng xuất do P-05 làm.
- ◐ **P-08 CSP, SRI, chữ tự host, bỏ `document.write`** — đang chạy (FE2); chờ thầy duyệt tải 5 file font woff2. `plans/P-08-csp-font-sri.md`

## Giai đoạn 2 — Riêng tư và dữ liệu
- ◐ **P-09 Riêng tư theo PDPL 2025** — 09a văn bản ☑ (PR #3, bản nháp chờ thầy duyệt); 09b theo Q2 = B: nút Xuất dữ liệu một em, nhắc thời hạn lưu, không đổi trường. `plans/P-09-rieng-tu.md`
- ☑ **P-10 Sao lưu hàng tuần** (25/10, PR #3; chưa chạy thật: thầy tạo kho `jenny-backup`, service account, 3 secret). `plans/P-10-sao-luu.md`

## Giai đoạn 3 — Firebase an toàn và tiết kiệm (thay giai đoạn Supabase, chốt 25/10)
- ✗ **P-11, P-12, P-13 Supabase** — bỏ theo Q1 (25/10). Kế hoạch con giữ lại để tham khảo, đầu file ghi "Bỏ".
- ☐ **P-20 Ví xu và sao kiểm soát bằng rules** — `vi/{tk}` có kiểu; mỗi lần ghi cộng tối đa 40 xu và cách lần trước ≥ 3 giây; mua đồ khớp bảng giá `cfg/shop`; sổ sự kiện `ev/{tk}/{id}` chỉ-thêm; trang cô cảnh báo bất thường. Giảm mạnh gian lận; chặn hẳn cần P-22. `plans/P-20-vi-xu-rules.md`
- ☑ **P-21 Firestore ngoại tuyến và tiết kiệm đọc** (26/10, PR #15 base nhánh tích hợp; thử trên dự án thử: 2 ca ngoại tuyến ĐẠT, phiên HS 20 phút 31 đọc so với 35 trước, listener 4 so với 6; trang cô lớp 12 em chưa đo). **Còn sót, giao FB7 (26/10):** công tắc `FB_ENV`/`cau-hinh.json` chưa làm; lỗi có sẵn `fbThietLap` đọc `org/main` trước khi có hồ sơ `users` → Thiết lập lần đầu trên dự án trống bị permission-denied. `plans/P-21-firestore-ngoai-tuyen.md`
- ✗ **P-22 Blaze 0 đồng + Cloud Functions** (bỏ 26/10 theo Q5 = A; giữ kế hoạch con để xem lại khi có tên thật) — hàm `taoTaiKhoan`, `chamXu`, `xoaHocSinh`, chặn tự đăng ký bằng blocking function, xuất sao lưu quản lý theo lịch; HS không còn ghi `vi`. `plans/P-22-blaze-functions.md`

## Giai đoạn 4 — Tái cấu trúc front-end
- ☑ **P-14 Vite + ES module cho Lớp học ảo** — 14a ☑ (RF1, 26/10), 14b ☑ (RF2, PR #12 base nhánh tích hợp: 118 file import/export, hàm đè qua hooks, ESLint 0 lỗi), 14c ☑ (RF6, PR #19, 27/10: CSP bỏ `'unsafe-inline'`; 522 thuộc tính inline đổi sang `data-act` + một listener uỷ quyền `js/core/02-hanh-dong.js`, công cụ `tools/vite/bo-inline.mjs` 480 tự động + 42 tay; 3 script đầu trang ra `js/dau-trang.js`; không làm phần gộp iife vì không cần cho CSP). `plans/P-14-vite-module.md`
- ☑ **P-15 Nội dung theo khối, tải động** (26/10; 15a PR #14, 15b PR #16 base nhánh tích hợp: trang học sinh 680 → 492–517 KB gzip, LCP 1,9 s, test 14/14; thầy chưa walk trên điện thoại). `plans/P-15-noi-dung-theo-khoi.md`
- ☑ **P-16 PWA ngoại tuyến** (27/10, RF5, PR #17 base nhánh tích hợp: Lighthouse PWA 1,0; thử ngoại tuyến trên dự án thử ĐẠT; test 14/14; thầy chưa cài lên điện thoại). `plans/P-16-pwa.md`
- ◐ **P-17 Kiểm tra giao diện tự động** — đang chạy (KT, PR #6); đã thấy 2 lỗi tràn ở 1920×950 (Hành trình · vườn, · cửa hàng), sửa ở task riêng. `plans/P-17-kiem-tra-giao-dien.md`
  ⟳ 25/10: chỉ thêm file test mới + `giao-dien.yml`; không sửa `ci.yml`, `chay-tat-ca.mjs`.

## Giai đoạn 5 — Hệ thống thiết kế và game lẻ
- ◐ **P-18 Design system trong Claude Design** — mở 25/10 theo Q4 từ tip FE1. `plans/P-18-design-system.md`
- ☐ **P-19 Game lẻ dùng kit + token chung** — gom mã trùng của 4 game cũ vào `_kit`, nút ≥ 48px. `plans/P-19-game-le-dung-kit.md`
  ⟳ 25/10: không sửa `deploy.yml`; `tham-tu` sinh bởi `tools/build_tham_tu.py` do `build_all.py` gọi. Mở từ tip P-08.

## Nhật ký quyết định (STAR)
- **27/10/2026 — Lộ trình xây xong, chờ thầy gộp `main`.** Tình huống: 19 PR (#3–#19) đã gộp vào `tich-hop/kien-truc-2026-10` (tip `805351e`), bản dựng `FB_ENV=thu` chạy trên dự án Firebase thử; `main` chưa đổi. Nhiệm vụ: khép lộ trình theo Q6. Hành động: RF6 làm P-14c (PR #19), TH gộp, kế hoạch đánh dấu xong. Kết quả: thầy thử trên điện thoại rồi quyết định mở PR nhánh tích hợp → `main`; đó là lời đồng ý cuối của lộ trình.
- **25/10/2026 — Lập kế hoạch.** Tình huống: app chạy thật trên `main`, máy chủ Firebase mới nối 24/10, chưa có CI, chưa nhập tên thật. Nhiệm vụ: audit và vạch đường tới kiến trúc an toàn. Hành động: audit 3 khu, viết đích và 19 việc. Kết quả: PR #2 mở; chờ Q1–Q4.
- **25/10/2026 — Cắt lộ trình song song.** Tình huống: 19 hàng theo giai đoạn ≈ 19 phiên lần lượt. Nhiệm vụ: thứ tự chạy nhanh nhất không đụng file. Hành động: 4 luật F-c, 9 gói, 22 phiên trong 9 lane. Kết quả: độ rộng 4, đường tới hạn 7 phiên.
- **25/10/2026 — Thầy chốt Q1 = A, bắt đầu lộ trình.** Hành động: mở CI1 · FE1 · FB1 · T1, rồi ngày 2 CI2 · FE2 · FB2 · T2 · KT. Kết quả: PR #3, #4, #5, #6; P-03 xong; Node đã cài.
- **25/10/2026 — Thầy chốt Q2 = B, Q3 = B, Q4 = A và bỏ hẳn Supabase.** Tình huống: giai đoạn 3 cũ dựa vào Supabase để chấm xu ở máy chủ. Nhiệm vụ: giữ mục tiêu an toàn và hiệu quả chỉ với Firebase. Hành động: thay P-11..13 bằng P-20 (rules giới hạn + sổ sự kiện), P-21 (ngoại tuyến, tiết kiệm đọc), P-22 (Blaze 0 đồng + Functions, chờ Q5); cắt lại lộ trình `KE-HOACH-PARALLEL-2026-10-25.md`; mở DS. Kết quả: 13 phiên còn lại (+2 nếu Q5), độ rộng 4, đường tới hạn 6 phiên; thầy gộp PR nhánh `chore/audit-kien-truc` là lời đồng ý với bản cắt lại.
