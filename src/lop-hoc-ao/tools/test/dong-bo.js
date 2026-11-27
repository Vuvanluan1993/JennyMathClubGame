// Kiểm tra đồng bộ tiến độ học sinh với máy chủ (giả lập Firestore, không cần mạng). Dùng bản học sinh games/lop-hoc-ao/index.html (chạy tools/build.py trước).
//   node tools/test/dong-bo.js
// Kiểm tra: dấu thời gian chỉ đổi khi dữ liệu đổi; bản trên máy mới hơn (làm lúc mất mạng) được giữ và đẩy lên;
// máy khác cập nhật thì máy này nhận; ghi lỗi thì lần sau ghi lại.
if(process.env.PW_DIR&&!process.env.PLAYWRIGHT_BROWSERS_PATH)process.env.PLAYWRIGHT_BROWSERS_PATH=process.env.PW_DIR; // thư mục trình duyệt Playwright (mặc định: của Playwright)
const path=require('path'),fs=require('fs');const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..','..');const EXE=process.env.CHROME; // không đặt → Chromium của Playwright
(async()=>{const b=await chromium.launch({executablePath:fs.existsSync(EXE)?EXE:undefined});const tmp=path.join(ROOT,'..','..','games','lop-hoc-ao','index.html');
 const p=await b.newPage();await p.route(/^https?:/,r=>r.abort());const er=[];p.on('pageerror',e=>er.push(e.message));await p.goto('file://'+tmp,{waitUntil:'domcontentloaded'});await p.waitForTimeout(300);
 const r=await p.evaluate(async()=>{const bad=[],log=[];const wait=ms=>new Promise(ok=>setTimeout(ok,ms));
  /* Firestore giả */
  const D={},subs={};let hong=0,ghi=0;
  const snap=(k,pending)=>({exists:!!D[k],data:()=>D[k],metadata:{hasPendingWrites:!!pending}});
  const fire=k=>(subs[k]||[]).forEach(cb=>cb(snap(k)));
  const doc=k=>({get:async()=>snap(k),set:async v=>{if(hong){hong--;throw{code:'unavailable',message:'mất mạng'}}ghi++;D[k]=Object.assign({},v);setTimeout(()=>fire(k),0)},update:async v=>{D[k]=Object.assign({},D[k],v)},delete:async()=>{delete D[k]},
    onSnapshot:(cb)=>{(subs[k]=subs[k]||[]).push(cb);setTimeout(()=>cb(snap(k)),0);return()=>{}}});
  window.firebase={firestore:{FieldValue:{serverTimestamp:()=>'TS'}}};
  FB={db:{doc,collection:n=>({onSnapshot:cb=>{setTimeout(()=>cb({docs:[]}),0);return()=>{}}})}};
  const tk='emthu';D['org/main']={j:JSON.stringify({lop:[{id:'1A',khoi:1,gv:[]}],gd:{emthu:'1A'}})};
  const st0=newStudent('Em Thử',1);st0._t=1000;st0.coins=50;D['hs/'+tk]={j:JSON.stringify(st0),ev:'[]'};
  /* bản trên máy (làm lúc mất mạng) mới hơn: có thêm 1 trang Tự luyện */
  const stL=JSON.parse(JSON.stringify(st0));stL._t=5000;stL.coins=80;stL.tl={x:{n:1,best:{ok:5,n:5,tt:1,t:1}}};
  localStorage.setItem('jennyHSc_'+tk,JSON.stringify({st:{[tk]:stL},events:[]}));
  CLOUD={uid:'u1',me:{role:'hs',tk,ten:'Em Thử',khoi:1}};
  await fbHsBoot();await wait(50);
  if(S.st[tk].coins!==80||!S.st[tk].tl)bad.push('không giữ bản làm lúc mất mạng');
  await fbDayNgay();await wait(20);const sv=JSON.parse(D['hs/'+tk].j);if(sv.coins!==80)bad.push('chưa đẩy bản trên máy lên máy chủ');
  /* dấu thời gian */
  const t1=S.st[tk]._t;save();if(S.st[tk]._t!==t1)bad.push('lưu không đổi gì mà dấu thời gian vẫn đổi');
  await wait(5);S.st[tk].coins+=5;save();if(!(S.st[tk]._t>t1))bad.push('dữ liệu đổi mà không đổi dấu thời gian');
  await fbDayNgay();await wait(20);if(JSON.parse(D['hs/'+tk].j).coins!==85)bad.push('không ghi thay đổi lên máy chủ');
  /* ghi lỗi → lần sau ghi lại */
  S.st[tk].coins+=1;save();hong=1;await fbDayNgay();await wait(20);if(JSON.parse(D['hs/'+tk].j).coins===86)bad.push('giả lập lỗi không chạy');
  await fbDay();await wait(20);if(JSON.parse(D['hs/'+tk].j).coins!==86)bad.push('ghi lỗi xong không ghi lại');
  /* máy khác cập nhật */
  const other=JSON.parse(D['hs/'+tk].j);other.coins=200;other._t=Date.now()+60000;D['hs/'+tk]={j:JSON.stringify(other),ev:'[]'};fire('hs/'+tk);await wait(50);
  if(S.st[tk].coins!==200)bad.push('không nhận dữ liệu mới từ máy khác');
  /* bản máy chủ cũ hơn thì không ghi đè */
  const old=JSON.parse(D['hs/'+tk].j);old.coins=1;old._t=10;D['hs/'+tk]={j:JSON.stringify(old),ev:'[]'};fire('hs/'+tk);await wait(50);
  if(S.st[tk].coins===1)bad.push('bản cũ ghi đè bản mới');
  return{bad,ghi}});
 const ok=!r.bad.length&&!er.length;console.log(`Đồng bộ: ${ok?'ĐẠT':'CHƯA ĐẠT'} · ${r.ghi} lần ghi`);[...r.bad,...er.slice(0,5)].forEach(s=>console.log('   - '+s));
 await b.close();process.exit(ok?0:1)})();
