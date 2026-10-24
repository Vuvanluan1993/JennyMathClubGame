/* 58 — Nhân vật Nam (thầy yêu cầu 24/10/2026)
   - Học sinh chọn "Bạn nữ" (Jenny) hoặc "Bạn nam" (tóc ngắn, không búi, không nơ) — hỏi 1 lần khi vào lần đầu, đổi được ở Tủ đồ.
   - Giữ phong cách pixel cũ (16 ô ngang). Bạn nam dùng chung thân, biểu cảm, áo, mũ kính với Jenny (chỉ khác tóc).
   - Cửa hàng thêm đồ cho bạn nam; đồ riêng của bạn nữ/bạn nam chỉ hiện với bạn đó (đồ đã mua vẫn giữ). */
const BOY_HAIR=["......kk.k......","....kkkkkkkk....","..kkkkkkkkkkkk..",".kkkkkkkkkkkkkk.",".kkkkkkkkkkkkkk."];
['jenny','jennyBlink','jennyHappy','jennySad','jennyCheer'].forEach(n=>{if(PXS[n])PXS[n.replace(/^jenny/,'boy')]=PXS[n].map((r,i)=>i<5?BOY_HAIR[i]:r)});
const avBoy=()=>{try{return role==='hs'&&S.st[sid]&&S.st[sid].gender==='nam'}catch(e){return false}};
function boyName(n){const m=/^jenny(Blink|Happy|Sad|Cheer)?(?:__of_(\w+))?$/.exec(n);if(!m)return n;const b='boy'+(m[1]||'');if(!PXS[b])return n;return m[2]?ofVariant(b,m[2]):b}
{const _s=spr;spr=function(n,...a){if(typeof n==='string'&&n.startsWith('jenny')&&avBoy())n=boyName(n);return _s.call(this,n,...a)}}
/* ---- đồ mới ---- */
Object.assign(PXS,{
 btieS:["RR..RR","RRrrRR","RR..RR"],
 hbandS:["rrrrrrrrrrrrrr..","RRRRRRRRRRRRRRrr","..............r."],
 shadesS:["kkkkk..kkkkk","kwkkkkkkkwkk",".kkk....kkk."],
 phoneS:["....kkkkkkkk....","..kk........kk..",".k............k.",".k............k.","k..............k","bb............bb","bB............Bb","bb............bb"],
 helmetS:["....bbbbbb....","..bbbbbbbbbb..",".bbwwbbbbwwbb.",".bbbbbbbbbbbb.","BBBBBBBBBBBBBB"]});
Object.assign(GH_ACC,{btie:['btieS',5,11],hband:['hbandS',1,4],shades:['shadesS',2,6],phone:['phoneS',0,0],helmet:['helmetS',1,-2]});
Object.assign(ACC_SLOT,{btie:'neck',hband:'head',shades:'face',phone:'ear',helmet:'head'});
ACC_ORD.push('ear','neck');Object.assign(ACC_SN,{neck:()=>arcT('Cổ','Neck'),ear:()=>arcT('Tai','Ears')});
Object.assign(OUTFIT,{s_ball:{n:'Áo cầu thủ',m:{g:'r',G:'R',y:'w',o:'w'}},s_ninja:{n:'Áo Ninja',m:{g:'B',G:'k',y:'r',o:'k'}},s_astro:{n:'Áo phi hành gia',m:{g:'e',G:'E',y:'r',o:'B'}}});
['jenny','jennyBlink','jennyHappy','jennySad','jennyCheer','boy','boyBlink','boyHappy','boySad','boyCheer'].forEach(n=>['s_ball','s_ninja','s_astro'].forEach(o=>ofVariant(n,o)));
{const of=GH.find(c=>c.k==='of'),ac=GH.find(c=>c.k==='acc');
 of.it.push(['s_ball','Áo cầu thủ',150],['s_ninja','Áo Ninja',200],['s_astro','Áo phi hành gia',250]);
 ac.it.push(['btie','Nơ cổ',60],['hband','Băng đô ninja',80],['shades','Kính râm',100],['phone','Tai nghe',150],['helmet','Mũ bảo hiểm',180]);}
const GH_GEN={s_peach:'nu',bow:'nu',flower:'nu',s_ball:'nam',s_ninja:'nam',btie:'nam',hband:'nam'};
const genOf=st=>st&&st.gender==='nam'?'nam':'nu';
/* Cửa hàng: ẩn đồ riêng của bạn kia (trừ đồ đã có) */
{const _v=viewShop;viewShop=function(st){const s=ghSt(st),g=genOf(st),sv=[];GH.forEach(c=>{if(c.k==='of'||c.k==='acc'){sv.push([c,c.it]);c.it=c.it.filter(x=>!GH_GEN[x[0]]||GH_GEN[x[0]]===g||s.own.includes(x[0]))}});try{return _v.apply(this,arguments)}finally{sv.forEach(([c,it])=>c.it=it)}}}
/* ---- chọn nhân vật ---- */
function setGender(g){const st=S.st[sid];if(!st)return;st.gender=g==='nam'?'nam':'nu';save();const o=document.getElementById('genov');if(o)o.remove();try{sfx('card')}catch(e){}render()}
function genPick(cls){const st=S.st[sid],cur=st&&st.gender;const b=(g,sp,t)=>`<button type="button" class="genb ${cur===g?'on':''}" onclick="setGender('${g}')" aria-pressed="${cur===g}"><span class="genpic">${spr(sp,72)}</span><b>${t}</b></button>`;
 return`<div class="genrow ${cls||''}">${b('nu','jenny__raw',arcT('Bạn nữ','Girl'))}${b('nam','boy',arcT('Bạn nam','Boy'))}</div>`}
PXS.jenny__raw=PXS.jenny;
function genAsk(){if(document.getElementById('genov'))return;const el=document.createElement('div');el.className='gdov';el.id='genov';
 el.innerHTML=`<div class="gdbox genbox"><div class="gdhd"><b>${arcT('Chọn nhân vật của em','Choose your character')}</b></div><p class="genq">${arcT('Em là bạn nữ hay bạn nam? Em có thể đổi lại trong Tủ đồ.','Are you a girl or a boy? You can change it later in the Wardrobe.')}</p>${genPick()}</div>`;document.body.appendChild(el)}
{const _r=render;render=function(){const v=_r.apply(this,arguments);try{if(role==='hs'&&scr.k==='home'){const st=S.st[sid];if(st&&st.grade<=5&&!st.gender)genAsk()}}catch(e){}return v}}
/* Tủ đồ: hàng chọn nhân vật + đổi tên "Tủ đồ của em" */
{const _t=viewTudo;viewTudo=function(st){let r=_t.apply(this,arguments);try{
 r=r.replace(arcT('Tủ đồ của Jenny','Jenny’s wardrobe'),arcT('Tủ đồ của em','My wardrobe'));
 if(!scr.tdCat)r=r.replace(/(<section class="card tdbody">)/,`$1<h3 class="ghgh" style="margin-top:0">${arcT('Nhân vật','Character')}</h3>${genPick('gensm')}`)}catch(e){}return r}}
Object.assign(I18N,{'Áo cầu thủ':'Football shirt','Áo Ninja':'Ninja suit','Áo phi hành gia':'Astronaut suit','Nơ cổ':'Bow tie','Băng đô ninja':'Ninja headband','Kính râm':'Sunglasses','Tai nghe':'Headphones','Mũ bảo hiểm':'Helmet','Bạn nữ':'Girl','Bạn nam':'Boy'});
document.head.insertAdjacentHTML('beforeend',`<style>
.genrow{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0 4px}
.genb{display:flex;flex-direction:column;align-items:center;gap:6px;border:0;padding:12px 6px;background:var(--surface,#fff);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A);cursor:pointer}
.genb.on{background:var(--sun-soft);box-shadow:0 0 0 3px #FCB40C,0 4px 0 0 var(--pxk,#1F2A5A)}.genb:active{transform:translateY(3px)}
.genb b{font-family:var(--f-display);font-size:22px;font-weight:400;line-height:1}.genpic{height:76px;display:grid;place-items:center}
.gensm .genpic{height:56px}.gensm .genpic img{height:52px!important;width:auto!important}.gensm .genb{flex-direction:row;justify-content:center;padding:8px}
.ghpic img,.tdpic img,.tdcic img{max-width:80px!important;height:auto!important}.tdaccs img{max-width:28px!important;height:auto!important}.tdsub h2 img{max-width:44px!important;height:auto!important}
.genbox .genq{margin:6px 0 0;color:#1F2A5A}
</style>`);
