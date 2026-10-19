/* ===================== PHẦN II · Toán Jenny (Sách CLB lớp 6, Chương 1) ===================== */
const STAR2=[2,3,4];   // sao cho màn ★, ★★, ★★★
const P2=[
 {id:'j1',week:1,title:'Buổi 1 · Tập hợp',src:'Sách CLB lớp 6 · Chương 1 · Tuần 1',
  slides:[
  {t:'Tập hợp: những điều cần nhớ',h:'<p>• Viết tập hợp: liệt kê, hoặc chỉ ra tính chất đặc trưng. Mỗi phần tử chỉ liệt kê một lần.</p><p>• Tập rỗng ∅ không có phần tử nào.</p>',say:'Buổi một: tập hợp. Có hai cách viết tập hợp: liệt kê, hoặc chỉ ra tính chất đặc trưng. Mỗi phần tử chỉ liệt kê một lần. Tập hợp không có phần tử nào gọi là tập rỗng.'},
  {t:'Tập con',h:'<p>• Nếu mọi phần tử của A đều thuộc B thì A ⊂ B.</p><p>• <b>Mẹo:</b> tập hợp có n phần tử thì có 2<sup>n</sup> tập con (kể cả ∅ và chính nó).</p>',say:'Nếu mọi phần tử của A đều thuộc B thì A là tập con của B. Mẹo: một tập hợp có n phần tử thì có hai mũ n tập con, kể cả tập rỗng và chính nó.'},
  {t:'Đếm phần tử của dãy cách đều',h:'<p>Số phần tử = (số cuối − số đầu) : khoảng cách + 1</p><p>Ví dụ: {5; 8; 11; …; 50} có (50 − 5) : 3 + 1 = 16 phần tử.</p>',say:'Để đếm số phần tử của một dãy số cách đều, lấy số cuối trừ số đầu, chia cho khoảng cách, rồi cộng một. Ví dụ dãy năm, tám, mười một, đến năm mươi có mười sáu phần tử.'}],
  example:{title:'Ví dụ dẫn dắt · Bài 1.2b',q:'Viết tập hợp các số có hai chữ số mà tổng hai chữ số bằng 5. Tập hợp có bao nhiêu phần tử?',steps:[
   {h:'Jenny: Số có hai chữ số là <b>ab</b>, với a là chữ số hàng chục. Cần a + b = 5.'},
   {h:'Chữ số hàng chục a không thể bằng 0. Vậy a có thể là bao nhiêu giá trị?',ask:{a:5,hint:'a là 1, 2, 3, 4 hoặc 5.'}},
   {h:'Với mỗi a, chữ số b = 5 − a: ta được 14, 23, 32, 41, 50.'},
   {h:'Vậy tập hợp cần tìm có bao nhiêu phần tử?',ask:{a:5,hint:'{14; 23; 32; 41; 50}'}},
   {h:'<b>Bài học:</b> cố định chữ số hàng cao trước, rồi tìm chữ số còn lại. Nhớ chữ số đầu khác 0.'}]},
  levels:[
   [{q:'Viết tập hợp các chữ cái trong từ “JENNY”. Tập hợp đó có bao nhiêu phần tử?',a:4,sol:'{J; E; N; Y}, có 4 phần tử (chữ N chỉ viết một lần).',ref:'1.2a'},
    {q:'Gọi A là tập hợp các số tự nhiên lớn hơn 3 và không vượt quá 9. A có bao nhiêu phần tử?',a:6,sol:'A = {4; 5; 6; 7; 8; 9}, có 6 phần tử.',ref:'1.1'},
    {q:'Tập hợp các số tự nhiên x mà x + 5 = 3 có bao nhiêu phần tử?',a:0,sol:'Không có số tự nhiên nào cộng với 5 được 3. Đó là tập rỗng ∅, có 0 phần tử.',ref:'1.2c'}],
   [{q:'Tập hợp {10; 12; 14; …; 98} có bao nhiêu phần tử?',a:45,sol:'Các số chẵn cách nhau 2 đơn vị: (98 − 10) : 2 + 1 = 45 phần tử.',ref:'1.3a'},
    {q:'Tập hợp {1; 4; 7; …; 100} có bao nhiêu phần tử?',a:34,sol:'Các số cách nhau 3 đơn vị: (100 − 1) : 3 + 1 = 34 phần tử.',ref:'1.3b'},
    {q:'Cho A = {1; 2; 3}. A có tất cả bao nhiêu tập con (kể cả ∅ và chính A)?',a:8,sol:'∅; {1}; {2}; {3}; {1; 2}; {1; 3}; {2; 3}; {1; 2; 3}: có 8 tập con.',ref:'1.4a'}],
   [{q:'Tập hợp {a; b; c; d} có bao nhiêu tập con gồm đúng hai phần tử?',a:6,sol:'{a;b}, {a;c}, {a;d}, {b;c}, {b;d}, {c;d}: có 6 tập con.',ref:'1.4b'},
    {q:'Tập hợp {1; 2; 3; 4; 5} có bao nhiêu tập con?',a:32,sol:'Tập có 5 phần tử có 2<sup>5</sup> = 32 tập con.',ref:'bài thêm'},
    {q:'Có bao nhiêu tập con của {1; 2; 3; 4; 5} chứa phần tử 1?',a:16,sol:'Mỗi tập con chứa 1 ứng với đúng một tập con của {2; 3; 4; 5}: có 2<sup>4</sup> = 16.',ref:'bài thêm'}]]},
 {id:'j2',week:1,title:'Buổi 2 · Biểu đồ Venn',src:'Sách CLB lớp 6 · Chương 1 · Tuần 1',
  slides:[
  {t:'Biểu đồ Venn',h:VENN_SVG+'<p>Mỗi tập hợp là một vòng kín. Phần chung chứa các phần tử thuộc cả hai tập.</p>',say:'Buổi hai: biểu đồ Venn. Mỗi tập hợp được vẽ bằng một vòng kín. Phần chung của hai vòng chứa các phần tử thuộc cả hai tập hợp.'},
  {t:'Công thức đếm',h:'<p><b>Hai tập:</b> số phần tử thuộc A hoặc B = (số phần tử của A) + (số phần tử của B) − (số phần tử chung).</p><p><b>Mẹo:</b> điền số từ phần chung ở giữa ra ngoài. Chưa biết phần giữa thì gọi nó là x.</p>',say:'Với hai tập hợp: số phần tử thuộc A hoặc B bằng số phần tử của A cộng số phần tử của B, trừ số phần tử chung. Mẹo: điền số vào biểu đồ từ phần chung ở giữa ra ngoài. Nếu chưa biết phần giữa thì gọi nó là x.'}],
  example:{title:'Ví dụ dẫn dắt · Bài 1.5',q:'Lớp 6A có 35 học sinh. Có 20 bạn thích bóng đá, 18 bạn thích cầu lông và 7 bạn không thích môn nào. Có bao nhiêu bạn thích cả hai môn? Bao nhiêu bạn chỉ thích bóng đá?',steps:[
   {h:VENN_SVG.replace('>A<','>Bóng đá<').replace('>B<','>Cầu lông<').replace('x="78"','x="40"').replace('x="236"','x="214"')},
   {h:'Có 7 bạn nằm ngoài cả hai vòng. Vậy có bao nhiêu bạn thích ít nhất một môn?',ask:{a:28,hint:'35 − 7'}},
   {h:'Cộng hai vòng: 20 + 18 = 38, nhiều hơn 28. Phần chung bị đếm hai lần. Số bạn thích cả hai môn là bao nhiêu?',ask:{a:10,hint:'38 − 28'}},
   {h:'Điền từ giữa ra: chỉ thích bóng đá = 20 − 10. Kết quả là bao nhiêu?',ask:{a:10,hint:'20 − 10'}},
   {h:'<b>Bài học:</b> số bạn thích cả hai = tổng hai vòng − số bạn thích ít nhất một môn.'}]},
  levels:[
   [{q:'Lớp 6D có 30 bạn. 18 bạn thích Toán, 15 bạn thích Văn, 5 bạn không thích môn nào trong hai môn đó. Có bao nhiêu bạn thích cả hai môn?',a:8,sol:'30 − 5 = 25 bạn thích ít nhất một môn. Số bạn thích cả hai: 18 + 15 − 25 = 8.',ref:'bài thêm'},
    {q:'Có 15 bạn đi dã ngoại. Bạn nào mang mũ thì cũng mang áo mưa. Có 10 bạn không mang mũ và 3 bạn không mang áo mưa. Có bao nhiêu bạn mang áo mưa nhưng không mang mũ?',a:7,sol:'Mang mũ: 15 − 10 = 5; mang áo mưa: 15 − 3 = 12. Các bạn mang mũ đều mang áo mưa nên đáp số là 12 − 5 = 7.',ref:'1.6'}],
   [{q:'Trong câu lạc bộ, cứ 5 bạn biết bơi thì có 1 bạn biết chơi cờ vua. Cứ 3 bạn biết chơi cờ vua thì có 1 bạn biết bơi. Số bạn biết bơi mà không biết cờ vua gấp mấy lần số bạn biết cờ vua mà không biết bơi?',a:2,sol:'Gọi số bạn biết cả hai là x: biết bơi 5x, biết cờ vua 3x. Chỉ bơi 4x, chỉ cờ vua 2x. Gấp 2 lần.',ref:'1.7'},
    {q:'Lớp 6B có 40 học sinh, mỗi bạn tham gia ít nhất một CLB: Toán (22), Tiếng Anh (18), Cờ vua (15). Có 8 bạn học cả Toán và Tiếng Anh, 6 bạn cả Toán và Cờ vua, 5 bạn cả Tiếng Anh và Cờ vua. Có bao nhiêu bạn tham gia cả ba CLB?',a:4,sol:'22 + 18 + 15 − 8 − 6 − 5 + x = 40, tức là 36 + x = 40, x = 4.',ref:'1.8a'}],
   [{q:'Vẫn với lớp 6B ở màn trước (cả ba CLB có 4 bạn). Có bao nhiêu bạn chỉ tham gia đúng một CLB?',a:29,sol:'Chỉ Toán: 22 − 4 − 2 − 4 = 12; chỉ Tiếng Anh: 18 − 4 − 1 − 4 = 9; chỉ Cờ vua: 15 − 2 − 1 − 4 = 8. Tổng 29.',ref:'1.8b'},
    {q:'Trên bảng có các số từ 1 đến 300. Jenny gạch các số chia hết cho 2, Julie gạch các số chia hết cho 3, Mai gạch các số chia hết cho 5. Còn bao nhiêu số không bị gạch?',a:80,sol:'Số bị gạch: 150 + 100 + 60 − 50 − 30 − 20 + 10 = 220. Còn 300 − 220 = 80 số.',ref:'1.9'},
    {q:'Lớp 6C có 30 bạn: 25 biết bơi, 24 biết đi xe đạp, 22 biết đá cầu, 27 thích đọc sách. Ít nhất bao nhiêu bạn có đủ cả bốn điều?',a:8,sol:'Số bạn thiếu ít nhất một điều không quá 5 + 6 + 8 + 3 = 22. Vậy ít nhất 30 − 22 = 8 bạn có đủ cả bốn.',ref:'1.10'}]]},
 {id:'j3',week:2,title:'Buổi 3 · Ghi số tự nhiên',src:'Sách CLB lớp 6 · Chương 1 · Tuần 2',draft:true},
 {id:'j4',week:2,title:'Buổi 4 · Tính nhanh, dãy cách đều',src:'Sách CLB lớp 6 · Chương 1 · Tuần 3',draft:true}
];

