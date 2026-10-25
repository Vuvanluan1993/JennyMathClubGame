# Trang Giáo viên · Phụ huynh · Quản lý (P-07, 25/10/2026): tạo từ dist/lop-hoc-ao-jenny.html
#   python3 tools/_teacher.py         → games/lop-hoc-ao/{giao-vien,phu-huynh,quan-ly}/index.html  bản THẬT: chỉ đăng nhập máy chủ (Firebase)
#   python3 tools/_teacher.py --demo  → games/lop-hoc-ao/demo/{…}/index.html                      bản THỬ: dữ liệu mẫu, mở sẵn vai, chỉ lưu trên máy này
# Không còn mật khẩu bản demo cố định trong mã: bản thử nằm ở demo/, noindex, không commit.
import os,sys,json
DEMO='--demo' in sys.argv
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t=open(os.path.join(ROOT,'dist','lop-hoc-ao-jenny.html'),encoding='utf-8').read()
boot="if(!load())fresh();\nrender();\n</script>"
assert boot in t
CHUNG='''if(!load())fresh();
const TRANG='__TRANG__',TRANG_VAI=__VAI__;window.TRANG=TRANG;document.body.classList.add('trang-'+TRANG);
const TRANG_TEN={gv:'giáo viên',ph:'phụ huynh',ql:'quản lý',hs:'học sinh'},TRANG_LINK={gv:'../giao-vien/',ph:'../phu-huynh/',ql:'../quan-ly/',hs:'../'};
'''
# ---- bản THẬT: màn đăng nhập máy chủ ----
GATE=CHUNG+'''/* ===== Màn đăng nhập máy chủ ===== */
function gvOpen(){const g=document.getElementById('gvGate');if(g)g.remove();document.body.classList.remove('locked')}
document.body.insertAdjacentHTML('afterbegin',`<div id="gvGate" class="gvgate"><div class="gvcard"><div class="gvhd">${jenny(56)}<div><h1>__TIEUDE__</h1><p>Lớp học ảo Jenny · Clb Học Toán cùng Jenny</p></div></div>
 <form onsubmit="gvCloudLogin(event)" class="gvf"><label for="gvU">Tên đăng nhập</label><input id="gvU" autocapitalize="off" spellcheck="false" autocomplete="username" required>
 <label for="gvPw">Mật khẩu</label><input id="gvPw" type="password" autocomplete="current-password" required>
 <button class="gobtn" type="submit">Đăng nhập</button><p id="gvMsg2" class="gvmsg" role="alert"></p></form>
 ${TRANG==='ql'?`<details class="gvd"><summary>Thiết lập lần đầu (tạo tài khoản quản lý)</summary><form onsubmit="gvSetup(event)" class="gvf"><p class="gvnote">Chỉ làm một lần khi trung tâm chưa có quản lý.</p>
  <label for="suN">Họ tên</label><input id="suN" required maxlength="40"><label for="suU">Tên đăng nhập</label><input id="suU" autocapitalize="off" spellcheck="false" required maxlength="24">
  <label for="suP">Mật khẩu (ít nhất 6 kí tự)</label><input id="suP" type="password" required minlength="6"><button class="gobtn" type="submit">Tạo tài khoản quản lý</button><p id="suMsg" class="gvmsg" role="alert"></p></form></details>`:''}
 <p class="gvnote">Trang khác: ${[['gv','Giáo viên','giao-vien'],['ph','Phụ huynh','phu-huynh'],['ql','Quản lý','quan-ly']].filter(x=>x[0]!==TRANG).map(x=>`<a href="../${x[2]}/">${x[1]}</a>`).join(' · ')} · <a href="../">Học sinh</a></p></div></div>`);
function gvSaiTrang(m){const r=CLOUD.me.role;m.innerHTML=`Đây là tài khoản ${TRANG_TEN[r]||r}. Hãy vào <a href="${TRANG_LINK[r]||'../'}">trang ${TRANG_TEN[r]||''}</a>.`}
const PW_MAT='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',PW_AN='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/></svg>';
function pwMat(root){(root||document).querySelectorAll('input[type=password]').forEach(i=>{if(i.parentElement.classList.contains('pwbox'))return;const w=document.createElement('span');w.className='pwbox';i.parentNode.insertBefore(w,i);w.appendChild(i);
 const b=document.createElement('button');b.type='button';b.className='pweye';b.setAttribute('aria-label','Hiện mật khẩu');b.innerHTML=PW_MAT;
 b.onclick=()=>{const hien=i.type==='password';i.type=hien?'text':'password';b.innerHTML=hien?PW_AN:PW_MAT;b.setAttribute('aria-label',hien?'Ẩn mật khẩu':'Hiện mật khẩu');i.focus()};w.appendChild(b)})}
pwMat(document.getElementById('gvGate'));
async function gvCloudOpen(){await fbGvBoot();gvOpen();go({k:'home'})}
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
.gvcard{color-scheme:light}
.gvcard input{padding:10px!important;border:0!important;border-radius:0!important;box-shadow:var(--f2)!important;font:inherit!important;font-size:17px!important;background:#fff!important;color:#1F2A5A!important;caret-color:#1F2A5A;width:100%;box-sizing:border-box}
.gvcard input:focus{outline:3px solid #FCB40C!important;outline-offset:1px}
.gvcard label{color:#1F2A5A!important}.gvcard a{color:#0068B5!important}.gvcard .jav{background:#FFF4D6!important}
.gvcard .gobtn{background:#0079C1!important;color:#fff!important}
.pwbox{position:relative;display:block}.pwbox input{padding-right:48px!important}
.pweye{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:40px;height:36px;border:0;background:transparent;cursor:pointer;display:grid;place-items:center;color:#1F2A5A;padding:0}
.pweye:focus-visible{outline:2px solid #0079C1}.gvmsg{color:#B8320F;margin:0;min-height:1em;font-size:14px}.gvnote{font-size:12px;color:#3D4A70;margin:0}
body.locked{overflow:hidden}</style>`);
document.body.classList.add('locked');
render();setTimeout(()=>{const i=document.getElementById('gvU');if(i)i.focus()},50);
fbInit().then(()=>{const off=FB.auth.onAuthStateChanged(async u=>{off();if(!u||CLOUD)return;try{await fbNapMe(u);if(!TRANG_VAI.includes(CLOUD.me.role)){const m=document.getElementById('gvMsg2');if(m){gvSaiTrang(m);m.insertAdjacentHTML('beforeend',' <button type="button" class="btn sm" onclick="FB.auth.signOut().then(()=>location.reload())">Đăng xuất tài khoản này</button>')}CLOUD=null;return}await gvCloudOpen()}catch(e){CLOUD=null}})}).catch(()=>{})
</script>'''
# ---- bản THỬ: không máy chủ, không mật khẩu; mở sẵn vai với dữ liệu mẫu ----
GATE_DEMO=CHUNG+'''/* ===== Bản thử: dữ liệu mẫu trên máy này, mở sẵn vai ===== */
document.body.insertAdjacentHTML('afterbegin',`<div class="demoband" role="note">Bản thử — dữ liệu chỉ trên máy này · ${[['gv','Giáo viên','giao-vien'],['ph','Phụ huynh','phu-huynh'],['ql','Quản lý','quan-ly']].filter(x=>x[0]!==TRANG).map(x=>`<a href="../${x[2]}/">${x[1]}</a>`).join(' · ')} · <a href="../">Học sinh</a> · <a href="../../__DIR__/">Bản chính</a></div>`);
document.head.insertAdjacentHTML('beforeend',`<style>.demoband{position:fixed;top:0;left:0;right:0;z-index:9999;height:24px;line-height:24px;text-align:center;font-size:13px;font-weight:700;background:#FCB40C;color:#1F2A5A;border-bottom:2px solid #1F2A5A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 8px}
.demoband a{color:#1F2A5A}body{padding-top:24px}.appbar{top:calc(24px + env(safe-area-inset-top,0px))!important}</style>`);
try{gvGrade=1}catch(e){}try{setRole(TRANG)}catch(e){role=TRANG;go({k:'home'})}render()
</script>'''
base=t
for TR,TEN,DIR,VAI in [('gv','Giáo viên','giao-vien',['gv','ql']),('ph','Phụ huynh','phu-huynh',['ph']),('ql','Quản lý trung tâm','quan-ly',['ql'])]:
    g=(GATE_DEMO if DEMO else GATE).replace('__TRANG__',TR).replace('__VAI__',json.dumps(VAI)).replace('__TIEUDE__',TEN).replace('__DIR__',DIR)
    t=base.replace(boot,g).replace('<title>','<meta name="robots" content="noindex"><title>',1)
    # khung trang đầy đủ (doctype + viewport) để điện thoại hiển thị đúng khổ màn hình
    t='<!doctype html>\n<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+t
    i=t.find('</style>')+len('</style>')
    t=t[:i]+'\n</head>\n<body class="px">\n'+t[i:]+'\n</body></html>\n'
    t=t.replace('<title>Lớp học ảo Jenny',('<title>Bản thử · ' if DEMO else '<title>')+TEN+' · Lớp học ảo Jenny',1)
    rel=['games','lop-hoc-ao']+(['demo'] if DEMO else [])+[DIR]
    out=os.path.join(ROOT,'..','..',*rel);os.makedirs(out,exist_ok=True)
    open(os.path.join(out,'index.html'),'w',encoding='utf-8').write(t)
    print('/'.join(rel)+'/index.html',len(t))
