/* ===================== CHƠI THÊM KHÔNG VƯỢT KIẾN THỨC ===================== */
/* Thầy Luân: trò chơi ở đảo nào chỉ được dùng kiến thức đã học tới đảo đó (đảo này + các đảo trước, cùng lớp).
   1) Dòng kiến thức KT[lớp][k]: gộp dần các "dấu hiệu" lấy từ tên/mục tiêu đảo và câu hỏi thật của đảo
      (phép +, −, ×, :, phân số, số thập phân, %, so sánh, thứ tự, tiền, giờ, đơn vị đo, tên hình, số lớn nhất → mức số).
   2) Mỗi trò: kiểm tra yêu cầu + lấy mẫu nội dung; dấu hiệu nào chưa học (hoặc số vượt mức) thì không mở trò ở đảo đó.
      Nội dung được nắn theo kiến thức: luật tự tạo cho Câu cá/Bóng bay/Hứng sao/Đập chuột, thẻ ghép lấy từ đảo này rồi
      vài đảo trước, giá tiền/số trên toa/kim đồng hồ/hình trong tranh không vượt điều đã học.
   3) Chọn 2–3 trò mỗi đảo: ưu tiên trò luyện đúng nội dung của đảo, rồi trò đang ít dùng trong lớp (chia đều). */
/* bản gốc (để so sánh trước/sau trong kiểm tra) */
const KT_ORIG={islOpts2,pairDeck,pairFacts,frogQ,scaleRound,trainRound,shopPrice,shopRound,shopNotes,clockTarget,shapeSet,shapeTray};
const KTB=[5,10,20,100,1000,10000,100000,1000000,10000000,1e9];
const ktBucket=n=>KTB.find(b=>b>=n)||1e12;
const KTSH=[['vuong',/hình vuông/i],['cn',/hình chữ nhật/i],['tron',/hình tròn/i],['tamgiac',/hình tam giác|tam giác/i],['binhhanh',/bình hành/i],['thoi',/hình thoi/i],['thang',/hình thang/i],
 ['gvuong',/góc vuông/i],['gnhon',/góc nhọn/i],['gtu',/góc tù/i],['gbet',/góc bẹt/i],['lapphuong',/lập phương/i],['hop',/khối hộp|hộp chữ nhật/i],['tru',/khối trụ/i],['cau',/khối cầu/i]];
const KTUNIT=/(\d)\s*(kg|g|yến|tạ|tấn|mm²|cm²|dm²|km²|m²|mm|cm|dm|km|ml|m|l|°C)(?![\p{L}\d²])/gu;
function ktClean(s){return String(s==null?'':s).replace(/<svg[\s\S]*?<\/svg>/gi,' ').replace(/<span class="frac"><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g,' $1⁄$2 ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&[a-z]+;/g,' ')}
/* dấu hiệu trong một đoạn nội dung (câu hỏi / mẫu trò chơi) */
function ktFeat(raw,opt){const s=ktClean(raw),f=new Set(),mode=opt&&opt.title?'title':opt&&opt.q?'q':'sample';let mx=0;
  if(mode!=='q'){if(/\+/.test(s))f.add('+');
    if(/(\d|\?|☐|…|\.\.\.|\))\s*[−-]\s*(\d|\?|☐|…|\()/.test(s))f.add('-');
    if(/×/.test(s))f.add('×');
    if(/(\d|\?|☐|…|\))\s+:\s+(\d|\?|☐|…|\()/.test(s))f.add(':')}
  if(/⁄/.test(s))f.add('frac');
  if(/\d,\d/.test(s))f.add('dec');
  if(/%/.test(s))f.add('pct');
  if(/[<>]|lớn hơn|bé hơn|nhỏ hơn|lớn nhất|bé nhất|nhỏ nhất|so sánh (các |hai )?số/i.test(s))f.add('cmp');
  if(/nhiều hơn|ít hơn|bằng nhau|nhiều nhất|ít nhất/i.test(s))f.add('more');
  if(/bé đến lớn|lớn đến bé/i.test(s))f.add('order');
  if(/đồng(?!\s*hồ)/i.test(s.replace(/quy đồng|đồng dạng|cánh đồng|đồng ruộng|đồng hồ/gi,'')))f.add('money');
  if(/\d\s*giờ|giờ\s*\d|\d\s*phút/i.test(s)||/đồng hồ|xem giờ/i.test(s))f.add('time');
  if(/\d\s*phút/i.test(s))f.add('minute');
  let m;KTUNIT.lastIndex=0;while((m=KTUNIT.exec(s)))f.add('u:'+m[2]);
  KTSH.forEach(([k,re])=>{if(re.test(s))f.add('sh:'+k)});
  /* số: bỏ số đi với giờ/phút/ngày/tháng/năm; với câu hỏi chỉ lấy số từ đáp án và phương án (chữ trong đề dễ gộp nhầm "100 200") */
  const t=s.replace(/\d+\s*(giờ|phút|giây|ngày|tháng|năm|thế kỉ)/gi,' ').replace(/\d+⁄\d+/g,' ');
  if(mode!=='q')(t.match(/\d{1,3}(?: \d{3})+|\d+/g)||[]).forEach(n=>{const v=+n.replace(/ /g,'');if(v>mx)mx=v});
  if(mode==='title'){/* tên bài: phép tính, đại lượng nói bằng lời */
    if(/phép cộng|\bcộng/i.test(s))f.add('+');if(/phép trừ|\btrừ/i.test(s))f.add('-');if(/phép nhân|\bnhân\b|bảng nhân|thừa số|\btích\b/i.test(s))f.add('×');if(/phép chia|\bchia\b|bảng chia|số bị chia|\bthương\b/i.test(s))f.add(':');
    if(/phân số|một phần/i.test(s))f.add('frac');if(/thập phân/i.test(s)&&!/phân số thập phân/i.test(s))f.add('dec');if(/so sánh (các |hai )?số|so sánh số|lớn hơn|bé hơn|dấu >|dấu </i.test(s))f.add('cmp');if(/thứ tự (từ )?(bé|lớn)|sắp xếp (các )?số|bé đến lớn|lớn đến bé/i.test(s))f.add('order');
    if(/tiền|\bđồng\b/i.test(s.replace(/đồng hồ/gi,'')))f.add('money');if(/đồng hồ|xem giờ|\bgiờ\b/i.test(s))f.add('time');if(/\bphút\b/i.test(s))f.add('minute');
    if(/ki-lô-gam|\bkg\b/i.test(s))f.add('u:kg');if(/\bgam\b/i.test(s))f.add('u:g');if(/xăng-ti-mét|\bcm\b/i.test(s))f.add('u:cm');if(/đề-xi-mét|\bdm\b/i.test(s))f.add('u:dm');if(/\bmét\b|\bm\b/i.test(s))f.add('u:m');if(/lít|\bl\b/i.test(s))f.add('u:l');
    if(/mi-li-mét|\bmm\b/i.test(s))f.add('u:mm');if(/ki-lô-mét|\bkm\b/i.test(s))f.add('u:km');if(/mi-li-lít|\bml\b/i.test(s))f.add('u:ml');if(/\byến\b/i.test(s))f.add('u:yến');if(/\btạ\b/i.test(s))f.add('u:tạ');if(/\btấn\b/i.test(s))f.add('u:tấn')}
  return{f,mx}}
/* dòng kiến thức của một lớp */
const ktOpt=o=>o==null?'':typeof o==='object'?[o.h,o.t,o.v,o.label,o.html].filter(v=>v!=null&&typeof v!=='object').join(' '):String(o);
const ktQText=q=>[q.q,q.sol,(q.opts||[]).map(ktOpt).join(' | '),typeof q.a==='object'?'':q.a].join(' | ');
/* chạy hàm với số ngẫu nhiên cố định (kết quả chia trò luôn như nhau) */
function ktSeeded(seed,fn){const mr=Math.random;let s=(seed>>>0)||1;Math.random=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};try{return fn()}finally{Math.random=mr}}
const KT={};
function ktGrade(G){if(KT[G])return KT[G];return KT[G]=ktSeeded(97+G,()=>ktGrade0(G))}
function ktGrade0(G){const I=(PRIM[G]&&PRIM[G].isl)||[],prev=G>1&&PRIM[G-1]?ktGrade(G-1):null,last=prev&&prev[prev.length-1],acc=new Set(last?last.f:[]);let mx=last?last.mx:0;const out=[];
  const num=v=>{const n=typeof v==='number'?v:typeof v==='string'&&/^\d{1,3}( \d{3})*$|^\d+$/.test(v.trim())?+v.replace(/ /g,''):NaN;if(isFinite(n)&&n>mx)mx=n};
  I.forEach((x,k)=>{const tt=ktFeat(`${x.title} ${x.lesson} ${x.goal}`,{title:1});tt.f.forEach(v=>acc.add(v));mx=Math.max(mx,tt.mx);
    (x.lv||[]).forEach(gs=>gs.forEach(gn=>{for(let i=0;i<5;i++){let q;try{q=gn()}catch(e){continue}if(!q)continue;
      const r=ktFeat(ktQText(q),{q:1});r.f.forEach(v=>acc.add(v));mx=Math.max(mx,r.mx);if(q.type==='num')num(q.a);else if(q.opts&&typeof q.a==='number'){const o=q.opts[q.a];num(o&&typeof o==='object'?o.v:o)}}}));
    out.push({k,id:x.id,f:new Set(acc),mx,max:ktBucket(mx)})});
  return out}
const ktIdx=x=>{const G=xgGr(x);return(PRIM[G]&&PRIM[G].isl.indexOf(x))};
function ktOf(x){const G=xgGr(x),L=ktGrade(G),k=ktIdx(x);return L[k>=0?k:0]||{f:new Set(),max:10,mx:10}}
/* kiểm tra một mẫu nội dung theo kiến thức đã học */
function ktViol(K,raw){const r=ktFeat(raw),v=[];r.f.forEach(t=>{if(t==='order'&&K.f.has('cmp'))return;if(t==='minute'&&!K.f.has('minute')&&K.f.has('time'))v.push(t);else if(t!=='minute'&&!K.f.has(t))v.push(t)});if(r.mx>K.max)v.push('số '+r.mx+'>'+K.max);return v}
let XG_KT=null;   /* kiến thức của đảo đang chơi (để nắn nội dung) */
const ktHas=t=>!XG_KT||XG_KT.f.has(t);
const ktMax=()=>XG_KT?XG_KT.max:1e12;

/* ---------- luật cho Câu cá / Bóng bay / Hứng sao / Đập chuột ---------- */
function ktRuleDerived(K,mode,G){const M=Math.min(K.max,G<=1?10:G===2?100:1000),has=t=>K.f.has(t),rnd=(a,b)=>R(a,b);
  const kinds=[];if(has('+'))kinds.push('sum');if(has('-'))kinds.push('diff');if(has('cmp'))kinds.push('gt','lt');kinds.push('eq');
  const kd=kinds[(mode==='balloon'?1:0)%kinds.length];
  if(kd==='sum'){const r=rnd(Math.min(3,M),Math.min(M,G<=1?10:M));return{rule:`Chọn phép cộng có kết quả <b>bằng ${fN(r)}</b>`,say:`Chọn những phép cộng có kết quả bằng ${r}.`,item:()=>{const s=Math.random()<.45?r:Math.max(1,Math.min(M,r+pick([-2,-1,1,2]))),a=rnd(0,s);return{t:`${fN(a)} + ${fN(s-a)}`,ok:s===r}}}}
  if(kd==='diff'){const r=rnd(0,Math.max(1,Math.min(M-1,G<=1?5:M/2)));return{rule:`Chọn phép trừ có kết quả <b>bằng ${fN(r)}</b>`,say:`Chọn những phép trừ có kết quả bằng ${r}.`,item:()=>{const d=Math.random()<.45?r:Math.max(0,r+pick([-1,1,2])),a=rnd(d,M);return{t:`${fN(a)} − ${fN(a-d)}`,ok:d===r}}}}
  if(kd==='gt'||kd==='lt'){const k=rnd(Math.max(1,Math.floor(M*.3)),Math.max(2,Math.floor(M*.7))),gt=kd==='gt';return{rule:`Chọn số <b>${gt?'lớn':'bé'} hơn ${fN(k)}</b>`,say:`Chọn những số ${gt?'lớn':'bé'} hơn ${k}.`,item:()=>{const v=rnd(0,M);return{t:fN(v),ok:gt?v>k:v<k}}}}
  const k=rnd(1,Math.min(M,10));return{rule:`Chọn số <b>${fN(k)}</b>`,say:`Chọn những số ${k}.`,item:()=>{const v=Math.random()<.42?k:rnd(0,Math.min(M,10));return{t:fN(v),ok:v===k}}}}
function ktRuleCheck(K,fn){for(let i=0;i<3;i++){let r;try{r=fn()}catch(e){return false}if(!r||!r.item)return false;let txt=r.rule+' ';for(let j=0;j<24;j++){try{txt+=' | '+r.item().t}catch(e){return false}}if(ktViol(K,txt).length)return false}return true}
const XG_RULE={};
function ktRule(x,mode){const key=x.id+':'+mode;if(XG_RULE[key])return XG_RULE[key];const G=xgGr(x),K=ktOf(x),src=((x&&x.ti&&MGT[x.ti]&&MGT[x.ti][G])?MGT[x.ti][G]:MG[G])||{};
  const cand=[src[mode],mode==='fish'?src.balloon:src.fish].filter(Boolean);for(const fn of cand)if(ktRuleCheck(K,fn))return XG_RULE[key]={fn,own:1};
  return XG_RULE[key]={fn:()=>ktRuleDerived(K,mode,G),own:0}}
/* Câu cá / Bóng bay trong đảo */
const ktVerb=(t,pre)=>String(t||'').replace(/^Chọn (những )?/,pre);
startMini=function(mode,id){const x=id?isl1(id):null,r0=x?ktRule(x,mode).fn():MG[curG()][mode](),pre=mode==='fish'?'Câu cá mang ':'Bắn bóng mang ',r={...r0,rule:ktVerb(r0.rule,pre),say:ktVerb(r0.say,mode==='fish'?'Câu những con cá mang ':'Bắn những quả bóng mang ')};try{speechSynthesis.cancel()}catch(e){}go({k:'mini',id,mode,rule:r.rule,say:r.say,score:0,lives:3,t:45,end:false,started:false});scr._r=r};
{const _s=startXG;startXG=function(mode,id){const x=isl1(id);XG_KT=x?ktOf(x):null;
  if((mode==='star'||mode==='mole')&&x){const G=xgGr(x),fn=ktRule(x,'fish').fn,useT=!!(x.ti&&MGT[x.ti]&&MGT[x.ti][G]),box=useT?MGT[x.ti]:MG,old=box[G];box[G]={fish:fn,balloon:fn};
    try{const v=_s.apply(this,arguments);if(scr.k==='xg'){scr.rule=ktVerb(scr.rule,mode==='star'?'Hứng sao mang ':'Đập chuột cầm ');scr.say=String(scr.say).replace(/Chọn (những )?/,mode==='star'?'Hứng những ngôi sao mang ':'Đập những chú chuột cầm ');const el=document.querySelector('.mgrule span');if(el)el.innerHTML=scr.rule}return v}finally{box[G]=old}}
  return _s.apply(this,arguments)}}

/* ---------- Lật thẻ / Ếch: câu của đảo này → vài đảo trước → phép tính đã học → đếm chấm ---------- */
function ktPrev(x,n){const G=xgGr(x),I=PRIM[G].isl,k=I.indexOf(x);return I.slice(Math.max(0,k-n),k).reverse()}
function ktFacts(K,G,n){const M=Math.min(K.max,G<=1?10:G===2?100:G===3?1000:10000),ops=['+','-','×',':'].filter(o=>K.f.has(o)),out=[];if(!ops.length)return out;
  for(let i=0;i<80&&out.length<n;i++){const o=pick(ops);let q,a;
    if(o==='+'){const s=R(Math.min(2,M),Math.min(M,G<=1?10:M)),p=R(0,s);q=`${fN(p)} + ${fN(s-p)}`;a=s}
    else if(o==='-'){const s=R(Math.min(2,M),Math.min(M,G<=1?10:M)),p=R(0,s);q=`${fN(s)} − ${fN(p)}`;a=s-p}
    else if(o==='×'){const u=R(2,G<=2?5:9),v=R(2,9);if(u*v>M)continue;q=`${u} × ${v}`;a=u*v}
    else{const u=R(2,G<=2?5:9),v=R(2,9);if(u*v>M)continue;q=`${u*v} : ${u}`;a=v}
    out.push([q,String(fN(a))])}return out}
/* bể cá pixel: số cá = số cần ghép (0 → bể trống, chỉ có bọt nước) */
const ktDots=n=>{n=Math.max(0,Math.min(10,n|0));const fs=Array.from({length:n},(_,i)=>`<i class="xtkf${i%2?' r':''}">${spr('fish',n>5?6:n>3?8:10)}</i>`).join('');
  return`<span class="xtank${n>5?' many':''}" role="img" aria-label="Bể có ${n} con cá"><span class="xtkw">${fs}</span><span class="xtkb"><i></i><i></i></span><span class="xtks"></span></span>`};
pairFacts=function(x,n){const K=ktOf(x);return ktFacts(K,xgGr(x),n)};
pairDeck=function(x){const K=ktOf(x),G=xgGr(x),pairs=[],seenA=new Set(),seenQ=new Set();
  const add=(p,q)=>{if(p&&pairs.length<6&&!seenA.has(p[1])&&!seenQ.has(p[0])&&!ktViol(K,p[0]+' | '+p[1]).length){seenA.add(p[1]);seenQ.add(p[0]);pairs.push({p,q})}};
  [x,...ktPrev(x,4)].forEach(y=>{const pool=islPool(y);for(let i=0;i<70&&pairs.length<6&&pool.length;i++){let q;try{q=mkQ(pick(pool))}catch(e){continue}add(pairFromQ(q),q)}});
  ktFacts(K,G,40).forEach(p=>add(p,null));
  const cards=[];pairs.forEach((o,i)=>{cards.push({id:i,k:'q',t:esc(o.p[0]),q:o.q});cards.push({id:i,k:'a',t:esc(o.p[1]),q:o.q})});
  /* chưa học phép tính: ghép nhóm chấm ↔ số */
  if(pairs.length<6){const M=Math.min(K.max,10),ns=shuf(range(0,M)).filter(v=>!seenA.has(String(v))).slice(0,6-pairs.length);ns.forEach((v,j)=>{const i=pairs.length+j;cards.push({id:i,k:'q',t:ktDots(v),q:null});cards.push({id:i,k:'a',t:String(v),q:null})})}
  return shuf(cards)};
{const _f=frogQ;frogQ=function(x){const K=ktOf(x),G=xgGr(x);
  for(const y of [x,...ktPrev(x,4)]){const pool=islPool(y);for(let i=0;i<50&&pool.length;i++){let q;try{q=mkQ(pick(pool))}catch(e){continue}const f=frogFromQ(q);if(f&&!ktViol(K,f.t+' | '+f.ans+' | '+f.d.join(' | ')).length)return frogMk(f)}}
  for(let i=0;i<20;i++){const [t,a]=ktFacts(K,G,1)[0]||[];if(!t)break;const d=xNear(a).filter(v=>xNum(v)<=K.max);if(d.length>=2)return frogMk({t:esc(t)+' = ?',ans:a,d:d.slice(0,2),q:null})}
  const M=Math.min(K.max,10),n=R(1,M),d=shuf(range(0,M).filter(v=>v!==n)).slice(0,2);return frogMk({t:`Bể có mấy con cá? ${ktDots(n)}`,ans:String(n),d:d.map(String),q:null})}}

/* ---------- Cân / Tàu hoả / Cửa hàng / Đồng hồ / Ghép hình: nắn theo kiến thức ---------- */
{const _s=scaleRound;scaleRound=function(x){const K=ktOf(x);const r=_s.apply(this,arguments);
  if(ktViol(K,r.left).some(v=>['+','-','×',':'].includes(v)))r.left=r.fmt(r.T);return r}}
{const _t=trainRound;trainRound=function(x){const K=ktOf(x),r=_t.apply(this,arguments);
  if(r.kind==='Xếp thứ tự số'&&Math.max(...r.vals)>K.max){const M=K.max,n=Math.min(r.vals.length,M+1),s=new Set();let k=0;while(s.size<n&&k++<300)s.add(R(0,M));const vals=[...s];r.vals=shuf(vals);r.order=[...vals].sort((a,b)=>r.up?a-b:b-a)}return r}}
{const _p=shopPrice;shopPrice=function(G){const M=ktMax();let p=_p.apply(this,arguments);if(p>M){const st=M>=10000?1000:100;p=Math.max(st,Math.floor(R(Math.ceil(M*.3),M)/st)*st)}return p}}
{const _r=shopRound;shopRound=function(G,k,N){let r=_r.apply(this,arguments);for(let i=0;i<6;i++){const need=r.t==='multi'?'+':r.t==='chg'||r.t==='disc'?'-':null;if((!need||ktHas(need))&&(r.t==='pay'||r.total<=ktMax()))break;r={...(_r(G,0,N)),t:'pay'};if(r.t==='pay'&&r.total<=ktMax())break}
  const big=o=>Math.max(o.total||0,o.give||0,...(o.opts||[0]),...o.items.map(i=>i[1]))>ktMax();
  if(big(r)){for(let i=0;i<8&&big(r);i++)r=_r(G,k,N);if(big(r)){const p=shopPrice(G);r={t:'pay',items:[[r.items[0][0],p]],total:p,kind:'Trả tiền mua hàng'}}}return r}}
{const _n=shopNotes;shopNotes=function(G){const v=_n.apply(this,arguments),M=ktMax(),f=v.filter(n=>n<=M);return f.length>=2?f:v.slice(0,2)}}
{const _c=clockTarget;clockTarget=function(G){const r=_c.apply(this,arguments);if(XG_KT&&!XG_KT.f.has('minute'))r.m=0;return r}}
{const _set=shapeSet;shapeSet=function(x){const K=ktOf(x),own=_set.apply(this,arguments).filter(k=>K.f.has('sh:'+k));if(own.length>=3)return own;
  const all=KTSH.map(([k])=>k).filter(k=>K.f.has('sh:'+k)),fam=k=>k[0]==='g'&&k!=='gvuong'||k==='gvuong'?'goc':['lapphuong','hop','tru','cau'].includes(k)?'khoi':'phang';
  const pref=own.length?fam(own[0]):null,more=all.filter(k=>!own.includes(k)&&(!pref||fam(k)===pref));return[...own,...more].slice(0,6)}}
shapeTray=function(g){const sl=g.pics[g.pi].slots[g.si];return shuf([sl.s,...shuf(g.set.filter(k=>k!==sl.s)).slice(0,3)])};

/* ---------- trò nào được mở ở đảo nào ---------- */
function ktSample(x,mode,n){const K=ktOf(x),G=xgGr(x),out=[],prevKT=XG_KT;XG_KT=K;
  try{for(let i=0;i<n;i++){
    if(mode==='fish'||mode==='balloon'||mode==='star'||mode==='mole'){const r=ktRule(x,mode==='balloon'?'balloon':'fish').fn();let t=r.rule;for(let j=0;j<12;j++)t+=' | '+r.item().t;out.push(t)}
    else if(mode==='pair'){out.push(pairDeck(x).map(c=>c.t).join(' | '))}
    else if(mode==='frog'){const q=frogQ(x);out.push(q.t+' | '+q.opts.join(' | '))}
    else if(mode==='race'||mode==='tug'){const pool=islPool(x);if(pool.length){const q=mkQ(pick(pool));out.push(ktQText(q))}}
    else if(mode==='scale'){const r=scaleRound(x);out.push(r.left+' | '+r.tray.map(o=>r.fmt(o.v)).join(' | '))}
    else if(mode==='train'){const r=trainRound(x);out.push(r.vals.map(v=>r.show(v)).join(' | ')+(r.up?' từ bé đến lớn':' từ lớn đến bé'))}
    else if(mode==='shop'){const r=shopRound(G,i,8);out.push(r.items.map(([o,p])=>fN(p)+' đồng').join(' | ')+(r.give?' | '+fN(r.give)+' đồng':'')+(r.opts?' | '+r.opts.map(v=>fN(v)+' đồng').join(' | '):'')+' | '+shopNotes(G).map(v=>fN(v)+' đồng').join(' | '))}
    else if(mode==='clock'){const r=clockTarget(G);out.push(r.m?`${r.h} giờ ${r.m} phút`:`${r.h} giờ`)}
    else if(mode==='shape'){out.push(shapeSet(x).map(k=>XSHN[k]).join(', '))}}}catch(e){out.push('LỖI '+e.message)}
  XG_KT=prevKT;return out}
/* yêu cầu tối thiểu của từng trò */
function ktReq(x,mode){const K=ktOf(x),f=K.f;
  if(mode==='clock')return f.has('time')&&xgTime(x);
  if(mode==='shop')return f.has('money');
  if(mode==='scale')return f.has('+')||[...f].some(t=>/^u:(kg|g|yến|tạ|tấn)$/.test(t));
  if(mode==='train')return f.has('cmp')||f.has('order');
  if(mode==='shape')return shapeSet(x).length>=2;
  if(mode==='race'||mode==='tug')return islPool(x).length>0;
  return true}
const XG_OK={};
function ktAllowed(x,mode){const key=x.id+':'+mode;if(key in XG_OK)return XG_OK[key];let ok=ktReq(x,mode);
  /* Đua giờ, Kéo co: chỉ dùng câu của chính đảo; Lật thẻ, Ếch: đã lọc từng thẻ/câu theo kiến thức khi tạo → không cần lấy mẫu */
  if(ok&&!['race','tug','pair','frog'].includes(mode)){const K=ktOf(x),S=ktSample(x,mode,mode==='clock'||mode==='shape'?6:5);ok=S.every(t=>!/^LỖI/.test(t)&&!ktViol(K,t).length)}
  return XG_OK[key]=ok}
/* trò luyện đúng nội dung của đảo */
function ktOwn(x,mode){if(mode==='clock')return xgTime(x);if(mode==='shape')return xgGeo(x);if(mode==='shop')return xgMoney(x);if(mode==='scale')return xgMass(x)||(xgCalc(x)&&/bằng nhau|tìm số|thành phần/i.test(xgTxt2(x)));
  if(mode==='race'||mode==='tug')return x.tiet>1||/Luyện tập|Ôn tập/i.test(xgTxt2(x));
  if(mode==='pair'){const pool=islPool(x);let n=0;for(let i=0;i<40&&pool.length;i++){try{if(pairFromQ(mkQ(pick(pool))))n++}catch(e){}}return n>=6}
  if(mode==='frog'){const pool=islPool(x);for(let i=0;i<30&&pool.length;i++){try{if(frogFromQ(mkQ(pick(pool))))return true}catch(e){}}return false}
  if(mode==='train')return/so sánh|thứ tự|sắp xếp|xếp|lớn hơn|bé hơn/i.test(xgTxt2(x));
  if(mode==='fish'||mode==='balloon'||mode==='star'||mode==='mole')return!!ktRule(x,'fish').own;
  return false}
const XG_PICK={};
function ktBalance(G){if(XG_PICK[G])return XG_PICK[G];ktGrade(G);return ktSeeded(311+G,()=>ktBalance0(G))}
function ktBalance0(G){const I=(PRIM[G]&&PRIM[G].isl)||[],cnt={},out={};XG_ALL.forEach(o=>cnt[o]=0);
  const order=[...I].sort((a,b)=>xgHash(a.id+'kt')-xgHash(b.id+'kt'));
  order.forEach(x=>{const al=XG_ALL.filter(m=>ktAllowed(x,m)),el=new Set(xgElig(x).E),own=al.filter(m=>ktOwn(x,m)),pick_=[];
    const must=['clock','shape','shop','scale'].filter(m=>al.includes(m)&&ktOwn(x,m));must.slice(0,2).forEach(m=>pick_.push(m));
    const least=c=>c.sort((a,b)=>cnt[a]-cnt[b]||xgHash(a+x.id)-xgHash(b+x.id))[0];
    if(!pick_.some(m=>own.includes(m))){const c=own.filter(m=>!pick_.includes(m));if(c.length)pick_.push(least(c))}
    while(pick_.length<3){let c=al.filter(m=>!pick_.includes(m)&&el.has(m));if(!c.length)c=al.filter(m=>!pick_.includes(m));if(!c.length)break;pick_.push(least(c))}
    pick_.forEach(m=>cnt[m]++);out[x.id]=pick_});
  return XG_PICK[G]=out}
islOpts2=function(x){const G=xgGr(x);if(G>=1&&G<=5){const m=ktBalance(G);if(m[x.id])return m[x.id]}return[]};
/* kiểm tra toàn lớp (dùng trong tools/test/kien-thuc-tro-choi.js) */
function ktAudit(G,n){const I=PRIM[G].isl,rows=[];I.forEach((x,k)=>{const K=ktOf(x);islOpts2(x).forEach(m=>{if(m==='race'||m==='tug'){const bad=islPool(x).filter(([y])=>y!==x);if(bad.length)rows.push({G,k,id:x.id,isl:x.short,ti:x.ti+1,mode:m,v:'câu của đảo khác',sample:''});return}ktSample(x,m,n||12).forEach(t=>{const v=ktViol(K,t);if(v.length)rows.push({G,k,id:x.id,isl:x.short,ti:x.ti+1,mode:m,v:v.join(' '),sample:ktClean(t).slice(0,140)})})})});return rows}
/* số vi phạm của cách làm cũ (chỉ dùng trong kiểm tra) */
function ktAuditBefore(G,n){const NOW={islOpts2,pairDeck,pairFacts,frogQ,scaleRound,trainRound,shopPrice,shopRound,shopNotes,clockTarget,shapeSet,shapeTray},rows=[];
  ({islOpts2,pairDeck,pairFacts,frogQ,scaleRound,trainRound,shopPrice,shopRound,shopNotes,clockTarget,shapeSet,shapeTray}=KT_ORIG);
  try{PRIM[G].isl.forEach((x,k)=>{const K=ktOf(x),src=((x.ti&&MGT[x.ti]&&MGT[x.ti][G])?MGT[x.ti][G]:MG[G])||{};
    islOpts2(x).forEach(m=>{if(m==='race'||m==='tug')return;for(let i=0;i<(n||8);i++){let t='';try{
      if(['fish','balloon','star','mole'].includes(m)){const r=(src[m==='balloon'?'balloon':'fish']||src.fish||src.balloon)();t=r.rule;for(let j=0;j<12;j++)t+=' | '+r.item().t}
      else if(m==='pair')t=pairDeck(x).map(c=>c.t).join(' | ');else if(m==='frog'){const q=frogQ(x);t=q.t+' | '+q.opts.join(' | ')}
      else if(m==='scale'){const r=scaleRound(x);t=r.left+' | '+r.tray.map(o=>r.fmt(o.v)).join(' | ')}else if(m==='train'){const r=trainRound(x);t=r.vals.map(v=>r.show(v)).join(' | ')+' từ bé đến lớn'}
      else if(m==='shop'){const r=shopRound(G,i,8);t=r.items.map(([o,p])=>fN(p)+' đồng').join(' | ')+' | '+shopNotes(G).map(v=>fN(v)+' đồng').join(' | ')}
      else if(m==='clock'){const r=clockTarget(G);t=r.m?`${r.h} giờ ${r.m} phút`:`${r.h} giờ`}else if(m==='shape')t=shapeSet(x).map(k=>XSHN[k]).join(', ')}catch(e){continue}
      const v=ktViol(K,t);if(v.length){rows.push({k,mode:m,v:v.join(' ')});break}}})})}
  finally{({islOpts2,pairDeck,pairFacts,frogQ,scaleRound,trainRound,shopPrice,shopRound,shopNotes,clockTarget,shapeSet,shapeTray}=NOW)}
  return rows}

/* Lời Jenny đọc luật luôn khớp dòng luật trên màn hình (Câu cá, Bóng bay, Hứng sao, Đập chuột) */
function ktSayFromRule(rule){const t=String(rule||'').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').trim();return t?`Em ${t.charAt(0).toLowerCase()+t.slice(1)} nhé.`:''}
{const _m=startMini;startMini=function(mode,id){const v=_m.apply(this,arguments);try{if(scr.k==='mini'&&scr.rule)scr.say=ktSayFromRule(scr.rule)}catch(e){}return v}}
{const _x=startXG;startXG=function(mode,id){const v=_x.apply(this,arguments);try{if(scr.k==='xg'&&(mode==='star'||mode==='mole')&&scr.rule)scr.say=ktSayFromRule(scr.rule)}catch(e){}return v}}

/* Lật thẻ dùng bể cá: đổi lời hướng dẫn cho đúng */
{const _r=render;render=function(){const v=_r.apply(this,arguments);try{if(scr.k==='xg'&&scr.mode==='pair'&&scr.cards&&scr.cards.some(c=>/xtank/.test(c.t))){const sp=document.querySelector('.mgrule span');if(sp)sp.innerHTML='Lật 2 thẻ: ghép <b>bể cá</b> với <b>số con cá</b>';scr.say='Em lật hai thẻ, ghép bể cá với số con cá trong bể nhé.'}}catch(e){}return v}}
