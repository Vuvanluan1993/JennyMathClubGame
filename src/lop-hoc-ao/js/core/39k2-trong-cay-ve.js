/* ===================== TRỒNG CÂY: đồ hoạ mới (ghi đè phần vẽ của 39k) ===================== */
/* - Jenny vẽ ngay trong cảnh (cùng lưới điểm ảnh): đứng cầm bình tưới, bước tới luống, nghiêng bình, tia nước vòng cung rơi xuống gốc,
     giọt nước bắn trên đất, rồi lùi về. Đúng thì cười và nhảy lên; sai thì mặt lo lắng.
   - Cây là nhân vật chính: luống đất to ở giữa, cây ở bậc cuối cao khoảng nửa khung. Mỗi bậc khác rõ:
     0 hạt trong hố đất · 1 mầm cong với 2 lá mầm · 2 hai lá thật · 3 cây non 4–6 lá · 4 cây cao có thân, cành (mưa + cầu vồng)
     5 nụ · 6 hoa nở · 7 quả xanh · 8 quả chín. Mỗi loài một dáng: táo/cam/xoài tán tròn hoặc thuôn, dâu tây bụi thấp, hướng dương thân cao.
   - Đổi bậc có hiệu ứng lớn lên theo nấc + lấp lánh, không đổi ngay lập tức. Mọi luật chơi, giờ, điểm, sai/ốc sên, thu hoạch giữ nguyên (39k). */
{
/* ---- quả chín cho giỏ (đẹp hơn, đúng loài) ---- */
const FR={tao:["..N..","..Ng.",".kkk.","krwrk","krrrk","kRrRk",".kkk."],
 cam:["..g..",".kkk.","kowok","koooo".replace(/o$/,'k'),"kOooOk".slice(0,5),".kkk."].map(r=>r.padEnd(5,'.').slice(0,5)),
 xoai:["...g.","..kk.",".kayk","kaaak","kaaTk","kaTTk",".kkk."],
 dau:[".GgG.","kkkkk","krwrk","krrrk",".kyk.","..k.."],
 huong:[".yay.","yNnNy","anNna","yNnNy",".yay."]};
FR.cam=["..g..",".kkk.","kowok","koook","kOoOk",".kkk."];
Object.entries(FR).forEach(([k,v])=>{PXS['plantF_'+k]=v;try{delete PXCV['plantF_'+k];delete PXURI['plantF_'+k]}catch(e){}});

/* ---- bình tưới (vòi bên phải) ---- */
const CAN=["......kkk..",".....k...k.","kkkkkkk..kk","kbbbbbk..kb","kbxbbbk.kb.","kbbbbbbkbk.","kbbbbbbbk..","kbbbbbbk...","kkkkkkkk..."];
/* ---- Jenny: đầu theo biểu cảm + thân theo tư thế ---- */
const JB={idle:["..sggggggggggs..","..sggggyyggggs..","...ggggyygggg...","...gggggggggg...","....kk....kk....","....kk....kk...."],
 walkA:["..sggggggggggs..","..sggggyyggggs..","...ggggyygggg...","...gggggggggg...","...kk......kk...","..kk........kk.."],
 walkB:["..sggggggggggs..","..sggggyyggggs..","...ggggyygggg...","...gggggggggg...",".....kk..kk.....",".....kk..kk....."],
 pour:["..sggggggggggsss","..sggggyygggg...","...ggggyygggg...","...gggggggggg...","....kk....kk....","....kk....kk...."]};
const head=m=>((m==='happy'?PXS.jennyHappy:m==='sad'?PXS.jennySad:PXS.jenny)||PXS.jenny).slice(0,12);
['idle','happy','sad'].forEach(m=>Object.keys(JB).forEach(b=>{PXS[`jw_${m}_${b}`]=[...head(m),...JB[b]]}));
const jName=(m,b)=>{const n=`jw_${m}_${b}`;try{return typeof ofVariant==='function'&&typeof jOutfit==='function'?ofVariant(n,jOutfit()):n}catch(e){return n}};

/* ---- công cụ vẽ ---- */
const COL=c=>PXC[c]||c;
function blob(p,x0,y0,x1,y1,inside,fill){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!inside(x,y))continue;const e=!inside(x-1,y)||!inside(x+1,y)||!inside(x,y-1)||!inside(x,y+1);p(e?'k':fill(x,y),x,y,1,1)}}
function ell(p,cx,cy,rx,ry,fill,wob){blob(p,Math.floor(cx-rx-2),Math.floor(cy-ry-2),Math.ceil(cx+rx+2),Math.ceil(cy+ry+2),(x,y)=>{const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry,a=Math.atan2(dy,dx);return dx*dx+dy*dy<=1+(wob?wob*Math.sin(a*7):0)},fill)}
/* lá: tâm (x,y), dài L, nghiêng hướng d (−1 trái, 1 phải), màu */
function leaf(p,x,y,L,d,C,droop){const rx=L/2,ry=Math.max(2.1,L/3),cx=x+d*rx,cy=y+(droop?1:0)-(d?0:0);
  ell(p,cx,cy,rx,ry,(X,Y)=>{if(Y===Math.round(cy)&&Math.abs(X+.5-cx)<rx-1)return C.d;return Y<cy-ry*.2&&(X+Y)%3===0?C.l:Y>cy?C.d:C.m})}
function stem(p,x,yb,yt,C,w=1,bend=0){for(let y=yb;y>=yt;y--){const t=(yb-y)/Math.max(1,yb-yt),xx=Math.round(x+bend*Math.sin(t*Math.PI*.9));p('k',xx-1,y,1,1);p(C.st,xx,y,w,1);if(w>1)p(C.stl,xx,y,1,1);p('k',xx+w,y,1,1)}}

/* ---- loài ---- */
const SPEC={tao:{rx:18,ry:14,wob:.06,m:'g',d:'G',l:'l',fr:'r',fr2:'R',bud:'#F6A6BF',pet:'#FCE1EA',ctr:'y'},
 cam:{rx:17,ry:15,wob:.05,m:'G',d:'#17663A',l:'g',fr:'o',fr2:'O',bud:'w',pet:'w',ctr:'y'},
 xoai:{rx:14,ry:18,wob:.07,m:'g',d:'G',l:'l',fr:'a',fr2:'T',bud:'#F3E3A0',pet:'#FFF2B8',ctr:'o'}};
const LEAF=(drp)=>drp?{m:'#A8C95A',d:'#7FA43F',l:'#D7E67F',st:'#7FA43F',stl:'#A8C95A'}:{m:'g',d:'G',l:'l',st:'G',stl:'g'};
const SPOTS=[[-.55,-.35],[.35,-.55],[-.1,-.7],[.62,.05],[-.68,.2],[.12,-.1],[-.3,.42],[.42,.45]];

/* vẽ cây vào ctx p (1 ô = 1 điểm ảnh của cảnh). Trả về vị trí quả để thu hoạch. hide = số quả đã hái */
function plantArt(p,cx,gy,S,sp,f,g,hide){const C=LEAF(g.droop),sway=(f>>2)%2,fruits=[];
  /* bậc 0: hố đất + hạt */
  if(S===0){p('k',cx-6,gy-1,13,1);p('N',cx-5,gy-1,11,1);p('#5A3418',cx-4,gy,9,2);p('u',cx+5,gy-3,4,2);p('k',cx+5,gy-4,4,1);p('n',cx+6,gy-3,2,1);
    const seed=sp.k==='huong'?[['k','w','k'],['k','w','k']]:[['u','t','u'],['k','u','k']];p('k',cx-2,gy-2,5,1);seed.forEach((r,j)=>r.forEach((c,i)=>p(c,cx-1+i,gy-1+j,1,1)));
    if((f>>2)%4===0){p('w',cx,gy-4,1,1)}return fruits}
  /* bậc 1: mầm cong + 2 lá mầm */
  if(S===1){p('n',cx-4,gy-1,9,1);p('k',cx-4,gy-2,2,1);p('k',cx+3,gy-2,2,1);stem(p,cx,gy-1,gy-9,C,1,1);leaf(p,cx,gy-10,7,-1,{m:'l',d:'g',l:'w'},g.droop);leaf(p,cx+2,gy-10,7,1,{m:'l',d:'g',l:'w'},g.droop);return fruits}
  const kind=sp.kind;
  if(kind==='sun'){/* hướng dương: thân cao một đường, lá to so le, bông to dần */
    const H=[0,6,12,20,30,38,42,45,46][S],top=gy-H;stem(p,cx,gy-1,top,C,2,0);
    const nL=[0,0,2,4,5,6,6,6,6][S];for(let k=0;k<nL;k++){const y=gy-4-Math.round((H-6)*(k+1)/(nL+1)),d=k%2?1:-1;leaf(p,cx+(d>0?2:-1),y,[0,0,7,8,10,10,11,11,11][S]-(k>3?2:0),d,C,g.droop)}
    if(S===2){leaf(p,cx,top-1,4,-1,C);leaf(p,cx+1,top-1,4,1,C)}
    if(S===3||S===4){p('l',cx,top-2,2,2);p('k',cx-1,top-3,4,1)}
    if(S===5){ell(p,cx+1,top-2,3.5,3,(x,y)=>(x+y)%2?'G':'g');[[-4,0],[4,0],[0,-4]].forEach(([dx,dy])=>p('G',cx+1+dx,top-2+dy,1,1));p('y',cx,top-5,2,1)}
    if(S>=6){const R=[0,0,0,0,0,0,6,8,9][S],r=[0,0,0,0,0,0,3,4,5][S],hx=cx+1,hy=top-R+1;
      for(let i=0;i<16;i++){const a=i/16*Math.PI*2+(sway?.1:0),px=hx+Math.cos(a)*(R-1.5),py=hy+Math.sin(a)*(R-1.5);ell(p,px,py,2.2,2.2,()=>i%2?'y':'a')}
      ell(p,hx,hy,r,r,(x,y)=>S===8?((x+y)%2?'N':((x*3+y)%4?'n':'k')):S===7?((x+y)%2?'n':'G'):'N');
      if(S===8)fruits.push(...[[-3,-2],[2,-3],[-2,2],[3,2],[0,0],[-4,1],[4,-1],[0,-4]].map(([a,b])=>[hx+a,hy+b]))}
    return fruits}
  if(kind==='bush'){/* dâu tây: bụi thấp, lá ba chẽ răng cưa, hoa trắng, quả đỏ có hạt */
    if(S===2){stem(p,cx,gy-1,gy-10,C);[[-1,-10],[1,-10],[0,-13]].forEach(([d,dy])=>leaf(p,cx+(d>0?1:0),gy+dy,8,d,C,g.droop))}
    else if(S===3){[[-12,-5,-1],[12,-5,1],[-6,-11,-1],[6,-11,1],[0,-15,0]].forEach(([dx,dy,d])=>{stem(p,cx+Math.round(dx/2),gy-1,gy+dy+2,C);ell(p,cx+dx,gy+dy,5.5,4,(x,y)=>(x+y)%4===0?C.l:y>gy+dy?C.d:C.m,.12)})}
    else{const W=[0,0,0,0,22,24,25,26,26][S],Hh=[0,0,0,0,11,13,14,14,14][S];
      const parts=[[-W*.6,-Hh*.4,W*.38,Hh*.6],[W*.6,-Hh*.4,W*.38,Hh*.6],[0,-Hh*.7,W*.45,Hh*.7],[-W*.3,-Hh*.95,W*.3,Hh*.5],[W*.3,-Hh*.95,W*.3,Hh*.5],[0,-Hh*.25,W*.55,Hh*.5]];
      /* hoa ở bậc 6 trên cuống cao hơn bụi */
      if(S>=6){[[-8,-Hh-8],[6,-Hh-10],[0,-Hh-14]].forEach(([dx,dy],i)=>{stem(p,cx+dx,gy-Hh+2,gy+dy+2,C)})}
      parts.forEach(([dx,dy,rx,ry],i)=>ell(p,cx+dx,gy+dy,rx,ry,(x,y)=>(x*5+y*3+sway)%9===0?C.l:y>gy+dy+ry*.3?C.d:C.m,.1));
      const sp6=[[-8,-Hh-8],[6,-Hh-10],[0,-Hh-14]];
      if(S===5)[[-10,-Hh+1],[9,-Hh],[0,-Hh-3],[-4,-Hh-1]].forEach(([dx,dy])=>{p('k',cx+dx-1,gy+dy-1,4,4);p('w',cx+dx,gy+dy,2,2);p('l',cx+dx,gy+dy+1,2,1)});
      if(S===6)sp6.forEach(([dx,dy])=>{const X=cx+dx,Y=gy+dy;[[0,-2],[2,0],[0,2],[-2,0],[1,1],[-1,-1],[1,-1],[-1,1]].forEach(([a,b])=>p('w',X+a,Y+b,1,1));p('k',X-3,Y,1,1);p('k',X+3,Y,1,1);p('k',X,Y-3,1,1);p('k',X,Y+3,1,1);p('y',X,Y,1,1)});
      if(S>=7){const B=[[-12,-2],[-6,1],[0,2],[6,1],[12,-2],[-3,-Hh+2],[4,-Hh+3],[9,-5]];B.forEach(([dx,dy],i)=>{if(S===8&&i<hide)return;const X=cx+dx,Y=gy+dy-3,c=S===7?'#D8F0B0':'r',c2=S===7?'l':'R';
        p('k',X-2,Y,5,1);p('k',X-2,Y+1,1,3);p('k',X+2,Y+1,1,3);p('k',X-1,Y+4,3,1);p('k',X,Y+5,1,1);p(c,X-1,Y+1,3,3);p(c2,X+1,Y+2,1,2);p(c,X,Y+4,1,1);p('G',X-1,Y-1,3,1);p('g',X,Y-2,1,1);
        if(S===8){p('y',X-1,Y+1,1,1);p('y',X+1,Y+3,1,1);p('w',X,Y+2,1,1)}fruits.push([X,Y+2])})}}
    return fruits}
  /* cây ăn quả */
  const T=SPEC[sp.k]||SPEC.tao;
  if(S===2){stem(p,cx,gy-1,gy-14,C);leaf(p,cx,gy-14,11,-1,C,g.droop);leaf(p,cx+1,gy-14,11,1,C,g.droop);leaf(p,cx,gy-7,7,-1,{m:'l',d:'g',l:'w'},g.droop);p('l',cx,gy-17,1,3);return fruits}
  if(S===3){stem(p,cx,gy-1,gy-26,C,2,0);[[-1,-8],[1,-12],[-1,-16],[1,-20],[-1,-24]].forEach(([d,dy],i)=>leaf(p,cx+(d>0?2:0),gy+dy,i>=3?9:11,d,C,g.droop));leaf(p,cx+1,gy-28,6,1,C,g.droop);return fruits}
  const tH=[0,0,0,0,18,21,23,24,24][S],sc=[0,0,0,0,.74,.85,.94,1,1][S],rx=Math.round(T.rx*sc),ry=Math.round(T.ry*sc),top=gy-tH,ccx=cx+(sway&&S<8?0:0),ccy=top-Math.round(ry*.45)+(g.droop?1:0);
  /* rễ + thân */ p('k',cx-4,gy-1,9,1);p('N',cx-3,gy-2,7,1);
  for(let y=gy-2;y>=top;y--){p('k',cx-2,y,1,1);p('N',cx-1,y,3,1);p('n',cx-1,y,1,1);p('k',cx+2,y,1,1)}
  /* cành lộ dưới tán */ for(let i=0;i<5;i++){p('N',cx-2-i,top+2-i,1,1);p('N',cx+2+i,top+3-i,1,1)}
  /* tán */ const mC=g.droop?'#A8C95A':T.m,dC=g.droop?'#7FA43F':T.d,lC=g.droop?'#D7E67F':T.l;
  ell(p,ccx,ccy,rx,ry,(x,y)=>{const dx=(x-ccx)/rx,dy=(y-ccy)/ry;if(dx<-.25&&dy<-.25&&(x+y)%3===0)return lC;if((x*7+y*13+sway)%17===0)return dC;return dy>.25||dx>.45?dC:mC},T.wob);
  /* cụm lá nổi */ [[-.5,-.45],[.45,-.5],[-.05,-.75]].forEach(([a,b])=>ell(p,ccx+a*rx,ccy+b*ry,rx*.32,ry*.28,(x,y)=>(x+y)%3===0?lC:mC));
  const pos=SPOTS.map(([a,b])=>[Math.round(ccx+a*rx),Math.round(ccy+b*ry)]);
  if(S===5)pos.slice(0,7).forEach(([X,Y])=>{p('k',X-1,Y-1,3,4);p(T.bud,X,Y,1,2);p('G',X,Y+2,1,1)});
  if(S===6)pos.forEach(([X,Y])=>{[[0,-1],[1,0],[0,1],[-1,0]].forEach(([a,b])=>p(T.pet,X+a,Y+b,1,1));p(T.ctr,X,Y,1,1);p('k',X-2,Y,1,1);p('k',X+2,Y,1,1);p('k',X,Y-2,1,1);p('k',X,Y+2,1,1)});
  if(S>=7)pos.forEach(([X,Y],i)=>{if(S===8&&i<hide)return;const c=S===7?'l':T.fr,c2=S===7?'G':T.fr2,mango=sp.k==='xoai';
    if(mango){p('k',X-1,Y-2,4,1);p('k',X-2,Y-1,1,4);p('k',X+2,Y-1,1,4);p('k',X-1,Y+3,3,1);p(c,X-1,Y-1,3,4);p(c2,X+1,Y+1,1,2);if(S===8){p('y',X-1,Y-1,1,1);p('o',X,Y+2,1,1)}}
    else{p('k',X-1,Y-2,3,1);p('k',X-2,Y-1,1,3);p('k',X+2,Y-1,1,3);p('k',X-1,Y+2,3,1);p(c,X-1,Y-1,3,3);p(c2,X+1,Y,1,2);if(S===8)p('w',X-1,Y-1,1,1)}
    p('N',X,Y-3,1,1);fruits.push([X,Y])});
  return fruits}

/* ---- vẽ cảnh ---- */
let PL={off:null,last:-1,growT:0,fr:[]};
const CX=62,GY=86,HOME=12,POUR=22,BKX=95,BKY=82;
plantDraw=function(){const x=xcv('xpcv');if(!x)return;const g=scr;if(!g||g.mode!=='plant')return;const p=xpx(x),now=performance.now(),f=Math.floor(now/120),S=g.stage,el=now-g.pt,sp=g.sp;
  if(!g._pl){g._pl={last:S,growT:0}}const L=g._pl;if(L.last!==S){L.prev=L.last;L.last=S;L.growT=now}
  x.clearRect(0,0,114,100);
  const sky=g.ph==='rain'?'#9DB7C9':PLANT_SKY[S];p(sky,0,0,114,60);
  if(g.ph!=='rain'){const sx=4+S*9,sy=3+Math.abs(S-4);p('k',sx-1,sy-1,9,9);p(S>=7?'o':'y',sx,sy,7,7);p(S>=7?'O':'a',sx,sy+6,7,1);p('w',sx+1,sy+1,2,1);if(f%4<2){p('y',sx-3,sy+3,1,1);p('y',sx+9,sy+3,1,1);p('y',sx+3,sy-3,1,1)}}
  if(g.rainbow&&g.ph!=='rain'){['r','o','y','g','b','p'].forEach((c,i)=>{for(let a=0;a<=Math.PI;a+=.02){const rr=44-i;p(c,Math.round(60+rr*Math.cos(a)),Math.round(60-rr*.7*Math.sin(a)),1,1)}})}
  [[(f*0.35)%150-25,7],[((f*0.22)+70)%150-25,16]].forEach(([cx,cy])=>{cx=Math.round(cx);const c=g.ph==='rain'?'#7B8FA3':'w';p(c,cx,cy,16,4);p(c,cx+4,cy-3,8,3);if(g.ph==='rain')p('#6A7D90',cx,cy+3,16,1)});
  for(let X=0;X<114;X++){const h=Math.round(5+3*Math.sin(X/11)+2*Math.sin(X/5));p('#8FD19E',X,52-h,1,h+1)}
  p('t',0,53,114,2);p('T',0,58,114,2);for(let X=2;X<114;X+=8){p('k',X,49,4,1);p('t',X,50,4,12);p('T',X+3,50,1,12);p('k',X-1,50,1,12);p('k',X+4,50,1,12)}
  p('g',0,62,114,38);p('G',0,62,114,1);for(let X=1;X<114;X+=3){const w=((X>>1)+(f>>1))%5===0?1:0;p('l',X+w,64+(X%7),1,2)}
  [[4,95],[40,97],[108,95],[110,70]].forEach(([X,Y],i)=>{const s=((f>>2)+i)%2;p('G',X,Y,1,3);p(['c','y','w','p'][i],X-1+s,Y-2,3,2)});
  /* luống đất to ở giữa */ const W=30;p('k',CX-W-1,GY-2,2*W+3,1);p('N',CX-W,GY-1,2*W+1,8);p('n',CX-W,GY-1,2*W+1,2);for(let X=CX-W+2;X<CX+W;X+=4)p('u',X,GY+2+(X%3),2,1);p('k',CX-W-1,GY-1,1,8);p('k',CX+W+1,GY-1,1,8);p('k',CX-W,GY+7,2*W+1,1);
  /* đất ướt sau khi tưới */ if((g.ph==='water'&&el>500)||(L.growT&&now-L.growT<1500)){p('#5A3418',CX-8,GY-1,17,1);p('#5A3418',CX-5,GY,11,1)}
  if(g.weed){const wx=CX+20,wy=GY-2;p('k',wx-3,wy-5,7,1);p('G',wx,wy-5,1,5);p('g',wx-2,wy-3,1,3);p('g',wx+2,wy-3,1,3);p('l',wx,wy-6,1,1);p('l',wx-2,wy-4,1,1)}
  /* cây: vẽ ra lớp riêng rồi phóng theo nấc khi vừa lớn */
  if(!PL.off){PL.off=document.createElement('canvas');PL.off.width=114;PL.off.height=100}
  const o=PL.off.getContext('2d');o.imageSmoothingEnabled=false;o.clearRect(0,0,114,100);const op=xpx(o);
  const hide=g.ph==='harvest'?Math.min(g.score,Math.floor(el/220)+1):0;PL.fr=plantArt(op,CX,GY-1,S,sp,f,g,hide);
  if(g.bitten){const b=S>=4&&sp.kind==='tree'?[CX+9,GY-36]:S>=4&&sp.kind==='bush'?[CX+12,GY-8]:S>=4?[CX-6,GY-22]:[CX+4,GY-9];o.clearRect(b[0],b[1],3,2);op('k',b[0]-1,b[1]+2,5,1)}
  const gt=now-L.growT,grow=L.growT&&gt<600&&L.prev!=null;
  x.imageSmoothingEnabled=false;
  if(grow){const s=[.8,.86,.92,.97][Math.min(3,Math.floor(gt/150))];x.save();x.translate(CX,GY-1);x.scale(s,s);x.translate(-CX,-(GY-1));x.drawImage(PL.off,0,0);x.restore()}else x.drawImage(PL.off,0,0);
  if(L.growT&&gt<1100){const r=10+Math.floor(gt/60),cy=GY-8-Math.min(30,S*4);for(let i=0;i<8;i++){const a=i/8*Math.PI*2+gt/400,X=Math.round(CX+Math.cos(a)*r),Y=Math.round(cy+Math.sin(a)*r*.7);if((i+f)%2){p('y',X,Y-1,1,3);p('y',X-1,Y,3,1);p('w',X,Y,1,1)}}}
  /* ốc sên */ if(g.ph==='nibble'){const t=Math.min(1,el/1100),sx=Math.round(114-(114-(CX+8))*t),sy=GY-2,m=(f%2);p('k',sx,sy-5,8,5);p('n',sx+1,sy-4,6,4);p('N',sx+3,sy-3,2,2);p('u',sx+2,sy-4,1,1);p('y',sx-3,sy-1,4,1);p('k',sx-3,sy-2,4,1);p('k',sx-3,sy-4-m,1,2);p('k',sx-1,sy-4,1,2)}
  /* Jenny + bình tưới */
  let jx=HOME,jy=GY-17,body='idle',mood='idle',tilt=0;
  if(g.ph==='water'){if(el<300){const t=el/300;jx=Math.round(HOME+(POUR-HOME)*t);body=Math.floor(el/80)%2?'walkA':'walkB'}else{jx=POUR;if(el<1150){body='pour';tilt=Math.min(.75,(el-300)/200*.75)}else mood='happy'}}
  else if(g.ph==='ask'&&g._pl.poured&&el<320){const t=el/320;jx=Math.round(POUR+(HOME-POUR)*t);body=Math.floor(el/80)%2?'walkA':'walkB'}
  if(g.ph==='water')g._pl.poured=1;
  if(L.growT&&gt<900){mood='happy';if(g.ph!=='water'||el>=1150){jy-=[0,2,3,2,0][Math.min(4,Math.floor(gt/120))]||0;jx=g.ph==='water'?POUR:jx}}
  if((g.ph==='ask'&&g.tries>0)||g.ph==='nibble')mood='sad';if(g.ph==='harvest')mood='happy';
  try{x.drawImage(pxCanvas(jName(mood,body)),jx,jy)}catch(e){}
  /* bình: xoay từng điểm ảnh quanh tay để giữ nét pixel */
  const hx=jx+(body==='pour'?16:14),hy=jy+(body==='pour'?12:14),A=tilt,ca=Math.cos(A),sa=Math.sin(A),ox=1,oy=3;let tip=[hx,hy];
  CAN.forEach((r,yy)=>[...r].forEach((c,xx)=>{if(c==='.')return;const dx=xx-ox,dy=yy-oy,X=Math.round(hx+dx*ca-dy*sa),Y=Math.round(hy+dx*sa+dy*ca);p(c,X,Y,1,1);if(xx===10&&yy===2)tip=[X,Y]}));
  if(body==='pour'&&el>420){const tx=CX-3,ty=GY-2,sx=tip[0]+1,sy=tip[1];for(let k=0;k<=12;k++){const t=k/12,X=Math.round(sx+(tx-sx)*t),Y=Math.round(sy+(ty-sy)*t*t);p(k%2?'x':'b',X,Y,1,1)}
    for(let i=0;i<6;i++){const t=((el/70)+i/6)%1,X=Math.round(sx+(tx-sx)*t),Y=Math.round(sy+(ty-sy)*t*t);p('w',X,Y,1,1)}
    const s=(f%3);[[-3,-2-s],[3,-1-s],[-1,-3],[2,-3+s],[-5,-1],[5,-1]].forEach(([a,b],i)=>{if((i+f)%2)p(i%2?'x':'w',tx+a,ty+b,1,1)})}
  if(g.ph==='rain'){for(let i=0;i<60;i++){const X=(i*19+f*3)%114,Y=(i*37+f*7)%62;p('#D6F2FF',X,Y,1,3)}if(f%6<3)for(let i=0;i<6;i++)p('#FFFFFF',(i*23+f)%114,GY+2,2,1)}
  [[0,40],[1,30]].forEach(([i,Y])=>{const bx=Math.round(((f*(0.6+i*.3))+i*60)%140-14),by=Y+Math.round(Math.sin((f+i*5)/3)*4),w=f%2;const c=S>=6&&i===1?'y':['c','p'][i];p(c,bx-1-w,by-1,2,2);p(c,bx+1+w,by-1,2,2);p('k',bx,by-1,1,3);if(S>=6&&i===1)p('k',bx-1,by+1,3,1)});
  /* giỏ */ p('k',BKX,BKY,17,10);p('u',BKX+1,BKY+1,15,8);for(let X=BKX+2;X<BKX+16;X+=3)p('N',X,BKY+1,1,8);p('n',BKX+1,BKY+1,15,1);p('k',BKX+3,BKY-5,1,5);p('k',BKX+13,BKY-5,1,5);p('k',BKX+3,BKY-6,11,1);
  const inB=g.ph==='harvest'?Math.min(g.score,Math.floor(el/220)):g.end?g.score:0;for(let i=0;i<Math.min(inB,8);i++)x.drawImage(pxCanvas('plantF_'+sp.k),BKX+1+(i%3)*5,BKY-4-Math.floor(i/3)*2);
  if(g.ph==='harvest'){const i=Math.floor(el/220),t=(el%220)/220;if(i<g.score){const fr=PL.fr.length?PL.fr:[[CX,GY-30]];const s0=fr[i%fr.length]||[CX,GY-30];const X=Math.round(s0[0]+(BKX+5-s0[0])*t),Y=Math.round(s0[1]+(BKY-5-s0[1])*t-Math.sin(t*Math.PI)*12);x.drawImage(pxCanvas('plantF_'+sp.k),X-2,Y-3)}}};
}
