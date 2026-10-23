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
const GV_YEU=50,GV_NEN=70,GV_MIN=4; /* dạng yếu: đúng dưới 50%, làm ít nhất 4 lần; 50–70% nên luyện */
const pc=(a,b)=>b?Math.round(a/b*100):null;
function gvDang(st){return Object.entries(st.sk||{}).filter(([,e])=>e.r&&e.r.length).map(([k,e])=>({k,ax:e.ax,p:Math.round(e.r.reduce((a,b)=>a+b,0)/e.r.length*100),n:e.r.length,t:e.t})).sort((a,b)=>a.p-b.p)}
function gvCuoi(id,st){const ks=Object.keys(st.dd||{}).filter(k=>st.dd[k].n>0).sort();return ks.length?ks[ks.length-1]:null}
const gvNgay=k=>{if(!k)return'chưa học';const d=new Date(k+'T00:00:00');return`${HS_TH[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`};
function gvGoiY(id,st,al){const out=[],T=gvTong(st),cuoi=gvCuoi(id,st),sc=hsScores(st),coKhong=(al||[]).some(a=>/Không học/.test(a.t));
  if(T.n>=30&&T.fast/T.n>.2)out.push({t:'Nhắc đọc kỹ đề',c:'warn',m:`${pc(T.fast,T.n)}% câu em trả lời dưới 3 giây, có thể đang bấm bừa.`});
  if(T.f>=20&&T.fc/T.f<.6)out.push({t:'Ôn lại cách làm',c:'warn',m:`Em chỉ đúng ngay lần đầu ${pc(T.fc,T.f)}% câu.`});
  if(T.n>=30&&T.gd/T.n>.15)out.push({t:'Cần hỗ trợ nhiều',c:'warn',m:`Em mở hướng dẫn ${T.gd} lần trên ${T.n} câu.`});
  if(!coKhong){if(cuoi){const g=Math.round((hsToday()-new Date(cuoi+'T00:00:00'))/864e5);if(g>=2)out.push({t:`Nhắn phụ huynh: ${g} ngày chưa học`,c:'warn',m:'Em đã lâu chưa vào học.'})}else out.push({t:'Nhắn phụ huynh: chưa học lần nào',c:'warn',m:'Em chưa vào học.'})}
  const best=HS_AX.filter(a=>sc[a.k].ok).sort((a,b)=>sc[b.k].s-sc[a.k].s)[0];if(best&&sc[best.k].s>=85)out.push({t:`Khen em: giỏi ${best.f}`,c:'ok',m:`${sc[best.k].s} điểm.`});
  return out}
/* điểm mạch theo cửa sổ tháng: trung bình các ảnh chụp tháng (st.skm) trong n tháng gần nhất */
function gvThang(n){const d=hsToday(),out=[];for(let i=0;i<n;i++){const x=new Date(d.getFullYear(),d.getMonth()-i,1);out.push(hsMonth(x))}return out}
function gvMach(st,n){const M=gvThang(n),o={};HS_AX.forEach(a=>{const v=M.map(m=>(st.skm||{})[m]).filter(x=>x&&x[a.k]!=null).map(x=>x[a.k]);if(v.length)o[a.k]=Math.round(v.reduce((p,q)=>p+q,0)/v.length)});return o}
function gvTBKhoi(g){const o={},c={};STUDENTS.filter(s=>s[2]===g).forEach(([id])=>{const st=S.st[id];if(!st)return;const m=gvMach(st,3);Object.entries(m).forEach(([k,v])=>{o[k]=(o[k]||0)+v;c[k]=(c[k]||0)+1})});Object.keys(o).forEach(k=>o[k]=Math.round(o[k]/c[k]));return{v:o,n:STUDENTS.filter(s=>s[2]===g).length}}
/* biểu đồ mạng nhện (SVG, theo màu của trang); L = [{v:{trục:điểm}, c:lớp CSS}] */
function gvRadar(L,lab){const cx=160,cy=140,R=92,n=HS_AX.length,pt=(i,v)=>{const a=(-90+360/n*i)*Math.PI/180;return[cx+Math.cos(a)*R*v/100,cy+Math.sin(a)*R*v/100]};
  const pts=v=>HS_AX.map((a,i)=>pt(i,v[a.k]!=null?v[a.k]:0).map(x=>x.toFixed(1)).join(',')).join(' ');
  const ring=v=>HS_AX.map((_,i)=>pt(i,v).map(x=>x.toFixed(1)).join(',')).join(' ');
  return`<svg class="gradar" viewBox="0 0 320 295" role="img" aria-label="Sức mạnh Toán: ${HS_AX.map(a=>`${a.f} ${lab[a.k]}`).join(', ')}">
   ${[25,50,75,100].map(v=>`<polygon points="${ring(v)}" class="gr-ring"/>`).join('')}
   ${HS_AX.map((_,i)=>{const[x,y]=pt(i,100);return`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="gr-ring"/>`}).join('')}
   ${L.filter(l=>Object.keys(l.v).length).map(l=>`<polygon points="${pts(l.v)}" class="${l.c}"/>`).join('')}
   ${HS_AX.map((a,i)=>{const v=L[L.length-1].v[a.k];if(v==null)return'';const[x,y]=pt(i,v);return`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" class="gr-dot"/>`}).join('')}
   ${HS_AX.map((a,i)=>{const[x,y]=pt(i,128),an=x<cx-8?'end':x>cx+8?'start':'middle',v=L[L.length-1].v[a.k];return`<text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="${an}" class="gr-lb${v==null?' dim':''}">${a.n}<tspan x="${x.toFixed(1)}" dy="14" class="gr-v">${lab[a.k]}</tspan></text>`}).join('')}
  </svg>`}

/* ---------- giao diện ---------- */
const GV_TABS=[['tq','Tổng quan'],['hdht','Hoạt động học tập'],['loi','Lỗi & bài về nhà'],['gc','Ghi chú & giao bài']];
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

function gvSucManh(id,st){
  const sc=hsScores(st),m3=gvMach(st,3),m6=gvMach(st,6),tb=gvTBKhoi(st.grade),du=Object.keys(m3).length;
  const lab=Object.fromEntries(HS_AX.map(a=>[a.k,!sc[a.k].taught?'chưa học':m3[a.k]!=null?m3[a.k]:'chưa đủ']));
  const bars=HS_AX.map(a=>{const v=m3[a.k],v6=m6[a.k],t=tb.v[a.k];return`<div class="grow"><span>${a.f}</span>${v==null?`<span class="muted">${sc[a.k].taught?'chưa đủ bài':'chưa học'}</span>`:`<span class="gbar"><i style="width:${v}%;background:${v>=80?'var(--leaf)':v>=60?'var(--sun)':'var(--coral)'}"></i>${t!=null?`<b class="gprev" style="left:${t}%" title="TB khối ${t}"></b>`:''}</span><b>${v}</b>`}</div>${v!=null?`<div class="gsub muted">6 tháng: ${v6!=null?v6:'–'} · khối: ${t!=null?`${t} (${v>=t?'+':'−'}${Math.abs(v-t)})`:'–'}</div>`:''}`}).join('');
  return{radar:`${gvRadar([{v:tb.v,c:'gr-tb'},{v:m6,c:'gr-6'},{v:m3,c:'gr-cur'}],lab)}<div class="gr-leg muted"><span><i class="cur"></i> Em · 3 tháng gần nhất</span><span><i class="s6"></i> Em · 6 tháng gần nhất</span><span><i class="tb"></i> TB học sinh Jenny khối ${st.grade} (${tb.n} em)</span></div>
    ${du<3?`<p class="hint" style="margin:10px 0 0">Em mới có điểm ở ${du} mạch nên hình còn hẹp.</p>`:''}`,bars}}
function gvTabTQ(id,st,ph){
  const sk=hsStreaks(st),T=gvTong(st),al=alerts(id),gy=gvGoiY(id,st,al).filter(g=>!ph||!/Nhắn phụ huynh/.test(g.t)),SM=gvSucManh(id,st);
  return`<div class="kpis">${gvKpi('Chuỗi ngày học',sk.cur+' ngày','dài nhất '+sk.best)}${gvKpi('Số ngày học',sk.days,'từ đầu năm học')}${gvKpi('Số câu',sk.n,T.n?`đúng ${pc(T.c,T.n)}%`:'')}
   ${gvKpi('Đúng ngay lần đầu',T.f>=10?pc(T.fc,T.f)+'%':'–',T.f>=10?`sửa rồi đúng ${T.fx} câu`:'chưa đủ dữ liệu')}${gvKpi('Thời gian mỗi câu',T.n?Math.round(T.sec/T.n)+' giây':'–',T.n?`trả lời dưới 3 giây: ${pc(T.fast,T.n)}%`:'')}${gvKpi('Mở hướng dẫn',T.gd+' lần',T.n?`${(T.gd/T.n*100).toFixed(0)} lần / 100 câu`:'')}</div>
  <div class="grid gpair">
   <section class="card"><h2>Sức mạnh Toán</h2><p class="muted" style="margin:4px 0 0">Điểm 6 mạch, so với chính em và với các bạn cùng khối học Jenny.</p>${SM.radar}</section>
   <section class="card"><h2>Điểm từng mạch</h2><p class="muted" style="margin:4px 0 6px">Thanh: điểm 3 tháng gần nhất. Vạch mờ: trung bình khối.</p>${SM.bars}
    <h3 style="margin-top:14px">${ph?'Cần lưu ý':'Cảnh báo'}</h3><div class="row" style="gap:6px;margin-top:6px">${al.length||gy.length?al.map(a=>`<span class="pill ${a.c}">${esc(a.t)}</span>`).join('')+gy.map(g=>`<span class="pill ${g.c}" title="${esc(g.m)}">${esc(g.t)}</span>`).join(''):'<span class="pill ok">Ổn</span>'}</div></section>
  </div>`}

function gvTabHT(id,st){
  const g=st.grade,P=PRIM[g],D=gvDang(st);
  const chu=P.T.map((t,ti)=>{const L=P.isl.filter(x=>(x.ti||0)===ti);if(!L.length)return'';
    let a=0,b=0,hoc=0;const ket=[];L.forEach(x=>{const s=st.p1[x.id]||{m:[],fails:[]};b+=x.nm||3;a+=(s.m||[]).filter(Boolean).length;if(s.intro||(s.m||[]).some(Boolean))hoc++;(s.fails||[]).forEach((f,i)=>{if(f>=2&&!s.m[i])ket.push(shortTitle(x.title))})});
    if(!hoc)return`<tr class="muted"><td>Chủ đề ${ti+1}: ${esc(t[0])}</td><td>chưa học</td><td></td></tr>`;
    return`<tr><td><b>Chủ đề ${ti+1}: ${esc(t[0])}</b><div class="muted">${hoc}/${L.length} đảo đã vào</div></td><td style="min-width:150px">${gvBar(pc(a,b),'var(--sun)')} <span class="muted">${a}/${b} màn</span></td><td>${ket.length?[...new Set(ket)].slice(0,3).map(k=>`<span class="pill bad">Kẹt ${esc(k)}</span>`).join(' '):'<span class="pill ok">Ổn</span>'}</td></tr>`}).join('');
  const T=gvTong(st),hs=T.h[0]+T.h[1]+T.h[2];
  return`<section class="card glichcard"><div><h2>Lịch học năm học</h2><p class="muted" style="margin:4px 0 0">Mỗi ô là một ngày, màu đậm là làm nhiều câu.</p>${gvLich(id,st)}</div>
   <div><h3>Khung giờ học</h3>${hs?['Sáng','Chiều','Tối'].map((t,i)=>`<div class="grow"><span>${t}</span>${gvBar(pc(T.h[i],hs))}<b>${pc(T.h[i],hs)}%</b></div>`).join(''):'<p class="muted">Chưa đủ dữ liệu.</p>'}
   <p class="muted" style="margin:6px 0 0">Tổng thời gian học: ${Math.round(T.sec/60)} phút (khoảng ${Math.round(T.sec/60/Math.max(1,Object.values(st.dd||{}).filter(o=>o.n).length))} phút mỗi ngày học).</p></div></section>
  <section class="card"><h2>Tiến độ SGK</h2><div class="tablewrap"><table><tr><th>Chủ đề</th><th>Màn đã qua</th><th>Đảo bị kẹt</th></tr>${chu}</table></div></section>
  <section class="card"><h2>Tỉ lệ đúng từng dạng bài</h2><p class="muted" style="margin:4px 0 0">10 lần làm gần nhất mỗi dạng, dạng yếu xếp trước (10 dạng yếu nhất).</p>${gvBangDang(st,1)}</section>`}
function gvBangDang(st,gon){const D=gvDang(st),top=gon?D.slice(0,10):D,con=gon?D.slice(10):[];const row=x=>`<tr${x.n>=4&&x.p<GV_YEU?' class="gyeu"':''}><td>${esc(x.k)}</td><td>${HS_AXN[x.ax]||''}</td><td style="min-width:140px">${gvBar(x.p,x.p>=80?'var(--leaf)':x.p>=GV_YEU?'var(--sun)':'var(--coral)')} <b>${x.p}%</b></td><td>${x.n}</td><td>${x.t?gvNgay(hsKey(new Date(x.t))):''}</td></tr>`;const bang=L=>`<div class="tablewrap"><table class="gdang"><tr><th>Dạng bài</th><th>Mạch</th><th>Đúng</th><th>Số lần</th><th>Lần cuối</th></tr>${L.map(row).join('')}</table></div>`;
  return D.length?bang(top)+(con.length?`<details style="margin-top:8px"><summary>Xem thêm ${con.length} dạng (đều đúng từ ${con[0].p}% trở lên)</summary>${bang(con)}</details>`:''):'<p class="muted">Chưa có dữ liệu.</p>'}

function gvTabLoi(id,st,ph){
  const M=Object.entries(st.mist||{}).sort((a,b)=>b[1].n-a[1].n),A=asgMine(st),dang=A.find(a=>a.loai==='loi'&&!asgState(st,a).done),chon=scr.loiChon||[];
  const kq=(a,s)=>{if(a.loai==='loi')return s.done?'<span class="pill ok">Đã sửa xong</span>':`<span class="pill ${s.doing?'acc':'warn'}">còn ${s.con}/${a.keys.length} lỗi</span>`;
    const b=s.r.best;return s.done?`<span class="pill ${b.ok/b.n>=.8?'ok':'acc'}">${b.ok}/${b.n} đúng</span>`:s.chuaDat?`<span class="pill acc">chưa đạt ${b.ok}/${b.n}, làm lại</span>`:s.doing?'<span class="pill acc">đang làm</span>':'<span class="pill warn">chưa làm</span>'};
  return`<section class="card"><h2>Sổ lỗi sai <span class="pill">${M.length} lỗi</span></h2><p class="muted" style="margin:4px 0 0">Mỗi lỗi cần đúng 2 lần liền mới ra khỏi sổ.</p>
   ${M.length?`<div class="tablewrap"><table><tr>${ph?'':'<th></th>'}<th>Lỗi</th><th>Ở đảo</th><th>Sai</th><th>Đúng liền</th><th>Ghi ngày</th></tr>${M.map(([k,m])=>{const x=isl1(m.id);return`<tr>${ph?'':`<td><input type="checkbox" aria-label="Chọn lỗi" ${chon.includes(k)?'checked':''} ${dang?'disabled':''} onchange="gvChonLoi('${k}',this.checked)"></td>`}<td>${esc(m.label||'')}</td><td>${x?esc(x.title):''}</td><td><b>${m.n}</b> lần</td><td>${m.streak||0}/2</td><td>Ngày ${m.day}</td></tr>`}).join('')}</table></div>
   ${ph?'':dang?`<p class="hint" style="margin:10px 0 0">Đã giao Luyện lỗi ngày ${asgD(dang.t)}, em đang còn ${asgState(st,dang).con} lỗi. Giao tiếp khi em làm xong.</p>`
     :`<div class="row" style="gap:8px;margin-top:10px"><button class="btn pri" onclick="gvGiaoLoi('${id}',0)">Giao luyện tất cả (${M.length} lỗi)</button><button class="btn" ${chon.length?'':'disabled'} onclick="gvGiaoLoi('${id}',1)">Giao các lỗi đã chọn (${chon.length})</button></div>
      <p class="muted" style="margin:6px 0 0">Bài về nhà: mỗi lỗi 2 câu số mới, đúng 2 lần liền mới xong; còn lỗi thì em làm lại. Em phải làm xong trước mọi việc khác. Thưởng ${BVN_XU} xu.</p>`}`:'<p class="muted">Sổ đang trống.</p>'}</section>
  <section class="card"><h2>Bài về nhà ${ph?'cô giao cho con':'cô đã giao'}</h2>${A.length?`<div class="tablewrap"><table><tr><th>Bài</th><th>Giao · hạn</th><th>Kết quả</th></tr>${A.sort((p,q)=>q.t-p.t).map(a=>{const s=asgState(st,a);return`<tr><td><b>${esc(asgName(a))}</b><div class="muted">${a.loai==='loi'?'Luyện lỗi có mục tiêu':a.n+' câu'} · ${a.hs?'riêng cho em':'cả lớp'}${a.bat?' · bắt buộc':''} · ${esc(a.by||'')}</div></td><td>${asgD(a.t)}${a.due?' · '+asgD(a.due):''}</td><td>${kq(a,s)}${s.late?' <span class="pill bad">quá hạn</span>':''}</td></tr>`}).join('')}</table></div>`:'<p class="muted">Chưa có bài nào.</p>'}</section>`}
window.gvChonLoi=(k,on)=>{const c=scr.loiChon=scr.loiChon||[];const i=c.indexOf(k);if(on&&i<0)c.push(k);if(!on&&i>=0)c.splice(i,1);render()};
window.gvGiaoLoi=(id,chon)=>{const st=S.st[id],M=mist(st),keys=(chon?(scr.loiChon||[]):Object.keys(M)).filter(k=>M[k]&&isl1(M[k].id));if(!keys.length){toast('Chưa có lỗi để giao');return}
  const now=gvNow();asgAll().push({id:'l'+now.toString(36),loai:'loi',bat:1,g:st.grade,lop:(S.org&&S.org.gd[id])||gvLop,hs:[id],keys,ten:`Luyện lỗi: ${keys.length} lỗi trong Sổ lỗi sai`,tiets:[...new Set(keys.map(k=>M[k].id))],n:keys.length*2,t:now,due:now+2*DAYMS,by:gvTen()});
  scr.loiChon=[];log('gv','assigned','Luyện lỗi · '+st.name,0,{});save();render();toast(`Đã giao luyện ${keys.length} lỗi cho ${st.name}`)};

function gvTabHD(id,st){
  const P=st.pets&&st.pets.list||[],ev=S.events.filter(e=>e.actor.account.name===id).slice(-20).reverse();
  return`<div class="grid gpair">
   <section class="card"><h2>Phần thưởng</h2><div class="kpis" style="margin-top:8px">${gvKpi('Sao',totalStars(st),'SGK '+p1Stars(st)+' · Jenny '+p2Stars(st))}${gvKpi('Xu',st.coins,'')}</div>
    <p style="margin:12px 0 4px"><b>Thú cưng:</b> ${P.length?P.map(p=>esc(p.name||(PET_SP[p.sp]||[''])[0])).join(', '):'<span class="muted">chưa nuôi</span>'}</p>
    <p style="margin:4px 0"><b>Thẻ cô tặng:</b> ${(st.badges||[]).length?st.badges.slice(-6).map(b=>`<span class="pill acc">♥ ${esc(b.t)}</span>`).join(' '):'<span class="muted">chưa có</span>'}</p>
    <p style="margin:4px 0"><b>Nhận xét gần nhất:</b> ${(st.comments||[]).length?esc(st.comments[st.comments.length-1].t):'<span class="muted">chưa có</span>'}</p></section>
   <section class="card"><h2>Hoạt động gần đây</h2>${ev.length?`<div class="log" style="max-height:240px">${ev.map(e=>`Ngày ${evDay(e)} · ${e.verb.display.vi} · ${e.object.definition.name.vi}${e.result.success===true?' ✓':e.result.success===false?' ✗':''}`).map(esc).join('\n')}</div>`:'<p class="muted">Chưa có hoạt động.</p>'}</section></div>`}
function gvTabHDHT(id,st){return gvTabHT(id,st)+gvTabHD(id,st)}

/* ---------- giao phiếu tự động theo dạng bài yếu ---------- */
function gvNguon(st,kd){const g=st.grade,v=hsIndex(g).kinds[kd];if(!v)return[];return v.src.filter(sr=>{const s=st.p1[sr[0]];return s&&(s.intro||(s.m||[]).some(Boolean))})}
const gvKi=(st,kd)=>Object.keys(hsIndex(st.grade).kinds).indexOf(kd),gvKk=(id,i)=>Object.keys(hsIndex(S.st[id].grade).kinds)[i];
function gvPhieuDang(st,kd){return asgMine(st).find(a=>a.kinds&&a.kinds.includes(kd)&&!asgState(st,a).done)}
function gvTabGC(id,st){
  const N=st.gvNote||[],g=st.grade,D=gvDang(st),sk=st.gvSkip||{};
  const yeu=D.filter(x=>x.n>=GV_MIN&&x.p<GV_YEU&&gvNguon(st,x.k).length),nen=D.filter(x=>x.n>=GV_MIN&&x.p>=GV_YEU&&x.p<GV_NEN),bo=yeu.filter(x=>sk[x.k]),hien=yeu.filter(x=>!sk[x.k]);
  const pv=scr.pv;
  const the=x=>{const a=gvPhieuDang(st,x.k),src=gvNguon(st,x.k),de=Math.min(...src.map(s=>s[1])),coVua=src.some(s=>s[1]>de);
    return`<div class="task gsug"><div class="row" style="justify-content:space-between;gap:8px"><div style="min-width:0"><b>${esc(x.k)}</b> <span class="pill bad">đúng ${x.p}%</span> <span class="muted">· ${x.n} lần gần nhất · mạch ${HS_AXN[x.ax]||''}</span>
      <div class="muted" style="margin-top:4px">Phiếu 8 câu ${coVua?'(4 câu dễ, 4 câu vừa)':'(mức dễ)'} · câu từ các đảo em đã học, số mới mỗi lần · hạn 2 ngày · đạt khi đúng từ 80%.</div></div>
      ${a?`<span class="pill acc">Đã giao ${asgD(a.t)}, chờ em làm</span>`:`<div class="row" style="gap:6px"><button class="btn pri sm" onclick="gvGiaoDang('${id}',${gvKi(st,x.k)})">Giao</button><button class="btn sm" onclick="gvXemTruoc('${id}',${gvKi(st,x.k)})">${pv===x.k?'Ẩn câu hỏi':'Xem trước câu hỏi'}</button><button class="btn sm" onclick="gvBoQua('${id}',${gvKi(st,x.k)},1)">Bỏ qua</button></div>`}</div>
      ${pv===x.k&&!a?gvXem(st,x.k):''}</div>`};
  return`<section class="card"><h2>Giao phiếu theo dạng bài em còn yếu</h2>
   <p class="muted" style="margin:4px 0 8px">App tự soạn phiếu cho từng dạng em đúng dưới ${GV_YEU}% (làm ít nhất ${GV_MIN} lần). Cô chỉ cần bấm Giao hoặc Bỏ qua. Kết quả phiếu tính vào tỉ lệ đúng của dạng đó.</p>
   ${g>5?'<p class="muted">Đang làm cho lớp 6–9.</p>':hien.length?hien.slice(0,4).map(the).join(''):`<p class="hint">Em không có dạng nào dưới ${GV_YEU}%. Chưa cần giao thêm.</p>`}
   ${nen.length?`<p style="margin:12px 0 4px"><b>Nên luyện thêm</b> <span class="muted">(${GV_YEU}–${GV_NEN}%, chưa cần giao):</span> ${nen.slice(0,6).map(x=>`<span class="pill warn">${esc(x.k)} ${x.p}%</span>`).join(' ')}${nen.length>6?` <span class="muted">và ${nen.length-6} dạng khác (xem bảng bên dưới)</span>`:''}</p>`:''}
   ${bo.length?`<p class="muted" style="margin:8px 0 0">Đã bỏ qua: ${bo.map(x=>`${esc(x.k)} <button class="lnk" style="font-weight:600" onclick="gvBoQua('${id}',${gvKi(st,x.k)},0)">hiện lại</button>`).join(' · ')}</p>`:''}
   <details style="margin-top:12px"><summary><b>Tỉ lệ đúng từng dạng bài</b> <span class="muted">(dòng tô đỏ là dạng yếu)</span></summary>${gvBangDang(st)}</details></section>
  <div class="grid gpair">
   <section class="card"><h2>Ghi chú riêng của cô</h2><p class="muted" style="margin:4px 0 8px">Em và phụ huynh không thấy phần này.</p>
    <form onsubmit="gvGhiChu(event,'${id}')" class="grid" style="gap:8px"><textarea id="gcT" class="gfit" rows="3" maxlength="300" placeholder="Ví dụ: Em hay quên đơn vị, nhắc kiểm tra lại." aria-label="Ghi chú"></textarea><div><button class="btn pri">Lưu ghi chú</button></div></form>
    ${N.slice().reverse().map((n,i)=>`<div class="task"><div class="row" style="justify-content:space-between"><span class="muted">Ngày ${n.d} · ${esc(n.by||'')}</span><button class="btn sm" onclick="gvXoaGC('${id}',${N.length-1-i})">Xóa</button></div><div>${esc(n.t)}</div></div>`).join('')}</section>
   <section class="card"><h2>Nhận xét gửi phụ huynh</h2><p class="muted" style="margin:4px 0 8px">Cô tự viết. Phụ huynh thấy ở mục "Lời nhắn của giáo viên", mới nhất ở trên.</p>
    <form onsubmit="gvNhanXet(event,'${id}')" class="grid" style="gap:8px"><textarea id="gcNx" class="gfit" rows="4" maxlength="600" placeholder="Ví dụ: Tuần này con chăm hơn, nhưng còn nhầm khi so sánh số. Bố mẹ cho con đọc to đề trước khi làm nhé." aria-label="Nhận xét gửi phụ huynh"></textarea><div><button class="btn pri">Gửi phụ huynh</button></div></form>
    <p class="muted" style="margin:12px 0 4px">Tặng thẻ</p><div class="row" style="gap:6px;flex-wrap:wrap">${['Cố gắng','Cách giải hay','Giúp bạn','Chăm chỉ'].map(b=>`<button class="btn sm" onclick="gvTang('${id}','${b}')">♥ ${b}</button>`).join('')}</div>
    ${(st.comments||[]).length?`<h3 style="margin-top:14px">Đã gửi</h3>${st.comments.slice().reverse().slice(0,5).map(c=>`<div class="task"><span class="muted">${gvNgayD(c.day)}${c.by?' · '+esc(c.by):''}</span><div>${esc(c.t)}</div></div>`).join('')}`:''}</section></div>`}
function gvPhieuMoi(id,kd){const st=S.st[id],src=gvNguon(st,kd),now=gvNow();
  return{id:'k'+now.toString(36),g:st.grade,lop:(S.org&&S.org.gd[id])||gvLop,hs:[id],bat:1,kinds:[kd],ten:`Luyện dạng: ${kd}`,tiets:[...new Set(src.map(s=>s[0]))],n:8,dat:80,t:now,due:now+2*DAYMS,by:gvTen()}}
function gvXem(st,kd){const id=Object.keys(S.st).find(k=>S.st[k]===st),a=gvPhieuMoi(id,kd);let qs=[];try{qs=phQs(a,12345)}catch(e){}
  const tx=h=>String(h||'').replace(/<[^>]+>/g,' ').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
  return`<ol class="gxem">${qs.map((q,i)=>`<li><span class="pill">${q.src&&q.src[1]>Math.min(...gvNguon(st,kd).map(x=>x[1]))?'vừa':'dễ'}</span> ${esc(tx(q.q))}${q.sol?`<div class="muted">Đáp án: ${esc(tx(q.sol)).slice(0,140)}</div>`:''}</li>`).join('')}</ol><p class="muted" style="margin:4px 0 0">Đây là ví dụ. Khi làm, em nhận câu cùng dạng nhưng số khác.</p>`}
window.gvXemTruoc=(id,i)=>{const kd=gvKk(id,i);scr.pv=scr.pv===kd?null:kd;render()};
window.gvBoQua=(id,i,on)=>{const kd=gvKk(id,i);const st=S.st[id];st.gvSkip=st.gvSkip||{};if(on)st.gvSkip[kd]=S.day;else delete st.gvSkip[kd];save();render();toast(on?'Đã bỏ qua gợi ý này':'Đã hiện lại gợi ý')};
window.gvGiaoDang=(id,i)=>{const kd=gvKk(id,i);const st=S.st[id];if(!gvNguon(st,kd).length){toast('Em chưa học đảo nào có dạng này');return}const a=gvPhieuMoi(id,kd);asgAll().push(a);scr.pv=null;
  log('gv','assigned','Phiếu riêng · '+a.ten+' · '+st.name,0,{});save();render();toast('Đã giao phiếu "'+kd+'" cho '+st.name)};
/* phiếu theo dạng: câu dễ trước, vừa sau; kết quả tính vào tỉ lệ đúng của dạng */
{const _q=phQs;phQs=function(a,seed){if(!a||!a.kinds)return _q.apply(this,arguments);const mr=Math.random;Math.random=seedRnd(seed);const qs=[];
  try{const ix=hsIndex(a.g),T=new Set(a.tiets);let lan=0;for(let k=0;k<a.n&&lan<a.n*4;lan++){const kd=a.kinds[k%a.kinds.length],src=((ix.kinds[kd]||{}).src||[]).filter(s=>T.has(s[0]));if(!src.length)break;
    const de=Math.min(...src.map(s=>s[1])),D0=src.filter(s=>s[1]===de),V=src.filter(s=>s[1]>de),pool=k<a.n/2||!V.length?D0:V,sr=pool[Math.floor(Math.random()*pool.length)];
    let q=null;try{q=hsMakeQ(sr,kd)}catch(e){}if(q){qs.push(q);k++}}}finally{Math.random=mr}return qs}}
{const _s=phSubmit;phSubmit=function(){try{const g=scr,a=asgAll().find(x=>x.id===g.ph),st=S.st[sid];if(a&&a.kinds&&st&&g.qs){
    g.qs.forEach((q,k)=>{const kd=q.label;if(!a.kinds.includes(kd))return;const v=hsIndex(st.grade).kinds[kd],e=st.sk[kd]||(st.sk[kd]={r:[],t:0,ax:v?v.ax:'so'});e.r.push(g.ans[k]&&g.ans[k].ok?1:0);if(e.r.length>10)e.r.splice(0,e.r.length-10);e.t=Date.now()});hsSnap(st)}}catch(e){}
  return _s.apply(this,arguments)}}

window.gvGhiChu=(e,id)=>{e.preventDefault();const t=document.getElementById('gcT').value.trim();if(!t)return;const st=S.st[id];(st.gvNote=st.gvNote||[]).push({d:S.day,by:gvTen(),t});save();render();toast('Đã lưu ghi chú')};
window.gvXoaGC=(id,i)=>{const st=S.st[id];st.gvNote.splice(i,1);save();render();toast('Đã xóa ghi chú')};
window.gvTang=(id,b)=>{S.st[id].badges.push({t:b,day:S.day,from:'cô'});log(id,'awarded',b,0,{});save();render();toast('Đã tặng thẻ "'+b+'"')};
window.gvNhanXet=(e,id)=>{e.preventDefault();const t=document.getElementById('gcNx').value.trim();if(t.length<5){toast('Cô viết nhận xét trước nhé');return}S.st[id].comments.push({day:S.day,t,by:gvTen()});save();render();toast('Đã gửi nhận xét cho phụ huynh')};
const gvNgayD=d=>gvNgay(hsKey(hsDayDate(d)));
window.gvGiaoRieng=(e,id)=>{e.preventDefault();const t=[...document.querySelectorAll('input[name=gt]:checked')].map(x=>x.value);if(!t.length||t.length>3){toast('Chọn 1 đến 3 tiết');return}
  const now=Date.now(),d=+document.getElementById('grD').value,st=S.st[id];
  asgAll().push({id:'r'+now.toString(36),g:st.grade,lop:(S.org&&S.org.gd[id])||gvLop,hs:[id],tiets:t,n:+document.getElementById('grN').value,t:now,due:now+d*DAYMS,by:gvTen()});
  log('gv','assigned','Phiếu riêng · '+st.name,0,{});save();go({k:'gvhs',id,tab:'loi'});toast('Đã giao phiếu riêng cho '+st.name)};

function viewGVHS(id){
  const st=S.st[id];if(!st){scr={k:'home'};return viewGV()}
  if(st.grade<=5)hsHeal(st,id);
  const CLS=gvCLS(),i=CLS.findIndex(s=>s[0]===id),pv=CLS[i-1],nx=CLS[i+1],tab=({ht:'hdht',hd:'hdht'})[scr.tab]||scr.tab||'tq',l=typeof lopCua==='function'?lopCua(id):null;
  const gvs=l&&S.org?l.gv.map(g=>(S.org.gv.find(x=>x.id===g)||{}).ten).filter(Boolean).join(', '):'';
  const body=st.grade>5?`<section class="card"><p class="muted">Hồ sơ chi tiết đang có cho lớp 1–5. Lớp 6–9 làm ở bước sau.</p></section>${gvTabGC(id,st)}`
    :tab==='hdht'||tab==='ht'||tab==='hd'?gvTabHDHT(id,st):tab==='loi'?gvTabLoi(id,st):tab==='gc'?gvTabGC(id,st):gvTabTQ(id,st);
  return`<div class="grid">
   <div class="row" style="justify-content:space-between"><button class="btn sm" onclick="go({k:'home'})">← Lớp ${l?esc(l.ten):st.grade}</button>
    <div class="row" style="gap:6px">${pv?`<button class="btn sm" onclick="go({k:'gvhs',id:'${pv[0]}',tab:'${tab}'})" aria-label="Em trước">‹ ${esc(pv[1].split(' ').pop())}</button>`:''}${nx?`<button class="btn sm" onclick="go({k:'gvhs',id:'${nx[0]}',tab:'${tab}'})" aria-label="Em sau">${esc(nx[1].split(' ').pop())} ›</button>`:''}</div></div>
   <section class="card ghead"><span class="av gav">${initials(st.name)}</span><div style="min-width:0"><h1 style="font-size:28px;margin:0">${esc(st.name)}</h1>
    <div class="muted">Tài khoản ${esc(id)} · Lớp ${l?esc(l.ten):st.grade}${gvs?' · '+esc(gvs):''} · học gần nhất: ${gvNgay(st.grade<=5?gvCuoi(id,st):null)}</div>
    <div class="row" style="gap:6px;margin-top:6px"><span class="pill">${totalStars(st)} ★</span><span class="pill">${st.coins} xu</span>${st.active?`<span class="pill acc">Toán Jenny${S.org&&S.org.nl[id]&&!(l&&l.tj.on)?' · ngoại lệ':' · theo lớp'}</span>`:''}</div></div></section>
   ${st.grade>5?'':`<div class="seg gtabs" role="tablist" aria-label="Hồ sơ">${GV_TABS.map(([k,t])=>`<button role="tab" class="${k===tab?'on':''}" aria-selected="${k===tab}" onclick="go({k:'gvhs',id:'${id}',tab:'${k}'})">${t}</button>`).join('')}</div>`}
   ${body}</div>`}
{const _vg=viewGV;viewGV=function(){if(scr&&scr.k==='gvhs')return viewGVHS(scr.id);return _vg.apply(this,arguments)}}

/* ---------- trang phụ huynh: như hồ sơ giáo viên (không có ghi chú riêng, không có nút giao bài) ---------- */
const PH_TABS=[['tq','Tổng quan'],['hdht','Hoạt động học tập'],['loi','Lỗi & bài về nhà']];
function viewPHHS(id){const st=S.st[id];hsHeal(st,id);const l=typeof lopCua==='function'?lopCua(id):null,tab=scr.phTab||'tq',first=st.name.split(' ').pop();
  const gvs=l&&S.org?l.gv.map(g=>(S.org.gv.find(x=>x.id===g)||{}).ten).filter(Boolean).join(', '):'';
  const C=(st.comments||[]).slice().reverse(),B=(st.badges||[]).slice().reverse(),o=(st.dd||{})[hsTodayKey()],cho=typeof bvnCho==='function'?bvnCho(st):[];
  const body=tab==='hdht'?gvTabHDHT(id,st):tab==='loi'?gvTabLoi(id,st,1):gvTabTQ(id,st,1);
  return`<div class="grid">
   <section class="card ghead"><span class="av gav">${initials(st.name)}</span><div style="min-width:0"><div class="muted">Kết quả học tập của con</div><h1 style="font-size:28px;margin:0">${esc(st.name)}</h1>
    <div class="muted">Lớp ${l?esc(l.ten):st.grade}${gvs?' · '+esc(gvs):''} · học gần nhất: ${gvNgay(gvCuoi(id,st))}</div>
    <div class="row" style="gap:6px;margin-top:6px"><span class="pill">${totalStars(st)} ★</span><span class="pill">${st.coins} xu</span>${o&&o.n?`<span class="pill ok">Hôm nay: ${o.n} câu, đúng ${o.c}</span>`:'<span class="pill warn">Hôm nay con chưa học</span>'}${cho.length?`<span class="pill bad">${cho.length} bài về nhà chưa xong</span>`:''}</div></div></section>
   <section class="card"><h2>Lời nhắn của giáo viên</h2>${C.length?`${C.slice(0,3).map((c,i)=>`<div class="task phmsg${i===0?' moi':''}"><div class="row" style="justify-content:space-between"><span class="muted">${gvNgayD(c.day)}${c.by?' · '+esc(c.by):''}</span>${i===0?'<span class="pill acc">Mới nhất</span>':''}</div><div style="margin-top:4px">${esc(c.t)}</div></div>`).join('')}
     ${C.length>3?`<details style="margin-top:8px"><summary>Xem ${C.length-3} lời nhắn cũ hơn</summary>${C.slice(3).map(c=>`<div class="task"><span class="muted">${gvNgayD(c.day)}${c.by?' · '+esc(c.by):''}</span><div>${esc(c.t)}</div></div>`).join('')}</details>`:''}`:`<p class="muted" style="margin:6px 0 0">Cô chưa gửi lời nhắn nào.</p>`}
    ${B.length?`<p style="margin:12px 0 0"><b>Thẻ cô tặng ${esc(first)}:</b> ${B.slice(0,6).map(b=>`<span class="pill acc">♥ ${esc(b.t)}</span>`).join(' ')}</p>`:''}</section>
   <div class="seg gtabs" role="tablist" aria-label="Kết quả học tập">${PH_TABS.map(([k,t])=>`<button role="tab" class="${k===tab?'on':''}" aria-selected="${k===tab}" onclick="scr.phTab='${k}';render()">${t}</button>`).join('')}</div>
   ${body}</div>`}
{const _p=viewPH;viewPH=function(){try{if(role==='ph'&&typeof ORG_ON!=='undefined'&&ORG_ON&&S.st[sid]&&S.st[sid].grade<=5)return viewPHHS(sid)}catch(e){console.error(e)}return _p.apply(this,arguments)}}

/* ---------- dữ liệu mẫu (bản đầy đủ) ---------- */
/* Giả định các em đã học 8 tháng (5/9/2026 → 2/5/2027, ngày demo 240). Sau này sẽ xóa khi có dữ liệu thật. */
const GV_NG=240;
function gvNow(){try{if(typeof ORG_ON!=='undefined'&&ORG_ON&&S&&S.org)return hsDayDate(S.day).getTime()+(Date.now()%864e5)}catch(e){}return Date.now()}
const GV_NX=[
 f=>`${f} học đều đặn, cô rất vui. Bố mẹ khen con mỗi tối nhé.`,
 (f,w)=>`${f} còn nhầm ở phần ${w}. Bố mẹ cho con đọc to đề trước khi làm giúp cô.`,
 (f,w,b)=>`Tháng này ${f} tiến bộ rõ ở phần ${b}. Mình cố thêm phần ${w} nữa nhé.`,
 f=>`${f} có hôm trả lời hơi vội. Nhắc con làm chậm lại và kiểm tra trước khi bấm.`,
 f=>`${f} hoàn thành bài về nhà đúng hạn. Cảm ơn bố mẹ đã nhắc con.`,
 (f,w)=>`Cô đã giao thêm phiếu ${w} cho ${f}. Bố mẹ nhắc con làm trong 2 ngày nhé.`,
 f=>`${f} nghỉ học mấy hôm. Bố mẹ giúp con giữ thói quen 15 phút mỗi ngày.`,
 (f,w,b)=>`${f} làm tốt phần ${b}, hay giúp bạn trong lớp. Cô tặng con thẻ "Giúp bạn".`];
function gvMau(){
  if(typeof ORG_ON==='undefined'||!ORG_ON||!S||!S.org||S.org.mauHS4||role==='hs')return; /* chỉ tạo khi mở trang giáo viên/quản lý/phụ huynh */S.org.mauHS4=1;
  try{window.orgHeal&&window.orgHeal()}catch(e){}
  const NG=GV_NG;S.day=NG;const thang=[];for(let d=1;d<=NG;d+=1){const m=hsMonth(hsDayDate(d));if(!thang.includes(m))thang.push(m)}
  S.asg=(S.asg||[]).filter(a=>!a.mau);
  STUDENTS.forEach(([id,n,g])=>{if(g>5||id==='na'||!S.st[id])return;const st=S.st[id]=newStudent(n,g);hsHeal(st,id);
    let sd=[...(id+'v2')].reduce((a,c)=>a*31+c.charCodeAt(0),7)>>>0;const rnd=()=>(sd=(sd*1103515245+12345)>>>0)/4294967296;
    const cham=.4+rnd()*.55,gioi=.55+rnd()*.37,bua=rnd()<.25?.22+rnd()*.15:rnd()*.08,khung=rnd()<.5?2:1,first=n.split(' ').pop();
    for(let d=1;d<=NG;d++){const tet=d>=152&&d<=165;if(rnd()>(tet?cham*.25:cham))continue;const k=hsKey(hsDayDate(d)),q=8+Math.floor(rnd()*22),ac=Math.min(.98,gioi-.08+.14*d/NG+(rnd()-.5)*.14),f=Math.round(q*.8),h=[0,0,0];h[khung]=Math.round(q*.75);h[rnd()<.5?0:1]+=q-h[khung];
      st.dd[k]={n:q,c:Math.round(q*ac),sec:Math.round(q*(bua>.2?8+rnd()*8:22+rnd()*30)),f,fc:Math.round(f*Math.max(.2,ac-.08)),fx:Math.round((q-f)*.6),fast:Math.round(q*bua),gd:Math.floor(rnd()*(gioi<.7?5:2)),h};
      if(d>NG-5)simDay(id,d,Math.min(q,8),ac,'Luyện tập')}
    const L=PRIM[g].isl,ki=Math.max(3,Math.min(L.length,Math.round(L.length*(.45+cham*.45))));
    for(let i=0;i<ki;i++){const x=L[i],s=st.p1[x.id]||(st.p1[x.id]={intro:false,m:Array(x.nm||3).fill(false),fails:Array(x.nm||3).fill(0)});s.intro=true;
      s.m=s.m.map((_,j)=>i<ki-1?rnd()<.94:j===0&&rnd()<gioi);s.fails=s.m.map(v=>v?(rnd()<.3?1:0):(rnd()<.06?2:1))}
    const pos={};L.slice(0,ki).forEach((x,i)=>pos[x.id]=i);
    const kinds=Object.entries(hsIndex(g).kinds).filter(([,v])=>v.src.some(sr=>pos[sr[0]]!=null));
    /* điểm từng mạch theo tháng: mạch bắt đầu khi em học tới đảo có mạch đó, rồi tăng dần */
    const fin={};HS_AX.forEach(a=>{const ks=kinds.filter(([,v])=>v.ax===a.k);if(!ks.length)return;const i0=Math.min(...ks.flatMap(([,v])=>v.src.filter(sr=>pos[sr[0]]!=null).map(sr=>pos[sr[0]])));
      const m0=Math.min(thang.length-1,Math.floor(i0/ki*(thang.length-1)));let v=100*(gioi-.14)+rnd()*10;const tang=1.2+rnd()*3.2;
      for(let m=m0;m<thang.length;m++){const x=Math.round(Math.max(20,Math.min(98,v+(rnd()-.5)*8)));(st.skm[thang[m]]=st.skm[thang[m]]||{})[a.k]=x;v+=tang;fin[a.k]=x}});
    kinds.forEach(([kd,v])=>{const kg=Math.min(.98,Math.max(.15,(fin[v.ax]||70)/100+(rnd()-.55)*.45));st.sk[kd]={r:Array.from({length:5+Math.floor(rnd()*6)},()=>rnd()<kg?1:0),t:hsDayDate(NG-Math.floor(rnd()*20)).getTime(),ax:v.ax}});
    hsSnap(st);
    const nmi=gioi<.7?3+Math.floor(rnd()*3):Math.floor(rnd()*3),M=mist(st);kinds.filter((_,j)=>j%4===1).slice(0,nmi).forEach(([kd,v])=>{const s0=v.src.find(sr=>pos[sr[0]]!=null);if(s0)M[`${s0[0]}:${s0[1]}:${s0[2]}`]={id:s0[0],lv:s0[1],gi:s0[2],label:kd,n:1+Math.floor(rnd()*3),streak:rnd()<.3?1:0,day:NG-Math.floor(rnd()*20)}});
    st.coins=300+Math.floor(rnd()*1200);
    const l=lopCua(id),co=l&&l.gv[0]?(S.org.gv.find(x=>x.id===l.gv[0])||{}).ten:'Cô Jenny';
    ['Cố gắng','Chăm chỉ','Cách giải hay','Giúp bạn'].forEach((b,i)=>{if(rnd()<.45)st.badges.push({t:b,day:20+Math.floor(rnd()*(NG-25)),from:'cô'})});st.badges.sort((p,q)=>p.day-q.day);
    const sc=Object.entries(fin).sort((p,q)=>p[1]-q[1]),yeu=sc.length?HS_AXN[sc[0][0]]:'Số',gioiM=sc.length?HS_AXN[sc[sc.length-1][0]]:'Số';
    const nc=3+Math.floor(rnd()*5),used=new Set();for(let i=0;i<nc;i++){let t;do t=Math.floor(rnd()*GV_NX.length);while(used.has(t)&&used.size<GV_NX.length);used.add(t);
      st.comments.push({day:Math.round(15+(NG-20)*(i+rnd()*.6)/nc),t:GV_NX[t](first,yeu.toLowerCase(),gioiM.toLowerCase()),by:co})}
    /* bài về nhà đã giao trong 8 tháng */
    const kd2=kinds.map(([k])=>k),nb=3+Math.floor(rnd()*4);
    for(let i=0;i<nb;i++){const d=Math.round(20+(NG-30)*(i+rnd()*.5)/nb),t=hsDayDate(d).getTime()+36e6,loi=rnd()<.35,kd=kd2[Math.floor(rnd()*kd2.length)];if(!kd)continue;
      const src=hsIndex(g).kinds[kd].src.filter(sr=>pos[sr[0]]!=null),aid='m'+id+i;
      const a=loi?{id:aid,mau:1,loai:'loi',bat:1,g,lop:S.org.gd[id],hs:[id],keys:[`cu:${i}:a`,`cu:${i}:b`],ten:'Luyện lỗi: 2 lỗi trong Sổ lỗi sai',tiets:[src[0][0]],n:4,t,due:t+2*DAYMS,by:co}
        :{id:aid,mau:1,bat:1,g,lop:S.org.gd[id],hs:[id],kinds:[kd],ten:`Luyện dạng: ${kd}`,tiets:[...new Set(src.map(sr=>sr[0]))],n:8,dat:80,t,due:t+2*DAYMS,by:co};
      S.asg.push(a);const r=asgR(st)[aid]={seen:1,thuong:t+864e5};
      if(loi)r.lam=1;else{const lan=rnd()<.3?2:1,b1=lan===2?3+Math.floor(rnd()*3):7+Math.floor(rnd()*2),b2=7+Math.floor(rnd()*2);r.tries=lan;r.first={ok:b1,n:8,t:t+36e5};r.best=r.last={ok:lan===2?b2:b1,n:8,t:t+72e5}}}
    if(rnd()<.25&&kd2.length){const kd=kd2[0],t=hsDayDate(NG-1).getTime()+36e6,src=hsIndex(g).kinds[kd].src.filter(sr=>pos[sr[0]]!=null);
      S.asg.push({id:'m'+id+'x',mau:1,bat:1,g,lop:S.org.gd[id],hs:[id],kinds:[kd],ten:`Luyện dạng: ${kd}`,tiets:[...new Set(src.map(sr=>sr[0]))],n:8,dat:80,t,due:t+2*DAYMS,by:co})}
  });
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
.gtabs{flex-wrap:wrap;max-width:100%;order:0!important}
.gpick{display:flex;flex-wrap:wrap;gap:6px 14px;max-height:180px;overflow:auto}.gpick label{font-size:14px;white-space:nowrap}
.gfit{width:100%;max-width:100%;min-width:0;box-sizing:border-box}
.gsug{border-left:4px solid var(--coral)}.gxem{margin:10px 0 0;padding-left:22px;display:grid;gap:8px;font-size:14px}
tr.gyeu td{background:var(--coral-soft)}
.gradar{display:block;width:100%;max-width:380px;margin:6px auto 0}
.gr-ring{fill:none;stroke:var(--line);stroke-width:1}.gr-cur{fill:color-mix(in srgb,var(--sea) 28%,transparent);stroke:var(--sea);stroke-width:2.5}
.gr-tb{fill:none;stroke:var(--muted);stroke-width:1.5;stroke-dasharray:4 3}.gr-6{fill:none;stroke:#F37A1F;stroke-width:2}.gsub{font-size:12px;margin:-4px 0 4px;padding-left:min(150px,40%)}.gr-dot{fill:var(--sea)}
.gr-lb{font:600 12.5px var(--f-body);fill:var(--ink)}.gr-lb.dim{fill:var(--muted);font-weight:400}.gr-v{font-weight:800;font-size:13px}
.gr-leg{display:flex;gap:16px;justify-content:center;font-size:12.5px}.gr-leg i{display:inline-block;width:18px;height:0;border-top:3px solid var(--sea);vertical-align:middle;margin-right:4px}.gr-leg{flex-wrap:wrap;gap:6px 14px}.gr-leg i.s6{border-top-color:#F37A1F}.gr-leg i.tb{border-top:2px dashed var(--muted)}
.phmsg.moi{border-left:4px solid var(--sea)}
.gpair{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}@media(max-width:900px){.gpair{grid-template-columns:minmax(0,1fr)}}
.glichcard{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,320px);gap:12px 28px;align-items:start}@media(max-width:900px){.glichcard{grid-template-columns:minmax(0,1fr)}}
.glichcard .grow{grid-template-columns:60px 1fr 44px}
.grow .gbar{max-width:none}.grow{max-width:560px}
table.gdang td:nth-child(2),table.gdang td:nth-child(4),table.gdang td:nth-child(5){white-space:nowrap}
table.gvbang td:nth-child(2),table.gvbang td:nth-child(3),table.gvbang td:nth-child(4){white-space:nowrap}
@media(min-width:900px){.alertlist{grid-template-columns:repeat(2,minmax(0,1fr))}}
.lnk{all:unset;cursor:pointer;font-weight:700;text-decoration:underline;text-underline-offset:3px}.lnk:focus-visible{outline:2px solid var(--sea)}
</style>`);
