/* 70 — Quản lý sửa dữ liệu học sinh (thầy yêu cầu 24/10/2026: bỏ ô "Tên của em" ở trang đăng nhập,
   nên tên và thông tin mỗi em do quản lý nhập/sửa).
   Quản lý › Học sinh › nút "Sửa" từng em: Họ tên · Khối · Nhân vật (nữ/nam) · Xu · Kích hoạt Toán Jenny · Làm lại tiến độ.
   Bản có máy chủ: ghi thêm lên máy chủ (hồ sơ học sinh + tài khoản); nếu máy chủ từ chối thì báo. Mọi thao tác ghi Nhật ký. */
(function(){
if(typeof ORG_ON==='undefined'||!ORG_ON)return;
let qsRS=false;
window.qlSua=function(id){const st=S.st[id];if(!st)return;qsRS=false;const el=document.createElement('div');el.className='gdov';el.id='qlsua';
 el.innerHTML=`<div class="gdbox qsbox"><div class="gdhd"><b>Sửa thông tin học sinh</b><button type="button" class="gdx" onclick="document.getElementById('qlsua').remove()">Đóng ✕</button></div>
 <form class="qsform" onsubmit="qlLuu(event,'${id}')">
  <label>Tên đăng nhập<input value="${esc(id)}" disabled></label>
  <label>Họ và tên<input id="qsTen" value="${esc(st.name)}" maxlength="40" required></label>
  <div class="qs2"><label>Khối<select id="qsKhoi">${[1,2,3,4,5].map(k=>`<option ${k===st.grade?'selected':''}>${k}</option>`).join('')}</select></label>
  <label>Nhân vật<select id="qsGen"><option value="">Em tự chọn</option><option value="nu" ${st.gender==='nu'?'selected':''}>Bạn nữ</option><option value="nam" ${st.gender==='nam'?'selected':''}>Bạn nam</option></select></label></div>
  <div class="qs2"><label>Xu<input id="qsXu" type="number" min="0" max="99999" value="${st.coins|0}"></label>
  <label class="qsck"><input id="qsTJ" type="checkbox" ${st.active?'checked':''}> Kích hoạt Toán Jenny</label></div>
  <p class="muted" style="margin:0;font-size:12.5px">Đổi khối: em ra khỏi lớp cũ nếu lớp đó khác khối (xếp lại lớp ở bảng Học sinh). Sao, Sổ lỗi giữ nguyên.</p>
  <div class="qsbtn"><button type="button" class="btn sm qsrs" id="qsRS" onclick="qlLamLai('${id}')">Làm lại tiến độ…</button><span style="flex:1"></span><button class="btn pri" type="submit">Lưu</button></div>
 </form></div>`;document.body.appendChild(el);setTimeout(()=>{const i=document.getElementById('qsTen');if(i)i.focus()},30)};
const nk=t=>{try{(S.org.nk=S.org.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t});if(S.org.nk.length>200)S.org.nk.shift()}catch(e){}};
async function lenMayChu(id,doiTen){try{if(!(S.org&&S.org.cloud&&typeof FB!=='undefined'&&FB&&FB.db))return;const st=S.st[id],db=FB.db;
  await db.doc('hs/'+id).set({j:JSON.stringify(fbTach(st).hs),t:fbTS()},{merge:true});
  if(doiTen){const q=await db.collection('users').where('tk','==',id).get();await Promise.all(q.docs.map(d=>db.doc('users/'+d.id).set({ten:st.name,khoi:st.grade},{merge:true})))}
  await fbDayNgay()}catch(e){console.error(e);toast('Đã lưu trên máy này, nhưng máy chủ chưa nhận: '+(typeof fbLoi==='function'?fbLoi(e):e.message))}}
window.qlLuu=async function(e,id){e.preventDefault();const st=S.st[id];if(!st)return;const o=S.org;
 const ten=document.getElementById('qsTen').value.trim().replace(/\s+/g,' '),k=+document.getElementById('qsKhoi').value,g=document.getElementById('qsGen').value,xu=Math.max(0,Math.min(99999,parseInt(document.getElementById('qsXu').value||'0',10))),tj=document.getElementById('qsTJ').checked;
 if(ten.length<2){toast('Nhập họ và tên');return}
 const doi=[];if(ten!==st.name)doi.push(`tên "${st.name}" → "${ten}"`);if(k!==st.grade)doi.push(`khối ${st.grade} → ${k}`);if((g||'')!==(st.gender||''))doi.push('nhân vật');if(xu!==st.coins)doi.push(`xu ${st.coins} → ${xu}`);if(tj!==!!st.active)doi.push(tj?'bật Toán Jenny':'tắt Toán Jenny');
 const doiTen=ten!==st.name||k!==st.grade;
 st.name=ten;st.grade=k;if(g)st.gender=g;else delete st.gender;st.coins=xu;st.active=tj;
 [STUDENTS,(o&&o.hs)||[]].forEach(L=>L.forEach(r=>{if(r[0]===id){r[1]=ten;r[2]=k}}));
 if(o&&o.gd&&o.gd[id]){const l=(o.lop||[]).find(x=>x.id===o.gd[id]);if(l&&l.khoi!==k){delete o.gd[id];doi.push('ra khỏi lớp '+l.ten)}}
 try{healAll()}catch(e){}
 if(doi.length)nk(`Sửa ${ten} (${id}): ${doi.join(', ')}`);save();document.getElementById('qlsua').remove();render();toast(doi.length?'Đã lưu':'Không có thay đổi');
 if(doi.length)await lenMayChu(id,doiTen)};
window.qlLamLai=async function(id){const b=document.getElementById('qsRS');if(!qsRS){qsRS=true;b.textContent='Bấm lần nữa để xoá hết sao, xu, đồ, thú cưng';b.classList.add('arm');return}
 const cu=S.st[id];const st=newStudent(cu.name,cu.grade);if(cu.gender)st.gender=cu.gender;st.active=cu.active;S.st[id]=st;nk(`Làm lại tiến độ của ${cu.name} (${id})`);save();document.getElementById('qlsua').remove();render();toast('Đã làm lại tiến độ');await lenMayChu(id,false)};
/* gắn nút Sửa vào bảng Học sinh của Quản lý */
{const _p=viewPH;viewPH=function(){let r=_p.apply(this,arguments);try{if(role==='ql')r=r.replace(/<tr><td><b>([^<]*)<\/b><div class="muted">([a-z0-9._-]+) · /g,(m,n,id)=>S.st[id]?`<tr><td><b>${n}</b> <button type="button" class="btn sm qlsuab" onclick="qlSua('${id}')" aria-label="Sửa ${n}">✎ Sửa</button><div class="muted">${id} · `:m)}catch(e){}return r}}
document.head.insertAdjacentHTML('beforeend',`<style>
.qsbox{max-width:440px}.qsform{display:flex;flex-direction:column;gap:10px;margin-top:10px;padding:0 14px 14px;color:#1F2A5A}
.qsform label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:700}.qsform input,.qsform select{font:inherit;font-weight:400;padding:8px;border:0;box-shadow:var(--f2);background:#fff;color:#1F2A5A}
.qs2{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:end}.qsck{flex-direction:row!important;align-items:center;gap:8px!important}.qsck input{box-shadow:none}
.qsbtn{display:flex;gap:8px;align-items:center}.qsrs.arm{background:#F04A1B!important;color:#fff!important}
.qlsuab{padding:2px 8px!important;font-size:12px!important;margin-left:6px}
</style>`);
})();
