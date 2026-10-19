/* 39n — Tên chủ đề trên bản đồ: cùng một cỡ chữ cho mọi chủ đề; dòng 1 nằm ngay cạnh nhãn "CHỦ ĐỀ n", tên dài xuống dòng 2 */
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
{const _a=g1AfterRender;g1AfterRender=function(){const r=_a.apply(this,arguments);try{if(scr.k==='home'){fitTopicNames();document.fonts&&document.fonts.ready.then(fitTopicNames)}}catch(e){}return r}}
addEventListener('resize',()=>{clearTimeout(fitTopicNames.t);fitTopicNames.t=setTimeout(()=>{try{fitTopicNames()}catch(e){}},120)});
