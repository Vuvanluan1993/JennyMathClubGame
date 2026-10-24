import hashlib,json
import sys,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t=open(os.path.join(ROOT,'dist','lop-hoc-ao-jenny.html')).read()
# accounts
acc={}
def h(u,p):return hashlib.sha256(f'{u.lower()}:{p}'.encode()).hexdigest()
acc['lebaona']={'g':1,'h':h('lebaona','jenny123'),'name':'Lê Bảo Na'}
for g in range(1,6):  # 23/10/2026: chỉ tiểu học
    for suf in ['']+[f'-{i}' for i in range(1,6)]:
        u=f'jenny0{g}{suf}';acc[u]={'g':g,'h':h(u,'jenny123')}
R=[("const STUDENTS=[","let STUDENTS=["),("const ORG_ON=true;","const ORG_ON=false;"),("const KEY='jennyVirtualDemo_v10'","let KEY='jennyHS'"),
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
function header(){const st=S&&S.st&&S.st[sid];const m=document.getElementById('hsme');if(!m||!st)return;const ini=(st.name.trim().split(/ +/).pop()||'?').charAt(0).toUpperCase();
  m.innerHTML=`<button type="button" class="nb-out nb-outtop" onclick="logoutHS()" title="${esc(st.name)} · ${esc(sid)}"><svg class="nb-door" viewBox="0 0 10 12" width="15" height="18" shape-rendering="crispEdges" aria-hidden="true"><path fill="#1F2A5A" d="M1 0h6v1H1zM0 1h1v11H0zM1 11h6v1H1zM7 1h1v3H7zM7 8h1v3H7z"/><path fill="#FCB40C" d="M1 1h6v10H1z"/><path fill="#C97A00" d="M2 2h4v4H2zM2 7h4v3H2z"/><path fill="#1F2A5A" d="M5 6h1v1H5z"/><path fill="#E0441A" d="M6 5h3v2H6zM8 4h1v1H8zM8 7h1v1H8zM9 5h1v2H9z"/></svg><span>${LANG==='en'?'Log out':'Đăng xuất'}</span></button>`;
  const br=document.querySelector('.appbar .brand');if(br&&!br.classList.contains('nb-brand')){br.className='brand nb-brand';br.innerHTML=`<svg class="nb-logo" viewBox="2 1 19 13" width="38" height="26" shape-rendering="crispEdges" aria-hidden="true"><path fill="#1F2A5A" d="M9 1h5v1h-5zM8 2h1v1h-1zM14 2h1v1h-1zM7 3h1v1h-1zM15 3h1v1h-1zM4 4h3v1h-3zM16 4h1v1h-1zM3 5h1v1h-1zM17 5h2v1h-2zM3 6h1v1h-1zM19 6h1v1h-1zM2 7h1v1h-1zM19 7h1v1h-1zM2 8h1v1h-1zM20 8h1v1h-1zM3 9h1v1h-1zM19 9h1v1h-1zM3 10h1v1h-1zM19 10h1v1h-1zM3 11h1v1h-1zM18 11h1v1h-1zM3 12h1v1h-1zM18 12h1v1h-1zM3 13h16v1h-16z"/><path fill="#FFFFFF" d="M9 2h5v1h-5zM8 3h7v1h-7zM7 4h2v1h-2zM4 5h5v1h-5zM16 5h1v1h-1zM4 6h9v1h-9zM15 6h4v1h-4zM3 7h10v1h-10zM15 7h4v1h-4zM3 8h10v1h-10zM15 8h5v1h-5zM4 9h3v1h-3zM9 9h4v1h-4zM15 9h4v1h-4zM4 10h3v1h-3zM9 10h4v1h-4zM15 10h4v1h-4zM4 11h4v1h-4zM15 11h3v1h-3zM4 12h5v1h-5zM13 12h5v1h-5z"/><path fill="#F58220" d="M9 4h7v1h-7zM9 5h7v1h-7z"/><path fill="#00B8EC" d="M13 6h2v1h-2zM13 7h2v1h-2zM13 8h2v1h-2zM13 9h2v1h-2zM13 10h2v1h-2zM14 11h1v1h-1z"/><path fill="#28B568" d="M7 9h2v1h-2zM7 10h2v1h-2zM8 11h6v1h-6zM9 12h4v1h-4z"/></svg><span class="nb-word"><span><i style="color:#F04E23">J</i><i style="color:#F58220">e</i><i style="color:#28B568">n</i><i style="color:#00B8EC">n</i><i style="color:#8C5DA7">y</i></span><em>Club</em></span>`;br.setAttribute('aria-label','JennyClub — Clb Học Toán cùng Jenny')}}
{const _r=render;render=function(){const a=_r.apply(this,arguments);try{if(scr&&scr.k==='home'&&scr.tab==='hoso'){const m=document.getElementById('app');if(m&&!m.querySelector('.hsout'))m.insertAdjacentHTML('beforeend',`<div class="hsout"><button type="button" class="nb-out" onclick="logoutHS()">${LANG==='en'?'Log out':'Đăng xuất'}</button></div>`)}}catch(e){}return a}}
function hsMenu(e){e.stopPropagation();const m=document.getElementById('hsMenu'),b=e.currentTarget;if(!m)return;m.hidden=!m.hidden;b.setAttribute('aria-expanded',!m.hidden)}
document.addEventListener('click',e=>{const m=document.getElementById('hsMenu');if(m&&!m.hidden&&!e.target.closest('#hsMenu'))m.hidden=true});
{const _sl=setLang;setLang=function(l){const br=document.querySelector('.appbar .brand');if(br)br.classList.remove('nb-brand');const r=_sl.apply(this,arguments);header();return r}}
function setRole(){}
function bootUser(u,name){const a=ACC[u];STUDENTS=[[u,name||(u.charAt(0).toUpperCase()+u.slice(1)),a.g]];sid=u;role='hs';KEY='jennyHS2_'+u;try{Object.keys(localStorage).filter(k=>/^jennyHS_(?!last$)/.test(k)).forEach(k=>localStorage.removeItem(k))}catch(e){}if(!name&&a.name)name=a.name;
  if(!load()){S={day:dayNow(),events:[],open:{j1:true,j2:true,jg1b1:true,jg1b2:true},st:{},cbi:{}};S.st[u]=newStudent(name||(u.charAt(0).toUpperCase()+u.slice(1)),a.g);S.st[u].active=true}
  if(name&&name.trim())S.st[u].name=name.trim();STUDENTS[0][1]=S.st[u].name;S.day=dayNow();S.open=Object.assign({j1:true,j2:true,jg1b1:true,jg1b2:true},S.open||{});save();
  document.getElementById('login').hidden=true;document.body.classList.remove('locked');go({k:'home'})}
function logoutHS(){if(CLOUD){try{speechSynthesis.cancel()}catch(e){}fbDangXuat();return}try{save();speechSynthesis.cancel()}catch(e){}try{localStorage.removeItem('jennyHS_last')}catch(e){}location.reload()}
async function doLogin(e){e.preventDefault();const u=document.getElementById('lgU').value.trim().toLowerCase(),p=document.getElementById('lgP').value,n='',msg=document.getElementById('lgMsg');
  const nho=document.getElementById('lgR').checked;
  if(!(ACC[u]&&!navigator.onLine)){msg.textContent='Đang đăng nhập…';try{await fbDangNhap(u,p,nho);
    if(CLOUD.me.role!=='hs'){msg.textContent='Đây là tài khoản '+(CLOUD.me.role==='ph'?'phụ huynh':'giáo viên')+'. Hãy vào trang giáo viên & phụ huynh.';try{await FB.auth.signOut()}catch(x){}CLOUD=null;return}
    await fbHsBoot();document.getElementById('login').hidden=true;document.body.classList.remove('locked');go({k:'home'});return}
   catch(err){msg.textContent='';if(!ACC[u]){msg.textContent=fbLoi(err);CLOUD=null;return}CLOUD=null}}
  if(!ACC[u]){msg.textContent='Tên đăng nhập không đúng. Ví dụ: Jenny01';return}
  let ok=false;try{ok=(await sha(u+':'+p))===ACC[u].h}catch(err){msg.textContent='Trình duyệt không hỗ trợ đăng nhập. Hãy mở bằng Chrome hoặc Edge.';return}
  if(!ok){msg.textContent='Mật khẩu chưa đúng, em thử lại nhé.';return}
  try{if(document.getElementById('lgR').checked)localStorage.setItem('jennyHS_last',u);else localStorage.removeItem('jennyHS_last')}catch(err){}
  bootUser(u,n)}
{const bj=document.querySelector('.brand .jav');if(bj)bj.outerHTML=jenny(40)}
document.getElementById('lgForm').addEventListener('submit',doLogin);
{const M='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',A='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/></svg>';
 const i=document.getElementById('lgP'),w=document.createElement('span');w.className='pwbox';i.parentNode.insertBefore(w,i);w.appendChild(i);const b=document.createElement('button');b.type='button';b.className='pweye';b.setAttribute('aria-label','Hiện mật khẩu');b.innerHTML=M;
 b.onclick=()=>{const h=i.type==='password';i.type=h?'text':'password';b.innerHTML=h?A:M;b.setAttribute('aria-label',h?'Ẩn mật khẩu':'Hiện mật khẩu');i.focus()};w.appendChild(b);
 document.head.insertAdjacentHTML('beforeend','<style>.pwbox{position:relative;display:block}.pwbox input{padding-right:48px!important;width:100%;box-sizing:border-box}.pweye{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:40px;height:36px;border:0;background:transparent;cursor:pointer;display:grid;place-items:center;color:var(--ink,#1F2A5A);padding:0}</style>')}
{let last=null;try{last=localStorage.getItem('jennyHS_last')}catch(e){}if(last&&ACC[last])bootUser(last);else{document.getElementById('lgU').focus();
  /* đã đăng nhập máy chủ từ trước (ghi nhớ) thì vào thẳng */
  fbInit().then(()=>{const off=FB.auth.onAuthStateChanged(async u=>{off();if(!u||CLOUD)return;try{await fbNapMe(u);if(CLOUD.me.role!=='hs'){CLOUD=null;return}await fbHsBoot();document.getElementById('login').hidden=true;document.body.classList.remove('locked');go({k:'home'})}catch(e){CLOUD=null}})}).catch(()=>{})}}
</script>'''.replace('__ACC__',json.dumps(acc))
t=t.replace(boot_old,login)
# remove old brand replace in Khởi động (keep both harmless) ; login overlay markup
overlay='''<div id="login" class="login"><form id="lgForm" class="lgcard" autocomplete="off">
 <div class="lghead"><span class="lgjen"></span><div><h1>Lớp học ảo Jenny</h1><p>Clb Học Toán cùng Jenny</p></div></div>
 <label for="lgU">Tên đăng nhập</label><input id="lgU" name="u" placeholder="Ví dụ: Jenny01" autocapitalize="off" spellcheck="false" required>
 <label for="lgP">Mật khẩu</label><input id="lgP" name="p" type="password" required>
 <label class="lgrem"><input id="lgR" type="checkbox"> Ghi nhớ trên máy này (máy ở nhà)</label>
 <button class="gobtn" type="submit">Vào học</button><p id="lgMsg" class="lgmsg" role="alert"></p>
 <p class="lgnote">Dùng tài khoản trung tâm cấp: tiến độ lưu trên máy chủ, cô giáo và bố mẹ xem được. Ở phòng máy, em nhớ bấm <b>Đăng xuất</b> khi học xong.</p></form></div>
'''
t=t.replace('<main class="wrap" id="app"></main>',overlay+'<main class="wrap" id="app"></main>',1)
css='''
/* ===== bản học sinh ===== */
[hidden]{display:none!important}
.demo,#tabs,#whoBox{display:none!important}
.hsme{display:flex;align-items:center;min-width:0;order:9;position:relative}
.appbar .wrap{flex-wrap:nowrap!important;gap:8px!important}.appbar .brand{margin-right:auto!important}
.appbar .nb-lang{margin-left:auto}.appbar #sndBtn{margin-left:0!important}.nb-brand{display:flex!important;align-items:center;gap:4px;flex:none}.nb-logo{flex:none;image-rendering:pixelated}.nb-word{display:flex;align-items:center;font-family:var(--f-display);font-size:24px;line-height:1;letter-spacing:0}.nb-word i{font-style:normal;text-shadow:1px 1px 0 #1F2A5A}.nb-word em{font-style:normal;margin-left:3px;padding:1px 4px 2px;background:#28B568;color:#fff;font-size:18px;box-shadow:0 -2px 0 0 #1F2A5A,0 2px 0 0 #1F2A5A,-2px 0 0 0 #1F2A5A,2px 0 0 0 #1F2A5A}@media(max-width:440px){.nb-word{flex-direction:column;align-items:flex-start;font-size:20px;line-height:.8}.nb-word span{display:flex}.nb-word em{margin:3px 0 0 2px;font-size:14px;padding:0 3px 1px;line-height:1}.nb-logo{width:30px;height:21px}.appbar .wrap{gap:6px!important;padding-left:8px!important;padding-right:8px!important}.nb-lang button{padding:5px 5px!important;font-size:16px!important}#sndBtn{min-width:32px!important;padding:4px 6px!important}}@media(max-width:345px){.nb-outtop{font-size:16px!important;padding:3px 4px!important;gap:3px}.nb-door{width:12px;height:15px}.nb-logo{width:26px;height:18px}.nb-lang button{padding:4px 4px!important}.appbar .wrap{gap:5px!important;padding-left:6px!important;padding-right:6px!important}}.nb-brand b{font-family:var(--f-display);font-weight:400;font-size:20px;line-height:.85;color:var(--ink)}
.nb-car{position:absolute;right:1px;bottom:0;font-style:normal;font-size:12px;line-height:1;color:var(--ink)}.nb-av{position:relative;width:38px;height:38px;border:0;cursor:pointer;background:var(--sea-soft);color:var(--ink);font-family:var(--f-display);font-size:26px;line-height:1;box-shadow:var(--f2),0 3px 0 2px var(--pxk)}
.nb-menu{position:absolute;right:0;top:46px;z-index:40;background:var(--surface);box-shadow:var(--f3),4px 4px 0 3px var(--pxk);padding:10px 12px;min-width:210px}.nb-menu b{display:block;font-size:16px}.nb-menu small{display:block;color:var(--muted);margin:2px 0 10px}
.hsout{max-width:420px;margin:16px auto 8px}.nb-outtop{width:auto!important;flex:none;order:9;display:flex!important;align-items:center;gap:4px;white-space:nowrap;padding:3px 5px!important;margin:0 4px 3px 2px;font-family:var(--f-display)!important;font-weight:400!important;font-size:18px!important;line-height:1!important;background:#FFE3D8!important;color:#B8320F!important;box-shadow:0 -2px 0 0 #1F2A5A,0 2px 0 0 #1F2A5A,-2px 0 0 0 #1F2A5A,2px 0 0 0 #1F2A5A,2px 4px 0 0 #1F2A5A,4px 2px 0 0 #1F2A5A!important}.nb-outtop:active{transform:translate(2px,2px);box-shadow:0 -2px 0 0 #1F2A5A,0 2px 0 0 #1F2A5A,-2px 0 0 0 #1F2A5A,2px 0 0 0 #1F2A5A!important}.nb-door{image-rendering:pixelated;flex:none}@media(max-width:440px){}@media(max-width:400px){.nb-brand b,.nb-brand span{font-size:15px!important}.nb-lang button{padding:5px 6px!important;font-size:17px!important}}.nb-out{width:100%;border:0;padding:8px;font:inherit;font-weight:700;cursor:pointer;background:var(--coral-soft);color:var(--coral);box-shadow:0 0 0 2px var(--coral)}
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
