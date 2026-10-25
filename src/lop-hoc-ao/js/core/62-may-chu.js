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
const FB_CFG={apiKey:"AIzaSyDom_aoJHqhDgs0CYpPa0kTzRv0WQ7xo3o",authDomain:"jenny-lop-hoc-ao.firebaseapp.com",projectId:"jenny-lop-hoc-ao",storageBucket:"jenny-lop-hoc-ao.firebasestorage.app",messagingSenderId:"670173928664",appId:"1:670173928664:web:cd32fb1f8846f0ec82cbad",
  appCheckKey:""};/* P-05: khoá site reCAPTCHA v3 của App Check (Firebase › App Check › Web app). Để trống = không bật. Chỉ theo dõi, chưa Enforce (xem docs/FIREBASE-CONSOLE.md). */
const FB_VER='10.12.2',GV_F=['comments','badges','gvNote','gvSkip'];
let FB=null,CLOUD=null,fbSub=[],fbLast={},fbHen=null,fbDangGhi=false,fbBan=0;/* fbBan: số lượt ghi đang chờ máy chủ */
const fbEmail=tk=>`${String(tk).trim().toLowerCase()}@jenny-lop-hoc-ao.firebaseapp.com`;
const fbTkOk=tk=>/^[a-z0-9][a-z0-9._-]{2,23}$/.test(tk);
function fbNap(){if(window.firebase&&firebase.firestore&&firebase.auth)return Promise.resolve();
  const SRI={app:'sha384-AQ3POAMqIhwS81FrUH95ekxqBZHeP5tG2JfEL3+7GuTtfRLWnrRh32UxwzM+//A9',auth:'sha384-TnlRYaR4JYz/lpaGuaiU61PjNberSA4vjLjtF+oRC/IkohkJqnWxw5EmDSOt1vA1',firestore:'sha384-qn4Jh88HhJA8dplNQyGjOh9OGI4izVhrfj/qIFgaKcdgOE06pXqIKGlsCILZcLAC','app-check':'sha384-E3vxFxXu8FhW5kvqdQJ5Yf8ugrV7iCJP8jgnItRH2Rk8Q08cJzJGTi/oMC3FEp3j'};/* SRI cho FB_VER 10.12.2 — đổi FB_VER thì tính lại, xem docs/SRI.md */
  const one=n=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-${n}-compat.js`;s.integrity=SRI[n];s.crossOrigin='anonymous';s.onload=ok;s.onerror=()=>no({code:'network',message:'Không tải được Firebase. Kiểm tra mạng.'});document.head.appendChild(s)});
  let p=one('app').then(()=>one('auth')).then(()=>one('firestore'));if(FB_CFG.appCheckKey)p=p.then(()=>one('app-check'));return p}
async function fbInit(){await fbNap();if(!FB){const cfg=Object.assign({},FB_CFG);delete cfg.appCheckKey;const app=firebase.apps.length?firebase.app():firebase.initializeApp(cfg);
  if(FB_CFG.appCheckKey&&firebase.appCheck){try{firebase.appCheck(app).activate(FB_CFG.appCheckKey,true)}catch(e){console.warn('App Check chưa bật được:',e)}}
  FB={app,auth:app.auth(),db:app.firestore()}}return FB}
function fbLoi(e){const c=(e&&e.code)||'';return({'chua-lop':'Tài khoản của em chưa được xếp lớp. Em nhờ cô giáo nhé!','auth/invalid-credential':'Tên đăng nhập hoặc mật khẩu chưa đúng.','auth/invalid-login-credentials':'Tên đăng nhập hoặc mật khẩu chưa đúng.','auth/wrong-password':'Mật khẩu chưa đúng.','auth/user-not-found':'Không có tài khoản này.','auth/too-many-requests':'Thử sai nhiều lần. Đợi vài phút rồi thử lại.','auth/network-request-failed':'Không kết nối được mạng.','auth/email-already-in-use':'Tên đăng nhập này đã có người dùng.','auth/weak-password':'Mật khẩu cần ít nhất 6 kí tự.','auth/invalid-email':'Tên đăng nhập không hợp lệ.','auth/requires-recent-login':'Phiên đăng nhập đã cũ. Đăng xuất, đăng nhập lại rồi làm tiếp.','permission-denied':'Tài khoản không có quyền làm việc này.','no-profile':'Tài khoản chưa được gán vai trò. Hỏi quản lý trung tâm.','network':e.message})[c]||('Có lỗi: '+((e&&e.message)||e))}
const fbJ=s=>{try{return JSON.parse(s)}catch(e){return null}};
const fbTach=st=>{const a={},b={};Object.keys(st||{}).forEach(k=>(GV_F.includes(k)?b:a)[k]=st[k]);GV_F.forEach(k=>{if(b[k]===undefined)b[k]=k==='gvSkip'?{}:[]});return{hs:a,gv:b}};
const fbTS=()=>firebase.firestore.FieldValue.serverTimestamp();
/* bài về nhà của một lớp (rules P-04 chỉ cho đọc asg theo lớp nên phải lọc ngay trong truy vấn; bản giả lập trong test không có where) */
const fbAsgLop=(db,l)=>{const c=db.collection('asg');return c.where?c.where('lop','==',l):c};
const fbNgay=()=>Math.max(1,Math.floor((Date.now()-Date.UTC(2026,8,5))/864e5)+1);

async function fbDangNhap(tk,pw,nho){const{auth}=await fbInit();try{await auth.setPersistence(nho===false?firebase.auth.Auth.Persistence.SESSION:firebase.auth.Auth.Persistence.LOCAL)}catch(e){}
  tk=String(tk).trim().toLowerCase();const em=fbEmail(tk);let c;
  try{c=await auth.signInWithEmailAndPassword(em,pw)}
  catch(e){/* P-04 (25/10/2026): email ẩn chuẩn là chính, KHÔNG tra login/ trước. Chỉ khi sai mới xem QL có đặt lại mật khẩu
             (tài khoản Auth mới, email ẩn khác, ghi ở login/{tk}) — rules chỉ cho get đúng 1 bản ghi, không liệt kê. */
    if(!/^auth\/(invalid-credential|invalid-login-credentials|user-not-found|wrong-password)$/.test((e&&e.code)||''))throw e;
    let em2='';try{const L=await FB.db.doc('login/'+tk).get();if(L.exists&&L.data().email)em2=String(L.data().email)}catch(x){}
    if(!em2||em2===em)throw e;c=await auth.signInWithEmailAndPassword(em2,pw)}
  return fbNapMe(c.user)}
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
function fbMKGoiY(){const C='bdghkmnprstvx',V='aeiou',r=n=>Math.floor(Math.random()*n);let s='';for(let i=0;i<2;i++)s+=C[r(C.length)]+V[r(V.length)];return s+String(1000+r(9000))}
const fbMKLoi=(a,b)=>a.length<8?'Mật khẩu cần ít nhất 8 kí tự.':!(/[a-z]/i.test(a)&&/\d/.test(a))?'Mật khẩu cần có cả chữ và số.':a!==b?'Hai lần nhập chưa giống nhau.':'';
const fbMKPhien=[];function fbMKNho(tk,pw){window.qlMK=window.qlMK||{};qlMK[tk]=pw;const i=fbMKPhien.findIndex(x=>x.tk===tk);if(i>=0)fbMKPhien.splice(i,1);fbMKPhien.unshift({tk,pw})}
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
async function fbTaoTK(tk,pw){await fbInit();const app2=firebase.apps.find(a=>a.name==='tao')||firebase.initializeApp(FB.app.options,'tao');
  const c=await app2.auth().createUserWithEmailAndPassword(fbEmail(tk),pw);const uid=c.user.uid;await app2.auth().signOut();return uid}
/* thiết lập lần đầu: tài khoản quản lý đầu tiên + dữ liệu trung tâm trống */
async function fbThietLap(ten,tk,pw){const{auth,db}=await fbInit();const ref=db.doc('org/main');
  const c=await auth.createUserWithEmailAndPassword(fbEmail(tk),pw);const uid=c.user.uid;
  const o=await ref.get();if(o.exists)throw{code:'x',message:'Trung tâm đã có quản lý. Hãy đăng nhập.'};
  const org={ten:'Clb Học Toán cùng Jenny',nam:'2026–2027',gv:[{id:tk,ten,tk}],lop:[],gd:{},nl:{},nk:[],mo:{},hs:[],ph:{},v:2,cloud:1,mauHS4:1,mauHS5:1,mauHS6:1,mauHS7:1,mauHS3:1,mauHS2:1,mauHS:1};
  await ref.set({j:JSON.stringify(org),gd:{},pc:{},admins:[uid],t:fbTS()});
  await db.doc('users/'+uid).set({role:'ql',tk,ten,gvId:tk});return fbNapMe(c.user)}

/* ---------- ghi lên máy chủ (gom lại 1,5 giây) ---------- */
{const _s=save;save=function(){const r=_s.apply(this,arguments);try{if(CLOUD&&!fbDangGhi){clearTimeout(fbHen);fbHen=setTimeout(fbDay,1500)}}catch(e){}return r}}
function fbDayNgay(){clearTimeout(fbHen);return fbDay()}
function fbOrgSach(){const o=Object.assign({},S.org);['hsOn'].forEach(k=>delete o[k]);return o}
function fbPc(o){const pc={};(o.lop||[]).forEach(l=>(l.gv||[]).forEach(g=>{(pc[g]=pc[g]||[]).push(l.id)}));return pc}
async function fbDay(){if(!CLOUD||!FB)return;const db=FB.db,me=CLOUD.me,ghi=[];
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
function fbTrangThai(t,loi){const el=document.getElementById('fbSt');if(el){el.textContent=t;el.classList.toggle('loi',!!loi)}}

/* ---------- học sinh ---------- */
async function fbHsBoot(){const me=CLOUD.me,tk=me.tk,db=FB.db;
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
  fbSub.push(fbAsgLop(db,lop).onSnapshot(q=>{S.asg=q.docs.map(d=>fbJ(d.data().j)).filter(a=>a&&mine(a));fbVe()},e=>console.error(e)));
  fbSub.push(db.doc('hsgv/'+tk).onSnapshot(d=>{const g=d.exists?fbJ(d.data().j)||{}:{};GV_F.forEach(k=>{if(g[k]!==undefined)S.st[tk][k]=g[k]});fbVe()},e=>{}));
  fbSub.push(db.doc('org/main').onSnapshot(d=>{const og=d.exists?fbJ(d.data().j)||{}:{};S.open=Object.assign({},(og.mo||{})[lop]||{});const L2=(og.lop||[]).find(l=>l.id===lop);S.st[tk].active=!!((L2&&L2.tj&&L2.tj.on)||(og.nl||{})[tk]);fbVe()},e=>{}));
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
}
let fbVeHen=null;function fbVe(){clearTimeout(fbVeHen);fbVeHen=setTimeout(()=>{try{const g=scr;if(g&&(g.k==='game'||g.k==='mini'||g.k==='xg')&&!g.end)return;render()}catch(e){}},120)}

/* ---------- giáo viên / quản lý / phụ huynh ---------- */
const fbDaNghe=new Set();
async function fbGvBoot(){const me=CLOUD.me,db=FB.db;document.body.classList.add('cloud');
  window.dayNow=fbNgay;
  S={day:fbNgay(),events:[],st:{},cbi:{},asg:[],asgSeed:2,mk2:1,org:null};STUDENTS.length=0;
  role=window.TRANG||(me.role==='ph'?'ph':'gv');gvMe=me.gvId||me.tk;gvLop=null;scr={k:'home'};
  await new Promise(ok=>{let lan=0;
    fbSub.push(db.doc('org/main').onSnapshot(d=>{const j=d.exists?d.data().j:null;if(!j){ok();return}
      if(j!==fbLast['org/main']||!S.org){fbLast['org/main']=j;const o=fbJ(j);o.cloud=1;o.v=2;['mauHS','mauHS2','mauHS3','mauHS4','mauHS5','mauHS6','mauHS7'].forEach(k=>o[k]=1);
        const giu=S.org&&Object.getOwnPropertyDescriptor(S,'open');S.org=o;fbDanhSach();if(lan++)fbVe()}ok()},e=>{console.error(e);ok()}))});
  /* bài về nhà (P-04): QL nghe cả kho; GV nghe từng lớp mình dạy; PH nghe lớp của con — rules chỉ cho đọc theo lớp */
  const o=S.org||{},gvId=me.gvId||me.tk;
  const lops=me.role==='ql'?[null]:me.role==='ph'?[...new Set((me.con||[]).map(c=>(o.gd||{})[c]).filter(Boolean))]
    :[...new Set((o.lop||[]).filter(l=>(l.gv||[]).includes(gvId)).map(l=>l.id))];
  const theoLop={};const gop=()=>{const A=[];Object.values(theoLop).forEach(L=>L.forEach(a=>A.push(a)));S.asg=A;fbVe()};
  lops.forEach(l=>{const q=l===null?db.collection('asg'):fbAsgLop(db,l);
    fbSub.push(q.onSnapshot(s=>{const A=[];s.docs.forEach(d=>{const j=d.data().j;if(me.role!=='ph')fbLast['asg/'+d.id]=j;const a=fbJ(j);if(a)A.push(a)});theoLop[l===null?'*':l]=A;gop()},e=>console.error('asg',l,e)))});
}
/* danh sách em được xem: quản lý = tất cả; giáo viên = lớp được phân công; phụ huynh = con */
function fbDanhSach(){const o=S.org,me=CLOUD.me;if(!o)return;
  const ds=(o.hs||[]).filter(([tk])=>me.role==='ql'||(me.role==='ph'?(me.con||[]).includes(tk):(o.lop||[]).some(l=>l.id===(o.gd||{})[tk]&&(l.gv||[]).includes(me.gvId||me.tk))));
  STUDENTS.length=0;ds.forEach(r=>{STUDENTS.push(r);if(!S.st[r[0]])S.st[r[0]]=newStudent(r[1],r[2]);fbNgheHS(r[0])});
  if(me.role==='ph'&&!ds.some(r=>r[0]===sid)&&ds[0])sid=ds[0][0];}
function fbNgheHS(tk){if(fbDaNghe.has(tk))return;fbDaNghe.add(tk);const db=FB.db;
  fbSub.push(db.doc('hs/'+tk).onSnapshot(d=>{if(!d.exists)return;const x=d.data(),st=fbJ(x.j);if(!st)return;const cu=S.st[tk]||{};GV_F.forEach(k=>{if(cu[k]!==undefined)st[k]=cu[k]});S.st[tk]=st;
    const ev=fbJ(x.ev||'[]')||[];S.events=S.events.filter(e=>e.actor.account.name!==tk).concat(ev).sort((a,b)=>String(a.timestamp).localeCompare(String(b.timestamp)));fbVe()},e=>console.error('hs',tk,e)));
  fbSub.push(db.doc('hsgv/'+tk).onSnapshot(d=>{const j=d.exists?d.data().j:JSON.stringify(fbTach(S.st[tk]||{}).gv);fbLast['hsgv/'+tk]=j;const g=fbJ(j)||{};if(S.st[tk])GV_F.forEach(k=>{if(g[k]!==undefined)S.st[tk][k]=g[k]});fbVe()},e=>console.error('hsgv',tk,e)));}

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
    (o.hs=o.hs||[]).push([tk,n,l?l.khoi:0]);if(l)o.gd[tk]=lid;(o.nk=o.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Tạo tài khoản ${n} (${tk})`+(l?` · lớp ${lid}`:' · chưa xếp lớp')});
    fbMKNho(tk,pw);S.st[tk]=st;fbDanhSach();save();await fbDayNgay();render();toast(`Đã tạo tài khoản ${tk}. Mật khẩu tạm trên phiếu in (In phiếu).`)}catch(err){toast(fbLoi(err))}}
/* mật khẩu khi tạo tài khoản: ô để trống hoặc còn mặc định cũ → ngẫu nhiên; QL gõ thì phải đủ mạnh (fbMKLoi) */
const fbMKTao=v=>{v=String(v||'').trim();return(!v||/^jenny\d{3}$/.test(v))?fbMKGoiY():v};/* 'jenny' + 3 số = mặc định cũ → coi như trống */
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
async function fbDatLaiMK(tk){const pw=await fbHoiMK({tieuDe:`Đặt lại mật khẩu: ${tk}`,goiY:fbMKGoiY(),nut:'Đặt lại',loiNhan:'Mật khẩu tạm; người dùng sẽ phải tự đổi khi đăng nhập. Mật khẩu chỉ hiện trong phiên này.'});if(!pw)return;
  toast('Đang đặt lại…');try{await fbDatLaiMKLoi(tk,pw);save();render();toast(`Đã đặt lại mật khẩu cho ${tk} (xem mục Tài khoản / In phiếu)`)}catch(e){console.error(e);toast(fbLoi(e))}}
/* hộp xác nhận pixel (thay confirm()) */
function fbXacNhan(tieuDe,loiNhan,nut){return new Promise(res=>{const el=document.createElement('div');el.className='gdov fbmk';
  el.innerHTML=`<div class="gdbox fbmkbox" role="dialog" aria-modal="true"><div class="gdhd"><b>${esc(tieuDe)}</b><button type="button" class="gdx" data-x aria-label="Đóng">✕</button></div><div class="fbmkf"><p>${esc(loiNhan)}</p><div class="row" style="gap:8px;justify-content:flex-end"><button type="button" class="btn" data-x>Thôi</button><button type="button" class="btn pri" data-ok>${esc(nut||'Đồng ý')}</button></div></div></div>`;
  document.body.appendChild(el);el.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{el.remove();res(false)});el.querySelector('[data-ok]').onclick=()=>{el.remove();res(true)}})}
/* QL: đặt lại mật khẩu ngẫu nhiên cho cả lớp (tài khoản cũ còn mật khẩu mặc định), rồi in phiếu */
async function fbDatLaiMKLop(lid){const o=S.org,l=(o.lop||[]).find(x=>x.id===lid);if(!l)return;const ids=(o.hs||[]).filter(([tk])=>(o.gd||{})[tk]===lid).map(r=>r[0]);
  if(!ids.length){toast('Lớp chưa có học sinh');return}
  if(!await fbXacNhan(`Đặt lại mật khẩu cả lớp ${l.ten}`,`${ids.length} em sẽ có mật khẩu tạm mới (ngẫu nhiên), lần đăng nhập sau phải tự đổi. Mật khẩu cũ không dùng được nữa. Xong sẽ mở phiếu in.`,'Đặt lại cả lớp'))return;
  const xong=[],loi=[];for(let i=0;i<ids.length;i++){const tk=ids[i];toast(`Đang đặt lại ${i+1}/${ids.length}: ${tk}…`);try{await fbDatLaiMKLoi(tk,fbMKGoiY());xong.push(tk)}catch(e){console.error(tk,e);loi.push(tk)}}
  save();render();toast(`Đã đặt lại ${xong.length} em`+(loi.length?`, lỗi ${loi.length}: ${loi.join(', ')}`:''));
  if(xong.length&&typeof window.qlInPhieu==='function')setTimeout(()=>{try{qlInPhieu(xong,'hs')}catch(e){}},300)}
function fbTaiKhoanBox(){const o=S.org;if(!o||!o.cloud)return'';const lopTen=tk=>{const l=(o.lop||[]).find(x=>x.id===(o.gd||{})[tk]);return l?'Lớp '+l.ten:'chưa xếp lớp'};
  const R=[...(o.gv||[]).map(g=>({ten:g.ten,vai:(g.tk||g.id)===CLOUD.me.tk&&CLOUD.me.role==='ql'?'Quản lý · Giáo viên':'Giáo viên',tk:g.tk||g.id,them:(o.lop||[]).filter(l=>(l.gv||[]).includes(g.id)).map(l=>l.ten).join(', ')||'chưa có lớp'})),
    ...(o.hs||[]).map(([tk,ten])=>({ten,vai:'Học sinh',tk,them:lopTen(tk)})),
    ...Object.entries(o.ph||{}).map(([con,tk])=>{const h=(o.hs||[]).find(x=>x[0]===con);return{ten:'Phụ huynh '+(h?h[1]:con),vai:'Phụ huynh',tk,them:'con: '+(h?h[1]:con)}})];
  return`<section class="card"><h2>Tài khoản</h2><p class="muted" style="margin:4px 0 0">Tên đăng nhập của mọi người. Ai quên mật khẩu thì bấm "Đặt lại mật khẩu": người đó nhận mật khẩu tạm và phải tự đổi khi đăng nhập. Dữ liệu học không mất.</p>
   ${fbMKPhien.length?`<div class="task" style="margin-top:10px;border-left:4px solid var(--leaf)"><b>Mật khẩu tạm trong phiên này</b> <span class="muted">(mất khi đăng xuất; học sinh/phụ huynh in phiếu)</span><div>${fbMKPhien.slice(0,30).map(x=>`${esc(x.tk)} / <code>${esc(x.pw)}</code>`).join(' · ')}</div></div>`:''}
   <div class="tablewrap"><table><tr><th>Họ tên</th><th>Vai trò</th><th>Tên đăng nhập</th><th>Lớp / con</th><th></th></tr>${R.map(r=>`<tr><td><b>${esc(r.ten)}</b></td><td>${r.vai}</td><td><code>${esc(r.tk)}</code></td><td>${esc(r.them)}</td><td>${r.tk===CLOUD.me.tk?'<span class="muted">dùng "Đổi mật khẩu"</span>':`<button class="btn sm" onclick="fbDatLaiMK('${esc(r.tk)}')">Đặt lại mật khẩu</button>`}</td></tr>`).join('')}</table></div></section>`}
{const _p=viewPH;viewPH=function(){let r=_p.apply(this,arguments);try{if(role==='ql'&&CLOUD&&S.org&&S.org.cloud){
  /* P-05: trang một lớp → nút đặt lại mật khẩu cả lớp (75 chèn nút In phiếu vào cùng chỗ) */
  if(typeof qlTrang!=='undefined'&&qlTrang==='lopct')r=r.replace(/(<span class="pill">Khối \d+ · \d+ em<\/span><\/div>)/,`$1<div class="qlin"><button type="button" class="btn" onclick="fbDatLaiMKLop('${esc(qlLopId)}')">🔑 Đặt lại mật khẩu cả lớp</button></div>`);
  const m='<p class="muted" style="margin:0">Sắp có:';const i=r.lastIndexOf(m);const box=fbTaiKhoanBox();return i<0?r.replace(/<\/div>\s*$/,box+'</div>'):r.slice(0,i)+box+r.slice(i)}}catch(e){console.error(e)}return r}}

/* ---------- giao diện khi dùng máy chủ ---------- */
{const _h=header;header=function(){try{if(CLOUD&&S&&S.st&&!S.st[sid]){const f=STUDENTS.find(r=>S.st[r[0]]);if(f)sid=f[0];else S.st[sid]=newStudent('Chưa có học sinh',1)}}catch(e){}_h();try{if(!CLOUD||CLOUD.me.role==='hs')return;const me=CLOUD.me,t=document.getElementById('tabs');
  t.querySelectorAll('button').forEach(b=>{const r=b.dataset.ql!==undefined?'ql':(b.getAttribute('onclick')||'').match(/setRole\('(\w+)'\)/);const k=r==='ql'?'ql':r&&r[1];
    const cho=me.role==='ql'?['gv','ql','ph']:me.role==='gv'?['gv']:['ph'];b.hidden=!cho.includes(k)||cho.length<2});
  const wb=document.getElementById('whoBox');wb.style.display=(role==='ph'&&STUDENTS.length>1)?'':'none';
  t.style.display=window.TRANG||![...t.querySelectorAll('button')].some(b=>!b.hidden)?'none':'';
  if(!document.getElementById('fbMe'))t.insertAdjacentHTML('afterend',`<div id="fbMe" class="fbme"><span class="pill">${esc(me.ten||me.tk)} · ${({ql:'Quản lý',gv:'Giáo viên',ph:'Phụ huynh'})[me.role]||''}</span><span id="fbSt" class="muted fbst"></span><button class="btn sm" onclick="fbDoiMK()">Đổi mật khẩu</button><button class="btn sm" onclick="fbDangXuat()">Đăng xuất</button></div>`)}catch(e){}}}
{const _g=gvMau;gvMau=function(){if(S&&S.org&&S.org.cloud)return;return _g.apply(this,arguments)}}
{const _a=asgSeed;asgSeed=function(){if(CLOUD){S.asgSeed=2;return}return _a.apply(this,arguments)}}
{const _n=gvNow;gvNow=function(){return CLOUD?Date.now():_n()}}
document.head.insertAdjacentHTML('beforeend',`<style>
body.cloud .demo{display:none!important}
body[class*="trang-"] #tabs{display:none!important}body.trang-gv #whoBox,body.trang-ql #whoBox{display:none!important}
.gdov.fbmk{z-index:10050}/* trên cả màn đăng nhập (gvGate/login 9999): hộp bắt đổi mật khẩu hiện ngay sau fbNapMe, trước khi gỡ màn đăng nhập */.fbmkbox{width:min(400px,100%)}.fbmkf{display:flex;flex-direction:column;gap:10px;padding:12px 14px;font-family:var(--f-body)}.fbmkf p{margin:0;font-size:15px;line-height:1.4}
.fbmkf label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:700}.fbmkf input[type=text],.fbmkf input[type=password]{font:inherit;font-size:18px;font-weight:400;padding:8px;border:3px solid #1F2A5A;background:#fff;letter-spacing:.5px}
.fbmkhien{flex-direction:row!important;align-items:center;font-weight:400!important}.fbmkerr{min-height:18px;font-size:13px;color:#B3261E}.fbmkerr:empty{display:none}
.fbme{display:flex;gap:6px;align-items:center;flex-wrap:wrap}@media(max-width:520px){.fbme{width:100%;order:5}.fbst{display:none}.fbme .btn{padding:6px 10px}}.fbst{font-size:12px}.fbst.loi{color:var(--coral)}
</style>`);
