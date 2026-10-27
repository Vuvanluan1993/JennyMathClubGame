# P-10 Sao lưu hàng tuần

**Mục tiêu:** có bản sao dữ liệu máy chủ mỗi tuần, mã hoá, nằm ngoài Firebase/Supabase; đã thử khôi phục một lần.
**Ước lượng:** 5 giờ. **Người dùng thấy gì:** không. **Cần trước:** không (chạy được với Firebase ngay; thêm nhánh Supabase khi P-12 xong).

## File sửa
- Mới: `.github/workflows/sao-luu.yml` — `schedule: cron '0 20 * * 0'` (3h sáng thứ Hai giờ VN) + `workflow_dispatch`; `permissions: contents: read`; dùng secret `FIREBASE_SA_JSON` (service account chỉ quyền đọc Firestore) và `BACKUP_PUBKEY` (age).
- Mới: `tools/sao-luu/firestore-dump.mjs` (Admin SDK, đọc mọi collection → `backup-YYYY-MM-DD.json`), `tools/sao-luu/README.md` (cách khôi phục bằng `firestore-restore.mjs`), `tools/sao-luu/firestore-restore.mjs`.
- Mã hoá bằng `age` (`FiloSottile/age`), đẩy file `.age` lên kho **riêng tư** `Vuvanluan1993/jenny-backup` qua `gh release upload` (secret `BACKUP_REPO_TOKEN`, quyền chỉ kho đó) — giữ 12 bản gần nhất.

## Việc thầy làm (E)
- Tạo kho riêng tư `jenny-backup`; tạo service account đọc Firestore; tạo khoá `age` (giữ khoá riêng ngoài GitHub); dán 3 secret.

## Việc phải xong (DONE)
1. Chạy `workflow_dispatch` → file `.age` xuất hiện ở release kho riêng tư; giải mã trên máy thầy ra JSON đọc được.
2. Khôi phục vào project Firebase **thử** (emulator) bằng `firestore-restore.mjs`, số document bằng bản gốc.
3. README ghi 5 bước khôi phục; `CLAUDE.md` gốc ghi nơi sao lưu.

## Bẫy
- Spark không có xuất quản lý (`gcloud firestore export` cần Blaze): phải dùng Admin SDK như trên.
- Service account là bí mật thật: chỉ ở GitHub Secrets, không bao giờ vào kho.
- Khi chuyển Supabase (P-13): thêm `pg_dump` qua `SUPABASE_DB_URL`, cùng workflow.
