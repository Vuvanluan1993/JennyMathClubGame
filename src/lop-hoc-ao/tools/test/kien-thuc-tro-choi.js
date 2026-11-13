/* Kiểm tra: trò Chơi thêm không vượt kiến thức đã học tới đảo đó.
   Chạy: node tools/test/kien-thuc-tro-choi.js [lớp...]   (cần playwright: npm ci ở gốc kho; PW_DIR nếu trình duyệt ở chỗ khác) */
const path=require('path'),fs=require('fs');
if(process.env.PW_DIR&&!process.env.PLAYWRIGHT_BROWSERS_PATH)process.env.PLAYWRIGHT_BROWSERS_PATH=process.env.PW_DIR; // thư mục trình duyệt Playwright (mặc định: của Playwright)
const pw=require('playwright');
const OUT=process.env.OUT_DIR||path.resolve(__dirname,'..','..','..','..','.ci','kien-thuc');
const grades=process.argv.slice(2).map(Number).filter(Boolean);const G=grades.length?grades:[1,2,3,4,5];
(async()=>{const b=await pw.chromium.launch({executablePath:process.env.CHROME||undefined});const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../../dist/lop-hoc-ao-jenny.html'));await p.waitForTimeout(600);
 let all=[],tl={};const NAME={fish:'Câu cá',balloon:'Bóng bay',race:'Đua giờ',star:'Hứng sao',pair:'Lật thẻ',tug:'Kéo co',clock:'Đồng hồ',scale:'Cân',shop:'Cửa hàng',train:'Tàu hoả',mole:'Chuột',frog:'Ếch',shape:'Ghép hình',bait:'Thả mồi',plant:'Trồng cây',climb:'Leo núi'};
 const csv=['lop,chu_de,dao,tro_choi'];
 for(const g of G){const t0=Date.now();const r=await p.evaluate(g=>{role='hs';const id=Object.keys(S.st).find(k=>S.st[k].grade==g);(0,eval)(`sid='${id}'`);
   const before=ktAuditBefore(g,8);const t1=performance.now();ktBalance(g);const tb=performance.now()-t1;const rows=ktAudit(g,12);
   const I=PRIM[g].isl,cnt={};const list=I.map((x,k)=>{const o=islOpts2(x);o.forEach(m=>cnt[m]=(cnt[m]||0)+1);return[x.ti+1,x.short,o]});
   const kt=ktGrade(g).map((e,k)=>({k,isl:I[k].short,max:e.max,f:[...e.f].sort().join(' ')}));
   return{before:before.length,beforeBy:before.reduce((a,r)=>(a[r.mode]=(a[r.mode]||0)+1,a),{}),rows,cnt,list,kt,tb:Math.round(tb),n:I.length,dist:[1,2,3].map(n=>list.filter(l=>l[2].length===n).length)}},g);
   all=all.concat(r.rows);tl[g]=r.kt;r.list.forEach(([ti,s,o])=>csv.push(`${g},${ti},"${s}","${o.map(m=>NAME[m]).join('; ')}"`));
   console.log(`Lớp ${g}: ${r.n} đảo · trước: ${r.before} cặp đảo–trò vượt kiến thức ${JSON.stringify(r.beforeBy)} · sau: vi phạm ${r.rows.length} · chia trò ${Math.round((Date.now()-t0)/1000)}s (balance ${r.tb}ms) · 1/2/3 trò ${r.dist.join('/')}`);
   console.log('   '+Object.keys(NAME).map(m=>`${NAME[m]} ${r.cnt[m]||0}`).join(' · '))}
 fs.mkdirSync(OUT,{recursive:true});
 fs.writeFileSync(path.join(OUT,'vi-pham.csv'),'﻿lop,chu_de,dao,tro,vi_pham,mau\n'+all.map(r=>`${r.G},${r.ti},"${r.isl}",${r.mode},"${r.v}","${r.sample.replace(/"/g,"'")}"`).join('\n'));
 fs.writeFileSync(path.join(OUT,'cho-choi.csv'),'﻿'+csv.join('\n'));fs.writeFileSync(path.join(OUT,'kien-thuc.json'),JSON.stringify(tl,null,1));
 if(all.length){const by={};all.forEach(r=>{const k=r.mode+' '+r.v;by[k]=(by[k]||0)+1});console.log('Vi phạm theo loại:',Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,25))}
 if(G.includes(1)){const ex=await p.evaluate(()=>{const I=PRIM[1].isl;return I.slice(0,12).map(x=>{const K=ktOf(x);return{isl:x.short,max:K.max,f:[...K.f].join(' '),games:islOpts2(x).map(m=>[m,ktClean(ktSample(x,m,1)[0]||'').slice(0,90)])}})});
   console.log('\nLớp 1 · 12 đảo đầu:');ex.forEach(e=>{console.log(`- ${e.isl} [đã học: ${e.f} · số ≤ ${e.max}]`);e.games.forEach(([m,s])=>console.log(`    ${NAME[m]}: ${s}`))})}
 console.log(errs.length?'LỖI TRANG: '+errs.slice(0,3).join(' | '):'Không lỗi trang');console.log(all.length?'CHƯA ĐẠT':'ĐẠT: không trò nào vượt kiến thức');await b.close();process.exit(all.length?1:0)})();
