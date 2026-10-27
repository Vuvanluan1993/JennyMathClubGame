/* ===================== CHƠI THÊM · ĐỢT 1 (lớp 1–5) ===================== */
/* 4 trò mới đặt trong trang đảo, mục "Chơi thêm":
   star  Hứng sao rơi   — luật của đảo (như Câu cá/Bóng bay), di giỏ hứng sao đúng luật, 60 giây, 3 tim.
   pair  Lật thẻ ghép đôi — 6 cặp phép tính ↔ kết quả lấy từ câu của đảo, 90 giây, lật sai không mất tim.
   tug   Kéo co với trùm  — câu của đảo (máy Đua giờ, cờ tug), đúng kéo về Jenny, sai/đứng yên 6 giây trùm kéo lại, 90 giây.
   clock Đồng hồ thần kì  — chỉ ở đảo học xem giờ; kéo kim hoặc bấm +/− cho đúng giờ, 8 lượt, 3 tim.
   Kỷ lục: st.mg[`${id}:${mode}`]. Xu: addCoins(…,'self') tối đa 20. Hồ sơ: mọi lượt trả lời vào st.dd; tug và clock vào cả st.sk. */
import { hooks } from './00-hooks.js';
import { esc, pick, R } from './01-tien-ich.js';
import { hd } from './02-hanh-dong.js';
import { MG, MGT } from './30a-dang-ky-khoi.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { addCoins } from './11-sao-va-mo-khoa.js';
import { go, render } from './13-giao-dien-chung.js';
import { shuf } from './21-lop-6-che-do-tro-choi.js';
import { PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { isl1, sayJ } from './30b-may-tieu-hoc.js';
import { curG } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { bossOf } from './30d-hinh-phang-va-cau-hoi.js';
import { fN } from './30e-hinh-hoc-so-lon.js';
import { mkQ } from './31-5-tinh-nang-choi-them-tieu-hoc.js';
import { islPool } from './32-tinh-nang-choi-them-dat-trong-tung-dao.js';
import { hurtFx, sfx } from './33b-am-thanh.js';
import { bossHTML } from './33c-trum-hoat-hinh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { jOutfit, ofVariant } from './33e-ho-chieu.js';
import { hsRec } from './35-ho-so.js';
Object.assign(PXS,{
 basket:["k..............k","kn............nk","knnnnnnnnnnnnnnk","kNnNnNnNnNnNnNnk","knNnNnNnNnNnNnNk","kNnNnNnNnNnNnNnk",".knnnnnnnnnnnnk.","..kkkkkkkkkkkk.."],
 cardB:["kkkkkkkkkk","kbbbbbbbbk","kbBbBbBbBk","kbbbbbbbbk","kbBbyybBbk","kbbbyybbbk","kbBbBbBbBk","kbbbbbbbbk","kkkkkkkkkk"],
 rope:["n","N"],
});
export const XGN={star:['star','Hứng sao rơi','Di giỏ hứng sao đúng luật trong 60 giây'],pair:['cardB','Lật thẻ ghép đôi','Ghép phép tính với kết quả, 6 cặp'],tug:['boss','Kéo co với trùm','Trả lời nhanh để kéo dây về phía Jenny'],clock:['clock','Đồng hồ thần kì','Xoay kim cho đúng giờ, 8 lượt']};
export const xgHash=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
export const xgTime=x=>{const t=`${x.title} ${x.lesson} ${x.goal}`;return /đồng hồ|xem giờ|giờ, phút|giờ\s*-\s*phút|lịch và giờ|giờ và phút|giờ đúng|giờ rưỡi|\bgiờ\b.*\bphút\b|Giờ, phút/i.test(t)};
export const xgRule=x=>{const g=curG();return!!(((x&&x.ti&&MGT[x.ti]&&MGT[x.ti][g])?MGT[x.ti][g]:MG[g])||{}).fish};
/* chọn 2–3 trò cho đảo: cố định theo mã đảo */
export const _islOptsOld=hooks.cu('islOpts');
export function islOpts2(...a){return hooks.goi('islOpts2',this,a)}
hooks.ham('islOpts2',function(x){const t=`${x.title} ${x.lesson} ${x.goal}`,old=_islOptsOld(x),c=[];
  const time=xgTime(x);if(time)c.push('clock');
  const pool=[];old.forEach(o=>pool.push(o));
  if(xgRule(x)&&(old.includes('fish')||old.includes('balloon')||!old.length))pool.push('star');
  if(x.tiet>1||/Luyện tập|Ôn tập/i.test(t))pool.push('tug');
  if(/cộng|trừ|nhân|chia|phép tính|Bảng|Các số|số|Phân số|phân số|thập phân|tính/i.test(t))pool.push('pair');
  if(!pool.length)pool.push('tug');
  const u=[...new Set(pool)],h=xgHash(x.id),r=u.map((_,i)=>u[(i+h)%u.length]);
  const target=h%3===0?2:3,out=[...c],nl=['pair','tug','star'].filter(o=>u.includes(o)),nw=nl.map((_,i)=>nl[(i+(h>>2))%nl.length]),od=r.filter(o=>!XGN[o]);
  /* xen kẽ trò mới và trò cũ để mỗi đảo một khác */
  for(let k=0;out.length<target&&k<Math.max(nw.length,od.length);k++){const a=(h>>3)%2?[nw[k],od[k]]:[od[k],nw[k]];a.forEach(o=>{if(o&&out.length<target&&!out.includes(o))out.push(o)})}
  return [...new Set(out)].slice(0,3)});
/* trang đảo: dựng lại mục Chơi thêm với cả trò cũ và mới */
{hooks.on('viewIsland1',_v=>function(){const save_=hooks.cu('islOpts');hooks.de('islOpts',()=>[]);let h;try{h=_v.apply(this,arguments)}finally{hooks.de('islOpts',save_)}
  const st=S.st[sid],x=isl1(scr.id),mg=st.mg||{},opts=islOpts2(x);
  const OPT={fish:['fish','Câu cá','Câu cá theo luật của đảo trong 45 giây',hd.attr('startMini','fish',x.id),mg[`${x.id}:fish`]],balloon:['balloon','Bóng bay','Bắn bóng theo luật của đảo trong 45 giây',hd.attr('startMini','balloon',x.id),mg[`${x.id}:balloon`]],race:['clock','Đua giờ 60 giây','Làm liên tục câu của đảo này, có bảng xếp hạng lớp',hd.attr('startRace',x.id),(st.race||{})[x.id]]};
  Object.keys(XGN).forEach(k=>{const [s,n,d]=XGN[k];OPT[k]=[k==='tug'?bossOf(x.id)[0]:s,n,d,hd.attr('startXG',k,x.id),mg[`${x.id}:${k}`]]});
  const sec=opts.length?`<h3 class="isec">Chơi thêm <span class="pill">tùy chọn</span></h3><div class="oplist">${opts.map(o=>{const [sp,n,d,act,best]=OPT[o];return`<button class="opt${XGN[o]?' xgnew':''}" type="button" ${act}>${spr(sp,34)}<span><b>${n}</b><small>${d}</small></span><em>${best?'Kỷ lục '+best:'Chơi'}</em></button>`}).join('')}</div>`:'';
  return h.replace(/<\/div><\/div>\s*$/,sec+'</div></div>')})}

/* ---------- khung chung ---------- */
globalThis.xgLoop=null;
export function stopXG(){if(xgLoop){cancelAnimationFrame(xgLoop.raf);clearInterval(xgLoop.tick);clearTimeout(xgLoop.to);if(xgLoop.off)xgLoop.off();xgLoop=null}}
{hooks.on('go',_go=>function(){stopXG();return _go.apply(this,arguments)})}
export function xgRec(...a){return hooks.goi('xgRec',this,a)}
hooks.ham('xgRec',function(ok,q){try{if(q)hsRec(q,ok,true,1,scr.id);else hsRec({},ok,false,1,scr.id)}catch(e){}});
export function xgHearts(){const l=document.getElementById('xgl');if(l)l.innerHTML=[0,1,2].map(i=>spr(i<scr.lives?'heart':'heartE',18)).join(' ')}
export function startXG(...a){return hooks.goi('startXG',this,a)}
hooks.ham('startXG',function(mode,id){try{speechSynthesis.cancel()}catch(e){}const x=isl1(id);
  if(mode==='tug')return startTug(id);
  const base={k:'xg',mode,id,score:0,lives:3,end:false,started:false,t0:Date.now()};
  if(mode==='star'){const g=curG(),src=((x&&x.ti&&MGT[x.ti]&&MGT[x.ti][g])?MGT[x.ti][g]:MG[g]),r=(src.fish||src.balloon)();const fx=t=>String(t||'').replace(/^(Câu cá|Câu|Bắn bóng|Bắn|Chạm)\s+(?:con\s+cá\s+|cá\s+|quả\s+bóng\s+|bóng\s+)?/i,'Hứng sao ');go({...base,t:60,rule:fx(r.rule),say:'Hứng sao rơi! '+fx(r.say)});scr._r=r;return}
  if(mode==='pair'){const cards=pairDeck(x);go({...base,t:90,cards,open:[],done:[],miss:0,say:'Lật hai thẻ để ghép phép tính với kết quả đúng nhé.'});return}
  if(mode==='clock'){const rounds=Array.from({length:8},()=>clockTarget(curG()));go({...base,rounds,ri:0,h:12,m:0,ok:0,say:`Đồng hồ thần kì! Em xoay kim cho đồng hồ chỉ ${clockWords(rounds[0])} nhé.`});return}});
function xgEnd(){const g=scr;if(g.k!=='xg'||g.end)return;stopXG();const st=S.st[sid];st.mg=st.mg||{};const key=`${g.id}:${g.mode}`;g.prev=st.mg[key]||0;st.mg[key]=Math.max(g.prev,g.score);
  const c=g.mode==='star'?g.score:g.mode==='pair'?Math.round(g.score/5):g.score*2;g.coins=addCoins(sid,Math.min(20,c),'self');g.end=true;
  log(sid,'passed',`${XGN[g.mode][1]} · ${isl1(g.id).title}`,0,{success:true,score:{raw:g.score}});
  const win=g.mode==='pair'?g.done.length===g.cards.length:g.mode==='clock'?g.lives>0:g.lives>0;g.win=win;sfx(win?'win':g.lives<=0?'lose':'timeup');
  sayJ(g.mode==='pair'?(win?`Em ghép xong rồi! Được ${g.score} điểm.`:`Hết giờ! Em ghép được ${g.done.length/2} cặp.`):g.mode==='clock'?`Em đặt đúng ${g.score} đồng hồ!`:`Em hứng được ${g.score} ngôi sao!`);save();render()}
function viewXG(...a){return hooks.goi('viewXG',this,a)}
hooks.ham('viewXG',function(){const g=scr,st=S.st[sid],best=Math.max((st.mg||{})[`${g.id}:${g.mode}`]||0,g.score),[sp,nm]=XGN[g.mode];
  if(g.end){const rec=g.score>(g.prev||0)&&g.score>0;const line=g.mode==='pair'?`Ghép ${g.done.length/2}/6 cặp · lật sai ${g.miss} lần · ${g.score} điểm`:g.mode==='clock'?`Đúng <b>${g.score}</b>/${g.rounds.length} đồng hồ`:`Hứng đúng <b>${g.score}</b> ngôi sao`;
    return`<div class="game g1"><div class="gend xgend"><div class="xgendrow"><span class="bigicon">${spr(sp,72)}</span>${jenny(72,g.win||g.score?'cheer':'sad')}</div><h1>${rec?'Kỷ lục mới!':g.win?'Giỏi quá!':'Hết lượt!'}</h1><p class="muted">${line} · kỷ lục ${best}</p>${g.coins?`<p class="earn">+${g.coins} xu</p>`:''}<div class="gendbtn"><button class="gobtn" type="button" data-act="startXG" ${hd.arg(String(g.mode),String(g.id))}>Chơi lại</button><button class="gobtn ghost" type="button" data-act="go-island-3" ${hd.arg(String(g.id))}>Về đảo</button></div></div></div>`}
  const top=`<div class="gtop"><button class="gx" data-act="stopXG-go-island" ${hd.arg(String(g.id))} aria-label="Thoát">✕</button><span class="mgsc">${spr('star',22)} <b id="xgs">${g.mode==='pair'?g.done.length/2+'/6':g.score}</b></span><span class="grow"></span>${g.mode==='clock'?`<span class="mgsc">${spr('clock',22)} <b id="xgr">${g.ri+1}/${g.rounds.length}</b></span>`:`<span class="mgsc">${spr('clock',22)} <b id="xgt">${g.t}</b></span>`}${g.mode==='pair'?'':`<span class="hearts" id="xgl">${[0,1,2].map(i=>spr(i<g.lives?'heart':'heartE',18)).join(' ')}</span>`}</div>`;
  if(g.mode==='star')return`<div class="game g1 mini xg">${top}<div class="mgrule"><span>${g.rule}</span><button class="g1spk" type="button" data-act="sayJ-3" aria-label="Nghe lại">🔊</button></div><div class="mgf xgstar" id="xgf" tabindex="0" aria-label="Sân chơi: kéo hoặc chạm hai bên để di giỏ"></div></div>`;
  if(g.mode==='pair')return`<div class="game g1 mini xg">${top}<div class="mgrule"><span>Lật 2 thẻ: ghép phép tính với kết quả</span><button class="g1spk" type="button" data-act="sayJ-3" aria-label="Nghe lại">🔊</button></div><div class="xgpair" id="xgp">${g.cards.map((c,i)=>{const up=g.open.includes(i)||g.done.includes(i);return`<button type="button" class="xgc ${up?'up':''} ${g.done.includes(i)?'ok':''} ${c.k==='a'?'ans':''}" data-act="pairFlip" ${hd.arg(i)} aria-label="${up?esc(c.t):'Thẻ úp'}"><span class="xgcb">${spr('cardB',54)}</span><span class="xgcf">${c.t}</span></button>`}).join('')}</div><p class="muted xgmiss">Lật sai: <b id="xgm">${g.miss}</b> lần</p></div>`;
  if(g.mode==='clock'){const r=g.rounds[g.ri],G=curG();return`<div class="game g1 mini xg">${top}<div class="mgrule"><span>Xoay kim cho đồng hồ chỉ <b>${clockText(r)}</b></span><button class="g1spk" type="button" data-act="sayJ-3" aria-label="Nghe lại">🔊</button></div>
    <div class="xgclock"><div class="xgface" id="xgface">${clockBig(g.h,g.m)}</div>
    <div class="xgctl"><div class="xgrow"><span>Kim giờ</span><button type="button" class="xgb" data-act="clockStep-h-1" aria-label="Lùi kim giờ">−</button><button type="button" class="xgb" data-act="clockStep-h-1-2" aria-label="Tiến kim giờ">+</button></div>
    ${G>=2?`<div class="xgrow"><span>Kim phút</span><button type="button" class="xgb" data-act="clockStep-m-1" aria-label="Lùi kim phút">−</button><button type="button" class="xgb" data-act="clockStep-m-1-2" aria-label="Tiến kim phút">+</button>${G>=3?`<button type="button" class="xgb sm" data-act="clockStep-m-5">−5</button><button type="button" class="xgb sm" data-act="clockStep-m-5-2">+5</button>`:''}</div>`:''}
    <button type="button" class="gobtn xgchk" data-act="clockCheck">Kiểm tra</button></div></div><div id="xgfb" class="xgfb"></div></div>`}
  return''});
{hooks.on('viewHS',_vh=>function(){try{const st=S.st[sid];if(st&&st.grade<=5&&scr.k==='xg')return viewXG()}catch(e){}return _vh.apply(this,arguments)})}
{hooks.on('render',_r=>function(){const a=_r.apply(this,arguments);try{if(role==='hs'&&scr.k==='xg')document.body.classList.toggle('gaming',true);xgAfterRender();tugAfterRender()}catch(e){console.error(e)}return a})}
{hooks.on('musicTheme',_mt=>function(){try{if(role==='hs'){if(scr.k==='xg')return scr.end?null:({star:'balloon',pair:'game',clock:'fish'})[scr.mode];if(scr.k==='game'&&scr.tug&&!scr.end&&!(scr.sheet&&scr.sheet.kind!=='ok'))return'boss'}}catch(e){}return _mt.apply(this,arguments)})}
function xgAfterRender(...a){return hooks.goi('xgAfterRender',this,a)}
hooks.ham('xgAfterRender',function(){const g=scr;if(g.k!=='xg'||g.end)return;if(g.mode==='clock')clockBind();if(g.started)return;g.started=true;stopXG();sayJ(g.say);
  if(g.mode==='star')return starRun();
  xgLoop={tick:setInterval(()=>{if(scr!==g||g.end)return stopXG();if(g.mode==='pair'){g.t--;const e=document.getElementById('xgt');if(e)e.textContent=g.t;if(g.t>0&&g.t<=5)sfx('tick');if(g.t<=0)xgEnd()}},1000)}});

/* ---------- 1. HỨNG SAO RƠI ---------- */
function starBg(f){const Z=4,W=Math.ceil(f.clientWidth/Z),H=Math.ceil(f.clientHeight/Z),cv=document.createElement('canvas');cv.className='mgbg';cv.width=W;cv.height=H;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;
  ['#1F2A5A','#24326B','#2B3B7C','#33458C'].forEach((c,i)=>{x.fillStyle=c;x.fillRect(0,Math.floor(i*H/4),W,Math.ceil(H/4)+1)});let s=9;const rn=()=>(s=(s*9301+49297)%233280)/233280;
  for(let i=0;i<W*H/60;i++){x.fillStyle=rn()<.2?'#FCD655':'#E3E7F0';x.fillRect(Math.floor(rn()*W),Math.floor(rn()*(H-10)),1,1)}
  x.fillStyle='#FFF6D6';x.fillRect(W-16,4,8,8);x.fillStyle='#1F2A5A';x.fillRect(W-13,4,5,5);
  x.fillStyle='#5E3A7A';for(let k=0;k<W;k++){const h=4+Math.round(2*Math.sin(k/7)+Math.sin(k/3));x.fillRect(k,H-h,1,h)}f.appendChild(cv)}
function starHit(ok,el){const g=scr;if(g.end)return;xgRec(ok);
  if(ok){g.score++;sfx('catch');document.getElementById('xgs').textContent=g.score;if(el)el.insertAdjacentHTML('beforeend',`<span class="mgfx">${spr('burst',48)}</span>`)}
  else{g.lives--;sfx('bad');hurtFx(1);xgHearts();if(el){el.classList.add('wrong');el.insertAdjacentHTML('beforeend',`<span class="mgfx">${spr('puff',42)}</span>`)}if(g.lives<=0)setTimeout(xgEnd,350)}}
function starRun(){const g=scr,f=document.getElementById('xgf');if(!f)return;starBg(f);
  const bk=document.createElement('div');bk.className='xgbask';bk.innerHTML=spr('basket',84)+`<span class="xgbj">${spr(typeof ofVariant==='function'?ofVariant('jenny',jOutfit()):'jenny',34)}</span>`;f.appendChild(bk);
  const W=()=>f.clientWidth,H=()=>f.clientHeight,BW=84;let bx=W()/2-BW/2,tx=bx,vx=0;const items=[];let last=0,gap=2300,prev=performance.now();
  const mk=document.createElement('div');mk.className='xgmark';f.appendChild(mk);
  const setT=cx=>{tx=Math.max(0,Math.min(W()-BW,cx-BW/2))};
  const pd=e=>{e.preventDefault();const r=f.getBoundingClientRect();setT(e.clientX-r.left);mk.style.left=Math.round(tx+BW/2-8)+'px';mk.classList.remove('on');void mk.offsetWidth;mk.classList.add('on')};
  const pm=e=>{if(e.buttons||e.pointerType==='touch'){const r=f.getBoundingClientRect();setT(e.clientX-r.left)}};
  const kd=e=>{if(e.key==='ArrowLeft'){tx=Math.max(0,tx-60);e.preventDefault()}if(e.key==='ArrowRight'){tx=Math.min(W()-BW,tx+60);e.preventDefault()}};
  f.addEventListener('pointerdown',pd);f.addEventListener('pointermove',pm);addEventListener('keydown',kd);
  const spawn=()=>{const it=g._r.item(),el=document.createElement('div');el.className='xgsi';el.innerHTML=`${spr('star',66,'mgsp')}<span class="mgt">${it.t}</span>`;f.appendChild(el);items.push({el,ok:it.ok,x:R(4,Math.max(6,W()-70)),y:-70,v:70+Math.random()*40+(60-g.t)*1.4,dead:false})};
  const step=ts=>{if(!xgLoop||scr!==g||g.end)return;const dt=Math.min(.05,(ts-prev)/1000);prev=ts;if(ts-last>gap&&items.filter(o=>!o.dead).length<3){spawn();last=ts;gap=Math.max(1700,gap-6)}
    /* giỏ có quán tính: tăng tốc dần về chỗ chạm, nghiêng theo hướng chạy, hãm lại khi tới */
    {const d=tx-bx;vx+=d*dt*14-vx*dt*3.2;vx=Math.max(-260,Math.min(260,vx));bx+=vx*dt;if(bx<0){bx=0;vx=-vx*.3}if(bx>W()-BW){bx=W()-BW;vx=-vx*.3}if(Math.abs(d)<1&&Math.abs(vx)<6){bx=tx;vx=0}}
    bk.style.transform=`translate(${Math.round(bx)}px,0) rotate(${Math.max(-14,Math.min(14,vx*.06)).toFixed(1)}deg)`;const top=H()-62;
    items.forEach(o=>{if(o.dead)return;o.y+=o.v*dt;o.el.style.transform=`translate(${Math.round(o.x)}px,${Math.round(o.y)}px)`;
      if(o.y+56>=top&&o.y<top+20&&o.x+52>bx&&o.x+12<bx+BW){o.dead=true;starHit(o.ok,o.el);o.el.classList.add('pop');setTimeout(()=>o.el.remove(),380)}
      else if(o.y>H()){o.dead=true;o.el.remove()}});
    xgLoop.raf=requestAnimationFrame(step)};
  xgLoop={raf:requestAnimationFrame(step),tick:setInterval(()=>{if(scr!==g||g.end)return;g.t--;const e=document.getElementById('xgt');if(e)e.textContent=g.t;if(g.t>0&&g.t<=5)sfx('tick');if(g.t<=0)xgEnd()},1000),
    off:()=>{f.removeEventListener('pointerdown',pd);f.removeEventListener('pointermove',pm);removeEventListener('keydown',kd)}}}

/* ---------- 2. LẬT THẺ GHÉP ĐÔI ---------- */
export const xgTxt=h=>String(h||'').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
export function pairFromQ(q){if(!q||q.pic||q.big)return null;const raw=String(q.q||'');if(/<svg|<img|<canvas|class="(pic|shp)/i.test(raw))return null;
  let t=xgTxt(raw).replace(/\s*=\s*(\?|☐|\.\.\.|…)\s*$/,'').replace(/^(Tính|Tính nhẩm|Điền số|Số)\s*:?\s*/i,'');
  if(!t||t.length>13||/[a-zà-ỹ]{4,}/i.test(t.replace(/×|:/g,'')))return null;
  /* thẻ phép tính phải là phép tính trọn vẹn (không có ô trống, dấu =, dấu ?) — kết quả mới đúng là giá trị của nó */
  if(/[☐□?=…_]|\.\.\./.test(t))return null;if(!/[+\-−×:x\/]/.test(t))return null;
  let a=q.type==='num'?fN(q.a):q.type==='opt'&&typeof q.a==='string'?xgTxt(q.a):null;if(a==null||!String(a).length||String(a).length>8)return null;return[t,String(a)]}
export function pairFacts(...a){return hooks.goi('pairFacts',this,a)}
hooks.ham('pairFacts',function(x,n){const g=curG(),t=`${x.title} ${x.lesson} ${x.goal}`,out=[];const mul=/nhân|chia|Bảng/i.test(t)||g===3;
  for(let i=0;i<60&&out.length<n;i++){let q,a;
    if(g===1){const s=R(3,10),p=R(0,s);if(Math.random()<.5){q=`${p} + ${s-p}`;a=s}else{q=`${s} − ${p}`;a=s-p}}
    else if(g===2&&!mul){const s=R(20,99),p=R(5,s-5);if(Math.random()<.5){q=`${p} + ${s-p}`;a=s}else{q=`${s} − ${p}`;a=s-p}}
    else if(mul||g===2){const u=R(2,g===2?5:9),v=R(2,9);if(Math.random()<.5){q=`${u} × ${v}`;a=u*v}else{q=`${u*v} : ${u}`;a=v}}
    else if(g===4){const u=R(11,99),v=R(2,9);if(Math.random()<.5){q=`${u} × ${v}`;a=u*v}else{q=`${u*10} : 10`;a=u}}
    else{const u=R(1,9),v=R(1,9);if(Math.random()<.5){q=`0,${u} + 0,${v}`;const s=u+v;a=s>=10?`1,${s-10}`.replace(/,0$/,''):`0,${s}`}else{q=`${u},5 × 2`;a=fN(u*2+1)}}
    out.push([q,String(fN(a))])}return out});
export function pairDeck(...a){return hooks.goi('pairDeck',this,a)}
hooks.ham('pairDeck',function(x){const pool=islPool(x),pairs=[],seenA=new Set(),seenQ=new Set();
  for(let i=0;i<120&&pairs.length<6&&pool.length;i++){let q;try{q=mkQ(pick(pool))}catch(e){continue}const p=pairFromQ(q);if(p&&!seenA.has(p[1])&&!seenQ.has(p[0])){seenA.add(p[1]);seenQ.add(p[0]);pairs.push({p,q})}}
  if(pairs.length<6)pairFacts(x,40).forEach(p=>{if(pairs.length<6&&!seenA.has(p[1])&&!seenQ.has(p[0])){seenA.add(p[1]);seenQ.add(p[0]);pairs.push({p,q:null})}});
  const cards=[];pairs.forEach((o,i)=>{cards.push({id:i,k:'q',t:esc(o.p[0]),q:o.q});cards.push({id:i,k:'a',t:esc(o.p[1]),q:o.q})});return shuf(cards)});
function pairFlip(i){const g=scr;if(g.k!=='xg'||g.mode!=='pair'||g.end||g.lock||g.done.includes(i)||g.open.includes(i))return;g.open.push(i);sfx('card');
  if(g.open.length===2){const [a,b]=g.open,A=g.cards[a],B=g.cards[b],ok=A.id===B.id&&A.k!==B.k;
    if(ok){g.done.push(a,b);g.open=[];sfx('ok');xgRec(true,A.q?{...A.q,kind:A.q.kind}:null);g.score=g.done.length/2*10;if(g.done.length===g.cards.length){g.score+=Math.max(0,Math.round(g.t/2))-g.miss*2;g.score=Math.max(g.done.length/2*5,g.score);pairPaint();setTimeout(xgEnd,600);return}}
    else{g.miss++;g.lock=1;sfx('bad');xgRec(false);setTimeout(()=>{if(scr!==g)return;g.open=[];g.lock=0;pairPaint()},800)}}
  pairPaint()}
function pairPaint(){const g=scr,p=document.getElementById('xgp');if(!p)return;[...p.children].forEach((el,i)=>{const up=g.open.includes(i)||g.done.includes(i);el.classList.toggle('up',up);el.classList.toggle('ok',g.done.includes(i));el.classList.toggle('bad',g.open.length===2&&g.open.includes(i)&&!g.done.includes(i));el.setAttribute('aria-label',up?xgTxt(g.cards[i].t):'Thẻ úp')});
  const s=document.getElementById('xgs');if(s)s.textContent=g.done.length/2+'/6';const m=document.getElementById('xgm');if(m)m.textContent=g.miss}

/* ---------- 3. KÉO CO VỚI TRÙM (dùng máy Đua giờ) ---------- */
function startTug(id){const x=isl1(id),pool=islPool(x);clearInterval(raceTick);v1Said='';go({k:'game',g1:1,race:1,tug:1,id,pool,qs:[mkQ(pick(pool))],j:0,hearts:3,ok:0,bad:0,tries:0,res:[],sheet:null,picks:[],seq:[],fill:[],used:[],cnt:0,t:90,inp:'',t0:Date.now(),started:false,rope:0,idle:0})}
const TUGW=5;
function tugBar(g){const b=bossOf(g.id),p=g.rope/TUGW;return`<div class="xgtug" aria-label="Dây kéo co: ${g.rope>0?'Jenny đang thắng':g.rope<0?'trùm đang thắng':'cân bằng'}"><span class="xgtj">${jenny(52,g.rope>=0?(g.flash==='ok'?'happy':'idle'):'sad')}</span>
  <span class="xgtr"><span class="xgtl"></span><span class="xgtm" style="left:${50-p*40}%"></span><span class="xgtz j"></span><span class="xgtz b"></span></span>
  <span class="xgtb">${bossHTML(b[0],52,g.flash==='ok'?'hit':g.flash==='bad'?'mad':'idle',Math.max(.05,(TUGW-g.rope)/(2*TUGW)))}</span></div>`}
function tugAfterRender(){const g=scr;if(g.k!=='game'||!g.tug||g.end)return;const top=document.querySelector('.game .gtop');if(top&&!document.querySelector('.xgtug'))top.insertAdjacentHTML('afterend',tugBar(g))}
{hooks.on('raceAfterRender',_rar=>function(){const g=scr;if(g.k==='game'&&g.tug){if(g.end||g.started)return;g.started=true;clearInterval(raceTick);sayJ('Kéo co với trùm! Trả lời đúng để kéo dây về phía Jenny.');
  raceTick=setInterval(()=>{if(scr!==g||g.end){clearInterval(raceTick);return}g.t--;g.idle++;const e=document.getElementById('rtime');if(e)e.textContent=g.t;if(g.t>0&&g.t<=10)sfx(g.t%2?'tick':'tock');
    if(g.idle>=6){g.idle=0;g.rope--;g.flash='bad';sfx('bossmad');const bar=document.querySelector('.xgtug');if(bar)bar.outerHTML=tugBar(g);if(g.rope<=-TUGW)return endTug()}
    if(g.t<=0)endTug()},1000);return}return _rar.apply(this,arguments)})}
{hooks.on('raceAns',_ra=>function(ok){const g=scr;if(g.tug){if(g.fin)return;g.rope=Math.max(-TUGW,Math.min(TUGW,g.rope+(ok?1:-1)));g.idle=0;const r=_ra.apply(this,arguments);if(ok)sfx('hit');if(g.rope>=TUGW||g.rope<=-TUGW){g.fin=1;setTimeout(endTug,250)}return r}return _ra.apply(this,arguments)})}
{hooks.on('ans1',_a=>function(){const tug=scr&&scr.tug,n=S.events.length,r=_a.apply(this,arguments);if(tug){try{const ev=S.events[n];if(ev&&ev.verb.id.endsWith('answered')){const nm=`Kéo co · ${isl1(scr.id).title}`;ev.object.definition.name.vi=nm;ev.object.id='jenny:'+encodeURIComponent(nm)}}catch(e){}}return r})}
function endTug(){const g=scr,st=S.st[sid];if(!g.tug||g.end)return;clearInterval(raceTick);g.end=true;g.win=g.rope>0;st.mg=st.mg||{};const key=`${g.id}:tug`;g.prev=st.mg[key]||0;g.score=g.ok;st.mg[key]=Math.max(g.prev,g.ok);
  g.coins=addCoins(sid,Math.min(20,g.ok*2+(g.win?4:0)),'self');log(sid,'passed',`Kéo co với trùm · ${isl1(g.id).title}`,0,{success:g.win,score:{raw:g.ok}});sfx(g.win?'bossdown':'bosslaugh');setTimeout(()=>sfx(g.win?'win':'lose'),700);
  sayJ(g.win?'Jenny thắng rồi! Em giỏi quá!':'Trùm thắng mất rồi. Mình chơi lại nhé!');save();render()}
{hooks.on('viewEndExtra',_ve=>function(){const g=scr;if(g.tug){const b=bossOf(g.id),best=Math.max(g.prev||0,g.ok);
  return`<div class="game g1"><div class="gend xgend"><div class="xgtend">${jenny(72,g.win?'cheer':'sad')}${bossHTML(b[0],72,g.win?'dead':'win')}</div><h1>${g.win?'Jenny thắng!':'Trùm thắng rồi!'}</h1><p class="muted">Đúng <b>${g.ok}</b> câu, sai ${g.bad} câu · kỷ lục ${best}</p>${g.coins?`<p class="earn">+${g.coins} xu</p>`:''}<div class="gendbtn"><button class="gobtn" type="button" data-act="startTug" ${hd.arg(String(g.id))}>Chơi lại</button><button class="gobtn ghost" type="button" data-act="go-island-3" ${hd.arg(String(g.id))}>Về đảo</button></div></div></div>`}return _ve.apply(this,arguments)})}

/* ---------- 4. ĐỒNG HỒ THẦN KÌ ---------- */
export function clockTarget(...a){return hooks.goi('clockTarget',this,a)}
hooks.ham('clockTarget',function(G){const h=R(1,12);if(G<=1)return{h,m:0};if(G===2)return{h,m:pick([0,15,30,45,0,30,5,10,20,25,35,40,50,55])};return{h,m:R(0,59)}});
const clockText=r=>r.m===0?`${r.h} giờ`:r.m===30&&curG()<=2?`${r.h} giờ rưỡi`:`${r.h} giờ ${r.m} phút`;
const clockWords=r=>clockText(r);
function clockBig(h,m){const c=100,R0=86,hr=((h%12)+m/60)*30*Math.PI/180,mr=m*6*Math.PI/180,P=(a,l)=>[c+l*Math.sin(a),c-l*Math.cos(a)];
  const hand=(a,l,w,col,cls)=>{const n=Math.round(l/4);let o='';for(let i=1;i<=n;i++){const [x,y]=P(a,i*4);o+=`<rect x="${Math.round(x-w/2)}" y="${Math.round(y-w/2)}" width="${w}" height="${w}" fill="${col}"/>`}return`<g class="${cls}">${o}</g>`};
  let ticks='';for(let i=0;i<60;i++){const [x,y]=P(i*6*Math.PI/180,R0-6),big=i%5===0;ticks+=`<rect x="${Math.round(x-(big?3:1))}" y="${Math.round(y-(big?3:1))}" width="${big?6:2}" height="${big?6:2}" fill="${big?'#1F2A5A':'#9AA4C0'}"/>`}
  let nums='';for(let i=1;i<=12;i++){const [x,y]=P(i*30*Math.PI/180,R0-22);nums+=`<text x="${Math.round(x)}" y="${Math.round(y+7)}" text-anchor="middle" font-family="VT323,monospace" font-size="22" fill="#1F2A5A">${i}</text>`}
  return`<svg viewBox="0 0 200 200" width="230" height="230" shape-rendering="crispEdges" role="img" aria-label="Đồng hồ đang chỉ ${h} giờ ${m} phút"><rect x="8" y="8" width="184" height="184" fill="#1F2A5A"/><rect x="14" y="14" width="172" height="172" fill="#FFF6D6"/><rect x="20" y="20" width="160" height="160" fill="#FFFFFF"/>${ticks}${nums}${hand(mr,74,5,'#0079C1','mh')}${hand(hr,48,8,'#F04A1B','hh')}<rect x="${c-6}" y="${c-6}" width="12" height="12" fill="#1F2A5A"/><rect x="${c-2}" y="${c-2}" width="4" height="4" fill="#FCD655"/></svg>`}
function clockPaint(){const f=document.getElementById('xgface');if(f)f.innerHTML=clockBig(scr.h,scr.m)}
function clockStep(k,d){const g=scr;if(g.end)return;if(k==='h'){g.h=((g.h-1+d)%12+12)%12+1}else{let t=g.m+d;if(t>=60){t-=60;g.h=g.h%12+1}if(t<0){t+=60;g.h=((g.h-2)%12+12)%12+1}g.m=t}sfx('tick');clockPaint()}
function clockBind(){const f=document.getElementById('xgface');if(!f||f._b)return;f._b=1;let drag=null;const G=curG();
  const ang=e=>{const r=f.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;return[(Math.atan2(x,-y)*180/Math.PI+360)%360,Math.hypot(x,y)/(r.width/2)]};
  f.addEventListener('pointerdown',e=>{e.preventDefault();const [a,d]=ang(e);drag=G<=1?'h':d<.62?'h':'m';try{f.setPointerCapture(e.pointerId)}catch(_){}mv(e)});
  const mv=e=>{if(!drag)return;const [a]=ang(e),g=scr;if(drag==='m'){const step=G===2?5:1;let m=Math.round(a/6/step)*step%60;if(g.m>=45&&m<15)g.h=g.h%12+1;else if(g.m<15&&m>=45)g.h=((g.h-2)%12+12)%12+1;g.m=m}else{g.h=Math.round(a/30)%12||12;if(G<=1)g.m=0}clockPaint()};
  f.addEventListener('pointermove',mv);const up=()=>{if(drag)sfx('tick');drag=null};f.addEventListener('pointerup',up);f.addEventListener('pointercancel',up)}
function clockCheck(){const g=scr;if(g.k!=='xg'||g.end||g.lockC)return;const r=g.rounds[g.ri],ok=(g.h%12)===(r.h%12)&&g.m===r.m;xgRec(ok,{kind:'Đặt kim đồng hồ'});
  const fb=document.getElementById('xgfb');
  if(ok){g.score++;sfx('ok');if(fb)fb.innerHTML=`<span class="ok">Đúng rồi! ${clockText(r)}</span>`}
  else{g.lives--;sfx('bad');hurtFx(1);xgHearts();if(fb)fb.innerHTML=`<span class="bad">Chưa đúng. Đồng hồ cần chỉ ${clockText(r)}.</span>`;g.h=r.h;g.m=r.m;clockPaint()}
  g.lockC=1;setTimeout(()=>{g.lockC=0;if(scr!==g||g.end)return;if(g.lives<=0||g.ri>=g.rounds.length-1)return xgEnd();g.ri++;g.h=12;g.m=0;g.say=`Em xoay kim cho đồng hồ chỉ ${clockWords(g.rounds[g.ri])} nhé.`;render();sayJ(g.say)},ok?700:1500)}

/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */
hd.dangKy({
  'startXG':function(event,a){startXG(a[0],a[1])},
  'stopXG-go-island':function(event,a){stopXG();go({k:'island',id:a[0]})},
  'pairFlip':function(event,a){pairFlip(a[0])},
  'clockStep-h-1':function(){clockStep('h',-1)},
  'clockStep-h-1-2':function(){clockStep('h',1)},
  'clockStep-m-1':function(){clockStep('m',-1)},
  'clockStep-m-1-2':function(){clockStep('m',1)},
  'clockStep-m-5':function(){clockStep('m',-5)},
  'clockStep-m-5-2':function(){clockStep('m',5)},
  'clockCheck':function(){clockCheck()},
  'startTug':function(event,a){startTug(a[0])},
});
