/* ===================== TRỒNG CÂY (mode 'plant') ===================== */
/* Cảnh pixel trên canvas 114×100 (phóng ×3): vườn có hàng rào, trời, mây, bướm; Jenny cầm bình tưới đứng cạnh luống đất.
   Mỗi câu trả lời đúng = một lần tưới: bình nghiêng, giọt nước rơi, lấp lánh, cây lớn thêm một bậc, bảng "Lần tưới n/8 ✓".
   9 bậc: hạt → nảy mầm → hai lá → cây non → cây cao có cành (mưa rào + cầu vồng) → nụ → hoa nở → quả xanh → quả chín, rồi thu hoạch.
   Sai 1 lần: cây rũ xuống, mọc cỏ dại, đáp án sai bị khoá. Sai 2 lần: ốc sên gặm một chiếc lá (lượt này cây không lớn), hiện đáp án
   đúng, sang câu khác. Không bao giờ mất bậc đã lớn. Đủ 8 lần tưới hoặc hết 150 giây thì kết thúc. Không có tim.
   Loài cây theo đảo: táo, cam, xoài, dâu tây, hướng dương. Câu hỏi lấy từ frogQ (đã lọc kiến thức như Ếch nhảy). */
import { hooks } from './00-hooks.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { addCoins } from './11-sao-va-mo-khoa.js';
import { go, render } from './13-giao-dien-chung.js';
import { pixelize, PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { pxCanvas } from './23-bien-pixel-dong-phia-sau-ban-do.js';
import { isl1, sayJ } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { curG } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { sfx } from './33b-am-thanh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { jOutfit, ofVariant } from './33e-ho-chieu.js';
import { stopXG, xgHash, XGN, xgRec } from './37-tro-choi-dot-1.js';
import { frogQ, frogSay, xcv, xpx } from './39-tro-choi-dot-3.js';
import { XG_ALL } from './39c-can-bang-tro-choi.js';
import { ktOf, XG_BIAS } from './39e-kien-thuc-tro-choi.js';
PXS.plantI=["................","......gg........",".....gllg..gg...",".....glllg.gllg.","......gllggllg..","..gg...glllgg...",".gllg...gG......",".gllllg.gG......","..gglllgG.......","....gggG........","......gG........","...nnnnnnnnnn...","..nuuuuuuuuuun..",".nuuNuuuuuNuuun.",".nnnnnnnnnnnnnn.","................"];
PXS.canI=["......kkk..",".....k...k.","kk..kkkkkkk","kbk.kbbbbbk",".kbkkbxbbbk","..kbbbbbbbk","...kbbbbbbk","....kbbbbbk","....kkkkkkk"];
const PLANT_SP=[
 {k:'tao',n:'táo',fr:'r',fr2:'R',kind:'tree',flw:'s'},
 {k:'cam',n:'cam',fr:'o',fr2:'O',kind:'tree',flw:'w'},
 {k:'xoai',n:'xoài',fr:'a',fr2:'T',kind:'tree',flw:'t'},
 {k:'dau',n:'dâu tây',fr:'r',fr2:'R',kind:'bush',flw:'w'},
 {k:'huong',n:'hướng dương',fr:'n',fr2:'N',kind:'sun',flw:'y'}];
PLANT_SP.forEach(s=>{PXS['plantF_'+s.k]=s.kind==='sun'?[".nnn.","nNnNn","nnNnn","nNnNn",".nnn."]:s.kind==='bush'?["..g..",".kkk.","krwrk","krrrk",".krk."]:["..N..",".kgk.","k"+s.fr+"w"+s.fr+"k","k"+s.fr+s.fr+s.fr2+"k",".kkk."]});
Object.assign(XGN,{plant:['plantI','Trồng cây','Trả lời đúng để tưới cây, cây lớn dần tới khi ra quả, 8 lần tưới']});
if(!XG_ALL.includes('plant'))XG_ALL.push('plant');
/* chọn trò: cho phép giống Ếch nhảy (nội dung lấy từ frogQ đã lọc kiến thức) */
{hooks.on('ktAllowed',_a=>function(x,mode){return _a.call(this,x,mode==='plant'?'frog':mode)})}
{hooks.on('ktOwn',_o=>function(x,mode){return _o.call(this,x,mode==='plant'?'frog':mode)})}
{hooks.on('xgElig',_e=>function(x){const r=_e.apply(this,arguments);if(r&&r.E&&r.E.includes('frog')&&!r.E.includes('plant'))r.E.push('plant');return r})}
{hooks.on('ktSample',_s=>function(x,mode,n){if(mode!=='plant')return _s.apply(this,arguments);return _s.call(this,x,'frog',n)})}
/* chia trò (ktBalance0 ở 39e): Trồng cây được ưu tiên ở lớp 1–2, ít hơn ở lớp 3–5 */
const PLANT_BIAS={1:-14,2:-9,3:16,4:16,5:16};
XG_BIAS.plant=PLANT_BIAS;

const PLANT_N=8,PLANT_T=150;
export const PLANT_SKY=['#CFEFFB','#C3EBFB','#B6E6FA','#A8E0F8','#9DB7C9','#A6DCF5','#B6E1F2','#F3DDA0','#F6C79A'];
const plantSp=id=>PLANT_SP[xgHash(String(id)+'plant')%PLANT_SP.length];
{hooks.on('startXG',_s=>function(mode,id){if(mode!=='plant')return _s.apply(this,arguments);try{speechSynthesis.cancel()}catch(e){}const x=isl1(id);XG_KT=x?ktOf(x):null;
  go({k:'xg',mode:'plant',id,score:0,stage:0,nib:0,lives:3,end:false,started:false,t:PLANT_T,ph:'ask',pt:0,q:x?frogQ(x):null,tries:0,bad:[],weed:0,droop:0,bitten:0,rainbow:0,sp:plantSp(id),
    say:'Trồng cây! Mỗi lần em trả lời đúng, Jenny tưới cây một lần. Tưới đủ tám lần là cây ra quả nhé.'})})}
/* ---- màn hình ---- */
{hooks.on('viewXG',_v=>function(){const g=scr;if(g.mode!=='plant')return _v.apply(this,arguments);const st=S.st[sid],best=Math.max((st.mg||{})[`${g.id}:plant`]||0,g.score),sp=g.sp;
  if(g.end){const rec=g.score>(g.prev||0)&&g.score>0;
    return`<div class="game g1"><div class="gend xgend"><div class="xgendrow"><span class="bigicon">${spr('plantI',72)}</span>${jenny(72,g.score?'cheer':'sad')}</div><h1>${rec?'Kỷ lục mới!':g.score>=PLANT_N?'Thu hoạch rồi!':'Hết giờ!'}</h1>
     <p class="muted">Tưới đúng <b>${g.score}</b>/${PLANT_N} lần · cây ${sp.n} ${PLANT_STAGE[g.stage]} · kỷ lục ${best}</p><div class="xpbasket">${plantBasketHTML(g)}</div>${g.coins?`<p class="earn">+${g.coins} xu</p>`:''}
     <div class="gendbtn"><button class="gobtn" type="button" onclick="startXG('plant','${g.id}')">Chơi lại</button><button class="gobtn ghost" type="button" onclick="go({k:'island',id:'${g.id}'})">Về đảo</button></div></div></div>`}
  return`<div class="game g1 mini xg xplant"><div class="gtop"><button class="gx" onclick="stopXG();go({k:'island',id:'${g.id}'})" aria-label="Thoát">✕</button><span class="mgsc xpleaves" id="xpbar" aria-label="Đã tưới ${g.score}/${PLANT_N} lần">${plantBar(g)}</span><span class="grow"></span><span class="mgsc">${spr('clock',22)} <b id="xptm">${g.t}</b></span></div>
   <div class="mgrule"><span id="xpst">${plantStatus(g)}</span><button class="g1spk" type="button" onclick="sayJ(scr.ph==='ask'&&scr.q?frogSay(scr.q):scr.say)" aria-label="Nghe lại">🔊</button></div>
   <div class="xpt" id="xpt"><canvas class="xpcv" id="xpcv" width="114" height="100" aria-hidden="true"></canvas><span class="xpban" id="xpban"></span></div>
   <div class="xpq" id="xpq"></div>
   <div id="xgfb" class="xgfb"></div></div>`})}
const PLANT_STAGE=['còn là hạt','vừa nảy mầm','có hai lá','là cây non','cao có cành','có nụ','nở hoa','có quả xanh','có quả chín'];
function plantBar(g){return Array.from({length:PLANT_N},(_,i)=>`<i class="${i<g.score?'on':''}"></i>`).join('')}
function plantBasketHTML(g){const n=g.score;return`<span class="xpbk">${Array.from({length:Math.max(0,n)},()=>`<i>${spr('plantF_'+g.sp.k,18)}</i>`).join('')||'<em>giỏ trống</em>'}</span>`}
function plantStatus(g){const sp=g.sp;return g.ph==='ask'?(g.tries?'<b>Cây cần nước đúng cách!</b> Thử lại nhé':`Trả lời đúng để tưới cây ${sp.n} <b>(lần ${g.score+1}/${PLANT_N})</b>`):g.ph==='water'?'<b>Jenny tưới cây…</b>':g.ph==='rain'?'<b>Mưa rào!</b> Cây uống no nước':g.ph==='nibble'?'<b>Ốc sên gặm lá!</b> Câu sau cố lên nhé':g.ph==='harvest'?'<b>Thu hoạch!</b> Quả rơi vào giỏ':''}
function plantUI(){const g=scr;if(g.k!=='xg'||g.mode!=='plant'||g.end)return;const $=id=>document.getElementById(id);
  const st=$('xpst');if(st)st.innerHTML=plantStatus(g);const b=$('xpbar');if(b){b.innerHTML=plantBar(g);b.setAttribute('aria-label',`Đã tưới ${g.score}/${PLANT_N} lần`)}
  const qb=$('xpq');if(qb){if(g.ph==='ask'&&g.q){const q=g.q;qb.innerHTML=`<div class="xpqt">${q.t}</div><div class="xpopts">${q.opts.map((o,i)=>`<button type="button" class="xpo" ${g.bad.includes(i)?'disabled':''} onclick="plantAns(${i})"><b>${o}</b></button>`).join('')}</div>`;try{pixelize(qb)}catch(e){}}else qb.innerHTML=''}}
/* ---- vẽ cảnh ---- */
function plantDraw(...a){return hooks.goi('plantDraw',this,a)}
hooks.ham('plantDraw',function(){const x=xcv('xpcv');if(!x)return;const g=scr,p=xpx(x),now=performance.now(),f=Math.floor(now/120),S=g.stage,el=now-g.pt,sp=g.sp;
  x.clearRect(0,0,114,100);
  /* trời đổi dần: sáng → trưa → chiều; mưa thì tối lại */
  const sky=g.ph==='rain'?'#9DB7C9':PLANT_SKY[S];p(sky,0,0,114,60);
  if(g.ph!=='rain'){const sx=8+S*10,sy=4+Math.abs(S-4)*2;p(S>=7?'o':'y',sx,sy,7,7);p(S>=7?'O':'a',sx+1,sy+6,6,1);p('w',sx+1,sy+1,2,1);if(f%4<2){p('y',sx-2,sy+3,1,1);p('y',sx+8,sy+3,1,1);p('y',sx+3,sy-2,1,1)}}
  /* cầu vồng sau cơn mưa (bậc 4–5) */
  if(g.rainbow&&g.ph!=='rain'){const R=['r','o','y','g','b','p'];R.forEach((c,i)=>{for(let a=0;a<=Math.PI;a+=.03){const rr=40-i;p(c,Math.round(70+rr*Math.cos(a)),Math.round(58-rr*.75*Math.sin(a)),1,1)}})}
  /* mây trôi */ [[(f*0.35)%150-25,8],[((f*0.22)+70)%150-25,17]].forEach(([cx,cy])=>{cx=Math.round(cx);const c=g.ph==='rain'?'#7B8FA3':'w';p(c,cx,cy,16,4);p(c,cx+4,cy-3,8,3);if(g.ph==='rain')p('#6A7D90',cx,cy+3,16,1)});
  /* đồi xa */ for(let X=0;X<114;X++){const h=Math.round(5+3*Math.sin(X/11)+2*Math.sin(X/5));p('#8FD19E',X,52-h,1,h+1)}
  /* hàng rào */ p('t',0,53,114,2);p('T',0,58,114,2);for(let X=2;X<114;X+=8){p('k',X,49,4,1);p('t',X,50,4,12);p('T',X+3,50,1,12);p('k',X-1,50,1,12);p('k',X+4,50,1,12)}
  /* bãi cỏ */ p('g',0,62,114,38);p('G',0,62,114,1);for(let X=1;X<114;X+=3){const w=((X>>1)+(f>>1))%5===0?1:0;p('l',X+w,64+(X%7),1,2)}
  /* hoa nhỏ đung đưa */ [[8,90],[44,95],[100,92],[106,70]].forEach(([X,Y],i)=>{const s=((f>>2)+i)%2;p('G',X,Y,1,3);p(['c','y','w','p'][i],X-1+s,Y-2,3,2)});
  /* luống đất */ const cx=66,base=80;p('k',cx-20,base-3,41,1);p('N',cx-20,base-2,41,8);p('n',cx-19,base-2,39,2);for(let X=cx-18;X<cx+20;X+=4)p('u',X,base+1+(X%3),2,1);p('k',cx-21,base-2,1,8);p('k',cx+21,base-2,1,8);p('k',cx-20,base+6,41,1);
  /* cỏ dại khi sai lần 1 */ if(g.weed){const wx=cx+12,wy=base-4;p('G',wx,wy,1,4);p('G',wx-2,wy+1,1,3);p('G',wx+2,wy+1,1,3);p('l',wx,wy-1,1,1)}
  /* cây */ plantTree(x,p,cx,base-3,S,sp,f,g);
  /* nước đọng sau khi tưới */ if(g.ph==='water'&&el>500){const r=Math.min(8,Math.round((el-500)/60));p('#4FC2EA',cx-r,base-3,r*2,1)}
  /* ốc sên gặm lá */ if(g.ph==='nibble'){const t=Math.min(1,el/1100),sx=Math.round(114-(114-(cx+6))*t),sy=base-3;p('k',sx,sy-4,7,4);p('n',sx+1,sy-3,5,3);p('u',sx+2,sy-2,2,1);p('y',sx-2,sy-1,3,1);p('k',sx-3,sy-3,1,2);p('k',sx-1,sy-3,1,2)}
  /* Jenny + bình tưới */ const jx=8,jy=58;x.drawImage(pxCanvas(typeof ofVariant==='function'&&typeof jOutfit==='function'?ofVariant('jenny',jOutfit()):'jenny'),jx,jy);
  let canX=jx+15,canY=jy+8,tilt=false;
  if(g.ph==='water'){const t=Math.min(1,el/300);canX=Math.round(jx+15+(cx-16-(jx+15))*t);canY=Math.round(jy+8+(base-24-(jy+8))*t);tilt=t>=1}
  x.save();x.translate(canX+5,canY+4);if(tilt)x.rotate(.5);x.drawImage(pxCanvas('canI'),-5,-4);x.restore();
  /* giọt nước */ if(g.ph==='water'&&el>300){for(let i=0;i<7;i++){const ph=((el-300)/80+i*1.7)%6,dx=cx-6+((i*5)%12),dy=base-20+ph*3;if(dy<base-3)p(i%2?'b':'x',dx,Math.round(dy),1,2)}}
  /* mưa rào */ if(g.ph==='rain'){for(let i=0;i<60;i++){const X=(i*19+f*3)%114,Y=(i*37+f*7)%62;p('#D6F2FF',X,Y,1,3)}if(f%6<3)for(let i=0;i<6;i++)p('#FFFFFF',(i*23+f)%114,base+2,2,1)}
  /* lấp lánh khi lớn */ if(g.ph==='water'&&el>900){[[cx-10,base-28],[cx+9,base-34],[cx,base-44],[cx-4,base-14]].forEach(([X,Y],i)=>{if((f+i)%3){p('y',X,Y-1,1,3);p('y',X-1,Y,3,1)}})}
  /* bướm / ong bay */ [[0,40],[1,30]].forEach(([i,Y])=>{const bx=Math.round(((f*(0.6+i*.3))+i*60)%140-14),by=Y+Math.round(Math.sin((f+i*5)/3)*4),w=f%2;const c=S>=6&&i===1?'y':['c','p'][i];p(c,bx-1-w,by-1,2,2);p(c,bx+1+w,by-1,2,2);p('k',bx,by-1,1,3);if(S>=6&&i===1){p('k',bx-1,by+1,3,1)}});
  /* giỏ thu hoạch */ const bkx=92,bky=78;p('k',bkx,bky,16,9);p('u',bkx+1,bky+1,14,7);for(let X=bkx+2;X<bkx+15;X+=3)p('N',X,bky+1,1,7);p('k',bkx+3,bky-4,1,4);p('k',bkx+12,bky-4,1,4);p('k',bkx+3,bky-5,10,1);
  const inB=g.ph==='harvest'?Math.min(g.score,Math.floor(el/220)):g.end?g.score:0;for(let i=0;i<Math.min(inB,8);i++)x.drawImage(pxCanvas('plantF_'+sp.k),bkx+1+(i%3)*5,bky-3-Math.floor(i/3)*2);
  /* quả đang rơi vào giỏ */ if(g.ph==='harvest'){const i=Math.floor(el/220),t=(el%220)/220;if(i<g.score){const fx=cx-6+((i*7)%14),fy=base-30+((i*5)%10);const X=Math.round(fx+(bkx+4-fx)*t),Y=Math.round(fy+(bky-4-fy)*t-Math.sin(t*Math.PI)*10);x.drawImage(pxCanvas('plantF_'+sp.k),X,Y)}}});
/* vẽ cây theo bậc */
function plantTree(x,p0,cx,gy,S,sp,f,g){/* vẽ cây với ô to gấp đôi để cây nổi bật trong cảnh */const p=(c,X,Y,w=1,h=1)=>p0(c,cx+(X-cx)*2,gy+(Y-gy)*2,w*2,h*2);const sway=(f>>2)%2,droop=g.droop?1:0;const leafC=droop?'l':'g',leafD=droop?'g':'G';
  if(S===0){p('n',cx-2,gy-1,4,2);p('u',cx-1,gy-2,2,1);if((f>>2)%3===0)p('t',cx,gy-2,1,1);return}
  if(sp.kind==='sun'){/* hướng dương: thân thẳng, lá to, bông lớn dần */
    const H=[0,2,4,6,9,12,14,15,16][S],top=gy-H;p('G',cx,top,2,H);
    for(let k=1;k<=Math.min(4,S);k++){const y=gy-Math.round(H*k/5),d=k%2?-1:1;p(leafC,cx+(d>0?2:-4)+(sway&&k>2?d:0),y+droop,4,2);p(leafD,cx+(d>0?2:-4),y+1+droop,4,1)}
    if(S===1){p('l',cx-1,top-1,4,1)}
    if(S===5){p('G',cx-1,top-2,3,2);p('y',cx,top-3,1,1)}
    if(S>=6){const r=S===6?2:3,hx=cx,hy=top-r;for(let yy=-r-1;yy<=r+1;yy++)for(let xx=-r-1;xx<=r+1;xx++){const d=xx*xx+yy*yy;if(d<=(r+1)*(r+1)+.5)p(d>(r+.5)*(r+.5)?((xx+yy)%2?'y':'a'):d<=(r-.5)*(r-.5)+1?(S===8?((xx+yy)%2?'N':'n'):S===7?'G':'a'):'y',hx+xx,hy+yy,1,1)}}
    if(g.bitten){p(PLANT_SKY[S],cx+3,gy-Math.round(H*2/5),2,1)}return}
  if(sp.kind==='bush'){/* dâu tây: bụi thấp, lá ba chẽ, hoa trắng, quả đỏ */
    const R=[0,1,2,3,4,5,5,6,6][S];if(S<=2){p('G',cx,gy-3-S,1,3+S);p(leafC,cx-2,gy-4-S+droop,2,2);p(leafC,cx+1,gy-4-S+droop,2,2);if(S===2){p(leafC,cx-1,gy-6-S+droop,3,2)}return}
    for(let yy=-R;yy<=0;yy++)for(let xx=-R-3;xx<=R+3;xx++){const d=(xx*xx)/((R+3)*(R+3))+(yy*yy)/(R*R);if(d<=1){const edge=d>.78;p(edge?'k':((xx+yy+sway)%3===0?leafD:leafC),cx+xx,gy+yy+droop,1,1)}}
    const spots=[[-4,-2],[3,-3],[-1,-5],[6,-1],[-6,0],[1,-1]].map(([a,b])=>[Math.round(a*R/6),Math.round(b*R/6)]);
    spots.forEach(([dx,dy],i)=>{const X=cx+dx,Y=gy+dy;if(S===5){p('w',X,Y,2,2);p('l',X,Y+1,2,1)}else if(S===6){p('w',X-1,Y,3,1);p('w',X,Y-1,1,3);p('y',X,Y,1,1)}else if(S>=7){const c=S===7?'l':'r';p('k',X-1,Y-1,4,5);p(c,X,Y,2,3);p(S===7?'g':'R',X+1,Y+2,1,1);if(S===8)p('w',X,Y+1,1,1);p('G',X,Y-1,2,1)}});
    if(g.bitten)p('N',cx-R,gy-R+1,3,2);return}
  /* cây ăn quả: thân gỗ, tán tròn lớn dần */
  if(S===1){p('G',cx,gy-3,1,3);p('l',cx-2,gy-4,2,1);p('l',cx+1,gy-4,2,1);return}
  if(S===2){p('G',cx,gy-6,1,6);p(leafC,cx-4,gy-7+droop,4,2);p(leafD,cx-4,gy-6+droop,4,1);p(leafC,cx+1,gy-7+droop,4,2);p(leafD,cx+1,gy-6+droop,4,1);return}
  if(S===3){p('G',cx,gy-11,1,11);[[-5,-10],[1,-10],[-5,-6],[1,-6]].forEach(([dx,dy],i)=>{p(leafC,cx+dx+(i<2&&sway?1:0),gy+dy+droop,4,2);p(leafD,cx+dx,gy+dy+1+droop,4,1)});p('l',cx-1,gy-13,3,2);if(g.bitten)p(PLANT_SKY[3],cx+3,gy-10,2,1);return}
  const H=[0,0,0,0,10,12,14,15,16][S],R=[0,0,0,0,4,5,6,7,7][S],top=gy-H;
  /* thân + cành */ p('N',cx-1,top+R,3,H-R);p('n',cx-1,top+R,1,H-R);p('k',cx-2,top+R,1,H-R);p('k',cx+2,top+R,1,H-R);
  p('N',cx-3,top+R+2,2,1);p('N',cx+2,top+R+1,2,1);
  /* tán */ const ccx=cx,ccy=top+Math.round(R*.8)+droop;
  for(let yy=-R;yy<=R;yy++)for(let xx=-R-2;xx<=R+2;xx++){const d=(xx*xx)/((R+2)*(R+2))+(yy*yy)/(R*R*.72);if(d<=1){const edge=d>.82;let c=edge?'k':(yy>R*.35?leafD:leafC);if(!edge&&(xx*3+yy*5+sway)%11===0)c='l';p(c,ccx+xx,ccy+Math.round(yy*.85),1,1)}}
  if(g.bitten){p(PLANT_SKY[S],ccx+R-2,ccy-3,3,2);p('k',ccx+R-3,ccy-3,1,2)}
  const spots=[[-7,-3],[5,-5],[-2,-7],[8,1],[-9,2],[1,0],[-4,4],[6,5]];
  spots.slice(0,S>=7?8:6).forEach(([dx,dy],i)=>{const X=ccx+Math.round(dx*R/13),Y=ccy+Math.round(dy*R/13);if(S===5){p(sp.flw==='w'?'s':'c',X,Y,1,1);return}if(S===6){p(sp.flw,X,Y,1,1);if(i%2)p('y',X,Y,1,1);return}if(S>=7){p(S===7?'l':sp.fr,X,Y,1,1);return}
    if(S===5){p(sp.flw==='w'?'s':'c',X,Y,2,2);p('G',X,Y+2,2,1)}
    else if(S===6){p(sp.flw,X-1,Y,3,1);p(sp.flw,X,Y-1,1,3);p('y',X,Y,1,1)}
    else if(S>=7){const c=S===7?'l':sp.fr,c2=S===7?'G':sp.fr2;p('k',X-1,Y-1,4,4);p(c,X,Y,2,2);p(c2,X+1,Y+1,1,1);if(S===8)p('w',X,Y,1,1);p('N',X+1,Y-2,1,1)}})}
/* ---- điều khiển ---- */
function plantLoop(){const g=scr;stopXG();let sec=performance.now();
  xgLoop={tick:setInterval(()=>{if(scr!==g||g.end||!document.getElementById('xpcv')){stopXG();return}const now=performance.now();
    if(now-sec>=1000){sec=now;if(g.ph!=='harvest'){g.t--;const e=document.getElementById('xptm');if(e)e.textContent=g.t;if(g.t>0&&g.t<=5)sfx('tick');if(g.t<=0){plantEnd();return}}}
    plantDraw()},120)}}
function plantNext(g){g.ph='ask';g.pt=performance.now();g.q=frogQ(isl1(g.id));g.tries=0;g.bad=[];g.lockA=0;plantUI();try{if(curG()<=2)sayJ(frogSay(g.q))}catch(e){}}
function plantBanner(t){const b=document.getElementById('xpban');if(b){b.textContent=t;b.classList.remove('on');void b.offsetWidth;b.classList.add('on')}}
function plantAns(i){const g=scr;if(g.k!=='xg'||g.mode!=='plant'||g.end||g.ph!=='ask'||g.lockA)return;const q=g.q,ok=i===q.a;
  xgRec(ok,g.tries===0&&q.q?q.q:g.tries===0?{kind:'Tính nhẩm'}:null);g.tries++;const fb=document.getElementById('xgfb');
  if(ok){g.lockA=1;g.ph='water';g.pt=performance.now();g.weed=0;g.droop=0;g.bitten=0;sfx('ok');setTimeout(()=>sfx('splash'),320);if(fb)fb.innerHTML='<span class="ok">Đúng rồi! Jenny tưới cây nào!</span>';plantUI();
    setTimeout(()=>{if(scr!==g||g.end)return;g.score++;g.stage=Math.min(8,g.stage+1);sfx('star');plantBanner(`Lần tưới ${g.score}/${PLANT_N} ✓`);if(fb)fb.innerHTML=`<span class="ok">Cây ${g.sp.n} ${PLANT_STAGE[g.stage]}!</span>`;plantUI();
      if(g.stage===4&&!g.rainbow){g.ph='rain';g.pt=performance.now();plantUI();sfx('splash');setTimeout(()=>{if(scr!==g||g.end)return;g.rainbow=1;sfx('unlock');plantNext(g)},1700);return}
      if(g.stage===6)g.rainbow=0;
      if(g.score>=PLANT_N){setTimeout(()=>{if(scr!==g||g.end)return;g.ph='harvest';g.pt=performance.now();plantUI();sfx('chest');setTimeout(()=>{if(scr===g&&!g.end)plantEnd()},Math.max(2200,g.score*220+800))},700);return}
      setTimeout(()=>{if(scr===g&&!g.end)plantNext(g)},700)},1250);return}
  sfx('bad');if(g.tries<2){g.bad.push(i);g.droop=1;g.weed=1;if(fb)fb.innerHTML='<span class="bad">Cây cần nước đúng cách! Thử lại nhé.</span>';plantUI();return}
  g.lockA=1;g.ph='nibble';g.pt=performance.now();g.nib++;if(fb)fb.innerHTML=`<span class="bad">Ốc sên gặm lá mất rồi! Đáp án đúng là <b>${q.opts[q.a]}</b>.</span>`;plantUI();
  setTimeout(()=>{if(scr!==g||g.end)return;g.bitten=1;sfx('deflate')},1100);setTimeout(()=>{if(scr!==g||g.end)return;g.droop=0;g.weed=0;plantNext(g)},2100)}
function plantEnd(){const g=scr;if(g.k!=='xg'||g.mode!=='plant'||g.end)return;stopXG();const st=S.st[sid];st.mg=st.mg||{};const key=`${g.id}:plant`;g.prev=st.mg[key]||0;st.mg[key]=Math.max(g.prev,g.score);
  g.coins=addCoins(sid,Math.min(20,g.score*2),'self');g.end=true;g.win=g.score>=PLANT_N;log(sid,'passed',`Trồng cây · ${isl1(g.id).title}`,0,{success:true,score:{raw:g.score}});
  sfx(g.win?'win':'timeup');sayJ(g.win?`Cây ${g.sp.n} ra quả chín rồi! Giỏi quá!`:`Em đã tưới cây ${g.score} lần!`);save();render()}
{hooks.on('xgAfterRender',_ar=>function(){const g=scr;if(g.k==='xg'&&g.mode==='plant'){if(g.end)return;plantUI();plantDraw();if(!g.started){g.started=true;sayJ(g.say);setTimeout(()=>{if(scr===g&&!g.end&&curG()<=2&&g.q)sayJ(frogSay(g.q))},4200);plantLoop()}else if(!xgLoop)plantLoop();return}return _ar.apply(this,arguments)})}
{hooks.on('musicTheme',_mt=>function(){try{if(role==='hs'&&scr.k==='xg'&&scr.mode==='plant')return scr.end?null:'map'}catch(e){}return _mt.apply(this,arguments)})}
(function(){const st=document.createElement('style');st.textContent=`
.xplant .xpt{position:relative;width:342px;height:300px;margin:4px auto;border:3px solid #1F2A5A;overflow:hidden}
.xplant .xpt canvas{position:absolute;inset:0;width:342px;height:300px;image-rendering:pixelated;image-rendering:crisp-edges}
.game.mini.xplant>.xpt{width:342px!important;max-width:342px!important}
.xpleaves{gap:3px!important}
.xpleaves i{display:inline-block;width:12px;height:12px;background:#E3E7F0;box-shadow:0 0 0 2px #9AA4C0;clip-path:polygon(50% 0,100% 40%,80% 100%,20% 100%,0 40%)}
.xpleaves i.on{background:#2AB563;box-shadow:0 0 0 2px #1E8A4A}
.xpban{position:absolute;left:50%;top:10px;transform:translateX(-50%);z-index:3;font-family:var(--f-display,'VT323',monospace);font-size:24px;line-height:1;color:#1E8A4A;background:#DFF6E8;border:3px solid #1E8A4A;padding:2px 10px;white-space:nowrap;opacity:0;pointer-events:none}
.xpban.on{animation:xpban 1.8s steps(4) forwards}
@keyframes xpban{0%{opacity:0;transform:translate(-50%,-8px)}15%{opacity:1;transform:translate(-50%,0)}80%{opacity:1}100%{opacity:0}}
.game.mini.xplant>.xpq{width:min(336px,calc(100% - 28px))!important;max-width:336px!important;box-sizing:border-box;min-height:118px}
.xpqt,.xpopts,.xpo{box-sizing:border-box}
.xpqt{font-family:var(--f-display,'VT323',monospace);font-size:24px;line-height:1.1;text-align:center;background:#FFF6D6;border:3px solid #1F2A5A;padding:4px 6px;margin:2px 0 6px;color:#1F2A5A}
.xpopts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.xpo{border:0;background:#FFFFFF;color:#1F2A5A;box-shadow:0 0 0 3px #1F2A5A,0 5px 0 0 #1F2A5A;min-height:46px;font-family:var(--f-display,'VT323',monospace);font-size:24px;cursor:pointer;padding:2px 4px;overflow:hidden}
.xpo b{font-weight:400;white-space:nowrap}
.xpo:active{transform:translateY(3px)}
.xpo:disabled{background:#E3E7F0;color:#9AA4C0;box-shadow:0 0 0 3px #9AA4C0;cursor:default}
.xpbasket{display:flex;justify-content:center;margin:6px 0}
.xpbk{display:inline-flex;flex-wrap:wrap;gap:4px;justify-content:center;max-width:220px;padding:6px 8px;background:#F6D98B;border:3px solid #1F2A5A}
.xpbk em{font-style:normal;color:#5E6B8C}
`;document.head.appendChild(st)})();
