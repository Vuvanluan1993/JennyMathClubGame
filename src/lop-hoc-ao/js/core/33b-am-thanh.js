/* ===================== ÂM THANH: nhạc nền 8-bit + hiệu ứng từng trò chơi ===================== */
/* Tự tổng hợp bằng Web Audio (không cần file nhạc). Cài đặt lưu ở localStorage 'jennySound': {m: nhạc, s: hiệu ứng}. */
const SND=(()=>{let o={m:1,s:1};try{const v=JSON.parse(localStorage.getItem('jennySound')||'null');if(v)o=Object.assign(o,v)}catch(e){}try{if(localStorage.getItem('jennyMute')==='1')o={m:0,s:0}}catch(e){}return o})();
muted=!SND.s;
let AUD=null;
function aud(){if(AUD)return AUD;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;const ac=new C();const master=ac.createGain();master.gain.value=.9;master.connect(ac.destination);
  const fx=ac.createGain();fx.gain.value=.55;fx.connect(master);const mu=ac.createGain();mu.gain.value=0;mu.connect(master);AUD={ac,master,fx,mu};AC=ac}catch(e){AUD=null}return AUD}
function sndSave(){try{localStorage.setItem('jennySound',JSON.stringify(SND));localStorage.setItem('jennyMute',(!SND.m&&!SND.s)?'1':'0')}catch(e){}muted=!SND.s}
/* một nốt: tần số, bắt đầu (giây, tính từ bây giờ), dài, dạng sóng, âm lượng, trượt tần số */
function tone(f,at,dur,type='square',vol=.22,slide=0,bus){const A=aud();if(!A)return;const t=A.ac.currentTime+at;const os=A.ac.createOscillator(),g=A.ac.createGain();os.type=type;os.frequency.setValueAtTime(f,t);if(slide)os.frequency.exponentialRampToValueAtTime(Math.max(30,f*slide),t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0008,t+dur);os.connect(g);g.connect(bus||A.fx);os.start(t);os.stop(t+dur+.03)}
function noise(at,dur,vol=.2,hp=800,bus){const A=aud();if(!A)return;const t=A.ac.currentTime+at,n=Math.floor(A.ac.sampleRate*dur),buf=A.ac.createBuffer(1,n,A.ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const s=A.ac.createBufferSource();s.buffer=buf;const f=A.ac.createBiquadFilter();f.type='highpass';f.frequency.value=hp;const g=A.ac.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(bus||A.fx);s.start(t)}
const mHz=(n)=>440*Math.pow(2,(n-69)/12); /* số MIDI → Hz */
const SFX={
 tap:()=>tone(mHz(84),0,.05,'square',.12),
 ok:()=>{tone(mHz(76),0,.09);tone(mHz(84),.08,.14)},
 bad:()=>{tone(mHz(52),0,.14,'sawtooth',.18,.7);tone(mHz(47),.12,.22,'sawtooth',.16,.7)},
 combo:()=>[76,79,84,88].forEach((n,i)=>tone(mHz(n),i*.06,.1)),
 win:()=>{[72,76,79,84].forEach((n,i)=>tone(mHz(n),i*.11,.16));tone(mHz(88),.46,.35,'square',.2);tone(mHz(48),0,.6,'triangle',.25)},
 lose:()=>[67,63,60,55].forEach((n,i)=>tone(mHz(n),i*.16,.22,'triangle',.25)),
 hit:()=>{noise(0,.12,.28,400);tone(mHz(45),0,.18,'square',.22,.5)},
 bossdown:()=>{noise(0,.5,.3,200);[60,64,67,72,76].forEach((n,i)=>tone(mHz(n),.2+i*.09,.14))},
 hurt:()=>{tone(mHz(60),0,.08,'square',.2);tone(mHz(55),.07,.18,'square',.2,.6)},
 coin:()=>{tone(mHz(83),0,.06);tone(mHz(88),.06,.18)},
 star:()=>[84,88,91,96].forEach((n,i)=>tone(mHz(n),i*.05,.09,'triangle',.18)),
 card:()=>{[79,83,86,91].forEach((n,i)=>tone(mHz(n),i*.07,.12,'triangle',.2));noise(.28,.15,.08,3000)},
 chest:()=>{noise(0,.2,.15,600);[67,71,74,79,83].forEach((n,i)=>tone(mHz(n),.15+i*.07,.12))},
 page:()=>noise(0,.09,.12,2500),
 unlock:()=>{tone(mHz(72),0,.08);tone(mHz(79),.08,.08);tone(mHz(84),.16,.2)},
 /* Câu cá */
 cast:()=>{noise(0,.18,.06,3000);tone(mHz(90),0,.18,'sine',.08,.4)},
 catch:()=>{noise(0,.12,.18,1200);tone(mHz(72),.05,.08,'sine',.2,1.6);tone(mHz(84),.13,.12,'triangle',.18)},
 splash:()=>{noise(0,.28,.22,500);tone(mHz(48),0,.2,'sine',.15,.6)},
 bubble:()=>tone(mHz(R(80,92)),0,.07,'sine',.07,1.8),
 /* Bóng bay */
 pop:()=>{noise(0,.07,.35,1500);tone(mHz(88),0,.05,'square',.15,.5)},
 deflate:()=>tone(mHz(70),0,.4,'sawtooth',.14,.35),
 /* Đua giờ */
 tick:()=>tone(mHz(96),0,.03,'square',.08),
 tock:()=>tone(mHz(89),0,.03,'square',.08),
 timeup:()=>{[0,.2,.4].forEach(t=>tone(mHz(84),t,.12,'square',.2));tone(mHz(72),.6,.4,'square',.2)},
};
/* thay hàm sfx cũ (bản sau thắng) */
function sfx(kind){if(!SND.s)return;try{const A=aud();if(A&&A.ac.state==='suspended')A.ac.resume();(SFX[kind]||SFX.tap)()}catch(e){}}

/* ---------- nhạc nền ---------- */
/* mỗi bài: nhịp (bpm), giai điệu 16 phách (MIDI, 0 = nghỉ), bè trầm 8 nốt, dạng sóng */
const THEMES={
 map:{bpm:92,w:'triangle',v:.055,mel:[72,0,76,79,76,0,74,72,69,0,72,74,76,0,0,0, 72,0,76,79,81,79,76,0,74,0,72,69,72,0,0,0],bass:[48,48,45,45,43,43,48,48],
      drum:0},
 learn:{bpm:84,w:'sine',v:.05,mel:[76,0,79,0,81,79,76,0,74,0,76,0,72,0,0,0],bass:[48,45,41,43],drum:0},
 game:{bpm:120,w:'square',v:.035,mel:[72,76,79,76,81,79,76,74,72,74,76,79,77,76,74,0, 72,76,79,84,83,79,76,74,72,74,76,74,72,0,72,0],bass:[48,48,53,53,55,55,48,48],drum:1},
 boss:{bpm:138,w:'square',v:.035,mel:[69,0,69,72,71,0,69,67,69,0,64,0,65,64,62,64, 69,0,69,72,74,72,71,69,68,0,71,0,69,0,0,0],bass:[45,45,41,41,43,43,40,40],drum:2},
 fish:{bpm:108,w:'triangle',v:.05,mel:[79,0,76,0,79,81,79,0,76,0,74,72,74,0,0,0, 79,0,76,0,79,84,83,0,81,0,79,76,79,0,0,0],bass:[48,43,45,41,48,43,45,43],drum:0,bub:1},
 balloon:{bpm:100,w:'sine',v:.06,mel:[84,0,83,0,81,0,79,0,81,83,84,0,86,0,0,0, 84,0,88,0,86,0,84,0,83,81,79,0,81,0,0,0],bass:[48,52,53,55,48,52,53,43],drum:0},
 race:{bpm:160,w:'square',v:.03,mel:[72,74,76,79,76,74,72,0,74,76,79,81,79,76,74,0],bass:[48,55,53,55],drum:1},
};
let muCur=null,muTimer=null,muStep=0,muNext=0;
function musicTheme(){if(role!=='hs')return null;const k=scr.k;if(k==='mini')return scr.end?null:(scr.mode==='fish'?'fish':'balloon');
  if(k==='game'){if(scr.end||(scr.sheet&&scr.sheet.kind!=='ok'))return null;if(scr.race)return'race';if(scr.tre)return'game';if(scr.cbo||scr.lv===2)return'boss';return'game'}
  if(k==='lslide'||k==='jslide'||k==='video'||k==='jex'||k==='example'||k==='jenny')return null;return'map'}
function musicSync(){const want=SND.m?musicTheme():null;if(want===muCur)return;muCur=want;const A=aud();if(!A)return;
  const t=A.ac.currentTime;A.mu.gain.cancelScheduledValues(t);A.mu.gain.setValueAtTime(A.mu.gain.value,t);A.mu.gain.linearRampToValueAtTime(want?1:0,t+.35);
  if(want&&!muTimer){muNext=A.ac.currentTime+.1;muStep=0;muTimer=setInterval(muTick,60)}if(!want&&muTimer){setTimeout(()=>{if(!muCur&&muTimer){clearInterval(muTimer);muTimer=null}},500)}}
function muTick(){const A=AUD;if(!A||!muCur)return;const T=THEMES[muCur],sp=60/T.bpm/2;while(muNext<A.ac.currentTime+.25){const i=muStep%T.mel.length,at=muNext-A.ac.currentTime;
   const n=T.mel[i];if(n)tone(mHz(n),at,sp*.9,T.w,T.v,0,A.mu);
   if(muStep%4===0){const b=T.bass[Math.floor(muStep/4)%T.bass.length];tone(mHz(b),at,sp*3.6,'triangle',T.v*1.6,0,A.mu)}
   if(T.drum&&muStep%4===2)noise(at,.05,T.v*1.1,4000,A.mu);if(T.drum===2&&muStep%8===0)tone(mHz(36),at,.12,'sine',T.v*3,.5,A.mu);
   if(T.bub&&muStep%6===3&&Math.random()<.5)tone(mHz(R(80,92)),at,.06,'sine',T.v*.7,1.8,A.mu);
   muNext+=sp;muStep++}}
/* trình duyệt chỉ cho phát âm thanh sau lần chạm/bấm đầu tiên */
['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,()=>{const A=aud();if(A&&A.ac.state==='suspended')A.ac.resume();musicSync()},{passive:true}));
document.addEventListener('visibilitychange',()=>{const A=AUD;if(!A)return;if(document.hidden)A.ac.suspend();else A.ac.resume()});

/* ---------- nút bật/tắt: nhạc nền và hiệu ứng ---------- */
function sndCycle(){/* cả hai → chỉ hiệu ứng → tắt hết → cả hai */if(SND.m&&SND.s){SND.m=0}else if(SND.s){SND.s=0}else{SND.m=1;SND.s=1}sndSave();musicSync();sndUI();if(SND.s)sfx('tap');toast(SND.m?'Bật nhạc nền và hiệu ứng':SND.s?'Tắt nhạc nền, giữ hiệu ứng':'Đã tắt âm thanh')}
const sndIcon=()=>SND.m?'🎵':SND.s?'🔉':'🔇';
function sndUI(){const lbl=SND.m?'Nhạc và hiệu ứng đang bật':SND.s?'Chỉ bật hiệu ứng':'Đang tắt âm thanh';
  let b=document.getElementById('sndBtn');const bar=document.querySelector('.appbar .wrap');if(!b&&bar){b=document.createElement('button');b.id='sndBtn';b.type='button';b.className='btn sm sndbtn';b.onclick=sndCycle;bar.appendChild(b)}
  if(b){b.innerHTML=`<span aria-hidden="true">${sndIcon()}</span>`;b.title=lbl;b.setAttribute('aria-label',lbl)}
  const gt=document.querySelector('.game .gtop');if(gt&&!gt.querySelector('.sndmini')){const m=document.createElement('button');m.type='button';m.className='gx sndmini';m.onclick=sndCycle;gt.appendChild(m)}
  document.querySelectorAll('.sndmini').forEach(m=>{m.innerHTML=`<span aria-hidden="true">${sndIcon()}</span>`;m.title=lbl;m.setAttribute('aria-label',lbl)})}

/* ---------- hiệu ứng mất tim ---------- */
function hurtFx(quiet){if(!quiet)sfx('hurt');const h=document.querySelector('.game .hearts, #mgl');if(h){h.classList.remove('hurt');void h.offsetWidth;h.classList.add('hurt')}
  const g=document.querySelector('.game');if(g){g.classList.remove('shake');void g.offsetWidth;g.classList.add('shake');setTimeout(()=>g.classList.remove('shake'),450)}
  try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}}

function toggleMute(){if(SND.m||SND.s){SND.m=0;SND.s=0}else{SND.m=1;SND.s=1}sndSave();musicSync();render()}
/* nhạc nhỏ lại khi Jenny đang nói */
function duck(on){const A=AUD;if(!A||!muCur)return;const t=A.ac.currentTime;A.mu.gain.cancelScheduledValues(t);A.mu.gain.setValueAtTime(A.mu.gain.value,t);A.mu.gain.linearRampToValueAtTime(on?.2:1,t+.25)}
/* gắn vào vẽ màn hình: đổi nhạc theo màn, vẽ nút âm thanh */
{const _r=render;render=function(){const a=_r.apply(this,arguments);try{sndUI();musicSync()}catch(e){}return a}}
