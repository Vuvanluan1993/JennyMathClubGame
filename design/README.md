# Thiết kế chung — token và design system Jenny

**Design system Jenny** (Claude Design, kiểu Design System): https://claude.ai/artifact/Gbvx8hrvMnFzggSUCZ8XQS
— 5 trang token (Màu · Chữ · Khoảng cách & cỡ chạm · Bo góc · Khung pixel & bóng), 12 thành phần có trạng thái và cỡ chạm,
6 mẫu trang (Bản đồ, Màn chơi, Phòng học, Lớp của tôi, Quản lý 4 nút, Đăng nhập) ghép từ thành phần, mỗi mẫu ghi khác biệt
so với ảnh app ngày 25/10/2026. Trang riêng tư, thầy chia sẻ từ nút Share khi cần.

## Quy tắc: màn hình mới dùng thành phần
1. **Màn hình mới vẽ từ design system Jenny**: ghép từ 12 thành phần (Nút, Ô phương án, Khung pixel, Thẻ lớp, Bảng nhập, Toast,
   Hộp thoại, Thanh điều hướng, Huy hiệu mức, Thẻ chào, Nhãn cảnh báo, Ô Quản lý); không vẽ nút/thẻ/nhãn mới.
2. **Màu, chữ, khoảng cách lấy từ token** `design/tokens.json` (`--jc-*` trong `design/tokens.css`), không ghi mã màu cứng.
3. Hai theme **Pixel** (học sinh, game: VT323 + Be Vietnam Pro, góc vuông, khung navy, bóng cứng) và **Classroom**
   (GV/PH/QL: Lexend, bo 8px, viền xám mảnh) dùng **cùng bảng màu**; chỉ khác họ chữ và bo góc.
4. Tính năng hình ảnh mới: vẽ mẫu trong design system (mẫu trang) → thầy duyệt ảnh mẫu → mới làm thật (LUAT §1).
5. Cần giá trị mới: thêm vào `design/tokens.json` trước, chạy `python3 tools/tokens.py` (sinh `tokens.css`) và
   `python3 design/design-system/xuat-token.py` (sinh `design/design-system/project/tokens.json`), rồi đăng lại design system.

## File
| File | Là gì |
|---|---|
| `tokens.json` | Nguồn token duy nhất trong mã (P-03): 25 màu logo = PXC, bộ app/px/home/lms, 6 họ chữ, space, size.tap, radius, frame. |
| `tokens.css` | Sinh từ `tokens.json` bằng `tools/tokens.py` (`--check` so lại). Không sửa tay. |
| `design-system/xuat-token.py` | Sinh `design-system/project/tokens.json` cho design system; `--check` so hai chiều (phải in "Khác 0 giá trị"). |
| `design-system/project/` | Bản sao file của design system (README thương hiệu, tokens.json, `components/bundle.css`, 12 thành phần, 6 mẫu trang, bìa). Đăng lên bằng công cụ Artifact (phiên Claude Code). |

## Cách thêm thành phần
Thêm `design-system/project/components/<Tên>/preview.html` (dòng 1 `<!-- @dsCard group="Thành phần" height=… -->`, bao ngoài
`class="jc jc-pixel"` hoặc `jc jc-lms`, chỉ dùng `var(--token)`) và `README.md` (câu đầu = tóm tắt; trạng thái; cỡ chạm; ví dụ
tiếng Việt thật; nên/không nên). Kiểu chung viết vào `components/bundle.css`. Đăng lại design system rồi ghi CHANGELOG.

## Chờ thầy duyệt (ghi ở README của design system, mục "Đề xuất")
- 4 cặp tương phản dưới 4,5:1 (từ P-03): app.leaf/leaf-soft 3,90 · px.leaf/leaf-soft 3,23 · home.paper/mint 2,37 · lms.warn/warn-soft 4,34.
- Token mới: bóng cứng `0 4px 0 0 px-frame`, viền 3px, bo nút Classroom 4px, bo nhãn 16px, 2 màu dải thẻ `#0E8FB8` `#B07800`, màu nhãn Club `#28B568`, nền đăng nhập `#3FC1EC`.
- Nút Classroom 36px → 44px; toast học sinh bo 14px → 0; nút biểu tượng 40px → 48px.
