import hashlib,json
import sys,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t=open(os.path.join(ROOT,'dist','lop-hoc-ao-jenny.html')).read()
# accounts
acc={}
def h(u,p):return hashlib.sha256(f'{u.lower()}:{p}'.encode()).hexdigest()
for g in range(1,10):
    for suf in ['']+[f'-{i}' for i in range(1,6)]:
        u=f'jenny0{g}{suf}';acc[u]={'g':g,'h':h(u,'jenny123')}
R=[("const STUDENTS=[","let STUDENTS=["),("const KEY='jennyVirtualDemo_v9'","let KEY='jennyHS'"),
("<div class=\"seg\" id=\"tabs\" role=\"group\" aria-label=\"Chọn vai trò\"></div>","<div class=\"seg\" id=\"tabs\" role=\"group\" aria-label=\"Chọn vai trò\"></div><div class=\"hsme\" id=\"hsme\"></div>")]
for a,b in R:
    assert a in t,a; t=t.replace(a,b,1)
boot_old="if(!load())fresh();\nrender();\n</script>"
assert boot_old in t
login='''
/* ===================== Bản học sinh: đăng nhập ===================== */
const ACC=__ACC__;
const START=Date.UTC(2026,8,5);
const dayNow=()=>Math.max(1,Math.floor((Date.now()-START)/864e5)+1);
async function sha(s){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function header(){const st=S&&S.st&&S.st[sid];const m=document.getElementById('hsme');if(m&&st)m.innerHTML=`<span class="av">${initials(st.name)}</span><span class="hsn"><b>${esc(st.name)}</b><small>Lớp ${st.grade} · ${esc(sid)}</small></span><button class="btn sm" type="button" onclick="logoutHS()">Đăng xuất</button>`}
function setRole(){}
function bootUser(u,name){const a=ACC[u];STUDENTS=[[u,name||(u.charAt(0).toUpperCase()+u.slice(1)),a.g]];sid=u;role='hs';KEY='jennyHS_'+u;
  if(!load()){S={day:dayNow(),events:[],open:{j1:true,j2:true,jg1b1:true,jg1b2:true},st:{},cbi:{}};S.st[u]=newStudent(name||(u.charAt(0).toUpperCase()+u.slice(1)),a.g);S.st[u].active=true}
  if(name&&name.trim())S.st[u].name=name.trim();STUDENTS[0][1]=S.st[u].name;S.day=dayNow();S.open=Object.assign({j1:true,j2:true,jg1b1:true,jg1b2:true},S.open||{});save();
  document.getElementById('login').hidden=true;document.body.classList.remove('locked');go({k:'home'})}
function logoutHS(){try{save();speechSynthesis.cancel()}catch(e){}try{localStorage.removeItem('jennyHS_last')}catch(e){}location.reload()}
async function doLogin(e){e.preventDefault();const u=document.getElementById('lgU').value.trim().toLowerCase(),p=document.getElementById('lgP').value,n=document.getElementById('lgN').value,msg=document.getElementById('lgMsg');
  if(!ACC[u]){msg.textContent='Tên đăng nhập không đúng. Ví dụ: Jenny01';return}
  let ok=false;try{ok=(await sha(u+':'+p))===ACC[u].h}catch(err){msg.textContent='Trình duyệt không hỗ trợ đăng nhập. Hãy mở bằng Chrome hoặc Edge.';return}
  if(!ok){msg.textContent='Mật khẩu chưa đúng, em thử lại nhé.';return}
  try{if(document.getElementById('lgR').checked)localStorage.setItem('jennyHS_last',u);else localStorage.removeItem('jennyHS_last')}catch(err){}
  bootUser(u,n)}
{const bj=document.querySelector('.brand .jav');if(bj)bj.outerHTML=jenny(40)}
document.getElementById('lgForm').addEventListener('submit',doLogin);
{let last=null;try{last=localStorage.getItem('jennyHS_last')}catch(e){}if(last&&ACC[last])bootUser(last);else{document.getElementById('lgU').focus()}}
</script>'''.replace('__ACC__',json.dumps(acc))
t=t.replace(boot_old,login)
# remove old brand replace in Khởi động (keep both harmless) ; login overlay markup
overlay='''<div id="login" class="login"><form id="lgForm" class="lgcard" autocomplete="off">
 <div class="lghead"><span class="lgjen"></span><div><h1>Lớp học ảo Jenny</h1><p>Clb Học Toán cùng Jenny</p></div></div>
 <label for="lgU">Tên đăng nhập</label><input id="lgU" name="u" placeholder="Ví dụ: Jenny01" autocapitalize="off" spellcheck="false" required>
 <label for="lgP">Mật khẩu</label><input id="lgP" name="p" type="password" required>
 <label for="lgN">Tên của em <small>(lần đầu đăng nhập, có thể bỏ trống)</small></label><input id="lgN" name="n" placeholder="Ví dụ: Lê Bảo Na" maxlength="40">
 <label class="lgrem"><input id="lgR" type="checkbox"> Ghi nhớ trên máy này (máy ở nhà)</label>
 <button class="gobtn" type="submit">Vào học</button><p id="lgMsg" class="lgmsg" role="alert"></p>
 <p class="lgnote">Tiến độ học được lưu trên chính máy này. Ở phòng máy, em nhớ bấm <b>Đăng xuất</b> khi học xong.</p></form></div>
'''
t=t.replace('<main class="wrap" id="app"></main>',overlay+'<main class="wrap" id="app"></main>',1)
css='''
/* ===== bản học sinh ===== */
[hidden]{display:none!important}
.demo,#tabs,#whoBox{display:none!important}
.hsme{display:flex;align-items:center;gap:8px;min-width:0}.hsn{display:grid;line-height:1.15;min-width:0}.hsn b{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:40vw}.hsn small{color:var(--muted);font-size:11.5px}
.login{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:16px;background:#3FC1EC radial-gradient(#BDEBFA 2px,transparent 3px) 0 0/46px 34px;overflow:auto}
.lgcard{width:100%;max-width:400px;background:var(--surface);color:var(--ink);padding:22px;display:grid;gap:8px;box-shadow:var(--f3),0 8px 0 0 var(--pxk)}
.lghead{display:flex;gap:12px;align-items:center;margin-bottom:6px}.lghead h1{font-size:34px}.lghead p{margin:0;color:var(--muted)}
.lgcard label{font-weight:700;font-size:14px}.lgcard label small{font-weight:400;color:var(--muted)}
.lgcard input:not([type=checkbox]){font:inherit;font-size:17px;padding:10px 12px;border:0;background:var(--surface2);color:var(--ink);box-shadow:var(--f2)}
.lgrem{display:flex;gap:8px;align-items:center;font-weight:400!important;margin:4px 0}
.lgmsg{color:var(--coral);min-height:1.2em;margin:0;font-weight:600}.lgnote{margin:0;color:var(--muted);font-size:12.5px}
body.locked .appbar,body.locked main,body.locked .bnav{visibility:hidden}
'''
t=t.replace('</style>',css+'</style>',1)
# doc wrapper
head='''<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex">
'''
t=head+t.replace('<title>','<title>',1)
# body: put content after </style> into body
i=t.find('</style>')+len('</style>')
t=t[:i]+'\n</head>\n<body class="locked px">\n'+t[i:]+'\n</body></html>\n'
t=t.replace('<span class="lgjen"></span>','<span class="lgjen" id="lgjen"></span>')
t=t.replace("document.getElementById('lgForm').addEventListener","{const lj=document.getElementById('lgjen');if(lj)lj.innerHTML=jenny(56)}\ndocument.getElementById('lgForm').addEventListener")
open(os.path.join(ROOT,'..','..','games','lop-hoc-ao','index.html'),'w').write(t)
print(len(t),len(acc))
