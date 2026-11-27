# Kiến trúc đích — JennyMathClubGame (bản đề xuất 25/10/2026)

Tài liệu này mô tả kiến trúc **an toàn và gọn** mà kho nên tiến tới. Phần "vì sao" nằm ở `AUDIT-2026-10-25.md`;
phần "làm thế nào, theo thứ tự nào" nằm ở `KE-HOACH.md` và `KE-HOACH-ROUTES-2026-10-25.md`.

Chuẩn và nguồn đối chiếu: OWASP ASVS 5.0 và OWASP Top 10 (2021), OWASP Cheat Sheets (CSP, lưu mật khẩu, quản lý phiên),
NIST SP 800-63B (xác thực), WCAG 2.2 AA, Core Web Vitals (web.dev), hướng dẫn bảo mật Firebase Security Rules và Supabase RLS,
Luật Bảo vệ dữ liệu cá nhân 2025 (Luật 91/2025/QH15, hiệu lực 01/01/2026) và Nghị định 13/2023, nguyên tắc dữ liệu trẻ em (UNICEF, COPPA),
Hirsh-Pasek 2015 và Mayer (đã dùng trong `TIEU_CHI.md`).

## 1. Nguyên tắc
1. **Trình duyệt không được tin.** Mọi quyết định có giá trị (điểm, xu, quyền, tài khoản) phải được máy chủ kiểm tra. Trang tĩnh chỉ vẽ và gửi sự kiện.
2. **Ít dữ liệu nhất có thể.** Trẻ em: chỉ tên gọi, khối, lớp. Phụ huynh: một kênh liên hệ. Không ngày sinh đầy đủ, không ảnh, không địa chỉ.
3. **Một nguồn sự thật cho mỗi thứ.** Bảng màu, chữ, cỡ nút ở một file token; nội dung bài ở dữ liệu, không ở mã; luật ở `LUAT-DA-CHOT.md`.
4. **File sinh ra không nằm trong git.** Build chạy trên CI và đưa lên Pages; nhánh phụ không còn xung đột file build.
5. **Mọi thay đổi qua kiểm tra tự động** (build, test đề, test khung hình, đo tương phản) trước khi lên `main`.
6. **Chi phí gần 0 đồng** vẫn là ràng buộc: ưu tiên gói miễn phí, nhưng nói rõ gói miễn phí thiếu gì (sao lưu, hàm máy chủ).

## 2. Sơ đồ đích

```
Trình duyệt (HS / GV / PH / QL)                     Máy chủ dữ liệu
┌───────────────────────────────┐                  ┌──────────────────────────────┐
│ Trang tĩnh (GitHub Pages)     │  HTTPS, JWT      │ Postgres + RLS (Supabase)     │
│  - app học sinh (PWA, pixel)  │ ───────────────▶ │  - bảng quan hệ, khoá ngoại   │
│  - trang GV / PH / QL (LMS)   │  chỉ gọi RPC     │  - RPC SECURITY DEFINER       │
│  - game lẻ + Bebras kit       │ ◀─────────────── │  - audit_log, xoá mềm         │
│  - design tokens chung        │  realtime (tuỳ)  │  - Auth (email ẩn / PIN HS)   │
└───────────────────────────────┘                  └──────────────────────────────┘
        ▲ build bởi CI                                   ▲ migration trong git
┌───────────────────────────────┐                  ┌──────────────────────────────┐
│ GitHub Actions                │                  │ supabase/migrations/*.sql     │
│  lint → test → build → Pages  │                  │  supabase db push (thầy chạy) │
└───────────────────────────────┘                  └──────────────────────────────┘
```

Hai lựa chọn máy chủ, thầy quyết (xem AUDIT §5):

| | A. Giữ Firebase Spark, vá | B. Chuyển sang Supabase (đã có `lms-thu`) |
|---|---|---|
| Kiểm tra phía máy chủ | Chỉ qua Rules; không có hàm (Cloud Functions cần gói Blaze) | RPC trong Postgres, miễn phí |
| Dữ liệu | Tách blob JSON thành nhiều document, rules kiểm tra kiểu | Bảng quan hệ, khoá ngoại, ràng buộc |
| Sao lưu | Không có ở Spark | Không có PITR ở Free; có hàng ngày ở Pro (25 USD/tháng) |
| Rủi ro gói miễn phí | 50k đọc/ngày | Dự án **tạm dừng** sau 7 ngày không dùng (Free) |
| Công sức | Vừa (viết lại rules + tách document + đổi mã đồng bộ) | Lớn hơn (đổi lớp đồng bộ `62`, `79`), nhưng tái dùng `setup.sql` |
| Khuyến nghị | Làm ngay ở giai đoạn 1 (vá lỗ hổng) | Mục tiêu giai đoạn 3 khi có >1 lớp thật |

## 3. Front-end đích

| Thành phần | Hiện tại | Đích |
|---|---|---|
| Mã nguồn Lớp học ảo | 90 file JS phạm vi toàn cục, hàm sau đè hàm trước, ghép bằng regex | ES module, `import/export`, một `main.js` mỗi vai; không đè hàm |
| Nội dung bài (900 KB JS) | Hàm sinh câu trộn với dữ liệu, tải hết 5 khối | Dữ liệu JSON theo khối + bộ sinh câu riêng; tải khối của em (`import()` động) |
| Build | `build.py` nối chuỗi, ghi dấu giờ vào file | Vite (hoặc esbuild) → `dist/` chỉ trên CI; hash tên file để cache |
| Trang/vai | 4 bản HTML 2,1 MB giống nhau | 1 shell + 4 entry nhỏ, dùng chung chunk |
| Kiểu dáng | 3 bộ token khác tên (`--ink/--sea` · `--paper/--mint` · `PXC`) | 1 file `design/tokens.css` + `tokens.json`, mọi game import |
| Chữ | Google Fonts (5 họ, gọi mạng ra ngoài) | Tự host woff2 trong `assets/fonts/`, `font-display: swap` |
| Bảo vệ trang | Không CSP, script inline, `document.write` | `<meta http-equiv="Content-Security-Policy">`, không inline, SRI cho script ngoài |
| Ngoại tuyến | Không | PWA: manifest + service worker (Workbox), cache nội dung khối của em |
| Kiểm tra | 7 script Node chạy tay, máy chưa có Node | Chạy trên CI mỗi PR; local `npm test` |
| Tiếp cận | Theo TIEU_CHI, chưa đo | axe-core trong Playwright, đo tương phản tự động |

## 4. Back-end và dữ liệu đích (mô hình B)

Bảng chính (dựng từ `lms-thu/setup.sql`, chỉnh theo audit):

```
centers ─< members(user, role) ─< classes ─< enrollments(student, school_year, class)
students(display_name, level, pin_hash, center)      ← không DOB đầy đủ, không địa chỉ
guardians(contact_hash, user) ─< guardian_students
lessons · assignments ─< attempts ─< answers(skill, first_try, tries, seconds)
progress(student, island, stars, coins_delta, server_ts)   ← xu/sao tính từ attempts, không nhận số thô
audit_log(actor, action, target, detail, ts)               ← mọi thao tác quản lý
```

Quy tắc:
- RLS bật trên mọi bảng, **không policy đọc trực tiếp**; trình duyệt chỉ gọi RPC `SECURITY DEFINER` có `set search_path`, mỗi RPC kiểm tra vai + trung tâm.
- `REVOKE EXECUTE ... FROM anon, public` cho mọi RPC trừ hàm đăng nhập học sinh; hàm đó có **giới hạn thử** (bảng `login_attempts`, khoá 5 phút sau 5 lần sai).
- PIN học sinh băm bằng `pgcrypto` (`crypt(..., gen_salt('bf'))`); phiên học sinh là JWT ngắn hạn do RPC phát (hoặc Supabase Auth anonymous + claim).
- Điểm/xu: trình duyệt gửi **từng câu trả lời**; máy chủ tính sao/xu theo luật (`LUAT-DA-CHOT` §6) bằng hàm; trình duyệt chỉ hiển thị.
- Xoá mềm (`deleted_at`) + nhật ký; xoá hẳn chỉ bằng RPC quản trị và ghi log (đúng luật "không xoá hẳn" §6h).
- Migration là file SQL có số thứ tự trong `supabase/migrations/`; không chạy SQL tay ngoài migration.

Nếu thầy giữ Firebase (mô hình A), tối thiểu:
- Tách `org/main.j` thành `classes/{id}`, `students/{tk}`, `teachers/{id}`; rules kiểm tra `request.resource.data` từng trường (kiểu, độ dài).
- Bỏ `login/{tk}` đọc công khai; `asg/{id}` chỉ đọc theo lớp; GV chỉ sửa lớp mình.
- Tắt đăng ký tự do trong Firebase Auth Console; bật **App Check**; bật bảo vệ liệt kê email.
- `hs/{tk}` chia thành `progress` (em ghi, chỉ cho phép tăng dần, có trần mỗi lần ghi) và `wallet` (chỉ QL ghi).

## 5. An toàn và riêng tư (bắt buộc trước khi nhập tên thật)
- Trang "Chính sách riêng tư" ngắn cho phụ huynh + mẫu đồng ý bằng văn bản (PDPL 2025; trẻ dưới 7 tuổi cần cha mẹ đồng ý).
- Hồ sơ chuyển dữ liệu ra nước ngoài nếu máy chủ ở Singapore (cả Firebase asia-southeast1 và Supabase ap-southeast-1).
- Dữ liệu tối thiểu: bỏ "Ngày sinh" đầy đủ (giữ năm sinh), bỏ Gmail phụ huynh nếu đã có SĐT; băm SĐT khi dùng để ghép anh chị em.
- Quyền của chủ dữ liệu: nút **Xuất** và **Xoá** dữ liệu một em (đã có xoá; thêm xuất JSON).
- Thời hạn lưu: dữ liệu học giữ 2 năm sau khi nghỉ, rồi xoá tự động.
- Sao lưu: xuất tuần (`pg_dump` qua GitHub Actions có lịch, mã hoá, lưu vào kho riêng tư) vì cả hai gói miễn phí đều không sao lưu.
- Bí mật: không có khoá bí mật trong kho (hiện đúng); khoá CI đặt ở GitHub Secrets; bật Dependabot + secret scanning.

## 6. Quy trình và kho
- Bảo vệ nhánh `main`: bắt buộc PR + CI xanh; Cowork và Code đều qua PR (bỏ "Cowork làm thẳng trên main" khi CI deploy xong).
- CI: `lint → test (Node) → build → deploy Pages` trên push `main`; trên PR chỉ `lint → test → build`.
- Workflow thu giọng đọc: đổi `contents: write` + push thẳng `main` thành mở PR hoặc tải lên Release asset.
- `games/lop-hoc-ao/**` và `src/lop-hoc-ao/dist/` ra khỏi git sau khi CI deploy chạy.
- Một `package.json` gốc: `npm test` chạy đủ 7 kiểm tra của `LUAT-DA-CHOT` §7 + `check_fit`.

## 7. Hệ thống thiết kế (design system)
Có, nên có — vì hiện có **ba ngôn ngữ hình ảnh** chạy song song: pixel (app học sinh: VT323 + Be Vietnam Pro + `PXC`),
kiểu Google Classroom (trang GV/PH/QL: Lexend, viền xám, xanh #0079C1) và trang chủ + Bebras kit (Baloo 2 + Nunito, `--paper/--mint`).
Ba bộ token khác tên nên một lần đổi màu logo phải sửa ba nơi.

Đề xuất:
1. Tạo **một design system trong Claude Design** với 2 "theme" trên cùng một bộ token nền: `Jenny Pixel` (học sinh, game) và `Jenny Classroom` (GV/PH/QL).
   Token: màu từ logo Clb (`PXC`), thang chữ (VT323/Be Vietnam Pro · Lexend · Baloo 2/Nunito chỉ cho trang chủ), cỡ chạm ≥ 48px, khoảng cách 4/8/12/16, khung pixel `--f2/--f3`, bóng cứng, bo 0 (pixel) / 8px (classroom).
   Thành phần: nút (chính/phụ/nguy hiểm), ô phương án, khung pixel, thẻ lớp, bảng nhập có nút dính đáy, toast, hộp thoại, thanh trên, huy hiệu mức (Mới bắt đầu → Vững).
2. Đồng bộ sang mã: xuất `design/tokens.css` + `tokens.json`; `app.css`, `kit.css`, `index.html` đổi sang dùng token chung (giữ tên cũ bằng alias trong giai đoạn chuyển).
3. Kiểm tra tự động: tương phản ≥ 4.5:1 (chữ thường) và 3:1 (chữ lớn/nút) chạy trong Playwright; cỡ nút ≥ 48px trên khổ 320.
4. Luật đã chốt vẫn giữ: học sinh pixel, GV/PH/QL kiểu Classroom, luôn nền sáng; design system chỉ gom lại chứ không đổi quyết định của thầy.

## 8. Những gì khác để thành sản phẩm web thật
- Tên miền riêng + HTTPS (Pages hỗ trợ), trang 404, trang báo lỗi.
- Quan sát: Sentry (gói miễn phí) bắt lỗi JS, không gửi dữ liệu cá nhân; không Google Analytics với trẻ em.
- Phiên bản: `CHANGELOG` + tag `vYYYY.MM.DD`; nút "Có bản mới, tải lại" trong PWA.
- Hỗ trợ: trang "Hướng dẫn cho cô" và "cho phụ huynh" tĩnh; email liên hệ.
- Thử với người dùng thật theo `TIEU_CHI.md` mục cuối (2–3 em mỗi lứa tuổi) trước mỗi đợt lớn.
