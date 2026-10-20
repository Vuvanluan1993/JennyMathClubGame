/* 42 — Hướng dẫn khi đếm sai (lớp 1, trong phạm vi 10): khoanh lần lượt từng đối tượng, đánh số 1, 2, 3…
   Đếm từ trái sang phải, từ trên xuống dưới; đếm hình thì chỉ khoanh đúng loại hình được hỏi, các hình khác làm mờ. */
const GD_SHAPE={tr:'tam giác',sq:'vuông',ci:'tròn',rc:'chữ nhật'};
let GD_SHSRC=null;
function gdShapeOf(src){if(!GD_SHSRC){GD_SHSRC={};try{for(const k in PXS)if(/^sh_(tr|sq|ci|rc)_/.test(k))GD_SHSRC[pxURI(k).u]=k.slice(3,5)}catch(e){}}return GD_SHSRC[src]||null}
function gdCountParse(q){if(curG()!==1||q.type!=='opt'||!q.pic||!/Đếm số lượng|Đếm hình/.test(q.kind||''))return null;
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
document.head.insertAdjacentHTML('beforeend',`<style>
.gdcntw .g1grp{max-width:300px}
.gdcnt{position:relative;display:inline-block;padding:4px;line-height:0}
.gdcnt.on::after{content:"";position:absolute;inset:-2px;pointer-events:none;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' preserveAspectRatio='none' shape-rendering='crispEdges'%3E%3Cpath d='M3 0h6v1H3zM1 1h2v1H1zM9 1h2v1H9zM0 2h1v1H0zM11 2h1v1h-1zM0 3h1v6H0zM11 3h1v6h-1zM0 9h1v1H0zM11 9h1v1h-1zM1 10h2v1H1zM9 10h2v1H9zM3 11h6v1H3z' fill='%23E0441A'/%3E%3C/svg%3E") 0 0/100% 100% no-repeat}
.gdcnt.cur::after{filter:drop-shadow(0 0 0 #E0441A);animation:gdpop3 .25s steps(3)}
.gdcnt b{position:absolute;right:-6px;top:-8px;min-width:18px;height:18px;padding:0 2px;box-sizing:border-box;font-family:var(--f-display);font-weight:400;font-size:18px;line-height:18px;text-align:center;color:#fff;background:#E0441A;z-index:1}
.gdcnt.cur b{background:#1F2A5A}
.gdcnt.dim img{opacity:.25;filter:grayscale(1)}
@keyframes gdpop3{from{transform:scale(1.3)}to{transform:none}}
</style>`);
