/* 73 — Trang Quản lý gọn: trang chính 4 nút lớn (Học sinh · Phụ huynh · Giáo viên · Lớp) + trang con.
   Dùng lại các bảng nhập ở 70/71 (qlMoHS, qlMoGV, qlMoLop, qlMoXep, qlMoPH, qlSua) và các hàm ở 58 (qlChuyen, qlPhan, qlBo, qlTJ, qlNgoaiLe). */
(function(){
if(typeof viewPH==='undefined')return;
window.qlTrang='';window.qlLopId='';window.qlTrangSo=0;window.qlChon=window.qlChon||{};
window.qlHsKhoi=0;window.qlHsLop='';window.qlHsTim='';
const O=()=>S.org,e=s=>esc(String(s==null?'':s));
const bo=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
const LOP=()=>[...(O().lop||[])].sort((a,b)=>a.khoi-b.khoi||a.ten.localeCompare(b.ten));
const lopOf=id=>(O().lop||[]).find(l=>l.id===(O().gd||{})[id]);
const gvTen=g=>((O().gv||[]).find(x=>x.id===g)||{ten:g}).ten;
const phOf=id=>(O().ph||{})[id];
const phTen=tk=>((O().phInfo||{})[tk]||{}).ten||tk;
const hs=id=>((O().hoso||{})[id])||{};
window.qlDi=(t,l)=>{qlTrang=t||'';qlLopId=l||'';qlTrangSo=0;qlChon={};render();scrollTo(0,0)};
const back=(t,l,lab)=>`<button type="button" class="btn sm ghost" onclick="qlDi('${t}','${l||''}')">← ${lab}</button>`;
const head=(ic,t,extra)=>`<div class="qlhd">${back('','','Quản lý')}<h1>${ic} ${t}</h1>${extra||''}</div>`;

/* ---------- số liệu ---------- */
function so(){const o=O(),H=STUDENTS,gv=o.gv||[],L=o.lop||[];
 const phTk=new Set(Object.values(o.ph||{}));
 return{hs:H.length,chuaXep:H.filter(s=>!(o.gd||{})[s[0]]).length,ph:phTk.size,chuaPH:H.filter(s=>!phOf(s[0])).length,
  gv:gv.length,gvTrong:gv.filter(g=>!L.some(l=>(l.gv||[]).includes(g.id))).length,lop:L.length,lopTrong:L.filter(l=>!(l.gv||[]).length).length}}

/* ---------- trang chính ---------- */
function home(){const o=O(),n=so();
 const tile=(t,ic,ten,big,warn)=>`<button type="button" class="qltile" onclick="qlDi('${t}')"><span class="qlic">${ic}</span><b>${ten}</b><span class="qln">${big}</span>${warn?`<span class="qlw">⚠ ${warn}</span>`:'<span class="qlok">✓ Đủ</span>'}<span class="qlgo">Mở ▸</span></button>`;
 return`<div class="grid"><div><h1 style="font-size:28px">Quản lý trung tâm</h1><div class="muted">${e(o.ten)} · năm học ${e(o.nam)}</div></div>
 <div class="qltiles">
  ${tile('hs','🎒','Học sinh',n.hs+' em',n.chuaXep?n.chuaXep+' em chưa xếp lớp':'')}
  ${tile('ph','👪','Phụ huynh',n.ph+' tài khoản',n.chuaPH?n.chuaPH+' em chưa có phụ huynh':'')}
  ${tile('gv','👩‍🏫','Giáo viên',n.gv+' người',n.gvTrong?n.gvTrong+' người chưa có lớp':'')}
  ${tile('lop','🏫','Lớp',n.lop+' lớp',n.lopTrong?n.lopTrong+' lớp chưa có giáo viên':'')}
 </div>
 <div class="row" style="gap:10px;flex-wrap:wrap"><button type="button" class="btn" onclick="qlDi('nk')">📒 Nhật ký thao tác</button><button type="button" class="btn" onclick="qlDi('nam')">🎓 Năm học · Lên lớp</button></div></div>`}

/* ---------- Học sinh ---------- */
function trangHS(){const o=O(),L=LOP(),q=bo(qlHsTim);
 const ds0=STUDENTS.filter(([id,n,g])=>{const l=lopOf(id);
  if(qlHsLop==='-'&&l)return false;if(qlHsLop&&qlHsLop!=='-'&&(!l||l.id!==qlHsLop))return false;
  if(qlHsKhoi&&g!==qlHsKhoi)return false;
  if(q){const h=hs(id),p=phOf(id);if(!(bo(n).includes(q)||id.includes(q)||(h.dt||'').includes(q)||(p&&bo(phTen(p)).includes(q))))return false}
  return true}).sort((a,b)=>(lopOf(a[0])?1:0)-(lopOf(b[0])?1:0)||a[1].split(' ').pop().localeCompare(b[1].split(' ').pop())||a[1].localeCompare(b[1]));
 const per=20,trang=Math.max(1,Math.ceil(ds0.length/per));if(qlTrangSo>=trang)qlTrangSo=trang-1;const ds=ds0.slice(qlTrangSo*per,qlTrangSo*per+per);
 const chon=Object.keys(qlChon).filter(k=>qlChon[k]),nChua=STUDENTS.filter(s=>!lopOf(s[0])).length;
 const rows=ds.map(([id,n,g])=>{const l=lopOf(id),h=hs(id),p=phOf(id),st=S.st[id]||{};
  const ns=[h.gt==='nam'?'Nam':h.gt==='nu'?'Nữ':'',h.ng&&h.th?`${h.ng}/${h.th}${h.nam?'/'+h.nam:''}`:(h.nam||'')].filter(Boolean).join(' · ');
  return`<tr><td><input type="checkbox" aria-label="Chọn ${e(n)}" ${qlChon[id]?'checked':''} onchange="qlChon['${id}']=this.checked;render()"></td>
  <td><b>${e(n)}</b><div class="muted">${e(id)}${ns?' · '+e(ns):''}</div></td>
  <td>${l?`<button type="button" class="lnk" onclick="qlDi('lopct','${l.id}')">${e(l.ten)}</button>`:'<span class="pill qlwarn">Chưa xếp lớp</span>'}</td>
  <td>${p?e(phTen(p)):(h.dt?`<span class="muted">${e(h.dt)}</span>`:'<span class="muted">—</span>')}</td>
  <td class="qlact"><button type="button" class="btn sm" onclick="qlSua('${id}')">✎ Sửa</button></td></tr>`}).join('');
 const lopOpt=L.map(l=>`<option value="${l.id}" ${qlHsLop===l.id?'selected':''}>Lớp ${e(l.ten)}</option>`).join('');
 return`<div class="grid">${head('🎒','Học sinh',`<span class="pill">${STUDENTS.length} em</span>`)}
 <div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn pri" onclick="qlMoHS()">+ Thêm học sinh</button><button type="button" class="btn" onclick="qlMoXep()">⇄ Xếp lớp</button></div>
 ${nChua?`<div class="qlnote">⚠ ${nChua} em chưa xếp lớp — các em <b>chưa đăng nhập được</b>. <button type="button" class="btn sm" onclick="qlHsLop='-';qlTrangSo=0;render()">Xem các em này</button></div>`:''}
 <section class="card"><div class="row qlfil">
  <select aria-label="Lọc theo khối" onchange="qlHsKhoi=+this.value;qlTrangSo=0;render()"><option value="0">Tất cả khối</option>${[1,2,3,4,5].map(k=>`<option value="${k}" ${qlHsKhoi===k?'selected':''}>Khối ${k}</option>`).join('')}</select>
  <select aria-label="Lọc theo lớp" onchange="qlHsLop=this.value;qlTrangSo=0;render()"><option value="">Tất cả lớp</option><option value="-" ${qlHsLop==='-'?'selected':''}>Chưa xếp lớp (${nChua})</option>${lopOpt}</select>
  <input type="search" placeholder="Tìm tên, tên đăng nhập, SĐT phụ huynh" aria-label="Tìm học sinh" value="${e(qlHsTim)}" onkeydown="if(event.key==='Enter'){qlHsTim=this.value.trim();qlTrangSo=0;render()}" onchange="qlHsTim=this.value.trim();qlTrangSo=0;render()">
 </div>
 <div class="tablewrap"><table class="qltb"><tr><th><input type="checkbox" aria-label="Chọn cả trang" ${ds.length&&ds.every(s=>qlChon[s[0]])?'checked':''} onchange="${ds.map(s=>`qlChon['${s[0]}']=this.checked;`).join('')}render()"></th><th>Học sinh</th><th>Lớp</th><th>Phụ huynh</th><th></th></tr>${rows||'<tr><td colspan="5" class="muted">Không có em nào.</td></tr>'}</table></div>
 <div class="row qlbar">${chon.length?`<span><b>Đã chọn ${chon.length} em:</b></span><select id="qlChLop" aria-label="Chuyển đến lớp">${L.map(l=>`<option value="${l.id}">Lớp ${e(l.ten)}</option>`).join('')}</select><button type="button" class="btn sm pri" onclick="qlChuyenNhieu(document.getElementById('qlChLop').value)">Chuyển vào lớp</button><button type="button" class="btn sm" onclick="qlChuyenNhieu('')">Bỏ khỏi lớp</button><button type="button" class="btn sm ghost" onclick="qlChon={};render()">Bỏ chọn</button>`:'<span class="muted">Chọn các em để chuyển lớp cùng lúc.</span>'}
  <span class="grow"></span><span class="muted">${ds0.length} em</span>${trang>1?`<button type="button" class="btn sm" ${qlTrangSo?'':'disabled'} onclick="qlTrangSo--;render()">◂</button><span>Trang ${qlTrangSo+1}/${trang}</span><button type="button" class="btn sm" ${qlTrangSo<trang-1?'':'disabled'} onclick="qlTrangSo++;render()">▸</button>`:''}</div>
 </section></div>`}
window.qlChuyenNhieu=function(lid){const ids=Object.keys(qlChon).filter(k=>qlChon[k]);if(!ids.length)return;
 const l=lid&&(O().lop||[]).find(x=>x.id===lid);
 if(l){const khac=ids.filter(id=>{const c=lopOf(id);return c&&c.khoi!==l.khoi});if(khac.length&&!confirm(`${khac.length} em đang ở lớp khác khối. Vẫn chuyển vào lớp ${l.ten}?`))return}
 ids.forEach(id=>{if((O().gd||{})[id]===(lid||undefined))return;try{window.qlChuyen(id,lid)}catch(x){}});
 qlChon={};save();if(typeof fbDayNgay==='function'&&O().cloud){try{fbDayNgay()}catch(x){}}render();toast(lid?`Đã chuyển ${ids.length} em vào lớp ${l?l.ten:lid}`:`Đã bỏ ${ids.length} em khỏi lớp`)};

/* ---------- Phụ huynh ---------- */
function trangPH(){const o=O(),m={};Object.entries(o.ph||{}).forEach(([c,tk])=>{(m[tk]=m[tk]||[]).push(c)});const tks=Object.keys(m).sort((a,b)=>phTen(a).localeCompare(phTen(b))),info=o.phInfo||{};
 const ten=id=>(STUDENTS.find(s=>s[0]===id)||[id,id])[1];
 const chua=STUDENTS.filter(s=>!phOf(s[0]));
 return`<div class="grid">${head('👪','Phụ huynh',`<span class="pill">${tks.length} tài khoản</span>`)}
 <div class="row" style="gap:8px"><button type="button" class="btn pri" onclick="qlMoPH('')">+ Tài khoản phụ huynh</button></div>
 <p class="muted" style="margin:0">Một tài khoản phụ huynh gắn được nhiều con (anh chị em cùng bố mẹ).</p>
 <section class="card"><h2>Tài khoản phụ huynh</h2>${tks.length?`<div class="tablewrap"><table class="qltb"><tr><th>Phụ huynh</th><th>Con</th><th></th></tr>${tks.map(t=>`<tr><td><b>${e(phTen(t))}</b><div class="muted">${e(t)}${(info[t]||{}).dt?' · '+e(info[t].dt):''}</div></td><td>${m[t].map(c=>`<span class="pill">${e(ten(c))}</span>`).join(' ')}</td><td><button type="button" class="btn sm" onclick="qlMoPH('${t}')">Sửa con</button></td></tr>`).join('')}</table></div>`:'<p class="muted">Chưa có tài khoản phụ huynh.</p>'}</section>
 <section class="card"><h2>Em chưa có phụ huynh (${chua.length})</h2>${chua.length?`<div class="qlchips">${chua.slice(0,60).map(s=>`<span class="pill">${e(s[1])}</span>`).join(' ')}${chua.length>60?` <span class="muted">… và ${chua.length-60} em</span>`:''}</div>`:'<p class="muted">Em nào cũng đã có phụ huynh.</p>'}</section>
 ${o.cloud&&typeof fbTaiKhoanBox==='function'?fbTaiKhoanBox():''}</div>`}

/* ---------- Giáo viên ---------- */
function trangGV(){const o=O(),L=o.lop||[];
 const rows=(o.gv||[]).map(g=>{const ls=L.filter(l=>(l.gv||[]).includes(g.id));return`<tr><td><b>${e(g.ten)}</b><div class="muted">${e(g.tk||g.id)}${g.dt?' · '+e(g.dt):''}</div></td><td>${ls.length?ls.map(l=>`<button type="button" class="pill lnk" onclick="qlDi('lopct','${l.id}')">${e(l.ten)}</button>`).join(' '):'<span class="pill qlwarn">Chưa có lớp</span>'}</td></tr>`}).join('');
 return`<div class="grid">${head('👩‍🏫','Giáo viên',`<span class="pill">${(o.gv||[]).length} người</span>`)}
 <div class="row" style="gap:8px"><button type="button" class="btn pri" onclick="qlMoGV()">+ Thêm giáo viên</button></div>
 <p class="muted" style="margin:0">Phân công dạy lớp: vào trang Lớp › chọn lớp › Phân công giáo viên.</p>
 <section class="card"><div class="tablewrap"><table class="qltb"><tr><th>Giáo viên</th><th>Lớp đang dạy</th></tr>${rows||'<tr><td colspan="2" class="muted">Chưa có giáo viên.</td></tr>'}</table></div></section></div>`}

/* ---------- Lớp ---------- */
function trangLop(){const L=LOP();
 const rows=L.map(l=>{const n=STUDENTS.filter(s=>(O().gd||{})[s[0]]===l.id).length;return`<tr><td><b>${e(l.ten)}</b><div class="muted">Khối ${l.khoi}</div></td><td>${(l.gv||[]).length?l.gv.map(g=>e(gvTen(g))).join(', '):'<span class="pill qlwarn">Chưa có giáo viên</span>'}</td><td><b>${n}</b></td><td>${l.tj&&l.tj.on?`<span class="pill ok">Toán Jenny · hạn ${e(l.tj.han)}</span>`:'<span class="muted">Chưa có gói</span>'}</td><td><button type="button" class="btn sm" onclick="qlDi('lopct','${l.id}')">Mở ▸</button></td></tr>`}).join('');
 return`<div class="grid">${head('🏫','Lớp',`<span class="pill">${L.length} lớp</span>`)}
 <div class="row" style="gap:8px"><button type="button" class="btn pri" onclick="qlMoLop()">+ Thêm lớp</button></div>
 <section class="card"><div class="tablewrap"><table class="qltb"><tr><th>Lớp</th><th>Giáo viên</th><th>Sĩ số</th><th>Toán Jenny</th><th></th></tr>${rows||'<tr><td colspan="5" class="muted">Chưa có lớp.</td></tr>'}</table></div></section></div>`}
function trangLopCT(){const o=O(),l=(o.lop||[]).find(x=>x.id===qlLopId);if(!l){qlTrang='lop';return trangLop()}
 const ds=STUDENTS.filter(s=>(o.gd||{})[s[0]]===l.id).sort((a,b)=>a[1].split(' ').pop().localeCompare(b[1].split(' ').pop())||a[1].localeCompare(b[1]));
 const con=(o.gv||[]).filter(g=>!(l.gv||[]).includes(g.id));
 const gvBox=`${(l.gv||[]).map(g=>{const k=l.id+'|'+g;return`<span class="pill">${e(gvTen(g))} <button type="button" class="xbtn ${qlXoa===k?'arm':''}" aria-label="Bỏ phân công" onclick="qlBo('${l.id}','${g}')">${qlXoa===k?'Bỏ?':'×'}</button></span>`}).join(' ')||'<span class="pill qlwarn">Chưa có giáo viên</span>'}
  ${con.length?`<div class="row" style="gap:6px;margin-top:8px"><select id="pc-${l.id}" aria-label="Chọn giáo viên">${con.map(g=>`<option value="${g.id}">${e(g.ten)}</option>`).join('')}</select><button type="button" class="btn sm" onclick="qlPhan('${l.id}')">Phân công</button></div>`:''}`;
 const tj=l.tj&&l.tj.on?`<span class="pill ok">Đang mở · hạn ${e(l.tj.han)}</span> <button type="button" class="btn sm" onclick="qlTJ('${l.id}',false)">Tắt</button>`
  :`<div class="row" style="gap:6px"><input id="tjMa" placeholder="Mã gói" aria-label="Mã gói" autocomplete="off" style="width:130px"><button type="button" class="btn sm pri" onclick="qlTJ('${l.id}',true)">Gắn gói</button></div><div class="muted" style="font-size:12px;margin-top:4px">Mã thử: <b>${e(typeof DEMO_CODE!=='undefined'?DEMO_CODE:'')}</b></div>`;
 return`<div class="grid"><div class="qlhd">${back('lop','','Lớp')}<h1>🏫 Lớp ${e(l.ten)}</h1><span class="pill">Khối ${l.khoi} · ${ds.length} em</span></div>
 <div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn pri" onclick="qlMoXep('${l.id}')">+ Thêm học sinh vào lớp</button><button type="button" class="btn" onclick="qlMoHS()">+ Tạo tài khoản học sinh mới</button></div>
 <div class="grid gpair"><section class="card"><h2>Giáo viên</h2>${gvBox}</section><section class="card"><h2>Toán Jenny</h2>${tj}</section></div>
 <section class="card"><h2>Danh sách lớp (${ds.length})</h2>${ds.length?`<div class="tablewrap"><table class="qltb"><tr><th>#</th><th>Học sinh</th><th>Phụ huynh</th><th></th></tr>${ds.map(([id,n],i)=>{const p=phOf(id);return`<tr><td>${i+1}</td><td><b>${e(n)}</b><div class="muted">${e(id)}</div></td><td>${p?e(phTen(p)):'<span class="muted">—</span>'}</td><td class="qlact"><button type="button" class="btn sm" onclick="qlSua('${id}')">✎ Sửa</button><button type="button" class="btn sm" onclick="qlChuyen('${id}','')">Bỏ khỏi lớp</button>${l.tj&&l.tj.on?'':`<label class="qlnl"><input type="checkbox" ${(o.nl||{})[id]?'checked':''} onchange="qlNgoaiLe('${id}',this.checked)"> Toán Jenny riêng (học bù, chuyển lớp)</label>`}</td></tr>`}).join('')}</table></div>`:'<p class="muted">Lớp chưa có em nào. Bấm "+ Thêm học sinh vào lớp".</p>'}</section></div>`}

/* ---------- Nhật ký, Năm học ---------- */
function trangNK(){const o=O();return`<div class="grid">${head('📒','Nhật ký thao tác')}<section class="card">${(o.nk||[]).length?`<div class="log" style="max-height:70vh">${o.nk.slice(-200).reverse().map(x=>`Ngày ${x.d} · ${e(x.ai||'')} · ${e(x.t)}`).join('\n')}</div>`:'<p class="muted">Chưa có thao tác.</p>'}</section></div>`}
function trangNam(){const o=O();return`<div class="grid">${head('🎓','Năm học · Lên lớp')}<section class="card"><h2>Năm học ${e(o.nam)}</h2><p class="muted">Sắp có: Kết thúc năm học — lên lớp cả trung tâm (1A → 2A…), chọn em ở lại lớp, nghỉ học; lớp 5 thành "Đã học xong". Xu, đồ, thú cưng giữ nguyên; sao và kết quả lưu vào Hồ sơ năm học.</p></section></div>`}

/* ô ẩn để các bảng nhập 70/71 dùng lại hàm tạo cũ (58/62) */
const an=()=>`<div hidden aria-hidden="true"><input id="nhTen"><input id="nhLop"><select id="nhGt"><option value=""></option><option value="nu">Nữ</option><option value="nam">Nam</option></select><input id="nhTk"><input id="nhPw"><input id="ngTen"><input id="ngTk"><input id="ngPw"><select id="nlKhoi">${[1,2,3,4,5].map(k=>`<option value="${k}">${k}</option>`).join('')}</select><input id="nlTen"><select id="nlGV"><option value=""></option>${(O().gv||[]).map(g=>`<option value="${g.id}">x</option>`).join('')}</select></div>`;

{const _p=viewPH;viewPH=function(){if(role!=='ql')return _p.apply(this,arguments);
 try{if(typeof orgHeal==='function')orgHeal()}catch(x){}
 const T={hs:trangHS,ph:trangPH,gv:trangGV,lop:trangLop,lopct:trangLopCT,nk:trangNK,nam:trangNam}[qlTrang]||home;
 try{return T()+an()}catch(x){console.error(x);qlTrang='';return home()+an()}}}

/* tiếng Anh cho vài chữ chính */
if(typeof I18N!=='undefined')Object.assign(I18N,{'Quản lý trung tâm':'Centre admin','Học sinh':'Students','Phụ huynh':'Parents','Giáo viên':'Teachers','Lớp':'Classes','Mở ▸':'Open ▸','📒 Nhật ký thao tác':'📒 Activity log','🎓 Năm học · Lên lớp':'🎓 School year · Promotion'});

document.head.insertAdjacentHTML('beforeend',`<style>
.qltiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,44%),1fr));gap:12px}@media(max-width:520px){.qltile{min-height:140px;padding:12px}.qltile b{font-size:22px}.qln{font-size:15px}.qlic{font-size:32px}.qlw,.qlok{font-size:12px}}
.qltile{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:6px;padding:16px;background:var(--surface,#fff);color:var(--ink,#13263a);box-shadow:var(--f2),0 5px 0 0 var(--pxk,#1F2A5A);min-height:170px}
.qltile:hover{transform:translateY(-2px)}.qltile:focus-visible{outline:3px solid #F5A623;outline-offset:3px}
.qlic{font-size:40px;line-height:1}.qltile b{font-family:var(--f-display);font-size:30px;font-weight:400;line-height:1}.qln{font-size:18px;font-weight:700}
.qlw{font-size:13px;color:#C95A0E}.qlok{font-size:13px;color:#1F8A4C}.qlgo{margin-top:auto;align-self:flex-end;font-family:var(--f-display);font-size:18px}
.qlhd{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.qlhd h1{font-size:28px;margin:0}
.qlfil{gap:8px;flex-wrap:wrap}.qlfil select{min-width:0}.qlfil input{flex:1;min-width:180px}
.qltb td{vertical-align:middle}.qlact{white-space:nowrap}.qlact .btn{margin:2px 4px 2px 0}
.qlnl{display:flex;gap:6px;align-items:center;font-size:12px;margin-top:4px;font-weight:400}
.qlbar{gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}.qlbar select{max-width:160px}
.pill.qlwarn{background:#FFF1D6;color:#8A4B00}.qlnote{background:#FFF7E6;color:#6B3A00;padding:10px 12px;box-shadow:var(--f2);display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.lnk{all:unset;cursor:pointer;text-decoration:underline;font-weight:700}.pill.lnk{text-decoration:none}
.qlchips{display:flex;flex-wrap:wrap;gap:6px}
:root[data-theme="dark"] .qlnote{background:#3A2A10;color:#FFE2B0}
</style>`);
})();
