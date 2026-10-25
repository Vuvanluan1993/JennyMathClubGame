# Tải font woff2 (subset latin + latin-ext + vietnamese, đúng thứ tự Google đưa) từ Google Fonts CSS API và sinh assets/fonts/fonts.css.
# python3 -I assets/fonts/tai-font.py            (ghi đè assets/fonts/*.woff2 + fonts.css)
import sys, re, os, urllib.request
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__)); os.makedirs(OUT, exist_ok=True)
FAM = ['Baloo+2:wght@600;700;800', 'Nunito:wght@500;700;800;900', 'VT323', 'Be+Vietnam+Pro:wght@400;500;600;700', 'Lexend:wght@400;500;600;700']
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()
css = get('https://fonts.googleapis.com/css2?' + '&'.join('family=' + f for f in FAM) + '&display=swap').decode()
out = ['/* Chữ tự host cho mọi trang (P-08). Sinh bằng tools… xem docs/SRI.md. Subset latin + vietnamese từ Google Fonts; font-display: swap. */']
n = 0; tong = 0
for m in re.finditer(r'/\* ([\w-]+) \*/\s*@font-face \{(.*?)\}', css, re.S):
    subset, body = m.group(1), m.group(2)
    if subset not in ('latin', 'latin-ext', 'vietnamese'): continue  # cả 3 subset như Google đưa: chữ đ, ă, ơ, ư (U+0100–02BA) lấy từ latin-ext, giữ đúng khoảng cách chữ như trước
    fam = re.search(r"font-family: '([^']+)'", body).group(1); wt = re.search(r'font-weight: (\d+)', body).group(1)
    url = re.search(r'url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)', body).group(1)
    ur = re.search(r'unicode-range: ([^;]+);', body).group(1)
    fn = f"{fam.lower().replace(' ', '-')}-{wt}-{subset}.woff2"
    data = get(url); open(os.path.join(OUT, fn), 'wb').write(data); n += 1; tong += len(data)
    out.append(f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{wt};font-display:swap;src:url({fn}) format('woff2');unicode-range:{ur}}}")
open(os.path.join(OUT, 'fonts.css'), 'w').write('\n'.join(out) + '\n')
print(f'{n} file, {tong/1024:.0f} KB → {OUT}/fonts.css')
