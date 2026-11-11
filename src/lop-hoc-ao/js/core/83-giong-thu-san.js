/* ===================== GIỌNG ĐỌC THU SẴN (Despina, file mp3) ===================== */
/* Luật 5: lời đã thu phát file mp3; lời chưa thu, lỗi mạng → giọng máy.
   File: games/lop-hoc-ao/giong/lop<n>/<id>.mp3, id = 12 kí tự đầu SHA-1 của lời đọc sau spoken()
   (giống tools/giong/gom-loi-doc.js). Danh sách câu đã thu: _ds.txt (mỗi dòng 1 id), dự phòng _ma.json.
   - Câu không có nguyên câu: tách theo câu (. ! ?) rồi ghép: đoạn nào đã thu phát mp3, đoạn còn lại giọng máy
     (vd. "Cá cắn câu! " + đề, "Em làm lại câu này nhé. " + đề).
   - Không ngắt câu đang nói khi lời mới do app TỰ gọi (hẹn giờ): lời mới chờ câu đang nói xong (tối đa 12 giây).
     Lời mới do em chạm/bấm (hoặc em đã chạm từ khi câu hiện tại bắt đầu) thì ngắt ngay như cũ. Rời màn (speechSynthesis.cancel) → dừng hết.
   - Chờ file quá 2,5 giây chưa phát được → đoạn đó đọc giọng máy.
   - Một thẻ <audio> dùng chung, mở khoá ở lần chạm đầu (iPhone/iPad); tải trước bằng fetch (vào bộ nhớ đệm). */
(function(){
  /* trang chạy trong kho (Pages, máy chủ thử) → tải cùng nguồn, CSP 'self' cho phép (P-08); bản rời → địa chỉ Pages */
  const GOC=(()=>{try{const p=location.pathname,i=p.indexOf('/games/lop-hoc-ao/');if(/^https?:$/.test(location.protocol)&&i>=0)return p.slice(0,i)+'/games/lop-hoc-ao/giong/'}catch(e){}return 'https://vuvanluan1993.github.io/JennyMathClubGame/games/lop-hoc-ao/giong/'})();
  const DS={};          // lớp → Set id đã thu; null = đang tải; false = không có
  const lop=()=>{try{return Math.max(1,Math.min(5,+curG()||1))}catch(e){return 1}};
  const url=(g,id)=>GOC+'lop'+g+'/'+id+'.mp3';
  function napDS(g){if(DS[g]!==undefined)return;DS[g]=null;
    const xong=s=>{DS[g]=s&&s.size?s:false};
    try{fetch(GOC+'lop'+g+'/_ds.txt',{cache:'no-cache'}).then(r=>r.ok?r.text():Promise.reject())
      .then(t=>xong(new Set(t.split(/\s+/).filter(Boolean))))
      .catch(()=>fetch(GOC+'lop'+g+'/_ma.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(j=>xong(new Set(Object.keys(j||{})))).catch(()=>{DS[g]=false}))}catch(e){DS[g]=false}}
  const MA=new Map();
  async function maCua(t){if(MA.has(t))return MA.get(t);try{const b=await crypto.subtle.digest('SHA-1',new TextEncoder().encode(t));const id=[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,12);if(MA.size>3000)MA.clear();MA.set(t,id);return id}catch(e){return null}}
  /* Lập kế hoạch phát: [{id}|{may:text}] — nguyên câu nếu có, không thì ghép theo câu */
  async function keHoach(t,d){
    const id=await maCua(t);if(id&&d.has(id))return[{id}];
    const re=/[^.!?]+[.!?]*/g,P=[];let m;while((m=re.exec(t))){if(m[0].trim())P.push([m.index,m.index+m[0].length])}
    if(P.length<2)return null;
    const out=[];let i=0,co=false;
    while(i<P.length){let j=P.length,hit=null;
      for(;j>i;j--){const c=t.slice(P[i][0],P[j-1][1]).trim(),h=await maCua(c);if(h&&d.has(h)){hit=h;break}}
      if(hit){out.push({id:hit});co=true;i=j}
      else{const c=t.slice(P[i][0],P[i][1]).trim(),L=out[out.length-1];if(L&&L.may!==undefined)L.may+=' '+c;else out.push({may:c});i++}}
    return co?out:null}
  /* ---- phát ---- */
  let AU=null;const au=()=>{if(!AU){AU=new Audio();AU.preload='auto'}return AU};
  const SS=window.speechSynthesis,C0=SS&&SS.cancel?SS.cancel.bind(SS):()=>{};
  let luot=0,dang=false,cho=null,choT=0,lastIn=0,batDau=0;
  ['pointerdown','touchstart','keydown','mousedown'].forEach(e=>{try{addEventListener(e,()=>{lastIn=Date.now();moKhoa()},{capture:true,passive:true})}catch(x){}});
  let moRoi=false;function moKhoa(){if(moRoi)return;moRoi=true;try{const a=au();a.src='data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';const w=a.src,p=a.play();if(p&&p.then)p.then(()=>{try{if(a.src===w)a.pause()}catch(e){}}).catch(()=>{})}catch(e){}}
  function dungHet(){luot++;dang=false;cho=null;try{const a=AU;if(a)a.pause()}catch(e){}try{C0()}catch(e){}try{duck(0)}catch(e){}}
  window.giongDung=dungHet;
  /* speechSynthesis.cancel() ở nơi khác (rời màn, đổi trò…) → dừng hết, bỏ lời đang chờ */
  try{if(SS&&!SS._jg){SS.cancel=function(){dungHet()};SS._jg=1}}catch(e){}
  function noiMay(text,me){return new Promise(res=>{try{if(!SS)return res();C0();if(!v1Voice)v1Voice=pickViVoice();const u=new SpeechSynthesisUtterance(text);u.lang='vi-VN';if(v1Voice)u.voice=v1Voice;u.rate=.9;u.pitch=1;
    let ok=false;const end=()=>{if(ok)return;ok=true;clearInterval(iv);res()};u.onend=u.onerror=end;SS.speak(u);
    const t0=Date.now();const iv=setInterval(()=>{if(me!==luot||(!SS.speaking&&!SS.pending&&Date.now()-t0>400)||Date.now()-t0>30000)end()},200)}catch(e){res()}})}
  function phatFile(g,id,me){return new Promise(res=>{const a=au();let xong=false,bd=false;const u=url(g,id);
    const onP=()=>{bd=true},onE=()=>fin(true),onR=()=>fin(false);
    const fin=ok=>{if(xong)return;xong=true;clearTimeout(tm);clearInterval(iv);a.removeEventListener('playing',onP);a.removeEventListener('ended',onE);a.removeEventListener('error',onR);res(ok)};
    a.addEventListener('playing',onP);a.addEventListener('ended',onE);a.addEventListener('error',onR);
    const tm=setTimeout(()=>{if(!bd&&a.src===u){try{a.pause()}catch(e){}fin(false)}},2500);  // quá 2,5 giây chưa phát → giọng máy
    const iv=setInterval(()=>{
      if(a.src!==u)return fin(true);                                  // thẻ đã sang file khác
      if(me!==luot){try{a.pause()}catch(e){}return fin(true)}         // bị ngắt
      if(bd&&a.paused&&!a.ended)fin(true)},150);                      // bị dừng ở nơi khác
    try{a.src=u;const p=a.play();if(p&&p.catch)p.catch(()=>{if(a.src===u)fin(false)})}catch(e){fin(false)}})}
  async function chay(text,plan,g,me){
    dang=true;try{duck(1)}catch(e){}
    for(const it of plan){if(me!==luot)return;
      if(it.id){const ok=await phatFile(g,it.id,me);if(!ok&&me===luot){const t=[...MA.entries()].find(([k,v])=>v===it.id);if(t)await noiMay(t[0],me)}}
      else await noiMay(it.may,me)}
    if(me!==luot)return;dang=false;try{duck(0)}catch(e){}
    if(cho){const n=cho;cho=null;sayJ(n)}}
  const dangNoi=()=>dang||(SS&&(SS.speaking||SS.pending));
  /* tải trước vào bộ nhớ đệm */
  const tai=new Set();
  async function taiTruoc(text){try{const g=lop(),d=DS[g];if(!d||!text)return;const pl=await keHoach(spoken(text),d);(pl||[]).forEach(it=>{if(it.id&&!tai.has(g+it.id)){tai.add(g+it.id);fetch(url(g,it.id)).catch(()=>{})}})}catch(e){}}
  window.giongTaiTruoc=taiTruoc;
  const _s=sayJ;
  sayJ=function(text){
    try{if((typeof enOn==='function'&&enOn())||muted||!text)return _s.apply(this,arguments)}catch(e){return _s.apply(this,arguments)}
    const g=lop(),d=DS[g];napDS(g);
    /* do em bấm (đang trong sự kiện chạm/bấm, hoặc em đã chạm sau khi câu hiện tại bắt đầu) → ngắt ngay */
    let ev='';try{ev=(window.event&&window.event.type)||''}catch(e){}
    const nguoi=/pointer|touch|mouse|key|click/.test(ev)||lastIn>batDau;
    if(!nguoi&&dangNoi()&&(!choT||Date.now()-choT<12000)){if(!cho)choT=Date.now();cho=text;return}
    choT=0;dungHet();const me=luot;cho=null;batDau=Date.now();
    const t=spoken(text);
    if(!d||typeof crypto==='undefined'||!crypto.subtle){dang=true;noiMay(t,me).then(()=>{if(me===luot){dang=false;if(cho){const n=cho;cho=null;sayJ(n)}}});return}
    dang=true;
    keHoach(t,d).then(pl=>{if(me!==luot)return;chay(t,pl||[{may:t}],g,me);
      try{const nx=scr&&scr.qs&&scr.qs[scr.j+1];if(nx&&nx.q)taiTruoc(sayFull(nx.say,nx.q))}catch(e){}});
  };
  /* bài giảng: tải trước slide kế tiếp */
  try{const _v=viewLes;viewLes=function(){const r=_v.apply(this,arguments);try{const L=lesOf(isl1(scr.id)),nx=L&&L[scr.i+1];if(nx)taiTruoc(sayFull(nx.say,nx.h))}catch(e){}return r}}catch(e){}
  /* vào màn: tải trước đề cả màn (một lần mỗi màn) */
  let mk='';setInterval(()=>{try{if(scr&&scr.qs&&scr.qs.length){const k=scr.id+':'+scr.lv+':'+(scr.t0||'');if(k!==mk){mk=k;scr.qs.forEach(q=>{if(q&&q.q)taiTruoc(sayFull(q.say,q.q))})}}}catch(e){}},1000);
  setTimeout(()=>{try{napDS(lop())}catch(e){}},1500);
})();
