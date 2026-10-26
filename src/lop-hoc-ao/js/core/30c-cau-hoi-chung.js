/* ===================== CÂU HỎI CHUNG lớp 1–5 (P-15a: phần chung của js/content/hk1/26) ===================== */
/* (cũ) LỚP 2–5 · CHỦ ĐỀ 1 (ÔN TẬP VÀ BỔ SUNG) */
/* Đề viết lại theo kiến thức từng bài trong Vở BT-TH Toán 2–5 (KNTT): đổi bối cảnh, nhân vật, số liệu. */
import { fmt, range } from './01-tien-ich.js';
import { shuf } from './21-lop-6-che-do-tro-choi.js';
export function vnRead(n){if(n===0)return'không';const D=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
  const r3=(x,full)=>{const h=Math.floor(x/100),t=Math.floor(x/10)%10,u=x%10;let s=[];if(full||h)s.push(D[h]+' trăm');
    if(t===0){if(u&&(full||h))s.push('linh '+D[u]);else if(u)s.push(D[u])}else if(t===1){s.push('mười'+(u===0?'':u===5?' lăm':' '+D[u]))}else{s.push(D[t]+' mươi'+(u===0?'':u===1?' mốt':u===4?' tư':u===5?' lăm':' '+D[u]))}return s.join(' ')};
  const parts=[[1e9,'tỉ'],[1e6,'triệu'],[1e3,'nghìn'],[1,'']];let s=[],started=false;
  for(const[v,w]of parts){const c=Math.floor(n/v)%1000;if(c||(!started&&false)){s.push((r3(c,started)+(w?' '+w:'')).trim());started=true}else if(started&&v===1e3&&n%1e3){/* bỏ trống hàng nghìn */}}
  return s.join(' ').replace(/\s+/g,' ').trim()}
export const NQ=(q,say,a,sol,kind)=>({type:'num',q,say,a,sol,kind});
export function CQ(q,say,ans,cands,sol,kind,big){const s=[String(ans)];for(const c of cands){const v=String(c);if(s.length>=4)break;if(!s.includes(v))s.push(v)}const o=shuf(s);return{type:'opt',big:big?1:0,cols:o.length===4?2:3,q,say,opts:o.map(h=>({h,v:h})),a:o.indexOf(String(ans)),sol,kind}}
export const SG=(a,b,ta,tb,kind,va,vb)=>{va=va===undefined?a:va;vb=vb===undefined?b:vb;const ans=va>vb?0:va<vb?1:2;return{type:'opt',big:1,cols:3,q:`Chọn dấu đúng: <b>${ta} … ${tb}</b>`,say:'Em chọn dấu lớn hơn, bé hơn hay bằng.',opts:['&gt;','&lt;','='].map((h,v)=>({h,v})),a:ans,sol:`${ta} ${['&gt;','&lt;','='][ans]} ${tb}.`,kind}};
export const ORD=(vals,txt,kind)=>{const v=vals.map((x,i)=>[x,i]);return{type:'order',q:'Chạm các số theo thứ tự từ bé đến lớn.',say:'Em chạm vào các số theo thứ tự từ bé đến lớn nhé.',opts:vals.map(txt||String),a:[...v].sort((p,q)=>p[0]-q[0]).map(p=>p[1]),sol:`Từ bé đến lớn: ${[...vals].sort((x,y)=>x-y).map(txt||String).join(', ')}.`,kind}};
export const THINGS=[['quả cam','thùng'],['viên bi','hộp'],['cái bánh','khay'],['quyển vở','chồng'],['bông hoa','lẵng'],['chai nước','thùng'],['cái kẹo','túi']];
/* ---------- Lớp 4 ---------- */
export const sp=n=>fmt(n);
export const F=(n,d)=>`<span class="frac"><span>${n}</span><span>${d}</span></span>`;
export function buildIsl(g,L,TI=0){return L.flatMap(([bid,bn,title,short,nt,e,h,boss],bi)=>range(1,nt).map(t=>{const last=bi===L.length-1&&t===nt;const ttl=title.replace(/^Bài \d+\. /,'');
  return{id:`g${g}${bid}t${t}`,title:`Bài ${bn} · Tiết ${t}`,lesson:title,short:`${short} · T${t}`,goal:t===1?`Học và ôn: ${ttl.toLowerCase()}`:`Luyện tập: ${ttl.toLowerCase()}`,lv:[t===1?e:e.concat(h.slice(0,1)),h].concat(last&&boss?[boss]:[]),nm:last&&boss?3:2,boss:!!(last&&boss),slides:[],tiet:t,ntiet:nt,b:bn,ti:TI}}))}
export const BOSSPOOL=[['crab','Cua'],['octo','Bạch tuộc'],['shark','Cá mập'],['jelly','Sứa'],['dragon','Rồng'],['snake','Rắn biển'],['squid','Mực khổng lồ']];
