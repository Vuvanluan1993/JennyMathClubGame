# P-01 Node + CI kiểm tra

**Mục tiêu:** mọi PR chạy đủ 7 kiểm tra của `LUAT-DA-CHOT.md §7` trên GitHub Actions; máy thầy chạy `npm test` một lệnh.
**Ước lượng:** 5 giờ. **Người dùng thấy gì:** không (nền). **Cần trước:** không.

## File sửa
- Mới: `package.json` (gốc), `.github/workflows/ci.yml`, `tools/test/chay-tat-ca.mjs` (chạy mọi file trong `src/lop-hoc-ao/tools/test/*.js`, gom mã lỗi, ghi `.ci/rc.txt`).
  ⟳ 25/10: `chay-tat-ca.mjs` **cũng** chạy mọi `tools/test/*.mjs` theo tên file (glob), không danh sách cứng — để P-17 chỉ thêm file mới.
- Sửa: `src/lop-hoc-ao/tools/test/kiem-tra.js:9` và các file test khác có đường dẫn cứng `/opt/pw-browsers` → đọc `process.env.PW_DIR`, mặc định đường dẫn Playwright chuẩn.
- Sửa: `CLAUDE.md` gốc mục "Công cụ trên máy Mac" (ghi `brew install node`, `npm ci`, `npx playwright install chromium`, `npm test`).

## Việc phải xong (DONE)
1. `npm ci && npm test` chạy xanh trên máy có Node (kết quả ghi `.ci/rc.txt` = 0).
2. `ci.yml` chạy trên `pull_request` và `push` vào `main`: cài Node 22, Playwright Chromium, `python3 tools/build.py`, `npm test`; kết quả hiện ở PR.
3. Script test không còn đường dẫn cứng; chạy được trên Mac và Ubuntu.
4. `CLAUDE.md` ghi cách cài; `.gitignore` thêm `.ci/`, `node_modules/`.

## Cách kiểm tra
- Mở PR thử, CI xanh; cố ý làm hỏng một câu trong `js/content/hk1/24-*.js` → CI đỏ đúng chỗ.

## Bẫy
- `kiem-tra.js` mở `dist/lop-hoc-ao-jenny.html` nên CI phải build trước khi test.
- Không commit `games/lop-hoc-ao/**/index.html` do build sinh ra (quy tắc 4 `CLAUDE.md`).
- Thư mục chung với P-17 là `tools/test/`: P-17 chỉ **thêm file mới**, không sửa `chay-tat-ca.mjs`.
