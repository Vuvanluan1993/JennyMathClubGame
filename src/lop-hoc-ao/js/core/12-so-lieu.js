/* ===================== Số liệu ===================== */
import { L1, M1, P1BY, P2 } from './30a-dang-ky-khoi.js';
import { evDay } from './10-su-kien-mau-xapi.js';
import { j1s, P2_1 } from './25-lop-1-so-loi-sai-toan-jenny.js';
export function dayStats(id,d){
  const ev=S.events.filter(e=>e.actor.account.name===id&&evDay(e)===d&&e.verb.id.endsWith('answered'));
  const sec=ev.reduce((a,e)=>a+Math.min(180,parseInt(String(e.result.duration||'PT0S').slice(2))||0),0);
  const stars=S.events.filter(e=>e.actor.account.name===id&&evDay(e)===d&&e.verb.id.endsWith('earned')).reduce((a,e)=>a+(e.result.score?e.result.score.raw:0),0);
  return{n:ev.length,c:ev.filter(e=>e.result.success).length,min:Math.round(sec/60),stars};
}
export function activeDays(id){let a=0;const from=Math.max(1,S.day-6);for(let d=from;d<=S.day;d++)if(dayStats(id,d).n)a++;return{a,span:S.day-from+1}}
export function alerts(id){
  const st=S.st[id],out=[];
  L1(st).forEach(x=>{const s=st.p1[x.id];s.fails.forEach((f,i)=>{if(f>=2&&!s.m[i])out.push({t:`Kẹt ${x.title.split('.')[0]} · ${M1[i].split(' · ')[0]}`,c:'bad'})})});
  P2.forEach(x=>{const s=st.p2[x.id];s.fails.forEach((f,i)=>{if(f>=2&&!s.m[i])out.push({t:`Kẹt ${x.title.split(' · ')[0]} · màn ${'★'.repeat(i+1)}`,c:'bad'})})});
  if(st.grade<=5){const nm=Object.keys(st.mist||{}).length;if(nm>=3)out.push({t:`Sổ lỗi sai: ${nm} dạng`,c:'warn'})}
  if(st.grade===6){const nm=Object.keys(st.mist||{}).length;if(nm>=3)out.push({t:`Sổ lỗi sai: ${nm} dạng`,c:'warn'});const w=P1BY[6].filter(x=>st.p1[x.id]&&st.p1[x.id].med&&st.p1[x.id].med.some((m,i)=>st.p1[x.id].m[i]&&m===1));if(w.length)out.push({t:`Đạt Đồng: ${w.map(x=>x.title.split('.')[0]).join(', ')}`,c:'warn'})}
  if(S.day>1&&!dayStats(id,S.day).n&&!dayStats(id,S.day-1).n)out.push({t:'Không học 2 ngày',c:'warn'});
  if(st.active&&st.grade<=5)P2_1.filter(x=>x.grade===st.grade).forEach(x=>{if(!x.draft&&S.open[x.id]&&!j1s(st,x.id).m.every(Boolean))out.push({t:`Chưa xong ${x.title.split(' · ')[0]} Toán Jenny`,c:'warn',tj:1})});
  if(st.active&&st.grade===6)P2.forEach(x=>{if(S.open[x.id]&&!st.p2[x.id].m.every(Boolean))out.push({t:`Chưa xong ${x.title.split(' · ')[0]} Toán Jenny`,c:'warn',tj:1})});
  return out;
}

