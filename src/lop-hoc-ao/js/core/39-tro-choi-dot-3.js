/* ===================== CHƠI THÊM · ĐỢT 3 (lớp 1–5) ===================== */
/* 3 trò mới, cùng khung với đợt 1–2 (startXG, viewXG, st.mg, Hồ sơ):
   mole  Đập chuột chũi    — luật của đảo (như Hứng sao), chuột thò lên cầm biển số, đập con đúng luật, 60 giây, 3 tim.
   frog  Ếch nhảy lá súng  — câu ngắn của đảo, chạm lá súng có đáp án đúng để ếch nhảy qua sông, 8 hàng, 3 tim.
   shape Ghép hình pixel   — đảo hình học: đặt đúng hình (vuông, tròn, tam giác, khối, góc…) vào chỗ trống của bức tranh, 2 tranh, 3 tim.
   Cảnh vẽ trên canvas độ phân giải thấp (×3, image-rendering: pixelated). Hồ sơ: mole → st.dd; frog, shape → st.dd + st.sk.
   Cửa hàng Jenny: thêm cho lớp 1–3 ở đảo Luyện tập/Ôn tập và bài lời văn; lớp 1 dùng tiền chẵn nghìn (1 000–10 000 đồng). */
import { hooks } from './00-hooks.js';
import { esc, pick, R } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { addCoins } from './11-sao-va-mo-khoa.js';
import { go, render } from './13-giao-dien-chung.js';
import { shuf } from './21-lop-6-che-do-tro-choi.js';
import { PXC, PXS, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { pxCanvas } from './23-bien-pixel-dong-phia-sau-ban-do.js';
import { isl1, sayJ } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { curG } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { fN, MGT } from '../content/hk1/28-chu-de-3-lop-1-5.js';
import { MG, mkQ } from './31-5-tinh-nang-choi-them-tieu-hoc.js';
import { islPool } from './32-tinh-nang-choi-them-dat-trong-tung-dao.js';
import { hurtFx, sfx } from './33b-am-thanh.js';
import { jenny } from './33d-jenny-bieu-cam.js';
import { pairFacts, stopXG, xgHash, xgHearts, XGN, xgRec, xgRule, xgTxt } from './37-tro-choi-dot-1.js';
import { xgCalc, xgNum, xgTopic, xgTxt2, xgWord } from './38-tro-choi-dot-2.js';
import { frogBg } from './39d-ech-nhay.js';
(()=>{const rows=a=>{const w=Math.max(...a.map(r=>r.length));return a.map(r=>r.padEnd(w,'.'))};
Object.assign(PXS,{
 mole:rows(["....kkkkkk....","...knnnnnnk...","..knnnnnnnnk..",".knkwnnnnkwnk.",".knkknnnnkknk.",".knnnnccnnnnk.",".knnnsccsnnnk.","knnnnsssssnnnk","knnnnswwsnnnnk","knnnnnnnnnnnnk","knNnnnnnnnnNnk","kkkkkkkkkkkkkk"]),
 moleX:rows(["....kkkkkk....","...knnnnnnk...","..knnnnnnnnk..",".knknknnknknk.",".knnknnnnknnk.",".knknknnknknk.",".knnnsccsnnnk.","knnnnsssssnnnk","knnnnskksnnnnk","knnnnnnnnnnnnk","knNnnnnnnnnNnk","kkkkkkkkkkkkkk"]),
 hammer:rows(["kkkkkkkk..","koooooOk..","koooooOk..","kOOOOOOk..","kkkkkkkk..","...knk....","...knk....","...knk....","...kNk....","...kkk...."]),
 frog:rows(["...kk.....kk....","..kwwk...kwwk...","..kwkk...kwkk...",".kggggggggggggk.","kgggggggggggggGk","kgGgggggggggGggk","kggkrrrrrrrkggk.",".kgggggggggggk..","kgGk.kggggk.kGgk","kgk...kkkk...kgk","kk............kk"]),
 frogJ:rows(["...kk.....kk....","..kwwk...kwwk...","..kwkk...kwkk...",".kggggggggggggk.","kgggggggggggggGk","kgGgggggggggGggk","kggkkkkkkkkkggk.",".kgggggggggggk..","..kgggggggggk...",".kgk.......kgk..","kgk.........kgk."]),
 pad:rows(["....kkkkkkkk....","..kkGgggggggkk..",".kGgggggk.gggGk.","kGgggggggk.ggggk","kggggggggggggGGk",".kGgggggggggGGk.","..kkGGGGGGGGkk..","....kkkkkkkk...."]),
 splashW:rows(["..b...b..b..",".bwb.bwbbwb.","..b.bwwb.b..","...bwwwwb...","..bwwwwwwb..",".bbbbbbbbbb."]),
 shapeI:rows(["kkkkk..kkk..","kbbbk.kyyyk.","kbbbk.kyyyk.","kbbbk.kyyyk.","kkkkk..kkk..","............","....kk......","...kcck.....","..kcccck....",".kcccccck...","kkkkkkkkkk.."]),
});
PXS.moleI=PXS.mole;PXS.frogI=PXS.frog;})();
Object.assign(XGN,{mole:['moleI','Đập chuột chũi','Đập chuột cầm số đúng luật, 60 giây'],frog:['frogI','Ếch nhảy lá súng','Chọn lá súng có đáp án đúng, 8 hàng'],shape:['shapeI','Ghép hình pixel','Đặt đúng hình vào bức tranh']});
const W3=['mole','frog','shape'];

/* ---------- nhận diện đảo hình học ---------- */
const XGEO=/hình vuông|hình tròn|hình tam giác|hình chữ nhật|hình phẳng|hình khối|khối lập phương|khối hộp|khối trụ|khối cầu|góc vuông|góc nhọn|góc tù|góc bẹt|hình bình hành|hình thoi|hình thang|xếp hình|lắp ghép|tứ giác|nhận biết hình|một số hình/i;
export const xgGeo=x=>XGEO.test(xgTxt2(x))||/hình phẳng|hình khối|một số hình/i.test(xgTopic(x));
export const xgGr=x=>+(String(x.id).match(/^g(\d)/)||[0,curG()])[1];

/* ---------- chọn trò cho đảo: thêm đợt 3 ---------- */
const _islOpts2v2=hooks.cu('islOpts2');
hooks.de('islOpts2',function(x){let out=[..._islOpts2v2(x)];const h=xgHash(x.id+'w3'),G=xgGr(x),t=xgTxt2(x),strictPrac=/Luyện tập|Ôn tập/i.test(t);
  const fixed=o=>o==='clock'||o==='shop'||o==='scale'||o==='shape';
  const put=(w,pref)=>{if(out.includes(w))return;if(out.length<3){out.push(w);return}
    for(const p of pref){const i=out.indexOf(p);if(i>=0){out[i]=w;return}}
    const idx=out.map((o,i)=>[o,i]).filter(([o])=>!fixed(o));if(idx.length)out[idx[h%idx.length][1]]=w};
  if(xgGeo(x))put('shape',['fish','balloon','race','train','star','pair','tug']);
  if(G<=3&&!xgGeo(x)&&!out.includes('shop')&&((strictPrac&&h%3===0)||(xgWord(x)&&h%2===0)))put('shop',['fish','balloon','race','train','pair']);
  const c=[];if(xgRule(x))c.push('mole');if(xgCalc(x)||xgNum(x)||xgWord(x))c.push('frog','frog');
  if(c.length&&h%5<3){const w=c[(h>>>3)%c.length];put(w,['fish','balloon','race'])}
  return[...new Set(out)].slice(0,3)});

/* ---------- Cửa hàng Jenny lớp 1: tiền chẵn nghìn ---------- */
{const _n=hooks.cu('shopNotes'),_p=hooks.cu('shopPrice');hooks.de('shopNotes',function(G){return G===1?[1000,2000,5000,10000]:_n.apply(this,arguments)});hooks.de('shopPrice',function(G){return G===1?R(1,10)*1000:_p.apply(this,arguments)})}

/* ---------- vẽ pixel chung ---------- */
const XZ=3;
export function xpx(ctx){return(c,x,y,w=1,h=1)=>{ctx.fillStyle=PXC[c]||c;ctx.fillRect(x,y,w,h)}}
export function xblit(ctx,name,x,y){try{ctx.drawImage(pxCanvas(name),Math.round(x),Math.round(y))}catch(e){}}
export function xcv(id){const cv=document.getElementById(id);if(!cv)return null;const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;return ctx}
export const xgRand=seed=>{let s=seed||7;return()=>(s=(s*9301+49297)%233280)/233280};

/* ---------- khung: bắt đầu, màn chơi, kết thúc ---------- */
{const _s=hooks.cu('startXG');hooks.de('startXG',function(mode,id){if(!W3.includes(mode))return _s.apply(this,arguments);try{speechSynthesis.cancel()}catch(e){}stopXG();const x=isl1(id),G=curG();
  const base={k:'xg',mode,id,score:0,lives:3,end:false,started:false,t0:Date.now()};
  if(mode==='mole'){const src=((x&&x.ti&&MGT[x.ti]&&MGT[x.ti][G])?MGT[x.ti][G]:MG[G]),r=(src.fish||src.balloon)();const fx=s=>String(s||'').replace(/^(Câu cá|Câu|Bắn bóng|Bắn|Chạm)\s+(?:con\s+cá\s+|cá\s+|quả\s+bóng\s+|bóng\s+)?/i,'Đập chuột ');
    go({...base,t:60,rule:fx(r.rule),say:'Đập chuột chũi! '+fx(r.say)});scr._r=r;return}
  if(mode==='frog'){const q=frogQ(x);go({...base,N:8,ri:0,q,bad:[],tries:0,say:'Ếch nhảy lá súng! Em chạm lá súng có đáp án đúng để ếch nhảy qua sông nhé.'});return}
  if(mode==='shape'){const set=shapeSet(x),pics=shuf(Object.keys(XSHPIC)).slice(0,2).map(k=>shapePic(k,set));go({...base,set,pics,pi:0,si:0,tries:0,N:pics.reduce((a,p)=>a+p.slots.length,0),tray:null,say:`Ghép hình pixel! Em đặt ${XSHN[pics[0].slots[0].s]} vào chỗ trống đang nhấp nháy nhé.`});scr.tray=shapeTray(scr);return}})}
export function xg3End(){const g=scr;if(g.k!=='xg'||g.end)return;stopXG();const st=S.st[sid];st.mg=st.mg||{};const key=`${g.id}:${g.mode}`;g.prev=st.mg[key]||0;st.mg[key]=Math.max(g.prev,g.score);
  g.win=g.mode==='mole'?g.lives>0:g.mode==='frog'?g.ri>=g.N:g.lives>0&&g.pi>=g.pics.length;
  g.coins=addCoins(sid,Math.min(20,g.mode==='mole'?g.score:g.score*2),'self');g.end=true;
  log(sid,'passed',`${XGN[g.mode][1]} · ${isl1(g.id).title}`,0,{success:g.win,score:{raw:g.score}});sfx(g.win?'win':g.lives<=0?'lose':'timeup');
  sayJ(g.mode==='mole'?`Em đập trúng ${g.score} chú chuột!`:g.mode==='frog'?(g.win?'Ếch đã qua sông rồi! Giỏi quá!':`Ếch nhảy được ${g.ri} hàng lá súng.`):(g.win?'Em ghép xong cả hai bức tranh rồi!':`Em đặt đúng ${g.score} hình.`));save();render()}
{const _v=hooks.cu('viewXG');hooks.de('viewXG',function(){const g=scr;if(!W3.includes(g.mode))return _v.apply(this,arguments);const st=S.st[sid],best=Math.max((st.mg||{})[`${g.id}:${g.mode}`]||0,g.score),[sp]=XGN[g.mode];
  if(g.end){const rec=g.score>(g.prev||0)&&g.score>0,line=g.mode==='mole'?`Đập trúng <b>${g.score}</b> chú chuột`:g.mode==='frog'?`Nhảy qua <b>${g.ri}</b>/${g.N} hàng lá súng`:`Đặt đúng <b>${g.score}</b>/${g.N} hình`;
    return`<div class="game g1"><div class="gend xgend"><div class="xgendrow"><span class="bigicon">${spr(sp,72)}</span>${jenny(72,g.win||g.score?'cheer':'sad')}</div><h1>${rec?'Kỷ lục mới!':g.win?'Giỏi quá!':'Hết lượt!'}</h1><p class="muted">${line} · kỷ lục ${best}</p>${g.coins?`<p class="earn">+${g.coins} xu</p>`:''}<div class="gendbtn"><button class="gobtn" type="button" onclick="startXG('${g.mode}','${g.id}')">Chơi lại</button><button class="gobtn ghost" type="button" onclick="go({k:'island',id:'${g.id}'})">Về đảo</button></div></div></div>`}
  const hearts=`<span class="hearts" id="xgl">${[0,1,2].map(i=>spr(i<g.lives?'heart':'heartE',18)).join(' ')}</span>`;
  const top=`<div class="gtop"><button class="gx" onclick="stopXG();go({k:'island',id:'${g.id}'})" aria-label="Thoát">✕</button><span class="mgsc">${spr('star',22)} <b id="xgs">${g.score}</b></span><span class="grow"></span>${g.mode==='mole'?`<span class="mgsc">${spr('clock',22)} <b id="xgt">${g.t}</b></span>`:g.mode==='frog'?`<span class="mgsc">${spr('pad',22)} <b id="xgr">${Math.min(g.ri+1,g.N)}/${g.N}</b></span>`:`<span class="mgsc">${spr('shapeI',22)} <b id="xgr">${g.pi+1}/${g.pics.length}</b></span>`}${hearts}</div>`;
  const rule=(t,say)=>`<div class="mgrule"><span>${t}</span><button class="g1spk" type="button" onclick="sayJ(${say})" aria-label="Nghe lại">🔊</button></div>`;
  if(g.mode==='mole')return`<div class="game g1 mini xg xg3">${top}${rule(g.rule,'scr.say')}<div class="xmole" id="xmf"><canvas class="xpcv" id="xmcv" width="114" height="108" aria-hidden="true"></canvas>${[0,1,2,3,4,5,6,7,8].map(i=>{const [cx,cy]=MOLEH[i];return`<div class="xmh" style="left:${(cx-16)*XZ}px;top:${(cy-30)*XZ}px"><button type="button" class="xmm" id="xmm${i}" onpointerdown="moleTap(${i},event)" aria-label="Chuột chũi" tabindex="-1"><span class="xmsign"></span><span class="xmbody">${spr('mole',56)}</span></button></div>`}).join('')}</div></div>`;
  if(g.mode==='frog'){const q=g.q;return`<div class="game g1 mini xg xg3">${top}${rule(`<span class="xfq">${q.t}</span>`,'frogSay(scr.q)')}<div class="xfrog" id="xff"><canvas class="xpcv" id="xfcv" width="114" height="100" aria-hidden="true"></canvas>
    ${q.opts.map((o,i)=>`<button type="button" class="xfpad ${g.bad.includes(i)?'sink':''}" style="left:${FROGP[i]*XZ-32}px" onclick="frogTap(${i})" ${g.bad.includes(i)?'disabled':''} aria-label="Lá súng ${esc(o)}">${spr('pad',64)}<b>${o}</b></button>`).join('')}
    <span class="xfrogj ${g.hop!=null?'hop p'+g.hop:''}" id="xfj">${spr(g.hop!=null?'frogJ':'frog',48)}</span>${g.splash!=null?`<span class="xfspl" style="left:${FROGP[g.splash]*XZ-36}px">${spr('splashW',72)}</span>`:''}
    <div class="xfprog" aria-label="Đã qua ${g.ri} hàng">${Array.from({length:g.N},(_,i)=>`<i class="${i<g.ri?'on':i===g.ri?'cur':''}"></i>`).join('')}</div></div><div id="xgfb" class="xgfb">${g.fb||''}</div></div>`}
  if(g.mode==='shape'){const p=g.pics[g.pi],sl=p&&p.slots[g.si];return`<div class="game g1 mini xg xg3">${top}${rule(g.reveal?'<b>Hoàn thành bức tranh!</b>':`Đặt <b>${XSHN[sl.s]}</b> vào chỗ trống`,'shapeSay(scr)')}<div class="xshp3"><div class="xspic ${g.reveal?'rev':''}"><canvas class="xpcv" id="xscv3" width="114" height="72" aria-hidden="true"></canvas>${!g.reveal&&sl?`<span class="xsslot" style="left:${sl.x*XZ}px;top:${sl.y*XZ}px;width:${sl.w*XZ}px;height:${sl.h*XZ}px"></span>`:''}${g.reveal?'<span class="xsdone">Tuyệt vời!</span>':''}</div>
    <div class="xstray3">${g.tray.map((k,i)=>`<button type="button" class="xstile ${g.badT&&g.badT.includes(i)?'bad':''}" onclick="shapeTap(${i})" ${g.reveal?'disabled':''} aria-label="Hình thứ ${i+1}"><canvas class="xpcv" data-shape="${k}" width="22" height="22"></canvas></button>`).join('')}</div></div><div id="xgfb" class="xgfb">${g.fb||''}</div></div>`}
  return''})}
{const _ar=hooks.cu('xgAfterRender');hooks.de('xgAfterRender',function(){const g=scr;if(g.k==='xg'&&W3.includes(g.mode)){if(g.end)return;
  if(g.mode==='mole'){moleBg();if(!g.started){g.started=true;sayJ(g.say);moleRun()}return}
  if(g.mode==='frog')frogBg();if(g.mode==='shape')shapeDraw();
  if(!g.started){g.started=true;sayJ(g.say)}return}return _ar.apply(this,arguments)})}
{const _mt=hooks.cu('musicTheme');hooks.de('musicTheme',function(){try{if(role==='hs'&&scr.k==='xg'&&W3.includes(scr.mode))return scr.end?null:({mole:'race',frog:'fish',shape:'game'})[scr.mode]}catch(e){}return _mt.apply(this,arguments)})}
function xg3Hearts(){xgHearts()}

/* ---------- 1. ĐẬP CHUỘT CHŨI ---------- */
const MOLEH=[[19,36],[57,36],[95,36],[19,66],[57,66],[95,66],[19,96],[57,96],[95,96]];
function moleBg(){const x=xcv('xmcv');if(!x)return;const p=xpx(x),rn=xgRand(13);
  for(let y=0;y<108;y++)p(y<8?'#BFE9F8':y%6<3?'g':'#33BD6C',0,y,114,1);
  p('w',8,2,10,3);p('w',10,1,6,1);p('w',80,3,12,3);p('w',83,2,6,1);
  for(let i=0;i<110;i++){const X=Math.floor(rn()*114),Y=10+Math.floor(rn()*96);p(rn()<.5?'G':'l',X,Y,1,rn()<.3?2:1)}
  /* hàng rào trên */ for(let X=0;X<114;X+=6){p('N',X,6,2,6);p('t',X,6,1,6)}p('N',0,8,114,1);
  /* hoa */ [[6,24],[106,52],[40,84],[74,22],[110,90]].forEach(([X,Y])=>{p('r',X,Y,2,2);p('y',X,Y,1,1);p('G',X,Y+2,1,2)});
  const ell=(cx,cy,rx,ry,c)=>{for(let y=-ry;y<=ry;y++)for(let X=-rx;X<=rx;X++)if((X/rx)**2+(y/ry)**2<=1)p(c,cx+X,cy+y)};
  MOLEH.forEach(([cx,cy])=>{/* gò đất + hang tròn */ ell(cx,cy+1,16,6,'k');ell(cx,cy+1,15,5,'n');ell(cx,cy,14,4,'t');ell(cx,cy+1,14,4,'n');
    ell(cx,cy,11,3,'k');ell(cx,cy+1,10,2,'#2A1A10');p('N',cx-9,cy-2,18,1);p('t',cx-15,cy+3,3,1);p('t',cx+12,cy+3,3,1)})}
function moleRun(){const g=scr;let el=0,spawnT=0,gap=850;const up={};
  const hide=(i,fast)=>{const b=document.getElementById('xmm'+i);if(b){b.classList.remove('up');b.classList.add(fast?'gone':'down')}delete up[i]};
  const spawn=()=>{const free=[0,1,2,3,4,5,6,7,8].filter(i=>!up[i]);if(!free.length||Object.keys(up).length>=3)return;const i=pick(free),it=g._r.item(),b=document.getElementById('xmm'+i);if(!b)return;
    b.classList.remove('down','gone','hitok','hitbad');b.querySelector('.xmsign').innerHTML=it.t;b.querySelector('.xmbody').innerHTML=spr('mole',56);b.dataset.ok=it.ok?'1':'0';b.dataset.done='';
    void b.offsetWidth;b.classList.add('up');up[i]={ok:it.ok,life:Math.max(1100,1800-el*12)}};
  g._moleHide=hide;g._moleUp=up;
  xgLoop={tick:setInterval(()=>{if(scr!==g||g.end)return stopXG();el+=.1;spawnT+=100;
    Object.keys(up).forEach(i=>{up[i].life-=100;if(up[i].life<=0)hide(+i)});
    if(spawnT>=gap){spawnT=0;gap=Math.max(520,850-el*6);spawn()}
    if(Math.abs(el-Math.round(el))<.05){const t=Math.max(0,60-Math.round(el));if(t!==g.t){g.t=t;const e=document.getElementById('xgt');if(e)e.textContent=t;if(t>0&&t<=5)sfx('tick');if(t<=0)xg3End()}}},100)}}
function moleTap(i,ev){const g=scr;if(ev)ev.preventDefault();if(g.k!=='xg'||g.mode!=='mole'||g.end)return;const b=document.getElementById('xmm'+i);if(!b||!b.classList.contains('up')||b.dataset.done)return;b.dataset.done='1';
  const ok=b.dataset.ok==='1';xgRec(ok);
  if(ok){g.score++;sfx('hit');setTimeout(()=>sfx('pop'),80);b.classList.add('hitok');b.querySelector('.xmbody').innerHTML=spr('moleX',56);b.insertAdjacentHTML('beforeend',`<span class="xmham">${spr('hammer',40)}</span><span class="mgfx">${spr('burst',48)}</span>`);const s=document.getElementById('xgs');if(s)s.textContent=g.score}
  else{g.lives--;sfx('bad');hurtFx(1);xgHearts();b.classList.add('hitbad');b.insertAdjacentHTML('beforeend',`<span class="mgfx">${spr('puff',44)}</span>`);if(g.lives<=0)setTimeout(xg3End,350)}
  setTimeout(()=>{b.querySelectorAll('.xmham,.mgfx').forEach(e=>e.remove());if(g._moleHide)g._moleHide(i,ok)},ok?380:520)}

/* ---------- 2. ẾCH NHẢY LÁ SÚNG ---------- */
const FROGP=[19,57,95];
export const xNum=s=>{const v=String(s).replace(/\s/g,'').replace(',','.');return /^-?\d+(\.\d+)?$/.test(v)?+v:null};
const xFmt=(v,dec)=>dec?String(Math.round(v*10**dec)/10**dec).replace('.',','):fN(v);
export function xNear(a){const v=xNum(a);if(v==null)return[];const dec=(String(a).split(',')[1]||'').length,st=dec?10**-dec:1,c=[v+st,v-st,v+2*st,v+10*st,v-10*st,v+5*st].filter(n=>n>=0&&Math.abs(n-v)>1e-9);return shuf([...new Set(c.map(n=>xFmt(n,dec)))]).filter(s=>s!==a)}
export function frogFromQ(q){if(!q||q.pic||q.big)return null;const raw=String(q.q||'');if(/<svg|<img|<canvas|<table|class="(pic|shp)/i.test(raw))return null;
  const t=xgTxt(raw);if(!t||t.length>46)return null;let a,d=[];
  if(q.type==='num'){a=fN(q.a);d=xNear(a)}
  else if(q.type==='opt'&&q.opts&&q.opts[q.a]){a=xgTxt(q.opts[q.a].h);d=q.opts.filter((_,i)=>i!==q.a).map(o=>xgTxt(o.h));if(d.some(s=>!s||s.length>9))return null}
  else return null;
  if(!a||String(a).length>9||d.length<2)return null;return{t:esc(t),ans:String(a),d:d.slice(0,2),q}}
export function frogQ(...a){return hooks.goi('frogQ',this,a)}
hooks.ham('frogQ',function(x){const pool=islPool(x);for(let i=0;i<80&&pool.length;i++){let q;try{q=mkQ(pick(pool))}catch(e){continue}const f=frogFromQ(q);if(f)return frogMk(f)}
  for(let i=0;i<20;i++){const [t,a]=pairFacts(x,1)[0]||['2 + 3','5'],d=xNear(a);if(d.length>=2)return frogMk({t:esc(t)+' = ?',ans:a,d:d.slice(0,2),q:null})}
  return frogMk({t:'2 + 3 = ?',ans:'5',d:['4','6'],q:null})});
export function frogMk(f){const opts=shuf([f.ans,...f.d]);return{...f,opts,a:opts.indexOf(f.ans)}}
export const frogSay=q=>q&&q.q&&q.q.say?q.q.say:xgTxt(q?q.t:'');

/* ---------- 3. GHÉP HÌNH PIXEL ---------- */
export const XSHN={vuong:'hình vuông',cn:'hình chữ nhật',tron:'hình tròn',tamgiac:'hình tam giác',binhhanh:'hình bình hành',thoi:'hình thoi',thang:'hình thang',gvuong:'góc vuông',gnhon:'góc nhọn',gtu:'góc tù',gbet:'góc bẹt',lapphuong:'khối lập phương',hop:'khối hộp chữ nhật',tru:'khối trụ',cau:'khối cầu'};
export const XSHC={vuong:['b','B'],cn:['o','O'],tron:['y','a'],tamgiac:['c','R'],binhhanh:['p','P'],thoi:['g','G'],thang:['x','B'],gvuong:['r','R'],gnhon:['g','G'],gtu:['b','B'],gbet:['p','P'],lapphuong:['b','B'],hop:['o','O'],tru:['c','R'],cau:['y','a']};
export function shapeSet(...a){return hooks.goi('shapeSet',this,a)}
hooks.ham('shapeSet',function(x){const t=xgTxt2(x)+' '+xgTopic(x),G=xgGr(x);
  if(G>=3&&/góc/i.test(t))return G>=4?['gvuong','gnhon','gtu','gbet']:['gvuong','gnhon','gtu'];
  if(/khối/i.test(t))return['lapphuong','hop','tru','cau'];
  if(G>=4||/bình hành|hình thoi|hình thang/i.test(t))return G>=5?['binhhanh','thoi','thang','cn','vuong','tamgiac']:['binhhanh','thoi','cn','vuong','tamgiac'];
  return G>=3?['vuong','cn','tron','tamgiac']:['vuong','tron','tamgiac','cn']});
/* tranh: các ô trống (toạ độ trên canvas 114×72) */
const XSHPIC={
 robot:{n:'Chú rô-bốt',slots:[[44,3,26,18],[38,23,38,26],[22,25,14,16],[78,25,14,16],[42,51,13,18],[59,51,13,18]],deco:'robot'},
 rocket:{n:'Tên lửa',slots:[[45,2,24,18],[45,21,24,28],[29,35,14,18],[71,35,14,18],[49,51,16,17]],deco:'rocket'},
 car:{n:'Xe ô tô',slots:[[36,8,38,18],[16,27,82,20],[22,46,20,20],[72,46,20,20],[99,30,12,12]],deco:'car'}};
function shapePic(k,set){const P=XSHPIC[k],order=shuf([...set]),slots=P.slots.map(([x,y,w,h],i)=>({x,y,w,h,s:order[i%order.length],done:false}));return{k,n:P.n,deco:P.deco,slots:shuf(slots)}}
function shapeTray(...a){return hooks.goi('shapeTray',this,a)}
hooks.ham('shapeTray',function(g){const sl=g.pics[g.pi].slots[g.si],pool=[...new Set(g.set.length>=4?g.set:[...g.set,...shapeSet({id:g.id,title:'',lesson:'',goal:'',ti:0})])].filter(k=>k!==sl.s);return shuf([sl.s,...shuf(pool).slice(0,3)])});
const shapeSay=g=>g.reveal?'Hoàn thành bức tranh!':`Em đặt ${XSHN[g.pics[g.pi].slots[g.si].s]} vào chỗ trống đang nhấp nháy nhé.`;
/* tô một hình vào khung (x,y,w,h) trên canvas pixel */
function shapeFill(...a){return hooks.goi('shapeFill',this,a)}
hooks.ham('shapeFill',function(ctx,k,X,Y,W,H,cols,ghost){const p=xpx(ctx),[c1,c2]=cols||XSHC[k]||['b','B'];
  const sq=Math.min(W,H),ox=X+Math.floor((W-sq)/2),oy=Y+Math.floor((H-sq)/2);
  const poly=(pts)=>(px,py)=>{let ins=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))ins=!ins}return ins};
  let faces=[];/* [test, màu] */
  const box=(x0,y0,w,h)=>(px,py)=>px>=x0&&px<x0+w&&py>=y0&&py<y0+h;
  if(k==='vuong')faces=[[box(ox,oy,sq,sq),c1]];
  else if(k==='cn'){const h=Math.max(4,Math.round(H*.62)),w=W;faces=[[box(X,Y+Math.floor((H-h)/2),w,h),c1]]}
  else if(k==='tron'||k==='cau'){const r=sq/2,cx=ox+r,cy=oy+r;faces=[[(px,py)=>(px+.5-cx)**2+(py+.5-cy)**2<=r*r,c1]];if(k==='cau')faces.unshift([(px,py)=>(px+.5-cx+r*.35)**2+(py+.5-cy+r*.35)**2<=(r*.28)**2,'w'],[(px,py)=>(px+.5-cx)**2+(py+.5-cy)**2<=r*r&&py>cy+r*.35,c2])}
  else if(k==='tamgiac')faces=[[poly([[X+W/2,Y],[X+W,Y+H],[X,Y+H]]),c1]];
  else if(k==='binhhanh'){const s=W*.28;faces=[[poly([[X+s,Y+H*.2],[X+W,Y+H*.2],[X+W-s,Y+H*.8],[X,Y+H*.8]]),c1]]}
  else if(k==='thoi')faces=[[poly([[X+W/2,Y],[X+W,Y+H/2],[X+W/2,Y+H],[X,Y+H/2]]),c1]];
  else if(k==='thang'){const s=W*.24;faces=[[poly([[X+s,Y+H*.2],[X+W-s,Y+H*.2],[X+W,Y+H*.85],[X,Y+H*.85]]),c1]]}
  else if(k==='lapphuong'||k==='hop'){const w=k==='hop'?W:sq,h=k==='hop'?Math.round(H*.8):sq,x0=k==='hop'?X:ox,y0=k==='hop'?Y+Math.floor((H-h)/2):oy,d=Math.max(3,Math.round(Math.min(w,h)*.3));
    faces=[[poly([[x0,y0+d],[x0+w-d,y0+d],[x0+w-d,y0+h],[x0,y0+h]]),c1],[poly([[x0,y0+d],[x0+d,y0],[x0+w,y0],[x0+w-d,y0+d]]),'w'],[poly([[x0+w-d,y0+d],[x0+w,y0],[x0+w,y0+h-d],[x0+w-d,y0+h]]),c2]]}
  else if(k==='tru'){const w=Math.round(sq*.8),x0=X+Math.floor((W-w)/2),e=Math.max(2,Math.round(w*.22)),cx=x0+w/2;
    const ell=(cy)=>(px,py)=>((px+.5-cx)/(w/2))**2+((py+.5-cy)/(e/2+.5))**2<=1;faces=[[ell(Y+e/2),'w'],[(px,py)=>(px>=x0&&px<x0+w&&py>=Y+e/2&&py<Y+H-e/2)||ell(Y+H-e/2)(px,py),c1]]}
  if(k[0]==='g'&&XSHN[k]&&k!=='g'){/* góc: hai tia dày 2 ô + dấu góc */
    const vx=X+2,vy=Y+H-3,L=Math.min(W,H)-3,ang={gvuong:90,gnhon:50,gtu:130,gbet:180}[k]*Math.PI/180;
    const ray=(a,c)=>{for(let t=0;t<=L;t+=.5){const px=Math.round(vx+t*Math.cos(a)),py=Math.round(vy-t*Math.sin(a));p('k',px,py,2,2)}};
    if(k==='gbet'){const mx=X+W/2;for(let t=-L/2;t<=L/2;t+=.5)p('k',Math.round(mx+t),vy,2,2);p(c1,Math.round(mx)-1,vy-3,3,3);return}
    if(!ghost){for(let r=3;r<6;r++)for(let a=0;a<=ang;a+=.08)p(c1,Math.round(vx+r*Math.cos(a)),Math.round(vy-r*Math.sin(a)))}
    if(k==='gvuong'&&!ghost){p(c2,vx+3,vy-5,1,3);p(c2,vx+3,vy-5,3,1)}
    ray(0);ray(ang);return}
  /* tô: viền k + mặt màu */
  const inside=(px,py)=>faces.some(([f])=>f(px,py));
  for(let py=Y;py<Y+H;py++)for(let px=X;px<X+W;px++){if(!inside(px,py))continue;const edge=!inside(px-1,py)||!inside(px+1,py)||!inside(px,py-1)||!inside(px,py+1);
    if(edge){p('k',px,py);continue}if(ghost){p((px+py)%2?'#C3CBDD':'#E3E7F0',px,py);continue}const f=faces.find(([t])=>t(px,py));p(f[1],px,py)}
  if(!ghost&&(k==='vuong'||k==='cn'||k==='tamgiac'||k==='thoi'))p('w',X+Math.floor(W/2)-2,Y+Math.floor(H/2)-2,2,1)});
function shapeDeco(ctx,deco,rev){const p=xpx(ctx),rn=xgRand(deco.length*11);
  for(let y=0;y<72;y++)p(y<58?(rev?['#FFF6D6','#FDE9B8'][Math.floor(y/29)]:['#BFE9F8','#A6DFF5'][Math.floor(y/29)]):y<60?'G':'g',0,y,114,1);
  for(let i=0;i<14;i++)p(rev?pick(['y','c','b','g','p']):'#E6F6FD',Math.floor(rn()*114),Math.floor(rn()*55),rev?2:1,rev?2:1);
  if(deco==='robot'){p('k',56,0,2,3);p('r',55,0,4,2)}
  if(deco==='rocket'){p('#9AA4C0',0,66,114,6);for(let X=4;X<114;X+=12)p('w',X,68,6,1)}
  if(deco==='car'){p('#5A6380',0,62,114,10);for(let X=2;X<114;X+=14)p('y',X,66,7,1)}}
function shapeDraw(){const g=scr,x=xcv('xscv3');if(x){const P=g.pics[Math.min(g.pi,g.pics.length-1)],p=xpx(x);shapeDeco(x,P.deco,g.reveal);
    P.slots.forEach((s,i)=>{if(s.done)shapeFill(x,s.s,s.x,s.y,s.w,s.h);else{/* chỗ trống: viền chấm */for(let X=s.x;X<s.x+s.w;X++){if(X%2===0){p('#5E6B8C',X,s.y);p('#5E6B8C',X,s.y+s.h-1)}}for(let Y=s.y;Y<s.y+s.h;Y++){if(Y%2===0){p('#5E6B8C',s.x,Y);p('#5E6B8C',s.x+s.w-1,Y)}}}});
    if(g.reveal)for(let i=0;i<40;i++)p(pick(['y','c','b','g','p','r']),R(0,113),R(0,57),1,1)}
  document.querySelectorAll('canvas[data-shape]').forEach(cv=>{const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,22,22);shapeFill(c,cv.dataset.shape,2,2,18,18)})}
function shapeTap(i){const g=scr;if(g.k!=='xg'||g.mode!=='shape'||g.end||g.lock||g.reveal)return;const P=g.pics[g.pi],sl=P.slots[g.si],k=g.tray[i],ok=k===sl.s;
  xgRec(ok,g.tries===0?{kind:'Nhận dạng hình'}:null);g.tries++;
  if(ok){if(g.tries===1)g.score++;sl.done=true;g.badT=[];g.tries=0;sfx('ok');g.fb=`<span class="ok">Đúng rồi! Đó là ${XSHN[k]}.</span>`;
    const next=P.slots.findIndex(s=>!s.done);
    if(next<0){g.reveal=1;g.lock=1;sfx('combo');setTimeout(()=>sfx('win'),200);render();setTimeout(()=>{if(scr!==g)return;g.reveal=0;g.lock=0;g.pi++;g.si=0;g.fb='';if(g.pi>=g.pics.length)return xg3End();g.tray=shapeTray(g);render();sayJ(shapeSay(g))},1500);return}
    g.si=next;g.tray=shapeTray(g);render();if(curG()<=2)sayJ(`Tiếp theo: ${XSHN[P.slots[g.si].s]}.`)}
  else{g.lives--;g.badT=[...(g.badT||[]),i];sfx('bad');hurtFx(1);g.fb=`<span class="bad">Chưa đúng. Hình này là ${XSHN[k]}.</span>`;render();if(g.lives<=0)setTimeout(xg3End,500)}}
