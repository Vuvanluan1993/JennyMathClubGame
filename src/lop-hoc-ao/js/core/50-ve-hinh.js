/* 50 — Màn "Vẽ hình" (thầy duyệt 22/10/2026): học sinh vẽ tay hình vuông, hình chữ nhật, hình tam giác (và hình tứ giác ở lớp 2–5).
   - Là MÀN THÊM ở các đảo hình học; không thay màn cũ, không tính vào sao mở khoá đảo/hộ chiếu (lưu riêng s.draw).
   - 4 hình mỗi màn, 3 tim. Sai: mất 1 tim, vẽ lại; sai 2 lần thì hiện chấm gợi ý. Qua màn khi còn tim.
   - Phản hồi chỉ: "Đúng rồi!" / "Chưa đúng" + câu động viên.
   - Nhận dạng: bao lồi các nét → thử khớp tam giác / tứ giác (sai số trung bình), kiểm tra khép kín từng cạnh, rồi xét góc vuông và tỉ lệ cạnh. */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { addCoins } from './11-sao-va-mo-khoa.js';
import { go, render } from './13-giao-dien-chung.js';
import { shuf } from './21-lop-6-che-do-tro-choi.js';
import { PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { isl1, s1, sayJ } from './30b-may-tieu-hoc.js';
import { curG } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { hurtFx, sfx } from './33b-am-thanh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { gateWrap } from './46-bat-buoc-luyen-loi.js';
import { enOn } from './48-dich-tieng-anh.js';
const DRAW_ISL={g1b7t1:['sq','rect','tri'],g1b7t2:['sq','rect','tri'],g1b9t1:['sq','rect','tri'],
 g2e26t1:['quad','tri'],g2e26t2:['quad','tri'],g2k34t1:['sq','rect','tri','quad'],g2k34t2:['sq','rect','tri','quad'],
 g3c19t1:['tri','quad','rect','sq'],g3c19t2:['tri','quad','rect','sq'],g3c19t3:['tri','quad','rect','sq'],g3c20t1:['sq','rect'],g3c20t2:['sq','rect','tri'],
 g5e25t1:['tri'],g5e25t2:['tri'],g5k32t1:['sq','rect','tri','quad'],g5k32t2:['sq','rect','tri','quad']};
const DRAW_N=4;
const DRAW_NAME={vi:{sq:'hình vuông',rect:'hình chữ nhật',tri:'hình tam giác',quad:'hình tứ giác'},en:{sq:'square',rect:'rectangle',tri:'triangle',quad:'quadrilateral'}};
const DRAW_OK={vi:['Em giỏi quá!','Tuyệt vời, em vẽ đẹp lắm!','Hoan hô em!','Em làm tốt lắm!','Giỏi ghê, tiếp tục nhé!'],en:['Well done!','Brilliant drawing!','Hooray!','Great job!','Super, keep going!']};
const DRAW_BAD={vi:['Em thử vẽ lại nhé, em làm được mà!','Không sao đâu, mình vẽ lại nào!','Cố lên, lần này em sẽ vẽ đúng!','Em bình tĩnh vẽ lại nhé, Jenny tin em!'],en:["Try again, you can do it!","That's OK, let's draw it again!","Keep going, you'll get it this time!","Take your time, Jenny believes in you!"]};
const dEN=()=>typeof LANG!=='undefined'&&LANG==='en'&&(typeof enOn!=='function'||enOn());
const dL=()=>dEN()?'en':'vi';
/* Nhận dạng hình vẽ tay: hình vuông, hình chữ nhật, hình tam giác (+ hình tròn, chưa khép kín) */
function dHull(P){const p=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
 for(const q of p){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q)}
 for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q)}
 up.pop();lo.pop();return lo.concat(up)}
const dD=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const dArea=P=>{let s=0;for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];s+=a[0]*b[1]-b[0]*a[1]}return Math.abs(s)/2};
const dTri=(a,b,c)=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]))/2;
function dAng(a,b,c){const v1=[a[0]-b[0],a[1]-b[1]],v2=[c[0]-b[0],c[1]-b[1]];const d=(v1[0]*v2[0]+v1[1]*v2[1])/(Math.hypot(...v1)*Math.hypot(...v2)||1);return Math.acos(Math.max(-1,Math.min(1,d)))*180/Math.PI}
function dSeg(p,a,b){const l=(b[0]-a[0])**2+(b[1]-a[1])**2;if(!l)return dD(p,a);let t=((p[0]-a[0])*(b[0]-a[0])+(p[1]-a[1])*(b[1]-a[1]))/l;t=Math.max(0,Math.min(1,t));return dD(p,[a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])])}
/* rút gọn đa giác bao: bỏ đỉnh “ít quan trọng” (Visvalingam) và đỉnh gần thẳng */
function dSimplify(H){let P=H.slice();const A=dArea(P)||1;
 const step=()=>{let best=-1,bv=1e18;for(let i=0;i<P.length;i++){const a=P[(i-1+P.length)%P.length],b=P[i],c=P[(i+1)%P.length];const v=dTri(a,b,c);if(v<bv){bv=v;best=i}}return[best,bv]};
 while(P.length>3){const[i,v]=step();const a=P[(i-1+P.length)%P.length],c=P[(i+1)%P.length],b=P[i];if(v<A*0.018||dAng(a,b,c)>150)P.splice(i,1);else break}
 /* gộp đỉnh quá gần nhau */
 let changed=true;const diag=Math.hypot(...dBox(H).wh);while(changed&&P.length>3){changed=false;for(let i=0;i<P.length;i++){const j=(i+1)%P.length;if(dD(P[i],P[j])<diag*0.12){P[i]=[(P[i][0]+P[j][0])/2,(P[i][1]+P[j][1])/2];P.splice(j,1);changed=true;break}}}
 return P}
function dBox(P){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const[x,y]of P){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}return{x0,y0,x1,y1,wh:[x1-x0,y1-y0]}}
function dReduce(H,k){let P=H.slice();while(P.length>k){let best=0,bv=1e18;for(let i=0;i<P.length;i++){const v=dTri(P[(i-1+P.length)%P.length],P[i],P[(i+1)%P.length]);if(v<bv){bv=v;best=i}}P.splice(best,1)}return P}
function dFit(pts,P){let s=0;for(const p of pts){let m=1e9;for(let i=0;i<P.length;i++)m=Math.min(m,dSeg(p,P[i],P[(i+1)%P.length]));s+=m}return s/pts.length}
/* trả về {kind, poly, why, info} — kind: 'tri','sq','rect','sqrect','quad','round','open','small','many','line' */
function nhanHinh(strokes){const pts=[].concat(...strokes);if(pts.length<8)return{kind:'small',why:'Hình vẽ còn ít nét quá.'};
 const B=dBox(pts),diag=Math.hypot(...B.wh);if(Math.max(...B.wh)<50)return{kind:'small',why:'Em vẽ to hơn một chút nhé.'};
 if(Math.min(...B.wh)<Math.max(...B.wh)*0.12)return{kind:'line',why:'Đây mới là một đường thẳng.'};
 const H=dHull(pts);const e3=dFit(pts,dReduce(H,3))/diag,e4=dFit(pts,dReduce(H,4))/diag,e6=dFit(pts,dReduce(H,6))/diag;
 let n=e3<0.045?3:e4<0.05?4:0;const P=n?dReduce(H,n):dSimplify(H);if(!n)n=P.length;
 const tol=diag*0.1;const cover=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];let ok=0,tot=0;for(let k=0;k<9;k++){const t=0.2+k*0.075,s=[a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])];tot++;if(pts.some(p=>dD(p,s)<tol))ok++}cover.push(ok/tot)}
 const gap=cover.findIndex(c=>c<0.6);
 const angs=P.map((b,i)=>dAng(P[(i-1+P.length)%P.length],b,P[(i+1)%P.length]));
 const info={n,e3:+e3.toFixed(3),e4:+e4.toFixed(3),e6:+e6.toFixed(3),angs:angs.map(Math.round),cover:cover.map(c=>Math.round(c*100))};
 if(gap>=0)return{kind:'open',poly:P,gap,info,why:'Hình chưa khép kín: còn thiếu một cạnh.'};
 if(n===3)return{kind:'tri',poly:P,info};
 if(n===4){const s=P.map((p,i)=>dD(p,P[(i+1)%4]));const w=(s[0]+s[2])/2,h=(s[1]+s[3])/2,ratio=Math.max(w,h)/Math.min(w,h);const sqAng=angs.every(a=>Math.abs(a-90)<=25);info.ratio=+ratio.toFixed(2);
  if(!sqAng)return{kind:'quad',poly:P,info,why:'Hình có 4 cạnh nhưng các góc chưa vuông.'};
  return{kind:ratio<1.15?'sq':ratio>1.3?'rect':'sqrect',poly:P,info,ratio}}
 if(e6<0.03&&angs.every(a=>a>100))return{kind:'round',poly:P,info,why:'Hình này tròn, không có góc.'};
 return{kind:'many',poly:P,info,why:'Hình em vẽ chưa rõ là hình gì.'}}

/* ---- màn chơi ---- */
function drawWantOk(want,kind){if(kind===want)return true;if(kind==='sqrect')return want==='sq'||want==='rect';if(want==='quad')return['quad','sq','rect','sqrect'].includes(kind);return false}
function startDraw(id){try{speechSynthesis.cancel()}catch(e){}const ks=DRAW_ISL[id]||['sq','rect','tri'];let pool=[];while(pool.length<DRAW_N)pool=pool.concat(shuf(ks.slice()));
 go({k:'drawg',id,qs:pool.slice(0,DRAW_N),j:0,hearts:3,ok:0,tries:0,res:[],strokes:[],result:null,tip:false,sheet:null,end:false,pass:false,t0:Date.now()});setTimeout(drawSay,250)}
function drawSay(){const g=scr;if(!g||g.k!=='drawg'||g.end)return;const n=DRAW_NAME[dL()][g.qs[g.j]];try{sayJ(dEN()?`Draw a ${n}!`:`Em vẽ một ${n} nhé!`)}catch(e){}}
function viewDraw(){const g=scr,x=isl1(g.id),en=dEN(),n=g.qs.length;
 if(g.end){const best=(S.st[sid].p1[g.id]||{}).draw;return`<div class="game g1"><div class="gend"><div class="bigicon bossend">${jenny(76,g.pass?'cheer':'sad')}${g.pass?spr('star',70):''}</div><h1>${g.pass?(en?'Level passed!':'Qua màn!'):(en?"Let's try again!":'Mình chơi lại nhé!')}</h1><p class="muted">${en?`${g.ok}/${n} shapes correct`:`Vẽ đúng ${g.ok}/${n} hình`}${g.coins?` · +${g.coins} ${en?'coins':'xu'}`:''}</p><div class="gendbtn"><button class="gobtn" type="button" onclick="startDraw('${g.id}')">${en?'Play again':'Chơi lại'}</button><button class="gobtn ghost" type="button" onclick="go({k:'island',id:'${g.id}'})">${en?'Back to island':'Về đảo'}</button></div></div></div>`}
 const want=g.qs[g.j],nm=DRAW_NAME[dL()][want];
 const track=`<div class="planks" aria-label="${g.j+1}/${n}">${g.qs.map((_,k)=>`<i class="${g.res[k]===true?'ok':g.res[k]===false?'bad':k===g.j?'cur':''}"></i>`).join('')}</div>`;
 const sh=g.sheet?(g.sheet.ok?`<div class="sheet ok"><div class="sh"><span class="ic">✓</span><div><b>${en?'Correct!':'Đúng rồi!'}</b><div>${esc(g.sheet.msg)}</div></div></div><button class="gobtn" type="button" onclick="drawNext()">${en?'Continue':'Tiếp tục'}</button></div>`
  :`<div class="sheet warn"><div class="sh"><span class="ic">!</span><div><b>${en?'Not quite':'Chưa đúng'}</b><div>${esc(g.sheet.msg)}</div></div></div><button class="gobtn" type="button" onclick="drawRetry()">${en?'Draw again':'Vẽ lại'}</button></div>`)
  :`<div class="dwbtns"><button class="gobtn ghost" type="button" onclick="drawClear()">${en?'Clear':'Xoá'}</button><button class="gobtn ghost" type="button" onclick="scr.tip=!scr.tip;drawPaint()">${en?'Hint':'Gợi ý'}</button><button class="gobtn" type="button" onclick="drawCheck()">${en?'Done ✓':'Xong ✓'}</button></div>`;
 return`<div class="game g1 dwgame" role="dialog" aria-label="${esc(x.title)}"><div class="gtop"><button class="gx" onclick="try{speechSynthesis.cancel()}catch(e){};go({k:'island',id:'${g.id}'})" aria-label="${en?'Exit':'Thoát'}">✕</button>${track}<span class="hearts" aria-label="${g.hearts}">${[0,1,2].map(i=>`<span class="${i<g.hearts?'':'lost'}">${spr(i<g.hearts?'heart':'heartE',24)}</span>`).join('')}</span></div>
  <div class="gmid"><div class="g1q">${jenny(54,g.sheet?(g.sheet.ok?'cheer':'sad'):'idle')}<div class="g1bub"><div>${en?`Draw a <b>${nm}</b>!`:`Em vẽ một <b>${nm}</b> nhé!`}</div><button class="g1spk" type="button" onclick="drawSay()" aria-label="${en?'Listen':'Nghe lại'}">🔊</button></div></div>
   <div class="dwboard" id="dwboard"><canvas id="dwcv" aria-label="${en?'Drawing paper':'Tờ giấy để vẽ'}"></canvas>${g.strokes.length?'':`<span class="dwhint">${en?'Draw with your finger':'Dùng ngón tay để vẽ'}</span>`}</div></div>
  <div class="gbot">${sh}</div></div>`}
/* vẽ lên canvas */
let DW={W:0,cur:null};
function drawSetup(){const cv=document.getElementById('dwcv');if(!cv)return;const box=document.getElementById('dwboard');const r=box.getBoundingClientRect(),dpr=window.devicePixelRatio||1;DW.W=r.width;DW.H=r.height;cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);DW.cx=cv.getContext('2d');DW.cx.setTransform(dpr,0,0,dpr,0,0);
 const pos=e=>{const b=cv.getBoundingClientRect();return[(e.clientX-b.left),(e.clientY-b.top)]};
 cv.onpointerdown=e=>{const g=scr;if(g.sheet||g.end)return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}if(g.result){g.strokes=[];g.result=null}DW.cur=[pos(e)];g.strokes.push(DW.cur);const h=box.querySelector('.dwhint');if(h)h.remove();drawPaint()};
 cv.onpointermove=e=>{if(!DW.cur)return;const p=pos(e),l=DW.cur[DW.cur.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])>2){DW.cur.push(p);drawPaint()}};
 cv.onpointerup=cv.onpointercancel=()=>{DW.cur=null};drawPaint()}
function drawPaint(){const g=scr,c=DW.cx;if(!c||!g||g.k!=='drawg')return;const W=DW.W,H=DW.H,css=n=>getComputedStyle(document.body).getPropertyValue(n).trim();c.clearRect(0,0,W,H);
 const s=Math.min(W,H)/14;c.fillStyle=css('--line')||'#C9D1E6';for(let x=s/2;x<W;x+=s)for(let y=s/2;y<H;y+=s)c.fillRect(Math.round(x)-1,Math.round(y)-1,3,3);
 if(g.tip){const m=Math.min(W,H),cx0=W/2,cy0=H/2,k=g.qs[g.j];const P=k==='sq'?[[cx0-m*.3,cy0-m*.3],[cx0+m*.3,cy0-m*.3],[cx0+m*.3,cy0+m*.3],[cx0-m*.3,cy0+m*.3]]:k==='rect'?[[cx0-m*.42,cy0-m*.22],[cx0+m*.42,cy0-m*.22],[cx0+m*.42,cy0+m*.22],[cx0-m*.42,cy0+m*.22]]:k==='quad'?[[cx0-m*.3,cy0-m*.25],[cx0+m*.36,cy0-m*.3],[cx0+m*.25,cy0+m*.3],[cx0-m*.4,cy0+m*.22]]:[[cx0,cy0-m*.34],[cx0+m*.36,cy0+m*.3],[cx0-m*.36,cy0+m*.3]];
  c.save();c.strokeStyle='#12B5E8';c.globalAlpha=.6;c.lineWidth=6;c.setLineDash([2,12]);c.lineCap='round';c.beginPath();P.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.stroke();c.restore()}
 c.strokeStyle=css('--ink')||'#1F2A5A';c.fillStyle=c.strokeStyle;c.lineWidth=Math.max(5,W/70);c.lineCap='round';c.lineJoin='round';
 for(const st of g.strokes){if(st.length<2){c.fillRect(st[0][0]-3,st[0][1]-3,6,6);continue}c.beginPath();st.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke()}
 const r=g.result;if(r&&r.poly){c.save();c.strokeStyle=r.good?'#2AB563':'#F04A1B';c.lineWidth=4;c.setLineDash([10,8]);c.beginPath();r.poly.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));if(r.kind!=='open')c.closePath();c.stroke();c.restore()}}
function drawClear(){const g=scr;if(g.sheet)return;g.strokes=[];g.result=null;sfx('tap');render()}
function drawCheck(){const g=scr;if(g.sheet||g.end)return;const L=dL(),pk=a=>a[Math.floor(Math.random()*a.length)];
 if(!g.strokes.length){g.sheet={ok:false,msg:L==='en'?'Draw the shape on the dotted paper first.':'Em vẽ hình lên tờ giấy chấm trước nhé!',empty:1};sfx('bad');render();return}
 const want=g.qs[g.j],r=nhanHinh(g.strokes),ok=drawWantOk(want,r.kind);g.result={...r,good:ok};
 if(ok){g.ok++;if(g.res[g.j]===undefined)g.res[g.j]=true;const c=addCoins(sid,5,'self');g.coins=(g.coins||0)+(c||0);const m=pk(DRAW_OK[L]);g.sheet={ok:true,msg:m+(c?` +${c} ${L==='en'?'coins':'xu'}`:'')};sfx('ok');try{sayJ((L==='en'?'Correct! ':'Đúng rồi! ')+m)}catch(e){}}
 else{g.tries++;g.hearts--;if(g.res[g.j]===undefined)g.res[g.j]=false;setTimeout(()=>{try{hurtFx(1)}catch(e){}},30);sfx('bad');const m=pk(DRAW_BAD[L]);g.sheet={ok:false,msg:m};if(g.tries>=2)g.tip=true;try{sayJ((L==='en'?'Not quite. ':'Chưa đúng. ')+m)}catch(e){}
  if(g.hearts<=0){save();return drawEnd(false)}}
 save();render()}
function drawRetry(){const g=scr;if(g.sheet&&g.sheet.empty){g.sheet=null;render();return}g.sheet=null;g.strokes=[];g.result=null;render()}
function drawNext(){const g=scr;g.sheet=null;g.strokes=[];g.result=null;g.tip=false;g.tries=0;if(g.j<g.qs.length-1){g.j++;render();setTimeout(drawSay,200)}else drawEnd(true)}
function drawEnd(alive){const g=scr,st=S.st[sid],s=s1(st,g.id);g.end=true;g.pass=alive&&g.hearts>0;
 if(g.pass){if(!s.draw){s.draw=true;st.coins+=10;g.coins=(g.coins||0)+10}try{log(sid,'passed',`Toán ${curG()} · ${isl1(g.id).title} · màn vẽ hình`,0,{success:true,score:{raw:g.ok,max:g.qs.length}})}catch(e){}sfx('win');try{sayJ(dEN()?'Level passed! Well done!':'Em qua màn rồi! Giỏi quá!')}catch(e){}}
 else{sfx('lose');try{sayJ(dEN()?"That's OK. Let's play again!":'Không sao cả. Mình chơi lại nhé!')}catch(e){}}
 save();render()}
/* nối vào app */
{hooks.on('viewHS',_vh=>function(){try{if(scr.k==='drawg')return viewDraw()}catch(e){console.error(e)}return _vh.apply(this,arguments)})}
{hooks.on('render',_r=>function(){const a=_r.apply(this,arguments);try{if(role==='hs'&&scr.k==='drawg'){document.body.classList.add('gaming');if(!scr.end)drawSetup()}}catch(e){}return a})}
try{addEventListener('resize',()=>{if(scr&&scr.k==='drawg'&&!scr.end)drawSetup()})}catch(e){}
/* trang đảo: thêm dòng "Màn vẽ hình" sau các màn hiện có */
{hooks.on('viewIsland1',_vi=>function(){const r=_vi.apply(this,arguments);try{const id=scr.id;if(!DRAW_ISL[id]||curG()>5)return r;const x=isl1(id),st=S.st[sid],s=s1(st,id),en=dEN(),can=UNL||s.m[0],done=!!s.draw,ks=DRAW_ISL[id].map(k=>DRAW_NAME[dL()][k]).join(', ');
  const li=`<li class="${done?'done':''} ${!can&&!done?'off':''} dwli"><span class="n">${done?'✓':spr('pencil',22)}</span><div class="grow"><b>${en?`Level ${x.nm+1} · Draw shapes`:`Màn ${x.nm+1} · Vẽ hình`}</b><span class="muted">${en?`Draw by hand: ${ks} · ${DRAW_N} shapes · 3 hearts`:`Vẽ tay: ${ks} · ${DRAW_N} hình · 3 tim`}</span></div><button class="btn sm" ${can?'':'disabled'} onclick="startDraw('${id}')">${can?(done?(en?'Play again':'Chơi lại'):(en?'Play':'Chơi')):'🔒'}</button></li>`;
  const i=r.indexOf('<ul class="tl">');if(i<0)return r;const j=r.indexOf('</ul>',i);return r.slice(0,j)+li+r.slice(j)}catch(e){return r}})}
Object.assign(PXS,{pencil:["......kk",".....kak","....kaak","...kaak.","..kaak..",".kwak...","kkwk....","kk......"].map(r=>r.replace(/w/g,'t'))});
document.head.insertAdjacentHTML('beforeend',`<style>
.dwgame .gmid{display:flex;flex-direction:column;gap:10px}
.dwboard{position:relative;flex:none;aspect-ratio:1/1;width:min(100%,58vh,520px);margin:0 auto;background:var(--surface,#fff);box-shadow:var(--f2);touch-action:none}
.dwboard canvas{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:crosshair;touch-action:none}
.dwhint{position:absolute;left:10px;top:8px;font-family:var(--f-display);font-size:20px;color:var(--muted);pointer-events:none}
.dwbtns{display:grid;grid-template-columns:1fr 1fr 1.4fr;gap:10px}
.dwbtns .gobtn{margin:0}
</style>`);
try{startDraw=gateWrap(startDraw)}catch(e){}
