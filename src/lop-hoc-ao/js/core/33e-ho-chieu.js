/* ===================== HỘ CHIẾU ĐẠI DƯƠNG ===================== */
/* Mỗi lớp một cuốn hộ chiếu. Hạ trùm ở đảo cuối của một chủ đề → đóng dấu vùng biển của chủ đề đó.
   Mỗi vùng biển mới mở một trang phục Jenny (đổi màu áo, giày, nút). Đủ mọi vùng biển trong hộ chiếu → Trang phục Huyền thoại.
   Lưu: st.pass = {'lớp:chủ đề': {bk, d}}, st.outfit = mã trang phục ('' = áo gốc). */
Object.assign(PXS,{
 crownS:["y.y.y.y","yaywyay","yyyyyyy","araryra"],
 ancS:["..k..",".kyk.","..k..","kkkkk","..k..","k.k.k",".kkk."],
});
const OUTFIT={
 trop:{n:'Áo Thủy thủ',m:{g:'b',G:'B',y:'w'}},
 snow:{n:'Áo len Băng',m:{g:'e',G:'E',y:'b',o:'B'}},
 volc:{n:'Áo Lửa',m:{g:'r',G:'R',y:'y',o:'R'}},
 dese:{n:'Áo Sa mạc',m:{g:'t',G:'T',y:'u',o:'n'}},
 cand:{n:'Váy Kẹo ngọt',m:{g:'c',G:'p',y:'w',o:'p'}},
 crys:{n:'Áo Pha lê',m:{g:'p',G:'P',y:'x',o:'P'}},
 jung:{n:'Áo Rừng xanh',m:{g:'G',y:'l',o:'N'}},
 autu:{n:'Áo Lá Thu',m:{g:'o',G:'O',y:'r',o:'N'}},
 nigh:{n:'Áo Đêm sao',m:{g:'P',G:'k',y:'y',o:'k'}},
 suns:{n:'Áo Hoàng hôn',m:{g:'a',G:'O',y:'c',o:'O'}},
 leg:{n:'Trang phục Huyền thoại',m:{g:'y',G:'a',y:'r',o:'a'},acc:'crownS'},
};
const OF_KEYS=['trop','snow','volc','dese','cand','crys','jung','autu','nigh','suns'];
function ofVariant(name,of){const o=OUTFIT[of];if(!o||!PXS[name])return name;const key=`${name}__of_${of}`;if(!PXS[key])PXS[key]=PXS[name].map(r=>r.replace(/./g,ch=>o.m[ch]||ch));return key}
['jenny','jennyBlink','jennyHappy','jennySad','jennyCheer'].forEach(n=>Object.keys(OUTFIT).forEach(o=>ofVariant(n,o)));

/* trang phục đang mặc (chỉ học sinh tiểu học) */
function jOutfit(){try{if(role!=='hs')return null;const st=S.st[sid];if(!st||!st.outfit)return null;return ofOwn(st).has(st.outfit)?st.outfit:null}catch(e){return null}}
/* các vùng biển của một lớp (theo thứ tự chủ đề) */
const passTopics=g=>(PRIM[g]&&PRIM[g].T||[]).map((t,ti)=>({ti,name:t[0],bk:biomeOfTopic(g,ti)}));
const passGradeBiomes=g=>[...new Set(passTopics(g).map(t=>t.bk))];
/* trang phục đã mở: vùng có dấu; Huyền thoại khi đủ mọi vùng của hộ chiếu (tối đa 10) */
function ofOwn(st){const P=st.pass||{},got=new Set(Object.values(P).map(v=>v.bk)),own=new Set(got);
  const g=st.grade<=5?st.grade:1,need=passGradeBiomes(g);if(got.size>=10||(need.length&&need.every(k=>got.has(k))))own.add('leg');return own}
/* đảo trùm của chủ đề: đảo có trùm, nếu không có thì đảo cuối */
function passBossIsl(g,ti){const L=(PRIM[g]&&PRIM[g].isl||[]).filter(x=>x.ti===ti);return L.find(x=>x.boss)||L[L.length-1]}
const passDone=(st,x)=>{const p=st.p1&&st.p1[x.id];return!!(p&&p.m&&p.m[x.nm-1])};
const PASS_SEEN={};
/* đóng dấu mới; lần đầu với mỗi học sinh trong phiên: bù dấu từ tiến độ cũ, không hiện hiệu ứng */
function passSync(){if(role!=='hs')return;const st=S.st[sid];if(!st||st.grade>5)return;const g=st.grade,silent=!PASS_SEEN[sid];PASS_SEEN[sid]=1;
  st.pass=st.pass||{};const before=ofOwn(st),fresh=[];
  passTopics(g).forEach(t=>{const key=`${g}:${t.ti}`;if(st.pass[key])return;const x=passBossIsl(g,t.ti);if(x&&passDone(st,x)){st.pass[key]={bk:t.bk,d:passDate()};fresh.push(t)}});
  if(!fresh.length)return;save();if(silent)return;
  const after=ofOwn(st),newOf=[...after].filter(k=>!before.has(k));setTimeout(()=>passPop(g,fresh[fresh.length-1],newOf),350)}
const passDate=()=>{const d=new Date();return`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`};
/* con dấu */
function stampHTML(bk,ti,d,size='md'){const bm=BIOME[bk]||BIOME.trop;
  return`<span class="pstamp ${size}" style="--sc:${bm.band[2]};--sd:${bm.band[3]}" role="img" aria-label="Dấu ${esc(bm.n)}${d?', ngày '+d:''}"><span class="pst-ic">${bm.ic}</span><b>${esc(bm.n)}</b><small>Chủ đề ${ti+1}${d?' · '+d:''}</small></span>`}
SFX.stamp=()=>{noise(0,.09,.32,300);tone(mHz(40),0,.14,'square',.2,.5);tone(mHz(84),.18,.25,'sine',.14);tone(mHz(91),.3,.4,'sine',.12)};
function passPop(g,t,newOf){document.querySelectorAll('.stamppop').forEach(e=>e.remove());const d=(S.st[sid].pass||{})[`${g}:${t.ti}`]||{};
  const el=document.createElement('div');el.className='stamppop';el.setAttribute('role','status');
  el.innerHTML=`<div class="spbox"><span class="sptitle">🛂 Hộ chiếu đại dương</span>${stampHTML(t.bk,t.ti,d.d,'lg')}${newOf.length?`<span class="spof">${jennyOf(46,newOf[newOf.length-1])}<span>Mở trang phục mới: <b>${esc(OUTFIT[newOf[newOf.length-1]].n)}</b></span></span>`:''}<button type="button" class="btn sm pri" onclick="this.closest('.stamppop').remove();go({k:'home',tab:'album'})">Xem hộ chiếu</button><button type="button" class="btn sm" onclick="this.closest('.stamppop').remove()">Đóng</button></div>`;
  document.body.appendChild(el);pixelize(el);sfx('stamp');try{sayJ(`Em được đóng dấu ${BIOME[t.bk].n} vào hộ chiếu đại dương!`)}catch(e){}
  setTimeout(()=>el.classList.add('on'),20)}
/* Jenny mặc một trang phục bất kì (xem thử) */
function jennyOf(size,of){const s=Math.round(size*.86),o=OUTFIT[of];return`<span class="jav" style="width:${size}px;height:${size}px" aria-hidden="true"><span class="jbody">${spr(of?ofVariant('jenny',of):'jenny',s,'jf')}${o&&o.acc?`<span class="jacc">${spr(o.acc,Math.round(size*.34))}</span>`:''}</span></span>`}
function setOutfit(of){const st=S.st[sid];if(of&&!ofOwn(st).has(of))return;st.outfit=of||'';save();sfx('card');render();toast(of?`Jenny mặc ${OUTFIT[of].n}`:'Jenny mặc áo xanh gốc')}
function viewPass(st){const g=st.grade<=5?st.grade:1,P=st.pass||{},T=passTopics(g),got=T.filter(t=>P[`${g}:${t.ti}`]).length,own=ofOwn(st),cur=st.outfit&&own.has(st.outfit)?st.outfit:'';
  const need=passGradeBiomes(g),keys=OF_KEYS.filter(k=>need.includes(k)||own.has(k)).concat('leg');
  const slots=T.map(t=>{const v=P[`${g}:${t.ti}`];return`<div class="pslot ${v?'own':''}" title="Chủ đề ${t.ti+1}: ${esc(t.name)}">${v?stampHTML(v.bk,t.ti,v.d):`<span class="pempty"><b>${t.ti+1}</b><small>${BIOME[t.bk]?esc(BIOME[t.bk].n):''}</small></span>`}</div>`}).join('');
  const ofs=[['', 'Áo xanh gốc',true]].concat(keys.map(k=>[k,OUTFIT[k].n,own.has(k)])).map(([k,n,ok])=>`<button type="button" class="ofbtn ${ok?'':'off'} ${k===cur?'on':''}" ${ok?`onclick="setOutfit('${k}')"`:`onclick="toast('${k==='leg'?'Đủ dấu mọi vùng biển trong hộ chiếu để mở':`Hạ trùm ở ${esc((BIOME[k]||{}).n||'')} để mở`}')"`} aria-pressed="${k===cur}">${ok?jennyOf(44,k):`<span class="oflock">${spr('lock',22)}</span>`}<b>${esc(n)}</b>${k===cur?'<i>Đang mặc</i>':''}</button>`).join('');
  return`<section class="card passcard" style="--oc:${OCEAN[g][1]}"><div class="secthead"><h2>🛂 Hộ chiếu đại dương</h2><span class="grow"></span><span class="pill ${got===T.length?'ok':'acc'}">${got}/${T.length} dấu</span></div>
   <p class="muted" style="margin:4px 0 10px">${esc(OCEAN[g][0])} · Lớp ${g}. Hạ trùm ở đảo cuối mỗi chủ đề để được đóng dấu vùng biển đó. Mỗi vùng biển mới mở một trang phục cho Jenny.</p>
   <div class="pbook">${slots}</div>
   <h3 class="ofh">Tủ đồ của Jenny</h3><div class="ofgrid">${ofs}</div></section>`}
/* Sưu tập: hộ chiếu ở trên, thẻ sinh vật ở dưới */
{const _va=viewAlbum;viewAlbum=function(st){const a=_va(st);return a.replace('<div class="grid">',`<div class="grid">${viewPass(st)}`)}}
/* sau mỗi lần vẽ màn hình: kiểm tra dấu mới */
{const _r=render;render=function(){const a=_r.apply(this,arguments);try{passSync()}catch(e){}return a}}
