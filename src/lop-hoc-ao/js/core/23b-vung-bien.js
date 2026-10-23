/* ===================== VÙNG BIỂN THEO CHỦ ĐỀ VÀ ĐẠI DƯƠNG THEO LỚP ===================== */
/* Mỗi chủ đề là một vùng biển riêng: màu nước, kiểu đảo, vật trang trí động. Mỗi lớp là một đại dương có tên và màu nhấn riêng,
   thứ tự vùng biển của mỗi lớp khác nhau. Ôn tập học kì 1 luôn là Biển Băng, Ôn tập cuối năm luôn là Biển Hoàng Hôn. */
/* Đảo 26×18 ô và vật thể trong nước: sinh từ bản vẽ (xem docs), thêm 12 màu riêng cho vùng biển (v,V tím nhạt; q,Q hồng; i băng; d,D đá bazan; f dung nham; h,H bóng tối; z kem sáng; j lá non). */
Object.assign(PXC,{"v": "#CDB8F7", "V": "#A07FE3", "q": "#FBB9DA", "Q": "#E8649F", "i": "#BFF1FF", "d": "#3A3F52", "D": "#585F78", "f": "#FFB13B", "h": "#4B2A4A", "H": "#2E1A33", "z": "#FFF3C4", "j": "#8FD14F"});
Object.assign(PXS,{
 isl_trop:["....kk..kk................", "..kkggkkgGkk..............", ".kggGggggGggk.............", ".kGgkgNNgkgGk...kk.kk.....", ".kk.k.NNk.kkk.kkggkgGkk...", ".k....knk...k.kgGgNgGgk...", "......knk.....k.kNNkk.k...", ".......knk....k..knk.k....", ".......knk.......knk.kkk..", ".......knk......knk.krwrk.", "........knk.....knk.kw.wk.", ".....kkkknkNktttknkkkrwrk.", "...kktttttttkNkttttttkkk..", "..kttttttttttttttttttttk..", ".kttttttttttttttttttttttk.", ".kTTTTTTTTTTTTTTTTTTTTTTk.", "..kTTuTTTTTTuTTTTTTuTTkk..", "...kkkkkkkkkkkkkkkkkkk...."],
 isl_snow:[".................w........", "...w..................w...", ".......................w..", "..........................", "..........................", "....k...............kk....", "...kik..kkkkkkkk...kkwk...", "..kiwxkkwwwewwwwk..kkkoo..", ".kiwixxkwewwwweewk.kwwk...", "kiwiixxkwwwkkkwwek.kwwkk..", "kiiixxbkwwkkkkkwwk.kwwk...", "kiwixxbkewkkkkkeekwkook...", "...kkwwwwwwiwwwwwwwwwikk..", "..kwwwiwwwwwwwwwwiwwwwwk..", ".kwwwwwwwwwwiwwwwwwwwwwwk.", ".kiiiiiiiiiiiiiiiiiiiiiik.", "..kiixiiiiiixiiiiiixiikk..", "...kkkkkkkkkkkkkkkkkkk...."],
 isl_volc:["..........EE.eE...........", ".........eEeEEe...........", "...........EeE............", "............E.............", "..........krfrk...........", ".........kdrffrdk.........", "........kdDdrfdDdk........", ".......kdDdDrrdDdDk.......", "......kdDddDdrDddDdk......", ".....kdDdddDdroDdddDk.....", "....kdDddDdddrfdddDddk....", "...kdDdddddDdorrdddDddk...", "..kdDddDdddddffodddddDdk..", "..kdddDddddddodddDdddddk..", ".kddddddddddDdddddddddddk.", ".kkkkkkkkkkkkkkkkkkkkkkkk.", "..kkkdkkkkkkdkkkkkkdkkkk..", "...kkkkkkkkkkkkkkkkkkk...."],
 isl_dese:["..........................", "..kk.kk...................", "kkgGkgGkk.................", "kgGgGgGgk..kk.............", "k.kakak.k.kgGk............", "...kak..k.kgGk............", "...knk..kgkgGk.k..........", "...knk..kgkgGkkg....k.....", "....knk.kggggGgk...kak....", "....knk..kkgGkk...kaTTk...", "....knk....gGk...kaaTTTk..", "....knkkkykgGkyykaaaTTTTk.", "...kkyyyyyytyyyyyyyykkkkk.", "..kyyytyyyyyyyyyytykxxbbk.", ".kyyyyyyyyyytyyyyyyyyyyyk.", ".kTTTTTTTTTTTTTTTTTTTTTTk.", "..kTTaTTTTTTaTTTTTTaTTkk..", "...kkkkkkkkkkkkkkkkkkk...."],
 isl_cand:["..........................", "...........r..............", ".kkkk.....kwk.............", "kcqqck....kck.............", "kqwcqk....kkkkk......kkk..", "kqcwqk...kqqqqqk....kwrwk.", "kcqqck..kwwwwwwwk...krkrk.", ".kkkk...kwqwwqwwk...kw.k..", "..kw....kqqqqqqqk...kr....", "..kw...kwwwwwwwwwk..kw....", "..kw...kwqwwwqwwqk..kr....", "..kw.kkkqqcqqqcqqkwkkwk...", "...kkwkqqqqqqqqqqqkwwqkk..", "..kwwwqwwwwwwwwwwqwwwwwk..", ".kwwwwwwwwwwqwwwwwwwwwwwk.", ".kQQQQQQQQQQQQQQQQQQQQQQk.", "..kQQnQQQQQQnQQQQQQnQQkk..", "...kkkkkkkkkkkkkkkkkkk...."],
 isl_crys:["............k.............", "...........kwk............", "...w......kwvVk.....w.....", "..........kwvVk.........w.", ".........kwvvVVk.......www", "......k..kwvwVVk........w.", ".....kwk.kwvvVPk..k.......", "....kwqQkkwvvVPk.kwk......", "....kwqQkkvvvVPkkwixk.....", "....kqqQkkvvVVPkkwixk.k...", "..k.kqQQkkvvVPPkkixbkkwk..", ".kwkkqQQkkvVVPPkkixbkkqk..", ".kvkkqQQkkvVVPPkkixbkkQk..", ".kVkppVppppppppppVpppppk..", ".kppppppppppVpppppppppppk.", ".kPPPPPPPPPPPPPPPPPPPPPPk.", "..kPPvPPPPPPvPPPPPPvPPkk..", "...kkkkkkkkkkkkkkkkkkk...."],
 isl_jung:["........kkkkkkkk..........", ".....kkkgGgjgGgGkkk.......", "....kgGjgGgGgGjgGgGk......", "...kgGgGgGjgGgGgGgjgk.....", "..kgGjgGgGgGgGgjgGgGgk....", "..kGgGgGjgGgGgGgGgGjGk....", "...kGkGkkGkknkkGkkGkk.....", "....G.G..G.knk.G..G.......", "....G.r....knk....G.......", "....r.....kNnk....r.......", "...r.......knk.g.g...c....", "..ryrkkkkgggggggGggkcyc...", "...rkggggggGgggggggggckk..", "..kgggGggggggggggGgggggk..", ".kggggggggggGgggggggggggk.", ".kNNNNNNNNNNNNNNNNNNNNNNk.", "..kNNjNNNNNNjNNNNNNjNNkk..", "...kkkkkkkkkkkkkkkkkkk...."],
 isl_autu:["........kkkkkkkk..........", "......kkoarooaorkk........", ".....koOroaoOrooaOk.......", "....kroaOoroOaroOrok......", "....kOroaOroaoOroaOk......", ".....kOkrkOkkOkrkOk.......", "......k..k.knk.k..k.......", "...........knk....kkkk....", "..........kNnk...krwrrk...", "...........knk...krrrwk...", "...o.r.a..........kwwk....", "..orarooauuuuuuuuuukwkk...", ".oroaoraouuuuuuuuuuuuukk..", "..kuuuuuuuuuuuuuuuuuuuuk..", ".kuuuuuuuuuuuuuuuuuuuuuuk.", ".kOOOOOOOOOOOOOOOOOOOOOOk.", "..kOOoOOOOOOoOOOOOOoOOkk..", "...kkkkkkkkkkkkkkkkkkk...."],
 isl_nigh:["............kk............", "...........kRRk...........", "..........kkkkkk..........", "......a...kyyzyk.a........", ".......a..kyzyyka.........", "......a...kkkkkk.a........", "...........kwwk...........", "...........krrk...........", "...........krrk...........", "..........kwwwwk..........", "..........kwwwwk..........", "..g.gkkkkGkrrrrkGGGkgkg...", "..gGgGGGGGkrrkNkGGGGgGgk..", "..kGGGDGGkwwwkNkkDGGGGGk..", ".kGGGGGGGGGGDGGGGGGGGGGGk.", ".kddddddddddddddddddddddk.", "..kddgddddddgddddddgddkk..", "...kkkkkkkkkkkkkkkkkkk...."],
 isl_suns:[".....hh..hh...............", "...hhhhhhhhhh.............", "..hhhhhhhhhhhh............", "..hh.h.hhh.hhh............", "..h....hh....h..hh.hh.....", ".......hh.....hhhhhhhhh...", ".......hh.....hh.hhh.hh...", "........hh....h..h...h....", "........hh.......hh.......", "........hh.......hh..hhh..", ".........hh.....hh..hhhhh.", ".....kkkkhhooooohhohhhhhhh", "...kkoooohhaoooooooooakk..", "..koooaooooooooooaoooook..", ".kooooooooooaoooooooooook.", ".kOOOOOOOOOOOOOOOOOOOOOOk.", "..kOOfOOOOOOfOOOOOOfOOkk..", "...kkkkkkkkkkkkkkkkkkk...."],
 coralA:["...c....c..", ".c.cc..cc.c", ".cc.cqcc.cc", "..cccqccc..", "c..ccqcc..c", "cc..ccc..cc", ".ccccqcccc.", "...ccccc...", "....ccc...."],
 coralB:[".o...o...o.", ".oo..o..oo.", "..oo.o.oo..", "o..ooooo..o", "oo..ooo..oo", ".ooooooooo.", "...ooooo...", "....ooo...."],
 fishC:["..kkk...k", ".kowok.kk", "kowkwokok", "kowwwookk", ".kowok.kk", "..kkk...k"],
 fishY:["..kkk...k", ".kyyyk.kk", "kykyyakyk", "kyyyyakkk", ".kyyyk.kk", "..kkk...k"],
 berg:[".....kk........", "....kiwk.......", "...kiwixk..k...", "..kiwiixxkkik..", ".kiwiiixxbkixk.", "kiwiiiixxxbkxbk", "kiiiiixxxbbkbbk"],
 pengS:[".kkk..", "kkwkk.", "kkkkoo", "kwwwk.", "wwwwww"],
 lavaP:["..rrr..", ".rfffr.", "rffzffr", ".rfffr.", "..rrr.."],
 basalt:["...kkk....", "..kDdDk...", ".kDdddDkk.", "kDdddrdDdk", "kddDdddddk", ".kkkkkkkk."],
 turtle:["...kkk.....", "..kGgGk.kk.", ".kgGgGgkgjk", "kGgGgGgGkk.", ".kGgGgGk...", "..k...k...."],
 dune:[".....kkkk.....", "...kkttyykk...", ".kktttyyyyykk.", "kttttyyyyyyyyk", "wwwwwwwwwwwwww"],
 wrapA:["kk.....kk", "kckkkkkck", ".kcqcwck.", ".kcwcqck.", "kckkkkkck", "kk.....kk"],
 mint:["..kkk..", ".kwrwk.", "kwrwrwk", "krwwwrk", "kwrwrwk", ".kwrwk.", "..kkk.."],
 wrapB:["kk.......kk", "kbkkkkkkkbk", ".kbwbwbwbk.", "kbkkkkkkkbk", "kk.......kk"],
 crysW1:["....k....", "...kwk...", "..kwvVk..", "..kwvVk..", ".kwvvVVk.", ".kwvvVPk.", ".kvvvVPk.", "kwvvVVPPk", "kvvvVVPPk", "kvvVVPPPk", "wwwwwwwww"],
 crysW2:["..k....", ".kwk...", ".kqQk..", "kwqQk..", "kqqQk..", "kqQQkk.", "kqQQkQk", "wwwwwww"],
 crysW3:["......k.......", ".....kwk......", "..k..kwxk..k..", ".kwk.kixk.kwk.", ".kik.kixbkkik.", "kwixkkixbkkixk", "kiixkkixbkkixk", "wwwwwwwwwwwwww"],
 shard:["..w..", ".wvV.", "wvvVP", ".VVP.", "..P.."],
 lotus:["...q...", "..qwq..", ".qqwqq.", "qqQqQqq", ".gggGg.", "gGgggGg", ".gGGgg."],
 reed:["N...N.", "N..NN.", "N..N..", "g..N.N", "g.gg.N", "gg.g.g", ".gg.gg", ".g.gg.", "..gg..", "..g..."],
 log:["..kkkkkkkkk..", ".knNnNnNnNkk.", "kunNnNnNnNkuk", "kNnNnNnnNnkuk", ".kkkkkkkkkkk.", "wwwwwwwwwwwww"],
 frog:[".kk.kk.", "kwkkwkk", "kgggggk", "kgjjjgk", "kgggggk", ".k...k."],
 maple:["...r...", ".r.r.r.", "rrrrrrr", ".rrRrr.", "rrrRrrr", "..rrr..", "...n..."],
 mapleO:["...o...", ".o.o.o.", "ooooooo", ".ooOoo.", "oooOooo", "..ooo..", "...n..."],
 pboat:[".....w.....", "....kwk....", "...kwwek...", "..kwwwwek..", "kkkkkkkkkkk", ".kwwwwwwek.", "..kkkkkkk.."],
 jellyP:["..kkk..", ".kqwqk.", "kqwqqqk", "kqqqqQk", "kkkkkkk", ".q.q.q.", "q.q.q.q", ".q...q."],
 jellyB:["..kkk..", ".kiwik.", "kiwiiik", "kiiiixk", "kkkkkkk", ".i.i.i.", "i.i.i.i", ".i...i."],
 birdH:["hh...hh", "..h.h..", "...h..."],
 boatH:[".....h.....", "....hh.....", "...hhh.h...", "..hhhh.hh..", ".hhhhh.hhh.", "hhhhhh.hhhh", ".....h.....", "hhhhhhhhhhh", ".hhhhhhhhh.", "..hhhhhhh.."]
});
Object.assign(PXS,{
 floe:["..wwww..",".wwwwwe.","wwwwwwee","eeeeeee."],
 cloudS:["..ww...",".wwww..","wwwwwww"],
 lily:[".gg.g.","gggggG",".gGGg."],
 candyS:[".c.","cwc",".c.",".w.",".w."],
 rockL:["..kkk...",".kNrNk..","kNNNrNk.","kNNNNNNk"],
});
const BIOME={
 trop:{n:'Quần đảo Nhiệt đới',ic:'🏝',isl:'isl_trop',band:['#9CE0F6','#6FD0F2','#3FC1EC','#1FA9DD'],fx:'reef'},
 snow:{n:'Biển Băng',ic:'❄️',isl:'isl_snow',band:['#E4F6FC','#C3EAF7','#9BD9EF','#74C4E3'],foam:'#FFFFFF',spark:'#FFFFFF',shade:'#5AA9C9',fx:'snow'},
 volc:{n:'Đảo Núi lửa',ic:'🌋',isl:'isl_volc',band:['#66789A','#55657F','#45526B','#364159'],foam:'#C3CBDD',spark:'#F37A1F',shade:'#29324A',fx:'ember'},
 dese:{n:'Ốc đảo Sa mạc',ic:'🌵',isl:'isl_dese',band:['#8FE8DC','#5DD6C9','#33BDB1','#1FA197'],foam:'#FFFFFF',spark:'#FFF6C8',shade:'#178278',fx:'heat'},
 cand:{n:'Vịnh Kẹo ngọt',ic:'🍭',isl:'isl_cand',band:['#FFD3E6','#FBB6D3','#F497BF','#E87AAB'],foam:'#FFFFFF',spark:'#FFFFFF',shade:'#C85A8D',fx:'candy'},
 crys:{n:'Biển Pha lê',ic:'💎',isl:'isl_crys',band:['#D4C6F4','#B9A5EA','#9C85DD','#8068CB'],foam:'#F2EEFF',spark:'#FFFFFF',shade:'#5E47A6',fx:'twinkle'},
 jung:{n:'Đầm lầy Rừng xanh',ic:'🌿',isl:'isl_jung',band:['#8DDFB9','#62CD9E','#3EB585','#26996C'],foam:'#E6FFF2',spark:'#FFFFFF',shade:'#167553',fx:'lily'},
 autu:{n:'Vịnh Lá Thu',ic:'🍁',isl:'isl_autu',band:['#A9DDF0','#86CBE6','#62B6D8','#4A9FC6'],foam:'#FFFFFF',spark:'#FFE3B0',shade:'#2E7FA3',fx:'leaf'},
 nigh:{n:'Biển Đêm sao',ic:'🌙',isl:'isl_nigh',band:['#33437F','#29386E','#202D5C','#18234B'],foam:'#8FA3D8',spark:'#FCD655',shade:'#0F173A',fx:'stars'},
 suns:{n:'Biển Hoàng hôn',ic:'🌅',isl:'isl_suns',band:['#FFD8A0','#FDB57E','#F5926C','#DF7160'],foam:'#FFF3E0',spark:'#FFFFFF',shade:'#B4524A',fx:'sun'},
};
const BIOME_ORDER={1:['trop','cand','jung','crys','snow','autu','dese','volc','nigh','suns'],2:['jung','trop','dese','crys','cand','autu','snow','volc','nigh','trop','jung','dese','crys','suns'],
 3:['dese','crys','trop','volc','jung','cand','snow','autu','nigh','trop','dese','jung','crys','volc','cand','suns'],4:['crys','volc','autu','trop','nigh','jung','snow','dese','cand','crys','volc','trop','suns'],
 5:['volc','nigh','crys','dese','autu','snow','jung','cand','trop','volc','crys','suns']};
const OCEAN={1:['Vịnh Tí Hon','#FCB40C'],2:['Biển Ngọc Bích','#2AB563'],3:['Quần đảo Mây Trắng','#12B5E8'],4:['Đại dương Sao Băng','#8656A8'],5:['Biển Huyền Thoại','#F04A1B']};
function biomeOf(g,ti,name){const n=String(name||'');if(/ôn tập học kì 1/i.test(n))return'snow';if(/ôn tập cuối năm/i.test(n))return'suns';const L=BIOME_ORDER[g]||BIOME_ORDER[1];return L[ti%L.length]}
/* hiệu ứng riêng từng vùng biển, vẽ trên canvas biển mỗi khung hình.
   Vật thể tĩnh đặt tránh chỗ các đảo (isl: toạ độ tâm đảo theo đơn vị canvas). Sprite dựng sẵn bằng pxCanvas, không tạo mới mỗi khung. */
function biomeFx(kind,W,H,isl){let s=7;const rnd=()=>(s=(s*9301+49297)%233280)/233280;const N=(k)=>Array.from({length:k},()=>({x:rnd()*W,y:rnd()*H,p:Math.floor(rnd()*16),v:.2+rnd()*.4}));
 const IS=isl||[];const free=(x,y,w,h)=>!IS.some(([cx,cy])=>x+w>cx-20&&x<cx+20&&y+h>cy-14&&y<cy+30);
 /* vật thể tĩnh: n cái, rải đều theo chiều ngang, tránh đảo */
 const place=(n,w,h,y0=4,y1=H-4)=>{const L=[];for(let i=0;i<n;i++){for(let t=0;t<14;t++){const x=Math.round((i+rnd())*W/n-w/2),y=Math.round(y0+rnd()*Math.max(1,y1-y0-h));if(free(x,y,w,h)||t===13){L.push({x,y,p:Math.floor(rnd()*40),k:Math.floor(rnd()*3)});break}}}return L};
 const per=(u)=>Math.max(2,Math.round(W/u));
 const C=n=>pxCanvas(n);const blit=(ctx,n,x,y)=>ctx.drawImage(C(n),Math.round(x),Math.round(y));
 const wake=(ctx,x,y,w,f,col)=>{ctx.fillStyle=col;const o=(f>>2)%2;ctx.fillRect(Math.round(x)-1-o,Math.round(y),2,1);ctx.fillRect(Math.round(x)+w-1+o,Math.round(y),2,1)};
 const swim=(L,ctx,f,spr,dy=0,col='#FFFFFF')=>L.forEach(o=>{o.x+=o.v*.35*(o.d||1);if(o.x>W+12)o.x=-12;if(o.x<-12)o.x=W+12;const y=Math.round(o.y+Math.sin((f+o.p)/7)*dy);const c=typeof spr==='function'?spr(o,f):spr;blit(ctx,c,o.x,y);if(col)wake(ctx,o.x,y+C(c).height-1,C(c).width,f,col)});
 if(kind==='reef'){ /* Nhiệt đới: rạn san hô, cá sặc sỡ */
  const co=place(per(50),11,9,H*.45,H-2),fs=N(per(40));fs.forEach(o=>{o.y=10+o.y*.8;o.d=o.p%2?1:-1});
  return(ctx,f)=>{co.forEach(o=>blit(ctx,o.k?'coralA':'coralB',o.x,o.y));fs.forEach(o=>{o.x+=o.v*.6*o.d;if(o.x>W+10)o.x=-10;if(o.x<-10)o.x=W+10;const n=o.p%2?'fishC':'fishY';ctx.save();const y=Math.round(o.y+Math.sin((f+o.p)/6));if(o.d<0){ctx.translate(Math.round(o.x)+9,0);ctx.scale(-1,1);ctx.drawImage(C(n),0,y)}else ctx.drawImage(C(n),Math.round(o.x),y);ctx.restore()})}}
 if(kind==='snow'){ /* Biển Băng: núi băng, băng trôi, chim cánh cụt bơi, tuyết rơi, cực quang */
  const bg=place(per(55),15,7,6,H-8),fl=N(Math.round(W/12)),ice=N(per(55)),pg=N(per(90));pg.forEach(o=>o.y=12+o.y*.75);
  return(ctx,f)=>{for(let x=0;x<W;x+=2){const y=Math.round(4+Math.sin((x+f*1.5)/18)*3+Math.sin(x/7)*1);ctx.fillStyle='rgba(98,232,160,.35)';ctx.fillRect(x,y,2,3);ctx.fillStyle='rgba(120,200,255,.28)';ctx.fillRect(x,y+3,2,2)}
   bg.forEach(o=>{blit(ctx,'berg',o.x,o.y+((f+o.p)>>4)%2);ctx.fillStyle='#FFFFFF';ctx.fillRect(o.x-1,o.y+7,17,1)});
   ice.forEach(o=>{o.x-=.05;if(o.x<-10)o.x=W+4;blit(ctx,'floe',o.x,Math.round(o.y*.8)+((f>>3)%2))});
   swim(pg,ctx,f,'pengS',1);
   ctx.fillStyle='#FFFFFF';fl.forEach(o=>{o.y+=o.v*.7;o.x+=Math.sin((f+o.p)/8)*.2;if(o.y>H)o.y=-2;ctx.fillRect(Math.round(o.x),Math.round(o.y),1,1)})}}
 if(kind==='ember'){ /* Núi lửa: đá bazan, vệt dung nham sáng, khói, bọt sôi, tàn lửa */
  const rk=place(per(48),10,6,4,H-6),lv=place(per(40),7,5,6,H-4),e=N(Math.round(W/10)),bb=N(per(25));
  return(ctx,f)=>{lv.forEach(o=>{const ph=(f+o.p)%16;ctx.globalAlpha=ph<8?.95:.6;blit(ctx,'lavaP',o.x,o.y);ctx.globalAlpha=1});
   rk.forEach(o=>{blit(ctx,'basalt',o.x,o.y);ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(o.x-1-((f>>1)%2),o.y+5,12,1);for(let i=0;i<3;i++){const t=(f+o.p+i*8)%24;ctx.fillStyle=t<12?'rgba(200,205,220,.7)':'rgba(170,175,195,.45)';const r=1+(t>>3);ctx.fillRect(Math.round(o.x+4+Math.sin((t+o.p)/4)*1.5),Math.round(o.y-2-t*.6),r,r)}});
   bb.forEach(o=>{const t=(f+o.p)%20;if(t<10){ctx.fillStyle='rgba(255,255,255,.75)';const x=Math.round(o.x),y=Math.round(o.y),r=t>>2;ctx.fillRect(x-r,y,1,1);ctx.fillRect(x+r,y,1,1);ctx.fillRect(x,y-r,1,1);if(t>7)ctx.fillRect(x,y,1,1)}});
   e.forEach(o=>{o.y-=o.v;if(o.y<-2){o.y=H;o.x=rnd()*W}const ph=(f+o.p)%12;ctx.fillStyle=ph<6?'#F37A1F':'#FCD655';ctx.fillRect(Math.round(o.x),Math.round(o.y),1,ph<3?2:1)})}}
 if(kind==='heat'){ /* Sa mạc: cồn cát nổi, rùa biển, nắng gắt, sóng nhiệt */
  const d=place(per(48),14,5,6,H-4),sun=place(1,20,18,0,26)[0],tu=N(per(80));tu.forEach(o=>{o.y=10+o.y*.8;o.v*=.5});
  return(ctx,f)=>{const cx=sun.x+10,cy=sun.y+9;ctx.fillStyle='rgba(255,246,200,.5)';for(let i=0;i<8;i++){const a=i/8*Math.PI*2+f/30,r=10+((f>>2)%2);ctx.fillRect(Math.round(cx+Math.cos(a)*r),Math.round(cy+Math.sin(a)*r),2,2)}ctx.fillStyle='#FFF3C4';ctx.fillRect(cx-4,cy-3,9,7);ctx.fillRect(cx-3,cy-4,7,9);
   for(let k=0;k<3;k++){const y=14+k*6;ctx.fillStyle='rgba(255,255,255,.22)';for(let x=(k*7+f)%12;x<W;x+=12)ctx.fillRect(x,y+Math.round(Math.sin((x+f*2)/6)),5,1)}
   d.forEach(o=>{blit(ctx,'dune',o.x,o.y);if((f+o.p)%30<10){ctx.fillStyle='#FFFFFF';ctx.fillRect(o.x+5+((f>>2)%3),o.y-2,1,1)}});
   swim(tu,ctx,f,'turtle',1)}}
 if(kind==='candy'){ /* Kẹo ngọt: kẹo bọc giấy, kẹo bạc hà tròn, kẹo mút trôi, cốm màu rơi, bong bóng */
  const w=place(per(36),11,7,6,H-4),c=N(per(70)),b=N(Math.round(W/14)),sp=N(Math.round(W/9));const SC=['#F26249','#FCD655','#12B5E8','#2AB563','#FFFFFF','#8656A8'];
  return(ctx,f)=>{w.forEach(o=>blit(ctx,['wrapA','mint','wrapB'][o.k],o.x,o.y+((f+o.p)>>3)%2));
   c.forEach(o=>{o.x+=.08;if(o.x>W+4)o.x=-4;blit(ctx,'candyS',o.x,Math.round(o.y*.7+10)+((f>>2)%2))});
   sp.forEach((o,i)=>{o.y+=o.v*.6;if(o.y>H){o.y=-2;o.x=rnd()*W}ctx.fillStyle=SC[i%6];ctx.fillRect(Math.round(o.x),Math.round(o.y),(i+(f>>2))%2?2:1,(i+(f>>2))%2?1:2)});
   b.forEach(o=>{o.y-=o.v*.5;if(o.y<-3)o.y=H;const r=(f+o.p)%16<8;ctx.fillStyle='#FFFFFF';ctx.fillRect(Math.round(o.x),Math.round(o.y),r?2:1,r?2:1)})}}
 if(kind==='twinkle'){ /* Pha lê: khối pha lê nhô khỏi mặt nước, mảnh pha lê trôi, lấp lánh, tia cầu vồng quét */
  const sp=place(per(34),14,11,4,H-4),sh=N(per(30)),t=N(Math.round(W*H/220));const RB=['#F04A1B','#F37A1F','#FCD655','#2AB563','#12B5E8','#8656A8'];
  return(ctx,f)=>{const ph=(f%160);if(ph<70){const x0=Math.round(ph/70*(W+H*2))-H;ctx.globalAlpha=.16;RB.forEach((col,i)=>{ctx.fillStyle=col;for(let y=0;y<H;y+=2)ctx.fillRect(x0+i*3-y,y,3,2)});ctx.globalAlpha=1}
   sp.forEach(o=>{const n=['crysW1','crysW2','crysW3'][o.k],cv=C(n);blit(ctx,n,o.x,o.y);ctx.fillStyle='#F2EEFF';const q=(f>>2)%2;ctx.fillRect(o.x-1-q,o.y+cv.height-1,2,1);ctx.fillRect(o.x+cv.width-1+q,o.y+cv.height-1,2,1);if((f+o.p)%24<4){ctx.fillStyle='#FFFFFF';ctx.fillRect(o.x+1,o.y+1,1,1)}});
   sh.forEach(o=>{o.x+=o.v*.15;if(o.x>W+4)o.x=-4;blit(ctx,'shard',o.x,Math.round(o.y+Math.sin((f+o.p)/8)))});
   t.forEach(o=>{const ph=(f+o.p)%20;if(ph>10)return;ctx.fillStyle=ph<4?'#FFFFFF':'#E8DEFF';const x=Math.round(o.x),y=Math.round(o.y);ctx.fillRect(x,y,1,1);if(ph>2&&ph<8){ctx.fillRect(x-1,y,3,1);ctx.fillRect(x,y-1,1,3)}})}}
 if(kind==='lily'){ /* Rừng xanh: lá súng, hoa sen, cỏ lau, khúc gỗ, ếch nhảy, đom đóm, chuồn chuồn */
  const l=place(per(26),6,3,6,H-4),lo=place(per(55),7,7,6,H-4),rd=place(per(45),6,10,2,H-10),lg=place(per(90),13,6,8,H-6),ff=N(per(14)),dr=N(per(120));
  return(ctx,f)=>{rd.forEach(o=>blit(ctx,'reed',o.x+(((f+o.p)>>3)%2),o.y));lg.forEach(o=>blit(ctx,'log',o.x,o.y+((f>>4)%2)));
   l.forEach(o=>blit(ctx,'lily',o.x+((f>>4)%2),o.y));lo.forEach(o=>blit(ctx,'lotus',o.x,o.y));
   l.forEach((o,i)=>{if(i%3)return;const t=(f+o.p*3)%60,nx=l[(i+1)%l.length];if(t<12&&nx&&Math.abs(nx.x-o.x)<60){const k=t/12,x=o.x+(nx.x-o.x)*k,y=o.y+(nx.y-o.y)*k-Math.sin(k*Math.PI)*8;blit(ctx,'frog',x,y-3)}else blit(ctx,'frog',t<36?(nx&&Math.abs(nx.x-o.x)<60?nx.x:o.x):o.x,(t<36?(nx&&Math.abs(nx.x-o.x)<60?nx.y:o.y):o.y)-3)});
   ff.forEach(o=>{o.x+=Math.sin((f+o.p)/9)*.4;o.y+=Math.cos((f+o.p)/11)*.3;if((f+o.p)%14<8){ctx.fillStyle='#FFF3C4';ctx.fillRect(Math.round(o.x),Math.round(o.y),1,1);ctx.fillStyle='rgba(252,214,85,.45)';ctx.fillRect(Math.round(o.x)-1,Math.round(o.y),3,1)}});
   dr.forEach(o=>{o.x+=.5;if(o.x>W+4)o.x=-4;const x=Math.round(o.x),y=Math.round(o.y*.6+4+Math.sin(f/3+o.p)*2);ctx.fillStyle='#0079C1';ctx.fillRect(x,y,4,1);ctx.fillStyle=f%2?'#BFF1FF':'#7FD3F0';ctx.fillRect(x+1,y-1,1,1);ctx.fillRect(x+1,y+1,1,1)})}}
 if(kind==='leaf'){ /* Lá Thu: lá nổi trên mặt nước, thuyền giấy trôi, lá rơi xoay */
  const fl=place(per(28),7,7,6,H-4),bt=N(per(110)),l=N(Math.round(W/16));bt.forEach(o=>{o.y=14+o.y*.7;o.v*=.4});
  return(ctx,f)=>{fl.forEach(o=>blit(ctx,o.k===1?'mapleO':'maple',o.x+((f+o.p)>>4)%2,o.y));swim(bt,ctx,f,'pboat',1);
   l.forEach(o=>{o.y+=o.v*.5;o.x+=Math.sin((f+o.p)/6)*.5;if(o.y>H){o.y=-2;o.x=rnd()*W}ctx.fillStyle=(o.p%3===0)?'#F37A1F':(o.p%3===1)?'#C95A0E':'#FCB40C';ctx.fillRect(Math.round(o.x),Math.round(o.y),2,1);ctx.fillRect(Math.round(o.x)+((f>>2)%2),Math.round(o.y)+1,1,1)})}}
 if(kind==='stars'){ /* Đêm sao: sao nhấp nháy, trăng và bóng trăng, sứa phát sáng, sao băng, chùm sáng hải đăng */
  const t=N(Math.round(W*H/150)),je=N(per(55));je.forEach(o=>{o.y=14+o.y*.75});const mp=place(1,10,30,0,30)[0],mx=mp.x,my=mp.y+3;
  return(ctx,f)=>{t.forEach(o=>{const ph=(f+o.p)%24;ctx.fillStyle=ph<12?'#FCD655':'#FFFFFF';if(ph%6<4)ctx.fillRect(Math.round(o.x),Math.round(o.y),1,1)});
   IS.forEach(([cx,cy],k)=>{const a=(f/14+k*1.7)%(Math.PI*2),x=cx,y=cy-16;ctx.fillStyle='rgba(255,243,196,.13)';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a-.18)*55,y+Math.sin(a-.18)*28);ctx.lineTo(x+Math.cos(a+.18)*55,y+Math.sin(a+.18)*28);ctx.closePath();ctx.fill()});
   ctx.fillStyle='#FFF6C8';ctx.fillRect(mx,my,6,6);ctx.fillRect(mx+1,my-1,4,8);ctx.fillRect(mx-1,my+1,8,4);ctx.fillStyle='#33437F';ctx.fillRect(mx+3,my,4,5);
   for(let i=0;i<7;i++){if((i+(f>>2))%2)continue;ctx.fillStyle='#FFF6C8';const w=Math.max(2,8-i);ctx.fillRect(mx+2-w/2+((i*3+(f>>2))%3),my+14+i*3,w,1)}
   je.forEach(o=>{o.y-=.08*(1+((f+o.p)%16<8));if(o.y<10)o.y=H-4;const x=Math.round(o.x+Math.sin((f+o.p)/10)*2),y=Math.round(o.y),n=o.p%2?'jellyP':'jellyB';ctx.fillStyle=o.p%2?'rgba(251,185,218,.3)':'rgba(191,241,255,.3)';ctx.fillRect(x-1,y-1,7,7);blit(ctx,n,x,y)});
   const sf=f%90;if(sf<10){const x0=(Math.floor(f/90)*137)%W,y0=2;ctx.fillStyle='#FFFFFF';for(let i=0;i<5;i++){ctx.globalAlpha=1-i*.18;ctx.fillRect(x0+sf*4-i*2,y0+sf*2-i,2,1)}ctx.globalAlpha=1}}}
 if(kind==='sun'){ /* Hoàng hôn: mặt trời lặn nửa vầng, vệt nắng, chim bóng tối, thuyền buồm bóng tối */
  const bi=N(per(70)),bt=N(per(160));bi.forEach(o=>{o.y=3+o.y*.25});bt.forEach(o=>{o.y=Math.round(H*.6+o.y*.3);o.v*=.4});
  const sp0=place(1,30,30,0,34)[0],cx=sp0.x+15,cy=sp0.y+14; /* đặt mặt trời 1 lần (trước đây đặt lại mỗi khung hình → nhảy chỗ, chớp nháy) */
  return(ctx,f)=>{ctx.fillStyle='rgba(255,240,184,.35)';for(let r=0;r<13;r++){const w=Math.round(Math.sqrt(169-r*r))*2;ctx.fillRect(cx-w/2,cy-r,w,1)}
   ctx.fillStyle='#FFF0B8';for(let r=0;r<10;r++){const w=Math.round(Math.sqrt(100-r*r))*2;ctx.fillRect(cx-w/2,cy-r,w,1)}ctx.fillStyle='#FDB57E';ctx.fillRect(cx-12,cy+1,24,1);ctx.fillStyle='#F5926C';ctx.fillRect(cx-14,cy+2,28,1);
   for(let i=0;i<10;i++){const y=cy+5+i*3,w=Math.max(2,20-i*2)+((f+i*4)>>4)%2;if(y<H){ctx.fillStyle=i%2?'#FFE08A':'#FFF0B8';ctx.fillRect(Math.round(cx-w/2+Math.sin((f+i*3)/16)),y,w,1)}}
   bt.forEach(o=>{o.x+=o.v*.3;if(o.x>W+10)o.x=-10;blit(ctx,'boatH',o.x,o.y+((f>>3)%2))});
   bi.forEach(o=>{o.x+=o.v*.8;if(o.x>W+6)o.x=-6;const y=Math.round(o.y+Math.sin((f+o.p)/4));if((f+o.p)%6<3)blit(ctx,'birdH',o.x,y);else{ctx.fillStyle='#4B2A4A';ctx.fillRect(Math.round(o.x),y+1,5,1)}})}}
 return null}
