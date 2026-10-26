/* ===================== Ví dụ dẫn dắt (Phần II) ===================== */
import { esc } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { render, unit, ustate } from './13-giao-dien-chung.js';
import { startLevel } from './18-choi-man.js';
import { jenny } from './33d-jenny-bieu-cam.js';
export function viewExample(){
  const u=unit(2,scr.id),ex=u.example,shown=ex.steps.slice(0,scr.i+1),cur=ex.steps[scr.i],need=cur.ask&&!scr.got[scr.i],last=scr.i===ex.steps.length-1;
  return`<div class="page">
   <div class="crumb"><button class="btn sm ghost" onclick="go({k:'island',part:2,id:'${scr.id}'})">← ${esc(u.title)}</button><span class="pill warn">${esc(ex.title)}</span><span class="muted" style="margin-left:auto">Bước ${scr.i+1}/${ex.steps.length}</span></div>
   <div class="qcard"><div class="qbox" style="margin-top:0">${ex.q}</div>
   ${shown.map((s,j)=>`<div class="exstep">${jenny(34)}<div class="grow">${s.h}${s.ask&&scr.got[j]?`<div class="fb ok" style="margin-top:8px;padding:8px 12px"><span class="ic">✓</span><span>Đúng rồi: <b>${s.ask.a}</b></span></div>`:''}</div></div>`).join('')}
   ${need?`<div class="ansrow" style="margin-top:12px"><input id="ans" inputmode="numeric" placeholder="Nhập đáp số" aria-label="Đáp số" onkeydown="if(event.key==='Enter')exCheck()"><button class="btn pri lg" onclick="exCheck()">Kiểm tra</button><button class="btn lg" onclick="exHint()">Gợi ý</button></div><div id="exfb"></div>`:
     last?`<div class="row" style="margin-top:12px"><button class="btn pri lg" onclick="exDone()">Xong ví dụ, vào màn 1 →</button></div>`:`<div class="row" style="margin-top:12px"><button class="btn pri lg" onclick="scr.i++;render()">Bước tiếp →</button></div>`}
  </div></div>`;
}
export const num=v=>Number(String(v).replace(/[\s.,]/g,''));
function exCheck(){const v=document.getElementById('ans').value.trim();if(v==='')return;const st=unit(2,scr.id).example.steps[scr.i];const ok=num(v)===st.ask.a;log(sid,'answered',unit(2,scr.id).example.title,0,{success:ok,duration:'PT30S'});if(ok){scr.got[scr.i]=true;save();render()}else{document.getElementById('exfb').innerHTML=`<div class="fb bad" style="margin-top:12px"><span class="ic">!</span><span>Chưa đúng, em thử lại nhé. Gợi ý: ${st.ask.hint}</span></div>`}}
function exHint(){const st=unit(2,scr.id).example.steps[scr.i];document.getElementById('exfb').innerHTML=`<div class="fb info" style="margin-top:12px"><span class="ic">?</span><span>${st.ask.hint}</span></div>`}
function exDone(){const s=ustate(2,scr.id);if(!s.ex){s.ex=true;log(sid,'studied',unit(2,scr.id).example.title,0,{completion:true})}save();startLevel(2,scr.id,0)}

