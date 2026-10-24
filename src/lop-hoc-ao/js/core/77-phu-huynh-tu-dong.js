/* 77 — Tài khoản phụ huynh tự động (24/10/2026).
   Tạo học sinh: SĐT/Gmail phụ huynh đã có → hỏi rồi gắn vào tài khoản phụ huynh đó (anh chị em);
   chưa có → tạo tài khoản phụ huynh mới tên "ph.<tên đăng nhập học sinh>", mật khẩu jenny123.
   Sửa học sinh: bổ sung SĐT/Gmail trùng phụ huynh khác → hỏi gộp; tài khoản ph.… tạm không còn con thì bỏ. */
(function(){
if(typeof viewPH==='undefined')return;
const O=()=>S.org,MK0='jenny123';
const cloud=()=>!!(O()&&O().cloud&&typeof CLOUD!=='undefined'&&CLOUD);
const dtC=s=>{let d=String(s||'').replace(/[^\d+]/g,'');if(/^\+?84/.test(d))d='0'+d.replace(/^\+?84/,'');return d};
const ten=id=>(STUDENTS.find(s=>s[0]===id)||[id,id])[1];
const conCua=tk=>Object.entries(O().ph||{}).filter(([c,t])=>t===tk).map(([c])=>c);
const moTa=tk=>{const pi=(O().phInfo||{})[tk]||{};return`${pi.ten||tk} (${tk}) — con: ${conCua(tk).map(ten).join(', ')||'chưa có'}`};
/* tìm phụ huynh theo SĐT trước, rồi Gmail; trả {tk} hoặc {xung:[a,b]} */
window.phTim=function(dt,mail,boQua){const info=O().phInfo||{};dt=dtC(dt);mail=String(mail||'').toLowerCase();
 const a=dt&&Object.keys(info).find(t=>t!==boQua&&dtC(info[t].dt)===dt),b=mail&&Object.keys(info).find(t=>t!==boQua&&(info[t].mail||'').toLowerCase()===mail);
 if(a&&b&&a!==b)return{xung:[a,b]};return{tk:a||b||null}};
const dongBo=async tk=>{if(!cloud())return;try{const q=await FB.db.collection('users').where('tk','==',tk).get();await Promise.all(q.docs.map(d=>FB.db.doc('users/'+d.id).set({con:conCua(tk)},{merge:true})))}catch(x){toast('Máy chủ chưa nhận: '+(x.message||x))}};
/* gắn học sinh id vào phụ huynh tk (có sẵn) hoặc tạo mới */
window.phGan=async function(id,tk,info){const o=O();o.ph=o.ph||{};o.phInfo=o.phInfo||{};info=info||{};
 if(!tk){tk=tkPH0(id);
  if(cloud()){const uid=await fbTaoTK(tk,MK0);await FB.db.doc('users/'+uid).set({role:'ph',tk,ten:info.ten||('Phụ huynh '+ten(id)),con:[id]})}
  o.phInfo[tk]={ten:info.ten||'',dt:dtC(info.dt),mail:String(info.mail||'').toLowerCase()};window.qlMK=window.qlMK||{};qlMK[tk]=MK0;o.ph[id]=tk;
  (o.nk=o.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Tạo tài khoản phụ huynh ${tk} cho ${ten(id)}`});return tk}
 const pi=o.phInfo[tk]=o.phInfo[tk]||{};if(!pi.ten&&info.ten)pi.ten=info.ten;if(!pi.dt&&info.dt)pi.dt=dtC(info.dt);if(!pi.mail&&info.mail)pi.mail=String(info.mail).toLowerCase();
 o.ph[id]=tk;await dongBo(tk);(o.nk=o.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Gắn ${ten(id)} vào phụ huynh ${tk}`});return tk};
/* hỏi: dùng phụ huynh có sẵn? trả tk | '' (tạo mới) */
function hoi(dt,mail,boQua){const f=phTim(dt,mail,boQua);
 if(f.xung){const [a,b]=f.xung;return confirm(`SĐT trùng phụ huynh: ${moTa(a)}\nGmail trùng phụ huynh khác: ${moTa(b)}\n\nOK = gắn theo SĐT (${a})\nHuỷ = gắn theo Gmail (${b})`)?a:b}
 if(f.tk)return confirm(`Đã có phụ huynh dùng SĐT/Gmail này:\n${moTa(f.tk)}\n\nGắn em vào tài khoản này (anh chị em)?\nOK = gắn · Huỷ = tạo tài khoản phụ huynh riêng`)?f.tk:'';
 return''}
const val=i=>((document.getElementById(i)||{}).value||'').trim();

/* 1) Thêm học sinh: thêm ô "Họ tên phụ huynh" và tự gắn/tạo phụ huynh */
{const _m=window.qlMoHS;window.qlMoHS=function(){const r=_m.apply(this,arguments);try{const dt=document.getElementById('mDt');const row=dt&&dt.closest('.qs2');if(row&&!document.getElementById('mPhTen0'))row.insertAdjacentHTML('beforebegin','<label>Họ tên phụ huynh<input id="mPhTen0" maxlength="40" placeholder="Nguyễn Văn Bình"></label>');
  const f=document.querySelector('#qlm .qsform');if(f&&!document.getElementById('mPhNote'))f.querySelector('.qsbtn').insertAdjacentHTML('beforebegin','<p id="mPhNote" class="muted" style="margin:0;font-size:12.5px">Tài khoản phụ huynh: trùng SĐT/Gmail với phụ huynh đã có thì gắn chung (anh chị em); chưa có thì tạo mới "ph.tên đăng nhập của em", mật khẩu jenny123.</p>')}catch(x){}return r}}
{const _l=window.qlLuuHS;window.qlLuuHS=async function(){const dt=val('mDt'),mail=val('mMail').toLowerCase(),phTen=val('mPhTen0');
 if(!val('mHo')||!val('mTen')||!val('mGt'))return _l.apply(this,arguments);
 const truoc=new Set(Object.keys(S.st));const _q=window.qlDong;let dong=false;window.qlDong=function(){dong=true};
 try{await _l.apply(this,arguments)}finally{window.qlDong=_q}
 const id=Object.keys(S.st).find(k=>!truoc.has(k));if(!id){return}
 const chon=hoi(dt,mail);
 try{const tk=await phGan(id,chon,{ten:phTen,dt,mail});save();if(cloud()){try{await fbDayNgay()}catch(x){}}toast(chon?`Đã tạo ${id} và gắn với phụ huynh ${tk}`:`Đã tạo ${id} / jenny123 · phụ huynh ${tk} / jenny123`)}
 catch(x){toast('Chưa tạo được tài khoản phụ huynh: '+(typeof fbLoi==='function'?fbLoi(x):x.message))}
 if(dong)_q();render()}}

/* 2) Sửa học sinh: SĐT/Gmail mới trùng phụ huynh khác → hỏi gộp */
{const _s=window.qlLuu;window.qlLuu=async function(e,a){const dt=val('qsDt'),mail=val('qsMail').toLowerCase(),b=val('qsTk').toLowerCase()||a,H0=Object.assign({},((O()||{}).hoso||{})[a]||{});
 await _s.apply(this,arguments);
 const id=S.st[b]?b:a;if(!S.st[id]||document.getElementById('qlsua'))return;   // chưa lưu (còn mở bảng) thì thôi
 const o=O(),cu=(o.ph||{})[id];if(!dt&&!mail)return;if(dtC(dt)===dtC(H0.dt)&&mail===(H0.mail||'')&&cu)return;
 const f=phTim(dt,mail,cu);let moi=f.xung?f.xung[0]:f.tk;
 if(moi&&moi!==cu){if(!confirm(`SĐT/Gmail này trùng phụ huynh đã có:\n${moTa(moi)}\n\nGộp ${ten(id)} vào tài khoản phụ huynh này?`))moi=null}
 try{if(moi&&moi!==cu){await phGan(id,moi,{dt,mail});
   if(cu&&!conCua(cu).length){if(/^ph\./.test(cu)){delete o.phInfo[cu]}await dongBo(cu)}
   toast(`Đã gộp vào phụ huynh ${moi}`)}
  else if(cu){const pi=o.phInfo[cu]=o.phInfo[cu]||{};if(dt&&!pi.dt)pi.dt=dtC(dt);if(mail&&!pi.mail)pi.mail=mail}
  else{const tk=await phGan(id,null,{dt,mail});toast('Đã tạo tài khoản phụ huynh '+tk)}
  save();if(cloud()){try{await fbDayNgay()}catch(x){}}render()}catch(x){toast('Chưa lưu phụ huynh: '+(typeof fbLoi==='function'?fbLoi(x):x.message))}}}

/* 3) Trang Phụ huynh: tạo tài khoản cho các em chưa có */
window.phTaoThieu=async function(){const ds=STUDENTS.filter(s=>!(O().ph||{})[s[0]]);if(!ds.length)return;
 if(!confirm(`Tạo tài khoản phụ huynh cho ${ds.length} em chưa có?\nEm có SĐT/Gmail trùng phụ huynh đã có sẽ được gắn chung; còn lại tạo "ph.tên đăng nhập", mật khẩu jenny123.`))return;
 let n=0,g=0,l=0;for(const [id] of ds){const h=(O().hoso||{})[id]||{};try{const f=phTim(h.dt,h.mail);await phGan(id,f.xung?f.xung[0]:f.tk,{dt:h.dt,mail:h.mail});(f.tk||f.xung)?g++:n++}catch(x){l++}}
 save();if(cloud()){try{await fbDayNgay()}catch(x){}}render();toast(`Đã tạo ${n} tài khoản, gắn chung ${g} em${l?`, ${l} lỗi`:''}`)};
{const _p=viewPH;viewPH=function(){let r=_p.apply(this,arguments);if(role==='ql'&&typeof qlTrang!=='undefined'&&qlTrang==='ph'){const n=STUDENTS.filter(s=>!(O().ph||{})[s[0]]).length;
 if(n)r=r.replace(/(<h2>Em chưa có phụ huynh \(\d+\)<\/h2>)/,`$1<div class="qlin" style="margin-bottom:10px"><button type="button" class="btn pri" onclick="phTaoThieu()">+ Tạo tài khoản phụ huynh cho ${n} em</button></div>`)}return r}}
})();
