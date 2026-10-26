/* ===================== BỐI CẢNH SỐNG ĐỘNG CHO TRÒ CHƠI THÊM ===================== */
/* Mỗi màn chơi gắn thêm 1 lớp canvas pixel (độ phân giải thấp, phóng ×3) chỉ để trang trí: mây trôi, cỏ lay, cá bơi, sao nhấp nháy…
   Lớp này không nhận chạm (pointer-events:none), nằm dưới các vật chơi. Một bộ đếm 120 ms cho cả màn; tự dừng khi rời màn hoặc hết lượt.
   Máy bật "giảm chuyển động" thì chỉ vẽ 1 khung tĩnh. (Ếch nhảy đã có ao động riêng ở 39d.) */
import { hooks } from './00-hooks.js';
import { render } from './13-giao-dien-chung.js';
import { PXC } from './22-do-hoa-pixel-mau-logo-clb.js';
const LV={tid:0,f:0,layers:[],tok:null};
const lvReduce=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
function lvRand(s){return()=>(s=(s*9301+49297)%233280)/233280}
/* tạo lớp canvas: mode 'over' = phủ trên nền canvas của trò (các vật chơi được nâng lên trên), 'under' = nằm dưới nội dung khung */
function lvLayer(host,mode,draw,opt={}){if(!host)return null;const cv=document.createElement('canvas');cv.className='xlive '+mode+(opt.cls?' '+opt.cls:'');cv.setAttribute('aria-hidden','true');
  const Z=3,w=Math.max(1,host.clientWidth),h=Math.max(1,opt.h||host.clientHeight);cv.width=Math.ceil(w/Z);cv.height=Math.ceil(h/Z);
  if(opt.h)cv.style.height=opt.h+'px';
  if(mode==='over'){host.classList.add('xlov');const base=host.querySelector(':scope>.mgbg,:scope>.xpcv');if(base&&base.nextSibling)host.insertBefore(cv,base.nextSibling);else host.prepend(cv)}
  else if(mode==='under'){host.classList.add('xlun');host.prepend(cv)}
  else{/* strip: dải trang trí đứng riêng */host.parentNode.insertBefore(cv,host)}
  const x=cv.getContext('2d');x.imageSmoothingEnabled=false;const L={cv,x,W:cv.width,H:cv.height,draw,st:{}};L.p=(c,X,Y,ww=1,hh=1)=>{x.fillStyle=PXC[c]||c;x.fillRect(Math.round(X),Math.round(Y),ww,hh)};return L}
function lvTick(){const f=LV.f;LV.layers=LV.layers.filter(L=>L.cv.isConnected);LV.layers.forEach(L=>{L.x.clearRect(0,0,L.W,L.H);try{L.draw(L,f)}catch(e){}})}
function lvStop(){clearInterval(LV.tid);LV.tid=0;LV.layers=[]}
/* ---------- vẽ từng bối cảnh ---------- */
function lvCloud(L,X,Y,s){const p=L.p,c='#FFFFFF';p(c,X+2*s,Y,6*s,s);p(c,X,Y+s,10*s,2*s);p('#E3E7F0',X+s,Y+3*s,8*s,s)}
function lvBird(L,X,Y,f,c='#1F2A5A'){const p=L.p,up=(f>>1)%2;p(c,X,Y+(up?0:1));p(c,X+1,Y+1);p(c,X+2,Y+1+(up?-1:0)*0);p(c,X+3,Y+1);p(c,X+4,Y+(up?0:1));if(up){p(c,X-1,Y-1);p(c,X+5,Y-1)}}
const LVD={
 fish(L,f){const {p,W,H}=L,r=lvRand(7);/* tia nắng */for(let i=0;i<4;i++){const X=Math.round((i*W/4+f*.3)%(W+20))-10;L.x.globalAlpha=.10;for(let y=0;y<H*.5;y++)p('#FFFFFF',X+y*.35,y,4,1);L.x.globalAlpha=1}
  /* cá xa */ (L.st.bf=L.st.bf||[0,1,2].map(i=>({x:r()*W,y:10+i*(H*.22),v:(i%2?-1:1)*(.25+r()*.2)}))).forEach(o=>{o.x+=o.v;if(o.x>W+6)o.x=-6;if(o.x<-6)o.x=W+6;L.x.globalAlpha=.35;p('#0079C1',o.x,o.y,4,2);p('#0079C1',o.x+(o.v>0?-2:4),o.y+((f>>1)%2?0:1),2,1);L.x.globalAlpha=1});
  /* rong rêu đung đưa */ for(let i=0;i<Math.ceil(W/16);i++){const X=Math.floor(r()*W),h=8+Math.floor(r()*10);for(let k=0;k<h;k++){const s=Math.round(Math.sin((f+i*5)/5+k/4)*(k/h)*2);p(k%3?'g':'G',X+s,H-6-k,1,1)}}
  /* bong bóng nổi lên */ for(let i=0;i<6;i++){const X=Math.floor(r()*W),sp=.6+r()*.8,Y=H-((f*sp+r()*H)%H);p('#FFFFFF',X+((f>>2)+i)%2,Y,2,2);p('#7FD3F0',X+((f>>2)+i)%2,Y+2,2,1)}},
 balloon(L,f){const {p,W,H}=L,r=lvRand(9);/* mặt trời + tia */const sx=W-14,sy=10;p('a',sx-4,sy-4,9,9);p('y',sx-3,sy-3,7,7);for(let k=0;k<8;k++){const a=k*Math.PI/4+f*.05,d=8+((f>>2)+k)%2;p('y',sx+Math.cos(a)*d,sy+Math.sin(a)*d,1,1)}
  /* mây 2 lớp */ for(let i=0;i<3;i++)lvCloud(L,((i*W/3+f*.15)%(W+30))-20,8+i*14,1);for(let i=0;i<2;i++)lvCloud(L,((i*W/2+f*.4)%(W+40))-30,H*.35+i*18,2);
  /* chim */ for(let i=0;i<3;i++){const X=((f*.6+i*40)%(W+20))-10,Y=20+i*7+Math.round(Math.sin((f+i*7)/6)*2);lvBird(L,X,Y,f+i)}
  /* cỏ, cây dưới chân */ p('G',0,H-6,W,6);p('g',0,H-5,W,5);for(let X=0;X<W;X+=3){const w=((X>>1)+(f>>1))%4===0?1:0;p('l',X+w,H-8,1,2)}
  for(let i=0;i<3;i++){const X=Math.floor(r()*(W-12))+4,s=Math.round(Math.sin((f+i*9)/7));p('N',X+3,H-14,2,8);p('G',X+s,H-20,8,6);p('g',X+1+s,H-21,6,2)}},
 star(L,f){const {p,W,H}=L,r=lvRand(11);/* sao nhấp nháy */for(let i=0;i<40;i++){const X=Math.floor(r()*W),Y=Math.floor(r()*H*.8),ph=Math.floor(r()*8);const on=(f+ph)%8;if(on<2){p('#FFFFFF',X,Y,1,1);p('#FCD655',X-1,Y);p('#FCD655',X+1,Y);p('#FCD655',X,Y-1);p('#FCD655',X,Y+1)}else if(on<5)p('#FCD655',X,Y,1,1)}
  /* sao băng */ const k=f%70;if(k<10){const X=W*.2+k*5,Y=6+k*2;for(let t=0;t<6;t++){L.x.globalAlpha=1-t/6;p('#FFFFFF',X-t*2,Y-t,2,1)}L.x.globalAlpha=1}
  /* đồi xa */ for(let X=0;X<W;X++){const h=Math.round(8+Math.sin(X/9)*3+Math.sin(X/4)*1);p('#2E2457',X,H-h,1,h)}for(let X=0;X<W;X++){const h=Math.round(4+Math.sin(X/6+2)*2);p('#221A44',X,H-h,1,h)}
  /* đom đóm */ for(let i=0;i<6;i++){const X=(r()*W+Math.sin((f+i*13)/9)*6+f*.1*(i%2?1:-1)+W)%W,Y=H*.55+r()*H*.3+Math.cos((f+i*5)/7)*3;if((f+i*3)%6<4){p('#FCD655',X,Y,1,1);L.x.globalAlpha=.4;p('#FCD655',X-1,Y-1,3,3);L.x.globalAlpha=1}}},
 mole(L,f){const {p,W,H}=L,r=lvRand(13);/* mây trôi trên trời */for(let i=0;i<2;i++)lvCloud(L,((i*W/2+f*.25)%(W+30))-20,1,1);
  /* cỏ lay */ for(let i=0;i<40;i++){const X=Math.floor(r()*W),Y=12+Math.floor(r()*(H-14)),w=((i+(f>>1))%4===0)?1:0;p('G',X+w,Y-2,1,2);p('l',X,Y,1,1)}
  /* hoa đung đưa */ for(let i=0;i<7;i++){const X=Math.floor(r()*(W-4))+2,Y=14+Math.floor(r()*(H-18)),s=Math.round(Math.sin((f+i*4)/5));p('G',X,Y,1,3);const c=['c','y','w','p'][i%4];p(c,X-1+s,Y-2,3,1);p(c,X+s,Y-3,1,3);p('a',X+s,Y-2,1,1)}
  /* bướm bay */ for(let i=0;i<2;i++){const X=((f*.7+i*W/2)%(W+10))-5,Y=20+i*30+Math.round(Math.sin((f+i*9)/4)*5),o=(f>>1)%2;const c=i?'#F26249':'#FCB40C';p('k',X+1,Y,1,3);p(c,X-1+(o?1:0),Y,2,2);p(c,X+2-(o?1:0)*0,Y,2,2);if(!o){p(c,X-2,Y-1,2,2);p(c,X+3,Y-1,2,2)}}},
 shape(L,f){const {p,W,H}=L;/* mây + mặt trời nhịp đập trên trời, vạch đường chạy dưới tranh */const sx=8,sy=7,b=(f>>2)%2;L.x.globalAlpha=.5;p('y',sx-4-b,sy-4-b,9+2*b,9+2*b);L.x.globalAlpha=1;
  for(let i=0;i<2;i++)lvCloud(L,((i*W/2+f*.3)%(W+30))-20,3+i*6,1);
  const ry=Math.round(H*.86);for(let X=-8;X<W+8;X+=10)p('#FFFFFF',X+((f*1.5)%10),ry,5,1);
  [[W*.1,ry-10],[W*.9,ry-10]].forEach(([X,Y],i)=>{p('N',X,Y,1,9);const w=(f>>1)%2;p(i?'r':'b',X+1,Y,4-w,3);p(i?'r':'b',X+1,Y,4,2-w)})},
 scale(L,f){const {p,W,H}=L;/* tường + cửa sổ có mây + chậu cây treo + đèn trần đung đưa */p('#FFF6D6',0,0,W,H);for(let y=0;y<H;y+=6)p('#F6EBC4',0,y,W,1);
  const wx=6,wy=6,ww=26,wh=18;p('k',wx-1,wy-1,ww+2,wh+2);p('#BFE9F8',wx,wy,ww,wh);L.x.save();L.x.beginPath();L.x.rect(wx,wy,ww,wh);L.x.clip();lvCloud(L,wx+((f*.2)%(ww+14))-12,wy+4,1);L.x.restore();p('k',wx+ww/2,wy,1,wh);p('k',wx,wy+wh/2,ww,1);
  const lx=W/2,sw=Math.round(Math.sin(f/8)*3);p('k',lx,0,1,6);p('k',lx+sw*.5,6,1,3);p('a',lx-4+sw,9,9,4);p('y',lx-3+sw,13,7,1);L.x.globalAlpha=.15;p('y',lx-10+sw,14,21,8);L.x.globalAlpha=1;
  const px=W-14,s2=Math.round(Math.sin(f/6)*1.5);p('k',px+3,0,1,7);p('u',px+s2,7,8,5);p('k',px+s2,7,8,1);for(let k=0;k<4;k++){p('g',px-2+s2+k*3,4-((f>>2)+k)%2,2,4);p('G',px-3+s2+k*3,10+k%2,1,4)}
  /* sàn */ p('#E2B85E',0,H-4,W,4);for(let X=0;X<W;X+=8)p('#C8783A',X,H-4,1,4)},
 shop(L,f){const {p,W,H}=L;/* mái hiên sọc đỏ trắng bay phấp phới + chim nhỏ đậu, chớp mắt */for(let X=0;X<W;X++){const c=Math.floor(X/6)%2?'#FFFFFF':'#F04A1B';p(c,X,0,1,5);const wv=Math.round(1+Math.sin(X/3+f/2));p(c,X,5,1,wv+1)}
  p('k',0,0,W,1);const bx=W-16+((f>>4)%2),by=0;p('#12B5E8',bx,by+0,4,3);p('#0079C1',bx+3,by+1,2,1);p((f%20)<2?'#12B5E8':'k',bx+1,by+0,1,1);p('#F37A1F',bx+4,by+1,1,1)},
 train(L,f){const {p,W,H}=L,r=lvRand(17);/* mây + cây xa trôi (thị sai), chim, khói từ ống khói đầu tàu */for(let i=0;i<2;i++)lvCloud(L,W-(((i*W/2)+f*.2)%(W+30))+10,2+i*4,1);
  for(let i=0;i<8;i++){const X=W-((i*16+f*.5)%(W+16))+8,Y=H*.45;p('G',X,Y-6,6,6);p('g',X+1,Y-7,4,2);p('N',X+2,Y,2,3)}
  lvBird(L,(f*.5)%(W+10)-5,6+Math.round(Math.sin(f/5)*2),f,'#5E6B8C');
  const e=L.st.eng;if(e){for(let k=0;k<4;k++){const t=(f+k*5)%20,X=e.x+3-t*.6,Y=e.y-2-t*.8,s=1+Math.floor(t/7);L.x.globalAlpha=Math.max(0,1-t/20);p('#E3E7F0',X,Y,s+1,s+1);L.x.globalAlpha=1}}
  /* tà vẹt ray */ for(let X=0;X<W;X+=4)p('#9A6234',X,H-3,2,2)},
 strip(L,f){const {p,W,H}=L;/* dải biển nhỏ: mây, sóng chạy, lấp lánh */p('#BFE9F8',0,0,W,H);for(let i=0;i<3;i++)lvCloud(L,((i*W/3+f*.25)%(W+30))-20,0,1);
  const sea=H-4;p('#3FC1EC',0,sea,W,4);for(let X=0;X<W;X++){if((X+f)%8<3)p('#FFFFFF',X,sea-((X+f)%8===1?1:0),1,1)}for(let i=0;i<5;i++){const X=(i*W/5+f*.9)%W;if((f+i)%4<2)p('#FFFFFF',X,sea+2,1,1)}
  p('#F6D98B',0,H-1,W,1)},
 tug(L,f){const {p,W,H}=L,st=L.st;/* bụi tung dưới chân Jenny và trùm khi kéo */if(!st.ft)return;[[st.ft[0],-1],[st.ft[1],1]].forEach(([X,d])=>{for(let k=0;k<3;k++){const t=(f+k*4)%12,s=t<6?1:2;L.x.globalAlpha=Math.max(0,1-t/12);p('#E2B85E',X+d*t*.7+k*2,H-3-t*.3,s,s);L.x.globalAlpha=1}})},
};
/* ---------- gắn lớp theo màn đang mở ---------- */
function lvSetup(){lvStop();if(role!=='hs')return;const add=(L)=>{if(L)LV.layers.push(L)};const q=s=>document.querySelector(s);
  let h;
  if(h=q('#mgf.fish'))add(lvLayer(h,'over',LVD.fish));
  else if(h=q('#mgf.balloon'))add(lvLayer(h,'over',LVD.balloon));
  else if(h=q('#xgf.xgstar'))add(lvLayer(h,'over',LVD.star));
  else if(h=q('.xmole'))add(lvLayer(h,'over',LVD.mole));
  else if(h=q('.xspic'))add(lvLayer(h,'over',LVD.shape));
  else if(h=q('.xsbox'))add(lvLayer(h,'under',LVD.scale));
  else if(h=q('.xshop')){const s=lvLayer(q('.xshelf'),'strip',LVD.shop,{h:24,cls:'xlshop'});add(s);document.querySelectorAll('.xstag').forEach((t,i)=>t.classList.add('xlswing'))}
  else if(h=q('.xtrack')){const L=lvLayer(h,'over',LVD.train);add(L);const eng=q('.xteng');if(L&&eng){const a=h.getBoundingClientRect(),b=eng.getBoundingClientRect();L.st.eng={x:(b.left-a.left+b.width*.25)/3,y:(b.top-a.top+4)/3}}}
  else if(h=q('.xgtug')){const L=lvLayer(h,'under',LVD.tug);add(L);const j=q('.xgtj'),b=q('.xgtb');if(L&&j&&b){const a=h.getBoundingClientRect();L.st.ft=[(j.getBoundingClientRect().left-a.left+j.offsetWidth/2)/3,(b.getBoundingClientRect().left-a.left+b.offsetWidth/2)/3]}
    add(lvLayer(h,'strip',LVD.strip,{h:24,cls:'xlstrip'}))}
  else if(h=q('.xgpair')||q('.xgclock'))add(lvLayer(h,'strip',LVD.strip,{h:24,cls:'xlstrip'}));
  else if(scr.k==='game'&&scr.race&&(h=q('#app .game .gmid')))add(lvLayer(h,'strip',LVD.strip,{h:24,cls:'xlstrip'}));
  if(!LV.layers.length)return;LV.tok=scr;lvTick();if(lvReduce())return;
  LV.tid=setInterval(()=>{if(scr!==LV.tok||scr.end||!LV.layers.some(L=>L.cv.isConnected)){lvStop();return}LV.f++;lvTick()},120)}
{const _r=hooks.cu('render');hooks.de('render',function(){const v=_r.apply(this,arguments);try{if(role==='hs'&&(scr.k==='mini'||scr.k==='xg'||(scr.k==='game'&&scr.race))&&!scr.end)lvSetup();else lvStop()}catch(e){}return v})}
/* Ghép hình: go() vẽ trước khi có khay hình nên màn chưa hiện — vẽ lại khi cần */
{const _x=hooks.cu('startXG');hooks.de('startXG',function(mode,id){const v=_x.apply(this,arguments);try{if(scr.k==='xg'&&scr.mode==='shape'&&!document.querySelector('.xspic'))render()}catch(e){}return v})}
