/* ===================== Dữ liệu demo ===================== */
const KEY='jennyVirtualDemo_v9';
const STUDENTS=[['an','Nguyễn Minh An',6],['binh','Trần Gia Bình',6],['chi','Lê Bảo Chi',6],['dung','Phạm Tiến Dũng',7],['ha','Vũ Thu Hà',8],['khoa','Đỗ Minh Khoa',9],['na','Lê Bảo Na',1],['tu','Phạm Anh Tú',1],['my','Hoàng Trà My',1],['lam','Đỗ Gia Lâm',2],['quan','Trịnh Minh Quân',3],['thao','Ngô Phương Thảo',4],['duc','Bùi Anh Đức',5]];
let gvGrade=6;
const DEMO_CODE='JENNY-DEMO';
let S, role='hs', sid='an', scr={k:'home'}, player=null;

const blankP1=g=>Object.fromEntries(P1BY[g].map(x=>[x.id,{intro:false,m:Array(x.nm||3).fill(false),fails:Array(x.nm||3).fill(0)}]));
const blankP2=()=>Object.fromEntries([...P2,...P2_1].map(x=>[x.id,{intro:false,ex:false,m:[false,false,false],fails:[0,0,0]}]));
function newStudent(name,grade){return{name,grade,coins:40,energy:70,items:[],badges:[],comments:[],selfCoins:{},active:false,p1:blankP1(grade),p2:blankP2()}}
function simDay(id,d,n,acc,obj){S.day=d;for(let i=0;i<n;i++)log(id,'answered',obj,obj,{success:Math.random()<acc,duration:`PT${R(25,110)}S`})}
function fresh(){
  S={day:1,events:[],open:{j1:true},st:{}};
  STUDENTS.forEach(([id,n,g])=>S.st[id]=newStudent(n,g));
  const an=S.st.an,bi=S.st.binh,chi=S.st.chi;
  an.active=bi.active=true;
  // Ngày 1–3: lịch sử mẫu
  simDay('an',1,12,.85,'Bài 1. Tập hợp');simDay('binh',1,10,.7,'Bài 1. Tập hợp');simDay('chi',1,8,.5,'Bài 1. Tập hợp');
  simDay('an',2,14,.85,'Bài 2. Cách ghi số tự nhiên');simDay('binh',2,9,.65,'Bài 1. Tập hợp');
  simDay('an',3,9,.8,'Buổi 1 · Tập hợp');simDay('binh',3,6,.6,'Bài 2. Cách ghi số tự nhiên');
  an.p1.b1={intro:true,m:[true,true,true],fails:[0,0,0]};an.p1.b2={intro:true,m:[true,true,false],fails:[0,0,1]};
  an.p2.j1={intro:true,ex:true,m:[true,true,false],fails:[0,0,0]};
  bi.p1.b1={intro:true,m:[true,true,false],fails:[0,1,2]};bi.p1.b2={intro:true,m:[true,false,false],fails:[0,0,0]};
  chi.p1.b1={intro:true,m:[true,false,false],fails:[0,2,0]};
  S.st.dung.active=true;simDay('dung',2,10,.75,'Bài 1. Tập hợp các số hữu tỉ');simDay('dung',3,8,.7,'Bài 1. Tập hợp các số hữu tỉ');S.st.dung.p1.g7b1={intro:true,m:[true,true,false],fails:[0,0,1]};
  simDay('ha',3,7,.8,'Bài 1. Đơn thức');S.st.ha.p1.g8b1={intro:true,m:[true,false,false],fails:[0,0,0]};
  simDay('khoa',1,6,.6,'Bài 1. Khái niệm phương trình');
  simDay('na',2,8,.8,'Toán 1 · Bài 1 · Tiết 1');simDay('na',3,6,.75,'Toán 1 · Bài 1 · Tiết 2');{const p=S.st.na.p1;p.g1b1t1.m=[true,true];p.g1b1t2.m=[true,false];p.g1b1t2.fails=[0,1]}
  S.cbi={};{const b=cbI('g1b1t1');b.hits={na:7,tu:6,my:5};b.hp=0;b.won=true;b.claimed={tu:1,my:1}}{const b=cbI('g1b1t2');b.hits={na:3,tu:5,my:2};b.hp=b.max-10}
  [['tu',14],['my',9]].forEach(([id,r])=>{const s=S.st[id];s.race={g1b1t2:r};s.p1.g1b1t1.m=[true,true];s.p1.g1b1t2.m=[true,true];s.p1.g1b1t3.m=[true,false];simDay(id,3,9,.8,'Toán 1 · Bài 1 · Tiết 3')});
  S.st.na.race={g1b1t2:11};S.st.na.cards={crab:1};S.st.na.mg={'g1b1t1:fish':7};
  [['lam','g2b1t1'],['quan','g3b1t1'],['thao','g4b1t1'],['duc','g5b1t1']].forEach(([id,isl])=>{const s=S.st[id];s.p1[isl].m=[true,false];simDay(id,3,7,.75,'Ôn tập và bổ sung')});
  {const na=S.st.na;na.active=true;S.open.jg1b1=true;na.mist={};[['g1b1t1',0,0],['g1b1t2',0,1],['g1b1t1',1,0]].forEach(([id,L,gi])=>{const q=P1_1.find(x=>x.id===id).lv[L][gi]();na.mist[`${id}:${L}:${gi}`]={id,lv:L,gi,label:q.kind||'Câu hỏi',n:L?2:1,streak:0,day:2}})}
  {const b=S.st.binh;b.p1.b1.med=[1,1,0];b.mist={};[[0,0],[0,2],[1,0]].forEach(([L,gi])=>{const q=G6.b1.lv[L][gi]();b.mist[`b1:${L}:${gi}`]={id:'b1',lv:L,gi,label:qLabel('b1',q),n:R(1,3),streak:0,day:3}});S.st.an.p1.b2.med=[3,1,0];}
  an.coins=185;bi.coins=110;chi.coins=55;S.st.na.coins=10000;S.na10k=1;
  an.badges.push({t:'Huy hiệu Bài 1',day:1,from:'máy'});
  bi.comments.push({day:3,t:'Con làm bài chăm, cần đọc kỹ đề hơn.'});
  S.day=4;save();
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function load(){try{const s=localStorage.getItem(KEY);if(s){S=JSON.parse(s);return true}}catch(e){}return false}

