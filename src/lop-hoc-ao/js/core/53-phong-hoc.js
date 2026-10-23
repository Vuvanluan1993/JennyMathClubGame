/* 53 — Phòng học của em (thầy yêu cầu 23/10/2026)
   Nhà em › khung "Phòng học của em" (dưới khung Nhà, trên Tủ đồ) gồm 3 ô: Bài cô giao · Luyện lỗi · Tự luyện.
   Luyện lỗi bỏ khỏi thanh dưới, chỉ vào từ Phòng học (số lỗi vẫn báo trên nút Nhà em).
   Bài cô giao:
   - Cô giao 1 màn của 1 đảo (tiết) cho cả lớp, có thể kèm hạn nộp. Lưu chung S.asg=[{id,g,isl,lv,t,due,by}].
   - Kết quả từng em: st.asgR[id]={seen,tries,first:{ok,n,pass,t},best:{ok,n,pass,t}}.
     Lần làm đầu được giữ riêng (cô xem đúng sức em), lần tốt nhất để em làm lại cải thiện.
   - Trạng thái: Chưa làm → Chưa đạt (đã làm, chưa qua; được làm lại) → Đã xong (qua màn). Quá hạn mà chưa xong thì gắn "Quá hạn" nhưng vẫn làm được.
   - Sắp xếp: phần "Cần làm" ở trên, bài cô mới giao lên đầu, gắn "Mới" tới khi em mở trang; phần "Đã làm" ở dưới, bài nộp gần nhất lên đầu. */
PXS.classS=["nnnnnnnnnnnn","nGGGGGGGGGGn","nGwGGwwwGGGn","nwwwGGGwGGGn","nGwGGGwGGwGn","nGGGGwwwGGGn","nGGGGGGGGGGn","nnnnnnnnnnnn",".N........N.","N..........N"];
PXS.asgS=["..kkkkkk..","kkkaaaakkk","kwwwwwwwwk","kwggwbbbwk","kwggwwwwwk","kwwwwwwwwk","kwrrwbbbwk","kwrrwwwwwk","kwwwwwwwwk","kkkkkkkkkk"];
PXS.selfS=ring(12,d=>d>5.6?null:d>4.8?'k':d>3.6?'r':d>2.4?'w':d>1.2?'r':'a');
const DAYMS=864e5;
const asgAll=()=>S.asg||(S.asg=[]);
function asgR(st){return st.asgR||(st.asgR={})}
function asgMine(st){if(!st||st.grade>5)return[];return asgAll().filter(a=>a.g===st.grade&&isl1(a.isl))}
function asgState(st,a){const r=asgR(st)[a.id]||{};const done=!!(r.best&&r.best.pass);return{r,done,tried:!!r.tries,late:!done&&a.due&&Date.now()>a.due,neu:!r.seen&&!r.tries}}
function asgTodo(st){return asgMine(st).filter(a=>!asgState(st,a).done).length}
const asgD=t=>{const d=new Date(t);return`${d.getDate()}/${d.getMonth()+1}`};
const lvName=(x,lv)=>lv===(x.lv.length-1)&&x.lv.length>2?arcT('Màn Trùm','Boss level'):arcT(`Màn ${lv+1}`,`Level ${lv+1}`);
/* dữ liệu mẫu: mỗi lớp 1–5 có 2 bài (1 bài cũ, 1 bài cô vừa giao, hạn 2 ngày) */
function asgSeed(){if(S.asgSeed)return;S.asgSeed=1;const now=Date.now();
 [1,2,3,4,5].forEach(g=>{const L=(PRIM[g]||{isl:[]}).isl;if(L.length<2)return;
  asgAll().push({id:`a${g}x1`,g,isl:L[0].id,lv:0,t:now-3*DAYMS,due:now-DAYMS,by:'Cô Jenny'},{id:`a${g}x2`,g,isl:L[1].id,lv:0,t:now-3600e3,due:now+2*DAYMS,by:'Cô Jenny'});
  });
 try{save()}catch(e){}}
/* làm bài */
function asgGo(aid){const st=S.st[sid],a=asgAll().find(x=>x.id===aid);if(!a)return;const r=asgR(st)[aid]||(asgR(st)[aid]={});r.seen=1;save();
 startG1(a.isl,a.lv);if(scr.k==='game'&&scr.id===a.isl&&!scr.fix){scr.asg=aid;render()}}
{const _e=end1;end1=function(){const g=scr,aid=g&&g.asg;const out=_e.apply(this,arguments);
 try{if(aid&&g.end&&!g.asgDone){g.asgDone=1;const st=S.st[sid],r=asgR(st)[aid]||(asgR(st)[aid]={}),res={ok:g.ok,n:g.qs.length,pass:!!g.pass,t:Date.now()};
  r.seen=1;r.tries=(r.tries||0)+1;if(!r.first)r.first=res;
  if(!r.best||(res.pass&&!r.best.pass)||(res.pass===r.best.pass&&res.ok/res.n>r.best.ok/r.best.n))r.best=res;
  log(sid,res.pass?'passed':'failed',`Bài cô giao · ${isl1(g.id).title} · màn ${g.lv+1}`,0,{success:res.pass,score:{raw:res.ok,max:res.n}});save();render()}}catch(e){}
 return out}}
/* trang Bài cô giao */
function asgRow(st,a){const x=isl1(a.isl),S0=asgState(st,a),r=S0.r,b=r.best;
 const tag=S0.done?`<i class="pgtag ok">${arcT('Đã xong','Done')}</i>`:S0.tried?`<i class="pgtag mid">${arcT('Chưa đạt','Not passed')}</i>`:`<i class="pgtag no">${arcT('Chưa làm','To do')}</i>`;
 const res=b?`<span class="pgres">${arcT('Kết quả','Score')}: <b>${b.ok}/${b.n}</b>${b.pass?' '+spr('star',14):''} · ${r.tries} ${arcT('lần làm','tries')}${r.first&&r.tries>1?` · ${arcT('lần đầu','first')} ${r.first.ok}/${r.first.n}`:''}</span>`:'';
 return`<div class="pgrow ${S0.done?'done':''}"><div class="grow"><div class="pgtags">${S0.neu?`<i class="pgtag new">${arcT('Mới','New')}</i>`:''}${tag}${S0.late?`<i class="pgtag late">${arcT('Quá hạn','Late')}</i>`:''}</div>
  <b class="pgt">${esc(shortTitle(x.title))} · ${lvName(x,a.lv)}</b><span class="pggoal">${esc(x.goal||x.lesson||'')}</span>
  <small>${esc(a.by||'Cô')} ${arcT('giao','set')} ${asgD(a.t)}${a.due?` · ${arcT('hạn','due')} ${asgD(a.due)}`:''}${b?` · ${arcT('nộp','handed in')} ${asgD(b.t)}`:''}</small>${res}</div>
  <button type="button" class="btn sm ${S0.done?'':'pri'} pgbtn" onclick="asgGo('${a.id}')">${S0.done?arcT('Làm lại','Redo'):S0.tried?arcT('Làm lại','Try again'):arcT('Làm bài','Start')}</button></div>`}
function viewAsg(st){const L=asgMine(st),todo=L.filter(a=>!asgState(st,a).done).sort((p,q)=>q.t-p.t),done=L.filter(a=>asgState(st,a).done).sort((p,q)=>q.t-p.t);
 const page=`<div class="page pgpage"><div class="crumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'nha'})">← ${arcT('Phòng học','Study room')}</button></div>
 <section class="card"><h2 class="nhah">${spr('asgS',24)} ${arcT('Bài cô giao','Homework')}</h2>
  <h3 class="ghgh">${arcT('Cần làm','To do')} (${todo.length})</h3>${todo.length?todo.map(a=>asgRow(st,a)).join(''):`<p class="muted">${arcT('Em đã làm hết bài cô giao. Giỏi lắm!','All homework done. Well done!')}</p>`}
  <h3 class="ghgh">${arcT('Đã làm','Done')} (${done.length})</h3>${done.length?done.map(a=>asgRow(st,a)).join(''):`<p class="muted">${arcT('Chưa có bài nào xong.','Nothing finished yet.')}</p>`}
  <p class="muted" style="font-size:13px;margin:12px 0 0">${arcT('Kết quả lưu lại để cô xem. Em được làm lại bài để cải thiện; cô vẫn thấy cả kết quả lần đầu.','Results are saved for your teacher. You can redo to improve; your teacher also sees your first try.')}</p></section></div>`;
 L.forEach(a=>{const r=asgR(st)[a.id]||(asgR(st)[a.id]={});r.seen=1});save();return page}
/* khung Phòng học trong Nhà em */
function phongBox(st){const nt=asgTodo(st),nm=Object.keys(mist(st)).length;
 const tile=(click,ic,n,sub,badge)=>`<button type="button" class="nhat" onclick="${click}"><span class="nhic">${ic}${badge?`<i class="herbang">${badge}</i>`:''}</span><b>${n}</b><small>${sub}</small></button>`;
 return`<section class="card pghome"><h2 class="nhah">${spr('classS',26)} ${arcT('Phòng học của em','My study room')}</h2><div class="nhagrid">
  ${tile(`go({k:'home',tab:'bai'})`,spr('asgS',44),arcT('Bài cô giao','Homework'),nt?arcT(`${nt} bài chưa làm xong`,`${nt} not done`):arcT('Đã làm hết','All done'),nt>9?'9+':nt||'')}
  ${tile(`go({k:'home',tab:'fix'})`,spr('book',44),arcT('Luyện lỗi','Fix mistakes'),nm?arcT(`${nm} lỗi cần sửa`,`${nm} to fix`):arcT('Không có lỗi','No mistakes'),nm>9?'9+':nm||'')}
  ${tile(`toast(arcT('Phần Tự luyện sắp có nhé!','Self-practice is coming soon!'))`,spr('selfS',44),arcT('Tự luyện','Self-practice'),arcT('Sắp có','Coming soon'),'')}</div></section>`}
{const _n=viewNha;viewNha=function(st){const r=_n.apply(this,arguments);try{asgSeed();const i=r.indexOf('<section class="card tdhome">');const box=phongBox(st);return i<0?r.replace(/<\/div>\s*$/,box+'</div>'):r.slice(0,i)+box+r.slice(i)}catch(e){return r}}}
NHA_TABS.push('bai','fix');
{const _v=viewHome1t;viewHome1t=function(){const st=S.st[sid];let r;
 if(scr.tab==='bai'){scr.tab='nha';try{r=_v.apply(this,arguments)}finally{scr.tab='bai'}const i=r.indexOf('<nav class="bnav"');asgSeed();r=viewAsg(st)+(i>=0?r.slice(i):'')}
 else{r=_v.apply(this,arguments);if(scr.tab==='fix')r=`<div class="crumb nhacrumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'nha'})">← ${arcT('Phòng học','Study room')}</button></div>`+r}
 try{if(!st||st.grade>5)return r;
  /* bỏ Luyện lỗi khỏi thanh dưới */
  r=r.replace(/<button class="[^"]*" aria-current="\w+" onclick="go\(\{k:'home',tab:'fix'\}\)"[^>]*>[\s\S]*?<\/button>/,'');
  /* Nhà em: số bài chưa làm; có lỗi cần sửa thì ít nhất báo "!" */
  asgSeed();const nt=asgTodo(st),nm=Object.keys(mist(st)).length;
  if(nt||nm)r=r.replace(/(<button class="[^"]*)(" aria-current="\w+" onclick="go\(\{k:'home',tab:'nha'\}\)"><span aria-hidden="true" class="bnic">)([\s\S]*?)(<\/span>)/,(m,a,b,c,d)=>{c=c.replace(/<i class="pxq-n bnn">[^<]*<\/i>/,'');return a+(a.includes('bnfix')?'':' bnfix')+b+c+`<i class="pxq-n bnn">${nt?(nt>9?'9+':nt):'!'}</i>`+d})}catch(e){}
 return r}}
/* trang giáo viên (bản đầy đủ): giao bài + xem kết quả */
function gvAsgBox(){const g=gvGrade;if(g>5||!PRIM[g])return'';asgSeed();const L=PRIM[g].isl,CLS=STUDENTS.filter(s=>s[2]===g);
 const list=asgAll().filter(a=>a.g===g).sort((p,q)=>q.t-p.t).map(a=>{const x=isl1(a.isl);if(!x)return'';
  return`<div class="task"><div class="row"><div style="flex:1;min-width:160px"><b>${esc(shortTitle(x.title))} · ${lvName(x,a.lv)}</b><div class="muted">Giao ${asgD(a.t)}${a.due?` · hạn ${asgD(a.due)}`:''}</div></div><button class="btn sm" onclick="gvAsgDel('${a.id}')">Xoá</button></div>
  <div class="row" style="margin-top:8px;gap:6px">${CLS.map(([id,n])=>{const st=S.st[id],s=asgState(st,a),b=s.r.best,f=s.r.first;return`<span class="pill ${s.done?'ok':s.tried?'acc':'warn'}">${esc(n.split(' ').pop())}: ${b?`${b.ok}/${b.n}${f&&s.r.tries>1?` (lần đầu ${f.ok}/${f.n})`:''}`:'chưa làm'}${s.late?' · quá hạn':''}</span>`}).join('')}</div></div>`}).join('');
 return`<section class="card"><div class="secthead"><h2>Giao bài cho lớp ${g}</h2></div>
  <div class="row" style="gap:8px;flex-wrap:wrap;margin:6px 0 10px"><select id="asgIsl" aria-label="Chọn tiết" onchange="gvAsgLv()">${L.map(x=>`<option value="${x.id}">${esc(shortTitle(x.title))} — ${esc((x.goal||'').slice(0,48))}</option>`).join('')}</select>
  <select id="asgLv" aria-label="Chọn màn">${L[0].lv.map((_,i)=>`<option value="${i}">${lvName(L[0],i)}</option>`).join('')}</select>
  <select id="asgDue" aria-label="Hạn nộp"><option value="0">Không hạn</option><option value="1">Hạn 1 ngày</option><option value="2" selected>Hạn 2 ngày</option><option value="3">Hạn 3 ngày</option><option value="7">Hạn 1 tuần</option></select>
  <button class="btn pri" onclick="gvAsgAdd()">Giao bài</button></div>
  <p class="muted" style="margin:0 0 8px">Bài mới hiện trên cùng ở Phòng học của em, gắn "Mới · Chưa làm". Pill: kết quả tốt nhất (kèm lần đầu nếu làm lại).</p>${list||'<p class="muted">Chưa giao bài nào.</p>'}</section>`}
function gvAsgLv(){const x=isl1(document.getElementById('asgIsl').value);document.getElementById('asgLv').innerHTML=x.lv.map((_,i)=>`<option value="${i}">${lvName(x,i)}</option>`).join('')}
function gvAsgAdd(){const isl=document.getElementById('asgIsl').value,lv=+document.getElementById('asgLv').value,d=+document.getElementById('asgDue').value,now=Date.now();
 asgAll().push({id:'a'+now.toString(36),g:gvGrade,isl,lv,t:now,due:d?now+d*DAYMS:0,by:'Cô Jenny'});log('gv','assigned',`${isl1(isl).title} · màn ${lv+1}`,0,{});save();render();toast('Đã giao bài cho lớp '+gvGrade)}
function gvAsgDel(id){S.asg=asgAll().filter(a=>a.id!==id);save();render();toast('Đã xoá bài giao')}
{const _g=viewGV;viewGV=function(){const r=_g.apply(this,arguments);try{const b=gvAsgBox();if(!b)return r;const i=r.lastIndexOf('<section class="card"><details>');return i<0?r:r.slice(0,i)+b+r.slice(i)}catch(e){return r}}}
Object.assign(I18N,{'Phòng học của em':'My study room','Bài cô giao':'Homework','Tự luyện':'Self-practice'});
document.head.insertAdjacentHTML('beforeend',`<style>
.pghome{margin-top:14px}
.pgrow{display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:10px;background:var(--surface,#fff);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A)}
.pgrow.done{opacity:.92}.pgrow .grow{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:3px}
.pgt{font-family:var(--f-body);font-size:15px;line-height:1.25}.pggoal{font-size:13px;line-height:1.3}.pgrow small{font-size:12.5px;color:var(--muted)}.pgres{font-size:13px;display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.pgbtn{flex:0 0 auto;width:96px;margin-left:auto;justify-content:center}
.pgtags{display:flex;gap:4px;flex-wrap:wrap}.pgtag{font-style:normal;font-family:var(--f-display);font-size:15px;line-height:1;padding:3px 6px 2px;color:#fff;background:#1F2A5A}
.pgtag.no{background:#F04A1B}.pgtag.mid{background:#FCB40C;color:#1F2A5A}.pgtag.ok{background:#2AB563}.pgtag.new{background:#12B5E8}.pgtag.late{background:#8656A8}
</style>`);
