# Trang giáo viên tạm (cách 1, thầy chốt 23/10/2026): bản demo đầy đủ + màn mật khẩu, mở sẵn vai Giáo viên.
# Dữ liệu là dữ liệu mẫu, lưu trên máy người xem (chưa có máy chủ). Mật khẩu chỉ chặn người lạ, không phải bảo mật thật.
import hashlib,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PW='giaovien123'
H=hashlib.sha256(('jennygv:'+PW).encode()).hexdigest()
t=open(os.path.join(ROOT,'dist','lop-hoc-ao-jenny.html'),encoding='utf-8').read()
boot="if(!load())fresh();\nrender();\n</script>"
assert boot in t
gate='''if(!load())fresh();
/* ===== Trang giáo viên: màn mật khẩu ===== */
const GV_H='__H__';
async function gvSha(s){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function gvOpen(){const g=document.getElementById('gvGate');if(g)g.remove();try{gvGrade=1}catch(e){}document.body.classList.remove('locked');try{setRole('gv')}catch(e){role='gv';go({k:'home'})}render()}
async function gvLogin(e){e.preventDefault();const p=document.getElementById('gvP').value,m=document.getElementById('gvMsg');let ok=false;try{ok=(await gvSha('jennygv:'+p))===GV_H}catch(err){m.textContent='Trình duyệt không hỗ trợ. Hãy mở bằng Chrome, Edge hoặc Safari mới.';return}
 if(!ok){m.textContent='Mật khẩu chưa đúng.';return}try{sessionStorage.setItem('jennyGV','1')}catch(err){}gvOpen()}
document.body.insertAdjacentHTML('afterbegin',`<div id="gvGate" class="gvgate"><form class="gvcard" onsubmit="gvLogin(event)"><div class="gvhd">${jenny(56)}<div><h1>Trang giáo viên</h1><p>Lớp học ảo Jenny · bản giới thiệu</p></div></div>
 <label for="gvP">Mật khẩu</label><input id="gvP" type="password" autocomplete="current-password" required>
 <button class="gobtn" type="submit">Vào trang giáo viên</button><p id="gvMsg" class="gvmsg" role="alert"></p>
 <p class="gvnote">Đây là bản giới thiệu với dữ liệu mẫu. Thay đổi chỉ lưu trên máy này. Chưa xem được kết quả thật của học sinh.</p></form></div>`);
document.head.insertAdjacentHTML('beforeend',`<style>.gvgate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:16px;background:#12B5E8}
.gvcard{width:min(380px,100%);background:#fff;color:#1F2A5A;padding:18px;box-shadow:var(--f2),0 6px 0 0 #1F2A5A;display:flex;flex-direction:column;gap:8px}
.gvhd{display:flex;gap:10px;align-items:center}.gvhd h1{margin:0;font-size:28px}.gvhd p{margin:0;font-size:13px;color:#3D4A70}
.gvcard input{padding:10px;border:0;box-shadow:var(--f2);font:inherit;background:#fff;color:#1F2A5A}.gvmsg{color:#B8320F;margin:0;min-height:1em;font-size:14px}.gvnote{font-size:12px;color:#3D4A70;margin:0}
body.locked{overflow:hidden}</style>`);
document.body.classList.add('locked');
{let ok=false;try{ok=sessionStorage.getItem('jennyGV')==='1'}catch(e){}if(ok)gvOpen();else{render();setTimeout(()=>{const i=document.getElementById('gvP');if(i)i.focus()},50)}}
</script>'''.replace('__H__',H)
t=t.replace(boot,gate)
t=t.replace('<title>','<meta name="robots" content="noindex"><title>',1)
out=os.path.join(ROOT,'..','..','games','lop-hoc-ao','giao-vien');os.makedirs(out,exist_ok=True)
open(os.path.join(out,'index.html'),'w',encoding='utf-8').write(t)
print('games/lop-hoc-ao/giao-vien/index.html',len(t))
