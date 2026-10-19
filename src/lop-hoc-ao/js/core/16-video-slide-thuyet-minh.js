/* ===================== Video (slide + thuyết minh) ===================== */
function viewVideo(){
  const u=unit(scr.part,scr.id);
  return`<div class="page">
   <div class="crumb"><button class="btn sm ghost" onclick="go({k:'island',part:${scr.part},id:'${scr.id}'})">← ${esc(shortTitle(u.title))}</button><span class="pill acc">Video thử · slide + lời Jenny</span></div>
   <div class="player"><div id="slide" class="slide" aria-live="polite"></div>
    <div class="pctl"><button class="btn sm ghost" id="pPrev" onclick="player.prev()" aria-label="Trang trước">◀</button><button class="play" id="pPlay" onclick="player.toggle()" aria-label="Phát">▶</button><button class="btn sm ghost" id="pNext" onclick="player.next()" aria-label="Trang sau">▶▶</button><div class="prog" id="prog"></div><span class="muted" id="pCount"></span></div></div>
   <div class="cap">${jenny(32)}<span id="cap"></span></div>
   <div class="row" style="margin-top:14px;justify-content:space-between"><span class="muted" id="pNote"></span><button class="btn" id="pDone" onclick="finishVideo()" disabled>Đã xem xong ✓</button></div></div>`;
}
function startPlayer(){
  const u=unit(scr.part,scr.id),slides=u.slides;let i=0,playing=false,timer=null,seen=new Set([0]);
  const synth=('speechSynthesis' in window)?window.speechSynthesis:null;
  let voice=null;const pickVoice=()=>{try{voice=(synth.getVoices()||[]).find(v=>/^vi/i.test(v.lang))||null}catch(e){voice=null}};
  if(synth){pickVoice();try{synth.onvoiceschanged=pickVoice}catch(e){}}
  const el=id=>document.getElementById(id);
  function draw(){if(!el('slide'))return;const s=slides[i];el('slide').innerHTML=`<h3>${s.t}</h3><div class="body">${s.h}</div>`;el('cap').textContent=s.say;
    el('prog').innerHTML=slides.map((_,j)=>`<i class="${j<=i?'on':''}"></i>`).join('');el('pCount').textContent=`${i+1}/${slides.length}`;
    el('pPrev').disabled=i===0;el('pNext').disabled=i===slides.length-1;el('pPlay').textContent=playing?'❚❚':'▶';el('pPlay').setAttribute('aria-label',playing?'Dừng':'Phát');
    const all=seen.size>=slides.length;el('pDone').disabled=!all;el('pDone').classList.toggle('pri',all);
    el('pNote').textContent=all?'Em đã xem hết các trang.':voice?'Bấm ▶ để Jenny đọc bằng giọng tiếng Việt.':synth?'Máy chưa có giọng tiếng Việt: em đọc phụ đề bên dưới.':'Máy không đọc được: em đọc phụ đề, trang tự chuyển.'}
  function clear(){clearTimeout(timer);timer=null;if(synth)try{synth.cancel()}catch(e){}}
  function speak(){clear();const s=slides[i];const after=()=>{if(!playing)return;if(i<slides.length-1){i++;seen.add(i);draw();speak()}else{playing=false;draw()}};
    if(synth){try{const u2=new SpeechSynthesisUtterance(s.say);u2.lang='vi-VN';if(voice)u2.voice=voice;u2.rate=1;let ended=false;u2.onend=()=>{if(ended)return;ended=true;timer=setTimeout(after,500)};u2.onerror=()=>{if(ended)return;ended=true;timer=setTimeout(after,Math.max(3500,s.say.length*60))};synth.speak(u2);return}catch(e){}}
    timer=setTimeout(after,Math.max(3500,s.say.length*60))}
  player={toggle(){playing=!playing;if(playing)speak();else clear();draw()},next(){if(i<slides.length-1){i++;seen.add(i);draw();if(playing)speak()}},prev(){if(i>0){i--;draw();if(playing)speak()}},stop(){playing=false;clear()}};
  draw();
}
function finishVideo(){const s=ustate(scr.part,scr.id);if(!s.intro){s.intro=true;log(sid,'watched',unit(scr.part,scr.id).title,0,{completion:true})}save();go({k:'island',part:scr.part,id:scr.id});toast('Đã xem xong. Vào bước tiếp theo nhé!')}

