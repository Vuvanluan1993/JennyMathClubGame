/* 79 — Đồng bộ tiến độ học sinh với máy chủ: an toàn khi mất mạng, khi học trên 2 máy (T-06, thầy duyệt 24/10/2026)
   Trước đây (62): mỗi lần lưu, cả dữ liệu học của em (S.st[tk], trừ phần của cô) được ghi lên hs/{tk}.
   Thiếu sót đã sửa ở đây:
   1) Ghi lỗi (mất mạng) thì lần sau không ghi lại vì fbLast đã đổi → nay đánh dấu "chưa lưu" và tự thử lại sau 20 giây.
   2) Mất mạng rồi tải lại trang / đăng nhập lại: máy chủ còn bản cũ nên mất bài vừa làm → mỗi lần dữ liệu thật sự đổi, ghi
      dấu thời gian st._t; khi vào app so bản trên máy với bản máy chủ, bản nào mới hơn thì dùng (và đẩy lên).
   3) Học trên 2 máy: máy cũ ghi đè bản mới của máy kia → nay app nghe thay đổi của chính em trên máy chủ; bản máy chủ mới hơn
      thì máy này nhận ngay (không ghi đè).
   4) Đăng xuất khi mất mạng không bị treo (chờ tối đa 4 giây).
   5) Dữ liệu quá lớn (gần giới hạn 1 MB của một tài liệu Firestore) thì bỏ bớt bản lưu câu cũ trong Sổ lỗi sai. */
import { hooks } from './00-hooks.js';
import { save } from './09-du-lieu-demo.js';
import { toast } from './13-giao-dien-chung.js';
import { arcT } from './51-kho-game.js';
import { FB, fbDay, fbJ, fbLast, fbSub, fbTach, fbVe, GV_F } from './62-may-chu.js';
(function(){
const hsTk=()=>CLOUD&&CLOUD.me&&CLOUD.me.role==='hs'?CLOUD.me.tk:null;
const noiDung=st=>{const o=fbTach(st).hs;delete o._t;return JSON.stringify(o)};
let cuoi='';
/* 2) đánh dấu thời gian khi dữ liệu thật sự đổi */
{hooks.on('save',_s=>function(){try{const tk=hsTk(),st=tk&&S.st[tk];if(st){let j=noiDung(st);
   if(j.length>700000){Object.values(st.mist||{}).forEach(x=>{delete x.q});j=noiDung(st)}
   if(j!==cuoi){if(cuoi)st._t=Date.now();cuoi=j}}}catch(e){}return _s.apply(this,arguments)})}
/* 1) ghi lỗi → thử lại */
let henLai=null;
{hooks.on('fbTrangThai',_t=>function(t,loi){const r=_t.apply(this,arguments);try{if(loi){Object.keys(fbLast).forEach(k=>{if(/^(hs|ev|hsgv|asg|lop|hsdm|hoso|gv|ph)\/|^org\/main$/.test(k))fbLast[k]=''});
   clearTimeout(henLai);henLai=setTimeout(()=>{try{fbDay()}catch(e){}},20000)}}catch(e){}return r})}
/* 4) đăng xuất không treo khi mất mạng */
{hooks.on('fbDayNgay',_n=>function(){const p=_n.apply(this,arguments);return hsTk()?Promise.race([p,new Promise(ok=>setTimeout(ok,4000))]):p})}
/* 2) + 3) khi vào app */
const GIU=['grade','name','active'];
function ganTuXa(tk,st2,ev2,bao){const cu=S.st[tk]||{};GV_F.forEach(k=>{if(cu[k]!==undefined)st2[k]=cu[k]});GIU.forEach(k=>{if(cu[k]!==undefined)st2[k]=cu[k]});
 S.st[tk]=st2;if(ev2)S.events=ev2;cuoi=noiDung(st2);if(bao)try{toast(bao)}catch(e){}}
{hooks.on('fbHsBoot',_b=>async function(){const tk=CLOUD.me.tk;let loc=null;try{loc=JSON.parse(localStorage.getItem('jennyHSc_'+tk)||'null')}catch(e){}
 await _b.apply(this,arguments);
 try{const st=S.st[tk],ls=loc&&loc.st&&loc.st[tk];
  if(ls&&ls.grade===st.grade&&(ls._t||0)>(st._t||0)){ganTuXa(tk,ls,(loc.events||[]).length>=(S.events||[]).length?loc.events:null,
    arcT('Đã đưa bài em làm lúc mất mạng lên máy chủ.','Work saved while offline has been uploaded.'));fbLast['hs/'+tk]='';fbLast['ev/'+tk]='';save()}
  else cuoi=noiDung(st);
  fbSub.push(FB.db.doc('hs/'+tk).onSnapshot(d=>{try{if(!d.exists||d.metadata.hasPendingWrites)return;const x=d.data();if(x.j===fbLast['hs/'+tk])return;
    const st2=fbJ(x.j);if(!st2||(st2._t||0)<=(S.st[tk]._t||0))return;
    const ev2=fbJ(x.ev||'[]');ganTuXa(tk,st2,ev2,arcT('Bài em làm trên máy khác vừa được cập nhật.','Work from your other device has been updated.'));
    fbLast['hs/'+tk]=x.j;fbLast['ev/'+tk]=x.ev||'[]';try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}fbVe()}catch(e){console.error(e)}},e=>{}));
 }catch(e){console.error(e)}})}
})();
