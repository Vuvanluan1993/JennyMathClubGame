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
function jenny(size,mood='idle'){const s=Math.round(size*.86),sp=JMOOD[mood]||'jenny';
  const fx=mood==='happy'||mood==='cheer'?`<span class="jfx s1">${spr('fxSpark',Math.round(size*.26))}</span><span class="jfx s2">${spr('fxSpark',Math.round(size*.2))}</span>`:mood==='sad'?`<span class="jfx tear">${spr('fxTear',Math.round(size*.16))}</span>`:'';
  return`<span class="jav jm-${mood}" style="width:${size}px;height:${size}px" aria-hidden="true"><span class="jbody">${spr(sp,s,'jf')}${mood==='idle'?spr('jennyBlink',s,'jf jblink'):''}</span>${fx}</span>`}
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
];
function cbVariant(name,he){const key=`${name}__${he.k}`;if(!PXS[key]&&PXS[name])PXS[key]=PXS[name].map(r=>r.replace(/./g,ch=>he.m[ch]||ch));return PXS[key]?key:name}
CBN.forEach(([s])=>CBHE.forEach(h=>cbVariant(s,h)));
/* gắn hệ màu cho mỗi trùm lớp (cố định theo đảo); giữ tên gốc, thêm tên hệ khi hiển thị */
{const _cbI=cbI;cbI=function(id){const b=_cbI(id);if(!b.he){const k=islIdx(id),he=CBHE[(k*5+3)%CBHE.length];b.he=he.k;b.baseSpr=b.spr;b.baseName=b.name;b.spr=cbVariant(b.spr,he);b.name=`${b.name} · ${he.n}`}return b}}
