/* 47 — Chọn ngôn ngữ VI | EN (giai đoạn 1: giao diện)
   - Nút [VI | EN] trên thanh trên cùng; lưu lựa chọn trên máy (localStorage 'jennyLang').
   - EN: dịch chữ giao diện (nút, thanh điều hướng, tiêu đề, thông báo) bằng bảng từ + mẫu câu.
     Đề bài, tên chủ đề, tên đảo, lời Jenny đọc vẫn tiếng Việt — giai đoạn 2 làm dần theo từng lớp.
   - Không dịch vùng nội dung bài: .g1bub .qtxt .g1pic .lslide .gdq .g1opts .xcq .tl b … (xem I18N_SKIP). */
let LANG='vi';try{LANG=localStorage.getItem('jennyLang')==='en'?'en':'vi'}catch(e){}
const I18N={
 'Bản đồ':'Map','Toán Jenny':'Jenny Math','Luyện lỗi':'Fix mistakes','Sưu tập':'Collection','Hồ sơ':'Profile','← Bản đồ':'← Map',
 'Học sinh':'Student','Giáo viên':'Teacher','Phụ huynh':'Parent','Đăng xuất':'Log out','Nghe Jenny':'Listen to Jenny','Đang học':'You are here','Trùm':'Boss',
 'Tiếp tục':'Continue','Thử lại':'Try again','Chơi lại':'Play again','Về đảo':'Back to island','Kiểm tra':'Check','Nộp':'Submit','Đúng':'True','Sai':'False','Xếp lại':'Reset',
 'Tuyệt vời!':'Excellent!','Giỏi quá!':'Well done!','Đúng rồi!':'Correct!','Qua màn!':'Level passed!','Mình chơi lại nhé!':"Let's try again!",'Hết tim rồi!':'Out of hearts!','Hết giờ!':"Time's up!",'Kỷ lục mới!':'New record!',
 'Chưa đúng, mất 1 tim.':'Not quite — you lost 1 heart.','Chưa đúng.':'Not quite.','Em nhìn kỹ hình và thử lại nhé.':'Look carefully and try again.','Xem kết quả':'See results',
 'Hướng dẫn':'How to','Xem hướng dẫn':'See how','Xem cách làm':'See how to solve','↺ Xem lại':'↺ Replay','🐢 Chậm hơn':'🐢 Slower','🐇 Bình thường':'🐇 Normal','Em làm lại ▶':'Try it again ▶',
 'Luyện ngay ▶':'Practise now ▶','Luyện lỗi trước nhé':'Fix your mistakes first','Luyện ngay':'Practise now','Luyện tiếp':'Keep practising','Về sổ lỗi sai':'Back to mistakes book',
 'Sổ lỗi sai':'Mistakes book','Hộ chiếu đại dương':'Ocean passport','🛂 Hộ chiếu đại dương':'🛂 Ocean passport','Tủ đồ của Jenny':"Jenny's wardrobe",'Đang mặc':'Wearing',
 '📖 Bộ sưu tập sinh vật biển':'📖 Sea creature collection','Hồ sơ của em':'My profile','Chuỗi':'Streak','Dài nhất':'Longest','Ngày học':'Study days','Số câu':'Questions',
 'Chuỗi ngày chăm chỉ':'Study streak','Hôm nay':'Today','Ít':'Less','Nhiều':'More','Sức mạnh Toán':'Math power','Số':'Numbers','Phép tính':'Operations','Lời văn':'Word problems',
 'Hình học':'Geometry','Đo lường':'Measurement','Thống kê':'Statistics','chưa đủ':'not enough','Tháng này':'This month',
 'Hôm nay em học:':'Today you learn:','Bài giảng Jenny':"Jenny's lesson",'Nên xem':'Recommended','Học trên đảo':'Learn on the island','Chơi':'Play','Trùm lớp':'Class boss','bắt buộc':'required',
 'Góp sức':'Join in','Chơi thêm':'More games','tùy chọn':'optional','Nâng cao':'Advanced','Đánh trùm':'Fight the boss','Đảo tiếp theo →':'Next island →',
 'Chế độ demo':'Demo mode','🔒 Khóa lại':'🔒 Lock','🔓 Mở khóa tất cả':'🔓 Unlock all','Sang ngày mới →':'Next day →','Làm lại demo':'Reset demo',
 'Dữ liệu chỉ lưu trên trình duyệt này.':'Data is saved only in this browser.','Jenny nghỉ ở trại. Cùng xem bài giải nhé!':"Jenny rests at camp. Let's look at the solution!",'Em hiểu rồi, leo tiếp ▶':'Got it, keep climbing ▶',
 'Kéo số vào ô trống, hoặc chạm vào số.':'Drag a number into the box, or tap it.','Câu giống vậy, số mới. Em làm nhé!':'A similar question with new numbers. Your turn!',
 'Cân thăng bằng':'Balance scale','Lật thẻ ghép đôi':'Memory match','Bóng bay':'Balloons','Câu cá':'Fishing','Ếch nhảy':'Frog jump','Thả mồi câu cá':'Bait fishing','Trồng cây':'Grow a tree','Leo núi tìm kho báu':'Treasure climb','Đập chuột':'Whack-a-mole','Ghép hình':'Shape puzzle','Tàu hoả':'Number train','Cửa hàng Jenny':"Jenny's shop",'Kéo co':'Tug of war','Đồng hồ':'Clock','Hứng sao':'Catch the stars','Đua giờ 60 giây':'60-second race',
 'T2':'Mon','T3':'Tue','T4':'Wed','T5':'Thu','T6':'Fri','T7':'Sat','CN':'Sun'};
const I18N_RE=[
 [/^CHỦ ĐỀ (\d+)$/,'TOPIC $1'],[/^Chủ đề (\d+)$/,'Topic $1'],[/^Bài (\d+)–(\d+) · (\d+) đảo · trùm$/,'Lessons $1–$2 · $3 islands · boss'],[/^Bài (\d+)–(\d+) · (\d+) đảo ·$/,'Lessons $1–$2 · $3 islands ·'],[/^trùm$/,'boss'],
 [/^Chào (.+)!$/,'Hi $1!'],[/^(.+) · Lớp (\d+)$/,'$1 · Grade $2'],[/^Lớp (\d+)$/,'Grade $1'],[/^Bản (\d+\/\d+ · \d+:\d+)$/,'Build $1'],
 [/^Màn (\d+)$/,'Level $1'],[/^Khoảng (\d+) câu · (\d+) tim$/,'About $1 questions · $2 hearts'],[/^(\d+)\/(\d+) câu đúng · còn (\d+) tim(.*)$/,'$1/$2 correct · $3 hearts left$4'],[/^(\d+)\/(\d+) câu đúng(.*)$/,'$1/$2 correct$3'],
 [/^\+(\d+) xu$/,'+$1 coins'],[/^\+(\d+) sao$/,'+$1 star'],[/^(\d+) dạng$/,'$1 types'],[/^(\d+)\/(\d+) dấu$/,'$1/$2 stamps'],[/^(\d+) ngày$/,'$1 days'],
 [/^Em vừa sai (\d+) câu\. Luyện lại một lượt để mở màn tiếp theo\.$/,'You missed $1 question(s). Practise them once to unlock the next level.'],[/^Em vừa sai (\d+) câu\. Luyện lại một lượt để chơi tiếp\.$/,'You missed $1 question(s). Practise them once to keep playing.'],
 [/^Luyện lỗi \((\d+)\) ▶$/,'Fix mistakes ($1) ▶'],[/^Lần trước em (chọn|ghi) (.+), chưa đúng\. Em làm lại nhé!$/,'Last time you answered $2 — not quite. Try again!'],
 [/^Bài (\d+) · Tiết (\d+)$/,'Lesson $1 · Period $2'],[/^(\d+) trang · Jenny đọc to · không bắt buộc$/,'$1 pages · Jenny reads aloud · optional'],
 [/^Năm học (.+) · mỗi ô là 1 ngày em vào làm bài$/,'School year $1 · each square is a day you practised'],[/^(.+): em chưa làm bài$/,'$1: no practice yet'],[/^(.+): em làm (\d+) câu$/,'$1: you did $2 questions'],
 [/^(.+) · Lớp (\d+) · (.+)$/,'$1 · Grade $2 · $3'],[/^Còn (\d+)\/(\d+) máu · em đã đánh (\d+) đòn$/,'$1/$2 HP left · you hit $3 times'],
 [/^Mỗi màn đúng khoảng 3\/4 số câu và còn tim là được 1 sao\. Qua Màn 1 là mở đảo tiếp theo và mở Trùm lớp\.$/,'Get about 3/4 right with hearts left to earn a star. Passing Level 1 opens the next island and the class boss.'],
 [/^Thưởng khi cả lớp hạ trùm: (\d+) xu và thẻ$/,'Reward when the class beats the boss: $1 coins and a card'],
 [/^Th(\d+)$/,(m,n)=>['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][n-1]||m],[/^(\d+) lần$/,'$1 times']];
const I18N_SKIP='.g1bub,.qtxt,.g1pic,.lslide,.gdq,.gdbub,.gdmq,.g1opts,.opts,.xcq,.xcsolbox,.gdstage,.g1cells,.g1tiles,.node .lbl,.t1sec h2,.tl .grow,.lesson h1,.lesson .muted,.mlist,script,style,select,option,#gateov p';
function i18nText(t){const s=t.trim();if(!s)return null;if(I18N[s])return t.replace(s,I18N[s]);for(const [re,to] of I18N_RE){if(re.test(s))return t.replace(s,s.replace(re,to))}return null}
function i18nApply(root){if(LANG!=='en')return;root=root||document.body;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const todo=[];while(n=w.nextNode()){const p=n.parentElement;if(!p||p.closest(I18N_SKIP))continue;const r=i18nText(n.nodeValue);if(r!=null)todo.push([n,r])}todo.forEach(([n,r])=>n.nodeValue=r)}
function setLang(l){LANG=l==='en'?'en':'vi';try{localStorage.setItem('jennyLang',LANG)}catch(e){}document.documentElement.lang=LANG;render();langUI();try{sfx('tap')}catch(e){}}
function langUI(){const bar=document.querySelector('.appbar .wrap');if(!bar)return;let b=document.getElementById('langSw');
 if(!b){b=document.createElement('div');b.id='langSw';b.className='nb-lang';b.setAttribute('role','group');b.setAttribute('aria-label','Ngôn ngữ / Language');b.innerHTML='<button type="button" data-l="vi">VI</button><button type="button" data-l="en">EN</button>';b.addEventListener('click',e=>{const l=e.target.closest('button');if(l)setLang(l.dataset.l)});bar.appendChild(b)}
 b.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x.dataset.l===LANG);x.setAttribute('aria-pressed',x.dataset.l===LANG)})}
{const _r=render;render=function(){const a=_r.apply(this,arguments);try{langUI();i18nApply()}catch(e){}return a}}
/* hộp thoại tạo ngoài render (hướng dẫn, nhắc luyện lỗi, thông báo) */
new MutationObserver(ms=>{if(LANG!=='en')return;for(const m of ms)m.addedNodes.forEach(x=>{if(x.nodeType===1)i18nApply(x);else if(x.nodeType===3&&x.parentElement&&!x.parentElement.closest(I18N_SKIP)){const r=i18nText(x.nodeValue);if(r!=null)x.nodeValue=r}})}).observe(document.body,{childList:true,subtree:true});
document.documentElement.lang=LANG;
document.head.insertAdjacentHTML('beforeend',`<style>
.nb-lang{display:flex;flex:none;box-shadow:0 0 0 2px var(--pxk,#1F2A5A);order:7}.nb-lang button{border:0;font-family:var(--f-display);font-size:20px;line-height:1;padding:6px 8px;background:var(--surface,#fff);color:#5E6B8C;cursor:pointer}.nb-lang button.on{background:#FCB40C;color:#1F2A5A}
#sndBtn{order:8}
</style>`);
