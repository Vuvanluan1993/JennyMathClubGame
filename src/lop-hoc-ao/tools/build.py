#!/usr/bin/env python3
"""Dựng Lớp học ảo — từ P-14a (25/10/2026) bằng Vite; lệnh cũ giữ lại cho tài liệu và tools/build_all.py.
  python3 tools/build.py   = npm run build:lop-hoc-ao (= vite build src/lop-hoc-ao, cấu hình ở src/lop-hoc-ao/vite.config.js)
    → dist/lop-hoc-ao-jenny.html           bản đầy đủ một file (bộ kiểm tra §7, Artifact)
    → dist/index.html, giao-vien/, phu-huynh/, quan-ly/, demo.html + dist/assets/*-[hash].js|css
    → chép 4 trang + assets sang games/lop-hoc-ao/ (GitHub Pages)
Chưa có node_modules (vd. máy mới, workflow deploy) thì tự chạy `npm ci` trước. Cần Node ≥ 20.19 và npm.
Trang theo vai: tools/vite/vai.js (thay _student.py, _teacher.py; so từng byte: node tools/vite/so-voi-python.mjs).
Dự án Firebase (P-21, 27/10/2026): biến môi trường FB_ENV=that (mặc định, dự án thật) | thu (dự án thử, có dải "Bản thử");
khối cấu hình ở firebase/cau-hinh.json, vai.js thay vào 62-may-chu.js lúc dựng. Ví dụ: FB_ENV=thu python3 tools/build.py
"""
import os,shutil,subprocess,sys
KHO=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','..'))
def chay(*lenh):
    r=subprocess.run(lenh,cwd=KHO)
    if r.returncode:sys.exit(r.returncode)
def main():
    npm=shutil.which('npm')
    if not npm:sys.exit('Chưa có npm (Node ≥ 20.19). Máy thầy: export PATH=$HOME/.local/node/bin:$PATH')
    if not os.path.exists(os.path.join(KHO,'node_modules','vite','package.json')):chay(npm,'ci')
    env=os.environ.get('FB_ENV','that')
    if env not in('that','thu'):sys.exit(f'FB_ENV={env} không hợp lệ (that | thu)')
    print(f'FB_ENV={env} → dự án Firebase {"THỬ jenny-lop-hoc-ao-thu (dải Bản thử)" if env=="thu" else "THẬT jenny-lop-hoc-ao"} (firebase/cau-hinh.json)',flush=True)
    chay(npm,'run','build:lop-hoc-ao')
if __name__=='__main__':main()
