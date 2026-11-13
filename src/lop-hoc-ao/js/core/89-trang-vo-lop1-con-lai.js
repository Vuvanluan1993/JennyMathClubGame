/* 89 — Trang vở lớp 1: các bài còn lại (thầy giao hoàn thiện Tự luyện lớp 1, 13/11/2026)
   Chủ đề 2 hình phẳng (Bài 7–9) · Chủ đề 4 hình khối, vị trí (14–16) · Ôn HK1 (17–20) · Các số đến 100 (21–24)
   · Độ dài (25–28) · Cộng, trừ không nhớ trong phạm vi 100 (29–33) · Giờ và lịch (34–37) · Ôn cuối năm (38–41).
   Dùng 4 kiểu trang của 87 (vof · voc · von · vok). Mảnh hình mới, tự vẽ bằng SVG pixel:
     {sh:'vuong|tron|tamgiac|chunhat'} hình phẳng · {shs:[[loại,màu]…]} dải hình để đếm · {kh:'lp|hcn'} khối
     {row:[hình…]} dải đồ vật ngang · {stk:[hình…]} chồng dọc · {tens:[chục,đơn vị]} thanh chục và ô lẻ
     {bar:[dài,màu,nhãn]} băng giấy trên lưới ô · {col:[[cao,nhãn]…]} các cột · {ruler:[từ,đến]} thước cm
     {vc:[a,dấu,b]} đặt tính dọc (ô kết quả từng chữ số) · {clock:giờ} đồng hồ · {cal:[ngày,thứ,tháng]} tờ lịch
   Bài ôn tập lấy trang của các bài trước (cùng seed). Mỗi câu có vchk() tự kiểm đáp án. Không chép sách. */
(function(){
const V=window.VO;if(!V||!V.mkQ||!V.tokX)return;
const {T,RR,VS,vspr,mkQ,LB,SP,SIGN,sgn,distinct}=V;
const M='−',ev=(a,o,b)=>o==='+'?a+b:a-b;
const COL=['#F04A1B','#12B5E8','#2AB563','#FCB40C','#8656A8','#F37A1F'];
const svg=(w,h,b,lbl)=>`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" role="img" aria-label="${lbl||''}">${b}</svg>`;
/* ---------- hình phẳng ---------- */
const SHN={vuong:['hình vuông','square'],tron:['hình tròn','circle'],tamgiac:['hình tam giác','triangle'],chunhat:['hình chữ nhật','rectangle']},SHK=Object.keys(SHN);
const shName=k=>T(...SHN[k]);
function shSvg(k,c,z){z=z||30;const s=2,f=COL[c%COL.length];let b;
 if(k==='vuong')b=`<rect x="5" y="5" width="${z-10}" height="${z-10}" fill="${f}" stroke="#1F2A5A" stroke-width="${s}"/>`;
 else if(k==='tron')b=`<circle cx="${z/2}" cy="${z/2}" r="${z/2-4}" fill="${f}" stroke="#1F2A5A" stroke-width="${s}" shape-rendering="auto"/>`;
 else if(k==='tamgiac')b=`<polygon points="${z/2},4 ${z-3},${z-5} 3,${z-5}" fill="${f}" stroke="#1F2A5A" stroke-width="${s}" shape-rendering="auto"/>`;
 else b=`<rect x="2" y="${z*.28}" width="${z-4}" height="${z*.44}" fill="${f}" stroke="#1F2A5A" stroke-width="${s}"/>`;
 return svg(z,z,b,shName(k))}
/* ---------- khối ---------- */
const KHN={lp:['khối lập phương','cube'],hcn:['khối hộp chữ nhật','cuboid']};
function khSvg(k,c){const f=COL[c%COL.length],w=k==='lp'?22:34,h=22,d=9,W=w+d+4,H=h+d+4;
 const b=`<polygon points="2,${d+2} ${w+2},${d+2} ${w+2},${H-2} 2,${H-2}" fill="${f}" stroke="#1F2A5A" stroke-width="2"/><polygon points="2,${d+2} ${d+2},2 ${W-2},2 ${w+2},${d+2}" fill="#fff" stroke="#1F2A5A" stroke-width="2"/><polygon points="${w+2},${d+2} ${W-2},2 ${W-2},${h+2} ${w+2},${H-2}" fill="${f}" fill-opacity=".6" stroke="#1F2A5A" stroke-width="2"/>`;
 return svg(W,H,b,T(...KHN[k]))}
/* ---------- đồng hồ, tờ lịch ---------- */
function clockSvg(h,z){z=z||52;const c=z/2,r=c-3;let b=`<circle cx="${c}" cy="${c}" r="${r}" fill="#fff" stroke="#1F2A5A" stroke-width="3" shape-rendering="auto"/>`;
 for(let i=0;i<12;i++){const a=i*Math.PI/6,x1=c+Math.sin(a)*(r-2),y1=c-Math.cos(a)*(r-2),x2=c+Math.sin(a)*(r-(i%3?5:8)),y2=c-Math.cos(a)*(r-(i%3?5:8));b+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1F2A5A" stroke-width="${i%3?1.5:2.5}" shape-rendering="auto"/>`}
 const ah=(h%12)*Math.PI/6;b+=`<line x1="${c}" y1="${c}" x2="${c+Math.sin(ah)*r*.5}" y2="${c-Math.cos(ah)*r*.5}" stroke="#F04A1B" stroke-width="4" stroke-linecap="round" shape-rendering="auto"/><line x1="${c}" y1="${c}" x2="${c}" y2="${c-r*.8}" stroke="#1F2A5A" stroke-width="2.5" stroke-linecap="round" shape-rendering="auto"/><circle cx="${c}" cy="${c}" r="3" fill="#1F2A5A"/>`;
 return svg(z,z,b,`${h} ${T('giờ','o’clock')}`)}
const DAYS=()=>[T('thứ hai','Monday'),T('thứ ba','Tuesday'),T('thứ tư','Wednesday'),T('thứ năm','Thursday'),T('thứ sáu','Friday'),T('thứ bảy','Saturday'),T('chủ nhật','Sunday')];
function calSvg(d,th,m){const b=`<rect x="1" y="1" width="62" height="70" fill="#fff" stroke="#1F2A5A" stroke-width="2"/><rect x="1" y="1" width="62" height="14" fill="#0079C1"/><text x="32" y="12" text-anchor="middle" font-family="VT323,monospace" font-size="12" fill="#fff">${T('THÁNG','MONTH')} ${m}</text><text x="32" y="48" text-anchor="middle" font-family="VT323,monospace" font-size="34" fill="#F04A1B">${d}</text><text x="32" y="66" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-size="9" font-weight="700" fill="#1F2A5A">${DAYS()[th].toUpperCase()}</text>`;
 return svg(64,72,b,`${d}`)}
/* ---------- thanh chục ---------- */
function tensSvg(t,u){const W=t*9+(u?u*9+6:0)+2,H=10*7+2;let b='';
 for(let i=0;i<t;i++)for(let j=0;j<10;j++)b+=`<rect x="${1+i*9}" y="${1+j*7}" width="7" height="6" fill="#12B5E8" stroke="#1F2A5A" stroke-width="1"/>`;
 for(let k=0;k<u;k++)b+=`<rect x="${1+t*9+6+k*9}" y="${H-8}" width="7" height="6" fill="#FCB40C" stroke="#1F2A5A" stroke-width="1"/>`;
 return svg(W,H,b,`${t} ${T('chục','tens')} ${u}`)}
/* ---------- băng giấy, cột, thước ---------- */
const U=16;
function barH(L,c,lab){const W=10*U+22,H=U+6;let b='';for(let i=0;i<=10;i++)b+=`<line x1="${20+i*U}" y1="1" x2="${20+i*U}" y2="${H-1}" stroke="#c9d6ea"/>`;
 b+=`<rect x="20" y="3" width="${L*U}" height="${U}" fill="${COL[c%COL.length]}" stroke="#1F2A5A" stroke-width="2"/><text x="8" y="${H-6}" text-anchor="middle" font-family="VT323,monospace" font-size="16" fill="#1F2A5A">${lab||''}</text>`;
 return svg(W,H,b,`${lab||''} ${L}`)}
function colsV(cs){const H=9*10+18,W=cs.length*34+6;let b=`<line x1="2" y1="${H-16}" x2="${W-2}" y2="${H-16}" stroke="#1F2A5A" stroke-width="2"/>`;
 cs.forEach(([h,lab],i)=>{const x=8+i*34;b+=`<rect x="${x}" y="${H-16-h*10}" width="20" height="${h*10}" fill="${COL[(i+2)%COL.length]}" stroke="#1F2A5A" stroke-width="2"/><text x="${x+10}" y="${H-3}" text-anchor="middle" font-family="VT323,monospace" font-size="15" fill="#1F2A5A">${lab}</text>`});
 return svg(W,H,b,'')}
function rulerSvg(a,bb){const u=21,W=10*u+16,H=44;let b=`<rect x="${8+a*u}" y="3" width="${(bb-a)*u}" height="11" fill="#FCB40C" stroke="#1F2A5A" stroke-width="2"/><rect x="2" y="18" width="${W-4}" height="24" fill="#FFF4D6" stroke="#1F2A5A" stroke-width="2"/>`;
 for(let i=0;i<=10;i++){b+=`<line x1="${8+i*u}" y1="18" x2="${8+i*u}" y2="27" stroke="#1F2A5A" stroke-width="1.5"/><text x="${8+i*u}" y="39" text-anchor="middle" font-family="VT323,monospace" font-size="12" fill="#1F2A5A">${i}</text>`}
 return svg(W,H,b,`${T('Thước','Ruler')} ${a}–${bb}`)}
/* ---------- mảnh mới ---------- */
const NAME={tao:['quả táo','the apple'],sao:['ngôi sao','the star'],banh:['cái bánh','the cake'],ca:['con cá','the fish'],bong:['quả bóng','the balloon'],hoa:['bông hoa','the flower']};
const nm=k=>T(...NAME[k]);
{const _x=V.tokX;V.tokX=function(t,cell,q){if(!t||typeof t!=='object')return _x(t,cell,q);
 if(t.w!==undefined)return`<span class="votx">${t.w}</span>`;
 if(t.sh)return`<span class="vosh">${shSvg(t.sh,t.c||0,t.z)}</span>`;
 if(t.shs)return`<div class="vopic one voshs">${t.shs.map(([k,c])=>shSvg(k,c,26)).join('')}</div>`;
 if(t.kh)return`<span class="vosh">${khSvg(t.kh,t.c||0)}</span>`;
 if(t.khs)return`<div class="vopic one voshs">${t.khs.map(([k,c])=>khSvg(k,c)).join('')}</div>`;
 if(t.row)return`<div class="vopic one vorowp">${t.row.map(k=>vspr(k,2.6)).join('')}</div>`;
 if(t.stk)return`<div class="vopic one vostk">${t.stk.map(k=>vspr(k,2.6)).join('')}</div>`;
 if(t.tens)return`<span class="vosh">${tensSvg(t.tens[0],t.tens[1])}</span>`;
 if(t.bar)return`<span class="vosh">${barH(...t.bar)}</span>`;
 if(t.col)return`<span class="vosh">${colsV(t.col)}</span>`;
 if(t.ruler)return`<span class="vosh">${rulerSvg(...t.ruler)}</span>`;
 if(t.clock!==undefined)return`<span class="vosh">${clockSvg(t.clock,t.z)}</span>`;
 if(t.cal)return`<span class="vosh">${calSvg(...t.cal)}</span>`;
 if(t.vc){const [a,o,b]=t.vc,r=ev(a,o==='+'?'+':'-',b),d=n=>String(n).padStart(2,' ').split('');const A=d(a),B=d(b);
  return`<span class="vovc"><i></i><i>${A[0].trim()}</i><i>${A[1]}</i><i class="op">${o}</i><i>${B[0].trim()}</i><i>${B[1]}</i><b></b><i></i>${cell()}${cell()}</span>`}
 return _x(t,cell,q)}}
/* ---------- đọc số ---------- */
const W1=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
function docSo(n){if(n<10)return W1[n];if(n===10)return'mười';const t=Math.floor(n/10),u=n%10;if(t===1)return'mười'+(u?' '+(u===5?'lăm':W1[u]):'');
 return W1[t]+' mươi'+(u===0?'':' '+(u===1?'mốt':u===4?'tư':u===5?'lăm':W1[u]))}
const EN1=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],ENT=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const readN=n=>T(docSo(n),n<20?EN1[n]:ENT[Math.floor(n/10)]+(n%10?'-'+EN1[n%10]:''));
/* ---------- khung câu ---------- */
const need=T('Em điền hết các ô trống nhé.','Fill in every box first.'),needC=T('Em chọn cho mọi ô nhé.','Choose for every box first.'),needN=T('Em nối hết nhé.','Match them all first.'),needK=T('Em đặt thẻ vào hết các ô nhé.','Put a card in every box first.');
const HINTN=(vi,en)=>T(vi+' Nét đứt là mẫu.',en+' The dashed line is the example.');
function noiQ(kind,leftT,rightT,vals,q,say,check){const R=shuf([0,1,2]);
 return mkQ({lay:'von',kind,left:leftT,right:R.map(k=>rightT[k]),R,vals,a:[R.indexOf(1),R.indexOf(2)],rows2:[],q,say,need:needN,sol:vals.join(' · '),vchk(){return this.a.every((r,k)=>this.R[r]===k+1)&&check(this)}})}

/* ===== Chủ đề 2: hình phẳng ===== */
function tenHinh(){const ks=shuf(SHK.concat([pick(SHK)])),[m,...R]=ks;
 return mkQ({lay:'voc',kind:'Vở: tên hình',wide:1,opts:SHK.map(shName),mau:[{sh:m,c:0},{w:T('là','is a')},{mc:SHK.indexOf(m)}],
  rows2:R.map((k,i)=>({lb:LB[i],t:[{sh:k,c:i+1},{w:T('là','is a')},{b:1}]})),a:R.map(k=>SHK.indexOf(k)),K:R,
  q:T('Mỗi hình dưới đây là <b>hình gì</b>?','<b>What shape</b> is each one?'),say:T('Em chạm vào ô, rồi chọn tên hình ở dưới. Nhìn mẫu trước nhé.','Tap a box, then choose the shape name below. Look at the example first.'),
  need:needC,sol:R.map(shName).join(' · '),vchk(){return this.K.every((k,i)=>SHK[this.a[i]]===k)}})}
function demHinh(){const N=RR(8,11),L=Array.from({length:N},()=>[pick(SHK),RR(0,5)]);SHK.forEach(k=>{if(!L.some(x=>x[0]===k))L[RR(0,N-1)]=[k,RR(0,5)]});
 const cnt=SHK.map(k=>L.filter(x=>x[0]===k).length);
 return mkQ({lay:'vof',kind:'Vở: đếm hình',rows2:[{t:[{shs:L}]}].concat(SHK.map((k,i)=>({lb:LB[i],t:[{sh:k,c:i,z:24},{w:`${shName(k)}:`},{b:1}]}))),a:cnt,L,
  q:T('<b>Đếm</b> số hình mỗi loại.','<b>Count</b> each kind of shape.'),say:T('Em đếm xem có bao nhiêu hình mỗi loại rồi viết số.','Count how many of each shape there are and write the number.'),
  need,sol:SHK.map((k,i)=>`${shName(k)}: ${cnt[i]}`).join(' · '),vchk(){return SHK.every((k,i)=>this.L.filter(x=>x[0]===k).length===this.a[i])}})}
function noiHinh(){const ks=distinct(3,0,3).map(i=>SHK[i]);
 return noiQ('Vở: nối hình với tên',ks.map((k,i)=>[{sh:k,c:i+2}]),ks.map(k=>[{e:shName(k)}]),ks.map(shName),T('<b>Nối</b> mỗi hình với tên của nó.','<b>Match</b> each shape to its name.'),HINTN('Em nối mỗi hình với tên của nó.','Match each shape to its name.'),q=>q.left.every((l,i)=>q.right[q.R.indexOf(i)][0].e===shName(l[0].sh)))}
function quyLuat(kind,opts,draw,mx){const units=[[0,1],[0,0,1],[0,1,2],[0,1,1]],rows=[],a=[],S=[];
 for(let i=0;i<4;i++){const u=pick(units),ty=shuf(opts.map((_,k)=>k)).slice(0,3),L=Math.min(mx||9,u.length*2+(u.length===2?1:0)),seq=Array.from({length:L},(_,j)=>ty[u[j%u.length]]),nx=ty[u[L%u.length]];
  S.push({seq,nx});const t=seq.map(k=>draw(k,i)).concat([{b:1}]);if(i===0)t[t.length-1]={mc:nx};if(i===0)rows.push({mau:1,t});else{rows.push({lb:LB[i-1],t});a.push(nx)}}
 return mkQ({lay:'voc',kind,raw:1,opts:opts.map((k,j)=>draw(j,-1).html),mau:rows[0].t.map(x=>x.html!==undefined?{x:x.html}:x),rows2:rows.slice(1).map(r=>({lb:r.lb,t:r.t.map(x=>x.html!==undefined?{x:x.html}:x)})),a,S:S.slice(1),
  q:T('Hình tiếp theo là <b>hình nào</b>?','<b>Which shape</b> comes next?'),say:T('Em tìm quy luật rồi chọn hình tiếp theo. Nhìn mẫu trước nhé.','Find the pattern and choose the next shape. Look at the example first.'),
  need:needC,sol:T('Theo quy luật lặp lại','Follow the repeating pattern'),vchk(){return this.S.every((s,i)=>s.nx===this.a[i])}})}
const qlHinh=()=>quyLuat('Vở: quy luật hình',SHK,(k,i)=>({html:shSvg(SHK[k],k,22)}));
const qlKhoi=()=>quyLuat('Vở: quy luật khối',['lp','hcn','lp2'],(k,i)=>({html:khSvg(k===1?'hcn':'lp',k===2?3:k)}),4);
/* ===== Chủ đề 4: khối, vị trí ===== */
function tenKhoi(){const ks=shuf(['lp','hcn','lp','hcn',pick(['lp','hcn'])]),[m,...R]=ks,K=['lp','hcn'];
 return mkQ({lay:'voc',kind:'Vở: tên khối',wide:1,opts:K.map(k=>T(...KHN[k])),mau:[{kh:m,c:0},{w:T('là','is a')},{mc:K.indexOf(m)}],rows2:R.map((k,i)=>({lb:LB[i],t:[{kh:k,c:i+1},{w:T('là','is a')},{b:1}]})),a:R.map(k=>K.indexOf(k)),K:R,
  q:T('Mỗi đồ vật dưới đây có dạng <b>khối gì</b>?','<b>What solid</b> is each one?'),say:T('Em chạm vào ô, rồi chọn khối lập phương hay khối hộp chữ nhật.','Tap a box, then choose cube or cuboid.'),need:needC,sol:R.map(k=>T(...KHN[k])).join(' · '),vchk(){return this.K.every((k,i)=>['lp','hcn'][this.a[i]]===k)}})}
function demKhoi(){const N=RR(6,9),L=Array.from({length:N},()=>[pick(['lp','hcn']),RR(0,5)]);if(!L.some(x=>x[0]==='lp'))L[0][0]='lp';if(!L.some(x=>x[0]==='hcn'))L[1][0]='hcn';
 const c=['lp','hcn'].map(k=>L.filter(x=>x[0]===k).length);
 return mkQ({lay:'vof',kind:'Vở: đếm khối',rows2:[{t:[{khs:L}]},{lb:'a)',t:[{kh:'lp',c:0},{w:T('Khối lập phương:','Cubes:')},{b:1}]},{lb:'b)',t:[{kh:'hcn',c:1},{w:T('Khối hộp chữ nhật:','Cuboids:')},{b:1}]}],a:c,L,
  q:T('<b>Đếm</b> số khối mỗi loại.','<b>Count</b> each kind of solid.'),say:T('Em đếm khối lập phương và khối hộp chữ nhật rồi viết số.','Count the cubes and the cuboids and write the numbers.'),need,sol:c.join(' · '),vchk(){return['lp','hcn'].every((k,i)=>this.L.filter(x=>x[0]===k).length===this.a[i])}})}
function traiPhai(){const rows=[],a=[],P=[];let mau;
 for(let i=0;i<4;i++){const row=SP().slice(0,3);let x,y;do{x=RR(0,2);y=RR(0,2)}while(x===y);const ans=x<y?0:1;P.push({row,x,y,ans});
  const t=[{row},{br:1},{w:T(`${nm(row[x])[0].toUpperCase()+nm(row[x]).slice(1)} ở`,`${nm(row[x])[0].toUpperCase()+nm(row[x]).slice(1)} is on the`)},i?{b:1}:{mc:ans},{w:T(`${nm(row[y])}`,`of ${nm(row[y])}`)}];
  if(i)rows.push({lb:LB[i-1],t}),a.push(ans);else mau=t}
 return mkQ({lay:'voc',kind:'Vở: bên trái, bên phải',wide:1,opts:[T('bên trái','left'),T('bên phải','right')],mau,rows2:rows,a,P:P.slice(1),
  q:T('Chọn <b>bên trái</b> hay <b>bên phải</b>.','Choose <b>left</b> or <b>right</b>.'),say:T('Em nhìn hàng đồ vật, rồi chọn bên trái hay bên phải.','Look at the row, then choose left or right.'),need:needC,sol:'',vchk(){return this.P.every((p,i)=>(p.x<p.y?0:1)===this.a[i])}})}
function trenDuoi(){const rows=[],a=[],P=[];
 for(let i=0;i<3;i++){const stk=SP().slice(0,3);let x,y;do{x=RR(0,2);y=RR(0,2)}while(x===y);const ans=x<y?0:1;P.push({x,y,ans});
  rows.push({lb:LB[i],t:[{stk},{w:T(`${nm(stk[x])} ở`,`${nm(stk[x])} is`)},{b:1},{w:T(nm(stk[y]),nm(stk[y]))}]});a.push(ans)}
 return mkQ({lay:'voc',kind:'Vở: trên, dưới',wide:1,opts:[T('phía trên','above'),T('phía dưới','below')],rows2:rows,a,P,
  q:T('Chọn <b>phía trên</b> hay <b>phía dưới</b>.','Choose <b>above</b> or <b>below</b>.'),say:T('Em nhìn chồng đồ vật, rồi chọn phía trên hay phía dưới.','Look at the stack, then choose above or below.'),need:needC,sol:'',vchk(){return this.P.every((p,i)=>(p.x<p.y?0:1)===this.a[i])}})}
function thuTu(){const row=SP().slice(0,5),ks=distinct(3,0,4);
 return mkQ({lay:'vof',kind:'Vở: thứ tự từ trái sang phải',rows2:[{t:[{row}]}].concat(ks.map((k,i)=>({lb:LB[i],t:[{w:T(`${nm(row[k])[0].toUpperCase()+nm(row[k]).slice(1)} đứng thứ`,`${nm(row[k])[0].toUpperCase()+nm(row[k]).slice(1)} is number`)},{b:1}]}))),a:ks.map(k=>k+1),ks,
  q:T('Từ trái sang phải, mỗi đồ vật <b>đứng thứ mấy</b>?','Counting from the left, <b>what position</b> is each one?'),say:T('Em đếm từ trái sang phải rồi viết số thứ tự.','Count from the left and write the position.'),need,sol:ks.map(k=>k+1).join(' · '),vchk(){return this.ks.every((k,i)=>this.a[i]===k+1)}})}
/* ===== Các số đến 100 ===== */
function chucDV(){const ns=distinct(3,11,99).map(n=>n%10===0?n+1:n),[m,...R]=ns,a=[];
 const row=(n,lb,b)=>({lb,t:[{tens:[Math.floor(n/10),n%10]},{br:1},b?{b:1}:{m:Math.floor(n/10)},{w:T('chục','tens')},b?{b:1}:{m:n%10},{w:T('đơn vị →','ones →')},b?{b:1}:{m:n}]});
 R.forEach(n=>a.push(Math.floor(n/10),n%10,n));
 return mkQ({lay:'vof',kind:'Vở: chục và đơn vị',mau:row(m,'',0).t,rows2:R.map((n,i)=>row(n,LB[i],1)),a,R,
  q:T('<b>Viết</b> số chục, số đơn vị rồi viết số.','<b>Write</b> the tens, the ones, then the number.'),say:T('Mỗi thanh là một chục. Em đếm chục và đơn vị rồi viết số. Nhìn mẫu trước nhé.','Each bar is one ten. Count the tens and ones, then write the number. Look at the example first.'),
  need,sol:R.join(' · '),vchk(){return this.R.every((n,i)=>this.a[3*i]===Math.floor(n/10)&&this.a[3*i+1]===n%10&&this.a[3*i+2]===n)}})}
function noiDoc(lo,hi){const ns=distinct(3,lo,hi);return noiQ('Vở: nối số với cách đọc',ns.map(n=>[{n}]),ns.map(n=>[{e:readN(n)}]),ns,T('<b>Nối</b> mỗi số với cách đọc.','<b>Match</b> each number to its name.'),HINTN('Em nối mỗi số với cách đọc của nó.','Match each number to how it is read.'),q=>q.left.every((l,i)=>q.right[q.R.indexOf(i)][0].e===readN(l[0].n)))}
function vietSo(){const kinds=shuf(['gom','sau','truoc','giua']),rows=[],a=[];
 kinds.forEach((k,i)=>{let t,ans;const n=RR(11,98);
  if(k==='gom'){t=[{w:T(`Số gồm ${Math.floor(n/10)} chục và ${n%10} đơn vị:`,`${Math.floor(n/10)} tens and ${n%10} ones:`)},{b:1}];ans=n}
  else if(k==='sau'){t=[{w:T(`Số liền sau của ${n}:`,`The number after ${n}:`)},{b:1}];ans=n+1}
  else if(k==='truoc'){t=[{w:T(`Số liền trước của ${n}:`,`The number before ${n}:`)},{b:1}];ans=n-1}
  else{t=[{x:`${n-1} <`},{b:1},{x:`< ${n+1}`}];ans=n}
  rows.push({lb:LB[i],t});a.push(ans)});
 return mkQ({lay:'vof',kind:'Vở: viết số',rows2:rows,a,K:kinds,q:T('<b>Viết số</b> thích hợp vào ô trống.','<b>Write</b> the right number in each box.'),say:T('Em đọc kỹ rồi viết số thích hợp vào ô trống.','Read carefully, then write the right number.'),need,sol:a.join(' · '),
  vchk(){return this.a.every(v=>v>=10&&v<=99)}})}
function dayChuc(){const rows=[],a=[];for(let i=0;i<3;i++){const st=i===2?10:1,s0=i===2?RR(1,9):RR(10,94);const L=Array.from({length:6},(_,j)=>s0+j*st).filter(v=>v<=100);if(L.length<6){i--;continue}
  const pos=shuf([1,2,3,4,5]).slice(0,2);rows.push({lb:LB[i],t:L.map((v,j)=>pos.includes(j)?(a.push(v),{b:1}):{n:v})})}
 return mkQ({lay:'vof',kind:'Vở: dãy số đến 100',rows2:rows,a,q:T('<b>Viết</b> số còn thiếu vào ô trống.','<b>Write</b> the missing numbers.'),say:T('Em viết số còn thiếu. Dãy cuối cùng mỗi lần thêm 10.','Write the missing numbers. The last line goes up in tens.'),need,sol:a.join(' · '),
  vchk(){let k=0;return this.rows2.every(r=>{const F=r.t.map(x=>x.b?this.a[k++]:x.n);const d=F[1]-F[0];return F.every((v,i)=>!i||v-F[i-1]===d)})}})}
function dau100(){const ps=[];const want=shuf([0,1,2,0,1,2,RR(0,1)]);want.forEach(w=>{let x,y;do{x=RR(10,99);y=w===2?x:RR(Math.max(10,x-15),Math.min(99,x+15))}while(sgn(x,y)!==w);ps.push([x,y])});
 const [m,...R]=ps;return mkQ({lay:'voc',kind:'Vở: so sánh số có hai chữ số',c2:1,opts:SIGN,mau:[{m:m[0]},{mc:sgn(...m)},{m:m[1]}],rows2:R.map((p,i)=>({lb:LB[i],t:[{n:p[0]},{b:1},{n:p[1]}]})),a:R.map(p=>sgn(...p)),R,
  q:T('Điền dấu <b>&gt;</b>, <b>&lt;</b>, <b>=</b> vào ô trống.','Write <b>&gt;</b>, <b>&lt;</b> or <b>=</b>.'),say:T('Em so sánh số chục trước, rồi đến số đơn vị.','Compare the tens first, then the ones.'),need:needC,sol:R.map(p=>`${p[0]} ${SIGN[sgn(...p)]} ${p[1]}`).join(' · '),vchk(){return this.R.every((p,i)=>sgn(...p)===this.a[i])}})}
function xep100(){const A=distinct(4,10,99),B=distinct(4,10,99),up=A.slice().sort((x,y)=>x-y),dn=B.slice().sort((x,y)=>y-x);
 return mkQ({lay:'vok',kind:'Vở: xếp thứ tự số đến 100',rows2:[{lb:'a)',t:[T(`Xếp ${A.join(', ')} từ bé đến lớn:`,`Order ${A.join(', ')} from smallest to largest:`)]},{t:[{b:1},{b:1},{b:1},{b:1}]},{lb:'b)',t:[T(`Xếp ${B.join(', ')} từ lớn đến bé:`,`Order ${B.join(', ')} from largest to smallest:`)]},{t:[{b:1},{b:1},{b:1},{b:1}]}],a:up.concat(dn),cards:shuf(A.concat(B)),
  q:T('<b>Kéo</b> thẻ số để xếp theo thứ tự.','<b>Drag</b> the cards to put the numbers in order.'),say:T('Em kéo thẻ số để xếp các số theo thứ tự.','Drag the cards to put the numbers in order.'),need:needK,sol:`${up.join(' < ')} · ${dn.join(' > ')}`,
  vchk(){const u=this.a.slice(0,4),d=this.a.slice(4);return u.every((v,i)=>!i||v>u[i-1])&&d.every((v,i)=>!i||v<d[i-1])}})}
/* ===== Độ dài ===== */
function daiNgan(){const rows=[],a=[],P=[];for(let i=0;i<4;i++){let x,y;do{x=RR(2,10);y=RR(2,10)}while(x===y);P.push([x,y]);
  const t=[{bar:[x,0,'A']},{br:1},{bar:[y,1,'B']},{br:1},{w:T('Băng A','Strip A is')},i?{b:1}:{mc:x>y?0:1},{w:T('băng B','than strip B')}];if(i)rows.push({lb:LB[i-1],t}),a.push(x>y?0:1);else rows.push(t)}
 return mkQ({lay:'voc',kind:'Vở: dài hơn, ngắn hơn',wide:1,opts:[T('dài hơn','longer'),T('ngắn hơn','shorter')],mau:rows[0],rows2:rows.slice(1),a,P:P.slice(1),
  q:T('Băng A <b>dài hơn</b> hay <b>ngắn hơn</b> băng B?','Is strip A <b>longer</b> or <b>shorter</b> than strip B?'),say:T('Em so sánh hai băng giấy, rồi chọn dài hơn hay ngắn hơn.','Compare the two strips, then choose longer or shorter.'),need:needC,sol:'',vchk(){return this.P.every((p,i)=>(p[0]>p[1]?0:1)===this.a[i])}})}
function demO(){const L=distinct(3,3,10);return mkQ({lay:'vof',kind:'Vở: băng giấy dài mấy ô',rows2:L.map((n,i)=>({lb:LB[i],t:[{bar:[n,i+2,'']},{br:1},{w:T('Dài','Length')},{b:1},{w:T('ô','squares')}]})),a:L,
  q:T('Mỗi băng giấy <b>dài mấy ô</b>?','How many <b>squares long</b> is each strip?'),say:T('Em đếm số ô của mỗi băng giấy.','Count the squares along each strip.'),need,sol:L.join(' · '),vchk(){return this.rows2.every((r,i)=>r.t[0].bar[0]===this.a[i])}})}
function caoThap(){const rows=[],a=[],P=[];for(let i=0;i<3;i++){let x,y;do{x=RR(2,9);y=RR(2,9)}while(x===y);P.push([x,y]);rows.push({lb:LB[i],t:[{col:[[x,'A'],[y,'B']]},{w:T('Cột A','Column A is')},{b:1},{w:T('cột B','than B')}]});a.push(x>y?0:1)}
 return mkQ({lay:'voc',kind:'Vở: cao hơn, thấp hơn',wide:1,opts:[T('cao hơn','taller'),T('thấp hơn','shorter')],rows2:rows,a,P,
  q:T('Cột A <b>cao hơn</b> hay <b>thấp hơn</b> cột B?','Is column A <b>taller</b> or <b>shorter</b>?'),say:T('Em so sánh hai cột, rồi chọn cao hơn hay thấp hơn.','Compare the columns, then choose taller or shorter.'),need:needC,sol:'',vchk(){return this.P.every((p,i)=>(p[0]>p[1]?0:1)===this.a[i])}})}
function thuoc(lech){const rows=[],a=[];for(let i=0;i<3;i++){const s=lech?RR(0,5):0,e=RR(s+2,10);rows.push({lb:LB[i],t:[{ruler:[s,e]},{br:1},{w:T('Băng giấy dài','The strip is')},{b:1},{x:'cm'}]});a.push(e-s)}
 return mkQ({lay:'vof',kind:lech?'Vở: đo bằng thước (không từ 0)':'Vở: đọc số đo',rows2:rows,a,q:lech?T('Băng giấy <b>dài mấy xăng-ti-mét</b>? Chú ý vạch bắt đầu.','How many <b>centimetres</b> long? Look where it starts.'):T('Băng giấy <b>dài mấy xăng-ti-mét</b>?','How many <b>centimetres</b> long is each strip?'),
  say:lech?T('Em xem băng giấy bắt đầu ở vạch nào, kết thúc ở vạch nào, rồi tính độ dài.','See where the strip starts and ends, then work out its length.'):T('Em đọc số ở vạch cuối băng giấy.','Read the number at the end of the strip.'),need,sol:a.map(v=>v+' cm').join(' · '),
  vchk(){return this.rows2.every((r,i)=>r.t[0].ruler[1]-r.t[0].ruler[0]===this.a[i])}})}
function cmTinh(){const P=[0,1,0,1].map(k=>{const op=k?'-':'+';let x,y;do{x=RR(1,9);y=RR(1,9)}while(op==='+'?x+y>10:x<y);return{x,y,op}});
 return mkQ({lay:'vof',kind:'Vở: tính với đơn vị cm',rows2:P.map((e,i)=>({lb:LB[i],t:[{x:`${e.x} cm ${e.op==='+'?'+':M} ${e.y} cm =`},{b:1},{x:'cm'}]})),a:P.map(e=>ev(e.x,e.op,e.y)),P,
  q:T('<b>Tính</b> (theo mẫu: 2 cm + 3 cm = 5 cm).','<b>Work out</b> (like 2 cm + 3 cm = 5 cm).'),say:T('Em tính rồi viết kết quả, nhớ đơn vị xăng-ti-mét.','Work out each one. Remember the centimetres.'),need,sol:'',vchk(){return this.P.every((e,i)=>ev(e.x,e.op,e.y)===this.a[i])}})}
function cmDau(){const ps=[];shuf([0,1,2,RR(0,1)]).forEach(w=>{let x,y;do{x=RR(1,15);y=w===2?x:RR(1,15)}while(sgn(x,y)!==w);ps.push([x,y])});const [m,...R]=ps;
 return mkQ({lay:'voc',kind:'Vở: so sánh độ dài',opts:SIGN,mau:[{x:`${m[0]} cm`},{mc:sgn(...m)},{x:`${m[1]} cm`}],rows2:R.map((p,i)=>({lb:LB[i],t:[{x:`${p[0]} cm`},{b:1},{x:`${p[1]} cm`}]})),a:R.map(p=>sgn(...p)),R,
  q:T('Điền dấu <b>&gt;</b>, <b>&lt;</b>, <b>=</b>.','Write <b>&gt;</b>, <b>&lt;</b> or <b>=</b>.'),say:T('Em so sánh hai độ dài rồi điền dấu.','Compare the two lengths and write the sign.'),need:needC,sol:'',vchk(){return this.R.every((p,i)=>sgn(...p)===this.a[i])}})}
/* ===== Cộng, trừ không nhớ trong phạm vi 100 ===== */
function cap(kind){for(;;){let a,b;if(kind==='2+1'){a=RR(10,98);b=RR(1,9)}else if(kind==='2+2'){a=RR(10,89);b=RR(10,89)}else if(kind==='2-1'){a=RR(11,99);b=RR(1,9)}else if(kind==='2-2'){a=RR(20,99);b=RR(10,a-10)}else{a=RR(1,9)*10;b=RR(1,9)*10;if(Math.random()<.5){if(a<b){const t=a;a=b;b=t}return{a,b,op:'-',r:a-b}}if(a+b>=100)continue;return{a,b,op:'+',r:a+b}}
  const op=kind[1],r=ev(a,op,b);if(op==='+'){if(r>99||(a%10)+(b%10)>9)continue}else{if(r<10||(a%10)<(b%10))continue}return{a,b,op,r}}}
const lab=e=>`${e.a} ${e.op==='+'?'+':M} ${e.b}`;
function tinh100(kinds){const P=kinds.map(cap);return mkQ({lay:'vof',kind:'Vở: tính trong phạm vi 100',rows2:P.map(e=>({t:[{x:lab(e)+' ='},{b:1}]})),a:P.map(e=>e.r),P,
  q:T('<b>Tính.</b>','<b>Work out.</b>'),say:T('Em tính rồi viết kết quả vào ô.','Work out each one and write the answer.'),need,sol:P.map(e=>`${lab(e)} = ${e.r}`).join(' · '),vchk(){return this.P.every((e,i)=>ev(e.a,e.op,e.b)===this.a[i])}})}
function datTinh1(kinds){const P=kinds.map(cap).map(e=>e.r<10?cap(kinds[0]):e);const a=[];P.forEach(e=>{a.push(Math.floor(e.r/10),e.r%10)});
 return mkQ({lay:'vof',kind:'Vở: đặt tính rồi tính',rows2:[{t:P.map(e=>({vc:[e.a,e.op==='+'?'+':M,e.b]}))}],a,P,
  q:T('<b>Đặt tính</b> rồi tính (viết từng chữ số, từ phải sang trái).','<b>Work out</b> in columns (one digit in each box, right to left).'),say:T('Em tính từ hàng đơn vị, rồi đến hàng chục. Mỗi ô viết một chữ số.','Start with the ones, then the tens. One digit in each box.'),need,sol:P.map(e=>`${lab(e)} = ${e.r}`).join(' · '),
  vchk(){return this.P.every((e,i)=>e.r>=10&&e.r<=99&&this.a[2*i]*10+this.a[2*i+1]===ev(e.a,e.op,e.b))}})}
function noi100(kind){const P=[];const used=new Set();for(let t=0;P.length<3&&t<200;t++){const e=cap(kind);if(!used.has(e.r)){used.add(e.r);P.push(e)}}
 return noiQ('Vở: nối phép tính với kết quả',P.map(e=>[{e:lab(e)}]),P.map(e=>[{n:e.r}]),P.map(e=>e.r),T('<b>Nối</b> mỗi phép tính với kết quả đúng.','<b>Match</b> each number sentence to its answer.'),HINTN('Em tính rồi nối mỗi phép tính với kết quả đúng.','Work them out, then match each one to its answer.'),q=>q.right.every((r,k)=>r[0].n===q.vals[q.R[k]]))}
function thieu100(kinds){const rows=[],a=[],E=[];kinds.forEach((kd,i)=>{const e=cap(kd),o=e.op==='+'?'+':M,w=i%3;let t;
  if(w===0){t=[{x:`${e.a} ${o}`},{b:1},{x:`= ${e.r}`}];a.push(e.b)}else if(w===1){t=[{b:1},{x:`${o} ${e.b} = ${e.r}`}];a.push(e.a)}else{t=[{x:`${lab(e)} =`},{b:1}];a.push(e.r)}rows.push({lb:LB[i],t});E.push({e,w})});
 const have=new Set(a),ex=[];while(ex.length<2){const v=RR(10,99);if(!have.has(v)&&!ex.includes(v))ex.push(v)}
 return mkQ({lay:'vok',kind:'Vở: số còn thiếu đến 100',rows2:rows,a,E,cards:shuf(a.concat(ex)),q:T('<b>Số?</b> Kéo thẻ số vào ô trống.','<b>Missing number?</b> Drag a card into each box.'),say:T('Em tìm số còn thiếu rồi kéo thẻ số vào ô trống.','Find the missing number and drag the card into the box.'),need:needK,sol:E.map(x=>`${lab(x.e)} = ${x.e.r}`).join(' · '),
  vchk(){return this.E.every((x,i)=>this.a[i]===(x.w===0?x.e.b:x.w===1?x.e.a:x.e.r))&&this.a.every(v=>this.cards.includes(v))}})}
function dauPT100(kinds){const ps=kinds.map((kd,i)=>{const e=cap(kd),w=i%3;const z=w===2?e.r:w===0?Math.max(0,e.r-RR(1,9)):Math.min(100,e.r+RR(1,9));return{e,z}});const [m,...R]=ps;
 return mkQ({lay:'voc',kind:'Vở: điền dấu trong phạm vi 100',opts:SIGN,mau:[{x:lab(m.e)},{mc:sgn(m.e.r,m.z)},{m:m.z}],rows2:R.map((p,i)=>({lb:LB[i],t:[{x:lab(p.e)},{b:1},{n:p.z}]})),a:R.map(p=>sgn(p.e.r,p.z)),R,
  q:T('Điền dấu <b>&gt;</b>, <b>&lt;</b>, <b>=</b> vào ô trống.','Write <b>&gt;</b>, <b>&lt;</b> or <b>=</b>.'),say:T('Em tính phép tính trước, rồi điền dấu.','Work out the number sentence first, then write the sign.'),need:needC,sol:'',vchk(){return this.R.every((p,i)=>sgn(ev(p.e.a,p.e.op,p.e.b),p.z)===this.a[i])}})}
/* ===== Giờ và lịch ===== */
function xemGio(){const H=distinct(4,1,12);return mkQ({lay:'vof',kind:'Vở: xem giờ đúng',c2:1,rows2:H.map((h,i)=>({t:[{clock:h,z:44},{b:1},{w:T('giờ','o’clock')}]})),a:H,
  q:T('Đồng hồ chỉ <b>mấy giờ</b>?','What <b>time</b> does each clock show?'),say:T('Kim ngắn chỉ giờ. Kim dài chỉ số mười hai là giờ đúng. Em viết số giờ.','The short hand shows the hour. When the long hand points to twelve, it is exactly that hour.'),need,sol:H.map(h=>h+' giờ').join(' · '),vchk(){return this.rows2.every((r,i)=>r.t[0].clock===this.a[i])}})}
function noiGio(){const H=distinct(3,1,12);return noiQ('Vở: nối đồng hồ với giờ',H.map(h=>[{clock:h,z:46}]),H.map(h=>[{e:T(`${h} giờ`,`${h} o’clock`)}]),H,T('<b>Nối</b> đồng hồ với giờ đúng.','<b>Match</b> each clock to its time.'),HINTN('Em nối mỗi đồng hồ với giờ đúng.','Match each clock to the right time.'),q=>q.left.every((l,i)=>q.vals[i]===l[0].clock))}
function sauGio(){const rows=[],a=[],P=[];for(let i=0;i<3;i++){const h=RR(1,9),d=RR(1,3);P.push([h,d]);rows.push({lb:LB[i],t:[{clock:h,z:44},{w:T(`${h} giờ, thêm ${d} giờ nữa là`,`${h} o’clock, ${d} hours later it is`)},{b:1},{w:T('giờ','o’clock')}]});a.push(h+d)}
 return mkQ({lay:'vof',kind:'Vở: mấy giờ sau',rows2:rows,a,P,q:T('<b>Viết</b> số giờ.','<b>Write</b> the time.'),say:T('Em đếm thêm số giờ trên mặt đồng hồ.','Count on the hours around the clock.'),need,sol:a.join(' · '),vchk(){return this.P.every((p,i)=>p[0]+p[1]===this.a[i]&&this.a[i]<=12)}})}
function ngayTuan(){const D=DAYS(),rows=[],a=[],P=[];['mai','qua','mai2'].forEach((k,i)=>{const d=RR(0,6),ans=k==='qua'?(d+6)%7:k==='mai'?(d+1)%7:(d+2)%7;P.push([d,k,ans]);
  rows.push({lb:LB[i],t:[{w:T(`Hôm nay là ${D[d]}. ${k==='qua'?'Hôm qua':k==='mai'?'Ngày mai':'Ngày kia'} là`,`Today is ${D[d]}. ${k==='qua'?'Yesterday':k==='mai'?'Tomorrow':'The day after tomorrow'} is`)},{b:1}]});a.push(ans)});
 return mkQ({lay:'voc',kind:'Vở: các ngày trong tuần',wide:1,opts:D,rows2:rows,a,P,q:T('Chọn <b>ngày</b> đúng.','Choose the right <b>day</b>.'),say:T('Em nhớ thứ tự các ngày trong tuần: thứ hai, thứ ba, thứ tư, thứ năm, thứ sáu, thứ bảy, chủ nhật.','Remember the days in order, Monday to Sunday.'),need:needC,sol:'',
  vchk(){return this.P.every((p,i)=>p[2]===this.a[i])}})}
function dayNgay(){const D=DAYS(),s=RR(0,6),pos=shuf([1,2,3,4,5,6]).slice(0,3).sort((x,y)=>x-y),a=[];
 const t=Array.from({length:7},(_,j)=>{const d=(s+j)%7;return pos.includes(j)?(a.push(d),{b:1}):{w:D[d]}});
 return mkQ({lay:'voc',kind:'Vở: thứ tự các ngày',wide:1,opts:D,rows2:[{t:t.slice(0,4)},{t:t.slice(4)}],a,s,pos,q:T('Viết tiếp các <b>ngày trong tuần</b>.','Fill in the missing <b>days</b>.'),say:T('Em chọn ngày còn thiếu theo đúng thứ tự.','Choose the missing days in order.'),need:needC,sol:'',
  vchk(){return this.pos.every((p,i)=>(this.s+p)%7===this.a[i])}})}
function ngayThang(){const rows=[],a=[],P=[];for(let i=0;i<3;i++){const d=RR(2,27),k=i%2;P.push([d,k]);rows.push({lb:LB[i],t:[{w:T(`Hôm nay là ngày ${d}. ${k?'Hôm qua':'Ngày mai'} là ngày`,`Today is the ${d}th. ${k?'Yesterday':'Tomorrow'} is the`)},{b:1}]});a.push(k?d-1:d+1)}
 rows.push({lb:LB[3],t:[{w:T('Một tuần lễ có','A week has')},{b:1},{w:T('ngày','days')}]});a.push(7);
 return mkQ({lay:'vof',kind:'Vở: ngày và tuần',rows2:rows,a,P,q:T('<b>Viết số</b> thích hợp.','<b>Write</b> the right number.'),say:T('Em đọc kỹ rồi viết số ngày.','Read carefully and write the date.'),need,sol:a.join(' · '),vchk(){return this.P.every((p,i)=>this.a[i]===(p[1]?p[0]-1:p[0]+1))&&this.a[3]===7}})}
function toLich(chon){const C=[0,1,2].map(()=>[RR(1,30),RR(0,6),RR(1,12)]);
 return chon?mkQ({lay:'voc',kind:'Vở: tờ lịch – thứ',wide:1,opts:DAYS(),rows2:C.map((c,i)=>({lb:LB[i],t:[{cal:c},{b:1}]})),a:C.map(c=>c[1]),C,q:T('Mỗi tờ lịch là <b>thứ mấy</b>?','What <b>day</b> is each calendar page?'),say:T('Em đọc dòng chữ dưới cùng của tờ lịch.','Read the word at the bottom of the page.'),need:needC,sol:'',vchk(){return this.C.every((c,i)=>c[1]===this.a[i])}})
  :mkQ({lay:'vof',kind:'Vở: tờ lịch – ngày',rows2:C.map((c,i)=>({lb:LB[i],t:[{cal:c},{w:T('Ngày','Date')},{b:1}]})),a:C.map(c=>c[0]),C,q:T('Mỗi tờ lịch là <b>ngày mấy</b>?','What <b>date</b> is each calendar page?'),say:T('Em đọc số to ở giữa tờ lịch.','Read the big number in the middle.'),need,sol:'',vchk(){return this.C.every((c,i)=>c[0]===this.a[i])}})}

/* ---------- trang theo bài ---------- */
let _p=null;const P=(b,i)=>_p({b})[i];
const PAGES={7:()=>[tenHinh(),demHinh(),noiHinh()],8:()=>[qlHinh(),demHinh(),tenHinh()],9:()=>[noiHinh(),qlHinh(),demHinh()],
 14:()=>[tenKhoi(),demKhoi(),qlKhoi()],15:()=>[traiPhai(),trenDuoi(),thuTu()],16:()=>[tenKhoi(),traiPhai(),thuTu()],
 17:()=>[P(4,0),P(2,0),P(1,2)],18:()=>[P(13,0),P(10,0),P(11,2)],19:()=>[tenHinh(),demKhoi(),qlHinh()],20:()=>[P(12,0),P(12,1),P(6,1)],
 21:()=>[chucDV(),noiDoc(11,99),vietSo()],22:()=>[dau100(),xep100(),vietSo()],23:()=>[dayChuc(),noiDoc(20,99),chucDV()],24:()=>[dau100(),dayChuc(),noiDoc(11,99)],
 25:()=>[daiNgan(),demO(),caoThap()],26:()=>[thuoc(0),cmTinh(),cmDau()],27:()=>[thuoc(1),daiNgan(),cmTinh()],28:()=>[thuoc(1),cmDau(),caoThap()],
 29:()=>[tinh100(['2+1','2+1','2+1','2+1','2+1','2+1']),datTinh1(['2+1','2+1','2+1']),noi100('2+1')],
 30:()=>[tinh100(['2+2','2+2','2+2','2+2','tron','tron']),datTinh1(['2+2','2+2','2+2']),noi100('2+2')],
 31:()=>[tinh100(['2-1','2-1','2-1','2-1','2-1','2-1']),datTinh1(['2-1','2-1','2-1']),thieu100(['2-1','2-1','2-1','2-1'])],
 32:()=>[tinh100(['2-2','2-2','2-2','2-2','tron','tron']),datTinh1(['2-2','2-2','2-2']),dauPT100(['2-2','2-2','2-2','2-2','2-2'])],
 33:()=>[tinh100(['2+1','2-1','2+2','2-2','tron','tron']),datTinh1(['2+2','2-2','2+1']),thieu100(['2+2','2-2','2+1','2-1'])],
 34:()=>[xemGio(),noiGio(),sauGio()],35:()=>[ngayTuan(),dayNgay(),ngayThang()],36:()=>[toLich(0),toLich(1),xemGio()],37:()=>[noiGio(),ngayTuan(),toLich(0)],
 38:()=>[P(13,0),P(12,0),P(3,0)],39:()=>[dau100(),tinh100(['2+2','2-2','2+1','2-1','tron','tron']),thieu100(['2+2','2-2','2+1','2-1'])],40:()=>[tenHinh(),thuoc(1),xemGio()],41:()=>[dauPT100(['2+2','2-1','2+1','2-2','2+2']),datTinh1(['2+2','2-2','2+1']),ngayTuan()]};
{_p=window.voPage;window.voPage=function(x){if(curG()===1&&PAGES[x.b])return PAGES[x.b]();return _p(x)}}
/* dùng lại cho lớp 2 (90-…) */
Object.assign(V,{readN,shSvg,khSvg,clockSvg,calSvg,rulerSvg,barH,colsV,DAYS,SHK,shName,KHN,COL,svg,noiQ,quyLuat,nm,NAME});
Object.assign(I18N,{'Vở: tên hình':'Book: shape names','Vở: đếm hình':'Book: count shapes','Vở: nối hình với tên':'Book: match shapes','Vở: quy luật hình':'Book: shape patterns','Vở: quy luật khối':'Book: solid patterns','Vở: tên khối':'Book: solids','Vở: đếm khối':'Book: count solids','Vở: bên trái, bên phải':'Book: left and right','Vở: trên, dưới':'Book: above and below','Vở: thứ tự từ trái sang phải':'Book: positions','Vở: chục và đơn vị':'Book: tens and ones','Vở: nối số với cách đọc':'Book: number names','Vở: viết số':'Book: write numbers','Vở: dãy số đến 100':'Book: number lines','Vở: so sánh số có hai chữ số':'Book: compare 2-digit','Vở: xếp thứ tự số đến 100':'Book: order to 100','Vở: dài hơn, ngắn hơn':'Book: longer, shorter','Vở: băng giấy dài mấy ô':'Book: count squares','Vở: cao hơn, thấp hơn':'Book: taller, shorter','Vở: đọc số đo':'Book: read the ruler','Vở: đo bằng thước (không từ 0)':'Book: measure','Vở: tính với đơn vị cm':'Book: cm sums','Vở: so sánh độ dài':'Book: compare lengths','Vở: tính trong phạm vi 100':'Book: work out to 100','Vở: đặt tính rồi tính':'Book: column method','Vở: số còn thiếu đến 100':'Book: missing numbers','Vở: điền dấu trong phạm vi 100':'Book: compare to 100','Vở: xem giờ đúng':'Book: tell the time','Vở: nối đồng hồ với giờ':'Book: match clocks','Vở: mấy giờ sau':'Book: hours later','Vở: các ngày trong tuần':'Book: days of the week','Vở: thứ tự các ngày':'Book: day order','Vở: ngày và tuần':'Book: dates','Vở: tờ lịch – thứ':'Book: calendar day','Vở: tờ lịch – ngày':'Book: calendar date'});
document.head.insertAdjacentHTML('beforeend',`<style>
.vosh{display:inline-flex;line-height:0;flex:none}
.voshs{display:flex!important;flex-wrap:wrap;gap:3px;padding:4px;max-width:250px;justify-content:center}
.vorowp,.vostk{display:flex!important;gap:6px;padding:4px 6px;align-items:flex-end}.vostk{flex-direction:column;align-items:center;gap:3px}
.vovc{display:inline-grid;grid-template-columns:repeat(3,26px);grid-auto-rows:28px;align-items:center;justify-items:center;margin:0 6px;background:#fff;padding:2px 4px}
.vovc i{font-style:normal;font-family:var(--f-display);font-size:24px;line-height:1;color:#1F2A5A}.vovc i.op{font-size:22px}
.vovc b{grid-column:1/-1;height:3px;width:100%;background:#1F2A5A;align-self:center}.vovc .votc.vb1{width:26px;height:28px}
.voopt.w button{font-size:14px}
</style>`);
})();
