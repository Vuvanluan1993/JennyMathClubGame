/* 78 — Xoá học sinh (Quản lý). Xoá hẳn tài khoản và dữ liệu học của em; không hoàn tác.
   Muốn giữ dữ liệu thì dùng "Nghỉ học" (Lên lớp) thay vì xoá. Phụ huynh ph.… không còn con thì xoá theo.
   P-09b (25/10/2026): ⬇ Xuất dữ liệu của em (qlXuatHS) ra file JSON trước khi xoá (LUAT §6h: xuất rồi mới xoá, có nhật ký).
   Q2 = B: không đổi trường hồ sơ. Không xoá tự động. */
import { hooks } from './00-hooks.js';
import { hd } from './02-hanh-dong.js';
import { save } from './09-du-lieu-demo.js';
import { render, toast } from './13-giao-dien-chung.js';
import { viewPH } from './20-phu-huynh.js';
import { FB, fbDayNgay, fbLoi, fbTach, fbVi } from './62-may-chu.js';
(function(){
if(typeof viewPH==='undefined')return;
const O=()=>S.org;
const cloud=()=>!!(O()&&O().cloud&&typeof CLOUD!=='undefined'&&CLOUD);
const ten=id=>(STUDENTS.find(s=>s[0]===id)||[id,id])[1];
/* máy chủ: xoá users (vai hs), hs, hsgv, login, ví vi/{tk}, danh mục hsdm/{tk}, hồ sơ hoso/{tk} (P-09b).
   Sổ xu ev/{tk}/d KHÔNG xoá được (rules chỉ-thêm, cấm cả quản lý) — chỉ có k, d, ref, t, không có PII. */
async function xoaMay(id,phBo,phCon){const db=FB.db;
 const q=await db.collection('users').where('tk','==',id).get();await Promise.all(q.docs.filter(d=>(d.data()||{}).role==='hs').map(d=>db.doc('users/'+d.id).delete()));
 await Promise.all(['hs','hsgv','login','vi','hsdm','hoso'].map(c=>db.doc(c+'/'+id).delete().catch(()=>{})));
 for(const [tk,con] of phCon){const u=await db.collection('users').where('tk','==',tk).get();
  await Promise.all(u.docs.map(d=>phBo.includes(tk)?db.doc('users/'+d.id).delete():db.doc('users/'+d.id).set({con},{merge:true})));
  if(phBo.includes(tk))await db.doc('login/'+tk).delete().catch(()=>{})}}
window.qlXoaHS=async function(ids){ids=(ids||[]).filter(id=>S.st[id]||STUDENTS.some(s=>s[0]===id));if(!ids.length)return;
 const ds=ids.map(ten);
 const hoi=ids.length===1?`Xoá hẳn học sinh ${ds[0]} (${ids[0]})?\n\nTài khoản, sao, xu, đồ, thú cưng, kết quả học của em sẽ mất và KHÔNG khôi phục được.\nNếu em chỉ tạm nghỉ, hãy dùng "Nghỉ học" để giữ dữ liệu.\nNên bấm "⬇ Xuất dữ liệu" trước khi xoá (lưu một file của em).\n\nGõ XOA để xác nhận:`
  :`Xoá hẳn ${ids.length} học sinh: ${ds.slice(0,6).join(', ')}${ids.length>6?'…':''}?\n\nToàn bộ dữ liệu của các em sẽ mất và KHÔNG khôi phục được.\nNên bấm "⬇ Xuất dữ liệu" của từng em trước khi xoá.\n\nGõ XOA để xác nhận:`;
 const t=prompt(hoi,'');if(t===null)return;if(String(t).trim().toUpperCase().replace('Á','A')!=='XOA'){toast('Chưa xoá: cần gõ XOA để xác nhận');return}
 const o=O(),phCu={};ids.forEach(id=>{const p=(o.ph||{})[id];if(p)phCu[p]=1});
 o.xoa=o.xoa||[];ids.forEach(id=>{if(!o.xoa.includes(id))o.xoa.push(id)});
 ids.forEach(id=>{[STUDENTS,o.hs||[],o.hsMoi||[]].forEach(a=>{for(let i=a.length-1;i>=0;i--)if(a[i][0]===id)a.splice(i,1)});
  delete S.st[id];['gd','nl','hoso','ph','hosoNam','nghi'].forEach(k=>{if(o[k])delete o[k][id]});
  if(window.qlChon)delete qlChon[id];if(window.qlThemChon)delete qlThemChon[id];
  (S.asg||[]).forEach(a=>{if(Array.isArray(a.hs)&&a.hs.includes(id))a.hs=a.hs.filter(x=>x!==id)})});
 if(Array.isArray(S.events))S.events=S.events.filter(e=>!(e.actor&&e.actor.account&&ids.includes(e.actor.account.name)));
 const phBo=[],phCon=[];Object.keys(phCu).forEach(tk=>{const con=Object.entries(o.ph||{}).filter(([c,t])=>t===tk).map(([c])=>c);phCon.push([tk,con]);if(!con.length&&/^ph\./.test(tk)){phBo.push(tk);if(o.phInfo)delete o.phInfo[tk]}});
 if(typeof sid!=='undefined'&&!S.st[sid]){const f=Object.keys(S.st)[0];if(f)sid=f}
 (o.nk=o.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Xoá học sinh: ${ds.join(', ')}${phBo.length?` (và tài khoản phụ huynh ${phBo.join(', ')})`:''}`});
 if(cloud()){toast('Đang xoá trên máy chủ…');try{for(const id of ids)await xoaMay(id,phBo,phCon);await fbDayNgay()}catch(x){toast('Máy chủ chưa xoá hết: '+(typeof fbLoi==='function'?fbLoi(x):x.message))}}
 save();const m=document.getElementById('qlsua');if(m)m.remove();render();toast(`Đã xoá ${ids.length} học sinh`)};

/* ⬇ Xuất dữ liệu của một em: file jenny-<tk>-<yyyy-mm-dd>.json gồm hoso (kèm hosoNam, nghi), hsdm, hs (j, ev), vi, evXu, hsgv */
const ngayFile=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`};
const phang=x=>{if(x&&typeof x.toDate==='function'){try{return x.toDate().toISOString()}catch(e){return null}}if(Array.isArray(x))return x.map(phang);
 if(x&&typeof x==='object'){const r={};Object.keys(x).forEach(k=>{r[k]=phang(x[k])});return r}return x};
async function viXuat(id,st){if(!cloud())return{coins:Math.max(0,Math.round(+(st||{}).coins||0)),items:[...((st||{}).items||[])],nguon:'máy này (không máy chủ)'};
 try{if(typeof fbVi!=='undefined'&&fbVi[id])return Object.assign({nguon:'vi/'+id},phang(fbVi[id]));const d=await FB.db.doc('vi/'+id).get();return d.exists?Object.assign({nguon:'vi/'+id},phang(d.data())):null}
 catch(x){return{loi:String(x&&x.message||x)}}}
async function evXuXuat(id){if(!cloud())return null;try{const T=firebase.firestore.Timestamp,tu=T.fromMillis(Date.now()-90*864e5);
  const q=await FB.db.collection('ev/'+id+'/d').where('t','>=',tu).orderBy('t','desc').get();return q.docs.map(d=>Object.assign({id:d.id},phang(d.data())))}
 catch(x){return{loi:String(x&&x.message||x)}}}
window.qlXuatHS=async function(id){const o=O(),st=S.st[id];if(!st&&!STUDENTS.some(s=>s[0]===id)){toast('Không tìm thấy học sinh '+id);return}
 const r=(o.hs||[]).find(x=>x[0]===id)||STUDENTS.find(x=>x[0]===id)||[id,ten(id),st?st.grade:0];
 const tt=st?(typeof fbTach==='function'?fbTach(st):{hs:st,gv:{}}):{hs:null,gv:null};
 const ev=(S.events||[]).filter(e=>e&&e.actor&&e.actor.account&&e.actor.account.name===id);
 const D={xuat:{luc:new Date().toISOString(),tk:id,ten:r[1]||id,boi:'Quản lý trung tâm',ghiChu:'Dữ liệu của một học sinh, Lớp học ảo Jenny (P-09b).'},
  hoso:Object.assign({},(o.hoso||{})[id]||{},{hosoNam:(o.hosoNam||{})[id]||[],nghi:(o.nghi||{})[id]||null}),
  hsdm:{ten:r[1]||id,khoi:+r[2]||0,lop:(o.gd||{})[id]||'',ph:(o.ph||{})[id]||''},
  hs:{j:phang(tt.hs),ev:phang(ev)},
  vi:await viXuat(id,st),
  evXu:await evXuXuat(id),
  hsgv:phang(tt.gv)};
 const ten1=`jenny-${id}-${ngayFile()}.json`,url=URL.createObjectURL(new Blob([JSON.stringify(D,null,1)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download=ten1;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);
 (o.nk=o.nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Xuất dữ liệu của ${r[1]||id} (${id}) — file ${ten1}`});save();
 if(cloud()&&typeof fbDayNgay==='function'){try{await fbDayNgay()}catch(x){}}
 toast('Đã xuất '+ten1);return D};

/* bản demo tự nạp lại học sinh mẫu — bỏ các em đã xoá */
if(typeof orgHeal==='function'){const _h=orgHeal;orgHeal=function(){const r=_h.apply(this,arguments);try{const x=(S.org&&S.org.xoa)||[];if(x.length){for(let i=STUDENTS.length-1;i>=0;i--)if(x.includes(STUDENTS[i][0]))STUDENTS.splice(i,1);x.forEach(id=>{delete S.st[id]})}}catch(e){}return r};window.orgHeal=orgHeal}
/* tạo lại tài khoản trùng tên đã xoá thì bỏ khỏi danh sách xoá */
{const _t=window.qlTaoHS;window.qlTaoHS=async function(){const truoc=new Set(Object.keys(S.st));const r=await _t.apply(this,arguments);try{const x=(S.org&&S.org.xoa)||[];Object.keys(S.st).filter(k=>!truoc.has(k)).forEach(k=>{const i=x.indexOf(k);if(i>=0)x.splice(i,1)})}catch(e){}return r}}
/* nút Xoá + ⬇ Xuất dữ liệu trong bảng Sửa học sinh */
{const _s=window.qlSua;window.qlSua=function(id){const r=_s.apply(this,arguments);try{const f=document.querySelector('#qlsua form');if(f&&!f.querySelector('.qlxoa')){
  const xuat=`<button type="button" class="btn qlxuat" title="Tải file JSON dữ liệu của em (hồ sơ, tiến độ, ví xu, nhận xét). Nên xuất trước khi xoá." data-act="qlXuatHS" ${hd.arg(String(id))}>⬇ Xuất dữ liệu</button>`;
  const bt=f.querySelector('.qsbtn');if(bt)bt.insertAdjacentHTML('afterbegin',`<button type="button" class="btn qlxbtn qlxoa" title="Xoá hẳn tài khoản. Em chỉ tạm nghỉ thì dùng Nghỉ học (Năm học · Lên lớp) để giữ dữ liệu." data-act="qlXoaHS" ${hd.arg(String(id))}>🗑 Xoá học sinh</button>${xuat}`);else f.insertAdjacentHTML('beforeend',`<div class="qsbtn"><button type="button" class="btn qlxbtn qlxoa" data-act="qlXoaHS" ${hd.arg(String(id))}>🗑 Xoá học sinh</button>${xuat}</div>`)}}catch(x){}return r}}
/* nút Xoá ở thanh chọn nhiều em */
{hooks.on('viewPH',_p=>function(){let r=_p.apply(this,arguments);if(role==='ql'&&typeof qlTrang!=='undefined'&&(qlTrang==='hs'||qlTrang==='lopct'))r=r.replace(/(<button type="button" class="btn sm" data-act="qlSua" data-arg="\[&quot;([a-z0-9._-]+)&quot;\]">✎ Sửa<\/button>)/g,(m,b,id)=>`${b}<button type="button" class="btn sm qlxbtn qlx1" title="Xoá học sinh" aria-label="Xoá học sinh" data-act="qlXoaHS" ${hd.arg(String(id))}>🗑 Xoá</button>`);
 if(role==='ql'&&typeof qlTrang!=='undefined'&&qlTrang==='hs')
  r=r.replace(`<button type="button" class="btn sm ghost" data-act="qlChon-render">Bỏ chọn</button>`,`<button type="button" class="btn sm qlxbtn" data-act="qlXoaHS-keys-filter">🗑 Xoá</button><button type="button" class="btn sm ghost" data-act="qlChon-render">Bỏ chọn</button>`);return r})}
document.head.insertAdjacentHTML('beforeend',`<style>
.qlx1{margin-left:6px}
.gdbox{max-height:calc(100vh - 20px)!important;overflow:auto}.gdbox .gdhd{position:sticky;top:0;z-index:3}.gdbox .qsbtn{position:sticky;bottom:0;z-index:2;background:#fff;margin:8px -14px -14px;padding:10px 14px;border-top:1px solid #E8EAED}
body.px .btn.qlxbtn,.btn.qlxbtn{color:#B3261E!important;background:#fff!important}
#qlsua .qsbtn{flex-wrap:wrap}#qlsua .qsbtn .btn{white-space:nowrap}
@media(max-width:440px){#qlsua .qsbtn .qlxoa,#qlsua .qsbtn .qlxuat{padding-left:10px!important;padding-right:10px!important;font-size:14px!important}}
</style>`);
})();

/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */
hd.dangKy({
  'qlXoaHS-keys-filter':function(){qlXoaHS(Object.keys(qlChon).filter(k=>qlChon[k]))},
});
