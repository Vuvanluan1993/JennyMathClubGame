"""Tạo kho bài cho "Hành trình của Jenny – Tiểu học" từ file JSON bài Kangaroo đã dịch và vẽ lại hình.

    python tools/build_bank_th.py <kangaroo_tieu_hoc.json> games/hanh-trinh-jenny/tieu-hoc/bank.enc <MÃ CLB>

Mỗi bài trong file nguồn: id, g ("12"/"34"), d (0/1/2), q, fig (SVG), kind ("num"/"pick"), a, opts, ans, s, src.
Kho được mã hoá bằng mã CLB giống bản Lớp 6.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from build_bank import ITER
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes


def main(src, out, code):
    items = []
    for x in json.load(open(src, encoding="utf-8")):
        it = {"i": x["id"], "g": x["g"], "d": int(x["d"]), "q": x["q"].strip(), "f": x.get("fig") or "", "k": x["kind"], "s": x["s"].strip()}
        if x["kind"] == "num":
            it["a"] = int(x["a"])
        else:
            assert len(x["opts"]) == 3 and 0 <= x["ans"] <= 2, x["id"]
            it["o"], it["n"] = x["opts"], int(x["ans"])
        items.append(it)
    data = json.dumps(items, ensure_ascii=False, separators=(",", ":")).encode()
    salt, iv = os.urandom(16), os.urandom(12)
    key = PBKDF2HMAC(hashes.SHA256(), 32, salt, ITER).derive(code.strip().upper().encode())
    b = lambda v: base64.b64encode(v).decode()
    json.dump({"v": 1, "iter": ITER, "salt": b(salt), "iv": b(iv), "data": b(AESGCM(key).encrypt(iv, data, None)), "n": len(items)}, open(out, "w"))
    print(len(items), "bài ->", out, os.path.getsize(out), "bytes")


if __name__ == "__main__":
    main(*sys.argv[1:4])
