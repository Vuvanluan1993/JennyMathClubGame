/* 75 — Nhập danh sách học sinh từ Excel (.xlsx) hoặc .csv, gom anh chị em chung phụ huynh, in phiếu đăng nhập.
   Không cần thư viện ngoài: tự đọc/ghi file .xlsx (zip) bằng DecompressionStream. */
import { hooks } from './00-hooks.js';
import { esc } from './01-tien-ich.js';
import { save } from './09-du-lieu-demo.js';
import { render, toast } from './13-giao-dien-chung.js';
import { viewPH } from './20-phu-huynh.js';
import { FB, fbDayNgay, fbMKGoiY, fbTaoTK } from './62-may-chu.js';
(function(){
if(typeof viewPH==='undefined')return;
const O=()=>S.org,e=s=>esc(String(s==null?'':s));
const bo=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/\s+/g,' ').trim();
const cloud=()=>!!(O()&&O().cloud&&typeof CLOUD!=='undefined'&&CLOUD);
/* P-05 (25/10/2026): mật khẩu ban đầu ngẫu nhiên (fbMKGoiY ở 62), phải đổi khi đăng nhập lần đầu (users.mustChange); chỉ hiện trên phiếu in trong phiên */
const MKmoi=()=>typeof fbMKGoiY==='function'?fbMKGoiY():'tam'+String(Math.floor(10000+Math.random()*90000));
window.qlMK=window.qlMK||{};            // mật khẩu biết được trong phiên này (để in phiếu)
const URL_HS='vuvanluan1993.github.io/JennyMathClubGame/games/lop-hoc-ao/';
const URL_PH='vuvanluan1993.github.io/JennyMathClubGame/games/lop-hoc-ao/phu-huynh/';

/* ---------- đọc zip / xlsx ---------- */
async function unzip(buf,want){const d=new DataView(buf),u8=new Uint8Array(buf);let eo=-1;
 for(let i=buf.byteLength-22;i>=Math.max(0,buf.byteLength-66000);i--)if(d.getUint32(i,true)===0x06054b50){eo=i;break}
 if(eo<0)throw new Error('File không phải Excel (.xlsx)');
 const n=d.getUint16(eo+10,true);let p=d.getUint32(eo+16,true);const out={};const dec=new TextDecoder();
 for(let k=0;k<n;k++){if(d.getUint32(p,true)!==0x02014b50)break;const m=d.getUint16(p+10,true),cs=d.getUint32(p+20,true),nl=d.getUint16(p+28,true),el=d.getUint16(p+30,true),cl=d.getUint16(p+32,true),lo=d.getUint32(p+42,true);
  const name=dec.decode(u8.subarray(p+46,p+46+nl));p+=46+nl+el+cl;
  if(!want(name))continue;const ds=lo+30+d.getUint16(lo+26,true)+d.getUint16(lo+28,true),raw=u8.slice(ds,ds+cs);
  let data;if(m===0)data=raw;else if(m===8){if(typeof DecompressionStream==='undefined')throw new Error('Trình duyệt quá cũ. Hãy dùng Chrome/Edge mới, hoặc lưu file dạng .csv');
   data=new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer())}else continue;
  out[name]=dec.decode(data)}
 return out}
const colIx=r=>{const m=/^([A-Z]+)/.exec(r);let n=0;for(const c of m[1])n=n*26+c.charCodeAt(0)-64;return n-1};
async function docXlsx(buf){const f=await unzip(buf,n=>/^xl\/(sharedStrings\.xml|workbook\.xml|_rels\/workbook\.xml\.rels|worksheets\/sheet\d+\.xml)$/.test(n));
 const X=t=>new DOMParser().parseFromString(t,'application/xml');
 const ss=f['xl/sharedStrings.xml']?[...X(f['xl/sharedStrings.xml']).getElementsByTagName('si')].map(si=>[...si.getElementsByTagName('t')].map(t=>t.textContent).join('')):[];
 let sheet='xl/worksheets/sheet1.xml';
 try{const wb=X(f['xl/workbook.xml']),s0=wb.getElementsByTagName('sheet')[0],rid=s0.getAttribute('r:id')||s0.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');
  const rel=[...X(f['xl/_rels/workbook.xml.rels']).getElementsByTagName('Relationship')].find(r=>r.getAttribute('Id')===rid);if(rel){let t=rel.getAttribute('Target').replace(/^\/?xl\//,'').replace(/^\//,'');sheet='xl/'+t}}catch(x){}
 if(!f[sheet])sheet=Object.keys(f).filter(k=>k.includes('worksheets/')).sort()[0];if(!f[sheet])throw new Error('Không thấy trang tính trong file');
 const rows=[];[...X(f[sheet]).getElementsByTagName('row')].forEach(r=>{const a=[];[...r.getElementsByTagName('c')].forEach(c=>{const t=c.getAttribute('t'),v=c.getElementsByTagName('v')[0];let x='';
   if(t==='s')x=ss[+(v&&v.textContent)]||'';else if(t==='inlineStr')x=[...c.getElementsByTagName('t')].map(z=>z.textContent).join('');else if(v){x=v.textContent;if(t!=='str'&&t!=='b'&&x!==''&&!isNaN(+x))x=+x}
   a[colIx(c.getAttribute('r'))]=x});rows.push(a)});
 return rows}
function docCsv(t){t=t.replace(/^﻿/,'');const sep=(t.split('\n')[0].match(/;/g)||[]).length>(t.split('\n')[0].match(/,/g)||[]).length?';':',';
 const rows=[];let row=[],cur='',q=false;for(let i=0;i<t.length;i++){const ch=t[i];
  if(q){if(ch==='"'){if(t[i+1]==='"'){cur+='"';i++}else q=false}else cur+=ch}
  else if(ch==='"')q=true;else if(ch===sep){row.push(cur);cur=''}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;row.push(cur);rows.push(row);row=[];cur=''}else cur+=ch}
 if(cur||row.length){row.push(cur);rows.push(row)}return rows}

/* ---------- ghi file mẫu .xlsx (zip không nén) ---------- */
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=t[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}})();
function zip(files){const enc=new TextEncoder(),parts=[],cen=[];let off=0;
 for(const [name,txt] of files){const nb=enc.encode(name),db=enc.encode(txt),crc=CRC(db);
  const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint32(14,crc,true);h.setUint32(18,db.length,true);h.setUint32(22,db.length,true);h.setUint16(26,nb.length,true);
  parts.push(new Uint8Array(h.buffer),nb,db);
  const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint32(16,crc,true);c.setUint32(20,db.length,true);c.setUint32(24,db.length,true);c.setUint16(28,nb.length,true);c.setUint32(42,off,true);
  cen.push(new Uint8Array(c.buffer),nb);off+=30+nb.length+db.length}
 const cs=cen.reduce((a,b)=>a+b.length,0),end=new DataView(new ArrayBuffer(22));end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,cs,true);end.setUint32(16,off,true);
 return new Blob([...parts,...cen,new Uint8Array(end.buffer)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
const xe=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function xlsxBlob(rows,widths){const L=i=>{let s='';i++;while(i){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=(i-m-1)/26}return s};
 const sh=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${rows.map((r,ri)=>`<row r="${ri+1}">${r.map((v,ci)=>v===''||v==null?'':`<c r="${L(ci)}${ri+1}" t="inlineStr"${ri===0?' s="1"':''}><is><t xml:space="preserve">${xe(v)}</t></is></c>`).join('')}</row>`).join('')}</sheetData></worksheet>`;
 return zip([
 ['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
 ['_rels/.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
 ['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Hoc sinh" sheetId="1" r:id="rId1"/></sheets></workbook>'],
 ['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
 ['xl/styles.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf/><xf fontId="1" fillId="2" applyFont="1" applyFill="1"/></cellXfs></styleSheet>'],
 ['xl/worksheets/sheet1.xml',sh]])}
const COT=['Họ và đệm','Tên','Giới tính (Nam/Nữ)','Ngày sinh (ngày/tháng/năm)','Lớp','Điện thoại phụ huynh','Gmail phụ huynh','Tên đăng nhập (để trống = tự tạo)'];
function taiFile(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
window.qlTaiMau=function(){const L=[...(O().lop||[])].sort((a,b)=>a.khoi-b.khoi||a.ten.localeCompare(b.ten));const l1=(L[0]||{ten:'1A'}).ten;
 taiFile(xlsxBlob([COT,['Nguyễn Minh','An','Nữ','12/03/2019',l1,'0912345678','binh.nguyen@gmail.com',''],['Nguyễn Gia','Bảo','Nam','05/09/2017','','0912345678','binh.nguyen@gmail.com','']],[18,10,18,24,8,20,26,30]),'mau-danh-sach-hoc-sinh.xlsx');
 toast('Đã tải file mẫu. Xoá 2 dòng ví dụ rồi điền danh sách.')};
window.qlTaiDS=function(){const o=O(),H=o.hoso||{},L=id=>((o.lop||[]).find(l=>l.id===(o.gd||{})[id])||{}).ten||'';
 const rows=[COT.slice(0,7).concat(['Tên đăng nhập'])];STUDENTS.forEach(([id,n])=>{const h=H[id]||{},p=(o.ph||{})[id],pi=(o.phInfo||{})[p]||{},a=n.split(' ');const ten=a.pop();
  rows.push([a.join(' '),ten,h.gt==='nam'?'Nam':h.gt==='nu'?'Nữ':'',h.ng&&h.th&&h.nam?`${String(h.ng).padStart(2,'0')}/${String(h.th).padStart(2,'0')}/${h.nam}`:(h.nam||''),L(id),h.dt||pi.dt||'',h.mail||pi.mail||'',id])});
 taiFile(xlsxBlob(rows,[18,10,18,24,8,20,26,16]),'danh-sach-hoc-sinh.xlsx')};

/* ---------- hiểu dữ liệu ---------- */
function cotOf(h){const x=bo(h);if(!x)return'';
 if(/phu huynh|\bph\b|bo me|cha me/.test(x)){if(/dien thoai|sdt|so dt|phone/.test(x))return'dt';if(/mail/.test(x))return'mail';return'phten'}
 if(/dien thoai|sdt|so dt|phone/.test(x))return'dt';if(/mail/.test(x))return'mail';if(/dang nhap|tai khoan|username/.test(x))return'tk';if(/mat khau/.test(x))return'mk';
 if(/gioi/.test(x))return'gt';if(/ngay sinh|sinh ngay|nam sinh/.test(x))return'ns';if(/^lop\b/.test(x))return'lop';if(/^stt$|^tt$/.test(x))return'';
 if(/ho va ten|ho ten/.test(x))return'hoten';if(/^ho\b/.test(x))return'ho';if(/^ten\b/.test(x))return'ten';return''}
function ngay(v){if(v===''||v==null)return null;if(typeof v==='number'){if(v>1900&&v<2100)return{nam:v};const d=new Date(Math.round((v-25569)*864e5));return{ng:d.getUTCDate(),th:d.getUTCMonth()+1,nam:d.getUTCFullYear()}}
 const s=String(v).trim();let m=/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(s);if(m)return{ng:+m[1],th:+m[2],nam:+m[3]};
 m=/^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})/.exec(s);if(m)return{ng:+m[3],th:+m[2],nam:+m[1]};m=/^(\d{4})$/.exec(s);if(m)return{nam:+m[1]};return{loi:1}}
const okNgay=d=>{if(!d)return true;if(d.loi)return false;if(!(d.nam>=2008&&d.nam<=2025))return false;if(d.ng==null)return true;const t=new Date(d.nam,d.th-1,d.ng);return t.getMonth()===d.th-1&&t.getDate()===d.ng};
const dtChuan=s=>{let d=String(s==null?'':s).replace(/[^\d+]/g,'');if(/^\+?84/.test(d))d='0'+d.replace(/^\+?84/,'');if(/^[1-9]\d{8}$/.test(d))d='0'+d;return d};
const okDt=d=>!d||/^0\d{9,10}$/.test(d),okMail=m=>!m||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m);
const lopTim=t=>{const x=bo(t).replace(/^lop /,'').replace(/\s/g,'');if(!x)return null;return(O().lop||[]).find(l=>bo(l.ten).replace(/\s/g,'')===x||bo(l.id).replace(/\s/g,'')===x)||false};
const tenKey=n=>bo(n);
function hsCu(r){const o=O(),H=o.hoso||{};if(r.tk&&S.st[r.tk])return r.tk;
 const cung=STUDENTS.filter(s=>tenKey(s[1])===tenKey(r.hoten));if(!cung.length)return null;
 if(r.d&&r.d.nam){const k=cung.filter(s=>{const h=H[s[0]]||{};return +h.nam===r.d.nam&&(!r.d.ng||!h.ng||(+h.ng===r.d.ng&&+h.th===r.d.th))});if(k.length===1)return k[0][0];if(k.length>1)return'?';
  return cung.every(s=>{const h=H[s[0]]||{};return !h.nam})&&cung.length===1?cung[0][0]:null}
 return cung.length===1?cung[0][0]:'?'}

function phanTich(rows){let hi=rows.findIndex(r=>(r||[]).filter(c=>cotOf(c)).length>=2);if(hi<0)throw new Error('Không thấy dòng tiêu đề (Họ và đệm, Tên, Giới tính, …). Hãy dùng file mẫu.');
 const map=(rows[hi]||[]).map(cotOf),ds=[],seen={};
 for(let i=hi+1;i<rows.length;i++){const r=rows[i]||[];const g={};map.forEach((k,j)=>{if(k&&r[j]!==undefined&&r[j]!=='')g[k]=typeof r[j]==='string'?r[j].trim().replace(/\s+/g,' '):r[j]});
  if(!Object.keys(g).length)continue;const x={dong:i+1,loi:[],canh:[]};
  x.hoten=String(g.hoten||[g.ho,g.ten].filter(Boolean).join(' ')).trim();if(!g.hoten&&!g.ten)x.loi.push('thiếu Tên');else if(x.hoten.split(' ').length<2)x.loi.push('thiếu Họ');
  const gt=bo(g.gt);x.gt=/^(nu|n|f|female|gai|be gai)$/.test(gt)?'nu':/^(nam|m|male|trai|be trai)$/.test(gt)?'nam':'';if(!x.gt)x.loi.push(g.gt?'giới tính không rõ':'thiếu giới tính');
  x.d=ngay(g.ns);if(!okNgay(x.d))x.loi.push('ngày sinh chưa đúng');
  x.lopTen=g.lop!=null?String(g.lop):'';x.lop=x.lopTen?lopTim(x.lopTen):null;if(x.lop===false)x.loi.push(`chưa có lớp "${x.lopTen}"`);
  x.phten=g.phten?String(g.phten):'';x.dt=dtChuan(g.dt);if(g.dt!=null&&String(g.dt).trim()&&!x.dt)x.loi.push('SĐT chưa đúng');x.mail=String(g.mail||'').toLowerCase();if(!okDt(x.dt))x.loi.push('SĐT chưa đúng');if(!okMail(x.mail))x.loi.push('Gmail chưa đúng');
  x.tk=g.tk?String(g.tk).toLowerCase():'';if(x.tk&&!/^[a-z0-9][a-z0-9._-]{2,23}$/.test(x.tk))x.loi.push('tên đăng nhập chưa đúng');
  const k=tenKey(x.hoten)+'|'+(x.d&&x.d.nam||'')+'|'+(x.d&&x.d.ng||'');if(seen[k])x.loi.push('trùng với dòng '+seen[k]);else seen[k]=x.dong;
  if(!x.loi.length){const c=hsCu(x);if(c==='?')x.loi.push('trùng tên với nhiều em — thêm ngày sinh hoặc tên đăng nhập');else if(c){x.cu=c;const l=(O().lop||[]).find(z=>z.id===(O().gd||{})[c]);if(x.lop&&l&&l.id!==x.lop.id&&l.khoi!==x.lop.khoi)x.loi.push(`đang ở lớp ${l.ten} (khác khối) — dùng Lên lớp`)}}
  if(!x.loi.length&&!x.lop&&!x.cu)x.canh.push('chưa có lớp — em chưa đăng nhập được');
  if(!x.loi.length&&!x.dt&&!x.mail)x.canh.push('không có SĐT/Gmail — tạo tài khoản phụ huynh riêng (ph.tên đăng nhập)');
  ds.push(x)}
 return ds}

/* ---------- bảng xem trước ---------- */
window.qlNhap={ds:[],ten:''};
window.qlMoNhap=function(){const el=document.createElement('div');el.className='gdov';el.id='qlnhap';
 el.innerHTML=`<div class="gdbox qsbox qlnbox"><div class="gdhd"><b>Nhập danh sách từ Excel</b><button type="button" class="gdx" onclick="document.getElementById('qlnhap').remove()">Đóng ✕</button></div><div class="qlnbd" id="qlnbd">${buoc1()}</div></div>`;
 document.body.appendChild(el)};
const buoc1=()=>`<ol class="qlnstep"><li><button type="button" class="btn sm" onclick="qlTaiMau()">⬇ Tải file mẫu (.xlsx)</button><div class="muted">Cột: Họ và đệm · Tên · Giới tính · Ngày sinh · Lớp · ĐT phụ huynh · Gmail phụ huynh · Tên đăng nhập (tuỳ chọn).</div></li>
 <li>Điền danh sách. Cột <b>Lớp</b> ghi tên lớp đã tạo (ví dụ 1A); để trống nếu chưa xếp. Anh chị em <b>cùng SĐT hoặc Gmail phụ huynh</b> sẽ chung 1 tài khoản phụ huynh.</li>
 <li><label class="btn pri qlfile">⬆ Chọn file Excel hoặc CSV<input type="file" accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" onchange="qlDocFile(this.files[0])"></label><div class="muted">Nhập lại file đã sửa: em đã có (cùng họ tên + ngày sinh, hoặc cùng tên đăng nhập) sẽ được <b>cập nhật</b>, không tạo trùng.</div></li></ol>`;
window.qlDocFile=async function(f){if(!f)return;const bd=document.getElementById('qlnbd');bd.innerHTML='<p>Đang đọc file…</p>';
 try{const rows=/\.csv$/i.test(f.name)?docCsv(await f.text()):await docXlsx(await f.arrayBuffer());qlNhap.ds=phanTich(rows);qlNhap.ten=f.name;bd.innerHTML=xemTruoc()}
 catch(x){console.error(x);bd.innerHTML=`<p class="qlnerr">⚠ ${e(x.message||x)}</p>`+buoc1()}};
function nhomPH(ds){const g={},o=O(),info=o.phInfo||{};
 const tim=x=>(x.dt&&Object.keys(info).find(t=>dtChuan(info[t].dt)===x.dt))||(x.mail&&Object.keys(info).find(t=>(info[t].mail||'')===x.mail))||(x.cu&&(o.ph||{})[x.cu])||null;
 ds.filter(x=>!x.loi.length).forEach(x=>{const cu=tim(x);let kk;
  if(!x.dt&&!x.mail)kk=cu?'tk:'+cu:'solo:'+x.dong;
  else kk=Object.keys(g).find(z=>!z.startsWith('solo:')&&g[z].xs.some(y=>(x.dt&&y.dt===x.dt)||(x.mail&&y.mail===x.mail)))||(cu?'tk:'+cu:(x.dt?'dt:'+x.dt:'m:'+x.mail));
  (g[kk]=g[kk]||{cu,xs:[]}).xs.push(x);if(cu&&!g[kk].cu)g[kk].cu=cu});return g}
function xemTruoc(){const ds=qlNhap.ds,ok=ds.filter(x=>!x.loi.length),loi=ds.length-ok.length,moi=ok.filter(x=>!x.cu).length,cap=ok.length-moi,G=nhomPH(ds),nPH=Object.keys(G).length,phMoi=Object.values(G).filter(g=>!g.cu).length,anhEm=Object.values(G).filter(g=>g.xs.length>1).length;
 const ganCu={};Object.values(G).forEach(g=>{if(g.cu)g.xs.forEach(x=>ganCu[x.dong]=g.cu)});const phT=t=>((O().phInfo||{})[t]||{}).ten||t;
 const rows=ds.map(x=>{const d=x.d&&!x.d.loi?[x.d.ng,x.d.th,x.d.nam].filter(Boolean).join('/'):'';return`<tr class="${x.loi.length?'qlnbad':''}"><td>${x.dong}</td><td><b>${e(x.hoten||'—')}</b><div class="muted">${x.gt==='nam'?'Nam':x.gt==='nu'?'Nữ':''}${d?' · '+d:''}</div></td><td>${x.lop?e(x.lop.ten):(x.lopTen?e(x.lopTen):'—')}</td><td>${e(x.dt||'')}${x.mail?'<div class="muted">'+e(x.mail)+'</div>':''}</td><td>${x.loi.length?`<span class="qlnl1">✕ ${e(x.loi.join('; '))}</span>`:(x.cu?`<span class="qlnl2">↻ Cập nhật ${e(x.cu)}</span>`:'<span class="qlnl3">+ Tạo mới</span>')}${x.canh.map(c=>`<div class="qlnl4">⚠ ${e(c)}</div>`).join('')}${ganCu[x.dong]?`<div class="qlnl2" style="font-size:12.5px">👪 gắn với phụ huynh đã có: ${e(phT(ganCu[x.dong]))} (${e(ganCu[x.dong])})</div>`:''}</td></tr>`}).join('');
 return`<p><b>${e(qlNhap.ten)}</b> · ${ds.length} dòng</p>
 <div class="qlnsum"><span class="qlnl3">+ ${moi} em mới</span><span class="qlnl2">↻ ${cap} em cập nhật</span><span class="${loi?'qlnl1':'muted'}">✕ ${loi} dòng lỗi</span><span>👪 ${nPH} phụ huynh (${phMoi} tài khoản mới${anhEm?`, ${anhEm} nhà có anh chị em`:''})</span></div>
 ${loi?'<p class="qlnerr">Dòng lỗi (đỏ) sẽ bị bỏ qua. Sửa trong Excel rồi chọn lại file, hoặc nhập các dòng đúng trước.</p>':''}
 <div class="qlntb"><table><tr><th>Dòng</th><th>Học sinh</th><th>Lớp</th><th>Phụ huynh</th><th>Kết quả</th></tr>${rows}</table></div>
 <div class="qlin" style="margin-top:12px"><button type="button" class="btn pri" ${ok.length?'':'disabled'} onclick="qlChayNhap()">Nhập ${ok.length} em</button><label class="btn qlfile">Chọn file khác<input type="file" accept=".xlsx,.csv" onchange="qlDocFile(this.files[0])"></label></div>
 ${cloud()?'<p class="muted" style="font-size:12.5px">Mật khẩu ban đầu: <b>ngẫu nhiên</b>, chỉ có trên phiếu in trong phiên này; lần đầu đăng nhập phải tự đổi (học sinh và phụ huynh). Tạo tài khoản trên máy chủ mất vài giây mỗi em.</p>':''}`}

/* ---------- chạy nhập ---------- */
const setv=(i,x)=>{const el=document.getElementById(i);if(el)el.value=x};
window.tkPH0=function(id){const o=O(),dung=new Set([...Object.values(o.ph||{}),...Object.keys(o.phInfo||{}),...STUDENTS.map(s=>s[0]),...(o.gv||[]).map(g=>g.tk||g.id)]);const base=('ph.'+id).slice(0,24);let t=base,i=2;while(dung.has(t))t=base.slice(0,22)+(i++);return t};
const tkPH0=window.tkPH0;
function tkPH(x){const base=x.dt?'ph'+x.dt.slice(-6):(bo(x.mail.split('@')[0]).replace(/[^a-z0-9]/g,'').slice(0,14)||'phuhuynh');const o=O(),dung=new Set([...Object.values(o.ph||{}),...STUDENTS.map(s=>s[0]),...(o.gv||[]).map(g=>g.tk||g.id)]);let t=base,i=2;while(dung.has(t))t=base+(i++);return t}
window.qlChayNhap=async function(){const ds=qlNhap.ds.filter(x=>!x.loi.length);if(!ds.length)return;const bd=document.getElementById('qlnbd');const o=O();o.hoso=o.hoso||{};o.ph=o.ph||{};o.phInfo=o.phInfo||{};
 const _toast=window.toast,_render=window.render;let im=true;window.toast=function(){if(!im)return _toast.apply(this,arguments)};window.render=function(){};
 const kq={moi:[],cap:[],loi:[],ph:[]};const step=t=>{bd.innerHTML=`<p>${t}</p><div class="qlnbar"><i style="width:${Math.round(100*(kq.moi.length+kq.cap.length+kq.loi.length)/ds.length)}%"></i></div>`};
 try{
 for(const x of ds){step(`Đang nhập ${kq.moi.length+kq.cap.length+kq.loi.length+1}/${ds.length}: ${e(x.hoten)}…`);
  try{let id=x.cu;
   if(!id){setv('nhTen',x.hoten);setv('nhLop','');setv('nhGt',x.gt);setv('nhTk',x.tk||'');const pwMoi=MKmoi();setv('nhPw',pwMoi);const truoc=new Set(Object.keys(S.st));
    await window.qlTaoHS({preventDefault(){}});id=Object.keys(S.st).find(k=>!truoc.has(k));if(!id)throw new Error('không tạo được tài khoản');if(!qlMK[id])qlMK[id]=pwMoi;kq.moi.push(id)}else kq.cap.push(id);
   const H=o.hoso[id]=o.hoso[id]||{};H.gt=x.gt;if(x.d){if(x.d.ng){H.ng=x.d.ng;H.th=x.d.th}H.nam=x.d.nam}if(x.dt)H.dt=x.dt;if(x.mail)H.mail=x.mail;if(S.st[id])S.st[id].gender=x.gt;
   if(x.lop&&(o.gd||{})[id]!==x.lop.id)window.qlChuyen(id,x.lop.id);x.id=id}
  catch(err){kq.loi.push([x,err.message||String(err)])}}
 /* phụ huynh */
 const G=nhomPH(ds.filter(x=>x.id));
 for(const k in G){const g=G[k],con=g.xs.map(x=>x.id),x0={phten:(g.xs.find(x=>x.phten)||{}).phten||'',dt:(g.xs.find(x=>x.dt)||{}).dt||'',mail:(g.xs.find(x=>x.mail)||{}).mail||''};step('Đang gom phụ huynh…');
  try{let tk=g.cu;
   if(!tk){tk=tkPH0(g.xs[0].id);const pwPH=MKmoi();if(cloud()){const uid=await fbTaoTK(tk,pwPH);await FB.db.doc('users/'+uid).set({role:'ph',tk,ten:x0.phten||('Phụ huynh '+g.xs.map(x=>x.hoten.split(' ').pop()).join(', ')),con,mustChange:true})}
    o.phInfo[tk]={ten:x0.phten||'',dt:x0.dt||'',mail:x0.mail||''};qlMK[tk]=pwPH}
   else{const pi=o.phInfo[tk]=o.phInfo[tk]||{};if(!pi.ten&&x0.phten)pi.ten=x0.phten;if(!pi.dt&&x0.dt)pi.dt=x0.dt;if(!pi.mail&&x0.mail)pi.mail=x0.mail}
   con.forEach(c=>o.ph[c]=tk);
   if(cloud()&&g.cu){const all=Object.entries(o.ph).filter(([c,t])=>t===tk).map(([c])=>c);const q=await FB.db.collection('users').where('tk','==',tk).get();await Promise.all(q.docs.map(d=>FB.db.doc('users/'+d.id).set({con:all},{merge:true})))}
   kq.ph.push(tk)}catch(err){kq.loi.push([{hoten:'Phụ huynh của '+g.xs.map(x=>x.hoten).join(', '),dong:g.xs[0].dong},err.message||String(err)])}}
 (O().nk=O().nk||[]).push({d:S.day,ai:'Quản lý trung tâm',t:`Nhập Excel ${qlNhap.ten}: ${kq.moi.length} em mới, ${kq.cap.length} cập nhật, ${kq.ph.length} phụ huynh`});
 save();if(cloud()){try{await fbDayNgay()}catch(x){}}
 }finally{im=false;window.toast=_toast;window.render=_render}
 window.qlNhapKQ=kq;render();
 bd.innerHTML=`<p class="qlnok">✓ Xong: <b>${kq.moi.length}</b> em mới · <b>${kq.cap.length}</b> em cập nhật · <b>${kq.ph.length}</b> tài khoản phụ huynh.</p>
 ${kq.loi.length?`<div class="qlnerr">Chưa nhập được ${kq.loi.length}:<ul>${kq.loi.map(([x,m])=>`<li>Dòng ${x.dong} · ${e(x.hoten)}: ${e(m)}</li>`).join('')}</ul></div>`:''}
 <div class="qlin"><button type="button" class="btn pri" onclick="qlInPhieu([...qlNhapKQ.moi,...qlNhapKQ.cap],'hs')">🖨 In phiếu học sinh</button><button type="button" class="btn" ${kq.ph.length?'':'disabled'} onclick="qlInPhieu(qlNhapKQ.ph,'ph')">🖨 In phiếu phụ huynh</button><button type="button" class="btn ghost" onclick="document.getElementById('qlnhap').remove()">Đóng</button></div>
 <p class="muted" style="font-size:12.5px">Mật khẩu ban đầu ngẫu nhiên, chỉ có trên phiếu in trong phiên này; lần đầu đăng nhập phải tự đổi. Phiếu in đen trắng, 8 phiếu một trang A4, xếp theo lớp.</p>`};

/* ---------- in phiếu đăng nhập ---------- */
window.qlInPhieu=function(ids,loai){const o=O(),lopTen=id=>((o.lop||[]).find(l=>l.id===(o.gd||{})[id])||{}).ten||'';
 let the=[];
 if(loai==='ph'){const m={};Object.entries(o.ph||{}).forEach(([c,t])=>{(m[t]=m[t]||[]).push(c)});
  the=ids.map(t=>{const pi=(o.phInfo||{})[t]||{},con=(m[t]||[]).map(c=>(STUDENTS.find(s=>s[0]===c)||[c,c])[1]+(lopTen(c)?' ('+lopTen(c)+')':''));
   return{k:pi.ten||'',h:`<div class="pk">PHIẾU ĐĂNG NHẬP PHỤ HUYNH</div><div class="pn">${e(pi.ten||'Phụ huynh')}</div><div class="pc">Con: ${e(con.join(', '))}</div><div class="pr"><span>Trang web</span><b>${URL_PH}</b></div><div class="pr"><span>Tên đăng nhập</span><b class="pb">${e(t)}</b></div><div class="pr"><span>Mật khẩu</span><b class="pb">${qlMK[t]?e(qlMK[t]):'....................'}</b></div>`}})}
 else the=ids.map(id=>{const n=(STUDENTS.find(s=>s[0]===id)||[id,id])[1],l=lopTen(id);return{k:(l||'zzz')+'|'+n.split(' ').pop()+'|'+n,h:`<div class="pk">PHIẾU ĐĂNG NHẬP HỌC SINH</div><div class="pn">${e(n)}</div><div class="pc">${l?'Lớp '+e(l):'Chưa xếp lớp'}</div><div class="pr"><span>Trang web</span><b>${URL_HS}</b></div><div class="pr"><span>Tên đăng nhập</span><b class="pb">${e(id)}</b></div><div class="pr"><span>Mật khẩu</span><b class="pb">${qlMK[id]?e(qlMK[id]):'....................'}</b></div>`}});
 if(!the.length){toast('Chưa có ai để in');return}
 the.sort((a,b)=>a.k.localeCompare(b.k,'vi'));
 let el=document.getElementById('qlin');if(el)el.remove();el=document.createElement('div');el.id='qlin';
 el.innerHTML=`<div class="qlin-bar"><b>${the.length} phiếu</b><button type="button" class="btn pri" onclick="window.print()">🖨 In</button><button type="button" class="btn" onclick="document.getElementById('qlin').remove()">Đóng</button></div><div class="qlin-grid">${the.map(t=>`<div class="pt"><div class="ph">Clb Học Toán cùng Jenny</div>${t.h}<div class="pf">Giữ phiếu cẩn thận. Đổi mật khẩu sau lần đăng nhập đầu.</div></div>`).join('')}</div>`;
 document.body.appendChild(el);window.scrollTo(0,0)};
window.qlInLop=function(lid){const ids=STUDENTS.filter(s=>(O().gd||{})[s[0]]===lid).map(s=>s[0]);qlInPhieu(ids,'hs')};

/* ---------- gắn nút ---------- */
{const _p=hooks.cu('viewPH');hooks.de('viewPH',function(){let r=_p.apply(this,arguments);if(role!=='ql')return r;try{
 if(qlTrang==='hs')r=r.replace(`onclick="qlMoHS()">+ Thêm học sinh</button>`,`onclick="qlMoHS()">+ Thêm học sinh</button><button type="button" class="btn pri" onclick="qlMoNhap()">⬆ Nhập từ Excel</button><button type="button" class="btn" onclick="qlTaiDS()">⬇ Tải danh sách</button>`)
  .replace(`<button type="button" class="btn sm ghost" onclick="qlChon={};render()">Bỏ chọn</button>`,`<button type="button" class="btn sm" onclick="qlInPhieu(Object.keys(qlChon).filter(k=>qlChon[k]),'hs')">🖨 In phiếu</button><button type="button" class="btn sm ghost" onclick="qlChon={};render()">Bỏ chọn</button>`);
 if(qlTrang==='lopct')r=r.replace(/(<span class="pill">Khối \d+ · \d+ em<\/span><\/div>)/,`$1<div class="qlin"><button type="button" class="btn" onclick="qlInLop('${qlLopId}')">🖨 In phiếu cả lớp</button></div>`);
 if(qlTrang==='ph')r=r.replace(`<div class="row" style="gap:8px" id="phNut"></div>`,`<div class="row" style="gap:8px" id="phNut"><button type="button" class="btn" onclick="qlInPhieu([...new Set(Object.values(S.org.ph||{}))],'ph')">🖨 In phiếu phụ huynh</button></div>`);
 }catch(x){console.error(x)}return r})}

document.head.insertAdjacentHTML('beforeend',`<style>
.gdbox.qlnbox{width:min(980px,100%)!important;max-width:none!important}.qlnbd{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.qlnstep{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:14px}.qlnstep li{padding-left:4px}.qlnstep .muted{font-size:13px;margin-top:6px}
.qlfile{position:relative;overflow:hidden;cursor:pointer}.qlfile input{position:absolute;inset:0;opacity:0;cursor:pointer}
.qlnsum{display:flex;flex-wrap:wrap;gap:8px 16px;font-weight:700}
.qlntb{max-height:52vh;overflow:auto;box-shadow:var(--f2)}.qlntb table{width:100%;border-collapse:collapse;font-size:13.5px}.qlntb th{position:sticky;top:0;background:#EEF2F8;text-align:left;padding:6px 8px;font-size:12px}.qlntb td{padding:6px 8px;border-top:1px solid #DDE3F0;vertical-align:top}
.qlntb td,.qlntb th,.qlntb b{color:#13263a}.qlntb .muted{color:#566779}
@media(max-width:600px){.qlntb table,.qlntb tbody,.qlntb tr,.qlntb td{display:block;width:auto}.qlntb tr:first-child{display:none}.qlntb tr{border-top:1px solid #DDE3F0;padding:6px 8px}.qlntb td{border:0;padding:1px 0}.qlntb td:first-child{font-size:11px;color:#566779}.qlntb td:first-child::before{content:'Dòng '}.qlntb td:nth-child(3)::before{content:'Lớp: ';color:#566779}.qlnbad{background:#FDECEA}}
.qlnbad td{background:#FDECEA}.qlnl1{color:#B3261E;font-weight:700}.qlnl2{color:#0B62A4;font-weight:700}.qlnl3{color:#1E7A45;font-weight:700}.qlnl4{color:#8A4B00;font-size:12.5px}
.qlnerr{color:#B3261E;background:#FDECEA;padding:8px 10px;margin:0}.qlnerr ul{margin:4px 0 0;padding-left:18px}.qlnok{color:#1E7A45;font-size:16px;margin:0}
.qlnbar{height:12px;background:#E3E8F2;box-shadow:var(--f2)}.qlnbar i{display:block;height:100%;background:#0079C1}
#qlin{position:fixed;inset:0;z-index:90;background:#fff;color:#000;overflow:auto;padding:12px}
.qlin-bar{display:flex;gap:10px;align-items:center;margin-bottom:12px}
.qlin-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0}
.pt{border:1.5px dashed #000;padding:10px 12px;font-family:Arial,sans-serif;color:#000;break-inside:avoid;page-break-inside:avoid;min-height:62mm;box-sizing:border-box}
.pt .ph{font-weight:700;font-size:13px;border-bottom:1px solid #000;padding-bottom:3px}.pt .pk{font-size:11px;letter-spacing:.5px;margin-top:4px}
.pt .pn{font-size:19px;font-weight:700;margin-top:4px}.pt .pc{font-size:13px;margin:2px 0 6px}
.pt .pr{display:flex;flex-direction:column;margin-top:4px}.pt .pr span{font-size:11px}.pt .pr b{font-size:12.5px;word-break:break-all}.pt .pr b.pb{font-family:'Courier New',monospace;font-size:18px;letter-spacing:.5px}
.pt .pf{font-size:10px;margin-top:6px;font-style:italic}
@media(max-width:560px){.qlin-grid{grid-template-columns:1fr}}
@media print{body>*:not(#qlin){display:none!important}#qlin{position:static;padding:0}.qlin-bar{display:none}.qlin-grid{grid-template-columns:repeat(2,1fr)}@page{size:A4;margin:8mm}}
</style>`);
})();
