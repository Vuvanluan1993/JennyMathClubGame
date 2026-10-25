# P-12 Lớp đồng bộ Supabase cho Lớp học ảo (chỉ khi Q1 = B)

**Mục tiêu:** app học sinh, GV, PH, QL nói chuyện với Supabase qua RPC; xu/sao chấm ở máy chủ; giữ nguyên giao diện và hành vi.
**Ước lượng:** 16 giờ = 2 phiên (12a schema + RPC cho Lớp học ảo; 12b lớp đồng bộ trong app). **Người dùng thấy gì:** không (cùng màn hình). **Cần trước:** P-11 đã push.

## 12a — schema và RPC (`supabase/migrations/0003_lop_hoc_ao.sql`)
- Bảng: `accounts(tk unique, role, user_id, center_id, must_change)`, `students` (dùng lại) + `enrollments(student, school_year, class)`, `guardians` + `guardian_students`, `progress(student, island, m jsonb, fails jsonb, les bool, t)`, `answers(student, island, kind, ok, first_try, tries, seconds, at)`, `wallet(student, coins, items jsonb, pets jsonb, outfit jsonb, t)`, `wallet_log(student, delta, reason, ref, at)`, `teacher_notes(student, comments jsonb, badges jsonb, note, skip jsonb)`, `assignments` (dùng lại), `class_settings(class, mo jsonb, tj jsonb)`.
- RPC học sinh: `h_boot()` (trả lớp, khối, progress, wallet, notes, bài cô giao), `h_answer(island, kind, ok, first_try, tries, seconds)` → ghi `answers`, cập nhật `progress`, **tính xu/sao theo luật §6** và ghi `wallet_log`; `h_buy(item)`; `h_game_end(mode, island, score)` (xu trần 20/ván); `h_save_misc(jsonb)` cho `sk/dd/skm/mist` (giới hạn 200 KB).
- RPC GV/QL/PH: ánh xạ 1-1 các hàm QL hiện có (`qlTaoHS`, `len lop`, `nhap excel`, `sua`, `xoa`, `phu huynh`) → `q_*`; mọi hàm ghi `audit_log`.
- Login: tài khoản email ẩn `tk@jenny.local` qua Supabase Auth; tạo tài khoản bằng **Edge Function `tao-tai-khoan`** (service role, chỉ QL gọi) thay cho phiên phụ ở trình duyệt.

## 12b — lớp đồng bộ trong app
- Mới: `src/lop-hoc-ao/js/core/62b-may-chu-supabase.js` cùng tên hàm với `62-may-chu.js` (`fbDangNhap`, `fbHsBoot`, `fbGvBoot`, `fbDay`, `fbQLTaoHS`…) nhưng gọi `supabase.rpc`; chọn máy chủ bằng `window.MAY_CHU='supabase'` trong `app.template.html` (một dòng include).
  ⟳ 25/10: dòng include `62b` thêm ở **cuối** danh sách include để rebase lên lane FE/RF không xung đột.
- Sửa: `11-sao-va-mo-khoa.js`, `64-xu.js`, `49-gian-hang.js`, `51-kho-game.js`, `18-choi-man.js`: khi `MAY_CHU==='supabase'` thì xu/sao **đọc từ** kết quả RPC, không tự cộng.
- Sửa: `79-dong-bo.js` — hàng đợi câu trả lời khi mất mạng (`answers_pending` trong localStorage), gửi lại theo thứ tự.
- Test: `tools/test/dong-bo-supabase.js` (giả lập RPC), 7 kiểm tra §7.

## Việc phải xong (DONE)
1. `supabase start` local + app: đăng nhập 4 vai, học 1 đảo, mua 1 món, cô giao bài, PH xem — chạy trọn vòng.
2. Console `S.st[sid].coins=1e6;save()` → tải lại vẫn số cũ (xu từ máy chủ).
3. Mất mạng giữa màn → nối lại → câu trả lời được gửi, không trùng (`answers` có `client_id` unique).
4. 7 kiểm tra §7 ĐẠT; `dong-bo-supabase.js` ĐẠT.

## Bẫy
- `62-may-chu.js` giữ nguyên để quay lại Firebase được trong 1 tháng chạy song song (P-13).
- Edge Function cần `supabase functions deploy` — thầy chạy; khoá service role không bao giờ vào trang.
- Realtime chỉ bật cho `assignments`, `class_settings`; `progress` của em không cần nghe (giảm đọc).
