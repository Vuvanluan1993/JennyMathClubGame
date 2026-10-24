/* ===================== Lỗi tự bỏ sau 7 ngày (thầy chốt 24/10/2026) =====================
   Sai → ghi vào Sổ lỗi sai, em tự luyện nếu muốn (không bắt buộc).
   Cô giao "Luyện lỗi" (bài về nhà) → bắt buộc (60-bai-ve-nha.js).
   Lỗi cô KHÔNG giao: 7 ngày kể từ lần sai gần nhất (e.day) thì tự bỏ khỏi sổ. Lỗi đang nằm trong bài cô giao thì giữ tới khi em làm xong. */
const LOI_NGAY=7;
function loiGiu(id){const g=new Set(),st=S.st&&S.st[id],R=(st&&st.asgR)||{};(S.asg||[]).forEach(a=>{const r=R[a.id]||{};if(a.loai==='loi'&&(!a.hs||a.hs.includes(id))&&!r.xong&&!r.thuong)(a.keys||[]).forEach(k=>g.add(k))});return g}
function loiConNgay(e){return Math.max(0,LOI_NGAY-(S.day-(e.day||S.day)))}
function loiDon(id,st){const M=st&&st.mist;if(!M)return 0;const giu=loiGiu(id);let n=0;Object.keys(M).forEach(k=>{if(!giu.has(k)&&loiConNgay(M[k])<=0){delete M[k];n++}});return n}
{const _r=render;render=function(){try{if(S&&S.st){if(role==='hs'){if(S.st[sid]&&loiDon(sid,S.st[sid]))save()}else STUDENTS.forEach(([id])=>loiDon(id,S.st[id]))}}catch(e){}return _r.apply(this,arguments)}}
