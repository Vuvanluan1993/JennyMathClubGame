/* 39n — Tên chủ đề trên bản đồ luôn nằm một dòng: tên dài thì chữ nhỏ lại vừa khung (tối thiểu 12px) */
function fitTopicNames(){document.querySelectorAll('.t1sec .secthead h2').forEach(h=>{h.style.fontSize='';const have=h.clientWidth;if(!have)return;
  const base=parseFloat(getComputedStyle(h).fontSize),c=document.createElement('span');c.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;left:0;top:0';c.textContent=h.textContent;h.appendChild(c);const need=c.getBoundingClientRect().width;c.remove();
  let f=need>have-2?Math.max(12,Math.floor(base*(have-4)/need*10)/10):base;h.style.fontSize=f+'px';
  while(f>12&&h.getBoundingClientRect().height>f*1.6){f=Math.max(12,f-.5);h.style.fontSize=f+'px'}if(f===base)h.style.fontSize=''})}
{const _a=g1AfterRender;g1AfterRender=function(){const r=_a.apply(this,arguments);try{if(scr.k==='home'){fitTopicNames();document.fonts&&document.fonts.ready.then(fitTopicNames)}}catch(e){}return r}}
addEventListener('resize',()=>{clearTimeout(fitTopicNames.t);fitTopicNames.t=setTimeout(()=>{try{fitTopicNames()}catch(e){}},120)});
document.head.insertAdjacentHTML('beforeend','<style>.t1sec .secthead{position:relative}.t1sec .secthead h2{flex:1 1 100%;min-width:0;max-width:100%;line-height:1.1}</style>');
