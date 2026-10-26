/* ===================== ĐĂNG KÝ NỘI DUNG THEO KHỐI (P-15a, 26/10/2026) ===================== */
/* Nội dung bài học ở content/lop-1 … lop-5, lop-6-9 (mỗi thư mục: index.js export function dangKy(reg)).
   File này giữ trạng thái chung mà nội dung đổ vào (P1BY, ALLP1, P2, LES, MG, MGT; PRIM ở core/25) và dangKyKhoi().
   P-15a: tools/vite/noi-file.js gói từng thư mục content/lop-* thành một khối trong script chung rồi gọi dangKyKhoi(k, {dangKy}) tại chỗ cũ của nội dung
   (lop-6-9 ngay sau file này, lop-1 … lop-5 ngay sau core/30-bai-giang) → thứ tự chạy y như trước. Cách này chỉ còn ở bản một file (lop-hoc-ao-jenny.html, npm run dev).
   P-15b (26/10/2026): các trang (học sinh, giáo viên, phụ huynh, quản lý, bản thử, day-du.html) không nối nội dung; mỗi khối là một file JS riêng
   (assets/lop-N-[hash].js), napKhoi(k) tải bằng import() khi cần (core/34 chờ khối của màn đang vẽ). Đường dẫn khối: <script type="application/json" id="khoi-url"> do tools/vite/noi-file.js ghi.
   Sau mỗi lần đăng ký: hooks.run('khoi:sau', k) — file core nào xử lý nội dung lúc nạp (33d, 45, 48) đăng ký hooks.khi('khoi:sau', …) để chạy lại cho khối mới. */
import { hooks } from './00-hooks.js';
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
export const KT_TRUOC={}; // KT_TRUOC[lớp] = kiến thức cuối lớp trước (content/lop-N/90-kien-thuc-truoc.js): core/39e dùng khi chưa tải khối lớp trước
const NOI_DUNG={}; // khối đã đăng ký: 'lop-1' → module {dangKy}
const REG={get PRIM(){return PRIM},P1BY,ALLP1,P2,LES,MG,MGT,KT_TRUOC,addTopic:(...a)=>addTopic(...a)};
function dangKyKhoi(k,m){if(NOI_DUNG[k])return;NOI_DUNG[k]=m;m.dangKy(REG);hooks.run('khoi:sau',k)}
/* ---------- P-15b: tải khối khi cần ---------- */
export const khoiCua=g=>(+g>=6?'lop-6-9':'lop-'+Math.max(1,+g||1)); // lớp → tên khối
export const khoiXong=k=>!!NOI_DUNG[k];
const KHOI_URL=(()=>{try{const e=document.getElementById('khoi-url');return e?JSON.parse(e.textContent):{}}catch(e){return{}}})();
export const khoiCo=k=>!!NOI_DUNG[k]||!!KHOI_URL[k]; // trang này có khối k không (bản học sinh không có lop-6-9)
const DANG_NAP={};
/** Tải và đăng ký khối k (một lần; lỗi mạng thì lần gọi sau thử lại). */
export function napKhoi(k){if(NOI_DUNG[k])return Promise.resolve(NOI_DUNG[k]);if(DANG_NAP[k])return DANG_NAP[k];
  if(!KHOI_URL[k])return Promise.reject(new Error('trang này không có nội dung '+k));
  return DANG_NAP[k]=import(new URL(KHOI_URL[k],document.baseURI).href).then(m=>{delete DANG_NAP[k];dangKyKhoi(k,m);return m},e=>{delete DANG_NAP[k];throw e})}
/* bộ kiểm tra: await window.__ready(g) trước khi đọc PRIM[g] (g bỏ trống: lớp 1–5) */
window.__ready=g=>Promise.all((g==null?[1,2,3,4,5]:[].concat(g)).map(x=>napKhoi(khoiCua(x)))).then(()=>true);
