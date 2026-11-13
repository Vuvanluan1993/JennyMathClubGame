/* 90 — Trang vở lớp 2: Tự luyện đủ 75 bài (thầy giao 13/11/2026; Bài cô giao giữ như cũ)
   Cùng kiểu trang đã duyệt ở lớp 1 (vof điền ô · voc chọn · von nối · vok kéo thẻ), mỗi bài 3 bài kiểu vở + 2 câu đảo + ★.
   Dạng bài theo nội dung từng bài KNTT lớp 2 (viết lại lời, số mới mỗi lần, hình pixel tự vẽ):
     số đến 100 / 1000 (đọc, viết, tia số, liền trước – liền sau, trăm – chục – đơn vị, viết thành tổng, so sánh, xếp thứ tự)
     thành phần phép tính · hơn kém · cộng/trừ qua 10 (tách cho tròn 10) · có nhớ / không nhớ trong 100 và 1000 (tính, đặt tính
     từng chữ số, nối, số còn thiếu, điền dấu) · bài toán thêm/bớt, nhiều hơn/ít hơn (viết phép tính + đơn vị)
     · kg, lít, dm, m, km, tiền · điểm – đoạn thẳng, đường gấp khúc, tứ giác · khối trụ, khối cầu · giờ – phút, ngày – tháng
     · phép nhân, phép chia (theo tranh, thành phần, bảng 2 và 5) · biểu đồ tranh · chắc chắn / có thể / không thể.
   Bài luyện tập chung, ôn tập: lấy trang của các bài trước (cùng seed). Mỗi câu có vchk() tự kiểm đáp án. */
(function(){
const V=window.VO;if(!V||!V.readN)return;
const {T,RR,VS,vspr,vgrp,mkQ,LB,SP,SIGN,sgn,distinct,svg,COL,clockSvg,DAYS,noiQ,shSvg,khSvg,rulerSvg,nm}=V;
const M='−',X='×',D=':';
const need=T('Em điền hết các ô trống nhé.','Fill in every box first.'),needC=T('Em chọn cho mọi ô nhé.','Choose for every box first.'),needK=T('Em đặt thẻ vào hết các ô nhé.','Put a card in every box first.');
const HINTN=(vi,en)=>T(vi+' Nét đứt là mẫu.',en+' The dashed line is the example.');
const cap1=s=>s[0].toUpperCase()+s.slice(1);
/* ---------- số học ---------- */
const OPS={'+':(a,b)=>a+b,'-':(a,b)=>a-b,'x':(a,b)=>a*b,':':(a,b)=>a/b},SH={'+':'+','-':M,'x':X,':':D};
const dig=n=>String(n).split('').map(Number).reverse();
function nho(a,b,op){const A=dig(a),B=dig(b);for(let i=0;i<Math.max(A.length,B.length);i++){const x=A[i]||0,y=B[i]||0;if(op==='+'?x+y>9:x<y)return true}return false}
/* sinh phép tính: op, khoảng a, b, kết quả, carry true/false/null */
function gen(o){for(let t=0;t<400;t++){let a=RR(...o.A),b=RR(...o.B);if(o.op==='-'&&a<b){const z=a;a=b;b=z}
 if(o.op===':'){const q=RR(...o.B);b=o.k||RR(2,5);a=b*q}
 const r=OPS[o.op](a,b);if(r<(o.R?o.R[0]:0)||r>(o.R?o.R[1]:1000))continue;if(o.c!=null&&(o.op==='+'||o.op==='-')&&nho(a,b,o.op)!==o.c)continue;if(o.ok&&!o.ok(a,b,r))continue;return{a,b,op:o.op,r}}
 return{a:2,b:1,op:'+',r:3}}
const lab=e=>`${e.a} ${SH[e.op]} ${e.b}`;
const S={/* các kiểu phép tính hay dùng */
 c20:{op:'+',A:[2,9],B:[2,9],R:[11,18]}, t20:{op:'-',A:[11,18],B:[2,9],R:[2,9],ok:(a,b)=>a%10<b},
 c100k:{op:'+',A:[10,89],B:[1,89],R:[11,99],c:false}, t100k:{op:'-',A:[11,99],B:[1,89],R:[1,98],c:false},
 c21:{op:'+',A:[11,89],B:[2,9],R:[20,99],c:true}, c22:{op:'+',A:[11,79],B:[11,79],R:[30,99],c:true},
 t21:{op:'-',A:[20,99],B:[2,9],R:[11,97],c:true}, t22:{op:'-',A:[30,99],B:[11,89],R:[10,88],c:true},
 c1000k:{op:'+',A:[100,800],B:[10,400],R:[110,999],c:false}, c1000:{op:'+',A:[100,800],B:[10,400],R:[110,999],c:true},
 t1000k:{op:'-',A:[200,999],B:[10,400],R:[100,989],c:false}, t1000:{op:'-',A:[200,999],B:[10,400],R:[100,989],c:true},
 n2:{op:'x',A:[2,2],B:[1,10],ok:(a,b)=>true}, n5:{op:'x',A:[5,5],B:[1,10]}, d2:{op:':',k:2,A:[1,1],B:[1,10]}, d5:{op:':',k:5,A:[1,1],B:[1,10]}};
const g=k=>{const s=S[k];return gen(s)};
/* ---------- mảnh mới ---------- */
function vc2(a,o,b,cell){const r=OPS[o](a,b),n=Math.max(String(a).length,String(b).length,String(r).length),pad=v=>String(v).padStart(n,' ').split('');
 const A=pad(a),B=pad(b),R=pad(r);return`<span class="vovc" style="grid-template-columns:repeat(${n+1},24px)"><i></i>${A.map(x=>`<i>${x.trim()}</i>`).join('')}<i class="op">${SH[o]}</i>${B.map(x=>`<i>${x.trim()}</i>`).join('')}<b></b><i></i>${R.map(x=>x.trim()?cell():'<i></i>').join('')}</span>`}
function clock2(h,m,z){z=z||54;const c=z/2,r=c-3;let b=`<circle cx="${c}" cy="${c}" r="${r}" fill="#fff" stroke="#1F2A5A" stroke-width="3" shape-rendering="auto"/>`;
 for(let i=0;i<12;i++){const a=i*Math.PI/6;b+=`<line x1="${c+Math.sin(a)*(r-2)}" y1="${c-Math.cos(a)*(r-2)}" x2="${c+Math.sin(a)*(r-(i%3?5:8))}" y2="${c-Math.cos(a)*(r-(i%3?5:8))}" stroke="#1F2A5A" stroke-width="${i%3?1.5:2.5}" shape-rendering="auto"/>`}
 const ah=((h%12)+m/60)*Math.PI/6,am=m*Math.PI/30;b+=`<line x1="${c}" y1="${c}" x2="${c+Math.sin(ah)*r*.5}" y2="${c-Math.cos(ah)*r*.5}" stroke="#F04A1B" stroke-width="4" stroke-linecap="round" shape-rendering="auto"/><line x1="${c}" y1="${c}" x2="${c+Math.sin(am)*r*.8}" y2="${c-Math.cos(am)*r*.8}" stroke="#1F2A5A" stroke-width="2.5" stroke-linecap="round" shape-rendering="auto"/><circle cx="${c}" cy="${c}" r="3" fill="#1F2A5A"/>`;
 return svg(z,z,b,`${h}:${m}`)}
function tram(h,t,u){const W=h*26+(t?t*7+6:0)+(u?u*7+6:0)+2,H=52;let b='';
 for(let i=0;i<h;i++){b+=`<rect x="${1+i*26}" y="1" width="23" height="23" fill="#8656A8" stroke="#1F2A5A" stroke-width="1"/>`;for(let k=1;k<5;k++)b+=`<line x1="${1+i*26+k*4.6}" y1="1" x2="${1+i*26+k*4.6}" y2="24" stroke="#c9b4e0" stroke-width=".6"/><line x1="${1+i*26}" y1="${1+k*4.6}" x2="${24+i*26}" y2="${1+k*4.6}" stroke="#c9b4e0" stroke-width=".6"/>`}
 const x0=1+h*26+(h?4:0);for(let i=0;i<t;i++)b+=`<rect x="${x0+i*7}" y="1" width="5" height="48" fill="#12B5E8" stroke="#1F2A5A" stroke-width="1"/>`;
 const x1=x0+t*7+(t?6:0);for(let i=0;i<u;i++)b+=`<rect x="${x1+i*7}" y="43" width="5" height="5" fill="#FCB40C" stroke="#1F2A5A" stroke-width="1"/>`;
 return svg(W,H,b,`${h} ${t} ${u}`)}
function grs(sp,k,n,s){return`<span class="vogrs">${Array.from({length:n},()=>`<span class="vopic one">${vgrp(sp,k,s||1.6,Math.min(k,3))}</span>`).join('')}</span>`}
function tien(v){const c={100:'#9AA4C0',200:'#F37A1F',500:'#2AB563',1000:'#12B5E8',2000:'#8656A8',5000:'#F04A1B',10000:'#FCB40C'}[v]||'#9AA4C0';
 return svg(58,30,`<rect x="1" y="1" width="56" height="28" fill="${c}" stroke="#1F2A5A" stroke-width="2"/><rect x="5" y="5" width="48" height="20" fill="#fff" fill-opacity=".75"/><text x="29" y="20" text-anchor="middle" font-family="VT323,monospace" font-size="15" fill="#1F2A5A">${v}đ</text>`,`${v} đồng`)}
function hop(cs){const L=[];cs.forEach(([c,n])=>{for(let i=0;i<n;i++)L.push(c)});const W=Math.max(70,Math.ceil(L.length/2)*15+14);let b=`<rect x="1" y="6" width="${W-2}" height="40" fill="#F6D98B" stroke="#1F2A5A" stroke-width="2"/>`;
 L.forEach((c,i)=>{b+=`<circle cx="${12+Math.floor(i/2)*15}" cy="${19+(i%2)*15}" r="6" fill="${c}" stroke="#1F2A5A" stroke-width="1.5" shape-rendering="auto"/>`});return svg(W,48,b,'')}
function gk(L){const u=22;let x=6,y=40,pts=[[x,y]],b='';L.forEach((l,i)=>{x+=l*u*0.8;y=i%2?40:10;pts.push([x,y])});const W=x+8;
 b+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#0079C1" stroke-width="3" shape-rendering="auto"/>`;
 pts.forEach(p=>b+=`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#1F2A5A"/>`);
 L.forEach((l,i)=>{const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;b+=`<text x="${mx}" y="${my-4}" text-anchor="middle" font-family="VT323,monospace" font-size="14" fill="#F04A1B">${l}cm</text>`});
 return svg(W,50,b,'')}
function khoi2(k,c){const f=COL[c%COL.length];if(k==='tru')return svg(30,38,`<rect x="3" y="6" width="24" height="26" fill="${f}" stroke="#1F2A5A" stroke-width="2"/><ellipse cx="15" cy="32" rx="12" ry="4" fill="${f}" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/><ellipse cx="15" cy="6" rx="12" ry="4" fill="#fff" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/>`,T('khối trụ','cylinder'));
 if(k==='cau')return svg(34,34,`<circle cx="17" cy="17" r="14" fill="${f}" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/><circle cx="12" cy="11" r="4" fill="#fff" fill-opacity=".7" shape-rendering="auto"/>`,T('khối cầu','sphere'));
 return khSvg(k,c)}
function tugiac(k,c){const f=COL[c%COL.length],P={tg:'5,5 26,8 24,26 8,22',tg2:'8,5 27,5 22,26 3,26',tam:'15,3 27,26 3,26',tron:''}[k];
 return svg(30,30,k==='tron'?`<circle cx="15" cy="15" r="12" fill="${f}" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/>`:`<polygon points="${P}" fill="${f}" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/>`,'')}
{const _x=V.tokX;V.tokX=function(t,cell,q){if(!t||typeof t!=='object')return _x(t,cell,q);
 if(t.vc2)return vc2(...t.vc2,cell);
 if(t.ck)return`<span class="vosh">${clock2(t.ck[0],t.ck[1],t.z)}</span>`;
 if(t.tram)return`<span class="vosh">${tram(...t.tram)}</span>`;
 if(t.grs)return grs(...t.grs);
 if(t.tien)return`<span class="vosh">${tien(t.tien)}</span>`;
 if(t.hop)return`<span class="vosh">${hop(t.hop)}</span>`;
 if(t.gk)return`<span class="vosh">${gk(t.gk)}</span>`;
 if(t.k2)return`<span class="vosh">${khoi2(t.k2,t.c||0)}</span>`;
 if(t.k2s)return`<div class="vopic one voshs">${t.k2s.map(([k,c])=>khoi2(k,c)).join('')}</div>`;
 if(t.tgs)return`<div class="vopic one voshs">${t.tgs.map(([k,c])=>tugiac(k,c)).join('')}</div>`;
 if(t.bd)return`<div class="vopic one vorowp" style="gap:2px">${Array.from({length:t.bd[1]},()=>vspr(t.bd[0],2)).join('')}</div>`;
 return _x(t,cell,q)}}
/* ---------- đọc số đến 1000 ---------- */
const W1=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
function doc2(n,tr){if(n===0)return'';if(n<10)return(tr?'linh ':'')+W1[n];if(n===10)return'mười';const t=Math.floor(n/10),u=n%10;if(t===1)return'mười'+(u?' '+(u===5?'lăm':W1[u]):'');return W1[t]+' mươi'+(u===0?'':' '+(u===1?'mốt':u===4?'tư':u===5?'lăm':W1[u]))}
function doc3(n){if(n===1000)return'một nghìn';if(n<100)return doc2(n);const h=Math.floor(n/100),r=n%100;return W1[h]+' trăm'+(r?' '+doc2(r,true):'')}
const EN1=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],ENT=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const en2=n=>n<20?EN1[n]:ENT[Math.floor(n/10)]+(n%10?'-'+EN1[n%10]:''),en3=n=>n===1000?'one thousand':n<100?en2(n):EN1[Math.floor(n/100)]+' hundred'+(n%100?' and '+en2(n%100):'');
const read3=n=>T(doc3(n),en3(n));
/* ---------- khung câu dùng chung ---------- */
function tinh(L,tt,c2){return mkQ({lay:'vof',kind:tt||'Vở: tính',c2:c2?1:0,rows2:L.map(e=>({t:[{x:lab(e)+' ='},{b:1}]})),a:L.map(e=>e.r),L,
 q:T('<b>Tính.</b>','<b>Work out.</b>'),say:T('Em tính rồi viết kết quả vào ô.','Work out each one and write the answer.'),need,sol:L.map(e=>`${lab(e)} = ${e.r}`).join(' · '),vchk(){return this.L.every((e,i)=>OPS[e.op](e.a,e.b)===this.a[i])}})}
function datTinh(L){const a=[];L.forEach(e=>String(e.r).split('').forEach(d=>a.push(+d)));
 return mkQ({lay:'vof',kind:'Vở: đặt tính rồi tính',rows2:[{t:L.map(e=>({vc2:[e.a,e.op,e.b]}))}],a,L,q:T('<b>Đặt tính</b> rồi tính (mỗi ô một chữ số, tính từ phải sang trái).','<b>Work out</b> in columns (one digit in each box, right to left).'),
  say:T('Em tính từ hàng đơn vị sang trái. Nhớ thì ghi nhớ sang hàng bên trái. Mỗi ô viết một chữ số.','Work from the ones to the left. Carry when you need to. One digit in each box.'),need,sol:L.map(e=>`${lab(e)} = ${e.r}`).join(' · '),
  vchk(){let k=0;return this.L.every(e=>{const s=String(OPS[e.op](e.a,e.b));return s.split('').every(d=>+d===this.a[k++])})}})}
function noiKQ(L,tt){return noiQ(tt||'Vở: nối phép tính với kết quả',L.map(e=>[{e:lab(e)}]),L.map(e=>[{n:e.r}]),L.map(e=>e.r),T('<b>Nối</b> mỗi phép tính với kết quả đúng.','<b>Match</b> each number sentence to its answer.'),HINTN('Em tính rồi nối mỗi phép tính với kết quả đúng.','Work them out, then match each one to its answer.'),q=>q.right.every((r,k)=>r[0].n===q.vals[q.R[k]]))}
const uniq=(f,n)=>{const L=[],s=new Set();for(let t=0;L.length<n&&t<300;t++){const e=f();if(!s.has(e.r)){s.add(e.r);L.push(e)}}return L};
function thieu(L){const rows=[],a=[],E=[];L.forEach((e,i)=>{const w=i%3,o=SH[e.op];let t;
 if(w===0){t=[{x:`${e.a} ${o}`},{b:1},{x:`= ${e.r}`}];a.push(e.b)}else if(w===1){t=[{b:1},{x:`${o} ${e.b} = ${e.r}`}];a.push(e.a)}else{t=[{x:lab(e)+' ='},{b:1}];a.push(e.r)}rows.push({lb:LB[i],t});E.push({e,w})});
 const have=new Set(a),mx=Math.max(...a),ex=[];for(let t=0;ex.length<2&&t<100;t++){const v=RR(Math.max(0,Math.floor(mx/2)),mx+5);if(!have.has(v)&&!ex.includes(v))ex.push(v)}
 return mkQ({lay:'vok',kind:'Vở: số còn thiếu',rows2:rows,a,E,cards:shuf(a.concat(ex)),q:T('<b>Số?</b> Kéo thẻ số vào ô trống.','<b>Missing number?</b> Drag a card into each box.'),say:T('Em tìm số còn thiếu rồi kéo thẻ số vào ô trống.','Find the missing number and drag the card into the box.'),need:needK,sol:E.map(x=>`${lab(x.e)} = ${x.e.r}`).join(' · '),
  vchk(){return this.E.every((x,i)=>this.a[i]===(x.w===0?x.e.b:x.w===1?x.e.a:x.e.r))&&this.a.every(v=>this.cards.includes(v))}})}
/* dấu: P = [[nhãn trái, giá trị trái, nhãn phải, giá trị phải]] (phần tử đầu là mẫu) */
function dau(P,tt,c2){const [m,...R]=P,tk=(l,v)=>typeof l==='number'?{n:l}:{x:l};
 return mkQ({lay:'voc',kind:tt||'Vở: điền dấu',c2:c2?1:0,opts:SIGN,mau:[m[0]===m[1]&&typeof m[0]==='number'?{m:m[0]}:{x:m[0]},{mc:sgn(m[1],m[3])},m[2]===m[3]&&typeof m[2]==='number'?{m:m[2]}:{x:m[2]}],
  rows2:R.map((p,i)=>({lb:c2?LB[i]:LB[i],t:[tk(p[0],p[1]),{b:1},tk(p[2],p[3])]})),a:R.map(p=>sgn(p[1],p[3])),R,
  q:T('Điền dấu <b>&gt;</b>, <b>&lt;</b>, <b>=</b> vào ô trống.','Write <b>&gt;</b>, <b>&lt;</b> or <b>=</b> in each box.'),say:T('Em so sánh rồi chạm vào ô, chọn dấu lớn hơn, bé hơn hoặc bằng.','Compare, then tap a box and choose greater than, less than or equal.'),need:needC,sol:'',vchk(){return this.R.every((p,i)=>sgn(p[1],p[3])===this.a[i])}})}
const signSet=(n,mk)=>{const out=[];shuf([0,1,2].concat(Array.from({length:n-3},()=>RR(0,2)))).forEach(w=>{for(let t=0;t<80;t++){const p=mk(w);if(sgn(p[1],p[3])===w||t===79){out.push(p);break}}});return out};
function form(kind,rows,a,q,say,chk,extra){return mkQ(Object.assign({lay:'vof',kind,rows2:rows,a,q,say,need,sol:a.join(' · '),vchk(){return chk(this)}},extra||{}))}
function chon(kind,opts,rows,a,q,say,chk,mau,extra){return mkQ(Object.assign({lay:'voc',kind,wide:opts.some(o=>String(o).length>2)?1:0,opts,mau,rows2:rows,a,q,say,need:needC,sol:'',vchk(){return chk(this)}},extra||{}))}
function xep(lo,hi){const A=distinct(4,lo,hi),B=distinct(4,lo,hi),up=A.slice().sort((x,y)=>x-y),dn=B.slice().sort((x,y)=>y-x);
 return mkQ({lay:'vok',kind:'Vở: xếp thứ tự',rows2:[{lb:'a)',t:[T(`Xếp ${A.join(', ')} từ bé đến lớn:`,`Order ${A.join(', ')} from smallest to largest:`)]},{t:[{b:1},{b:1},{b:1},{b:1}]},{lb:'b)',t:[T(`Xếp ${B.join(', ')} từ lớn đến bé:`,`Order ${B.join(', ')} from largest to smallest:`)]},{t:[{b:1},{b:1},{b:1},{b:1}]}],a:up.concat(dn),cards:shuf(A.concat(B)),
  q:T('<b>Kéo</b> thẻ số để xếp theo thứ tự.','<b>Drag</b> the cards to put the numbers in order.'),say:T('Em kéo thẻ số để xếp các số theo thứ tự.','Drag the cards to put the numbers in order.'),need:needK,sol:`${up.join(' < ')} · ${dn.join(' > ')}`,
  vchk(){const u=this.a.slice(0,4),d=this.a.slice(4);return u.every((v,i)=>!i||v>u[i-1])&&d.every((v,i)=>!i||v<d[i-1])}})}
function day(step,lo,hi,len){const rows=[],a=[];for(let i=0;i<3;i++){const st=Array.isArray(step)?step[i%step.length]:step,s0=RR(lo,Math.max(lo,hi-st*(len-1)));const L=Array.from({length:len},(_,j)=>s0+j*st);const pos=shuf(Array.from({length:len-1},(_,j)=>j+1)).slice(0,2);
  rows.push({lb:LB[i],t:L.map((v,j)=>pos.includes(j)?(a.push(v),{b:1}):{n:v})})}
 return form('Vở: dãy số',rows,a,T('<b>Viết</b> số còn thiếu vào ô trống.','<b>Write</b> the missing numbers.'),T('Em tìm quy luật của dãy rồi viết số còn thiếu.','Find the pattern and write the missing numbers.'),q=>{let k=0;return q.rows2.every(r=>{const F=r.t.map(x=>x.b?q.a[k++]:x.n);const d=F[1]-F[0];return F.every((v,i)=>!i||v-F[i-1]===d)})})}
function noiDoc(lo,hi){const ns=distinct(3,lo,hi);return noiQ('Vở: nối số với cách đọc',ns.map(n=>[{n}]),ns.map(n=>[{e:read3(n)}]),ns,T('<b>Nối</b> mỗi số với cách đọc.','<b>Match</b> each number to its name.'),HINTN('Em nối mỗi số với cách đọc của nó.','Match each number to how it is read.'),q=>q.left.every((l,i)=>q.right[q.R.indexOf(i)][0].e===read3(l[0].n)))}
/* bài toán có lời văn: viết phép tính + đơn vị */
function loiVan(L,kind){const rows=[],a=[],sw=[];let k=0;L.forEach((p,i)=>{rows.push({lb:LB[i],t:[p.t,{br:1},{b:1},{x:SH[p.op]},{b:1},{x:'='},{b:1},p.u]});a.push(p.a,p.b,p.r);if(p.op==='+'||p.op==='x')sw.push([k,k+1]);k+=3});
 return mkQ({lay:'vof',kind:kind||'Vở: bài toán',rows2:rows,a,sw,L,q:T('<b>Viết phép tính</b> rồi tính.','<b>Write the number sentence</b> and work it out.'),say:T('Em đọc bài toán, viết phép tính đúng rồi tính kết quả.','Read the problem, write the number sentence and work it out.'),need,sol:L.map(p=>`${p.a} ${SH[p.op]} ${p.b} = ${p.r} ${p.u}`).join(' · '),
  vchk(){return this.L.every((p,i)=>OPS[p.op](this.a[3*i],this.a[3*i+1])===this.a[3*i+2]&&this.a[3*i+2]===p.r)}})}

/* ===== 1–6: số đến 100, thành phần, hơn kém ===== */
function tiaSo(){const rows=[],a=[],S0=distinct(3,0,9).map(t=>t*10+RR(0,3));for(let i=0;i<3;i++){const s0=S0[i],L=Array.from({length:6},(_,j)=>s0+j);const pos=shuf([1,2,3,4,5]).slice(0,2);rows.push({lb:LB[i],t:L.map((v,j)=>pos.includes(j)?(a.push(v),{b:1}):{n:v})})}
 rows.push({lb:'d)',t:[T('Số liền trước của','The number before'),{n:0},{b:1}]});const n=RR(11,98);rows[3].t[1]={n};a.push(n-1);
 rows.push({lb:'e)',t:[T('Số liền sau của','The number after'),{n:n+RR(-9,1)},{b:1}]});a.push(rows[4].t[1].n+1);
 return form('Vở: tia số, liền trước, liền sau',rows,a,T('<b>Viết số</b> vào ô trống.','<b>Write</b> the numbers.'),T('Em viết số còn thiếu trên tia số, số liền trước và số liền sau.','Fill in the number line, the number before and the number after.'),q=>{const k=q.a.length;return q.a[k-2]===q.rows2[3].t[1].n-1&&q.a[k-1]===q.rows2[4].t[1].n+1})}
function thanhPhan(){const L=[g('c100k'),g('c100k'),g('t100k'),g('t100k')];const rows=[],a=[];
 L.forEach((e,i)=>{if(e.op==='+'){rows.push({lb:LB[i],t:[T(`Số hạng ${e.a}, số hạng ${e.b}. Tổng:`,`Addends ${e.a} and ${e.b}. Sum:`),{b:1}]})}else rows.push({lb:LB[i],t:[T(`Số bị trừ ${e.a}, số trừ ${e.b}. Hiệu:`,`${e.a} minus ${e.b}. Difference:`),{b:1}]});a.push(e.r)});
 return form('Vở: thành phần phép cộng, phép trừ',rows,a,T('Tìm <b>tổng</b> hoặc <b>hiệu</b>.','Find the <b>sum</b> or the <b>difference</b>.'),T('Tổng là kết quả phép cộng. Hiệu là kết quả phép trừ.','The sum is the answer to an addition. The difference is the answer to a subtraction.'),q=>q.a.every((v,i)=>v===L[i].r),{L})}
function honKem(){const rows=[],a=[],P=[];const sp=SP();for(let i=0;i<3;i++){let x,y;do{x=RR(2,9);y=RR(1,9)}while(x===y);P.push([x,y]);const big=x>y;
  rows.push({lb:LB[i],t:[{bd:[sp[0],x]},{br:1},{bd:[sp[1],y]},{br:1},T(`Hàng trên ${big?'nhiều hơn':'ít hơn'} hàng dưới`,`The top row has`),{b:1},T(nm(sp[0]).replace(/^(quả|con|cái|ngôi|bông) /,'')+'.',big?'more.':'fewer.')]});a.push(Math.abs(x-y))}
 return form('Vở: hơn, kém nhau bao nhiêu',rows,a,T('Hai hàng <b>hơn, kém nhau</b> bao nhiêu?','How many <b>more or fewer</b>?'),T('Em đếm hai hàng rồi lấy số lớn trừ số bé.','Count both rows, then take the smaller from the larger.'),q=>q.a.every((v,i)=>v===Math.abs(P[i][0]-P[i][1])),{P})}
/* ===== 7–14: qua 10 trong 20, thêm/bớt, nhiều/ít ===== */
function tachTron(op){const rows=[],a=[],E=[];for(let i=0;i<3;i++){const e=g(op==='+'?'c20':'t20');E.push(e);
  if(op==='+'){const need10=10-e.a;rows.push({lb:LB[i],t:[{x:`${e.a} + ${e.b} = ${e.a} +`},{b:1},{x:'+'},{b:1},{x:'='},{b:1}]});a.push(need10,e.b-need10,e.r)}
  else{const u=e.a-10;rows.push({lb:LB[i],t:[{x:`${e.a} ${M} ${e.b} = ${e.a} ${M}`},{b:1},{x:M},{b:1},{x:'='},{b:1}]});a.push(u,e.b-u,e.r)}}
 return form(op==='+'?'Vở: cộng qua 10 (tách cho tròn 10)':'Vở: trừ qua 10 (tách về 10)',rows,a,op==='+'?T('Tính bằng cách <b>tách cho tròn 10</b>.','Work out by <b>making 10</b> first.'):T('Tính bằng cách <b>trừ về 10</b> trước.','Work out by <b>going back to 10</b> first.'),
  op==='+'?T('Em tách số thứ hai để cộng với số thứ nhất cho tròn mười, rồi cộng phần còn lại.','Split the second number to make ten, then add the rest.'):T('Em trừ để được mười trước, rồi trừ phần còn lại.','Take away to reach ten first, then take away the rest.'),
  q=>q.E.every((e,i)=>op==='+'?(e.a+q.a[3*i]===10&&q.a[3*i]+q.a[3*i+1]===e.b&&q.a[3*i+2]===e.r):(e.a-q.a[3*i]===10&&q.a[3*i]+q.a[3*i+1]===e.b&&q.a[3*i+2]===e.r)),{E})}
const NV=[['quả cam','oranges'],['con gà','chickens'],['cái kẹo','sweets'],['quyển vở','notebooks'],['bông hoa','flowers'],['con cá','fish'],['cái bút','pens'],['quả bóng','balls']];
const NG=['Lan','Nam','Mai','Hà','Minh','An','Hoa','Bình'];
function btThemBot(){const L=[];[0,1,0].forEach(k=>{const [v,ve]=pick(NV),who=pick(NG);if(!k){const x=RR(5,12),y=RR(2,8);L.push({t:T(`${who} có ${x} ${v}, được cho thêm ${y} ${v}. Hỏi ${who} có tất cả bao nhiêu ${v}?`,`${who} has ${x} ${ve} and gets ${y} more. How many now?`),op:'+',a:x,b:y,r:x+y,u:v.split(' ')[0]})}
  else{const x=RR(8,18),y=RR(2,x-2);L.push({t:T(`${who} có ${x} ${v}, đã cho bạn ${y} ${v}. Hỏi ${who} còn lại bao nhiêu ${v}?`,`${who} has ${x} ${ve} and gives away ${y}. How many are left?`),op:'-',a:x,b:y,r:x-y,u:v.split(' ')[0]})}});
 return loiVan(L,'Vở: bài toán thêm, bớt')}
function btNhieuIt(){const L=[];[0,1,0].forEach(k=>{const [v,ve]=pick(NV),A=pick(NG);let B;do{B=pick(NG)}while(B===A);const x=RR(6,40),y=RR(2,9);
  if(!k)L.push({t:T(`${A} có ${x} ${v}. ${B} có nhiều hơn ${A} ${y} ${v}. Hỏi ${B} có bao nhiêu ${v}?`,`${A} has ${x} ${ve}. ${B} has ${y} more. How many does ${B} have?`),op:'+',a:x,b:y,r:x+y,u:v.split(' ')[0]});
  else{const z=x+y;L.push({t:T(`${A} có ${z} ${v}. ${B} có ít hơn ${A} ${y} ${v}. Hỏi ${B} có bao nhiêu ${v}?`,`${A} has ${z} ${ve}. ${B} has ${y} fewer. How many does ${B} have?`),op:'-',a:z,b:y,r:z-y,u:v.split(' ')[0]})}});
 return loiVan(L,'Vở: bài toán nhiều hơn, ít hơn')}
/* ===== 15–18: kg, lít; 55–58: dm, m, km, tiền ===== */
function donVi(u,lim){const L=[0,1,0,1].map(k=>gen({op:k?'-':'+',A:[1,lim],B:[1,lim],R:[1,lim*2]}));
 return form(`Vở: tính với ${u}`,L.map((e,i)=>({lb:LB[i],t:[{x:`${e.a} ${u} ${SH[e.op]} ${e.b} ${u} =`},{b:1},{x:u}]})),L.map(e=>e.r),T(`<b>Tính</b> (nhớ ghi đơn vị ${u}).`,`<b>Work out</b> (remember the unit ${u}).`),T('Em tính rồi viết kết quả, nhớ đơn vị.','Work out each one and remember the unit.'),q=>q.a.every((v,i)=>v===L[i].r),{L})}
const dauDV=(u,lim)=>dau(signSet(5,w=>{const x=RR(1,lim),y=w===2?x:RR(1,lim);return[`${x} ${u}`,x,`${y} ${u}`,y]}),`Vở: so sánh ${u}`);
function btDV(u,uv){const L=[];[0,1,0].forEach(k=>{const who=pick(NG);if(!k){const x=RR(5,40),y=RR(2,30);L.push({t:T(`Túi gạo nặng ${x} ${u}, túi đỗ nặng ${y} ${u}. Cả hai túi nặng bao nhiêu ${uv}?`,`A bag of rice weighs ${x} ${u}, a bag of beans ${y} ${u}. How heavy together?`),op:'+',a:x,b:y,r:x+y,u})}
  else{const x=RR(10,50),y=RR(2,x-3);L.push({t:T(`Thùng có ${x} ${u}, ${who} đã lấy ra ${y} ${u}. Thùng còn lại bao nhiêu ${uv}?`,`A box has ${x} ${u}. ${who} takes out ${y} ${u}. How much is left?`),op:'-',a:x,b:y,r:x-y,u})}});
 if(u==='l'){L[0].t=T(`Can thứ nhất có ${L[0].a} l nước, can thứ hai có ${L[0].b} l nước. Cả hai can có bao nhiêu lít nước?`,`One can holds ${L[0].a} l, another ${L[0].b} l. How many litres altogether?`);L[2].t=T(`Can thứ nhất có ${L[2].a} l dầu, can thứ hai có ${L[2].b} l dầu. Cả hai can có bao nhiêu lít dầu?`,`One can holds ${L[2].a} l of oil, another ${L[2].b} l. How many litres altogether?`)}
 return loiVan(L,`Vở: bài toán ${u}`)}
function doiDV(){const P=shuf([['dm','cm',10],['m','dm',10],['m','cm',100],['km','m',1000]]).slice(0,3),rows=[],a=[];
 P.forEach(([b1,s1,f],i)=>{const n=f===1000?1:RR(1,9);rows.push({lb:LB[i],t:[{x:`${n} ${b1} =`},{b:1},{x:s1}]});a.push(n*f)});
 rows.push({lb:'d)',t:[{x:'30 cm ='},{b:1},{x:'dm'}]});a.push(3);
 return form('Vở: đổi đơn vị độ dài',rows,a,T('<b>Viết số</b> thích hợp (1 dm = 10 cm, 1 m = 10 dm = 100 cm, 1 km = 1 000 m).','<b>Write</b> the right number (1 dm = 10 cm, 1 m = 10 dm = 100 cm, 1 km = 1000 m).'),T('Em nhớ: một đề-xi-mét bằng mười xăng-ti-mét, một mét bằng mười đề-xi-mét.','Remember: 1 decimetre is 10 centimetres, 1 metre is 10 decimetres.'),q=>q.a.length===4,{})}
function tienQ(){const V2=[100,200,500,1000,2000,5000],rows=[],a=[];for(let i=0;i<3;i++){const n=RR(2,3),L=Array.from({length:n},()=>pick(V2.slice(0,i===2?6:4)));rows.push({lb:LB[i],t:L.map(v=>({tien:v})).concat([{br:1},T('Tất cả:','Total:'),{b:1},T('đồng','đồng')])});a.push(L.reduce((s,v)=>s+v,0))}
 return form('Vở: tiền Việt Nam',rows,a,T('Mỗi hàng có <b>bao nhiêu tiền</b>?','How much <b>money</b> in each row?'),T('Em cộng giá trị các tờ tiền.','Add up the notes.'),q=>q.rows2.every((r,i)=>r.t.filter(x=>x.tien).reduce((s,x)=>s+x.tien,0)===q.a[i]))}
/* ===== 19–24, 59–63: có nhớ / phạm vi 1000 ===== */
const L3=(k,n)=>uniq(()=>g(k),n);
/* ===== 25–28, 34, 72: hình học ===== */
function duongGK(){const rows=[],a=[];for(let i=0;i<3;i++){const L=Array.from({length:RR(2,3)},()=>RR(2,6));rows.push({lb:LB[i],t:[{gk:L},{br:1},T('Độ dài đường gấp khúc:','Length:'),{b:1},{x:'cm'}]});a.push(L.reduce((s,v)=>s+v,0))}
 return form('Vở: độ dài đường gấp khúc',rows,a,T('Tính <b>độ dài</b> mỗi đường gấp khúc.','Find the <b>length</b> of each broken line.'),T('Độ dài đường gấp khúc bằng tổng độ dài các đoạn thẳng.','Add the lengths of all the segments.'),q=>q.rows2.every((r,i)=>r.t[0].gk.reduce((s,v)=>s+v,0)===q.a[i]))}
function demTuGiac(){const N=RR(7,10),K=['tg','tg2','tam','tron'],L=Array.from({length:N},()=>[pick(K),RR(0,5)]);if(!L.some(x=>x[0].startsWith('tg')))L[0][0]='tg';
 const c=[L.filter(x=>x[0].startsWith('tg')).length,L.filter(x=>x[0]==='tam').length];
 return form('Vở: đếm hình tứ giác',[{t:[{tgs:L}]},{lb:'a)',t:[T('Hình tứ giác:','Quadrilaterals:'),{b:1}]},{lb:'b)',t:[T('Hình tam giác:','Triangles:'),{b:1}]}],c,T('<b>Đếm</b> hình tứ giác và hình tam giác.','<b>Count</b> the quadrilaterals and triangles.'),T('Hình tứ giác có bốn cạnh. Hình tam giác có ba cạnh.','A quadrilateral has four sides. A triangle has three.'),q=>q.a[0]===L.filter(x=>x[0].startsWith('tg')).length&&q.a[1]===L.filter(x=>x[0]==='tam').length,{L})}
function doanThang(){const rows=[],a=[];for(let i=0;i<3;i++){const s=RR(0,4),e=RR(s+2,10);rows.push({lb:LB[i],t:[{ruler:[s,e]},{br:1},T('Đoạn thẳng dài','The segment is'),{b:1},{x:'cm'}]});a.push(e-s)}
 return form('Vở: đo đoạn thẳng',rows,a,T('Đoạn thẳng <b>dài mấy xăng-ti-mét</b>?','How many <b>centimetres</b> long?'),T('Em xem đoạn thẳng bắt đầu và kết thúc ở vạch nào.','See where the segment starts and ends.'),q=>q.rows2.every((r,i)=>r.t[0].ruler[1]-r.t[0].ruler[0]===q.a[i]))}
/* ===== 29–31: giờ, ngày, tháng ===== */
function gioPhut(){const H=distinct(4,1,12),Mi=H.map(()=>pick([0,15,30]));const a=[];H.forEach((h,i)=>a.push(h,Mi[i]));
 return form('Vở: giờ và phút',H.map((h,i)=>({lb:LB[i],t:[{ck:[h,Mi[i]],z:50},{b:1},T('giờ','h'),{b:1},T('phút','min')]})),a,T('Đồng hồ chỉ <b>mấy giờ, mấy phút</b>?','What <b>time</b> does each clock show?'),T('Kim ngắn chỉ giờ, kim dài chỉ phút. Kim dài chỉ số 3 là 15 phút, chỉ số 6 là 30 phút.','The short hand shows the hour. The long hand on 3 is 15 minutes, on 6 is 30 minutes.'),q=>q.rows2.every((r,i)=>r.t[0].ck[0]===q.a[2*i]&&r.t[0].ck[1]===q.a[2*i+1]))}
function ngayGio(){const rows=[[T('1 ngày có','A day has'),24,T('giờ','hours')],[T('1 giờ có','An hour has'),60,T('phút','minutes')],[T('1 tuần có','A week has'),7,T('ngày','days')]];
 const h=RR(13,22);rows.push([T(`${h} giờ còn gọi là`,`${h}:00 is also`),h-12,T('giờ chiều/tối','p.m.')]);
 return form('Vở: ngày, giờ, phút',rows.map((r,i)=>({lb:LB[i],t:[r[0],{b:1},r[2]]})),rows.map(r=>r[1]),T('<b>Viết số</b> thích hợp.','<b>Write</b> the right number.'),T('Em nhớ: một ngày có hai mươi bốn giờ, một giờ có sáu mươi phút.','Remember: a day has 24 hours, an hour has 60 minutes.'),q=>q.a[0]===24&&q.a[1]===60&&q.a[2]===7&&q.a[3]===h-12,{})}
const NGT=[31,28,31,30,31,30,31,31,30,31,30,31];
function ngayThang(){const D=DAYS(),rows=[],a=[],P=[];for(let i=0;i<3;i++){const d=RR(1,20),th=RR(0,6),k=pick([7,1,14]),m=RR(1,12);P.push([th,k]);rows.push({lb:LB[i],t:[T(`Ngày ${d} tháng ${m} là ${D[th]}. Ngày ${d+k} tháng ${m} là`,`The ${d}th is a ${D[th]}. The ${d+k}th is a`),{b:1}]});a.push((th+k)%7)}
 return chon('Vở: ngày trong tháng',D,rows,a,T('Chọn <b>thứ</b> đúng.','Choose the right <b>day</b>.'),T('Cứ sau bảy ngày lại đến cùng một thứ.','Every seven days it is the same day again.'),q=>q.P.every((p,i)=>(p[0]+p[1])%7===q.a[i]),null,{P})}
function soNgayThang(){const ms=distinct(3,1,12);return form('Vở: số ngày trong tháng',ms.map((m,i)=>({lb:LB[i],t:[T(`Tháng ${m} có`,`Month ${m} has`),{b:1},T('ngày','days')]})),ms.map(m=>NGT[m-1]),T('Mỗi tháng có <b>bao nhiêu ngày</b>? (tháng 2 năm nay có 28 ngày)','How many <b>days</b> in each month? (February has 28 this year)'),T('Em đếm theo các khớp nắm tay, hoặc xem tờ lịch.','Count on your knuckles or look at a calendar.'),q=>q.a.every((v,i)=>v===NGT[ms[i]-1]),{ms})}
/* ===== 37–45: nhân, chia ===== */
function nhanTranh(){const sp=SP(),rows=[],a=[],P=[];for(let i=0;i<3;i++){const k=pick([2,5,3,4]),n=RR(2,4);P.push([k,n]);rows.push({lb:LB[i],t:[{grs:[sp[i],k,n,1.5]},{br:1},{b:1},{x:X},{b:1},{x:'='},{b:1}]});a.push(k,n,k*n)}
 return mkQ({lay:'vof',kind:'Vở: phép nhân theo tranh',rows2:rows,a,P,sw:[[0,1],[3,4],[6,7]],q:T('<b>Viết phép nhân</b> theo tranh.','<b>Write a multiplication</b> for each picture.'),say:T('Mỗi nhóm có bao nhiêu, có mấy nhóm? Em viết phép nhân.','How many in each group, and how many groups? Write a multiplication.'),need,sol:P.map(p=>`${p[0]} × ${p[1]} = ${p[0]*p[1]}`).join(' · '),
  vchk(){return this.P.every((p,i)=>this.a[3*i]===p[0]&&this.a[3*i+1]===p[1]&&this.a[3*i+2]===p[0]*p[1])}})}
function thuaSo(){const L=[0,1,2,3].map(()=>{const a=pick([2,5]),b=RR(1,10);return{a,b,r:a*b}});
 return form('Vở: thừa số, tích',L.map((e,i)=>({lb:LB[i],t:[T(`Thừa số ${e.a}, thừa số ${e.b}. Tích:`,`Factors ${e.a} and ${e.b}. Product:`),{b:1}]})),L.map(e=>e.r),T('Tìm <b>tích</b>.','Find the <b>product</b>.'),T('Tích là kết quả của phép nhân.','The product is the answer to a multiplication.'),q=>q.a.every((v,i)=>v===L[i].r),{L})}
function chiaDeu(){const sp=SP(),rows=[],a=[],P=[];for(let i=0;i<3;i++){const k=pick([2,5]),q=RR(2,4);P.push([k*q,k,q]);rows.push({lb:LB[i],t:[T(`Chia đều ${k*q} ${nm(sp[i]).replace(/^(quả|con|cái|ngôi|bông) /,'')} vào ${k} đĩa. Mỗi đĩa có:`,`Share ${k*q} equally onto ${k} plates. Each plate has:`),{bd:[sp[i],Math.min(k*q,10)]},{br:1},{b:1},{x:D},{b:1},{x:'='},{b:1}]});a.push(k*q,k,q)}
 rows.forEach(r=>{r.t.splice(1,1)});
 return form('Vở: phép chia',rows,a,T('<b>Viết phép chia</b> rồi tính.','<b>Write a division</b> and work it out.'),T('Chia đều nghĩa là mỗi phần bằng nhau.','Sharing equally means every part is the same.'),q=>q.P.every((p,i)=>q.a[3*i]===p[0]&&q.a[3*i+1]===p[1]&&q.a[3*i+2]===p[2]),{P})}
function thanhPhanChia(){const L=[0,1,2,3].map(()=>{const b=pick([2,5]),q=RR(1,10);return{a:b*q,b,r:q}});
 return form('Vở: số bị chia, số chia, thương',L.map((e,i)=>({lb:LB[i],t:[T(`Số bị chia ${e.a}, số chia ${e.b}. Thương:`,`${e.a} divided by ${e.b}. Quotient:`),{b:1}]})),L.map(e=>e.r),T('Tìm <b>thương</b>.','Find the <b>quotient</b>.'),T('Thương là kết quả của phép chia.','The quotient is the answer to a division.'),q=>q.a.every((v,i)=>v===L[i].r),{L})}
/* ===== 46–47: khối trụ, khối cầu ===== */
const K4=['lp','hcn','tru','cau'],K4N=()=>[T('khối lập phương','cube'),T('khối hộp chữ nhật','cuboid'),T('khối trụ','cylinder'),T('khối cầu','sphere')];
function tenKhoi4(){const ks=shuf(K4.concat([pick(['tru','cau'])])),[m,...R]=ks;
 return chon('Vở: tên khối',K4N(),R.map((k,i)=>({lb:LB[i],t:[{k2:k,c:i+1},T('là','is a'),{b:1}]})),R.map(k=>K4.indexOf(k)),T('Mỗi đồ vật có dạng <b>khối gì</b>?','<b>What solid</b> is each one?'),T('Em chạm vào ô rồi chọn tên khối.','Tap a box, then choose the solid.'),q=>q.K.every((k,i)=>K4[q.a[i]]===k),[{k2:m,c:0},T('là','is a'),{mc:K4.indexOf(m)}],{K:R})}
function demKhoi4(){const N=RR(7,10),L=Array.from({length:N},()=>[pick(K4),RR(0,5)]);['tru','cau'].forEach((k,i)=>{if(!L.some(x=>x[0]===k))L[i][0]=k});const c=['tru','cau'].map(k=>L.filter(x=>x[0]===k).length);
 return form('Vở: đếm khối trụ, khối cầu',[{t:[{k2s:L}]},{lb:'a)',t:[{k2:'tru',c:0},T('Khối trụ:','Cylinders:'),{b:1}]},{lb:'b)',t:[{k2:'cau',c:1},T('Khối cầu:','Spheres:'),{b:1}]}],c,T('<b>Đếm</b> khối trụ và khối cầu.','<b>Count</b> the cylinders and spheres.'),T('Em đếm từng loại khối rồi viết số.','Count each kind of solid.'),q=>q.a[0]===L.filter(x=>x[0]==='tru').length&&q.a[1]===L.filter(x=>x[0]==='cau').length,{L})}
/* ===== 48–54: số đến 1000 ===== */
function tramChuc(){const ns=[0,1,2].map(()=>RR(1,4)*100+RR(0,9)*10+RR(1,9)),[m,...R]=ns,a=[];
 const row=(n,lb,b)=>({lb,t:[{tram:[Math.floor(n/100),Math.floor(n/10)%10,n%10]},{br:1},b?{b:1}:{m:Math.floor(n/100)},T('trăm','hundreds'),b?{b:1}:{m:Math.floor(n/10)%10},T('chục','tens'),b?{b:1}:{m:n%10},T('đơn vị →','ones →'),b?{b:1}:{m:n}]});
 R.forEach(n=>a.push(Math.floor(n/100),Math.floor(n/10)%10,n%10,n));
 return mkQ({lay:'vof',kind:'Vở: trăm, chục, đơn vị',mau:row(m,'',0).t,rows2:R.map((n,i)=>row(n,LB[i],1)),a,R,q:T('<b>Viết</b> số trăm, chục, đơn vị rồi viết số.','<b>Write</b> the hundreds, tens, ones and the number.'),say:T('Mỗi hình vuông là một trăm, mỗi thanh là một chục. Nhìn mẫu trước nhé.','Each square is a hundred, each bar is ten. Look at the example first.'),need,sol:R.join(' · '),
  vchk(){return this.R.every((n,i)=>this.a[4*i]===Math.floor(n/100)&&this.a[4*i+1]===Math.floor(n/10)%10&&this.a[4*i+2]===n%10&&this.a[4*i+3]===n)}})}
function vietTong(){const ns=distinct(3,101,999).map(n=>n%10?n:n+1),rows=[],a=[];ns.forEach((n,i)=>{const h=Math.floor(n/100)*100,t=Math.floor(n/10)%10*10,u=n%10;rows.push({lb:LB[i],t:[{x:`${n} =`},{b:1},{x:'+'},{b:1},{x:'+'},{b:1}]});a.push(h,t,u)});
 return form('Vở: viết số thành tổng',rows,a,T('<b>Viết</b> số thành tổng các trăm, chục, đơn vị.','<b>Write</b> each number as hundreds + tens + ones.'),T('Ví dụ: 245 bằng 200 cộng 40 cộng 5.','For example, 245 = 200 + 40 + 5.'),q=>ns.every((n,i)=>q.a[3*i]+q.a[3*i+1]+q.a[3*i+2]===n&&q.a[3*i]%100===0&&q.a[3*i+1]<100),{ns})}
const dau3=(lo,hi,st)=>dau(signSet(7,w=>{const x=RR(lo/st,hi/st)*st;let y=w===2?x:RR(lo/st,hi/st)*st;if(w!==2&&Math.abs(x-y)>200&&st===1)y=x+RR(-30,30);return[x,x,y,y]}),'Vở: so sánh số',1);
/* ===== 64–67: thống kê, khả năng ===== */
function bieuDo(){const sp=SP().slice(0,3),c=distinct(3,2,8),rows=sp.map((s,i)=>({lb:LB[i],t:[{bd:[s,c[i]]},{br:1},T(`Số ${nm(s).replace(/^(quả|con|cái|ngôi|bông) /,'')}:`,`Number:`),{b:1}]}));
 let x,y;do{x=RR(0,2);y=RR(0,2)}while(x===y||c[x]===c[y]);const big=c[x]>c[y]?x:y,sm=big===x?y:x;
 rows.push({lb:'d)',t:[T(`Số ${nm(sp[big]).replace(/^(quả|con|cái|ngôi|bông) /,'')} nhiều hơn số ${nm(sp[sm]).replace(/^(quả|con|cái|ngôi|bông) /,'')} là`,`How many more:`),{b:1}]});
 return form('Vở: biểu đồ tranh',rows,c.concat([c[big]-c[sm]]),T('Đọc <b>biểu đồ tranh</b> rồi viết số.','Read the <b>picture graph</b> and write the numbers.'),T('Em đếm số hình ở mỗi hàng.','Count the pictures in each row.'),q=>q.rows2.slice(0,3).every((r,i)=>r.t[0].bd[1]===q.a[i])&&q.a[3]===c[big]-c[sm],{c})}
function khaNang(){const O=[T('chắc chắn','certain'),T('có thể','possible'),T('không thể','impossible')],cols=[['#F04A1B',T('đỏ','red')],['#12B5E8',T('xanh','blue')],['#FCB40C',T('vàng','yellow')]];const rows=[],a=[];let mau;
 const ord=shuf([0,1,2]);for(let i=0;i<4;i++){const k=i===0?RR(0,2):ord[i-1];let box,ask,ans;
  if(k===0){const c=pick(cols);box=[[c[0],RR(3,6)]];ask=c;ans=0}else if(k===1){const [c1,c2]=shuf(cols);box=[[c1[0],RR(2,4)],[c2[0],RR(2,4)]];ask=pick([c1,c2]);ans=1}else{const [c1,c2,c3]=shuf(cols);box=[[c1[0],RR(2,4)],[c2[0],RR(1,3)]];ask=c3;ans=2}
  const t=[{hop:box},T(`Lấy 1 viên bi, ${i?'':''}lấy được bi ${ask[1]} là`,`Pick one marble: getting ${ask[1]} is`),i?{b:1}:{mc:ans}];if(i){rows.push({lb:LB[i-1],t});a.push(ans)}else mau=t}
 return chon('Vở: chắc chắn, có thể, không thể',O,rows,a,T('Chọn <b>chắc chắn</b>, <b>có thể</b> hay <b>không thể</b>.','Choose <b>certain</b>, <b>possible</b> or <b>impossible</b>.'),T('Nhìn màu bi trong hộp rồi chọn chắc chắn, có thể hay không thể.','Look at the marbles in the box, then choose certain, possible or impossible.'),q=>q.a.join()===ord.join(),mau)}

/* bảng thành phần phép tính (theo vở): mỗi cột một phép tính, mỗi hàng một thành phần */
function bangTP(op){const H={'+':[T('Số hạng','Addend'),T('Số hạng','Addend'),T('Tổng','Sum')],'-':[T('Số bị trừ','Minuend'),T('Số trừ','Subtrahend'),T('Hiệu','Difference')],'x':[T('Thừa số','Factor'),T('Thừa số','Factor'),T('Tích','Product')],':':[T('Số bị chia','Dividend'),T('Số chia','Divisor'),T('Thương','Quotient')]}[op];
 const ks={'+':['c100k'],'-':['t100k'],'x':['n2','n5'],':':['d2','d5']}[op];const C=uniq(()=>g(pick(ks)),4);
 const hide=C.map((_,j)=>j===0?2:RR(0,2));const rows=[0,1,2].map(i=>({t:[{w:H[i]}].concat(C.map((e,j)=>hide[j]===i?{b:1}:{n:[e.a,e.b,e.r][i]}))}));
 const A=[];[0,1,2].forEach(i=>C.forEach((e,j)=>{if(hide[j]===i)A.push([e.a,e.b,e.r][i])}));
 return mkQ({lay:'vof',kind:'Vở: bảng thành phần phép tính',tbl:1,rows2:rows,a:A,C,hide,q:T('<b>Số?</b> Điền vào bảng.','<b>Missing number?</b> Fill in the table.'),say:T('Mỗi cột là một phép tính. Em tìm số còn thiếu trong bảng.','Each column is one number sentence. Find the missing numbers.'),need,sol:C.map(e=>`${lab(e)} = ${e.r}`).join(' · '),
  vchk(){let k=0;return[0,1,2].every(i=>this.C.every((e,j)=>this.hide[j]!==i||this.a[k++]===[e.a,e.b,e.r][i]))&&this.C.every(e=>OPS[e.op](e.a,e.b)===e.r)}})}
/* ---------- trang theo bài ---------- */
let _p=null;const P=(b,i)=>PAGES[b]()[i];
const dauBieuThuc=(keys)=>dau(signSet(5,w=>{const e=g(pick(keys));const z=w===2?e.r:w===0?Math.max(0,e.r-RR(1,9)):e.r+RR(1,9);return[lab(e),e.r,z,z]}),'Vở: điền dấu');
const PAGES={
 1:()=>[noiDoc(11,99),tiaSo(),dau(signSet(7,w=>{const x=RR(10,99),y=w===2?x:RR(Math.max(10,x-15),Math.min(99,x+15));return[x,x,y,y]}),'Vở: so sánh số',1)],
 2:()=>[tiaSo(),day(1,10,99,6),xep(10,99)],
 3:()=>[bangTP('+'),tinh([g('c100k'),g('t100k'),g('c100k'),g('t100k'),g('c100k'),g('t100k')]),thieu([g('c100k'),g('t100k'),g('c100k'),g('t100k')])],
 4:()=>[honKem(),tinh([g('t100k'),g('t100k'),g('t100k'),g('t100k')]),dauBieuThuc(['c100k','t100k'])],
 5:()=>[tinh([g('c100k'),g('t100k'),g('c100k'),g('t100k'),g('c100k'),g('t100k')]),datTinh([g('c100k'),g('t100k'),g('c100k')]),noiKQ(uniq(()=>g(pick(['c100k','t100k'])),3))],
 6:()=>[P(3,0),P(4,0),P(5,1)],
 7:()=>[tachTron('+'),tinh(L3('c20',6),'Vở: tính',1),noiKQ(L3('c20',3))],
 8:()=>[tinh(L3('c20',6),'Vở: bảng cộng',1),dauBieuThuc(['c20']),thieu([g('c20'),g('c20'),g('c20'),g('c20')])],
 9:()=>[btThemBot(),tinh(L3('c20',4)),btThemBot()],
 10:()=>[P(7,0),P(8,1),P(9,0)],
 11:()=>[tachTron('-'),tinh(L3('t20',6),'Vở: tính',1),noiKQ(L3('t20',3))],
 12:()=>[tinh(L3('t20',6),'Vở: bảng trừ',1),dauBieuThuc(['t20']),thieu([g('t20'),g('t20'),g('t20'),g('t20')])],
 13:()=>[btNhieuIt(),tinh([g('c20'),g('t20'),g('c20'),g('t20')]),btNhieuIt()],
 14:()=>[P(11,0),P(13,0),dauBieuThuc(['c20','t20'])],
 15:()=>[donVi('kg',20),dauDV('kg',30),btDV('kg','ki-lô-gam')],16:()=>[donVi('l',20),dauDV('l',30),btDV('l','lít')],17:()=>[btDV('kg','ki-lô-gam'),btDV('l','lít'),dauDV('kg',50)],18:()=>[P(15,0),P(16,1),P(16,2)],
 19:()=>[tinh(L3('c21',6)),datTinh(L3('c21',3)),noiKQ(L3('c21',3))],20:()=>[tinh(L3('c22',6)),datTinh(L3('c22',3)),noiKQ(L3('c22',3))],21:()=>[thieu([g('c21'),g('c22'),g('c21'),g('c22')]),dauBieuThuc(['c21','c22']),P(13,0)],
 22:()=>[tinh(L3('t21',6)),datTinh(L3('t21',3)),noiKQ(L3('t21',3))],23:()=>[tinh(L3('t22',6)),datTinh(L3('t22',3)),noiKQ(L3('t22',3))],24:()=>[thieu([g('t21'),g('t22'),g('t21'),g('t22')]),dauBieuThuc(['t21','t22']),datTinh([g('c22'),g('t22'),g('c21')])],
 25:()=>[doanThang(),demTuGiac(),duongGK()],26:()=>[duongGK(),demTuGiac(),doanThang()],27:()=>[doanThang(),duongGK(),demTuGiac()],28:()=>[duongGK(),doanThang(),demTuGiac()],
 29:()=>[gioPhut(),ngayGio(),noi30()],
 30:()=>[soNgayThang(),ngayThang(),gioPhut()],31:()=>[gioPhut(),ngayThang(),soNgayThang()],32:()=>[P(29,0),P(30,1),P(25,2)],
 33:()=>[tinh([g('c20'),g('t20'),g('c22'),g('t22'),g('c21'),g('t21')]),datTinh([g('c22'),g('t22'),g('c21')]),thieu([g('c22'),g('t22'),g('c20'),g('t20')])],
 34:()=>[demTuGiac(),duongGK(),doanThang()],35:()=>[donVi('kg',30),gioPhut(),btDV('l','lít')],36:()=>[P(33,0),P(34,1),P(35,1)],
 37:()=>[nhanTranh(),tinh(L3('n2',3).concat(L3('n5',3)),'Vở: tính nhân'),nhanTranh()],38:()=>[bangTP('x'),nhanTranh(),tinh(L3('n2',3).concat(L3('n5',3)))],
 39:()=>[tinh(L3('n2',6),'Vở: bảng nhân 2',1),day(2,2,20,6),noiKQ(L3('n2',3))],40:()=>[tinh(L3('n5',6),'Vở: bảng nhân 5',1),day(5,5,50,6),noiKQ(L3('n5',3))],
 41:()=>[chiaDeu(),tinh(L3('d2',3).concat(L3('d5',3)),'Vở: tính chia'),chiaDeu()],42:()=>[bangTP(':'),chiaDeu(),tinh(L3('d2',3).concat(L3('d5',3)))],
 43:()=>[tinh(L3('d2',6),'Vở: bảng chia 2',1),noiKQ(L3('d2',3)),thieu([g('d2'),g('n2'),g('d2'),g('n2')])],44:()=>[tinh(L3('d5',6),'Vở: bảng chia 5',1),noiKQ(L3('d5',3)),thieu([g('d5'),g('n5'),g('d5'),g('n5')])],
 45:()=>[tinh([g('n2'),g('n5'),g('d2'),g('d5'),g('n5'),g('d2')],'Vở: tính',1),dauBieuThuc(['n2','n5','d2','d5']),nhanTranh()],
 46:()=>[tenKhoi4(),demKhoi4(),tenKhoi4()],47:()=>[demKhoi4(),tenKhoi4(),P(45,0)],
 48:()=>[tramChuc(),day(100,100,1000,6),noiDoc(100,1000)],49:()=>[day([10,100],100,1000,6),dau3(100,1000,10),xep100t()],50:()=>[dau3(100,1000,100),dau3(100,1000,10),xep100t()],
 51:()=>[tramChuc(),noiDoc(101,999),day(1,100,999,6)],52:()=>[vietTong(),tramChuc(),noiDoc(101,999)],53:()=>[dau3(100,999,1),xep(100,999),vietTong()],54:()=>[P(51,1),P(53,0),P(52,0)],
 55:()=>[doiDV(),donVi('m',50),dauDV('km',90)],56:()=>[tienQ(),tienQ(),donVi('đồng',400)],57:()=>[doanThang(),doiDV(),donVi('dm',50)],58:()=>[P(55,0),P(56,0),P(57,0)],
 59:()=>[tinh(L3('c1000k',4)),datTinh(L3('c1000k',3)),noiKQ(L3('c1000k',3))],60:()=>[tinh(L3('c1000',4)),datTinh(L3('c1000',3)),noiKQ(L3('c1000',3))],
 61:()=>[tinh(L3('t1000k',4)),datTinh(L3('t1000k',3)),noiKQ(L3('t1000k',3))],62:()=>[tinh(L3('t1000',4)),datTinh(L3('t1000',3)),noiKQ(L3('t1000',3))],63:()=>[thieu([g('c1000'),g('t1000'),g('c1000k'),g('t1000k')]),dauBieuThuc(['c1000','t1000']),datTinh([g('c1000'),g('t1000'),g('t1000k')])],
 64:()=>[bieuDo(),bieuDo(),khaNang()],65:()=>[bieuDo(),bieuDo(),bieuDo()],66:()=>[khaNang(),khaNang(),bieuDo()],67:()=>[bieuDo(),khaNang(),bieuDo()],
 68:()=>[P(51,0),P(53,0),P(52,0)],69:()=>[P(33,0),P(33,1),P(21,1)],70:()=>[P(63,0),P(60,1),P(62,1)],71:()=>[P(45,0),P(45,1),P(37,0)],72:()=>[P(34,0),P(34,1),P(46,0)],73:()=>[P(55,0),P(35,1),P(15,2)],74:()=>[P(64,0),P(66,0),P(65,0)],75:()=>[P(69,0),P(70,1),P(71,2)]};
function noi30(){const H=distinct(3,1,12),Mi=H.map(()=>pick([0,30]));return noiQ('Vở: nối đồng hồ với giờ',H.map((h,i)=>[{ck:[h,Mi[i]],z:46}]),H.map((h,i)=>[{e:T(`${h} giờ${Mi[i]?' 30 phút':''}`,`${h}:${Mi[i]?'30':'00'}`)}]),H.map((h,i)=>h*100+Mi[i]),T('<b>Nối</b> đồng hồ với giờ đúng.','<b>Match</b> each clock to its time.'),HINTN('Em nối mỗi đồng hồ với giờ đúng.','Match each clock to the right time.'),q=>q.left.every((l,i)=>q.vals[i]===l[0].ck[0]*100+l[0].ck[1]))}
function xep100t(){const A=distinct(4,1,9).map(v=>v*100),B=distinct(4,10,99).map(v=>v*10);const up=A.slice().sort((x,y)=>x-y),dn=B.slice().sort((x,y)=>y-x);
 return mkQ({lay:'vok',kind:'Vở: xếp thứ tự số tròn trăm, tròn chục',rows2:[{lb:'a)',t:[T(`Xếp ${A.join(', ')} từ bé đến lớn:`,`Order ${A.join(', ')} from smallest:`)]},{t:[{b:1},{b:1},{b:1},{b:1}]},{lb:'b)',t:[T(`Xếp ${B.join(', ')} từ lớn đến bé:`,`Order ${B.join(', ')} from largest:`)]},{t:[{b:1},{b:1},{b:1},{b:1}]}],a:up.concat(dn),cards:shuf(A.concat(B)),
  q:T('<b>Kéo</b> thẻ số để xếp theo thứ tự.','<b>Drag</b> the cards to put the numbers in order.'),say:T('Em kéo thẻ số để xếp các số theo thứ tự.','Drag the cards to put the numbers in order.'),need:needK,sol:'',vchk(){const u=this.a.slice(0,4),d=this.a.slice(4);return u.every((v,i)=>!i||v>u[i-1])&&d.every((v,i)=>!i||v<d[i-1])}})}
Object.assign(V,{gen,lab,OPS,SH,uniq,tinh,datTinh,noiKQ,thieu,dau,signSet,form,chon,xep,day,loiVan,bangTP,gioPhut,soNgayThang,tienQ,khaNang,bieuDo,doanThang,duongGK,demTuGiac,tenKhoi4,demKhoi4,read3,need,needC,needK,HINTN,NV,NG,clock2,tien,vc2});
{_p=window.voPage;window.voPage=function(x){if(curG()===2&&PAGES[x.b])return PAGES[x.b]().filter(Boolean);return _p(x)}}
document.head.insertAdjacentHTML('beforeend',`<style>
.vogrs{display:inline-flex;gap:4px;flex-wrap:wrap}.vogrs .vopic{padding:2px}
</style>`);
})();
