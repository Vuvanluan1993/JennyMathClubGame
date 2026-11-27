# P-20 Ví xu và sao kiểm soát bằng Firestore rules (thay P-06b, chốt 25/10/2026)

**Mục tiêu:** đóng LH-C2 phần "em tự ghi xu/sao" mà không cần máy chủ: xu, đồ, thú cưng ra khỏi chuỗi `hs.j` thành document có kiểu, rules kiểm từng lần ghi; mọi lần cộng trừ có một dòng trong sổ sự kiện chỉ-thêm; trang cô thấy em bất thường.
**Ước lượng:** 8 giờ = 1 phiên (FB4). **Người dùng thấy gì:** không (cùng màn hình); cô thấy nhãn "Xu tăng lạ". **Cần trước:** P-06a đã push (cùng lane `fix/firebase-tach-org`).

Đây là **giảm mạnh**, không **chặn hẳn**: em vẫn có thể ghi một lần cộng 40 xu mỗi 3 giây bằng console. Chặn hẳn chỉ có khi hàm chạy ở máy chủ (P-22, chờ Q5). Ghi rõ câu này trong CHANGELOG và LUAT §6i.

## Cấu trúc
```
vi/{tk}            {coins:int ≥ 0, items:map, pets:map, tudo:map, t:timestamp}   HS ghi có điều kiện; QL ghi tự do; GV lớp, PH đọc
ev/{tk}/{id}       {k:string, d:int, ref:string, t:timestamp}                    HS/QL tạo; không ai sửa, xoá
cfg/shop           {items:{id:gia}, pets:{id:gia}, tudo:{id:gia}, tranMan:40}    QL ghi; mọi người đã có hồ sơ đọc
```
`k` (loại) chỉ nhận: `man` (qua màn), `tl` (Tự luyện), `bvn` (bài về nhà), `game`, `mua`, `ql` (quản lý sửa tay).

## Rules (`firebase/firestore.rules`)
- `vi/{tk}` create: `isQL()`, hoặc `isSelf(tk)` với `coins == 0` và `items`, `pets`, `tudo` rỗng.
- `vi/{tk}` update bởi `isSelf(tk)`:
  - đúng 5 khoá; `t == request.time`; `request.time > resource.data.t + duration.value(3, 's')`;
  - `delta = request.resource.data.coins - resource.data.coins`;
  - **cộng:** `0 < delta ≤ cfg().tranMan` (40) và `items`, `pets`, `tudo` không đổi;
  - **mua:** đúng một khoá mới trong `items`/`pets`/`tudo`, khoá có trong `cfg/shop`, `delta == -gia` của khoá đó, không bớt khoá cũ;
  - không có nhánh nào khác (không vừa cộng vừa mua).
- `ev/{tk}/{id}` create: `isSelf(tk)` hoặc `isQL()`; `k` trong danh sách; `d is int`; `|d| ≤ 400`; `t == request.time`. update, delete: `false`.
- `cfg/shop`: read `hasMe()`, write `isQL()`.
- Mỗi yêu cầu ghi `vi` cần 1 `get()` (`cfg/shop`) + `me()` + `org()` = 3, dưới trần 10.

## File sửa
- `js/core/64-xu.js`: hàm duy nhất `xuCong(delta, k, ref)` và `xuMua(loai, id)`; ghi `vi/{tk}` **và** `ev/{tk}/{autoId}` trong một `batch`; cộng quá 40 thì chia nhiều lần cách 3 giây (hàng đợi trong bộ nhớ, giữ lại khi mất mạng qua `79` của P-06a).
- `11-sao-va-mo-khoa.js`, `49-gian-hang.js`, `51-kho-game.js`, `18-choi-man.js`, `72-tu-luyen.js` (chỉ dòng cộng xu): gọi hai hàm trên thay sửa `st.coins`, `st.items`.
- `62-may-chu.js`: `fbHsBoot` đọc `vi/{tk}`; `fbTach` bỏ `coins`, `items`, `pets`, `tudo` khỏi `hs.j`; QL "Nâng cấp dữ liệu v3" (của P-06a) tạo `vi/{tk}` từ `j` cũ và viết `cfg/shop` từ bảng giá LUAT §4.
- `58-lop-va-quan-ly.js` (trang cô): cột "Xu hôm nay" từ `ev` (một truy vấn `where t >= đầu ngày`); em có tổng `d` trong ngày > 300 hoặc > 15 dòng `man` trong một giờ → nhãn "Xu tăng lạ" và nút "Xem sổ".
- `firebase/firestore.rules`, `firebase/firestore.indexes.json` (chỉ mục `ev` theo `t`), `tools/test/rules.test.mjs` (+14 ca).

## Việc phải xong (DONE)
1. Console học sinh `S.st[sid].coins = 1e6; save()` → tải lại vẫn số cũ; lần ghi bị rules từ chối có dòng `console.warn`.
2. Hai lần cộng xu cách dưới 3 giây: lần hai bị từ chối và được gửi lại sau (test bằng emulator, dán kết quả).
3. Mua món không có trong `cfg/shop`, hoặc trả sai giá → từ chối (test).
4. Sửa hay xoá một dòng `ev` → từ chối (test). Trang cô hiện nhãn "Xu tăng lạ" với dữ liệu mẫu có 1 em gian.
5. `rules.test.mjs` 36 ca ĐẠT trên CI; `npm test` in 0; 7 kiểm tra §7 ĐẠT.

## Bẫy
- `request.time` là giờ máy chủ: trình duyệt phải ghi `t: serverTimestamp()`; rules so `request.resource.data.t == request.time` đúng với sentinel này.
- Sổ `ev` tăng mãi: mỗi em ≈ 30 dòng/ngày; sau 1 năm ≈ 10 000 dòng/em → P-10 sao lưu rồi QL bấm "Gọn sổ" (gộp dòng cũ hơn 90 ngày thành một dòng `ql`). Không xoá tự động.
- Bảng giá đổi (LUAT §4) thì QL sửa `cfg/shop`, không sửa mã.
- Không chạm `79-dong-bo.js` quá phần hàng đợi P-06a đã có; P-16 sở hữu hàng đợi khi mất mạng.
