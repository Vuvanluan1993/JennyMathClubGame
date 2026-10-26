/* ===================== BÀI GIẢNG JENNY (slide tóm tắt kiến thức theo bài) ===================== */
/* LES[lớp][bài] = các slide. Tiết 1 của bài xem đủ; các tiết sau xem "Nhắc lại nhanh" (slide cuối), có thể xem đủ. */
import { esc, range } from '../../core/01-tien-ich.js';
import { ALLP1, P1BY } from './07-lop-9-chuong-i-phuong-trinh-va-he-hai-ph.js';
import { go } from '../../core/13-giao-dien-chung.js';
import { spr } from '../../core/22-do-hoa-pixel-mau-logo-clb.js';
import { dice, grp2, isl1, rowPair, sayFull, sayJ } from './24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { curG, PRIM } from '../../core/25-lop-1-so-loi-sai-toan-jenny.js';
import { buildIsl } from './26-lop-2-5-chu-de-1-on-tap-va-bo-sung.js';
import { MGT } from './28-chu-de-3-lop-1-5.js';
import { colPic } from './29-chu-de-4-va-5-lop-1-5.js';
import { jenny } from '../../core/33d-jenny-bieu-cam.js';
const lsN=(n,s,sz=26)=>`<div class="lsrow"><b>${n}</b><span>${n?Array.from({length:n},()=>spr(s,sz)).join(''):'<i class="lsz">không có quả nào</i>'}</span></div>`;
export const lsLine=(a,b,hl)=>`<div class="lsline">${range(a,b).map(v=>`<span class="${hl&&hl.includes(v)?'on':''}">${v}</span>`).join('')}</div>`;
export const lsTab=(head,rows)=>`<table class="lstab"><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
export const lsMem=t=>`<div class="lsmem">${spr('star',22)}<span>${t}</span></div>`;
export const LES={
 1:{
  1:[{t:'Đếm từ 1 đến 5',h:`${lsN(1,'apple')}${lsN(2,'apple')}${lsN(3,'apple')}${lsN(4,'apple')}${lsN(5,'apple')}`,say:'Chào các em! Mình cùng đếm nhé. Một quả táo, hai quả táo, ba quả táo, bốn quả táo, năm quả táo. Mỗi hàng có thêm một quả.'},
     {t:'Số 0',h:`${lsN(0,'apple')}<p>Đĩa trống, không có quả nào. Ta viết số <b>0</b>.</p>`,say:'Đĩa này trống, không có quả nào. Khi không có gì, ta viết số không.'},
     {t:'Thêm 1 được số tiếp theo',h:`${lsLine(0,5)}<p>0, 1, 2, 3, 4, 5: mỗi số hơn số đứng trước <b>1</b>.</p>`,say:'Không, một, hai, ba, bốn, năm. Cứ thêm một là được số tiếp theo.'},
     {t:'Em nhớ nhé',h:lsMem('Chạm vào mỗi vật <b>một lần</b> khi đếm. Số cuối cùng em đọc là <b>số lượng</b> vật.'),say:'Em nhớ nhé: khi đếm, chạm vào mỗi vật một lần. Số cuối cùng em đọc chính là số lượng vật.'}],
  2:[{t:'Đếm từ 6 đến 10',h:`${lsN(6,'star',22)}${lsN(7,'star',22)}${lsN(8,'star',22)}${lsN(9,'star',22)}${lsN(10,'star',22)}`,say:'Mình đếm tiếp nhé. Sáu ngôi sao, bảy ngôi sao, tám, chín, mười ngôi sao.'},
     {t:'5 thêm 1 là 6',h:`<div class="g1grp">${Array.from({length:5},()=>spr('chick',30)).join('')}${spr('chick',30,'g1b')}</div><p>Có 5 bạn gà, thêm 1 bạn nữa là <b>6</b>.</p>`,say:'Có năm bạn gà con, thêm một bạn nữa là sáu bạn.'},
     {t:'Dãy số từ 0 đến 10',h:`${lsLine(0,10,[10])}<p>Số <b>10</b> có hai chữ số: chữ số 1 và chữ số 0.</p>`,say:'Đây là dãy số từ không đến mười. Số mười được viết bằng hai chữ số: một và không.'},
     {t:'Em nhớ nhé',h:lsMem('Đếm thêm 1: 6, 7, 8, 9, 10. Đếm lùi 1: 10, 9, 8, 7, 6.'),say:'Em nhớ nhé: đếm thêm một là sáu, bảy, tám, chín, mười. Đếm lùi một là mười, chín, tám, bảy, sáu.'}],
  3:[{t:'Ghép từng cặp',h:`${rowPair('cup',5,'carrot',3)}<p>Ghép mỗi cái cốc với một củ cà rốt. Cốc còn thừa: số cốc <b>nhiều hơn</b>, số cà rốt <b>ít hơn</b>.</p>`,say:'Muốn so sánh hai nhóm, em ghép từng cặp. Mỗi cái cốc ghép với một củ cà rốt. Cốc còn thừa ra, nên số cốc nhiều hơn, số cà rốt ít hơn.'},
     {t:'Bằng nhau',h:`${rowPair('fish',4,'egg',4)}<p>Ghép vừa đủ, không thừa: hai nhóm <b>bằng nhau</b>.</p>`,say:'Nếu ghép vừa đủ, không nhóm nào thừa, thì hai nhóm bằng nhau.'},
     {t:'Em nhớ nhé',h:lsMem('Nhóm nào <b>còn thừa</b> khi ghép cặp thì nhóm đó <b>nhiều hơn</b>.'),say:'Em nhớ nhé: khi ghép cặp, nhóm nào còn thừa thì nhóm đó nhiều hơn.'}],
  4:[{t:'Dấu lớn hơn, bé hơn, bằng',h:`<div class="g1vs">${dice(5)}<b class="g1big">5 &gt; 2</b>${dice(2)}</div><div class="g1vs">${dice(1)}<b class="g1big">1 &lt; 4</b>${dice(4)}</div><div class="g1vs">${dice(3)}<b class="g1big">3 = 3</b>${dice(3)}</div>`,say:'Năm lớn hơn hai. Một bé hơn bốn. Ba bằng ba.'},
     {t:'Đầu nhọn chỉ số bé',h:`<p class="g1big">8 &gt; 6</p><p class="g1big">6 &lt; 8</p><p>Dấu luôn <b>mở rộng về số lớn</b>, đầu nhọn chỉ vào <b>số bé</b>.</p>`,say:'Mẹo nhỏ: phía mở rộng của dấu quay về số lớn, đầu nhọn chỉ vào số bé.'},
     {t:'Số đứng sau lớn hơn',h:`${lsLine(0,10,[3,7])}<p>Trên dãy số, 7 đứng sau 3 nên <b>7 &gt; 3</b>.</p>`,say:'Trên dãy số, số nào đứng sau thì lớn hơn. Bảy đứng sau ba nên bảy lớn hơn ba.'},
     {t:'Em nhớ nhé',h:lsMem('So sánh số: đếm hoặc nhìn dãy số. Số đứng sau thì <b>lớn hơn</b>.'),say:'Em nhớ nhé: số nào đứng sau trên dãy số thì lớn hơn.'}],
  5:[{t:'5 gồm 2 và 3',h:`${grp2('apple',2,'apple',3,32)}<p>Có 2 quả và 3 quả, tất cả là <b>5</b> quả.</p>`,say:'Có hai quả táo và ba quả táo, tất cả là năm quả. Vậy năm gồm hai và ba.'},
     {t:'Tách số thành hai phần',h:`<div class="g1bond"><span>6</span><i></i><i></i><span>4</span><span>2</span></div><p>6 gồm 4 và 2. Cũng có thể: 6 gồm 2 và 4.</p>`,say:'Sáu gồm bốn và hai. Đổi chỗ thì sáu cũng gồm hai và bốn.'},
     {t:'Em nhớ nhé',h:lsMem('Một số có thể tách thành hai phần theo nhiều cách. Ví dụ 5 gồm 1 và 4, 2 và 3.'),say:'Em nhớ nhé: một số có thể tách thành hai phần theo nhiều cách. Năm gồm một và bốn, hoặc hai và ba.'}],
  6:[{t:'Ôn cả chủ đề',h:`${lsLine(0,10)}<p>Đếm, đọc, viết các số từ 0 đến 10.</p><p class="g1big">7 &gt; 4 &nbsp; 2 &lt; 9</p><p>So sánh số, tách số thành hai phần.</p>`,say:'Chủ đề này các em đã học đếm, đọc, viết các số từ không đến mười, so sánh số và tách số thành hai phần.'},
     {t:'Em nhớ nhé',h:lsMem('Đếm cẩn thận, chạm mỗi vật một lần. Số đứng sau thì lớn hơn. Số 10 gồm 1 và 9, 2 và 8, 3 và 7, 4 và 6, 5 và 5.'),say:'Em nhớ nhé: đếm cẩn thận, số đứng sau thì lớn hơn. Mười gồm một và chín, hai và tám, ba và bảy, bốn và sáu, năm và năm.'}],
 },
 4:{
  1:[{t:'Các hàng của số',h:`${lsTab(['Chục nghìn','Nghìn','Trăm','Chục','Đơn vị'],[['4','5','3','0','7']])}<p>Số <b>45 307</b> gồm 4 chục nghìn, 5 nghìn, 3 trăm, 0 chục, 7 đơn vị.</p>`,say:'Chào các em! Số bốn mươi lăm nghìn ba trăm linh bảy gồm bốn chục nghìn, năm nghìn, ba trăm, không chục và bảy đơn vị.'},
     {t:'Đọc số',h:`<p class="g1big">45 307</p><p>Đọc: <b>bốn mươi lăm nghìn ba trăm linh bảy</b>.</p><p>Đọc phần nghìn trước, rồi đọc ba chữ số sau.</p>`,say:'Đọc phần nghìn trước: bốn mươi lăm nghìn. Rồi đọc ba chữ số sau: ba trăm linh bảy.'},
     {t:'Viết số thành tổng',h:`<p class="g1big" style="font-size:30px">45 307 =<br>40 000 + 5 000 + 300 + 7</p><p>Chữ số 0 ở hàng chục thì không cần viết vào tổng.</p>`,say:'Viết thành tổng các hàng: bốn mươi nghìn cộng năm nghìn cộng ba trăm cộng bảy. Hàng chục là không nên bỏ qua.'},
     {t:'So sánh số',h:`<p class="g1big" style="font-size:32px">9 999 &lt; 10 000</p><p>Số nào có <b>nhiều chữ số hơn</b> thì lớn hơn.</p><p class="g1big" style="font-size:32px">52 418 &gt; 52 381</p><p>Cùng số chữ số: so từng hàng <b>từ trái sang phải</b>.</p>`,say:'Số nào có nhiều chữ số hơn thì lớn hơn. Nếu cùng số chữ số, ta so sánh từng hàng từ trái sang phải.'},
     {t:'Em nhớ nhé',h:lsMem('Mỗi hàng gấp 10 lần hàng bên phải. Đọc, viết số theo từng lớp; so sánh từ hàng cao nhất.'),say:'Em nhớ nhé: mỗi hàng gấp mười lần hàng bên phải. So sánh số thì bắt đầu từ hàng cao nhất.'}],
  2:[{t:'Đặt tính thẳng cột',h:`<div class="g1grp">${colPic('36 518','+','24 375')}</div><p>Viết các chữ số <b>cùng hàng thẳng cột</b>, tính từ phải sang trái, nhớ sang hàng bên trái.</p>`,say:'Khi đặt tính, viết các chữ số cùng hàng thẳng cột với nhau. Tính từ phải sang trái, có nhớ thì nhớ sang hàng bên trái.'},
     {t:'Tính nhẩm số tròn nghìn',h:`<p class="g1big" style="font-size:34px">6 000 + 3 000 = 9 000</p><p>Nhẩm: 6 nghìn + 3 nghìn = 9 nghìn.</p><p class="g1big" style="font-size:34px">8 000 : 2 = 4 000</p>`,say:'Với số tròn nghìn, em nhẩm theo nghìn. Sáu nghìn cộng ba nghìn bằng chín nghìn. Tám nghìn chia hai bằng bốn nghìn.'},
     {t:'Thứ tự thực hiện',h:`<p class="g1big" style="font-size:30px">20 + 6 × 5 = 20 + 30 = 50</p><p>Nhân, chia <b>trước</b>; cộng, trừ <b>sau</b>. Có ngoặc thì tính trong ngoặc trước.</p>`,say:'Trong biểu thức, nhân chia làm trước, cộng trừ làm sau. Nếu có ngoặc thì tính trong ngoặc trước.'},
     {t:'Em nhớ nhé',h:lsMem('Đặt tính thẳng cột, tính từ phải sang trái. Nhân, chia trước; cộng, trừ sau.'),say:'Em nhớ nhé: đặt tính thẳng cột, tính từ phải sang trái. Nhân chia trước, cộng trừ sau.'}],
  3:[{t:'Số chẵn',h:`${lsLine(0,10,[0,2,4,6,8,10])}<p>Số có chữ số tận cùng là <b>0, 2, 4, 6, 8</b> là số chẵn.</p>`,say:'Số chẵn là số có chữ số tận cùng là không, hai, bốn, sáu, tám.'},
     {t:'Số lẻ',h:`${lsLine(0,10,[1,3,5,7,9])}<p>Số có chữ số tận cùng là <b>1, 3, 5, 7, 9</b> là số lẻ.</p>`,say:'Số lẻ là số có chữ số tận cùng là một, ba, năm, bảy, chín.'},
     {t:'Chỉ cần nhìn chữ số cuối',h:`<p class="g1big" style="font-size:34px">35 79<u class="hl">4</u> → chẵn</p><p class="g1big" style="font-size:34px">12 06<u class="hl">7</u> → lẻ</p><p>Hai số chẵn (hoặc hai số lẻ) liên tiếp hơn kém nhau <b>2</b> đơn vị.</p>`,say:'Muốn biết số chẵn hay lẻ, em chỉ cần nhìn chữ số cuối cùng. Hai số chẵn liên tiếp hơn kém nhau hai đơn vị.'},
     {t:'Em nhớ nhé',h:lsMem('Tận cùng 0, 2, 4, 6, 8: chẵn. Tận cùng 1, 3, 5, 7, 9: lẻ.'),say:'Em nhớ nhé: tận cùng là không, hai, bốn, sáu, tám thì chẵn. Tận cùng là một, ba, năm, bảy, chín thì lẻ.'}],
  4:[{t:'Biểu thức chứa chữ',h:`<p class="g1big" style="font-size:36px">a + 15</p><p>Chữ <b>a</b> thay cho một số chưa biết. Mỗi lần a nhận một giá trị, biểu thức có một giá trị.</p>`,say:'Biểu thức a cộng mười lăm có chứa chữ a. Chữ a thay cho một số. Mỗi khi a nhận một giá trị, ta tính được giá trị của biểu thức.'},
     {t:'Thay chữ bằng số rồi tính',h:`${lsTab(['a','a + 15'],[['3','3 + 15 = 18'],['10','10 + 15 = 25']])}`,say:'Với a bằng ba, a cộng mười lăm bằng mười tám. Với a bằng mười, a cộng mười lăm bằng hai mươi lăm.'},
     {t:'Ví dụ',h:`<p class="g1big" style="font-size:30px">90 − a × 4 với a = 10</p><p>90 − 10 × 4 = 90 − 40 = <b>50</b></p><p>Nhớ: nhân trước, trừ sau.</p>`,say:'Với a bằng mười, chín mươi trừ a nhân bốn bằng chín mươi trừ bốn mươi, bằng năm mươi. Nhớ làm phép nhân trước.'},
     {t:'Em nhớ nhé',h:lsMem('Thay chữ bằng số đã cho, rồi tính theo đúng thứ tự thực hiện phép tính.'),say:'Em nhớ nhé: thay chữ bằng số đã cho, rồi tính theo đúng thứ tự.'}],
  5:[{t:'Các bước giải',h:`<ol class="lsol"><li>Đọc kĩ đề: cho biết gì, hỏi gì.</li><li>Tóm tắt bằng lời hoặc sơ đồ.</li><li>Tìm từng bước: bước 1, bước 2, bước 3.</li><li>Viết lời giải, phép tính và đáp số.</li></ol>`,say:'Muốn giải bài toán có ba bước tính, em đọc kĩ đề, tóm tắt, rồi tìm lần lượt từng bước, cuối cùng viết đáp số.'},
     {t:'Ví dụ',h:`<p>Cửa hàng có 3 thùng nước, mỗi thùng 24 chai. Đã bán 30 chai, sau đó nhập thêm 15 chai. Cửa hàng có bao nhiêu chai?</p><ol class="lsol"><li>Lúc đầu: 24 × 3 = 72 (chai)</li><li>Sau khi bán: 72 − 30 = 42 (chai)</li><li>Sau khi nhập: 42 + 15 = <b>57</b> (chai)</li></ol>`,say:'Ví dụ: ba thùng, mỗi thùng hai mươi bốn chai, lúc đầu có bảy mươi hai chai. Bán ba mươi chai còn bốn mươi hai chai. Nhập thêm mười lăm chai được năm mươi bảy chai.'},
     {t:'Em nhớ nhé',h:lsMem('Mỗi bước trả lời một câu hỏi nhỏ. Kết quả bước trước dùng cho bước sau.'),say:'Em nhớ nhé: mỗi bước trả lời một câu hỏi nhỏ, kết quả bước trước dùng cho bước sau.'}],
  6:[{t:'Ôn cả chủ đề',h:`<ol class="lsol"><li>Đọc, viết, so sánh số đến 100 000.</li><li>Cộng, trừ, nhân, chia; đặt tính thẳng cột.</li><li>Số chẵn, số lẻ.</li><li>Biểu thức chứa chữ.</li><li>Bài toán có ba bước tính.</li></ol>`,say:'Chủ đề này các em đã ôn đọc viết so sánh số, bốn phép tính, số chẵn số lẻ, biểu thức chứa chữ và bài toán ba bước tính.'},
     {t:'Em nhớ nhé',h:lsMem('Nhân, chia trước; cộng, trừ sau. Số chẵn tận cùng 0, 2, 4, 6, 8. Giải toán: tìm từng bước.'),say:'Em nhớ nhé: nhân chia trước, cộng trừ sau. Số chẵn tận cùng là không, hai, bốn, sáu, tám. Giải toán thì tìm từng bước.'}],
 },
};
/*@include js/content/lessons/bai-giang-lop1.js*/
/*@include js/content/lessons/bai-giang-lop2.js*/
/*@include js/content/lessons/bai-giang-lop3.js*/
/*@include js/content/lessons/bai-giang-lop4.js*/
/*@include js/content/lessons/bai-giang-lop5.js*/
/* đăng kí một chủ đề mới: các đảo (theo số tiết), trò chơi nhỏ riêng */
export function addTopic(g,ti,L,mg){const add=buildIsl(g,L,ti);PRIM[g].isl=PRIM[g].isl.concat(add).sort((p,q)=>(p.ti||0)-(q.ti||0));P1BY[g]=PRIM[g].isl;ALLP1.push(...add);if(mg){MGT[ti]=MGT[ti]||{};MGT[ti][g]=mg}}
/*@include js/content/hk2/lop1-hk2-phanA.js*/
/*@include js/content/hk2/lop2-hk2-phanA.js*/
/*@include js/content/hk2/lop2-hk2-phanB.js*/
/*@include js/content/hk2/lop3-hk2-phanA.js*/
/*@include js/content/hk2/lop3-hk2-phanB.js*/
/*@include js/content/hk2/lop4-hk2-phanA.js*/
/*@include js/content/hk2/lop4-hk2-phanB.js*/
/*@include js/content/hk2/lop5-hk2-phanA.js*/
/*@include js/content/hk2/lop5-hk2-phanB.js*/
export const lesOf=x=>{const g=Number(String(x.id).slice(1,2));return(LES[g]||{})[x.b]||null};
function startLes(id,full){try{speechSynthesis.cancel()}catch(e){}const x=isl1(id),L=lesOf(x);if(!L)return;const quick=!full&&x.tiet>1;go({k:'lslide',id,i:quick?L.length-1:0,quick})}
let lesSaid='';
export function viewLes(){const x=isl1(scr.id),L=lesOf(x),i=scr.i,sl=L[i],last=i===L.length-1,first=scr.quick?true:i===0;
  const key=scr.id+':'+i;if(curG()<=2&&lesSaid!==key){lesSaid=key;setTimeout(()=>{if(scr.k==='lslide'&&scr.i===i)sayJ(sayFull(sl.say,sl.h))},350)}
  const done=`const s=s1(S.st[sid],'${x.id}');s.les=true;save();try{speechSynthesis.cancel()}catch(e){};go({k:'island',id:'${x.id}'})`;
  return`<div class="page"><div class="crumb"><button class="btn sm ghost" onclick="try{speechSynthesis.cancel()}catch(e){};go({k:'island',id:'${x.id}'})">← ${esc(x.title)}</button></div>
   <div class="card g1slide lslide"><div class="row" style="justify-content:space-between;gap:8px"><span class="pill">${scr.quick?'Nhắc lại nhanh':`Trang ${i+1}/${L.length}`}</span><span class="row" style="gap:6px">${scr.quick?`<button class="btn sm" type="button" onclick="startLes('${x.id}',1)">Xem đủ</button>`:''}<button class="btn sm" type="button" onclick="sayJ(sayFull(lesOf(isl1(scr.id))[scr.i].say,lesOf(isl1(scr.id))[scr.i].h))">🔊 Nghe</button></span></div>
   <div class="lshead">${jenny(48)}<h2>${esc(sl.t)}</h2></div><div class="g1slb">${sl.h}</div>
   <div class="row" style="margin-top:16px;justify-content:space-between;gap:8px"><button class="btn" type="button" ${first?'disabled':''} onclick="sfx('page');scr.i--;try{speechSynthesis.cancel()}catch(e){};render()">← Trước</button>${last?`<button class="btn pri" type="button" onclick="${done}">Vào chơi ▶</button>`:`<button class="btn pri" type="button" onclick="sfx('page');scr.i++;try{speechSynthesis.cancel()}catch(e){};render()">Tiếp →</button>`}</div></div></div>`}




