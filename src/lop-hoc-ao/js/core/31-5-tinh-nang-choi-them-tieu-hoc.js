/* ===================== 5 TÍNH NĂNG CHƠI THÊM (Tiểu học) ===================== */
import { hooks } from './00-hooks.js';
import { esc, pick } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { go, render, toast } from './13-giao-dien-chung.js';
import { PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { open1, q1, sayFull, sayJ } from './30b-may-tieu-hoc.js';
import { curG, PI, PRIM } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { endRace } from './32-tinh-nang-choi-them-dat-trong-tung-dao.js';
import { sfx } from './33b-am-thanh.js';
Object.assign(PXS,{clock:["...kkk...","....k....","..kkkkk..",".kwwkwwk.","kwwwkwwwk","kwwwkkkwk","kwwwwwwwk",".kwwwwwk.","..kkkkk.."],
 whale2:[".....kkkkk......","...kkBBBBBkk..kk","..kBBBBBBBBBk.kB",".kBwkBBBBBBBBkBk","kBBBBBBBBBBBBBk.",".kwwwwwwwwwwwk..","..kkkkkkkkkkk..."]});
/* ---- phân bổ tính năng theo chủ đề ---- */
const FEATN={fish:['fish','Câu cá'],balloon:['balloon','Bóng bay'],race:['clock','Đua giờ'],cboss:['octo','Trùm lớp'],sea:['bottle','Kho báu biển'],card:['book','Sưu tập']};
function featOf(name,ti){const f=[];if(ti===0||/số|So sánh|Phân số|thập phân|Tỉ số|Các số/i.test(name))f.push('fish');if(ti===0||/phép|cộng|trừ|nhân|chia|tính|Bảng/i.test(name))f.push('balloon');f.push('race','sea');if(ti===0||/Ôn tập/i.test(name)||ti%3===2)f.push('cboss');f.push('card');return f}
/* ---- trò chơi nhỏ: câu cá / bắn bóng ---- */
/* MG[lớp] (luật Câu cá / Bóng bay chủ đề 1) nay ở content/lop-N/10-hk1.js, đăng ký vào MG của core/30a */
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

