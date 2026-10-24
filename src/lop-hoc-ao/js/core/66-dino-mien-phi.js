/* ===================== Khủng long chạy: miễn phí từ đầu (thầy chốt 24/10/2026) =====================
   Em nào cũng có sẵn trò Khủng long chạy, không cần mua, không tốn lượt chơi (vé).
   Riêng trò này tối đa 30 ván/ngày (đếm ngầm, không hiện cho em), không trừ vào 10 lượt/ngày của các trò mua. */
const DINO_DAY=30; /* thầy đổi 24/10: 30 ván/ngày, không hiện số ván đã chơi */
function dinoLeft(a){const d=new Date().toISOString().slice(0,10);if(a.dDay!==d){a.dDay=d;a.dUsed=0}return DINO_DAY-(a.dUsed||0)}
{const _s=arcSt;arcSt=function(st){const a=_s.apply(this,arguments);if(!a.own.dino)a.own.dino=1;return a}}
{const _p=arcPlay;arcPlay=function(k,again){if(k!=='dino')return _p.apply(this,arguments);const st=S.st[sid],a=arcSt(st);
  if(dinoLeft(a)<=0){toast(arcT('Hôm nay em đã chơi nhiều lần, hẹn em ngày mai nhé!',"You've played a lot today. See you tomorrow!"));if(again)go({k:'home',tab:'shop'});return}
  a.plays++;a.used--;const r=_p.apply(this,arguments);if(scr&&scr.k==='arc'&&scr.g==='dino'){a.dUsed=(a.dUsed||0)+1;save()}else{a.plays--;a.used++}return r}}
{const _a=arcShop;arcShop=function(st){let h=_a.apply(this,arguments);try{const a=arcSt(st),en=arcEN(),left=dinoLeft(a);
  h=h.replace(/class="gobtn[^"]*" onclick="arcPlay\('dino'\)"/,`class="gobtn ${left>0?'':'off'}" onclick="arcPlay('dino')"`);
  h=h.replace(/(<b>(Khủng long chạy|Dino Run)<\/b>)/,`$1 <i class="arcfree">${en?'Free':'Miễn phí'}</i><small class="arcbest">${en?'Free, no plays used':'Miễn phí, không tốn lượt'}</small>`);h=h.replace(/(<p class="arcnote">[^<]*)<\/p>/,`$1 ${en?'Dino Run is free.':'Riêng Khủng long chạy miễn phí.'}</p>`)}catch(e){}return h}}
document.head.insertAdjacentHTML('beforeend',`<style>.arcfree{display:inline-block;font-style:normal;font-size:12px;font-weight:700;background:var(--leaf,#2E9E5B);color:#fff;padding:1px 6px;margin-left:4px;vertical-align:middle}</style>`);
/* Nhà em › Trò chơi: nút Khủng long không phụ thuộc lượt chơi */
{const _h=arcHome;arcHome=function(st){let h=_h.apply(this,arguments);try{const left=dinoLeft(arcSt(st));h=h.replace(/class="gobtn[^"]*"( onclick="arcPlay\('dino'\)")/,`class="gobtn ${left>0?'':'off'}"$1`)}catch(e){}return h}}
