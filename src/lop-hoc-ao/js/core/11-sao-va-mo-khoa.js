/* ===================== Sao và mở khóa ===================== */
import { hooks } from './00-hooks.js';
import { L1, NEED } from '../content/hk1/07-lop-9-chuong-i-phuong-trinh-va-he-hai-ph.js';
import { P2, STAR2 } from '../content/hk1/08-phan-ii-toan-jenny-sach-clb-lop-6-chuong.js';
import { open1 } from '../content/hk1/24-lop-1-chu-de-1-cac-so-tu-0-den-10.js';
import { P2_1 } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { xuCong } from './64-xu.js';
export const p1Stars=st=>L1(st).reduce((a,x)=>a+((st.p1[x.id]||{m:[]}).m.filter(Boolean).length),0);
export const p2Stars=st=>(st.grade<=5?P2_1.filter(x=>x.grade===st.grade):P2).reduce((a,x)=>a+st.p2[x.id].m.reduce((s,v,i)=>s+(v?STAR2[i]:0),0),0);
export const totalStars=st=>p1Stars(st)+p2Stars(st);
export const islandOpen=(st,k)=>st.grade<=5?open1(st,k):totalStars(st)>=NEED(k);
export const curIsland=st=>{const P=L1(st);for(let k=0;k<P.length;k++){if(islandOpen(st,k)&&st.p1[P[k].id].m.some(v=>!v))return k}return -1};
/* P-20: xu chỉ đổi qua xuCong (64-xu.js) để lên ví vi/{tk} có rules; k = loại dòng sổ (man, tl, bvn, game…), bỏ trống thì đoán theo màn hình */
export function addCoins(...a){return hooks.goi('addCoins',this,a)}
hooks.ham('addCoins',function(id,n,kind,k){const st=S.st[id];if(kind==='self'){st.selfCoins=st.selfCoins||{};st.selfCoins[S.day]=(st.selfCoins[S.day]||0)+n}if(id===sid&&typeof xuCong==='function')return xuCong(n,k);st.coins+=n;return n});

