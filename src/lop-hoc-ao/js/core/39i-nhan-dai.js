/* ===================== NHÃN DÀI TRONG TRÒ CHƠI: không che đối tượng ===================== */
/* Nhãn (số, phép tính, tên đồ vật) trên cá, bóng bay, ngôi sao, biển chuột, lá súng, toa tàu… được xếp loại theo độ dài:
   l2 (6–9 kí tự): chữ nhỏ lại; l3 (từ 10 kí tự, hoặc tên đồ vật nhiều chữ): xuống 2 dòng, chữ nhỏ, đặt thành thẻ tên
   bên dưới (cá, sao) để hình vẫn hiện rõ; vật mang nhãn dài to hơn một chút. */
const LBL_SEL='.mgt,.xmsign,.xfpad b,.xtw b,.xstag';
function lblMark(el){if(!el||!el.classList)return;const t=(el.textContent||'').replace(/\s+/g,' ').trim(),n=t.length,words=t.split(' ').length;
  const word=/[a-zà-ỹđ]{2,}/i.test(t.replace(/\b(cm|dm|mm|km|kg|g|m|l|ml|giờ|phút|đồng)\b/gi,''));const cls=word&&n>=5?'l3':n>=10?'l4':n>=6?'l2':'';el.classList.remove('l2','l3','l4');if(cls)el.classList.add(cls);
  const host=el.closest('.mgi,.xgsi,.xmm,.xfpad,.xtw');if(host){host.classList.remove('hl2','hl3','hl4');if(cls)host.classList.add('h'+cls)}
  /* nhãn phép tính: thu nhỏ chữ cho vừa một dòng trong khung vật (chuột 92px, bóng 74px, cá/sao/lá súng ~104px) */
  el.style.fontSize='';if(cls==='l3'||!host)return;const lim=host.matches('.xmm')?90:host.matches('.balloi')?72:host.matches('.xtw')?Math.max(40,host.clientWidth-6):104;
  const tw=()=>{const r=document.createRange();r.selectNodeContents(el);return r.getBoundingClientRect().width};let fs=parseFloat(getComputedStyle(el).fontSize)||20,k=0;const minF=host.matches('.balloi')?12:11;while(tw()>lim&&fs>minF&&k++<14){fs-=1;el.style.setProperty('font-size',fs+'px','important')}
  /* vẫn chưa vừa: xuống 2 dòng gọn gàng tại dấu phép tính, số không bị tách */
  if(tw()>lim&&!el.dataset.br&&!el.querySelector('.frac,svg,img')){const t=el.textContent.trim(),m=t.match(/^(.*?\S)\s+([+−\-×:=<>])\s+(.*)$/);if(m){el.dataset.br=1;el.innerHTML=`${m[1].replace(/ /g,'&nbsp;')}<br>${m[2]}&nbsp;${m[3].replace(/ /g,'&nbsp;')}`;el.style.whiteSpace='normal';el.style.lineHeight='1.05';el.classList.add('l5')}}}
(function(){const scan=root=>{if(!root||!root.querySelectorAll)return;if(root.matches&&root.matches(LBL_SEL))lblMark(root);root.querySelectorAll(LBL_SEL).forEach(lblMark)};
  const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData'){lblMark(m.target.parentElement&&m.target.parentElement.closest(LBL_SEL))}else{m.addedNodes.forEach(n=>{if(n.nodeType===1){scan(n);const c=n.closest&&n.closest(LBL_SEL);if(c)lblMark(c)}});if(m.target&&m.target.matches&&m.target.matches(LBL_SEL))lblMark(m.target)}}});
  const go=()=>{try{mo.observe(document.body,{childList:true,subtree:true,characterData:true});scan(document.body)}catch(e){}};if(document.body)go();else addEventListener('DOMContentLoaded',go)})();
(function(){const st=document.createElement('style');st.textContent=`
.mgt.l2,.xmsign.l2,.xfpad b.l2,.xtw b.l2{font-size:19px!important}
.mgt.l3,.xmsign.l3,.xfpad b.l3,.xtw b.l3{font-size:15px!important;line-height:1.05!important;white-space:normal!important;text-align:center;overflow-wrap:anywhere}
/* cá: nhãn dài thành thẻ tên dưới bụng cá, cá to hơn */
/* bóng bay: nhãn dài trong lòng bóng, 2 dòng */
.balloi.hl3 .mgt{max-width:72px;top:30%!important}
.balloi.hl2 .mgt{max-width:76px;font-size:17px!important}
.balloi.hl3 .mgt{font-size:14px!important;width:68px}
/* sao: thẻ tên dưới sao */
.xgsi.hl3 .mgt{max-width:118px;width:max-content;display:block;margin:-6px auto 0!important;white-space:nowrap!important}
.xgsi.hl3 .mgt.l3{white-space:normal!important}
/* biển chuột, lá súng, toa tàu */
.xmsign.l3{max-width:112px!important;padding:1px 3px!important;font-size:14px!important}
.xfpad b.l3{max-width:86px;padding:1px 3px!important}
/* phép tính dài (không có chữ): giữ một dòng, chữ nhỏ lại, khung rộng ra */
.mgt.l2,.mgt.l4,.xmsign.l2,.xmsign.l4,.xfpad b.l2,.xfpad b.l4,.xtw b.l2,.xtw b.l4,.xstag.l4{white-space:nowrap!important}
.mgt.l4,.xmsign.l4,.xfpad b.l4,.xtw b.l4{font-size:16px!important;letter-spacing:-.3px}
.xmsign.l4{max-width:none!important;padding:1px 4px!important}
.balloi.hl4 .mgt{font-size:14px!important;padding:2px 2px 0!important}
.xgsi.hl4 .mgt{font-size:17px!important}
`;document.head.appendChild(st)})();

/* ===================== CÁ PIXEL BƠI (2 khung hình vẫy đuôi) ===================== */
{const BODY=["...kkkk.....",".kkBBBBkk...","kBBBBBBBBk..","kBBBBBBwwBk.","BBBBBBBwkBBk","bbbbbbbbbbbk","kbbbbbbbbbk.","kkbbbbbbkk..",".kkkkkkk...."];
 const TA=["....","....","kk..","kBk.","kBBB","kBBb","kBk.","kk..","...."],TB=["....","....","....","kk..","kBBB","kBBb","kBBk","kBk.","kk.."];
 const FIN=[["",""],["",""],["",""],["",""],["",""],["",""],["",""],["",""],["",""]];
 const COL=[['o','y'],['b','x'],['c','s'],['G','l'],['p','e'],['a','t']];
 COL.forEach(([B,b],i)=>['A','B'].forEach(f=>{const T=f==='A'?TA:TB;PXS[`fsh${f}${i}`]=BODY.map((r,j)=>(T[j]+r).replace(/B/g,B).replace(/b/g,b))}));}
for(let i=0;i<6;i++)PXS['fshS'+i]=PXS['fshA'+i].map((r,j)=>r+PXS['fshB'+i][j]);
/* một tấm ảnh 2 khung, đổi khung bằng dịch nền theo bước: không nhấp nháy */
function fishFrames(n){const i=n%6,d=pxURI('fshS'+i);return`<span class="fswim"><span class="fsheet" style="background-image:url(&quot;${d.u}&quot;)"></span></span>`}
(function(){const st=document.createElement('style');st.textContent=`
.fishi{width:96px!important;height:auto!important;display:flex!important;flex-direction:column;align-items:center}
.fishi .fswim{position:relative;display:block;width:71px;height:40px;animation:fbob 1s steps(2) infinite}
.fishi .fsheet{display:block;width:71px;height:40px;background-repeat:no-repeat;background-size:142px 40px;image-rendering:pixelated;image-rendering:crisp-edges;animation:fflap .4s steps(2) infinite}
.fishi:nth-child(2n) .fsheet{animation-duration:.5s}
@keyframes fflap{from{background-position:0 0}to{background-position:-142px 0}}
@keyframes fbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
.fishi .mgt{position:static!important;transform:none!important;margin-top:2px;max-width:120px;box-shadow:0 0 0 2px #1F2A5A!important;background:#FFFFFF!important}
.fishi::after{left:-4px;top:8px}
.mgt.l5{font-size:15px!important}
.mgi.pop .fsheet,.mgi.wrong .fsheet{animation:none;filter:grayscale(1)}
.mgi.pop .fsheet{filter:none}
`;document.head.appendChild(st)})();
