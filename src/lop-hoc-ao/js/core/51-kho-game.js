/* 51 — Kho trò chơi (thầy chốt 23/10/2026)
   - Ở Cửa hàng, mục "Trò chơi": 3 trò Bowling, Đẩy thùng, Khủng long chạy. Không cần gắn với Toán.
   - Mua một trò: 150 xu, được thêm 10 lượt. Vé 10 lượt: 60 xu. Lượt dùng chung cho cả 3 trò.
   - Mỗi lần vào chơi một trò = 1 lượt; kết thúc ván là hết lượt. Tối đa 5 lượt/ngày (lượt chưa dùng để dành).
   - Thắng: cúp Đồng/Bạc/Vàng theo điểm; 3 cúp Vàng ở một trò → đồ hiếm (mũ cho Jenny hoặc khăn cho thú cưng).
   Lưu: st.arc = {own:{bowl,box,dino}, plays, day, used, best:{}, cups:{g:{b,s,g}}, gold:{}, lv (màn đẩy thùng), rare:[]} */
const BOX_LV=[[["#######", "#     #", "# @$ .#", "#     #", "#######"], 2], [["########", "#      #", "# $##$ #", "# .@ . #", "#      #", "########"], 11], [["########", "#   #  #", "# $  $ #", "# .##. #", "#  @   #", "########"], 13], [["#######", "#  .  #", "#     #", "# $@$ #", "#  .  #", "#######"], 14], [["########", "#  .   #", "# $$$  #", "#. @ # #", "#  . # #", "########"], 17], [["########", "#..    #", "#  ##$ #", "# $  @ #", "#  $ . #", "########"], 18], [["#######", "#.  # #", "# $   #", "# #$# #", "#. @  #", "#######"], 29], [["#########", "#   #   #", "# $ . $ #", "##$# #.##", "#. @    #", "#########"], 34]];
const ARC_PRICE=150,ARC_TK=60,ARC_PER=10,ARC_DAY=5;
const ARC={bowl:{n:'Bowling',en:'Bowling',ic:'bowlI',d:'Lăn bóng làm đổ ki. 3 lượt, mỗi lượt 2 lần lăn.',de:'Roll the ball to knock down pins. 3 frames, 2 rolls each.',cup:[15,25,33],unit:'điểm',rare:['bcap','Mũ vô địch Bowling','acc']},
 box:{n:'Đẩy thùng',en:'Box Push',ic:'crateS',d:'Đẩy hết thùng gỗ vào ô đánh dấu. Càng ít bước càng giỏi.',de:'Push every crate onto a marked spot in as few moves as you can.',cup:null,unit:'bước',rare:['mhat','Mũ thợ mỏ','acc']},
 dino:{n:'Khủng long chạy',en:'Dino Run',ic:'dinoA',d:'Chạm để khủng long nhảy qua xương rồng và chim.',de:'Tap to jump over cacti and birds.',cup:[150,400,800],unit:'điểm',rare:['dscarf','Khăn khủng long (thú cưng)','pet']}};
const arcEN=()=>typeof LANG!=='undefined'&&LANG==='en';
const arcT=(vi,en)=>arcEN()?en:vi;
function arcSt(st){st.arc=st.arc||{own:{},plays:0,day:'',used:0,best:{},cups:{},gold:{},lv:0,rare:[]};const a=st.arc;const d=new Date().toISOString().slice(0,10);if(a.day!==d){a.day=d;a.used=0}return a}
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
{const _c=careGrid;careGrid=function(st){const sv=CARE.splice(CARE.findIndex(c=>c[7]==='rare'),1);const r=_c.apply(this,arguments);CARE.push(...sv);return r}}
{const _p=petSim;petSim=function(st){const r=_p.apply(this,arguments);try{ghSt(st).gear.forEach(g=>{const c=careOf(g.id);if(c&&c[7]==='rare')g.dur=100})}catch(e){}return r}}
{const _g=ghCard;ghCard=function(c,x,st){if(x[3]==='rare'&&!ghSt(st).own.includes(x[0])){const g=Object.keys(ARC).find(k=>ARC[k].rare[0]===x[0]);return`<button type="button" class="ghit rare" onclick="toast('${arcT(`Thắng 3 cúp Vàng ở trò ${ARC[g].n} để nhận`,`Win 3 gold cups in ${ARC[g].en} to unlock`)}')"><span class="ghpic">${spr(GH_ACC[x[0]][0],30)}</span><b>${esc(x[1])}</b><i class="ghtag rare">${arcT('Đồ hiếm','Rare')}</i></button>`}return _g.apply(this,arguments)}}
/* ---- Cửa hàng: mục Trò chơi ---- */
{const T=GH.find(c=>c.k==='tk');if(T){T.n='Trò chơi';T.ic='joyS'}}
function arcShop(st){const a=arcSt(st),en=arcEN();
 const games=Object.entries(ARC).map(([k,g])=>{const own=a.own[k],cups=a.cups[k]||{},best=a.best[k],can=own&&a.plays>0&&arcLeftToday(a)>0,gold=a.gold[k]||0,got=a.rare.includes(g.rare[0]);
  return`<div class="arcg px2"><span class="arcic">${spr(g.ic,40)}</span><div class="grow"><b>${en?g.en:g.n}</b><small>${en?g.de:g.d}</small>
   <span class="arccups">${spr('cupG',16)}${cups.g||0} ${spr('cupS',16)}${cups.s||0} ${spr('cupB',16)}${cups.b||0}${best!=null?` · ${en?'best':'kỷ lục'} ${best}${k==='box'?(en?' levels':' màn'):''}`:''}</span>
   <span class="arcrare">${got?`✓ ${en?'Unlocked':'Đã nhận'}: ${esc(g.rare[1])}`:`${en?'Gold':'Vàng'} ${Math.min(gold,3)}/3 → ${esc(g.rare[1])}`}</span></div>
   ${own?`<button type="button" class="gobtn ${can?'':'off'}" onclick="arcPlay('${k}')">${en?'Play':'Chơi'} ▶</button>`:`<button type="button" class="gobtn sun" onclick="arcBuy('${k}')">${spr('coin',16)} ${ARC_PRICE}</button>`}</div>`}).join('');
 return`<div class="arcbox"><div class="arctop"><div><b>${spr('tkS',20)} ${en?'Plays left':'Lượt chơi'}: <em>${a.plays}</em></b><small>${en?`Today ${a.used}/${ARC_DAY}`:`Hôm nay đã chơi ${a.used}/${ARC_DAY} lượt`}</small></div><button type="button" class="gobtn" onclick="arcTicket()">${en?'Buy 10 plays':'Mua 10 lượt'} · ${spr('coin',16)} ${ARC_TK}</button></div>
  <p class="arcnote">${en?`Buy a game: ${ARC_PRICE} coins, includes ${ARC_PER} plays. Each game you start uses 1 play. Up to ${ARC_DAY} plays a day.`:`Mua trò: ${ARC_PRICE} xu, kèm ${ARC_PER} lượt. Mỗi lần vào chơi một trò dùng 1 lượt. Tối đa ${ARC_DAY} lượt mỗi ngày.`}</p>${games}</div>`}
{const _v=viewShop;viewShop=function(st){const r=_v.apply(this,arguments);if((scr.ghCat||'of')!=='tk')return r;return r.replace(/<div class="ghtk">[\s\S]*?<\/span><\/div><\/div>/,arcShop(st))}}
function arcBuy(k){const st=S.st[sid],a=arcSt(st);if(a.own[k])return;if(st.coins<ARC_PRICE){toast(arcT(`Em cần thêm ${ARC_PRICE-st.coins} xu nhé!`,`You need ${ARC_PRICE-st.coins} more coins.`));return}st.coins-=ARC_PRICE;a.own[k]=1;a.plays+=ARC_PER;save();try{sfx('win')}catch(e){}toast(arcT(`Đã mua ${ARC[k].n}! +${ARC_PER} lượt chơi`,`Bought ${ARC[k].en}! +${ARC_PER} plays`));render()}
function arcTicket(){const st=S.st[sid],a=arcSt(st);if(st.coins<ARC_TK){toast(arcT(`Em cần thêm ${ARC_TK-st.coins} xu nhé!`,`You need ${ARC_TK-st.coins} more coins.`));return}st.coins-=ARC_TK;a.plays+=ARC_PER;save();try{sfx('coin')}catch(e){}toast(arcT(`+${ARC_PER} lượt chơi`,`+${ARC_PER} plays`));render()}
function arcPlay(k,again){const st=S.st[sid],a=arcSt(st);if(!a.own[k])return;if(a.plays<=0){toast(arcT('Em hết lượt rồi. Mua thêm vé 10 lượt nhé!','No plays left. Buy 10 more plays!'));if(again)go({k:'home',tab:'shop'});return}if(arcLeftToday(a)<=0){toast(arcT(`Hôm nay em đã chơi đủ ${ARC_DAY} lượt. Mai chơi tiếp nhé!`,`You've used today's ${ARC_DAY} plays. Come back tomorrow!`));return}
 a.plays--;a.used++;save();try{speechSynthesis.cancel()}catch(e){}const g={k:'arc',g:k,score:0,end:false,t0:Date.now()};
 if(k==='box'){g.lv=Math.min(a.lv||0,BOX_LV.length-1)}go(g)}
/* ---- màn chơi chung ---- */
function viewArc(){const g=scr,a=arcSt(S.st[sid]),G=ARC[g.g],en=arcEN();
 if(g.end){const cup=g.cup,ci=cup==='g'?'cupG':cup==='s'?'cupS':cup==='b'?'cupB':'';const cn={g:arcT('Cúp Vàng','Gold cup'),s:arcT('Cúp Bạc','Silver cup'),b:arcT('Cúp Đồng','Bronze cup')}[cup];
  return`<div class="game g1"><div class="gend"><div class="bigicon bossend">${jenny(70,cup?'cheer':'sad')}${ci?spr(ci,72):spr(G.ic,56)}</div><h1>${cup?cn+'!':arcT('Hết lượt rồi!','Game over!')}</h1>
   <p class="muted">${g.g==='box'?(g.won?arcT(`Màn ${g.lv+1} xong trong ${g.moves} bước (ít nhất ${BOX_LV[g.lv][1]})`,`Level ${g.lv+1} done in ${g.moves} moves (best ${BOX_LV[g.lv][1]})`):arcT(`Chưa xong màn ${g.lv+1}`,`Level ${g.lv+1} not finished`)):`${en?'Score':'Điểm'}: <b>${g.score}</b>${g.prev!=null?` · ${en?'best':'kỷ lục'} ${Math.max(g.prev,g.score)}`:''}`}</p>
   ${g.rareNew?`<p class="earn">${spr(GH_ACC[g.rareNew]?GH_ACC[g.rareNew][0]:'dscarfS',28)} ${arcT('Em nhận được đồ hiếm','You unlocked a rare item')}: <b>${esc(ARC[g.g].rare[1])}</b></p>`:''}
   ${!cup&&g.g!=='box'?`<p class="muted">${arcT(`Cần ${G.cup[0]} điểm để có cúp Đồng.`,`Score ${G.cup[0]} for a bronze cup.`)}</p>`:''}
   <p class="muted">${arcT(`Còn ${a.plays} lượt · hôm nay ${a.used}/${ARC_DAY}`,`${a.plays} plays left · today ${a.used}/${ARC_DAY}`)}</p>
   <div class="gendbtn"><button class="gobtn" type="button" onclick="arcPlay('${g.g}',1)">${arcT('Chơi lượt nữa','Play again')}</button><button class="gobtn ghost" type="button" onclick="scr.ghCat='tk';go({k:'home',tab:'shop'})">${arcT('Về kho trò chơi','Back to games')}</button></div></div></div>`}
 const hud=g.g==='bowl'?`<span class="mgsc">${arcT('Lượt','Frame')} <b id="arcF">${Math.min(3,(g.fr||0)+1)}/3</b></span><span class="grow"></span><span class="mgsc">${spr('pinS',20)} <b id="arcS">${g.score}</b></span>`
  :g.g==='box'?`<span class="mgsc">${arcT('Màn','Level')} <b>${g.lv+1}/${BOX_LV.length}</b></span><span class="grow"></span><span class="mgsc">${arcT('Bước','Moves')} <b id="arcS">${g.moves||0}</b></span>`
  :`<span class="grow"></span><span class="mgsc">${spr('star',20)} <b id="arcS">${g.score}</b></span>`;
 const ctl=g.g==='box'?`<div class="arcpad"><button type="button" onclick="boxUndo()">↶ ${arcT('Lùi','Undo')}</button><button type="button" class="u" onclick="boxMove(0,-1)" aria-label="Lên">↑</button><button type="button" onclick="boxReset()">⟲ ${arcT('Làm lại','Restart')}</button><button type="button" onclick="boxMove(-1,0)" aria-label="Trái">←</button><button type="button" onclick="boxMove(0,1)" aria-label="Xuống">↓</button><button type="button" onclick="boxMove(1,0)" aria-label="Phải">→</button></div>`
  :`<p class="arctip" id="arcTip">${g.g==='bowl'?arcT('Chạm để chọn chỗ lăn bóng','Tap to choose where to roll'):arcT('Chạm màn hình để nhảy','Tap to jump')}</p>`;
 return`<div class="game g1 arcgame"><div class="gtop"><button class="gx" onclick="arcQuit()" aria-label="${arcT('Thoát','Exit')}">✕</button>${hud}</div><div class="gmid"><div class="arcwrap" id="arcWrap"><canvas id="arcCv"></canvas></div></div><div class="gbot">${ctl}</div></div>`}
function arcQuit(){const g=scr;if(g.k!=='arc')return;if(!g.end){arcEnd()}else{scr.ghCat='tk';go({k:'home',tab:'shop'})}}
let ARCI={};function arcImg(n){if(ARCI[n])return ARCI[n];const im=new Image();im.src=pxURI(n).u;return ARCI[n]=im}
let ARCL=null;function arcStop(){if(ARCL){cancelAnimationFrame(ARCL);ARCL=null}}
function arcCanvas(ratio){const w=document.getElementById('arcWrap'),cv=document.getElementById('arcCv');if(!w||!cv)return null;const W=Math.min(w.clientWidth,480),H=Math.round(W*ratio),dpr=window.devicePixelRatio||1;cv.style.width=W+'px';cv.style.height=H+'px';cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.imageSmoothingEnabled=false;return{cv,c,W,H}}
function arcEnd(){const g=scr,st=S.st[sid],a=arcSt(st);if(g.end)return;arcStop();g.end=true;const G=ARC[g.g];let cup=null;
 if(g.g==='box'){if(g.won){const par=BOX_LV[g.lv][1];cup=g.moves<=par+2?'g':g.moves<=Math.ceil(par*1.5)?'s':'b';a.lv=Math.max(a.lv||0,Math.min(g.lv+1,BOX_LV.length-1));g.prev=a.best.box||0;a.best.box=Math.max(a.best.box||0,g.lv+1)}}
 else{g.prev=a.best[g.g];a.best[g.g]=Math.max(a.best[g.g]||0,g.score);cup=g.score>=G.cup[2]?'g':g.score>=G.cup[1]?'s':g.score>=G.cup[0]?'b':null}
 g.cup=cup;if(cup){const C=a.cups[g.g]=a.cups[g.g]||{};C[cup]=(C[cup]||0)+1;if(cup==='g'){a.gold[g.g]=(a.gold[g.g]||0)+1;const [rid,,kind]=G.rare;if(a.gold[g.g]>=3&&!a.rare.includes(rid)){a.rare.push(rid);const s=ghSt(st);if(kind==='acc'){if(!s.own.includes(rid))s.own.push(rid)}else s.gear.push({u:Math.random().toString(36).slice(2,9),id:rid,dur:100,t:Date.now()});g.rareNew=rid}}
  try{log(sid,'passed',`Trò chơi · ${G.n}`,0,{success:true,score:{raw:g.score||g.moves||0}})}catch(e){}try{sfx('win')}catch(e){}}else{try{sfx('lose')}catch(e){}}
 save();render()}
/* ================= BOWLING ================= */
function bowlInit(g){if(!g.st){g.st={fr:0,th:0,pins:bowlRack(),phase:'aim',t:0,ball:null,frScore:[],k1:0};g.fr=0}const R=arcCanvas(1.45);if(!R)return;g.R=R;
 R.cv.onpointerdown=e=>{e.preventDefault();bowlTap()};arcLoop(g,bowlStep,bowlDraw)}
function bowlLane(R){const lw=R.W*0.62,lx=(R.W-lw)/2;return{lx,lw,cx:R.W/2,top:R.H*0.06,bot:R.H*0.95,rp:lw/24,rb:lw/14}}
function bowlRack(){const P=[];const rows=[[0],[-.5,.5],[-1,0,1],[-1.5,-.5,.5,1.5]];rows.forEach((r,i)=>r.forEach(c=>P.push({u:c,v:i,x:0,y:0,vx:0,vy:0,hit:false,gone:false,a:0})));return P}
function bowlTap(){const g=scr;if(g.k!=='arc'||g.end)return;const S0=g.st,L=bowlLane(g.R);
 if(S0.phase==='aim'){S0.bx=S0.aimX;S0.phase='dir';S0.t=0;bowlTip(arcT('Chạm để chọn hướng lăn','Tap to choose the direction'));try{sfx('tap')}catch(e){}}
 else if(S0.phase==='dir'){const a=S0.aimA;const sp=g.R.H*1.25;S0.ball={x:S0.bx,y:L.bot-L.rb,vx:Math.sin(a)*sp,vy:-Math.cos(a)*sp};S0.phase='roll';S0.t=0;bowlTip('');try{sfx('whoosh')}catch(e){try{sfx('tap')}catch(_){}}}}
function bowlTip(t){const e=document.getElementById('arcTip');if(e)e.textContent=t}
function bowlStep(g,dt){const S0=g.st,L=bowlLane(g.R);S0.t+=dt;
 S0.pins.forEach(p=>{if(!p.hit&&!p.gone){p.x=L.cx+p.u*L.rp*2.6;p.y=L.top+L.rp*2+p.v*L.rp*2.3}});
 if(S0.phase==='aim'){S0.aimX=L.cx+Math.sin(S0.t*2.2)*(L.lw/2-L.rb*1.2)}
 if(S0.phase==='dir'){S0.aimA=Math.sin(S0.t*2.6)*0.32}
 if(S0.phase==='roll'||S0.phase==='settle'){const b=S0.ball;if(b){b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<L.lx+L.rb||b.x>L.lx+L.lw-L.rb){b.vx=0;b.x=Math.max(L.lx+L.rb,Math.min(L.lx+L.lw-L.rb,b.x));b.gutter=1}
   for(const p of S0.pins){if(p.gone||p.hit)continue;const d=Math.hypot(p.x-b.x,p.y-b.y);if(d<L.rb+L.rp){p.hit=true;const sp=Math.hypot(b.vx,b.vy);p.vx=(p.x-b.x)/d*sp*.75+b.vx*.2;p.vy=(p.y-b.y)/d*sp*.75+b.vy*.2;b.vx*=.92;b.vy*=.9;b.vx+=(b.x-p.x)/d*sp*.08;try{sfx('hit')}catch(e){}}}
   if(b.y<L.top-L.rb*2){S0.ball=null}}
  for(const p of S0.pins){if(!p.hit||p.gone)continue;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.25,dt);p.vy*=Math.pow(.25,dt);p.a+=dt*8;
   for(const q of S0.pins){if(q===p||q.hit||q.gone)continue;const d=Math.hypot(q.x-p.x,q.y-p.y),sp=Math.hypot(p.vx,p.vy);if(d<L.rp*2.1&&sp>20){q.hit=true;q.vx=(q.x-p.x)/d*sp*.8;q.vy=(q.y-p.y)/d*sp*.8}}}
  if(S0.phase==='roll'&&!S0.ball){S0.phase='settle';S0.t=0}
  if(S0.phase==='settle'&&S0.t>1.1)bowlCount(g)}}
function bowlCount(g){const S0=g.st;const down=S0.pins.filter(p=>p.hit&&!p.gone).length;S0.pins.forEach(p=>{if(p.hit)p.gone=true});const left=S0.pins.filter(p=>!p.gone).length;
 let msg='';if(S0.th===0){S0.k1=down;if(left===0){g.score+=15;msg=arcT('STRIKE! +15','STRIKE! +15');try{sfx('win')}catch(e){}return bowlNextFrame(g,msg)}S0.th=1;msg=arcT(`Đổ ${down} ki`,`${down} pins`)}
 else{const tot=S0.k1+down;g.score+=tot+(left===0?2:0);msg=left===0?arcT('SPARE! +2','SPARE! +2'):arcT(`Lượt này: ${tot} ki`,`This frame: ${tot} pins`);return bowlNextFrame(g,msg)}
 S0.phase='aim';S0.t=0;bowlFlash(msg);bowlTip(arcT('Chạm để chọn chỗ lăn bóng','Tap to choose where to roll'))}
function bowlNextFrame(g,msg){const S0=g.st;if(S0.th===0&&S0.pins.every(p=>p.gone)){}S0.fr++;g.fr=S0.fr;bowlFlash(msg);const e=document.getElementById('arcS');if(e)e.textContent=g.score;
 if(S0.fr>=3){S0.phase='done';setTimeout(()=>{if(scr===g)arcEnd()},1300);return}S0.th=0;S0.pins=bowlRack();S0.phase='aim';S0.t=0;const f=document.getElementById('arcF');if(f)f.textContent=(S0.fr+1)+'/3';bowlTip(arcT('Chạm để chọn chỗ lăn bóng','Tap to choose where to roll'))}
function bowlFlash(m){scr.st.flash={m,t:1.4}}
function bowlDraw(g,dt){const {c,W,H}=g.R,S0=g.st,L=bowlLane(g.R);c.fillStyle='#1F2A5A';c.fillRect(0,0,W,H);
 c.fillStyle='#3a2a52';c.fillRect(L.lx-L.rb*1.2,0,L.lw+L.rb*2.4,H);c.fillStyle='#E2B85E';c.fillRect(L.lx,0,L.lw,H);
 c.fillStyle='#F6D98B';for(let i=0;i<7;i++)c.fillRect(L.lx+L.lw*(i+.5)/7-1,0,2,H);
 c.fillStyle='#C8783A';for(let i=0;i<7;i++){const x=L.lx+L.lw*(i+.5)/7,y=H*.62;c.beginPath();c.moveTo(x,y);c.lineTo(x-5,y+10);c.lineTo(x+5,y+10);c.fill()}
 const pin=arcImg('pinS'),ph=L.rp*3.4,pw=ph*7/12;
 S0.pins.forEach(p=>{if(p.gone)return;c.save();c.translate(p.x,p.y);if(p.hit){c.rotate(p.a);c.globalAlpha=.75}c.drawImage(pin,-pw/2,-ph*.75,pw,ph);c.restore()});
 const bi=arcImg('bowlI'),bs=L.rb*2.1;
 if(S0.phase==='aim'||S0.phase==='dir'){const x=S0.phase==='aim'?S0.aimX:S0.bx,y=L.bot-L.rb;c.drawImage(bi,x-bs/2,y-bs/2,bs,bs);
  if(S0.phase==='dir'){c.save();c.strokeStyle='#F04A1B';c.lineWidth=4;c.setLineDash([8,6]);c.beginPath();c.moveTo(x,y-L.rb);c.lineTo(x+Math.sin(S0.aimA)*H*.35,y-L.rb-Math.cos(S0.aimA)*H*.35);c.stroke();c.restore()}}
 if(S0.ball)c.drawImage(bi,S0.ball.x-bs/2,S0.ball.y-bs/2,bs,bs);
 if(S0.flash&&S0.flash.t>0){S0.flash.t-=dt;c.save();c.globalAlpha=Math.min(1,S0.flash.t*2);c.fillStyle='#FCB40C';c.font=`${Math.round(W/11)}px VT323, monospace`;c.textAlign='center';c.lineWidth=5;c.strokeStyle='#1F2A5A';c.strokeText(S0.flash.m,W/2,H*.45);c.fillText(S0.flash.m,W/2,H*.45);c.restore()}}
/* ================= ĐẨY THÙNG ================= */
function boxLoad(g){const rows=BOX_LV[g.lv][0],Hh=rows.length,Ww=Math.max(...rows.map(r=>r.length));const m={W:Ww,H:Hh,wall:[],goal:[],box:[],p:null};
 rows.forEach((r,y)=>[...r.padEnd(Ww,' ')].forEach((ch,x)=>{if(ch==='#')m.wall.push(y*Ww+x);if('.*+'.includes(ch))m.goal.push(y*Ww+x);if('$*'.includes(ch))m.box.push(y*Ww+x);if('@+'.includes(ch))m.p=y*Ww+x}));
 g.st={m,hist:[]};g.moves=0}
function boxInit(g){if(!g.st)boxLoad(g);const m=g.st.m;const R=arcCanvas(m.H/m.W);if(!R)return;g.R=R;
 let s0=null;R.cv.onpointerdown=e=>{s0=[e.clientX,e.clientY]};R.cv.onpointerup=e=>{if(!s0)return;const dx=e.clientX-s0[0],dy=e.clientY-s0[1];s0=null;if(Math.max(Math.abs(dx),Math.abs(dy))<20)return;if(Math.abs(dx)>Math.abs(dy))boxMove(dx>0?1:-1,0);else boxMove(0,dy>0?1:-1)};
 arcLoop(g,()=>{},boxDraw)}
function boxMove(dx,dy){const g=scr;if(g.k!=='arc'||g.g!=='box'||g.end||g.won)return;const m=g.st.m,d=dy*m.W+dx,np=m.p+d;if(m.wall.includes(np))return;const bi=m.box.indexOf(np);
 if(bi>=0){const nb=np+d;if(m.wall.includes(nb)||m.box.includes(nb)){try{sfx('bad')}catch(e){}return}g.st.hist.push([m.p,m.box.slice()]);m.box[bi]=nb;try{sfx('tick')}catch(e){}}else{g.st.hist.push([m.p,m.box.slice()]);try{sfx('tap')}catch(e){}}
 m.p=np;g.moves++;const e=document.getElementById('arcS');if(e)e.textContent=g.moves;
 if(m.box.every(b=>m.goal.includes(b))){g.won=true;g.score=g.lv+1;try{sfx('win')}catch(e){}setTimeout(()=>{if(scr===g)arcEnd()},900)}}
function boxUndo(){const g=scr;if(g.won||!g.st||!g.st.hist.length)return;const [p,b]=g.st.hist.pop();g.st.m.p=p;g.st.m.box=b;g.moves++;const e=document.getElementById('arcS');if(e)e.textContent=g.moves}
function boxReset(){const g=scr;if(g.won)return;boxLoad(g);const e=document.getElementById('arcS');if(e)e.textContent=0}
function boxDraw(g){const {c,W,H}=g.R,m=g.st.m,cs=W/m.W;c.fillStyle='#1F2A5A';c.fillRect(0,0,W,H);
 for(let y=0;y<m.H;y++)for(let x=0;x<m.W;x++){const k=y*m.W+x,X=x*cs,Y=y*cs;if(m.wall.includes(k))c.drawImage(arcImg('brickS'),X,Y,cs,cs);else{c.fillStyle=(x+y)%2?'#F6D98B':'#EED39A';c.fillRect(X,Y,cs,cs)}if(m.goal.includes(k))c.drawImage(arcImg('goalS'),X,Y,cs,cs)}
 m.box.forEach(k=>{const x=k%m.W,y=Math.floor(k/m.W);c.drawImage(arcImg(m.goal.includes(k)?'crateOkS':'crateS'),x*cs+cs*.06,y*cs+cs*.06,cs*.88,cs*.88)});
 const jx=m.p%m.W,jy=Math.floor(m.p/m.W),jh=cs*.92,jw=jh*16/19;c.drawImage(arcImg(typeof ofVariant==='function'&&S.st[sid].outfit?ofVariant('jenny',S.st[sid].outfit):'jenny'),jx*cs+(cs-jw)/2,jy*cs+(cs-jh)/2,jw,jh)}
addEventListener('keydown',e=>{if(!scr||scr.k!=='arc'||scr.end)return;const K={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
 if(scr.g==='box'&&K[e.key]){e.preventDefault();boxMove(...K[e.key])}else if(scr.g==='dino'&&(e.key===' '||e.key==='ArrowUp')){e.preventDefault();dinoJump()}else if(scr.g==='bowl'&&(e.key===' '||e.key==='Enter')){e.preventDefault();bowlTap()}});
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
{const _vh=viewHS;viewHS=function(){try{if(scr.k==='arc')return viewArc()}catch(e){console.error(e)}return _vh.apply(this,arguments)}}
{const _r=render;render=function(){if(scr&&scr.k!=='arc')arcStop();const a=_r.apply(this,arguments);try{if(role==='hs'&&scr.k==='arc'){document.body.classList.add('gaming');if(!scr.end)({bowl:bowlInit,box:boxInit,dino:dinoInit})[scr.g](scr)}}catch(e){console.error(e)}return a}}
try{addEventListener('resize',()=>{if(scr&&scr.k==='arc'&&!scr.end)({bowl:bowlInit,box:boxInit,dino:dinoInit})[scr.g](scr)})}catch(e){}
/* Nhà em: thêm ô Trò chơi */
{const _n=viewNha;viewNha=function(st){const r=_n.apply(this,arguments);const a=arcSt(st);const tile=`<button type="button" class="nhat" onclick="scr.ghCat='tk';go({k:'home',tab:'shop'})"><span class="nhic">${spr('joyS',40)}</span><b>${arcT('Trò chơi','Games')}</b><small>${arcT(`Còn ${a.plays} lượt`,`${a.plays} plays left`)}</small></button>`;const i=r.lastIndexOf('</div></section>');return i<0?r:r.slice(0,i)+tile+r.slice(i)}}
document.head.insertAdjacentHTML('beforeend',`<style>
.nhagrid{grid-template-columns:repeat(2,1fr)!important}
.arcbox{display:flex;flex-direction:column;gap:12px}
.arctop{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:12px;background:var(--sun-soft);box-shadow:var(--f2)}
.arctop b{display:flex;align-items:center;gap:6px;font-family:var(--f-display);font-size:24px;font-weight:400}.arctop em{font-style:normal;color:var(--coral)}.arctop small{display:block;font-size:13px;color:var(--muted)}
.arctop .gobtn{margin:0;font-size:16px!important;padding:8px 10px!important;width:auto}
.arcnote{margin:0;font-size:13px;color:var(--muted)}
.px2{box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A)}
.arcg{display:flex;gap:12px;align-items:center;padding:12px;background:var(--surface,#fff)}
.arcg .grow{min-width:0;display:flex;flex-direction:column;gap:3px}.arcg b{font-family:var(--f-display);font-size:24px;font-weight:400;line-height:1}.arcg small{font-size:13px;line-height:1.35}
.arcic{flex:none;width:52px;height:52px;display:grid;place-items:center;background:var(--sea-soft);box-shadow:var(--f2)}
.arccups{display:flex;align-items:center;gap:3px;font-family:var(--f-display);font-size:17px}.arcrare{font-size:12px;color:var(--sun-ink);font-weight:600}
.arcg .gobtn{margin:0;width:auto;flex:none;font-size:16px!important;padding:9px 10px!important}.arcg .gobtn.off{opacity:.5}.arcg .gobtn.sun{background:#FCB40C!important;color:#1F2A5A!important}
.ghit.rare{opacity:.85}.ghtag.rare{background:#FDE6DE;color:#B8320F}
.arcgame .gmid{display:flex;align-items:center;justify-content:center}.arcwrap{width:100%;display:flex;justify-content:center}.arcwrap canvas{display:block;box-shadow:var(--f2);touch-action:none;image-rendering:pixelated}
.arctip{text-align:center;font-family:var(--f-display);font-size:22px;margin:4px 0;min-height:26px}
.arcpad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:340px;margin:0 auto}
.arcpad button{border:0;padding:12px 6px;font-family:var(--f-display);font-size:22px;background:var(--surface,#fff);color:var(--ink);box-shadow:var(--f2),0 4px 0 0 var(--pxk,#1F2A5A);cursor:pointer}.arcpad button:active{transform:translateY(3px)}
.arcpad .u{font-size:24px}
</style>`);
