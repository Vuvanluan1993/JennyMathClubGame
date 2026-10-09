"""Tạo kho bài cho "Hành trình của Jenny" từ file _pool_*.json (bài MATHCOUNTS đã dịch).

Kho được MÃ HOÁ bằng mã CLB, nên đăng lên GitHub vẫn không ai đọc được đề nếu không có mã.

    python tools/build_bank.py <đường dẫn _pool.json> <file ra bank.enc> <MÃ CLB>

Chỉ lấy bài: không cần hình vẽ, đề + lời giải không quá 800 ký tự (vừa 1 màn hình), có đáp số lấy thẳng từ đáp án gốc, không còn ký hiệu LaTeX.
Độ khó (0 Dễ, 1 Vừa, 2 Khó): dùng nhãn độ khó nếu có, nếu không thì ước theo độ dài lời giải.
"""
import base64, json, os, re, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

ITER = 150_000


def clean(s):
    s = re.sub(r"\s*\[\]\s*", " ", s or "")
    s = re.sub(r"\s*\b(WARM-UP|WORKOUT|[A-Z]{3,}(?: [A-Z]{3,})* STRETCH)\s*\d*\s*(\([^)]*\))?\s*$", "", s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def main(src, out, code):
    pool = json.load(open(src, encoding="utf-8"))
    ok = [x for x in pool if not x["fig"] and x["conf"] == "ĐS"
          and "\\" not in x["q"] and "$" not in x["q"] and "\\" not in x["sol"]
          and len(x["q"]) + len(x["sol"]) <= 800]
    lens = sorted(len(x["sol"]) + len(x["q"]) // 2 for x in ok)
    t1, t2 = lens[int(len(lens) * .4)], lens[int(len(lens) * .75)]
    items = []
    for x in ok:
        dk = int(x["dk"]) if str(x["dk"]).isdigit() else 0
        if dk:
            d = 0 if dk <= 2 else 1 if dk <= 4 else 2
        else:
            L = len(x["sol"]) + len(x["q"]) // 2
            d = 0 if L <= t1 else 1 if L <= t2 else 2
        items.append({"i": x["id"], "q": clean(x["q"]), "a": int(x["ans"]), "s": clean(x["sol"]), "d": d, "t": x.get("tag") or ""})
    data = json.dumps(items, ensure_ascii=False, separators=(",", ":")).encode()
    salt, iv = os.urandom(16), os.urandom(12)
    key = PBKDF2HMAC(hashes.SHA256(), 32, salt, ITER).derive(code.strip().upper().encode())
    ct = AESGCM(key).encrypt(iv, data, None)
    b = lambda v: base64.b64encode(v).decode()
    json.dump({"v": 1, "iter": ITER, "salt": b(salt), "iv": b(iv), "data": b(ct), "n": len(items)}, open(out, "w"))
    from collections import Counter
    print(len(items), "bài", Counter(i["d"] for i in items), "->", out, os.path.getsize(out), "bytes")


if __name__ == "__main__":
    main(*sys.argv[1:4])
