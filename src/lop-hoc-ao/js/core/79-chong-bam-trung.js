/* 79 — Chống bấm nhiều lần khi lưu/tạo (24/10/2026): đang lưu thì khoá nút, bấm thêm không tạo trùng.
   Tạo học sinh trùng họ tên + ngày sinh với em đã có → hỏi lại trước khi tạo. */
(function(){
if(typeof viewPH==='undefined')return;
const khoa=(ten)=>{const f=window[ten];if(typeof f!=='function'||f._khoa)return;let busy=false;
 const g=async function(){if(busy){return}busy=true;const bt=[...document.querySelectorAll('#qlm button[type=submit],#qlsua button[type=submit],#qlnhap .btn.pri')];const cu=bt.map(b=>[b,b.disabled,b.innerHTML]);
  bt.forEach(b=>{b.disabled=true;if(b.type==='submit')b.innerHTML='Đang lưu…'});
  try{return await f.apply(this,arguments)}finally{busy=false;cu.forEach(([b,d,h])=>{if(document.body.contains(b)){b.disabled=d;b.innerHTML=h}})}};
 g._khoa=1;window[ten]=g};
const bo=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/\s+/g,' ').trim();
const val=i=>((document.getElementById(i)||{}).value||'').trim();
/* hỏi khi trùng họ tên + ngày sinh (bọc trước khi khoá để chạy trong khoá) */
{const _l=window.qlLuuHS;if(_l)window.qlLuuHS=async function(){const n=bo(val('mHo')+' '+val('mTen')),H=(S.org&&S.org.hoso)||{},nam=val('mNam'),ng=val('mNg'),th=val('mTh');
 const trung=STUDENTS.filter(s=>bo(s[1])===n&&(()=>{const h=H[s[0]]||{};if(!nam&&!h.nam)return true;return String(h.nam||'')===nam&&(!ng||!h.ng||(String(h.ng)===ng&&String(h.th)===th))})());
 if(n&&trung.length&&!confirm(`Đã có ${trung.length} em trùng họ tên${nam?' và năm sinh':''}: ${trung.map(s=>s[1]+' ('+s[0]+')').join(', ')}.\n\nVẫn tạo thêm tài khoản mới?`))return;
 return _l.apply(this,arguments)}}
['qlLuuHS','qlLuuGV','qlLuuLop','qlLuuPH','qlLuuXep','qlChayNhap','qlXoaHS','phTaoThieu','llChay','qlThemVao'].forEach(khoa);
/* bảng Sửa dùng onsubmit="qlLuu(event,id)" */
{const f=window.qlLuu;if(f){let busy=false;window.qlLuu=async function(e){if(e&&e.preventDefault)e.preventDefault();if(busy)return;busy=true;const b=document.querySelector('#qlsua button[type=submit]');if(b){b.disabled=true}
 try{return await f.apply(this,arguments)}finally{busy=false;if(b&&document.body.contains(b))b.disabled=false}}}}
})();
