/* 80 — Phong cách kiểu Google Classroom cho trang Quản lý, Giáo viên, Phụ huynh (thầy chọn phương án 1, 24/10/2026).
   Giữ nguyên bố cục, khung, nút, vị trí; chỉ đổi chữ (Lexend), màu, cỡ chữ, bo góc, đường viền. Trang học sinh giữ phong cách pixel.
   Màu từ logo Clb: xanh đậm #1F2A5A, xanh biển #0079C1, xanh lá #1E9A52, cam #E0441A, xanh trời #12B5E8, vàng #FCB40C. */
import { hooks } from './00-hooks.js';
import { render, setRole } from './13-giao-dien-chung.js';
(function(){
const lms=()=>typeof role!=='undefined'&&role!=='hs';
const dat=()=>{try{document.body.classList.toggle('lms',lms())}catch(e){}};
if(typeof render==='function'){hooks.on('render',_r=>function(){dat();const r=_r.apply(this,arguments);dat();return r})}
if(typeof setRole==='function'){hooks.on('setRole',_s=>function(){const r=_s.apply(this,arguments);dat();return r});window.setRole=setRole}
document.addEventListener('DOMContentLoaded',dat);
/* Lexend nằm trong assets/fonts/fonts.css (chữ tự host, P-08) — không chèn Google Fonts nữa. */
const L='body.px.lms',FF='"Lexend","Be Vietnam Pro",system-ui,sans-serif';
const C=['#0079C1','#1E9A52','#E0441A','#1F2A5A','#0E8FB8','#B07800'];
const band=(sel,h)=>C.map((c,i)=>`${L} ${sel}:nth-child(6n+${i+1}){--band:${c}}`).join('');
document.head.insertAdjacentHTML('beforeend',`<style id="lmsCss">
${L}{--lm-line:#DADCE0;--lm-line2:#E8EAED;--lm-ink:#1F2A5A;--lm-mute:#5F6B85;--lm-pri:#0079C1;--lm-pri-h:#00649F;--lm-pri-soft:#E8F2FB;--lm-ok:#137333;--lm-ok-soft:#E6F4EA;--lm-warn:#B06000;--lm-warn-soft:#FEF7E0;--lm-bad:#C5221F;--lm-bad-soft:#FCE8E6;
 --f-display:${FF};--f-body:${FF};--pxk:var(--lm-line);--bg:#fff;--surface:#fff;--ink:var(--lm-ink);--muted:var(--lm-mute);--line:var(--lm-line);--coral:var(--lm-bad);
 background:#fff!important;color:var(--lm-ink);font-family:${FF}!important;font-size:15px;font-weight:400}
${L} :is(button,input,select,textarea){font-family:${FF}}
${L} :is(h1,h2,h3){font-family:${FF}!important;font-weight:500!important;letter-spacing:0!important;line-height:1.25!important;color:var(--lm-ink)}
${L} #app h1{font-size:28px!important}${L} #app h2{font-size:18px!important;font-weight:500!important}${L} #app h3{font-size:16px!important}
${L} .muted{color:var(--lm-mute)}${L} b,${L} strong{font-weight:600}
/* thanh trên: trắng, tab gạch chân */
${L} .appbar{background:#fff!important;border-bottom:1px solid var(--lm-line)!important;box-shadow:none!important}
${L} .appbar .brand b{font-family:${FF}!important;font-weight:500!important;font-size:19px;color:var(--lm-ink)}${L} .appbar .brand small{color:var(--lm-mute)}
${L} .appbar .jav{border:0!important;box-shadow:none!important;background:#FFF4D6!important;border-radius:8px!important}
${L} .seg{box-shadow:none!important;border:0!important;border-bottom:1px solid var(--lm-line)!important;border-radius:0!important;background:transparent!important;padding:0!important;gap:0!important}
${L} .seg button{border:0!important;border-radius:0!important;box-shadow:none!important;background:transparent!important;color:var(--lm-mute)!important;font-weight:500!important;padding:10px 16px!important;border-bottom:3px solid transparent!important;margin-bottom:-1px}
${L} .seg button.on{color:var(--lm-pri)!important;border-bottom-color:var(--lm-pri)!important;background:transparent!important}
${L} .seg button:hover:not(.on){background:#F1F3F4!important}
${L} #tabs{border-bottom:0!important;align-self:stretch}${L} #tabs button{padding:16px 14px 13px!important}
${L} .nb-lang{border:1px solid var(--lm-line)!important;border-radius:18px!important;box-shadow:none!important;overflow:hidden;background:#fff!important;padding:2px!important;gap:0!important}
${L} .nb-lang button{border:0!important;box-shadow:none!important;border-radius:16px!important;background:transparent!important;color:var(--lm-mute)!important;font-family:${FF}!important;font-size:13px!important;font-weight:500!important;padding:4px 10px!important;min-height:0!important}
${L} .nb-lang button.on,${L} .nb-lang button[aria-pressed=true]{background:var(--lm-pri-soft)!important;color:var(--lm-pri)!important}
${L} .who{box-shadow:none!important;border:0!important}
${L} .appbar button:not(#tabs button):not(.nb-lang button){border:1px solid var(--lm-line)!important;border-radius:4px!important;box-shadow:none!important;background:#fff!important;color:var(--lm-pri)!important;font-family:${FF}!important;font-weight:500!important;transform:none!important}
${L} .appbar :is(.pill,.chip,.who b,.cloudme){border-radius:16px!important}
${L} :is(.tag,.pill){text-transform:none!important;letter-spacing:0!important}

/* khung, thẻ: viền xám mảnh, bo 8px, không bóng */
${L} :is(.card,.kpi,.task,.log,.msg,.paidbox,.alertbar,.stat div,.qlnote){border:1px solid var(--lm-line)!important;border-radius:8px!important;box-shadow:none!important;background:#fff}
${L} .card:hover{box-shadow:none}
${L} .qlnote{background:var(--lm-warn-soft)!important;border-color:#F6DCA6!important;color:#7A4300}
${L} .kpi .big{font-family:${FF}!important;font-weight:600;font-size:28px;color:var(--lm-ink)}
${L} .kpi.alert{border-color:#F4C7C3!important;background:#FFFAF9}
/* 4 ô Quản lý: dải màu đầu thẻ + biểu tượng tròn */
${L} .qltile{position:relative;padding:0!important;gap:0!important;min-height:0!important;border:1px solid var(--lm-line)!important;border-radius:8px!important;box-shadow:none!important;overflow:hidden;background:linear-gradient(var(--band) 0 76px,#fff 76px)!important;transform:none!important}
${L} .qltile:hover{box-shadow:0 1px 3px rgba(60,64,67,.3),0 4px 8px 3px rgba(60,64,67,.15)!important}
${band('.qltile')}
${L} .qltile b{order:-1;height:76px;padding:14px 16px 0;color:#fff!important;font-family:${FF}!important;font-weight:500!important;font-size:22px!important}
${L} .qltile .qlic{position:absolute;right:16px;top:48px;width:56px;height:56px;border-radius:50%!important;background:#fff!important;display:grid!important;place-items:center;box-shadow:0 1px 3px rgba(60,64,67,.3)!important;border:0!important;font-size:26px!important;overflow:hidden}
${L} .qltile .qln{padding:20px 16px 0;font-size:28px!important;font-weight:600!important;color:var(--lm-ink)}
${L} .qltile :is(.qlw,.qlok){padding:4px 16px 0;font-size:13.5px!important}
${L} .qltile .qlgo{margin-top:12px!important;align-self:stretch!important;text-align:right;border-top:1px solid var(--lm-line2);padding:8px 16px;font-family:${FF}!important;font-size:14px!important;font-weight:500;color:var(--lm-pri)}
${L} .qlw{color:var(--lm-warn)!important}${L} .qlok{color:var(--lm-ok)!important}
/* thẻ lớp của giáo viên: dải màu đầu thẻ như Google Classroom */
${L} .lopthe{padding:0!important;border:1px solid var(--lm-line)!important;border-radius:8px!important;box-shadow:none!important;overflow:hidden;background:linear-gradient(var(--band) 0 92px,#fff 92px)!important;text-align:left;align-items:stretch!important;transform:none!important}
${L} .lopthe:hover{box-shadow:0 1px 3px rgba(60,64,67,.3),0 4px 8px 3px rgba(60,64,67,.15)!important}
${band('.lopthe')}
${L} .lopthe .lt-ten{color:#fff!important;padding:16px 16px 0;font-family:${FF}!important;font-weight:500!important;font-size:24px!important}
${L} .lopthe .lt-ten::before{content:"Lớp "}
${L} .lopthe>.muted{color:rgba(255,255,255,.9)!important;padding:0 16px;height:34px}
${L} .lopthe .lt-so{padding:14px 16px 4px;color:var(--lm-ink)}${L} .lopthe .tag{margin:6px 16px 14px;align-self:flex-start}
${L} .lopthe .bad,${L} .bad{color:var(--lm-warn)!important}
/* nút */
${L} :is(.btn:not(.ghost),.gobtn,.gx){border:1px solid var(--lm-line)!important;border-radius:4px!important;box-shadow:none!important;background:#fff;color:var(--lm-pri);font-family:${FF}!important;font-weight:500!important;text-transform:none!important;letter-spacing:.01em!important;transform:none!important;min-height:36px}
${L} .btn.sm:not(.ghost){min-height:32px;padding:5px 12px;font-size:13.5px}
${L} :is(.btn,.gobtn):hover:not(:disabled){background:#F4F8FC}
${L} :is(.btn.pri,.gobtn:not(.ghost)){background:var(--lm-pri)!important;border-color:var(--lm-pri)!important;color:#fff!important;box-shadow:0 1px 2px rgba(60,64,67,.3)!important}
${L} :is(.btn.pri,.gobtn:not(.ghost)):hover:not(:disabled){background:var(--lm-pri-h)!important}
${L} :is(.btn,.gobtn):active:not(:disabled){transform:none!important}
${L} .btn.ghost{border:0!important;box-shadow:none!important;color:var(--lm-pri)!important;font-weight:500;border-radius:4px!important}
${L} .btn:disabled{opacity:.45}
${L} .btn.qlxbtn{color:var(--lm-bad)!important;border-color:#F4C7C3!important}
${L} .lnk{color:var(--lm-pri)!important;text-decoration:none!important;font-weight:500}
${L} :focus-visible{outline:2px solid var(--lm-pri)!important;outline-offset:2px}
/* ô nhập */
${L} :is(select,input:not([type=checkbox]):not([type=radio]):not([type=range]),textarea){border:1px solid var(--lm-line)!important;border-radius:4px!important;box-shadow:none!important;background:#fff!important;color:var(--lm-ink)}
${L} :is(select,input,textarea):focus{border-color:var(--lm-pri)!important;box-shadow:0 0 0 1px var(--lm-pri)!important;outline:0!important}
${L} input[type=checkbox]{accent-color:var(--lm-pri)}
/* nhãn */
${L} :is(.pill,.tag,.chip,.chip2,.badge){border-radius:16px!important;box-shadow:none!important;border:0!important;background:#F1F3F4;color:#3C4043;font-weight:500;font-size:13px;padding:3px 12px}
${L} :is(.pill.ok,.tag.paid){background:var(--lm-ok-soft)!important;color:var(--lm-ok)!important}
${L} :is(.pill.warn,.pill.qlwarn){background:var(--lm-warn-soft)!important;color:var(--lm-warn)!important}
${L} .pill.bad{background:var(--lm-bad-soft)!important;color:var(--lm-bad)!important}
/* ảnh đại diện tròn */
${L} .av{border-radius:50%!important;border:0!important;box-shadow:none!important;background:var(--lm-pri)!important;color:#fff!important;font-family:${FF}!important;font-weight:500}
${L} .appbar .av{background:#E8F2FB!important;color:var(--lm-pri)!important}
/* danh sách cảnh báo, bảng */
${L} .al{border:0!important;border-bottom:1px solid var(--lm-line2)!important;border-radius:0!important;box-shadow:none!important;background:#fff!important;border-left:3px solid var(--lm-warn)!important;padding-left:10px}
${L} .al.bad{border-left-color:var(--lm-bad)!important}
${L} th{color:var(--lm-mute)!important;font-size:12.5px!important;font-weight:500!important;text-transform:none!important;letter-spacing:0!important;background:#fff!important;border-bottom:1px solid var(--lm-line)!important}
${L} td{border-bottom:1px solid var(--lm-line2)!important}
${L} tr:hover td{background:#F8F9FA}
${L} .qlr{border-bottom:1px solid var(--lm-line2)!important}${L} .qlr:not(.qlrh):hover{background:#F8F9FA}
${L} .qlrh{color:var(--lm-mute)!important;font-weight:500!important;text-transform:none!important;font-size:12.5px!important}
${L} .qlbar{background:var(--lm-pri-soft)!important;border-radius:4px}
${L} :is(.bar,.prog){border-radius:99px!important;box-shadow:none!important;background:#E8EAED!important;overflow:hidden}
/* thanh demo, hộp thoại, thông báo */
${L} .demobar,${L} [class*=demob]{background:#FEF7E0!important;border-bottom:1px solid #F6DCA6!important}
${L} .gdbox{border:0!important;border-radius:8px!important;box-shadow:0 24px 38px 3px rgba(60,64,67,.14),0 9px 46px 8px rgba(60,64,67,.12)!important;overflow:hidden;background:#fff!important}
${L} .gdhd{background:#fff!important;color:var(--lm-ink)!important;border-bottom:1px solid var(--lm-line);font-family:${FF}!important;font-size:18px!important;font-weight:500;padding:14px 16px!important}
${L} .gdx{background:transparent!important;color:var(--lm-mute)!important;border:0!important;box-shadow:none!important;font-size:14px!important;border-radius:4px!important;padding:4px 8px!important}
${L} .gdx:hover{background:#F1F3F4!important}
${L} .llstep span{border-radius:16px;box-shadow:none!important;background:#F1F3F4;opacity:1;color:var(--lm-mute)}${L} .llstep span.on{background:var(--lm-pri)!important;color:#fff!important}
${L} .toast{border-radius:4px!important;box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px rgba(0,0,0,.14)!important;background:#323232!important;color:#fff!important;font-family:${FF}!important}
${L} .ghead .gav{width:64px!important;height:64px!important;font-size:22px!important}
@media(max-width:560px){${L} .seg{overflow-x:auto;flex-wrap:nowrap!important;scrollbar-width:none}${L} .seg button{white-space:nowrap;flex:0 0 auto}${L} #tabs{overflow-x:auto;scrollbar-width:none;flex-wrap:nowrap!important}${L} #tabs button{padding:12px 9px 9px!important;font-size:14px;white-space:nowrap}
 ${L} .qltile{background:linear-gradient(var(--band) 0 60px,#fff 60px)!important}${L} .qltile b{height:60px;font-size:17px!important;padding:12px 12px 0}
 ${L} .qltile .qlic{width:44px;height:44px;top:38px;right:10px;font-size:20px!important}${L} .qltile .qln{font-size:21px!important;padding:14px 12px 0}${L} .qltile :is(.qlw,.qlok){padding:4px 12px 0;font-size:12.5px!important}${L} .qltile .qlgo{padding:6px 12px}
 ${L} #app h1{font-size:24px!important}}
</style>`);
})();
