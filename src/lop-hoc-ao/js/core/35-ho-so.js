/* ===================== HỒ SƠ CỦA EM (lớp 1–5) ===================== */
/* Ghi nhận: st.dd[ngày]={n,c,sec} (số câu, câu đúng, số giây), st.sk[dạng bài]={r:[10 kết quả gần nhất 1/0],t,ax},
   st.skm['YYYY-MM']={trục:điểm} (ảnh chụp theo tháng). 6 trục theo Chương trình Toán 2018. Màn "Luyện" theo trục yếu. */
/* 24/10/2026: trục Lời văn thay bằng Logic (Tư duy); bài lời văn tính vào trục nội dung của nó, riêng tỉ lệ đúng bài lời văn vẫn hiện (hsLoiVan) */
import { hooks } from './00-hooks.js';
import { esc, pick, R } from './01-tien-ich.js';
import { hd } from './02-hanh-dong.js';
import { save } from './09-du-lieu-demo.js';
import { evDay, log } from './10-su-kien-mau-xapi.js';
import { go, render, toast } from './13-giao-dien-chung.js';
import { PXS } from './22-do-hoa-pixel-mau-logo-clb.js';
import { OCEAN } from './23b-vung-bien.js';
import { isl1, q1, right1, sayJ } from './30b-may-tieu-hoc.js';
import { PRIM } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { sfx } from './33b-am-thanh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
export const HS_AX=[{k:'so',n:'Số',f:'Số'},{k:'pt',n:'Phép tính',f:'Phép tính'},{k:'lg',n:'Logic',f:'Tư duy – Logic'},
 {k:'hh',n:'Hình học',f:'Hình học'},{k:'dl',n:'Đo lường',f:'Đo lường'},{k:'tk',n:'Thống kê',f:'Thống kê – Xác suất'}];
export const HS_AXN=Object.fromEntries(HS_AX.map(a=>[a.k,a.f]));
/* gắn dạng bài vào trục: luật theo từ khoá (thứ tự quan trọng) */
const HS_RULES=[
 ['lg',/quy luật|nhóm khác|giống nhau|khác nhau|cân thăng bằng|suy luận|logic|tư duy|câu đố/],
 ['tk',/kiểm đếm|số liệu|biểu đồ|thống kê|xác suất|khả năng|chắc chắn|có thể|không thể|phân loại|sự kiện|lặp lại|ghi chép/],
 ['hh',/góc/],
 ['dl',/đo lường|đơn vị đo|đổi đơn vị|^đo |đo độ dài|độ dài|số đo (diện tích|thể tích|thời gian)|viết số đo|mét khối|lít|ước lượng (độ dài|nặng|diện tích|thể tích|dung tích)/],
 ['so',/viết số thành tổng|cấu tạo số|giá trị (của )?chữ số|hàng và lớp|hàng của|làm tròn|đọc, viết|bảng các số|đủ số lượng|số có sáu chữ số/],
 ['hh',/chu vi|diện tích|thể tích|(?<!qua )hình|khối|đoạn thẳng|đường thẳng|đường cong|gấp khúc|điểm|thẳng hàng|tam giác|tứ giác|chữ nhật|đường tròn|tâm|bán kính|đường kính|compa|song song|vuông góc|lập phương|xếp hình|lắp ghép|bên trái|bên phải|trên, dưới|vị trí|trung điểm|mặt phẳng|lưới ô/],
 ['dl',/\bcm\b|\bdm\b|\bmm\b|\bkm\b|\bkg\b|gam|mi-li|mét|xăng-ti|đề-xi|ki-lô|héc|tấn|yến|(^|[\s,])tạ($|[\s,])|cân|nặng|nhẹ|dài hơn|ngắn hơn|cao hơn|thấp hơn|giờ|đồng hồ|phút|giây|ngày|tuần|tháng|lịch|thời gian|thế kỉ|tiền|nhiệt|quãng đường|vận tốc|dung tích|khối lượng|đại lượng|ca 1/],
 ['pt',/cộng|trừ|nhân|chia|phép|tính|tổng|hiệu|tích|thương|số hạng|thừa số|số bị|bảng|biểu thức|nhẩm|gấp|giảm|tách|gộp|thêm|bớt|kết quả|trung bình|thành phần|kém|tìm x|một phần mấy|của một số/],
 ['so',/số|đếm|so sánh|dấu|chục|trăm|nghìn|triệu|phân số|chẵn|lẻ|la mã|dãy|thứ tự|liền|tia|nhiều hơn|ít hơn|bằng nhau|nhóm|thẻ|lớn hơn|bé hơn|lớn nhất|bé nhất|sắp xếp|xếp|tỉ số|phần trăm|thập phân|hỗn số|tỉ lệ/],
];
/* bài lời văn: xếp vào trục nội dung (diện tích → Hình học, kg/thời gian/tiền → Đo lường, phân số/% → Số, còn lại → Phép tính) */
const HS_WORD=/lời văn|bài toán|giải toán|toán có lời|toán chuyển động|hai bước|ba bước/;
const HS_WSUB=[['hh',/diện tích|thể tích|chu vi|hình/],['dl',/\bkg\b|lít|độ dài|cân nặng|khối lượng|thời gian|vận tốc|chuyển động|đo lường|tiền|mua|giảm giá/],
 ['so',/phân số|thập phân|phần trăm|bản đồ|tỉ lệ/],['pt',/thêm|bớt|nhiều hơn|ít hơn|bảng|bước|tổng|hiệu|tỉ số|nhân|chia|cộng|trừ/]];
export const hsWord=kind=>HS_WORD.test(String(kind||'').toLowerCase());
function hsAxOf(kind,topic){const t=String(kind||'').toLowerCase(),p=String(topic||'').toLowerCase();
  if(HS_WORD.test(t)){const r=t.replace(HS_WORD,' ');for(const[k,re]of HS_WSUB)if(re.test(r))return k;if(p)for(const[k,re]of HS_RULES)if(k!=='lg'&&re.test(p))return k;return'pt'}
  for(const[k,re]of HS_RULES)if(re.test(t))return k;
  if(p)for(const[k,re]of HS_RULES)if(re.test(p))return k;return null}
/* ----- Điểm Tư duy – Logic (thầy duyệt 24/10/2026; theo TIMSS, câu "suy luận" nằm rải trong mọi mạch) -----
   A (40%) bài thuần logic (trục lg) · B (40%) bài suy luận ở các mạch khác (vẫn tính vào mạch của nó):
   ① tìm thành phần chưa biết ② bài nhiều bước ③ so sánh kết quả không cần tính hết ④ ước lượng ⑤ câu đúng/sai
   C (20%) thói quen: đúng ngay lần đầu × (1 − tỉ lệ trả lời dưới 3 giây). Phần thiếu dữ liệu thì chia lại trọng số.
   Hiện điểm khi A + B có từ 5 câu. */
const HS_SUY=/còn thiếu|thành phần|tìm số (trong phép|hạng|trừ|bị|chia)|tìm thừa số|tìm số hạng|biểu thức chứa chữ|hai bước|ba bước|tổng và hiệu|tổng và tỉ|hiệu và tỉ|giá trị (của )?biểu thức|so sánh kết quả|ước lượng|đúng\/sai|đúng sai/;
export const hsSuy=kind=>HS_SUY.test(String(kind||'').toLowerCase());
/* Điểm chặt hơn (thầy chốt 24/10/2026): mỗi dạng co về 50% theo số câu đã làm (thêm HS_K câu "nửa đúng"),
   điểm mạch = trung bình các dạng theo số câu; cần ít nhất HS_MIN câu mới có điểm. Mức hiển thị: hsMuc(). */
export const HS_K=2,HS_MIN=10;
const hsKd=e=>{const n=e.r.length,c=e.r.reduce((x,y)=>x+y,0);return(c+HS_K/2)/(n+HS_K)};
const hsGop=ks=>{const n=ks.reduce((a,e)=>a+e.r.length,0);return n?Math.round(ks.reduce((a,e)=>a+hsKd(e)*e.r.length,0)/n*100):0};
const HS_MUC=[[85,'Vững','Strong'],[75,'Tốt','Good'],[60,'Khá','Fair'],[40,'Đang tập','Practising'],[0,'Mới bắt đầu','Starting']];
export function hsMuc(s){const m=HS_MUC.find(x=>s>=x[0]);return typeof LANG!=='undefined'&&LANG==='en'?m[2]:m[1]}
export function hsLogic(st){const E=Object.entries(st.sk||{}).filter(([,e])=>e.r&&e.r.length);
  const part=L=>{const n=L.reduce((a,[,e])=>a+e.r.length,0);return{n,k:L.length,s:L.length?hsGop(L.map(([,e])=>e)):null}};
  const A=part(E.filter(([,e])=>e.ax==='lg')),B=part(E.filter(([k,e])=>e.ax!=='lg'&&hsSuy(k)));
  const T={f:0,fc:0,fast:0,n:0};Object.values(st.dd||{}).forEach(o=>{T.f+=o.f||0;T.fc+=o.fc||0;T.fast+=o.fast||0;T.n+=o.n||0});
  const C={n:T.f,s:T.f>=10?Math.round(T.fc/T.f*100*(1-Math.min(1,T.n?T.fast/T.n:0))):null};
  let w=0,v=0;[[A,.4],[B,.4],[C,.2]].forEach(([x,k])=>{if(x.s!=null&&x.n){w+=k;v+=k*x.s}});
  return{A,B,C,n:A.n+B.n,s:w?Math.round(v/w):0,ok:A.n+B.n>=HS_MIN}}
/* tỉ lệ đúng các bài lời văn (mọi trục) */
export function hsLoiVan(st){const ks=Object.entries(st.sk||{}).filter(([k,e])=>e.r&&e.r.length&&hsWord(k));const n=ks.reduce((a,[,e])=>a+e.r.length,0),c=ks.reduce((a,[,e])=>a+e.r.reduce((x,y)=>x+y,0),0);return{n,c,p:n?Math.round((c+HS_K/2)/(n+HS_K)*100):0,k:ks.length}}
const hsTopicOf=id=>{try{const x=id&&isl1(id);if(!x)return'';for(const g in PRIM){if(PRIM[g].isl.includes(x)){const T=PRIM[g].T[x.ti||0];return T?T[0]:''}}}catch(e){}return''};
/* chỉ mục dạng bài theo lớp: kind → [[đảo, màn, bộ sinh]], trục có dạy */
const HSIDX={};
export function hsIndex(g){if(HSIDX[g])return HSIDX[g];const kinds={},ax=new Set();
  (PRIM[g]?PRIM[g].isl:[]).forEach(x=>{const tp=(PRIM[g].T[x.ti||0]||[''])[0];x.lv.forEach((gens,L)=>gens.forEach((gn,gi)=>{const seen=new Set();for(let k=0;k<2;k++){let q;try{q=gn()}catch(e){continue}const kd=q.kind||'Câu hỏi';if(seen.has(kd))continue;seen.add(kd);const a=hsAxOf(kd,tp);if(!a)continue;ax.add(a);if(hsSuy(kd))ax.add('lg');(kinds[kd]=kinds[kd]||{ax:a,src:[]}).src.push([x.id,L,gi])}}))});
  return HSIDX[g]={kinds,ax}}

/* ----- ngày ----- */
export const HS_OPEN=new Date(2026,8,5),HS_END=new Date(2027,4,31);
export const hsKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const hsDayDate=day=>{const d=new Date(HS_OPEN);d.setDate(d.getDate()+Math.max(1,day||1)-1);return d};
export function hsToday(){return typeof dayNow==='function'?new Date():hsDayDate(S.day)}
export const hsTodayKey=()=>hsKey(hsToday());
/* gắn lại mạch cho dạng bài đã ghi khi luật đổi; bỏ mạch không còn dạng bài nào khỏi ảnh chụp tháng */
const HS_AXV=3;
export function hsAxFix(st){if(!st||!st.sk||st.axv===HS_AXV)return;st.axv=HS_AXV;let doi=false;
  Object.entries(st.sk).forEach(([kd,e])=>{const a=hsAxOf(kd,'');if(a&&a!==e.ax){e.ax=a;doi=true}});if(!doi)return;
  try{const sc=hsScores(st),ms=Object.keys(st.skm||{}).sort(),cuoi=ms[ms.length-1];
    ms.forEach(k=>{const m=st.skm[k];Object.keys(m).forEach(x=>{if(!HS_AXN[x])delete m[x]});HS_AX.forEach(a=>{if(!sc[a.k].ok)delete m[a.k];else if(k===cuoi)m[a.k]=sc[a.k].s})})}catch(e){}}
function hsScFix(st){if(st.scv===2)return;st.scv=2;try{const ms=Object.keys(st.skm||{}).sort(),cuoi=ms[ms.length-1];
  /* tháng cũ không còn đủ dữ liệu để tính lại: hạ tương ứng với cách co điểm mới; tháng gần nhất tính lại từ câu đã làm */
  ms.forEach(k=>{const m=st.skm[k];Object.keys(m).forEach(x=>{m[x]=Math.round(50+(m[x]-50)*.83)})});if(cuoi){const sc=hsScores(st),m=st.skm[cuoi];HS_AX.forEach(a=>{if(sc[a.k].ok)m[a.k]=sc[a.k].s;else delete m[a.k]})}}catch(e){}}
export function hsHeal(st,id){if(!st||st.grade>5)return;if(!st.dd)st.dd={};if(!st.sk)st.sk={};if(!st.skm)st.skm={};hsAxFix(st);hsScFix(st);
  if(!st.ddv){st.ddv=1;try{(S.events||[]).forEach(e=>{if(e.actor.account.name!==id||!e.verb.id.endsWith('answered'))return;const k=hsKey(hsDayDate(evDay(e))),o=st.dd[k]||(st.dd[k]={n:0,c:0,sec:0});o.n++;if(e.result.success)o.c++;o.sec+=Math.min(180,parseInt(String(e.result.duration||'PT0S').slice(2))||0)})}catch(e){}}}
{hooks.on('healAll',_h=>function(){_h.apply(this,arguments);try{Object.entries(S.st||{}).forEach(([id,st])=>hsHeal(st,id))}catch(e){}})}

/* ----- điểm trục ----- */
export function hsScores(st){const g=st.grade<=5?st.grade:1,idx=hsIndex(g),o={};
  HS_AX.forEach(a=>{const ks=Object.values(st.sk||{}).filter(e=>e.ax===a.k&&e.r.length);const n=ks.reduce((s,e)=>s+e.r.length,0);
    const s=hsGop(ks);
    o[a.k]={s,n,ok:n>=HS_MIN,taught:idx.ax.has(a.k)||n>0}});
  try{const L=hsLogic(st);o.lg={s:L.s,n:L.n,ok:L.ok,taught:idx.ax.has('lg')||L.n>0}}catch(e){}return o}
export const hsMonth=d=>hsKey(d).slice(0,7);
export function hsSnap(st){const sc=hsScores(st),m={};HS_AX.forEach(a=>{if(sc[a.k].ok)m[a.k]=sc[a.k].s});st.skm[hsMonth(hsToday())]=m}

/* ----- ghi nhận mỗi câu trả lời ----- */
export function hsRec(...a){return hooks.goi('hsRec',this,a)}
hooks.ham('hsRec',function(q,ok,first,w,islId){const st=S.st[sid];if(!st||st.grade>5)return;hsHeal(st,sid);
  const now=Date.now(),k=hsTodayKey(),o=st.dd[k]||(st.dd[k]={n:0,c:0,sec:0});o.n++;if(ok)o.c++;
  o.sec+=Math.round(Math.min(180,Math.max(0,(now-(scr._la||scr.t0||now))/1000)));scr._la=now;
  if(!first)return;const kd=q.kind||q.label;if(!kd)return;const ax=hsAxOf(kd,hsTopicOf(islId));if(!ax)return;
  const e=st.sk[kd]||(st.sk[kd]={r:[],t:0,ax});for(let i=0;i<w;i++)e.r.push(ok?1:0);if(e.r.length>10)e.r.splice(0,e.r.length-10);e.t=now;e.ax=ax;hsSnap(st)});
{hooks.on('ans1',_a=>function(v){let lz=null;try{const g=scr;if(g&&g.k==='game'&&g.g1&&!g.end&&!g.sheet){const q=q1();if(q){const ok=right1(q,v),first=g.race?true:!g.tries;
    const w=((g.lv===2&&!g.fix&&g.part!==2&&!g.race&&!g.tre)||g.cbo)?2:1;hsRec(q,ok,first,w,(q.src&&q.src[0])||g.id);lz=g.lz||null}}}catch(e){}
  const r=_a.apply(this,arguments);
  if(lz){try{const ev=S.events[S.events.length-1];if(ev&&ev.verb.id.endsWith('answered')){const nm=`Luyện · ${HS_AXN[lz]}`;ev.object.definition.name.vi=nm;ev.object.id='jenny:'+encodeURIComponent(nm)}
    const g=scr;if(g.sheet&&g.sheet.kind==='retry'){const q=q1();g.res[g.j]=false;g.sheet={kind:'bad'};save();render();sayJ(String(q.sol||'').replace(/<[^>]+>/g,' ').replace(/&gt;/g,' lớn hơn ').replace(/&lt;/g,' bé hơn ').replace(/=/g,' bằng '))}}catch(e){}}
  return r})}

/* ----- LUYỆN ----- */
function hsStudied(st){const g=st.grade<=5?st.grade:1;const L=PRIM[g].isl.filter(x=>{const s=st.p1&&st.p1[x.id];return s&&(s.intro||(s.m||[]).some(Boolean))});
  return new Set((L.length?L:PRIM[g].isl.filter(x=>{const s=st.p1&&st.p1[x.id];return s&&(s.fails||[]).some(f=>f>0)})).map(x=>x.id))}
function hsKindAcc(st,kd){const e=st.sk[kd];return e&&e.r.length?e.r.reduce((a,b)=>a+b,0)/e.r.length:-1}
function hsPlan(st){const sc=hsScores(st),E=HS_AX.filter(a=>sc[a.k].taught&&sc[a.k].ok);if(!E.length)return{none:true,sc};
  const best=E.reduce((a,b)=>sc[b.k].s>sc[a.k].s?b:a),weak=E.reduce((a,b)=>sc[b.k].s<sc[a.k].s?b:a);
  if(sc[weak.k].s>=80){const old=Object.entries(st.sk).filter(([,e])=>e.r.length).sort((a,b)=>a[1].t-b[1].t)[0];return{review:true,kind:old?old[0]:null,ax:old?old[1].ax:weak.k,best,weak,sc,E}}
  return{best,weak,ax:weak.k,sc,E}}
export function hsMakeQ(src,kd){const[id,L,gi]=src,x=isl1(id);let q;for(let t=0;t<6;t++){q=x.lv[L][gi]();if(!kd||q.kind===kd)break}return{...q,src:[id,L,gi],key:`${id}:${L}:${gi}`,label:q.kind||'Câu hỏi'}}
function startLuyen(){const st=S.st[sid],g=st.grade<=5?st.grade:1,idx=hsIndex(g),plan=hsPlan(st);if(plan.none){toast('Em chơi thêm các đảo để Jenny biết em giỏi phần nào nhé!');return}
  const SD=hsStudied(st),inS=kd=>idx.kinds[kd].src.filter(s=>SD.has(s[0]));
  const pool=Object.keys(idx.kinds).filter(kd=>inS(kd).length);
  const ax=plan.ax,axPool=pool.filter(kd=>idx.kinds[kd].ax===ax||(ax==='lg'&&hsSuy(kd)));if(!axPool.length){toast('Em hãy học thêm các đảo nhé!');return}
  let weak;if(plan.review&&plan.kind&&axPool.includes(plan.kind))weak=[plan.kind,...axPool.filter(k=>k!==plan.kind).sort((a,b)=>((st.sk[a]||{t:0}).t)-((st.sk[b]||{t:0}).t)).slice(0,1)];
  else weak=axPool.slice().sort((a,b)=>{const A=hsKindAcc(st,a),B=hsKindAcc(st,b);const ka=A<0?.5:A,kb=B<0?.5:B;return ka-kb||((st.sk[a]||{t:0}).t-(st.sk[b]||{t:0}).t)}).slice(0,3);
  const strong=pool.filter(kd=>!weak.includes(kd)&&hsKindAcc(st,kd)>=.8).sort(()=>Math.random()-.5).slice(0,2);
  while(strong.length<2&&pool.length){const kd=pick(pool);strong.push(kd)}
  const qs=[];for(let i=0;i<6;i++){const kd=weak[i%weak.length];qs.push(hsMakeQ(pick(inS(kd)),kd))}
  strong.slice(0,2).forEach(kd=>qs.splice(R(1,qs.length),0,hsMakeQ(pick(inS(kd)),kd)));
  const before=plan.sc[ax].s;v1Said='';
  go({k:'game',g1:1,fix:1,lz:ax,lzb:before,lzok:plan.sc[ax].ok,id:qs[0].src[0],lv:0,qs,j:0,hearts:3,ok:0,tries:0,res:[],sheet:null,picks:[],seq:[],fill:[],used:[],cnt:0,hp:0,fixed:0,t0:Date.now()})}
{hooks.on('endFix1',_e=>function(){if(!scr.lz)return _e.apply(this,arguments);const g=scr,st=S.st[sid];g.end=true;g.pass=true;st.coins+=5;
  const sc=hsScores(st);g.lza=sc[g.lz].s;g.lzaok=sc[g.lz].ok;log(sid,'passed',`Luyện · ${HS_AXN[g.lz]}`,0,{success:true,score:{raw:g.ok,max:g.qs.length}});
  sfx('win');sayJ(g.lza>g.lzb?`Sức mạnh ${HS_AXN[g.lz]} của em tăng lên rồi! Giỏi quá!`:'Em luyện chăm lắm! Jenny rất vui.');save();render()})}
{hooks.on('viewEnd1',_v=>function(){if(!scr.lz)return _v.apply(this,arguments);const g=scr,up=g.lzaok&&g.lza>g.lzb;
  return`<div class="game g1"><div class="gend"><div class="bigicon bossend">${jenny(84,'cheer')}</div><h1>Luyện xong!</h1><p class="muted">${g.ok}/${g.qs.length} câu đúng · +5 xu</p>
   <div class="hs-up${up?' on':''}"><span>${esc(HS_AXN[g.lz])}</span><b>${g.lzok?hsMuc(g.lzb):'–'}</b><span aria-hidden="true">▶</span><b class="hs-new">${g.lzaok?hsMuc(g.lza):'chưa đủ'}</b></div>
   <div class="gendbtn"><button class="gobtn" type="button" data-act="startLuyen">Luyện tiếp</button><button class="gobtn ghost" type="button" data-act="go-home-hoso">Về Hồ sơ</button><button class="gobtn ghost" type="button" data-act="go-home">Bản đồ</button></div></div></div>`})}
{hooks.on('viewGame1',_g=>function(){const h=_g.apply(this,arguments);if(!scr.lz||scr.end)return h;
  return h.replace(`go({k:'home',tab:'fix'})`,`go({k:'home',tab:'hoso'})`).replace('📒 Luyện lỗi',`Luyện · ${esc(HS_AXN[scr.lz])}`).replace('aria-label="Sổ lỗi sai"',`aria-label="Luyện ${esc(HS_AXN[scr.lz])}"`)})}

/* ----- GIAO DIỆN ----- */
PXS.hoso=["..kkkkkk..","kkkyyyykkk","kwwwwwwwwk","kwwwwwwgwk","kwwwwwgwwk","kwgwwgwwwk","kwwggwwwwk","kwrwwwwwwk","kwwwwwwwwk","kkkkkkkkkk"];
const HS_LV=[['#E3E7F0','#C3CBDD'],['#7FD3F0','#12B5E8'],['#12B5E8','#0079C1'],['#0079C1','#1F2A5A'],['#1F2A5A','#1F2A5A']];
const hsLvl=n=>!n?0:n<10?1:n<25?2:n<50?3:4;
export const HS_TH=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
export function hsStreaks(st){const dd=st.dd||{},t=hsToday(),has=d=>(dd[hsKey(d)]||{}).n>0;let cur=0;const d=new Date(t);if(!has(d))d.setDate(d.getDate()-1);while(has(d)&&d>=HS_OPEN){cur++;d.setDate(d.getDate()-1)}
  const ks=Object.keys(dd).filter(k=>dd[k].n>0).sort();let best=0,run=0,prev=null;ks.forEach(k=>{const dt=new Date(k+'T00:00:00');if(prev&&Math.round((dt-prev)/864e5)===1)run++;else run=1;best=Math.max(best,run);prev=dt});
  return{cur,best,days:ks.length,n:ks.reduce((s,k)=>s+dd[k].n,0)}}
function hsDetail(k,o){const d=new Date(k+'T00:00:00');const day=`${HS_TH[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`;return o&&o.n?`${day}: ${o.n} câu · đúng ${o.c} · ${Math.max(1,Math.round(o.sec/60))} phút`:`${day}: em chưa làm bài`}
function hsHeat(st){const dd=st.dd||{},today=hsKey(hsToday()),s=new Date(HS_OPEN);s.setDate(s.getDate()-((s.getDay()+6)%7));
  const e=new Date(HS_END);e.setDate(e.getDate()+(7-((e.getDay()+6)%7))-1);let cells='',mo='',c=0,lastM=-1,todayCol=0;
  for(const d=new Date(s);d<=e;c++){for(let r=0;r<7;r++,d.setDate(d.getDate()+1)){const k=hsKey(d);
      if(d.getDate()===1||(c===0&&r===0)){const m=c===0?new Date(d.getFullYear(),d.getMonth(),d.getDate()+6).getMonth():d.getMonth();if(m!==lastM){mo+=`<span style="left:${c*16}px">Th${m+1}</span>`;lastM=m}}
      if(d<HS_OPEN){cells+='<i class="hs-x"></i>';continue}
      const fut=k>today,o=dd[k],lv=fut?-1:hsLvl(o&&o.n);if(k===today)todayCol=c;
      cells+=`<i data-k="${k}" class="${fut?'hs-f':''}${k===today?' hs-t':''}"${lv>=0?` style="background:${HS_LV[lv][0]};border-color:${HS_LV[lv][1]}"`:''}></i>`}}
  return{cells,mo,cols:c,todayCol}}
function hsTap(ev){const i=ev.target.closest('i[data-k]');if(!i)return;const st=S.st[sid],k=i.dataset.k;const el=document.getElementById('hsDet');if(el)el.textContent=hsDetail(k,(st.dd||{})[k]);
  document.querySelectorAll('.hs-hm i.hs-sel').forEach(x=>x.classList.remove('hs-sel'));i.classList.add('hs-sel')}
export function viewHoSo(st){hsHeal(st,sid);const g=st.grade,sk=hsStreaks(st),H=hsHeat(st),sc=hsScores(st),plan=hsPlan(st),tk=hsTodayKey();
  const kpi=[['Chuỗi',sk.cur+' ngày','#F37A1F'],['Dài nhất',sk.best,'#F04A1B'],['Ngày học',sk.days,'#2AB563'],['Số câu',sk.n,'#0079C1']];
  let tip,btn;if(plan.none){tip='Em chơi thêm các đảo nhé! Khi đủ bài, Jenny sẽ vẽ Sức mạnh Toán cho em.';btn=`<button class="hs-go" type="button" data-act="go-home">Bản đồ ▶</button>`}
  else{if(plan.review)tip=`Em làm tốt hết rồi! Mình ôn lại ${plan.kind?`dạng <b>${esc(plan.kind)}</b>`:'bài cũ'} nhé.`;
    else if(plan.E.length===1||plan.best.k===plan.weak.k)tip=`Mình luyện thêm <b>${esc(plan.weak.f)}</b> cho thật vững nhé.`;
    else tip=`Em giỏi <b>${esc(plan.best.f)}</b> lắm! Mình luyện thêm <b>${esc(plan.weak.f)}</b> nhé.`;
    btn=`<button class="hs-go" type="button" data-act="startLuyen">Luyện ▶</button>`}
  const months=Object.keys(st.skm||{}).sort(),cm=hsMonth(hsToday()),prev=months.filter(m=>m<cm).pop();
  return`<div class="hs" data-act="khong">
   <div class="hs-head">${jenny(52,'happy')}<div><h1 class="hs-h1">Hồ sơ của em</h1><div class="hs-sub">${esc(st.name)} · Lớp ${g}${typeof OCEAN!=='undefined'&&OCEAN[g]?' · '+esc(OCEAN[g][0]):''}</div></div></div>
   <div class="hs-kpi">${kpi.map(([a,b,c])=>`<div class="hs-pf" style="--hc:${c}"><span>${a}</span><b>${b}</b></div>`).join('')}</div>
   <section class="hs-pf hs-box"><h2 class="hs-h2">Chuỗi ngày chăm chỉ</h2><div class="hs-note">Năm học 2026–2027 · mỗi ô là 1 ngày em vào làm bài</div>
    <div class="hs-scroll" id="hsScroll" data-col="${H.todayCol}"><div class="hs-mo" style="width:${H.cols*16}px">${H.mo}</div>
     <div class="hs-row"><div class="hs-wd"><span>T2</span><span></span><span>T4</span><span></span><span>T6</span><span></span><span>CN</span></div><div class="hs-hm" data-act="hsTap">${H.cells}</div></div></div>
    <div class="hs-lg">Ít ${HS_LV.map(c=>`<i style="background:${c[0]};border-color:${c[1]}"></i>`).join('')} Nhiều <span class="hs-lt"><i class="hs-t"></i> Hôm nay</span></div>
    <div class="hs-pf hs-det" id="hsDet" aria-live="polite">${hsDetail(tk,(st.dd||{})[tk])}</div></section>
   <section class="hs-pf hs-box"><h2 class="hs-h2">Sức mạnh Toán</h2>
    <div class="hs-rd"><canvas id="hsRadar" width="100" height="84" data-sc='${JSON.stringify(Object.fromEntries(HS_AX.map(a=>[a.k,[sc[a.k].s,sc[a.k].ok?1:0,sc[a.k].taught?1:0]])))}' data-prev='${prev?JSON.stringify(st.skm[prev]):''}' role="img" aria-label="Sức mạnh Toán: ${HS_AX.map(a=>`${a.f} ${!sc[a.k].taught?'chưa học':sc[a.k].ok?hsMuc(sc[a.k].s):'chưa đủ'}`).join(', ')}"></canvas>
     ${HS_AX.map((a,i)=>{const s=sc[a.k],dim=!s.taught||!s.ok;return`<span class="hs-lb${dim?' dim':''}" data-i="${i}">${a.n}<br><b>${!s.taught?'chưa học':s.ok?hsMuc(s.s):'chưa đủ'}</b></span>`}).join('')}</div>
    <div class="hs-leg"><span><i class="a"></i> Tháng này</span>${prev?`<span><i class="b"></i> Tháng ${Number(prev.slice(5))}</span>`:''}</div></section>
   <div class="hs-pf hs-tip">${jenny(40,'idle')}<div>${tip}</div>${btn}</div></div>`}
function hsDrawRadar(){const cv=document.getElementById('hsRadar');if(!cv)return;const D=JSON.parse(cv.dataset.sc),P=cv.dataset.prev?JSON.parse(cv.dataset.prev):null;
  const x=cv.getContext('2d'),cx=50,cy=42,R=36;x.clearRect(0,0,100,84);const pt=(i,v)=>{const a=-Math.PI/2+i*Math.PI/3;return[cx+Math.cos(a)*R*v/100,cy+Math.sin(a)*R*v/100*.95]};
  const line=(a,b,c,dot)=>{let[x0,y0]=a.map(Math.round),[x1,y1]=b.map(Math.round);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy,n=0;x.fillStyle=c;for(;;){if(!dot||n++%2===0)x.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}};
  const v=HS_AX.map(a=>D[a.k][1]?D[a.k][0]:0);
  if(v.some(Boolean)){x.beginPath();v.forEach((s,i)=>{const[p,q]=pt(i,Math.max(s,2));i?x.lineTo(p,q):x.moveTo(p,q)});x.closePath();x.fillStyle='#000';x.fill();
    const id=x.getImageData(0,0,100,84),d=id.data;for(let k=0;k<d.length;k+=4){const on=d[k+3]>110;d[k+3]=on?255:0;if(on){d[k]=127;d[k+1]=211;d[k+2]=240}}x.putImageData(id,0,0)}
  [100,66,33].forEach((s,j)=>{for(let i=0;i<6;i++)line(pt(i,s),pt((i+1)%6,s),j?'#C3CBDD':'#9AA4C0')});
  for(let i=0;i<6;i++)line([cx,cy],pt(i,100),'#C3CBDD');
  if(P){const pv=HS_AX.map(a=>P[a.k]||0);for(let i=0;i<6;i++)line(pt(i,pv[i]),pt((i+1)%6,pv[(i+1)%6]),'#9AA4C0',1)}
  if(v.some(Boolean)){for(let i=0;i<6;i++)line(pt(i,v[i]),pt((i+1)%6,v[(i+1)%6]),'#0079C1');
    v.forEach((s,i)=>{if(!D[HS_AX[i].k][1])return;const[p,q]=pt(i,s);x.fillStyle='#1F2A5A';x.fillRect(Math.round(p)-1,Math.round(q)-1,3,3);x.fillStyle='#FCD655';x.fillRect(Math.round(p),Math.round(q),1,1)})}
  const box=cv.parentNode,W=box.clientWidth,sc=Math.min(2.2,(W-120)/100);cv.style.width=100*sc+'px';cv.style.height=84*sc+'px';cv.style.left=(W-100*sc)/2+'px';cv.style.top='30px';box.style.height=(84*sc+64)+'px';
  box.querySelectorAll('.hs-lb').forEach(l=>{const[p,q]=pt(+l.dataset.i,128);l.style.left=((W-100*sc)/2+p*sc)+'px';l.style.top=(30+q*sc)+'px'})}
function hsAfter(){if(!document.querySelector('.hs'))return;hsDrawRadar();const s=document.getElementById('hsScroll');if(s&&!s.dataset.done){s.dataset.done=1;s.scrollLeft=Math.max(0,(+s.dataset.col)*16-s.clientWidth+80)}}
{hooks.on('render',_r=>function(){const a=_r.apply(this,arguments);try{hsAfter()}catch(e){}return a})}
try{addEventListener('resize',()=>{try{hsDrawRadar()}catch(e){}})}catch(e){}

/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */
hd.dangKy({
  'khong':function(){},
  'startLuyen':function(){startLuyen()},
  'go-home-hoso':function(){go({k:'home',tab:'hoso'})},
  'hsTap':function(event){hsTap(event)},
});
