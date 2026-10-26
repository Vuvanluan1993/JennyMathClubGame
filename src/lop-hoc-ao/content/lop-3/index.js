/* ===================== NỘI DUNG LỚP 3 (P-15a, 26/10/2026) ===================== */
/* dangKy(reg): đăng ký đảo, bài giảng, trò chơi nhỏ của lớp 3 vào PRIM/LES/MG/MGT (reg do core/30a-dang-ky-khoi.js đưa vào).
   Lúc dựng: tools/vite/noi-file.js gói cả thư mục thành một khối và gọi dangKyKhoi('lop-3', …) ngay sau core/30-bai-giang. */
import { dangKyHk1 } from './10-hk1.js';
import { dangKyBaiGiang } from './20-bai-giang.js';
import { dangKyHk2A } from './30-hk2-phan-a.js';
import { dangKyHk2B } from './31-hk2-phan-b.js';
export function dangKy(reg){dangKyHk1(reg);dangKyBaiGiang(reg);dangKyHk2A(reg);dangKyHk2B(reg);}
