/* 72 — Tự luyện · Vở bài tập Jenny (thầy chốt và duyệt ảnh mẫu 24/10/2026, task T-24)
   - Nhà em › Phòng học › Tự luyện. Mỗi đảo đã qua Màn 1 mở 1 "trang vở" (Trang n = thứ tự đảo trong lớp).
   - Trang = 5 bài trộn dạng (số mới mỗi lần) + 1 bài ★ Thử thách. Em tự chọn, không bắt buộc, làm dở thoát ra vẫn giữ.
   - Mỗi bài: sai lần 1 được thử lại (không mất tim), sai lần 2 xem đáp án. Câu của đảo sai lần đầu → Sổ lỗi sai.
   - Xu: 5 xu/bài đúng, ★ đúng 15 xu, không giới hạn xu trong ngày (thầy chốt 24/10/2026). Không tính sao, không mở đảo.
   - Thử thách hôm nay: 1 lượt/ngày, +15 xu.
   - Dạng bài mới (kiểu 'cells', viết lại từ dạng bài của VBT tham khảo, không chép sách):
     Nhà số · Gia đình phép tính · Tháp số · Tam giác số. Xem docs/tu-luyen-dang-bai-lop1-tap1.md.
   - Cô KHÔNG giao, chỉ ⭐ gợi ý trang: lưu trong S.asg dạng {loai:'goiy', g, lop, hs?, isl:[...]} (không có tiets nên
     không lẫn vào Bài cô giao; đồng bộ máy chủ như bài cô giao).
   - Lưu: st.tl[islId]={n,best:{ok,n,tt,t},last:{…},cur:{seed,j,res,tt}} · st.tlDay={d,ok}.
   - Hiện có cho lớp 1, 2 (thầy chốt làm lớp 1 trước rồi lớp 2); lớp 3–5 hiện "Sắp có". */
(function(){
const TL_XU=5,TL_TT=15,TL_G=g=>g>=1&&g<=2;
const tlR=st=>st.tl||(st.tl={});
const tlIdx=x=>PRIM[curG()].isl.indexOf(x)+1;
const tlOpen=(st,x)=>{if(UNL)return true;const s=st.p1&&st.p1[x.id];return!!(s&&s.m&&s.m[0])};
const tlPages=st=>PRIM[curG()].isl.filter(x=>tlOpen(st,x));
const tlDone=st=>Object.values(tlR(st)).filter(r=>r&&r.best).length;
const tlLes=x=>shortTitle(x.lesson||'');
const RR=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const T=(vi,en)=>arcT(vi,en);

/* ---------- dạng bài mới ---------- */
/* q.type='cells': q.lay = house|fam|tower|tri; q.rows = hàng ô (số đã cho, null = ô trống, '' = chỗ trống không điền, chuỗi dấu);
   q.a = đáp án các ô trống theo thứ tự đọc. */
function cq(o){const blanks=[];o.rows.forEach(r=>r.forEach(c=>{if(c===null)blanks.push(1)}));return Object.assign({type:'cells',pic:'@@TLFIG@@'},o)}
function nhaSo(g){let n,lo,hi;if(g===1){n=RR(5,10);lo=1;hi=n-1}else{n=RR(11,18);lo=n-9;hi=9}
 const as=shuf(Array.from({length:hi-lo+1},(_,i)=>lo+i)).slice(0,g===1?4:3);const rows=[],a=[];
 as.forEach(x=>{const y=n-x,s=Math.random()<.5;rows.push(s?[x,null]:[null,y]);a.push(s?y:x)});
 return cq({lay:'house',roof:n,rows,a,kind:'Nhà số',label:'Nhà số',
  q:T(`<b>Nhà số ${n}</b>: hai số ở mỗi tầng gộp lại được ${n}. Điền số còn thiếu.`,`<b>Number house ${n}</b>: the two numbers on each floor make ${n}. Fill in the missing numbers.`),
  say:T(`Nhà số ${n}. Hai số ở mỗi tầng gộp lại được ${n}. Em điền số còn thiếu nhé.`,`Number house ${n}. The two numbers on each floor make ${n}. Fill in the missing numbers.`),
  sol:as.map(x=>`${x} + ${n-x} = ${n}`).join(' · ')})}
function giaDinh(g,mode){let a,b;
 if(g===1&&mode!=='100'){a=RR(1,8);b=RR(1,9-a)}
 else if(g===1){do{a=RR(1,8)*10+RR(0,8);b=RR(1,9)}while(a%10+b>9)}
 else if(mode==='20'){do{a=RR(2,9);b=RR(2,9)}while(a+b<=10)}
 else if(mode==='nho'){do{a=RR(1,8)*10+RR(2,9);b=RR(0,3)*10+RR(2,9)}while(a%10+b%10<10||a+b>100)}
 else{do{a=RR(1,7)*10+RR(0,8);b=RR(1,2)*10+RR(0,8)}while(a%10+b%10>9||a+b>100)}
 const n=a+b,rows=[[a,'+',b,'=',null],[b,'+',null,'=',n],[n,'−',a,'=',null],[n,'−',null,'=',a]];
 return cq({lay:'fam',head:[n,a,b],rows,a:[n,a,b,b],kind:'Gia đình phép tính',label:'Gia đình phép tính',
  q:T(`<b>${n}</b> gồm <b>${a}</b> và <b>${b}</b>. Điền số vào ô trống để có 2 phép cộng, 2 phép trừ.`,`<b>${n}</b> is <b>${a}</b> and <b>${b}</b>. Fill in the boxes to make 2 additions and 2 subtractions.`),
  say:T(`${n} gồm ${a} và ${b}. Em điền số vào ô trống nhé.`,`${n} is ${a} and ${b}. Fill in the boxes.`),
  sol:`${a} + ${b} = ${n} · ${b} + ${a} = ${n} · ${n} − ${a} = ${b} · ${n} − ${b} = ${a}`})}
function thapSo(g,M){let x,y,z;do{const k=g===1?4:M>20?30:8;x=RR(0,k);y=RR(1,k);z=RR(0,k)}while(x+2*y+z>M||x+2*y+z<(g===1?5:10));
 const p=x+y,q=y+z,t=p+q,hard=Math.random()<.4;
 const rows=hard?[[null],[p,q],[x,null,z]]:[[null],[p,null],[x,y,z]];
 return cq({lay:'tower',rows,a:hard?[t,y]:[t,q],kind:'Tháp số',label:'Tháp số',tt:1,
  q:T(`<b>★ Tháp số</b>: số ở mỗi ô bằng hai số ngay bên dưới cộng lại.`,`<b>★ Number pyramid</b>: each brick is the sum of the two bricks below it.`),
  say:T('Tháp số. Số ở mỗi ô bằng hai số ngay bên dưới cộng lại.','Number pyramid. Each brick is the sum of the two bricks below it.'),
  sol:hard?`${p} − ${x} = ${y} · ${p} + ${q} = ${t}`:`${y} + ${z} = ${q} · ${p} + ${q} = ${t}`})}
function tamGiac(g,M){let S0,x,y,z;for(;;){S0=g===1?RR(6,10):RR(12,Math.min(20,M));x=RR(1,S0-1);y=RR(1,S0-1);z=RR(1,S0-1);if(S0-x-y>=0&&S0-x-z>=0&&S0-y-z>=0&&new Set([x,y,z]).size===3)break}
 const m1=S0-x-y,m2=S0-x-z,m3=S0-y-z;
 return cq({lay:'tri',sum:S0,rows:[[x],[null,null],[y,null,z]],a:[m1,m2,m3],kind:'Tam giác số',label:'Tam giác số',tt:1,
  q:T(`<b>★ Tam giác số</b>: ba số trên mỗi cạnh cộng lại được <b>${S0}</b>. Điền số còn thiếu.`,`<b>★ Number triangle</b>: the three numbers on each side add up to <b>${S0}</b>. Fill in the missing numbers.`),
  say:T(`Tam giác số. Ba số trên mỗi cạnh cộng lại được ${S0}.`,`Number triangle. The three numbers on each side add up to ${S0}.`),
  sol:`${x} + ${m1} + ${y} = ${S0} · ${x} + ${m2} + ${z} = ${S0} · ${y} + ${m3} + ${z} = ${S0}`})}

/* Lưới phép tính: hàng trên A + B = C, cột trái A + D = F, cột phải C − E = H, hàng dưới F − G = H; ẩn vài ô, giải được lần lượt */
function luoiPT(g){const M=g===1?10:20;let A,B,C,D,E,F,G,H;
 for(;;){A=RR(1,M-2);B=RR(1,M-1-A);C=A+B;D=RR(1,M-A);F=A+D;E=RR(0,C-1);H=C-E;G=F-H;if(G>=0&&new Set([A,B,D,E,G]).size>=4)break}
 const V={A,B,C,D,E,F,G,H},EQ=[['A','B','C','+'],['A','D','F','+'],['C','E','H','−'],['F','G','H','−']];
 const ok=bl=>{const k=new Set(Object.keys(V).filter(x=>!bl.includes(x)));for(let t=0;t<4;t++)EQ.forEach(e=>{const m=e.slice(0,3).filter(x=>!k.has(x));if(m.length===1)k.add(m[0])});return k.size===8};
 let bl;for(let t=0;t<200;t++){bl=shuf(Object.keys(V)).slice(0,g===1?3:4);if(ok(bl))break}
 const c=x=>bl.includes(x)?null:V[x];
 const rows=[[c('A'),'+',c('B'),'=',c('C')],['+','','','','−'],[c('D'),'','','',c('E')],['=','','','','='],[c('F'),'−',c('G'),'=',c('H')]];
 const order=['A','B','C','D','E','F','G','H'].filter(x=>bl.includes(x));/* thứ tự đọc: hàng 1 (A,B,C), hàng 3 (D,E), hàng 5 (F,G,H) */
 return cq({lay:'grid',rows,a:order.map(x=>V[x]),kind:'Lưới phép tính',label:'Lưới phép tính',
  q:T('<b>Lưới phép tính</b>: mỗi hàng ngang và mỗi cột dọc là một phép tính. Điền số vào ô trống.','<b>Number grid</b>: each row and each column is a sum. Fill in the boxes.'),
  say:T('Lưới phép tính. Mỗi hàng ngang và mỗi cột dọc là một phép tính. Em điền số vào ô trống nhé.','Number grid. Each row and each column is a sum. Fill in the boxes.'),
  sol:`${A} + ${B} = ${C} · ${A} + ${D} = ${F} · ${C} − ${E} = ${H} · ${F} − ${G} = ${H}`})}
/* Tô màu theo kết quả: 12 ô (4×3), mỗi ô một phép tính; tô đúng màu thì hiện hình */
const TL_HINH=[["0110","1221","0110"],["1001","0220","1001"],["2112","0110","2112"],["0200","2121","0200"],["1111","0220","0220"],["0120","1221","0120"]];
const TL_MAU=[['#0079C1','xanh','blue'],['#FCB40C','vàng','yellow'],['#E0441A','đỏ','red']];
function toMau(g,M){M=M||(g===1?10:20);const vs=shuf(Array.from({length:M-2},(_,i)=>i+3)).slice(0,3);const H=pick(TL_HINH).join('').split('').map(Number);
 const ex=v=>{for(let t=0;t<30;t++){if(Math.random()<.5){const a=RR(0,v);return`${a} + ${v-a}`}const b=RR(v,M),c=b-v;if(c>=0)return`${b} − ${c}`}return`${v} + 0`};
 const cells=H.map(k=>ex(vs[k]));
 return cq({lay:'color',cells,vals:vs,rows:[],a:H,kind:'Tô màu theo kết quả',label:'Tô màu theo kết quả',
  q:T('<b>Tô màu theo kết quả</b>: chọn màu rồi chạm vào ô có phép tính bằng số của màu đó.','<b>Colour by answer</b>: pick a colour, then tap each box whose answer matches it.'),
  say:T('Tô màu theo kết quả. Em chọn màu rồi chạm vào ô có kết quả bằng số của màu đó.','Colour by answer. Pick a colour, then tap each box whose answer matches it.'),
  sol:vs.map((v,i)=>`${v} → ${T(TL_MAU[i][1],TL_MAU[i][2])}`).join(' · ')})}
/* Đúng ghi Đ, sai ghi S: 4 ý */
function dungSai(g,mode){const M=g===1?10:mode==='100'?100:20,L=[],a=[];const seen=new Set();
 while(L.length<4){let t,ok;const k=RR(0,2);
  if(mode==='so'||k===0){const x=RR(0,M),y=RR(0,M);if(x===y)continue;const s=pick(['>','<']);ok=s==='>'?x>y:x<y;if(Math.random()<.5){t=`${x} ${s==='>'?'&gt;':'&lt;'} ${y}`}else{ok=!ok;t=`${x} ${s==='>'?'&lt;':'&gt;'} ${y}`}}
  else if(k===1){const x=RR(0,M);const y=RR(0,M-x),r=x+y,d=Math.random()<.5?0:pick([-1,1]);const w=r+d;if(w<0)continue;ok=d===0;t=`${x} + ${y} = ${w}`}
  else{const x=RR(1,M),y=RR(0,x),r=x-y,d=Math.random()<.5?0:pick([-1,1]);const w=r+d;if(w<0)continue;ok=d===0;t=`${x} − ${y} = ${w}`}
  if(seen.has(t))continue;seen.add(t);L.push(t);a.push(ok?1:0)}
 if(a.every(v=>v===a[0]))return dungSai(g,mode);
 return cq({lay:'ds',st:L,rows:[],a,kind:'Đúng hay sai',label:'Đúng hay sai',
  q:T('<b>Đúng ghi Đ, sai ghi S</b> cho từng ý.','<b>True or false?</b> Mark each line T or F.'),
  say:T('Đúng ghi Đ, sai ghi S cho từng ý.','True or false? Mark each line.'),
  sol:L.map((t,i)=>`${t.replace(/&gt;/g,'>').replace(/&lt;/g,'<')}: ${a[i]?T('Đ','T'):T('S','F')}`).join(' · ')})}

/* Đặt tính rồi tính (lớp 2, cộng/trừ có nhớ): hai số viết thẳng cột, em điền từng chữ số của kết quả từ phải sang trái.
   Ô "nhớ" nhỏ trên đầu cột để em tự ghi nhớ 1 (không chấm). */
function datTinh(mode,OP,kb){const big=mode==='1000';let a,b,op,r;
 for(let t=0;t<500;t++){op=OP||(Math.random()<.5?'+':'−');const mot=kb===1||(!kb&&Math.random()<.4);
  if(!big){if(op==='+'){a=RR(11,89);b=mot?RR(2,9):RR(11,89);r=a+b;if(r>100||a%10+b%10<10)continue}
   else{a=RR(21,99);b=mot?RR(2,9):RR(11,a-1);r=a-b;if(r<0||a%10>=b%10)continue}}
  else{if(op==='+'){a=RR(101,899);b=RR(11,Math.max(11,999-a));r=a+b;if(r>1000||(a%10+b%10<10&&Math.floor(a/10)%10+Math.floor(b/10)%10<10))continue}
   else{a=RR(200,999);b=RR(11,a-10);r=a-b;if(r<10||(a%10>=b%10&&Math.floor(a/10)%10>=Math.floor(b/10)%10))continue}}
  break}
 const n=Math.max(String(a).length,String(b).length,String(r).length),dg=x=>String(x).padStart(n,' ').split('').map(c=>c===' '?'':+c);
 const ra=String(r).split('').map(Number),rr=dg(r).map((c,i)=>i<n-ra.length?'':null);
 /* lời giải theo từng hàng */
 const A=dg(a),B=dg(b),PL=[T('đơn vị','ones'),T('chục','tens'),T('trăm','hundreds')],st=[];let c=0;
 for(let k=n-1;k>=0;k--){const x=+A[k]||0,y=+B[k]||0,h=PL[n-1-k];if(A[k]===''&&B[k]===''&&!c)break;
  if(op==='+'){const s0=x+y+c;st.push(T(`Hàng ${h}: ${x} + ${y}${c?' + 1 (nhớ)':''} = ${s0}, viết ${s0%10}${s0>=10&&k>0?', nhớ 1':''}.`,`${h}: ${x} + ${y}${c?' + 1 (carried)':''} = ${s0}, write ${s0%10}${s0>=10&&k>0?', carry 1':''}.`));c=s0>=10?1:0}
  else{const y2=y+c,mu=x<y2;const top=mu?x+10:x;st.push(T(`Hàng ${h}: ${mu?`${x} không trừ được ${y2}, lấy ${top} − ${y2}`:`${x} − ${y2}`} = ${top-y2}, viết ${top-y2}${mu?', nhớ 1':''}.`,`${h}: ${mu?`${x} is less than ${y2}, so ${top} − ${y2}`:`${x} − ${y2}`} = ${top-y2}, write ${top-y2}${mu?', carry 1':''}.`));c=mu?1:0}}
 return cq({lay:'vert',rows:[A,B,rr],op,n,a:ra,va:a,vb:b,kind:'Đặt tính rồi tính',label:'Đặt tính rồi tính',
  q:T(`<b>Đặt tính rồi tính</b>: ${fmt(a)} ${op} ${fmt(b)}. Điền kết quả từ phải sang trái.`,`<b>Column ${op==='+'?'addition':'subtraction'}</b>: ${fmt(a)} ${op} ${fmt(b)}. Fill in the answer from right to left.`),
  say:T(`Đặt tính rồi tính: ${a} ${op==='+'?'cộng':'trừ'} ${b}. Em tính từ hàng đơn vị nhé.`,`Work out ${a} ${op==='+'?'plus':'minus'} ${b} in columns. Start with the ones.`),
  sol:st.join(' ')})}

/* ---------- T-27: 6 dạng mới rút từ VBT lớp 1 tập 2, lớp 2 tập 1–2 (viết lại, không chép sách) ---------- */
const nhoKhong=(a,b,op)=>{for(;a||b;a=Math.floor(a/10),b=Math.floor(b/10)){const x=a%10,y=b%10;if(op==='+'?x+y>9:x<y)return false}return true};
/* 1) Chuỗi phép tính: số đầu → (+a) → □ → (−b) → □ → (+c) → □ */
function chuoiPT(M,kieu){const st=kieu==='1000'?3:3;let v0,ops,vals;
 const opnd=op=>kieu==='20'?RR(2,9):kieu==='1000'?RR(1,9)*(Math.random()<.5?100:10)+(Math.random()<.3?RR(1,9):0):kieu==='nhan'?(op==='×'?pick([2,5]):RR(2,9)):Math.random()<.5?RR(1,9)*10:RR(2,9)+(Math.random()<.5?RR(1,6)*10:0);
 for(let t=0;t<400;t++){v0=kieu==='20'?RR(3,15):kieu==='1000'?RR(1,8)*100+RR(0,9)*10:kieu==='nhan'?RR(1,9):RR(10,70);ops=[];vals=[];let v=v0,ok=true;
  for(let k=0;k<st;k++){let op=kieu==='nhan'&&k===0?'×':Math.random()<.5?'+':'−';const d=opnd(op);const w=op==='+'?v+d:op==='−'?v-d:v*d;
   if(w<0||w>M||(kieu==='khong'&&op!=='×'&&!nhoKhong(v,d,op))){ok=false;break}ops.push([op,d]);vals.push(w);v=w}
  if(ok)break}
 return cq({lay:'chain',v0,ops,rows:[],a:vals,kind:'Chuỗi phép tính',label:'Chuỗi phép tính',
  q:T('<b>Chuỗi phép tính</b>: tính lần lượt theo mũi tên, điền kết quả vào ô trống.','<b>Number chain</b>: follow the arrows and fill in each result.'),
  say:T('Chuỗi phép tính. Em tính lần lượt theo mũi tên nhé.','Number chain. Follow the arrows.'),
  sol:(()=>{let v=v0;return ops.map(([o,d],i)=>{const r=`${fmt(v)} ${o} ${fmt(d)} = ${fmt(vals[i])}`;v=vals[i];return r}).join(' · ')})()})}
/* 2) Bảng thành phần phép tính (3 cột, mỗi cột ẩn 1 ô) */
const TL_BANG={cong:[['Số hạng','Addend'],['Số hạng','Addend'],['Tổng','Sum'],'+'],tru:[['Số bị trừ','Minuend'],['Số trừ','Subtrahend'],['Hiệu','Difference'],'−'],
 nhan:[['Thừa số','Factor'],['Thừa số','Factor'],['Tích','Product'],'×'],chia:[['Số bị chia','Dividend'],['Số chia','Divisor'],['Thương','Quotient'],':']};
function bangTP(loai,M,ban){const cols=[];const seen=new Set();
 for(let t=0;cols.length<3&&t<200;t++){let x,y,z;
  if(loai==='cong'){x=RR(10,M-10);y=RR(1,M-x);z=x+y}else if(loai==='tru'){x=RR(20,M);y=RR(1,x-1);z=x-y}
  else{const f=ban?pick(ban):pick([2,5]),k=RR(1,10);if(loai==='nhan'){x=Math.random()<.5?f:k;y=x===f?k:f;z=x*y}else{x=f*k;y=f;z=k}}
  const key=x+'|'+y;if(seen.has(key))continue;seen.add(key);cols.push([x,y,z])}
 const an=cols.map(()=>RR(0,2)),rows=[0,1,2].map(r=>cols.map((c,j)=>an[j]===r?null:c[r])),a=[];rows.forEach((r,i)=>r.forEach((v,j)=>{if(v===null)a.push(cols[j][i])}));
 const L=TL_BANG[loai];
 return cq({lay:'tbl',loai,cols,rows,a,hd:[0,1,2].map(i=>T(L[i][0],L[i][1])),kind:'Bảng thành phần phép tính',label:'Bảng thành phần phép tính',
  q:T(`<b>Điền số vào bảng</b>: mỗi cột là một phép ${{cong:'cộng',tru:'trừ',nhan:'nhân',chia:'chia'}[loai]}.`,`<b>Fill in the table</b>: each column is one ${{cong:'addition',tru:'subtraction',nhan:'multiplication',chia:'division'}[loai]}.`),
  say:T(`Điền số vào bảng. Mỗi cột là một phép ${{cong:'cộng',tru:'trừ',nhan:'nhân',chia:'chia'}[loai]}.`,'Fill in the table. Each column is one calculation.'),
  sol:cols.map(c=>`${c[0]} ${L[3]} ${c[1]} = ${c[2]}`).join(' · ')})}
/* 3) Chữ số bí ẩn trong phép đặt tính (mỗi cột ẩn tối đa 1 chữ số, nên chỉ có một cách điền) */
function soBiAn(mode,OP){const g1=mode==='1';let a,b,op,r;
 for(let t=0;t<500;t++){op=OP||(Math.random()<.5?'+':'−');
  if(mode==='1000'){if(op==='+'){a=RR(110,880);b=RR(11,999-a);r=a+b}else{a=RR(200,999);b=RR(11,a-10);r=a-b}}
  else{if(op==='+'){a=RR(11,88);b=RR(11,88);r=a+b}else{a=RR(21,99);b=RR(11,a-1);r=a-b}}
  if(r<10||r>(mode==='1000'?999:99))continue;if(g1&&!nhoKhong(a,b,op))continue;if(!g1&&nhoKhong(a,b,op))continue;break}
 const n=Math.max(String(a).length,String(b).length,String(r).length),dg=x=>String(x).padStart(n,' ').split('').map(c=>c===' '?'':+c);
 const R=[dg(a),dg(b),dg(r)],ka=shuf(Array.from({length:n},(_,i)=>i)).slice(0,Math.min(n,g1?2:3));
 ka.forEach(k=>{const rr=shuf([0,1,2]).find(i=>R[i][k]!=='');if(rr!==undefined)R[rr][k]=null});
 const D=[dg(a),dg(b),dg(r)],ans=[];R.forEach((row,i)=>row.forEach((v,k)=>{if(v===null)ans.push(D[i][k])}));
 return cq({lay:'vmiss',rows:R,op,n,va:a,vb:b,a:ans,kind:'Chữ số bí ẩn',label:'Chữ số bí ẩn',tt:1,
  q:T('<b>★ Chữ số bí ẩn</b>: điền chữ số còn thiếu để phép tính đúng.','<b>★ Missing digits</b>: fill in the digits to make the sum correct.'),
  say:T('Chữ số bí ẩn. Em điền chữ số còn thiếu để phép tính đúng nhé.','Missing digits. Fill them in to make the sum correct.'),
  sol:`${fmt(a)} ${op} ${fmt(b)} = ${fmt(r)}`})}
/* 4) Mỗi hình là một số */
const TL_HINHS=[['▲','#E0441A'],['●','#0079C1'],['■','#1E9A52']];
function hinhSo(g,nhan){let v,E;
 for(let t=0;t<300;t++){if(g===1){v=[RR(1,5),RR(0,5)];E=[[[0,'+',0],v[0]*2],[[0,'+',1],v[0]+v[1]]];if(v[0]!==v[1])break;continue}
  if(nhan){v=[RR(2,9),RR(1,20),0];E=[[[0,'×',5],null],[[1,'+',0],null]];E[0][1]=v[0]*5;E[1][1]=v[1]+v[0];E.length=2;v.length=2;break}
  v=[RR(5,40),RR(5,40),0];v[2]=RR(1,v[1]);E=[[[0,'+',0],v[0]*2],[[0,'+',1],v[0]+v[1]],[[1,'−',2],v[1]-v[2]]];if(new Set(v).size===3&&v[0]+v[1]<=100)break}
 const sh=i=>`<b class="tlsh" style="color:${TL_HINHS[i][1]}">${TL_HINHS[i][0]}</b>`,tok=x=>typeof x==='number'?sh(x):x;
 return cq({lay:'shape',eqs:E.map(([l,r])=>({h:`${tok(l[0])} ${l[1]} ${typeof l[2]==='number'&&!(nhan&&l[1]==='×')?tok(l[2]):l[2]} = ${fmt(r)}`,l,r})),shs:v.map((_,i)=>sh(i)),nh:!!nhan,rows:[],a:v.slice(),kind:'Mỗi hình là một số',label:'Mỗi hình là một số',tt:1,
  q:T('<b>★ Mỗi hình là một số</b>: hình giống nhau là số giống nhau. Tìm số của mỗi hình.','<b>★ Shape puzzle</b>: the same shape is the same number. Find each number.'),
  say:T('Mỗi hình là một số. Hình giống nhau là số giống nhau. Em tìm số của mỗi hình nhé.','Shape puzzle. The same shape is the same number.'),
  sol:v.map((x,i)=>`${TL_HINHS[i][0]} = ${x}`).join(' · ')})}
/* 5) Tách số theo trăm, chục, đơn vị */
function tachSo(g){const ba=g===2;const n=ba?RR(101,999):RR(11,99),h=Math.floor(n/100),c=Math.floor(n/10)%10,u=n%10,k=RR(0,2);let rows,a;
 if(ba){if(k===0){rows=[[n,'=',null,'+',null,'+',null]];a=[h*100,c*10,u]}else if(k===1){rows=[[null,'=',h*100,'+',c*10,'+',u]];a=[n]}else{rows=[[n,'=',null,'+',c*10,'+',null]];a=[h*100,u]}}
 else{if(k===0){rows=[[n,'=',null,'+',null]];a=[c*10,u]}else if(k===1){rows=[[null,'=',c*10,'+',u]];a=[n]}else{rows=[[n,'=',c*10,'+',null]];a=[u]}}
 return cq({lay:'split',n,rows,a,kind:'Tách số theo hàng',label:'Tách số theo hàng',
  q:T(`<b>Viết số thành tổng</b> các ${ba?'trăm, chục, đơn vị':'chục và đơn vị'}.`,`<b>Write the number</b> as ${ba?'hundreds + tens + ones':'tens + ones'}.`),
  say:T(`Viết số thành tổng các ${ba?'trăm, chục, đơn vị':'chục và đơn vị'}.`,'Write the number as a sum of its place values.'),
  sol:ba?`${n} = ${h*100} + ${c*10} + ${u}`:`${n} = ${c*10} + ${u}`})}
/* 6) Đếm nhảy: dãy số cách đều, điền số còn thiếu */
function demNhay(steps,lo,hi){const s=pick(steps)*(Math.random()<.3?-1:1);let v0;for(let t=0;t<100;t++){v0=RR(lo,hi);const end=v0+6*s;if(end>=lo&&end<=hi&&(Math.abs(s)<10||v0%Math.abs(s)===0||Math.random()<.3))break}
 const L=Array.from({length:7},(_,i)=>v0+i*s),an=shuf([2,3,4,5,6]).slice(0,3).sort((x,y)=>x-y),rows=[L.map((v,i)=>an.includes(i)?null:v)];
 return cq({lay:'seq',st:s,rows,a:an.map(i=>L[i]),kind:'Đếm nhảy',label:'Đếm nhảy',
  q:T(`<b>Đếm ${s>0?'thêm':'bớt'}</b>: dãy số cách đều nhau. Điền số còn thiếu.`,`<b>Count ${s>0?'on':'back'}</b>: the numbers go up or down by the same step. Fill in the gaps.`),
  say:T(`Đếm ${s>0?'thêm':'bớt'} ${Math.abs(s)}. Em điền số còn thiếu nhé.`,`Count ${s>0?'on':'back'} in ${Math.abs(s)}s.`),
  sol:T(`Mỗi số ${s>0?'hơn':'kém'} số trước ${Math.abs(s)}: `,`Each number ${s>0?'adds':'takes away'} ${Math.abs(s)}: `)+L.join(', ')})}
function tlThem(x){const g=curG(),b=x.b,L=[];
 if(g===1){if(b===21||b===22||b===23||b===24)L.push(()=>demNhay([1,2,5,10],0,100),()=>tachSo(1));if(b>=29&&b<=33||b===39)L.push(()=>chuoiPT(99,'khong'))}
 if(g===2){if(b===1||b===2)L.push(()=>demNhay([2,5,10],0,100),()=>tachSo(1));if(b===3)L.push(()=>bangTP('cong',100),()=>bangTP('tru',100));
  if(b===5||b===6)L.push(()=>chuoiPT(99,'khong'),()=>bangTP('cong',100));if(b>=7&&b<=14)L.push(()=>chuoiPT(20,'20'));if(b>=19&&b<=24||b===33||b===69)L.push(()=>chuoiPT(100,'100'));
  if(b===38)L.push(()=>bangTP('nhan',50));if(b===39)L.push(()=>bangTP('nhan',50,[2]),()=>demNhay([2],0,40));if(b===40)L.push(()=>bangTP('nhan',50,[5]),()=>demNhay([5],0,100));
  if(b===42)L.push(()=>bangTP('chia',50));if(b===43)L.push(()=>bangTP('chia',50,[2]));if(b===44)L.push(()=>bangTP('chia',50,[5]));if(b===45||b===71)L.push(()=>bangTP(pick(['nhan','chia']),50),()=>chuoiPT(100,'nhan'));
  if(b>=48&&b<=54||b===68)L.push(()=>demNhay([10,100,1],100,1000),()=>tachSo(2));if(b>=59&&b<=63||b===70)L.push(()=>chuoiPT(1000,'1000'))}
 return L}
function tlThemTT(x){const g=curG(),b=x.b,L=[];
 if(g===1){if(b>=29&&b<=33||b===39)L.push(()=>soBiAn('1'));if(b>=12&&b<=13||b===18||b===20||b===38)L.push(()=>hinhSo(1))}
 if(g===2){if(b>=19&&b<=24||b===33||b===69){const o={19:'+',20:'+',21:'+',22:'−',23:'−'}[b];L.push(()=>soBiAn('100',o),()=>hinhSo(2))}
  if(b===14||b===10)L.push(()=>hinhSo(2));if(b===45)L.push(()=>hinhSo(2,1));if(b===60||b===62||b===63||b===70){const o={60:'+',62:'−'}[b];L.push(()=>soBiAn('1000',o))}}
 return L}

/* dạng mới hợp với từng bài (theo số bài KNTT) */
function tlNew(x){const g=curG(),b=x.b;
 if(g===1){if(b===4)return[()=>dungSai(1,'so')];if(b===5||b===6)return[()=>nhaSo(1),()=>dungSai(1,'so')];if(b===10||b===11)return[()=>giaDinh(1),()=>nhaSo(1),()=>dungSai(1)];if(b>=12&&b<=13||b===18||b===20||b===38)return[()=>giaDinh(1),()=>nhaSo(1),()=>toMau(1),()=>dungSai(1)];if(b>=29&&b<=33||b===39)return[()=>giaDinh(1,'100'),()=>dungSai(1,'100')];if(b===22)return[()=>dungSai(1,'so')];return[]}
 if(g===2){if(b>=7&&b<=14)return[()=>giaDinh(2,'20'),()=>nhaSo(2),()=>toMau(2),()=>dungSai(2)];if(b===3||b===5||b===6)return[()=>giaDinh(2,'100'),()=>dungSai(2,'100')];if(b>=19&&b<=24||b===33||b===69){const D={19:['+',1],20:['+',2],21:['+'],22:['−',1],23:['−',2]}[b]||[];return[()=>datTinh('100',...D),()=>datTinh('100',...D),()=>giaDinh(2,'nho'),()=>dungSai(2,'100')]}if(b===60||b===62||b===63||b===70){const o=b===60?'+':b===62?'−':undefined;return[()=>datTinh('1000',o),()=>datTinh('1000',o)]}return[]}
 return[]}
function tlChal(x){const g=curG(),b=x.b;
 if(g===1&&(b>=10&&b<=11))return[()=>thapSo(1,10),()=>tamGiac(1,10)];
 if(g===1&&(b>=12&&b<=13||b===18||b===20||b===38))return[()=>thapSo(1,10),()=>tamGiac(1,10),()=>luoiPT(1)];
 if(g===2&&(b>=7&&b<=14))return[()=>thapSo(2,20),()=>tamGiac(2,20),()=>luoiPT(2)];
 if(g===2&&(b>=19&&b<=24||b===33||b===69))return[()=>thapSo(2,100)];
 return[]}

{const _n=tlNew,_c=tlChal;tlNew=x=>_n(x).concat(tlThem(x));tlChal=x=>_c(x).concat(tlThemTT(x))}
/* ---------- sinh trang theo seed ---------- */
function tlQs(x,seed){const mr=Math.random;Math.random=seedRnd(seed);const qs=[];
 try{const L=[0,1].filter(l=>x.lv[l]),cand=shuf(L.flatMap(l=>x.lv[l].map((_,gi)=>[l,gi]))),used=new Set();
  const add=(l,gi)=>{let q;try{q=x.lv[l][gi]()}catch(e){q=null}if(!q)return false;const k=q.kind||'';if(used.has(k)&&cand.length>8)return false;used.add(k);qs.push({...q,src:[x.id,l,gi],key:`${x.id}:${l}:${gi}`,label:q.kind||'Câu hỏi'});return true};
  const nw=tlNew(x),want=nw.length?4:5;
  for(let i=0;i<cand.length*2&&qs.length<want;i++)add(...cand[i%cand.length]);
  for(let t=0;t<40&&qs.length<want&&cand.length;t++){const c=pick(cand);let q;try{q=x.lv[c[0]][c[1]]()}catch(e){q=null}if(q)qs.push({...q,src:[x.id,c[0],c[1]],key:`${x.id}:${c[0]}:${c[1]}`,label:q.kind||'Câu hỏi'})}
  if(nw.length)qs.splice(2,0,{...pick(nw)(),key:'',src:null});
  const ch=tlChal(x);let c;
  if(ch.length)c={...pick(ch)(),key:'',src:null};
  else{const l=x.lv[2]?2:x.lv.length-1;for(let k=0;k<6&&!c;k++){const gi=RR(0,x.lv[l].length-1);try{const q=x.lv[l][gi]();if(q)c={...q,src:[x.id,l,gi],key:`${x.id}:${l}:${gi}`,label:q.kind||'Câu hỏi'}}catch(e){}}}
  if(c){c.tt=1;qs.push(c)}}
 finally{Math.random=mr}
 return qs.map(q=>q.type!=='cells'&&typeof trQ==='function'&&arcEN()?trQ(q):q)}
function tlBlank(g){Object.assign(g,{sheet:null,tries:0,inp:'',picks:[],seq:[],fill:[],used:[],cnt:0,hit:false,mad:0,cv:null,cc:0,t0:Date.now()})}
window.tlGo=function(id){const st=S.st[sid],x=isl1(id);if(!x)return;const r=tlR(st)[id]||(tlR(st)[id]={n:0});
 if(!r.cur)r.cur={seed:(Math.random()*2**31)|0,j:0,res:[],tt:0};save();try{speechSynthesis.cancel()}catch(e){}
 const qs=tlQs(x,r.cur.seed);v1Said='';const g0={k:'game',g1:1,tl:1,id,lv:0,qs,j:Math.min(r.cur.j,qs.length-1),hearts:3,ok:r.cur.res.filter(Boolean).length,res:r.cur.res.slice(),hp:0};tlBlank(g0);go(g0);tlBlank(scr);render()};
/* Thử thách hôm nay: 1 lượt/ngày, câu ★ của trang mới nhất em đã mở */
function tlDayOk(st){return st.tlDay&&st.tlDay.d===S.day}
function tlDayIsl(st){const P=tlPages(st);for(let i=P.length-1;i>=0;i--)if(tlChal(P[i]).length)return P[i];return P[P.length-1]}
window.tlDayGo=function(){const st=S.st[sid];if(tlDayOk(st)){toast(T('Hôm nay em đã làm Thử thách rồi. Mai quay lại nhé!','You have done today’s challenge. Come back tomorrow!'));return}
 const x=tlDayIsl(st);if(!x)return;const qs=tlQs(x,(Math.random()*2**31)|0).filter(q=>q.tt).slice(-1);if(!qs.length)return;
 v1Said='';const g0={k:'game',g1:1,tl:1,tlDay:1,id:x.id,lv:0,qs,j:0,hearts:3,ok:0,res:[],hp:0};tlBlank(g0);go(g0);tlBlank(scr);render()};

/* ---------- vẽ ô ---------- */
function tlFig(q){const g=scr;let b=0;
 const cell=c=>{if(c===null){const i=b++,v=(g.cv&&g.cv[i])||'';return`<button type="button" class="tc e ${i===g.cc?'cur':''} ${g.cbad&&g.cbad.includes(i)?'bad':''}" onclick="tlCell(${i})" aria-label="${T('Ô trống','Blank')} ${i+1}">${esc(v)}</button>`}
  if(c==='')return`<span class="tc gap"></span>`;if(typeof c==='string')return`<span class="tc op">${c}</span>`;return`<span class="tc">${fmt(c)}</span>`};
 if(q.lay==='color'){const c=(g.cv||[]);return`<div class="tlcol">${q.cells.map((t,i)=>{const v=c[i],col=v!==''&&v!=null?TL_MAU[+v][0]:'';return`<button type="button" class="cc ${col?'on':''} ${g.cbad&&g.cbad.includes(i)?'bad':''}" ${col?`style="background:${col}"`:''} onclick="tlCell(${i})"><span class="cct">${t}</span></button>`}).join('')}</div>`}
 if(q.lay==='ds'){const c=(g.cv||[]);return`<div class="tlds">${q.st.map((t,i)=>`<div class="dsr ${g.cbad&&g.cbad.includes(i)?'bad':''}"><span class="dst">${t}</span><button type="button" class="dsb ${c[i]==='1'?'on':''}" onclick="tlDS(${i},1)" aria-pressed="${c[i]==='1'}">${T('Đ','T')}</button><button type="button" class="dsb ${c[i]==='0'?'on':''}" onclick="tlDS(${i},0)" aria-pressed="${c[i]==='0'}">${T('S','F')}</button></div>`).join('')}</div>`}
 if(q.lay==='chain'){let k=0;return`<div class="tlchain"><span class="tc">${fmt(q.v0)}</span>${q.ops.map(([o,d])=>`<span class="tca"><i>${o} ${fmt(d)}</i>→</span>${cell(null)}`).join('')}</div>`}
 if(q.lay==='tbl'){return`<div class="tltbl" style="grid-template-columns:auto repeat(${q.cols.length},46px)">${q.rows.map((r,i)=>`<span class="th">${q.hd[i]}</span>${r.map(cell).join('')}`).join('')}</div>`}
 if(q.lay==='vmiss'){const n=q.n;return`<div class="tlvert" style="grid-template-columns:repeat(${n+1},44px)"><span class="tc gap"></span>${q.rows[0].map(c=>c===''?'<span class="tc gap"></span>':cell(c)).join('')}<span class="tc op vop">${q.op}</span>${q.rows[1].map(c=>c===''?'<span class="tc gap"></span>':cell(c)).join('')}<i class="vline" style="grid-column:1/-1"></i><span class="tc gap"></span>${q.rows[2].map(c=>c===''?'<span class="tc gap"></span>':cell(c)).join('')}</div>`}
 if(q.lay==='shape'){return`<div class="tlshape">${q.eqs.map(e=>`<div class="eqs">${e.h}</div>`).join('')}<div class="ans">${q.shs.map(s=>`<span>${s} = ${cell(null)}</span>`).join('')}</div></div>`}
 if(q.lay==='seq'){return`<div class="tlseq">${q.rows[0].map(cell).join('')}</div>`}
 if(q.lay==='vert'){const [A,B,R]=q.rows;let bi=0;const n=q.n,col=`grid-template-columns:repeat(${n+1},44px)`;
  const nho=`<span class="tc gap"></span>`+A.map((_,k)=>k<n-1?`<button type="button" class="vn ${(g.nho||[]).includes(k)?'on':''}" onclick="tlNho(${k})" aria-label="${T('Ghi nhớ','Carry')}">${(g.nho||[]).includes(k)?'1':''}</button>`:`<span class="tc gap"></span>`).join('');
  const dg=c=>c===''?`<span class="tc gap"></span>`:`<span class="tc vd">${c}</span>`;
  const res=R.map(c=>c===''?`<span class="tc gap"></span>`:(()=>{const i=bi++,v=(g.cv&&g.cv[i])||'';return`<button type="button" class="tc e ${i===g.cc?'cur':''} ${g.cbad&&g.cbad.includes(i)?'bad':''}" onclick="tlCell(${i})" aria-label="${T('Chữ số kết quả','Answer digit')} ${i+1}">${esc(v)}</button>`})()).join('');
  return`<div class="tlvert" style="${col}">${nho}<span class="tc gap"></span>${A.map(dg).join('')}<span class="tc op vop">${q.op}</span>${B.map(dg).join('')}<i class="vline" style="grid-column:1/-1"></i><span class="tc gap"></span>${res}</div>`}
 if(q.lay==='house')return`<div class="tlhouse"><div class="roof"><span>${q.roof}</span></div><div class="floors">${q.rows.map(r=>`<div class="fl">${r.map(cell).join('')}</div>`).join('')}</div></div>`;
 if(q.lay==='fam')return`<div class="tlfam"><div class="tlsd"><span class="tc">${q.head[0]}</span><i class="l1"></i><i class="l2"></i><span class="tc">${q.head[1]}</span><span class="tc">${q.head[2]}</span></div>${q.rows.map(r=>`<div class="eq">${r.map(cell).join('')}</div>`).join('')}</div>`;
 return`<div class="tlrows ${q.lay}">${q.lay==='tri'?`<div class="trisum">${T('Mỗi cạnh','Each side')} = ${q.sum}</div>`:''}${q.rows.map(r=>`<div class="rw">${r.map(cell).join('')}</div>`).join('')}</div>`}
const nBl=q=>q.a.length;
window.tlCell=function(i){const g=scr,q=q1();if(g.sheet)return;if(q&&q.lay==='color'){g.cv=g.cv||q.a.map(()=>'');g.cv[i]=g.cv[i]===String(g.pc||0)?'':String(g.pc||0);g.cbad=null}else g.cc=i;sfx('tap');render()};
window.tlNho=function(k){const g=scr;g.nho=g.nho||[];g.nho=g.nho.includes(k)?g.nho.filter(x=>x!==k):[...g.nho,k];sfx('tap');render()};
window.tlPC=function(k){scr.pc=k;sfx('tap');render()};
window.tlDS=function(i,v){const g=scr,q=q1();if(g.sheet)return;g.cv=g.cv||q.a.map(()=>'');g.cv[i]=String(v);g.cbad=null;sfx('tap');render()};
window.tlXong=function(){const g=scr,q=q1();g.cv=g.cv||q.a.map(()=>'');if(g.cv.every(v=>v!==''&&v!=null))ans1(g.cv.map(Number));else toast(q.lay==='color'?T('Em tô hết các ô nhé.','Colour every box first.'):q.lay==='ds'?T('Em chọn Đ hoặc S cho mọi ý nhé.','Mark every line first.'):T('Em điền hết các ô trống nhé.','Fill in every box first.'))};
window.tlKey=function(k){const g=scr,q=q1();if(g.sheet||!q||q.type!=='cells'||q.lay==='color'||q.lay==='ds')return;g.cv=g.cv||q.a.map(()=>'');const v=g.cv[g.cc]||'';
 if(k==='⌫'){g.cv[g.cc]=v.slice(0,-1)}
 else if(k==='✓'){if(g.cv.every(Boolean))ans1(g.cv.map(Number));else{toast(T('Em điền hết các ô trống nhé.','Fill in every box first.'));return}}
 else{const mx=Math.max(...q.a).toString().length;if(v.length>=mx)g.cv[g.cc]=k;else g.cv[g.cc]=v+k;
  if(g.cv[g.cc].length>=mx&&q.lay==='vert'){let p=-1;for(let i=g.cc-1;i>=0;i--)if(!g.cv[i]){p=i;break}if(p<0)p=g.cv.lastIndexOf('');if(p>=0)g.cc=p}
  else if(g.cv[g.cc].length>=mx){const nx=g.cv.findIndex((x,i)=>i>g.cc&&!x);const n0=g.cv.findIndex(x=>!x);if(nx>=0)g.cc=nx;else if(n0>=0)g.cc=n0}}
 g.cbad=null;sfx('tap');render()};

/* ---------- nối vào bộ chơi ---------- */
{const _r=right1;right1=function(q,v){if(q&&q.type==='cells')return Array.isArray(v)&&v.length===q.a.length&&v.every((x,i)=>Number(x)===q.a[i]);return _r.apply(this,arguments)}}
{const _s=show1;show1=function(q){if(q&&q.type==='cells')return q.lay==='color'||q.lay==='ds'?'':q.lay==='vert'?q.a.join(''):q.a.join(', ');return _s.apply(this,arguments)}}
{const _i=input1;input1=function(q){if(!(q&&q.type==='cells'))return _i.apply(this,arguments);
 if(q.lay==='color')return`<div class="tlpal">${q.vals.map((v,k)=>`<button type="button" class="pc ${(scr.pc||0)===k?'on':''}" onclick="tlPC(${k})" aria-pressed="${(scr.pc||0)===k}" aria-label="${T(TL_MAU[k][1],TL_MAU[k][2])} ${v}"><i style="background:${TL_MAU[k][0]}"></i>= ${v}</button>`).join('')}</div><button class="gobtn" type="button" onclick="tlXong()">${T('Xong','Done')}</button>`;
 if(q.lay==='ds')return`<button class="gobtn" type="button" onclick="tlXong()">${T('Xong','Done')}</button>`;
 return`<div class="pad">${['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map(k=>`<button type="button" class="${k==='✓'?'go':k==='⌫'?'del':''}" onclick="tlKey('${k}')" aria-label="${k==='⌫'?T('Xóa','Delete'):k==='✓'?T('Xong','Done'):k}">${k==='✓'?T('Xong','Done'):k}</button>`).join('')}</div>`}}
function tlSave(){const g=scr,st=S.st[sid];if(g.tlDay)return;const r=tlR(st)[g.id];if(r&&r.cur){r.cur.j=g.j;r.cur.res=g.res.slice()}}
{const _a=ans1;ans1=function(v){const g=scr;if(!(g&&g.tl))return _a.apply(this,arguments);if(g.sheet||g.end)return;
 const q=q1(),ok=right1(q,v),st=S.st[sid],x=isl1(g.id),first=!g.tries,fromIsl=!!(q.key&&q.src);
 try{hsRec(q,ok,first,1,(q.src&&q.src[0])||g.id)}catch(e){}
 if(!ok&&first&&fromIsl){try{mist1Add(q);gdMistNote(q,{wa:gdShowAns(q,v),from:T('Tự luyện','Self-practice')})}catch(e){}}
 log(sid,'answered',`Tự luyện · ${x.title}`,0,{success:ok,duration:`PT${Math.round((Date.now()-g.t0)/1000)}S`});
 if(ok){g.ok++;if(g.res[g.j]===undefined)g.res[g.j]=true;const c=addCoins(sid,q.tt?TL_TT:TL_XU,'self');sfx('ok');
  g.sheet={kind:'ok',msg:`+${c} ${T('xu','coins')}`};sayJ(pick(T('Giỏi quá!|Đúng rồi!|Tuyệt vời!','Brilliant!|Correct!|Well done!').split('|')))}
 else{g.tries++;sfx('bad');
  if(g.tries===1){if(q.type==='cells'){g.cbad=[];g.cv=g.cv.map((x,i)=>{if(Number(x)===q.a[i])return x;g.cbad.push(i);return''});g.cc=q.lay==='vert'?g.cbad[g.cbad.length-1]:g.cbad[0]||0}
   g.sheet={kind:'tlretry'};sayJ(T('Chưa đúng rồi. Em thử lại nhé.','Not quite. Try again.'))}
  else{g.res[g.j]=false;g.sheet={kind:'bad'};sayJ(String(q.sol||'').replace(/<[^>]+>/g,' ').replace(/−/g,' trừ ').replace(/=/g,' bằng '))}}
 tlSave();save();render()}}
{const _s=sheet1;sheet1=function(){const g=scr;if(g&&g.tl&&g.sheet&&g.sheet.kind==='tlretry')
  return`<div class="sheet warn"><div class="sh"><span class="ic">?</span><div><b>${T('Chưa đúng.','Not quite.')}</b><div>${q1().type==='cells'?T('Ô sai đã được xoá. Em điền lại nhé.','Wrong boxes were cleared. Try again.'):T('Em nhìn kỹ và thử lại nhé.','Look carefully and try again.')}</div></div></div><button class="gobtn" type="button" onclick="retry1()">${T('Thử lại','Try again')}</button></div>`;
 return _s.apply(this,arguments)}}
{const _r=retry1;retry1=function(){const g=scr;if(!(g&&g.tl))return _r.apply(this,arguments);const cv=g.cv,cc=g.cc,cb=g.cbad,r=_r.apply(this,arguments);g.cv=cv;g.cc=cc;g.cbad=cb;render();return r}}
{const _n=next1;next1=function(){const g=scr;if(!(g&&g.tl))return _n.apply(this,arguments);
 if(g.j>=g.qs.length-1){tlEnd();return}g.j++;tlBlank(g);tlSave();save();render()}}
function tlEnd(){const g=scr,st=S.st[sid],x=isl1(g.id),tt=g.qs.findIndex(q=>q.tt),nb=g.qs.filter(q=>!q.tt).length;
 const ok=g.res.filter((v,i)=>v&&!g.qs[i].tt).length,tok=tt>=0&&g.res[tt]===true;g.end=true;
 if(g.tlDay){st.tlDay={d:S.day,ok:tok};log(sid,'completed',`Tự luyện · Thử thách hôm nay`,0,{success:tok});g.tlRes={day:1,ok:tok};sfx(tok?'win':'ok');save();render();return}
 const r=tlR(st)[g.id]||(tlR(st)[g.id]={n:0}),res={ok,n:nb,tt:tok?1:0,t:Date.now()};r.n=(r.n||0)+1;r.last=res;
 if(!r.best||ok>r.best.ok||(ok===r.best.ok&&res.tt>=r.best.tt))r.best=res;delete r.cur;
 const wrong=g.qs.some((q,i)=>!q.tt&&g.res[i]===false&&q.key);
 log(sid,'completed',`Tự luyện · Trang ${tlIdx(x)} · ${x.title}`,0,{success:true,score:{raw:ok,max:nb}});g.tlRes={ok,n:nb,tt:tok,wrong,hasTT:tt>=0};
 sfx(ok>=nb-1?'win':'ok');save();render()}
function tlNextPage(id){const st=S.st[sid],P=tlPages(st),i=P.findIndex(x=>x.id===id);const nx=P.slice(i+1).find(x=>!(tlR(st)[x.id]||{}).best)||P.find(x=>!(tlR(st)[x.id]||{}).best);return nx}
function tlEndView(){const g=scr,x=isl1(g.id),R=g.tlRes||{},st=S.st[sid];
 if(R.day)return`<div class="game g1 tlgame"><div class="gmid"><section class="card tlend">${jenny(72,R.ok?'happy':'')}<div class="big">${R.ok?'★':'☆'}</div><b>${R.ok?T('Em đã vượt Thử thách hôm nay!','You beat today’s challenge!'):T('Chưa được rồi. Mai thử lại nhé!','Not this time. Try again tomorrow!')}</b>
  <div class="row" style="justify-content:center;gap:8px;margin-top:12px"><button class="btn sm pri" type="button" onclick="go({k:'home',tab:'tl'})">${T('Về Tự luyện','Back to practice')}</button></div></section></div></div>`;
 const nx=tlNextPage(g.id),msg=R.ok>=R.n?T('Giỏi lắm!','Excellent!'):R.ok>=R.n-1?T('Làm tốt lắm!','Well done!'):T('Cố thêm chút nữa nhé!','Keep going!');
 return`<div class="game g1 tlgame"><div class="gmid"><section class="card tlend">${jenny(72,R.ok>=R.n-1?'happy':'')}<div class="big">${R.ok}/${R.n}</div><b>${T(`Xong trang ${tlIdx(x)}! ${msg}`,`Page ${tlIdx(x)} done! ${msg}`)}</b>
  <div style="margin:8px 0">${R.hasTT?`<span class="pill ${R.tt?'warn':''}">${R.tt?T('★ Thử thách đúng','★ Challenge solved'):T('☆ Thử thách chưa đúng','☆ Challenge not solved')}</span>`:''}</div>
  ${R.wrong?`<p class="muted" style="font-size:13px;margin:6px 0 0">${T('Câu làm sai đã ghi vào Sổ lỗi sai.','Mistakes were saved to your mistake book.')}</p>`:''}
  <div class="row" style="justify-content:center;gap:8px;margin-top:12px"><button class="btn sm ghost" type="button" onclick="go({k:'home',tab:'tl'})">${T('Về Tự luyện','Back to practice')}</button>${nx?`<button class="btn sm pri" type="button" onclick="tlGo('${nx.id}')">${T('Trang tiếp','Next page')}</button>`:`<button class="btn sm pri" type="button" onclick="tlGo('${g.id}')">${T('Làm lại (số mới)','Again (new numbers)')}</button>`}</div></section></div></div>`}
{const _v=viewGame1;viewGame1=function(){const g=scr;if(!(g&&g.tl))return _v.apply(this,arguments);if(g.end)return tlEndView();
 const q=q1();if(q.type==='cells'&&(!g.cv||g.cv.length!==nBl(q))){g.cv=q.a.map(()=>'');g.cc=q.lay==='vert'?q.a.length-1:0;g.nho=[]}
 let h=_v.apply(this,arguments);const n=g.qs.length,nb=g.qs.filter(x=>!x.tt).length;
 h=h.replace('<div class="game g1"','<div class="game g1 tlgame"')
  .replace(/<div class="planks"[^>]*>(?:<i[^>]*><\/i>)*<\/div>/,`<div class="planks tlpl">${g.qs.map((x,k)=>`<i class="${g.res[k]===true?'ok':g.res[k]===false?'bad':k===g.j?'cur':''} ${x.tt?'tt':''}"></i>`).join('')}</div>`)
  .replace(/<span class="hearts"[^>]*>(?:<span[^>]*>❤<\/span>)*<\/span>/,`<span class="pill ${q.tt?'warn':'acc'}">${q.tt?T(`★ +${TL_TT} xu`,`★ +${TL_TT} coins`):T(`Bài ${g.j+1}/${nb}`,`Task ${g.j+1}/${nb}`)}</span>`)
  .replace(/<button class="gx" onclick="[^"]*"/,`<button class="gx" onclick="try{speechSynthesis.cancel()}catch(e){};go({k:'home',tab:'tl'})"`)
  .replace(/<div class="g1pic">@@TLFIG@@<\/div>/,q.type==='cells'?`<div class="g1pic tlfig">${tlFig(q)}</div>`:'');
 return h}}

/* ---------- Đặt tính rồi tính trong đảo và phiếu bài (T-05, thầy chốt 24/10/2026) ----------
   Lớp 2, các bài có nhớ: thêm bộ sinh "Đặt tính rồi tính" vào Màn 1 và Màn 2 của đảo. Phiếu bài, Luyện lỗi lấy câu từ đảo nên cũng có. */
const TL_DT={19:['100','+',1],20:['100','+',2],21:['100','+'],22:['100','−',1],23:['100','−',2],24:['100'],33:['100'],60:['1000','+'],62:['1000','−'],63:['1000'],69:['100'],70:['1000']};
try{(PRIM[2]?PRIM[2].isl:[]).forEach(x=>{const d=TL_DT[x.b];if(!d||x.dt)return;x.dt=1;[0,1].forEach(L=>{if(x.lv[L])x.lv[L].push(()=>datTinh(...d))})})}catch(e){}
/* ngoài Tự luyện: vẽ ô, khởi tạo ô theo câu, câu sai lần 1 xoá chữ số sai */
{const _v=viewGame1;viewGame1=function(){const g=scr;if(!g||g.tl||g.end||!g.qs)return _v.apply(this,arguments);const q=q1();
 if(q&&q.type==='cells'&&(g.cvj!==g.j||!g.cv||g.cv.length!==nBl(q))){g.cvj=g.j;g.cv=q.a.map(()=>'');g.cc=q.lay==='vert'?q.a.length-1:0;g.nho=[];g.cbad=null}
 let h=_v.apply(this,arguments);if(q&&q.type==='cells')h=h.replace(/<div class="g1pic">@@TLFIG@@<\/div>/,`<div class="g1pic tlfig">${tlFig(q)}</div>`);return h}}
{const _a=ans1;ans1=function(v){const g=scr,q=g&&g.qs&&!g.tl?q1():null;const r=_a.apply(this,arguments);
 try{if(q&&q.type==='cells'&&g.sheet&&g.sheet.kind==='retry'&&Array.isArray(v)){g.cbad=[];g.cv=v.map((x,i)=>{if(Number(x)===q.a[i])return String(x);g.cbad.push(i);return''});g.cc=q.lay==='vert'?g.cbad[g.cbad.length-1]:g.cbad[0]||0;render()}}catch(e){}return r}}
{const _r=retry1;retry1=function(){const g=scr;if(!g||g.tl)return _r.apply(this,arguments);const cv=g.cv,cc=g.cc,cb=g.cbad,nho=g.nho,r=_r.apply(this,arguments);if(cv){g.cv=cv;g.cc=cc;g.cbad=cb;g.nho=nho;render()}return r}}
/* hướng dẫn khi sai (đặt tính có nhớ) đọc được dạng ô */
if(typeof gdColParse==='function'){const _p=gdColParse;gdColParse=function(q){if(q&&q.lay==='vert')return _p({...q,pic:`g1col"><span>${q.va}</span><span><em>${q.op}</em>${q.vb}</span>`});return _p.apply(this,arguments)}}

/* ---------- gợi ý của cô ---------- */
function tlGoiY(st){const id=Object.keys(S.st).find(k=>S.st[k]===st);const l=(typeof ORG_ON!=='undefined'&&ORG_ON&&S.org)?S.org.gd[id]:null;
 return(S.asg||[]).filter(a=>a.loai==='goiy'&&a.g===st.grade&&(!a.hs||a.hs.includes(id))&&(!a.lop||!l||a.lop===l)).sort((p,q)=>q.t-p.t)}
/* asgSeed (53) đổi mục không có tiets thành phiếu: giữ riêng các gợi ý ra ngoài khi nó chạy */
{const _s=asgSeed;asgSeed=function(){const G=(S.asg||[]).filter(a=>a.loai==='goiy');if(G.length)S.asg=S.asg.filter(a=>a.loai!=='goiy');
 try{return _s.apply(this,arguments)}finally{if(G.length)S.asg=(S.asg||[]).concat(G)}}}
function tlGoiYIsl(st){const s=new Set();tlGoiY(st).forEach(a=>(a.isl||[]).forEach(i=>{if(isl1(i))s.add(i)}));return[...s]}

/* ---------- trang Tự luyện ---------- */
function tlRow(st,x,goi){const r=tlR(st)[x.id]||{},op=tlOpen(st,x),b=r.best,cur=r.cur;
 const dots=b||cur?`<div class="vdots">${Array.from({length:6},(_,k)=>{const v=cur?cur.res[k]:k<5?(k<b.ok):b.tt;return`<i class="${v===true||v===1?'d':''} ${k===5?'t':''}"></i>`}).join('')}</div>`:'';
 const sub=!op?T('🔒 Qua Màn 1 của đảo này để mở trang','🔒 Pass Level 1 of this island to open'):cur?T(`Đang làm bài ${Math.min(cur.j+1,5)}/5`,`In progress · task ${Math.min(cur.j+1,5)}/5`):b?T(`Đúng ${b.ok}/${b.n} bài${b.tt?' · có ★':''} · đã làm ${r.n} lần`,`${b.ok}/${b.n} correct${b.tt?' · ★':''} · done ${r.n}×`):goi?T('Cô gợi ý · chưa làm','Teacher suggests · not started'):T('Chưa làm','Not started');
 const btn=!op?'':`<button type="button" class="btn sm ${b&&!cur?'ghost':'pri'}" onclick="tlGo('${x.id}')">${cur?T('Làm tiếp','Continue'):b?T('Làm lại','Again'):T('Làm','Start')}</button>`;
 return`<div class="vrow ${goi?'gy':''} ${op?'':'lk'}"><span class="vno">${tlIdx(x)}</span><div class="grow"><b>${esc(tlLes(x))}</b><small>${esc(x.title)} · ${sub}</small>${dots}</div>${btn}</div>`}
function viewTL(st){const g=curG(),back=`<div class="crumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'nha'})">← ${T('Phòng học','Study room')}</button></div>`;
 if(!TL_G(g))return`<div class="page pgpage vbt">${back}<section class="card"><h2 class="nhah">${spr('selfS',26)} ${T('Tự luyện','Self-practice')}</h2><p class="muted">${T('Vở bài tập Jenny cho lớp của em sắp có. Hiện có cho lớp 1 và lớp 2.','Jenny’s workbook for your grade is coming soon. It is ready for grades 1 and 2.')}</p></section></div>`;
 const P=tlPages(st),goi=tlGoiYIsl(st),self=(st.selfCoins&&st.selfCoins[S.day])||0,TT=PRIM[g].T||[];
 const goiRows=goi.map(isl1).filter(Boolean).filter(x=>!((tlR(st)[x.id]||{}).best)).map(x=>tlRow(st,x,1)).join('');
 const last=P[P.length-1],curTi=last?last.ti||0:0,dx=tlDayIsl(st);
 const sec=ti=>{const L=PRIM[g].isl.filter(x=>(x.ti||0)===ti),op=L.filter(x=>tlOpen(st,x)),dn=L.filter(x=>(tlR(st)[x.id]||{}).best).length;if(!op.length)return'';
  const firstLk=L.find(x=>!tlOpen(st,x)),rows=op.slice().reverse().map(x=>tlRow(st,x,goi.includes(x.id))).join('')+(firstLk&&ti===curTi?tlRow(st,firstLk,0):'');
  const head=`${T('Chủ đề','Topic')} ${ti+1} · ${esc((TT[ti]||[''])[0])}`;
  return ti===curTi?`<div class="vsec">${head} <span class="pill ok vpill">${dn}/${L.length}</span></div>${rows}`:`<details class="vdet"><summary class="vsec">${head} <span class="pill ok vpill">${dn}/${L.length}</span></summary>${rows}</details>`};
 const secs=[...new Set(P.map(x=>x.ti||0))].sort((a,b)=>b-a).map(sec).join('');
 return`<div class="page pgpage vbt">${back}<section class="card"><h2 class="nhah">${spr('selfS',26)} ${T('Tự luyện','Self-practice')}</h2>
  <p class="vsub">${T('Vở bài tập Jenny · em tự chọn trang, làm khi em muốn. Mỗi lần làm là số mới.','Jenny’s workbook · pick a page and practise when you like. New numbers every time.')}</p>
  <div class="vstat"><span class="pill acc">${T(`Xu tự luyện hôm nay: ${self}`,`Practice coins today: ${self}`)}</span><span class="pill ok">${T(`Đã làm ${tlDone(st)} trang`,`${tlDone(st)} pages done`)}</span></div>
  ${goiRows?`<div class="vsec">⭐ ${T('Cô gợi ý','Teacher suggests')}</div>${goiRows}`:''}
  ${dx?`<div class="vtt"><span class="vtrophy">${spr('star',30)}</span><div class="grow"><b>${T('Thử thách hôm nay','Today’s challenge')}</b><div style="font-size:13px">${tlDayOk(st)?T('Đã làm hôm nay · mai có thử thách mới','Done today · new one tomorrow'):T(`+${TL_TT} xu · còn 1 lượt`,`+${TL_TT} coins · 1 try left`)}</div></div><button class="btn sm ${tlDayOk(st)?'ghost':'pri'}" type="button" onclick="tlDayGo()">${tlDayOk(st)?'✓':T('Thử','Try')}</button></div>`:''}
  ${secs||`<p class="muted">${T('Em qua Màn 1 của đảo đầu tiên là mở được trang vở đầu tiên.','Pass Level 1 of your first island to open your first page.')}</p>`}
  <p class="vnote">${T('Trang vở mở khi em qua đảo. Mỗi bài đúng +5 xu, ★ Thử thách +15 xu. Sai thì vào Sổ lỗi sai. Không bắt buộc.','A page opens when you pass its island. +5 coins per task, ★ challenge +15. Mistakes go to your mistake book. Not compulsory.')}</p></section></div>`}

/* ô Tự luyện trong Phòng học */
{const _p=phongBox;phongBox=function(st){let r=_p.apply(this,arguments);try{const g=curG(),on=TL_G(g),n=on?tlGoiYIsl(st).filter(i=>{const x=isl1(i);return x&&tlOpen(st,x)&&!((tlR(st)[i]||{}).best)}).length:0;
 const sub=!on?T('Sắp có','Coming soon'):n?T(`${n} trang cô gợi ý`,`${n} suggested`):T(`Đã làm ${tlDone(st)} trang`,`${tlDone(st)} pages done`);
 r=r.replace(/<button type="button" class="nhat" onclick="toast\(arcT\('Phần Tự luyện sắp có nhé!'[^"]*">([\s\S]*?)<\/button>/,(m,inner)=>`<button type="button" class="nhat" onclick="go({k:'home',tab:'tl'})">${inner.replace(/<small>[^<]*<\/small>/,`<small>${sub}</small>`).replace(/(<span class="nhic">[\s\S]*?)(<\/span>)/,(m2,a,b)=>a+(n?`<i class="herbang">${n>9?'9+':n}</i>`:'')+b)}</button>`)}catch(e){}return r}}
NHA_TABS.push('tl');
{const _v=viewHome1t;viewHome1t=function(){if(scr.tab!=='tl')return _v.apply(this,arguments);const st=S.st[sid];scr.tab='nha';let r;try{r=_v.apply(this,arguments)}finally{scr.tab='tl'}
 const i=r.indexOf('<nav class="bnav"');return viewTL(st)+(i>=0?r.slice(i):'')}}

/* ---------- trang giáo viên: gợi ý trang + xem em tự luyện ---------- */
function gvTLBox(){const g=gvGrade;if(!TL_G(g)||!PRIM[g])return'';const L=PRIM[g].isl,CLS=gvCLS(),wk=Date.now()-7*DAYMS;
 const mine=(S.asg||[]).filter(a=>a.loai==='goiy'&&a.g===g&&!a.hs&&(!a.lop||!gvLop||a.lop===gvLop)).sort((p,q)=>q.t-p.t);
 const list=mine.map(a=>`<div class="task"><div class="row"><div style="flex:1;min-width:160px"><b>⭐ ${a.isl.map(i=>{const x=isl1(i);return x?`Trang ${L.indexOf(x)+1} · ${esc(tlLes(x))}`:''}).filter(Boolean).join(' · ')}</b><div class="muted">Gợi ý ${asgD(a.t)} · ${esc(a.by||'Cô')}</div></div><button class="btn sm" onclick="gvTLDel('${a.id}')">Bỏ gợi ý</button></div></div>`).join('');
 const rows=CLS.map(([id,nm])=>{const st=S.st[id];if(!st)return'';const R=st.tl||{},E=Object.entries(R).filter(([,r])=>r&&r.last);const wkN=E.filter(([,r])=>r.last.t>=wk).length,tot=E.length;
  const ok=E.reduce((s,[,r])=>s+r.best.ok,0),n=E.reduce((s,[,r])=>s+r.best.n,0),tt=E.filter(([,r])=>r.best.tt).length;
  return`<tr><td>${esc(nm)}</td><td>${wkN}</td><td>${tot}</td><td>${n?Math.round(ok/n*100)+'%':'—'}</td><td>${tt}</td></tr>`}).join('');
 return`<section class="card"><div class="secthead"><h2>Tự luyện lớp ${g} · Vở bài tập Jenny</h2></div>
  <p class="muted" style="margin:0 0 6px">Em tự làm, không bắt buộc. Cô không giao, chỉ ⭐ gợi ý trang (em thấy ở đầu trang Tự luyện). Trang chỉ mở khi em đã qua đảo đó.</p>
  <div class="row" style="gap:8px;flex-wrap:wrap;margin:6px 0 10px;align-items:flex-start"><select id="tlIsl" multiple size="5" aria-label="Chọn trang" style="min-width:260px;flex:1">${L.map((x,i)=>`<option value="${x.id}">Trang ${i+1} · ${esc(tlLes(x))} (${esc(x.title)})</option>`).join('')}</select>
  <button class="btn pri" onclick="gvTLAdd()">⭐ Gợi ý</button></div>${list||'<p class="muted">Chưa gợi ý trang nào.</p>'}
  <div style="overflow-x:auto;margin-top:10px"><table class="tbl"><thead><tr><th>Học sinh</th><th>Trang 7 ngày</th><th>Tổng trang</th><th>Đúng</th><th>★</th></tr></thead><tbody>${rows}</tbody></table></div></section>`}
window.gvTLAdd=function(){const isl=[...document.getElementById('tlIsl').selectedOptions].map(o=>o.value);if(!isl.length){toast('Chọn ít nhất 1 trang');return}
 try{asgSeed()}catch(e){}const now=(typeof gvNow==='function'?gvNow():Date.now());(S.asg||(S.asg=[])).push({id:'g'+now.toString(36),loai:'goiy',g:gvGrade,lop:gvLop,isl,t:now,by:gvTen()});
 log('gv','assigned',`Gợi ý Tự luyện · ${isl.length} trang`,0,{});save();render();toast('Đã gợi ý cho lớp '+(gvLop||gvGrade))};
window.gvTLDel=function(id){S.asg=(S.asg||[]).filter(a=>a.id!==id);save();render();toast('Đã bỏ gợi ý')};
{const _g=viewGV;viewGV=function(){const r=_g.apply(this,arguments);try{const b=gvTLBox();if(!b)return r;const i=r.lastIndexOf('<section class="card"><details>');return i<0?r:r.slice(0,i)+b+r.slice(i)}catch(e){return r}}}

/* phép tính trong ô Tô màu luôn nằm trên 1 dòng: chữ to quá thì tự nhỏ lại */
function tlFitCol(){const B=[...document.querySelectorAll('.tlcol .cc')];if(!B.length)return;B.forEach(b=>b.style.fontSize='');let f=parseFloat(getComputedStyle(B[0]).fontSize);const over=()=>B.some(b=>{const t=b.querySelector('.cct');return t&&t.offsetWidth>b.clientWidth-4});while(over()&&f>11){f-=1;B.forEach(b=>b.style.fontSize=f+'px')}}/* cả lưới cùng một cỡ chữ */
{const _a=g1AfterRender;g1AfterRender=function(){const r=_a.apply(this,arguments);try{if(scr&&scr.tl)tlFitCol()}catch(e){}return r}}
Object.assign(I18N,{'Chuỗi phép tính':'Number chain','Bảng thành phần phép tính':'Calculation table','Chữ số bí ẩn':'Missing digits','Mỗi hình là một số':'Shape puzzle','Tách số theo hàng':'Place value split','Đếm nhảy':'Skip counting','Đặt tính rồi tính':'Column method','Lưới phép tính':'Number grid','Tô màu theo kết quả':'Colour by answer','Đúng hay sai':'True or false','Nhà số':'Number house','Gia đình phép tính':'Fact family','Tháp số':'Number pyramid','Tam giác số':'Number triangle'});
document.head.insertAdjacentHTML('beforeend',`<style>
.vbt h2{margin:0}.vsub{font-size:13px;color:var(--muted);margin:2px 0 10px}.vstat{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 4px}
.vsec{font-family:var(--f-display);font-size:20px;margin:16px 0 8px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;color:var(--ink);line-height:1.15}
.vpill{font-family:var(--f-body);font-size:12px}details.vdet>summary{cursor:pointer;list-style:none}details.vdet>summary::-webkit-details-marker{display:none}details.vdet>summary::before{content:'▸';margin-right:2px}details.vdet[open]>summary::before{content:'▾'}
.vrow{display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:10px;background:var(--surface);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--pxk);text-align:left}
.vrow.lk{opacity:.6;box-shadow:var(--f2)}.vrow .grow{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:2px}
.vrow b{font-size:14.5px;line-height:1.25}.vrow small{font-size:12px;color:var(--muted);line-height:1.3}
.vno{font-family:var(--f-display);font-size:22px;min-width:36px;height:34px;padding:0 2px;display:grid;place-items:center;background:var(--sea-soft);color:var(--sea-deep);box-shadow:var(--f2);flex:none}
.vrow.gy{background:var(--sun-soft)}
.vdots{display:flex;gap:3px;margin-top:2px}.vdots i{width:10px;height:10px;background:var(--line);box-shadow:0 0 0 1px var(--pxk)}.vdots i.d{background:var(--leaf)}.vdots i.t{outline:2px solid var(--sun);outline-offset:-2px}.vdots i.t.d{background:var(--sun);outline:0}
.vtt{display:flex;gap:10px;align-items:center;padding:12px;margin:14px 0 4px;background:linear-gradient(180deg,var(--sun-soft),var(--surface));box-shadow:var(--f2),0 4px 0 0 var(--pxk);color:var(--ink);text-align:left}
.vtt .grow{flex:1;min-width:0;display:block!important}.vtt b{font-family:var(--f-display);font-size:20px;font-weight:400}
.vnote{font-size:12.5px;color:var(--muted);margin:12px 0 0}
.tlpl i.tt{flex:.7}.tlpl i.tt:not(.ok):not(.bad):not(.cur){background:var(--sun-soft)}
.tlfig{display:flex;justify-content:center}
.tlfig .tc{width:46px;height:42px;display:grid;place-items:center;font-family:var(--f-display);font-size:28px;line-height:1;background:#FFF4D6;color:#1F2A5A;box-shadow:inset 0 0 0 2px #1F2A5A;border:0;padding:0;flex:none}
.tlfig .tc.e{background:#fff;cursor:pointer}.tlfig .tc.e.cur{background:#DDF3FB;box-shadow:inset 0 0 0 4px #0079C1}.tlfig .tc.e.bad{background:#FDE6DE}
.tlfig .tc.op{background:transparent;box-shadow:none;width:26px;color:var(--ink)}.tlfig .tc.gap{background:transparent;box-shadow:none}
.tlhouse{width:184px}.tlhouse .roof{width:0;height:0;border-left:92px solid transparent;border-right:92px solid transparent;border-bottom:54px solid #E0441A;position:relative}
.tlhouse .roof span{position:absolute;left:-24px;top:16px;width:48px;text-align:center;font-family:var(--f-display);font-size:32px;color:#fff;line-height:1}
.tlhouse .floors{background:#FFF4D6;box-shadow:0 0 0 2px #1F2A5A}.tlhouse .fl{display:grid;grid-template-columns:1fr 1fr}.tlhouse .fl .tc{width:auto}
.tlfam{display:flex;flex-direction:column;align-items:center;gap:6px}.tlfam .eq{display:flex;gap:4px;align-items:center}
.tlsd{position:relative;display:grid;grid-template-columns:46px 30px 46px;grid-template-rows:42px 16px 42px;margin-bottom:6px}
.tlsd .tc:nth-of-type(1){grid-column:2;grid-row:1;justify-self:center;border-radius:50%}.tlsd .tc:nth-of-type(2){grid-column:1;grid-row:3;border-radius:50%}.tlsd .tc:nth-of-type(3){grid-column:3;grid-row:3;border-radius:50%}
.tlsd i{position:absolute;top:40px;width:3px;height:22px;background:var(--pxk,#1F2A5A)}.tlsd i.l1{left:46px;transform:rotate(45deg)}.tlsd i.l2{right:46px;transform:rotate(-45deg)}
.tlrows{display:flex;flex-direction:column;align-items:center;gap:6px}.tlrows .rw{display:flex;gap:6px}
.tlrows.tri{gap:8px}.tlrows.tri .rw{gap:24px}.tlrows.tri .tc{border-radius:50%}
.trisum{font-family:var(--f-display);font-size:20px;color:var(--ink);margin-bottom:2px}
.tlrows.grid{display:grid;grid-template-columns:repeat(5,42px);gap:4px;justify-content:center}.tlrows.grid .rw{display:contents}.tlrows.grid .tc{width:42px;height:40px;font-size:26px}.tlrows.grid .tc.op{width:42px}
.tlcol{display:grid;grid-template-columns:repeat(4,minmax(0,70px));gap:6px;justify-content:center}
.tlcol .cc{height:48px;border:0;background:#fff;color:#1F2A5A;font-family:var(--f-display);font-size:22px;line-height:1;white-space:nowrap;box-shadow:inset 0 0 0 2px #1F2A5A;cursor:pointer;padding:0 2px;overflow:hidden}
.tlcol .cct{display:inline-block;white-space:nowrap}
.tlcol .cc.on{color:#fff;text-shadow:0 1px 0 #1F2A5A}.tlcol .cc.bad{box-shadow:inset 0 0 0 4px #E0441A}
.tlpal{display:flex;gap:6px;justify-content:center;margin-bottom:10px;flex-wrap:wrap}
.tlpal .pc{display:flex;align-items:center;gap:5px;border:0;background:var(--surface);color:var(--ink);font-family:var(--f-display);font-size:24px;padding:5px 8px;white-space:nowrap;box-shadow:var(--f2),0 3px 0 0 var(--pxk);cursor:pointer}
.tlpal .pc i{width:22px;height:22px;display:inline-block;box-shadow:0 0 0 2px var(--pxk)}.tlpal .pc.on{outline:4px solid var(--sun);outline-offset:2px}
.tlds{display:flex;flex-direction:column;gap:8px;width:100%;max-width:340px}
.dsr{display:flex;align-items:center;gap:8px;background:var(--surface);padding:6px 8px;box-shadow:var(--f2)}.dsr.bad{background:var(--coral-soft)}
.dst{flex:1;font-family:var(--f-display);font-size:26px;color:var(--ink);line-height:1}
.dsb{width:44px;height:40px;border:0;background:#fff;color:#1F2A5A;font-family:var(--f-display);font-size:26px;box-shadow:inset 0 0 0 2px #1F2A5A;cursor:pointer}.dsb.on{background:#0079C1;color:#fff}
.tlvert{display:grid;gap:4px;justify-content:center;align-items:center}
.tlvert .tc{width:44px;height:46px;font-size:32px}.tlvert .tc.vd{background:transparent;box-shadow:none;color:var(--ink)}.tlvert .tc.vop{font-size:32px;width:44px}
.tlvert .vline{display:block;height:4px;background:var(--pxk,#1F2A5A);margin:2px 0}
.tlvert .vn{width:30px;height:24px;justify-self:center;border:0;background:transparent;color:#E0441A;font-family:var(--f-display);font-size:22px;line-height:1;box-shadow:inset 0 0 0 2px var(--muted);opacity:.7;cursor:pointer;padding:0}.tlvert .vn.on{opacity:1;box-shadow:inset 0 0 0 2px #E0441A;background:#FDE6DE}
.tlchain{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 2px;max-width:340px}
.tlchain .tca{display:flex;flex-direction:column;align-items:center;font-family:var(--f-display);font-size:22px;line-height:.9;color:var(--ink);padding:0 2px}.tlchain .tca i{font-style:normal;font-size:20px;color:#E0441A;white-space:nowrap}
.tltbl{display:grid;gap:4px;align-items:center;justify-content:center}.tltbl .th{font-size:14px;font-weight:700;color:var(--ink);padding-right:6px;text-align:right;line-height:1.15}
.tlshape{display:flex;flex-direction:column;align-items:center;gap:8px}.tlshape .eqs{font-family:var(--f-display);font-size:32px;line-height:1;color:var(--ink);white-space:nowrap}
.tlshape .ans{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:6px}.tlshape .ans span{display:flex;align-items:center;gap:6px;font-family:var(--f-display);font-size:32px;color:var(--ink)}
.tlsh{font-weight:400;font-size:30px}
.tlseq{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:340px}.tlseq .tc{width:50px}
.tlend{text-align:center}.tlend .big{font-family:var(--f-display);font-size:48px;color:var(--leaf);line-height:1.1}
</style>`);
})();
