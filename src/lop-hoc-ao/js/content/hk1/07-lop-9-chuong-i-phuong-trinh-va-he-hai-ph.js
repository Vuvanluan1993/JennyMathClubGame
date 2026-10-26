/* ===================== Lớp 9 · Chương I Phương trình và hệ hai phương trình bậc nhất hai ẩn ===================== */
import { pick, R } from '../../core/01-tien-ich.js';
import { P1_6 } from './02-phan-i-sgk-ket-noi-tri-thuc-6-chuong-i.js';
import { mono, nz } from '../../core/03-phan-so-va-kiem-tra-dap-an.js';
import { SLIDES6 } from './04-lop-6-video-day-du-cho-bai-2-bai-3.js';
import { P1_7 } from './05-lop-7-chuong-i-so-huu-ti.js';
import { P1_8 } from './06-lop-8-chuong-i-da-thuc.js';
const neg=c=>c<0?'−'+(-c):''+c;
const lin=(a,b,c)=>`${mono(a,[['x',1]],true)}${mono(b,[['y',1]],false)} = ${neg(c)}`;
const sys=(e1,e2)=>`<span class="sys"><span>${e1}</span><span>${e2}</span></span>`;
const P1_9=[
 {id:'g9b1',title:'Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn',video:true,slides:[
  {t:'Bài 1 · Phương trình bậc nhất hai ẩn',h:'<p>Dạng: <b>ax + by = c</b>, với a, b không đồng thời bằng 0.</p><p>Ví dụ: 2x − y = 3; &nbsp; 0x + 4y = 8; &nbsp; x + 0y = 5.</p>',say:'Chào các em lớp chín! Phương trình bậc nhất hai ẩn x và y có dạng a x cộng b y bằng c, trong đó a và b không đồng thời bằng không. Ví dụ hai x trừ y bằng ba.'},
  {t:'Nghiệm của phương trình',h:'<p>Cặp (x<sub>0</sub>; y<sub>0</sub>) là nghiệm nếu ax<sub>0</sub> + by<sub>0</sub> = c.</p><p>2x − y = 3: thay (2; 1): 4 − 1 = 3 ✓ &nbsp; thay (1; 2): 2 − 2 = 0 ✗</p><p class="muted">Phương trình bậc nhất hai ẩn có vô số nghiệm.</p>',say:'Cặp số x không, y không là nghiệm nếu thay vào thì hai vế bằng nhau. Thay hai và một vào hai x trừ y: bốn trừ một bằng ba, đúng. Thay một và hai thì được không, khác ba, nên không phải nghiệm. Phương trình bậc nhất hai ẩn luôn có vô số nghiệm.'},
  {t:'Hệ hai phương trình',h:`<p>Hệ hai phương trình bậc nhất hai ẩn: ${sys('ax + by = c','a′x + b′y = c′')}</p><p>Nghiệm của hệ là cặp số thỏa mãn <b>cả hai</b> phương trình.</p>`,say:'Hệ hai phương trình bậc nhất hai ẩn gồm hai phương trình viết trong dấu ngoặc nhọn. Nghiệm của hệ là cặp số thỏa mãn đồng thời cả hai phương trình.'},
  {t:'Ví dụ',h:`<p>Kiểm tra (2; 1) với hệ ${sys('x + y = 3','2x − y = 3')}</p><p>2 + 1 = 3 ✓ &nbsp;&nbsp; 4 − 1 = 3 ✓ &nbsp;→ (2; 1) là nghiệm của hệ.</p>`,say:'Ví dụ: kiểm tra cặp hai, một với hệ x cộng y bằng ba và hai x trừ y bằng ba. Phương trình thứ nhất: hai cộng một bằng ba, đúng. Phương trình thứ hai: bốn trừ một bằng ba, đúng. Vậy hai, một là nghiệm của hệ.'},
  {t:'Ghi nhớ',h:'<p>• ax + by = c, a và b không cùng bằng 0.</p><p>• Kiểm tra nghiệm: thay vào, hai vế bằng nhau.</p><p>• Nghiệm của hệ: đúng với cả hai phương trình.</p>',say:'Ghi nhớ: phương trình bậc nhất hai ẩn có dạng a x cộng b y bằng c. Kiểm tra nghiệm bằng cách thay vào. Nghiệm của hệ phải đúng với cả hai phương trình. Vào đảo thôi!'}],
  gen:[
  ()=>{const a=nz(),b=nz(),x=R(-6,6),y=R(-6,6);if(R(0,1))return{q:`Tìm c để cặp (${x}; ${y}) là nghiệm của phương trình ${mono(a,[['x',1]],true)}${mono(b,[['y',1]],false)} = c.`,a:a*x+b*y,sol:`c = ${a} · (${x}) + ${b} · (${y}) = ${a*x+b*y}.`};const a1=pick([1,-1,2,3]),c=a1*x+b*y;return{q:`Cặp (x; ${y}) là nghiệm của phương trình ${lin(a1,b,c)}. Tìm x.`,a:x,sol:`${mono(a1,[['x',1]],true)} = ${c} − (${b*y}) = ${c-b*y} → x = ${x}.`}},
  ()=>{const x=R(-5,5),y=R(-5,5),a=nz(),b=nz(),m=nz();const c=a*x+b*y;if(!x)return{q:`Cặp (${x}; ${y}) có là nghiệm của ${lin(a,b,c)} không? Nhập 1 nếu có, 0 nếu không.`,a:1,sol:`${a} · 0 + ${b} · (${y}) = ${c}. Đúng nên nhập 1.`};const ok=R(0,1),cc=ok?c:c+nz();return{q:`Cặp (${x}; ${y}) có là nghiệm của ${lin(a,b,cc)} không? Nhập 1 nếu có, 0 nếu không.`,a:ok?1:0,sol:`${a} · (${x}) + ${b} · (${y}) = ${c}${ok?' = vế phải. Có.':` ≠ ${cc}. Không.`}`}},
  ()=>{let x;do{x=pick([-3,-2,-1,1,2,3])}while(!x);const y=R(-5,5),m=nz(),a=nz(),b=nz(),c=a*x+b*y,d=m*x+y;return{q:`Hệ ${sys(lin(a,b,c),`mx + y = ${d}`)} có nghiệm (${x}; ${y}). Tìm m.`,a:m,sol:`Thay vào phương trình thứ hai: m · (${x}) + (${y}) = ${d} → m = ${m}.`}}]},
 {id:'g9b2',title:'Bài 2. Giải hệ hai phương trình bậc nhất hai ẩn',video:true,slides:[
  {t:'Bài 2 · Giải hệ phương trình',h:'<p>Hai cách chính:</p><p>1. <b>Phương pháp thế</b>: rút một ẩn từ một phương trình, thế vào phương trình kia.</p><p>2. <b>Phương pháp cộng đại số</b>: cộng hoặc trừ hai phương trình để khử một ẩn.</p>',say:'Chào các em! Có hai cách chính để giải hệ hai phương trình bậc nhất hai ẩn: phương pháp thế, và phương pháp cộng đại số.'},
  {t:'Phương pháp thế',h:`<p>${sys('x + 2y = 7','3x − y = 7')}</p><p>Từ (1): x = 7 − 2y. Thế vào (2): 3(7 − 2y) − y = 7 → 21 − 7y = 7 → y = 2.</p><p>x = 7 − 4 = 3. &nbsp;Nghiệm <b>(3; 2)</b>.</p>`,say:'Phương pháp thế: từ phương trình một rút x bằng bảy trừ hai y. Thế vào phương trình hai: ba nhân bảy trừ hai y, trừ y bằng bảy, được y bằng hai. Suy ra x bằng ba. Nghiệm là ba, hai.'},
  {t:'Phương pháp cộng đại số',h:`<p>${sys('2x + 3y = 13','2x − y = 1')}</p><p>Trừ vế theo vế: 4y = 12 → y = 3. &nbsp;Thay vào: 2x − 3 = 1 → x = 2.</p><p>Nghiệm <b>(2; 3)</b>.</p>`,say:'Phương pháp cộng đại số: hai phương trình có cùng hệ số hai x, ta trừ vế theo vế để khử x, được bốn y bằng mười hai, y bằng ba. Thay lại được x bằng hai. Nghiệm là hai, ba.'},
  {t:'Khi hệ số chưa bằng nhau',h:`<p>${sys('3x + 2y = 8','x − y = 1')} &nbsp; Nhân (2) với 2: 2x − 2y = 2.</p><p>Cộng với (1): 5x = 10 → x = 2, y = 1.</p>`,say:'Nếu hệ số chưa bằng nhau, ta nhân một phương trình với một số thích hợp. Nhân phương trình hai với hai được hai x trừ hai y bằng hai. Cộng với phương trình một, khử y, được x bằng hai, y bằng một.'},
  {t:'Ghi nhớ',h:'<p>• Thế: hợp khi có ẩn với hệ số 1 hoặc −1.</p><p>• Cộng đại số: làm cho hệ số một ẩn bằng nhau (hoặc đối nhau).</p><p>• Luôn thay nghiệm vào cả hai phương trình để kiểm tra.</p><p class="muted">Nhập nghiệm dạng: 3; 2</p>',say:'Ghi nhớ: dùng phương pháp thế khi có ẩn với hệ số một hoặc âm một. Dùng cộng đại số khi làm cho hệ số của một ẩn bằng nhau hoặc đối nhau. Luôn kiểm tra nghiệm bằng cả hai phương trình. Khi trả lời, em nhập x chấm phẩy y nhé.'}],
  gen:[
  ()=>{const x=R(-6,9),y=R(-6,9);return{q:`Giải hệ ${sys(`x + y = ${x+y}`,`x − y = ${x-y}`)}`,pair:[x,y],sol:`Cộng hai phương trình: 2x = ${2*x} → x = ${x}; y = ${x+y} − (${x}) = ${y}. Nghiệm (${x}; ${y}).`}},
  ()=>{const x=R(-5,6),y=R(-5,6),a=R(1,4),b=nz(),d=nz();const c=a*x+b*y,e=x+d*y;return{q:`Giải hệ ${sys(lin(a,b,c),lin(1,d,e))}`,pair:[x,y],sol:`Từ phương trình hai: x = ${e} ${d>0?'−':'+'} ${Math.abs(d)}y. Thế vào phương trình một rồi giải được y = ${y}, x = ${x}.`}},
  ()=>{let a,b,c,d;do{a=nz();b=nz();c=nz();d=nz()}while(a*d-b*c===0);const x=R(-5,5),y=R(-5,5);return{q:`Giải hệ ${sys(lin(a,b,a*x+b*y),lin(c,d,c*x+d*y))}`,pair:[x,y],sol:`Nhân để hệ số của x bằng nhau rồi trừ vế theo vế: y = ${y}; thay lại: x = ${x}. Nghiệm (${x}; ${y}).`}}]},
 {id:'g9b3',title:'Bài 3. Giải bài toán bằng cách lập hệ phương trình',video:true,slides:[
  {t:'Bài 3 · Giải toán bằng cách lập hệ',h:'<p>1. Chọn hai ẩn, đặt đơn vị và điều kiện.</p><p>2. Biểu diễn các đại lượng, lập hai phương trình.</p><p>3. Giải hệ.</p><p>4. Đối chiếu điều kiện, trả lời.</p>',say:'Chào các em! Giải bài toán bằng cách lập hệ phương trình có bốn bước: chọn hai ẩn và điều kiện; lập hai phương trình; giải hệ; rồi đối chiếu điều kiện và trả lời.'},
  {t:'Ví dụ: gà và chó',h:`<p>Có 36 con gà và chó, tổng 100 chân. Mỗi loại bao nhiêu con?</p><p>Gọi số gà x, số chó y (x, y ∈ ℕ): ${sys('x + y = 36','2x + 4y = 100')}</p><p>Giải được x = 22, y = 14.</p>`,say:'Ví dụ: có ba mươi sáu con gà và chó, tổng cộng một trăm chân. Gọi số gà là x, số chó là y. Ta có x cộng y bằng ba mươi sáu, và hai x cộng bốn y bằng một trăm. Giải hệ được hai mươi hai con gà và mười bốn con chó.'},
  {t:'Ví dụ: mua đồ',h:`<p>Mua 3 vở và 2 bút hết 34 nghìn; 2 vở và 3 bút hết 31 nghìn. Giá mỗi thứ?</p><p>${sys('3x + 2y = 34','2x + 3y = 31')} → x = 8, y = 5.</p><p>Vở 8 nghìn, bút 5 nghìn.</p>`,say:'Ví dụ khác: mua ba quyển vở và hai cái bút hết ba mươi tư nghìn, mua hai vở và ba bút hết ba mươi mốt nghìn. Gọi giá vở là x, giá bút là y. Giải hệ được vở tám nghìn, bút năm nghìn.'},
  {t:'Ghi nhớ',h:'<p>• Đặt ẩn rõ ràng, có đơn vị và điều kiện.</p><p>• Mỗi dữ kiện cho một phương trình.</p><p>• Kiểm tra nghiệm có thỏa mãn điều kiện không (số con phải là số tự nhiên…).</p>',say:'Ghi nhớ: đặt ẩn rõ ràng, có đơn vị và điều kiện. Mỗi dữ kiện của đề cho ta một phương trình. Cuối cùng kiểm tra nghiệm có hợp lý không, ví dụ số con vật phải là số tự nhiên. Vào đảo nào!'}],
  gen:[
  ()=>{const a=R(20,90),b=R(5,a-1);return{q:`Tổng hai số là ${a+b}, hiệu của số lớn và số nhỏ là ${a-b}. Tìm số lớn.`,a:a,sol:`${sys(`x + y = ${a+b}`,`x − y = ${a-b}`)} → 2x = ${2*a}, số lớn x = ${a} (số nhỏ ${b}).`}},
  ()=>{const g=R(5,40),c=R(5,30);return{q:`Vừa gà vừa chó có ${g+c} con, tổng ${2*g+4*c} chân. Có bao nhiêu con chó?`,a:c,sol:`${sys(`x + y = ${g+c}`,`2x + 4y = ${2*g+4*c}`)} (x gà, y chó) → y = ${c}, x = ${g}.`}},
  ()=>{let a,b,c,d;do{a=R(1,5);b=R(1,5);c=R(1,5);d=R(1,5)}while(a*d-b*c===0);const x=R(3,15),y=R(2,12);return{q:`Mua ${a} quyển vở và ${b} cái bút hết ${a*x+b*y} nghìn đồng; mua ${c} quyển vở và ${d} cái bút hết ${c*x+d*y} nghìn đồng. Giá một quyển vở là bao nhiêu nghìn đồng?`,a:x,sol:`${sys(lin(a,b,a*x+b*y),lin(c,d,c*x+d*y))} (x: giá vở, y: giá bút) → x = ${x}, y = ${y}.`}}]}
];

P1_6.find(x=>x.id==='b2').slides=SLIDES6.b2;P1_6.find(x=>x.id==='b2').video=true;
P1_6.find(x=>x.id==='b3').slides=SLIDES6.b3;P1_6.find(x=>x.id==='b3').video=true;
export const P1BY={6:P1_6,7:P1_7,8:P1_8,9:P1_9};
export const ALLP1=[...P1_6,...P1_7,...P1_8,...P1_9];
export const L1=st=>P1BY[st.grade];
export const NEED=k=>2*k;   // tổng sao cần có để mở đảo thứ k của Phần I
export const BOOK={6:'Chương I. Tập hợp các số tự nhiên',7:'Chương I. Số hữu tỉ',8:'Chương I. Đa thức',9:'Chương I. Phương trình và hệ hai phương trình bậc nhất hai ẩn'};
export const M1=['Màn 1 · Cơ bản','Màn 2 · Hiểu','Màn 3 · Vận dụng'];
export const P1_Q=5, P1_PASS=4;

