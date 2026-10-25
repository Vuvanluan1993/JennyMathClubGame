#!/usr/bin/env python3
"""Dựng mọi bản sinh ra của kho — một lệnh, dùng cho máy thầy và GitHub Actions (deploy.yml).

    python3 tools/build_all.py

Chạy theo thứ tự tên file, không danh sách cứng (thêm game mới chỉ cần thêm file tools/build_<ten>.py):
  1. src/lop-hoc-ao/tools/build.py          → src/lop-hoc-ao/dist/ + games/lop-hoc-ao/**/index.html
  2. mọi tools/build_*.py chạy được không cần tham số (bỏ qua file dùng sys.argv:
     build_bank*.py cần file nguồn + MÃ CLB, thầy chạy tay, kết quả bank.enc đã nằm trong git).
Thoát mã 1 nếu một bước lỗi.
"""
import glob, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ME = os.path.abspath(__file__)

def can_tham_so(path):
    with open(path, encoding='utf-8') as f:
        return 'sys.argv' in f.read()

def chay(label, path):
    print(f'\n▶ {label}', flush=True)
    r = subprocess.run([sys.executable, path], cwd=ROOT)
    if r.returncode:
        print(f'✗ {label} thoát mã {r.returncode}', file=sys.stderr)
    return r.returncode

def main():
    steps = [('src/lop-hoc-ao/tools/build.py', os.path.join(ROOT, 'src', 'lop-hoc-ao', 'tools', 'build.py'))]
    for p in sorted(glob.glob(os.path.join(ROOT, 'tools', 'build_*.py'))):
        if os.path.abspath(p) == ME:
            continue
        rel = os.path.relpath(p, ROOT)
        if can_tham_so(p):
            print(f'· bỏ qua {rel} (cần tham số, chạy tay)')
            continue
        steps.append((rel, p))
    loi = [label for label, p in steps if chay(label, p)]
    print('\n' + ('✗ LỖI: ' + ', '.join(loi) if loi else f'✓ Dựng xong {len(steps)} bước'))
    sys.exit(1 if loi else 0)

if __name__ == '__main__':
    main()
