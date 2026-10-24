/* 74 — (24/10/2026 thầy chốt: app luôn nền sáng — data-theme=light ở app.template.html, nên phần tối dưới đây không còn dùng; giữ để sau này nếu bật lại.) Chế độ tối: tăng độ tương phản cho nút, ô nhập, ô chọn, ô tích và nút bị khoá (24/10/2026).
   Chỉ tác động khi máy để chế độ tối (hoặc data-theme="dark"); chế độ sáng giữ nguyên. */
(function(){
const R=`
body.px{--pxk:#7183D0}
body.px .btn:not(.pri):not(.ghost):not(.on){background:#1B2F46;color:#F1F6FB}
body.px .btn:not(.ghost):disabled,body.px .btn:not(.ghost)[disabled]{opacity:1;background:#2A394E!important;color:#93A5BA!important}
body.px .btn.ghost{color:#DCE6F2}
body.px input:not([type=checkbox]):not([type=radio]):not([type=range]),body.px select,body.px textarea{background:#091320;color:#EEF4FA}
body.px input::placeholder,body.px textarea::placeholder{color:#8496AC}
body.px input[type=checkbox]{appearance:none;-webkit-appearance:none;width:20px;height:20px;min-width:20px;margin:0;padding:0!important;box-shadow:inset 0 0 0 2px #AEBBF0!important;border:0!important;background:#091320!important;display:inline-grid;place-content:center;cursor:pointer;vertical-align:middle}
body.px input[type=checkbox]:checked{background:#4FC3F7!important;box-shadow:inset 0 0 0 2px #4FC3F7!important}
body.px input[type=checkbox]:checked::before{content:"";width:9px;height:5px;border:solid #08131F;border-width:0 0 3px 3px;transform:translateY(-1px) rotate(-45deg)}
body.px input[type=checkbox]:focus-visible{outline:2px solid #FFBD47;outline-offset:2px}
body.px .muted{color:#A7B6C8}
body.px .pgtag{background:#3B4A8C}
body.px .gdbox input:not([type=checkbox]):not([type=radio]):not([type=range]),body.px .gdbox select,body.px .gdbox textarea{background:#fff;color:#13263a}
body.px .gdbox .btn:not(.pri):not(.ghost):not(.on){background:#fff;color:#13263a}
body.px .gdbox input[type=checkbox]{background:#fff!important;box-shadow:inset 0 0 0 2px #1F2A5A!important}
body.px .gdbox input[type=checkbox]:checked{background:#0079C1!important;box-shadow:inset 0 0 0 2px #0079C1!important}
body.px .gdbox input[type=checkbox]:checked::before{border-color:#fff}
body.px .gdbox .muted{color:#566779}
body.px .gdbox input::placeholder{color:#7A8799}
body.px .qlok{color:#6EDC9A}body.px .qlw{color:#FFB070}`;
const sc=pre=>R.replace(/(^|\})\s*([^{}]+)\{/g,(m,a,sel)=>a+'\n'+sel.split(',').map(x=>pre+x.trim()).join(',')+'{');
document.head.insertAdjacentHTML('beforeend',`<style>@media (prefers-color-scheme: dark){${sc(':root:not([data-theme="light"]) ')}}${sc(':root[data-theme="dark"] ')}</style>`);
document.head.insertAdjacentHTML('beforeend','<style>.hs-lb.dim,.hs-lb.dim b{color:#666F8E}.pgtag.new{background:#0B76A8}.pgtag.no{background:#C9380F}.pill.ok{color:#15703A}</style>');
})();
