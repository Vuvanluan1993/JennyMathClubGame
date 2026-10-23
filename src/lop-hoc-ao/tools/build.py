#!/usr/bin/env python3
"""Ghép mã nguồn thành ứng dụng.
  python3 tools/build.py          → dist/lop-hoc-ao-jenny.html (bản đầy đủ: học sinh, giáo viên, phụ huynh, demo)
                                    + games/lop-hoc-ao/index.html (bản học sinh có đăng nhập, đưa lên GitHub Pages)
"""
import os,re,runpy
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INC=re.compile(r'/\*@include ([^*]+?)\*/')
def expand(text,depth=0):
    assert depth<5,'include lồng quá sâu'
    return INC.sub(lambda m:expand(open(os.path.join(ROOT,m.group(1).strip()),encoding='utf-8').read().removesuffix('\n'),depth+1),text)
def main():
    src=open(os.path.join(ROOT,'app.template.html'),encoding='utf-8').read()
    out=expand(src)
    import datetime
    ver=(datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7)))).strftime('%d/%m · %H:%M')
    out=out.replace('__APP_VER__',ver)
    os.makedirs(os.path.join(ROOT,'dist'),exist_ok=True)
    open(os.path.join(ROOT,'dist','lop-hoc-ao-jenny.html'),'w',encoding='utf-8').write(out)
    print('dist/lop-hoc-ao-jenny.html',len(out.encode()),'bytes')
    runpy.run_path(os.path.join(ROOT,'tools','_student.py'),run_name='__main__')
    print('games/lop-hoc-ao/index.html đã cập nhật')
    runpy.run_path(os.path.join(ROOT,'tools','_teacher.py'),run_name='__main__')
if __name__=='__main__':main()
