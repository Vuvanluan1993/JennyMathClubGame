// Kiểm tra tách dữ liệu trường (13/11/2026): tờ lớp lop/{mã}__{lớp}, thẻ xếp lớp xep/{tk};
// học sinh dựng sổ thu gọn từ 2 tờ đó (không có họ tên bạn khác, không có thông tin phụ huynh); giáo viên chỉ ghi tờ lớp mình;
// admin Clb dựng lại tờ cho cả trường.   node tools/test/tach-lop.js  (chạy tools/build.py trước)
const {chromium}=require('playwright');const path=require('path');const G='file://'+path.resolve(__dirname,'..','..','..','..','games','lop-hoc-ao')+'/';
(async()=>{const b=await chromium.launch();const bad=[];
 const c=await b.newContext();const p=await c.newPage();const er=[];p.on('pageerror',x=>er.push(x.message));await p.route(/^https?:/,r=>r.abort());
 await p.goto(G+'quan-ly/index.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(500);
 const r=await p.evaluate(async()=>{const D={},log=[];
  const mk=path=>({get:async()=>({exists:!!D[path],data:()=>D[path],id:path.split('/').pop()}),set:async(v,o)=>{log.push(['set',path]);D[path]=o&&o.merge?Object.assign({},D[path],v):Object.assign({},v)},
    update:async v=>{D[path]=Object.assign({},D[path],v)},delete:async()=>{log.push(['xoa',path]);delete D[path]},onSnapshot:cb=>{setTimeout(()=>cb({exists:!!D[path],data:()=>D[path]}),0);return()=>{}}});
  const col=(n,f)=>({where:(a,op,v)=>col(n,(f||[]).concat([[a,v]])),get:async()=>({docs:Object.keys(D).filter(k=>k.startsWith(n+'/')&&k.split('/').length===2&&(f||[]).every(([a,v])=>D[k][a]===v)).map(k=>({id:k.split('/')[1],data:()=>D[k]}))})});
  const batch=()=>{const v=[];return{set:(r,x)=>v.push(()=>r.set(x)),delete:r=>v.push(()=>r.delete()),commit:async()=>{for(const f of v)await f()}}};
  const raw={doc:mk,collection:n=>col(n),batch};window.firebase={firestore:{FieldValue:{serverTimestamp:()=>'TS'}}};
  const o={ten:'TH Thử',lop:[{id:'1A',khoi:1,ten:'1A',gv:['th.co'],tj:{on:true}},{id:'2B',khoi:2,ten:'2B',gv:['th.thay'],tj:{on:false}}],
    hs:[['th.an','Nguyễn An',1],['th.binh','Lê Bình',2],['th.chi','Trần Chi',2]],gd:{'th.an':'1A','th.binh':'2B','th.chi':'2B'},mo:{'1A':{'d1b1':1},'2B':{}},nl:{'th.chi':1},
    phInfo:{'th.an':{dt:'0912345678',mail:'ph@gmail.com'}},nghi:{}};
  const out={};
  // 1. tờ dựng ra không có họ tên / SĐT
  const T=fbTo('th',o);out.cacTo=Object.keys(T).sort();const chu=JSON.stringify(T);out.loTen=/Nguyễn|Bình|0912|gmail/.test(chu);
  out.lop2B=T['lop/th__2B'];out.xepAn=T['xep/th.an'];
  // 2. admin dựng lại cả trường (có tờ thừa cũ thì xoá)
  CLOUD={uid:'q',qt:true,me:{role:'ql',tk:'jenny.luan',gvId:'jenny.luan'},truong:'th'};FB={db:fbBoc(raw),raw,auth:{}};
  D['xep/th.cu']={truong:'th',lop:'9Z'};D['xep/khac.x']={truong:'khac',lop:'1A'};
  out.dung=await fbDungTo('th',o);out.conCu=!!D['xep/th.cu'];out.conKhac=!!D['xep/khac.x'];out.coLop=!!D['lop/th__1A'];
  // 3. giáo viên lớp 1A đổi buổi mở lớp mình + (thử) lớp 2B -> chỉ ghi tờ 1A
  log.length=0;const o2=JSON.parse(JSON.stringify(o));o2.mo['1A'].d1b2=1;o2.mo['2B'].d1b1=1;
  await fbGhiTo('th',o,o2,new Set(['1A']));out.gvGhi=log.map(x=>x.join(' '));
  // 4. quản lý chuyển Chi sang 1A, bỏ Bình -> sửa 2 tờ lớp, sửa xep Chi, xoá xep Bình
  log.length=0;const o3=JSON.parse(JSON.stringify(o2));o3.gd['th.chi']='1A';delete o3.gd['th.binh'];
  await fbGhiTo('th',o2,o3);out.qlGhi=log.map(x=>x.join(' ')).sort();
  // 5. học sinh: sổ thu gọn từ tờ
  Object.keys(o3).forEach(k=>{});await fbDungTo('th',o3);
  CLOUD={uid:'u',me:{role:'hs',tk:'th.chi',truong:'th'},truong:'th'};fbHsOrg.p=null;
  const so=await fbHsOrg();out.hsSo=so;out.hsLoTen=/Nguyễn|Bình|0912|gmail|th\.an/.test(JSON.stringify(so).replace('"th.chi"',''));
  // 6. em chưa có thẻ, sổ trường bị chặn -> sổ rỗng (báo chưa xếp lớp); thẻ bị chặn -> trường khoá
  CLOUD={uid:'u',me:{role:'hs',tk:'th.moi',truong:'th'},truong:'th'};fbHsOrg.p=null;
  const chan=Object.assign({},raw,{doc:p=>p.startsWith('truong/')?{get:async()=>{throw{code:'permission-denied'}}}:mk(p)});FB={db:fbBoc(chan),raw:chan,auth:{}};
  out.chuaThe=await fbHsOrg();
  fbHsOrg.p=null;const chan2=Object.assign({},raw,{doc:p=>(p.startsWith('truong/')||p.startsWith('xep/'))?{get:async()=>{throw{code:'permission-denied'}}}:mk(p)});FB={db:fbBoc(chan2),raw:chan2,auth:{}};
  try{await fbHsOrg();out.khoa='không báo'}catch(x){out.khoa=x.code}
  // 7. cột sổ đầy
  out.soDay=document.documentElement.innerHTML.includes('<th>Sổ đầy</th>')&&typeof qaDungTo==='function';return out});
 console.log(JSON.stringify(r,null,1),er);
 const kv=(c,m)=>{if(!c)bad.push(m)};
 kv(r.cacTo.join()==='lop/th__1A,lop/th__2B,xep/th.an,xep/th.binh,xep/th.chi','tờ dựng ra sai');kv(!r.loTen,'tờ có họ tên/SĐT');
 kv(r.lop2B.ds.join()==='th.binh,th.chi'&&r.lop2B.nl.join()==='th.chi'&&r.lop2B.tj===false,'tờ 2B sai');kv(r.xepAn.lop==='1A'&&r.xepAn.khoi===1,'thẻ An sai');
 kv(r.dung.lop===2&&r.dung.hs===3&&r.dung.xoa===1&&!r.conCu&&r.conKhac&&r.coLop,'dựng lại sai');
 kv(r.gvGhi.length===1&&r.gvGhi[0]==='set lop/th__1A','giáo viên ghi ngoài lớp mình');
 kv(r.qlGhi.join('|')==='set lop/th__1A|set lop/th__2B|set xep/th.chi|xoa xep/th.binh','quản lý chuyển lớp ghi sai');
 kv(r.hsSo.tach&&r.hsSo.gd['th.chi']==='1A'&&r.hsSo.lop.length===1&&r.hsSo.mo['1A'].d1b2===1&&r.hsSo.nl['th.chi']===1&&!r.hsLoTen,'sổ thu gọn của học sinh sai');
 kv(!r.chuaThe.tach&&!Object.keys(r.chuaThe).length,'chưa có thẻ phải ra sổ rỗng');kv(r.khoa==='truong-khoa','thẻ bị chặn phải báo trường khoá');
 kv(r.soDay===true,'thiếu cột sổ đầy');kv(!er.length,'lỗi trang');
 // 8. học sinh đăng nhập thật (trang học sinh): sổ trường bị chặn, chỉ có tờ
 {const p2=await c.newPage();p2.on('pageerror',x=>er.push(x.message));await p2.goto(G+'index.html',{waitUntil:'domcontentloaded'});await p2.waitForTimeout(400);
  const h=await p2.evaluate(async()=>{const D={},doc=k=>k.startsWith('truong/')||k==='org/main'?{get:async()=>{throw{code:'permission-denied'}},onSnapshot:(a,b)=>{b&&b({code:'permission-denied'});return()=>{}}}
    :({get:async()=>({exists:!!D[k],data:()=>D[k]}),set:async v=>{D[k]=v},update:async v=>{},onSnapshot:cb=>{setTimeout(()=>cb({exists:!!D[k],data:()=>D[k]}),0);return()=>{}}});
   window.firebase={firestore:{FieldValue:{serverTimestamp:()=>'TS'}}};const db={doc,collection:()=>({onSnapshot:cb=>{setTimeout(()=>cb({docs:[]}),0);return()=>{}}})};FB={db,raw:db};window.dayNow=()=>1;
   D['xep/th.an']={truong:'th',lop:'2B',khoi:2,nghi:''};D['lop/th__2B']={truong:'th',id:'2B',ten:'2B',khoi:2,tj:true,mo:JSON.stringify({d1b1:1}),ds:['th.an'],nl:[],gv:[]};
   CLOUD={uid:'u',me:{role:'hs',tk:'th.an',ten:'An',khoi:2},truong:'th'};
   await fbHsBoot();await new Promise(o=>setTimeout(o,50));const st=S.st['th.an'];
   const kq={lop:S.lopHS,khoi:st.grade,active:st.active,mo:S.open};
   fbHsOrg.p=null;D['xep/th.an'].nghi='xong';try{fbSub=[];await fbHsBoot();kq.nghi='không báo'}catch(x){kq.nghi=x.code}return kq});
  console.log('Học sinh',JSON.stringify(h));kv(h.lop==='2B'&&h.khoi===2&&h.active===true&&h.mo.d1b1===1,'học sinh đăng nhập bằng tờ sai');kv(h.nghi==='hoc-xong','học xong phải báo');}
 console.log(bad.length?'LỖI: '+bad.join('; '):'ĐẠT');await b.close()})();
