/* ===================== P-21 (26/10/2026): Firestore ngoại tuyến và tiết kiệm đọc =====================
   Mục tiêu: mở lại trang gần như tức thì từ bộ nhớ đệm, mất mạng vẫn học (ghi tự xếp hàng, nối mạng tự gửi),
   và ở lại trong hạn miễn phí Spark (50 000 đọc/ngày) khi 100 em học mỗi ngày.
   Gồm:
   - fbTietKiem(): 62 gọi đúng một dòng ngay sau khi tạo FB (trước lần đọc đầu, nếu không enablePersistence bị từ chối):
       bật bộ nhớ đệm bền enablePersistence({synchronizeTabs:true}); lỗi failed-precondition (nhiều tab bản cũ) và
       unimplemented (trình duyệt cũ) chỉ console.info, app vẫn chạy như trước;
       FB.dem = bộ đếm {doc (đọc máy chủ), cache (đọc từ đệm), ghi, nghe (listener đang mở)}, lưu localStorage jennyDem
       để thầy mở DevTools › Application xem; in ra console khi đăng xuất;
       khi đăng xuất (signOut của app chính): tắt mọi listener, terminate + clearPersistence để máy dùng chung không giữ dữ liệu em.
   - fbNghe(ref, cb, err) thay mọi ref.onSnapshot(cb, err) trong 62 (đổi tên hàm, không đổi logic):
       ref là chuỗi đường dẫn document, DocumentReference hay Query; MỘT listener thật cho mỗi document/truy vấn,
       chỗ gọi thứ hai cùng ref chỉ nhận thêm bản chụp (có ngay bản mới nhất); trả về hàm tắt như onSnapshot.
       Lần đầu trên máy (localStorage.jennyV3 !== '1'): bỏ qua bản chụp từ đệm, chờ bản từ máy chủ (tránh đệm cũ sau
       "Nâng cấp dữ liệu v3"); nhận được bản máy chủ thì đặt jennyV3 = '1', từ đó lấy đệm trước cho nhanh.
   - fbNgheTat(): tắt hết listener; gọi khi bắt đầu fbHsBoot/fbGvBoot (đổi vai, đăng nhập lại) và khi đăng xuất.
   Không chạm 79-dong-bo.js (P-16 sở hữu): listener hs/{tk} của 79 và vi/{tk} của 64 vẫn gọi onSnapshot thẳng.
   Bản giả lập trong tools/test (FB.db tự chế, không có firebase.firestore.DocumentReference) chạy nhánh đơn giản: không
   tuỳ chọn metadata, không đếm theo nguyên mẫu. */
const DEM_KEY='jennyDem';
const fbDem={doc:0,cache:0,ghi:0,nghe:0,t0:Date.now(),luc:0};
let fbDemHen=null;
function fbDemCong(k,n){fbDem[k]=(fbDem[k]||0)+(n==null?1:n);fbDem.luc=Date.now();clearTimeout(fbDemHen);fbDemHen=setTimeout(()=>{try{localStorage.setItem(DEM_KEY,JSON.stringify(Object.assign({},fbDem,{vai:CLOUD&&CLOUD.me?CLOUD.me.role:'',tk:CLOUD&&CLOUD.me?CLOUD.me.tk:''})))}catch(e){}},400)}
const fbThat=()=>!!(window.firebase&&firebase.firestore&&firebase.firestore.DocumentReference);
/* đếm đọc/ghi qua nguyên mẫu SDK compat (get, set, update, delete, batch, transaction); listener đếm trong fbNghe */
function fbDemBat(){if(!fbThat()||fbDemBat.ok)return;fbDemBat.ok=1;const F=firebase.firestore;
  const boc=(P,m,f)=>{if(!P||!P.prototype||!P.prototype[m])return;const o=P.prototype[m];P.prototype[m]=function(){const r=o.apply(this,arguments);try{f(r)}catch(e){}return r}};
  const doc=p=>{if(p&&p.then)p.then(s=>{if(!s||!s.metadata)return;const n=s.docs?Math.max(1,s.docs.length):1;fbDemCong(s.metadata.fromCache?'cache':'doc',n)},()=>{})};
  const ghi=()=>fbDemCong('ghi',1);
  boc(F.DocumentReference,'get',doc);boc(F.Query,'get',doc);boc(F.Transaction,'get',doc);
  ['set','update','delete'].forEach(m=>{boc(F.DocumentReference,m,ghi);boc(F.WriteBatch,m,ghi);boc(F.Transaction,m,ghi)})}
/* ---------- một listener mỗi document ---------- */
const fbNgheDS=[];/* {ref, path, cbs:[{cb,err}], off, last, lastJ, dau} */
function fbNgheTim(ref){const p=ref&&ref.path;for(const L of fbNgheDS){if(p?L.path===p:(!L.path&&L.ref===ref||(ref.isEqual&&L.ref.isEqual&&!L.path&&L.ref.isEqual(ref))))return L}return null}
function fbNghe(ref,cb,err){if(typeof ref==='string')ref=FB.db.doc(ref);
  let L=fbNgheTim(ref);const s={cb,err};
  if(!L){L={ref,path:ref.path||'',cbs:[],off:null,last:null,lastJ:undefined,dau:true};fbNgheDS.push(L);fbDemCong('nghe',1);
    const nhan=sn=>{try{if(!sn)return;const md=sn.metadata||{},moi=fbThat()&&localStorage.getItem('jennyV3')!=='1';
        if(moi&&md.fromCache)return;/* lần đầu trên máy: chờ bản máy chủ */
        if(moi&&!md.fromCache)try{localStorage.setItem('jennyV3','1')}catch(e){}
        if(!md.fromCache&&md.hasPendingWrites===false||!fbThat()){/* đếm đọc máy chủ: truy vấn = số doc đổi, document = 1 khi nội dung đổi */
          if(sn.docs){const n=L.dau?Math.max(1,sn.docs.length):(sn.docChanges?sn.docChanges().length:1);if(n)fbDemCong('doc',n)}
          else{let j;try{j=JSON.stringify(sn.exists?sn.data():null)}catch(e){j=String(Math.random())}if(j!==L.lastJ){L.lastJ=j;fbDemCong('doc',1)}}}
        else if(md.fromCache)fbDemCong('cache',sn.docs?(L.dau?Math.max(1,sn.docs.length):0):(L.dau?1:0));
        L.dau=false;L.last=sn;L.cbs.slice().forEach(x=>{try{x.cb(sn)}catch(e){console.error(e)}})}catch(e){console.error(e)}};
    const loi=e=>{L.cbs.slice().forEach(x=>{try{if(x.err)x.err(e);else console.error(L.path||'truy vấn',e)}catch(e2){}})};
    try{const moi=fbThat()&&localStorage.getItem('jennyV3')!=='1';L.off=moi?ref.onSnapshot({includeMetadataChanges:true},nhan,loi):ref.onSnapshot(nhan,loi)}
    catch(e){L.off=()=>{};setTimeout(()=>loi(e),0)}}
  L.cbs.push(s);
  if(L.last){const sn=L.last;Promise.resolve().then(()=>{if(L.cbs.includes(s))try{cb(sn)}catch(e){console.error(e)}})}
  return()=>{if(L.tat||s.da)return;s.da=true;const i=L.cbs.indexOf(s);if(i>=0)L.cbs.splice(i,1);if(L.cbs.length)return;const j=fbNgheDS.indexOf(L);if(j>=0)fbNgheDS.splice(j,1);try{L.off&&L.off()}catch(e){}fbDemCong('nghe',-1)}}
function fbNgheTat(){fbNgheDS.slice().forEach(L=>{L.tat=true;L.cbs.length=0;try{L.off&&L.off()}catch(e){}});fbNgheDS.length=0;fbDem.nghe=0;fbDemCong('nghe',0)}
/* ---------- bật trong fbInit (62 gọi một dòng) ---------- */
function fbTietKiem(){if(!FB||!FB.db||FB.dem)return;FB.dem=fbDem;
  try{if(FB.db.enablePersistence){FB.db.enablePersistence({synchronizeTabs:true}).then(()=>{document.documentElement.dataset.fbDem='1'},e=>console.info('Bộ nhớ đệm Firestore chưa bật:',(e&&e.code)||e))}}catch(e){console.info('Bộ nhớ đệm Firestore:',e)}
  fbDemBat();
  if(FB.auth&&FB.auth.signOut){const so=FB.auth.signOut.bind(FB.auth);FB.auth.signOut=async function(){try{await so()}finally{
    console.info(`[P-21] phiên này: đọc máy chủ ${fbDem.doc} · từ đệm ${fbDem.cache} · ghi ${fbDem.ghi} · ${Math.round((Date.now()-fbDem.t0)/60000)} phút`);
    fbNgheTat();try{localStorage.removeItem('jennyV3');await FB.db.terminate();await FB.db.clearPersistence()}catch(e){console.info('clearPersistence:',(e&&e.code)||e)}}}}}
/* đổi vai / đăng nhập lại: tắt listener cũ trước khi vai mới nghe */
{const _h=fbHsBoot;fbHsBoot=async function(){fbNgheTat();return _h.apply(this,arguments)}}
{const _g=fbGvBoot;fbGvBoot=async function(){fbNgheTat();return _g.apply(this,arguments)}}
/* Nâng cấp v3 xong: máy này lấy máy chủ trước ở lần nghe tiếp (đệm cũ là bản trước nâng cấp) */
{const _n=fbNangCapV3;fbNangCapV3=async function(){try{localStorage.removeItem('jennyV3')}catch(e){}return _n.apply(this,arguments)}}
