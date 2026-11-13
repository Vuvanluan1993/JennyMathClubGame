/* 93 — Trang vở lớp 5: Tự luyện đủ 75 bài (13/11/2026). Thầy không có PDF VBT Toán 5; dạng bài lấy theo mục lục và
   lời giải công khai của VBT Toán 5 (Chân trời sáng tạo) trên mạng, ghép với nội dung từng bài KNTT; viết lại lời, số mới mỗi lần.
   Cùng kiểu trang đã duyệt (vof · voc · von · vok), mỗi bài 3 bài kiểu vở + 2 câu đảo + ★.
   Mới: ô **số thập phân** — bàn phím có phím dấu phẩy (q.dec); bên trong lưu dấu chấm, hiện dấu phẩy.
   Dạng bài: số tự nhiên, phân số, phân số thập phân, hỗn số · số thập phân (viết, so sánh, xếp thứ tự, làm tròn, số đo dạng
   số thập phân, cộng – trừ – nhân – chia, với 10/100/0,1) · km², ha, bảng đơn vị diện tích · diện tích tam giác, hình thang,
   chu vi – diện tích hình tròn · tỉ số, tỉ số phần trăm, tỉ lệ bản đồ, tổng – tỉ, hiệu – tỉ, giá trị phần trăm · thể tích,
   cm³ – dm³ – m³, diện tích xung quanh/toàn phần, thể tích hình hộp chữ nhật, hình lập phương · số đo thời gian (đổi, cộng,
   trừ, nhân, chia) · vận tốc, quãng đường, thời gian · biểu đồ hình quạt, tỉ số số lần lặp lại. Mỗi câu có vchk(). */
(function(){
const V=window.VO;if(!V||!V.psTinh)return;
const {T,RR,mkQ,LB,SIGN,sgn,distinct,svg,COL,uniq,tinh,datTinh,noiKQ,thieu,dau,signSet,form,chon,xep,noiQ,HINTN,NV,NG,
 nhanSo,congSo,doiDV,dauLon,vietTong5,bieuThuc,psTinh,psBang,rutGon,soSanhPS,psCuaSo,fr,red,tbc,rutDV,daySL,soLan,fmt,baBuoc,bangSoLieu,khaNang}=V;
const M='−',X='×',D=':';
const R3=v=>Math.round(v*1000)/1000,dc=v=>String(R3(v)).replace('.',',');
/* ---------- bàn phím số thập phân ---------- */
const DEC=q=>q&&q.dec;
{const _i=input1;input1=function(q){if(DEC(q)&&!scr.sheet)return`<div class="vopad dec">${['1','2','3','4','5','6','⌫','7','8','9','0',',','✓'].map(k=>`<button type="button" class="${k==='✓'?'go':k==='⌫'?'del':''}" onclick="tlKey('${k===','?'.':k}')" aria-label="${k==='⌫'?T('Xóa','Delete'):k==='✓'?T('Xong bài','Done'):k===','?T('Dấu phẩy','Decimal comma'):k}">${k==='✓'?T('Xong','Done'):k}</button>`).join('')}</div>`;return _i.apply(this,arguments)}}
{const _k=tlKey;window.tlKey=tlKey=function(k){const g=scr,q=q1();if(DEC(q)&&g&&!g.sheet){g.cv=g.cv||q.a.map(()=>'');const v=g.cv[g.cc]||'';
  if(k==='.'){if(v.includes('.'))return;g.cv[g.cc]=(v||'0')+'.';g.cbad=null;sfx('tap');render();return}
  if(k!=='⌫'&&k!=='✓'){const L=Math.max(...q.a.map(x=>String(x).length))+1;if(v.length>=L)return;g.cv[g.cc]=v+k;g.cbad=null;sfx('tap');render();return}}
 return _k.apply(this,arguments)}}
{const _r=right1;right1=function(q,v){if(DEC(q)&&Array.isArray(v))return v.length===q.a.length&&v.every((x,i)=>Math.abs(Number(x)-q.a[i])<1e-9);return _r.apply(this,arguments)}}
{const _s=show1;show1=function(q){if(DEC(q))return q.a.map(dc).join('; ');return _s.apply(this,arguments)}}
/* ---------- mảnh mới ---------- */
const hs=(w,n,d)=>`<span class="vohs"><b>${w}</b>${fr(n,d)}</span>`;
function hopCN(a,b,c,lp){const W=178,H=96,dx=26,dy=18,w=lp?54:84,h=lp?54:46,x0=12,y0=dy+12;
 const s=`<polygon points="${x0},${y0} ${x0+w},${y0} ${x0+w},${y0+h} ${x0},${y0+h}" fill="#DDF3FB" stroke="#1F2A5A" stroke-width="2"/><polygon points="${x0},${y0} ${x0+dx},${y0-dy} ${x0+w+dx},${y0-dy} ${x0+w},${y0}" fill="#fff" stroke="#1F2A5A" stroke-width="2"/><polygon points="${x0+w},${y0} ${x0+w+dx},${y0-dy} ${x0+w+dx},${y0+h-dy} ${x0+w},${y0+h}" fill="#BEE6F5" stroke="#1F2A5A" stroke-width="2"/>`+
 `<text x="${x0+w/2}" y="${y0+h+13}" text-anchor="middle" font-family="VT323,monospace" font-size="14" fill="#F04A1B">${a}</text>`+(lp?'':`<text x="${x0+w+dx/2+6}" y="${y0+h-dy/2+10}" font-family="VT323,monospace" font-size="14" fill="#F04A1B">${b}</text><text x="${x0+w+dx+3}" y="${y0+h/2-dy/2}" font-family="VT323,monospace" font-size="14" fill="#F04A1B">${c}</text>`);
 return svg(W,H+8,s,'')}
function tamGiac5(a,h){return svg(150,84,`<polygon points="10,70 130,70 52,10" fill="#FFF4D6" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/><line x1="52" y1="10" x2="52" y2="70" stroke="#0079C1" stroke-width="2" stroke-dasharray="4 3"/><text x="70" y="82" text-anchor="middle" font-family="VT323,monospace" font-size="14" fill="#F04A1B">${a}</text><text x="56" y="45" font-family="VT323,monospace" font-size="14" fill="#0079C1">h = ${h}</text>`,'')}
function thang5(a,b,h){return svg(150,84,`<polygon points="10,70 140,70 104,14 36,14" fill="#FFF4D6" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/><line x1="60" y1="14" x2="60" y2="70" stroke="#0079C1" stroke-width="2" stroke-dasharray="4 3"/><text x="75" y="82" text-anchor="middle" font-family="VT323,monospace" font-size="14" fill="#F04A1B">${a}</text><text x="70" y="11" text-anchor="middle" font-family="VT323,monospace" font-size="14" fill="#F04A1B">${b}</text><text x="64" y="47" font-family="VT323,monospace" font-size="14" fill="#0079C1">h = ${h}</text>`,'')}
function tron5(lab){return svg(74,70,`<circle cx="36" cy="35" r="30" fill="#FFF4D6" stroke="#1F2A5A" stroke-width="2" shape-rendering="auto"/><circle cx="36" cy="35" r="2.5" fill="#1F2A5A"/><line x1="36" y1="35" x2="66" y2="35" stroke="#0079C1" stroke-width="2"/><text x="50" y="50" text-anchor="middle" font-family="VT323,monospace" font-size="13" fill="#0079C1">${lab}</text>`,'')}
function quat(P,names){let a0=-Math.PI/2,b='',lg='';const cx=40,cy=40,r=36;P.forEach((p,i)=>{const a1=a0+p/100*2*Math.PI,lf=p>50?1:0,f=COL[(i+1)%COL.length];b+=`<path d="M${cx} ${cy} L${cx+r*Math.cos(a0)} ${cy+r*Math.sin(a0)} A${r} ${r} 0 ${lf} 1 ${cx+r*Math.cos(a1)} ${cy+r*Math.sin(a1)} Z" fill="${f}" stroke="#1F2A5A" stroke-width="1.5" shape-rendering="auto"/>`;
  const am=(a0+a1)/2;b+=`<text x="${cx+r*.6*Math.cos(am)}" y="${cy+r*.6*Math.sin(am)+4}" text-anchor="middle" font-family="VT323,monospace" font-size="13" fill="#1F2A5A">${p}%</text>`;lg+=`<rect x="86" y="${8+i*16}" width="10" height="10" fill="${f}" stroke="#1F2A5A"/><text x="100" y="${17+i*16}" font-family="Be Vietnam Pro" font-size="10" font-weight="700" fill="#1F2A5A">${names[i]}</text>`;a0=a1});
 return svg(170,82,b+lg,'')}
{const _x=V.tokX;V.tokX=function(t,cell,q){if(!t||typeof t!=='object')return _x(t,cell,q);
 if(t.hs)return hs(...t.hs);
 if(t.hsb)return`<span class="vohs">${cell()}<span class="vofb">${cell()}<i></i>${cell()}</span></span>`;
 if(t.hop)return`<span class="vosh">${hopCN(...t.hop)}</span>`;
 if(t.tg5)return`<span class="vosh">${tamGiac5(...t.tg5)}</span>`;
 if(t.th5)return`<span class="vosh">${thang5(...t.th5)}</span>`;
 if(t.tr5)return`<span class="vosh">${tron5(t.tr5)}</span>`;
 if(t.qt)return`<span class="vosh">${quat(...t.qt)}</span>`;
 return _x(t,cell,q)}}
/* ---------- khung câu số thập phân ---------- */
const need=V.need;
function fd(kind,rows,a,q,say,extra){return mkQ(Object.assign({lay:'vof',kind,dec:1,rows2:rows,a:a.map(R3),q,say,need,sol:a.map(dc).join(' · '),vchk(){return this.a.every(v=>Number.isFinite(v))}},extra||{}))}
function tinhDec(L,kind){{const sn=new Set();L=L.filter(e=>!sn.has(e[0])&&sn.add(e[0]))}return fd(kind||'Vở: tính',L.map((e,i)=>({lb:LB[i],t:[{x:e[0]+' ='},{b:1}]})),L.map(e=>e[1]),T('<b>Tính.</b> (dùng phím dấu phẩy để viết số thập phân)','<b>Work out.</b> (use the comma key for decimals)'),T('Em tính rồi viết kết quả. Số thập phân có dấu phẩy.','Work it out. Use the comma for decimals.'),{L,vchk(){return this.L.every((e,i)=>Math.abs(e[1]-this.a[i])<1e-9)}})}
const rd=(lo,hi,dp)=>R3(RR(lo*10**dp,hi*10**dp)/10**dp);
const cong=()=>{const a=rd(1,99,RR(1,2)),b=rd(1,50,RR(1,2));return[`${dc(a)} + ${dc(b)}`,R3(a+b)]},tru=()=>{let a=rd(5,99,RR(1,2)),b=rd(1,50,RR(1,2));if(b>a)[a,b]=[b,a];return[`${dc(a)} ${M} ${dc(b)}`,R3(a-b)]};
const nhanTN=()=>{const a=rd(1,50,RR(1,2)),b=RR(2,9);return[`${dc(a)} ${X} ${b}`,R3(a*b)]},nhan2=()=>{const a=rd(1,20,1),b=rd(1,9,1);return[`${dc(a)} ${X} ${dc(b)}`,R3(a*b)]};
const chiaTN=()=>{const b=RR(2,9),q=rd(1,30,RR(1,2));return[`${dc(R3(q*b))} : ${b}`,q]},chia2=()=>{const b=rd(1,9,1),q=RR(2,40);return[`${dc(R3(q*b))} : ${dc(b)}`,q]},chiaTTN=()=>{const b=pick([2,4,5,8]),n=RR(1,40);return[`${n} : ${b}`,R3(n/b)]};
const nhan10=()=>{const a=rd(1,99,RR(1,3)),f=pick([10,100,1000,0.1,0.01]),div=Math.random()<.5;return div?[`${dc(a)} : ${dc(f)}`,R3(a/f)]:[`${dc(a)} ${X} ${dc(f)}`,R3(a*f)]};
function vietSTP(){const rows=[],a=[];for(let i=0;i<4;i++){const k=i%2;if(k){const n=RR(1,999),d=pick([10,100,1000]);if(n>=d&&d===10){i--;continue}rows.push({lb:LB[i],t:[{f:[n,d]},{x:'='},{b:1}]});a.push(n/d)}else{const e=RR(0,99),p=RR(0,9),q=RR(0,9);rows.push({lb:LB[i],t:[{w:T(`${e} đơn vị, ${p} phần mười, ${q} phần trăm:`,`${e} ones, ${p} tenths, ${q} hundredths:`)},{b:1}]});a.push(e+p/10+q/100)}}
 return fd('Vở: viết số thập phân',rows,a,T('<b>Viết</b> số thập phân thích hợp.','<b>Write</b> the decimal.'),T('Phần mười đứng ngay sau dấu phẩy, tiếp theo là phần trăm.','Tenths come right after the comma, then hundredths.'))}
function soSanhSTP(){return dau(signSet(6,w=>{const x=rd(0,99,RR(1,3));let y=w===2?x:R3(x+(w===0?-1:1)*pick([0.1,0.01,0.001,1,0.5]));if(y<0)y=R3(x+0.5);return[dc(x),x,dc(y),y]}),'Vở: so sánh số thập phân',1)}
function xepSTP(){const A=distinct(4,10,999).map(v=>R3(v/100)),B=distinct(4,10,999).map(v=>R3(v/100)),up=A.slice().sort((x,y)=>x-y),dn=B.slice().sort((x,y)=>y-x);
 return mkQ({lay:'vok',kind:'Vở: xếp thứ tự số thập phân',decv:1,rows2:[{lb:'a)',t:[T(`Xếp ${A.map(dc).join('; ')} từ bé đến lớn:`,`Order ${A.map(dc).join('; ')} from smallest:`)]},{t:[{b:1},{b:1},{b:1},{b:1}]},{lb:'b)',t:[T(`Xếp ${B.map(dc).join('; ')} từ lớn đến bé:`,`Order ${B.map(dc).join('; ')} from largest:`)]},{t:[{b:1},{b:1},{b:1},{b:1}]}],a:up.concat(dn),cards:shuf(A.concat(B)),
  q:T('<b>Kéo</b> thẻ số để xếp theo thứ tự.','<b>Drag</b> the cards into order.'),say:T('So sánh phần nguyên trước, rồi đến hàng phần mười, phần trăm.','Compare whole parts first, then tenths and hundredths.'),need:V.needK,sol:'',vchk(){const u=this.a.slice(0,4),d=this.a.slice(4);return u.every((v,i)=>!i||v>=u[i-1])&&d.every((v,i)=>!i||v<=d[i-1])}})}
function soDoSTP(){const P=[['m','cm',100],['km','m',1000],['kg','g',1000],['tấn','kg',1000],['m','dm',10],['m²','dm²',100]];const rows=[],a=[];shuf(P).slice(0,4).forEach(([big,sm,f],i)=>{const n=RR(0,20),m=RR(1,f-1);rows.push({lb:LB[i],t:[{x:`${n} ${big} ${m} ${sm} =`},{b:1},{x:big}]});a.push(n+m/f)});
 return fd('Vở: viết số đo dưới dạng số thập phân',rows,a,T('Viết số đo dưới dạng <b>số thập phân</b>.','Write each measure as a <b>decimal</b>.'),T('Ví dụ: 3 m 5 cm bằng 3,05 m vì 5 cm bằng 5 phần trăm mét.','For example, 3 m 5 cm = 3.05 m.'))}
function lamTronSTP(){const rows=[],a=[];const H=[[1,T('hàng đơn vị','the nearest whole')],[0.1,T('hàng phần mười','the nearest tenth')],[0.01,T('hàng phần trăm','the nearest hundredth')]];for(let i=0;i<4;i++){const [h,nm]=H[i%3],x=rd(1,99,3);rows.push({lb:LB[i],t:[{w:T(`Làm tròn ${dc(x)} đến ${nm}:`,`Round ${dc(x)} to ${nm}:`)},{b:1}]});a.push(R3(Math.round(x/h)*h))}
 return fd('Vở: làm tròn số thập phân',rows,a,T('<b>Làm tròn</b> số thập phân.','<b>Round</b> each decimal.'),T('Chữ số ngay sau hàng cần làm tròn từ 5 trở lên thì làm tròn lên.','If the next digit is 5 or more, round up.'))}
function psThapPhan(){const rows=[],a=[],P=[];for(let i=0;i<4;i++){const [d,f]=pick([[2,5],[5,2],[4,25],[20,5],[25,4],[50,2]]),n=RR(1,d-1);const D=d*f;P.push([n,d,f]);rows.push({lb:LB[i],t:[{f:[n,d]},{x:'='},{fb:1}]});a.push(n*f,D)}
 return form('Vở: phân số thập phân',rows,a,T('Viết thành <b>phân số thập phân</b> (mẫu số 10, 100, 1 000).','Write as a <b>decimal fraction</b> (denominator 10, 100 or 1000).'),T('Nhân cả tử và mẫu với cùng một số để mẫu số là 10, 100 hoặc 1 000.','Multiply top and bottom so the bottom is 10, 100 or 1000.'),q=>q.P.every((p,i)=>q.a[2*i+1]===p[1]*p[2]&&q.a[2*i]===p[0]*p[2]),{P})}
function honSo(){const rows=[],a=[],P=[],sn=new Set();for(let i=0,t=0;i<4&&t<200;i++,t++){const d=RR(2,9),n=RR(1,d-1),w=RR(1,5);if(sn.has([w,n,d].join())){i--;continue}sn.add([w,n,d].join());P.push([w,n,d,i%2]);if(i%2){rows.push({lb:LB[i],t:[{f:[w*d+n,d]},{x:'='},{hsb:1}]});a.push(w,n,d)}else{rows.push({lb:LB[i],t:[{hs:[w,n,d]},{x:'='},{fb:1}]});a.push(w*d+n,d)}}
 return form('Vở: hỗn số',rows,a,T('Chuyển <b>hỗn số</b> thành phân số và ngược lại.','Convert between <b>mixed numbers</b> and fractions.'),T('Hỗn số thành phân số: phần nguyên nhân mẫu số rồi cộng tử số.','Whole × denominator + numerator.'),q=>q.a.length>0,{P})}
function dtTamGiac(){const rows=[],a=[];for(let i=0;i<3;i++){const x=RR(2,20),h=RR(2,15);rows.push({lb:LB[i],t:[{tg5:[x+' cm',h+' cm']},{w:T('Diện tích:','Area:')},{b:1},{w:'cm²'}]});a.push(x*h/2)}
 return fd('Vở: diện tích hình tam giác',rows,a,T('Tính <b>diện tích</b> hình tam giác.','Find the <b>area</b> of each triangle.'),T('Diện tích tam giác bằng đáy nhân chiều cao rồi chia 2.','Area = base × height ÷ 2.'))}
function dtThang(){const rows=[],a=[];for(let i=0;i<3;i++){const x=RR(8,20),y=RR(3,x-2),h=RR(2,12);rows.push({lb:LB[i],t:[{th5:[x+' cm',y+' cm',h+' cm']},{w:T('Diện tích:','Area:')},{b:1},{w:'cm²'}]});a.push((x+y)*h/2)}
 return fd('Vở: diện tích hình thang',rows,a,T('Tính <b>diện tích</b> hình thang.','Find the <b>area</b> of each trapezium.'),T('Diện tích hình thang bằng tổng hai đáy nhân chiều cao rồi chia 2.','Area = (sum of parallel sides) × height ÷ 2.'))}
function hinhTron5(kind){const rows=[],a=[];for(let i=0;i<3;i++){const r=RR(1,9);if(kind==='cv'){if(i%2){rows.push({lb:LB[i],t:[{tr5:`d = ${2*r} cm`},{w:T('Chu vi:','Circumference:')},{b:1},{w:'cm'}]})}else rows.push({lb:LB[i],t:[{tr5:`r = ${r} cm`},{w:T('Chu vi:','Circumference:')},{b:1},{w:'cm'}]});a.push(R3(2*r*3.14))}
  else{rows.push({lb:LB[i],t:[{tr5:`r = ${r} cm`},{w:T('Diện tích:','Area:')},{b:1},{w:'cm²'}]});a.push(R3(r*r*3.14))}}
 return fd(kind==='cv'?'Vở: chu vi hình tròn':'Vở: diện tích hình tròn',rows,a,kind==='cv'?T('Tính <b>chu vi</b> hình tròn (lấy π = 3,14).','Find the <b>circumference</b> (π = 3.14).'):T('Tính <b>diện tích</b> hình tròn (lấy π = 3,14).','Find the <b>area</b> (π = 3.14).'),kind==='cv'?T('Chu vi bằng đường kính nhân 3,14.','Circumference = diameter × 3.14.'):T('Diện tích bằng bán kính nhân bán kính nhân 3,14.','Area = radius × radius × 3.14.'))}
function tiSo(){const rows=[],a=[],P=[],sn=new Set();for(let i=0,t=0;i<4&&t<200;i++,t++){if(i<2){const x=RR(2,30),y=RR(2,30);if(x===y){i--;continue}const r=red(x,y);P.push(r);rows.push({lb:LB[i],t:[{w:T(`Tỉ số của ${x} và ${y}:`,`Ratio of ${x} to ${y}:`)},{fb:1}]});a.push(...r)}else{const [n,d]=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[7,10],[9,20],[3,25]]);if(sn.has(n+'/'+d)){i--;continue}sn.add(n+'/'+d);rows.push({lb:LB[i],t:[{f:[n,d]},{x:'='},{b:1},{x:'%'}]});a.push(n*100/d)}}
 return form('Vở: tỉ số, tỉ số phần trăm',rows,a,T('Viết <b>tỉ số</b> (phân số tối giản) hoặc <b>tỉ số phần trăm</b>.','Write the <b>ratio</b> (simplest form) or the <b>percentage</b>.'),T('Tỉ số của a và b là a : b, viết thành phân số rồi rút gọn.','The ratio of a to b is a ÷ b as a fraction.'),q=>q.a.length===6)}
function tiLeBD(){const rows=[],a=[];for(let i=0;i<3;i++){const k=pick([1000,10000,100000,500,2000]),cm=RR(2,9);const m=cm*k/100;rows.push({lb:LB[i],t:[{w:T(`Tỉ lệ bản đồ 1 : ${fmt(k)}. Độ dài trên bản đồ ${cm} cm, độ dài thật là`,`Scale 1 : ${k}. ${cm} cm on the map is`)},{b:1},{w:'m'}]});a.push(m)}
 return fd('Vở: tỉ lệ bản đồ',rows,a,T('Tính <b>độ dài thật</b>.','Find the <b>real length</b>.'),T('Độ dài thật bằng độ dài trên bản đồ nhân với số sau dấu hai chấm. Nhớ đổi ra mét.','Multiply by the scale, then change to metres.'))}
function tongTi(hieu){const rows=[],a=[],P=[],sn=new Set();for(let i=0,t=0;i<3&&t<200;i++,t++){const m=RR(1,5),n=RR(m+1,9),u=RR(2,15);if(sn.has(m*100+n)){i--;continue}sn.add(m*100+n);const sm=m*u,bg=n*u;P.push([sm,bg]);
  rows.push({lb:LB[i],t:[{w:hieu?T(`Hiệu hai số là ${bg-sm}, tỉ số là`,`Difference ${bg-sm}, ratio`):T(`Tổng hai số là ${sm+bg}, tỉ số là`,`Sum ${sm+bg}, ratio`)},{f:[m,n]},{w:T('. Số bé:','. Smaller:')},{b:1},{w:T('Số lớn:','Larger:')},{b:1}]});a.push(sm,bg)}
 return form(hieu?'Vở: tìm hai số khi biết hiệu và tỉ số':'Vở: tìm hai số khi biết tổng và tỉ số',rows,a,T('Tìm <b>hai số</b>.','Find <b>the two numbers</b>.'),hieu?T('Hiệu số phần bằng nhau = mẫu − tử. Lấy hiệu chia cho số phần để được một phần.','Find the difference in parts, then the value of one part.'):T('Tổng số phần bằng nhau = tử + mẫu. Lấy tổng chia cho số phần để được một phần.','Add the parts, then find the value of one part.'),q=>q.P.every((p,i)=>q.a[2*i]===p[0]&&q.a[2*i+1]===p[1]),{P})}
function tiSoPT(){const rows=[],a=[];for(let i=0;i<4;i++){const b=pick([20,25,40,50,80,200]),p=RR(1,19)*5;const x=b*p/100;if(!Number.isInteger(x)){i--;continue}rows.push({lb:LB[i],t:[{w:T(`Tỉ số phần trăm của ${x} và ${b}:`,`${x} as a percentage of ${b}:`)},{b:1},{w:'%'}]});a.push(p)}
 return form('Vở: tìm tỉ số phần trăm của hai số',rows,a,T('Tìm <b>tỉ số phần trăm</b>.','Find the <b>percentage</b>.'),T('Lấy số thứ nhất chia số thứ hai, rồi nhân với 100.','Divide, then multiply by 100.'),q=>q.a.length===4)}
function giaTriPT(){const rows=[],a=[];for(let i=0;i<4;i++){const b=RR(2,40)*10,p=pick([10,20,25,30,40,50,60,75]);rows.push({lb:LB[i],t:[{w:`${p}% `+T(`của ${b} là`,`of ${b} is`)},{b:1}]});a.push(b*p/100)}
 return fd('Vở: tìm giá trị phần trăm của một số',rows,a,T('Tìm <b>giá trị phần trăm</b>.','Find the <b>percentage of the number</b>.'),T('Lấy số đó chia 100 rồi nhân với số phần trăm.','Divide by 100, then multiply by the percentage.'))}
function theTichDem(){const rows=[],a=[];for(let i=0;i<3;i++){const x=RR(2,5),y=RR(2,4),z=RR(2,4);rows.push({lb:LB[i],t:[{hop:[x,y,z]},{w:T(`${z} lớp, mỗi lớp ${x} × ${y} hình. Thể tích:`,`${z} layers of ${x} × ${y}. Volume:`)},{b:1},{w:'cm³'}]});a.push(x*y*z)}
 return form('Vở: thể tích của một hình',rows,a,T('Tính <b>thể tích</b> (mỗi hình lập phương nhỏ là 1 cm³).','Find the <b>volume</b> (count the cubes).'),T('Số hình mỗi lớp nhân với số lớp.','Cubes per layer × number of layers.'),q=>q.a.length===3)}
function hopTinh(kind,lp){const rows=[],a=[];for(let i=0;i<3;i++){let x=RR(3,12),y=RR(2,x-1),z=RR(2,9);if(lp){y=z=x=RR(2,9)}
  const v=kind==='xq'?(lp?4*x*x:2*(x+y)*z):kind==='tp'?(lp?6*x*x:2*(x+y)*z+2*x*y):x*y*z,u=kind==='v'?'cm³':'cm²';
  rows.push({lb:LB[i],t:[{hop:[x+' cm',y+' cm',z+' cm',lp]},{w:kind==='xq'?T('Diện tích xung quanh:','Lateral area:'):kind==='tp'?T('Diện tích toàn phần:','Total area:'):T('Thể tích:','Volume:')},{b:1},{w:u}]});a.push(v)}
 const ten=lp?T('hình lập phương','cube'):T('hình hộp chữ nhật','cuboid');
 return form(kind==='v'?`Vở: thể tích ${lp?'hình lập phương':'hình hộp chữ nhật'}`:`Vở: diện tích xung quanh, toàn phần ${lp?'hình lập phương':'hình hộp chữ nhật'}`,rows,a,kind==='xq'?T(`Tính <b>diện tích xung quanh</b> ${ten}.`,`Find the <b>lateral area</b>.`):kind==='tp'?T(`Tính <b>diện tích toàn phần</b> ${ten}.`,`Find the <b>total surface area</b>.`):T(`Tính <b>thể tích</b> ${ten}.`,`Find the <b>volume</b>.`),
  lp?T('Hình lập phương: xung quanh = cạnh × cạnh × 4; toàn phần = cạnh × cạnh × 6; thể tích = cạnh × cạnh × cạnh.','Cube: lateral = a×a×4, total = a×a×6, volume = a×a×a.'):T('Hình hộp chữ nhật: xung quanh = (dài + rộng) × 2 × cao; toàn phần = xung quanh + 2 đáy; thể tích = dài × rộng × cao.','Cuboid: lateral = (l + w) × 2 × h; volume = l × w × h.'),q=>q.a.length===3)}
function khaiTrien(){const O=[T('hình lập phương','cube'),T('hình hộp chữ nhật','cuboid'),T('hình trụ','cylinder')],D=[[T('6 hình vuông bằng nhau','6 equal squares'),0],[T('6 hình chữ nhật, từng cặp bằng nhau','6 rectangles in equal pairs'),1],[T('1 hình chữ nhật và 2 hình tròn','1 rectangle and 2 circles'),2]];const L=shuf(D.concat([pick(D)]));
 return chon('Vở: hình khai triển',O,L.map((d,i)=>({lb:LB[i],t:[{w:T(`Hình khai triển gồm ${d[0]} là của`,`A net of ${d[0]} is a`)},{b:1}]})),L.map(d=>d[1]),T('Hình khai triển là của <b>hình nào</b>?','Which <b>solid</b> does each net make?'),T('Hình lập phương có 6 mặt là hình vuông bằng nhau.','A cube has 6 equal square faces.'),q=>q.L.every((d,i)=>q.a[i]===d[1]),null,{L,wide:1})}
function thoiGianDoi(){const rows=[],a=[],P=[['giờ','phút',60],['phút','giây',60],['ngày','giờ',24],['năm','tháng',12],['thế kỉ','năm',100]];shuf(P).slice(0,3).forEach(([b,s,f],i)=>{const n=RR(2,9);rows.push({lb:LB[i],t:[{x:`${n} ${b} =`},{b:1},{x:s}]});a.push(n*f)});
 const h=pick([1.5,2.5,0.5,1.25]);rows.push({lb:'d)',t:[{x:`${dc(h)} giờ =`},{b:1},{x:'phút'}]});a.push(h*60);
 return fd('Vở: các đơn vị đo thời gian',rows,a,T('<b>Viết số</b> thích hợp.','<b>Write</b> the right number.'),T('1 giờ = 60 phút, 1 ngày = 24 giờ, 1 năm = 12 tháng, 1 thế kỉ = 100 năm.','1 hour = 60 min, 1 day = 24 h, 1 year = 12 months.'))}
function thoiGianTinh(kind){const rows=[],a=[],P=[];for(let i=0;i<3;i++){let h1=RR(1,9),m1=RR(5,55),h2=RR(1,5),m2=RR(5,55),rH,rM;
  if(kind==='+'){const t=(h1+h2)*60+m1+m2;rH=Math.floor(t/60);rM=t%60;rows.push({lb:LB[i],t:[{w:`${h1} giờ ${m1} phút + ${h2} giờ ${m2} phút =`},{b:1},{w:T('giờ','h')},{b:1},{w:T('phút','min')}]})}
  else if(kind==='-'){if(h1*60+m1<=h2*60+m2){h1+=h2+1}const t=h1*60+m1-h2*60-m2;rH=Math.floor(t/60);rM=t%60;rows.push({lb:LB[i],t:[{w:`${h1} giờ ${m1} phút ${M} ${h2} giờ ${m2} phút =`},{b:1},{w:T('giờ','h')},{b:1},{w:T('phút','min')}]})}
  else if(kind==='x'){const k=RR(2,4),hh=RR(1,3),mm=RR(5,40);const t=(hh*60+mm)*k;rH=Math.floor(t/60);rM=t%60;rows.push({lb:LB[i],t:[{w:`${hh} giờ ${mm} phút ${X} ${k} =`},{b:1},{w:T('giờ','h')},{b:1},{w:T('phút','min')}]})}
  else{const k=RR(2,4),hh=RR(1,3),mm=RR(1,20)*1;const t=(hh*60+mm)*k;const H=Math.floor(t/60),Mi=t%60;rH=hh;rM=mm;rows.push({lb:LB[i],t:[{w:`${H} giờ ${Mi} phút : ${k} =`},{b:1},{w:T('giờ','h')},{b:1},{w:T('phút','min')}]})}
  a.push(rH,rM)}
 const nm={'+':'cộng','-':'trừ','x':'nhân',':':'chia'}[kind];
 return form(`Vở: ${nm} số đo thời gian`,rows,a,T('<b>Tính</b> (số phút bé hơn 60).','<b>Work out</b> (minutes under 60).'),T('Đủ 60 phút thì đổi thành 1 giờ.','Every 60 minutes makes 1 hour.'),q=>q.a.every((v,i)=>i%2===0||v<60))}
function chuyenDong(kind){const rows=[],a=[];for(let i=0;i<3;i++){const v=RR(3,12)*5,t=RR(1,5),s=v*t;const k=kind||['v','s','t'][i];
  if(k==='v'){rows.push({lb:LB[i],t:[{w:T(`Quãng đường ${s} km, thời gian ${t} giờ. Vận tốc:`,`${s} km in ${t} h. Speed:`)},{b:1},{w:'km/giờ'}]});a.push(v)}
  else if(k==='s'){rows.push({lb:LB[i],t:[{w:T(`Vận tốc ${v} km/giờ, thời gian ${t} giờ. Quãng đường:`,`${v} km/h for ${t} h. Distance:`)},{b:1},{w:'km'}]});a.push(s)}
  else{rows.push({lb:LB[i],t:[{w:T(`Quãng đường ${s} km, vận tốc ${v} km/giờ. Thời gian:`,`${s} km at ${v} km/h. Time:`)},{b:1},{w:T('giờ','h')}]});a.push(t)}}
 return form(kind==='v'?'Vở: vận tốc':kind?'Vở: quãng đường, thời gian':'Vở: vận tốc, quãng đường, thời gian',rows,a,T('<b>Tính</b> vận tốc, quãng đường hoặc thời gian.','<b>Work out</b> the speed, distance or time.'),T('Vận tốc = quãng đường : thời gian. Quãng đường = vận tốc × thời gian. Thời gian = quãng đường : vận tốc.','v = s ÷ t, s = v × t, t = s ÷ v.'),q=>q.a.length===3)}
function bdQuat(){const P=shuf([[50,25,25],[40,30,20,10],[45,35,20],[30,30,25,15],[60,25,15]]).shift(),nm=['Bóng đá','Cầu lông','Bơi','Cờ vua'].slice(0,P.length),N=pick([20,40,60,80]);const k=RR(0,P.length-1),j=(k+1)%P.length;
 return form('Vở: biểu đồ hình quạt tròn',[{t:[{qt:[P,nm]}]},{lb:'a)',t:[{w:T(`Lớp có ${N} học sinh. Số bạn thích ${nm[k]}:`,`${N} pupils. Pupils choosing ${nm[k]}:`)},{b:1}]},{lb:'b)',t:[{w:T(`Số bạn thích ${nm[j]}:`,`Pupils choosing ${nm[j]}:`)},{b:1}]},{lb:'c)',t:[{w:T(`${nm[0]} hơn ${nm[P.length-1]}:`,`${nm[0]} minus ${nm[P.length-1]}:`)},{b:1},{x:'%'}]}],[N*P[k]/100,N*P[j]/100,P[0]-P[P.length-1]],T('Đọc <b>biểu đồ hình quạt tròn</b>.','Read the <b>pie chart</b>.'),T('Số học sinh bằng tổng số học sinh nhân số phần trăm rồi chia 100.','Pupils = total × percentage ÷ 100.'),q=>q.a[0]===N*P[k]/100)}
function tiSoLan(){const rows=[],a=[],P=[];for(let i=0;i<3;i++){const n=pick([10,20,25,40,50]),k=RR(1,n-1);const r=red(k,n);P.push(r);rows.push({lb:LB[i],t:[{w:T(`Tung đồng xu ${n} lần, mặt sấp xuất hiện ${k} lần. Tỉ số số lần mặt sấp và tổng số lần tung:`,`${n} tosses, ${k} heads. Heads to total:`)},{fb:1}]});a.push(...r)}
 return form('Vở: tỉ số của số lần lặp lại một sự kiện',rows,a,T('Viết <b>tỉ số</b> (phân số tối giản).','Write the <b>ratio</b> in simplest form.'),T('Tỉ số = số lần sự kiện xảy ra : tổng số lần thực hiện.','Ratio = times it happened ÷ total tries.'),q=>q.P.every((p,i)=>q.a[2*i]===p[0]&&q.a[2*i+1]===p[1]),{P})}
const sgnDec=()=>soSanhSTP();

/* ---------- trang theo bài ---------- */
const P=(b,i)=>PAGES[b]()[i];
const PAGES={
 1:()=>[dauLon(100000,99999999),xep(100000,9999999),vietTong5(100001,9999999)],
 2:()=>[tinh([congSo(10000,900000,'+'),congSo(10000,999999,'-'),nhanSo(1000,9999,99999),(()=>{const b=RR(11,99),q=RR(100,999);return{a:b*q,b,op:':',r:q}})()]),datTinh([congSo(10000,80000,'+'),congSo(10000,99999,'-')]),bieuThuc(1)],
 3:()=>[psBang(),rutGon(),soSanhPS()],4:()=>[psThapPhan(),psThapPhan(),rutGon()],5:()=>[psTinh('+'),psTinh('x'),psTinh(':')],6:()=>[psTinh('+'),psTinh('-'),soSanhPS()],7:()=>[honSo(),honSo(),psTinh('+')],
 8:()=>[V.chuVi(),V.dienTich(),doiDV([['m','cm',100],['km','m',1000,5],['tấn','kg',1000,5],['m²','dm²',100]],'Vở: đổi đơn vị đo')],9:()=>[P(5,0),P(7,0),P(4,0)],
 10:()=>[vietSTP(),vietSTP(),psThapPhan()],11:()=>[soSanhSTP(),xepSTP(),soSanhSTP()],12:()=>[soDoSTP(),soDoSTP(),vietSTP()],13:()=>[lamTronSTP(),lamTronSTP(),soSanhSTP()],14:()=>[P(10,0),P(11,0),P(12,0)],
 15:()=>[doiDV([['km²','ha',100],['ha','m²',10000,5],['km²','m²',1000000,3],['km²','ha',100]],'Vở: ki-lô-mét vuông, héc-ta'),doiDV([['km²','ha',100],['ha','m²',10000,3]],'Vở: ki-lô-mét vuông, héc-ta'),V.dienTich()],
 16:()=>[doiDV([['m²','dm²',100],['dm²','cm²',100],['cm²','mm²',100],['dam²','m²',100],['hm²','dam²',100]],'Vở: bảng đơn vị đo diện tích'),doiDV([['m²','cm²',10000,5],['hm²','m²',10000,3],['m²','dm²',100]],'Vở: bảng đơn vị đo diện tích'),soDoSTP()],17:()=>[P(15,0),P(16,0),P(12,0)],18:()=>[P(15,1),P(16,1),P(13,0)],
 19:()=>[tinhDec(uniq(()=>{const e=cong();return{r:e[1],e}},4).map(x=>x.e),'Vở: cộng số thập phân'),tinhDec([cong(),cong(),cong()]),soSanhSTP()],
 20:()=>[tinhDec([tru(),tru(),tru(),tru()],'Vở: trừ số thập phân'),tinhDec([cong(),tru(),tru()]),soSanhSTP()],
 21:()=>[tinhDec([nhanTN(),nhanTN(),nhan2(),nhan2()],'Vở: nhân số thập phân'),tinhDec([nhan2(),nhan2(),nhanTN()]),tinhDec([nhanTN(),cong(),tru()])],
 22:()=>[tinhDec([chiaTN(),chiaTN(),chiaTTN(),chia2()],'Vở: chia số thập phân'),tinhDec([chia2(),chia2(),chiaTN()]),tinhDec([chiaTTN(),chiaTTN(),chiaTN()])],
 23:()=>[tinhDec([nhan10(),nhan10(),nhan10(),nhan10()],'Vở: nhân, chia với 10; 100; 0,1; …'),tinhDec([nhan10(),nhan10(),nhan10()]),soDoSTP()],24:()=>[P(21,0),P(22,0),P(23,0)],
 25:()=>[dtTamGiac(),dtTamGiac(),V.chuVi()],26:()=>[dtThang(),dtThang(),dtTamGiac()],27:()=>[hinhTron5('cv'),hinhTron5('dt'),hinhTron5('cv')],28:()=>[P(25,0),P(26,0),P(27,1)],29:()=>[P(25,1),P(26,1),P(27,0)],
 30:()=>[P(10,0),P(11,0),P(13,0)],31:()=>[P(19,0),P(21,0),P(22,0)],32:()=>[P(25,0),P(26,0),P(27,0)],33:()=>[P(26,0),P(27,1),P(25,0)],34:()=>[P(12,0),P(15,0),P(16,0)],35:()=>[P(31,1),P(33,1),P(34,0)],
 36:()=>[tiSo(),tiSo(),tiSoPT()],37:()=>[tiLeBD(),tiLeBD(),tiSo()],38:()=>[tongTi(0),tongTi(0),V.tongHieu()],39:()=>[tongTi(1),tongTi(1),tongTi(0)],40:()=>[tiSoPT(),tiSoPT(),tiSo()],41:()=>[giaTriPT(),giaTriPT(),tiSoPT()],
 42:()=>[tinhDec([nhan2(),chia2(),cong(),tru()],'Vở: tính (máy tính cầm tay)'),giaTriPT(),tiSoPT()],43:()=>[giaTriPT(),tinhDec([nhan2(),chia2(),cong()]),tiSoPT()],44:()=>[P(38,0),P(40,0),P(41,0)],
 45:()=>[theTichDem(),theTichDem(),khaiTrien()],46:()=>[doiDV([['dm³','cm³',1000,5],['dm³','cm³',1000,9],['dm³','cm³',1000,3]],'Vở: xăng-ti-mét khối, đề-xi-mét khối'),theTichDem(),hopTinh('v')],
 47:()=>[doiDV([['m³','dm³',1000,5],['m³','cm³',1000000,3],['m³','dm³',1000,9]],'Vở: mét khối'),hopTinh('v'),theTichDem()],48:()=>[P(46,0),P(47,0),P(45,0)],
 49:()=>[khaiTrien(),khaiTrien(),theTichDem()],50:()=>[hopTinh('xq'),hopTinh('tp'),hopTinh('xq')],51:()=>[hopTinh('xq',1),hopTinh('tp',1),hopTinh('xq')],52:()=>[hopTinh('v'),hopTinh('v'),hopTinh('tp')],53:()=>[hopTinh('v',1),hopTinh('v',1),hopTinh('v')],54:()=>[hopTinh('v'),hopTinh('v',1),theTichDem()],55:()=>[P(50,0),P(51,1),P(52,0)],
 56:()=>[thoiGianDoi(),thoiGianDoi(),thoiGianTinh('+')],57:()=>[thoiGianTinh('+'),thoiGianTinh('-'),thoiGianDoi()],58:()=>[thoiGianTinh('x'),thoiGianTinh(':'),thoiGianTinh('x')],
 59:()=>[chuyenDong('v'),chuyenDong('v'),chuyenDong()],60:()=>[chuyenDong('s'),chuyenDong('t'),chuyenDong()],61:()=>[chuyenDong(),chuyenDong(),chuyenDong('v')],62:()=>[P(57,0),P(58,0),P(60,0)],
 63:()=>[V.daySL(),bangSoLieu(),V.daySL()],64:()=>[bdQuat(),bdQuat(),bdQuat()],65:()=>[tiSoLan(),soLan(),tiSoLan()],66:()=>[bdQuat(),tiSoLan(),bangSoLieu()],67:()=>[P(64,0),P(65,0),P(63,0)],
 68:()=>[P(1,0),P(3,0),P(11,0)],69:()=>[P(5,0),P(21,0),P(22,0)],70:()=>[P(36,0),P(40,0),P(41,0)],71:()=>[P(26,0),P(27,1),P(52,0)],72:()=>[P(15,0),P(46,0),P(56,0)],73:()=>[P(59,0),P(60,0),P(61,0)],74:()=>[P(64,0),P(65,0),khaNang()],75:()=>[P(69,1),P(71,0),P(73,0)]};
{const _p=window.voPage;window.voPage=function(x){if(curG()===5&&PAGES[x.b])return PAGES[x.b]().filter(Boolean);return _p(x)}}
document.head.insertAdjacentHTML('beforeend',`<style>
.vopad.dec{grid-template-columns:repeat(7,1fr)}
.vohs{display:inline-flex;align-items:center;gap:2px;font-family:var(--f-display);font-size:22px;color:#1F2A5A;background:#fff;padding:0 2px}.vohs>b{font-weight:400}
</style>`);
})();
