/* 73 — Trang Quản lý gọn: trang chính 4 nút lớn (Học sinh · Phụ huynh · Giáo viên · Lớp) + trang con.
   Dùng lại các bảng nhập ở 70/71 (qlMoHS, qlMoGV, qlMoLop, qlMoXep, qlMoPH, qlSua) và các hàm ở 58 (qlChuyen, qlPhan, qlBo, qlTJ, qlNgoaiLe). */
/* em chưa xếp lớp có khối 0: tạo dữ liệu học theo khối 1 cho tới khi được xếp lớp (tránh lỗi blankP1(0) làm treo đăng nhập máy chủ) */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { hd } from './02-hanh-dong.js';
import { DEMO_CODE, newStudent, save } from './09-du-lieu-demo.js';
import { render, toast } from './13-giao-dien-chung.js';
import { viewPH } from './20-phu-huynh.js';
import { I18N } from './47-ngon-ngu-vi-en.js';
import { fbDayNgay, fbTaiKhoanBox } from './62-may-chu.js';
if(typeof newStudent==='function'){hooks.on('newStudent',_ns=>function(n,g){return _ns(n,(+g>=1&&+g<=9)?+g:1)})}
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
const NGHI=id=>((O().nghi||{})[id]);
const lopSel=(id,l)=>{const ng=NGHI(id);if(ng&&!l)return`<span class="pill qlwarn">${ng.ly==='xong'?'🎓 Đã học xong':'⏸ Nghỉ học'}</span> <button type="button" class="btn sm" data-act="qlMoLai" ${hd.arg(String(id))}>Mở lại</button>`;const L=LOP().filter(x=>!l||x.khoi===l.khoi);return`<select class="qllop ${l?'':'qlchua'}" aria-label="Lớp của em" data-act-change="qlVaoLop" ${hd.argEv('change',String(id))}><option value="">${l?'— Bỏ khỏi lớp':'⚠ Chọn lớp…'}</option>${L.map(x=>`<option value="${x.id}" ${l&&l.id===x.id?'selected':''}>Lớp ${e(x.ten)}${l?'':' (khối '+x.khoi+')'}</option>`).join('')}</select>`};
window.qlMoLai=function(id){const o=O();if(!o.nghi||!o.nghi[id])return;delete o.nghi[id];(o.nk=o.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Mở lại tài khoản ${(S.st[id]||{}).name||id}`});save();if(o.cloud&&typeof fbDayNgay==='function'){try{fbDayNgay()}catch(x){}}render();toast('Đã mở lại. Hãy xếp lớp cho em.')};
window.qlVaoLop=function(id,lid){const cu=(O().gd||{})[id]||'';if(cu===lid)return;const n=(S.st[id]||{}).name||id;
 if(!lid&&!confirm(`Bỏ ${n} khỏi lớp? Em sẽ chưa đăng nhập được cho đến khi được xếp lớp mới.`)){render();return}
 window.qlChuyen(id,lid);if(O().cloud&&typeof fbDayNgay==='function'){try{fbDayNgay()}catch(x){}}};
window.qlThemTim='';window.qlThemChon={};
window.qlThemVao=function(lid){const ids=Object.keys(qlThemChon).filter(k=>qlThemChon[k]);if(!ids.length){toast('Chưa chọn em nào');return}
 ids.forEach(id=>{try{window.qlChuyen(id,lid)}catch(x){}});qlThemChon={};save();if(O().cloud&&typeof fbDayNgay==='function'){try{fbDayNgay()}catch(x){}}render();toast(`Đã đưa ${ids.length} em vào lớp ${lid}`)};
window.qlDi=(t,l)=>{qlTrang=t||'';qlLopId=l||'';qlTrangSo=0;qlChon={};qlThemTim='';qlThemChon={};render();scrollTo(0,0)};
const back=(t,l,lab)=>`<button type="button" class="btn sm ghost" data-act="qlDi" ${hd.arg(String(t),String(l||''))}>← ${lab}</button>`;
const head=(ic,t,extra)=>`<div class="qlhd">${back('','','Quản lý')}<h1>${ic} ${t}</h1>${extra||''}</div>`;

/* ---------- số liệu ---------- */
function so(){const o=O(),H=STUDENTS,gv=o.gv||[],L=o.lop||[];
 const phTk=new Set(Object.values(o.ph||{}));
 return{hs:H.length,chuaXep:H.filter(s=>!(o.gd||{})[s[0]]&&!NGHI(s[0])).length,ph:phTk.size,chuaPH:H.filter(s=>!phOf(s[0])).length,
  gv:gv.length,gvTrong:gv.filter(g=>!L.some(l=>(l.gv||[]).includes(g.id))).length,lop:L.length,lopTrong:L.filter(l=>!(l.gv||[]).length).length}}

/* ---------- trang chính ---------- */
function home(){const o=O(),n=so();
 const tile=(t,ic,ten,big,warn)=>`<button type="button" class="qltile" data-act="qlDi-2" ${hd.arg(String(t))}><span class="qlic">${ic}</span><b>${ten}</b><span class="qln">${big}</span>${warn?`<span class="qlw">⚠ ${warn}</span>`:'<span class="qlok">✓ Đủ</span>'}<span class="qlgo">Mở ▸</span></button>`;
 return`<div class="grid"><div><h1 style="font-size:28px">Quản lý trung tâm</h1><div class="muted">${e(o.ten)} · năm học ${e(o.nam)}</div></div>
 <div class="qltiles">
  ${tile('hs','🎒','Học sinh',n.hs+' em',n.chuaXep?n.chuaXep+' em chưa xếp lớp':'')}
  ${tile('ph','👪','Phụ huynh',n.ph+' tài khoản',n.chuaPH?n.chuaPH+' em chưa có phụ huynh':'')}
  ${tile('gv','👩‍🏫','Giáo viên',n.gv+' người',n.gvTrong?n.gvTrong+' người chưa có lớp':'')}
  ${tile('lop','🏫','Lớp',n.lop+' lớp',n.lopTrong?n.lopTrong+' lớp chưa có giáo viên':'')}
 </div>
 <div class="row" style="gap:10px;flex-wrap:wrap"><button type="button" class="btn" data-act="qlDi-nk">📒 Nhật ký thao tác</button><button type="button" class="btn" data-act="qlDi-nam">🎓 Năm học · Lên lớp</button></div></div>`}

/* ---------- Học sinh ---------- */
const ckAll=ids=>`<input type="checkbox" aria-label="Chọn cả trang" ${ids.length&&ids.every(i=>qlChon[i])?'checked':''} data-act-change="qlChon-ca-trang" ${hd.argEv('change',ids)}>`;
function trangHS(){const o=O(),L=LOP(),q=bo(qlHsTim);
 const ds0=STUDENTS.filter(([id,n,g])=>{const l=lopOf(id);
  if(qlHsLop==='-'&&(l||NGHI(id)))return false;if(qlHsLop==='x'&&!NGHI(id))return false;if(qlHsLop&&qlHsLop!=='-'&&qlHsLop!=='x'&&(!l||l.id!==qlHsLop))return false;
  if(qlHsKhoi&&g!==qlHsKhoi)return false;
  if(q){const h=hs(id),p=phOf(id);if(!(bo(n).includes(q)||id.includes(q)||(h.dt||'').includes(q)||(p&&bo(phTen(p)).includes(q))))return false}
  return true}).sort((a,b)=>(lopOf(a[0])?1:0)-(lopOf(b[0])?1:0)||a[1].split(' ').pop().localeCompare(b[1].split(' ').pop())||a[1].localeCompare(b[1]));
 const per=20,trang=Math.max(1,Math.ceil(ds0.length/per));if(qlTrangSo>=trang)qlTrangSo=trang-1;const ds=ds0.slice(qlTrangSo*per,qlTrangSo*per+per);
 const chon=Object.keys(qlChon).filter(k=>qlChon[k]),nChua=STUDENTS.filter(s=>!lopOf(s[0])&&!NGHI(s[0])).length;
 const rows=ds.map(([id,n])=>{const l=lopOf(id),h=hs(id),p=phOf(id);
  const ns=[h.gt==='nam'?'Nam':h.gt==='nu'?'Nữ':'',h.ng&&h.th?`${h.ng}/${h.th}${h.nam?'/'+h.nam:''}`:(h.nam||'')].filter(Boolean).join(' · ');
  return`<div class="qlr qhs">
  <div class="a-ten"><b>${e(n)}</b><div class="muted">${e(id)}${ns?' · '+e(ns):''}</div></div>
  <div class="a-lop">${lopSel(id,l)}</div>
  <div class="a-ph"><span class="mlab">Phụ huynh: </span>${p?e(phTen(p)):(h.dt?`<span class="muted">${e(h.dt)}</span>`:'<span class="muted">—</span>')}</div>
  <div class="a-act"><button type="button" class="btn sm" data-act="qlSua" ${hd.arg(String(id))}>✎ Sửa</button></div></div>`}).join('');
 const lopOpt=L.map(l=>`<option value="${l.id}" ${qlHsLop===l.id?'selected':''}>Lớp ${e(l.ten)}</option>`).join('');
 return`<div class="grid">${head('🎒','Học sinh',`<span class="pill">${STUDENTS.length} em</span>`)}
 <div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn pri" data-act="qlMoHS">+ Thêm học sinh</button></div>
 ${nChua?`<div class="qlnote"><span>⚠ ${nChua} em chưa xếp lớp — các em <b>chưa đăng nhập được</b>.</span><button type="button" class="btn sm" data-act="qlHsLop---qlTrangSo-render">Xem các em này</button></div>`:''}
 <section class="card"><div class="qlfil">
  <select aria-label="Lọc theo khối" data-act-change="qlHsKhoi-qlTrangSo-render"><option value="0">Tất cả khối</option>${[1,2,3,4,5].map(k=>`<option value="${k}" ${qlHsKhoi===k?'selected':''}>Khối ${k}</option>`).join('')}</select>
  <select aria-label="Lọc theo lớp" data-act-change="qlHsLop-qlTrangSo-render"><option value="">Tất cả lớp</option><option value="-" ${qlHsLop==='-'?'selected':''}>Chưa xếp lớp (${nChua})</option>${Object.keys(O().nghi||{}).length?`<option value="x" ${qlHsLop==='x'?'selected':''}>Nghỉ học / Đã học xong (${Object.keys(O().nghi).length})</option>`:''}${lopOpt}</select>
  <input type="search" placeholder="Tìm tên, tên đăng nhập, SĐT phụ huynh" aria-label="Tìm học sinh" value="${e(qlHsTim)}" data-act-keydown="Enter-qlHsTim-trim-qlTrangSo" data-act-change="qlHsTim-trim-qlTrangSo-render">
 </div>
 <div class="qlli"><div class="qlr qhs qlrh"><div class="a-ten">Học sinh</div><div class="a-lop">Lớp</div><div class="a-ph">Phụ huynh</div><div class="a-act"></div></div>
 
 ${rows||'<p class="muted">Không có em nào.</p>'}</div>
 ${chon.length?`<div class="qlbar"><b>Đã chọn ${chon.length} em:</b><select id="qlChLop" aria-label="Chuyển đến lớp">${L.map(l=>`<option value="${l.id}">Lớp ${e(l.ten)}</option>`).join('')}</select><button type="button" class="btn sm pri" data-act="qlChuyenNhieu-getElementById-qlChLop">Chuyển vào lớp</button><button type="button" class="btn sm" data-act="qlChuyenNhieu">Bỏ khỏi lớp</button><button type="button" class="btn sm ghost" data-act="qlChon-render">Bỏ chọn</button></div>`:''}
 <div class="qlpg"><span class="muted">${ds0.length} em</span>${trang>1?`<span class="grow"></span><button type="button" class="btn sm" ${qlTrangSo?'':'disabled'} data-act="qlTrangSo-render">◂</button><span>Trang ${qlTrangSo+1}/${trang}</span><button type="button" class="btn sm" ${qlTrangSo<trang-1?'':'disabled'} data-act="qlTrangSo-render-2">▸</button>`:''}</div>
 </section></div>`}
window.qlChuyenNhieu=function(lid){const ids=Object.keys(qlChon).filter(k=>qlChon[k]);if(!ids.length)return;
 const l=lid&&(O().lop||[]).find(x=>x.id===lid);
 if(l){const khac=ids.filter(id=>{const c=lopOf(id);return c&&c.khoi!==l.khoi});if(khac.length&&!confirm(`${khac.length} em đang ở lớp khác khối. Vẫn chuyển vào lớp ${l.ten}?`))return}
 if(!lid&&!confirm(`Bỏ ${ids.length} em khỏi lớp? Các em sẽ chưa đăng nhập được cho đến khi được xếp lớp mới.`))return;
 ids.forEach(id=>{if((O().gd||{})[id]===(lid||undefined))return;try{window.qlChuyen(id,lid)}catch(x){}});
 qlChon={};save();if(typeof fbDayNgay==='function'&&O().cloud){try{fbDayNgay()}catch(x){}}render();toast(lid?`Đã chuyển ${ids.length} em vào lớp ${l?l.ten:lid}`:`Đã bỏ ${ids.length} em khỏi lớp`)};

/* ---------- Phụ huynh ---------- */
function trangPH(){const o=O(),m={};Object.entries(o.ph||{}).forEach(([c,tk])=>{(m[tk]=m[tk]||[]).push(c)});const tks=Object.keys(m).sort((a,b)=>phTen(a).localeCompare(phTen(b))),info=o.phInfo||{};
 const ten=id=>(STUDENTS.find(s=>s[0]===id)||[id,id])[1];
 const chua=STUDENTS.filter(s=>!phOf(s[0]));
 return`<div class="grid">${head('👪','Phụ huynh',`<span class="pill">${tks.length} tài khoản</span>`)}
 <div class="row" style="gap:8px" id="phNut"></div>
 <p class="muted" style="margin:0">Tài khoản phụ huynh tự tạo khi thêm học sinh; anh chị em cùng SĐT/Gmail dùng chung 1 tài khoản. Bấm ✎ Sửa để sửa SĐT, Gmail, mật khẩu; 👪 Con để gắn thêm hoặc tách con.</p>
 <section class="card"><h2>Tài khoản phụ huynh</h2>${tks.length?`<div class="qlli">${tks.map(t=>`<div class="qlr qph"><div class="a-ten"><b>${e(phTen(t))}</b><div class="muted">${e(t)}${(info[t]||{}).dt?' · '+e(info[t].dt):''}</div></div><div class="a-con">${m[t].map(c=>`<span class="pill">${e(ten(c))}</span>`).join(' ')}</div><div class="a-act"><button type="button" class="btn sm" data-act="qlSuaPH" ${hd.arg(String(t))}>✎ Sửa</button><button type="button" class="btn sm" data-act="qlMoPH-3" ${hd.arg(String(t))}>👪 Con</button></div></div>`).join('')}</div>`:'<p class="muted">Chưa có tài khoản phụ huynh.</p>'}</section>
 <section class="card"><h2>Em chưa có phụ huynh (${chua.length})</h2>${chua.length?`<div class="qlchips">${chua.slice(0,60).map(s=>`<span class="pill">${e(s[1])}</span>`).join(' ')}${chua.length>60?` <span class="muted">… và ${chua.length-60} em</span>`:''}</div>`:'<p class="muted">Em nào cũng đã có phụ huynh.</p>'}</section>
 ${o.cloud&&typeof fbTaiKhoanBox==='function'?fbTaiKhoanBox():''}</div>`}

/* ---------- Giáo viên ---------- */
function trangGV(){const o=O(),L=o.lop||[];
 const rows=(o.gv||[]).map(g=>{const ls=L.filter(l=>(l.gv||[]).includes(g.id));return`<div class="qlr qgv"><div class="a-ten"><b>${e(g.ten)}</b><div class="muted">${e(g.tk||g.id)}${g.dt?' · '+e(g.dt):''}</div></div><div class="a-con">${ls.length?ls.map(l=>`<button type="button" class="pill lnk" data-act="qlDi-lopct" ${hd.arg(String(l.id))}>Lớp ${e(l.ten)}</button>`).join(' '):'<span class="pill qlwarn">Chưa có lớp</span>'}</div><div class="a-act"><button type="button" class="btn sm" data-act="qlSuaGV" ${hd.arg(String(g.id))}>✎ Sửa</button></div></div>`}).join('');
 return`<div class="grid">${head('👩‍🏫','Giáo viên',`<span class="pill">${(o.gv||[]).length} người</span>`)}
 <div class="row" style="gap:8px"><button type="button" class="btn pri" data-act="qlMoGV">+ Thêm giáo viên</button></div>
 <p class="muted" style="margin:0">Phân công dạy lớp: vào trang Lớp › chọn lớp › Phân công giáo viên.</p>
 <section class="card"><div class="qlli"><div class="qlr qgv qlrh"><div class="a-ten">Giáo viên</div><div class="a-con">Lớp đang dạy</div><div class="a-act"></div></div>${rows||'<p class="muted">Chưa có giáo viên.</p>'}</div></section></div>`}

/* ---------- Lớp ---------- */
function trangLop(){const L=LOP();
 const rows=L.map(l=>{const n=STUDENTS.filter(s=>(O().gd||{})[s[0]]===l.id).length;return`<div class="qlr qlp"><div class="a-ten"><b>Lớp ${e(l.ten)}</b><div class="muted">Khối ${l.khoi} · ${n} em</div></div><div class="a-con">${(l.gv||[]).length?l.gv.map(g=>e(gvTen(g))).join(', '):'<span class="pill qlwarn">Chưa có giáo viên</span>'}</div><div class="a-tj">${l.tj&&l.tj.on?`<span class="pill ok">Toán Jenny · hạn ${e(l.tj.han)}</span>`:'<span class="muted">Chưa có gói</span>'}</div><div class="a-act"><button type="button" class="btn sm" data-act="qlDi-lopct" ${hd.arg(String(l.id))}>Mở ▸</button></div></div>`}).join('');
 return`<div class="grid">${head('🏫','Lớp',`<span class="pill">${L.length} lớp</span>`)}
 <div class="row" style="gap:8px"><button type="button" class="btn pri" data-act="qlMoLop">+ Thêm lớp</button></div>
 <section class="card"><div class="qlli"><div class="qlr qlp qlrh"><div class="a-ten">Lớp</div><div class="a-con">Giáo viên</div><div class="a-tj">Toán Jenny</div><div class="a-act"></div></div>${rows||'<p class="muted">Chưa có lớp.</p>'}</div></section></div>`}
function trangLopCT(){const o=O(),l=(o.lop||[]).find(x=>x.id===qlLopId);if(!l){qlTrang='lop';return trangLop()}
 const ds=STUDENTS.filter(s=>(o.gd||{})[s[0]]===l.id).sort((a,b)=>a[1].split(' ').pop().localeCompare(b[1].split(' ').pop())||a[1].localeCompare(b[1]));
 const con=(o.gv||[]).filter(g=>!(l.gv||[]).includes(g.id));
 const gvBox=`<div class="qlchips">${(l.gv||[]).map(g=>{const k=l.id+'|'+g;return`<span class="pill">${e(gvTen(g))} <button type="button" class="xbtn ${qlXoa===k?'arm':''}" aria-label="Bỏ phân công" data-act="qlBo" ${hd.arg(String(l.id),String(g))}>${qlXoa===k?'Bỏ?':'×'}</button></span>`}).join('')||'<span class="pill qlwarn">Chưa có giáo viên</span>'}</div>
  ${con.length?`<div class="qlin"><select id="pc-${l.id}" aria-label="Chọn giáo viên">${con.map(g=>`<option value="${g.id}">${e(g.ten)}</option>`).join('')}</select><button type="button" class="btn sm" data-act="qlPhan" ${hd.arg(String(l.id))}>Phân công</button></div>`:''}`;
 const tj=l.tj&&l.tj.on?`<div class="qlin"><span class="pill ok">Đang mở · hạn ${e(l.tj.han)}</span><button type="button" class="btn sm" data-act="qlTJ" ${hd.arg(String(l.id))}>Tắt</button></div>`
  :`<div class="qlin"><input id="tjMa" placeholder="Mã gói" aria-label="Mã gói" autocomplete="off"><button type="button" class="btn sm pri" data-act="qlTJ-2" ${hd.arg(String(l.id))}>Gắn gói</button></div><div class="muted" style="font-size:12px;margin-top:6px">Mã thử: <b>${e(typeof DEMO_CODE!=='undefined'?DEMO_CODE:'')}</b></div>`;
 const rows=ds.map(([id,n],i)=>{const p=phOf(id);return`<div class="qlr qds"><span class="a-ck">${i+1}</span><div class="a-ten"><b>${e(n)}</b><div class="muted">${e(id)}${p?' · PH: '+e(phTen(p)):''}</div>${l.tj&&l.tj.on?'':`<label class="qlnl"><input type="checkbox" ${(o.nl||{})[id]?'checked':''} data-act-change="qlNgoaiLe" ${hd.argEv('change',String(id))}> Toán Jenny riêng</label>`}</div><div class="a-act"><button type="button" class="btn sm" data-act="qlSua" ${hd.arg(String(id))}>✎ Sửa</button><button type="button" class="btn sm" data-act="qlVaoLop-2" ${hd.arg(String(id))}>Bỏ khỏi lớp</button></div></div>`}).join('');
 return`<div class="grid"><div class="qlhd">${back('lop','','Lớp')}<h1>🏫 Lớp ${e(l.ten)}</h1><span class="pill">Khối ${l.khoi} · ${ds.length} em</span></div>
 <div class="grid gpair"><section class="card"><h2>Giáo viên</h2>${gvBox}</section><section class="card"><h2>Toán Jenny</h2>${tj}</section></div>
 ${themBox(l)}
 <section class="card"><h2>Danh sách lớp (${ds.length})</h2>${ds.length?`<div class="qlli">${rows}</div>`:'<p class="muted">Lớp chưa có em nào.</p>'}</section></div>`}

/* Thêm học sinh vào lớp: gợi ý vài em chưa xếp lớp; gõ tên để tìm thêm */
function themBox(l){const o=O(),q=bo(qlThemTim),GOI=5,TIM=15;
 const chua=STUDENTS.filter(s=>!(o.gd||{})[s[0]]&&!NGHI(s[0]));
 const by=(a,b)=>a[1].split(' ').pop().localeCompare(b[1].split(' ').pop())||a[1].localeCompare(b[1]);
 let ds;
 if(q)ds=STUDENTS.filter(([id,n,g])=>{const c=(o.gd||{})[id];if(c===l.id||NGHI(id))return false;if(c&&g!==l.khoi)return false;return bo(n).includes(q)||id.includes(q)}).sort((a,b)=>((o.gd||{})[a[0]]?1:0)-((o.gd||{})[b[0]]?1:0)||by(a,b));
 else ds=[...chua].sort((a,b)=>(qlThemChon[b[0]]?1:0)-(qlThemChon[a[0]]?1:0)||by(a,b));
 const max=q?TIM:GOI,show=ds.slice(0,max),n=Object.keys(qlThemChon).filter(k=>qlThemChon[k]).length;
 const list=show.map(([id,nm])=>{const c=(o.gd||{})[id],cl=c&&(o.lop||[]).find(x=>x.id===c);return`<label class="qlckr"><input type="checkbox" ${qlThemChon[id]?'checked':''} data-act-change="render-2" ${hd.argEv('change',String(id))}><span><b>${e(nm)}</b> <small>${e(id)} · ${cl?'đang ở lớp '+e(cl.ten):'<span class="qlw">chưa xếp lớp</span>'}</small></span></label>`}).join('');
 const con=ds.length-show.length;
 return`<section class="card" id="qlThem"><h2>Thêm học sinh vào lớp ${e(l.ten)}</h2>
 <input id="qlThemQ" type="search" placeholder="Gõ tên hoặc tên đăng nhập để tìm" aria-label="Tìm học sinh để thêm" value="${e(qlThemTim)}" data-act-input="clearTimeout-_qlT-setTimeout-qlThemTim">
 <p class="muted qlhint">${q?`Kết quả tìm: em chưa xếp lớp và em khối ${l.khoi} ở lớp khác.`:(chua.length?`Gợi ý ${show.length} em chưa xếp lớp${con?` (còn ${con} em — gõ tên để tìm)`:''}.`:'Không còn em nào chưa xếp lớp. Gõ tên để chuyển em từ lớp khác.')}</p>
 ${show.length?`<div class="qlck">${list}</div>`:(q?'<p class="muted">Không tìm thấy em nào.</p>':'')}
 ${q&&con?`<p class="muted qlhint">… còn ${con} em, gõ thêm chữ để thu hẹp.</p>`:''}
 <div class="qlin" style="margin-top:10px"><button type="button" class="btn pri" ${n?'':'disabled'} data-act="qlThemVao" ${hd.arg(String(l.id))}>${n?`Đưa ${n} em vào lớp`:'Đưa vào lớp'}</button></div>
 <div class="qlin qlnew"><span class="muted">Chưa có tài khoản?</span><button type="button" class="btn sm" data-act="qlMoHS">+ Tạo tài khoản học sinh</button></div></section>`}
/* ---------- Nhật ký, Năm học ---------- */
function trangNK(){const o=O();return`<div class="grid">${head('📒','Nhật ký thao tác')}<section class="card">${(o.nk||[]).length?`<div class="log" style="max-height:70vh">${o.nk.slice(-200).reverse().map(x=>`Ngày ${x.d} · ${e(x.ai||'')} · ${e(x.t)}`).join('\n')}</div>`:'<p class="muted">Chưa có thao tác.</p>'}</section></div>`}
function trangNam(){const o=O();return`<div class="grid">${head('🎓','Năm học · Lên lớp')}<section class="card"><h2>Năm học ${e(o.nam)}</h2><p class="muted">Sắp có: Kết thúc năm học — lên lớp cả trung tâm (1A → 2A…), chọn em ở lại lớp, nghỉ học; lớp 5 thành "Đã học xong". Xu, đồ, thú cưng giữ nguyên; sao và kết quả lưu vào Hồ sơ năm học.</p></section></div>`}

/* ô ẩn để các bảng nhập 70/71 dùng lại hàm tạo cũ (58/62) */
const an=()=>`<div hidden aria-hidden="true"><input id="nhTen"><input id="nhLop"><select id="nhGt"><option value=""></option><option value="nu">Nữ</option><option value="nam">Nam</option></select><input id="nhTk"><input id="nhPw"><input id="ngTen"><input id="ngTk"><input id="ngPw"><select id="nlKhoi">${[1,2,3,4,5].map(k=>`<option value="${k}">${k}</option>`).join('')}</select><input id="nlTen"><select id="nlGV"><option value=""></option>${(O().gv||[]).map(g=>`<option value="${g.id}">x</option>`).join('')}</select></div>`;

{hooks.on('viewPH',_p=>function(){if(role!=='ql')return _p.apply(this,arguments);
 try{if(typeof orgHeal==='function')orgHeal()}catch(x){}
 const T={hs:trangHS,ph:trangPH,gv:trangGV,lop:trangLop,lopct:trangLopCT,nk:trangNK,nam:trangNam}[qlTrang]||home;
 try{return T()+an()}catch(x){console.error(x);qlTrang='';return home()+an()}})}

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
.qllop{max-width:170px}.qllop.qlchua{background:#FFF1D6;color:#8A4B00;font-weight:700}
#whoBox{min-width:0;max-width:100%}#who{min-width:0;max-width:100%}
#qlThem h2,.card h2{margin-bottom:10px}.card .qlchips+.qlin{margin-top:10px}
.qlli{display:flex;flex-direction:column;margin-top:10px}
.qlr{display:grid;gap:8px 12px;align-items:center;padding:10px 2px;border-bottom:1px solid rgba(120,130,170,.28)}
.qlr:last-child{border-bottom:0}.qlrh{font-size:12px;font-weight:700;text-transform:uppercase;color:#5A6488;padding-top:0}
.qlr .a-act{display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap}.qlr .a-ten{min-width:0;overflow-wrap:anywhere}
.qhs{grid-template-columns:minmax(0,2fr) minmax(130px,1.2fr) minmax(0,1.4fr) auto}
.qph{grid-template-columns:minmax(0,1.3fr) minmax(0,2fr) auto}.qgv{grid-template-columns:minmax(0,1fr) minmax(0,2fr) auto}
.qlp{grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) minmax(0,1.3fr) auto}.qds{grid-template-columns:28px minmax(0,1fr) auto}
.qlr .a-con{display:flex;flex-wrap:wrap;gap:6px}.qlr select{width:100%;max-width:200px}
.mlab,.qlmall{display:none}
.qlfil{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,2.2fr);gap:8px}
.qlfil select,.qlfil input{width:100%;box-sizing:border-box;min-width:0;height:42px}
.qlbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px;padding:10px;background:rgba(245,166,35,.12)}.qlbar select{max-width:160px}
.qlpg{display:flex;gap:8px;align-items:center;margin-top:10px}
.qlin{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.qlin input,.qlin select{flex:1 1 140px;min-width:0;max-width:220px;height:38px;box-sizing:border-box}
#qlThem input[type=search]{width:100%;box-sizing:border-box;height:42px}.qlhint{margin:8px 0 0;font-size:13px}
#qlThem .qlck{margin-top:8px;max-height:none}#qlThem .qlckr{display:flex;align-items:center;gap:10px!important;padding:6px 4px}#qlThem .qlckr input{flex:0 0 18px;margin:0 2px 0 0}.qlckr span{min-width:0;overflow-wrap:anywhere}
.qlnew{margin-top:12px;padding-top:10px;border-top:1px solid rgba(120,130,170,.28)}.qlnote span{flex:1 1 220px}
@media(max-width:640px){
 .qlrh{display:none}.mlab{display:inline;color:#5A6488;font-size:12px}
 .qlmall{display:flex;gap:8px;align-items:center;font-size:13px;padding:4px 2px 6px;border-bottom:1px solid rgba(120,130,170,.28)}
 .qhs{grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"ten act" "lop lop" "ph ph"}
 .qhs .a-ck{grid-area:ck;align-self:start;padding-top:2px}.qhs .a-ten{grid-area:ten}.qhs .a-act{grid-area:act;align-self:start}.qhs .a-lop{grid-area:lop}.qhs .a-ph{grid-area:ph;font-size:13px}
 .qhs select{max-width:none}
 .qph,.qgv{grid-template-columns:minmax(0,1fr) auto}.qph .a-con,.qgv .a-con{grid-column:1/-1}
 .qlp{grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"ten act" "con con" "tj tj"}.qlp .a-ten{grid-area:ten}.qlp .a-act{grid-area:act}.qlp .a-con{grid-area:con}.qlp .a-tj{grid-area:tj}
 .qds{grid-template-columns:24px minmax(0,1fr);grid-template-areas:"ck ten" ". act"}.qds .a-ck{grid-area:ck;align-self:start}.qds .a-ten{grid-area:ten}.qds .a-act{grid-area:act;justify-content:flex-start}
 .qlfil{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.qlfil input{grid-column:1/-1}
}

.qlchips{display:flex;flex-wrap:wrap;gap:6px}

@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .qllop.qlchua{background:#3A2A10;color:#FFE2B0}:root:not([data-theme="light"]) .qlnote{background:#3A2A10;color:#FFE2B0}:root:not([data-theme="light"]) .qlrh,:root:not([data-theme="light"]) .mlab{color:#AEB7D6}:root:not([data-theme="light"]) .pill.qlwarn{background:#3A2A10;color:#FFE2B0}:root:not([data-theme="light"]) .qlbar{background:rgba(245,166,35,.18)}}:root[data-theme="dark"] .qllop.qlchua{background:#3A2A10;color:#FFE2B0}:root[data-theme="dark"] .qlnote{background:#3A2A10;color:#FFE2B0}:root[data-theme="dark"] .qlrh,:root[data-theme="dark"] .mlab{color:#AEB7D6}:root[data-theme="dark"] .pill.qlwarn{background:#3A2A10;color:#FFE2B0}:root[data-theme="dark"] .qlbar{background:rgba(245,166,35,.18)}
</style>`);
})();

/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */
hd.dangKy({
  'qlChon-ca-trang':function(event,a){for(const i of a[0])qlChon[i]=this.checked;render()},
  'qlMoLai':function(event,a){qlMoLai(a[0])},
  'qlVaoLop':function(event,a){qlVaoLop(a[0],this.value)},
  'qlDi':function(event,a){qlDi(a[0],a[1])},
  'qlDi-2':function(event,a){qlDi(a[0])},
  'qlDi-nk':function(){qlDi('nk')},
  'qlDi-nam':function(){qlDi('nam')},
  'qlHsLop---qlTrangSo-render':function(){qlHsLop='-';qlTrangSo=0;render()},
  'qlHsKhoi-qlTrangSo-render':function(){qlHsKhoi=+this.value;qlTrangSo=0;render()},
  'qlHsLop-qlTrangSo-render':function(){qlHsLop=this.value;qlTrangSo=0;render()},
  'Enter-qlHsTim-trim-qlTrangSo':function(event){if(event.key==='Enter'){qlHsTim=this.value.trim();qlTrangSo=0;render()}},
  'qlHsTim-trim-qlTrangSo-render':function(){qlHsTim=this.value.trim();qlTrangSo=0;render()},
  'qlChuyenNhieu-getElementById-qlChLop':function(){qlChuyenNhieu(document.getElementById('qlChLop').value)},
  'qlChuyenNhieu':function(){qlChuyenNhieu('')},
  'qlChon-render':function(){qlChon={};render()},
  'qlTrangSo-render':function(){qlTrangSo--;render()},
  'qlTrangSo-render-2':function(){qlTrangSo++;render()},
  'qlSuaPH':function(event,a){qlSuaPH(a[0])},
  'qlDi-lopct':function(event,a){qlDi('lopct',a[0])},
  'qlSuaGV':function(event,a){qlSuaGV(a[0])},
  'qlTJ-2':function(event,a){qlTJ(a[0],true)},
  'qlVaoLop-2':function(event,a){qlVaoLop(a[0],'')},
  'render-2':function(event,a){qlThemChon[a[0]]=this.checked;render()},
  'clearTimeout-_qlT-setTimeout-qlThemTim':function(){clearTimeout(window._qlT);window._qlT=setTimeout(()=>{qlThemTim=this.value.trim();render();const x=document.getElementById('qlThemQ');if(x){x.focus();x.setSelectionRange(x.value.length,x.value.length)}},300)},
  'qlThemVao':function(event,a){qlThemVao(a[0])},
});
