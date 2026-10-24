/* ===================== Bấm logo ở thanh trên → về trang chủ (thầy yêu cầu 24/10/2026) =====================
   Học sinh: về Bản đồ. Giáo viên/phụ huynh/quản lý: về màn đầu của vai đó. Đang chơi dở thì hỏi trước khi thoát. */
function veTrangChu(){try{const g=scr;const dangChoi=g&&(g.k==='game'||g.k==='xg'||g.k==='mini')&&!g.end;
  if(dangChoi&&!confirm(LANG==='en'?'Leave this game and go to the home page?':'Thoát màn đang chơi và về trang chủ?'))return;
  if(role!=='hs'){try{gvLop=null}catch(e){}}go({k:'home'})}catch(e){}}
document.addEventListener('click',e=>{const b=e.target.closest('.appbar .brand');if(!b||e.target.closest('button,a,select,input'))return;e.preventDefault();veTrangChu()});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest('.appbar .brand')){e.preventDefault();veTrangChu()}});
{const _r=render;render=function(){const r=_r.apply(this,arguments);try{const b=document.querySelector('.appbar .brand');if(b&&!b.dataset.home){b.dataset.home=1;b.setAttribute('role','link');b.tabIndex=0;b.title=LANG==='en'?'Home':'Về trang chủ';b.style.cursor='pointer'}}catch(e){}return r}}
