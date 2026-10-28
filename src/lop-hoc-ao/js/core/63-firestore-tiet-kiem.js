/* ===================== P-21 (26/10/2026): Firestore ngoại tuyến và tiết kiệm đọc =====================
   Mục tiêu: mở lại trang gần như tức thì từ bộ nhớ đệm, mất mạng vẫn học (ghi tự xếp hàng, nối mạng tự gửi),
   và ở lại trong hạn miễn phí Spark (50 000 đọc/ngày) khi 100 em học mỗi ngày.
   Gồm:
   - fbTietKiem(): 62 gọi đúng một dòng ngay sau khi tạo FB (trước lần đọc đầu, nếu không enablePersistence bị từ chối):
       bật bộ nhớ đệm bền enablePersistence({synchronizeTabs:true}); lỗi failed-precondition (nhiều tab bản cũ) và
       unimplemented (trình duyệt cũ) chỉ console.info, app vẫn chạy như trước;
       FB.dem = bộ đếm {doc (đọc máy chủ), cache (đọc từ đệm), ghi, nghe (listener fbNghe đang mở), ngoai (listener mở thẳng: 79, 64)}, lưu localStorage jennyDem
       để thầy mở DevTools › Application xem; in ra console khi đăng xuất;
       khi đăng xuất (signOut của app chính): tắt mọi listener, terminate + clearPersistence để máy dùng chung không giữ dữ liệu em.
       Xoá xong mở lại Firestore mới (FB.db) để trang chưa tải lại vẫn dùng được (28/10/2026).
   - fbNghe(ref, cb, err) thay mọi ref.onSnapshot(cb, err) trong 62 (đổi tên hàm, không đổi logic):
       ref là chuỗi đường dẫn document, DocumentReference hay Query; MỘT listener thật cho mỗi document/truy vấn,
       chỗ gọi thứ hai cùng ref chỉ nhận thêm bản chụp (có ngay bản mới nhất); trả về hàm tắt như onSnapshot.
       Lần đầu trên máy (localStorage.jennyV3 !== '1'): bỏ qua bản chụp từ đệm, chờ bản từ máy chủ (tránh đệm cũ sau
       "Nâng cấp dữ liệu v3"); nhận được bản máy chủ thì đặt jennyV3 = '1', từ đó lấy đệm trước cho nhanh.
       Listener SỐNG theo vai, ≤ 4 document (thầy chốt 26/10): HS hsgv/{tk} + asg lớp (hs/{tk} do 79, vi/{tk} do 64 nghe thẳng);
       GV lop/{id} lớp mình + asg; PH hs/{con}, hsgv/{con} + asg lớp con; QL org/main, lop (truy vấn), hsdm (truy vấn).
       Tài liệu ngoài danh sách chỉ "NGHE MỘT LẦN": mở listener, nhận bản đệm rồi bản máy chủ là tắt ngay (có resume token nên
       lần mở sau chỉ tốn đọc cho tài liệu đổi, rẻ hơn get() luôn lên máy chủ); mất mạng thì nhận bản đệm rồi tắt; quá 8 giây
       chưa có bản máy chủ cũng tắt. Chỗ gọi vẫn nhận bản chụp như trước, chỉ không còn cập nhật trực tiếp (tải lại trang mới thấy).
   - fbNgheTat(): tắt hết listener; gọi khi bắt đầu fbHsBoot/fbGvBoot (đổi vai, đăng nhập lại) và khi đăng xuất.
   Không chạm 79-dong-bo.js (P-16 sở hữu): listener hs/{tk} của 79 và vi/{tk} của 64 vẫn gọi onSnapshot thẳng.
   Bản giả lập trong tools/test (FB.db tự chế, không có firebase.firestore.DocumentReference) chạy nhánh đơn giản: không
   tuỳ chọn metadata, không đếm theo nguyên mẫu. */
import { hooks } from './00-hooks.js';
import { FB } from './62-may-chu.js';
const DEM_KEY='jennyDem';
const fbDem={doc:0,cache:0,ghi:0,nghe:0,ngoai:0,t0:Date.now(),luc:0};
let fbDemHen=null;
function fbDemCong(k,n){fbDem[k]=(fbDem[k]||0)+(n==null?1:n);fbDem.luc=Date.now();clearTimeout(fbDemHen);fbDemHen=setTimeout(()=>{try{localStorage.setItem(DEM_KEY,JSON.stringify(Object.assign({},fbDem,{vai:CLOUD&&CLOUD.me?CLOUD.me.role:'',tk:CLOUD&&CLOUD.me?CLOUD.me.tk:''})))}catch(e){}},400)}
const fbThat=()=>!!(window.firebase&&firebase.firestore&&firebase.firestore.DocumentReference);
/* đếm đọc/ghi qua nguyên mẫu SDK compat (get, set, update, delete, batch, transaction); listener đếm trong fbNghe */
function fbDemBat(){if(!fbThat()||fbDemBat.ok)return;fbDemBat.ok=1;const F=firebase.firestore;
  const boc=(P,m,f)=>{if(!P||!P.prototype||!P.prototype[m])return;const o=P.prototype[m];P.prototype[m]=function(){const r=o.apply(this,arguments);try{f(r)}catch(e){}return r}};
  const doc=p=>{if(p&&p.then)p.then(s=>{if(!s||!s.metadata)return;const n=s.docs?Math.max(1,s.docs.length):1;fbDemCong(s.metadata.fromCache?'cache':'doc',n)},()=>{})};
  const ghi=()=>fbDemCong('ghi',1);
  boc(F.DocumentReference,'get',doc);boc(F.Query,'get',doc);boc(F.Transaction,'get',doc);
  ['set','update','delete'].forEach(m=>{boc(F.DocumentReference,m,ghi);boc(F.WriteBatch,m,ghi);boc(F.Transaction,m,ghi)});
  /* listener mở thẳng onSnapshot ngoài fbNghe (79: hs/{tk}, 64: vi/{tk}): đếm vào ngoai, đọc máy chủ đếm như fbNghe */
  [F.DocumentReference,F.Query].forEach(P=>{if(!P||!P.prototype||!P.prototype.onSnapshot)return;const o=P.prototype.onSnapshot;
    P.prototype.onSnapshot=function(){const a=[...arguments];if(fbDemTrong)return o.apply(this,a);const i=a.findIndex(x=>typeof x==='function');
      if(i>=0){const cb=a[i];let lastJ,dau=true;a[i]=function(sn){try{const md=sn&&sn.metadata||{};if(sn&&!md.fromCache&&md.hasPendingWrites===false){
          if(sn.docs){const n=dau?Math.max(1,sn.docs.length):(sn.docChanges?sn.docChanges().length:1);if(n)fbDemCong('doc',n)}
          else{let j;try{j=JSON.stringify(sn.exists?sn.data():null)}catch(e){}if(j!==lastJ){lastJ=j;fbDemCong('doc',1)}}dau=false}
        else if(sn&&md.fromCache&&dau)fbDemCong('cache',1)}catch(e){}return cb.apply(this,arguments)}}
      fbDemCong('ngoai',1);const off=o.apply(this,a);let da=false;return function(){if(!da){da=true;fbDemCong('ngoai',-1)}return off.apply(this,arguments)}}})}
let fbDemTrong=false;/* true trong lúc fbNghe tự gọi onSnapshot (không đếm hai lần) */
/* ---------- một listener mỗi document; sống hay nghe một lần tuỳ vai ---------- */
const fbNgheDS=[];/* {ref, path, cbs:[{cb,err}], off, last, lastJ, dau, song, tat} */
/* đường dẫn của DocumentReference (ref.path) hay collection của Query (nội bộ SDK compat: _delegate._query.path); '' = không rõ */
function fbNgheDuong(ref){try{if(ref.path)return String(ref.path);const q=ref._delegate&&ref._delegate._query,pa=q&&q.path;if(!pa)return'';return pa.canonicalString?pa.canonicalString():(pa.segments||[]).join('/')}catch(e){return''}}
/* listener được sống theo vai; đường dẫn không rõ (bản giả lập) thì sống */
function fbNgheSong(path){if(!path||!CLOUD||!CLOUD.me)return true;const me=CLOUD.me,vai=me.role,tk=me.tk,con=me.con||[];
  if(vai==='hs')return path==='hsgv/'+tk||path==='asg';
  if(vai==='gv')return path==='asg'||path.startsWith('lop/');
  if(vai==='ph')return path==='asg'||con.some(c=>path==='hs/'+c||path==='hsgv/'+c);
  if(vai==='ql')return path==='org/main'||path==='lop'||path==='hsdm';
  return true}
function fbNgheTim(ref){const p=ref&&ref.path;for(const L of fbNgheDS){if(p?L.path===p:(!L.path&&L.ref===ref||(ref.isEqual&&L.ref.isEqual&&!L.path&&L.ref.isEqual(ref))))return L}return null}
function fbNgheBo(L){const j=fbNgheDS.indexOf(L);if(j>=0){fbNgheDS.splice(j,1);fbDemCong('nghe',-1)}try{L.off&&L.off()}catch(e){}L.off=null}
export function fbNghe(ref,cb,err){if(typeof ref==='string')ref=FB.db.doc(ref);
  let L=fbNgheTim(ref);const s={cb,err};
  if(!L){const duong=fbNgheDuong(ref);L={ref,path:ref.path||'',duong,cbs:[],off:null,last:null,lastJ:undefined,dau:true,song:fbNgheSong(duong),tat:false};fbNgheDS.push(L);fbDemCong('nghe',1);
    const xong=()=>{if(L.hen){clearTimeout(L.hen);L.hen=null}if(!L.song)fbNgheBo(L)};/* nghe một lần: đã có bản máy chủ (hay hết mạng/hết giờ) thì tắt */
    const nhan=sn=>{try{if(!sn)return;const md=sn.metadata||{},moi=fbThat()&&localStorage.getItem('jennyV3')!=='1';
        if(moi&&md.fromCache&&navigator.onLine)return;/* lần đầu trên máy: chờ bản máy chủ */
        if(moi&&!md.fromCache)try{localStorage.setItem('jennyV3','1')}catch(e){}
        if(!md.fromCache&&md.hasPendingWrites===false||!fbThat()){/* đếm đọc máy chủ: truy vấn = số doc đổi, document = 1 khi nội dung đổi */
          if(sn.docs){const n=L.dau?Math.max(1,sn.docs.length):(sn.docChanges?sn.docChanges().length:1);if(n)fbDemCong('doc',n)}
          else{let j;try{j=JSON.stringify(sn.exists?sn.data():null)}catch(e){j=String(Math.random())}if(j!==L.lastJ){L.lastJ=j;fbDemCong('doc',1)}}}
        else if(md.fromCache)fbDemCong('cache',sn.docs?(L.dau?Math.max(1,sn.docs.length):0):(L.dau?1:0));
        L.dau=false;L.last=sn;L.cbs.slice().forEach(x=>{try{x.cb(sn)}catch(e){console.error(e)}});
        if(!L.song&&(!md.fromCache||!navigator.onLine||!fbThat()))xong()}catch(e){console.error(e)}};
    const loi=e=>{L.cbs.slice().forEach(x=>{try{if(x.err)x.err(e);else console.error(L.duong||'truy vấn',e)}catch(e2){}});if(!L.song)xong()};
    try{const moi=fbThat()&&localStorage.getItem('jennyV3')!=='1';fbDemTrong=true;try{L.off=(moi||!L.song)&&fbThat()?ref.onSnapshot({includeMetadataChanges:true},nhan,loi):ref.onSnapshot(nhan,loi)}finally{fbDemTrong=false}
      if(!L.song&&fbThat())L.hen=setTimeout(()=>{if(fbNgheDS.includes(L))xong()},8000)}
    catch(e){L.off=()=>{};setTimeout(()=>loi(e),0)}}
  L.cbs.push(s);
  if(L.last){const sn=L.last;Promise.resolve().then(()=>{if(L.cbs.includes(s))try{cb(sn)}catch(e){console.error(e)}})}
  return()=>{if(L.tat||s.da)return;s.da=true;const i=L.cbs.indexOf(s);if(i>=0)L.cbs.splice(i,1);if(L.cbs.length||!fbNgheDS.includes(L))return;fbNgheBo(L)}}
function fbNgheTat(){fbNgheDS.slice().forEach(L=>{L.tat=true;L.cbs.length=0;if(L.hen)clearTimeout(L.hen);try{L.off&&L.off()}catch(e){}});fbNgheDS.length=0;fbDem.nghe=0;fbDemCong('nghe',0)}
/* ---------- bật trong fbInit (62 gọi một dòng) ---------- */
export function fbTietKiem(){if(!FB||!FB.db||FB.dem)return;FB.dem=fbDem;
  try{if(FB.db.enablePersistence){FB.db.enablePersistence({synchronizeTabs:true}).then(()=>{document.documentElement.dataset.fbDem='1'},e=>console.info('Bộ nhớ đệm Firestore chưa bật:',(e&&e.code)||e))}}catch(e){console.info('Bộ nhớ đệm Firestore:',e)}
  fbDemBat();
  if(FB.auth&&FB.auth.signOut){const so=FB.auth.signOut.bind(FB.auth);FB.auth.signOut=async function(){try{await so()}finally{
    console.info(`[P-21] phiên này: đọc máy chủ ${fbDem.doc} · từ đệm ${fbDem.cache} · ghi ${fbDem.ghi} · ${Math.round((Date.now()-fbDem.t0)/60000)} phút`);
    fbNgheTat();try{localStorage.removeItem('jennyV3');await FB.db.terminate();await FB.db.clearPersistence()}catch(e){console.info('clearPersistence:',(e&&e.code)||e)}
    /* 28/10/2026: mở lại Firestore sau khi tắt (terminate là vĩnh viễn, "The client has already been terminated"): chỗ gọi signOut mà không tải lại trang
       (đăng nhập sai vai trò ở trang cô/học sinh rồi đăng nhập lại) vẫn dùng được FB.db. Bật lại bộ nhớ đệm trước lần đọc đầu. */
    try{FB.db=FB.app.firestore();if(FB.db.enablePersistence)FB.db.enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){console.info('Mở lại Firestore:',e)}}}}}
/* đổi vai / đăng nhập lại: tắt listener cũ trước khi vai mới nghe */
{hooks.on('fbHsBoot',_h=>async function(){fbNgheTat();return _h.apply(this,arguments)})}
{hooks.on('fbGvBoot',_g=>async function(){fbNgheTat();return _g.apply(this,arguments)})}
/* Nâng cấp v3 xong: máy này lấy máy chủ trước ở lần nghe tiếp (đệm cũ là bản trước nâng cấp) */
{hooks.on('fbNangCapV3',_n=>async function(){try{localStorage.removeItem('jennyV3')}catch(e){}return _n.apply(this,arguments)})}
