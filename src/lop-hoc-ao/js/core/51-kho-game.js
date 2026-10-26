/* 51 — Kho trò chơi (thầy chốt 23/10/2026)
   - Ở Cửa hàng, mục "Trò chơi": 3 trò Bowling, Đẩy thùng, Khủng long chạy. Không cần gắn với Toán.
   - Mua một trò: 150 xu, được thêm 10 lượt. Vé 10 lượt: 60 xu. Lượt dùng chung cho cả 3 trò.
   - Mỗi lần vào chơi một trò = 1 lượt; kết thúc ván là hết lượt. Tối đa 10 lượt/ngày (thầy đổi 23/10) (lượt chưa dùng để dành).
   - Thắng: cúp Đồng/Bạc/Vàng theo điểm; 3 cúp Vàng ở một trò → đồ hiếm (mũ cho Jenny hoặc khăn cho thú cưng).
   Lưu: st.arc = {own:{bowl,box,dino}, plays, day, used, best:{}, cups:{g:{b,s,g}}, gold:{}, lv (màn đẩy thùng), rare:[]} */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { go, render, toast } from './13-giao-dien-chung.js';
import { shuf } from './21-lop-6-che-do-tro-choi.js';
import { PXS, pxURI, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { sfx } from './33b-am-thanh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { ofVariant } from './33e-ho-chieu.js';
import { GH, GH_ACC, ghSt } from './49-gian-hang.js';
import { CARE, careOf, P_WEAR } from './49b-dao-nha-thu-cung.js';
import { xuMua } from './64-xu.js';
const BOX_LV=[[["#######","#     #","# @$ .#","#     #","#######"],2],[["######","#  . #","#   ##","#@$  #","#    #","######"],5],[["######","#    #","#@$  #","#   .#","##   #","######"],5],[["######","#   @#","#  $ #","#.  ##","#    #","######"],6],[["#######","#   .##","##    #","#@$   #","# #   #","#######"],6],[["######","#   @#","# $ ##","#   ##","#.   #","######"],7],[["######","#   .#","# $ @#","#    #","# #  #","######"],8],[["######","#   @#","#.   #","## $ #","#    #","######"],9],[["#######","###   #","#  $  #","#     #","#  #@.#","#######"],10],[["#######","# . # #","#     #","##    #","#@$## #","# $  .#","#######"],9],[["########","#  @#. #","#  $#  #","# # $  #","# .    #","# # ## #","########"],9],[["########","#     .#","#### .$#","#@  #  #","# $   ##","###    #","########"],10],[["#######","# # @ #","#   $##","## .  #","#  $  #","#.    #","#######"],10],[["########","#      #","# $##$ #","# .@ . #","#      #","########"],11],[["#######","#   #@#","#   #$#","#.  $.#","#     #","# #   #","#######"],11],[["########","###   ##","#    .##","#  $ # #","#  .$  #","#  # @ #","########"],12],[["########","# $   .#","# #  $ #","#@#    #","#  .   #","## ### #","########"],12],[["########","#   #  #","# $  $ #","# .##. #","#  @   #","########"],13],[["#######","### #@#","# .  $#","#   $.#","#     #","###   #","#######"],13],[["########","# .    #","###  ###","# #$ . #","#  $   #","# @  # #","########"],13],[["########","#   # ##","# .    #","#@ $   #","# $#  ##","# .##  #","########"],13],[["#######","#  .  #","#     #","# $@$ #","#  .  #","#######"],14],[["########","# #    #","# .    #","#     .#","### #$$#","#   # @#","########"],14],[["########","####  ##","#  #  .#","#  $   #","#  . $ #","# @  # #","########"],16],[["#######","#   . #","#  $  #","#   $ #","# @## #","#.   ##","#######"],17],[["#######","#   # #","#    .#","###   #","#@# $ #","#.$   #","#######"],19],[["########","# @    #","# $#   #","##  $ .#","#   $  #","#   .. #","###  ###","########"],14],[["########","#@$. . #","#$#$ # #","#    ###","#     ##","#     ##","#.     #","########"],15],[["#######","#.  # #","# $   #","# #$# #","#. @  #","#######"],29],[["########","#  .   #","# $$$  #","#. @ # #","#  . # #","########"],17],[["########","#   ## #","#  # # #","#   .  #","# $#####","#   .$@#","#  . $ #","########"],17],[["#########","#  .    #","#   $   #","#    # ##","# .$+#$ #","### #   #","###   ###","#########"],17],[["########","# #   ##","#    #@#","#    $$#","#    $ #","#.##  .#","# ##.  #","########"],17],[["########","#..    #","#  ##$ #","# $  @ #","#  $ . #","########"],18],[["########","#    .##","#  ##  #","#  # $##","#    $ #","#. # $ #","#  @ . #","########"],18],[["#########","#  .  $ #","# #   # #","#    .  #","#    #  #","## #$ ###","# . $@###","#########"],18],[["########","##@   .#","#  $$ $#","#   .  #","#   #  #","# #  ###","#.   ###","########"],19],[["########","#  #@  #","#  # $ #","# ###  #","#  #   #","# ## $ #","#  ..$.#","########"],20],[["########","#  ##  #","#. .$  #","#  #   #","# ##  ##","#  #$$ #","#  # .@#","########"],22],[["#########","##   # ##","# # . $@#","#  .# ###","#     $ #","#   # $.#","#  #    #","#########"],24],[["#########","#. ### ##","#    $  #","#   @$ ##","# ##.#  #","# $    .#","#  ## # #","#########"],24],[["#########","# .  ## #","#@#$ #  #","# # $ .##","# #  $.##","# #     #","#  .$ # #","#########"],21],[["#########","#       #","#$$  $ .#","# #.# @ #","# $.#####","#. #    #","#     ###","#########"],21],[["#########","#   #   #","# $ . $ #","##$# #.##","#. @    #","#########"],34],[["#########","# $   . #","# ##   ##","# $  .  #","# ###. ##","#    $ ##","#  .  $@#","#########"],23],[["#########","###    ##","# $   $##","#@$#.# ##","## #.  ##","##.  $  #","#  .    #","#########"],25],[["#########","#   .   #","# . $$@ #","#   # #$#","##$#   .#","## #  .##","#       #","#########"],30],[["#########","# .#    #","# $##$$ #","##.@    #","# # $   #","#  #.#  #","#   .   #","#########"],31]];
export const ARC_PRICE=150,ARC_TK=60,ARC_PER=10,ARC_DAY=10;
export const ARC={bowl:{n:'Bowling',en:'Bowling',ic:'bowlI',d:'Vuốt lên để lăn bóng, vuốt cong để bóng xoáy. 5 lượt, tính điểm như bowling thật.',de:'Swipe up to roll; curve your swipe to add spin. 5 frames, real bowling scoring.',cup:[60,90,120],unit:'điểm',rare:['bcap','Mũ vô địch Bowling','acc']},
 box:{n:'Đẩy thùng',en:'Box Push',ic:'crateS',d:'Đẩy hết thùng gỗ vào ô đánh dấu. Mỗi lượt chơi 3 màn; có 48 màn từ dễ đến khó.',de:'Push every crate onto a marked spot. 3 levels per play, 48 levels in all.',cup:null,unit:'bước',rare:['mhat','Mũ thợ mỏ','acc']},
 dino:{n:'Khủng long chạy',en:'Dino Run',ic:'dinoA',d:'Chạm để khủng long nhảy qua xương rồng và chim.',de:'Tap to jump over cacti and birds.',cup:[150,400,800],unit:'điểm',rare:['dscarf','Khăn khủng long (thú cưng)','pet']}};
export const arcEN=()=>typeof LANG!=='undefined'&&LANG==='en';
export const arcT=(vi,en)=>arcEN()?en:vi;
export function arcSt(...a){return hooks.goi('arcSt',this,a)}
hooks.ham('arcSt',function(st){st.arc=st.arc||{own:{},plays:0,day:'',used:0,best:{},cups:{},gold:{},lv:0,rare:[]};const a=st.arc;const d=new Date().toISOString().slice(0,10);if(a.day!==d){a.day=d;a.used=0}return a});
const arcLeftToday=a=>Math.max(0,ARC_DAY-a.used);
Object.assign(PXS,{
 bowlI:["...kkkkk...","..kpppppk..",".kppPpPppk.","kpppppPpppk","kpppppppppk","kpppppppppk","kpppppppppk",".kpppppppk.","..kpppppk..","...kkkkk..."],
 pinS:["..kkk..",".kwwwk.",".kwwwk.","..krk..","..krk..",".kwwwk.","kwwwwwk","kwwwwwk","kwwwwwk","kwwwwwk",".kwwwk.","..kkk.."],
 crateS:["kkkkkkkkkkkk","knnnnnnnnnnk","knNnnnnnnNnk","knnNnnnnNnnk","knnnNnnNnnnk","knnnnNNnnnnk","knnnnNNnnnnk","knnnNnnNnnnk","knnNnnnnNnnk","knNnnnnnnNnk","knnnnnnnnnnk","kkkkkkkkkkkk"],
 crateOkS:["kkkkkkkkkkkk","kaaaaaaaaaak","kaOaaaaaaOak","kaaOaaaaOaak","kaaaOaaOaaak","kaaaaOOaaaak","kaaaaOOaaaak","kaaaOaaOaaak","kaaOaaaaOaak","kaOaaaaaaOak","kaaaaaaaaaak","kkkkkkkkkkkk"],
 brickS:["EEEEEmEEEEEm","EEEEEmEEEEEm","mmmmmmmmmmmm","EEmEEEEEmEEE","EEmEEEEEmEEE","mmmmmmmmmmmm","EEEEEmEEEEEm","EEEEEmEEEEEm","mmmmmmmmmmmm","EEmEEEEEmEEE","EEmEEEEEmEEE","mmmmmmmmmmmm"],
 goalS:["............","....rrrr....","...r....r...","..r..rr..r..",".r..r..r..r.",".r.r....r.r.",".r.r....r.r.",".r..r..r..r.","..r..rr..r..","...r....r...","....rrrr....","............"],
 dinoA:["......ggggggg.",".....ggwkggggg",".....gggggggg.",".....gggggrr..","g....gggggggg.","gg..ggggg.....","ggggggggggl...",".gggggggggl...","..ggggggggl...","...gggggg.....","....gg..gg....","....gg...g....","....ll...ll..."],
 dinoB:["......ggggggg.",".....ggwkggggg",".....gggggggg.",".....gggggrr..","g....gggggggg.","gg..ggggg.....","ggggggggggl...",".gggggggggl...","..ggggggggl...","...gggggg.....","....gg..gg....","....g...gg....","....ll...ll..."],
 cactS:["...GG...","..GggG..","..GggG.G","G.GggGGg","gGGggGgG","gggggggG",".GGggGG.","..GggG..","..GggG..","..GggG..","..GggG..","..GGGG.."],
 birdA:["....kk......","...kppk.....","kkkpppppkk..",".kppppppppkk","..kkppppk...","....kpk.....","....kk......"],
 birdB:["............","............","kkkpppppkk..",".kppppppppkk","..kppppppk..","..kpk..kk...","..kk........"],
 cupG:["kkkkkkkkk","kaaaaaaak","kaywaaaak","kaywaaaak",".kaaaaak.","..kaaak..","...kak...","...kak...","..kkkkk..",".kaaaaak."],
 cupS:["kkkkkkkkk","keeeeeeek","kewweeeek","kewweeeek",".keeeeek.","..keeek..","...kek...","...kek...","..kkkkk..",".keeeeek."],
 cupB:["kkkkkkkkk","koooooook","koyoooook","koyoooook",".kooooOk.","..koook..","...kok...","...kok...","..kkkkk..",".kooooOk."],
 bcapS:["...rrrrrr.....","..rrwrrrrr....",".rrrrrrrrrr...",".RRRRRRRRRRRRR"],
 mhatS:["....yyyy......","...yyaayy.....","..aaaaaaaa....",".aaaaaaaaaa...","nnnnnnnnnnnn.."],
 dscarfS:["gggggggg","glglglgg","....gg..","....gl.."],
 joyS:["..kkkkkkkk..",".kbbbbbbbbk.","kbbkbbbbrbbk","kbkkkbbrbrbk","kbbkbbbbrbbk","kbbbbbbbbbbk",".kkkkkkkkkk."]});
/* đồ hiếm: mũ Jenny vào Mũ kính; khăn thú cưng vào đồ mặc */
Object.assign(GH_ACC,{bcap:['bcapS',1,-1],mhat:['mhatS',1,-3]});
{const C=GH.find(c=>c.k==='acc');if(C)C.it.push(['bcap','Mũ vô địch Bowling',0,'rare'],['mhat','Mũ thợ mỏ',0,'rare'])}
CARE.push(['dscarf','Khăn khủng long',0,'wear',{},'dscarfS',0,'rare']);P_WEAR.dscarf=['dscarfS',.25,.52,.5];
{hooks.on('careGrid',_c=>function(st){const sv=CARE.splice(CARE.findIndex(c=>c[7]==='rare'),1);const r=_c.apply(this,arguments);CARE.push(...sv);return r})}
{hooks.on('petSim',_p=>function(st){const r=_p.apply(this,arguments);try{ghSt(st).gear.forEach(g=>{const c=careOf(g.id);if(c&&c[7]==='rare')g.dur=100})}catch(e){}return r})}
{hooks.on('ghCard',_g=>function(c,x,st){if(x[3]==='rare'&&!ghSt(st).own.includes(x[0])){const g=Object.keys(ARC).find(k=>ARC[k].rare[0]===x[0]);return`<button type="button" class="ghit rare" onclick="toast('${arcT(`Thắng 3 cúp Vàng ở trò ${ARC[g].n} để nhận`,`Win 3 gold cups in ${ARC[g].en} to unlock`)}')"><span class="ghpic">${spr(GH_ACC[x[0]][0],30)}</span><b>${esc(x[1])}</b><i class="ghtag rare">${arcT('Đồ hiếm','Rare')}</i></button>`}return _g.apply(this,arguments)})}
/* ---- Cửa hàng: mục Trò chơi ---- */
{const T=GH.find(c=>c.k==='tk');if(T){T.n='Trò chơi';T.ic='joyS'}}
function arcShop(...a){return hooks.goi('arcShop',this,a)}
hooks.ham('arcShop',function(st){const a=arcSt(st),en=arcEN();
 const games=Object.entries(ARC).map(([k,g])=>{const own=a.own[k],cups=a.cups[k]||{},best=a.best[k],can=own&&a.plays>0&&arcLeftToday(a)>0,gold=a.gold[k]||0,got=a.rare.includes(g.rare[0]);
  return`<div class="arcg px2"><span class="arcic">${spr(g.ic,40)}</span><div class="grow"><b>${en?g.en:g.n}</b><small>${en?g.de:g.d}</small>
   <span class="arccups">${spr('cupG',16)}${cups.g||0} ${spr('cupS',16)}${cups.s||0} ${spr('cupB',16)}${cups.b||0}</span>${best!=null?`<small class="arcbest">${en?'Best':'Kỷ lục'}: ${best}${k==='box'?(en?' levels':' màn'):''}</small>`:''}
   <span class="arcrare">${got?`✓ ${en?'Unlocked':'Đã nhận'}: ${esc(g.rare[1])}`:`${en?'Gold':'Vàng'} ${Math.min(gold,3)}/3 → ${esc(g.rare[1])}`}</span></div>
   ${own?`<button type="button" class="gobtn ${can?'':'off'}" onclick="arcPlay('${k}')">${en?'Play':'Chơi'} ▶</button>`:`<button type="button" class="gobtn sun" onclick="arcBuy('${k}')">${spr('coin',16)} ${ARC_PRICE}</button>`}</div>`}).join('');
 return`<div class="arcbox"><div class="arctop"><div><b>${spr('tkS',20)} ${en?'Plays left':'Lượt chơi'}: <em>${a.plays}</em></b><small>${en?`Today ${a.used}/${ARC_DAY}`:`Hôm nay đã chơi ${a.used}/${ARC_DAY} lượt`}</small></div><button type="button" class="gobtn" onclick="arcTicket()">${en?'Buy 10 plays':'Mua 10 lượt'} · ${spr('coin',16)} ${ARC_TK}</button></div>
  <p class="arcnote">${en?`Buy a game: ${ARC_PRICE} coins, includes ${ARC_PER} plays. Each game you start uses 1 play. Up to ${ARC_DAY} plays a day.`:`Mua trò: ${ARC_PRICE} xu, kèm ${ARC_PER} lượt. Mỗi lần vào chơi một trò dùng 1 lượt. Tối đa ${ARC_DAY} lượt mỗi ngày.`}</p>${games}</div>`});
{hooks.on('viewShop',_v=>function(st){const r=_v.apply(this,arguments);if((scr.ghCat||'of')!=='tk')return r;return r.replace(/<div class="ghtk">[\s\S]*?<\/span><\/div><\/div>/,arcShop(st))})}
function arcBuy(k){const st=S.st[sid],a=arcSt(st);if(a.own[k])return;if(st.coins<ARC_PRICE){toast(arcT(`Em cần thêm ${ARC_PRICE-st.coins} xu nhé!`,`You need ${ARC_PRICE-st.coins} more coins.`));return}if(!xuMua('items','game:'+k)){toast(arcT('Chưa mua được. Em thử lại sau nhé!','Could not buy. Try again later.'));return}a.own[k]=1;a.plays+=ARC_PER;save();try{sfx('win')}catch(e){}toast(arcT(`Đã mua ${ARC[k].n}! +${ARC_PER} lượt chơi`,`Bought ${ARC[k].en}! +${ARC_PER} plays`));render()}
function arcTicket(){const st=S.st[sid],a=arcSt(st);if(st.coins<ARC_TK){toast(arcT(`Em cần thêm ${ARC_TK-st.coins} xu nhé!`,`You need ${ARC_TK-st.coins} more coins.`));return}if(!xuMua('items','ve')){toast(arcT('Chưa mua được. Em thử lại sau nhé!','Could not buy. Try again later.'));return}a.plays+=ARC_PER;save();try{sfx('coin')}catch(e){}toast(arcT(`+${ARC_PER} lượt chơi`,`+${ARC_PER} plays`));render()}
function arcPlay(...a){return hooks.goi('arcPlay',this,a)}
hooks.ham('arcPlay',function(k,again){const st=S.st[sid],a=arcSt(st);if(!a.own[k])return;if(a.plays<=0){toast(arcT('Em hết lượt rồi. Mua thêm vé 10 lượt nhé!','No plays left. Buy 10 more plays!'));if(again)go({k:'home',tab:'shop'});return}if(arcLeftToday(a)<=0){toast(arcT(`Hôm nay em đã chơi đủ ${ARC_DAY} lượt. Mai chơi tiếp nhé!`,`You've used today's ${ARC_DAY} plays. Come back tomorrow!`));return}
 a.plays--;a.used++;save();try{speechSynthesis.cancel()}catch(e){}const g={k:'arc',g:k,score:0,end:false,t0:Date.now()};
 if(k==='box'){const n=BOX_LV.length,start=a.lv||0;g.set=start+3<=n?[start,start+1,start+2]:shuf([...Array(n).keys()]).slice(0,3).sort((x,y)=>x-y);g.si=0;g.lv=g.set[0];g.solved=0;g.tot=0;g.par=0}go(g)});
/* ---- màn chơi chung ---- */
function viewArc(){const g=scr,a=arcSt(S.st[sid]),G=ARC[g.g],en=arcEN();
 if(g.end){const cup=g.cup,ci=cup==='g'?'cupG':cup==='s'?'cupS':cup==='b'?'cupB':'';const cn={g:arcT('Cúp Vàng','Gold cup'),s:arcT('Cúp Bạc','Silver cup'),b:arcT('Cúp Đồng','Bronze cup')}[cup];
  return`<div class="game g1"><div class="gend"><div class="bigicon bossend">${jenny(70,cup?'cheer':'sad')}${ci?spr(ci,72):spr(G.ic,56)}</div><h1>${cup?cn+'!':arcT('Hết lượt rồi!','Game over!')}</h1>
   <p class="muted">${g.g==='box'?arcT(`Xong ${g.solved}/3 màn${g.solved?` · ${g.tot} bước (ít nhất ${g.par})`:''} · đã qua ${a.lv||0}/${BOX_LV.length} màn`,`${g.solved}/3 levels${g.solved?` · ${g.tot} moves (best ${g.par})`:''} · ${a.lv||0}/${BOX_LV.length} cleared`):`${en?'Score':'Điểm'}: <b>${g.score}</b>${g.prev!=null?` · ${en?'best':'kỷ lục'} ${Math.max(g.prev,g.score)}`:''}`}</p>
   ${g.rareNew?`<p class="earn">${spr(GH_ACC[g.rareNew]?GH_ACC[g.rareNew][0]:'dscarfS',28)} ${arcT('Em nhận được đồ hiếm','You unlocked a rare item')}: <b>${esc(ARC[g.g].rare[1])}</b></p>`:''}
   ${!cup&&g.g!=='box'?`<p class="muted">${arcT(`Cần ${G.cup[0]} điểm để có cúp Đồng.`,`Score ${G.cup[0]} for a bronze cup.`)}</p>`:''}
   <p class="muted">${arcT(`Còn ${a.plays} lượt · hôm nay ${a.used}/${ARC_DAY}`,`${a.plays} plays left · today ${a.used}/${ARC_DAY}`)}</p>
   <div class="gendbtn"><button class="gobtn" type="button" onclick="arcPlay('${g.g}',1)">${arcT('Chơi lượt nữa','Play again')}</button><button class="gobtn ghost" type="button" onclick="scr.ghCat='tk';go({k:'home',tab:'shop'})">${arcT('Về kho trò chơi','Back to games')}</button></div></div></div>`}
 const hud=g.g==='bowl'?`<div class="bwsb" id="bwSB">${bowlBoard(g)}</div>`
  :g.g==='box'?`<span class="mgsc">${arcT('Màn','Level')} <b>${g.lv+1}</b> <small>(${g.si+1}/3)</small></span><span class="grow"></span><span class="mgsc">${arcT('Bước','Moves')} <b id="arcS">${g.moves||0}</b></span>`
  :`<span class="grow"></span><span class="mgsc">${spr('star',20)} <b id="arcS">${g.score}</b></span>`;
 const ctl=g.g==='box'?`<div class="arcpad"><button type="button" onclick="boxUndo()">↶ ${arcT('Lùi','Undo')}</button><button type="button" class="u" onclick="boxMove(0,-1)" aria-label="Lên">↑</button><button type="button" onclick="boxReset()">⟲ ${arcT('Làm lại','Restart')}</button><button type="button" onclick="boxMove(-1,0)" aria-label="Trái">←</button><button type="button" onclick="boxMove(0,1)" aria-label="Xuống">↓</button><button type="button" onclick="boxMove(1,0)" aria-label="Phải">→</button></div>`
  :`<p class="arctip" id="arcTip">${g.g==='bowl'?arcT('Kéo bóng sang trái/phải để đứng, rồi vuốt lên để lăn','Drag the ball left/right, then swipe up to roll'):arcT('Chạm màn hình để nhảy','Tap to jump')}</p>`;
 return`<div class="game g1 arcgame"><div class="gtop"><button class="gx" onclick="arcQuit()" aria-label="${arcT('Thoát','Exit')}">✕</button>${hud}</div><div class="gmid">${g.banner?`<div class="arcban">${esc(g.banner)}</div>`:''}<div class="arcwrap" id="arcWrap"><canvas id="arcCv"></canvas></div></div><div class="gbot">${ctl}</div></div>`}
function arcQuit(){const g=scr;if(g.k!=='arc')return;if(!g.end){arcEnd()}else{scr.ghCat='tk';go({k:'home',tab:'shop'})}}
let ARCI={};function arcImg(n){if(ARCI[n])return ARCI[n];const im=new Image();im.src=pxURI(n).u;return ARCI[n]=im}
let ARCL=null;function arcStop(){if(ARCL){cancelAnimationFrame(ARCL);ARCL=null}}
function arcCanvas(ratio){const w=document.getElementById('arcWrap'),cv=document.getElementById('arcCv');if(!w||!cv)return null;const W=Math.min(w.clientWidth,480),H=Math.round(W*ratio),dpr=window.devicePixelRatio||1;cv.style.width=W+'px';cv.style.height=H+'px';cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.imageSmoothingEnabled=false;return{cv,c,W,H}}
function arcEnd(){const g=scr,st=S.st[sid],a=arcSt(st);if(g.end)return;arcStop();g.end=true;const G=ARC[g.g];let cup=null;
 if(g.g==='box'){g.prev=a.best.box||0;a.best.box=Math.max(a.best.box||0,a.lv||0);cup=g.solved>=3?(g.tot<=Math.ceil(g.par*1.25)+2?'g':'s'):g.solved>=1?'b':null}
 else{g.prev=a.best[g.g];a.best[g.g]=Math.max(a.best[g.g]||0,g.score);cup=g.score>=G.cup[2]?'g':g.score>=G.cup[1]?'s':g.score>=G.cup[0]?'b':null}
 g.cup=cup;if(cup){const C=a.cups[g.g]=a.cups[g.g]||{};C[cup]=(C[cup]||0)+1;if(cup==='g'){a.gold[g.g]=(a.gold[g.g]||0)+1;const [rid,,kind]=G.rare;if(a.gold[g.g]>=3&&!a.rare.includes(rid)){a.rare.push(rid);const s=ghSt(st);if(kind==='acc'){if(!s.own.includes(rid))s.own.push(rid)}else s.gear.push({u:Math.random().toString(36).slice(2,9),id:rid,dur:100,t:Date.now()});g.rareNew=rid}}
  try{log(sid,'passed',`Trò chơi · ${G.n}`,0,{success:true,score:{raw:g.score||g.moves||0}})}catch(e){}try{sfx('win')}catch(e){}}else{try{sfx('lose')}catch(e){}}
 save();render()}
/* ================= BOWLING ================= */
/* Góc nhìn từ sau người ném (phối cảnh). Kéo bóng trái/phải để chọn chỗ đứng; vuốt lên để lăn (hướng và lực theo cú vuốt, vuốt cong = bóng xoáy).
   5 lượt, tính điểm như bowling thật: strike = 10 + 2 lần lăn sau, spare = 10 + 1 lần lăn sau; lượt 5 được lăn thêm khi strike/spare. */
const BW={zc:9,zp:11,rp:.11,rb:.19,end:13.4};
function bowlRack(){const P=[];[[0],[-.5,.5],[-1,0,1],[-1.5,-.5,.5,1.5]].forEach((r,i)=>r.forEach(c=>P.push({x:c*.58,z:BW.zp+i*.5,vx:0,vz:0,a:0,ad:0,hit:false,gone:false})));return P}
function bwProj(R,x,z){const k=BW.zc/(Math.max(-1,z)+BW.zc),yb=R.H*.93,yh=R.H*.1,hw=R.W*.4*k;return{x:R.W/2+x*hw,y:yh+(yb-yh)*k,k,hw}}
function bowlInit(g){if(!g.st){g.st={rolls:[],fr:0,th:0,pins:bowlRack(),phase:'aim',bx:0,t:0,ball:null,fx:[],fl:null,hint:true};g.score=0}const R=arcCanvas(1.4);if(!R)return;g.R=R;
 let tr=null;const cv=R.cv,pt=e=>{const b=cv.getBoundingClientRect();return[e.clientX-b.left,e.clientY-b.top,performance.now()]};
 cv.onpointerdown=e=>{if(g.st.phase!=='aim')return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}tr=[pt(e)];g.st.trail=tr;g.st.hint=false};
 cv.onpointermove=e=>{if(!tr)return;const p=pt(e);tr.push(p);if(tr[0][1]-p[1]<30)g.st.bx=bwXat(g,p[0])};
 cv.onpointerup=cv.onpointercancel=e=>{if(!tr)return;const t=tr;tr=null;g.st.trail=null;bowlRelease(g,t)};
 arcLoop(g,bowlStep,bowlDraw)}
function bwXat(g,sx){const P=bwProj(g.R,0,0);return Math.max(-(1-BW.rb),Math.min(1-BW.rb,(sx-g.R.W/2)/P.hw))}
function bowlRelease(g,t){const S0=g.st;if(S0.phase!=='aim'||t.length<3)return;const a=t[0],b=t[t.length-1];const up=a[1]-b[1];if(up<40){return}
 const tEnd=b[2];let i=t.length-1;while(i>0&&tEnd-t[i][2]<160)i--;const s=t[i],dt=Math.max(.03,(tEnd-s[2])/1000),spd=Math.hypot(b[0]-s[0],b[1]-s[1])/dt;
 const vz=Math.max(8,Math.min(19,8+spd/180));let slope=((b[0]-a[0])/Math.max(40,up))*.22;slope=Math.max(-.16,Math.min(.16,slope));
 /* độ cong của cú vuốt → xoáy */let dev=0;const L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;for(const p of t){const d=((b[0]-a[0])*(a[1]-p[1])-(a[0]-p[0])*(b[1]-a[1]))/L;if(Math.abs(d)>Math.abs(dev))dev=d}
 const spin=Math.max(-1,Math.min(1,dev/L*3));
 S0.ball={x:S0.bx,z:0,vx:slope*vz,vz,ax:spin*1.1,rot:0,gutter:false};S0.phase='roll';S0.t=0;bowlTip('');try{sfx('whoosh')}catch(e){try{sfx('tap')}catch(_){}}}
function bowlTip(t){const e=document.getElementById('arcTip');if(e)e.textContent=t}
function bowlStep(g,dt){const S0=g.st;S0.t+=dt;S0.fx=S0.fx.filter(f=>(f.t-=dt)>0);S0.fx.forEach(f=>{f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=600*dt});if(S0.fl)S0.fl.t-=dt;
 if(S0.phase!=='roll'&&S0.phase!=='settle')return;const b=S0.ball;
 if(b){b.z+=b.vz*dt;if(b.z>4&&!b.gutter)b.vx+=b.ax*dt;b.x+=b.vx*dt;b.rot+=b.vz*dt*3;
  if(!b.gutter&&Math.abs(b.x)>1-BW.rb*.4){b.gutter=true;b.vx=0;b.x=Math.sign(b.x)*1.12;try{sfx('bad')}catch(e){}}
  if(!b.gutter)for(const p of S0.pins){if(p.gone||p.hit)continue;const d=Math.hypot(p.x-b.x,p.z-b.z);if(d<BW.rb+BW.rp){p.hit=true;const sp=Math.hypot(b.vx,b.vz),nx=(p.x-b.x)/d,nz=(p.z-b.z)/d+1.1,nl=Math.hypot(nx,nz);p.vx=nx/nl*sp*.75+b.vx*.2;p.vz=nz/nl*sp*.75;p.ad=(Math.random()<.5?-1:1)*(6+Math.random()*6);b.vx+=(b.x-p.x)/d*sp*.12;b.vz*=.93;S0.crash=(S0.crash||0)+1;if(S0.crash<4)try{sfx('hit')}catch(e){}}}
  if(b.z>BW.end){S0.ball=null}}
 for(const p of S0.pins){if(!p.hit||p.gone)continue;p.x+=p.vx*dt;p.z+=p.vz*dt;const f=Math.pow(.2,dt);p.vx*=f;p.vz*=f;p.a+=p.ad*dt;p.ad*=f;
  for(const q of S0.pins){if(q===p||q.hit||q.gone)continue;const d=Math.hypot(q.x-p.x,q.z-p.z),sp=Math.hypot(p.vx,p.vz);if(d<BW.rp*2.6&&sp>1){q.hit=true;const nx=(q.x-p.x)/d,nz=(q.z-p.z)/d+.6,nl=Math.hypot(nx,nz);q.vx=nx/nl*sp*.85;q.vz=nz/nl*sp*.85;q.ad=(Math.random()<.5?-1:1)*8}}}
 if(S0.phase==='roll'&&!S0.ball){S0.phase='settle';S0.t=0}
 if(S0.phase==='settle'&&S0.t>1.2)bowlCount(g)}
/* điểm theo luật bowling (5 lượt) */
function bowlFrames(rolls){const F=[];let i=0,tot=0;for(let f=0;f<5;f++){if(i>=rolls.length)break;if(f<4){if(rolls[i]===10){const b1=rolls[i+1],b2=rolls[i+2];F.push({r:['X'],s:b1!=null&&b2!=null?(tot+=10+b1+b2):null});i++}else{const a=rolls[i],b=rolls[i+1];if(b==null){F.push({r:[a||'-'],s:null});i++;break}if(a+b===10){const c=rolls[i+2];F.push({r:[a||'-','/'],s:c!=null?(tot+=10+c):null})}else F.push({r:[a||'-',b||'-'],s:(tot+=a+b)});i+=2}}
  else{const r=rolls.slice(i,i+3),m=[];let done=false;if(r.length){if(r[0]===10)m.push('X');else m.push(r[0]||'-')}if(r.length>1){if(r[0]===10)m.push(r[1]===10?'X':r[1]||'-');else m.push(r[0]+r[1]===10?'/':r[1]||'-')}if(r.length>2){const pv=r[0]===10?(r[1]===10?0:r[1]):0;m.push(r[2]===10?'X':(pv&&pv+r[2]===10)?'/':r[2]||'-')}
   done=r.length===3||(r.length===2&&r[0]+r[1]<10);F.push({r:m,s:done?(tot+=r.reduce((a,b)=>a+b,0)):null})}}return{F,tot}}
function bowlBoard(g){const S0=g.st||{rolls:[]};const {F}=bowlFrames(S0.rolls||[]);let last=0;return Array.from({length:5},(_,f)=>{const x=F[f];if(x&&x.s!=null)last=x.s;return`<div class="bwf ${(S0.fr||0)===f&&!g.end?'on':''}"><i>${f+1}</i><span>${x?x.r.map(v=>`<em>${v}</em>`).join(''):''}</span><b>${x&&x.s!=null?x.s:''}</b></div>`}).join('')+`<div class="bwt"><i>${arcT('Tổng','Total')}</i><b>${bowlFrames(S0.rolls||[]).tot}</b></div>`}
function bowlCount(g){const S0=g.st;const down=S0.pins.filter(p=>p.hit&&!p.gone).length;S0.pins.forEach(p=>{if(p.hit)p.gone=true});const left=S0.pins.filter(p=>!p.gone).length;S0.rolls.push(down);S0.crash=0;
 const gut=S0.lastGut;let msg=down===0?arcT('Trượt rồi!','Missed!'):arcT(`${down} ki`,`${down} pins`),big=false,resetRack=false,next=false,end=false;
 if(S0.fr<4){if(S0.th===0&&down===10){msg='STRIKE!';big=true;next=true}else if(S0.th===0){S0.th=1}else{if(left===0){msg='SPARE!';big=true}next=true}}
 else{const r=S0.rolls.slice(S0.rolls.length-S0.th-1);if(S0.th===0){if(down===10){msg='STRIKE!';big=true;resetRack=true}S0.th=1}
  else if(S0.th===1){if(r[0]===10){if(down===10){msg='STRIKE!';big=true}if(left===0)resetRack=true;S0.th=2}else if(r[0]+r[1]===10){msg='SPARE!';big=true;resetRack=true;S0.th=2}else end=true}else end=true}
 S0.fl={m:msg,t:big?1.8:1.1,big};if(big){try{sfx('win')}catch(e){}const W=g.R.W;for(let i=0;i<40;i++)S0.fx.push({x:W/2+(Math.random()-.5)*W*.3,y:g.R.H*.35,vx:(Math.random()-.5)*W*1.4,vy:-200-Math.random()*400,t:1.4+Math.random()*.6,c:['#FCB40C','#F04A1B','#2AB563','#12B5E8','#fff'][i%5]})}
 g.score=bowlFrames(S0.rolls).tot;const sb=document.getElementById('bwSB');
 if(next){S0.fr++;S0.th=0;if(S0.fr>=5)end=true;else resetRack=true}
 if(sb)sb.innerHTML=bowlBoard(g);
 if(end){S0.phase='done';setTimeout(()=>{if(scr===g)arcEnd()},1600);return}
 if(resetRack)S0.pins=bowlRack();S0.phase='aim';S0.t=0;S0.bx=0;bowlTip(arcT('Kéo bóng sang trái/phải để đứng, rồi vuốt lên để lăn','Drag the ball left/right, then swipe up to roll'))}
function bowlDraw(g,dt){const R=g.R,{c,W,H}=R,S0=g.st;c.fillStyle='#0b1a3d';c.fillRect(0,0,W,H);
 /* tường cuối + đèn */const P0=bwProj(R,0,BW.end);c.fillStyle='#1F2A5A';c.fillRect(0,0,W,P0.y);for(let i=0;i<12;i++){c.fillStyle=['#F04A1B','#FCB40C','#2AB563','#12B5E8'][i%4];c.globalAlpha=.5+.5*Math.abs(Math.sin(S0.t*2+i));c.fillRect(W*(i+.5)/12-3,P0.y*.25,6,6)}c.globalAlpha=1;
 c.fillStyle='#FCB40C';c.font=`${Math.round(W/16)}px VT323, monospace`;c.textAlign='center';c.fillText('JENNY LANES',W/2,P0.y*.75);
 const quad=(x0,x1,z0,z1,col)=>{const a=bwProj(R,x0,z0),b=bwProj(R,x1,z0),d=bwProj(R,x1,z1),e=bwProj(R,x0,z1);c.fillStyle=col;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.lineTo(d.x,d.y);c.lineTo(e.x,e.y);c.closePath();c.fill()};
 quad(-1.25,1.25,-1,BW.end,'#3a2a52');quad(-1,1,-1,BW.end,'#E2B85E');quad(-1,1,BW.zp-.6,BW.end,'#F0CE85');
 c.strokeStyle='rgba(155,98,52,.35)';c.lineWidth=1;for(let i=-3;i<=3;i++){const a=bwProj(R,i*.3,-1),b=bwProj(R,i*.3,BW.end);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke()}
 /* mũi tên ngắm */c.fillStyle='#C8783A';for(let i=-2;i<=2;i++){const p=bwProj(R,i*.35,4+Math.abs(i)*.4);c.beginPath();c.moveTo(p.x,p.y-7*p.k*1.6);c.lineTo(p.x-5*p.k*1.6,p.y+4);c.lineTo(p.x+5*p.k*1.6,p.y+4);c.fill()}
 const fl=bwProj(R,0,0);c.fillStyle='#F04A1B';c.fillRect(bwProj(R,-1,0).x,fl.y-1,fl.hw*2,3);
 /* vật thể theo thứ tự xa → gần */const items=[];S0.pins.forEach(p=>{if(!p.gone||p.hit&&Math.abs(p.x)<1.4&&p.z<BW.end+.5)items.push({z:p.z,p})});if(S0.ball)items.push({z:S0.ball.z,b:S0.ball});if(S0.phase==='aim')items.push({z:0,aim:1});items.sort((a,b)=>b.z-a.z);
 const pin=arcImg('pinS'),bi=arcImg('bowlI');
 for(const it of items){if(it.p){const p=it.p;if(p.gone&&!p.hit)continue;const P=bwProj(R,p.x,p.z),h=P.hw*.8,w=h*7/12;c.save();c.translate(P.x,P.y);if(p.hit){c.rotate(p.a);c.globalAlpha=p.gone?.0:.85}c.drawImage(pin,-w/2,-h,w,h);c.restore()}
  else if(it.b){const b=it.b,P=bwProj(R,b.x,b.z),s=P.hw*BW.rb*2.2;c.save();c.translate(P.x,P.y-s*.45);c.rotate(b.rot);c.drawImage(bi,-s/2,-s/2,s,s);c.restore()}
  else{const P=bwProj(R,S0.bx,0),s=P.hw*BW.rb*2.2;c.save();c.setLineDash([6,8]);c.strokeStyle='rgba(31,42,90,.35)';c.lineWidth=2;const f=bwProj(R,S0.bx,BW.zp-1);c.beginPath();c.moveTo(P.x,P.y-s);c.lineTo(f.x,f.y);c.stroke();c.restore();c.drawImage(bi,P.x-s/2,P.y-s*.95,s,s);
   if(S0.hint){const k=(S0.t%1.6)/1.6,hx=P.x+18,hy=P.y-s*.5-k*H*.28;c.globalAlpha=1-k;c.fillStyle='#fff';c.strokeStyle='#1F2A5A';c.lineWidth=3;c.beginPath();c.arc(hx,hy,12,0,7);c.fill();c.stroke();c.globalAlpha=1}}}
 if(S0.trail&&S0.trail.length>1){c.strokeStyle='#FCB40C';c.lineWidth=5;c.lineCap='round';c.beginPath();S0.trail.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()}
 S0.fx.forEach(f=>{c.fillStyle=f.c;c.fillRect(f.x,f.y,6,6)});
 if(S0.fl&&S0.fl.t>0){c.save();c.globalAlpha=Math.min(1,S0.fl.t*2);const sz=S0.fl.big?W/6:W/11;c.font=`${Math.round(sz)}px VT323, monospace`;c.textAlign='center';c.lineWidth=6;c.strokeStyle='#1F2A5A';c.fillStyle=S0.fl.big?'#FCB40C':'#fff';const y=H*.42-(S0.fl.big?(1.8-S0.fl.t)*20:0);c.strokeText(S0.fl.m,W/2,y);c.fillText(S0.fl.m,W/2,y);c.restore()}}
/* ================= ĐẨY THÙNG ================= */
function boxLoad(g){const rows=BOX_LV[g.lv][0],Hh=rows.length,Ww=Math.max(...rows.map(r=>r.length));const m={W:Ww,H:Hh,wall:[],goal:[],box:[],p:null};
 rows.forEach((r,y)=>[...r.padEnd(Ww,' ')].forEach((ch,x)=>{if(ch==='#')m.wall.push(y*Ww+x);if('.*+'.includes(ch))m.goal.push(y*Ww+x);if('$*'.includes(ch))m.box.push(y*Ww+x);if('@+'.includes(ch))m.p=y*Ww+x}));
 g.st={m,hist:[]};g.moves=0}
function boxInit(g){if(!g.st)boxLoad(g);if(g.banner)setTimeout(()=>{if(scr===g){g.banner='';const b=document.querySelector('.arcban');if(b)b.remove()}},1800);const m=g.st.m;const R=arcCanvas(m.H/m.W);if(!R)return;g.R=R;
 let s0=null;R.cv.onpointerdown=e=>{s0=[e.clientX,e.clientY]};R.cv.onpointerup=e=>{if(!s0)return;const dx=e.clientX-s0[0],dy=e.clientY-s0[1];s0=null;if(Math.max(Math.abs(dx),Math.abs(dy))<20)return;if(Math.abs(dx)>Math.abs(dy))boxMove(dx>0?1:-1,0);else boxMove(0,dy>0?1:-1)};
 arcLoop(g,()=>{},boxDraw)}
function boxMove(dx,dy){const g=scr;if(g.k!=='arc'||g.g!=='box'||g.end||g.won)return;const m=g.st.m,d=dy*m.W+dx,np=m.p+d;if(m.wall.includes(np))return;const bi=m.box.indexOf(np);
 if(bi>=0){const nb=np+d;if(m.wall.includes(nb)||m.box.includes(nb)){try{sfx('bad')}catch(e){}return}g.st.hist.push([m.p,m.box.slice()]);m.box[bi]=nb;try{sfx('tick')}catch(e){}}else{g.st.hist.push([m.p,m.box.slice()]);try{sfx('tap')}catch(e){}}
 m.p=np;g.moves++;const e=document.getElementById('arcS');if(e)e.textContent=g.moves;
 if(m.box.every(b=>m.goal.includes(b))){g.won=true;g.solved++;g.tot+=g.moves;g.par+=BOX_LV[g.lv][1];const a=arcSt(S.st[sid]);a.lv=Math.max(a.lv||0,Math.min(g.lv+1,BOX_LV.length));g.score=a.lv;save();try{sfx('win')}catch(e){}
  setTimeout(()=>{if(scr!==g)return;if(g.si<g.set.length-1){g.si++;g.lv=g.set[g.si];g.won=false;g.st=null;g.banner=arcT(`Xong màn! Tiếp: màn ${g.lv+1}`,`Level done! Next: level ${g.lv+1}`);render()}else arcEnd()},900)}}
function boxUndo(){const g=scr;if(g.won||!g.st||!g.st.hist.length)return;const [p,b]=g.st.hist.pop();g.st.m.p=p;g.st.m.box=b;g.moves++;const e=document.getElementById('arcS');if(e)e.textContent=g.moves}
function boxReset(){const g=scr;if(g.won)return;boxLoad(g);const e=document.getElementById('arcS');if(e)e.textContent=0}
function boxDraw(g){const {c,W,H}=g.R,m=g.st.m,cs=W/m.W;c.fillStyle='#1F2A5A';c.fillRect(0,0,W,H);
 for(let y=0;y<m.H;y++)for(let x=0;x<m.W;x++){const k=y*m.W+x,X=x*cs,Y=y*cs;if(m.wall.includes(k))c.drawImage(arcImg('brickS'),X,Y,cs,cs);else{c.fillStyle=(x+y)%2?'#F6D98B':'#EED39A';c.fillRect(X,Y,cs,cs)}if(m.goal.includes(k))c.drawImage(arcImg('goalS'),X,Y,cs,cs)}
 m.box.forEach(k=>{const x=k%m.W,y=Math.floor(k/m.W);c.drawImage(arcImg(m.goal.includes(k)?'crateOkS':'crateS'),x*cs+cs*.06,y*cs+cs*.06,cs*.88,cs*.88)});
 const jx=m.p%m.W,jy=Math.floor(m.p/m.W),jh=cs*.92,jw=jh*16/19;c.drawImage(arcImg(typeof ofVariant==='function'&&S.st[sid].outfit?ofVariant('jenny',S.st[sid].outfit):'jenny'),jx*cs+(cs-jw)/2,jy*cs+(cs-jh)/2,jw,jh)}
addEventListener('keydown',e=>{if(!scr||scr.k!=='arc'||scr.end)return;const K={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
 if(scr.g==='box'&&K[e.key]){e.preventDefault();boxMove(...K[e.key])}else if(scr.g==='dino'&&(e.key===' '||e.key==='ArrowUp')){e.preventDefault();dinoJump()}});
/* ================= KHỦNG LONG CHẠY ================= */
function dinoInit(g){const R=arcCanvas(.55);if(!R)return;g.R=R;if(!g.st)g.st={y:0,vy:0,obs:[],t:0,sp:R.W*.5,next:1.2,cl:[[R.W*.3,R.H*.18],[R.W*.75,R.H*.3]],start:.8};
 R.cv.onpointerdown=e=>{e.preventDefault();dinoJump()};arcLoop(g,dinoStep,dinoDraw)}
function dinoJump(){const g=scr;if(g.k!=='arc'||g.g!=='dino'||g.end)return;const s=g.st;if(s.y===0){s.vy=-g.R.H*2.15;try{sfx('tap')}catch(e){}}}
function dinoStep(g,dt){const s=g.st,{W,H}=g.R;if(s.dead)return;if(s.start>0){s.start-=dt;return}s.t+=dt;s.sp=W*(.5+Math.min(.9,s.t*.018));
 s.vy+=H*6.2*dt;s.y=Math.min(0,s.y+s.vy*dt);if(s.y===0)s.vy=0;
 g.score=Math.floor(s.t*10*(1+s.t*.02));const e=document.getElementById('arcS');if(e)e.textContent=g.score;
 s.next-=dt;if(s.next<=0){const bird=g.score>220&&Math.random()<.3;s.obs.push(bird?{k:'bird',x:W+20,h:H*.13,w:H*.2,yo:Math.random()<.5?H*.2:H*.05}:{k:'cact',x:W+20,h:H*(.16+Math.random()*.08),w:H*.11*(Math.random()<.3?1.8:1),yo:0});s.next=.75+Math.random()*1.0-Math.min(.35,s.t*.004)}
 s.obs.forEach(o=>o.x-=s.sp*dt);s.obs=s.obs.filter(o=>o.x>-o.w-10);s.cl.forEach(c=>{c[0]-=s.sp*.2*dt;if(c[0]<-60)c[0]=W+40});
 const gy=H*.82,dh=H*.24,dw=dh*14/13,dx=W*.1,dy=gy-dh+s.y;const hb={x:dx+dw*.2,y:dy+dh*.15,w:dw*.55,h:dh*.75};
 for(const o of s.obs){const oy=gy-o.h-o.yo;const ob={x:o.x+o.w*.15,y:oy+o.h*.1,w:o.w*.7,h:o.h*.85};if(hb.x<ob.x+ob.w&&hb.x+hb.w>ob.x&&hb.y<ob.y+ob.h&&hb.y+hb.h>ob.y){s.dead=true;try{sfx('bad')}catch(e){}setTimeout(()=>{if(scr===g)arcEnd()},900);break}}}
function dinoDraw(g){const {c,W,H}=g.R,s=g.st;c.fillStyle='#BDEBFA';c.fillRect(0,0,W,H);const gy=H*.82;
 c.fillStyle='#fff';s.cl.forEach(([x,y])=>{c.fillRect(x,y,46,10);c.fillRect(x+10,y-8,24,8)});
 c.fillStyle='#E2B85E';c.fillRect(0,gy,W,H-gy);c.fillStyle='#C8783A';for(let i=0;i<14;i++){const x=((i*53-s.t*s.sp)%W+W)%W;c.fillRect(x,gy+8+(i%3)*9,8,3)}c.fillStyle='#1F2A5A';c.fillRect(0,gy,W,3);
 s.obs.forEach(o=>{const oy=gy-o.h-o.yo;c.drawImage(arcImg(o.k==='bird'?(Math.floor(s.t*6)%2?'birdA':'birdB'):'cactS'),o.x,oy,o.w,o.h)});
 const dh=H*.24,dw=dh*14/13,fr=s.y<0||s.start>0?'dinoA':(Math.floor(s.t*10)%2?'dinoA':'dinoB');c.drawImage(arcImg(fr),W*.1,gy-dh+s.y,dw,dh);
 if(s.start>0){c.fillStyle='#1F2A5A';c.font=`${Math.round(W/12)}px VT323, monospace`;c.textAlign='center';c.fillText(arcT('Sẵn sàng…','Ready…'),W/2,H*.4)}}
/* ---- vòng lặp ---- */
function arcLoop(g,step,draw){arcStop();let last=performance.now();const f=now=>{if(scr!==g||g.end||!g.R||!g.R.cv.isConnected){ARCL=null;return}const dt=Math.min(.05,(now-last)/1000);last=now;try{step(g,dt);draw(g,dt)}catch(e){console.error(e)}ARCL=requestAnimationFrame(f)};ARCL=requestAnimationFrame(f)}
/* ---- nối vào app ---- */
{hooks.on('viewHS',_vh=>function(){try{if(scr.k==='arc')return viewArc()}catch(e){console.error(e)}return _vh.apply(this,arguments)})}
{hooks.on('render',_r=>function(){if(scr&&scr.k!=='arc')arcStop();const a=_r.apply(this,arguments);try{if(role==='hs'&&scr.k==='arc'){document.body.classList.add('gaming');if(!scr.end)({bowl:bowlInit,box:boxInit,dino:dinoInit})[scr.g](scr)}}catch(e){console.error(e)}return a})}
try{addEventListener('resize',()=>{if(scr&&scr.k==='arc'&&!scr.end)({bowl:bowlInit,box:boxInit,dino:dinoInit})[scr.g](scr)})}catch(e){}
/* Nhà em: giữ 3 ô như cũ; thêm khung "Trò chơi" bên dưới — các trò em đã mua */
function arcHome(...a){return hooks.goi('arcHome',this,a)}
hooks.ham('arcHome',function(st){const a=arcSt(st),own=Object.keys(ARC).filter(k=>a.own[k]),left=arcLeftToday(a);
 const rows=own.map(k=>{const g=ARC[k],c=a.cups[k]||{},can=a.plays>0&&left>0;return`<div class="arch"><span class="arcic">${spr(g.ic,34)}</span><div class="grow"><b>${arcT(g.n,g.en)}</b><span class="arccups">${spr('cupG',14)}${c.g||0} ${spr('cupS',14)}${c.s||0} ${spr('cupB',14)}${c.b||0}</span>${a.best[k]!=null?`<small class="arcbest">${arcT('Kỷ lục','Best')}: ${a.best[k]}${k==='box'?arcT(' màn',' levels'):''}</small>`:''}</div><button type="button" class="gobtn ${can?'':'off'}" onclick="arcPlay('${k}')">${arcT('Chơi','Play')} ▸</button></div>`}).join('');
 return`<section class="card archome"><div class="archd"><h2>${spr('joyS',24)} ${arcT('Trò chơi','Games')}</h2><span class="grow"></span><span class="pill">${spr('tkS',16)} ${arcT(`${a.plays} lượt · hôm nay ${a.used}/${ARC_DAY}`,`${a.plays} plays · today ${a.used}/${ARC_DAY}`)}</span></div>
  ${own.length?rows:`<p class="muted">${arcT('Em chưa có trò chơi nào. Mua trò ở Cửa hàng › Trò chơi nhé!','No games yet. Buy one in Shop › Games!')}</p>`}
  <div class="archbtn"><button type="button" class="btn sm" onclick="go({k:'home',tab:'shop'});scr.ghCat='tk';render()">${own.length<3?arcT('Mua thêm trò chơi','Buy more games'):arcT('Mua thêm lượt','Buy more plays')} ▸</button></div></section>`});
{hooks.on('viewNha',_n=>function(st){const r=_n.apply(this,arguments);const i=r.lastIndexOf('</div>');return i<0?r:r.slice(0,i)+arcHome(st)+r.slice(i)})}
document.head.insertAdjacentHTML('beforeend',`<style>
.archome{margin-top:14px;padding:14px!important}.archd{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}.archd h2{display:flex;align-items:center;gap:8px;margin:0;font-size:26px}
.arch{display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:10px;background:var(--surface,#fff);box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A)}.arch .grow{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:4px}.arch b{font-family:var(--f-display);font-size:22px;font-weight:400;line-height:1}.arch .arcic{width:44px;height:44px}.arch .gobtn{margin:0 0 0 auto;width:96px;flex:none;font-size:16px!important;padding:8px 6px!important;text-align:center}.arch .gobtn.off{opacity:.5}.archbtn{display:flex;justify-content:flex-end}
.arcbox{display:flex;flex-direction:column;gap:12px}
.arctop{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:12px;background:var(--sun-soft);box-shadow:var(--f2)}
.arctop b{display:flex;align-items:center;gap:6px;font-family:var(--f-display);font-size:24px;font-weight:400}.arctop em{font-style:normal;color:var(--coral)}.arctop small{display:block;font-size:13px;color:var(--muted)}
.arctop .gobtn{margin:0;font-size:16px!important;padding:8px 10px!important;width:auto}
.arcnote{margin:0;font-size:13px;color:var(--muted)}
.px2{box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A)}
.arcg{display:flex;gap:12px;align-items:center;padding:12px;background:var(--surface,#fff)}
.arcg .grow{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:3px}.arcg b{font-family:var(--f-display);font-size:24px;font-weight:400;line-height:1}.arcg small{font-size:13px;line-height:1.35}
.arcic{flex:none;width:52px;height:52px;display:grid;place-items:center;background:var(--sea-soft);box-shadow:var(--f2)}
.arccups{display:flex;align-items:center;gap:3px;font-family:var(--f-display);font-size:17px}.arcbest{font-size:12px!important;color:var(--muted)}.arccups{flex-wrap:nowrap;white-space:nowrap}.arch .gobtn,.arcg .gobtn{align-self:center}
.arcrare{font-size:12px;color:var(--sun-ink);font-weight:600}
.arcg .gobtn{margin:0 0 0 auto;width:96px;text-align:center;flex:none;font-size:16px!important;padding:9px 10px!important}.arcg .gobtn.off{opacity:.5}.arcg .gobtn.sun{background:#FCB40C!important;color:#1F2A5A!important}
.ghit.rare{opacity:.85}.ghtag.rare{background:#FDE6DE;color:#B8320F}
.arcgame .gmid{display:flex;align-items:center;justify-content:center}.arcwrap{width:100%;display:flex;justify-content:center}.arcwrap canvas{display:block;box-shadow:var(--f2);touch-action:none;image-rendering:pixelated}
.arctip{text-align:center;font-family:var(--f-display);font-size:22px;margin:4px 0;min-height:26px}
.arcpad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:340px;margin:0 auto}
.arcpad button{border:0;padding:12px 6px;font-family:var(--f-display);font-size:22px;background:var(--surface,#fff);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A);cursor:pointer}.arcpad button:active{transform:translateY(3px)}
.arcpad .u{font-size:24px}
.arcban{font-family:var(--f-display);font-size:24px;text-align:center;padding:6px 10px;margin:0 auto 8px;background:#2AB563;color:#fff;box-shadow:var(--f2);width:fit-content}
.bwsb{display:flex;gap:3px;flex:1;min-width:0;justify-content:center}.bwf,.bwt{display:flex;flex-direction:column;align-items:center;min-width:0;flex:1;max-width:58px;background:var(--surface,#fff);box-shadow:var(--f2);padding:1px 2px;font-family:var(--f-display);line-height:1}.bwf i,.bwt i{font-style:normal;font-size:12px;color:var(--muted)}.bwf span{display:flex;gap:2px;min-height:15px;font-size:16px}.bwf em{font-style:normal;color:var(--coral)}.bwf b,.bwt b{font-size:18px;font-weight:400;min-height:17px;color:var(--ink)}.bwf.on{box-shadow:0 0 0 3px #FCB40C}.bwt{background:var(--sun-soft)}
</style>`);
/* thầy yêu cầu 23/10: học sinh thử Lê Bảo Na (bản đầy đủ) có 10 000 xu để kiểm tra — nạp một lần cho dữ liệu đã lưu */
{hooks.on('render',_r=>function(){try{if(typeof S!=='undefined'&&S.st&&S.st.na&&!S.na10k){S.st.na.coins=Math.max(S.st.na.coins||0,10000);S.na10k=1;save()}}catch(e){}return _r.apply(this,arguments)})}
