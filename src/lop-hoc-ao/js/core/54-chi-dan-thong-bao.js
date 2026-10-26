/* 54 — Chỉ dẫn thông báo (thầy yêu cầu 23/10/2026)
   Nút ở thanh dưới có số/dấu "!" trong ô đỏ → vào trang đó thấy ngay:
   1) Khung "Jenny nhắc em" ở đầu trang: nói rõ đang báo việc gì, có nút đi tới chỗ đó.
   2) Chỗ cần chú ý nhấp nháy viền đỏ + nhãn "Mới"/"!" (đảo mới mở, buổi Toán Jenny mới, bài cô giao chưa làm, lỗi cần sửa, thú cưng cần chăm). */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { mist } from './21-lop-6-che-do-tro-choi.js';
import { spr } from './22-do-hoa-pixel-mau-logo-clb.js';
import { ISL } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { jList, natOpen, seenOf } from './36-thong-bao.js';
import { PET_SP, petSim, petsOf } from './49b-dao-nha-thu-cung.js';
import { arcT } from './51-kho-game.js';
import { asgMine, asgState, asgTodo } from './53-phong-hoc.js';
function ntfBox(items){if(!items.length)return'';return`<section class="ntfbox" role="status"><div class="ntfhd">${spr('bulb',22)}<b>${arcT('Jenny nhắc em','Jenny reminds you')}</b></div>${items.map(([t,btn,act])=>`<div class="ntfrow"><span>${t}</span>${btn?`<button type="button" class="btn sm pri" onclick="${act}">${btn} ▸</button>`:''}</div>`).join('')}</section>`}
const ntfTag=t=>`<i class="ntftag">${t}</i>`;
function ntfMark(r,re,tag){return r.replace(re,(m,a,b)=>a.replace(/class="/,'class="ntf ')+b+ntfTag(tag))}
const ntfGo=sel=>`(function(){var e=document.querySelector('${sel}');if(e)e.scrollIntoView({behavior:'smooth',block:'center'})})()`;
function petNeeds(st){try{petSim(st)}catch(e){}const P=petsOf(st),out=[];
 P.list.forEach(p=>{const n=esc(p.name||PET_SP[p.sp][0]);if(!p.name)out.push(arcT(`Đặt tên cho ${n}`,`Name your ${n}`));if(p.sick)out.push(arcT(`${n} bị ốm — cần Thuốc`,`${n} is sick — needs medicine`));if(p.no<25)out.push(arcT(`${n} đang đói — cho ăn`,`${n} is hungry — feed it`));if(p.sach<25)out.push(arcT(`${n} bẩn rồi — tắm cho bạn ấy`,`${n} is dirty — give a bath`))});
 if(P.eggs.some(e=>!e.inc))out.push(arcT('Có trứng chưa ấp — đặt vào Máy ấp','An egg needs the incubator'));if(P.bye)out.push(arcT('Có thư tạm biệt từ thú cưng','A goodbye letter from your pet'));return out}
{const _v=hooks.cu('viewHome1t');hooks.de('viewHome1t',function(){let r=_v.apply(this,arguments);const st=S.st[sid];if(role!=='hs'||!st||st.grade>5)return r;const tab=scr.tab||'map';
 try{const nav=r.indexOf('<nav class="bnav"'),body=nav>=0?r.slice(0,nav):r,rest=nav>=0?r.slice(nav):'';let b=body,box='';
  if(tab==='map'){const v=seenOf(st),ids=[];ISL(st).forEach((x,k)=>{if(!v.isl[x.id]&&natOpen(st,k))ids.push(x.id)});
   if(ids.length){ids.forEach(id=>{b=ntfMark(b,new RegExp(`(<button class="node[^"]*"[^>]*onclick="go\\(\\{k:'island'(?:,part:1)?,id:'${id}'\\}\\)"[^>]*>)()`),arcT('Mới','New'))});
    box=ntfBox([[arcT(`Có <b>${ids.length} đảo mới</b> vừa mở. Đảo có nhãn <b>Mới</b> đang nhấp nháy.`,`<b>${ids.length} new island(s)</b> just opened — look for the blinking <b>New</b> tag.`),arcT('Tới đảo mới','Go'),ntfGo('.node.ntf')]])}}
  else if(tab==='jenny'&&st.active){const v=seenOf(st),ids=jList(st).filter(x=>!v.j[x.id]).map(x=>x.id);
   if(ids.length){ids.forEach(id=>{b=ntfMark(b,new RegExp(`(<button class="pxq[^"]*"[^>]*onclick="go\\(\\{k:'jenny',id:'${id}'\\}\\)"[^>]*>)()`),arcT('Mới','New'))});
    box=ntfBox([[arcT(`Cô vừa mở <b>${ids.length} buổi mới</b> cho em. Buổi có nhãn <b>Mới</b> đang nhấp nháy.`,`Your teacher opened <b>${ids.length} new session(s)</b>.`),arcT('Vào học','Start'),`go({k:'jenny',id:'${ids[0]}'})`]])}}
  else if(tab==='nha'){const nt=asgTodo(st),nm=Object.keys(mist(st)).length,pn=petNeeds(st),it=[];
   if(nt)it.push([arcT(`<b>${nt} bài cô giao</b> chưa làm xong.`,`<b>${nt} homework</b> not done.`),arcT('Làm bài','Do it'),`go({k:'home',tab:'bai'})`]);
   if(nm)it.push([arcT(`<b>${nm} lỗi</b> cần luyện lại.`,`<b>${nm} mistakes</b> to fix.`),arcT('Luyện lỗi','Fix'),`go({k:'home',tab:'fix'})`]);
   if(pn.length)it.push([arcT(`Thú cưng cần em: ${pn.slice(0,2).join(' · ')}${pn.length>2?' …':''}`,`Your pet needs you: ${pn.slice(0,2).join(' · ')}`),arcT('Đảo nhà','Home isle'),`go({k:'home',tab:'isle'})`]);
   const T=(tabk,on)=>{if(on)b=b.replace(new RegExp(`(<button type="button" class="nhat)(" onclick="go\\(\\{k:'home',tab:'${tabk}'\\}\\)")`),'$1 ntf$2')};T('bai',nt);T('fix',nm);T('isle',pn.length);box=ntfBox(it)}
  else if(tab==='isle'){const pn=petNeeds(st);if(pn.length)box=ntfBox(pn.map(t=>[t]))}
  else if(tab==='bai'){const L=asgMine(st).filter(a=>{const s=asgState(st,a);return!s.done});if(L.length){box=ntfBox([[arcT(`Còn <b>${L.length} bài</b> cô giao chưa làm xong. Bài mới nhất ở trên cùng.`,`<b>${L.length}</b> homework left. Newest at the top.`)]]);b=b.replace(/<div class="pgrow ">/g,'<div class="pgrow ntf">').replace(/<div class="pgrow">/g,'<div class="pgrow ntf">')}}
  else if(tab==='fix'){const nm=Object.keys(mist(st)).length;if(nm)box=ntfBox([[arcT(`Em có <b>${nm} lỗi</b> cần luyện. Đúng 2 lần liền là lỗi ra khỏi sổ.`,`<b>${nm} mistakes</b> to fix. Get each right twice in a row.`)]])}
  if(box){const m=/<div class="crumb[^>]*>[\s\S]*?<\/div>/.exec(b);if(m&&m.index<400){const e=m.index+m[0].length;b=b.slice(0,e)+box+b.slice(e)}else b=box+b}
  r=b+rest}catch(e){}
 return r})}
document.head.insertAdjacentHTML('beforeend',`<style>
.ntfbox{margin:0 0 12px;padding:10px 12px;background:#FFF4C7;color:#1F2A5A;box-shadow:var(--f2),0 4px 0 0 #F04A1B;display:flex;flex-direction:column;gap:8px}
.ntfhd{display:flex;align-items:center;gap:6px}.ntfhd b{font-family:var(--f-display);font-size:22px;font-weight:400;line-height:1}
.ntfrow{display:flex;align-items:center;gap:10px;font-size:14px;line-height:1.35}.ntfrow span{flex:1;min-width:0}.ntfrow .btn{flex:0 0 auto;white-space:nowrap}
.ntf{position:relative;animation:ntfp 1.1s steps(2,jump-none) infinite}
@keyframes ntfp{0%{outline:3px solid #F04A1B;outline-offset:2px}100%{outline:3px solid transparent;outline-offset:2px}}
.ntftag{position:absolute;top:-8px;right:-6px;z-index:3;font-style:normal;font-family:var(--f-display);font-size:15px;line-height:1;padding:3px 6px 2px;background:#F04A1B;color:#fff;box-shadow:0 2px 0 #1F2A5A;pointer-events:none}
@media (prefers-reduced-motion:reduce){.ntf{animation:none;outline:3px solid #F04A1B;outline-offset:2px}}
</style>`);
