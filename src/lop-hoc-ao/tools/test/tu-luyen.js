// Kiểm tra Tự luyện · Vở bài tập Jenny (cần đã chạy tools/build.py).
//   node tools/test/tu-luyen.js      → lớp 1 và 2: mọi trang sinh đủ 5 bài + ★, dạng bài mới đúng đáp án,
//   làm thử 1 trang từ đầu đến cuối (đúng hết, sai rồi thử lại), Thử thách hôm nay, gợi ý của cô, không tràn 320px.
const path=require('path'),fs=require('fs');const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..','..');const EXE=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async()=>{const b=await chromium.launch({executablePath:fs.existsSync(EXE)?EXE:undefined});
 const tmp=path.join(ROOT,'dist','_tl.html');fs.writeFileSync(tmp,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(path.join(ROOT,'dist','lop-hoc-ao-jenny.html'),'utf8')+'</body></html>');
 let fail=0;
 for(const [g,SID] of [[1,'na'],[2,'lam']]){const p=await b.newPage({viewport:{width:320,height:780},isMobile:true,hasTouch:true});const er=[];p.on('pageerror',e=>er.push(e.message));await p.goto('file://'+tmp);await p.waitForTimeout(300);
  const r=await p.evaluate(([g,SID])=>{try{localStorage.clear()}catch(e){};fresh();role='hs';(0,eval)("sid='"+SID+"'");const st=S.st[SID];st.grade=g;UNL=true;S.asg=[];S.asgSeed=2;PRIM[g].isl.forEach(x=>{st.p1[x.id]={intro:true,m:[1],fails:[]}});const bad=[],lay=[];let nq=0,nNew=0;
   const chk=(q,where)=>{nq++;if(q.type==='cells'){nNew++;
     const v=q.a;if(!v.every(x=>Number.isInteger(x)&&x>=0))bad.push(where+' đáp án ô không hợp lệ '+q.kind+' '+v);
     if(q.lay==='house'&&!q.rows.every((r,i)=>{const a=r[0]===null?null:r[0],b=r[1]===null?null:r[1];return true}))bad.push('nhà');
     // tự kiểm tra lại đáp án theo luật từng dạng
     let k=0;const R=q.rows.map(r=>r.map(c=>c===null?q.a[k++]:c));
     if(q.lay==='house'&&!R.every(r=>r[0]+r[1]===q.roof))bad.push(where+' nhà số sai');
     if(q.lay==='fam'){const [n,a,b]=q.head;const ev=r=>r[1]==='+'?r[0]+r[2]===r[4]:r[0]-r[2]===r[4];if(!R.every(ev)||a+b!==n)bad.push(where+' gia đình phép tính sai')}
     if(q.lay==='tower'&&!(R[1][0]===R[2][0]+R[2][1]&&R[1][1]===R[2][1]+R[2][2]&&R[0][0]===R[1][0]+R[1][1]))bad.push(where+' tháp số sai');
     if(q.lay==='tri'){const [x]=R[0],[m1,m2]=R[1],[y,m3,z]=R[2];if(x+m1+y!==q.sum||x+m2+z!==q.sum||y+m3+z!==q.sum)bad.push(where+' tam giác số sai')}
     if(q.lay==='vert'){const num=d=>+d.join('')||0;const A=num(q.rows[0]),B=num(q.rows[1]),r=q.op==='+'?A+B:A-B;if(String(r)!==q.a.join(''))bad.push(where+' đặt tính sai '+A+q.op+B);
      const nho=q.op==='+'?(A%10+B%10>=10||Math.floor(A/10)%10+Math.floor(B/10)%10>=10):(A%10<B%10||Math.floor(A/10)%10<Math.floor(B/10)%10);if(!nho)bad.push(where+' đặt tính không có nhớ '+A+q.op+B);if(r>1000||r<0)bad.push(where+' vượt phạm vi');const xb=+(where.match(/trang (\d+)/)||[])[1];const isl=PRIM[g].isl[xb-1];if(g===2&&isl){const want={19:'+',20:'+',21:'+',22:'−',23:'−',60:'+',62:'−'}[isl.b];if(want&&q.op!==want)bad.push(where+' sai phép so với bài '+isl.b)}}
     if(q.lay==='grid'){const [A,,B,,C]=R[0],D=R[2][0],E=R[2][4],[F,,G,,H]=R[4];if(A+B!==C||A+D!==F||C-E!==H||F-G!==H)bad.push(where+' lưới phép tính sai')}
     if(q.lay==='color'){const ev=t=>{const m=t.match(/(\d+) ([+−]) (\d+)/);return m[2]==='+'?+m[1]+ +m[3]:m[1]-m[3]};q.cells.forEach((t,i)=>{if(ev(t)!==q.vals[q.a[i]])bad.push(where+' tô màu sai '+t)});if(new Set(q.vals).size!==3)bad.push(where+' trùng số màu')}
     if(q.lay==='ds'){q.st.forEach((t,i)=>{const u=t.replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/−/g,'-');let v;if(/=/.test(u)){const [l,r]=u.split('=');v=eval(l)===+r}else v=eval(u);if(!!v!==!!q.a[i])bad.push(where+' Đ/S sai: '+t)})}
     if(g===1&&R.flat().some(c=>typeof c==='number'&&c>100))bad.push(where+' số quá lớn lớp 1')}
    if(q.type==='cells'){window.__lay=window.__lay||{};__lay[q.lay]=(__lay[q.lay]||0)+1}
    if(!right1(q,q.a))bad.push(where+' right1 sai '+q.kind);if(/NaN|undefined/.test(JSON.stringify(q)))bad.push(where+' NaN '+q.kind)};
   const tlQs=window.__tlQs;
   PRIM[g].isl.forEach((x,i)=>{for(let s=0;s<6;s++){go({k:'home',tab:'tl'});tlGo(x.id);const qs=scr.qs;
     if(qs.filter(q=>!q.tt).length!==5)bad.push(`trang ${i+1}: ${qs.filter(q=>!q.tt).length} bài`);if(qs.filter(q=>q.tt).length!==1)bad.push(`trang ${i+1}: thiếu ★`);
     qs.forEach(q=>chk(q,`trang ${i+1}`));delete st.tl[x.id].cur;
     if(s===0){scr.j=qs.findIndex(q=>q.type==='cells');if(scr.j<0)scr.j=0;render();if(document.documentElement.scrollWidth>320)lay.push('tràn trang '+(i+1))}}});
   /* làm 1 trang từ đầu đến cuối */
   const x=PRIM[g].isl.find(x=>/Phép cộng|Mấy và mấy/.test(x.lesson))||PRIM[g].isl[0];const c0=st.coins;go({k:'home',tab:'tl'});tlGo(x.id);
   for(let j=0;j<scr.qs.length;j++){const q=q1();if(j===1){/* sai rồi thử lại */const w=q.type==='cells'?q.a.map(v=>v+1):q.type==='num'?q.a+1:q.type==='opt'?(q.a+1)%q.opts.length:null;if(w!==null){ans1(w);if(scr.sheet.kind!=='tlretry')bad.push('sai lần 1 không cho thử lại');retry1()}}
    if(q.type==='cells'){scr.cv=q.a.map(String);tlXong()}else ans1(q.a);if(!scr.sheet||scr.sheet.kind!=='ok')bad.push('câu '+(j+1)+' trả lời đúng mà không báo đúng ('+q.type+')');next1()}
   if(!scr.end)bad.push('không kết thúc trang');render();if(!document.querySelector('.tlend'))bad.push('không có màn xong trang');
   const rr=st.tl[x.id];if(!rr||!rr.best||rr.n!==1)bad.push('không lưu kết quả trang');if(st.coins<=c0)bad.push('không cộng xu');
   /* Thử thách hôm nay */
   go({k:'home',tab:'tl'});render();if(!document.querySelector('.vtt'))bad.push('thiếu ô Thử thách hôm nay');tlDayGo();const q=q1();if(!q.tt)bad.push('thử thách không phải câu ★');
   if(q.type==='cells'){scr.cv=q.a.map(String);tlXong()}else ans1(q.a);next1();if(!st.tlDay||!st.tlDay.ok)bad.push('không lưu thử thách hôm nay');
   /* gợi ý của cô */
   S.asg=(S.asg||[]).concat([{id:'gtest',loai:'goiy',g,isl:[PRIM[g].isl[1].id],t:Date.now(),by:'Cô'}]);go({k:'home',tab:'tl'});render();
   if(!document.querySelector('.vrow.gy'))bad.push('không hiện trang cô gợi ý');if(asgMine(st).some(a=>a.loai==='goiy'))bad.push('gợi ý lẫn vào Bài cô giao');
   if(document.documentElement.scrollWidth>320)lay.push('tràn trang Tự luyện');
   go({k:'home',tab:'nha'});render();const tile=[...document.querySelectorAll('.pghome .nhat')][2];if(!tile||!/tab:'tl'/.test(tile.getAttribute('onclick')))bad.push('ô Tự luyện chưa mở trang');
   return{nq,nNew,lays:JSON.stringify(window.__lay||{}),bad:[...new Set(bad)].slice(0,30),lay:[...new Set(lay)]}},[g,SID]);
  const ok=!r.bad.length&&!r.lay.length&&!er.length;if(!ok)fail++;
  console.log(`Lớp ${g}: ${ok?'ĐẠT':'CHƯA ĐẠT'} · ${r.nq} câu · ${r.nNew} bài dạng mới ${r.lays}`);[...r.bad,...r.lay,...er.slice(0,5)].forEach(s=>console.log('   - '+s));await p.close()}
 fs.unlinkSync(tmp);await b.close();process.exit(fail?1:0)})();
