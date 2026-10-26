/* ===================== THẢ MỒI CÂU CÁ (mode 'bait') ===================== */
/* Cảnh pixel trên canvas 114×100 (phóng ×3): Jenny ngồi trên cầu gỗ cầm cần câu, hồ nước, lau sậy, mây, thùng cá.
   Vòng chơi: chạm "Thả mồi" → dây quăng vòng cung, phao rơi xuống nước → chờ 1–3 giây (phao nhấp nhô, gợn sóng),
   bóng cá bơi tới → phao chìm "Cá cắn câu!" → hiện câu hỏi (nội dung đã lọc theo kiến thức đảo, như Ếch nhảy).
   Đúng: kéo cá lên, cá bay vào thùng, "Con cá n/8 ✓". Sai 1 lần: cá giãy, lá đáp án sai bị khoá. Sai 2 lần: cá chạy mất,
   thả lại mồi. Câu đủ 8 con hoặc hết 120 giây thì kết thúc. Không mất tim. Trời đổi dần từ sáng tới hoàng hôn theo số cá. */
import { hooks } from './00-hooks.js';
import { R } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { addCoins } from './11-sao-va-mo-khoa.js';
import { go, render } from './13-giao-dien-chung.js';
import { pixelize, PXC, PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { pxCanvas } from './23-bien-pixel-dong-phia-sau-ban-do.js';
import { isl1, sayJ } from './30b-may-tieu-hoc.js';
import { curG } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { sfx } from './33b-am-thanh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { stopXG, XGN, xgRec } from './37-tro-choi-dot-1.js';
import { frogQ, frogSay, xcv, xpx } from './39-tro-choi-dot-3.js';
import { XG_ALL } from './39c-can-bang-tro-choi.js';
import { ktOf } from './39e-kien-thuc-tro-choi.js';
PXS.baitI=["..........kk....",".........kNk....","........kNk.....",".......kNk..b...","......kNk...b...",".....kNk....b...","....kNk.....b...","...kNk......kk..","..kNk......kwwk.","..kk.......kccc.","kkk..kkk...kcck.","kok.koook...kk..","kookoowkok......",".kookoooook.....","..kkkkkkkk......","................"];
Object.assign(XGN,{bait:['baitI','Thả mồi câu cá','Thả mồi, cá cắn câu thì trả lời đúng để kéo lên, 8 con cá']});
if(!XG_ALL.includes('bait'))XG_ALL.push('bait');
/* chọn trò: cho phép giống Ếch nhảy (nội dung lấy từ frogQ đã lọc kiến thức) */
{hooks.on('ktAllowed',_a=>function(x,mode){return _a.call(this,x,mode==='bait'?'frog':mode)})}
{hooks.on('ktOwn',_o=>function(x,mode){return _o.call(this,x,mode==='bait'?'frog':mode)})}
{hooks.on('xgElig',_e=>function(x){const r=_e.apply(this,arguments);if(r&&r.E&&r.E.includes('frog')&&!r.E.includes('bait'))r.E.push('bait');return r})}
{hooks.on('ktSample',_s=>function(x,mode,n){if(mode!=='bait')return _s.apply(this,arguments);return _s.call(this,x,'frog',n)})}

const BAIT_N=8,BAIT_T=120;
const BAIT_SKY=['#BFE9F8','#B2E5FA','#A3DFF8','#93D7F3','#A6D3EC','#F6D98B','#F6BE8E','#F1A08C','#C98AB0'];
const BAIT_SPEC=[['Cá chép','o'],['Cá rô','G'],['Cá trê','N'],['Cá vàng','a'],['Cá mè','b'],['Cá hồng','c'],['Cá lóc','k'],['Cá trắm','l']];
{hooks.on('startXG',_s=>function(mode,id){if(mode!=='bait')return _s.apply(this,arguments);try{speechSynthesis.cancel()}catch(e){}const x=isl1(id);XG_KT=x?ktOf(x):null;
  go({k:'xg',mode:'bait',id,score:0,caught:0,miss:0,lives:3,end:false,started:false,t0:Date.now(),t:BAIT_T,ph:'idle',pt:0,bx:80,q:null,tries:0,bad:[],
    say:'Thả mồi câu cá! Em chạm Thả mồi, chờ cá cắn câu rồi trả lời đúng để kéo cá lên nhé.'})})}
/* ---- màn hình ---- */
{hooks.on('viewXG',_v=>function(){const g=scr;if(g.mode!=='bait')return _v.apply(this,arguments);const st=S.st[sid],best=Math.max((st.mg||{})[`${g.id}:bait`]||0,g.score);
  if(g.end){const rec=g.score>(g.prev||0)&&g.score>0;
    return`<div class="game g1"><div class="gend xgend"><div class="xgendrow"><span class="bigicon">${spr('baitI',72)}</span>${jenny(72,g.score?'cheer':'sad')}</div><h1>${rec?'Kỷ lục mới!':g.caught>=BAIT_N?'Đầy thùng cá!':'Hết giờ!'}</h1>
     <p class="muted">Câu được <b>${g.caught}</b>/${BAIT_N} con cá · cá chạy mất ${g.miss} lần · kỷ lục ${best}</p><div class="xbbucket">${baitBucketHTML(g.caught)}</div>${g.coins?`<p class="earn">+${g.coins} xu</p>`:''}
     <div class="gendbtn"><button class="gobtn" type="button" onclick="startXG('bait','${g.id}')">Chơi lại</button><button class="gobtn ghost" type="button" onclick="go({k:'island',id:'${g.id}'})">Về đảo</button></div></div></div>`}
  return`<div class="game g1 mini xg xbait"><div class="gtop"><button class="gx" onclick="stopXG();go({k:'island',id:'${g.id}'})" aria-label="Thoát">✕</button><span class="mgsc">${spr('fish',22)} <b id="xbn">${g.caught}/${BAIT_N}</b></span><span class="grow"></span><span class="mgsc">${spr('clock',22)} <b id="xbtm">${g.t}</b></span></div>
   <div class="mgrule"><span id="xbst">${baitStatus(g)}</span><button class="g1spk" type="button" onclick="sayJ(scr.ph==='bite'&&scr.q?frogSay(scr.q):scr.say)" aria-label="Nghe lại">🔊</button></div>
   <div class="xbt" id="xbt"><canvas class="xpcv" id="xbcv" width="114" height="100" aria-hidden="true"></canvas><span class="xbban" id="xbban"></span></div>
   <div class="xbq" id="xbq"></div>
   <div class="xbact"><button type="button" class="gobtn xbcast" id="xbcast" onclick="baitCast()">${spr('baitI',26)} Thả mồi</button></div>
   <div id="xgfb" class="xgfb"></div></div>`})}
function baitBucketHTML(n){return`<span class="xbbk">${Array.from({length:Math.max(0,n)},(_,i)=>`<i>${spr('fshA'+(i%6),14)}</i>`).join('')||'<em>thùng trống</em>'}</span>`}
function baitStatus(g){return g.ph==='idle'?(g.caught?'Chạm <b>Thả mồi</b> để câu con tiếp theo':'Chạm <b>Thả mồi</b> để bắt đầu câu cá'):g.ph==='cast'?'Quăng cần…':g.ph==='wait'?'Đang chờ cá cắn câu…':g.ph==='bite'?(g.tries?'<b>Cá đang giãy!</b> Thử lại nhé':'<b>Cá cắn câu!</b> Trả lời đúng để kéo cá lên'):g.ph==='reel'?'<b>Kéo cá lên!</b>':g.ph==='escape'?'<b>Cá chạy mất rồi!</b> Thả lại mồi nhé':''}
function baitUI(){const g=scr;if(g.k!=='xg'||g.mode!=='bait'||g.end)return;const $=id=>document.getElementById(id);
  const st=$('xbst');if(st)st.innerHTML=baitStatus(g);const n=$('xbn');if(n)n.textContent=`${g.caught}/${BAIT_N}`;
  const c=$('xbcast');if(c)c.style.visibility=g.ph==='idle'?'visible':'hidden';
  const qb=$('xbq');if(qb){if(g.ph==='bite'&&g.q){const q=g.q;qb.innerHTML=`<div class="xbqt">${q.t}</div><div class="xbopts">${q.opts.map((o,i)=>`<button type="button" class="xbo" ${g.bad.includes(i)?'disabled':''} onclick="baitAns(${i})"><b>${o}</b></button>`).join('')}</div>`;try{pixelize(qb)}catch(e){}}else qb.innerHTML=''}}
/* ---- vẽ cảnh ---- */
function baitDraw(){const x=xcv('xbcv');if(!x)return;const g=scr,p=xpx(x),now=performance.now(),f=Math.floor(now/120),C=Math.min(BAIT_N,g.caught),el=now-g.pt;
  x.clearRect(0,0,114,100);
  /* trời đổi dần theo số cá */ const sky=BAIT_SKY[C];p(sky,0,0,114,36);for(let y=0;y<36;y+=6)p(y<18?sky:BAIT_SKY[Math.min(8,C+1)],0,y+3,114,1);
  /* mặt trời đi theo vòng cung */ {const sx=10+C*11,sy=4+Math.abs(C-4)*2;p(C>=6?'o':'y',sx,sy,6,6);p(C>=6?'O':'a',sx+1,sy+5,5,1);if(f%4<2)p('y',sx-2,sy+2,1,1)}
  /* mây trôi */ [[(f*0.4)%140-20,6],[((f*0.25)+60)%140-20,13]].forEach(([cx,cy])=>{cx=Math.round(cx);p('w',cx,cy,14,3);p('w',cx+3,cy-2,7,2)});
  /* bờ xa có cây */ p('G',0,32,114,5);for(let X=2;X<114;X+=9){p('G',X,28+(X%3),5,4);p('N',X+2,32,1,2)}
  /* nước */ const W=C>=6?['#7FC3D8','#5FAFC9','#4C9BB8','#3A86A3']:['#7FD3F0','#4FC2EA','#2FB0E0','#1F9AD0'];for(let y=37;y<100;y++)p(W[Math.min(3,Math.floor((y-37)/16))],0,y,114,1);
  for(let i=0;i<26;i++){const X=Math.floor((i*37+f*(1+i%3)*.6)%114),Y=40+((i*17)%56);if((i+f)%4)p('#E6FFF2',X,Y,1+(i%3),1)}
  /* lau sậy bên phải đung đưa */ [[104,52],[108,48],[111,55]].forEach(([X,Y],i)=>{const s=Math.round(Math.sin((f+i*3)/4));for(let k=0;k<14;k++)p('G',X+(k<5?s:0),Y+k,1,1);p('N',X+s,Y-3,1,4)});
  /* lá súng */ [[60,90],[92,84]].forEach(([X,Y],i)=>{const b=((f>>2)+i)%2;p('#2F9A6A',X,Y+b,10,3);p('#4FB884',X+2,Y+b,3,1)});
  /* vịt / rùa đi ngang ở một số lượt */ if(C===2||C===5){const dx=Math.round(((f*0.5)%150)-20),Y=C===2?44:47;if(C===2){p('w',dx,Y,7,3);p('w',dx+5,Y-3,3,3);p('a',dx+8,Y-2,2,1);p('k',dx+6,Y-2,1,1);p('#FFFFFF',dx-2,Y+3,11,1)}else{p('k',dx,Y,8,4);p('G',dx+1,Y,6,3);p('l',dx+2,Y+1,2,1);p('g',dx+8,Y+1,2,2)}}
  /* cầu gỗ + cọc */ p('k',0,63,40,1);for(let X=0;X<40;X+=5){p(X%10?'n':'u',X,64,5,4);p('N',X+4,64,1,4)}p('k',0,68,40,1);[4,20,35].forEach(X=>{p('N',X,69,3,26);p('k',X,69,1,26)});
  /* thùng cá */ {const bx=24,by=55;p('k',bx,by,11,9);p('E',bx+1,by+1,9,7);p('m',bx+1,by+1,9,1);p('k',bx+2,by-2,7,1);p('k',bx+2,by-2,1,2);p('k',bx+8,by-2,1,2);
    for(let i=0;i<Math.min(C,6);i++){const tx=bx+2+(i%3)*3,ty=by-1-Math.floor(i/3)*2;p(PXC[BAIT_SPEC[i%8][1]]?BAIT_SPEC[i%8][1]:'o',tx,ty,2,2);p('k',tx,ty-1,1,1)}}
  /* Jenny ngồi trên cầu */ x.drawImage(pxCanvas('jenny'),4,45);
  /* cần câu */ const T=[46,30];{const H=[19,56];let x0=H[0],y0=H[1];const dx=T[0]-x0,dy=T[1]-y0,n=Math.max(Math.abs(dx),Math.abs(dy));for(let k=0;k<=n;k++)p(k<n*.3?'N':'n',Math.round(x0+dx*k/n),Math.round(y0+dy*k/n),1,1);p('k',T[0],T[1]-1,1,1)}
  /* phao và dây */ let B=null,taut=false,show=true;
  const rest=[T[0]+2,T[1]+10],water=[g.bx,64];
  if(g.ph==='idle'){B=[rest[0],rest[1]+((f>>2)%2)];}
  else if(g.ph==='cast'){const t=Math.min(1,el/650);B=[T[0]+(water[0]-T[0])*t,T[1]+(water[1]-T[1])*t-Math.sin(t*Math.PI)*22];if(t>=1)B=water}
  else if(g.ph==='wait'){B=[water[0],water[1]+((f>>2)%2)];}
  else if(g.ph==='bite'){const jk=g.jerk&&now-g.jerk<400?((f%2)?2:-2):0;B=[water[0]+jk,water[1]+3+(f%2)];taut=true}
  else if(g.ph==='reel'){const t=Math.min(1,el/800);B=[water[0]+(28-water[0])*t,water[1]+(52-water[1])*t-Math.sin(t*Math.PI)*26];taut=true;if(t>=1)show=false}
  else if(g.ph==='escape'){B=[water[0],water[1]+((f>>1)%2)];}
  if(B&&show){/* dây */const sag=taut?0:6;for(let k=0;k<=24;k++){const t=k/24,lx=T[0]+(B[0]-T[0])*t,ly=T[1]+(B[1]-T[1])*t+Math.sin(t*Math.PI)*sag;p('#F1F3F8',Math.round(lx),Math.round(ly),1,1)}
    /* gợn sóng quanh phao */ if(g.ph==='wait'||g.ph==='bite'){const r=(f%6);x.globalAlpha=1-r/6;p('#FFFFFF',Math.round(B[0])-r-1,Math.round(water[1])+3,r*2+3,1);x.globalAlpha=1}
    /* phao đỏ trắng (khi kéo cá thì vẽ cá thay phao) */
    if(g.ph!=='reel'){const bx=Math.round(B[0]),by=Math.round(B[1]);p('k',bx-1,by-1,4,5);p('r',bx,by,2,2);p('w',bx,by+2,2,2)}}
  /* bóng cá bơi tới */ if(g.ph==='wait'&&g.shT&&now>g.shT){const t=Math.min(1,(now-g.shT)/900),sx=Math.round(114-(114-water[0]-3)*t),sy=water[1]+9;x.globalAlpha=.35;p('#0B4F6C',sx,sy,9,3);p('#0B4F6C',sx+9,sy-1,3,5);x.globalAlpha=1}
  /* cá mắc câu giãy */ const sp=BAIT_SPEC[(g.caught+g.miss)%8];
  if(g.ph==='bite'){const fx=Math.round(water[0])-7,fy=water[1]+3+((f%2)?-2:1);baitFish(x,fx,fy,sp[1],f%2);if(f%3===0){p('#FFFFFF',fx-2,fy-2,1,1);p('#FFFFFF',fx+12,fy-3,1,1)}}
  if(g.ph==='reel'&&B){baitFish(x,Math.round(B[0])-5,Math.round(B[1])+2,sp[1],f%2)}
  if(g.ph==='escape'){const t=Math.min(1,el/900);if(t<.4){const r=Math.round(t*20);p('#FFFFFF',water[0]-r,water[1]+2,2,1);p('#FFFFFF',water[0]+r,water[1]+2,2,1);p('#FFFFFF',water[0]-2,water[1]-r/2,1,1);p('#FFFFFF',water[0]+3,water[1]-r/2,1,1)}
    x.globalAlpha=.4;p('#0B4F6C',Math.round(water[0]+t*60),water[1]+9,9,3);x.globalAlpha=1}}
function baitFish(x,X,Y,c,flap){const p=xpx(x);/* thân 14×7, bụng sáng, mắt, vây, đuôi vẫy */p('k',X+1,Y,12,1);p('k',X,Y+1,14,5);p('k',X+1,Y+6,12,1);p(c,X+1,Y+1,12,3);p('w',X+2,Y+4,10,1);p(c,X+1,Y+4,1,1);p('k',X+5,Y+2,1,2);p('w',X+10,Y+1,2,2);p('k',X+11,Y+2,1,1);p('r',X+13,Y+3,1,1);/* đuôi */p('k',X-4,Y+(flap?-1:1),4,2);p(c,X-3,Y+(flap?0:2),2,3);p('k',X-4,Y+(flap?5:6),4,2)}
/* ---- điều khiển ---- */
function baitLoop(){const g=scr;stopXG();let sec=performance.now();
  xgLoop={tick:setInterval(()=>{if(scr!==g||g.end||!document.getElementById('xbcv')){stopXG();return}const now=performance.now();
    if(now-sec>=1000){sec=now;g.t--;const e=document.getElementById('xbtm');if(e)e.textContent=g.t;if(g.t>0&&g.t<=5)sfx('tick');if(g.t<=0){baitEnd();return}}
    /* chuyển pha theo thời gian */
    if(g.ph==='cast'&&now-g.pt>650){g.ph='wait';g.pt=now;sfx('splash');g.shT=now+R(700,1900);g.biteAt=g.shT+950;baitUI()}
    else if(g.ph==='wait'&&now>g.biteAt){g.ph='bite';g.pt=now;g.q=frogQ(isl1(g.id));g.tries=0;g.bad=[];sfx('catch');try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}baitUI();try{if(curG()<=2)sayJ('Cá cắn câu! '+frogSay(g.q))}catch(e){}}
    baitDraw()},120)}}
function baitCast(){const g=scr;if(g.k!=='xg'||g.mode!=='bait'||g.end||g.ph!=='idle')return;g.ph='cast';g.pt=performance.now();g.bx=R(70,92);sfx('tap');const fb=document.getElementById('xgfb');if(fb)fb.innerHTML='';baitUI()}
function baitAns(i){const g=scr;if(g.k!=='xg'||g.mode!=='bait'||g.end||g.ph!=='bite'||g.lockA)return;const q=g.q,ok=i===q.a;
  xgRec(ok,g.tries===0&&q.q?q.q:g.tries===0?{kind:'Tính nhẩm'}:null);g.tries++;const fb=document.getElementById('xgfb');
  if(ok){g.ph='reel';g.pt=performance.now();g.lockA=1;sfx('ok');if(fb)fb.innerHTML='<span class="ok">Đúng rồi! Kéo cá lên nào!</span>';baitUI();
    setTimeout(()=>{if(scr!==g||g.end)return;g.caught++;g.score=g.caught;sfx('coin');const b=document.getElementById('xbban');if(b){b.textContent=`Con cá ${g.caught}/${BAIT_N} ✓`;b.classList.remove('on');void b.offsetWidth;b.classList.add('on')}
      g.ph='idle';g.lockA=0;g.q=null;baitUI();if(fb)fb.innerHTML=`<span class="ok">Em câu được ${BAIT_SPEC[(g.caught-1+g.miss)%8][0].toLowerCase()}!</span>`;if(g.caught>=BAIT_N)setTimeout(()=>{if(scr===g&&!g.end)baitEnd()},1300)},850);return}
  sfx('bad');if(g.tries<2){g.bad.push(i);g.jerk=performance.now();if(fb)fb.innerHTML='<span class="bad">Chưa đúng. Cá đang giãy, em thử đáp án khác nhé!</span>';baitUI();return}
  g.ph='escape';g.pt=performance.now();g.miss++;g.lockA=1;sfx('splash');if(fb)fb.innerHTML=`<span class="bad">Cá chạy mất rồi! Đáp án đúng là <b>${q.opts[q.a]}</b>. Thả lại mồi nhé.</span>`;baitUI();
  setTimeout(()=>{if(scr!==g||g.end)return;g.ph='idle';g.lockA=0;g.q=null;baitUI()},1500)}
function baitEnd(){const g=scr;if(g.k!=='xg'||g.mode!=='bait'||g.end)return;stopXG();const st=S.st[sid];st.mg=st.mg||{};const key=`${g.id}:bait`;g.prev=st.mg[key]||0;st.mg[key]=Math.max(g.prev,g.score);
  g.coins=addCoins(sid,Math.min(20,g.score*2),'self');g.end=true;g.win=g.caught>=BAIT_N;log(sid,'passed',`Thả mồi câu cá · ${isl1(g.id).title}`,0,{success:true,score:{raw:g.score}});
  sfx(g.win?'win':'timeup');sayJ(g.win?'Đầy thùng cá rồi! Giỏi quá!':`Em câu được ${g.caught} con cá!`);save();render()}
{hooks.on('xgAfterRender',_ar=>function(){const g=scr;if(g.k==='xg'&&g.mode==='bait'){if(g.end)return;baitUI();baitDraw();if(!g.started){g.started=true;sayJ(g.say);baitLoop()}else if(!xgLoop)baitLoop();return}return _ar.apply(this,arguments)})}
{hooks.on('musicTheme',_mt=>function(){try{if(role==='hs'&&scr.k==='xg'&&scr.mode==='bait')return scr.end?null:'fish'}catch(e){}return _mt.apply(this,arguments)})}
(function(){const st=document.createElement('style');st.textContent=`
.xbait .xbt{position:relative;width:342px;height:300px;margin:4px auto;border:3px solid #1F2A5A;overflow:hidden}
.xbait .xbt canvas{position:absolute;inset:0;width:342px;height:300px;image-rendering:pixelated;image-rendering:crisp-edges}
.xbban{position:absolute;left:50%;top:10px;transform:translateX(-50%);z-index:3;font-family:var(--f-display,'VT323',monospace);font-size:24px;line-height:1;color:#1E8A4A;background:#DFF6E8;border:3px solid #1E8A4A;padding:2px 10px;white-space:nowrap;opacity:0;pointer-events:none}
.xbban.on{animation:xbban 1.6s steps(4) forwards}
@keyframes xbban{0%{opacity:0;transform:translate(-50%,-8px)}15%{opacity:1;transform:translate(-50%,0)}80%{opacity:1}100%{opacity:0}}
.game.mini.xbait>.xbq{width:min(336px,calc(100% - 28px))!important;max-width:336px!important;box-sizing:border-box}
.game.mini.xbait>.xbt{width:342px!important;max-width:342px!important}
.xbqt,.xbopts,.xbo{box-sizing:border-box}
.xbqt{font-family:var(--f-display,'VT323',monospace);font-size:24px;line-height:1.1;text-align:center;background:#FFF6D6;border:3px solid #1F2A5A;padding:4px 6px;margin:2px 0 6px;color:#1F2A5A}
.xbopts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.xbo{border:0;background:#FFFFFF;color:#1F2A5A;box-shadow:0 0 0 3px #1F2A5A,0 5px 0 0 #1F2A5A;min-height:46px;font-family:var(--f-display,'VT323',monospace);font-size:24px;cursor:pointer;padding:2px 4px;overflow:hidden}
.xbo b{font-weight:400;white-space:nowrap}
.xbo:active{transform:translateY(3px)}
.xbo:disabled{background:#E3E7F0;color:#9AA4C0;box-shadow:0 0 0 3px #9AA4C0;cursor:default}
.xbact{display:flex;justify-content:center;margin-top:6px}
.xbcast{display:inline-flex;align-items:center;gap:8px;min-width:200px;justify-content:center}
.xbbucket{display:flex;justify-content:center;margin:6px 0}
.xbbk{display:inline-flex;flex-wrap:wrap;gap:4px;justify-content:center;max-width:220px;padding:6px 8px;background:#E3E7F0;border:3px solid #1F2A5A}
.xbbk em{font-style:normal;color:#5E6B8C}
`;document.head.appendChild(st)})();
