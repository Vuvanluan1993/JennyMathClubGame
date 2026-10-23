/* ===================== Lớp, giáo viên, quản lý trung tâm (chốt 23/10/2026) =====================
   Trung tâm → Năm học → Lớp (khối, tên, gói Toán Jenny) → Học sinh (ghi danh 1 lớp chính/năm).
   Giáo viên ↔ Lớp: nhiều–nhiều. Toán Jenny mở theo lớp; ngoại lệ từng em do quản lý bật.
   Buổi Toán Jenny mở theo từng lớp: S.open là thuộc tính ảo trỏ tới S.org.mo[lớp đang xem].
   Chỉ chạy ở bản đầy đủ / trang giáo viên (ORG_ON). Bản học sinh giữ nguyên. */
(function(){
if(!ORG_ON)return;
const HS_THEM=[['bao','Nguyễn Gia Bảo',1],['linh','Trần Khánh Linh',1],['khang','Vũ Minh Khang',1],['phuc','Lê Hoàng Phúc',5],['ngoc','Phạm Bảo Ngọc',5]];
HS_THEM.forEach(s=>{if(!STUDENTS.some(x=>x[0]===s[0]))STUDENTS.push(s)});

function orgMoi(){
  const L=(id,khoi,gv,tj)=>({id,khoi,ten:id,gv,tj:tj?{on:true,han:'31/05/2027'}:{on:false}});
  return{ten:'Clb Học Toán cùng Jenny',nam:'2026–2027',
    gv:[{id:'jenny',ten:'Cô Jenny'},{id:'hoa',ten:'Cô Hoa'},{id:'minh',ten:'Thầy Minh'}],
    lop:[L('1A',1,['jenny'],1),L('1B',1,['jenny']),L('1C',1,['hoa']),L('2A',2,['minh']),L('3A',3,['minh']),L('4A',4,['minh']),L('5A',5,['hoa'],1),L('5B',5,['hoa']),L('6A',6,['minh']),L('7A',7,['minh']),L('8A',8,['minh']),L('9A',9,['minh'])],
    gd:{na:'1A',tu:'1A',my:'1A',bao:'1B',linh:'1B',khang:'1C',lam:'2A',quan:'3A',thao:'4A',duc:'5A',phuc:'5A',ngoc:'5B',an:'6A',binh:'6A',chi:'6A',dung:'7A',ha:'8A',khoa:'9A'},
    nl:{},nk:[],mo:{},hsMoi:[]};
}
const O=()=>S.org;
window.lopById=id=>O().lop.find(l=>l.id===id);
window.lopCua=id=>lopById(O().gd[id]||'');
window.hsCuaLop=lid=>STUDENTS.filter(s=>O().gd[s[0]]===lid);
const gvById=id=>O().gv.find(g=>g.id===id);
const nk=t=>{O().nk.push({d:S.day,ai:role==='gv'?(gvById(gvMe)||{}).ten:'Quản lý trung tâm',t});if(O().nk.length>200)O().nk.shift()};
let ctxO=null;
function ctxLop(){
  if(ctxO)return ctxO;
  if(role==='gv'&&gvLop)return gvLop;
  const l=O().gd[sid];if(l)return l;
  const st=S.st[sid],f=st&&O().lop.find(x=>x.khoi===st.grade);return f?f.id:'_';
}
function orgHeal(){
  if(!S)return;
  if(!S.org)S.org=orgMoi();
  O().hsMoi.forEach(s=>{if(!STUDENTS.some(x=>x[0]===s[0]))STUDENTS.push(s)});
  STUDENTS.forEach(([id,n,g])=>{if(!S.st[id])S.st[id]=newStudent(n,g)});
  const d=Object.getOwnPropertyDescriptor(S,'open');
  if(!d||!d.get){
    const old=(d&&d.value)||{};delete S.open;
    O().lop.forEach(l=>{if(!O().mo[l.id])O().mo[l.id]=l.khoi===1&&l.id!=='1A'?{}:Object.assign({},old)});
    Object.defineProperty(S,'open',{configurable:true,enumerable:false,get(){const k=ctxLop();return O().mo[k]||(O().mo[k]={})}});
  }
  /* Toán Jenny theo lớp: kích hoạt = lớp có gói, hoặc ngoại lệ của em */
  STUDENTS.forEach(([id])=>{const l=lopCua(id);S.st[id].active=!!((l&&l.tj.on)||O().nl[id])});
  (S.asg||[]).forEach(a=>{if(!a.lop){const f=O().lop.find(l=>l.khoi===a.g);if(f)a.lop=f.id}});
  if(gvLop){const l=lopById(gvLop);if(!l||!l.gv.includes(gvMe))gvLop=null}
}
{const _r=render;render=function(){try{orgHeal()}catch(e){console.error(e)}return _r.apply(this,arguments)}}

/* ---------- Giáo viên ---------- */
gvCLS=function(){return gvLop?hsCuaLop(gvLop):STUDENTS.filter(s=>s[2]===gvGrade)};
gvTen=function(){return(gvById(gvMe)||{ten:'Cô giáo'}).ten};
const lopCuaToi=()=>O().lop.filter(l=>l.gv.includes(gvMe)).sort((a,b)=>a.khoi-b.khoi||a.ten.localeCompare(b.ten));
const chonGV=()=>`<div class="field" style="min-width:0;max-width:360px"><label for="gvMe" class="muted" style="font-size:12.5px">Đang xem với tài khoản (chỉ có ở bản thử)</label><select id="gvMe" style="width:100%" onchange="gvMe=this.value;gvLop=null;go({k:'home'})">${O().gv.map(g=>`<option value="${g.id}" ${g.id===gvMe?'selected':''}>${esc(g.ten)} · ${O().lop.filter(l=>l.gv.includes(g.id)).map(l=>l.ten).join(', ')||'chưa có lớp'}</option>`).join('')}</select></div>`;
window.vaoLop=id=>{const l=lopById(id);if(!l)return;gvLop=id;gvGrade=l.khoi;go({k:'home'})};
gvHead=function(){
  const l=lopById(gvLop),mine=lopCuaToi(),co=l.gv.filter(g=>g!==gvMe).map(g=>gvById(g)).filter(Boolean);
  return`<div class="row" style="justify-content:space-between;align-items:flex-end"><div><button class="btn sm" onclick="gvLop=null;go({k:'home'})">← Lớp của tôi</button>
   <h1 style="font-size:28px;margin:8px 0 0">Lớp ${esc(l.ten)}</h1><div class="muted">Khối ${l.khoi} · ${gvCLS().length} học sinh · ${esc(O().nam)}${co.length?' · dạy cùng '+co.map(g=>esc(g.ten)).join(', '):''}</div></div>
   ${mine.length>1?`<div class="seg" role="group" aria-label="Đổi lớp">${mine.map(x=>`<button class="${x.id===gvLop?'on':''}" aria-pressed="${x.id===gvLop}" onclick="vaoLop('${x.id}')">${esc(x.ten)}</button>`).join('')}</div>`:''}</div>`;
};
function viewLopCuaToi(){
  const mine=lopCuaToi(),khoi=[...new Set(mine.map(l=>l.khoi))];
  const the=l=>{const hs=hsCuaLop(l.id),hn=hs.filter(([id])=>dayStats(id,S.day).n>0).length;ctxO=l.id;let cy=0;try{cy=hs.filter(([id])=>alerts(id).length).length}finally{ctxO=null}
    return`<button class="lopthe" onclick="vaoLop('${l.id}')"><span class="lt-ten">${esc(l.ten)}</span><span class="muted">${hs.length} học sinh</span>
      <span class="lt-so"><span>Học hôm nay <b>${hn}/${hs.length}</b></span><span class="${cy?'bad':''}">Cần chú ý <b>${cy}</b></span></span>
      ${l.tj.on?'<span class="tag paid">Toán Jenny</span>':''}</button>`};
  return`<div class="grid">
   <div style="min-width:0"><h1 style="font-size:28px">Lớp của tôi</h1><div class="muted">${esc(gvTen())} · ${esc(O().ten)} · năm học ${esc(O().nam)} · ngày ${S.day}</div></div>${chonGV()}
   ${mine.length?khoi.map(k=>`<section class="card"><h2>Khối ${k}</h2><div class="lopgrid">${mine.filter(l=>l.khoi===k).map(the).join('')}</div></section>`).join('')
     :'<section class="card"><h2>Chưa có lớp</h2><p class="muted" style="margin:6px 0 0">Quản lý trung tâm chưa phân công lớp cho tài khoản này.</p></section>'}
   <p class="muted" style="margin:0">Lớp và học sinh do quản lý trung tâm xếp. Toán Jenny mở theo gói của từng lớp.</p></div>`;
}
{const _vg=viewGV;viewGV=function(){orgHeal();if(!gvLop)return viewLopCuaToi();gvGrade=lopById(gvLop).khoi;return _vg.apply(this,arguments)}}
{const _t=toggleOpen;toggleOpen=function(id){_t(id);try{nk(`${S.open[id]?'Mở':'Đóng'} ${unit(2,id).title.split(' · ')[0]} Toán Jenny · lớp ${gvLop}`);save()}catch(e){}}}

/* ---------- Quản lý trung tâm ---------- */
let qlKhoi=0,qlXoa='';
const qlMsg=t=>{save();render();toast(t)};
window.qlTJ=(id,on)=>{const l=lopById(id);if(on){const c=(document.getElementById('tjMa')||{}).value;if(String(c||'').trim().toUpperCase()!==DEMO_CODE){toast('Mã gói chưa đúng (mã thử: '+DEMO_CODE+')');return}l.tj={on:true,han:'31/05/2027'};nk(`Gắn gói Toán Jenny cho lớp ${id}`)}else{l.tj={on:false};nk(`Tắt gói Toán Jenny của lớp ${id}`)}qlMsg(on?`Lớp ${id} đã có Toán Jenny`:`Đã tắt Toán Jenny của lớp ${id}`)};
window.qlTJgan=()=>{const id=document.getElementById('tjLop').value;if(id)qlTJ(id,true)};
window.qlPhan=id=>{const g=document.getElementById('pc-'+id).value;const l=lopById(id);if(!g||l.gv.includes(g))return;l.gv.push(g);nk(`Phân công ${gvById(g).ten} dạy lớp ${id}`);qlMsg(`Đã phân công ${gvById(g).ten} dạy lớp ${id}`)};
window.qlBo=(id,g)=>{const k=id+'|'+g;if(qlXoa!==k){qlXoa=k;render();return}qlXoa='';const l=lopById(id);l.gv=l.gv.filter(x=>x!==g);nk(`Bỏ phân công ${gvById(g).ten} khỏi lớp ${id}`);qlMsg(`${gvById(g).ten} không còn dạy lớp ${id}`)};
window.qlChuyen=(sidx,lid)=>{const cu=O().gd[sidx]||'';if(lid)O().gd[sidx]=lid;else delete O().gd[sidx];const n=S.st[sidx].name;nk(lid?`Chuyển ${n}: ${cu||'chưa xếp lớp'} → ${lid}`:`Đưa ${n} ra khỏi lớp ${cu}`);qlMsg(lid?`${n} đã sang lớp ${lid}. Sao, xu, Sổ lỗi sai giữ nguyên.`:`${n} đang chưa xếp lớp`)};
window.qlNgoaiLe=(sidx,on)=>{if(on)O().nl[sidx]=1;else delete O().nl[sidx];nk(`${on?'Bật':'Tắt'} ngoại lệ Toán Jenny cho ${S.st[sidx].name}`);qlMsg(on?'Đã mở Toán Jenny riêng cho em':'Đã tắt ngoại lệ')};
const bo=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D');
window.qlTaoLop=e=>{e.preventDefault();const k=+document.getElementById('nlKhoi').value,t=document.getElementById('nlTen').value.trim().toUpperCase(),g=document.getElementById('nlGV').value;
  if(!/^[0-9A-Z.\- ]{1,8}$/.test(t)){toast('Tên lớp ngắn, ví dụ 1D');return}if(lopById(t)){toast('Đã có lớp '+t);return}
  O().lop.push({id:t,khoi:k,ten:t,gv:g?[g]:[],tj:{on:false}});O().mo[t]={};nk(`Tạo lớp ${t} (khối ${k})${g?' · '+gvById(g).ten:''}`);qlMsg('Đã tạo lớp '+t)};
window.qlTaoHS=e=>{e.preventDefault();const n=document.getElementById('nhTen').value.trim().replace(/\s+/g,' '),lid=document.getElementById('nhLop').value,l=lopById(lid);
  if(n.split(' ').length<2){toast('Nhập đủ họ và tên');return}if(!l)return;
  const goc=bo(n.split(' ').pop()).toLowerCase().replace(/[^a-z]/g,'')||'hs';let u=goc,i=2;while(S.st[u])u=goc+(i++);
  const r=[u,n,l.khoi];O().hsMoi.push(r);STUDENTS.push(r);S.st[u]=newStudent(n,l.khoi);O().gd[u]=lid;nk(`Tạo tài khoản ${n} (${u}) · lớp ${lid}`);qlMsg(`Đã tạo tài khoản ${u} / jenny123 cho ${n}`)};
window.qlTaoGV=e=>{e.preventDefault();const n=document.getElementById('ngTen').value.trim();if(n.length<3){toast('Nhập tên giáo viên');return}
  const goc=bo(n.split(' ').pop()).toLowerCase().replace(/[^a-z]/g,'')||'gv';let u=goc,i=2;while(gvById(u))u=goc+(i++);
  O().gv.push({id:u,ten:n});nk(`Tạo tài khoản giáo viên ${n}`);qlMsg('Đã tạo tài khoản giáo viên '+n)};

function viewQL(){
  const o=O(),LOP=[...o.lop].sort((a,b)=>a.khoi-b.khoi||a.ten.localeCompare(b.ten)),HS=STUDENTS.filter(s=>!qlKhoi||s[2]===qlKhoi);
  const chuaXep=STUDENTS.filter(s=>!o.gd[s[0]]).length;
  const rowsL=LOP.map(l=>{const hs=hsCuaLop(l.id),con=o.gv.filter(g=>!l.gv.includes(g.id));
    return`<tr><td><b>${esc(l.ten)}</b><div class="muted">Khối ${l.khoi}</div></td>
     <td><div class="row" style="gap:6px">${l.gv.length?l.gv.map(g=>{const k=l.id+'|'+g;return`<span class="pill">${esc((gvById(g)||{ten:g}).ten)} <button class="xbtn ${qlXoa===k?'arm':''}" aria-label="Bỏ phân công" onclick="qlBo('${l.id}','${g}')">${qlXoa===k?'Bỏ?':'×'}</button></span>`}).join(''):'<span class="pill bad">Chưa có giáo viên</span>'}</div>
      ${con.length?`<div class="row" style="gap:6px;margin-top:6px"><select id="pc-${l.id}" aria-label="Thêm giáo viên cho lớp ${l.ten}" style="max-width:150px">${con.map(g=>`<option value="${g.id}">${esc(g.ten)}</option>`).join('')}</select><button class="btn sm" onclick="qlPhan('${l.id}')">Phân công</button></div>`:''}</td>
     <td><b>${hs.length}</b></td>
     <td>${l.tj.on?`<span class="pill ok">Đang mở · hạn ${l.tj.han}</span> <button class="btn sm" onclick="qlTJ('${l.id}',false)">Tắt</button>`:'<span class="muted">Chưa có</span>'}</td></tr>`}).join('');
  const rowsH=HS.map(([id,n,g])=>{const l=lopCua(id),cung=LOP.filter(x=>x.khoi===g),st=S.st[id];
    const tj=l&&l.tj.on?'<span class="pill ok">Theo lớp</span>':`<label class="row" style="gap:6px;font-size:13px"><input type="checkbox" ${o.nl[id]?'checked':''} onchange="qlNgoaiLe('${id}',this.checked)"> Ngoại lệ</label>`;
    return`<tr><td><b>${esc(n)}</b><div class="muted">${id} · ${totalStars(st)} sao · ${st.coins} xu</div></td><td>Khối ${g}</td>
     <td><select aria-label="Lớp của ${esc(n)}" onchange="qlChuyen('${id}',this.value)"><option value="">Chưa xếp lớp</option>${cung.map(x=>`<option value="${x.id}" ${l&&l.id===x.id?'selected':''}>${esc(x.ten)}</option>`).join('')}</select></td><td>${tj}</td></tr>`}).join('');
  const chuaGoi=LOP.filter(l=>!l.tj.on);
  return`<div class="grid">
  <div><h1 style="font-size:28px">Quản lý trung tâm</h1><div class="muted">${esc(o.ten)} · năm học ${esc(o.nam)} · ngày ${S.day}</div></div>
  <div class="kpis"><div class="kpi"><span class="muted">Lớp</span><span class="big">${o.lop.length}</span></div><div class="kpi"><span class="muted">Giáo viên</span><span class="big">${o.gv.length}</span></div><div class="kpi ${chuaXep?'alert':''}"><span class="muted">Học sinh${chuaXep?` · ${chuaXep} chưa xếp lớp`:''}</span><span class="big">${STUDENTS.length}</span></div><div class="kpi"><span class="muted">Lớp có Toán Jenny</span><span class="big">${o.lop.filter(l=>l.tj.on).length}</span></div></div>

  <section class="card"><h2>Lớp học</h2><p class="muted" style="margin:4px 0 0">Mỗi lớp có thể có nhiều giáo viên. Một giáo viên dạy được nhiều lớp, khác khối cũng được.</p>
   <div class="tablewrap"><table><tr><th>Lớp</th><th>Giáo viên</th><th>Sĩ số</th><th>Toán Jenny</th></tr>${rowsL}</table></div>
   <div class="grid g2" style="margin-top:14px">
    <form class="task" onsubmit="qlTaoLop(event)"><b>Tạo lớp mới</b><div class="row" style="gap:8px;margin-top:8px"><select id="nlKhoi" aria-label="Khối">${[1,2,3,4,5,6,7,8,9].map(k=>`<option value="${k}">Khối ${k}</option>`).join('')}</select><input id="nlTen" placeholder="Tên lớp, ví dụ 1D" aria-label="Tên lớp" style="width:130px" maxlength="8"><select id="nlGV" aria-label="Giáo viên"><option value="">Chưa phân công</option>${o.gv.map(g=>`<option value="${g.id}">${esc(g.ten)}</option>`).join('')}</select><button class="btn pri">Tạo lớp</button></div></form>
    <div class="task paidbox"><b>Gắn gói Toán Jenny cho lớp</b><div class="muted" style="margin-top:4px">Cả lớp cùng học. Mã thử: <b>${DEMO_CODE}</b></div>${chuaGoi.length?`<div class="row" style="gap:8px;margin-top:8px"><select id="tjLop" aria-label="Lớp">${chuaGoi.map(l=>`<option value="${l.id}">Lớp ${esc(l.ten)}</option>`).join('')}</select><input id="tjMa" placeholder="Mã gói" aria-label="Mã gói" autocomplete="off" style="width:130px"><button class="btn pri" onclick="qlTJgan()">Gắn gói</button></div>`:'<p class="muted">Mọi lớp đã có gói.</p>'}</div>
   </div></section>

  <section class="card"><div class="row" style="justify-content:space-between"><h2>Học sinh</h2><div class="seg" role="group" aria-label="Lọc theo khối" style="flex-wrap:wrap">${[0,1,2,3,4,5,6,7,8,9].map(k=>`<button class="${k===qlKhoi?'on':''}" aria-pressed="${k===qlKhoi}" onclick="qlKhoi=${k};render()">${k?'Khối '+k:'Tất cả'}</button>`).join('')}</div></div>
   <p class="muted" style="margin:4px 0 0">Mỗi em chỉ ở 1 lớp chính trong năm học. Chuyển lớp không mất sao, xu, Sổ lỗi sai. "Ngoại lệ" mở Toán Jenny riêng cho em khi lớp chưa có gói (học bù, chuyển lớp).</p>
   <div class="tablewrap"><table><tr><th>Học sinh</th><th>Khối</th><th>Lớp</th><th>Toán Jenny</th></tr>${rowsH}</table></div>
   <form class="task" onsubmit="qlTaoHS(event)" style="margin-top:14px"><b>Thêm học sinh</b><div class="row" style="gap:8px;margin-top:8px"><input id="nhTen" placeholder="Họ và tên" aria-label="Họ và tên" style="flex:1;min-width:160px" maxlength="40"><select id="nhLop" aria-label="Xếp vào lớp">${LOP.map(l=>`<option value="${l.id}">Lớp ${esc(l.ten)}</option>`).join('')}</select><button class="btn pri">Tạo tài khoản</button></div><div class="muted" style="margin-top:6px">Tên đăng nhập tự tạo, mật khẩu mặc định jenny123. Trẻ không cần email.</div></form></section>

  <div class="grid g2">
   <section class="card"><h2>Giáo viên</h2>${o.gv.map(g=>{const ls=o.lop.filter(l=>l.gv.includes(g.id));return`<div class="task"><b>${esc(g.ten)}</b><div class="row" style="gap:6px;margin-top:6px">${ls.length?ls.map(l=>`<span class="pill">${esc(l.ten)}</span>`).join(''):'<span class="muted">Chưa có lớp</span>'}</div></div>`}).join('')}
    <form class="row" onsubmit="qlTaoGV(event)" style="gap:8px;margin-top:12px"><input id="ngTen" placeholder="Tên giáo viên, ví dụ Cô Lan" aria-label="Tên giáo viên" style="flex:1;min-width:150px" maxlength="30"><button class="btn">Thêm giáo viên</button></form></section>
   <section class="card"><h2>Nhật ký thao tác</h2>${o.nk.length?`<div class="log" style="max-height:260px">${o.nk.slice(-30).reverse().map(x=>`Ngày ${x.d} · ${esc(x.ai||'')} · ${esc(x.t)}`).join('\n')}</div>`:'<p class="muted" style="margin:6px 0 0">Chưa có thao tác nào.</p>'}
    <p class="muted" style="margin:10px 0 0">Không xóa hẳn: em chưa xếp lớp vẫn giữ tài khoản và dữ liệu.</p></section>
  </div>
  <p class="muted" style="margin:0">Sắp có: lên lớp cả lớp cuối năm, đặt lại mật khẩu, khóa tài khoản, xuất dữ liệu. Trang Quản trị hệ thống (thầy) làm khi có máy chủ.</p>
  </div>`;
}
window.viewQL=viewQL;
{const _p=viewPH;viewPH=function(){if(role==='ql'){orgHeal();return viewQL()}return _p.apply(this,arguments)}}
{const _h=header;header=function(){_h();try{const t=document.getElementById('tabs');if(!t.querySelector('[data-ql]'))t.insertAdjacentHTML('beforeend',`<button data-ql class="${role==='ql'?'on':''}" aria-pressed="${role==='ql'}" onclick="setRole('ql')">Quản lý</button>`);
  document.getElementById('whoBox').hidden=role==='gv'||role==='ql';
  [...document.getElementById('who').options].forEach(op=>{const s=STUDENTS.find(x=>x[0]===op.value),l=s&&lopCua(s[0]);if(s)op.textContent=`${s[1]} · ${l?'lớp '+l.ten:'khối '+s[2]+' (chưa xếp lớp)'}`})}catch(e){}}}
document.head.insertAdjacentHTML('beforeend',`<style>
.lopgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-top:10px}
.lopthe{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:6px;padding:14px;background:var(--surface2);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--ink);min-height:120px}
.lopthe:hover,.lopthe:focus-visible{transform:translateY(-2px);outline:3px solid var(--sun,#FFC83D)}
.lt-ten{font-family:var(--f-display);font-size:30px;line-height:1}
.lt-so{display:flex;gap:12px;flex-wrap:wrap;font-size:13.5px}.lt-so .bad{color:var(--coral)}
.lopthe .tag{align-self:flex-start}
.lopgrid{grid-template-columns:repeat(auto-fill,minmax(min(200px,100%),1fr))}
.xbtn{all:unset;cursor:pointer;padding:0 4px;font-weight:700}.xbtn.arm{color:var(--coral)}
</style>`);
})();
