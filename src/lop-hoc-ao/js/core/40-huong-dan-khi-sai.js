/* 40 — Hướng dẫn khi làm sai (Lô 1)
   Sai lần 1: hiện nút "Xem hướng dẫn". Sai lần 2: hướng dẫn tự mở.
   Xem xong: em làm lại đúng câu đó (không mất tim), rồi làm thêm 1 câu tương tự.
   Chỉ trong màn học và Luyện lỗi (không áp dụng Đua giờ, Kho báu, Trùm lớp).
   Dạng có hướng dẫn:
   - Lớp 1, cộng/trừ trong phạm vi 10: hai bàn tay ngửa (gộp, đếm thêm, gập bớt, tìm số còn thiếu).
   - Lớp 2, cộng/trừ trong phạm vi 20: ếch nhảy trên tia số, qua 10 thì nhảy 2 chặng, có khung 10 ô.
   - Toán có lời văn (lớp 2–5): câu hỏi gợi ý trắc nghiệm từng bước; tổng–hiệu, tổng–tỉ, hiệu–tỉ có sơ đồ đoạn thẳng. */

/* ---------- bàn tay ngửa pixel ---------- */
import { hooks } from './00-hooks.js';
import { fmt } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { addCoins } from './11-sao-va-mo-khoa.js';
import { render } from './13-giao-dien-chung.js';
import { pixelize, pxURI, spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { isl1, next1, q1, right1, sayFull, sayJ, show1 } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { curG, ju1 } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { sfx } from './33b-am-thanh.js';
import { xgRec } from './37-tro-choi-dot-1.js';
import { ktClean } from './39e-kien-thuc-tro-choi.js';
const HAND_CACHE={};
function gdHand(f,mirror,nums,w){const key=f.join('')+(mirror?'m':'')+(nums||[]).join('.');let svg=HAND_CACHE[key];
 const S=4/3,W=56,H=56;let lab='';
 if(!svg){const own={},col={},kind={};
  const SK='#F7C99B',SH='#E3A574',SD='#C98A5A',LT='#FCDDBC',K='#1F2A5A',Y='#FCB40C',RD='#E0441A';
  const FD=[[12.6,24,-20,10.5],[16.4,22.2,-8,13.5],[20.4,21.6,1,14.5],[24.4,22.4,10,13]];
  const segD=(x,y,ax,ay,bx,by)=>{const vx=bx-ax,vy=by-ay,l2=vx*vx+vy*vy,t=Math.max(0,Math.min(1,((x-ax)*vx+(y-ay)*vy)/l2));const dx=x-ax-t*vx,dy=y-ay-t*vy,l=Math.sqrt(l2);return[Math.hypot(dx,dy),(dx*vy-dy*vx)/l,t,t*l]};
  const cap=(o,ax,ay,bx,by,r,paint)=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++){const [d,side,t,along]=segD((x+.5)/S,(y+.5)/S,ax,ay,bx,by);if(d<=r){const k=x+','+y;own[k]=o;col[k]=paint(side,t,along)}}};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const nx=((x+.5)/S-20.2)/8.8,ny=((y+.5)/S-30.5)/8.6;if(Math.pow(Math.abs(nx),2.5)+Math.pow(Math.abs(ny),2.5)<=1){const k=x+','+y;own[k]=-1;col[k]=x/S>=26&&y/S>=29?SH:(x/S<=13?SH:SK)}}
  const crease=[[13,26],[14,26],[15,25],[16,25],[17,25],[18,25],[19,25],[20,26],[13,29],[14,28],[15,28],[16,28],[17,28],[18,29],[19,29],[22,27],[22,28],[22,29],[22,30],[23,31],[23,32],[24,33],[24,34]];
  for(const [x0,y0] of crease)for(const ex of [0,1]){const k=(Math.round(x0*S)+ex)+','+Math.round(y0*S);if(own[k]===-1)col[k]=SD}
  for(let i=0;i<4;i++){const [bx,by,ang,len]=FD[i],st=f[i],a=ang*Math.PI/180;
   if(st===1||st===2){const tx=bx+Math.sin(a)*len,ty=by-Math.cos(a)*len;
    cap(i,bx,by+2,tx,ty,2.1,(side,t,al)=>{const L=len+2,c1=L*0.38,c2=L*0.66,c0=1.4;if(Math.abs(al-c1)<.4||Math.abs(al-c2)<.4||Math.abs(al-c0)<.4)return Math.abs(side)<1.5?SD:SH;if(side<-1.1)return SH;return al>L-2.6?LT:SK})}
   else{const top=by-2.2,bot=by+6.4,cx=bx+(i===0?0.5:i===3?-0.2:0);
    cap(i,cx,top,cx,bot,2.3,(side,t,al)=>{const L=bot-top;if(al>L-3.2){if(Math.abs(side)>1.45)return st===3?'#E9A9A0':'#E8B49A';if(al>L-1.0)return '#FFFFFF';return st===3?'#F5BDB4':'#F8D2C6'}
     if(Math.abs(al-L*0.36)<.5)return SD;if(side<-1.2)return SH;if(al<1.4)return LT;return '#F4C292'});kind[i]='fold'}}
  {const st=f[4];if(st===1||st===2){const bx=26.8,by=31,tx=36,ty=21.8;cap(4,bx,by,tx,ty,2.35,(side,t,al)=>{const L=Math.hypot(tx-bx,ty-by);if(Math.abs(al-L*0.5)<.4)return SD;if(side<-1.2)return SH;return al>L-2.6?LT:SK})}
   else{const bx=28,by=33.6,tx=19.6,ty=33;cap(4,bx,by,tx,ty,2.3,(side,t,al)=>{const L=Math.hypot(tx-bx,ty-by);if(al>L-2.6){if(Math.abs(side)>1.45)return '#E8B49A';if(al>L-0.9)return '#FFFFFF';return st===3?'#F5BDB4':'#F8D2C6'}if(Math.abs(al-L*0.45)<.5)return SD;if(side>1.2)return SH;return '#F4C292'});kind[4]='fold'}}
  const isNew=o=>o>=0&&f[o]===2,isGo=o=>o>=0&&f[o]===3,oc=o=>isNew(o)?Y:isGo(o)?RD:K;const out={};
  for(const k in col){const [x,y]=k.split(',').map(Number);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=(x+dx)+','+(y+dy);if(col[n]===undefined){const c=oc(own[k]);if(!out[n]||c!==K)out[n]=c}}}
  for(const k in col){const [x,y]=k.split(',').map(Number),o=own[k];if(o<0)continue;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=(x+dx)+','+(y+dy),p=own[n];if(p===undefined||p===o)continue;
    if(p>=0&&p!==o&&y<25*S)col[k]=oc(o);else if(p===-1&&kind[o]==='fold')col[k]=oc(o)}}
  /* gộp các ô cùng màu trên một hàng để SVG nhẹ */
  const rows={};for(const m of [col,out])for(const k in m){const [x,y]=k.split(',').map(Number);(rows[y]=rows[y]||{})[x]=m[k]}
  let r='';for(const y in rows){const xs=Object.keys(rows[y]).map(Number).sort((a,b)=>a-b);let i=0;while(i<xs.length){let j=i;while(j+1<xs.length&&xs[j+1]===xs[j]+1&&rows[y][xs[j+1]]===rows[y][xs[i]])j++;r+=`<rect x="${xs[i]}" y="${y}" width="${xs[j]-xs[i]+1.04}" height="1.04" fill="${rows[y][xs[i]]}"/>`;i=j+1}}
  svg=HAND_CACHE[key]=`<svg viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" style="display:block;width:100%;height:auto;${mirror?'transform:scaleX(-1)':''}">${r}</svg>`}
 /* nhãn số trên đầu ngón (toạ độ phần trăm để co giãn theo bề rộng) */
 const FD=[[12.6,24,-20,10.5],[16.4,22.2,-8,13.5],[20.4,21.6,1,14.5],[24.4,22.4,10,13]];
 for(let i=0;i<5;i++){const st=f[i];let x,y;
  if(i<4){const [bx,by,ang,len]=FD[i],a=ang*Math.PI/180;if(st===1||st===2){x=(bx+Math.sin(a)*(len+3.6))*S;y=(by-Math.cos(a)*(len+3.6))*S}else{x=bx*S;y=(by-4)*S}}
  else{if(st===1||st===2){x=(36+Math.sin(.9)*3.4)*S;y=(21.8-Math.cos(.9)*3.4)*S}else{x=24*S;y=27*S}}
  if(mirror)x=W-x;const L=(x/W*100).toFixed(1),T=(y/H*100).toFixed(1);
  if(st===3)lab+=`<b class="gdarr" style="left:${L}%;top:${T}%">▼</b>`;
  else if(nums&&nums[i]&&st)lab+=`<b class="gdnum${st===2?' new':''}" style="left:${L}%;top:${T}%">${nums[i]}</b>`}
 return `<div class="gdhand" style="width:${w||'min(44vw,168px)'}">${svg}${lab}</div>`}
/* 10 ngón: k = 0..9, tay trái trước, đi từ trái sang phải trên màn hình */
/* thứ tự giơ ngón mỗi tay: trỏ, giữa, áp út, út, cái (thầy giữ như cũ); khi đếm thì đếm các ngón đã giơ từ trái sang phải (GD_SCR) */
const GD_ORD_L=[3,2,1,0,4],GD_ORD_R=[3,2,1,0,4];
function gdHands(st,nums){/* st[k]: 0 gập,1 duỗi,2 mới,3 đang gập ; nums[k] */const L=[0,0,0,0,0],R=[0,0,0,0,0],nl=[0,0,0,0,0],nr=[0,0,0,0,0];
 for(let k=0;k<10;k++){const h=k<5?L:R,n=k<5?nl:nr,i=(k<5?GD_ORD_L:GD_ORD_R)[k%5];h[i]=st[k]||0;n[i]=nums&&nums[k]||0}
 return `<div class="gdhands">${gdHand(L,true,nl)}${gdHand(R,false,nr)}</div>`}

/* ---------- nhận dạng câu ---------- */
export const GD_NUM='\\d+(?:[  .]\\d{3})*(?:,\\d+)?';
export const gdN=s=>Number(String(s).replace(/[  .]/g,'').replace(',','.'));
export const gdTxt=h=>(typeof ktClean==='function'?ktClean(h):String(h||'').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
function gdOp(q){/* phép tính một bước a op b = c, hoặc có ô trống ☐ */const t=gdTxt(q.q),s=gdTxt(q.sol);
 let m=t.match(/(\d+|☐)\s*([+−-])\s*(\d+|☐)\s*=\s*(\d+|☐)/);
 if(m&&/☐/.test(m[0])){const v=x=>x==='☐'?null:+x;const a=v(m[1]),b=v(m[3]),c=v(m[4]),op=m[2]==='+'?'+':'−';
  const A=a!=null?a:op==='+'?c-b:c+b,B=b!=null?b:op==='+'?c-a:a-c,C=c!=null?c:op==='+'?a+b:a-b;return{a:A,b:B,c:C,op,miss:a==null?'a':b==null?'b':c==null?'c':null}}
 {const m2=t.match(/(\d+)\s*([+−-])\s*(\d+)\s*=\s*\?/);if(m2){const a=+m2[1],b=+m2[3],op=m2[2]==='+'?'+':'−';return{a,b,c:op==='+'?a+b:a-b,op,miss:'c'}}}
 m=s.match(/(\d+)\s*([+−-])\s*(\d+)\s*=\s*(\d+)/)||t.match(/(\d+)\s*([+−-])\s*(\d+)\s*=\s*(\d+)/);
 if(!m){m=t.match(/(\d+)\s*([+−-])\s*(\d+)\s*=\s*\?/);if(m){const a=+m[1],b=+m[3],op=m[2]==='+'?'+':'−';return{a,b,c:op==='+'?a+b:a-b,op,miss:'c'}}return null}
 const a=+m[1],b=+m[3],c=+m[4],op=m[2]==='+'?'+':'−';if((op==='+'?a+b:a-b)!==c)return null;
 /* chỉ nhận khi phép tính trong lời giải là toàn bộ lời giải (một bước) */
 if((s.match(/\d\s*[+−×:]\s*\d/g)||[]).length>1&&!/gồm/.test(s))return null;return{a,b,c,op,miss:'c'}}
function gdWord(q){const t=gdTxt(q.q);return /Hỏi|bao nhiêu|mấy/.test(t)&&t.length>38&&/[.,]/.test(t.replace(/\?$/,''))}
export function gdKind(q){if(!q||!q.sol)return null;const G=(typeof curG==='function'?curG():1),kd=q.kind||'',s=gdTxt(q.sol);
 if(/tổng và tỉ/i.test(kd)){const m=s.match(new RegExp(`Tổng số phần:\\s*(\\d+)\\s*\\+\\s*(\\d+)\\s*=\\s*(\\d+)\\.\\s*Một phần:\\s*(${GD_NUM})\\s*:\\s*\\d+\\s*=\\s*(${GD_NUM})\\.\\s*([^:]+):\\s*${GD_NUM}\\s*×\\s*(\\d+)`));if(m)return{t:'sr',m:+m[1],n:+m[2],p:+m[3],S:gdN(m[4]),u:gdN(m[5]),who:m[6].trim(),k:+m[7]}}
 if(/hiệu và tỉ/i.test(kd)){const m=s.match(new RegExp(`Hiệu số phần:\\s*(\\d+)\\s*−\\s*(\\d+)\\s*=\\s*(\\d+)\\.\\s*Một phần:\\s*(${GD_NUM})\\s*:\\s*\\d+\\s*=\\s*(${GD_NUM})\\.\\s*([^:]+):\\s*${GD_NUM}\\s*×\\s*(\\d+)`));if(m)return{t:'dr',n:+m[1],m:+m[2],p:+m[3],D:gdN(m[4]),u:gdN(m[5]),who:m[6].trim(),k:+m[7]}}
 if(/tổng và hiệu/i.test(kd)){const m=s.match(new RegExp(`(?:Nửa chu vi:\\s*(${GD_NUM})\\s*:\\s*2\\s*=\\s*(${GD_NUM})[^.]*\\.\\s*)?([^:.]+):\\s*\\((${GD_NUM})\\s*([+−])\\s*(${GD_NUM})\\)\\s*:\\s*2\\s*=\\s*(${GD_NUM})`));if(m)return{t:'sd',half:m[1]?gdN(m[1]):0,S:gdN(m[4]),op:m[5],D:gdN(m[6]),who:m[3].trim(),ans:gdN(m[7])}}
 const o=gdOp(q);
 if(G===1&&o&&Math.max(o.a,o.b,o.c)<=10&&o.c>=0)return{t:'hand',...o};
 if(gdWord(q)&&(G>=2||!o||Math.max(o.a,o.b,o.c)>10)){const w=gdSteps(q);if(w&&gdAnsOk(q,w[w.length-1].r))return{t:'word',steps:w}}
 if(G===2&&o&&Math.max(o.a,o.b,o.c)<=20&&o.c>=0&&o.b>0)return{t:'line',...o};
 return null}
function gdAnsOk(q,r){if(/%/.test(gdTxt(q.sol)))return false;let a=q.type==='num'?String(q.a):q.type==='opt'&&q.opts[q.a]?gdTxt(q.opts[q.a].h||q.opts[q.a]):'';if(/%|⁄|km|tấn|tạ|yến/.test(a))return false;const m=a.match(new RegExp(GD_NUM));if(!m)return q.type!=='num';return Math.abs(gdN(m[0])-gdN(r))<1e-9}
/* các bước tính trong lời giải: "a op b (op c…) = r" */
function gdSteps(q){if(/(^|[\s(])dư[\s)]/.test(gdTxt(q.sol)))return null;const s=gdTxt(q.sol).replace(/\(([^()]*[a-zà-ỹ][^()]*)\)/gi,' ');const re=new RegExp(`(\\(?${GD_NUM}\\)?(?:\\s*[+−×:]\\s*\\(?${GD_NUM}\\)?)+)\\s*=\\s*(${GD_NUM})`,'g');const out=[];let m;
 while((m=re.exec(s))&&out.length<4){const e=m[1].replace(/\s+/g,' ').trim(),ops=(e.match(/[+−×:]/g)||[]);if(!ops.length)continue;let r=m[2],rest=s.slice(m.index+m[0].length);
  if(/^\s*⁄/.test(rest))return null;
  const ch=new RegExp(`^\\s*(?:[+−×:]\\s*${GD_NUM}\\s*)*=\\s*(${GD_NUM})`);let c;while((c=rest.match(ch))){r=c[1];rest=rest.slice(c[0].length);re.lastIndex=s.length-rest.length}
  out.push({e,r,op:ops[0]})}
 if(out.length>3)return null;
 return out.length?out:null}

/* ---------- dựng các khung hoạt cảnh ---------- */
export const gdEq=(h)=>`<div class="gdeq">${h}</div>`;
const OPW={'+':'cộng','−':'trừ','×':'nhân',':':'chia'};
/* thứ tự các ngón trên màn hình, từ trái sang phải (k theo thứ tự giơ ngón) */
const GD_SCR=[4,0,1,2,3,8,7,6,5,9];
function gdFramesHand(o){const F=[],st=Array(10).fill(0),nums=Array(10).fill(0),snap=(say,eq,dur)=>{if(eq)snap.e=eq;F.push({h:gdHands(st.slice(),nums.slice())+(snap.e?gdEq(snap.e):''),say,dur})};
 /* đếm lần lượt các ngón thoả sel theo thứ tự từ trái sang phải */
 const count=(sel,start,first)=>{let n=start;for(const k of GD_SCR)if(sel(k)){n++;nums[k]=n;snap(first&&n===start+1?`${first}${n}`:`${n}`,null,n===start+1?900:650)}return n};
 const {a,b,c,op,miss}=o;
 if(op==='+'&&miss==='c'&&a<=5&&b<=5&&b>0){/* cộng gộp: mỗi tay một số */
  snap(`Mình dùng hai bàn tay nhé. Ngửa hai tay ra, nắm hết các ngón lại.`,`${a} + ${b} = ?`,1400);
  for(let k=0;k<a;k++)st[k]=1;snap(`Tay trái giơ ${a} ngón.`,`${a} + ${b} = ?`,1700);
  for(let k=5;k<5+b;k++)st[k]=1;snap(`Tay phải giơ ${b} ngón.`,`${a} + ${b} = ?`,1700);
  count(k=>st[k],0,'Đếm từ trái sang phải nào: ');
  snap(`${a} ngón với ${b} ngón là ${c} ngón. ${a} cộng ${b} bằng ${c}.`,`${a} + ${b} = <em>${c}</em>`,2600);return F}
 if(op==='+'&&miss==='c'){/* đếm thêm từ số lớn: giơ thêm các ngón mới rồi đếm tiếp từ trái sang phải */const big=Math.max(a,b),sm=Math.min(a,b);
  snap(sm===0?`Cộng với 0 thì không thêm ngón nào.`:big!==a?`Em lấy số lớn hơn là ${big}, rồi đếm thêm ${sm}.`:`Giơ ${big} ngón trước, rồi đếm thêm ${sm}.`,`${a} + ${b} = ?`,1700);
  for(let k=0;k<big;k++)st[k]=1;snap(`Đây là ${big} ngón. Nhớ số ${big} trong đầu.`,`${a} + ${b} = ?`,1800);
  if(sm){for(let k=big;k<big+sm;k++)st[k]=2;snap(`Giơ thêm ${sm} ngón, viền vàng.`,null,1500);count(k=>st[k]===2,big,`${big}, đếm tiếp: `)}
  snap(`${big} đếm thêm ${sm} là ${c}. ${a} cộng ${b} bằng ${c}.`,`${a} + ${b} = <em>${c}</em>`,2600);return F}
 if(op==='+'){/* tìm số hạng còn thiếu: giơ số đã biết, giơ thêm đến khi đủ tổng */const known=miss==='a'?b:a,need=c-known,eq=miss==='a'?`☐ + ${b} = ${c}`:`${a} + ☐ = ${c}`;
  snap(`Cần ${c} ngón. Đã có ${known} ngón.`,eq,1800);for(let k=0;k<known;k++)st[k]=1;snap(`Giơ ${known} ngón. Nhớ số ${known} trong đầu.`,eq,1600);
  for(let k=known;k<c;k++)st[k]=2;snap(`Giơ thêm cho đủ ${c} ngón, viền vàng.`,null,1500);count(k=>st[k]===2,known,`${known}, đếm tiếp: `);
  snap(`Giơ thêm ${need} ngón nữa mới đủ ${c}. Ô trống là ${need}.`,eq.replace('☐',`<em>${need}</em>`),2600);return F}
 /* phép trừ: các ngón bị gập là các ngón giơ sau cùng; gập và đếm theo thứ tự từ trái sang phải */
 const foldSet=(from,to)=>{const S=new Set();for(let k=from;k<to;k++)S.add(k);return S};
 const foldCount=(S,say0)=>{let j=0;for(const k of GD_SCR)if(S.has(k)){j++;st[k]=3;snap(j===1?`${say0}1`:`${j}`,null,750);st[k]=0}};
 if(miss==='c'){
  snap(`Giơ ${a} ngón trước nhé.`,`${a} − ${b} = ?`,1500);for(let k=0;k<a;k++)st[k]=1;snap(`Đây là ${a} ngón.`,`${a} − ${b} = ?`,1500);
  if(b===0){snap(`Bớt 0 ngón thì vẫn còn ${a} ngón.`,`${a} − 0 = <em>${a}</em>`,2400);return F}
  foldCount(foldSet(a-b,a),`Gập xuống ${b} ngón: `);
  snap(`Còn lại mấy ngón? Mình đếm từ trái sang phải nhé.`,null,1300);count(k=>st[k],0,'');
  snap(c===0?`Gập hết rồi, không còn ngón nào. ${a} trừ ${b} bằng 0.`:`Còn lại ${c} ngón. ${a} trừ ${b} bằng ${c}.`,`${a} − ${b} = <em>${c}</em>`,2600);return F}
 if(miss==='b'){/* a − ☐ = c: gập dần đến khi còn c ngón */const eq=`${a} − ☐ = ${c}`;
  snap(`Giơ ${a} ngón. Gập bớt đến khi còn ${c} ngón.`,eq,1800);for(let k=0;k<a;k++)st[k]=1;snap(`Đây là ${a} ngón.`,eq,1400);
  foldCount(foldSet(c,a),'Gập: ');count(k=>st[k],0,'Còn lại: ');
  snap(`Gập ${a-c} ngón thì còn ${c} ngón. Ô trống là ${a-c}.`,eq.replace('☐',`<em>${a-c}</em>`),2600);return F}
 /* ☐ − b = c: còn c ngón, giơ lại b ngón đã gập rồi đếm tất cả */const eq=`☐ − ${b} = ${c}`;
 snap(`Sau khi gập ${b} ngón thì còn ${c} ngón. Lúc đầu có mấy ngón?`,eq,2000);for(let k=0;k<c;k++)st[k]=1;snap(`Đây là ${c} ngón còn lại.`,eq,1400);
 for(let k=c;k<c+b;k++)st[k]=2;snap(`Giơ lại ${b} ngón đã gập, viền vàng. Đếm tất cả từ trái sang phải.`,null,1800);count(k=>st[k],0,'');
 snap(`Lúc đầu có ${a} ngón. Ô trống là ${a}.`,eq.replace('☐',`<em>${a}</em>`),2600);return F}

/* tia số 0–20 với ếch */
function gdLine(lo,hi,frog,jumps,marks){const W=320,x=v=>14+(v-lo)*(W-28)/(hi-lo);let s=`<svg viewBox="0 0 ${W} 110" class="gdline" shape-rendering="crispEdges">`;
 for(const j of jumps){const x1=x(j[0]),x2=x(j[1]),mx=(x1+x2)/2,c=j[2]||'#E0441A',h=18+Math.abs(x2-x1)*.22;s+=`<path d="M${x1} 60 Q ${mx} ${60-h*1.6} ${x2} 60" fill="none" stroke="${c}" stroke-width="3"/><text x="${mx}" y="${56-h*.85}" text-anchor="middle" font-family="VT323" font-size="18" fill="${c}">${j[1]>j[0]?'+':'−'}${Math.abs(j[1]-j[0])}</text>`}
 s+=`<rect x="8" y="62" width="${W-16}" height="4" fill="#1F2A5A"/>`;
 const MK=(marks||[]).slice().sort((a,b)=>a-b),low=new Set();MK.forEach((v,i)=>{if(i&&v-MK[i-1]===1&&!low.has(MK[i-1]))low.add(v)});
 for(let v=lo;v<=hi;v++){const big=v%5===0,hl=(marks||[]).includes(v),ten=v===10;if(!hl&&big&&MK.some(m=>Math.abs(m-v)===1))continue;s+=`<rect x="${x(v)-1}" y="${big?56:59}" width="${hl||ten?4:2}" height="${big?16:10}" fill="${ten?'#FCB40C':hl?'#E0441A':'#1F2A5A'}"/>`;if(big||hl)s+=`<text x="${x(v)}" y="${low.has(v)?106:90}" text-anchor="middle" font-family="VT323" font-size="${hl?21:16}" fill="${hl?'#E0441A':ten?'#B37A00':'#1F2A5A'}">${v}</text>`}
 s+=`<image href="${pxURI('frog').u}" x="${x(frog)-15}" y="30" width="30" height="${30*pxURI('frog').h/pxURI('frog').w}" style="image-rendering:pixelated"/></svg>`;return s}
function gdTen(cells){/* cells: mảng màu 20 ô (2 khung 10 ô) */const box=a=>`<div class="gdtf">${a.map(c=>`<i style="background:${c||'#fff'}"></i>`).join('')}</div>`;return `<div class="gdtfs">${box(cells.slice(0,10))}${box(cells.slice(10,20))}</div>`}
function gdFramesLine(o){const F=[],{a,b,c,op}=o,Y='#FCB40C',G='#1E9A52',B='#0079C1',R='#E0441A';const add=(h,say,dur,mcq)=>F.push({h:/gdeq/.test(h)?h:h+gdEq(`${a} ${op} ${b} = ?`),say,dur,mcq});
 const tf=(n1,c1,n2,c2)=>{const a=Array(20).fill('');for(let i=0;i<n1;i++)a[i]=c1;for(let i=n1;i<n1+n2;i++)a[i]=c2;return gdTen(a)};
 const eq0=`${a} ${op} ${b} = ?`;
 if(op==='+'){const toTen=10-a,cross=a<10&&c>10,r=b-toTen;
  add(gdLine(0,20,a,[],[a])+tf(a,Y,0,'')+gdEq(eq0),`Ếch đứng ở số ${a}. Mình nhảy thêm ${b} bước.`,2000);
  if(cross){add(gdLine(0,20,a,[],[a])+tf(a,Y,0,'')+gdEq(eq0),`${a} thêm mấy thì được 10?`,0,{q:`${a} thêm mấy thì được 10?`,opts:gdOpts(toTen,[toTen-1,toTen+1,b]),a:String(toTen),ok:`Đúng rồi! ${a} thêm ${toTen} là 10.`,hint:`Đếm các ô trắng còn lại trong khung 10 ô.`});
   for(let v=a+1;v<=10;v++)add(gdLine(0,20,v,[[a,v]],[a,v])+tf(a,Y,v-a,G)+gdEq(eq0),v===10?`10. Đủ một chục!`:`${v}`,700);
   add(gdLine(0,20,10,[[a,10]],[a,10])+tf(a,Y,toTen,G)+gdEq(`${b} = ${toTen} + <em>${r}</em>`),`${b} tách thành ${toTen} và ${r}. Còn phải nhảy ${r} bước nữa.`,2600);
   for(let v=11;v<=c;v++){const cells=Array(20).fill('');for(let i=0;i<a;i++)cells[i]=Y;for(let i=a;i<10;i++)cells[i]=G;for(let i=10;i<v;i++)cells[i]=B;add(gdLine(0,20,v,[[a,10],[10,v,B]],[a,10,v])+gdTen(cells),`${v}`,700)}
   const cells=Array(20).fill('');for(let i=0;i<a;i++)cells[i]=Y;for(let i=a;i<10;i++)cells[i]=G;for(let i=10;i<c;i++)cells[i]=B;
   add(gdLine(0,20,c,[[a,10],[10,c,B]],[a,10,c])+gdTen(cells)+gdEq(`${a} + ${b} = <em>${c}</em>`),`Nhảy ${toTen} bước tới 10, rồi ${r} bước nữa tới ${c}. ${a} cộng ${b} bằng ${c}.`,3000)}
  else{for(let v=a+1;v<=c;v++){const cells=Array(20).fill('');for(let i=0;i<a;i++)cells[i]=Y;for(let i=a;i<v;i++)cells[i]=G;add(gdLine(0,20,v,[[a,v]],[a,v])+gdTen(cells),`${v}`,700)}
   const cells=Array(20).fill('');for(let i=0;i<a;i++)cells[i]=Y;for(let i=a;i<c;i++)cells[i]=G;add(gdLine(0,20,c,[[a,c]],[a,c])+gdTen(cells)+gdEq(`${a} + ${b} = <em>${c}</em>`),`Từ ${a} nhảy thêm ${b} bước tới ${c}. ${a} cộng ${b} bằng ${c}.`,2800)}
  return F}
 /* phép trừ: nhảy lùi; qua 10 thì lùi về 10 trước */
 const full=n=>{const cells=Array(20).fill('');for(let i=0;i<n;i++)cells[i]=Y;return cells};
 const back=a>10&&c<10,toTen=a-10,r=b-toTen;
 add(gdLine(0,20,a,[],[a])+gdTen(full(a))+gdEq(eq0),`Ếch đứng ở số ${a}. Mình nhảy lùi ${b} bước.`,2000);
 if(back){add(gdLine(0,20,a,[],[a])+gdTen(full(a))+gdEq(eq0),`${a} lùi mấy bước thì về 10?`,0,{q:`${a} lùi mấy bước thì về 10?`,opts:gdOpts(toTen,[toTen+1,toTen-1,b]),a:String(toTen),ok:`Đúng rồi! ${a} lùi ${toTen} bước là 10.`,hint:`Đếm các ô ở khung thứ hai.`});
  for(let v=a-1;v>=10;v--){const cells=full(a);for(let i=v;i<a;i++)cells[i]='#C9CED9';add(gdLine(0,20,v,[[a,v,G]],[a,v])+gdTen(cells),v===10?`10. Về đúng một chục!`:`${v}`,700)}
  add(gdLine(0,20,10,[[a,10,G]],[a,10])+gdTen((()=>{const c2=full(a);for(let i=10;i<a;i++)c2[i]='#C9CED9';return c2})())+gdEq(`${b} = ${toTen} + <em>${r}</em>`),`${b} tách thành ${toTen} và ${r}. Lùi thêm ${r} bước nữa.`,2600);
  for(let v=9;v>=c;v--){const cells=full(a);for(let i=v;i<a;i++)cells[i]='#C9CED9';add(gdLine(0,20,v,[[a,10,G],[10,v,R]],[a,10,v])+gdTen(cells),`${v}`,700)}
  const cells=full(a);for(let i=c;i<a;i++)cells[i]='#C9CED9';add(gdLine(0,20,c,[[a,10,G],[10,c,R]],[a,10,c])+gdTen(cells)+gdEq(`${a} − ${b} = <em>${c}</em>`),`Lùi ${toTen} bước về 10, rồi lùi ${r} bước nữa. ${a} trừ ${b} bằng ${c}.`,3000)}
 else{for(let v=a-1;v>=c;v--){const cells=full(a);for(let i=v;i<a;i++)cells[i]='#C9CED9';add(gdLine(0,20,v,[[a,v,G]],[a,v])+gdTen(cells),`${v}`,700)}
  const cells=full(a);for(let i=c;i<a;i++)cells[i]='#C9CED9';add(gdLine(0,20,c,[[a,c,G]],[a,c])+gdTen(cells)+gdEq(`${a} − ${b} = <em>${c}</em>`),`Từ ${a} lùi ${b} bước về ${c}. ${a} trừ ${b} bằng ${c}.`,2800)}
 return F}
/* tia số khi thiếu một số: đếm số bước nhảy giữa hai số đã biết */
function gdFramesLineMiss(o){const F=[],{a,b,c,op,miss}=o,Y='#FCB40C',G='#1E9A52',R='#E0441A';
 const eq=miss==='a'?`☐ ${op} ${b} = ${c}`:`${a} ${op} ☐ = ${c}`;
 let from,to,ans,say0;
 if(op==='+'){from=miss==='a'?b:a;to=c;ans=to-from;say0=`Ếch đứng ở ${from}. Nhảy thêm mấy bước thì tới ${c}?`}
 else if(miss==='b'){from=a;to=c;ans=a-c;say0=`Ếch đứng ở ${a}. Lùi mấy bước thì về ${c}?`}
 else{from=c;to=a;ans=a;say0=`Sau khi lùi ${b} bước thì ếch ở ${c}. Lúc đầu ếch đứng ở đâu? Mình nhảy ngược lại ${b} bước.`}
 const dir=to>from?1:-1,col=dir>0?G:R;F.push({h:gdLine(0,20,from,[],[from])+gdEq(eq),say:say0,dur:2600});
 let n=0;for(let v=from+dir;dir>0?v<=to:v>=to;v+=dir){n++;F.push({h:gdLine(0,20,v,[[from,v,col]],[from,v])+gdEq(eq),say:op==='−'&&miss==='a'?`${v}`:`${n}`,dur:700})}
 const fin=op==='−'&&miss==='a'?`Ếch đứng ở ${a} lúc đầu. Ô trống là ${a}.`:`Nhảy ${ans} bước. Ô trống là ${ans}.`;
 F.push({h:gdLine(0,20,to,[[from,to,col]],[from,to])+gdEq(eq.replace('☐',`<em>${ans}</em>`)),say:fin,dur:2800});return F}
export function gdOpts(right,others){const set=[String(right)];for(const o of others){const v=String(o);if(!set.includes(v)&&!/^-|NaN/.test(v))set.push(v);if(set.length===3)break}let k=1;while(set.length<3){const v=String((+right||0)+k*(set.length+1));if(!set.includes(v))set.push(v);k++}return set.sort(()=>Math.random()-.5)}

/* toán lời văn: tô số, câu hỏi, rồi từng bước chọn phép tính */
const OPHINT={'+':'"Thêm", "tất cả", "cả hai", "nhiều hơn … là" thường là gộp lại: làm phép cộng.','−':'"Bớt", "còn lại", "ít hơn", "hơn … bao nhiêu" thường là phép trừ.','×':'"Mỗi … có …, mấy … như thế" là lấy nhiều lần: làm phép nhân.',':':'"Chia đều", "mỗi … được mấy", "xếp vào mỗi …" là phép chia.'};
const OPN={'+':'Cộng','−':'Trừ','×':'Nhân',':':'Chia'};
function gdMark(t){t=t.replace(/(\d+)\s*⁄\s*(\d+)/g,'$1/$2');return t.replace(new RegExp(`(${GD_NUM}(?:/\\d+)?)`,'g'),'<mark>$1</mark>')}
function gdWrongExprs(e,r){const out=[];const swap={'+':'−','−':'+','×':':',':':'×'};const op=(e.match(/[+−×:]/)||[])[0];
 if(op){out.push(e.replace(op,swap[op]));const parts=e.split(op);if(parts.length===2&&(op==='−'||op===':'))out.push(parts[1].trim()+' '+op+' '+parts[0].trim());if(parts.length===2&&(op==='+'||op==='×'))out.push(parts[0].trim()+' '+swap[op==='+'?'×':'+']+' '+parts[1].trim())}
 return out.filter(x=>x!==e)}
function gdFramesWord(q,steps){const F=[],t=gdTxt(q.q),sents=t.match(/[^.?!]+[.?!]?/g)||[t],ask=(sents.filter(s=>/\?/.test(s)).pop()||sents[sents.length-1]).trim();
 const card=(inner)=>`<div class="gdq">${inner}</div>`;
 F.push({h:card(gdMark(t)),say:'Mình đọc lại đề thật chậm nhé. Các số tô vàng là điều bài cho biết.',dur:2600});
 F.push({h:card(gdMark(t).replace(ask.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),`<u>${ask}</u>`))+`<div class="gdtip">Bài hỏi: <b>${ask}</b></div>`,say:`Bài hỏi: ${ask}`,dur:2600});
 steps.forEach((st,i)=>{const pre=steps.length>1?`Bước ${i+1}: `:'';
  if(new Set(st.e.match(/[+−×:]/g)).size===1)F.push({h:card(gdMark(t)),say:`${pre}Cần làm phép tính gì?`,dur:0,mcq:{q:`${pre}Cần làm phép tính gì?`,opts:['Cộng','Trừ','Nhân','Chia'],a:OPN[st.op],ok:`Đúng rồi, phép ${OPN[st.op].toLowerCase()}.`,hint:OPHINT[st.op],grid:2}});
  const wr=gdWrongExprs(st.e,st.r);F.push({h:card(gdMark(t)),say:`${pre}Phép tính đúng là phép tính nào?`,dur:0,mcq:{q:`${pre}Phép tính đúng là?`,opts:gdOpts(st.e,wr),a:st.e,ok:`Đúng rồi: ${st.e} = ${st.r}.`,hint:'Xem lại số nào là số lớn, số nào là số bé, và phép tính vừa chọn.'}})});
 F.push({h:card(steps.map(s=>`<div class="gdln">${s.e} = <b>${s.r}</b></div>`).join('')),say:`Vậy là xong. Giờ em làm lại bài nhé.`,dur:2200});return F}

/* sơ đồ đoạn thẳng pixel */
function gdTape(rows,brace){/* rows: [{lab, segs:[{w,c,t}]}], brace: {t, rows:[i,j]} */const U=26;let h=`<div class="gdtape${rows.some(r=>r.top)?' top':''}"><div class="gdrows">`;
 const topB=r=>{if(!r.top)return'';let L=0;for(let k=0;k<r.top.at;k++)L+=r.segs[k].w*U-3;let W=0;for(let k=r.top.at;k<r.top.at+r.top.n;k++)W+=r.segs[k].w*U-3;W+=3;
  return `<span class="gdtop" style="left:${L}px;width:${W}px"><em>${r.top.t}</em><span class="gdtb"><svg viewBox="0 0 32 8" preserveAspectRatio="none" aria-hidden="true"><path d="M1.5 8 V5 H14 L16 1 L18 5 H30.5 V8" fill="none" stroke="#E0441A" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linejoin="miter"/></svg></span></span>`};
 rows.forEach((r,i)=>{h+=`<div class="gdtr${r.top?' hastop':''}"><b>${r.lab}</b><div class="gdseg">${topB(r)}${r.segs.map(s=>`<i style="width:${s.w*U}px;background:${s.c||'#FCB40C'}${s.dash?';background:repeating-linear-gradient(90deg,#fff 0 4px,#FDE6DE 4px 8px)':''}">${s.t||''}</i>`).join('')}</div>${r.side?`<span class="gdside">${r.side}</span>`:''}</div>`});
 h+='</div>';if(brace)h+=`<div class="gdbrace"><svg viewBox="0 0 8 32" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible"><path d="M0 1.5 H3 V14 L7.5 16 L3 18 V30.5 H0" fill="none" stroke="#E0441A" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linejoin="miter"/></svg></div><div class="gdbr">${brace.replace(/:\s*/,':<br>')}</div>`;return h+'</div>'}
function gdFramesRatio(g,q){const F=[],t=gdTxt(q.q),Y='#FCB40C',G='#1E9A52';const card=`<div class="gdq sm">${gdMark(t)}</div>`;
 /* m: số phần bên nhỏ (tử), n: số phần bên lớn (mẫu) */
 const segs=(k,c)=>Array.from({length:k},()=>({w:1,c}));
 const isSum=g.t==='sr',small=g.m,big=g.n;
 const tape=(extra)=>gdTape([{lab:'Lớn',segs:isSum?segs(big,Y):[...segs(small,Y),...segs(big-small,'#F7A38A')],top:isSum?null:{at:small,n:big-small,t:`Hiệu: <b>${fmt(g.D)}</b>`}},{lab:'Nhỏ',segs:segs(small,G)}],isSum?`Tổng: <b>${fmt(g.S)}</b>`:extra||'');
 F.push({h:card+tape(),say:isSum?`Vẽ sơ đồ: số nhỏ ${small} phần, số lớn ${big} phần bằng nhau. Tổng là ${g.S}.`:`Vẽ sơ đồ: số nhỏ ${small} phần, số lớn ${big} phần bằng nhau. Số lớn hơn số nhỏ ${g.D}.`,dur:3200});
 F.push({h:card+tape(),say:isSum?'Tổng có mấy phần bằng nhau?':'Số lớn hơn số nhỏ mấy phần?',dur:0,mcq:{q:isSum?'Tổng có mấy phần bằng nhau?':'Hiệu là mấy phần?',opts:gdOpts(g.p,isSum?[big,small,g.p+1]:[big,small,big+small]),a:String(g.p),ok:isSum?`Đúng rồi: ${small} + ${big} = ${g.p} phần.`:`Đúng rồi: ${big} − ${small} = ${g.p} phần.`,hint:isSum?'Đếm tất cả các ô ở cả hai đoạn.':'Đếm số ô đoạn lớn dài hơn đoạn nhỏ.'}});
 const V=isSum?g.S:g.D;
 F.push({h:card+tape(),say:'Một phần bằng bao nhiêu?',dur:0,mcq:{q:'Một phần bằng bao nhiêu?',opts:gdOpts(`${fmt(V)} : ${g.p}`,[`${fmt(V)} × ${g.p}`,`${fmt(V)} : ${big}`,`${fmt(V)} − ${g.p}`]),a:`${fmt(V)} : ${g.p}`,ok:`Đúng rồi: ${fmt(V)} : ${g.p} = ${fmt(g.u)}.`,hint:`${fmt(V)} ứng với ${g.p} phần bằng nhau, nên chia cho ${g.p}.`}});
 F.push({h:card+gdTape([{lab:'Lớn',segs:segs(big,Y).map(s=>({...s,t:fmt(g.u)}))},{lab:'Nhỏ',segs:segs(small,G).map(s=>({...s,t:fmt(g.u)}))}],''),say:`Mỗi ô bằng ${g.u}.`,dur:2200});
 F.push({h:card+gdTape([{lab:'Lớn',segs:segs(big,Y).map(s=>({...s,t:fmt(g.u)}))},{lab:'Nhỏ',segs:segs(small,G).map(s=>({...s,t:fmt(g.u)}))}],''),say:`Số cần tìm bằng mấy phần?`,dur:0,mcq:{q:`${g.who.replace(/^./,c=>c.toUpperCase())} gồm mấy phần?`,opts:gdOpts(g.k,[g.k===small?big:small,g.p]),a:String(g.k),ok:`Đúng rồi, ${g.k} phần: ${fmt(g.u)} × ${g.k} = ${fmt(g.u*g.k)}.`,hint:'Nhìn lại sơ đồ: số cần tìm là đoạn nào?'}});
 F.push({h:card+`<div class="gdq"><div class="gdln">${isSum?`${small} + ${big}`:`${big} − ${small}`} = ${g.p}</div><div class="gdln">${fmt(V)} : ${g.p} = ${fmt(g.u)}</div><div class="gdln">${fmt(g.u)} × ${g.k} = <b>${fmt(g.u*g.k)}</b></div></div>`,say:`Vậy là xong ba bước. Giờ em làm lại bài nhé.`,dur:2400});
 return F}
function gdFramesSD(g,q){const F=[],t=gdTxt(q.q),Y='#FCB40C',G='#1E9A52';const card=`<div class="gdq sm">${gdMark(t)}</div>`,S=g.S,D=g.D;
 const tape=gdTape([{lab:'Lớn',segs:[{w:3,c:Y},{w:1.4,c:'#F7A38A'}],top:{at:1,n:1,t:`Hiệu: <b>${fmt(D)}</b>`}},{lab:'Bé',segs:[{w:3,c:G}]}],`Tổng: <b>${fmt(S)}</b>`);
 if(g.half)F.push({h:card,say:`Chu vi là ${g.half}. Nửa chu vi là tổng chiều dài và chiều rộng: ${g.half} chia 2 bằng ${S}.`,dur:3200});
 F.push({h:card+tape,say:`Vẽ sơ đồ: số lớn dài hơn số bé một đoạn bằng hiệu ${D}. Cả hai đoạn là tổng ${S}.`,dur:3200});
 const findBig=g.op==='+';
 F.push({h:card+tape,say:findBig?`Nếu thêm ${D} vào số bé thì hai số bằng nhau. Tổng mới là bao nhiêu?`:`Nếu bớt phần hơn ${D} ở số lớn thì hai số bằng nhau. Tổng còn lại là bao nhiêu?`,dur:0,mcq:{q:findBig?'Thêm phần thiếu vào số bé, tổng mới là?':'Bớt phần hơn ở số lớn, tổng còn lại là?',opts:gdOpts(`${fmt(S)} ${g.op} ${fmt(D)}`,[`${fmt(S)} ${findBig?'−':'+'} ${fmt(D)}`,`${fmt(S)} : 2`]),a:`${fmt(S)} ${g.op} ${fmt(D)}`,ok:`Đúng rồi: ${fmt(S)} ${g.op} ${fmt(D)} = ${fmt(findBig?S+D:S-D)}.`,hint:findBig?'Số bé được thêm vào thì tổng tăng lên.':'Bớt đi thì tổng giảm xuống.'}});
 const two=findBig?S+D:S-D;
 F.push({h:card+gdTape([{lab:'Lớn',segs:[{w:3,c:Y}]},{lab:'Bé',segs:[{w:3,c:G}]}],`Hai phần bằng nhau: <b>${fmt(two)}</b>`),say:`Bây giờ hai đoạn bằng nhau. ${g.who} là bao nhiêu?`,dur:0,mcq:{q:`Vậy ${g.who.replace(/^./,c=>c.toLowerCase())} là?`,opts:gdOpts(`${fmt(two)} : 2`,[`${fmt(two)} × 2`,`${fmt(S)} : 2`]),a:`${fmt(two)} : 2`,ok:`Đúng rồi: ${fmt(two)} : 2 = ${fmt(g.ans)}.`,hint:'Hai đoạn bằng nhau thì mỗi đoạn là một nửa.'}});
 F.push({h:card+`<div class="gdq">${g.half?`<div class="gdln">${fmt(g.half)} : 2 = ${fmt(S)}</div>`:''}<div class="gdln">(${fmt(S)} ${g.op} ${fmt(D)}) : 2 = <b>${fmt(g.ans)}</b></div></div>`,say:`${g.who} là ${g.ans}. Giờ em làm lại bài nhé.`,dur:2400});
 return F}

/* ---------- khung xem hướng dẫn ---------- */
let GD=null;
/* dạng mở rộng (Lô 2…): {t, on, kind(q)→k|null, frames(k,q)→F} */
export const GD_EXT=[];
{const _k=gdKind;gdKind=function(q){if(!q||!q.sol)return null;for(const e of GD_EXT){if(!e.on)continue;let k=null;try{k=e.kind(q)}catch(x){}if(k)return{...k,t:e.t}}return _k(q)}}
function gdFrames(q,k){const e=GD_EXT.find(e=>e.t===k.t);if(e)return e.frames(k,q);return k.t==='hand'?gdFramesHand(k):k.t==='line'?(k.miss==='c'?gdFramesLine(k):gdFramesLineMiss(k)):k.t==='word'?gdFramesWord(q,k.steps):k.t==='sd'?gdFramesSD(k,q):gdFramesRatio(k,q)}
function gdOpen(...a){return hooks.goi('gdOpen',this,a)}
hooks.ham('gdOpen',function(q,auto){const k=gdKind(q);if(!k)return false;return gdOpenF(gdFrames(q,k),auto,k.t)});
function gdOpenF(...a){return hooks.goi('gdOpenF',this,a)}
hooks.ham('gdOpenF',function(F,auto,kind){
 gdClose(true);GD={F,i:0,slow:false,tm:null,auto,done:false,kind};
 const el=document.createElement('div');el.id='gdov';el.className='gdov';el.setAttribute('role','dialog');el.setAttribute('aria-label','Hướng dẫn');
 el.innerHTML=`<div class="gdbox"><div class="gdhd"><b>${spr('bulb',20)} Hướng dẫn</b><span class="gdstep"></span><button type="button" class="gdx" onclick="gdClose()" aria-label="Đóng hướng dẫn">Đóng ✕</button></div><div class="gdstage"></div><div class="gdsay">${spr('jennyHappy',40)}<div class="gdbub"></div></div><div class="gdmcq"></div><div class="gdctl"><button type="button" onclick="gdReplay()">↺ Xem lại</button><button type="button" class="gdslow" onclick="gdSlow()">🐢 Chậm hơn</button><button type="button" class="gdgo" onclick="gdFinish()" disabled>Em làm lại ▶</button></div></div>`;
 document.body.appendChild(el);try{pixelize(el)}catch(e){}gdShow();return true});
function gdShow(){if(!GD)return;const el=document.getElementById('gdov');if(!el)return;const f=GD.F[GD.i];
 el.querySelector('.gdstage').innerHTML=f.h;el.querySelector('.gdbub').textContent=f.say||'';el.querySelector('.gdstep').textContent=`${GD.i+1}/${GD.F.length}`;
 const mq=el.querySelector('.gdmcq');if(f.mcq){const m=f.mcq;mq.innerHTML=`<div class="gdmq">${m.q}</div><div class="gdopts ${m.grid===2?'c2':m.opts.every(o=>String(o).length<=4)?'c3':''}">${m.opts.map(o=>`<button type="button" data-v="${String(o).replace(/"/g,'&quot;')}" onclick="gdPick(this)">${o}</button>`).join('')}</div>`}else mq.innerHTML='';
 if(f.say)try{sayJ(f.say)}catch(e){}
 clearTimeout(GD.tm);if(f.mcq)return;
 if(GD.i>=GD.F.length-1){GD.done=true;el.querySelector('.gdgo').disabled=false;return}
 const t0=performance.now(),min=f.dur*(GD.slow?1.6:1);
 const tick=()=>{if(!GD)return;const sp=!muted&&window.speechSynthesis&&speechSynthesis.speaking;if(performance.now()-t0>=min&&(!sp||f.dur<900)){GD.i++;gdShow()}else GD.tm=setTimeout(tick,120)};GD.tm=setTimeout(tick,Math.min(min,400))}
function gdPick(b){if(!GD)return;const f=GD.F[GD.i],m=f.mcq;if(!m||m.got)return;const v=b.dataset.v;
 if(v===String(m.a)){m.got=1;b.classList.add('ok');try{sfx('ok')}catch(e){}try{sayJ(m.ok)}catch(e){}document.querySelector('#gdov .gdbub').textContent=m.ok;
  [...b.parentNode.children].forEach(x=>x.disabled=true);setTimeout(()=>{if(!GD||GD.F[GD.i]!==f)return;const go=()=>{if(!GD||GD.F[GD.i]!==f)return;if(!muted&&window.speechSynthesis&&speechSynthesis.speaking){GD.tm=setTimeout(go,150);return}GD.i++;if(GD.i>=GD.F.length){GD.i=GD.F.length-1;GD.done=true;document.querySelector('#gdov .gdgo').disabled=false}else gdShow()};go()},GD.slow?1800:1100)}
 else{b.classList.add('no');b.disabled=true;try{sfx('bad')}catch(e){}try{sayJ('Chưa đúng. '+m.hint)}catch(e){}document.querySelector('#gdov .gdbub').textContent='Chưa đúng. '+m.hint}}
function gdReplay(){if(!GD)return;GD.F.forEach(f=>{if(f.mcq)f.mcq.got=0});GD.i=0;GD.done=false;const g=document.querySelector('#gdov .gdgo');if(g)g.disabled=true;gdShow()}
function gdSlow(){if(!GD)return;GD.slow=!GD.slow;const b=document.querySelector('#gdov .gdslow');if(b){b.classList.toggle('on',GD.slow);b.textContent=GD.slow?'🐇 Bình thường':'🐢 Chậm hơn';try{pixelize(b)}catch(e){}}}
function gdClose(silent){if(GD)clearTimeout(GD.tm);const el=document.getElementById('gdov');if(el)el.remove();if(!silent){try{speechSynthesis.cancel()}catch(e){}}GD=null}
/* xem xong: làm lại câu vừa sai (không mất tim), đúng thì thêm 1 câu tương tự */
function gdFinish(){const auto=GD&&GD.auto;gdClose();const g=scr;if(!g||g.k!=='game')return;
 if(g.sheet&&(g.sheet.kind==='bad'||g.sheet.kind==='retry')){g.gdRedo={stage:'same'};g.sheet=null;g.mad=0;g.inp='';g.picks=[];g.seq=[];g.fill=[];g.used=[];g.cnt=0;render()}}
function gdSimilar(q){try{if(!q.src)return null;const x=isl1(q.src[0])||(typeof ju1==='function'&&ju1(q.src[0]));const gn=x&&x.lv&&x.lv[q.src[1]]&&x.lv[q.src[1]][q.src[2]];if(!gn)return null;
  /* câu tương tự: cùng dạng, cùng chiều (cùng phép tính, cùng chỗ trống, cùng kiểu thêm/bớt) */
  const qk=x=>gdTxt(x.q)+'|'+String(x.pic||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' '),t0=qk(q),k0=gdKind(q),sig=(qq,k)=>{if(!k)return'';const ops=k.t==='word'?k.steps.map(s=>s.op).join(''):(k.op||'');const w=gdTxt(qq.q);return [k.t,ops,k.miss||'',/thêm|nữa|tất cả|cả hai/.test(w)?'+':'',/bớt|còn lại|cho đi|bay đi|ăn/.test(w)?'-':'',/ít hơn|kém/.test(w)?'<':'',/nhiều hơn|hơn/.test(w)&&!/ít hơn/.test(w)?'>':''].join('|')};
  const want=sig(q,k0);let any=null;for(let n=0;n<40;n++){const c=gn();if(qk(c)===t0)continue;if(!any)any=c;if(!k0||sig(c,gdKind(c))===want)return c}return any}catch(e){}return null}
/* thầy thống nhất 20/10: màn học và trò chơi không hiện hướng dẫn; chỉ có trong Luyện lỗi (fix) */
const gdOn=()=>{const g=scr;return g&&g.k==='game'&&g.g1&&g.fix&&!g.race&&!g.tre&&!g.cbo&&role==='hs'};

/* ---------- gắn vào luồng trả lời ---------- */
{hooks.on('q1',_q1=>function(){return scr&&scr.gdPq?scr.gdPq:_q1()})}
{hooks.on('ans1',_ans=>function(v){const g=scr;if(!gdOn()||!g.gdRedo)return _ans(v);
  const q=q1(),ok=right1(q,v);
  if(g.gdRedo.stage==='same'){if(ok){sfx('ok');const nx=g.qs&&g.qs[g.j+1],sim=nx&&nx.key&&nx.key===q.key?null:gdSimilar(q);g.sheet={kind:'gdok',msg:sim?'Em làm đúng rồi! Làm thêm 1 câu giống vậy nhé.':'Em làm đúng rồi!',sim};sayJ(sim?'Đúng rồi! Mình làm thêm một câu giống vậy nhé.':'Đúng rồi!')}
   else{sfx('bad');g.sheet={kind:'gdbad'};sayJ('Chưa đúng. Mình xem đáp án nhé.')}}
  else{if(ok){sfx('ok');const c=addCoins(sid,2,'self');g.sheet={kind:'gdok',msg:'Giỏi quá! Em đã hiểu cách làm.'+(c?` +${c} xu`:'')};sayJ('Giỏi quá! Em đã hiểu cách làm rồi.')}
   else{sfx('bad');g.sheet={kind:'gdbad'};sayJ('Chưa đúng. Mình xem đáp án nhé.')}}
  try{if(typeof xgRec==='function'&&g.gdRedo.stage==='sim')xgRec(ok,q)}catch(e){}save();render()})}
{hooks.on('sheet1',_sh=>function(){const g=scr,s=g.sheet,q=q1();
  if(s&&s.kind==='gdok')return`<div class="sheet ok"><div class="sh"><span class="ic">✓</span><div><b>${g.gdRedo&&g.gdRedo.stage==='sim'?'Tuyệt vời!':'Đúng rồi!'}</b><div>${s.msg}</div></div></div><button class="gobtn" type="button" onclick="gdAfter()">${s.sim?'Làm câu tương tự ▶':'Tiếp tục'}</button></div>`;
  if(s&&s.kind==='gdbad')return`<div class="sheet bad"><div class="sh"><span class="ic">✕</span><div><b>Đáp án đúng${show1(q)!==''?': '+show1(q):''}</b><div>${q.sol}</div></div></div><button class="gobtn" type="button" onclick="gdAfter(1)">Tiếp tục</button></div>`;
  let h=_sh();if(gdOn()&&!g.gdRedo&&s&&(s.kind==='retry'||s.kind==='bad')&&gdKind(q))h=h.replace(/(<button class="gobtn" type="button" onclick="(?:retry1|next1)\(\)">)/,`<button class="gobtn ghost gdbtn" type="button" onclick="gdOpen(q1())">${spr('bulb',18)} Xem hướng dẫn</button>$1`);
  return h})}
function gdAfter(skip){const g=scr,s=g.sheet;if(!skip&&s&&s.sim&&g.gdRedo&&g.gdRedo.stage==='same'){g.gdRedo={stage:'sim'};g.gdPq=s.sim;g.sheet=null;g.inp='';g.picks=[];g.seq=[];g.fill=[];g.used=[];g.cnt=0;g.t0=Date.now();render();return}
 g.gdRedo=null;g.gdPq=null;next1()}
{hooks.on('next1',_n=>function(){if(scr){scr.gdRedo=null;scr.gdPq=null}gdClose(true);return _n.apply(this,arguments)})}
/* sai lần 2: tự mở hướng dẫn (một lần cho mỗi câu) */
{hooks.on('g1AfterRender',_a=>function(){const r=_a.apply(this,arguments);try{const g=scr;if(gdOn()&&g.sheet&&(g.sheet.kind==='bad'||g.sheet.kind==='retry')&&!g.gdRedo){const q=q1(),key=(g.id||'')+':'+g.lv+':'+g.j+':'+g.t0;if(g.gdAuto!==key&&gdKind(q)){g.gdAuto=key;setTimeout(()=>{if(scr===g&&g.sheet&&(g.sheet.kind==='bad'||g.sheet.kind==='retry')&&!document.getElementById('gdov'))gdOpen(q,true)},1200)}}
  if(!(scr&&scr.k==='game'))gdClose(true)}catch(e){}return r})}
/* đọc đề câu làm lại / câu tương tự */
{hooks.on('g1AfterRender',_a=>function(){const r=_a.apply(this,arguments);try{const g=scr;if(gdOn()&&g.gdRedo&&!g.sheet){const key='gd'+g.gdRedo.stage+g.j;if(g.gdSaid!==key){g.gdSaid=key;const q=q1(),stg=g.gdRedo.stage;if(curG()<=2)setTimeout(()=>sayJ((stg==='same'?'Em làm lại câu này nhé. ':'Câu giống vậy nè. ')+sayFull(q.say,q.q)),300)}}}catch(e){}return r})}

document.head.insertAdjacentHTML('beforeend',`<style>
.gdov{position:fixed;inset:0;z-index:80;background:rgba(31,42,90,.55);display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box}
.gdbox{width:min(440px,100%);max-height:100%;overflow:auto;background:#FFFDF2;border:3px solid #1F2A5A;box-shadow:5px 5px 0 #1F2A5A;display:flex;flex-direction:column}
.gdhd{display:flex;align-items:center;gap:8px;background:#1F2A5A;color:#fff;padding:4px 8px;font-family:var(--f-display);font-size:22px}.gdhd b{font-weight:400;display:flex;align-items:center;gap:6px}
.gdstep{margin-left:auto;font-size:18px;color:#FCB40C}.gdx{background:none;border:0;color:#fff;font-size:20px;cursor:pointer;padding:0 4px}
.gdstage{min-height:210px;padding:10px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(#FFF4D6,#FFE9B8);border-bottom:3px solid #1F2A5A}
.gdhands{display:flex;gap:6px;justify-content:center;align-items:flex-end;width:100%}
.gdhand{position:relative;flex:0 1 auto}.gdhand .gdnum{position:absolute;transform:translate(-50%,-50%);min-width:20px;height:20px;padding:0 2px;box-sizing:border-box;text-align:center;font-family:var(--f-display);font-size:21px;font-weight:400;line-height:20px;color:#fff;background:#1F2A5A;animation:gdpop .25s steps(3)}
.gdhand .gdnum.new{background:#E0441A}.gdhand .gdarr{position:absolute;transform:translate(-50%,-60%);color:#E0441A;font-size:18px;line-height:1;animation:gdbob .5s steps(2) infinite}
@keyframes gdpop{from{transform:translate(-50%,-50%) scale(.4)}to{transform:translate(-50%,-50%) scale(1)}}@keyframes gdbob{50%{margin-top:3px}}
.gdeq{font-family:var(--f-display);font-size:38px;line-height:1;color:#1F2A5A}.gdeq em{font-style:normal;color:#E0441A}
.gdline{width:100%;max-width:360px;display:block}
.gdtfs{display:flex;gap:8px}.gdtf{display:grid;grid-template-columns:repeat(5,16px);gap:2px;border:3px solid #1F2A5A;padding:2px;background:#1F2A5A}.gdtf i{width:16px;height:16px;display:block}
.gdsay{display:flex;gap:6px;align-items:flex-end;padding:6px 8px;background:#fff;border-bottom:3px solid #1F2A5A}.gdbub{flex:1;font-family:var(--f-body);font-size:15px;line-height:1.35;border:2px solid #1F2A5A;padding:5px 8px;background:#FFF4D6;min-height:22px}
.gdmcq:empty{display:none}.gdmcq{padding:8px;border-bottom:3px solid #1F2A5A;background:#fff}
.gdmq{font-family:var(--f-body);font-weight:700;font-size:16px;margin-bottom:6px}
.gdopts{display:grid;grid-template-columns:1fr;gap:6px}.gdopts.c2{grid-template-columns:1fr 1fr}.gdopts.c3{grid-template-columns:1fr 1fr 1fr}
.gdopts button{font-family:var(--f-display);font-size:24px;padding:6px 4px;background:#fff;border:3px solid #1F2A5A;box-shadow:2px 2px 0 #1F2A5A;cursor:pointer;color:#1F2A5A}
.gdopts button.ok{background:#E3F7EA;border-color:#1E9A52;color:#1E9A52}.gdopts button.no{background:#FDE6DE;border-color:#E0441A;color:#E0441A;opacity:.75}
.gdctl{display:flex;gap:6px;padding:8px;flex-wrap:wrap;justify-content:center}
.gdctl button{font-family:var(--f-body);font-weight:700;font-size:14px;padding:7px 10px;background:#fff;border:3px solid #1F2A5A;box-shadow:2px 2px 0 #1F2A5A;cursor:pointer;color:#1F2A5A}
.gdctl .gdslow.on{background:#DDF3FB}.gdctl .gdgo{background:#FCB40C;flex:1 1 100%}.gdctl .gdgo:disabled{opacity:.45;cursor:default}
.gdq{width:100%;box-sizing:border-box;background:#fff;border:3px solid #1F2A5A;padding:8px 10px;font-family:var(--f-body);font-size:16px;line-height:1.5}.gdq.sm{font-size:14px;line-height:1.4;padding:6px 8px}
.gdq mark{background:#FFE58A;padding:0 2px;color:inherit}.gdq u{text-decoration:none;box-shadow:inset 0 -3px 0 #E0441A}
.gdtip{font-family:var(--f-body);font-size:14px;align-self:stretch}.gdln{font-family:var(--f-display);font-size:28px;text-align:center}
.gdtape{display:flex;align-items:stretch;align-self:stretch;justify-content:center;gap:4px;padding:4px 0}.gdrows{display:flex;flex-direction:column;gap:8px}.gdbrace{width:20px;flex:0 0 20px;position:relative}.gdtr{display:flex;align-items:center;gap:6px;font-family:var(--f-body);font-size:13px}.gdtr>b{width:34px;text-align:right}
.gdseg{display:flex}.gdseg i{height:22px;border:3px solid #1F2A5A;margin-left:-3px;display:flex;align-items:center;justify-content:center;font-style:normal;font-family:var(--f-display);font-size:16px;color:#1F2A5A;box-sizing:border-box}
.gdseg i:first-child{margin-left:0}.gdseg{position:relative}.gdtape.top{padding-top:40px}
.gdtop{position:absolute;bottom:100%;margin-bottom:2px;display:flex;flex-direction:column;align-items:center}.gdtop em{font-style:normal;font-family:var(--f-body);font-size:13px;color:#E0441A;white-space:nowrap;line-height:1.1}.gdtop em b{font-size:15px}.gdtb{position:relative;display:block;width:100%;height:10px}.gdtb svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}.gdhi{font-family:var(--f-display);font-size:18px;color:#E0441A}.gdside{margin-left:4px}
.gdbr{font-family:var(--f-body);font-size:14px;line-height:1.25;color:#E0441A;align-self:center;white-space:nowrap}.gdbr b{font-size:16px}
.gdbtn{display:inline-flex!important;align-items:center;justify-content:center;gap:6px;margin-bottom:6px}
</style>`);
/* Chế độ tối: hộp hướng dẫn luôn dùng màu sáng (nền kem, chữ xanh đậm) để chữ rõ */
document.head.insertAdjacentHTML('beforeend',`<style>
.gdbox{color-scheme:light;--ink:#13263a;--muted:#566779;--surface:#ffffff;--surface2:#f6f9fb;--sea-ink:#ffffff;--pxk:#1F2A5A;--bg:#EEF2F8;--sea:#0079C1;--sea-deep:#1F2A5A;--sea-soft:#DDF3FB;--leaf:#1E9A52;--leaf-soft:#E3F7EA;--sun:#FCB40C;--sun-soft:#FFF4D6;--sun-ink:#7A4E00;--coral:#E0441A;--coral-soft:#FDE6DE;--line:#C9D1E6;color:#13263a;background:#fff}
.gdbox button{color:#1F2A5A}.gdbox .gdgo{color:#1F2A5A}
.gdbox .gdx{color:#1F2A5A!important;background:#FCB40C!important;font-family:var(--f-display);font-size:18px!important;line-height:1;padding:4px 8px!important;margin-left:8px;box-shadow:0 0 0 2px #fff}
</style>`);
