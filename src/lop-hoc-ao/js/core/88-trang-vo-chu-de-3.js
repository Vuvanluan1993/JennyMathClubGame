/* 88 — Trang vở lớp 1, Chủ đề 3 "Phép cộng, phép trừ trong phạm vi 10" (thầy duyệt Chủ đề 1 và giao làm tiếp 13/11/2026)
   Dùng lại 4 kiểu trang của 87 (vof điền ô · voc chọn · von nối · vok kéo thẻ). Mỗi bài KNTT: 3 bài kiểu vở + 2 câu đảo + ★.
     Bài 10 Phép cộng: Viết phép cộng theo tranh (có Mẫu; đổi chỗ hai số hạng vẫn đúng) · Tính · Nối phép tính với kết quả
     Bài 11 Phép trừ: Viết phép trừ theo tranh (có Mẫu, hình bị gạch) · Tính · Kéo thẻ: số còn thiếu
     Bài 12 Bảng cộng, bảng trừ: Điền dấu >, <, = (phép tính với số) · Gia đình phép tính từ sơ đồ · Nối hai phép tính bằng nhau
     Bài 13 Luyện tập chung: Tính (cộng, trừ) · Điền dấu · Viết phép tính theo tranh (cộng hoặc trừ)
   Mảnh mới: {x:'6 + 3 ='} chữ phép tính · {e:'3 + 4'} ô phép tính · {gx:[hình,n,k]} n hình, k hình cuối bị gạch · {br:1} xuống dòng.
   Mỗi câu có vchk() tự kiểm đáp án. Lời viết lại, hình pixel tự vẽ. */
(function(){
const V=window.VO;if(!V||!V.mkQ)return;
const {T,RR,VS,vspr,mkQ,LB,SP,SIGN,sgn}=V;
const M='−';
/* ---------- mảnh mới ---------- */
function gx(n,k,s,c){c=c||5;return`<div class="vopic one"><div class="vogrp" style="width:${Math.ceil(c*7*s+(c-1)*3+6)}px">${Array.from({length:n},(_,i)=>`<span class="voxs ${i>=n-k?'x':''}">${vspr(arguments[4],s)}</span>`).join('')}</div></div>`}
V.tokX=function(t,cell,q){if(!t||typeof t!=='object')return null;
 if(t.x!==undefined)return`<span class="voex">${t.x}</span>`;
 if(t.e!==undefined)return`<span class="votc vb1 w ve ${String(t.e).length>14?'L':''}">${t.e}</span>`;
 if(t.gx)return gx(t.gx[1],t.gx[2],t.s||2,t.c||5,t.gx[0]);
 if(t.br)return'<span class="vobr"></span>';
 return null};
const ev=(a,o,b)=>o==='+'?a+b:a-b;
const pr=(lo,hi,op)=>{for(;;){const a=RR(0,10),b=RR(0,10),r=ev(a,op,b);if(r>=lo&&r<=hi&&r>=0&&(op==='+'?r<=10:true)&&!(a===0&&b===0))return[a,b,r]}};
/* 1. Viết phép tính theo tranh (cộng: hai nhóm; trừ: n hình, gạch k) */
function theoTranh(ops){const sp=SP(),rows=[],a=[],sw=[];let k=0;const mk=op=>{if(op==='+'){const x=RR(1,6),y=RR(1,Math.min(6,10-x));return{op,x,y,r:x+y}}const n=RR(3,9),y=RR(1,n-1);return{op,x:n,y,r:n-y}};
 const all=ops.map(mk),m=all[0],R=all.slice(1);
 const pic=(e,i)=>e.op==='+'?{g2:[sp[i%sp.length],e.x,e.y],s:1.6}:{gx:[sp[i%sp.length],e.x,e.y],s:1.6,c:5};
 const mau=[pic(m,0),{m:m.x},{x:m.op},{m:m.y},{x:'='},{m:m.r}];
 R.forEach((e,i)=>{rows.push({lb:LB[i],t:[pic(e,i+1),{b:1},{x:e.op},{b:1},{x:'='},{b:1}]});if(e.op==='+')sw.push([k,k+1]);a.push(e.x,e.y,e.r);k+=3});
 const plus=ops.every(o=>o==='+'),minus=ops.every(o=>o==='−');
 return mkQ({lay:'vof',kind:plus?'Vở: phép cộng theo tranh':minus?'Vở: phép trừ theo tranh':'Vở: phép tính theo tranh',mau,rows2:rows,a,sw,E:R,
  q:plus?T('<b>Viết</b> phép cộng theo tranh.','<b>Write</b> an addition for each picture.'):minus?T('<b>Viết</b> phép trừ theo tranh. Hình bị gạch là bớt đi.','<b>Write</b> a subtraction for each picture. Crossed-out ones are taken away.'):T('<b>Viết</b> phép tính theo tranh.','<b>Write</b> a number sentence for each picture.'),
  say:plus?T('Em nhìn tranh rồi viết phép cộng. Nhìn mẫu trước nhé.','Look at the picture and write an addition. Look at the example first.'):T('Em nhìn tranh rồi viết phép tính. Hình bị gạch là bớt đi. Nhìn mẫu trước nhé.','Look at the picture and write a number sentence. Crossed-out ones are taken away. Look at the example first.'),
  need:T('Em điền hết các ô trống nhé.','Fill in every box first.'),sol:R.map(e=>`${e.x} ${e.op} ${e.y} = ${e.r}`).join(' · '),
  vchk(){return this.E.every((e,i)=>this.a[3*i]===e.x&&this.a[3*i+1]===e.y&&this.a[3*i+2]===ev(e.x,e.op==='+'?'+':'-',e.y)&&this.a[3*i+2]>=0&&this.a[3*i+2]<=10)}})}
/* 2. Tính */
function tinh(ops){const P=ops.map(op=>{const [x,y,r]=pr(0,10,op==='+'?'+':'-');return{op,x,y,r}});
 return mkQ({lay:'vof',kind:'Vở: tính',c2:1,rows2:P.map((e,i)=>({t:[{x:`${e.x} ${e.op} ${e.y} =`},{b:1}]})),a:P.map(e=>e.r),E:P,
  q:T('<b>Tính.</b>','<b>Work out.</b>'),say:T('Em tính rồi viết kết quả vào ô.','Work out each one and write the answer.'),need:T('Em điền hết các ô trống nhé.','Fill in every box first.'),
  sol:P.map(e=>`${e.x} ${e.op} ${e.y} = ${e.r}`).join(' · '),vchk(){return this.E.every((e,i)=>this.a[i]===ev(e.x,e.op==='+'?'+':'-',e.y)&&this.a[i]>=0&&this.a[i]<=10)}})}
/* 3. Nối phép tính với kết quả / với phép tính bằng nó */
function noiKQ(ops,pair){const used=new Set(),L=[],Rv=[];
 for(let t=0;L.length<3&&t<200;t++){const op=ops[L.length%ops.length],[x,y,r]=pr(1,10,op==='+'?'+':'-');if(used.has(r))continue;used.add(r);L.push({x,y,op,r});
  if(pair){let z;for(let u=0;u<50;u++){const o2=op==='+'?'-':'+',[p,q2,r2]=pr(r,r,o2==='+'?'+':'-');if(r2===r){z={x:p,y:q2,op:o2==='+'?'+':M};break}}Rv.push(z||{x:r,y:0,op:'+'})}else Rv.push({n:r})}
 const R=shuf([0,1,2]),lab=e=>`${e.x} ${e.op} ${e.y}`;
 return mkQ({lay:'von',kind:pair?'Vở: nối hai phép tính bằng nhau':'Vở: nối phép tính với kết quả',left:L.map(e=>[{e:lab(e)}]),right:R.map(k=>pair?[{e:lab(Rv[k])}]:[{n:Rv[k].n}]),R,L,Rv,a:[R.indexOf(1),R.indexOf(2)],rows2:[],
  q:pair?T('<b>Nối</b> hai phép tính có kết quả bằng nhau.','<b>Match</b> the number sentences with the same answer.'):T('<b>Nối</b> mỗi phép tính với kết quả đúng.','<b>Match</b> each number sentence to its answer.'),
  say:pair?T('Em tính rồi nối hai phép tính có kết quả bằng nhau. Nét đứt là mẫu.','Work them out, then match the ones with the same answer. The dashed line is the example.'):T('Em tính rồi nối mỗi phép tính với kết quả đúng. Nét đứt là mẫu.','Work them out, then match each one to its answer. The dashed line is the example.'),
  need:T('Em nối hết nhé.','Match them all first.'),sol:L.map(e=>`${lab(e)} = ${e.r}`).join(' · '),
  vchk(){const val=e=>e.n!==undefined?e.n:ev(e.x,e.op==='+'?'+':'-',e.y);return this.a.every((r,k)=>val(this.Rv[this.R[r]])===this.L[k+1].r&&this.R[r]===k+1)&&val(this.Rv[this.R[this.R.indexOf(0)]])===this.L[0].r}})}
/* 4. Số còn thiếu (kéo thẻ) */
function thieu(){const kinds=shuf(['a','b','r','a2']),rows=[],a=[],E=[];
 kinds.forEach((k,i)=>{const op=i%2?'-':'+',[x,y,r]=pr(1,10,op),o=op==='+'?'+':M;let t;
  if(k==='a'||k==='a2'){t=[{b:1},{x:`${o} ${y} = ${r}`}];a.push(x)}else if(k==='b'){t=[{x:`${x} ${o}`},{b:1},{x:`= ${r}`}];a.push(y)}else{t=[{x:`${x} ${o} ${y} =`},{b:1}];a.push(r)}
  rows.push({lb:LB[i],t});E.push({x,y,r,op,k})});
 const have=new Set(a),ex=shuf(Array.from({length:11},(_,i)=>i).filter(v=>!have.has(v))).slice(0,2);
 return mkQ({lay:'vok',kind:'Vở: số còn thiếu',rows2:rows,a,E,cards:shuf(a.concat(ex)),
  q:T('<b>Số?</b> Kéo thẻ số vào ô trống.','<b>Missing number?</b> Drag a card into each box.'),say:T('Em tìm số còn thiếu rồi kéo thẻ số vào ô trống.','Find the missing number and drag the card into the box.'),
  need:T('Em đặt thẻ vào hết các ô nhé.','Put a card in every box first.'),sol:E.map(e=>`${e.x} ${e.op==='+'?'+':M} ${e.y} = ${e.r}`).join(' · '),
  vchk(){return this.E.every((e,i)=>ev(e.x,e.op,e.y)===e.r&&this.a[i]===(e.k==='b'?e.y:e.k==='r'?e.r:e.x))&&this.a.every(v=>this.cards.includes(v))}})}
/* 5. Dấu >, <, = giữa phép tính và số */
function dauPT(n){const ps=[];const want=shuf([0,1,2].concat(Array.from({length:n-4},()=>RR(0,2))));
 want.forEach((w,i)=>{const op=i%2?'-':'+';let x,y,r,z,t=0;do{[x,y,r]=pr(0,10,op);z=w===2?r:w===0?RR(0,Math.max(0,r-1)):RR(Math.min(10,r+1),10)}while(sgn(r,z)!==w&&t++<60);ps.push({x,y,r,z,op:op==='+'?'+':M})});
 const [m,...R]=ps;const lab=e=>`${e.x} ${e.op} ${e.y}`;
 return mkQ({lay:'voc',kind:'Vở: điền dấu với phép tính',opts:SIGN,mau:[{x:lab(m)},{mc:sgn(m.r,m.z)},{m:m.z}],rows2:R.map((e,i)=>({lb:LB[i],t:[{x:lab(e)},{b:1},{n:e.z}]})),a:R.map(e=>sgn(e.r,e.z)),E:R,
  q:T('Điền dấu <b>&gt;</b>, <b>&lt;</b>, <b>=</b> vào ô trống.','Write <b>&gt;</b>, <b>&lt;</b> or <b>=</b> in each box.'),say:T('Em tính phép tính trước, rồi điền dấu lớn hơn, bé hơn hoặc bằng.','Work out the number sentence first, then write greater than, less than or equal.'),
  need:T('Em điền dấu vào mọi ô nhé.','Put a sign in every box first.'),sol:R.map(e=>`${lab(e)} ${SIGN[sgn(e.r,e.z)]} ${e.z}`).join(' · '),
  vchk(){return this.E.every((e,i)=>ev(e.x,e.op==='+'?'+':'-',e.y)===e.r&&sgn(e.r,e.z)===this.a[i])}})}
/* 6. Gia đình phép tính từ sơ đồ tách – gộp */
function giaDinhVo(){let n,x,y;do{n=RR(4,10);x=RR(1,n-1);y=n-x}while(x===y);
 const rows=[{t:[{sd:[n,x,y]},{x:T(`${n} gồm ${x} và ${y}`,`${n} is ${x} and ${y}`)}]},{lb:'a)',t:[{x:`${x} + ${y} =`},{b:1}]},{lb:'b)',t:[{x:`${y} +`},{b:1},{x:`= ${n}`}]},{lb:'c)',t:[{x:`${n} ${M} ${x} =`},{b:1}]},{lb:'d)',t:[{x:`${n} ${M}`},{b:1},{x:`= ${x}`}]}];
 return mkQ({lay:'vof',kind:'Vở: gia đình phép tính',rows2:rows,a:[n,x,y,y],n,x,y,
  q:T('Nhìn sơ đồ, <b>viết số</b> vào ô trống.','Look at the diagram and <b>write the numbers</b>.'),say:T('Em nhìn sơ đồ tách gộp rồi viết số vào ô trống để có hai phép cộng, hai phép trừ.','Use the part whole diagram to fill in two additions and two subtractions.'),
  need:T('Em điền hết các ô trống nhé.','Fill in every box first.'),sol:`${x} + ${y} = ${n} · ${y} + ${x} = ${n} · ${n} ${M} ${x} = ${y} · ${n} ${M} ${y} = ${x}`,
  vchk(){const [p,q2,r,s2]=this.a;return p===this.x+this.y&&this.y+q2===this.n&&this.n-this.x===r&&this.n-s2===this.x}})}

const PAGES={10:()=>[theoTranh(['+','+','+','+']),tinh(['+','+','+','+','+','+']),noiKQ(['+'])],
 11:()=>[theoTranh([M,M,M,M]),tinh([M,M,M,M,M,M]),thieu()],
 12:()=>[dauPT(6),giaDinhVo(),noiKQ(['+',M],1)],
 13:()=>[tinh(['+',M,'+',M,'+',M]),dauPT(6),theoTranh(shuf(['+',M,'+',M]))]};
{const _p=window.voPage;window.voPage=function(x){if(curG()===1&&PAGES[x.b])return PAGES[x.b]();return _p(x)}}
Object.assign(I18N,{'Vở: phép cộng theo tranh':'Book: addition pictures','Vở: phép trừ theo tranh':'Book: subtraction pictures','Vở: phép tính theo tranh':'Book: picture sentences','Vở: tính':'Book: work out','Vở: nối phép tính với kết quả':'Book: match answers','Vở: nối hai phép tính bằng nhau':'Book: equal sentences','Vở: số còn thiếu':'Book: missing numbers','Vở: điền dấu với phép tính':'Book: compare sentences','Vở: gia đình phép tính':'Book: fact family'});
document.head.insertAdjacentHTML('beforeend',`<style>
.voex{font-family:var(--f-display);font-size:22px;line-height:1;background:#fff;padding:0 2px;white-space:nowrap;color:#1F2A5A}
.votc.ve{font-family:var(--f-display);font-size:20px;white-space:nowrap}
.vobr{flex-basis:100%;height:0}
.voxs{position:relative;display:inline-block;line-height:0}
.voxs.x::after{content:"";position:absolute;inset:-1px;background:linear-gradient(45deg,transparent 43%,#1F2A5A 43%,#1F2A5A 57%,transparent 57%),linear-gradient(-45deg,transparent 43%,#1F2A5A 43%,#1F2A5A 57%,transparent 57%)}
</style>`);
})();
