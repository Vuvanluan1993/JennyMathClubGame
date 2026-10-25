#!/usr/bin/env node
// Khôi phục file sao lưu (JSON đã giải mã) vào Firestore. Mặc định chỉ cho ghi vào EMULATOR hoặc dự án thử;
// ghi vào dự án thật phải thêm --that (và service account có quyền ghi).
//   node tools/sao-luu/firestore-restore.mjs backup-2026-10-26.json [--chi-dem] [--that]
//   Emulator: FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 GCLOUD_PROJECT=demo-jenny node … backup.json
//   Dự án thật: FIREBASE_SA_JSON='{…}' node … backup.json --that
import fs from 'node:fs';
import { demDoc, napVao } from './_chung.mjs';

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
if (!file) { console.error('Cách dùng: node firestore-restore.mjs <backup.json> [--chi-dem] [--that]'); process.exit(2); }
const bak = JSON.parse(fs.readFileSync(file, 'utf8'));
const tong = demDoc(bak.boSuuTap);
console.log(`File ${file}: dự án ${bak.duAn}, lúc ${bak.luc}, ${tong} document`);
for (const [ten, docs] of Object.entries(bak.boSuuTap || {})) console.log(`  ${ten}: ${Object.keys(docs).length}`);
if (args.includes('--chi-dem')) process.exit(0);

const admin = (await import('firebase-admin')).default;
let duAn;
if (process.env.FIRESTORE_EMULATOR_HOST) {
  duAn = process.env.GCLOUD_PROJECT || 'demo-jenny';
  admin.initializeApp({ projectId: duAn });
  console.log(`Ghi vào EMULATOR ${process.env.FIRESTORE_EMULATOR_HOST} (dự án ${duAn})`);
} else {
  if (!process.env.FIREBASE_SA_JSON) { console.error('Thiếu FIREBASE_SA_JSON (hoặc đặt FIRESTORE_EMULATOR_HOST để ghi vào emulator).'); process.exit(2); }
  const sa = JSON.parse(process.env.FIREBASE_SA_JSON);
  duAn = sa.project_id;
  if (!args.includes('--that')) { console.error(`Sắp ghi đè dự án THẬT ${duAn}. Chắc chắn thì thêm --that.`); process.exit(3); }
  admin.initializeApp({ credential: admin.credential.cert(sa), projectId: duAn });
  console.log(`Ghi vào dự án thật ${duAn}`);
}
const db = admin.firestore();
const { Timestamp, GeoPoint } = admin.firestore;
const n = await napVao(db, bak, { Timestamp, GeoPoint, db }, m => console.log('  ' + m));
console.log(`Đã ghi ${n}/${tong} document.`);
process.exit(n === tong ? 0 : 1);
