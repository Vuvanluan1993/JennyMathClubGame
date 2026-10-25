# P-17 Kiểm tra giao diện và đề tự động trên CI

**Mục tiêu:** đóng GL-M5 và yêu cầu `TIEU_CHI.md §1, §3, §4`: đề tự tạo được kiểm hàng nghìn lần; tương phản, cỡ nút, vừa 1 màn hình đo bằng máy mỗi PR.
**Ước lượng:** 6 giờ. **Người dùng thấy gì:** không. **Cần trước:** P-01 đã push (chạy trong `npm test`).

## File sửa (chỉ thêm file mới; không sửa `ci.yml`, `chay-tat-ca.mjs` của P-01)
⟳ 25/10: `npm test` của P-01 tự nhận mọi `tools/test/*.mjs` theo tên, nên hàng này không chạm file của lane CI.
- Mới: `tools/test/de-bebras.mjs` — với mỗi game Bebras, gọi `__kit.make(lv, r, seed)` (`kit.js:311`) 1 000 seed × 3 mức: có lời giải, đúng 1 đáp án, không lỗi; `tools/test/de-mam-non.mjs` dùng `__mn.test` (`mam-non:1458`) 2 000 câu: đáp án nằm trong lựa chọn, lựa chọn không trùng, không số âm.
- Mới: `tools/test/giao-dien.spec.mjs` (Playwright): 4 trang Lớp học ảo + trang chủ + 1 game mỗi họ ở 320/375/414/900: `axe-core` không lỗi mức `serious/critical`; mọi nút bấm được có ô chạm ≥ 44×44 (WCAG 2.5.8) và ≥ 48 ở trang mầm non (`TIEU_CHI §4`); không tràn ngang; `prefers-reduced-motion` tắt animation.
- Mới: `.github/workflows/giao-dien.yml` chạy `check_fit.py` (Python + Playwright) và 3 file trên; báo cáo HTML đính kèm artifact.
- `TIEU_CHI.md` mục "Cách kiểm tra trước khi đưa lên": thêm 1 dòng tên lệnh.

## Việc phải xong (DONE)
1. 3 script chạy xanh trên `main` hiện tại hoặc liệt kê đúng lỗi thật (kèm seed để tái hiện) — lỗi thật mở thành task riêng, không sửa trong P-17.
2. Workflow chạy trên PR, dưới 10 phút.
3. `TIEU_CHI.md` cập nhật.

## Bẫy
- `kit.css:34` nút 42px và `index.html:49` chip 40px sẽ **đỏ** theo chuẩn 48: ghi là phát hiện, sửa ở P-19 (không sửa ở đây để không đụng file của lane FE).
- Seed cố định để tái hiện; không dùng `Math.random` không seed trong test.
