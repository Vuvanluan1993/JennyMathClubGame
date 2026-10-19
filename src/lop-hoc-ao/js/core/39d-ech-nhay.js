/* ===================== ẾCH NHẢY LÁ SÚNG: hiệu ứng nhảy / rơi / bơi về bờ ===================== */
/* Chạm lá súng → ếch nhảy vòng cung từ bờ lên lá đó. Đúng: đứng trên lá rồi sang hàng mới.
   Sai: lá chìm, ếch rơi xuống nước (bọt bắn), rồi bơi lại bờ (chỉ thấy đầu, có gợn sóng); bơi về tới bờ mới được chọn tiếp. */
PXS.frogSwim=["...kk.....kk....","..kwwk...kwwk...","..kwkk...kwkk...",".kggggggggggggk.","kgggggggggggggGk","kgGgggggggggGggk","bbbbbbbbbbbbbbbb",".bwb..bwb..bwb..","................"];
const FROG_BANK=[147,254],FROG_PAD=[[33,96],[147,96],[261,96]];
function frogAnim(el,frames,ms,steps){return new Promise(res=>{try{const a=el.animate(frames,{duration:ms,easing:`steps(${steps||Math.max(4,Math.round(ms/60))})`,fill:'forwards'});a.onfinish=()=>res();a.oncancel=()=>res()}catch(e){setTimeout(res,ms)}})}
const fpos=([x,y],dy=0,o={})=>Object.assign({left:x+'px',top:(y+dy)+'px'},o);
function frogSprite(el,name){el.innerHTML=spr(name,48);try{pixelize(el)}catch(e){}}
function frogTap(i){const g=scr;if(g.k!=='xg'||g.mode!=='frog'||g.end||g.lock||g.bad.includes(i))return;const q=g.q,ok=i===q.a;
  xgRec(ok,g.tries===0&&q.q?q.q:g.tries===0?{kind:'Tính nhẩm'}:null);g.tries++;g.lock=1;
  const el=document.getElementById('xfj'),pad=document.querySelectorAll('.xfpad')[i],fb=document.getElementById('xgfb'),B=FROG_BANK,P=FROG_PAD[i];
  if(!el){/* không có màn hình (kiểm thử): xử lý ngay */return frogDone(g,i,ok)}
  el.classList.remove('hop','p0','p1','p2');el.style.transition='none';
  frogSprite(el,'frogJ');sfx('tap');
  /* nhảy vòng cung bờ → lá */
  const mid=[(B[0]+P[0])/2,Math.min(B[1],P[1])-70];
  frogAnim(el,[fpos(B),fpos(mid,0,{offset:.5}),fpos(P)],520,8).then(()=>{if(scr!==g)return;
    if(ok){frogSprite(el,'frog');sfx('ok');if(pad)pad.classList.add('good');if(fb)fb.innerHTML='<span class="ok">Đúng rồi! Ếch đã lên lá súng.</span>';setTimeout(()=>frogDone(g,i,true),420);return}
    /* sai: lá chìm, ếch rơi xuống nước */
    if(pad)pad.classList.add('sink');sfx('splash');setTimeout(()=>sfx('bad'),120);hurtFx(1);g.lives--;try{xgHearts()}catch(e){}
    if(fb)fb.innerHTML='<span class="bad">Ếch rơi xuống nước! Đang bơi về bờ…</span>';
    const zone=document.getElementById('xff');if(zone){const s=document.createElement('span');s.className='xfspl';s.style.left=(P[0]-12)+'px';s.innerHTML=spr('splashW',72);try{pixelize(s)}catch(e){}zone.appendChild(s);setTimeout(()=>s.remove(),700)}
    frogAnim(el,[fpos(P),fpos(P,30,{opacity:.9})],300,3).then(()=>{if(scr!==g)return;
      frogSprite(el,'frogSwim');el.classList.add('swim');
      /* bơi về bờ: đi chậm, lắc nhẹ */
      const W=[P,[P[0]+(B[0]-P[0])*.33,P[1]+30+(B[1]-P[1]-30)*.33],[P[0]+(B[0]-P[0])*.66,P[1]+30+(B[1]-P[1]-30)*.66],[B[0],B[1]+6]];
      frogAnim(el,[fpos(W[0],30),fpos(W[1],0,{offset:.33}),fpos(W[2],0,{offset:.66}),fpos(W[3])],1400,14).then(()=>{if(scr!==g)return;
        el.classList.remove('swim');frogSprite(el,'frog');frogAnim(el,[fpos([B[0],B[1]+6]),fpos(B)],160,2).then(()=>frogDone(g,i,false))})})})}
function frogDone(g,i,ok){if(scr!==g)return;g.lock=0;
  if(ok){g.score+=g.tries===1?1:0;g.ri++;g.hop=null;g.tries=0;g.bad=[];g.fb='';if(g.ri>=g.N)return xg3End();g.q=frogQ(isl1(g.id));sfx('splash');render();try{if(curG()<=2)sayJ(frogSay(g.q))}catch(e){}return}
  if(!document.getElementById('xfj'))g.lives--;
  g.bad.push(i);g.splash=null;g.fb='<span class="bad">Ếch đã về bờ. Em chọn lá khác nhé!</span>';if(g.lives<=0)return xg3End();render()}
