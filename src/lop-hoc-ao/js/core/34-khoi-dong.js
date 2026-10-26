/* ===================== Khởi động ===================== */
/* P-15b: nội dung theo khối tải bằng import() khi biết khối (sau đăng nhập). render() chờ đủ khối của màn đang vẽ;
   trong lúc chờ hiện màn chờ pixel "Jenny đang chuẩn bị bài…". Đổi lớp (lên lớp, chọn em khác, cô vào lớp khác) → tải khối mới, không tải lại trang. */
import { hooks } from './00-hooks.js';
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
   ${loi?`<p class="muted" style="margin:0">${en?'Check the connection, then try again.':'Em kiểm tra mạng rồi bấm thử lại nhé.'}</p><button class="btn pri" type="button" onclick="render()">${en?'Try again':'Thử lại'}</button>`
    :`<div aria-hidden="true" style="display:flex;gap:4px">${mau.map(c=>`<i style="display:block;width:16px;height:16px;background:${c};box-shadow:inset -3px -3px 0 rgba(0,0,0,.25)"></i>`).join('')}</div>`}</div></div>`}
let choVe=null;
function choKhoi(ds){manCho();if(choVe)return;choVe=Promise.all(ds.map(napKhoi)).then(()=>{choVe=null;render()},e=>{choVe=null;console.error(e);manCho(1)})}
hooks.on('render',_r=>function(){const thieu=khoiCan().filter(k=>!khoiXong(k));
  if(thieu.length){if(document.body.classList.contains('locked'))return manCho(); // còn màn đăng nhập: chưa biết khối, không tải
    return choKhoi(thieu)}
  try{return _r.apply(this,arguments)}catch(e){ // lưới an toàn: màn cần khối của học sinh khác trong danh sách
    const them=[...new Set((STUDENTS||[]).map(s=>khoiCua(s[2])))].filter(k=>khoiCo(k)&&!khoiXong(k));if(!them.length)throw e;console.warn('khối: màn này cần thêm',them.join(', '),'·',e&&e.message);choKhoi(them)}});
{const bj=document.querySelector('.brand .jav');if(bj)bj.outerHTML=jenny(40)}
if(!load())fresh();
render();
