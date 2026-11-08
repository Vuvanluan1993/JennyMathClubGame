/* 71 — Quản lý gọn bằng nút + bảng nhập (thầy yêu cầu 24/10/2026)
   - Ô nhập dài trên trang được thay bằng nút: "+ Thêm lớp", "+ Thêm học sinh", "+ Thêm giáo viên", "⇄ Xếp lớp", "👪 Tài khoản phụ huynh".
     Bấm nút → bảng nhập đủ thông tin. Bảng dùng lại đúng hàm tạo cũ (cả bản có máy chủ) qua các ô ẩn của form cũ.
   - Học sinh: Họ, Tên, Giới tính, Ngày/Tháng/Năm sinh, Lớp, Điện thoại & Gmail phụ huynh (+ tên đăng nhập, mật khẩu khi có máy chủ).
   - Giáo viên: Họ tên, Giới tính, Điện thoại, Gmail (+ tên đăng nhập, mật khẩu). Lớp: Khối, Tên lớp, Giáo viên.
   - Trong bảng Học sinh: nút "Bỏ khỏi lớp"; "Xếp lớp" chọn nhiều em cùng khối đưa vào 1 lớp.
   - Anh chị em cùng bố mẹ: 1 tài khoản phụ huynh gắn được nhiều con (S.org.ph[con]=tk; máy chủ: users.con là danh sách). */
(function(){
if(typeof ORG_ON==='undefined'||!ORG_ON)return;
const O=()=>S.org,cloud=()=>!!(S.org&&S.org.cloud&&typeof FB!=='undefined'&&FB&&FB.db);
const nk=t=>{try{(O().nk=O().nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t});if(O().nk.length>200)O().nk.shift()}catch(e){}};
const v=i=>((document.getElementById(i)||{}).value||'').trim();
const setv=(i,x)=>{const el=document.getElementById(i);if(el)el.value=x};
function modal(t,body,ok,okText){const el=document.createElement('div');el.className='gdov';el.id='qlm';
 el.innerHTML=`<div class="gdbox qsbox qlmbox"><div class="gdhd"><b>${t}</b><button type="button" class="gdx" onclick="qlDong()">Đóng ✕</button></div><form class="qsform" onsubmit="event.preventDefault();${ok}">${body}<div class="qsbtn"><span style="flex:1"></span><button class="btn pri" type="submit">${okText||'Lưu'}</button></div></form></div>`;
 document.body.appendChild(el);setTimeout(()=>{const i=el.querySelector('input:not([disabled]),select');if(i)i.focus()},30)}
window.qlDong=()=>{const m=document.getElementById('qlm');if(m)m.remove()};
const LOPS=()=>[...O().lop].sort((a,b)=>a.khoi-b.khoi||a.ten.localeCompare(b.ten));
const gtSel=(id,cur)=>`<select id="${id}"><option value="">—</option><option value="nu" ${cur==='nu'?'selected':''}>Nữ</option><option value="nam" ${cur==='nam'?'selected':''}>Nam</option></select>`;
const nsSel=()=>`<span class="qsns"><select id="mNg" aria-label="Ngày"><option value="">Ngày</option>${Array.from({length:31},(_,i)=>`<option>${i+1}</option>`).join('')}</select><select id="mTh" aria-label="Tháng"><option value="">Tháng</option>${Array.from({length:12},(_,i)=>`<option>${i+1}</option>`).join('')}</select></span>`;
const okDt=d=>!d||/^(\+?84|0)\d{8,10}$/.test(d),okMail=m=>!m||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m);
/* ---------- Thêm học sinh ---------- */
window.qlMoHS=function(){
 modal('Thêm học sinh',`<div class="qs2"><label>Họ và đệm<input id="mHo" maxlength="30" placeholder="Nguyễn Minh" required></label><label>Tên<input id="mTen" maxlength="12" placeholder="An" required></label></div>
 <div class="qs2"><label>Giới tính${gtSel('mGt','')}</label><label>Năm sinh<input id="mNam" type="number" min="2010" max="2025" placeholder="2019"></label></div>
 <label>Ngày sinh (ngày, tháng)${nsSel()}</label>
 <div class="qs2"><label>Điện thoại phụ huynh<input id="mDt" type="tel" maxlength="15" placeholder="0912345678"></label><label>Gmail phụ huynh<input id="mMail" type="email" maxlength="60" placeholder="ten@gmail.com"></label></div>
 ${cloud()?`<div class="qs2"><label>Tên đăng nhập<input id="mTk" maxlength="24" autocapitalize="off" spellcheck="false" placeholder="Bỏ trống = tự tạo"></label><label>Mật khẩu<input id="mPw" maxlength="30" placeholder="Bỏ trống = ngẫu nhiên"></label></div>`:''}`,'qlLuuHS()','Tạo tài khoản')};
window.qlLuuHS=async function(){const ho=v('mHo').replace(/\s+/g,' '),ten=v('mTen').replace(/\s+/g,' '),n=(ho+' '+ten).trim();
 if(!ho||!ten){toast('Nhập họ và tên');return}const H={gt:v('mGt'),ng:v('mNg'),th:v('mTh'),nam:v('mNam'),dt:v('mDt').replace(/[^\d+]/g,''),mail:v('mMail').toLowerCase()};
 if(!H.gt){toast('Chọn giới tính (để chọn nhân vật cho em)');return}
 if(H.nam&&!(+H.nam>=2010&&+H.nam<=2025)){toast('Năm sinh chưa đúng');return}
 if(H.ng&&H.th&&H.nam&&new Date(+H.nam,+H.th-1,+H.ng).getDate()!==+H.ng){toast('Ngày sinh chưa đúng');return}
 if(!okDt(H.dt)){toast('Số điện thoại chưa đúng');return}if(!okMail(H.mail)){toast('Gmail chưa đúng');return}
 setv('nhTen',n);setv('nhLop','');setv('nhGt',H.gt);if(cloud()){setv('nhTk',v('mTk'));setv('nhPw',v('mPw'))}
 const truoc=new Set(Object.keys(S.st));await window.qlTaoHS({preventDefault(){}});
 const moi=Object.keys(S.st).filter(k=>!truoc.has(k));if(!moi.length)return;
 const o=O();o.hoso=o.hoso||{};moi.forEach(id=>{o.hoso[id]=Object.fromEntries(Object.entries(H).filter(([k,x])=>x));S.st[id].gender=H.gt});save();if(cloud()){try{await fbDayNgay()}catch(e){}}
 qlDong();render()};
/* ---------- Thêm giáo viên ---------- */
window.qlMoGV=function(){modal('Thêm giáo viên',`<label>Họ và tên<input id="mGvTen" maxlength="30" placeholder="Cô Nguyễn Thu Lan" required></label>
 <div class="qs2"><label>Giới tính${gtSel('mGvGt','')}</label><label>Điện thoại<input id="mGvDt" type="tel" maxlength="15" placeholder="0912345678"></label></div>
 <label>Gmail<input id="mGvMail" type="email" maxlength="60" placeholder="ten@gmail.com"></label>
 ${cloud()?`<div class="qs2"><label>Tên đăng nhập<input id="mGvTk" maxlength="24" autocapitalize="off" spellcheck="false" required></label><label>Mật khẩu<input id="mGvPw" maxlength="30" required></label></div>`:''}`,'qlLuuGV()','Thêm giáo viên')};
window.qlLuuGV=async function(){const n=v('mGvTen').replace(/\s+/g,' '),dt=v('mGvDt').replace(/[^\d+]/g,''),mail=v('mGvMail').toLowerCase();
 if(n.length<3){toast('Nhập tên giáo viên');return}if(!okDt(dt)){toast('Số điện thoại chưa đúng');return}if(!okMail(mail)){toast('Gmail chưa đúng');return}
 setv('ngTen',n);if(cloud()){setv('ngTk',v('mGvTk').toLowerCase());setv('ngPw',v('mGvPw'))}
 const truoc=O().gv.length;await window.qlTaoGV({preventDefault(){}});if(O().gv.length===truoc)return;
 Object.assign(O().gv[O().gv.length-1],{gt:v('mGvGt')||undefined,dt:dt||undefined,mail:mail||undefined});save();if(cloud()){try{await fbDayNgay()}catch(e){}}qlDong();render()};
/* ---------- Thêm lớp ---------- */
window.qlMoLop=function(){modal('Thêm lớp',`<div class="qs2"><label>Khối<select id="mKhoi">${[1,2,3,4,5].map(k=>`<option value="${k}">Khối ${k}</option>`).join('')}</select></label><label>Tên lớp<input id="mLopTen" maxlength="8" placeholder="1D" required></label></div>
 <label>Giáo viên<select id="mLopGV"><option value="">Chưa phân công</option>${O().gv.map(g=>`<option value="${g.id}">${esc(g.ten)}</option>`).join('')}</select></label>`,'qlLuuLop()','Thêm lớp')};
window.qlLuuLop=function(){setv('nlKhoi',v('mKhoi'));setv('nlTen',v('mLopTen'));setv('nlGV',v('mLopGV'));const truoc=O().lop.length;window.qlTaoLop({preventDefault(){}});if(O().lop.length>truoc){qlDong();render()}};
/* ---------- Xếp lớp: chọn nhiều em vào 1 lớp ---------- */
window.qlMoXep=function(lid){const L=LOPS();if(!L.length){toast('Chưa có lớp');return}lid=lid||L[0].id;
 const l=L.find(x=>x.id===lid),ds=STUDENTS.filter(s=>O().gd[s[0]]!==lid&&(!O().gd[s[0]]||s[2]===l.khoi)).sort((a,b)=>(O().gd[a[0]]?1:0)-(O().gd[b[0]]?1:0)||a[1].localeCompare(b[1]));
 qlDong();modal('Xếp học sinh vào lớp',`<label>Lớp<select id="mXLop" onchange="qlMoXep(this.value)">${L.map(x=>`<option value="${x.id}" ${x.id===lid?'selected':''}>Lớp ${esc(x.ten)} (khối ${x.khoi})</option>`).join('')}</select></label>
 <p class="muted" style="margin:0;font-size:12.5px">Các em chưa xếp lớp và các em khối ${l.khoi} ở lớp khác. Chọn các em cần đưa vào lớp ${esc(l.ten)}.</p>
 <div class="qlck">${ds.length?ds.map(([id,n])=>{const c=O().gd[id];return`<label class="qlckr"><input type="checkbox" value="${id}"> <b>${esc(n)}</b> <small>${c?'đang ở lớp '+esc((O().lop.find(x=>x.id===c)||{ten:c}).ten):'chưa xếp lớp'}</small></label>`}).join(''):'<p class="muted">Không còn em nào khối này ngoài lớp.</p>'}</div>`,`qlLuuXep('${lid}')`,'Đưa vào lớp')};
window.qlLuuXep=function(lid){const ids=[...document.querySelectorAll('.qlck input:checked')].map(x=>x.value);if(!ids.length){toast('Chưa chọn em nào');return}
 ids.forEach(id=>{try{window.qlChuyen(id,lid)}catch(e){}});qlDong();render();toast(`Đã xếp ${ids.length} em vào lớp ${lid}`)};
/* ---------- Tài khoản phụ huynh: 1 tài khoản – nhiều con ---------- */
const phDs=()=>{const m={};Object.entries(O().ph||{}).forEach(([con,tk])=>{(m[tk]=m[tk]||[]).push(con)});return m};
window.qlMoPH=function(tk0){const ds=phDs(),tks=Object.keys(ds).sort(),info=O().phInfo||{};
 const hs=[...STUDENTS].sort((a,b)=>a[1].localeCompare(b[1]));const cua=tk0?ds[tk0]||[]:[];
 qlDong();modal('Tài khoản phụ huynh',`<label>Phụ huynh<select id="mPhTk" onchange="qlMoPH(this.value)"><option value="">+ Tạo tài khoản phụ huynh mới</option>${tks.map(t=>`<option value="${t}" ${t===tk0?'selected':''}>${esc((info[t]||{}).ten||t)} (${t}) · ${ds[t].length} con</option>`).join('')}</select></label>
 ${tk0?'':`<div class="qs2"><label>Họ tên phụ huynh<input id="mPhTen" maxlength="40" placeholder="Nguyễn Văn Bình"></label><label>Điện thoại<input id="mPhDt" type="tel" maxlength="15"></label></div>
 <div class="qs2"><label>Tên đăng nhập<input id="mPhTk2" maxlength="24" autocapitalize="off" spellcheck="false" placeholder="ph.binh"></label><label>Mật khẩu<input id="mPhPw" maxlength="30" ${cloud()?'':'disabled placeholder="Chỉ có khi dùng máy chủ"'}></label></div>`}
 <p class="muted" style="margin:0;font-size:12.5px">Chọn các con (anh chị em cùng bố mẹ chọn chung 1 tài khoản). Phụ huynh xem được tình hình học của từng con.</p>
 <input type="search" placeholder="Tìm tên học sinh" oninput="const q=this.value.toLowerCase();document.querySelectorAll('.qlck .qlckr').forEach(r=>r.hidden=q&&!r.textContent.toLowerCase().includes(q))" style="font:inherit;padding:8px;border:0;box-shadow:var(--f2)">
 <div class="qlck">${hs.map(([id,n,g])=>{const p=(O().ph||{})[id],cua1=cua.includes(id);return`<label class="qlckr"><input type="checkbox" value="${id}" ${cua1?'checked':''} ${p&&p!==tk0?'disabled':''}> <b>${esc(n)}</b> <small>khối ${g}${p&&p!==tk0?' · đã có PH '+esc(p):''}</small></label>`}).join('')}</div>`,`qlLuuPH()`,'Lưu')};
window.qlLuuPH=async function(){const o=O();o.ph=o.ph||{};o.phInfo=o.phInfo||{};let tk=v('mPhTk');const moiTK=!tk;
 const con=[...document.querySelectorAll('.qlck input:checked:not(:disabled)')].map(x=>x.value);if(!con.length){toast('Chọn ít nhất 1 con');return}
 if(moiTK){tk=v('mPhTk2').toLowerCase();const ten=v('mPhTen').replace(/\s+/g,' '),dt=v('mPhDt').replace(/[^\d+]/g,''),pw=v('mPhPw');
  if(!/^[a-z0-9][a-z0-9._-]{2,23}$/.test(tk)){toast('Tên đăng nhập 3–24 kí tự: chữ thường không dấu, số, dấu chấm');return}
  if(Object.values(o.ph).includes(tk)||STUDENTS.some(s=>s[0]===tk)||(o.gv||[]).some(g=>(g.tk||g.id)===tk)){toast('Tên đăng nhập đã có');return}
  if(!okDt(dt)){toast('Số điện thoại chưa đúng');return}
  let pwPH=pw;if(cloud()){pwPH=fbMKTao(pw);if(fbMKLoi(pwPH,pwPH)){toast(fbMKLoi(pwPH,pwPH));return}toast('Đang tạo tài khoản…');
   try{const uid=await fbTaoTK(tk,pwPH);await FB.db.doc('users/'+uid).set({role:'ph',tk,ten:ten||('Phụ huynh '+con.map(c=>(S.st[c]||{}).name).join(', ')),con,mustChange:true});fbMKNho(tk,pwPH)}catch(e){toast(typeof fbLoi==='function'?fbLoi(e):e.message);return}}
  o.phInfo[tk]={ten,dt};}
 const truoc=Object.entries(o.ph).filter(([c,t])=>t===tk).map(([c])=>c),bo=truoc.filter(c=>!con.includes(c));
 bo.forEach(c=>delete o.ph[c]);con.forEach(c=>o.ph[c]=tk);
 if(cloud()&&!moiTK){try{const q=await FB.db.collection('users').where('tk','==',tk).get();await Promise.all(q.docs.map(d=>FB.db.doc('users/'+d.id).set({con},{merge:true})))}catch(e){toast('Máy chủ chưa nhận: '+(typeof fbLoi==='function'?fbLoi(e):e.message))}}
 nk(`Phụ huynh ${tk}: con ${con.map(c=>(S.st[c]||{}).name||c).join(', ')}`);save();if(cloud()){try{await fbDayNgay()}catch(e){}}qlDong();render();toast(moiTK&&cloud()?`Đã tạo tài khoản ${tk}. Mật khẩu tạm trên phiếu in.`:'Đã lưu')};
/* ---------- gắn nút vào trang Quản lý ---------- */
function phCard(){const ds=phDs(),info=O().phInfo||{},tks=Object.keys(ds).sort();
 return`<section class="card qlphcard"><div class="qlhead"><h2>Phụ huynh</h2><button type="button" class="btn sm pri" onclick="qlMoPH('')">👪 Tài khoản phụ huynh</button></div>
 <p class="muted" style="margin:4px 0 0">Một tài khoản phụ huynh gắn được nhiều con (anh chị em cùng bố mẹ).</p>
 ${tks.length?tks.map(t=>`<div class="task"><b>${esc((info[t]||{}).ten||t)}</b> <span class="muted">· ${esc(t)}${(info[t]||{}).dt?' · '+esc(info[t].dt):''}</span> <button type="button" class="btn sm" onclick="qlMoPH('${t}')">Sửa con</button><div class="row" style="gap:6px;margin-top:6px">${ds[t].map(c=>`<span class="pill">${esc((S.st[c]||{}).name||c)}</span>`).join('')}</div></div>`).join(''):'<p class="muted">Chưa có tài khoản phụ huynh.</p>'}</section>`}
{const _p=viewPH;viewPH=function(){let r=_p.apply(this,arguments);if(role!=='ql')return r;try{
 r=r.replace('<h2>Lớp học</h2>','<div class="qlhead"><h2>Lớp học</h2><span><button type="button" class="btn sm pri" onclick="qlMoLop()">+ Thêm lớp</button> <button type="button" class="btn sm" onclick="qlMoXep()">⇄ Xếp lớp</button></span></div>')
  .replace(/(<div class="row" style="justify-content:space-between"><h2>Học sinh<\/h2>)/,'<div class="qlhead" style="margin-bottom:8px"><span></span><span><button type="button" class="btn sm pri" onclick="qlMoHS()">+ Thêm học sinh</button> <button type="button" class="btn sm" onclick="qlMoXep()">⇄ Xếp lớp</button></span></div>$1')
  .replace('<h2>Giáo viên</h2>','<div class="qlhead"><h2>Giáo viên</h2><button type="button" class="btn sm pri" onclick="qlMoGV()">+ Thêm giáo viên</button></div>')
  .replace(/(<select aria-label="Lớp của [^"]*" onchange="qlChuyen\('([a-z0-9._-]+)',this\.value\)">[\s\S]*?<\/select>)/g,(m,s,id)=>O().gd[id]?`${s} <button type="button" class="btn sm qlbo" onclick="qlChuyen('${id}','')">Bỏ khỏi lớp</button>`:m)
  .replace(/(<div class="grid gpair">\s*<section class="card"><div class="qlhead"><h2>Giáo viên)/,phCard()+'$1')
  .replace(/(<section class="card"><h2>Giáo viên<\/h2>)/,'$1')}catch(e){console.error(e)}return r}}
document.head.insertAdjacentHTML('beforeend',`<style>
form[onsubmit="qlTaoHS(event)"],form[onsubmit="qlTaoGV(event)"],form[onsubmit="qlTaoLop(event)"],form[onsubmit="qlTaoPH(event)"]{display:none!important}
.qlhead{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}.qlhead h2{margin:0}
.qsform label{min-width:0;justify-content:flex-end}.qsform .qs2,.qsform .qs3{align-items:end}.qsform input,.qsform select{height:42px;line-height:normal}.qsform input[type=checkbox]{height:auto}.qsform input,.qsform select{width:100%;box-sizing:border-box;min-width:0}.qs2,.qs3{grid-template-columns:repeat(var(--c,2),minmax(0,1fr))!important}.qs3{--c:3}
.qlmbox{max-width:520px;max-height:92vh;overflow:auto}.qlck{display:flex;flex-direction:column;gap:2px;max-height:300px;overflow:auto;padding:6px;box-shadow:var(--f2);background:#fff}
.qlckr{flex-direction:row!important;align-items:center;gap:8px!important;font-weight:400!important;font-size:14px!important;padding:4px 2px}.qlckr input{box-shadow:none!important;padding:0!important;width:18px;height:18px}.qlckr small{color:#3D4A70;font-weight:400}
.qlbo{padding:2px 8px!important;font-size:12px!important;margin-top:4px}.qlphcard{margin:0 0 16px}
</style>`);
})();
