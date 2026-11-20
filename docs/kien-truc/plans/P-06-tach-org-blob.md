# P-06 Tách blob `org/main.j` và chống sửa xu/sao (chỉ khi Q1 = A)

**Mục tiêu:** đóng LH-H1, LH-H4, phần còn lại của LH-C1/C2. Dữ liệu trung tâm thành nhiều document, rules kiểm tra từng trường; ví xu chỉ quản lý ghi.
**Ước lượng:** 16 giờ = 2 phiên (6a cấu trúc + chuyển đổi; 6b ví xu + rules + test). **Người dùng thấy gì:** không. **Cần trước:** P-05 đã push.

## Cấu trúc mới
```
org/main            {ten, nam, v, admins, t}                  QL ghi
lop/{id}            {ten, khoi, gv:[gvId], tj:{on}, mo:{...}} QL ghi; GV lớp đó chỉ sửa `mo`, `tj`
hsdm/{tk}           {ten, khoi, lop, gender, nghi}            QL ghi; GV/PH đọc theo lớp/con  (danh mục, không PII)
hoso/{tk}           {namSinh, dtPH, mailPH}                    QL đọc/ghi; GV lớp đọc; PH chủ đọc
gv/{id}             {ten, tk}                                  QL ghi; mọi người đã có hồ sơ đọc
nk/{autoId}         {d, ai, t, tk?}                            QL/GV tạo, không sửa/xoá
vi/{tk}             {coins, items, pets, tudo}                 QL ghi; HS đọc; HS **xin** qua `vi_yc/{tk}/{id}` (yêu cầu cộng/trừ) → QL/GV duyệt tự động theo luật (xem bẫy)
hs/{tk}             {j: tiến độ đảo, sk, dd, mist…, ev, t}     HS ghi (không còn coins/items)
```

## File sửa
- `js/core/62-may-chu.js` (fbDay/fbHsBoot/fbGvBoot/fbDanhSach đọc-ghi theo collection; `runTransaction` khi QL sửa `lop`), `79-dong-bo.js` (so `t` từng doc), `58-lop-va-quan-ly.js`, `70-sua-hoc-sinh.js`, `75-nhap-excel.js`, `76-len-lop.js`, `77-phu-huynh-tu-dong.js`, `78-xoa-hoc-sinh.js`, `81-sua-gv-ph.js` (đọc `S.org` qua lớp tương thích `orgView()` dựng từ các doc, ghi qua hàm `orgSet(path, value)`).
- `11-sao-va-mo-khoa.js`, `64-xu.js`, `49-gian-hang.js`, `51-kho-game.js`: cộng/trừ xu gọi `viYeuCau(delta, lyDo)` thay vì sửa `st.coins`.
- `firebase/firestore.rules` + `tools/test/rules.test.mjs` (thêm 15 ca).
- Mới: `tools/chuyen-org-v3.mjs` (đọc `org/main.j` cũ → ghi các doc mới; chạy một lần bởi QL trong trang, nút "Nâng cấp dữ liệu v3").

## Việc phải xong (DONE)
1. Trang QL/GV/PH/HS chạy với dữ liệu đã chuyển; 7 kiểm tra §7 ĐẠT; `rules.test.mjs` ĐẠT.
2. GV không đọc/ghi được lớp khác (test); PH không thấy SĐT phụ huynh khác (test).
3. Console học sinh `S.st[sid].coins=1e6;save()` **không** đổi số xu sau tải lại.
4. `org/main` < 50 KB; `nk` là collection; `healAll` giữ tiến độ cũ (test với bản lưu mẫu 8 tháng).

## Bẫy
- **Spark không có Cloud Functions**: xu không chấm được ở máy chủ. Cách tạm: HS ghi yêu cầu `vi_yc`, rule chỉ cho phép `delta` trong trần theo `lyDo` (ví dụ `man:+≤30`, `game:+≤20`, `mua:−`), và trình duyệt QL/GV đang mở sẽ duyệt. Ghi rõ đây là **giảm**, không **chặn** gian lận; chặn hẳn chỉ có ở mô hình B (P-12).
- Giữ `GV_F`/`hsgv` như cũ (đang đúng).
- Chuyển đổi phải chạy được nhiều lần (idempotent); giữ `org/main.j` cũ 30 ngày rồi xoá.
