# Dựng game "Jenny Thám Tử Nhí" từ khung game Mầm non + các dạng bài trong tools/tham_tu_acts.js
# Chạy: python tools/build_tham_tu.py
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=ROOT+'/games/hanh-trinh-jenny/mam-non/index.html'
OUT=ROOT+'/games/hanh-trinh-jenny/tham-tu/index.html'
s=open(SRC).read(); acts=open(ROOT+'/tools/tham_tu_acts.js').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt, (s.count(a), a[:70]); s=s.replace(a,b)
rep('<title>Hành trình của Jenny Mầm non – Học Toán cùng Jenny</title>','<title>Jenny Thám Tử Nhí – Học Toán cùng Jenny</title>')
rep('<div class="ttl">Hành trình của Jenny<small>Mầm non · Toán tư duy</small></div>','<div class="ttl">Jenny Thám Tử Nhí<small>Mầm non · Quan sát và tư duy</small></div>')
rep('<script src="art.js"></script>','<script src="../mam-non/art.js"></script>')
rep("const KEY = 'jenny-saga-mn';","const KEY = 'jenny-saga-tt';")
i0=s.index('const ISLANDS = ['); i1=s.index('];',i0)+2
s=s[:i0]+"""const ISLANDS = [
  { id: 'm', name: 'Khu Mê Cung', sub: 'Tìm đường đi', color: '#F4F4F1', edge: '#1a1a1a', types: ['maze'] },
  { id: 'r', name: 'Khu Dây Rối', sub: 'Dõi theo sợi dây', color: '#F4F4F1', edge: '#1a1a1a', types: ['tangle'] },
  { id: 'g', name: 'Khu Mảnh Ghép', sub: 'Tìm mảnh còn thiếu', color: '#F4F4F1', edge: '#1a1a1a', types: ['piece'] },
  { id: 'b', name: 'Khu Cái Bóng', sub: 'Hình và bóng', color: '#F4F4F1', edge: '#1a1a1a', types: ['shadow'] },
  { id: 's', name: 'Khu Chỗ Sai', sub: 'Tìm điều vô lý', color: '#F4F4F1', edge: '#1a1a1a', types: ['wrong'] },
  { id: 'e', name: 'Khu Đếm Hình', sub: 'Đếm hình chồng nhau', color: '#F4F4F1', edge: '#1a1a1a', types: ['overlap'] },
  { id: 'q', name: 'Khu Quy Luật', sub: 'Hình tiếp theo', color: '#F4F4F1', edge: '#1a1a1a', types: ['seq'] },
  { id: 'n', name: 'Khu Nối Điểm', sub: 'Nối số · soi gương', color: '#F4F4F1', edge: '#1a1a1a', types: ['dots', 'mirror'] },
  { id: 'h', name: 'Khu Đồng Hồ', sub: 'Xem giờ · hơn kém giờ', color: '#F4F4F1', edge: '#1a1a1a', types: ['time'] },
  { id: 't', name: 'Khu Toán Vui', sub: 'Thư và hộp thư · cái cân', color: '#F4F4F1', edge: '#1a1a1a', types: ['mail', 'scale'] }
];"""+s[i1:]
a0=s.index('const ACTS = {};'); a1=s.index('/* ================= read aloud')
s=s[:a0]+acts+'\n'+s[a1:]
i0=s.index('const SKILL = {'); i1=s.index('};',i0)+2
s=s[:i0]+"const SKILL = { maze: 'Tìm đường', tangle: 'Dõi theo đường', piece: 'Ghép hình', shadow: 'Tri giác hình', wrong: 'Suy luận', overlap: 'Đếm', seq: 'Quy luật', dots: 'Thứ tự số', mirror: 'Đối xứng', time: 'Xem giờ', mail: 'Tính nhẩm', scale: 'So sánh số lượng' };"+s[i1:]
rep("isle: Math.max(0, Math.min(5, +u.get('isle') || 0))","isle: Math.max(0, Math.min(9, +u.get('isle') || 0))")
rep("window.__mn =","window.__tt =")
rep("is.need = k ? 6 : 0;","is.need = 0; /* mọi khu đều mở */")
rep("if (node && node.matches('.cbtn:not(.ok):not(.pc), .pickable:not(.still) .it'))","if (node && node.matches && node.matches('.cbtn:not(.ok):not(.pc):not(.boxb):not(.envb), .pickable:not(.still) .it'))")
css="""
/* ---------- Jenny Thám Tử Nhí */
:root{--sky:#F3F2EC}
/* nét vẽ đen trắng kiểu sách bút chì ---------- */
.pane{background:#fff;border:3px solid #1a1a1a;border-radius:18px;box-shadow:0 5px 0 #1a1a1a;padding:8px;min-height:0;min-width:0;display:grid;place-items:center;overflow:hidden}
.pane{position:relative}.pane>svg{position:absolute;inset:8px;width:calc(100% - 16px);height:calc(100% - 16px);display:block}
.pane.maze>svg,.pane.dots>svg,.pane.mirror>svg{touch-action:none}
.cbtn.pic.big{width:104px;height:96px}
.cbtn.pic.piece-o{width:112px;height:96px;padding:4px}
.act.mail{display:grid;grid-template-rows:1fr 1fr;gap:14px;align-content:center}
.envs,.boxes{align-items:center}
.cbtn.envb{position:relative;width:150px;height:100px;padding:0;background:#fff;font-size:30px}
.cbtn.envb .env{position:absolute;inset:6px;width:calc(100% - 12px);height:calc(100% - 12px)}
.cbtn.envb b{position:relative;background:#fff;padding:0 8px;border-radius:8px;transform:translateY(10px)}
.cbtn.envb.on{outline:5px solid #1a1a1a;outline-offset:3px}
.cbtn.boxb{position:relative;width:130px;height:104px;padding:0;flex-direction:column;gap:0;font-size:32px;background:#fff}
.cbtn.boxb .mbox{width:84px;height:54px}
.cbtn.boxb .cnt{position:absolute;top:4px;right:10px;font-style:normal;font-size:24px}
.cbtn.boxb.got{background:#eee}
.clocks .it svg{width:100%;height:100%}
@media (max-width:460px){.cbtn.pic.big{width:84px;height:80px}.cbtn.pic.piece-o{width:84px;height:76px}.cbtn.envb{width:106px;height:76px;font-size:24px}.cbtn.boxb{width:92px;height:84px;font-size:26px}.cbtn.boxb .mbox{width:62px;height:40px}.choices.envs,.choices.boxes{gap:6px}}
@media (max-height:520px){.cbtn.envb{height:70px;width:120px;font-size:24px}.cbtn.boxb{height:72px;width:100px;font-size:24px}.cbtn.boxb .mbox{height:34px}.act.mail{gap:6px}}
</style>"""
k=s.index('</style>'); s=s[:k]+css+s[k+8:]
open(OUT,'w').write(s); print(len(s))
