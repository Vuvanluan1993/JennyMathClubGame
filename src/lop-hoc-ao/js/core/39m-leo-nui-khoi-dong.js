/* ===================== LEO NÚI: 5 chặng, 3 chặng đầu khởi động ===================== */
/* Chặng 1–3: bài lời văn một phép tính, số nhỏ, chỉ dùng phép tính đã học (khởi động). Chặng 4–5: bài lời văn của tiết như trước. */
const CLIMB_EASY_N=3;
const CE_NAMES=['Lan','Minh','Hoa','Nam','Mai','An','Bình','Hà'],CE_THINGS=[['quả cam','quả'],['cái bút','cái'],['quyển vở','quyển'],['bông hoa','bông'],['viên bi','viên'],['cái kẹo','cái'],['con cá','con'],['quả táo','quả']];
function climbEasy(x,seen){const K=ktOf(x),G=xgGr(x),F=K.f||new Set(),ops=['+','-','×',':'].filter(o=>F.has(o));if(!ops.length)return null;
  const lim=Math.max(5,Math.min(K.max||10,G<=1?10:G===2?20:G===3?50:100));
  for(let tries=0;tries<30;tries++){const op=pick(ops),nm=pick(CE_NAMES),[th,cl]=pick(CE_THINGS);let a,b,ans,t,sol;
    if(op==='+'){a=R(1,Math.max(1,Math.floor(lim*.6)));b=R(1,Math.max(1,lim-a));ans=a+b;t=`${nm} có ${fN(a)} ${th}, mẹ cho thêm ${fN(b)} ${th}. Hỏi ${nm} có tất cả bao nhiêu ${th}?`;sol=`${fN(a)} + ${fN(b)} = ${fN(ans)} (${cl})`}
    else if(op==='-'){a=R(Math.min(3,lim),lim);b=R(1,a-1);ans=a-b;t=`${nm} có ${fN(a)} ${th}, ${nm} cho bạn ${fN(b)} ${th}. Hỏi ${nm} còn lại bao nhiêu ${th}?`;sol=`${fN(a)} − ${fN(b)} = ${fN(ans)} (${cl})`}
    else if(op==='×'){a=R(2,G<=3?9:12);b=R(2,G<=3?5:9);ans=a*b;if(ans>lim)continue;t=`Mỗi hộp có ${a} ${th}. Hỏi ${b} hộp như thế có bao nhiêu ${th}?`;sol=`${a} × ${b} = ${ans} (${cl})`}
    else{b=R(2,G<=3?5:9);ans=R(2,G<=3?9:12);a=ans*b;if(a>lim)continue;t=`Có ${a} ${th} chia đều vào ${b} hộp. Hỏi mỗi hộp có bao nhiêu ${th}?`;sol=`${a} : ${b} = ${ans} (${cl})`}
    if(ans<0)continue;const key='e:'+t;if(seen&&seen.has(key))continue;if(seen)seen.add(key);
    /* đáp án nhiễu gần đúng: ±1, ±2 (hoặc ±10 khi số lớn), không âm */
    const d=ans>=50?10:1,cand=[...new Set([ans+d,ans-d,ans+2*d,ans+1,ans-1].filter(v=>v>=0&&v!==ans))];const opts=shuf([ans,...shuf(cand).slice(0,2)]).map(v=>`${fN(v)} ${cl}`);
    return{t,pic:'',opts,a:opts.indexOf(`${fN(ans)} ${cl}`),q:{kind:'Giải toán lời văn (khởi động)',say:t},sol:`Bài giải: ${sol}.`,easy:1}}
  return null}
{const _q=climbQ;climbQ=function(x,seen){const g=scr,sc=(g&&g.k==='xg'&&g.mode==='climb'&&g.seen===seen)?g.score:0;if(sc<CLIMB_EASY_N){const e=climbEasy(x,seen);if(e)return e}return _q.apply(this,arguments)}}
/* lời mở đầu / huy hiệu theo số chặng mới */
{const _r=render;render=function(){const v=_r.apply(this,arguments);try{if(scr.k==='xg'&&scr.mode==='climb'){if(scr.say)scr.say=String(scr.say).replace(/sáu chặng/g,'năm chặng');document.querySelectorAll('.xcbadge small').forEach(s=>s.textContent=s.textContent.replace(/\b6 bài/,`${CLIMB_N} bài`))}}catch(e){}return v}}

/* ===================== BẢN ĐỒ: quay lại đúng chủ đề đang xem ===================== */
/* Vào đảo (hoặc chạm thẻ chủ đề) thì nhớ chủ đề; về bản đồ thì cuộn tới chủ đề đó thay vì chủ đề 1/chủ đề đang học. */
let MAP_TI=null,MAP_ID=null;
{const _go=go;go=function(s){try{if(s&&s.k==='island'&&s.id){const x=isl1(s.id);if(x){MAP_TI=x.ti;MAP_ID=s.id}}}catch(e){}return _go.apply(this,arguments)}}
{const _j=jumpT1;jumpT1=function(ti,smooth){MAP_TI=ti;return _j.apply(this,arguments)}}
{const _a=g1AfterRender;g1AfterRender=function(){const want=MAP_TI,onMap=role==='hs'&&scr.k==='home'&&(scr.tab||'map')==='map';
  if(onMap&&want!=null&&!scr.noJump){scr.noJump=1;const v=_a.apply(this,arguments);scr.noJump=0;setTimeout(()=>{jumpT1(want);const ch=document.querySelectorAll('.tchip')[want];if(ch&&ch.parentNode)ch.parentNode.scrollLeft=ch.offsetLeft-ch.parentNode.clientWidth/2+ch.offsetWidth/2;
    /* cuộn biển của chủ đề tới đúng đảo vừa vào */ if(MAP_ID){const n=document.querySelector(`#t1_${want} .node[onclick*="'${MAP_ID}'"]`);const sea=n&&n.closest('.sea');if(sea)sea.scrollLeft=n.offsetLeft-sea.clientWidth/2+55}},30);return v}
  return _a.apply(this,arguments)}}
