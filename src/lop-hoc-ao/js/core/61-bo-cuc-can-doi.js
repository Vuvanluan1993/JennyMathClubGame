/* ===================== Bố cục cân đối (thầy yêu cầu 23/10/2026) =====================
   Các dãy ô (số liệu, thẻ lớp) không để hàng cuối lẻ loi: số cột chọn theo số ô và độ rộng.
   6 ô → 3 cột (2 hàng) · 4 ô → 4 cột hoặc 2 cột · 3 ô → 3 cột · 5 ô → 3 + 2 · điện thoại: 2 cột (3 ô thì 1 cột nếu quá hẹp).
   Đánh dấu số ô vào data-n sau mỗi lần vẽ; CSS lo phần còn lại. */
function bcCanDoi(){try{document.querySelectorAll('.kpis,.lopgrid').forEach(k=>{const n=k.children.length;if(k.dataset.n!=String(n))k.dataset.n=n})}catch(e){}}
{const _r=render;render=function(){const r=_r.apply(this,arguments);bcCanDoi();return r}}
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
</style>`);
