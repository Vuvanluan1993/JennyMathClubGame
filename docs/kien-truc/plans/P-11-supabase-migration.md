# P-11 Vá `lms-thu/setup.sql` thành migration Supabase (chỉ khi Q1 = B)

**Bỏ 25/10/2026 (Q1 = A, giữ Firebase):** không làm. Giữ file để tham khảo; việc an toàn và hiệu quả chuyển sang P-20, P-21, P-22.

**Mục tiêu:** đóng SB-H1, SB-H2, SB-M1…M7 và các L của audit; schema sống trong `supabase/migrations/`, không chạy SQL tay.
**Ước lượng:** 8 giờ. **Người dùng thấy gì:** không (LMS thử). **Cần trước:** Q1 = B.

## File sửa
- Mới: `supabase/config.toml`, `supabase/migrations/0001_init.sql` (= `lms-thu/setup.sql` hiện tại, không đổi), `0002_bao_mat.sql` (các vá dưới), `supabase/tests/*.sql` (pgTAP) hoặc `tools/test/supabase.test.mjs` chạy trên `supabase start` local.
- Sửa: `lms-thu/app.html:488` thêm `rel="noopener noreferrer"`; `lms-thu/sdk.js:25` và `app.html:125` không hiện lỗi Postgres thô; `lms-thu/HUONG_DAN.md` bỏ khuyên "tắt Confirm email", ghi cách gieo quản trị.

## Nội dung `0002_bao_mat.sql`
1. **SB-H1**: bảng `login_attempts(student_id, at)` có index; `s_login` mở đầu `perform pg_advisory_xact_lock(hashtext(s.id::text))`; lùi theo cấp số (5 sai → 1 phút, 10 → 10 phút, 20 → khoá tới khi cô đặt lại); `s_class` không trả `id`, chỉ `name`, và `s_login` nhận `p_name` → máy chủ tự tìm; PIN mầm non 4 hình có lặp (1296) — ghi vào LUAT nếu thầy đồng ý.
2. **SB-H2**: bảng `settings(key,value)`; `claim_super` chỉ cho email trong `settings.admin_emails`; `me()` không trả `super_claimable` cho người khác.
3. **SB-M1**: `students.pin_hash` = `crypt(pin, gen_salt('bf'))`; `k_class` không trả PIN; `k_add_students`/`k_reset_pin` trả PIN **một lần**.
4. **SB-M2**: `s_logout(p_token)`; `sessions.expires_at` 7 ngày trượt (`s_home` gia hạn).
5. **SB-M3**: `l_save` kiểm từng item (`kind` trong danh sách, `url ~ '^https?://'`, `game` trong danh sách, `config` số); `k_assign_lesson` kiểm lại.
6. **SB-M4**: `k_set_attendance` kiểm `students.class_id = session.class_id`; `k_create_assignment`/`k_create_session` kiểm `p_lesson` cùng trung tâm.
7. **SB-M5**: `deleted_at` cho `classes`, `students`, `assignments`; `c_delete_*` đặt `deleted_at` (xoá hẳn = RPC `a_purge` chỉ super, ghi log); `attempts.assignment_id on delete set null`; trigger `set_updated_at` cho 5 bảng.
8. **SB-M6**: `check (correct <= total)`; trần 30 `attempts`/bài/giờ; `stars` tính từ `correct/total` ở máy chủ khi `p_stars` null.
9. **SB-M7 + L**: index `students(center_id)`, `members(user_id)`, `classes(teacher_id)`, `sessions(student_id)`, `sessions(expires_at)`, `lessons(center_id)`, `attendance(student_id)`, `notices(class_id, created_at)`, `audit_log(center_id, at)`, `invites(lower(email))`; `_me()` chỉ nhận lời mời ở `me()`; `c_invite` trả một giá trị; log cho `k_reset_pin`, `k_rename_student`, `l_save`, `a_update_center`; `audit_log.detail` lưu `student_id`, không lưu tên; CHECK `lessons.level`, `centers.seats >= 0`; `revoke all on all tables in schema public from anon, authenticated`.

## Việc phải xong (DONE)
1. `supabase db reset` chạy 0001 + 0002 sạch; test: 20 yêu cầu `s_login` song song sai PIN → chỉ 5 được xử lý, còn lại bị khoá; `anon` gọi `s_class` không thấy `id`.
2. `app.html`, `hs.html` vẫn chạy trọn vòng (tạo lớp → thêm em → in thẻ → em đăng nhập → làm bài → cô xem kết quả).
3. `HUONG_DAN.md` cập nhật; `AUDIT` đánh ☑ các mã SB-*.

## Việc thầy làm (E)
- Supabase › Auth › **tắt đăng ký công khai** (chỉ mời); đặt `settings.admin_emails`; `supabase db push`.

## Bẫy
- Supabase Free **tạm dừng dự án sau 7 ngày không dùng**: thêm workflow `giu-am.yml` gọi `me()` mỗi 3 ngày, hoặc lên Pro khi dùng thật.
- `pg_advisory_xact_lock` giữ đến hết transaction; không gọi trong vòng lặp.
