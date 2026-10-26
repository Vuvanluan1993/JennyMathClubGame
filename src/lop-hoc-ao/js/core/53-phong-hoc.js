/* 53 — Phòng học của em (thầy yêu cầu 23/10/2026)
   Nhà em › khung "Phòng học của em" (dưới khung Nhà, trên Tủ đồ) gồm 3 ô: Bài cô giao · Luyện lỗi · Tự luyện.
   Luyện lỗi bỏ khỏi thanh dưới, chỉ vào từ Phòng học (số lỗi vẫn báo trên nút Nhà em).
   Bài cô giao = PHIẾU BÀI TÁCH RIÊNG khỏi đảo (thầy chọn hướng 1, 23/10/2026):
   - Cô chọn 1 hay nhiều tiết + số câu + hạn. S.asg=[{id,g,tiets:[islId],n,t,due,by}]. Câu lấy từ kho câu của các tiết đó.
   - Mỗi em cùng dạng câu nhưng số khác nhau: đề sinh lại được từ "seed" (Math.random tạm thay bằng bộ sinh số theo seed).
   - Làm kiểu vở bài tập: không tim, không trùm, không xu từng câu, không báo đúng/sai từng câu; "Để sau" để quay lại; "Nộp bài".
     Đang làm dở thoát ra vẫn giữ (st.asgR[id].cur).
   - Nộp xong mới xem điểm, đúng/sai từng câu, đáp án. Câu sai vào Sổ lỗi (không bắt luyện ngay). Nộp lần đầu +10 xu.
   - KHÔNG cộng sao, KHÔNG mở đảo, KHÔNG đổi tiến độ đảo.
   - Lưu: st.asgR[id]={seen,tries,first,best,last,cur}; mỗi lần nộp {seed,ok,n,t,ans:[{ok,key,label}]}.
   - Danh sách: "Cần làm" (mới giao lên đầu, nhãn Mới/Chưa làm/Đang làm/Quá hạn) và "Đã nộp" (điểm, lần đầu, số lần).
   - Cô xem: điểm từng em (kèm lần đầu) và các dạng câu cả lớp sai nhiều. */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { gvCLS, gvTen, save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { go, render, shortTitle, toast } from './13-giao-dien-chung.js';
import { mist } from './21-lop-6-che-do-tro-choi.js';
import { PXS, ring, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { isl1, q1, right1, show1 } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { mist1Add, PRIM } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { sfx } from './33b-am-thanh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { I18N } from './47-ngon-ngu-vi-en.js';
import { trQ } from './48-dich-tieng-anh.js';
import { NHA_TABS } from './49b-dao-nha-thu-cung.js';
import { arcEN, arcT } from './51-kho-game.js';
import { gvNow } from './59-ho-so-giao-vien.js';
PXS.classS=["nnnnnnnnnnnn","nGGGGGGGGGGn","nGwGGwwwGGGn","nwwwGGGwGGGn","nGwGGGwGGwGn","nGGGGwwwGGGn","nGGGGGGGGGGn","nnnnnnnnnnnn",".N........N.","N..........N"];
PXS.asgS=["..kkkkkk..","kkkaaaakkk","kwwwwwwwwk","kwggwbbbwk","kwggwwwwwk","kwwwwwwwwk","kwrrwbbbwk","kwrrwwwwwk","kwwwwwwwwk","kkkkkkkkkk"];
PXS.selfS=ring(12,d=>d>5.6?null:d>4.8?'k':d>3.6?'r':d>2.4?'w':d>1.2?'r':'a');
export const DAYMS=864e5,PH_XU=10;
export const asgAll=()=>S.asg||(S.asg=[]);
export function asgR(st){return st.asgR||(st.asgR={})}
function asgOk(a){return a.tiets&&a.tiets.some(id=>isl1(id))}
export function asgMine(...a){return hooks.goi('asgMine',this,a)}
hooks.ham('asgMine',function(st){if(!st||st.grade>5)return[];return asgAll().filter(a=>a.g===st.grade&&asgOk(a))});
export function asgState(...a){return hooks.goi('asgState',this,a)}
hooks.ham('asgState',function(st,a){const r=asgR(st)[a.id]||{};const done=!!r.best;return{r,done,doing:!done&&!!r.cur,late:!done&&a.due&&Date.now()>a.due,neu:!r.seen&&!r.cur&&!done}});
export function asgTodo(st){return asgMine(st).filter(a=>!asgState(st,a).done).length}
export const asgD=t=>{const d=new Date(t);return`${d.getDate()}/${d.getMonth()+1}`};
export const asgName=a=>{if(a.ten)return a.ten;const L=a.tiets.map(isl1).filter(Boolean);const t=L.map(x=>shortTitle(x.title));return t.length>2?`${t[0]} … ${t[t.length-1]} (${t.length} ${arcT('tiết','lessons')})`:t.join(' + ')};
const asgGoal=a=>{const L=a.tiets.map(isl1).filter(Boolean);return L.length===1?(L[0].goal||L[0].lesson||''):[...new Set(L.map(x=>x.lesson))].join(' · ')};
/* dữ liệu mẫu: mỗi lớp 1–5 có 2 phiếu */
export function asgSeed(...a){return hooks.goi('asgSeed',this,a)}
hooks.ham('asgSeed',function(){if((S.asgSeed||0)>=2)return;S.asgSeed=2;const now=Date.now();
 S.asg=asgAll().filter(a=>a.tiets).concat(asgAll().filter(a=>!a.tiets&&!/^a\dx\d$/.test(a.id)).map(a=>({id:a.id,g:a.g,tiets:[a.isl],n:a.g<=2?5:8,t:a.t,due:a.due,by:a.by})));
 Object.values(S.st||{}).forEach(st=>{if(st.asgR)Object.keys(st.asgR).forEach(k=>{if(/^a\dx\d$/.test(k)||!(st.asgR[k].best||st.asgR[k].cur)||(st.asgR[k].best&&st.asgR[k].best.pass!==undefined))delete st.asgR[k]})});
 [1,2,3,4,5].forEach(g=>{const L=(PRIM[g]||{isl:[]}).isl;if(L.length<3)return;const n=g<=2?6:10;
  asgAll().push({id:`p${g}x1`,g,tiets:[L[0].id,L[1].id],n,t:now-3*DAYMS,due:now-DAYMS,by:'Cô Jenny'},{id:`p${g}x2`,g,tiets:[L[2].id],n,t:now-3600e3,due:now+2*DAYMS,by:'Cô Jenny'})});
 try{save()}catch(e){}});
/* sinh đề theo seed */
export function seedRnd(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
export function phQs(...a){return hooks.goi('phQs',this,a)}
hooks.ham('phQs',function(a,seed){const mr=Math.random;Math.random=seedRnd(seed);const qs=[];
 try{const L=a.tiets.map(isl1).filter(Boolean);for(let k=0;k<a.n;k++){const x=L[k%L.length],lvs=x.lv.length>2?[0,1]:x.lv.map((_,i)=>i),lv=lvs[Math.floor(Math.random()*lvs.length)],gens=x.lv[lv],gi=Math.floor(Math.random()*gens.length);let q;try{q=gens[gi]()}catch(e){q=null}
  if(!q){k--;if(qs.length>a.n*3)break;continue}qs.push({...q,src:[x.id,lv,gi],key:`${x.id}:${lv}:${gi}`,label:q.kind||'Câu hỏi'})}}
 finally{Math.random=mr}
 return qs.map(q=>typeof trQ==='function'&&arcEN()?trQ(q):q)});
function phBlank(g){Object.assign(g,{sheet:null,tries:0,inp:'',picks:[],seq:[],fill:[],used:[],cnt:0,hit:false,mad:0,t0:Date.now()})}
/* mở phiếu (tiếp tục nếu đang làm dở) */
function asgGo(...a){return hooks.goi('asgGo',this,a)}
hooks.ham('asgGo',function(aid){const st=S.st[sid],a=asgAll().find(x=>x.id===aid);if(!a)return;const r=asgR(st)[aid]||(asgR(st)[aid]={});r.seen=1;
 if(!r.cur)r.cur={seed:(Math.random()*2**31)|0,ans:[]};save();try{speechSynthesis.cancel()}catch(e){}
 const qs=phQs(a,r.cur.seed);const ans=r.cur.ans.slice();while(ans.length<qs.length)ans.push(null);const j=Math.max(0,ans.findIndex(x=>!x));
 v1Said='';const g0={k:'game',g1:1,ph:aid,id:qs[0].src[0],lv:0,qs,ans,j,hearts:3,ok:0,res:[],hp:0};phBlank(g0);go(g0);phBlank(scr);render()});
function phNext(){const g=scr,n=g.qs.length;for(let d=1;d<=n;d++){const k=(g.j+d)%n;if(!g.ans[k]){g.j=k;phBlank(g);return true}}return false}
function phLater(){if(!phNext())toast(arcT('Đây là câu cuối còn lại.','This is the last one left.'));sfx('tap');render()}
function phSubmitAsk(){const g=scr,left=g.ans.filter(x=>!x).length;g.sheet={kind:left?'phask':'phall',left};render()}
function phSubmit(...a){return hooks.goi('phSubmit',this,a)}
hooks.ham('phSubmit',function(){const g=scr,st=S.st[sid],a=asgAll().find(x=>x.id===g.ph),r=asgR(st)[g.ph];if(!a||!r)return;
 const ans=g.qs.map((q,k)=>g.ans[k]?{ok:g.ans[k].ok,key:q.key,label:q.label}:{ok:false,skip:1,key:q.key,label:q.label});
 const res={seed:r.cur.seed,ok:ans.filter(x=>x.ok).length,n:ans.length,t:Date.now(),ans,v:g.ans.map(x=>x?x.v:null)};
 r.tries=(r.tries||0)+1;if(!r.first){r.first=res;st.coins+=PH_XU;res.xu=PH_XU}r.last=res;if(!r.best||res.ok/res.n>r.best.ok/r.best.n)r.best=res;delete r.cur;
 log(sid,'completed',`Phiếu bài · ${asgName(a)}`,0,{success:true,score:{raw:res.ok,max:res.n}});sfx(res.ok/res.n>=.8?'win':'ok');save();
 go({k:'home',tab:'baikq',aid:a.id});render()});
/* trả lời trong phiếu: ghi lại, không báo đúng/sai, sang câu chưa làm */
{hooks.on('ans1',_a=>function(v){const g=scr;if(!(g&&g.ph))return _a.apply(this,arguments);if(g.sheet)return;
 const q=q1(),ok=right1(q,v),st=S.st[sid];g.ans[g.j]={ok,v:typeof v==='object'?JSON.stringify(v):v};
 if(!ok){try{mist1Add(q);st.gate=(st.gate||[]).filter(k=>k!==q.key)}catch(e){}}
 log(sid,'answered',`Phiếu bài · ${q.label}`,0,{success:ok});const r=asgR(st)[g.ph];if(r&&r.cur)r.cur.ans=g.ans.slice();save();sfx('tap');
 if(!phNext())g.sheet={kind:'phall',left:0};render()})}
{hooks.on('sheet1',_s=>function(){const g=scr,s=g.sheet;if(!(g&&g.ph&&s&&/^ph/.test(s.kind)))return _s.apply(this,arguments);
 if(s.kind==='phall')return`<div class="sheet ok"><div class="sh"><span class="ic">✓</span><div><b>${arcT(`Em đã làm hết ${g.qs.length} câu`,`You answered all ${g.qs.length}`)}</b><div>${arcT('Bấm Nộp bài để xem kết quả.','Hand in to see your score.')}</div></div></div><button class="gobtn" type="button" onclick="phSubmit()">${arcT('Nộp bài','Hand in')}</button></div>`;
 return`<div class="sheet warn"><div class="sh"><span class="ic">?</span><div><b>${arcT(`Còn ${s.left} câu chưa làm`,`${s.left} not answered`)}</b><div>${arcT('Câu chưa làm tính là sai. Em vẫn nộp chứ?','Unanswered count as wrong. Hand in anyway?')}</div></div></div><div class="phask"><button class="gobtn ghost" type="button" onclick="scr.sheet=null;render()">${arcT('Làm tiếp','Keep going')}</button><button class="gobtn" type="button" onclick="phSubmit()">${arcT('Vẫn nộp','Hand in')}</button></div></div>`})}
{hooks.on('viewGame1',_v=>function(){const g=scr;if(!(g&&g.ph))return _v.apply(this,arguments);let h=_v.apply(this,arguments);
 const done=g.ans.filter(Boolean).length,n=g.qs.length;
 const planks=`<div class="planks phpl" aria-label="${arcT(`Đã làm ${done}/${n} câu`,`${done}/${n} answered`)}">${g.qs.map((_,k)=>`<i class="${k===g.j?'cur':g.ans[k]?'phd':''}"></i>`).join('')}</div>`;
 h=h.replace(/<div class="planks"[^>]*>(?:<i[^>]*><\/i>)*<\/div>/,planks)
  .replace(/<span class="hearts"[^>]*>(?:<span[^>]*>❤<\/span>)*<\/span>/,`<span class="pill acc phpill">${spr('asgS',16)} ${arcT('Câu','Q')} ${g.j+1}/${n}</span>`)
  .replace(/<button class="gx" onclick="[^"]*"/,`<button class="gx" onclick="try{speechSynthesis.cancel()}catch(e){};go({k:'home',tab:'bai'})"`);
 if(!g.sheet){const i=h.lastIndexOf('</div></div>');if(i>0)h=h.slice(0,i)+`<div class="phbar"><button type="button" class="btn sm ghost" onclick="phLater()">${arcT('Để sau','Skip for now')}</button><span class="grow">${arcT(`Đã làm ${done}/${n}`,`${done}/${n} done`)}</span><button type="button" class="btn sm pri" onclick="phSubmitAsk()">${arcT('Nộp bài','Hand in')}</button></div>`+h.slice(i)}
 return h})}
/* trang Bài cô giao */
function asgRow(st,a){const S0=asgState(st,a),r=S0.r,b=r.best,pct=b?b.ok/b.n:0;
 const tag=S0.done?`<i class="pgtag ok">${arcT('Đã nộp','Handed in')}</i>`:S0.doing?`<i class="pgtag mid">${arcT('Đang làm','In progress')} ${r.cur.ans.filter(Boolean).length}/${a.n}</i>`:`<i class="pgtag no">${arcT('Chưa làm','To do')}</i>`;
 const res=b?`<span class="pgres">${arcT('Điểm','Score')}: <b class="${pct>=.8?'pgg':pct>=.5?'pgm':'pgb'}">${b.ok}/${b.n}</b> · ${r.tries} ${arcT('lần nộp','hand-ins')}${r.tries>1?` · ${arcT('lần đầu','first')} ${r.first.ok}/${r.first.n}`:''}</span>`:'';
 return`<div class="pgrow ${S0.done?'done':''}"><div class="grow"><div class="pgtags">${S0.neu?`<i class="pgtag new">${arcT('Mới','New')}</i>`:''}${tag}${S0.late?`<i class="pgtag late">${arcT('Quá hạn','Late')}</i>`:''}</div>
  <b class="pgt">${esc(asgName(a))} · ${a.n} ${arcT('câu','questions')}</b><span class="pggoal">${esc(asgGoal(a))}</span>
  <small>${esc(a.by||'Cô')} ${arcT('giao','set')} ${asgD(a.t)}${a.due?` · ${arcT('hạn','due')} ${asgD(a.due)}`:''}${b?` · ${arcT('nộp','handed in')} ${asgD(r.last.t)}`:''}</small>${res}</div>
  <div class="pgbtns">${S0.done?`<button type="button" class="btn sm pgbtn" onclick="go({k:'home',tab:'baikq',aid:'${a.id}'})">${arcT('Xem bài','Review')}</button>`:''}<button type="button" class="btn sm ${S0.done?'ghost':'pri'} pgbtn" onclick="asgGo('${a.id}')">${S0.done?arcT('Làm lại','Redo'):S0.doing?arcT('Làm tiếp','Continue'):arcT('Làm bài','Start')}</button></div></div>`}
function viewAsg(st){const L=asgMine(st),todo=L.filter(a=>!asgState(st,a).done).sort((p,q)=>q.t-p.t),done=L.filter(a=>asgState(st,a).done).sort((p,q)=>asgR(st)[q.id].last.t-asgR(st)[p.id].last.t);
 const page=`<div class="page pgpage"><div class="crumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'nha'})">← ${arcT('Phòng học','Study room')}</button></div>
 <section class="card"><h2 class="nhah">${spr('asgS',24)} ${arcT('Bài cô giao','Homework')}</h2>
  <h3 class="ghgh">${arcT('Cần làm','To do')} (${todo.length})</h3>${todo.length?todo.map(a=>asgRow(st,a)).join(''):`<p class="muted">${arcT('Em đã làm hết bài cô giao. Giỏi lắm!','All homework done. Well done!')}</p>`}
  <h3 class="ghgh">${arcT('Đã nộp','Handed in')} (${done.length})</h3>${done.length?done.map(a=>asgRow(st,a)).join(''):`<p class="muted">${arcT('Chưa có bài nào nộp.','Nothing handed in yet.')}</p>`}
  <p class="muted" style="font-size:13px;margin:12px 0 0">${arcT(`Phiếu bài làm như vở bài tập: không mất tim, nộp xong mới xem điểm. Nộp lần đầu được +${PH_XU} xu. Làm lại thì số mới; cô vẫn xem cả lần đầu.`,`Homework works like a workbook: no hearts, see your score after handing in. First hand-in: +${PH_XU} coins. Redo gives new numbers; your teacher still sees your first try.`)}</p></section></div>`;
 L.forEach(a=>{const r=asgR(st)[a.id]||(asgR(st)[a.id]={});r.seen=1});save();return page}
/* trang kết quả / xem lại bài đã nộp */
function viewAsgKQ(st){const a=asgAll().find(x=>x.id===scr.aid),r=a&&asgR(st)[a.id];if(!a||!r||!r.last)return viewAsg(st);const L=r.last,qs=phQs(a,L.seed),pct=L.ok/L.n;
 const msg=pct>=.9?arcT('Xuất sắc!','Excellent!'):pct>=.7?arcT('Làm tốt lắm!','Well done!'):pct>=.5?arcT('Khá rồi, cố thêm chút nhé!','Good, keep going!'):arcT('Mình xem lại các câu sai nhé!','Let’s look at the mistakes.');
 const rows=qs.map((q,k)=>{const x=L.ans[k]||{};return`<div class="kqrow ${x.ok?'ok':'bad'}"><span class="kqn">${k+1}</span><div class="grow"><div class="kqq">${q.q}</div>${q.pic?`<div class="kqpic">${q.pic}</div>`:''}${x.ok?`<small class="kqok">✓ ${arcT('Đúng','Correct')}</small>`:`<small class="kqbad">${x.skip?arcT('✕ Chưa làm','✕ Not answered'):arcT('✕ Chưa đúng','✕ Not correct')}${q.type==='opt'&&/</.test(q.opts[q.a].h)?` · ${arcT('Đáp án','Answer')}:</small><div class="kqpic kqans">${q.opts[q.a].h}</div><small>`:show1(q)!==''?` · ${arcT('Đáp án','Answer')}: <b>${show1(q)}</b>`:''}</small><div class="kqsol">${q.sol||''}</div>`}</div></div>`}).join('');
 return`<div class="page pgpage"><div class="crumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'bai'})">← ${arcT('Bài cô giao','Homework')}</button></div>
 <section class="card kqtop"><div class="kqhd">${jenny(64,pct>=.7?'happy':'')}<div class="grow"><small>${esc(asgName(a))}</small><div class="kqsc ${pct>=.8?'pgg':pct>=.5?'pgm':'pgb'}">${L.ok}/${L.n}</div><b>${msg}</b>${L.xu?`<span class="earn">+${L.xu} ${arcT('xu','coins')}</span>`:''}</div></div>
  <p class="muted" style="margin:8px 0 0;font-size:13px">${arcT(`Lần nộp thứ ${r.tries} · ${asgD(L.t)}${r.tries>1?` · lần đầu ${r.first.ok}/${r.first.n}`:''}. Câu sai đã vào Sổ lỗi để em luyện lại.`,`Hand-in #${r.tries} · ${asgD(L.t)}${r.tries>1?` · first ${r.first.ok}/${r.first.n}`:''}. Mistakes went to your mistake book.`)}</p>
  <div class="archbtn"><button type="button" class="btn sm" onclick="asgGo('${a.id}')">${arcT('Làm lại (số mới)','Redo (new numbers)')}</button></div></section>
 <section class="card"><h3 class="ghgh" style="margin-top:0">${arcT('Từng câu','Each question')}</h3>${rows}</section></div>`}
/* khung Phòng học trong Nhà em */
function phongBox(...a){return hooks.goi('phongBox',this,a)}
hooks.ham('phongBox',function(st){const nt=asgTodo(st),nm=Object.keys(mist(st)).length;
 const tile=(click,ic,n,sub,badge)=>`<button type="button" class="nhat" onclick="${click}"><span class="nhic">${ic}${badge?`<i class="herbang">${badge}</i>`:''}</span><b>${n}</b><small>${sub}</small></button>`;
 return`<section class="card pghome"><h2 class="nhah">${spr('classS',26)} ${arcT('Phòng học của em','My study room')}</h2><div class="nhagrid">
  ${tile(`go({k:'home',tab:'bai'})`,spr('asgS',44),arcT('Bài cô giao','Homework'),nt?arcT(`${nt} bài chưa làm xong`,`${nt} not done`):arcT('Đã làm hết','All done'),nt>9?'9+':nt||'')}
  ${tile(`go({k:'home',tab:'fix'})`,spr('book',44),arcT('Luyện lỗi','Fix mistakes'),nm?arcT(`${nm} lỗi cần sửa`,`${nm} to fix`):arcT('Không có lỗi','No mistakes'),nm>9?'9+':nm||'')}
  ${tile(`toast(arcT('Phần Tự luyện sắp có nhé!','Self-practice is coming soon!'))`,spr('selfS',44),arcT('Tự luyện','Self-practice'),arcT('Sắp có','Coming soon'),'')}</div></section>`});
{hooks.on('viewNha',_n=>function(st){const r=_n.apply(this,arguments);try{asgSeed();const i=r.indexOf('<section class="card tdhome">');const box=phongBox(st);return i<0?r.replace(/<\/div>\s*$/,box+'</div>'):r.slice(0,i)+box+r.slice(i)}catch(e){return r}})}
NHA_TABS.push('bai','baikq','fix');
{hooks.on('viewHome1t',_v=>function(){const st=S.st[sid];let r;
 if(scr.tab==='bai'||scr.tab==='baikq'){const t=scr.tab;scr.tab='nha';try{r=_v.apply(this,arguments)}finally{scr.tab=t}const i=r.indexOf('<nav class="bnav"');asgSeed();r=(t==='bai'?viewAsg(st):viewAsgKQ(st))+(i>=0?r.slice(i):'')}
 else{r=_v.apply(this,arguments);if(scr.tab==='fix')r=`<div class="crumb nhacrumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'nha'})">← ${arcT('Phòng học','Study room')}</button></div>`+r}
 try{if(!st||st.grade>5)return r;
  /* bỏ Luyện lỗi khỏi thanh dưới */
  r=r.replace(/<button class="[^"]*" aria-current="\w+" onclick="go\(\{k:'home',tab:'fix'\}\)"[^>]*>[\s\S]*?<\/button>/,'');
  /* Nhà em: số bài chưa làm; có lỗi cần sửa thì ít nhất báo "!" */
  asgSeed();const nt=asgTodo(st),nm=Object.keys(mist(st)).length;
  if(nt||nm)r=r.replace(/(<button class="[^"]*)(" aria-current="\w+" onclick="go\(\{k:'home',tab:'nha'\}\)"><span aria-hidden="true" class="bnic">)([\s\S]*?)(<\/span>)/,(m,a,b,c,d)=>{c=c.replace(/<i class="pxq-n bnn">[^<]*<\/i>/,'');return a+(a.includes('bnfix')?'':' bnfix')+b+c+`<i class="pxq-n bnn">${nt?(nt>9?'9+':nt):'!'}</i>`+d})}catch(e){}
 return r})}
/* trang giáo viên (bản đầy đủ): giao phiếu bài + xem kết quả */
function gvAsgStats(a,CLS){const W={};let m=0;CLS.forEach(([id])=>{const r=asgR(S.st[id])[a.id];if(!r||!r.first)return;m++;r.first.ans.forEach(x=>{const k=x.label||'?';W[k]=W[k]||[0,0];W[k][1]++;if(!x.ok)W[k][0]++})});
 const top=Object.entries(W).filter(([,v])=>v[0]).sort((p,q)=>q[1][0]/q[1][1]-p[1][0]/p[1][1]).slice(0,3);
 return m?`<div class="muted" style="margin-top:6px">${top.length?`Dạng sai nhiều (lần đầu): ${top.map(([k,v])=>`<b>${esc(k)}</b> ${v[0]}/${v[1]} câu`).join(' · ')}`:'Lần đầu cả lớp chưa sai câu nào.'}</div>`:''}
function gvAsgBox(){const g=gvGrade;if(g>5||!PRIM[g])return'';asgSeed();const L=PRIM[g].isl,CLS=gvCLS();
 const list=asgAll().filter(a=>a.g===g&&asgOk(a)&&!a.hs&&a.loai!=='loi'&&(!a.lop||!gvLop||a.lop===gvLop)).sort((p,q)=>q.t-p.t).map(a=>`<div class="task"><div class="row"><div style="flex:1;min-width:160px"><b>${esc(asgName(a))} · ${a.n} câu</b><div class="muted">Giao ${asgD(a.t)}${a.due?` · hạn ${asgD(a.due)}`:''}</div></div><button class="btn sm" onclick="gvAsgDel('${a.id}')">Xoá</button></div>
  <div class="row" style="margin-top:8px;gap:6px">${CLS.map(([id,n])=>{const s=asgState(S.st[id],a),r=s.r;return`<span class="pill ${s.done?(r.best.ok/r.best.n>=.8?'ok':'acc'):'warn'}">${esc(n.split(' ').pop())}: ${s.done?`${r.first.ok}/${r.first.n}${r.tries>1?` → tốt nhất ${r.best?r.best.ok+'/'+r.best.n:'xong'}`:''}`:s.doing?'đang làm':'chưa làm'}${s.late?' · quá hạn':''}</span>`}).join('')}</div>${gvAsgStats(a,CLS)}</div>`).join('');
 return`<section class="card"><div class="secthead"><h2>Giao phiếu bài cho lớp ${g}</h2></div>
  <p class="muted" style="margin:0 0 6px">Phiếu bài tách riêng khỏi đảo: không tính sao, không mở đảo. Mỗi em cùng dạng câu nhưng số khác nhau. Chọn 1 hay nhiều tiết (giữ Ctrl/⌘ để chọn nhiều).</p>
  <div class="row" style="gap:8px;flex-wrap:wrap;margin:6px 0 10px;align-items:flex-start"><select id="asgIsl" multiple size="6" aria-label="Chọn tiết" style="min-width:280px;flex:1">${L.map((x,i)=>`<option value="${x.id}" ${i===0?'selected':''}>${esc(shortTitle(x.title))} — ${esc((x.goal||'').slice(0,50))}</option>`).join('')}</select>
  <div class="grid" style="gap:8px"><select id="asgN" aria-label="Số câu">${[5,6,8,10,12,15,20].map(n=>`<option value="${n}" ${n===(g<=2?6:10)?'selected':''}>${n} câu</option>`).join('')}</select>
  <select id="asgDue" aria-label="Hạn nộp"><option value="0">Không hạn</option><option value="1">Hạn 1 ngày</option><option value="2" selected>Hạn 2 ngày</option><option value="3">Hạn 3 ngày</option><option value="7">Hạn 1 tuần</option></select>
  <button class="btn pri" onclick="gvAsgAdd()">Giao phiếu</button></div></div>
  <p class="muted" style="margin:0 0 8px">Pill: điểm lần đầu (→ điểm tốt nhất nếu em làm lại).</p>${list||'<p class="muted">Chưa giao phiếu nào.</p>'}</section>`}
function gvAsgAdd(){const tiets=[...document.getElementById('asgIsl').selectedOptions].map(o=>o.value);if(!tiets.length){toast('Chọn ít nhất 1 tiết');return}
 const n=+document.getElementById('asgN').value,d=+document.getElementById('asgDue').value,now=(typeof gvNow==='function'?gvNow():Date.now());
 const a={id:'a'+now.toString(36),g:gvGrade,lop:gvLop,bat:1,dat:80,tiets,n,t:now,due:d?now+d*DAYMS:0,by:gvTen()};asgAll().push(a);log('gv','assigned',`Phiếu bài · ${asgName(a)}`,0,{});save();render();toast('Đã giao phiếu cho lớp '+(gvLop||gvGrade))}
function gvAsgDel(id){S.asg=asgAll().filter(a=>a.id!==id);save();render();toast('Đã xoá phiếu')}
{hooks.on('viewGV',_g=>function(){const r=_g.apply(this,arguments);try{const b=gvAsgBox();if(!b)return r;const i=r.lastIndexOf('<section class="card"><details>');return i<0?r:r.slice(0,i)+b+r.slice(i)}catch(e){return r}})}
Object.assign(I18N,{'Phòng học của em':'My study room','Bài cô giao':'Homework','Tự luyện':'Self-practice'});
document.head.insertAdjacentHTML('beforeend',`<style>
.pghome{margin-top:14px}
.pgrow{display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:10px;background:var(--surface,#fff);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A)}
.pgrow.done{opacity:.92}.pgrow .grow{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:3px}
.pgt{font-family:var(--f-body);font-size:15px;line-height:1.25}.pggoal{font-size:13px;line-height:1.3}.pgrow small{font-size:12.5px;color:var(--muted)}.pgres{font-size:13px;display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.pgbtns{display:flex;flex-direction:column;gap:6px;flex:0 0 auto;margin-left:auto}.pgbtn{width:96px;justify-content:center}
.pgg{color:#1E8A4A}.pgm{color:#C95A0E}.pgb{color:#F04A1B}
.phpl i.phd{background:#7FD3F0}.phpill{display:inline-flex;align-items:center;gap:4px}
.phbar{display:flex;align-items:center;gap:10px;margin-top:10px;padding-top:10px;border-top:2px dashed var(--line,#C3CBDD)}.phbar .grow{flex:1;text-align:center;font-size:13px;color:var(--muted)}
.phask{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.kqhd{display:flex;gap:12px;align-items:center}.kqhd .grow{display:flex;flex-direction:column;gap:2px}.kqhd small{color:var(--muted);font-size:13px}.kqsc{font-family:var(--f-display);font-size:52px;line-height:1}
.kqrow{display:flex;gap:10px;padding:10px;margin-bottom:8px;background:var(--surface,#fff);color:var(--ink);box-shadow:var(--f2)}.kqrow.bad{background:var(--coral-soft,#FDE3DC)}.kqrow.ok{background:var(--leaf-soft,#E1F5E8)}
.kqrow .grow{min-width:0;flex:1}.kqn{font-family:var(--f-display);font-size:24px;min-width:24px}.kqq{font-size:14px;line-height:1.35}.kqq img,.kqq svg{max-height:60px}
.kqpic{zoom:.55;margin:2px 0;overflow:hidden}.kqans{display:table;margin:6px 0 8px;box-shadow:0 0 0 3px #2AB563;background:#fff;padding:4px}.kqok{color:#1E8A4A;font-weight:700}.kqbad{color:#B8320F;font-weight:700}.kqsol{font-size:13px;color:var(--muted);margin-top:2px}
.pgtags{display:flex;gap:4px;flex-wrap:wrap}.pgtag{font-style:normal;font-family:var(--f-display);font-size:15px;line-height:1;padding:3px 6px 2px;color:#fff;background:#1F2A5A}
.pgtag.no{background:#F04A1B}.pgtag.mid{background:#FCB40C;color:#1F2A5A}.pgtag.ok{background:#2AB563}.pgtag.new{background:#12B5E8}.pgtag.late{background:#8656A8}
</style>`);
