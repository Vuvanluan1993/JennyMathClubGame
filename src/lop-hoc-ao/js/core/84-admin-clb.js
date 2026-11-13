/* 84 — Trang Admin Clb: danh sách trường + chi tiết từng trường (thầy yêu cầu 12/11/2026)
   1) Mỗi em tự gửi bản TÓM TẮT nhỏ lên tom/{tk} (≈ 0,5 KB): lần học cuối, số câu/câu đúng 30 ngày gần nhất (từng ngày),
      sao, Sức mạnh Toán từng mạch, số bài cô giao quá hạn, số dạng trong Sổ lỗi sai. Ghi tối đa 5 phút/lần + khi rời trang/đăng xuất.
      Admin chỉ đọc các bản tóm tắt (nhẹ, rẻ) thay vì toàn bộ dữ liệu học của mọi em.
   2) Admin Clb (vai qt) mở trang Quản lý → trang "Tất cả các trường". Bấm một trường → chi tiết: Tổng quan · Lớp · Giáo viên ·
      Học sinh · Tài khoản. "Vào trường" để quản lý như quản lý trường; nút "Các trường" ở thanh trên để quay lại.
   Cách tính dùng đúng luật đã chốt: "chưa học" = 3 ngày trở lên không làm câu nào; mức Sức mạnh Toán (Mới bắt đầu < 40 · Đang tập
   40–59 · Khá 60–74 · Tốt 75–84 · Vững ≥ 85), mỗi mạch cần ≥ 10 câu. */
const TOM_NGAY=30;
function tomTat(st){const today=hsToday(),dd=st.dd||{},dn=[],dc=[];let cuoi=null;
  for(let i=0;i<TOM_NGAY;i++){const o=dd[hsKey(new Date(today.getTime()-i*864e5))];dn.push(o?o.n||0:0);dc.push(o?o.c||0:0)}
  Object.keys(dd).forEach(k=>{if(dd[k]&&dd[k].n>0&&(!cuoi||k>cuoi))cuoi=k});
  let sao=0,sm={},qh=0;try{sao=totalStars(st)}catch(e){}
  try{const sc=hsScores(st);HS_AX.forEach(a=>{if(sc[a.k]&&sc[a.k].ok)sm[a.k]=Math.round(sc[a.k].s)})}catch(e){}
  try{qh=asgMine(st).filter(a=>asgState(st,a).late).length}catch(e){}
  return{ngay:hsKey(today),k:st.grade||0,cuoi,dn,dc,sao,sm,qh,loi:Object.keys(st.mist||{}).length}}
/* ---------- học sinh: gửi bản tóm tắt ---------- */
(function(){let tomCuoi='',tomLuc=0;
 async function ghiTom(ngay){try{if(typeof CLOUD==='undefined'||!CLOUD||!CLOUD.me||CLOUD.me.role!=='hs'||!FB||!FB.db)return;const tk=CLOUD.me.tk,st=S.st[tk];if(!st)return;
   const t=tomTat(st);t.lop=S.lopHS||'';const j=JSON.stringify(t);if(j===tomCuoi)return;if(!ngay&&Date.now()-tomLuc<300000)return;
   tomLuc=Date.now();tomCuoi=j;await FB.db.doc('tom/'+tk).set(Object.assign({t:firebase.firestore.FieldValue.serverTimestamp()},t))}catch(e){tomCuoi='';console.error('tom',e)}}
 window.ghiTom=ghiTom;
 {const _d=fbDay;fbDay=async function(){const r=await _d.apply(this,arguments);ghiTom(false);return r}}
 {const _n=fbDayNgay;fbDayNgay=function(){const p=_n.apply(this,arguments);ghiTom(true);return p}}
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')ghiTom(true)});
})();

(function(){
if(typeof ORG_ON==='undefined'||!ORG_ON)return;
const e=s=>esc(String(s==null?'':s));
const QA=window.QA={che:(()=>{try{return localStorage.getItem('jennyQT_che')||'ds'}catch(x){return'ds'}})(),ma:'',tab:'tq',tim:'',lop:'',trang:0,tai:false,luc:0,tom:[],truong:{}};
const laQT=()=>typeof CLOUD!=='undefined'&&CLOUD&&CLOUD.qt&&window.TRANG==='ql';
const dangAdmin=()=>laQT()&&QA.che!=='vao';
const datChe=c=>{QA.che=c;try{localStorage.setItem('jennyQT_che',c)}catch(x){}};
const raw=()=>FB.raw,QT=()=>window.QT_||{ds:[],us:[]};
/* ---------- tải số liệu ---------- */
async function qaTai(){if(QA.tai)return;QA.tai=true;render();
  try{const [t,m,u]=await Promise.all([raw().collection('truong').get(),raw().collection('tom').get(),raw().collection('users').get()]);
    const Q=QT();Q.us=u.docs.map(d=>Object.assign({uid:d.id},d.data()));Q.ds=t.docs.map(d=>Object.assign({ma:d.id},d.data()));
    try{const c=await raw().doc('org/main').get();Q.cu=c.exists&&!(c.data()||{}).daChuyen}catch(x){Q.cu=false}
    QA.truong={};t.docs.forEach(d=>{const x=d.data()||{};QA.truong[d.id]=Object.assign({ma:d.id},x,{o:fbJ(x.j)||{}})});
    QA.tom=m.docs.map(d=>Object.assign({tk:d.id},d.data()));QA.luc=Date.now()}catch(x){console.error(x);toast('Chưa tải được số liệu: '+fbLoi(x))}
  QA.tai=false;render()}
window.qaSauNap=()=>{if(dangAdmin()){QA.luc=0;qaTai()}};
window.qaTaiLai=()=>{QA.luc=0;qaTai()};
/* ---------- tính toán ---------- */
const homNay=()=>hsKey(hsToday());
const cach=(a,b)=>Math.round((new Date(a+'T00:00:00')-new Date(b+'T00:00:00'))/864e5);
function soNgay(t,W){const g=Math.max(0,cach(homNay(),t.ngay||homNay()));let n=0,c=0;(t.dn||[]).forEach((v,i)=>{if(i+g<W){n+=v||0;c+=(t.dc||[])[i]||0}});return{n,c}}
function nghi(t){return!t||!t.cuoi||cach(homNay(),t.cuoi)>=3}
function hoc(t,W){return!!t&&soNgay(t,W).n>0}
function mucTB(ds){const o={};HS_AX.forEach(a=>{const v=ds.map(t=>t&&t.sm&&t.sm[a.k]).filter(x=>x!=null);if(v.length)o[a.k]={s:Math.round(v.reduce((x,y)=>x+y,0)/v.length),n:v.length}});return o}
function mucChung(t){const v=Object.values((t&&t.sm)||{});return v.length?Math.round(v.reduce((x,y)=>x+y,0)/v.length):null}
const pt=(a,b)=>b?Math.round(a/b*100):null;
const ngayCuoi=k=>{if(!k)return'chưa học';const g=cach(homNay(),k);return g<=0?'hôm nay':g===1?'hôm qua':g+' ngày trước'};
/* gom số liệu một nhóm học sinh (danh sách tk) */
function gom(tks,tomMap){const ds=tks.map(tk=>tomMap[tk]),co=ds.filter(Boolean);let n30=0,c30=0,sao=0,qh=0;
  co.forEach(t=>{const x=soNgay(t,30);n30+=x.n;c30+=x.c;sao+=t.sao||0;if(t.qh)qh++});
  let cuoi=null;co.forEach(t=>{if(t.cuoi&&(!cuoi||t.cuoi>cuoi))cuoi=t.cuoi});
  const ngay14=[];for(let i=13;i>=0;i--){const k=hsKey(new Date(hsToday().getTime()-i*864e5));ngay14.push({k,n:co.filter(t=>{const g=cach(homNay(),t.ngay||homNay()),j=i-g;return j>=0&&(t.dn||[])[j]>0}).length})}
  const m=mucTB(co),mv=Object.values(m);
  return{hs:tks.length,coSo:co.length,homNay:co.filter(t=>hoc(t,1)).length,tuan:co.filter(t=>hoc(t,7)).length,nghi:tks.filter(tk=>nghi(tomMap[tk])).length,
    n30,c30,dung:pt(c30,n30),sao:co.length?Math.round(sao/co.length):null,qh,cuoi,ngay14,muc:m,mucTB:mv.length?Math.round(mv.reduce((a,b)=>a+b.s,0)/mv.length):null}}
function duLieuTruong(ma){const T=QA.truong[ma]||{ma,o:{}},o=T.o||{},tomMap={};QA.tom.filter(t=>(t.truong||'jenny')===ma).forEach(t=>tomMap[t.tk]=t);
  const hs=(o.hs||[]).map(r=>r[0]),lop=o.lop||[],gv=o.gv||[],gd=o.gd||{},ph=new Set(Object.values(o.ph||{}));
  return{T,o,tomMap,hs,lop,gv,gd,ph,tong:gom(hs,tomMap)}}
/* ---------- giao diện nhỏ ---------- */
const kpi=(a,b,c,cls)=>`<div class="kpi qakpi ${cls||''}"><span class="muted">${a}</span><span class="big">${b}</span>${c?`<span class="muted qasub">${c}</span>`:''}</div>`;
const nhanMuc=s=>s==null?'<span class="muted">chưa đủ số liệu</span>':`<span class="pill qamuc qam${s>=85?5:s>=75?4:s>=60?3:s>=40?2:1}">${hsMuc(s)}</span>`;
const ph100=(a,b)=>b?`${a}/${b} <span class="muted">(${pt(a,b)}%)</span>`:'—';
function cot14(L){const mx=Math.max(1,...L.map(x=>x.n));return`<div class="qacot" role="img" aria-label="Số em học mỗi ngày trong 14 ngày">${L.map(x=>{const d=new Date(x.k+'T00:00:00');return`<div class="qac"><b>${x.n||''}</b><i style="height:${Math.round(x.n/mx*100)}%"></i><span>${d.getDate()}/${d.getMonth()+1}</span></div>`}).join('')}</div>`}
function bangMach(m){return`<div class="qamach">${HS_AX.map(a=>{const x=m[a.k];return`<div class="qamr"><span>${a.f}</span>${x?`${gvBar(x.s)}${nhanMuc(x.s)}<small class="muted">${x.n} em</small>`:'<span class="muted">chưa đủ số liệu</span>'}</div>`}).join('')}</div>`}
/* ---------- trang danh sách trường ---------- */
function trangDS(){const Q=QT(),ds=Object.values(QA.truong).sort((a,b)=>a.ma==='jenny'?-1:b.ma==='jenny'?1:a.ma.localeCompare(b.ma));
  const R=ds.map(T=>({T,d:duLieuTruong(T.ma)})),hsAll=R.reduce((a,r)=>a+r.d.hs.length,0),tuan=R.reduce((a,r)=>a+r.d.tong.tuan,0),hn=R.reduce((a,r)=>a+r.d.tong.homNay,0);
  const q=QA.tim.trim().toLowerCase(),tim=q?(Q.us||[]).filter(u=>(u.tk||'').includes(q)||String(u.ten||'').toLowerCase().includes(q)).slice(0,30):[];
  const vai={qt:'Admin Clb',ql:'Quản lý trường',gv:'Giáo viên',hs:'Học sinh',ph:'Phụ huynh'};
  return`<div class="grid qa">
   <div class="qahead"><div><h1>Tất cả các trường</h1><div class="muted">Admin Clb · ${QA.luc?'số liệu lúc '+new Date(QA.luc).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}):'đang tải…'}</div></div>
    <span class="qanut"><button type="button" class="btn sm" onclick="qaTaiLai()">↻ Tải lại</button> <button type="button" class="btn sm pri" onclick="qtFormTruong()">+ Thêm trường</button></span></div>
   <div id="qaBao"></div>
   ${Q.cu?`<div class="task qavang"><b>Có dữ liệu cũ (trước khi chia trường).</b> Bấm để chuyển thành trường <b>jenny</b>. <button type="button" class="btn sm pri" onclick="qtChuyenCu()">Chuyển dữ liệu cũ</button></div>`:''}
   <div class="qakpis">${kpi('Trường',ds.length,`${ds.filter(t=>!t.khoa).length} đang dùng${ds.some(t=>t.khoa)?' · '+ds.filter(t=>t.khoa).length+' khoá':''}`)}${kpi('Lớp',R.reduce((a,r)=>a+r.d.lop.length,0))}${kpi('Giáo viên',R.reduce((a,r)=>a+r.d.gv.length,0))}${kpi('Học sinh',hsAll)}${kpi('Học trong 7 ngày',tuan,hsAll?pt(tuan,hsAll)+'% học sinh':'')}${kpi('Học hôm nay',hn)}</div>
   <section class="card"><h2>Các trường</h2><p class="muted qanho">Bấm vào một trường để xem chi tiết.</p>
    <div class="tablewrap"><table class="qatb qads"><tr><th>Trường</th><th>Lớp</th><th>GV</th><th>HS</th><th>Học 7 ngày</th><th>≥ 3 ngày chưa học</th><th>Đúng (30 ngày)</th><th>Sức mạnh Toán</th><th>Học gần nhất</th><th>Trạng thái</th></tr>
    ${R.map(({T,d})=>`<tr class="qarow" tabindex="0" onclick="qaXem('${T.ma}')" onkeydown="if(event.key==='Enter')qaXem('${T.ma}')"><td><b>${e(T.ten||T.ma)}</b><br><code class="muted">${e(T.ma)}</code></td><td data-n="Lớp">${d.lop.length}</td><td data-n="GV">${d.gv.length}</td><td data-n="HS">${d.hs.length}</td>
      <td data-n="Học 7 ngày">${d.hs.length?ph100(d.tong.tuan,d.hs.length):'—'}</td><td data-n="≥3 ngày chưa học" class="${d.tong.nghi&&d.tong.nghi/d.hs.length>.3?'qado':''}">${d.hs.length?d.tong.nghi:'—'}</td>
      <td data-n="Đúng">${d.tong.dung==null?'—':d.tong.dung+'%'}</td><td data-n="Sức mạnh">${d.tong.mucTB==null?'<span class="muted">—</span>':nhanMuc(d.tong.mucTB)}</td><td data-n="Học gần nhất">${ngayCuoi(d.tong.cuoi)}</td>
      <td>${T.khoa?'<span class="pill qlwarn">🔒 Khoá</span>':'<span class="pill">Đang dùng</span>'}</td></tr>`).join('')||'<tr><td colspan="10" class="muted">Chưa có trường nào.</td></tr>'}</table></div></section>
   <section class="card"><h2>Tìm tài khoản ở mọi trường</h2><input id="qaTim" type="search" value="${e(QA.tim)}" placeholder="Tên đăng nhập hoặc họ tên, vd. nguyendu.an" oninput="qaTim(this.value)" class="qainp">
    ${q?`<div class="tablewrap"><table class="qatb"><tr><th>Tên đăng nhập</th><th>Họ tên</th><th>Vai trò</th><th>Trường</th><th></th></tr>${tim.map(u=>`<tr><td><code>${e(u.tk)}</code></td><td>${e(u.ten)}</td><td>${vai[u.role]||u.role}</td><td>${e((QA.truong[u.truong||'jenny']||{}).ten||u.truong||'jenny')}</td><td><button type="button" class="btn sm" onclick="qaXem('${e(u.truong||'jenny')}')">Xem trường</button></td></tr>`).join('')||'<tr><td colspan="5" class="muted">Không thấy tài khoản nào.</td></tr>'}</table></div>`:''}</section>
   <p class="muted qanho">Số liệu học tập lấy từ bản tóm tắt mỗi em gửi khi học (tối đa 5 phút một lần). Em chưa đăng nhập từ khi có tính năng này thì chưa có số liệu — mở trường và bấm "Tính lại số liệu".</p></div>`}
window.qaTim=v=>{QA.tim=v;render();const i=document.getElementById('qaTim');if(i){i.focus();i.setSelectionRange(v.length,v.length)}};
window.qaXem=ma=>{QA.ma=ma;QA.tab='tq';QA.lop='';QA.tim2='';QA.trang=0;datChe('truong');render();window.scrollTo(0,0)};
window.qaVe=()=>{datChe('ds');render();window.scrollTo(0,0)};
window.qaTab=t=>{QA.tab=t;QA.trang=0;QA.lopId='';render()};
/* ---------- trang một trường ---------- */
function trangTruong(){const d=duLieuTruong(QA.ma),T=d.T,o=d.o,t=d.tong;if(!QA.truong[QA.ma])return`<div class="grid qa"><button type="button" class="btn sm" onclick="qaVe()">← Tất cả các trường</button><p class="muted">Không tìm thấy trường ${e(QA.ma)}.</p></div>`;
  const tabs=[['tq','Tổng quan'],['lop','Lớp'],['gv','Giáo viên'],['hs','Học sinh'],['tk','Tài khoản quản lý']];
  const users=(QT().us||[]).filter(u=>(u.truong||'jenny')===QA.ma);
  let body='';
  if(QA.tab==='tq'){const khoi=[...new Set(d.lop.map(l=>l.khoi))].sort();
    body=`<div class="qakpis">${kpi('Lớp',d.lop.length,`${d.lop.filter(l=>l.tj&&l.tj.on).length} lớp có Toán Jenny`)}${kpi('Giáo viên',d.gv.length)}${kpi('Học sinh',d.hs.length,`${d.hs.filter(tk=>!d.gd[tk]).length} em chưa xếp lớp`)}
      ${kpi('Học hôm nay',t.homNay)}${kpi('Học trong 7 ngày',d.hs.length?t.tuan:'—',d.hs.length?pt(t.tuan,d.hs.length)+'% học sinh':'')}${kpi('≥ 3 ngày chưa học',t.nghi,'',t.nghi&&d.hs.length&&t.nghi/d.hs.length>.3?'qado':'')}
      ${kpi('Câu đã làm (30 ngày)',t.n30.toLocaleString('vi-VN'),t.dung==null?'':'đúng '+t.dung+'%')}${kpi('Sao trung bình',t.sao==null?'—':t.sao,'mỗi em')}${kpi('Có bài cô giao quá hạn',t.qh,'em')}</div>
     ${t.coSo<d.hs.length?`<div class="task qavang">${d.hs.length-t.coSo} em chưa có số liệu (chưa đăng nhập từ khi có bản tóm tắt). <button type="button" class="btn sm" onclick="qaTinhLai('${e(QA.ma)}')">Tính lại số liệu</button></div>`:''}
     <div class="grid gpair"><section class="card"><h2>Số em học mỗi ngày</h2><p class="muted qanho">14 ngày gần nhất</p>${cot14(t.ngay14)}</section>
      <section class="card"><h2>Sức mạnh Toán của trường</h2><p class="muted qanho">Trung bình các em đủ số liệu (mỗi mạch ≥ 10 câu)</p>${bangMach(t.muc)}</section></div>
     <section class="card"><h2>Theo khối</h2><div class="tablewrap"><table class="qatb"><tr><th>Khối</th><th>Lớp</th><th>HS</th><th>Học 7 ngày</th><th>≥ 3 ngày chưa học</th><th>Đúng (30 ngày)</th><th>Sức mạnh Toán</th></tr>
      ${khoi.map(k=>{const L=d.lop.filter(l=>l.khoi===k),tks=d.hs.filter(tk=>L.some(l=>l.id===d.gd[tk])),g=gom(tks,d.tomMap);return`<tr><td>Khối ${k}</td><td>${L.length}</td><td>${tks.length}</td><td>${ph100(g.tuan,tks.length)}</td><td>${g.nghi}</td><td>${g.dung==null?'—':g.dung+'%'}</td><td>${nhanMuc(g.mucTB)}</td></tr>`}).join('')||'<tr><td colspan="7" class="muted">Chưa có lớp.</td></tr>'}</table></div></section>`}
  else if(QA.tab==='lop'&&QA.lopId&&d.lop.some(l=>l.id===QA.lopId))body=trangLopCT(d);
  else if(QA.tab==='lop'){const LS=[...d.lop].sort((a,b)=>a.khoi-b.khoi||String(a.ten).localeCompare(b.ten));
    const rows=LS.map(l=>{const n=d.hs.filter(tk=>d.gd[tk]===l.id).length;return`<div class="qlr qlp"><div class="a-ten"><b>Lớp ${e(l.ten)}</b><div class="muted">Khối ${l.khoi} · ${n} em</div></div><div class="a-con">${(l.gv||[]).length?l.gv.map(g=>e((d.gv.find(x=>x.id===g)||{ten:g}).ten)).join(', '):'<span class="pill qlwarn">Chưa có giáo viên</span>'}</div><div class="a-tj">${l.tj&&l.tj.on?`<span class="pill ok">Toán Jenny · hạn ${e(l.tj.han||'')}</span>`:'<span class="muted">Chưa có gói</span>'}</div><div class="a-act"><button type="button" class="btn sm" onclick="qaMoLop('${e(l.id)}')">Mở ▸</button></div></div>`}).join('');
    body=`<div class="qahead"><h2>🏫 Lớp <span class="pill">${LS.length} lớp</span></h2></div><div class="row" style="gap:8px"><button type="button" class="btn pri" onclick="qaFormLop('${e(QA.ma)}')">+ Thêm lớp</button></div>
     <section class="card"><div class="qlli"><div class="qlr qlp qlrh"><div class="a-ten">Lớp</div><div class="a-con">Giáo viên</div><div class="a-tj">Toán Jenny</div><div class="a-act"></div></div>${rows||'<p class="muted">Chưa có lớp.</p>'}</div></section>`}
  else if(QA.tab==='gv'){const rows=d.gv.map(g=>{const ls=d.lop.filter(l=>(l.gv||[]).includes(g.id));return`<div class="qlr qgv"><div class="a-ten"><b>${e(g.ten)}</b><div class="muted">${e(g.tk||g.id)}${g.dt?' · '+e(g.dt):''}</div></div><div class="a-con">${ls.length?ls.map(l=>`<button type="button" class="pill lnk" onclick="qaMoLop('${e(l.id)}')">Lớp ${e(l.ten)}</button>`).join(' '):'<span class="pill qlwarn">Chưa có lớp</span>'}</div><div class="a-act"><button type="button" class="btn sm" onclick="qaSua('${e(QA.ma)}','${e(g.tk||g.id)}')">✎ Sửa</button></div></div>`}).join('');
    body=`<div class="qahead"><h2>👩‍🏫 Giáo viên <span class="pill">${d.gv.length} người</span></h2></div><div class="row" style="gap:8px"><button type="button" class="btn pri" onclick="qaFormGV('${e(QA.ma)}')">+ Thêm giáo viên</button></div>
     <p class="muted" style="margin:0">Phân công dạy lớp: vào thẻ Lớp › chọn lớp › Phân công giáo viên.</p>
     <section class="card"><div class="qlli"><div class="qlr qgv qlrh"><div class="a-ten">Giáo viên</div><div class="a-con">Lớp đang dạy</div><div class="a-act"></div></div>${rows||'<p class="muted">Chưa có giáo viên.</p>'}</div></section>`}
  else if(QA.tab==='hs'){const q=(QA.tim2||'').trim().toLowerCase(),bo=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').toLowerCase();
    const rows=(o.hs||[]).filter(([tk,n])=>(!QA.lop||(QA.lop==='__'?!d.gd[tk]:d.gd[tk]===QA.lop))&&(!q||tk.includes(q)||bo(n).includes(bo(q)))).sort((a,b)=>String(a[1]).split(' ').pop().localeCompare(String(b[1]).split(' ').pop(),'vi')),N=30,tr=Math.min(QA.trang,Math.max(0,Math.ceil(rows.length/N)-1)),xem=rows.slice(tr*N,tr*N+N);
    body=`<section class="card"><div class="qahead"><h2>Học sinh</h2><span class="qaloc"><button type="button" class="btn sm pri" onclick="qaFormHS('${e(QA.ma)}')">+ Học sinh</button><button type="button" class="btn sm pri" onclick="qaMoNhap('${e(QA.ma)}')">⬆ Nhập từ Excel</button><button type="button" class="btn sm" onclick="qaTaiDS('${e(QA.ma)}')">⬇ Tải danh sách</button><select aria-label="Lớp" onchange="QA.lop=this.value;QA.trang=0;render()"><option value="">Tất cả lớp</option><option value="__" ${QA.lop==='__'?'selected':''}>Chưa xếp lớp</option>${d.lop.map(l=>`<option value="${e(l.id)}" ${QA.lop===l.id?'selected':''}>Lớp ${e(l.ten)}</option>`).join('')}</select>
      <input id="qaTim2" type="search" placeholder="Tìm tên" value="${e(QA.tim2||'')}" oninput="QA.tim2=this.value;QA.trang=0;render();const i=document.getElementById('qaTim2');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></span></div>
     <div class="tablewrap"><table class="qatb"><tr><th>Họ tên</th><th>Tên đăng nhập</th><th>Lớp</th><th>Sao</th><th>Câu (30 ngày)</th><th>Đúng</th><th>Học gần nhất</th><th>Sức mạnh Toán</th><th>Bài quá hạn</th><th></th></tr>
     ${xem.map(([tk,n])=>{const t=d.tomMap[tk],x=t?soNgay(t,30):null,l=d.lop.find(l=>l.id===d.gd[tk]);return`<tr><td><b>${e(n)}</b></td><td><code>${e(tk)}</code></td><td><select class="qasel" aria-label="Lớp của ${e(n)}" onchange="qaDoiLop('${e(QA.ma)}','${e(tk)}',this.value)"><option value="">— chưa xếp</option>${d.lop.map(x=>`<option value="${e(x.id)}" ${l&&l.id===x.id?'selected':''}>${e(x.ten)}</option>`).join('')}</select></td>${t?`<td>${t.sao||0}</td><td>${x.n}</td><td>${x.n?pt(x.c,x.n)+'%':'—'}</td><td class="${nghi(t)?'qado':''}">${ngayCuoi(t.cuoi)}</td><td>${nhanMuc(mucChung(t))}</td><td>${t.qh||'—'}</td>`:'<td colspan="6" class="muted">chưa có số liệu</td>'}<td class="qatac">${nutTK(tk)}</td></tr>`}).join('')||'<tr><td colspan="10" class="muted">Không có học sinh.</td></tr>'}</table></div>
     ${rows.length>N?`<div class="row qatrang"><button type="button" class="btn sm" ${tr?'':'disabled'} onclick="QA.trang=${tr-1};render()">‹ Trước</button><span class="muted">${tr*N+1}–${Math.min(rows.length,tr*N+N)} / ${rows.length} em</span><button type="button" class="btn sm" ${tr*N+N<rows.length?'':'disabled'} onclick="QA.trang=${tr+1};render()">Sau ›</button></div>`:`<p class="muted qanho">${rows.length} em</p>`}
     <p class="muted qanho">Đổi lớp: chọn ở cột Lớp. Hồ sơ đầy đủ một em (biểu đồ, lỗi sai, giao bài): bấm "Vào trường để quản lý" rồi mở em đó.</p></section>`;}
  else{const trongDS=u=>u.role==='hs'?d.hs.includes(u.tk):(u.role==='gv'||u.role==='ql')?d.gv.some(g=>(g.tk||g.id)===u.tk):true;
    const ql=users.filter(u=>u.role==='ql'||u.role==='qt').sort((a,b)=>(a.role==='qt'?-1:0)-(b.role==='qt'?-1:0)||a.tk.localeCompare(b.tk)),doDang=users.filter(u=>u.role!=='qt'&&!trongDS(u));
    const rows=ql.map(u=>{const g=d.gv.find(x=>(x.tk||x.id)===u.tk)||{};return`<div class="qlr qgv"><div class="a-ten"><b>${e(u.ten||'')}</b><div class="muted">${e(u.tk)}${g.dt?' · '+e(g.dt):''}${g.mail?' · '+e(g.mail):''}</div></div><div class="a-con">${u.role==='qt'?'<span class="pill">Admin Clb</span>':'<span class="pill">Quản lý trường</span>'}</div><div class="a-act">${u.role==='qt'?'<span class="muted">tài khoản của thầy</span>':`<button type="button" class="btn sm" onclick="qaSua('${e(QA.ma)}','${e(u.tk)}')">✎ Sửa</button><button type="button" class="btn sm qlxbtn qlx1" onclick="qaXoa('${e(QA.ma)}','${e(u.tk)}')">🗑 Xoá</button>`}</div></div>`}).join('');
    body=`<div class="qahead"><h2>🔑 Tài khoản quản lý <span class="pill">${ql.filter(u=>u.role==='ql').length} người</span></h2></div>
     <div class="row" style="gap:8px"><button type="button" class="btn pri" onclick="qtFormQL('${e(QA.ma)}')">+ Thêm quản lý</button></div>
     <p class="muted" style="margin:0">Quản lý trường đăng nhập trang Quản lý, chỉ thấy trường mình: lớp, giáo viên, học sinh. Giáo viên và học sinh quản lý ở thẻ Giáo viên, Học sinh.</p>
     <section class="card"><div class="qlli"><div class="qlr qgv qlrh"><div class="a-ten">Quản lý</div><div class="a-con">Vai trò</div><div class="a-act"></div></div>${rows||'<p class="muted">Trường chưa có quản lý.</p>'}</div></section>
     ${doDang.length?`<section class="card"><h2>Tài khoản dở dang (${doDang.length})</h2><p class="muted qanho">Tài khoản tạo dở (ví dụ tạo dữ liệu thử bị dừng giữa chừng), không thuộc lớp hay danh sách giáo viên của trường.</p>
      <div class="qlli">${doDang.map(u=>`<div class="qlr qgv"><div class="a-ten"><b>${e(u.ten||'')}</b><div class="muted">${e(u.tk)} · ${({gv:'Giáo viên',hs:'Học sinh',ql:'Quản lý',ph:'Phụ huynh'})[u.role]||u.role}</div></div><div class="a-con"><span class="pill qlwarn">dở dang</span></div><div class="a-act"><button type="button" class="btn sm qlxbtn qlx1" onclick="qaXoa('${e(QA.ma)}','${e(u.tk)}')">🗑 Xoá</button></div></div>`).join('')}</div></section>`:''}`}
  return`<div class="grid qa"><div><button type="button" class="btn sm" onclick="qaVe()">← Tất cả các trường</button></div>
   <div class="qahead"><div><h1>${e(T.ten||T.ma)}</h1><div class="muted">Mã trường <code>${e(T.ma)}</code> · ${T.khoa?'<span class="pill qlwarn">🔒 Đang khoá</span>':'đang dùng'}${o.nam?' · năm học '+e(o.nam):''}</div></div>
    <span class="qanut"><button type="button" class="btn sm pri" onclick="qaVao('${e(T.ma)}')">Vào trường để quản lý</button> <button type="button" class="btn sm" onclick="qtSua('${e(T.ma)}')">✎ Đổi tên</button>${T.ma==='jenny'?'':` <button type="button" class="btn sm" onclick="qtKhoa('${e(T.ma)}')">${T.khoa?'Mở khoá':'Khoá'}</button>`} <button type="button" class="btn sm" onclick="qtThu('${e(T.ma)}')">🧪 Dữ liệu thử</button></span></div>
   <div id="qaBao">${QA.bao?`<div class="task" style="border-left:4px solid #2E9E4F">${QA.bao} <button type="button" class="btn sm" onclick="QA.bao='';render()">Đã ghi lại ✕</button></div>`:''}</div>
   <div class="qatabs" role="tablist">${tabs.map(([k,n])=>`<button type="button" role="tab" class="${QA.tab===k?'on':''}" aria-selected="${QA.tab===k}" onclick="qaTab('${k}')">${n}</button>`).join('')}</div>
   ${body}</div>`}
window.qaVao=ma=>{datChe('vao');if(ma===CLOUD.truong){try{go({k:'home'})}catch(x){render()}window.scrollTo(0,0);return}qtVao(ma)};
/* tính lại bản tóm tắt từ dữ liệu học của các em (khi em chưa đăng nhập bản mới) */
window.qaTinhLai=async function(ma){if(!confirm('Tính lại số liệu cho các em chưa có bản tóm tắt? (đọc dữ liệu học của từng em)'))return;toast('Đang tính lại…');
  try{const d=duLieuTruong(ma),can=d.hs.filter(tk=>!d.tomMap[tk]);let n=0;
    for(const tk of can){const x=await raw().doc('hs/'+tk).get();if(!x.exists)continue;const st=fbJ(x.data().j);if(!st)continue;try{hsHeal(st,tk)}catch(z){}
      const t=tomTat(st);t.qh=0;t.lop=d.gd[tk]||'';await raw().doc('tom/'+tk).set(Object.assign({truong:ma,t:fbTS()},t));n++}
    toast(`Đã tính lại ${n} em`);QA.luc=0;await qaTai()}catch(x){console.error(x);toast('Chưa tính lại được: '+fbLoi(x))}};
/* ---------- Nhập từ Excel / Tải danh sách cho một trường (giống trang Quản lý trường, 13/11/2026) ---------- */
const voiTruong=(ma,f)=>{if(!window.XL){toast('Chưa tải được phần Excel');return}const o=oCua(ma);o.ma=ma;XL.dung(o);try{return f(o)}finally{XL.dung(null)}};
window.qaTaiDS=ma=>voiTruong(ma,()=>qlTaiDS());
window.qaTaiMau=ma=>voiTruong(ma,()=>qlTaiMau());
let NH={ma:'',ds:[],ten:''};
const buoc1=ma=>`<ol class="qlnstep"><li><button type="button" class="btn sm" onclick="qaTaiMau('${ma}')">⬇ Tải file mẫu (.xlsx)</button><div class="muted">Cột: Họ và đệm · Tên · Giới tính · Ngày sinh · Lớp · ĐT phụ huynh · Gmail phụ huynh · Tên đăng nhập (tuỳ chọn).</div></li>
 <li>Điền danh sách. Cột <b>Lớp</b> ghi tên lớp đã tạo của trường (ví dụ 1A); để trống nếu chưa xếp.</li>
 <li><label class="btn pri qlfile">⬆ Chọn file Excel hoặc CSV<input type="file" accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" onchange="qaDocFile(this.files[0])"></label><div class="muted">Nhập lại file đã sửa: em đã có (cùng họ tên + ngày sinh, hoặc cùng tên đăng nhập) sẽ được <b>cập nhật</b>, không tạo trùng.</div></li></ol>`;
window.qaMoNhap=function(ma){NH={ma,ds:[],ten:''};const el=document.createElement('div');el.className='gdov qtov';el.id='qanhap';
  el.innerHTML=`<div class="gdbox qsbox qlnbox"><div class="gdhd"><b>Nhập danh sách từ Excel · ${e((QA.truong[ma]||{}).ten||ma)}</b><button type="button" class="gdx" onclick="document.getElementById('qanhap').remove()">Đóng ✕</button></div><div class="qlnbd" id="qanbd">${buoc1(ma)}</div></div>`;document.body.appendChild(el)};
window.qaDocFile=async function(f){if(!f)return;const bd=document.getElementById('qanbd'),ma=NH.ma;bd.innerHTML='<p>Đang đọc file…</p>';
  try{const rows=/\.csv$/i.test(f.name)?XL.docCsv(await f.text()):await XL.docXlsx(await f.arrayBuffer());NH.ds=voiTruong(ma,()=>XL.phanTich(rows));NH.ten=f.name;bd.innerHTML=xemTruocNH()}
  catch(x){console.error(x);bd.innerHTML=`<p class="qlnerr">⚠ ${e(x.message||x)}</p>`+buoc1(ma)}};
function xemTruocNH(){const ds=NH.ds,ok=ds.filter(x=>!x.loi.length),loi=ds.length-ok.length,moi=ok.filter(x=>!x.cu).length,cap=ok.length-moi;
  const rows=ds.map(x=>{const d=x.d&&!x.d.loi?[x.d.ng,x.d.th,x.d.nam].filter(Boolean).join('/'):'';return`<tr class="${x.loi.length?'qlnbad':''}"><td>${x.dong}</td><td><b>${e(x.hoten||'—')}</b><div class="muted">${x.gt==='nam'?'Nam':x.gt==='nu'?'Nữ':''}${d?' · '+d:''}</div></td><td>${x.lop?e(x.lop.ten):(x.lopTen?e(x.lopTen):'—')}</td><td>${e(x.dt||'')}${x.mail?'<div class="muted">'+e(x.mail)+'</div>':''}</td><td>${x.loi.length?`<span class="qlnl1">✕ ${e(x.loi.join('; '))}</span>`:(x.cu?`<span class="qlnl2">↻ Cập nhật ${e(x.cu)}</span>`:'<span class="qlnl3">+ Tạo mới</span>')}${x.canh.filter(c=>!/phụ huynh/.test(c)).map(c=>`<div class="qlnl4">⚠ ${e(c)}</div>`).join('')}</td></tr>`}).join('');
  return`<p><b>${e(NH.ten)}</b> · ${ds.length} dòng</p><div class="qlnsum"><span class="qlnl3">+ ${moi} em mới</span><span class="qlnl2">↻ ${cap} em cập nhật</span><span class="${loi?'qlnl1':'muted'}">✕ ${loi} dòng lỗi</span></div>
   ${loi?'<p class="qlnerr">Dòng lỗi (đỏ) sẽ bị bỏ qua. Sửa trong Excel rồi chọn lại file, hoặc nhập các dòng đúng trước.</p>':''}
   <div class="qlntb"><table><tr><th>Dòng</th><th>Học sinh</th><th>Lớp</th><th>Điện thoại PH</th><th>Kết quả</th></tr>${rows}</table></div>
   <div class="qlin" style="margin-top:12px"><button type="button" class="btn pri" ${ok.length?'':'disabled'} onclick="qaChayNhap()">Nhập ${ok.length} em</button><label class="btn qlfile">Chọn file khác<input type="file" accept=".xlsx,.csv" onchange="qaDocFile(this.files[0])"></label></div>
   <p class="muted" style="font-size:12.5px">Mật khẩu ban đầu: <b>${MK0}</b>. Tạo tài khoản trên máy chủ mất vài giây mỗi em.</p>`}
window.qaChayNhap=async function(){const ma=NH.ma,ds=NH.ds.filter(x=>!x.loi.length),bd=document.getElementById('qanbd');if(!ds.length)return;
  const o=(await oMoi(ma));o.hs=o.hs||[];o.hoso=o.hoso||{};o.gd=o.gd||{};const kq={moi:[],cap:[],loi:[]};
  for(const x of ds){bd.innerHTML=`<p>Đang nhập ${kq.moi.length+kq.cap.length+kq.loi.length+1}/${ds.length}: ${e(x.hoten)}…</p>`;
    try{let tk=x.cu;const l=x.lop?(o.lop||[]).find(z=>z.id===x.lop.id):null;
      if(!tk){tk=x.tk||tkTu(ma,x.hoten.split(' ').pop());if(tkCo(tk)||o.hs.some(r=>r[0]===tk)){let i=2,b=tk;while(tkCo(b+i)||o.hs.some(r=>r[0]===b+i))i++;tk=b+i}
        const khoi=l?l.khoi:1,uid=await fbTaoTK(tk,MK0);await raw().doc('users/'+uid).set({role:'hs',tk,ten:x.hoten,khoi,truong:ma});
        const st=newStudent(x.hoten,khoi);st.gender=x.gt;await raw().doc('hs/'+tk).set({j:JSON.stringify(fbTach(st).hs),ev:'[]',lop:l?l.id:'',truong:ma,t:fbTS()});
        o.hs.push([tk,x.hoten,khoi]);(QT().us||[]).push({uid,role:'hs',tk,ten:x.hoten,truong:ma});kq.moi.push(tk)}else kq.cap.push(tk);
      const H=o.hoso[tk]=o.hoso[tk]||{};H.gt=x.gt;if(x.d){if(x.d.ng){H.ng=x.d.ng;H.th=x.d.th}if(x.d.nam)H.nam=x.d.nam}if(x.dt)H.dt=x.dt;if(x.mail)H.mail=x.mail;
      if(l&&o.gd[tk]!==l.id){o.gd[tk]=l.id;const r=o.hs.find(z=>z[0]===tk);if(r)r[2]=l.khoi;try{await raw().doc('hs/'+tk).set({lop:l.id},{merge:true})}catch(z){}}}
    catch(err){console.error(err);kq.loi.push([x,fbLoi(err)])}}
  try{await luuO(ma,o,`Nhập Excel ${NH.ten}: ${kq.moi.length} em mới, ${kq.cap.length} cập nhật`)}catch(x){kq.loi.push([{dong:'-',hoten:'Lưu danh sách trường'},fbLoi(x)])}
  bd.innerHTML=`<p class="qlnok">✓ Xong: <b>${kq.moi.length}</b> em mới · <b>${kq.cap.length}</b> em cập nhật.</p>
   ${kq.loi.length?`<div class="qlnerr">Chưa nhập được ${kq.loi.length}:<ul>${kq.loi.map(([x,m])=>`<li>Dòng ${x.dong} · ${e(x.hoten)}: ${e(m)}</li>`).join('')}</ul></div>`:''}
   ${kq.moi.length?`<div class="qlntb"><table><tr><th>Học sinh mới</th><th>Tên đăng nhập</th><th>Mật khẩu</th></tr>${kq.moi.map(tk=>`<tr><td>${e(((o.hs.find(r=>r[0]===tk))||[])[1]||'')}</td><td><code>${e(tk)}</code></td><td><code>${MK0}</code></td></tr>`).join('')}</table></div>`:''}
   <div class="qlin"><button type="button" class="btn" onclick="qaTaiDS('${ma}')">⬇ Tải danh sách (có tên đăng nhập)</button><button type="button" class="btn pri" onclick="document.getElementById('qanhap').remove()">Đóng</button></div>`;render()};
/* ---------- trang một lớp (giống trang Quản lý trường › Lớp › Mở) ---------- */
window.qaMoLop=lid=>{QA.tab='lop';QA.lopId=lid;QA.themTim='';QA.themChon={};render();window.scrollTo(0,0)};
function trangLopCT(d){const ma=QA.ma,l=d.lop.find(x=>x.id===QA.lopId),o=d.o;
  const ten=tk=>((o.hs||[]).find(r=>r[0]===tk)||[tk,tk])[1],by=(a,b)=>ten(a).split(' ').pop().localeCompare(ten(b).split(' ').pop(),'vi')||ten(a).localeCompare(ten(b),'vi');
  const ds=d.hs.filter(tk=>d.gd[tk]===l.id).sort(by),gvTen=g=>(d.gv.find(x=>x.id===g)||{ten:g}).ten,con=d.gv.filter(g=>!(l.gv||[]).includes(g.id));
  const gvBox=`<div class="qlchips">${(l.gv||[]).map(g=>`<span class="pill">${e(gvTen(g))} <button type="button" class="xbtn" aria-label="Bỏ phân công" onclick="qaBo('${ma}','${e(l.id)}','${e(g)}')">×</button></span>`).join('')||'<span class="pill qlwarn">Chưa có giáo viên</span>'}</div>
   ${con.length?`<div class="qlin"><select id="qaPc" aria-label="Chọn giáo viên">${con.map(g=>`<option value="${e(g.id)}">${e(g.ten)}</option>`).join('')}</select><button type="button" class="btn sm" onclick="qaPhan('${ma}','${e(l.id)}')">Phân công</button></div>`:''}`;
  const tj=l.tj&&l.tj.on?`<div class="qlin"><span class="pill ok">Đang mở · hạn ${e(l.tj.han||'')}</span><button type="button" class="btn sm" onclick="qaTJ('${ma}','${e(l.id)}',false)">Tắt</button></div>`
   :`<div class="qlin"><input id="qaTjMa" placeholder="Mã gói" aria-label="Mã gói" autocomplete="off"><button type="button" class="btn sm pri" onclick="qaTJ('${ma}','${e(l.id)}',true)">Gắn gói</button></div><div class="muted" style="font-size:12px;margin-top:6px">Mã thử: <b>${e(typeof DEMO_CODE!=='undefined'?DEMO_CODE:'')}</b></div>`;
  const rows=ds.map((tk,i)=>`<div class="qlr qds"><span class="a-ck">${i+1}</span><div class="a-ten"><b>${e(ten(tk))}</b><div class="muted">${e(tk)}</div></div><div class="a-act"><button type="button" class="btn sm" onclick="qaSua('${ma}','${e(tk)}')">✎ Sửa</button><button type="button" class="btn sm" onclick="qaDoiLop('${ma}','${e(tk)}','')">Bỏ khỏi lớp</button><button type="button" class="btn sm qlxbtn qlx1" onclick="qaXoa('${ma}','${e(tk)}')">🗑 Xoá</button></div></div>`).join('');
  /* thêm học sinh vào lớp: gợi ý 5 em chưa xếp lớp; gõ tên để tìm (em chưa xếp lớp, em cùng khối ở lớp khác) */
  const q=bo(QA.themTim||'').toLowerCase(),chon=QA.themChon||{},chua=d.hs.filter(tk=>!d.gd[tk]);
  let goi=q?d.hs.filter(tk=>{const c=d.gd[tk];if(c===l.id)return false;const r=(o.hs||[]).find(x=>x[0]===tk)||[];if(c&&r[2]!==l.khoi)return false;return bo(ten(tk)).toLowerCase().includes(q)||tk.includes(q)}).sort((a,b)=>(d.gd[a]?1:0)-(d.gd[b]?1:0)||by(a,b)):[...chua].sort((a,b)=>(chon[b]?1:0)-(chon[a]?1:0)||by(a,b));
  const max=q?15:5,show=goi.slice(0,max),n=Object.keys(chon).filter(k=>chon[k]).length,conLai=goi.length-show.length;
  const list=show.map(tk=>{const c=d.gd[tk],cl=c&&d.lop.find(x=>x.id===c);return`<label class="qlckr"><input type="checkbox" ${chon[tk]?'checked':''} onchange="QA.themChon['${e(tk)}']=this.checked;render()"><span><b>${e(ten(tk))}</b> <small>${e(tk)} · ${cl?'đang ở lớp '+e(cl.ten):'<span class="qlw">chưa xếp lớp</span>'}</small></span></label>`}).join('');
  const them=`<section class="card"><h2>Thêm học sinh vào lớp ${e(l.ten)}</h2>
   <input id="qaThemQ" type="search" placeholder="Gõ tên hoặc tên đăng nhập để tìm" aria-label="Tìm học sinh để thêm" value="${e(QA.themTim||'')}" oninput="clearTimeout(window._qaT);window._qaT=setTimeout(()=>{QA.themTim=this.value.trim();render();const x=document.getElementById('qaThemQ');if(x){x.focus();x.setSelectionRange(x.value.length,x.value.length)}},300)">
   <p class="muted qlhint">${q?`Kết quả tìm: em chưa xếp lớp và em khối ${l.khoi} ở lớp khác.`:(chua.length?`Gợi ý ${show.length} em chưa xếp lớp${conLai?` (còn ${conLai} em — gõ tên để tìm)`:''}.`:'Không còn em nào chưa xếp lớp. Gõ tên để chuyển em từ lớp khác.')}</p>
   ${show.length?`<div class="qlck">${list}</div>`:(q?'<p class="muted">Không tìm thấy em nào.</p>':'')}
   <div class="qlin" style="margin-top:10px"><button type="button" class="btn pri" ${n?'':'disabled'} onclick="qaThemVao('${ma}','${e(l.id)}')">${n?`Đưa ${n} em vào lớp`:'Đưa vào lớp'}</button></div>
   <div class="qlin qlnew"><span class="muted">Chưa có tài khoản?</span><button type="button" class="btn sm" onclick="qaFormHS('${ma}')">+ Tạo tài khoản học sinh</button></div></section>`;
  return`<div class="qlhd"><button type="button" class="btn sm" onclick="QA.lopId='';render()">← Lớp</button><h2 style="margin:0">🏫 Lớp ${e(l.ten)}</h2><span class="pill">Khối ${l.khoi} · ${ds.length} em</span></div>
   <div class="grid gpair"><section class="card"><h2>Giáo viên</h2>${gvBox}</section><section class="card"><h2>Toán Jenny</h2>${tj}</section></div>
   ${them}
   <section class="card"><h2>Danh sách lớp (${ds.length})</h2>${ds.length?`<div class="qlli">${rows}</div>`:'<p class="muted">Lớp chưa có em nào.</p>'}</section>`}
window.qaFormLop=function(ma){const d=duLieuTruong(ma);hopQA('Thêm lớp',`<div class="qs2"><label>Khối<select id="qaKhoi">${[1,2,3,4,5].map(k=>`<option value="${k}">Khối ${k}</option>`).join('')}</select></label><label>Tên lớp<input id="qaLopTen" maxlength="8" placeholder="1D" required></label></div>
  <label>Giáo viên<select id="qaLopGV"><option value="">Chưa phân công</option>${d.gv.map(g=>`<option value="${e(g.id)}">${e(g.ten)}</option>`).join('')}</select></label>`,`qaTaoLop('${ma}')`,'Thêm lớp')};
window.qaTaoLop=async function(ma){const k=+v('qaKhoi'),t=v('qaLopTen').toUpperCase(),g=v('qaLopGV'),o=(await oMoi(ma));o.lop=o.lop||[];o.mo=o.mo||{};
  if(!/^[0-9A-Z.\- ]{1,8}$/.test(t)){bao('Tên lớp ngắn, ví dụ 1D');return}if(o.lop.some(l=>l.id===t)){bao('Đã có lớp '+t);return}
  khoa(true);try{o.lop.push({id:t,khoi:k,ten:t,gv:g?[g]:[],tj:{on:false}});o.mo[t]={};await luuO(ma,o,`Tạo lớp ${t} (khối ${k})`);dong();toast('Đã tạo lớp '+t);render()}catch(x){bao(fbLoi(x));khoa(false)}};
window.qaPhan=async function(ma,lid){const g=v('qaPc'),o=(await oMoi(ma)),l=(o.lop||[]).find(x=>x.id===lid);if(!g||!l)return;l.gv=l.gv||[];if(l.gv.includes(g))return;l.gv.push(g);
  try{await luuO(ma,o,`Phân công ${g} dạy lớp ${lid}`);toast('Đã phân công');render()}catch(x){toast(fbLoi(x))}};
window.qaBo=async function(ma,lid,g){const o=(await oMoi(ma)),l=(o.lop||[]).find(x=>x.id===lid);if(!l)return;const tn=((o.gv||[]).find(x=>x.id===g)||{ten:g}).ten;if(!confirm(`Bỏ phân công ${tn} khỏi lớp ${l.ten}?`))return;l.gv=(l.gv||[]).filter(x=>x!==g);
  try{await luuO(ma,o,`Bỏ phân công ${g} khỏi lớp ${lid}`);toast(`${tn} không còn dạy lớp ${l.ten}`);render()}catch(x){toast(fbLoi(x))}};
window.qaTJ=async function(ma,lid,on){const o=(await oMoi(ma)),l=(o.lop||[]).find(x=>x.id===lid);if(!l)return;
  if(on){const c=v('qaTjMa');if(String(c).toUpperCase()!==String(typeof DEMO_CODE!=='undefined'?DEMO_CODE:'').toUpperCase()){toast('Mã gói chưa đúng'+(typeof DEMO_CODE!=='undefined'?' (mã thử: '+DEMO_CODE+')':''));return}l.tj={on:true,han:'31/05/2027'}}else l.tj={on:false};
  try{await luuO(ma,o,on?`Gắn gói Toán Jenny cho lớp ${lid}`:`Tắt gói Toán Jenny của lớp ${lid}`);toast(on?`Lớp ${l.ten} đã có Toán Jenny`:`Đã tắt Toán Jenny của lớp ${l.ten}`);render()}catch(x){toast(fbLoi(x))}};
window.qaThemVao=async function(ma,lid){const o=(await oMoi(ma)),l=(o.lop||[]).find(x=>x.id===lid),ds=Object.keys(QA.themChon||{}).filter(k=>QA.themChon[k]);if(!l||!ds.length)return;o.gd=o.gd||{};
  ds.forEach(tk=>{o.gd[tk]=lid;const r=(o.hs||[]).find(x=>x[0]===tk);if(r)r[2]=l.khoi});
  try{await luuO(ma,o,`Đưa ${ds.length} em vào lớp ${lid}`);await Promise.all(ds.map(tk=>raw().doc('hs/'+tk).set({lop:lid},{merge:true}).catch(()=>{})));QA.themChon={};QA.themTim='';toast(`Đã đưa ${ds.length} em vào lớp ${l.ten}`);render()}catch(x){toast(fbLoi(x))}};
/* ---------- admin quản lý tài khoản của mọi trường (thầy yêu cầu 13/11/2026) ---------- */
const nutTK=tk=>`<button type="button" class="btn sm" onclick="qaSua('${e(QA.ma)}','${e(tk)}')">✎ Sửa</button><button type="button" class="btn sm qlxbtn qlx1" title="Xoá tài khoản" onclick="qaXoa('${e(QA.ma)}','${e(tk)}')">🗑 Xoá</button>`;
const MK0='jenny123',bo=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D');
const oCua=ma=>JSON.parse(JSON.stringify((QA.truong[ma]||{}).o||{}));
/* đọc lại dữ liệu trường ngay trước khi sửa (12/11: tránh ghi đè thay đổi quản lý trường vừa làm) */
async function oMoi(ma){try{const d=await raw().doc('truong/'+ma).get();if(d.exists){const x=d.data()||{};QA.truong[ma]=Object.assign(QA.truong[ma]||{ma},x,{o:fbJ(x.j)||{}})}}catch(e){console.error(e)}return oCua(ma)}
async function luuO(ma,o,nk){(o.nk=o.nk||[]).push({d:fbNgay(),ai:'Admin Clb',t:nk});const j=JSON.stringify(o);await raw().doc('truong/'+ma).set({j,gd:o.gd||{},pc:fbPc(o),t:fbTS()},{merge:true});QA.truong[ma].o=o;QA.truong[ma].j=j;
  if(ma===CLOUD.truong&&S.org){try{fbLast['org/main']='';}catch(x){}}}
const usCua=(ma,tk)=>(QT().us||[]).filter(u=>u.tk===tk&&(u.truong||'jenny')===ma);
const tkCo=tk=>(QT().us||[]).some(u=>u.tk===tk);
function hopQA(t,body,ok,okText){const el=document.createElement('div');el.className='gdov qtov';el.id='qaf';
  el.innerHTML=`<div class="gdbox qsbox qlmbox"><div class="gdhd"><b>${t}</b><button type="button" class="gdx" onclick="document.getElementById('qaf').remove()">Đóng ✕</button></div><form class="qsform" onsubmit="event.preventDefault();${ok}">${body}<p id="qaMsg" class="muted" style="margin:0;color:var(--coral)"></p><div class="qsbtn"><span style="flex:1"></span><button class="btn pri" type="submit">${okText}</button></div></form></div>`;
  document.body.appendChild(el);setTimeout(()=>{const i=el.querySelector('input');if(i)i.focus()},30)}
const v=i=>((document.getElementById(i)||{}).value||'').trim(),bao=t=>{const m=document.getElementById('qaMsg');if(m)m.textContent=t},dong=()=>{const f=document.getElementById('qaf');if(f)f.remove()};
const khoa=on=>{const b=document.querySelector('#qaf button[type=submit]');if(b){b.disabled=on;b.dataset.t=b.dataset.t||b.textContent;b.textContent=on?'Đang lưu…':b.dataset.t}};
const oTk=ma=>`<label>Tên đăng nhập (bỏ trống thì app tự đặt)<span class="ttbox"><span class="tt">${e(ma)}.</span><input id="qaTk" maxlength="30" autocapitalize="off" spellcheck="false" placeholder="vd. an"></span></label>`;
const oMK=`<label>Mật khẩu (ít nhất 6 kí tự)<input id="qaPw" maxlength="40" value="${MK0}"></label>`;
function baoMoi(t){QA.bao=t;render()}
function tkTu(ma,goc){const b=ma+'.'+bo(goc).toLowerCase().replace(/[^a-z0-9.]/g,'');let t=b,i=2;while(tkCo(t))t=b+(i++);return t}
/* bảng Thêm giáo viên / Thêm học sinh giống hệt trang Quản lý trường (71-quan-ly-gon.js) */
const gtSel=(id,cur)=>`<select id="${id}"><option value="">—</option><option value="nu" ${cur==='nu'?'selected':''}>Nữ</option><option value="nam" ${cur==='nam'?'selected':''}>Nam</option></select>`;
const nsSel=(ng,th)=>`<span class="qsns"><select id="qaNg" aria-label="Ngày"><option value="">Ngày</option>${Array.from({length:31},(_,i)=>`<option ${+ng===i+1?'selected':''}>${i+1}</option>`).join('')}</select><select id="qaTh" aria-label="Tháng"><option value="">Tháng</option>${Array.from({length:12},(_,i)=>`<option ${+th===i+1?'selected':''}>${i+1}</option>`).join('')}</select></span>`;
const okDt=d=>!d||/^(\+?84|0)\d{8,10}$/.test(d),okMail=m=>!m||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m);
const tkO=(ma,id,ph,req)=>`<label>Tên đăng nhập<span class="ttbox"><span class="tt">${e(ma)}.</span><input id="${id}" maxlength="30" autocapitalize="off" spellcheck="false" ${ph?`placeholder="${ph}"`:''} ${req?'required':''}></span></label>`;
window.qaFormGV=function(ma){hopQA('Thêm giáo viên',`<label>Họ và tên<input id="qaTen" maxlength="30" placeholder="Cô Nguyễn Thu Lan" required></label>
 <div class="qs2"><label>Giới tính${gtSel('qaGt','')}</label><label>Điện thoại<input id="qaDt" type="tel" maxlength="15" placeholder="0912345678"></label></div>
 <label>Gmail<input id="qaMail" type="email" maxlength="60" placeholder="ten@gmail.com"></label>
 <div class="qs2">${tkO(ma,'qaTk','',true)}<label>Mật khẩu<input id="qaPw" maxlength="30" required></label></div>`,`qaTaoGV('${ma}')`,'Thêm giáo viên')};
window.qaTaoGV=async function(ma){const ten=v('qaTen').replace(/\s+/g,' '),pw=v('qaPw'),gt=v('qaGt'),dt=v('qaDt').replace(/[^\d+]/g,''),mail=v('qaMail').toLowerCase();
  if(ten.length<3){bao('Nhập tên giáo viên');return}if(!okDt(dt)){bao('Số điện thoại chưa đúng');return}if(!okMail(mail)){bao('Gmail chưa đúng');return}
  const t0=v('qaTk').toLowerCase().replace(/^.*\./,''),tk=ma+'.'+t0;if(!t0||!fbTkOk(tk)){bao('Tên đăng nhập: chữ thường không dấu, số');return}if(tkCo(tk)){bao('Tên đăng nhập đã có');return}if(pw.length<6){bao('Mật khẩu cần ít nhất 6 kí tự');return}
  khoa(true);try{const uid=await fbTaoTK(tk,pw);await raw().doc('users/'+uid).set({role:'gv',tk,ten,gvId:tk,truong:ma});const o=(await oMoi(ma));
    (o.gv=o.gv||[]).push(Object.fromEntries(Object.entries({id:tk,ten,tk,gt,dt,mail}).filter(([k,x])=>x)));
    await luuO(ma,o,`Tạo giáo viên ${ten} (${tk})`);(QT().us||[]).push({uid,role:'gv',tk,ten,truong:ma});dong();baoMoi(`Đã tạo giáo viên <code>${e(tk)}</code> / <code>${e(pw)}</code> · phân công lớp: bấm ✎ Sửa`)}catch(x){console.error(x);bao(fbLoi(x));khoa(false)}};
window.qaFormHS=function(ma){hopQA('Thêm học sinh',`<div class="qs2"><label>Họ và đệm<input id="qaHo" maxlength="30" placeholder="Nguyễn Minh" required></label><label>Tên<input id="qaTen" maxlength="12" placeholder="An" required></label></div>
 <div class="qs2"><label>Giới tính${gtSel('qaGt','')}</label><label>Năm sinh<input id="qaNam" type="number" min="2010" max="2025" placeholder="2019"></label></div>
 <label>Ngày sinh (ngày, tháng)${nsSel('','')}</label>
 <div class="qs2"><label>Điện thoại phụ huynh<input id="qaDt" type="tel" maxlength="15" placeholder="0912345678"></label><label>Gmail phụ huynh<input id="qaMail" type="email" maxlength="60" placeholder="ten@gmail.com"></label></div>
 <div class="qs2">${tkO(ma,'qaTk','Bỏ trống = tự tạo',false)}<label>Mật khẩu<input id="qaPw" value="${MK0}" maxlength="30"></label></div>`,`qaTaoHS('${ma}')`,'Tạo tài khoản')};
window.qaTaoHS=async function(ma){const ho=v('qaHo').replace(/\s+/g,' '),tn=v('qaTen').replace(/\s+/g,' '),n=(ho+' '+tn).trim(),pw=v('qaPw');
  if(!ho||!tn){bao('Nhập họ và tên');return}const H={gt:v('qaGt'),ng:v('qaNg'),th:v('qaTh'),nam:v('qaNam'),dt:v('qaDt').replace(/[^\d+]/g,''),mail:v('qaMail').toLowerCase()};
  if(!H.gt){bao('Chọn giới tính (để chọn nhân vật cho em)');return}if(H.nam&&!(+H.nam>=2010&&+H.nam<=2025)){bao('Năm sinh chưa đúng');return}
  if(H.ng&&H.th&&H.nam&&new Date(+H.nam,+H.th-1,+H.ng).getDate()!==+H.ng){bao('Ngày sinh chưa đúng');return}if(!okDt(H.dt)){bao('Số điện thoại chưa đúng');return}if(!okMail(H.mail)){bao('Gmail chưa đúng');return}
  if(pw.length<6){bao('Mật khẩu cần ít nhất 6 kí tự');return}
  let tk=v('qaTk').toLowerCase();tk=tk?ma+'.'+tk.replace(/^.*\./,''):tkTu(ma,tn);if(!fbTkOk(tk)){bao('Tên đăng nhập: chữ thường không dấu, số');return}if(tkCo(tk)){bao('Tên đăng nhập đã có');return}
  const o=(await oMoi(ma)),khoi=1;
  khoa(true);try{const uid=await fbTaoTK(tk,pw);await raw().doc('users/'+uid).set({role:'hs',tk,ten:n,khoi,truong:ma});const st=newStudent(n,khoi);st.gender=H.gt;
    await raw().doc('hs/'+tk).set({j:JSON.stringify(fbTach(st).hs),ev:'[]',lop:'',truong:ma,t:fbTS()});
    (o.hs=o.hs||[]).push([tk,n,khoi]);(o.hoso=o.hoso||{})[tk]=Object.fromEntries(Object.entries(H).filter(([k,x])=>x));await luuO(ma,o,`Tạo học sinh ${n} (${tk})`);(QT().us||[]).push({uid,role:'hs',tk,ten:n,truong:ma});dong();
    baoMoi(`Đã tạo học sinh <code>${e(tk)}</code> / <code>${e(pw)}</code> · em đang <b>chưa xếp lớp</b>, chọn lớp ở cột Lớp để em đăng nhập được`)}catch(x){console.error(x);bao(fbLoi(x));khoa(false)}};
window.qaDoiLop=async function(ma,tk,lid){const o=(await oMoi(ma)),l=(o.lop||[]).find(x=>x.id===lid);o.gd=o.gd||{};if(lid)o.gd[tk]=lid;else delete o.gd[tk];const r=(o.hs||[]).find(x=>x[0]===tk);if(r&&l)r[2]=l.khoi;
  try{await luuO(ma,o,`Đổi lớp ${tk} → ${l?l.ten:'chưa xếp lớp'}`);try{await raw().doc('hs/'+tk).set({lop:lid||''},{merge:true})}catch(x){}toast(l?'Đã chuyển sang lớp '+l.ten:'Đã bỏ khỏi lớp');render()}catch(x){toast(fbLoi(x))}};
window.qaMK=async function(ma,tk){const pw=prompt(`Mật khẩu mới cho "${tk}" (ít nhất 6 kí tự):`,fbMKGoiY());if(pw===null)return;if(pw.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}toast('Đang đặt mật khẩu mới…');
  try{await datMK(ma,tk,pw);baoMoi(`Đã đặt mật khẩu mới cho <code>${e(tk)}</code>: <code>${e(pw)}</code>`)}catch(x){console.error(x);toast('Chưa đặt được: '+fbLoi(x))}};
async function datMK(ma,tk,pw){{const q=await raw().collection('users').where('tk','==',tk).get();if(q.empty){toast('Không tìm thấy tài khoản '+tk);return}
    const L=await raw().doc('login/'+tk).get(),cu=L.exists?L.data().uid:null,docCu=q.docs.find(d=>d.id===cu)||q.docs[0],du=Object.assign({},docCu.data(),{truong:docCu.data().truong||ma});
    const em=`${tk}.r${Date.now().toString(36)}@jenny-lop-hoc-ao.firebaseapp.com`;const app2=firebase.apps.find(a=>a.name==='tao')||firebase.initializeApp(FB_CFG,'tao');const c=await app2.auth().createUserWithEmailAndPassword(em,pw);const uid=c.user.uid;await app2.auth().signOut();
    await raw().doc('users/'+uid).set(du);await raw().doc('login/'+tk).set({email:em,uid,truong:du.truong,t:fbTS()});await Promise.all(q.docs.map(d=>raw().doc('users/'+d.id).delete()));
    const U=QT().us||[];U.forEach((u,i)=>{if(u.tk===tk)U[i]=Object.assign({},du,{uid})})}}
window.qaSua=function(ma,tk){const d=duLieuTruong(ma),u=usCua(ma,tk)[0]||{},r=(d.o.hs||[]).find(x=>x[0]===tk),g=d.gv.find(x=>(x.tk||x.id)===tk),hs=u.role==='hs'||(!!r&&!u.role),gt=hs?((d.o.hoso||{})[tk]||{}).gt:(g||{}).gt,vai={ql:'quản lý trường',gv:'giáo viên',hs:'học sinh'}[u.role]||'';
  const H0=((d.o.hoso||{})[tk])||{};const ten=u.ten||(r&&r[1])||(g&&g.ten)||'',lopGV=d.lop.filter(l=>(l.gv||[]).includes(tk)).map(l=>l.id);
  if(!hs){hopQA(u.role==='ql'?'Sửa quản lý trường':'Sửa giáo viên',`<label>Họ tên<input id="qaTen" maxlength="40" value="${e(ten)}" required></label>
   <div class="qs2"><label>Tên đăng nhập<input value="${e(tk)}" readonly></label><label>Giới tính<select id="qaGt"><option value="">—</option><option value="nu" ${gt==='nu'?'selected':''}>Nữ</option><option value="nam" ${gt==='nam'?'selected':''}>Nam</option></select></label></div>
   <div class="qs2"><label>Điện thoại<input id="qaDt" type="tel" maxlength="15" value="${e((g||{}).dt||'')}" placeholder="0912345678"></label><label>Gmail<input id="qaMail" type="email" maxlength="60" value="${e((g||{}).mail||'')}" placeholder="ten@gmail.com"></label></div>
   <label>Mật khẩu mới (để trống nếu giữ nguyên)<input id="qaPw" maxlength="40" placeholder="ít nhất 6 kí tự" autocomplete="new-password"></label>`,`qaLuuSua('${ma}','${tk}')`,'Lưu')}
  else   hopQA(`Sửa ${vai} · ${e(ten)}`,`<label>Tên đăng nhập<input value="${e(tk)}" disabled></label>
   <div class="qs2"><label>Họ tên<input id="qaTen" maxlength="40" required value="${e(ten)}"></label><label>Giới tính<select id="qaGt"><option value="">—</option><option value="nam" ${gt==='nam'?'selected':''}>Nam</option><option value="nu" ${gt==='nu'?'selected':''}>Nữ</option></select></label></div>
   ${hs?`<div class="qs2"><label>Năm sinh<input id="qaNam" type="number" min="2010" max="2025" value="${e(H0.nam||'')}"></label><label>Ngày sinh (ngày, tháng)${nsSel(H0.ng,H0.th)}</label></div>
   <div class="qs2"><label>Điện thoại phụ huynh<input id="qaDt" type="tel" maxlength="15" value="${e(H0.dt||'')}"></label><label>Gmail phụ huynh<input id="qaMail" type="email" maxlength="60" value="${e(H0.mail||'')}"></label></div>`:`<div class="qs2"><label>Điện thoại<input id="qaDt" type="tel" maxlength="15" value="${e((g||{}).dt||'')}"></label><label>Gmail<input id="qaMail" type="email" maxlength="60" value="${e((g||{}).mail||'')}"></label></div>`}
   ${hs?`<label>Lớp<select id="qaLop"><option value="">— Chưa xếp lớp</option>${d.lop.map(l=>`<option value="${e(l.id)}" ${d.gd[tk]===l.id?'selected':''}>Lớp ${e(l.ten)}</option>`).join('')}</select></label>`:''}

   <label>Mật khẩu mới (để trống nếu giữ nguyên)<input id="qaPw" maxlength="40" placeholder="ít nhất 6 kí tự" autocomplete="new-password"></label>`,`qaLuuSua('${ma}','${tk}')`,'Lưu');
  const bt=document.querySelector('#qaf .qsbtn');if(bt)bt.insertAdjacentHTML('afterbegin',`<button type="button" class="btn qlxbtn" onclick="document.getElementById('qaf').remove();qaXoa('${ma}','${tk}')">🗑 Xoá tài khoản</button>`)};
window.qaLuuSua=async function(ma,tk){const n=v('qaTen').replace(/\s+/g,' '),gt=v('qaGt'),pw=v('qaPw'),lopEl=document.getElementById('qaLop'),gvL=[...document.querySelectorAll('.qaLopGV')];
  const dt=v('qaDt').replace(/[^\d+]/g,''),mail=v('qaMail').toLowerCase(),nam=v('qaNam'),ng=v('qaNg'),th=v('qaTh');
  if(n.length<3){bao('Họ tên quá ngắn');return}if(pw&&pw.length<6){bao('Mật khẩu cần ít nhất 6 kí tự');return}if(!okDt(dt)){bao('Số điện thoại chưa đúng');return}if(!okMail(mail)){bao('Gmail chưa đúng');return}
  if(nam&&!(+nam>=2010&&+nam<=2025)){bao('Năm sinh chưa đúng');return}if(ng&&th&&nam&&new Date(+nam,+th-1,+ng).getDate()!==+ng){bao('Ngày sinh chưa đúng');return}khoa(true);
  try{const o=(await oMoi(ma)),thay=[];const q=await raw().collection('users').where('tk','==',tk).get();const cu=q.docs[0]&&q.docs[0].data()||{};
    if(cu.ten!==n){await Promise.all(q.docs.map(x=>raw().doc('users/'+x.id).set({ten:n},{merge:true})));(QT().us||[]).forEach(x=>{if(x.tk===tk)x.ten=n});thay.push('họ tên')}
    const r=(o.hs||[]).find(x=>x[0]===tk);if(r){if(r[1]!==n)r[1]=n;o.hoso=o.hoso||{};const H=o.hoso[tk]=o.hoso[tk]||{};if((H.gt||'')!==gt){H.gt=gt;thay.push('giới tính')}
      const hs1={nam,ng,th,dt,mail};if(Object.keys(hs1).some(k=>(H[k]||'')!==hs1[k])){Object.keys(hs1).forEach(k=>{if(hs1[k])H[k]=hs1[k];else delete H[k]});thay.push('hồ sơ')}
      if(lopEl){const lid=lopEl.value;o.gd=o.gd||{};if((o.gd[tk]||'')!==lid){if(lid)o.gd[tk]=lid;else delete o.gd[tk];const l=(o.lop||[]).find(x=>x.id===lid);if(l)r[2]=l.khoi;thay.push('lớp');try{await raw().doc('hs/'+tk).set({lop:lid},{merge:true})}catch(x){}}}}
    const g=(o.gv||[]).find(x=>(x.tk||x.id)===tk);if(g){if(g.ten!==n)g.ten=n;if((g.gt||'')!==gt){g.gt=gt;thay.push('giới tính')}if((g.dt||'')!==dt||(g.mail||'')!==mail){if(dt)g.dt=dt;else delete g.dt;if(mail)g.mail=mail;else delete g.mail;thay.push('liên hệ')}
      if(gvL.length){const chon=gvL.filter(x=>x.checked).map(x=>x.value);let doi=false;(o.lop||[]).forEach(l=>{l.gv=l.gv||[];const co=l.gv.includes(tk),can=chon.includes(l.id);if(co&&!can){l.gv=l.gv.filter(x=>x!==tk);doi=true}if(!co&&can){l.gv.push(tk);doi=true}});if(doi)thay.push('lớp phụ trách')}}
    if(thay.some(x=>x!=='mật khẩu'))await luuO(ma,o,`Sửa ${tk}: ${thay.join(', ')}`);
    if(pw){await datMK(ma,tk,pw);thay.push('mật khẩu')}
    dong();if(pw)baoMoi(`Đã lưu ${e(tk)}${thay.length?' ('+thay.join(', ')+')':''}. Mật khẩu mới: <code>${e(pw)}</code>`);else{toast(thay.length?'Đã lưu: '+thay.join(', '):'Không có gì thay đổi');render()}}
  catch(x){console.error(x);bao(fbLoi(x));khoa(false)}};
window.qaSuaTen=async function(ma,tk){const u=usCua(ma,tk)[0],cu=(u&&u.ten)||'';const ten=prompt(`Họ tên mới cho ${tk}:`,cu);if(ten===null)return;const n=ten.trim().replace(/\s+/g,' ');if(n.length<3){toast('Họ tên quá ngắn');return}
  try{const q=await raw().collection('users').where('tk','==',tk).get();await Promise.all(q.docs.map(d=>raw().doc('users/'+d.id).set({ten:n},{merge:true})));
    const o=(await oMoi(ma));let doi=false;(o.hs||[]).forEach(r=>{if(r[0]===tk){r[1]=n;doi=true}});(o.gv||[]).forEach(g=>{if((g.tk||g.id)===tk){g.ten=n;doi=true}});if(doi)await luuO(ma,o,`Đổi họ tên ${tk}: ${cu} → ${n}`);
    (QT().us||[]).forEach(x=>{if(x.tk===tk)x.ten=n});toast('Đã đổi họ tên');render()}catch(x){toast(fbLoi(x))}};
window.qaXoa=async function(ma,tk){const u=usCua(ma,tk)[0]||{};if(u.role==='qt')return;const g=prompt(`Xoá hẳn tài khoản ${tk}${u.ten?' ('+u.ten+')':''}? Dữ liệu học, lớp, phân công đều mất, không khôi phục được.\nGõ XOA để xác nhận:`);if(g===null)return;if(g.trim().toUpperCase()!=='XOA'){toast('Chưa xoá (chưa gõ XOA)');return}
  toast('Đang xoá…');try{const q=await raw().collection('users').where('tk','==',tk).get();await Promise.all(q.docs.map(d=>raw().doc('users/'+d.id).delete()));
    for(const c of ['login','hs','hsgv','tom']){try{await raw().doc(c+'/'+tk).delete()}catch(x){}}
    const o=(await oMoi(ma));let doi=false;if((o.hs||[]).some(r=>r[0]===tk)){o.hs=o.hs.filter(r=>r[0]!==tk);if(o.gd)delete o.gd[tk];if(o.hoso)delete o.hoso[tk];if(o.ph)delete o.ph[tk];doi=true}
    if((o.gv||[]).some(x=>(x.tk||x.id)===tk)){o.gv=o.gv.filter(x=>(x.tk||x.id)!==tk);(o.lop||[]).forEach(l=>{l.gv=(l.gv||[]).filter(x=>x!==tk)});doi=true}
    if(doi)await luuO(ma,o,`Xoá tài khoản ${tk}${u.ten?' ('+u.ten+')':''}`);const U=QT().us||[];for(let i=U.length-1;i>=0;i--)if(U[i].tk===tk)U.splice(i,1);QA.tom=QA.tom.filter(t=>t.tk!==tk);toast('Đã xoá '+tk);render()}catch(x){console.error(x);toast('Chưa xoá được: '+fbLoi(x))}};
/* ---------- gắn vào trang Quản lý ---------- */
{const _p=viewPH;viewPH=function(){if(dangAdmin()){if(!QA.luc&&!QA.tai)setTimeout(qaTai,0);if(QA.tim2===undefined)QA.tim2='';return QA.che==='truong'&&QA.ma?trangTruong():trangDS()}return _p.apply(this,arguments)}}
/* nút "Các trường" ở thanh trên → trang danh sách trường */
window.qtMo=function(){if(!laQT())return;datChe('ds');try{go({k:'home'})}catch(x){render()}window.scrollTo(0,0)};
{const _h=header;header=function(){const r=_h.apply(this,arguments);try{if(!laQT())return r;const x=document.getElementById('fbTr');if(!x)return r;
  const h=dangAdmin()?'<span class="pill">🛡 Admin Clb · tất cả các trường</span>':`<span class="pill" title="Mã trường: ${e(CLOUD.truong)}">🏫 ${e((S.org&&S.org.ten)||CLOUD.truong)} · <b>${e(CLOUD.truong)}</b></span> <button type="button" class="btn sm pri" onclick="qtMo()">← Các trường</button>`;
  if(x.dataset.h!==h){x.dataset.h=h;x.innerHTML=h}}catch(x){}return r}}
document.head.insertAdjacentHTML('beforeend',`<style>
.qa h1{font-size:28px;margin:0}.qahead{display:flex;justify-content:space-between;align-items:flex-end;gap:8px;flex-wrap:wrap}.qanut{display:flex;gap:6px;flex-wrap:wrap}.qanho{font-size:12.5px;margin:4px 0 8px}
.qakpis{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.qakpi{background:var(--surface,#fff);border:1px solid #DDE3F0;border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:2px}.qakpi .big{font-size:26px;font-weight:700}.qasub{font-size:12.5px}
.qakpi.qado .big,.qado{color:#B8320F}
.qatb{width:100%;border-collapse:collapse}.qatb th{font-size:12.5px;text-align:left;color:#3D4A70;font-weight:600}.qatb td,.qatb th{padding:8px;border-bottom:1px solid #EEF2FA;vertical-align:middle}.qarow{cursor:pointer}.qarow:hover td,.qarow:focus td{background:#EAF6FD}
.qamuc{white-space:nowrap}.qam1{background:#FDE8E2!important;color:#8A2A0C!important}.qam2{background:#FFF3D6!important;color:#7A5200!important}.qam3{background:#EAF6FD!important;color:#0B5A8A!important}.qam4{background:#E5F5EA!important;color:#1D6B36!important}.qam5{background:#D5EEDD!important;color:#14532A!important}
.qavang{border-left:4px solid #FCB40C}
.qacot{display:flex;align-items:flex-end;gap:4px;height:150px;padding-top:6px}.qac{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;min-width:0}.qac i{display:block;width:100%;background:#0079C1;border-radius:3px 3px 0 0;min-height:2px}.qac b{font-size:11px}.qac span{font-size:10px;color:#3D4A70;white-space:nowrap}
.qamach{display:flex;flex-direction:column;gap:8px}.qamr{display:grid;grid-template-columns:120px 1fr auto auto;gap:8px;align-items:center}.qamr small{white-space:nowrap}
.qatabs{display:flex;flex-wrap:wrap;gap:2px;border-bottom:1px solid #DDE3F0}.qatabs button{background:none!important;border:0!important;box-shadow:none!important;padding:9px 12px;font:inherit;color:#3D4A70;cursor:pointer;border-bottom:3px solid transparent!important;border-radius:0}.qatabs button.on{color:#0079C1;border-bottom-color:#0079C1!important;font-weight:600}.qaloc{display:flex;gap:6px;flex-wrap:wrap}.qaloc select,.qaloc input,.qainp{font:inherit;padding:7px 8px;border:1px solid #C9D2E3;border-radius:4px;min-width:0}.qainp{width:100%;box-sizing:border-box;margin:6px 0}
.qatac{white-space:nowrap}.qafs{border:1px solid #DDE3F0;border-radius:6px;padding:6px 10px;display:flex;flex-wrap:wrap;gap:6px 14px}.qafs legend{font-size:13px;color:#3D4A70}.qachk{display:flex!important;flex-direction:row!important;align-items:center;gap:6px;font-weight:400}.qachk input{width:18px!important;height:18px!important;min-height:0!important;box-shadow:none!important;padding:0!important;margin:0!important;border:0!important;accent-color:#0079C1}.qatac .btn{padding:4px 7px;margin:1px}.qasel{font:inherit;padding:4px 6px;border:1px solid #C9D2E3;border-radius:4px;max-width:120px}
.qatrang{display:flex;gap:8px;align-items:center;justify-content:center;margin-top:8px}
@media(max-width:620px){.qads tr:first-child{display:none}.qads,.qads tbody,.qads tr{display:block;width:auto!important;min-width:0!important}.qads td{white-space:normal!important}.qads tr{border:1px solid #DDE3F0;border-radius:8px;padding:8px;margin-bottom:8px}
 .qads td{display:inline-block;border:0;padding:2px 8px 2px 0}.qads td:first-child{display:block}.qads td[data-n]::before{content:attr(data-n) ': ';color:#3D4A70;font-size:12px}
 .qac:nth-child(even) span{visibility:hidden}.qamr{grid-template-columns:96px 1fr auto}.qamr small{display:none}.qakpis{grid-template-columns:repeat(2,minmax(0,1fr))}.qakpi .big{font-size:22px}}
</style>`);
})();
