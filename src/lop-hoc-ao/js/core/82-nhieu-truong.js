/* 82 — Nhiều trường (thầy chốt 09/11/2026, xem LUAT-DA-CHOT mục 6k)
   - Tên đăng nhập luôn dạng "mã trường.tên" (nguyendu.an). Khi tạo tài khoản, app tự thêm tiền tố; người tạo chỉ gõ phần sau.
   - Admin Clb (vai qt) quản lý mọi trường: tạo trường + quản lý trường, sửa tên, khoá/mở, vào từng trường, tìm tài khoản mọi trường.
   - Giáo viên tạo được tài khoản học sinh cho lớp mình (nút "+ Thêm học sinh" ở trang lớp).
   - Máy chủ: kho mỗi trường ở truong/{mã}; 62-may-chu.js tự đổi "org/main" thành kho của trường đang dùng. */
function maTruong(){try{if(typeof CLOUD!=='undefined'&&CLOUD&&CLOUD.truong)return CLOUD.truong;if(typeof S!=='undefined'&&S&&S.org&&S.org.ma)return S.org.ma}catch(e){}return 'jenny'}
function tkTr(x){x=String(x||'').trim().toLowerCase().replace(/\s+/g,'');if(!x)return'';const m=maTruong();return x.startsWith(m+'.')?x:m+'.'+x}
function tkBo(x){x=String(x||'');const m=maTruong();return x.startsWith(m+'.')?x.slice(m.length+1):x}
const MA_TRUONG_OK=m=>/^[a-z][a-z0-9]{2,9}$/.test(m);
(function(){
if(typeof ORG_ON==='undefined'||!ORG_ON)return;
const e=s=>typeof esc==='function'?esc(s):String(s);
{const _l=fbLoi;fbLoi=function(x){const c=(x&&x.code)||'';if(c==='truong-khoa')return'Trường của bạn đang tạm khoá. Hãy liên hệ Clb Học Toán cùng Jenny.';if(c==='no-profile')return'Tài khoản chưa có hồ sơ trên máy chủ. Hãy báo quản lý trường.';return _l.apply(this,arguments)}}

/* ---------- ô tên đăng nhập: hiện sẵn tiền tố mã trường ---------- */
function ganTT(id,sua){const i=document.getElementById(id);if(!i||i.dataset.tt)return;const m=maTruong();
  if(sua){if(!i.value.startsWith(m+'.'))return;i.value=tkBo(i.value)}
  i.dataset.tt=m;const w=document.createElement('span');w.className='ttbox';i.parentNode.insertBefore(w,i);
  const t=document.createElement('span');t.className='tt';t.textContent=m+'.';w.appendChild(t);w.appendChild(i);
  i.maxLength=30;if(!sua&&i.placeholder==='ph.binh')i.placeholder='ph.binh'}
const sau=(fn,ids,sua)=>{const _f=window[fn];if(typeof _f!=='function')return;window[fn]=function(){const r=_f.apply(this,arguments);try{ids.forEach(id=>ganTT(id,sua))}catch(x){}return r}};
sau('qlMoHS',['mTk']);sau('qlMoGV',['mGvTk']);sau('qlMoPH',['mPhTk2']);sau('qlSua',['qsTk'],true);
{const _s=window.qlLuu;if(_s)window.qlLuu=function(ev,a){const i=document.getElementById('qsTk');if(i&&i.dataset.tt)i.value=tkTr(i.value);return _s.apply(this,arguments)}}

/* ---------- giáo viên tạo tài khoản học sinh cho lớp mình ---------- */
window.gvMoHS=function(){if(!gvLop){toast('Chọn lớp trước');return}
  if(!document.getElementById('nhTen')){const d=document.createElement('div');d.id='gvAn';d.hidden=true;d.innerHTML=['nhTen','nhLop','nhGt','nhTk','nhPw'].map(i=>`<input id="${i}">`).join('');document.body.appendChild(d)}
  window.qlMoHS();const h=document.querySelector('#qlm .gdhd b');if(h)h.textContent='Thêm học sinh vào lớp '+((lopById(gvLop)||{}).ten||gvLop)};
{const _l=window.qlLuuHS;if(_l)window.qlLuuHS=async function(){const gv=role==='gv'&&gvLop;window.HS_LOP_MOI=gv?gvLop:'';try{return await _l.apply(this,arguments)}finally{window.HS_LOP_MOI='';if(gv){try{if(CLOUD)fbDanhSach()}catch(x){}render()}}}}
{const _h=gvHead;gvHead=function(){let r=_h.apply(this,arguments);try{if(role==='gv'&&gvLop)r=r.replace('← Lớp của tôi</button>','← Lớp của tôi</button> <button class="btn sm pri" onclick="gvMoHS()">+ Thêm học sinh</button>')}catch(x){}return r}}

/* ---------- thanh trên: trường đang dùng; admin Clb có nút "Các trường" ---------- */
{const _h=header;header=function(){const r=_h.apply(this,arguments);try{if(typeof CLOUD==='undefined'||!CLOUD||CLOUD.me.role==='hs')return r;const b=document.getElementById('fbMe');if(!b)return r;
  if(CLOUD.qt&&window.TRANG==='ql'){if(!document.getElementById('fbTr'))b.insertAdjacentHTML('afterbegin','<span id="fbTr"></span>');return r} /* admin Clb: 84-admin-clb.js vẽ phần này */
  let x=document.getElementById('fbTr');if(!x){b.insertAdjacentHTML('afterbegin','<span id="fbTr"></span>');x=document.getElementById('fbTr')}
  const ten=(S.org&&S.org.ten)||'';const h=`<span class="pill" title="Mã trường: ${e(CLOUD.truong)}">🏫 ${e(ten||CLOUD.truong)} · <b>${e(CLOUD.truong)}</b></span>${CLOUD.qt?' <button type="button" class="btn sm pri" onclick="qtMo()">Các trường</button>':''}`;
  if(x.innerHTML!==h)x.innerHTML=h}catch(x){}return r}}

/* ---------- admin Clb: quản lý các trường ---------- */
let QT={ds:[],us:[],tim:'',dang:false,cu:false,mo:''};window.QT_=QT;
const raw=()=>FB.raw;
const vai={qt:'Admin Clb',ql:'Quản lý trường',gv:'Giáo viên',hs:'Học sinh',ph:'Phụ huynh'};
function orgMoi(ma,ten,gvTk,gvTen){return{ten,nam:'2026–2027',gv:gvTk?[{id:gvTk,ten:gvTen,tk:gvTk}]:[],lop:[],gd:{},nl:{},nk:[],mo:{},hs:[],ph:{},v:2,cloud:1,ma,mauHS4:1,mauHS5:1,mauHS6:1,mauHS7:1,mauHS3:1,mauHS2:1,mauHS:1}}
async function qtNap(){QT.dang=true;qtVe();try{const [t,u]=await Promise.all([raw().collection('truong').get(),raw().collection('users').get()]);
  QT.ds=t.docs.map(d=>Object.assign({ma:d.id},d.data())).sort((a,b)=>a.ma==='jenny'?-1:b.ma==='jenny'?1:a.ma.localeCompare(b.ma));
  QT.us=u.docs.map(d=>Object.assign({uid:d.id},d.data()));
  try{const o=await raw().doc('org/main').get();QT.cu=o.exists&&!(o.data()||{}).daChuyen}catch(x){QT.cu=false}}catch(x){console.error(x);toast('Chưa tải được danh sách trường: '+fbLoi(x))}QT.dang=false;qtVe();try{if(window.qaSauNap)window.qaSauNap()}catch(x){console.error(x)}}
function dem(ma,r){return QT.us.filter(u=>(u.truong||'jenny')===ma&&u.role===r).length}
function qtVe(){const el=document.getElementById('qtm');if(!el)return;const q=QT.tim.trim().toLowerCase();
  const timDs=q?QT.us.filter(u=>(u.tk||'').includes(q)||String(u.ten||'').toLowerCase().includes(q)).slice(0,30):[];
  el.querySelector('.qtbody').innerHTML=`
   ${QT.cu?`<div class="task" style="border-left:4px solid var(--sun,#FCB40C)"><b>Có dữ liệu cũ (trước khi chia trường).</b> Bấm để chuyển thành trường <b>jenny</b>. Tên đăng nhập cũ giữ nguyên. <button type="button" class="btn sm pri" onclick="qtChuyenCu()">Chuyển dữ liệu cũ</button></div>`:''}
   <div class="qlhead"><b>${QT.ds.length} trường</b><button type="button" class="btn sm pri" onclick="qtFormTruong()">+ Thêm trường</button></div>
   ${QT.dang?'<p class="muted">Đang tải…</p>':''}
   <div class="tablewrap"><table class="qttb qtds"><tr><th>Mã</th><th>Tên trường</th><th>QL</th><th>GV</th><th>HS</th><th>Trạng thái</th><th></th></tr>
   ${QT.ds.map(t=>`<tr${t.ma===CLOUD.truong?' class="qton"':''}><td><code>${e(t.ma)}</code></td><td><b>${e(t.ten||t.ma)}</b>${t.ma===CLOUD.truong?' <span class="pill">đang xem</span>':''}</td><td>${dem(t.ma,'ql')+(t.ma==='jenny'?dem(t.ma,'qt'):0)}</td><td>${dem(t.ma,'gv')}</td><td>${dem(t.ma,'hs')}</td>
     <td class="qttt">${t.khoa?'<span class="pill qlwarn">🔒 Đang khoá</span>':'<span class="pill">Đang dùng</span>'}</td>
     <td class="qtnut"><button type="button" class="btn sm pri" onclick="qtVao('${t.ma}')">Vào trường</button> <button type="button" class="btn sm" onclick="qtFormQL('${t.ma}')">+ Quản lý</button> <button type="button" class="btn sm" onclick="qtSua('${t.ma}')">✎ Tên</button> <button type="button" class="btn sm" onclick="qtThu('${t.ma}')">🧪 Dữ liệu thử</button>${t.ma==='jenny'?'':` <button type="button" class="btn sm" onclick="qtKhoa('${t.ma}')">${t.khoa?'Mở khoá':'Khoá'}</button>`}</td></tr>`).join('')}</table></div>
   <div style="margin-top:12px"><label class="muted" for="qtTim" style="font-size:13px">Tìm tài khoản ở mọi trường (tên đăng nhập hoặc họ tên)</label>
   <input id="qtTim" type="search" value="${e(QT.tim)}" placeholder="vd. nguyendu.an" oninput="QT_tim(this.value)" style="width:100%;box-sizing:border-box;font:inherit;padding:8px;margin-top:4px"></div>
   ${q?`<div class="tablewrap" style="margin-top:6px"><table class="qttb"><tr><th>Tên đăng nhập</th><th>Họ tên</th><th>Vai trò</th><th>Trường</th><th></th></tr>${timDs.map(u=>`<tr><td><code>${e(u.tk)}</code></td><td>${e(u.ten||'')}</td><td>${vai[u.role]||u.role}</td><td>${e(u.truong||'jenny')}</td><td><button type="button" class="btn sm" onclick="qtVao('${e(u.truong||'jenny')}')">Vào trường</button></td></tr>`).join('')||'<tr><td colspan="5" class="muted">Không thấy tài khoản nào.</td></tr>'}</table></div>`:''}
   <p class="muted" style="font-size:12.5px;margin:10px 0 0">"Vào trường" mở trường đó như quản lý trường: xem, thêm, sửa lớp, giáo viên, học sinh, phụ huynh.</p>`;
  const i=document.getElementById('qtTim');if(i&&QT.timFocus){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}
window.QT_tim=v=>{QT.tim=v;QT.timFocus=1;qtVe();QT.timFocus=0};
window.qtMo=function(){try{qtMo0()}catch(x){console.error(x);toast('Chưa mở được bảng Các trường: '+(x&&x.message||x))}};
function qtMo0(){if(!CLOUD||!CLOUD.qt){toast('Chỉ admin Clb mới mở được bảng này');return}const old=document.getElementById('qtm');if(old)old.remove();const el=document.createElement('div');el.className='gdov qtov';el.id='qtm';
  el.innerHTML=`<div class="gdbox qsbox qlmbox qtbox"><div class="gdhd"><b>Các trường · Admin Clb</b><button type="button" class="gdx" onclick="document.getElementById('qtm').remove()">Đóng ✕</button></div><div class="qtbody"></div></div>`;
  document.body.appendChild(el);qtNap()}
window.qtVao=function(ma){try{localStorage.setItem('jennyQT_truong',ma)}catch(x){}if(ma===CLOUD.truong){const m=document.getElementById('qtm');if(m)m.remove();return}toast('Đang mở trường '+ma+'…');setTimeout(()=>location.reload(),150)};
/* bảng nhập nhỏ dùng chung */
function hop(t,body,ok,okText){const el=document.createElement('div');el.className='gdov qtov';el.id='qtf';
  el.innerHTML=`<div class="gdbox qsbox qlmbox"><div class="gdhd"><b>${t}</b><button type="button" class="gdx" onclick="document.getElementById('qtf').remove()">Đóng ✕</button></div><form class="qsform" onsubmit="event.preventDefault();${ok}">${body}<p id="qtMsg" class="muted" style="margin:0;color:var(--coral)"></p><div class="qsbtn"><span style="flex:1"></span><button class="btn pri" type="submit">${okText}</button></div></form></div>`;
  document.body.appendChild(el);setTimeout(()=>{const i=el.querySelector('input');if(i)i.focus()},30)}
const val=i=>((document.getElementById(i)||{}).value||'').trim();
const bao=t=>{const m=document.getElementById('qtMsg');if(m)m.textContent=t};
const dongF=()=>{const f=document.getElementById('qtf');if(f)f.remove()};
const oQL=ma=>`<div class="qs2"><label>Họ tên quản lý trường<input id="qfQlTen" maxlength="40" required placeholder="Cô Nguyễn Thu Lan"></label><label>Tên đăng nhập<span class="ttbox"><span class="tt" id="qfTT">${e(ma||'mã')}.</span><input id="qfQlTk" maxlength="30" autocapitalize="off" spellcheck="false" required placeholder="quanly"></span></label></div>
  <label>Mật khẩu (ít nhất 6 kí tự)<input id="qfQlPw" maxlength="40" required value="${'jenny'+String(Math.floor(1000+Math.random()*9000))}"></label>`;
window.qtFormTruong=function(){hop('Thêm trường',`<div class="qs2"><label>Mã trường<input id="qfMa" maxlength="10" autocapitalize="off" spellcheck="false" required placeholder="nguyendu" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'');document.getElementById('qfTT').textContent=(this.value||'mã')+'.'"></label><label>Tên trường<input id="qfTen" maxlength="60" required placeholder="Trường Tiểu học Nguyễn Du"></label></div>
  <p class="muted" style="margin:0;font-size:12.5px">Mã trường 3–10 kí tự: chữ thường không dấu và số, bắt đầu bằng chữ. Mã là tiền tố của mọi tên đăng nhập trong trường (vd. <code>nguyendu.an</code>) và <b>không đổi được</b> về sau.</p>${oQL('')}`,'qtTaoTruong()','Tạo trường')};
async function taoQL(ma,ten,tk,pw,org){const uid=await fbTaoTK(tk,pw);await raw().doc('users/'+uid).set({role:'ql',tk,ten,gvId:tk,truong:ma});return uid}
window.qtTaoTruong=async function(){const ma=val('qfMa').toLowerCase(),ten=val('qfTen').replace(/\s+/g,' '),qn=val('qfQlTen').replace(/\s+/g,' '),pw=val('qfQlPw');
  if(!MA_TRUONG_OK(ma)){bao('Mã trường chưa đúng: 3–10 kí tự, chữ thường không dấu và số, bắt đầu bằng chữ.');return}
  if(ten.length<3){bao('Nhập tên trường');return}if(qn.length<3){bao('Nhập họ tên quản lý trường');return}
  const tk=ma+'.'+val('qfQlTk').toLowerCase().replace(/^.*\./,'');if(!fbTkOk(tk)||tk===ma+'.'){bao('Tên đăng nhập: chữ thường không dấu, số');return}if(pw.length<6){bao('Mật khẩu cần ít nhất 6 kí tự');return}
  const nut=document.querySelector('#qtf button[type=submit]');if(nut){nut.disabled=true;nut.textContent='Đang tạo…'}
  try{const d=await raw().doc('truong/'+ma).get();if(d.exists){bao('Đã có trường mã "'+ma+'". Chọn mã khác.');if(nut){nut.disabled=false;nut.textContent='Tạo trường'}return}
    const org=orgMoi(ma,ten,tk,qn);org.nk.push({d:fbNgay(),ai:'Admin Clb',t:`Tạo trường ${ten} (${ma}), quản lý ${qn} (${tk})`});
    await raw().doc('truong/'+ma).set({ma,ten,j:JSON.stringify(org),gd:{},pc:{},khoa:false,t:fbTS()});
    await taoQL(ma,qn,tk,pw);dongF();QT.moi={tk,pw};toast(`Đã tạo trường ${ma}. Quản lý: ${tk} / ${pw}`);await qtNap();qtMoi()}
  catch(x){console.error(x);bao(fbLoi(x));if(nut){nut.disabled=false;nut.textContent='Tạo trường'}}};
function qtMoi(){if(!QT.moi)return;const b=document.querySelector('#qtm .qtbody')||document.getElementById('qaBao');if(b)b.insertAdjacentHTML('afterbegin',`<div class="task" style="border-left:4px solid var(--leaf,#2E9E4F)"><b>Vừa tạo:</b> <code>${e(QT.moi.tk)}</code> / <code>${e(QT.moi.pw)}</code> <span class="muted">· ghi lại rồi gửi cho quản lý trường</span></div>`);QT.moi=null}
window.qtFormQL=function(ma){hop('Thêm quản lý cho trường '+ma,oQL(ma),`qtTaoQL('${ma}')`,'Tạo tài khoản')};
window.qtTaoQL=async function(ma){const qn=val('qfQlTen').replace(/\s+/g,' '),pw=val('qfQlPw'),tk=ma+'.'+val('qfQlTk').toLowerCase().replace(/^.*\./,'');
  if(qn.length<3){bao('Nhập họ tên');return}if(!fbTkOk(tk)||tk===ma+'.'){bao('Tên đăng nhập: chữ thường không dấu, số');return}if(pw.length<6){bao('Mật khẩu cần ít nhất 6 kí tự');return}
  if(QT.us.some(u=>u.tk===tk)){bao('Tên đăng nhập này đã có');return}
  try{const ref=raw().doc('truong/'+ma),d=await ref.get();const o=fbJ((d.data()||{}).j)||orgMoi(ma,ma);
    await taoQL(ma,qn,tk,pw);(o.gv=o.gv||[]).push({id:tk,ten:qn,tk});(o.nk=o.nk||[]).push({d:fbNgay(),ai:'Admin Clb',t:`Tạo tài khoản quản lý ${qn} (${tk})`});
    await ref.update({j:JSON.stringify(o),t:fbTS()});dongF();QT.moi={tk,pw};await qtNap();qtMoi()}catch(x){console.error(x);bao(fbLoi(x))}};
window.qtSua=function(ma){const t=QT.ds.find(x=>x.ma===ma)||{};hop('Đổi tên trường '+ma,`<label>Tên trường<input id="qfTen2" maxlength="60" value="${e(t.ten||'')}" required></label><p class="muted" style="margin:0;font-size:12.5px">Mã trường <code>${e(ma)}</code> không đổi.</p>`,`qtLuuTen('${ma}')`,'Lưu')};
window.qtLuuTen=async function(ma){const ten=val('qfTen2').replace(/\s+/g,' ');if(ten.length<3){bao('Nhập tên trường');return}
  try{const ref=raw().doc('truong/'+ma),d=await ref.get(),o=fbJ((d.data()||{}).j)||{};o.ten=ten;await ref.update({ten,j:JSON.stringify(o),t:fbTS()});dongF();await qtNap()}catch(x){bao(fbLoi(x))}};
window.qtKhoa=async function(ma){const t=QT.ds.find(x=>x.ma===ma);if(!t)return;
  if(!confirm(t.khoa?`Mở khoá trường ${t.ten||ma}? Giáo viên, học sinh, phụ huynh của trường đăng nhập lại được.`:`Khoá trường ${t.ten||ma}? Mọi tài khoản của trường sẽ không đăng nhập được (dữ liệu vẫn giữ).`))return;
  try{await raw().doc('truong/'+ma).update({khoa:!t.khoa,t:fbTS()});await qtNap();toast(t.khoa?'Đã mở khoá':'Đã khoá trường')}catch(x){toast(fbLoi(x))}};
/* dữ liệu thử cho một trường (thầy yêu cầu 12/11/2026): 2 lớp, 2 giáo viên, mỗi lớp 5 học sinh; mật khẩu jenny123 */
const TEN_THU=[['Nguyễn Minh','An','nam'],['Trần Thu','Hà','nu'],['Lê Gia','Bảo','nam'],['Phạm Ngọc','Chi','nu'],['Hoàng Đức','Duy','nam'],['Vũ Khánh','Linh','nu'],['Đỗ Quang','Huy','nam'],['Bùi Thảo','My','nu'],['Đặng Tuấn','Kiệt','nam'],['Ngô Bảo','Ngọc','nu']];
window.qtThu=async function(ma){const t=QT.ds.find(x=>x.ma===ma);if(!t)return;
  if(!confirm(`Tạo dữ liệu thử cho trường ${t.ten||ma}?\n• 2 lớp, 2 giáo viên, mỗi lớp 5 học sinh\n• Tên đăng nhập ${ma}.gvthu1, ${ma}.hsthu01…, mật khẩu jenny123`))return;
  const MK='jenny123',kq=[];toast('Đang tạo dữ liệu thử… (khoảng 1 phút, đừng đóng trang)');
  try{const ref=raw().doc('truong/'+ma),d=await ref.get(),o=fbJ((d.data()||{}).j)||orgMoi(ma,t.ten||ma);['lop','gv','hs'].forEach(k=>o[k]=o[k]||[]);['gd','mo','hoso'].forEach(k=>o[k]=o[k]||{});o.nk=o.nk||[];
    const co=new Set(QT.us.map(u=>u.tk));const tkMoi=b=>{let x=ma+'.'+b,i=2;while(co.has(x))x=ma+'.'+b+(i++);co.add(x);return x};
    const lopMoi=(khoi)=>{let n=khoi+'T',i=2;while(o.lop.some(l=>l.id===n))n=khoi+'T'+(i++);return n};
    const LOP=[{khoi:1},{khoi:2}].map((x,i)=>{const id=lopMoi(x.khoi);return{id,khoi:x.khoi,ten:id,gv:[],tj:{on:false}}});
    for(let i=0;i<2;i++){const tk=tkMoi('gvthu'+(i+1)),ten=i?'Thầy Thử Hai':'Cô Thử Một';const uid=await fbTaoTK(tk,MK);
      await raw().doc('users/'+uid).set({role:'gv',tk,ten,gvId:tk,truong:ma});o.gv.push({id:tk,ten,tk,gt:i?'nam':'nu'});LOP[i].gv.push(tk);kq.push(['Giáo viên',ten,tk,'Lớp '+LOP[i].ten])}
    LOP.forEach(l=>{o.lop.push(l);o.mo[l.id]={}});
    let k=0;for(const l of LOP)for(let j=0;j<5;j++){const [ho,ten,gt]=TEN_THU[k++],n=ho+' '+ten,tk=tkMoi('hsthu'+String(k).padStart(2,'0'));
      const uid=await fbTaoTK(tk,MK),st=newStudent(n,l.khoi);st.gender=gt;
      await raw().doc('users/'+uid).set({role:'hs',tk,ten:n,khoi:l.khoi,truong:ma});
      await raw().doc('hs/'+tk).set({j:JSON.stringify(fbTach(st).hs),ev:'[]',lop:l.id,truong:ma,t:fbTS()});
      o.hs.push([tk,n,l.khoi]);o.gd[tk]=l.id;o.hoso[tk]={gt};kq.push(['Học sinh',n,tk,'Lớp '+l.ten])}
    o.nk.push({d:fbNgay(),ai:'Admin Clb',t:`Tạo dữ liệu thử: lớp ${LOP.map(l=>l.ten).join(', ')}, 2 giáo viên, 10 học sinh`});
    await ref.set({j:JSON.stringify(o),gd:o.gd,pc:fbPc(o),t:fbTS()},{merge:true});try{await fbGhiTo(ma,fbJ((d.data()||{}).j||'null'),o)}catch(x){console.error(x)}
    QT.thu={ma,kq};await qtNap();qtThuKq()}
  catch(x){console.error(x);toast('Chưa tạo xong: '+fbLoi(x)+(kq.length?` (đã tạo ${kq.length} tài khoản)`:''))}};
function qtThuKq(){const r=QT.thu;if(!r)return;const b=document.querySelector('#qtm .qtbody')||document.getElementById('qaBao');if(!b)return;
  b.insertAdjacentHTML('afterbegin',`<div class="task" style="border-left:4px solid var(--leaf,#2E9E4F)"><b>Đã tạo dữ liệu thử cho trường ${e(r.ma)}</b> · mật khẩu chung <code>jenny123</code>${r.ma===CLOUD.truong?' · <button type="button" class="btn sm" onclick="location.reload()">Tải lại để xem</button>':''}
   <div class="tablewrap" style="margin-top:6px"><table class="qttb"><tr><th>Vai trò</th><th>Họ tên</th><th>Tên đăng nhập</th><th>Lớp</th></tr>${r.kq.map(x=>`<tr><td>${x[0]}</td><td>${e(x[1])}</td><td><code>${e(x[2])}</code></td><td>${e(x[3])}</td></tr>`).join('')}</table></div></div>`);QT.thu=null}
/* dữ liệu cũ org/main → trường jenny (giữ tên đăng nhập cũ) */
window.qtChuyenCu=async function(){if(!confirm('Chuyển dữ liệu cũ thành trường "jenny"? Làm một lần.'))return;toast('Đang chuyển…');
  try{const o=await raw().doc('org/main').get();if(!o.exists){toast('Không có dữ liệu cũ');return}const d=o.data(),org=fbJ(d.j)||{};org.ma='jenny';
    const tj=await raw().doc('truong/jenny').get(),cu=tj.exists?fbJ(tj.data().j)||{}:null;
    if(cu&&(cu.hs||[]).length&&!confirm('Trường jenny đã có học sinh. Ghi đè bằng dữ liệu cũ?'))return;
    if(cu)(cu.gv||[]).forEach(g=>{if(!(org.gv||[]).some(x=>(x.tk||x.id)===(g.tk||g.id)))(org.gv=org.gv||[]).push(g)});
    await raw().doc('truong/jenny').set({ma:'jenny',ten:org.ten||'Clb Học Toán cùng Jenny',j:JSON.stringify(org),gd:d.gd||{},pc:d.pc||{},khoa:false,t:fbTS()});
    let n=0;for(const c of ['users','hs','hsgv','asg','login']){const q=await raw().collection(c).get();const can=q.docs.filter(x=>!x.data().truong);n+=can.length;await Promise.all(can.map(x=>raw().doc(c+'/'+x.id).set({truong:'jenny'},{merge:true})))}
    await raw().doc('org/main').set({daChuyen:true},{merge:true});toast(`Đã chuyển xong (${n} mục). Đang mở lại…`);try{localStorage.setItem('jennyQT_truong','jenny')}catch(x){}setTimeout(()=>location.reload(),800)}
  catch(x){console.error(x);toast('Chưa chuyển được: '+fbLoi(x))}};
/* trường chưa có dữ liệu trên máy chủ (vd. còn dữ liệu cũ chưa chuyển): không để trang hỏng */
const trong=()=>typeof CLOUD!=='undefined'&&CLOUD&&CLOUD.me&&CLOUD.me.role!=='hs'&&!S.org;
function trangTrong(){const ma=e(CLOUD.truong);if(!CLOUD.qt)return`<section class="card"><h2>Trường chưa có dữ liệu</h2><p class="muted">Trường <b>${ma}</b> chưa có dữ liệu trên máy chủ hoặc đang được chuẩn bị. Hãy báo admin Clb.</p></section>`;
  if(QT.cuChk===undefined){QT.cuChk=null;raw().doc('org/main').get().then(d=>{QT.cuChk=d.exists&&!(d.data()||{}).daChuyen;render()}).catch(()=>{QT.cuChk=false;render()})}
  return`<section class="card"><h2>Trường ${ma} chưa có dữ liệu</h2>
   ${QT.cuChk?`<p>Máy chủ còn <b>dữ liệu cũ</b> (trước khi chia trường). Bấm để chuyển thành trường <b>jenny</b>, tên đăng nhập cũ giữ nguyên.</p><p><button type="button" class="btn pri" onclick="qtChuyenCu()">Chuyển dữ liệu cũ</button></p>`:QT.cuChk===null?'<p class="muted">Đang kiểm tra…</p>':`<p class="muted">Trường này chưa có dữ liệu.</p>${CLOUD.truong==='jenny'?'<p><button type="button" class="btn pri" onclick="qtTaoJenny()">Tạo trường jenny (trống)</button></p>':''}`}
   <p><button type="button" class="btn" onclick="qtMo()">Các trường</button></p></section>`}
window.qtTaoJenny=async function(){try{const me=CLOUD.goc||CLOUD.me,o=orgMoi('jenny','Clb Học Toán cùng Jenny',me.tk,me.ten||me.tk);await raw().doc('truong/jenny').set({ma:'jenny',ten:o.ten,j:JSON.stringify(o),gd:{},pc:{},khoa:false,t:fbTS()});toast('Đã tạo trường jenny. Đang mở lại…');setTimeout(()=>location.reload(),600)}catch(x){toast(fbLoi(x))}};
{const _p=viewPH;viewPH=function(){if(trong())return trangTrong();return _p.apply(this,arguments)}}
{const _g=viewGV;viewGV=function(){if(trong())return trangTrong();return _g.apply(this,arguments)}}
document.head.insertAdjacentHTML('beforeend',`<style>
.qtov{z-index:100000!important}
.ttbox{display:flex;align-items:stretch;min-width:0}.ttbox .tt{display:flex;align-items:center;padding:0 6px 0 8px;background:#EEF2FA;color:#3D4A70;font-weight:600;white-space:nowrap;border-radius:4px 0 0 4px;font-size:14px}.ttbox input{flex:1;min-width:0}
.qtbox{width:min(920px,96vw)!important;max-width:none!important}.qtbody{padding:12px 16px 16px;display:flex;flex-direction:column;gap:8px;overflow:auto}.qttb td,.qttb th{padding:6px 8px;vertical-align:middle}.qttb tr.qton td{background:#EAF6FD}.qtnut{white-space:nowrap}.qttt .pill{white-space:nowrap}
@media(max-width:620px){.qttb tr:first-child{display:none}.qttb,.qttb tbody,.qttb tr{display:block;width:auto}.qttb tr{border:1px solid #DDE3F0;border-radius:8px;padding:8px;margin-bottom:8px}
.qttb td{display:inline-block;padding:2px 6px 2px 0;border:0!important}.qttb td.qtnut{display:flex;flex-wrap:wrap;gap:4px;white-space:normal;padding-top:6px}.qttb td.qtnut .btn{margin:0}
.qttb.qtds td:nth-child(3)::before{content:'QL '}.qttb.qtds td:nth-child(4)::before{content:'· GV '}.qttb.qtds td:nth-child(5)::before{content:'· HS '}.qttb.qtds td:nth-child(3),.qttb.qtds td:nth-child(4),.qttb.qtds td:nth-child(5){color:#3D4A70;font-size:13px}}
#fbTr{display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap}
</style>`);
})();
