# P-19 Game lẻ dùng kit và token chung

**Mục tiêu:** bớt mã trùng (o-so-bi-an 6/7, lop-6/tieu-hoc 680 dòng chung, tham-tu sinh từ mam-non), sửa L1/L2/L3/L5 của audit, nút ≥ 48px, manifest cho trang chủ.
**Ước lượng:** 8 giờ. **Người dùng thấy gì:** nút to hơn ở trang chủ và Bebras; o-so-bi-an hiển thị chuẩn hơn. **Cần trước:** P-08 đã push (cùng sửa các HTML game).

## File sửa
- `games/o-so-bi-an/lop-6/index.html`, `lop-7/index.html`: bỏ wrapper `<head>` lạ ở dòng 1–2, thêm `lang="vi"`, tách phần chung ra `games/o-so-bi-an/_chung.js` + `_chung.css`, mỗi lớp chỉ còn dữ liệu câu đố.
- `games/hanh-trinh-jenny/_saga/saga.js` (680 dòng chung từ `lop-6` và `tieu-hoc`), hai `index.html` import.
- `games/hanh-trinh-jenny/tham-tu/index.html`: ra khỏi git, sinh bởi `tools/build_tham_tu.py`.
  ⟳ 25/10: **không** sửa `deploy.yml`; `tools/build_all.py` (P-02) chạy mọi `tools/build_*.py` theo tên, nên chỉ cần thêm script.
- `games/tu-duy-bebras/_kit/kit.css:34` `.ib` 48px; `index.html:49` `.chip` 48px; cả hai dùng `--jc-tap`.
- `lop-6:787`, `tieu-hoc:946`, `mam-non:1437`: khôi phục mã sao lưu qua hàm `khoiPhucAnToan(json)` chỉ chép các khoá cho phép (chặn `__proto__`).
- `tools/giong/tao-giong.py:59`: khoá qua header `x-goog-api-key`.
- Mới: `manifest.webmanifest` gốc + icon; `README.md` cập nhật bảng game (`tham-tu`, `lop-7 hidden`).

## Việc phải xong (DONE)
1. `check_fit.py` xanh cho mọi game; `tools/test/giao-dien.spec.mjs` (P-17) không còn lỗi cỡ nút.
2. `diff` hành vi: chơi hết 1 ván mỗi game bằng tay (hoặc script seed) — kết quả giống trước.
3. Dòng mã game lẻ giảm ≥ 1 200 dòng (`cloc` trước/sau trong PR).

## Bẫy
- Game đang được lớp dùng trên máy chiếu: giữ URL cũ, giữ `saveKey`.
- `tham-tu` ra khỏi git chỉ sau khi `deploy.yml` sinh nó (P-02 xong).
