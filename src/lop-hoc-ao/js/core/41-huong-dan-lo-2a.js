/* 41 — Hướng dẫn khi làm sai · Lô 2a
   - col: đặt tính có nhớ (cộng, trừ, nhân với số có một chữ số) — tính từng hàng từ phải sang trái, số nhớ đỏ.
   - cmp: so sánh số — bảng hàng (nghìn, trăm, chục, đơn vị), so từ hàng cao; số ≤ 99 có thêm que chục, khối đơn vị.
   - mul: bảng nhân, bảng chia — hàng kẹo bằng nhau, đếm thêm theo từng hàng.
   Bật/tắt từng dạng bằng .on trong GD_EXT. */
const GD_PL=['đơn vị','chục','trăm','nghìn','chục nghìn'],GD_PLS=['Đ','C','Tr','N','CN'];
const gdDig=n=>String(n).split('').reverse().map(Number);
/* ---------- đặt tính ---------- */
function gdColGrid(o){/* o:{a,b,op,res:[digits shown by place or null], carry:{place:v}, hl:place, n:cols} */const n=o.n,da=gdDig(o.a),db=gdDig(o.b),cell=(v,cls='')=>`<i class="${cls}">${v??''}</i>`;
 const row=(ds,lead,cls,isB)=>{let h=`<div class="gcr ${cls}"><b class="gco">${lead||''}</b>`;for(let p=n-1;p>=0;p--){const v=ds[p];const sub=isB&&o.borrow&&o.borrow[p]?`<sup class="gcb">${o.borrow[p]}</sup>`:'';h+=`<i class="${p===o.hl?'hl':''}">${v===undefined?'':v}${sub}</i>`}return h+'</div>'};
 let h=`<div class="gcol"><div class="gcr gch"><b class="gco"></b>${Array.from({length:n},(_,k)=>`<i>${GD_PLS[n-1-k]}</i>`).join('')}</div>`;
 if(o.op!=='−')h+=`<div class="gcr gcc"><b class="gco"></b>${Array.from({length:n},(_,k)=>{const p=n-1-k,c=o.carry&&o.carry[p];return`<i class="${p===o.hl?'hl':''}">${c?c:''}</i>`}).join('')}</div>`;
 h+=row(da,'','');h+=row(o.op==='×'?[o.b]:db,o.op,'',true);
 h+=`<div class="gcl"></div>`;h+=row(o.res||[],'','gcres');return h+'</div>'}
function gdColParse(q){const G=curG();if(G<2||G>4)return null;const pic=String(q.pic||''),t=gdTxt(q.q),s=gdTxt(q.sol);let a,b,op;
 const m=pic.match(/g1col"><span>([\d  ]+)<\/span><span><em>([+−×])<\/em>([\d  ]+)<\/span>/);
 if(m){a=gdN(m[1]);op=m[2];b=gdN(m[3])}else{const m2=t.match(new RegExp(`^\\s*(${GD_NUM})\\s*([+−×])\\s*(${GD_NUM})\\s*=\\s*\\?\\s*$`));if(!m2||!/nhớ|đặt tính|Nhân số có/i.test((q.kind||'')+s))return null;a=gdN(m2[1]);op=m2[2];b=gdN(m2[3])}
 if(!(a>=0&&b>=0)||!Number.isInteger(a)||!Number.isInteger(b))return null;const r=op==='+'?a+b:op==='−'?a-b:a*b;if(r<0||String(Math.max(a,r)).length>5)return null;
 if(op==='×'&&b>9)return null;if(Number(q.type==='num'?q.a:NaN)!==r&&q.type==='num')return null;
 /* chỉ khi thật sự có nhớ */const da=gdDig(a),db=gdDig(b);let carry=0,has=false;for(let p=0;p<Math.max(da.length,db.length);p++){const x=da[p]||0,y=op==='×'?(p===0?b:0):(db[p]||0);if(op==='+'){if(x+y+carry>9)has=true;carry=x+y+carry>9?1:0}else if(op==='−'){if(x<y+carry)has=true;carry=x<y+carry?1:0}else{if(x*b+carry>9)has=true;carry=Math.floor((x*b+carry)/10)}}
 if(!has)return null;return{a,b,op,r}}
function gdFramesCol(k){const F=[],{a,b,op,r}=k,da=gdDig(a),db=op==='×'?[b]:gdDig(b),dr=gdDig(r),n=Math.max(da.length,op==='×'?1:db.length,dr.length),res=[],carry={},borrow={};
 const opw={'+':'cộng','−':'trừ','×':'nhân'}[op],grid=(hl)=>gdColGrid({a,b,op,n,res:res.slice(),carry:{...carry},borrow:{...borrow},hl});
 F.push({h:grid(-1)+gdEq(`${fmt(a)} ${op} ${fmt(b)} = ?`),say:op==='×'?`Đặt tính: viết thừa số ${b} thẳng cột với hàng đơn vị. Nhân lần lượt từ phải sang trái.`:`Đặt tính: các hàng thẳng cột với nhau. Tính từ phải sang trái, bắt đầu từ hàng đơn vị.`,dur:3200});
 let c=0,asked=false;
 for(let p=0;p<n;p++){const x=da[p]||0,y=op==='×'?b:(db[p]||0),PL=GD_PL[p];if(p>=da.length&&!c)break;
  if(op==='+'){const sum=x+y+c,w=sum%10,nc=sum>9?1:0,expr=c?`${x} + ${y} thêm ${c} nhớ`:`${x} + ${y}`;
   if(nc&&!asked){asked=true;F.push({h:grid(p),say:`Hàng ${PL}: ${expr} bằng mấy?`,dur:0,mcq:{q:`Hàng ${PL}: ${expr.replace(' thêm',', thêm')} = ?`,opts:gdOpts(sum,[sum-1,sum+1,w]),a:String(sum),ok:`Đúng rồi, bằng ${sum}.`,hint:c?'Nhớ cộng thêm số nhớ đỏ ở trên.':'Cộng hai chữ số trong cột đang sáng.'}})}
   res[p]=w;if(nc)carry[p+1]=1;F.push({h:grid(p),say:`Hàng ${PL}: ${expr} bằng ${sum}.${nc?` Viết ${w}, nhớ 1 sang hàng ${GD_PL[p+1]}.`:` Viết ${w}.`}`,dur:3000});c=nc}
  else if(op==='−'){const need=y+c,bor=x<need,top=bor?x+10:x,w=top-need;
   const expr=c?`${y} thêm ${c} bằng ${need}; ${top} − ${need}`:`${top} − ${y}`;
   if(bor&&!asked){asked=true;F.push({h:grid(p),say:`Hàng ${PL}: ${x} có trừ được ${need} không?`,dur:0,mcq:{q:`Hàng ${PL}: ${x} trừ ${need} được không?`,opts:['Được','Không được, lấy '+(x+10)+' − '+need],a:'Không được, lấy '+(x+10)+' − '+need,ok:`Đúng rồi! ${x} bé hơn ${need}, nên lấy ${x+10} trừ ${need}.`,hint:`${x} bé hơn ${need} thì không trừ được.`}})}
   res[p]=w;if(bor&&p+1<n)borrow[p+1]=1;
   F.push({h:grid(p),say:bor?`Hàng ${PL}: ${c?`${y} thêm ${c} nhớ là ${need}. `:''}${x} không trừ được ${need}, lấy ${top} trừ ${need} bằng ${w}. Viết ${w}, nhớ 1 sang hàng ${GD_PL[p+1]}.`:`Hàng ${PL}: ${c?`${y} thêm ${c} nhớ là ${need}. `:''}${x} trừ ${need} bằng ${w}. Viết ${w}.`,dur:3400});c=bor?1:0}
  else{const pr=x*b+c,w=pr%10,nc=Math.floor(pr/10),last=p>=da.length-1;
   if(nc&&!asked){asked=true;F.push({h:grid(p),say:`Hàng ${PL}: ${x} nhân ${b}${c?` thêm ${c} nhớ`:''} bằng mấy?`,dur:0,mcq:{q:`${x} × ${b}${c?` + ${c} nhớ`:''} = ?`,opts:gdOpts(pr,[pr-b,pr+b,pr+1]),a:String(pr),ok:`Đúng rồi, bằng ${pr}.`,hint:'Nhân trước, rồi cộng số nhớ.'}})}
   if(last&&p===da.length-1){/* chữ số cuối: viết cả số */const ds=gdDig(pr);ds.forEach((d,i)=>res[p+i]=d);F.push({h:grid(p),say:`Hàng ${PL}: ${x} nhân ${b} bằng ${x*b}${c?`, thêm ${c} nhớ là ${pr}`:''}. Viết ${pr}.`,dur:3000});c=0;break}
   res[p]=w;if(nc)carry[p+1]=nc;F.push({h:grid(p),say:`Hàng ${PL}: ${x} nhân ${b} bằng ${x*b}${c?`, thêm ${c} nhớ là ${pr}`:''}. Viết ${w}${nc?`, nhớ ${nc}`:''}.`,dur:3000});c=nc}}
 if(op==='+'&&c){res[n-1]=c;F.push({h:grid(n-1),say:`Còn nhớ 1, viết 1 sang hàng ${GD_PL[n-1]}.`,dur:2200})}
 for(let p=0;p<dr.length;p++)res[p]=dr[p];for(let p=dr.length;p<n;p++)res[p]=undefined;
 F.push({h:gdColGrid({a,b,op,n,res:dr,carry,borrow,hl:-1})+gdEq(`${fmt(a)} ${op} ${fmt(b)} = <em>${fmt(r)}</em>`),say:`Vậy ${a} ${opw} ${b} bằng ${r}. Nhớ viết số nhớ thật nhỏ để không quên nhé.`,dur:2800});return F}

/* ---------- so sánh ---------- */
function gdCmpParse(q){if(!/So sánh|dấu/i.test((q.kind||'')+' '+gdTxt(q.q)))return null;const t=gdTxt(q.q);const m=t.match(new RegExp(`(?:^|:)\\s*(${GD_NUM})\\s*…\\s*(${GD_NUM})\\s*$`));if(!m)return null;
 const A=gdN(m[1]),B=gdN(m[2]);if(!Number.isInteger(A)||!Number.isInteger(B)||Math.max(A,B)>=1e5)return null;return{A,B}}
function gdRods(n){/* que chục, khối đơn vị pixel */const t=Math.floor(n/10),u=n%10;return `<div class="gdrodw"><div class="gdrod">${Array.from({length:t},()=>'<i class="r"></i>').join('')}<span class="gdu">${Array.from({length:u},()=>'<i></i>').join('')}</span></div><b>${t} chục ${u} đơn vị</b></div>`}
function gdCmpTable(A,B,n,state){/* state[p]: 'eq'|'hl'|'' */const dA=gdDig(A),dB=gdDig(B);let h=`<div class="gcmp"><div class="gcr gch"><b class="gco"></b>${Array.from({length:n},(_,k)=>`<i>${GD_PLS[n-1-k]}</i>`).join('')}</div>`;
 for(const [ds,lab] of [[dA,'A'],[dB,'B']]){h+=`<div class="gcr"><b class="gco">${lab==='A'?fmt(A):fmt(B)}</b>${Array.from({length:n},(_,k)=>{const p=n-1-k;return`<i class="${state[p]||''}">${ds[p]===undefined?'':ds[p]}</i>`}).join('')}</div>`}
 return h+'</div>'}
function gdFramesCmp(k){const F=[],{A,B}=k,sA=String(A).length,sB=String(B).length,n=Math.max(sA,sB),sign=A>B?'>':A<B?'<':'=',st={},dA=gdDig(A),dB=gdDig(B);
 const pic=()=>(Math.max(A,B)<=99?`<div class="gdrods">${gdRods(A)}${gdRods(B)}</div>`:'')+gdCmpTable(A,B,n,{...st});
 const signQ=(why)=>({q:`Chọn dấu: ${fmt(A)} … ${fmt(B)}`,opts:['>','<','='],a:sign,ok:`Đúng rồi: ${fmt(A)} ${sign} ${fmt(B)}.`,hint:why,grid:3});
 F.push({h:pic()+gdEq(`${fmt(A)} … ${fmt(B)}`),say:Math.max(A,B)<=99?`Mỗi que là một chục, mỗi ô vuông nhỏ là một đơn vị. Mình so sánh từ hàng cao nhất.`:`Viết hai số vào bảng hàng. Mình so sánh từ hàng cao nhất, bên trái.`,dur:3000});
 if(sA!==sB){F.push({h:pic()+gdEq(`${fmt(A)} … ${fmt(B)}`),say:`${fmt(A)} có ${sA} chữ số, ${fmt(B)} có ${sB} chữ số. Số nào nhiều chữ số hơn thì lớn hơn.`,dur:3200});F.push({h:pic(),say:'Chọn dấu đúng nhé.',dur:0,mcq:signQ('Số có nhiều chữ số hơn thì lớn hơn.')})}
 else{let p=n-1;for(;p>=0;p--){if(dA[p]===dB[p]){st[p]='eq';F.push({h:pic()+gdEq(`${fmt(A)} … ${fmt(B)}`),say:`Hàng ${GD_PL[p]}: cùng là ${dA[p]}, bằng nhau. So tiếp hàng bên phải.`,dur:2600})}else break}
  if(p<0){F.push({h:pic(),say:'Các hàng đều bằng nhau, nên hai số bằng nhau.',dur:0,mcq:signQ('Hai số giống hệt nhau.')})}
  else{st[p]='hl';const big=dA[p]>dB[p]?dA[p]:dB[p];
   F.push({h:pic()+gdEq(`${fmt(A)} … ${fmt(B)}`),say:`Hàng ${GD_PL[p]}: ${dA[p]} và ${dB[p]}. Số nào lớn hơn?`,dur:0,mcq:{q:`Hàng ${GD_PL[p]}: số nào lớn hơn?`,opts:[String(dA[p]),String(dB[p])],a:String(big),ok:`Đúng rồi, ${big} lớn hơn.`,hint:'So hai chữ số trong cột đang sáng vàng.',grid:2}});
   F.push({h:pic(),say:`Hàng ${GD_PL[p]} của ${fmt(A>B?A:B)} lớn hơn, nên ${fmt(A>B?A:B)} lớn hơn. Chọn dấu nào?`,dur:0,mcq:signQ('Đầu nhọn của dấu chỉ vào số bé hơn.')})}}
 F.push({h:pic()+gdEq(`${fmt(A)} <em>${sign}</em> ${fmt(B)}`),say:sign==='='?`${A} bằng ${B}.`:`${fmt(A)} ${sign==='>'?'lớn hơn':'bé hơn'} ${fmt(B)}. Đầu nhọn của dấu luôn chỉ vào số bé hơn.`,dur:2800});return F}

/* ---------- bảng nhân, bảng chia ---------- */
function gdMulParse(q){const G=curG();if(G<2||G>3)return null;const t=gdTxt(q.q).replace(/^Biết .*?\.\s*Vậy\s*/,'');let m=t.match(/^\s*(\d+|☐)\s*([×:])\s*(\d+|☐)\s*=\s*(\d+|☐|\?)\s*$/);if(!m)return null;
 const v=x=>x==='☐'||x==='?'?null:+x;let x=v(m[1]),y=v(m[3]),z=v(m[4]),op=m[2],miss=x==null?'a':y==null?'b':'c';
 if(op==='×'){if(x==null)x=z/y;if(y==null)y=z/x;z=x*y;if(!(x<=10&&y<=10))return null;return{op,a:x,b:y,c:z,miss}}
 if(x==null)x=z*y;if(y==null)y=x/z;z=x/y;if(!Number.isInteger(z)||y>10||z>10)return null;return{op,a:x,b:y,c:z,miss}}
function gdRows(per,rows,total,hiRows){/* rows hàng, mỗi hàng per viên kẹo; nhãn đếm thêm cuối hàng */const C=['#FCB40C','#F26249','#1E9A52','#0079C1','#8656A8'],sz=per>6||rows>6?10:13;
 let h=`<div class="gdmul" style="--gs:${sz}px">`;for(let r=0;r<rows;r++)h+=`<div class="gmr${hiRows&&r===rows-1?' new':''}">${Array.from({length:per},()=>`<i style="background:${C[r%5]}"></i>`).join('')}<b>${per*(r+1)}</b></div>`;
 return h+'</div>'}
function gdFramesMul(k){const F=[],{op,a,b,c,miss}=k;
 if(op==='×'){/* a × b: a được lấy b lần → b hàng, mỗi hàng a */const eq=miss==='c'?`${a} × ${b} = ?`:miss==='b'?`${a} × ☐ = ${c}`:`☐ × ${b} = ${c}`;
  if(miss==='a'){/* ☐ × b = c: b hàng bằng nhau, chia đều c cho b hàng */F.push({h:gdEq(eq),say:`Số nào được lấy ${b} lần thì bằng ${c}? Mình thử đếm thêm từng số nhé.`,dur:2600});
   for(let t=1;t<=a;t++)if(t===a||t>=a-2)F.push({h:gdRows(t,b,0,false)+gdEq(`${t} × ${b} = ${t*b}`),say:t===a?`${t} lấy ${b} lần bằng ${c}. Đúng rồi!`:`${t} lấy ${b} lần bằng ${t*b}, chưa đủ ${c}.`,dur:2400});
   F.push({h:gdRows(a,b,0,false)+gdEq(eq.replace('☐',`<em>${a}</em>`)),say:`Ô trống là ${a}, vì ${a} nhân ${b} bằng ${c}.`,dur:2600});return F}
  F.push({h:gdEq(eq),say:miss==='c'?`${a} nhân ${b} nghĩa là ${a} được lấy ${b} lần. Mỗi hàng ${a} viên kẹo, có ${b} hàng.`:`${a} được lấy mấy lần thì bằng ${c}? Mỗi hàng ${a} viên kẹo, xếp đến khi đủ ${c}.`,dur:3000});
  for(let r=1;r<=b;r++)F.push({h:gdRows(a,r,0,true)+gdEq(eq),say:`${a*r}`,dur:r===1?1400:900});
  F.push({h:gdRows(a,b,0,false)+gdEq(miss==='c'?`${a} × ${b} = <em>${c}</em>`:eq.replace('☐',`<em>${b}</em>`)),say:miss==='c'?`Đếm thêm ${a}: ${Array.from({length:b},(_,i)=>a*(i+1)).join(', ')}. ${a} nhân ${b} bằng ${c}.`:`Có ${b} hàng thì đủ ${c}. Ô trống là ${b}.`,dur:3200});return F}
 /* phép chia a : b = c → a viên chia thành các hàng b viên; đếm số hàng */const eq=miss==='c'?`${a} : ${b} = ?`:miss==='b'?`${a} : ☐ = ${c}`:`☐ : ${b} = ${c}`;
 if(miss==='b'){/* a : ☐ = c → mỗi hàng c viên, có mấy hàng? */F.push({h:gdEq(eq),say:`${a} chia cho mấy thì được ${c}? Xếp ${a} viên kẹo thành các hàng, mỗi hàng ${c} viên. Có mấy hàng?`,dur:3200});
  for(let r=1;r<=b;r++)F.push({h:gdRows(c,r,0,true)+gdEq(eq),say:`${c*r}`,dur:r===1?1400:900});
  F.push({h:gdRows(c,b,0,false)+gdEq(eq.replace('☐',`<em>${b}</em>`)),say:`Được ${b} hàng. Ô trống là ${b}, vì ${c} nhân ${b} bằng ${a}.`,dur:3000});return F}
 if(miss==='a'){F.push({h:gdEq(eq),say:`Số nào chia ${b} được ${c}? Có ${c} hàng, mỗi hàng ${b} viên. Tất cả có mấy viên?`,dur:3000});
  for(let r=1;r<=c;r++)F.push({h:gdRows(b,r,0,true)+gdEq(eq),say:`${b*r}`,dur:r===1?1400:900});
  F.push({h:gdRows(b,c,0,false)+gdEq(eq.replace('☐',`<em>${a}</em>`)),say:`Tất cả ${a} viên. Ô trống là ${a}, vì ${b} nhân ${c} bằng ${a}.`,dur:3000});return F}
 F.push({h:gdEq(eq),say:`${a} chia ${b}: xếp ${a} viên kẹo thành các hàng, mỗi hàng ${b} viên. Được mấy hàng?`,dur:3000});
 for(let r=1;r<=c;r++)F.push({h:gdRows(b,r,0,true)+gdEq(eq),say:`${b*r}`,dur:r===1?1400:900});
 F.push({h:gdRows(b,c,0,false)+gdEq(`${a} : ${b} = <em>${c}</em>`),say:`Được ${c} hàng. ${a} chia ${b} bằng ${c}, vì ${b} nhân ${c} bằng ${a}.`,dur:3200});return F}

GD_EXT.push({t:'col',on:false,kind:gdColParse,frames:gdFramesCol},{t:'cmp',on:false,kind:gdCmpParse,frames:gdFramesCmp},{t:'mul',on:false,kind:gdMulParse,frames:gdFramesMul});

document.head.insertAdjacentHTML('beforeend',`<style>
.gcol,.gcmp{display:inline-flex;flex-direction:column;gap:2px;font-family:var(--f-display);color:#1F2A5A;background:#fff;padding:6px 10px 8px;box-shadow:0 0 0 3px #1F2A5A}
.gcr{display:flex;align-items:center;gap:2px}.gcr i{width:34px;height:36px;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:34px;line-height:1;position:relative}
.gco{width:22px;font-weight:400;font-size:30px;text-align:center}
.gch i{height:18px;font-size:16px;color:#5E6B8C;font-family:var(--f-body);font-weight:700}
.gcc i{height:20px;font-size:22px;color:#E0441A}
.gcr i.hl{background:#FFF0B8;box-shadow:inset 0 0 0 2px #FCB40C}
.gcl{height:3px;background:#1F2A5A;margin:2px 0 2px 24px}
.gcres i{color:#E0441A}
.gcb{position:absolute;right:-5px;top:-3px;font-size:20px;color:#E0441A;line-height:1;font-family:var(--f-display)}
.gcmp .gco{width:auto;min-width:70px;padding-right:8px;text-align:right;font-size:24px;font-family:var(--f-display)}
.gcmp i{background:#F4F6FB;box-shadow:inset 0 0 0 2px #C9D1E6}.gcmp .gch i{background:none;box-shadow:none}
.gcmp i.eq{background:#E3F7EA;box-shadow:inset 0 0 0 2px #1E9A52}.gcmp i.hl{background:#FFF0B8;box-shadow:inset 0 0 0 3px #FCB40C}
.gdrods{display:flex;gap:18px;justify-content:center;align-items:flex-end;flex-wrap:wrap}
.gdrodw{display:flex;flex-direction:column;align-items:center;gap:4px}.gdrodw>b{font-family:var(--f-body);font-size:12px;font-weight:700;color:#1F2A5A}.gdrod{display:flex;gap:3px;align-items:flex-end}.gdrod i.r{width:8px;height:60px;display:block;background:repeating-linear-gradient(#0079C1 0 5px,#3FA0DD 5px 6px);box-shadow:0 0 0 2px #1F2A5A}
.gdu{display:grid;grid-template-columns:repeat(3,8px);gap:3px;margin-left:4px}.gdu i{width:8px;height:8px;display:block;background:#FCB40C;box-shadow:0 0 0 2px #1F2A5A}
.gdmul{display:flex;flex-direction:column;gap:4px;align-items:flex-start;background:#fff;padding:6px 8px;box-shadow:0 0 0 3px #1F2A5A}
.gmr{display:flex;gap:5px;align-items:center}.gmr i{width:var(--gs);height:var(--gs);display:block;box-shadow:0 0 0 2px #1F2A5A}
.gmr b{font-family:var(--f-display);font-weight:400;font-size:20px;line-height:1;margin-left:8px;color:#1F2A5A}
.gmr.new{animation:gdpop2 .3s steps(3)}.gmr.new b{color:#E0441A}
@keyframes gdpop2{from{transform:translateX(-12px);opacity:.3}to{transform:none;opacity:1}}
.gdopts.c3 button{font-size:30px}
</style>`);
