/* ===================== Hooks (P-14b, 26/10/2026) ===================== */
/* Thay cho kiểu "đè" hàm bằng gán lại (render=function…) hoặc khai báo function trùng tên ở file sau.
   - File định nghĩa hàm:  function render(...a){return hooks.goi('render',this,a)}  hooks.ham('render',function(){…});
     (khai báo function giữ nguyên tên để hoisting và onclick="render()" như cũ; thân hàm là "bản gốc").
   - File sau đè (cách chính): hooks.on('render',cu=>function(){ …cu.apply(this,arguments)… });  — cu = bản ngay trước, bản mới nhất được gọi
     thay hẳn, không cần bản trước: hooks.de('render',function(){…}); lấy bản trước ở chỗ khác: const cu=hooks.cu('render')
   - Mã vai.js chèn cuối trang thay bản gốc (như khai báo function trùng tên thắng từ đầu): hooks.goc('header',function(){…})
   - Đè tạm rồi trả lại: hooks.de(…) … hooks.bo(tên)
   - Hook sự kiện cho mã mới: hooks.khi('render:sau',fn) … hooks.run('render:sau')
   Thứ tự đè = thứ tự file trong app.template.html. Xem danh sách: grep -nE "hooks.(on|de)\('" js/core/*.js */
export const hooks={
  _c:{}, _s:{},
  ham(ten,goc){const c=this._c[ten]||(this._c[ten]=[]);c[0]=goc;return function(...a){return hooks.goi(ten,this,a)}},
  goi(ten,ctx,a){const c=this._c[ten];if(!c||!c.length)throw new Error('hooks: chưa có bản nào của '+ten);return c[c.length-1].apply(ctx,a)},
  de(ten,fn){(this._c[ten]||(this._c[ten]=[])).push(fn)},
  on(ten,boc){this.de(ten,boc(this.cu(ten)))}, /* đè có bản trước: boc(cu) trả hàm mới */
  cu(ten){const c=this._c[ten],i=c?c.length-1:-1;return function(){const f=hooks._c[ten][i];return f.apply(this,arguments)}},
  goc(ten,fn){const c=this._c[ten]||(this._c[ten]=[]);c[0]=fn},
  bo(ten){this._c[ten].pop()}, /* gỡ bản đè cuối (đè tạm rồi trả lại) */
  khi(ten,fn){(this._s[ten]||(this._s[ten]=[])).push(fn)},
  run(ten,...a){for(const f of this._s[ten]||[])f(...a)},
};
