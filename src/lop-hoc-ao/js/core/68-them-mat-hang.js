/* 68 — Thêm mặt hàng Cửa hàng (thầy yêu cầu 24/10/2026). Giá trong bảng đã duyệt:
   Áo 120–400 · Mũ kính 60–250 · Khung 60–300 · Đảo nhà 40–140. Đồ riêng bạn nữ/nam ghi ở GH_GEN. */
import { PXS } from './22-do-hoa-pixel-mau-logo-clb.js';
import { ofVariant, OUTFIT } from './33e-ho-chieu.js';
import { I18N } from './47-ngon-ngu-vi-en.js';
import { GH, GH_ACC } from './49-gian-hang.js';
import { ACC_SLOT } from './52-tu-do.js';
import { IS2_POS } from './56-dao-nha-bo-cuc.js';
import { GH_GEN } from './67-nhan-vat-nam.js';
Object.assign(OUTFIT,{
 s_mint:{n:'Áo Bạc hà',m:{g:'x',G:'b',y:'w'}},
 s_choco:{n:'Áo Sô-cô-la',m:{g:'n',G:'N',y:'t',o:'N'}},
 s_berry:{n:'Váy Dâu tây',m:{g:'r',G:'R',y:'g',o:'r'}},
 s_lav:{n:'Váy Oải hương',m:{g:'p',G:'P',y:'w',o:'p'}},
 s_pirate:{n:'Áo Cướp biển',m:{g:'w',G:'B',y:'r',o:'N'}},
 s_doctor:{n:'Áo Bác sĩ nhí',m:{g:'w',G:'e',y:'r',o:'b'}}});
Object.assign(PXS,{
 catearS:["e............e","ee..........ee","ece........ece","ecce......ecce","eeeeeeeeeeeeee"],
 pirS:["....kkkkkk....","..kkkkkkkkkk..",".kkkkkwwkkkkk.",".kkkkwkkwkkkk.","kkkkkkwwkkkkkk","yyyyyyyyyyyyyy"],
 chefS:["..wwwwwwww..",".wwwwwwwwww.","wwwwwwwwwwww",".wwwwwwwwww.","..eeeeeeee..","..eeeeeeee.."],
 rscarfS:["rrrrrrrrrr","RrrrrrrrrR","...rR.....","...rR.....","...R......"],
 maskS:["kkkkkkkkkkkkkk","kBBBBBBBBBBBBk","kBwwBBBBBBwwBk","kBBBBkkkkBBBBk",".kkkk....kkkk."],
 starclS:["..y..","yyyyy",".yay.","y...y"],
 sunfl:["..yyyy..",".yyaayy.","yyaNNayy","yyaNNayy",".yyaayy.","..yyyy..","...gg...",".g.gg.g.","..ggggg.","...gg...","...gg..."],
 chestD:PXS.climbChest,
 campf:["....r.....","...rr..r..","..rror.rr.","..royorrr.",".rroyyorr.",".royyyyor.","NnNnNNnNnN","nNnNnnNnNn"]});
Object.assign(GH_ACC,{catear:['catearS',1,-3],pirate:['pirS',1,-3],chef:['chefS',2,-4],rscarf:['rscarfS',3,11],mask:['maskS',1,5],starcl:['starclS',11,-1]});
Object.assign(ACC_SLOT,{catear:'head',pirate:'head',chef:'head',rscarf:'neck',mask:'face',starcl:'hair'});
['jenny','jennyBlink','jennyHappy','jennySad','jennyCheer','boy','boyBlink','boyHappy','boySad','boyCheer'].forEach(n=>['s_mint','s_choco','s_berry','s_lav','s_pirate','s_doctor'].forEach(o=>ofVariant(n,o)));
{const C=k=>GH.find(c=>c.k===k);
 C('of').it.push(['s_mint','Áo Bạc hà',130],['s_choco','Áo Sô-cô-la',160],['s_berry','Váy Dâu tây',180],['s_lav','Váy Oải hương',200],['s_pirate','Áo Cướp biển',220],['s_doctor','Áo Bác sĩ nhí',260]);
 C('acc').it.push(['starcl','Kẹp ngôi sao',60],['rscarf','Khăn quàng đỏ',70],['catear','Bờm tai mèo',90],['mask','Mặt nạ siêu nhân',120],['chef','Mũ đầu bếp',140],['pirate','Mũ cướp biển',160]);
 C('frame').it.push(['flower','Khung Hoa',150],['candy','Khung Kẹo ngọt',180],['night','Khung Đêm sao',250]);
 C('dec').it.push(['sunfl','Hoa hướng dương',40],['campf','Lửa trại',60],['chestD','Rương kho báu',100]);}
Object.assign(GH_GEN,{s_berry:'nu',s_lav:'nu',catear:'nu',starcl:'nu',s_pirate:'nam',pirate:'nam'});
Object.assign(IS2_POS,{sunfl:[100,232,44],campf:[128,350,40],chestD:[520,346,40]});
Object.assign(I18N,{'Áo Bạc hà':'Mint top','Áo Sô-cô-la':'Chocolate top','Váy Dâu tây':'Strawberry dress','Váy Oải hương':'Lavender dress','Áo Cướp biển':'Pirate shirt','Áo Bác sĩ nhí':'Little doctor coat',
 'Kẹp ngôi sao':'Star clip','Khăn quàng đỏ':'Red scarf','Bờm tai mèo':'Cat-ear headband','Mặt nạ siêu nhân':'Hero mask','Mũ đầu bếp':'Chef hat','Mũ cướp biển':'Pirate hat',
 'Khung Hoa':'Flower frame','Khung Kẹo ngọt':'Candy frame','Khung Đêm sao':'Starry-night frame','Hoa hướng dương':'Sunflower','Lửa trại':'Campfire','Rương kho báu':'Treasure chest'});
document.head.insertAdjacentHTML('beforeend',`<style>
.ghj.fr-flower,.ghfr.fr-flower,.tdstage.fr-flower{box-shadow:inset 0 0 0 3px #F26249,inset 0 0 0 6px #FCD655,inset 0 0 0 9px #2AB563!important}
.ghj.fr-candy,.ghfr.fr-candy,.tdstage.fr-candy{box-shadow:inset 0 0 0 3px #F04A1B,inset 0 0 0 6px #fff,inset 0 0 0 9px #F26249,inset 0 0 0 12px #fff!important}
.ghj.fr-night,.ghfr.fr-night,.tdstage.fr-night{box-shadow:inset 0 0 0 3px #FCD655,inset 0 0 0 9px #1F2A5A,inset 0 0 0 11px #8656A8!important}
.ghfr.fr-candy,.ghfr.fr-night{padding:13px!important}.tdstage.fr-candy,.tdstage.fr-night{padding:20px}
.herojav.fr-flower .jav.jav{box-shadow:0 0 0 3px #FCD655,0 0 0 6px #F26249!important}.herojav.fr-candy .jav.jav{box-shadow:0 0 0 2px #fff,0 0 0 4px #F04A1B,0 0 0 6px #fff,0 0 0 8px #F04A1B!important}.herojav.fr-night .jav.jav{box-shadow:0 0 0 3px #FCD655,0 0 0 7px #1F2A5A!important}
</style>`);
