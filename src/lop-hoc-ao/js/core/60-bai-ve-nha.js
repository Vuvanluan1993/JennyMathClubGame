/* ===================== Bài về nhà bắt buộc (luật chốt 22/10/2026, đưa vào bản GitHub 23/10) =====================
   - Bài cô giao (a.bat=1) phải làm xong trước mọi việc khác; app học sinh chỉ còn màn "Bài về nhà" và Đăng xuất.
   - Hai loại: Phiếu (theo dạng yếu a.kinds, hoặc theo tiết) và Luyện lỗi có mục tiêu (a.loai='loi', a.keys = lỗi trong Sổ lỗi sai).
   - Phiếu: đạt khi đúng từ a.dat% (mặc định 80); chưa đạt thì làm phiếu mới.
     Luyện lỗi: mỗi lỗi 2 câu số mới; em luyện xong một lượt là xong bài, các lỗi cô giao ra khỏi Sổ lỗi sai (thầy chốt 24/10/2026).
   - Xong bài: +a.xu xu (mặc định 20). Nhiều bài thì làm lần lượt theo thứ tự cô giao.
   - Phiếu mẫu cũ (không có a.bat) vẫn như trước, không bắt buộc. */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { go, render, toast } from './13-giao-dien-chung.js';
import { mist } from './21-lop-6-che-do-tro-choi.js';
import { pixelize } from './22-do-hoa-pixel-mau-logo-clb.js';
import { isl1 } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { sfx } from './33b-am-thanh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { asgAll, asgD, asgMine, asgName, asgR, asgState } from './53-phong-hoc.js';
export const BVN_XU=20;
function bvnId(st){return Object.keys(S.st).find(k=>S.st[k]===st)}
function bvnLoiCon(st,a){const M=mist(st);return(a.keys||[]).filter(k=>M[k])}
{hooks.on('asgState',_s=>function(st,a){const o=_s.apply(this,arguments);try{
  if(a.loai==='loi'){const con=bvnLoiCon(st,a).length;
    /* đã xong một lần (sửa hết các lỗi cô giao) là xong hẳn: em sai lại cùng dạng sau đó thì chỉ ghi vào sổ, không mở lại bài cô giao (sửa 24/10/2026) */
    if(con===0&&!o.r.xong){o.r.xong=Date.now()}
    const xong=!!(o.r.xong||o.r.thuong);o.done=xong||con===0;o.con=xong?0:con;if(o.done&&!o.r.best)o.r.best={ok:a.keys.length,n:a.keys.length};o.doing=!o.done&&!!o.r.lam;o.late=!o.done&&a.due&&Date.now()>a.due;o.neu=!o.r.seen&&!o.done}
  else if(a.bat&&o.r.best){const b=o.r.best;o.done=b.ok/b.n>=(a.dat||80)/100;o.chuaDat=!o.done;if(o.chuaDat){o.doing=false;o.late=a.due&&Date.now()>a.due}}}catch(e){}return o})}
export function bvnCho(st){if(!st||st.grade>5)return[];return asgMine(st).filter(a=>a.bat&&!asgState(st,a).done).sort((p,q)=>p.t-q.t)}
/* thưởng khi xong lần đầu */
function bvnThuong(st,a){const r=asgR(st)[a.id]||(asgR(st)[a.id]={});if(r.thuong||!asgState(st,a).done)return false;r.thuong=Date.now();const xu=a.xu||BVN_XU;st.coins+=xu;
  log(bvnId(st),'passed',`Bài về nhà · ${asgName(a)}`,0,{success:true});save();setTimeout(()=>{try{toast(`Xong bài về nhà! +${xu} xu`);sfx('win')}catch(e){}},300);return true}
/* Luyện lỗi có mục tiêu: bắt đầu */
{hooks.on('asgGo',_g=>function(aid){const a=asgAll().find(x=>x.id===aid);if(!a||a.loai!=='loi')return _g.apply(this,arguments);
  const st=S.st[sid],M=mist(st),con=bvnLoiCon(st,a);const r=asgR(st)[aid]||(asgR(st)[aid]={});r.seen=1;r.lam=1;
  if(!con.length){bvnThuong(st,a);render();return}
  const mk=e=>{const x=isl1(e.id);const q=x.lv[e.lv][e.gi]();return{...q,src:[e.id,e.lv,e.gi],key:`${e.id}:${e.lv}:${e.gi}`,label:e.label}};
  const E=con.map(k=>M[k]).filter(e=>isl1(e.id));if(!E.length){toast('Các lỗi này không còn bài tương ứng.');return}
  save();v1Said='';go({k:'game',g1:1,fix:1,bvn:aid,id:E[0].id,lv:0,qs:E.flatMap(e=>[mk(e),mk(e)]),j:0,hearts:3,ok:0,tries:0,res:[],sheet:null,picks:[],seq:[],fill:[],used:[],cnt:0,hp:0,fixed:0,t0:Date.now()})})}
{hooks.on('endFix1',_e=>function(){const g=scr,r=_e.apply(this,arguments);try{if(g&&g.bvn){const st=S.st[sid],a=asgAll().find(x=>x.id===g.bvn);if(a){const M=mist(st);(a.keys||[]).forEach(k=>delete M[k]);const r0=asgR(st)[a.id]||(asgR(st)[a.id]={});r0.xong=r0.xong||Date.now();bvnThuong(st,a);g.bvnKq='xong';save();render()}}}catch(e){}return r})}
/* Phiếu: xong thì thưởng */
{hooks.on('phSubmit',_p=>function(){const g=scr,aid=g&&g.ph,r=_p.apply(this,arguments);try{const st=S.st[sid],a=asgAll().find(x=>x.id===aid);if(a&&a.bat)bvnThuong(st,a)}catch(e){}return r})}
/* màn kết thúc luyện lỗi (bài về nhà): thêm dòng kết quả + nút quay về */
{hooks.on('g1AfterRender',_a=>function(){const r=_a.apply(this,arguments);try{const g=scr;if(g&&g.end&&g.bvn&&!document.querySelector('.bvnend')){const box=document.querySelector('.gend .gendbtn')||document.querySelector('.gend');
  if(box)box.insertAdjacentHTML('afterbegin',`<div class="gatenote bvnend">${g.bvnKq==='xong'?'Em đã luyện xong các lỗi cô giao. Các lỗi này đã ra khỏi Sổ lỗi sai. Giỏi quá!':`Còn ${g.bvnKq} lỗi chưa đúng 2 lần liền. Mình luyện lại nhé!`}</div><button type="button" class="gobtn" onclick="go({k:'home'})">${g.bvnKq==='xong'?'Xong ▶':'Về bài về nhà ▶'}</button>`)}}catch(e){}return r})}

/* ---------- chặn: chưa xong bài về nhà thì không làm gì khác ---------- */
function bvnTrongBai(){const g=scr;return!!(g&&((g.k==='game'&&(g.ph||g.bvn))||(g.k==='home'&&g.tab==='baikq')))}
function viewBVN(st,L){const a=L[0],s=asgState(st,a),nx=L.slice(1);
  const mo=a.loai==='loi'?`Luyện ${a.keys.length} lỗi trong Sổ lỗi sai, mỗi lỗi 2 câu số mới. Luyện xong một lượt là xong bài, các lỗi này ra khỏi sổ.`
    :`${a.n} câu${a.kinds?` dạng "${esc(a.kinds.join(', '))}"`:''}. Đúng từ ${a.dat||80}% là đạt.${s.chuaDat?` Lần trước em đúng ${s.r.best.ok}/${s.r.best.n}, mình làm phiếu mới nhé.`:''}`;
  return`<div class="bvn"><div class="bvn-hd">${jenny(72)}<div><div class="bvn-tag">★ BÀI VỀ NHÀ CÔ GIAO</div><h1>${L.length>1?`Em có ${L.length} bài cần làm`:'Em có 1 bài cần làm'}</h1>
    <p>Làm xong bài về nhà rồi mới chơi tiếp được nhé!</p></div></div>
   <div class="bvn-the"><div class="bvn-so">1</div><div style="min-width:0;flex:1"><b>${esc(asgName(a))}</b><div class="bvn-mo">${mo}</div>
     <div class="bvn-mo">Cô ${esc((a.by||'').replace(/^Cô |^Thầy /,''))} giao ${asgD(a.t)}${a.due?` · hạn ${asgD(a.due)}`:''}${s.late?' · <b class="bvn-tre">quá hạn</b>':''} · thưởng ${a.xu||BVN_XU} xu</div>
     ${a.nhan?`<div class="bvn-nhan">Cô nhắn: “${esc(a.nhan)}”</div>`:''}</div></div>
   <button class="gobtn bvn-go" type="button" onclick="asgGo('${a.id}')">${s.chuaDat||(a.loai==='loi'&&s.r.lam)?'Làm lại ▶':s.doing?'Làm tiếp ▶':'Làm ngay ▶'}</button>
   ${nx.length?`<div class="bvn-sau"><b>Bài tiếp theo</b>${nx.map((b,i)=>`<div class="bvn-li"><span class="bvn-so sm">${i+2}</span>${esc(asgName(b))}</div>`).join('')}</div>`:''}
   <p class="bvn-note">Nút Đăng xuất ở trên cùng vẫn dùng được.</p></div>`}
{hooks.on('render',_r=>function(){const r=_r.apply(this,arguments);try{
  document.body.classList.remove('bvnlock');
  if(role==='hs'){const st=S.st[sid],L=bvnCho(st);if(L.length&&!bvnTrongBai()){const app=document.getElementById('app');app.innerHTML=viewBVN(st,L);document.body.classList.add('bvnlock');document.body.classList.remove('hasnav','gaming');try{pixelize(app)}catch(e){}}}}catch(e){console.error(e)}return r})}
/* sửa khóa lỗi mẫu cũ (dạng id|lv|gi) cho khớp khóa luyện lỗi (id:lv:gi) */
function bvnSuaKhoa(){Object.values(S.st||{}).forEach(st=>{const M=st.mist;if(!M)return;Object.keys(M).forEach(k=>{if(k.includes('|')){const n=k.replace(/\|/g,':');if(!M[n])M[n]=M[k];delete M[k]}})})}
{hooks.on('render',_r=>function(){try{if(S&&!S.mk2){bvnSuaKhoa();S.mk2=1}}catch(e){}return _r.apply(this,arguments)})}
document.head.insertAdjacentHTML('beforeend',`<style>
.bvn{max-width:560px;margin:8px auto;display:flex;flex-direction:column;gap:12px}
.bvn-hd{display:flex;gap:14px;align-items:center;padding:16px;background:linear-gradient(#FFF4D6,#FFE9B8);color:#1F2A5A;box-shadow:var(--f2),0 4px 0 0 #1F2A5A}
.bvn-hd h1{margin:2px 0;font-size:26px;color:#1F2A5A}.bvn-hd p{margin:0;font-size:15px;color:#3D4A70}
.bvn-tag{display:inline-block;font-family:var(--f-display);font-size:16px;background:#F37A1F;color:#fff;padding:2px 8px}
.bvn-the{display:flex;gap:12px;padding:14px;background:var(--surface);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--ink)}
.bvn-so{flex:none;width:34px;height:34px;display:grid;place-items:center;background:#0079C1;color:#fff;font-family:var(--f-display);font-size:22px}.bvn-so.sm{width:24px;height:24px;font-size:16px;background:var(--muted)}
.bvn-mo{font-size:14px;color:var(--muted);margin-top:4px}.bvn-tre{color:var(--coral)}
.bvn-nhan{margin-top:8px;padding:8px 10px;background:var(--sun-soft);color:var(--ink);font-size:14px}
.bvn-go{align-self:stretch;font-size:22px!important}
.bvn-sau{display:flex;flex-direction:column;gap:6px;font-size:14px;color:var(--ink)}.bvn-li{display:flex;gap:8px;align-items:center}
.bvn-note{margin:0;font-size:12.5px;color:var(--muted);text-align:center}
body.bvnlock .bnav,body.bvnlock #bnav,body.bvnlock nav.botnav{display:none!important}
</style>`);
