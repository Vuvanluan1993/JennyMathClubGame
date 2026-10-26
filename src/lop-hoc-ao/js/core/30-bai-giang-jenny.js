/* ===================== BÀI GIẢNG JENNY (slide tóm tắt kiến thức theo bài) ===================== */
/* P-15a: LES ở core/30a; slide từng lớp ở content/lop-N/20-bai-giang.js. */
/* LES[lớp][bài] = các slide. Tiết 1 của bài xem đủ; các tiết sau xem "Nhắc lại nhanh" (slide cuối), có thể xem đủ. */
import { esc, range } from './01-tien-ich.js';
import { ALLP1, LES, MGT, P1BY } from './30a-dang-ky-khoi.js';
import { go } from './13-giao-dien-chung.js';
import { spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { isl1, sayFull, sayJ } from './30b-may-tieu-hoc.js';
import { curG, PRIM } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { buildIsl } from './30c-cau-hoi-chung.js';
import { jenny } from './33d-jenny-bieu-cam.js';
export const lsLine=(a,b,hl)=>`<div class="lsline">${range(a,b).map(v=>`<span class="${hl&&hl.includes(v)?'on':''}">${v}</span>`).join('')}</div>`;
export const lsTab=(head,rows)=>`<table class="lstab"><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
export const lsMem=t=>`<div class="lsmem">${spr('star',22)}<span>${t}</span></div>`;
/* đăng kí một chủ đề mới: các đảo (theo số tiết), trò chơi nhỏ riêng */
export function addTopic(g,ti,L,mg){const add=buildIsl(g,L,ti);PRIM[g].isl=PRIM[g].isl.concat(add).sort((p,q)=>(p.ti||0)-(q.ti||0));P1BY[g]=PRIM[g].isl;ALLP1.push(...add);if(mg){MGT[ti]=MGT[ti]||{};MGT[ti][g]=mg}}
export const lesOf=x=>{const g=Number(String(x.id).slice(1,2));return(LES[g]||{})[x.b]||null};
function startLes(id,full){try{speechSynthesis.cancel()}catch(e){}const x=isl1(id),L=lesOf(x);if(!L)return;const quick=!full&&x.tiet>1;go({k:'lslide',id,i:quick?L.length-1:0,quick})}
let lesSaid='';
export function viewLes(){const x=isl1(scr.id),L=lesOf(x),i=scr.i,sl=L[i],last=i===L.length-1,first=scr.quick?true:i===0;
  const key=scr.id+':'+i;if(curG()<=2&&lesSaid!==key){lesSaid=key;setTimeout(()=>{if(scr.k==='lslide'&&scr.i===i)sayJ(sayFull(sl.say,sl.h))},350)}
  const done=`const s=s1(S.st[sid],'${x.id}');s.les=true;save();try{speechSynthesis.cancel()}catch(e){};go({k:'island',id:'${x.id}'})`;
  return`<div class="page"><div class="crumb"><button class="btn sm ghost" onclick="try{speechSynthesis.cancel()}catch(e){};go({k:'island',id:'${x.id}'})">← ${esc(x.title)}</button></div>
   <div class="card g1slide lslide"><div class="row" style="justify-content:space-between;gap:8px"><span class="pill">${scr.quick?'Nhắc lại nhanh':`Trang ${i+1}/${L.length}`}</span><span class="row" style="gap:6px">${scr.quick?`<button class="btn sm" type="button" onclick="startLes('${x.id}',1)">Xem đủ</button>`:''}<button class="btn sm" type="button" onclick="sayJ(sayFull(lesOf(isl1(scr.id))[scr.i].say,lesOf(isl1(scr.id))[scr.i].h))">🔊 Nghe</button></span></div>
   <div class="lshead">${jenny(48)}<h2>${esc(sl.t)}</h2></div><div class="g1slb">${sl.h}</div>
   <div class="row" style="margin-top:16px;justify-content:space-between;gap:8px"><button class="btn" type="button" ${first?'disabled':''} onclick="sfx('page');scr.i--;try{speechSynthesis.cancel()}catch(e){};render()">← Trước</button>${last?`<button class="btn pri" type="button" onclick="${done}">Vào chơi ▶</button>`:`<button class="btn pri" type="button" onclick="sfx('page');scr.i++;try{speechSynthesis.cancel()}catch(e){};render()">Tiếp →</button>`}</div></div></div>`}
