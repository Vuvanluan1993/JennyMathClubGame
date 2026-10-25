// Rà trò "Lật thẻ ghép đôi": mọi cặp thẻ phải cùng giá trị, không hai cặp trùng giá trị. node tools/test/the-ghep-doi.js
if(process.env.PW_DIR&&!process.env.PLAYWRIGHT_BROWSERS_PATH)process.env.PLAYWRIGHT_BROWSERS_PATH=process.env.PW_DIR; // thư mục trình duyệt Playwright (mặc định: của Playwright)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||undefined});
const p=await b.newPage({viewport:{width:390,height:844}});await p.goto('file://'+require('path').resolve(__dirname,'..','..','dist','lop-hoc-ao-jenny.html'));await p.waitForTimeout(600);
const r=await p.evaluate(()=>{role='hs';muted=true;
 const val=t=>{const lab=String(t).match(/Bể có (\d+) con cá/);if(lab)return +lab[1];const ex=String(t).replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/−/g,'-').replace(/×/g,'*').replace(/ : /g,'/').replace(/(\d) (?=\d{3})/g,'$1').replace(/,/g,'.').trim();if(/^[\d\s.+\-*\/()]+$/.test(ex))try{return Math.round(Function('return '+ex)()*1e9)/1e9}catch(e){}return 'X:'+ex};
 const out={n:0,short:0,bad:{},dup:{}};
 for(const G of [1,2,3,4,5]){(0,eval)("sid=Object.keys(S.st).find(k=>S.st[k].grade=="+G+")");for(const x of PRIM[G].isl){for(let k=0;k<25;k++){let d;try{d=pairDeck(x)}catch(e){continue}out.n++;if(d.length!==12)out.short++;
  const by={};d.forEach(c=>{(by[c.id]=by[c.id]||[]).push(c)});for(const id in by){const [a,c]=by[id];if(!c||val(a.t)!==val(c.t))out.bad[G+' '+x.id+' '+String(a.t).replace(/<[^>]+>/g,'')+' ↔ '+String(c&&c.t)]=1}
  const vs={};d.forEach(c=>{const v=val(c.t);(vs[v]=vs[v]||new Set()).add(c.id)});for(const v in vs)if(vs[v].size>1)out.dup[G+' '+x.id+' value '+v]=1}}}
 return{n:out.n,short:out.short,bad:Object.keys(out.bad).slice(0,20),dup:Object.keys(out.dup).slice(0,20),nd:Object.keys(out.dup).length}});
console.log(r.bad.length||r.nd||r.short?'LỖI: '+JSON.stringify(r,null,1):'ĐẠT: '+r.n+' bộ thẻ, mọi cặp đúng giá trị, không trùng giá trị');await b.close()})();
