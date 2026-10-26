/* ===================== Trò chơi nhỏ dạng pixel ===================== */
import { R } from './01-tien-ich.js';
import { PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { pxCanvas } from './23-bien-pixel-dong-phia-sau-ban-do.js';
import { sayJ } from './30b-may-tieu-hoc.js';
import { stopMini } from './31-5-tinh-nang-choi-them-tieu-hoc.js';
import { endMini } from './32-tinh-nang-choi-them-dat-trong-tung-dao.js';
import { hurtFx, sfx } from './33b-am-thanh.js';
import { jOutfit, ofVariant } from './33e-ho-chieu.js';
import { fishFrames } from './39i-nhan-dai.js';
PXS.fishO=PXS.fish.map(r=>r.replace(/b/g,'o'));PXS.fishY=PXS.fish.map(r=>r.replace(/b/g,'a'));PXS.fishP=PXS.fish.map(r=>r.replace(/b/g,'p'));PXS.fishG=PXS.fish.map(r=>r.replace(/b/g,'g'));
PXS.balloonG=PXS.balloon.map(r=>r.replace(/c/g,'g'));
PXS.burst=["....y....",".y..y..y.","..y.a.y..","...yay...","yyaawaayy","...yay...","..y.a.y..",".y..y..y.","....y...."];
PXS.puff=["..e.e..",".eeEee.","eeEEEee",".eEEEe.","eeEEEee",".eeEee.","..e.e.."];
PXS.cloud=["...wwww.....","..wwwwwww...",".wwwwwwwwww.","wwwwwwwwwwww",".eeeeeeeeee."];
function mgBg(f,mode){const Z=4,W=Math.ceil(f.clientWidth/Z),H=Math.ceil(f.clientHeight/Z);const cv=document.createElement('canvas');cv.className='mgbg';cv.width=W;cv.height=H;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;
  const bl=(n,px,py)=>x.drawImage(pxCanvas(n),Math.round(px),Math.round(py));let seed=5;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
  if(mode==='fish'){const B=['#9CE0F6','#6FD0F2','#3FC1EC','#1FA9DD','#1590C4'];B.forEach((c,i)=>{x.fillStyle=c;x.fillRect(0,Math.floor(i*H/5),W,Math.ceil(H/5)+1)});
    for(let i=1;i<5;i++){x.fillStyle=B[i-1];const y=Math.floor(i*H/5);for(let k=0;k<W;k+=4){x.fillRect(k,y,2,1)}}
    x.fillStyle='#F6D98B';x.fillRect(0,H-5,W,5);x.fillStyle='#E2B85E';for(let k=0;k<W;k+=3)x.fillRect(k,H-5,1,1);
    for(let i=0;i<W/14;i++)bl('weed',rnd()*W,H-11);for(let i=0;i<W/40;i++)bl('rock',rnd()*W,H-8);
    x.fillStyle='#fff';for(let i=0;i<W*H/220;i++)x.fillRect(Math.floor(rnd()*W),Math.floor(rnd()*(H-8)),2,1)}
  else{const B=['#BDEBFA','#CDF0FB','#DDF5FC','#EAF9FD'];B.forEach((c,i)=>{x.fillStyle=c;x.fillRect(0,Math.floor(i*H/4),W,Math.ceil(H/4)+1)});
    for(let i=0;i<W/30+1;i++)bl('cloud',rnd()*W,rnd()*H*.6);
    x.fillStyle='#2AB563';for(let k=0;k<W;k++){const h=6+Math.round(3*Math.sin(k/9)+2*Math.sin(k/4));x.fillRect(k,H-h,1,h)}x.fillStyle='#1E8A4A';for(let k=0;k<W;k+=5)x.fillRect(k,H-3,2,3)}
  f.appendChild(cv);
  if(mode==='fish'){for(let i=0;i<7;i++){const b=document.createElement('i');b.className='mgbub';b.style.left=(8+rnd()*84)+'%';b.style.animationDelay=(rnd()*4).toFixed(1)+'s';b.style.animationDuration=(3+rnd()*3).toFixed(1)+'s';f.appendChild(b)}
    const boat=document.createElement('div');boat.className='mgboat';boat.innerHTML=spr('boat',56)+`<span class="mgjen">${spr(typeof ofVariant==='function'?ofVariant('jenny',jOutfit()):'jenny',30)}</span>`;f.appendChild(boat)}}
export function miniAfterRender(){if(scr.k!=='mini'||scr.end||scr.started)return;scr.started=true;stopMini();const f=document.getElementById('mgf');if(!f)return;sayJ(scr.say);mgBg(f,scr.mode);
  const items=[];let last=0,spawnGap=2000,n=0;const W=()=>f.clientWidth,H=()=>f.clientHeight,fish=scr.mode==='fish';
  const FS=['fishO','fishY','fishP','fishG','fish'],BS=['balloon','balloonB','balloonP','balloonG'];
  const spawn=()=>{const it=scr._r.item(),el=document.createElement('button');el.type='button';n++;
    if(fish){el.className='mgi fishi';el.innerHTML=`${typeof fishFrames==='function'?fishFrames(n):spr(FS[n%FS.length],46,'mgsp flip')}<span class="mgt">${it.t}</span>`}
    else{el.className='mgi balloi';el.innerHTML=`${spr(BS[n%BS.length],132,'mgsp')}<span class="mgt">${it.t}</span>`}
    const sp=(fish?55:45)+Math.random()*35+(45-scr.t)*1.3;const o={el,ok:it.ok,x:fish?-140:R(6,Math.max(10,W()-90)),y:fish?R(70,Math.max(80,H()-90)):H()+10,v:sp,dead:false,ph:Math.random()*6};
    el.addEventListener('pointerdown',e=>{e.preventDefault();if(o.dead)return;o.dead=true;
      if(o.ok){scr.score++;sfx(fish?'catch':'pop');el.classList.add('pop');el.insertAdjacentHTML('beforeend',`<span class="mgfx">${spr('burst',56)}</span>`);document.getElementById('mgs').textContent=scr.score}
      else{scr.lives--;sfx(fish?'splash':'deflate');hurtFx(1);el.classList.add('wrong');el.insertAdjacentHTML('beforeend',`<span class="mgfx">${spr('puff',48)}</span>`);const l=document.getElementById('mgl');if(l)l.innerHTML=[0,1,2].map(i=>spr(i<scr.lives?'heart':'heartE',18)).join(' ');if(scr.lives<=0)setTimeout(endMini,350)}
      setTimeout(()=>el.remove(),380)});
    f.appendChild(el);items.push(o)};
  let prev=performance.now();
  const step=ts=>{if(!mgLoop)return;const dt=Math.min(.05,(ts-prev)/1000);prev=ts;if(ts-last>spawnGap&&items.filter(o=>!o.dead&&!o.gone).length<4){spawn();last=ts;spawnGap=Math.max(1400,spawnGap-6)}
    items.forEach(o=>{if(!o.el.isConnected)return;if(!o.dead){if(fish)o.x+=o.v*dt;else o.y-=o.v*dt}const bob=fish?Math.round(Math.sin(ts/300+o.ph)*3):Math.round(Math.sin(ts/500+o.ph)*4);
      o.el.style.transform=`translate(${Math.round(fish?o.x:o.x+bob)}px,${Math.round(fish?o.y+bob:o.y)}px)`;if(!o.dead&&((fish&&o.x>W()+20)||(!fish&&o.y<-130))){o.dead=true;o.el.remove()}});
    mgLoop.raf=requestAnimationFrame(step)};
  mgLoop={raf:requestAnimationFrame(step),tick:setInterval(()=>{scr.t--;const e=document.getElementById('mgt');if(e)e.textContent=scr.t;if(scr.t>0&&scr.t<=5)sfx('tick');if(scr.t<=0)endMini()},1000)}}

