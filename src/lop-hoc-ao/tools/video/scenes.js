const {chromium}=require('playwright');const L=require('./lib');
const HS='file:///home/claude/jennymathclubgame/games/lop-hoc-ao/index.html',FULL='file:///home/claude/jennymathclubgame/src/lop-hoc-ao/dist/lop-hoc-ao-jenny.html';
const W=ms=>new Promise(r=>setTimeout(r,ms));
const only=process.argv[2]?process.argv[2].split(','):null;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--autoplay-policy=no-user-gesture-required']});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const E=(p,f,a)=>p.evaluate(f,a);const T=(p,txt,sel)=>p.evaluate(([t,s])=>__click(t,s),[txt,sel]);const Q=(p,sel,i)=>p.evaluate(([s,i])=>__tapq(s,i),[sel,i||0]);
const ANS=async(p,bad,w)=>{await E(p,b=>__ans(b),bad);await W(w||1700);await E(p,()=>__next());await W(1100)};
const S={
 async s01(p){await E(p,()=>{localStorage.clear()});await p.reload();await W(900);p.__ready=Date.now();await W(700);
  await Q(p,'#lgU');await p.type('#lgU','jenny01',{delay:90});await Q(p,'#lgP');await p.type('#lgP','jenny123',{delay:90});await Q(p,'#lgN');await p.type('#lgN','Bảo Ngọc',{delay:90});
  await E(p,()=>__tap(document.querySelector('#lgR'),1));await p.check('#lgR');await W(300);await E(p,()=>__tap(document.querySelector('#lgForm button[type=submit],#lgForm button'))).catch(()=>{});await W(2800);
  await E(p,()=>{const s=document.getElementById('sea');if(s)return __hscroll(s,700,2500)});await W(600);await E(p,()=>{const s=document.getElementById('sea');if(s)return __hscroll(s,0,1200)});
  await E(p,()=>__scroll(1300,3200));await W(500);await E(p,()=>__scroll(0,1400));await W(600)},
 async s02(p){p.__ready=Date.now();await W(900);await Q(p,'.node.here');await W(2200);await T(p,'Nên xem');await W(3500);
  for(let i=0;i<3;i++){await T(p,'Tiếp →');await W(3600)}},
 async s03(p){await E(p,()=>{S.st[sid].gate=[];save()});p.__ready=Date.now();await W(900);await Q(p,'.node.here');await W(1800);await T(p,'Chơi');await W(3000);
  let did=0;for(let i=0;i<8;i++){const c=await E(p,()=>/Có mấy/.test(q1().q||''));const bad=(!did&&c&&i>0)?1:0;if(bad)did=1;await ANS(p,bad,bad?2400:1800);if(await E(p,()=>scr.end))break}await W(3500)},
 async s04(p){p.__ready=Date.now();await W(800);await Q(p,'.node.here');await W(1600);await T(p,'Chơi');await W(2200);await T(p,'Luyện ngay');await W(3000);
  await E(p,()=>__ans(1));await W(2500);if(!await E(p,()=>!!document.querySelector('.gdov'))){await T(p,'Xem hướng dẫn')}await W(11500);await T(p,'Em làm lại');await W(2000);await ANS(p,0,2000);await ANS(p,0,2200);await W(1500)},
 async s05(p){await E(p,()=>{S.st[sid].gate=[];save();go({k:'island',id:'g1b4t1'})});p.__ready=Date.now();await W(1500);
  if(!await E(p,()=>__row('Ếch nhảy')))await E(p,()=>startXG('frog','g1b4t1'));await W(2600);for(const bad of [0,0,1,0]){await E(p,b=>__ans(b),bad);await W(2300)}
  await W(300);if(!await E(p,()=>__row('Trồng cây')))await E(p,()=>startXG('plant','g1b4t1'));await W(2600);for(const bad of [0,0,0]){await E(p,b=>__ans(b),bad);await W(2600)}
  await W(300);if(!await E(p,()=>__row('Leo núi')))await E(p,()=>startXG('climb','g1b4t1'));await W(2800);for(const bad of [0,0]){await E(p,b=>__ans(b),bad);await W(3200)}},
 async s06(p){await E(p,()=>{S.st[sid].gate=[];save();go({k:'island',id:'g1b4t1'})});p.__ready=Date.now();await W(1200);const ok=await E(p,()=>__row('Kéo co'));if(!ok)await E(p,()=>startTug('g1b4t1'));await W(2500);
  for(let i=0;i<7;i++){await E(p,()=>__ans(0));await W(1400);if(await E(p,()=>scr.end))break}await W(2500)},
 async s07(p){p.__ready=Date.now();for(const g of [2,3,5]){await E(p,g=>{S.st[sid].grade=g;S.st[sid].gate=[];save();go({k:'home',tab:'map'});scrollTo(0,0)},g);await W(2400);await E(p,()=>__scroll(500,1500));await W(1000)}
  await E(p,()=>{S.st[sid].grade=1;save();go({k:'home',tab:'map'})});await W(500)},
 async s08(p){p.__ready=Date.now();await W(800);await T(p,'Nhà em','.bnav button');await W(2200);await T(p,'Sưu tập','.nhat');await W(2200);await E(p,()=>__scroll(900,3000));await W(1500)},
 async s09(p){await E(p,()=>{S.st[sid].coins=900;const s=ghSt(S.st[sid]);s.own=['palm','umb','flag','castle'];s.dec=['palm','umb','flag','castle'];save()});p.__ready=Date.now();await W(800);
  await T(p,'Cửa hàng','.bnav button');await W(1600);for(const n of ['Áo Bầu trời','Áo Siêu nhân Toán']){await T(p,n,'.ghit');await W(1400)}
  await T(p,'Mũ kính','.ghtab');await W(900);for(const n of ['Mũ phù thuỷ','Vương miện']){await T(p,n,'.ghit');await W(1400)}await Q(p,'.ghgo');await W(1800);
  await T(p,'Đồ nuôi','.ghtab');await W(1000);for(const n of ['Cá khô','Bóng']){await T(p,n,'.ghit');await W(900);await Q(p,'.ghgo');await W(1100)}
  await E(p,()=>scrollTo(0,0));await T(p,'Thú cưng','.ghtab');await W(1000);await T(p,'Rùa biển','.ghit');await W(3000);await Q(p,'.ghgo');await W(1500);
  await p.fill('#pnIn','').catch(()=>{});await p.type('#pnIn','Bin',{delay:150}).catch(()=>{});await W(600);await Q(p,'#pnOk');await W(1800);
  await T(p,'Cho ăn','.pbtn');await W(1200);await T(p,'Cá khô','.pkit');await W(1800);await E(p,()=>scrollTo(0,0));await W(500);await Q(p,'.ipet');await W(1000);await Q(p,'.ipet');await W(1300);
  await T(p,'Chơi','.pbtn');await W(1200);await T(p,'Bóng','.pkit');await W(2200);await E(p,()=>__scroll(380,1500));await W(2000)},
 async s10(p){await E(p,()=>{S.st[sid].gate=[];save()});p.__ready=Date.now();await W(1000);await Q(p,'#langSw button[data-l=en]');await W(2500);await Q(p,'.node.here');await W(2200);
  await T(p,'Play');await W(3000);for(const bad of [0,0]){await ANS(p,bad,2000)}
  await E(p,()=>{setLang('vi');S.st[sid].gate=[];save()});await W(300)},
};
const order=['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10'];
for(const k of order){if(only&&!only.includes(k))continue;const p=await L.open(b,HS,{ctx,name:k});await L.login(p);await W(400);
 try{await S[k](p)}catch(e){console.log(k,'ERR',e.message)}p.__end=Date.now();await L.finish(p,k)}
if(!only||only.includes('s11')){const p=await L.open(b,FULL,{ctx,name:'s11'});await W(800);await E(p,()=>__click('Giáo viên'));await W(1500);p.__ready=Date.now();await W(2500);await E(p,()=>__scroll(900,3500));await W(1500);await E(p,()=>scrollTo(0,0));await E(p,()=>__click('Phụ huynh'));await W(2500);await E(p,()=>__scroll(700,3000));await W(1500);p.__end=Date.now();await L.finish(p,'s11')}
await ctx.close();await b.close()})();
