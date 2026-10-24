/* ===================== Xu: tách giới hạn ngày cho trò chơi (sửa 24/10/2026) =====================
   Lỗi cũ: mỗi câu đúng trong màn +5 xu và trò chơi dùng CHUNG giới hạn 150 xu/ngày (selfCoins),
   nên học xong vài màn là trò chơi không còn xu (gặp ở test01, test02).
   Nay: câu đúng trong màn vẫn tính vào selfCoins (150/ngày); trò chơi (trò chơi đảo, câu cá, bóng bay, đua giờ, kéo co)
   có giới hạn riêng GAME_CAP/ngày (st.gameCoins). Hết giới hạn thì màn kết thúc báo rõ. */
const GAME_CAP=100;
const xuTroChoi=()=>{const g=scr;return!!(g&&(g.k==='xg'||g.k==='mini'||g.race||g.tug))};
{const _a=addCoins;addCoins=function(id,n,kind){const st=S.st[id];if(kind==='self'&&st&&xuTroChoi()){st.gameCoins=st.gameCoins||{};const used=st.gameCoins[S.day]||0,m=Math.max(0,Math.min(n,GAME_CAP-used));st.gameCoins[S.day]=used+m;
    Object.keys(st.gameCoins).forEach(d=>{if(+d<S.day-14)delete st.gameCoins[d]});if(n>0&&m===0)scr.xuHet=1;st.coins+=m;return m}return _a.apply(this,arguments)}}
{const _r=render;render=function(){const r=_r.apply(this,arguments);try{const g=scr;if(g&&g.end&&g.xuHet&&!document.querySelector('.xuhet')){const box=document.querySelector('.gend .gendbtn')||document.querySelector('.gend');
  if(box)box.insertAdjacentHTML('beforebegin',`<p class="earn xuhet" style="opacity:.85">${LANG==='en'?`You've earned the ${GAME_CAP} game coins for today. Come back tomorrow!`:`Hôm nay em đã nhận đủ ${GAME_CAP} xu từ trò chơi. Mai chơi tiếp nhé!`}</p>`)}}catch(e){}return r}}
