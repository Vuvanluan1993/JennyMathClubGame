/* ===================== Bố cục cân đối (thầy yêu cầu 23/10/2026) =====================
   Các dãy ô (số liệu, thẻ lớp) không để hàng cuối lẻ loi: số cột chọn theo số ô và độ rộng.
   6 ô → 3 cột (2 hàng) · 4 ô → 4 cột hoặc 2 cột · 3 ô → 3 cột · 5 ô → 3 + 2 · điện thoại: 2 cột (3 ô thì 1 cột nếu quá hẹp).
   Đánh dấu số ô vào data-n sau mỗi lần vẽ; CSS lo phần còn lại. */
import { hooks } from './00-hooks.js';
function bcBang(){try{if(role==='hs')return;document.querySelectorAll('#app table').forEach(t=>{const rows=[...t.rows];if(!rows.length)return;const h=rows.find(r=>r.querySelector('th'));if(!h)return;
  const L=[...h.cells].map(c=>c.textContent.trim());h.classList.add('mth');t.classList.add('mtable');
  rows.forEach(r=>{if(r===h)return;[...r.cells].forEach((c,i)=>{if(!c.dataset.l&&L[i])c.dataset.l=L[i];if(i>0&&c.childNodes.length&&!(c.children.length===1&&c.firstElementChild.classList.contains('mv')&&c.childNodes.length===1)){const d=document.createElement('div');d.className='mv';while(c.firstChild)d.appendChild(c.firstChild);c.appendChild(d)}})})})}catch(e){}}
function bcCanDoi(){bcBang();try{document.querySelectorAll('.kpis,.lopgrid').forEach(k=>{const n=k.children.length;if(k.dataset.n!=String(n))k.dataset.n=n})}catch(e){}}
{hooks.on('render',_r=>function(){const r=_r.apply(this,arguments);bcCanDoi();return r})}
document.head.insertAdjacentHTML('beforeend',`<style>
.kpis[data-n]{grid-template-columns:repeat(var(--bc,3),minmax(0,1fr))}
.kpis[data-n="1"]{--bc:1}.kpis[data-n="2"]{--bc:2}.kpis[data-n="3"]{--bc:3}.kpis[data-n="4"]{--bc:4}.kpis[data-n="5"],.kpis[data-n="6"],.kpis[data-n="9"]{--bc:3}.kpis[data-n="8"]{--bc:4}
@media (max-width:860px){.kpis[data-n="4"],.kpis[data-n="8"]{--bc:2}}
@media (max-width:640px){.kpis[data-n="5"],.kpis[data-n="6"],.kpis[data-n="9"]{--bc:2}}
@media (max-width:420px){.kpis[data-n="3"]{--bc:1}.kpis[data-n="3"] .kpi{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap}}
.kpis[data-n] .kpi{min-width:0}
.lopgrid[data-n]{grid-template-columns:repeat(var(--bc,3),minmax(0,1fr))}
.lopgrid[data-n="1"],.lopgrid[data-n="2"]{--bc:2}.lopgrid[data-n="3"],.lopgrid[data-n="5"],.lopgrid[data-n="6"]{--bc:3}.lopgrid[data-n="4"]{--bc:4}
@media (max-width:860px){.lopgrid[data-n="4"]{--bc:2}}
@media (max-width:560px){.lopgrid[data-n]{--bc:1}}
/* điện thoại: bảng thành thẻ, mỗi dòng một khối (ô đầu là tiêu đề, các ô sau "nhãn: giá trị") */
@media (max-width:640px){
 table.mtable{min-width:0!important;width:100%}
 table.mtable tr.mth{display:none}
 table.mtable tr{display:block;padding:10px 2px;border-bottom:1px solid var(--line)}
 table.mtable td{display:flex;gap:12px;justify-content:space-between;align-items:center;border:0;padding:4px 0;text-align:right;white-space:normal!important;min-width:0!important}
 table.mtable td::before{content:attr(data-l);color:var(--muted);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;text-align:left;flex:none;max-width:42%}
 table.mtable td:first-child{display:block;text-align:left;padding-bottom:6px}
 table.mtable td:first-child::before{display:none}
 table.mtable td:empty{display:none}
 table.mtable .mv{min-width:0;text-align:right;display:flex;flex-wrap:wrap;gap:4px;justify-content:flex-end;align-items:center}
 table.mtable .mv>div{width:100%}
 table.mtable td>.gbar,table.mtable td .gbar{max-width:140px}
 table.mtable td .row{justify-content:flex-end}
 .tablewrap{overflow-x:visible}
 .gtabs{display:grid!important;grid-template-columns:1fr 1fr;width:100%}
 .gtabs button{white-space:normal;line-height:1.25}
}
</style>`);
