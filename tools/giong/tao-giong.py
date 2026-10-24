#!/usr/bin/env python3
"""Tạo file tiếng (mp3) bằng Google Cloud Text-to-Speech.

Giọng đã chốt: Chirp 3 HD · Tiếng Việt · Despina (vi-VN-Chirp3-HD-Despina).

Cách dùng:
  GOOGLE_TTS_KEY=... python3 tools/giong/tao-giong.py <danh-sach.json> <thu-muc-ra>

danh-sach.json: [{"id": "ten-file", "text": "lời đọc"}, ...]
- Mỗi lời thành <thu-muc-ra>/<id>.mp3.
- Có lưu đệm: ghi mã của lời đọc vào <thu-muc-ra>/_ma.json; lời không đổi thì bỏ qua,
  sửa lời thì thu lại đúng câu đó (không tốn ký tự thừa).
"""
import base64, hashlib, json, os, sys, urllib.request

GIONG = os.environ.get("GIONG", "vi-VN-Chirp3-HD-Despina")
NGON_NGU = GIONG[:5]
KHOA = os.environ.get("GOOGLE_TTS_KEY", "").strip()
URL = "https://texttospeech.googleapis.com/v1/text:synthesize?key="


def ma(text):
    return hashlib.sha1((GIONG + "|" + text).encode("utf-8")).hexdigest()[:16]


def doc(text):
    body = {
        "input": {"text": text},
        "voice": {"languageCode": NGON_NGU, "name": GIONG},
        "audioConfig": {"audioEncoding": "MP3"},
    }
    req = urllib.request.Request(URL + KHOA, data=json.dumps(body).encode("utf-8"),
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return base64.b64decode(json.load(r)["audioContent"])


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    if not KHOA:
        sys.exit("Thiếu GOOGLE_TTS_KEY (khóa API Google Cloud).")
    ds = json.load(open(sys.argv[1], encoding="utf-8"))
    ra = sys.argv[2]
    os.makedirs(ra, exist_ok=True)
    p_ma = os.path.join(ra, "_ma.json")
    cu = json.load(open(p_ma, encoding="utf-8")) if os.path.exists(p_ma) else {}
    moi, bo_qua, ky_tu = 0, 0, 0
    for c in ds:
        f = os.path.join(ra, c["id"] + ".mp3")
        m = ma(c["text"])
        if cu.get(c["id"]) == m and os.path.exists(f):
            bo_qua += 1
            continue
        open(f, "wb").write(doc(c["text"]))
        cu[c["id"]] = m
        moi += 1
        ky_tu += len(c["text"])
        print("thu:", c["id"])
    json.dump(cu, open(p_ma, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"Xong: thu mới {moi}, giữ nguyên {bo_qua}, dùng {ky_tu} ký tự. Giọng {GIONG}.")


if __name__ == "__main__":
    main()
