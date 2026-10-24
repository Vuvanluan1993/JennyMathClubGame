/* ===================== Xu: không giới hạn trong ngày (thầy chốt 24/10/2026) =====================
   Trước đây: câu đúng trong màn tính vào giới hạn 150 xu/ngày (selfCoins), trò chơi có giới hạn riêng 100 xu/ngày (gameCoins).
   Nay bỏ hết giới hạn ngày: em làm đúng, chơi xong là nhận đủ xu. Xu mỗi ván trò chơi vẫn theo luật của từng trò (ví dụ tối đa 20 xu/ván).
   Vẫn ghi số xu theo ngày (selfCoins, gameCoins) để thống kê. */
const GAME_CAP=Infinity;
const xuTroChoi=()=>{const g=scr;return!!(g&&(g.k==='xg'||g.k==='mini'||g.race||g.tug))};
{const _a=addCoins;addCoins=function(id,n,kind){const st=S.st[id];if(kind==='self'&&st&&xuTroChoi()){st.gameCoins=st.gameCoins||{};st.gameCoins[S.day]=(st.gameCoins[S.day]||0)+n;
    Object.keys(st.gameCoins).forEach(d=>{if(+d<S.day-14)delete st.gameCoins[d]});st.coins+=n;return n}return _a.apply(this,arguments)}}
