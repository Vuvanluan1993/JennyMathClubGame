/* ===================== Sao và mở khóa ===================== */
const p1Stars=st=>L1(st).reduce((a,x)=>a+((st.p1[x.id]||{m:[]}).m.filter(Boolean).length),0);
const p2Stars=st=>(st.grade<=5?P2_1.filter(x=>x.grade===st.grade):P2).reduce((a,x)=>a+st.p2[x.id].m.reduce((s,v,i)=>s+(v?STAR2[i]:0),0),0);
const totalStars=st=>p1Stars(st)+p2Stars(st);
const islandOpen=(st,k)=>st.grade<=5?open1(st,k):totalStars(st)>=NEED(k);
const curIsland=st=>{const P=L1(st);for(let k=0;k<P.length;k++){if(islandOpen(st,k)&&st.p1[P[k].id].m.some(v=>!v))return k}return -1};
function addCoins(id,n,kind){const st=S.st[id];if(kind==='self'){st.selfCoins=st.selfCoins||{};st.selfCoins[S.day]=(st.selfCoins[S.day]||0)+n}st.coins+=n;return n}

