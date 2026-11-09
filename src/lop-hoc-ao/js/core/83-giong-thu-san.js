/* ===================== GIỌNG ĐỌC THU SẴN (Despina, file mp3) ===================== */
/* Luật 5 (24/10/2026): lời cố định (bài giảng, giới thiệu đảo, lời khen/nhắc) phát file mp3 thu sẵn;
   câu có số thay đổi và mọi lỗi mạng → giọng máy như cũ. File ở games/lop-hoc-ao/giong/lop<n>/<id>.mp3,
   id = 12 kí tự đầu SHA-1 của lời đọc sau spoken() (giống tools/giong/gom-loi-doc.js).
   _ma.json trong thư mục = các câu đã thu. Tải khi cần, tải trước slide kế tiếp. */
(function(){
  const GOC='https://vuvanluan1993.github.io/JennyMathClubGame/games/lop-hoc-ao/giong/';
  const DS={};          // lớp → {id:1} các câu đã thu; null = đang tải; false = không có
  let au=null,luot=0;
  const lop=()=>{try{return Math.max(1,Math.min(5,+curG()||1))}catch(e){return 1}};
  function napDS(g){if(DS[g]!==undefined)return;DS[g]=null;
    try{fetch(GOC+'lop'+g+'/_ma.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(j=>{DS[g]=j&&typeof j==='object'?j:false}).catch(()=>{DS[g]=false})}catch(e){DS[g]=false}}
  async function maCua(t){try{const b=await crypto.subtle.digest('SHA-1',new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,12)}catch(e){return null}}
  function dung(){if(au){try{au.pause()}catch(e){}au.onended=au.onerror=null;au=null;try{duck(0)}catch(e){}}}
  window.giongDung=dung;
  /* speechSynthesis.cancel() ở mọi nơi (rời bài giảng, đổi câu…) cũng dừng file đang phát */
  try{const ss=window.speechSynthesis;if(ss&&!ss._jg){const c=ss.cancel.bind(ss);ss.cancel=function(){dung();return c()};ss._jg=1}}catch(e){}
  const tai={};
  async function taiTruoc(text){try{const g=lop(),d=DS[g];if(!d)return;const id=await maCua(spoken(text));if(id&&d[id]&&!tai[g+id]){tai[g+id]=new Audio(GOC+'lop'+g+'/'+id+'.mp3');tai[g+id].preload='auto'}}catch(e){}}
  window.giongTaiTruoc=taiTruoc;
  const _s=sayJ;
  sayJ=function(text){
    try{if((typeof enOn==='function'&&enOn())||muted||!text)return _s.apply(this,arguments)}catch(e){return _s.apply(this,arguments)}
    const g=lop(),d=DS[g];napDS(g);
    if(!d||typeof crypto==='undefined'||!crypto.subtle)return _s.apply(this,arguments);
    const args=arguments,self=this,me=++luot;
    try{speechSynthesis.cancel()}catch(e){}
    maCua(spoken(text)).then(id=>{
      if(me!==luot)return;
      if(!id||!d[id])return _s.apply(self,args);
      dung();const a=tai[g+id]||new Audio(GOC+'lop'+g+'/'+id+'.mp3');delete tai[g+id];au=a;
      let xong=false;const hong=()=>{if(xong||au!==a)return;xong=true;au=null;try{duck(0)}catch(e){}_s.apply(self,args)};
      a.onended=()=>{if(au===a){au=null;try{duck(0)}catch(e){}}};a.onerror=hong;
      try{duck(1)}catch(e){}
      const p=a.play();if(p&&p.catch)p.catch(hong);
      /* màn chơi: tải trước đề câu kế tiếp */
      try{const nx=scr&&scr.qs&&scr.qs[scr.j+1];if(nx&&nx.q)taiTruoc(sayFull(nx.say,nx.q))}catch(e){}
    });
  };
  /* bài giảng: tải trước slide kế tiếp */
  try{const _v=viewLes;viewLes=function(){const r=_v.apply(this,arguments);try{const L=lesOf(isl1(scr.id)),nx=L&&L[scr.i+1];if(nx)taiTruoc(sayFull(nx.say,nx.h))}catch(e){}return r}}catch(e){}
  /* tải sẵn danh sách khi mở app */
  setTimeout(()=>{try{napDS(lop())}catch(e){}},1500);
})();
