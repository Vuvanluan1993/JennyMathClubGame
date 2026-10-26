/* 47 — Chọn ngôn ngữ VI | EN (giai đoạn 1: giao diện)
   - Nút [VI | EN] trên thanh trên cùng; lưu lựa chọn trên máy (localStorage 'jennyLang').
   - EN: dịch chữ giao diện (nút, thanh điều hướng, tiêu đề, thông báo) bằng bảng từ + mẫu câu.
     Đề bài, tên chủ đề, tên đảo, lời Jenny đọc vẫn tiếng Việt — giai đoạn 2 làm dần theo từng lớp.
   - Không dịch vùng nội dung bài: .g1bub .qtxt .g1pic .lslide .gdq .g1opts .xcq .tl b … (xem I18N_SKIP). */
import { hooks } from './00-hooks.js';
import { render } from './13-giao-dien-chung.js';
import { sfx } from './33b-am-thanh.js';
import { enOn } from './48-dich-tieng-anh.js';
globalThis.LANG='vi';try{LANG=localStorage.getItem('jennyLang')==='en'?'en':'vi'}catch(e){}
export const I18N={
 'Bản đồ':'Map','Toán Jenny':'Jenny Math','Luyện lỗi':'Fix mistakes','Sưu tập':'Collection','Hồ sơ':'Profile','← Bản đồ':'← Map',
 'Học sinh':'Student','Giáo viên':'Teacher','Phụ huynh':'Parent','Quản lý':'Admin','Đăng xuất':'Log out','Nghe Jenny':'Listen to Jenny','Đang học':'You are here','Trùm':'Boss',
 'Tiếp tục':'Continue','Thử lại':'Try again','Chơi lại':'Play again','Về đảo':'Back to island','Kiểm tra':'Check','Nộp':'Submit','Đúng':'True','Sai':'False','Xếp lại':'Reset',
 'Tuyệt vời!':'Excellent!','Giỏi quá!':'Well done!','Đúng rồi!':'Correct!','Qua màn!':'Level passed!','Mình chơi lại nhé!':"Let's try again!",'Hết tim rồi!':'Out of hearts!','Hết giờ!':"Time's up!",'Kỷ lục mới!':'New record!',
 'Chưa đúng, mất 1 tim.':'Not quite — you lost 1 heart.','Chưa đúng.':'Not quite.','Em nhìn kỹ hình và thử lại nhé.':'Look carefully and try again.','Xem kết quả':'See results',
 'Hướng dẫn':'How to','Xem hướng dẫn':'See how','Xem cách làm':'See how to solve','↺ Xem lại':'↺ Replay','🐢 Chậm hơn':'🐢 Slower','🐇 Bình thường':'🐇 Normal','Em làm lại ▶':'Try it again ▶',
 'Luyện ngay ▶':'Practise now ▶','Luyện lỗi trước nhé':'Fix your mistakes first','Luyện ngay':'Practise now','Luyện tiếp':'Keep practising','Về sổ lỗi sai':'Back to mistakes book',
 'Sổ lỗi sai':'Mistakes book','Hộ chiếu đại dương':'Ocean passport','🛂 Hộ chiếu đại dương':'🛂 Ocean passport','Tủ đồ của Jenny':"Jenny's wardrobe",'Đang mặc':'Wearing',
 '📖 Bộ sưu tập sinh vật biển':'📖 Sea creature collection','Hồ sơ của em':'My profile','Chuỗi':'Streak','Dài nhất':'Longest','Ngày học':'Study days','Số câu':'Questions',
 'Chuỗi ngày chăm chỉ':'Study streak','Hôm nay':'Today','Ít':'Less','Nhiều':'More','Sức mạnh Toán':'Math power','Số':'Numbers','Phép tính':'Operations','Lời văn':'Word problems','Logic':'Logic','Tư duy – Logic':'Logical thinking','Giải toán lời văn':'Word problems','lời văn':'word problem','chưa làm':'not yet',
 'Hình học':'Geometry','Đo lường':'Measurement','Thống kê':'Statistics','chưa đủ':'not enough','Tháng này':'This month',
 'Hôm nay em học:':'Today you learn:','Bài giảng Jenny':"Jenny's lesson",'Nên xem':'Recommended','Học trên đảo':'Learn on the island','Chơi':'Play','Trùm lớp':'Class boss','bắt buộc':'required',
 'Góp sức':'Join in','Chơi thêm':'More games','tùy chọn':'optional','Nâng cao':'Advanced','Đánh trùm':'Fight the boss','Đảo tiếp theo →':'Next island →',
 'Chế độ demo':'Demo mode','🔒 Khóa lại':'🔒 Lock','🔓 Mở khóa tất cả':'🔓 Unlock all','Sang ngày mới →':'Next day →','Làm lại demo':'Reset demo',
 'Dữ liệu chỉ lưu trên trình duyệt này.':'Data is saved only in this browser.','Jenny nghỉ ở trại. Cùng xem bài giải nhé!':"Jenny rests at camp. Let's look at the solution!",'Em hiểu rồi, leo tiếp ▶':'Got it, keep climbing ▶',
 'Kéo số vào ô trống, hoặc chạm vào số.':'Drag a number into the box, or tap it.','Câu giống vậy, số mới. Em làm nhé!':'A similar question with new numbers. Your turn!',
 'Cân thăng bằng':'Balance scale','Lật thẻ ghép đôi':'Memory match','Bóng bay':'Balloons','Câu cá':'Fishing','Ếch nhảy':'Frog jump','Thả mồi câu cá':'Bait fishing','Trồng cây':'Grow a tree','Leo núi tìm kho báu':'Treasure climb','Đập chuột':'Whack-a-mole','Ghép hình':'Shape puzzle','Tàu hoả':'Number train','Cửa hàng Jenny':"Jenny's shop",'Kéo co':'Tug of war','Đồng hồ':'Clock','Hứng sao':'Catch the stars','Đua giờ 60 giây':'60-second race',
 '← Trước':'← Back','Tiếp →':'Next →','Vào chơi':'Play','Nhắc lại nhanh kiến thức của bài · không bắt buộc':'A quick recap of the lesson · optional','Xem':'View','Nghe':'Listen',
 'Đang có:':'You have:','− Bớt':'− Less','+ Thêm':'+ More','Chậm hơn':'Slower','Em làm lại':'Try it again','Cả lớp đã hạ trùm này!':'The class has beaten this boss!','Đã hạ':'Beaten',
 'Vào học':'Start','Khóa':'Locked','chưa học':'not started','2 buổi/tuần':'2 sessions/week','Hứng sao rơi':'Catch falling stars','Đập chuột chũi':'Whack-a-mole','Tàu hoả xếp số':'Number train',
 'Kéo co với trùm':'Tug of war with the boss','Ếch nhảy lá súng':'Lily pad frog jump','Giải bài toán lời văn để leo 6 chặng, lên đỉnh mở rương báu':'Solve word problems to climb 6 stages and open the treasure chest at the top',
 'Câu cá theo luật của đảo trong 45 giây':'Catch the fish that follow the island rule in 45 seconds','Di giỏ hứng sao đúng luật trong 60 giây':'Move the basket to catch the right stars in 60 seconds',
 'Đập chuột cầm số đúng luật, 60 giây':'Whack the moles holding the right numbers, 60 seconds','Làm liên tục câu của đảo này, có bảng xếp hạng lớp':"Answer this island's questions non-stop, with a class leaderboard",
 'Bắn bóng theo luật của đảo trong 45 giây':'Pop the balloons that follow the island rule in 45 seconds','Xếp toa theo thứ tự số, 6 lượt':'Put the carriages in number order, 6 rounds',
 'Trả lời nhanh để kéo dây về phía Jenny':"Answer quickly to pull the rope to Jenny's side",'Trả lời đúng để tưới cây, cây lớn dần tới khi ra quả, 8 lần tưới':'Answer correctly to water the tree until it bears fruit, 8 waterings',
 'Chọn lá súng có đáp án đúng, 8 hàng':'Jump onto the lily pad with the right answer, 8 rows','Thả mồi, cá cắn câu thì trả lời đúng để kéo lên, 8 con cá':'Cast the bait; when a fish bites, answer correctly to reel it in, 8 fish',
 'Cô giáo mở buổi nào thì em học buổi đó. Mỗi buổi có video, ví dụ và 3 màn, được tới 9 sao.':'Do the sessions your teacher opens. Each session has a video, examples and 3 levels, worth up to 9 stars.',
 'Mỗi lượt luyện 3 dạng, mỗi dạng 2 câu với số mới. Đúng cả 2 câu liền là dạng đó ra khỏi sổ, được +5 xu. Luyện lỗi không mất tim.':'Each round practises 3 question types, 2 questions each with new numbers. Get both right in a row to clear that type from the book and earn +5 coins. No hearts are lost when fixing mistakes.','Mỗi lượt luyện 3 dạng, mỗi dạng 2 câu với số mới. Đúng cả 2 câu liền là dạng đó ra khỏi sổ, được +5 xu. Luyện lỗi không mất tim. Lỗi cô chưa giao sẽ tự bỏ sau 7 ngày.':'Each round practises 3 question types, 2 questions each with new numbers. Get both right in a row to clear that type from the book and earn +5 coins. No hearts are lost when fixing mistakes. Mistakes your teacher has not assigned are removed after 7 days.',
 'Em chơi thêm các đảo nhé! Khi đủ bài, Jenny sẽ vẽ Sức mạnh Toán cho em.':'Play more islands! When you have done enough, Jenny will draw your Math power chart.',
 'Tìm khung đúng số lượng':'Find the box with the right amount','Đếm số lượng':'Count how many','Điền số theo thứ tự':'Fill in numbers in order',
 'T2':'Mon','T3':'Tue','T4':'Wed','T5':'Thu','T6':'Fri','T7':'Sat','CN':'Sun'};
export const I18N_RE=[
 [/^(.+) · Toán (\d+) · Chủ đề (\d+)$/,'$1 · Maths $2 · Topic $3'],[/^Khoảng (\d+) đòn · (\d+) tim · rương$/,'About $1 hits · $2 hearts · chest'],[/^Trùm đảo · (.+)$/,'Island boss · $1'],
 [/^Tuần (\d+) · (\d+)\/(\d+) sao$/,'Week $1 · $2/$3 stars'],[/^Tuần (\d+) · đang soạn$/,'Week $1 · coming soon'],[/^sai (\d+) lần$/,'missed $1×'],[/^Kỷ lục (\d+)$/,'Record $1'],
 [/^Buổi (\d+) · (.+)$/,(m,n,t)=>'Session '+n+' · '+({'Quy luật xếp hình':'Shape patterns','Đếm khéo, thứ tự':'Clever counting and order','Giống nhau, khác nhau':'Same and different','Cân thăng bằng':'Balance scales'}[t]||t)],
 [/^CHỦ ĐỀ (\d+)$/,'TOPIC $1'],[/^Chủ đề (\d+)$/,'Topic $1'],[/^Bài (\d+)–(\d+) · (\d+) đảo · trùm$/,'Lessons $1–$2 · $3 islands · boss'],[/^Bài (\d+)–(\d+) · (\d+) đảo ·$/,'Lessons $1–$2 · $3 islands ·'],[/^trùm$/,'boss'],
 [/^Chào (.+)!$/,'Hi $1!'],[/^(.+) · Lớp (\d+)$/,'$1 · Grade $2'],[/^Lớp (\d+)$/,'Grade $1'],[/^Bản (\d+\/\d+ · \S+)$/,'Build $1'],
 [/^Màn (\d+)$/,'Level $1'],[/^Trang (\d+)\/(\d+)$/,'Page $1/$2'],[/^Khoảng (\d+) câu · (\d+) tim$/,'About $1 questions · $2 hearts'],[/^(\d+)\/(\d+) câu đúng · còn (\d+) tim(.*)$/,'$1/$2 correct · $3 hearts left$4'],[/^(\d+)\/(\d+) câu đúng(.*)$/,'$1/$2 correct$3'],
 [/^\+(\d+) xu$/,'+$1 coins'],[/^\+(\d+) sao$/,'+$1 star'],[/^(\d+) dạng$/,'$1 types'],[/^(\d+)\/(\d+) dấu$/,'$1/$2 stamps'],[/^(\d+) ngày$/,'$1 days'],
 [/^Em vừa sai (\d+) câu\. Em có thể luyện lại ngay \(không bắt buộc\)\.$/,'You missed $1 question(s). You can practise them now (optional).'],[/^Luyện lại câu sai \((\d+)\) ▶$/,'Practise mistakes ($1) ▶'],[/^Em vừa sai (\d+) câu\. Luyện lại một lượt để mở màn tiếp theo\.$/,'You missed $1 question(s). Practise them once to unlock the next level.'],[/^Em vừa sai (\d+) câu\. Luyện lại một lượt để chơi tiếp\.$/,'You missed $1 question(s). Practise them once to keep playing.'],
 [/^Luyện lỗi \((\d+)\) ▶$/,'Fix mistakes ($1) ▶'],[/^Lần trước em (chọn|ghi) (.+), chưa đúng\. Em làm lại nhé!$/,'Last time you answered $2 — not quite. Try again!'],
 [/^Bài (\d+) · Tiết (\d+)$/,'Lesson $1 · Period $2'],[/^(\d+) trang · Jenny đọc to · không bắt buộc$/,'$1 pages · Jenny reads aloud · optional'],
 [/^Năm học (.+) · mỗi ô là 1 ngày em vào làm bài$/,'School year $1 · each square is a day you practised'],[/^(.+): em chưa làm bài$/,'$1: no practice yet'],[/^(.+): em làm (\d+) câu$/,'$1: you did $2 questions'],
 [/^(.+) · Lớp (\d+) · (.+)$/,'$1 · Grade $2 · $3'],[/^Còn (\d+)\/(\d+) máu · em đã đánh (\d+) đòn$/,'$1/$2 HP left · you hit $3 times'],
 [/^Mỗi màn đúng khoảng 3\/4 số câu và còn tim là được 1 sao\. Qua Màn 1 là mở đảo tiếp theo và mở Trùm lớp\.$/,'Get about 3/4 right with hearts left to earn a star. Passing Level 1 opens the next island and the class boss.'],
 [/^Thưởng khi cả lớp hạ trùm: (\d+) xu và thẻ$/,'Reward when the class beats the boss: $1 coins and a card'],
 [/^Th(\d+)$/,(m,n)=>['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][n-1]||m],[/^(\d+) lần$/,'$1 times'],[/^Ngày (\d+)$/,'Day $1']];
const I18N_SKIP='.g1bub,.qtxt,.g1pic,.lslide,.gdq,.gdbub,.gdmq,.g1opts,.opts,.xcq,.xcsolbox,.gdstage,.g1cells,.g1tiles,.node .lbl,.t1sec h2,.tl .grow,.lesson h1,.lesson .muted,.mlist,script,style,select,option,#gateov p';
/* tên riêng của vùng biển: thay ngay trong chuỗi */
const I18N_PLACE={'Vịnh Tí Hon':'Tiny Bay','Biển Ngọc Bích':'Emerald Sea','Quần đảo Mây Trắng':'White Cloud Islands','Đại dương Sao Băng':'Shooting Star Ocean','Biển Huyền Thoại':'Legend Sea',
 'Quần đảo Nhiệt đới':'Tropical Islands','Biển Băng':'Ice Sea','Đảo Núi lửa':'Volcano Island','Ốc đảo Sa mạc':'Desert Oasis','Vịnh Kẹo ngọt':'Candy Bay','Biển Pha lê':'Crystal Sea','Đầm lầy Rừng xanh':'Green Jungle Swamp','Vịnh Lá Thu':'Autumn Leaf Bay','Biển Đêm sao':'Starry Night Sea','Biển Hoàng hôn':'Sunset Sea',
 'Cá Xanh':'Blue Fish','Cua Đỏ':'Red Crab','Sứa Hồng':'Pink Jellyfish','Bạch Tuộc Tím':'Purple Octopus','Rùa Biển':'Sea Turtle','Cá Mập Con':'Baby Shark','Mực Lửa':'Fire Squid','Rắn Biển':'Sea Snake','Gà Lạc Đảo':'Lost Island Chick','Bọ Rùa Bay':'Flying Ladybird','Mèo Thủy Thủ':'Sailor Cat','Cá Voi Vàng':'Golden Whale','Rồng Biển':'Sea Dragon','Sao Biển Vàng':'Golden Starfish',
 'Bạch tuộc khổng lồ':'Giant Octopus','Cá mập khổng lồ':'Giant Shark','Sứa khổng lồ':'Giant Jellyfish','Mực khổng lồ':'Giant Squid','Rắn biển khổng lồ':'Giant Sea Snake','Rồng biển':'Sea Dragon','Cua khổng lồ':'Giant Crab','Toán Jenny':'Jenny Math',
 'Thứ Hai':'Mon','Thứ Ba':'Tue','Thứ Tư':'Wed','Thứ Năm':'Thu','Thứ Sáu':'Fri','Thứ Bảy':'Sat','Chủ nhật':'Sun'};
const I18N_PLACE_RE=new RegExp(Object.keys(I18N_PLACE).sort((a,b)=>b.length-a.length).join('|'),'g');
function i18nText(...a){return hooks.goi('i18nText',this,a)}
hooks.ham('i18nText',function(t){const s=t.trim();if(!s)return null;if(I18N[s])return t.replace(s,I18N[s]);const p=s.replace(I18N_PLACE_RE,m=>I18N_PLACE[m]);for(const [re,to] of I18N_RE){if(re.test(p))return t.replace(s,p.replace(re,to))}return p!==s?t.replace(s,p):null});
function i18nApply(root){if(LANG!=='en')return;root=root||document.body;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const todo=[];while(n=w.nextNode()){const p=n.parentElement;if(!p||p.closest('script,style')||(!(typeof enOn==='function'&&enOn())&&p.closest(I18N_SKIP)))continue;const r=i18nText(n.nodeValue);if(r!=null)todo.push([n,r])}todo.forEach(([n,r])=>n.nodeValue=r)}
function setLang(...a){return hooks.goi('setLang',this,a)}
hooks.ham('setLang',function(l){LANG=l==='en'?'en':'vi';try{localStorage.setItem('jennyLang',LANG)}catch(e){}document.documentElement.lang=LANG;render();langUI();try{sfx('tap')}catch(e){}});
function langUI(){const bar=document.querySelector('.appbar .wrap');if(!bar)return;let b=document.getElementById('langSw');
 if(!b){b=document.createElement('div');b.id='langSw';b.className='nb-lang';b.setAttribute('role','group');b.setAttribute('aria-label','Ngôn ngữ / Language');b.innerHTML='<button type="button" data-l="vi">VI</button><button type="button" data-l="en">EN</button>';b.addEventListener('click',e=>{const l=e.target.closest('button');if(l)setLang(l.dataset.l)});bar.appendChild(b)}
 b.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x.dataset.l===LANG);x.setAttribute('aria-pressed',x.dataset.l===LANG)})}
{const _r=hooks.cu('render');hooks.de('render',function(){const a=_r.apply(this,arguments);try{langUI();i18nApply()}catch(e){}return a})}
/* hộp thoại tạo ngoài render (hướng dẫn, nhắc luyện lỗi, thông báo) */
new MutationObserver(ms=>{if(LANG!=='en')return;for(const m of ms)m.addedNodes.forEach(x=>{if(x.nodeType===1)i18nApply(x);else if(x.nodeType===3&&x.parentElement&&!x.parentElement.closest('script,style')&&((typeof enOn==='function'&&enOn())||!x.parentElement.closest(I18N_SKIP))){const r=i18nText(x.nodeValue);if(r!=null)x.nodeValue=r}})}).observe(document.body,{childList:true,subtree:true});
document.documentElement.lang=LANG;
document.head.insertAdjacentHTML('beforeend',`<style>
.nb-lang{display:flex;flex:none;box-shadow:0 0 0 2px var(--pxk,#1F2A5A);order:7}.nb-lang button{border:0;font-family:var(--f-display);font-size:20px;line-height:1;padding:6px 8px;background:var(--surface,#fff);color:#5E6B8C;cursor:pointer}.nb-lang button.on{background:#FCB40C;color:#1F2A5A}
#sndBtn{order:8}
</style>`);
