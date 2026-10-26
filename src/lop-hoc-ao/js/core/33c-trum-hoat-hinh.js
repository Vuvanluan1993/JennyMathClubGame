/* ===================== TRÙM: hoạt hình và biểu cảm pixel ===================== */
/* Trạng thái: idle (thở, nhún), hit (bị đánh: loé trắng, bật lùi, sao nổ, -1), mad (học sinh trả lời sai: lao tới, đỏ mặt, gân giận),
   low (sắp thua: run rẩy, đổ mồ hôi), dead (bị hạ: xoay, bẹp, ngã, sao quay vòng), win (thắng: nhảy cười "HA HA"). */
import { PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { mHz, SFX, tone } from './33b-am-thanh.js';
Object.assign(PXS,{
 fxVein:["r..r.r","rr.r..","...rr.","r.r..r",".r..rr","r.r..r"].map(r=>r.replace(/r/g,'r')),
 fxSweat:["..b..",".bwb.","bwbbb","bbbbb",".bbb."],
 fxBang:["...y...","y..y..y",".yyyyy.","yyywyyy",".yyyyy.","y..y..y","...y..."],
 fxDizzy:["..y..",".yyy.","yyyyy",".yyy.","y...y"],
 fxSkull:[".kkkk.","kwwwwk","kwkkwk","kwwwwk",".kwwk.",".k..k."],
});
export function bossHTML(name,size,state='idle',ratio=1){const low=state!=='dead'&&state!=='win'&&ratio>0&&ratio<=.34;
  const fx={hit:`<span class="bfx bang">${spr('fxBang',Math.round(size*.42))}</span><span class="bdmg">-1</span>`,
    mad:`<span class="bfx vein">${spr('fxVein',Math.round(size*.3))}</span><span class="bbub">Hừm!</span>`,
    dead:`<span class="bfx dz d1">${spr('fxDizzy',18)}</span><span class="bfx dz d2">${spr('fxDizzy',14)}</span><span class="bfx dz d3">${spr('fxDizzy',16)}</span>`,
    win:`<span class="bbub laugh">HA HA!</span>`}[state]||'';
  return`<span class="bstage" style="--bs:${size}px"><span class="boss2 st-${state}${low?' low':''}">${spr(name,size,'bspr')}</span>${low&&state==='idle'?`<span class="bfx sweat">${spr('fxSweat',Math.round(size*.22))}</span>`:''}${fx}<span class="bshadow"></span></span>`}
SFX.bossmad=()=>{tone(mHz(40),0,.25,'sawtooth',.2,1.4);tone(mHz(43),.12,.25,'sawtooth',.16,.8)};
SFX.bosslaugh=()=>[0,.14,.28,.42].forEach((t,i)=>tone(mHz(i%2?55:58),t,.1,'square',.16,.85));
