// Kiểm tra tự động ứng dụng (cần đã chạy tools/build.py).
//   node tools/test/kiem-tra.js            → kiểm tra cả 5 lớp, mọi chủ đề
//   node tools/test/kiem-tra.js 3          → chỉ lớp 3
//   node tools/test/kiem-tra.js 3 6,7      → lớp 3, chủ đề 6 và 7 (đánh số từ 1)
// Kiểm tra: số đảo khớp số tiết trong vở, trùm ở đảo cuối chủ đề, đáp án đúng, không trùng phương án,
// không NaN/undefined, chữ không tràn màn hình 360px, mọi bài có Bài giảng Jenny, trò chơi nhỏ có luật hợp lí,
// phép tính trong slide (liệt kê dòng nghi ngờ để người xem lại).
if(process.env.PW_DIR&&!process.env.PLAYWRIGHT_BROWSERS_PATH)process.env.PLAYWRIGHT_BROWSERS_PATH=process.env.PW_DIR; // thư mục trình duyệt Playwright (mặc định: của Playwright)
const path=require('path'),fs=require('fs');const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..','..');const EXE=process.env.CHROME; // không đặt → Chromium của Playwright
const grades=process.argv[2]?[Number(process.argv[2])]:[1,2,3,4,5];const only=process.argv[3]?process.argv[3].split(',').map(n=>Number(n)-1):null;
const plan=JSON.parse(fs.readFileSync(path.join(ROOT,'data','plan.json'))).grades;
// P-15b: chạy trên dist/day-du.html (bản đầy đủ, nội dung tải theo khối bằng import() thật) qua máy chủ cục bộ; mỗi lớp chờ window.__ready(g).
const http=require('http');const MIME={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8'};
const may=http.createServer((req,res)=>{const u=decodeURIComponent(new URL(req.url,'http://x').pathname);
  if(u==='/_test.html'){res.writeHead(200,{'Content-Type':MIME['.html']});return res.end('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(path.join(ROOT,'dist','day-du.html'),'utf8')+'</body></html>')}
  const f=path.join(ROOT,'dist',u);if(!f.startsWith(path.join(ROOT,'dist'))||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end()}
  res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res)});
(async()=>{const b=await chromium.launch({executablePath:fs.existsSync(EXE)?EXE:undefined});
 await new Promise(r=>may.listen(0,'127.0.0.1',r));const URL_TEST=`http://127.0.0.1:${may.address().port}/_test.html`;
 let fail=0;
 for(const g of grades){const p=await b.newPage({viewport:{width:360,height:780},isMobile:true,hasTouch:true});const er=[];p.on('pageerror',e=>er.push(e.message));await p.goto(URL_TEST);await p.waitForTimeout(400);
  await p.evaluate(g=>window.__ready(g),g); // khối lớp g (import())
  const T=plan[String(g)].map((r,ti)=>({ti,name:r.name,so_dao:r.isl.length,bai:[...new Set(r.isl.map(i=>i.b))].map(bn=>({bai:bn,so_tiet:r.isl.filter(i=>i.b===bn).length}))})).filter(t=>!only||only.includes(t.ti));
  const SID={1:'na',2:'lam',3:'quan',4:'thao',5:'duc'}[g];
  const r=await p.evaluate(([g,SID,plan])=>{try{localStorage.clear()}catch(e){};fresh();role='hs';(0,eval)("sid='"+SID+"'");const bad=[],lay=[],mathc=[];let nq=0,ns=0;
   for(const T of plan){const L=PRIM[g].isl.filter(x=>(x.ti||0)===T.ti);if(L.length!==T.so_dao)bad.push(`chủ đề ${T.ti+1}: ${L.length} đảo, cần ${T.so_dao}`);
    for(const bb of T.bai){const n=L.filter(x=>x.b===bb.bai).length;if(n!==bb.so_tiet)bad.push(`bài ${bb.bai}: ${n} đảo, cần ${bb.so_tiet}`)}
    if(L.length&&!L[L.length-1].boss)bad.push(`chủ đề ${T.ti+1}: đảo cuối chưa có trùm`);
    const mg=T.ti?(MGT[T.ti]&&MGT[T.ti][g]):MG[g];if(!mg)bad.push(`chủ đề ${T.ti+1}: thiếu trò chơi nhỏ`);else['fish','balloon'].forEach(m=>{const r=mg[m]();let ok=0;for(let i=0;i<300;i++){const it=r.item();if(it.ok)ok++;if(/NaN|undefined/.test(String(it.t)))bad.push('trò chơi NaN '+T.ti+m)}if(ok<30||ok>230)bad.push(`trò chơi chủ đề ${T.ti+1} ${m}: tỉ lệ đúng ${ok}/300`)});
    for(const x of L){x.lv.forEach(gens=>gens.forEach(gn=>{for(let k=0;k<30;k++){let q;try{q=gn()}catch(e){bad.push(x.id+' lỗi '+e.message);break}nq++;
     if(!right1(q,q.a))bad.push(x.id+' đáp án sai '+q.kind);
     if(q.type==='num'&&(!Number.isInteger(q.a)||q.a<0))bad.push(x.id+' đáp số không hợp lệ '+q.a);
     if(q.type==='opt'){const hs=q.opts.map(o=>o.h);if(new Set(hs).size!==hs.length&&!/khác loại/.test(q.kind||''))bad.push(x.id+' trùng phương án '+q.kind)}
     if(q.type==='pick'&&!q.a.length)bad.push(x.id+' chạm chọn không có đáp án');
     if(/NaN|undefined/.test(JSON.stringify(q)))bad.push(x.id+' NaN/undefined '+q.kind);
     if(k<3){startG1(x.id,0);scr.qs[0]=q;scr.j=0;scr.picks=[];scr.seq=[];render();fitOpts();document.querySelectorAll('.g1opts button').forEach(bt=>{if(bt.scrollWidth>bt.clientWidth+2)lay.push('tràn nút '+x.id+' '+q.kind)});if(document.documentElement.scrollWidth>360)lay.push('tràn trang '+x.id+' '+q.kind)}}}))}
    for(const bb of T.bai){const S=(LES[g]||{})[bb.bai];if(!S){bad.push('thiếu bài giảng bài '+bb.bai);continue}const x=L.find(i=>i.b===bb.bai);startLes(x.id,1);S.forEach((sl,i)=>{ns++;scr.i=i;render();if(document.documentElement.scrollWidth>360)lay.push(`slide tràn bài ${bb.bai} trang ${i+1}`);
     const d=document.createElement('div');d.innerHTML=sl.h.replace(/<br>/g,' ').replace(/<\/(p|li|td|div)>/g,' ; ');const t=d.textContent.replace(/ /g,' ');const num='(\\d{1,3}(?: \\d{3})*(?:,\\d+)?)';const re=new RegExp(num+' ?([+−×:]) ?'+num+' ?= ?'+num+'(?![\\d,])','g');let m;const v=s=>Number(s.replace(/ /g,'').replace(',','.'));while((m=re.exec(t))){if(/[+−×:(\/]\s*$/.test(t.slice(Math.max(0,m.index-3),m.index)))continue;const A=v(m[1]),o=m[2],B=v(m[3]),C=v(m[4]);const res=o==='+'?A+B:o==='−'?A-B:o==='×'?A*B:A/B;if(Math.abs(res-C)>1e-9)mathc.push(`bài ${bb.bai}: ${t.slice(m.index,m.index+m[0].length+20)}`)}})}}
   return{nq,ns,bad:[...new Set(bad)],lay:[...new Set(lay)],mathc}},[g,SID,T]);
  const ok=!r.bad.length&&!r.lay.length&&!er.length;if(!ok)fail++;
  console.log(`Lớp ${g}: ${ok?'ĐẠT':'CHƯA ĐẠT'} · ${r.nq} câu · ${r.ns} trang slide`);[...r.bad.slice(0,20),...r.lay.slice(0,10),...er.slice(0,5)].forEach(s=>console.log('   - '+s));if(r.mathc.length)console.log('   (xem lại phép tính: '+r.mathc.slice(0,8).join(' | ')+')');await p.close()}
 may.close();await b.close();process.exit(fail?1:0)})();
