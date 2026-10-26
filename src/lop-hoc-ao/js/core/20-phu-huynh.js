/* ===================== Phụ huynh ===================== */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { L1, P2 } from './30a-dang-ky-khoi.js';
import { curIsland, p1Stars, p2Stars, totalStars } from './11-sao-va-mo-khoa.js';
import { activeDays, alerts, dayStats } from './12-so-lieu.js';
import { j1s, P2_1 } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { jenny } from './33d-jenny-bieu-cam.js';
export function viewPH(...a){return hooks.goi('viewPH',this,a)}
hooks.ham('viewPH',function(){
  const st=S.st[sid],t=dayStats(sid,S.day),first=st.name.split(' ').pop(),k=curIsland(st);
  const l1=t.n?`Hôm nay ${first} học khoảng ${Math.max(1,t.min)} phút, làm ${t.n} câu, đúng ${t.c} câu.`:`Hôm nay ${first} chưa vào học.`;
  const l2=t.stars?`Con nhận thêm ${t.stars} sao hôm nay, tổng ${totalStars(st)} sao.`:k>=0?`Con đang học "${L1(st)[k].title}" (${st.p1[L1(st)[k].id].m.filter(Boolean).length}/3 sao), tổng ${totalStars(st)} sao.`:`Con có ${totalStars(st)} sao.`;
  const pend=st.active&&st.grade<=5?P2_1.filter(x=>x.grade===st.grade).find(x=>!x.draft&&S.open[x.id]&&!j1s(st,x.id).m.every(Boolean)):st.active&&st.grade===6?P2.find(x=>S.open[x.id]&&!st.p2[x.id].m.every(Boolean)):null;
  const stuck=alerts(sid).find(a=>a.c==='bad');
  const l3=!t.n?'Nhắc con dành 15 phút học tối nay.':pend?`Nhắc con hoàn thành "${pend.title}" của Toán Jenny.`:stuck?`Hỏi con về "${stuck.t.replace('Kẹt ','')}", con đang gặp khó.`:'Khen con vì đã học đều hôm nay.';
  const today=[...st.comments.filter(c=>c.day===S.day).map(c=>'Cô nhận xét: '+c.t),...st.badges.filter(b=>b.day===S.day&&b.from==='cô').map(b=>'Cô tặng thẻ: '+b.t)];
  const from=Math.max(1,S.day-6),days=[];for(let d=from;d<=S.day;d++)days.push({d,...dayStats(sid,d)});
  const mx=Math.max(5,...days.map(x=>x.n)),ad=activeDays(sid);
  return`<div class="grid">
   <div><h1 style="font-size:28px">${esc(st.name)}</h1><div class="muted">Lớp ${st.grade} · báo cáo ngày ${S.day}</div></div>
   <div class="grid g2">
   <section class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">${jenny(44)}<div style="min-width:0;flex:1"><b>Cô Jenny</b> <span class="muted">· 21:00</span>
    <div class="msg" style="margin-top:6px"><p>${esc(l1)}</p><p>${esc(l2)}</p><p class="todo">Việc nên làm: ${esc(l3)}</p>${today.map(x=>`<p>${esc(x)}</p>`).join('')}</div>
    <p class="muted" style="margin:10px 0 0">Bản thật gửi mỗi tối qua thông báo app hoặc Zalo.</p></div></div></section>
   <aside class="grid" style="align-content:start">
    <section class="card"><h3>Tuần này</h3>
     <div class="stat" style="margin-top:10px"><div><b>${ad.a}/${ad.span}</b><span class="muted">ngày học</span></div><div><b>${p1Stars(st)}</b><span class="muted">sao SGK</span></div><div><b>${st.active&&st.grade===6?p2Stars(st):'—'}</b><span class="muted">sao Jenny</span></div></div>
     <div class="week" role="img" aria-label="Số câu làm mỗi ngày">${days.map(x=>`<div class="${x.d===S.day?'today':''}"><span>${x.n}</span><i style="height:${Math.max(3,Math.round(x.n/mx*80))}px"></i>N${x.d}</div>`).join('')}</div>
     <p class="muted" style="margin:6px 0 0">Số câu làm mỗi ngày (vàng là hôm nay).</p></section>
    <section class="card"><h3>Huy hiệu của con</h3><div class="badges" style="margin-top:10px">${st.badges.map(b=>`<span class="badge ${b.from==='cô'?'t':''}"><i>${b.from==='cô'?'♥':'✓'}</i>${esc(b.t)}</span>`).join('')||'<span class="muted">Chưa có</span>'}</div>
     ${st.active||st.grade!==6?'':'<p class="muted" style="margin:12px 0 0">Toán Jenny (2 buổi/tuần, cô giao theo lực học) chưa được kích hoạt cho con. Liên hệ trung tâm nếu muốn đăng ký.</p>'}
     <p class="muted" style="margin:12px 0 0">Phụ huynh có quyền xem, sửa, rút đồng ý hoặc yêu cầu xóa dữ liệu của con.</p></section>
   </aside></div></div>`;
});

