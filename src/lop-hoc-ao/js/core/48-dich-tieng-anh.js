/* 48 — Dịch nội dung sang tiếng Anh (Anh – Anh, thuật ngữ Cambridge), giai đoạn 2: làm theo từng lớp.
   Cơ chế: mỗi chuỗi tiếng Việt được chuẩn hoá thành "khuôn": thẻ HTML → <>, số → #, số đọc bằng chữ → {w},
   tên đồ vật → {o}. Tra khuôn trong EN_T (các tệp 48b-en-lop1.js …) rồi điền lại giá trị.
   - Khuôn EN dùng #, {w}, {o}, <> theo thứ tự; hoặc chỉ rõ vị trí: #2, {w1}, {o2} (đếm từ 1).
   - {o} tự thêm số nhiều khi số đứng trước khác 1; {o:s} ép số ít, {o:p} ép số nhiều.
   - Không thấy khuôn cả chuỗi thì dịch từng câu; vẫn không thấy thì giữ nguyên (công cụ rà sẽ báo).
   Giữ tên người Việt (Lan, Nam, Mai, Việt) và tiền đồng như sách. */
import { hooks } from './00-hooks.js';
import { curG, PRIM } from './25-lop-1-so-loi-sai-toan-jenny.js';
import { LES } from '../content/hk1/30-bai-giang-jenny-slide-tom-tat-kien-thuc.js';
import { duck } from './33b-am-thanh.js';
export const EN_T={},EN_NOUN={};
const VI_DIG={'không':0,'một':1,'mốt':1,'hai':2,'ba':3,'bốn':4,'tư':4,'năm':5,'lăm':5,'sáu':6,'bảy':7,'tám':8,'chín':9};
const EN_W=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const EN_TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function enWord(n){if(n<20)return EN_W[n];if(n<100)return EN_TENS[Math.floor(n/10)]+(n%10?'-'+EN_W[n%10]:'');return String(n)}
/* số đọc bằng chữ: "hai mươi lăm", "mười một", "bảy" */
const VI_NUMW_RE=/(^|[\s(“"'\u0001])((?:(?:một|hai|ba|bốn|năm|sáu|bảy|tám|chín) mươi(?: (?:mốt|hai|ba|tư|bốn|lăm|năm|sáu|bảy|tám|chín))?)|(?:mười(?: (?:một|hai|ba|bốn|lăm|năm|sáu|bảy|tám|chín))?)|không|một|hai|ba|bốn|năm|sáu|bảy|tám|chín)(?=[\s.,?!:;)”"'\u0001]|$)/g;
function viNumVal(w){const p=w.split(' ');if(p[0]==='mười')return 10+(p[1]?VI_DIG[p[1]]:0);if(p[1]==='mươi')return VI_DIG[p[0]]*10+(p[2]?VI_DIG[p[2]]:0);return VI_DIG[p[0]]}
globalThis.EN_NOUN_RE=null;
function enNounRe(){if(EN_NOUN_RE)return EN_NOUN_RE;const ks=Object.keys(EN_NOUN).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));EN_NOUN_RE=ks.length?new RegExp('(?<![A-Za-zÀ-ỹ])('+ks.join('|')+')(?![A-Za-zÀ-ỹ])','gi'):/$^/;return EN_NOUN_RE}
const ENUM_RE=/\d+(?:[  ]\d{3})*(?:,\d+)?/g;
/* chuẩn hoá: trả {key, tags, nums, words, nouns} */
function trKey(s){const tags=[],nums=[],words=[],nouns=[];
 let k=String(s).replace(/<[^>]*>/g,m=>{tags.push(m);return'\u0001'});
 k=k.replace(/&nbsp;/g,' ').replace(/[ \t\n\r]+/g,' ');
 k=k.replace(enNounRe(),m=>{nouns.push(m.toLowerCase());return'\u0003'});
 k=k.replace(ENUM_RE,m=>{nums.push(m);return'\u0002'});
 k=k.replace(VI_NUMW_RE,(m,pre,w)=>{words.push(viNumVal(w));return pre+'\u0004'});
 k=k.replace(/\u0001/g,'<>').replace(/\u0002/g,'#').replace(/\u0003/g,'{o}').replace(/\u0004/g,'{w}');
 return{key:k,tags,nums,words,nouns}}
const enNum=v=>{const n=Number(String(v).replace(/[  ]/g,'').replace(',','.'));return isNaN(n)?null:n};
function enPlural(vi,n){const e=EN_NOUN[vi];if(!e)return vi;return n===1?e[0]:e[1]}
function trFill(t,P){const it={'#':0,'{w}':0,'{o}':0,'<>':0};let last=null,out='';
 const re=/<>|#(\d+)?|\{w(\d+)?\}|\{o(\d+)?(?::([spSP]))?\}|\{W(\d+)?\}|\{be\}|\{a\}|\{1:([^|}]*)\|([^}]*)\}/g;let m,i=0;
 while((m=re.exec(t))){out+=t.slice(i,m.index);i=re.lastIndex;const tok=m[0];
  if(tok==='<>'){out+=P.tags[it['<>']++]??''}
  else if(tok==='{a}'){out+='\u0005'}
  else if(tok.startsWith('{1:')){out+=last===1?m[6]:m[7]}
  else if(tok==='{be}'){/* is/are theo số đứng ngay sau */const r=t.slice(i),j=r.search(/#|\{w|\{W/);let v=null;if(j>=0){const n=r.slice(j).match(/^#(\d+)?|^\{[wW](\d+)?\}/);if(n&&n[0][0]==='#')v=enNum(P.nums[n[1]?n[1]-1:it['#']]);else if(n)v=P.words[n[2]?n[2]-1:it['{w}']]}out+=v===1?'is':'are'}
  else if(tok[0]==='#'){const v=P.nums[m[1]?m[1]-1:it['#']++];out+=v??'';last=enNum(v)}
  else if(tok.startsWith('{w')){const v=P.words[m[2]?m[2]-1:it['{w}']++];out+=v==null?'':enWord(v);last=v}
  else if(tok.startsWith('{W')){const v=P.words[m[5]?m[5]-1:it['{w}']++];out+=v==null?'':String(v);last=v}
  else{const vi=P.nouns[m[3]?m[3]-1:it['{o}']++];const f=m[4];let w=vi==null?'':enPlural(vi,/[sS]/.test(f||'')?1:/[pP]/.test(f||'')?2:(last==null?1:last));if(f&&f===f.toUpperCase())w=w.charAt(0).toUpperCase()+w.slice(1);out+=w}}
 out+=t.slice(i);
 /* a/an theo chữ đứng sau (bỏ qua thẻ) */
 out=out.replace(/\u0005(\s*(?:<[^>]*>\s*)*)([A-Za-z])?/g,(x,sp,c)=>(c&&/[aeiouAEIOU]/.test(c)?'an':'a')+sp+(c||''));
 return out}
function trOne(s){const P=trKey(s),t=EN_T[P.key];if(t==null)return null;let r=trFill(t,P);const a=String(s).replace(/<[^>]*>/g,'').trim().charAt(0),b=r.replace(/<[^>]*>/g,'').trim().charAt(0);if(a&&a===a.toUpperCase()&&a!==a.toLowerCase()&&b&&b!==b.toUpperCase()){const i=r.indexOf(b,r.search(/(?:^|>)[^<]/));r=r.slice(0,i)+b.toUpperCase()+r.slice(i+1)}return r}
/* dịch một chuỗi (có thể có thẻ HTML): thử cả chuỗi → từng câu → từng đoạn chữ giữa các thẻ */
function enSplit(s){const m=s.replace(/<[^>]*>/g,x=>'\u0001'.repeat(x.length)),re=/(?<=[.?!:])\s+(?=[^\s])/g,out=[];let i=0,k;while((k=re.exec(m))){out.push(s.slice(i,k.index));i=k.index+k[0].length}out.push(s.slice(i));return out}
/* ghép câu tham lam: thử đoạn dài nhất trước (khuôn có thể chứa dấu ":" hay nhiều câu) */
function trJoin(ps){const out=[];let i=0,hit=0;while(i<ps.length){let ok=0;for(let j=ps.length;j>i;j--){const x=trOne(ps.slice(i,j).join(' '));if(x!=null){out.push(x);i=j;ok=1;hit=1;break}}if(!ok){out.push(ps[i]);i++}}return hit?out.join(' '):null}
function trSeg(t){const s=t.trim();if(!s||!/[A-Za-zÀ-ỹđĐ]/.test(s))return t;let x=trOne(s);if(x==null){const ps=enSplit(s);if(ps.length>1)x=trJoin(ps)}return x==null?t:t.replace(s,x)}
const enViCount=h=>(String(h).replace(/<[^>]*>/g,'').match(/[À-ỹđĐ]/g)||[]).length;
function trEN(s){if(s==null||typeof s!=='string'||!/[À-ỹđĐ]|[a-z]/i.test(s.replace(/<[^>]*>/g,'')))return s;const r=trOne(s);if(r!=null)return r;
 const tg=/<[^>]+>/.test(s),segs=h=>h.replace(/(^|>)([^<]+)(?=<|$)/g,(m,a,txt)=>a+trSeg(txt));
 const ps=enSplit(s);let A=s;if(ps.length>1){const out=[];let i=0;while(i<ps.length){let ok=0;for(let j=ps.length;j>i;j--){const x=trOne(ps.slice(i,j).join(' '));if(x!=null){out.push(x);i=j;ok=1;break}}if(!ok){out.push(tg&&/<[^>]+>/.test(ps[i])?segs(ps[i]):trSeg(ps[i]));i++}}A=out.join(' ')}else if(!tg)A=trSeg(s);
 if(!tg)return A;const B=segs(s);return enViCount(B)<enViCount(A)?B:A}
export const enOn=()=>LANG==='en'&&EN_GR.has(+(typeof curG==='function'?curG():0));
export const EN_GR=new Set();/* các lớp đã dịch xong (48b… tự thêm) */
/* câu hỏi: dịch các trường khi sinh câu */
const enCap=h=>typeof h==='string'?h.replace(/^((?:\s|<[^>]*>)*)([a-z])/,(m,a,c)=>a+c.toUpperCase()):h;
export function trQ(q){if(!q||!enOn()||q.en)return q;const c={...q,en:1};for(const f of ['q','say','sol','pic','label'])if(typeof c[f]==='string')c[f]=trEN(c[f]);for(const f of ['q','say','sol'])c[f]=enCap(c[f]);
 if(Array.isArray(c.opts))c.opts=c.opts.map(o=>o&&typeof o==='object'?{...o,h:trEN(o.h)}:trEN(o));if(Array.isArray(c.tiles))c.tiles=c.tiles.map(trEN);return c}
for(const G in PRIM){if(!PRIM[G].isl)continue;for(const x of PRIM[G].isl)(x.lv||[]).forEach(gs=>gs.forEach((gn,i)=>{if(typeof gn==='function'&&!gn.en){const w=function(){return trQ(gn.apply(this,arguments))};w.en=1;w.gdFlip=gn.gdFlip;gs[i]=w}}))}
/* nội dung tĩnh của lớp: tên chủ đề, đảo, bài giảng, trùm, vùng biển — đổi tại chỗ, giữ bản gốc trong _vi */
function enSwapObj(o,fields){if(!o)return;o._vi=o._vi||{};for(const f of fields){if(typeof o[f]!=='string'&&!(f in o._vi))continue;if(!(f in o._vi))o._vi[f]=o[f];o[f]=LANG==='en'?trEN(o._vi[f]):o._vi[f]}}
export function enSwapAll(){for(const G of EN_GR){const P=PRIM[G];if(!P)continue;(P.isl||[]).forEach(x=>enSwapObj(x,['lesson','short','goal','title']));
  if(Array.isArray(P.T))P.T.forEach((t,i)=>{if(Array.isArray(t)){t._vi=t._vi||{};if(!('0' in t._vi))t._vi[0]=t[0];t[0]=LANG==='en'?trEN(t._vi[0]):t._vi[0]}});
  if(Array.isArray(P.boss))P.boss.forEach(b=>{if(Array.isArray(b)){b._vi=b._vi||{};if(!('1' in b._vi))b._vi[1]=b[1];b[1]=LANG==='en'?trEN(b._vi[1]):b._vi[1]}});
  const L=(typeof LES!=='undefined'&&LES[G])||{};for(const k in L)(L[k]||[]).forEach(sl=>enSwapObj(sl,['t','h','say']))}}
/* Jenny đọc: tiếng Anh thì dịch câu và đọc giọng en-GB */
let enVoice=null;function pickEnVoice(){try{const vs=speechSynthesis.getVoices();return vs.find(v=>/^en-GB/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null}catch(e){return null}}
{hooks.on('sayJ',_s=>function(text){if(!enOn())return _s.apply(this,arguments);if(muted||!text)return;try{const s=window.speechSynthesis;if(!s)return;s.cancel();if(!enVoice)enVoice=pickEnVoice();
  const t=trEN(String(text)).replace(/<[^>]+>/g,' ').replace(/×/g,' times ').replace(/(\d)\s*:\s*(\d)/g,'$1 divided by $2').replace(/(\d)\s*cm\b/g,'$1 centimetres').replace(/−/g,' minus ').replace(/\+/g,' plus ').replace(/=/g,' equals ').replace(/☐/g,' blank ').replace(/\s+/g,' ');
  const u=new SpeechSynthesisUtterance(t);u.lang='en-GB';if(enVoice)u.voice=enVoice;u.rate=.92;u.onstart=()=>{try{duck(1)}catch(e){}};u.onend=u.onerror=()=>{try{duck(0)}catch(e){}};s.speak(u)}catch(e){}})}
/* chữ trên màn hình còn sót (hướng dẫn, trò chơi, hình): dịch thêm bằng khuôn khi bật EN */
{hooks.on('i18nText',_t=>function(t){const r=_t(t);if(r!=null||!enOn())return r;const s=t.trim();const x=trOne(s);return x==null?null:t.replace(s,x)})}
{hooks.on('setLang',_sl=>function(l){LANG=l==='en'?'en':'vi';try{enSwapAll()}catch(e){}if(scr&&scr.k==='game'&&scr.qs){scr.qs=scr.qs.map(q=>LANG==='en'?trQ(q):q)}return _sl.apply(this,arguments)})}

/* khung hướng dẫn khi sai */
{hooks.on('gdOpenF',_g=>function(F,auto,kind){if(enOn())F=F.map(f=>{const g={...f,h:trEN(f.h),say:trEN(f.say)};if(f.mcq)g.mcq={...f.mcq,q:trEN(f.mcq.q),ok:trEN(f.mcq.ok),hint:trEN(f.mcq.hint),opts:f.mcq.opts.map(o=>trEN(String(o))),a:trEN(String(f.mcq.a))};return g});return _g.call(this,F,auto,kind)})}
