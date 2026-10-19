/* ===================== Học sinh: trang đảo / buổi ===================== */
function viewIsland(){
  const {part,id}=scr,u=unit(part,id),s=ustate(part,id);
  const steps=[];
  steps.push({done:s.intro,can:true,t:'Video tổng hợp kiến thức',d:`${u.slides.length} trang · Jenny thuyết minh`,act:`go({k:'video',part:${part},id:'${id}'})`,lbl:s.intro?'Xem lại':'Xem video'});
  if(part===2)steps.push({done:s.ex,can:UNL||s.intro,t:u.example.title,d:'Jenny dẫn em giải từng bước',act:`go({k:'example',id:'${id}',i:0,got:{}})`,lbl:s.ex?'Xem lại':'Bắt đầu'});
  const ready=part===1?s.intro:s.intro&&s.ex;
  [0,1,2].forEach(i=>{const can=ready&&(i===0||s.m[i-1]);
    const name=part===1?M1[i]:`Màn ${i+1} · ${'★'.repeat(i+1)}`,reward=part===1?'1 sao':`${STAR2[i]} sao`,n=part===1?P1_Q:u.levels[i].length;
    steps.push({done:s.m[i],can,t:name,d:`${n} câu · thưởng ${reward}${s.fails[i]?` · đã thử ${s.fails[i]} lần`:''}`,act:`startLevel(${part},'${id}',${i})`,lbl:s.m[i]?'Chơi lại':'Chơi'})});
  const nextIdx=steps.findIndex(x=>!x.done&&x.can);
  const got=part===1?s.m.filter(Boolean).length:s.m.reduce((a,v,i)=>a+(v?STAR2[i]:0),0),max=part===1?3:9;
  return`<div class="page">
   <div class="crumb"><button class="btn sm ghost" onclick="go({k:'home'})">← Bản đồ</button><span class="tag ${part===1?'free':'paid'}">${part===1?'Phần I · SGK':'Phần II · Toán Jenny'}</span></div>
   <div class="card"><div class="lesson">${jenny(56)}<div class="grow"><h1>${esc(u.title)}</h1><div class="muted">${part===2?esc(u.src):'Kết nối tri thức · '+BOOK[S.st[sid].grade]}</div></div><div style="text-align:right">${part===1?bigStars(got,3):`<span class="big">${got}</span><span class="muted">/9 sao</span>`}</div></div>
   <ol class="tl">${steps.map((x,i)=>`<li class="${x.done?'done':''} ${i===nextIdx?'next':''} ${!x.can&&!x.done?'off':''}"><span class="n">${x.done?'✓':i+1}</span><div class="grow"><b>${x.t}</b><span class="muted">${x.d}</span></div><button class="btn sm ${i===nextIdx?'pri':''}" ${x.can?'':'disabled'} onclick="${x.act}">${x.can?x.lbl:'🔒 Khóa'}</button></li>`).join('')}</ol>
   <p class="muted" style="margin:14px 0 0">Xem video${part===2?' và học ví dụ':''} trước, rồi qua từng màn theo thứ tự.</p></div></div>`;
}

