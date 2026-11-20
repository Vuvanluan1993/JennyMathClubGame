#!/usr/bin/env python3
"""Sinh design/tokens.css từ design/tokens.json (nguồn duy nhất của màu/chữ/khoảng cách).

  python3 tools/tokens.py           → ghi design/tokens.css
  python3 tools/tokens.py --check   → chỉ so sánh; thoát 1 nếu tokens.css khác bản sinh ra

Kết quả sinh ra không có dấu thời gian nên chạy lại cho cùng nội dung (git diff trống).
Giá trị dạng "{nhom.ten}" là tham chiếu sang token khác → sinh thành var(--jc-…).
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'design', 'tokens.json')
OUT = os.path.join(ROOT, 'design', 'tokens.css')


def css_name(prefix, group, name, flat):
    """Tên biến CSS: --jc-<nhom>-<ten>; nhóm 'flat' (màu logo) bỏ tên nhóm: --jc-<ten>."""
    return f'--{prefix}-{name}' if flat else f'--{prefix}-{group}-{name}'


def build_index(data):
    """{ 'nhom.ten': tên biến CSS } để giải tham chiếu."""
    idx = {}
    for g, grp in data['groups'].items():
        flat = grp.get('flat', False)
        for n in grp['tokens']:
            idx[f'{g}.{n}'] = css_name(data['prefix'], g, n, flat)
    return idx


def resolve(value, idx):
    """'{logo.navy}' → 'var(--jc-navy)'; chuỗi khác giữ nguyên."""
    out, i = [], 0
    while i < len(value):
        if value[i] == '{':
            j = value.index('}', i)
            ref = value[i + 1:j]
            if ref not in idx:
                raise SystemExit(f'tokens.json: tham chiếu không có: {ref}')
            out.append(f'var({idx[ref]})')
            i = j + 1
        else:
            out.append(value[i]); i += 1
    return ''.join(out)


def token_value(tok):
    return tok['value'] if isinstance(tok, dict) else tok


def render(data):
    idx = build_index(data)
    L = []
    L.append('/* SINH TỰ ĐỘNG từ design/tokens.json bằng tools/tokens.py — KHÔNG SỬA TAY. */')
    L.append(f"/* {data.get('description', '')} */")
    L.append(':root{')
    for g, grp in data['groups'].items():
        flat = grp.get('flat', False)
        L.append(f"  /* {g}: {grp.get('description', '')} */")
        for n, tok in grp['tokens'].items():
            L.append(f"  {css_name(data['prefix'], g, n, flat)}:{resolve(token_value(tok), idx)};")
    L.append('}')
    for sel, theme in data.get('themes', {}).items():
        L.append(f"/* {theme.get('description', '')} */")
        parts = ';'.join(f'{k}:{resolve(v, idx)}' for k, v in theme['set'].items())
        L.append(f'{sel}{{{parts}}}')
    return '\n'.join(L) + '\n'


def main(argv):
    with open(SRC, encoding='utf-8') as f:
        data = json.load(f)
    css = render(data)
    if '--check' in argv:
        cur = open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
        if cur != css:
            print('design/tokens.css KHÁC bản sinh từ tokens.json → chạy python3 tools/tokens.py')
            return 1
        print('design/tokens.css khớp tokens.json')
        return 0
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(css)
    n = sum(len(g['tokens']) for g in data['groups'].values())
    print(f'design/tokens.css: {n} token, {len(css.encode())} bytes')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
