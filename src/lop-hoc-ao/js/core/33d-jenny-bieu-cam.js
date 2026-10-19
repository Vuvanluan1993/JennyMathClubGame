/* ===================== JENNY: biểu cảm pixel + TRÙM LỚP: hệ màu ===================== */
/* Jenny: idle (nháy mắt, thở), happy (mắt cười, miệng mở, nhảy, lấp lánh), sad (lo lắng, rơm rớm, lắc đầu),
   cheer (giơ hai tay, nhảy ăn mừng), think (nghiêng đầu khi chờ lâu). */
{const J=PXS.jenny,row=(r,i,v)=>r.map((x,k)=>k===i?v:x);
 PXS.jennyBlink=row(J,7,".kssssssssssssk.");
 PXS.jennyHappy=[...J].map((r,i)=>({6:'.kssksssssskssk.',7:'.kskskssssksksk.',8:'.kscsskkkksscsk.',9:'.ksssskrrkssssk.'})[i]||r);
 PXS.jennySad=[...J].map((r,i)=>({5:'.kkkskkkkkkskkk.',8:'.kscbsskkssbcsk.',9:'.kssssksskssssk.'})[i]||r);
 PXS.jennyCheer=[...J].map((r,i)=>({6:'.kssksssssskssk.',7:'.kskskssssksksk.',8:'.kscsskkkksscsk.',9:'.ksssskrrkssssk.',10:'.skssssssssssks.',11:'..skkkkkkkkkks..',12:'...gggggggggg...'})[i]||r);
 PXS.fxSpark=["...y...","...y...","yyywyyy","...y...","...y..."];
 PXS.fxTear=[".b.","bwb","bbb",".b."];}
const JMOOD={idle:'jenny',happy:'jennyHappy',sad:'jennySad',cheer:'jennyCheer',think:'jenny'};
/* thay hàm jenny(): thêm tham số biểu cảm; mặc định vẫn nháy mắt nhẹ */
function jenny(size,mood='idle'){const s=Math.round(size*.86),of=typeof jOutfit==='function'?jOutfit():null,V=n=>of?ofVariant(n,of):n,sp=V(JMOOD[mood]||'jenny');
  const fx=mood==='happy'||mood==='cheer'?`<span class="jfx s1">${spr('fxSpark',Math.round(size*.26))}</span><span class="jfx s2">${spr('fxSpark',Math.round(size*.2))}</span>`:mood==='sad'?`<span class="jfx tear">${spr('fxTear',Math.round(size*.16))}</span>`:'';
  const acc=of&&OUTFIT[of]&&OUTFIT[of].acc?`<span class="jacc">${spr(OUTFIT[of].acc,Math.round(size*.34))}</span>`:'';
  return`<span class="jav jm-${mood}${of?' of-'+of:''}" style="width:${size}px;height:${size}px" aria-hidden="true"><span class="jbody">${spr(sp,s,'jf')}${mood==='idle'?spr(V('jennyBlink'),s,'jf jblink'):''}${acc}</span>${fx}</span>`}
/* biểu cảm theo màn chơi */
function jMood(g){if(!g)return'idle';if(g.end)return g.pass||g.won||g.ok?'cheer':'sad';if(g.sheet){return g.sheet.kind==='ok'?'happy':'sad'}return'idle'}

/* ----- Trùm lớp: hệ màu (đổi bảng màu sprite) ----- */
const CBHE=[
 {k:'lua',n:'Hệ Lửa',m:{b:'r',B:'R',p:'r',P:'R',g:'o',G:'O',c:'a',x:'a',e:'y',E:'o'},tag:'#F04A1B'},
 {k:'bang',n:'Hệ Băng',m:{r:'b',R:'B',p:'b',P:'B',g:'x',G:'b',o:'x',O:'B',c:'w',a:'e'},tag:'#12B5E8'},
 {k:'doc',n:'Hệ Độc',m:{r:'g',R:'G',b:'l',B:'G',p:'g',P:'G',o:'l',O:'G',c:'l'},tag:'#2AB563'},
 {k:'vang',n:'Hệ Vàng',m:{r:'a',R:'T',b:'y',B:'a',p:'a',P:'u',g:'y',G:'T',o:'y',O:'T',c:'t'},tag:'#FCB40C'},
 {k:'dem',n:'Hệ Bóng đêm',m:{r:'P',R:'k',b:'P',B:'k',p:'P',P:'k',g:'P',G:'k',o:'P',O:'k',c:'E',e:'E',w:'e',a:'E',y:'e'},tag:'#5E3A7A'},
 {k:'keo',n:'Hệ Kẹo ngọt',m:{r:'c',R:'p',b:'c',B:'p',g:'c',G:'p',o:'c',O:'p',p:'c',P:'R',e:'w'},tag:'#F26249'},
 {k:'cat',n:'Hệ Cát',m:{r:'a',R:'u',b:'t',B:'T',p:'t',P:'u',g:'t',G:'T',o:'T',O:'u',c:'y',x:'t'},tag:'#E2B85E'},
 {k:'phale',n:'Hệ Pha lê',m:{r:'p',R:'P',b:'x',B:'p',g:'x',G:'p',o:'x',O:'p',c:'w',a:'x',y:'e'},tag:'#8656A8'},
 {k:'thu',n:'Hệ Lá Thu',m:{r:'o',R:'R',b:'o',B:'O',g:'a',G:'o',p:'r',P:'R',c:'a',x:'a'},tag:'#F37A1F'},
 {k:'hh',n:'Hệ Hoàng hôn',m:{r:'c',R:'R',b:'a',B:'o',g:'a',G:'O',p:'c',P:'p',o:'c',O:'R',e:'t',x:'c'},tag:'#F26249'},
];
function cbVariant(name,he){const key=`${name}__${he.k}`;if(!PXS[key]&&PXS[name])PXS[key]=PXS[name].map(r=>r.replace(/./g,ch=>he.m[ch]||ch));return PXS[key]?key:name}
/* vùng biển → hệ trùm (Nhiệt đới giữ màu gốc) */
const BIOME_HE={trop:null,snow:'bang',volc:'lua',dese:'cat',cand:'keo',crys:'phale',jung:'doc',autu:'thu',nigh:'dem',suns:'hh'};
const heOf=k=>CBHE.find(h=>h.k===BIOME_HE[k])||null;
/* vùng biển của một đảo / một chủ đề */
function biomeOfTopic(g,ti){const T=PRIM[g]&&PRIM[g].T[ti];return biomeOf(g,ti,T?T[0]:'')}
function biomeOfIsl(id){const m=String(id).match(/^g(\d)/),x=isl1(id);if(!m||!x)return'trop';return biomeOfTopic(+m[1],x.ti||0)}
{const sp=new Set(CBN.map(c=>c[0]));for(const g in PRIM)(PRIM[g].boss||[]).forEach(b=>b&&sp.add(b[0]));sp.forEach(s=>CBHE.forEach(h=>cbVariant(s,h)))}
/* trùm chủ đề (trùm đảo): đổi màu theo vùng biển, thêm tên hệ */
for(const g in PRIM){if(!PRIM[g].boss||!PRIM[g].T)continue;PRIM[g].boss=PRIM[g].boss.map((b,ti)=>{if(!b)return b;const bk=biomeOfTopic(+g,ti),he=heOf(bk);const r=[he?cbVariant(b[0],he):b[0],b[1]];r.base=b[0];r.baseName=b[1];r.he=he?he.k:'bien';r.bk=bk;return r})}
/* trùm lớp: hệ theo vùng biển của đảo (tính lại mỗi lần, kể cả dữ liệu đã lưu) */
{const _cbI=cbI;cbI=function(id){const b=_cbI(id);if(!b.baseSpr){b.baseSpr=b.spr;b.baseName=b.name}const he=heOf(biomeOfIsl(id)),k=he?he.k:'bien';if(b.he!==k){b.he=k;b.spr=he?cbVariant(b.baseSpr,he):b.baseSpr;b.name=b.baseName}return b}}
