#!/usr/bin/env python3
"""Tạo file tiếng (mp3) cho app Jenny.

Hai nguồn giọng (tự chọn theo khóa có sẵn):
- GEMINI_API_KEY  → Gemini TTS (Google AI Studio, gói miễn phí, không cần thẻ). Giọng Despina.
- GOOGLE_TTS_KEY  → Google Cloud Text-to-Speech, Chirp 3 HD (cần bật thanh toán). vi-VN-Chirp3-HD-Despina.

Cách dùng:
  GEMINI_API_KEY=... python3 tools/giong/tao-giong.py <danh-sach.json> <thu-muc-ra>

danh-sach.json: [{"id": "ten-file", "text": "lời đọc"}, ...]
- Mỗi lời thành <thu-muc-ra>/<id>.mp3.
- Lưu đệm: mã của lời đọc ghi ở <thu-muc-ra>/_ma.json; lời không đổi thì bỏ qua.
- Gói miễn phí giới hạn lượt: gặp lỗi 429 thì chờ rồi thử lại; hết lượt trong ngày thì dừng,
  lưu phần đã thu, lần chạy sau làm tiếp.
"""
import base64, hashlib, json, os, subprocess, sys, time, urllib.error, urllib.request

KHOA_GEMINI = os.environ.get("GEMINI_API_KEY", "").strip()
KHOA_CLOUD = os.environ.get("GOOGLE_TTS_KEY", "").strip()
NGUON = "gemini" if KHOA_GEMINI else "cloud"
GIONG = os.environ.get("GIONG") or ("Despina" if NGUON == "gemini" else "vi-VN-Chirp3-HD-Despina")
MO_HINH = [m for m in os.environ.get("MO_HINH", "").split(",") if m] or [
    "gemini-2.5-flash-preview-tts", "gemini-2.5-flash-tts", "gemini-2.5-pro-preview-tts"]
LOI_DAN = os.environ.get("LOI_DAN", "")  # vd "Đọc chậm, rõ, vui tươi: " (để trống = đọc nguyên văn)


def ma(text):
    return hashlib.sha1((NGUON + GIONG + LOI_DAN + "|" + text).encode("utf-8")).hexdigest()[:16]


def goi(url, body):
    req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"),
                                 headers={"Content-Type": "application/json"})
    for lan in range(6):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            noi_dung = e.read().decode("utf-8", "ignore")
            if e.code == 429 or e.code >= 500:
                if "per day" in noi_dung.lower() or "PerDay" in noi_dung:
                    raise SystemExit("HET_LUOT_NGAY")
                cho = 20 * (lan + 1)
                print(f"  bận ({e.code}), chờ {cho}s…")
                time.sleep(cho)
                continue
            raise RuntimeError(f"Lỗi {e.code}: {noi_dung[:300]}")
    raise RuntimeError("Thử lại nhiều lần vẫn lỗi.")


def pcm_sang_mp3(pcm, f):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1",
                    "-i", "pipe:0", "-b:a", "48k", f], input=pcm, check=True)


MO_HINH_DUNG = None


def doc_gemini(text, f):
    global MO_HINH_DUNG
    body = {"contents": [{"parts": [{"text": LOI_DAN + text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": GIONG}}}}}
    for m in ([MO_HINH_DUNG] if MO_HINH_DUNG else MO_HINH):
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={KHOA_GEMINI}"
        try:
            kq = goi(url, body)
        except RuntimeError as e:
            if "404" in str(e) or "not found" in str(e).lower():
                continue
            raise
        MO_HINH_DUNG = m
        pcm = base64.b64decode(kq["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
        pcm_sang_mp3(pcm, f)
        return
    raise RuntimeError("Không tìm thấy mô hình Gemini TTS nào trong: " + ", ".join(MO_HINH))


def doc_cloud(text, f):
    body = {"input": {"text": text}, "voice": {"languageCode": GIONG[:5], "name": GIONG},
            "audioConfig": {"audioEncoding": "MP3"}}
    kq = goi("https://texttospeech.googleapis.com/v1/text:synthesize?key=" + KHOA_CLOUD, body)
    open(f, "wb").write(base64.b64decode(kq["audioContent"]))


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    if not (KHOA_GEMINI or KHOA_CLOUD):
        sys.exit("Thiếu khóa: đặt GEMINI_API_KEY hoặc GOOGLE_TTS_KEY.")
    ds = json.load(open(sys.argv[1], encoding="utf-8"))
    ra = sys.argv[2]
    os.makedirs(ra, exist_ok=True)
    p_ma = os.path.join(ra, "_ma.json")
    cu = json.load(open(p_ma, encoding="utf-8")) if os.path.exists(p_ma) else {}
    moi = bo_qua = ky_tu = 0
    het_luot = False
    try:
        for c in ds:
            f = os.path.join(ra, c["id"] + ".mp3")
            m = ma(c["text"])
            if cu.get(c["id"]) == m and os.path.exists(f):
                bo_qua += 1
                continue
            (doc_gemini if NGUON == "gemini" else doc_cloud)(c["text"], f)
            cu[c["id"]] = m
            moi += 1
            ky_tu += len(c["text"])
            print("thu:", c["id"])
            if NGUON == "gemini":
                time.sleep(7)  # gói miễn phí: giới hạn lượt mỗi phút
    except SystemExit as e:
        if str(e) != "HET_LUOT_NGAY":
            raise
        het_luot = True
    finally:
        json.dump(cu, open(p_ma, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"Xong: thu mới {moi}, giữ nguyên {bo_qua}, {ky_tu} ký tự. Nguồn {NGUON}"
          f"{' · ' + MO_HINH_DUNG if MO_HINH_DUNG else ''} · giọng {GIONG}.")
    if het_luot:
        print("Hết lượt miễn phí hôm nay — phần đã thu được lưu, ngày mai chạy lại để làm tiếp.")


if __name__ == "__main__":
    main()
