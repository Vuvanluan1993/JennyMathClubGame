/* ===================== Xu: không giới hạn trong ngày (thầy chốt 24/10/2026) =====================
   Trước đây: câu đúng trong màn tính vào giới hạn 150 xu/ngày (selfCoins), trò chơi có giới hạn riêng 100 xu/ngày (gameCoins).
   Nay bỏ hết giới hạn ngày: em làm đúng, chơi xong là nhận đủ xu. Xu mỗi ván trò chơi vẫn theo luật của từng trò (ví dụ tối đa 20 xu/ván).
   Vẫn ghi số xu theo ngày (selfCoins, gameCoins) để thống kê. */
import { hooks } from './00-hooks.js';
import { save } from './09-du-lieu-demo.js';
import { render } from './13-giao-dien-chung.js';
import { GH } from './49-gian-hang.js';
import { CARE, PET_SP } from './49b-dao-nha-thu-cung.js';
import { ARC, ARC_PRICE, ARC_TK } from './51-kho-game.js';
import { FB, fbSub, fbTS, fbVe } from './62-may-chu.js';
const GAME_CAP=Infinity;
const xuTroChoi=()=>{const g=scr;return!!(g&&(g.k==='xg'||g.k==='mini'||g.race||g.tug))};

/* ===================== P-20 (25/10/2026): ví xu kiểm soát bằng Firestore rules =====================
   Trước: xu, đồ nằm trong chuỗi hs/{tk}.j do em tự ghi → gõ S.st[sid].coins=1e6;save() trên console là xong (audit LH-C2).
   Nay (khi trung tâm đã nâng cấp v3 và em có ví vi/{tk}):
   - Ví vi/{tk} {coins, items, pets, tudo, m, t} là sự thật về xu và đồ đã mua. Rules chỉ cho em: cộng 0 < Δ ≤ 40 (cfg/shop.tranMan),
     cách lần ghi trước ≥ 3 giây, t = giờ máy chủ; hoặc mua đúng một mã có trong cfg/shop với Δ = −giá. Mỗi lần ghi ví kèm một dòng
     sổ ev/{tk}/d/{id} {k, d, ref, t} (chỉ thêm, không sửa xoá) trong cùng một batch.
   - Hai hàm duy nhất để đổi xu: xuCong(delta, k, ref) và xuMua(loai, id). Chúng đổi st.coins ngay (em thấy liền) và xếp hàng đợi
     ghi lên máy chủ: cộng lớn chia nhiều lần ≤ 40, mỗi lần cách 3,2 giây. Hàng đợi lưu ở localStorage (jennyXu_<tk>) nên mất mạng
     hay tải lại trang không mất xu. Máy chủ từ chối (rules) → thử lại 2 lần, rồi bỏ dòng đó, đọc lại ví (console.warn).
   - st.coins trên máy luôn = xu máy chủ đã xác nhận + tổng hàng đợi. save() nào thấy st.coins lệch khỏi số đó (sửa thẳng st.coins
     ở file khác hoặc console): lệch dương ≤ 50 xu coi là thưởng hợp lệ của mã cũ (k = 'khac'); còn lại bị trả về số đúng.
   - fbTach (62) bỏ coins, items khỏi hs.j khi ví đang bật; vào app đọc vi/{tk} + cfg/shop; đồ Cửa hàng/trò chơi trong hs.j
     mà ví không có thì bị gỡ.
   Sự thật: đây là GIẢM MẠNH gian lận, chưa chặn hẳn — em vẫn có thể gọi xuCong(40) mỗi 3 giây bằng console (~48 000 xu/giờ nếu
   kiên trì); trang cô có cột "Xu hôm nay" và nhãn "Xu tăng lạ" (> 300 xu/ngày hoặc > 15 dòng man/giờ). Chặn hẳn cần hàm máy chủ (P-22, chờ Q5).
   Chưa bật ví (chưa nâng cấp, bản demo, học không máy chủ): hai hàm vẫn chạy, chỉ đổi st.coins như cũ. */
const XU_TRAN=40,XU_CACH=3200,XU_LECH=50,XU_K=['man','tl','bvn','game','mua','ban','ql','khac'];
export const XU_THUONG=['Vòng cổ vàng','Mũ phi hành gia','Cá hồi hiếm','Bóng len cầu vồng'];
const VI={on:false,tk:'',coins:0,items:{},pets:{},tudo:{},m:undefined,shop:null,q:[],hen:null,ban:false,last:0};
const xuTk=()=>typeof CLOUD!=='undefined'&&CLOUD&&CLOUD.me&&CLOUD.me.role==='hs'?CLOUD.me.tk:null;
export const xuOn=()=>VI.on&&xuTk()===VI.tk;
/* bảng giá cfg/shop lấy từ chính các danh mục trong app (LUAT §6): tudo = áo váy, mũ kính, khung; pets = loài;
   items = đảo nhà, đồ nuôi, trò chơi (game:<mã>, 150), vé 10 lượt (ve, 60), quà trùm đảo (0 xu) */
export function xuBangGia(){const g={items:{},pets:{},tudo:{},tranMan:XU_TRAN};
 try{GH.forEach(c=>c.it.forEach(([id,,pr])=>{if(c.k==='pet')g.pets[id]=pr;else if(c.k==='of'||c.k==='acc'||c.k==='frame')g.tudo[id]=pr;else g.items[id]=pr}))}catch(e){}
 try{CARE.forEach(c=>{g.items[c[0]]=c[2]})}catch(e){}
 try{Object.keys(PET_SP).forEach(sp=>{g.pets[sp]=PET_SP[sp][1]})}catch(e){}
 try{Object.keys(ARC).forEach(k=>{g.items['game:'+k]=ARC_PRICE});g.items.ve=ARC_TK}catch(e){}
 XU_THUONG.forEach(n=>{g.items[n]=0});return g}
const xuGia=(loai,id)=>{const s=VI.shop||xuBangGia(),v=s[loai]&&s[loai][id];return typeof v==='number'&&v>=0?Math.round(v):null};
/* loại sự kiện theo màn hình đang mở, khi người gọi không nói rõ */
const xuLoai=()=>{try{if(xuTroChoi())return'game';const k=scr&&scr.k;if(k==='tl'||k==='tlplay')return'tl';if(k==='bvn'||k==='asg'||k==='phieu')return'bvn'}catch(e){}return'man'};
const xuRef=()=>{try{const g=scr||{};return String(g.id||g.k||'')}catch(e){return''}};
/* ---- hàng đợi ghi lên máy chủ ---- */
const xuKey=()=>'jennyXu_'+VI.tk;
function xuLuuQ(){try{localStorage.setItem(xuKey(),JSON.stringify(VI.q))}catch(e){}}
const xuChoQ=()=>VI.q.reduce((a,x)=>a+x.d,0);
const xuMong=()=>VI.coins+xuChoQ();
function xuDay(x){const l=VI.q[VI.q.length-1];
 if(l&&!l.dang&&!l.mua&&!x.mua&&l.k===x.k&&l.ref===x.ref&&l.d>0&&x.d>0&&l.d+x.d<=XU_TRAN)l.d+=x.d;else VI.q.push(x);
 xuLuuQ();xuHen(50)}
function xuHen(ms){if(!xuOn())return;clearTimeout(VI.hen);VI.hen=setTimeout(()=>{xuBom().catch(e=>console.warn('Xu',e))},ms)}
async function xuBom(){if(!xuOn()||VI.ban||!VI.q.length)return;if(!navigator.onLine){xuHen(20000);return}
 const cho=VI.last+XU_CACH-Date.now();if(cho>0){xuHen(cho);return}
 const x=VI.q[0],db=FB.db,tk=VI.tk;if(!db.batch){return}VI.ban=true;x.dang=1;
 const doc={coins:VI.coins+x.d,items:VI.items,pets:VI.pets,tudo:VI.tudo,t:fbTS()};
 if(x.mua){const m=Object.assign({},VI[x.mua.loai]||{});m[x.mua.id]=(m[x.mua.id]||0)+1;doc[x.mua.loai]=m;doc.m={loai:x.mua.loai,id:x.mua.id}}else if(VI.m)doc.m=VI.m;
 try{const b=db.batch();b.set(db.doc('vi/'+tk),doc);b.set(db.collection('ev/'+tk+'/d').doc(),{k:x.k,d:x.d,ref:x.ref,t:fbTS()});await b.commit();
  VI.coins=doc.coins;if(x.mua){VI[x.mua.loai]=doc[x.mua.loai];VI.m=doc.m}VI.last=Date.now();VI.q.shift();xuLuuQ()}
 catch(e){const c=(e&&e.code)||'';x.thu=(x.thu||0)+1;
  if(c==='permission-denied'||c==='failed-precondition'||c==='invalid-argument'){
   if(x.thu<=2){console.warn('Xu: máy chủ chưa nhận (lần '+x.thu+'), thử lại sau 3,5 giây',x.k,x.d);VI.ban=false;x.dang=0;xuHen(3500);return}
   console.warn('Xu: máy chủ từ chối (rules), bỏ dòng này',JSON.stringify({k:x.k,d:x.d,ref:x.ref,mua:x.mua}),e.message||'');VI.q.shift();xuLuuQ();await xuDocLai()}
  else{console.warn('Xu: chưa ghi được, thử lại sau 20 giây',e.message||e);VI.ban=false;x.dang=0;xuHen(20000);return}}
 VI.ban=false;x.dang=0;const st=S.st[VI.tk];if(st)st.coins=xuMong();if(VI.q.length)xuHen(XU_CACH)}
function xuNhan(d){VI.coins=Math.max(0,Math.round(+d.coins||0));VI.items=d.items||{};VI.pets=d.pets||{};VI.tudo=d.tudo||{};VI.m=d.m||undefined}
async function xuDocLai(){try{const d=await FB.db.doc('vi/'+VI.tk).get();if(d.exists)xuNhan(d.data());const st=S.st[VI.tk];if(st){st.coins=xuMong();xuDongBoDo(st);save();render()}}catch(e){}}
/* ---- hai hàm duy nhất để đổi xu ---- */
export function xuCong(delta,k,ref){delta=Math.round(+delta||0);const st=S.st[sid];if(!st||delta<=0)return 0;k=XU_K.includes(k)?k:xuLoai();ref=String(ref==null?xuRef():ref).slice(0,190);
 st.coins=(st.coins||0)+delta;
 if(xuOn()){let d=delta;while(d>0){const c=Math.min(XU_TRAN,d);xuDay({d:c,k,ref});d-=c}}
 return delta}
function xuGhiMua(loai,id,gia){if(xuOn())xuDay({d:-gia,k:'mua',ref:String(id).slice(0,190),mua:{loai,id}})}
export function xuMua(loai,id){const st=S.st[sid],gia=xuGia(loai,id);if(!st||gia===null||(st.coins||0)<gia)return false;st.coins-=gia;xuGhiMua(loai,id,gia);return true}
const xuBan=(delta,ref)=>xuCong(delta,'ban',ref);
const xuCo=(loai,id)=>!!(VI[loai]&&VI[loai][id])||VI.q.some(x=>x.mua&&x.mua.loai===loai&&x.mua.id===id);
/* addCoins (11) đã gọi xuCong; ở đây chỉ tách thống kê trò chơi (gameCoins) khỏi selfCoins và gắn k = 'game' */
{const _a=hooks.cu('addCoins');hooks.de('addCoins',function(id,n,kind,k){const st=S.st[id];if(kind==='self'&&st&&xuTroChoi()){st.gameCoins=st.gameCoins||{};st.gameCoins[S.day]=(st.gameCoins[S.day]||0)+n;
    Object.keys(st.gameCoins).forEach(d=>{if(+d<S.day-14)delete st.gameCoins[d]});return _a(id,n,'game',k||'game')}return _a.apply(this,arguments)})}
/* 49b (ngoài danh sách file P-20): mua thú cưng, đồ nuôi và bán thanh lý đi qua ví bằng cách bọc hàm */
function xuBoc(ten,f){try{if(typeof window[ten]!=='function')return;const _f=window[ten];window[ten]=function(){const st=S.st[sid],tr=st?st.coins||0:0;const r=_f.apply(this,arguments);try{f(st,tr-((st&&st.coins)||0),arguments)}catch(e){}return r}}catch(e){}}
xuBoc('petBuy',(st,da,a)=>{if(da>0)xuGhiMua('pets',a[0],da)});
xuBoc('careBuy',(st,da,a)=>{if(da>0)xuGhiMua('items',a[0],da)});
['bagSell','gearSell','eggSell'].forEach(n=>xuBoc(n,(st,da,a)=>{if(da<0){st.coins+=da;xuBan(-da,String(a[0]||n))}}));
/* save(): st.coins phải bằng xu máy chủ + hàng đợi; lệch thì xử lý */
{const _s=hooks.cu('save');hooks.de('save',function(){try{if(xuOn()){const st=S.st[sid];if(st){const d=Math.round((st.coins||0)-xuMong());
 if(d>0&&d<=XU_LECH){st.coins-=d;xuCong(d,'khac',undefined)}else if(d){console.warn('Xu: thay đổi '+(d>0?'+':'')+d+' xu ngoài luồng bị bỏ (P-20: chỉ xuCong/xuMua được đổi xu)');st.coins=xuMong()}}}}catch(e){}return _s.apply(this,arguments)})}
/* ---- vào app: đọc ví + bảng giá, nối hàng đợi còn dở, gỡ đồ ví không có ---- */
function xuDongBoDo(st){try{const g=xuBangGia(),trong=id=>(id in g.tudo)||(id in g.items);
 if(st.shop&&Array.isArray(st.shop.own))st.shop.own=st.shop.own.filter(id=>!trong(id)||xuCo('tudo',id)||xuCo('items',id));
 if(st.arc&&st.arc.own)Object.keys(st.arc.own).forEach(k=>{if(!xuCo('items','game:'+k))delete st.arc.own[k]});
 st.items=XU_THUONG.filter(n=>xuCo('items',n))}catch(e){}}
/* ví từ dữ liệu hs.j đang có (QL "Nâng cấp dữ liệu v3" / "Tạo ví"): xu + đồ đã mua ở Cửa hàng, Đồ nuôi, Kho trò chơi, quà trùm, thú cưng */
export function xuViTu(st){const g=xuBangGia(),v={coins:Math.max(0,Math.round(+st.coins||0)),items:{},pets:{},tudo:{}},sh=st.shop||{};
 (sh.own||[]).forEach(id=>{if(id in g.tudo)v.tudo[id]=1;else if(id in g.items)v.items[id]=1});
 Object.keys(sh.bag||{}).forEach(id=>{if(sh.bag[id]>0&&(id in g.items))v.items[id]=(v.items[id]||0)+1});
 (sh.gear||[]).forEach(x=>{if(x&&(x.id in g.items))v.items[x.id]=(v.items[x.id]||0)+1});
 (st.items||[]).forEach(n=>{if(n in g.items)v.items[n]=1});
 if(st.arc&&st.arc.own)Object.keys(st.arc.own).forEach(k=>{if(st.arc.own[k])v.items['game:'+k]=1});
 ((st.pets&&st.pets.list)||[]).forEach(p=>{if(p&&p.sp)v.pets[p.sp]=(v.pets[p.sp]||0)+1});return v}
export async function xuBoot(tk,db){VI.on=false;VI.tk=tk;VI.q=[];VI.last=0;
 try{const [v,c]=await Promise.all([db.doc('vi/'+tk).get(),db.doc('cfg/shop').get().catch(()=>null)]);if(c&&c.exists)VI.shop=c.data();
  if(!v.exists){console.warn('Xu: em chưa có ví vi/'+tk+' (quản lý bấm Nâng cấp dữ liệu v3) — xu tạm giữ trong hs.j như cũ');return}
  xuNhan(v.data());try{VI.q=(JSON.parse(localStorage.getItem(xuKey())||'[]')||[]).filter(x=>x&&typeof x.d==='number')}catch(e){VI.q=[]}VI.q.forEach(x=>{x.dang=0});
  VI.on=true;const st=S.st[tk];if(st){st.coins=xuMong();xuDongBoDo(st)}
  if(db.doc('vi/'+tk).onSnapshot)fbSub.push(db.doc('vi/'+tk).onSnapshot(d=>{if(!d.exists||(d.metadata&&d.metadata.hasPendingWrites))return;xuNhan(d.data());if(VI.ban)return;const s2=S.st[tk];if(s2){s2.coins=xuMong();xuDongBoDo(s2);fbVe()}},e=>{}));
  xuHen(800);window.addEventListener('online',()=>xuHen(500));
  /* 79-dong-bo có thể thay S.st[tk] bằng bản lưu ở máy (có coins cũ) sau khi boot xong → áp lại số đúng */
  setTimeout(()=>{try{const s3=S.st[tk];if(s3&&xuOn()){s3.coins=xuMong();xuDongBoDo(s3)}}catch(e){}},300)}catch(e){console.warn('Xu: chưa đọc được ví',e)}}
