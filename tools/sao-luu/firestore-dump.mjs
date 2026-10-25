#!/usr/bin/env node
// Xuất toàn bộ Firestore (mọi bộ sưu tập, kể cả bộ sưu tập con) ra backup-YYYY-MM-DD.json.
//   FIREBASE_SA_JSON='{…service account…}' node tools/sao-luu/firestore-dump.mjs [--ra <thư mục>] [--ten <tên file>]
// Service account chỉ cần quyền đọc (roles/datastore.viewer). Không bao giờ ghi service account vào kho.
// Có FIRESTORE_EMULATOR_HOST thì đọc từ emulator (không cần service account, cần GCLOUD_PROJECT).
import fs from 'node:fs';
import path from 'node:path';
import { xuatTatCa } from './_chung.mjs';

const arg = (k, mac) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : mac; };
const raDir = path.resolve(arg('--ra', '.'));
const ngay = new Date().toISOString().slice(0, 10);
const tenFile = arg('--ten', `backup-${ngay}.json`);

const admin = (await import('firebase-admin')).default;
let duAn;
if (process.env.FIRESTORE_EMULATOR_HOST) {
  duAn = process.env.GCLOUD_PROJECT || 'demo-jenny';
  admin.initializeApp({ projectId: duAn });
} else {
  if (!process.env.FIREBASE_SA_JSON) { console.error('Thiếu biến môi trường FIREBASE_SA_JSON (service account JSON).'); process.exit(2); }
  let sa; try { sa = JSON.parse(process.env.FIREBASE_SA_JSON); } catch { console.error('FIREBASE_SA_JSON không phải JSON hợp lệ.'); process.exit(2); }
  duAn = sa.project_id;
  admin.initializeApp({ credential: admin.credential.cert(sa), projectId: duAn });
}
const db = admin.firestore();
const t0 = Date.now();
const bak = await xuatTatCa(db, duAn);
fs.mkdirSync(raDir, { recursive: true });
const ra = path.join(raDir, tenFile);
fs.writeFileSync(ra, JSON.stringify(bak));
const kb = Math.round(fs.statSync(ra).size / 1024);
console.log(`Đã xuất ${bak.soDoc} document từ ${duAn} → ${ra} (${kb} KB, ${Math.round((Date.now() - t0) / 1000)}s)`);
for (const [ten, docs] of Object.entries(bak.boSuuTap)) console.log(`  ${ten}: ${Object.keys(docs).length}`);
if (!bak.soDoc) { console.error('Không có document nào — kiểm tra lại service account / dự án.'); process.exit(1); }
