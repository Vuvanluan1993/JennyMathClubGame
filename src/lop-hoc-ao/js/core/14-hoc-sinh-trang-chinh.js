/* ===================== Học sinh: trang chính ===================== */
import { hooks } from './00-hooks.js';
import { esc, starsHtml } from './01-tien-ich.js';
import { BOOK, L1, NEED, P1_PASS, P1_Q } from '../content/hk1/07-lop-9-chuong-i-phuong-trinh-va-he-hai-ph.js';
import { P2, STAR2 } from '../content/hk1/08-phan-ii-toan-jenny-sach-clb-lop-6-chuong.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { curIsland, islandOpen, p1Stars, totalStars } from './11-sao-va-mo-khoa.js';
import { activeDays } from './12-so-lieu.js';
import { islandArt, render, shortTitle, toast } from './13-giao-dien-chung.js';
import { viewIsland } from './15-hoc-sinh-trang-dao-buoi.js';
import { viewVideo } from './16-video-slide-thuyet-minh.js';
import { viewExample } from './17-vi-du-dan-dat-phan-ii.js';
import { viewPlay } from './18-choi-man.js';
import { viewGame, viewHome6, viewIsland6 } from './21-lop-6-che-do-tro-choi.js';
import { viewGame1 } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { viewHome1t, viewJenny1, viewJEx1, viewJSlide1 } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { viewLes } from '../content/hk1/30-bai-giang-jenny-slide-tom-tat-kien-thuc.js';
import { viewIsland1, viewMini } from './32-tinh-nang-choi-them-dat-trong-tung-dao.js';
import { jenny } from './33d-jenny-bieu-cam.js';
export function petFace(e){return e>=70?'😺':e>=35?'🐱':'😿'}
export function nextAction(st){
  if(st.grade===6&&st.active){const b=P2.find(x=>!x.draft&&S.open[x.id]&&!st.p2[x.id].m.every(Boolean));if(b)return{label:`Học tiếp: ${b.title}`,go:`{k:'island',part:2,id:'${b.id}'}`,why:'Cô giáo vừa mở buổi Toán Jenny'}}
  const k=curIsland(st);if(k>=0){const x=L1(st)[k];return{label:`Học tiếp: Bài ${k+1}`,go:`{k:'island',part:1,id:'${x.id}'}`,why:shortTitle(x.title)}}
  return null;
}
export function viewHS(...a){return hooks.goi('viewHS',this,a)}
hooks.ham('viewHS',function(){
  {const st6=S.st[sid];if(st6.grade<=5){if(scr.k==='game')return viewGame1();if(scr.k==='island')return viewIsland1();if(scr.k==='jenny')return viewJenny1();if(scr.k==='jslide')return viewJSlide1();if(scr.k==='lslide')return viewLes();if(scr.k==='jex')return viewJEx1();if(scr.k==='mini')return viewMini();return viewHome1t()}if(st6.grade===6){if(scr.k==='game')return viewGame();if(scr.k==='island'&&scr.part===1)return viewIsland6();if(scr.k==='home')return viewHome6();}}
  if(scr.k==='island')return viewIsland();
  if(scr.k==='video')return viewVideo();
  if(scr.k==='example')return viewExample();
  if(scr.k==='play')return viewPlay();
  const st=S.st[sid],tot=totalStars(st),P=L1(st),ck=curIsland(st),na=nextAction(st),ad=activeDays(sid);
  const maxP1=P.length*3,got1=p1Stars(st);
  const isl=P.map((x,k)=>{const s=st.p1[x.id],n=s.m.filter(Boolean).length,open=UNL||islandOpen(st,k),state=!open?'lock':n===3?'done':'cur';
    if(!open)return`<div class="isl lock" aria-disabled="true"><div class="art">${islandArt('lock')}</div><span class="no">${k+1}</span><b>${esc(shortTitle(x.title))}</b><span class="muted">Cần ${NEED(k)} ★ · còn thiếu ${NEED(k)-tot}</span></div>`;
    return`<button class="isl ${state}${k===ck?' cur':''}" onclick="go({k:'island',part:1,id:'${x.id}'})"><div class="art">${islandArt(state)}</div><span class="no">${k+1}</span>${k===ck?'<span class="now pill acc">Đang học</span>':''}<b>${esc(shortTitle(x.title))}</b><span class="row" style="justify-content:space-between;gap:6px">${starsHtml(n,3)}<span class="muted">${n===3?'Đã xong':n?'Học tiếp':'Bắt đầu'}</span></span></button>`}).join('');
  let p2;
  if(st.grade!==6)p2=`<div class="locknote">${jenny(40)}<div><b>Toán Jenny lớp ${st.grade} đang được soạn.</b><br>Bản demo hiện có Toán Jenny lớp 6. Em vẫn học Phần I miễn phí bình thường.</div></div>`;
  else if(!st.active)p2=`<div class="locknote">${jenny(40)}<div><b>Toán Jenny chưa được kích hoạt cho em.</b><br>Trung tâm mua mã và kích hoạt cho từng bạn. Em vẫn học Phần I miễn phí bình thường.</div></div>`;
  else p2='<div class="map">'+P2.map((x,k)=>{const s=st.p2[x.id],n=s.m.reduce((a,v,i)=>a+(v?STAR2[i]:0),0),state=n===9?'done':'cur';
    if(x.draft)return`<div class="isl lock"><div class="art">${islandArt('lock')}</div><span class="no">${k+1}</span><b>${esc(x.title)}</b><span class="muted">Tuần ${x.week} · đang soạn</span></div>`;
    if(!UNL&&!S.open[x.id])return`<div class="isl lock"><div class="art">${islandArt('lock')}</div><span class="no">${k+1}</span><b>${esc(x.title)}</b><span class="muted">Tuần ${x.week} · chờ cô mở buổi</span></div>`;
    return`<button class="isl ${state}" onclick="go({k:'island',part:2,id:'${x.id}'})"><div class="art" style="background:var(--sun-soft)">${islandArt(state)}</div><span class="no">${k+1}</span><b>${esc(x.title)}</b><span class="row" style="justify-content:space-between;gap:6px"><span><span class="stars">★</span> <b>${n}</b>/9 sao</span><span class="muted">Tuần ${x.week}</span></span></button>`}).join('')+'</div>';
  const self=st.selfCoins[S.day]||0;
  return`<div class="grid">
  <section class="hero">${jenny(76)}<div class="grow"><h1>Chào ${esc(st.name.split(' ').pop())}!</h1><div class="sub">Lớp ${st.grade} · ${na?esc(na.why):'Em đã đi hết các đảo đang mở, giỏi lắm!'}</div>
    <div class="chips"><span class="chip"><span style="color:var(--sun)">★</span><b>${tot}</b> sao</span><span class="chip">🪙 <b>${st.coins}</b> xu</span><span class="chip">📅 <b>${ad.a}/${ad.span}</b> ngày học tuần này</span></div></div>
    ${na?`<button class="btn lg" onclick="go(${na.go})">${esc(na.label)} →</button>`:''}</section>
  <div class="grid g2">
  <div class="grid" style="align-content:start">
    <section class="card"><div class="secthead"><h2>Phần I · Toán SGK</h2><span class="tag free">Miễn phí</span><span class="grow"></span><span class="muted"><b style="color:var(--ink)">${got1}</b>/${maxP1} sao</span></div>
      <div class="bar sun"><i style="width:${Math.round(got1/maxP1*100)}%"></i></div>
      <p class="muted" style="margin:10px 0 0">Kết nối tri thức ${st.grade} · ${BOOK[st.grade]}. Mỗi đảo: xem video, rồi qua 3 màn (đúng ${P1_PASS}/${P1_Q} câu được 1 sao). Đủ sao thì đảo sau tự mở.</p>
      <div class="map">${isl}</div></section>
    <section class="card paidbox"><div class="secthead"><h2>Phần II · Toán Jenny</h2><span class="tag paid">Trả phí</span></div>
      <p class="muted" style="margin:0">2 buổi mỗi tuần do cô giáo mở. Mỗi buổi: video → ví dụ dẫn dắt → 3 màn ★ ★★ ★★★, được tới 9 sao.</p>${p2}</section>
  </div>
  <aside class="grid" style="align-content:start">
    <section class="card"><h3>Mèo Mướp của em</h3>
      <div class="row" style="margin-top:10px;flex-wrap:nowrap"><span class="pet" aria-hidden="true">${petFace(st.energy)}</span><div style="flex:1;min-width:0"><div class="muted">Năng lượng ${st.energy}/100</div><div class="bar leaf"><i style="width:${st.energy}%"></i></div></div></div>
      <p class="muted" style="margin:10px 0 6px">Xu tự luyện hôm nay: ${self}</p>
      <div class="row"><button class="btn sm" onclick="buy(20,25,'Cá khô')">Cá khô · 20 xu</button><button class="btn sm" onclick="buy(40,50,'Bát sữa')">Bát sữa · 40 xu</button></div>
      ${st.items.length?`<p class="muted" style="margin:10px 0 0">Đồ hiếm: ${st.items.map(esc).join(', ')}</p>`:''}</section>
    <section class="card"><h3>Huy hiệu</h3><div class="badges" style="margin-top:10px">${st.badges.length?st.badges.map(b=>`<span class="badge ${b.from==='cô'?'t':''}"><i>${b.from==='cô'?'♥':'✓'}</i>${esc(b.t)}</span>`).join(''):'<p class="muted" style="margin:0">Qua đủ 3 màn của một đảo để nhận huy hiệu đầu tiên.</p>'}</div></section>
  </aside></div></div>`;
});
function buy(cost,en,name){const st=S.st[sid];if(st.coins<cost){toast('Chưa đủ xu. Làm thêm bài để kiếm xu nhé!');return}st.coins-=cost;st.energy=Math.min(100,st.energy+en);log(sid,'purchased',name,0,{score:{raw:-cost}});save();render();toast('Mèo Mướp rất vui!')}

