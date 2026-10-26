/* 42 — Hướng dẫn khi đếm sai (lớp 1, trong phạm vi 10): khoanh lần lượt từng đối tượng, đánh số 1, 2, 3…
   Đếm từ trái sang phải, từ trên xuống dưới; đếm hình thì chỉ khoanh đúng loại hình được hỏi, các hình khác làm mờ. */
import { PXS, pxURI } from './22-do-hoa-pixel-mau-logo-clb.js';
import { curG } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { GD_EXT, gdEq, gdTxt } from './40-huong-dan-khi-sai.js';
const GD_SHAPE={tr:'tam giác',sq:'vuông',ci:'tròn',rc:'chữ nhật'};
let GD_SHSRC=null;
function gdShapeOf(src){if(!GD_SHSRC){GD_SHSRC={};try{for(const k in PXS)if(/^sh_(tr|sq|ci|rc)_/.test(k))GD_SHSRC[pxURI(k).u]=k.slice(3,5)}catch(e){}}return GD_SHSRC[src]||null}
function gdCountParse(q){if(curG()!==1||q.type!=='opt'||!q.pic||!/Đếm số lượng|Đếm hình|Lắp ghép, xếp hình/.test(q.kind||''))return null;
 const ans=Number(gdTxt(q.opts[q.a]&&q.opts[q.a].h||''));if(!(ans>=0&&ans<=10))return null;
 const t=document.createElement('template');t.innerHTML=q.pic;const imgs=[...t.content.querySelectorAll('img')];if(!imgs.length||imgs.length>16)return null;
 const qt=gdTxt(q.q),m=qt.match(/mấy\s+(.+?)\s*\?/),noun=m?m[1].trim():'đồ vật';let tgt;
 if(/Đếm hình/.test(q.kind)){const want=Object.keys(GD_SHAPE).find(k=>new RegExp('hình '+GD_SHAPE[k]+'(?!\\s*nhật)').test(qt)||(k==='rc'&&/chữ nhật/.test(qt)));if(!want)return null;
  tgt=imgs.map(im=>gdShapeOf(im.getAttribute('src'))===want)}
 else{/* nhóm ảnh giống nhau có số lượng đúng bằng đáp án */const cnt={};imgs.forEach(im=>{const s=im.getAttribute('src');cnt[s]=(cnt[s]||0)+1});const s=Object.keys(cnt).find(k=>cnt[k]===ans)||(Object.keys(cnt).length===1?Object.keys(cnt)[0]:null);if(!s)return null;tgt=imgs.map(im=>im.getAttribute('src')===s)}
 if(tgt.filter(Boolean).length!==ans)return null;return{ans,noun,tgt,mixed:tgt.some(x=>!x)}}
function gdCountPic(q,k,shown,cur,dimOthers){const t=document.createElement('template');t.innerHTML=q.pic;let n=0;
 [...t.content.querySelectorAll('img')].forEach((im,i)=>{const w=document.createElement('span');w.className='gdcnt';
  if(k.tgt[i]){n++;if(n<=shown){w.classList.add('on');if(n===cur)w.classList.add('cur');w.insertAdjacentHTML('beforeend',`<b>${n}</b>`)}}else if(dimOthers)w.classList.add('dim');
  im.replaceWith(w);w.prepend(im)});
 const box=document.createElement('div');box.className='gdcntw';box.appendChild(t.content);return box.outerHTML}
function gdFramesCount(k,q){const F=[],{ans,noun}=k;
 F.push({h:gdCountPic(q,k,0,0,false),say:`Mình đếm lần lượt từng ${noun}: từ trái sang phải, từ trên xuống dưới. Đếm ${noun.split(' ')[0]} nào thì khoanh ${noun.split(' ')[0]} đó, để không đếm sót, không đếm hai lần.`,dur:3800});
 if(k.mixed)F.push({h:gdCountPic(q,k,0,0,true),say:`Chỉ đếm ${noun}. Các hình khác mình để mờ đi, không đếm.`,dur:2800});
 if(ans===0){F.push({h:gdCountPic(q,k,0,0,k.mixed)+gdEq('<em>0</em>'),say:`Không có ${noun} nào. Vậy là 0.`,dur:2600});return F}
 for(let i=1;i<=ans;i++)F.push({h:gdCountPic(q,k,i,i,k.mixed),say:`${i}`,dur:i===1?1300:900});
 F.push({h:gdCountPic(q,k,ans,0,k.mixed)+gdEq(`<em>${ans}</em>`),say:`${noun.replace(/^./,c=>c.toUpperCase())} cuối cùng được khoanh là số ${ans}. Vậy có ${ans} ${noun}.`,dur:3000});return F}
GD_EXT.push({t:'count',on:true,kind:gdCountParse,frames:gdFramesCount});
/* đếm khối lập phương: đếm từng cột, từ dưới lên */
function gdCubeParse(q){if(curG()!==1||q.type!=='opt'||!/Đếm khối lập phương/.test(q.kind||'')||!/<svg/.test(q.pic||''))return null;const ans=Number(gdTxt(q.opts[q.a]&&q.opts[q.a].h||''));
 const t=document.createElement('template');t.innerHTML=q.pic;const cubes=[...t.content.querySelectorAll('rect[stroke]')].map(r=>({x:+r.getAttribute('x'),y:+r.getAttribute('y'),w:+r.getAttribute('width'),h:+r.getAttribute('height')})).filter(r=>r.w>=16);
 if(cubes.length!==ans||!ans||ans>12)return null;cubes.sort((a,b)=>a.x-b.x||b.y-a.y);const cols=[];cubes.forEach(c=>{let col=cols.find(k=>Math.abs(k.x-c.x)<4);if(!col)cols.push(col={x:c.x,n:0});col.n++});return{ans,cubes,cols:cols.map(c=>c.n)}}
function gdCubePic(q,k,shown){const t=document.createElement('template');t.innerHTML=q.pic;const svg=t.content.querySelector('svg');if(!svg)return'';
 k.cubes.slice(0,shown).forEach((c,i)=>{svg.insertAdjacentHTML('beforeend',`<rect x="${c.x+3}" y="${c.y+3}" width="${c.w-6}" height="${c.h-6}" fill="none" stroke="#E0441A" stroke-width="3"/><rect x="${c.x+c.w/2-6}" y="${c.y+c.h/2-6}" width="12" height="12" fill="${i===shown-1?'#1F2A5A':'#E0441A'}"/><text x="${c.x+c.w/2}" y="${c.y+c.h/2+4}" text-anchor="middle" font-family="VT323" font-size="12" fill="#fff">${i+1}</text>`)});
 return `<div class="gdcntw">${t.innerHTML}</div>`}
function gdFramesCube(k,q){const F=[];F.push({h:gdCubePic(q,k,0),say:`Mình đếm từng cột, mỗi cột đếm từ dưới lên. Đếm khối nào thì đánh dấu khối đó.`,dur:3000});
 let n=0;k.cols.forEach((m,ci)=>{for(let j=0;j<m;j++){n++;F.push({h:gdCubePic(q,k,n),say:j===0&&ci>0?`Cột tiếp theo: ${n}`:`${n}`,dur:n===1?1300:900})}});
 F.push({h:gdCubePic(q,k,k.ans)+gdEq(k.cols.length>1?`${k.cols.join(' + ')} = <em>${k.ans}</em>`:`<em>${k.ans}</em>`),say:`${k.cols.length>1?`Các cột có ${k.cols.join(', ')} khối. `:''}Tất cả có ${k.ans} khối lập phương.`,dur:3000});return F}
GD_EXT.push({t:'cube',on:true,kind:gdCubeParse,frames:gdFramesCube});
/* tìm khung có đúng số lượng: đếm từng khung, ghi số dưới khung */
function gdBoxParse(q){if(curG()!==1||q.type!=='opt'||!/Tìm khung đúng số lượng/.test(q.kind||''))return null;const m=gdTxt(q.q).match(/có\s+(\d+)\s+(.+?)\.?$/);if(!m)return null;
 const want=+m[1],noun=m[2].trim(),cnt=q.opts.map(o=>{const t=document.createElement('template');t.innerHTML=o.h;return t.content.querySelectorAll('img').length});if(cnt[q.a]!==want)return null;return{want,noun,cnt,a:q.a}}
function gdBoxPic(q,k,upto,cur,shown){/* upto: số khung đã đếm xong; cur: khung đang đếm, shown: số đã khoanh trong khung đó */return `<div class="gdboxes">${q.opts.map((o,i)=>{const t=document.createElement('template');t.innerHTML=o.h;let n=0;
  [...t.content.querySelectorAll('img')].forEach(im=>{const w=document.createElement('span');w.className='gdcnt';n++;const lim=i<upto?99:i===cur?shown:0;if(n<=lim){w.classList.add('on');if(i===cur&&n===shown)w.classList.add('cur');w.insertAdjacentHTML('beforeend',`<b>${n}</b>`)}im.replaceWith(w);w.prepend(im)});
  const done=i<upto,ok=done&&k.cnt[i]===k.want;return `<div class="gdbx${ok?' ok':''}${i===cur?' cur':''}">${t.innerHTML}<i>${done?k.cnt[i]:''}</i></div>`}).join('')}</div>`}
function gdFramesBox(k,q){const F=[];F.push({h:gdBoxPic(q,k,0,-1,0),say:`Cần tìm khung có ${k.want} ${k.noun}. Mình đếm lần lượt từng khung, khoanh từng ${k.noun.split(' ')[0]} một.`,dur:3000});
 k.cnt.forEach((c,i)=>{for(let j=1;j<=c;j++)F.push({h:gdBoxPic(q,k,i,i,j),say:`${j}`,dur:650});F.push({h:gdBoxPic(q,k,i+1,-1,0),say:`Khung ${i+1} có ${c} ${k.noun}.${c===k.want?' Đúng rồi!':''}`,dur:1700})});
 F.push({h:gdBoxPic(q,k,k.cnt.length,-1,0),say:`Khung thứ ${k.a+1} có đúng ${k.want} ${k.noun}.`,dur:2600});return F}
GD_EXT.push({t:'box',on:true,kind:gdBoxParse,frames:gdFramesBox});
document.head.insertAdjacentHTML('beforeend',`<style>
.gdcntw .g1grp{max-width:300px}.g1cellfig .gdcnt{padding:0}.g1cellfig .gdcnt.on::after{inset:0;background:rgba(255,255,255,.55)}.g1cellfig .gdcnt b{right:auto;top:50%;left:50%;transform:translate(-50%,-50%);min-width:20px;height:20px;line-height:20px;font-size:20px;background:#1F2A5A}.g1cellfig .gdcnt.cur b{background:#E0441A}
.gdboxes{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}.gdbx{display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px;background:#fff;box-shadow:0 0 0 3px #C9D1E6}.gdbx.cur{box-shadow:0 0 0 3px #FCB40C}.gdbx.ok{box-shadow:0 0 0 3px #1E9A52;background:#E3F7EA}.gdbx>i{font-style:normal;font-family:var(--f-display);font-size:26px;line-height:1;min-height:26px;color:#1F2A5A}.gdbx .g1grp.sm{max-width:96px;padding:2px}.gdbx .gdcnt{padding:2px}.gdbx .gdcnt b{font-size:14px;min-width:14px;height:14px;line-height:14px;right:-4px;top:-6px}
.gdcnt{position:relative;display:inline-block;padding:4px;line-height:0}
.gdcnt.on::after{content:"";position:absolute;inset:-2px;pointer-events:none;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' preserveAspectRatio='none' shape-rendering='crispEdges'%3E%3Cpath d='M3 0h6v1H3zM1 1h2v1H1zM9 1h2v1H9zM0 2h1v1H0zM11 2h1v1h-1zM0 3h1v6H0zM11 3h1v6h-1zM0 9h1v1H0zM11 9h1v1h-1zM1 10h2v1H1zM9 10h2v1H9zM3 11h6v1H3z' fill='%23E0441A'/%3E%3C/svg%3E") 0 0/100% 100% no-repeat}
.gdcnt.cur::after{filter:drop-shadow(0 0 0 #E0441A);animation:gdpop3 .25s steps(3)}
.gdcnt b{position:absolute;right:-6px;top:-8px;min-width:18px;height:18px;padding:0 2px;box-sizing:border-box;font-family:var(--f-display);font-weight:400;font-size:18px;line-height:18px;text-align:center;color:#fff;background:#E0441A;z-index:1}
.gdcnt.cur b{background:#1F2A5A}
.gdcnt.dim img{opacity:.25;filter:grayscale(1)}
@keyframes gdpop3{from{transform:scale(1.3)}to{transform:none}}
</style>`);
