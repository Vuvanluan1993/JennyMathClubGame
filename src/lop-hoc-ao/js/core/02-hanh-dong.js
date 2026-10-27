/* ===================== Hành động theo data-act (P-14c, 27/10/2026) ===================== */
/* CSP của trang không còn 'unsafe-inline' nên HTML không còn thuộc tính onclick. Thay vào đó:
   - Nút ghi data-act="<id>" (click) hoặc data-act-change / data-act-input / data-act-keydown / data-act-submit / data-act-pointerdown="<id>";
     tham số (nếu có) ở data-arg / data-arg-<sự kiện> = JSON mảng, sinh trong chuỗi template bằng ${hd.arg(x, y)} / ${hd.argEv('change', x)}.
   - Hàm xử lý đăng ký ở cuối file có HTML đó: hd.dangKy({ '<id>': function(event, a){ … } }) — this = phần tử mang data-act, a = mảng tham số
     (y như thuộc tính inline cũ: this, event, hàm toàn cục gọi thẳng). Trả về false → preventDefault.
   - MỘT listener uỷ quyền trên document cho 6 sự kiện: từ phần tử bấm đi lên, gặp data-act của sự kiện đó thì gọi; dừng khi event.stopPropagation().
     Listener đăng ký lúc nạp file này (đầu script) nên chạy trước các listener document của file sau (65, vai.js) — cùng thứ tự với inline cũ.
   Đổi tự động từ thuộc tính onclick: node tools/vite/bo-inline.mjs (xem đầu file đó). Tìm nút: document.querySelector('[data-act="go-island"][data-arg*=\'"dao-1"\']'). */
import { nextDay, resetDemo } from './13-giao-dien-chung.js';
import { toggleUnl } from './30b-may-tieu-hoc.js';
export const hd={
  _b:{},
  /** Đăng ký hàm theo id (trùng id với hàm khác → lỗi ngay lúc nạp để không có hai nút cùng id mà khác việc). */
  dangKy(b){for(const k in b){if(this._b[k]&&this._b[k]!==b[k])throw new Error('hd: trùng id hành động '+k);this._b[k]=b[k]}},
  /** data-arg="…" cho click. */
  arg(...a){return 'data-arg="'+hd.jsonAttr(a)+'"'},
  /** data-arg-<sự kiện>="…" cho change/input/keydown/submit/pointerdown. */
  argEv(ev,...a){return 'data-arg-'+ev+'="'+hd.jsonAttr(a)+'"'},
  /** data-act="<id>" + data-arg (nếu có tham số): dùng khi hành động được chọn bằng mã (bảng OPT, danh sách bước, nút ở hàm dùng chung). */
  attr(id,...a){return 'data-act="'+id+'"'+(a.length?' '+hd.arg(...a):'')},
  jsonAttr(a){return JSON.stringify(a).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')},
  /** Gọi hàm của một phần tử như khi sự kiện tới (dùng trong mã/bộ kiểm tra): hd.goi(el) = click, hd.goi(el,'change'). */
  goi(el,ev='click',e={type:ev,target:el,preventDefault(){},stopPropagation(){}}){const h=hd.hau(ev),id=el.dataset['act'+h];const f=this._b[id];if(!f)throw new Error('hd: chưa đăng ký hành động '+id);return f.call(el,e,hd.thamSo(el,h,id))},
  hau(ev){return ev==='click'?'':ev[0].toUpperCase()+ev.slice(1)},
  thamSo(el,h,id){const s=el.dataset['arg'+h];if(!s)return [];try{return JSON.parse(s)}catch(e){console.error('hd: data-arg hỏng',id,s);return []}},
};
function hdChay(e){
  const h=hd.hau(e.type),kA='act'+h;
  for(let el=e.target;el&&el.nodeType===1;el=el.parentElement){
    const id=el.dataset?el.dataset[kA]:undefined;
    if(id!==undefined){const f=hd._b[id];if(!f)console.error('hd: chưa đăng ký hành động '+id,el);else if(f.call(el,e,hd.thamSo(el,h,id))===false)e.preventDefault()}
    if(e.cancelBubble)return;
  }
}
for(const t of ['click','input','change','keydown','submit','pointerdown'])document.addEventListener(t,hdChay);

/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */
hd.dangKy({
  'toggleUnl':function(){toggleUnl()},
  'nextDay':function(){nextDay()},
  'resetDemo':function(){resetDemo()},
});
