/* ===================== Phân số và kiểm tra đáp án ===================== */
const gcdI=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a||1};
const rat=(n,d)=>{if(d<0){n=-n;d=-d}const g=gcdI(n,d);return[n/g,d/g]};
const rawfr=(n,d)=>`${n<0?'−':''}<span class="frac"><span>${Math.abs(n)}</span><span>${d}</span></span>`;
const fr=(n,d)=>{[n,d]=rat(n,d);if(d===1)return n<0?`−${-n}`:`${n}`;return`${n<0?'−':''}<span class="frac"><span>${Math.abs(n)}</span><span>${d}</span></span>`};
const frP=(n,d)=>{[n,d]=rat(n,d);return n<0?`(${fr(n,d)})`:fr(n,d)}; // có ngoặc khi âm
const rtxt=(n,d)=>{[n,d]=rat(n,d);return d===1?`${n}`:`${n}/${d}`};
function parseRat(s){s=String(s).replace(/[−–]/g,'-').replace(/\s/g,'').replace(',','.');let m=s.match(/^(-?\d+)\/(-?\d+)$/);if(m){const d=+m[2];if(!d)return null;return rat(+m[1],d)}m=s.match(/^-?\d+(\.\d+)?$/);if(m){const k=(s.split('.')[1]||'').length,p=10**k;return rat(Math.round(+s*p),p)}return null}
function isCorrect(v,q){
  if(q.pair){const m=String(v).replace(/[−–]/g,'-').match(/-?\d+(?:[.,]\d+)?/g);return!!m&&m.length===2&&+m[0].replace(',','.')===q.pair[0]&&+m[1].replace(',','.')===q.pair[1]}
  if(q.frac){const r=parseRat(v);return!!r&&r[0]===rat(...q.frac)[0]&&r[1]===rat(...q.frac)[1]}
  return num(String(v).replace(/[−–]/g,'-'))===q.a;
}
const ansText=q=>q.pair?`(${q.pair[0]}; ${q.pair[1]})`:q.frac?fr(...q.frac):fmt(q.a);
const ansHint=q=>q.pair?'Nhập x; y (ví dụ: 2; -3)':q.frac?'Nhập phân số tối giản, ví dụ -3/4':'Nhập đáp số';
const nz=()=>{let x;do{x=R(-9,9)}while(!x);return x};
/* đa thức: terms = [[hệ số, 'x', bậc x, 'y', bậc y], ...] hiển thị */
function mono(c,vars,first){const sgn=c<0?(first?'−':' − '):(first?'':' + ');const a=Math.abs(c);const v=vars.map(([s,e])=>e===0?'':e===1?s:`${s}<sup>${e}</sup>`).join('');return sgn+(a===1&&v?'':a)+v}
const poly=ts=>ts.filter(t=>t[0]).map((t,i)=>mono(t[0],t[1],i===0)).join('')||'0';

