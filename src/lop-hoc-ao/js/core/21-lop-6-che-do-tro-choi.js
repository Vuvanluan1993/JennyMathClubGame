/* =====================================================================
   LỚP 6 · PHẦN I · CHẾ ĐỘ TRÒ CHƠI
   - Màn chơi toàn màn hình, bàn phím số riêng (không bật bàn phím máy)
   - 6 kiểu câu: num, choice, tf, pick, order, line
   - 3 trái tim, combo, xây cầu, trùm đảo, rương, đảo nhà, bão đảo cũ, nhiệm vụ ngày
   ===================================================================== */
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
function mkChoice(q,ans,cands,sol,show){const s=[ans];for(const c of cands){if(s.length>=4)break;if(c!==ans&&!s.includes(c)&&(typeof c!=='number'||c>=0))s.push(c)}let d=1;while(s.length<4&&typeof ans==='number'){if(!s.includes(ans+d))s.push(ans+d);d++}const o=shuf(s);return{type:'choice',q,opts:o.map(x=>show?show(x):typeof x==='number'?fmt(x):x),a:o.indexOf(ans),sol}}
const tf=(q,a,sol)=>({type:'tf',q,a,sol});
const N=(q,a,sol)=>({type:'num',q,a,sol});
const setTxt=a=>'{'+a.join('; ')+'}';

const G6={
 b1:{boss:['🐙','Bạch tuộc Tập Hợp'],lv:[
  [()=>{const A=shuf(range(1,9)).slice(0,4).sort((x,y)=>x-y),x=R(1,9),ok=A.includes(x);return tf(`Cho A = ${setTxt(A)}.<br>Khẳng định: <b>${x} ∈ A</b>`,ok,ok?`${x} có trong A nên ${x} ∈ A.`:`${x} không có trong A, phải viết ${x} ∉ A.`)},
   ()=>{const lo=R(1,4),hi=lo+R(3,4),opts=range(Math.max(0,lo-1),hi+2);return{type:'pick',q:`Chạm vào <b>tất cả</b> phần tử của<br>A = {x ∈ ℕ | ${lo} &lt; x ≤ ${hi}}`,opts:opts.map(String),a:opts.map((v,i)=>v>lo&&v<=hi?i:-1).filter(i=>i>=0),sol:`A = ${setTxt(range(lo+1,hi))}: không lấy ${lo}, có lấy ${hi}.`}},
   ()=>{const a=R(1,9),b=a+R(4,9);return N(`Cho A = {x ∈ ℕ | ${a} &lt; x ≤ ${b}}.<br>A có bao nhiêu phần tử?`,b-a,`A = ${setTxt(range(a+1,b))}, có ${b-a} phần tử.`)}],
  [()=>{const w=pick(['JENNY','HANOI','BANANA','KANGAROO','OLYMPIC','SAIGON','TOANHOC']),u=[...new Set(w)];return N(`M là tập hợp các chữ cái trong từ <b>“${w}”</b>.<br>M có bao nhiêu phần tử?`,u.length,`M = ${setTxt(u)}. Mỗi chữ cái chỉ viết một lần.`)},
   ()=>{const t=shuf(['a','b','c','d']).slice(0,3).sort();return mkChoice('Cách viết tập hợp nào <b>đúng</b>?',`{${t.join('; ')}}`,[`(${t.join('; ')})`,`[${t.join('; ')}]`,`{${t[0]}; ${t[1]}; ${t[1]}; ${t[2]}}`],'Tập hợp viết trong ngoặc nhọn { }, mỗi phần tử chỉ viết một lần.')},
   ()=>{const n=R(6,10),ev=range(0,n-1).filter(v=>v%2===0),opts=[...ev,...shuf(range(0,11).filter(v=>!ev.includes(v))).slice(0,8-ev.length)].sort((x,y)=>x-y);return{type:'pick',q:`Chạm vào các phần tử của<br>B = {x ∈ ℕ | x chẵn, x &lt; ${n}}`,opts:opts.map(String),a:opts.map((v,i)=>v%2===0&&v<n?i:-1).filter(i=>i>=0),sol:`B = ${setTxt(range(0,n-1).filter(v=>v%2===0))}. Nhớ: 0 cũng là số chẵn.`}}],
  [()=>{const d=pick([2,3,5]),a=R(1,20),k=R(10,40),b=a+d*k;return N(`B = {${a}; ${a+d}; ${a+2*d}; …; ${b}}.<br>B có bao nhiêu phần tử?`,k+1,`(${b} − ${a}) : ${d} + 1 = ${k+1}.`)},
   ()=>{const s=R(3,12),L=range(10,99).filter(n=>Math.floor(n/10)+n%10===s);return N(`Có bao nhiêu số có hai chữ số mà tổng hai chữ số bằng ${s}?`,L.length,`Đó là ${L.join(', ')}.`)},
   ()=>mkChoice('Số 0 thuộc tập hợp nào?','ℕ nhưng không thuộc ℕ*',['ℕ*','Cả ℕ và ℕ*','Không thuộc tập nào'],'ℕ = {0; 1; 2; …}, còn ℕ* bỏ số 0.')]]},
 b2:{boss:['🦀','Cua La Mã'],lv:[
  [()=>{let n;do{n=R(1000,9999)}while(new Set(String(n)).size<4);const s=String(n),i=R(0,3),d=+s[i],p=3-i,v=d*10**p;return mkChoice(`Trong số <b>${fmt(n)}</b>, chữ số ${d} có giá trị bằng bao nhiêu?`,v,[d,d*10**((p+1)%4),d*10**((p+2)%4),d*10**((p+3)%4)],`Chữ số ${d} ở hàng ${['đơn vị','chục','trăm','nghìn'][p]}.`)},
   ()=>{const n=R(1,20);return N(`Số La Mã <b>${roman(n)}</b> bằng bao nhiêu?`,n,`${roman(n)} = ${n}.`)},
   ()=>{let n;do{n=R(1000,9999)}while(new Set(String(n)).size<4);const s=String(n),i=R(0,3),d=+s[i],p=3-i,claim=R(0,1)?d*10**p:d*10**((p+1)%4);return tf(`Trong số ${fmt(n)}, chữ số ${d} có giá trị <b>${fmt(claim)}</b>.`,claim===d*10**p,`Chữ số ${d} ở hàng ${['đơn vị','chục','trăm','nghìn'][p]}, giá trị ${fmt(d*10**p)}.`)}],
  [()=>{const n=R(21,99);return N(`Số La Mã <b>${roman(n)}</b> bằng bao nhiêu?`,n,`${roman(n)} = ${n}.`)},
   ()=>{const n=pick([4,9,14,19,24,29,40,44,49,90,94,99]);const wrong=[n===4?'IIII':'I'+roman(n+1),roman(n).replace('IV','IIII').replace('IX','VIIII').replace('XL','XXXX').replace('XC','LXXXX'),roman(n+10)];return mkChoice(`Số <b>${n}</b> viết bằng số La Mã là:`,roman(n),wrong,`${n} = ${roman(n)}. Nhỏ đứng trước lớn thì trừ; không viết một chữ quá ba lần liền.`)},
   ()=>{const n=R(1000,99999);return N(`Số ${fmt(n)} có bao nhiêu <b>trăm</b>?`,Math.floor(n/100),`Bỏ hai chữ số cuối: ${Math.floor(n/100)} trăm.`)}],
  [()=>{const v=shuf(range(4,60)).slice(0,4);return{type:'order',q:'Sắp xếp các số La Mã từ <b>bé đến lớn</b>',opts:v.map(roman),a:v.map((x,i)=>[x,i]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]),sol:v.slice().sort((x,y)=>x-y).map(x=>`${roman(x)} = ${x}`).join(' &lt; ')}},
   ()=>{const d=R(0,9);let best=0;for(let n=9999;n>=1000;n--){const s=String(n);if(new Set(s).size===4&&+s[3]===d){best=n;break}}return N(`Số lớn nhất có bốn chữ số khác nhau mà chữ số hàng đơn vị là ${d}?`,best,`Giữ ${d} ở hàng đơn vị, các hàng còn lại chọn chữ số lớn nhất chưa dùng.`)},
   ()=>{const n=R(100,999);return N(`Số ${fmt(n*10+R(0,9))} có bao nhiêu <b>chục</b>?`,null,'')}]]},
 b3:{boss:['🐍','Rắn Tia Số'],lv:[
  [()=>{const k=R(0,9);return{type:'line',q:`Chạm vào <b>số liền sau</b> của ${k} trên tia số`,lo:0,hi:10,a:k+1,sol:`Số liền sau của ${k} là ${k}+1 = ${k+1}.`}},
   ()=>{const k=R(1,10);return{type:'line',q:`Chạm vào <b>số liền trước</b> của ${k} trên tia số`,lo:0,hi:10,a:k-1,sol:`Số liền trước của ${k} là ${k}−1 = ${k-1}.`}},
   ()=>{const a=R(10,999),b=R(10,999),ok=a<b;return tf(`Trên tia số, điểm ${a} nằm <b>bên trái</b> điểm ${b}.`,ok,ok?`${a} &lt; ${b} nên nằm bên trái.`:`${a} ${a===b?'=':'&gt;'} ${b} nên không nằm bên trái.`)}],
  [()=>{const base=R(10,99)*1000,v=shuf(range(0,999)).slice(0,4).map(x=>base+x);return{type:'order',q:'Sắp xếp từ <b>bé đến lớn</b>',opts:v.map(fmt),a:v.map((x,i)=>[x,i]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]),sol:v.slice().sort((x,y)=>x-y).map(fmt).join(' &lt; ')}},
   ()=>{const a=R(5,60),b=a+R(5,40);return N(`Có bao nhiêu số tự nhiên x mà ${a} &lt; x &lt; ${b}?`,b-a-1,`x từ ${a+1} đến ${b-1}: ${b-1} − ${a+1} + 1 = ${b-a-1}.`)},
   ()=>{const n=R(100,99999);return N(`Số liền sau của ${fmt(n)} là?`,n+1,`${fmt(n)} + 1 = ${fmt(n+1)}.`)}],
  [()=>{const a=R(10,80),b=a+R(20,90),f=a%2?a:a+1,l=b%2?b:b-1,c=(l-f)/2+1;return N(`Có bao nhiêu số <b>lẻ</b> x mà ${a} ≤ x ≤ ${b}?`,c,`Từ ${f} đến ${l}, cách 2: (${l} − ${f}) : 2 + 1 = ${c}.`)},
   ()=>{const a=R(2,6),b=a+R(3,4),opts=range(Math.max(0,a-2),b+2);return{type:'pick',q:`Chạm vào các số x thỏa mãn <b>${a} ≤ x &lt; ${b}</b>`,opts:opts.map(String),a:opts.map((v,i)=>v>=a&&v<b?i:-1).filter(i=>i>=0),sol:`Lấy ${a}, không lấy ${b}: ${range(a,b-1).join(', ')}.`}},
   ()=>{const a=R(20,90);return N(`Có bao nhiêu số tự nhiên x mà x ≤ ${a}?`,a+1,`Từ 0 đến ${a} có ${a} + 1 = ${a+1} số (nhớ tính số 0).`)}]]},
 b4:{boss:['🦈','Cá mập Cộng Trừ'],lv:[
  [()=>{const a=R(100,999),b=R(100,999);return N(`${a} + ${b} = ?`,a+b,`${a} + ${b} = ${fmt(a+b)}.`)},
   ()=>{const a=R(300,999),b=R(100,a-1),d=a-b;return mkChoice(`${a} − ${b} = ?`,d,[d+10,d-10,d+100,a+b],`${a} − ${b} = ${d}.`)},
   ()=>{const a=R(10,99),b=R(10,99);return tf(`${a} + ${b} = ${b} + ${a}`,true,'Phép cộng có tính chất giao hoán.')}],
  [()=>{const x=R(20,500),a=R(20,500);return N(`Tìm x, biết <b>x + ${a} = ${x+a}</b>`,x,`x = ${x+a} − ${a} = ${x}.`)},
   ()=>{const x=R(20,500),a=R(20,500);return N(`Tìm x, biết <b>x − ${a} = ${x}</b>`,x+a,`x = ${x} + ${a} = ${x+a}.`)},
   ()=>{const x=R(20,300),a=R(20,300),cl=R(0,1)?x:x+pick([10,-10,1]);return tf(`Nếu ${x+a} − x = ${a} thì x = <b>${cl}</b>.`,cl===x,`x = ${x+a} − ${a} = ${x}.`)}],
  [()=>{const p=pick([100,200,1000]),a=R(11,p-11),b=p-a,c=R(100,900);return N(`Tính nhanh: ${a} + ${c} + ${b}`,a+b+c,`(${a} + ${b}) + ${c} = ${p} + ${c}.`)},
   ()=>{const p=pick([100,200]),a=R(11,p-11),b=p-a;let o=[a,b];while(o.length<6){const x=R(11,p-11);if(!o.includes(x)&&!o.some(y=>y+x===p)&&x*2!==p)o.push(x)}o=shuf(o);return{type:'pick',q:`Chạm vào <b>hai số</b> có tổng bằng ${p}`,opts:o.map(String),a:[o.indexOf(a),o.indexOf(b)].sort((x,y)=>x-y),sol:`${a} + ${b} = ${p}.`}},
   ()=>{const a=R(2,9)*100+R(1,99),b=R(1,9);return N(`Tính nhanh: ${a} + ${100-b} − 100`,a-b,`${100-b} − 100 bớt đi ${b}, nên kết quả = ${a} − ${b} = ${a-b}.`)}]]},
 b5:{boss:['🪼','Sứa Nhân Chia'],lv:[
  [()=>{const a=R(12,99),b=R(3,9);return N(`${a} · ${b} = ?`,a*b,`${a} · ${b} = ${a*b}.`)},
   ()=>{const a=R(12,99),b=R(3,9);return mkChoice(`${a*b} : ${b} = ?`,a,[a+1,a-1,a+10,b],`Vì ${a} · ${b} = ${a*b}.`)},
   ()=>{const a=R(2,9),b=R(2,9);return tf(`${a} · ${b} = ${b} · ${a}`,true,'Phép nhân có tính chất giao hoán.')}],
  [()=>{const x=R(6,60),a=R(3,15);return N(`Tìm x, biết <b>${a} · x = ${a*x}</b>`,x,`x = ${a*x} : ${a} = ${x}.`)},
   ()=>{const x=R(6,60),a=R(3,15);return N(`Tìm x, biết <b>x : ${a} = ${x}</b>`,a*x,`x = ${x} · ${a} = ${a*x}.`)},
   ()=>{const d=R(3,9),r=R(0,1)?R(0,d-1):d;return tf(`Khi chia cho ${d}, số dư có thể bằng <b>${r}</b>.`,r<d,`Số dư luôn nhỏ hơn số chia: 0 ≤ r &lt; ${d}.`)}],
  [()=>{const d=R(4,12),q=R(10,90),r=R(1,d-1);return N(`Chia ${d*q+r} cho ${d}. Số dư bằng?`,r,`${d*q+r} = ${d} · ${q} + ${r}.`)},
   ()=>{const d=R(4,12),q=R(10,90),r=R(1,d-1);return N(`Số chia ${d}, thương ${q}, số dư ${r}. Số bị chia bằng?`,d*q+r,`${d} · ${q} + ${r} = ${d*q+r}.`)},
   ()=>{const a=R(12,49),b=pick([25,4,5,50]),c=b===25?4:b===4?25:b===5?20:2;return N(`Tính nhanh: ${b} · ${a} · ${c}`,a*b*c,`(${b} · ${c}) · ${a} = ${b*c} · ${a}.`)}]]},
 b6:{boss:['🐉','Rồng Lũy Thừa'],lv:[
  [()=>{const a=R(2,5),n=R(2,a<4?5:3);return N(`Tính ${sup(a,n)}`,a**n,`${Array(n).fill(a).join(' · ')} = ${a**n}.`)},
   ()=>{const a=R(2,5),n=R(2,4);return mkChoice(`${sup(a,n)} = ?`,a**n,[a*n,a+n,n**a],`${sup(a,n)} là tích của ${n} thừa số ${a}, không phải ${a} · ${n}.`)},
   ()=>{const a=R(2,9);return tf(`${sup(a,2)} = ${a} · 2`,a===2,`${sup(a,2)} = ${a} · ${a} = ${a*a}.`)}],
  [()=>{const a=R(2,9),m=R(2,12),n=R(2,12);return N(`${sup(a,m)} · ${sup(a,n)} = ${a}<sup>?</sup>`,m+n,`Cộng số mũ: ${m} + ${n}.`)},
   ()=>{const a=R(2,9),m=R(2,12),n=R(2,12);return N(`${sup(a,m+n)} : ${sup(a,n)} = ${a}<sup>?</sup>`,m,`Trừ số mũ: ${m+n} − ${n}.`)},
   ()=>{const c=shuf([[2,5],[3,3],[5,2],[2,4],[3,2],[4,3],[10,2],[7,2]]).slice(0,4);return{type:'order',q:'Sắp xếp các lũy thừa từ <b>bé đến lớn</b>',opts:c.map(p=>sup(p[0],p[1])),a:c.map((p,i)=>[p[0]**p[1],i]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]),sol:c.slice().sort((x,y)=>x[0]**x[1]-y[0]**y[1]).map(p=>`${sup(p[0],p[1])} = ${p[0]**p[1]}`).join(' &lt; ')}}],
  [()=>{const a=pick([2,3,5]),x=R(2,a===2?9:5);return N(`Tìm x, biết ${a}<sup>x</sup> = ${a**x}`,x,`${a**x} = ${sup(a,x)}.`)},
   ()=>{const x=R(3,14);return N(`Tìm số tự nhiên x, biết x<sup>2</sup> = ${x*x}`,x,`${x} · ${x} = ${x*x}.`)},
   ()=>{const k=R(4,15),opts=shuf([k*k,k*k+1,k*k-2,(k+1)*(k+1)-1]);return{type:'choice',q:'Số nào là <b>số chính phương</b>?',opts:opts.map(fmt),a:opts.indexOf(k*k),sol:`${k*k} = ${sup(k,2)}.`}}]]},
 b7:{boss:['🦑','Mực khổng lồ Dấu Ngoặc'],lv:[
  [()=>{const a=R(10,99),b=R(2,9),c=R(2,9);return N(`${a} + ${b} · ${c} = ?`,a+b*c,`Nhân trước: ${a} + ${b*c} = ${a+b*c}.`)},
   ()=>{const a=R(10,99),b=R(2,9),c=R(2,9);return mkChoice(`Tính ${a} + ${b} · ${c}. Em làm phép nào <b>trước</b>?`,'Phép nhân',['Phép cộng','Từ trái sang phải','Phép nào cũng được'],'Không có ngoặc: lũy thừa → nhân, chia → cộng, trừ.')},
   ()=>{const a=R(10,99),b=R(2,9),c=R(2,9);return mkChoice(`${a} + ${b} · ${c} = ?`,a+b*c,[(a+b)*c,a+b+c,a*b+c],`Nhân trước: ${a} + ${b*c}.`)}],
  [()=>{const a=R(2,20),b=R(2,20),c=R(2,9),d=R(1,(a+b)*c-1);return N(`(${a} + ${b}) · ${c} − ${d} = ?`,(a+b)*c-d,`Trong ngoặc trước: ${a+b} · ${c} − ${d}.`)},
   ()=>{const A=R(2,9),b=R(2,9),c=R(2,9);return N(`${sup(A,2)} + ${b} · ${c} = ?`,A*A+b*c,`Lũy thừa, nhân, rồi cộng: ${A*A} + ${b*c}.`)},
   ()=>{const a=R(2,9),b=R(2,9),c=R(2,9);return tf(`(${a} + ${b}) · ${c} = ${a} + ${b} · ${c}`,(a+b)*c===a+b*c,`Vế trái = ${(a+b)*c}, vế phải = ${a+b*c}.`)}],
  [()=>{const c=R(20,60),d=R(1,19),b=R(c-d+1,c-d+40),a=R(2,9);return N(`${a} · [${b} − (${c} − ${d})] = ?`,a*(b-(c-d)),`( ) = ${c-d}; [ ] = ${b-(c-d)}; nhân ${a}.`)},
   ()=>{const a=R(50,99),b=R(2,9),c=R(2,5);return N(`${a} − ${b} · ${sup(c,2)} = ?`,a-b*c*c,`${sup(c,2)} = ${c*c}; ${b} · ${c*c} = ${b*c*c}; ${a} − ${b*c*c}.`)},
   ()=>{const x=R(2,20),a=R(2,9),b=R(1,30);return N(`Tìm x, biết ${a} · x + ${b} = ${a*x+b}`,x,`${a} · x = ${a*x+b} − ${b} = ${a*x}; x = ${x}.`)}]]}
};
// sửa câu “số chục” của b2 (cần đáp án tính ngay)
G6.b2.lv[2][2]=()=>{const n=R(1000,9999);return N(`Số ${fmt(n)} có bao nhiêu <b>chục</b>?`,Math.floor(n/10),`Bỏ chữ số cuối: ${Math.floor(n/10)} chục.`)};
const HINT6=Object.fromEntries(P1_6.map(x=>[x.id,x.slides[x.slides.length-1].h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()]));

/* ---------- Đảo nhà, nhiệm vụ, âm thanh ---------- */
const DECOR=[['palm','🌴','Cây dừa',30],['crab','🦀','Bạn cua',40],['umb','⛱️','Ô che nắng',45],['turtle','🐢','Rùa biển',50],['castle','🏰','Lâu đài cát',60],['boat','⛵','Thuyền buồm',80],['flag','🚩','Cờ CLB Jenny',100],['light','🗼','Hải đăng',120]];
const SLOT={palm:[22,38],crab:[36,70],umb:[58,48],turtle:[78,74],castle:[46,30],boat:[86,52],flag:[66,22],light:[12,62]};
const REV6=[1,3,7];
function g6s(st,id){const s=st.p1[id];if(s.md===undefined){s.md=s.m.every(Boolean)?Math.max(1,S.day-1):null;s.ri=0}if(!s.med)s.med=s.m.map(v=>v?2:0);return s}
const MEDAL=['','🥉','🥈','🥇'],MEDN=['','Đồng','Bạc','Vàng'];
const weakIsland=(st,id)=>{const s=g6s(st,id);return s.med.some((m,i)=>s.m[i]&&m===1)};
function mist(st){st.mist=st.mist||{};return st.mist}
function mistAdd(q){if(!q.key)return;const M=mist(S.st[sid]),e=M[q.key]||(M[q.key]={id:q.src[0],lv:q.src[1],gi:q.src[2],label:q.label,n:0,streak:0,day:S.day});e.n++;e.streak=0;e.day=S.day}
const qLabel=(id,q)=>shortTitle(unit(1,id).title)+' · '+q.q.replace(/<br>/g,' ').replace(/<[^>]+>/g,'').replace(/&lt;/g,'<').replace(/\d+/g,'…').replace(/(…[ ;,]*){3,}/g,'… ').slice(0,52);
const stormDue=(st,id)=>{const s=g6s(st,id);return s.m.every(Boolean)&&s.md!==null&&s.ri<3&&S.day>=s.md+REV6[s.ri]};
function quest(st){st.q=st.q||{};if(!st.q[S.day])st.q[S.day]={ok:0,pass:0,combo:0,fix:0,paid:[]};return st.q[S.day]}
const QUESTS=[['ok',10,'Trả lời đúng 10 câu'],['pass',1,'Qua 1 màn'],['combo',1,'Đạt combo 3 câu đúng liền'],['fix',2,'Sửa xong 2 lỗi trong Sổ lỗi sai']];
function streak(st){let n=0;for(let d=S.day;d>=1;d--){const has=S.events.some(e=>e.actor.account.name===sid&&evDay(e)===d&&e.verb.id.endsWith('answered')&&e.result.success);if(has)n++;else if(d===S.day)continue;else break}return n}
let muted=false;try{muted=localStorage.getItem('jennyMute')==='1'}catch(e){}
let AC=null;function sfx(kind){if(muted)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime;const seq={ok:[[660,0],[880,.09]],bad:[[220,0],[180,.12]],combo:[[660,0],[880,.07],[1100,.14]],win:[[523,0],[659,.1],[784,.2],[1046,.3]],hit:[[300,0],[600,.05]],tap:[[500,0]]}[kind]||[];seq.forEach(([f,dt])=>{const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,t+dt);g.gain.exponentialRampToValueAtTime(.18,t+dt+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dt+.16);o.connect(g);g.connect(AC.destination);o.start(t+dt);o.stop(t+dt+.18)})}catch(e){}}
function toggleMute(){muted=!muted;try{localStorage.setItem('jennyMute',muted?'1':'0')}catch(e){}render()}
const buzz=ms=>{try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}};

function centerMap(){const sea=document.getElementById('sea');if(!sea)return;const here=sea.querySelector('.node.here')||sea.querySelector('.node.storm')||[...sea.querySelectorAll('.node:not(.lock)')].pop();if(!here)return;sea.scrollLeft=Math.max(0,here.offsetLeft+here.offsetWidth/2-sea.clientWidth/2)}
window.addEventListener('resize',()=>centerMap());
/* ---------- Trang chính lớp 6 (có thanh điều hướng đáy) ---------- */
function viewHome6(){
  const st=S.st[sid],tab=scr.tab||'map';
  const nav=[['map','🗺️','Bản đồ'],['home','🏝️','Đảo nhà'],['quest','🎯','Nhiệm vụ'],['bag','🎒','Túi đồ']];
  const body=tab==='home'?tabHome(st):tab==='quest'?tabQuest(st):tab==='bag'?tabBag(st):tabMap(st);
  return body+`<nav class="bnav" aria-label="Điều hướng">${nav.map(([k,i,n])=>`<button class="${k===tab?'on':''}" aria-current="${k===tab?'page':'false'}" onclick="go({k:'home',tab:'${k}'})"><span aria-hidden="true">${i}</span>${n}</button>`).join('')}</nav>`;
}
function tabMap(st){
  const P=L1(st),tot=totalStars(st),ck=curIsland(st),qd=quest(st),done=QUESTS.filter(([k,n])=>qd[k]>=n).length,stk=streak(st);
  const W=150,Hh=280;const pts=P.map((_,k)=>[80+k*W,k%2?165:85]);
  const path=pts.map((p,k)=>k?`Q ${p[0]-W/2} ${pts[k-1][1]===85?55:200} ${p[0]} ${p[1]}`:`M ${p[0]} ${p[1]}`).join(' ');
  const nodes=P.map((x,k)=>{const s=g6s(st,x.id),n=s.m.filter(Boolean).length,open=UNL||islandOpen(st,k),storm=stormDue(st,x.id),[cx,cy]=pts[k];
    const state=!open?'lock':storm?'storm':n===3?'done':'cur';
    return`<button class="node ${state}${k===ck?' here':''}" style="left:${cx-55}px;top:${cy-50}px" ${open?`onclick="go({k:'island',part:1,id:'${x.id}'})"`:`onclick="toast('Cần ${NEED(k)} sao để mở đảo này. Em còn thiếu ${NEED(k)-tot} sao.')"`} aria-label="${esc(x.title)}${open?'':' (đang khóa)'}">
      <span class="ball">${spr(state==='lock'?'islandG':'island',60)}${state==='lock'?spr('lock',26,'bdg'):state==='storm'?spr('storm',26,'bdg'):k===ck?spr('jenny',34,'bdg jen'):state==='done'?spr('medG',24,'bdg'):''}</span>
      <span class="lbl"><b>${k+1}. ${esc(shortTitle(x.title))}</b><span class="stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(3-n)}</span></span>${open&&weakIsland(st,x.id)?'<span class="wk">🥉 cần luyện</span>':''}</span>
      ${k===ck?'<span class="flag">Đang học</span>':storm?'<span class="flag warn">Bão! Sửa đảo</span>':''}</button>`}).join('');
  const na=nextAction(st),stormIds=P.filter(x=>stormDue(st,x.id));
  return`<div class="grid">
   <section class="hero sm">${jenny(56)}<div class="grow"><h1>Chào ${esc(st.name.split(' ').pop())}!</h1><div class="chips"><span class="chip"><span style="color:var(--sun)">★</span><b>${tot}</b></span><span class="chip">🪙 <b>${st.coins}</b></span><span class="chip">🔥 <b>${stk}</b> ngày</span><span class="chip">🎯 <b>${done}/3</b></span></div></div></section>
   <section class="card" style="padding:16px 0 8px"><div class="secthead" style="padding:0 16px"><h2>Toán SGK lớp 6</h2><span class="tag free">Miễn phí</span><span class="grow"></span><span class="muted">${p1Stars(st)}/${P.length*3} ★</span></div>
    <div class="sea" id="sea"><div class="seain" style="width:${100+P.length*W}px;height:${Hh}px"><canvas id="seacv" class="seacv" data-live="1" width="${100+P.length*W}" height="${Hh}" data-isl="${JSON.stringify(pts.map(([x,y])=>[x,y-14]))}" aria-hidden="true"></canvas><svg class="route" width="${100+P.length*W}" height="${Hh}" aria-hidden="true"><path d="${path}" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-dasharray="6 9" stroke-linecap="butt" opacity=".9"/></svg>${nodes}</div></div>
    </section>
   ${Object.keys(mist(st)).length?`<button class="pxq mist" onclick="go({k:'home',tab:'quest'})"><span class="pxq-ic">${spr('book',46)}<i class="pxq-n">${Object.keys(mist(st)).length}</i></span><span class="pxq-tx"><b>Sổ lỗi sai</b><span>${Object.keys(mist(st)).length} dạng bài cần sửa · mỗi lỗi sửa xong +5 ${spr('coin',14)}</span><span class="pxq-dots" aria-hidden="true">${Object.keys(mist(st)).slice(0,6).map(()=>'<i></i>').join('')}</span></span><span class="pxq-go">Luyện ▶</span></button>`:''}
   ${stormIds.length?`<button class="pxq storm" onclick="go({k:'island',part:1,id:'${stormIds[0].id}'})"><span class="pxq-ic">${spr('storm',40)}</span><span class="pxq-tx"><b>Bão ập tới!</b><span>${esc(shortTitle(stormIds[0].title))} bị hỏng · làm 3 câu ôn để sửa, nhận 15 ${spr('coin',14)}</span></span><span class="pxq-go">Sửa đảo ▶</span></button>`:''}
   <section class="card paidbox"><div class="secthead"><h2>Toán Jenny</h2><span class="tag paid">Trả phí</span></div><p class="muted" style="margin:0">Phần này sẽ có cách chơi riêng, đang thiết kế. Bản cũ vẫn dùng được:</p><div class="row" style="margin-top:10px">${st.active?P2.filter(x=>!x.draft&&S.open[x.id]).map(x=>`<button class="btn sm" onclick="go({k:'island',part:2,id:'${x.id}'})">${esc(x.title)}</button>`).join('')||'<span class="muted">Chưa có buổi nào được mở.</span>':'<span class="muted">Chưa kích hoạt cho em.</span>'}</div></section>
  </div>`;
}
function tabHome(st){
  st.home=st.home||[];
  const items=DECOR.filter(d=>st.home.includes(d[0]));
  return`<div class="grid"><section class="card"><div class="secthead"><h2>Đảo nhà của ${esc(st.name.split(' ').pop())}</h2><span class="grow"></span><span class="chip2">🪙 <b>${st.coins}</b></span></div>
   <div class="homeisle" role="img" aria-label="Đảo nhà có ${items.length} món trang trí"><div class="isle"></div>${items.map(d=>`<span class="deco" style="left:${SLOT[d[0]][0]}%;top:${SLOT[d[0]][1]}%">${d[1]}</span>`).join('')}<span class="deco pet" style="left:48%;top:56%">${petFace(st.energy)}</span></div>
   <p class="muted" style="margin:10px 0 0">Mua đồ bằng xu kiếm được khi làm bài, hoặc mở rương sau mỗi đảo.</p></section>
   <section class="card"><h3>Cửa hàng</h3><div class="shop">${DECOR.map(([id,ic,n,c])=>{const own=st.home.includes(id);return`<button class="item ${own?'own':''}" ${own?'disabled':''} onclick="buyDecor('${id}')"><span class="ic">${ic}</span><b>${n}</b><span class="muted">${own?'Đã có':`🪙 ${c}`}</span></button>`}).join('')}</div></section>
   <section class="card"><h3>Mèo Mướp</h3><div class="row" style="margin-top:8px;flex-wrap:nowrap"><span class="pet">${petFace(st.energy)}</span><div style="flex:1"><div class="muted">Năng lượng ${st.energy}/100</div><div class="bar leaf"><i style="width:${st.energy}%"></i></div></div></div><div class="row" style="margin-top:10px"><button class="btn sm" onclick="buy(20,25,'Cá khô')">🐟 Cá khô · 20</button><button class="btn sm" onclick="buy(40,50,'Bát sữa')">🥛 Bát sữa · 40</button></div></section></div>`;
}
function buyDecor(id){const st=S.st[sid],d=DECOR.find(x=>x[0]===id);st.home=st.home||[];if(st.coins<d[3]){toast(`Cần ${d[3]} xu. Làm thêm bài để kiếm xu nhé!`);return}st.coins-=d[3];st.home.push(id);log(sid,'purchased',d[2],0,{score:{raw:-d[3]}});sfx('win');save();render();toast(`Đã đặt ${d[2]} lên đảo nhà!`)}
function tabQuest(st){
  const qd=quest(st),stk=streak(st),M=Object.values(mist(st)).sort((a,b)=>b.n-a.n);
  return`<div class="grid">
   <section class="card"><div class="secthead"><h2>📒 Sổ lỗi sai</h2><span class="grow"></span><span class="pill ${M.length?'warn':'ok'}">${M.length} dạng</span></div>
    ${M.length?`<p class="muted" style="margin:0 0 10px">Mỗi lượt luyện 3 dạng, mỗi dạng 2 câu với số mới. Đúng cả 2 câu là dạng đó ra khỏi sổ.</p><ul class="mlist">${M.slice(0,5).map(e=>`<li><span>${esc(e.label)}</span><span class="muted">sai ${e.n} lần${e.streak?` · đã đúng ${e.streak}/2`:''}</span></li>`).join('')}</ul>${M.length>5?`<p class="muted" style="margin:6px 0 0">và ${M.length-5} dạng khác</p>`:''}<button class="gobtn" style="margin-top:12px" onclick="startGame('${M[0].id}','fix')">Luyện ngay</button>`:'<p class="muted" style="margin:0">Sổ đang trống. Câu nào em làm sai sẽ được ghi vào đây để luyện lại.</p>'}</section>
   <section class="card"><div class="secthead"><h2>Nhiệm vụ hôm nay</h2><span class="grow"></span><span class="muted">Ngày ${S.day}</span></div>
   <div class="quests">${QUESTS.map(([k,n,t])=>{const v=Math.min(qd[k]||0,n),ok=v>=n,paid=qd.paid.includes(k);return`<div class="qrow ${ok?'ok':''}"><span class="qic">${ok?'✓':'🎯'}</span><div class="grow"><b>${t}</b><div class="bar ${ok?'leaf':'sun'}"><i style="width:${v/n*100}%"></i></div><span class="muted">${v}/${n}</span></div>${ok&&!paid?`<button class="btn sm sun" onclick="claimQuest('${k}')">Nhận 10 xu</button>`:paid?'<span class="pill ok">Đã nhận</span>':''}</div>`}).join('')}</div></section>
   <section class="card"><h3>Chuỗi ngày học</h3><p style="margin:8px 0 0"><span class="big">🔥 ${stk}</span> <span class="muted">ngày liên tiếp có làm đúng bài</span></p><p class="muted" style="margin:6px 0 0">Mỗi ngày làm đúng ít nhất 1 câu để giữ chuỗi.</p></section></div>`;
}
function claimQuest(k){const st=S.st[sid],qd=quest(st);if(qd.paid.includes(k))return;qd.paid.push(k);st.coins+=10;sfx('win');if(qd.paid.length===QUESTS.length){st.coins+=20;toast('Xong tất cả nhiệm vụ! Thưởng thêm 20 xu')}else toast('+10 xu');save();render()}
function tabBag(st){
  return`<div class="grid"><section class="card"><h3>Huy hiệu</h3><div class="badges" style="margin-top:10px">${st.badges.length?st.badges.map(b=>`<span class="badge ${b.from==='cô'?'t':''}"><i>${b.from==='cô'?'♥':'✓'}</i>${esc(b.t)}</span>`).join(''):'<p class="muted" style="margin:0">Qua đủ 3 màn của một đảo để nhận huy hiệu.</p>'}</div></section>
   <section class="card"><h3>Đồ sưu tầm</h3><p class="muted" style="margin:8px 0 0">${st.items.length?st.items.map(esc).join(' · '):'Mở rương sau mỗi đảo để nhận đồ hiếm.'}</p></section>
   <section class="card"><h3>Cài đặt</h3><div class="row" style="margin-top:8px"><button class="btn sm" onclick="toggleMute()">${muted?'🔇 Bật âm thanh':'🔊 Tắt âm thanh'}</button></div></section></div>`;
}

/* ---------- Trang đảo lớp 6 ---------- */
function viewIsland6(){
  const st=S.st[sid],id=scr.id,u=unit(1,id),s=g6s(st,id),G=G6[id],storm=stormDue(st,id);
  const got=s.m.filter(Boolean).length;
  const mk=(lv,t,d)=>{const can=UNL||s.intro&&(lv===0||s.m[lv-1]),done=s.m[lv],med=s.med[lv]||0,stuck=!done&&s.fails[lv]>=2;
    return{done,can,ic:lv===2?G.boss[0]:String(lv+1),t,d:d+(done?` · ${MEDAL[med]} ${MEDN[med]}`:s.fails[lv]?` · đã thử ${s.fails[lv]} lần`:''),act:`startGame('${id}',${lv})`,lbl:done?(med<3?'Lên Vàng':'Chơi lại'):lv===2?'Đánh trùm':'Chơi',stuck,lv,med}};
  const items=[{done:s.intro,can:true,ic:'▶',t:'Video tổng hợp kiến thức',d:`${u.slides.length} trang · Jenny thuyết minh`,act:`go({k:'video',part:1,id:'${id}'})`,lbl:s.intro?'Xem lại':'Xem'},
    mk(0,'Màn 1 · Xây cầu',`${P1_Q} câu · 3 tim`),mk(1,'Màn 2 · Vượt sóng',`${P1_Q} câu · 3 tim`),mk(2,`Màn 3 · Trùm: ${G.boss[1]}`,`${P1_Q} đòn · 3 tim · rương`)];
  const nx=items.findIndex(x=>!x.done&&x.can);
  const li=(x,i)=>`${x.stuck&&x.can?`<li class="help"><span class="n">🛟</span><div class="grow"><b>Màn tập · Jenny giúp em</b><span class="muted">Em đã thử ${s.fails[x.lv]} lần. Câu dễ hơn, có giải mẫu, không mất tim.</span></div><button class="btn sm sun" onclick="startGame('${id}','easy',${x.lv})">Vào tập</button></li>`:''}<li class="${x.done?'done':''} ${i===nx?'next':''} ${!x.can&&!x.done?'off':''} ${x.med===1?'weak':''}"><span class="n">${x.done?MEDAL[x.med]||'✓':x.ic}</span><div class="grow"><b>${x.t}</b><span class="muted">${x.d}</span></div><button class="btn sm ${i===nx||(x.done&&x.med===1)?'pri':''}" ${x.can?'':'disabled'} onclick="${x.act}">${x.can?x.lbl:'🔒'}</button></li>`;
  return`<div class="page">
   <div class="crumb"><button class="btn sm ghost" onclick="go({k:'home'})">← Bản đồ</button></div>
   <div class="card"><div class="lesson">${jenny(56)}<div class="grow"><h1>${esc(u.title)}</h1><div class="muted">Kết nối tri thức 6 · Chương I</div></div>${bigStars(got,3)}</div>
   ${storm?`<div class="alertbar" style="margin-top:12px" role="note">⛈️ <span><b>Bão đã quét qua đảo này!</b> Làm 3 câu ôn để sửa lại, nhận 15 xu.</span><button class="btn sm sun" onclick="startGame('${id}','storm')">Sửa đảo</button></div>`:''}
   ${weakIsland(st,id)?`<div class="alertbar" style="margin-top:12px" role="note">🥉 <span><b>Có màn mới đạt Đồng.</b> Chơi lại giữ nhiều tim hơn để lên Bạc, Vàng và nhận thêm xu.</span></div>`:''}
   <ol class="tl">${items.map(li).join('')}</ol>
   <p class="muted" style="margin:12px 0 0">Huy chương theo số tim còn lại khi qua màn: 3 tim 🥇 Vàng · 2 tim 🥈 Bạc · 1 tim 🥉 Đồng.</p></div></div>`;
}
/* ---------- Màn chơi ---------- */
function startGame(id,lv,base){
  const G=G6[id];let qs,mode='main';
  const mk=(L,gi,isl)=>{const q=G6[isl].lv[L][gi]();return{...q,src:[isl,L,gi],key:`${isl}:${L}:${gi}`,label:qLabel(isl,q),hint:q.hint||HINT6[isl]}};
  if(lv==='storm'){mode='storm';qs=[0,1,2].map(L=>mk(L,R(0,G.lv[L].length-1),id))}
  else if(lv==='fix'){mode='fix';const es=Object.values(mist(S.st[sid])).sort((a,b)=>a.day-b.day);qs=es.slice(0,3).flatMap(e=>[mk(e.lv,e.gi,e.id),mk(e.lv,e.gi,e.id)])}
  else if(lv==='easy'){mode='easy';const L=Math.max(0,base-1),pool=shuf(G.lv[L].map((_,i)=>i));qs=Array.from({length:P1_Q},(_,k)=>mk(L,pool[k%pool.length],id))}
  else{const pool=shuf(G.lv[lv].map((_,i)=>i));qs=Array.from({length:P1_Q},(_,k)=>mk(lv,pool[k%pool.length],id))}
  const demo=mode==='easy'?mk(Math.max(0,base-1),R(0,G.lv[Math.max(0,base-1)].length-1),id):null;
  go({k:'game',id,lv,base,mode,qs,j:0,hearts:3,combo:0,best:0,ok:0,tries:0,inp:'',picks:[],seq:[],res:[],sheet:null,t0:Date.now(),hp:lv===2?P1_Q:0,demo,fixed:0});
}
function gameQ(){return scr.qs[scr.j]}
function viewGame(){
  const g=scr,u=unit(1,g.id),G=G6[g.id],n=g.qs.length;
  if(g.end)return viewGameEnd();
  const q=gameQ(),boss=g.lv===2,soft=g.mode==='fix'||g.mode==='easy';
  if(g.demo)return`<div class="game" role="dialog" aria-label="Jenny giải mẫu"><div class="gtop"><button class="gx" onclick="go({k:'island',part:1,id:'${g.id}'})" aria-label="Thoát">✕</button><b style="flex:1">Màn tập · Jenny giải mẫu</b></div>
   <div class="gmid"><div class="scene">${jenny(72)}</div><div class="qtxt">${g.demo.q}</div><div class="sheet ok" style="animation:none"><div class="sh"><span class="ic">✓</span><div><b>Đáp án: ${ansShow(g.demo)}</b><div>${g.demo.sol}</div></div></div></div><p class="muted" style="text-align:center;margin:0">Màn tập không mất tim. Bấm 💡 nếu cần gợi ý.</p></div>
   <div class="gbot"><button class="gobtn" onclick="scr.demo=null;render()">Em hiểu rồi, làm thử nào!</button></div></div>`;
  const hearts=soft?`<span class="pill acc">${g.mode==='fix'?'📒 Sổ lỗi sai':'Màn tập'}</span>`:`<span class="hearts" aria-label="Còn ${g.hearts} tim">${[0,1,2].map(i=>`<span class="${i<g.hearts?'':'lost'}">❤</span>`).join('')}</span>`;
  const track=boss?`<div class="bosshp" aria-label="Máu trùm ${g.hp}/${n}"><i style="width:${g.hp/n*100}%"></i></div>`:`<div class="planks" aria-label="Tiến độ ${g.ok}/${n}">${g.qs.map((_,k)=>`<i class="${g.res[k]===true?'ok':g.res[k]===false?'bad':k===g.j?'cur':''}"></i>`).join('')}</div>`;
  const scene=boss?`<div class="scene boss"><span class="monster ${g.hit?'hit':''}" aria-hidden="true">${G.boss[0]}</span><span class="muted">${G.boss[1]}</span></div>`:g.mode==='storm'?`<div class="scene"><span class="monster" aria-hidden="true">⛈️</span><span class="muted">Sửa đảo sau bão</span></div>`:g.mode==='fix'?`<div class="muted" style="text-align:center">Dạng bài em từng làm sai · ${esc(shortTitle(unit(1,q.src[0]).title))}</div>`:'';
  const hintBtn=soft&&!g.sheet?`<button class="btn sm ghost" style="align-self:center" onclick="scr.showHint=!scr.showHint;render()">💡 ${g.showHint?'Ẩn gợi ý':'Gợi ý'}</button>${g.showHint?`<div class="sheet warn" style="animation:none;padding:10px 12px"><div class="sh"><span class="ic">?</span><div>${q.hint}</div></div></div>`:''}`:'';
  return`<div class="game" role="dialog" aria-label="${esc(u.title)}">
   <div class="gtop"><button class="gx" onclick="go({k:'island',part:1,id:'${g.id}'})" aria-label="Thoát màn">✕</button>${track}${hearts}</div>
   ${g.combo>=3?`<div class="combo">Combo ×${g.combo} · xu ×2</div>`:''}
   <div class="gmid">${scene}<div class="qtxt">${q.q}</div>${answerView(q)}${hintBtn}</div>
   <div class="gbot">${g.sheet?sheetView():inputView(q)}</div></div>`;
}
function answerView(q){const g=scr;
  if(q.type==='num')return`<div class="slotbox ${g.inp?'':'empty'}" aria-live="polite">${g.inp?esc(g.inp):'?'}</div>`;
  if(q.type==='order')return`<div class="seq">${q.opts.map((_,k)=>`<span class="slot"><span>${g.seq[k]!==undefined?q.opts[g.seq[k]]:''}</span></span>`).join('<span class="lt">&lt;</span>')}</div>`;
  return'';
}
function inputView(q){const g=scr,dis=g.sheet?'disabled':'';
  if(q.type==='num')return`<div class="pad">${['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map(k=>`<button class="${k==='✓'?'go':k==='⌫'?'del':''}" onclick="padKey('${k}')" aria-label="${k==='⌫'?'Xóa':k==='✓'?'Nộp':k}">${k==='✓'?'Nộp':k}</button>`).join('')}</div>`;
  if(q.type==='choice')return`<div class="opts">${q.opts.map((o,i)=>`<button onclick="answer(${i})">${o}</button>`).join('')}</div>`;
  if(q.type==='tf')return`<div class="opts two"><button class="t" onclick="answer(true)">✓ Đúng</button><button class="f" onclick="answer(false)">✕ Sai</button></div>`;
  if(q.type==='pick')return`<div class="chips2">${q.opts.map((o,i)=>`<button class="${g.picks.includes(i)?'on':''}" aria-pressed="${g.picks.includes(i)}" onclick="togglePick(${i})">${o}</button>`).join('')}</div><button class="gobtn" ${g.picks.length?'':'disabled'} onclick="answer(scr.picks)">Kiểm tra</button>`;
  if(q.type==='order')return`<div class="chips2">${q.opts.map((o,i)=>`<button ${g.seq.includes(i)?'disabled class="used"':''} onclick="seqTap(${i})">${o}</button>`).join('')}</div><button class="gobtn ghost" ${g.seq.length?'':'disabled'} onclick="scr.seq=[];render()">Xếp lại</button>`;
  if(q.type==='line'){const n=q.hi-q.lo;return`<div class="nline"><div class="axis"></div>${range(q.lo,q.hi).map(v=>`<button style="left:${(v-q.lo)/n*100}%" onclick="answer(${v})" aria-label="Điểm ${v}"><i></i><span>${v===q.lo||v===q.hi||v===(q.lo+q.hi)/2?v:''}</span></button>`).join('')}</div><p class="muted" style="text-align:center;margin:6px 0 0">Mỗi vạch cách nhau 1 đơn vị</p>`}
}
function padKey(k){if(scr.sheet)return;sfx('tap');if(k==='⌫')scr.inp=scr.inp.slice(0,-1);else if(k==='✓'){if(scr.inp!=='')answer(Number(scr.inp));return}else if(scr.inp.length<9)scr.inp=(scr.inp==='0'?'':scr.inp)+k;render()}
function togglePick(i){const p=scr.picks;scr.picks=p.includes(i)?p.filter(x=>x!==i):[...p,i];sfx('tap');render()}
function seqTap(i){scr.seq.push(i);sfx('tap');if(scr.seq.length===gameQ().opts.length)answer(scr.seq);else render()}
function isRight(q,v){if(q.type==='pick'||q.type==='order'){const a=q.type==='pick'?[...v].sort((x,y)=>x-y):v;return a.length===q.a.length&&a.every((x,i)=>x===q.a[i])}return v===q.a}
function ansShow(q){if(q.type==='choice')return q.opts[q.a];if(q.type==='tf')return q.a?'Đúng':'Sai';if(q.type==='pick')return q.a.map(i=>q.opts[i]).join(', ');if(q.type==='order')return q.a.map(i=>q.opts[i]).join(' &lt; ');return fmt(q.a)}
function answer(v){
  const g=scr,q=gameQ(),ok=isRight(q,v),u=unit(1,g.id),st=S.st[sid],sec=Math.round((Date.now()-g.t0)/1000),qd=quest(st),soft=g.mode==='fix'||g.mode==='easy';
  log(sid,'answered',unit(1,q.src?q.src[0]:g.id).title,0,{success:ok,duration:`PT${sec}S`});
  g.showHint=false;
  if(ok){g.ok++;g.combo++;g.best=Math.max(g.best,g.combo);qd.ok++;if(g.combo===3)qd.combo++;
    const c=addCoins(sid,g.combo>=3?10:5,'self');if(g.tries===0||g.mode!=='main')g.res[g.j]=true;else g.res[g.j]=true;
    let extra='';
    if(g.mode==='fix'){const M=mist(st),e=M[q.key];if(e){e.streak++;if(e.streak>=2){delete M[q.key];g.fixed++;qd.fix=(qd.fix||0)+1;extra=' · Đã sửa xong lỗi này!'}else extra=' · Đúng thêm 1 lần nữa là sửa xong'}}
    if(g.lv===2){g.hp--;g.hit=true;sfx('hit')}else sfx(g.combo>=3?'combo':'ok');buzz(20);
    g.sheet={kind:'ok',msg:(g.combo>=3?`Combo ×${g.combo}! +${c} xu`:c?`+${c} xu`:'Đúng rồi!')+extra};}
  else{g.combo=0;sfx('bad');buzz([40,40,40]);g.tries++;
    if(g.mode==='fix'){const e=mist(st)[q.key];if(e)e.streak=0}else if(g.tries===1)mistAdd(q);
    if(!soft){g.hearts--;setTimeout(()=>hurtFx(1),30)}
    if(!soft&&g.hearts<=0){g.res[g.j]=false;g.sheet={kind:'dead'}}
    else if(g.tries===1&&q.type!=='tf'){g.sheet={kind:soft?'retrysoft':'retry'}}
    else{g.res[g.j]=false;g.sheet={kind:'bad'}}}
  g.hit=g.hit&&ok;save();render();
}
function sheetView(){const g=scr,q=gameQ(),s=g.sheet;
  if(s.kind==='ok')return`<div class="sheet ok"><div class="sh"><span class="ic">✓</span><div><b>${pick(['Tuyệt vời!','Chính xác!','Giỏi quá!','Đúng rồi!'])}</b><div>${s.msg}</div></div></div><button class="gobtn" onclick="nextG()">Tiếp tục</button></div>`;
  if(s.kind==='retry'||s.kind==='retrysoft')return`<div class="sheet warn"><div class="sh"><span class="ic">?</span><div><b>${s.kind==='retry'?'Chưa đúng, mất 1 tim.':'Chưa đúng, thử lại nhé.'}</b><div>Gợi ý: ${q.hint}</div></div></div><button class="gobtn" onclick="retryG()">Thử lại</button></div>`;
  if(s.kind==='bad')return`<div class="sheet bad"><div class="sh"><span class="ic">✕</span><div><b>Đáp án: ${ansShow(q)}</b><div>${q.sol}</div><div class="muted" style="margin-top:4px">${g.mode==='fix'?'Dạng này vẫn nằm trong sổ lỗi sai.':'Dạng bài này đã được ghi vào Sổ lỗi sai để em luyện lại.'}</div></div></div><button class="gobtn" onclick="nextG()">Tiếp tục</button></div>`;
  return`<div class="sheet bad"><div class="sh"><span class="ic">💔</span><div><b>Hết tim rồi!</b><div>Đáp án: ${ansShow(q)}. ${q.sol}</div></div></div><button class="gobtn" onclick="endG(false)">Xem kết quả</button></div>`;
}
function retryG(){scr.sheet=null;scr.inp='';scr.picks=[];scr.seq=[];render()}
function nextG(){const g=scr;g.hit=false;g.showHint=false;if(g.j<g.qs.length-1){g.j++;g.sheet=null;g.inp='';g.picks=[];g.seq=[];g.tries=0;g.t0=Date.now();render()}else endG(true)}
function endG(alive){
  const g=scr,st=S.st[sid],s=g6s(st,g.id),u=unit(1,g.id),qd=quest(st),openBefore=L1(st).map((_,k)=>islandOpen(st,k));
  g.end=true;g.newStar=false;g.chest=false;g.unlocked=null;g.medUp=0;
  if(g.mode==='fix'){g.pass=true;st.coins+=g.fixed*5;log(sid,'passed','Sổ lỗi sai',0,{success:true,score:{raw:g.fixed}});sfx(g.fixed?'win':'ok');save();render();return}
  if(g.mode==='easy'){g.pass=g.ok>=Math.ceil(g.qs.length*0.6);if(g.pass){s.fails[g.base]=0;st.coins+=10}log(sid,g.pass?'passed':'failed',`${u.title} · màn tập`,0,{success:g.pass});sfx(g.pass?'win':'bad');save();render();return}
  const pass=alive&&g.hearts>0;g.pass=pass;
  if(g.mode==='storm'){if(pass){s.ri++;st.coins+=15;log(sid,'passed',u.title+' · sửa đảo',0,{success:true});qd.pass++}sfx(pass?'win':'bad');save();render();return}
  if(pass){qd.pass++;log(sid,'passed',`${u.title} · màn ${g.lv+1}`,0,{success:true,score:{raw:g.ok,max:g.qs.length}});
    const old=s.med[g.lv]||0;if(g.hearts>old){s.med[g.lv]=g.hearts;if(old){g.medUp=g.hearts;const bonus=(g.hearts-old)*10;st.coins+=bonus;g.medBonus=bonus}}
    if(!s.m[g.lv]){s.m[g.lv]=true;g.newStar=true;log(sid,'earned',`${u.title} · màn ${g.lv+1}`,0,{score:{raw:1}})}
    if(s.m.every(Boolean)&&s.md===null){s.md=S.day;s.ri=0;g.chest=true;st.badges.push({t:'Huy hiệu '+u.title.split('.')[0],day:S.day,from:'máy'})}
    const k=L1(st).findIndex((_,k)=>!openBefore[k]&&islandOpen(st,k));if(k>=0)g.unlocked=L1(st)[k].title;sfx('win');
  }else{s.fails[g.lv]++;log(sid,'failed',`${u.title} · màn ${g.lv+1}`,0,{success:false,score:{raw:g.ok,max:g.qs.length}})}
  save();render();
}
function viewGameEnd(){const g=scr,u=unit(1,g.id),G=G6[g.id],st=S.st[sid];
  if(g.opened)return`<div class="game"><div class="gend">${g.opened}<div class="gendbtn"><button class="gobtn" onclick="go({k:'home',tab:'home'})">Xem đảo nhà</button><button class="gobtn ghost" onclick="go({k:'home'})">Về bản đồ</button></div></div></div>`;
  if(g.mode==='fix'){const left=Object.keys(mist(st)).length;return`<div class="game"><div class="gend"><div class="bigicon">📒</div><h1>${g.fixed?`Đã sửa ${g.fixed} lỗi!`:'Luyện tốt lắm!'}</h1><p class="muted">${g.ok}/${g.qs.length} câu đúng${g.fixed?` · +${g.fixed*5} xu`:''}</p><p class="muted">Mỗi dạng bài cần đúng 2 lần liền mới ra khỏi sổ. Sổ còn ${left} dạng.</p><div class="gendbtn">${left?`<button class="gobtn" onclick="startGame('${g.id}','fix')">Luyện tiếp</button>`:''}<button class="gobtn ghost" onclick="go({k:'home',tab:'quest'})">Về nhiệm vụ</button><button class="gobtn ghost" onclick="go({k:'home'})">Bản đồ</button></div></div></div>`}
  if(g.mode==='easy')return`<div class="game"><div class="gend">${jenny(84)}<h1>${g.pass?'Em làm được rồi!':'Mình luyện thêm chút nhé'}</h1><p class="muted">${g.ok}/${g.qs.length} câu đúng ở màn tập</p>${g.pass?'<p class="earn">+10 xu</p><p class="muted">Giờ em thử lại màn chính, Jenny tin em!</p>':'<p class="muted">Xem lại video rồi tập lại. Không sao cả, ai cũng cần thời gian.</p>'}<div class="gendbtn">${g.pass?`<button class="gobtn" onclick="startGame('${g.id}',${g.base})">Thử lại Màn ${g.base+1}</button>`:`<button class="gobtn" onclick="startGame('${g.id}','easy',${g.base})">Tập lại</button>`}<button class="gobtn ghost" onclick="go({k:'video',part:1,id:'${g.id}'})">Xem lại video</button><button class="gobtn ghost" onclick="go({k:'island',part:1,id:'${g.id}'})">Về đảo</button></div></div></div>`;
  const storm=g.mode==='storm';
  const title=storm?(g.pass?'Đảo đã được sửa!':'Bão vẫn còn…'):g.pass?(g.lv===2?`Hạ gục ${G.boss[1]}!`:'Qua màn!'):'Hết tim rồi!';
  const med=!storm&&g.pass?g6s(st,g.id).med[g.lv]:0;
  return`<div class="game"><div class="gend">
   <div class="bigicon" aria-hidden="true">${g.pass?(storm?'🏝️':MEDAL[g.hearts]):'💔'}</div>
   <h1>${title}</h1>${!storm&&g.pass?`<p class="medal m${g.hearts}">Huy chương ${MEDN[g.hearts]} · còn ${g.hearts} tim</p>`:''}<p class="muted">${esc(u.title)}</p>
   <div class="endstats"><div><b>${g.ok}/${g.qs.length}</b><span>câu đúng</span></div><div><b>${g.hearts}</b><span>tim còn lại</span></div><div><b>${g.best}</b><span>combo cao nhất</span></div></div>
   ${g.medUp?`<p class="earn">Nâng lên ${MEDN[g.medUp]}! +${g.medBonus} xu</p>`:''}
   ${g.pass&&!storm?(g.newStar?`<p class="earn">+1 <span class="stars">★</span> · tổng ${totalStars(st)} sao</p>`:''):''}
   ${g.pass&&!storm&&med<3?`<p class="muted">Chơi lại, giữ đủ 3 tim để lên ${MEDN[3]} (thưởng xu).</p>`:''}
   ${storm&&g.pass?'<p class="earn">+15 xu</p>':''}
   ${g.unlocked?`<p class="unlock">🔓 Mở khóa đảo mới: <b>${esc(g.unlocked)}</b></p>`:''}
   ${!g.pass&&!storm?(g6s(st,g.id).fails[g.lv]>=2?'<p class="unlock">Jenny mở <b>Màn tập</b> cho em: câu dễ hơn, có giải mẫu, không mất tim.</p>':'<p class="muted">Thử lại nhé, mỗi lần em có 3 tim mới. Câu sai đã vào Sổ lỗi sai.</p>'):''}
   <div class="gendbtn">${g.chest?`<button class="gobtn sun" onclick="openChest()">🎁 Mở rương</button>`:g.pass&&!storm&&g.lv<2?`<button class="gobtn" onclick="startGame('${g.id}',${g.lv+1})">Màn tiếp →</button>`:!g.pass&&!storm&&g6s(st,g.id).fails[g.lv]>=2?`<button class="gobtn sun" onclick="startGame('${g.id}','easy',${g.lv})">Vào Màn tập</button>`:!g.pass?`<button class="gobtn" onclick="startGame('${g.id}',${storm?"'storm'":g.lv})">Thử lại</button>`:''}<button class="gobtn ghost" onclick="go({k:'island',part:1,id:'${g.id}'})">Về đảo</button><button class="gobtn ghost" onclick="go({k:'home'})">Bản đồ</button></div>
  </div></div>`;
}
function openChest(){const st=S.st[sid];st.home=st.home||[];const left=DECOR.filter(d=>!st.home.includes(d[0]));let html;
  if(left.length){const d=pick(left);st.home.push(d[0]);html=`<div class="bigicon pop">${d[1]}</div><h1>${d[2]}!</h1><p class="muted">Món mới đã được đặt lên đảo nhà của em.</p>`;log(sid,'earned','Rương: '+d[2],0,{})}
  else{st.coins+=50;html=`<div class="bigicon pop">🪙</div><h1>+50 xu</h1><p class="muted">Em đã có đủ đồ trang trí.</p>`}
  sfx('win');scr.opened=html;save();render()}

document.addEventListener('keydown',e=>{if(role!=='hs'||scr.k!=='game'||scr.end)return;if(scr.g1){if(scr.sheet){if(e.key==='Enter'){e.preventDefault();const b=document.querySelector('.sheet .gobtn');b&&b.click()}return}const q=q1();if(q&&q.type==='num'){if(/^[0-9]$/.test(e.key))key1(e.key);else if(e.key==='Backspace')key1('⌫');else if(e.key==='Enter')key1('✓')}return}if(scr.sheet){if(e.key==='Enter'){e.preventDefault();const b=document.querySelector('.sheet .gobtn');b&&b.click()}return}const q=gameQ();if(q.type!=='num')return;if(/^[0-9]$/.test(e.key))padKey(e.key);else if(e.key==='Backspace')padKey('⌫');else if(e.key==='Enter')padKey('✓')});

