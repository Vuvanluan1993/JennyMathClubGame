/* ===================== NỘI DUNG LỚP 6–9 (P-15a, 26/10/2026) ===================== */
/* Phần I (SGK lớp 6–9) và Phần II Toán Jenny lớp 6. dangKy(reg) đổ vào P1BY, ALLP1, P2 của core/30a.
   Lúc dựng: gói thành một khối, gọi dangKyKhoi('lop-6-9', …) ngay sau core/30a (trước core/09, vì core/21 đọc P1BY[6] lúc nạp). */
import { P1_6 } from './02-sgk-lop-6.js';
import { SLIDES6 } from './04-video-lop-6.js';
import { P1_7 } from './05-lop-7.js';
import { P1_8 } from './06-lop-8.js';
import { P1_9 } from './07-lop-9.js';
import { P2 } from './08-toan-jenny-lop-6.js';
export function dangKy(reg){const {P1BY,ALLP1,P2:P2_REG}=reg;
  P1_6.find(x=>x.id==='b2').slides=SLIDES6.b2;P1_6.find(x=>x.id==='b2').video=true;P1_6.find(x=>x.id==='b3').slides=SLIDES6.b3;P1_6.find(x=>x.id==='b3').video=true;
  Object.assign(P1BY,{6:P1_6,7:P1_7,8:P1_8,9:P1_9});ALLP1.push(...P1_6,...P1_7,...P1_8,...P1_9);
  P2_REG.push(...P2);
}
