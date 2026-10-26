/* ===================== Hooks (P-14b, 26/10/2026) ===================== */
/* Thay cho kiểu "đè" hàm bằng gán lại (render=function…) hoặc khai báo function trùng tên ở file sau.
   - File định nghĩa hàm:  function render(...a){return hooks.goi('render',this,a)}  hooks.ham('render',function(){…});
     (khai báo function giữ nguyên tên để hoisting và onclick="render()" như cũ; thân hàm là "bản gốc").
   - File sau đè:          hooks.de('render',function(){…});           — bản mới nhất được gọi
     gọi bản ngay trước:   const cu=hooks.cu('render'); … cu.apply(this,arguments)
   - Mã vai.js chèn cuối trang thay bản gốc (như khai báo function trùng tên thắng từ đầu): hooks.goc('header',function(){…})
   - Đè tạm rồi trả lại: hooks.de(…) … hooks.bo(tên)
   - Hook sự kiện cho mã mới: hooks.on('render:sau',fn) … hooks.run('render:sau')
   Thứ tự đè = thứ tự file trong app.template.html. Xem danh sách: grep -n "hooks.de('" js/core/*.js */
export const hooks={
  _c:{}, _s:{},
  ham(ten,goc){const c=this._c[ten]||(this._c[ten]=[]);c[0]=goc;return function(...a){return hooks.goi(ten,this,a)}},
  goi(ten,ctx,a){const c=this._c[ten];if(!c||!c.length)throw new Error('hooks: chưa có bản nào của '+ten);return c[c.length-1].apply(ctx,a)},
  de(ten,fn){(this._c[ten]||(this._c[ten]=[])).push(fn)},
  cu(ten){const c=this._c[ten],i=c?c.length-1:-1;return function(){const f=hooks._c[ten][i];return f.apply(this,arguments)}},
  goc(ten,fn){const c=this._c[ten]||(this._c[ten]=[]);c[0]=fn},
  bo(ten){this._c[ten].pop()}, /* gỡ bản đè cuối (đè tạm rồi trả lại) */
  on(ten,fn){(this._s[ten]||(this._s[ten]=[])).push(fn)},
  run(ten,...a){for(const f of this._s[ten]||[])f(...a)},
};
