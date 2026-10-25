# Sao lưu tuần Firestore (P-10)

Gói Firebase **Spark** không có `gcloud firestore export`, nên mỗi tuần GitHub Actions (`.github/workflows/sao-luu.yml`,
Chủ nhật 20:00 UTC = 3:00 sáng thứ Hai giờ VN, hoặc bấm **Run workflow**) đọc toàn bộ Firestore bằng Admin SDK,
ghi `backup-YYYY-MM-DD.json`, mã hoá bằng **age**, rồi đưa lên release của kho **riêng tư** `Vuvanluan1993/jenny-backup`.
Chỉ giữ 12 bản gần nhất. Service account và khoá riêng **không bao giờ** nằm trong kho này.

File:
- `firestore-dump.mjs` — xuất mọi bộ sưu tập (`org`, `users`, `login`, `hs`, `hsgv`, `asg`… kể cả bộ sưu tập con) → JSON.
- `firestore-restore.mjs` — nạp JSON vào emulator hoặc dự án thật (`--that`).
- `_chung.mjs` — mã hoá/giải mã giá trị Firestore (Timestamp, Bytes, GeoPoint, tham chiếu), xuất, nạp theo lô 400.
- `thu-gia-lap.mjs` — thử vòng xuất → nạp bằng Firestore giả lập trong bộ nhớ (không cần Java/emulator): `node tools/sao-luu/thu-gia-lap.mjs`.
- `package.json` — chỉ `firebase-admin`; trên máy: `npm ci --prefix tools/sao-luu`.

## Thầy làm một lần (E)
1. Tạo kho **riêng tư** `Vuvanluan1993/jenny-backup` (trống, có README là đủ).
2. Firebase Console › ⚙ › Project settings › Service accounts › **Manage service account permissions** (Google Cloud IAM):
   tạo service account `sao-luu@jenny-lop-hoc-ao.iam.gserviceaccount.com`, vai **Cloud Datastore Viewer** (`roles/datastore.viewer`, chỉ đọc);
   Keys › Add key › JSON → tải file. Dán **nguyên nội dung file** vào secret `FIREBASE_SA_JSON`. Xoá file trên máy sau khi dán.
3. Cài age trên máy (`brew install age`), tạo khoá: `age-keygen -o ~/jenny-backup-khoa-rieng.txt`. Dòng `# public key: age1…` → secret `BACKUP_PUBKEY`.
   File khoá riêng giữ ở máy thầy + 1 bản in/USB cất kỹ; **mất khoá riêng = không giải mã được bản sao lưu**.
4. GitHub › Settings › Developer settings › Fine-grained token: chỉ kho `jenny-backup`, quyền **Contents: Read and write** → secret `BACKUP_REPO_TOKEN`.
5. Kho này › Settings › Secrets and variables › Actions: dán 3 secret. Actions › "Sao lưu tuần (Firestore)" › **Run workflow**.
   Xong: kho `jenny-backup` › Releases có `sao-luu-YYYY-MM-DD` chứa `backup-YYYY-MM-DD.json.age`.

## Khôi phục (5 bước)
1. **Tải** file: `gh release download sao-luu-2026-11-02 --repo Vuvanluan1993/jenny-backup -D ~/khoi-phuc` (hoặc tải tay ở trang Releases).
2. **Giải mã** bằng khoá riêng: `age -d -i ~/jenny-backup-khoa-rieng.txt -o ~/khoi-phuc/backup.json ~/khoi-phuc/backup-2026-11-02.json.age`.
3. **Xem trước**, không ghi gì: `node tools/sao-luu/firestore-restore.mjs ~/khoi-phuc/backup.json --chi-dem` (in số document từng bộ sưu tập).
4. **Thử trên emulator** (cần Java 11+ và `npm i -g firebase-tools`): một cửa sổ `firebase emulators:start --only firestore --project demo-jenny`;
   cửa sổ khác `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 GCLOUD_PROJECT=demo-jenny node tools/sao-luu/firestore-restore.mjs ~/khoi-phuc/backup.json`.
   Mở http://127.0.0.1:4000 xem dữ liệu; số document in ra phải bằng dòng "… document" ở bước 3.
5. **Ghi vào dự án thật** (chỉ khi dữ liệu thật đã hỏng; ghi đè từng document, không xoá document thừa): tạo service account có quyền ghi
   (`roles/datastore.user`), rồi `FIREBASE_SA_JSON="$(cat sa-ghi.json)" node tools/sao-luu/firestore-restore.mjs ~/khoi-phuc/backup.json --that`.
   Xong thì xoá key của service account ghi. Nếu Firebase Authentication cũng mất tài khoản, quản lý tạo lại tài khoản (mật khẩu mới);
   dữ liệu học gắn theo tên đăng nhập (`hs/{tk}`) nên vẫn khớp.

## Đã thử và chưa thử (25/10/2026)
- Đã thử: vòng xuất → nạp trên Firestore **giả lập** (`thu-gia-lap.mjs`): 11 document kể cả bộ sưu tập con và document "thiếu",
  Timestamp/Bytes/GeoPoint/tham chiếu giữ nguyên, 1000 document → 3 lô commit. Script báo lỗi rõ khi thiếu secret.
- **Chưa thử** trên Firestore emulator (máy thầy chưa có Java) và chưa chạy workflow thật (chưa có kho `jenny-backup`, service account, 3 secret).
  Sau khi thầy làm mục E: bấm Run workflow, tải về, giải mã (bước 1–3) là xong DONE 1; DONE 2 cần Java (`brew install openjdk`).
- Khi chuyển Supabase (P-13): thêm bước `pg_dump` qua secret `SUPABASE_DB_URL` vào cùng workflow.
