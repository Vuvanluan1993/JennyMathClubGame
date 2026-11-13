# P-04 Siết Firestore rules

**Mục tiêu:** đóng LH-C1, LH-C2 (phần kiểm tra kiểu), LH-H2, LH-M1, LH-M4 của `AUDIT-2026-10-25.md` mà không đổi cấu trúc dữ liệu.
**Ước lượng:** 5 giờ. **Người dùng thấy gì:** không. **Cần trước:** không.

## File sửa
- `src/lop-hoc-ao/firebase/firestore.rules`
- `src/lop-hoc-ao/js/core/62-may-chu.js:26` (bỏ tra `login/{tk}` trước đăng nhập; thử email ẩn chuẩn, nếu lỗi `user-not-found` thì thử bản ghi `login` **sau** khi có `hasMe()` — hoặc bỏ hẳn tính năng email riêng).
- Mới: `src/lop-hoc-ao/tools/test/rules.test.mjs` chạy với `firebase emulators:exec` (`@firebase/rules-unit-testing`), 12 ca: người lạ đã đăng nhập không đọc `org/main`; HS không ghi `lop`; HS ghi `j` không phải string bị chặn; GV không đọc `users` người khác; PH chỉ đọc `asg` của lớp con…
- Mới: `src/lop-hoc-ao/firebase/firebase.json` (emulator).

## Luật mới
```
match /org/main   { allow read: if hasMe(); create: if signed() && !exists(org) && admins==[uid]; update: if isQL() || (isGV() && affectedKeys().hasOnly(['j','t'])); }
match /users/{uid}{ allow read: if signed() && (uid==request.auth.uid || isQL()); }
match /hs/{tk}    { allow write: if (isSelf(tk) && request.resource.data.keys().hasOnly(['j','ev','lop','t'])
                      && request.resource.data.j is string && request.resource.data.j.size() < 900000
                      && request.resource.data.lop == resource.data.lop) || isQL(); }
match /login/{tk} { allow read: if false;  /* bỏ; email ẩn là chuẩn */ }
match /asg/{id}   { allow read: if isQL() || (isGV() && resource.data.lop in org().pc[me().gvId]) || (isSelf-lớp) || (isPH && con ở lớp đó);
                    allow write: if isQL() || (isGV() && request.resource.data.lop in org().pc[me().gvId]); }
```
GV vẫn ghi `j` (chưa tách được ở bước này) — ghi rõ trong CHANGELOG là **còn LH-H1**, P-06 đóng.

## Việc phải xong (DONE)
1. `rules.test.mjs` 12/12 đạt trên emulator (trong CI nếu P-01 đã có; không thì chạy tay, dán kết quả vào PR).
2. App học sinh, GV, PH, QL vẫn đăng nhập và lưu được với tài khoản thử (`node tools/test/dong-bo.js` ĐẠT).
3. `CHANGELOG.md` + `LUAT-DA-CHOT.md §6i` ghi luật mới và việc còn lại.

## Việc thầy làm (E)
- Dán `firestore.rules` mới vào Firestore › Rules; xoá collection `login` nếu trống.

## Bẫy
- `org()` gọi `get()` tốn 1 đọc mỗi lần kiểm tra; giới hạn 10 `get` mỗi yêu cầu.
- P-05 và P-06 cũng sửa `62-may-chu.js`: cùng lane, chạy sau.
