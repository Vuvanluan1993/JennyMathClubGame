/* ===================== 5 TÍNH NĂNG CHƠI THÊM (Tiểu học) ===================== */
import { hooks } from './00-hooks.js';
import { esc, fmt, pick, R, range } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { go, render, toast } from './13-giao-dien-chung.js';
import { PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { NUMW, open1, q1, sayFull, sayJ } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { curG, PI, PRIM } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { F } from '../content/hk1/26-lop-2-5-chu-de-1-on-tap-va-bo-sung.js';
import { endRace } from './32-tinh-nang-choi-them-dat-trong-tung-dao.js';
import { sfx } from './33b-am-thanh.js';
Object.assign(PXS,{clock:["...kkk...","....k....","..kkkkk..",".kwwkwwk.","kwwwkwwwk","kwwwkkkwk","kwwwwwwwk",".kwwwwwk.","..kkkkk.."],
 whale2:[".....kkkkk......","...kkBBBBBkk..kk","..kBBBBBBBBBk.kB",".kBwkBBBBBBBBkBk","kBBBBBBBBBBBBBk.",".kwwwwwwwwwwwk..","..kkkkkkkkkkk..."]});
/* ---- phân bổ tính năng theo chủ đề ---- */
const FEATN={fish:['fish','Câu cá'],balloon:['balloon','Bóng bay'],race:['clock','Đua giờ'],cboss:['octo','Trùm lớp'],sea:['bottle','Kho báu biển'],card:['book','Sưu tập']};
function featOf(name,ti){const f=[];if(ti===0||/số|So sánh|Phân số|thập phân|Tỉ số|Các số/i.test(name))f.push('fish');if(ti===0||/phép|cộng|trừ|nhân|chia|tính|Bảng/i.test(name))f.push('balloon');f.push('race','sea');if(ti===0||/Ôn tập/i.test(name)||ti%3===2)f.push('cboss');f.push('card');return f}
/* ---- trò chơi nhỏ: câu cá / bắn bóng ---- */
export const MG={
 1:{fish:()=>{const k=R(3,6);return{rule:`Câu cá mang số <b>lớn hơn ${k}</b>`,say:`Câu những con cá mang số lớn hơn ${NUMW[k]}.`,item:()=>{const v=R(0,10);return{t:String(v),ok:v>k}}}},balloon:()=>{const k=R(4,7);return{rule:`Bắn bóng mang số <b>bé hơn ${k}</b>`,say:`Bắn những quả bóng mang số bé hơn ${NUMW[k]}.`,item:()=>{const v=R(0,10);return{t:String(v),ok:v<k}}}}},
 2:{fish:()=>({rule:'Câu cá mang <b>số tròn chục</b>',say:'Câu những con cá mang số tròn chục.',item:()=>{const v=Math.random()<.4?R(1,9)*10:R(11,99);return{t:String(v),ok:v%10===0}}}),balloon:()=>{const r=R(4,9)*10;return{rule:`Bắn bóng có kết quả <b>bằng ${r}</b>`,say:`Bắn những quả bóng có kết quả bằng ${r}.`,item:()=>{const s=Math.random()<.4?r:r+pick([-10,-2,-1,1,2,10]);const a=R(10,s-10);return{t:`${a} + ${s-a}`,ok:s===r}}}}},
 3:{fish:()=>{const k=pick([3,4,5]);return{rule:`Câu cá mang số <b>trong bảng nhân ${k}</b>`,say:`Câu những con cá mang kết quả trong bảng nhân ${NUMW[k]}.`,item:()=>{const v=Math.random()<.45?k*R(1,10):R(1,50);return{t:String(v),ok:v%k===0&&v<=k*10}}}},balloon:()=>{const t=pick([12,18,24,20,16,30,36]);return{rule:`Bắn bóng có tích <b>bằng ${t}</b>`,say:`Bắn những quả bóng có tích bằng ${t}.`,item:()=>{const ok=Math.random()<.45;if(ok){const ds=range(2,9).filter(d=>t%d===0&&t/d<=10);const d=pick(ds);return{t:`${d} × ${t/d}`,ok:true}}let a,b;do{a=R(2,9);b=R(2,9)}while(a*b===t);return{t:`${a} × ${b}`,ok:false}}}}},
 4:{fish:()=>({rule:'Câu cá mang <b>số chẵn</b>',say:'Câu những con cá mang số chẵn.',item:()=>{const v=R(100,9999);return{t:fmt(v),ok:v%2===0}}}),balloon:()=>({rule:'Bắn bóng mang số <b>lớn hơn 50 000</b>',say:'Bắn những quả bóng mang số lớn hơn năm mươi nghìn.',item:()=>{const v=R(30000,70000);return{t:fmt(v),ok:v>50000}}})},
 5:{fish:()=>({rule:`Câu cá mang phân số <b>bằng</b> ${F(1,2)}`,say:'Câu những con cá mang phân số bằng một phần hai.',item:()=>{const d=R(2,9),ok=Math.random()<.45;return ok?{t:F(d,2*d),ok:true}:{t:F(R(1,d),2*d+pick([1,-1,2])),ok:false}}}),balloon:()=>({rule:'Bắn bóng mang <b>phân số thập phân</b>',say:'Bắn những quả bóng mang phân số thập phân.',item:()=>{const ok=Math.random()<.45;return ok?{t:F(R(1,99),pick([10,100,1000])),ok:true}:{t:F(R(1,9),pick([3,4,5,6,7,8,20,25])),ok:false}}})},
};
globalThis.mgLoop=null;
export function stopMini(){if(mgLoop){cancelAnimationFrame(mgLoop.raf);clearInterval(mgLoop.tick);mgLoop=null}}
/* ---- câu hỏi lấy từ các đảo đã mở của chủ đề hiện tại ---- */
function openGens(st){const out=[];PI().forEach((x,k)=>{if(open1(st,k))x.lv.slice(0,2).forEach((gs,L)=>gs.forEach((gn,gi)=>out.push([x,L,gi])))});return out.length?out:[[PI()[0],0,0]]}
export function mkQ([x,L,gi]){const q=x.lv[L][gi]();return{...q,src:[x.id,L,gi],key:`${x.id}:${L}:${gi}`,label:q.kind||'Câu hỏi'}}
/* ---- Đua giờ 60 giây ---- */
globalThis.raceTick=null;
export function raceAfterRender(...a){return hooks.goi('raceAfterRender',this,a)}
hooks.ham('raceAfterRender',function(){if(scr.k!=='game'||!scr.race||scr.end||scr.started)return;scr.started=true;clearInterval(raceTick);raceTick=setInterval(()=>{scr.t--;const e=document.getElementById('rtime');if(e)e.textContent=scr.t;if(scr.t>0&&scr.t<=10)sfx(scr.t%2?'tick':'tock');if(scr.t<=0){clearInterval(raceTick);endRace()}},1000)});
export function raceAns(...a){return hooks.goi('raceAns',this,a)}
hooks.ham('raceAns',function(ok){const g=scr;if(ok){g.ok++;sfx('ok')}else{g.bad++;sfx('bad')}g.flash=ok?'ok':'bad';const q=mkQ(pick(g.pool));g.qs.push(q);g.j++;g.picks=[];g.seq=[];g.fill=[];g.used=[];g.cnt=0;g.inp='';render();if(curG()<=2)setTimeout(()=>{if(scr.race&&!scr.end)sayJ(sayFull(q1().say,q1().q))},150)});
/* ---- Kho báu trên biển (mỗi ngày 3 lần) ---- */
export const TRE={bottle:['bottle','Chai thư','+5 xu, có thể có thẻ sưu tập'],whale:['whale2','Cá voi vàng','+10 xu'],chest:['chest','Rương nổi','chắc chắn có thẻ sưu tập']};
export function treLeft(st){st.tre=st.tre||{};return Math.max(0,3-(st.tre[S.day]||0))}
function treKinds(){const r=[];let s=S.day*7+curG();for(let i=0;i<3;i++){s=(s*9301+49297)%233280;r.push(['bottle','whale','bottle','chest'][s%4])}return r}
export function treOverlay(st,pts){const left=treLeft(st),ks=treKinds().slice(3-left);return ks.map((k,i)=>{const p=pts[Math.min(pts.length-1,i*3+1)]||pts[0];return`<button class="tre" type="button" style="left:${p[0]+40}px;top:${i%2?210:8}px;animation-delay:${i*.7}s" onclick="startTre('${k}')" aria-label="${TRE[k][1]}: chạm để mở">${spr(TRE[k][0],k==='whale'?30:28)}<i>!</i></button>`}).join('')}
function startTre(kind){const st=S.st[sid];if(!treLeft(st)){toast('Hôm nay em đã nhặt hết kho báu. Mai quay lại nhé!');return}st.tre[S.day]=(st.tre[S.day]||0)+1;save();v1Said='';go({k:'game',g1:1,tre:kind,qs:[mkQ(pick(openGens(st)))],j:0,hearts:3,ok:0,tries:0,res:[],sheet:null,picks:[],seq:[],fill:[],used:[],cnt:0,inp:'',t0:Date.now()});sayJ(`${TRE[kind][1]}! Trả lời đúng để nhận quà nhé.`)}
/* ---- Bộ sưu tập ---- */
export const CREAT=[['fish','Cá Xanh'],['crab','Cua Đỏ'],['jelly','Sứa Hồng'],['octo','Bạch Tuộc Tím'],['turtle','Rùa Biển'],['shark','Cá Mập Con'],['squid','Mực Lửa'],['snake','Rắn Biển'],['chick','Gà Lạc Đảo'],['bug','Bọ Rùa Bay'],['cat','Mèo Thủy Thủ'],['whale2','Cá Voi Vàng'],['dragon','Rồng Biển'],['star','Sao Biển Vàng']];
const RARE=['whale2','dragon','star'];
export function giveCard(st,id){st.cards=st.cards||{};st.cards[id]=(st.cards[id]||0)+1;return CREAT.find(c=>c[0]===id)}
export function randCommon(){return pick(CREAT.filter(c=>!RARE.includes(c[0])))[0]}
export function viewAlbum(...a){return hooks.goi('viewAlbum',this,a)}
hooks.ham('viewAlbum',function(st){const c=st.cards||{},own=CREAT.filter(x=>c[x[0]]).length;
  return`<div class="grid"><section class="card"><div class="secthead"><h2>📖 Bộ sưu tập sinh vật biển</h2><span class="grow"></span><span class="pill ${own===CREAT.length?'ok':'acc'}">${own}/${CREAT.length}</span></div>
   <p class="muted" style="margin:4px 0 12px">Mỗi đảo có một thẻ sinh vật: cả lớp hạ trùm lớp của đảo là mỗi em nhận thẻ. Kho báu trên biển cũng có thể cho thẻ. Thẻ viền vàng là thẻ hiếm.</p>
   <div class="album">${CREAT.map(([s,n])=>`<div class="ccard ${c[s]?'own':''} ${RARE.includes(s)?'rare':''}">${spr(s,48)}<b>${c[s]?esc(n):'???'}</b>${c[s]>1?`<i>×${c[s]}</i>`:''}</div>`).join('')}</div></section></div>`});
/* ---- Trùm lớp hằng tuần ---- */
function cb(g){S.cb=S.cb||{};return S.cb[g]}
function openCB(g){const n=STUDENTS.filter(s=>s[2]===g).length;const b=PRIM[g].boss[0];S.cb=S.cb||{};S.cb[g]={on:true,spr:'octo',name:'Bạch tuộc khổng lồ',max:n*20,hp:n*20,hits:{},won:false,claimed:{},day:S.day};log('gv','assigned',`Trùm lớp tuần · lớp ${g}`,0,{});save();render();toast('Đã mở trùm lớp tuần này')}
/* ---- kết thúc các chế độ phụ ---- */

