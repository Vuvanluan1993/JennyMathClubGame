// Kiểm tra giao diện tự động (TIEU_CHI.md §3, §4, §5; WCAG 2.2): 4 trang Lớp học ảo, trang chủ, 1 game mỗi họ,
// ở 4 khổ 320 / 375 / 414 / 900 px. Cần đã build: python3 src/lop-hoc-ao/tools/build.py (sinh games/lop-hoc-ao/**/index.html).
//   node tools/test/giao-dien.spec.mjs            → tất cả
//   node tools/test/giao-dien.spec.mjs mam-non    → chỉ trang có tên/đường dẫn chứa chuỗi này
// Mỗi trang × khổ, trong chế độ prefers-reduced-motion: reduce:
//   1. axe-core: không có vi phạm mức serious / critical;
//   2. ô chạm: mọi nút bấm được (button, a, input, [role=button]…; trừ liên kết chữ inline) có cạnh nhỏ nhất ≥ 44 px
//      (WCAG 2.5.8), ≥ 48 px ở trang mầm non (TIEU_CHI §4);
//   3. không tràn ngang: trang không cuộn ngang, không phần tử lòi ra mép phải;
//   4. giảm chuyển động: không phần tử nào còn animation đang chạy;
//   5. không lỗi JS.
// Phát hiện đã ghi (chờ việc khác sửa) nằm ở DA_BIET: in "ĐÃ BIẾT", không làm đỏ. Phát hiện mới → rc 1.
// Báo cáo HTML: $BAO_CAO_DIR/giao-dien.html (mặc định .ci/bao-cao/).
// Biến môi trường: PW_DIR (thư mục trình duyệt Playwright), CHROME (đường dẫn chrome cụ thể).
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

if (process.env.PW_DIR && !process.env.PLAYWRIGHT_BROWSERS_PATH) process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PW_DIR;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BAO_CAO_DIR = process.env.BAO_CAO_DIR || path.join(ROOT, '.ci', 'bao-cao');
const AXE = createRequire(import.meta.url).resolve('axe-core/axe.min.js');
const CHON = process.argv.slice(2);
const KHO = [[320, 568], [375, 667], [414, 896], [900, 700]];

/* Trang và bước đưa về trạng thái cần đo. min = cạnh ô chạm nhỏ nhất (px). */
const TRANG = [
  { ten: 'Lớp học ảo · học sinh (đăng nhập)', url: 'games/lop-hoc-ao/' },
  { ten: 'Lớp học ảo · giáo viên', url: 'games/lop-hoc-ao/giao-vien/' },
  { ten: 'Lớp học ảo · phụ huynh', url: 'games/lop-hoc-ao/phu-huynh/' },
  { ten: 'Lớp học ảo · quản lý', url: 'games/lop-hoc-ao/quan-ly/' },
  { ten: 'Trang chủ', url: '' },
  { ten: 'Ô Số Bí Ẩn 6 · đang chơi', url: 'games/o-so-bi-an/lop-6/', buoc: p => p.click('#startBtn') },
  { ten: 'Mật Mã Bí Ẩn · đang chơi', url: 'games/mat-ma-bi-an/moi-lop/', buoc: p => p.click('.mode.mid') },
  { ten: 'Mảnh Ghép Bí Mật · màn chính', url: 'games/manh-ghep-bi-mat/lop-6/' },
  { ten: 'Robot tìm đường · màn mở đầu', url: 'games/tu-duy-bebras/robot-tim-duong/' },
  { ten: 'Robot tìm đường · đang chơi', url: 'games/tu-duy-bebras/robot-tim-duong/', buoc: p => p.click('.lvbtn[data-lv="0"]') },
  { ten: 'Mầm non · bản đồ', url: 'games/hanh-trinh-jenny/mam-non/', min: 48 },
  { ten: 'Mầm non · bài đếm', url: 'games/hanh-trinh-jenny/mam-non/', min: 48, buoc: p => p.evaluate(() => window.__mn.test('count', 6)) },
].filter(t => !CHON.length || CHON.some(c => (t.ten + ' ' + t.url).includes(c)));

/* Phát hiện đã biết: { trang: họ trang (phần trước ' · ' của tên; bỏ trống = mọi trang), loai: 'nut'|'axe'|'tran'|'dong'|'js', mau: đầu mô tả (selector hoặc mã luật axe), viec: ai sửa } */
/* Phát hiện đã biết 25/10/2026 (418 dòng ở 12 trang × 4 khổ, gom thành 75 nhóm). Khớp: cùng họ trang, cùng loại, mô tả bắt đầu bằng `mau`. */
const DA_BIET = [
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'button.pweye', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: button.pweye 40×36 ×1 "Hiện mật khẩu"
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'input#lgR', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: input#lgR 244×42 ×1
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'summary', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: summary 252×21 ×1 "Xem bản demo (dữ liệu mẫu)"
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'div.brand', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: div.brand 32×32 ×1 "Về trang chủ"
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'button#sndBtn.btn.sm', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: button#sndBtn.btn.sm 40×25 ×1 "Nhạc và hiệu ứng đang bật"
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'button.on', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: button.on 40×32 ×1 "VI"
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'button', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: button 40×32 ×1 "EN"
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'button#unlBtn.btn.sm', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: button#unlBtn.btn.sm 81×34 ×1 "🔒 Khóa lại"
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'button.btn.sm', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: button.btn.sm 117×34 ×1 "Sang ngày mới →"
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'button#resetBtn.btn.sm', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: button#resetBtn.btn.sm 94×34 ×1 "Làm lại demo"
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'button.chip.ghchip', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: button.chip.ghchip 113×28 ×1 "10000 xu, mở Cửa hàng"
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'button.tre', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: button.tre 69×33 ×2 "Cá voi vàng: chạm để mở"
  { trang: 'Lớp học ảo', loai: 'axe', mau: 'color-contrast', viec: 'P-03/FE1: 4 cặp màu dưới 4.5 chờ thầy chốt' },   // 320,375,414,900px: color-contrast [serious] Elements must meet minimum color contrast rat
  { trang: 'Lớp học ảo', loai: 'axe', mau: 'label-content-name-mismatch', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: label-content-name-mismatch [serious] Elements must have their visible
  { trang: 'Lớp học ảo', loai: 'tran', mau: 'div.chips.herochips', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414px: div.chips.herochips lòi phải 133px
  { trang: 'Lớp học ảo', loai: 'tran', mau: 'span.chip', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414px: span.chip lòi phải 133px
  { trang: 'Lớp học ảo', loai: 'tran', mau: 'img.px.pxe', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375px: img.px.pxe lòi phải 74px
  { trang: 'Lớp học ảo', loai: 'tran', mau: 'b', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414px: b lòi phải 92px
  { trang: 'Lớp học ảo', loai: 'tran', mau: 'button.chip.ghchip', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414px: button.chip.ghchip lòi phải 133px
  { trang: 'Lớp học ảo', loai: 'tran', mau: 'i.hcarr', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 375,414px: i.hcarr lòi phải 68px
  { trang: 'Lớp học ảo', loai: 'nut', mau: 'select#who', viec: 'Lớp học ảo: task riêng (TASKS.md)' },   // 320,375,414,900px: select#who 239×32 ×1 "Chọn học sinh"
  { trang: 'Trang chủ', loai: 'nut', mau: 'button.chip', viec: 'P-19' },   // 320,375,414,900px: button.chip 82×40 ×3 "Tất cả"
  { trang: 'Trang chủ', loai: 'axe', mau: 'color-contrast', viec: 'P-03/FE1: 4 cặp màu dưới 4.5 chờ thầy chốt' },   // 320,375,414,900px: color-contrast [serious] Elements must meet minimum color contrast rat
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button.bulb', viec: 'P-19' },   // 320,375,414,900px: button.bulb 34×34 ×2 "Dùng bóng đèn trợ giúp"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'a.icon-btn.home-btn', viec: 'P-19' },   // 320,375,414px: a.icon-btn.home-btn 38×38 ×1 "Về trang chủ"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button#sndBtn.icon-btn', viec: 'P-19' },   // 320,375,414,900px: button#sndBtn.icon-btn 34×34 ×1 "Bật/tắt âm thanh"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button#pauseBtn.icon-btn', viec: 'P-19' },   // 320,375,414,900px: button#pauseBtn.icon-btn 34×34 ×1 "Tạm dừng"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button.cell.inword', viec: 'P-19' },   // 320,375px: button.cell.inword 24×24 ×4 "Ô hàng 1 cột 2"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button.cell', viec: 'P-19' },   // 320,375px: button.cell 23×23 ×25 "Ô hàng 2 cột 1"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button#prevBtn', viec: 'P-19' },   // 320,375,414,900px: button#prevBtn 34×34 ×1 "Câu trước"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button#nextBtn', viec: 'P-19' },   // 320,375,414,900px: button#nextBtn 34×34 ×1 "Câu sau"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button.key', viec: 'P-19' },   // 320px: button.key 39×44 ×9 "1"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button.key.fn', viec: 'P-19' },   // 320px: button.key.fn 40×44 ×1 "Xóa"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'axe', mau: 'aria-required-children', viec: 'P-19' },   // 320,375,414,900px: aria-required-children [critical] Certain ARIA roles must contain part
  { trang: 'Ô Số Bí Ẩn 6', loai: 'axe', mau: 'html-has-lang', viec: 'P-19' },   // 320,375,414,900px: html-has-lang [serious] <html> element must have a lang attribute ×1 (
  { trang: 'Ô Số Bí Ẩn 6', loai: 'axe', mau: 'label-content-name-mismatch', viec: 'P-19' },   // 320,375,414,900px: label-content-name-mismatch [serious] Elements must have their visible
  { trang: 'Ô Số Bí Ẩn 6', loai: 'tran', mau: 'button#pauseBtn.icon-btn', viec: 'P-19' },
  // CI Linux không có phông Baloo/Trebuchet → chữ rộng hơn, thanh trên Ô Số / Mật Mã tràn thêm (cùng lỗi header, P-19); máy Mac không thấy
  { trang: 'Ô Số Bí Ẩn 6', loai: 'tran', mau: 'button#sndBtn.icon-btn', viec: 'P-19' },   // CI 320,375px: lòi phải 3–4px
  { trang: 'Mật Mã Bí Ẩn', loai: 'tran', mau: 'trang', viec: 'P-19' },                     // CI 900px: trang cuộn ngang 25px
  { trang: 'Mật Mã Bí Ẩn', loai: 'tran', mau: 'button#pauseBtn.icon-btn', viec: 'P-19' },  // CI 900px: lòi phải 25px
  { trang: 'Mật Mã Bí Ẩn', loai: 'tran', mau: 'svg', viec: 'P-19' },                       // CI 900px
  { trang: 'Mật Mã Bí Ẩn', loai: 'tran', mau: 'rect', viec: 'P-19' },                      // CI 900px   // 320,375px: button#pauseBtn.icon-btn lòi phải 31px
  { trang: 'Mật Mã Bí Ẩn', loai: 'tran', mau: 'canvas#fx', viec: 'P-19' },                 // CI 320,375px: lòi phải 9px, 414px: 5px — canvas hiệu ứng cố định theo innerWidth khi trang cuộn ngang (cùng lỗi header); máy Mac không thấy (FB6, 26/10)
  { trang: 'Ô Số Bí Ẩn 6', loai: 'tran', mau: 'svg', viec: 'P-19' },   // 320,375px: svg lòi phải 23px
  { trang: 'Ô Số Bí Ẩn 6', loai: 'tran', mau: 'rect', viec: 'P-19' },   // 320,375px: rect lòi phải 12px
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button#musBtn.icon-btn', viec: 'P-19' },   // 900px: button#musBtn.icon-btn 42×42 ×1 "Bật/tắt nhạc nền"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button.chip.on', viec: 'P-19' },   // 900px: button.chip.on 35×28 ×1 "Câu 1 Ngang"
  { trang: 'Ô Số Bí Ẩn 6', loai: 'nut', mau: 'button.chip', viec: 'P-19' },   // 900px: button.chip 42×28 ×17 "Câu 4 Ngang"
  { trang: 'Mật Mã Bí Ẩn', loai: 'nut', mau: 'button.bulb', viec: 'P-19' },   // 320,375,414,900px: button.bulb 34×34 ×2 "Dùng bóng đèn gợi ý"
  { trang: 'Mật Mã Bí Ẩn', loai: 'nut', mau: 'a.icon-btn.home-btn', viec: 'P-19' },   // 320,375,414px: a.icon-btn.home-btn 38×38 ×1 "Về trang chủ"
  { trang: 'Mật Mã Bí Ẩn', loai: 'nut', mau: 'button#sndBtn.icon-btn', viec: 'P-19' },   // 320,375,414,900px: button#sndBtn.icon-btn 34×34 ×1 "Bật/tắt âm thanh"
  { trang: 'Mật Mã Bí Ẩn', loai: 'nut', mau: 'button#pauseBtn.icon-btn', viec: 'P-19' },   // 320,375,414,900px: button#pauseBtn.icon-btn 34×34 ×1 "Tạm dừng"
  { trang: 'Mật Mã Bí Ẩn', loai: 'nut', mau: 'button.slot.cur', viec: 'P-19' },   // 320px: button.slot.cur 36×45 ×1 "Ô thứ 1: trống"
  { trang: 'Mật Mã Bí Ẩn', loai: 'nut', mau: 'button.slot', viec: 'P-19' },   // 320px: button.slot 36×45 ×3 "Ô thứ 2: trống"
  { trang: 'Mật Mã Bí Ẩn', loai: 'nut', mau: 'button.nd', viec: 'P-19' },   // 320,375,414,900px: button.nd 22×26 ×10 "Ghi chú chữ số 0"
  { trang: 'Mật Mã Bí Ẩn', loai: 'nut', mau: 'button.key', viec: 'P-19' },   // 320px: button.key 42×44 ×10 "1"
  { trang: 'Mật Mã Bí Ẩn', loai: 'nut', mau: 'button#musBtn.icon-btn', viec: 'P-19' },   // 900px: button#musBtn.icon-btn 42×42 ×1 "Bật/tắt nhạc nền"
  { trang: 'Mảnh Ghép Bí Mật', loai: 'nut', mau: 'a.brand', viec: 'P-19' },   // 320,375,414,900px: a.brand 138×30 ×1 "Về trang chủ"
  { trang: 'Mảnh Ghép Bí Mật', loai: 'nut', mau: 'a#home-btn.tool', viec: 'P-19' },   // 320,375,414,900px: a#home-btn.tool 34×29 ×1 "Về trang chủ"
  { trang: 'Mảnh Ghép Bí Mật', loai: 'nut', mau: 'button#sound-btn.tool', viec: 'P-19' },   // 320,375,414,900px: button#sound-btn.tool 34×29 ×1 "Tắt âm thanh"
  { trang: 'Mảnh Ghép Bí Mật', loai: 'nut', mau: 'button#fullscreen-btn.tool', viec: 'P-19' },   // 320,375,414,900px: button#fullscreen-btn.tool 34×29 ×1 "Toàn màn hình"
  { trang: 'Mảnh Ghép Bí Mật', loai: 'nut', mau: 'button#restart-btn.tool', viec: 'P-19' },   // 320,375,414,900px: button#restart-btn.tool 34×29 ×1 "Chơi lại"
  { trang: 'Mảnh Ghép Bí Mật', loai: 'nut', mau: 'button#choose-btn.primary', viec: 'P-19' },   // 320,375,414,900px: button#choose-btn.primary 147×40 ×1 "Chọn mảnh ghép"
  { trang: 'Mảnh Ghép Bí Mật', loai: 'nut', mau: 'button#guess-btn.secondary.guess-trigger', viec: 'P-19' },   // 320,375,414,900px: button#guess-btn.secondary.guess-trigger 147×40 ×1 "Đoán ô chữ"
  { trang: 'Mảnh Ghép Bí Mật', loai: 'tran', mau: 'div.tools', viec: 'P-19' },   // 320px: div.tools lòi phải 2px — thấy khi tích hợp #6 + #7 (chữ tự host), 25/10/2026
  { trang: 'Mảnh Ghép Bí Mật', loai: 'tran', mau: 'button#restart-btn.tool', viec: 'P-19' },   // 320px: button#restart-btn.tool lòi phải 2px — như trên
  { trang: 'Robot tìm đường', loai: 'nut', mau: 'button.ib.bulb', viec: 'P-19' },   // 320,375,414,900px: button.ib.bulb 34×34 ×1 "Gợi ý của Jenny (còn 3 lần)"
  { trang: 'Robot tìm đường', loai: 'nut', mau: 'a.ib', viec: 'P-19' },   // 320,375,414,900px: a.ib 34×34 ×1 "Về trang chủ"
  { trang: 'Robot tìm đường', loai: 'nut', mau: 'button#kSnd.ib', viec: 'P-19' },   // 320,375,414,900px: button#kSnd.ib 34×34 ×1 "Bật/tắt âm thanh"
  { trang: 'Robot tìm đường', loai: 'nut', mau: 'button#kPause.ib', viec: 'P-19' },   // 320,375,414,900px: button#kPause.ib 34×34 ×1 "Tạm dừng"
  { trang: 'Robot tìm đường', loai: 'nut', mau: 'button.key', viec: 'P-19' },   // 320px: button.key 69×40 ×4 "Lên"
  { trang: 'Robot tìm đường', loai: 'nut', mau: 'a.big.alt', viec: 'P-19' },   // 320px: a.big.alt 139×42 ×1 "Trang chủ"
  { trang: 'Robot tìm đường', loai: 'axe', mau: 'label-content-name-mismatch', viec: 'P-19' },   // 320,375,414,900px: label-content-name-mismatch [serious] Elements must have their visible
  { trang: 'Robot tìm đường', loai: 'tran', mau: 'button#kPause.ib', viec: 'P-19' },   // 320px: button#kPause.ib lòi phải 24px
  { trang: 'Robot tìm đường', loai: 'tran', mau: 'svg', viec: 'P-19' },   // 320px: svg lòi phải 16px
  { trang: 'Robot tìm đường', loai: 'tran', mau: 'rect', viec: 'P-19' },   // 320px: rect lòi phải 5px
  { trang: 'Robot tìm đường', loai: 'nut', mau: 'button#kMus.ib.mus', viec: 'P-19' },   // 900px: button#kMus.ib.mus 42×42 ×1 "Bật/tắt nhạc nền"
  { trang: 'Mầm non', loai: 'nut', mau: 'button#bSet.ib', viec: 'P-19' },   // 320,375,414,900px: button#bSet.ib 36×36 ×1 "Tiến độ và sao lưu"
  { trang: 'Mầm non', loai: 'nut', mau: 'a.ib', viec: 'P-19' },   // 320,375,414,900px: a.ib 36×36 ×1 "Về trang chủ"
  { trang: 'Mầm non', loai: 'nut', mau: 'button#isPrev.ib', viec: 'P-19' },   // 320,375,414,900px: button#isPrev.ib 36×36 ×1 "Đảo trước"
  { trang: 'Mầm non', loai: 'nut', mau: 'button#isNext.ib', viec: 'P-19' },   // 320,375,414,900px: button#isNext.ib 36×36 ×1 "Đảo sau"
  { trang: 'Mầm non', loai: 'nut', mau: 'button#bSnd.ib.hide-s', viec: 'P-19' },   // 900px: button#bSnd.ib.hide-s 42×42 ×1 "Bật/tắt âm thanh"
  { trang: 'Mầm non', loai: 'nut', mau: 'button#pBack.ib', viec: 'P-19' },   // 320,375,414,900px: button#pBack.ib 36×36 ×1 "Về bản đồ"
];

/* ---------- máy chủ tĩnh nhỏ ---------- */
const MIME = { html: 'text/html; charset=utf-8', js: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg',
  svg: 'image/svg+xml', mp3: 'audio/mpeg', woff2: 'font/woff2', woff: 'font/woff', ico: 'image/x-icon', webp: 'image/webp', enc: 'application/octet-stream' };
function phucVu(root) {
  return new Promise(res => {
    const s = http.createServer((req, r) => {
      let u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (u.endsWith('/')) u += 'index.html';
      const f = path.join(root, u);
      if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
      r.writeHead(200, { 'content-type': MIME[path.extname(f).slice(1)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(r);
    });
    s.listen(0, '127.0.0.1', () => res({ server: s, base: `http://127.0.0.1:${s.address().port}/` }));
  });
}

/* ---------- đo trong trang ---------- */
const doTrang = (MIN) => {
  const W = innerWidth, H = innerHeight;
  const thay = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0' && !el.closest('[hidden]') && r.bottom > 0 && r.top < H; };
  const ten = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const nhan = el => (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28);
  // 1. ô chạm
  const nut = [...document.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,summary,[role=button],[role=tab],[role=link],[tabindex]:not([tabindex="-1"])')]
    .filter(el => thay(el) && getComputedStyle(el).pointerEvents !== 'none' && !(el.tagName === 'A' && getComputedStyle(el).display === 'inline'));
  // ô chạm của hộp kiểm / nút chọn = cả nhãn đi kèm (bấm nhãn cũng chọn được)
  const khung = el => { let r = el.getBoundingClientRect();
    if (el.tagName === 'INPUT' && /^(checkbox|radio)$/.test(el.type)) { const lb = el.closest('label') || (el.id && document.querySelector(`label[for="${el.id}"]`)); if (lb) { const q = lb.getBoundingClientRect(); r = { width: Math.max(r.width, q.width), height: Math.max(r.height, q.height) }; } }
    return r; };
  const nho = [];
  for (const el of nut) { const r = khung(el), c = Math.min(r.width, r.height); if (c < MIN - .5) nho.push({ ten: ten(el), nhan: nhan(el), w: Math.round(r.width), h: Math.round(r.height) }); }
  // 2. tràn ngang
  const tran = [];
  if (document.documentElement.scrollWidth > W + 1) tran.push('trang cuộn ngang ' + (document.documentElement.scrollWidth - W) + 'px');
  // phần tử nằm trong khung tự cuộn ngang (overflow-x: auto/scroll) là cố ý, không tính; bị cắt (hidden) hoặc lòi ra trang thì tính
  const trongKhungCuon = el => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll') return true; } return false; };
  for (const el of document.querySelectorAll('body *')) { if (tran.length > 6) break; if (!thay(el) || trongKhungCuon(el)) continue; const r = el.getBoundingClientRect(); if (r.width > 2 && r.right > W + 1) tran.push(ten(el) + ' lòi phải ' + Math.round(r.right - W) + 'px'); }
  // 3. còn animation chạy dù prefers-reduced-motion
  const dong = [];
  for (const el of document.querySelectorAll('body *')) { if (dong.length > 6) break; const cs = getComputedStyle(el);
    if (cs.animationName !== 'none' && cs.animationPlayState !== 'paused' && !cs.animationDuration.split(',').every(d => parseFloat(d) === 0) && thay(el)) dong.push(ten(el) + ' @' + cs.animationName.split(',')[0]); }
  return { soNut: nut.length, nho, tran, dong, giamDong: matchMedia('(prefers-reduced-motion: reduce)').matches };
};

function khopDaBiet(trangTen, loai, mau) {
  const ho = trangTen.split(' · ')[0];
  return DA_BIET.find(d => (!d.trang || ho === d.trang) && d.loai === loai && (!d.mau || mau === d.mau || mau.startsWith(d.mau + ' ')));
}

async function doMot(browser, base, t, [w, h]) {
  // bypassCSP (P-14c, 27/10/2026): Lớp học ảo không còn 'unsafe-inline' nên addScriptTag (tiêm axe-core) bị CSP chặn; CSP được khong-goi-ngoai.mjs kiểm riêng
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', hasTouch: w < 600, isMobile: w < 600, bypassCSP: true });
  const page = await ctx.newPage();
  const loiJS = []; page.on('pageerror', e => loiJS.push(e.message));
  await page.route(/^(?!http:\/\/127\.0\.0\.1)/, r => r.abort());   // không gọi ra ngoài
  const kq = { trang: t.ten, kho: w, soNut: 0, nho: [], axe: [], tran: [], dong: [], loiJS, khac: [] };
  try {
    await page.goto(base + t.url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(400);
    if (t.buoc) { await t.buoc(page); await page.waitForTimeout(500); }
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const d = await page.evaluate(doTrang, t.min || 44);
    if (!d.giamDong) kq.khac.push('trình duyệt không nhận prefers-reduced-motion');
    Object.assign(kq, { soNut: d.soNut, nho: d.nho, tran: d.tran, dong: d.dong });
    await page.addScriptTag({ path: AXE });
    const v = await page.evaluate(() => window.axe.run(document, { resultTypes: ['violations'], rules: { 'color-contrast': { enabled: true } } }).then(r => r.violations.map(x => ({ id: x.id, impact: x.impact, help: x.help, n: x.nodes.length, mau: (x.nodes[0] && x.nodes[0].target || []).join(' ').slice(0, 80) }))));
    kq.axe = v.filter(x => x.impact === 'serious' || x.impact === 'critical');
  } catch (err) { kq.khac.push('không đo được: ' + err.message.split('\n')[0]); }
  await ctx.close();
  // phân loại mới / đã biết
  kq.phatHien = [];
  const them = (loai, mau, chuThich) => { const db = khopDaBiet(t.ten, loai, mau); kq.phatHien.push({ loai, mau: chuThich || mau, daBiet: db ? db.viec : null }); };
  const nhom = {}; for (const n of kq.nho) { const k = n.ten; if (!nhom[k]) nhom[k] = { ...n, dem: 0 }; nhom[k].dem++; }
  for (const n of Object.values(nhom)) them('nut', n.ten, `${n.ten} ${n.w}×${n.h} ×${n.dem}${n.nhan ? ' "' + n.nhan + '"' : ''} (cần ≥ ${t.min || 44})`);
  for (const a of kq.axe) them('axe', a.id, `${a.id} [${a.impact}] ${a.help} ×${a.n} (${a.mau})`);
  for (const x of kq.tran) them('tran', x);
  for (const x of kq.dong) them('dong', x);
  for (const x of kq.loiJS) them('js', x);
  for (const x of kq.khac) them('khac', x);
  return kq;
}

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

(async () => {
  for (const t of TRANG) if (t.url.startsWith('games/lop-hoc-ao/') && !fs.existsSync(path.join(ROOT, t.url, 'index.html'))) {
    console.error('Chưa có ' + t.url + 'index.html — chạy python3 src/lop-hoc-ao/tools/build.py trước.'); process.exit(2);
  }
  const { server, base } = await phucVu(ROOT);
  const EXE = process.env.CHROME;
  const browser = await chromium.launch({ executablePath: EXE && fs.existsSync(EXE) ? EXE : undefined });
  const t0 = Date.now();
  const kqs = [];
  // 4 khổ của một trang chạy song song; các trang lần lượt (giữ tải vừa phải)
  for (const t of TRANG) {
    const r = await Promise.all(KHO.map(k => doMot(browser, base, t, k)));
    kqs.push(...r);
    const moi = r.flatMap(x => x.phatHien.filter(p => !p.daBiet)), biet = r.flatMap(x => x.phatHien.filter(p => p.daBiet));
    console.log(`${moi.length ? '✗' : '✓'} ${t.ten}  (${r.map(x => x.kho + ':' + x.soNut + ' nút').join(', ')}) · ${moi.length} mới · ${biet.length} đã biết`);
    for (const x of r) for (const p of x.phatHien) console.log(`     ${p.daBiet ? 'ĐÃ BIẾT (' + p.daBiet + ')' : 'MỚI'} ${x.kho}px [${p.loai}] ${p.mau}`);
  }
  await browser.close(); server.close();
  const moi = kqs.flatMap(x => x.phatHien.filter(p => !p.daBiet)), biet = kqs.flatMap(x => x.phatHien.filter(p => p.daBiet));
  const rc = moi.length ? 1 : 0;

  fs.mkdirSync(BAO_CAO_DIR, { recursive: true });
  const rows = kqs.map(x => `<tr class="${x.phatHien.some(p => !p.daBiet) ? 'bad' : x.phatHien.length ? 'warn' : 'ok'}"><td>${esc(x.trang)}</td><td>${x.kho}</td><td>${x.soNut}</td>
<td>${x.axe.length}</td><td>${x.phatHien.map(p => `<div class="${p.daBiet ? 'biet' : 'moi'}">[${p.loai}] ${esc(p.mau)}${p.daBiet ? ' <i>— đã biết, ' + esc(p.daBiet) + '</i>' : ''}</div>`).join('') || '—'}</td></tr>`);
  fs.writeFileSync(path.join(BAO_CAO_DIR, 'giao-dien.html'), `<!doctype html><html lang="vi"><meta charset="utf-8"><title>Kiểm tra giao diện</title>
<style>body{font-family:system-ui,sans-serif;margin:20px;max-width:1200px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left;vertical-align:top;font-size:13px}
tr.bad{background:#ffe9e9}tr.warn{background:#fff6d6}.moi{color:#b3261e;font-weight:700}.biet{color:#6b5a00}</style>
<h1>Kiểm tra giao diện — ${rc ? 'CHƯA ĐẠT' : 'ĐẠT'}</h1>
<p>${new Date().toLocaleString('vi-VN')} · ${TRANG.length} trang × ${KHO.length} khổ · ${moi.length} phát hiện mới · ${biet.length} đã biết · ${((Date.now() - t0) / 1000).toFixed(0)} s.<br>
Luật: axe-core không serious/critical · ô chạm ≥ 44 px (≥ 48 px mầm non) · không tràn ngang · giảm chuyển động tắt animation · không lỗi JS.</p>
<table><tr><th>Trang</th><th>Khổ</th><th>Số nút</th><th>axe</th><th>Phát hiện</th></tr>${rows.join('')}</table></html>`);
  console.log(`\nTổng: ${TRANG.length} trang × ${KHO.length} khổ · ${moi.length} phát hiện mới · ${biet.length} đã biết · ${((Date.now() - t0) / 1000).toFixed(0)} s → ${rc ? 'CHƯA ĐẠT' : 'ĐẠT'}`);
  console.log('Báo cáo: ' + path.relative(ROOT, path.join(BAO_CAO_DIR, 'giao-dien.html')));
  process.exit(rc);
})().catch(e => { console.error(e); process.exit(2); });
