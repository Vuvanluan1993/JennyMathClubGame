/* ===================== Dữ liệu demo ===================== */
const KEY='jennyVirtualDemo_v10';
const STUDENTS=[['an','Nguyễn Minh An',6],['binh','Trần Gia Bình',6],['chi','Lê Bảo Chi',6],['dung','Phạm Tiến Dũng',7],['ha','Vũ Thu Hà',8],['khoa','Đỗ Minh Khoa',9],['na','Lê Bảo Na',1],['tu','Phạm Anh Tú',1],['my','Hoàng Trà My',1],['lam','Đỗ Gia Lâm',2],['quan','Trịnh Minh Quân',3],['thao','Ngô Phương Thảo',4],['duc','Bùi Anh Đức',5]];
let gvGrade=6;
const DEMO_CODE='JENNY-DEMO';
let S, role='hs', sid='an', scr={k:'home'}, player=null;

const blankP1=g=>Object.fromEntries(P1BY[g].map(x=>[x.id,{intro:false,m:Array(x.nm||3).fill(false),fails:Array(x.nm||3).fill(0)}]));
const blankP2=()=>Object.fromEntries([...P2,...P2_1].map(x=>[x.id,{intro:false,ex:false,m:[false,false,false],fails:[0,0,0]}]));
function newStudent(name,grade){return{name,grade,coins:40,energy:70,items:[],badges:[],comments:[],selfCoins:{},active:false,p1:blankP1(grade),p2:blankP2()}}
function simDay(id,d,n,acc,obj){S.day=d;for(let i=0;i<n;i++)log(id,'answered',obj,obj,{success:Math.random()<acc,duration:`PT${R(25,110)}S`})}
function fresh(){
  /* 23/10/2026: làm mới toàn bộ — mọi học sinh bắt đầu từ đầu; Lê Bảo Na là tài khoản thử (mở tất cả, 10 000 xu) */
  S={day:1,events:[],open:{j1:true,jg1b1:true},st:{},cbi:{}};
  STUDENTS.forEach(([id,n,g])=>S.st[id]=newStudent(n,g));
  const na=S.st.na;na.active=true;na.coins=10000;na.t10k=1;S.na10k=1;
  save();
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function load(){try{const s=localStorage.getItem(KEY);if(s){S=JSON.parse(s);return true}}catch(e){}return false}

