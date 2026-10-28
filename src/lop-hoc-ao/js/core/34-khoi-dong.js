/* ===================== Khởi động ===================== */
/* P-15b: nội dung theo khối tải bằng import() khi biết khối (sau đăng nhập). render() chờ đủ khối của màn đang vẽ;
   trong lúc chờ hiện màn chờ pixel "Jenny đang chuẩn bị bài…". Đổi lớp (lên lớp, chọn em khác, cô vào lớp khác) → tải khối mới, không tải lại trang. */
import { hooks } from './00-hooks.js';
import { hd } from './02-hanh-dong.js';
import { khoiCo, khoiCua, khoiXong, napKhoi } from './30a-dang-ky-khoi.js';
import { fresh, load, ORG_ON } from './09-du-lieu-demo.js';
import { render } from './13-giao-dien-chung.js';
import { jenny } from './33d-jenny-bieu-cam.js';
const khoiCan=()=>{const st=S&&S.st&&S.st[sid],K=new Set(),moi=()=>(STUDENTS||[]).forEach(s=>K.add(khoiCua(s[2])));
  try{if(role==='hs'){if(st)K.add(khoiCua(st.grade))}
    else{orgHeal();
      if(ORG_ON&&S.org&&!S.org.mauHS7)moi(); // bản thử mở lần đầu: core/59 gvMau tạo dữ liệu mẫu cho mọi em (máy chủ thật luôn có cờ mauHS7)
      else if(role==='ph'){if(st)K.add(khoiCua(st.grade))} // phụ huynh: khối của con đang xem
      else{const id=role==='ql'?(qlTrang==='lopct'&&qlLopId):gvLop,l=id?lopById(id):null; // cô / quản lý đang xem một lớp: khối của lớp đó
        const ds=!l&&role==='gv'&&typeof lopCuaToi==='function'?lopCuaToi():[]; // cô chưa vào lớp: khối các lớp của cô (thẻ lớp tính cảnh báo từng em)
        if(l)K.add(khoiCua(l.khoi));else if(ds.length)ds.forEach(x=>K.add(khoiCua(x.khoi)));else moi()}}} // trang quản lý: các khối có học sinh
  catch(e){moi()}
  return[...K].filter(khoiCo)};
function manCho(loi){const a=document.getElementById('app');if(!a)return;const en=LANG==='en',mau=['#F04E23','#F58220','#28B568','#00B8EC','#8C5DA7'];
  a.innerHTML=`<div class="page"><div class="card" role="status" aria-live="polite" style="max-width:420px;margin:24px auto;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px">${jenny(64)}
   <h2 style="margin:0">${loi?(en?'The network is slow':'Mạng chậm quá'):(en?'Jenny is getting your lessons ready…':'Jenny đang chuẩn bị bài…')}</h2>
   ${loi?`<p class="muted" style="margin:0">${en?'Check the connection, then try again.':'Em kiểm tra mạng rồi bấm thử lại nhé.'}</p><button class="btn pri" type="button" data-act="render">${en?'Try again':'Thử lại'}</button>`
    :`<div aria-hidden="true" style="display:flex;gap:4px">${mau.map(c=>`<i style="display:block;width:16px;height:16px;background:${c};box-shadow:inset -3px -3px 0 rgba(0,0,0,.25)"></i>`).join('')}</div>`}</div></div>`}
let choVe=null;
function choKhoi(ds){manCho();if(choVe)return;choVe=Promise.all(ds.map(napKhoi)).then(()=>{choVe=null;render()},e=>{choVe=null;console.error(e);manCho(1)})}
hooks.on('render',_r=>function(){const thieu=khoiCan().filter(k=>!khoiXong(k));
  if(thieu.length){if(document.body.classList.contains('locked'))return manCho(); // còn màn đăng nhập: chưa biết khối, không tải
    return choKhoi(thieu)}
  try{return _r.apply(this,arguments)}catch(e){ // lưới an toàn: màn cần khối của học sinh khác trong danh sách
    const them=[...new Set((STUDENTS||[]).map(s=>khoiCua(s[2])))].filter(k=>khoiCo(k)&&!khoiXong(k));if(!them.length)throw e;console.warn('khối: màn này cần thêm',them.join(', '),'·',e&&e.message);choKhoi(them)}});
/* ===================== P-16 (27/10/2026): PWA =====================
   sw.js do vite-plugin-pwa sinh lúc dựng (Workbox, registerType prompt: bản mới chờ, không tự thay). Chỉ trang có manifest (bản học sinh) đăng ký;
   trang cô/phụ huynh/quản lý/bản thử luôn lấy mạng (navigateFallbackDenylist trong vite.config.js). Không chạy ở file:// và bản một file.
   Có bản mới (worker mới đã cài, đang chờ): KHÔNG hiện thanh "Có bản mới · Tải lại" nữa (bỏ 28/10/2026, thầy chốt: thanh che nội dung, kể cả lúc em đang làm bài).
   Worker mới chỉ vào khi trang đóng (pagehide → SKIP_WAITING; hoặc mọi tab đã đóng, như Workbox mặc định) → lần mở sau là bản mới, không tải lại giữa chừng.
   Thiết bị đang mở biết bản mới trong 1 phút: reg.update() mỗi 60 giây và khi quay lại tab. */
let swMoi=null;/* worker mới đã cài, đang chờ */
/* Khối đã tải lúc SW chưa điều khiển trang (lần mở đầu, hoặc vừa đổi SW) → nạp lại qua SW để vào cache CacheFirst (assets/lop-*). Gọi khi SW sẵn sàng, khi SW nhận điều khiển, sau mỗi khối tải xong. */
function swNong(){try{if(!navigator.serviceWorker.controller)return;const e=document.getElementById('khoi-url'),U=e?JSON.parse(e.textContent):{};
  Object.keys(U).filter(khoiXong).forEach(k=>fetch(new URL(U[k],document.baseURI)).catch(()=>{}))}catch(e){}}
function swDangKy(){if(!('serviceWorker' in navigator)||!/^https?:$/.test(location.protocol)||!document.querySelector('link[rel="manifest"]'))return;
  navigator.serviceWorker.addEventListener('controllerchange',swNong);window.addEventListener('pagehide',()=>{if(swMoi)swMoi.postMessage({type:'SKIP_WAITING'})});hooks.khi('khoi:sau',swNong);
  navigator.serviceWorker.register('sw.js').then(reg=>{const moi=()=>{if(reg.waiting&&navigator.serviceWorker.controller)swMoi=reg.waiting};moi();
    reg.addEventListener('updatefound',()=>{const w=reg.installing;if(w)w.addEventListener('statechange',()=>{if(w.state==='installed')moi()})});
    navigator.serviceWorker.ready.then(swNong);const kiem=()=>{if(navigator.onLine)reg.update().catch(()=>{})};setInterval(kiem,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)kiem()})}).catch(e=>console.info('Service worker chưa đăng ký được:',e))}
swDangKy();
{const bj=document.querySelector('.brand .jav');if(bj)bj.outerHTML=jenny(40)}

/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */
hd.dangKy({
  'render':function(){render()},
});
if(!load())fresh();
render();
