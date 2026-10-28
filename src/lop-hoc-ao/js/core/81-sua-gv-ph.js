/* 81 — Sửa thông tin giáo viên và phụ huynh (Quản lý, 24/10/2026).
   Giáo viên: Họ tên, Giới tính, SĐT, Gmail, Mật khẩu mới (máy chủ). Phụ huynh: SĐT, Gmail, Mật khẩu mới (máy chủ); con thì sửa ở nút 👪 Con.
   Tên đăng nhập không đổi ở đây. Đổi mật khẩu trên máy chủ = cấp đăng nhập mới cho cùng tên (dùng mayChu của 70). */
import { esc } from './01-tien-ich.js';
import { hd } from './02-hanh-dong.js';
import { save } from './09-du-lieu-demo.js';
import { render, toast } from './13-giao-dien-chung.js';
import { viewPH } from './20-phu-huynh.js';
import { FB, fbDayNgay, fbLoi } from './62-may-chu.js';
(function(){
if(typeof viewPH==='undefined')return;
const O=()=>S.org,e=s=>esc(String(s==null?'':s));
const cloud=()=>!!(O()&&O().cloud&&typeof CLOUD!=='undefined'&&CLOUD&&typeof FB!=='undefined'&&FB&&FB.db);
const v=i=>((document.getElementById(i)||{}).value||'').trim();
const dtC=s=>{let d=String(s||'').replace(/[^\d+]/g,'');if(/^\+?84/.test(d))d='0'+d.replace(/^\+?84/,'');return d};
const okDt=d=>!d||/^0\d{9,10}$/.test(d),okMail=m=>!m||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m);
const nk=t=>{(O().nk=O().nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t})};
const dong=()=>{const m=document.getElementById('qlsua2');if(m)m.remove()};window.qlDong2=dong;
function hop(tieuDe,than,luu){dong();const el=document.createElement('div');el.className='gdov';el.id='qlsua2';
 el.innerHTML=`<div class="gdbox qsbox qlmbox"><div class="gdhd"><b>${tieuDe}</b><button type="button" class="gdx" data-act="qlDong2">Đóng ✕</button></div><form class="qsform" data-act-submit="qlModalLuu" ${hd.argEv('submit',luu)}>${than}<div class="qsbtn"><span style="flex:1"></span><button class="btn pri" type="submit">Lưu</button></div></form></div>`;
 document.body.appendChild(el);setTimeout(()=>{const i=el.querySelector('input:not([readonly]),select');if(i)i.focus()},30)}
const mkRow=cl=>cl?`<label>Mật khẩu mới<input id="sPw" type="text" maxlength="30" placeholder="Để trống nếu không đổi" autocomplete="off"></label>`:'<p class="muted" style="margin:0;font-size:12.5px">Đổi mật khẩu chỉ làm được khi dùng máy chủ.</p>';
let busy=false;
async function mayChuDoi(tk,ten,pw){if(!cloud())return;if(typeof window.mayChu!=='function')throw new Error('Thiếu chức năng máy chủ');
 if(!ten){const q=await FB.db.collection('users').where('tk','==',tk).get();ten=(q.docs[0]&&q.docs[0].data().ten)||tk}
 await window.mayChu(tk,tk,ten,pw)}

/* ---------- Giáo viên ---------- */
window.qlSuaGV=function(id){const g=(O().gv||[]).find(x=>x.id===id);if(!g)return;const cl=cloud();
 hop('Sửa giáo viên',`<label>Họ tên<input id="sTen" maxlength="40" value="${e(g.ten)}" required></label>
 <div class="qs2"><label>Tên đăng nhập<input value="${e(g.tk||g.id)}" readonly></label><label>Giới tính<select id="sGt"><option value="">—</option><option value="nu" ${g.gt==='nu'?'selected':''}>Nữ</option><option value="nam" ${g.gt==='nam'?'selected':''}>Nam</option></select></label></div>
 <div class="qs2"><label>Điện thoại<input id="sDt" type="tel" maxlength="15" value="${e(g.dt||'')}" placeholder="0912345678"></label><label>Gmail<input id="sMail" type="email" maxlength="60" value="${e(g.mail||'')}" placeholder="ten@gmail.com"></label></div>
 ${mkRow(cl)}`,['qlLuuSuaGV',id])};
window.qlLuuSuaGV=async function(id){if(busy)return;const g=(O().gv||[]).find(x=>x.id===id);if(!g)return;
 const ten=v('sTen').replace(/\s+/g,' '),dt=dtC(v('sDt')),mail=v('sMail').toLowerCase(),pw=v('sPw'),gt=v('sGt');
 if(ten.length<3){toast('Nhập họ tên giáo viên');return}if(!okDt(dt)){toast('Số điện thoại chưa đúng');return}if(!okMail(mail)){toast('Gmail chưa đúng');return}
 if(pw&&pw.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}
 const doi=[];if(ten!==g.ten)doi.push('tên');if(dt!==(g.dt||''))doi.push('SĐT');if(mail!==(g.mail||''))doi.push('Gmail');if(gt!==(g.gt||''))doi.push('giới tính');if(pw)doi.push('mật khẩu');
 if(!doi.length){dong();toast('Không có thay đổi');return}
 busy=true;const b=document.querySelector('#qlsua2 button[type=submit]');if(b){b.disabled=true;b.textContent='Đang lưu…'}
 try{if(cloud()&&(pw||ten!==g.ten)){toast('Đang lưu lên máy chủ…');await mayChuDoi(g.tk||g.id,ten,pw)}
  g.ten=ten;g.dt=dt||undefined;g.mail=mail||undefined;g.gt=gt||undefined;nk(`Sửa giáo viên ${ten}: ${doi.join(', ')}`);save();if(cloud()){try{await fbDayNgay()}catch(x){}}
  dong();render();toast(pw?`Đã lưu. Mật khẩu mới: ${pw}`:'Đã lưu')}
 catch(x){console.error(x);toast('Chưa lưu được: '+(typeof fbLoi==='function'?fbLoi(x):(x.message||x)))}
 finally{busy=false;if(b&&document.body.contains(b)){b.disabled=false;b.textContent='Lưu'}}};

/* ---------- Phụ huynh ---------- */
window.qlSuaPH=function(tk){const o=O(),pi=(o.phInfo||{})[tk]||{},cl=cloud();
 const con=Object.entries(o.ph||{}).filter(([c,t])=>t===tk).map(([c])=>(STUDENTS.find(s=>s[0]===c)||[c,c])[1]);
 hop('Sửa tài khoản phụ huynh',`<div class="qs2"><label>Tên đăng nhập<input value="${e(tk)}" readonly></label><label>Con<input value="${e(con.join(', ')||'chưa có')}" readonly></label></div>
 <div class="qs2"><label>Điện thoại<input id="sDt" type="tel" maxlength="15" value="${e(pi.dt||'')}" placeholder="0912345678"></label><label>Gmail<input id="sMail" type="email" maxlength="60" value="${e(pi.mail||'')}" placeholder="ten@gmail.com"></label></div>
 ${mkRow(cl)}<p class="muted" style="margin:0;font-size:12.5px">Gắn thêm hoặc tách con: dùng nút 👪 Con.</p>`,['qlLuuSuaPH',tk])};
window.qlLuuSuaPH=async function(tk){if(busy)return;const o=O();o.phInfo=o.phInfo||{};const pi=o.phInfo[tk]=o.phInfo[tk]||{};
 const dt=dtC(v('sDt')),mail=v('sMail').toLowerCase(),pw=v('sPw');
 if(!okDt(dt)){toast('Số điện thoại chưa đúng');return}if(!okMail(mail)){toast('Gmail chưa đúng');return}if(pw&&pw.length<6){toast('Mật khẩu cần ít nhất 6 kí tự');return}
 const trung=typeof phTim==='function'?phTim(dt,mail,tk):{};const khac=trung.xung?trung.xung[0]:trung.tk;
 if(khac&&!confirm(`SĐT/Gmail này đang thuộc phụ huynh ${khac}. Vẫn lưu cho ${tk}?\n(Muốn gộp anh chị em thì dùng nút 👪 Con của phụ huynh ${khac}.)`))return;
 const doi=[];if(dt!==(pi.dt||''))doi.push('SĐT');if(mail!==(pi.mail||''))doi.push('Gmail');if(pw)doi.push('mật khẩu');
 if(!doi.length){dong();toast('Không có thay đổi');return}
 busy=true;const b=document.querySelector('#qlsua2 button[type=submit]');if(b){b.disabled=true;b.textContent='Đang lưu…'}
 try{if(cloud()&&pw){toast('Đang lưu lên máy chủ…');await mayChuDoi(tk,pi.ten||'',pw)}
  pi.dt=dt;pi.mail=mail;if(pw){window.qlMK=window.qlMK||{};qlMK[tk]=pw}nk(`Sửa phụ huynh ${tk}: ${doi.join(', ')}`);save();if(cloud()){try{await fbDayNgay()}catch(x){}}
  dong();render();toast(pw?`Đã lưu. Mật khẩu mới: ${pw}`:'Đã lưu')}
 catch(x){console.error(x);toast('Chưa lưu được: '+(typeof fbLoi==='function'?fbLoi(x):(x.message||x)))}
 finally{busy=false;if(b&&document.body.contains(b)){b.disabled=false;b.textContent='Lưu'}}};

document.head.insertAdjacentHTML('beforeend',`<style>
#qlsua2 input[readonly]{background:#F4F6FA!important;color:#5F6B85!important}
@media(max-width:640px){.qgv .a-act,.qph .a-act{grid-column:2;grid-row:1}}
</style>`);
})();

/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */
hd.dangKy({
  'qlDong2':function(){qlDong2()},
});
