/* 86 — Trang vở kiểu Vở bài tập (thầy duyệt ảnh mẫu 13/11/2026)
   - Tự luyện lớp 1, Bài 5 "Mấy và mấy" (tách – gộp số): trang vở có 3 bài kiểu vở + 2 câu của đảo + ★.
   - 3 kiểu thao tác mới (đều là q.type='cells', chấm bằng bộ chấm ô của Tự luyện):
       vodien · Điền ô: có khung MẪU làm sẵn; a) điền 1 ô sơ đồ, b) điền cả sơ đồ, c) câu "Gộp □ và □ được □".
       vonoi  · Nối: 3 sơ đồ cùng số tổng ↔ 3 tranh; nét đứt là mẫu; chạm chấm trái rồi chạm chấm phải.
       vokeo  · Kéo thả: kéo (hoặc chạm) thẻ số vào ô trống của sơ đồ và câu; chạm ô đã điền để bỏ.
   - Dạng bài lấy từ Vở bài tập Toán 1 (tham khảo), viết lại lời, số mới mỗi lần, hình pixel tự vẽ.
   - Hai thành phần đổi chỗ (ô trên/ô dưới khi cả sơ đồ trống, "Gộp □ và □") vẫn tính đúng. */
(function(){
const T=(vi,en)=>arcT(vi,en);
const RR=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const VC={k:'#1F2A5A',w:'#FFFFFF',r:'#F04A1B',N:'#6B3F1D',g:'#2AB563',G:'#1E8A4A',a:'#FCB40C',y:'#FCD655',c:'#F26249',t:'#F6D98B',T:'#E2B85E',b:'#12B5E8',p:'#8656A8'};
const VS={
 tao:["...N.gg","..rNrr.",".rrrrrr","rrwrrrr","rrwrrrr","rrrrrrr",".rrrrr.","..r.r.."],
 sao:["...a...","..aya..","aaayaaa",".aayaa.","..aaa..",".aa.aa.","a.....a"],
 banh:["..ccc..",".cwccc.","ccccccc","ccccccc","TtTtTtT",".TtTtT.",".tTtTt."],
 ca:[".......","..bb..b",".bbbbbb","bwbbbbb","bbbbbb.",".bbb..b"],
 bong:["..ccc..",".ccwcc.",".ccccc.",".ccccc.","..ccc..","...k...","...k..."],
 hoa:["..ppp..",".ppypp.","ppyyypp",".ppypp.","..ppp..","...g...","..gGg.."]
};
const VO_LAYS=['vodien','vonoi','vokeo'];
function vspr(n,s){const m=VS[n],h=m.length,w=7;let r='';m.forEach((row,y)=>[...row].forEach((c,x)=>{if(c!=='.')r+=`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${VC[c]}"/>`}));return`<svg width="${w*s}" height="${h*s}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`}
function vgrp(n,k,s){return`<div class="vogrp" style="width:${Math.ceil(21*s+12)}px">${Array(k).fill(vspr(n,s)).join('')}</div>`}
function vpic(n,a,b,s){return`<div class="vopic" role="img" aria-label="${a} ${T('và','and')} ${b}">${vgrp(n,a,s)}${vgrp(n,b,s)}</div>`}
/* sơ đồ tách – gộp: ô tổng bên trái, hai ô thành phần bên phải. c = hàm vẽ một ô (giá trị hoặc null) */
function vsd(v,c,sm){const W=sm===2?96:sm?100:112,bw=sm===2?28:sm?30:34,H=sm?60:66,bh=sm?28:30,P=[[0,(H-bh)/2],[W-bw,0],[W-bw,H-bh]];
 return`<div class="vosd" style="width:${W}px;height:${H}px"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><path d="M${bw} ${H/2} L${W-bw} ${bh/2} M${bw} ${H/2} L${W-bw} ${H-bh/2}" stroke="#1F2A5A" stroke-width="2.5" fill="none"/></svg>${v.map((x,i)=>`<div class="vobx" style="left:${P[i][0]}px;top:${P[i][1]}px;width:${bw}px;height:${bh}px">${c(x)}</div>`).join('')}</div>`}
const head=()=>{const g=scr,x=isl1(g.id),L=PRIM[curG()].isl,q=q1();return`<div class="vorib"><span>${esc(shortTitle(x.lesson||x.title||''))}</span><small>${T('TRANG','PAGE')} ${L.indexOf(x)+1}</small></div><div class="volenh"><span class="vono">${g.j+1}</span><div class="volt">${q.q}</div><button class="vospk" type="button" onclick="sayJ(sayFull(q1().say,q1().q))" aria-label="${T('Nghe lại đề','Listen again')}">🔊</button></div>`};
const mk=(lo,hi,used)=>{for(let t=0;t<30;t++){const n=RR(lo,hi),a=RR(1,n-1);if(!used||!used.has(n)){used&&used.add(n);return[n,a,n-a]}}const n=RR(lo,hi),a=RR(1,n-1);return[n,a,n-a]};
const base=o=>Object.assign({type:'cells',pic:'@@TLFIG@@',key:'',src:null,nokey:o.lay!=='vodien'},o,{rows:[o.a.map(()=>null)],label:o.kind});

/* ---------- 1. Điền ô (có Mẫu) ---------- */
function voDien(){const sp=shuf(Object.keys(VS)),U=new Set(),M=mk(4,6),A=mk(3,7,U),B=mk(4,9,U),C=mk(4,9,U);
 const a=[A[2],B[0],B[1],B[2],C[1],C[2],C[0]];
 return base({lay:'vodien',kind:'Vở: tách – gộp số',sp,M,A,B,C,a,sw:[[2,3],[4,5]],
  q:T('<b>Đếm</b> rồi điền số vào sơ đồ tách – gộp.','<b>Count</b>, then fill in the part–whole diagrams.'),
  say:T('Em đếm rồi điền số vào sơ đồ tách gộp. Nhìn mẫu trước nhé.','Count, then fill in the part whole diagrams. Look at the example first.'),
  need:T('Em điền hết các ô trống nhé.','Fill in every box first.'),
  sol:T(`a) ${A[0]} gồm ${A[1]} và ${A[2]} · b) ${B[0]} gồm ${B[1]} và ${B[2]} · c) Gộp ${C[1]} và ${C[2]} được ${C[0]}`,`a) ${A[0]} is ${A[1]} and ${A[2]} · b) ${B[0]} is ${B[1]} and ${B[2]} · c) ${C[1]} and ${C[2]} make ${C[0]}`)})}
function figDien(q){const g=scr;let b=0;
 const cell=x=>{if(x!==null)return`<span class="votc">${x}</span>`;const i=b++,v=(g.cv&&g.cv[i])||'';return`<button type="button" class="votc e ${i===g.cc?'cur':''} ${g.cbad&&g.cbad.includes(i)?'bad':''}" onclick="tlCell(${i})" aria-label="${T('Ô trống','Blank')} ${i+1}">${esc(v)}</button>`};
 const mau=x=>`<span class="votc m">${x}</span>`,[A,B,C,M]=[q.A,q.B,q.C,q.M];
 return`<div class="vopg">${head()}<div class="voin">
  <div class="vomau"><span class="votag">${T('MẪU','EXAMPLE')}</span><div class="voit">${vpic(q.sp[0],M[1],M[2],2)}${vsd(M,mau,1)}</div><div class="vosent m">${T(`${M[0]} gồm ${M[1]} và ${M[2]}`,`${M[0]} is ${M[1]} and ${M[2]}`)}</div></div>
  <div class="voit"><span class="volb">a)</span>${vpic(q.sp[1],A[1],A[2],2)}${vsd([A[0],A[1],null],cell,1)}</div>
  <div class="voit"><span class="volb">b)</span>${vpic(q.sp[2],B[1],B[2],2)}${vsd([null,null,null],cell,1)}</div>
  <div class="voit top"><span class="volb">c)</span><div>${vpic(q.sp[3],C[1],C[2],2)}<div class="vosent">${T('Gộp','Put')} ${cell(null)} ${T('và','and')} ${cell(null)} ${T('được','together to make')} ${cell(null)}</div></div></div>
 </div></div>`}
/* b) sơ đồ trống: vẽ theo thứ tự tổng, trên, dưới → đáp án B[0],B[1],B[2] (đã đúng thứ tự a[1..3]) */

/* ---------- 2. Nối ---------- */
function voNoi(){const n=RR(6,9),as=shuf(Array.from({length:Math.floor(n/2)},(_,i)=>i+1)).slice(0,3),L=as.map(a=>[n,a,n-a]),R=shuf([0,1,2]),sp=pick(Object.keys(VS));
 /* R[k] = sơ đồ nào ứng với tranh k; đáp án: tranh của sơ đồ 1, 2 */
 const a=[R.indexOf(1),R.indexOf(2)];
 return base({lay:'vonoi',kind:'Vở: nối sơ đồ với hình',n,L,R,sp,a,
  q:T('<b>Nối</b> mỗi sơ đồ với hình phù hợp.','<b>Match</b> each diagram to the right picture.'),
  say:T('Em nối mỗi sơ đồ với hình phù hợp. Nét đứt là mẫu.','Match each diagram to the right picture. The dashed line is the example.'),
  need:T('Em nối hết các sơ đồ nhé.','Match every diagram first.'),
  sol:L.map(l=>T(`${l[0]} gồm ${l[1]} và ${l[2]}`,`${l[0]} is ${l[1]} and ${l[2]}`)).join(' · ')})}
const NR=84,NX=[109,137];
function figNoi(q){const g=scr,cv=g.cv||[],sel=g.vsel;const sd=l=>vsd(l,x=>`<span class="votc">${x}</span>`,2);
 let rows='';for(let i=0;i<3;i++){const p=q.L[q.R[i]];const li=i?`<button type="button" class="vodt ${sel===i?'on':''} ${cv[i-1]!==''&&cv[i-1]!=null?'dn':''} ${g.cbad&&g.cbad.includes(i-1)?'bad':''}" onclick="voDot(0,${i})" aria-label="${T('Sơ đồ','Diagram')} ${i+1}"><i></i></button>`:`<span class="vodt mau"><i></i></span>`;
  rows+=`<div class="vonr">${sd(q.L[i])}${li}<span class="vogap"></span><button type="button" class="vodt ${sel?'ask':''}" onclick="voDot(1,${i})" aria-label="${T('Hình','Picture')} ${i+1}"><i></i></button>${vpic(q.sp,p[1],p[2],1.5)}</div>`}
 const y=r=>r*NR+NR/2,m=q.R.indexOf(0);let ln=`<path d="M${NX[0]} ${y(0)} L${NX[1]} ${y(m)}" stroke="#8aa0c4" stroke-width="3" stroke-dasharray="6 4"/>`;
 cv.forEach((v,k)=>{if(v!==''&&v!=null)ln+=`<path d="M${NX[0]} ${y(k+1)} L${NX[1]} ${y(+v)}" stroke="${g.cbad&&g.cbad.includes(k)?'#E0441A':'#0079C1'}" stroke-width="4"/>`});
 return`<div class="vopg">${head()}<div class="voin"><div class="vohint">${T('Chạm chấm bên trái, rồi chạm chấm bên phải. Nét đứt là mẫu.','Tap a dot on the left, then a dot on the right. The dashed line is the example.')}</div>
  <div class="vonoi">${rows}<svg viewBox="0 0 252 ${3*NR}" width="252" height="${3*NR}" aria-hidden="true">${ln}</svg></div></div></div>`}
window.voDot=function(side,i){const g=scr,q=q1();if(g.sheet||!q||q.lay!=='vonoi')return;g.cv=g.cv||q.a.map(()=>'');
 if(side===0){g.vsel=i}
 else if(g.vsel){const k=g.vsel-1;/* một tranh chỉ nối một sơ đồ */g.cv=g.cv.map((v,j)=>j!==k&&v===String(i)?'':v);g.cv[k]=String(i);g.vsel=0;
  const nx=g.cv.findIndex(v=>v==='');if(nx>=0)g.vsel=nx+1;g.cbad=null}
 else{toast(T('Em chạm chấm bên trái trước nhé.','Tap a dot on the left first.'));return}
 sfx('tap');render()};

/* ---------- 3. Kéo thả ---------- */
function voKeo(){const U=new Set(),A=mk(5,9,U),B=mk(5,9,U),C=mk(4,9,U);
 const a=[A[1],A[1],B[2],B[2],C[0],C[0]],have=new Set(a);const ex=shuf(Array.from({length:10},(_,i)=>i+1).filter(v=>!have.has(v))).slice(0,2);
 return base({lay:'vokeo',kind:'Vở: kéo thẻ số',A,B,C,a,cards:shuf(a.concat(ex)),
  q:T('<b>Kéo</b> thẻ số vào ô trống cho đúng.','<b>Drag</b> the number cards into the boxes.'),
  say:T('Em kéo thẻ số vào ô trống cho đúng.','Drag the number cards into the boxes.'),
  need:T('Em đặt thẻ vào hết các ô trống nhé.','Put a card in every box first.'),
  sol:T(`a) ${A[0]} gồm ${A[1]} và ${A[2]} · b) ${B[0]} gồm ${B[1]} và ${B[2]} · c) Gộp ${C[1]} và ${C[2]} được ${C[0]}`,`a) ${A[0]} is ${A[1]} and ${A[2]} · b) ${B[0]} is ${B[1]} and ${B[2]} · c) ${C[1]} and ${C[2]} make ${C[0]}`)})}
const voUsed=(q,cv)=>{const left={};cv.forEach(v=>{if(v!==''&&v!=null)left[v]=(left[v]||0)+1});return q.cards.map(c=>{const k=String(c);if(left[k]){left[k]--;return true}return false})};
function figKeo(q){const g=scr,cv=g.cv||[];let b=0;
 const cell=x=>{if(x!==null)return`<span class="votc">${x}</span>`;const i=b++,v=cv[i]||'';return`<button type="button" class="votc e ${i===g.cc?'cur':''} ${v?'f':''} ${g.cbad&&g.cbad.includes(i)?'bad':''}" data-vb="${i}" onclick="voBox(${i})" aria-label="${T('Ô trống','Blank')} ${i+1}">${esc(v)}</button>`};
 const [A,B,C]=[q.A,q.B,q.C],us=voUsed(q,cv);
 const r1=`<div class="voit"><span class="volb">a)</span>${vsd([A[0],null,A[2]],cell)}<div class="vosent">${T(`${A[0]} gồm`,`${A[0]} is`)} ${cell(null)} ${T('và','and')} ${A[2]}</div></div>`;
 const r2=`<div class="voit"><span class="volb">b)</span>${vsd([B[0],B[1],null],cell)}<div class="vosent">${T(`${B[0]} gồm ${B[1]} và`,`${B[0]} is ${B[1]} and`)} ${cell(null)}</div></div>`;
 const r3=`<div class="voit"><span class="volb">c)</span>${vsd([null,C[1],C[2]],cell)}<div class="vosent">${T(`Gộp ${C[1]} và ${C[2]} được`,`${C[1]} and ${C[2]} make`)} ${cell(null)}</div></div>`;
 return`<div class="vopg">${head()}<div class="voin">${r1}${r2}${r3}
  <div class="vohint">${T('Kéo thẻ vào ô (hoặc chạm thẻ). Chạm ô đã điền để bỏ.','Drag a card into a box (or tap it). Tap a filled box to clear it.')}</div>
  <div class="votray">${q.cards.map((c,k)=>`<button type="button" class="vocard ${us[k]?'used':''}" data-vc="${k}" ${us[k]?'disabled':''} aria-label="${T('Thẻ số','Card')} ${c}">${c}</button>`).join('')}</div></div></div>`}
function voPut(k,i){const g=scr,q=q1();if(g.sheet||!q||q.lay!=='vokeo')return;g.cv=g.cv||q.a.map(()=>'');if(voUsed(q,g.cv)[k])return;
 if(i===undefined||i<0)i=g.cv[g.cc]===''?g.cc:g.cv.indexOf('');if(i<0)return;g.cv[i]=String(q.cards[k]);
 const nx=g.cv.findIndex((v,j)=>j>i&&v===''),n0=g.cv.indexOf('');g.cc=nx>=0?nx:n0>=0?n0:i;g.cbad=null;sfx('tap');render()}
window.voPut=voPut;
window.voBox=function(i){const g=scr,q=q1();if(g.sheet||!q)return;g.cv=g.cv||q.a.map(()=>'');if(g.cv[i])g.cv[i]='';g.cc=i;sfx('tap');render()};
/* kéo bằng ngón tay / chuột (giống kéo thẻ ở đảo) */
(function(){let d=null;
 document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('.vocard');if(!b||b.disabled)return;e.preventDefault();const r=b.getBoundingClientRect(),gh=b.cloneNode(true);gh.className='vocard g1ghost';Object.assign(gh.style,{width:r.width+'px',height:r.height+'px',left:r.left+'px',top:r.top+'px'});document.body.appendChild(gh);d={k:+b.dataset.vc,x0:e.clientX,y0:e.clientY,dx:e.clientX-r.left,dy:e.clientY-r.top,gh,mv:false};try{b.setPointerCapture(e.pointerId)}catch(_){}});
 const under=e=>{d.gh.style.visibility='hidden';const el=document.elementFromPoint(e.clientX,e.clientY);d.gh.style.visibility='';return el&&el.closest&&el.closest('[data-vb]')};
 document.addEventListener('pointermove',e=>{if(!d)return;if(Math.hypot(e.clientX-d.x0,e.clientY-d.y0)>6)d.mv=true;d.gh.style.left=(e.clientX-d.dx)+'px';d.gh.style.top=(e.clientY-d.dy)+'px';document.querySelectorAll('.votc.over').forEach(s=>s.classList.remove('over'));const s=under(e);if(s)s.classList.add('over')});
 document.addEventListener('pointerup',e=>{if(!d)return;const s=under(e),x=d;d=null;x.gh.remove();if(s)voPut(x.k,+s.dataset.vb);else if(!x.mv)voPut(x.k)});
 document.addEventListener('pointercancel',()=>{if(d){d.gh.remove();d=null}});
})();

/* ---------- nối vào Tự luyện ---------- */
window.VO_FIG={vodien:figDien,vonoi:figNoi,vokeo:figKeo};
/* trang vở theo bài (lớp, số bài KNTT) — chạy trong tlQs nên dùng chung seed của trang */
window.voPage=function(x){const g=curG();if(g===1&&x.b===5)return[voDien(),voNoi(),voKeo()];return[]};
/* đổi chỗ hai thành phần vẫn đúng: đưa về thứ tự đáp án trước khi chấm */
function voNorm(q,v){if(!q||!q.sw||!Array.isArray(v))return v;v=v.slice();q.sw.forEach(([i,j])=>{if(Number(v[i])===q.a[j]&&Number(v[j])===q.a[i]){const t=v[i];v[i]=v[j];v[j]=t}});return v}
{const _a=ans1;ans1=function(v){const g=scr,q=g&&g.qs?q1():null;if(q&&q.sw&&Array.isArray(v)){v=voNorm(q,v);if(g.cv)g.cv=v.map(String)}if(q&&q.lay==='vonoi')g.vsel=0;return _a.call(this,v)}}
{const _i=input1;input1=function(q){if(q&&q.lay==='vodien'&&!scr.sheet)return`<div class="vopad">${['1','2','3','4','5','⌫','6','7','8','9','0','✓'].map(k=>`<button type="button" class="${k==='✓'?'go':k==='⌫'?'del':''}" onclick="tlKey('${k}')" aria-label="${k==='⌫'?T('Xóa','Delete'):k==='✓'?T('Xong bài','Done'):k}">${k==='✓'?T('Xong','Done'):k}</button>`).join('')}</div>`;
 if(q&&q.type==='cells'&&(q.lay==='vonoi'||q.lay==='vokeo'))return`<button class="gobtn" type="button" onclick="tlXong()">${T('Xong bài','Done')}</button>`;return _i.apply(this,arguments)}}
{const _s=show1;show1=function(q){if(q&&q.lay==='vonoi')return'';return _s.apply(this,arguments)}}
{const _v=viewGame1;viewGame1=function(){const g=scr;let vo=false;if(g&&g.qs&&!g.end){const q=q1();vo=!!(q&&VO_LAYS.includes(q.lay));if(q&&q.lay==='vonoi'&&g.vj!==g.j){g.vj=g.j;g.vsel=1}}
 let h=_v.apply(this,arguments);if(vo)h=h.replace(/<div class="g1q">[\s\S]*?<\/button><\/div><\/div>/,'').replace('<div class="gmid','<div class="vomid gmid');return h}}
/* vừa một màn hình: không phải kéo. Thu nhỏ trang vở cho tới khi vừa chỗ trống (thầy yêu cầu 13/11/2026) */
function voFit(){const pg=document.querySelector('.vomid .vopg');if(!pg)return;const mid=pg.closest('.gmid'),gm=pg.closest('.game');pg.style.zoom='';
 for(let t=0;t<4;t++){const over=Math.max(mid.scrollHeight-mid.clientHeight,gm.scrollHeight-gm.clientHeight,0);if(over<2)break;const z=(parseFloat(pg.style.zoom)||1),hh=pg.getBoundingClientRect().height;
  const nz=Math.max(.5,z*(hh-over-4)/hh);if(nz>=z-.005)break;pg.style.zoom=nz.toFixed(3)}}
window.voFit=voFit;
{const _a=g1AfterRender;g1AfterRender=function(){const r=_a.apply(this,arguments);try{voFit()}catch(e){}return r}}
addEventListener('resize',()=>{try{voFit()}catch(e){}});
Object.assign(I18N,{'Vở: tách – gộp số':'Book: part–whole','Vở: nối sơ đồ với hình':'Book: match diagrams','Vở: kéo thẻ số':'Book: number cards'});

document.head.insertAdjacentHTML('beforeend',`<style>
.vopg{width:100%;max-width:360px;background:#fff;box-shadow:var(--f2);position:relative;color:#1F2A5A;
 background-image:linear-gradient(#d6e4f5 1px,transparent 1px),linear-gradient(90deg,#d6e4f5 1px,transparent 1px);background-size:16px 16px;background-position:-1px -1px;padding-bottom:8px}
.vopg:before{content:"";position:absolute;left:22px;top:0;bottom:0;width:2px;background:#f6b1a4}
.vorib{background:#0079C1;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:3px 8px;font-family:VT323,var(--f-display);font-size:21px;line-height:1.1;position:relative;text-transform:uppercase}
.vorib small{font-size:14px;opacity:.9;white-space:nowrap}
.voin{padding:6px 6px 0 28px;position:relative;display:flex;flex-direction:column;gap:8px;align-items:flex-start}
.voit{display:flex;align-items:center;gap:8px;position:relative}.voit.top{align-items:flex-start}
.volb{font-weight:800;font-size:15px;width:16px;background:#fff;flex:none}
.vopic{display:flex;justify-content:center;background:#fff;padding:3px;box-shadow:inset 0 0 0 2px #1F2A5A;flex:none}
.vogrp{display:flex;flex-wrap:wrap;gap:3px;padding:3px;align-content:center;justify-content:center;flex:none}.vogrp+.vogrp{border-left:2px dashed #9AA4C0}
.vosd{position:relative;flex:none}.vosd>svg{position:absolute;inset:0}.vobx{position:absolute;display:flex}
.votc{width:100%;height:100%;display:grid;place-items:center;background:#fff;color:#1F2A5A;font-family:var(--f-display);font-size:20px;line-height:1;box-shadow:inset 0 0 0 2px #1F2A5A;border:0;padding:0}
.vosent .votc{display:inline-grid;width:30px;height:28px;vertical-align:middle}
.votc.m{color:#6a7aa0;box-shadow:inset 0 0 0 2px #8aa0c4}
.votc.e{cursor:pointer;color:#0079C1}.votc.e.cur{background:#FCD655;box-shadow:inset 0 0 0 3px #FCB40C}.votc.e.bad{background:#FDE6DE}.votc.over{background:#DDF3FB;box-shadow:inset 0 0 0 3px #0079C1}
.vomau{border:2px dashed #8aa0c4;background:#f7faff;padding:8px 8px 2px;position:relative;align-self:stretch;margin-right:2px}
.votag{position:absolute;top:-11px;left:8px;background:#E3E7F0;font-family:VT323,var(--f-display);font-size:16px;line-height:1.1;padding:0 6px;border:2px solid #8aa0c4}
.vosent{font-size:15px;font-weight:600;display:flex;align-items:center;gap:5px;flex-wrap:wrap;background:#fff;padding:2px 4px;margin-top:4px}.vosent.m{color:#6a7aa0;background:none}
.vohint{font-size:12.5px;color:#566779;background:#fff;padding:0 3px;line-height:1.35}
.vonoi{position:relative;width:252px}.vonoi>svg{position:absolute;left:0;top:0;pointer-events:none}
.vonr{display:flex;align-items:center;height:${NR}px}.vogap{width:2px;flex:none}
.vodt{width:26px;height:34px;display:grid;place-items:center;border:0;background:transparent;padding:0;cursor:pointer;flex:none;position:relative;z-index:1}
.vodt i{width:14px;height:14px;background:#1F2A5A;display:block}.vodt.on i{background:#FCB40C;outline:3px solid #FCD655}.vodt.ask i{outline:3px solid #DDF3FB}.vodt.mau i{background:#8aa0c4}.vodt.bad i{background:#E0441A}
.vonr .vopic{margin-left:4px}
.votray{display:flex;gap:7px;flex-wrap:wrap;justify-content:center;background:#fff4cf;padding:8px;box-shadow:inset 0 0 0 2px #1F2A5A;align-self:stretch;margin-right:2px}
.vocard{width:38px;height:36px;border:0;background:#fff;color:#1F2A5A;font-family:var(--f-display);font-size:20px;box-shadow:var(--f2),0 3px 0 0 #1F2A5A;cursor:grab;touch-action:none;padding:0}
.vocard.used{opacity:.25;cursor:default}.vocard.g1ghost{background:#FCD655;transform:rotate(-6deg)}
.vomid{justify-content:flex-start!important;padding-top:4px!important;overflow-y:hidden!important}
.vomid .vopg{margin:0 auto}
.volenh{display:flex;gap:8px;align-items:center;padding:6px 6px 0 28px;position:relative}
.vono{min-width:26px;height:26px;background:#0079C1;color:#fff;display:grid;place-items:center;font-family:VT323,var(--f-display);font-size:22px;box-shadow:var(--f2);flex:none}
.volt{flex:1;font-weight:700;font-size:15px;line-height:1.3;background:#fff;padding:1px 2px}.volt b{color:#0079C1}
.vospk{width:34px;height:34px;border:0;background:#FCB40C;box-shadow:var(--f2);font-size:16px;cursor:pointer;flex:none;padding:0}
.vopad{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
.vopad button{height:44px;border:3px solid var(--pxk,#1F2A5A);box-shadow:0 3px 0 var(--pxk,#1F2A5A);background:var(--surface,#fff);color:var(--ink);font-family:var(--f-display);font-size:24px;cursor:pointer;padding:0}
.vopad button.go{background:#0079C1;color:#fff;font-size:20px}.vopad button.del{font-size:20px}
</style>`);
})();
