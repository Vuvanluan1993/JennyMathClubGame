/* 92 — Trang vở lớp 4: Tự luyện đủ 73 bài (thầy gửi VBT Toán 4 tập 1, 2 ngày 13/11/2026)
   Cùng kiểu trang đã duyệt (vof điền ô · voc chọn · von nối · vok kéo thẻ), mỗi bài 3 bài kiểu vở + 2 câu đảo + ★.
   Dạng bài theo vở lớp 4 (viết lại lời, số mới mỗi lần, hình tự vẽ):
     số đến lớp triệu (đọc, hàng – lớp, giá trị chữ số, so sánh, làm tròn, dãy số tự nhiên) · chẵn – lẻ · biểu thức chứa chữ
     · bài toán ba bước, tổng – hiệu, trung bình cộng, rút về đơn vị · tính chất giao hoán, kết hợp, phân phối (tính nhanh)
     · nhân, chia với số có một / hai chữ số, với 10, 100, 1 000 · đo góc (thước đo góc), góc nhọn – tù – bẹt
     · vuông góc, song song, hình bình hành, hình thoi · yến – tạ – tấn, dm² – m² – mm², giây – thế kỉ
     · dãy số liệu, biểu đồ cột, số lần xuất hiện · phân số: khái niệm, phân số và phép chia, phân số bằng nhau, rút gọn,
     quy đồng, so sánh, cộng – trừ – nhân – chia (đáp số tối giản), phân số của một số.
   Ô phân số: hai ô chồng lên nhau (tử trên, mẫu dưới). Mỗi câu có vchk() tự kiểm đáp án. */
(function(){
const V=window.VO;if(!V||!V.nhanSo)return;
const {T,RR,mkQ,LB,SP,SIGN,sgn,distinct,svg,COL,lab,OPS,SH,uniq,tinh,datTinh,noiKQ,thieu,dau,signSet,form,chon,xep,day,noiQ,HINTN,NV,NG,
 nhanSo,congSo,chiaDu,doiDV,chuVi,dienTich,vietTong5,dauLon,bangSoLieu,frac,khaNang,bieuThuc}=V;
const M='−',X='×',D=':';
const gcd=(a,b)=>b?gcd(b,a%b):a,red=(n,d)=>{const g=gcd(n,d);return[n/g,d/g]};
const fr=(n,d)=>`<span class="vofr"><i>${n}</i><i>${d}</i></span>`;
/* ---------- mảnh mới ---------- */
function thuocGoc(a){const R=46,cx=52,cy=52;let b=`<path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy} Z" fill="#FFF4D6" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/>`;
 for(let d=0;d<=180;d+=10){const t=Math.PI-d*Math.PI/180,x1=cx+Math.cos(t)*R,y1=cy-Math.sin(t)*R,k=d%30?5:9;b+=`<line x1="${x1}" y1="${y1}" x2="${cx+Math.cos(t)*(R-k)}" y2="${cy-Math.sin(t)*(R-k)}" stroke="#1F2A5A" stroke-width="1.2" shape-rendering="auto"/>`;
  if(d%30===0)b+=`<text x="${cx+Math.cos(t)*(R-16)}" y="${cy-Math.sin(t)*(R-16)+3}" text-anchor="middle" font-family="VT323,monospace" font-size="10" fill="#1F2A5A">${d}</text>`}
 const t=Math.PI-a*Math.PI/180;b+=`<line x1="${cx}" y1="${cy}" x2="${cx-R-4}" y2="${cy}" stroke="#F04A1B" stroke-width="3"/><line x1="${cx}" y1="${cy}" x2="${cx+Math.cos(t)*(R+4)}" y2="${cy-Math.sin(t)*(R+4)}" stroke="#F04A1B" stroke-width="3" shape-rendering="auto"/><circle cx="${cx}" cy="${cy}" r="3" fill="#1F2A5A"/>`;
 return svg(104,58,b,`${a}°`)}
function goc4(a,rot,c){const r=rot*Math.PI/180,L=26,x0=30,y0=28,p=(ang)=>[x0+L*Math.cos(-(r+ang)),y0+L*Math.sin(-(r+ang))];const [x1,y1]=p(0),[x2,y2]=p(a*Math.PI/180);
 return svg(60,56,`<polyline points="${x1},${y1} ${x0},${y0} ${x2},${y2}" fill="none" stroke="${COL[c%COL.length]}" stroke-width="3" shape-rendering="auto"/><circle cx="${x0}" cy="${y0}" r="2.5" fill="#1F2A5A"/>`,'')}
function duong(kind,ok,c){const f=COL[c%COL.length];let b;
 if(kind==='vg'){const r=RR(0,60)*Math.PI/180,a2=r+(ok?Math.PI/2:pick([50,65,115,130])*Math.PI/180),L=24,cx=30,cy=26;const P=(t)=>`${cx-Math.cos(t)*L},${cy+Math.sin(t)*L} ${cx+Math.cos(t)*L},${cy-Math.sin(t)*L}`;b=`<polyline points="${P(r)}" stroke="${f}" stroke-width="3" fill="none" shape-rendering="auto"/><polyline points="${P(a2)}" stroke="#1F2A5A" stroke-width="3" fill="none" shape-rendering="auto"/>`}
 else{const r=RR(-25,25)*Math.PI/180,d=ok?0:pick([-12,12])*Math.PI/180,L=26;const seg=(y,t)=>`<line x1="${30-Math.cos(t)*L}" y1="${y+Math.sin(t)*L}" x2="${30+Math.cos(t)*L}" y2="${y-Math.sin(t)*L}" stroke="${f}" stroke-width="3" shape-rendering="auto"/>`;b=seg(16,r)+seg(38,r+d)}
 return svg(60,54,b,'')}
const TG4={binhhanh:'12,40 26,12 56,12 42,40',thoi:'30,4 52,26 30,48 8,26',chunhat:'6,12 54,12 54,40 6,40',vuong:'14,6 46,6 46,38 14,38'};
const tg4=(k,c)=>svg(60,52,`<polygon points="${TG4[k]}" fill="${COL[c%COL.length]}" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/>`,'');
function phanTo(k,m,kind,c){const f=COL[c%COL.length];let b='';const S=shuf(Array.from({length:k},(_,i)=>i)).slice(0,m);
 if(kind==='bar'){const w=110,h=22;for(let i=0;i<k;i++)b+=`<rect x="${2+i*w/k}" y="2" width="${w/k}" height="${h}" fill="${i<m?f:'#fff'}" stroke="#1F2A5A" stroke-width="2"/>`;return svg(w+4,h+4,b,`${m}/${k}`)}
 const r=22,cx=25,cy=25;for(let i=0;i<k;i++){const a0=i*2*Math.PI/k-Math.PI/2,a1=(i+1)*2*Math.PI/k-Math.PI/2;b+=`<path d="M${cx} ${cy} L${cx+r*Math.cos(a0)} ${cy+r*Math.sin(a0)} A${r} ${r} 0 0 1 ${cx+r*Math.cos(a1)} ${cy+r*Math.sin(a1)} Z" fill="${S.includes(i)?f:'#fff'}" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/>`}
 return svg(50,50,b,`${m}/${k}`)}
function cot4(vals,names){const H=100,W=names.length*40+40,y=v=>H-v;let b='';for(let v=0;v<=90;v+=10)b+=`<line x1="30" y1="${y(v)}" x2="${W-4}" y2="${y(v)}" stroke="${v%20?'#e3e9f3':'#c9d6ea'}"/>`+(v%20?'':`<text x="26" y="${y(v)+4}" text-anchor="end" font-family="VT323,monospace" font-size="11" fill="#1F2A5A">${v}</text>`);
 vals.forEach((v,i)=>{const x=40+i*40;b+=`<rect x="${x}" y="${y(v)}" width="22" height="${v}" fill="${COL[(i+1)%COL.length]}" stroke="#1F2A5A" stroke-width="1.5"/><text x="${x+11}" y="${H+13}" text-anchor="middle" font-family="Be Vietnam Pro" font-size="10" font-weight="700" fill="#1F2A5A">${names[i]}</text>`});
 b+=`<line x1="30" y1="${H}" x2="${W-4}" y2="${H}" stroke="#1F2A5A" stroke-width="2"/><line x1="30" y1="${y(95)}" x2="30" y2="${H}" stroke="#1F2A5A" stroke-width="2"/>`;return svg(W,H+18,b,'')}
{const _x=V.tokX;V.tokX=function(t,cell,q){if(!t||typeof t!=='object')return _x(t,cell,q);
 if(t.f)return fr(...t.f);
 if(t.fb)return`<span class="vofb">${cell()}<i></i>${cell()}</span>`;
 if(t.tgo!==undefined)return`<span class="vosh">${thuocGoc(t.tgo)}</span>`;
 if(t.g4)return`<span class="vosh">${goc4(...t.g4)}</span>`;
 if(t.du)return`<span class="vosh">${duong(...t.du)}</span>`;
 if(t.t4)return`<span class="vosh">${tg4(...t.t4)}</span>`;
 if(t.pt)return`<span class="vosh">${phanTo(...t.pt)}</span>`;
 if(t.c4)return`<span class="vosh">${cot4(...t.c4)}</span>`;
 return _x(t,cell,q)}}
/* ---------- đọc số đến lớp triệu ---------- */
const W1=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
function d2(n,linh){if(n===0)return'';if(n<10)return(linh?'linh ':'')+W1[n];if(n===10)return'mười';const t=Math.floor(n/10),u=n%10;if(t===1)return'mười'+(u?' '+(u===5?'lăm':W1[u]):'');return W1[t]+' mươi'+(u===0?'':' '+(u===1?'mốt':u===4?'tư':u===5?'lăm':W1[u]))}
const d3=(n,full)=>{if(n===0)return'';const h=Math.floor(n/100),r=n%100;if(!full&&h===0)return d2(r);return W1[h]+' trăm'+(r?' '+d2(r,true):'')};
function docSo(n){const tr=Math.floor(n/1e6),ng=Math.floor(n/1000)%1000,r=n%1000;const P=[];let first=true;
 if(tr){P.push(d3(tr,false)+' triệu');first=false}if(ng){P.push(d3(ng,!first)+' nghìn');first=false}else if(!first&&r)P.push('không trăm');if(r)P.push(d3(r,!first));return P.join(' ').replace(/ +/g,' ').replace('không trăm không trăm','không trăm')}
const readN=n=>T(docSo(n),String(n));
const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
/* ---------- dạng bài ---------- */
const need=V.need,needC=V.needC;
function noiDocTr(lo,hi){const ns=distinct(3,lo,hi);return noiQ('Vở: nối số với cách đọc',ns.map(n=>[{e:fmt(n)}]),ns.map(n=>[{e:readN(n)}]),ns,T('<b>Nối</b> mỗi số với cách đọc.','<b>Match</b> each number to its name.'),HINTN('Em nối mỗi số với cách đọc của nó.','Match each number to how it is read.'),q=>q.left.every((l,i)=>q.right[q.R.indexOf(i)][0].e===readN(q.vals[i])))}
const HANG=['đơn vị','chục','trăm','nghìn','chục nghìn','trăm nghìn','triệu','chục triệu','trăm triệu'];
function hangLop(){const rows=[],a=[],P=[];let mau;for(let i=0;i<5;i++){const n=RR(1e5,99999999),s=String(n),k=RR(0,s.length-1),dig=s[s.length-1-k];P.push(k);
  const f=fmt(n);let seen=-1,pos=-1;for(let j=f.length-1;j>=0;j--){if(f[j]!==' '){seen++;if(seen===k){pos=j;break}}}const hl=f.slice(0,pos)+`<b style="color:#F04A1B;text-decoration:underline">${f[pos]}</b>`+f.slice(pos+1);
  const t=[{x:hl},i?{b:1}:{mc:k}];if(i){rows.push({lb:LB[i-1],t});a.push(k)}else mau=t}
 return chon('Vở: hàng và lớp',HANG.slice(0,8),rows,a,T('Chữ số màu đỏ thuộc <b>hàng nào</b>?','Which <b>place</b> is the red digit in?'),T('Đếm từ phải sang trái: đơn vị, chục, trăm, nghìn, chục nghìn, trăm nghìn, triệu.','From the right: ones, tens, hundreds, thousands…'),q=>q.a.every((v,i)=>v===P[i+1]),mau,{P,wide:1})}
function giaTriCS(){const rows=[],a=[],P=[];for(let i=0;i<4;i++){const n=RR(1e5,9999999),s=String(n);let k;do{k=RR(1,s.length-1)}while(s[s.length-1-k]==='0');const d=+s[s.length-1-k];P.push(d*10**k);rows.push({lb:LB[i],t:[{w:T(`Giá trị của chữ số ${d} trong số ${fmt(n)} (hàng ${HANG[k]}) là`,`Value of ${d} in ${fmt(n)}:`)},{b:1}]});a.push(d*10**k)}
 return form('Vở: giá trị của chữ số',rows,a,T('<b>Viết</b> giá trị của chữ số.','<b>Write</b> the value of the digit.'),T('Giá trị của chữ số phụ thuộc vào hàng của nó.','A digit’s value depends on its place.'),q=>q.a.every((v,i)=>v===P[i]),{P})}
function lamTron4(H){const ns=[0,1,2,3].map(()=>RR(H*10,H*1000-1)),a=ns.map(n=>Math.round(n/H)*H),name={1000:T('hàng nghìn','thousand'),10000:T('hàng chục nghìn','ten thousand'),100000:T('hàng trăm nghìn','hundred thousand')}[H];
 return form('Vở: làm tròn số',ns.map((n,i)=>({lb:LB[i],t:[{x:`${fmt(n)} ≈`},{b:1}]})),a,T(`Làm tròn số đến <b>${name}</b>.`,`Round to the nearest <b>${name}</b>.`),T('Chữ số ngay sau hàng làm tròn bé hơn 5 thì làm tròn xuống, từ 5 trở lên thì làm tròn lên.','Next digit below 5: round down; 5 or more: round up.'),q=>ns.every((n,i)=>q.a[i]===Math.round(n/H)*H),{ns})}
function chanLe(){const ns=distinct(6,10,9999);return chon('Vở: số chẵn, số lẻ',[T('số chẵn','even'),T('số lẻ','odd')],ns.slice(1).map((n,i)=>({lb:LB[i],t:[{n},{b:1}]})),ns.slice(1).map(n=>n%2),T('Mỗi số là <b>số chẵn</b> hay <b>số lẻ</b>?','Is each number <b>even</b> or <b>odd</b>?'),T('Số có chữ số tận cùng là 0, 2, 4, 6, 8 là số chẵn.','Numbers ending in 0, 2, 4, 6, 8 are even.'),q=>q.ns.slice(1).every((n,i)=>q.a[i]===n%2),[{n:ns[0]},{mc:ns[0]%2}],{ns,c2:1,wide:1})}
function chanLe2(){const rows=[],a=[];const n1=RR(100,9998),n2=RR(100,9998);rows.push({lb:'a)',t:[{w:T(`Số chẵn liền sau của ${n1}:`,`Next even number after ${n1}:`)},{b:1}]});a.push(n1%2?n1+1:n1+2);rows.push({lb:'b)',t:[{w:T(`Số lẻ liền trước của ${n2}:`,`Odd number before ${n2}:`)},{b:1}]});a.push(n2%2?n2-2:n2-1);
 const lo=RR(10,40),hi=lo+RR(6,12);rows.push({lb:'c)',t:[{w:T(`Từ ${lo} đến ${hi} có bao nhiêu số chẵn?`,`Even numbers from ${lo} to ${hi}:`)},{b:1}]});let c=0;for(let v=lo;v<=hi;v++)if(v%2===0)c++;a.push(c);
 return form('Vở: số chẵn, số lẻ',rows,a,T('<b>Viết số</b> thích hợp.','<b>Write</b> the right number.'),T('Hai số chẵn liên tiếp hơn kém nhau 2 đơn vị.','Consecutive even numbers differ by 2.'),q=>q.a[2]===c)}
function btChu(){const rows=[],a=[],E=[];for(let i=0;i<4;i++){const k=i%4;let s,v,vals;const x=RR(2,40),y=RR(2,9),z=RR(2,9);
  if(k===0){s=`a + ${y} ${X} 2`;vals=`a = ${x}`;v=x+y*2}else if(k===1){s=`(a ${M} ${y}) ${X} ${z}`;vals=`a = ${x+y}`;v=x*z}else if(k===2){s=`a + b ${X} c`;vals=`a = ${x}, b = ${y}, c = ${z}`;v=x+y*z}else{s=`(a + b) : c`;const q=RR(2,9);vals=`a = ${q*z-y}, b = ${y}, c = ${z}`;v=q;if(q*z-y<0){vals=`a = ${q*z}, b = 0, c = ${z}`}}
  rows.push({lb:LB[i],t:[{x:s},{w:T(`với ${vals}:`,`when ${vals}:`)},{b:1}]});a.push(v);E.push(v)}
 return form('Vở: biểu thức chứa chữ',rows,a,T('Tính <b>giá trị</b> của biểu thức.','Work out the <b>value</b> of each expression.'),T('Thay chữ bằng số rồi tính. Có ngoặc thì tính trong ngoặc trước; nhân, chia trước cộng, trừ.','Replace the letters with numbers, then work it out.'),q=>q.a.every((v,i)=>v===E[i]))}
function chuViChu(){const rows=[],a=[];[0,1,2].forEach(i=>{if(i<2){const x=RR(5,30),y=RR(2,x-1);rows.push({lb:LB[i],t:[{w:T(`Hình chữ nhật a = ${x} cm, b = ${y} cm. P = (a + b) × 2 =`,`Rectangle a = ${x} cm, b = ${y} cm. P = (a + b) × 2 =`)},{b:1},{w:'cm'}]});a.push(2*(x+y))}else{const x=RR(3,25);rows.push({lb:LB[i],t:[{w:T(`Hình vuông cạnh a = ${x} cm. P = a × 4 =`,`Square a = ${x} cm. P = a × 4 =`)},{b:1},{w:'cm'}]});a.push(4*x)}});
 return form('Vở: công thức chu vi',rows,a,T('Tính <b>chu vi</b> theo công thức.','Use the formula to find the <b>perimeter</b>.'),T('Thay số vào công thức rồi tính.','Put the numbers into the formula.'),q=>q.a.length===3)}
function baBuoc(){const P=[];for(let i=0;i<3;i++){const [v,ve]=pick(NV),u=v.split(' ')[0];let t,r;const k=i;
  if(k===0){const n=RR(3,6),m=RR(10,30),c=RR(5,20);t=T(`Có ${n} thùng, mỗi thùng ${m} ${v}. Mua thêm ${c} ${v}, sau đó dùng hết ${m} ${v}. Còn lại bao nhiêu ${v}?`,`${n} boxes of ${m} ${ve}, buy ${c} more, then use ${m}. How many left?`);r=n*m+c-m}
  else if(k===1){const x=RR(20,60),y=RR(5,15),z=RR(5,15);t=T(`Ngày đầu bán ${x} ${v}, ngày thứ hai bán nhiều hơn ngày đầu ${y} ${v}, ngày thứ ba bán ít hơn ngày thứ hai ${z} ${v}. Cả ba ngày bán bao nhiêu ${v}?`,`Day 1: ${x}. Day 2: ${y} more. Day 3: ${z} fewer than day 2. Total?`);r=x+(x+y)+(x+y-z)}
  else{const g=RR(10,20)*1000,a=RR(2,5),b=RR(2,4),pa=RR(2,5)*1000,pb=RR(3,8)*1000;const tot=a*pa+b*pb;const pay=Math.ceil(tot/10000)*10000+10000;t=T(`Mua ${a} quyển vở giá ${fmt(pa)} đồng một quyển và ${b} cái bút giá ${fmt(pb)} đồng một cái. Đưa ${fmt(pay)} đồng. Được trả lại bao nhiêu đồng?`,`Buy ${a} books at ${pa} and ${b} pens at ${pb}. Pay ${pay}. Change?`);r=pay-tot;P.push({t,r,u:'đồng'});continue}
  P.push({t,r,u})}
 return form('Vở: bài toán có ba bước tính',P.map((p,i)=>({lb:LB[i],t:[{w:p.t},{br:1},{w:T('Đáp số:','Answer:')},{b:1},{w:p.u}]})),P.map(p=>p.r),T('<b>Giải</b> bài toán (ba bước tính), viết đáp số.','<b>Solve</b> each problem and write the answer.'),T('Em tìm lần lượt từng bước, kết quả bước trước dùng cho bước sau.','Work step by step.'),q=>q.a.every((v,i)=>v===P[i].r),{P})}
function tongHieu(){const rows=[],a=[],P=[];for(let i=0;i<3;i++){const s2=RR(10,90),b=RR(5,s2-5),big=s2+b;const S=big+s2-b,H=big-(s2-b);/* lớn = big, bé = s2-b */const L=big,Sm=s2-b;P.push([L+Sm,L-Sm,L,Sm]);
  rows.push({lb:LB[i],t:[{w:T(`Tổng hai số là ${L+Sm}, hiệu là ${L-Sm}. Số lớn:`,`Sum ${L+Sm}, difference ${L-Sm}. Larger:`)},{b:1},{w:T('Số bé:','Smaller:')},{b:1}]});a.push(L,Sm)}
 return form('Vở: tìm hai số biết tổng và hiệu',rows,a,T('Tìm <b>hai số</b> biết tổng và hiệu.','Find <b>the two numbers</b>.'),T('Số lớn bằng tổng cộng hiệu rồi chia 2. Số bé bằng tổng trừ hiệu rồi chia 2.','Larger = (sum + difference) ÷ 2. Smaller = (sum − difference) ÷ 2.'),q=>q.P.every((p,i)=>q.a[2*i]+q.a[2*i+1]===p[0]&&q.a[2*i]-q.a[2*i+1]===p[1]),{P})}
function tbc(){const rows=[],a=[],L=[];for(let i=0;i<3;i++){const n=RR(2,4),avg=RR(10,60);let v=Array.from({length:n-1},()=>avg+RR(-9,9));v.push(avg*n-v.reduce((s,x)=>s+x,0));if(v[v.length-1]<=0)v=Array(n).fill(avg);L.push(v);rows.push({lb:LB[i],t:[{w:T(`Trung bình cộng của ${v.join('; ')}:`,`Mean of ${v.join(', ')}:`)},{b:1}]});a.push(avg)}
 return form('Vở: tìm số trung bình cộng',rows,a,T('Tìm <b>số trung bình cộng</b>.','Find the <b>mean</b>.'),T('Cộng các số lại rồi chia cho số các số hạng.','Add them up, then divide by how many there are.'),q=>q.a.every((v,i)=>v*L[i].length===L[i].reduce((s,x)=>s+x,0)),{L})}
function rutDV(){const P=[];for(let i=0;i<3;i++){const [v,ve]=pick(NV),u=v.split(' ')[0];const n=RR(3,8),per=RR(4,15),m=RR(2,12);P.push({t:T(`${n} hộp như nhau có ${n*per} ${v}. Hỏi ${m} hộp như thế có bao nhiêu ${v}?`,`${n} equal boxes hold ${n*per} ${ve}. How many in ${m} boxes?`),r:per*m,u})}
 return form('Vở: bài toán rút về đơn vị',P.map((p,i)=>({lb:LB[i],t:[{w:p.t},{br:1},{w:T('Đáp số:','Answer:')},{b:1},{w:p.u}]})),P.map(p=>p.r),T('<b>Giải</b> bài toán, viết đáp số.','<b>Solve</b> and write the answer.'),T('Tìm giá trị một phần trước (phép chia), rồi tìm nhiều phần (phép nhân).','Find one first (divide), then many (multiply).'),q=>q.a.every((v,i)=>v===P[i].r),{P})}
function tinhNhanh(kind){const rows=[],a=[];for(let i=0;i<4;i++){let s,v;if(kind==='cong'){const x=RR(1,9)*100-RR(1,99),y=RR(10,99)*10,z=Math.ceil(x/100)*100-x;s=`${x} + ${y} + ${z}`;v=x+y+z}
  else if(kind==='nhan'){const p=pick([[25,4],[5,2],[50,2],[125,8],[20,5]]),y=RR(2,99);s=`${p[0]} ${X} ${y} ${X} ${p[1]}`;v=p[0]*p[1]*y}
  else{const x=RR(11,99),y=RR(2,9),z=10-y;s=`${x} ${X} ${y} + ${x} ${X} ${z}`;v=x*10;if(i%2){const y2=RR(11,19);s=`${x} ${X} ${y2} ${M} ${x} ${X} ${y2-10}`;v=x*10}}
  rows.push({lb:LB[i],t:[{x:s+' ='},{b:1}]});a.push(v)}
 return form(kind==='cong'?'Vở: tính nhanh (tính chất phép cộng)':kind==='nhan'?'Vở: tính nhanh (tính chất phép nhân)':'Vở: tính nhanh (nhân với một tổng)',rows,a,T('Tính bằng <b>cách thuận tiện</b>.','Work out <b>the easy way</b>.'),kind==='cong'?T('Em nhóm các số cộng lại được số tròn trăm.','Group numbers that make a round hundred.'):kind==='nhan'?T('Em nhóm các số nhân với nhau được số tròn chục, tròn trăm.','Group numbers that multiply to a round number.'):T('a × b + a × c = a × (b + c).','a × b + a × c = a × (b + c).'),q=>q.a.length===4)}
function nhan10(){const rows=[],a=[];for(let i=0;i<4;i++){const f=pick([10,100,1000]),n=RR(2,999);if(i%2){rows.push({lb:LB[i],t:[{x:`${fmt(n*f)} : ${fmt(f)} =`},{b:1}]});a.push(n)}else{rows.push({lb:LB[i],t:[{x:`${n} ${X} ${fmt(f)} =`},{b:1}]});a.push(n*f)}}
 return form('Vở: nhân, chia với 10, 100, 1 000',rows,a,T('<b>Tính nhẩm.</b>','<b>Mental maths.</b>'),T('Nhân với 10, 100, 1 000 thì thêm 1, 2, 3 chữ số 0 vào bên phải.','Multiplying by 10, 100, 1000 adds 1, 2, 3 zeros.'),q=>q.a.length===4)}
function doGoc(){const A=distinct(3,2,17).map(v=>v*10);return form('Vở: đo góc',A.map((d,i)=>({lb:LB[i],t:[{tgo:d},{w:T('Góc','Angle')},{b:1},{w:'°'}]})),A,T('Dùng thước đo góc: mỗi góc <b>bao nhiêu độ</b>?','How many <b>degrees</b> is each angle?'),T('Đặt tâm thước đo góc vào đỉnh, đọc số ở vạch tia thứ hai đi qua.','Read where the second arm crosses the scale.'),q=>q.a.every((v,i)=>v===A[i]))}
const GL=()=>[T('góc nhọn','acute'),T('góc vuông','right'),T('góc tù','obtuse'),T('góc bẹt','straight')];
function loaiGoc(){const kinds=shuf([0,1,2,3,RR(0,2)]),deg=k=>k===0?pick([30,45,60,75]):k===1?90:k===2?pick([110,130,150]):180;const [m,...R]=kinds;
 return chon('Vở: góc nhọn, góc tù, góc bẹt',GL(),R.map((k,i)=>({lb:LB[i],t:[{g4:[deg(k),RR(0,40),i]},{b:1}]})),R,T('Mỗi góc là <b>góc gì</b>?','What kind of <b>angle</b> is each?'),T('Góc nhọn bé hơn góc vuông, góc tù lớn hơn góc vuông, góc bẹt bằng hai góc vuông.','Acute < right < obtuse < straight.'),q=>q.K.every((k,i)=>q.a[i]===k),[{g4:[deg(m),10,0]},{mc:m}],{K:R,c2:1,wide:1})}
function vuongSS(kind){const ok=shuf([1,1,0,0,RR(0,1)]),[m,...R]=ok;const O=kind==='vg'?[T('vuông góc','perpendicular'),T('không vuông góc','not perpendicular')]:[T('song song','parallel'),T('không song song','not parallel')];
 return chon(kind==='vg'?'Vở: hai đường thẳng vuông góc':'Vở: hai đường thẳng song song',O,R.map((o,i)=>({lb:LB[i],t:[{du:[kind,o,i]},{b:1}]})),R.map(o=>o?0:1),kind==='vg'?T('Hai đường thẳng có <b>vuông góc</b> với nhau không?','Are the lines <b>perpendicular</b>?'):T('Hai đường thẳng có <b>song song</b> với nhau không?','Are the lines <b>parallel</b>?'),kind==='vg'?T('Hai đường thẳng vuông góc tạo thành bốn góc vuông.','Perpendicular lines make four right angles.'):T('Hai đường thẳng song song không bao giờ cắt nhau.','Parallel lines never meet.'),q=>q.K.every((o,i)=>q.a[i]===(o?0:1)),[{du:[kind,m,0]},{mc:m?0:1}],{K:R,c2:1,wide:1})}
const K4=['binhhanh','thoi','chunhat','vuong'],K4N=()=>[T('hình bình hành','parallelogram'),T('hình thoi','rhombus'),T('hình chữ nhật','rectangle'),T('hình vuông','square')];
function tenHinh4(){const ks=shuf(K4.concat([pick(['binhhanh','thoi'])])),[m,...R]=ks;return chon('Vở: hình bình hành, hình thoi',K4N(),R.map((k,i)=>({lb:LB[i],t:[{t4:[k,i+1]},{b:1}]})),R.map(k=>K4.indexOf(k)),T('Mỗi hình là <b>hình gì</b>?','<b>What shape</b> is each?'),T('Hình bình hành có hai cặp cạnh đối song song và bằng nhau. Hình thoi có bốn cạnh bằng nhau.','A parallelogram has two pairs of parallel sides. A rhombus has four equal sides.'),q=>q.K.every((k,i)=>K4[q.a[i]]===k),[{t4:[m,0]},{mc:K4.indexOf(m)}],{K:R,c2:1,wide:1})}
function theKi(){const rows=[],a=[],Y=[];for(let i=0;i<3;i++){const y=RR(1001,2099);Y.push(y);rows.push({lb:LB[i],t:[{w:T(`Năm ${y} thuộc thế kỉ thứ`,`The year ${y} is in century number`)},{b:1}]});a.push(Math.ceil(y/100))}
 rows.push({lb:'d)',t:[{x:'3 phút ='},{b:1},{w:T('giây','seconds')}]});a.push(180);
 return form('Vở: giây, thế kỉ',rows,a,T('<b>Viết số</b> thích hợp (1 thế kỉ = 100 năm, 1 phút = 60 giây).','<b>Write</b> the right number (1 century = 100 years, 1 minute = 60 seconds).'),T('Từ năm 1901 đến năm 2000 là thế kỉ hai mươi.','The years 1901 to 2000 are the 20th century.'),q=>Y.every((y,i)=>q.a[i]===Math.ceil(y/100))&&q.a[3]===180,{Y})}
function daySL(){const v=distinct(6,10,60),mx=Math.max(...v),mn=Math.min(...v);return form('Vở: dãy số liệu',[{t:[{w:T(`Chiều cao (cm) mấy cây con: ${v.join('; ')}`,`Seedling heights (cm): ${v.join(', ')}`)}]},{lb:'a)',t:[{w:T('Dãy có bao nhiêu số liệu?','How many values?')},{b:1}]},{lb:'b)',t:[{w:T('Cây cao nhất:','Tallest:')},{b:1},{w:'cm'}]},{lb:'c)',t:[{w:T('Cây cao nhất hơn cây thấp nhất:','Tallest minus shortest:')},{b:1},{w:'cm'}]},{lb:'d)',t:[{w:T('Số thứ ba trong dãy:','Third value:')},{b:1}]}],[6,mx,mx-mn,v[2]],T('Đọc <b>dãy số liệu</b> rồi viết số.','Read the <b>data</b> and write the numbers.'),T('Em đọc kỹ từng số trong dãy.','Read each value carefully.'),q=>q.a[1]===mx&&q.a[2]===mx-mn)}
function bieuDoCot(){const nm=['4A','4B','4C','4D'],v=distinct(4,2,9).map(x=>x*10);const mx=v.indexOf(Math.max(...v));
 return form('Vở: biểu đồ cột',[{t:[{c4:[v,nm]}]},{lb:'a)',t:[{w:T(`Lớp ${nm[0]} quyên góp được`,`Class ${nm[0]} gave`)},{b:1},{w:T('quyển sách','books')}]},{lb:'b)',t:[{w:T(`Lớp ${nm[2]} quyên góp được`,`Class ${nm[2]} gave`)},{b:1},{w:T('quyển sách','books')}]},{lb:'c)',t:[{w:T('Cả bốn lớp:','All four classes:')},{b:1},{w:T('quyển sách','books')}]}],[v[0],v[2],v.reduce((s,x)=>s+x,0)],T('Đọc <b>biểu đồ cột</b> rồi viết số.','Read the <b>bar chart</b>.'),T('Mỗi vạch ngang hơn kém nhau 10 quyển.','Each line is 10 books.'),q=>q.a[0]===v[0]&&q.a[1]===v[2])}
function soLan(){const L=Array.from({length:RR(10,14)},()=>Math.random()<.5?'S':'N'),s=L.filter(x=>x==='S').length;
 return form('Vở: số lần xuất hiện của một sự kiện',[{t:[{w:T(`Tung đồng xu ${L.length} lần (S: mặt sấp, N: mặt ngửa): ${L.join(' ')}`,`${L.length} coin tosses (S heads, N tails): ${L.join(' ')}`)}]},{lb:'a)',t:[{w:T('Mặt sấp xuất hiện','Heads appeared')},{b:1},{w:T('lần','times')}]},{lb:'b)',t:[{w:T('Mặt ngửa xuất hiện','Tails appeared')},{b:1},{w:T('lần','times')}]}],[s,L.length-s],T('<b>Đếm</b> số lần xuất hiện.','<b>Count</b> how many times.'),T('Em đếm từng chữ S và chữ N.','Count each S and N.'),q=>q.a[0]+q.a[1]===L.length)}
/* ---------- phân số ---------- */
function ktPS(){const rows=[],a=[],P=[];for(let i=0;i<4;i++){const k=pick([3,4,5,6,8]),m=RR(1,k-1);P.push([m,k]);rows.push({lb:LB[i],t:[{pt:[k,m,i%2?'bar':'pie',i]},{w:T('Phân số chỉ phần đã tô màu:','Shaded fraction:')},{fb:1}]});a.push(m,k)}
 return form('Vở: khái niệm phân số',rows,a,T('<b>Viết phân số</b> chỉ phần đã tô màu.','<b>Write the fraction</b> that is shaded.'),T('Mẫu số là số phần bằng nhau, tử số là số phần đã tô màu.','The bottom number is the equal parts; the top is the shaded parts.'),q=>q.P.every((p,i)=>q.a[2*i]===p[0]&&q.a[2*i+1]===p[1]),{P})}
function psChia(){const rows=[],a=[],P=[];for(let i=0;i<4;i++){const n=RR(1,20),d=RR(2,9);P.push([n,d]);rows.push({lb:LB[i],t:[{x:`${n} : ${d} =`},{fb:1}]});a.push(n,d)}
 return form('Vở: phân số và phép chia',rows,a,T('Viết thương dưới dạng <b>phân số</b>.','Write each quotient as a <b>fraction</b>.'),T('Thương của phép chia có thể viết thành phân số: tử số là số bị chia, mẫu số là số chia.','The dividend goes on top, the divisor below.'),q=>q.P.every((p,i)=>q.a[2*i]===p[0]&&q.a[2*i+1]===p[1]),{P})}
function psBang(){const rows=[],a=[],P=[];for(let i=0;i<4;i++){const [n,d]=red(RR(1,8),RR(2,9));if(n>=d){i--;continue}const k=RR(2,6),top=i%2;P.push([n,d,k,top]);rows.push({lb:LB[i],t:top?[{f:[n,d]},{x:'='},{fb:1}]:[{f:[n*k,d*k]},{x:'='},{fb:1}]});a.push(...(top?[n*k,d*k]:[n,d]))}
 return form('Vở: phân số bằng nhau',rows.map((r,i)=>{const [n,d,k,top]=P[i];return top?{lb:r.lb,t:[{f:[n,d]},{x:'='},{w:T(`(nhân cả tử và mẫu với ${k})`,`(× ${k})`)},{fb:1}]}:{lb:r.lb,t:[{f:[n*k,d*k]},{x:'='},{w:T(`(chia cả tử và mẫu cho ${k})`,`(÷ ${k})`)},{fb:1}]}}),a,T('<b>Viết</b> phân số bằng phân số đã cho.','<b>Write</b> an equal fraction.'),T('Nhân hoặc chia cả tử số và mẫu số với cùng một số thì được phân số bằng nó.','Multiply or divide top and bottom by the same number.'),q=>q.P.every((p,i)=>q.a[2*i]*p[1]===q.a[2*i+1]*p[0]),{P})}
function rutGon(){const rows=[],a=[],P=[];for(let i=0;i<4;i++){let [n,d]=red(RR(1,8),RR(2,9));if(n>=d){i--;continue}const k=RR(2,6);P.push([n*k,d*k]);rows.push({lb:LB[i],t:[{f:[n*k,d*k]},{x:'='},{fb:1}]});a.push(n,d)}
 return form('Vở: rút gọn phân số',rows,a,T('<b>Rút gọn</b> phân số (viết phân số tối giản).','<b>Simplify</b> each fraction fully.'),T('Chia cả tử số và mẫu số cho cùng một số lớn hơn 1 cho đến khi không chia được nữa.','Divide top and bottom by the same number until you can’t any more.'),q=>q.P.every((p,i)=>{const r=red(...p);return q.a[2*i]===r[0]&&q.a[2*i+1]===r[1]}),{P})}
function quyDong(){const rows=[],a=[],P=[];for(let i=0;i<3;i++){const d1=RR(2,6),k=RR(2,4),d2=d1*k,n1=RR(1,d1-1),n2=RR(1,d2-1);P.push([n1,d1,n2,d2,k]);rows.push({lb:LB[i],t:[{w:T(`Quy đồng`,`Common denominator`)},{f:[n1,d1]},{w:T('và','and')},{f:[n2,d2]},{w:T(`(mẫu số chung ${d2}):`,`(${d2}):`)},{fb:1},{w:T('và','and')},{f:[n2,d2]}]});a.push(n1*k,d2)}
 return form('Vở: quy đồng mẫu số',rows,a,T('<b>Quy đồng mẫu số</b> các phân số.','<b>Give the fractions a common denominator</b>.'),T('Nhân cả tử và mẫu của phân số thứ nhất với cùng một số để được mẫu số chung.','Multiply top and bottom of the first fraction to reach the common denominator.'),q=>q.P.every((p,i)=>q.a[2*i]===p[0]*p[4]&&q.a[2*i+1]===p[3]),{P})}
function soSanhPS(){const P=signSet(5,w=>{const d=RR(3,12);let n1=RR(1,d-1),n2=w===2?n1:RR(1,d-1);if(Math.random()<.4&&w!==2){const d2=RR(2,12),m=RR(1,d2);return[fr(n1,d),n1*d2,fr(m,d2),m*d]}return[fr(n1,d),n1,fr(n2,d),n2]});return dau(P,'Vở: so sánh phân số')}
function psTinh(op){const rows=[],a=[],P=[],seen=new Set();for(let i=0,t=0;i<4&&t<200;i++,t++){let n1,d1,n2,d2;const same=op==='+'||op==='-'?i<2:false;d1=RR(2,9);d2=same?d1:(op==='+'||op==='-'?d1*RR(2,3):RR(2,9));n1=RR(1,d1-1);n2=RR(1,d2-1);
  const key=[n1,d1,n2,d2].join();if(seen.has(key)){i--;continue}seen.add(key);
  if(op==='-'&&n1*d2<=n2*d1){[n1,d1,n2,d2]=[n2,d2,n1,d1];if(n1*d2===n2*d1)n1++}
  let rn,rd;if(op==='+'){rn=n1*d2+n2*d1;rd=d1*d2}else if(op==='-'){rn=n1*d2-n2*d1;rd=d1*d2}else if(op==='x'){rn=n1*n2;rd=d1*d2}else{rn=n1*d2;rd=d1*n2}
  const [r1,r2]=red(rn,rd);P.push([r1,r2]);rows.push({lb:LB[i],t:[{f:[n1,d1]},{x:SH[op]},{f:[n2,d2]},{x:'='},{fb:1}]});a.push(r1,r2)}
 const name={'+':'cộng','-':'trừ','x':'nhân',':':'chia'}[op];
 return form(`Vở: phép ${name} phân số`,rows,a,T(`<b>Tính</b> (viết kết quả là phân số tối giản; số tự nhiên thì mẫu số là 1).`,`<b>Work out</b> (simplest form; whole numbers over 1).`),{'+':T('Cùng mẫu số: cộng tử, giữ mẫu. Khác mẫu số: quy đồng trước.','Same denominator: add the tops. Otherwise make them the same first.'),'-':T('Cùng mẫu số: trừ tử, giữ mẫu. Khác mẫu số: quy đồng trước.','Same denominator: subtract the tops.'),'x':T('Lấy tử nhân tử, mẫu nhân mẫu.','Multiply tops and multiply bottoms.'),':':T('Lấy phân số thứ nhất nhân với phân số thứ hai đảo ngược.','Multiply by the second fraction turned upside down.')}[op],q=>q.P.every((p,i)=>q.a[2*i]===p[0]&&q.a[2*i+1]===p[1]),{P})}
function psCuaSo(){const rows=[],a=[];for(let i=0;i<4;i++){const d=RR(2,9),n=RR(1,d-1),k=RR(2,12);rows.push({lb:LB[i],t:[{f:[n,d]},{w:T(`của ${d*k} là`,`of ${d*k} is`)},{b:1}]});a.push(n*k)}
 return form('Vở: tìm phân số của một số',rows,a,T('Tìm <b>phân số của một số</b>.','Find the <b>fraction of the number</b>.'),T('Lấy số đó nhân với phân số: chia cho mẫu số rồi nhân với tử số.','Divide by the bottom, multiply by the top.'),q=>q.a.length===4)}

/* ---------- trang theo bài ---------- */
const P=(b,i)=>PAGES[b]()[i];
const big=(lo,hi,op)=>congSo(lo,hi,op);
const PAGES={
 1:()=>[dauLon(10000,99999),xep(10000,99999),vietTong5(10001,99999)],
 2:()=>[tinh([big(10000,90000,'+'),big(10000,99999,'-'),nhanSo(1000,9999,99999),{...(()=>{const b=RR(2,9),q=RR(1000,9999);return{a:b*q,b,op:':',r:q}})()}]),datTinh([big(10000,80000,'+'),big(10000,99999,'-')]),thieu([big(10000,80000,'+'),big(10000,99999,'-'),big(10000,80000,'+'),big(10000,99999,'-')])],
 3:()=>[chanLe(),chanLe2(),chanLe()],4:()=>[btChu(),chuViChu(),btChu()],5:()=>[baBuoc(),baBuoc(),bieuThuc(1)],6:()=>[P(3,1),P(4,0),P(5,0)],
 7:()=>[doGoc(),doGoc(),loaiGoc()],8:()=>[loaiGoc(),doGoc(),loaiGoc()],9:()=>[P(7,0),P(8,0),P(3,0)],
 10:()=>[noiDocTr(100000,999999),vietTong5(100001,999999),day([1,10,100,1000,10000],100000,999999,6)],11:()=>[hangLop(),giaTriCS(),noiDocTr(100000,9999999)],12:()=>[noiDocTr(1000000,99999999),giaTriCS(),hangLop()],
 13:()=>[lamTron4(100000),lamTron4(10000),lamTron4(1000)],14:()=>[dauLon(100000,99999999),xep(100000,9999999),dauLon(100000,9999999)],15:()=>[day([1,2,5,10,100],0,9999,6),chanLe2(),day([1,10,1000],1000,999999,6)],16:()=>[P(11,0),P(13,0),P(14,0)],
 17:()=>[doiDV([['yến','kg',10],['tạ','kg',100],['tấn','kg',1000,5],['tấn','tạ',10]],'Vở: yến, tạ, tấn'),V.donVi3('tạ',50),doiDV([['tạ','yến',10],['tấn','yến',100],['yến','kg',10],['tấn','kg',1000,3]],'Vở: yến, tạ, tấn')],
 18:()=>[doiDV([['dm²','cm²',100],['m²','dm²',100],['cm²','mm²',100],['m²','cm²',10000,3]],'Vở: dm², m², mm²'),dienTich(),doiDV([['m²','dm²',100],['dm²','cm²',100],['cm²','mm²',100],['dm²','cm²',100]],'Vở: dm², m², mm²')],
 19:()=>[theKi(),doiDV([['phút','giây',60],['giờ','phút',60],['thế kỉ','năm',100,5],['phút','giây',60]],'Vở: giây, thế kỉ'),theKi()],20:()=>[P(17,0),P(18,0),P(19,0)],21:()=>[P(17,2),P(18,1),P(19,1)],
 22:()=>[tinh(uniq(()=>big(100000,800000,'+'),4)),datTinh(uniq(()=>big(10000,80000,'+'),2)),thieu(uniq(()=>big(10000,80000,'+'),4))],23:()=>[tinh(uniq(()=>big(100000,999999,'-'),4)),datTinh(uniq(()=>big(10000,99999,'-'),2)),thieu(uniq(()=>big(10000,99999,'-'),4))],
 24:()=>[tinhNhanh('cong'),tinhNhanh('cong'),thieu(uniq(()=>big(1000,9999,'+'),4))],25:()=>[tongHieu(),tongHieu(),baBuoc()],26:()=>[P(22,1),P(24,0),P(25,0)],
 27:()=>[vuongSS('vg'),vuongSS('vg'),loaiGoc()],28:()=>[vuongSS('vg'),loaiGoc(),vuongSS('vg')],29:()=>[vuongSS('ss'),vuongSS('ss'),vuongSS('vg')],30:()=>[vuongSS('ss'),vuongSS('vg'),vuongSS('ss')],31:()=>[tenHinh4(),tenHinh4(),vuongSS('ss')],32:()=>[P(27,0),P(29,0),P(31,0)],
 33:()=>[P(12,0),P(14,0),P(13,0)],34:()=>[P(22,0),P(23,1),P(25,0)],35:()=>[P(8,0),P(31,0),P(29,0)],36:()=>[P(17,0),P(18,0),P(19,0)],37:()=>[P(33,1),P(34,0),P(36,1)],
 38:()=>[tinh(uniq(()=>nhanSo(10000,99999,999999),4)),datTinh(uniq(()=>nhanSo(10000,99999,999999),2)),noiKQ(uniq(()=>nhanSo(1000,9999,99999),3))],39:()=>[chiaDu(10000,99999),tinh(uniq(()=>{const b=RR(2,9),q=RR(10000,99999);return{a:b*q,b,op:':',r:q}},4)),chiaDu(1000,99999)],
 40:()=>[tinhNhanh('nhan'),tinhNhanh('nhan'),thieu(uniq(()=>nhanSo(10,99,999),4))],41:()=>[nhan10(),nhan10(),tinh(uniq(()=>({...(()=>{const n=RR(2,99)*10,m=pick([10,100,20,30]);return{a:n,b:m,op:'x',r:n*m}})()}),4))],
 42:()=>[tinhNhanh('pp'),tinhNhanh('pp'),bieuThuc(1)],43:()=>[tinh(uniq(()=>{const a=RR(100,999),b=RR(11,99);return{a,b,op:'x',r:a*b}},4)),datTinh(uniq(()=>{const a=RR(10,99),b=RR(11,99);return{a,b,op:'x',r:a*b}},2)),noiKQ(uniq(()=>{const a=RR(10,99),b=RR(11,30);return{a,b,op:'x',r:a*b}},3))],
 44:()=>[tinh(uniq(()=>{const b=RR(11,99),q=RR(10,999);return{a:b*q,b,op:':',r:q}},4)),thieu(uniq(()=>{const b=RR(11,50),q=RR(2,99);return{a:b*q,b,op:':',r:q}},4)),noiKQ(uniq(()=>{const b=RR(11,40),q=RR(11,99);return{a:b*q,b,op:':',r:q}},3))],
 45:()=>[lamTron4(1000),tinh(uniq(()=>{const a=RR(1,9)*1000,b=RR(1,9)*100;return{a,b,op:'+',r:a+b}},4)),lamTron4(10000)],46:()=>[tbc(),tbc(),tbc()],47:()=>[rutDV(),rutDV(),tbc()],48:()=>[P(43,1),P(46,0),P(47,0)],
 49:()=>[daySL(),daySL(),bangSoLieu()],50:()=>[bieuDoCot(),bieuDoCot(),daySL()],51:()=>[soLan(),khaNang(),soLan()],52:()=>[P(49,0),P(50,0),P(51,0)],
 53:()=>[ktPS(),ktPS(),psChia()],54:()=>[psChia(),ktPS(),psChia()],55:()=>[psBang(),psBang(),ktPS()],56:()=>[rutGon(),rutGon(),psBang()],57:()=>[quyDong(),quyDong(),rutGon()],58:()=>[soSanhPS(),soSanhPS(),quyDong()],59:()=>[P(56,0),P(57,0),P(58,0)],
 60:()=>[psTinh('+'),psTinh('+'),soSanhPS()],61:()=>[psTinh('-'),psTinh('-'),psTinh('+')],62:()=>[P(60,0),P(61,0),P(58,0)],
 63:()=>[psTinh('x'),psTinh('x'),psCuaSo()],64:()=>[psTinh(':'),psTinh(':'),psTinh('x')],65:()=>[psCuaSo(),psCuaSo(),psTinh('x')],66:()=>[P(63,0),P(64,0),P(65,0)],
 67:()=>[P(14,0),P(12,1),P(3,0)],68:()=>[P(43,0),P(44,0),P(42,0)],69:()=>[P(56,0),P(58,0),P(55,0)],70:()=>[P(60,0),P(61,0),P(64,0)],71:()=>[P(31,0),P(8,0),P(18,0)],72:()=>[P(50,0),P(51,0),P(49,0)],73:()=>[P(68,0),P(70,0),P(71,0)]};
{const _p=window.voPage;window.voPage=function(x){if(curG()===4&&PAGES[x.b])return PAGES[x.b]().filter(Boolean);return _p(x)}}
document.head.insertAdjacentHTML('beforeend',`<style>
.vofb{display:inline-flex;flex-direction:column;align-items:center;gap:2px;vertical-align:middle}.vofb>i{display:block;width:30px;height:2px;background:#1F2A5A}.vofb .votc.vb1{height:26px}
.voex .vofr,.vorow>.vofr{font-size:20px;color:#1F2A5A;background:#fff;padding:0 2px}
</style>`);
})();
