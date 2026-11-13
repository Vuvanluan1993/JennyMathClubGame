/* 91 — Trang vở lớp 3: Tự luyện đủ 81 bài (thầy gửi VBT Toán 3 tập 1, 2 ngày 13/11/2026)
   Cùng kiểu trang đã duyệt (vof điền ô · voc chọn · von nối · vok kéo thẻ), mỗi bài 3 bài kiểu vở + 2 câu đảo + ★.
   Dạng bài theo vở lớp 3 (viết lại lời, số mới mỗi lần, hình tự vẽ):
     bảng nhân/chia 2–9 · tìm thành phần · gấp lên / giảm đi một số lần (bảng) · so sánh số lớn gấp mấy lần số bé · một phần mấy
     · nhân, chia số có 2–5 chữ số với số có một chữ số (đặt tính nhân dọc; chia ghi thương và số dư) · biểu thức số
     · bài toán hai bước · mm, g, ml, °C (nhiệt kế) · trung điểm, hình tròn (bán kính – đường kính), góc vuông
     · chu vi, diện tích (đếm ô cm², công thức hình chữ nhật, hình vuông) · số đến 10 000 và 100 000 (đọc, viết thành tổng,
     so sánh, xếp thứ tự, làm tròn) · chữ số La Mã · xem đồng hồ (phút), tháng – năm, tiền · bảng số liệu, khả năng xảy ra.
   Bài luyện tập chung, ôn tập: lấy trang các bài trước. Mỗi câu có vchk() tự kiểm đáp án. */
(function(){
const V=window.VO;if(!V||!V.gen)return;
const {T,RR,mkQ,LB,SP,SIGN,sgn,distinct,svg,COL,gen,lab,OPS,SH,uniq,tinh,datTinh,noiKQ,thieu,dau,signSet,form,chon,xep,day,bangTP,gioPhut,soNgayThang,tienQ,khaNang,bieuDo,doanThang,duongGK,demTuGiac,tenKhoi4,need,needC,HINTN,NV,NG,noiQ}=V;
const M='−',X='×',D=':';
/* ---------- sinh phép tính ---------- */
const nhanBang=k=>{const b=RR(1,10);return{a:k,b,op:'x',r:k*b}},chiaBang=k=>{const q=RR(1,10);return{a:k*q,b:k,op:':',r:q}};
const nhanSo=(lo,hi,mx)=>{for(let t=0;t<300;t++){const a=RR(lo,hi),b=RR(2,9);if(a*b<=(mx||99999))return{a,b,op:'x',r:a*b}}return{a:lo,b:2,op:'x',r:lo*2}};
const congSo=(lo,hi,op)=>{for(let t=0;t<300;t++){let a=RR(lo,hi),b=RR(Math.floor(lo/10),hi);if(op==='-'&&a<b){const z=a;a=b;b=z}const r=OPS[op](a,b);if(r>0&&r<=hi*1.2&&r<100000)return{a,b,op,r}}return{a:lo+1,b:1,op,r:op==='+'?lo+2:lo}};
/* ---------- hình mới ---------- */
function phan(k,kind,c){const f=COL[c%COL.length];let b='';
 if(kind==='bar'){const w=96,h=22;for(let i=0;i<k;i++)b+=`<rect x="${2+i*w/k}" y="2" width="${w/k}" height="${h}" fill="${i===0?f:'#fff'}" stroke="#1F2A5A" stroke-width="2"/>`;return svg(w+4,h+4,b,`1/${k}`)}
 const r=22,cx=25,cy=25;for(let i=0;i<k;i++){const a0=i*2*Math.PI/k-Math.PI/2,a1=(i+1)*2*Math.PI/k-Math.PI/2;b+=`<path d="M${cx} ${cy} L${cx+r*Math.cos(a0)} ${cy+r*Math.sin(a0)} A${r} ${r} 0 0 1 ${cx+r*Math.cos(a1)} ${cy+r*Math.sin(a1)} Z" fill="${i===0?f:'#fff'}" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/>`}
 return svg(50,50,b,`1/${k}`)}
const frac=k=>`<span class="vofr"><i>1</i><i>${k}</i></span>`;
function nhietKe(t){const H=90,y=v=>80-v*1.6;let b=`<rect x="14" y="4" width="12" height="78" rx="6" fill="#fff" stroke="#1F2A5A" stroke-width="2"/><circle cx="20" cy="84" r="8" fill="#F04A1B" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/><rect x="17" y="${y(t)}" width="6" height="${84-y(t)}" fill="#F04A1B"/>`;
 for(let v=0;v<=45;v+=5)b+=`<line x1="26" y1="${y(v)}" x2="${v%10?30:33}" y2="${y(v)}" stroke="#1F2A5A" stroke-width="1.5"/>`+(v%10?'':`<text x="35" y="${y(v)+4}" font-family="VT323,monospace" font-size="12" fill="#1F2A5A">${v}</text>`);
 return svg(52,H+4,b,`${t} °C`)}
function chuNhat(a,b2,sq){const s=sq?Math.min(70,a*7):Math.min(110,a*9),h=sq?s:Math.min(60,b2*9);const W=s+82,Hh=h+30;
 return svg(W,Hh,`<rect x="22" y="6" width="${s}" height="${h}" fill="#DDF3FB" stroke="#1F2A5A" stroke-width="2"/><text x="${22+s/2}" y="${h+22}" text-anchor="middle" font-family="VT323,monospace" font-size="15" fill="#F04A1B">${a} cm</text>`+(sq?'':`<text x="${26+s}" y="${6+h/2+4}" font-family="VT323,monospace" font-size="15" fill="#F04A1B">${b2} cm</text>`),'')}
function tamGiac(a,b2,c){return svg(130,74,`<polygon points="10,64 120,64 50,8" fill="#FFF4D6" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/><text x="65" y="74" text-anchor="middle" font-family="VT323,monospace" font-size="14" fill="#F04A1B">${a} cm</text><text x="18" y="34" font-family="VT323,monospace" font-size="14" fill="#F04A1B">${b2} cm</text><text x="88" y="34" font-family="VT323,monospace" font-size="14" fill="#F04A1B">${c} cm</text>`,'')}
function oVuong(cells){const u=14,W=Math.max(...cells.map(c=>c[0]))+1,H=Math.max(...cells.map(c=>c[1]))+1;let b='';for(let i=0;i<=W;i++)for(let j=0;j<=H;j++){}
 for(let x=0;x<=W;x++)b+=`<line x1="${2+x*u}" y1="2" x2="${2+x*u}" y2="${2+H*u}" stroke="#c9d6ea"/>`;for(let y=0;y<=H;y++)b+=`<line x1="2" y1="${2+y*u}" x2="${2+W*u}" y2="${2+y*u}" stroke="#c9d6ea"/>`;
 cells.forEach(([x,y])=>b+=`<rect x="${2+x*u}" y="${2+y*u}" width="${u}" height="${u}" fill="#2AB563" stroke="#1F2A5A" stroke-width="1"/>`);return svg(W*u+4,H*u+4,b,'')}
function goc(vuong,rot,c){const a=vuong?90:pick([50,65,120,140]),L=28,r=rot*Math.PI/180,x0=8,y0=34,x1=x0+L*Math.cos(-r),y1=y0+L*Math.sin(-r),x2=x0+L*Math.cos(-(r+a*Math.PI/180)),y2=y0+L*Math.sin(-(r+a*Math.PI/180));
 const W=46,H=40,sx=Math.min(0,x1,x2),sy=Math.min(0,y1,y2);const tx=-sx+4,ty=-sy+4;return svg(W,H+8,`<g transform="translate(${tx/2},${ty/3})"><polyline points="${x1},${y1} ${x0},${y0} ${x2},${y2}" fill="none" stroke="${COL[c%COL.length]}" stroke-width="3" shape-rendering="auto"/><circle cx="${x0}" cy="${y0}" r="2.5" fill="#1F2A5A"/></g>`,'')}
function tron(r,showD){return svg(70,70,`<circle cx="35" cy="35" r="30" fill="#FFF4D6" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/><circle cx="35" cy="35" r="2.5" fill="#1F2A5A"/><text x="38" y="32" font-family="VT323,monospace" font-size="13" fill="#1F2A5A">O</text>`+(showD?`<line x1="5" y1="35" x2="65" y2="35" stroke="#F04A1B" stroke-width="2"/><text x="35" y="50" text-anchor="middle" font-family="VT323,monospace" font-size="13" fill="#F04A1B">${r*2} cm</text>`:`<line x1="35" y1="35" x2="65" y2="35" stroke="#0079C1" stroke-width="2"/><text x="50" y="50" text-anchor="middle" font-family="VT323,monospace" font-size="13" fill="#0079C1">${r} cm</text>`),'')}
function bangSL(names,vals,head){const w=56,cw=34;let b=`<rect x="1" y="1" width="${w}" height="20" fill="#E3E7F0" stroke="#1F2A5A" stroke-width="1.5"/><rect x="1" y="21" width="${w}" height="20" fill="#E3E7F0" stroke="#1F2A5A" stroke-width="1.5"/><text x="5" y="15" font-family="Be Vietnam Pro" font-size="9" font-weight="700" fill="#1F2A5A">${head[0]}</text><text x="5" y="35" font-family="Be Vietnam Pro" font-size="9" font-weight="700" fill="#1F2A5A">${head[1]}</text>`;
 names.forEach((n,i)=>{const x=1+w+i*cw;b+=`<rect x="${x}" y="1" width="${cw}" height="20" fill="#fff" stroke="#1F2A5A" stroke-width="1.5"/><rect x="${x}" y="21" width="${cw}" height="20" fill="#fff" stroke="#1F2A5A" stroke-width="1.5"/><text x="${x+cw/2}" y="15" text-anchor="middle" font-family="Be Vietnam Pro" font-size="9" fill="#1F2A5A">${n}</text><text x="${x+cw/2}" y="36" text-anchor="middle" font-family="VT323,monospace" font-size="15" fill="#1F2A5A">${vals[i]}</text>`});
 return svg(w+names.length*cw+3,43,b,'')}
{const _x=V.tokX;V.tokX=function(t,cell,q){if(!t||typeof t!=='object')return _x(t,cell,q);
 if(t.ph)return`<span class="vosh">${phan(...t.ph)}</span>`;
 if(t.fr)return frac(t.fr);
 if(t.nk!==undefined)return`<span class="vosh">${nhietKe(t.nk)}</span>`;
 if(t.cn)return`<span class="vosh">${chuNhat(...t.cn)}</span>`;
 if(t.tg)return`<span class="vosh">${tamGiac(...t.tg)}</span>`;
 if(t.ov)return`<span class="vosh">${oVuong(t.ov)}</span>`;
 if(t.goc)return`<span class="vosh">${goc(...t.goc)}</span>`;
 if(t.tron)return`<span class="vosh">${tron(...t.tron)}</span>`;
 if(t.bsl)return`<span class="vosh">${bangSL(...t.bsl)}</span>`;
 return _x(t,cell,q)}}
/* ---------- đọc số đến 100 000 ---------- */
const W1=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
function d2(n,linh){if(n===0)return'';if(n<10)return(linh?'linh ':'')+W1[n];if(n===10)return'mười';const t=Math.floor(n/10),u=n%10;if(t===1)return'mười'+(u?' '+(u===5?'lăm':W1[u]):'');return W1[t]+' mươi'+(u===0?'':' '+(u===1?'mốt':u===4?'tư':u===5?'lăm':W1[u]))}
function d3(n,full){if(n===0)return'';const h=Math.floor(n/100),r=n%100;if(!full&&h===0)return d2(r);return W1[h]+' trăm'+(r?' '+d2(r,true):'')}
function doc5(n){if(n===100000)return'một trăm nghìn';const ng=Math.floor(n/1000),r=n%1000;if(!ng)return d3(r);return d2(ng)+' nghìn'+(r?' '+d3(r,true):'')}
const EN1=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],ENT=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const e2=n=>n<20?EN1[n]:ENT[Math.floor(n/10)]+(n%10?'-'+EN1[n%10]:''),e3=n=>n<100?e2(n):EN1[Math.floor(n/100)]+' hundred'+(n%100?' and '+e2(n%100):''),e5=n=>n===100000?'one hundred thousand':n<1000?e3(n):e3(Math.floor(n/1000))+' thousand'+(n%1000?(n%1000<100?' and ':' ')+e3(n%1000):'');
const read5=n=>T(doc5(n),e5(n));
/* ---------- dạng bài ---------- */
const bangK=k=>[tinh(uniq(()=>Math.random()<.5?nhanBang(k):chiaBang(k),6),`Vở: bảng nhân ${k}, bảng chia ${k}`,1),noiKQ(uniq(()=>Math.random()<.5?nhanBang(k):chiaBang(k),3)),thieu([nhanBang(k),chiaBang(k),nhanBang(k),chiaBang(k)])];
function timTP(kind){const rows=[],a=[],E=[];for(let i=0;i<4;i++){let e,w;
  if(kind==='cong'){e=congSo(10,999,i%2?'-':'+');w=i%3}else{const k=RR(2,9);e=i%2?chiaBang(k):nhanBang(k);w=i%3}
  const o=SH[e.op];let t;if(w===0){t=[{b:1},{x:`${o} ${e.b} = ${e.r}`}];a.push(e.a)}else if(w===1){t=[{x:`${e.a} ${o}`},{b:1},{x:`= ${e.r}`}];a.push(e.b)}else{t=[{b:1},{x:`${o} ${e.b} = ${e.r}`}];a.push(e.a)}
  rows.push({lb:LB[i],t});E.push({e,w})}
 return form(kind==='cong'?'Vở: tìm thành phần phép cộng, phép trừ':'Vở: tìm thành phần phép nhân, phép chia',rows,a,T('<b>Tìm</b> số còn thiếu.','<b>Find</b> the missing number.'),kind==='cong'?T('Muốn tìm số hạng, lấy tổng trừ số hạng kia. Muốn tìm số bị trừ, lấy hiệu cộng số trừ.','To find a missing addend, subtract. To find the number subtracted from, add.'):T('Muốn tìm thừa số, lấy tích chia cho thừa số kia. Muốn tìm số bị chia, lấy thương nhân số chia.','To find a missing factor, divide. To find the dividend, multiply.'),q=>q.E.every((x,i)=>q.a[i]===(x.w===1?x.e.b:x.e.a)),{E})}
function gapGiam(){const k=RR(2,9),gap=Math.random()<.5,ns=distinct(4,2,gap?11:10).map(n=>gap?n:n*k);const H=gap?[T('Số đã cho','Number'),T(`Gấp lên ${k} lần`,`× ${k}`)]:[T('Số đã cho','Number'),T(`Giảm đi ${k} lần`,`÷ ${k}`)];
 const R=ns.map(n=>gap?n*k:n/k);const rows=[{t:[{w:H[0]}].concat(ns.map(n=>({n})))},{t:[{w:H[1]}].concat(R.map((r,j)=>j===0?{n:r}:{b:1}))}];
 return form(gap?'Vở: gấp lên một số lần':'Vở: giảm đi một số lần',rows,R.slice(1),gap?T(`<b>Số?</b> Gấp lên ${k} lần (cột đầu là mẫu).`,`<b>Missing number?</b> Multiply by ${k} (the first column is the example).`):T(`<b>Số?</b> Giảm đi ${k} lần (cột đầu là mẫu).`,`<b>Missing number?</b> Divide by ${k} (the first column is the example).`),gap?T('Gấp lên một số lần, em lấy số đó nhân với số lần.','To make a number several times bigger, multiply.'):T('Giảm đi một số lần, em lấy số đó chia cho số lần.','To make a number several times smaller, divide.'),q=>q.a.every((v,i)=>v===R[i+1]),{tbl:1})}
function gapMay(){const rows=[],a=[],P=[];for(let i=0;i<4;i++){const s=RR(2,9),k=RR(2,9);P.push([s*k,s]);rows.push({lb:LB[i],t:[{w:T(`Số lớn ${s*k}, số bé ${s}. Số lớn gấp`,`${s*k} is`)},{b:1},{w:T('lần số bé.',`times ${s}.`)}]});a.push(k)}
 return form('Vở: số lớn gấp mấy lần số bé',rows,a,T('Số lớn <b>gấp mấy lần</b> số bé?','How many <b>times</b> bigger?'),T('Muốn biết số lớn gấp mấy lần số bé, em lấy số lớn chia cho số bé.','Divide the bigger number by the smaller one.'),q=>q.a.every((v,i)=>v===P[i][0]/P[i][1]),{P})}
function motPhan(){const ks=[2,3,4,5,6,8,9],rows=[],a=[],K=[];let mau;for(let i=0;i<4;i++){const k=pick(ks),kind=pick(['bar','pie']);K.push(k);const t=[{ph:[k,kind,i]},{w:T('Đã tô màu','Shaded:')},i?{b:1}:{mc:ks.indexOf(k)},{w:T('hình','of the shape')}];if(i){rows.push({lb:LB[i-1],t});a.push(ks.indexOf(k))}else mau=t}
 return chon('Vở: một phần mấy',ks.map(frac),rows,a,T('Đã tô màu <b>một phần mấy</b> mỗi hình?','What <b>fraction</b> of each shape is shaded?'),T('Hình được chia thành mấy phần bằng nhau, tô một phần thì đã tô một phần mấy.','Count the equal parts. One part shaded is one of that many.'),q=>q.K.slice(1).every((k,i)=>ks[q.a[i]]===k),mau,{raw:1,K})}
function chiaDu(lo,hi){const rows=[],a=[],E=[];for(let i=0;i<4;i++){const b=RR(2,9);let n=RR(lo,hi);if(i===0)n=n-n%b;else if(n%b===0)n++;E.push([n,b]);rows.push({lb:LB[i],t:[{x:`${n} : ${b} =`},{b:1},{w:T('dư','r')},{b:1}]});a.push(Math.floor(n/b),n%b)}
 return form('Vở: phép chia hết, chia có dư',rows,a,T('<b>Tính</b> (ghi thương và số dư; chia hết thì số dư là 0).','<b>Work out</b> the quotient and remainder (0 if it divides exactly).'),T('Số dư luôn bé hơn số chia.','The remainder is always smaller than the divisor.'),q=>q.E.every(([n,b],i)=>q.a[2*i]*b+q.a[2*i+1]===n&&q.a[2*i+1]<b),{E})}
function bieuThuc(level){const L=[];for(let i=0;i<4;i++){let s,v;const a=RR(10,99),b=RR(2,9),c=RR(2,9);
  const k=level?i%4:i%2;if(k===0){s=`${a} + ${b} ${X} ${c}`;v=a+b*c}else if(k===1){const p=b*c*RR(1,3);s=`${a+p} ${M} ${p} : ${c}`;v=a+p-p/c}else if(k===2){s=`(${a} ${M} ${b}) ${X} ${c}`;v=(a-b)*c;if(v>999){s=`(${a} + ${b}) ${M} ${c}`;v=a+b-c}}else{const q=RR(2,9);s=`(${q*c} + ${q*c*2}) : ${c}`;v=3*q}L.push([s,v])}
 return form('Vở: tính giá trị biểu thức',L.map(([s],i)=>({lb:LB[i],t:[{x:s+' ='},{b:1}]})),L.map(l=>l[1]),T('Tính <b>giá trị</b> của biểu thức.','Work out the <b>value</b> of each expression.'),T('Có ngoặc thì tính trong ngoặc trước. Không có ngoặc thì nhân, chia trước; cộng, trừ sau.','Brackets first. Then multiply and divide before adding and subtracting.'),q=>q.a.every((v,i)=>v===L[i][1]),{L})}
function haiBuoc(){const P=[];for(let i=0;i<3;i++){const [v,ve]=pick(NV),A=pick(NG);const k=i%3;let t,r,u=v.split(' ')[0];
  if(k===0){const x=RR(10,40),y=RR(2,9);t=T(`Thùng thứ nhất có ${x} ${v}, thùng thứ hai có nhiều hơn ${y} ${v}. Cả hai thùng có bao nhiêu ${v}?`,`Box 1 has ${x} ${ve}. Box 2 has ${y} more. How many altogether?`);r=2*x+y}
  else if(k===1){const x=RR(3,9),y=RR(2,5);t=T(`${A} có ${x} ${v}, bạn có gấp ${y} lần số đó. Cả hai bạn có bao nhiêu ${v}?`,`${A} has ${x} ${ve}. A friend has ${y} times as many. How many altogether?`);r=x+x*y}
  else{const g=RR(3,6),n=RR(4,9),c=RR(2,g*n-2);t=T(`Có ${g} hộp, mỗi hộp ${n} ${v}. Đã dùng ${c} ${v}. Còn lại bao nhiêu ${v}?`,`${g} boxes with ${n} ${ve} each. ${c} were used. How many are left?`);r=g*n-c}
  P.push({t,r,u})}
 return form('Vở: bài toán giải bằng hai bước tính',P.map((p,i)=>({lb:LB[i],t:[{w:p.t},{br:1},{w:T('Đáp số:','Answer:')},{b:1},{w:p.u}]})),P.map(p=>p.r),T('<b>Giải</b> bài toán (hai bước tính), viết đáp số.','<b>Solve</b> each two-step problem and write the answer.'),T('Em tìm kết quả bước một trước, rồi dùng nó để tính bước hai.','Find the first step, then use it for the second step.'),q=>q.a.every((v,i)=>v===P[i].r),{P})}
function doiDV(pairs,title){const rows=[],a=[];pairs.forEach(([big,small,f,maxN],i)=>{const n=RR(1,maxN||9);if(i%2){rows.push({lb:LB[i],t:[{x:`${n*f} ${small} =`},{b:1},{x:big}]});a.push(n)}else{rows.push({lb:LB[i],t:[{x:`${n} ${big} =`},{b:1},{x:small}]});a.push(n*f)}});
 return form(title,rows,a,T('<b>Viết số</b> thích hợp.','<b>Write</b> the right number.'),T('Em nhớ mối liên hệ giữa các đơn vị đo.','Remember how the units are related.'),q=>q.a.length===pairs.length)}
function donVi3(u,lim){const L=[0,1,0,1].map(k=>gen({op:k?'-':'+',A:[1,lim],B:[1,lim],R:[1,lim*2]}));
 return form(`Vở: tính với ${u}`,L.map((e,i)=>({lb:LB[i],t:[{x:`${e.a} ${u} ${SH[e.op]} ${e.b} ${u} =`},{b:1},{x:u}]})),L.map(e=>e.r),T(`<b>Tính</b> (nhớ ghi đơn vị ${u}).`,`<b>Work out</b> (remember ${u}).`),T('Em tính rồi viết kết quả, nhớ đơn vị.','Work out each one, remember the unit.'),q=>q.a.every((v,i)=>v===L[i].r),{L})}
function nhietDo(){const tv=distinct(3,2,9).map(v=>v*5);return form('Vở: đọc nhiệt kế',[{t:tv.map(v=>({nk:v}))}].concat(tv.map((v,i)=>({lb:LB[i],t:[{w:T(`Nhiệt kế ${i+1} chỉ`,`Thermometer ${i+1} shows`)},{b:1},{w:'°C'}]}))),tv,T('Mỗi nhiệt kế chỉ <b>bao nhiêu độ C</b>?','What <b>temperature</b> does each show?'),T('Em đọc vạch ở đầu cột màu đỏ.','Read the mark at the top of the red column.'),q=>q.a.every((v,i)=>v===tv[i]),{tv})}
function trungDiem(){const rows=[],a=[];for(let i=0;i<3;i++){const L=RR(2,9)*2;rows.push({lb:LB[i],t:[{w:T(`Đoạn thẳng AB dài ${L} cm, M là trung điểm của AB. AM =`,`AB is ${L} cm long. M is its midpoint. AM =`)},{b:1},{w:'cm'}]});a.push(L/2)}
 const r=RR(2,9);rows.push({lb:'d)',t:[{w:T(`M là trung điểm của CD, CM = ${r} cm. CD =`,`M is the midpoint of CD, CM = ${r} cm. CD =`)},{b:1},{w:'cm'}]});a.push(2*r);
 return form('Vở: trung điểm của đoạn thẳng',rows,a,T('<b>Viết số</b> thích hợp.','<b>Write</b> the right number.'),T('Trung điểm chia đoạn thẳng thành hai phần bằng nhau.','The midpoint splits a segment into two equal halves.'),q=>q.a.length===4)}
function hinhTron(){const R=distinct(3,2,9);const rows=R.map((r,i)=>i%2?{lb:LB[i],t:[{tron:[r,1]},{w:T('Đường kính','Diameter')+` ${2*r} cm. `+T('Bán kính','Radius')},{b:1},{w:'cm'}]}:{lb:LB[i],t:[{tron:[r,0]},{w:T('Bán kính','Radius')+` ${r} cm. `+T('Đường kính','Diameter')},{b:1},{w:'cm'}]});
 return form('Vở: bán kính, đường kính',rows,R.map((r,i)=>i%2?r:2*r),T('<b>Viết số</b> thích hợp.','<b>Write</b> the right number.'),T('Đường kính dài gấp đôi bán kính.','The diameter is twice the radius.'),q=>q.a.every((v,i)=>v===(i%2?R[i]:2*R[i])),{R})}
function gocVuong(){const rows=[],a=[],P=[];for(let i=0;i<4;i++){const v=i<2?i%2===0:Math.random()<.5,rot=pick([0,20,45,70]);P.push(v);rows.push({lb:LB[i],t:[{goc:[v,rot,i]},{b:1}]});a.push(v?0:1)}
 const ord=shuf([0,1,2,3]);const R2=ord.map(k=>rows[k]),A2=ord.map(k=>a[k]);R2.forEach((r,i)=>r.lb=LB[i]);const P2=ord.map(k=>P[k]);
 return chon('Vở: góc vuông, góc không vuông',[T('góc vuông','right angle'),T('góc không vuông','not a right angle')],R2,A2,T('Góc nào là <b>góc vuông</b>?','Which are <b>right angles</b>?'),T('Góc vuông giống góc của quyển vở. Em có thể dùng ê ke để kiểm tra.','A right angle is like the corner of a book.'),q=>q.P2.every((v,i)=>q.a[i]===(v?0:1)),null,{c2:1,P2})}
function chuVi(){const rows=[],a=[];for(let i=0;i<3;i++){const k=i%3;if(k===0){const x=RR(4,12),y=RR(2,x-1);rows.push({lb:LB[i],t:[{cn:[x,y]},{w:T('Chu vi hình chữ nhật:','Perimeter:')},{b:1},{w:'cm'}]});a.push(2*(x+y))}
  else if(k===1){const x=RR(2,9);rows.push({lb:LB[i],t:[{cn:[x,x,1]},{w:T('Chu vi hình vuông:','Perimeter:')},{b:1},{w:'cm'}]});a.push(4*x)}
  else{const x=RR(5,9),y=RR(3,7),z=RR(3,7);rows.push({lb:LB[i],t:[{tg:[x,y,z]},{w:T('Chu vi hình tam giác:','Perimeter:')},{b:1},{w:'cm'}]});a.push(x+y+z)}}
 return form('Vở: chu vi',rows,a,T('Tính <b>chu vi</b> mỗi hình.','Find the <b>perimeter</b> of each shape.'),T('Chu vi là tổng độ dài các cạnh. Hình chữ nhật: (dài + rộng) × 2. Hình vuông: cạnh × 4.','The perimeter is the total length of the sides.'),q=>q.a.length===3)}
function dienTichO(){const rows=[],a=[];for(let i=0;i<3;i++){const W=RR(2,5),H=RR(2,4);let cells=[];for(let x=0;x<W;x++)for(let y=0;y<H;y++)cells.push([x,y]);if(i)cells=cells.filter((c,j)=>j!==RR(0,cells.length-1)||Math.random()<.3);rows.push({lb:LB[i],t:[{ov:cells},{w:T('Diện tích:','Area:')},{b:1},{w:'cm²'}]});a.push(cells.length)}
 return form('Vở: diện tích (đếm ô vuông)',rows,a,T('Mỗi ô vuông là 1 cm². Tính <b>diện tích</b> mỗi hình.','Each square is 1 cm². Find the <b>area</b>.'),T('Em đếm số ô vuông màu xanh.','Count the green squares.'),q=>q.rows2.every((r,i)=>r.t[0].ov.length===q.a[i]))}
function dienTich(){const rows=[],a=[];for(let i=0;i<3;i++){if(i<2){const x=RR(4,12),y=RR(2,x-1);rows.push({lb:LB[i],t:[{cn:[x,y]},{w:T('Diện tích:','Area:')},{b:1},{w:'cm²'}]});a.push(x*y)}else{const x=RR(2,9);rows.push({lb:LB[i],t:[{cn:[x,x,1]},{w:T('Diện tích:','Area:')},{b:1},{w:'cm²'}]});a.push(x*x)}}
 return form('Vở: diện tích hình chữ nhật, hình vuông',rows,a,T('Tính <b>diện tích</b> mỗi hình.','Find the <b>area</b> of each shape.'),T('Diện tích hình chữ nhật bằng dài nhân rộng. Diện tích hình vuông bằng cạnh nhân cạnh.','Area of a rectangle = length × width. Square = side × side.'),q=>q.a.length===3)}
/* số lớn */
const rnd=(lo,hi)=>RR(lo,hi);
function noiDoc5(lo,hi){const ns=distinct(3,lo,hi);return noiQ('Vở: nối số với cách đọc',ns.map(n=>[{n}]),ns.map(n=>[{e:read5(n)}]),ns,T('<b>Nối</b> mỗi số với cách đọc.','<b>Match</b> each number to its name.'),HINTN('Em nối mỗi số với cách đọc của nó.','Match each number to how it is read.'),q=>q.left.every((l,i)=>q.right[q.R.indexOf(i)][0].e===read5(l[0].n)))}
function vietTong5(lo,hi){const ns=[0,1,2].map(()=>rnd(lo,hi));const rows=[],a=[];const parts=n=>String(n).split('').map((d,i,s)=>+d*10**(s.length-1-i)).filter(v=>v>0);
 ns.forEach((n,i)=>{const p=parts(n);rows.push({lb:LB[i],t:[{x:`${n} =`}].concat(p.flatMap((v,j)=>j?[{x:'+'},{b:1}]:[{b:1}]))});a.push(...p)});
 return form('Vở: viết số thành tổng',rows,a,T('<b>Viết</b> số thành tổng (nghìn, trăm, chục, đơn vị).','<b>Write</b> each number as a sum of thousands, hundreds, tens and ones.'),T('Ví dụ: 4 526 bằng 4 000 cộng 500 cộng 20 cộng 6.','For example, 4526 = 4000 + 500 + 20 + 6.'),q=>{let k=0;return ns.every(n=>{const p=parts(n);return p.every(v=>q.a[k++]===v)})},{ns})}
const dauLon=(lo,hi)=>dau(signSet(5,w=>{const x=rnd(lo,hi);let y=w===2?x:x+(w===0?-1:1)*pick([1,10,100,1000,RR(1,9)*111]);y=Math.max(lo,Math.min(hi,y));return[x,x,y,y]}),'Vở: so sánh số');
function lamTron(hang){const H=hang==='chuc'?10:hang==='tram'?100:hang==='nghin'?1000:10000,ns=[0,1,2,3].map(()=>H>=1000?rnd(10000,99999):rnd(100,9999)),a=ns.map(n=>Math.round(n/H)*H);
 const name={chuc:T('hàng chục','the nearest ten'),tram:T('hàng trăm','the nearest hundred'),nghin:T('hàng nghìn','the nearest thousand'),cn:T('hàng chục nghìn','the nearest ten thousand')}[hang];
 return form('Vở: làm tròn số',ns.map((n,i)=>({lb:LB[i],t:[{x:`${n} ≈`},{b:1}]})),a,T(`Làm tròn số đến <b>${name}</b>.`,`Round to <b>${name}</b>.`),T('Chữ số ngay sau hàng cần làm tròn bé hơn 5 thì làm tròn xuống, từ 5 trở lên thì làm tròn lên.','If the next digit is less than 5, round down; 5 or more, round up.'),q=>ns.every((n,i)=>q.a[i]===Math.round(n/H)*H),{ns})}
const ROMA=n=>[['XX',20],['X',10],['IX',9],['V',5],['IV',4],['I',1]].reduce((s,[r,v])=>{while(n>=v){s+=r;n-=v}return s},'');
function laMa(){const ns=distinct(3,1,20);return noiQ('Vở: chữ số La Mã',ns.map(n=>[{e:ROMA(n)}]),ns.map(n=>[{n}]),ns,T('<b>Nối</b> số La Mã với số tương ứng.','<b>Match</b> each Roman numeral to its number.'),HINTN('Em nối mỗi số La Mã với số tương ứng. I là 1, V là 5, X là 10.','Match each Roman numeral. I is 1, V is 5, X is 10.'),q=>q.right.every((r,k)=>r[0].n===q.vals[q.R[k]]))}
function laMaViet(){const ns=distinct(4,1,20);return form('Vở: đọc số La Mã',ns.map((n,i)=>({lb:LB[i],t:[{x:ROMA(n)+' ='},{b:1}]})),ns,T('Viết số tương ứng với mỗi <b>số La Mã</b>.','Write the number for each <b>Roman numeral</b>.'),T('I là một, V là năm, X là mười. Chữ bé đứng trước chữ lớn thì trừ đi.','I is one, V is five, X is ten. A smaller one before a bigger one is taken away.'),q=>q.a.every((v,i)=>v===ns[i]),{ns})}
function gioPhut5(){const H=distinct(4,1,12),Mi=H.map(()=>RR(1,11)*5);const a=[];H.forEach((h,i)=>a.push(h,Mi[i]));
 return form('Vở: xem đồng hồ',H.map((h,i)=>({lb:LB[i],t:[{ck:[h,Mi[i]],z:50},{b:1},{w:T('giờ','h')},{b:1},{w:T('phút','min')}]})),a,T('Đồng hồ chỉ <b>mấy giờ, mấy phút</b>?','What <b>time</b> does each clock show?'),T('Kim dài chỉ số nào thì nhân số đó với 5 để ra số phút.','Multiply the number the long hand points to by 5 to get the minutes.'),q=>q.rows2.every((r,i)=>r.t[0].ck[0]===q.a[2*i]&&r.t[0].ck[1]===q.a[2*i+1]))}
function bangSoLieu(){const sp=['Lớp 3A','Lớp 3B','Lớp 3C','Lớp 3D'],v=distinct(4,15,40);const mx=v.indexOf(Math.max(...v)),mn=v.indexOf(Math.min(...v));
 return form('Vở: bảng số liệu',[{t:[{bsl:[['3A','3B','3C','3D'],v,[T('Lớp','Class'),T('Số cây','Trees')]]}]},{lb:'a)',t:[{w:T(`Lớp ${['3A','3B','3C','3D'][mx]} trồng được`,`Class ${['3A','3B','3C','3D'][mx]} planted`)},{b:1},{w:T('cây','trees')}]},{lb:'b)',t:[{w:T('Cả bốn lớp trồng được','All four classes planted')},{b:1},{w:T('cây','trees')}]},{lb:'c)',t:[{w:T('Lớp trồng nhiều nhất hơn lớp trồng ít nhất','Most minus fewest:')},{b:1},{w:T('cây','trees')}]}],
  [v[mx],v.reduce((s,x)=>s+x,0),v[mx]-v[mn]],T('Đọc <b>bảng số liệu</b> rồi viết số.','Read the <b>table</b> and write the numbers.'),T('Bảng cho biết số cây mỗi lớp trồng được.','The table shows how many trees each class planted.'),q=>q.a[1]===v.reduce((s,x)=>s+x,0),{v})}
const tienBig=()=>{const q=tienQ();return q};

/* ---------- trang theo bài ---------- */
const P=(b,i)=>PAGES[b]()[i];
const L41=()=>[tinh([nhanSo(11,99,999),{...chiaBang(RR(2,9))},nhanSo(100,999,9999),nhanSo(11,99,999)],'Vở: tính'),datTinh([nhanSo(100,999,9999),nhanSo(11,99,999)]),chiaDu(10,999)];
const PAGES={
 1:()=>[V.noiDoc?null:null,dau(signSet(7,w=>{const x=rnd(100,999),y=w===2?x:Math.max(100,Math.min(999,x+(w?1:-1)*RR(1,90)));return[x,x,y,y]}),'Vở: so sánh số',1),xep(100,999),day([1,10,100],100,1000,6)].filter(Boolean),
 2:()=>[tinh(uniq(()=>V.gen({op:pick(['+','-']),A:[100,900],B:[10,400],R:[10,999]}),6)),datTinh(uniq(()=>V.gen({op:pick(['+','-']),A:[100,900],B:[10,400],R:[100,999]}),3)),thieu(uniq(()=>V.gen({op:pick(['+','-']),A:[100,900],B:[10,400],R:[100,999]}),4))],
 3:()=>[timTP('cong'),bangTP('+'),bangTP('-')],
 4:()=>[tinh(uniq(()=>pick([nhanBang(2),nhanBang(5),chiaBang(2),chiaBang(5)]),6),'Vở: tính',1),noiKQ(uniq(()=>pick([nhanBang(2),nhanBang(5),chiaBang(2),chiaBang(5)]),3)),bangTP('x')],
 5:()=>bangK(3),6:()=>bangK(4),7:()=>[doiDV([['m','cm',100],['dm','cm',10],['km','m',1000,5],['m','dm',10]],'Vở: đổi đơn vị độ dài'),donVi3('kg',50),demTuGiac()],8:()=>[P(5,0),P(6,2),P(3,0)],
 9:()=>bangK(6),10:()=>bangK(7),11:()=>bangK(8),12:()=>bangK(9),13:()=>[timTP('nhan'),bangTP(':'),bangTP('x')],14:()=>[motPhan(),motPhan(),gapGiam()],15:()=>[P(12,0),P(13,0),P(14,0)],
 16:()=>[trungDiem(),doanThang(),duongGK()],17:()=>[hinhTron(),trungDiem(),hinhTron()],18:()=>[gocVuong(),demTuGiac(),gocVuong()],19:()=>[demTuGiac(),gocVuong(),chuVi()],20:()=>[gocVuong(),hinhTron(),demTuGiac()],21:()=>[tenKhoi4(),V.demKhoi4(),tenKhoi4()],22:()=>[P(17,0),P(18,0),P(16,0)],
 23:()=>[tinh(uniq(()=>nhanSo(11,49,999),6)),datTinh(uniq(()=>nhanSo(11,49,999),3)),noiKQ(uniq(()=>nhanSo(11,49,999),3))],24:()=>[gapGiam(),gapMay(),gapGiam()],25:()=>[chiaDu(10,99),chiaDu(10,99),thieu([chiaBang(RR(2,9)),nhanBang(RR(2,9)),chiaBang(RR(2,9)),nhanBang(RR(2,9))])],
 26:()=>[chiaDu(20,99),tinh(uniq(()=>{const b=RR(2,9),q=RR(11,40);return{a:b*q,b,op:':',r:q}},6)),chiaDu(20,99)],27:()=>[gapGiam(),gapMay(),gapGiam()],28:()=>[haiBuoc(),haiBuoc(),bieuThuc(0)],29:()=>[P(23,1),P(26,0),P(28,0)],
 30:()=>[doiDV([['cm','mm',10],['dm','mm',100],['m','mm',1000,3],['cm','mm',10]],'Vở: đổi đơn vị mi-li-mét'),donVi3('mm',90),doanThang()],31:()=>[doiDV([['kg','g',1000,5],['kg','g',1000,9],['kg','g',1000,3],['kg','g',1000,7]],'Vở: đổi ki-lô-gam, gam'),donVi3('g',500),dau(signSet(5,w=>{const x=RR(1,9)*100,y=w===2?x:RR(1,9)*100;return[`${x} g`,x,`${y} g`,y]}),'Vở: so sánh khối lượng')],
 32:()=>[doiDV([['l','ml',1000,5],['l','ml',1000,9],['l','ml',1000,3],['l','ml',1000,7]],'Vở: đổi lít, mi-li-lít'),donVi3('ml',500),dau(signSet(5,w=>{const x=RR(1,9)*100,y=w===2?x:RR(1,9)*100;return[`${x} ml`,x,`${y} ml`,y]}),'Vở: so sánh dung tích')],
 33:()=>[nhietDo(),nhietDo(),dau(signSet(5,w=>{const x=RR(10,40),y=w===2?x:RR(10,40);return[`${x} °C`,x,`${y} °C`,y]}),'Vở: so sánh nhiệt độ')],34:()=>[P(30,0),P(31,0),P(33,0)],35:()=>[P(32,1),P(31,1),P(33,0)],
 36:()=>[tinh(uniq(()=>nhanSo(100,333,999),4)),datTinh(uniq(()=>nhanSo(100,333,999),3)),noiKQ(uniq(()=>nhanSo(100,333,999),3))],37:()=>[chiaDu(100,999),tinh(uniq(()=>{const b=RR(2,9),q=RR(101,199);return{a:b*q,b,op:':',r:q}},4)),chiaDu(100,999)],
 38:()=>[bieuThuc(0),bieuThuc(1),bieuThuc(1)],39:()=>[gapMay(),gapMay(),gapGiam()],40:()=>[P(36,1),P(38,1),P(39,0)],
 41:()=>L41(),42:()=>[bieuThuc(1),bieuThuc(0),haiBuoc()],43:()=>[chuVi(),hinhTron(),nhietDo()],44:()=>[P(41,2),P(42,0),P(43,0)],
 45:()=>[noiDoc5(1000,10000),vietTong5(1001,9999),day([1,10,100,1000],1000,10000,6)],46:()=>[dauLon(1000,9999),xep(1000,9999),vietTong5(1001,9999)],47:()=>[laMa(),laMaViet(),laMa()],48:()=>[lamTron('chuc'),lamTron('tram'),lamTron('chuc')],49:()=>[P(45,0),P(46,0),P(48,1)],
 50:()=>[chuVi(),chuVi(),chuVi()],51:()=>[dienTichO(),dienTichO(),chuVi()],52:()=>[dienTich(),dienTich(),dienTichO()],53:()=>[P(50,0),P(52,0),P(51,0)],
 54:()=>[tinh(uniq(()=>congSo(1000,9000,'+'),4)),datTinh(uniq(()=>congSo(1000,8000,'+'),3)),thieu(uniq(()=>congSo(1000,8000,'+'),4))],55:()=>[tinh(uniq(()=>congSo(1000,9999,'-'),4)),datTinh(uniq(()=>congSo(1000,9999,'-'),3)),thieu(uniq(()=>congSo(1000,9999,'-'),4))],
 56:()=>[tinh(uniq(()=>nhanSo(1000,4999,9999),4)),datTinh(uniq(()=>nhanSo(1000,3333,9999),2)),noiKQ(uniq(()=>nhanSo(1000,3333,9999),3))],57:()=>[chiaDu(1000,9999),tinh(uniq(()=>{const b=RR(2,9),q=RR(1001,1999);return{a:b*q,b,op:':',r:q}},4)),chiaDu(1000,9999)],58:()=>[P(54,1),P(55,1),P(57,0)],
 59:()=>[noiDoc5(10000,99999),vietTong5(10001,99999),day([1,10,100,1000,10000],10000,99999,6)],60:()=>[dauLon(10000,99999),xep(10000,99999),vietTong5(10001,99999)],61:()=>[lamTron('nghin'),lamTron('cn'),lamTron('nghin')],62:()=>[P(59,0),P(60,0),P(61,0)],
 63:()=>[tinh(uniq(()=>congSo(10000,80000,'+'),4)),datTinh(uniq(()=>congSo(10000,80000,'+'),2)),thieu(uniq(()=>congSo(10000,80000,'+'),4))],64:()=>[tinh(uniq(()=>congSo(10000,99999,'-'),4)),datTinh(uniq(()=>congSo(10000,99999,'-'),2)),thieu(uniq(()=>congSo(10000,99999,'-'),4))],65:()=>[P(63,1),P(64,1),dauLon(10000,99999)],
 66:()=>[gioPhut5(),soNgayThang(),gioPhut5()],67:()=>[gioPhut5(),soNgayThang(),gioPhut()],68:()=>[tienQ(),tienQ(),donVi3('đồng',50000)],69:()=>[P(66,0),P(68,0),P(66,1)],
 70:()=>[tinh(uniq(()=>nhanSo(10000,33333,99999),4)),datTinh(uniq(()=>nhanSo(10000,24999,99999),2)),noiKQ(uniq(()=>nhanSo(10000,24999,99999),3))],71:()=>[chiaDu(10000,99999),tinh(uniq(()=>{const b=RR(2,9),q=RR(10001,11111);return{a:b*q,b,op:':',r:q}},4)),chiaDu(10000,99999)],72:()=>[P(70,1),P(71,0),P(42,0)],
 73:()=>[bangSoLieu(),bieuDo(),bangSoLieu()],74:()=>[khaNang(),khaNang(),bangSoLieu()],75:()=>[bangSoLieu(),khaNang(),bieuDo()],
 76:()=>[P(59,0),P(60,0),P(61,0)],77:()=>[P(63,0),P(64,1),P(65,2)],78:()=>[P(70,0),P(71,0),P(57,0)],79:()=>[P(52,0),P(50,0),P(43,2)],80:()=>[P(73,0),P(74,0),P(75,0)],81:()=>[P(77,0),P(78,2),P(79,0)]};
{const _p=window.voPage;window.voPage=function(x){if(curG()===3&&PAGES[x.b])return PAGES[x.b]().filter(Boolean);return _p(x)}}
document.head.insertAdjacentHTML('beforeend',`<style>
.vofr{display:inline-flex;flex-direction:column;align-items:center;line-height:1;font-family:var(--f-display);font-size:18px}.vofr i{font-style:normal;padding:0 3px}.vofr i:first-child{border-bottom:2px solid currentColor}
.voopt button .vofr{font-size:20px}
.voopt.w button{height:auto;min-height:48px;line-height:1.15;padding:3px 2px;font-size:13px}
.votc.vb1.nw{width:auto;min-width:34px;padding:0 4px}
.votc.ve.L{white-space:normal;height:auto;min-height:32px;max-width:150px;font-family:var(--f-body);font-size:11.5px;font-weight:600;line-height:1.2;padding:3px 6px;text-align:left}
</style>`);
})();
