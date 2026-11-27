# P-13 Chuyển dữ liệu Firebase → Supabase và cắt chuyển (chỉ khi Q1 = B)

**Bỏ 25/10/2026 (Q1 = A, giữ Firebase):** không làm. Giữ file để tham khảo; việc an toàn và hiệu quả chuyển sang P-20, P-21, P-22.

**Mục tiêu:** dữ liệu thật đang có trên Firestore sang Supabase không mất; chạy song song 1 tuần; tắt Firebase.
**Ước lượng:** 6 giờ (+ 1 tuần theo dõi). **Người dùng thấy gì:** một thông báo "Hệ thống nâng cấp, em đăng nhập lại". **Cần trước:** P-12 đã push; sao lưu P-10 đã chạy ít nhất 1 lần.

## File sửa
- Mới: `tools/chuyen/firebase-sang-supabase.mjs` (đọc bản sao lưu JSON của P-10 → gọi RPC `q_*`/`insert` qua service role **chạy trên máy thầy**, không trên CI), `tools/chuyen/README.md` (bảng ánh xạ `org.j.hs[]` → `students`, `gd` → `enrollments`, `hs/{tk}.j.p1` → `progress`, `coins/items` → `wallet`, `hsgv` → `teacher_notes`, `asg` → `assignments`, `nk` → `audit_log`).
- Sửa: `src/lop-hoc-ao/app.template.html` đổi `MAY_CHU` sang `supabase`; `README.md`, `src/lop-hoc-ao/CLAUDE.md` mục máy chủ; `docs/LUAT-DA-CHOT.md §6i` ghi quyết định đổi máy chủ (ngày).
- `.github/workflows/sao-luu.yml`: thêm `pg_dump` Supabase (xem P-10).

## Việc phải xong (DONE)
1. Chạy chuyển trên bản sao lưu → số học sinh, lớp, đảo đã qua, xu bằng nhau (script in bảng so sánh).
2. Chạy song song: 1 tuần app ghi cả hai (cờ `MAY_CHU='ca-hai'` chỉ trong tuần này), so khớp mỗi ngày bằng script.
3. Cắt chuyển: đổi cờ, mọi tài khoản đăng nhập lại được bằng mật khẩu cũ (Supabase Auth nhận băm scrypt Firebase qua import, hoặc đặt lại mật khẩu kèm phiếu in).
4. Firebase: rules đổi thành `allow read, write: if false;` sau 30 ngày; xoá project sau 90 ngày.

## Việc thầy làm (E)
- Chạy script chuyển trên máy thầy với khoá service role; duyệt bảng so sánh; chọn ngày cắt chuyển (cuối tuần).

## Bẫy
- Mật khẩu Firebase băm scrypt với tham số riêng: dùng `supabase auth import` (hỗ trợ Firebase scrypt) — thử với 1 tài khoản trước.
- Không chạy chuyển hai lần vào cùng project nếu không có `on conflict do nothing`.
