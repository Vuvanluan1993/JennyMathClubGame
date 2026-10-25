// Phần dùng chung cho firestore-dump.mjs và firestore-restore.mjs (không phụ thuộc firebase-admin để thử được bằng dữ liệu giả lập).
// Dạng file sao lưu:
//   { phienBan: 1, duAn, luc: ISO, soDoc, boSuuTap: { <tên>: { <id>: { d: {…trường…}, c: { <tên con>: {…} } } } } }
// Giá trị đặc biệt của Firestore được ghi thành object có khoá "__":
//   Timestamp → {__ts: ISO} · Bytes → {__b64: base64} · GeoPoint → {__geo:[lat,lng]} · DocumentReference → {__ref: đường dẫn}

const laTimestamp = v => v && typeof v === 'object' && typeof v.toDate === 'function' && typeof v.seconds === 'number';
const laGeo = v => v && typeof v === 'object' && typeof v.latitude === 'number' && typeof v.longitude === 'number' && Object.keys(v).length <= 2;
const laRef = v => v && typeof v === 'object' && typeof v.path === 'string' && typeof v.id === 'string' && (typeof v.collection === 'function' || typeof v.listCollections === 'function');

/** Firestore → JSON thuần. */
export function maHoa(v) {
  if (v === null || v === undefined) return null;
  if (laTimestamp(v)) return { __ts: v.toDate().toISOString() };
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(v)) return { __b64: v.toString('base64') };
  if (v instanceof Uint8Array) return { __b64: Buffer.from(v).toString('base64') };
  if (laRef(v)) return { __ref: v.path };
  if (laGeo(v)) return { __geo: [v.latitude, v.longitude] };
  if (Array.isArray(v)) return v.map(maHoa);
  if (typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v)) o[k] = maHoa(x);
    return o;
  }
  return v; // string, number, boolean
}

/** JSON thuần → Firestore. `fs` = { Timestamp, GeoPoint, db } của firebase-admin (db để tạo DocumentReference). */
export function giaiMa(v, fs) {
  if (v === null || v === undefined) return null;
  if (Array.isArray(v)) return v.map(x => giaiMa(x, fs));
  if (typeof v === 'object') {
    const k = Object.keys(v);
    if (k.length === 1) {
      if (k[0] === '__ts') return fs.Timestamp.fromDate(new Date(v.__ts));
      if (k[0] === '__b64') return Buffer.from(v.__b64, 'base64');
      if (k[0] === '__geo') return new fs.GeoPoint(v.__geo[0], v.__geo[1]);
      if (k[0] === '__ref') return fs.db.doc(v.__ref);
    }
    const o = {};
    for (const [kk, x] of Object.entries(v)) o[kk] = giaiMa(x, fs);
    return o;
  }
  return v;
}

/** Đếm số document (kể cả trong bộ sưu tập con). */
export function demDoc(boSuuTap) {
  let n = 0;
  for (const docs of Object.values(boSuuTap || {}))
    for (const d of Object.values(docs)) { n += 1; if (d.c) n += demDoc(d.c); }
  return n;
}

/** Đọc một bộ sưu tập (CollectionReference) kể cả document "thiếu" chỉ có bộ sưu tập con. */
async function xuatBoSuuTap(db, col) {
  const out = {};
  const refs = await col.listDocuments();
  for (let i = 0; i < refs.length; i += 300) {
    const snaps = await db.getAll(...refs.slice(i, i + 300));
    for (const s of snaps) {
      const mot = { d: s.exists ? maHoa(s.data()) : null };
      const con = await s.ref.listCollections();
      if (con.length) { mot.c = {}; for (const c of con) mot.c[c.id] = await xuatBoSuuTap(db, c); }
      out[s.id] = mot;
    }
  }
  return out;
}

/** Xuất toàn bộ Firestore. `db` = admin.firestore() (hoặc bản giả lập cùng giao diện). */
export async function xuatTatCa(db, duAn) {
  const boSuuTap = {};
  for (const c of await db.listCollections()) boSuuTap[c.id] = await xuatBoSuuTap(db, c);
  return { phienBan: 1, duAn: duAn || '', luc: new Date().toISOString(), soDoc: demDoc(boSuuTap), boSuuTap };
}

/** Nạp file sao lưu vào `db` (ghi đè từng document bằng set, 400 document một lô). Trả về số document đã ghi. */
export async function napVao(db, bak, fs, ghiLog = () => {}) {
  let n = 0, batch = db.batch(), trongLo = 0;
  const day = async () => { if (trongLo) { await batch.commit(); batch = db.batch(); trongLo = 0; } };
  const ghi = async (cha, boSuuTap) => {
    for (const [ten, docs] of Object.entries(boSuuTap)) {
      for (const [id, mot] of Object.entries(docs)) {
        const ref = cha ? cha.collection(ten).doc(id) : db.collection(ten).doc(id);
        if (mot.d !== null && mot.d !== undefined) { batch.set(ref, giaiMa(mot.d, fs)); trongLo++; n++; if (trongLo >= 400) await day(); }
        if (mot.c) await ghi(ref, mot.c);
      }
      ghiLog(`${cha ? cha.path + '/' : ''}${ten}: ${Object.keys(docs).length} document`);
    }
  };
  await ghi(null, bak.boSuuTap || {});
  await day();
  return n;
}
