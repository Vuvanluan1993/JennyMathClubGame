/* ===================== Biển pixel động phía sau bản đồ ===================== */
Object.assign(PXS,{
 whale:[".....kkkkk......","...kkBBBBBkk..kk","..kBBBBBBBBBk.kB",".kBwkBBBBBBBBkBk","kBBBBBBBBBBBBBk."],
 gullA:["k.....k",".k...k.","..kwk..","...k..."],
 gullB:[".......","kkk.kkk","...k...","......."],
 fishS:[".BB.B","BBBBB",".BB.B"],
 rock:["..kkk...",".kEeEk..","kEeEEEk.","kEEEEEEk"],
 bottle:["..n..",".kwk.",".kbk.","kbbbk","kbwbk","kbbbk",".kkk."],
 weed:["..g.","..gG",".gG.",".Gg.","gG..",".gG."],
});
const PXCV={};
function pxCanvas(name){if(PXCV[name])return PXCV[name];const rows=PXS[name],W=Math.max(...rows.map(r=>r.length)),H=rows.length,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(PXC[ch]){x.fillStyle=PXC[ch];x.fillRect(i,j,1,1)}}));return PXCV[name]=c}
let seaRun=0;
function startSea(){const r=++seaRun;document.querySelectorAll('.seacv').forEach(cv=>seaOne(cv,r))}
function seaOne(cv,run0){if(!cv.getContext)return;let ctx;try{ctx=cv.getContext('2d')}catch(e){return}if(!ctx)return;
  const Z=3,W=Math.ceil(cv.width/Z),H=Math.ceil(cv.height/Z),run=run0;
  const dark=document.documentElement.dataset.theme==='dark'||(document.documentElement.dataset.theme!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);
  const BM=(typeof BIOME!=='undefined'&&BIOME[cv.dataset.biome])||null;const dk=c=>{const n=parseInt(c.slice(1),16);return'#'+[16,8,0].map(s=>Math.round(((n>>s)&255)*.45).toString(16).padStart(2,'0')).join('')};
  const band=BM?(dark?BM.band.map(dk):BM.band):dark?['#123d5c','#0f3550','#0c2d45','#0a263b']:['#9CE0F6','#6FD0F2','#3FC1EC','#1FA9DD'];
  const foam=BM&&BM.foam?(dark?dk(BM.foam):BM.foam):dark?'#3f7fa6':'#FFFFFF',spark=BM&&BM.spark?BM.spark:dark?'#5aa3c9':'#FFFFFF',shade=BM&&BM.shade?(dark?dk(BM.shade):BM.shade):dark?'#08202f':'#1590C4';
  let seed=11;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
  const isl=JSON.parse(cv.dataset.isl||'[]').map(([x,y])=>[Math.round(x/Z),Math.round(y/Z)]);
  const sparks=Array.from({length:Math.round(W*H/180)},()=>({x:rnd()*W,y:rnd()*H,v:.15+rnd()*.25,p:Math.floor(rnd()*8)}));
  const fish=Array.from({length:Math.max(3,Math.round(W/45))},()=>({x:rnd()*W,y:20+rnd()*(H-30),v:.3+rnd()*.3}));
  const gulls=[{x:rnd()*W,y:6,v:.6},{x:rnd()*W,y:12,v:.45}];
  const rocks=Array.from({length:Math.round(W/70)},(_,i)=>({x:Math.round(30+i*70+rnd()*30),y:Math.round(rnd()<.5?6+rnd()*10:H-14-rnd()*6)}));
  const weeds=Array.from({length:Math.round(W/40)},()=>({x:Math.round(rnd()*W),y:Math.round(H-8-rnd()*10)}));
  const bk=BM?cv.dataset.biome:'trop',bfx=BM&&BM.fx?biomeFx(BM.fx,W,H,isl):null;
  /* chỉ Nhiệt đới có cá voi, thuyền, hải âu, chai thư; đá ngầm và rong ở vùng có bờ đá */
  const noWhale=bk!=='trop',noBoat=bk!=='trop',noRock=!/trop|dese|autu|jung/.test(bk),noWeed=!/trop|dese|autu|jung/.test(bk);
  const whale={x:Math.round((155+300)/Z),y:H-12},bottle={x:rnd()*W,y:Math.round(H*.8)},boat={x:-30,y:Math.round(H*.86)};
  const blit=(n,x,y)=>ctx.drawImage(pxCanvas(n),Math.round(x),Math.round(y));
  ctx.imageSmoothingEnabled=false;ctx.setTransform(Z,0,0,Z,0,0);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches||cv.dataset.live!=='1';
  let f=0,last=0;
  function frame(ts){if(run!==seaRun||!cv.isConnected)return;
    if(!reduce&&ts-last<125){requestAnimationFrame(frame);return}last=ts;f++;
    // nền: 4 dải nước, chỗ nối có hạt so le
    const bh=H/4;for(let b=0;b<4;b++){ctx.fillStyle=band[b];ctx.fillRect(0,Math.floor(b*bh),W,Math.ceil(bh)+1)}
    for(let b=1;b<4;b++){const y0=Math.floor(b*bh);ctx.fillStyle=band[b-1];for(let x=(f>>2)%4;x<W;x+=4){ctx.fillRect(x,y0,2,1);ctx.fillRect(x+2,y0+1,1,1)}}
    // bóng cá lặn
    ctx.fillStyle=shade;fish.forEach(o=>{o.x+=o.v;if(o.x>W+6)o.x=-6;const y=o.y+Math.round(Math.sin((f+o.x)/9));ctx.fillRect(Math.round(o.x),y,3,1);ctx.fillRect(Math.round(o.x)+1,y-1,1,1);ctx.fillRect(Math.round(o.x)+1,y+1,1,1);ctx.fillRect(Math.round(o.x)-1,y-1,1,3)});
    // rong biển lắc lư
    if(!noWeed)weeds.forEach(w=>blit('weed',w.x+((f>>2)%2),w.y));
    // sóng lấp lánh trôi
    sparks.forEach(s=>{s.x-=s.v;if(s.x<-4)s.x=W+2;const ph=(f+s.p)%16;if(ph<12){ctx.fillStyle=spark;const x=Math.round(s.x),y=Math.round(s.y);ctx.fillRect(x,y,ph<4||ph>8?2:3,1);if(ph>=4&&ph<=8)ctx.fillRect(x+1,y-1,1,1)}});
    if(bfx)bfx(ctx,f);
    // vòng bọt quanh mỗi đảo
    ctx.fillStyle=foam;isl.forEach(([cx,cy],k)=>{const r=15+((f+k*3)>>2)%2;for(let a=0;a<28;a++){if((a+(f>>1))%3===0)continue;const t=a/28*Math.PI*2;ctx.fillRect(Math.round(cx+Math.cos(t)*(r+3)),Math.round(cy+Math.sin(t)*(r*.55+2)+9),1,1)}});
    // đá ngầm có bọt
    if(!noRock)rocks.forEach(r=>{blit('rock',r.x,r.y);ctx.fillStyle=foam;const o=(f>>1)%2;ctx.fillRect(r.x-1-o,r.y+3,2,1);ctx.fillRect(r.x+7+o,r.y+3,2,1)});
    // cá voi nổi lên, phun nước
    if(!noWhale){const wy=whale.y+((f>>3)%2);blit('whale',whale.x,wy);ctx.fillStyle=foam;ctx.fillRect(whale.x-1,wy+5,18,1);
    const sp=f%24;if(sp<10){const h=Math.min(sp,5);ctx.fillStyle=foam;for(let i=0;i<h;i++)ctx.fillRect(whale.x+7,wy-1-i,1,1);if(sp>=5){ctx.fillRect(whale.x+5,wy-6,1,1);ctx.fillRect(whale.x+9,wy-6,1,1);ctx.fillRect(whale.x+4,wy-4,1,1);ctx.fillRect(whale.x+10,wy-4,1,1)}}}
    // chai thư trôi
    if(!noBoat){bottle.x+=.12;if(bottle.x>W+6)bottle.x=-6;blit('bottle',bottle.x,bottle.y+((f>>2)%2));
    // thuyền buồm nhỏ
    boat.x+=.25;if(boat.x>W+20)boat.x=-20;blit('boat',boat.x,boat.y-11+((f>>2)%2));
    // hải âu
    gulls.forEach((g,i)=>{g.x+=g.v;if(g.x>W+8)g.x=-8;blit((f+i)%4<2?'gullA':'gullB',g.x,g.y+Math.round(Math.sin(f/5+i)))})}
    if(!reduce)requestAnimationFrame(frame)}
  requestAnimationFrame(frame)}

