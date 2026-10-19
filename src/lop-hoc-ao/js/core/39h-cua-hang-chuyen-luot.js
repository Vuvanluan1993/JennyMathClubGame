/* ===================== CỬA HÀNG JENNY: chuyển lượt rõ ràng, mỗi lượt một quầy ===================== */
/* Đúng: tiền bay vào máy tính tiền (ting!), món hàng nhảy vào túi, bảng "Khách n/8 ✓", quầy cũ trượt sang trái,
   quầy mới (màu mái, tên quầy, đồ trang trí khác) trượt vào từ bên phải. Sai: giữ như cũ (báo lỗi, chỉ đúng rồi qua lượt). */
Object.assign(PXS,{
 xsReg:["..kkkkkkkk..","..kyyyyyyk..","..kkkkkkkk..",".kmmmmmmmmk.",".kmwkwkwkmk.",".kmkwkwkwmk.","kEEEEEEEEEEk","kEmmmmmmmmEk","kkkkkkkkkkkk"],
 xsBag:["...kkkk...","..k....k..","..k....k..","kkkkkkkkkk","kttttttttk","kttnttnttk","kttttttttk","kttttttttk","kTTTTTTTTk","kkkkkkkkkk"],
});
const SHOP_QUAY=[['Quầy bánh','#F26249','#FFE3DC','🧁'],['Sạp trái cây','#2AB563','#DFF6E8','🍎'],['Tiệm đồ chơi','#8656A8','#EFE3F7','🧸'],['Hiệu sách','#0079C1','#E0F1FB','📚'],
 ['Quầy kem','#12B5E8','#E3F7FD','🍦'],['Tiệm hoa','#E8508A','#FCE3EE','🌷'],['Sạp rau','#1E8A4A','#E6F5E1','🥕'],['Quầy nước','#F37A1F','#FFEBD6','🥤']];
function shopQuay(ri){return SHOP_QUAY[ri%SHOP_QUAY.length]}
/* trang trí quầy theo lượt */
{const _h=shopHTML;shopHTML=function(g){let s=_h.apply(this,arguments);const [n,c,bg,ic]=shopQuay(g.ri||0);
  const top=`<div class="xsquay" style="--qc:${c};--qb:${bg}"><span class="xsawn"></span><span class="xsname">${n} · Khách ${(g.ri||0)+1}/${g.N}</span></div>`;
  s=s.replace('<div class="xshelf">',`${top}<div class="xshelf" style="--qb:${bg}"><span class="xsreg" id="xsreg">${spr('xsReg',40)}</span><span class="xsbag" id="xsbag">${spr('xsBag',34)}</span>`);
  return s}}
function shopCheck(v){const g=scr;if(g.k!=='xg'||g.end||g.lockC)return;const r=g.r;let ok;
  if(r.t==='chg'){ok=v===r.total}else{if(!g.pay.length)return;ok=shopPaid(g)===r.total}
  xgRec(ok,{kind:r.kind});const fb=document.getElementById('xgfb');g.lockC=1;
  if(!ok){g.lives--;sfx('bad');hurtFx(1);xgHearts();if(fb)fb.innerHTML=`<span class="bad">${r.t==='chg'?`Chưa đúng. ${fN(r.give)} − ${fN(r.items[0][1])} = ${fN(r.total)} đồng.`:`Chưa đúng. Em đưa ${xgVnd(shopPaid(g))}, cần ${xgVnd(r.total)}.`}</span>`;
    return setTimeout(()=>{g.lockC=0;if(scr!==g||g.end)return;if(g.lives<=0||g.ri>=g.N-1)return xg2End();g.ri++;g.r=shopRound(curG(),g.ri,g.N);g.pay=[];g.enter=1;render();sayJ(shopSay(g.r))},2000)}
  g.score++;if(fb)fb.innerHTML=`<span class="ok">${r.t==='chg'?`Đúng rồi! Cô trả lại em ${xgVnd(r.total)}.`:'Cảm ơn em! Trả đúng tiền rồi.'}</span>`;
  const reg=document.getElementById('xsreg'),bag=document.getElementById('xsbag'),box=document.querySelector('.xshop');
  const ctr=e=>{const b=e.getBoundingClientRect();return[b.left+b.width/2,b.top+b.height/2]};
  const anim=(el,fr,ms)=>{try{return el.animate(fr,{duration:ms,easing:'steps(6)',fill:'forwards'})}catch(e){return null}};
  /* 1. tiền bay vào máy tính tiền */
  const notes=[...document.querySelectorAll(r.t==='chg'?'.xsopt':'#xshp .xsn')];if(reg){const [rx,ry]=ctr(reg);notes.forEach((n,i)=>{if(r.t==='chg'&&+String(n.getAttribute('onclick')).replace(/\D/g,'')!==v)return;const [nx,ny]=ctr(n);setTimeout(()=>anim(n,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${rx-nx}px,${ry-ny}px) scale(.3)`,opacity:.2}],420),i*70)})}
  setTimeout(()=>{sfx('coin');if(reg){reg.classList.add('ting');setTimeout(()=>sfx('ok'),140)}},380);
  /* 2. món hàng nhảy vào túi */
  setTimeout(()=>{if(!bag)return;const [bx,by]=ctr(bag);document.querySelectorAll('.xsitem').forEach((it,i)=>{const [ix,iy]=ctr(it);setTimeout(()=>{anim(it,[{transform:'translate(0,0)'},{transform:`translate(${(bx-ix)/2}px,${by-iy-60}px)`,offset:.5},{transform:`translate(${bx-ix}px,${by-iy}px) scale(.35)`,opacity:.3}],460);sfx('pop')},i*120)});setTimeout(()=>bag.classList.add('full'),480)},620);
  /* 3. bảng khách + quầy trượt đi */
  setTimeout(()=>{if(!box)return;const b=document.createElement('span');b.className='xsban';b.textContent=`Khách ${g.ri+1}/${g.N} ✓ Cảm ơn!`;box.appendChild(b);setTimeout(()=>box.classList.add('xsout'),450)},1050);
  setTimeout(()=>{g.lockC=0;if(scr!==g||g.end)return;if(g.lives<=0||g.ri>=g.N-1)return xg2End();g.ri++;g.r=shopRound(curG(),g.ri,g.N);g.pay=[];g.enter=1;render();sayJ(shopSay(g.r))},1900)}
{const _r=render;render=function(){const v=_r.apply(this,arguments);try{if(scr.k==='xg'&&scr.mode==='shop'&&scr.enter){scr.enter=0;const b=document.querySelector('.xshop');if(b)b.classList.add('xsenter')}}catch(e){}return v}}
(function(){const st=document.createElement('style');st.textContent=`
.xshop{position:relative;overflow:hidden}
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
.xsban{position:absolute;left:50%;top:40px;transform:translateX(-50%);z-index:6;font-family:var(--f-display,'VT323',monospace);font-size:24px;line-height:1;color:#1E8A4A;background:#DFF6E8;border:3px solid #1E8A4A;padding:3px 10px;white-space:nowrap;animation:xgpop .6s steps(3)}
.xshop.xsout>*{transition:transform .4s steps(5),opacity .4s steps(5);transform:translateX(-110%);opacity:0}
.xshop.xsout>.xsban{transform:translateX(-50%);opacity:1}
.xshop.xsenter>*{animation:xsslide .45s steps(5) backwards}
.xshop.xsenter>*:nth-child(2){animation-delay:.06s}.xshop.xsenter>*:nth-child(3){animation-delay:.12s}.xshop.xsenter>*:nth-child(n+4){animation-delay:.18s}
@keyframes xsslide{from{transform:translateX(110%);opacity:0}to{transform:none;opacity:1}}
`;document.head.appendChild(st)})();
