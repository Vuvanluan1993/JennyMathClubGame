# P-21 Firestore ngoại tuyến và tiết kiệm đọc (chốt 25/10/2026)

**Mục tiêu:** app mở nhanh từ bộ nhớ đệm, chạy khi mất mạng, và ở lại trong hạn miễn phí Spark (50 000 đọc/ngày) khi có 100 em học mỗi ngày.
**Ước lượng:** 6 giờ = 1 phiên (FB6). **Người dùng thấy gì:** mở lại trang gần như tức thì; mất mạng vẫn học, nối lại tự gửi. **Cần trước:** P-20 đã push (cùng lane). Đi cùng P-16 (PWA cache phần tĩnh; P-21 cache dữ liệu).

## File sửa
- Mới: `js/core/63-firestore-tiet-kiem.js` (include ngay sau `62`):
  - bật bộ nhớ đệm bền `enablePersistence({synchronizeTabs:true})` (compat) ngay sau `fbInit`; lỗi `failed-precondition` (nhiều tab) và `unimplemented` (trình duyệt cũ) chỉ `console.info`;
  - `fbNghe(path, cb)` thay mọi `onSnapshot` trực tiếp: một listener mỗi document, tắt khi đổi vai hoặc đăng xuất; đọc lần đầu bằng `get({source:'cache'})` rồi mới `server`;
  - đếm số đọc/ghi trong phiên (`FB.dem`), in ở console khi đăng xuất, gửi vào `ev` loại `ql`? **không** (tốn ghi) → chỉ localStorage `jennyDem` để thầy xem.
- `62-may-chu.js`: **chỉ một dòng** gọi `fbTietKiem()` sau `fbInit`; mọi `onSnapshot` đổi sang `fbNghe` (đổi tên hàm, không đổi logic).
- Listener theo vai (đích ≤ 4 document mỗi vai):
  - HS: `hs/{tk}`, `vi/{tk}`, `hsgv/{tk}`, `asg` lớp mình (1 truy vấn). Bỏ nghe `org/main` cả blob: chỉ nghe `lop/{id}` của em (P-06a).
  - GV: `lop/{id}` các lớp mình, `asg` theo lớp; `hs/{tk}` của từng em chỉ **get khi mở hồ sơ**, không nghe cả lớp.
  - PH: `hs/{con}`, `hsgv/{con}`, `asg` lớp con.
  - QL: `org/main`, `lop/*` (1 truy vấn), `hsdm` (1 truy vấn); `hoso/{tk}` get khi mở sửa.
- `79-dong-bo.js`: **không sửa** (P-16 sở hữu hàng đợi). Ghi khi mất mạng do Firestore tự xếp hàng khi đã bật persistence.
- `firebase/firestore.indexes.json`: chỉ mục `asg(lop, t)`, `ev(t)`; `firebase.json` trỏ tới file này. Thầy `firebase deploy --only firestore:indexes` hoặc bấm liên kết tạo chỉ mục trong lỗi console.
- `docs/FIREBASE-CONSOLE.md`: thêm mục "Đặt cảnh báo dùng Firestore" (Usage › thông báo 80% hạn ngày) và bảng ước lượng đọc/ngày.

## Việc phải xong (DONE)
1. Mở trang học sinh lần hai (đã đăng nhập) với DevTools "Offline": bản đồ, màn chơi, Tự luyện chạy; làm 1 bài; bật mạng → `vi/{tk}` và `ev` lên máy chủ đúng số.
2. Số đọc một phiên học 20 phút của HS ≤ 60 (đo bằng `FB.dem`, ghi vào CHANGELOG); trang cô mở lớp 12 em ≤ 40 đọc.
3. Không còn `onSnapshot` trực tiếp ngoài `63` (`grep -c onSnapshot js/core/*.js` = số trong 63).
4. Đổi vai GV → HS ở bản đầy đủ không còn listener cũ (`FB.dem.nghe` về 0 rồi tăng lại).
5. `npm test` in 0; 7 kiểm tra §7 ĐẠT; `rules.test.mjs` ĐẠT (không đổi rules).

## Bẫy
- Persistence compat chỉ bật **trước** lần đọc đầu; gọi sau `fbInit` xong là muộn → đặt trong `fbInit` qua hook một dòng.
- Hai tab cùng vai: `synchronizeTabs:true` tránh lỗi; không bật ở bản demo (dữ liệu giả).
- Cache cũ sau khi QL "Nâng cấp dữ liệu v3": `fbNghe` lần đầu luôn lấy server nếu `localStorage.jennyV3 !== '1'`.
- Bật persistence làm `clearPersistence()` cần khi đăng xuất trên máy dùng chung (phòng máy): gọi trong `fbDangXuat` sau `signOut`.
