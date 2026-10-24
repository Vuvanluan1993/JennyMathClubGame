/* 70 — Quản lý sửa tài khoản học sinh (thầy chốt 24/10/2026): Họ tên · Tên đăng nhập · Mật khẩu
   + Hồ sơ: Giới tính · Ngày sinh · Năm sinh · Điện thoại phụ huynh · Gmail phụ huynh (lưu S.org.hoso[tên đăng nhập], quản lý sửa).
   Không sửa khối, xu, sao, đồ, tiến độ… (đã bỏ ô "Tên của em" ở trang đăng nhập nên tên do quản lý nhập).
   Bản có máy chủ: đổi tên đăng nhập = chuyển hồ sơ hs/, hsgv/, login/, tài khoản users/ và lớp sang tên mới (dữ liệu học giữ nguyên);
   đổi mật khẩu = tạo đăng nhập mới cho cùng tên (như "Đặt lại mật khẩu"). Bản demo (không máy chủ): chỉ đổi tên và tên đăng nhập trên máy này. */
(function(){
if(typeof ORG_ON==='undefined'||!ORG_ON)return;
const cloud=()=>!!(S.org&&S.org.cloud&&typeof FB!=='undefined'&&FB&&FB.db);
const tkOk=tk=>/^[a-z0-9][a-z0-9._-]{2,23}$/.test(tk);
const hoSo=id=>{const o=S.org;o.hoso=o.hoso||{};return o.hoso[id]||{}};
const nk=t=>{try{(S.org.nk=S.org.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t});if(S.org.nk.length>200)S.org.nk.shift()}catch(e){}};
window.qlSua=function(id){const st=S.st[id];if(!st)return;const H=hoSo(id);const el=document.createElement('div');el.className='gdov';el.id='qlsua';
 el.innerHTML=`<div class="gdbox qsbox"><div class="gdhd"><b>Sửa tài khoản học sinh</b><button type="button" class="gdx" onclick="document.getElementById('qlsua').remove()">Đóng ✕</button></div>
 <form class="qsform" onsubmit="qlLuu(event,'${id}')">
  <label>Họ và tên<input id="qsTen" value="${esc(st.name)}" maxlength="40" required></label>
  <label>Tên đăng nhập<input id="qsTk" value="${esc(id)}" maxlength="24" autocapitalize="off" spellcheck="false" required></label>
  <div class="qs2"><label>Giới tính<select id="qsGt"><option value="">—</option><option value="nu" ${H.gt==='nu'?'selected':''}>Nữ</option><option value="nam" ${H.gt==='nam'?'selected':''}>Nam</option></select></label><label>Năm sinh<input id="qsNam" type="number" min="2010" max="2025" value="${H.nam||''}" placeholder="2019"></label></div>
   <label>Ngày sinh (ngày, tháng)<span class="qsns"><select id="qsNg" aria-label="Ngày"><option value="">Ngày</option>${Array.from({length:31},(_,i)=>`<option ${+H.ng===i+1?'selected':''}>${i+1}</option>`).join('')}</select><select id="qsTh" aria-label="Tháng"><option value="">Tháng</option>${Array.from({length:12},(_,i)=>`<option ${+H.th===i+1?'selected':''}>${i+1}</option>`).join('')}</select></span></label>
  <div class="qs2"><label>Điện thoại phụ huynh<input id="qsDt" type="tel" value="${esc(H.dt||'')}" placeholder="0912345678" maxlength="15"></label>
   <label>Gmail phụ huynh<input id="qsMail" type="email" value="${esc(H.mail||'')}" placeholder="tenphuhuynh@gmail.com" maxlength="60"></label></div>
  <label>Mật khẩu mới<input id="qsPw" type="text" minlength="6" maxlength="40" autocomplete="off" placeholder="${cloud()?'Để trống nếu không đổi':'Chỉ đổi được khi dùng máy chủ'}" ${cloud()?'':'disabled'}></label>
  <p class="muted" style="margin:0;font-size:12.5px">Chỉ sửa thông tin tài khoản và hồ sơ. Sao, xu, đồ, tiến độ của em giữ nguyên.</p>
  <div class="qsbtn"><span style="flex:1"></span><button class="btn pri" type="submit">Lưu</button></div>
 </form></div>`;document.body.appendChild(el);setTimeout(()=>{const i=document.getElementById('qsTen');if(i)i.focus()},30)};
/* đổi khoá học sinh trên máy này */
function doiKhoa(a,b){if(a===b)return;const o=S.org||{};S.st[b]=S.st[a];delete S.st[a];
 [STUDENTS,o.hs||[]].forEach(L=>L.forEach(r=>{if(r[0]===a)r[0]=b}));
 ['gd','nl','ph','hoso'].forEach(k=>{if(o[k]&&a in o[k]){o[k][b]=o[k][a];delete o[k][a]}});
 if(typeof sid!=='undefined'&&sid===a)sid=b}
async function mayChu(a,b,ten,pw){const db=FB.db,doi=a!==b;
 const q=await db.collection('users').where('tk','==',a).get();if(q.empty)throw{message:'Không tìm thấy tài khoản '+a+' trên máy chủ'};
 const L=await db.doc('login/'+a).get(),cu=L.exists?L.data().uid:null,docCu=q.docs.find(d=>d.id===cu)||q.docs[0],du=Object.assign({},docCu.data(),{tk:b,ten});
 if(pw){const em=`${b}.r${Date.now().toString(36)}@jenny-lop-hoc-ao.firebaseapp.com`;await fbInit();const app2=firebase.apps.find(x=>x.name==='tao')||firebase.initializeApp(FB_CFG,'tao');
  const c=await app2.auth().createUserWithEmailAndPassword(em,pw);const uid=c.user.uid;await app2.auth().signOut();
  await db.doc('users/'+uid).set(du);await db.doc('login/'+b).set({email:em,uid,t:fbTS()});await Promise.all(q.docs.map(d=>db.doc('users/'+d.id).delete()))}
 else{await Promise.all(q.docs.map(d=>db.doc('users/'+d.id).set({tk:b,ten},{merge:true})));if(doi&&L.exists)await db.doc('login/'+b).set(Object.assign({},L.data(),{t:fbTS()}))}
 if(doi){if(L.exists)await db.doc('login/'+a).delete();
  for(const col of['hs','hsgv']){const d=await db.doc(col+'/'+a).get();if(d.exists){await db.doc(col+'/'+b).set(d.data());await db.doc(col+'/'+a).delete()}}
  const ph=await db.collection('users').where('con','array-contains',a).get();await Promise.all(ph.docs.map(d=>db.doc('users/'+d.id).set({con:(d.data().con||[]).map(x=>x===a?b:x)},{merge:true})))}
 const st=S.st[b];if(st)await db.doc('hs/'+b).set({j:JSON.stringify(fbTach(st).hs),t:fbTS()},{merge:true})}
window.mayChu=mayChu;
window.qlLuu=async function(e,a){e.preventDefault();const st=S.st[a];if(!st)return;
 const ten=document.getElementById('qsTen').value.trim().replace(/\s+/g,' '),b=document.getElementById('qsTk').value.trim().toLowerCase(),pw=(document.getElementById('qsPw').value||'').trim();
 if(ten.split(' ').length<2){toast('Nhập đủ họ và tên');return}
 if(b!==a&&!tkOk(b)){toast('Tên đăng nhập 3–24 kí tự: chữ thường không dấu, số, dấu chấm, gạch');return}
 if(b!==a&&(S.st[b]||STUDENTS.some(r=>r[0]===b)||((S.org&&S.org.gv)||[]).some(g=>(g.tk||g.id)===b)||Object.values((S.org&&S.org.ph)||{}).includes(b))){toast('Tên đăng nhập này đã có người dùng');return}
 if(pw&&pw.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}
 const v=i=>(document.getElementById(i).value||'').trim(),Hm={gt:v('qsGt'),ng:v('qsNg'),th:v('qsTh'),nam:v('qsNam'),dt:v('qsDt').replace(/[^\d+]/g,''),mail:v('qsMail').toLowerCase()};
 if(Hm.nam&&!(+Hm.nam>=2010&&+Hm.nam<=2025)){toast('Năm sinh chưa đúng');return}
 if(Hm.ng&&Hm.th&&Hm.nam){const d=new Date(+Hm.nam,+Hm.th-1,+Hm.ng);if(d.getDate()!==+Hm.ng){toast('Ngày sinh chưa đúng');return}}
 if(Hm.dt&&!/^(\+?84|0)\d{8,10}$/.test(Hm.dt)){toast('Số điện thoại chưa đúng');return}
 if(Hm.mail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Hm.mail)){toast('Gmail chưa đúng');return}
 const H0=hoSo(a),doiHS=['gt','ng','th','nam','dt','mail'].filter(k=>(H0[k]||'')!==(Hm[k]||''));
 const doi=[];if(ten!==st.name)doi.push(`tên "${st.name}" → "${ten}"`);if(b!==a)doi.push(`tên đăng nhập ${a} → ${b}`);if(pw)doi.push('đổi mật khẩu');if(doiHS.length)doi.push('hồ sơ ('+doiHS.map(k=>({gt:'giới tính',ng:'ngày sinh',th:'tháng sinh',nam:'năm sinh',dt:'điện thoại PH',mail:'gmail PH'})[k]).join(', ')+')');
 if(!doi.length){document.getElementById('qlsua').remove();toast('Không có thay đổi');return}
 const tk=(b!==a||pw||ten!==st.name);
 if(cloud()&&tk){toast('Đang lưu lên máy chủ…');try{await mayChu(a,b,ten,pw)}catch(err){console.error(err);toast('Chưa lưu được: '+(typeof fbLoi==='function'?fbLoi(err):(err.message||err)));return}}
 S.org.hoso=S.org.hoso||{};S.org.hoso[a]=Object.fromEntries(Object.entries(Hm).filter(([k,x])=>x));
 const doiGt=Hm.gt&&Hm.gt!==st.gender;if(Hm.gt)st.gender=Hm.gt;
 st.name=ten;[STUDENTS,(S.org&&S.org.hs)||[]].forEach(L=>L.forEach(r=>{if(r[0]===a)r[1]=ten}));doiKhoa(a,b);
 nk(`Sửa tài khoản ${ten}: ${doi.join(', ')}`);save();document.getElementById('qlsua').remove();
 if(cloud()){try{if(doiGt)await FB.db.doc('hs/'+b).set({j:JSON.stringify(fbTach(S.st[b]).hs),t:fbTS()},{merge:true});await fbDayNgay()}catch(err){toast('Máy chủ chưa nhận giới tính: '+(typeof fbLoi==='function'?fbLoi(err):err.message))}}
 if(pw&&typeof fbMKVua!=='undefined'){try{fbMKVua={tk:b,pw}}catch(err){}}
 render();toast(pw?`Đã lưu: ${b} / ${pw}`:'Đã lưu')};
/* Thêm học sinh: chọn giới tính ngay khi tạo → nhân vật tương ứng */
{const _t=window.qlTaoHS;window.qlTaoHS=async function(e){const gt=(document.getElementById('nhGt')||{}).value||'',truoc=new Set(Object.keys(S.st));
 const r=await _t(e);try{if(gt){const moi=Object.keys(S.st).filter(k=>!truoc.has(k));for(const id of moi){S.st[id].gender=gt;const o=S.org;o.hoso=o.hoso||{};o.hoso[id]=Object.assign({},o.hoso[id],{gt});
   if(cloud()){try{await FB.db.doc('hs/'+id).set({j:JSON.stringify(fbTach(S.st[id]).hs),t:fbTS()},{merge:true})}catch(err){}}}
  if(moi.length){save();if(cloud()){try{await fbDayNgay()}catch(err){}}render()}}}catch(err){}return r}}
/* nút Sửa ở bảng Học sinh của Quản lý */
{const _p=viewPH;viewPH=function(){let r=_p.apply(this,arguments);try{if(role==='ql')r=r.replace(/(<input id="nhTen"[^>]*>)/,`$1<select id="nhGt" aria-label="Giới tính" style="width:100px"><option value="">Giới tính</option><option value="nu">Nữ</option><option value="nam">Nam</option></select>`).replace(/<tr><td><b>([^<]*)<\/b><div class="muted">([a-z0-9._-]+) · /g,(m,n,id)=>{if(!S.st[id])return m;const H=hoSo(id),x=[H.gt?(H.gt==='nu'?'Nữ':'Nam'):'',H.nam?((H.ng&&H.th?H.ng+'/'+H.th+'/':'')+H.nam):'',H.dt?'PH '+H.dt:'',H.mail||''].filter(Boolean).join(' · ');
  return`<tr><td><b>${n}</b> <button type="button" class="btn sm qlsuab" onclick="qlSua('${id}')" aria-label="Sửa ${n}">✎ Sửa</button>${x?`<div class="muted qlhs">${esc(x)}</div>`:'<div class="muted qlhs qlthieu">Chưa có hồ sơ (giới tính, ngày sinh, liên hệ phụ huynh)</div>'}<div class="muted">${id} · `})}catch(e){}return r}}
document.head.insertAdjacentHTML('beforeend',`<style>
.qsbox{max-width:420px}.qsform{display:flex;flex-direction:column;gap:10px;margin-top:10px;padding:0 14px 14px;color:#1F2A5A}
.qsform label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:700}.qsform label small{font-weight:400;color:#3D4A70}
.qsform input{font:inherit;font-weight:400;padding:8px;border:0;box-shadow:var(--f2);background:#fff;color:#1F2A5A}.qsform input:disabled{background:#E3E7F0}
.qs2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.qs3{display:grid;grid-template-columns:.8fr 1.4fr .9fr;gap:10px}.qsns{display:flex;gap:4px}.qsns select{flex:1;min-width:0}
.qsform select{font:inherit;font-weight:400;padding:8px 4px;border:0;box-shadow:var(--f2);background:#fff;color:#1F2A5A}.qlhs{font-size:12.5px}.qlthieu{color:#C95A0E}
@media (max-width:420px){.qs2,.qs3{grid-template-columns:1fr}}
.qsbtn{display:flex;gap:8px;align-items:center}.qlsuab{padding:2px 8px!important;font-size:12px!important;margin-left:6px}
</style>`);
})();
