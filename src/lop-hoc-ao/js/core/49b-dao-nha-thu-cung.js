/* 49b — Đảo nhà của em + Nuôi thú cưng (thầy chốt 20/10)
   - Vào đảo: chạm ảnh Jenny ở thẻ chào (trang chính). Không có nút riêng.
   - Nuôi 1 loài mỗi lần, tối đa 2 con. Thời gian tính theo ngày thật (cả cuối tuần).
   - Chỉ số 0–100: No, Vui, Sạch, Sức khoẻ. Đói/bẩn lâu → sức khoẻ giảm → ốm (cần Thuốc).
   - Bỏ bê: đói rỗng bụng hoặc ốm nặng liên tục 3 ngày → thú cưng BỎ ĐI (có thư tạm biệt).
   - Vòng đời ≈ 6 tuần: Bé (0–7 ngày) → Lớn dần (7–21) → Trưởng thành (21–35) → Già (35+), mất khi hết tuổi (42–45 ngày).
   - Thú mất hoặc bỏ đi → chờ 3 ngày mới mua thú mới. Có Sổ kỷ niệm.
   - 2 con cùng loài trưởng thành, no + vui, có Ổ rơm → có thể đẻ trứng. Trứng phải đặt vào Máy ấp (không thì hỏng sau 2 ngày);
     ấp 3 ngày thì nở nếu đảo còn chỗ. Trứng có thể bán.
   - Đồ dùng hỏng dần (đồ mặc, ổ, máy ấp, máng ăn theo ngày; đồ chơi theo lần chơi). Bán thanh lý = 50% giá × độ mới.
   - Học cũng giúp thú: mỗi lần qua màn, thú cưng vui thêm.
   Lưu: st.pets={list:[…],eggs:[…],wait,mem:[…],ev:[…],layT}, st.shop.bag={mã:số}, st.shop.gear=[{u,id,dur}] */
Object.assign(PXS,{
 bowlS:["..tTtT..",".kkkkkk.","kbbbbbbk",".kbbbbk.","..kkkk.."],
 seedS:["..kk..",".ktTk.","ktTtTk","kTtTtk","ktTtTk",".kkkk."],
 medS:["..kk..","..EE..",".kkkk.","kwrrwk","kwrwwk","krrrrk","kwwwwk",".kkkk."],
 soapS:["..w.w..",".kkkkk.","kbbbbbk","kbwbbbk","kbbbbbk",".kkkkk."],
 teddyS:["kk...kk","knnnnnk",".nknkn.",".nnNnn.","nnnnnnn",".nnnnn.",".n...n."],
 nestS:["............","..n.N..n.N..",".NnNnNnNnNn.","nNnNnNnNnNnN",".NNNNNNNNNN."],
 incS:[".kkkkkkkk.","kxxxxxxxxk","kxxwwxxxxk","kxxxxxxxxk","kkkkkkkkkk","krrkaakrrk","kkkkkkkkkk"],
 feederS:["..kkkk..","..kTTk..","..kTTk..",".kkkkkk.","kbbbbbbk",".kkkkkk."],
 neckS:["r...r","rrRrr","r...r"],
 beanieS:["...rr...",".rrrrrr.","rrrrrrrr","wwwwwwww"],
 scarfS:["bbbbbbbb","bwbwbwbb","....bb..","....bw.."],
 letterS:["kkkkkkkkkk","kwwwwwwwwk","kkwwwwwwkk","kwkwwwwkwk","kwwkkkkwwk","kkkkkkkkkk"],
 cakeS:["..r...","..k...",".tttt.","cwcwcw","tttttt","TTTTTT"],
 fishDS:["...kk...","kk.kTk..","kTkTTTkk","kTTTTkTk","kTkTTTkk","kk.kTk..","...kk..."],
 heartS:[".rr.rr.","rrrrrrr","rrrrrrr",".rrrrr.","..rrr..","...r..."],
 bubS:[".bb.","b..b","b..b",".bb."],
 zzS:["kkk","..k",".k.","kkk"],
 eggCS:["..kk..",".kttk.","kttttk","ktwttk","kttTtk","kTtttk",".kkkk."],
});
/* loài thú (bắt đầu 2 loài): [tên, giá, tuổi thọ ít nhất, nhiều nhất (ngày), mô tả] */
const PET_SP={chick:['Gà con',150,40,50,'Nhanh lớn, ăn nhiều, hay đẻ trứng. Hợp với bạn mới nuôi lần đầu.'],turtle:['Rùa biển',250,100,200,'Lớn chậm nhưng sống rất lâu. Ăn ít hơn, cần tắm sạch thường xuyên.']};
/* đồ nuôi: [mã, tên, giá, loại, hiệu quả, hình, số lượng mỗi lần mua] */
const CARE=[
 ['seed','Hạt dinh dưỡng',5,'food',{no:30},'seedS',1],['fishD','Cá khô',8,'food',{no:45,vui:5},'fishDS',1],['cake','Bánh thưởng',12,'food',{no:20,vui:20},'cakeS',1],
 ['med','Thuốc',40,'med',{hp:60},'medS',1],['soap','Xà phòng (5 lần)',15,'soap',{sach:60},'soapS',5],
 ['ball','Bóng',30,'toy',{vui:25},'ball',0],['teddy','Gấu bông',45,'toy',{vui:35},'teddyS',0],
 ['neck','Nơ cổ',40,'wear',{},'neckS',0],['beanie','Mũ len',60,'wear',{},'beanieS',0],['scarf','Khăn quàng',50,'wear',{},'scarfS',0],
 ['nest','Ổ rơm',80,'home',{},'nestS',0],['feeder','Máng ăn tự động',150,'home',{},'feederS',0],['inc','Máy ấp trứng',200,'home',{},'incS',0]];
const CARE_GRP=[['food','Thức ăn'],['med','Thuốc & tắm'],['toy','Đồ chơi'],['wear','Đồ mặc'],['home','Nhà & máy']];
const CARE_NOTE={seed:'Ăn no +30',fishD:'Ăn no +45, vui +5',cake:'No +20, vui +20',med:'Chữa ốm, sức khoẻ +60',soap:'Mỗi lần tắm: sạch +60',ball:'Chơi: vui +25 (mòn dần)',teddy:'Chơi: vui +35 (mòn dần)',
 neck:'Cho thú mặc. Mặc lâu sẽ cũ',beanie:'Cho thú mặc. Mặc lâu sẽ cũ',scarf:'Cho thú mặc. Mặc lâu sẽ cũ',nest:'Cần có để thú đẻ trứng',feeder:'Tự cho ăn từ túi khi em vắng nhà',inc:'Ấp trứng 3 ngày cho nở'};
const careOf=id=>CARE.find(c=>c[0]===id);
{const C=GH.find(c=>c.k==='care');if(C)C.it=CARE.map(c=>[c[0],c[1],c[2]])}
const P_H=36e5,P_D=864e5,P_LIFE=42,P_WAIT=3,P_LEAVE=72;
const pNow=()=>Date.now()+(window.PET_SHIFT||0);
const PET_NAMES=['Bông','Mít','Na','Kẹo','Bơ','Su','Tí','Gạo','Bin','Mochi','Đậu','Cốm'];
function petsOf(st){st.pets=st.pets||{list:[],eggs:[],wait:0,mem:[],ev:[],layT:0};const P=st.pets;P.list=P.list||[];P.eggs=P.eggs||[];P.mem=P.mem||[];P.ev=P.ev||[];return P}
const pAge=p=>(pNow()-p.born)/P_D;
function pStage(p){const f=pAge(p)/p.life;return f<.15?0:f<.5?1:f<.85?2:3}
const P_STN=['Bé','Lớn dần','Trưởng thành','Già'],P_SC=[.6,.8,1,1];
const clamp=v=>Math.max(0,Math.min(100,v));
const gearHas=(st,id)=>ghSt(st).gear.some(g=>g.id===id&&g.dur>0);
const pUid=()=>Math.random().toString(36).slice(2,9);
function pEv(P,msg,kind){P.ev.push({t:pNow(),msg,kind:kind||'info'});if(P.ev.length>12)P.ev=P.ev.slice(-12)}
/* mô phỏng theo từng giờ kể từ lần xem trước */
function petSim(st){const P=petsOf(st),s=ghSt(st),now=pNow();
 /* đồ dùng cũ dần theo ngày */
 const gT=P.gT||now,gd=(now-gT)/P_D;if(gd>0){s.gear.forEach(g=>{const c=careOf(g.id);if(!c)return;const worn=P.list.some(p=>p.wear===g.u);const r=c[3]==='wear'?(worn?3:.5):c[3]==='home'?1.5:.5;g.dur=Math.max(0,g.dur-r*gd)})}P.gT=now;
 for(const p of P.list.slice()){let t=p.last||now;let steps=Math.floor((now-t)/P_H);if(steps>24*30)steps=24*30;
  for(let i=0;i<steps;i++){t+=P_H;
   if(p.no<40&&gearHas(st,'feeder')){const f=['seed','fishD','cake'].find(k=>(s.bag[k]||0)>0);if(f){s.bag[f]--;const e=careOf(f)[4];p.no=clamp(p.no+(e.no||0));p.vui=clamp(p.vui+(e.vui||0));p.fed++}}
   p.no=clamp(p.no-2.8);p.vui=clamp(p.vui-(p.sick?2:1.2));p.sach=clamp(p.sach-1.4);
   if(p.no<20||p.sach<15)p.hp=clamp(p.hp-2);else if(!p.sick)p.hp=clamp(p.hp+1);
   if(p.sick)p.hp=clamp(p.hp-.5);if(p.hp<35&&!p.sick){p.sick=true;pEv(P,`${p.name} bị ốm rồi! Em mua Thuốc cho bạn ấy nhé.`,'warn')}
   if(p.no<=0||(p.sick&&p.hp<15))p.ng++;else p.ng=Math.max(0,p.ng-2);
   if(p.ng>=P_LEAVE)break;
   if((t-p.born)/P_D>=p.life)break}
  p.last=steps?p.last+steps*P_H:(p.last||now);
  if(p.ng>=P_LEAVE)petGone(st,p,'left');else if(pAge(p)>=p.life)petGone(st,p,'old')}
 /* đẻ trứng: mỗi ngày kiểm tra một lần */
 if(!P.layT)P.layT=now;while(now-P.layT>=P_D){P.layT+=P_D;const L=P.list;
  if(L.length===2&&L[0].sp===L[1].sp&&L.every(p=>pStage(p)===2&&p.no>30&&p.vui>40&&!p.sick)&&gearHas(st,'nest')&&P.eggs.length<2&&Math.random()<.6){P.eggs.push({u:pUid(),sp:L[0].sp,laid:P.layT,inc:0});pEv(P,`Có trứng mới trong Ổ rơm! Đặt vào Máy ấp để trứng nở nhé.`,'good')}}
 /* trứng: không ấp thì hỏng sau 2 ngày; ấp đủ 3 ngày thì nở khi đảo còn chỗ */
 P.eggs=P.eggs.filter(e=>{if(!e.inc){if(now-e.laid>2*P_D){pEv(P,'Một quả trứng bị hỏng vì không được ấp.','warn');return false}return true}
  if(!gearHas(st,'inc')){e.inc=0;e.laid=now;return true}
  if(now-e.inc>=3*P_D&&P.list.length<2){const b=petNew(e.sp,now);b.name='';P.list.push(b);pEv(P,`Trứng đã nở! Một bạn ${PET_SP[e.sp][0]} bé xíu ra đời. Em đặt tên cho bạn ấy nhé.`,'good');return false}return true})}
function petNew(sp,t){return{u:pUid(),sp,name:PET_NAMES[Math.floor(Math.random()*PET_NAMES.length)],born:t,last:t,life:(PET_SP[sp]?PET_SP[sp][2]+Math.floor(Math.random()*(PET_SP[sp][3]-PET_SP[sp][2]+1)):P_LIFE),no:80,vui:80,sach:90,hp:100,sick:false,ng:0,wear:'',fed:0,pats:0,plays:0,patT:0}}
function petGone(st,p,how){const P=petsOf(st);P.list=P.list.filter(x=>x!==p);P.mem.unshift({sp:p.sp,name:p.name||PET_SP[p.sp][0],born:p.born,end:pNow(),how,days:Math.max(1,Math.round(pAge(p))),fed:p.fed,pats:p.pats,plays:p.plays});P.wait=pNow()+P_WAIT*P_D;
 if(p.wear){/* đồ đang mặc trả về túi */}
 P.bye={...P.mem[0]}}
/* ===== mua ở gian hàng ===== */
function petBlock(st,sp){const P=petsOf(st);if(P.wait>pNow()){const d=Math.ceil((P.wait-pNow())/P_D);return`Còn ${d} ngày nữa em mới nuôi bạn mới được.`}
 if(P.list.length>=2)return'Đảo nhà đã đủ 2 bạn rồi.';if(P.list.length&&P.list[0].sp!==sp)return`Em đang nuôi ${PET_SP[P.list[0].sp][0]}. Mỗi lần chỉ nuôi 1 loài.`;return''}
function petNote(st,sp){const d=PET_SP[sp];return petBlock(st,sp)||`Sống khoảng ${d[2]}–${d[3]} ngày. ${d[4]}${petsOf(st).list.length?' Nuôi thêm 1 bạn cùng loài: có thể có trứng!':''}`}
function petCard(c,x,st){const[id,n,pr]=x,T=scr.ghTry||{},sel=T.id===id,s=ghSt(st),P=petsOf(st);
 if(c.k==='pet'){const have=P.list.filter(p=>p.sp===id).length,bl=petBlock(st,id);return`<button type="button" class="ghit ${sel?'sel':''} ${bl&&!have?'dim':''}" onclick="ghTry('pet','${id}')" aria-label="${esc(n)}, ${pr} xu"><span class="ghpic">${spr(id,44)}</span><b>${esc(n)}</b>${have?`<i class="ghtag on">Đang nuôi ${have}</i>`:`<i class="ghpr">${spr('coin',14)} ${pr}</i>`}<small class="ghlife">${PET_SP[id][2]}–${PET_SP[id][3]} ngày</small></button>`}
 const cc=careOf(id),q=cc[6]?(s.bag[id]||0):s.gear.filter(g=>g.id===id).length;
 return`<button type="button" class="ghit ${sel?'sel':''}" onclick="ghTry('care','${id}')" aria-label="${esc(n)}, ${pr} xu"><span class="ghpic">${spr(cc[5],cc[3]==='food'||cc[3]==='med'||cc[3]==='soap'?30:cc[3]==='wear'?20:34)}</span><b>${esc(n)}</b><i class="ghpr">${spr('coin',14)} ${pr}</i>${q?`<i class="ghq">có ${q}</i>`:''}</button>`}
function careGrid(st){return CARE_GRP.map(([g,n])=>`<h3 class="ghgh">${n}</h3><div class="ghgrid">${CARE.filter(c=>c[3]===g).map(c=>petCard({k:'care'},[c[0],c[1],c[2]],st)).join('')}</div>`).join('')}
const careNote=id=>CARE_NOTE[id]||'';
function careStage(st,T,f){const P=petsOf(st),p=P.list[0];return`<span class="ghcare">${p?petSpr(p,70):spr('bowlS',40)}${f?`<span class="ghcarei">${spr(careOf(T.id)[5],34)}</span>`:''}</span>`}
function petAct(T,f,st){const pr=f.x[2],short=Math.max(0,pr-st.coins);
 if(T.k==='pet'){const bl=petBlock(st,T.id);if(bl)return`<button type="button" class="gobtn ghgo off" onclick="toast(this.dataset.m)" data-m="${esc(bl)}">Chưa mua được</button>`}
 return short?`<button type="button" class="gobtn ghgo off" onclick="ghBuy()">Cần thêm ${spr('coin',16)} ${short}</button>`:`<button type="button" class="gobtn ghgo" onclick="ghBuy()">Mua ${esc(f.x[1])} · ${spr('coin',16)} ${pr}</button>`}
function petBuy(sp){const st=S.st[sid],P=petsOf(st),pr=PET_SP[sp][1],bl=petBlock(st,sp);if(bl){toast(bl);return}if(st.coins<pr){toast(`Em cần thêm ${pr-st.coins} xu nhé!`);return}
 st.coins-=pr;petSim(st);const p=petNew(sp,pNow());p.name='';P.list.push(p);save();try{sfx('win')}catch(e){}scr.ghTry=null;go({k:'home',tab:'isle',name:p.u})}
function careBuy(id){const st=S.st[sid],s=ghSt(st),c=careOf(id);if(st.coins<c[2]){toast(`Em cần thêm ${c[2]-st.coins} xu nhé!`);return}st.coins-=c[2];
 if(c[6])s.bag[id]=(s.bag[id]||0)+c[6];else s.gear.push({u:pUid(),id,dur:100,t:pNow()});save();try{sfx('coin')}catch(e){try{sfx('win')}catch(e){}}toast(`Đã mua ${c[1]}! Xem ở Túi đồ trên Đảo nhà.`);render()}
/* ===== hình thú cưng ===== */
const P_WEAR={neck:['neckS',.35,.5,.3],beanie:['beanieS',.28,-.12,.44],scarf:['scarfS',.25,.52,.5]};
function petSpr(p,H,cls){const st=S.st[sid],sc=P_SC[pStage(p)],h=Math.round(H*sc),d=pxURI(p.sp),w=Math.round(h*d.w/d.h);let wear='';
 const g=p.wear&&ghSt(st).gear.find(x=>x.u===p.wear);if(g&&P_WEAR[g.id]){const[nm,x,y,ww]=P_WEAR[g.id],dd=pxURI(nm),W=w*ww;wear=`<img class="px pwear" src="${dd.u}" alt="" style="left:${x*w}px;top:${y*h}px;width:${W}px;height:${W*dd.h/dd.w}px">`}
 return`<span class="pspr st${pStage(p)} ${p.sick?'sick':''} ${cls||''}" style="width:${w}px;height:${h}px">${spr(p.sp,h)}${wear}</span>`}
/* ===== Đảo nhà ===== */
const P_POS=[[52,60],[72,64]];
function petMood(p){if(p.sick)return['Mình mệt quá… mình cần thuốc.','sick'];if(p.no<25)return['Mình đói bụng lắm!','hungry'];if(p.sach<25)return['Mình bẩn quá, tắm cho mình nhé!','dirty'];if(p.vui<30)return['Chơi với mình đi!','sad'];if(pStage(p)===3)return['Mình già rồi, ở bên mình nhé.','old'];return['Mình vui lắm!','ok']}
function pBar(n,v,c){return`<div class="pbar"><span>${n}</span><i><b style="width:${Math.round(v)}%;background:${v<25?'#F04A1B':c}"></b></i></div>`}
function viewIsle(st){petSim(st);const P=petsOf(st),s=ghSt(st),now=pNow();
 const dec=s.dec.map(id=>{const p=GH_SLOT[id]||[50,50];return`<span class="idec" style="left:${p[0]}%;top:${p[1]*.9}%">${spr(id,id==='boat'?34:42)}</span>`}).join('');
 const home=['nest','feeder','inc'].filter(id=>gearHas(st,id)).map((id,i)=>`<span class="ihome h${i}">${spr(careOf(id)[5],id==='inc'?30:26)}${id==='inc'?P.eggs.filter(e=>e.inc).map(()=>`<i class="iegg">${spr('eggCS',14)}</i>`).join(''):''}${id==='nest'?P.eggs.filter(e=>!e.inc).map(()=>`<i class="iegg">${spr('eggCS',14)}</i>`).join(''):''}</span>`).join('');
 const pets=P.list.map((p,i)=>{const[x,y]=P_POS[i];return`<button type="button" class="ipet" style="left:${x}%;top:${y}%" onclick="petPat(${i})" aria-label="Cưng nựng ${esc(p.name||'thú cưng')}">${petSpr(p,58)}${p.sick?`<i class="ifx">${spr('fxSweat',14)}</i>`:p.no<25?`<i class="ifx">${spr('bowlS',14)}</i>`:''}</button>`}).join('');
 const scene=`<div class="iscene" id="iscene"><div class="isky"></div>${spr('island',230,'iisl')}${dec}${home}<span class="ijen">${jenny(54)}</span>${pets}</div>`;
 const ev=P.ev.filter(e=>!e.seen).map(e=>{e.seen=1;return`<div class="iev ${e.kind}">${esc(e.msg)}</div>`}).join('');
 const bye=P.bye?petByeHTML(P.bye):'';
 const cards=P.list.map((p,i)=>{const[m,mk]=petMood(p),a=Math.floor(pAge(p));
  return`<section class="card pcard ${mk}"><div class="pchd">${petSpr(p,48)}<div class="grow"><h3>${p.name?esc(p.name):'<i>Chưa đặt tên</i>'} <small>${PET_SP[p.sp][0]} · ${P_STN[pStage(p)]}</small></h3><div class="muted">Ngày thứ ${a+1}/~${p.life} · đã cho ăn ${p.fed} lần · cưng nựng ${p.pats} lần</div></div><button type="button" class="btn sm ghost" onclick="petName(${i})">${p.name?'Đổi tên':'Đặt tên'}</button></div>
   <div class="psay">${spr('jenny',22)}<span>${esc(p.name||'Bạn ấy')}: “${esc(m)}”</span></div>
   ${pBar('No',p.no,'#FCB40C')}${pBar('Vui',p.vui,'#F26249')}${pBar('Sạch',p.sach,'#12B5E8')}${pBar('Sức khoẻ',p.hp,'#2AB563')}
   ${p.ng>24?`<div class="iev warn">${esc(p.name||'Bạn ấy')} bị bỏ đói đã ${Math.floor(p.ng/24)} ngày. Quá 3 ngày bạn ấy sẽ bỏ đi!</div>`:''}
   <div class="pact"><button type="button" class="pbtn" onclick="petPick(${i},'food')">${spr('bowlS',18)}Cho ăn</button><button type="button" class="pbtn" onclick="petPick(${i},'soap')">${spr('soapS',18)}Tắm</button><button type="button" class="pbtn" onclick="petPick(${i},'toy')">${spr('ball',18)}Chơi</button><button type="button" class="pbtn ${p.sick?'hot':''}" onclick="petPick(${i},'med')">${spr('medS',18)}Chữa</button><button type="button" class="pbtn" onclick="petPick(${i},'wear')">${spr('beanieS',12)}Mặc đồ</button><button type="button" class="pbtn" onclick="petPat(${i})">${spr('heartS',16)}Cưng nựng</button></div>
   ${scr.pk&&scr.pk.i===i?petPicker(st,p,i,scr.pk.g):''}</section>`}).join('');
 const none=!P.list.length?`<section class="card pcard"><div class="pchd">${spr('eggCS',40)}<div class="grow"><h3>Em chưa có thú cưng</h3><div class="muted">${P.wait>now?`Còn ${Math.ceil((P.wait-now)/P_D)} ngày nữa em mới nuôi bạn mới được.`:'Mua một bạn ở Gian hàng. Mỗi lần nuôi 1 loài, tối đa 2 bạn.'}</div></div></div>${P.wait>now?'':`<button type="button" class="gobtn" onclick="scr.ghCat='pet';go({k:'home',tab:'shop'})">Chọn thú cưng ▶</button>`}</section>`:'';
 const eggs=P.eggs.length?`<section class="card pcard"><h3 class="ghgh">Trứng (${P.eggs.length})</h3>${P.eggs.map(e=>`<div class="egrow">${spr('eggCS',26)}<span class="grow">${PET_SP[e.sp][0]} · ${e.inc?`đang ấp, còn ${Math.max(0,Math.ceil((3*P_D-(now-e.inc))/P_D))} ngày${P.list.length>=2?' (nở khi đảo còn chỗ)':''}`:`chưa ấp — hỏng sau ${Math.max(0,Math.ceil((2*P_D-(now-e.laid))/P_D))} ngày`}</span>${!e.inc?`<button type="button" class="btn sm" onclick="eggInc('${e.u}')">Đặt vào máy ấp</button>`:''}<button type="button" class="btn sm ghost" onclick="eggSell('${e.u}')">Bán ${Math.round(PET_SP[e.sp][1]*.4)} xu</button></div>`).join('')}</section>`:'';
 const bag=bagHTML(st);
 const mem=P.mem.length?`<section class="card pcard"><h3 class="ghgh">Sổ kỷ niệm</h3>${P.mem.map(m=>`<div class="memrow">${spr(m.sp,30)}<div class="grow"><b>${esc(m.name)}</b> · ${PET_SP[m.sp][0]}<div class="muted">${m.how==='old'?`Sống ${m.days} ngày, ra đi khi về già.`:`Bỏ đi sau ${m.days} ngày vì bị bỏ đói.`} Cho ăn ${m.fed} lần · cưng nựng ${m.pats} lần</div></div></div>`).join('')}</section>`:'';
 const nm=scr.name&&P.list.find(p=>p.u===scr.name);if(nm)setTimeout(()=>petName(P.list.indexOf(nm)),300);scr.name=null;
 save();
 return`<div class="page ipage"><div class="crumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'nha'})">← Nhà em</button><span class="grow"></span><button type="button" class="chip ghchip" onclick="go({k:'home',tab:'shop'})">🪙 <b>${st.coins}</b> <span>Gian hàng ▸</span></button></div>
  <section class="card itop"><h2>${spr('island',24)} Đảo nhà của ${esc(st.name.split(' ').pop())}</h2>${scene}${ev}</section>${bye}${none}${cards}${eggs}${bag}${mem}</div>`}
function petByeHTML(m){return`<div class="gdov pbye" id="pbye"><div class="gdbox"><div class="gdhd"><b>${spr(m.how==='old'?'star':'letterS',20)} ${m.how==='old'?'Tạm biệt bạn nhỏ':'Lá thư tạm biệt'}</b></div>
 <div class="gatebd">${spr(m.sp,56)}<p>${m.how==='old'?`<b>${esc(m.name)}</b> đã sống ${m.days} ngày vui vẻ bên em và ra đi thanh thản khi về già. Cảm ơn em đã chăm sóc bạn ấy thật chu đáo!`:`<b>${esc(m.name)}</b> đói quá lâu nên đã bỏ đi tìm nơi khác. Nuôi thú cưng cần chăm mỗi ngày em nhé.`}<br><small>Sau ${P_WAIT} ngày em có thể nuôi bạn mới. ${esc(m.name)} được ghi vào Sổ kỷ niệm.</small></p></div>
 <div class="gdctl"><button type="button" class="gdgo" onclick="petsOf(S.st[sid]).bye=null;save();render()">Em hiểu rồi</button></div></div></div>`}
/* túi đồ + bán thanh lý */
function sellPrice(st,g){const c=careOf(g.id);return Math.max(1,Math.floor(c[2]*.5*g.dur/100))}
function bagHTML(st){const s=ghSt(st),P=petsOf(st);const cons=CARE.filter(c=>c[6]&&(s.bag[c[0]]||0)>0).map(c=>`<div class="bagit">${spr(c[5],24)}<span class="grow"><b>${c[1].replace(/ \(.*\)/,'')}</b> × ${s.bag[c[0]]}</span><button type="button" class="btn sm ghost" onclick="bagSell('${c[0]}')">Bán ${Math.max(1,Math.floor(c[2]/c[6]*.5))} xu</button></div>`).join('');
 const gear=s.gear.map(g=>{const c=careOf(g.id),on=P.list.find(p=>p.wear===g.u);return`<div class="bagit ${g.dur<=0?'broken':''}">${spr(c[5],22)}<span class="grow"><b>${c[1]}</b>${on?` · ${esc(on.name)} đang mặc`:''}<span class="dur"><i style="width:${Math.round(g.dur)}%"></i></span><small>${g.dur<=0?'Đã hỏng':`Độ mới ${Math.round(g.dur)}%`}</small></span><button type="button" class="btn sm ghost" onclick="gearSell('${g.u}')">${g.dur<=0?'Bỏ đi':`Bán ${sellPrice(st,g)} xu`}</button></div>`}).join('');
 return`<section class="card pcard"><h3 class="ghgh">${spr('bag',18)} Túi đồ</h3>${cons||gear?cons+gear:'<p class="muted">Túi đồ trống. Mua thức ăn, đồ chơi… ở Gian hàng › Đồ nuôi.</p>'}<p class="muted" style="font-size:12px;margin:8px 0 0">Bán thanh lý: được nửa giá, đồ càng cũ càng rẻ.</p></section>`}
function bagSell(id){const st=S.st[sid],s=ghSt(st),c=careOf(id);if(!(s.bag[id]>0))return;s.bag[id]--;st.coins+=Math.max(1,Math.floor(c[2]/c[6]*.5));save();render()}
function gearSell(u){const st=S.st[sid],s=ghSt(st),g=s.gear.find(x=>x.u===u);if(!g)return;st.coins+=g.dur>0?sellPrice(st,g):0;s.gear=s.gear.filter(x=>x!==g);petsOf(st).list.forEach(p=>{if(p.wear===u)p.wear=''});save();toast(g.dur>0?`Đã bán ${careOf(g.id)[1]}.`:'Đã bỏ đồ hỏng.');render()}
function eggInc(u){const st=S.st[sid],P=petsOf(st);if(!gearHas(st,'inc')){toast('Em cần mua Máy ấp trứng ở Gian hàng › Đồ nuôi.');return}if(P.eggs.some(e=>e.inc)){toast('Máy ấp chỉ ấp được 1 quả mỗi lần.');return}const e=P.eggs.find(x=>x.u===u);if(e){e.inc=pNow();save();toast('Đã đặt trứng vào máy ấp. 3 ngày nữa trứng nở!');render()}}
function eggSell(u){const st=S.st[sid],P=petsOf(st),e=P.eggs.find(x=>x.u===u);if(!e)return;st.coins+=Math.round(PET_SP[e.sp][1]*.4);P.eggs=P.eggs.filter(x=>x!==e);save();render()}
/* chăm sóc */
function petPick(i,g){const st=S.st[sid],s=ghSt(st);scr.pk=scr.pk&&scr.pk.i===i&&scr.pk.g===g?null:{i,g};render()}
function petPicker(st,p,i,g){const s=ghSt(st);let it=[];
 if(g==='food'||g==='med'||g==='soap')it=CARE.filter(c=>c[3]===g&&(s.bag[c[0]]||0)>0).map(c=>`<button type="button" class="pkit" onclick="petUse(${i},'${c[0]}')">${spr(c[5],24)}<b>${c[1].replace(/ \(.*\)/,'')}</b><small>còn ${s.bag[c[0]]}</small></button>`);
 else it=s.gear.filter(x=>careOf(x.id)[3]===g&&x.dur>0).map(x=>{const c=careOf(x.id);return`<button type="button" class="pkit ${p.wear===x.u?'on':''}" onclick="petUse(${i},'${x.u}')">${spr(c[5],g==='wear'?16:24)}<b>${c[1]}</b><small>${p.wear===x.u?'đang mặc · bấm để cởi':Math.round(x.dur)+'%'}</small></button>`});
 return`<div class="pkbox">${it.length?it.join(''):`<span class="muted">Túi đồ chưa có ${({food:'thức ăn',med:'thuốc',soap:'xà phòng',toy:'đồ chơi',wear:'đồ mặc'})[g]}.</span><button type="button" class="btn sm" onclick="scr.ghCat='care';go({k:'home',tab:'shop'})">Mua ở Gian hàng</button>`}</div>`}
function petFx(i,sp){const sc=document.getElementById('iscene');if(!sc)return;const b=sc.querySelectorAll('.ipet')[i];if(!b)return;for(let k=0;k<3;k++){const e=document.createElement('i');e.className='pfx';e.style.left=(20+k*25)+'%';e.style.animationDelay=(k*.15)+'s';e.innerHTML=spr(sp,14);b.appendChild(e);setTimeout(()=>e.remove(),1400)}b.classList.remove('hop');void b.offsetWidth;b.classList.add('hop')}
function petUse(i,k){const st=S.st[sid],s=ghSt(st),P=petsOf(st),p=P.list[i];if(!p)return;
 const c=careOf(k);if(c){/* đồ tiêu hao */if(!(s.bag[k]>0))return;const e=c[4];
   if(c[3]==='food'&&p.no>=95){toast(`${p.name||'Bạn ấy'} no rồi!`);return}
   if(c[3]==='med'&&!p.sick&&p.hp>=90){toast(`${p.name||'Bạn ấy'} khoẻ mà, chưa cần thuốc.`);return}
   s.bag[k]--;p.no=clamp(p.no+(e.no||0));p.vui=clamp(p.vui+(e.vui||0));p.sach=clamp(p.sach+(e.sach||0));p.hp=clamp(p.hp+(e.hp||0));
   if(c[3]==='food')p.fed++;if(c[3]==='med'&&p.hp>=35)p.sick=false;p.ng=0;
   scr.pk=null;save();render();setTimeout(()=>petFx(i,c[3]==='soap'?'bubS':c[3]==='med'?'heartS':'heartS'),30);try{sfx('ok')}catch(e){}return}
 const g=s.gear.find(x=>x.u===k);if(!g)return;const gc=careOf(g.id);
 if(gc[3]==='toy'){if(p.no<10){toast(`${p.name||'Bạn ấy'} đói quá, không chơi nổi. Cho ăn trước nhé!`);return}p.vui=clamp(p.vui+gc[4].vui);p.no=clamp(p.no-5);p.plays++;g.dur=Math.max(0,g.dur-10);scr.pk=null;save();render();setTimeout(()=>petFx(i,'heartS'),30);try{sfx('win')}catch(e){}return}
 if(gc[3]==='wear'){p.wear=p.wear===g.u?'':g.u;P.list.forEach(o=>{if(o!==p&&o.wear===g.u)o.wear=''});scr.pk=null;save();render();try{sfx('card')}catch(e){}}}
function petPat(i){const st=S.st[sid],P=petsOf(st),p=P.list[i];if(!p)return;const now=pNow();if(now-p.patT>60e3){p.vui=clamp(p.vui+8);p.pats++;p.patT=now;save()}petFx(i,'heartS');try{sfx('tap')}catch(e){}}
function petName(i){const st=S.st[sid],p=petsOf(st).list[i];if(!p)return;const el=document.createElement('div');el.className='gdov';el.innerHTML=`<div class="gdbox"><div class="gdhd"><b>${spr(p.sp,20)} Đặt tên cho bạn ${PET_SP[p.sp][0]}</b><button type="button" class="gdx" onclick="this.closest('.gdov').remove()" aria-label="Đóng">✕</button></div><div class="gatebd">${petSpr(p,56)}<input id="pnIn" maxlength="12" value="${esc(p.name||PET_NAMES[Math.floor(Math.random()*PET_NAMES.length)])}" aria-label="Tên thú cưng"></div><div class="gdctl"><button type="button" class="gdgo" id="pnOk">Xong ▶</button></div></div>`;document.body.appendChild(el);
 const inp=el.querySelector('#pnIn');inp.focus();inp.select();el.querySelector('#pnOk').onclick=()=>{const v=inp.value.replace(/[<>"'&]/g,'').trim().slice(0,12);if(!v){inp.focus();return}p.name=v;save();el.remove();render()}}
/* học giỏi → thú cưng vui */
{const _e=end1;end1=function(){const r=_e.apply(this,arguments);try{if(scr&&scr.pass&&!scr.fix){const st=S.st[sid];petsOf(st).list.forEach(p=>{p.vui=clamp(p.vui+6)});save()}}catch(e){}return r}}
/* trang chính: chạm ảnh Jenny ở thẻ chào → Đảo nhà; có dấu ! khi thú cần chăm */
{const _h=viewHome1;viewHome1=function(){let r=_h.apply(this,arguments);try{const st=S.st[sid];petSim(st);const P=petsOf(st),need=P.list.some(p=>p.no<25||p.sick||p.sach<25||!p.name)||P.eggs.some(e=>!e.inc)||P.bye,fr=ghSt(st).frame;
  const i=r.indexOf('<section class="hero');if(i>=0){const j=r.indexOf('<span class="jav',i);if(j>=0){let d=0,k=j;const re=/<span\b|<\/span>/g;re.lastIndex=j;let m;while((m=re.exec(r))){d+=m[0]==='</span>'?-1:1;if(!d){k=re.lastIndex;break}}
   r=r.slice(0,j)+`<button type="button" class="herojav ${fr?'fr-'+fr:''}" onclick="go({k:'home',tab:'isle'})" aria-label="Vào Đảo nhà của em${need?' — thú cưng cần em chăm':''}">${r.slice(j,k)}${P.list[0]?`<span class="herpet">${petSpr(P.list[0],26)}</span>`:''}${need?'<i class="herbang">!</i>':''}<span class="herlbl">Đảo nhà</span></button>`+r.slice(k)}}}catch(e){}return r}}
{const _v=viewHome1t;viewHome1t=function(){const r=_v.apply(this,arguments);if(scr.tab!=='isle')return r;const st=S.st[sid],i=r.indexOf('<nav class="bnav"');return viewIsle(st)+(i>=0?r.slice(i):'')}}
/* Jenny đội mũ/kính đã mua ở mọi nơi */
{const _j=jenny;jenny=function(size,mood){const r=_j.apply(this,arguments);try{if(role!=='hs')return r;const st=S.st[sid],a=st&&st.shop&&st.shop.acc;if(!a||!GH_ACC[a])return r;const[nm,x,y]=GH_ACC[a],d=pxURI(nm),u=Math.round(size*.86)/19;
  return r.replace('<span class="jbody">',`<span class="jbody"><img class="px jsacc" src="${d.u}" alt="" style="left:${x*u}px;top:${y*u}px;width:${d.w*u}px;height:${d.h*u}px">`)}catch(e){return r}}}
document.head.insertAdjacentHTML('beforeend',`<style>
.jsacc{position:absolute;z-index:2;image-rendering:pixelated;pointer-events:none}.jbody{position:relative}
.herojav{position:relative;border:0;background:none;padding:0;cursor:pointer;flex:none;display:flex;flex-direction:column;align-items:center;gap:2px}.herojav .herlbl{font-family:var(--f-display);font-size:15px;line-height:1;color:#fff;background:#1F2A5A;padding:1px 5px}
.herojav.fr-wood .jav{box-shadow:0 0 0 3px #9A6234,0 0 0 6px #6B3F1D!important}.herojav.fr-silver .jav{box-shadow:0 0 0 3px #E3E7F0,0 0 0 6px #9AA4C0!important}.herojav.fr-gold .jav{box-shadow:0 0 0 3px #FCD655,0 0 0 6px #C97A00!important}.herojav.fr-rainbow .jav{box-shadow:0 0 0 2px #F04A1B,0 0 0 4px #FCB40C,0 0 0 6px #2AB563,0 0 0 8px #12B5E8!important}
.herpet{position:absolute;right:-12px;bottom:14px}.herbang{position:absolute;top:-6px;right:-6px;font-style:normal;font-family:var(--f-display);font-size:18px;line-height:18px;width:20px;text-align:center;background:#F04A1B;color:#fff;box-shadow:var(--f2);animation:bIdle 1s steps(2) infinite}
.ipage .crumb{display:flex;align-items:center;gap:8px}.itop{padding:12px!important}.itop h2{display:flex;align-items:center;gap:6px;margin:0 0 8px;font-size:24px}
.iscene{position:relative;height:230px;overflow:hidden;background:linear-gradient(#BDEBFA 0 45%,#12B5E8 45%);box-shadow:var(--f2)}
.iisl{position:absolute;left:50%;bottom:-8px;transform:translateX(-50%);width:min(330px,96%)!important;height:auto!important}
.idec,.ihome{position:absolute;transform:translate(-50%,-50%)}.ihome.h0{left:20%;top:72%}.ihome.h1{left:78%;top:52%}.ihome.h2{left:84%;top:74%}.ihome{display:flex;align-items:flex-end}.iegg{position:absolute;left:30%;top:-30%}
.ijen{position:absolute;left:30%;top:46%;transform:translate(-50%,-50%)}.ijen .jav{background:none!important;box-shadow:none!important}
.ipet{position:absolute;transform:translate(-50%,-50%);border:0;background:none;padding:0;cursor:pointer;animation:pWalk 3s steps(6) infinite alternate}.ipet:nth-of-type(2n){animation-duration:3.6s}
@keyframes pWalk{0%{margin-left:-14px}100%{margin-left:14px}}.ipet.hop .pspr{animation:pHop .5s steps(3) 2}@keyframes pHop{50%{transform:translateY(-12px)}}
.pspr{position:relative;display:inline-block;line-height:0}.pspr>img{display:block}.pspr.st3>img{filter:saturate(.55) brightness(1.05)}.pspr.sick>img{filter:hue-rotate(40deg) saturate(.6)}.pwear{position:absolute;image-rendering:pixelated}
.ifx{position:absolute;right:-8px;top:-10px;animation:bIdle 1s steps(2) infinite}.pfx{position:absolute;bottom:60%;animation:pUp 1.3s steps(6) forwards;pointer-events:none}@keyframes pUp{to{transform:translateY(-36px);opacity:0}}
.iev{margin-top:8px;padding:7px 10px;font-size:14px;background:#E3F7EA;color:#1E6B3A;box-shadow:0 0 0 2px #2AB563}.iev.warn{background:#FDE6DE;color:#B8320F;box-shadow:0 0 0 2px #F04A1B}
.pcard{padding:12px!important}.pchd{display:flex;gap:10px;align-items:center}.pchd h3{margin:0;font-size:20px}.pchd h3 small{font-size:13px;font-weight:600;color:#566779}
.psay{display:flex;gap:6px;align-items:center;margin:8px 0;padding:6px 8px;background:#FFF4D6;font-size:14px}
.pbar{display:grid;grid-template-columns:72px 1fr;align-items:center;gap:8px;margin:5px 0;font-size:13px;font-weight:700}.pbar i{height:12px;background:#E3E7F0;box-shadow:var(--f2);display:block}.pbar b{display:block;height:100%}
.pact{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px}.pbtn{display:flex;align-items:center;justify-content:center;gap:5px;border:0;padding:8px 4px;background:var(--surface,#fff);box-shadow:var(--f2),0 3px 0 0 #1F2A5A;font-family:var(--f-display);font-size:16px;line-height:1;white-space:nowrap;color:#1F2A5A;cursor:pointer}.pbtn.hot{background:#FDE6DE;color:#B8320F}.pbtn:active{transform:translateY(3px);box-shadow:var(--f2)}
.pkbox{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;padding:10px;background:#FFF4D6;box-shadow:var(--f2);align-items:center}.pkit{display:flex;flex-direction:column;align-items:center;gap:2px;border:0;padding:6px 8px;background:#fff;box-shadow:var(--f2);cursor:pointer;min-width:76px}.pkit b{font-size:12px}.pkit small{font-size:11px;color:#566779}.pkit.on{background:#E3F7EA}
.ghgh{display:flex;align-items:center;gap:6px;font-family:var(--f-display);font-size:20px;font-weight:400;margin:12px 0 6px}.ghq{font-style:normal;font-size:11px;color:#1E8A4A;font-weight:700}.ghit.dim{opacity:.55}
.ghlife{font-size:11px;color:#566779;font-weight:600}.ghcare{display:flex;align-items:flex-end;gap:10px;padding:6px}.ghcarei{animation:bIdle 1s steps(2) infinite}
.bagit,.egrow,.memrow{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:2px dashed #C9D1E6;font-size:14px}.bagit:last-of-type{border-bottom:0}.bagit .grow{display:flex;flex-direction:column;gap:2px}.bagit small{font-size:11px;color:#566779}.bagit.broken{opacity:.6}
.dur{display:block;width:90px;height:6px;background:#E3E7F0}.dur i{display:block;height:100%;background:#2AB563}
html[lang="en"] .bnav button{font-size:12px!important;letter-spacing:-.4px}
#pnIn{font:inherit;font-size:20px;padding:8px;border:0;box-shadow:var(--f2);width:100%;max-width:200px}
</style>`);

/* tiếng Anh cho Gian hàng và Đảo nhà */
Object.assign(I18N,{'Gian hàng Jenny':"Jenny's shop",'Chạm món đồ để thử':'Tap an item to try it','Thử miễn phí. Thích thì mua bằng xu.':'Try for free. Buy with coins if you like it.','Đang thử — chưa mua':'Trying — not bought yet','Em đã có món này':'You already own this','Áo váy':'Outfits','Mũ kính':'Hats','Khung':'Frames','Đảo nhà':'Home isle','Thú cưng':'Pets','Đồ nuôi':'Pet care','Vé game':'Tickets','Đã có':'Owned','Đang dùng':'In use','Chưa mua được':'Not available','Gian hàng ▸':'Shop ▸',
 'Áo Chanh tươi':'Lime top','Váy Hoa đào':'Peach dress','Áo Bầu trời':'Sky top','Áo Siêu nhân Toán':'Maths hero suit','Áo Hoàng kim':'Golden suit','Nơ đỏ':'Red bow','Kẹp hoa':'Flower clip','Mũ lưỡi trai':'Cap','Kính tròn':'Round glasses','Mũ phù thuỷ':'Wizard hat','Vương miện':'Crown','Khung Gỗ':'Wood frame','Khung Bạc':'Silver frame','Khung Vàng':'Gold frame','Khung Cầu vồng':'Rainbow frame',
 'Cây dừa':'Palm tree','Ô che nắng':'Sunshade','Lâu đài cát':'Sandcastle','Thuyền buồm':'Sailing boat','Cờ CLB Jenny':'Jenny Club flag','Hải đăng':'Lighthouse','Gà con':'Chick','Ếch xanh':'Frog','Rùa biển':'Sea turtle','Chim cánh cụt':'Penguin','Bạch tuộc':'Octopus','Rồng con':'Baby dragon',
 'Hạt dinh dưỡng':'Pet food','Cá khô':'Dried fish','Bánh thưởng':'Treat','Thuốc':'Medicine','Xà phòng (5 lần)':'Soap (5 baths)','Xà phòng':'Soap','Bóng':'Ball','Gấu bông':'Teddy','Nơ cổ':'Bow tie','Mũ len':'Woolly hat','Khăn quàng':'Scarf','Ổ rơm':'Straw nest','Máng ăn tự động':'Auto feeder','Máy ấp trứng':'Incubator',
 'Thức ăn':'Food','Thuốc & tắm':'Medicine & bath','Đồ chơi':'Toys','Đồ mặc':'Clothes','Nhà & máy':'Home & machines','Cho ăn':'Feed','Tắm':'Bath','Chữa':'Heal','Mặc đồ':'Dress','Cưng nựng':'Pat','No':'Full','Vui':'Happy','Sạch':'Clean','Sức khoẻ':'Health','Đổi tên':'Rename','Đặt tên':'Name','Túi đồ':'Bag','Sổ kỷ niệm':'Memory book','Đặt vào máy ấp':'Put in incubator','Em hiểu rồi':'I understand','Xong ▶':'Done ▶','Chọn thú cưng ▶':'Choose a pet ▶','Mua ở Gian hàng':'Buy at the shop','Em chưa có thú cưng':"You don't have a pet yet",'Bỏ đi':'Throw away','Đã hỏng':'Broken',
 'Vé chơi game tư duy':'Logic game tickets','Tạm biệt bạn nhỏ':'Goodbye, little friend','Lá thư tạm biệt':'Goodbye letter','Bán thanh lý: được nửa giá, đồ càng cũ càng rẻ.':'Selling gives half price; older items are worth less.'});
I18N_RE.push([/^Đảo nhà của (.+)$/,"$1's home isle"],[/^Mua (.+) · (\d+)$/,'Buy $1 · $2'],[/^Cần thêm (\d+)$/,'Need $1 more'],[/^Bán (\d+) xu$/,'Sell $1 coins'],[/^Độ mới (\d+)%$/,'Condition $1%'],[/^Đang nuôi (\d+)$/,'Raising $1'],[/^có (\d+)$/,'have $1'],[/^Ngày thứ (\d+) · đã cho ăn (\d+) lần · cưng nựng (\d+) lần$/,'Day $1 · fed $2 times · patted $3 times'],[/^Trứng \((\d+)\)$/,'Eggs ($1)'],[/^(\d+) xu$/,'$1 coins']);
/* ===== Thanh dưới (thầy chốt 20/10): Bản đồ · Toán Jenny · Luyện lỗi · Nhà em · Cửa hàng =====
   "Nhà em" mở trang gồm 3 ô: Đảo nhà (thú cưng), Sưu tập, Hồ sơ. "Cửa hàng" = Gian hàng Jenny. */
Object.assign(PXS,{houseS:["....kk....","...krrk...","..krrrrk..",".krrrrrrk.","krrrrrrrrk","kkwwwwwwkk",".kwbbwnnk.",".kwbbwnnk.",".kwwwwnnk.",".kkkkkkkk."]});
const NHA_TABS=['nha','album','hoso','isle'];
function viewNha(st){petSim(st);const P=petsOf(st),need=P.list.some(p=>p.no<25||p.sick||p.sach<25||!p.name)||P.eggs.some(e=>!e.inc)||!!P.bye,p0=P.list[0];
 const tile=(tab,ic,n,sub,bang)=>`<button type="button" class="nhat" onclick="go({k:'home',tab:'${tab}'})"><span class="nhic">${ic}${bang?'<i class="herbang">!</i>':''}</span><b>${n}</b><small>${sub}</small></button>`;
 return`<div class="page nhapage"><section class="card"><h2 class="nhah">${spr('houseS',24)} Nhà của ${esc(st.name.split(' ').pop())}</h2>
  <div class="nhagrid">${tile('isle',spr('island',54)+(p0?`<span class="nhpet">${petSpr(p0,28)}</span>`:''),'Đảo nhà',p0?`${esc(p0.name||PET_SP[p0.sp][0])} đang chờ em`:'Nuôi thú cưng',need)}
  ${tile('album',spr('fish',44),'Sưu tập','Hộ chiếu, thẻ sinh vật')}${tile('hoso',spr('hoso',44),'Hồ sơ','Chuỗi ngày học, đăng xuất')}</div></section></div>`}
{const _v=viewHome1t;viewHome1t=function(){const st=S.st[sid];let r;
  if(scr.tab==='nha'){const t=scr.tab;scr.tab='map';r=_v.apply(this,arguments);scr.tab=t;const i=r.indexOf('<nav class="bnav"');r=viewNha(st)+(i>=0?r.slice(i):'').replace(/<button class="on([^"]*)" aria-current="page" onclick="go\(\{k:'home',tab:'map'\}\)"/,`<button class="$1" aria-current="false" onclick="go({k:'home',tab:'map'})"`)}
  else{r=_v.apply(this,arguments);if(scr.tab==='album'||scr.tab==='hoso')r=`<div class="crumb nhacrumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'nha'})">← Nhà em</button></div>`+r}
  const tab=scr.tab||'map',P=petsOf(st),need=P.list.some(p=>p.no<25||p.sick||p.sach<25)||!!P.bye;
  const btn=(k,ic,n,on,b)=>`<button class="${on?'on':''}${b?' bnfix':''}" aria-current="${on?'page':'false'}" onclick="go({k:'home',tab:'${k}'})"><span aria-hidden="true" class="bnic">${ic}${b?'<i class="pxq-n bnn">!</i>':''}</span>${n}</button>`;
  r=r.replace(/<button class="[^"]*" aria-current="\w+" onclick="go\(\{k:'home',tab:'album'\}\)"[^>]*>[\s\S]*?<\/button>/,btn('nha',spr('houseS',24),'Nhà em',NHA_TABS.includes(tab),need))
   .replace(/<button class="[^"]*" aria-current="\w+" onclick="go\(\{k:'home',tab:'hoso'\}\)"[^>]*>[\s\S]*?<\/button>/,btn('shop',spr('shopI',24),'Cửa hàng',tab==='shop',false));
  return r}}
Object.assign(I18N,{'Nhà em':'My home','Cửa hàng':'Shop','← Nhà em':'← My home','Đảo nhà':'Home isle','Nuôi thú cưng':'Raise a pet','Hộ chiếu, thẻ sinh vật':'Passport, creature cards','Chuỗi ngày học, đăng xuất':'Study streak, log out'});
I18N_RE.push([/^Nhà của (.+)$/,"$1's home"],[/^(.+) đang chờ em$/,'$1 is waiting for you'],[/^(\d+)–(\d+) ngày$/,'$1–$2 days']);
document.head.insertAdjacentHTML('beforeend',`<style>
.nhah{display:flex;align-items:center;gap:8px;margin:0 0 12px;font-size:26px}.nhagrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.nhat{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;border:0;padding:12px 4px 10px;background:var(--surface,#fff);box-shadow:var(--f2),0 4px 0 0 #1F2A5A;cursor:pointer;color:inherit}.nhat:active{transform:translateY(3px);box-shadow:var(--f2)}
.nhat:first-child{background:#DDF3FB}.nhic{position:relative;height:60px;display:grid;place-items:center}.nhpet{position:absolute;right:-6px;bottom:0}.nhat b{font-family:var(--f-display);font-size:21px;font-weight:400;line-height:1}.nhat small{font-size:11.5px;color:#566779;text-align:center;line-height:1.2}
.nhacrumb{margin:0 0 8px}
</style>`);
