/* 39n — Tên chủ đề trên bản đồ: cùng một cỡ chữ cho mọi chủ đề; dòng 1 nằm ngay cạnh nhãn "CHỦ ĐỀ n", tên dài xuống dòng 2 */
import { hooks } from './00-hooks.js';
import { spr } from './22-do-hoa-pixel-mau-logo-clb.js';
document.head.insertAdjacentHTML('beforeend',`<style>
.t1sec .secthead{display:block!important}
.t1sec .secthead .tno{display:inline-block;vertical-align:.18em;margin-right:8px}
.t1sec .secthead h2{display:inline;font-size:var(--t1h,24px);line-height:1.15}
.t1sec .secthead .grow{display:none}
.t1sec .secthead>.muted,.t1sec .secthead>.pill{display:block;width:max-content;margin:2px 0 0 auto}
</style>`);
/* tên quá dài (hơn 2 dòng) thì riêng tên đó nhỏ bớt vừa đủ 2 dòng */
function fitTopicNames(){document.querySelectorAll('.t1sec .secthead h2').forEach(h=>{h.style.fontSize='';const lines=()=>new Set([...h.getClientRects()].map(r=>Math.round(r.top))).size;
  let f=parseFloat(getComputedStyle(h).fontSize);while(lines()>2&&f>16){f-=1;h.style.fontSize=f+'px'}})}
{const _a=hooks.cu('g1AfterRender');hooks.de('g1AfterRender',function(){const r=_a.apply(this,arguments);try{if(scr.k==='home'){moveTopicStars();fitTopicNames();document.fonts&&document.fonts.ready.then(fitTopicNames)}}catch(e){}return r})}
addEventListener('resize',()=>{clearTimeout(fitTopicNames.t);fitTopicNames.t=setTimeout(()=>{try{fitTopicNames()}catch(e){}},120)});

/* dòng 2: [vùng biển] [★ sao]; dòng 3: Bài … · … đảo · trùm … (đủ sao thì nhãn sao xanh lá) */
function moveTopicStars(){document.querySelectorAll('.t1sec').forEach(sec=>{const m=sec.querySelector('.secthead>.muted'),info=sec.querySelector('.secthead+p');if(!m||!info||info.querySelector('.t1star'))return;
  const t=m.textContent.match(/(\d+)\s*\/\s*(\d+)/);if(!t)return;const a=+t[1],b=+t[2];
  const chip=`<span class="t1star${a>=b&&b?' full':''}" aria-label="${a} trên ${b} sao">${spr('star',14)}<b>${a}/${b}</b></span>`,tag=info.querySelector('.bmtag');
  if(tag){tag.insertAdjacentHTML('afterend',chip);const rest=document.createElement('span');rest.className='t1meta';let n=info.querySelector('.t1star').nextSibling;while(n){const nx=n.nextSibling;rest.appendChild(n);n=nx}info.appendChild(rest)}else info.insertAdjacentHTML('afterbegin',chip);m.remove()})}
document.head.insertAdjacentHTML('beforeend',`<style>
.t1meta{display:block;margin-top:4px}.t1sec .bmtag{vertical-align:1px}
.t1star{display:inline-flex;align-items:center;gap:3px;margin-right:6px;padding:1px 7px 1px 5px;background:#FFF4D6;border:2px solid #1F2A5A;box-shadow:2px 2px 0 #1F2A5A;vertical-align:1px;line-height:1}
.t1star b{font-family:var(--f-display);font-size:18px;font-weight:400;color:#7A4E00}
.t1star.full{background:#E3F7EA}.t1star.full b{color:#1E9A52}
</style>`);
