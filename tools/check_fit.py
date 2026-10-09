"""Kiểm tra mọi game vừa 1 màn hình (không phải kéo) trên 8 cỡ màn hình.

Cách dùng (cần Python + Playwright):
    pip install playwright && python -m playwright install chromium
    python -m http.server 8765          # chạy ở thư mục gốc repo, để nguyên cửa sổ này
    python tools/check_fit.py           # mở cửa sổ khác và chạy
    python tools/check_fit.py mat-ma    # chỉ kiểm tra game có đường dẫn chứa "mat-ma"

Mỗi dòng ✓ = không phải kéo, không bị cắt. ✗ = cần sửa.
Thêm game mới: thêm một mục vào CASES ở cuối file (đường dẫn + các bước đưa game về trạng thái cần đo).
"""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8765/"
SCREENS = [
    ("Điện thoại nhỏ 360x640", 360, 640), ("Điện thoại 390x700", 390, 700),
    ("Điện thoại ngang 740x360", 740, 360), ("Tablet dọc 768x1000", 768, 1000),
    ("Tablet ngang 1024x700", 1024, 700), ("Laptop 1366x650", 1366, 650),
    ("Máy chiếu 1280x620", 1280, 620), ("Màn lớn 1920x950", 1920, 950),
]

MEASURE = """(sel) => {
  const H = innerHeight, W = innerWidth;
  const doc = Math.max(0, document.documentElement.scrollHeight - H);
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && !e.closest('[hidden]'); };
  let clip = 0;
  document.querySelectorAll(sel).forEach(e => { if (!vis(e)) return; const r = e.getBoundingClientRect();
    if (r.bottom > H + 2 || r.right > W + 2 || r.top < -2 || r.left < -2) clip++; });
  const inner = [];
  document.querySelectorAll('body *').forEach(e => { const cs = getComputedStyle(e);
    if (/(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 4 && vis(e))
      inner.push((e.id || String(e.className).split(' ')[0] || e.tagName) + '+' + (e.scrollHeight - e.clientHeight) + 'px'); });
  const cut = [];
  document.querySelectorAll('.board,.hist,.side,.card,.lock,.note,.play-side,.word-panel,dialog[open],.panel').forEach(e => {
    if (!vis(e)) return;
    if (e.scrollHeight > e.clientHeight + 3 || e.scrollWidth > e.clientWidth + 3) cut.push((e.id || String(e.className).split(' ')[0]) + ' tràn');
  });
  // clue text running into the answer boxes below it
  const ct = document.querySelector('#cText'), sl = document.querySelector('#slots');
  if (document.querySelector('#board.board') && ct && sl && vis(ct) && vis(sl)) { const a = ct.getBoundingClientRect(), b = sl.getBoundingClientRect();
    if (ct.scrollHeight > ct.clientHeight + 2 || a.bottom > b.top + 1) cut.push('đề đè lên ô đáp án'); }
  document.querySelectorAll('.hist .row').forEach(e => { if (e.scrollWidth > e.clientWidth + 2) cut.push('dòng lịch sử bị cắt');
    const ds = e.querySelector('.ds'), fb = e.querySelector('.fb .dot');
    if (ds && fb && fb.getBoundingClientRect().left < ds.getBoundingClientRect().right - 1) cut.push('chấm đè lên số'); });
  return {doc, clip, inner: inner.concat([...new Set(cut)]).slice(0, 4).join(', ')};
}"""


def wait(pg, ms=250):
    pg.wait_for_timeout(ms)


# ---------- steps that bring each game to the state we want to measure ----------
def nothing(pg):
    pass


def oso_play(pg):
    pg.click("#startBtn")


def oso_longest_clue(pg):
    pg.click("#startBtn")
    # pick the clue with the most text
    pg.evaluate("(()=>{let b=entries[0];entries.forEach(e=>{if(e.clue.t.length>b.clue.t.length)b=e});select(b.key,0)})()")


def oso_end_solutions(pg):
    pg.click("#startBtn")
    pg.evaluate("finish(false)")
    wait(pg, 400)
    pg.click("#solBtn")


def mm_seven_turns(pg):
    pg.click(".mode.mid")
    for g in ["0123", "4567", "8901", "2345", "6789", "1357", "2468"]:
        for ch in g:
            pg.keyboard.press(ch)
        pg.keyboard.press("Enter")
        wait(pg, 60)


def mm_end(pg):
    pg.click(".mode.hard")
    for _ in range(10):
        for ch in "1111":
            pg.keyboard.press(ch)
        pg.keyboard.press("Enter")
        wait(pg, 60)
    wait(pg, 1200)


def mg_question(pg):
    pg.click("#choose-btn")
    wait(pg, 3200)
    # show the longest question (text + picture) and re-fit, as the game does
    pg.evaluate("""(()=>{const d=JSON.parse(document.getElementById('game-data').textContent);
      document.getElementById('question-content').innerHTML=d.questions.find(q=>q.id===10).html;
      window.__fitGame&&window.__fitGame()})()""")


OSO = ".cell,.key,.card,.ctext,.slots,.chip,.jenny"
CASES = [
    ("Ô Số 6 · màn mở đầu", "games/o-so-bi-an/lop-6/", nothing, ".panel"),
    ("Ô Số 6 · đang chơi", "games/o-so-bi-an/lop-6/", oso_play, OSO),
    ("Ô Số 6 · đề dài nhất", "games/o-so-bi-an/lop-6/", oso_longest_clue, OSO),
    ("Ô Số 6 · lời giải", "games/o-so-bi-an/lop-6/", oso_end_solutions, ".panel"),
    ("Ô Số 7 · màn mở đầu", "games/o-so-bi-an/lop-7/", nothing, ".panel"),
    ("Ô Số 7 · đề dài nhất", "games/o-so-bi-an/lop-7/", oso_longest_clue, OSO),
    ("Ô Số 7 · lời giải", "games/o-so-bi-an/lop-7/", oso_end_solutions, ".panel"),
    ("Mật Mã · màn mở đầu", "games/mat-ma-bi-an/moi-lop/", nothing, ".panel"),
    ("Mật Mã · 7 lượt", "games/mat-ma-bi-an/moi-lop/", mm_seven_turns, ".slot,.key,.nd,.card,.row"),
    ("Mật Mã · kết thúc", "games/mat-ma-bi-an/moi-lop/", mm_end, ".panel"),
    ("Mảnh Ghép · màn chính", "games/manh-ghep-bi-mat/lop-6/", nothing, ".board-section,.letter,.primary,.secondary,.status,.tool"),
    ("Mảnh Ghép · câu hỏi có hình", "games/manh-ghep-bi-mat/lop-6/", mg_question, "#answer-submit,#math-answer,.math-image,.question-content"),
]


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else ""
    bad_total = 0
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, url, setup, sel in CASES:
            if only and only not in url:
                continue
            print(f"\n## {name}")
            for sname, w, h in SCREENS:
                ctx = browser.new_context(viewport={"width": w, "height": h})
                pg = ctx.new_page()
                errors = []
                pg.on("pageerror", lambda e: errors.append(str(e)))
                pg.goto(BASE + url)
                wait(pg, 500)
                try:
                    setup(pg)
                    wait(pg)
                    r = pg.evaluate(MEASURE, sel)
                except Exception as ex:  # a step failed: report it as a problem
                    r = {"doc": -1, "clip": -1, "inner": "lỗi: " + str(ex)[:60]}
                bad = r["doc"] != 0 or r["clip"] != 0 or r["inner"] or errors
                bad_total += bool(bad)
                note = f"kéo trang {r['doc']}px, bị cắt {r['clip']}, kéo trong khung: {r['inner'] or '-'}"
                if errors:
                    note += f", lỗi JS: {errors[0][:60]}"
                print(f"  {'✗' if bad else '✓'} {sname:26} {note if bad else ''}")
                ctx.close()
        browser.close()
    print(f"\nTổng: {bad_total} trường hợp cần sửa." if bad_total else "\nTất cả đều vừa 1 màn hình.")
    sys.exit(1 if bad_total else 0)


if __name__ == "__main__":
    main()
