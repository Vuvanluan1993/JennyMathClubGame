/* 70 — Quản lý sửa tài khoản học sinh (thầy chốt 24/10/2026): CHỈ sửa Họ tên · Tên đăng nhập · Mật khẩu.
   Không sửa khối, xu, sao, đồ, tiến độ… (đã bỏ ô "Tên của em" ở trang đăng nhập nên tên do quản lý nhập).
   Bản có máy chủ: đổi tên đăng nhập = chuyển hồ sơ hs/, hsgv/, login/, tài khoản users/ và lớp sang tên mới (dữ liệu học giữ nguyên);
   đổi mật khẩu = tạo đăng nhập mới cho cùng tên (như "Đặt lại mật khẩu"). Bản demo (không máy chủ): chỉ đổi tên và tên đăng nhập trên máy này. */
(function(){
if(typeof ORG_ON==='undefined'||!ORG_ON)return;
const cloud=()=>!!(S.org&&S.org.cloud&&typeof FB!=='undefined'&&FB&&FB.db);
const tkOk=tk=>/^[a-z0-9][a-z0-9._-]{2,23}$/.test(tk);
const nk=t=>{try{(S.org.nk=S.org.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t});if(S.org.nk.length>200)S.org.nk.shift()}catch(e){}};
window.qlSua=function(id){const st=S.st[id];if(!st)return;const el=document.createElement('div');el.className='gdov';el.id='qlsua';
 el.innerHTML=`<div class="gdbox qsbox"><div class="gdhd"><b>Sửa tài khoản học sinh</b><button type="button" class="gdx" onclick="document.getElementById('qlsua').remove()">Đóng ✕</button></div>
 <form class="qsform" onsubmit="qlLuu(event,'${id}')">
  <label>Họ và tên<input id="qsTen" value="${esc(st.name)}" maxlength="40" required></label>
  <label>Tên đăng nhập<input id="qsTk" value="${esc(id)}" maxlength="24" autocapitalize="off" spellcheck="false" required></label>
  <label>Mật khẩu mới <small>(để trống nếu không đổi)</small><input id="qsPw" type="text" minlength="6" maxlength="40" autocomplete="off" placeholder="${cloud()?'Ít nhất 6 kí tự':'Chỉ đổi được khi dùng máy chủ'}" ${cloud()?'':'disabled'}></label>
  <p class="muted" style="margin:0;font-size:12.5px">Chỉ sửa thông tin tài khoản. Sao, xu, đồ, tiến độ của em giữ nguyên.</p>
  <div class="qsbtn"><span style="flex:1"></span><button class="btn pri" type="submit">Lưu</button></div>
 </form></div>`;document.body.appendChild(el);setTimeout(()=>{const i=document.getElementById('qsTen');if(i)i.focus()},30)};
/* đổi khoá học sinh trên máy này */
function doiKhoa(a,b){if(a===b)return;const o=S.org||{};S.st[b]=S.st[a];delete S.st[a];
 [STUDENTS,o.hs||[]].forEach(L=>L.forEach(r=>{if(r[0]===a)r[0]=b}));
 ['gd','nl','ph'].forEach(k=>{if(o[k]&&a in o[k]){o[k][b]=o[k][a];delete o[k][a]}});
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
window.qlLuu=async function(e,a){e.preventDefault();const st=S.st[a];if(!st)return;
 const ten=document.getElementById('qsTen').value.trim().replace(/\s+/g,' '),b=document.getElementById('qsTk').value.trim().toLowerCase(),pw=(document.getElementById('qsPw').value||'').trim();
 if(ten.split(' ').length<2){toast('Nhập đủ họ và tên');return}
 if(!tkOk(b)){toast('Tên đăng nhập 3–24 kí tự: chữ thường không dấu, số, dấu chấm, gạch');return}
 if(b!==a&&(S.st[b]||STUDENTS.some(r=>r[0]===b)||((S.org&&S.org.gv)||[]).some(g=>(g.tk||g.id)===b)||Object.values((S.org&&S.org.ph)||{}).includes(b))){toast('Tên đăng nhập này đã có người dùng');return}
 if(pw&&pw.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}
 const doi=[];if(ten!==st.name)doi.push(`tên "${st.name}" → "${ten}"`);if(b!==a)doi.push(`tên đăng nhập ${a} → ${b}`);if(pw)doi.push('đổi mật khẩu');
 if(!doi.length){document.getElementById('qlsua').remove();toast('Không có thay đổi');return}
 if(cloud()){toast('Đang lưu lên máy chủ…');try{await mayChu(a,b,ten,pw)}catch(err){console.error(err);toast('Chưa lưu được: '+(typeof fbLoi==='function'?fbLoi(err):(err.message||err)));return}}
 st.name=ten;[STUDENTS,(S.org&&S.org.hs)||[]].forEach(L=>L.forEach(r=>{if(r[0]===a)r[1]=ten}));doiKhoa(a,b);
 nk(`Sửa tài khoản ${ten}: ${doi.join(', ')}`);save();document.getElementById('qlsua').remove();
 if(cloud()){try{await fbDayNgay()}catch(err){}}
 if(pw&&typeof fbMKVua!=='undefined'){try{fbMKVua={tk:b,pw}}catch(err){}}
 render();toast(pw?`Đã lưu: ${b} / ${pw}`:'Đã lưu')};
/* nút Sửa ở bảng Học sinh của Quản lý */
{const _p=viewPH;viewPH=function(){let r=_p.apply(this,arguments);try{if(role==='ql')r=r.replace(/<tr><td><b>([^<]*)<\/b><div class="muted">([a-z0-9._-]+) · /g,(m,n,id)=>S.st[id]?`<tr><td><b>${n}</b> <button type="button" class="btn sm qlsuab" onclick="qlSua('${id}')" aria-label="Sửa tài khoản ${n}">✎ Sửa</button><div class="muted">${id} · `:m)}catch(e){}return r}}
document.head.insertAdjacentHTML('beforeend',`<style>
.qsbox{max-width:420px}.qsform{display:flex;flex-direction:column;gap:10px;margin-top:10px;padding:0 14px 14px;color:#1F2A5A}
.qsform label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:700}.qsform label small{font-weight:400;color:#3D4A70}
.qsform input{font:inherit;font-weight:400;padding:8px;border:0;box-shadow:var(--f2);background:#fff;color:#1F2A5A}.qsform input:disabled{background:#E3E7F0}
.qsbtn{display:flex;gap:8px;align-items:center}.qlsuab{padding:2px 8px!important;font-size:12px!important;margin-left:6px}
</style>`);
})();
