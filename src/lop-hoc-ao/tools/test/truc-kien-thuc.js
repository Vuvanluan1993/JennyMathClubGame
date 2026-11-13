// Kiểm tra gắn dạng bài vào 6 trục "Sức mạnh Toán" (Số, Phép tính, Lời văn, Hình học, Đo lường, Thống kê).
//   node tools/test/truc-kien-thuc.js        → đếm số dạng bài mỗi trục theo lớp, liệt kê dạng chưa gắn trục
//   node tools/test/truc-kien-thuc.js -v     → in thêm danh sách dạng bài của từng trục
if(process.env.PW_DIR&&!process.env.PLAYWRIGHT_BROWSERS_PATH)process.env.PLAYWRIGHT_BROWSERS_PATH=process.env.PW_DIR; // thư mục trình duyệt Playwright (mặc định: của Playwright)
const path=require('path'),fs=require('fs');const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..','..');const EXE=process.env.CHROME; // không đặt → Chromium của Playwright
(async()=>{const b=await chromium.launch({executablePath:fs.existsSync(EXE)?EXE:undefined});const p=await b.newPage();
 await p.goto('file://'+path.join(ROOT,'dist','lop-hoc-ao-jenny.html'));await p.waitForTimeout(400);
 const r=await p.evaluate(()=>{const out={},un=new Set();for(const g of [1,2,3,4,5]){const c={};HS_AX.forEach(a=>c[a.k]=new Set());
   PRIM[g].isl.forEach(x=>{const tp=(PRIM[g].T[x.ti||0]||[''])[0];x.lv.forEach(gs=>gs.forEach(gn=>{for(let k=0;k<3;k++){let q;try{q=gn()}catch(e){continue}const kd=q.kind||'Câu hỏi',a=hsAxOf(kd,tp);if(a)c[a].add(kd);else un.add(`L${g} ${kd} (${tp})`)}}))});
   out[g]=Object.fromEntries(Object.entries(c).map(([k,s])=>[k,[...s]]))}return{out,un:[...un]}});
 const v=process.argv.includes('-v');
 for(const g in r.out){console.log(`Lớp ${g}: `+Object.entries(r.out[g]).map(([k,s])=>`${k} ${s.length}`).join(' · '));if(v)for(const[k,s]of Object.entries(r.out[g]))console.log(`  [${k}] ${s.join('; ')}`)}
 console.log(r.un.length?`CHƯA GẮN TRỤC (${r.un.length}):\n  `+r.un.join('\n  '):'ĐẠT: mọi dạng bài đã có trục');await b.close();process.exit(r.un.length?1:0)})();
