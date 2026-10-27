/* Script nhỏ đầu trang (P-14c, 27/10/2026): trước đây là 3 đoạn <script> inline trong <head> của app.template.html.
   CSP không còn 'unsafe-inline' nên gom vào file này, tải ĐỒNG BỘ (<script src>, không type=module, không defer) ngay trước CSS:
   trang vai → assets/dau-trang-[hash].js (tools/vite/noi-file.js); bản một file (lop-hoc-ao-jenny.html, npm run dev) nối thẳng vào <script>.
   Không import/export: file chạy trước mọi thứ, không dùng tên của js/core. */
/* 1. thầy chốt 24/10/2026: luôn nền sáng, không theo chế độ tối của máy — phải đặt TRƯỚC CSS để không nháy */
document.documentElement.setAttribute('data-theme','light');
/* 2. Chữ tự host (P-08): assets/fonts/fonts.css ở gốc kho. Trang được dựng ra nhiều độ sâu (games/lop-hoc-ao/, …/quan-ly/, …/demo/…, src/lop-hoc-ao/dist/)
   nên tính đường dẫn gốc từ URL. */
(function(){var p=location.pathname,i=p.search(/\/(games|src)\/lop-hoc-ao\//),l=document.createElement('link');l.rel='stylesheet';l.href=(i<0?'..':p.slice(0,i))+'/assets/fonts/fonts.css';document.head.appendChild(l)})();
/* 3. Điện thoại đang bật "Trang web cho máy tính": trang bị dàn rộng ~980px nên chữ rất bé. Phóng lại cho vừa bề ngang thật của máy. */
(function(){function fit(){try{var d=document.documentElement,L=matchMedia('(orientation:landscape)').matches,sw=L?Math.max(screen.width,screen.height):Math.min(screen.width,screen.height),coarse=matchMedia('(pointer:coarse)').matches;d.style.zoom='';var iw=window.innerWidth;if(coarse&&sw&&Math.min(screen.width,screen.height)<700&&iw>sw*1.25){d.style.zoom=(iw/sw).toFixed(3)}}catch(e){}}fit();addEventListener('orientationchange',function(){setTimeout(fit,300)})})();
