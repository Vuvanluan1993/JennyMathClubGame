/* 40b — Dòng số bản nhỏ ở góc thẻ chào (bản đồ), để biết đang mở bản mới hay cũ. Thời điểm dựng do tools/build.py điền. */
import { hooks } from './00-hooks.js';
const APP_VER='__APP_VER__';
{hooks.on('g1AfterRender',_a=>function(){const r=_a.apply(this,arguments);try{const h=document.querySelector('.hero');if(h&&!h.querySelector('.appver'))h.insertAdjacentHTML('beforeend',`<span class="appver" title="Thời điểm cập nhật bản này">Bản ${APP_VER}</span>`)}catch(e){}return r})}
document.head.insertAdjacentHTML('beforeend','<style>.hero{position:relative}.appver{position:absolute;right:6px;bottom:3px;font-family:var(--f-body);font-size:10px;line-height:1;color:rgba(255,255,255,.75);pointer-events:none;z-index:2}</style>');
