# Trang giáo viên tạm (cách 1, thầy chốt 23/10/2026): bản demo đầy đủ + màn mật khẩu, mở sẵn vai Giáo viên.
# Dữ liệu là dữ liệu mẫu, lưu trên máy người xem (chưa có máy chủ). Mật khẩu chỉ chặn người lạ, không phải bảo mật thật.
import hashlib,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PW='giaovien123'
H=hashlib.sha256(('jennygv:'+PW).encode()).hexdigest()
t=open(os.path.join(ROOT,'dist','lop-hoc-ao-jenny.html'),encoding='utf-8').read()
boot="if(!load())fresh();\nrender();\n</script>"
assert boot in t
GATE='''if(!load())fresh();
const TRANG='__TRANG__',TRANG_VAI=__VAI__;window.TRANG=TRANG;document.body.classList.add('trang-'+TRANG);
/* ===== Trang giáo viên: màn mật khẩu ===== */
const GV_H='__H__';
async function gvSha(s){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function gvOpen(){const g=document.getElementById('gvGate');if(g)g.remove();try{gvGrade=1}catch(e){}document.body.classList.remove('locked');try{setRole(TRANG)}catch(e){role=TRANG;go({k:'home'})}render()}
async function gvLogin(e){e.preventDefault();const p=document.getElementById('gvP').value,m=document.getElementById('gvMsg');let ok=false;try{ok=(await gvSha('jennygv:'+p))===GV_H}catch(err){m.textContent='Trình duyệt không hỗ trợ. Hãy mở bằng Chrome, Edge hoặc Safari mới.';return}
 if(!ok){m.textContent='Mật khẩu chưa đúng.';return}try{sessionStorage.setItem('jennyGV_'+TRANG,'1')}catch(err){}gvOpen()}
document.body.insertAdjacentHTML('afterbegin',`<div id="gvGate" class="gvgate"><div class="gvcard"><div class="gvhd">${jenny(56)}<div><h1>__TIEUDE__</h1><p>Lớp học ảo Jenny · Clb Học Toán cùng Jenny</p></div></div>
 <form onsubmit="gvCloudLogin(event)" class="gvf"><label for="gvU">Tên đăng nhập</label><input id="gvU" autocapitalize="off" spellcheck="false" autocomplete="username" required>
 <label for="gvPw">Mật khẩu</label><input id="gvPw" type="password" autocomplete="current-password" required>
 <button class="gobtn" type="submit">Đăng nhập</button><p id="gvMsg2" class="gvmsg" role="alert"></p></form>
 <details class="gvd"><summary>Xem bản demo (dữ liệu mẫu)</summary><form onsubmit="gvLogin(event)" class="gvf"><label for="gvP">Mật khẩu bản demo</label><input id="gvP" type="password" autocomplete="off">
  <button class="gobtn" type="submit">Vào bản demo</button><p id="gvMsg" class="gvmsg" role="alert"></p><p class="gvnote">Bản demo dùng dữ liệu mẫu, chỉ lưu trên máy này.</p></form></details>
 ${TRANG==='ql'?`<details class="gvd"><summary>Thiết lập lần đầu (tạo tài khoản quản lý)</summary><form onsubmit="gvSetup(event)" class="gvf"><p class="gvnote">Chỉ làm một lần khi trung tâm chưa có quản lý.</p>
  <label for="suN">Họ tên</label><input id="suN" required maxlength="40"><label for="suU">Tên đăng nhập</label><input id="suU" autocapitalize="off" spellcheck="false" required maxlength="24">
  <label for="suP">Mật khẩu (ít nhất 6 kí tự)</label><input id="suP" type="password" required minlength="6"><button class="gobtn" type="submit">Tạo tài khoản quản lý</button><p id="suMsg" class="gvmsg" role="alert"></p></form></details>`:''}
 <p class="gvnote">Trang khác: ${[['gv','Giáo viên','giao-vien'],['ph','Phụ huynh','phu-huynh'],['ql','Quản lý','quan-ly']].filter(x=>x[0]!==TRANG).map(x=>`<a href="../${x[2]}/">${x[1]}</a>`).join(' · ')} · <a href="../">Học sinh</a></p></div></div>`);
const TRANG_TEN={gv:'giáo viên',ph:'phụ huynh',ql:'quản lý',hs:'học sinh'},TRANG_LINK={gv:'../giao-vien/',ph:'../phu-huynh/',ql:'../quan-ly/',hs:'../'};
function gvSaiTrang(m){const r=CLOUD.me.role;m.innerHTML=`Đây là tài khoản ${TRANG_TEN[r]||r}. Hãy vào <a href="${TRANG_LINK[r]||'../'}">trang ${TRANG_TEN[r]||''}</a>.`}
async function gvCloudOpen(){await fbGvBoot();const g=document.getElementById('gvGate');if(g)g.remove();document.body.classList.remove('locked');go({k:'home'})}
async function gvCloudLogin(e){e.preventDefault();const m=document.getElementById('gvMsg2');m.textContent='Đang đăng nhập…';
 try{await fbDangNhap(document.getElementById('gvU').value.trim().toLowerCase(),document.getElementById('gvPw').value,true);
  if(!TRANG_VAI.includes(CLOUD.me.role)){gvSaiTrang(m);try{await FB.auth.signOut()}catch(x){}CLOUD=null;return}
  m.textContent='';await gvCloudOpen()}catch(err){CLOUD=null;m.textContent=fbLoi(err)}}
async function gvSetup(e){e.preventDefault();const m=document.getElementById('suMsg'),tk=document.getElementById('suU').value.trim().toLowerCase();
 if(!fbTkOk(tk)){m.textContent='Tên đăng nhập 3–24 kí tự: chữ thường không dấu, số, dấu chấm.';return}m.textContent='Đang tạo…';
 try{await fbThietLap(document.getElementById('suN').value.trim(),tk,document.getElementById('suP').value);m.textContent='';await gvCloudOpen()}catch(err){CLOUD=null;m.textContent=fbLoi(err)}}
document.head.insertAdjacentHTML('beforeend',`<style>.gvgate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:16px;background:#12B5E8}
.gvcard{width:min(400px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#fff;color:#1F2A5A;padding:18px;box-shadow:var(--f2),0 6px 0 0 #1F2A5A;display:flex;flex-direction:column;gap:8px}
.gvhd{display:flex;gap:10px;align-items:center}.gvhd h1{margin:0;font-size:28px}.gvhd p{margin:0;font-size:13px;color:#3D4A70}
.gvf{display:flex;flex-direction:column;gap:8px}.gvd{border-top:1px solid #DDE3F0;padding-top:8px}.gvd summary{cursor:pointer;font-size:14px;color:#1F2A5A;font-weight:600}.gvd .gvf{margin-top:8px}
.gvcard input{padding:10px;border:0;box-shadow:var(--f2);font:inherit;background:#fff;color:#1F2A5A}.gvmsg{color:#B8320F;margin:0;min-height:1em;font-size:14px}.gvnote{font-size:12px;color:#3D4A70;margin:0}
body.locked{overflow:hidden}</style>`);
document.body.classList.add('locked');
{let ok=false;try{ok=sessionStorage.getItem('jennyGV_'+TRANG)==='1'}catch(e){}if(ok)gvOpen();else{render();setTimeout(()=>{const i=document.getElementById('gvU');if(i)i.focus()},50);
  fbInit().then(()=>{const off=FB.auth.onAuthStateChanged(async u=>{off();if(!u||CLOUD)return;try{await fbNapMe(u);if(!TRANG_VAI.includes(CLOUD.me.role)){const m=document.getElementById('gvMsg2');if(m){gvSaiTrang(m);m.insertAdjacentHTML('beforeend',' <button type="button" class="btn sm" onclick="FB.auth.signOut().then(()=>location.reload())">Đăng xuất tài khoản này</button>')}CLOUD=null;return}await gvCloudOpen()}catch(e){CLOUD=null}})}).catch(()=>{})}}
</script>'''.replace('__H__',H)
import json
base=t
for TR,TEN,DIR,VAI in [('gv','Giáo viên','giao-vien',['gv','ql']),('ph','Phụ huynh','phu-huynh',['ph']),('ql','Quản lý trung tâm','quan-ly',['ql'])]:
    g=GATE.replace('__H__',H).replace('__TRANG__',TR).replace('__VAI__',json.dumps(VAI)).replace('__TIEUDE__',TEN)
    t=base.replace(boot,g).replace('<title>','<meta name="robots" content="noindex"><title>',1)
    t=t.replace('<title>Lớp học ảo Jenny','<title>'+TEN+' · Lớp học ảo Jenny',1)
    out=os.path.join(ROOT,'..','..','games','lop-hoc-ao',DIR);os.makedirs(out,exist_ok=True)
    open(os.path.join(out,'index.html'),'w',encoding='utf-8').write(t)
    print('games/lop-hoc-ao/'+DIR+'/index.html',len(t))
