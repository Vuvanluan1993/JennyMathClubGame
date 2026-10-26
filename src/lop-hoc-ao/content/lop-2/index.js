/* ===================== NỘI DUNG LỚP 2 (P-15a, 26/10/2026) ===================== */
/* dangKy(reg): đăng ký đảo, bài giảng, trò chơi nhỏ của lớp 2 vào PRIM/LES/MG/MGT (reg do core/30a-dang-ky-khoi.js đưa vào).
   Lúc dựng: tools/vite/noi-file.js gói cả thư mục thành một khối và gọi dangKyKhoi('lop-2', …) ngay sau core/30-bai-giang. */
import { dangKyHk1 } from './10-hk1.js';
import { dangKyBaiGiang } from './20-bai-giang.js';
import { dangKyHk2A } from './30-hk2-phan-a.js';
import { dangKyHk2B } from './31-hk2-phan-b.js';
import { KT_TRUOC_LOP } from './90-kien-thuc-truoc.js';
export function dangKy(reg){reg.KT_TRUOC[2]=KT_TRUOC_LOP;dangKyHk1(reg);dangKyBaiGiang(reg);dangKyHk2A(reg);dangKyHk2B(reg);}
