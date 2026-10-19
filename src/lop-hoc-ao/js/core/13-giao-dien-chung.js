/* ===================== Giao diện chung ===================== */
function jenny(size){return`<span class="jav" style="width:${size}px;height:${size}px" aria-hidden="true">${spr('jenny',Math.round(size*.86))}</span>`}
function islandArt(state){return spr(state==='lock'?'islandG':'island',62)+(state==='done'?spr('star',24,'pxdone'):'')}
const initials=n=>n.split(' ').slice(-2).map(w=>w[0]).join('');
const bigStars=(n,max)=>`<span class="bigstars" aria-label="${n} trên ${max} sao">${Array.from({length:max},(_,i)=>`<span class="${i<n?'':'off'}">★</span>`).join('')}</span>`;
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2800)}
function header(){
  document.getElementById('tabs').innerHTML=[['hs','Học sinh'],['gv','Giáo viên'],['ph','Phụ huynh']].map(([r,n])=>`<button class="${role===r?'on':''}" aria-pressed="${role===r}" onclick="setRole('${r}')">${n}</button>`).join('');
  const w=document.getElementById('who');
  document.getElementById('whoBox').hidden=role==='gv';
  w.innerHTML=STUDENTS.map(([id,n,g])=>`<option value="${id}" ${id===sid?'selected':''}>${n} · lớp ${g}</option>`).join('');
  document.getElementById('whoAv').textContent=initials(S.st[sid].name);
  document.getElementById('dayPill').textContent='Ngày '+S.day;
}
function stopPlayer(){if(player){player.stop();player=null}}
function setRole(r){role=r;go({k:'home'})}
document.getElementById('who').onchange=e=>{sid=e.target.value;go({k:'home'})};
function go(s){stopPlayer();try{stopMini();clearInterval(raceTick)}catch(e){}scr=s;render();try{window.scrollTo(0,0)}catch(e){}}
function render(){setTimeout(fitOpts,0);healAll();{const ub=document.getElementById('unlBtn');if(ub){ub.textContent=UNL?'🔒 Khóa lại':'🔓 Mở khóa tất cả';ub.classList.toggle('pri',UNL)}}const g6=role==='hs'&&(S.st[sid].grade<=6);document.body.classList.toggle('gaming',g6&&(scr.k==='game'||scr.k==='mini'));document.body.classList.toggle('hasnav',g6&&scr.k==='home');header();document.body.classList.add('px');const app=document.getElementById('app');app.innerHTML=role==='hs'?viewHS():role==='gv'?viewGV():viewPH();pixelize(app);pixelize(document.querySelector('.appbar'));startSea();g1AfterRender();miniAfterRender();raceAfterRender();if(scr.k==='video'&&role==='hs')startPlayer();if(document.getElementById('sea')){centerMap();(window.requestAnimationFrame||setTimeout)(centerMap);setTimeout(centerMap,200);setTimeout(centerMap,800)}const i=document.getElementById('ans');if(i)i.focus()}
function nextDay(){S.day++;Object.values(S.st).forEach(st=>st.energy=Math.max(0,st.energy-15));save();go({k:'home'});toast('Đã sang ngày '+S.day+'. Thú cưng đói hơn một chút.')}
let resetArmed=0;function resetDemo(){const b=document.getElementById('resetBtn');if(!resetArmed){resetArmed=1;b.textContent='Bấm lần nữa để xóa';b.classList.add('danger');setTimeout(()=>{resetArmed=0;b.textContent='Làm lại demo';b.classList.remove('danger')},4000);return}resetArmed=0;b.textContent='Làm lại demo';b.classList.remove('danger');fresh();sid='an';go({k:'home'});toast('Đã làm lại demo từ đầu')}

const unit=(part,id)=>part===1?ALLP1.find(x=>x.id===id):(P2.find(x=>x.id===id)||P2_1.find(x=>x.id===id));
const ustate=(part,id)=>{const o=S.st[sid][part===1?'p1':'p2'];if(!o[id])o[id]=part===1?{intro:false,m:[false,false,false],fails:[0,0,0]}:{intro:false,ex:false,m:[false,false,false],fails:[0,0,0]};return o[id]};
const shortTitle=t=>t.replace(/^Bài \d+\. /,'');

