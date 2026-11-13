// Rà chỗ chữ xuống dòng "vô duyên" ở 8 khổ màn hình (320–1440px).
//   node tools/test/xuong-dong.js [file.html]      (mặc định dist/lop-hoc-ao-jenny.html)
//   Biến môi trường: GR=1,3 (lớp) · WS=375,1024 (khổ) · MODE=lms (trang quản lý/giáo viên/phụ huynh) · EN=1 (tiếng Anh)
//   CHROME=đường dẫn chromium · FONT_ROUTE=file js nạp phông offline (máy không vào được Google Fonts) · OUT=thư mục kết quả
// Báo: tách "Lớp 1", số–đơn vị, "·" đầu dòng, chữ mồ côi cuối đoạn, nhãn ngắn bị xuống dòng, từ bị tách giữa.
const path=require('path');let pw;try{pw=require('playwright')}catch(e){pw=require('/opt/npm-tools/node_modules/playwright')}const fs=require('fs');
const FILE=process.argv[2]||path.resolve(__dirname,'../../dist/lop-hoc-ao-jenny.html');const OUT=process.env.OUT||'/tmp/xuong-dong';fs.mkdirSync(OUT,{recursive:true});
const W=(process.env.WS?process.env.WS.split(',').map(w=>[+w,800]):[[320,640],[375,740],[414,860],[768,1024],[820,1180],[1024,768],[1366,768],[1440,900]]);
const AUDIT=()=>{const out=[];const NUM=/^[\d.,/:%]+[!?.,:)]*$/;const KEY=/^(Lớp|Bài|Tiết|đề|Đảo|Bước|bước|Câu|câu|Grade|Lesson|Topic|Step|Trang|Màn|màn|Lần|lần|Tuần|tuần|Ngày|ngày|Tháng|tháng|khối|Khối|số|Số|Level|No\.|#)$/;
 const UNIT=/^(xu|câu|bài|phút|giây|ngày|lượt|vé|sao|đảo|em|lớp|cm|dm|m|mm|km|kg|g|l|ml|đồng|tuổi|giờ|tiết|lần|con|quả|cái|cặp|ván|tim|bước|chặng|coins?|stars?|min|days?|xu\.)[!?.,:)]*$/i;
 const vis=e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0.05};
 const blk=n=>{let e=n.parentElement;while(e&&getComputedStyle(e).display==='inline')e=e.parentElement;return e};
 const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const groups=new Map();let n;
 while(n=tw.nextNode()){if(!n.nodeValue.trim())continue;const pe=n.parentElement;if(!pe||/SCRIPT|STYLE|SVG|TEXT/i.test(pe.tagName)||pe.closest('svg'))continue;if(!vis(pe))continue;
  const b=blk(n);if(!b)continue;const re=/[^\s]+/g;let m;const toks=groups.get(b)||[];
  while(m=re.exec(n.nodeValue)){const r=document.createRange();r.setStart(n,m.index);r.setEnd(n,m.index+m[0].length);const rs=r.getClientRects();if(!rs.length)continue;
   const a=rs[0],z=rs[rs.length-1];if(rs.length>1&&Math.abs(a.top-z.top)>3)out.push({k:'tách giữa từ',t:m[0],ctx:b.textContent.trim().slice(0,60)});toks.push({w:m[0],top:z.top,left:a.left,h:a.height})}
  groups.set(b,toks)}
 groups.forEach((t,b)=>{if(t.length<2)return;const lines=[];t.forEach(o=>{const L=lines[lines.length-1];if(L&&Math.abs(o.top-L.top)<o.h*0.5)L.ws.push(o.w);else lines.push({top:o.top,ws:[o.w]})});if(lines.length<2)return;
  const txt=t.map(o=>o.w).join(' ');const cls=(b.className&&b.className.baseVal===undefined?b.className:'')+'';const tag=b.tagName.toLowerCase()+(cls?'.'+cls.split(' ').slice(0,2).join('.'):'');
  const flag=k=>out.push({k,tag,t:txt.slice(0,90),lines:lines.map(l=>l.ws.join(' ')).slice(0,4)});
  for(let i=1;i<lines.length;i++){const prev=lines[i-1].ws,cur=lines[i].ws,a=prev[prev.length-1],z=cur[0];
   if(KEY.test(a)&&NUM.test(z)){flag('tách "'+a+' '+z+'"');return}
   if(NUM.test(a)&&UNIT.test(z)){flag('tách số–đơn vị "'+a+' '+z+'"');return}
   if(/^[·:–\-]$/.test(z)){flag('dấu "·" đầu/cuối dòng');return}}
  const last=lines[lines.length-1].ws;if(last.length===1&&last[0].replace(/[!?.,:)]+$/,'').length<=3&&txt.length<=200){flag('mồ côi "'+last[0]+'"');return}
  if(txt.length<=26&&lines.length>=2&&!/^(button|a)$/.test(b.tagName.toLowerCase())===false){flag('nút ngắn xuống dòng');return}
  if(txt.length<=22&&lines.length>=2)flag('nhãn ngắn xuống dòng')});
 return out};
const SCREENS_LMS=[['ql','setRole("ql");qlDi("")'],['ql-hs','setRole("ql");qlDi("hs")'],['ql-ph','setRole("ql");qlDi("ph")'],['ql-gv','setRole("ql");qlDi("gv")'],['ql-lop','setRole("ql");qlDi("lop")'],['ql-lopct','setRole("ql");qlDi("lopct",(S.org.lop||[])[0].id)'],['ql-nam','setRole("ql");qlDi("nam")'],['ql-nk','setRole("ql");qlDi("nk")'],
 ['gv','setRole("gv")'],['gv-hs','role="gv";go({k:"gvhs",id:Object.keys(S.st).find(k=>S.st[k].grade==1)})'],['gv-hs-loi','role="gv";go({k:"gvhs",id:Object.keys(S.st).find(k=>S.st[k].grade==1),tab:"loi"})'],['ph','setRole("ph")']];
const SCREENS0=[
 ['home','go({k:"home",tab:"map"})'],['nha','go({k:"home",tab:"nha"})'],['shop','go({k:"home",tab:"shop"})'],['tudo','go({k:"home",tab:"tudo"})'],
 ['album','go({k:"home",tab:"album"})'],['hoso','go({k:"home",tab:"hoso"})'],['bai','go({k:"home",tab:"bai"})'],['fix','go({k:"home",tab:"fix"})'],['tl','go({k:"home",tab:"tl"})'],
 ['quest','go({k:"home",tab:"quest"})'],['isle','go({k:"home",tab:"isle"})'],['jenny','go({k:"home",tab:"jenny"})'],
 ['dao','go({k:"island",id:PRIM[G].isl[3].id})'],['dao-trum','go({k:"island",id:PRIM[G].isl.find(x=>/Trùm|trùm/.test(JSON.stringify(x)))?.id||PRIM[G].isl[8].id})'],
 ['tro-frog','startXG("frog",PRIM[G].isl[5].id)'],['tro-plant','startXG("plant",PRIM[G].isl[5].id)'],['tro-climb','startXG("climb",(PRIM[G].isl.find(x=>climbHas(x))||PRIM[G].isl[9]).id)'],
 ['tro-shop','startXG("shop",PRIM[G].isl[6].id)'],['tro-pair','startXG("pair",PRIM[G].isl[6].id)'],['tro-clock','startXG("clock",PRIM[G].isl[6].id)'],
];
(async()=>{const b=await pw.chromium.launch({executablePath:process.env.CHROME||undefined,...(process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY}}:{})});
 const res=[];const grades=(process.env.GR||'1,3').split(',').map(Number);
 for(const [w,h] of W){const ctx=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:w,height:h}});if(process.env.FONT_ROUTE)await require(path.resolve(process.env.FONT_ROUTE))(ctx);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+FILE,{waitUntil:'domcontentloaded'});await p.waitForTimeout(2500);
  for(const G of grades){
   await p.evaluate(G=>{window.sayJ=()=>{};try{speechSynthesis.speak=()=>{}}catch(e){};role='hs';const k=Object.keys(S.st).find(k=>S.st[k].grade==G&&/Na|Test0/.test((S.st[k].name||'')+k))||Object.keys(S.st).find(k=>S.st[k].grade==G);(0,eval)(`sid='${k}'`);window.G=G},G);
   const SCREENS=process.env.MODE==='lms'?SCREENS_LMS:SCREENS0;if(process.env.EN)await p.evaluate(()=>setLang('en'));
   for(const [nm,js] of SCREENS){try{await p.evaluate(js=>{try{stopXG()}catch(e){};(0,eval)(js)},js);await p.waitForTimeout(700);const r=await p.evaluate(AUDIT);r.forEach(o=>res.push({w,G,scr:nm,...o}))}catch(e){res.push({w,G,scr:nm,k:'LỖI',t:e.message.slice(0,80)})}}}
  if(errs.length)res.push({w,scr:'*',k:'LỖI TRANG',t:errs.slice(0,2).join(' | ')});await ctx.close()}
 await b.close();fs.writeFileSync(path.join(OUT,'xuong-dong.json'),JSON.stringify(res,null,1));
 const by={};res.forEach(r=>{const key=r.k.replace(/".*"/,'')+' | '+(r.tag||'')+' | '+(r.t||'');(by[key]=by[key]||new Set()).add(r.w+':'+r.scr)});
 const rows=Object.entries(by).sort((a,b)=>b[1].size-a[1].size);console.log('Tổng',res.length,'· mẫu khác nhau',rows.length);rows.slice(0,+(process.env.TOP||80)).forEach(([k,v])=>console.log(v.size,k,'@',[...v].slice(0,4).join(',')))})();
