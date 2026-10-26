/* ===================== HÌNH PHẲNG, GÓC, ĐỒNG HỒ (P-15a: phần chung của js/content/hk1/27) ===================== */
/* (cũ) CHỦ ĐỀ 2 · LỚP 1–5 */
/* Lớp 1: Hình phẳng · Lớp 2: Cộng, trừ trong phạm vi 20 · Lớp 3: Bảng nhân, bảng chia · Lớp 4: Góc · Lớp 5: Số thập phân.
   Đề viết mới theo kiến thức từng bài trong Vở BT-TH (đổi đồ vật, bối cảnh, số liệu). */
/* ---- hình phẳng pixel ---- */
import { pick, R, range } from './01-tien-ich.js';
import { shuf } from './21-lop-6-che-do-tro-choi.js';
import { PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { isl1, optN } from './30b-may-tieu-hoc.js';
import { PB, PI } from './25-lop-1-so-loi-sai-toan-jenny.js';
export const SHN={sq:'hình vuông',ci:'hình tròn',tr:'hình tam giác',rc:'hình chữ nhật'},SHK=Object.keys(SHN),SHC=['r','b','g','a','p','o'];
function shapeRows(k,c){const W=k==='rc'?16:12,H=k==='rc'?9:12,R=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){let ch='.';
  if(k==='sq'||k==='rc'){ch=(x===0||y===0||x===W-1||y===H-1)?'k':c}
  else if(k==='ci'){const d=Math.hypot(x-5.5,y-5.5);ch=d<=5.9?(d>4.9?'k':c):'.'}
  else{const half=(y+1)*W/(2*H),cx=(W-1)/2;const inn=Math.abs(x-cx)<=half;const edge=inn&&(Math.abs(x-cx)>half-1.2||y===H-1);ch=inn?(edge?'k':c):'.'}
  s+=ch}R.push(s)}return R}
SHK.forEach(k=>SHC.forEach(c=>{PXS[`sh_${k}_${c}`]=shapeRows(k,c)}));
export const shp=(k,sz=40,c)=>spr(`sh_${k}_${c||pick(SHC)}`,k==='rc'?Math.round(sz*.75):sz);
const OBJSH=[['Mặt chiếc đồng hồ treo tường','ci'],['Bánh xe đạp','ci'],['Chiếc đĩa ăn cơm','ci'],['Đồng xu','ci'],['Viên gạch xây nhà','rc'],['Quyển vở','rc'],['Cánh cửa ra vào','rc'],['Mặt bàn học','rc'],['Ô cửa sổ nhỏ hình bốn cạnh bằng nhau','sq'],['Mặt con xúc xắc','sq'],['Chiếc khăn tay vuông','sq'],['Biển báo nguy hiểm','tr'],['Lá cờ đuôi nheo','tr'],['Miếng bánh mì kẹp cắt chéo','tr']];
export const QS1={
 name:()=>()=>{const k=pick(SHK),o=shuf(SHK);return{type:'opt',cols:2,q:'Đây là hình gì?',say:'Đây là hình gì? Em chọn tên đúng nhé.',pic:`<div class="g1grp">${shp(k,80)}</div>`,opts:o.map(v=>({h:SHN[v].replace(/^h/,'H'),v})),a:o.indexOf(k),sol:`Đây là ${SHN[k]}.`,kind:'Nhận biết hình'}},
 find:()=>()=>{const o=shuf(SHK).slice(0,3),k=pick(o);return{type:'opt',cols:3,q:`Chạm vào <b>${SHN[k]}</b>.`,say:`Em chạm vào ${SHN[k]} nhé.`,opts:o.map(v=>({h:shp(v,48),v})),a:o.indexOf(k),sol:`Đó là ${SHN[k]}.`,kind:'Nhận biết hình'}},
 count:()=>()=>{const k=pick(SHK),n=R(1,5),others=Array.from({length:R(3,5)},()=>pick(SHK.filter(v=>v!==k)));const all=shuf([...Array(n).fill(k),...others]);const o=optN(n,0,9,3);return{type:'opt',big:1,q:`Có mấy <b>${SHN[k]}</b>?`,say:`Có mấy ${SHN[k]}? Em đếm kỹ nhé.`,pic:`<div class="g1grp">${all.map(v=>shp(v,34)).join('')}</div>`,...o,sol:`Có ${n} ${SHN[k]}.`,kind:'Đếm hình'}},
 pick:()=>()=>{const k=pick(SHK),list=shuf([k,k,...Array.from({length:4},()=>pick(SHK))]).slice(0,6);return{type:'pick',q:`Chạm vào <b>tất cả</b> các ${SHN[k]}.`,say:`Chạm vào tất cả các ${SHN[k]}, rồi bấm kiểm tra.`,opts:list.map(v=>shp(v,40)),a:list.map((v,i)=>v===k?i:-1).filter(i=>i>=0),sol:`Có ${list.filter(v=>v===k).length} ${SHN[k]}.`,kind:'Tìm hình'}},
 obj:()=>()=>{const [o,k]=pick(OBJSH),ops=shuf(SHK);return{type:'opt',cols:2,q:`<b>${o}</b> có dạng hình gì?`,say:`${o} có dạng hình gì?`,opts:ops.map(v=>({h:SHN[v].replace(/^h/,'H'),v})),a:ops.indexOf(k),sol:`${o} có dạng ${SHN[k]}.`,kind:'Hình trong đời sống'}},
 odd:()=>()=>{const [a,b]=shuf(SHK).slice(0,2),list=shuf([a,a,a,b]);return{type:'opt',cols:2,q:'Hình nào <b>khác loại</b> với các hình còn lại?',say:'Ba hình cùng loại, một hình khác loại. Em tìm hình khác loại nhé.',opts:list.map(v=>({h:shp(v,48),v})),a:list.indexOf(b),sol:`Ba hình là ${SHN[a]}, hình còn lại là ${SHN[b]}.`,kind:'Tìm hình khác loại'}},
 cells:()=>()=>{const c=R(2,4),r=R(1,3);let cells=[];for(let y=0;y<r;y++)for(let x=0;x<c;x++)cells.push([x,y]);const drop=R(0,Math.max(0,cells.length-3));cells=shuf(cells).slice(0,cells.length-Math.min(drop,1));const n=cells.length,col=pick(SHC);const o=optN(n,1,12,3);
   return{type:'opt',big:1,q:'Bạn Mèo xếp hình bên bằng các hình vuông nhỏ. Bạn đã dùng mấy hình vuông?',say:'Bạn Mèo xếp một hình bằng các hình vuông nhỏ. Bạn đã dùng mấy hình vuông?',pic:`<div class="g1cellfig" style="grid-template-columns:repeat(${c},40px)">${Array.from({length:r*c},(_,i)=>{const x=i%c,y=Math.floor(i/c);return cells.some(p=>p[0]===x&&p[1]===y)?`<span>${spr('sh_sq_'+col,40)}</span>`:'<span></span>'}).join('')}</div>`,...o,sol:`Đếm từng ô: có ${n} hình vuông.`,kind:'Lắp ghép, xếp hình'}},
 compose:()=>()=>{const c=pick([['Hai hình vuông bằng nhau đặt cạnh nhau tạo thành hình gì?','rc'],['Bốn hình vuông bằng nhau xếp thành 2 hàng, mỗi hàng 2 hình, tạo thành hình gì?','sq'],['Ba hình vuông bằng nhau xếp thành một hàng tạo thành hình gì?','rc'],['Bốn que tính bằng nhau xếp khép kín được hình gì?','sq'],['Ba que tính xếp khép kín được hình gì?','tr']]);const ops=shuf(SHK);return{type:'opt',cols:2,q:c[0],say:c[0],opts:ops.map(v=>({h:SHN[v].replace(/^h/,'H'),v})),a:ops.indexOf(c[1]),sol:`Kết quả là ${SHN[c[1]]}.`,kind:'Lắp ghép, xếp hình'}},
 pat:()=>()=>{const [a,b,c]=shuf(SHK),t3=Math.random()<.5,seq=range(0,R(4,6)).map(i=>t3?[a,b,c][i%3]:[a,b][i%2]),nx=t3?[a,b,c][seq.length%3]:[a,b][seq.length%2];const ops=shuf([a,b,c]);return{type:'opt',cols:3,q:'Hình nào xếp tiếp theo?',say:'Các hình được xếp theo quy luật. Hình nào xếp tiếp theo?',pic:`<div class="g1grp">${seq.map(v=>shp(v,30,'b')).join('')}<span class="g1qm">?</span></div>`,opts:ops.map(v=>({h:shp(v,44,'b'),v})),a:ops.indexOf(nx),sol:'Các hình lặp lại theo đúng thứ tự.',kind:'Quy luật xếp hình'}},
};
/* ---- lớp 4: góc ---- */
export function angSvg(deg,size=130){const r=size*.62,cx=size*.18,cy=size*.78,rad=deg*Math.PI/180,x2=cx+r*Math.cos(rad),y2=cy-r*Math.sin(rad);const ar=size*.16,ax=cx+ar*Math.cos(rad),ay=cy-ar*Math.sin(rad);
  const mark=deg===90?`<path d="M${cx+14} ${cy}V${cy-14}H${cx}" fill="none" stroke="#F04A1B" stroke-width="4"/>`:`<path d="M${cx+ar} ${cy}A${ar} ${ar} 0 ${deg>180?1:0} 0 ${ax.toFixed(1)} ${ay.toFixed(1)}" fill="none" stroke="#F04A1B" stroke-width="4"/>`;
  return`<svg class="angsvg" viewBox="${deg>90?-size*.62:0} 0 ${deg>90?size*1.62:size} ${size}" width="${deg>90?size*1.4:size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true">${mark}<line x1="${cx}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="#1F2A5A" stroke-width="6" stroke-linecap="square"/><line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#1F2A5A" stroke-width="6" stroke-linecap="square"/><rect x="${cx-5}" y="${cy-5}" width="10" height="10" fill="#FCB40C"/></svg>`}
export function clockSvg(h){const c=60,r=50,hr=(h%12)*30*Math.PI/180;const hx=c+28*Math.sin(hr),hy=c-28*Math.cos(hr);return`<svg viewBox="0 0 120 120" width="120" height="120" shape-rendering="crispEdges" aria-hidden="true"><rect x="10" y="10" width="100" height="100" fill="#fff" stroke="#1F2A5A" stroke-width="6"/>${[0,3,6,9].map(i=>{const a=i*30*Math.PI/180;return`<rect x="${(c+40*Math.sin(a)-3).toFixed(0)}" y="${(c-40*Math.cos(a)-3).toFixed(0)}" width="6" height="6" fill="#1F2A5A"/>`}).join('')}<line x1="${c}" y1="${c}" x2="${c}" y2="${c-38}" stroke="#12B5E8" stroke-width="5"/><line x1="${c}" y1="${c}" x2="${hx.toFixed(0)}" y2="${hy.toFixed(0)}" stroke="#F04A1B" stroke-width="7"/><rect x="${c-5}" y="${c-5}" width="10" height="10" fill="#FCB40C"/></svg>`}
export const PLAY=ti=>PI().some(x=>x.ti===ti);
export const bossOf=id=>{const x=id&&isl1(id);return PB()[x&&x.ti?x.ti:0]};
