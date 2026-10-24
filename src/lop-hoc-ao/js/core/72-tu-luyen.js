/* 72 — Tự luyện · Vở bài tập Jenny (thầy chốt và duyệt ảnh mẫu 24/10/2026, task T-24)
   - Nhà em › Phòng học › Tự luyện. Mỗi đảo đã qua Màn 1 mở 1 "trang vở" (Trang n = thứ tự đảo trong lớp).
   - Trang = 5 bài trộn dạng (số mới mỗi lần) + 1 bài ★ Thử thách. Em tự chọn, không bắt buộc, làm dở thoát ra vẫn giữ.
   - Mỗi bài: sai lần 1 được thử lại (không mất tim), sai lần 2 xem đáp án. Câu của đảo sai lần đầu → Sổ lỗi sai.
   - Xu: 5 xu/bài đúng, ★ đúng 15 xu, tính vào quỹ tự luyện (SELF_CAP/ngày). Không tính sao, không mở đảo.
   - Thử thách hôm nay: 1 lượt/ngày, +15 xu.
   - Dạng bài mới (kiểu 'cells', viết lại từ dạng bài của VBT tham khảo, không chép sách):
     Nhà số · Gia đình phép tính · Tháp số · Tam giác số. Xem docs/tu-luyen-dang-bai-lop1-tap1.md.
   - Cô KHÔNG giao, chỉ ⭐ gợi ý trang: lưu trong S.asg dạng {loai:'goiy', g, lop, hs?, isl:[...]} (không có tiets nên
     không lẫn vào Bài cô giao; đồng bộ máy chủ như bài cô giao).
   - Lưu: st.tl[islId]={n,best:{ok,n,tt,t},last:{…},cur:{seed,j,res,tt}} · st.tlDay={d,ok}.
   - Hiện có cho lớp 1, 2 (thầy chốt làm lớp 1 trước rồi lớp 2); lớp 3–5 hiện "Sắp có". */
(function(){
const TL_XU=5,TL_TT=15,TL_G=g=>g>=1&&g<=2;
const tlR=st=>st.tl||(st.tl={});
const tlIdx=x=>PRIM[curG()].isl.indexOf(x)+1;
const tlOpen=(st,x)=>{if(UNL)return true;const s=st.p1&&st.p1[x.id];return!!(s&&s.m&&s.m[0])};
const tlPages=st=>PRIM[curG()].isl.filter(x=>tlOpen(st,x));
const tlDone=st=>Object.values(tlR(st)).filter(r=>r&&r.best).length;
const tlLes=x=>shortTitle(x.lesson||'');
const RR=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const T=(vi,en)=>arcT(vi,en);

/* ---------- dạng bài mới ---------- */
/* q.type='cells': q.lay = house|fam|tower|tri; q.rows = hàng ô (số đã cho, null = ô trống, '' = chỗ trống không điền, chuỗi dấu);
   q.a = đáp án các ô trống theo thứ tự đọc. */
function cq(o){const blanks=[];o.rows.forEach(r=>r.forEach(c=>{if(c===null)blanks.push(1)}));return Object.assign({type:'cells',pic:'@@TLFIG@@'},o)}
function nhaSo(g){let n,lo,hi;if(g===1){n=RR(5,10);lo=1;hi=n-1}else{n=RR(11,18);lo=n-9;hi=9}
 const as=shuf(Array.from({length:hi-lo+1},(_,i)=>lo+i)).slice(0,g===1?4:3);const rows=[],a=[];
 as.forEach(x=>{const y=n-x,s=Math.random()<.5;rows.push(s?[x,null]:[null,y]);a.push(s?y:x)});
 return cq({lay:'house',roof:n,rows,a,kind:'Nhà số',label:'Nhà số',
  q:T(`<b>Nhà số ${n}</b>: hai số ở mỗi tầng gộp lại được ${n}. Điền số còn thiếu.`,`<b>Number house ${n}</b>: the two numbers on each floor make ${n}. Fill in the missing numbers.`),
  say:T(`Nhà số ${n}. Hai số ở mỗi tầng gộp lại được ${n}. Em điền số còn thiếu nhé.`,`Number house ${n}. The two numbers on each floor make ${n}. Fill in the missing numbers.`),
  sol:as.map(x=>`${x} + ${n-x} = ${n}`).join(' · ')})}
function giaDinh(g,mode){let a,b;
 if(g===1&&mode!=='100'){a=RR(1,8);b=RR(1,9-a)}
 else if(g===1){do{a=RR(1,8)*10+RR(0,8);b=RR(1,9)}while(a%10+b>9)}
 else if(mode==='20'){do{a=RR(2,9);b=RR(2,9)}while(a+b<=10)}
 else if(mode==='nho'){do{a=RR(1,8)*10+RR(2,9);b=RR(0,3)*10+RR(2,9)}while(a%10+b%10<10||a+b>100)}
 else{do{a=RR(1,7)*10+RR(0,8);b=RR(1,2)*10+RR(0,8)}while(a%10+b%10>9||a+b>100)}
 const n=a+b,rows=[[a,'+',b,'=',null],[b,'+',null,'=',n],[n,'−',a,'=',null],[n,'−',null,'=',a]];
 return cq({lay:'fam',head:[n,a,b],rows,a:[n,a,b,b],kind:'Gia đình phép tính',label:'Gia đình phép tính',
  q:T(`<b>${n}</b> gồm <b>${a}</b> và <b>${b}</b>. Điền số vào ô trống để có 2 phép cộng, 2 phép trừ.`,`<b>${n}</b> is <b>${a}</b> and <b>${b}</b>. Fill in the boxes to make 2 additions and 2 subtractions.`),
  say:T(`${n} gồm ${a} và ${b}. Em điền số vào ô trống nhé.`,`${n} is ${a} and ${b}. Fill in the boxes.`),
  sol:`${a} + ${b} = ${n} · ${b} + ${a} = ${n} · ${n} − ${a} = ${b} · ${n} − ${b} = ${a}`})}
function thapSo(g,M){let x,y,z;do{const k=g===1?4:M>20?30:8;x=RR(0,k);y=RR(1,k);z=RR(0,k)}while(x+2*y+z>M||x+2*y+z<(g===1?5:10));
 const p=x+y,q=y+z,t=p+q,hard=Math.random()<.4;
 const rows=hard?[[null],[p,q],[x,null,z]]:[[null],[p,null],[x,y,z]];
 return cq({lay:'tower',rows,a:hard?[t,y]:[t,q],kind:'Tháp số',label:'Tháp số',tt:1,
  q:T(`<b>★ Tháp số</b>: số ở mỗi ô bằng hai số ngay bên dưới cộng lại.`,`<b>★ Number pyramid</b>: each brick is the sum of the two bricks below it.`),
  say:T('Tháp số. Số ở mỗi ô bằng hai số ngay bên dưới cộng lại.','Number pyramid. Each brick is the sum of the two bricks below it.'),
  sol:hard?`${p} − ${x} = ${y} · ${p} + ${q} = ${t}`:`${y} + ${z} = ${q} · ${p} + ${q} = ${t}`})}
function tamGiac(g,M){let S0,x,y,z;for(;;){S0=g===1?RR(6,10):RR(12,Math.min(20,M));x=RR(1,S0-1);y=RR(1,S0-1);z=RR(1,S0-1);if(S0-x-y>=0&&S0-x-z>=0&&S0-y-z>=0&&new Set([x,y,z]).size===3)break}
 const m1=S0-x-y,m2=S0-x-z,m3=S0-y-z;
 return cq({lay:'tri',sum:S0,rows:[[x],[null,null],[y,null,z]],a:[m1,m2,m3],kind:'Tam giác số',label:'Tam giác số',tt:1,
  q:T(`<b>★ Tam giác số</b>: ba số trên mỗi cạnh cộng lại được <b>${S0}</b>. Điền số còn thiếu.`,`<b>★ Number triangle</b>: the three numbers on each side add up to <b>${S0}</b>. Fill in the missing numbers.`),
  say:T(`Tam giác số. Ba số trên mỗi cạnh cộng lại được ${S0}.`,`Number triangle. The three numbers on each side add up to ${S0}.`),
  sol:`${x} + ${m1} + ${y} = ${S0} · ${x} + ${m2} + ${z} = ${S0} · ${y} + ${m3} + ${z} = ${S0}`})}

/* dạng mới hợp với từng bài (theo số bài KNTT) */
function tlNew(x){const g=curG(),b=x.b;
 if(g===1){if(b===5||b===6)return[()=>nhaSo(1)];if(b>=10&&b<=13||b===18||b===20||b===38)return[()=>giaDinh(1),()=>nhaSo(1)];if(b>=29&&b<=33||b===39)return[()=>giaDinh(1,'100')];return[]}
 if(g===2){if(b>=7&&b<=14)return[()=>giaDinh(2,'20'),()=>nhaSo(2)];if(b===3||b===5||b===6)return[()=>giaDinh(2,'100')];if(b>=19&&b<=24||b===33||b===69)return[()=>giaDinh(2,'nho')];return[]}
 return[]}
function tlChal(x){const g=curG(),b=x.b;
 if(g===1&&(b>=10&&b<=13||b===18||b===20||b===38))return[()=>thapSo(1,10),()=>tamGiac(1,10)];
 if(g===2&&(b>=7&&b<=14))return[()=>thapSo(2,20),()=>tamGiac(2,20)];
 if(g===2&&(b>=19&&b<=24||b===33||b===69))return[()=>thapSo(2,100)];
 return[]}

/* ---------- sinh trang theo seed ---------- */
function tlQs(x,seed){const mr=Math.random;Math.random=seedRnd(seed);const qs=[];
 try{const L=[0,1].filter(l=>x.lv[l]),cand=shuf(L.flatMap(l=>x.lv[l].map((_,gi)=>[l,gi]))),used=new Set();
  const add=(l,gi)=>{let q;try{q=x.lv[l][gi]()}catch(e){q=null}if(!q)return false;const k=q.kind||'';if(used.has(k)&&cand.length>8)return false;used.add(k);qs.push({...q,src:[x.id,l,gi],key:`${x.id}:${l}:${gi}`,label:q.kind||'Câu hỏi'});return true};
  const nw=tlNew(x),want=nw.length?4:5;
  for(let i=0;i<cand.length*2&&qs.length<want;i++)add(...cand[i%cand.length]);
  for(let t=0;t<40&&qs.length<want&&cand.length;t++){const c=pick(cand);let q;try{q=x.lv[c[0]][c[1]]()}catch(e){q=null}if(q)qs.push({...q,src:[x.id,c[0],c[1]],key:`${x.id}:${c[0]}:${c[1]}`,label:q.kind||'Câu hỏi'})}
  if(nw.length)qs.splice(2,0,{...pick(nw)(),key:'',src:null});
  const ch=tlChal(x);let c;
  if(ch.length)c={...pick(ch)(),key:'',src:null};
  else{const l=x.lv[2]?2:x.lv.length-1;for(let k=0;k<6&&!c;k++){const gi=RR(0,x.lv[l].length-1);try{const q=x.lv[l][gi]();if(q)c={...q,src:[x.id,l,gi],key:`${x.id}:${l}:${gi}`,label:q.kind||'Câu hỏi'}}catch(e){}}}
  if(c){c.tt=1;qs.push(c)}}
 finally{Math.random=mr}
 return qs.map(q=>q.type!=='cells'&&typeof trQ==='function'&&arcEN()?trQ(q):q)}
function tlBlank(g){Object.assign(g,{sheet:null,tries:0,inp:'',picks:[],seq:[],fill:[],used:[],cnt:0,hit:false,mad:0,cv:null,cc:0,t0:Date.now()})}
window.tlGo=function(id){const st=S.st[sid],x=isl1(id);if(!x)return;const r=tlR(st)[id]||(tlR(st)[id]={n:0});
 if(!r.cur)r.cur={seed:(Math.random()*2**31)|0,j:0,res:[],tt:0};save();try{speechSynthesis.cancel()}catch(e){}
 const qs=tlQs(x,r.cur.seed);v1Said='';const g0={k:'game',g1:1,tl:1,id,lv:0,qs,j:Math.min(r.cur.j,qs.length-1),hearts:3,ok:r.cur.res.filter(Boolean).length,res:r.cur.res.slice(),hp:0};tlBlank(g0);go(g0);tlBlank(scr);render()};
/* Thử thách hôm nay: 1 lượt/ngày, câu ★ của trang mới nhất em đã mở */
function tlDayOk(st){return st.tlDay&&st.tlDay.d===S.day}
function tlDayIsl(st){const P=tlPages(st);for(let i=P.length-1;i>=0;i--)if(tlChal(P[i]).length)return P[i];return P[P.length-1]}
window.tlDayGo=function(){const st=S.st[sid];if(tlDayOk(st)){toast(T('Hôm nay em đã làm Thử thách rồi. Mai quay lại nhé!','You have done today’s challenge. Come back tomorrow!'));return}
 const x=tlDayIsl(st);if(!x)return;const qs=tlQs(x,(Math.random()*2**31)|0).filter(q=>q.tt).slice(-1);if(!qs.length)return;
 v1Said='';const g0={k:'game',g1:1,tl:1,tlDay:1,id:x.id,lv:0,qs,j:0,hearts:3,ok:0,res:[],hp:0};tlBlank(g0);go(g0);tlBlank(scr);render()};

/* ---------- vẽ ô ---------- */
function tlFig(q){const g=scr;let b=0;
 const cell=c=>{if(c===null){const i=b++,v=(g.cv&&g.cv[i])||'';return`<button type="button" class="tc e ${i===g.cc?'cur':''} ${g.cbad&&g.cbad.includes(i)?'bad':''}" onclick="tlCell(${i})" aria-label="${T('Ô trống','Blank')} ${i+1}">${esc(v)}</button>`}
  if(c==='')return`<span class="tc gap"></span>`;if(typeof c==='string')return`<span class="tc op">${c}</span>`;return`<span class="tc">${fmt(c)}</span>`};
 if(q.lay==='house')return`<div class="tlhouse"><div class="roof"><span>${q.roof}</span></div><div class="floors">${q.rows.map(r=>`<div class="fl">${r.map(cell).join('')}</div>`).join('')}</div></div>`;
 if(q.lay==='fam')return`<div class="tlfam"><div class="tlsd"><span class="tc">${q.head[0]}</span><i class="l1"></i><i class="l2"></i><span class="tc">${q.head[1]}</span><span class="tc">${q.head[2]}</span></div>${q.rows.map(r=>`<div class="eq">${r.map(cell).join('')}</div>`).join('')}</div>`;
 return`<div class="tlrows ${q.lay}">${q.lay==='tri'?`<div class="trisum">${T('Mỗi cạnh','Each side')} = ${q.sum}</div>`:''}${q.rows.map(r=>`<div class="rw">${r.map(cell).join('')}</div>`).join('')}</div>`}
const nBl=q=>q.a.length;
window.tlCell=function(i){const g=scr;if(g.sheet)return;g.cc=i;sfx('tap');render()};
window.tlKey=function(k){const g=scr,q=q1();if(g.sheet||!q||q.type!=='cells')return;g.cv=g.cv||q.a.map(()=>'');const v=g.cv[g.cc]||'';
 if(k==='⌫'){g.cv[g.cc]=v.slice(0,-1)}
 else if(k==='✓'){if(g.cv.every(Boolean))ans1(g.cv.map(Number));else{toast(T('Em điền hết các ô trống nhé.','Fill in every box first.'));return}}
 else{const mx=Math.max(...q.a).toString().length;if(v.length>=mx)g.cv[g.cc]=k;else g.cv[g.cc]=v+k;
  if(g.cv[g.cc].length>=mx){const nx=g.cv.findIndex((x,i)=>i>g.cc&&!x);const n0=g.cv.findIndex(x=>!x);if(nx>=0)g.cc=nx;else if(n0>=0)g.cc=n0}}
 g.cbad=null;sfx('tap');render()};

/* ---------- nối vào bộ chơi ---------- */
{const _r=right1;right1=function(q,v){if(q&&q.type==='cells')return Array.isArray(v)&&v.length===q.a.length&&v.every((x,i)=>Number(x)===q.a[i]);return _r.apply(this,arguments)}}
{const _s=show1;show1=function(q){if(q&&q.type==='cells')return q.a.join(', ');return _s.apply(this,arguments)}}
{const _i=input1;input1=function(q){if(!(q&&q.type==='cells'))return _i.apply(this,arguments);
 return`<div class="pad">${['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map(k=>`<button type="button" class="${k==='✓'?'go':k==='⌫'?'del':''}" onclick="tlKey('${k}')" aria-label="${k==='⌫'?T('Xóa','Delete'):k==='✓'?T('Xong','Done'):k}">${k==='✓'?T('Xong','Done'):k}</button>`).join('')}</div>`}}
function tlSave(){const g=scr,st=S.st[sid];if(g.tlDay)return;const r=tlR(st)[g.id];if(r&&r.cur){r.cur.j=g.j;r.cur.res=g.res.slice()}}
{const _a=ans1;ans1=function(v){const g=scr;if(!(g&&g.tl))return _a.apply(this,arguments);if(g.sheet||g.end)return;
 const q=q1(),ok=right1(q,v),st=S.st[sid],x=isl1(g.id),first=!g.tries,fromIsl=!!(q.key&&q.src);
 try{hsRec(q,ok,first,1,(q.src&&q.src[0])||g.id)}catch(e){}
 if(!ok&&first&&fromIsl){try{mist1Add(q);gdMistNote(q,{wa:gdShowAns(q,v),from:T('Tự luyện','Self-practice')})}catch(e){}}
 log(sid,'answered',`Tự luyện · ${x.title}`,0,{success:ok,duration:`PT${Math.round((Date.now()-g.t0)/1000)}S`});
 if(ok){g.ok++;if(g.res[g.j]===undefined)g.res[g.j]=true;const c=addCoins(sid,q.tt?TL_TT:TL_XU,'self');sfx('ok');
  g.sheet={kind:'ok',msg:(c?`+${c} ${T('xu','coins')}`:T('(đã đủ xu tự luyện hôm nay)','(daily practice coins reached)'))};sayJ(pick(T('Giỏi quá!|Đúng rồi!|Tuyệt vời!','Brilliant!|Correct!|Well done!').split('|')))}
 else{g.tries++;sfx('bad');
  if(g.tries===1){if(q.type==='cells'){g.cbad=[];g.cv=g.cv.map((x,i)=>{if(Number(x)===q.a[i])return x;g.cbad.push(i);return''});g.cc=g.cbad[0]||0}
   g.sheet={kind:'tlretry'};sayJ(T('Chưa đúng rồi. Em thử lại nhé.','Not quite. Try again.'))}
  else{g.res[g.j]=false;g.sheet={kind:'bad'};sayJ(String(q.sol||'').replace(/<[^>]+>/g,' ').replace(/−/g,' trừ ').replace(/=/g,' bằng '))}}
 tlSave();save();render()}}
{const _s=sheet1;sheet1=function(){const g=scr;if(g&&g.tl&&g.sheet&&g.sheet.kind==='tlretry')
  return`<div class="sheet warn"><div class="sh"><span class="ic">?</span><div><b>${T('Chưa đúng.','Not quite.')}</b><div>${q1().type==='cells'?T('Ô sai đã được xoá. Em điền lại nhé.','Wrong boxes were cleared. Try again.'):T('Em nhìn kỹ và thử lại nhé.','Look carefully and try again.')}</div></div></div><button class="gobtn" type="button" onclick="retry1()">${T('Thử lại','Try again')}</button></div>`;
 return _s.apply(this,arguments)}}
{const _r=retry1;retry1=function(){const g=scr;if(!(g&&g.tl))return _r.apply(this,arguments);const cv=g.cv,cc=g.cc,cb=g.cbad,r=_r.apply(this,arguments);g.cv=cv;g.cc=cc;g.cbad=cb;render();return r}}
{const _n=next1;next1=function(){const g=scr;if(!(g&&g.tl))return _n.apply(this,arguments);
 if(g.j>=g.qs.length-1){tlEnd();return}g.j++;tlBlank(g);tlSave();save();render()}}
function tlEnd(){const g=scr,st=S.st[sid],x=isl1(g.id),tt=g.qs.findIndex(q=>q.tt),nb=g.qs.filter(q=>!q.tt).length;
 const ok=g.res.filter((v,i)=>v&&!g.qs[i].tt).length,tok=tt>=0&&g.res[tt]===true;g.end=true;
 if(g.tlDay){st.tlDay={d:S.day,ok:tok};log(sid,'completed',`Tự luyện · Thử thách hôm nay`,0,{success:tok});g.tlRes={day:1,ok:tok};sfx(tok?'win':'ok');save();render();return}
 const r=tlR(st)[g.id]||(tlR(st)[g.id]={n:0}),res={ok,n:nb,tt:tok?1:0,t:Date.now()};r.n=(r.n||0)+1;r.last=res;
 if(!r.best||ok>r.best.ok||(ok===r.best.ok&&res.tt>=r.best.tt))r.best=res;delete r.cur;
 const wrong=g.qs.some((q,i)=>!q.tt&&g.res[i]===false&&q.key);
 log(sid,'completed',`Tự luyện · Trang ${tlIdx(x)} · ${x.title}`,0,{success:true,score:{raw:ok,max:nb}});g.tlRes={ok,n:nb,tt:tok,wrong,hasTT:tt>=0};
 sfx(ok>=nb-1?'win':'ok');save();render()}
function tlNextPage(id){const st=S.st[sid],P=tlPages(st),i=P.findIndex(x=>x.id===id);const nx=P.slice(i+1).find(x=>!(tlR(st)[x.id]||{}).best)||P.find(x=>!(tlR(st)[x.id]||{}).best);return nx}
function tlEndView(){const g=scr,x=isl1(g.id),R=g.tlRes||{},st=S.st[sid];
 if(R.day)return`<div class="game g1 tlgame"><div class="gmid"><section class="card tlend">${jenny(72,R.ok?'happy':'')}<div class="big">${R.ok?'★':'☆'}</div><b>${R.ok?T('Em đã vượt Thử thách hôm nay!','You beat today’s challenge!'):T('Chưa được rồi. Mai thử lại nhé!','Not this time. Try again tomorrow!')}</b>
  <div class="row" style="justify-content:center;gap:8px;margin-top:12px"><button class="btn sm pri" type="button" onclick="go({k:'home',tab:'tl'})">${T('Về Tự luyện','Back to practice')}</button></div></section></div></div>`;
 const nx=tlNextPage(g.id),msg=R.ok>=R.n?T('Giỏi lắm!','Excellent!'):R.ok>=R.n-1?T('Làm tốt lắm!','Well done!'):T('Cố thêm chút nữa nhé!','Keep going!');
 return`<div class="game g1 tlgame"><div class="gmid"><section class="card tlend">${jenny(72,R.ok>=R.n-1?'happy':'')}<div class="big">${R.ok}/${R.n}</div><b>${T(`Xong trang ${tlIdx(x)}! ${msg}`,`Page ${tlIdx(x)} done! ${msg}`)}</b>
  <div style="margin:8px 0">${R.hasTT?`<span class="pill ${R.tt?'warn':''}">${R.tt?T('★ Thử thách đúng','★ Challenge solved'):T('☆ Thử thách chưa đúng','☆ Challenge not solved')}</span>`:''}</div>
  ${R.wrong?`<p class="muted" style="font-size:13px;margin:6px 0 0">${T('Câu làm sai đã ghi vào Sổ lỗi sai.','Mistakes were saved to your mistake book.')}</p>`:''}
  <div class="row" style="justify-content:center;gap:8px;margin-top:12px"><button class="btn sm ghost" type="button" onclick="go({k:'home',tab:'tl'})">${T('Về Tự luyện','Back to practice')}</button>${nx?`<button class="btn sm pri" type="button" onclick="tlGo('${nx.id}')">${T('Trang tiếp','Next page')}</button>`:`<button class="btn sm pri" type="button" onclick="tlGo('${g.id}')">${T('Làm lại (số mới)','Again (new numbers)')}</button>`}</div></section></div></div>`}
{const _v=viewGame1;viewGame1=function(){const g=scr;if(!(g&&g.tl))return _v.apply(this,arguments);if(g.end)return tlEndView();
 const q=q1();if(q.type==='cells'&&(!g.cv||g.cv.length!==nBl(q))){g.cv=q.a.map(()=>'');g.cc=0}
 let h=_v.apply(this,arguments);const n=g.qs.length,nb=g.qs.filter(x=>!x.tt).length;
 h=h.replace('<div class="game g1"','<div class="game g1 tlgame"')
  .replace(/<div class="planks"[^>]*>(?:<i[^>]*><\/i>)*<\/div>/,`<div class="planks tlpl">${g.qs.map((x,k)=>`<i class="${g.res[k]===true?'ok':g.res[k]===false?'bad':k===g.j?'cur':''} ${x.tt?'tt':''}"></i>`).join('')}</div>`)
  .replace(/<span class="hearts"[^>]*>(?:<span[^>]*>❤<\/span>)*<\/span>/,`<span class="pill ${q.tt?'warn':'acc'}">${q.tt?T(`★ +${TL_TT} xu`,`★ +${TL_TT} coins`):T(`Bài ${g.j+1}/${nb}`,`Task ${g.j+1}/${nb}`)}</span>`)
  .replace(/<button class="gx" onclick="[^"]*"/,`<button class="gx" onclick="try{speechSynthesis.cancel()}catch(e){};go({k:'home',tab:'tl'})"`)
  .replace(/<div class="g1pic">@@TLFIG@@<\/div>/,q.type==='cells'?`<div class="g1pic tlfig">${tlFig(q)}</div>`:'');
 return h}}

/* ---------- gợi ý của cô ---------- */
function tlGoiY(st){const id=Object.keys(S.st).find(k=>S.st[k]===st);const l=(typeof ORG_ON!=='undefined'&&ORG_ON&&S.org)?S.org.gd[id]:null;
 return(S.asg||[]).filter(a=>a.loai==='goiy'&&a.g===st.grade&&(!a.hs||a.hs.includes(id))&&(!a.lop||!l||a.lop===l)).sort((p,q)=>q.t-p.t)}
/* asgSeed (53) đổi mục không có tiets thành phiếu: giữ riêng các gợi ý ra ngoài khi nó chạy */
{const _s=asgSeed;asgSeed=function(){const G=(S.asg||[]).filter(a=>a.loai==='goiy');if(G.length)S.asg=S.asg.filter(a=>a.loai!=='goiy');
 try{return _s.apply(this,arguments)}finally{if(G.length)S.asg=(S.asg||[]).concat(G)}}}
function tlGoiYIsl(st){const s=new Set();tlGoiY(st).forEach(a=>(a.isl||[]).forEach(i=>{if(isl1(i))s.add(i)}));return[...s]}

/* ---------- trang Tự luyện ---------- */
function tlRow(st,x,goi){const r=tlR(st)[x.id]||{},op=tlOpen(st,x),b=r.best,cur=r.cur;
 const dots=b||cur?`<div class="vdots">${Array.from({length:6},(_,k)=>{const v=cur?cur.res[k]:k<5?(k<b.ok):b.tt;return`<i class="${v===true||v===1?'d':''} ${k===5?'t':''}"></i>`}).join('')}</div>`:'';
 const sub=!op?T('🔒 Qua Màn 1 của đảo này để mở trang','🔒 Pass Level 1 of this island to open'):cur?T(`Đang làm bài ${Math.min(cur.j+1,5)}/5`,`In progress · task ${Math.min(cur.j+1,5)}/5`):b?T(`Đúng ${b.ok}/${b.n} bài${b.tt?' · có ★':''} · đã làm ${r.n} lần`,`${b.ok}/${b.n} correct${b.tt?' · ★':''} · done ${r.n}×`):goi?T('Cô gợi ý · chưa làm','Teacher suggests · not started'):T('Chưa làm','Not started');
 const btn=!op?'':`<button type="button" class="btn sm ${b&&!cur?'ghost':'pri'}" onclick="tlGo('${x.id}')">${cur?T('Làm tiếp','Continue'):b?T('Làm lại','Again'):T('Làm','Start')}</button>`;
 return`<div class="vrow ${goi?'gy':''} ${op?'':'lk'}"><span class="vno">${tlIdx(x)}</span><div class="grow"><b>${esc(tlLes(x))}</b><small>${esc(x.title)} · ${sub}</small>${dots}</div>${btn}</div>`}
function viewTL(st){const g=curG(),back=`<div class="crumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'nha'})">← ${T('Phòng học','Study room')}</button></div>`;
 if(!TL_G(g))return`<div class="page pgpage vbt">${back}<section class="card"><h2 class="nhah">${spr('selfS',26)} ${T('Tự luyện','Self-practice')}</h2><p class="muted">${T('Vở bài tập Jenny cho lớp của em sắp có. Hiện có cho lớp 1 và lớp 2.','Jenny’s workbook for your grade is coming soon. It is ready for grades 1 and 2.')}</p></section></div>`;
 const P=tlPages(st),goi=tlGoiYIsl(st),self=(st.selfCoins&&st.selfCoins[S.day])||0,TT=PRIM[g].T||[];
 const goiRows=goi.map(isl1).filter(Boolean).filter(x=>!((tlR(st)[x.id]||{}).best)).map(x=>tlRow(st,x,1)).join('');
 const last=P[P.length-1],curTi=last?last.ti||0:0,dx=tlDayIsl(st);
 const sec=ti=>{const L=PRIM[g].isl.filter(x=>(x.ti||0)===ti),op=L.filter(x=>tlOpen(st,x)),dn=L.filter(x=>(tlR(st)[x.id]||{}).best).length;if(!op.length)return'';
  const firstLk=L.find(x=>!tlOpen(st,x)),rows=op.slice().reverse().map(x=>tlRow(st,x,goi.includes(x.id))).join('')+(firstLk&&ti===curTi?tlRow(st,firstLk,0):'');
  const head=`${T('Chủ đề','Topic')} ${ti+1} · ${esc((TT[ti]||[''])[0])}`;
  return ti===curTi?`<div class="vsec">${head} <span class="pill ok vpill">${dn}/${L.length}</span></div>${rows}`:`<details class="vdet"><summary class="vsec">${head} <span class="pill ok vpill">${dn}/${L.length}</span></summary>${rows}</details>`};
 const secs=[...new Set(P.map(x=>x.ti||0))].sort((a,b)=>b-a).map(sec).join('');
 return`<div class="page pgpage vbt">${back}<section class="card"><h2 class="nhah">${spr('selfS',26)} ${T('Tự luyện','Self-practice')}</h2>
  <p class="vsub">${T('Vở bài tập Jenny · em tự chọn trang, làm khi em muốn. Mỗi lần làm là số mới.','Jenny’s workbook · pick a page and practise when you like. New numbers every time.')}</p>
  <div class="vstat"><span class="pill acc">${T(`Xu tự luyện hôm nay ${self}/${SELF_CAP}`,`Practice coins today ${self}/${SELF_CAP}`)}</span><span class="pill ok">${T(`Đã làm ${tlDone(st)} trang`,`${tlDone(st)} pages done`)}</span></div>
  ${goiRows?`<div class="vsec">⭐ ${T('Cô gợi ý','Teacher suggests')}</div>${goiRows}`:''}
  ${dx?`<div class="vtt"><span class="vtrophy">${spr('star',30)}</span><div class="grow"><b>${T('Thử thách hôm nay','Today’s challenge')}</b><div style="font-size:13px">${tlDayOk(st)?T('Đã làm hôm nay · mai có thử thách mới','Done today · new one tomorrow'):T(`+${TL_TT} xu · còn 1 lượt`,`+${TL_TT} coins · 1 try left`)}</div></div><button class="btn sm ${tlDayOk(st)?'ghost':'pri'}" type="button" onclick="tlDayGo()">${tlDayOk(st)?'✓':T('Thử','Try')}</button></div>`:''}
  ${secs||`<p class="muted">${T('Em qua Màn 1 của đảo đầu tiên là mở được trang vở đầu tiên.','Pass Level 1 of your first island to open your first page.')}</p>`}
  <p class="vnote">${T('Trang vở mở khi em qua đảo. Mỗi bài đúng +5 xu, ★ Thử thách +15 xu. Sai thì vào Sổ lỗi sai. Không bắt buộc.','A page opens when you pass its island. +5 coins per task, ★ challenge +15. Mistakes go to your mistake book. Not compulsory.')}</p></section></div>`}

/* ô Tự luyện trong Phòng học */
{const _p=phongBox;phongBox=function(st){let r=_p.apply(this,arguments);try{const g=curG(),on=TL_G(g),n=on?tlGoiYIsl(st).filter(i=>{const x=isl1(i);return x&&tlOpen(st,x)&&!((tlR(st)[i]||{}).best)}).length:0;
 const sub=!on?T('Sắp có','Coming soon'):n?T(`${n} trang cô gợi ý`,`${n} suggested`):T(`Đã làm ${tlDone(st)} trang`,`${tlDone(st)} pages done`);
 r=r.replace(/<button type="button" class="nhat" onclick="toast\(arcT\('Phần Tự luyện sắp có nhé!'[^"]*">([\s\S]*?)<\/button>/,(m,inner)=>`<button type="button" class="nhat" onclick="go({k:'home',tab:'tl'})">${inner.replace(/<small>[^<]*<\/small>/,`<small>${sub}</small>`).replace(/(<span class="nhic">[\s\S]*?)(<\/span>)/,(m2,a,b)=>a+(n?`<i class="herbang">${n>9?'9+':n}</i>`:'')+b)}</button>`)}catch(e){}return r}}
NHA_TABS.push('tl');
{const _v=viewHome1t;viewHome1t=function(){if(scr.tab!=='tl')return _v.apply(this,arguments);const st=S.st[sid];scr.tab='nha';let r;try{r=_v.apply(this,arguments)}finally{scr.tab='tl'}
 const i=r.indexOf('<nav class="bnav"');return viewTL(st)+(i>=0?r.slice(i):'')}}

/* ---------- trang giáo viên: gợi ý trang + xem em tự luyện ---------- */
function gvTLBox(){const g=gvGrade;if(!TL_G(g)||!PRIM[g])return'';const L=PRIM[g].isl,CLS=gvCLS(),wk=Date.now()-7*DAYMS;
 const mine=(S.asg||[]).filter(a=>a.loai==='goiy'&&a.g===g&&!a.hs&&(!a.lop||!gvLop||a.lop===gvLop)).sort((p,q)=>q.t-p.t);
 const list=mine.map(a=>`<div class="task"><div class="row"><div style="flex:1;min-width:160px"><b>⭐ ${a.isl.map(i=>{const x=isl1(i);return x?`Trang ${L.indexOf(x)+1} · ${esc(tlLes(x))}`:''}).filter(Boolean).join(' · ')}</b><div class="muted">Gợi ý ${asgD(a.t)} · ${esc(a.by||'Cô')}</div></div><button class="btn sm" onclick="gvTLDel('${a.id}')">Bỏ gợi ý</button></div></div>`).join('');
 const rows=CLS.map(([id,nm])=>{const st=S.st[id];if(!st)return'';const R=st.tl||{},E=Object.entries(R).filter(([,r])=>r&&r.last);const wkN=E.filter(([,r])=>r.last.t>=wk).length,tot=E.length;
  const ok=E.reduce((s,[,r])=>s+r.best.ok,0),n=E.reduce((s,[,r])=>s+r.best.n,0),tt=E.filter(([,r])=>r.best.tt).length;
  return`<tr><td>${esc(nm)}</td><td>${wkN}</td><td>${tot}</td><td>${n?Math.round(ok/n*100)+'%':'—'}</td><td>${tt}</td></tr>`}).join('');
 return`<section class="card"><div class="secthead"><h2>Tự luyện lớp ${g} · Vở bài tập Jenny</h2></div>
  <p class="muted" style="margin:0 0 6px">Em tự làm, không bắt buộc. Cô không giao, chỉ ⭐ gợi ý trang (em thấy ở đầu trang Tự luyện). Trang chỉ mở khi em đã qua đảo đó.</p>
  <div class="row" style="gap:8px;flex-wrap:wrap;margin:6px 0 10px;align-items:flex-start"><select id="tlIsl" multiple size="5" aria-label="Chọn trang" style="min-width:260px;flex:1">${L.map((x,i)=>`<option value="${x.id}">Trang ${i+1} · ${esc(tlLes(x))} (${esc(x.title)})</option>`).join('')}</select>
  <button class="btn pri" onclick="gvTLAdd()">⭐ Gợi ý</button></div>${list||'<p class="muted">Chưa gợi ý trang nào.</p>'}
  <div style="overflow-x:auto;margin-top:10px"><table class="tbl"><thead><tr><th>Học sinh</th><th>Trang 7 ngày</th><th>Tổng trang</th><th>Đúng</th><th>★</th></tr></thead><tbody>${rows}</tbody></table></div></section>`}
window.gvTLAdd=function(){const isl=[...document.getElementById('tlIsl').selectedOptions].map(o=>o.value);if(!isl.length){toast('Chọn ít nhất 1 trang');return}
 try{asgSeed()}catch(e){}const now=(typeof gvNow==='function'?gvNow():Date.now());(S.asg||(S.asg=[])).push({id:'g'+now.toString(36),loai:'goiy',g:gvGrade,lop:gvLop,isl,t:now,by:gvTen()});
 log('gv','assigned',`Gợi ý Tự luyện · ${isl.length} trang`,0,{});save();render();toast('Đã gợi ý cho lớp '+(gvLop||gvGrade))};
window.gvTLDel=function(id){S.asg=(S.asg||[]).filter(a=>a.id!==id);save();render();toast('Đã bỏ gợi ý')};
{const _g=viewGV;viewGV=function(){const r=_g.apply(this,arguments);try{const b=gvTLBox();if(!b)return r;const i=r.lastIndexOf('<section class="card"><details>');return i<0?r:r.slice(0,i)+b+r.slice(i)}catch(e){return r}}}

Object.assign(I18N,{'Nhà số':'Number house','Gia đình phép tính':'Fact family','Tháp số':'Number pyramid','Tam giác số':'Number triangle'});
document.head.insertAdjacentHTML('beforeend',`<style>
.vbt h2{margin:0}.vsub{font-size:13px;color:var(--muted);margin:2px 0 10px}.vstat{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 4px}
.vsec{font-family:var(--f-display);font-size:20px;margin:16px 0 8px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;color:var(--ink);line-height:1.15}
.vpill{font-family:var(--f-body);font-size:12px}details.vdet>summary{cursor:pointer;list-style:none}details.vdet>summary::-webkit-details-marker{display:none}details.vdet>summary::before{content:'▸';margin-right:2px}details.vdet[open]>summary::before{content:'▾'}
.vrow{display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:10px;background:var(--surface);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--pxk);text-align:left}
.vrow.lk{opacity:.6;box-shadow:var(--f2)}.vrow .grow{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:2px}
.vrow b{font-size:14.5px;line-height:1.25}.vrow small{font-size:12px;color:var(--muted);line-height:1.3}
.vno{font-family:var(--f-display);font-size:22px;min-width:36px;height:34px;padding:0 2px;display:grid;place-items:center;background:var(--sea-soft);color:var(--sea-deep);box-shadow:var(--f2);flex:none}
.vrow.gy{background:var(--sun-soft)}
.vdots{display:flex;gap:3px;margin-top:2px}.vdots i{width:10px;height:10px;background:var(--line);box-shadow:0 0 0 1px var(--pxk)}.vdots i.d{background:var(--leaf)}.vdots i.t{outline:2px solid var(--sun);outline-offset:-2px}.vdots i.t.d{background:var(--sun);outline:0}
.vtt{display:flex;gap:10px;align-items:center;padding:12px;margin:14px 0 4px;background:linear-gradient(180deg,var(--sun-soft),var(--surface));box-shadow:var(--f2),0 4px 0 0 var(--pxk);color:var(--ink);text-align:left}
.vtt .grow{flex:1;min-width:0;display:block!important}.vtt b{font-family:var(--f-display);font-size:20px;font-weight:400}
.vnote{font-size:12.5px;color:var(--muted);margin:12px 0 0}
.tlpl i.tt{flex:.7}.tlpl i.tt:not(.ok):not(.bad):not(.cur){background:var(--sun-soft)}
.tlfig{display:flex;justify-content:center}
.tlfig .tc{width:46px;height:42px;display:grid;place-items:center;font-family:var(--f-display);font-size:28px;line-height:1;background:#FFF4D6;color:#1F2A5A;box-shadow:inset 0 0 0 2px #1F2A5A;border:0;padding:0;flex:none}
.tlfig .tc.e{background:#fff;cursor:pointer}.tlfig .tc.e.cur{background:#DDF3FB;box-shadow:inset 0 0 0 4px #0079C1}.tlfig .tc.e.bad{background:#FDE6DE}
.tlfig .tc.op{background:transparent;box-shadow:none;width:26px;color:var(--ink)}.tlfig .tc.gap{background:transparent;box-shadow:none}
.tlhouse{width:184px}.tlhouse .roof{width:0;height:0;border-left:92px solid transparent;border-right:92px solid transparent;border-bottom:54px solid #E0441A;position:relative}
.tlhouse .roof span{position:absolute;left:-24px;top:16px;width:48px;text-align:center;font-family:var(--f-display);font-size:32px;color:#fff;line-height:1}
.tlhouse .floors{background:#FFF4D6;box-shadow:0 0 0 2px #1F2A5A}.tlhouse .fl{display:grid;grid-template-columns:1fr 1fr}.tlhouse .fl .tc{width:auto}
.tlfam{display:flex;flex-direction:column;align-items:center;gap:6px}.tlfam .eq{display:flex;gap:4px;align-items:center}
.tlsd{position:relative;display:grid;grid-template-columns:46px 30px 46px;grid-template-rows:42px 16px 42px;margin-bottom:6px}
.tlsd .tc:nth-of-type(1){grid-column:2;grid-row:1;justify-self:center;border-radius:50%}.tlsd .tc:nth-of-type(2){grid-column:1;grid-row:3;border-radius:50%}.tlsd .tc:nth-of-type(3){grid-column:3;grid-row:3;border-radius:50%}
.tlsd i{position:absolute;top:40px;width:3px;height:22px;background:var(--pxk,#1F2A5A)}.tlsd i.l1{left:46px;transform:rotate(45deg)}.tlsd i.l2{right:46px;transform:rotate(-45deg)}
.tlrows{display:flex;flex-direction:column;align-items:center;gap:6px}.tlrows .rw{display:flex;gap:6px}
.tlrows.tri{gap:8px}.tlrows.tri .rw{gap:24px}.tlrows.tri .tc{border-radius:50%}
.trisum{font-family:var(--f-display);font-size:20px;color:var(--ink);margin-bottom:2px}
.tlend{text-align:center}.tlend .big{font-family:var(--f-display);font-size:48px;color:var(--leaf);line-height:1.1}
</style>`);
})();
