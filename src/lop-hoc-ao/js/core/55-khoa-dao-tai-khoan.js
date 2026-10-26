/* 55 — Dùng thật (thầy yêu cầu 23/10/2026, task T-01)
   - Mọi tài khoản học sinh: đảo và màn KHOÁ, mở dần theo tiến độ (qua Màn 1 mở đảo sau; xong chủ đề mở chủ đề sau; màn sau mở khi qua màn trước).
   - Tài khoản thử: Lê Bảo Na — mở tất cả + 10 000 xu. Gồm: học sinh "na" (bản đầy đủ), tài khoản "lebaona" (bản học sinh),
     hoặc bất kỳ tài khoản nào em đặt tên đúng "Lê Bảo Na".
   - Bản đầy đủ (demo giáo viên): nút "Mở khóa tất cả" trên thanh demo vẫn dùng được để xem nhanh; mặc định khoá.
   - Dữ liệu cũ được làm mới: đổi khoá lưu (bản đầy đủ _v10, bản học sinh jennyHS2_…). */
import { hooks } from './00-hooks.js';
import { save } from './09-du-lieu-demo.js';
import { render, toast } from './13-giao-dien-chung.js';
import { I18N } from './47-ngon-ngu-vi-en.js';
const HS_BUILD=()=>typeof ACC!=='undefined';
function isTestSt(st){try{st=st||S.st[sid];if(!st)return false;if(sid==='na'||sid==='lebaona')return true;return String(st.name||'').normalize('NFC').trim().toLowerCase().replace(/\s+/g,' ')==='lê bảo na'}catch(e){return false}}
let UNL_MAN=(()=>{try{return localStorage.getItem('jennyUnlockAll')==='1'}catch(e){return false}})();
function unlNow(){return(role==='hs'&&isTestSt())||(!HS_BUILD()&&UNL_MAN)}
hooks.de('toggleUnl',function(){UNL_MAN=!UNL_MAN;try{localStorage.setItem('jennyUnlockAll',UNL_MAN?'1':'0')}catch(e){}UNL=unlNow();render();toast(UNL_MAN?'Đã mở khóa tất cả đảo (chỉ để xem demo)':'Đã khoá lại: đảo mở dần theo tiến độ')});
{hooks.on('render',_r=>function(){try{UNL=unlNow();if(role==='hs'){const st=S.st[sid];if(st&&isTestSt(st)&&!st.t10k){st.coins=Math.max(st.coins||0,10000);st.t10k=1;st.active=true;save()}}}catch(e){}return _r.apply(this,arguments)})}
{hooks.on('go',_g=>function(){try{UNL=unlNow()}catch(e){}return _g.apply(this,arguments)})}
/* Bài cô giao mẫu chỉ có ở bản đầy đủ và tài khoản thử (học sinh thật chỉ thấy bài cô giao thật) */
{hooks.on('asgSeed',_s=>function(){if(HS_BUILD()&&!isTestSt())return;return _s.apply(this,arguments)})}
UNL=false;
Object.assign(I18N,{'Sổ đang trống. Câu nào em làm sai lần đầu sẽ được ghi vào đây để luyện lại.':'Your book is empty. Any question you get wrong the first time will be saved here to practise again.','Sổ đang trống. Câu nào em làm sai sẽ được ghi vào đây để luyện lại.':'Your book is empty. Any question you get wrong will be saved here to practise again.'});
