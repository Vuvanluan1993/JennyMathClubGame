/* 46 — Bắt buộc luyện lỗi + bản đồ về đúng chỗ (thầy chọn 20/10)
   1) Câu sai trong màn học hoặc trò chơi được gom vào st.gate. Xong màn/trò đó, muốn chơi màn hay trò khác thì phải
      luyện một lượt các lỗi vừa mắc (đúng, hoặc xem hướng dẫn rồi làm lại). Làm hết lượt là mở; lỗi chưa đúng 2 lần
      vẫn nằm trong sổ để luyện tiếp sau.
   2) Bản đồ: đi từ tab khác (Toán Jenny, Luyện lỗi, Sưu tập, Hồ sơ) về thì về đúng chỗ "Đang học";
      từ trong đảo về thì về đúng đảo vừa vào (đã có ở 39m). */
import { hooks } from './00-hooks.js';
import { save } from './09-du-lieu-demo.js';
import { go, render, toast } from './13-giao-dien-chung.js';
import { mist } from './21-lop-6-che-do-tro-choi.js';
import { pixelize, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { isl1, sayJ } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { curG, startJ1 } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { gdTxt } from './40-huong-dan-khi-sai.js';
const gateOf=()=>{const st=S.st[sid];return st?(st.gate=st.gate||[]):[]};
function gateAdd(q){try{if(role!=='hs'||!q||!q.key||curG()>5)return;const G=gateOf();if(!G.includes(q.key))G.push(q.key)}catch(e){}}
/* ghi lỗi vào cổng: cùng chỗ với sổ lỗi (màn học: lần sai đầu; trò chơi: xgRec) */
{const _m=hooks.cu('mist1Add');hooks.de('mist1Add',function(q){const r=_m.apply(this,arguments);try{const g=scr;if(g&&!g.fix&&!g.race&&!g.tre&&!g.cbo)gateAdd(q)}catch(e){}return r})}
function gateOpen(){const st=S.st[sid];if(!st||role!=='hs')return false;const M=mist(st);st.gate=gateOf().filter(k=>M[k]);return st.gate.length>0}
function gateAsk(){const n=gateOf().length,el=document.createElement('div');el.className='gdov';el.id='gateov';
 el.innerHTML=`<div class="gdbox gatebox"><div class="gdhd"><b>${spr('book',20)} Luyện lỗi trước nhé</b><button type="button" class="gdx" onclick="this.closest('.gdov').remove()" aria-label="Đóng">✕</button></div>
  <div class="gatebd">${jenny(64)}<p>Em vừa làm sai <b>${n} câu</b>. Mình luyện lại một lượt các câu đó rồi chơi tiếp nhé!</p></div>
  <div class="gdctl"><button type="button" class="gdgo" onclick="this.closest('.gdov').remove();startGateFix()">Luyện ngay ▶</button></div></div>`;
 document.body.appendChild(el);try{pixelize(el)}catch(e){}try{sayJ(`Em vừa làm sai ${n} câu. Mình luyện lại một lượt rồi chơi tiếp nhé!`)}catch(e){}}
function startGateFix(){const st=S.st[sid],M=mist(st),keys=gateOf().filter(k=>M[k]);if(!keys.length){st.gate=[];save();toast('Không còn lỗi nào cần luyện. Giỏi lắm!');render();return}
 const E=keys.map(k=>M[k]),mk=e=>{const x=isl1(e.id);const q=x.lv[e.lv][e.gi]();return{...q,src:[e.id,e.lv,e.gi],key:`${e.id}:${e.lv}:${e.gi}`,label:e.label}};
 const old=e=>e.q?{...e.q,src:[e.id,e.lv,e.gi],key:`${e.id}:${e.lv}:${e.gi}`,label:e.label,gdWa:e.wa||'',gdFrom:e.from||'',gdOld:1}:{...mk(e),gdOld:0};
 const two=E.length<=3,qs=E.flatMap(e=>{const a=old(e);if(!two)return[a];let b=mk(e);for(let t=0;t<10&&gdTxt(b.q)+String(b.pic||'')===gdTxt(a.q)+String(a.pic||'');t++)b=mk(e);return[a,b]});
 v1Said='';go({k:'game',g1:1,fix:1,gate:1,id:E[0].id,lv:0,qs,j:0,hearts:3,ok:0,tries:0,res:[],sheet:null,picks:[],seq:[],fill:[],used:[],cnt:0,hp:0,fixed:0,t0:Date.now()})}
/* làm hết một lượt luyện lỗi thì mở khoá */
{const _e=hooks.cu('endFix1');hooks.de('endFix1',function(){try{if(scr&&scr.fix&&!scr.lz){const st=S.st[sid],done=new Set(scr.qs.map(q=>q.key));st.gate=gateOf().filter(k=>!done.has(k))}}catch(e){}return _e.apply(this,arguments)})}
/* chặn bắt đầu màn/trò khác khi còn lỗi chưa luyện */
/* 24/10/2026 (thầy chốt): luyện lỗi KHÔNG bắt buộc nữa — chỉ bắt buộc khi cô giao (bài về nhà). Giữ nút luyện lại tự chọn ở màn kết thúc. */
export const gateWrap=f=>function(){return f.apply(this,arguments)};
hooks.de('startG1',gateWrap(hooks.cu('startG1')));hooks.de('startXG',gateWrap(hooks.cu('startXG')));hooks.de('startMini',gateWrap(hooks.cu('startMini')));hooks.de('startRace',gateWrap(hooks.cu('startRace')));
try{if(typeof startJ1==='function')hooks.de('startJ1',gateWrap(hooks.cu('startJ1')))}catch(e){}
/* màn hình kết thúc có lỗi: nút Luyện lỗi đứng đầu */
{const _a=hooks.cu('g1AfterRender');hooks.de('g1AfterRender',function(){const r=_a.apply(this,arguments);try{const g=scr;if(g&&(g.end)&&!g.fix&&gateOpen()){const box=document.querySelector('.gend .gendbtn')||document.querySelector('.gend');if(box&&!document.querySelector('.gatebtn')){const n=gateOf().length;
  box.insertAdjacentHTML('afterbegin',`<div class="gatenote">${spr('book',18)} Em vừa sai ${n} câu. Em có thể luyện lại ngay (không bắt buộc).</div><button type="button" class="gobtn gatebtn" onclick="startGateFix()">Luyện lại câu sai (${n}) ▶</button>`)}}}catch(e){}return r})}
/* trò chơi kết thúc (màn hình điểm của trò chơi): cũng hiện nút luyện lỗi */
{const _r=hooks.cu('render');hooks.de('render',function(){const r=_r.apply(this,arguments);try{const g=scr;if(g&&(g.k==='xg'||g.k==='mini')&&g.end&&gateOpen()){const box=document.querySelector('.gend .gendbtn')||document.querySelector('.gend');if(box&&!document.querySelector('.gatebtn')){const n=gateOf().length;
  box.insertAdjacentHTML('afterbegin',`<div class="gatenote">${spr('book',18)} Em vừa sai ${n} câu. Em có thể luyện lại ngay (không bắt buộc).</div><button type="button" class="gobtn gatebtn" onclick="startGateFix()">Luyện lại câu sai (${n}) ▶</button>`)}}}catch(e){}return r})}
/* bản đồ: từ tab khác về thì về "Đang học" */
{const _go=hooks.cu('go');hooks.de('go',function(s){try{if(s&&s.k==='home'&&s.tab&&s.tab!=='map'){MAP_TI=null;MAP_ID=null}}catch(e){}return _go.apply(this,arguments)})}
document.head.insertAdjacentHTML('beforeend',`<style>
.gatebd{display:flex;gap:12px;align-items:center;padding:14px;background:linear-gradient(#FFF4D6,#FFE9B8);border-bottom:3px solid #1F2A5A}.gatebd p{margin:0;font-family:var(--f-body);font-size:16px;line-height:1.4}
.gatenote{display:flex;gap:8px;align-items:center;font-family:var(--f-body);font-size:14px;background:#FFF4D6;color:#7A4E00;padding:8px 10px;box-shadow:0 0 0 2px #FCB40C;margin-bottom:6px;text-align:left}
</style>`);
