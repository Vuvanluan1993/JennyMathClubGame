/* ===================== NHÃN DÀI TRONG TRÒ CHƠI: không che đối tượng ===================== */
/* Nhãn (số, phép tính, tên đồ vật) trên cá, bóng bay, ngôi sao, biển chuột, lá súng, toa tàu… được xếp loại theo độ dài:
   l2 (6–9 kí tự): chữ nhỏ lại; l3 (từ 10 kí tự, hoặc tên đồ vật nhiều chữ): xuống 2 dòng, chữ nhỏ, đặt thành thẻ tên
   bên dưới (cá, sao) để hình vẫn hiện rõ; vật mang nhãn dài to hơn một chút. */
const LBL_SEL='.mgt,.xmsign,.xfpad b,.xtw b,.xstag';
function lblMark(el){if(!el||!el.classList)return;const t=(el.textContent||'').replace(/\s+/g,' ').trim(),n=t.length,words=t.split(' ').length;
  const word=/[a-zà-ỹđ]{2,}/i.test(t.replace(/\b(cm|dm|mm|km|kg|g|m|l|ml|giờ|phút|đồng)\b/gi,''));const cls=n>=10||(word&&n>=5)?'l3':n>=6?'l2':'';el.classList.remove('l2','l3');if(cls)el.classList.add(cls);
  const host=el.closest('.mgi,.xgsi,.xmm,.xfpad,.xtw');if(host){host.classList.remove('hl2','hl3');if(cls)host.classList.add('h'+cls)}}
(function(){const scan=root=>{if(!root||!root.querySelectorAll)return;if(root.matches&&root.matches(LBL_SEL))lblMark(root);root.querySelectorAll(LBL_SEL).forEach(lblMark)};
  const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData'){lblMark(m.target.parentElement&&m.target.parentElement.closest(LBL_SEL))}else{m.addedNodes.forEach(n=>{if(n.nodeType===1){scan(n);const c=n.closest&&n.closest(LBL_SEL);if(c)lblMark(c)}});if(m.target&&m.target.matches&&m.target.matches(LBL_SEL))lblMark(m.target)}}});
  const go=()=>{try{mo.observe(document.body,{childList:true,subtree:true,characterData:true});scan(document.body)}catch(e){}};if(document.body)go();else addEventListener('DOMContentLoaded',go)})();
(function(){const st=document.createElement('style');st.textContent=`
.mgt.l2,.xmsign.l2,.xfpad b.l2,.xtw b.l2{font-size:19px!important}
.mgt.l3,.xmsign.l3,.xfpad b.l3,.xtw b.l3{font-size:15px!important;line-height:1.05!important;white-space:normal!important;text-align:center;overflow-wrap:anywhere}
/* cá: nhãn dài thành thẻ tên dưới bụng cá, cá to hơn */
.fishi.hl3{width:110px;height:56px}
.fishi.hl3 .mgsp{width:110px!important;height:auto!important}
.fishi.hl3 .mgt{top:auto!important;bottom:-24px;transform:translate(-50%,0)!important;max-width:120px;width:max-content;padding:2px 5px!important}
.fishi.hl2 .mgt{padding:2px 4px!important}
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
`;document.head.appendChild(st)})();
