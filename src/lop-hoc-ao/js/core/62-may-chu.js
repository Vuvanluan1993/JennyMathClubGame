/* ===================== Máy chủ Firebase (24/10/2026) =====================
   Dùng chung dữ liệu thật giữa app học sinh, trang giáo viên, phụ huynh, quản lý.
   Firestore (xem firebase/firestore.rules):
     users/{uid} {role: ql|gv|hs|ph, tk, ten, gvId?, con?[], khoi?}
     org/main    {j: JSON dữ liệu trung tâm, gd:{tk:lớp}, pc:{gvId:[lớp]}, admins:[uid], t}
     hs/{tk}     {j: JSON dữ liệu học của em (em ghi), ev: JSON sự kiện gần đây, lop, t}
     hsgv/{tk}   {j: JSON nhận xét/thẻ/ghi chú/bỏ qua của cô (cô ghi), t}
     asg/{id}    {j: JSON bài về nhà, lop, t}
   Tên đăng nhập (tk) → email ẩn tk@jenny-lop-hoc-ao.firebaseapp.com (trẻ không cần email thật).
   P-04 (25/10/2026): rules siết — org/main cần hồ sơ users; users chỉ chính chủ/QL; hs/{tk} em chỉ ghi j, ev, lop, t;
     asg đọc/ghi theo lớp (truy vấn phải lọc where lop); login/{tk} chỉ get đúng 1 bản ghi khi email ẩn chuẩn sai. */
/* P-21 (27/10/2026): cấu hình web Firebase nằm MỘT chỗ ở firebase/cau-hinh.json (khối that = dự án thật, thu = dự án thử). Lúc dựng, tools/vite/vai.js
   thay __FB_CAU_HINH__ bằng khối theo biến môi trường FB_ENV (mặc định that); FB_ENV=thu còn chèn dải "Bản thử" ở thanh trên. Chưa thay thì JSON.parse ném lỗi ngay khi nạp (cố ý: không âm thầm trỏ sai dự án).
   appCheckKey (P-05): khoá site reCAPTCHA v3 của App Check, ghi trong cau-hinh.json; để trống = không bật. Chỉ theo dõi, chưa Enforce (xem docs/FIREBASE-CONSOLE.md). */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { hd } from './02-hanh-dong.js';
import { newStudent, save } from './09-du-lieu-demo.js';
import { render, toast } from './13-giao-dien-chung.js';
import { fbNghe, fbTietKiem } from './63-firestore-tiet-kiem.js';
import { XU_THUONG, xuBangGia, xuBoot, xuOn, xuViTu } from './64-xu.js';
export const FB_CFG=JSON.parse('__FB_CAU_HINH__');
export const FB_VER='10.12.2',GV_F=['comments','badges','gvNote','gvSkip'];
export let FB=null;globalThis.CLOUD=null;export let fbSub=[], fbLast={}, fbHen=null, fbDangGhi=false, fbBan=0;/* fbBan: số lượt ghi đang chờ máy chủ */
const fbEmail=tk=>`${String(tk).trim().toLowerCase()}@jenny-lop-hoc-ao.firebaseapp.com`;
const fbTkOk=tk=>/^[a-z0-9][a-z0-9._-]{2,23}$/.test(tk);
function fbNap(){if(window.firebase&&firebase.firestore&&firebase.auth)return Promise.resolve();
  const SRI={app:'sha384-AQ3POAMqIhwS81FrUH95ekxqBZHeP5tG2JfEL3+7GuTtfRLWnrRh32UxwzM+//A9',auth:'sha384-TnlRYaR4JYz/lpaGuaiU61PjNberSA4vjLjtF+oRC/IkohkJqnWxw5EmDSOt1vA1',firestore:'sha384-qn4Jh88HhJA8dplNQyGjOh9OGI4izVhrfj/qIFgaKcdgOE06pXqIKGlsCILZcLAC','app-check':'sha384-E3vxFxXu8FhW5kvqdQJ5Yf8ugrV7iCJP8jgnItRH2Rk8Q08cJzJGTi/oMC3FEp3j'};/* SRI cho FB_VER 10.12.2 — đổi FB_VER thì tính lại, xem docs/SRI.md */
  const one=n=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-${n}-compat.js`;s.integrity=SRI[n];s.crossOrigin='anonymous';s.onload=ok;s.onerror=()=>no({code:'network',message:'Không tải được Firebase. Kiểm tra mạng.'});document.head.appendChild(s)});
  let p=one('app').then(()=>one('auth')).then(()=>one('firestore'));if(FB_CFG.appCheckKey)p=p.then(()=>one('app-check'));return p}
export async function fbInit(){await fbNap();if(!FB){const cfg=Object.assign({},FB_CFG);delete cfg.appCheckKey;const app=firebase.apps.length?firebase.app():firebase.initializeApp(cfg);
  if(FB_CFG.appCheckKey&&firebase.appCheck){try{firebase.appCheck(app).activate(FB_CFG.appCheckKey,true)}catch(e){console.warn('App Check chưa bật được:',e)}}
  FB={app,auth:app.auth(),db:app.firestore()};
  if(typeof fbTietKiem==='function')fbTietKiem();/* P-21 (63): bộ nhớ đệm bền + đếm đọc ghi; phải chạy trước lần đọc đầu */}return FB}
export function fbLoi(...a){return hooks.goi('fbLoi',this,a)}
hooks.ham('fbLoi',function(e){const c=(e&&e.code)||'';return({'chua-lop':'Tài khoản của em chưa được xếp lớp. Em nhờ cô giáo nhé!','auth/invalid-credential':'Tên đăng nhập hoặc mật khẩu chưa đúng.','auth/invalid-login-credentials':'Tên đăng nhập hoặc mật khẩu chưa đúng.','auth/wrong-password':'Mật khẩu chưa đúng.','auth/user-not-found':'Không có tài khoản này.','auth/too-many-requests':'Thử sai nhiều lần. Đợi vài phút rồi thử lại.','auth/network-request-failed':'Không kết nối được mạng.','auth/email-already-in-use':'Tên đăng nhập này đã có người dùng.','auth/weak-password':'Mật khẩu cần ít nhất 6 kí tự.','auth/invalid-email':'Tên đăng nhập không hợp lệ.','auth/requires-recent-login':'Phiên đăng nhập đã cũ. Đăng xuất, đăng nhập lại rồi làm tiếp.','permission-denied':'Tài khoản không có quyền làm việc này.','no-profile':'Tài khoản chưa được gán vai trò. Hỏi quản lý trung tâm.','network':e.message})[c]||('Có lỗi: '+((e&&e.message)||e))});
export const fbJ=s=>{try{return JSON.parse(s)}catch(e){return null}};
export const fbTach=st=>{const a={},b={};Object.keys(st||{}).forEach(k=>(GV_F.includes(k)?b:a)[k]=st[k]);GV_F.forEach(k=>{if(b[k]===undefined)b[k]=k==='gvSkip'?{}:[]});if(typeof xuOn==='function'&&xuOn()){delete a.coins;delete a.items}return{hs:a,gv:b}};/* P-20: xu, quà trùm ở ví vi/{tk}, không còn trong hs.j */
export const fbTS=()=>firebase.firestore.FieldValue.serverTimestamp();
/* bài về nhà của một lớp (rules P-04 chỉ cho đọc asg theo lớp nên phải lọc ngay trong truy vấn; bản giả lập trong test không có where) */
const fbAsgLop=(db,l)=>{const c=db.collection('asg');return c.where?c.where('lop','==',l):c};
const fbNgay=()=>Math.max(1,Math.floor((Date.now()-Date.UTC(2026,8,5))/864e5)+1);

async function fbDangNhap(tk,pw,nho){const{auth}=await fbInit();try{await auth.setPersistence(nho===false?firebase.auth.Auth.Persistence.SESSION:firebase.auth.Auth.Persistence.LOCAL)}catch(e){}
  tk=String(tk).trim().toLowerCase();const em=fbEmail(tk);
  /* 28/10/2026 (sửa lại P-04): tra login/{tk} TRƯỚC khi đăng nhập (1 lần đọc; rules chỉ cho get đúng 1 bản ghi, không liệt kê).
     Gói miễn phí không đổi được mật khẩu người khác nên QL đặt lại = tạo tài khoản Auth mới (email ẩn khác, ghi ở login/{tk}) và chuyển hồ sơ sang;
     tài khoản Auth cũ (email chuẩn) vẫn nhận mật khẩu cũ. Thử email chuẩn trước thì mật khẩu cũ trùng mật khẩu mới (vd cùng jenny@123) vào nhầm
     tài khoản cũ, không còn hồ sơ → "chưa được gán vai trò". Có login/{tk} → chỉ dùng email mới; mật khẩu không khớp mới thử email chuẩn
     (phòng login/ cũ còn sót sau khi tạo lại tên đăng nhập), và vào được tài khoản cũ mà không có hồ sơ thì báo sai mật khẩu. */
  let em2='';try{const L=await FB.db.doc('login/'+tk).get();const x=L.exists&&L.data().email?String(L.data().email):'';if(x&&x!==em)em2=x}catch(x){}
  let c;try{c=await auth.signInWithEmailAndPassword(em2||em,pw)}
  catch(e){if(!em2||!/^auth\/(invalid-credential|invalid-login-credentials|user-not-found|wrong-password)$/.test((e&&e.code)||''))throw e;
    c=await auth.signInWithEmailAndPassword(em,pw)}
  try{return await fbNapMe(c.user)}catch(e){if(e&&e.code==='no-profile'&&em2&&c.user.email===em)throw{code:'auth/invalid-credential'};throw e}}
async function fbNapMe(user){const d=await FB.db.doc('users/'+user.uid).get();if(!d.exists)throw{code:'no-profile'};CLOUD={uid:user.uid,me:d.data()};
  if(CLOUD.me.mustChange)await fbBatDoiMK(user);return CLOUD}
/* P-05: đăng xuất xoá dấu vết trên máy dùng chung — bản lưu học sinh jennyHSc_* (chỉ khi đã đẩy xong lên máy chủ),
   khoá demo jennyVirtualDemo_v10 (trang cô/QL ghi mọi em vào đó), mật khẩu nhớ trong phiên (qlMK) */
async function fbDangXuat(){fbSub.forEach(f=>{try{f()}catch(e){}});fbSub=[];let sach=true;try{await fbDayNgay()}catch(e){sach=false}
  try{const me=CLOUD&&CLOUD.me;if(me&&me.role==='hs'){const st=S.st[me.tk];if(!navigator.onLine||fbBan>0||(st&&fbLast['hs/'+me.tk]!==JSON.stringify(fbTach(st).hs)))sach=false}
    Object.keys(localStorage).forEach(k=>{if(k==='jennyVirtualDemo_v10'||(sach&&k.startsWith('jennyHSc_')))localStorage.removeItem(k)});
    window.qlMK={};fbMKPhien.length=0}catch(e){}
  try{await FB.auth.signOut()}catch(e){}CLOUD=null;location.reload()}
/* ---------- mật khẩu (P-05): ngẫu nhiên 8 kí tự dễ đọc, hộp thoại pixel thay prompt(), bắt đổi lần đầu ---------- */
/* 28/10/2026 (thầy chốt): đặt lại mật khẩu (một người hay cả lớp) luôn mặc định jenny@123; vẫn phải tự đổi khi đăng nhập lần sau (mustChange). Tạo tài khoản mới vẫn ngẫu nhiên. */
const MK_DAT_LAI='jenny@123';
export function fbMKGoiY(){const C='bdghkmnprstvx',V='aeiou',r=n=>Math.floor(Math.random()*n);let s='';for(let i=0;i<2;i++)s+=C[r(C.length)]+V[r(V.length)];return s+String(1000+r(9000))}
export const fbMKLoi=(a,b)=>a.length<8?'Mật khẩu cần ít nhất 8 kí tự.':!(/[a-z]/i.test(a)&&/\d/.test(a))?'Mật khẩu cần có cả chữ và số.':a!==b?'Hai lần nhập chưa giống nhau.':'';
const fbMKPhien=[];export function fbMKNho(tk,pw){window.qlMK=window.qlMK||{};qlMK[tk]=pw;const i=fbMKPhien.findIndex(x=>x.tk===tk);if(i>=0)fbMKPhien.splice(i,1);fbMKPhien.unshift({tk,pw})}
/* fbHoiMK({tieuDe, loiNhan, goiY, nhacLai, batBuoc, nut, luu}) → Promise<mật khẩu | null>. luu(pw) chạy trong hộp; lỗi hiện tại chỗ. */
function fbHoiMK(o){o=o||{};return new Promise(res=>{const el=document.createElement('div');el.className='gdov fbmk';
  el.innerHTML=`<div class="gdbox fbmkbox" role="dialog" aria-modal="true"><div class="gdhd"><b>${esc(o.tieuDe||'Mật khẩu mới')}</b>${o.batBuoc?'':'<button type="button" class="gdx" data-x aria-label="Đóng">✕</button>'}</div>
   <form class="fbmkf" autocomplete="off"><p>${esc(o.loiNhan||'Ít nhất 8 kí tự, có cả chữ và số.')}</p>
   <label>Mật khẩu mới<input name="a" type="${o.goiY?'text':'password'}" autocomplete="new-password" autocapitalize="off" spellcheck="false" maxlength="30" value="${esc(o.goiY||'')}"></label>
   ${o.nhacLai?`<label>Nhập lại<input name="b" type="password" autocomplete="new-password" autocapitalize="off" spellcheck="false" maxlength="30"></label>`:''}
   <label class="fbmkhien"><input type="checkbox" data-hien ${o.goiY?'checked':''}> Hiện mật khẩu</label>
   <div class="fbmkerr" aria-live="polite"></div><button class="btn pri" type="submit">${esc(o.nut||'Đồng ý')}</button></form></div>`;
  document.body.appendChild(el);const f=el.querySelector('form'),err=el.querySelector('.fbmkerr'),nut=f.querySelector('button[type=submit]');
  const dong=v=>{el.remove();res(v)};const x=el.querySelector('[data-x]');if(x)x.onclick=()=>dong(null);
  el.querySelector('[data-hien]').onchange=function(){f.querySelectorAll('input[name]').forEach(i=>i.type=this.checked?'text':'password')};
  f.onsubmit=async ev=>{ev.preventDefault();const a=f.a.value,b=o.nhacLai?f.b.value:a;const l=fbMKLoi(a,b);if(l){err.textContent=l;return}
    if(!o.luu){dong(a);return}nut.disabled=true;err.textContent='Đang lưu…';
    try{await o.luu(a);dong(a)}catch(e){err.textContent=fbLoi(e);nut.disabled=false}};
  setTimeout(()=>{try{f.a.focus()}catch(e){}},30)})}
/* lần đầu đăng nhập (users.mustChange) → phải đặt mật khẩu riêng; rules chỉ cho chính chủ đổi mustChange thành false */
async function fbBatDoiMK(user){const hs=CLOUD.me.role==='hs';
  await fbHoiMK({batBuoc:true,nhacLai:true,tieuDe:hs?'Đặt mật khẩu của em':'Đặt mật khẩu mới',nut:hs?'Xong!':'Lưu mật khẩu',
    loiNhan:hs?'Lần đầu vào lớp, em đặt mật khẩu riêng của mình nhé: ít nhất 8 kí tự, có cả chữ và số. Nhớ kĩ!':'Mật khẩu tạm chỉ dùng một lần. Đặt mật khẩu mới: ít nhất 8 kí tự, có cả chữ và số.',
    luu:async p=>{try{await user.updatePassword(p)}catch(e){if(e&&e.code==='auth/requires-recent-login'){setTimeout(async()=>{try{await FB.auth.signOut()}catch(x){}location.reload()},2500)}throw e}
      await FB.db.doc('users/'+user.uid).update({mustChange:false});CLOUD.me.mustChange=false}})}
async function fbDoiMK(){const p=await fbHoiMK({tieuDe:'Đổi mật khẩu',nhacLai:true,nut:'Đổi',luu:async p=>{await FB.auth.currentUser.updatePassword(p)}});if(p)toast('Đã đổi mật khẩu')}
/* tạo tài khoản cho người khác bằng một phiên phụ (không làm đăng xuất quản lý) */
export async function fbTaoTK(tk,pw){await fbInit();const app2=firebase.apps.find(a=>a.name==='tao')||firebase.initializeApp(FB.app.options,'tao');
  const c=await app2.auth().createUserWithEmailAndPassword(fbEmail(tk),pw);const uid=c.user.uid;await app2.auth().signOut();return uid}
/* thiết lập lần đầu: tài khoản quản lý đầu tiên + dữ liệu trung tâm trống */
/* Thứ tự (sửa 27/10/2026, P-21): KHÔNG đọc org/main trước khi có hồ sơ users (rules chỉ cho đọc khi hasMe() → trên dự án trống báo permission-denied).
   1) tạo tài khoản Auth; 2) ghi thẳng org/main — rules chỉ cho create khi chưa có (admins == [uid]); đã có thì set thành update, bị từ chối vì chưa isQL
   → đó chính là "trung tâm đã có quản lý" (xoá lại tài khoản Auth vừa tạo); 3) tạo users/{uid} role ql SAU org/main vì rules cần uid ∈ org().admins. Rules không đổi. */
async function fbThietLap(ten,tk,pw){const{auth,db}=await fbInit();const ref=db.doc('org/main');
  const c=await auth.createUserWithEmailAndPassword(fbEmail(tk),pw);const uid=c.user.uid;
  const org={ten:'Clb Học Toán cùng Jenny',nam:'2026–2027',gv:[{id:tk,ten,tk}],lop:[],gd:{},nl:{},nk:[],mo:{},hs:[],ph:{},v:2,cloud:1,mauHS4:1,mauHS5:1,mauHS6:1,mauHS7:1,mauHS3:1,mauHS2:1,mauHS:1};
  try{await ref.set({j:JSON.stringify(org),gd:{},pc:{},admins:[uid],t:fbTS()})}
  catch(e){if(e&&e.code==='permission-denied'){try{await c.user.delete()}catch(_){}throw{code:'x',message:'Trung tâm đã có quản lý. Hãy đăng nhập.'}}throw e}
  await db.doc('users/'+uid).set({role:'ql',tk,ten,gvId:tk});return fbNapMe(c.user)}

/* ---------- ghi lên máy chủ (gom lại 1,5 giây) ---------- */
{hooks.on('save',_s=>function(){const r=_s.apply(this,arguments);try{if(CLOUD&&!fbDangGhi){clearTimeout(fbHen);fbHen=setTimeout(fbDay,1500)}}catch(e){}return r})}
export function fbDayNgay(...a){return hooks.goi('fbDayNgay',this,a)}
hooks.ham('fbDayNgay',function(){clearTimeout(fbHen);return fbDay()});
function fbOrgSach(){const o=Object.assign({},S.org);['hsOn'].forEach(k=>delete o[k]);return o}
function fbPc(o){const pc={};(o.lop||[]).forEach(l=>(l.gv||[]).forEach(g=>{(pc[g]=pc[g]||[]).push(l.id)}));return pc}
export async function fbDay(){if(!CLOUD||!FB)return;const db=FB.db,me=CLOUD.me,ghi=[];
  try{
  if(me.role==='hs'){const tk=me.tk,st=S.st[tk];if(!st)return;const j=JSON.stringify(fbTach(st).hs),ev=JSON.stringify((S.events||[]).filter(e=>e.actor.account.name===tk).slice(-200));
    if(fbLast['hs/'+tk]!==j||fbLast['ev/'+tk]!==ev){fbLast['hs/'+tk]=j;fbLast['ev/'+tk]=ev;ghi.push(db.doc('hs/'+tk).set({j,ev,lop:(S.lopHS||''),t:fbTS()}))}}
  else if(me.role==='ql'||me.role==='gv'){
    if(S.org){const o=fbOrgSach(),j=JSON.stringify(o);if(fbLast['org/main']!==j){fbLast['org/main']=j;
      ghi.push(me.role==='ql'?db.doc('org/main').set({j,gd:o.gd||{},pc:fbPc(o),t:fbTS()},{merge:true}):db.doc('org/main').update({j,t:fbTS()}))}}
    Object.keys(S.st).forEach(tk=>{if(!fbLast.hasOwnProperty('hsgv/'+tk))return;const j=JSON.stringify(fbTach(S.st[tk]).gv);if(fbLast['hsgv/'+tk]!==j){fbLast['hsgv/'+tk]=j;ghi.push(db.doc('hsgv/'+tk).set({j,t:fbTS()}))}});
    const co=new Set();(S.asg||[]).forEach(a=>{co.add(a.id);if(me.role==='gv'&&!a.lop){console.warn('Bài '+a.id+' chưa có lớp, máy chủ không nhận (P-04)');return}const j=JSON.stringify(a);if(fbLast['asg/'+a.id]!==j){fbLast['asg/'+a.id]=j;ghi.push(db.doc('asg/'+a.id).set({j,lop:a.lop||'',t:fbTS()}))}});
    Object.keys(fbLast).filter(k=>k.startsWith('asg/')&&!co.has(k.slice(4))).forEach(k=>{delete fbLast[k];ghi.push(db.doc(k).delete())});
  }
  if(ghi.length){fbBan++;try{await Promise.all(ghi)}finally{fbBan--}fbTrangThai('Đã lưu lên máy chủ')}
  }catch(e){console.error(e);fbTrangThai('Chưa lưu được: '+fbLoi(e),1)}}
function fbTrangThai(...a){return hooks.goi('fbTrangThai',this,a)}
hooks.ham('fbTrangThai',function(t,loi){const el=document.getElementById('fbSt');if(el){el.textContent=t;el.classList.toggle('loi',!!loi)}});

/* ---------- học sinh ---------- */
export function fbHsBoot(...a){return hooks.goi('fbHsBoot',this,a)}
hooks.ham('fbHsBoot',function(...a){return hooks.goi('fbHsBoot',this,a)});
hooks.ham('fbHsBoot',async function(){const me=CLOUD.me,tk=me.tk,db=FB.db;
  const [h,o]=await Promise.all([db.doc('hs/'+tk).get(),db.doc('org/main').get()]);
  const org=o.exists?fbJ(o.data().j)||{}:{},lop=(org.gd||{})[tk]||'',L=(org.lop||[]).find(l=>l.id===lop),khoi=(L&&L.khoi)||me.khoi||1;
  if(!L)throw{code:'chua-lop'};
  let st=h.exists?fbJ(h.data().j):null;const ev=h.exists?fbJ(h.data().ev||'[]')||[]:[];
  if(st&&st.grade!==khoi&&!ev.length){const gt=st.gender;st=newStudent(me.ten||tk,khoi);if(gt)st.gender=gt}
  if(!st)st=newStudent(me.ten||tk,khoi);if(me.ten)st.name=me.ten;
  st.active=!!((L&&L.tj&&L.tj.on)||(org.nl||{})[tk]);
  S={day:fbNgay(),events:ev,open:Object.assign({},(org.mo||{})[lop]||{}),st:{[tk]:st},cbi:{},asg:[],asgSeed:2,lopHS:lop};
  STUDENTS=[[tk,st.name,st.grade]];sid=tk;role='hs';KEY='jennyHSc_'+tk;
  fbLast['hs/'+tk]=JSON.stringify(fbTach(st).hs);fbLast['ev/'+tk]=JSON.stringify(ev);
  const mine=a=>a.hs?a.hs.includes(tk):(a.lop?a.lop===lop:a.g===st.grade&&!a.mau);
  fbSub.push(fbNghe(fbAsgLop(db,lop),q=>{S.asg=q.docs.map(d=>fbJ(d.data().j)).filter(a=>a&&mine(a));fbVe()},e=>console.error(e)));
  fbSub.push(fbNghe(db.doc('hsgv/'+tk),d=>{const g=d.exists?fbJ(d.data().j)||{}:{};GV_F.forEach(k=>{if(g[k]!==undefined)S.st[tk][k]=g[k]});fbVe()},e=>{}));
  fbSub.push(fbNghe(db.doc('org/main'),d=>{const og=d.exists?fbJ(d.data().j)||{}:{};S.open=Object.assign({},(og.mo||{})[lop]||{});const L2=(og.lop||[]).find(l=>l.id===lop);S.st[tk].active=!!((L2&&L2.tj&&L2.tj.on)||(og.nl||{})[tk]);fbVe()},e=>{}));
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
});
let fbVeHen=null;export function fbVe(){clearTimeout(fbVeHen);fbVeHen=setTimeout(()=>{try{const g=scr;if(g&&(g.k==='game'||g.k==='mini'||g.k==='xg')&&!g.end)return;render()}catch(e){}},120)}

/* ---------- giáo viên / quản lý / phụ huynh ---------- */
const fbDaNghe=new Set();
function fbGvBoot(...a){return hooks.goi('fbGvBoot',this,a)}
hooks.ham('fbGvBoot',async function(){const me=CLOUD.me,db=FB.db;document.body.classList.add('cloud');
  window.dayNow=fbNgay;
  S={day:fbNgay(),events:[],st:{},cbi:{},asg:[],asgSeed:2,mk2:1,org:null};STUDENTS.length=0;
  role=window.TRANG||(me.role==='ph'?'ph':'gv');gvMe=me.gvId||me.tk;gvLop=null;scr={k:'home'};
  await new Promise(ok=>{let lan=0;
    fbSub.push(fbNghe(db.doc('org/main'),d=>{if(d.exists&&d.data().v===3&&!V3.on){fbTaiLai();return}const j=d.exists?d.data().j:null;if(!j){ok();return}
      if(j!==fbLast['org/main']||!S.org){fbLast['org/main']=j;const o=fbJ(j);o.cloud=1;o.v=2;['mauHS','mauHS2','mauHS3','mauHS4','mauHS5','mauHS6','mauHS7'].forEach(k=>o[k]=1);
        const giu=S.org&&Object.getOwnPropertyDescriptor(S,'open');S.org=o;fbDanhSach();if(lan++)fbVe()}ok()},e=>{console.error(e);ok()}))});
  /* bài về nhà (P-04): QL nghe cả kho; GV nghe từng lớp mình dạy; PH nghe lớp của con — rules chỉ cho đọc theo lớp */
  const o=S.org||{},gvId=me.gvId||me.tk;
  const lops=me.role==='ql'?[null]:me.role==='ph'?[...new Set((me.con||[]).map(c=>(o.gd||{})[c]).filter(Boolean))]
    :[...new Set((o.lop||[]).filter(l=>(l.gv||[]).includes(gvId)).map(l=>l.id))];
  const theoLop={};const gop=()=>{const A=[];Object.values(theoLop).forEach(L=>L.forEach(a=>A.push(a)));S.asg=A;fbVe()};
  lops.forEach(l=>{const q=l===null?db.collection('asg'):fbAsgLop(db,l);
    fbSub.push(fbNghe(q,s=>{const A=[];s.docs.forEach(d=>{const j=d.data().j;if(me.role!=='ph')fbLast['asg/'+d.id]=j;const a=fbJ(j);if(a)A.push(a)});theoLop[l===null?'*':l]=A;gop()},e=>console.error('asg',l,e)))});
});
/* danh sách em được xem: quản lý = tất cả; giáo viên = lớp được phân công; phụ huynh = con */
function fbDanhSach(){const o=S.org,me=CLOUD.me;if(!o)return;
  const ds=(o.hs||[]).filter(([tk])=>me.role==='ql'||(me.role==='ph'?(me.con||[]).includes(tk):(o.lop||[]).some(l=>l.id===(o.gd||{})[tk]&&(l.gv||[]).includes(me.gvId||me.tk))));
  STUDENTS.length=0;ds.forEach(r=>{STUDENTS.push(r);if(!S.st[r[0]])S.st[r[0]]=newStudent(r[1],r[2]);fbNgheHS(r[0])});
  if(me.role==='ph'&&!ds.some(r=>r[0]===sid)&&ds[0])sid=ds[0][0];}
/* P-20: cô/QL/PH đọc xu từ ví vi/{tk} (hs.j không còn coins); fbVi[tk] = null khi em chưa có ví */
export const fbVi={},fbHsDa={};
function fbViAp(tk){const v=fbVi[tk],st=S.st[tk];if(v&&st){st.coins=Math.max(0,Math.round(+v.coins||0));if(typeof XU_THUONG!=='undefined')st.items=Object.keys(v.items||{}).filter(n=>XU_THUONG.includes(n))}}
function fbNgheHS(tk){if(fbDaNghe.has(tk))return;fbDaNghe.add(tk);const db=FB.db;
  fbSub.push(fbNghe(db.doc('vi/'+tk),d=>{fbVi[tk]=d.exists?d.data():null;fbViAp(tk);fbVe()},e=>{}));
  fbSub.push(fbNghe(db.doc('hs/'+tk),d=>{fbHsDa[tk]=1;if(!d.exists)return;const x=d.data(),st=fbJ(x.j);if(!st)return;const cu=S.st[tk]||{};GV_F.forEach(k=>{if(cu[k]!==undefined)st[k]=cu[k]});S.st[tk]=st;fbViAp(tk);
    const ev=fbJ(x.ev||'[]')||[];S.events=S.events.filter(e=>e.actor.account.name!==tk).concat(ev).sort((a,b)=>String(a.timestamp).localeCompare(String(b.timestamp)));fbVe()},e=>console.error('hs',tk,e)));
  fbSub.push(fbNghe(db.doc('hsgv/'+tk),d=>{const j=d.exists?d.data().j:JSON.stringify(fbTach(S.st[tk]||{}).gv);fbLast['hsgv/'+tk]=j;const g=fbJ(j)||{};if(S.st[tk])GV_F.forEach(k=>{if(g[k]!==undefined)S.st[tk][k]=g[k]});fbVe()},e=>console.error('hsgv',tk,e)));}

/* ---------- quản lý tạo tài khoản thật ---------- */
const fbKhongDau=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
async function fbQLTaoHS(e){e.preventDefault();const o=S.org,n=document.getElementById('nhTen').value.trim().replace(/\s+/g,' '),lid=document.getElementById('nhLop').value,l=lopById(lid);
  let tk=(document.getElementById('nhTk').value||'').trim().toLowerCase();const pw=fbMKTao(document.getElementById('nhPw').value);
  if(n.split(' ').length<2){toast('Nhập đủ họ và tên');return}
  if(!tk){const g=fbKhongDau(n).split(' ');tk=(g.pop()+g.map(x=>x[0]).join('')).replace(/[^a-z0-9]/g,'');let t=tk,i=2;while((o.hs||[]).some(r=>r[0]===t))t=tk+(i++);tk=t}
  if(!fbTkOk(tk)){toast('Tên đăng nhập 3–24 kí tự: chữ thường không dấu, số, dấu chấm');return}if(fbMKLoi(pw,pw)){toast(fbMKLoi(pw,pw));return}
  if((o.hs||[]).some(r=>r[0]===tk)){toast('Tên đăng nhập đã có');return}
  toast('Đang tạo tài khoản…');
  try{const uid=await fbTaoTK(tk,pw),db=FB.db,st=newStudent(n,l?l.khoi:1);
    await db.doc('users/'+uid).set({role:'hs',tk,ten:n,khoi:l?l.khoi:0,mustChange:true});
    await db.doc('hs/'+tk).set({j:JSON.stringify(fbTach(st).hs),ev:'[]',lop:l?lid:'',t:fbTS()});
    await db.doc('vi/'+tk).set({coins:0,items:{},pets:{},tudo:{},t:fbTS()});/* P-20: ví xu */
    (o.hs=o.hs||[]).push([tk,n,l?l.khoi:0]);if(l)o.gd[tk]=lid;(o.nk=o.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Tạo tài khoản ${n} (${tk})`+(l?` · lớp ${lid}`:' · chưa xếp lớp')});
    fbMKNho(tk,pw);S.st[tk]=st;fbDanhSach();save();await fbDayNgay();render();toast(`Đã tạo tài khoản ${tk}. Mật khẩu tạm trên phiếu in (In phiếu).`)}catch(err){toast(fbLoi(err))}}
/* mật khẩu khi tạo tài khoản: ô để trống hoặc còn mặc định cũ → ngẫu nhiên; QL gõ thì phải đủ mạnh (fbMKLoi) */
export const fbMKTao=v=>{v=String(v||'').trim();return(!v||/^jenny\d{3}$/.test(v))?fbMKGoiY():v};/* 'jenny' + 3 số = mặc định cũ → coi như trống */
async function fbQLTaoGV(e){e.preventDefault();const o=S.org,n=document.getElementById('ngTen').value.trim(),tk=(document.getElementById('ngTk').value||'').trim().toLowerCase(),pw=fbMKTao(document.getElementById('ngPw').value);
  if(n.length<3){toast('Nhập tên giáo viên');return}if(!fbTkOk(tk)){toast('Tên đăng nhập 3–24 kí tự: chữ thường không dấu, số, dấu chấm');return}if(fbMKLoi(pw,pw)){toast(fbMKLoi(pw,pw));return}
  if((o.gv||[]).some(g=>g.id===tk)){toast('Đã có giáo viên này');return}toast('Đang tạo tài khoản…');
  try{const uid=await fbTaoTK(tk,pw);await FB.db.doc('users/'+uid).set({role:'gv',tk,ten:n,gvId:tk,mustChange:true});
    o.gv.push({id:tk,ten:n,tk});o.nk.push({d:S.day,ai:'Quản lý trung tâm',t:`Tạo tài khoản giáo viên ${n} (${tk})`});fbMKNho(tk,pw);save();await fbDayNgay();render();toast(`Đã tạo tài khoản ${tk}. Mật khẩu tạm ở mục Tài khoản.`)}catch(err){toast(fbLoi(err))}}
async function fbQLTaoPH(e){e.preventDefault();const o=S.org,con=document.getElementById('phHs').value,tk=(document.getElementById('phTk').value||'').trim().toLowerCase(),pw=fbMKTao(document.getElementById('phPw').value);
  const r=(o.hs||[]).find(x=>x[0]===con);if(!r){toast('Chọn học sinh');return}if(!fbTkOk(tk)){toast('Tên đăng nhập 3–24 kí tự: chữ thường không dấu, số, dấu chấm');return}if(fbMKLoi(pw,pw)){toast(fbMKLoi(pw,pw));return}
  toast('Đang tạo tài khoản…');
  try{const uid=await fbTaoTK(tk,pw);await FB.db.doc('users/'+uid).set({role:'ph',tk,ten:'Phụ huynh '+r[1],con:[con],mustChange:true});
    (o.ph=o.ph||{})[con]=tk;o.nk.push({d:S.day,ai:'Quản lý trung tâm',t:`Tạo tài khoản phụ huynh ${tk} cho ${r[1]}`});fbMKNho(tk,pw);save();await fbDayNgay();render();toast(`Đã tạo tài khoản ${tk}. Mật khẩu tạm trên phiếu in.`)}catch(err){toast(fbLoi(err))}}
{const _h=window.qlTaoHS,_g=window.qlTaoGV;window.qlTaoHS=e=>S.org&&S.org.cloud?fbQLTaoHS(e):_h(e);window.qlTaoGV=e=>S.org&&S.org.cloud?fbQLTaoGV(e):_g(e);window.qlTaoPH=fbQLTaoPH}

/* ---------- quản lý đặt lại mật khẩu (gói miễn phí không đổi được mật khẩu người khác,
   nên tạo tài khoản đăng nhập mới cho cùng tên đăng nhập, chuyển vai trò sang, bỏ tài khoản cũ; dữ liệu học giữ nguyên) ---------- */
/* phần lõi, không giao diện: tạo tài khoản Auth mới (email ẩn khác), chuyển hồ sơ sang, bắt đổi mật khẩu lần sau, ghi login/{tk} */
async function fbDatLaiMKLoi(tk,pw){const db=FB.db;
  const q=await db.collection('users').where('tk','==',tk).get();if(q.empty)throw{code:'x',message:'Không tìm thấy tài khoản '+tk};
  const L=await db.doc('login/'+tk).get(),cu=L.exists?L.data().uid:null,docCu=q.docs.find(d=>d.id===cu)||q.docs[0],du=Object.assign({},docCu.data(),{mustChange:true});
  const em=`${tk}.r${Date.now().toString(36)}@jenny-lop-hoc-ao.firebaseapp.com`;
  await fbInit();const app2=firebase.apps.find(a=>a.name==='tao')||firebase.initializeApp(FB.app.options,'tao');const c=await app2.auth().createUserWithEmailAndPassword(em,pw);const uid=c.user.uid;await app2.auth().signOut();
  await db.doc('users/'+uid).set(du);await db.doc('login/'+tk).set({email:em,t:fbTS()});/* P-04: không ghi uid (bản ghi này get được công khai) */await Promise.all(q.docs.map(d=>db.doc('users/'+d.id).delete()));
  (S.org.nk=S.org.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Đặt lại mật khẩu cho ${tk}`});fbMKNho(tk,pw)}
async function fbDatLaiMK(tk){const pw=await fbHoiMK({tieuDe:`Đặt lại mật khẩu: ${tk}`,goiY:MK_DAT_LAI,nut:'Đặt lại',loiNhan:`Mật khẩu tạm mặc định ${MK_DAT_LAI} (sửa được); người dùng sẽ phải tự đổi khi đăng nhập.`});if(!pw)return;
  toast('Đang đặt lại…');try{await fbDatLaiMKLoi(tk,pw);save();render();toast(`Đã đặt lại mật khẩu cho ${tk}: ${pw}. Bấm 🖨 In phiếu ở dòng 🔑 đầu trang.`)}catch(e){console.error(e);toast(fbLoi(e))}}
/* hộp xác nhận pixel (thay confirm()) */
function fbXacNhan(tieuDe,loiNhan,nut){return new Promise(res=>{const el=document.createElement('div');el.className='gdov fbmk';
  el.innerHTML=`<div class="gdbox fbmkbox" role="dialog" aria-modal="true"><div class="gdhd"><b>${esc(tieuDe)}</b><button type="button" class="gdx" data-x aria-label="Đóng">✕</button></div><div class="fbmkf"><p>${esc(loiNhan)}</p><div class="row" style="gap:8px;justify-content:flex-end"><button type="button" class="btn" data-x>Thôi</button><button type="button" class="btn pri" data-ok>${esc(nut||'Đồng ý')}</button></div></div></div>`;
  document.body.appendChild(el);el.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{el.remove();res(false)});el.querySelector('[data-ok]').onclick=()=>{el.remove();res(true)}})}
/* QL: đặt lại mật khẩu cả lớp về jenny@123 (MK_DAT_LAI), rồi in phiếu */
async function fbDatLaiMKLop(lid){const o=S.org,l=(o.lop||[]).find(x=>x.id===lid);if(!l)return;const ids=(o.hs||[]).filter(([tk])=>(o.gd||{})[tk]===lid).map(r=>r[0]);
  if(!ids.length){toast('Lớp chưa có học sinh');return}
  if(!await fbXacNhan(`Đặt lại mật khẩu cả lớp ${l.ten}`,`${ids.length} em sẽ có mật khẩu tạm ${MK_DAT_LAI}, lần đăng nhập sau phải tự đổi. Mật khẩu cũ không dùng được nữa. Xong sẽ mở phiếu in.`,'Đặt lại cả lớp'))return;
  const xong=[],loi=[];for(let i=0;i<ids.length;i++){const tk=ids[i];toast(`Đang đặt lại ${i+1}/${ids.length}: ${tk}…`);try{await fbDatLaiMKLoi(tk,MK_DAT_LAI);xong.push(tk)}catch(e){console.error(tk,e);loi.push(tk)}}
  save();render();toast(`Đã đặt lại ${xong.length} em`+(loi.length?`, lỗi ${loi.length}: ${loi.join(', ')}`:''));
  if(xong.length&&typeof window.qlInPhieu==='function')setTimeout(()=>{try{qlInPhieu(xong,'hs')}catch(e){}},300)}
/* 28/10/2026: bỏ bảng "Tài khoản" gom mọi vai trò (trùng 3 trang Học sinh/Giáo viên/Phụ huynh, không lọc, in mật khẩu ra trang).
   Thay bằng: nút 🔑 ở từng dòng (73) gọi fbDatLaiMK; dòng nhỏ fbMKPhienDong() chỉ đếm số mật khẩu tạm + nút In phiếu; hộp fbMayChuBox() ở trang chính Quản lý
   giữ các việc quản trị máy chủ (Nâng cấp v3, Ví xu — bọc ở dưới). */
export function fbMKPhienDong(){if(!CLOUD||CLOUD.me.role!=='ql'||!fbMKPhien.length)return'';const tks=fbMKPhien.map(x=>x.tk);
  return`<div class="qlnote fbmkp"><span>🔑 <b>${tks.length}</b> mật khẩu tạm trong phiên này (mất khi đăng xuất): ${esc(tks.slice(0,6).join(', '))}${tks.length>6?` … +${tks.length-6}`:''}</span><button type="button" class="btn sm pri" data-act="fbInMKPhien">🖨 In phiếu</button></div>`}
export function fbMayChuBox(){const o=S.org;if(!o||!o.cloud||!CLOUD||CLOUD.me.role!=='ql')return'';
  return`<section class="card"><h2>Máy chủ</h2><p class="muted" style="margin:4px 0 0">Dữ liệu trung tâm lưu trên Firebase <code>${esc((FB&&FB.app&&FB.app.options.projectId)||'')}</code>. Quên mật khẩu: bấm 🔑 ở dòng của người đó (trang Học sinh, Giáo viên, Phụ huynh); cả lớp: trang một lớp.</p></section>`}
{hooks.on('viewPH',_p=>function(){let r=_p.apply(this,arguments);try{if(role==='ql'&&CLOUD&&S.org&&S.org.cloud){
  /* P-05: trang một lớp → nút đặt lại mật khẩu cả lớp (75 chèn nút In phiếu vào cùng chỗ) */
  if(typeof qlTrang!=='undefined'&&qlTrang==='lopct')r=r.replace(/(<span class="pill">Khối \d+ · \d+ em<\/span><\/div>)/,`$1<div class="qlin"><button type="button" class="btn" data-act="fbDatLaiMKLop" ${hd.arg(String(qlLopId))}>🔑 Đặt lại mật khẩu cả lớp</button></div>`);
  return r}}catch(e){console.error(e)}return r})}

/* ---------- giao diện khi dùng máy chủ ---------- */
{hooks.on('header',_h=>function(){try{if(CLOUD&&S&&S.st&&!S.st[sid]){const f=STUDENTS.find(r=>S.st[r[0]]);if(f)sid=f[0];else S.st[sid]=newStudent('Chưa có học sinh',1)}}catch(e){}_h();try{if(!CLOUD||CLOUD.me.role==='hs')return;const me=CLOUD.me,t=document.getElementById('tabs');
  t.querySelectorAll('button').forEach(b=>{const k=b.dataset.ql!==undefined?'ql':b.dataset.act==='setRole'?hd.thamSo(b,'','setRole')[0]:null;
    const cho=me.role==='ql'?['gv','ql','ph']:me.role==='gv'?['gv']:['ph'];b.hidden=!cho.includes(k)||cho.length<2});
  const wb=document.getElementById('whoBox');wb.style.display=(role==='ph'&&STUDENTS.length>1)?'':'none';
  t.style.display=window.TRANG||![...t.querySelectorAll('button')].some(b=>!b.hidden)?'none':'';
  if(!document.getElementById('fbMe'))t.insertAdjacentHTML('afterend',`<div id="fbMe" class="fbme"><span class="pill">${esc(me.ten||me.tk)} · ${({ql:'Quản lý',gv:'Giáo viên',ph:'Phụ huynh'})[me.role]||''}</span><span id="fbSt" class="muted fbst"></span><button class="btn sm" data-act="fbDoiMK">Đổi mật khẩu</button><button class="btn sm" data-act="fbDangXuat">Đăng xuất</button></div>`)}catch(e){}})}
{hooks.on('gvMau',_g=>function(){if(S&&S.org&&S.org.cloud)return;return _g.apply(this,arguments)})}
{hooks.on('asgSeed',_a=>function(){if(CLOUD){S.asgSeed=2;return}return _a.apply(this,arguments)})}
{hooks.on('gvNow',_n=>function(){return CLOUD?Date.now():_n()})}
document.head.insertAdjacentHTML('beforeend',`<style>
body.cloud .demo{display:none!important}
body[class*="trang-"] #tabs{display:none!important}body.trang-gv #whoBox,body.trang-ql #whoBox{display:none!important}
.gdov.fbmk{z-index:10050}/* trên cả màn đăng nhập (gvGate/login 9999): hộp bắt đổi mật khẩu hiện ngay sau fbNapMe, trước khi gỡ màn đăng nhập */.fbmkbox{width:min(400px,100%)}.fbmkf{display:flex;flex-direction:column;gap:10px;padding:12px 14px;font-family:var(--f-body)}.fbmkf p{margin:0;font-size:15px;line-height:1.4}
.fbmkf label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:700}.fbmkf input[type=text],.fbmkf input[type=password]{font:inherit;font-size:18px;font-weight:400;padding:8px;border:3px solid #1F2A5A;background:#fff;letter-spacing:.5px}
.fbmkhien{flex-direction:row!important;align-items:center;font-weight:400!important}.fbmkerr{min-height:18px;font-size:13px;color:#B3261E}.fbmkerr:empty{display:none}
.fbme{display:flex;gap:6px;align-items:center;flex-wrap:wrap}@media(max-width:520px){.fbme{width:100%;order:5}.fbst{display:none}.fbme .btn{padding:6px 10px}}.fbst{font-size:12px}.fbst.loi{color:var(--coral)}
</style>`);

/* ===================== P-06a (25/10/2026): tách org/main.j thành nhiều document (dữ liệu v3) =====================
   org/main  {v:3, ten, nam, admins, gd:{tk:lớp}, pc:{gvId:[lớp]}, nl, nghi, xoa, namCu, t, j (bản cũ, giữ 30 ngày)}  QL ghi
   lop/{id}  {ten, khoi, gv:[gvId], tj:{on,han}, mo:{đảo mở}}      QL ghi; cô dạy lớp chỉ sửa mo
   hsdm/{tk} {ten, khoi, lop, ph}                                  danh mục, không PII: QL ghi; cô lớp / phụ huynh / em đọc
   hoso/{tk} {gt, ng, th, nam, dt, mail, hosoNam}                  PII: chỉ QL
   ph/{tk}   {ten, dt, mail}                                       PII phụ huynh: QL, chính chủ đọc
   gv/{id}   {ten, tk}                                             ai có hồ sơ cũng đọc
   nk/{id}   {d, ai, t, luc}                                       QL/cô thêm, không sửa xoá; QL đọc 200 dòng mới nhất
   Lớp tương thích: orgV3Gop(V3) dựng S.org đúng hình cũ cho mọi file; orgV3Tach(S.org) chiếu ngược ra từng doc;
   fbDay so từng doc với bản đã đồng bộ (fbLast) và chỉ ghi doc đổi; orgSet(path, value) sửa một chỗ rồi đẩy ngay.
   Bật khi org/main.v === 3 (nút "Nâng cấp dữ liệu v3" ở hộp Máy chủ, trang chính Quản lý). Trước đó vẫn chạy kiểu cũ (j). */
function fbTaiLai(){location.reload()}
const V3={on:false,main:null,lop:{},hsdm:{},hoso:{},gv:{},ph:{},nk:[],san:{}};
const V3_COLS=['lop','hsdm','hoso','gv','ph'];
const fbV3=()=>V3.on;
/* JSON chuẩn: khoá sắp xếp, bỏ undefined/null, bỏ t — để so sánh doc ở máy với doc máy chủ */
function fbJ3(x){const s=v=>{if(Array.isArray(v))return v.map(s);if(v&&typeof v==='object'&&!(v.toDate)){const o={};Object.keys(v).filter(k=>k!=='t'&&v[k]!==undefined&&v[k]!==null).sort().forEach(k=>o[k]=s(v[k]));return o}return v};return JSON.stringify(s(x))}
const fbSao=x=>JSON.parse(JSON.stringify(x===undefined?null:x));
/* org cũ → các doc (thuần, dùng cho nâng cấp và cho fbDay) */
function orgV3Tach(o){o=o||{};const D={main:{},lop:{},hsdm:{},hoso:{},gv:{},ph:{}};
  D.main={v:3,ten:o.ten||'',nam:o.nam||'',gd:fbSao(o.gd||{}),pc:fbPc(o),nl:fbSao(o.nl||{}),nghi:fbSao(o.nghi||{}),xoa:fbSao(o.xoa||[]),namCu:fbSao(o.namCu||[])};
  (o.lop||[]).forEach(l=>{if(!l||!l.id)return;D.lop[l.id]={ten:l.ten||l.id,khoi:+l.khoi||0,gv:fbSao(l.gv||[]),tj:fbSao(l.tj||{on:false}),mo:fbSao((o.mo||{})[l.id]||{})}});
  (o.hs||[]).forEach(r=>{if(!r||!r[0])return;D.hsdm[r[0]]={ten:r[1]||r[0],khoi:+r[2]||0,lop:(o.gd||{})[r[0]]||'',ph:(o.ph||{})[r[0]]||''}});
  Object.keys(o.hoso||{}).forEach(tk=>{D.hoso[tk]=fbSao(o.hoso[tk]||{})});
  Object.keys(o.hosoNam||{}).forEach(tk=>{(D.hoso[tk]=D.hoso[tk]||{}).hosoNam=fbSao(o.hosoNam[tk])});
  (o.gv||[]).forEach(g=>{if(!g||!g.id)return;D.gv[g.id]={ten:g.ten||g.id,tk:g.tk||g.id}});
  Object.keys(o.phInfo||{}).forEach(tk=>{D.ph[tk]=fbSao(o.phInfo[tk]||{})});
  return D}
/* các doc → org hình cũ (mọi file khác vẫn đọc S.org như trước) */
function orgV3Gop(V){const m=V.main||{};
  const o={ten:m.ten||'',nam:m.nam||'',gd:fbSao(m.gd||{}),nl:fbSao(m.nl||{}),nghi:fbSao(m.nghi||{}),xoa:fbSao(m.xoa||[]),namCu:fbSao(m.namCu||[]),
    lop:Object.keys(V.lop).map(id=>{const l=V.lop[id];return{id,ten:l.ten||id,khoi:+l.khoi||0,gv:fbSao(l.gv||[]),tj:fbSao(l.tj||{on:false})}}).sort((a,b)=>a.khoi-b.khoi||String(a.ten).localeCompare(String(b.ten))),
    mo:{},hs:[],ph:{},phInfo:{},hoso:{},hosoNam:{},gv:Object.keys(V.gv).map(id=>({id,ten:V.gv[id].ten||id,tk:V.gv[id].tk||id})),nk:fbSao(V.nk||[]),hsMoi:[],v:2,cloud:1,v3:1,
    mauHS:1,mauHS2:1,mauHS3:1,mauHS4:1,mauHS5:1,mauHS6:1,mauHS7:1};
  Object.keys(V.lop).forEach(id=>{o.mo[id]=fbSao(V.lop[id].mo||{})});
  Object.keys(V.hsdm).forEach(tk=>{const h=V.hsdm[tk];o.hs.push([tk,h.ten||tk,+h.khoi||0]);if(h.ph)o.ph[tk]=h.ph;if(h.lop&&!o.gd[tk])o.gd[tk]=h.lop});
  Object.keys(V.hoso).forEach(tk=>{const x=fbSao(V.hoso[tk]||{});if(x.hosoNam){o.hosoNam[tk]=x.hosoNam;delete x.hosoNam}if(Object.keys(x).length)o.hoso[tk]=x});
  Object.keys(V.ph).forEach(tk=>{o.phInfo[tk]=fbSao(V.ph[tk]||{})});
  return o}
/* sửa một chỗ trong S.org theo đường dẫn ('gd.em1', 'lop.1A.tj', 'nl.em1'; 'lop.<id>' tìm theo id trong mảng) rồi đẩy ngay */
function orgSet(path,value){const o=S.org;if(!o)return;const p=String(path).split('.');let cur=o;
  for(let i=0;i<p.length-1;i++){let k=p[i];if(Array.isArray(cur)){const f=cur.find(x=>x&&x.id===k);if(!f)return;cur=f;continue}if(cur[k]===undefined||cur[k]===null)cur[k]={};cur=cur[k]}
  const k=p[p.length-1];if(Array.isArray(cur)){const i=cur.findIndex(x=>x&&x.id===k);if(value===undefined){if(i>=0)cur.splice(i,1)}else if(i>=0)cur[i]=value;else cur.push(value)}
  else if(value===undefined)delete cur[k];else cur[k]=value;
  save();return fbDayNgay()}
/* nhận một doc từ máy chủ vào bộ nhớ V3; trả true nếu nội dung đổi so với bản đã biết */
const V3_MAIN_KEYS=['v','ten','nam','gd','pc','nl','nghi','xoa','namCu'];
function fbV3Nhan(col,id,data){const k=col==='main'?'org/main':col+'/'+id;if(col==='main'&&data){const x={};V3_MAIN_KEYS.forEach(q=>{if(data[q]!==undefined)x[q]=data[q]});data=x}if(data===null){const co=col==='main'?!!V3.main:!!V3[col][id];if(col==='main')V3.main=null;else delete V3[col][id];delete fbLast[k];return co}
  const j=fbJ3(data),cu=fbLast[k];fbLast[k]=j;const d=JSON.parse(j);if(col==='main')V3.main=d;else V3[col][id]=d;return cu!==j}
let fbV3Hen=null;function fbV3Cap(ngay){clearTimeout(fbV3Hen);const lam=()=>{try{S.org=orgV3Gop(V3);fbDanhSach();fbVe()}catch(e){console.error(e)}};if(ngay)lam();else fbV3Hen=setTimeout(lam,40)}
/* lớp cô dạy theo pc của org/main (nguồn rules dùng) */
const fbLopCua=(m,gvId)=>fbSao(((m&&m.pc)||{})[gvId]||[]);
const fbSub3={};function fbNghe3(k,lam){if(fbSub3[k])return;fbSub3[k]=1;fbSub.push(lam())}
/* nghe các collection theo vai: QL cả kho; cô: lớp mình (pc) + hsdm từng lớp; phụ huynh: hsdm/lop của con */
function fbV3Nghe(me,db,ok){const vai=me.role,gvId=me.gvId||me.tk;
  const docL=(col,id)=>fbNghe3(col+'/'+id,()=>fbNghe(db.doc(col+'/'+id),d=>{if(d.metadata.hasPendingWrites)return;if(fbV3Nhan(col,id,d.exists?d.data():null))fbV3Cap()},e=>console.error(col,id,e)));
  const colL=(col,q,tag)=>fbNghe3(col+'?'+(tag||'*'),()=>fbNghe(q,s=>{if(s.metadata.hasPendingWrites)return;let doi=false;const thay=new Set();
      s.docs.forEach(d=>{thay.add(d.id);if(fbV3Nhan(col,d.id,d.data()))doi=true});
      if(!tag)Object.keys(V3[col]).forEach(id=>{if(!thay.has(id)){delete V3[col][id];delete fbLast[col+'/'+id];doi=true}});
      else s.docChanges().forEach(c=>{if(c.type==='removed'&&!thay.has(c.doc.id)){delete V3[col][c.doc.id];delete fbLast[col+'/'+c.doc.id];doi=true}});
      V3.san[col]=1;if(doi)fbV3Cap()},e=>console.error(col,tag,e)));
  fbSub.push(fbNghe(db.doc('org/main'),d=>{if(d.metadata.hasPendingWrites)return;const m=d.exists?d.data():null;
    if(V3.on&&(!m||m.v!==3)){fbTaiLai();return}
    const doi=fbV3Nhan('main','',m?Object.assign({},m,{j:undefined,jCu:undefined,admins:undefined}):null);V3.san.main=1;
    if(vai==='ql')V3_COLS.forEach(c=>colL(c,db.collection(c)));
    else if(vai==='gv'){colL('gv',db.collection('gv'));fbLopCua(m,gvId).forEach(l=>{docL('lop',l);colL('hsdm',db.collection('hsdm').where('lop','==',l),l)})}
    else{colL('gv',db.collection('gv'));(me.con||[]).forEach(c=>{docL('hsdm',c);const l=((m&&m.gd)||{})[c];if(l)docL('lop',l)})}
    if(ok){fbV3Cap(true);const f=ok;ok=null;f()}else if(doi)fbV3Cap()},e=>{console.error(e);if(ok){const f=ok;ok=null;f()}}));}
/* nk: QL đọc 200 dòng mới nhất → V3.nk (kèm id để fbDay không ghi lại) */
function fbV3NkNhan(s){V3.nk=s.docs.map(d=>Object.assign({id:d.id},d.data(),{luc:undefined})).reverse();fbV3Cap()}
/* ghi theo từng doc (QL: mọi doc đổi, xoá doc không còn; cô: chỉ mo của lớp mình + nk) */
function fbDayV3(me,db,ghi){const o=fbOrgSach(),D=orgV3Tach(o),gv=me.role==='gv',myLop=new Set(fbLopCua(V3.main,me.gvId||me.tk));
  if(!gv){const j=fbJ3(D.main);if(fbLast['org/main']!==j){fbLast['org/main']=j;V3.main=JSON.parse(j);ghi.push(db.doc('org/main').update(Object.assign({},D.main,{t:fbTS()})))}}
  V3_COLS.forEach(col=>{Object.keys(D[col]).forEach(id=>{const k=col+'/'+id,j=fbJ3(D[col][id]);if(fbLast[k]===j)return;
      if(gv){if(col!=='lop'||!myLop.has(id))return;fbLast[k]=j;V3[col][id]=JSON.parse(j);ghi.push(db.doc(k).update({mo:D[col][id].mo,t:fbTS()}));return}
      fbLast[k]=j;V3[col][id]=JSON.parse(j);ghi.push(db.doc(k).set(Object.assign({},D[col][id],{t:fbTS()})))});
    if(!gv&&V3.san[col])Object.keys(fbLast).filter(k=>k.startsWith(col+'/')&&!(k.slice(col.length+1) in D[col])).forEach(k=>{delete fbLast[k];delete V3[col][k.slice(col.length+1)];ghi.push(db.doc(k).delete())})});
  (o.nk||[]).forEach(e=>{if(!e||typeof e!=='object'||e.id)return;e.id=db.collection('nk').doc().id;V3.nk.push({id:e.id,d:+e.d||0,ai:String(e.ai||''),t:String(e.t||'')});ghi.push(db.doc('nk/'+e.id).set({d:+e.d||0,ai:String(e.ai||''),t:String(e.t||''),luc:fbTS()}))})}
/* fbDay: nhánh v3 cho QL/cô thay cho ghi org/main.j */
{const _d=fbDay;fbDay=async function(){if(!CLOUD||!FB||!fbV3()||!(CLOUD.me.role==='ql'||CLOUD.me.role==='gv'))return _d.apply(this,arguments);
  const db=FB.db,me=CLOUD.me,ghi=[];try{
    if(S.org)fbDayV3(me,db,ghi);
    Object.keys(S.st).forEach(tk=>{if(!fbLast.hasOwnProperty('hsgv/'+tk))return;const j=JSON.stringify(fbTach(S.st[tk]).gv);if(fbLast['hsgv/'+tk]!==j){fbLast['hsgv/'+tk]=j;ghi.push(db.doc('hsgv/'+tk).set({j,t:fbTS()}))}});
    const co=new Set();(S.asg||[]).forEach(a=>{co.add(a.id);if(me.role==='gv'&&!a.lop)return;const j=JSON.stringify(a);if(fbLast['asg/'+a.id]!==j){fbLast['asg/'+a.id]=j;ghi.push(db.doc('asg/'+a.id).set({j,lop:a.lop||'',t:fbTS()}))}});
    Object.keys(fbLast).filter(k=>k.startsWith('asg/')&&!co.has(k.slice(4))).forEach(k=>{delete fbLast[k];ghi.push(db.doc(k).delete())});
    if(ghi.length){fbBan++;try{await Promise.all(ghi)}finally{fbBan--}fbTrangThai('Đã lưu lên máy chủ')}
  }catch(e){console.error(e);fbTrangThai('Chưa lưu được: '+fbLoi(e),1)}}}
/* fbGvBoot: v3 nghe collection; v2 như cũ. Chế độ quyết định bởi org/main.v */
{hooks.on('fbGvBoot',_b=>async function(){const me=CLOUD.me,db=FB.db;const m=await db.doc('org/main').get();
  if(!m.exists||m.data().v!==3)return _b.apply(this,arguments);
  V3.on=true;document.body.classList.add('cloud');window.dayNow=fbNgay;
  S={day:fbNgay(),events:[],st:{},cbi:{},asg:[],asgSeed:2,mk2:1,org:null};STUDENTS.length=0;
  role=window.TRANG||(me.role==='ph'?'ph':'gv');gvMe=me.gvId||me.tk;gvLop=null;scr={k:'home'};
  await new Promise(ok=>fbV3Nghe(me,db,ok));
  if(me.role==='ql')fbSub.push(fbNghe(db.collection('nk').orderBy('luc','desc').limit(200),s=>{if(!s.metadata.hasPendingWrites)fbV3NkNhan(s)},e=>console.error('nk',e)));
  await new Promise(ok=>setTimeout(ok,350));fbV3Cap(true);
  /* bài về nhà như P-04 */
  const o=S.org||{},gvId=me.gvId||me.tk;
  const lops=me.role==='ql'?[null]:me.role==='ph'?[...new Set((me.con||[]).map(c=>(o.gd||{})[c]).filter(Boolean))]:fbLopCua(V3.main,gvId);
  const theoLop={};const gop=()=>{const A=[];Object.values(theoLop).forEach(L=>L.forEach(a=>A.push(a)));S.asg=A;fbVe()};
  lops.forEach(l=>{const q=l===null?db.collection('asg'):fbAsgLop(db,l);
    fbSub.push(fbNghe(q,s=>{const A=[];s.docs.forEach(d=>{const j=d.data().j;if(me.role!=='ph')fbLast['asg/'+d.id]=j;const a=fbJ(j);if(a)A.push(a)});theoLop[l===null?'*':l]=A;gop()},e=>console.error('asg',l,e)))});})}
/* học sinh: dữ liệu trung tâm cần cho em (lop của em, gd, nl, nghi, namCu) — v3 đọc org/main + lop/{lop}; v2 đọc j */
export async function fbOrgHS(tk){const db=FB.db,o=await db.doc('org/main').get();if(!o.exists)return{};const m=o.data();
  if(m.v!==3)return fbJ(m.j)||{};V3.on=true;
  const lop=(m.gd||{})[tk]||'',L=lop?await db.doc('lop/'+lop).get():null,l=L&&L.exists?L.data():null;
  return{v3:1,ten:m.ten,nam:m.nam,gd:m.gd||{},nl:m.nl||{},nghi:m.nghi||{},namCu:m.namCu||[],lop:l?[Object.assign({id:lop},l)]:[],mo:l?{[lop]:l.mo||{}}:{}}}
{hooks.on('fbHsBoot',_b=>async function(){const me=CLOUD.me,tk=me.tk,db=FB.db;const o0=await db.doc('org/main').get();
  if(!o0.exists||o0.data().v!==3)return _b.apply(this,arguments);
  const [h,org]=await Promise.all([db.doc('hs/'+tk).get(),fbOrgHS(tk)]);
  const lop=(org.gd||{})[tk]||'',L=(org.lop||[]).find(l=>l.id===lop),khoi=(L&&L.khoi)||me.khoi||1;
  if(!L)throw{code:'chua-lop'};
  let st=h.exists?fbJ(h.data().j):null;const ev=h.exists?fbJ(h.data().ev||'[]')||[]:[];
  if(st&&st.grade!==khoi&&!ev.length){const gt=st.gender;st=newStudent(me.ten||tk,khoi);if(gt)st.gender=gt}
  if(!st)st=newStudent(me.ten||tk,khoi);if(me.ten)st.name=me.ten;
  st.active=!!((L&&L.tj&&L.tj.on)||(org.nl||{})[tk]);
  S={day:fbNgay(),events:ev,open:Object.assign({},(org.mo||{})[lop]||{}),st:{[tk]:st},cbi:{},asg:[],asgSeed:2,lopHS:lop};
  STUDENTS=[[tk,st.name,st.grade]];sid=tk;role='hs';KEY='jennyHSc_'+tk;
  if(typeof xuBoot==='function')await xuBoot(tk,db);/* P-20: ví xu + bảng giá; sau đó hs.j không còn coins */
  fbLast['hs/'+tk]=JSON.stringify(fbTach(st).hs);fbLast['ev/'+tk]=JSON.stringify(ev);
  const mine=a=>a.hs?a.hs.includes(tk):(a.lop?a.lop===lop:a.g===st.grade&&!a.mau);
  fbSub.push(fbNghe(fbAsgLop(db,lop),q=>{S.asg=q.docs.map(d=>fbJ(d.data().j)).filter(a=>a&&mine(a));fbVe()},e=>console.error(e)));
  fbSub.push(fbNghe(db.doc('hsgv/'+tk),d=>{const g=d.exists?fbJ(d.data().j)||{}:{};GV_F.forEach(k=>{if(g[k]!==undefined)S.st[tk][k]=g[k]});fbVe()},e=>{}));
  let nlOn=!!(org.nl||{})[tk],tjOn=!!(L.tj&&L.tj.on);const capActive=()=>{S.st[tk].active=nlOn||tjOn;fbVe()};
  fbSub.push(fbNghe(db.doc('lop/'+lop),d=>{if(!d.exists)return;const l=d.data();S.open=Object.assign({},l.mo||{});tjOn=!!(l.tj&&l.tj.on);capActive()},e=>{}));
  fbSub.push(fbNghe(db.doc('org/main'),d=>{if(!d.exists)return;const m=d.data();if(m.v!==3){fbTaiLai();return}nlOn=!!((m.nl||{})[tk]);if(((m.gd||{})[tk]||'')!==lop){fbTaiLai();return}capActive()},e=>{}));
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}})}
/* QL chuyển lớp cho em: giao dịch org/main.gd + hsdm/{tk} (v3) để hai nơi luôn khớp */
if(typeof window.qlChuyen==='function'){const _c=window.qlChuyen;window.qlChuyen=function(tk,lid){const r=_c.apply(this,arguments);
  try{if(fbV3()&&CLOUD&&CLOUD.me.role==='ql'){const db=FB.db,L=(S.org.lop||[]).find(x=>x.id===lid),khoi=L?+L.khoi:((S.org.hs||[]).find(x=>x[0]===tk)||[])[2]||0;
    db.runTransaction(async tx=>{const m=await tx.get(db.doc('org/main')),gd=Object.assign({},(m.data()||{}).gd||{});if(lid)gd[tk]=lid;else delete gd[tk];
      const h=await tx.get(db.doc('hsdm/'+tk));tx.update(db.doc('org/main'),{gd,t:fbTS()});if(h.exists)tx.update(db.doc('hsdm/'+tk),{lop:lid||'',khoi:khoi||h.data().khoi||0,t:fbTS()})})
    .catch(e=>{console.error(e);fbTrangThai('Chưa lưu được: '+fbLoi(e),1)})}}catch(e){console.error(e)}return r}}
/* Nâng cấp dữ liệu v3 (QL bấm một lần; chạy lại không trùng): chiếu S.org ra các doc, ghi theo lô, đặt org/main.v = 3, giữ j */
function fbNangCapV3(...a){return hooks.goi('fbNangCapV3',this,a)}
hooks.ham('fbNangCapV3',async function(){if(!CLOUD||CLOUD.me.role!=='ql'||!S.org){toast('Chỉ quản lý mới nâng cấp được');return}
  const o=fbOrgSach(),D=orgV3Tach(o),n=c=>Object.keys(D[c]).length,nk=(o.nk||[]).filter(e=>e&&!e.id);
  if(!await fbXacNhan('Nâng cấp dữ liệu v3',`Tách dữ liệu trung tâm thành ${n('lop')} lớp, ${n('hsdm')} học sinh, ${n('hoso')} hồ sơ, ${n('gv')} giáo viên, ${n('ph')} phụ huynh, ${nk.length} dòng nhật ký. Bản cũ (j) vẫn giữ 30 ngày. Sau khi xong, mọi người tải lại trang.`,'Nâng cấp'))return;
  const db=FB.db;toast('Đang nâng cấp…');
  try{let b=db.batch(),c=0;const ghi=[];const them=(ref,data)=>{b.set(ref,data);if(++c>=400){ghi.push(b.commit());b=db.batch();c=0}};
    V3_COLS.forEach(col=>Object.keys(D[col]).forEach(id=>them(db.doc(col+'/'+id),Object.assign({},D[col][id],{t:fbTS()}))));
    nk.forEach(e=>{e.id=db.collection('nk').doc().id;them(db.doc('nk/'+e.id),{d:+e.d||0,ai:String(e.ai||''),t:String(e.t||''),luc:fbTS()})});
    b.update(db.doc('org/main'),Object.assign({},D.main,{jCu:fbTS(),t:fbTS()}));ghi.push(b.commit());await Promise.all(ghi);
    await fbTaoVi(true);/* P-20: ví xu từng em + bảng giá cfg/shop */
    toast('Đã nâng cấp dữ liệu v3. Đang tải lại…');setTimeout(()=>fbTaiLai(),1200)}catch(e){console.error(e);toast('Chưa nâng cấp được: '+fbLoi(e))}});
{const _t=fbMayChuBox;fbMayChuBox=function(){const r=_t.apply(this,arguments);if(!r||fbV3()||!CLOUD||CLOUD.me.role!=='ql')return r;
  return r.replace('</section>',`<div class="task" style="margin-top:10px;border-left:4px solid var(--coral)"><b>Dữ liệu còn ở dạng cũ (một khối JSON)</b><div class="muted" style="margin:4px 0 8px">Nâng cấp lên v3 để tách lớp, học sinh, hồ sơ, nhật ký thành từng bản ghi riêng (bảo mật theo từng trường, cô không ghi đè được dữ liệu trung tâm). Làm một lần, sau đó dán quy tắc Firestore mới.</div><button type="button" class="btn pri" data-act="fbNangCapV3">⬆ Nâng cấp dữ liệu v3</button></div></section>`)}}
/* thiết lập lần đầu tạo thẳng v3 */
{const _s=fbThietLap;fbThietLap=async function(ten,tk,pw){const r=await _s.apply(this,arguments);try{const db=FB.db,o=fbJ((await db.doc('org/main').get()).data().j)||{},D=orgV3Tach(o);
  await db.doc('gv/'+tk).set(Object.assign({},D.gv[tk]||{ten,tk},{t:fbTS()}));await db.doc('org/main').set(Object.assign({},D.main,{jCu:fbTS(),t:fbTS()}),{merge:true})}catch(e){console.error(e)}return r}}
/* ===================== P-20 (25/10/2026): ví xu vi/{tk}, sổ ev/{tk}/d, bảng giá cfg/shop (luật ở firestore.rules, máy em ở 64-xu.js) =====================
   QL: fbTaoVi() tạo ví cho em chưa có (xu, đồ lấy từ hs.j đang có) và ghi bảng giá cfg/shop từ danh mục trong app; gọi trong Nâng cấp v3, chạy lại không trùng.
   Cô/QL: fbXuNgay(tks) đọc sổ ev hôm nay của từng em (where t >= đầu ngày) → fbXuCache.d[tk] = {xu, n, man1h, la}; fbXuSo(tk) mở 30 dòng gần nhất. */
async function fbTaoVi(im){if(!CLOUD||CLOUD.me.role!=='ql'||!FB){if(!im)toast('Chỉ quản lý mới tạo ví được');return 0}const db=FB.db;const co={};
  try{(await db.collection('vi').get()).forEach(d=>{co[d.id]=1})}catch(e){console.warn('vi',e)}
  let b=db.batch(),c=0,n=0,cho=0;const ghi=[];const them=(ref,data)=>{b.set(ref,data);if(++c>=400){ghi.push(b.commit());b=db.batch();c=0}};
  ((S.org&&S.org.hs)||[]).forEach(([tk])=>{if(co[tk])return;if(!fbHsDa[tk]||!S.st[tk]){cho++;return}them(db.doc('vi/'+tk),Object.assign(xuViTu(S.st[tk]),{t:fbTS()}));n++});
  them(db.doc('cfg/shop'),Object.assign(xuBangGia(),{t:fbTS()}));ghi.push(b.commit());
  try{await Promise.all(ghi);if(!im){toast(`Đã tạo ví cho ${n} em và ghi bảng giá cfg/shop`+(cho?` · ${cho} em chưa tải xong, bấm lại sau`:''));render()}}catch(e){console.error(e);toast('Chưa tạo được ví: '+fbLoi(e))}return n}
{const _t=fbMayChuBox;fbMayChuBox=function(){const r=_t.apply(this,arguments);if(!r||!fbV3()||!CLOUD||CLOUD.me.role!=='ql')return r;
  const thieu=((S.org&&S.org.hs)||[]).filter(([tk])=>fbVi[tk]===null).length;
  return r.replace('</section>',`<div class="task" style="margin-top:10px;border-left:4px solid ${thieu?'var(--coral)':'var(--leaf)'}"><b>Ví xu (P-20)</b> <span class="muted">${thieu?`${thieu} em chưa có ví vi/{tk} — em đó vẫn giữ xu trong hs.j kiểu cũ.`:'Mọi em đã có ví; xu, đồ mua ghi theo luật máy chủ.'} Nút này cũng ghi lại bảng giá cfg/shop từ danh mục trong app.</span> <button type="button" class="btn sm" data-act="fbTaoVi">Tạo ví + bảng giá</button></div></section>`)}}
export const fbXuCache={t:0,d:{},dang:false};
export async function fbXuNgay(tks){if(!FB||!FB.db||fbXuCache.dang||!window.firebase||!firebase.firestore.Timestamp)return;fbXuCache.dang=true;const db=FB.db,dau=new Date();dau.setHours(0,0,0,0);const T0=firebase.firestore.Timestamp.fromDate(dau);
  try{await Promise.all(tks.map(async tk=>{const c=db.collection('ev/'+tk+'/d');if(!c.where)return;try{const q=await c.where('t','>=',T0).get();let xu=0,n=0;const gio={};
    q.forEach(d=>{const x=d.data()||{};n++;if(x.d>0)xu+=x.d;if(x.k==='man'){const h=x.t&&x.t.toDate?x.t.toDate().getHours():0;gio[h]=(gio[h]||0)+1}});
    const man1h=Math.max(0,...Object.values(gio));fbXuCache.d[tk]={xu,n,man1h,la:xu>300||man1h>15}}catch(e){console.warn('ev',tk,e&&e.code)}}));fbXuCache.t=Date.now()}
  finally{fbXuCache.dang=false;fbVe()}}
export async function fbXuSo(tk){try{const q=await FB.db.collection('ev/'+tk+'/d').orderBy('t','desc').limit(30).get();const TEN={man:'Qua màn',tl:'Tự luyện',bvn:'Bài về nhà',game:'Trò chơi',mua:'Mua',ban:'Bán',ql:'Quản lý',khac:'Khác'};
  const rows=q.docs.map(d=>{const x=d.data()||{},t=x.t&&x.t.toDate?x.t.toDate():null;return`<tr><td>${t?t.toLocaleString('vi-VN'):''}</td><td>${esc(TEN[x.k]||x.k||'')}</td><td style="text-align:right"><b>${x.d>0?'+':''}${x.d|0}</b></td><td>${esc(x.ref||'')}</td></tr>`}).join('');
  const el=document.createElement('div');el.className='gdov fbmk';el.innerHTML=`<div class="gdbox fbmkbox" role="dialog" aria-modal="true" style="max-height:85vh;overflow:auto"><div class="gdhd"><b>Sổ xu · ${esc(tk)}</b><button type="button" class="gdx" data-x aria-label="Đóng">✕</button></div><div class="fbmkf"><p class="muted">30 dòng gần nhất. Sổ chỉ thêm, không sửa xoá.</p><table><tr><th>Lúc</th><th>Loại</th><th>Xu</th><th>Ở đâu</th></tr>${rows||'<tr><td colspan="4" class="muted">Chưa có dòng nào</td></tr>'}</table></div></div>`;
  document.body.appendChild(el);el.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>el.remove())}catch(e){toast('Chưa đọc được sổ xu: '+fbLoi(e))}}

/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */
hd.dangKy({
  'fbDatLaiMK':function(event,a){fbDatLaiMK(a[0])},
  'fbInMKPhien':function(){if(typeof window.qlInPhieu==='function')qlInPhieu(fbMKPhien.map(x=>x.tk),'auto')},
  'fbDatLaiMKLop':function(event,a){fbDatLaiMKLop(a[0])},
  'fbDoiMK':function(){fbDoiMK()},
  'fbDangXuat':function(){fbDangXuat()},
  'fbNangCapV3':function(){fbNangCapV3()},
  'fbTaoVi':function(){fbTaoVi()},
});
