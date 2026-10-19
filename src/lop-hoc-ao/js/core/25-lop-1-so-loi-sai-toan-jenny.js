/* ===================== LỚP 1 · SỔ LỖI SAI + TOÁN JENNY ===================== */
/* ---- Sổ lỗi sai lớp 1 ---- */
function mist1Add(q){if(!q.key)return;const M=mist(S.st[sid]),e=M[q.key]||(M[q.key]={id:q.src[0],lv:q.src[1],gi:q.src[2],label:q.label,n:0,streak:0,day:S.day});e.n++;e.streak=0;e.day=S.day}
function startFix1(){const M=Object.values(mist(S.st[sid])).sort((a,b)=>a.day-b.day).slice(0,3);if(!M.length){toast('Sổ lỗi sai đang trống. Giỏi lắm!');return}
  const mk=e=>{const x=isl1(e.id);const q=x.lv[e.lv][e.gi]();return{...q,src:[e.id,e.lv,e.gi],key:`${e.id}:${e.lv}:${e.gi}`,label:e.label}};
  v1Said='';go({k:'game',g1:1,fix:1,id:M[0].id,lv:0,qs:M.flatMap(e=>[mk(e),mk(e)]),j:0,hearts:3,ok:0,tries:0,res:[],sheet:null,picks:[],seq:[],fill:[],used:[],cnt:0,hp:0,fixed:0,t0:Date.now()})}
function viewFix1(st){const M=Object.values(mist(st)).sort((a,b)=>b.n-a.n);
  return`<div class="grid"><section class="card"><div class="secthead"><h2>📒 Sổ lỗi sai</h2><span class="grow"></span><span class="pill ${M.length?'warn':'ok'}">${M.length} dạng</span></div>
   ${M.length?`<p class="muted" style="margin:0 0 10px">Mỗi lượt luyện 3 dạng, mỗi dạng 2 câu với số mới. Đúng cả 2 câu liền là dạng đó ra khỏi sổ, được +5 xu. Luyện lỗi không mất tim.</p><ul class="mlist">${M.slice(0,6).map(e=>`<li><span>${esc(e.label)}</span><span class="muted">sai ${e.n} lần${e.streak?` · đã đúng ${e.streak}/2`:''}</span></li>`).join('')}</ul><button class="gobtn" type="button" style="margin-top:12px" onclick="startFix1()">Luyện ngay</button>`:`<div class="row" style="flex-wrap:nowrap;gap:12px">${jenny(56)}<p class="muted" style="margin:0">Sổ đang trống. Câu nào em làm sai lần đầu sẽ được ghi vào đây để luyện lại.</p></div>`}</section></div>`}
/* ---- Toán Jenny lớp 1 (nội dung mẫu, sẽ thay bằng sách của Clb) ---- */
const ANI=[['chick','gà con'],['fish','cá'],['cat','mèo'],['crab','cua'],['bug','bọ rùa']];
const JQ1={
 pat2:()=>()=>{const [a,b]=shuf(['apple','star','flower','ball','egg','carrot']).slice(0,2);const L=R(5,7),seq=range(0,L-1).map(i=>i%2?b:a),nx=L%2?b:a;const o=shuf([a,b,pick(['bug','cup','car'])]);return{type:'opt',cols:3,q:'Hình nào xếp tiếp theo?',say:'Các hình được xếp theo một quy luật. Hình nào xếp tiếp theo?',pic:`<div class="g1grp">${seq.map(s=>spr(s,34)).join('')}<span class="g1qm">?</span></div>`,opts:o.map(s=>({h:spr(s,44),v:s})),a:o.indexOf(nx),sol:'Hai hình lặp lại xen kẽ nhau.',kind:'Quy luật lặp 2 hình'}},
 pat3:()=>()=>{const t=shuf(['apple','star','flower','ball','egg','carrot','cup']).slice(0,3);const L=R(5,8),seq=range(0,L-1).map(i=>t[i%3]),nx=t[L%3];const o=shuf(t);return{type:'opt',cols:3,q:'Hình nào xếp tiếp theo?',say:'Ba hình lặp lại theo thứ tự. Hình nào xếp tiếp theo?',pic:`<div class="g1grp">${seq.map(s=>spr(s,30)).join('')}<span class="g1qm">?</span></div>`,opts:o.map(s=>({h:spr(s,44),v:s})),a:o.indexOf(nx),sol:'Ba hình lặp lại đúng thứ tự.',kind:'Quy luật lặp 3 hình'}},
 grow:()=>()=>{const st=pick([0,1,2]),d=pick([1,2]),s=range(0,3).map(i=>st+i*d),nx=st+4*d;const o=optN(nx,0,10,3);return{type:'opt',big:1,q:`${s.join(', ')}, <b>?</b>`,say:`Các số ${s.map(v=>NUMW[v]).join(', ')}. Số tiếp theo là số mấy?`,...o,sol:`Mỗi lần thêm ${d}: ${s.join(', ')}, ${nx}.`,kind:'Dãy số theo quy luật'}},
 odd:()=>()=>{const [s,w]=pickObj();const n=R(2,6),m=n+pick([-1,1]);const c=shuf([n,n,n,m]);return{type:'opt',cols:2,q:`Khung nào có số ${w} <b>khác</b> các khung còn lại?`,say:`Ba khung có số ${w} bằng nhau, một khung khác. Em tìm khung khác nhé.`,opts:c.map(v=>({h:grp(s,v,26,'sm'),v})),a:c.indexOf(m),sol:`Ba khung có ${n}, khung khác có ${m}.`,kind:'Tìm nhóm khác'}},
 total:()=>()=>{const [s1,w1]=pick(ANI.slice(0,2)),[s2,w2]=pick(ANI.slice(2));const a=R(1,5),b=R(1,10-a);const items=shuf([...Array(a).fill(s1),...Array(b).fill(s2)]);const o=optN(a+b,1,10,3);return{type:'opt',big:1,q:'Có tất cả mấy con vật?',say:`Có ${w1} và ${w2}. Có tất cả mấy con vật?`,pic:`<div class="g1grp">${items.map(x=>spr(x,34)).join('')}</div>`,...o,sol:`${a} ${w1} và ${b} ${w2}: tất cả ${a+b} con.`,kind:'Đếm tất cả'}},
 ord:(fromRight)=>()=>{const row=shuf(ANI).slice(0,5);const k=R(0,4),[s,w]=row[k];const pos=fromRight?5-k:k+1;const o=optN(pos,1,5,3);return{type:'opt',big:1,q:`Bạn ${w} đứng thứ mấy tính từ <b>${fromRight?'phải':'trái'}</b> sang?`,say:`Bạn ${w} đứng thứ mấy, tính từ ${fromRight?'bên phải':'bên trái'} sang?`,pic:`<div class="g1grp g1line">${row.map(([x])=>spr(x,38)).join('')}</div>`,...o,sol:`Đếm từ ${fromRight?'phải':'trái'} sang, bạn ${w} đứng thứ ${pos}.`,kind:fromRight?'Thứ tự từ phải sang':'Thứ tự từ trái sang'}},
 between:()=>()=>{const a=R(0,8),m=a+1;const o=optN(m,0,10,3);return{type:'opt',big:1,q:`Số nào nằm giữa <b>${a}</b> và <b>${a+2}</b>?`,say:`Số nào nằm giữa ${NUMW[a]} và ${NUMW[a+2]}?`,...o,sol:`${a}, ${m}, ${a+2}: số ở giữa là ${m}.`,kind:'Số ở giữa'}},
};
const P2_1=[
 {id:'jg1b1',week:1,title:'Buổi 1 · Quy luật xếp hình',grade:1,
  slides:[{t:'Quy luật là gì?',h:`<div class="g1grp">${['apple','star','apple','star','apple'].map(s=>spr(s,34)).join('')}<span class="g1qm">?</span></div><p>Táo, sao, táo, sao… hai hình thay nhau lặp lại. Đó là <b>quy luật</b>.</p>`,say:'Chào các em! Hôm nay Jenny dạy các em tìm quy luật. Táo, sao, táo, sao. Hai hình thay nhau lặp lại. Đó là quy luật. Vậy sau quả táo sẽ là ngôi sao.'},
   {t:'Lặp lại ba hình',h:`<div class="g1grp">${['ball','flower','egg','ball','flower'].map(s=>spr(s,34)).join('')}<span class="g1qm">?</span></div><p>Bóng, hoa, trứng rồi lại bóng, hoa… Hình tiếp theo là <b>quả trứng</b>.</p>`,say:'Có khi ba hình lặp lại. Quả bóng, bông hoa, quả trứng, rồi lại quả bóng, bông hoa. Hình tiếp theo là quả trứng.'},
   {t:'Số cũng có quy luật',h:'<p class="g1big" style="text-align:center">2, 4, 6, <b>8</b></p><p>Mỗi lần thêm 2. Sau 6 là 8.</p>',say:'Các số cũng có quy luật. Hai, bốn, sáu. Mỗi lần thêm hai. Vậy sau sáu là tám.'}],
  ex:{q:'Hình nào xếp tiếp theo?',pic:`<div class="g1grp">${['carrot','cup','carrot','cup','carrot'].map(s=>spr(s,34)).join('')}<span class="g1qm">?</span></div>`,a:spr('cup',44),sol:'Cà rốt và cốc thay nhau lặp lại. Sau củ cà rốt là cái cốc.'},
  lv:[[JQ1.pat2()],[JQ1.pat3(),JQ1.pat2()],[JQ1.grow(),JQ1.pat3()]]},
 {id:'jg1b2',week:1,title:'Buổi 2 · Đếm khéo, thứ tự',grade:1,
  slides:[{t:'Đứng thứ mấy?',h:`<div class="g1grp g1line">${['chick','fish','cat','crab','bug'].map(s=>spr(s,38)).join('')}</div><p>Đếm từ trái sang: gà con thứ nhất, cá thứ hai, mèo thứ ba…</p>`,say:'Muốn biết một bạn đứng thứ mấy, em đếm lần lượt. Từ trái sang: gà con đứng thứ nhất, cá đứng thứ hai, mèo đứng thứ ba.'},
   {t:'Đếm từ phải sang',h:'<p>Đếm từ phải sang thì bọ rùa đứng thứ nhất, cua đứng thứ hai.</p>',say:'Nếu đếm từ bên phải sang thì bọ rùa đứng thứ nhất, cua đứng thứ hai. Em nhớ xem đề hỏi đếm từ bên nào nhé.'},
   {t:'Đếm tất cả',h:`<div class="g1grp">${['chick','chick','cat','chick','cat'].map(s=>spr(s,34)).join('')}</div><p>3 gà con và 2 mèo: có tất cả 5 con vật.</p>`,say:'Có ba gà con và hai mèo. Đếm hết là năm con vật.'}],
  ex:{q:'Bạn mèo đứng thứ mấy tính từ trái sang?',pic:`<div class="g1grp g1line">${['fish','bug','cat','chick'].map(s=>spr(s,38)).join('')}</div>`,a:'3',sol:'Cá thứ nhất, bọ rùa thứ hai, mèo thứ ba.'},
  lv:[[JQ1.ord(false)],[JQ1.odd(),JQ1.total()],[JQ1.ord(true),JQ1.between()]]},
 {id:'jg1b3',week:2,title:'Buổi 3 · Giống nhau, khác nhau',grade:1,draft:true,slides:[],lv:[]},
 {id:'jg1b4',week:2,title:'Buổi 4 · Cân thăng bằng',grade:1,draft:true,slides:[],lv:[]},
];
const ju1=id=>P2_1.find(x=>x.id===id);
const j1s=(st,id)=>st.p2[id]||(st.p2[id]={intro:false,ex:false,m:[false,false,false],fails:[0,0,0]});
function viewJTab1(st){
  if(!st.active)return`<div class="grid"><section class="card paidbox"><div class="secthead"><h2>Toán Jenny</h2><span class="tag paid">Nâng cao</span></div><div class="row" style="flex-wrap:nowrap;gap:12px;margin-top:8px">${jenny(56)}<p class="muted" style="margin:0">Phần nâng cao của Clb Học Toán cùng Jenny: tìm quy luật, đếm khéo, suy luận. Trung tâm nhập mã kích hoạt, cô giáo mở 2 buổi mỗi tuần.</p></div></section></div>`;
  return`<div class="grid"><section class="card paidbox"><div class="secthead"><h2>Toán Jenny · Lớp ${st.grade}</h2><span class="tag paid">2 buổi/tuần</span></div><p class="muted" style="margin:4px 0 12px">Cô giáo mở buổi nào thì em học buổi đó. Mỗi buổi có video, ví dụ và 3 màn, được tới 9 sao.</p>
   <div class="grid" style="gap:12px">${(P2_1.filter(x=>x.grade===st.grade).length?P2_1.filter(x=>x.grade===st.grade):[{id:"jdraft"+st.grade,week:1,title:"Buổi 1 · đang soạn",draft:true}]).map(x=>{const s=j1s(st,x.id),open=(UNL||!!S.open[x.id])&&!x.draft,got=s.m.reduce((a,v,i)=>a+(v?STAR2[i]:0),0);
    return`<button class="pxq ${open?'mist':''}" style="${open?'':'opacity:.7'}" ${open?`onclick="go({k:'jenny',id:'${x.id}'})"`:`onclick="toast('${x.draft?'Buổi này đang được soạn.':'Cô giáo chưa mở buổi này.'}')"`}><span class="pxq-ic">${open?spr('star',38):spr('lock',30)}</span><span class="pxq-tx"><b>${esc(x.title)}</b><span>Tuần ${x.week} · ${x.draft?'đang soạn':open?`${got}/9 sao`:'cô chưa mở'}</span></span><span class="pxq-go">${open?(got?'Học tiếp ▶':'Vào học ▶'):'Khóa'}</span></button>`}).join('')}</div></section></div>`;
}
function viewJenny1(){const st=S.st[sid],x=ju1(scr.id),s=j1s(st,x.id);
  const items=[{done:s.intro,can:true,t:'Video · Jenny giảng',d:`${x.slides.length} trang · Jenny đọc`,act:`go({k:'jslide',id:'${x.id}',i:0})`,lbl:s.intro?'Xem lại':'Xem'},{done:s.ex,can:UNL||s.intro,t:'Ví dụ dẫn dắt',d:'Jenny giải mẫu một bài',act:`go({k:'jex',id:'${x.id}'})`,lbl:s.ex?'Xem lại':'Xem'}]
   .concat([0,1,2].map(L=>({done:s.m[L],can:UNL||s.ex&&(L===0||s.m[L-1]),t:`Màn ${'★'.repeat(L+1)}`,d:`${QN()} câu · 3 tim · +${STAR2[L]} sao`,act:`startJ1('${x.id}',${L})`,lbl:s.m[L]?'Chơi lại':'Chơi'})));
  const nx=items.findIndex(i=>!i.done&&i.can);
  return`<div class="page"><div class="crumb"><button class="btn sm ghost" onclick="go({k:'home',tab:'jenny'})">← Toán Jenny</button></div>
   <div class="card"><div class="lesson">${jenny(64)}<div class="grow"><h1>${esc(x.title)}</h1><div class="muted">Toán Jenny · Lớp 1 · nội dung mẫu</div></div></div>
   <ul class="tl">${items.map((i,k)=>`<li class="${i.done?'done':''} ${k===nx?'next':''} ${!i.can&&!i.done?'off':''}"><span class="n">${i.done?'✓':k+1}</span><div class="grow"><b>${i.t}</b><span class="muted">${i.d}</span></div><button class="btn sm ${k===nx?'pri':''}" ${i.can?'':'disabled'} onclick="${i.act}">${i.can?i.lbl:'🔒'}</button></li>`).join('')}</ul></div></div>`}
function viewJSlide1(){const x=ju1(scr.id),i=scr.i,sl=x.slides[i],last=i===x.slides.length-1;
  return`<div class="page"><div class="crumb"><button class="btn sm ghost" onclick="try{speechSynthesis.cancel()}catch(e){};go({k:'jenny',id:'${x.id}'})">← ${esc(x.title)}</button></div>
   <div class="card g1slide"><div class="row" style="justify-content:space-between"><span class="pill">Trang ${i+1}/${x.slides.length}</span><button class="btn sm" type="button" onclick="sayJ(ju1(scr.id).slides[scr.i].say)">🔊 Nghe lại</button></div>
   <h2 style="margin:12px 0">${esc(sl.t)}</h2><div class="g1slb">${sl.h}</div>
   <div class="row" style="margin-top:16px;justify-content:space-between"><button class="btn" type="button" ${i?'':'disabled'} onclick="go({k:'jslide',id:'${x.id}',i:${i-1}})">← Trước</button>${last?`<button class="btn pri" type="button" onclick="j1s(S.st[sid],'${x.id}').intro=true;log(sid,'watched','${esc(x.title)}',0,{});save();go({k:'jenny',id:'${x.id}'})">Xong video ✓</button>`:`<button class="btn pri" type="button" onclick="go({k:'jslide',id:'${x.id}',i:${i+1}})">Tiếp →</button>`}</div></div></div>`}
function viewJEx1(){const x=ju1(scr.id),e=x.ex;
  return`<div class="page"><div class="crumb"><button class="btn sm ghost" onclick="go({k:'jenny',id:'${x.id}'})">← ${esc(x.title)}</button></div>
   <div class="card g1slide"><span class="pill">Ví dụ dẫn dắt</span><div class="g1q" style="margin-top:12px">${jenny(54)}<div class="g1bub"><div>${e.q}</div><button class="g1spk" type="button" onclick="sayJ(ju1(scr.id).ex.q)" aria-label="Nghe lại">🔊</button></div></div><div class="g1pic" style="margin:12px 0">${e.pic}</div>
   ${scr.show?`<div class="sheet ok" style="animation:none"><div class="sh"><span class="ic">✓</span><div><b>Đáp án: ${e.a}</b><div>${e.sol}</div></div></div><button class="gobtn" type="button" style="margin-top:12px" onclick="j1s(S.st[sid],'${x.id}').ex=true;log(sid,'studied','${esc(x.title)}',0,{});save();go({k:'jenny',id:'${x.id}'})">Em hiểu rồi!</button>`:`<button class="gobtn" type="button" onclick="scr.show=1;render();sayJ(ju1(scr.id).ex.sol)">Xem Jenny giải</button>`}</div></div>`}
function startJ1(id,L){const x=ju1(id),gens=x.lv[L],ord=shuf(gens.map((_,i)=>i));v1Said='';go({k:'game',g1:1,part:2,id,lv:L,qs:Array.from({length:QN()},(_,k)=>gens[ord[k%gens.length]]()),j:0,hearts:3,ok:0,tries:0,res:[],sheet:null,picks:[],seq:[],fill:[],used:[],cnt:0,hp:0,t0:Date.now()})}


function viewHome1t(){const st=S.st[sid],tab=scr.tab||'map',nm=Object.keys(mist(st)).length;
  const nav=[['map','🗺️','Bản đồ'],['jenny','★','Toán Jenny'],['fix','📒','Luyện lỗi'],['album',spr('fish',24),'Sưu tập']];
  let body=tab==='jenny'?viewJTab1(st):tab==='fix'?viewFix1(st):tab==='album'?viewAlbum(st):viewHome1();
  if(tab==='map'){const c=cbCard(st);if(c)body=body.replace('<!--CARDS-->','<!--CARDS-->'+c)}
  if(tab==='map'&&nm)body=body.replace('<!--CARDS-->',`<!--CARDS--><button class="pxq mist" onclick="go({k:'home',tab:'fix'})"><span class="pxq-ic">${spr('book',46)}<i class="pxq-n">${nm}</i></span><span class="pxq-tx"><b>Sổ lỗi sai</b><span>${nm} dạng bài cần sửa · mỗi lỗi sửa xong +5 ${spr('coin',14)}</span><span class="pxq-dots" aria-hidden="true">${Array.from({length:Math.min(6,nm)},()=>'<i></i>').join('')}</span></span><span class="pxq-go">Luyện ▶</span></button>`);
  if(tab==='map'&&st.active){const jb=P2_1.find(x=>!x.draft&&S.open[x.id]&&!j1s(st,x.id).m.every(Boolean));if(jb)body=body.replace('<!--CARDS-->',`<!--CARDS--><button class="pxq" style="--pq:#FCB40C;--pq2:#F37A1F" onclick="go({k:'jenny',id:'${jb.id}'})"><span class="pxq-ic">${spr('star',38)}</span><span class="pxq-tx"><b>Cô vừa mở Toán Jenny</b><span>${esc(jb.title)}</span></span><span class="pxq-go">Học ▶</span></button>`)}
  return body+`<nav class="bnav" aria-label="Điều hướng">${nav.map(([k,i,n])=>`<button class="${k===tab?'on':''}" aria-current="${k===tab?'page':'false'}" onclick="go({k:'home',tab:'${k}'})"><span aria-hidden="true">${i}</span>${n}</button>`).join('')}</nav>`}
function endFix1(){const g=scr,st=S.st[sid];g.end=true;g.pass=true;st.coins+=g.fixed*5;log(sid,'passed',`Toán ${curG()} · Sổ lỗi sai`,0,{success:true,score:{raw:g.fixed}});sfx(g.fixed?'win':'ok');sayJ(g.fixed?`Em đã sửa xong ${NUMW[g.fixed]||g.fixed} lỗi. Giỏi quá!`:'Luyện tốt lắm!');save();render()}
function endJ1(alive){const g=scr,st=S.st[sid],x=ju1(g.id),s=j1s(st,x.id),qd=quest(st);g.end=true;g.pass=alive&&g.hearts>0&&g.ok>=needOf(g.qs.length);g.newStar=0;
  if(g.pass){qd.pass++;if(!s.m[g.lv]){s.m[g.lv]=true;g.newStar=STAR2[g.lv]}st.coins+=15;log(sid,'passed',`${x.title} · màn ${g.lv+1}`,0,{success:true,score:{raw:g.ok,max:g.qs.length}});sfx('win');sayJ('Em qua màn rồi! Giỏi quá!')}
  else{s.fails[g.lv]=(s.fails[g.lv]||0)+1;log(sid,'failed',`${x.title} · màn ${g.lv+1}`,0,{success:false});sfx('bad');sayJ('Không sao cả. Mình chơi lại nhé!')}save();render()}
function viewEnd1b(){const g=scr,st=S.st[sid];
  if(g.fix){const left=Object.keys(mist(st)).length;return`<div class="game g1"><div class="gend"><div class="bigicon">${spr('book',84)}</div><h1>${g.fixed?`Sửa xong ${g.fixed} lỗi!`:'Luyện tốt lắm!'}</h1><p class="muted">${g.ok}/${g.qs.length} câu đúng${g.fixed?` · +${g.fixed*5} xu`:''}</p><p class="muted">Mỗi dạng cần đúng 2 lần liền mới ra khỏi sổ. Sổ còn ${left} dạng.</p><div class="gendbtn">${left?`<button class="gobtn" type="button" onclick="startFix1()">Luyện tiếp</button>`:''}<button class="gobtn ghost" type="button" onclick="go({k:'home',tab:'fix'})">Về sổ lỗi sai</button><button class="gobtn ghost" type="button" onclick="go({k:'home'})">Bản đồ</button></div></div></div>`}
  const x=ju1(g.id),nx=g.lv<2?g.lv+1:-1;
  return`<div class="game g1"><div class="gend">${g.pass?`<div class="bigicon">${spr('star',84)}</div>`:jenny(84)}<h1>${g.pass?'Qua màn!':'Mình chơi lại nhé!'}</h1><p class="muted">${g.ok}/${g.qs.length} câu đúng${g.pass?' · +15 xu':''}</p>${g.newStar?`<p class="earn">+${g.newStar} sao Toán Jenny</p>`:''}
   <div class="gendbtn">${g.pass&&nx>0?`<button class="gobtn" type="button" onclick="startJ1('${x.id}',${nx})">Màn ${'★'.repeat(nx+1)}</button>`:''}${!g.pass?`<button class="gobtn" type="button" onclick="startJ1('${x.id}',${g.lv})">Chơi lại</button>`:''}<button class="gobtn ghost" type="button" onclick="go({k:'jenny',id:'${x.id}'})">Về buổi học</button><button class="gobtn ghost" type="button" onclick="go({k:'home',tab:'jenny'})">Toán Jenny</button></div></div></div>`}


/* ---- dữ liệu chung Tiểu học ---- */
const PRIM={1:{T:T1,isl:P1_1,boss:BOSSES1}};
const curG=()=>{const st=S&&S.st&&S.st[sid];return st&&st.grade<=5?st.grade:1};
const PD=()=>PRIM[curG()],PI=()=>PD().isl,PT=()=>PD().T,PB=()=>PD().boss,QN=()=>curG()<=2?5:8;
const WORDRX=/lời văn|ba bước|Hơn, kém|nhóm|gấp khúc|Chu vi|Tìm số hạng/;
const qW=q=>curG()>=3&&WORDRX.test(q.kind||'')?1.6:1;
const needOf=n=>Math.ceil(n*0.75);
