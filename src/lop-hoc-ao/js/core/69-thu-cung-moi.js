/* 69 — Thú cưng mới + các giai đoạn lớn lên (thầy yêu cầu 24/10/2026)
   - Mỗi loài có 4 hình theo giai đoạn: Bé · Lớn dần · Trưởng thành · Già (pet_<loài><0..3>), cùng lưới 16×14.
     Gà: gà con nhỏ → gà choai → gà mái; Rùa: mai lớn dần; Ếch: nòng nọc → ếch con còn đuôi → ếch lớn; Cún, Mèo: con nhỏ → lớn.
     Già: màu nhạt đi, lông mày bạc.
   - Loài mới: Ếch xanh 180 xu (60–80 ngày, đẻ trứng), Mèo con 280 xu (110–150 ngày), Cún con 300 xu (120–160 ngày). Mèo, Cún không đẻ trứng. */
Object.assign(PXS,{
 pet_chick0:["................", "................", "................", "................", "......kkkk......", ".....kyyyyk.....", "....kyyyyyyk....", "....kykyyyyk....", "...ooyyyyyyk....", "....kyyyyyyk....", ".....kyyyyk.....", "......koko......", ".......o.o......", "................"],
 pet_chick1:["................", "................", ".....kk.........", "....kyyk........", "...kyyyykk......", "...kykyyyyk.....", "..ooyyyyyyyk....", "...kyyyyyyyyk...", "...kyyyyyayyk...", "...kyyyyyyayk...", "....kyyyyyyk....", ".....kyyyyk.....", "......kokko.....", ".......o..o....."],
 pet_chick2:[".....r..........", "....rrr.........", "...krrr.........", "..kwwwwk.....k..", "..kwwwwkkkk.kwk.", ".oowkwwwwwwkwwwk", "..kwwwwwwwwwwwwk", "..krwwwwwwwwwwwk", "..krwwwwwwwwwwwk", "..kwwwwweeeewwk.", "...kwwwweeeewk..", "...kwwwwwwwwwk..", "....kkwwwwwkk...", "......kokko....."],
 pet_chick3:[".....r..........", "....rrr.........", "...krrr.........", "..kwwewk.....k..", "..kwwwwkkkk.kwk.", ".oowkwwwwwwkwwwk", "..kwwwwwwwwwwwwk", "..krwwwwwwwwwwwk", "..krwwwwwwwwwwwk", "..kwwwwwEEEEwwk.", "...kwwwwEEEEwk..", "...kwwwwwwwwwk..", "....kkwwwwwkk...", "......kokko....."],
 pet_turtle0:["................", "................", "................", "................", "................", "......kkkk......", ".....kGGGGk.k...", "....kGGGGGGksk..", "...kGGlGlGGsskk.", "....kssGGsssssk.", "....kssGGsskkk..", ".....kkkkkk.....", "................", "................"],
 pet_turtle1:["................", "................", "................", "................", "................", "....kkkkkkkk....", "...kGGGGGGGGkkk.", "..kGGGGGGGGGGssk", "..kGGlGlGlGGssks", "..kGGGGGGGGGGssk", "...kssGGGGsskkk.", "...ksskkkkssk...", "....kk....kk....", "................"],
 pet_turtle2:["................", "................", "................", "................", "....kkkkkkkk....", "...kGGGGGGGGk...", "..kGGGGGGGGGGk.k", ".kGGGGGGGGGGGGks", ".kGGlGlGlGlGlGss", ".kGGGGGGGGGGGGss", "..kGGGGGGGGGGkkk", "..kssGGGGGGGssk.", "..ksskkkkkkkssk.", "...kk.......kk.."],
 pet_turtle3:["................", "................", "................", "................", "....kkkkkkkk....", "...kTTTTTTTTk...", "..kTTTTTTTTTTk.k", ".kTTTTTTTTTTTTks", ".kTTlTlTlTlTlTss", ".kTTTTTTTTTTTTss", "..kTTTTTTTTTTkkk", "..kssTTTTTTTssk.", "..ksskkkkkkkssk.", "...kk.......kk.."],
 pet_pfrog0:["................", "................", "................", "................", "....kkkk........", "...kGGGGk.......", "..kGGGGGGkkk.k..", ".kGGwkGGGGGGkGk.", ".kGGGGGGGGGGGGk.", "..kGGGGGGkkkkkGk", "...kGGGGk.....k.", "....kkkk........", "................", "................"],
 pet_pfrog1:["................", "................", "................", "................", "...kkk..kkk.....", "..kgggkkgggk....", "..kgkwgggkwk....", "..kggggggggk....", "..kggggggggkkk..", "..kgggkgkggGGGk.", "..kggggkgggkkk..", "..kGGggggGGk....", "...kkkkkkkk.....", "................"],
 pet_pfrog2:["................", "....k......k....", "...kgkk..kkgk...", "..kggggkkggggk..", ".kggwkgkkggwkgk.", "..kgwkgggggwkk..", ".kggggggggggggk.", ".kggggggggggggk.", "kggcggkllkggcggk", "kggglllkklllgggk", ".kggllllllllggk.", "kGGGGllllllGGGGk", "kGGGGggggggGGGGk", ".kkkkkkkkkkkkkk."],
 pet_pfrog3:["................", "....k......k....", "...kwwk..kkww...", "..kllllkkllllk..", ".kllwklkkllwklk.", "..klwklllllwkk..", ".kllllllllllllk.", ".kllllllllllllk.", "kllcllkllkllcllk", "kllllllkkllllllk", ".kllllllllllllk.", "kGGGGllllllGGGGk", "kGGGGllllllGGGGk", ".kkkkkkkkkkkkkk."],
 pet_pdog0:["................", "................", "....kkkkkkkk....", "...knuuuuuunk...", "..knnnuuuunnnk..", "..knnnukuknnnk..", "..knnnuuuunnnk..", "...knucukucnk...", "...kuuuuuuuuuk..", "...kuuuuuuuuk...", "...kuuuuuuuuk...", "....kuuuuuuk....", "....kuukkkuuk...", ".....kk...kk...."],
 pet_pdog1:["................", "........k.kk....", ".......knkuuk...", "......knnuuuuk..", "......knnuuuuuk.", ".k...kknnuukuuk.", "kukkkuunnuutctk.", ".kuuuuuunuuttttk", ".kuuuuuuuuuutrk.", ".kuuuuuuuuuukk..", "..kuuuuuuuuk....", "...kuuuuuuk.....", "..kuukuukuuk....", "...kk.kk.kk....."],
 pet_pdog2:["................", "........k.kk....", ".......knkuukk..", "......knnuuuuuk.", "......knnuuuuuuk", ".k...kknnuukuuuk", "kukkkuunnuutctkk", ".kuuuuuunuuttttk", ".kuuunnnuuuutrk.", ".kuuunnnuuuukk..", ".kuuuuuuuuuuk...", "..kuuuuuuuuk....", "..kuukuukuuk....", "...kk.kk.kk....."],
 pet_pdog3:["................", "........k.kk....", ".......knkTTkk..", "......knnTTTTTk.", "......knnTwwTTTk", ".k...kknnTTkTTTk", "kTkkkTTnnTTtctkk", ".kTTTTTTnTTtteek", ".kTTTnnnTTTTtck.", ".kTTTnnnTTTTkk..", ".kTTTTTTTTTTk...", "..kTTTTTTTTk....", "..kTTkTTkTTk....", "...kk.kk.kk....."],
 pet_pcat0:["................", ".....k.....k....", "....kokkkkkok...", "....koooooook...", "....kooooook....", "....kookokok....", "....kcoooooc....", "....kooocook.k..", "...kooooooookok.", "...kooooooooook.", "...kooooooookk..", "....kooooook....", ".....kkkkkk.....", "................"],
 pet_pcat1:["................", "........k....k..", ".......kokkkkok.", ".......kooooook.", ".......kooooook.", ".k.....kooooook.", "kok.kkkkookokok.", "kokkooooococock.", "kokooooooooook..", "kokooooooookk...", ".koooooooook....", "..kkooooook.....", "..kookookook....", "...kk.kk.kk....."],
 pet_pcat2:["................", "........k....k..", ".......kokkkkok.", ".......kooooook.", ".......kooooook.", ".k.....kooooook.", "kokkkkkkookokok.", "kokoooooococock.", "koooOoOoOooook..", "koooOoOoOoook...", ".kooooooooook...", "..kooooooook....", "..kookookook....", "...kk.kk.kk....."],
 pet_pcat3:["................", "........k....k..", ".......kakkkkak.", ".......kaaaaaak.", ".......kaaaaaak.", ".k.....kaawawak.", "kakkkkkkaakakak.", "kakaaaaawcacacw.", "kaaaOaOaOaaaak..", "kaaaOaOaOaaak...", ".kaaaaaaaaaak...", "..kaaaaaaaak....", "..kaakaakaak....", "...kk.kk.kk....."],
});
PXS.pfrog=PXS.pet_pfrog2;PXS.pdog=PXS.pet_pdog2;PXS.pcat=PXS.pet_pcat2;
Object.assign(PET_SP,{pfrog:['Ếch xanh',180,60,80,'Lớn từ nòng nọc thành ếch con rồi ếch lớn. Thích sạch sẽ, cần tắm thường xuyên. Có thể đẻ trứng.'],
 pcat:['Mèo con',280,110,150,'Hiền, thích được cưng nựng và chơi đồ chơi. Sống khá lâu. Mèo không đẻ trứng.'],
 pdog:['Cún con',300,120,160,'Trung thành, ăn khoẻ, cần chơi mỗi ngày để vui. Sống lâu. Cún không đẻ trứng.']});
GH.find(c=>c.k==='pet').it.push(['pfrog','Ếch xanh',180],['pcat','Mèo con',280],['pdog','Cún con',300]);
const PET_EGG={chick:1,turtle:1,pfrog:1};
P_SC[0]=.82;P_SC[1]=.92;
const petStageName=p=>{const n='pet_'+p.sp+pStage(p);return PXS[n]?n:p.sp};
petSpr=function(p,H,cls){const st=S.st[sid],stg=pStage(p),nm=petStageName(p),sc=P_SC[stg],h=Math.round(H*sc),d=pxURI(nm),w=Math.round(h*d.w/d.h);let wear='';
 const g=p.wear&&ghSt(st).gear.find(x=>x.u===p.wear);if(g&&P_WEAR[g.id]&&stg>0){const[wn,x,y,ww]=P_WEAR[g.id],dd=pxURI(wn),W=w*ww;wear=`<img class="px pwear" src="${dd.u}" alt="" style="left:${x*w}px;top:${y*h}px;width:${W}px;height:${W*dd.h/dd.w}px">`}
 return`<span class="pspr st${stg} ${p.sick?'sick':''} ${cls||''}" style="width:${w}px;height:${h}px">${spr(nm,h)}${wear}</span>`};
{const _p=petSim;petSim=function(st){const r=_p.apply(this,arguments);try{const P=petsOf(st),n=P.eggs.length;P.eggs=P.eggs.filter(e=>PET_EGG[e.sp]);if(P.eggs.length<n)P.ev=P.ev.filter(e=>!/Có trứng mới/.test(e.msg))}catch(e){}return r}}
Object.assign(I18N,{'Ếch xanh':'Green frog','Mèo con':'Kitten','Cún con':'Puppy'});
