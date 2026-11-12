// Kiểm tra bản tóm tắt học tập (tom/{tk}) học sinh gửi lên máy chủ (giả lập). node tools/test/tom-tat.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const er=[];p.on('pageerror',x=>er.push(x.message));await p.route(/^https?:/,r=>r.abort());
await p.goto('file://'+require('path').resolve(__dirname,'..','..','..','..','games','lop-hoc-ao','index.html'),{waitUntil:'domcontentloaded'});await p.waitForTimeout(300);
console.log(JSON.stringify(await p.evaluate(async()=>{const D={};window.firebase={firestore:{FieldValue:{serverTimestamp:()=>'TS'}}};
 const doc=k=>({get:async()=>({exists:!!D[k],data:()=>D[k]}),set:async v=>{D[k]=v},update:async v=>{},onSnapshot:cb=>{setTimeout(()=>cb({exists:!!D[k],data:()=>D[k]}),0);return()=>{}}});
 FB={db:{doc,collection:()=>({onSnapshot:cb=>{setTimeout(()=>cb({docs:[]}),0);return()=>{}}})}};window.dayNow=()=>1;
 D['org/main']={j:JSON.stringify({lop:[{id:'1A',khoi:1,gv:[]}],gd:{'thu.an':'1A'}})};CLOUD={uid:'u',me:{role:'hs',tk:'thu.an',ten:'An',khoi:1},truong:'thu'};
 await fbHsBoot();const st=S.st['thu.an'];st.dd={[hsKey(new Date())]:{n:12,c:9,sec:100}};save();await fbDayNgay();await new Promise(o=>setTimeout(o,100));
 const t=D['tom/thu.an'];return t&&{ngay:t.ngay,cuoi:t.cuoi,n:t.dn[0],c:t.dc[0],lop:t.lop,k:t.k}})),er);await b.close()})();
