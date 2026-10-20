/* 44 — Hướng dẫn cho bài dùng tính chất, không cần tính lại:
   - swap: "Biết 1 + 7 = 8. Vậy 7 + 1 = ?" và "a + b = b + ☐" → đổi chỗ các số hạng (thừa số) thì kết quả không đổi.
   - rel:  "Biết 2 × 10 = 20. Vậy 20 : 2 = ?" → từ một phép nhân viết được hai phép chia.
   Đặt trước các dạng khác để không bị nhận nhầm thành bài tính (bàn tay, đếm thêm). */
const gdChip=(v,c)=>`<b class="gdchip" style="--cc:${c}">${fmt(v)}</b>`;
const GD_C1='#FCB40C',GD_C2='#3FC1EC',GD_C3='#1E9A52';
function gdSwapParse(q){const t=gdTxt(q.q),kd=q.kind||'';if(!/giao hoán/i.test(kd)&&!/^Biết/.test(t))return null;const N=GD_NUM;
 let m=t.match(new RegExp(`Biết\\s*(${N})\\s*([+×])\\s*(${N})\\s*=\\s*(${N})\\s*\\.?\\s*Vậy\\s*(${N})\\s*([+×])\\s*(${N})\\s*=\\s*\\?`));
 if(m){const a=gdN(m[1]),op=m[2],b=gdN(m[3]),c=gdN(m[4]),x=gdN(m[5]),y=gdN(m[7]);if(m[6]!==op||!((x===b&&y===a)||(x===a&&y===b)))return null;return{a,b,c,op,x,y,form:'know'}}
 m=t.match(new RegExp(`(${N})\\s*([+×])\\s*(${N})\\s*=\\s*(${N})\\s*([+×])\\s*☐`));
 if(m){const a=gdN(m[1]),op=m[2],b=gdN(m[3]),x=gdN(m[4]);if(m[5]!==op||x!==b)return null;return{a,b,op,x:b,y:a,form:'box'}}
 return null}
function gdFramesSwap(k){const F=[],{a,b,op}=k,ow=op==='+'?'phép cộng':'phép nhân',sh=op==='+'?'số hạng':'thừa số',res=op==='+'?'tổng':'tích';
 const top=k.form==='know'?`<div class="gdrel">${gdChip(a,GD_C1)} ${op} ${gdChip(b,GD_C2)} = ${gdChip(k.c,GD_C3)}</div>`:'',
  bot=(ans)=>k.form==='know'?`<div class="gdrel">${gdChip(k.x,k.x===a?GD_C1:GD_C2)} ${op} ${gdChip(k.y,k.y===a?GD_C1:GD_C2)} = ${ans==null?'<i class="gdq2">?</i>':gdChip(ans,GD_C3)}</div>`
   :(Math.max(a,b)>=100?`<div class="gdrels"><div class="gdrel sm">${gdChip(a,GD_C1)} ${op} ${gdChip(b,GD_C2)}</div><div class="gdrel sm">= ${gdChip(b,GD_C2)} ${op} ${ans==null?'<i class="gdq2">☐</i>':gdChip(ans,GD_C1)}</div></div>`:`<div class="gdrel">${gdChip(a,GD_C1)} ${op} ${gdChip(b,GD_C2)} = ${gdChip(b,GD_C2)} ${op} ${ans==null?'<i class="gdq2">☐</i>':gdChip(ans,GD_C1)}</div>`);
 const same=a===b;
 F.push({h:top+bot(null),say:k.form==='know'?(same?`Hai ${ow} giống hệt nhau: cùng là ${a} ${op==='+'?'cộng':'nhân'} ${b}.`:`Nhìn kỹ hai ${ow}: cùng có hai số ${fmt(a)} và ${fmt(b)}, chỉ đổi chỗ cho nhau.`):`Hai bên dấu bằng có cùng các ${sh}, chỉ đổi chỗ cho nhau.`,dur:3200});
 F.push({h:top+`<div class="gdswap">⇄</div>`+bot(null),say:`Đổi chỗ các ${sh} trong ${ow} thì ${res} không đổi. Không cần tính lại!`,dur:3000});
 const ans=k.form==='know'?k.c:a;
 F.push({h:top+bot(null),say:k.form==='know'?`Vậy ${fmt(k.x)} ${op==='+'?'cộng':'nhân'} ${fmt(k.y)} bằng mấy?`:'Ô trống là số nào?',dur:0,mcq:{q:k.form==='know'?`${fmt(k.x)} ${op} ${fmt(k.y)} = ?`:'Ô trống là?',opts:gdOpts(fmt(ans),k.form==='know'?[fmt(ans+1),fmt(Math.max(0,ans-1)),fmt(a===ans?b:a)]:[fmt(b),fmt(a+b)]),a:fmt(ans),ok:`Đúng rồi! ${k.form==='know'?`Giống ${fmt(a)} ${op} ${fmt(b)} = ${fmt(k.c)}.`:`Đổi chỗ thì vẫn là ${fmt(a)}.`}`,hint:k.form==='know'?`Nhìn phép tính đã biết ở trên: cùng hai số đó.`:`Số nào ở bên trái chưa có ở bên phải?`}});
 F.push({h:top+bot(ans),say:k.form==='know'?`${fmt(k.x)} ${op==='+'?'cộng':'nhân'} ${fmt(k.y)} cũng bằng ${fmt(k.c)}.`:`Ô trống là ${fmt(a)}.`,dur:2600});return F}
function gdRelParse(q){const t=gdTxt(q.q),N=GD_NUM;const m=t.match(new RegExp(`Biết\\s*(${N})\\s*×\\s*(${N})\\s*=\\s*(${N})\\s*\\.?\\s*Vậy\\s*(${N})\\s*:\\s*(${N})\\s*=\\s*\\?`));if(!m)return null;
 const a=gdN(m[1]),b=gdN(m[2]),c=gdN(m[3]),x=gdN(m[4]),y=gdN(m[5]);if(x!==c||(y!==a&&y!==b)||a*b!==c)return null;return{a,b,c,y,r:y===a?b:a}}
function gdFramesRel(k){const F=[],{a,b,c,y,r}=k,ca=GD_C1,cb=GD_C2,col=v=>v===a?ca:cb;
 const top=`<div class="gdrel">${gdChip(a,ca)} × ${gdChip(b,cb)} = ${gdChip(c,GD_C3)}</div>`,bot=ans=>`<div class="gdrel">${gdChip(c,GD_C3)} : ${gdChip(y,col(y))} = ${ans==null?'<i class="gdq2">?</i>':gdChip(ans,col(ans))}</div>`;
 F.push({h:top+bot(null),say:`Từ một phép nhân viết được hai phép chia. Lấy tích chia cho thừa số này thì được thừa số kia.`,dur:3400});
 F.push({h:top+bot(null),say:`${fmt(c)} chia ${fmt(y)} được mấy?`,dur:0,mcq:{q:`${fmt(c)} : ${fmt(y)} = ?`,opts:gdOpts(fmt(r),[fmt(y),fmt(r+1),fmt(c)]),a:fmt(r),ok:`Đúng rồi! Vì ${fmt(a)} × ${fmt(b)} = ${fmt(c)}.`,hint:`Trong phép nhân ở trên, ${fmt(y)} nhân với số nào thì được ${fmt(c)}?`}});
 F.push({h:top+bot(r),say:`${fmt(c)} chia ${fmt(y)} bằng ${fmt(r)}, vì ${fmt(a)} nhân ${fmt(b)} bằng ${fmt(c)}.`,dur:2800});return F}
GD_EXT.unshift({t:'swap',on:true,kind:gdSwapParse,frames:gdFramesSwap},{t:'rel',on:true,kind:gdRelParse,frames:gdFramesRel});
document.head.insertAdjacentHTML('beforeend',`<style>
.gdrel{display:flex;align-items:center;gap:8px;font-family:var(--f-display);font-size:34px;line-height:1;color:#1F2A5A}
.gdrels{display:flex;flex-direction:column;align-items:center;gap:10px}.gdrel.sm{font-size:28px}.gdchip{white-space:nowrap;font-weight:400;min-width:40px;height:44px;padding:0 6px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--cc) 25%,#fff);box-shadow:0 0 0 3px var(--cc)}
.gdq2{font-style:normal;min-width:40px;height:44px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px #C9D1E6;background:#fff;color:#E0441A}
.gdswap{font-size:34px;color:#E0441A;line-height:1}
</style>`);
