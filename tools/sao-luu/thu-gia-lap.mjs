#!/usr/bin/env node
// Thử vòng xuất → nạp bằng Firestore GIẢ LẬP trong bộ nhớ (không cần firebase-admin, Java hay emulator).
// Kiểm: số document sau nạp bằng bản gốc; Timestamp/Bytes/mảng/object lồng giữ nguyên; bộ sưu tập con giữ nguyên.
//   node tools/sao-luu/thu-gia-lap.mjs      (npm test không gọi file này; chạy tay hoặc `npm run thu --prefix tools/sao-luu`)
import assert from 'node:assert/strict';
import { xuatTatCa, napVao, demDoc, maHoa, giaiMa } from './_chung.mjs';

/* ---- Timestamp/GeoPoint giả, cùng giao diện firebase-admin ---- */
class Timestamp { constructor(s, n = 0) { this.seconds = s; this.nanoseconds = n; } toDate() { return new Date(this.seconds * 1000 + this.nanoseconds / 1e6); } static fromDate(d) { return new Timestamp(Math.floor(d.getTime() / 1000), (d.getTime() % 1000) * 1e6); } }
class GeoPoint { constructor(latitude, longitude) { this.latitude = latitude; this.longitude = longitude; } }

/* ---- Firestore giả: Map đường dẫn → {data, subs} ---- */
class Db {
  constructor() { this.docs = new Map(); this.roots = new Set(); }
  collection(ten) { return new Col(this, null, ten); }
  doc(p) { const x = p.split('/'); let col = this.collection(x[0]); let ref = col.doc(x[1]); for (let i = 2; i < x.length; i += 2) ref = ref.collection(x[i]).doc(x[i + 1]); return ref; }
  async listCollections() { const s = new Set([...this.docs.keys()].map(p => p.split('/')[0])); return [...s].sort().map(t => this.collection(t)); }
  async getAll(...refs) { return refs.map(r => r.snap()); }
  batch() { const ops = []; return { set: (ref, data) => ops.push([ref, data]), commit: async () => { for (const [r, d] of ops) r.db.docs.set(r.path, d); } }; }
}
class Col {
  constructor(db, cha, id) { this.db = db; this.cha = cha; this.id = id; this.path = cha ? cha.path + '/' + id : id; }
  doc(id) { return new Doc(this.db, this, id); }
  async listDocuments() { // cả document "thiếu" chỉ có con
    const ids = new Set(); const pre = this.path + '/';
    for (const p of this.db.docs.keys()) if (p.startsWith(pre)) ids.add(p.slice(pre.length).split('/')[0]);
    return [...ids].sort().map(id => this.doc(id));
  }
}
class Doc {
  constructor(db, col, id) { this.db = db; this.col = col; this.id = id; this.path = col.path + '/' + id; }
  collection(ten) { return new Col(this.db, this, ten); }
  async listCollections() { const s = new Set(); const pre = this.path + '/'; for (const p of this.db.docs.keys()) if (p.startsWith(pre)) s.add(p.slice(pre.length).split('/')[0]); return [...s].sort().map(t => this.collection(t)); }
  snap() { const d = this.db.docs.get(this.path); return { id: this.id, ref: this, exists: d !== undefined, data: () => d }; }
}

/* ---- Dữ liệu giả lập theo đúng tên bộ sưu tập của 62-may-chu.js ---- */
const goc = new Db();
const luc = new Timestamp(1_761_000_000, 123_000_000);
goc.docs.set('org/main', { j: JSON.stringify({ lop: [{ id: '1A', khoi: 1, gv: ['co1'] }], gd: { an: '1A' } }), gd: { an: '1A' }, admins: ['uid-ql'], t: luc });
goc.docs.set('users/uid-ql', { role: 'ql', tk: 'quanly', ten: 'Quản lý', t: luc });
goc.docs.set('users/uid-an', { role: 'hs', tk: 'an', ten: 'Nguyễn Minh An', khoi: 1 });
goc.docs.set('users/uid-ph', { role: 'ph', tk: 'ph.an', ten: 'Phụ huynh An', con: ['an'] });
goc.docs.set('login/an', { email: 'an@jenny-lop-hoc-ao.firebaseapp.com', uid: 'uid-an', t: luc });
goc.docs.set('hs/an', { j: JSON.stringify({ name: 'Nguyễn Minh An', grade: 1, coins: 40, p1: { done: [1, 2, 3] } }), ev: '[]', lop: '1A', t: luc, anh: Buffer.from('xin chào') });
goc.docs.set('hsgv/an', { j: JSON.stringify({ comments: ['Giỏi lắm!'], badges: [], gvNote: 'ghi chú riêng', gvSkip: {} }), t: luc });
goc.docs.set('asg/a1', { j: '{"lop":"1A","cau":[1,2]}', lop: '1A', t: luc, vitri: new GeoPoint(21.03, 105.85), thay: goc.doc('users/uid-ql') });
goc.docs.set('hs/an/lichsu/2026-10', { diem: [1, 2.5, null, true], ghi: { a: { b: { c: 'sâu' } } } }); // bộ sưu tập con
goc.docs.set('thuc-nghiem/chi-co-con/muc/1', { x: 1 });                                               // document cha "thiếu"

/* 1) xuất */
const bak = await xuatTatCa(goc, 'demo-jenny');
const json = JSON.stringify(bak);
assert.equal(bak.soDoc, 11, 'đếm cả document thiếu và document con');
assert.equal(bak.boSuuTap.org.main.d.t.__ts, new Date(1_761_000_000_123).toISOString());
assert.equal(bak.boSuuTap.hs.an.d.anh.__b64, Buffer.from('xin chào').toString('base64'));
assert.deepEqual(bak.boSuuTap.asg.a1.d.vitri, { __geo: [21.03, 105.85] });
assert.deepEqual(bak.boSuuTap.asg.a1.d.thay, { __ref: 'users/uid-ql' });
assert.equal(bak.boSuuTap['thuc-nghiem']['chi-co-con'].d, null);
assert.equal(bak.boSuuTap['thuc-nghiem']['chi-co-con'].c.muc['1'].d.x, 1);
assert.equal(bak.boSuuTap.hs.an.c.lichsu['2026-10'].d.ghi.a.b.c, 'sâu');

/* 2) nạp vào db trống rồi so */
const moi = new Db();
const fsGia = { Timestamp, GeoPoint, db: moi };
const n = await napVao(moi, JSON.parse(json), fsGia);
assert.equal(n, 10, 'ghi 10 document có dữ liệu (document thiếu không ghi)');
assert.equal(demDoc((await xuatTatCa(moi, 'demo-jenny')).boSuuTap), 11, 'sau nạp đếm lại bằng bản gốc');
const chuan = p => maHoa(goc.docs.get(p));
for (const p of goc.docs.keys()) assert.deepEqual(maHoa(moi.docs.get(p)), chuan(p), 'khác ở ' + p);
assert.ok(moi.docs.get('org/main').t instanceof Timestamp && moi.docs.get('org/main').t.seconds === 1_761_000_000);
assert.ok(Buffer.isBuffer(moi.docs.get('hs/an').anh) && moi.docs.get('hs/an').anh.toString() === 'xin chào');
assert.ok(moi.docs.get('asg/a1').vitri instanceof GeoPoint);
assert.equal(moi.docs.get('asg/a1').thay.path, 'users/uid-ql');

/* 3) giá trị thường không bị hiểu nhầm thành giá trị đặc biệt */
assert.deepEqual(giaiMa(maHoa({ __ts: 'không phải', them: 1 }), fsGia), { __ts: 'không phải', them: 1 });

/* 4) lô 400: 1000 document → 3 lần commit */
const lon = new Db(); for (let i = 0; i < 1000; i++) lon.docs.set('ev/' + i, { i });
const dich = new Db(); let soCommit = 0; const _b = dich.batch.bind(dich);
dich.batch = () => { const b = _b(); const c = b.commit; b.commit = async () => { soCommit++; return c(); }; return b; };
assert.equal(await napVao(dich, await xuatTatCa(lon), fsGia), 1000); assert.equal(soCommit, 3);

console.log(`ĐẠT: xuất ${bak.soDoc} document (${Math.round(json.length / 1024)} KB JSON), nạp lại ${n}, đếm lại ${demDoc(bak.boSuuTap)}; 1000 document → ${soCommit} lô.`);
