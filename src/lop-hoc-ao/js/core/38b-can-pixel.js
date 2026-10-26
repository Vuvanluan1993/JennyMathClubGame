/* ===================== CÂN THĂNG BẰNG: đồ hoạ pixel ===================== */
/* Vẽ cân trên canvas độ phân giải thấp (114×70, phóng ×3): đế bậc thang, cột gỗ, trục vàng, đòn cân nghiêng theo bậc,
   xích, đĩa cân. Quả cân và vật bên trái là nút HTML có nền sprite pixel. Lệch ít vẫn nghiêng rõ (tối thiểu 2 bậc). */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { PXC, PXS } from './22-do-hoa-pixel-mau-logo-clb.js';
import { pxCanvas } from './23-bien-pixel-dong-phia-sau-ban-do.js';
import { scaleRight, scaleTray } from './38-tro-choi-dot-2.js';
Object.assign(PXS,{
 xsWt:["....kkkk....","...k....k...","...k....k...","..kkkkkkkk..",".kmeeeeeemk.",".kmewwweemk.","kmeeeeeeeemk","kmeeeeeeeemk","kmmmmmmmmmmk","kkkkkkkkkkkk"],
 xsWtG:["....kkkk....","...k....k...","...k....k...","..kkkkkkkk..",".kayyyyyyak.",".kaywwyyyak.","kayyyyyyyyak","kayyyyyyyyak","kaaaaaaaaaak","kkkkkkkkkkkk"],
 xsBox:["kkkkkkkkkkkkkk","knnnnnnnnnnnnk","knttttttttttnk","knttttttttttnk","knttttttttttnk","knttttttttttnk","knnnnnnnnnnnnk","kkkkkkkkkkkkkk"],
});
const XSZ=3,XSW=114,XSH=70,XSCX=57,XSPY=13,XSARM=38;
function xsTilt(g){const L=g.r.T,R_=scaleRight(g);if(R_===L)return 0;if(!g.on.length)return -6;const k=Math.max(2,Math.min(6,Math.round(Math.abs(R_-L)/Math.max(1,L)*14)));return R_>L?k:-k}
export function scaleHTML(g){const r=g.r,R_=scaleRight(g),eq=R_===r.T&&g.on.length,t=xsTilt(g);
  const ly=XSPY-t,ry=XSPY+t,panY=y=>(y+21)*XSZ;  /* đỉnh đĩa (px) */
  const wt=i=>`<button type="button" class="xsw on" onclick="scaleTap(${i})" aria-label="Bỏ quả cân ${esc(r.fmt(r.tray[i].v))}"><span>${r.fmt(r.tray[i].v)}</span></button>`;
  return`<div class="xsbal ${eq?'eq':''}" aria-label="Cân: bên trái ${esc(r.left)}, bên phải ${r.fmt(R_)}" data-t="${t}">
   <canvas class="xscv" id="xscv" width="${XSW}" height="${XSH}" aria-hidden="true"></canvas>
   <div class="xspan l" style="left:${(XSCX-XSARM)*XSZ}px;top:${panY(ly)}px"><span class="xstarget">${r.left}</span></div>
   <div class="xspan r" style="left:${(XSCX+XSARM)*XSZ}px;top:${panY(ry)}px">${g.on.length?g.on.map(wt).join(''):'<span class="xsempty">?</span>'}</div>
   ${eq?'<span class="xsok">=</span>':''}</div>`}
function scaleDraw(){const cv=document.getElementById('xscv');if(!cv||scr.k!=='xg'||scr.mode!=='scale')return;const x=cv.getContext('2d'),t=+cv.parentElement.dataset.t||0,eq=cv.parentElement.classList.contains('eq');
  const C=PXC,p=(c,X,Y,w=1,h=1)=>{x.fillStyle=c;x.fillRect(X,Y,w,h)};x.clearRect(0,0,XSW,XSH);
  /* sàn */ p(C.e,0,64,XSW,6);for(let i=0;i<XSW;i+=6)p(C.m,i,64,3,1);
  /* đế bậc thang */ [[38,63,38],[42,60,30],[46,57,22]].forEach(([X,Y,w])=>{p(C.k,X,Y,w,3);p(C.n,X+1,Y,w-2,2);p(C.t,X+1,Y,w-2,1)});
  /* cột gỗ */ p(C.k,XSCX-3,XSPY+2,7,43);p(C.n,XSCX-2,XSPY+2,5,43);p(C.N,XSCX+1,XSPY+2,1,43);p(C.t,XSCX-2,XSPY+2,1,43);for(let y=XSPY+8;y<57;y+=8)p(C.N,XSCX-2,y,5,1);
  /* đòn cân: mỗi cột một ô, nghiêng theo bậc */
  for(let X=XSCX-XSARM;X<=XSCX+XSARM;X++){const y=XSPY+Math.round(t*(X-XSCX)/XSARM);p(C.k,X,y-2,1,5);p(C.n,X,y-1,1,2);p(C.t,X,y-1,1,1)}
  /* hai đầu đòn + xích + đĩa */
  [[-1,XSPY-t],[1,XSPY+t]].forEach(([s,ey])=>{const ex=XSCX+s*XSARM;p(C.k,ex-2,ey-3,5,5);p(eq?C.g:C.a,ex-1,ey-2,3,3);
    const py=ey+21;for(let k=0;k<17;k+=2){const f=k/18;p(C.E,Math.round(ex+(-15-ex+ex)*f),ey+2+k);p(C.E,Math.round(ex+15*f),ey+2+k);p(C.m,ex,ey+2+k)}
    /* đĩa hình bát */ p(C.k,ex-16,py,33,1);p(C.k,ex-16,py+1,1,2);p(C.k,ex+16,py+1,1,2);p(eq?C.l:C.m,ex-15,py+1,31,2);p(C.w,ex-14,py+1,8,1);
    p(C.k,ex-15,py+3,31,1);p(C.k,ex-12,py+4,25,1);p(C.E,ex-14,py+3,29,1);p(C.k,ex-15,py+3,1,1);p(C.k,ex+15,py+3,1,1)});
  /* trục vàng */ p(C.k,XSCX-3,XSPY-3,7,7);p(eq?C.g:C.a,XSCX-2,XSPY-2,5,5);p(eq?C.l:C.y,XSCX-2,XSPY-2,2,2);
  if(eq){[[XSCX-8,4],[XSCX+8,3],[XSCX,0]].forEach(([X,Y])=>{p(C.y,X,Y+1,3,1);p(C.y,X+1,Y,1,3)})}}
export function scalePaint(){const b=document.getElementById('xsb');if(b)b.innerHTML=scaleHTML(scr);const t=document.getElementById('xstray');if(t)t.innerHTML=scaleTray(scr);const s=document.getElementById('xssum');if(s)s.textContent=scr.r.fmt(scaleRight(scr));scaleDraw();xsSprites()}
/* nền sprite cho quả cân / hộp */
function xsSprites(){try{const W=pxCanvas('xsWt').toDataURL(),G=pxCanvas('xsWtG').toDataURL(),B=pxCanvas('xsBox').toDataURL(),r=document.documentElement.style;r.setProperty('--xsWt',`url(${W})`);r.setProperty('--xsWtG',`url(${G})`);r.setProperty('--xsBox',`url(${B})`)}catch(e){}}
{hooks.on('render',_r=>function(){const a=_r.apply(this,arguments);try{if(scr.k==='xg'&&scr.mode==='scale'){scaleDraw();xsSprites()}}catch(e){}return a})}
