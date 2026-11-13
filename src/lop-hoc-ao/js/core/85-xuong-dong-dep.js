/* 85 — Xuống dòng đẹp (thầy yêu cầu 13/11/2026): không để chữ xuống dòng "vô duyên" ở mọi khổ màn hình.
   Cách làm: sau mỗi lần vẽ (và khi có chữ mới chèn vào), thay dấu cách thường bằng dấu cách không ngắt (NBSP) ở các chỗ:
   1) số có dấu cách hàng nghìn: 10 000, 100 000;
   2) từ khoá + số: Lớp 1, Bài 2, Tiết 3, Chủ đề 4, Câu 5, Bước 6, Grade 1…;
   3) số + đơn vị: 150 xu, 8 câu, 45 giây, 3 tim, 12 cm…;
   4) không để "·", "–", "→", "▸", ":", "!", "?" đứng đầu dòng; không để "←", "(" đứng cuối dòng;
   5) không ngắt giữa từ có gạch nối (Xăng-ti-mét, 2-digit), khoảng số (6–10) và dấu "/" (13/11, +/−);
   6) chữ có "·": mỗi phần ngắn (≤ 20 kí tự, ≤ 4 từ) giữ trọn một khối, chỉ được xuống dòng sau dấu "·"
      (ví dụ "Vịnh Tí Hon · Lớp 1" → "Vịnh Tí Hon ·" / "Lớp 1");
   7) chữ cuối đoạn quá ngắn (≤ 3 chữ cái, hoặc là số) không đứng một mình: dính với chữ trước.
   Thêm CSS text-wrap: pretty (đoạn văn) và balance (tiêu đề, nút, nhãn) cho trình duyệt hỗ trợ.
   Không đụng ô nhập, script, style, svg, canvas. Chạy sau bản dịch EN (47). */
(function(){
const NB=' ',WJ='⁠';
const KW='Lớp|Bài|Tiết|Chủ đề|Buổi|Bước|Câu|Chặng|Đảo|Trang|Màn|Ngày|Tuần|Tháng|Khối|Phần|Lần|Số|Phiếu|Tập|lớp|bài|tiết|chủ đề|buổi|bước|câu|chặng|đảo|trang|màn|ngày|tuần|tháng|khối|phần|lần|số|phiếu|tập|Grade|Lesson|Topic|Step|Session|Level|Page|Day|Week|Part|Unit|Question|Sheet|Book|grade|lesson|topic|step|session|level|page|day|week|part|unit|question|sheet|book';
const UNIT='xu|câu|bài|phút|giây|giờ|ngày|tuần|tháng|năm|lượt|vé|sao|đảo|tim|bước|chặng|đòn|em|lớp|trang|tiết|buổi|tuổi|con|quả|cái|viên|bông|cây|hộp|cặp|ván|lần|cúp|món|trứng|đồng|nghìn|triệu|phần|lỗi|chữ|kí|cm|dm|mm|km|m|kg|g|l|ml|coins?|stars?|hearts?|questions?|lessons?|islands?|minutes?|mins?|seconds?|secs?|days?|weeks?|tickets?|plays?|turns?|steps?|times?|mistakes?|students?|classes?|pts';
const R=[];const add=(src,fl,to)=>{try{R.push([new RegExp(src,fl),to])}catch(e){}};
add('(\\d) (?=\\d{3}(?!\\d))','g','$1'+NB);                                   /* 1 */
add('(^|[\\s(·])(Chủ|chủ) (đề)','gu','$1$2'+NB+'$3');
add('(^|[^\\p{L}])('+KW+') (?=[\\d#])','gu','$1$2'+NB);                        /* 2 */
add('(\\d[\\d.,/]*\\+?) (?=(?:'+UNIT+')(?![\\p{L}\\d]))','gu','$1'+NB);          /* 3 */
add(' (?=[·–—→›▸»:!?%)])','g',NB);                                            /* 4 */
add('([←‹(«]) ','g','$1'+NB);
add('([\\p{L}\\d])-(?=[\\p{L}\\d])','gu','$1'+WJ+'-'+WJ);
add('([^\\s\\u2060])/(?=[^\\s\\u2060])','g','$1'+WJ+'/'+WJ);                               /* 5 */
add('(\\d)([–\\-])(?=\\d)','g','$1'+WJ+'$2'+WJ);
add('(\\p{Extended_Pictographic}\\uFE0F?) (?=\\S)','gu','$1'+NB);              /* biểu tượng dính chữ sau */
function fix(s,isLast){if(!/\S/.test(s))return s;let t=s;
  for(const [re,to] of R){re.lastIndex=0;t=t.replace(re,to)}
  /* 6 — phần ngắn giữa các dấu "·" giữ trọn */
  if(t.indexOf('·')>=0){t=t.split('·').map((p,i,a)=>{const lead=p.match(/^\s*/)[0],trail=p.match(/\s*$/)[0],core=p.trim();
      const plain=core.replace(/[^\p{L}\d ,.\/+–-]/gu,'');if(core&&plain.length<=20&&core.split(' ').length<=4)return lead+core.replace(/ /g,NB)+trail;return p}).join('·')}
  /* 7 — chữ cuối quá ngắn */
  if(isLast){const m=t.match(/^([\s\S]*\S) ([^\s ]+)(\s*)$/);if(m){const w=m[2],letters=w.replace(/[^\p{L}\d]/gu,'');
      if(m[1].split(/[\s ]+/).length>=2&&(letters.length&&letters.length<=3||/^\d/.test(letters)))t=m[1]+NB+w+m[3]}}
  return t}
const SKIP='script,style,textarea,input,select,option,svg,canvas,code,pre,td,th,[contenteditable],.noxd';
const blockOf=n=>{let e=n.parentElement;while(e&&getComputedStyle(e).display==='inline')e=e.parentElement;return e};
function lastInBlock(n){const b=blockOf(n);if(!b)return false;const w=document.createTreeWalker(b,NodeFilter.SHOW_TEXT);w.currentNode=n;let x;while(x=w.nextNode()){if(/\S/.test(x.nodeValue))return false}return true}
function run(root){if(!root)return;if(root.nodeType===3){one(root);return}if(root.nodeType!==1||root.closest&&root.closest(SKIP))return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const L=[];let n;while(n=w.nextNode())L.push(n);L.forEach(one)}
function one(n){const p=n.parentElement;if(!p||!n.nodeValue||!/\S/.test(n.nodeValue)||p.closest(SKIP))return;const v=n.nodeValue;
  let last=false;if(/ [^\s ]{1,4}\s*$/.test(v)||/ \d[^\s]*\s*$/.test(v)){try{last=lastInBlock(n)}catch(e){}}
  const t=fix(v,last);if(t!==v)n.nodeValue=t}
/* lưới an toàn: chỗ đã dính chữ mà bị tràn khung → thu chữ nhỏ dần (tối đa còn 80%), vẫn tràn thì bỏ dính để chữ xuống dòng như cũ */
function fitAll(){const seen=new Set(),w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){if(n.nodeValue.indexOf(NB)<0&&n.nodeValue.indexOf(WJ)<0)continue;const b=blockOf(n);if(b&&!seen.has(b))seen.add(b)}
  seen.forEach(b=>{if(!b.isConnected||b.closest(SKIP))return;const ox=getComputedStyle(b).overflowX;if(ox==='auto'||ox==='scroll')return;
    if(b.scrollWidth<=b.clientWidth+1||!b.clientWidth)return;const f0=parseFloat(getComputedStyle(b).fontSize)||16;let f=f0,k=0;
    while(b.scrollWidth>b.clientWidth+1&&f>f0*0.8&&k++<8){f-=0.5;b.style.fontSize=f+'px'}
    if(b.scrollWidth>b.clientWidth+1){b.style.fontSize='';b.classList.add('noxd');const t=document.createTreeWalker(b,NodeFilter.SHOW_TEXT);let x;while(x=t.nextNode()){const v=x.nodeValue.split(NB).join(' ').split(WJ).join('');if(v!==x.nodeValue)x.nodeValue=v}}})}
let FT=0;const fitSoon=()=>{clearTimeout(FT);FT=setTimeout(()=>{try{fitAll()}catch(e){}},60)};
addEventListener('resize',fitSoon);try{document.fonts&&document.fonts.ready.then(fitSoon)}catch(e){}
/* bản dịch EN (47) so khớp chữ gốc: bỏ dấu cách không ngắt trước khi tra, dịch xong thì dính lại */
if(typeof i18nText==='function'){const _t=i18nText;i18nText=function(t){const r=_t.apply(this,arguments);if(r!=null||typeof t!=='string'||!/[\u00A0\u2060]/.test(t))return r;
  const plain=t.split(NB).join(' ').split(WJ).join(''),r2=_t.call(this,plain);return r2==null?null:fix(r2,false)}}
window.xdFix=fix;window.xdRun=run;window.xdFit=fitAll;
/* sau mỗi lần vẽ */
{const _r=render;render=function(){const a=_r.apply(this,arguments);try{run(document.body);fitSoon()}catch(e){}return a}}
/* chữ chèn sau (hộp thoại, trò chơi cập nhật từng phần) */
let Q=new Set(),T=0;const flush=()=>{T=0;const s=Q;Q=new Set();s.forEach(x=>{if(x.isConnected)try{run(x)}catch(e){}});fitSoon()};
const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')Q.add(m.target);else m.addedNodes.forEach(x=>Q.add(x))}if(!T)T=requestAnimationFrame(flush)});
const go=()=>{try{mo.observe(document.body,{childList:true,subtree:true,characterData:true});run(document.body)}catch(e){}};if(document.body)go();else addEventListener('DOMContentLoaded',go);
})();
document.head.insertAdjacentHTML('beforeend',`<style>
body{text-wrap:pretty}
.t1sec .secthead,.t1sec .secthead h2{text-wrap:wrap}
h1,h2,h3,h4,button,.btn,.chip,.tag,.pill,label,small,.muted,figcaption,th{text-wrap:balance}
/* thẻ chào: "Chào …!" luôn một dòng; nhãn vùng biển xuống dòng ở dấu "·" */
.hero h1{white-space:nowrap}
.hero .ocname{flex:0 0 auto;max-width:100%}
@media (max-width:430px){.hero:has(.herochips) h1{font-size:clamp(26px,8.2vw,36px)}}
</style>`);
