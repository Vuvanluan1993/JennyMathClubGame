/* ===================== LEO NÚI TÌM KHO BÁU (mode 'climb') ===================== */
/* Dành cho các tiết TOÁN CÓ LỜI VĂN. Cảnh pixel 114×84 (phóng ×3): ngọn núi cao 6 chặng (trại) + đỉnh có rương báu.
   Mỗi câu đúng: Jenny đeo ba lô leo dây lên chặng kế tiếp, cảnh cuộn lên (mây ở dưới, đại bàng bay qua, gần đỉnh có tuyết,
   trời ngả hoàng hôn), bảng "Chặng n/6 ✓". Sai 1 lần: đá lăn, Jenny trượt chân nhẹ, đáp án sai bị khoá.
   Sai 2 lần: Jenny ngồi nghỉ ở trại, hiện đáp án đúng và lời giải ngắn, sang bài khác (không mất chặng nào).
   Lên đỉnh: mở rương (vàng, đá quý, huy hiệu "Nhà leo núi"), pháo giấy. 300 giây. Không có tim.
   Nội dung: bài toán lời văn của chính đảo, thiếu thì lấy của 1–4 đảo trước (cùng lớp), luôn lọc theo kiến thức đã học (39e). */
import { hooks } from './00-hooks.js';
import { pick } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { addCoins } from './11-sao-va-mo-khoa.js';
import { go, render } from './13-giao-dien-chung.js';
import { shuf } from './21-lop-6-che-do-tro-choi.js';
import { pixelize, PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { pxCanvas } from './23-bien-pixel-dong-phia-sau-ban-do.js';
import { isl1, sayJ } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { curG } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { fN } from '../content/hk1/28-chu-de-3-lop-1-5.js';
import { mkQ } from './31-5-tinh-nang-choi-them-tieu-hoc.js';
import { islPool } from './32-tinh-nang-choi-them-dat-trong-tung-dao.js';
import { sfx } from './33b-am-thanh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { jOutfit, ofVariant } from './33e-ho-chieu.js';
import { stopXG, XGN, xgRec, xgTxt } from './37-tro-choi-dot-1.js';
import { xgTxt2 } from './38-tro-choi-dot-2.js';
import { frogQ, xcv, xgGr, xpx } from './39-tro-choi-dot-3.js';
import { XG_ALL } from './39c-can-bang-tro-choi.js';
import { ktClean, ktOf, ktPrev, ktViol, XG_BIAS } from './39e-kien-thuc-tro-choi.js';
PXS.climbI=["........r.......","........rr......","........rrr.....","........k.......",".......kek......","......kewek.....",".....kemwwek....","....kemmeeeek...","...kemmmmmmeek..","..kEmmmEmmmmmek.",".kEEmmEEEmmmmmek","kEEEEEEEEEEEEEEk","kkkkkkkkkkkkkkkk"];
PXS.climbChest=["..kkkkkkkk..",".kaaaaaaaak.","kaTTTTTTTTak","kkkkkkkkkkkk","kaaaayyaaaak","kTTTykkyTTTk","kaaaayyaaaak","kTTTTTTTTTTk","kkkkkkkkkkkk"];
PXS.climbBadge=[".kr.....bk..",".krr...bbk..","..krr.bbk...","...krbbk....","...kkkkkk...","..kaaaaaak..",".kayywyyyak.",".kaywwwyyak.","kaywwwwwyyak",".kayywwyyak.",".kaywyywyak.","..kaaaaaak..","...kkkkkk..."];
Object.assign(XGN,{climb:['climbI','Leo núi tìm kho báu','Giải bài toán lời văn để leo 6 chặng, lên đỉnh mở rương báu']});
if(!XG_ALL.includes('climb'))XG_ALL.push('climb');

/* ---------- nội dung: bài toán lời văn ---------- */
export const CLIMB_N=5,CLIMB_T=300;
function climbIsWord(q){if(!q||!(q.type==='num'||q.type==='opt'))return false;if(q.type==='opt'&&!(q.opts&&q.opts[q.a]))return false;
  const t=ktClean(q.q);if(t.length<26||!/\d/.test(t))return false;
  if(/lời văn|bài toán|hơn, kém|bài toán/i.test(q.kind||'')&&/[?.]/.test(t))return true;
  return /(Hỏi|bao nhiêu|tất cả|còn lại|mỗi|có mấy|được mấy)/i.test(t)&&/(có|mua|cho|xếp|chia|thêm|bớt|bay|cần|được|đựng|trồng|chở|nuôi|hái|đi|chạy|làm|cắt|may|dài|nặng)/i.test(t)&&t.split(/[.?!]\s/).length>=2}
const climbUnit=q=>{const s=ktClean(q.sol||'').trim(),m=s.match(/\(([^()]{1,16})\)\s*\.?\s*$/);return m&&!/[\d=+−×:]/.test(m[1])?m[1].trim():''};
function climbNear(q,a,K){const s=ktClean(q.sol||''),m=s.match(/(\d[\d ]*)\s*([+−\-×:])\s*(\d[\d ]*)/),c=[];
  if(m){const x=+m[1].replace(/\s/g,''),y=+m[3].replace(/\s/g,''),op=m[2];const w=op==='+'?Math.abs(x-y):op==='×'?x+y:op===':'?x*y:x+y;if(w!==a)c.push(w)}
  [a+1,a-1,a+10,a-10,a+2,a*2,a+5].forEach(v=>c.push(v));
  const max=K&&K.max<1e12&&a<=K.max?K.max:Infinity;return[...new Set(c)].filter(v=>Number.isInteger(v)&&v>=0&&v!==a&&v<=max)}
/* biến câu hỏi của đảo thành bài leo núi: {t, pic, opts[html], a, q, sol} */
function climbFromQ(q,K){if(!climbIsWord(q))return null;let opts,a;
  if(q.type==='num'){const v=+q.a;if(!Number.isFinite(v)||v<0)return null;const u=climbUnit(q),near=climbNear(q,v,K);if(near.length<2)return null;
    const d=[near[0],near[1+Math.floor(Math.random()*Math.min(3,near.length-1))]];const all=shuf([v,...d]);opts=all.map(n=>fN(n)+(u?' '+u:''));a=all.indexOf(v)}
  else{const c=q.opts[q.a].h,others=shuf(q.opts.filter((_,i)=>i!==q.a)).slice(0,3).map(o=>o.h);const all=shuf([c,...others]);opts=all;a=all.indexOf(c)}
  const pic=q.pic?String(q.pic):'';
  return{t:String(q.q).replace(/<svg[\s\S]*?<\/svg>/gi,''),pic,opts,a,q,sol:String(q.sol||'')}}
function climbQ(...a){return hooks.goi('climbQ',this,a)}
hooks.ham('climbQ',function(x,seen){const K=ktOf(x),G=xgGr(x);seen=seen||new Set();
  for(const y of [x,...ktPrev(x,4)]){const pool=islPool(y);for(let i=0;i<60&&pool.length;i++){let q;try{q=mkQ(pick(pool))}catch(e){continue}
    const f=climbFromQ(q,K);if(!f)continue;const key=ktClean(f.t);if(seen.has(key))continue;
    if(ktViol(K,f.t+' | '+f.opts.join(' | ')).length)continue;seen.add(key);return f}}
  const f=frogQ(x);return{t:f.t,pic:'',opts:f.opts,a:f.a,q:f.q,sol:''}});
/* có bài lời văn (của đảo hoặc 1–4 đảo trước) trong phạm vi kiến thức? */
const CLIMB_HAS={},CLIMB_OWN={};
function climbScan(y,K,n){const pool=islPool(y);let c=0;for(let i=0;i<n&&pool.length;i++){let q;try{q=mkQ(pick(pool))}catch(e){continue}const f=climbFromQ(q,K);if(f&&!ktViol(K,f.t+' | '+f.opts.join(' | ')).length)c++}return c}
function climbHas(x){if(x.id in CLIMB_HAS)return CLIMB_HAS[x.id];const K=ktOf(x);let ok=false;for(const y of [x,...ktPrev(x,4)]){if(climbScan(y,K,24)>=1){ok=true;break}}return CLIMB_HAS[x.id]=ok}
function climbOwn(x){if(x.id in CLIMB_OWN)return CLIMB_OWN[x.id];const K=ktOf(x),t=xgTxt2(x);return CLIMB_OWN[x.id]=climbScan(x,K,30)>=3||(/lời văn|bài toán|giải toán/i.test(t)&&climbScan(x,K,30)>=1)}
/* chọn trò: chỉ cho đảo có bài lời văn; "đúng nội dung" khi chính đảo có nhiều bài lời văn */
{const _a=hooks.cu('ktAllowed');hooks.de('ktAllowed',function(x,mode){if(mode!=='climb')return _a.apply(this,arguments);return climbHas(x)&&_a.call(this,x,'climb')})}
{const _o=hooks.cu('ktOwn');hooks.de('ktOwn',function(x,mode){if(mode!=='climb')return _o.apply(this,arguments);return climbOwn(x)})}
{const _e=hooks.cu('xgElig');hooks.de('xgElig',function(x){const r=_e.apply(this,arguments);if(r&&r.E&&!r.E.includes('climb')&&climbHas(x))r.E.push('climb');return r})}
{const _s=hooks.cu('ktSample');hooks.de('ktSample',function(x,mode,n){if(mode!=='climb')return _s.apply(this,arguments);const out=[],prev=XG_KT;XG_KT=ktOf(x);try{const seen=new Set();for(let i=0;i<(n||5);i++){const f=climbQ(x,seen);out.push(f.t+' | '+f.opts.join(' | '))}}catch(e){out.push('LỖI '+e.message)}XG_KT=prev;return out})}
XG_BIAS.climb={1:-4,2:-8,3:-6,4:-6,5:-8};

/* ---------- bắt đầu ---------- */
{const _s=hooks.cu('startXG');hooks.de('startXG',function(mode,id){if(mode!=='climb')return _s.apply(this,arguments);try{speechSynthesis.cancel()}catch(e){}const x=isl1(id);XG_KT=x?ktOf(x):null;
  const seen=new Set();go({k:'xg',mode:'climb',id,score:0,stage:0,lives:3,end:false,started:false,t:CLIMB_T,ph:'ask',pt:0,seen,q:x?climbQ(x,seen):null,tries:0,bad:[],rest:0,miss:0,
    say:'Leo núi tìm kho báu! Mỗi bài toán em giải đúng, Jenny leo lên một chặng. Leo đủ sáu chặng là tới đỉnh mở rương báu nhé.'})})}
/* ---------- màn hình ---------- */
{const _v=hooks.cu('viewXG');hooks.de('viewXG',function(){const g=scr;if(g.mode!=='climb')return _v.apply(this,arguments);const st=S.st[sid],best=Math.max((st.mg||{})[`${g.id}:climb`]||0,g.score);
  if(g.end){const rec=g.score>(g.prev||0)&&g.score>0;
    return`<div class="game g1"><div class="gend xgend"><div class="xgendrow"><span class="bigicon">${spr(g.win?'climbChest':'climbI',72)}</span>${jenny(72,g.score?'cheer':'sad')}</div><h1>${g.win?'Tới đỉnh núi rồi!':rec?'Kỷ lục mới!':'Hết giờ!'}</h1>
     <p class="muted">Leo được <b>${g.score}</b>/${CLIMB_N} chặng · kỷ lục ${best}</p>${g.win?`<div class="xcbadge">${spr('climbBadge',48)}<span><b>Huy hiệu Nhà leo núi</b><small>Em đã giải 6 bài toán lời văn!</small></span></div>`:''}${g.coins?`<p class="earn">+${g.coins} xu</p>`:''}
     <div class="gendbtn"><button class="gobtn" type="button" onclick="startXG('climb','${g.id}')">Chơi lại</button><button class="gobtn ghost" type="button" onclick="go({k:'island',id:'${g.id}'})">Về đảo</button></div></div></div>`}
  return`<div class="game g1 mini xg xclimb"><div class="gtop"><button class="gx" onclick="stopXG();go({k:'island',id:'${g.id}'})" aria-label="Thoát">✕</button><span class="mgsc xcflags" id="xcbar" aria-label="Đã leo ${g.score}/${CLIMB_N} chặng">${climbBar(g)}</span><span class="grow"></span><span class="mgsc">${spr('clock',22)} <b id="xctm">${g.t}</b></span></div>
   <div class="mgrule"><span id="xcst">${climbStatus(g)}</span><button class="g1spk" type="button" onclick="climbSpeak()" aria-label="Nghe đọc đề">🔊</button></div>
   <div class="xct" id="xct"><canvas class="xpcv" id="xccv" width="114" height="84" aria-hidden="true"></canvas><span class="xcban" id="xcban"></span></div>
   <div class="xcq" id="xcq"></div><div id="xgfb" class="xgfb"></div></div>`})}
function climbBar(g){return Array.from({length:CLIMB_N},(_,i)=>`<i class="${i<g.score?'on':''}"></i>`).join('')}
function climbStatus(g){return g.ph==='ask'?(g.tries?'<b>Cẩn thận!</b> Đọc lại đề rồi thử lại nhé':`Giải bài toán để leo <b>chặng ${g.score+1}/${CLIMB_N}</b>`):g.ph==='climb'?'<b>Jenny đang leo…</b>':g.ph==='slip'?'<b>Đá lăn!</b> Cẩn thận!':g.ph==='rest'?'<b>Nghỉ ở trại</b> · xem lời giải':g.ph==='chest'?'<b>Tới đỉnh!</b> Mở rương báu':''}
const climbSayText=q=>q?(q.q&&q.q.say?q.q.say:xgTxt(q.t)):'';
function climbSpeak(){const g=scr;try{sayJ(g.ph==='ask'&&g.q?climbSayText(g.q):g.say)}catch(e){}}
function climbUI(){const g=scr;if(g.k!=='xg'||g.mode!=='climb'||g.end)return;const $=id=>document.getElementById(id);
  const st=$('xcst');if(st)st.innerHTML=climbStatus(g);const b=$('xcbar');if(b){b.innerHTML=climbBar(g);b.setAttribute('aria-label',`Đã leo ${g.score}/${CLIMB_N} chặng`)}
  const qb=$('xcq');if(!qb)return;
  if((g.ph==='ask'||g.ph==='slip'||g.ph==='rest')&&g.q){const q=g.q,four=q.opts.length>3;
    qb.innerHTML=`<div class="xcqt"><span class="xcqn">Bài ${g.score+1}</span>${q.t}${q.pic?`<div class="xcpic">${q.pic}</div>`:''}</div>
     <div class="xcopts ${four?'c2':''}">${q.opts.map((o,i)=>`<button type="button" class="xco ${g.ph==='rest'&&i===q.a?'right':''}" ${g.bad.includes(i)||g.ph==='rest'?'disabled':''} onclick="climbAns(${i})"><b>${o}</b></button>`).join('')}</div>`;try{pixelize(qb)}catch(e){}}
  else qb.innerHTML=''}

/* ---------- cảnh: núi dựng sẵn một lần, mỗi khung chỉ vẽ trời, mây, chim, Jenny, rương ---------- */
const CW=114,CH=84,CWH=CH+CLIMB_N*34,CPK=50;   /* chiều cao "thế giới", đỉnh núi */
const climbLY=i=>CWH-12-i*34,climbLX=i=>i>=CLIMB_N?57:(i%2?74:40);
const CLIMB_SKY=['#BFE9F8','#B3E3F7','#A6DCF4','#9DD3F0','#F2DE9E','#F5C08F','#E99A8B'];
let CLIMB_WORLD=null;
function climbWorld(){if(CLIMB_WORLD)return CLIMB_WORLD;const c=document.createElement('canvas');c.width=CW;c.height=CWH;const x=c.getContext('2d'),p=xpx(x);
  const hn=(a,b)=>{let h=(a*73856093)^(b*19349663);h=(h^(h>>13))*1274126177;return((h^(h>>16))>>>0)%1000/1000};
  const hw=y=>y<CPK?-1:4+(y-CPK)*.19+1.8*Math.sin(y/6.3)+1.1*Math.sin(y/2.7);
  const RL='#B08A6A',RM='#8C6A52',RD='#64493A',SN='#D6DEEC';
  for(let y=CPK;y<CWH;y++){const w=hw(y),L=Math.round(57-w),R=Math.round(57+w*.96+1.5*Math.sin(y/4.1));
    for(let X=Math.max(0,L);X<=Math.min(CW-1,R);X++){const edge=X===L||X===R,rel=(X-L)/Math.max(1,R-L),n=hn(X,y);let c;
      const snow=y<CPK+40+Math.round(4*Math.sin(X/5)),grass=y>CWH-28+Math.round(3*Math.sin(X/4));
      const band=Math.floor((y+Math.round(3*Math.sin(X/7)))/7)%3===0;
      if(edge)c='k';else if(snow)c=rel>.66?SN:(n<.05?SN:'w');else if(grass)c=n<.12?'G':(rel>.66?'G':'g');
      else if(rel>.7)c=n<.06?RM:RD;else if(rel<.16)c=n<.08?RM:RL;else c=band?(n<.3?RD:RM):(n<.03?RL:RM);
      p(c,X,y)}
    /* mép tuyết lởm chởm */}
  /* tảng đá */ for(let i=0;i<12;i++){const y=CPK+52+Math.floor(hn(i,7)*(CWH-CPK-84)),w=hw(y),X=Math.round(57-w*.6+hn(i,3)*w*1.1);p(RL,X,y,4,2);p(RD,X,y+2,4,1)}
  for(let i=0;i<10;i++){const y=CWH-26+Math.floor(hn(i,11)*20),X=Math.floor(hn(i,13)*110);p('G',X,y,4,3);p('g',X+1,y,2,1)}
  /* dây leo giữa các chặng (dây + nút thắt) */
  for(let i=0;i<CLIMB_N;i++){const x0=climbLX(i),y0=climbLY(i)-2,x1=climbLX(i+1),y1=climbLY(i+1)-2,N=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));
    for(let k=0;k<=N;k++){const X=Math.round(x0+(x1-x0)*k/N),Y=Math.round(y0+(y1-y0)*k/N);p('t',X,Y,1,1);p('u',X+1,Y,1,1);if(k%5===0)p('N',X,Y,2,1)}}
  /* các chặng (bệ đá + lều / cờ), trại gốc có biển */
  for(let i=0;i<=CLIMB_N;i++){const X=climbLX(i),Y=climbLY(i),h=i>=CLIMB_N?16:11;p('k',X-h,Y,h*2,1);p('u',X-h+1,Y+1,h*2-2,2);p('N',X-h+1,Y+3,h*2-2,1);p('k',X-h,Y+1,1,3);p('k',X+h-1,Y+1,1,3);
    if(i===0){p('N',X-9,Y-9,1,9);p('t',X-12,Y-11,8,4);p('k',X-12,Y-12,8,1);p('n',X-11,Y-10,6,1)}
    else if(i<CLIMB_N){const tc=['r','b','o','p','c'][i%5],dx=i%2?6:-9;for(let r=0;r<5;r++)p(tc,X+dx+2-r,Y-1-r,1+r*2,1);p('k',X+dx+2,Y-6,1,1);p('k',X+dx,Y-1,4,1);p('N',X+dx+2,Y-3,1,2)}}
  return CLIMB_WORLD=c}
function climbJ(g,now){/* vị trí Jenny trong thế giới */const L=i=>[climbLX(i)-(i>=CLIMB_N?12:4),climbLY(i)-17];
  if(g.ph==='climb'){const t=Math.min(1,(now-g.pt)/1300),s=Math.floor(t*12)/12,[x0,y0]=L(g.stage),[x1,y1]=L(g.stage+1);return[x0+(x1-x0)*s,y0+(y1-y0)*s-((Math.floor(t*12))%2),t]}
  const [x,y]=L(g.stage);return[x,y+(g.ph==='slip'&&now-g.pt<700?((Math.floor((now-g.pt)/90))%2?2:1):0),1]}
function climbDraw(){const x=xcv('xccv');if(!x)return;const g=scr,p=xpx(x),now=performance.now(),f=Math.floor(now/120);
  const [jx,jy]=climbJ(g,now),target=Math.max(0,Math.min(CWH-CH,jy-48));g.cam=g.cam==null?target:g.cam+(target-g.cam)*.25;if(Math.abs(target-g.cam)<.5)g.cam=target;const cam=Math.round(g.cam);
  /* trời đổi dần theo độ cao; gần đỉnh ngả hoàng hôn */const S=Math.min(CLIMB_N,g.stage+(g.ph==='climb'?1:0));p(CLIMB_SKY[S],0,0,CW,CH);
  const sx=S>=4?84:12+S*14,sy=S>=4?14+(S-4)*6:6;p(S>=4?'o':'y',sx,sy,6,6);p(S>=4?'O':'a',sx+1,sy+5,5,1);
  /* mây xa (trôi) */ [[0,30],[1,46]].forEach(([i,Y])=>{const cx=Math.round((f*(.3+i*.15)+i*60)%150-24);p('w',cx,Y,15,3);p('w',cx+4,Y-2,7,2)});
  x.drawImage(climbWorld(),0,-cam);
  /* mây trôi lưng chừng núi (ở dưới khi đã leo cao) */ [[CWH-150,.4],[CWH-205,.25],[CWH-95,.3]].forEach(([wy,v],i)=>{const vy=wy-cam;if(vy<-6||vy>CH)return;const cx=Math.round((f*v+i*45)%160-30);x.globalAlpha=.85;p('w',cx,vy,20,4);p('w',cx+5,vy-3,10,3);p('e',cx,vy+3,20,1);x.globalAlpha=1});
  /* đại bàng bay qua từ chặng 2 */ if(S>=2){const T=(now/1000)%9;if(T<4.5){const ex=Math.round(-12+T/4.5*140),ey=14+Math.round(Math.sin(T*3)*3),w=f%2;p('N',ex,ey,5,2);p('k',ex+5,ey,2,1);p('y',ex+7,ey,1,1);p('N',ex-3,ey-1-w*2,3,1);p('N',ex+2,ey-1-w*2,3,1);p('w',ex+4,ey-1,2,1)}}
  /* tuyết bay khi gần đỉnh */ if(S>=4)for(let i=0;i<14;i++){const X=(i*29+f*2)%CW,Y=(i*17+f*3)%CH;p('w',X,Y,1,1)}
  /* rương ở đỉnh */ const kx=climbLX(CLIMB_N)+4,ky=climbLY(CLIMB_N)-9-cam;
  if(g.ph==='chest'){const t=now-g.pt;x.drawImage(pxCanvas('climbChest'),kx,ky);if(t>300){p('k',kx,ky-4,12,4);p('a',kx+1,ky-3,10,2);/* nắp mở */
      for(let i=0;i<18;i++){const a=i*0.35,r=Math.min(26,(t-300)/40),X=Math.round(kx+6+Math.cos(a)*r*(.5+(i%3)*.25)),Y=Math.round(ky-2-Math.abs(Math.sin(a))*r+Math.max(0,(t-1200)/60));if(Y<CH)p(['y','a','c','b','g','w'][i%6],X,Y,2,2)}}
    /* pháo giấy */ for(let i=0;i<40;i++){const X=(i*37+Math.floor(t/30)*(1+i%3))%CW,Y=((i*13)+Math.floor(t/25)*(1+i%2))%CH;p(['r','y','b','g','p','c'][i%6],X,Y,1+(i%2),1)}}
  else{x.drawImage(pxCanvas('climbChest'),kx,ky);if(f%6<3){p('y',kx+12,ky-2,1,3);p('y',kx+11,ky-1,3,1)}}
  /* cờ đỉnh núi */ const fx=climbLX(CLIMB_N)-15,fy=climbLY(CLIMB_N)-15-cam;p('k',fx,fy,1,14);p('r',fx+1,fy,6-(f%2),3);p('R',fx+1,fy+3,5,1);
  /* đá lăn khi sai lần 1 */ if(g.ph==='slip'){const t=Math.min(1,(now-g.pt)/650),rx=Math.round(jx+10+(t>.7?(t-.7)*40:0)),ry=Math.round(-6+(jy-cam-2)*Math.min(1,t/.7)+(t>.7?-(t-.7)*10:0));p('k',rx,ry+1,7,5);p('k',rx+1,ry,5,7);p('E',rx+1,ry+1,5,5);p('m',rx+1,ry+1,2,2);p('w',rx+1,ry+1,1,1);if(t>.7){p('m',rx-3,ry+6,2,1);p('m',rx+8,ry+5,2,1)}}
  /* Jenny + ba lô */ const vx=Math.round(jx),vy=Math.round(jy-cam);x.drawImage(pxCanvas(typeof ofVariant==='function'&&typeof jOutfit==='function'?ofVariant('jenny',jOutfit()):'jenny'),vx,vy);
  p('k',vx-3,vy+11,4,6);p('o',vx-2,vy+12,2,4);p('O',vx-2,vy+15,2,1);
  if(g.ph==='rest'){/* ngồi nghỉ: ấm trà bốc hơi */const hx=vx+18,hy=vy+13;p('k',hx,hy,5,4);p('b',hx+1,hy+1,3,2);if(f%4<2){p('w',hx+1,hy-2,1,1);p('w',hx+3,hy-4,1,1)}}
  if(g.ph==='climb'&&(f%2))p('w',vx+2,vy+18,2,1)}
/* ---------- điều khiển ---------- */
function climbLoop(){const g=scr;stopXG();let sec=performance.now();
  xgLoop={tick:setInterval(()=>{if(scr!==g||g.end||!document.getElementById('xccv')){stopXG();return}const now=performance.now();
    if(now-sec>=1000){sec=now;if(g.ph!=='chest'&&g.ph!=='rest'){g.t--;const e=document.getElementById('xctm');if(e)e.textContent=g.t;if(g.t>0&&g.t<=10)sfx('tick');if(g.t<=0){climbEnd();return}}}
    climbDraw()},120)}}
function climbNext(g){g.ph='ask';g.pt=performance.now();g.q=climbQ(isl1(g.id),g.seen);g.tries=0;g.bad=[];g.lockA=0;const fb=document.getElementById('xgfb');if(fb)fb.innerHTML='';climbUI();
  const qb=document.getElementById('xcq');if(qb)try{qb.animate([{transform:'translateY(30px)',opacity:0},{transform:'none',opacity:1}],{duration:400,easing:'steps(4)'})}catch(e){}
  try{if(curG()<=2)sayJ(climbSayText(g.q))}catch(e){}}
function climbBanner(t){const b=document.getElementById('xcban');if(b){b.textContent=t;b.classList.remove('on');void b.offsetWidth;b.classList.add('on')}}
function climbAns(i){const g=scr;if(g.k!=='xg'||g.mode!=='climb'||g.end||g.ph!=='ask'||g.lockA)return;const q=g.q,ok=i===q.a;
  xgRec(ok,g.tries===0&&q.q?q.q:g.tries===0?{kind:'Toán lời văn'}:null);g.tries++;const fb=document.getElementById('xgfb');
  if(ok){g.lockA=1;g.ph='climb';g.pt=performance.now();sfx('ok');if(fb)fb.innerHTML='<span class="ok">Đúng rồi! Jenny leo lên nào!</span>';climbUI();
    const tk=setInterval(()=>{if(scr!==g||g.ph!=='climb'){clearInterval(tk);return}sfx('tick')},220);
    setTimeout(()=>{clearInterval(tk);if(scr!==g||g.end)return;g.stage++;g.score++;sfx('star');climbBanner(g.score>=CLIMB_N?'Tới đỉnh núi! ✓':`Chặng ${g.score}/${CLIMB_N} ✓`);
      if(g.score>=CLIMB_N){g.ph='chest';if(fb)fb.innerHTML='<span class="ok">Mở rương báu nào!</span>';g.pt=performance.now();climbUI();setTimeout(()=>sfx('chest'),300);setTimeout(()=>sfx('win'),900);setTimeout(()=>{if(scr===g&&!g.end)climbEnd()},3400);return}
      g.ph='wait';climbUI();setTimeout(()=>{if(scr===g&&!g.end)climbNext(g)},1100)},1350);return}
  sfx('bad');if(g.tries<2){g.bad.push(i);g.ph='slip';g.pt=performance.now();if(fb)fb.innerHTML='<span class="bad">Cẩn thận! Đá lăn rồi. Đọc lại đề và thử lại nhé.</span>';climbUI();try{navigator.vibrate&&navigator.vibrate(80)}catch(e){}
    setTimeout(()=>{if(scr===g&&!g.end&&g.ph==='slip'){g.ph='ask';climbUI()}},700);return}
  g.lockA=1;g.ph='rest';g.pt=performance.now();g.miss++;const L=climbSol(q);
  if(fb)fb.innerHTML=`<div class="xcsolbox"><div class="xcsolh">Jenny nghỉ ở trại. Cùng xem bài giải nhé!</div><div class="xcsolc">${L.lead?`<div>${L.lead}</div>`:''}${L.lines.map(l=>`<div class="xcln">${l}</div>`).join('')}</div><button type="button" class="gobtn xcgo" onclick="climbGoOn()">Em hiểu rồi, leo tiếp ▶</button></div>`;climbUI();
  try{sayJ(`Cùng xem bài giải nhé. ${L.say}`)}catch(e){}}
/* bài giải có câu dẫn: lấy từ câu hỏi "Hỏi … bao nhiêu …?" → "Số … … là:" */
const CL_UNIT=/^(ki-lô-gam|gam|tấn|tạ|yến|mét|xăng-ti-mét|đề-xi-mét|mi-li-mét|ki-lô-mét|lít|mi-li-lít|(xăng-ti-mét|đề-xi-mét|mét|ki-lô-mét|mi-li-mét)\s+(vuông|khối)|giờ|phút|giây|độ|tuổi|đồng)$/i;
const CL_LOW=/^(Cửa|Có|Cả|Mỗi|Giá|Tháng|Bạn|Lớp|Trường|Thùng|Hộp|Đội|Nhà|Vườn|Bể|Xe|Tàu|Người|Cô|Chú|Bác|Mẹ|Bố|Ông|Bà|Anh|Chị|Em|Hai|Ba|Bốn|Năm|Sáu|Chiều|Diện|Thể|Chu|Quãng|Số|Trong|Khối|Hình|Cạnh|Đáy|Tuần|Hôm|Ngày|Sáng|Buổi|Thư|Bao|Túi|Giỏ|Chuồng|Ao|Cây|Tổ|Khu|Đoạn|Sợi|Tấm|Mảnh|Đường|Bán|Quả|Con|Chiếc|Bức|Sân|Mảnh)(?=\s|$)/;
const clCap=t=>t.replace(/^\s*(.)/,c=>c.toUpperCase()),clLow=t=>CL_LOW.test(t)?t.replace(/^(.)/,c=>c.toLowerCase()):t;
/* bài giải có câu dẫn, dựng từ câu hỏi cuối của đề */
function climbSol(q){const raw=String(q.sol||'').replace(/^\s*(<b>)?\s*(Bài giải|Lời giải)\s*:?\s*(<\/b>)?\s*/i,''),qt=ktClean(q.t||'').replace(/\s+/g,' ');
  let ans=ktClean(q.opts[q.a]||'').trim(),lead='',noun='';
  const sents=qt.match(/[^.?!]*\?/g),Q=(sents?sents[sents.length-1]:'').trim().replace(/^Hỏi\s+/i,'');
  const m=Q.match(/^(.*?)\s*(bao nhiêu|mấy)\s*(.*?)\s*\?$/i);
  if(m){let before=m[1].trim().replace(/\s*,\s*$/,'');noun=m[3].trim();
    if(/^tuổi$/i.test(noun)){lead=/hơn|kém/.test(before)?`Số tuổi ${clLow(before)} là:`:`Tuổi của ${clLow(before.replace(/\s+(năm nay|hiện nay)$/i,''))} là:`}
    else if(CL_UNIT.test(noun)&&/\sdài$/i.test(before)){lead=`Độ dài ${clLow(before.replace(/\s+dài$/i,''))} là:`}
    else if(!noun||/\s(là|bằng)$/i.test(before)){lead=clCap(before.replace(/\s+(là|bằng)$/i,''))+' là:'}
    else{if(/^có$/i.test(before))before='';lead=`Số ${noun}${before?' '+clLow(before):''} là:`}}
  else if(Q)lead=clCap(Q.replace(/\?$/,''))+' là:';
  lead=lead.replace(/\s+/g,' ').replace(/\s+là là:$/,' là:');
  const lines=raw.split(/(?:<br\s*\/?>|\.\s+(?=[A-ZÀ-Ỹa-zà-ỹ0-9(])|;\s*)/).map(x=>x.replace(/\.\s*$/,'').trim()).filter(Boolean);
  /* đáp số có đơn vị */
  if(!/[a-zà-ỹđ²³]/i.test(ans)){const last=ktClean(lines[lines.length-1]||''),u=last.match(/\(([^()\d]{1,20})\)\s*$/)||last.match(/\d\s*([a-zà-ỹđ²³]+(?:\s[a-zà-ỹđ²³]+)?)\s*$/i);
    if(u&&!/dư/.test(u[1]))ans=`${ans} ${u[1].trim()}`;else if(noun)ans=`${ans} ${noun}`}
  /* phép tính cuối có đơn vị, ví dụ "29 + 24 = 53 (cái bánh)" */
  {const um=ans.match(/^([\d  .,]+)\s+(.+)$/),i=lines.length-1;if(um&&i>=0){const last=lines[i],lt=ktClean(last).trim(),num=um[1].trim();
    if(!/\)\s*$/.test(lt)&&new RegExp('=\\s*'+num.replace(/[.]/g,'\\.')+'$').test(lt)&&!/[a-zà-ỹđ²³%]\s*$/i.test(lt))lines[i]=last+` (${um[2].trim()})`}}
  const say=ktClean(`${lead} ${lines.join('. ')}.`);return{lead,lines,ans,say}}
function climbGoOn(){const g=scr;if(g.k!=='xg'||g.mode!=='climb'||g.end||g.ph!=='rest')return;try{speechSynthesis.cancel()}catch(e){}sfx('tap');climbNext(g)}
function climbEnd(){const g=scr;if(g.k!=='xg'||g.mode!=='climb'||g.end)return;stopXG();const st=S.st[sid];st.mg=st.mg||{};const key=`${g.id}:climb`;g.prev=st.mg[key]||0;st.mg[key]=Math.max(g.prev,g.score);
  g.coins=addCoins(sid,Math.min(20,g.score*3+(g.score>=CLIMB_N?2:0)),'self');g.end=true;g.win=g.score>=CLIMB_N;log(sid,'passed',`Leo núi · ${isl1(g.id).title}`,0,{success:true,score:{raw:g.score}});
  sfx(g.win?'win':'timeup');sayJ(g.win?'Jenny đã lên tới đỉnh núi và mở được rương báu! Em giỏi quá!':`Em đã leo được ${g.score} chặng!`);save();render()}
{const _ar=hooks.cu('xgAfterRender');hooks.de('xgAfterRender',function(){const g=scr;if(g.k==='xg'&&g.mode==='climb'){if(g.end)return;climbUI();climbDraw();if(!g.started){g.started=true;sayJ(g.say);setTimeout(()=>{if(scr===g&&!g.end&&curG()<=2&&g.q&&g.ph==='ask')sayJ(climbSayText(g.q))},5200);climbLoop()}else if(!xgLoop)climbLoop();return}return _ar.apply(this,arguments)})}
{const _mt=hooks.cu('musicTheme');hooks.de('musicTheme',function(){try{if(role==='hs'&&scr.k==='xg'&&scr.mode==='climb')return scr.end?null:'m_snow'}catch(e){}return _mt.apply(this,arguments)})}
(function(){const st=document.createElement('style');st.textContent=`
.xclimb .xct{position:relative;width:342px;height:252px;margin:4px auto;border:3px solid #1F2A5A;overflow:hidden}
.xclimb .xct canvas{position:absolute;inset:0;width:342px;height:252px;image-rendering:pixelated;image-rendering:crisp-edges}
.game.mini.xclimb>.xct{width:342px!important;max-width:342px!important}
.xcflags{gap:3px!important}
.xcflags i{display:inline-block;width:12px;height:14px;background:#C3CBDD;box-shadow:0 0 0 2px #9AA4C0;clip-path:polygon(0 0,100% 25%,0 55%)}
.xcflags i.on{background:#F04A1B;box-shadow:0 0 0 2px #B8320F}
.xcban{position:absolute;left:50%;top:10px;transform:translateX(-50%);z-index:3;font-family:var(--f-display,'VT323',monospace);font-size:24px;line-height:1;color:#1E8A4A;background:#DFF6E8;border:3px solid #1E8A4A;padding:2px 10px;white-space:nowrap;opacity:0;pointer-events:none}
.xcban.on{animation:xcban 1.9s steps(4) forwards}
@keyframes xcban{0%{opacity:0;transform:translate(-50%,-8px)}15%{opacity:1;transform:translate(-50%,0)}80%{opacity:1}100%{opacity:0}}
.game.mini.xclimb>.xcq{width:min(342px,calc(100% - 20px))!important;max-width:342px!important;box-sizing:border-box}
.xcqt,.xcopts,.xco{box-sizing:border-box}
.xcqt{position:relative;font-family:var(--f-body,'Be Vietnam Pro',sans-serif);font-size:17px;line-height:1.35;color:#1F2A5A;background:#FFF6D6;border:3px solid #1F2A5A;padding:8px 10px 8px;margin:2px 0 8px;max-height:150px;overflow-y:auto;text-align:left}
.xcqn{display:inline-block;margin-right:6px;padding:0 6px;background:#1F2A5A;color:#FFFFFF;font-family:var(--f-display,'VT323',monospace);font-size:18px;line-height:1.2;vertical-align:1px}
.xcqt .frac{font-size:.9em}
.xcpic{display:flex;justify-content:center;margin-top:6px}.xcpic{max-height:76px;overflow:hidden;flex-wrap:wrap}.xcpic svg,.xcpic img,.xcpic canvas{max-height:70px;max-width:100%;height:auto;width:auto}.xcpic .g1grp{flex-wrap:wrap;gap:2px;justify-content:center}.xcpic .g1grp img,.xcpic .g1grp canvas{max-height:30px}
.xcopts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.xcopts.c2{grid-template-columns:1fr 1fr}
.xco{border:0;background:#FFFFFF;color:#1F2A5A;box-shadow:0 0 0 3px #1F2A5A,0 5px 0 0 #1F2A5A;min-height:46px;font-family:var(--f-display,'VT323',monospace);font-size:21px;line-height:1.05;cursor:pointer;padding:4px 4px;overflow-wrap:anywhere}
.xco b{font-weight:400}
.xco:active{transform:translateY(3px)}
.xco:disabled{background:#E3E7F0;color:#9AA4C0;box-shadow:0 0 0 3px #9AA4C0;cursor:default}
.xco.right:disabled{background:#DFF6E8;color:#1E8A4A;box-shadow:0 0 0 3px #1E8A4A}
.xcsol{display:block;margin-top:4px;color:#5E6B8C;font-size:14px;line-height:1.3}
.xcsolbox{text-align:left;max-width:520px;margin:0 auto}
.xcsolh{font-family:var(--f-body);font-size:16px;color:#B8320F;font-weight:700;margin-bottom:6px;text-align:center}
.xcsolc{font-family:var(--f-body);background:#FFFDF2;border:3px solid #1F2A5A;padding:8px 10px;font-size:17px;line-height:1.45;color:#1F2A5A}
.xcbg{display:block;text-align:center;text-decoration:underline;margin-bottom:2px}
.xcln{padding-left:18px}
.xcds{margin-top:2px;font-weight:700}
.xcgo{font-family:var(--f-body)!important;font-weight:700!important;font-size:18px!important;text-transform:none!important;line-height:1.2!important;padding:12px!important;display:block;margin:10px auto 0;min-width:0;width:100%;max-width:340px}
.xcbadge{display:inline-flex;align-items:center;gap:10px;margin:8px auto;padding:6px 12px;background:#FFF6D6;border:3px solid #1F2A5A;text-align:left}
.xcbadge small{display:block;color:#5E6B8C}
`;document.head.appendChild(st)})();
