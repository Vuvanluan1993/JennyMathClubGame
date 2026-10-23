/* 57 — Thẻ chào gọn (thầy chốt 23/10/2026): bỏ nút "Nghe Jenny", bỏ chữ "Đảo nhà" dưới hình;
   ô sao và ô xu thành cột bên phải, 2 hàng, cạnh "Vịnh … · Lớp n" và "Chào …!"; ô xu chỉ còn "🪙 số ▸" (vẫn bấm mở Cửa hàng). Giữ dòng "Bản …". */
{const _h=viewHome1;viewHome1=function(){let r=_h.apply(this,arguments);try{
 r=r.replace(/<span class="herlbl">[^<]*<\/span>/,'')
  .replace(/<button class="chip g1say"[^>]*>[\s\S]*?<\/button>/,'')
  .replace(/(<button type="button" class="chip ghchip"[^>]*>[\s\S]*?<b>\d+<\/b>)\s*<span>[^<]*<\/span>/,'$1 <i class="hcarr">▸</i>')
  .replace(/<div class="chips">([\s\S]*?)<\/div><\/div>/,'</div><div class="chips herochips">$1</div>')}catch(e){}return r}}
document.head.insertAdjacentHTML('beforeend',`<style>
.hero .herochips{display:flex;flex-direction:column;align-items:stretch;gap:6px;margin:0 0 0 14px;flex:none;align-self:center}.hero:has(.herochips) .grow{flex:0 1 auto}
.hero .herochips .chip{justify-content:center;margin:0;min-width:84px}.hcarr{font-style:normal;opacity:.8}
.hero .grow{min-width:0}.hero:has(.herochips){padding-bottom:24px;flex-wrap:nowrap}@media (max-width:360px){.hero .herochips .chip{min-width:70px;padding-left:6px;padding-right:6px}}
</style>`);
