/* ===================== Hồ sơ học sinh cho giáo viên (chốt 23/10/2026) =====================
   1) Ghi thêm mỗi câu (mọi bản, kể cả bản học sinh) vào st.dd[ngày]:
      f = số câu làm lần đầu, fc = đúng ngay lần đầu, fx = đúng sau khi sửa, fast = trả lời dưới 3 giây,
      gd = số lần mở hướng dẫn, h = [sáng, chiều, tối] (số câu theo khung giờ).
   2) Trang hồ sơ 5 thẻ: Tổng quan · Học tập · Lỗi & bài về nhà · Hoạt động · Ghi chú & giao bài.
   3) Phiếu bài có thể giao riêng cho 1 em (a.hs) và theo lớp (a.lop).
   4) Bản đầy đủ: tạo dữ liệu mẫu 5 tuần cho học sinh lớp 1–5 (trừ Lê Bảo Na). */
{const _r=hsRec;hsRec=function(q,ok,first){let dt=-1;try{dt=(Date.now()-(scr._la||scr.t0||Date.now()))/1000}catch(e){}
  const res=_r.apply(this,arguments);
  try{const st=S.st[sid];if(st&&st.grade<=5){const o=st.dd[hsTodayKey()];if(o){
    if(first){o.f=(o.f||0)+1;if(ok)o.fc=(o.fc||0)+1}else if(ok)o.fx=(o.fx||0)+1;
    if(dt>=0&&dt<3)o.fast=(o.fast||0)+1;
    const h=new Date().getHours(),i=h<12?0:h<18?1:2;o.h=o.h||[0,0,0];o.h[i]++}}}catch(e){}
  return res}}
{const _g=gdOpen;gdOpen=function(){const r=_g.apply(this,arguments);try{if(r!==false&&role==='hs'){const st=S.st[sid];if(st&&st.grade<=5){hsHeal(st,sid);const k=hsTodayKey(),o=st.dd[k]||(st.dd[k]={n:0,c:0,sec:0});o.gd=(o.gd||0)+1}}}catch(e){}return r}}
/* Phiếu: theo lớp (a.lop) và riêng từng em (a.hs) */
{const _m=asgMine;asgMine=function(st){const id=Object.keys(S.st).find(k=>S.st[k]===st);
  const l=(typeof ORG_ON!=='undefined'&&ORG_ON&&S.org)?S.org.gd[id]:null;
  return _m.apply(this,arguments).filter(a=>(!a.hs||a.hs.includes(id))&&(!a.lop||!l||a.lop===l))}}

/* ---------- số liệu ---------- */
function gvTong(st){const t={n:0,c:0,sec:0,f:0,fc:0,fx:0,fast:0,gd:0,h:[0,0,0]};Object.values(st.dd||{}).forEach(o=>{['n','c','sec','f','fc','fx','fast','gd'].forEach(k=>t[k]+=o[k]||0);(o.h||[]).forEach((v,i)=>t.h[i]+=v)});return t}
const pc=(a,b)=>b?Math.round(a/b*100):null;
function gvDang(st){return Object.entries(st.sk||{}).filter(([,e])=>e.r&&e.r.length).map(([k,e])=>({k,ax:e.ax,p:Math.round(e.r.reduce((a,b)=>a+b,0)/e.r.length*100),n:e.r.length,t:e.t})).sort((a,b)=>a.p-b.p)}
function gvCuoi(id,st){const ks=Object.keys(st.dd||{}).filter(k=>st.dd[k].n>0).sort();return ks.length?ks[ks.length-1]:null}
const gvNgay=k=>{if(!k)return'chưa học';const d=new Date(k+'T00:00:00');return`${HS_TH[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`};
function gvGoiY(id,st){const out=[],T=gvTong(st),D=gvDang(st).filter(x=>x.n>=4),nm=Object.keys(st.mist||{}).length,cuoi=gvCuoi(id,st),sc=hsScores(st);
  if(nm>=3)out.push(['Giao luyện lỗi',`Sổ lỗi sai có ${nm} lỗi. Cho em luyện lại các lỗi này.`]);
  const y=D.filter(x=>x.p<70).slice(0,2);if(y.length)out.push(['Giao phiếu dạng yếu',y.map(x=>`${x.k} (${x.p}%)`).join(', ')+'. Giao phiếu riêng ở thẻ "Ghi chú & giao bài".']);
  if(T.n>=30&&T.fast/T.n>.2)out.push(['Nhắc đọc kỹ đề',`${pc(T.fast,T.n)}% câu em trả lời dưới 3 giây, có thể đang bấm bừa.`]);
  if(T.f>=20&&T.fc/T.f<.6)out.push(['Ôn lại cách làm',`Em chỉ đúng ngay lần đầu ${pc(T.fc,T.f)}% câu, thường phải sửa mới đúng.`]);
  if(T.n>=30&&T.gd/T.n>.15)out.push(['Em cần hỗ trợ nhiều',`Em mở hướng dẫn ${T.gd} lần trên ${T.n} câu.`]);
  if(cuoi){const g=(hsToday()-new Date(cuoi+'T00:00:00'))/864e5;if(g>=2)out.push(['Nhắn phụ huynh',`Em đã ${Math.round(g)} ngày chưa vào học.`])}else out.push(['Nhắn phụ huynh','Em chưa vào học lần nào.']);
  const best=HS_AX.filter(a=>sc[a.k].ok).sort((a,b)=>sc[b.k].s-sc[a.k].s)[0];if(best&&sc[best.k].s>=85)out.push(['Khen em',`Em làm tốt mạch ${best.f} (${sc[best.k].s} điểm).`]);
  return out}

/* ---------- giao diện ---------- */
const GV_TABS=[['tq','Tổng quan'],['ht','Học tập'],['loi','Lỗi & bài về nhà'],['hd','Hoạt động'],['gc','Ghi chú & giao bài']];
function gvKpi(a,b,c){return`<div class="kpi"><span class="muted">${a}</span><span class="big">${b}</span>${c?`<span class="muted" style="font-size:12.5px">${c}</span>`:''}</div>`}
function gvBar(p,col){return`<span class="gbar"><i style="width:${Math.max(0,Math.min(100,p||0))}%;background:${col||'var(--sea)'}"></i></span>`}
function gvLich(id,st){
  const dd=st.dd||{},today=hsToday(),s=new Date(HS_OPEN);s.setDate(s.getDate()-((s.getDay()+6)%7));
  const cols=[];let d=new Date(s);while(d<=today){const col=[];for(let i=0;i<7;i++){const k=hsKey(d),o=dd[k],fut=d>today||d<HS_OPEN;
      const n=o?o.n:0,lv=fut?-1:n===0?0:n<10?1:n<20?2:n<30?3:4;col.push(`<i class="gl l${lv}" data-k="${k}" title="${gvNgay(k)}: ${n} câu"></i>`);d.setDate(d.getDate()+1)}cols.push(`<span class="glc">${col.join('')}</span>`)}
  return`<div class="glich" onclick="gvLichTap(event,'${id}')">${cols.join('')}</div><div class="gleg muted">Ít <i class="gl l0"></i><i class="gl l1"></i><i class="gl l2"></i><i class="gl l3"></i><i class="gl l4"></i> Nhiều · bấm vào ô để xem ngày đó</div><div id="glDet" class="task" style="margin-top:8px">${gvLichDet(st,gvCuoi(id,st)||hsTodayKey())}</div>`}
function gvLichDet(st,k){const o=(st.dd||{})[k];if(!o||!o.n)return`<b>${gvNgay(k)}</b> · em không học`;
  return`<b>${gvNgay(k)}</b> · ${o.n} câu · đúng ${o.c} (${pc(o.c,o.n)}%) · ${Math.round((o.sec||0)/60)} phút${o.f?` · đúng ngay lần đầu ${pc(o.fc||0,o.f)}%`:''}${o.gd?` · mở hướng dẫn ${o.gd} lần`:''}`}
window.gvLichTap=(ev,id)=>{const i=ev.target.closest('i[data-k]');if(!i)return;document.getElementById('glDet').innerHTML=gvLichDet(S.st[id],i.dataset.k)};

function gvTabTQ(id,st){
  const sk=hsStreaks(st),T=gvTong(st),sc=hsScores(st),months=Object.keys(st.skm||{}).sort(),cm=hsMonth(hsToday()),prev=months.filter(m=>m<cm).pop(),pm=prev?st.skm[prev]:{};
  const al=alerts(id),gy=gvGoiY(id,st);
  return`<div class="kpis">${gvKpi('Chuỗi ngày học',sk.cur+' ngày','dài nhất '+sk.best)}${gvKpi('Số ngày học',sk.days,'từ đầu năm học')}${gvKpi('Số câu',sk.n,T.n?`đúng ${pc(T.c,T.n)}%`:'')}
   ${gvKpi('Đúng ngay lần đầu',T.f>=10?pc(T.fc,T.f)+'%':'–',T.f>=10?`sửa rồi đúng ${T.fx} câu`:'chưa đủ dữ liệu')}${gvKpi('Thời gian mỗi câu',T.n?Math.round(T.sec/T.n)+' giây':'–',T.n?`trả lời dưới 3 giây: ${pc(T.fast,T.n)}%`:'')}${gvKpi('Mở hướng dẫn',T.gd+' lần',T.n?`${(T.gd/T.n*100).toFixed(0)} lần / 100 câu`:'')}</div>
  <div class="grid g2">
   <section class="card"><h2>Sức mạnh Toán</h2><p class="muted" style="margin:4px 0 8px">Điểm 6 mạch theo 10 lần làm gần nhất mỗi dạng.${prev?` Vạch mờ là tháng ${Number(prev.slice(5))}.`:''}</p>
    ${HS_AX.map(a=>{const s=sc[a.k],p=pm&&pm[a.k];return`<div class="grow"><span>${a.f}</span>${!s.taught?'<span class="muted">chưa học</span>':!s.ok?'<span class="muted">chưa đủ bài</span>':`<span class="gbar"><i style="width:${s.s}%;background:${s.s>=80?'var(--leaf)':s.s>=60?'var(--sun)':'var(--coral)'}"></i>${p!=null?`<b class="gprev" style="left:${p}%"></b>`:''}</span><b>${s.s}${p!=null?` <small class="muted">${s.s>=p?'+':''}${s.s-p}</small>`:''}</b>`}</div>`}).join('')}</section>
   <section class="card"><h2>Gợi ý cho cô</h2>${gy.length?gy.map(([t,m])=>`<div class="task"><b>${t}</b><div class="muted">${esc(m)}</div></div>`).join(''):'<p class="muted">Em đang học ổn, chưa có gợi ý.</p>'}
    <h3 style="margin-top:14px">Cảnh báo</h3><div class="row" style="gap:6px;margin-top:6px">${al.length?al.map(a=>`<span class="pill ${a.c}">${esc(a.t)}</span>`).join(''):'<span class="pill ok">Ổn</span>'}</div></section>
  </div>`}

function gvTabHT(id,st){
  const g=st.grade,P=PRIM[g],D=gvDang(st);
  const chu=P.T.map((t,ti)=>{const L=P.isl.filter(x=>(x.ti||0)===ti);if(!L.length)return'';
    let a=0,b=0,hoc=0;const ket=[];L.forEach(x=>{const s=st.p1[x.id]||{m:[],fails:[]};b+=x.nm||3;a+=(s.m||[]).filter(Boolean).length;if(s.intro||(s.m||[]).some(Boolean))hoc++;(s.fails||[]).forEach((f,i)=>{if(f>=2&&!s.m[i])ket.push(shortTitle(x.title))})});
    if(!hoc)return`<tr class="muted"><td>Chủ đề ${ti+1}: ${esc(t[0])}</td><td>chưa học</td><td></td></tr>`;
    return`<tr><td><b>Chủ đề ${ti+1}: ${esc(t[0])}</b><div class="muted">${hoc}/${L.length} đảo đã vào</div></td><td style="min-width:150px">${gvBar(pc(a,b),'var(--sun)')} <span class="muted">${a}/${b} màn</span></td><td>${ket.length?[...new Set(ket)].slice(0,3).map(k=>`<span class="pill bad">Kẹt ${esc(k)}</span>`).join(' '):'<span class="pill ok">Ổn</span>'}</td></tr>`}).join('');
  return`<section class="card"><h2>Lịch học năm học</h2><p class="muted" style="margin:4px 0 0">Mỗi ô là một ngày, màu đậm là làm nhiều câu.</p>${gvLich(id,st)}</section>
  <section class="card"><h2>Tiến độ SGK</h2><div class="tablewrap"><table><tr><th>Chủ đề</th><th>Màn đã qua</th><th>Đảo bị kẹt</th></tr>${chu}</table></div></section>
  <section class="card"><h2>Tỉ lệ đúng từng dạng bài</h2><p class="muted" style="margin:4px 0 0">10 lần làm gần nhất mỗi dạng, dạng yếu xếp trước.</p>${D.length?`<div class="tablewrap"><table><tr><th>Dạng bài</th><th>Mạch</th><th>Đúng</th><th>Số lần</th><th>Lần cuối</th></tr>${D.map(x=>`<tr><td>${esc(x.k)}</td><td>${HS_AXN[x.ax]||''}</td><td style="min-width:140px">${gvBar(x.p,x.p>=80?'var(--leaf)':x.p>=60?'var(--sun)':'var(--coral)')} <b>${x.p}%</b></td><td>${x.n}</td><td>${x.t?gvNgay(hsKey(new Date(x.t))):''}</td></tr>`).join('')}</table></div>`:'<p class="muted">Chưa có dữ liệu.</p>'}</section>`}

function gvTabLoi(id,st){
  const M=Object.entries(st.mist||{}).sort((a,b)=>b[1].n-a[1].n),A=asgMine(st);
  return`<section class="card"><h2>Sổ lỗi sai <span class="pill">${M.length} lỗi</span></h2><p class="muted" style="margin:4px 0 0">Mỗi lỗi cần đúng 2 lần liền mới ra khỏi sổ.</p>
   ${M.length?`<div class="tablewrap"><table><tr><th>Lỗi</th><th>Ở đảo</th><th>Sai</th><th>Đúng liền</th><th>Ghi ngày</th></tr>${M.map(([k,m])=>{const x=isl1(m.id);return`<tr><td>${esc(m.label||'')}</td><td>${x?esc(x.title):''}</td><td><b>${m.n}</b> lần</td><td>${m.streak||0}/2</td><td>Ngày ${m.day}</td></tr>`}).join('')}</table></div>`:'<p class="muted">Sổ đang trống.</p>'}</section>
  <section class="card"><h2>Phiếu bài cô đã giao</h2>${A.length?`<div class="tablewrap"><table><tr><th>Phiếu</th><th>Giao · hạn</th><th>Kết quả</th></tr>${A.sort((p,q)=>q.t-p.t).map(a=>{const s=asgState(st,a),b=s.r.best;return`<tr><td><b>${esc(asgName(a))}</b><div class="muted">${a.n} câu · ${a.hs?'riêng cho em':'cả lớp'} · ${esc(a.by||'')}</div></td><td>${asgD(a.t)}${a.due?' · '+asgD(a.due):''}</td><td>${s.done?`<span class="pill ${b.ok/b.n>=.8?'ok':'acc'}">${b.ok}/${b.n} đúng</span>`:s.doing?'<span class="pill acc">đang làm</span>':'<span class="pill warn">chưa làm</span>'}${s.late?' <span class="pill bad">quá hạn</span>':''}</td></tr>`}).join('')}</table></div>`:'<p class="muted">Chưa có phiếu nào.</p>'}
   <p class="muted" style="margin:10px 0 0">Bài về nhà bắt buộc (Luyện lỗi có mục tiêu, Phiếu luyện tập) và khóa/mở từng phần đang chạy ở bản thử trên claude.ai, sẽ đưa vào đây ở bước sau.</p></section>`}

function gvTabHD(id,st){
  const T=gvTong(st),P=st.pets&&st.pets.list||[],ev=S.events.filter(e=>e.actor.account.name===id).slice(-20).reverse(),hs=T.h[0]+T.h[1]+T.h[2];
  return`<div class="grid g2">
   <section class="card"><h2>Phần thưởng</h2><div class="kpis" style="margin-top:8px">${gvKpi('Sao',totalStars(st),'SGK '+p1Stars(st)+' · Jenny '+p2Stars(st))}${gvKpi('Xu',st.coins,'')}</div>
    <p style="margin:12px 0 4px"><b>Thú cưng:</b> ${P.length?P.map(p=>esc(p.name||(PET_SP[p.sp]||[''])[0])).join(', '):'<span class="muted">chưa nuôi</span>'}</p>
    <p style="margin:4px 0"><b>Thẻ cô tặng:</b> ${(st.badges||[]).length?st.badges.slice(-6).map(b=>`<span class="pill acc">♥ ${esc(b.t)}</span>`).join(' '):'<span class="muted">chưa có</span>'}</p>
    <p style="margin:4px 0"><b>Nhận xét gần nhất:</b> ${(st.comments||[]).length?esc(st.comments[st.comments.length-1].t):'<span class="muted">chưa có</span>'}</p></section>
   <section class="card"><h2>Khung giờ học</h2>${hs?['Sáng','Chiều','Tối'].map((t,i)=>`<div class="grow"><span>${t}</span>${gvBar(pc(T.h[i],hs))}<b>${pc(T.h[i],hs)}%</b></div>`).join(''):'<p class="muted">Chưa đủ dữ liệu.</p>'}
    <p class="muted" style="margin:10px 0 0">Tổng thời gian học: ${Math.round(T.sec/60)} phút.</p></section></div>
  <section class="card"><h2>Hoạt động gần đây</h2>${ev.length?`<div class="log">${ev.map(e=>`Ngày ${evDay(e)} · ${e.verb.display.vi} · ${e.object.definition.name.vi}${e.result.success===true?' ✓':e.result.success===false?' ✗':''}`).map(esc).join('\n')}</div>`:'<p class="muted">Chưa có hoạt động.</p>'}</section>`}

function gvTabGC(id,st){
  const N=st.gvNote||[],g=st.grade,hoc=PRIM[g].isl.filter(x=>{const s=st.p1[x.id];return s&&(s.intro||(s.m||[]).some(Boolean))});
  return`<div class="grid g2">
   <section class="card"><h2>Ghi chú riêng của cô</h2><p class="muted" style="margin:4px 0 8px">Em và phụ huynh không thấy phần này.</p>
    <form onsubmit="gvGhiChu(event,'${id}')" class="grid" style="gap:8px"><textarea id="gcT" rows="3" maxlength="300" placeholder="Ví dụ: Em hay quên đơn vị, nhắc kiểm tra lại." aria-label="Ghi chú"></textarea><div><button class="btn pri">Lưu ghi chú</button></div></form>
    ${N.slice().reverse().map((n,i)=>`<div class="task"><div class="row" style="justify-content:space-between"><span class="muted">Ngày ${n.d} · ${esc(n.by||'')}</span><button class="btn sm" onclick="gvXoaGC('${id}',${N.length-1-i})">Xóa</button></div><div>${esc(n.t)}</div></div>`).join('')}</section>
   <section class="card"><h2>Ghi nhận và nhận xét</h2><div class="row" style="gap:6px;margin-top:8px">${['Cố gắng','Cách giải hay','Giúp bạn'].map(b=>`<button class="btn sm" onclick="gvTang('${id}','${b}')">♥ ${b}</button>`).join('')}</div>
    <div class="grid" style="gap:8px;margin-top:10px"><select id="gcNx" aria-label="Mẫu nhận xét">${['Con làm bài chăm, cô rất vui.','Con cần đọc kỹ đề hơn.','Con nên ôn lại bài cũ 10 phút mỗi tối.','Hôm nay con tiến bộ rõ rệt.'].map(c=>`<option>${c}</option>`).join('')}</select><div><button class="btn pri" onclick="gvNhanXet('${id}')">Gửi nhận xét</button></div></div>
    <p class="muted" style="margin:8px 0 0">Thẻ và nhận xét hiện trong báo cáo phụ huynh.</p></section></div>
  <section class="card"><h2>Giao phiếu riêng cho em</h2>${g>5?'<p class="muted">Đang làm cho lớp 6–9.</p>':hoc.length?`<form onsubmit="gvGiaoRieng(event,'${id}')"><p class="muted" style="margin:4px 0 8px">Chọn 1–3 tiết em đã học. Câu số mới mỗi lần làm, không tính sao.</p>
    <div class="gpick">${hoc.map(x=>`<label><input type="checkbox" name="gt" value="${x.id}"> ${esc(shortTitle(x.title))}</label>`).join('')}</div>
    <div class="row" style="gap:8px;margin-top:10px"><select id="grN" aria-label="Số câu">${[5,6,8,10].map(n=>`<option value="${n}">${n} câu</option>`).join('')}</select><select id="grD" aria-label="Hạn">${[1,2,3,7].map(n=>`<option value="${n}">Hạn ${n} ngày</option>`).join('')}</select><button class="btn pri">Giao phiếu</button></div></form>`:'<p class="muted">Em chưa học đảo nào.</p>'}</section>`}

window.gvGhiChu=(e,id)=>{e.preventDefault();const t=document.getElementById('gcT').value.trim();if(!t)return;const st=S.st[id];(st.gvNote=st.gvNote||[]).push({d:S.day,by:gvTen(),t});save();render();toast('Đã lưu ghi chú')};
window.gvXoaGC=(id,i)=>{const st=S.st[id];st.gvNote.splice(i,1);save();render();toast('Đã xóa ghi chú')};
window.gvTang=(id,b)=>{S.st[id].badges.push({t:b,day:S.day,from:'cô'});log(id,'awarded',b,0,{});save();render();toast('Đã tặng thẻ "'+b+'"')};
window.gvNhanXet=(id)=>{S.st[id].comments.push({day:S.day,t:document.getElementById('gcNx').value});save();render();toast('Đã gửi nhận xét')};
window.gvGiaoRieng=(e,id)=>{e.preventDefault();const t=[...document.querySelectorAll('input[name=gt]:checked')].map(x=>x.value);if(!t.length||t.length>3){toast('Chọn 1 đến 3 tiết');return}
  const now=Date.now(),d=+document.getElementById('grD').value,st=S.st[id];
  asgAll().push({id:'r'+now.toString(36),g:st.grade,lop:(S.org&&S.org.gd[id])||gvLop,hs:[id],tiets:t,n:+document.getElementById('grN').value,t:now,due:now+d*DAYMS,by:gvTen()});
  log('gv','assigned','Phiếu riêng · '+st.name,0,{});save();go({k:'gvhs',id,tab:'loi'});toast('Đã giao phiếu riêng cho '+st.name)};

function viewGVHS(id){
  const st=S.st[id];if(!st){scr={k:'home'};return viewGV()}
  if(st.grade<=5)hsHeal(st,id);
  const CLS=gvCLS(),i=CLS.findIndex(s=>s[0]===id),pv=CLS[i-1],nx=CLS[i+1],tab=scr.tab||'tq',l=typeof lopCua==='function'?lopCua(id):null;
  const gvs=l&&S.org?l.gv.map(g=>(S.org.gv.find(x=>x.id===g)||{}).ten).filter(Boolean).join(', '):'';
  const body=st.grade>5?`<section class="card"><p class="muted">Hồ sơ chi tiết đang có cho lớp 1–5. Lớp 6–9 làm ở bước sau.</p></section>${gvTabGC(id,st)}`
    :tab==='ht'?gvTabHT(id,st):tab==='loi'?gvTabLoi(id,st):tab==='hd'?gvTabHD(id,st):tab==='gc'?gvTabGC(id,st):gvTabTQ(id,st);
  return`<div class="grid">
   <div class="row" style="justify-content:space-between"><button class="btn sm" onclick="go({k:'home'})">← Lớp ${l?esc(l.ten):st.grade}</button>
    <div class="row" style="gap:6px">${pv?`<button class="btn sm" onclick="go({k:'gvhs',id:'${pv[0]}',tab:'${tab}'})" aria-label="Em trước">‹ ${esc(pv[1].split(' ').pop())}</button>`:''}${nx?`<button class="btn sm" onclick="go({k:'gvhs',id:'${nx[0]}',tab:'${tab}'})" aria-label="Em sau">${esc(nx[1].split(' ').pop())} ›</button>`:''}</div></div>
   <section class="card ghead"><span class="av gav">${initials(st.name)}</span><div style="min-width:0"><h1 style="font-size:28px;margin:0">${esc(st.name)}</h1>
    <div class="muted">Tài khoản ${esc(id)} · Lớp ${l?esc(l.ten):st.grade}${gvs?' · '+esc(gvs):''} · học gần nhất: ${gvNgay(st.grade<=5?gvCuoi(id,st):null)}</div>
    <div class="row" style="gap:6px;margin-top:6px"><span class="pill">${totalStars(st)} ★</span><span class="pill">${st.coins} xu</span>${st.active?`<span class="pill acc">Toán Jenny${S.org&&S.org.nl[id]&&!(l&&l.tj.on)?' · ngoại lệ':' · theo lớp'}</span>`:''}</div></div></section>
   ${st.grade>5?'':`<div class="seg gtabs" role="tablist" aria-label="Hồ sơ">${GV_TABS.map(([k,t])=>`<button role="tab" class="${k===tab?'on':''}" aria-selected="${k===tab}" onclick="go({k:'gvhs',id:'${id}',tab:'${k}'})">${t}</button>`).join('')}</div>`}
   ${body}</div>`}
{const _vg=viewGV;viewGV=function(){if(scr&&scr.k==='gvhs')return viewGVHS(scr.id);return _vg.apply(this,arguments)}}

/* ---------- dữ liệu mẫu (bản đầy đủ) ---------- */
function gvMau(){
  if(typeof ORG_ON==='undefined'||!ORG_ON||!S||!S.org||S.org.mauHS||role==='hs')return; /* chỉ tạo khi mở trang giáo viên/quản lý/phụ huynh */S.org.mauHS=1;
  const NG=36;if(S.day<NG)S.day=NG;
  STUDENTS.forEach(([id,n,g])=>{const st=S.st[id];if(!st||g>5||id==='na')return;hsHeal(st,id);if(Object.values(st.dd).some(o=>o.n>0))return;
    let sd=[...id].reduce((a,c)=>a*31+c.charCodeAt(0),7)>>>0;const rnd=()=>(sd=(sd*1103515245+12345)>>>0)/4294967296;
    const cham=.35+rnd()*.6,gioi=.55+rnd()*.37,bua=rnd()<.3?.25+rnd()*.15:rnd()*.08,khung=rnd()<.5?2:1;
    for(let d=1;d<=NG;d++){if(rnd()>cham)continue;const k=hsKey(hsDayDate(d)),q=8+Math.floor(rnd()*22),c=Math.round(q*Math.min(.98,gioi+(rnd()-.5)*.15)),f=Math.round(q*.8),h=[0,0,0];h[khung]=Math.round(q*.75);h[rnd()<.5?0:1]+=q-h[khung];
      st.dd[k]={n:q,c,sec:Math.round(q*(bua>.2?8+rnd()*8:22+rnd()*30)),f,fc:Math.round(f*Math.min(.98,gioi-.05+rnd()*.08)),fx:Math.round((q-f)*.6),fast:Math.round(q*bua),gd:Math.floor(rnd()*(gioi<.7?5:2)),h};
      if(d>NG-5)simDay(id,d,Math.min(q,8),gioi,'Luyện tập')}
    const L=PRIM[g].isl,ki=Math.min(L.length,3+Math.floor(cham*10));
    for(let i=0;i<ki;i++){const x=L[i],s=st.p1[x.id]||(st.p1[x.id]={intro:false,m:Array(x.nm||3).fill(false),fails:Array(x.nm||3).fill(0)});s.intro=true;
      s.m=s.m.map((_,j)=>i<ki-1?rnd()<gioi+.15:j===0&&rnd()<gioi);s.fails=s.m.map(v=>v?(rnd()<.3?1:0):(rnd()<.15?2:1))}
    const hoc=new Set(L.slice(0,ki).map(x=>x.id)),kinds=Object.entries(hsIndex(g).kinds).filter(([,v])=>v.src.some(s=>hoc.has(s[0])));
    kinds.forEach(([kd,v],j)=>{const kg=Math.min(.98,Math.max(.2,gioi+(rnd()-.55)*.5));st.sk[kd]={r:Array.from({length:5+Math.floor(rnd()*6)},()=>rnd()<kg?1:0),t:hsDayDate(NG-Math.floor(rnd()*10)).getTime(),ax:v.ax}});
    const sm={};HS_AX.forEach(a=>{const sc=hsScores(st)[a.k];if(sc.ok)sm[a.k]=Math.max(0,sc.s-Math.round(rnd()*18-3))});st.skm['2026-09']=sm;hsSnap(st);
    const nmi=gioi<.7?3+Math.floor(rnd()*3):Math.floor(rnd()*3);kinds.slice(0,nmi*3).filter((_,j)=>j%3===0).forEach(([kd,v])=>{const s0=v.src.find(s=>hoc.has(s[0]));if(s0)mist(st)[`${s0[0]}|${s0[1]}|${s0[2]}`]={id:s0[0],lv:s0[1],gi:s0[2],label:kd,n:1+Math.floor(rnd()*3),streak:rnd()<.3?1:0,day:NG-Math.floor(rnd()*12)}});
    st.coins=60+Math.floor(rnd()*300);if(rnd()<.4)st.badges.push({t:'Cố gắng',day:NG-3,from:'cô'})});
  S.day=NG;save();
}
{const _r=render;render=function(){try{gvMau()}catch(e){console.error(e)}return _r.apply(this,arguments)}}
document.head.insertAdjacentHTML('beforeend',`<style>
.gbar{position:relative;display:inline-block;width:100%;max-width:220px;height:10px;background:var(--surface2);border:1px solid var(--line);vertical-align:middle}
.gbar i{position:absolute;left:0;top:0;bottom:0}.gprev{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--ink);opacity:.45}
.grow{display:grid;grid-template-columns:minmax(90px,140px) 1fr auto;gap:10px;align-items:center;padding:6px 0}
.glich{display:flex;gap:3px;overflow-x:auto;padding:10px 0 4px}.glc{display:flex;flex-direction:column;gap:3px}
.gl{display:inline-block;width:13px;height:13px;background:var(--surface2);border:1px solid var(--line);cursor:pointer}
.gl.l-1{visibility:hidden}.gl.l1{background:#BDE7C8}.gl.l2{background:#7FD19A}.gl.l3{background:#3DB26A}.gl.l4{background:#1E7D45}
.gleg{display:flex;gap:4px;align-items:center;font-size:12.5px}.gleg .gl{cursor:default}
.ghead{display:flex;gap:14px;align-items:center}.gav{width:56px;height:56px;font-size:20px;flex:none}
.gtabs{flex-wrap:wrap;max-width:100%}
.gpick{display:flex;flex-wrap:wrap;gap:6px 14px;max-height:180px;overflow:auto}.gpick label{font-size:14px;white-space:nowrap}
.lnk{all:unset;cursor:pointer;font-weight:700;text-decoration:underline;text-underline-offset:3px}.lnk:focus-visible{outline:2px solid var(--sea)}
</style>`);
