/* ===================== CÂN LẠI TRÒ CHƠI THÊM LỚP 4–5 ===================== */
/* Lớp 4–5 nhiều đảo luyện tập nên vài trò bị lặp quá nhiều (Đập chuột lớp 5, Hứng sao lớp 4), Ghép hình lớp 4 quá ít.
   Cách chia: mỗi đảo giữ trò bắt buộc theo nội dung (Đồng hồ, Ghép hình, Cửa hàng, Cân), rồi lấp cho đủ 3 trò bằng trò
   PHÙ HỢP với đảo mà đang được dùng ÍT NHẤT trong lớp. Thứ tự duyệt đảo cố định (theo mã đảo) nên kết quả luôn như nhau. */
import { hooks } from './00-hooks.js';
import { PRIM } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { _islOptsOld, xgHash, xgRule, xgTime } from './37-tro-choi-dot-1.js';
import { xgCalc, xgDec, xgMass, xgMeasTopic, xgMoney, xgNum, xgTopic, xgTxt2, xgWord } from './38-tro-choi-dot-2.js';
import { xgGeo, xgGr } from './39-tro-choi-dot-3.js';
export const XG_ALL=['fish','balloon','race','star','pair','tug','clock','scale','shop','train','mole','frog','shape'];
export function xgElig(...a){return hooks.goi('xgElig',this,a)}
hooks.ham('xgElig',function(x){const t=xgTxt2(x),tp=xgTopic(x),prac=/Luyện tập|Ôn tập/i.test(t),G=xgGr(x),old=_islOptsOld(x),E=new Set(old);
  const geoTopic=/hình|góc|Hình học/i.test(tp);
  if(xgRule(x)){E.add('star');E.add('mole')}
  if(xgCalc(x)||xgNum(x)){E.add('pair');E.add('frog')}
  if(xgWord(x))E.add('frog');
  if(x.tiet>1||prac){E.add('tug');E.add('race')}
  if(xgNum(x)||xgDec(x))E.add('train');
  if(xgCalc(x)||xgMass(x))E.add('scale');
  if(xgMoney(x)||(xgMeasTopic(x)&&prac)||(xgWord(x)&&prac))E.add('shop');
  if(xgGeo(x)||(geoTopic&&(prac||x.tiet>1)))E.add('shape');
  if(xgTime(x))E.add('clock');
  const must=[];if(xgTime(x))must.push('clock');if(xgGeo(x)||(geoTopic&&prac))must.push('shape');if(xgMoney(x))must.push('shop');if(xgMass(x))must.push('scale');
  return{E:[...E].filter(o=>XG_ALL.includes(o)),must}});
const XG_BAL={};
function xgBalance(G){if(XG_BAL[G])return XG_BAL[G];const I=(PRIM[G]&&PRIM[G].isl)||[],cnt={},out={};XG_ALL.forEach(o=>cnt[o]=0);
  const order=[...I].sort((a,b)=>xgHash(a.id+'bal')-xgHash(b.id+'bal'));
  order.forEach(x=>{const {E,must}=xgElig(x),pick=[];must.slice(0,2).forEach(o=>{if(!pick.includes(o))pick.push(o)});
    const h=xgHash(x.id+'b2');
    while(pick.length<3){const c=E.filter(o=>!pick.includes(o));if(!c.length)break;c.sort((a,b)=>cnt[a]-cnt[b]||((xgHash(a+x.id)-xgHash(b+x.id))));pick.push(c[0])}
    if(pick.length<2)_islOpts2v3(x).forEach(o=>{if(pick.length<3&&!pick.includes(o))pick.push(o)});
    pick.forEach(o=>cnt[o]++);out[x.id]=pick});
  return XG_BAL[G]=out}
const _islOpts2v3=hooks.cu('islOpts2');
hooks.de('islOpts2',function(x){const G=xgGr(x);if(G>=4&&G<=5){const m=xgBalance(G);if(m[x.id])return m[x.id]}return _islOpts2v3(x)});
