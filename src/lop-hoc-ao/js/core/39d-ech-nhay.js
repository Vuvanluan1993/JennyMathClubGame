/* ===================== ẾCH NHẢY LÁ SÚNG: hiệu ứng nhảy / rơi / bơi về bờ ===================== */
/* Chạm lá súng → ếch nhảy vòng cung từ bờ lên lá đó. Đúng: đứng trên lá rồi sang hàng mới.
   Sai: lá chìm, ếch rơi xuống nước (bọt bắn), rồi bơi lại bờ (chỉ thấy đầu, có gợn sóng); bơi về tới bờ mới được chọn tiếp. */
import { hooks } from './00-hooks.js';
import { render } from './13-giao-dien-chung.js';
import { pixelize, PXC, PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { BIOME } from './23b-vung-bien.js';
import { isl1, sayJ } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { curG } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { hurtFx, sfx } from './33b-am-thanh.js';
import { xgHearts, xgRec } from './37-tro-choi-dot-1.js';
import { frogQ, frogSay, xblit, xcv, xg3End, xgRand, xpx, XSHC } from './39-tro-choi-dot-3.js';
PXS.frogSwim=["...kk.....kk....","..kwwk...kwwk...","..kwkk...kwkk...",".kggggggggggggk.","kgggggggggggggGk","kgGgggggggggGggk","bbbbbbbbbbbbbbbb",".bwb..bwb..bwb..","................"];
const FROG_BANK=[147,254],FROG_PAD=[[33,96],[147,96],[261,96]];
function frogAnim(el,frames,ms,steps){return new Promise(res=>{try{const a=el.animate(frames,{duration:ms,easing:`steps(${steps||Math.max(4,Math.round(ms/60))})`,fill:'forwards'});a.onfinish=()=>res();a.oncancel=()=>res()}catch(e){setTimeout(res,ms)}})}
const fpos=([x,y],dy=0,o={})=>Object.assign({left:x+'px',top:(y+dy)+'px'},o);
function frogSprite(el,name){el.innerHTML=spr(name,48);try{pixelize(el)}catch(e){}}
function frogTap(i){const g=scr;if(g.k!=='xg'||g.mode!=='frog'||g.end||g.lock||g.bad.includes(i))return;const q=g.q,ok=i===q.a;
  xgRec(ok,g.tries===0&&q.q?q.q:g.tries===0?{kind:'Tính nhẩm'}:null);g.tries++;g.lock=1;
  const el=document.getElementById('xfj'),pad=document.querySelectorAll('.xfpad')[i],fb=document.getElementById('xgfb'),B=FROG_BANK,P=FROG_PAD[i];
  if(!el){/* không có màn hình (kiểm thử): xử lý ngay */return frogDone(g,i,ok)}
  el.classList.remove('hop','p0','p1','p2');el.style.transition='none';
  frogSprite(el,'frogJ');sfx('tap');
  /* nhảy vòng cung bờ → lá */
  const mid=[(B[0]+P[0])/2,Math.min(B[1],P[1])-70];
  frogAnim(el,[fpos(B),fpos(mid,0,{offset:.5}),fpos(P)],520,8).then(()=>{if(scr!==g)return;
    if(ok){frogSprite(el,'frog');sfx('ok');if(pad)pad.classList.add('good');if(fb)fb.innerHTML='<span class="ok">Đúng rồi! Ếch đã lên lá súng.</span>';setTimeout(()=>frogAdvance(g,i,el,pad),320);return}
    /* sai: lá chìm, ếch rơi xuống nước */
    if(pad)pad.classList.add('sink');sfx('splash');setTimeout(()=>sfx('bad'),120);hurtFx(1);g.lives--;try{xgHearts()}catch(e){}
    if(fb)fb.innerHTML='<span class="bad">Ếch rơi xuống nước! Đang bơi về bờ…</span>';
    const zone=document.getElementById('xff');if(zone){const s=document.createElement('span');s.className='xfspl';s.style.left=(P[0]-12)+'px';s.innerHTML=spr('splashW',72);try{pixelize(s)}catch(e){}zone.appendChild(s);setTimeout(()=>s.remove(),700)}
    frogAnim(el,[fpos(P),fpos(P,30,{opacity:.9})],300,3).then(()=>{if(scr!==g)return;
      frogSprite(el,'frogSwim');el.classList.add('swim');
      /* bơi về bờ: đi chậm, lắc nhẹ */
      const W=[P,[P[0]+(B[0]-P[0])*.33,P[1]+30+(B[1]-P[1]-30)*.33],[P[0]+(B[0]-P[0])*.66,P[1]+30+(B[1]-P[1]-30)*.66],[B[0],B[1]+6]];
      frogAnim(el,[fpos(W[0],30),fpos(W[1],0,{offset:.33}),fpos(W[2],0,{offset:.66}),fpos(W[3])],1400,14).then(()=>{if(scr!==g)return;
        el.classList.remove('swim');frogSprite(el,'frog');frogAnim(el,[fpos([B[0],B[1]+6]),fpos(B)],160,2).then(()=>frogDone(g,i,false))})})})}
function frogDone(g,i,ok){if(scr!==g)return;g.lock=0;
  if(ok){g.score+=g.tries===1?1:0;g.ri++;g.hop=null;g.tries=0;g.bad=[];g.fb='';if(g.ri>=g.N)return xg3End();g.q=frogQ(isl1(g.id));sfx('splash');render();try{if(curG()<=2)sayJ(frogSay(g.q))}catch(e){}return}
  if(!document.getElementById('xfj'))g.lives--;
  g.bad.push(i);g.splash=null;g.fb='<span class="bad">Ếch đã về bờ. Em chọn lá khác nhé!</span>';if(g.lives<=0)return xg3End();render()}

/* ---- Ao sống động: nước lấp lánh trôi, cá bơi, lau sậy và cỏ rung rinh, sen và lá súng nhấp nhô, gợn sóng ---- */
let frogFx=null;
export function frogBg(){const x=xcv('xfcv');if(!x)return;const g=scr;if(!g||g.mode!=='frog')return;
  if(!frogFx||frogFx.cv!==x.canvas){frogFx={cv:x.canvas,f:0,fish:[{x:10,y:70,v:.6,c:'o'},{x:80,y:20,v:-.45,c:'y'},{x:50,y:77,v:-.35,c:'r'}],rip:[]}}
  frogDraw(x)}
function frogDraw(x){const p0=xpx(x),g=scr,F=frogFx,f=F.f,SC=Math.round(F.sc||0),p=(c,X,Y,w,h)=>p0(c,X,Y+SC,w,h),B=(typeof BIOME!=='undefined'&&BIOME.jung)?BIOME.jung.band:['#8DDFB9','#62CD9E','#3EB585','#26996C'],rn=xgRand(5+g.ri*7);
  x.clearRect(0,0,114,100);p0(B[3],0,0,114,100);
  const far=g.ri>=g.N-2;
  /* bờ xa (chỉ hiện khi gần đích) + cỏ rung */ if(!far){for(let y=0;y<14;y++)p0(B[0],0,y,114,1);[8,40,74,100].forEach((X,i)=>{const X2=(X+g.ri*23)%104;p('#2F9A6A',X2,4+(i%2)*4,9,3)})}else p('G',0,0,114,14);if(far){p('g',0,0,114,11);for(let X=0;X<114;X+=3){const h=2+((X+f)%6<3?1:0);p(rn()<.5?'l':'G',X,12-h+Math.floor(rn()*2),1,h)}}
  /* nước (sâu dần về giữa sông) */ {const dk=Math.min(1,Math.abs(g.ri-(g.N-1)/2)<2?1:0);for(let y=14;y<84;y++)p0(B[Math.min(3,Math.floor((y-14)/18)+dk)],0,y,114,1)}
  frogDecor(p,g,f);
  /* lấp lánh trôi theo dòng */ for(let i=0;i<34;i++){const X=Math.floor(rn()*114+f*.5*(1+(i%3)))%114,Y=16+Math.floor(rn()*66);if((i+f)%5)p('#E6FFF2',X,Y,(i%3)+1,1)}
  /* cá bơi dưới nước (bóng mờ) */ F.fish.forEach(o=>{o.x+=o.v;if(o.x>118)o.x=-8;if(o.x<-8)o.x=118;const X=Math.round(o.x),Y=o.y+((f>>2)%2),d=o.v>0?1:-1,c=PXC[o.c];
    x.globalAlpha=.75;p(c,X,Y,4,2);p(c,X+(d>0?-2:4),Y-((f>>1)%2),2,1);p(c,X+(d>0?-2:4),Y+1+((f>>1)%2),2,1);p('k',X+(d>0?3:0),Y,1,1);x.globalAlpha=1;
    if(f%37===((o.y*3)%37))F.rip.push({x:X+2,y:Y,r:0})});
  /* gợn sóng */ F.rip=F.rip.filter(r=>r.r<6);F.rip.forEach(r=>{r.r+=.5;const R=Math.round(r.r);x.globalAlpha=1-r.r/6;p('#FFFFFF',r.x-R,r.y,R*2+1,1);p('#FFFFFF',r.x-R+1,r.y-1,1,1);p('#FFFFFF',r.x+R-1,r.y-1,1,1);x.globalAlpha=1});
  /* lá súng hàng sau nhấp nhô */ [14,52,90].forEach((X,i)=>{const b=((f>>2)+i)%2;p('#2F9A6A',X,24+b,12,4);p('#2F9A6A',X+2,23+b,8,1);p('#4FB884',X+3,24+b,3,1)});
  /* sen nhấp nhô */ xblit(x,'lotus',4,60+((f>>2)%2));xblit(x,'lotus',103,30+(((f>>2)+1)%2));
  /* lau sậy đung đưa */ [[2,4],[5,6],[108,2],[111,5]].forEach(([X,Y],i)=>{const s=Math.round(Math.sin((f+i*3)/4));for(let k=0;k<12;k++){const off=k<4?s:0;p('G',X+off,Y+k,1,1)}p('N',X+s,Y-2,1,3);p('n',X+s,Y-1,1,1)});
  /* bờ gần: hàng đầu là bãi cỏ; các hàng sau ếch đứng trên lá súng vừa nhảy tới */ if(g.ri>0){for(let y=84;y<100;y++)p0(B[3],0,y,114,1);const cx=57,cy=94;p0('k',cx-15,cy-5,30,11);p0('G',cx-14,cy-4,28,9);p0('g',cx-13,cy-4,24,7);p0('#26996C',cx-2,cy-4,3,4);p0('l',cx-11,cy-3,6,1)}else{ p('k',0,84,114,1);p('G',0,85,114,15);p('g',0,86,114,10);for(let X=1;X<114;X+=4){const w=((X>>2)+(f>>1))%4===0?1:0;p('l',X+w,85+(X%3),1,2);p('G',X+1,85,1,1)}}
  /* cờ đích bay phấp phới */ if(far){p('N',56,1,1,10);const fl=(f>>1)%2;p('r',57,1,6-fl,4);p('r',57,1,6,3-fl);p('y',58,2,2,1)}}
{let tid=0;const _r=hooks.cu('render');hooks.de('render',function(){const v=_r.apply(this,arguments);try{clearInterval(tid);if(scr.k==='xg'&&scr.mode==='frog'&&!scr.end&&document.getElementById('xfcv')){frogFx=null;frogBg();
  tid=setInterval(()=>{const x=xcv('xfcv');if(!x||scr.k!=='xg'||scr.mode!=='frog'||scr.end){clearInterval(tid);return}frogFx.f++;frogDraw(x)},120)}}catch(e){}return v})}

/* đồ vật khác nhau mỗi hàng: đá, khúc gỗ, rùa, vịt, chuồn chuồn, khóm sen */
function frogDecor(p,g,f){const r=xgRand(101+g.ri*13),pick=['rock','log','turtle','duck','fly','lotus2'].sort(()=>r()-.5).slice(0,2);
  pick.forEach((k,j)=>{const X=Math.floor(8+r()*92),Y=j?70+Math.floor(r()*8):18+Math.floor(r()*10),b=(f>>2)%2;
    if(k==='rock'){p('k',X,Y,9,4);p('E',X+1,Y,7,3);p('m',X+2,Y,3,1);p('#FFFFFF',X-2+((f>>1)%3),Y+4,13,1)}
    if(k==='log'){p('k',X,Y+b,16,4);p('N',X+1,Y+1+b,14,2);p('n',X+1,Y+1+b,14,1);p('t',X+14,Y+1+b,1,2)}
    if(k==='turtle'){const dx=((f>>1)%40)-20;p('k',X+dx,Y,8,4);p('G',X+dx+1,Y,6,3);p('l',X+dx+2,Y+1,2,1);p('g',X+dx+8,Y+1,2,2)}
    if(k==='duck'){const dx=((f>>2)%30)-15;p('w',X+dx,Y,7,3);p('w',X+dx+5,Y-3,3,3);p('a',X+dx+8,Y-2,2,1);p('k',X+dx+6,Y-2,1,1);p('#FFFFFF',X+dx-2,Y+3,11,1)}
    if(k==='fly'){const dx=Math.round(Math.sin(f/5)*14),dy=Math.round(Math.cos(f/7)*3);p('b',X+dx,Y-6+dy,6,1);p('x',X+dx+1,Y-7+dy+((f%2)?0:2),2,1);p('x',X+dx+3,Y-7+dy+((f%2)?2:0),2,1)}
    if(k==='lotus2'){p('#2F9A6A',X,Y+b,10,3);p('#2F9A6A',X+7,Y-3+b,8,3);p('#F4A0C0',X+3,Y-2+b,3,2);p('w',X+4,Y-2+b,1,1)}})}
/* chuyển hàng: lá cũ cùng ếch trôi xuống, nước cuộn, hàng lá mới trôi vào từ phía trên, có bảng "Hàng n/8" */
function frogAdvance(g,i,el,pad){if(scr!==g)return;const z=document.getElementById('xff');if(!z)return frogDone(g,i,true);
  sfx('splash');const bn=document.createElement('span');bn.className='xfban';bn.textContent=`Hàng ${g.ri+1}/${g.N} ✓`;z.appendChild(bn);
  z.classList.add('xfgo');if(pad)pad.classList.add('carry');
  const P=FROG_PAD[i];frogAnim(el,[fpos(P),fpos([FROG_BANK[0],FROG_BANK[1]])],520,6);
  if(pad)frogAnim(pad,[{transform:'translate(0,0)'},{transform:`translate(${FROG_BANK[0]-P[0]}px,${FROG_BANK[1]-P[1]+30}px)`}],520,6);
  let k=0;const t=setInterval(()=>{k++;if(frogFx)frogFx.sc=Math.min(30,k*5);if(k>=6)clearInterval(t)},85);
  setTimeout(()=>{if(frogFx)frogFx.sc=0;g.enter=1;frogDone(g,i,true)},600)}
{const _r=hooks.cu('render');hooks.de('render',function(){const v=_r.apply(this,arguments);try{if(scr.k==='xg'&&scr.mode==='frog'&&scr.enter){scr.enter=0;document.querySelectorAll('.xfpad').forEach((b,j)=>{b.classList.add('xfin');b.style.animationDelay=(j*80)+'ms'})}}catch(e){}return v})}
(function(){const st=document.createElement('style');st.textContent=`
.xfgo .xfpad:not(.carry){transition:transform .45s steps(5),opacity .45s steps(5);transform:translateY(120px);opacity:0}
.xfpad.xfin{animation:xfin .5s steps(5) backwards,xfbob 1.6s steps(2) .5s infinite}
@keyframes xfin{from{transform:translateY(-130px);opacity:0}to{transform:translateY(0);opacity:1}}
.xfban{position:absolute;left:50%;top:6px;transform:translateX(-50%);z-index:5;font-family:var(--f-display,'VT323',monospace);font-size:24px;line-height:1;color:#1E8A4A;background:#DFF6E8;border:3px solid #1E8A4A;padding:2px 10px;animation:xgpop .6s steps(3)}
`;document.head.appendChild(st)})();

/* ===================== GHÉP HÌNH: vẽ khối chính xác (trụ, lập phương, hộp chữ nhật, cầu) ===================== */
/* Vẽ viền đầy đủ như hình trong sách: khối trụ có mặt đáy trên là hình elip đủ, hai đường sinh thẳng đứng, nửa elip đáy dưới
   (nửa sau nét đứt khi đủ chỗ); khối lập phương / hộp có mặt trước, mặt trên, mặt bên và đủ các cạnh; khối cầu tròn có bóng và đốm sáng. */
{const _sf=hooks.cu('shapeFill');
 const LIGHT={b:'x',B:'b',o:'t',O:'o',y:'y',a:'y',c:'#F8B3A6',R:'c',p:'#C9A6E0',P:'p',g:'l',G:'g',x:'e',r:'#F8B3A6'};
 hooks.de('shapeFill',function(ctx,k,X,Y,W,H,cols,ghost){if(!['tru','lapphuong','hop','cau'].includes(k))return _sf.apply(this,arguments);
  const p=xpx(ctx),[c1,c2]=cols||XSHC[k]||['b','B'],cl=LIGHT[c1]||'w',G1=ghost?'#E3E7F0':c1,G2=ghost?'#C3CBDD':c2,GL=ghost?'#F1F3F8':cl;
  const line=(x0,y0,x1,y1,c,dash)=>{x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy,n=0;for(;;){if(!dash||(n++>>1)%2===0)p(c,x0,y0);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}};
  const fillPoly=(pts,c)=>{const ys=pts.map(q=>q[1]);for(let py=Math.floor(Math.min(...ys));py<=Math.ceil(Math.max(...ys));py++){const xs=[];for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>py+.5)!==(yj>py+.5))xs.push(xi+(py+.5-yi)*(xj-xi)/(yj-yi))}xs.sort((a,b)=>a-b);for(let m=0;m+1<xs.length;m+=2)for(let px=Math.round(xs[m]);px<Math.round(xs[m+1]);px++)p(c,px,py)}};
  if(k==='cau'){const r=Math.min(W,H)/2-.5,cx=X+W/2,cy=Y+H/2;
    for(let py=Y;py<Y+H;py++)for(let px=X;px<X+W;px++){const dx=px+.5-cx,dy=py+.5-cy,d=dx*dx+dy*dy;if(d>r*r)continue;
      const edge=(Math.hypot(dx,dy)>r-1);if(edge){p('k',px,py);continue}
      const sh=(dx*.6+dy*.8)/r;p(sh>.45?G2:G1,px,py)}
    if(!ghost){const hx=Math.round(cx-r*.42),hy=Math.round(cy-r*.42),hs=Math.max(1,Math.round(r*.22));p('w',hx,hy,hs+1,hs);p(GL,hx+hs+1,hy,1,hs);p(GL,hx,hy+hs,hs,1)}
    /* đường xích đạo nét đứt cho thấy là khối, không phải hình tròn */
    const ew=r-1.6,eh=Math.max(1.5,r*.28),ec=ghost?'#9AA4C0':'k';let n=0;for(let a=0;a<=Math.PI;a+=.05)p(ec,Math.round(cx+ew*Math.cos(a)),Math.round(cy+eh*Math.sin(a)));if(r>=12)for(let a=Math.PI;a<=Math.PI*2;a+=.06){if((n++>>1)%2===0)p('#5E6B8C',Math.round(cx+ew*Math.cos(a)),Math.round(cy+eh*Math.sin(a)))}
    return}
  if(k==='tru'){const w=Math.max(8,Math.round(Math.min(W,H*.8))),x0=X+Math.floor((W-w)/2),x1=x0+w-1,cx=(x0+x1)/2,rx=w/2-.5,ry=Math.max(2,Math.round(w*.2)),yt=Y+ry,yb=Y+H-1-ry;
    const inE=(px,py,cy)=>((px-cx)/(rx+.01))**2+((py-cy)/(ry+.01))**2<=1;
    /* thân + đáy dưới */
    for(let py=yt;py<=Y+H-1;py++)for(let px=x0;px<=x1;px++){if(py<=yb||inE(px,py,yb)){const sh=(px-cx)/rx;p(sh>.45?G2:sh<-.55?GL:G1,px,py)}}
    /* mặt đáy trên (sáng hơn) */
    for(let py=Y;py<=yt+ry;py++)for(let px=x0;px<=x1;px++)if(inE(px,py,yt))p(GL,px,py);
    /* viền: elip trên đủ, hai đường sinh, nửa elip dưới (trước nét liền, sau nét đứt) */
    const ell=(cy,from,to,dash)=>{let prev=null,n=0;for(let a=from;a<=to+1e-6;a+=.03){const px=Math.round(cx+rx*Math.cos(a)),py=Math.round(cy+ry*Math.sin(a));if(prev&&prev[0]===px&&prev[1]===py)continue;prev=[px,py];if(!dash||(n++>>1)%2===0)p(dash?'#5E6B8C':'k',px,py)}};
    ell(yt,0,Math.PI*2);line(x0,yt,x0,yb,'k');line(x1,yt,x1,yb,'k');ell(yb,0,Math.PI);if(H>=22&&!ghost)ell(yb,Math.PI,Math.PI*2,true);
    return}
  /* lập phương / hộp chữ nhật: mặt trước, mặt trên, mặt bên phải */
  const cube=k==='lapphuong';let fw,fh,d;
  if(cube){const s=Math.min(W,H);d=Math.max(3,Math.round(s*.3));fw=fh=s-d}else{d=Math.max(3,Math.round(Math.min(W,H)*.28));fw=W-d;fh=Math.max(4,Math.round((H-d)*.62))}
  const ox=X+Math.floor((W-(fw+d))/2),oy=Y+Math.floor((H-(fh+d))/2)+d;  /* góc trên-trái mặt trước */
  const A=[ox,oy],B=[ox+fw-1,oy],C=[ox+fw-1,oy+fh-1],D=[ox,oy+fh-1],A2=[ox+d,oy-d],B2=[ox+fw-1+d,oy-d],C2=[ox+fw-1+d,oy+fh-1-d];
  fillPoly([A,A2,B2,B],GL);fillPoly([B,B2,C2,C],G2);fillPoly([A,B,C,D],G1);
  [[A,B],[B,C],[C,D],[D,A],[A,A2],[A2,B2],[B2,B],[B2,C2],[C2,C]].forEach(([u,v])=>line(u[0],u[1],v[0],v[1],'k'));
  if(fw+d>=20&&!ghost){const D2=[ox+d,oy+fh-1-d];line(D2[0],D2[1],A2[0],A2[1],'#5E6B8C',true);line(D2[0],D2[1],C2[0],C2[1],'#5E6B8C',true);line(D2[0],D2[1],D[0],D[1],'#5E6B8C',true)}
 })}
