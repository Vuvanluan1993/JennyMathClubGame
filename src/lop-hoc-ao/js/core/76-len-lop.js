/* 76 — Kết thúc năm học · Lên lớp (Quản lý › 🎓 Năm học · Lên lớp).
   Bước 1: lớp cũ → lớp mới (1A → 2A…), lớp 5 → Đã học xong, giữ/bỏ giáo viên.
   Bước 2: từng em: Lên lớp (mặc định) · Ở lại lớp · Nghỉ học.
   Bước 3: xem lại rồi xác nhận. Xu, đồ, thú cưng, tủ đồ, Sổ lỗi sai giữ nguyên; sao và tiến độ năm cũ cất vào Hồ sơ năm học. */
(function(){
if(typeof viewPH==='undefined')return;
const O=()=>S.org,e=s=>esc(String(s==null?'':s));
const LOPS=()=>[...(O().lop||[])].sort((a,b)=>a.khoi-b.khoi||a.ten.localeCompare(b.ten));
const namSau=n=>{const m=String(n||'').match(/(\d{4})\D+(\d{4})/);return m?`${+m[1]+1}–${+m[2]+1}`:''};
const goiY=l=>l.khoi>=5?'':String(l.ten).replace(/^(\D*)(\d+)/,(m,a,d)=>a+(+d+1))||String(l.khoi+1)+l.ten;
window.LL=null;
const moi=()=>{const L=LOPS();return{buoc:1,lop:Object.fromEntries(L.map(l=>[l.id,l.khoi>=5?'':goiY(l)])),gv:Object.fromEntries(L.map(l=>[l.id,true])),hs:{},xem:(L[0]||{}).id||'',nam:namSau(O().nam)}};
const hsCua=lid=>STUDENTS.filter(s=>(O().gd||{})[s[0]]===lid).sort((a,b)=>a[1].split(' ').pop().localeCompare(b[1].split(' ').pop())||a[1].localeCompare(b[1]));
const quyet=(id,l)=>LL.hs[id]||(l.khoi>=5?'xong':'len');
/* P-09b: thời hạn lưu — em nghỉ/học xong quá 24 tháng thì nhắc quản lý xuất rồi xoá (không xoá tự động).
   Thời điểm nghỉ = x.luc (ghi từ 25/10/2026); bản ghi cũ thiếu luc thì suy từ cuối năm học trong x.nam (31/5 của năm sau). */
const nghiLuc=x=>{if(x&&+x.luc>0)return +x.luc;const m=String((x&&x.nam)||'').match(/(\d{4})\D+(\d{4})/);return m?new Date(+m[2],4,31).getTime():0};
const quaHan=x=>{const l=nghiLuc(x);if(!l)return false;const d=new Date(l);d.setMonth(d.getMonth()+24);return Date.now()>d.getTime()};
const ngayVN=t=>{const d=new Date(t),p=n=>String(n).padStart(2,'0');return`${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`};
window.llQuaHan=quaHan;window.llNghiLuc=nghiLuc;

/* lên lớp dữ liệu một em: cất năm cũ vào st.namHoc, đổi khối, làm mới tiến độ đảo của khối mới */
window.lenLopHS=function(st,khoiMoi,nam,lopTen){if(!st||!(khoiMoi>st.grade))return st;
 const sao=typeof totalStars==='function'?(()=>{try{return totalStars(st)}catch(x){return 0}})():0;
 (st.namHoc=st.namHoc||[]).push({nam:nam||'',khoi:st.grade,lop:lopTen||'',sao,p1:st.p1});
 st.grade=khoiMoi;st.p1={};return st};

function trang(){const o=O();if(!LL)return trang0();return`<div class="grid"><div class="qlhd"><button type="button" class="btn sm ghost" onclick="LL=null;render()">← Năm học</button><h1>🎓 Kết thúc năm học ${e(o.nam)}</h1></div>
 <div class="llstep">${['Lớp mới','Từng học sinh','Xác nhận'].map((t,i)=>`<span class="${LL.buoc===i+1?'on':LL.buoc>i+1?'xong':''}">${i+1}. ${t}</span>`).join('')}</div>
 ${LL.buoc===1?b1():LL.buoc===2?b2():b3()}</div>`}
function trang0(){const o=O(),L=LOPS(),n=STUDENTS.filter(s=>(o.gd||{})[s[0]]).length,ng=Object.entries(o.nghi||{}),cu=o.namCu||[];
 return`<div class="grid"><div class="qlhd"><button type="button" class="btn sm ghost" onclick="qlDi('')">← Quản lý</button><h1>🎓 Năm học · Lên lớp</h1></div>
 <section class="card"><h2>Năm học ${e(o.nam)}</h2><p>${L.length} lớp · ${n} em đang học.</p>
  <p class="muted">Cuối năm bấm "Kết thúc năm học": lớp 1A thành 2A, 2A thành 3A…; lớp 5 thành "Đã học xong". Thầy chọn em ở lại lớp hoặc nghỉ học. Xu, đồ, thú cưng, tủ đồ, Sổ lỗi sai của em giữ nguyên; sao và tiến độ năm cũ cất vào Hồ sơ năm học; bản đồ mở chương trình lớp mới.</p>
  <button type="button" class="btn pri" ${L.length?'':'disabled'} onclick="LL=llMoi();render()">Kết thúc năm học ${e(o.nam)} ▸</button></section>
 ${cu.length?`<section class="card"><h2>Các năm học trước</h2>${cu.slice().reverse().map(y=>`<div class="qlr qgv"><div class="a-ten"><b>${e(y.nam)}</b><div class="muted">${(y.lop||[]).length} lớp · ${Object.keys(y.gd||{}).length} em</div></div><div class="a-con">${(y.lop||[]).map(l=>`<span class="pill">${e(l.ten)}</span>`).join('')}</div></div>`).join('')}</section>`:''}
 ${ng.length?(()=>{const qh=ng.filter(([id,x])=>quaHan(x)).length;return`<section class="card"><h2>Nghỉ học · Đã học xong (${ng.length})</h2>${qh?`<p class="qlnerr llqh0">⚠ ${qh} em đã nghỉ quá 24 tháng (thời hạn lưu). Nên bấm ⬇ Xuất để lưu file rồi 🗑 Xoá; app không tự xoá.</p>`:''}<p class="muted" style="margin:0 0 8px">Các em này không đăng nhập được; hồ sơ vẫn giữ. Bấm "Mở lại" rồi xếp lớp nếu em học tiếp.</p>${ng.map(([id,x])=>{const n=(STUDENTS.find(s=>s[0]===id)||[id,id])[1],q=quaHan(x),l=nghiLuc(x);return`<div class="qlr qds${q?' llqh':''}"><span class="a-ck">${x.ly==='xong'?'🎓':'⏸'}</span><div class="a-ten"><b>${e(n)}</b><div class="muted">${e(id)} · ${x.ly==='xong'?'Đã học xong':'Nghỉ học'} · ${e(x.nam||'')}${l?` · từ ${ngayVN(l)}${x.luc?'':' (ước)'}`:''}</div>${q?'<span class="pill llqhn">Quá 24 tháng · xoá theo thời hạn</span>':''}</div><div class="a-act">${q?`<button type="button" class="btn sm" onclick="qlXuatHS('${id}')">⬇ Xuất</button><button type="button" class="btn sm qlxbtn" onclick="qlXoaHS(['${id}'])">🗑 Xoá</button>`:''}<button type="button" class="btn sm" onclick="qlMoLai('${id}')">Mở lại</button></div></div>`}).join('')}</section>`})():''}</div>`}
window.llMoi=moi;

function b1(){const L=LOPS();
 const rows=L.map(l=>{const n=hsCua(l.id).length,v=LL.lop[l.id];return`<div class="qlr llr"><div class="a-ten"><b>Lớp ${e(l.ten)}</b><div class="muted">Khối ${l.khoi} · ${n} em · ${(l.gv||[]).map(g=>e(((O().gv||[]).find(x=>x.id===g)||{ten:g}).ten)).join(', ')||'chưa có GV'}</div></div>
  <div class="a-con">${l.khoi>=5?'<span class="pill">🎓 Đã học xong</span>':`<span class="llto">→ Lớp</span><input value="${e(v)}" maxlength="8" aria-label="Tên lớp mới của ${e(l.ten)}" oninput="LL.lop['${l.id}']=this.value.trim()"><span class="muted">khối ${l.khoi+1}</span>`}</div>
  <div class="a-act">${l.khoi>=5?'':`<label class="qlnl"><input type="checkbox" ${LL.gv[l.id]?'checked':''} onchange="LL.gv['${l.id}']=this.checked"> Giữ giáo viên</label>`}</div></div>`}).join('');
 return`<section class="card"><h2>Bước 1 · Lớp năm học mới</h2><p class="muted" style="margin:0 0 8px">Mỗi lớp lên 1 khối. Sửa tên lớp mới nếu cần. Lớp 1 mới cho học sinh mới: tạo sau ở trang Lớp.</p><div class="qlli">${rows}</div>
 <div class="qlin" style="margin-top:12px"><label>Năm học mới <input value="${e(LL.nam)}" maxlength="12" aria-label="Năm học mới" oninput="LL.nam=this.value.trim()"></label><span class="grow"></span><button type="button" class="btn pri" onclick="llSang(2)">Tiếp: từng học sinh ▸</button></div></section>`}
window.llSang=function(b){if(b===2||b===3){const L=LOPS().filter(l=>l.khoi<5),ten=L.map(l=>(LL.lop[l.id]||'').toUpperCase());
  const sai=L.find(l=>!/^[0-9A-Za-zÀ-ỹ.\-]{1,8}$/.test(LL.lop[l.id]||''));if(sai){toast(`Nhập tên lớp mới cho lớp ${sai.ten}`);LL.buoc=1;render();return}
  const tr=ten.find((t,i)=>ten.indexOf(t)!==i);if(tr){toast(`Tên lớp mới "${tr}" bị trùng`);LL.buoc=1;render();return}
  if(!/\d{4}\D+\d{4}/.test(LL.nam)){toast('Nhập năm học mới, ví dụ 2027–2028');LL.buoc=1;render();return}}
 LL.buoc=b;render();scrollTo(0,0)};
function b2(){const L=LOPS(),l=L.find(x=>x.id===LL.xem)||L[0];if(!l)return'';const ds=hsCua(l.id);
 const opt=(id,v,t)=>`<option value="${v}" ${quyet(id,l)===v?'selected':''}>${t}</option>`;
 const dem=x=>{let a=0;hsCua(x.id).forEach(([id])=>{if(!['len','xong'].includes(quyet(id,x)))a++});return a};
 return`<section class="card"><h2>Bước 2 · Từng học sinh</h2><p class="muted" style="margin:0 0 8px">Mặc định cả lớp lên lớp. Chỉ cần đổi các em ở lại lớp hoặc nghỉ học.</p>
 <div class="qlchips" style="margin-bottom:10px">${L.map(x=>`<button type="button" class="btn sm ${x.id===l.id?'pri':''}" onclick="LL.xem='${x.id}';render()">${e(x.ten)}${dem(x)?` · ${dem(x)}`:''}</button>`).join('')}</div>
 <h3 style="margin:0 0 6px">Lớp ${e(l.ten)} → ${l.khoi>=5?'Đã học xong':'Lớp '+e(LL.lop[l.id])} (${ds.length} em)</h3>
 <div class="qlli">${ds.map(([id,n])=>`<div class="qlr qds"><span class="a-ck"></span><div class="a-ten"><b>${e(n)}</b><div class="muted">${e(id)}</div></div><div class="a-act"><select aria-label="Năm sau của ${e(n)}" onchange="LL.hs['${id}']=this.value;render()" class="${['len','xong'].includes(quyet(id,l))?'':'qlchua qllop'}">${l.khoi>=5?opt(id,'xong','🎓 Học xong'):opt(id,'len','⬆ Lên lớp')}${opt(id,'o','↺ Ở lại lớp')}${opt(id,'nghi','⏸ Nghỉ học')}</select></div></div>`).join('')||'<p class="muted">Lớp chưa có em nào.</p>'}</div>
 <div class="qlin" style="margin-top:12px"><button type="button" class="btn" onclick="llSang(1)">◂ Lớp mới</button><span class="grow"></span><button type="button" class="btn pri" onclick="llSang(3)">Tiếp: xem lại ▸</button></div></section>`}
function tinh(){const o=O(),L=LOPS(),r={len:0,o:0,nghi:0,xong:0,lop:0,ve:[]};
 L.forEach(l=>{if(l.khoi<5)r.lop++;hsCua(l.id).forEach(([id])=>{r[quyet(id,l)]++})});return r}
function b3(){const o=O(),r=tinh(),L=LOPS();
 return`<section class="card"><h2>Bước 3 · Xem lại và xác nhận</h2>
 <ul class="llsum"><li>Năm học <b>${e(o.nam)}</b> → <b>${e(LL.nam)}</b></li><li><b>${r.lop}</b> lớp lên khối mới: ${L.filter(l=>l.khoi<5).map(l=>`${e(l.ten)}→${e(LL.lop[l.id])}`).join(', ')||'—'}</li>
 <li>⬆ <b>${r.len}</b> em lên lớp</li><li>↺ <b>${r.o}</b> em ở lại lớp (chưa xếp lớp — thầy xếp lại vào lớp cùng khối)</li><li>⏸ <b>${r.nghi}</b> em nghỉ học (khoá đăng nhập, giữ hồ sơ)</li><li>🎓 <b>${r.xong}</b> em học xong lớp 5 (khoá đăng nhập, giữ hồ sơ)</li>
 <li>Giữ nguyên: xu, đồ, thú cưng, tủ đồ, Sổ lỗi sai. Sao và tiến độ năm ${e(o.nam)} cất vào Hồ sơ năm học. Bài cô giao năm cũ chuyển vào lưu trữ. Gói Toán Jenny theo lớp giữ nguyên hạn cũ.</li></ul>
 <p class="qlnerr">Việc này áp dụng cho cả trung tâm. Hãy tải danh sách Excel để lưu trước khi xác nhận.</p>
 <div class="qlin"><button type="button" class="btn" onclick="llSang(2)">◂ Từng học sinh</button><button type="button" class="btn" onclick="qlTaiDS&&qlTaiDS()">⬇ Tải danh sách</button><span class="grow"></span><button type="button" class="btn pri" onclick="llChay()">Xác nhận kết thúc năm học</button></div></section>`}

window.llChay=async function(){const o=O(),r=tinh();if(!confirm(`Kết thúc năm học ${o.nam} và chuyển sang ${LL.nam}?\n${r.len} em lên lớp, ${r.o} ở lại, ${r.nghi} nghỉ, ${r.xong} học xong.\nKhông hoàn tác được.`))return;
 const namCu=o.nam,L=LOPS(),gdMoi={},lopMoi=[],moMoi={};o.nghi=o.nghi||{};o.hosoNam=o.hosoNam||{};
 o.namCu=o.namCu||[];o.namCu.push({nam:namCu,lop:JSON.parse(JSON.stringify(o.lop||[])),gd:Object.assign({},o.gd),t:Date.now()});
 const idMoi={};L.forEach(l=>{if(l.khoi>=5)return;const t=LL.lop[l.id];idMoi[l.id]=t;lopMoi.push(Object.assign({},l,{id:t,ten:t,khoi:l.khoi+1,gv:LL.gv[l.id]?[...(l.gv||[])]:[]}));moMoi[t]={}});
 const row=(id,k)=>[STUDENTS,o.hs||[],o.hsMoi||[]].forEach(a=>a.forEach(x=>{if(x[0]===id)x[2]=k}));
 L.forEach(l=>hsCua(l.id).forEach(([id])=>{const q=quyet(id,l),st=S.st[id];
  let sao=0;try{sao=st?totalStars(st):0}catch(x){}
  (o.hosoNam[id]=o.hosoNam[id]||[]).push({nam:namCu,lop:l.ten,khoi:l.khoi,sao,kq:q});
  if(q==='len'){gdMoi[id]=idMoi[l.id];row(id,l.khoi+1);if(st)lenLopHS(st,l.khoi+1,namCu,l.ten)}
  else if(q==='nghi'||q==='xong'){o.nghi[id]={ly:q,nam:namCu,luc:Date.now()}}
 }));
 o.lop=lopMoi;o.gd=gdMoi;o.mo=moMoi;o.nam=LL.nam;
 (S.asg||[]).forEach(a=>{if(a.lop&&!String(a.lop).includes('@'))a.lop=a.lop+'@'+namCu});
 (o.nk=o.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Kết thúc năm học ${namCu} → ${o.nam}: ${r.len} lên lớp, ${r.o} ở lại, ${r.nghi} nghỉ, ${r.xong} học xong`});
 save();if(o.cloud&&typeof fbDayNgay==='function'){try{await fbDayNgay()}catch(x){toast('Máy chủ chưa nhận: '+(x.message||x))}}
 LL=null;render();toast(`Đã sang năm học ${o.nam}`)};

/* xếp lại lớp thì bỏ trạng thái nghỉ */
{const _c=window.qlChuyen;window.qlChuyen=function(id,lid){if(lid&&O().nghi&&O().nghi[id])delete O().nghi[id];return _c.apply(this,arguments)}}

/* máy chủ: học sinh đăng nhập — nghỉ/học xong thì báo; lớp mới cao hơn thì tự lên lớp */
if(typeof fbHsBoot==='function'){const _b=fbHsBoot;fbHsBoot=async function(){const me=CLOUD.me,tk=me.tk;
  const org=typeof fbOrgHS==='function'?await fbOrgHS(tk):(()=>{return{}})(),ng=(org.nghi||{})[tk];/* P-06a: v3 đọc org/main + lop/{lớp}, không đọc j */
  if(ng)throw{code:ng.ly==='xong'?'hoc-xong':'nghi-hoc'};
  const r=await _b.apply(this,arguments);
  try{const L=(org.lop||[]).find(l=>l.id===(org.gd||{})[tk]),st=S.st[tk];if(L&&st&&L.khoi>st.grade){(STUDENTS[0]||[])[2]=L.khoi;lenLopHS(st,L.khoi,(org.namCu||[]).slice(-1)[0]?.nam||'',(((org.namCu||[]).slice(-1)[0]||{}).lop||[]).find(x=>x.id===(((org.namCu||[]).slice(-1)[0]||{}).gd||{})[tk])?.ten||'');save();render()}}catch(x){}
  return r}}
if(typeof fbLoi==='function'){const _l=fbLoi;fbLoi=function(x){const c=x&&x.code;if(c==='hoc-xong')return'Em đã học xong chương trình tiểu học ở trung tâm. Chúc mừng em! 🎓';if(c==='nghi-hoc')return'Tài khoản đang tạm khoá. Phụ huynh liên hệ trung tâm nhé.';return _l.apply(this,arguments)}}

{const _p=viewPH;viewPH=function(){if(role==='ql'&&typeof qlTrang!=='undefined'&&qlTrang==='nam'){try{return trang()}catch(x){console.error(x);LL=null;return trang0()}}if(role==='ql'&&qlTrang!=='nam')LL=null;return _p.apply(this,arguments)}}

document.head.insertAdjacentHTML('beforeend',`<style>
.llstep{display:flex;gap:6px;flex-wrap:wrap}.llstep span{padding:6px 10px;font-weight:700;font-size:13px;box-shadow:var(--f2);opacity:.6}.llstep span.on{opacity:1;background:#FCB40C;color:#2b1a00}.llstep span.xong{opacity:.9}
.llr{grid-template-columns:minmax(0,1.2fr) minmax(0,1.5fr) auto}.llr .a-con{align-items:center}.llr input:not([type=checkbox]){width:80px;height:38px;box-sizing:border-box}.qlin .grow{flex:1 1 auto}.llto{font-weight:700}
.llsum{margin:0 0 10px;padding-left:20px;display:flex;flex-direction:column;gap:6px}
.qds .a-act select{max-width:170px}
.llqh{background:#FFF8E1}.llqhn{background:#FDECEA!important;color:#B3261E!important;font-weight:700;margin-top:4px;display:inline-block}.llqh .a-act{display:flex;gap:6px;flex-wrap:wrap}.llqh0{margin:0 0 8px}
@media(max-width:640px){.llr{grid-template-columns:minmax(0,1fr)}.llr .a-act{justify-content:flex-start}}
</style>`);
})();
