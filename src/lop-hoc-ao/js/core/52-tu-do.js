/* 52 — Tủ đồ (thầy yêu cầu 23/10/2026): trong Nhà em, học sinh phối đồ cho Jenny bằng những món đã có.
   Áo váy (cả áo mở từ Hộ chiếu và áo mua ở Cửa hàng), Mũ & kính, Khung ảnh. Chạm là mặc ngay, lưu luôn. */
function tdLook(st){const s=ghSt(st);return{of:st.outfit||'',accs:accsOf(s),pet:'',frame:s.frame||''}}
function tdCard(on,pic,name,click,tag){return`<button type="button" class="tdit ${on?'on':''}" onclick="${click}" aria-pressed="${on}"><span class="tdpic">${pic}</span><b>${esc(name)}</b>${on?`<i class="ghtag on">${arcT('Đang dùng','In use')}</i>`:tag?`<i class="ghtag">${tag}</i>`:''}</button>`}
function viewTudo(st){const s=ghSt(st),own=ofOwn(st),L=tdLook(st),en=arcEN();
 const ofs=[['',arcT('Áo xanh gốc','Original top')]].concat(Object.keys(OUTFIT).filter(k=>own.has(k)).map(k=>[k,OUTFIT[k].n]));
 const accs=[['',arcT('Bỏ hết','Remove all')]].concat(Object.keys(GH_ACC).filter(k=>s.own.includes(k)).map(k=>{const it=(GH.find(c=>c.k==='acc')||{it:[]}).it.find(x=>x[0]===k);return[k,it?it[1]:k]}));
 const frs=[['',arcT('Không khung','None')]].concat(['wood','silver','gold','rainbow'].filter(k=>s.own.includes(k)).map(k=>[k,(GH.find(c=>c.k==='frame').it.find(x=>x[0]===k)||[k,k])[1]]));
 const sec=(title,list,make,emptyCat)=>`<div class="tdsec"><h3 class="ghgh">${title}</h3><div class="tdgrid">${list.map(make).join('')}</div>${list.length<=1?`<p class="tdempty">${arcT('Em chưa có món nào ở mục này.','Nothing here yet.')}</p>`:''}</div>`;
 const C={of:[arcT('Áo váy','Outfits'),ofs,L.of?spr(ofVariant('jenny',L.of),40):spr('jenny',40),([k,n])=>tdCard(L.of===k,spr(k?ofVariant('jenny',k):'jenny',54),n,`tdSet('of','${k}')`),L.of?OUTFIT[L.of].n:arcT('Áo xanh gốc','Original top')],
  acc:[arcT('Mũ & kính','Hats & glasses'),accs,L.accs.length?`<span class="tdaccs">${L.accs.map(k=>spr(GH_ACC[k][0],L.accs.length>1?18:26)).join('')}</span>`:`<span class="tdnone">∅</span>`,([k,n])=>tdCard(k?L.accs.includes(k):!L.accs.length,k?spr(GH_ACC[k][0],28):`<span class="tdnone">∅</span>`,n,`tdSet('acc','${k}')`,k?ACC_SN[ACC_SLOT[k]||'head']():''),L.accs.length?L.accs.map(k=>(accs.find(a=>a[0]===k)||['',k])[1]).join(' + '):arcT('Không đội mũ','No hat')],
  frame:[arcT('Khung ảnh','Frames'),frs,L.frame?`<span class="ghfr fr-${L.frame}">${spr('jenny',26)}</span>`:`<span class="tdnone">∅</span>`,([k,n])=>tdCard(L.frame===k,k?`<span class="ghfr fr-${k}">${spr('jenny',34)}</span>`:`<span class="tdnone">∅</span>`,n,`tdSet('frame','${k}')`),L.frame?(frs.find(a=>a[0]===L.frame)||['',''])[1]:arcT('Không khung','No frame')]};
 const coin=`<span class="grow"></span><button type="button" class="chip ghchip" onclick="go({k:'home',tab:'shop'})">🪙 <b>${st.coins}</b> <span>${arcT('Cửa hàng ▸','Shop ▸')}</span></button>`;
 const cat=C[scr.tdCat]?scr.tdCat:'';
 if(cat){const [t,list,,make,curN]=C[cat];
  return`<div class="page tdpage"><div class="crumb"><button class="btn sm ghost" onclick="scr.tdCat='';render();scrollTo(0,0)">← ${arcT('Tủ đồ','Wardrobe')}</button>${coin}</div>
  <section class="card tdsub"><h2>${C[cat][2]} ${t}</h2><div class="tdstage tdmini ${L.frame?'fr-'+L.frame:''}">${ghJenny(96,{...L,frame:''})}<div class="tdinfo"><small>${arcT('Đang dùng','Wearing')}</small><b>${esc(curN)}</b><small>${arcT('Chạm một món để mặc thử, lưu ngay.','Tap an item to wear it.')}</small></div></div>
   <div class="tdgrid" style="margin-top:12px">${list.map(make).join('')}</div>${list.length<=1?`<p class="tdempty">${arcT('Em chưa có món nào ở mục này.','Nothing here yet.')}</p>`:''}
   ${cat==='acc'?`<p class="tdhint">${arcT('Em đeo được nhiều món cùng lúc: <b>1 mũ</b> + <b>1 kính</b> + <b>1 nơ/kẹp tóc</b>. Chạm lần nữa để bỏ ra.','Wear several at once: <b>1 hat</b> + <b>1 glasses</b> + <b>1 bow/clip</b>. Tap again to take off.')}</p>`:''}${cat==='frame'?`<p class="tdhint">${arcT('Khung hiện quanh ảnh Jenny ở đây và ở thẻ chào trên trang Bản đồ.','The frame shows around Jenny here and on your welcome card.')}</p>`:''}
   ${cat==='of'?`<p class="muted" style="font-size:13px;margin:12px 0 0">${arcT('Áo mới mở thêm khi em hạ trùm ở mỗi vùng biển (Hộ chiếu) hoặc mua ở Cửa hàng.','Unlock outfits by beating sea bosses (Passport) or buy them in the shop.')}</p>`:''}
   <div class="archbtn"><button type="button" class="btn sm" onclick="go({k:'home',tab:'shop'});scr.ghCat='${cat}';render()">${arcT('Mua thêm','Buy more')} ${t.toLowerCase()} ▸</button></div></section></div>`}
 return`<div class="page tdpage"><div class="crumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'nha'})">← ${arcT('Nhà em','My home')}</button>${coin}</div>
  <section class="card tdtop"><h2>${spr('jenny',24)} ${arcT('Tủ đồ của Jenny','Jenny’s wardrobe')}</h2><div class="tdstage ${L.frame?'fr-'+L.frame:''}">${ghJenny(150,{...L,frame:''})}<div class="tdinfo"><b>${esc(C.of[4])}</b><small>${esc(C.acc[4])} · ${esc(C.frame[4])}</small></div></div></section>
  <section class="card tdbody"><h3 class="ghgh" style="margin-top:0">${arcT('Chọn loại đồ để thay','Choose what to change')}</h3>
   <div class="tdcats" role="group">${Object.keys(C).map(k=>`<button type="button" class="tdcat" onclick="scr.tdCat='${k}';render();scrollTo(0,0)"><span class="tdcic">${C[k][2]}</span><b>${C[k][0]}</b><small>${C[k][1].length-1} ${arcT('món','items')} ▸</small></button>`).join('')}</div>
   <p class="muted" style="font-size:13px;margin:12px 0 0">${arcT('Đồ cho thú cưng mặc ở Đảo nhà.','Pet clothes are on your Home isle.')}</p></section></div>`}
function tdSet(k,v){const st=S.st[sid],s=ghSt(st);if(k==='of'){if(v&&!ofOwn(st).has(v))return;st.outfit=v}else if(k==='acc'){if(v&&!s.own.includes(v))return;accToggle(s,v)}else if(k==='frame'){if(v&&!s.own.includes(v))return;s.frame=v}save();try{sfx('card')}catch(e){}render()}
NHA_TABS.push('tudo');
/* ===== Đeo nhiều phụ kiện cùng lúc (thầy yêu cầu 23/10): 1 mũ + 1 kính + 1 nơ/kẹp tóc ===== */
const ACC_SLOT={cap:'head',witch:'head',crown:'head',bcap:'head',mhat:'head',glass:'face',bow:'hair',flower:'hair'};
const ACC_SN={head:()=>arcT('Mũ','Hat'),face:()=>arcT('Kính','Glasses'),hair:()=>arcT('Tóc','Hair')};
const ACC_ORD=['head','hair','face'];
function accsOf(s){if(!Array.isArray(s.accs))s.accs=s.acc?[s.acc]:[];s.accs=s.accs.filter((k,i,a)=>GH_ACC[k]&&s.own.includes(k)&&a.indexOf(k)===i);s.acc=s.accs[0]||'';return s.accs.slice().sort((a,b)=>ACC_ORD.indexOf(ACC_SLOT[a]||'head')-ACC_ORD.indexOf(ACC_SLOT[b]||'head'))}
function accWith(list,id){const sl=ACC_SLOT[id]||'head';return list.filter(k=>(ACC_SLOT[k]||'head')!==sl).concat(id)}
function accToggle(s,id){const cur=accsOf(s);s.accs=!id?[]:cur.includes(id)?cur.filter(k=>k!==id):accWith(cur,id);s.acc=s.accs[0]||''}
function accImgs(list,u,cls){return list.slice().sort((a,b)=>ACC_ORD.indexOf(ACC_SLOT[a]||'head')-ACC_ORD.indexOf(ACC_SLOT[b]||'head')).filter(k=>GH_ACC[k]).map(k=>{const[nm,x,y]=GH_ACC[k],d=pxURI(nm);return`<img class="px ${cls}" src="${d.u}" alt="" style="left:${x*u}px;top:${y*u}px;width:${d.w*u}px;height:${d.h*u}px">`}).join('')}
ghJenny=function(H,L){const u=H/19,of=L.of,body=spr(of?ofVariant('jenny',of):'jenny',H);const list=L.accs||(L.acc?[L.acc]:[]);
 const p=L.pet?`<span class="ghpet">${spr(L.pet,Math.round(H*.42))}</span>`:'';
 return`<span class="ghj ${L.frame?'fr-'+L.frame:''}"><span class="ghjb" style="width:${16*u}px;height:${H}px">${body}${accImgs(list,u,'ghacc')}</span>${p}</span>`};
ghLook=function(st){const s=ghSt(st),T=scr.ghTry||{},cur=accsOf(s);return{of:'of' in T?T.of:(st.outfit||''),accs:'acc' in T&&T.acc?(cur.includes(T.acc)?cur:accWith(cur,T.acc)):cur,pet:T.pet||'',frame:'frame' in T?T.frame:s.frame}};
/* Cửa hàng: "Đang dùng"/"Dùng/Bỏ ra" theo danh sách nhiều món */
{const _c=ghCard;ghCard=function(c,x,st){if(c.k!=='acc')return _c.apply(this,arguments);const s=ghSt(st),sv=s.acc;s.acc=accsOf(s).includes(x[0])?x[0]:'';try{return _c.apply(this,arguments)}finally{s.acc=sv}}}
{const _v=viewShop;viewShop=function(st){const s=ghSt(st),T=scr.ghTry;if(!(T&&T.k==='acc'))return _v.apply(this,arguments);const sv=s.acc;s.acc=accsOf(s).includes(T.id)?T.id:'';try{return _v.apply(this,arguments)}finally{s.acc=sv}}}
{const _u=ghUse;ghUse=function(silent){const st=S.st[sid],s=ghSt(st),T=scr.ghTry;if(!(T&&T.k==='acc'))return _u.apply(this,arguments);if(!s.own.includes(T.id))return;accToggle(s,T.id);scr.ghTry=null;save();if(!silent)try{sfx('card')}catch(e){}render()}}
/* Jenny ở mọi nơi (thẻ chào, câu hỏi…) đeo đủ các món */
{const _j=jenny;jenny=function(size,mood){try{if(role!=='hs')return _j.apply(this,arguments);const st=S.st[sid],s=st&&st.shop;if(!s)return _j.apply(this,arguments);const list=accsOf(s),sv=s.acc;s.acc='';let r;try{r=_j.apply(this,arguments)}finally{s.acc=sv}if(!list.length)return r;const u=Math.round(size*.86)/19;
 return r.replace('<span class="jbody">',`<span class="jbody">${accImgs(list,u,'jsacc')}`)}catch(e){return _j.apply(this,arguments)}}}
{const _v=viewHome1t;viewHome1t=function(){if(scr.tab!=='tudo')return _v.apply(this,arguments);scr.tab='nha';let r;try{r=_v.apply(this,arguments)}finally{scr.tab='tudo'}const i=r.indexOf('<nav class="bnav"');return viewTudo(S.st[sid])+(i>=0?r.slice(i):'')}}
/* Nhà em: khung "Tủ đồ" ngay dưới 3 ô */
{const _n=viewNha;viewNha=function(st){const r=_n.apply(this,arguments);try{const L=tdLook(st),s=ghSt(st),n=ofOwn(st).size+Object.keys(GH_ACC).filter(k=>s.own.includes(k)).length+['wood','silver','gold','rainbow'].filter(k=>s.own.includes(k)).length;
  const box=`<section class="card tdhome"><div class="tdhrow">${ghJenny(84,L)}<div class="grow"><h2>${spr('jenny',22)} ${arcT('Tủ đồ','Wardrobe')}</h2><small>${arcT(`Em có ${n} món đồ. Phối đồ cho Jenny nhé!`,`You own ${n} items. Dress up Jenny!`)}</small></div></div><div class="archbtn"><button type="button" class="btn sm" onclick="go({k:'home',tab:'tudo'})">${arcT('Phối đồ','Dress up')} ▸</button></div></section>`;
  const i=r.indexOf('<section class="card archome">');return i<0?r:r.slice(0,i)+box+r.slice(i)}catch(e){return r}}}
Object.assign(I18N,{'Tủ đồ':'Wardrobe','Phối đồ':'Dress up'});
document.head.insertAdjacentHTML('beforeend',`<style>
.tdhome{margin-top:14px;padding:12px!important}.tdhrow{display:flex;align-items:center;gap:12px}.tdhrow .grow{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:4px}.tdhrow h2{display:flex;align-items:center;gap:6px;margin:0;font-size:26px}.tdhrow small{font-size:13px;color:var(--muted)}
.tdhrow .ghj{background:linear-gradient(#BDEBFA 0 62%,#F6D98B 62%);box-shadow:var(--f2)}.tdgo{margin:4px 0 0!important;width:auto!important;align-self:flex-start;font-size:16px!important;padding:8px 12px!important}
.tdtop{padding:12px!important}.tdtop h2{display:flex;align-items:center;gap:6px;margin:0 0 10px;font-size:26px}
.tdstage{display:flex;gap:14px;align-items:flex-end;padding:12px;background:linear-gradient(#BDEBFA 0 62%,#F6D98B 62%);box-shadow:var(--f2);color:#13263a}
.tdinfo{display:flex;flex-direction:column;gap:4px;align-self:center;min-width:0}.tdinfo b{font-family:var(--f-display);font-size:24px;font-weight:400;line-height:1}.tdinfo small{font-size:13px;color:#3D4A70}
.tdbody{margin-top:14px;padding:12px!important}.ghj.fr-wood,.ghfr.fr-wood,.tdstage.fr-wood{box-shadow:inset 0 0 0 3px #6B3F1D,inset 0 0 0 7px #9A6234!important}
.ghj.fr-silver,.ghfr.fr-silver,.tdstage.fr-silver{box-shadow:inset 0 0 0 3px #9AA4C0,inset 0 0 0 7px #E3E7F0!important}
.ghj.fr-gold,.ghfr.fr-gold,.tdstage.fr-gold{box-shadow:inset 0 0 0 3px #C97A00,inset 0 0 0 7px #FCD655!important}
.ghj.fr-rainbow,.ghfr.fr-rainbow,.tdstage.fr-rainbow{box-shadow:inset 0 0 0 3px #12B5E8,inset 0 0 0 6px #2AB563,inset 0 0 0 9px #FCB40C,inset 0 0 0 12px #F04A1B!important}
.ghj[class*="fr-"]{padding:12px}.ghfr{margin:0!important;padding:9px!important}.ghfr.fr-rainbow{padding:13px!important}
.tdstage[class*="fr-"]{padding:16px}.tdstage.fr-rainbow{padding:20px}
.herojav.fr-wood .jav.jav{box-shadow:0 0 0 3px #9A6234,0 0 0 6px #6B3F1D!important}.herojav.fr-silver .jav.jav{box-shadow:0 0 0 3px #E3E7F0,0 0 0 6px #9AA4C0!important}
.herojav.fr-gold .jav.jav{box-shadow:0 0 0 3px #FCD655,0 0 0 6px #C97A00!important}.herojav.fr-rainbow .jav.jav{box-shadow:0 0 0 2px #F04A1B,0 0 0 4px #FCB40C,0 0 0 6px #2AB563,0 0 0 8px #12B5E8!important}
.tdaccs{display:inline-flex;gap:2px;align-items:center}.tdhint{margin:10px 0 0;padding:8px 10px;background:var(--sun-soft);color:var(--ink);font-size:13px;line-height:1.4;box-shadow:var(--f2)}
.tdsub h2{display:flex;align-items:center;gap:8px;margin:0 0 10px;font-size:26px}.tdmini{padding:8px 12px;align-items:center}.tdmini .tdinfo b{font-size:22px}
.tdcats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:6px}.tdcat{display:flex;flex-direction:column;align-items:center;gap:2px;border:0;padding:8px 4px;background:var(--surface,#fff);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A);cursor:pointer;min-width:0}.tdcat.on{background:var(--sun-soft);box-shadow:0 0 0 3px #FCB40C,0 4px 0 0 var(--pxk,#1F2A5A)}.tdcat:active{transform:translateY(3px)}.tdcat b{font-family:var(--f-display);font-size:20px;font-weight:400;line-height:1}.tdcat small{font-size:12px;color:var(--muted)}.tdcic{height:44px;display:grid;place-items:center}
.tdsecs{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:4px 18px}.tdsec .ghgh{margin-top:0}.tdsec{margin-bottom:14px}
.tdgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,150px));gap:10px}.tdempty{margin:6px 0 0;font-size:13px;color:var(--muted)}
.tdit{display:flex;flex-direction:column;align-items:center;gap:3px;border:0;padding:8px 4px;background:var(--surface,#fff);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A);cursor:pointer;min-width:0}
.tdit.on{background:var(--leaf-soft);box-shadow:0 0 0 3px #2AB563,0 4px 0 0 var(--pxk,#1F2A5A)}.tdit:active{transform:translateY(3px)}
.tdit .tdpic{height:58px;display:grid;place-items:center}.tdit b{font-family:var(--f-body);font-size:13px;line-height:1.15;text-align:center;font-weight:700}
.tdnone{font-family:var(--f-display);font-size:34px;color:var(--muted)}.tdmore{background:var(--sun-soft)}
</style>`);
Object.assign(I18N,{'Đóng ✕':'Close ✕','Đóng':'Close'});
