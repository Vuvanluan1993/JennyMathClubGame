#!/usr/bin/env python3
# Sinh sprite đảo theo vùng biển (26x18) + sprite vật thể trong nước, xuất khối JS và ảnh xem trước.
import json, sys
from PIL import Image

PXC = {'k':'#1F2A5A','w':'#FFFFFF','s':'#FFD9B8','c':'#F26249','g':'#2AB563','G':'#1E8A4A','l':'#CFDB6E','o':'#F37A1F','O':'#C95A0E','y':'#FCD655','a':'#FCB40C','b':'#12B5E8','B':'#0079C1','p':'#8656A8','P':'#5E3A7A','r':'#F04A1B','R':'#B8320F','n':'#9A6234','N':'#6B3F1D','e':'#E3E7F0','E':'#9AA4C0','t':'#F6D98B','T':'#E2B85E','u':'#C8783A','m':'#C3CBDD','x':'#7FD3F0'}
NEW = {'v':'#CDB8F7','V':'#A07FE3','q':'#FBB9DA','Q':'#E8649F','i':'#BFF1FF','d':'#3A3F52','D':'#585F78','f':'#FFB13B','h':'#4B2A4A','H':'#2E1A33','z':'#FFF3C4','j':'#8FD14F'}
PXC.update(NEW)

W, H = 26, 18

def grid(w=W, h=H):
    return [['.'] * w for _ in range(h)]

def stamp(g, rows, x, y):
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch != '.' and 0 <= y + j < len(g) and 0 <= x + i < len(g[0]):
                g[y + j][x + i] = ch

def out(g):
    return [''.join(r) for r in g]

# nền đảo 6 hàng: 1 mặt đất, 2 điểm nhấn, 3 vách, 4 vân vách, kết thúc bằng bóng nước
GROUND = [
    "....kkkk1111111111kkkk....",
    "..kk11111121111111112kk...",
    ".k11121111111111211111k...",
    "k1111111111211111111111k..",
    "k3333333333333333333333k..",
    ".k3343333334333333433kk...",
    "..kkkkkkkkkkkkkkkkkkk.....",
]
def ground(g, m, dx=1):
    rows = [r.replace('1', m[0]).replace('2', m[1]).replace('3', m[2]).replace('4', m[3]) for r in GROUND]
    rows = ['.' * dx + r[:W - dx] for r in rows]
    stamp(g, rows, 0, H - len(rows))

S = {}

# ---------- NHIỆT ĐỚI: 2 cây dừa có trái + phao bơi + cát vàng ----------
g = grid(); ground(g, 'ttTu')
crown = ["...kk..kk...",
         ".kkggkkgGkk.",
         "kggGggggGggk",
         "kGgkgNNgkgGk",
         "kk.k.NNk.kkk",
         "k....kk....k"]
stamp(g, crown, 1, 0)
for j, x in enumerate([6, 6, 7, 7, 7, 8, 8]): stamp(g, ["knk"], x, 5 + j)
crown2 = ["..kk.kk...", "kkggkgGkk.", "kgGgNgGgk.", "k.kNNkk.k.", "k..k...k.."]
stamp(g, crown2, 14, 3)
for j, x in enumerate([17, 17, 16, 16, 16]): stamp(g, ["knk"], x, 7 + j)
stamp(g, [".kkk.", "krwrk", "kw.wk", "krwrk", ".kkk."], 20, 8)   # phao bơi
stamp(g, ["kNk"], 10, 11); stamp(g, ["kNk"], 12, 12)          # trái dừa rơi
S['isl_trop'] = out(g)

# ---------- BIỂN BĂNG: khối băng + lều tuyết + chim cánh cụt ----------
g = grid(); ground(g, 'wiix')
stamp(g, ["..kkkkkkkk..",            # lều tuyết
          ".kwwwewwwwk.",
          "kwwewwwweewk",
          "kewwwkkkwwek",
          "kwwwkkkkkwwk",
          "keewkkkkkeek"], 6, 6)
stamp(g, ["....k...",                 # tảng băng nhọn
          "...kik..",
          "..kiwxk.",
          ".kiwixxk",
          "kiwiixxk",
          "kiiixxbk",
          "kiwixxbk"], 0, 5)
stamp(g, [".kk..",                    # chim cánh cụt
          "kkwk.",
          "kkkoo",
          "kwwk.",
          "kwwkk",
          "kwwk.",
          ".oo.."], 19, 5)
stamp(g, ["w.", ".w"], 22, 1); stamp(g, ["w"], 3, 1); stamp(g, ["w"], 17, 0)
S['isl_snow'] = out(g)

# ---------- NÚI LỬA: đá đen, miệng đỏ, dòng dung nham, khói ----------
g = grid(); ground(g, 'dDkd')
stamp(g, ["...EE.eE..",
          "..eEeEEe..",
          "....EeE...",
          ".....E...."], 7, 0)
stamp(g, ["........krfrk........",
          ".......kdrffrdk.......",
          "......kdDdrfdDdk......",
          ".....kdDdDrrdDdDk.....",
          "....kdDddDdrDddDdk....",
          "...kdDdddDdroDdddDk...",
          "..kdDddDdddrfdddDddk..",
          ".kdDdddddDdorrdddDddk.",
          "kdDddDdddddrfodddddDdk"], 2, 4)
stamp(g, ["f", "o"], 13, 12)
S['isl_volc'] = out(g)

# ---------- SA MẠC: cồn cát, xương rồng 3 nhánh, chà là, kim tự tháp, hồ nhỏ ----------
g = grid(); ground(g, 'ytTa')
stamp(g, ["..kk.kk..", "kkgGkgGkk", "kgGgGgGgk", "k.kakak.k", "...kak..."], 0, 1)   # chà là
for j, x in enumerate([3, 3, 4, 4, 4, 4]): stamp(g, ["knk"], x, 6 + j)
stamp(g, ["...kk...",                  # xương rồng 3 nhánh
          "..kgGk..",
          "k.kgGk..",
          "kgkgGk.k",
          "kgkgGkkg",
          "kggggGgk",
          ".kkgGkk.",
          "...gGk..",
          "..kgGk.."], 8, 3)
stamp(g, ["....k....",                 # kim tự tháp nhỏ
          "...kak...",
          "..kaTTk..",
          ".kaaTTTk.",
          "kaaaTTTTk"], 16, 7)
stamp(g, ["kkkkk", "kxbbk"], 20, 12)   # hồ nước nhỏ
stamp(g, ["kxxbbk"], 19, 13)
S['isl_dese'] = out(g)

# ---------- KẸO NGỌT: bánh kem nhiều tầng, kẹo mút xoắn, kẹo gậy ----------
g = grid(); ground(g, 'wqQn')
stamp(g, [".....kkkkk......",
          "....kqqqqqk.....",
          "...kwwwwwwwk....",
          "...kwqwwqwwk....",
          "...kqqqqqqqk....",
          "..kwwwwwwwwwk...",
          "..kwqwwwqwwqk...",
          "..kqqcqqqcqqk...",
          ".kqqqqqqqqqqqk.."], 5, 4)
stamp(g, ["..r..", ".kwk.", ".kck."], 9, 1)   # nến
stamp(g, [".kkkk.",                     # kẹo mút xoắn
          "kcqqck",
          "kqwcqk",
          "kqcwqk",
          "kcqqck",
          ".kkkk.",
          "..kw..",
          "..kw..",
          "..kw..",
          "..kw.."], 0, 2)
stamp(g, [".kkk.",                      # kẹo gậy
          "kwrwk",
          "krkrk",
          "kw.k.",
          "kr...",
          "kw...",
          "kr...",
          "kw..."], 20, 4)
S['isl_cand'] = out(g)

# ---------- PHA LÊ: cụm pha lê lớn nhiều mặt trên đá tím ----------
g = grid(); ground(g, 'pVPv')
stamp(g, ["...k...",
          "..kwk..",
          ".kwvVk.",
          ".kwvVk.",
          "kwvvVVk",
          "kwvwVVk",
          "kwvvVPk",
          "kwvvVPk",
          "kvvvVPk",
          "kvvVVPk",
          "kvvVPPk",
          "kvVVPPk",
          "kvVVPPk"], 9, 0)
stamp(g, ["..k..",
          ".kwk.",
          "kwqQk",
          "kwqQk",
          "kqqQk",
          "kqQQk",
          "kqQQk",
          "kqQQk"], 4, 5)
stamp(g, ["..k..",
          ".kwk.",
          "kwixk",
          "kwixk",
          "kixbk",
          "kixbk",
          "kixbk"], 16, 6)
stamp(g, [".k.", "kwk", "kvk", "kVk"], 1, 10)
stamp(g, [".k.", "kwk", "kqk", "kQk"], 21, 9)
stamp(g, ["w"], 3, 2); stamp(g, ["w"], 20, 2); stamp(g, [".w.", "www", ".w."], 23, 3)
S['isl_crys'] = out(g)

# ---------- RỪNG XANH: cây tán lớn, dây leo, hoa đỏ ----------
g = grid(); ground(g, 'gGNj')
stamp(g, ["......kkkkkkkk......",
          "...kkkgGgjgGgGkkk...",
          "..kgGjgGgGgGjgGgGk..",
          ".kgGgGgGjgGgGgGgjgk.",
          "kgGjgGgGgGgGgjgGgGgk",
          "kGgGgGjgGgGgGgGgGjGk",
          ".kGkGkkGkknkkGkkGkk.",
          "..G.G..G.knk.G..G...",
          "..G.r....knk....G...",
          "..r.....kNnk....r...",
          ".........knk........"], 2, 0)
stamp(g, [".r.", "ryr", ".r."], 2, 10); stamp(g, [".c.", "cyc", ".c."], 20, 10)
stamp(g, ["g.g", "gGg"], 15, 10)
S['isl_jung'] = out(g)

# ---------- LÁ THU: cây lá đỏ cam, đống lá, nấm ----------
g = grid(); ground(g, 'uuOo')
stamp(g, ["....kkkkkkkk....",
          "..kkoarooaorkk..",
          ".koOroaoOrooaOk.",
          "kroaOoroOaroOrok",
          "kOroaOroaoOroaOk",
          ".kOkrkOkkOkrkOk.",
          "..k..k.knk.k..k.",
          ".......knk......",
          "......kNnk......",
          ".......knk......"], 4, 0)
stamp(g, [".kkkk.", "krwrrk", "krrrwk", ".kwwk.", "..kwk."], 17, 7)   # nấm
stamp(g, ["..o.r.a..", ".orarooa.", "oroaorao."], 1, 10)                # đống lá
S['isl_autu'] = out(g)

# ---------- ĐÊM SAO: hải đăng sọc đỏ trắng, đèn sáng ----------
g = grid(); ground(g, 'GDdg')
stamp(g, ["....kk....",
          "...kRRk...",
          "..kkkkkk..",
          "..kyyzyk..",
          "..kyzyyk..",
          "..kkkkkk..",
          "...kwwk...",
          "...krrk...",
          "...krrk...",
          "..kwwwwk..",
          "..kwwwwk..",
          "..krrrrk..",
          "..krrrrk..",
          ".kwwwwwwk."], 8, 0)
stamp(g, ["a.", ".a", "a."], 6, 3); stamp(g, [".a", "a.", ".a"], 16, 3)
stamp(g, ["kNk", "kNk"], 13, 12)   # cửa
stamp(g, ["g.g", "gGg"], 2, 11); stamp(g, ["g.g", "gGg"], 20, 11)
S['isl_nigh'] = out(g)

# ---------- HOÀNG HÔN: dừa bóng tối trên cát cam ----------
g = grid(); ground(g, 'oaOf')
crown = ["...hh..hh...", ".hhhhhhhhhh.", "hhhhhhhhhhhh", "hh.h.hhh.hhh", "h....hh....h"]
stamp(g, crown, 2, 0)
for j, x in enumerate([7, 7, 8, 8, 8, 9, 9, 9]): stamp(g, ["hh"], x, 5 + j)
crown2 = ["..hh.hh...", "hhhhhhhhh.", "hh.hhh.hh.", "h..h...h.."]
stamp(g, crown2, 14, 4)
for j, x in enumerate([17, 17, 16, 16]): stamp(g, ["hh"], x, 8 + j)
stamp(g, ["..hhh..", ".hhhhh.", "hhhhhhh"], 19, 9)   # bụi cây bóng tối
S['isl_suns'] = out(g)

# ---------- vật thể trong nước ----------
OBJ = {
 'coralA': ["...c....c..", ".c.cc..cc.c", ".cc.cqcc.cc", "..cccqccc..", "c..ccqcc..c", "cc..ccc..cc", ".ccccqcccc.", "...ccccc...", "....ccc...."],
 'coralB': [".o...o...o.", ".oo..o..oo.", "..oo.o.oo..", "o..ooooo..o", "oo..ooo..oo", ".ooooooooo.", "...ooooo...", "....ooo...."],
 'fishC': ["..kkk...k", ".kowok.kk", "kowkwokok", "kowwwookk", ".kowok.kk", "..kkk...k"],
 'fishY': ["..kkk...k", ".kyyyk.kk", "kykyyakyk", "kyyyyakkk", ".kyyyk.kk", "..kkk...k"],
 'berg': [".....kk.......", "....kiwk......", "...kiwixk..k..", "..kiwiixxkkik.", ".kiwiiixxbkixk", "kiwiiiixxxbkxbk", "kiiiiixxxbbkbbk"],
 'pengS': [".kkk..", "kkwkk.", "kkkkoo", "kwwwk.", "wwwwww"],
 'lavaP': ["..rrr..", ".rfffr.", "rffzffr", ".rfffr.", "..rrr.."],
 'basalt': ["...kkk....", "..kDdDk...", ".kDdddDkk.", "kDdddrdDdk", "kddDdddddk", ".kkkkkkkk."],
 'turtle': ["...kkk....", "..kGgGk.kk", ".kgGgGgkgjk", "kGgGgGgGkk.", ".kGgGgGk...", "..k...k...."],
 'dune': [".....kkkk.....", "...kkttyykk...", ".kktttyyyyykk.", "kttttyyyyyyyyk", "wwwwwwwwwwwwww"],
 'wrapA': ["kk.....kk", "kckkkkkck", ".kcqcwck.", ".kcwcqck.", "kckkkkkck", "kk.....kk"],
 'mint': ["..kkk..", ".kwrwk.", "kwrwrwk", "krwwwrk", "kwrwrwk", ".kwrwk.", "..kkk.."],
 'wrapB': ["kk.......kk", "kbkkkkkkkbk", ".kbwbwbwbk.", "kbkkkkkkkbk", "kk.......kk"],
 'crysW1': ["....k....", "...kwk...", "..kwvVk..", "..kwvVk..", ".kwvvVVk.", ".kwvvVPk.", ".kvvvVPk.", "kwvvVVPPk", "kvvvVVPPk", "kvvVVPPPk", "wwwwwwwww"],
 'crysW2': ["..k...", ".kwk..", ".kqQk.", "kwqQk.", "kqqQk.", "kqQQkk", "kqQQkQk", "wwwwwww"],
 'crysW3': ["......k......", ".....kwk.....", "..k..kwxk..k.", ".kwk.kixk.kwk", ".kik.kixbkkik", "kwixkkixbkkixk", "kiixkkixbkkixk", "wwwwwwwwwwwwww"],
 'shard': ["..w..", ".wvV.", "wvvVP", ".VVP.", "..P.."],
 'lotus': ["...q...", "..qwq..", ".qqwqq.", "qqQqQqq", ".gggGg.", "gGgggGg", ".gGGgg."],
 'reed': ["N...N.", "N..NN.", "N..N..", "g..N.N", "g.gg.N", "gg.g.g", ".gg.gg", ".g.gg.", "..gg..", "..g..."],
 'log': ["..kkkkkkkkk.", ".knNnNnNnNkk", "kunNnNnNnNkuk", "kNnNnNnnNnkuk", ".kkkkkkkkkkk.", "wwwwwwwwwwwww"],
 'frog': [".kk.kk.", "kwkkwkk", "kgggggk", "kgjjjgk", "kgggggk", ".k...k."],
 'maple': ["...r...", ".r.r.r.", "rrrrrrr", ".rrRrr.", "rrrRrrr", "..rrr..", "...n..."],
 'mapleO': ["...o...", ".o.o.o.", "ooooooo", ".ooOoo.", "oooOooo", "..ooo..", "...n..."],
 'pboat': [".....w.....", "....kwk....", "...kwwek...", "..kwwwwek..", "kkkkkkkkkkk", ".kwwwwwwek.", "..kkkkkkk.."],
 'jellyP': ["..kkk..", ".kqwqk.", "kqwqqqk", "kqqqqQk", "kkkkkkk", ".q.q.q.", "q.q.q.q", ".q...q."],
 'jellyB': ["..kkk..", ".kiwik.", "kiwiiik", "kiiiixk", "kkkkkkk", ".i.i.i.", "i.i.i.i", ".i...i."],
 'birdH': ["hh...hh", "..h.h..", "...h..."],
 'boatH': [".....h.....", "....hh.....", "...hhh.h...", "..hhhh.hh..", ".hhhhh.hhh.", "hhhhhh.hhhh", ".....h.....", "hhhhhhhhhhh", ".hhhhhhhhh.", "..hhhhhhh.."],
}
S.update(OBJ)

for k, v in S.items():
    wd = max(len(r) for r in v)
    S[k] = [r.ljust(wd, '.') for r in v]
    for r in S[k]:
        for ch in r:
            assert ch == '.' or ch in PXC, (k, ch)

if __name__ == '__main__':
    js = 'Object.assign(PXC,' + json.dumps(NEW) + ');\nObject.assign(PXS,{\n' + ',\n'.join(f' {k}:' + json.dumps(v) for k, v in S.items()) + '\n});'
    open(sys.argv[1], 'w').write(js)
    # ảnh xem trước: đảo phóng to x8
    names = [k for k in S if k.startswith('isl_')] + list(OBJ)
    Z = 8; cols = 5
    cw, ch_ = 28 * Z, 20 * Z
    rows = (len(names) + cols - 1) // cols
    img = Image.new('RGB', (cols * cw, rows * ch_), '#6FD0F2')
    for n, name in enumerate(names):
        ox, oy = (n % cols) * cw + Z, (n // cols) * ch_ + Z
        for j, r in enumerate(S[name]):
            for i, c in enumerate(r):
                if c != '.':
                    for a in range(Z):
                        for b in range(Z):
                            img.putpixel((ox + i * Z + a, oy + j * Z + b), tuple(int(PXC[c][q:q + 2], 16) for q in (1, 3, 5)))
    img.save(sys.argv[2])
