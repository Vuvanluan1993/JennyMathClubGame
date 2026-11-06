#!/usr/bin/env python3
"""Đồng bộ token giữa mã (design/tokens.json, P-03) và design system Jenny trong Claude Design
(design/design-system/project/tokens.json, P-18).

  python3 design/design-system/xuat-token.py          → sinh project/tokens.json từ design/tokens.json
  python3 design/design-system/xuat-token.py --check  → so hai chiều, in "Khác N giá trị", thoát 1 nếu N > 0

Quy ước tên: nhóm logo (phẳng) giữ tên (navy, blue…); nhóm khác = <nhóm>-<tên> (app-bg, px-sea, lms-pri…);
font.* → type.families; space → spacing; size.tap → size-tap; radius → radius-pixel / radius-lms;
app.shadow, frame.2/3 → shadow (frame ghi màu đã giải tham chiếu vì shadow không nhận alias).
Thang chữ (type.groups) chỉ có ở design system — mã chưa có token chữ; khi mã thêm thì bổ sung ở đây.
"""
import json, os, re, sys
HERE=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(HERE,'..','tokens.json')
DST=os.path.join(HERE,'project','tokens.json')
REF=re.compile(r'\{([a-z-]+)\.([a-z0-9-]+)\}')

def name_of(group,key):
    return key if group=='logo' else f'{group}-{key}'

USAGE={
 'app-bg':'Nền trang bản không pixel (GV/PH/QL trước khi áp Classroom).','app-surface':'Nền thẻ, bảng, hộp thoại — chữ app-ink trên nền này.',
 'app-surface-2':'Nền phụ: ô nhập, nút thường khi rê, .pill.','app-ink':'Chữ chính trên app-surface, app-bg, px-bg.','app-muted':'Chữ phụ .muted trên app-surface, app-surface-2.',
 'app-line':'Viền mảnh thẻ và ô nhập (bản không pixel).','app-sea':'Màu nhấn bản không pixel: .btn.pri, liên kết.','app-sea-ink':'Chữ trên nền app-sea / px-sea (nút chính).',
 'app-sea-soft':'Nền nhạt sau chữ xanh: tab đang chọn, .av.','app-sea-deep':'Nút chính khi rê; chữ trên app-sea-soft.','app-sun':'Nút vàng .btn.sun — chữ #2b1a00 trên nền này.',
 'app-sun-soft':'Nền nhạt .pill.warn; chữ app-sun-ink.','app-sun-ink':'Chữ cảnh báo trên app-sun-soft.','app-leaf':'Đúng / đã xong: chữ .pill.ok trên app-leaf-soft (3,90:1 — chờ thầy quyết).',
 'app-leaf-soft':'Nền nhạt sau chữ app-leaf.','app-coral':'Sai / nguy hiểm: chữ .btn.danger trên app-coral-soft.','app-coral-soft':'Nền nhạt nút nguy hiểm.','app-lock':'Nền ô đã khoá.',
 'px-frame':'Khung pixel 3px, bóng cứng, chữ trên khung biển (= navy).','px-bg':'Nền trang học sinh; chữ app-ink trên nền này.','px-sea':'Màu nhấn học sinh: .hero, .btn.pri, chữ xanh trên app-surface.',
 'px-sea-deep':'Chữ trên px-sea-soft; nút chính khi rê.','px-sea-soft':'Nền ô phương án đang chọn, tab dưới đang chọn.','px-leaf':'Đúng: ô .t, .pill.ok trên px-leaf-soft (3,23:1 — chờ thầy quyết).',
 'px-leaf-soft':'Nền nhạt sau px-leaf; đảo đã xong.','px-sun':'Nút vàng học sinh; vạch dưới tab đang chọn; chữ #2b1a00.','px-sun-soft':'Nền tab dưới đang chọn, ô Jenny (.jav); chữ app-ink.',
 'px-sun-ink':'Chữ .pill.warn trên px-sun-soft.','px-coral':'Sai / nguy hiểm học sinh: chữ trên px-coral-soft; tim mất.','px-coral-soft':'Nền nhạt nút nguy hiểm học sinh.',
 'px-line':'Viền mảnh trong trang học sinh.','px-water':'Nền biển trên Bản đồ; chữ px-frame trên nền này.','px-water-dot':'Chấm sóng trên px-water (= white).',
 'home-sky':'Nền trời trang chủ và khung Bebras; chữ home-ink.','home-ink':'Chữ chính trang chủ/Bebras trên home-paper, home-sky, home-sun.','home-ink-soft':'Chữ phụ trang chủ trên home-paper.',
 'home-paper':'Nền thẻ trang chủ; chữ trên home-ink, home-sel, home-mint.','home-sun':'Nút vàng .big, cờ .flag — chữ home-ink.','home-sun-soft':'Nền .stat, phím .key.fn — chữ home-ink.',
 'home-coral':'Nhấn cam trang chủ (trang trí, không đặt chữ lên).','home-mint':'Cờ .flag.done — chữ home-paper (2,37:1 — chờ thầy quyết).','home-mint-soft':'Nền .mini i.ok — chữ #0E6B4C.',
 'home-sel':'Chip đang chọn, phím .key.on — chữ home-paper.','home-sel-soft':'Nền nhạt chip đang chọn.','home-hatch':'Gạch chéo nền trang chủ.','home-purple':'Nhấn tím trang chủ (trang trí).',
 'lms-line':'Viền 1px thẻ, nút viền, ô nhập, gạch dưới thanh trên (Classroom).','lms-line-2':'Đường kẻ mảnh hơn: hàng bảng, chân ô Quản lý.','lms-ink':'Chữ chính Classroom trên white (= navy).',
 'lms-mute':'Chữ phụ .muted, tab chưa chọn, tiêu đề cột bảng.','lms-pri':'Nút chính, tab đang chọn, liên kết, viền ô nhập khi chọn (= blue).','lms-pri-hover':'Nút chính khi rê.',
 'lms-pri-soft':'Nền VI|EN đang chọn, .av thanh trên, thanh .qlbar — chữ lms-pri.','lms-ok':'Nhãn xanh .pill.ok, chữ .qlok trên lms-ok-soft.','lms-ok-soft':'Nền nhãn xanh.',
 'lms-warn':'Nhãn vàng .pill.warn, chữ .qlw, .qlnote trên lms-warn-soft (4,34:1 — chờ thầy quyết).','lms-warn-soft':'Nền nhãn vàng, hộp .qlnote, thanh demo.',
 'lms-bad':'Nhãn đỏ .pill.bad, nút xoá .qlxbtn trên lms-bad-soft / white.','lms-bad-soft':'Nền nhãn đỏ.',
}
LOGO_USAGE={'navy':'Khung pixel, bóng cứng, chữ Classroom (lms-ink). Thanh đầu ô Lớp thứ 4.','white':'Nền thẻ, chấm sóng, chữ trên nút chính.','skin':'Da nhân vật pixel (chỉ sprite).',
 'coral':'Áo/đồ nhân vật, cua trùm (sprite).','green':'Nhãn "Club" trên logo chữ (#28B568 trong mã — chờ thầy duyệt gộp).','green-deep':'Bóng xanh lá trong sprite.','lime':'Lá cây sáng (sprite).',
 'orange':'Cam sáng (sprite, cá).','orange-deep':'Cam đậm (sprite).','sun':'Vàng sáng (sprite: sao, mặt trời).','amber':'Vàng nhấn học sinh (px-sun); nút vàng, vạch tab.','sky':'Nền màn Đăng nhập, cổng GV/PH/QL (#12B5E8).',
 'blue':'Màu nhấn chung hai theme: px-sea và lms-pri.','purple':'Tím (sprite, thanh đầu ô Giáo viên dùng cam).','purple-deep':'Tím đậm (sprite).','red':'Đỏ (sprite, tim).','red-deep':'Đỏ đậm (sprite).',
 'brown':'Nâu (sprite: thân cây, thuyền).','brown-deep':'Nâu đậm (sprite).','mist':'Xám xanh nhạt (sprite: đá, mây).','mist-deep':'Xám xanh (sprite).','sand':'Cát đảo (sprite, đảo nhà).','sand-deep':'Cát đậm (sprite).',
 'wood':'Gỗ (sprite).','silver':'Bạc (sprite).','sky-soft':'Trời nhạt (sprite).'}
LOGO_USAGE_NOTE=' Màu logo Clb, chữ khoá PXC "%s" trong 22-do-hoa-pixel-mau-logo-clb.js.'

TYPE_GROUPS=[
 {"name":"Pixel — tiêu đề và nút (VT323)","family":"pixel","note":"Học sinh và game. VT323 chỉ cho tiêu đề, nút, số lớn; trọng lượng luôn 400; không dùng cho đoạn chữ dài.",
  "styles":[
   {"name":"px-hero","fontSize":"40px","lineHeight":1.05,"fontWeight":400,"letterSpacing":"0.3px","sample":"Chào Jenny01!","usage":"Tiêu đề thẻ chào (clamp 30–40px theo khổ)."},
   {"name":"px-h2","fontSize":"28px","lineHeight":1.05,"fontWeight":400,"letterSpacing":"0.3px","sample":"Phòng học của em","usage":"Tiêu đề thẻ, tiêu đề mục; nút VÀO HỌC (.gobtn, viết hoa)."},
   {"name":"px-h3","fontSize":"25px","lineHeight":1.05,"fontWeight":400,"letterSpacing":"0.3px","sample":"Các số từ 0 đến 10","usage":"Tiêu đề phụ, tên chủ đề."},
   {"name":"px-dialog","fontSize":"22px","lineHeight":1.2,"fontWeight":400,"sample":"Jenny gợi ý","usage":"Đầu hộp thoại pixel (.gdhd) chữ trắng trên navy."},
   {"name":"px-nav","fontSize":"18px","lineHeight":1,"fontWeight":400,"sample":"Bản đồ · Toán Jenny · Nhà em · Cửa hàng","usage":"Thanh dưới (clamp 14–18px), nhãn đảo, cờ; nút Đăng xuất thanh trên (16px)."},
   {"name":"px-number","fontSize":"46px","lineHeight":1,"fontWeight":400,"sample":"4  3  2","usage":"Số trong ô phương án lớn (.g1opts.big), ô kết quả."},
   {"name":"px-chip","fontSize":"24px","lineHeight":1,"fontWeight":400,"sample":"0/39","usage":"Số trong chip thẻ chào (sao, xu) và logo chữ JennyClub."}]},
 {"name":"Pixel — chữ thường (Be Vietnam Pro)","family":"body","note":"Mọi câu chữ đọc dài trong app học sinh. Cỡ tối thiểu 12,5px; nút tối thiểu 14,5px.",
  "styles":[
   {"name":"body","fontSize":"15px","lineHeight":1.5,"fontWeight":400,"sample":"Em có 0 món đồ. Phối đồ cho Jenny nhé!","usage":"Chữ thường cả hai theme (Classroom đổi họ chữ sang Lexend)."},
   {"name":"option","fontSize":"19px","lineHeight":1.3,"fontWeight":700,"sample":"Có mấy chiếc ô tô?","usage":"Chữ trong ô phương án, câu hỏi."},
   {"name":"button","fontSize":"14.5px","lineHeight":1.3,"fontWeight":600,"sample":"Phối đồ ▸","usage":"Nút .btn; nút .lg 16px; toast."},
   {"name":"button-sm","fontSize":"13px","lineHeight":1.3,"fontWeight":600,"sample":"← Phòng học","usage":"Nút nhỏ .btn.sm, chữ dưới ô Nhà em."},
   {"name":"muted","fontSize":"13.5px","lineHeight":1.5,"fontWeight":400,"sample":"Bài 1–6 · 19 đảo · trùm Cua Số Đếm","usage":"Chữ phụ .muted."},
   {"name":"pill","fontSize":"12.5px","lineHeight":1.3,"fontWeight":600,"sample":"Đã làm hết","usage":"Nhãn .pill (pixel: không bo góc)."},
   {"name":"tag","fontSize":"11px","lineHeight":1.3,"fontWeight":800,"letterSpacing":"0.08em","sample":"MIỄN PHÍ","usage":"Nhãn .tag viết hoa."}]},
 {"name":"Classroom (Lexend)","family":"lms","note":"Giáo viên, phụ huynh, quản lý. Lexend 400/500/600; tiêu đề 500, không viết hoa, không giãn chữ.",
  "styles":[
   {"name":"lms-h1","fontSize":"28px","lineHeight":1.25,"fontWeight":500,"sample":"Quản lý trung tâm","usage":"Tiêu đề trang (24px ở ≤ 560px); số lớn .kpi.big 600."},
   {"name":"lms-class","fontSize":"24px","lineHeight":1.25,"fontWeight":500,"sample":"Lớp 1A","usage":"Tên lớp trên dải màu thẻ lớp (chữ white)."},
   {"name":"lms-tile","fontSize":"22px","lineHeight":1.25,"fontWeight":500,"sample":"Học sinh","usage":"Tiêu đề ô Quản lý trên dải màu (17px ở ≤ 560px)."},
   {"name":"lms-brand","fontSize":"19px","lineHeight":1.25,"fontWeight":500,"sample":"Lớp học ảo Jenny","usage":"Tên app ở thanh trên trắng."},
   {"name":"lms-h2","fontSize":"18px","lineHeight":1.25,"fontWeight":500,"sample":"Khối 1","usage":"Tiêu đề mục trong thẻ; đầu hộp thoại (.gdhd)."},
   {"name":"lms-h3","fontSize":"16px","lineHeight":1.25,"fontWeight":500,"sample":"Thêm học sinh vào lớp","usage":"Tiêu đề nhỏ."},
   {"name":"lms-body","fontSize":"15px","lineHeight":1.5,"fontWeight":400,"sample":"Lớp và học sinh do quản lý trung tâm xếp.","usage":"Chữ thường Classroom trên white; .muted màu lms-mute."},
   {"name":"lms-button","fontSize":"14.5px","lineHeight":1.3,"fontWeight":500,"sample":"Đưa vào lớp","usage":"Nút .btn Classroom (cao 36px); tab 14px; chữ \"Mở ▸\" 14px."},
   {"name":"lms-button-sm","fontSize":"13.5px","lineHeight":1.3,"fontWeight":500,"sample":"✎ Sửa","usage":"Nút nhỏ (cao 32px); dòng cảnh báo trong ô Quản lý."},
   {"name":"lms-pill","fontSize":"13px","lineHeight":1.3,"fontWeight":500,"sample":"Toán Jenny","usage":"Nhãn tròn .pill/.tag; VI|EN."},
   {"name":"lms-th","fontSize":"12.5px","lineHeight":1.3,"fontWeight":500,"sample":"Họ tên · Lớp · Phụ huynh","usage":"Tiêu đề cột bảng, màu lms-mute."}]},
 {"name":"Trang chủ (Baloo 2 · Nunito)","family":"home","note":"Chỉ trang chủ games và khung Bebras; không dùng trong Lớp học ảo.",
  "styles":[
   {"name":"home-h1","fontSize":"48px","lineHeight":1.1,"fontWeight":800,"sample":"Học Toán cùng Jenny","usage":"Tiêu đề trang chủ (clamp 30–48px)."},
   {"name":"home-h2","fontSize":"26px","lineHeight":1.2,"fontWeight":800,"sample":"Tư duy Bebras","usage":"Tiêu đề bộ game."},
   {"name":"home-body","family":"home-body","fontSize":"16px","lineHeight":1.5,"fontWeight":400,"sample":"Mỗi game một file, chạy độc lập.","usage":"Chữ thường trang chủ (Nunito)."},
   {"name":"home-tag","family":"home-body","fontSize":"12px","lineHeight":1.3,"fontWeight":700,"sample":"Lớp 3","usage":"Nhãn lớp .tag trên home-ink."}]}]

def load_src():
    return json.load(open(SRC,encoding='utf-8'))

def resolve(src,val):
    """Giải tham chiếu {nhom.ten} → giá trị thật (đệ quy)."""
    def rep(m):
        g,k=m.group(1),m.group(2); t=src['groups'][g]['tokens'][k]
        return resolve(src,t['value'] if isinstance(t,dict) else t)
    return REF.sub(rep,val)

def alias(val):
    return REF.sub(lambda m:'{'+name_of(m.group(1),m.group(2))+'}',val)

def build(src):
    G=src['groups']; colors=[]; shadows=[]; spacing=[]; radius=[]; size=[]
    for key,t in G['logo']['tokens'].items():
        colors.append({"name":key,"value":t['value'].lower(),"usage":LOGO_USAGE.get(key,'Màu logo.')+LOGO_USAGE_NOTE%t['pxc']})
    for g in ['app','px','home','lms']:
        for key,v in G[g]['tokens'].items():
            n=name_of(g,key)
            if g=='app' and key=='shadow':
                shadows.append({"name":n,"value":v,"usage":"Bóng mềm thẻ/nút bản không pixel (box-shadow). Pixel và Classroom không dùng."}); continue
            val=alias(v) if REF.search(v) else v.lower()
            colors.append({"name":n,"value":val,"usage":USAGE.get(n,G[g]['description'])})
    for key,v in G['frame']['tokens'].items():
        shadows.append({"name":f"frame-{key}","value":resolve(src,v),"usage":f"Khung pixel khuyết góc {key}px (= --f{key} của body.px): ô nhập, nhãn Club, ô Nhà em. Màu = px-frame (navy)."})
    for key,v in G['space']['tokens'].items():
        spacing.append({"name":f"space-{key}","value":v,"usage":{'1':'Khe giữa biểu tượng và chữ; khe chip.','2':'Khe trong nút, giữa chip; đệm ô nhập nhỏ.','3':'Khe giữa ô phương án, ô Quản lý; đệm thẻ nhỏ.','4':'Lề trang hai bên (tối thiểu); đệm thẻ, ô nhập.','5':'Khoảng giữa các mục; đệm hộp thoại.'}[key]})
    size.append({"name":"size-tap","value":G['size']['tokens']['tap'],"usage":"Cỡ chạm tối thiểu mọi nút/ô bấm của học sinh (mầm non 48, tiểu học ≥ 44). Nút Classroom hiện 36px — chờ thầy quyết nâng."})
    for key,v in G['radius']['tokens'].items():
        radius.append({"name":f"radius-{key}","value":v,"usage":{'pixel':'Theme Pixel: mọi góc vuông (nút, thẻ, nhãn, ô nhập).','lms':'Theme Classroom: thẻ, ô Quản lý, hộp thoại. Nút và ô nhập Classroom bo 4px, nhãn tròn 16px (đề xuất thêm token, chờ thầy).'}[key]})
    fam={k:v for k,v in G['font']['tokens'].items()}
    return {"name":"Jenny","version":src['version'],
     "meta":{"source":"design/tokens.json (P-03, nguồn duy nhất trong mã)","script":"design/design-system/xuat-token.py","note":"Hai theme Pixel và Classroom cùng một bảng màu (giá trị giống nhau ở cả hai cột); khác nhau ở họ chữ (type.groups) và bo góc (radius-pixel / radius-lms). Luật đã chốt ở src/lop-hoc-ao/docs/LUAT-DA-CHOT.md §2, §6j."},
     "color":{"themes":[{"id":"pixel","name":"Pixel (học sinh, game)"},{"id":"classroom","name":"Classroom (GV · PH · QL)"}],
             "note":"25 màu logo Clb trước, rồi bộ app (nền/chữ chung), px (học sinh), home (trang chủ), lms (Classroom). Một thương hiệu: hai theme không khác màu.",
             "tokens":colors},
     "type":{"fonts":[],"families":fam,"groups":TYPE_GROUPS},
     "spacing":{"note":"Bậc 4px: 4 · 8 · 12 · 16 · 24.","tokens":spacing},
     "radius":{"note":"Pixel 0 — Classroom 8px. Đây là một trong hai điểm khác nhau giữa hai theme.","tokens":radius},
     "shadow":{"note":"Pixel: khung khuyết góc và bóng cứng (màu đặc, không mờ). Classroom: không bóng, chỉ viền lms-line. Bóng mềm chỉ ở bản không pixel.","tokens":shadows},
     "size":{"note":"Cỡ chạm.","tokens":size}}

def check(src):
    ds=json.load(open(DST,encoding='utf-8')); exp=build(src); diff=[]
    def tbl(d,fam): return {t['name']:t['value'] for t in d.get(fam,{}).get('tokens',[])}
    for fam in ['color','spacing','radius','shadow','size']:
        a,b=tbl(exp,fam),tbl(ds,fam)
        for n in sorted(set(a)|set(b)):
            if a.get(n)!=b.get(n): diff.append(f'{fam}.{n}: mã={a.get(n)!r} ds={b.get(n)!r}')
    for k in sorted(set(exp['type']['families'])|set(ds['type'].get('families',{}))):
        if exp['type']['families'].get(k)!=ds['type'].get('families',{}).get(k): diff.append(f'font.{k}: mã={exp["type"]["families"].get(k)!r} ds={ds["type"].get("families",{}).get(k)!r}')
    # chiều ngược: từ ds suy lại từng token của mã
    back=0; G=src['groups']
    dsc=tbl(ds,'color'); dsh=tbl(ds,'shadow')
    for g,grp in G.items():
        for key,t in grp['tokens'].items():
            v=t['value'] if isinstance(t,dict) else t
            if g=='logo': got=dsc.get(key); want=v.lower()
            elif g=='frame': got=dsh.get(f'frame-{key}'); want=resolve(src,v)
            elif g=='space': got=tbl(ds,'spacing').get(f'space-{key}'); want=v
            elif g=='size': got=tbl(ds,'size').get('size-tap'); want=v
            elif g=='radius': got=tbl(ds,'radius').get(f'radius-{key}'); want=v
            elif g=='font': got=ds['type'].get('families',{}).get(key); want=v
            elif g=='app' and key=='shadow': got=dsh.get('app-shadow'); want=v
            else: got=dsc.get(name_of(g,key)); want=alias(v) if REF.search(v) else v.lower()
            if got!=want: back+=1; diff.append(f'ngược {g}.{key}: mã={want!r} ds={got!r}')
    for d in diff: print(d)
    print(f'Khác {len(diff)} giá trị ({back} theo chiều ngược).')
    return 1 if diff else 0

if __name__=='__main__':
    src=load_src()
    if '--check' in sys.argv: sys.exit(check(src))
    out=build(src); json.dump(out,open(DST,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
    n=sum(len(out[f]['tokens']) for f in ['color','spacing','radius','shadow','size'])
    print(f'Đã ghi {DST}: {n} token + {len(out["type"]["families"])} họ chữ + {sum(len(g["styles"]) for g in TYPE_GROUPS)} kiểu chữ.')
