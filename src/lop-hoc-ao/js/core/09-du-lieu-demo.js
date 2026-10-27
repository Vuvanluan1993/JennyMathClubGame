/* ===================== Dữ liệu demo ===================== */
import { hooks } from './00-hooks.js';
import { R } from './01-tien-ich.js';
import { hd } from './02-hanh-dong.js';
import { P1BY, P2 } from './30a-dang-ky-khoi.js';
import { log } from './10-su-kien-mau-xapi.js';
import { render } from './13-giao-dien-chung.js';
import { P2_1 } from './25-lop-1-so-loi-sai-toan-jenny.js';
globalThis.KEY='jennyVirtualDemo_v10';
globalThis.STUDENTS=[['na','Lê Bảo Na',1],['tu','Phạm Anh Tú',1],['my','Hoàng Trà My',1],['lam','Đỗ Gia Lâm',2],['quan','Trịnh Minh Quân',3],['thao','Ngô Phương Thảo',4],['duc','Bùi Anh Đức',5]]; /* 23/10/2026: bỏ tài khoản lớp 6–9, chỉ giữ tiểu học */
globalThis.gvGrade=1;globalThis.gvLop=null;globalThis.gvMe='jenny';
export const ORG_ON=true; /* bản học sinh đặt false (tools/vite/vai.js) */
export function gvCLS(...a){return hooks.goi('gvCLS',this,a)}
hooks.ham('gvCLS',function(){return STUDENTS.filter(s=>s[2]===gvGrade)});
export function gvHead(...a){return hooks.goi('gvHead',this,a)}
hooks.ham('gvHead',function(){return`<div class="row" style="justify-content:space-between"><div><h1 style="font-size:28px">Lớp ${gvGrade}A</h1><div class="muted">Sáng ngày ${S.day} · ${gvCLS().length} học sinh trong bản demo</div></div><div class="seg" role="group" aria-label="Chọn lớp">${[1,2,3,4,5,6,7,8,9].map(g=>`<button class="${g===gvGrade?'on':''}" aria-pressed="${g===gvGrade}" data-act="gvGrade-render" ${hd.arg(g)}>Lớp ${g}</button>`).join('')}</div></div>`});
export function gvTen(...a){return hooks.goi('gvTen',this,a)}
hooks.ham('gvTen',function(){return'Cô Jenny'});
export const DEMO_CODE='JENNY-DEMO';
globalThis.S=undefined;globalThis.role='hs';globalThis.sid='na';globalThis.scr={k:'home'};globalThis.player=null;

export const blankP1=g=>Object.fromEntries((P1BY[g]||[]).map(x=>[x.id,{intro:false,m:Array(x.nm||3).fill(false),fails:Array(x.nm||3).fill(0)}]));
export const blankP2=()=>Object.fromEntries([...P2,...P2_1].map(x=>[x.id,{intro:false,ex:false,m:[false,false,false],fails:[0,0,0]}]));
export function newStudent(...a){return hooks.goi('newStudent',this,a)}
hooks.ham('newStudent',function(name,grade){return{name,grade,coins:40,energy:70,items:[],badges:[],comments:[],selfCoins:{},active:false,p1:blankP1(grade),p2:blankP2()}});
export function simDay(id,d,n,acc,obj){S.day=d;for(let i=0;i<n;i++)log(id,'answered',obj,obj,{success:Math.random()<acc,duration:`PT${R(25,110)}S`})}
export function fresh(){
  /* 23/10/2026: làm mới toàn bộ — mọi học sinh bắt đầu từ đầu; Lê Bảo Na là tài khoản thử (mở tất cả, 10 000 xu) */
  S={day:1,events:[],open:{j1:true,jg1b1:true},st:{},cbi:{}};
  STUDENTS.forEach(([id,n,g])=>S.st[id]=newStudent(n,g));
  const na=S.st.na;na.active=true;na.coins=10000;na.t10k=1;S.na10k=1;
  save();
}
export function save(...a){return hooks.goi('save',this,a)}
hooks.ham('save',function(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}});
export function load(){try{const s=localStorage.getItem(KEY);if(s){S=JSON.parse(s);return true}}catch(e){}return false}

/* ===== P-14c: hành động cho data-act (sinh bởi tools/vite/bo-inline.mjs; sửa tay được, chạy lại chỉ thêm mục mới) ===== */
hd.dangKy({
  'gvGrade-render':function(event,a){gvGrade=a[0];render()},
});
