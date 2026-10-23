/* 52 — Tủ đồ (thầy yêu cầu 23/10/2026): trong Nhà em, học sinh phối đồ cho Jenny bằng những món đã có.
   Áo váy (cả áo mở từ Hộ chiếu và áo mua ở Cửa hàng), Mũ & kính, Khung ảnh. Chạm là mặc ngay, lưu luôn. */
function tdLook(st){const s=ghSt(st);return{of:st.outfit||'',acc:s.acc||'',pet:'',frame:s.frame||''}}
function tdCard(on,pic,name,click,tag){return`<button type="button" class="tdit ${on?'on':''}" onclick="${click}" aria-pressed="${on}"><span class="tdpic">${pic}</span><b>${esc(name)}</b>${on?`<i class="ghtag on">${arcT('Đang dùng','In use')}</i>`:tag?`<i class="ghtag">${tag}</i>`:''}</button>`}
function viewTudo(st){const s=ghSt(st),own=ofOwn(st),L=tdLook(st),en=arcEN();
 const ofs=[['',arcT('Áo xanh gốc','Original top')]].concat(Object.keys(OUTFIT).filter(k=>own.has(k)).map(k=>[k,OUTFIT[k].n]));
 const accs=[['',arcT('Không đội','None')]].concat(Object.keys(GH_ACC).filter(k=>s.own.includes(k)).map(k=>{const it=(GH.find(c=>c.k==='acc')||{it:[]}).it.find(x=>x[0]===k);return[k,it?it[1]:k]}));
 const frs=[['',arcT('Không khung','None')]].concat(['wood','silver','gold','rainbow'].filter(k=>s.own.includes(k)).map(k=>[k,(GH.find(c=>c.k==='frame').it.find(x=>x[0]===k)||[k,k])[1]]));
 const sec=(title,list,make,emptyCat)=>`<h3 class="ghgh">${title}</h3><div class="tdgrid">${list.map(make).join('')}${list.length<=1?`<button type="button" class="tdit tdmore" onclick="go({k:'home',tab:'shop'});scr.ghCat='${emptyCat}';render()"><span class="tdpic">${spr('shopI',30)}</span><b>${arcT('Mua ở Cửa hàng','Buy in the shop')}</b></button>`:''}</div>`;
 return`<div class="page tdpage"><div class="crumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'nha'})">← ${arcT('Nhà em','My home')}</button><span class="grow"></span><button type="button" class="chip ghchip" onclick="go({k:'home',tab:'shop'})">🪙 <b>${st.coins}</b> <span>${arcT('Cửa hàng ▸','Shop ▸')}</span></button></div>
  <section class="card tdtop"><h2>${spr('jenny',24)} ${arcT('Tủ đồ của Jenny','Jenny’s wardrobe')}</h2><div class="tdstage">${ghJenny(150,L)}<div class="tdinfo"><b>${esc(L.of?OUTFIT[L.of].n:arcT('Áo xanh gốc','Original top'))}</b><small>${L.acc?esc((accs.find(a=>a[0]===L.acc)||['',''])[1]):arcT('Không đội mũ','No hat')} · ${L.frame?esc((frs.find(a=>a[0]===L.frame)||['',''])[1]):arcT('Không khung','No frame')}</small><small class="muted">${arcT('Chạm món đồ bên dưới để mặc thử. Đồ mặc lưu ngay.','Tap an item below to wear it. It saves right away.')}</small></div></div></section>
  <section class="card tdbody">
   ${sec(arcT('Áo váy','Outfits'),ofs,([k,n])=>tdCard(L.of===k,spr(k?ofVariant('jenny',k):'jenny',54),n,`tdSet('of','${k}')`),'of')}
   ${sec(arcT('Mũ & kính','Hats & glasses'),accs,([k,n])=>tdCard(L.acc===k,k?spr(GH_ACC[k][0],28):`<span class="tdnone">∅</span>`,n,`tdSet('acc','${k}')`),'acc')}
   ${sec(arcT('Khung ảnh','Frames'),frs,([k,n])=>tdCard(L.frame===k,k?`<span class="ghfr fr-${k}">${spr('jenny',34)}</span>`:`<span class="tdnone">∅</span>`,n,`tdSet('frame','${k}')`),'frame')}
   <p class="muted" style="font-size:13px;margin:12px 0 0">${arcT('Áo mới mở thêm khi em hạ trùm ở mỗi vùng biển (Hộ chiếu) hoặc mua ở Cửa hàng. Đồ cho thú cưng mặc ở Đảo nhà.','Unlock outfits by beating sea bosses (Passport) or buy them in the shop. Pet clothes are on your Home isle.')}</p>
   <div class="archbtn"><button type="button" class="btn sm" onclick="go({k:'home',tab:'shop'})">${arcT('Mua thêm đồ','Buy more')} ▸</button></div></section></div>`}
function tdSet(k,v){const st=S.st[sid],s=ghSt(st);if(k==='of'){if(v&&!ofOwn(st).has(v))return;st.outfit=v}else if(k==='acc'){if(v&&!s.own.includes(v))return;s.acc=v}else if(k==='frame'){if(v&&!s.own.includes(v))return;s.frame=v}save();try{sfx('card')}catch(e){}render()}
NHA_TABS.push('tudo');
{const _v=viewHome1t;viewHome1t=function(){if(scr.tab!=='tudo')return _v.apply(this,arguments);scr.tab='nha';let r;try{r=_v.apply(this,arguments)}finally{scr.tab='tudo'}const i=r.indexOf('<nav class="bnav"');return viewTudo(S.st[sid])+(i>=0?r.slice(i):'')}}
/* Nhà em: khung "Tủ đồ" ngay dưới 3 ô */
{const _n=viewNha;viewNha=function(st){const r=_n.apply(this,arguments);try{const L=tdLook(st),s=ghSt(st),n=ofOwn(st).size+Object.keys(GH_ACC).filter(k=>s.own.includes(k)).length+['wood','silver','gold','rainbow'].filter(k=>s.own.includes(k)).length;
  const box=`<section class="card tdhome"><div class="tdhrow">${ghJenny(84,L)}<div class="grow"><h2>${spr('jenny',22)} ${arcT('Tủ đồ','Wardrobe')}</h2><small>${arcT(`Em có ${n} món đồ. Phối đồ cho Jenny nhé!`,`You own ${n} items. Dress up Jenny!`)}</small><button type="button" class="gobtn tdgo" onclick="go({k:'home',tab:'tudo'})">${arcT('Phối đồ','Dress up')} ▸</button></div></div></section>`;
  const i=r.indexOf('<section class="card archome">');return i<0?r:r.slice(0,i)+box+r.slice(i)}catch(e){return r}}}
Object.assign(I18N,{'Tủ đồ':'Wardrobe','Phối đồ':'Dress up'});
document.head.insertAdjacentHTML('beforeend',`<style>
.tdhome{margin-top:14px;padding:12px!important}.tdhrow{display:flex;align-items:center;gap:12px}.tdhrow .grow{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:4px}.tdhrow h2{display:flex;align-items:center;gap:6px;margin:0;font-size:26px}.tdhrow small{font-size:13px;color:var(--muted)}
.tdhrow .ghj{background:linear-gradient(#BDEBFA 0 62%,#F6D98B 62%);box-shadow:var(--f2)}.tdgo{margin:4px 0 0!important;width:auto!important;align-self:flex-start;font-size:16px!important;padding:8px 12px!important}
.tdtop{padding:12px!important}.tdtop h2{display:flex;align-items:center;gap:6px;margin:0 0 10px;font-size:26px}
.tdstage{display:flex;gap:14px;align-items:flex-end;padding:12px;background:linear-gradient(#BDEBFA 0 62%,#F6D98B 62%);box-shadow:var(--f2);color:#13263a}
.tdinfo{display:flex;flex-direction:column;gap:4px;align-self:center;min-width:0}.tdinfo b{font-family:var(--f-display);font-size:24px;font-weight:400;line-height:1}.tdinfo small{font-size:13px;color:#3D4A70}
.tdbody{margin-top:14px;padding:12px!important}.tdbody .ghgh:first-child{margin-top:0}
.tdgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tdit{display:flex;flex-direction:column;align-items:center;gap:3px;border:0;padding:8px 4px;background:var(--surface,#fff);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A);cursor:pointer;min-width:0}
.tdit.on{background:var(--leaf-soft);box-shadow:0 0 0 3px #2AB563,0 4px 0 0 var(--pxk,#1F2A5A)}.tdit:active{transform:translateY(3px)}
.tdit .tdpic{height:58px;display:grid;place-items:center}.tdit b{font-family:var(--f-body);font-size:13px;line-height:1.15;text-align:center;font-weight:700}
.tdnone{font-family:var(--f-display);font-size:34px;color:var(--muted)}.tdmore{background:var(--sun-soft)}
</style>`);
Object.assign(I18N,{'Đóng ✕':'Close ✕','Đóng':'Close'});
