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
window.qaTab=t=>{QA.tab=t;QA.trang=0;render()};
/* ---------- trang một trường ---------- */
function trangTruong(){const d=duLieuTruong(QA.ma),T=d.T,o=d.o,t=d.tong;if(!QA.truong[QA.ma])return`<div class="grid qa"><button type="button" class="btn sm" onclick="qaVe()">← Tất cả các trường</button><p class="muted">Không tìm thấy trường ${e(QA.ma)}.</p></div>`;
  const tabs=[['tq','Tổng quan'],['lop','Lớp'],['gv','Giáo viên'],['hs','Học sinh'],['tk','Tài khoản']];
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
  else if(QA.tab==='lop'){body=`<section class="card"><h2>Các lớp</h2><div class="tablewrap"><table class="qatb"><tr><th>Lớp</th><th>Khối</th><th>Giáo viên</th><th>Sĩ số</th><th>Học 7 ngày</th><th>≥ 3 ngày chưa học</th><th>Đúng (30 ngày)</th><th>Sức mạnh Toán</th><th>Toán Jenny</th></tr>
    ${[...d.lop].sort((a,b)=>a.khoi-b.khoi||String(a.ten).localeCompare(b.ten)).map(l=>{const tks=d.hs.filter(tk=>d.gd[tk]===l.id),g=gom(tks,d.tomMap);return`<tr class="qarow" onclick="QA.lop='${e(l.id)}';qaTab('hs')"><td><b>${e(l.ten)}</b></td><td>${l.khoi}</td><td>${(l.gv||[]).map(x=>e((d.gv.find(y=>y.id===x)||{ten:x}).ten)).join(', ')||'<span class="muted">chưa phân công</span>'}</td><td>${tks.length}</td><td>${ph100(g.tuan,tks.length)}</td><td class="${g.nghi&&tks.length&&g.nghi/tks.length>.3?'qado':''}">${g.nghi}</td><td>${g.dung==null?'—':g.dung+'%'}</td><td>${nhanMuc(g.mucTB)}</td><td>${l.tj&&l.tj.on?'<span class="tag paid">Có</span>':'<span class="muted">—</span>'}</td></tr>`}).join('')||'<tr><td colspan="9" class="muted">Chưa có lớp.</td></tr>'}</table></div><p class="muted qanho">Bấm một lớp để xem học sinh của lớp.</p></section>`}
  else if(QA.tab==='gv'){body=`<section class="card"><h2>Giáo viên</h2><div class="tablewrap"><table class="qatb"><tr><th>Họ tên</th><th>Tên đăng nhập</th><th>Lớp phụ trách</th><th>Số HS</th><th>HS học 7 ngày</th><th>Điện thoại</th><th>Gmail</th><th></th></tr>
    ${d.gv.map(g=>{const L=d.lop.filter(l=>(l.gv||[]).includes(g.id)),tks=d.hs.filter(tk=>L.some(l=>l.id===d.gd[tk])),x=gom(tks,d.tomMap),u=users.find(u=>u.tk===(g.tk||g.id));return`<tr><td><b>${e(g.ten)}</b>${u&&u.role==='ql'?' <span class="pill">Quản lý</span>':''}</td><td><code>${e(g.tk||g.id)}</code></td><td>${L.map(l=>e(l.ten)).join(', ')||'<span class="muted">chưa có lớp</span>'}</td><td>${tks.length}</td><td>${tks.length?ph100(x.tuan,tks.length):'—'}</td><td>${e(g.dt||'')}</td><td>${e(g.mail||'')}</td><td class="qatac">${nutTK(g.tk||g.id)}</td></tr>`}).join('')||'<tr><td colspan="8" class="muted">Chưa có giáo viên.</td></tr>'}</table></div></section>`;
    body=body.replace('<section class="card"><h2>Giáo viên</h2>',`<section class="card"><div class="qahead"><h2>Giáo viên</h2><button type="button" class="btn sm pri" onclick="qaFormGV('${e(QA.ma)}')">+ Giáo viên</button></div>`)}
  else if(QA.tab==='hs'){const q=(QA.tim2||'').trim().toLowerCase(),bo=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').toLowerCase();
    const rows=(o.hs||[]).filter(([tk,n])=>(!QA.lop||(QA.lop==='__'?!d.gd[tk]:d.gd[tk]===QA.lop))&&(!q||tk.includes(q)||bo(n).includes(bo(q)))).sort((a,b)=>String(a[1]).split(' ').pop().localeCompare(String(b[1]).split(' ').pop(),'vi')),N=30,tr=Math.min(QA.trang,Math.max(0,Math.ceil(rows.length/N)-1)),xem=rows.slice(tr*N,tr*N+N);
    body=`<section class="card"><div class="qahead"><h2>Học sinh</h2><span class="qaloc"><button type="button" class="btn sm pri" onclick="qaFormHS('${e(QA.ma)}')">+ Học sinh</button><select aria-label="Lớp" onchange="QA.lop=this.value;QA.trang=0;render()"><option value="">Tất cả lớp</option><option value="__" ${QA.lop==='__'?'selected':''}>Chưa xếp lớp</option>${d.lop.map(l=>`<option value="${e(l.id)}" ${QA.lop===l.id?'selected':''}>Lớp ${e(l.ten)}</option>`).join('')}</select>
      <input id="qaTim2" type="search" placeholder="Tìm tên" value="${e(QA.tim2||'')}" oninput="QA.tim2=this.value;QA.trang=0;render();const i=document.getElementById('qaTim2');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></span></div>
     <div class="tablewrap"><table class="qatb"><tr><th>Họ tên</th><th>Tên đăng nhập</th><th>Lớp</th><th>Sao</th><th>Câu (30 ngày)</th><th>Đúng</th><th>Học gần nhất</th><th>Sức mạnh Toán</th><th>Bài quá hạn</th><th></th></tr>
     ${xem.map(([tk,n])=>{const t=d.tomMap[tk],x=t?soNgay(t,30):null,l=d.lop.find(l=>l.id===d.gd[tk]);return`<tr><td><b>${e(n)}</b></td><td><code>${e(tk)}</code></td><td><select class="qasel" aria-label="Lớp của ${e(n)}" onchange="qaDoiLop('${e(QA.ma)}','${e(tk)}',this.value)"><option value="">— chưa xếp</option>${d.lop.map(x=>`<option value="${e(x.id)}" ${l&&l.id===x.id?'selected':''}>${e(x.ten)}</option>`).join('')}</select></td>${t?`<td>${t.sao||0}</td><td>${x.n}</td><td>${x.n?pt(x.c,x.n)+'%':'—'}</td><td class="${nghi(t)?'qado':''}">${ngayCuoi(t.cuoi)}</td><td>${nhanMuc(mucChung(t))}</td><td>${t.qh||'—'}</td>`:'<td colspan="6" class="muted">chưa có số liệu</td>'}<td class="qatac">${nutTK(tk)}</td></tr>`}).join('')||'<tr><td colspan="10" class="muted">Không có học sinh.</td></tr>'}</table></div>
     ${rows.length>N?`<div class="row qatrang"><button type="button" class="btn sm" ${tr?'':'disabled'} onclick="QA.trang=${tr-1};render()">‹ Trước</button><span class="muted">${tr*N+1}–${Math.min(rows.length,tr*N+N)} / ${rows.length} em</span><button type="button" class="btn sm" ${tr*N+N<rows.length?'':'disabled'} onclick="QA.trang=${tr+1};render()">Sau ›</button></div>`:`<p class="muted qanho">${rows.length} em</p>`}
     <p class="muted qanho">Đổi lớp: chọn ở cột Lớp. Hồ sơ đầy đủ một em (biểu đồ, lỗi sai, giao bài): bấm "Vào trường để quản lý" rồi mở em đó.</p></section>`;}
  else{const vai={qt:'Admin Clb',ql:'Quản lý trường',gv:'Giáo viên',hs:'Học sinh',ph:'Phụ huynh'},dem=r=>users.filter(u=>u.role===r).length;
    const trongDS=u=>u.role==='hs'?d.hs.includes(u.tk):(u.role==='gv'||u.role==='ql')?d.gv.some(g=>(g.tk||g.id)===u.tk):true;
    const q=(QA.tim3||'').trim().toLowerCase(),loc=QA.vai3||'',ds=users.filter(u=>u.role!=='ph'||PH_ON).filter(u=>(!loc||u.role===loc||(loc==='do'&&!trongDS(u)))&&(!q||u.tk.includes(q)||String(u.ten||'').toLowerCase().includes(q))).sort((a,b)=>'qt ql gv hs ph'.indexOf(a.role)-'qt ql gv hs ph'.indexOf(b.role)||a.tk.localeCompare(b.tk));
    const doDang=users.filter(u=>!trongDS(u)).length;
    body=`<div class="qakpis">${kpi('Quản lý trường',dem('ql')+(QA.ma==='jenny'?dem('qt'):0))}${kpi('Giáo viên',dem('gv'))}${kpi('Học sinh',dem('hs'))}${doDang?kpi('Tài khoản dở dang',doDang,'không thuộc danh sách trường','qado'):''}</div>
    <section class="card"><div class="qahead"><h2>Tất cả tài khoản</h2><span class="qanut"><button type="button" class="btn sm pri" onclick="qtFormQL('${e(QA.ma)}')">+ Quản lý</button><button type="button" class="btn sm pri" onclick="qaFormGV('${e(QA.ma)}')">+ Giáo viên</button><button type="button" class="btn sm pri" onclick="qaFormHS('${e(QA.ma)}')">+ Học sinh</button></span></div>
     <div class="qaloc" style="margin:8px 0"><select aria-label="Vai trò" onchange="QA.vai3=this.value;render()"><option value="">Mọi vai trò</option>${[['ql','Quản lý trường'],['gv','Giáo viên'],['hs','Học sinh']].map(([k,n])=>`<option value="${k}" ${loc===k?'selected':''}>${n}</option>`).join('')}${doDang?`<option value="do" ${loc==='do'?'selected':''}>Tài khoản dở dang (${doDang})</option>`:''}</select>
      <input id="qaTim3" type="search" placeholder="Tìm tên đăng nhập, họ tên" value="${e(QA.tim3||'')}" oninput="QA.tim3=this.value;render();const i=document.getElementById('qaTim3');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></div>
     <div class="qlli">${ds.map(u=>{const l=u.role==='hs'?d.lop.find(x=>x.id===d.gd[u.tk]):null,lg=u.role!=='hs'?d.lop.filter(x=>(x.gv||[]).includes(u.tk)).map(x=>'Lớp '+x.ten).join(', '):'',gt=u.role==='hs'?(o.hoso&&o.hoso[u.tk]||{}).gt:(d.gv.find(g=>(g.tk||g.id)===u.tk)||{}).gt;
      return`<div class="qlr qhs"><div class="a-ten"><b>${e(u.ten||'')}</b>${trongDS(u)?'':' <span class="pill qlwarn">dở dang</span>'}<div class="muted">${e(u.tk)} · ${vai[u.role]||u.role}${gt?' · '+(gt==='nam'?'Nam':'Nữ'):''}</div></div>
       <div class="a-lop">${u.role==='hs'&&trongDS(u)?`<select class="qasel" aria-label="Lớp của ${e(u.ten)}" onchange="qaDoiLop('${e(QA.ma)}','${e(u.tk)}',this.value)"><option value="">— Chưa xếp lớp</option>${d.lop.map(x=>`<option value="${e(x.id)}" ${l&&l.id===x.id?'selected':''}>Lớp ${e(x.ten)}</option>`).join('')}</select>`:`<span class="muted">${e(lg)||'—'}</span>`}</div>
       <div class="a-ph"><span class="muted">${u.role==='hs'?ngayCuoi((d.tomMap[u.tk]||{}).cuoi):''}</span></div>
       <div class="a-act">${u.role==='qt'?'<span class="muted">tài khoản của thầy</span>':nutTK(u.tk)}</div></div>`}).join('')||'<p class="muted">Không có tài khoản.</p>'}</div>
     <p class="muted qanho">✎ Sửa: họ tên, giới tính, lớp, mật khẩu mới · 🗑 Xoá: xoá hẳn (gõ XOA để xác nhận). "Dở dang" = tài khoản tạo dở (vd. tạo dữ liệu thử bị dừng), không thuộc lớp hay danh sách giáo viên — nên xoá.</p></section>`}
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
/* ---------- admin quản lý tài khoản của mọi trường (thầy yêu cầu 13/11/2026) ---------- */
const nutTK=tk=>`<button type="button" class="btn sm" onclick="qaSua('${e(QA.ma)}','${e(tk)}')">✎ Sửa</button><button type="button" class="btn sm qlxbtn qlx1" title="Xoá tài khoản" onclick="qaXoa('${e(QA.ma)}','${e(tk)}')">🗑 Xoá</button>`;
const MK0='jenny123',bo=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D');
const oCua=ma=>JSON.parse(JSON.stringify((QA.truong[ma]||{}).o||{}));
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
window.qaFormGV=function(ma){const d=duLieuTruong(ma);hopQA('Thêm giáo viên · '+e((QA.truong[ma]||{}).ten||ma),`<div class="qs2"><label>Họ tên<input id="qaTen" maxlength="40" required placeholder="Cô Nguyễn Thu Hà"></label><label>Giới tính<select id="qaGt"><option value="nu">Nữ</option><option value="nam">Nam</option></select></label></div>
  ${oTk(ma)}${oMK}<label>Phân công lớp<select id="qaLop"><option value="">— chưa phân công</option>${d.lop.map(l=>`<option value="${e(l.id)}">Lớp ${e(l.ten)}</option>`).join('')}</select></label>`,`qaTaoGV('${ma}')`,'Tạo giáo viên')};
window.qaTaoGV=async function(ma){const ten=v('qaTen').replace(/\s+/g,' '),pw=v('qaPw'),lid=v('qaLop'),gt=v('qaGt');if(ten.length<3){bao('Nhập họ tên');return}if(pw.length<6){bao('Mật khẩu cần ít nhất 6 kí tự');return}
  let tk=v('qaTk').toLowerCase();tk=tk?ma+'.'+tk.replace(/^.*\./,''):tkTu(ma,ten.split(' ').slice(0,1).join('')+ten.split(' ').pop());if(!fbTkOk(tk)){bao('Tên đăng nhập: chữ thường không dấu, số');return}if(tkCo(tk)){bao('Tên đăng nhập đã có');return}
  khoa(true);try{const uid=await fbTaoTK(tk,pw);await raw().doc('users/'+uid).set({role:'gv',tk,ten,gvId:tk,truong:ma});const o=oCua(ma);(o.gv=o.gv||[]).push({id:tk,ten,tk,gt});if(lid){const l=(o.lop||[]).find(x=>x.id===lid);if(l)(l.gv=l.gv||[]).push(tk)}
    await luuO(ma,o,`Tạo giáo viên ${ten} (${tk})`);(QT().us||[]).push({uid,role:'gv',tk,ten,truong:ma});dong();baoMoi(`Đã tạo giáo viên <code>${e(tk)}</code> / <code>${e(pw)}</code>`)}catch(x){console.error(x);bao(fbLoi(x));khoa(false)}};
window.qaFormHS=function(ma){const d=duLieuTruong(ma);hopQA('Thêm học sinh · '+e((QA.truong[ma]||{}).ten||ma),`<div class="qs2"><label>Họ và đệm<input id="qaHo" maxlength="30" required placeholder="Nguyễn Minh"></label><label>Tên<input id="qaTen" maxlength="20" required placeholder="An"></label></div>
  <div class="qs2"><label>Giới tính<select id="qaGt"><option value="nam">Nam</option><option value="nu">Nữ</option></select></label><label>Lớp<select id="qaLop">${d.lop.map(l=>`<option value="${e(l.id)}" ${QA.lop===l.id?'selected':''}>Lớp ${e(l.ten)}</option>`).join('')}<option value="">— chưa xếp lớp</option></select></label></div>${oTk(ma)}${oMK}`,`qaTaoHS('${ma}')`,'Tạo học sinh')};
window.qaTaoHS=async function(ma){const ho=v('qaHo').replace(/\s+/g,' '),tn=v('qaTen').replace(/\s+/g,' '),n=(ho+' '+tn).trim(),gt=v('qaGt'),lid=v('qaLop'),pw=v('qaPw');if(!ho||!tn){bao('Nhập họ và tên');return}if(pw.length<6){bao('Mật khẩu cần ít nhất 6 kí tự');return}
  let tk=v('qaTk').toLowerCase();tk=tk?ma+'.'+tk.replace(/^.*\./,''):tkTu(ma,tn);if(!fbTkOk(tk)){bao('Tên đăng nhập: chữ thường không dấu, số');return}if(tkCo(tk)){bao('Tên đăng nhập đã có');return}
  const o=oCua(ma),l=(o.lop||[]).find(x=>x.id===lid),khoi=l?l.khoi:1;
  khoa(true);try{const uid=await fbTaoTK(tk,pw);await raw().doc('users/'+uid).set({role:'hs',tk,ten:n,khoi,truong:ma});const st=newStudent(n,khoi);st.gender=gt;
    await raw().doc('hs/'+tk).set({j:JSON.stringify(fbTach(st).hs),ev:'[]',lop:lid||'',truong:ma,t:fbTS()});
    (o.hs=o.hs||[]).push([tk,n,khoi]);o.gd=o.gd||{};if(lid)o.gd[tk]=lid;(o.hoso=o.hoso||{})[tk]={gt};await luuO(ma,o,`Tạo học sinh ${n} (${tk})`);(QT().us||[]).push({uid,role:'hs',tk,ten:n,truong:ma});dong();baoMoi(`Đã tạo học sinh <code>${e(tk)}</code> / <code>${e(pw)}</code>${lid?'':' · em chưa xếp lớp nên chưa đăng nhập được'}`)}catch(x){console.error(x);bao(fbLoi(x));khoa(false)}};
window.qaDoiLop=async function(ma,tk,lid){const o=oCua(ma),l=(o.lop||[]).find(x=>x.id===lid);o.gd=o.gd||{};if(lid)o.gd[tk]=lid;else delete o.gd[tk];const r=(o.hs||[]).find(x=>x[0]===tk);if(r&&l)r[2]=l.khoi;
  try{await luuO(ma,o,`Đổi lớp ${tk} → ${l?l.ten:'chưa xếp lớp'}`);try{await raw().doc('hs/'+tk).set({lop:lid||''},{merge:true})}catch(x){}toast(l?'Đã chuyển sang lớp '+l.ten:'Đã bỏ khỏi lớp');render()}catch(x){toast(fbLoi(x))}};
window.qaMK=async function(ma,tk){const pw=prompt(`Mật khẩu mới cho "${tk}" (ít nhất 6 kí tự):`,fbMKGoiY());if(pw===null)return;if(pw.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}toast('Đang đặt mật khẩu mới…');
  try{await datMK(ma,tk,pw);baoMoi(`Đã đặt mật khẩu mới cho <code>${e(tk)}</code>: <code>${e(pw)}</code>`)}catch(x){console.error(x);toast('Chưa đặt được: '+fbLoi(x))}};
async function datMK(ma,tk,pw){{const q=await raw().collection('users').where('tk','==',tk).get();if(q.empty){toast('Không tìm thấy tài khoản '+tk);return}
    const L=await raw().doc('login/'+tk).get(),cu=L.exists?L.data().uid:null,docCu=q.docs.find(d=>d.id===cu)||q.docs[0],du=Object.assign({},docCu.data(),{truong:docCu.data().truong||ma});
    const em=`${tk}.r${Date.now().toString(36)}@jenny-lop-hoc-ao.firebaseapp.com`;const app2=firebase.apps.find(a=>a.name==='tao')||firebase.initializeApp(FB_CFG,'tao');const c=await app2.auth().createUserWithEmailAndPassword(em,pw);const uid=c.user.uid;await app2.auth().signOut();
    await raw().doc('users/'+uid).set(du);await raw().doc('login/'+tk).set({email:em,uid,truong:du.truong,t:fbTS()});await Promise.all(q.docs.map(d=>raw().doc('users/'+d.id).delete()));
    const U=QT().us||[];U.forEach((u,i)=>{if(u.tk===tk)U[i]=Object.assign({},du,{uid})})}}
window.qaSua=function(ma,tk){const d=duLieuTruong(ma),u=usCua(ma,tk)[0]||{},r=(d.o.hs||[]).find(x=>x[0]===tk),g=d.gv.find(x=>(x.tk||x.id)===tk),hs=u.role==='hs'||(!!r&&!u.role),gt=hs?((d.o.hoso||{})[tk]||{}).gt:(g||{}).gt,vai={ql:'quản lý trường',gv:'giáo viên',hs:'học sinh'}[u.role]||'';
  const ten=u.ten||(r&&r[1])||(g&&g.ten)||'',lopGV=d.lop.filter(l=>(l.gv||[]).includes(tk)).map(l=>l.id);
  hopQA(`Sửa ${vai} · ${e(ten)}`,`<label>Tên đăng nhập<input value="${e(tk)}" disabled></label>
   <div class="qs2"><label>Họ tên<input id="qaTen" maxlength="40" required value="${e(ten)}"></label><label>Giới tính<select id="qaGt"><option value="">—</option><option value="nam" ${gt==='nam'?'selected':''}>Nam</option><option value="nu" ${gt==='nu'?'selected':''}>Nữ</option></select></label></div>
   ${hs?`<label>Lớp<select id="qaLop"><option value="">— Chưa xếp lớp</option>${d.lop.map(l=>`<option value="${e(l.id)}" ${d.gd[tk]===l.id?'selected':''}>Lớp ${e(l.ten)}</option>`).join('')}</select></label>`:''}
   ${!hs&&d.lop.length?`<fieldset class="qafs"><legend>Lớp phụ trách</legend>${d.lop.map(l=>`<label class="qachk"><input type="checkbox" class="qaLopGV" value="${e(l.id)}" ${lopGV.includes(l.id)?'checked':''}> Lớp ${e(l.ten)}</label>`).join('')}</fieldset>`:''}
   <label>Mật khẩu mới (để trống nếu giữ nguyên)<input id="qaPw" maxlength="40" placeholder="ít nhất 6 kí tự" autocomplete="new-password"></label>`,`qaLuuSua('${ma}','${tk}')`,'Lưu');
  const bt=document.querySelector('#qaf .qsbtn');if(bt)bt.insertAdjacentHTML('afterbegin',`<button type="button" class="btn qlxbtn" onclick="document.getElementById('qaf').remove();qaXoa('${ma}','${tk}')">🗑 Xoá tài khoản</button>`)};
window.qaLuuSua=async function(ma,tk){const n=v('qaTen').replace(/\s+/g,' '),gt=v('qaGt'),pw=v('qaPw'),lopEl=document.getElementById('qaLop'),gvL=[...document.querySelectorAll('.qaLopGV')];
  if(n.length<3){bao('Họ tên quá ngắn');return}if(pw&&pw.length<6){bao('Mật khẩu cần ít nhất 6 kí tự');return}khoa(true);
  try{const o=oCua(ma),thay=[];const q=await raw().collection('users').where('tk','==',tk).get();const cu=q.docs[0]&&q.docs[0].data()||{};
    if(cu.ten!==n){await Promise.all(q.docs.map(x=>raw().doc('users/'+x.id).set({ten:n},{merge:true})));(QT().us||[]).forEach(x=>{if(x.tk===tk)x.ten=n});thay.push('họ tên')}
    const r=(o.hs||[]).find(x=>x[0]===tk);if(r){if(r[1]!==n)r[1]=n;o.hoso=o.hoso||{};const H=o.hoso[tk]=o.hoso[tk]||{};if((H.gt||'')!==gt){H.gt=gt;thay.push('giới tính')}
      if(lopEl){const lid=lopEl.value;o.gd=o.gd||{};if((o.gd[tk]||'')!==lid){if(lid)o.gd[tk]=lid;else delete o.gd[tk];const l=(o.lop||[]).find(x=>x.id===lid);if(l)r[2]=l.khoi;thay.push('lớp');try{await raw().doc('hs/'+tk).set({lop:lid},{merge:true})}catch(x){}}}}
    const g=(o.gv||[]).find(x=>(x.tk||x.id)===tk);if(g){if(g.ten!==n)g.ten=n;if((g.gt||'')!==gt){g.gt=gt;thay.push('giới tính')}
      if(gvL.length){const chon=gvL.filter(x=>x.checked).map(x=>x.value);let doi=false;(o.lop||[]).forEach(l=>{l.gv=l.gv||[];const co=l.gv.includes(tk),can=chon.includes(l.id);if(co&&!can){l.gv=l.gv.filter(x=>x!==tk);doi=true}if(!co&&can){l.gv.push(tk);doi=true}});if(doi)thay.push('lớp phụ trách')}}
    if(thay.some(x=>x!=='mật khẩu'))await luuO(ma,o,`Sửa ${tk}: ${thay.join(', ')}`);
    if(pw){await datMK(ma,tk,pw);thay.push('mật khẩu')}
    dong();if(pw)baoMoi(`Đã lưu ${e(tk)}${thay.length?' ('+thay.join(', ')+')':''}. Mật khẩu mới: <code>${e(pw)}</code>`);else{toast(thay.length?'Đã lưu: '+thay.join(', '):'Không có gì thay đổi');render()}}
  catch(x){console.error(x);bao(fbLoi(x));khoa(false)}};
window.qaSuaTen=async function(ma,tk){const u=usCua(ma,tk)[0],cu=(u&&u.ten)||'';const ten=prompt(`Họ tên mới cho ${tk}:`,cu);if(ten===null)return;const n=ten.trim().replace(/\s+/g,' ');if(n.length<3){toast('Họ tên quá ngắn');return}
  try{const q=await raw().collection('users').where('tk','==',tk).get();await Promise.all(q.docs.map(d=>raw().doc('users/'+d.id).set({ten:n},{merge:true})));
    const o=oCua(ma);let doi=false;(o.hs||[]).forEach(r=>{if(r[0]===tk){r[1]=n;doi=true}});(o.gv||[]).forEach(g=>{if((g.tk||g.id)===tk){g.ten=n;doi=true}});if(doi)await luuO(ma,o,`Đổi họ tên ${tk}: ${cu} → ${n}`);
    (QT().us||[]).forEach(x=>{if(x.tk===tk)x.ten=n});toast('Đã đổi họ tên');render()}catch(x){toast(fbLoi(x))}};
window.qaXoa=async function(ma,tk){const u=usCua(ma,tk)[0]||{};if(u.role==='qt')return;const g=prompt(`Xoá hẳn tài khoản ${tk}${u.ten?' ('+u.ten+')':''}? Dữ liệu học, lớp, phân công đều mất, không khôi phục được.\nGõ XOA để xác nhận:`);if(g===null)return;if(g.trim().toUpperCase()!=='XOA'){toast('Chưa xoá (chưa gõ XOA)');return}
  toast('Đang xoá…');try{const q=await raw().collection('users').where('tk','==',tk).get();await Promise.all(q.docs.map(d=>raw().doc('users/'+d.id).delete()));
    for(const c of ['login','hs','hsgv','tom']){try{await raw().doc(c+'/'+tk).delete()}catch(x){}}
    const o=oCua(ma);let doi=false;if((o.hs||[]).some(r=>r[0]===tk)){o.hs=o.hs.filter(r=>r[0]!==tk);if(o.gd)delete o.gd[tk];if(o.hoso)delete o.hoso[tk];if(o.ph)delete o.ph[tk];doi=true}
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
