/* ===================== BỘ MÁY TIỂU HỌC (P-15a: phần chung của js/content/hk1/24; dữ liệu lớp 1 ở content/lop-1) ===================== */
/* (cũ) LỚP 1 · CHỦ ĐỀ 1: CÁC SỐ TỪ 0 ĐẾN 10 */
/* Mỗi tiết trong Vở BT-TH Toán 1 là một đảo. Đề viết lại (đồ vật, bối cảnh, số liệu khác), giữ đúng kiến thức của tiết. */
import { hooks } from './00-hooks.js';
import { esc, fmt, pick, range } from './01-tien-ich.js';
import { hd } from './02-hanh-dong.js';
import { P1BY, P2 } from './30a-dang-ky-khoi.js';
import { blankP1, blankP2, save } from './09-du-lieu-demo.js';
import { log } from './10-su-kien-mau-xapi.js';
import { addCoins, p1Stars } from './11-sao-va-mo-khoa.js';
import { go, render, toast } from './13-giao-dien-chung.js';
import { mist, quest, shuf } from './21-lop-6-che-do-tro-choi.js';
import { PXS, pxURI, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { BIOME, biomeOf, OCEAN } from './23b-vung-bien.js';
import { curG, endFix1, endJ1, ju1, mist1Add, needOf, P2_1, PB, PI, PRIM, PT, QN, qW, viewEnd1b } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { vnRead } from './30c-cau-hoi-chung.js';
import { bossOf, PLAY } from './30d-hinh-phang-va-cau-hoi.js';
import { raceAns, TRE, treOverlay } from './31-5-tinh-nang-choi-them-tieu-hoc.js';
import { cbI, endExtra, viewEndExtra } from './32-tinh-nang-choi-them-dat-trong-tung-dao.js';
import { duck, hurtFx, sfx } from './33b-am-thanh.js';
import { bossHTML } from './33c-trum-hoat-hinh.js';
import { jenny, jMood } from './33d-jenny-bieu-cam.js';
import { jOutfit, ofVariant } from './33e-ho-chieu.js';
Object.assign(PXS,{
 apple:["....kk.gg.","....kNgGg.","..kkkNkkk.",".krrwrrrrk.","krrwrrrrrRk","krrrrrrrrRk","krrrrrrrrRk",".krrrrrrRk.","..kRrrrRk..","...kk.kk..."],
 chick:["...kkkk...","..kyyyyk..",".kyykyyyk.",".kyyyyyykoo",".kyyyyyyk..","kyyayyyyyk.","kyyaayyyak.","kyyyaaayyk.",".kyyyyyyk..","..ko..ok..."],
 balloon:["..kkkk..",".kcwcck.","kcwccccк","kccccccк","kccccccк",".kccccк.","..kccк..","...kk...","...k....","....k...","...k...."].map(r=>r.replace(/к/g,'k')),
 flower:["..k.k.k..",".kckckck.","kcccccccк","kccyyyccк","kccyyyccк",".kcccccк.","..kkkkk..","....g....","..g.g....","...gg.g..","....gGg..","....g...."].map(r=>r.replace(/к/g,'k')),
 carrot:[".....g.g",".....gg.","....kkk.","...kook.","..kooOk.","..koook.",".kooOk..",".kook...","kook....","kk......"],
 cup:["kkkkkkk..","kwbbbbk..","kbbbbbkkk","kbbwbbk.k","kbbbbbk.k","kbbbbbkkk","kbbbbbk..",".kkkkk..."],
 car:["...kkkkk....","..kwbkwbk...",".kkkkkkkkkk.","krrrrrrrrrrk","krRrrrrrrrRk","kkkkkkkkkkkk",".kek...kek..","..k.....k..."],
 bug:["..k...k..","...k.k...","..kkkkk..",".krrkrrk.","krkrkrkrk","krrrkrrrk","krkrkrkrk",".krrkrrk.","..kkkkk.."],
 ball:["..kkkk..",".kwwbbk.","kwwbbbwk","kbbbwwwk","kbwwwbbk","kwwbbbwk",".kbbwwk.","..kkkk.."],
 chest:["..kkkkkkkk..",".kooooooook.","kooooooooook","kOOOOOOOOOOk","kkkkkkkkkkkk","kaaaayyaaaak","koooykkyoook","kooooooooook","kOOOOOOOOOOk","kkkkkkkkkkkk"],
 egg:["..kkk..",".kwwwk.","kwwwwek","kwwwwek","kwwwwek",".kweek.","..kkk.."],
});
PXS.balloonB=PXS.balloon.map(r=>r.replace(/c/g,'b'));PXS.balloonP=PXS.balloon.map(r=>r.replace(/c/g,'p'));
export const OBJ1=[['apple','quả táo'],['chick','chú gà con'],['balloon','quả bóng bay'],['flower','bông hoa'],['fish','con cá'],['star','ngôi sao'],['carrot','củ cà rốt'],['cup','cái cốc'],['car','chiếc ô tô'],['bug','chú bọ rùa'],['ball','quả bóng'],['egg','quả trứng']];
export const NUMW=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín','mười'];
export const pickObj=(not)=>{let o;do{o=pick(OBJ1)}while(not&&not.includes(o[0]));return o};
export const grp=(s,n,sz=40,cls='')=>`<div class="g1grp ${cls}">${n?Array.from({length:n},()=>spr(s,sz)).join(''):'<span class="g1zero">trống</span>'}</div>`;
export const grp2=(s1,a,s2,b,sz=40)=>`<div class="g1grp">${Array.from({length:a},()=>spr(s1,sz)).join('')}${Array.from({length:b},()=>spr(s2,sz,'g1b')).join('')}</div>`;
/* hai hàng ghép đôi: mỗi đồ vật nằm trong một ô cùng bề rộng để thẳng cột, cả khung vừa màn hình 360px */
const pxAsp=s=>{try{const u=pxURI(s);return u.w/u.h}catch(e){return 1}};
export const fitH=(s,cw,maxH)=>Math.max(14,Math.min(maxH,Math.floor((cw-6)/Math.max(1,pxAsp(s)))));
export const rowPair=(s1,a,s2,b)=>{const n=Math.max(a,b,1),cw=Math.min(52,Math.floor(286/n)),h1=fitH(s1,cw,36),h2=fitH(s2,cw,36),cell=(s,h)=>`<span class="g1cell" style="width:${cw}px">${spr(s,h)}</span>`;
 return`<div class="g1rows"><div class="g1row">${Array.from({length:a},()=>cell(s1,h1)).join('')}</div><div class="g1row">${Array.from({length:b},()=>cell(s2,h2)).join('')}</div></div>`};
export const near=(n,lo,hi,k=3)=>{const s=new Set([n]);let d=1;while(s.size<k){[n-d,n+d].forEach(v=>{if(s.size<k&&v>=lo&&v<=hi)s.add(v)});d++;if(d>12)break}return shuf([...s])};
export const optN=(n,lo,hi,k=3)=>{const o=near(n,lo,hi,k);return{opts:o.map(v=>({h:String(v),v})),a:o.indexOf(n)}};
export const dice=n=>{const P={0:[],1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};return`<span class="g1dice">${range(0,8).map(i=>`<i class="${(P[n]||[]).includes(i)?'on':''}"></i>`).join('')}</span>`};
/* ---- giọng Jenny ---- */
let v1Voice=null;globalThis.v1Said='';
/* chuyển đề (có thể chứa HTML, kí hiệu toán) thành lời đọc tiếng Việt */
function spoken(t){t=String(t).normalize('NFC');
  t=t.replace(/<span class="frac"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g,' $1 phần $2 ');
  t=t.replace(/<br\s*\/?>/gi,'. ').replace(/<\/?[a-zA-Z][^<>]*>/g,' ');
  try{const d=document.createElement('textarea');d.innerHTML=t;t=d.value}catch(e){}
  t=t.replace(/\u00a0{2,}|\u00a0(?!\d{3})| {3,}/g,'. ');
  for(let i=0;i<3;i++)t=t.replace(/(\d)[ \u00a0](?=\d{3}(?!\d))/g,'$1');
  t=t.replace(/(\d),(\d)/g,'$1 phẩy $2').replace(/(\d)\s*\/\s*(\d)/g,'$1 phần $2')
   .replace(/(km|dm|cm|mm|m)²/g,(m,u)=>({km:' ki-lô-mét vuông',dm:' đề-xi-mét vuông',cm:' xăng-ti-mét vuông',mm:' mi-li-mét vuông',m:' mét vuông'})[u])
   .replace(/(km|dm|cm|mm|m)³/g,(m,u)=>({km:' ki-lô-mét khối',dm:' đề-xi-mét khối',cm:' xăng-ti-mét khối',mm:' mi-li-mét khối',m:' mét khối'})[u])
   .replace(/(\d|\?|☐)\s*(kg|km|cm|mm|dm|ml|ha|m|g|l)(?![a-zA-Zà-ỹ²³])/g,(m,d,u)=>d+' '+({kg:'ki-lô-gam',km:'ki-lô-mét',cm:'xăng-ti-mét',mm:'mi-li-mét',dm:'đề-xi-mét',ml:'mi-li-lít',ha:'héc-ta',m:'mét',g:'gam',l:'lít'})[u])
   .replace(/°C/g,' độ C').replace(/°/g,' độ').replace(/%/g,' phần trăm')
   .replace(/≥/g,' lớn hơn hoặc bằng ').replace(/≤/g,' bé hơn hoặc bằng ').replace(/≠/g,' khác ')
   .replace(/\s*>\s*/g,' lớn hơn ').replace(/\s*<\s*/g,' bé hơn ').replace(/\s*=\s*/g,' bằng ')
   .replace(/\s*×\s*/g,' nhân ')
   .replace(/(\d|\))\s*:\s*(?=[\d(☐])/g,'$1 chia ').replace(/\s*\+\s*/g,' cộng ').replace(/\s*[−–]\s*/g,' trừ ').replace(/(\d)\s+-\s+(?=\d)/g,'$1 trừ ')
   .replace(/bằng\s*\?/g,'bằng bao nhiêu').replace(/(\S)\s+(?:…|\.\.\.)\s+(?=\S)/g,(m,c)=>/[,:]/.test(c)?c+' chỗ trống ':c+' và ').replace(/(?:…|\.\.\.)(?=\s*,)/g,' chỗ trống ').replace(/☐/g,' mấy ').replace(/(^|\s)\?(?=\s+(?:cộng|trừ|nhân|chia|bằng|lớn hơn|bé hơn)(?:\s|$))/g,'$1 mấy ').replace(/(^|\s)(cộng|trừ|nhân|chia)\s+\?/g,'$1$2 mấy').replace(/…|\.\.\./g,', ').replace(/[→⟶]/g,', ');
  return t.replace(/\s+/g,' ').replace(/\s+([.,:;!?])/g,'$1').replace(/([.,])(?:\s*[.,])+/g,'$1').trim()}
/* lời đọc đầy đủ: lời Jenny + các dòng phép tính trên màn hình mà lời Jenny chưa nhắc tới */
export function sayFull(say,html){say=String(say||'');if(!html)return say;
  const lines=String(html).replace(/<span class="frac"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g,'$1/$2').split(/<\/?(?:p|li|tr|div|br|h\d|ol|ul|table)\b[^>]*>/i).map(l=>l.replace(/<\/?[a-zA-Z][^<>]*>/g,' ')).map(l=>{try{const d=document.createElement('textarea');d.innerHTML=l;return d.value}catch(e){return l}}).map(l=>l.replace(/[ \t\n\r]+/g,' ').trim()).filter(l=>/\d/.test(l)&&/[=<>+−×:…☐?]/.test(l));
  const S=say.toLowerCase().normalize('NFC'),SD=S.replace(/(\d)[  ](?=\d{3}(?!\d))/g,'$1');
  const has=n=>{const raw=n.replace(/[  ]/g,'');if(new RegExp('(^|[^\\d,])'+raw.replace(',','[,.]')+'(?![\\d])').test(SD))return true;if(raw.includes(','))return raw.split(',').every(p=>S.includes(vnRead(Number(p)))||S.includes(p));const v=Number(raw);return v<1e12&&S.includes(vnRead(v).toLowerCase())};
  const miss=[];for(const l of lines){const nums=l.match(/\d{1,3}(?:[  ]\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g)||[];if(nums.length&&!nums.every(has)&&!miss.includes(l))miss.push(l)}
  return miss.length?(say+(say?' ':'')+miss.map(l=>spoken(l)).join('. ')+'.').replace(/([.!?])\s*\.+/g,'$1'):say}
/* chọn giọng tiếng Việt tốt nhất có trên máy */
function pickViVoice(){try{const vs=speechSynthesis.getVoices().filter(v=>/^vi/i.test(v.lang)||/vietnam|tiếng việt/i.test(v.name));if(!vs.length)return null;
  let pref='';try{pref=localStorage.getItem('jennyVoice')||''}catch(e){}const byPref=vs.find(v=>v.name===pref);if(byPref)return byPref;
  const score=v=>(/natural|online/i.test(v.name)?50:0)+(/hoaimy|hoài my|namminh|nam minh/i.test(v.name)?20:0)+(/google/i.test(v.name)?40:0)+(/premium|enhanced|nâng cao/i.test(v.name)?30:0)+(/linh/i.test(v.name)?10:0)+(v.localService?0:5);
  return vs.sort((a,b)=>score(b)-score(a))[0]}catch(e){return null}}
try{speechSynthesis.onvoiceschanged=()=>{v1Voice=pickViVoice()}}catch(e){}
let viHintShown=false;
function viVoiceHint(){if(viHintShown)return;let n=0;try{n=speechSynthesis.getVoices().length}catch(e){}if(!n)return;viHintShown=true;
  const mac=/Mac/i.test(navigator.platform||navigator.userAgent),win=/Win/i.test(navigator.platform||'');
  toast(mac?'Máy chưa có giọng tiếng Việt. Vào Cài đặt hệ thống → Trợ năng → Nội dung được đọc → Giọng hệ thống → Quản lý giọng → tải "Linh". Hoặc mở bằng Chrome.':win?'Máy chưa có giọng tiếng Việt. Nên mở bằng Microsoft Edge hoặc Chrome để Jenny đọc rõ.':'Máy chưa có giọng tiếng Việt. Hãy mở bằng Chrome để Jenny đọc rõ.')}
export function sayJ(...a){return hooks.goi('sayJ',this,a)}
hooks.ham('sayJ',function(text){if(muted||!text)return;try{const s=window.speechSynthesis;if(!s)return;s.cancel();if(!v1Voice)v1Voice=pickViVoice();if(!v1Voice)viVoiceHint();const u=new SpeechSynthesisUtterance(spoken(text));u.lang='vi-VN';if(v1Voice)u.voice=v1Voice;u.rate=.9;u.pitch=1;u.onstart=()=>{try{duck(1)}catch(e){}};u.onend=u.onerror=()=>{try{duck(0)}catch(e){}};s.speak(u)}catch(e){}});
try{window.speechSynthesis&&window.speechSynthesis.addEventListener&&window.speechSynthesis.addEventListener('voiceschanged',()=>{v1Voice=null})}catch(e){}
/* ---- trạng thái ---- */
export const isl1=id=>Object.values(PRIM).flatMap(p=>p.isl).find(x=>x.id===id);
export function healAll(...a){return hooks.goi('healAll',this,a)}
hooks.ham('healAll',function(){try{Object.values(S.st||{}).forEach(st=>{if(!st.p1)st.p1={};if(st.grade<=5)ISL(st).forEach(x=>s1(st,x.id))})}catch(e){}
  /* P-15b: khối tải sau khi tạo học sinh (newStudent lúc chưa có nội dung) → điền ô còn thiếu y như blankP1/blankP2, không đụng ô đã có */
  try{Object.values(S.st||{}).forEach(st=>{st.p2=st.p2||{};if([...P2,...P2_1].some(x=>!st.p2[x.id])){const b=blankP2();for(const k in b)if(!st.p2[k])st.p2[k]=b[k]}
    const L=st.grade>=6&&P1BY[st.grade];if(L&&L.some(x=>!st.p1[x.id])){const b=blankP1(st.grade);for(const k in b)if(!st.p1[k])st.p1[k]=b[k]}})}catch(e){}});
export const s1=(st,id)=>{const x=isl1(id),s=st.p1[id]||(st.p1[id]={intro:false,m:[],fails:[]});while(s.m.length<x.nm){s.m.push(false);s.fails.push(0)}return s};
export const ISL=st=>PRIM[st.grade<=5?st.grade:1].isl;
globalThis.UNL=(()=>{try{return localStorage.getItem('jennyLockOn')!=='1'}catch(e){return true}})();
export function toggleUnl(...a){return hooks.goi('toggleUnl',this,a)}
hooks.ham('toggleUnl',function(){UNL=!UNL;try{localStorage.setItem('jennyLockOn',UNL?'0':'1')}catch(e){}render();toast(UNL?'Đã mở khóa tất cả đảo để kiểm tra':'Đã khóa lại theo tiến độ')});
export const open1=(st,k)=>{const L=ISL(st);if(k<=0||UNL)return true;const x=L[k],p=L[k-1];return x.ti!==p.ti?s1(st,p.id).m.every(Boolean):!!s1(st,p.id).m[0]};
const cur1=st=>{for(let k=0;k<ISL(st).length;k++){if(open1(st,k)&&s1(st,ISL(st)[k].id).m.some(v=>!v))return k}return ISL(st).length-1};
export function viewHome1(...a){return hooks.goi('viewHome1',this,a)}
hooks.ham('viewHome1',function(){
  const st=S.st[sid],tot=p1Stars(st),W=140,Hh=280,cur=curT1(st);
  const strip=PT().map(([name],ti)=>{const ts=topicSt1(st,ti);return`<button type="button" class="tchip ${ts.cls}${ti===cur?' on':''}" data-act="jumpT1-1" ${hd.arg(ti)} aria-label="Chủ đề ${ti+1}: ${esc(name)}"><b>${ti+1}</b><span>${ts.cls==='lock'?'🔒':ts.cls==='soon'?'…':ts.done?'✓':'★'+ts.got}</span></button>`}).join('');
  const G=curG(),secs=PT().map(([name,isl],ti)=>{const ts=topicSt1(st,ti),live=ti===cur,boss=PB()[ti],bk=biomeOf(G,ti,name),bm=BIOME[bk];
    const pts=isl.map((_,k)=>[80+k*W,k%2?165:85]);
    const path=pts.map((p,k)=>k?`Q ${p[0]-W/2} ${pts[k-1][1]===85?55:200} ${p[0]} ${p[1]}`:`M ${p[0]} ${p[1]}`).join(' ');
    let nodes;
    if(PLAY(ti)){const ck=cur1(st);const IL=PI();nodes=IL.filter(y=>y.ti===ti).map((x,j)=>{const k=IL.indexOf(x),s=s1(st,x.id),n=s.m.filter(Boolean).length,op=open1(st,k),[cx,cy]=pts[j],state=!op?'lock':n===x.nm?'done':'cur';
      return`<button class="node ${state}${k===ck&&live?' here':''}" style="left:${cx-55}px;top:${cy-50}px" ${op?`data-act="go-island-3" ${hd.arg(String(x.id))}`:`data-act="toast-2"`} aria-label="${esc(x.lesson)}, tiết ${x.tiet}${op?'':' (đang khóa)'}"><span class="ball">${spr(state==='lock'?'islandG':bm.isl,60)}${state==='lock'?spr('lock',26,'bdg'):k===ck&&live?spr(typeof ofVariant==='function'?ofVariant('jenny',jOutfit()):'jenny',34,'bdg jen'):x.boss?spr(boss[0],26,'bdg bossbdg'):state==='done'?spr('medG',24,'bdg'):''}</span><span class="lbl"><b>${j+1}. ${esc(x.short)}</b><span class="stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(x.nm-n)}</span></span></span>${k===ck&&live?'<span class="flag">Đang học</span>':x.boss&&op?'<span class="flag warn">Trùm</span>':''}</button>`}).join('')}
    else nodes=isl.map(([b,t,tt],k)=>{const [cx,cy]=pts[k],last=k===isl.length-1;return`<button class="node lock" style="left:${cx-55}px;top:${cy-50}px" data-act="toast" ${hd.arg(ts.cls==='soon'?'Chủ đề này đang được soạn.':`Hạ trùm ${PB()[ti-1][1]} ở Chủ đề ${ti} để mở.`)} aria-label="Bài ${b}, tiết ${t} (đang khóa)"><span class="ball">${spr('islandG',60)}${last?spr(boss[0],26,'bdg'):''}</span><span class="lbl"><b>B${b} · T${t}</b><small>${esc(tt)}</small></span></button>`}).join('');
    const bs=isl[0][0],be=isl[isl.length-1][0];
    return`<section class="card t1sec bm-${bk} ${ts.cls}${live?' cur':''}" id="t1_${ti}" style="padding:16px 0 8px;--bmc:${bm.band[2]};--bmd:${bm.band[3]}"><div class="secthead" style="padding:0 16px;flex-wrap:wrap;gap:6px 10px"><span class="tno">CHỦ ĐỀ ${ti+1}</span><h2>${esc(name)}</h2><span class="grow"></span>${PLAY(ti)?`<span class="muted">${PI().filter(x=>x.ti===ti).reduce((a,x)=>a+s1(st,x.id).m.filter(Boolean).length,0)}/${PI().filter(x=>x.ti===ti).reduce((a,x)=>a+x.nm,0)} ★</span>`:`<span class="pill">${ts.cls==='soon'?'Đang soạn':'Chưa mở'}</span>`}</div>
     <p class="muted" style="margin:2px 16px 6px"><span class="bmtag">${bm.ic} ${bm.n}</span> Bài ${bs}–${be} · ${isl.length} đảo · trùm ${spr(boss[0],18)} ${esc(boss[1])}</p>
     <div class="t1wrap"><div class="sea" ${live?'id="sea"':''}><div class="seain" style="width:${100+isl.length*W}px;height:${Hh}px"><canvas class="seacv" data-biome="${bk}" ${live?'data-live="1"':''} width="${100+isl.length*W}" height="${Hh}" data-isl="${JSON.stringify(pts.map(([x,y])=>[x,y-14]))}" aria-hidden="true"></canvas><svg class="route" width="${100+isl.length*W}" height="${Hh}" aria-hidden="true"><path d="${path}" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-dasharray="6 9" stroke-linecap="butt" opacity=".9"/></svg>${nodes}${live&&PLAY(ti)?treOverlay(st,pts):''}</div></div>
     ${ts.cls==='lock'||ts.cls==='soon'?`<div class="t1lock">${spr('lock',22)} <span>${ts.cls==='soon'?'Nội dung chủ đề này đang được soạn':`Hạ trùm <b>${esc(PB()[ti-1][1])}</b> ở Chủ đề ${ti} để mở`}</span></div>`:''}</div></section>${live?'<!--CARDS-->':''}`}).join('');
  return`<div class="grid" style="--oc:${OCEAN[G][1]}">
   <section class="hero sm ocean${G}" style="--oc:${OCEAN[G][1]}">${jenny(56)}<div class="grow"><span class="ocname">🌊 ${OCEAN[G][0]} · Lớp ${G}</span><h1>Chào ${esc(st.name.split(' ').pop())}!</h1><div class="chips"><span class="chip">★ <b>${tot}</b></span><span class="chip">🪙 <b>${st.coins}</b></span><button class="chip g1say" type="button" data-act="sayJ">🔊 Nghe Jenny</button></div></div></section>
   <nav class="tstrip" aria-label="Các chủ đề Toán 1">${strip}</nav>
   ${secs}</div>`;
});
function topicSt1(st,ti){const IL=PI(),L=IL.filter(x=>x.ti===ti);if(L.length){const op=open1(st,IL.indexOf(L[0])),got=L.reduce((a,x)=>a+s1(st,x.id).m.filter(Boolean).length,0),done=L.every(x=>s1(st,x.id).m.every(Boolean));return{cls:done?'done':op?'open':'lock',done,got}}
  const prev=ti>0?topicSt1(st,ti-1):{done:false};return{cls:prev.done?'soon':'lock',done:false,got:0}}
export function curT1(st){for(let i=0;i<PT().length;i++){const ts=topicSt1(st,i);if(!ts.done)return ts.cls==='open'?i:Math.max(0,i-1)}return PT().length-1}
export function jumpT1(...a){return hooks.goi('jumpT1',this,a)}
hooks.ham('jumpT1',function(ti,smooth){const el=document.getElementById('t1_'+ti);if(!el)return;const top=el.getBoundingClientRect().top+window.scrollY-(document.querySelector('.appbar')?.offsetHeight||0)-12;try{window.scrollTo({top,behavior:smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'auto'})}catch(e){window.scrollTo(0,top)}});
/* ---- trang đảo ---- */
/* ---- chơi ---- */
function startG1(...a){return hooks.goi('startG1',this,a)}
hooks.ham('startG1',function(id,L){const x=isl1(id),gens=x.lv[L],n=QN();const order=shuf(gens.map((_,i)=>i));const qs=[];let w=0,k=0;while(w<n-0.01&&qs.length<n){const gi=order[k%gens.length],q=gens[gi]();k++;qs.push({...q,src:[id,L,gi],key:`${id}:${L}:${gi}`,label:q.kind||'Câu hỏi'});w+=qW(q)}
  v1Said='';go({k:'game',g1:1,id,lv:L,qs,j:0,hearts:3,ok:0,tries:0,res:[],sheet:null,picks:[],seq:[],fill:[],used:[],cnt:0,hp:L===2?n:0,t0:Date.now()});});
export function q1(...a){return hooks.goi('q1',this,a)}
hooks.ham('q1',function(){return scr.qs[scr.j]});
/* tự co chữ đồng đều cho vừa nút; nếu quá bé thì giảm số cột */
export function fitOpts(){document.querySelectorAll('.g1opts.big').forEach(box=>{const bs=[...box.querySelectorAll('button')].filter(b=>b.textContent.trim());if(!bs.length)return;
  const bad=()=>bs.some(b=>{if(b.scrollWidth>b.clientWidth+1)return true;if(b.querySelector('.frac,svg,img'))return false;const rg=document.createRange();rg.selectNodeContents(b);return new Set([...rg.getClientRects()].map(r=>Math.round(r.top))).size>1});
  const set=v=>bs.forEach(b=>b.style.fontSize=v?v+'px':'');set(46);if(!bad())return;
  const base=46;const cols=['c4','c3','c2','c1'];
  for(;;){let f=base;set(f);while(bad()&&f>22){f-=2;set(f)}if(!bad()&&f>=(bs.length<=4?32:26))return;const c=cols.find(k=>box.classList.contains(k));const i=cols.indexOf(c);if(i<0||i>=3){if(bad())set(Math.max(16,f));return}box.classList.remove(c);box.classList.add(cols[i+1]);set(0)}})}
try{document.fonts&&document.fonts.ready.then(()=>fitOpts());addEventListener('resize',()=>fitOpts())}catch(e){}
function optLay(hs,big,def){const T=hs.map(h=>String(h).replace(/<[^>]*>/g,'').trim()),M=Math.max(0,...T.map(t=>t.length));
  const pic=hs.some(h=>/<svg|<img/.test(String(h))),wide=hs.some(h=>{const m=String(h).match(/<svg[^>]*width="([\d.]+)"/);return m&&Number(m[1])>64});
  if(hs.some(h=>/g1grp sm/.test(String(h))))return[1,''];
  if(pic&&!M)return[wide?Math.min(def,2):def,''];
  if(big){if(M<=3)return[def,''];if(M<=5)return[Math.min(def,2),''];if(M<=8)return[Math.min(def,2),'lg'];if(M<=12)return[Math.min(def,2),'xl'];return[1,M<=20?'lg':'xl']}
  if(M<=8)return[def,''];if(M<=24)return[Math.min(def,2),''];return[1,'']}
export function viewGame1(...a){return hooks.goi('viewGame1',this,a)}
hooks.ham('viewGame1',function(){
  const g=scr,x=g.race||g.tre||g.cbo?{title:g.race?'Đua giờ 60 giây':g.tre?TRE[g.tre][1]:'Trùm lớp'}:g.fix?{title:'Sổ lỗi sai'}:g.part===2?ju1(g.id):isl1(g.id),boss=!g.fix&&!(g.race||g.tre||g.cbo)&&g.part!==2&&g.lv===2,n=g.qs.length;
  if(g.end)return (g.race||g.tre||g.cbo)?viewEndExtra():viewEnd1();
  const q=q1();
  if(q.type==='slots'&&g.fill.length!==q.a.length){g.fill=q.a.map(()=>null);g.used=[]}
  if(q.type==='build'&&!g.cnt)g.cnt=q.start;
  const cbb=g.cbo?cbI(g.id):null;
  const track=g.race?`<span class="mgsc">${spr('star',22)} <b>${g.ok}</b></span><span class="grow"></span><span class="mgsc">${spr('clock',22)} <b id="rtime">${g.t}</b></span>`:cbb?`<div class="bosshp" aria-label="Máu trùm lớp"><i style="width:${cbb.hp/cbb.max*100}%"></i></div>`:boss?`<div class="bosshp" aria-label="Máu trùm ${g.hp}/${n}"><i style="width:${g.hp/n*100}%"></i></div>`:`<div class="planks" aria-label="Câu ${g.j+1}/${n}">${g.qs.map((_,k)=>`<i class="${g.res[k]===true?'ok':g.res[k]===false?'bad':k===g.j?'cur':''}"></i>`).join('')}</div>`;
  return`<div class="game g1" role="dialog" aria-label="${esc(x.title)}"><div class="gtop"><button class="gx" data-act="cancel-go" ${hd.arg(g.tre?{k:'home'}:g.race||g.cbo?{k:'island',id:g.id}:g.fix?{k:'home',tab:'fix'}:g.part===2?{k:'jenny',id:g.id}:{k:'island',id:g.id})} aria-label="Thoát">✕</button>${track}${g.race?'':g.tre?'<span class="pill acc">Kho báu</span>':g.fix?'<span class="pill acc">📒 Luyện lỗi</span>':`<span class="hearts" aria-label="Còn ${g.hearts} tim">${[0,1,2].map(i=>`<span class="${i<g.hearts?'':'lost'}">❤</span>`).join('')}</span>`}</div>
   <div class="gmid ${g.flash?'fl'+g.flash:''}">${cbb?`<div class="scene boss"><span class="monster">${bossHTML(cbb.spr,84,g.hit?'hit':g.mad?'mad':'idle',cbb.hp/cbb.max)}</span><span class="muted">${esc(cbb.name)} · ${cbb.hp}/${cbb.max} máu</span></div>`:''}${boss?`<div class="scene boss"><span class="monster">${bossHTML(bossOf(scr.id)[0],84,g.hit?'hit':g.mad?'mad':'idle',g.hp/n)}</span><span class="muted">${bossOf(scr.id)[1]}</span></div>`:''}
    <div class="g1q">${jenny(54,jMood(g))}<div class="g1bub"><div>${q.q}</div><button class="g1spk" type="button" data-act="sayJ-sayFull-q1" aria-label="Nghe lại đề">🔊</button></div></div>
    ${q.pic?`<div class="g1pic">${q.pic}</div>`:''}${q.type==='num'?`<div class="slotbox ${g.inp?'':'empty'}" aria-live="polite">${g.inp?esc(g.inp):'?'}</div>`:''}${q.type==='slots'?slotsView(q):q.type==='build'?buildView(q):q.type==='order'?`<div class="g1seq">${q.a.map((_,k)=>`<span>${g.seq[k]!==undefined?q.opts[g.seq[k]]:''}</span>`).join('')}</div>`:''}</div>
   <div class="gbot">${g.sheet?sheet1():input1(q)}</div></div>`;
});
function slotsView(q){const g=scr;let b=0;return`<div class="g1cells">${q.cells.map(v=>{if(v!==null)return`<span class="c">${v}</span>`;const i=b++;return`<button type="button" class="c slot ${g.fill[i]!==null?'full':''}" data-slot="${i}" data-act="slotTap" ${hd.arg(i)} aria-label="Ô trống ${i+1}">${g.fill[i]!==null?q.tiles[g.fill[i]]:''}</button>`}).join('')}</div>`}
function buildView(q){const g=scr;return`<div class="g1build"><div class="g1grp">${Array.from({length:g.cnt},(_,i)=>spr(q.obj,40,i>=q.start?'g1add':'')).join('')}</div></div>`}
function input1(...a){return hooks.goi('input1',this,a)}
hooks.ham('input1',function(q){const g=scr;
  if(q.type==='num')return`<div class="pad">${['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map(k=>`<button type="button" class="${k==='✓'?'go':k==='⌫'?'del':''}" data-act="key1" ${hd.arg(String(k))} aria-label="${k==='⌫'?'Xóa':k==='✓'?'Nộp':k}">${k==='✓'?'Nộp':k}</button>`).join('')}</div>`;
  if(q.type==='opt'){const [cc,sz]=optLay(q.opts.map(o=>o.h),q.big,q.cols||(q.opts.length===4?2:3));return`<div class="g1opts c${cc} ${q.big?'big':''}">${q.opts.map((o,i)=>`<button type="button" class="${sz}" data-act="ans1" ${hd.arg(i)}>${o.h}</button>`).join('')}</div>`}
  if(q.type==='tf')return`<div class="g1opts c2 big"><button type="button" class="t" data-act="ans1-2">Đúng</button><button type="button" class="f" data-act="ans1-3">Sai</button></div>`;
  const LY=q.opts?optLay(q.opts,1,q.type==='order'?4:3):[3,''],SZ=()=>LY[1];
  if(q.type==='pick')return`<div class="g1opts c${LY[0]} big">${q.opts.map((o,i)=>`<button type="button" class="${g.picks.includes(i)?'on':''} ${SZ(o)}" aria-pressed="${g.picks.includes(i)}" data-act="pick1" ${hd.arg(i)}>${o}</button>`).join('')}</div><button class="gobtn" type="button" ${g.picks.length?'':'disabled'} data-act="ans1-4">Kiểm tra</button>`;
  if(q.type==='order')return`<div class="g1opts c${LY[0]} big">${q.opts.map((o,i)=>`<button type="button" ${g.seq.includes(i)?`disabled class="used ${SZ(o)}"`:`class="${SZ(o)}"`} data-act="ord1" ${hd.arg(i)}>${o}</button>`).join('')}</div><button class="gobtn ghost" type="button" ${g.seq.length?'':'disabled'} data-act="seq-render">Xếp lại</button>`;
  if(q.type==='slots')return`<div class="g1tiles">${q.tiles.map((v,i)=>`<button type="button" class="g1tile" data-t="${i}" ${g.used.includes(i)?'disabled':''}>${v}</button>`).join('')}</div><p class="g1hint">Kéo số vào ô trống, hoặc chạm vào số.</p><button class="gobtn" type="button" ${g.fill.every(v=>v!==null)?'':'disabled'} data-act="ans1-map-q1">Kiểm tra</button>`;
  if(q.type==='build')return`<div class="g1opts c2 big"><button type="button" data-act="cnt1-1" aria-label="Bớt 1">− Bớt</button><button type="button" data-act="cnt1" aria-label="Thêm 1">+ Thêm</button></div><button class="gobtn" type="button" data-act="ans1-5">Kiểm tra</button>`;
  return'';
});
function pick1(i){const g=scr;g.picks=g.picks.includes(i)?g.picks.filter(x=>x!==i):[...g.picks,i];sfx('tap');render()}
function ord1(i){const g=scr,q=q1();if(g.seq.includes(i))return;g.seq.push(i);sfx('tap');if(g.seq.length===q.opts.length){ans1(g.seq);return}render()}
function cnt1(d){const g=scr,q=q1();g.cnt=Math.max(q.start,Math.min(10,g.cnt+d));sfx('tap');render()}
function slotTap(i){const g=scr;if(g.sheet)return;if(g.fill[i]!==null){g.used=g.used.filter(u=>u!==g.fill[i]);g.fill[i]=null;render()}}
function placeTile(t,slot){const g=scr;if(g.sheet||g.used.includes(t))return;if(slot===undefined||slot<0)slot=g.fill.indexOf(null);if(slot<0)return;if(g.fill[slot]!==null)g.used=g.used.filter(u=>u!==g.fill[slot]);g.fill[slot]=t;g.used.push(t);sfx('tap');render()}
/* kéo thả bằng ngón tay / chuột */
(function(){let drag=null;
 document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('.g1tile');if(!b||b.disabled)return;e.preventDefault();const r=b.getBoundingClientRect();const gh=b.cloneNode(true);gh.className='g1tile g1ghost';gh.style.width=r.width+'px';gh.style.height=r.height+'px';gh.style.left=r.left+'px';gh.style.top=r.top+'px';document.body.appendChild(gh);drag={t:+b.dataset.t,x0:e.clientX,y0:e.clientY,dx:e.clientX-r.left,dy:e.clientY-r.top,gh,moved:false};try{b.setPointerCapture(e.pointerId)}catch(_){}});
 document.addEventListener('pointermove',e=>{if(!drag)return;if(Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)>6)drag.moved=true;drag.gh.style.left=(e.clientX-drag.dx)+'px';drag.gh.style.top=(e.clientY-drag.dy)+'px';document.querySelectorAll('.slot.over').forEach(s=>s.classList.remove('over'));drag.gh.style.visibility='hidden';const el=document.elementFromPoint(e.clientX,e.clientY);drag.gh.style.visibility='';const s=el&&el.closest&&el.closest('.slot');if(s)s.classList.add('over')});
 const end=e=>{if(!drag)return;const d=drag;drag=null;d.gh.style.visibility='hidden';const el=document.elementFromPoint(e.clientX,e.clientY);d.gh.remove();const s=el&&el.closest&&el.closest('.slot');if(s)placeTile(d.t,+s.dataset.slot);else if(!d.moved)placeTile(d.t);};
 document.addEventListener('pointerup',end);document.addEventListener('pointercancel',e=>{if(drag){drag.gh.remove();drag=null}});
})();
export function key1(k){const g=scr;if(g.sheet)return;if(k==='⌫')g.inp=(g.inp||'').slice(0,-1);else if(k==='✓'){if(g.inp)ans1(Number(g.inp));return}else if((g.inp||'').length<9)g.inp=(g.inp||'')+k;sfx('tap');render()}
export function right1(...a){return hooks.goi('right1',this,a)}
hooks.ham('right1',function(q,v){if(q.type==='num')return Number(v)===q.a;if(q.type==='opt')return v===q.a;if(q.type==='tf'||q.type==='build')return v===q.a;if(q.type==='pick'){const a=[...v].sort((x,y)=>x-y);return a.length===q.a.length&&a.every((x,i)=>x===q.a[i])}if(q.type==='order')return v.every((x,i)=>q.opts[x]===q.opts[q.a[i]]);if(q.type==='slots')return v.every((x,i)=>x===q.a[i]);return false});
export function show1(...a){return hooks.goi('show1',this,a)}
hooks.ham('show1',function(q){if(q.type==='num')return fmt(q.a);if(q.type==='opt')return q.opts[q.a].h.length>40?'khung đúng được tô xanh':q.opts[q.a].h;if(q.type==='tf')return q.a?'Đúng':'Sai';if(q.type==='build')return q.a;return''});
export function ans1(...a){return hooks.goi('ans1',this,a)}
hooks.ham('ans1',function(v){if(scr.race){const q=q1(),ok=right1(q,v);log(sid,'answered',`Đua giờ · lớp ${curG()}`,0,{success:ok});if(!ok)mist1Add(q);raceAns(ok);return}const g=scr,q=q1(),ok=right1(q,v),st=S.st[sid],x=(g.tre||g.cbo)?{title:g.tre?'Kho báu biển':'Trùm lớp'}:g.fix?{title:'Sổ lỗi sai'}:g.part===2?ju1(g.id):isl1(g.id),qd=quest(st);let extra='';
  if(g.fix){const M=mist(st),e=M[q.key];if(ok&&e){e.streak++;if(e.streak>=2){delete M[q.key];g.fixed++;qd.fix=(qd.fix||0)+1;extra=' · Sửa xong lỗi này!'}else extra=' · Đúng thêm 1 lần nữa là sửa xong'}else if(e)e.streak=0}
  else if(!ok&&g.tries===0&&g.part!==2)mist1Add(q);
  log(sid,'answered',`Toán ${curG()} · ${x.title}`,0,{success:ok,duration:`PT${Math.round((Date.now()-g.t0)/1000)}S`});
  if(ok){if(g.cbo){const b=cbI(g.id);if(b&&!b.won){b.hp--;b.hits[sid]=(b.hits[sid]||0)+1;if(b.hp<=0){b.hp=0;b.won=true}}g.hit=true;sfx('hit')}g.ok++;qd.ok++;g.res[g.j]=g.res[g.j]===undefined?true:g.res[g.j];const c=addCoins(sid,5,'self');if(g.lv===2){g.hp--;g.hit=true;sfx('hit')}else sfx('ok');g.sheet={kind:'ok',msg:(c?`+${c} xu`:'')+extra};sayJ(pick(['Giỏi quá!','Đúng rồi!','Tuyệt vời!','Em làm đúng rồi!']))}
  else{g.tries++;if(!g.fix){g.hearts--;setTimeout(()=>hurtFx(1),30)}sfx('bad');if(g.lv===2||g.cbo){g.mad=1;g.hit=false;setTimeout(()=>sfx('bossmad'),180)}
    if(g.hearts<=0){g.res[g.j]=false;g.sheet={kind:'dead'};sayJ('Hết tim rồi. Mình chơi lại nhé!')}
    else if(g.tries===1){g.sheet={kind:'retry'};sayJ('Chưa đúng rồi. Em thử lại nhé.')}
    else{g.res[g.j]=false;g.sheet={kind:'bad'};sayJ(q.sol.replace(/&gt;/g,' lớn hơn ').replace(/&lt;/g,' bé hơn ').replace(/=/g,' bằng '))}}
  save();render()});
function sheet1(...a){return hooks.goi('sheet1',this,a)}
hooks.ham('sheet1',function(){const g=scr,q=q1(),s=g.sheet;
  if(s.kind==='ok')return`<div class="sheet ok"><div class="sh"><span class="ic">✓</span><div><b>${pick(['Giỏi quá!','Đúng rồi!','Tuyệt vời!'])}</b><div>${s.msg}</div></div></div><button class="gobtn" type="button" data-act="next1">Tiếp tục</button></div>`;
  if(s.kind==='retry')return`<div class="sheet warn"><div class="sh"><span class="ic">?</span><div><b>Chưa đúng, mất 1 tim.</b><div>Em nhìn kỹ hình và thử lại nhé.</div></div></div><button class="gobtn" type="button" data-act="retry1">Thử lại</button></div>`;
  if(s.kind==='bad')return`<div class="sheet bad"><div class="sh"><span class="ic">✕</span><div><b>Đáp án đúng${show1(q)!==''?': '+show1(q):''}</b><div>${q.sol}</div></div></div><button class="gobtn" type="button" data-act="next1">Tiếp tục</button></div>`;
  return`<div class="sheet bad"><div class="sh"><span class="ic">💔</span><div><b>Hết tim rồi!</b><div>${q.sol}</div></div></div><button class="gobtn" type="button" data-act="end1">Xem kết quả</button></div>`});
function retry1(...a){return hooks.goi('retry1',this,a)}
hooks.ham('retry1',function(){const g=scr;g.sheet=null;g.mad=0;g.inp='';g.picks=[];g.seq=[];g.fill=[];g.used=[];g.cnt=0;render()});
export function next1(...a){return hooks.goi('next1',this,a)}
hooks.ham('next1',function(){const g=scr;g.hit=false;g.mad=0;g.inp='';if(g.j<g.qs.length-1){g.j++;g.sheet=null;g.tries=0;g.picks=[];g.seq=[];g.fill=[];g.used=[];g.cnt=0;g.t0=Date.now();render()}else end1(true)});
function end1(...a){return hooks.goi('end1',this,a)}
hooks.ham('end1',function(alive){if(scr.race||scr.tre||scr.cbo)return endExtra();if(scr.fix)return endFix1();if(scr.part===2)return endJ1(alive);const g=scr,st=S.st[sid],x=isl1(g.id),s=s1(st,x.id),qd=quest(st),k=PI().indexOf(x);
  const need=needOf(g.qs.length);g.end=true;g.pass=alive&&g.hearts>0&&g.ok>=need;g.newStar=false;g.unlock=null;
  if(g.pass){qd.pass++;if(!s.m[g.lv]){s.m[g.lv]=true;g.newStar=true;log(sid,'earned',`Toán ${curG()} · ${x.title} · màn ${g.lv+1}`,0,{score:{raw:1}})}st.coins+=g.lv===2?30:10;
    if(g.lv===0&&g.newStar&&PI()[k+1])g.unlock=PI()[k+1];
    if(g.lv===2)st.badges.push({t:`Huy hiệu Chủ đề ${(x.ti||0)+1} · Toán ${curG()}`,day:S.day,from:'máy'});
    log(sid,'passed',`Toán ${curG()} · ${x.title} · màn ${g.lv+1}`,0,{success:true,score:{raw:g.ok,max:g.qs.length}});sfx(g.lv===2?'bossdown':'win');sayJ(g.lv===2?`Em đã hạ được ${bossOf(g.id)[1]}! Giỏi lắm!`:'Em qua màn rồi! Giỏi quá!')}
  else{s.fails[g.lv]=(s.fails[g.lv]||0)+1;log(sid,'failed',`Toán ${curG()} · ${x.title} · màn ${g.lv+1}`,0,{success:false});sfx('bad');sfx(scr.lv===2?'bosslaugh':'lose');sayJ('Không sao cả. Mình chơi lại nhé!')}
  save();render()});
function viewEnd1(...a){return hooks.goi('viewEnd1',this,a)}
hooks.ham('viewEnd1',function(){if(scr.fix||scr.part===2)return viewEnd1b();const g=scr,x=isl1(g.id),k=PI().indexOf(x),boss=g.lv===2,nextL=x.lv[g.lv+1]?g.lv+1:-1;
  return`<div class="game g1"><div class="gend">${g.pass?(boss?`<div class="bigicon bossend">${jenny(70,'cheer')}${bossHTML(bossOf(scr.id)[0],80,'dead')}${spr('chest',60)}</div>`:`<div class="bigicon bossend">${jenny(76,'cheer')}${spr('star',70)}</div>`):(boss?`<div class="bigicon bossend">${jenny(64,'sad')}${bossHTML(bossOf(scr.id)[0],90,'win')}</div>`:jenny(84,'sad'))}
   <h1>${g.pass?(boss?`Hạ gục ${bossOf(scr.id)[1]}!`:'Qua màn!'):'Mình chơi lại nhé!'}</h1>
   <p class="muted">${g.ok}/${g.qs.length} câu đúng · còn ${Math.max(0,g.hearts)} tim${g.pass?` · +${boss?30:10} xu`:''}</p>
   ${g.newStar?'<p class="earn">+1 sao</p>':''}${g.card?`<p class="earn">Thẻ mới: ${spr(g.card[0],28)} ${esc(g.card[1])}</p>`:''}${g.unlock?`<p class="muted">Đã mở đảo mới: <b>${esc(g.unlock.short)}</b></p>`:''}
   <div class="gendbtn">${g.pass&&nextL>0?`<button class="gobtn" type="button" data-act="startG1" ${hd.arg(String(x.id),nextL)}>${nextL===2?'Đánh trùm':'Màn '+(nextL+1)}</button>`:''}${!g.pass?`<button class="gobtn" type="button" data-act="startG1" ${hd.arg(String(x.id),g.lv)}>Chơi lại</button>`:''}${g.pass&&nextL<0&&PI()[k+1]?`<button class="gobtn" type="button" data-act="go-island-3" ${hd.arg(String(PI()[k+1].id))}>Đảo tiếp theo →</button>`:''}<button class="gobtn ghost" type="button" data-act="go-island-3" ${hd.arg(String(x.id))}>Về đảo</button><button class="gobtn ghost" type="button" data-act="go-home">Bản đồ</button></div></div></div>`});
/* đọc đề khi câu mới hiện ra */
export function g1AfterRender(...a){return hooks.goi('g1AfterRender',this,a)}
hooks.ham('g1AfterRender',function(){if(role==='hs'&&S.st[sid]&&S.st[sid].grade<=5&&scr.k==='home'&&(scr.tab||'map')==='map'&&!scr.noJump){const c=curT1(S.st[sid]);setTimeout(()=>{if(c>0)jumpT1(c);const ch=document.querySelector('.tchip.on');if(ch&&ch.parentNode)ch.parentNode.scrollLeft=ch.offsetLeft-ch.parentNode.clientWidth/2+ch.offsetWidth/2},0)}if(role!=='hs'||!S.st[sid]||S.st[sid].grade>2||scr.k!=='game'||scr.end||scr.sheet)return;const key=scr.id+scr.lv+':'+scr.j+':'+scr.t0;if(v1Said===key)return;v1Said=key;setTimeout(()=>{if(scr.k==='game'&&scr.g1&&scr.qs&&!scr.end&&!scr.sheet)sayJ(sayFull(q1().say,q1().q))},250)});

/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */
hd.dangKy({
  'cancel-go':function(event,a){try{speechSynthesis.cancel()}catch(e){};go(a[0])},
  'jumpT1-1':function(event,a){jumpT1(a[0],1)},
  'go-island-3':function(event,a){go({k:'island',id:a[0]})},
  'toast-2':function(){toast('Qua Màn 1 của đảo trước để mở đảo này nhé!')},
  'sayJ':function(){sayJ('Chào em! Mình là Jenny. Em chạm vào hòn đảo có Jenny đứng để học tiếp nhé.')},
  'sayJ-sayFull-q1':function(){sayJ(sayFull(q1().say,q1().q))},
  'slotTap':function(event,a){slotTap(a[0])},
  'key1':function(event,a){key1(a[0])},
  'ans1':function(event,a){ans1(a[0])},
  'ans1-2':function(){ans1(true)},
  'ans1-3':function(){ans1(false)},
  'pick1':function(event,a){pick1(a[0])},
  'ans1-4':function(){ans1(scr.picks)},
  'ord1':function(event,a){ord1(a[0])},
  'ans1-map-q1':function(){ans1(scr.fill.map(i=>q1().tiles[i]))},
  'cnt1-1':function(){cnt1(-1)},
  'cnt1':function(){cnt1(1)},
  'ans1-5':function(){ans1(scr.cnt)},
  'next1':function(){next1()},
  'retry1':function(){retry1()},
  'end1':function(){end1(false)},
  'startG1':function(event,a){startG1(a[0],a[1])},
});
