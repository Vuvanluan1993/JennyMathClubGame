/* ===================== THÔNG BÁO TRÊN THANH ĐIỀU HƯỚNG (lớp 1–5) ===================== */
/* Bản đồ: số đảo vừa được mở (theo tiến độ thật, không tính chế độ mở khoá kiểm tra) mà em chưa vào.
   Toán Jenny: chưa kích hoạt → hình khoá; đã kích hoạt → số buổi cô mới mở mà em chưa vào.
   Luyện lỗi: số lỗi cần sửa. Sưu tập: số món mới (thẻ sinh vật, dấu hộ chiếu) em chưa xem.
   Lưu: st.seen = {isl:{id:1}, j:{id:1}, alb:số món đã xem}. */
import { hooks } from './00-hooks.js';
import { ISL, s1 } from './30b-may-tieu-hoc.js';
import { P2_1 } from './25-lop-1-so-loi-sai-toan-jenny.js';
export function seenOf(st){const v=st.seen||(st.seen={isl:null,j:{},alb:null});v.j=v.j||{};
  /* lần đầu: coi mọi thứ hiện có là đã xem, để không hiện số lớn với tiến độ cũ */
  if(!v.isl){v.isl={};try{ISL(st).forEach((x,k)=>{if(natOpen(st,k))v.isl[x.id]=1})}catch(e){}}
  if(v.alb==null)v.alb=albCount(st);return v}
export function natOpen(st,k){const L=ISL(st);if(k<=0)return true;const x=L[k],p=L[k-1];return x.ti!==p.ti?s1(st,p.id).m.every(Boolean):!!s1(st,p.id).m[0]}
function albCount(st){return Object.keys(st.cards||{}).filter(k=>st.cards[k]).length+Object.keys(st.pass||{}).length}
function newIsl(st){const v=seenOf(st);let n=0;try{ISL(st).forEach((x,k)=>{if(!v.isl[x.id]&&natOpen(st,k))n++})}catch(e){}return n}
export function jList(st){return P2_1.filter(x=>x.grade===st.grade&&!x.draft&&S.open[x.id])}
export function navBadge(k,st,nm){if(!st||st.grade>5)return null;const v=seenOf(st);
  if(k==='fix')return nm?{n:nm,t:`${nm} lỗi cần sửa`}:null;
  if(k==='map'){const n=newIsl(st);return n?{n,t:`${n} đảo mới mở`}:null}
  if(k==='jenny'){if(!st.active)return{lock:1,t:'chưa mở, cần mã kích hoạt của trung tâm'};const n=jList(st).filter(x=>!v.j[x.id]).length;return n?{n,t:`${n} buổi mới được giao`}:null}
  if(k==='album'){const n=Math.max(0,albCount(st)-v.alb);return n?{n,t:`${n} món mới`}:null}
  return null}
/* đánh dấu đã xem khi em vào đảo, vào buổi Toán Jenny, mở tab Sưu tập */
{hooks.on('go',_go=>function(s){try{if(role==='hs'){const st=S.st[sid];if(st&&st.grade<=5){const v=seenOf(st);
  if(s&&s.k==='island'&&s.id)v.isl[s.id]=1;
  if(s&&s.k==='jenny'&&s.id)v.j[s.id]=1;
  if(s&&s.k==='home'&&s.tab==='album')v.alb=albCount(st);}}}catch(e){}return _go.apply(this,arguments)})}
