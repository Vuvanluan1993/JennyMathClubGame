/* 56 — Đảo nhà: bố cục mới (thầy yêu cầu 23/10/2026)
   Khung cảnh vẽ ở cỡ chuẩn 640×400 rồi phóng theo bề rộng màn hình (giữ tỉ lệ 16:10), nên vị trí luôn hợp lý ở mọi máy.
   Đảo cát to, bãi cỏ phía sau; mỗi đồ có chỗ riêng, đặt "đứng" trên mặt đất (neo ở chân):
   - Cây dừa: bãi cỏ bên trái · Cờ CLB: bãi cỏ bên phải · Hải đăng: mỏm đá ngoài biển bên trái
   - Lâu đài cát: bãi cát phía trước · Ô che nắng: bãi cát trước bên phải · Thuyền buồm: mặt nước bên phải
   - Ổ rơm, máy ấp: bãi cỏ giữa · Máng ăn: bãi cát trái · Thú cưng: đi lại trên bãi cát giữa. */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { hd } from './02-hanh-dong.js';
import { spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { ghSt } from './49-gian-hang.js';
import { careOf, gearHas, petsOf, petSpr } from './49b-dao-nha-thu-cung.js';
const IS2_W=640,IS2_H=400;
export const IS2_POS={palm:[150,226,104],flag:[478,222,64],light:[50,262,92],castle:[226,352,56],umb:[430,326,70],boat:[594,372,56],
 nest:[318,246,40],inc:[392,246,46],feeder:[200,312,34]};
const IS2_PET=[[304,300],[376,308]];
function is2Bg(){const R=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
 return`<svg class="is2bg" viewBox="0 0 160 100" width="640" height="400" shape-rendering="crispEdges" aria-hidden="true">
 ${R(0,0,160,40,'#BDEBFA')}${R(0,40,160,60,'#3FC1EC')}${R(0,40,160,3,'#7FD3F0')}
 ${R(12,8,14,3,'#fff')}${R(15,6,8,2,'#fff')}${R(118,12,18,3,'#fff')}${R(122,10,10,2,'#fff')}${R(70,5,10,2,'#fff')}
 ${[[8,48],[140,50],[150,62],[6,82],[120,96],[40,97],[150,90]].map(([x,y])=>R(x,y,6,1,'#9CE0F6')).join('')}
 ${R(15,85,130,11,'#7FD3F0')}${R(19,96,122,2,'#7FD3F0')}
 ${R(2,64,16,7,'#6B7895')}${R(4,62,12,2,'#9AA4C0')}${R(3,64,14,2,'#9AA4C0')}${R(1,70,18,1,'#7FD3F0')}
 ${R(20,56,120,34,'#F6D98B')}${R(24,54,112,2,'#F6D98B')}${R(30,52,100,2,'#F6D98B')}${R(18,60,124,26,'#F6D98B')}
 ${R(22,88,116,3,'#E2B85E')}${R(28,91,104,2,'#E2B85E')}${R(18,84,4,4,'#E2B85E')}${R(138,84,4,4,'#E2B85E')}
 ${R(30,52,100,8,'#2AB563')}${R(26,54,108,4,'#2AB563')}${R(34,60,92,2,'#1E8A4A')}${R(26,58,8,2,'#1E8A4A')}${R(126,58,8,2,'#1E8A4A')}
 ${[[40,55],[62,57],[88,55],[110,57],[50,58],[100,53]].map(([x,y])=>R(x,y,2,1,'#1E8A4A')).join('')}
 ${[[46,70],[78,78],[104,68],[60,82],[118,76],[34,78]].map(([x,y])=>R(x,y,2,1,'#E2B85E')).join('')}</svg>`}
function is2Put(id,html,cls,extra){const p=IS2_POS[id];if(!p)return'';return`<span class="is2it ${cls||''}" style="left:${p[0]}px;top:${p[1]}px;z-index:${p[1]}">${html}${extra||''}</span>`}
function is2Scene(st,o){o=o||{};const s=ghSt(st),P=petsOf(st),list=o.dec||s.dec;
 const dec=list.map(id=>is2Put(id,spr(id,IS2_POS[id]?IS2_POS[id][2]:60),o.tryId===id&&!s.dec.includes(id)?'try':'')).join('');
 let home='',pets='';
 if(o.pets){home=['nest','feeder','inc'].filter(id=>gearHas(st,id)).map(id=>is2Put(id,spr(careOf(id)[5],IS2_POS[id][2]),'',id==='inc'?P.eggs.filter(e=>e.inc).map(()=>`<i class="iegg">${spr('eggCS',20)}</i>`).join(''):id==='nest'?P.eggs.filter(e=>!e.inc).map(()=>`<i class="iegg">${spr('eggCS',20)}</i>`).join(''):'')).join('');
  pets=P.list.map((p,i)=>{const[x,y]=IS2_PET[i]||IS2_PET[0];return`<button type="button" class="ipet is2pet" style="left:${x}px;top:${y}px;z-index:${y}" data-act="petPat" ${hd.arg(i)} aria-label="Cưng nựng ${esc(p.name||'thú cưng')}">${petSpr(p,64)}${p.sick?`<i class="ifx">${spr('fxSweat',18)}</i>`:p.no<25?`<i class="ifx">${spr('bowlS',18)}</i>`:''}</button>`}).join('')}
 return`<div class="is2wrap ${o.small?'small':''}"><div class="is2" ${o.pets?'id="iscene"':''}>${is2Bg()}${dec}${home}${pets}</div></div>`}
function is2Fit(){document.querySelectorAll('.is2wrap').forEach(w=>{const k=w.clientWidth/IS2_W;const s=w.querySelector('.is2');if(s)s.style.transform=`scale(${k})`})}
addEventListener('resize',is2Fit);
{hooks.on('render',_r=>function(){const v=_r.apply(this,arguments);try{is2Fit()}catch(e){}return v})}
/* Đảo nhà: thay khung cảnh cũ */
{hooks.on('viewIsle',_v=>function(st){const r=_v.apply(this,arguments);try{return r.replace(/<div class="iscene" id="iscene"><div class="isky"><\/div>[\s\S]*?<\/div>/,is2Scene(st,{pets:true}))}catch(e){return r}})}
/* Cửa hàng › Đảo nhà: xem trước cùng bố cục */
hooks.de('ghIsle',function(st){const s=ghSt(st),T=scr.ghTry,list=s.dec.concat(T&&T.k==='dec'&&!s.dec.includes(T.id)?[T.id]:[]);return is2Scene(st,{dec:list,tryId:T&&T.id,small:true})});
document.head.insertAdjacentHTML('beforeend',`<style>
.is2wrap{position:relative;width:100%;max-width:640px;margin:0 auto;aspect-ratio:16/10;overflow:hidden;box-shadow:var(--f2)}
.is2wrap.small{width:min(220px,56%);flex:none;max-width:none}
.is2{position:absolute;left:0;top:0;width:640px;height:400px;transform-origin:0 0}
.is2bg{position:absolute;left:0;top:0;width:640px;height:400px}
.is2it{position:absolute;transform:translate(-50%,-100%);display:block;line-height:0}
.is2it img{image-rendering:pixelated}.is2it.try{animation:bIdle 1s steps(2) infinite}
.is2it .iegg{position:absolute;left:30%;top:-10%}
.is2pet{transform:translate(-50%,-100%)}
.ghstage.isle .is2wrap{box-shadow:none}
</style>`);
setTimeout(is2Fit,0);
