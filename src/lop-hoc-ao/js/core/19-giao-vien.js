/* ===================== Giáo viên ===================== */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { L1, P2 } from './30a-dang-ky-khoi.js';
import { DEMO_CODE, gvCLS, gvHead, ORG_ON, save } from './09-du-lieu-demo.js';
import { evDay, log } from './10-su-kien-mau-xapi.js';
import { curIsland, p1Stars, p2Stars, totalStars } from './11-sao-va-mo-khoa.js';
import { activeDays, alerts, dayStats } from './12-so-lieu.js';
import { initials, render, shortTitle, toast, unit } from './13-giao-dien-chung.js';
import { P2_1 } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { gvCB } from './32-tinh-nang-choi-them-dat-trong-tung-dao.js';
export function viewGV(...a){return hooks.goi('viewGV',this,a)}
hooks.ham('viewGV',function(){
  const CLS=gvCLS();
  const allAl=CLS.flatMap(([id])=>alerts(id).map(a=>({...a,id}))).sort((a,b)=>(a.c==='bad'?0:1)-(b.c==='bad'?0:1));
  const all=allAl.slice(0,6);
  const today=CLS.filter(([id])=>dayStats(id,S.day).n>0).length;
  const avg=CLS.length?Math.round(CLS.reduce((a,[id])=>a+totalStars(S.st[id]),0)/CLS.length*10)/10:0;
  const act=CLS.filter(([id])=>S.st[id].active).length;
  const rows=CLS.map(([id])=>{const st=S.st[id],k=curIsland(st),ad=activeDays(id),t=dayStats(id,S.day),al=alerts(id).filter(a=>!a.tj);
    return`<tr><td><div class="who-cell"><span class="av">${initials(st.name)}</span><div><button class="lnk" onclick="go({k:'gvhs',id:'${id}'})">${esc(st.name)}</button><div class="muted">${st.coins} xu</div></div></div></td><td><b>${totalStars(st)}</b> <span class="stars">★</span><div class="muted">SGK ${p1Stars(st)} · Jenny ${p2Stars(st)}</div></td><td>${k>=0?esc(shortTitle(L1(st)[k].title)):'<span class="muted">Hết đảo đang mở</span>'}</td><td><b>${ad.a}/${ad.span}</b> ngày<div class="muted">hôm nay ${t.n} câu</div></td><td>${al.length?al.map(a=>`<span class="pill ${a.c}" style="margin:2px">${esc(a.t)}</span>`).join(''):'<span class="pill ok">Ổn</span>'}</td></tr>`}).join('');
  const buoi=(gvGrade<=5?P2_1.filter(x=>x.grade===gvGrade):P2).map(x=>{const open=!!S.open[x.id];
    return`<div class="task"><div class="row"><div style="flex:1;min-width:160px"><b>${esc(x.title)}</b><div class="muted">Tuần ${x.week} · ${x.draft?'đang soạn nội dung':open?'đang mở cho lớp':'chưa mở'}</div></div>${x.draft?'<span class="pill">Đang soạn</span>':`<button class="btn sm ${open?'':'pri'}" onclick="toggleOpen('${x.id}')">${open?'Đóng buổi':'Mở buổi'}</button>`}</div>
    ${x.draft?'':`<div class="row" style="margin-top:8px;gap:6px">${CLS.filter(([id])=>S.st[id].active).map(([id,n])=>{const st=S.st[id];const m=st.p2[x.id].m.filter(Boolean).length;return`<span class="pill ${m===3?'ok':m?'acc':'warn'}">${esc(n.split(' ').pop())}: ${m}/3 màn</span>`}).join('')}</div>`}</div>`}).join('');
  const inactive=CLS.filter(([id])=>!S.st[id].active);
  const feed=S.events.slice(-60).reverse().map(e=>`Ngày ${evDay(e)} · ${e.actor.name.split(' ').pop()} ${e.verb.display.vi} · ${e.object.definition.name.vi}${e.result.success===true?' ✓':e.result.success===false?' ✗':''}`).join('\n');
  const actCard=ORG_ON?'':`<section class="card"><h3>Kích hoạt Toán Jenny</h3>${inactive.length?`<p class="muted" style="margin:6px 0 10px">Nhập mã trung tâm đã mua cho từng em. Mã thử: <b>${DEMO_CODE}</b></p>
      <div class="grid" style="gap:8px"><select id="actWho" aria-label="Học sinh">${inactive.map(([id,n])=>`<option value="${id}">${esc(n)}</option>`).join('')}</select><input id="actCode" placeholder="Mã kích hoạt" aria-label="Mã kích hoạt" autocomplete="off"><button class="btn pri" onclick="activate()">Kích hoạt</button></div><div id="actMsg"></div>`:'<p class="muted" style="margin:6px 0 0">Cả lớp đã được kích hoạt.</p>'}</section>`;
  const tjBox=`<section class="card paidbox"><div class="secthead"><h2>Toán Jenny · mở buổi</h2><span class="tag paid">2 buổi/tuần</span></div>${gvGrade===6||(gvGrade<=5&&P2_1.some(x=>x.grade===gvGrade))?`<p class="muted" style="margin:0">Học sinh chỉ vào được buổi cô đã mở. Mỗi buổi được tới 9 sao.</p>${buoi}`:`<p class="muted" style="margin:0">Nội dung Toán Jenny lớp ${gvGrade} đang được soạn.</p>`}</section>`;
  return`<div class="grid">
  ${gvHead()}
  <div class="kpis"><div class="kpi"><span class="muted">Học hôm nay</span><span class="big">${today}/${CLS.length}</span></div><div class="kpi ${allAl.length?'alert':''}"><span class="muted">Cần chú ý</span><span class="big" style="color:${allAl.length?'var(--coral)':'inherit'}">${allAl.length}</span></div><div class="kpi"><span class="muted">Sao trung bình</span><span class="big">${avg}</span></div>${act?`<div class="kpi"><span class="muted">Đã kích hoạt Toán Jenny</span><span class="big">${act}/${CLS.length}</span></div>`:''}</div>
  <section class="card"><h2>Cần chú ý sáng nay</h2>${all.length?`<div class="alertlist">${all.map(a=>`<div class="al ${a.c}"><span class="av">${initials(S.st[a.id].name)}</span><button class="lnk" onclick="go({k:'gvhs',id:'${a.id}'})">${esc(S.st[a.id].name)}</button><span>${esc(a.t)}</span></div>`).join('')}</div>${allAl.length>6?`<p class="muted" style="margin:8px 0 0">Còn ${allAl.length-6} mục khác trong bảng lớp.</p>`:''}`:'<p class="muted" style="margin:8px 0 0">Cả lớp đang ổn.</p>'}</section>
  <section class="card"><h2>Tiến độ từng em</h2><p class="muted" style="margin:4px 0 0">Bấm tên em để mở hồ sơ.</p><div class="tablewrap"><table class="gvbang"><tr><th>Học sinh</th><th>Tổng sao</th><th>Đang học (SGK)</th><th>Chăm (7 ngày)</th><th>Cảnh báo</th></tr>${rows}</table></div></section>
  ${gvCB()}
  ${act?tjBox:''}
  ${actCard}
  <section class="card"><details><summary>Nhật ký học tập (chuẩn xAPI) <span class="pill">${S.events.length} sự kiện</span></summary><div class="row" style="margin-top:10px"><button class="btn sm" onclick="exportLog()">Chép JSON</button></div><div class="log">${esc(feed)}</div><textarea id="jsonBox" hidden readonly aria-label="Nhật ký JSON"></textarea></details></section>
  </div>`;
});
function toggleOpen(...a){return hooks.goi('toggleOpen',this,a)}
hooks.ham('toggleOpen',function(id){S.open[id]=!S.open[id];if(S.open[id])log('gv','assigned',unit(2,id).title,0,{});save();render();toast(S.open[id]?'Đã mở '+unit(2,id).title:'Đã đóng buổi')});
function activate(){const id=document.getElementById('actWho').value,c=document.getElementById('actCode').value.trim().toUpperCase();if(c!==DEMO_CODE){document.getElementById('actMsg').innerHTML=`<div class="fb bad" style="margin-top:10px"><span class="ic">!</span><span>Mã không đúng. Kiểm tra lại mã trên phiếu (mã thử: ${DEMO_CODE}).</span></div>`;return}S.st[id].active=true;log(id,'activated','Toán Jenny',0,{});save();render();toast('Đã kích hoạt Toán Jenny cho '+S.st[id].name)}
function award(b){const id=document.getElementById('bWho').value;S.st[id].badges.push({t:b,day:S.day,from:'cô'});log(id,'awarded',b,0,{});save();render();toast('Đã tặng thẻ "'+b+'"')}
function comment(){const id=document.getElementById('bWho').value,t=document.getElementById('cTpl').value;S.st[id].comments.push({day:S.day,t});save();render();toast('Đã gửi nhận xét')}
function exportLog(){const t=JSON.stringify(S.events,null,2);const box=document.getElementById('jsonBox');box.hidden=false;box.value=t;const fall=()=>{box.select();toast('Đã chọn sẵn JSON bên dưới, bấm Ctrl/Cmd + C để chép')};try{navigator.clipboard.writeText(t).then(()=>toast('Đã chép '+S.events.length+' sự kiện (JSON)'),fall)}catch(e){fall()}}

