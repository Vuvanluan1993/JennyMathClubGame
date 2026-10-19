/* ===================== Đồ hoạ pixel (màu logo Clb) ===================== */
const PXC={k:'#1F2A5A',w:'#FFFFFF',s:'#FFD9B8',c:'#F26249',g:'#2AB563',G:'#1E8A4A',l:'#CFDB6E',o:'#F37A1F',O:'#C95A0E',y:'#FCD655',a:'#FCB40C',b:'#12B5E8',B:'#0079C1',p:'#8656A8',P:'#5E3A7A',r:'#F04A1B',R:'#B8320F',n:'#9A6234',N:'#6B3F1D',e:'#E3E7F0',E:'#9AA4C0',t:'#F6D98B',T:'#E2B85E',u:'#C8783A',m:'#C3CBDD',x:'#7FD3F0'};
const PXJ=[
"..kkk......kkk..",
".kkckk....kkckk.",
".kkkkkkkkkkkkkk.",
"..kkkkkkkkkkkk..",
".kkkkkkkkkkkkkk.",
".kkskkkkkkkkskk.",
".kssssssssssssk.",
".ksskssssssksssk",
".kscsskssksscsk.",
".kssssskksssssk.",
"..kssssssssssk..",
"...kkkkkkkkkk...",
"..sggggggggggs..",
"..sggggyyggggs..",
"...ggggyygggg...",
"...gggggggggg...",
"....kk....kk....",
"....kk....kk....",
"...ooo....ooo..."].map(r=>r.slice(0,16));
const PXJS=PXJ.map((r,i)=>i==8?".kscsssssssscsk.":i==9?".ksssskkkkssssk.":r);
const PXCAT=["k..........k","kok......kok","kook....kook","kookkkkkkook","koooooooooook","kokoooooooko k","koooocccoooo k","kkoowwwwwookk",".kooowwwooook.","..kkkkkkkkkk..","..koowwwwook..","..koowwwwookko","..koowwwwook.o","..kkkk..kkkk.."].map(r=>r.replace(/ /g,''));
const ring=(n,f)=>{const R=[];for(let j=0;j<n;j++){let s='';for(let i=0;i<n;i++){const dx=i-(n-1)/2,dy=j-(n-1)/2;s+=f(Math.hypot(dx,dy),dx,dy,n/2)||'.'}R.push(s)}return R};
const PXS={
 jenny:PXJ, jennyS:PXJS,
 cat:PXCAT,
 catH:PXCAT.map((r,i)=>i==5?"kokkoooookkok":r),
 catS:PXCAT.map((r,i)=>i==5?"kokoooooooko k".replace(/ /g,''):i==6?"kboooccccooobk":r),
 heart:[".kk.kk.","kwrkrrk","krrrrrk","krrrrrk",".krrrk.","..krk..","...k..."],
 heartE:[".kk.kk.","kwwkwwk","kwwwwwk","kwwwwwk",".kwwwk.","..kwk..","...k..."],
 heartB:[".kk.kk.","kwrkrrk","krrwrrk","krrrwrk",".krwrk.","..krk..","...k..."],
 star:["....k....","...kyk...","...kyk...","kkkkyykkk","kyyyyyyak",".kyyyyak.","..kyyak..",".kyakyak.",".kak.kak.","kk.....kk"],
 coin:["..kkkk..",".kyyyyk.","kyywyyak","kywyyyak","kyyyyyak","kyyyyaak",".kaaaak.","..kkkk.."],
 fire:["...r....","...rr...","..rrr.r.",".rrorrr.",".rooorr.","rrooyorr","rooyyoor","rooyyyor",".roooor.","..rrrr.."],
 bulb:["..kkkk..",".kyyyyk.","kyywyyyk","kywyyyyk","kyyyyyyk",".kyyyyk.","..kyyk..","..kkkk..","..kBBk..","...kk..."],
 lock:["..kkkk..",".kE..Ek.",".kE..Ek.","kkkkkkkk","kaaaaaak","kaakkaak","kaakkaak","kaaaaaak","kkkkkkkk"],
 medG:["kbbk.kbbk","kbbk.kbbk",".kbbkbbk.","..kbbbk..","..kkkkk..",".kyyyyyk.","kyywyyyak","kywyyyyak","kyyyyyyak",".kyyyyak.","..kkkkk.."],
 book:["kkkkkkkkk.","kpppppppkk","kpwwwwwpkw","kpppppppkw","kprrprrpkw","kppprpppkw","kpprprppkw","kpppppppkw","kkkkkkkkkw",".wwwwwwwww"],
 target:ring(11,(d)=>d>5?null:d>4.4?'k':d>3.2?'r':d>2?'w':d>1?'r':'k'),
 buoy:ring(12,(d,dx,dy)=>d>5.9?null:d>5.2?'k':d>2.6?((dx*dy>0)?'r':'w'):d>1.9?'k':null),
 map:["kkkkkkkkkkkk","kttkttkbbkbk","ktgktgkbbkbk","kggkttkbkbbk","ktrktrkbbkbk","kttkttkbbkbk","kgtkgtkbkkbk","kkkkkkkkkkkk"],
 bag:["...kkkkk...","..k.....k..","..k.....k..",".kkkkkkkkk.","kooooooooook","koOOOOOOOok","kooooyoooook","kooooooooook","koOOOOOOOok","kooooooooook",".kkkkkkkkkk."],
 island:["........kk.kk...",".......kgGkGgk..","......kgGgggGgk.",".........knk....",".........knk....","....kkkkknkkkk..","..kkttttttttttkk",".kttttttTttttTtk","bkkkkkkkkkkkkkkkb","bbxbbbbbxbbbbbxbb"],
 boat:["......k.........","......kk........","......kwk.......","......kwwk......","......kwwwk.....","......kwwwwk....","......kkkkkkk...",".kkkkkkkkkkkkkk.",".koooooooooook..","..koooooooook...","...kkkkkkkkk....","bxbbbbbxbbbbbxbb"],
 storm:["....kkkk........","..kkeeeekk......",".keeeeeeeekkk...","keeeeeeeeeeeek..","kEeeeeeeeeeeeEk.",".kkkkkkkkkkkkk..","....kyk..kyk....","...kyk..kyk.....","...kk...kk......"],
 fish:["....kkkk..k.","..kkbbbbkkbk",".kbwkbbbbbbk","kbbbbbbbkbbk",".kbbbbbbkkbk","..kkkkkk..k."],
 milk:[".kkkkkk.",".kwwwwk.",".kwwwwk.",".kwwwwk.","kwwwwwwk","kwwbbwwk","kwwwwwwk",".kkkkkk."],
 play:["kk......","kwkk....","kwwwkk..","kwwwwwkk","kwwwkk..","kwkk....","kk......"],
 octo:[".....kkkkkk.....","...kkppppppkk...","..kppppppppppk..",".kppppppppppppk.",".kppwwppppwwppk.",".kppwkppppkwppk.",".kpPppppppppPpk.",".kppcpkkkkpcppk.",".kppppppppppppk.",".kp.kp.kp.kp.kp.",".kp.kp.kp.kp.kp.","..k..k..k..k..k."],
 crab:[".kk..........kk.","krrk........krrk","kRrk.k....k.krRk",".krk.kwk.kwk.krk.","..kkkkwk.kwkkkk..","...krrkkkkkrrk...","..krrrrrrrrrrrk..",".krrRrrrrrrrRrrk.",".krrrrrkkrrrrrrk.","..krrrrrrrrrrrk..",".k.k.k.....k.k.k.","k.k.k.......k.k.k"],
 snake:[".........kkkk...","........kggggk..",".......kgwkgggk.",".......kggggggk.","........kgggk.rr",".........kggk...","...kkkk..kggk...","..kggggkkgggk...",".kggllggggggk...",".kgllkkkkkkk....",".kggk...........","..kk............"],
 shark:["......k.........",".....kBk........","....kBBk........","..kkkBBBkkkk....",".kBBBBBBBBBBkk.k","kBwkBBBBBBBBBkBk","kBBBBBBBBBBBBBBk","kwwwwBBBBBBBkkBk",".kwkwkwwwwwwk..k","..kkkkkkkkkk...."],
 jelly:["....kkkkkk....","..kkppppppkk..",".kppppppppppk.","kppwwppppwwppk","kppwkppppwkppk","kppppppppppppk","kpppcppppcpppk","kkkkkkkkkkkkkk",".p.c.p..p.c.p.",".c.p.c..c.p.c.",".p.c.p..p.c.p.","..c.p....p.c.."],
 dragon:["..kk......kk....",".kgk......kgk...",".kggkkkkkkggk...",".kggggggggggk...","kggwkggggwkggk..","kggggggggggggk..","kgggrrrrrrgggk..",".kggkkkkkkggk...","..kgglllllggk.kk",".kgggllllggggkgk","kggk.kllk.kgggk.","kgk..kggk..kkk..",".k...kk.kk......"],
 squid:[".......kk.......","......kcck......",".....kcccck.....","....kcccccck....","...kcccccccck...","..kccccccccccck.","..kccwwccwwcck..","..kccwkccwkcck..","..kcccccccccck..","...kkkkkkkkkk...","...ck.ck.kc.kc..","..ck..ck.kc..kc.","..k...ck.kc...k.","......k...k....."],
 palm:["...kkk..kkk.....","..kgggkkgggk....",".kgGGggggGGgk...","kgG..kggk..Ggk..",".k...knnk...k...",".....knk........",".....knnk.......","......knk.......","......knk.......","......knnk......","....kkknkkk.....","..kttttttttttk..",".kkkkkkkkkkkkkk."],
 umb:[".....kkkkkk.....","...kkrrwwrrkk...","..krrrwwwwrrrk..",".krrrwwrrwwrrrk.","kkkkkkkkkkkkkkkk",".......kk.......",".......kk.......",".......kk.......",".......kk.......","....kkkkkkkk....","..kttttttttttk..",".kkkkkkkkkkkkkk."],
 turtle:["....kkkkkk......","..kkgGgGgGkk.kk.",".kgGlGlGlGlGkssk",".kGgGgGgGgGgksk.","kkkkkkkkkkkkkk..",".ks.sk....ks.sk.",".kk.kk....kk.kk."],
 castle:[".......r........",".......rr.......",".......k........","k.k.k.kkk.k.k.k.","kkkkkkkkkkkkkkk.","ktttktttttktttk.","ktktkttkttktktk.","kttttttkttttttk.","ktttttkkkttttttk","ktttttkNktttttk.","kkkkkkkkkkkkkkk."],
 flag:[".kkkkkkkkk..",".kggggggggk.",".kgggyygggk.",".kgggyyggk..",".kggggggk...",".kkkkkkk....",".k..........",".k..........",".k..........","kkk........."],
 light:[".....kkk....","....kyyyk...","...kkkkkkk..","....kwrk....","....krwk....","...kwwrrk...","...krrwwk...","..kwwwrrrk..","..krrrwwwk..",".kkkkkkkkkk."],
 sound:["...k....","..kk.k..","kkwk..k.","kwwk.k.k","kwwk.k.k","kkwk..k.","..kk.k..","...k...."],
 mute:["...k....","..kk....","kkwk.r.r","kwwk..r.","kwwk.r.r","kkwk....","..kk....","...k...."],
};
PXS.medS=PXS.medG.map(r=>r.replace(/y/g,'m').replace(/a/g,'E'));
PXS.medB=PXS.medG.map(r=>r.replace(/y/g,'u').replace(/a/g,'N'));
PXS.islandG=PXS.island.map(r=>r.replace(/[gGtTn]/g,c=>c=='n'?'E':c=='t'||c=='T'?'e':'m').replace(/[bx]/g,'.'));
const PXURI={};
function pxURI(name){if(PXURI[name])return PXURI[name];const rows=PXS[name];const W=Math.max(...rows.map(r=>r.length)),H=rows.length;let s='';
  rows.forEach((r,j)=>{let i=0;while(i<r.length){const ch=r[i];if(!PXC[ch]){i++;continue}let e=i;while(e<r.length&&r[e]===ch)e++;s+=`<rect x="${i}" y="${j}" width="${e-i}" height="1" fill="${PXC[ch]}"/>`;i=e}});
  return PXURI[name]={u:'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges">${s}</svg>`),w:W,h:H}}
function spr(name,h,cls=''){const d=pxURI(name);return`<img class="px ${cls}" src="${d.u}" alt="" aria-hidden="true" draggable="false" style="height:${h}px;width:${Math.round(h*d.w/d.h)}px">`}
/* emoji -> sprite (hiển thị bằng em theo cỡ chữ chỗ đó) */
const PXMAP={'🔒':'lock','⛈':'storm','🏝':'island','⛵':'boat','🥉':'medB','🥈':'medS','🥇':'medG','🪙':'coin','🔥':'fire','🎯':'target','🗺':'map','🎒':'bag','📒':'book','💡':'bulb','💔':'heartB','❤':'heart','♥':'heart','★':'star','🛟':'buoy','🐙':'octo','🦀':'crab','🐍':'snake','🦈':'shark','🪼':'jelly','🐉':'dragon','🦑':'squid','🌴':'palm','⛱':'umb','🐢':'turtle','🏰':'castle','🚩':'flag','🗼':'light','😺':'catH','🐱':'cat','😿':'catS','🐟':'fish','🥛':'milk','🔊':'sound','🔇':'mute','▶':'play'};
const PXRE=new RegExp('('+Object.keys(PXMAP).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')\\uFE0F?','gu');
function pixelize(root){if(!root)return;const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode;if(!p||/^(SCRIPT|STYLE|OPTION|TEXTAREA|TITLE)$/.test(p.nodeName))return NodeFilter.FILTER_REJECT;PXRE.lastIndex=0;return PXRE.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});
  const list=[];while(tw.nextNode())list.push(tw.currentNode);
  list.forEach(n=>{const f=document.createDocumentFragment();let last=0;const v=n.nodeValue;PXRE.lastIndex=0;let m;while((m=PXRE.exec(v))){if(m.index>last)f.appendChild(document.createTextNode(v.slice(last,m.index)));const d=pxURI(PXMAP[m[1]]),im=document.createElement('img');im.className='px pxe';im.src=d.u;im.alt='';im.setAttribute('aria-hidden','true');im.style.width=(d.w/d.h*1.15).toFixed(2)+'em';f.appendChild(im);last=m.index+m[0].length}if(last<v.length)f.appendChild(document.createTextNode(v.slice(last)));n.parentNode.replaceChild(f,n)})}

