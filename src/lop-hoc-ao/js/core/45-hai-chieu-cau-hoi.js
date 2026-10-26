/* 45 — Cân bằng hai chiều cho câu hỏi (thầy góp ý 20/10):
   - "Sắp xếp … từ bé đến lớn" → một nửa số câu hỏi "từ lớn đến bé".
   - "… nào lớn nhất?" ↔ "… nào bé nhất?" (chọn một): một nửa số câu hỏi đổi chiều, khi tính được giá trị từng phương án.
   Bọc mọi bộ sinh câu của lớp 1–5 nên áp dụng cho màn học, trò chơi và Luyện lỗi. */
import { hooks } from './00-hooks.js';
import { PRIM } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { GD_NUM, gdN, gdTxt } from './40-huong-dan-khi-sai.js';
function gdVal(t){t=gdTxt(t).replace(/\s+/g,' ').trim();let m=t.match(/^(\d+)\s*⁄\s*(\d+)$/);if(m)return +m[1]/+m[2];m=t.match(new RegExp(`^${GD_NUM}$`));if(m)return gdN(t);return NaN}
function gdFlip(q){if(!q||Math.random()<.5)return q;
 if(q.type==='order'&&/từ bé đến lớn/.test(q.q||'')&&Array.isArray(q.a)&&Array.isArray(q.opts)){const a=[...q.a].reverse(),ops=a.map(i=>gdTxt(q.opts[i]));const sep=ops.some(x=>/,/.test(x))?'; ':', ';
  return{...q,q:q.q.replace('từ bé đến lớn','từ lớn đến bé'),say:String(q.say||'').replace(/từ bé đến lớn/g,'từ lớn đến bé'),a,sol:`Từ lớn đến bé: ${ops.join(sep)}.`}}
 const isMax=/lớn nhất/.test(gdTxt(q.q)),isMin=/bé nhất/.test(gdTxt(q.q));
 if(q.type==='opt'&&(isMax!==isMin)&&Array.isArray(q.opts)&&q.opts.length>=3){const s=gdTxt(q.sol),FROM=isMax?'lớn nhất':'bé nhất',TO=isMax?'bé nhất':'lớn nhất';
  const val=o=>{const t=gdTxt(o.h??o);let v=gdVal(t);if(isNaN(v)){const m=s.match(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*=\\s*('+GD_NUM+')'));if(m)v=gdN(m[1])}return v};
  const vs=q.opts.map(val);if(vs.some(isNaN))return q;const mx=Math.max(...vs),mn=Math.min(...vs),cur=isMax?mx:mn,tgt=isMax?mn:mx;if(vs.filter(v=>v===tgt).length!==1||vs.indexOf(cur)!==q.a)return q;const a=vs.indexOf(tgt),at=gdTxt(q.opts[a].h??q.opts[a]);
  return{...q,q:q.q.replace(FROM,TO),say:String(q.say||'').split(FROM).join(TO),a,sol:new RegExp(FROM).test(s)&&!/=/.test(s)?String(q.sol).replace(new RegExp('[^:.]*'+FROM),` ${at} ${TO}`):`${q.sol} ${TO==='bé nhất'?'Bé nhất':'Lớn nhất'} là ${at}.`}}
 return q}
/* P-15b: chạy cho khối có lúc nạp và mỗi khối tải sau (hooks 'khoi:sau') */
function bocHaiChieu(k){for(const G in PRIM){if(+G>5||!PRIM[G].isl)continue;for(const x of PRIM[G].isl)(x.lv||[]).forEach(gs=>gs.forEach((gn,i)=>{if(typeof gn==='function'&&!gn.gdFlip){const w=function(){return gdFlip(gn.apply(this,arguments))};w.gdFlip=1;gs[i]=w}}))}}
bocHaiChieu();hooks.khi('khoi:sau',bocHaiChieu);
