#!/usr/bin/env python3
"""Đo tương phản (WCAG 2.1) các cặp chữ/nền ghi trong design/tokens.json → mục "contrast".

  python3 tools/check_contrast.py            → in bảng; liệt kê cặp dưới ngưỡng (thoát 0)
  python3 tools/check_contrast.py --strict   → thoát 1 nếu có cặp dưới ngưỡng

Ngưỡng: 'normal' (chữ thường) ≥ 4.5, 'large' (chữ lớn ≥ 18px/14px đậm, nút) ≥ 3.0.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'design', 'tokens.json')


def value_of(data, ref, depth=0):
    """'app.ink' → '#13263a' (theo tham chiếu đến tận gốc); '#abc' giữ nguyên."""
    if ref.startswith('#'):
        return ref
    assert depth < 10, f'tham chiếu vòng: {ref}'
    g, n = ref.split('.', 1)
    tok = data['groups'][g]['tokens'][n]
    v = tok['value'] if isinstance(tok, dict) else tok
    if v.startswith('{') and v.endswith('}'):
        return value_of(data, v[1:-1], depth + 1)
    return v


def hex_to_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    if len(h) != 6:
        raise ValueError(f'không phải màu hex đặc: #{h}')
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def luminance(rgb):
    def ch(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg, bg):
    l1, l2 = luminance(hex_to_rgb(fg)), luminance(hex_to_rgb(bg))
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def main(argv):
    with open(SRC, encoding='utf-8') as f:
        data = json.load(f)
    c = data['contrast']
    th = {'normal': c.get('normal', 4.5), 'large': c.get('large', 3.0)}
    fails = []
    print(f"{'kết quả':7} {'tỉ lệ':>6} {'ngưỡng':>6}  {'chữ':10} {'nền':12}  {'chữ/nền (token)':34} chỗ dùng")
    for p in c['pairs']:
        fg, bg = value_of(data, p['fg']), value_of(data, p['bg'])
        r = ratio(fg, bg)
        need = th[p.get('kind', 'normal')]
        ok = r >= need
        if not ok:
            fails.append((p, r, need))
        print(f"{'OK' if ok else 'THIẾU':7} {r:6.2f} {need:6.1f}  {fg:10} {bg:12}  {p['fg'] + ' / ' + p['bg']:34} {p.get('where', '')}")
    print()
    if fails:
        print(f'{len(fails)} cặp dưới ngưỡng (cần thầy quyết: đổi màu hay chấp nhận):')
        for p, r, need in fails:
            print(f"  - {p['fg']} trên {p['bg']}: {r:.2f} < {need}  ({p.get('where', '')})")
    else:
        print('0 cặp dưới ngưỡng.')
    return 1 if (fails and '--strict' in argv) else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
