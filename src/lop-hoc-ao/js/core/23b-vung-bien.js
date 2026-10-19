/* ===================== VÙNG BIỂN THEO CHỦ ĐỀ VÀ ĐẠI DƯƠNG THEO LỚP ===================== */
/* Mỗi chủ đề là một vùng biển riêng: màu nước, kiểu đảo, vật trang trí động. Mỗi lớp là một đại dương có tên và màu nhấn riêng,
   thứ tự vùng biển của mỗi lớp khác nhau. Ôn tập học kì 1 luôn là Biển Băng, Ôn tập cuối năm luôn là Biển Hoàng Hôn. */
{const G=["..kkttttttttttkk",".kttttttTttttTtk","bkkkkkkkkkkkkkkkb","bbxbbbbbxbbbbbxbb"];
 const TOP={
  palm:["........kk.kk...",".......kgGkGgk..","......kgGgggGgk.",".........knk....",".........knk....","....kkkkknkkkk.."],
  pine:["........kk......",".......kwwk.....","......kgwGgk....",".....kgGgwGgk...","....kgGwGgGwgk..","....kkkkknkkkk.."],
  volc:["......r..a......",".....kraark.....","....kNrarNNk....","...kNNNaNNNNk...","..kNNnNNNNnNNk..","..kkkkkkkkkkkk.."],
  cact:["........kk......",".......kgGk.....","....kk.kgGk.kk..","....kgkkgGkkgk..","....kgggggGggk..","....kkkkkGkkkk.."],
  mush:["......kkkk......","....kkcwccck....","...kcccccwcck...","...kcwccccccck..","....kkkwwkkkk...","....kkkkwwkkkk.."],
  crys:["........k.......",".......kwk..k...","...k..kpwPk.kwk.","..kwk.kpwPkkpPk.","..kpPkkpwPkkpPk.","....kkkkkkkkkk.."],
  tree:["......kkkkk.....","....kkgGgGgkk...","...kgGgGgGgGgk..","...kgGgGgGgGgk..","....kkgknkgkk...","....kkkkknkkkk.."],
 };
 const mk=(top,map,gmap)=>top.map(r=>r.replace(/./g,c=>map&&map[c]||c)).concat(G.map(r=>r.replace(/./g,c=>gmap&&gmap[c]||c)));
 Object.assign(PXS,{
  isl_trop:mk(TOP.palm),
  isl_snow:mk(TOP.pine,null,{t:'w',T:'e'}),
  isl_volc:mk(TOP.volc,null,{t:'E',T:'k'}),
  isl_dese:mk(TOP.cact,null,{t:'y',T:'a'}),
  isl_cand:mk(TOP.mush,null,{t:'c',T:'p'}),
  isl_crys:mk(TOP.crys,null,{t:'e',T:'E'}),
  isl_jung:mk(TOP.tree,null,{T:'g'}),
  isl_autu:mk(TOP.tree,{g:'o',G:'O'},{T:'u'}),
  isl_nigh:mk(TOP.palm,{g:'G'},{t:'T',T:'u'}),
  floe:["..wwww..",".wwwwwe.","wwwwwwee","eeeeeee."],
  cloudS:["..ww...",".wwww..","wwwwwww"],
  lily:[".gg.g.","gggggG",".gGGg."],
  candyS:[".c.",
          "cwc",".c.",".w.",".w."],
  rockL:["..kkk...",".kNrNk..","kNNNrNk.","kNNNNNNk"],
 });}
const BIOME={
 trop:{n:'Quần đảo Nhiệt đới',ic:'🏝',isl:'isl_trop',band:['#9CE0F6','#6FD0F2','#3FC1EC','#1FA9DD']},
 snow:{n:'Biển Băng',ic:'❄️',isl:'isl_snow',band:['#E4F6FC','#C3EAF7','#9BD9EF','#74C4E3'],foam:'#FFFFFF',spark:'#FFFFFF',shade:'#5AA9C9',fx:'snow'},
 volc:{n:'Đảo Núi lửa',ic:'🌋',isl:'isl_volc',band:['#66789A','#55657F','#45526B','#364159'],foam:'#C3CBDD',spark:'#F37A1F',shade:'#29324A',fx:'ember'},
 dese:{n:'Ốc đảo Sa mạc',ic:'🌵',isl:'isl_dese',band:['#8FE8DC','#5DD6C9','#33BDB1','#1FA197'],foam:'#FFFFFF',spark:'#FFF6C8',shade:'#178278',fx:'heat'},
 cand:{n:'Vịnh Kẹo ngọt',ic:'🍭',isl:'isl_cand',band:['#FFD3E6','#FBB6D3','#F497BF','#E87AAB'],foam:'#FFFFFF',spark:'#FFFFFF',shade:'#C85A8D',fx:'candy'},
 crys:{n:'Biển Pha lê',ic:'💎',isl:'isl_crys',band:['#D4C6F4','#B9A5EA','#9C85DD','#8068CB'],foam:'#F2EEFF',spark:'#FFFFFF',shade:'#5E47A6',fx:'twinkle'},
 jung:{n:'Đầm lầy Rừng xanh',ic:'🌿',isl:'isl_jung',band:['#8DDFB9','#62CD9E','#3EB585','#26996C'],foam:'#E6FFF2',spark:'#FFFFFF',shade:'#167553',fx:'lily'},
 autu:{n:'Vịnh Lá Thu',ic:'🍁',isl:'isl_autu',band:['#A9DDF0','#86CBE6','#62B6D8','#4A9FC6'],foam:'#FFFFFF',spark:'#FFE3B0',shade:'#2E7FA3',fx:'leaf'},
 nigh:{n:'Biển Đêm sao',ic:'🌙',isl:'isl_nigh',band:['#33437F','#29386E','#202D5C','#18234B'],foam:'#8FA3D8',spark:'#FCD655',shade:'#0F173A',fx:'stars'},
 suns:{n:'Biển Hoàng hôn',ic:'🌅',isl:'isl_trop',band:['#FFD8A0','#FDB57E','#F5926C','#DF7160'],foam:'#FFF3E0',spark:'#FFFFFF',shade:'#B4524A',fx:'sun'},
};
const BIOME_ORDER={1:['trop','cand','jung','crys','snow','autu','dese','volc','nigh','suns'],2:['jung','trop','dese','crys','cand','autu','snow','volc','nigh','trop','jung','dese','crys','suns'],
 3:['dese','crys','trop','volc','jung','cand','snow','autu','nigh','trop','dese','jung','crys','volc','cand','suns'],4:['crys','volc','autu','trop','nigh','jung','snow','dese','cand','crys','volc','trop','suns'],
 5:['volc','nigh','crys','dese','autu','snow','jung','cand','trop','volc','crys','suns']};
const OCEAN={1:['Vịnh Tí Hon','#FCB40C'],2:['Biển Ngọc Bích','#2AB563'],3:['Quần đảo Mây Trắng','#12B5E8'],4:['Đại dương Sao Băng','#8656A8'],5:['Biển Huyền Thoại','#F04A1B']};
function biomeOf(g,ti,name){const n=String(name||'');if(/ôn tập học kì 1/i.test(n))return'snow';if(/ôn tập cuối năm/i.test(n))return'suns';const L=BIOME_ORDER[g]||BIOME_ORDER[1];return L[ti%L.length]}
/* hiệu ứng động riêng từng vùng biển (vẽ trên canvas biển, mỗi khung hình) */
function biomeFx(kind,W,H){let s=7;const rnd=()=>(s=(s*9301+49297)%233280)/233280;const N=(k)=>Array.from({length:k},()=>({x:rnd()*W,y:rnd()*H,p:Math.floor(rnd()*16),v:.2+rnd()*.4}));
 const blit=(ctx,n,x,y)=>ctx.drawImage(pxCanvas(n),Math.round(x),Math.round(y));
 if(kind==='snow'){const fl=N(Math.round(W/12)),ice=N(Math.round(W/60));return(ctx,f)=>{ice.forEach(o=>{o.x-=.05;if(o.x<-10)o.x=W+4;blit(ctx,'floe',o.x,Math.round(o.y*.8)+((f>>3)%2))});ctx.fillStyle='#FFFFFF';fl.forEach(o=>{o.y+=o.v*.7;o.x+=Math.sin((f+o.p)/8)*.2;if(o.y>H)o.y=-2;ctx.fillRect(Math.round(o.x),Math.round(o.y),1,1)})}}
 if(kind==='ember'){const e=N(Math.round(W/10)),rk=N(Math.round(W/80));return(ctx,f)=>{rk.forEach(o=>blit(ctx,'rockL',o.x,Math.round(H*.15+o.y*.6)));e.forEach(o=>{o.y-=o.v;if(o.y<-2){o.y=H;o.x=rnd()*W}const ph=(f+o.p)%12;ctx.fillStyle=ph<6?'#F37A1F':'#FCD655';ctx.fillRect(Math.round(o.x),Math.round(o.y),1,ph<3?2:1)})}}
 if(kind==='candy'){const c=N(Math.round(W/70)),b=N(Math.round(W/14));return(ctx,f)=>{c.forEach(o=>{o.x+=.08;if(o.x>W+4)o.x=-4;blit(ctx,'candyS',o.x,Math.round(o.y*.7+10)+((f>>2)%2))});b.forEach(o=>{o.y-=o.v*.5;if(o.y<-3)o.y=H;const r=(f+o.p)%16<8;ctx.fillStyle='#FFFFFF';ctx.fillRect(Math.round(o.x),Math.round(o.y),r?2:1,r?2:1)})}}
 if(kind==='twinkle'){const t=N(Math.round(W*H/220));return(ctx,f)=>{t.forEach(o=>{const ph=(f+o.p)%20;if(ph>10)return;ctx.fillStyle=ph<4?'#FFFFFF':'#E8DEFF';const x=Math.round(o.x),y=Math.round(o.y);ctx.fillRect(x,y,1,1);if(ph>2&&ph<8){ctx.fillRect(x-1,y,3,1);ctx.fillRect(x,y-1,1,3)}})}}
 if(kind==='lily'){const l=N(Math.round(W/35));return(ctx,f)=>{l.forEach(o=>{blit(ctx,'lily',o.x+((f>>4)%2),Math.round(o.y*.9+6));if((f+o.p)%40<6){ctx.fillStyle='#F26249';ctx.fillRect(Math.round(o.x)+2,Math.round(o.y*.9+5),2,1)}})}}
 if(kind==='leaf'){const l=N(Math.round(W/16));return(ctx,f)=>{l.forEach(o=>{o.y+=o.v*.5;o.x+=Math.sin((f+o.p)/6)*.5;if(o.y>H){o.y=-2;o.x=rnd()*W}ctx.fillStyle=(o.p%3===0)?'#F37A1F':(o.p%3===1)?'#C95A0E':'#FCB40C';ctx.fillRect(Math.round(o.x),Math.round(o.y),2,1);ctx.fillRect(Math.round(o.x)+((f>>2)%2),Math.round(o.y)+1,1,1)})}}
 if(kind==='stars'){const t=N(Math.round(W*H/150));return(ctx,f)=>{t.forEach(o=>{const ph=(f+o.p)%24;ctx.fillStyle=ph<12?'#FCD655':'#FFFFFF';if(ph%6<4)ctx.fillRect(Math.round(o.x),Math.round(o.y),1,1)});const mx=W-30,my=10;ctx.fillStyle='#FFF6C8';ctx.fillRect(mx,my,6,6);ctx.fillRect(mx+1,my-1,4,8);ctx.fillRect(mx-1,my+1,8,4);ctx.fillStyle='#33437F';ctx.fillRect(mx+3,my,4,5);
   for(let i=0;i<6;i++){if((i+(f>>2))%2)continue;ctx.fillStyle='#FFF6C8';ctx.fillRect(mx-2+((i*3+(f>>2))%9),my+16+i*3,3,1)}}}
 if(kind==='sun'){return(ctx,f)=>{const cx=Math.round(W*.82),cy=Math.round(H*.18);ctx.fillStyle='#FFF0B8';for(let r=0;r<9;r++){const w=Math.round(Math.sqrt(81-r*r))*2;ctx.fillRect(cx-w/2,cy-r,w,1);ctx.fillRect(cx-w/2,cy+r,w,1)}
   for(let i=0;i<10;i++){const y=cy+14+i*4,w=Math.max(2,18-i*2)+((f+i)>>2)%3;if(y<H){ctx.fillStyle='#FFE08A';ctx.fillRect(cx-w/2,y,w,1)}}}}
 if(kind==='heat'){const d=N(Math.round(W/50));return(ctx,f)=>{d.forEach(o=>{ctx.fillStyle='#F6D98B';const x=Math.round(o.x),y=Math.round(o.y*.85+8);ctx.fillRect(x,y,10,2);ctx.fillRect(x+2,y-1,6,1);if((f+o.p)%30<10){ctx.fillStyle='#FFFFFF';ctx.fillRect(x+3+((f>>2)%3),y-3,1,1)}})}}
 return null}
