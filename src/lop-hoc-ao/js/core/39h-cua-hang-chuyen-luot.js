/* ===================== CỬA HÀNG JENNY: chuyển lượt rõ ràng, mỗi lượt một quầy ===================== */
/* Đúng: tiền bay vào máy tính tiền (ting!), món hàng nhảy vào túi, bảng "Khách n/8 ✓", quầy cũ trượt sang trái,
   quầy mới (màu mái, tên quầy, đồ trang trí khác) trượt vào từ bên phải. Sai: giữ như cũ (báo lỗi, chỉ đúng rồi qua lượt). */
import { hooks } from './00-hooks.js';
import { render } from './13-giao-dien-chung.js';
import { PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { sayJ } from './30b-may-tieu-hoc.js';
import { curG } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { fN } from './30e-hinh-hoc-so-lon.js';
import { hurtFx, sfx } from './33b-am-thanh.js';
import { xgHearts, xgRec } from './37-tro-choi-dot-1.js';
import { shopPaid, shopRound, shopSay, xg2End, xgVnd } from './38-tro-choi-dot-2.js';
Object.assign(PXS,{
 xsReg:["..kkkkkkkk..","..kyyyyyyk..","..kkkkkkkk..",".kmmmmmmmmk.",".kmwkwkwkmk.",".kmkwkwkwmk.","kEEEEEEEEEEk","kEmmmmmmmmEk","kkkkkkkkkkkk"],
 xsBag:["...kkkk...","..k....k..","..k....k..","kkkkkkkkkk","kttttttttk","kttnttnttk","kttttttttk","kttttttttk","kTTTTTTTTk","kkkkkkkkkk"],
});
const SHOP_QUAY=[['Quầy bánh','#F26249','#FFE3DC','🧁'],['Sạp trái cây','#2AB563','#DFF6E8','🍎'],['Tiệm đồ chơi','#8656A8','#EFE3F7','🧸'],['Hiệu sách','#0079C1','#E0F1FB','📚'],
 ['Quầy kem','#12B5E8','#E3F7FD','🍦'],['Tiệm hoa','#E8508A','#FCE3EE','🌷'],['Sạp rau','#1E8A4A','#E6F5E1','🥕'],['Quầy nước','#F37A1F','#FFEBD6','🥤']];
function shopQuay(ri){return SHOP_QUAY[ri%SHOP_QUAY.length]}
/* trang trí quầy theo lượt */
{hooks.on('shopHTML',_h=>function(g){let s=_h.apply(this,arguments);const [n,c,bg,ic]=shopQuay(g.ri||0);
  const top=`<div class="xsquay" style="--qc:${c};--qb:${bg}"><span class="xsawn"></span><span class="xsname">${n} · Khách ${(g.ri||0)+1}/${g.N}</span></div>`;
  s=s.replace('<div class="xshelf">',`${top}<div class="xshelf" style="--qb:${bg}"><span class="xsreg" id="xsreg">${spr('xsReg',40)}</span><span class="xsbag" id="xsbag">${spr('xsBag',34)}</span>`);
  return s})}
export function shopCheck(v){const g=scr;if(g.k!=='xg'||g.end||g.lockC)return;const r=g.r;let ok;
  if(r.t==='chg'){ok=v===r.total}else{if(!g.pay.length)return;ok=shopPaid(g)===r.total}
  xgRec(ok,{kind:r.kind});const fb=document.getElementById('xgfb');g.lockC=1;
  if(!ok){g.lives--;sfx('bad');hurtFx(1);xgHearts();if(fb)fb.innerHTML=`<span class="bad">${r.t==='chg'?`Chưa đúng. ${fN(r.give)} − ${fN(r.items[0][1])} = ${fN(r.total)} đồng.`:`Chưa đúng. Em đưa ${xgVnd(shopPaid(g))}, cần ${xgVnd(r.total)}.`}</span>`;
    return setTimeout(()=>{g.lockC=0;if(scr!==g||g.end)return;if(g.lives<=0||g.ri>=g.N-1)return xg2End();g.ri++;g.r=shopRound(curG(),g.ri,g.N);g.pay=[];g.enter=1;render();sayJ(shopSay(g.r))},2000)}
  g.score++;if(fb)fb.innerHTML=`<span class="ok">${r.t==='chg'?`Đúng rồi! Cô trả lại em ${xgVnd(r.total)}.`:'Cảm ơn em! Trả đúng tiền rồi.'}</span>`;
  const reg=document.getElementById('xsreg'),bag=document.getElementById('xsbag'),box=document.querySelector('.xshop');
  const ctr=e=>{const b=e.getBoundingClientRect();return[b.left+b.width/2,b.top+b.height/2]};
  const anim=(el,fr,ms)=>{try{return el.animate(fr,{duration:ms,easing:'steps(6)',fill:'forwards'})}catch(e){return null}};
  /* 1. tiền bay vào máy tính tiền */
  const notes=[...document.querySelectorAll(r.t==='chg'?'.xsopt':'#xshp .xsn')];if(reg){const [rx,ry]=ctr(reg);notes.forEach((n,i)=>{if(r.t==='chg'&&+String(n.dataset.arg||'').replace(/\D/g,'')!==v)return;const [nx,ny]=ctr(n);setTimeout(()=>anim(n,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${rx-nx}px,${ry-ny}px) scale(.3)`,opacity:.2}],420),i*70)})}
  setTimeout(()=>{sfx('coin');if(reg){reg.classList.add('ting');setTimeout(()=>sfx('ok'),140)}},380);
  /* 2. món hàng nhảy vào túi */
  setTimeout(()=>{if(!bag)return;const [bx,by]=ctr(bag);document.querySelectorAll('.xsitem').forEach((it,i)=>{const [ix,iy]=ctr(it);setTimeout(()=>{anim(it,[{transform:'translate(0,0)'},{transform:`translate(${(bx-ix)/2}px,${by-iy-60}px)`,offset:.5},{transform:`translate(${bx-ix}px,${by-iy}px) scale(.35)`,opacity:.3}],460);sfx('pop')},i*120)});setTimeout(()=>bag.classList.add('full'),480)},620);
  /* 3. bảng khách + quầy trượt đi */
  setTimeout(()=>{if(!box)return;const b=document.createElement('span');b.className='xsban';b.textContent=`Khách ${g.ri+1}/${g.N} ✓ Cảm ơn!`;box.appendChild(b);setTimeout(()=>box.classList.add('xsout'),1500)},1150);
  setTimeout(()=>{g.lockC=0;if(scr!==g||g.end)return;if(g.lives<=0||g.ri>=g.N-1)return xg2End();g.ri++;g.r=shopRound(curG(),g.ri,g.N);g.pay=[];g.enter=1;render();sayJ(shopSay(g.r))},3200)}
{hooks.on('render',_r=>function(){const v=_r.apply(this,arguments);try{if(scr.k==='xg'&&scr.mode==='shop'&&scr.enter){scr.enter=0;const b=document.querySelector('.xshop');if(b)b.classList.add('xsenter')}}catch(e){}return v})}
(function(){const st=document.createElement('style');st.textContent=`
.xshop{position:relative;overflow-x:clip;overflow-y:visible;padding-bottom:10px}
.xsquay{position:relative;height:30px;margin:0 0 0;background:var(--qc);border:3px solid #1F2A5A;border-bottom:0;display:flex;align-items:center;justify-content:center}
.xsawn{position:absolute;left:0;right:0;bottom:-10px;height:10px;background:repeating-linear-gradient(90deg,var(--qc) 0 16px,#FFFFFF 16px 32px);border-bottom:3px solid #1F2A5A;z-index:1}
.xsname{position:relative;z-index:2;font-family:var(--f-display,'VT323',monospace);font-size:20px;line-height:1;color:#FFFFFF;text-shadow:2px 2px 0 #1F2A5A;white-space:nowrap}
.xshelf{background:repeating-linear-gradient(90deg,#F6D98B 0 12px,#E2B85E 12px 24px)!important;padding-top:18px!important}
.xshelf::before{content:'';position:absolute;inset:0;background:var(--qb);opacity:.35;pointer-events:none}
.xsreg{position:absolute;right:6px;bottom:4px;line-height:0;z-index:2}
.xsbag{position:absolute;left:6px;bottom:4px;line-height:0;z-index:2}
.xsreg.ting{animation:xsting .5s steps(3)}
@keyframes xsting{40%{transform:translateY(-6px) scale(1.15)}}
.xsbag.full{animation:xsting .4s steps(2)}
.xsitem{position:relative;z-index:3}
.xsban{position:absolute;left:50%;top:60px;transform:translateX(-50%);z-index:6;font-family:var(--f-display,'VT323',monospace);font-size:24px;line-height:1;color:#1E8A4A;background:#DFF6E8;border:3px solid #1E8A4A;padding:3px 10px;white-space:nowrap;animation:xgpop .6s steps(3)}
.xshop.xsout>:is(.xsquay,.xlive,.xshelf,.xsq){transition:transform .5s steps(5),opacity .5s steps(5);transform:translateX(-110%);opacity:0}

.xshop.xsenter>:is(.xsquay,.xlive,.xshelf,.xsq){animation:xsslide .55s steps(6) backwards}
.xshop.xsenter>.xshelf{animation-delay:.08s}.xshop.xsenter>.xsq{animation-delay:.16s}
@keyframes xsslide{from{transform:translateX(110%);opacity:0}to{transform:none;opacity:1}}
`;document.head.appendChild(st)})();

/* ---- tiền Việt Nam: màu gần với tờ tiền thật ---- */
const VNDC={100:['#D9CFA3','#6E6233'],200:['#F2CDB0','#9C4F2A'],500:['#F6C7D2','#A8385A'],1000:['#DCCDEB','#64438A'],2000:['#E9D3B5','#82552A'],5000:['#C9D9F1','#2D5294'],
 10000:['#E6E4AA','#7C7A22'],20000:['#C2D5EF','#1F4C8A'],50000:['#EDC4D2','#8A3456'],100000:['#CFE7C6','#3A7736'],200000:['#F1C6B2','#9A4328'],500000:['#C2E4E1','#1D6B67']};
function vndPaint(root){(root||document).querySelectorAll('.xsn').forEach(b=>{const v=+String(b.getAttribute('aria-label')||b.textContent).replace(/[^\d]/g,'');const c=VNDC[v];if(!c)return;b.style.setProperty('--nb',c[0]);b.style.setProperty('--nd',c[1]);b.classList.add('vnd')})}
(function(){const mo=new MutationObserver(()=>{if(document.querySelector('.xsn:not(.vnd)'))vndPaint()});const go=()=>{try{mo.observe(document.body,{childList:true,subtree:true})}catch(e){}};if(document.body)go();else addEventListener('DOMContentLoaded',go);
 const st=document.createElement('style');st.textContent=`
.xsn.vnd{background:var(--nb)!important;color:var(--nd)!important;box-shadow:0 0 0 3px var(--nd)!important;position:relative;overflow:hidden}
.xsn.vnd::before{content:'';position:absolute;inset:3px;border:1px dashed var(--nd);opacity:.55;pointer-events:none}
.xsn.vnd::after{content:'';position:absolute;right:6px;top:50%;width:12px;height:12px;margin-top:-6px;background:var(--nd);opacity:.22;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)}
.xsn.vnd b{position:relative;z-index:1;font-weight:400}
.xsn.vnd i{position:relative;z-index:1}
`;document.head.appendChild(st)})();
