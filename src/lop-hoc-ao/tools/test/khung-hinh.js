// Rà khung hình: dựng mọi dạng câu ở khổ 360px, báo phần tử tràn màn hình/tràn khung, nhóm so sánh không ngang hàng.
//   node tools/test/khung-hinh.js [lớp,lớp] [số lần mỗi dạng]
if(process.env.PW_DIR&&!process.env.PLAYWRIGHT_BROWSERS_PATH)process.env.PLAYWRIGHT_BROWSERS_PATH=process.env.PW_DIR; // thư mục trình duyệt Playwright (mặc định: của Playwright)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||undefined});
const css='';
const grades=(process.argv[2]||'1,2,3,4,5').split(',').map(Number),REP=+(process.argv[3]||3);const all=[];
for(const G of grades){const p=await b.newPage({viewport:{width:360,height:780}});await p.goto('file://'+require('path').resolve(__dirname,'..','..','dist','lop-hoc-ao-jenny.html'));if(css)await p.addStyleTag({content:css});await p.waitForTimeout(400);await p.evaluate(()=>document.fonts.ready);
 const r=await p.evaluate(async([G,REP])=>{role='hs';muted=true;(0,eval)("sid=Object.keys(S.st).find(k=>S.st[k].grade=="+G+")");const bad={};const W=innerWidth;
  for(const x of PRIM[G].isl){for(let L=0;L<x.lv.length;L++)for(let gi=0;gi<x.lv[L].length;gi++){for(let t=0;t<REP;t++){let q;try{q=x.lv[L][gi]()}catch(e){continue}
   startG1(x.id,Math.min(L,2));scr.qs=[q];scr.j=0;scr.sheet=null;render();await new Promise(r=>requestAnimationFrame(r));
   const probs=[];const root=document.querySelector('.game');if(!root)continue;
   for(const el of root.querySelectorAll('.gmid *,.gbot *')){const rc=el.getBoundingClientRect();if(!rc.width||getComputedStyle(el).visibility==='hidden')continue;if(rc.right>W+1||rc.left<-1){probs.push('ngoài màn hình: '+(el.className||el.tagName));break}}
   for(const el of root.querySelectorAll('.g1grp,.g1rows,.g1vs,.g1opts button,.g1pic>*,.qtxt,.g1bub')){if(el.scrollWidth>el.clientWidth+2){probs.push('tràn khung: '+String(el.className||el.tagName).split(' ')[0]);break}}
   for(const v of root.querySelectorAll('.g1vs')){const ch=[...v.children].map(c=>c.getBoundingClientRect()).filter(r=>r.width);if(ch.length>1&&Math.max(...ch.map(r=>r.top+r.height/2))-Math.min(...ch.map(r=>r.top+r.height/2))>12){probs.push('so sánh không ngang hàng');break}}
   if(document.scrollingElement.scrollWidth>W+1)probs.push('trang bị cuộn ngang');
   if(probs.length){const k=G+' | '+(q.kind||'?');if(!bad[k])bad[k]={n:0,ex:x.id+' L'+L+' '+gdTxt(q.q).slice(0,60)+' → '+probs.join(', ')};bad[k].n++}}}}
  return Object.entries(bad).map(([k,v])=>k+' ('+v.n+') '+v.ex)},[G,REP]);all.push(...r);await p.close()}
console.log(all.join('\n')||'Không có lỗi khung');await b.close()})();
