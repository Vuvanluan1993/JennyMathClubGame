/* 87 — Trang vở lớp 1, Chủ đề 1 "Các số từ 0 đến 10" (thầy đồng ý làm theo đề xuất 13/11/2026)
   Mỗi bài KNTT có 3 bài kiểu vở (+ 2 câu của đảo + ★), dựng từ "mẫu bài theo dạng":
     Bài 1, 2 (Các số 0–5, 6–10): Đếm rồi viết số (có Mẫu) · Nối tranh với số · Viết số còn thiếu vào dãy
     Bài 3 (Nhiều hơn, ít hơn, bằng nhau): Chọn nhiều hơn/ít hơn/bằng nhau (có Mẫu) · Nối nhóm bằng nhau · Đếm rồi kéo thẻ số
     Bài 4 (So sánh số): Chọn dấu >, <, = (có Mẫu) · Dấu qua hình · Kéo thẻ xếp thứ tự
     Bài 6 (Luyện tập chung): Chọn dấu · Nối sơ đồ tách – gộp (của Bài 5) · Viết số còn thiếu
   4 kiểu trang (q.type='cells'):
     vof · điền ô bằng bàn phím số     voc · chọn: chạm ô rồi chạm nút (dấu >, <, = hoặc chữ) ở dưới
     von · nối hai cột (vẽ dây sau khi vẽ màn, theo vị trí chấm)     vok · kéo/chạm thẻ số vào ô
   Mỗi câu có q.vchk() tự kiểm lại đáp án (tools/test/tu-luyen.js gọi). Lời viết lại, hình pixel tự vẽ. */
(function(){
const V=window.VO;if(!V)return;
const {T,RR,VS,vgrp,vpic,vsd,head,base,voUsed}=V;
const SP=()=>shuf(Object.keys(VS));
const distinct=(k,lo,hi)=>shuf(Array.from({length:hi-lo+1},(_,i)=>lo+i)).slice(0,k);
const SIGN=['>','<','='],sgn=(x,y)=>x>y?0:x<y?1:2;
['vof','voc','von','vok'].forEach(l=>{if(!V.VO_LAYS.includes(l))V.VO_LAYS.push(l)});

/* ---------- vẽ một "mảnh" của dòng ---------- */
function tok(t,cell,q){
 if(t==null)return'';if(V.tokX){const h=V.tokX(t,cell,q);if(h!=null)return h}if(typeof t==='string')return`<span class="votx">${t}</span>`;
 if(t.g)return`<div class="vopic one">${vgrp(t.g[0],t.g[1],t.s||2,t.c||4)}</div>`;
 if(t.g2)return vpic(t.g2[0],t.g2[1],t.g2[2],t.s||2);
 if(t.n!==undefined)return`<span class="votc vb1 ${String(t.n).length>2?'nw':''}">${t.n}</span>`;
 if(t.m!==undefined)return`<span class="votc m vb1">${t.m}</span>`;
 if(t.mc!==undefined)return`<span class="votc m vb1 ${q.wide?'w':''}">${q.opts[t.mc]}</span>`;
 if(t.b)return cell();
 if(t.sd)return vsd(t.sd,x=>x===null?cell():`<span class="votc">${x}</span>`,1);
 return''}
const row=(r,cell,q)=>`<div class="vorow">${r.lb?`<span class="volb">${r.lb}</span>`:''}${r.t.map(x=>tok(x,cell,q)).join('')}</div>`;
function cellFor(q){const g=scr,cv=g.cv||[];let b=0;const dg=q.lay==='voc'?0:Math.max(...(q.a||[0]).map(v=>String(v).length)),wst=dg>2?` style="width:${dg*12+12}px"`:'';
 return()=>{const i=b++,v=cv[i],bad=g.cbad&&g.cbad.includes(i)?'bad':'';
  if(q.lay==='vok')return`<button type="button"${wst} class="votc e vb1 ${i===g.cc?'cur':''} ${v?'f':''} ${bad}" data-vb="${i}" onclick="voBox(${i})" aria-label="${T('Ô trống','Blank')} ${i+1}">${esc(v||'')}</button>`;
  const shown=q.lay==='voc'?(v!==''&&v!=null?q.opts[+v]:''):(v||'');
  return`<button type="button"${wst} class="votc e vb1 ${q.lay==='voc'&&q.wide?'w':''} ${i===g.cc?'cur':''} ${bad}" onclick="tlCell(${i})" aria-label="${T('Ô trống','Blank')} ${i+1}">${q.raw?shown:esc(shown)}</button>`}}
function figForm(q){const cell=cellFor(q);
 const mau=q.mau?`<div class="vomau"><span class="votag">${T('MẪU','EXAMPLE')}</span>${row({t:q.mau},()=>'',q)}</div>`:'';
 let extra='';if(q.lay==='vok'){const us=voUsed(q,scr.cv||[]);extra=`<div class="vohint">${T('Kéo thẻ vào ô (hoặc chạm thẻ). Chạm ô đã điền để bỏ.','Drag a card into a box (or tap it). Tap a filled box to clear it.')}</div><div class="votray">${q.cards.map((c,k)=>`<button type="button" class="vocard ${us[k]?'used':''}" data-vc="${k}" ${us[k]?'disabled':''} aria-label="${T('Thẻ số','Card')} ${c}">${c}</button>`).join('')}</div>`}
 return`<div class="vopg">${head()}<div class="voin">${mau}<div class="vorows ${q.c2?'c2':''} ${q.tbl?'tbl':''}">${q.rows2.map(r=>row(r,cell,q)).join('')}</div>${extra}</div></div>`}
/* nối: lưới 5 cột [trái][chấm][khoảng][chấm][phải]; dây vẽ sau khi vẽ màn */
function figNoi2(q){const g=scr,cv=g.cv||[],sel=g.vsel,none=()=>'';
 let h='';for(let i=0;i<3;i++){const p=q.right[i];
  const li=i?`<button type="button" class="vodt ${sel===i?'on':''} ${cv[i-1]!==''&&cv[i-1]!=null?'dn':''} ${g.cbad&&g.cbad.includes(i-1)?'bad':''}" data-l="${i}" onclick="voDot2(0,${i})" aria-label="${T('Bên trái','Left')} ${i+1}"><i></i></button>`:`<span class="vodt mau" data-l="0"><i></i></span>`;
  h+=`<div class="vonc l">${q.left[i].map(x=>tok(x,none,q)).join('')}</div>${li}<span></span><button type="button" class="vodt ${sel?'ask':''}" data-r="${i}" onclick="voDot2(1,${i})" aria-label="${T('Bên phải','Right')} ${i+1}"><i></i></button><div class="vonc r">${p.map(x=>tok(x,none,q)).join('')}</div>`}
 return`<div class="vopg">${head()}<div class="voin"><div class="vohint">${T('Chạm chấm bên trái, rồi chạm chấm bên phải. Nét đứt là mẫu.','Tap a dot on the left, then a dot on the right. The dashed line is the example.')}</div>
  <div class="vonb">${h}<svg class="vonl" aria-hidden="true"></svg></div></div></div>`}
function voLines(){const b=document.querySelector('.vonb');if(!b)return;const q=q1(),g=scr;if(!q||q.lay!=='von')return;const svg=b.querySelector('.vonl');
 const at=el=>{let x=el.offsetWidth/2,y=el.offsetHeight/2,e=el;while(e&&e!==b){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent}return[x,y]};
 const L=i=>b.querySelector(`[data-l="${i}"]`),Rr=k=>b.querySelector(`[data-r="${k}"]`);
 svg.setAttribute('width',b.offsetWidth);svg.setAttribute('height',b.offsetHeight);svg.setAttribute('viewBox',`0 0 ${b.offsetWidth} ${b.offsetHeight}`);
 const ln=(a,c,st)=>{const [x1,y1]=at(a),[x2,y2]=at(c);return`<path d="M${x1} ${y1} L${x2} ${y2}" ${st}/>`};
 let s=ln(L(0),Rr(q.R.indexOf(0)),'stroke="#8aa0c4" stroke-width="3" stroke-dasharray="6 4"');
 (g.cv||[]).forEach((v,k)=>{if(v!==''&&v!=null)s+=ln(L(k+1),Rr(+v),`stroke="${g.cbad&&g.cbad.includes(k)?'#E0441A':'#0079C1'}" stroke-width="4"`)});svg.innerHTML=s}
window.voDot2=function(side,i){const g=scr,q=q1();if(g.sheet||!q||q.lay!=='von')return;g.cv=g.cv||q.a.map(()=>'');
 if(side===0)g.vsel=i;
 else if(g.vsel){const k=g.vsel-1;g.cv=g.cv.map((v,j)=>j!==k&&v===String(i)?'':v);g.cv[k]=String(i);g.vsel=0;const nx=g.cv.findIndex(v=>v==='');if(nx>=0)g.vsel=nx+1;g.cbad=null}
 else{toast(T('Em chạm chấm bên trái trước nhé.','Tap a dot on the left first.'));return}
 sfx('tap');render()};
window.voOpt=function(k){const g=scr,q=q1();if(g.sheet||!q||q.lay!=='voc')return;g.cv=g.cv||q.a.map(()=>'');g.cv[g.cc]=String(k);
 const nx=g.cv.findIndex((v,j)=>j>g.cc&&v===''),n0=g.cv.indexOf('');g.cc=nx>=0?nx:n0>=0?n0:g.cc;g.cbad=null;sfx('tap');render()};
Object.assign(VO_FIG,{vof:figForm,voc:figForm,vok:figForm,von:figNoi2});
Object.assign(V,{tok,figForm,SP,distinct,SIGN,sgn});

/* ---------- câu: khung chung ---------- */
const mkQ=o=>{const q=base(o);q.rows2=o.rows2;return q};
const LB=['a)','b)','c)','d)','e)','g)'];V.mkQ=mkQ;V.LB=LB;
/* Đếm rồi viết số */
function demViet(lo,hi){const sp=SP(),ns=distinct(5,lo,hi);const m=ns[0],R=ns.slice(1);
 return mkQ({lay:'vof',kind:'Vở: đếm rồi viết số',mau:[{g:[sp[0],m],s:2.2},{m}],rows2:R.map((n,i)=>({lb:LB[i],t:[{g:[sp[(i+1)%sp.length],n],s:2.2},{b:1}]})),a:R,
  q:T('<b>Đếm</b> rồi viết số.','<b>Count</b>, then write the number.'),say:T('Em đếm rồi viết số vào ô. Nhìn mẫu trước nhé.','Count, then write the number in the box. Look at the example first.'),
  need:T('Em điền hết các ô trống nhé.','Fill in every box first.'),sol:R.join(' · '),vchk(){return this.rows2.every((r,i)=>r.t[0].g[1]===this.a[i])}})}
/* Nối tranh với số */
function noiSo(lo,hi){const sp=pick(Object.keys(VS)),ns=distinct(3,Math.max(lo,1),hi),R=shuf([0,1,2]);
 return mkQ({lay:'von',kind:'Vở: nối tranh với số',left:ns.map(n=>[{g:[sp,n],s:2.2}]),right:R.map(k=>[{n:ns[k]}]),R,a:[R.indexOf(1),R.indexOf(2)],rows2:[],
  q:T('<b>Nối</b> mỗi tranh với số phù hợp.','<b>Match</b> each picture to its number.'),say:T('Em đếm rồi nối mỗi tranh với số phù hợp. Nét đứt là mẫu.','Count, then match each picture to its number. The dashed line is the example.'),
  need:T('Em nối hết nhé.','Match them all first.'),sol:ns.join(' · '),vchk(){return this.a.every((r,k)=>this.right[r][0].n===this.left[k+1][0].g[1])}})}
/* Viết số còn thiếu vào dãy */
function day(lo,hi,len,dir,nb){const s0=RR(lo,hi-len+1);let L=Array.from({length:len},(_,i)=>s0+i);if(dir<0)L.reverse();const pos=shuf(Array.from({length:len-2},(_,i)=>i+1)).slice(0,nb).sort((x,y)=>x-y);return{L,pos}}
function dayQ(lo,hi){const D=[day(lo,hi,6,1,2),day(lo,hi,6,-1,2),day(lo,hi,6,1,3)];const a=[];
 const rows2=D.map((d,i)=>({lb:LB[i],t:d.L.map((v,j)=>d.pos.includes(j)?(a.push(v),{b:1}):{n:v})}));
 return mkQ({lay:'vof',kind:'Vở: viết số còn thiếu',rows2,a,
  q:T('<b>Viết</b> số còn thiếu vào ô trống.','<b>Write</b> the missing numbers.'),say:T('Em viết số còn thiếu vào ô trống. Dãy có thể đếm thêm hoặc đếm bớt.','Write the missing numbers. Some lines count up, some count down.'),
  need:T('Em điền hết các ô trống nhé.','Fill in every box first.'),sol:D.map(d=>d.L.join(', ')).join(' · '),
  vchk(){let k=0;return this.rows2.every(r=>{const F=r.t.map(x=>x.b?this.a[k++]:x.n);return F.every((v,i)=>!i||Math.abs(v-F[i-1])===1&&Math.sign(v-F[i-1])===Math.sign(F[1]-F[0]))&&F.every(v=>v>=0&&v<=10)})}})}
/* Nhiều hơn / ít hơn / bằng nhau */
const OPT3=()=>[T('nhiều hơn','more'),T('ít hơn','fewer'),T('bằng nhau','the same')];
function soSanhNhom(){const sp=SP(),ps=[];const want=shuf([0,1,2,RR(0,2)]);
 want.forEach(w=>{let x,y;do{x=RR(1,6);y=RR(1,6)}while(sgn(x,y)!==w);ps.push([x,y])});
 const [m,...R]=ps;const row=(p,i,last)=>({lb:LB[i],t:[{g:[sp[0],p[0]],s:1.6,c:3},T('so với','vs'),{g:[sp[1],p[1]],s:1.6,c:3},last]});
 return mkQ({lay:'voc',kind:'Vở: nhiều hơn, ít hơn, bằng nhau',wide:1,opts:OPT3(),mau:[{g:[sp[0],m[0]],s:1.6,c:3},T('so với','vs'),{g:[sp[1],m[1]],s:1.6,c:3},{mc:sgn(m[0],m[1])}],
  rows2:R.map((p,i)=>row(p,i,{b:1})),a:R.map(p=>sgn(p[0],p[1])),ps:R,
  q:T('Nhóm bên trái <b>nhiều hơn</b>, <b>ít hơn</b> hay <b>bằng nhau</b> so với nhóm bên phải?','Does the left group have <b>more</b>, <b>fewer</b> or <b>the same</b>?'),
  say:T('Em so sánh nhóm bên trái với nhóm bên phải. Chạm ô, rồi chọn nhiều hơn, ít hơn hay bằng nhau.','Compare the left group with the right group. Tap a box, then choose more, fewer or the same.'),
  need:T('Em chọn cho mọi ô nhé.','Choose for every box first.'),sol:R.map(p=>`${p[0]} – ${p[1]}`).join(' · '),vchk(){return this.ps.every((p,i)=>sgn(p[0],p[1])===this.a[i])}})}
function noiBang(){const sp=SP(),ns=distinct(3,2,7),R=shuf([0,1,2]);
 return mkQ({lay:'von',kind:'Vở: nối nhóm bằng nhau',left:ns.map(n=>[{g:[sp[0],n],s:2,c:4}]),right:R.map(k=>[{g:[sp[1],ns[k]],s:2,c:4}]),R,a:[R.indexOf(1),R.indexOf(2)],rows2:[],
  q:T('<b>Nối</b> hai nhóm có số lượng <b>bằng nhau</b>.','<b>Match</b> the groups that have <b>the same</b> number.'),say:T('Em nối hai nhóm có số lượng bằng nhau. Nét đứt là mẫu.','Match the groups that have the same number. The dashed line is the example.'),
  need:T('Em nối hết nhé.','Match them all first.'),sol:ns.join(' · '),vchk(){return this.a.every((r,k)=>this.right[r][0].g[1]===this.left[k+1][0].g[1])}})}
function keoDem(lo,hi){const sp=SP(),ns=distinct(3,lo,hi),have=new Set(ns),ex=distinct(10,0,10).filter(v=>!have.has(v)).slice(0,2);
 return mkQ({lay:'vok',kind:'Vở: đếm rồi kéo thẻ số',rows2:ns.map((n,i)=>({lb:LB[i],t:[{g:[sp[i],n],s:2.2,c:5},T('Có','There are'),{b:1}]})),a:ns,cards:shuf(ns.concat(ex)),
  q:T('<b>Đếm</b> rồi kéo thẻ số vào ô.','<b>Count</b>, then drag the number card into the box.'),say:T('Em đếm rồi kéo thẻ số vào ô cho đúng.','Count, then drag the right number card into each box.'),
  need:T('Em đặt thẻ vào hết các ô nhé.','Put a card in every box first.'),sol:ns.join(' · '),vchk(){return this.rows2.every((r,i)=>r.t[0].g[1]===this.a[i])&&this.a.every(v=>this.cards.includes(v))}})}
/* So sánh số */
function dau(n,hi){const ps=[];const want=shuf([0,1,2].concat(Array.from({length:n-3},()=>RR(0,2))));
 want.forEach(w=>{let x,y,t=0;do{x=RR(0,hi);y=w===2?x:RR(0,hi)}while(sgn(x,y)!==w&&t++<50);ps.push([x,y])});
 const [m,...R]=ps;
 return mkQ({lay:'voc',kind:'Vở: điền dấu >, <, =',c2:1,opts:SIGN,mau:[{m:m[0]},{mc:sgn(m[0],m[1])},{m:m[1]}],rows2:R.map((p,i)=>({lb:LB[i],t:[{n:p[0]},{b:1},{n:p[1]}]})),a:R.map(p=>sgn(p[0],p[1])),ps:R,
  q:T('Điền dấu <b>&gt;</b>, <b>&lt;</b>, <b>=</b> vào ô trống.','Write <b>&gt;</b>, <b>&lt;</b> or <b>=</b> in each box.'),say:T('Em chạm vào ô, rồi chọn dấu lớn hơn, bé hơn hoặc bằng.','Tap a box, then choose greater than, less than or equal.'),
  need:T('Em điền dấu vào mọi ô nhé.','Put a sign in every box first.'),sol:R.map(p=>`${p[0]} ${SIGN[sgn(p[0],p[1])]} ${p[1]}`).join(' · '),vchk(){return this.ps.every((p,i)=>sgn(p[0],p[1])===this.a[i])}})}
function dauHinh(){const sp=SP(),ps=[];const want=shuf([0,1,2]);want.forEach(w=>{let x,y;do{x=RR(1,7);y=RR(1,7)}while(sgn(x,y)!==w);ps.push([x,y])});
 return mkQ({lay:'voc',kind:'Vở: so sánh qua hình',opts:SIGN,rows2:ps.map((p,i)=>({lb:LB[i],t:[{g:[sp[0],p[0]],s:2.2,c:4},{b:1},{g:[sp[1],p[1]],s:2.2,c:4}]})),a:ps.map(p=>sgn(p[0],p[1])),ps,
  q:T('<b>Đếm</b> rồi điền dấu <b>&gt;</b>, <b>&lt;</b>, <b>=</b>.','<b>Count</b>, then write <b>&gt;</b>, <b>&lt;</b> or <b>=</b>.'),say:T('Em đếm hai nhóm, rồi điền dấu lớn hơn, bé hơn hoặc bằng.','Count both groups, then write greater than, less than or equal.'),
  need:T('Em điền dấu vào mọi ô nhé.','Put a sign in every box first.'),sol:ps.map(p=>`${p[0]} ${SIGN[sgn(p[0],p[1])]} ${p[1]}`).join(' · '),vchk(){return this.ps.every((p,i)=>sgn(p[0],p[1])===this.a[i])}})}
function xepThuTu(){const A=distinct(4,0,10),B=distinct(4,0,10),up=A.slice().sort((x,y)=>x-y),dn=B.slice().sort((x,y)=>y-x);
 return mkQ({lay:'vok',kind:'Vở: xếp thứ tự',rows2:[{lb:'a)',t:[T(`Xếp ${A.join(', ')} từ bé đến lớn:`,`Order ${A.join(', ')} from smallest to largest:`)]},{t:[{b:1},{b:1},{b:1},{b:1}]},{lb:'b)',t:[T(`Xếp ${B.join(', ')} từ lớn đến bé:`,`Order ${B.join(', ')} from largest to smallest:`)]},{t:[{b:1},{b:1},{b:1},{b:1}]}],
  a:up.concat(dn),cards:shuf(A.concat(B)),A,B,
  q:T('<b>Kéo</b> thẻ số để xếp theo thứ tự.','<b>Drag</b> the cards to put the numbers in order.'),say:T('Em kéo thẻ số để xếp các số theo thứ tự.','Drag the cards to put the numbers in order.'),
  need:T('Em đặt thẻ vào hết các ô nhé.','Put a card in every box first.'),sol:`${up.join(' < ')} · ${dn.join(' > ')}`,
  vchk(){const u=this.a.slice(0,4),d=this.a.slice(4);return u.every((v,i)=>!i||v>u[i-1])&&d.every((v,i)=>!i||v<d[i-1])&&u.slice().sort().join()===this.A.slice().sort().join()&&d.slice().sort().join()===this.B.slice().sort().join()}})}

/* ---------- trang theo bài ---------- */
const PAGES={1:()=>[demViet(0,5),noiSo(0,5),dayQ(0,5)],2:()=>[demViet(6,10),noiSo(6,10),dayQ(0,10)],3:()=>[soSanhNhom(),noiBang(),keoDem(1,7)],4:()=>[dau(7,10),dauHinh(),xepThuTu()],6:()=>[dau(7,10),V.voNoi(),dayQ(0,10)]};
{const _p=window.voPage;window.voPage=function(x){if(curG()===1&&PAGES[x.b])return PAGES[x.b]();return _p(x)}}

/* ---------- nối vào bộ chơi ---------- */
{const _i=input1;input1=function(q){if(q&&q.lay==='vof'&&!scr.sheet)return`<div class="vopad">${['1','2','3','4','5','⌫','6','7','8','9','0','✓'].map(k=>`<button type="button" class="${k==='✓'?'go':k==='⌫'?'del':''}" onclick="tlKey('${k}')" aria-label="${k==='⌫'?T('Xóa','Delete'):k==='✓'?T('Xong bài','Done'):k}">${k==='✓'?T('Xong','Done'):k}</button>`).join('')}</div>`;
 if(q&&q.lay==='voc'&&!scr.sheet)return`<div class="voopt ${q.wide?'w':''}">${q.opts.map((o,k)=>`<button type="button" onclick="voOpt(${k})">${o}</button>`).join('')}<button type="button" class="go" onclick="tlXong()">${T('Xong','Done')}</button></div>`;
 if(q&&(q.lay==='von'||q.lay==='vok')&&!scr.sheet)return`<button class="gobtn" type="button" onclick="tlXong()">${T('Xong bài','Done')}</button>`;
 return _i.apply(this,arguments)}}
{const _s=show1;show1=function(q){if(q&&q.lay==='von')return'';if(q&&q.lay==='voc')return q.a.map(k=>q.opts[k]).join(', ');return _s.apply(this,arguments)}}
{const _v=viewGame1;viewGame1=function(){const g=scr;if(g&&g.qs&&!g.end){const q=q1();if(q&&q.lay==='von'&&g.vj!==g.j){g.vj=g.j;g.vsel=1}}return _v.apply(this,arguments)}}
{const _a=g1AfterRender;g1AfterRender=function(){const r=_a.apply(this,arguments);try{voLines()}catch(e){}return r}}
addEventListener('resize',()=>{try{setTimeout(voLines,80)}catch(e){}});
Object.assign(I18N,{'Vở: đếm rồi viết số':'Book: count and write','Vở: nối tranh với số':'Book: match pictures','Vở: viết số còn thiếu':'Book: missing numbers','Vở: nhiều hơn, ít hơn, bằng nhau':'Book: more or fewer','Vở: nối nhóm bằng nhau':'Book: equal groups','Vở: đếm rồi kéo thẻ số':'Book: count and drag','Vở: điền dấu >, <, =':'Book: >, <, =','Vở: so sánh qua hình':'Book: compare pictures','Vở: xếp thứ tự':'Book: put in order'});

document.head.insertAdjacentHTML('beforeend',`<style>
.vorows{display:flex;flex-direction:column;gap:8px;align-self:stretch}
.vorows.tbl{display:grid;grid-template-columns:auto repeat(4,1fr);gap:0;align-self:stretch;margin-right:4px}.vorows.tbl .vorow{display:contents}.vorows.tbl .votx,.vorows.tbl .votc{margin:0 0 -2px -2px;height:34px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 2px #1F2A5A;background:#fff}.vorows.tbl .votx{justify-content:flex-start;padding:0 6px;font-size:13px;background:#E3E7F0}.vorows.tbl .votc.vb1{width:auto;height:34px}
.vorows.c2{display:grid;grid-template-columns:1fr 1fr;gap:8px 6px}
.vorow{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.votx{font-size:14.5px;font-weight:600;background:#fff;padding:0 2px;line-height:1.3}
.votc.vb1{width:34px;height:32px;flex:none}.votc.vb1.w{width:auto;min-width:78px;padding:0 6px;font-family:var(--f-body);font-size:14px;font-weight:700}
.vopic.one .vogrp{min-height:22px}
.vonb{position:relative;display:grid;grid-template-columns:auto 26px 18px 26px auto;align-items:center;row-gap:12px;justify-content:start}
.vonb .vonl{position:absolute;left:0;top:0;pointer-events:none}
.vonc{display:flex;align-items:center}.vonc.r{justify-content:flex-start;margin-left:4px}.vonc.l{justify-content:flex-end;margin-right:2px}
.voopt{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.voopt button{height:48px;border:3px solid var(--pxk,#1F2A5A);box-shadow:0 3px 0 var(--pxk,#1F2A5A);background:var(--surface,#fff);color:var(--ink);font-family:var(--f-display);font-size:30px;cursor:pointer;padding:0}
.voopt.w button{font-family:var(--f-body);font-size:15px;font-weight:700}
.voopt button.go{background:#0079C1;color:#fff;font-size:20px;font-family:var(--f-display)}
</style>`);
})();
