# Cách thêm hoặc sửa nội dung

## Thêm một chủ đề mới cho một lớp

Từ P-15a (26/10/2026): tạo file trong `content/lop-N/` (ví dụ `32-hk2-phan-c.js`) có `export function dangKyHk2C(reg){const {addTopic,LES}=reg; …}`,
gọi nó trong `dangKy` của `content/lop-N/index.js`, rồi chạy `node tools/vite/tim-import.mjs` (sinh dòng import). Không cần sửa `app.template.html`:
cả thư mục được nối, theo thứ tự tên file. Helper dùng cho từ hai lớp trở lên đặt ở `js/core/30b–30f`, không đặt ở content.

```js
(()=>{
const Q={
  cong:()=>()=>{const a=R(10,50),b=R(5,40);return NQ(`<b>${a} + ${b} = ?</b>`,`${a} cộng ${b} bằng bao nhiêu?`,a+b,`${a} + ${b} = ${a+b}.`,'Cộng có nhớ')},
};
// mỗi bài: ['k'+số bài, số bài, 'Bài N. Tên bài', 'nhãn ngắn', số tiết, [gen Màn 1], [gen Màn 2], [gen Trùm — chỉ bài cuối chủ đề]]
const CDEF=[['k60',60,'Bài 60. ...','Nhãn',2,[Q.cong()],[Q.cong()]], /* ... */ ];
const MG={fish:()=>({rule:'Câu cá ... <b>…</b>',say:'...',item:()=>({t:'...',ok:true})}),balloon:()=>({/* ... */})};
addTopic(3, 5, CDEF, MG);   // lớp 3, chủ đề thứ 6 (ti đếm từ 0)
Object.assign(LES[3],{60:[{t:'Ý chính',h:'<p>...</p>',say:'...'},{t:'Em nhớ nhé',h:lsMem('...'),say:'...'}]});
})();
```

Quy tắc:
- Số đảo của mỗi bài = số tiết trong vở (`data/plan.json`). Đảo cuối chủ đề có Trùm.
- Lớp 1–2: 5 câu/màn; lớp 3–5: 8 câu/màn. Bài lời văn lớp 3–5: `kind` có chữ "lời văn" (tính nặng hơn, màn ít câu hơn).
- Đề và slide **viết lại**, không chép câu/số của sách. Toán phải đúng.
- Hình, chữ vừa điện thoại 360px.

## Sửa một câu sai

Tìm theo `kind` hoặc theo mã đảo (ví dụ `g4k38t2` = lớp 4, bài 38, tiết 2) trong `content/`.

## Sửa slide

`content/lop-<N>/20-bai-giang.js` (Chủ đề 1–5) hoặc phần `Object.assign(LES[...])` cuối mỗi file `hk2`.

## Sau mỗi thay đổi

```bash
python3 tools/build.py && node tools/test/kiem-tra.js <lớp>
```
Đạt hết rồi mới commit và đẩy lên GitHub. Ghi một dòng vào `CHANGELOG.md`.
