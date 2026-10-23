/* ===================== LỚP 1 · CHỦ ĐỀ 1: CÁC SỐ TỪ 0 ĐẾN 10 ===================== */
/* Mỗi tiết trong Vở BT-TH Toán 1 là một đảo. Đề viết lại (đồ vật, bối cảnh, số liệu khác), giữ đúng kiến thức của tiết. */
Object.assign(PXS,{
 apple:["....kk.gg.","....kNgGg.","..kkkNkkk.",".krrwrrrrk.","krrwrrrrrRk","krrrrrrrrRk","krrrrrrrrRk",".krrrrrrRk.","..kRrrrRk..","...kk.kk..."],
 chick:["...kkkk...","..kyyyyk..",".kyykyyyk.",".kyyyyyykoo",".kyyyyyyk..","kyyayyyyyk.","kyyaayyyak.","kyyyaaayyk.",".kyyyyyyk..","..ko..ok..."],
 balloon:["..kkkk..",".kcwcck.","kcwccccк","kccccccк","kccccccк",".kccccк.","..kccк..","...kk...","...k....","....k...","...k...."].map(r=>r.replace(/к/g,'k')),
 flower:["..k.k.k..",".kckckck.","kcccccccк","kccyyyccк","kccyyyccк",".kcccccк.","..kkkkk..","....g....","..g.g....","...gg.g..","....gGg..","....g...."].map(r=>r.replace(/к/g,'k')),
 carrot:[".....g.g",".....gg.","....kkk.","...kook.","..kooOk.","..koook.",".kooOk..",".kook...","kook....","kk......"],
 cup:["kkkkkkk..","kwbbbbk..","kbbbbbkkk","kbbwbbk.k","kbbbbbk.k","kbbbbbkkk","kbbbbbk..",".kkkkk..."],
 car:["...kkkkk....","..kwbkwbk...",".kkkkkkkkkk.","krrrrrrrrrrk","krRrrrrrrrRk","kkkkkkkkkkkk",".kek...kek..","..k.....k..."],
 bug:["..k...k..","...k.k...","..kkkkk..",".krrkrrk.","krkrkrkrk","krrrkrrrk","krkrkrkrk",".krrkrrk.","..kkkkk.."],
 ball:["..kkkk..",".kwwbbk.","kwwbbbwk","kbbbwwwk","kbwwwbbk","kwwbbbwk",".kbbwwk.","..kkkk.."],
 chest:["..kkkkkkkk..",".kooooooook.","kooooooooook","kOOOOOOOOOOk","kkkkkkkkkkkk","kaaaayyaaaak","koooykkyoook","kooooooooook","kOOOOOOOOOOk","kkkkkkkkkkkk"],
 egg:["..kkk..",".kwwwk.","kwwwwek","kwwwwek","kwwwwek",".kweek.","..kkk.."],
});
PXS.balloonB=PXS.balloon.map(r=>r.replace(/c/g,'b'));PXS.balloonP=PXS.balloon.map(r=>r.replace(/c/g,'p'));
const OBJ1=[['apple','quả táo'],['chick','chú gà con'],['balloon','quả bóng bay'],['flower','bông hoa'],['fish','con cá'],['star','ngôi sao'],['carrot','củ cà rốt'],['cup','cái cốc'],['car','chiếc ô tô'],['bug','chú bọ rùa'],['ball','quả bóng'],['egg','quả trứng']];
const NUMW=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín','mười'];
const pickObj=(not)=>{let o;do{o=pick(OBJ1)}while(not&&not.includes(o[0]));return o};
const grp=(s,n,sz=40,cls='')=>`<div class="g1grp ${cls}">${n?Array.from({length:n},()=>spr(s,sz)).join(''):'<span class="g1zero">trống</span>'}</div>`;
const grp2=(s1,a,s2,b,sz=40)=>`<div class="g1grp">${Array.from({length:a},()=>spr(s1,sz)).join('')}${Array.from({length:b},()=>spr(s2,sz,'g1b')).join('')}</div>`;
/* hai hàng ghép đôi: mỗi đồ vật nằm trong một ô cùng bề rộng để thẳng cột, cả khung vừa màn hình 360px */
const pxAsp=s=>{try{const u=pxURI(s);return u.w/u.h}catch(e){return 1}};
const fitH=(s,cw,maxH)=>Math.max(14,Math.min(maxH,Math.floor((cw-6)/Math.max(1,pxAsp(s)))));
const rowPair=(s1,a,s2,b)=>{const n=Math.max(a,b,1),cw=Math.min(52,Math.floor(286/n)),h1=fitH(s1,cw,36),h2=fitH(s2,cw,36),cell=(s,h)=>`<span class="g1cell" style="width:${cw}px">${spr(s,h)}</span>`;
 return`<div class="g1rows"><div class="g1row">${Array.from({length:a},()=>cell(s1,h1)).join('')}</div><div class="g1row">${Array.from({length:b},()=>cell(s2,h2)).join('')}</div></div>`};
const near=(n,lo,hi,k=3)=>{const s=new Set([n]);let d=1;while(s.size<k){[n-d,n+d].forEach(v=>{if(s.size<k&&v>=lo&&v<=hi)s.add(v)});d++;if(d>12)break}return shuf([...s])};
const optN=(n,lo,hi,k=3)=>{const o=near(n,lo,hi,k);return{opts:o.map(v=>({h:String(v),v})),a:o.indexOf(n)}};
const dice=n=>{const P={0:[],1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};return`<span class="g1dice">${range(0,8).map(i=>`<i class="${(P[n]||[]).includes(i)?'on':''}"></i>`).join('')}</span>`};
/* ---- các dạng câu ---- */
const Q1={
 count:(lo,hi)=>()=>{const n=R(Math.max(lo,1),hi),[s,w]=pickObj();const o=optN(n,lo,hi,3);return{type:'opt',big:1,q:`Có mấy ${w}?`,say:`Có mấy ${w}? Em đếm rồi chạm vào số đúng nhé.`,pic:grp(s,n),...o,sol:`Đếm từng ${w.split(' ')[0]}: có ${n} ${w}.`}},
 find:(lo,hi)=>()=>{const n=R(Math.max(lo,1),hi),[s,w]=pickObj();const c=near(n,Math.max(lo,1),hi,3);return{type:'opt',cols:3,q:`Chạm vào khung có <b>${n}</b> ${w}.`,say:`Chạm vào khung có ${NUMW[n]} ${w}.`,opts:c.map(v=>({h:grp(s,v,30,'sm'),v})),a:c.indexOf(n),sol:`Khung đúng có ${n} ${w}.`}},
 word:(lo,hi)=>()=>{const n=R(lo,hi),o=optN(n,lo,hi,4);return{type:'opt',big:1,q:`Chạm vào số <b>${NUMW[n]}</b>.`,say:`Em hãy chạm vào số ${NUMW[n]}.`,...o,sol:`Số ${NUMW[n]} viết là ${n}.`}},
 seq:(lo,hi,desc)=>()=>{const st=R(lo,hi-5),arr=range(st,st+5);if(desc)arr.reverse();const bl=shuf([1,2,3,4]).slice(0,2).sort((a,b)=>a-b);const ans=bl.map(i=>arr[i]);const tiles=shuf([...ans,...near(ans[0],lo,hi,4).filter(v=>!ans.includes(v)).slice(0,2)]);
   return{type:'slots',q:desc?'Điền số còn thiếu (đếm lùi).':'Điền số còn thiếu vào ô trống.',say:desc?'Đếm lùi rồi kéo số còn thiếu vào ô trống nhé.':'Đếm thêm một rồi kéo số còn thiếu vào ô trống nhé.',cells:arr.map((v,i)=>bl.includes(i)?null:v),tiles,a:ans,sol:`Dãy đúng: ${arr.join(', ')}.`}},
 build:(lo,hi)=>()=>{const n=R(Math.max(lo,2),hi),k=R(1,n-1),[s,w]=pickObj();return{type:'build',q:`Thêm cho đủ <b>${n}</b> ${w}.`,say:`Em đếm xem đang có mấy ${w}. Em bấm dấu cộng để thêm cho đủ ${NUMW[n]} ${w} nhé.`,obj:s,start:k,a:n,sol:`Cần thêm ${n-k} để có đủ ${n}.`}},
 hidden:(lo,hi)=>()=>{const all=range(lo,hi),m=pick(all.slice(1));const show=shuf(all.filter(v=>v!==m));const o=optN(m,lo,hi,4);return{type:'opt',big:1,q:'Bạn Mèo xếp các số nhưng làm rơi mất một số. Số nào bị rơi?',say:`Bạn Mèo xếp các số từ ${NUMW[lo]} đến ${NUMW[hi]} nhưng làm rơi mất một số. Đó là số nào?`,pic:`<div class="g1board">${show.map(v=>`<span>${v}</span>`).join('')}</div>`,...o,sol:`Các số từ ${lo} đến ${hi} còn thiếu số ${m}.`}},
 moreless:(mx)=>()=>{const [s1,w1]=pickObj(),[s2,w2]=pickObj([s1]);let a=R(2,mx),b=R(2,mx);if(Math.random()<.3)b=a;const ans=a>b?0:a<b?1:2;return{type:'opt',q:`Số ${w1} so với số ${w2} thì thế nào?`,say:`Em ghép mỗi ${w1} với một ${w2}. Số ${w1} nhiều hơn, ít hơn hay bằng số ${w2}?`,pic:rowPair(s1,a,s2,b),opts:['Nhiều hơn','Ít hơn','Bằng nhau'].map((h,v)=>({h,v})),a:ans,sol:`Có ${a} ${w1} và ${b} ${w2}, nên số ${w1} ${['nhiều hơn','ít hơn','bằng'][ans]} số ${w2}.`}},
 tfmore:(mx)=>()=>{const [s1,w1]=pickObj(),[s2,w2]=pickObj([s1]);let a=R(2,mx),b=R(2,mx);if(Math.random()<.3)b=a;const rel=pick(['nhiều hơn','ít hơn','bằng']);const truth=rel==='nhiều hơn'?a>b:rel==='ít hơn'?a<b:a===b;return{type:'tf',q:`Số ${w1} ${rel} số ${w2}. Đúng hay sai?`,say:`Số ${w1} ${rel} số ${w2}. Đúng hay sai?`,pic:rowPair(s1,a,s2,b),a:truth,sol:`Có ${a} ${w1} và ${b} ${w2}.`}},
 fewer:(mx)=>()=>{const [s,w]=pickObj();const c=shuf(range(1,mx)).slice(0,3),most=Math.random()<.5,m=most?Math.max(...c):Math.min(...c),wd=most?'nhiều':'ít';return{type:'opt',cols:3,q:`Chạm vào khung có <b>${wd}</b> ${w} nhất.`,say:`Khung nào có ${wd} ${w} nhất? Em chạm vào khung đó nhé.`,opts:c.map(v=>({h:grp(s,v,30,'sm'),v})),a:c.indexOf(m),sol:`Khung có ${m} ${w} là ${wd} nhất.`}},
 signpic:(mx)=>()=>{const [s,w]=pickObj();const a=R(1,mx),b=R(1,mx);const ans=a>b?0:a<b?1:2;return{type:'opt',big:1,cols:3,q:`Chọn dấu đúng: <b>${a} … ${b}</b>`,say:`Bên trái có ${NUMW[a]}, bên phải có ${NUMW[b]}. Em chọn dấu lớn hơn, bé hơn hay bằng?`,pic:(()=>{const h=fitH(s,46,32);return`<div class="g1vs g1vsn">${grp(s,a,h,'sm')}<b>…</b>${grp(s,b,h,'sm')}</div>`})(),opts:['&gt;','&lt;','='].map((h,v)=>({h,v})),a:ans,sol:`${a} ${['&gt;','&lt;','='][ans]} ${b}.`}},
 sign:(mx)=>()=>{const a=R(0,mx),b=Math.random()<.25?a:R(0,mx);const ans=a>b?0:a<b?1:2;return{type:'opt',big:1,cols:3,q:`Chọn dấu đúng: <b>${a} … ${b}</b>`,say:`${NUMW[a]} so với ${NUMW[b]}. Em chọn dấu lớn hơn, bé hơn hay bằng?`,pic:a<=6&&b<=6?`<div class="g1vs">${dice(a)}<b class="g1big">${a} … ${b}</b>${dice(b)}</div>`:`<div class="g1vs"><b class="g1big">${a} … ${b}</b></div>`,opts:['&gt;','&lt;','='].map((h,v)=>({h,v})),a:ans,sol:`${a} ${['&gt;','&lt;','='][ans]} ${b}.`}},
 bigger:(mx)=>()=>{let a=R(0,mx),b;do{b=R(0,mx)}while(b===a);return{type:'opt',big:1,cols:2,q:'Chạm vào số lớn hơn.',say:`${NUMW[a]} và ${NUMW[b]}. Số nào lớn hơn?`,opts:[{h:String(a),v:a},{h:String(b),v:b}],a:a>b?0:1,sol:`${Math.max(a,b)} lớn hơn ${Math.min(a,b)}.`}},
 pickgt:()=>()=>{const k=R(3,6),tiles=shuf(range(0,10)).slice(0,6);if(!tiles.some(v=>v>k))tiles[0]=k+1;return{type:'pick',q:`Chạm vào <b>tất cả</b> các số lớn hơn ${k}.`,say:`Chạm vào tất cả các số lớn hơn ${NUMW[k]}, rồi bấm kiểm tra.`,opts:tiles.map(String),a:tiles.map((v,i)=>v>k?i:-1).filter(i=>i>=0),sol:`Các số lớn hơn ${k}: ${tiles.filter(v=>v>k).sort((x,y)=>x-y).join(', ')}.`}},
 fitlt:()=>()=>{const k=R(3,9),gt=Math.random()<.5;const good=gt?R(k+1,10):R(0,k-1);const bad=shuf(gt?range(0,k):range(k,10)).slice(0,2);const o=shuf([good,...bad]);return{type:'opt',big:1,cols:3,q:`Số nào điền được vào ô trống: <b>${gt?`☐ &gt; ${k}`:`☐ &lt; ${k}`}</b>`,say:`Số nào điền vào ô trống để ô trống ${gt?'lớn hơn':'bé hơn'} ${NUMW[k]}?`,opts:o.map(v=>({h:String(v),v})),a:o.indexOf(good),sol:`${good} ${gt?'&gt;':'&lt;'} ${k}.`}},
 tfnum:(mx)=>()=>{const a=R(0,mx),b=R(0,mx),s=pick(['&gt;','&lt;','=']);const truth=s==='&gt;'?a>b:s==='&lt;'?a<b:a===b;const sw=s==='&gt;'?'lớn hơn':s==='&lt;'?'bé hơn':'bằng';return{type:'tf',q:`<b class="g1big">${a} ${s} ${b}</b>`,say:`${NUMW[a]} ${sw} ${NUMW[b]}. Đúng hay sai?`,a:truth,sol:`${a} ${a>b?'&gt;':a<b?'&lt;':'='} ${b}.`}},
 bond:(mx)=>()=>{const [s1]=pickObj(),[s2]=pickObj([s1]);const n=R(2,mx),a=R(1,n-1),b=n-a;const o=optN(n,1,10,3);return{type:'opt',big:1,q:`<b>${a}</b> và <b>${b}</b> được mấy?`,say:`${NUMW[a]} và ${NUMW[b]} được mấy?`,pic:grp2(s1,a,s2,b),...o,sol:`${a} và ${b} được ${n}.`}},
 split:(mx)=>()=>{const n=R(3,mx),a=R(1,n-1),b=n-a;const o=optN(b,0,10,3);return{type:'opt',big:1,q:`<b>${n}</b> gồm <b>${a}</b> và mấy?`,say:`${NUMW[n]} gồm ${NUMW[a]} và mấy?`,pic:`<div class="g1bond"><span>${n}</span><i></i><i></i><span>${a}</span><span class="q">?</span></div>`,...o,sol:`${n} gồm ${a} và ${b}.`}},
 order:(mx)=>()=>{const v=shuf(range(0,mx)).slice(0,4);return{type:'order',q:'Chạm các số theo thứ tự từ bé đến lớn.',say:'Em chạm vào các số theo thứ tự từ bé đến lớn nhé.',opts:v.map(String),a:v.map((x,i)=>[x,i]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]),sol:`Từ bé đến lớn: ${[...v].sort((x,y)=>x-y).join(', ')}.`}},
};
const KN1={count:'Đếm số lượng',find:'Tìm khung đúng số lượng',word:'Nhận biết số qua tên gọi',seq:'Điền số theo thứ tự',build:'Thêm cho đủ số lượng',hidden:'Tìm số còn thiếu',moreless:'Nhiều hơn, ít hơn, bằng nhau',tfmore:'Đúng/sai: nhóm nào nhiều hơn',fewer:'Tìm nhóm nhiều nhất, ít nhất',signpic:'Dấu >, <, = qua hình',sign:'Điền dấu >, <, =',bigger:'Tìm số lớn hơn',pickgt:'Tìm các số lớn hơn',fitlt:'Chọn số điền vào ô trống',tfnum:'Đúng/sai khi so sánh số',bond:'Gộp: mấy và mấy',split:'Tách số',order:'Xếp thứ tự'};
Object.keys(Q1).forEach(k=>{const f=Q1[k];Q1[k]=(...a)=>{const g=f(...a);return()=>({...g(),kind:KN1[k]})}});
/* ---- 19 đảo của Chủ đề 1 (theo số tiết trong vở) ---- */
const C1=[
 ['b1',1,'Bài 1. Các số 0, 1, 2, 3, 4, 5','Số 0–5',[
   ['Đếm và nhận biết các số từ 0 đến 5',[Q1.count(0,5),Q1.word(0,5)],[Q1.find(1,5),Q1.count(0,5)]],
   ['Đếm và viết các số theo thứ tự từ 0 đến 5',[Q1.count(0,5),Q1.seq(0,5)],[Q1.find(1,5),Q1.word(0,5)]],
   ['Chọn số đúng, thêm hình cho đủ số lượng',[Q1.count(1,5),Q1.build(2,5)],[Q1.seq(0,5,1),Q1.find(1,5)]]]],
 ['b2',2,'Bài 2. Các số 6, 7, 8, 9, 10','Số 6–10',[
   ['Đếm và nhận biết các số từ 6 đến 10',[Q1.count(6,10),Q1.word(6,10)],[Q1.find(6,10),Q1.count(6,10)]],
   ['Viết các số theo thứ tự từ 0 đến 10',[Q1.seq(0,10),Q1.count(6,10)],[Q1.find(6,10),Q1.hidden(1,10)]],
   ['Thêm hình cho đủ, tìm số bị rơi',[Q1.build(6,10),Q1.count(6,10)],[Q1.hidden(1,10),Q1.seq(0,10,1)]]]],
 ['b3',3,'Bài 3. Nhiều hơn, ít hơn, bằng nhau','Nhiều – ít',[
   ['So sánh hai nhóm: nhiều hơn, ít hơn, bằng nhau',[Q1.moreless(5)],[Q1.moreless(6),Q1.fewer(6)]],
   ['Đúng hay sai: nhóm nào nhiều hơn?',[Q1.tfmore(6)],[Q1.tfmore(7),Q1.moreless(7)]]]],
 ['b4',4,'Bài 4. So sánh số','So sánh',[
   ['Dùng dấu >, <, = để so sánh các số đến 5',[Q1.signpic(5)],[Q1.pickgt(),Q1.fitlt()]],
   ['So sánh các số đến 10',[Q1.signpic(8),Q1.fitlt()],[Q1.bigger(10),Q1.signpic(9)]],
   ['Điền dấu >, <, = vào giữa hai số',[Q1.sign(6),Q1.tfnum(10)],[Q1.sign(10),Q1.tfnum(10)]],
   ['Tìm số lớn hơn, nhóm ít hơn',[Q1.sign(10),Q1.fewer(8)],[Q1.bigger(10),Q1.pickgt()]]]],
 ['b5',5,'Bài 5. Mấy và mấy','Mấy và mấy',[
   ['Gộp hai nhóm: mấy và mấy được mấy',[Q1.bond(5)],[Q1.bond(7)]],
   ['Tách một số thành hai phần',[Q1.bond(7),Q1.split(6)],[Q1.split(8),Q1.bond(8)]],
   ['Tách và gộp các số đến 10',[Q1.split(10)],[Q1.split(10),Q1.bond(10)]]]],
 ['b6',6,'Bài 6. Luyện tập chung','Luyện tập',[
   ['Đếm, tìm nhóm và tách số',[Q1.count(0,10),Q1.find(1,10)],[Q1.split(9),Q1.seq(0,10)]],
   ['Xếp thứ tự, tìm số theo tên gọi',[Q1.order(10),Q1.count(1,10)],[Q1.fewer(9),Q1.word(0,10)]],
   ['Số nào lớn hơn? Nhóm nào ít hơn?',[Q1.bigger(10),Q1.sign(10)],[Q1.fewer(10),Q1.signpic(9)]],
   ['Ôn cả chủ đề và đánh trùm',[Q1.moreless(8),Q1.tfmore(8)],[Q1.bond(10),Q1.seq(0,10)],[Q1.count(1,10),Q1.sign(10),Q1.split(10),Q1.order(10),Q1.build(3,9),Q1.find(1,10)]]]],
];
const BOSS1=['crab','Cua Số Đếm'];
const P1_1=C1.flatMap(([bid,bn,title,short,ts])=>ts.map((t,i)=>({id:`g1${bid}t${i+1}`,title:`Bài ${bn} · Tiết ${i+1}`,lesson:title,short:`${short} · T${i+1}`,goal:t[0],lv:[t[1],t[2]].concat(t[3]?[t[3]]:[]),nm:t[3]?3:2,boss:!!t[3],slides:[],tiet:i+1,ntiet:ts.length,b:bn})));
const NEXT1=['Làm quen với một số hình phẳng','Phép cộng, phép trừ trong phạm vi 10','Làm quen với một số hình khối','Ôn tập học kì 1','Các số đến 100','Độ dài và đo độ dài','Phép cộng, phép trừ (không nhớ) trong phạm vi 100','Thời gian. Giờ và lịch','Ôn tập cuối năm'];
const Q1N=3,BOSSN=5;
/* ---- giọng Jenny ---- */
let v1Voice=null,v1Said='';
/* chuyển đề (có thể chứa HTML, kí hiệu toán) thành lời đọc tiếng Việt */
function spoken(t){t=String(t).normalize('NFC');
  t=t.replace(/<span class="frac"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g,' $1 phần $2 ');
  t=t.replace(/<br\s*\/?>/gi,'. ').replace(/<\/?[a-zA-Z][^<>]*>/g,' ');
  try{const d=document.createElement('textarea');d.innerHTML=t;t=d.value}catch(e){}
  t=t.replace(/\u00a0{2,}|\u00a0(?!\d{3})| {3,}/g,'. ');
  for(let i=0;i<3;i++)t=t.replace(/(\d)[ \u00a0](?=\d{3}(?!\d))/g,'$1');
  t=t.replace(/(\d),(\d)/g,'$1 phẩy $2').replace(/(\d)\s*\/\s*(\d)/g,'$1 phần $2')
   .replace(/(km|dm|cm|mm|m)²/g,(m,u)=>({km:' ki-lô-mét vuông',dm:' đề-xi-mét vuông',cm:' xăng-ti-mét vuông',mm:' mi-li-mét vuông',m:' mét vuông'})[u])
   .replace(/(km|dm|cm|mm|m)³/g,(m,u)=>({km:' ki-lô-mét khối',dm:' đề-xi-mét khối',cm:' xăng-ti-mét khối',mm:' mi-li-mét khối',m:' mét khối'})[u])
   .replace(/(\d|\?|☐)\s*(kg|km|cm|mm|dm|ml|ha|m|g|l)(?![a-zA-Zà-ỹ²³])/g,(m,d,u)=>d+' '+({kg:'ki-lô-gam',km:'ki-lô-mét',cm:'xăng-ti-mét',mm:'mi-li-mét',dm:'đề-xi-mét',ml:'mi-li-lít',ha:'héc-ta',m:'mét',g:'gam',l:'lít'})[u])
   .replace(/°C/g,' độ C').replace(/°/g,' độ').replace(/%/g,' phần trăm')
   .replace(/≥/g,' lớn hơn hoặc bằng ').replace(/≤/g,' bé hơn hoặc bằng ').replace(/≠/g,' khác ')
   .replace(/\s*>\s*/g,' lớn hơn ').replace(/\s*<\s*/g,' bé hơn ').replace(/\s*=\s*/g,' bằng ')
   .replace(/\s*×\s*/g,' nhân ')
   .replace(/(\d|\))\s*:\s*(?=[\d(☐])/g,'$1 chia ').replace(/\s*\+\s*/g,' cộng ').replace(/\s*[−–]\s*/g,' trừ ').replace(/(\d)\s+-\s+(?=\d)/g,'$1 trừ ')
   .replace(/bằng\s*\?/g,'bằng bao nhiêu').replace(/(\S)\s+(?:…|\.\.\.)\s+(?=\S)/g,(m,c)=>/[,:]/.test(c)?c+' chỗ trống ':c+' và ').replace(/(?:…|\.\.\.)(?=\s*,)/g,' chỗ trống ').replace(/☐/g,' mấy ').replace(/(^|\s)\?(?=\s+(?:cộng|trừ|nhân|chia|bằng|lớn hơn|bé hơn)(?:\s|$))/g,'$1 mấy ').replace(/(^|\s)(cộng|trừ|nhân|chia)\s+\?/g,'$1$2 mấy').replace(/…|\.\.\./g,', ').replace(/[→⟶]/g,', ');
  return t.replace(/\s+/g,' ').replace(/\s+([.,:;!?])/g,'$1').replace(/([.,])(?:\s*[.,])+/g,'$1').trim()}
/* lời đọc đầy đủ: lời Jenny + các dòng phép tính trên màn hình mà lời Jenny chưa nhắc tới */
function sayFull(say,html){say=String(say||'');if(!html)return say;
  const lines=String(html).replace(/<span class="frac"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g,'$1/$2').split(/<\/?(?:p|li|tr|div|br|h\d|ol|ul|table)\b[^>]*>/i).map(l=>l.replace(/<\/?[a-zA-Z][^<>]*>/g,' ')).map(l=>{try{const d=document.createElement('textarea');d.innerHTML=l;return d.value}catch(e){return l}}).map(l=>l.replace(/[ \t\n\r]+/g,' ').trim()).filter(l=>/\d/.test(l)&&/[=<>+−×:…☐?]/.test(l));
  const S=say.toLowerCase().normalize('NFC'),SD=S.replace(/(\d)[  ](?=\d{3}(?!\d))/g,'$1');
  const has=n=>{const raw=n.replace(/[  ]/g,'');if(new RegExp('(^|[^\\d,])'+raw.replace(',','[,.]')+'(?![\\d])').test(SD))return true;if(raw.includes(','))return raw.split(',').every(p=>S.includes(vnRead(Number(p)))||S.includes(p));const v=Number(raw);return v<1e12&&S.includes(vnRead(v).toLowerCase())};
  const miss=[];for(const l of lines){const nums=l.match(/\d{1,3}(?:[  ]\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g)||[];if(nums.length&&!nums.every(has)&&!miss.includes(l))miss.push(l)}
  return miss.length?(say+(say?' ':'')+miss.map(l=>spoken(l)).join('. ')+'.').replace(/([.!?])\s*\.+/g,'$1'):say}
/* chọn giọng tiếng Việt tốt nhất có trên máy */
function pickViVoice(){try{const vs=speechSynthesis.getVoices().filter(v=>/^vi/i.test(v.lang)||/vietnam|tiếng việt/i.test(v.name));if(!vs.length)return null;
  let pref='';try{pref=localStorage.getItem('jennyVoice')||''}catch(e){}const byPref=vs.find(v=>v.name===pref);if(byPref)return byPref;
  const score=v=>(/natural|online/i.test(v.name)?50:0)+(/hoaimy|hoài my|namminh|nam minh/i.test(v.name)?20:0)+(/google/i.test(v.name)?40:0)+(/premium|enhanced|nâng cao/i.test(v.name)?30:0)+(/linh/i.test(v.name)?10:0)+(v.localService?0:5);
  return vs.sort((a,b)=>score(b)-score(a))[0]}catch(e){return null}}
try{speechSynthesis.onvoiceschanged=()=>{v1Voice=pickViVoice()}}catch(e){}
let viHintShown=false;
function viVoiceHint(){if(viHintShown)return;let n=0;try{n=speechSynthesis.getVoices().length}catch(e){}if(!n)return;viHintShown=true;
  const mac=/Mac/i.test(navigator.platform||navigator.userAgent),win=/Win/i.test(navigator.platform||'');
  toast(mac?'Máy chưa có giọng tiếng Việt. Vào Cài đặt hệ thống → Trợ năng → Nội dung được đọc → Giọng hệ thống → Quản lý giọng → tải "Linh". Hoặc mở bằng Chrome.':win?'Máy chưa có giọng tiếng Việt. Nên mở bằng Microsoft Edge hoặc Chrome để Jenny đọc rõ.':'Máy chưa có giọng tiếng Việt. Hãy mở bằng Chrome để Jenny đọc rõ.')}
function sayJ(text){if(muted||!text)return;try{const s=window.speechSynthesis;if(!s)return;s.cancel();if(!v1Voice)v1Voice=pickViVoice();if(!v1Voice)viVoiceHint();const u=new SpeechSynthesisUtterance(spoken(text));u.lang='vi-VN';if(v1Voice)u.voice=v1Voice;u.rate=.9;u.pitch=1;u.onstart=()=>{try{duck(1)}catch(e){}};u.onend=u.onerror=()=>{try{duck(0)}catch(e){}};s.speak(u)}catch(e){}}
try{window.speechSynthesis&&window.speechSynthesis.addEventListener&&window.speechSynthesis.addEventListener('voiceschanged',()=>{v1Voice=null})}catch(e){}
/* ---- trạng thái ---- */
const isl1=id=>Object.values(PRIM).flatMap(p=>p.isl).find(x=>x.id===id);
function healAll(){try{Object.values(S.st||{}).forEach(st=>{if(!st.p1)st.p1={};if(st.grade<=5)ISL(st).forEach(x=>s1(st,x.id))})}catch(e){}}
const s1=(st,id)=>{const x=isl1(id),s=st.p1[id]||(st.p1[id]={intro:false,m:[],fails:[]});while(s.m.length<x.nm){s.m.push(false);s.fails.push(0)}return s};
const ISL=st=>PRIM[st.grade<=5?st.grade:1].isl;
let UNL=(()=>{try{return localStorage.getItem('jennyLockOn')!=='1'}catch(e){return true}})();
function toggleUnl(){UNL=!UNL;try{localStorage.setItem('jennyLockOn',UNL?'0':'1')}catch(e){}render();toast(UNL?'Đã mở khóa tất cả đảo để kiểm tra':'Đã khóa lại theo tiến độ')}
const open1=(st,k)=>{const L=ISL(st);if(k<=0||UNL)return true;const x=L[k],p=L[k-1];return x.ti!==p.ti?s1(st,p.id).m.every(Boolean):!!s1(st,p.id).m[0]};
const cur1=st=>{for(let k=0;k<ISL(st).length;k++){if(open1(st,k)&&s1(st,ISL(st)[k].id).m.some(v=>!v))return k}return ISL(st).length-1};
/* ---- bản đồ ---- */
const T1=[["Các số từ 0 đến 10", [[1, 1, "Các số 0, 1, 2, 3, 4, 5"], [1, 2, "Các số 0, 1, 2, 3, 4, 5"], [1, 3, "Các số 0, 1, 2, 3, 4, 5"], [2, 1, "Các số 6, 7, 8, 9, 10"], [2, 2, "Các số 6, 7, 8, 9, 10"], [2, 3, "Các số 6, 7, 8, 9, 10"], [3, 1, "Nhiều hơn, ít hơn, bằng nhau"], [3, 2, "Nhiều hơn, ít hơn, bằng nhau"], [4, 1, "So sánh số"], [4, 2, "So sánh số"], [4, 3, "So sánh số"], [4, 4, "So sánh số"], [5, 1, "Mấy và mấy"], [5, 2, "Mấy và mấy"], [5, 3, "Mấy và mấy"], [6, 1, "Luyện tập chung"], [6, 2, "Luyện tập chung"], [6, 3, "Luyện tập chung"], [6, 4, "Luyện tập chung"]]], ["Làm quen với một số hình phẳng", [[7, 1, "Hình vuông, hình tròn, hình tam giác, hình chữ nhật"], [7, 2, "Hình vuông, hình tròn, hình tam giác, hình chữ nhật"], [8, 1, "Thực hành lắp ghép, xếp hình"], [8, 2, "Thực hành lắp ghép, xếp hình"], [9, 1, "Luyện tập chung"]]], ["Phép cộng, phép trừ trong phạm vi 10", [[10, 1, "Phép cộng trong phạm vi 10"], [10, 2, "Phép cộng trong phạm vi 10"], [10, 3, "Phép cộng trong phạm vi 10"], [10, 4, "Phép cộng trong phạm vi 10"], [10, 5, "Phép cộng trong phạm vi 10"], [10, 6, "Phép cộng trong phạm vi 10"], [11, 1, "Phép trừ trong phạm vi 10"], [11, 2, "Phép trừ trong phạm vi 10"], [11, 3, "Phép trừ trong phạm vi 10"], [11, 4, "Phép trừ trong phạm vi 10"], [11, 5, "Phép trừ trong phạm vi 10"], [11, 6, "Phép trừ trong phạm vi 10"], [12, 1, "Bảng cộng, bảng trừ trong phạm vi 10"], [12, 2, "Bảng cộng, bảng trừ trong phạm vi 10"], [12, 3, "Bảng cộng, bảng trừ trong phạm vi 10"], [13, 1, "Luyện tập chung"], [13, 2, "Luyện tập chung"], [13, 3, "Luyện tập chung"]]], ["Làm quen với một số hình khối", [[14, 1, "Khối lập phương, khối hộp chữ nhật"], [14, 2, "Khối lập phương, khối hộp chữ nhật"], [15, 1, "Vị trí, định hướng trong không gian"], [15, 2, "Vị trí, định hướng trong không gian"], [16, 1, "Luyện tập chung"]]], ["Ôn tập học kì 1", [[17, 1, "Ôn tập các số trong phạm vi 10"], [17, 2, "Ôn tập các số trong phạm vi 10"], [18, 1, "Ôn tập phép cộng, phép trừ trong phạm vi 10"], [18, 2, "Ôn tập phép cộng, phép trừ trong phạm vi 10"], [19, 1, "Ôn tập hình học"], [20, 1, "Ôn tập chung"]]], ["Các số đến 100", [[21, 1, "Số có hai chữ số"], [21, 2, "Số có hai chữ số"], [21, 3, "Số có hai chữ số"], [21, 4, "Số có hai chữ số"], [21, 5, "Số có hai chữ số"], [21, 6, "Số có hai chữ số"], [22, 1, "So sánh số có hai chữ số"], [22, 2, "So sánh số có hai chữ số"], [22, 3, "So sánh số có hai chữ số"], [23, 1, "Bảng các số từ 1 đến 100"], [24, 1, "Luyện tập chung"], [24, 2, "Luyện tập chung"]]], ["Độ dài và đo độ dài", [[25, 1, "Dài hơn, ngắn hơn"], [25, 2, "Dài hơn, ngắn hơn"], [26, 1, "Đơn vị đo độ dài"], [26, 2, "Đơn vị đo độ dài"], [27, 1, "Thực hành ước lượng và đo độ dài"], [27, 2, "Thực hành ước lượng và đo độ dài"], [28, 1, "Luyện tập chung"], [28, 2, "Luyện tập chung"]]], ["Phép cộng, phép trừ (không nhớ) trong phạm vi 100", [[29, 1, "Phép cộng số có hai chữ số với số có một chữ số"], [29, 2, "Phép cộng số có hai chữ số với số có một chữ số"], [30, 1, "Phép cộng số có hai chữ số với số có hai chữ số"], [30, 2, "Phép cộng số có hai chữ số với số có hai chữ số"], [31, 1, "Phép trừ số có hai chữ số cho số có một chữ số"], [31, 2, "Phép trừ số có hai chữ số cho số có một chữ số"], [31, 3, "Phép trừ số có hai chữ số cho số có một chữ số"], [32, 1, "Phép trừ số có hai chữ số cho số có hai chữ số"], [32, 2, "Phép trừ số có hai chữ số cho số có hai chữ số"], [32, 3, "Phép trừ số có hai chữ số cho số có hai chữ số"], [33, 1, "Luyện tập chung"], [33, 2, "Luyện tập chung"], [33, 3, "Luyện tập chung"], [33, 4, "Luyện tập chung"]]], ["Thời gian. Giờ và lịch", [[34, 1, "Xem giờ đúng trên đồng hồ"], [34, 2, "Xem giờ đúng trên đồng hồ"], [35, 1, "Các ngày trong tuần"], [35, 2, "Các ngày trong tuần"], [36, 1, "Thực hành xem lịch và giờ"], [36, 2, "Thực hành xem lịch và giờ"], [37, 1, "Luyện tập chung"], [37, 2, "Luyện tập chung"]]], ["Ôn tập cuối năm", [[38, 1, "Ôn tập các số và phép tính trong phạm vi 10"], [38, 2, "Ôn tập các số và phép tính trong phạm vi 10"], [38, 3, "Ôn tập các số và phép tính trong phạm vi 10"], [39, 1, "Ôn tập các số và phép tính trong phạm vi 100"], [39, 2, "Ôn tập các số và phép tính trong phạm vi 100"], [39, 3, "Ôn tập các số và phép tính trong phạm vi 100"], [40, 1, "Ôn tập hình học và đo lường"], [40, 2, "Ôn tập hình học và đo lường"], [41, 1, "Ôn tập chung"]]]];
const BOSSES1=[['crab','Cua Số Đếm'],['octo','Bạch tuộc Hình Phẳng'],['shark','Cá mập Cộng Trừ'],['jelly','Sứa Hình Khối'],['dragon','Rồng Học Kì'],['snake','Rắn Số 100'],['squid','Mực Thước Đo'],['crab','Cua Hàng Chục'],['octo','Bạch tuộc Đồng Hồ'],['dragon','Rồng Cuối Năm']];
function viewHome1(){
  const st=S.st[sid],tot=p1Stars(st),W=140,Hh=280,cur=curT1(st);
  const strip=PT().map(([name],ti)=>{const ts=topicSt1(st,ti);return`<button type="button" class="tchip ${ts.cls}${ti===cur?' on':''}" onclick="jumpT1(${ti},1)" aria-label="Chủ đề ${ti+1}: ${esc(name)}"><b>${ti+1}</b><span>${ts.cls==='lock'?'🔒':ts.cls==='soon'?'…':ts.done?'✓':'★'+ts.got}</span></button>`}).join('');
  const G=curG(),secs=PT().map(([name,isl],ti)=>{const ts=topicSt1(st,ti),live=ti===cur,boss=PB()[ti],bk=biomeOf(G,ti,name),bm=BIOME[bk];
    const pts=isl.map((_,k)=>[80+k*W,k%2?165:85]);
    const path=pts.map((p,k)=>k?`Q ${p[0]-W/2} ${pts[k-1][1]===85?55:200} ${p[0]} ${p[1]}`:`M ${p[0]} ${p[1]}`).join(' ');
    let nodes;
    if(PLAY(ti)){const ck=cur1(st);const IL=PI();nodes=IL.filter(y=>y.ti===ti).map((x,j)=>{const k=IL.indexOf(x),s=s1(st,x.id),n=s.m.filter(Boolean).length,op=open1(st,k),[cx,cy]=pts[j],state=!op?'lock':n===x.nm?'done':'cur';
      return`<button class="node ${state}${k===ck&&live?' here':''}" style="left:${cx-55}px;top:${cy-50}px" ${op?`onclick="go({k:'island',id:'${x.id}'})"`:`onclick="toast('Qua Màn 1 của đảo trước để mở đảo này nhé!')"`} aria-label="${esc(x.lesson)}, tiết ${x.tiet}${op?'':' (đang khóa)'}"><span class="ball">${spr(state==='lock'?'islandG':bm.isl,60)}${state==='lock'?spr('lock',26,'bdg'):k===ck&&live?spr(typeof ofVariant==='function'?ofVariant('jenny',jOutfit()):'jenny',34,'bdg jen'):x.boss?spr(boss[0],26,'bdg bossbdg'):state==='done'?spr('medG',24,'bdg'):''}</span><span class="lbl"><b>${j+1}. ${esc(x.short)}</b><span class="stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(x.nm-n)}</span></span></span>${k===ck&&live?'<span class="flag">Đang học</span>':x.boss&&op?'<span class="flag warn">Trùm</span>':''}</button>`}).join('')}
    else nodes=isl.map(([b,t,tt],k)=>{const [cx,cy]=pts[k],last=k===isl.length-1;return`<button class="node lock" style="left:${cx-55}px;top:${cy-50}px" onclick="toast('${ts.cls==='soon'?'Chủ đề này đang được soạn.':`Hạ trùm ${PB()[ti-1][1]} ở Chủ đề ${ti} để mở.`}')" aria-label="Bài ${b}, tiết ${t} (đang khóa)"><span class="ball">${spr('islandG',60)}${last?spr(boss[0],26,'bdg'):''}</span><span class="lbl"><b>B${b} · T${t}</b><small>${esc(tt)}</small></span></button>`}).join('');
    const bs=isl[0][0],be=isl[isl.length-1][0];
    return`<section class="card t1sec bm-${bk} ${ts.cls}${live?' cur':''}" id="t1_${ti}" style="padding:16px 0 8px;--bmc:${bm.band[2]};--bmd:${bm.band[3]}"><div class="secthead" style="padding:0 16px;flex-wrap:wrap;gap:6px 10px"><span class="tno">CHỦ ĐỀ ${ti+1}</span><h2>${esc(name)}</h2><span class="grow"></span>${PLAY(ti)?`<span class="muted">${PI().filter(x=>x.ti===ti).reduce((a,x)=>a+s1(st,x.id).m.filter(Boolean).length,0)}/${PI().filter(x=>x.ti===ti).reduce((a,x)=>a+x.nm,0)} ★</span>`:`<span class="pill">${ts.cls==='soon'?'Đang soạn':'Chưa mở'}</span>`}</div>
     <p class="muted" style="margin:2px 16px 6px"><span class="bmtag">${bm.ic} ${bm.n}</span> Bài ${bs}–${be} · ${isl.length} đảo · trùm ${spr(boss[0],18)} ${esc(boss[1])}</p>
     <div class="t1wrap"><div class="sea" ${live?'id="sea"':''}><div class="seain" style="width:${100+isl.length*W}px;height:${Hh}px"><canvas class="seacv" data-biome="${bk}" ${live?'data-live="1"':''} width="${100+isl.length*W}" height="${Hh}" data-isl="${JSON.stringify(pts.map(([x,y])=>[x,y-14]))}" aria-hidden="true"></canvas><svg class="route" width="${100+isl.length*W}" height="${Hh}" aria-hidden="true"><path d="${path}" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-dasharray="6 9" stroke-linecap="butt" opacity=".9"/></svg>${nodes}${live&&PLAY(ti)?treOverlay(st,pts):''}</div></div>
     ${ts.cls==='lock'||ts.cls==='soon'?`<div class="t1lock">${spr('lock',22)} <span>${ts.cls==='soon'?'Nội dung chủ đề này đang được soạn':`Hạ trùm <b>${esc(PB()[ti-1][1])}</b> ở Chủ đề ${ti} để mở`}</span></div>`:''}</div></section>${live?'<!--CARDS-->':''}`}).join('');
  return`<div class="grid" style="--oc:${OCEAN[G][1]}">
   <section class="hero sm ocean${G}" style="--oc:${OCEAN[G][1]}">${jenny(56)}<div class="grow"><span class="ocname">🌊 ${OCEAN[G][0]} · Lớp ${G}</span><h1>Chào ${esc(st.name.split(' ').pop())}!</h1><div class="chips"><span class="chip">★ <b>${tot}</b></span><span class="chip">🪙 <b>${st.coins}</b></span><button class="chip g1say" type="button" onclick="sayJ('Chào em! Mình là Jenny. Em chạm vào hòn đảo có Jenny đứng để học tiếp nhé.')">🔊 Nghe Jenny</button></div></div></section>
   <nav class="tstrip" aria-label="Các chủ đề Toán 1">${strip}</nav>
   ${secs}</div>`;
}
function featRow(st,name,ti,ts){const on=ts.cls==='open'||ts.cls==='done';return featOf(name,ti).map(f=>{const [s,n]=FEATN[f];let act='',extra='';
  if(on){if(f==='fish'||f==='balloon'){act=`startMini('${f}')`;const b=(st.mg||{})[`${curG()}:${f}`];if(b)extra=` · ${b}`}else if(f==='race'){act='startRace()';const b=(st.race||{})['g'+curG()];if(b)extra=` · ${b}`}else if(f==='cboss'){const b=cb(curG());act=b&&b.on&&!b.won?'startCB()':`toast('${b&&b.won?'Cả lớp đã hạ trùm tuần này!':'Cô giáo chưa mở trùm lớp tuần này.'}')`}else if(f==='sea'){act=`toast('Kho báu đang trôi trên biển. Hôm nay còn ${treLeft(st)} lần, chạm vào chai thư hoặc cá voi nhé!')`;extra=` · ${treLeft(st)}`}else if(f==='card'){act="go({k:'home',tab:'album'})";extra=` · ${Object.keys(st.cards||{}).length}/${CREAT.length}`}}
  return`<button type="button" class="fchip" ${on?`onclick="${act}"`:'disabled'}>${spr(s,20)}<span>${n}${extra}</span></button>`}).join('')}
function topicSt1(st,ti){const IL=PI(),L=IL.filter(x=>x.ti===ti);if(L.length){const op=open1(st,IL.indexOf(L[0])),got=L.reduce((a,x)=>a+s1(st,x.id).m.filter(Boolean).length,0),done=L.every(x=>s1(st,x.id).m.every(Boolean));return{cls:done?'done':op?'open':'lock',done,got}}
  const prev=ti>0?topicSt1(st,ti-1):{done:false};return{cls:prev.done?'soon':'lock',done:false,got:0}}
function curT1(st){for(let i=0;i<PT().length;i++){const ts=topicSt1(st,i);if(!ts.done)return ts.cls==='open'?i:Math.max(0,i-1)}return PT().length-1}
function jumpT1(ti,smooth){const el=document.getElementById('t1_'+ti);if(!el)return;const top=el.getBoundingClientRect().top+window.scrollY-(document.querySelector('.appbar')?.offsetHeight||0)-12;try{window.scrollTo({top,behavior:smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'auto'})}catch(e){window.scrollTo(0,top)}}
/* ---- trang đảo ---- */
function viewIsland1(){
  const st=S.st[sid],x=isl1(scr.id),s=s1(st,x.id);
  const items=x.lv.map((_,L)=>{const boss=L===2,done=s.m[L],can=UNL||L===0||s.m[L-1];return{L,done,can,t:boss?`Trùm · ${bossOf(scr.id)[1]}`:`Màn ${L+1}`,d:(boss?`Khoảng ${QN()} đòn · 3 tim · rương`:`Khoảng ${QN()} câu · 3 tim`)+(curG()>=3?' · bài lời văn ít câu hơn':'')}});
  const nx=items.findIndex(i=>!i.done&&i.can);
  return`<div class="page"><div class="crumb"><button class="btn sm ghost" onclick="go({k:'home'})">← Bản đồ</button></div>
   <div class="card"><div class="lesson">${jenny(64)}<div class="grow"><h1>${esc(x.title)}</h1><div class="muted">${esc(x.lesson)} · Toán ${curG()} · Chủ đề ${(x.ti||0)+1}</div></div>${starsHtml(s.m.filter(Boolean).length,x.nm)}</div>
    <div class="g1goal"><b>Hôm nay em học:</b> ${esc(x.goal)}. <button class="btn sm" type="button" onclick="sayJ('${esc(x.title)}. Hôm nay em học: ${esc(x.goal)}. Mỗi màn có khoảng ${QN()} câu.${curG()<=2?' Jenny sẽ đọc đề cho em nghe.':''}')">🔊 Nghe Jenny</button></div>
    <ul class="tl">${items.map((i,k)=>`<li class="${i.done?'done':''} ${k===nx?'next':''} ${!i.can&&!i.done?'off':''}"><span class="n">${i.done?'✓':i.L===2?spr('crab',22):i.L+1}</span><div class="grow"><b>${i.t}</b><span class="muted">${i.d}</span></div><button class="btn sm ${k===nx?'pri':''}" ${i.can?'':'disabled'} onclick="startG1('${x.id}',${i.L})">${i.can?(i.done?'Chơi lại':i.L===2?'Đánh trùm':'Chơi'):'🔒'}</button></li>`).join('')}</ul>
    <p class="muted" style="margin:10px 0 0">Mỗi màn đúng khoảng 3/4 số câu và còn tim là được 1 sao. Qua Màn 1 là mở đảo tiếp theo.</p></div></div>`;
}
/* ---- chơi ---- */
function startG1(id,L){const x=isl1(id),gens=x.lv[L],n=QN();const order=shuf(gens.map((_,i)=>i));const qs=[];let w=0,k=0;while(w<n-0.01&&qs.length<n){const gi=order[k%gens.length],q=gens[gi]();k++;qs.push({...q,src:[id,L,gi],key:`${id}:${L}:${gi}`,label:q.kind||'Câu hỏi'});w+=qW(q)}
  v1Said='';go({k:'game',g1:1,id,lv:L,qs,j:0,hearts:3,ok:0,tries:0,res:[],sheet:null,picks:[],seq:[],fill:[],used:[],cnt:0,hp:L===2?n:0,t0:Date.now()});}
function q1(){return scr.qs[scr.j]}
/* tự co chữ đồng đều cho vừa nút; nếu quá bé thì giảm số cột */
function fitOpts(){document.querySelectorAll('.g1opts.big').forEach(box=>{const bs=[...box.querySelectorAll('button')].filter(b=>b.textContent.trim());if(!bs.length)return;
  const bad=()=>bs.some(b=>{if(b.scrollWidth>b.clientWidth+1)return true;if(b.querySelector('.frac,svg,img'))return false;const rg=document.createRange();rg.selectNodeContents(b);return new Set([...rg.getClientRects()].map(r=>Math.round(r.top))).size>1});
  const set=v=>bs.forEach(b=>b.style.fontSize=v?v+'px':'');set(46);if(!bad())return;
  const base=46;const cols=['c4','c3','c2','c1'];
  for(;;){let f=base;set(f);while(bad()&&f>22){f-=2;set(f)}if(!bad()&&f>=(bs.length<=4?32:26))return;const c=cols.find(k=>box.classList.contains(k));const i=cols.indexOf(c);if(i<0||i>=3){if(bad())set(Math.max(16,f));return}box.classList.remove(c);box.classList.add(cols[i+1]);set(0)}})}
try{document.fonts&&document.fonts.ready.then(()=>fitOpts());addEventListener('resize',()=>fitOpts())}catch(e){}
function optLay(hs,big,def){const T=hs.map(h=>String(h).replace(/<[^>]*>/g,'').trim()),M=Math.max(0,...T.map(t=>t.length));
  const pic=hs.some(h=>/<svg|<img/.test(String(h))),wide=hs.some(h=>{const m=String(h).match(/<svg[^>]*width="([\d.]+)"/);return m&&Number(m[1])>64});
  if(hs.some(h=>/g1grp sm/.test(String(h))))return[1,''];
  if(pic&&!M)return[wide?Math.min(def,2):def,''];
  if(big){if(M<=3)return[def,''];if(M<=5)return[Math.min(def,2),''];if(M<=8)return[Math.min(def,2),'lg'];if(M<=12)return[Math.min(def,2),'xl'];return[1,M<=20?'lg':'xl']}
  if(M<=8)return[def,''];if(M<=24)return[Math.min(def,2),''];return[1,'']}
function viewGame1(){
  const g=scr,x=g.race||g.tre||g.cbo?{title:g.race?'Đua giờ 60 giây':g.tre?TRE[g.tre][1]:'Trùm lớp'}:g.fix?{title:'Sổ lỗi sai'}:g.part===2?ju1(g.id):isl1(g.id),boss=!g.fix&&!(g.race||g.tre||g.cbo)&&g.part!==2&&g.lv===2,n=g.qs.length;
  if(g.end)return (g.race||g.tre||g.cbo)?viewEndExtra():viewEnd1();
  const q=q1();
  if(q.type==='slots'&&g.fill.length!==q.a.length){g.fill=q.a.map(()=>null);g.used=[]}
  if(q.type==='build'&&!g.cnt)g.cnt=q.start;
  const cbb=g.cbo?cbI(g.id):null;
  const track=g.race?`<span class="mgsc">${spr('star',22)} <b>${g.ok}</b></span><span class="grow"></span><span class="mgsc">${spr('clock',22)} <b id="rtime">${g.t}</b></span>`:cbb?`<div class="bosshp" aria-label="Máu trùm lớp"><i style="width:${cbb.hp/cbb.max*100}%"></i></div>`:boss?`<div class="bosshp" aria-label="Máu trùm ${g.hp}/${n}"><i style="width:${g.hp/n*100}%"></i></div>`:`<div class="planks" aria-label="Câu ${g.j+1}/${n}">${g.qs.map((_,k)=>`<i class="${g.res[k]===true?'ok':g.res[k]===false?'bad':k===g.j?'cur':''}"></i>`).join('')}</div>`;
  return`<div class="game g1" role="dialog" aria-label="${esc(x.title)}"><div class="gtop"><button class="gx" onclick="try{speechSynthesis.cancel()}catch(e){};${g.tre?`go({k:'home'})`:g.race||g.cbo?`go({k:'island',id:'${g.id}'})`:g.fix?`go({k:'home',tab:'fix'})`:g.part===2?`go({k:'jenny',id:'${g.id}'})`:`go({k:'island',id:'${g.id}'})`}" aria-label="Thoát">✕</button>${track}${g.race?'':g.tre?'<span class="pill acc">Kho báu</span>':g.fix?'<span class="pill acc">📒 Luyện lỗi</span>':`<span class="hearts" aria-label="Còn ${g.hearts} tim">${[0,1,2].map(i=>`<span class="${i<g.hearts?'':'lost'}">❤</span>`).join('')}</span>`}</div>
   <div class="gmid ${g.flash?'fl'+g.flash:''}">${cbb?`<div class="scene boss"><span class="monster">${bossHTML(cbb.spr,84,g.hit?'hit':g.mad?'mad':'idle',cbb.hp/cbb.max)}</span><span class="muted">${esc(cbb.name)} · ${cbb.hp}/${cbb.max} máu</span></div>`:''}${boss?`<div class="scene boss"><span class="monster">${bossHTML(bossOf(scr.id)[0],84,g.hit?'hit':g.mad?'mad':'idle',g.hp/n)}</span><span class="muted">${bossOf(scr.id)[1]}</span></div>`:''}
    <div class="g1q">${jenny(54,jMood(g))}<div class="g1bub"><div>${q.q}</div><button class="g1spk" type="button" onclick="sayJ(sayFull(q1().say,q1().q))" aria-label="Nghe lại đề">🔊</button></div></div>
    ${q.pic?`<div class="g1pic">${q.pic}</div>`:''}${q.type==='num'?`<div class="slotbox ${g.inp?'':'empty'}" aria-live="polite">${g.inp?esc(g.inp):'?'}</div>`:''}${q.type==='slots'?slotsView(q):q.type==='build'?buildView(q):q.type==='order'?`<div class="g1seq">${q.a.map((_,k)=>`<span>${g.seq[k]!==undefined?q.opts[g.seq[k]]:''}</span>`).join('')}</div>`:''}</div>
   <div class="gbot">${g.sheet?sheet1():input1(q)}</div></div>`;
}
function slotsView(q){const g=scr;let b=0;return`<div class="g1cells">${q.cells.map(v=>{if(v!==null)return`<span class="c">${v}</span>`;const i=b++;return`<button type="button" class="c slot ${g.fill[i]!==null?'full':''}" data-slot="${i}" onclick="slotTap(${i})" aria-label="Ô trống ${i+1}">${g.fill[i]!==null?q.tiles[g.fill[i]]:''}</button>`}).join('')}</div>`}
function buildView(q){const g=scr;return`<div class="g1build"><div class="g1grp">${Array.from({length:g.cnt},(_,i)=>spr(q.obj,40,i>=q.start?'g1add':'')).join('')}</div></div>`}
function input1(q){const g=scr;
  if(q.type==='num')return`<div class="pad">${['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map(k=>`<button type="button" class="${k==='✓'?'go':k==='⌫'?'del':''}" onclick="key1('${k}')" aria-label="${k==='⌫'?'Xóa':k==='✓'?'Nộp':k}">${k==='✓'?'Nộp':k}</button>`).join('')}</div>`;
  if(q.type==='opt'){const [cc,sz]=optLay(q.opts.map(o=>o.h),q.big,q.cols||(q.opts.length===4?2:3));return`<div class="g1opts c${cc} ${q.big?'big':''}">${q.opts.map((o,i)=>`<button type="button" class="${sz}" onclick="ans1(${i})">${o.h}</button>`).join('')}</div>`}
  if(q.type==='tf')return`<div class="g1opts c2 big"><button type="button" class="t" onclick="ans1(true)">Đúng</button><button type="button" class="f" onclick="ans1(false)">Sai</button></div>`;
  const LY=q.opts?optLay(q.opts,1,q.type==='order'?4:3):[3,''],SZ=()=>LY[1];
  if(q.type==='pick')return`<div class="g1opts c${LY[0]} big">${q.opts.map((o,i)=>`<button type="button" class="${g.picks.includes(i)?'on':''} ${SZ(o)}" aria-pressed="${g.picks.includes(i)}" onclick="pick1(${i})">${o}</button>`).join('')}</div><button class="gobtn" type="button" ${g.picks.length?'':'disabled'} onclick="ans1(scr.picks)">Kiểm tra</button>`;
  if(q.type==='order')return`<div class="g1opts c${LY[0]} big">${q.opts.map((o,i)=>`<button type="button" ${g.seq.includes(i)?`disabled class="used ${SZ(o)}"`:`class="${SZ(o)}"`} onclick="ord1(${i})">${o}</button>`).join('')}</div><button class="gobtn ghost" type="button" ${g.seq.length?'':'disabled'} onclick="scr.seq=[];render()">Xếp lại</button>`;
  if(q.type==='slots')return`<div class="g1tiles">${q.tiles.map((v,i)=>`<button type="button" class="g1tile" data-t="${i}" ${g.used.includes(i)?'disabled':''}>${v}</button>`).join('')}</div><p class="g1hint">Kéo số vào ô trống, hoặc chạm vào số.</p><button class="gobtn" type="button" ${g.fill.every(v=>v!==null)?'':'disabled'} onclick="ans1(scr.fill.map(i=>q1().tiles[i]))">Kiểm tra</button>`;
  if(q.type==='build')return`<div class="g1opts c2 big"><button type="button" onclick="cnt1(-1)" aria-label="Bớt 1">− Bớt</button><button type="button" onclick="cnt1(1)" aria-label="Thêm 1">+ Thêm</button></div><button class="gobtn" type="button" onclick="ans1(scr.cnt)">Kiểm tra</button>`;
  return'';
}
function pick1(i){const g=scr;g.picks=g.picks.includes(i)?g.picks.filter(x=>x!==i):[...g.picks,i];sfx('tap');render()}
function ord1(i){const g=scr,q=q1();if(g.seq.includes(i))return;g.seq.push(i);sfx('tap');if(g.seq.length===q.opts.length){ans1(g.seq);return}render()}
function cnt1(d){const g=scr,q=q1();g.cnt=Math.max(q.start,Math.min(10,g.cnt+d));sfx('tap');render()}
function slotTap(i){const g=scr;if(g.sheet)return;if(g.fill[i]!==null){g.used=g.used.filter(u=>u!==g.fill[i]);g.fill[i]=null;render()}}
function placeTile(t,slot){const g=scr;if(g.sheet||g.used.includes(t))return;if(slot===undefined||slot<0)slot=g.fill.indexOf(null);if(slot<0)return;if(g.fill[slot]!==null)g.used=g.used.filter(u=>u!==g.fill[slot]);g.fill[slot]=t;g.used.push(t);sfx('tap');render()}
/* kéo thả bằng ngón tay / chuột */
(function(){let drag=null;
 document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('.g1tile');if(!b||b.disabled)return;e.preventDefault();const r=b.getBoundingClientRect();const gh=b.cloneNode(true);gh.className='g1tile g1ghost';gh.style.width=r.width+'px';gh.style.height=r.height+'px';gh.style.left=r.left+'px';gh.style.top=r.top+'px';document.body.appendChild(gh);drag={t:+b.dataset.t,x0:e.clientX,y0:e.clientY,dx:e.clientX-r.left,dy:e.clientY-r.top,gh,moved:false};try{b.setPointerCapture(e.pointerId)}catch(_){}});
 document.addEventListener('pointermove',e=>{if(!drag)return;if(Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)>6)drag.moved=true;drag.gh.style.left=(e.clientX-drag.dx)+'px';drag.gh.style.top=(e.clientY-drag.dy)+'px';document.querySelectorAll('.slot.over').forEach(s=>s.classList.remove('over'));drag.gh.style.visibility='hidden';const el=document.elementFromPoint(e.clientX,e.clientY);drag.gh.style.visibility='';const s=el&&el.closest&&el.closest('.slot');if(s)s.classList.add('over')});
 const end=e=>{if(!drag)return;const d=drag;drag=null;d.gh.style.visibility='hidden';const el=document.elementFromPoint(e.clientX,e.clientY);d.gh.remove();const s=el&&el.closest&&el.closest('.slot');if(s)placeTile(d.t,+s.dataset.slot);else if(!d.moved)placeTile(d.t);};
 document.addEventListener('pointerup',end);document.addEventListener('pointercancel',e=>{if(drag){drag.gh.remove();drag=null}});
})();
function key1(k){const g=scr;if(g.sheet)return;if(k==='⌫')g.inp=(g.inp||'').slice(0,-1);else if(k==='✓'){if(g.inp)ans1(Number(g.inp));return}else if((g.inp||'').length<9)g.inp=(g.inp||'')+k;sfx('tap');render()}
function right1(q,v){if(q.type==='num')return Number(v)===q.a;if(q.type==='opt')return v===q.a;if(q.type==='tf'||q.type==='build')return v===q.a;if(q.type==='pick'){const a=[...v].sort((x,y)=>x-y);return a.length===q.a.length&&a.every((x,i)=>x===q.a[i])}if(q.type==='order')return v.every((x,i)=>q.opts[x]===q.opts[q.a[i]]);if(q.type==='slots')return v.every((x,i)=>x===q.a[i]);return false}
function show1(q){if(q.type==='num')return fmt(q.a);if(q.type==='opt')return q.opts[q.a].h.length>40?'khung đúng được tô xanh':q.opts[q.a].h;if(q.type==='tf')return q.a?'Đúng':'Sai';if(q.type==='build')return q.a;return''}
function ans1(v){if(scr.race){const q=q1(),ok=right1(q,v);log(sid,'answered',`Đua giờ · lớp ${curG()}`,0,{success:ok});if(!ok)mist1Add(q);raceAns(ok);return}const g=scr,q=q1(),ok=right1(q,v),st=S.st[sid],x=(g.tre||g.cbo)?{title:g.tre?'Kho báu biển':'Trùm lớp'}:g.fix?{title:'Sổ lỗi sai'}:g.part===2?ju1(g.id):isl1(g.id),qd=quest(st);let extra='';
  if(g.fix){const M=mist(st),e=M[q.key];if(ok&&e){e.streak++;if(e.streak>=2){delete M[q.key];g.fixed++;qd.fix=(qd.fix||0)+1;extra=' · Sửa xong lỗi này!'}else extra=' · Đúng thêm 1 lần nữa là sửa xong'}else if(e)e.streak=0}
  else if(!ok&&g.tries===0&&g.part!==2)mist1Add(q);
  log(sid,'answered',`Toán ${curG()} · ${x.title}`,0,{success:ok,duration:`PT${Math.round((Date.now()-g.t0)/1000)}S`});
  if(ok){if(g.cbo){const b=cbI(g.id);if(b&&!b.won){b.hp--;b.hits[sid]=(b.hits[sid]||0)+1;if(b.hp<=0){b.hp=0;b.won=true}}g.hit=true;sfx('hit')}g.ok++;qd.ok++;g.res[g.j]=g.res[g.j]===undefined?true:g.res[g.j];const c=addCoins(sid,5,'self');if(g.lv===2){g.hp--;g.hit=true;sfx('hit')}else sfx('ok');g.sheet={kind:'ok',msg:(c?`+${c} xu`:'')+extra};sayJ(pick(['Giỏi quá!','Đúng rồi!','Tuyệt vời!','Em làm đúng rồi!']))}
  else{g.tries++;if(!g.fix){g.hearts--;setTimeout(()=>hurtFx(1),30)}sfx('bad');if(g.lv===2||g.cbo){g.mad=1;g.hit=false;setTimeout(()=>sfx('bossmad'),180)}
    if(g.hearts<=0){g.res[g.j]=false;g.sheet={kind:'dead'};sayJ('Hết tim rồi. Mình chơi lại nhé!')}
    else if(g.tries===1){g.sheet={kind:'retry'};sayJ('Chưa đúng rồi. Em thử lại nhé.')}
    else{g.res[g.j]=false;g.sheet={kind:'bad'};sayJ(q.sol.replace(/&gt;/g,' lớn hơn ').replace(/&lt;/g,' bé hơn ').replace(/=/g,' bằng '))}}
  save();render()}
function sheet1(){const g=scr,q=q1(),s=g.sheet;
  if(s.kind==='ok')return`<div class="sheet ok"><div class="sh"><span class="ic">✓</span><div><b>${pick(['Giỏi quá!','Đúng rồi!','Tuyệt vời!'])}</b><div>${s.msg}</div></div></div><button class="gobtn" type="button" onclick="next1()">Tiếp tục</button></div>`;
  if(s.kind==='retry')return`<div class="sheet warn"><div class="sh"><span class="ic">?</span><div><b>Chưa đúng, mất 1 tim.</b><div>Em nhìn kỹ hình và thử lại nhé.</div></div></div><button class="gobtn" type="button" onclick="retry1()">Thử lại</button></div>`;
  if(s.kind==='bad')return`<div class="sheet bad"><div class="sh"><span class="ic">✕</span><div><b>Đáp án đúng${show1(q)!==''?': '+show1(q):''}</b><div>${q.sol}</div></div></div><button class="gobtn" type="button" onclick="next1()">Tiếp tục</button></div>`;
  return`<div class="sheet bad"><div class="sh"><span class="ic">💔</span><div><b>Hết tim rồi!</b><div>${q.sol}</div></div></div><button class="gobtn" type="button" onclick="end1(false)">Xem kết quả</button></div>`}
function retry1(){const g=scr;g.sheet=null;g.mad=0;g.inp='';g.picks=[];g.seq=[];g.fill=[];g.used=[];g.cnt=0;render()}
function next1(){const g=scr;g.hit=false;g.mad=0;g.inp='';if(g.j<g.qs.length-1){g.j++;g.sheet=null;g.tries=0;g.picks=[];g.seq=[];g.fill=[];g.used=[];g.cnt=0;g.t0=Date.now();render()}else end1(true)}
function end1(alive){if(scr.race||scr.tre||scr.cbo)return endExtra();if(scr.fix)return endFix1();if(scr.part===2)return endJ1(alive);const g=scr,st=S.st[sid],x=isl1(g.id),s=s1(st,x.id),qd=quest(st),k=PI().indexOf(x);
  const need=needOf(g.qs.length);g.end=true;g.pass=alive&&g.hearts>0&&g.ok>=need;g.newStar=false;g.unlock=null;
  if(g.pass){qd.pass++;if(!s.m[g.lv]){s.m[g.lv]=true;g.newStar=true;log(sid,'earned',`Toán ${curG()} · ${x.title} · màn ${g.lv+1}`,0,{score:{raw:1}})}st.coins+=g.lv===2?30:10;
    if(g.lv===0&&g.newStar&&PI()[k+1])g.unlock=PI()[k+1];
    if(g.lv===2)st.badges.push({t:`Huy hiệu Chủ đề ${(x.ti||0)+1} · Toán ${curG()}`,day:S.day,from:'máy'});
    log(sid,'passed',`Toán ${curG()} · ${x.title} · màn ${g.lv+1}`,0,{success:true,score:{raw:g.ok,max:g.qs.length}});sfx(g.lv===2?'bossdown':'win');sayJ(g.lv===2?`Em đã hạ được ${bossOf(g.id)[1]}! Giỏi lắm!`:'Em qua màn rồi! Giỏi quá!')}
  else{s.fails[g.lv]=(s.fails[g.lv]||0)+1;log(sid,'failed',`Toán ${curG()} · ${x.title} · màn ${g.lv+1}`,0,{success:false});sfx('bad');sfx(scr.lv===2?'bosslaugh':'lose');sayJ('Không sao cả. Mình chơi lại nhé!')}
  save();render()}
function viewEnd1(){if(scr.fix||scr.part===2)return viewEnd1b();const g=scr,x=isl1(g.id),k=PI().indexOf(x),boss=g.lv===2,nextL=x.lv[g.lv+1]?g.lv+1:-1;
  return`<div class="game g1"><div class="gend">${g.pass?(boss?`<div class="bigicon bossend">${jenny(70,'cheer')}${bossHTML(bossOf(scr.id)[0],80,'dead')}${spr('chest',60)}</div>`:`<div class="bigicon bossend">${jenny(76,'cheer')}${spr('star',70)}</div>`):(boss?`<div class="bigicon bossend">${jenny(64,'sad')}${bossHTML(bossOf(scr.id)[0],90,'win')}</div>`:jenny(84,'sad'))}
   <h1>${g.pass?(boss?`Hạ gục ${bossOf(scr.id)[1]}!`:'Qua màn!'):'Mình chơi lại nhé!'}</h1>
   <p class="muted">${g.ok}/${g.qs.length} câu đúng · còn ${Math.max(0,g.hearts)} tim${g.pass?` · +${boss?30:10} xu`:''}</p>
   ${g.newStar?'<p class="earn">+1 sao</p>':''}${g.card?`<p class="earn">Thẻ mới: ${spr(g.card[0],28)} ${esc(g.card[1])}</p>`:''}${g.unlock?`<p class="muted">Đã mở đảo mới: <b>${esc(g.unlock.short)}</b></p>`:''}
   <div class="gendbtn">${g.pass&&nextL>0?`<button class="gobtn" type="button" onclick="startG1('${x.id}',${nextL})">${nextL===2?'Đánh trùm':'Màn '+(nextL+1)}</button>`:''}${!g.pass?`<button class="gobtn" type="button" onclick="startG1('${x.id}',${g.lv})">Chơi lại</button>`:''}${g.pass&&nextL<0&&PI()[k+1]?`<button class="gobtn" type="button" onclick="go({k:'island',id:'${PI()[k+1].id}'})">Đảo tiếp theo →</button>`:''}<button class="gobtn ghost" type="button" onclick="go({k:'island',id:'${x.id}'})">Về đảo</button><button class="gobtn ghost" type="button" onclick="go({k:'home'})">Bản đồ</button></div></div></div>`}
/* đọc đề khi câu mới hiện ra */
function g1AfterRender(){if(role==='hs'&&S.st[sid]&&S.st[sid].grade<=5&&scr.k==='home'&&(scr.tab||'map')==='map'&&!scr.noJump){const c=curT1(S.st[sid]);setTimeout(()=>{if(c>0)jumpT1(c);const ch=document.querySelector('.tchip.on');if(ch&&ch.parentNode)ch.parentNode.scrollLeft=ch.offsetLeft-ch.parentNode.clientWidth/2+ch.offsetWidth/2},0)}if(role!=='hs'||!S.st[sid]||S.st[sid].grade>2||scr.k!=='game'||scr.end||scr.sheet)return;const key=scr.id+scr.lv+':'+scr.j+':'+scr.t0;if(v1Said===key)return;v1Said=key;setTimeout(()=>{if(scr.k==='game'&&scr.g1&&scr.qs&&!scr.end&&!scr.sheet)sayJ(sayFull(q1().say,q1().q))},250)}

P1BY[1]=P1_1;ALLP1.push(...P1_1);
