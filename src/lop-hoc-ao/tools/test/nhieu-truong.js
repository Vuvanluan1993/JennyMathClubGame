// Kiểm tra nhiều trường (09/11/2026): tiền tố mã trường khi tạo tài khoản, giáo viên không thêm học sinh, máy chủ giả (truong/{mã}), bảng Các trường của admin Clb.
//   node tools/test/nhieu-truong.js  (chạy tools/build.py trước)
const {chromium}=require('playwright');const path=require('path');const G='file://'+path.resolve(__dirname,'..','..','..','..','games','lop-hoc-ao')+'/';
(async()=>{const b=await chromium.launch();const bad=[];
async function trang(dir,w=1000){const c=await b.newContext({viewport:{width:w,height:900}});const p=await c.newPage();const er=[];p.on('pageerror',x=>er.push(x.message));await p.route(/^https?:/,r=>r.abort());
 await p.goto(G+dir+'/index.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(500);return{p,er,c}}
// 1. Quản lý demo: thêm HS -> có tiền tố
{const {p,er}=await trang('quan-ly');await p.click('summary:has-text("Xem bản demo")');await p.fill('#gvP','giaovien123');await p.click('text=Vào bản demo');await p.waitForTimeout(800);
 const r=await p.evaluate(async()=>{qlMoHS();const tt=document.querySelector('#qlm .tt');document.getElementById('mHo').value='Trần Văn';document.getElementById('mTen').value='Bình';document.getElementById('mGt').value='nam';const truoc=new Set(Object.keys(S.st));await qlLuuHS();const moi=Object.keys(S.st).filter(k=>!truoc.has(k));return{tt:tt&&tt.textContent,moi,ph:Object.entries(S.org.ph||{}).filter(([c])=>moi.includes(c))}});
 console.log('QL demo',JSON.stringify(r),er);if(!r.moi[0]||!r.moi[0].startsWith('jenny.'))bad.push('demo HS chưa có tiền tố');}
// 2. Giáo viên demo: KHÔNG có nút + Thêm học sinh (thầy chốt 13/11/2026)
{const {p,er}=await trang('giao-vien',390);await p.click('summary:has-text("Xem bản demo")');await p.fill('#gvP','giaovien123');await p.click('text=Vào bản demo');await p.waitForTimeout(800);
 await p.evaluate(()=>{const l=S.org.lop.find(x=>x.gv.includes(gvMe));vaoLop(l.id)});await p.waitForTimeout(300);
 const nut=await p.$('text=+ Thêm học sinh');console.log('GV demo: nút thêm học sinh =',!!nut,er);if(nut)bad.push('GV vẫn có nút Thêm học sinh');}
// 3. fbBoc + bảng các trường (máy chủ giả)
{const {p,er}=await trang('quan-ly',1000);
 const r=await p.evaluate(async()=>{const D={},log=[];
  const mk=path=>({get:async()=>({exists:!!D[path],data:()=>D[path],id:path.split('/').pop()}),set:async(v,o)=>{log.push(['set',path,v]);D[path]=o&&o.merge?Object.assign({},D[path],v):Object.assign({},v)},update:async v=>{D[path]=Object.assign({},D[path],v)},onSnapshot:cb=>{setTimeout(()=>cb({exists:!!D[path],data:()=>D[path]}),0);return()=>{}}});
  const col=(n,f)=>({where:(a,op,v)=>col(n,(f||[]).concat([[a,v]])),get:async()=>({docs:Object.keys(D).filter(k=>k.startsWith(n+'/')&&k.split('/').length===2&&(f||[]).every(([a,v])=>D[k][a]===v)).map(k=>({id:k.split('/')[1],data:()=>D[k]}))}),onSnapshot:cb=>{return()=>{}}});
  const raw={doc:mk,collection:n=>col(n)};
  window.firebase={firestore:{FieldValue:{serverTimestamp:()=>'TS'}}};
  CLOUD={uid:'q',qt:true,me:{role:'ql',tk:'jenny.luan',gvId:'jenny.luan'},truong:'nguyendu'};
  const db=fbBoc(raw);await db.doc('hs/nguyendu.an').set({j:'{}'});await db.doc('org/main').set({j:'{}'},{merge:true});
  D['users/u1']={role:'hs',tk:'nguyendu.an',truong:'nguyendu'};D['users/u2']={role:'hs',tk:'jenny.an',truong:'jenny'};
  const q=await db.collection('users').where('tk','==','nguyendu.an').get(),q2=await db.collection('users').where('tk','==','jenny.an').get();
  const out={hsT:D['hs/nguyendu.an'].truong,org:!!D['truong/nguyendu'],qn:q.docs.length,q2:q2.docs.length,tkTr:tkTr('An '),bo:tkBo('nguyendu.an')};
  D['truong/jenny']={ma:'jenny',ten:'Clb Học Toán cùng Jenny',j:'{}'};D['truong/nguyendu']={ma:'nguyendu',ten:'TH Nguyễn Du',j:'{}',khoa:true};
  FB={db,raw,auth:{}};window.fbTaoTK=async(tk,pw)=>'uid_'+tk;
  S.org=S.org||{ten:'Clb'};qtMo();await new Promise(ok=>setTimeout(ok,200));
  qtFormTruong();document.getElementById('qfMa').value='levan';document.getElementById('qfTen').value='TH Lê Văn Tám';document.getElementById('qfQlTen').value='Cô Mai';document.getElementById('qfQlTk').value='comai';document.getElementById('qfQlPw').value='jenny1234';
  await qtTaoTruong();await new Promise(ok=>setTimeout(ok,200));
  out.taoT=!!D['truong/levan'];out.ql=D['users/uid_levan.comai'];out.gv=JSON.parse(D['truong/levan'].j).gv;
  QT_tim('an');return out});
 console.log('Máy chủ giả',JSON.stringify(r),er);
 if(r.hsT!=='nguyendu'||!r.org||r.qn!==1||r.q2!==0||r.tkTr!=='nguyendu.an'||!r.taoT||!r.ql||r.ql.role!=='ql'||r.ql.truong!=='levan')bad.push('máy chủ giả sai');
 }
console.log(bad.length?'LỖI: '+bad.join('; '):'ĐẠT');await b.close()})();
