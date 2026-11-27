// Rà tiếng Anh (cần đã chạy tools/build.py).
//   node tools/test/tieng-anh.js        → lớp 1
//   node tools/test/tieng-anh.js 2 20   → lớp 2, sinh 20 câu mỗi dạng
// Bật EN rồi sinh câu hỏi, lời giải, lời Jenny đọc, phương án, hình, khung hướng dẫn khi sai, bài giảng,
// tên đảo/chủ đề/trùm và chữ hiện trên màn hình. Báo mọi chuỗi còn chữ tiếng Việt (trừ tên riêng và "đồng")
// hoặc còn sót kí hiệu khuôn ({o}, {w}, {be}…). Thoát mã 1 nếu còn lỗi.
if(process.env.PW_DIR&&!process.env.PLAYWRIGHT_BROWSERS_PATH)process.env.PLAYWRIGHT_BROWSERS_PATH=process.env.PW_DIR; // thư mục trình duyệt Playwright (mặc định: của Playwright)
const path=require('path'),fs=require('fs');const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..','..');const EXE=process.env.CHROME; // không đặt → Chromium của Playwright
const G=Number(process.argv[2]||1),REP=Number(process.argv[3]||12);
(async()=>{const b=await chromium.launch({executablePath:fs.existsSync(EXE)?EXE:undefined});
 const tmp=path.join(ROOT,'dist','_test_en.html');fs.writeFileSync(tmp,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(path.join(ROOT,'dist','lop-hoc-ao-jenny.html'),'utf8')+'</body></html>');
 const p=await b.newPage({viewport:{width:375,height:780}});const er=[];p.on('pageerror',e=>er.push(e.message));
 await p.addInitScript(()=>{try{localStorage.setItem('jennyLang','en')}catch(e){}});
 await p.goto('file://'+tmp);await p.waitForTimeout(400);
 const r=await p.evaluate(([G,REP])=>{muted=true;role='hs';(0,eval)("sid=Object.keys(S.st).find(k=>S.st[k].grade=="+G+")");
  if(!EN_GR.has(G))return{off:1};setLang('en');
  const NAMES=new RegExp('(Việt|đồng|Lan|Nam|Mai|Jenny'+(typeof STUDENTS!=='undefined'?'|'+STUDENTS.map(s=>s[1]).filter(Boolean).join('|'):'')+')','g'),VI=/[À-ÖØ-öø-ỹđĐ]/,TOK=/\{[owWa]\d*(:[spSP])?\}|\{be\}|(^|[^&\w])#\d*(?![\w;])|<>/;
  const bad={};let n=0;
  const strip=h=>String(h).replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<[^>]*>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
  const chk=(s,src,raw)=>{if(s==null||typeof s!=='string')return;n++;const t=strip(s);if(!t)return;const u=t.replace(NAMES,'');if(VI.test(u)||TOK.test(t)){const k=src+' | '+t.slice(0,160);if(!bad[k])bad[k]={src,out:t.slice(0,200),vi:raw?strip(raw).slice(0,200):'',n:0};bad[k].n++}};
  const T=s=>trEN(s);
  for(const x of PRIM[G].isl){['lesson','short','goal','title'].forEach(f=>chk(x[f],'đảo',x._vi&&x._vi[f]));
   x.lv.forEach(gs=>gs.forEach(gn=>{for(let t=0;t<REP;t++){let q;try{q=gn()}catch(e){continue}
    chk(q.q,'đề');chk(q.say,'đọc');chk(q.sol,'lời giải');chk(q.label,'nhãn');chk(q.pic,'hình');(q.opts||[]).forEach(o=>chk(o&&typeof o==='object'?o.h:String(o),'phương án'));(q.tiles||[]).forEach(o=>chk(String(o),'thẻ'));
    try{const k=gdKind(q);if(k&&t<3){for(const f of gdFrames(q,k)){chk(T(f.h),'hướng dẫn',f.h);chk(T(f.say),'hướng dẫn (đọc)',f.say);if(f.mcq){chk(T(f.mcq.q),'hướng dẫn hỏi',f.mcq.q);chk(T(f.mcq.ok),'hướng dẫn đúng',f.mcq.ok);chk(T(f.mcq.hint),'hướng dẫn gợi ý',f.mcq.hint);f.mcq.opts.forEach(o=>chk(T(String(o)),'hướng dẫn chọn',String(o)))}}}}catch(e){}}}))}
  (PRIM[G].T||[]).forEach(t=>chk(Array.isArray(t)?t[0]:t,'chủ đề'));(PRIM[G].boss||[]).forEach(bb=>bb&&chk(Array.isArray(bb)?bb[1]:bb.baseName,'trùm'));
  const L=LES[G]||{};for(const k in L)(L[k]||[]).forEach(sl=>{chk(sl.t,'slide tiêu đề',sl._vi&&sl._vi.t);chk(sl.h,'slide',sl._vi&&sl._vi.h);chk(sl.say,'slide (đọc)',sl._vi&&sl._vi.say)});
  /* màn hình: bản đồ, từng đảo, một màn chơi */
  const scrTxt=src=>{try{i18nApply(document.body)}catch(e){}const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let x;while(x=w.nextNode()){const pe=x.parentElement;if(!pe||pe.closest('script,style')||pe.offsetParent===null)continue;chk(x.nodeValue,src)}};
  const tabs=['map','jenny','fix','col','hoso'];for(const t of tabs){try{go({k:'home',tab:t});scrTxt('màn '+t)}catch(e){}}
  for(const x of PRIM[G].isl){try{go({k:'island',id:x.id});scrTxt('màn đảo')}catch(e){}}
  for(const x of PRIM[G].isl.slice(0,60)){try{startG1(x.id,0);scrTxt('màn chơi');scr.end=1;render();scrTxt('màn kết thúc')}catch(e){}}
  for(const x of PRIM[G].isl){try{startLes(x.id,1);const S_=(LES[G]||{})[x.b]||[];for(let i=0;i<S_.length;i++){scr.i=i;render();scrTxt('màn bài giảng')}}catch(e){}}
  try{const x=PRIM[G].isl.find(i=>i.lv&&i.lv[0]);startG1(x.id,0);for(const gs of x.lv)for(const gn of gs){const q=gn();const k=gdKind(q);if(k){gdOpenF(gdFrames(q,k),0,k);scrTxt('hướng dẫn');document.querySelectorAll('.gdov').forEach(e=>e.remove())}}}catch(e){}
  return{n,bad:Object.values(bad).sort((a,b)=>b.n-a.n)}},[G,REP]);
 fs.unlinkSync(tmp);await b.close();
 if(r.off){console.log(`Lớp ${G}: chưa bật tiếng Anh (EN_GR).`);process.exit(1)}
 if(er.length)console.log('LỖI TRANG:',[...new Set(er)].slice(0,5).join(' | '));
 console.log(`Lớp ${G}: đã rà ${r.n} chuỗi, còn ${r.bad.length} chuỗi chưa dịch hết.`);
 r.bad.slice(0,200).forEach(x=>console.log(`  [${x.src}] ×${x.n}  ${x.out}${x.vi&&x.vi!==x.out?'   ⟵ '+x.vi:''}`));
 process.exit(r.bad.length||er.length?1:0)})();
