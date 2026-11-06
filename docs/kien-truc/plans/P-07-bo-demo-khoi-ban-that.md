# P-07 Bỏ tài khoản thử và băm mật khẩu khỏi bản học sinh thật

**Mục tiêu:** đóng LH-H3 (phần demo), LH-M2, GL-C1/GL-M2 (mã CLB). Bản thật chỉ đăng nhập máy chủ; bản demo tách riêng.
**Ước lượng:** 4 giờ. **Người dùng thấy gì:** bản thật không còn vào được bằng `jenny01/jenny123`; có địa chỉ demo riêng. **Cần trước:** không.

## File sửa
- `src/lop-hoc-ao/tools/_student.py`: tham số `--demo`; bản thật bỏ `ACC`, bỏ nhánh offline hash; bản demo ghi ra `games/lop-hoc-ao/demo/index.html` với `<meta name=robots content=noindex>` và dải "Bản thử — dữ liệu chỉ trên máy này".
- `src/lop-hoc-ao/tools/_teacher.py:5`: bỏ `PW='giaovien123'`; trang GV/PH/QL thật chỉ đăng nhập Firebase; bản demo ở `games/lop-hoc-ao/demo/giao-vien/`…
- `src/lop-hoc-ao/tools/build.py`: gọi `_student.py` 2 lần (thật, demo).
- ~~`src/lop-hoc-ao/js/core/62-may-chu.js:29`~~ ⟳ 25/10: dòng xoá `jennyHSc_*`, `jennyVirtualDemo_v10`, `window.qlMK` khi đăng xuất chuyển sang **P-05** (cùng lane Firebase). P-07 không chạm `62`.
- `tools/check_fit.py:126`: mã CLB đọc từ `os.environ['JENNY_CLB_CODE']`; `README.md` mục Hành Trình ghi cách đặt.
- `games/hanh-trinh-jenny/lop-6/index.html:339,809,825`, `tieu-hoc/index.html:372`: `localStorage` → `sessionStorage` cho `jenny-club-code`.
- `games.js`: thêm thẻ "Lớp Học Ảo — bản thử" `hidden: true`.

## Việc thầy làm (E)
- Đổi mã CLB, chạy lại `build_bank.py` và `build_bank_th.py`, commit `bank.enc` mới (mã cũ `JENNY123` coi như đã lộ).

## Việc phải xong (DONE)
1. `grep -c "jenny123\|giaovien123" games/lop-hoc-ao/index.html games/lop-hoc-ao/*/index.html` = 0 (trừ thư mục `demo/`).
2. Bản thật đăng nhập `lebaona` → báo lỗi máy chủ, không vào offline; bản demo vẫn vào.
3. Đăng xuất xong `localStorage` không còn khoá `jennyHSc_*`, `jennyVirtualDemo_*`.
4. `check_fit.py` chạy với biến môi trường; không có `JENNY123` trong kho (`git grep -i jenny123 -- ':!docs'` = 0).

## Bẫy
- Bản demo vẫn cần `lebaona` để thầy duyệt giao diện (LUAT §6g): giữ ở demo.
- `README.md` bảng tài khoản `Jenny01…` sửa thành "chỉ bản thử".
