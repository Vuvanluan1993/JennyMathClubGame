/* 49 — Cửa hàng Jenny (tiêu xu) — thầy duyệt mẫu và bảng giá 20/10
   Học sinh tiểu học dùng xu mua: Trang phục, Mũ & kính, Khung ảnh, Đảo nhà, Thú cưng, Đồ nuôi; Vé game tư duy (sắp có).
   Thú cưng và đồ nuôi: xem 49b (Đảo nhà của em).
   Chạm món đồ = thử miễn phí trên khung xem trước; bấm Mua để trừ xu. Đồ đã mua bấm Dùng/Bỏ.
   Lưu: st.shop = {own:[mã], acc:'', pet:'', frame:'', dec:[mã]} ; trang phục mua dùng chung st.outfit. */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { render, toast } from './13-giao-dien-chung.js';
import { PXS, pxURI, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { sfx } from './33b-am-thanh.js';
import { ofVariant, OUTFIT } from './33e-ho-chieu.js';
import { careBuy, careGrid, careNote, careStage, petAct, petBuy, petCard, petNote } from './49b-dao-nha-thu-cung.js';
import { xuMua } from './64-xu.js';
Object.assign(PXS,{
 capS:["...bbbbbb.....","..bbbwwbbb....",".bbbbbbbbbb...",".BBBBBBBBBBBBB"],
 bowS:["rr...rr","rrr.rrr","rrrRrrr","rrr.rrr","rr...rr"],
 glassS:["kkkkk..kkkkk","kwbbkkkkwbbk","kbbbk..kbbbk","kkkkk..kkkkk"],
 witchS:["......PP......",".....PPPP.....",".....PPPP.....","....PPPPPP....","....yyyyyy....","...PPPPPPPP...","PPPPPPPPPPPPPP"],
 crown2S:["y..y....y..y","yy.yy..yy.yy","yyyyyyyyyyyy","yryybyybyyry","aaaaaaaaaaaa"],
 flowerS:[".c.c.","ccycc",".c.c.","..g..","..g.."].map(r=>r),
 tkS:["kkkkkkkkkkkkkk","kaaaakyyyyyyyk","kaaaakykkkkyyk","aaaaakyyyyyyya","kaaaakykkkyyyk","kaaaakyyyyyyyk","kkkkkkkkkkkkkk"],
});
/* trang phục bán ở gian hàng (đổi màu áo Jenny) */
Object.assign(OUTFIT,{
 s_lime:{n:'Áo Chanh tươi',m:{g:'l',G:'G',y:'y'}},
 s_peach:{n:'Váy Hoa đào',m:{g:'c',G:'r',y:'w',o:'r'}},
 s_sky:{n:'Áo Bầu trời',m:{g:'b',G:'p',y:'a',o:'p'}},
 s_hero:{n:'Áo Siêu nhân Toán',m:{g:'r',G:'B',y:'a',o:'B'}},
 s_gold:{n:'Áo Hoàng kim',m:{g:'a',G:'n',y:'w',o:'n'}},
});
['jenny','jennyBlink','jennyHappy','jennySad','jennyCheer'].forEach(n=>['s_lime','s_peach','s_sky','s_hero','s_gold'].forEach(o=>ofVariant(n,o)));
/* phụ kiện: vị trí theo ô lưới của Jenny (16×19) */
export const GH_ACC={cap:['capS',1,-1],bow:['bowS',10,-1],glass:['glassS',2,6],flower:['flowerS',11,-2],witch:['witchS',1,-5],crown:['crown2S',2,-3]};
export const GH_SLOT={palm:[18,34],umb:[40,44],castle:[60,40],flag:[78,26],light:[8,62],boat:[90,78]};
const FRAMES={wood:['#9A6234','#6B3F1D'],silver:['#E3E7F0','#9AA4C0'],gold:['#FCD655','#C97A00'],rainbow:null};
export const GH=[
 {k:'of',n:'Áo váy',ic:'jenny',it:[['s_lime','Áo Chanh tươi',120],['s_peach','Váy Hoa đào',150],['s_sky','Áo Bầu trời',180],['s_hero','Áo Siêu nhân Toán',300],['s_gold','Áo Hoàng kim',400]]},
 {k:'acc',n:'Mũ kính',ic:'capS',it:[['bow','Nơ đỏ',60],['flower','Kẹp hoa',60],['cap','Mũ lưỡi trai',80],['glass','Kính tròn',100],['witch','Mũ phù thuỷ',150],['crown','Vương miện',250]]},
 {k:'frame',n:'Khung',ic:'medG',it:[['wood','Khung Gỗ',60],['silver','Khung Bạc',120],['gold','Khung Vàng',200],['rainbow','Khung Cầu vồng',300]]},
 {k:'dec',n:'Đảo nhà',ic:'palm',it:[['palm','Cây dừa',40],['umb','Ô che nắng',50],['castle','Lâu đài cát',70],['boat','Thuyền buồm',90],['flag','Cờ CLB Jenny',110],['light','Hải đăng',140]]},
 {k:'pet',n:'Thú cưng',ic:'chick',it:[['chick','Gà con',150],['turtle','Rùa biển',250]]},
 {k:'care',n:'Đồ nuôi',ic:'bowlS',it:[]},
 {k:'tk',n:'Vé game',ic:'tkS',it:[]},
];
const TK_PRICE=30,TK_DAY=3,TK_MIN=5;
export const ghSt=st=>{st.shop=st.shop||{own:[],acc:'',frame:'',dec:[]};const s=st.shop;s.bag=s.bag||{};s.gear=s.gear||[];return s};
const ghFind=id=>{for(const c of GH){const x=c.it.find(i=>i[0]===id);if(x)return{c,x}}return null};
/* trang phục mua được tính là "đã có" trong tủ đồ */
{const _o=hooks.cu('ofOwn');hooks.de('ofOwn',function(st){const s=_o.apply(this,arguments);try{(st.shop&&st.shop.own||[]).forEach(k=>{if(OUTFIT[k])s.add(k)})}catch(e){}return s})}
/* Jenny xem trước: áo + mũ/kính + thú cưng + khung */
export function ghJenny(...a){return hooks.goi('ghJenny',this,a)}
hooks.ham('ghJenny',function(H,L){const u=H/19,of=L.of,body=spr(of?ofVariant('jenny',of):'jenny',H);
 const a=L.acc&&GH_ACC[L.acc]?(()=>{const[nm,x,y]=GH_ACC[L.acc],d=pxURI(nm);return`<img class="px ghacc" src="${d.u}" alt="" style="left:${x*u}px;top:${y*u}px;width:${d.w*u}px;height:${d.h*u}px">`})():'';
 const p=L.pet?`<span class="ghpet">${spr(L.pet,Math.round(H*.42))}</span>`:'';
 return`<span class="ghj ${L.frame?'fr-'+L.frame:''}"><span class="ghjb" style="width:${16*u}px;height:${H}px">${body}${a}</span>${p}</span>`});
function ghLook(...a){return hooks.goi('ghLook',this,a)}
hooks.ham('ghLook',function(st){const s=ghSt(st),T=scr.ghTry||{};return{of:'of' in T?T.of:(st.outfit||''),acc:'acc' in T?T.acc:s.acc,pet:T.pet||'',frame:'frame' in T?T.frame:s.frame}});
function ghCard(...a){return hooks.goi('ghCard',this,a)}
hooks.ham('ghCard',function(c,x,st){if((c.k==='pet'||c.k==='care')&&typeof petCard==='function')return petCard(c,x,st);const s=ghSt(st),[id,n,pr]=x,own=s.own.includes(id),T=scr.ghTry||{},use=c.k==='of'?st.outfit===id:c.k==='dec'?s.dec.includes(id):s[c.k]===id,sel=T.id===id;
 const pic=c.k==='of'?spr(ofVariant('jenny',id),54):c.k==='acc'?spr(GH_ACC[id][0],30):c.k==='frame'?`<span class="ghfr fr-${id}">${spr('jenny',38)}</span>`:spr(id,c.k==='pet'?44:46);
 return`<button type="button" class="ghit ${own?'own':''} ${use?'use':''} ${sel?'sel':''}" onclick="ghTry('${c.k}','${id}')" aria-label="${esc(n)}, ${own?'đã có':pr+' xu'}"><span class="ghpic">${pic}</span><b>${esc(n)}</b>${use?'<i class="ghtag on">Đang dùng</i>':own?'<i class="ghtag">Đã có</i>':`<i class="ghpr">${spr('coin',14)} ${pr}</i>`}</button>`});
function ghTry(k,id){const T={k,id};if(k==='of')T.of=id;else if(k==='acc')T.acc=id;else if(k==='pet')T.pet=id;else if(k==='frame')T.frame=id;scr.ghTry=T;try{sfx('tap')}catch(e){}render()}
function ghBuy(){const st=S.st[sid],s=ghSt(st),T=scr.ghTry;if(!T)return;const f=ghFind(T.id);if(!f)return;if(T.k==='pet')return petBuy(T.id);if(T.k==='care')return careBuy(T.id);const pr=f.x[2];
 if(st.coins<pr){toast(`Em cần thêm ${pr-st.coins} xu. Làm bài để kiếm xu nhé!`);return}
 /* P-20: trừ xu qua ví (vi/{tk}); áo váy, mũ kính, khung = tudo; đảo nhà = items */
 if(!xuMua(f.c.k==='dec'?'items':'tudo',T.id)){toast('Chưa mua được. Em thử lại sau nhé!');return}
 s.own.push(T.id);ghUse(1);try{sfx('win')}catch(e){}toast(`Đã mua ${f.x[1]}!`)}
function ghUse(...a){return hooks.goi('ghUse',this,a)}
hooks.ham('ghUse',function(silent){const st=S.st[sid],s=ghSt(st),T=scr.ghTry;if(!T||!s.own.includes(T.id))return;const k=T.k,id=T.id;
 if(k==='of')st.outfit=st.outfit===id?'':id;else if(k==='dec'){s.dec=s.dec.includes(id)?s.dec.filter(x=>x!==id):s.dec.concat(id)}else s[k]=s[k]===id?'':id;
 scr.ghTry=null;save();if(!silent)try{sfx('card')}catch(e){}render()});
function ghIsle(...a){return hooks.goi('ghIsle',this,a)}
hooks.ham('ghIsle',function(st){const s=ghSt(st),T=scr.ghTry,list=s.dec.concat(T&&T.k==='dec'&&!s.dec.includes(T.id)?[T.id]:[]);
 return`<div class="ghisle">${spr('island',120)}${list.map(id=>{const p=GH_SLOT[id]||[50,50];return`<span class="ghdec ${T&&T.id===id&&!s.dec.includes(id)?'try':''}" style="left:${p[0]}%;top:${p[1]}%">${spr(id,id==='boat'?30:36)}</span>`}).join('')}</div>`});
function viewShop(...a){return hooks.goi('viewShop',this,a)}
hooks.ham('viewShop',function(st){const s=ghSt(st),cat=scr.ghCat||'of',C=GH.find(c=>c.k===cat),T=scr.ghTry,f=T&&ghFind(T.id),L=ghLook(st);
 const tabs=GH.map(c=>`<button type="button" class="ghtab ${c.k===cat?'on':''}" onclick="scr.ghCat='${c.k}';scr.ghTry=null;render()" aria-pressed="${c.k===cat}"><span class="ghti">${spr(c.ic,c.k==='of'?22:c.k==='acc'?11:c.k==='tk'?14:20)}</span><span>${c.n}</span></button>`).join('');
 const catB=cat==='care'?careGrid(st):'';
 let act='';if(f&&(T.k==='pet'||T.k==='care')&&typeof petAct==='function')act=petAct(T,f,st);else if(f){const own=s.own.includes(T.id),use=T.k==='of'?st.outfit===T.id:T.k==='dec'?s.dec.includes(T.id):s[T.k]===T.id,pr=f.x[2],short=Math.max(0,pr-st.coins);
  act=own?`<button type="button" class="gobtn ghgo" onclick="ghUse()">${use?'Bỏ ra':'Dùng'} ${esc(f.x[1])}</button>`:short?`<button type="button" class="gobtn ghgo off" onclick="ghBuy()">Cần thêm ${spr('coin',16)} ${short}</button>`:`<button type="button" class="gobtn ghgo" onclick="ghBuy()">Mua ${esc(f.x[1])} · ${spr('coin',16)} ${pr}</button>`}
 const stage=cat==='dec'?ghIsle(st):cat==='care'?careStage(st,T,f):ghJenny(112,L);
 const body=cat==='tk'?`<div class="ghtk">${spr('tkS',44)}<div><b>Vé chơi game tư duy</b><p>Mỗi vé <b>${TK_PRICE} xu</b> = <b>${TK_MIN} phút</b> chơi game tư duy (cờ, xếp hình, mê cung…). Mỗi ngày mua tối đa <b>${TK_DAY} vé</b>.</p><span class="pill">Sắp có — mở khi có game tư duy</span></div></div>`
  :cat==='care'?catB:`<div class="ghgrid">${C.it.map(x=>ghCard(C,x,st)).join('')}</div>`;
 return`<div class="page ghpage"><section class="card ghtop"><div class="ghhead"><h2>${spr('shopI',26)} Cửa hàng Jenny</h2><span class="ghcoin">${spr('coin',20)} <b>${st.coins}</b> xu</span></div>
  <div class="ghstage ${cat==='dec'?'isle':''}">${stage}<div class="ghinfo">${f?`<b>${esc(f.x[1])}</b><small>${T.k==='pet'?petNote(st,T.id):T.k==='care'?esc(careNote(T.id)):s.own.includes(T.id)?'Em đã có món này':'Đang thử — chưa mua'}</small>`:`<b>Chạm món đồ để thử</b><small>Thử miễn phí. Thích thì mua bằng xu.</small>`}${act}</div></div></section>
  <nav class="ghtabs" aria-label="Loại hàng">${tabs}</nav>${body}
  <p class="muted ghnote">${LANG==='en'?'Earn coins: each correct answer +5 · pass a level +10, island boss +30 · fix a mistake +5 · practice page task +5, ★ challenge +15 · games up to +20 each · class boss +20–30 · homework +20. No daily limit.':'Kiếm xu: mỗi câu đúng +5 · qua màn +10, trùm đảo +30 · sửa xong 1 lỗi +5 · Tự luyện mỗi bài +5, ★ +15 · trò chơi tới +20 mỗi lượt · trùm lớp +20–30 · bài về nhà +20. Không giới hạn xu trong ngày.'}</p></div>`});
/* gắn vào trang chính tiểu học: tab 'shop' + nút xu ở thẻ chào */
{const _v=hooks.cu('viewHome1t');hooks.de('viewHome1t',function(){const r=_v.apply(this,arguments);if(scr.tab!=='shop')return r;const st=S.st[sid],i=r.indexOf('<nav class="bnav"');return viewShop(st)+(i>=0?r.slice(i):'')})}
{const _h=hooks.cu('viewHome1');hooks.de('viewHome1',function(){return _h.apply(this,arguments).replace(/<span class="chip">🪙 <b>(\d+)<\/b><\/span>/,`<button type="button" class="chip ghchip" onclick="go({k:'home',tab:'shop'})" aria-label="$1 xu, mở Cửa hàng">🪙 <b>$1</b> <span>Cửa hàng ▸</span></button>`)})}
document.head.insertAdjacentHTML('beforeend',`<style>
.ghchip{cursor:pointer;background:#FFF4D6!important;color:#7A4E00}.ghchip span{font-family:var(--f-display);font-size:16px;margin-left:2px}
.ghtop{padding:12px!important}.ghhead{display:flex;align-items:center;gap:8px}.ghhead h2{display:flex;align-items:center;gap:6px;margin:0;font-size:24px}.ghcoin{margin-left:auto;display:flex;align-items:center;gap:4px;font-family:var(--f-display);font-size:22px;background:#FFF4D6;color:#7A4E00;padding:2px 8px;box-shadow:var(--f2)}
.ghstage{margin-top:10px;display:flex;gap:12px;align-items:flex-end;padding:12px;background:linear-gradient(#BDEBFA 0 62%,#F6D98B 62%);box-shadow:var(--f2);min-height:150px;color:#13263a}
.ghstage.isle{align-items:center;background:linear-gradient(#BDEBFA 0 40%,#12B5E8 40%)}
.ghinfo{display:flex;flex-direction:column;gap:4px;align-self:center;min-width:0}.ghinfo b{font-family:var(--f-display);font-size:22px;line-height:1}.ghinfo small{font-size:13px;color:#3D4A70}
.ghgo{margin-top:6px;font-size:15px!important;padding:8px 10px!important}.ghgo.off{background:#E3E7F0!important;color:#5E6B8C!important}
.ghj{position:relative;display:inline-flex;align-items:flex-end;flex:none;padding:6px}.ghjb{position:relative;display:inline-block}.ghjb>img{display:block}.ghacc{position:absolute;image-rendering:pixelated}.ghpet{margin-left:-6px;margin-bottom:-2px}
.ghj.fr-wood,.ghfr.fr-wood{box-shadow:0 0 0 4px #9A6234,0 0 0 7px #6B3F1D;background:#FFF4D6}.ghj.fr-silver,.ghfr.fr-silver{box-shadow:0 0 0 4px #E3E7F0,0 0 0 7px #9AA4C0;background:#fff}.ghj.fr-gold,.ghfr.fr-gold{box-shadow:0 0 0 4px #FCD655,0 0 0 7px #C97A00;background:#FFF4D6}
.ghj.fr-rainbow,.ghfr.fr-rainbow{box-shadow:0 0 0 3px #F04A1B,0 0 0 6px #FCB40C,0 0 0 9px #2AB563,0 0 0 12px #12B5E8;background:#fff}
.ghfr{display:inline-flex;padding:3px;margin:8px}
.ghtabs{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:14px 0 10px}.ghtab{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;border:0;padding:6px 2px 5px;background:var(--surface,#fff);box-shadow:var(--f2);font-family:var(--f-display);font-size:16px;line-height:1;white-space:nowrap;color:var(--ink);cursor:pointer;min-width:0}.ghti{height:22px;display:grid;place-items:center;flex:none}@media(max-width:360px){.ghtab{font-size:14px}}.ghtab.on{background:#FCB40C;color:#1F2A5A}
.ghgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.ghit{display:flex;flex-direction:column;align-items:center;gap:3px;border:0;padding:8px 4px;background:var(--surface,#fff);box-shadow:var(--f2),0 4px 0 0 #1F2A5A;cursor:pointer;min-width:0}
.ghit .ghpic{height:58px;display:grid;place-items:center}.ghit b{font-family:var(--f-body);font-size:13px;line-height:1.15;text-align:center;font-weight:700}
.ghit.sel{background:var(--sun-soft);box-shadow:0 0 0 3px #FCB40C,0 4px 0 0 #1F2A5A}.ghit:active{transform:translateY(3px);box-shadow:var(--f2)}
.ghpr{font-style:normal;display:flex;align-items:center;gap:3px;font-family:var(--f-display);font-size:18px;color:var(--sun-ink)}
.ghtag{font-style:normal;font-family:var(--f-display);font-size:15px;padding:0 5px;background:#E3F7EA;color:#1E8A4A}.ghtag.on{background:#2AB563;color:#fff}
.ghisle{position:relative;width:180px;height:130px;flex:none;display:grid;place-items:center}.ghisle>img{width:180px!important;height:auto!important}.ghdec{position:absolute;transform:translate(-50%,-50%)}.ghdec.try{animation:bIdle 1s steps(2) infinite;opacity:.85}
.ghtk{display:flex;gap:12px;align-items:flex-start;padding:14px;background:var(--sun-soft);box-shadow:var(--f2)}.ghtk p{margin:4px 0 8px;font-size:14px}
.ghnote{font-size:13px;margin:14px 2px}
</style>`);
/* thanh mua nổi ở đáy màn hình (thầy góp ý 23/10): chọn món nào thì nút Mua/Dùng hiện ngay bên dưới, không phải kéo lên */
{const _v=hooks.cu('viewShop');hooks.de('viewShop',function(st){let r=_v.apply(this,arguments);try{const T=scr.ghTry,f=T&&ghFind(T.id);if(!f)return r;
  const m=r.match(/<div class="ghinfo">[\s\S]*?(<button[^>]*class="gobtn ghgo[^"]*"[\s\S]*?<\/button>)<\/div><\/div><\/section>/);if(!m)return r;
  const note=r.match(/<div class="ghinfo"><b>([\s\S]*?)<\/b><small>([\s\S]*?)<\/small>/);
  const bar=`<div class="ghbar" role="region" aria-label="Mua món đã chọn"><div class="grow"><b>${note?note[1]:''}</b><small>${note?note[2]:''}</small></div>${m[1].replace('gobtn ghgo','gobtn ghgo ghbarbtn')}<button type="button" class="ghbarx" onclick="scr.ghTry=null;render()" aria-label="Bỏ chọn">✕</button></div>`;
  const i=r.lastIndexOf('</div>');return r.slice(0,i)+bar+r.slice(i)}catch(e){return r}})}
document.head.insertAdjacentHTML('beforeend',`<style>
.ghbar{position:fixed;left:max(12px,env(safe-area-inset-left,0px));right:max(12px,env(safe-area-inset-right,0px));bottom:calc(74px + env(safe-area-inset-bottom,0px));z-index:40;max-width:560px;margin:0 auto;display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--sun-soft);color:var(--ink);box-shadow:var(--f2),4px 4px 0 0 var(--pxk,#1F2A5A);animation:ghup .2s steps(3)}
@keyframes ghup{from{transform:translateY(20px);opacity:0}}
.ghbar .grow{min-width:0;display:flex;flex-direction:column;gap:2px}.ghbar b{font-family:var(--f-display);font-size:22px;font-weight:400;line-height:1}.ghbar small{font-size:12px;line-height:1.3;color:var(--muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ghbar .ghbarbtn{margin:0!important;flex:none;width:auto;max-width:48%;font-size:15px!important;padding:9px 10px!important;white-space:normal;line-height:1.1}
.ghbarx{flex:none;border:0;background:none;color:var(--ink);font-size:18px;cursor:pointer;padding:4px}
.ghpage{padding-bottom:96px}
</style>`);
