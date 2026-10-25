/* ===================== Máy chủ Firebase (24/10/2026) =====================
   Dùng chung dữ liệu thật giữa app học sinh, trang giáo viên, phụ huynh, quản lý.
   Firestore (xem firebase/firestore.rules):
     users/{uid} {role: ql|gv|hs|ph, tk, ten, gvId?, con?[], khoi?}
     org/main    {j: JSON dữ liệu trung tâm, gd:{tk:lớp}, pc:{gvId:[lớp]}, admins:[uid], t}
     hs/{tk}     {j: JSON dữ liệu học của em (em ghi), ev: JSON sự kiện gần đây, lop, t}
     hsgv/{tk}   {j: JSON nhận xét/thẻ/ghi chú/bỏ qua của cô (cô ghi), t}
     asg/{id}    {j: JSON bài về nhà, lop, t}
   Tên đăng nhập (tk) → email ẩn tk@jenny-lop-hoc-ao.firebaseapp.com (trẻ không cần email thật). */
const FB_CFG={apiKey:"AIzaSyDom_aoJHqhDgs0CYpPa0kTzRv0WQ7xo3o",authDomain:"jenny-lop-hoc-ao.firebaseapp.com",projectId:"jenny-lop-hoc-ao",storageBucket:"jenny-lop-hoc-ao.firebasestorage.app",messagingSenderId:"670173928664",appId:"1:670173928664:web:cd32fb1f8846f0ec82cbad"};
const FB_VER='10.12.2',GV_F=['comments','badges','gvNote','gvSkip'];
let FB=null,CLOUD=null,fbSub=[],fbLast={},fbHen=null,fbDangGhi=false;
const fbEmail=tk=>`${String(tk).trim().toLowerCase()}@jenny-lop-hoc-ao.firebaseapp.com`;
const fbTkOk=tk=>/^[a-z0-9][a-z0-9._-]{2,23}$/.test(tk);
function fbNap(){if(window.firebase&&firebase.firestore&&firebase.auth)return Promise.resolve();
  const SRI={app:'sha384-AQ3POAMqIhwS81FrUH95ekxqBZHeP5tG2JfEL3+7GuTtfRLWnrRh32UxwzM+//A9',auth:'sha384-TnlRYaR4JYz/lpaGuaiU61PjNberSA4vjLjtF+oRC/IkohkJqnWxw5EmDSOt1vA1',firestore:'sha384-qn4Jh88HhJA8dplNQyGjOh9OGI4izVhrfj/qIFgaKcdgOE06pXqIKGlsCILZcLAC'};/* SRI cho FB_VER 10.12.2 — đổi FB_VER thì tính lại, xem docs/SRI.md */
  const one=n=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-${n}-compat.js`;s.integrity=SRI[n];s.crossOrigin='anonymous';s.onload=ok;s.onerror=()=>no({code:'network',message:'Không tải được Firebase. Kiểm tra mạng.'});document.head.appendChild(s)});
  return one('app').then(()=>one('auth')).then(()=>one('firestore'))}
async function fbInit(){await fbNap();if(!FB){const app=firebase.apps.length?firebase.app():firebase.initializeApp(FB_CFG);FB={app,auth:app.auth(),db:app.firestore()}}return FB}
function fbLoi(e){const c=(e&&e.code)||'';return({'chua-lop':'Tài khoản của em chưa được xếp lớp. Em nhờ cô giáo nhé!','auth/invalid-credential':'Tên đăng nhập hoặc mật khẩu chưa đúng.','auth/invalid-login-credentials':'Tên đăng nhập hoặc mật khẩu chưa đúng.','auth/wrong-password':'Mật khẩu chưa đúng.','auth/user-not-found':'Không có tài khoản này.','auth/too-many-requests':'Thử sai nhiều lần. Đợi vài phút rồi thử lại.','auth/network-request-failed':'Không kết nối được mạng.','auth/email-already-in-use':'Tên đăng nhập này đã có người dùng.','auth/weak-password':'Mật khẩu cần ít nhất 6 kí tự.','auth/invalid-email':'Tên đăng nhập không hợp lệ.','permission-denied':'Tài khoản không có quyền làm việc này.','no-profile':'Tài khoản chưa được gán vai trò. Hỏi quản lý trung tâm.','network':e.message})[c]||('Có lỗi: '+((e&&e.message)||e))}
const fbJ=s=>{try{return JSON.parse(s)}catch(e){return null}};
const fbTach=st=>{const a={},b={};Object.keys(st||{}).forEach(k=>(GV_F.includes(k)?b:a)[k]=st[k]);GV_F.forEach(k=>{if(b[k]===undefined)b[k]=k==='gvSkip'?{}:[]});return{hs:a,gv:b}};
const fbTS=()=>firebase.firestore.FieldValue.serverTimestamp();
const fbNgay=()=>Math.max(1,Math.floor((Date.now()-Date.UTC(2026,8,5))/864e5)+1);

async function fbDangNhap(tk,pw,nho){const{auth}=await fbInit();try{await auth.setPersistence(nho===false?firebase.auth.Auth.Persistence.SESSION:firebase.auth.Auth.Persistence.LOCAL)}catch(e){}
  tk=String(tk).trim().toLowerCase();let em=fbEmail(tk);try{const L=await FB.db.doc('login/'+tk).get();if(L.exists&&L.data().email)em=L.data().email}catch(e){}
  const c=await auth.signInWithEmailAndPassword(em,pw);return fbNapMe(c.user)}
async function fbNapMe(user){const d=await FB.db.doc('users/'+user.uid).get();if(!d.exists)throw{code:'no-profile'};CLOUD={uid:user.uid,me:d.data()};return CLOUD}
async function fbDangXuat(){fbSub.forEach(f=>{try{f()}catch(e){}});fbSub=[];try{await fbDayNgay()}catch(e){}try{await FB.auth.signOut()}catch(e){}CLOUD=null;location.reload()}
async function fbDoiMK(){const p=prompt('Mật khẩu mới (ít nhất 6 kí tự):');if(!p)return;if(p.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}
  try{await FB.auth.currentUser.updatePassword(p);toast('Đã đổi mật khẩu')}catch(e){toast(e.code==='auth/requires-recent-login'?'Đăng xuất rồi đăng nhập lại, sau đó đổi mật khẩu':fbLoi(e))}}
/* tạo tài khoản cho người khác bằng một phiên phụ (không làm đăng xuất quản lý) */
async function fbTaoTK(tk,pw){await fbInit();const app2=firebase.apps.find(a=>a.name==='tao')||firebase.initializeApp(FB_CFG,'tao');
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
    const co=new Set();(S.asg||[]).forEach(a=>{co.add(a.id);const j=JSON.stringify(a);if(fbLast['asg/'+a.id]!==j){fbLast['asg/'+a.id]=j;ghi.push(db.doc('asg/'+a.id).set({j,lop:a.lop||'',t:fbTS()}))}});
    Object.keys(fbLast).filter(k=>k.startsWith('asg/')&&!co.has(k.slice(4))).forEach(k=>{delete fbLast[k];ghi.push(db.doc(k).delete())});
  }
  if(ghi.length){await Promise.all(ghi);fbTrangThai('Đã lưu lên máy chủ')}
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
  fbSub.push(db.collection('asg').onSnapshot(q=>{S.asg=q.docs.map(d=>fbJ(d.data().j)).filter(a=>a&&mine(a));fbVe()},e=>console.error(e)));
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
  if(me.role!=='ph')fbSub.push(db.collection('asg').onSnapshot(q=>{const A=[];q.docs.forEach(d=>{const j=d.data().j;fbLast['asg/'+d.id]=j;const a=fbJ(j);if(a)A.push(a)});S.asg=A;fbVe()},e=>console.error(e)));
  else fbSub.push(db.collection('asg').onSnapshot(q=>{S.asg=q.docs.map(d=>fbJ(d.data().j)).filter(Boolean);fbVe()},e=>{}));
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
  let tk=(document.getElementById('nhTk').value||'').trim().toLowerCase();const pw=document.getElementById('nhPw').value;
  if(n.split(' ').length<2){toast('Nhập đủ họ và tên');return}
  if(!tk){const g=fbKhongDau(n).split(' ');tk=(g.pop()+g.map(x=>x[0]).join('')).replace(/[^a-z0-9]/g,'');let t=tk,i=2;while((o.hs||[]).some(r=>r[0]===t))t=tk+(i++);tk=t}
  if(!fbTkOk(tk)){toast('Tên đăng nhập 3–24 kí tự: chữ thường không dấu, số, dấu chấm');return}if(pw.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}
  if((o.hs||[]).some(r=>r[0]===tk)){toast('Tên đăng nhập đã có');return}
  toast('Đang tạo tài khoản…');
  try{const uid=await fbTaoTK(tk,pw),db=FB.db,st=newStudent(n,l?l.khoi:1);
    await db.doc('users/'+uid).set({role:'hs',tk,ten:n,khoi:l?l.khoi:0});
    await db.doc('hs/'+tk).set({j:JSON.stringify(fbTach(st).hs),ev:'[]',lop:l?lid:'',t:fbTS()});
    (o.hs=o.hs||[]).push([tk,n,l?l.khoi:0]);if(l)o.gd[tk]=lid;(o.nk=o.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Tạo tài khoản ${n} (${tk})`+(l?` · lớp ${lid}`:' · chưa xếp lớp')});
    S.st[tk]=st;fbDanhSach();save();await fbDayNgay();render();toast(`Đã tạo: ${tk} / ${pw}`)}catch(err){toast(fbLoi(err))}}
async function fbQLTaoGV(e){e.preventDefault();const o=S.org,n=document.getElementById('ngTen').value.trim(),tk=(document.getElementById('ngTk').value||'').trim().toLowerCase(),pw=document.getElementById('ngPw').value||'';
  if(n.length<3){toast('Nhập tên giáo viên');return}if(!fbTkOk(tk)){toast('Tên đăng nhập 3–24 kí tự: chữ thường không dấu, số, dấu chấm');return}if(pw.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}
  if((o.gv||[]).some(g=>g.id===tk)){toast('Đã có giáo viên này');return}toast('Đang tạo tài khoản…');
  try{const uid=await fbTaoTK(tk,pw);await FB.db.doc('users/'+uid).set({role:'gv',tk,ten:n,gvId:tk});
    o.gv.push({id:tk,ten:n,tk});o.nk.push({d:S.day,ai:'Quản lý trung tâm',t:`Tạo tài khoản giáo viên ${n} (${tk})`});save();await fbDayNgay();render();toast(`Đã tạo: ${tk} / ${pw}`)}catch(err){toast(fbLoi(err))}}
async function fbQLTaoPH(e){e.preventDefault();const o=S.org,con=document.getElementById('phHs').value,tk=(document.getElementById('phTk').value||'').trim().toLowerCase(),pw=document.getElementById('phPw').value||'';
  const r=(o.hs||[]).find(x=>x[0]===con);if(!r){toast('Chọn học sinh');return}if(!fbTkOk(tk)){toast('Tên đăng nhập 3–24 kí tự: chữ thường không dấu, số, dấu chấm');return}if(pw.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}
  toast('Đang tạo tài khoản…');
  try{const uid=await fbTaoTK(tk,pw);await FB.db.doc('users/'+uid).set({role:'ph',tk,ten:'Phụ huynh '+r[1],con:[con]});
    (o.ph=o.ph||{})[con]=tk;o.nk.push({d:S.day,ai:'Quản lý trung tâm',t:`Tạo tài khoản phụ huynh ${tk} cho ${r[1]}`});save();await fbDayNgay();render();toast(`Đã tạo: ${tk} / ${pw}`)}catch(err){toast(fbLoi(err))}}
{const _h=window.qlTaoHS,_g=window.qlTaoGV;window.qlTaoHS=e=>S.org&&S.org.cloud?fbQLTaoHS(e):_h(e);window.qlTaoGV=e=>S.org&&S.org.cloud?fbQLTaoGV(e):_g(e);window.qlTaoPH=fbQLTaoPH}

/* ---------- quản lý đặt lại mật khẩu (gói miễn phí không đổi được mật khẩu người khác,
   nên tạo tài khoản đăng nhập mới cho cùng tên đăng nhập, chuyển vai trò sang, bỏ tài khoản cũ; dữ liệu học giữ nguyên) ---------- */
function fbMKGoiY(){return 'jenny'+String(Math.floor(1000+Math.random()*9000))}
async function fbDatLaiMK(tk){const pw=prompt(`Mật khẩu mới cho "${tk}" (ít nhất 6 kí tự):`,fbMKGoiY());if(pw===null)return;if(pw.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}
  const db=FB.db;toast('Đang đặt lại…');
  try{const q=await db.collection('users').where('tk','==',tk).get();if(q.empty){toast('Không tìm thấy tài khoản '+tk);return}
    const L=await db.doc('login/'+tk).get(),cu=L.exists?L.data().uid:null,docCu=q.docs.find(d=>d.id===cu)||q.docs[0],du=docCu.data();
    const em=`${tk}.r${Date.now().toString(36)}@jenny-lop-hoc-ao.firebaseapp.com`;
    await fbInit();const app2=firebase.apps.find(a=>a.name==='tao')||firebase.initializeApp(FB_CFG,'tao');const c=await app2.auth().createUserWithEmailAndPassword(em,pw);const uid=c.user.uid;await app2.auth().signOut();
    await db.doc('users/'+uid).set(du);await db.doc('login/'+tk).set({email:em,uid,t:fbTS()});await Promise.all(q.docs.map(d=>db.doc('users/'+d.id).delete()));
    (S.org.nk=S.org.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Đặt lại mật khẩu cho ${tk}`});save();
    fbMKVua={tk,pw};render();toast(`Đã đặt lại: ${tk} / ${pw}`)}catch(e){console.error(e);toast(fbLoi(e))}}
let fbMKVua=null;
function fbTaiKhoanBox(){const o=S.org;if(!o||!o.cloud)return'';const lopTen=tk=>{const l=(o.lop||[]).find(x=>x.id===(o.gd||{})[tk]);return l?'Lớp '+l.ten:'chưa xếp lớp'};
  const R=[...(o.gv||[]).map(g=>({ten:g.ten,vai:(g.tk||g.id)===CLOUD.me.tk&&CLOUD.me.role==='ql'?'Quản lý · Giáo viên':'Giáo viên',tk:g.tk||g.id,them:(o.lop||[]).filter(l=>(l.gv||[]).includes(g.id)).map(l=>l.ten).join(', ')||'chưa có lớp'})),
    ...(o.hs||[]).map(([tk,ten])=>({ten,vai:'Học sinh',tk,them:lopTen(tk)})),
    ...Object.entries(o.ph||{}).map(([con,tk])=>{const h=(o.hs||[]).find(x=>x[0]===con);return{ten:'Phụ huynh '+(h?h[1]:con),vai:'Phụ huynh',tk,them:'con: '+(h?h[1]:con)}})];
  return`<section class="card"><h2>Tài khoản</h2><p class="muted" style="margin:4px 0 0">Tên đăng nhập của mọi người. Ai quên mật khẩu thì bấm "Đặt lại mật khẩu", rồi báo mật khẩu mới cho người đó. Dữ liệu học không mất.</p>
   ${fbMKVua?`<div class="task" style="margin-top:10px;border-left:4px solid var(--leaf)"><b>Vừa đặt lại:</b> ${esc(fbMKVua.tk)} / <code>${esc(fbMKVua.pw)}</code> <span class="muted">· ghi lại rồi báo cho người dùng</span></div>`:''}
   <div class="tablewrap"><table><tr><th>Họ tên</th><th>Vai trò</th><th>Tên đăng nhập</th><th>Lớp / con</th><th></th></tr>${R.map(r=>`<tr><td><b>${esc(r.ten)}</b></td><td>${r.vai}</td><td><code>${esc(r.tk)}</code></td><td>${esc(r.them)}</td><td>${r.tk===CLOUD.me.tk?'<span class="muted">dùng "Đổi mật khẩu"</span>':`<button class="btn sm" onclick="fbDatLaiMK('${esc(r.tk)}')">Đặt lại mật khẩu</button>`}</td></tr>`).join('')}</table></div></section>`}
{const _p=viewPH;viewPH=function(){const r=_p.apply(this,arguments);try{if(role==='ql'&&CLOUD&&S.org&&S.org.cloud){const m='<p class="muted" style="margin:0">Sắp có:';const i=r.lastIndexOf(m);const box=fbTaiKhoanBox();return i<0?r.replace(/<\/div>\s*$/,box+'</div>'):r.slice(0,i)+box+r.slice(i)}}catch(e){console.error(e)}return r}}

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
.fbme{display:flex;gap:6px;align-items:center;flex-wrap:wrap}@media(max-width:520px){.fbme{width:100%;order:5}.fbst{display:none}.fbme .btn{padding:6px 10px}}.fbst{font-size:12px}.fbst.loi{color:var(--coral)}
</style>`);
