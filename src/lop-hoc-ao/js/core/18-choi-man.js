/* ===================== Chơi màn ===================== */
function startLevel(part,id,i){
  const u=unit(part,id);let qs;
  if(part===1)qs=Array.from({length:P1_Q},()=>u.gen[i]());
  else qs=u.levels[i].map(x=>({...x}));
  go({k:'play',part,id,i,qs,j:0,ok:0,fb:null,res:[],t0:Date.now()});
}
const passNeed=(part,n)=>part===1?P1_PASS:Math.ceil(n*0.6);
function viewPlay(){
  const {part,id,i,qs,j}=scr,u=unit(part,id),n=qs.length,q=qs[j];
  const name=part===1?M1[i]:`Màn ${i+1} · ${'★'.repeat(i+1)}`;
  if(scr.end){const need=passNeed(part,n),pass=scr.ok>=need,earned=part===1?(pass?1:0):(pass?STAR2[i]:0);
    return`<div class="page"><div class="qcard result">
     ${pass?bigStars(part===1?1:Math.min(3,i+1),part===1?1:Math.min(3,i+1)):jenny(72)}
     <h1 style="font-size:28px;margin-top:10px">${pass?'Qua màn rồi!':'Gần được rồi!'}</h1>
     <p class="big" style="margin:10px 0 4px">${scr.ok}/${n}</p><p class="muted" style="margin:0">câu đúng · ${esc(shortTitle(u.title))} · ${name}</p>
     <div class="fb ${pass?'ok':'info'}" style="text-align:left;margin:18px auto 0;max-width:520px"><span class="ic">${pass?'★':'i'}</span><span>${pass?(scr.newStars?`Em nhận <b>${scr.newStars} sao</b>. Tổng sao: <b>${totalStars(S.st[sid])}</b>.${scr.unlocked?`<br>Mở khóa đảo mới: <b>${esc(scr.unlocked)}</b>.`:''}`:'Màn này em đã có sao từ trước. Luyện thêm giúp em nhớ lâu hơn.'):`Cần đúng ${need}/${n} câu để qua màn. Xem lại lời giải rồi thử lần nữa nhé.`}</span></div>
     <div class="row" style="justify-content:center;margin-top:20px">${pass&&i<2?`<button class="btn pri lg" onclick="startLevel(${part},'${id}',${i+1})">Màn tiếp →</button>`:`<button class="btn ${pass?'':'pri'} lg" onclick="startLevel(${part},'${id}',${i})">Chơi lại màn</button>`}<button class="btn lg" onclick="go({k:'island',part:${part},id:'${id}'})">Về ${part===1?'đảo':'buổi'}</button><button class="btn lg ghost" onclick="go({k:'home'})">Bản đồ</button></div></div></div>`}
  return`<div class="page">
   <div class="crumb"><button class="btn sm ghost" onclick="go({k:'island',part:${part},id:'${id}'})">✕ Thoát</button><span class="pill ${part===1?'ok':'warn'}">${name}</span><span class="muted" style="margin-left:auto">Câu ${j+1}/${n} · đúng ${scr.ok}</span></div>
   <div class="qcard"><div class="qtop"><div class="prog">${qs.map((_,k)=>`<i class="${scr.res[k]===true?'okq':scr.res[k]===false?'badq':k===j?'on':''}"></i>`).join('')}</div></div>
   <div class="muted">${esc(u.title)}${q.ref?` · bài ${esc(q.ref)}`:''}</div>
   <div class="qbox">${q.q}</div>
   ${scr.fb?`<div class="fb ${scr.fb.ok?'ok':'bad'}"><span class="ic">${scr.fb.ok?'✓':'✕'}</span><div><b>${scr.fb.ok?'Đúng rồi!':'Chưa đúng.'}</b> ${scr.fb.ok?'':'Đáp số: <b>'+ansText(q)+'</b>.'} <span class="muted">${scr.fb.msg||''}</span><div class="sol">Lời giải: ${q.sol}</div></div></div><div class="row" style="margin-top:16px"><button class="btn pri lg" id="nextBtn" onclick="nextQ()">${j<n-1?'Câu tiếp →':'Xem kết quả'}</button></div>`
   :`<div class="ansrow"><input id="ans" ${q.pair||q.frac?'':'inputmode="numeric"'} placeholder="${ansHint(q)}" aria-label="Đáp số" autocomplete="off" onkeydown="if(event.key==='Enter')submitQ()"><button class="btn pri lg" onclick="submitQ()">Nộp</button></div>`}
  </div></div>`;
}
function submitQ(){
  const v=document.getElementById('ans').value.trim();if(v==='')return;
  const {part,id,qs,j}=scr,q=qs[j],ok=isCorrect(v,q),u=unit(part,id),sec=Math.round((Date.now()-scr.t0)/1000);scr.t0=Date.now();
  log(sid,'answered',u.title,0,{success:ok,duration:`PT${sec}S`});
  let msg='';if(ok){scr.ok++;const g=part===1?addCoins(sid,5,'self'):addCoins(sid,10,'jenny');msg=g?`+${g} xu`:'(đã đủ xu tự luyện hôm nay)'}
  scr.res[j]=ok;scr.fb={ok,msg};save();render();setTimeout(()=>{const b=document.getElementById('nextBtn');b&&b.focus()},20);
}
function nextQ(){
  if(scr.j<scr.qs.length-1){scr.j++;scr.fb=null;render();return}
  const {part,id,i,qs}=scr,s=ustate(part,id),u=unit(part,id),st=S.st[sid];
  const pass=scr.ok>=passNeed(part,qs.length),openBefore=L1(st).map((_,k)=>islandOpen(st,k));
  scr.newStars=0;scr.unlocked=null;
  if(pass){log(sid,'passed',`${u.title} · màn ${i+1}`,0,{success:true,score:{raw:scr.ok,max:qs.length}});
    if(!s.m[i]){s.m[i]=true;scr.newStars=part===1?1:STAR2[i];log(sid,'earned',`${u.title} · màn ${i+1}`,0,{score:{raw:scr.newStars}})}
    if(part===1&&s.m.every(Boolean)&&!st.badges.some(b=>b.t==='Huy hiệu '+u.title.split('.')[0]))st.badges.push({t:'Huy hiệu '+u.title.split('.')[0],day:S.day,from:'máy'});
    if(part===2&&s.m.every(Boolean)){const item=pick(['Vòng cổ vàng','Mũ phi hành gia','Cá hồi hiếm','Bóng len cầu vồng']);if(!st.items.includes(item))st.items.push(item)}
    const k=L1(st).findIndex((_,k)=>!openBefore[k]&&islandOpen(st,k));if(k>=0)scr.unlocked=L1(st)[k].title;
  }else{s.fails[i]++;log(sid,'failed',`${u.title} · màn ${i+1}`,0,{success:false,score:{raw:scr.ok,max:qs.length}})}
  scr.end=true;save();render();
}

