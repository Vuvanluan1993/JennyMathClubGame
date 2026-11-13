# P-09 Riêng tư theo Luật Bảo vệ dữ liệu cá nhân 2025

Hai phần: **P-09a văn bản** (độc lập, làm ngay) và **P-09b mã** (sau P-06 hoặc P-12 vì sửa cùng file quản lý).
**Ước lượng:** 09a 3 giờ · 09b 5 giờ. **Người dùng thấy gì:** trang Chính sách riêng tư; phiếu đồng ý; nút Xuất dữ liệu; bớt ô Ngày sinh. **Cần trước:** 09b cần Q2 của thầy.

## P-09a — văn bản và trang tĩnh
- Mới: `rieng-tu/index.html` (trang chính sách ngắn, tiếng Việt, cho phụ huynh: thu gì, để làm gì, lưu ở đâu (Singapore), bao lâu, quyền xem/xuất/xoá, liên hệ), `docs/rieng-tu/PHIEU-DONG-Y.md` (mẫu in A4 cho phụ huynh ký), `docs/rieng-tu/HO-SO-CHUYEN-DU-LIEU.md` (khung hồ sơ chuyển dữ liệu ra nước ngoài theo NĐ 13/2023), `docs/rieng-tu/DANH-MUC-DU-LIEU.md` (bảng: trường · nguồn · mục đích · nơi lưu · thời hạn · ai xem).
- Sửa: `index.html` chân trang thêm liên kết "Riêng tư"; `games/lop-hoc-ao` màn đăng nhập thêm 1 dòng liên kết (`tools/_student.py` phần `overlay`).
- DONE: thầy duyệt 4 văn bản; liên kết hiện ở trang chủ và màn đăng nhập.

## P-09b — mã (dữ liệu tối thiểu, xuất dữ liệu, thời hạn)
⟳ 25/10 (Q2 = B): **giữ** ngày sinh đầy đủ và Gmail phụ huynh; hai gạch đầu dòng "`hoso{ng,th,nam}` → chỉ `nam`" và "cột Ngày sinh → Năm sinh" **không làm**. Còn: nút Xuất dữ liệu (`78`), nhắc thời hạn lưu (`76`), LUAT §6i ghi Q2. File sửa chỉ `76`, `78`, CHANGELOG, LUAT. Ước lượng còn 3 giờ.
- `src/lop-hoc-ao/js/core/70-sua-hoc-sinh.js:58` `hoso{ng,th,nam}` → chỉ `nam` (năm sinh) nếu Q2 = có; `75-nhap-excel.js` cột "Ngày sinh" → "Năm sinh" (nhận cả ngày đầy đủ, chỉ giữ năm); `73-quan-ly-4-nut.js` hiện năm.
- `78-xoa-hoc-sinh.js`: thêm nút **⬇ Xuất dữ liệu của em** (JSON: hồ sơ + tiến độ + sổ lỗi + nhận xét), ghi nhật ký.
- `76-len-lop.js`: em "Nghỉ học"/"Học xong" quá 24 tháng → QL thấy nhắc "xoá theo thời hạn" (xoá vẫn do người bấm, có XOA).
- `docs/LUAT-DA-CHOT.md §6i`: ghi quyết định Q2.
- DONE: Excel mẫu mới nhập được; file Excel cũ (có ngày sinh) vẫn nhập, chỉ giữ năm; nút xuất trả JSON mở được; 7 kiểm tra §7 ĐẠT.

## Bẫy
- Ghép anh chị em theo SĐT/Gmail (LUAT §6j) vẫn cần SĐT: giữ SĐT, bỏ Gmail chỉ khi thầy đồng ý (hỏi cùng Q2).
- Không xoá tự động; luật "không xoá hẳn" §6h: xuất rồi mới xoá.
