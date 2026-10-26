/* 43 — Luyện lỗi có hướng dẫn (thống nhất với thầy 20/10)
   - Màn học và trò chơi: học sinh làm, chơi bình thường; câu sai lần đầu được ghi vào sổ lỗi, kèm đúng câu đó và đáp án em đã chọn.
   - Lỗi trong trò chơi (Ếch nhảy, Thả mồi, Trồng cây, Leo núi, Đập chuột…) cũng được ghi vào sổ.
   - Luyện lỗi: nêu lại đúng câu em đã sai ("Lần trước em chọn …"), em làm lại; câu sau là câu tương tự với số mới.
     Sai thì hướng dẫn tự mở; có nút "Xem cách làm" để xem trước khi làm. */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { go, toast } from './13-giao-dien-chung.js';
import { mist } from './21-lop-6-che-do-tro-choi.js';
import { spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { isl1, q1, right1 } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { curG, mist1Add } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { gdKind, gdTxt } from './40-huong-dan-khi-sai.js';
const GD_GAME={frog:'Ếch nhảy',bait:'Thả mồi câu cá',plant:'Trồng cây',climb:'Leo núi',mole:'Đập chuột',pair:'Lật thẻ',star:'Hứng sao',tug:'Kéo co',clock:'Đồng hồ',scale:'Cân thăng bằng',shop:'Cửa hàng',train:'Tàu hoả',shape:'Ghép hình'};
function gdSnap(q){try{const c=JSON.parse(JSON.stringify(q));return JSON.stringify(c).length<40000?c:null}catch(e){return null}}
export function gdShowAns(q,v){try{if(q.type==='opt'){const h=gdTxt(q.opts[v]&&q.opts[v].h||'');return h&&h.length<=24?h:''}if(q.type==='num')return String(v);if(q.type==='tf')return v?'Đúng':'Sai'}catch(e){}return''}
export function gdMistNote(q,extra){if(!q||!q.key)return;const M=mist(S.st[sid]),e=M[q.key];if(!e)return;const sn=gdSnap(q);if(sn)e.q=sn;Object.assign(e,extra);e.qt=Date.now();
 /* giữ bản lưu câu cũ cho 30 lỗi gần nhất để bộ nhớ máy không đầy */const W=Object.values(M).filter(x=>x.q).sort((a,b)=>(b.qt||0)-(a.qt||0));W.slice(30).forEach(x=>{delete x.q})}
/* màn học: ghi câu sai + đáp án đã chọn */
{const _ans=hooks.cu('ans1');hooks.de('ans1',function(v){const g=scr;let note=null;try{if(g&&g.k==='game'&&!g.fix&&!g.race&&g.part!==2&&!g.gdRedo){const q=q1();if(g.tries===0&&!right1(q,v))note={q,wa:gdShowAns(q,v),from:''}}}catch(e){}
  const r=_ans.apply(this,arguments);if(note){gdMistNote(note.q,{wa:note.wa,from:note.from});try{save()}catch(e){}}return r})}
/* trò chơi: câu sai lần đầu cũng vào sổ lỗi */
{const _x=hooks.cu('xgRec');hooks.de('xgRec',function(ok,q){const r=_x.apply(this,arguments);try{if(!ok&&q&&q.key&&q.src&&role==='hs'&&curG()<=5){mist1Add(q);gdMistNote(q,{wa:'',from:GD_GAME[scr&&scr.mode]||'trò chơi'});save()}}catch(e){}return r})}
/* Luyện lỗi: câu 1 là đúng câu đã sai (nếu còn lưu), câu 2 là câu tương tự với số mới */
hooks.de('startFix1',function(){const M=Object.values(mist(S.st[sid])).sort((a,b)=>a.day-b.day).slice(0,3);if(!M.length){toast('Sổ lỗi sai đang trống. Giỏi lắm!');return}
 const mk=e=>{const x=isl1(e.id);const q=x.lv[e.lv][e.gi]();return{...q,src:[e.id,e.lv,e.gi],key:`${e.id}:${e.lv}:${e.gi}`,label:e.label}};
 const old=e=>e.q?{...e.q,src:[e.id,e.lv,e.gi],key:`${e.id}:${e.lv}:${e.gi}`,label:e.label,gdWa:e.wa||'',gdFrom:e.from||'',gdOld:1}:{...mk(e),gdOld:0};
 const sim=(e,a)=>{for(let t=0;t<12;t++){const b=mk(e);if(gdTxt(b.q)+String(b.pic||'')!==gdTxt(a.q)+String(a.pic||''))return b}return mk(e)};
 v1Said='';go({k:'game',g1:1,fix:1,id:M[0].id,lv:0,qs:M.flatMap(e=>{const a=old(e);return[a,sim(e,a)]}),j:0,hearts:3,ok:0,tries:0,res:[],sheet:null,picks:[],seq:[],fill:[],used:[],cnt:0,hp:0,fixed:0,t0:Date.now()})});
/* nhắc câu cũ + nút xem cách làm */
{const _a=hooks.cu('g1AfterRender');hooks.de('g1AfterRender',function(){const r=_a.apply(this,arguments);try{const g=scr;if(g&&g.k==='game'&&g.fix&&!g.end&&!g.sheet){const q=q1(),mid=document.querySelector('.game .gmid'),bot=document.querySelector('.game .gbot');
  if(mid&&!mid.querySelector('.gdprev')&&(q.gdOld||q.gdWa||q.gdFrom)&&!g.gdRedo){const t=q.gdOld?(q.gdWa?`Lần trước${q.gdFrom?` (trò ${q.gdFrom})`:''} em ${q.type==='num'?'ghi':'chọn'} <b>${esc(q.gdWa)}</b>, chưa đúng. Em làm lại nhé!`:`Lần trước${q.gdFrom?` (trò ${q.gdFrom})`:''} em làm sai câu này. Em làm lại nhé!`):`Câu giống vậy, số mới. Em làm nhé!`;
   mid.insertAdjacentHTML('afterbegin',`<div class="gdprev">${spr('book',18)}<span>${t}</span></div>`)}
  else if(mid&&!mid.querySelector('.gdprev')&&!q.gdOld&&!g.gdRedo&&g.j%2===1)mid.insertAdjacentHTML('afterbegin',`<div class="gdprev sim">${spr('book',18)}<span>Câu giống vậy, số mới. Em làm nhé!</span></div>`);
  if(bot&&!bot.querySelector('.gdsee')&&gdKind(q))bot.insertAdjacentHTML('afterbegin',`<button type="button" class="gdsee" onclick="gdOpen(q1())">${spr('bulb',16)} Xem cách làm</button>`)}}catch(e){}return r})}
/* trong Luyện lỗi không mất tim: sửa câu chữ của thẻ "Chưa đúng" */
{const _sh=hooks.cu('sheet1');hooks.de('sheet1',function(){let h=_sh();try{if(scr&&scr.fix)h=h.replace('Chưa đúng, mất 1 tim.','Chưa đúng.')}catch(e){}return h})}
document.head.insertAdjacentHTML('beforeend',`<style>
.gdprev{display:flex;gap:8px;align-items:center;font-family:var(--f-body);font-size:14px;line-height:1.35;background:#FFF4D6;color:#7A4E00;padding:6px 10px;box-shadow:0 0 0 2px #FCB40C}
.gdprev.sim{background:#DDF3FB;color:#1F2A5A;box-shadow:0 0 0 2px #3FC1EC}.gdprev b{color:#E0441A}
.gdsee{display:flex;align-items:center;gap:6px;margin:0 auto 10px;font-family:var(--f-body);font-weight:700;font-size:14px;padding:6px 12px;background:#fff;color:#1F2A5A;border:0;box-shadow:0 0 0 2px #1F2A5A,0 3px 0 2px #1F2A5A;cursor:pointer}
</style>`);
