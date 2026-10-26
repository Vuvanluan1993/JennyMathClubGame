/* ===================== CHƠI THÊM · ĐỢT 2 (lớp 1–5) ===================== */
/* 3 trò mới, cùng khung với đợt 1 (37-tro-choi-dot-1.js: startXG, viewXG, xgEnd, st.mg, Hồ sơ):
   scale Cân thăng bằng — đặt quả cân lên đĩa phải cho bằng đĩa trái (số, phép tính, khối lượng), 8 lượt, 3 tim.
   shop  Cửa hàng Jenny  — chọn tờ tiền trả đúng giá; lớp 3+ thêm tính tiền trả lại; lớp 4–5 thêm mua nhiều món, giảm giá. 8 lượt, 3 tim.
   train Tàu hoả xếp số  — chạm các toa theo thứ tự từ bé đến lớn (hoặc ngược lại) để nối vào đầu tàu, 6 lượt, 3 tim.
   Trục Hồ sơ: scale → Phép tính (đảo khối lượng → Đo lường), shop → Đo lường (mua nhiều món → Lời văn), train → Số. */
import { hooks } from './00-hooks.js';
import { esc, pick, R } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { addCoins } from './11-sao-va-mo-khoa.js';
import { go, render } from './13-giao-dien-chung.js';
import { shuf } from './21-lop-6-che-do-tro-choi.js';
import { PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { isl1, sayJ } from './30b-may-tieu-hoc.js';
import { curG, PRIM } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { F } from './30c-cau-hoi-chung.js';
import { fN } from './30e-hinh-hoc-so-lon.js';
import { hurtFx, mHz, noise, sfx, SFX, tone } from './33b-am-thanh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { stopXG, xgHash, xgHearts, XGN, xgRec, xgTxt } from './37-tro-choi-dot-1.js';
import { scaleHTML, scalePaint } from './38b-can-pixel.js';
Object.assign(PXS,{
 scaleI:["......kk......","......ky......","kkkkkkkkkkkkkk","..k........k..",".k.k......k.k.","k...k....k...k","kkkkk.kk.kkkkk",".kkk..kk..kkk.","......kk......","....kkkkkk....","...kkkkkkkk..."],
 shopI:["kkkkkkkkkkkk","kcwcwcwcwcwk","kcwcwcwcwcwk","kkkkkkkkkkkk",".kwwwwwwwwk.",".kwbbwwyywk.",".kwbbwwyywk.",".kwwwwwwwwk.",".kwwnnnnwwk.",".kwwnnnnwwk.",".kkkkkkkkkk."],
 trainI:["......kkk.....","......kck.....","kkkkk.kkkk....","kbbbk.kyyk....","kbwbkkkkkkkkk.","kbbbkcccccccck","kkkkkkkkkkkkkk",".kNk..kNk.kNk.","..k....k...k.."],
 itPencil:["........kk","......kkyk",".....kyyk.","....kyyk..","...kyyk...","..kyyk....",".kssk.....",".kkk......","kk........"],
 itBall:["..kkkk..",".kwrrwk.","kwrrrrwk","krrwwrrk","krrwwrrk","kwrrrrwk",".kwrrwk.","..kkkk.."],
 itCake:["....k....","....y....","...kkk...","..kwwwk..",".kcwcwck.","kccccccck","knnnnnnnk","kkkkkkkkk"],
 itKite:["....k....","...kbk...","..kbbbk..",".kbbwbbk.","kbbbwbbbk",".kbbwbbk.","..kbbbk..","...kbk...","....k....","....r....","...r.....","....r...."],
 itBag:["..kkkk..",".k....k.","kkkkkkkk","kggggggk","kgGggGgk","kggggggk","kggyyggk","kkkkkkkk"],
 itBook:["kkkkkkkkk","kpppppppk","kpwwwwwpk","kpppppppk","kpwwwwwpk","kpppppppk","kkkkkkkkk"],
 itMilk:["..kkk..","..kwk..",".kwwwk.","kwwwwwk","kbbbbbk","kbwbwbk","kbbbbbk","kwwwwwk","kkkkkkk"],
});
Object.assign(XGN,{scale:['scaleI','Cân thăng bằng','Đặt quả cân cho hai đĩa bằng nhau, 8 lượt'],shop:['shopI','Cửa hàng Jenny','Chọn tiền trả đúng giá, 8 lượt'],train:['trainI','Tàu hoả xếp số','Xếp toa theo thứ tự số, 6 lượt']});
SFX.choo=()=>{[0,.18,.36].forEach((t,i)=>tone(mHz(i===2?52:47),t,.14,'square',.14,1));noise(.45,.35,.06)};
const W2=['scale','shop','train'];
export const xgTopic=x=>{try{for(const g in PRIM)if(PRIM[g].isl.includes(x))return(PRIM[g].T[x.ti||0]||[''])[0]}catch(e){}return''};
export const xgTxt2=x=>`${x.title} ${x.lesson} ${x.goal}`;
export const xgMoney=x=>/tiền|mua bán|mua hàng|\bđồng\b(?!\s*hồ)/i.test(xgTxt2(x).replace(/quy đồng|đồng hồ|đồng dạng/gi,''));
export const xgMass=x=>/ki-lô-gam|\bkg\b|\bgam\b|khối lượng|nặng|\byến\b|\btạ\b|\btấn\b/i.test(xgTxt2(x));
const xgMassBig=x=>/\byến\b|\btạ\b|\btấn\b/i.test(xgTxt2(x));
export const xgCalc=x=>/cộng|trừ|nhân|chia|phép tính|biểu thức|thành phần|bằng nhau|tìm số|Bảng/i.test(xgTxt2(x));
export const xgNum=x=>/Các số|số có|so sánh|thứ tự|xếp|sắp xếp|thập phân|phân số|dãy số|đến 100|đến 1 000|đến 1000|nghìn|triệu|tia số|lớn hơn|bé hơn|nhiều hơn|ít hơn|số tự nhiên|chục|trăm/i.test(xgTxt2(x));
export const xgMeasTopic=x=>/đo|đơn vị|khối lượng|diện tích|thể tích|độ dài|thời gian|đại lượng/i.test(xgTopic(x)+' '+xgTxt2(x));
export const xgWord=x=>/bài toán|lời văn|giải toán|giải bài/i.test(xgTxt2(x));
/* ---------- chọn trò cho đảo: thêm đợt 2 vào danh sách của đợt 1 ---------- */
hooks.on('islOpts2',_islOpts2v1=>function(x){const base=_islOpts2v1(x),h=xgHash(x.id+'w2'),G=+(String(x.id).match(/^g(\d)/)||[0,curG()])[1],prac=x.tiet>1||/Luyện tập|Ôn tập/i.test(xgTxt2(x));
  const want=[];
  if(xgMoney(x))want.push('shop');
  if(xgMass(x))want.push('scale');
  if(!want.length){const c=[];
    if(G>=4&&prac&&xgMeasTopic(x))c.push('shop','shop');
    if(G>=2&&xgWord(x))c.push('shop');
    if(xgCalc(x))c.push('scale');
    if(xgNum(x))c.push('train','train');
    if(c.length&&h%5<3)want.push(c[h%c.length])}
  let out=[...base];
  want.forEach(w=>{if(out.includes(w))return;if(out.length<3){out.push(w);return}
    const idx=out.map((o,i)=>[o,i]).filter(([o])=>o!=='clock'&&!W2.includes(o));if(!idx.length)return;
    /* thay trò cũ bị trùng nhiều nhất trước (Câu cá/Bóng bay), nếu không thì theo mã đảo */
    const pref=idx.find(([o])=>o==='fish')||idx.find(([o])=>o==='balloon')||idx[h%idx.length];out[pref[1]]=w});
  return[...new Set(out)].slice(0,3)});

/* ---------- định dạng ---------- */
export const xgDec=v=>{const s=(v/100).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');const [a,b]=s.split('.');return fN(+a)+(b?','+b:'')};
function xgMassFmt(v,big){if(big){const t=Math.floor(v/100),y=Math.floor(v%100/10),k=v%10,o=[];if(t)o.push(`${t} tạ`);if(y)o.push(`${y} yến`);if(k)o.push(`${k} kg`);return o.join(' ')||'0 kg'}
  if(v>=1000){const k=Math.floor(v/1000),g=v%1000;return g?`${k} kg ${g} g`:`${k} kg`}return`${v} g`}
export const xgVnd=v=>`${fN(v)} đồng`;

/* ---------- 1. CÂN THĂNG BẰNG ---------- */
export function scaleRound(...a){return hooks.goi('scaleRound',this,a)}
hooks.ham('scaleRound',function(x){const G=curG(),mass=xgMass(x),big=xgMassBig(x);let unit='n',den,sol,left,fmt=v=>fN(v),kind='Hai vế bằng nhau (phép tính)';
  const pickSol=(D,n)=>Array.from({length:n},()=>pick(D));
  if(mass&&G<=2){unit='kg';den=[1,2,3,5];sol=pickSol(den,R(2,3));fmt=v=>`${v} kg`;kind='Cân theo đơn vị đo khối lượng'}
  else if(mass&&big){unit='kgb';den=[100,10,5,2,1];sol=pick([[100,10,5],[100,10,10],[10,10,5,2],[100,5,2],[10,5,1],[100,100,10]]);fmt=v=>xgMassFmt(v,true);kind='Cân theo đơn vị đo khối lượng'}
  else if(mass&&G>=4){unit='g';den=[1000,2000,500,200,100];sol=pickSol(den,R(2,3));fmt=v=>xgMassFmt(v);kind='Cân theo đơn vị đo khối lượng'}
  else if(mass){unit='g';den=[500,200,100,50,20,10];sol=pickSol(den,R(2,3));if(sol.reduce((a,b)=>a+b,0)>1000)sol=[500,200];fmt=v=>xgMassFmt(v);kind='Cân theo đơn vị đo khối lượng'}
  else if(G===1){den=[1,2,3,4,5,6];sol=pickSol(den,2);if(sol[0]+sol[1]>10)sol=[R(1,5),R(1,5)]}
  else if(G===2){den=[10,20,30,40,5,2,1,3];sol=[pick([10,20,30,40]),pick([10,20]),pick([1,2,3,5])];if(sol.reduce((a,b)=>a+b,0)>100)sol=[40,30,5]}
  else if(G===3){den=[100,200,300,500,50,20,10];sol=[pick([100,200,300,500]),pick([100,200]),pick([10,20,50])];if(sol.reduce((a,b)=>a+b,0)>1000)sol=[500,200,50]}
  else if(G===4||!/thập phân/i.test(xgTxt2(x)+' '+xgTopic(x))){den=[1000,2000,5000,500,200,100];sol=[pick([1000,2000,5000]),pick([500,1000]),pick([100,200])]}
  else{unit='d';den=[25,50,75,100,150,200];sol=pickSol(den,R(2,3));fmt=xgDec}
  const T=sol.reduce((a,b)=>a+b,0);
  /* bên trái: số hoặc phép tính có cùng kết quả (khác cách tách so với quả cân đúng) */
  if(unit==='n'){const r=Math.random();if(G>=3&&r<.3&&T%4===0)left=`${fN(T/4)} × 4`;else if(G>=3&&r<.3&&T%5===0)left=`${fN(T/5)} × 5`;else if(r<.65){const a=G===1?R(0,T):Math.round(T*(R(20,80)/100));left=`${fN(a)} + ${fN(T-a)}`}else if(r<.85&&G>=2){const s=R(1,Math.max(1,Math.round(T/3)));left=`${fN(T+s)} − ${fN(s)}`}else left=fN(T)}
  else if(unit==='d'){const A=[25,50,100,125,150].filter(v=>v<T),a=A.length?pick(A):0;left=a?`${xgDec(a)} + ${xgDec(T-a)}`:xgDec(T)}
  else left=fmt(T);
  const tray=[...sol];const n=G<=2?5:6;while(tray.length<n){const d=pick(den);tray.push(d)}
  return{T,left,tray:shuf(tray.map((v,i)=>({v,i}))),fmt,kind,sol:[...sol]}});
export function scaleRight(g){return g.on.reduce((a,i)=>a+g.r.tray[i].v,0)}
export const scaleTray=g=>g.r.tray.map((o,i)=>g.on.includes(i)?`<span class="xsw ghost"></span>`:`<button type="button" class="xsw" onclick="scaleTap(${i})" aria-label="Đặt quả cân ${esc(g.r.fmt(o.v))}">${g.r.fmt(o.v)}</button>`).join('');
function scaleTap(i){const g=scr;if(g.k!=='xg'||g.end||g.lockC)return;const k=g.on.indexOf(i);if(k>=0)g.on.splice(k,1);else g.on.push(i);sfx('tick');scalePaint()}
function scaleCheck(){const g=scr;if(g.k!=='xg'||g.end||g.lockC||!g.on.length)return;const ok=scaleRight(g)===g.r.T,fb=document.getElementById('xgfb');xgRec(ok,{kind:g.r.kind});
  if(ok){g.score++;sfx('ok');if(fb)fb.innerHTML=`<span class="ok">Thăng bằng rồi! ${esc(g.r.left)} = ${g.r.fmt(g.r.T)}</span>`}
  else{g.lives--;sfx('bad');hurtFx(1);xgHearts();const L=g.r.T,Rv=scaleRight(g);if(fb)fb.innerHTML=`<span class="bad">Chưa bằng: bên phải ${g.r.fmt(Rv)} ${Rv>L?'nặng hơn':'nhẹ hơn'}. Cần ${g.r.fmt(L)}.</span>`;
    /* đặt lại cách đúng cho em xem */
    const used=[];g.on=g.r.sol.map(v=>{const i=g.r.tray.findIndex((o,k)=>o.v===v&&!used.includes(k));used.push(i);return i}).filter(i=>i>=0);scalePaint()}
  g.lockC=1;setTimeout(()=>{g.lockC=0;if(scr!==g||g.end)return;if(g.lives<=0||g.ri>=g.N-1)return xg2End();g.ri++;g.r=scaleRound(isl1(g.id));g.on=[];render()},ok?900:1900)}

/* ---------- 2. CỬA HÀNG JENNY ---------- */
const SHOPIT=[['itPencil','bút chì'],['itBall','quả bóng'],['itCake','bánh kem'],['itKite','con diều'],['itBag','chiếc cặp'],['itBook','quyển truyện'],['itMilk','hộp sữa']];
export function shopNotes(...a){return hooks.goi('shopNotes',this,a)}
hooks.ham('shopNotes',function(G){return G<=2?[100,200,500,1000]:G===3?[1000,2000,5000,10000,20000,50000,100000]:[1000,2000,5000,10000,20000,50000,100000,200000,500000]});
export function shopPrice(...a){return hooks.goi('shopPrice',this,a)}
hooks.ham('shopPrice',function(G){if(G<=2)return R(3,20)*100;if(G===3)return R(3,95)*1000;return pick([R(5,99),R(100,480)])*1000});
export function shopRound(...a){return hooks.goi('shopRound',this,a)}
hooks.ham('shopRound',function(G,k,N){const it=shuf(SHOPIT);
  /* loại lượt: lớp 2 chỉ trả tiền; lớp 3: 6 trả + 2 trả lại; lớp 4–5: 3 trả, 2 nhiều món, 1 giảm giá, 2 trả lại */
  const plan=G<=2?Array(N).fill('pay'):G===3?['pay','pay','pay','chg','pay','pay','chg','pay']:['pay','multi','pay','chg','disc','multi','chg','pay'];
  const t=plan[k%plan.length];
  if(t==='pay'){const p=shopPrice(G);return{t,items:[[it[0],p]],total:p,kind:'Trả tiền mua hàng'}}
  if(t==='multi'){const n=R(2,3),items=it.slice(0,n).map(o=>[o,R(3,60)*1000]),total=items.reduce((a,b)=>a+b[1],0);return{t,items,total,kind:'Bài toán mua nhiều món'}}
  if(t==='disc'){const p=R(20,150)*1000,d=pick([2000,5000,10000]);return{t,items:[[it[0],p]],disc:d,total:p-d,kind:'Trả tiền khi được giảm giá'}}
  const p=G===3?R(3,45)*1000:R(10,180)*1000,give=shopNotes(G).find(v=>v>p&&v>=p+1000)||Math.ceil((p+1)/100000)*100000,c=give-p;
  const opts=shuf([...new Set([c,c+1000,Math.max(1000,c-1000),c+(G===3?5000:10000),p].filter(v=>v>0))].slice(0,4));
  return{t:'chg',items:[[it[0],p]],give,total:c,opts,kind:'Tính tiền trả lại'}});
const shopNote=(v,cls,on)=>{const c=v>=100000?'big':v>=10000?'mid':v>=1000?'k':'s';return`<button type="button" class="xsn ${c} ${cls||''}" onclick="${on}" aria-label="Tờ ${fN(v)} đồng"><b>${fN(v)}</b><i>đồng</i></button>`};
export function shopPaid(g){return g.pay.reduce((a,b)=>a+b,0)}
function shopTap(v){const g=scr;if(g.k!=='xg'||g.end||g.lockC)return;g.pay.push(v);sfx('coin');shopPaint()}
function shopUntap(i){const g=scr;if(g.end||g.lockC)return;g.pay.splice(i,1);sfx('tick');shopPaint()}
function shopPaint(){const g=scr,s=document.getElementById('xshp');if(s)s.innerHTML=g.pay.length?g.pay.map((v,i)=>shopNote(v,'paid',`shopUntap(${i})`)).join(''):'<span class="muted">Chạm tờ tiền ở ví để trả</span>';const t=document.getElementById('xshs');if(t)t.textContent=xgVnd(shopPaid(g))}
export function shopSay(r){const nm=r.items.map(([o,p])=>`${o[1]} ${fN(p)} đồng`).join(', ');
  if(r.t==='chg')return`Em mua ${nm}, em đưa cô ${fN(r.give)} đồng. Cô trả lại em bao nhiêu tiền?`;
  if(r.t==='multi')return`Em mua ${nm}. Em trả tất cả bao nhiêu tiền?`;
  if(r.t==='disc')return`${r.items[0][0][1]} giá ${fN(r.items[0][1])} đồng, hôm nay giảm ${fN(r.disc)} đồng. Em trả đúng số tiền nhé.`;
  return`Em mua ${nm}. Em chọn tờ tiền để trả đúng giá nhé.`}
function shopHTML(...a){return hooks.goi('shopHTML',this,a)}
hooks.ham('shopHTML',function(g){const r=g.r,G=curG();
  const shelf=`<div class="xshelf">${r.items.map(([o,p])=>`<div class="xsitem">${spr(o[0],56)}<span class="xstag">${fN(p)} đ</span><small>${o[1]}</small></div>`).join('')}${r.t==='disc'?`<div class="xsdisc">GIẢM<br>${fN(r.disc)} đ</div>`:''}</div>`;
  const q=r.t==='chg'?`Em đưa <b>${xgVnd(r.give)}</b>. Cô trả lại bao nhiêu?`:r.t==='multi'?`Mua ${r.items.length} món. Trả <b>tất cả</b> bao nhiêu?`:r.t==='disc'?'Được giảm giá. Trả đúng số tiền.':'Trả đúng giá món hàng.';
  if(r.t==='chg')return`${shelf}<p class="xsq">${q}</p><div class="xschg">${r.opts.map(v=>`<button type="button" class="xgb xsopt" onclick="shopCheck(${v})">${xgVnd(v)}</button>`).join('')}</div>`;
  return`${shelf}<p class="xsq">${q}</p><div class="xspaid"><div class="xspl">Em đưa: <b id="xshs">${xgVnd(shopPaid(g))}</b></div><div class="xshp" id="xshp"></div></div>
   <div class="xswal" aria-label="Ví tiền">${shopNotes(G).map(v=>shopNote(v,'',`shopTap(${v})`)).join('')}</div><div class="xsact"><button type="button" class="gobtn ghost xsclr" onclick="scr.pay=[];shopPaint()">Đưa lại</button><button type="button" class="gobtn xgchk" onclick="shopCheck()">Trả tiền</button></div>`});

/* ---------- 3. TÀU HOẢ XẾP SỐ ---------- */
export function trainRound(...a){return hooks.goi('trainRound',this,a)}
hooks.ham('trainRound',function(x){const G=curG(),t=xgTxt2(x)+' '+xgTopic(x),n=G===1?5:6,up=Math.random()<.6;let vals=[],show=v=>fN(v),kind='Xếp thứ tự số';
  const uniq=f=>{const s=new Set();let k=0;while(s.size<n&&k++<400)s.add(f());return[...s]};
  const perm=(D)=>{const d=String(D).split('');return()=>{const a=shuf(d);if(a[0]==='0')a.push(a.shift());return+a.join('')}};
  if((G===4||G===5)&&/phân số thập phân|Phân số TP/i.test(t)){const d=pick([10,100]);vals=uniq(()=>R(1,d-1)*1000+d);show=v=>F(Math.floor(v/1000),v%1000);kind='Xếp thứ tự phân số'}
  else if(G===5&&/thập phân/i.test(t)){const I=R(1,9);vals=uniq(()=>I*1000+pick([R(1,9)*100,R(10,99)*10,R(100,999),R(1,9)*100+R(1,9)*10]));if(Math.random()<.4)vals[0]=(I+1)*1000+R(1,9)*100;vals=[...new Set(vals)];show=v=>`${Math.floor(v/1000)},${String(v%1000).padStart(3,'0').replace(/0+$/,'')||'0'}`;kind='Xếp thứ tự số thập phân'}
  else if((G===4||G===5)&&/phân số/i.test(t)){const d=R(5,12);vals=uniq(()=>R(1,d-1)*1000+d);show=v=>F(Math.floor(v/1000),v%1000);vals.sort();kind='Xếp thứ tự phân số'}
  else if(G===1){vals=/100|chục|hai chữ số/i.test(t)?uniq(()=>R(10,99)):/0\s*[–-]\s*5|đến 5\b/.test(t)?uniq(()=>R(0,5)):uniq(()=>R(0,10))}
  else if(G===2){if(/1 000|1000|ba chữ số|trăm/i.test(t)){const H=R(1,9);vals=uniq(()=>Math.random()<.7?H*100+R(0,99):R(100,999))}else{const T=R(1,8);vals=uniq(()=>Math.random()<.6?T*10+R(0,19):R(10,99))}}
  else if(G===3){if(/1 000|1000|ba chữ số/i.test(t)&&!/10 000|100 000/.test(t)){const H=R(1,9);vals=uniq(()=>H*100+R(0,99))}else{const B=R(10000,99999),P=perm(B);vals=uniq(()=>Math.random()<.7?P():B+R(-900,900))}}
  else{const lo=/triệu|lớp triệu|chín chữ số/i.test(t)?[10000000,999999999]:/100 000|10 000|đến 100/i.test(t)?[10000,99999]:G===4?[100000,999999]:[1000000,9999999];const B=R(lo[0],lo[1]),P=perm(B),sp=Math.max(9,Math.round(B/1000));vals=uniq(()=>{const v=Math.random()<.7?P():B+R(-sp,sp);return v>=lo[0]/10?v:B+R(1,sp)})}
  /* phân số: so theo giá trị (cùng mẫu → theo tử) */
  const val=kind==='Xếp thứ tự phân số'?(v=>Math.floor(v/1000)/(v%1000)):(v=>v);
  vals=vals.slice(0,n);const order=[...vals].sort((a,b)=>up?val(a)-val(b):val(b)-val(a));
  return{vals:shuf(vals),order,up,show,kind}});
function trainHTML(g){const r=g.r;return`<div class="xtrack"><div class="xtrain ${g.go?'go':''}" id="xtr"><span class="xteng">${spr('trainI',64)}</span>${g.att.map((v,i)=>`<button type="button" class="xtw on" ${i===g.att.length-1?`onclick="trainUndo()" aria-label="Tháo toa ${xgTxt(r.show(v))}"`:'tabindex="-1" aria-hidden="true"'}><b>${r.show(v)}</b><i></i><i></i></button>`).join('')}</div><span class="xtrail"></span></div>
  <div class="xtyard">${r.vals.map(v=>g.att.includes(v)?'<span class="xtw ghost"></span>':`<button type="button" class="xtw" onclick="trainTap(${v})" aria-label="Toa ${xgTxt(r.show(v))}"><b>${r.show(v)}</b><i></i><i></i></button>`).join('')}</div>`}
function trainPaint(){const b=document.getElementById('xtb');if(b)b.innerHTML=trainHTML(scr)}
function trainUndo(){const g=scr;if(g.end||g.lockC)return;g.att.pop();sfx('tick');trainPaint()}
function trainTap(v){const g=scr;if(g.k!=='xg'||g.end||g.lockC||g.att.includes(v))return;g.att.push(v);sfx('card');trainPaint();if(g.att.length===g.r.vals.length)trainCheck()}
function trainCheck(){const g=scr,r=g.r,ok=g.att.every((v,i)=>v===r.order[i]),fb=document.getElementById('xgfb');xgRec(ok,{kind:r.kind});g.lockC=1;
  if(ok){g.score++;g.go=1;sfx('choo');trainPaint();if(fb)fb.innerHTML=`<span class="ok">Tàu chạy rồi! Xếp đúng ${r.up?'từ bé đến lớn':'từ lớn đến bé'}.</span>`}
  else{g.lives--;sfx('bad');hurtFx(1);xgHearts();const bad=g.att.findIndex((v,i)=>v!==r.order[i]);const t=document.getElementById('xtr');if(t){const w=t.querySelectorAll('.xtw')[bad];if(w)w.classList.add('bad')}
    if(fb)fb.innerHTML=`<span class="bad">Chưa đúng. Thứ tự đúng: ${r.order.map(v=>r.show(v)).join(r.up?' &lt; ':' &gt; ')}</span>`}
  setTimeout(()=>{g.lockC=0;g.go=0;if(scr!==g||g.end)return;if(g.lives<=0||g.ri>=g.N-1)return xg2End();g.ri++;g.r=trainRound(isl1(g.id));g.att=[];render();sayJ(trainSay(g.r))},ok?1300:2300)}
const trainSay=r=>`Em chạm các toa để xếp ${r.up?'từ bé đến lớn':'từ lớn đến bé'} nhé.`;

/* ---------- khung: bắt đầu, màn chơi, kết thúc ---------- */
{hooks.on('startXG',_s=>function(mode,id){if(!W2.includes(mode))return _s.apply(this,arguments);try{speechSynthesis.cancel()}catch(e){}const x=isl1(id),G=curG();
  const base={k:'xg',mode,id,score:0,lives:3,end:false,started:false,t0:Date.now(),ri:0};
  if(mode==='scale'){const r=scaleRound(x);go({...base,N:8,r,on:[],say:'Cân thăng bằng! Em đặt quả cân lên đĩa bên phải cho hai bên bằng nhau nhé.'})}
  if(mode==='shop'){const r=shopRound(G,0,8);go({...base,N:8,r,pay:[],say:'Chào em đến Cửa hàng Jenny! '+shopSay(r)})}
  if(mode==='train'){const r=trainRound(x);go({...base,N:6,r,att:[],say:'Tàu hoả xếp số! '+trainSay(r)})}})}
export function xg2End(){const g=scr;if(g.k!=='xg'||g.end)return;stopXG();const st=S.st[sid];st.mg=st.mg||{};const key=`${g.id}:${g.mode}`;g.prev=st.mg[key]||0;st.mg[key]=Math.max(g.prev,g.score);
  g.coins=addCoins(sid,Math.min(20,g.score*(g.mode==='train'?3:2)),'self');g.end=true;g.win=g.lives>0;
  log(sid,'passed',`${XGN[g.mode][1]} · ${isl1(g.id).title}`,0,{success:g.win,score:{raw:g.score}});sfx(g.win?'win':'lose');
  sayJ(g.mode==='scale'?`Em cân đúng ${g.score} lần!`:g.mode==='shop'?`Em trả đúng ${g.score} lần. Cảm ơn em đã ghé cửa hàng!`:`Em xếp đúng ${g.score} đoàn tàu!`);save();render()}
{hooks.on('viewXG',_v=>function(){const g=scr;if(!W2.includes(g.mode))return _v.apply(this,arguments);const st=S.st[sid],best=Math.max((st.mg||{})[`${g.id}:${g.mode}`]||0,g.score),[sp]=XGN[g.mode];
  if(g.end){const rec=g.score>(g.prev||0)&&g.score>0,unit=g.mode==='scale'?'lần cân':g.mode==='shop'?'lần trả tiền':'đoàn tàu';
    return`<div class="game g1"><div class="gend xgend"><div class="xgendrow"><span class="bigicon">${spr(sp,72)}</span>${jenny(72,g.win||g.score?'cheer':'sad')}</div><h1>${rec?'Kỷ lục mới!':g.win?'Giỏi quá!':'Hết lượt!'}</h1><p class="muted">Đúng <b>${g.score}</b>/${g.N} ${unit} · kỷ lục ${best}</p>${g.coins?`<p class="earn">+${g.coins} xu</p>`:''}<div class="gendbtn"><button class="gobtn" type="button" onclick="startXG('${g.mode}','${g.id}')">Chơi lại</button><button class="gobtn ghost" type="button" onclick="go({k:'island',id:'${g.id}'})">Về đảo</button></div></div></div>`}
  const top=`<div class="gtop"><button class="gx" onclick="stopXG();go({k:'island',id:'${g.id}'})" aria-label="Thoát">✕</button><span class="mgsc">${spr('star',22)} <b id="xgs">${g.score}</b></span><span class="grow"></span><span class="mgsc">${spr(sp,22)} <b id="xgr">${g.ri+1}/${g.N}</b></span><span class="hearts" id="xgl">${[0,1,2].map(i=>spr(i<g.lives?'heart':'heartE',18)).join(' ')}</span></div>`;
  const rule=t=>`<div class="mgrule"><span>${t}</span><button class="g1spk" type="button" onclick="sayJ(${g.mode==='shop'?'shopSay(scr.r)':g.mode==='train'?'trainSay(scr.r)':'scr.say'})" aria-label="Nghe lại">🔊</button></div>`;
  if(g.mode==='scale')return`<div class="game g1 mini xg xg2">${top}${rule('Đặt quả cân lên đĩa phải cho <b>hai bên bằng nhau</b>')}<div class="xsbox"><div id="xsb">${scaleHTML(g)}</div><p class="xsr">Đĩa phải: <b id="xssum">${g.r.fmt(scaleRight(g))}</b></p><div class="xstray" id="xstray">${scaleTray(g)}</div><button type="button" class="gobtn xgchk" onclick="scaleCheck()">Cân!</button></div><div id="xgfb" class="xgfb"></div></div>`;
  if(g.mode==='shop')return`<div class="game g1 mini xg xg2">${top}${rule('Cửa hàng Jenny: trả đúng tiền')}<div class="xshop">${shopHTML(g)}</div><div id="xgfb" class="xgfb"></div></div>`;
  if(g.mode==='train')return`<div class="game g1 mini xg xg2">${top}${rule(`Xếp toa <b>${g.r.up?'từ bé đến lớn':'từ lớn đến bé'}</b>`)}<div class="xtbox" id="xtb">${trainHTML(g)}</div><div id="xgfb" class="xgfb"></div></div>`;
  return''})}
{hooks.on('xgAfterRender',_ar=>function(){const g=scr;if(g.k==='xg'&&W2.includes(g.mode)){if(g.end)return;if(g.mode==='shop')shopPaint();if(g.started)return;g.started=true;sayJ(g.say);return}return _ar.apply(this,arguments)})}
{hooks.on('musicTheme',_mt=>function(){try{if(role==='hs'&&scr.k==='xg'&&W2.includes(scr.mode))return scr.end?null:({scale:'game',shop:'fish',train:'race'})[scr.mode]}catch(e){}return _mt.apply(this,arguments)})}
