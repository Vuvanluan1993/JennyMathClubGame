/* ===================== ĐĂNG KÝ NỘI DUNG THEO KHỐI (P-15a, 26/10/2026) ===================== */
/* Nội dung bài học ở content/lop-1 … lop-5, lop-6-9 (mỗi thư mục: index.js export function dangKy(reg)).
   File này giữ trạng thái chung mà nội dung đổ vào (P1BY, ALLP1, P2, LES, MG, MGT; PRIM ở core/25) và dangKyKhoi().
   P-15a: tools/vite/noi-file.js gói từng thư mục content/lop-* thành một khối trong script chung rồi gọi dangKyKhoi(k, {dangKy}) tại chỗ cũ của nội dung
   (lop-6-9 ngay sau file này, lop-1 … lop-5 ngay sau core/30-bai-giang) → thứ tự chạy y như trước. P-15b: thay bằng await import() theo khối. */
import { PRIM } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { addTopic } from './30-bai-giang-jenny.js';
export const P1BY={};   // lớp → mảng đảo/bài: 6–9 bài Phần I (content/lop-6-9), 1–5 = PRIM[g].isl
export const ALLP1=[];   // mọi đảo/bài Phần I (tìm theo id)
export const L1=st=>P1BY[st.grade];
export const NEED=k=>2*k;   // tổng sao cần có để mở đảo thứ k của Phần I
export const BOOK={6:'Chương I. Tập hợp các số tự nhiên',7:'Chương I. Số hữu tỉ',8:'Chương I. Đa thức',9:'Chương I. Phương trình và hệ hai phương trình bậc nhất hai ẩn'};
export const M1=['Màn 1 · Cơ bản','Màn 2 · Hiểu','Màn 3 · Vận dụng'];
export const P1_Q=5, P1_PASS=4;
export const STAR2=[2,3,4];
export const P2=[];      // Phần II Toán Jenny lớp 6 (content/lop-6-9 đổ vào)
export const LES={};     // LES[lớp][bài] = slide Bài giảng Jenny
export const MG={};      // MG[lớp]: luật Câu cá / Bóng bay chủ đề 1
export const MGT={};     // MGT[chủ đề ≥ 1][lớp]
const NOI_DUNG={}; // khối đã đăng ký: 'lop-1' → module {dangKy}
const REG={get PRIM(){return PRIM},P1BY,ALLP1,P2,LES,MG,MGT,addTopic:(...a)=>addTopic(...a)};
function dangKyKhoi(k,m){if(NOI_DUNG[k])return;NOI_DUNG[k]=m;m.dangKy(REG)}
