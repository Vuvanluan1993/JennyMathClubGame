/* ===================== Tiện ích ===================== */
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[R(0,a.length-1)];
const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const sup=(b,e)=>`${b}<sup>${e}</sup>`;
const range=(a,b)=>{const r=[];for(let i=a;i<=b;i++)r.push(i);return r};
const roman=n=>{const m=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let s='';for(const[v,c]of m)while(n>=v){s+=c;n-=v}return s};
const starsHtml=(n,max)=>`<span class="stars" aria-label="${n} trên ${max} sao">${'★'.repeat(n)}<span class="off">${'★'.repeat(Math.max(0,max-n))}</span></span>`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SELF_CAP=150;

