/* Hành trình Jenny – Mầm non: thư viện hình SVG (flat cartoon, viền đậm).
 * Mỗi hàm ART.x(o) trả về chuỗi <svg viewBox="0 0 100 100">.
 * o.color: khóa ART_COLORS hoặc mã hex (cho các vật có thể đổi màu)
 * o.flip : true = lật ngang (con vật mặc định quay sang PHẢI)
 * ART.box({part:'back'|'front'}) để đặt đồ vật "trong hộp".
 */
(function () {
  var K = '#1D2B53';
  var COLORS = { red: '#FF6B57', yellow: '#FFC93C', green: '#2DBE8C', blue: '#2F7DE1', purple: '#8E6BD8', orange: '#FF8A3D', pink: '#FF8FB8' };

  function col(o, def) {
    var c = o && o.color;
    if (!c) return COLORS[def] || def;
    return COLORS[c] || c;
  }
  function mix(hex, t, to) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var tr = to ? 255 : 0;
    r = Math.round(r + (tr - r) * t); g = Math.round(g + (tr - g) * t); b = Math.round(b + (tr - b) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function lt(h, t) { return mix(h, t == null ? 0.45 : t, 1); }
  function dk(h, t) { return mix(h, t == null ? 0.22 : t, 0); }
  function wrap(o, body) {
    var f = o && o.flip ? ' transform="translate(100 0) scale(-1 1)"' : '';
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="' + K +
      '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"' + f + '>' + body + '</g></svg>';
  }
  // thick outlined line (tails, stems, handles)
  function tl(d, c, w) {
    return '<path d="' + d + '" fill="none" stroke-width="' + (w + 6) + '"/><path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '"/>';
  }
  function eye(x, y, r) {
    r = r || 3.6;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + K + '" stroke="none"/><circle cx="' + (x + r * 0.35).toFixed(1) +
      '" cy="' + (y - r * 0.4).toFixed(1) + '" r="' + (r * 0.4).toFixed(1) + '" fill="#fff" stroke="none"/>';
  }
  function cheek(x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="4.5" ry="3" fill="#FF7E9D" stroke="none" opacity=".6"/>'; }
  function smile(x, y, w) { w = w || 7; return '<path d="M' + (x - w / 2) + ' ' + y + 'Q' + x + ' ' + (y + w * 0.75) + ' ' + (x + w / 2) + ' ' + y + '" fill="none" stroke-width="2.5"/>'; }
  function shine(x, y, rx, ry, rot) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '"' + (rot ? ' transform="rotate(' + rot + ' ' + x + ' ' + y + ')"' : '') + ' fill="#fff" stroke="none" opacity=".75"/>';
  }
  function starPath(cx, cy, R, r, n) {
    n = n || 5; var p = [];
    for (var i = 0; i < n * 2; i++) {
      var a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r : R;
      p.push((cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return 'M' + p.join('L') + 'Z';
  }
  function leafG(d) { return '<path d="' + d + '" fill="#4CC36E"/>'; }
  var SKIN = '#FFD9B8', WOOD = '#C98B4E', CARD = '#E2A964';

  var A = {};

  /* ---------------- FRUIT / VEG ---------------- */
  A.apple = function (o) {
    var c = col(o, '#F2453D');
    return wrap(o, tl('M50 30Q50 18 56 9', '#8B5A2B', 4) +
      '<path d="M50 30C38 19 13 23 14 50C15 75 34 93 50 86C66 93 85 75 86 50C87 23 62 19 50 30Z" fill="' + c + '"/>' +
      '<path d="M55 20Q66 6 80 12Q70 27 55 20Z" fill="#4CC36E"/>' + shine(30, 46, 5, 9, 20));
  };
  A.pear = function (o) {
    var c = col(o, '#C9DB3F');
    return wrap(o, tl('M50 22Q50 12 55 6', '#8B5A2B', 4) +
      '<path d="M50 19C40 19 38 30 37 40C36 50 20 56 20 73C20 89 35 95 50 95C65 95 80 89 80 73C80 56 64 50 63 40C62 30 60 19 50 19Z" fill="' + c + '"/>' +
      '<path d="M54 14Q64 2 77 8Q68 21 54 14Z" fill="#4CC36E"/>' + shine(32, 70, 5, 10, 15));
  };
  A.banana = function (o) {
    return wrap(o, '<g transform="translate(-6 -4) scale(1.1)">' + '<path d="M22 16C8 56 40 94 88 76C92 74 91 68 86 68C56 74 34 56 34 18Z" fill="#FFD43B"/>' +
      '<path d="M28 26C26 54 46 74 76 76" fill="none" stroke="#E0A800" stroke-width="3"/>' +
      '<path d="M22 16L24 8L33 10L34 18Z" fill="#8B5A2B"/><path d="M86 68L93 70L90 76L86 76" fill="#8B5A2B"/></g>');
  };
  A.orange = function (o) {
    var dots = '', pts = [[34, 44], [62, 40], [44, 66], [70, 62], [54, 80], [30, 64]];
    pts.forEach(function (p) { dots += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.6" fill="#E06A12" stroke="none"/>'; });
    return wrap(o, '<circle cx="50" cy="56" r="37" fill="#FF9A2E"/>' + dots + shine(34, 42, 6, 9, 30) +
      '<path d="M50 20Q50 14 53 11" fill="none"/><path d="M52 18Q66 4 80 12Q68 26 52 18Z" fill="#4CC36E"/>');
  };
  A.strawberry = function (o) {
    var s = '', pts = [[36, 48], [50, 46], [64, 48], [30, 60], [44, 60], [58, 60], [70, 60], [38, 72], [52, 72], [64, 72], [46, 83], [56, 83]];
    pts.forEach(function (p) { s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="1.6" ry="2.4" fill="#FFE27A" stroke="none"/>'; });
    return wrap(o, '<path d="M50 94C28 86 12 60 16 42C20 28 38 26 50 31C62 26 80 28 84 42C88 60 72 86 50 94Z" fill="#F23D4C"/>' + s +
      '<path d="M50 34L36 38L40 28L28 24L42 20L46 10L52 20L64 14L60 24L72 28L60 32L64 38Z" fill="#4CC36E"/>' +
      tl('M50 20L50 8', '#3E9B55', 3));
  };
  A.cherry = function (o) {
    return wrap(o, '<path d="M33 66C36 44 46 26 60 12M67 70C66 46 64 30 60 12" fill="none" stroke="#5A8F2E" stroke-width="3.5"/>' +
      '<path d="M60 12Q76 4 88 14Q74 24 60 12Z" fill="#4CC36E"/>' +
      '<circle cx="32" cy="74" r="18" fill="#E5233F"/><circle cx="68" cy="76" r="18" fill="#E5233F"/>' +
      shine(25, 68, 3.5, 6, 30) + shine(61, 70, 3.5, 6, 30));
  };
  A.carrot = function (o) {
    return wrap(o, '<path d="M50 30Q38 14 30 8Q44 10 50 26Q54 6 62 4Q60 18 52 28Q66 14 76 14Q66 24 54 32Z" fill="#4CC36E"/>' +
      '<path d="M34 32Q50 22 66 32Q64 62 52 93Q48 96 46 92Q36 62 34 32Z" fill="#FF8A1F"/>' +
      '<path d="M40 46L48 46M54 58L62 58M42 68L50 68M50 80L56 80" fill="none" stroke="#C85E00" stroke-width="2.5"/>');
  };
  A.mushroom = function (o) {
    return wrap(o, '<path d="M37 56Q32 86 38 91L62 91Q68 86 63 56Z" fill="#FFF4DC"/>' +
      '<path d="M8 58C8 22 92 22 92 58Q50 68 8 58Z" fill="#F2453D"/>' +
      '<circle cx="30" cy="42" r="5" fill="#fff" stroke="none"/><circle cx="52" cy="32" r="6" fill="#fff" stroke="none"/><circle cx="72" cy="46" r="5" fill="#fff" stroke="none"/><circle cx="18" cy="54" r="3" fill="#fff" stroke="none"/><circle cx="48" cy="52" r="3.5" fill="#fff" stroke="none"/>' +
      eye(44, 72, 2.8) + eye(56, 72, 2.8) + smile(50, 79, 6));
  };
  A.tomato = function (o) {
    return wrap(o, '<path d="M50 26C20 22 10 44 12 60C14 80 32 90 50 90C68 90 86 80 88 60C90 44 80 22 50 26Z" fill="#F2363D"/>' +
      shine(28, 48, 5, 9, 30) +
      '<path d="M50 30L36 36L40 26L26 24L42 20L46 12L52 20L64 14L60 24L74 26L60 30L64 36Z" fill="#4CC36E"/>' + tl('M50 20L52 8', '#3E9B55', 3));
  };
  A.grapes = function (o) {
    var g = '', P = [[50, 82], [39, 66], [61, 66], [28, 48], [50, 49], [72, 48], [39, 32], [61, 32]];
    P.forEach(function (p) { g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11.5" fill="#8E5BD0"/>' + shine(p[0] - 4, p[1] - 4, 2, 3.2, 30); });
    return wrap(o, tl('M50 22Q50 12 56 6', '#8B5A2B', 3.5) + g + '<path d="M54 18Q70 4 86 14Q72 28 54 18Z" fill="#4CC36E"/>');
  };

  /* ---------------- TOYS ---------------- */
  A.ball = function (o) {
    var c = col(o, 'red'), band = (o && o.color === 'yellow') ? '#fff' : '#FFE066';
    return wrap(o, '<circle cx="50" cy="50" r="39" fill="' + c + '"/>' +
      '<path d="M50 11C32 30 32 70 50 89C68 70 68 30 50 11Z" fill="' + band + '"/>' +
      '<path d="M50 11C42 30 42 70 50 89C58 70 58 30 50 11Z" fill="#fff"/>' +
      '<circle cx="50" cy="50" r="39" fill="none"/>' + shine(28, 32, 5, 8, 40));
  };
  A.car = function (o) {
    var c = col(o, 'red');
    return wrap(o, '<path d="M8 72L8 56Q8 50 15 50L26 50L36 30Q38 27 44 27L64 27Q68 27 71 31L81 50L87 50Q93 50 93 58L93 72Z" fill="' + c + '"/>' +
      '<path d="M41 33L53 33L53 49L32 49Z" fill="#BFE7FF"/><path d="M58 33L67 33L75 49L58 49Z" fill="#BFE7FF"/>' +
      '<path d="M8 62L14 62" fill="none"/><rect x="85" y="54" width="8" height="6" rx="2" fill="#FFE066"/>' +
      '<circle cx="28" cy="73" r="11" fill="' + K + '"/><circle cx="28" cy="73" r="4.5" fill="#D8DDE6" stroke="none"/>' +
      '<circle cx="73" cy="73" r="11" fill="' + K + '"/><circle cx="73" cy="73" r="4.5" fill="#D8DDE6" stroke="none"/>');
  };
  A.teddy = function (o) {
    var b = '#D89A5B', l = '#F6DDB6';
    return wrap(o, '<circle cx="30" cy="19" r="9" fill="' + b + '"/><circle cx="70" cy="19" r="9" fill="' + b + '"/>' +
      '<circle cx="30" cy="19" r="4" fill="' + l + '" stroke="none"/><circle cx="70" cy="19" r="4" fill="' + l + '" stroke="none"/>' +
      '<ellipse cx="25" cy="66" rx="8" ry="11" transform="rotate(25 25 66)" fill="' + b + '"/><ellipse cx="75" cy="66" rx="8" ry="11" transform="rotate(-25 75 66)" fill="' + b + '"/>' +
      '<ellipse cx="50" cy="71" rx="22" ry="20" fill="' + b + '"/><ellipse cx="50" cy="74" rx="12" ry="11" fill="' + l + '" stroke="none"/>' +
      '<circle cx="31" cy="87" r="10" fill="' + b + '"/><circle cx="69" cy="87" r="10" fill="' + b + '"/>' +
      '<circle cx="31" cy="88" r="5" fill="' + l + '" stroke="none"/><circle cx="69" cy="88" r="5" fill="' + l + '" stroke="none"/>' +
      '<circle cx="50" cy="37" r="22" fill="' + b + '"/><ellipse cx="50" cy="46" rx="11" ry="8" fill="' + l + '"/>' +
      '<ellipse cx="50" cy="42.5" rx="4" ry="3" fill="' + K + '" stroke="none"/>' + smile(50, 47, 6) + eye(41, 33) + eye(59, 33) +
      '<path d="M50 58L38 52L38 64ZM50 58L62 52L62 64Z" fill="#F2453D"/><circle cx="50" cy="58" r="3" fill="#F2453D"/>');
  };
  A.balloon = function (o) {
    var c = col(o, 'red');
    return wrap(o, '<path d="M50 72Q42 80 54 86Q62 92 50 98" fill="none" stroke-width="2.5"/>' +
      '<path d="M46 76L50 70L54 76Z" fill="' + c + '"/>' +
      '<path d="M50 6C26 6 18 28 22 44C26 60 40 70 50 72C60 70 74 60 78 44C82 28 74 6 50 6Z" fill="' + c + '"/>' + shine(36, 26, 5, 10, 30));
  };
  A.kite = function (o) {
    var c = col(o, 'blue'), l = lt(c, 0.55);
    return wrap(o, '<path d="M50 72Q42 80 52 84Q64 88 56 96" fill="none" stroke-width="2.5"/>' +
      '<path d="M46 80L37 74L37 86ZM46 80L55 74L55 86Z" fill="#FFC93C" stroke-width="2.5"/><path d="M58 90L49 85L50 96ZM58 90L67 84L67 96Z" fill="#FF6B57" stroke-width="2.5"/>' +
      '<path d="M50 4L84 36L50 72L16 36Z" fill="' + c + '"/>' +
      '<path d="M50 4L16 36L50 36ZM50 36L84 36L50 72Z" fill="' + l + '" stroke="none"/>' +
      '<path d="M50 4L84 36L50 72L16 36ZM50 4L50 72M16 36L84 36" fill="none"/>');
  };
  A.drum = function (o) {
    var c = col(o, '#F2453D');
    return wrap(o, tl('M30 30L64 6', '#C98B4E', 4) + tl('M70 30L36 6', '#C98B4E', 4) +
      '<circle cx="64" cy="6" r="4" fill="#FFC93C"/><circle cx="36" cy="6" r="4" fill="#FFC93C"/>' +
      '<path d="M14 40L14 78Q50 96 86 78L86 40" fill="' + c + '"/>' +
      '<path d="M14 44L26 82L38 46L50 86L62 46L74 82L86 44" fill="none" stroke="#FFE066" stroke-width="3.5"/>' +
      '<path d="M14 72Q50 90 86 72L86 78Q50 96 14 78Z" fill="#FFC93C"/>' +
      '<ellipse cx="50" cy="40" rx="36" ry="11" fill="#FFF3D6"/><path d="M14 40Q50 58 86 40" fill="none"/>' +
      '<path d="M14 40L14 46Q50 62 86 46L86 40" fill="#FFC93C"/><ellipse cx="50" cy="40" rx="36" ry="11" fill="#FFF3D6"/>');
  };
  A.pyramid = function (o) {
    var cs = ['#F2453D', '#FF8A3D', '#FFC93C', '#2DBE8C', '#2F7DE1'], r = '';
    r += '<rect x="47" y="12" width="6" height="74" rx="2" fill="#C98B4E"/>';
    r += '<rect x="14" y="84" width="72" height="8" rx="3" fill="#C98B4E"/>';
    for (var i = 0; i < 5; i++) {
      var w = 64 - i * 11, y = 72 - i * 13;
      r += '<rect x="' + (50 - w / 2) + '" y="' + y + '" width="' + w + '" height="13" rx="6.5" fill="' + cs[i] + '"/>';
    }
    r += '<circle cx="50" cy="13" r="9" fill="#8E6BD8"/>' + shine(46, 10, 2, 3, 30);
    return wrap(o, r);
  };
  A.boat = function (o) {
    var c = col(o, 'red');
    return wrap(o, '<path d="M50 8L50 66" fill="none"/><path d="M50 8L64 12L50 16Z" fill="#FF6B57"/>' +
      '<path d="M54 16L54 58L84 58Z" fill="#fff"/><path d="M46 22L46 58L22 58Z" fill="#FFE8A3"/>' +
      '<path d="M10 62L90 62L76 84L24 84Z" fill="' + c + '"/><circle cx="36" cy="72" r="3.5" fill="#fff"/><circle cx="50" cy="72" r="3.5" fill="#fff"/><circle cx="64" cy="72" r="3.5" fill="#fff"/>' +
      '<path d="M6 92Q16 86 26 92Q36 98 46 92Q56 86 66 92Q76 98 86 92Q92 88 96 91" fill="none" stroke="#2F7DE1" stroke-width="3"/>');
  };
  A.block = function (o) {
    var c = col(o, 'blue');
    return wrap(o, '<path d="M12 36L32 16L88 16L68 36Z" fill="' + lt(c, 0.4) + '"/>' +
      '<path d="M68 36L88 16L88 68L68 88Z" fill="' + dk(c, 0.25) + '"/>' +
      '<rect x="12" y="36" width="56" height="52" fill="' + c + '"/>' +
      '<path d="' + starPath(40, 63, 17, 7.5) + '" fill="#fff" stroke-width="2.5"/>');
  };
  A.doll = function (o) {
    var c = col(o, '#FF6FA5'), h = '#8B4A2B';
    return wrap(o, '<circle cx="27" cy="30" r="9" fill="' + h + '"/><circle cx="73" cy="30" r="9" fill="' + h + '"/>' +
      '<path d="M42 82L42 94M58 82L58 94" fill="none" stroke-width="5"/>' +
      '<path d="M40 50L22 70M60 50L78 70" fill="none" stroke-width="9"/><path d="M40 50L22 70M60 50L78 70" fill="none" stroke="' + SKIN + '" stroke-width="4"/>' +
      '<path d="M38 50L62 50L78 86L22 86Z" fill="' + c + '"/><path d="M42 50L50 58L58 50Z" fill="#fff"/>' +
      '<circle cx="34" cy="74" r="2.5" fill="#fff" stroke="none"/><circle cx="50" cy="76" r="2.5" fill="#fff" stroke="none"/><circle cx="66" cy="74" r="2.5" fill="#fff" stroke="none"/>' +
      '<circle cx="50" cy="32" r="18" fill="' + SKIN + '"/>' +
      '<path d="M32 32C30 12 70 12 68 32Q62 22 50 24Q40 22 32 32Z" fill="' + h + '"/>' +
      eye(43, 34, 3) + eye(57, 34, 3) + cheek(38, 41) + cheek(62, 41) + smile(50, 42, 6) +
      '<path d="M60 16L68 10L70 20ZM60 16L52 10L52 20Z" fill="#FFC93C"/>');
  };

  /* ---------------- ANIMALS (face right) ---------------- */
  var SIT = 'M24 90C20 68 28 50 44 50C60 50 68 68 64 90Z';
  A.cat = function (o) {
    var c = '#FFA552', d = '#D9742A';
    return wrap(o, tl('M30 84C10 82 6 60 16 50', c, 7) +
      '<path d="' + SIT + '" fill="' + c + '"/><path d="M34 64L42 62M32 72L40 71" fill="none" stroke="' + d + '" stroke-width="3"/>' +
      '<ellipse cx="42" cy="90" rx="8" ry="5" fill="' + c + '"/><ellipse cx="58" cy="90" rx="8" ry="5" fill="' + c + '"/>' +
      '<path d="M45 32L43 10L60 22Z" fill="' + c + '"/><path d="M66 22L83 10L81 32Z" fill="' + c + '"/>' +
      '<path d="M47 26L46 16L55 22ZM71 22L80 16L79 26Z" fill="#FFB3C1" stroke="none"/>' +
      '<ellipse cx="62" cy="38" rx="23" ry="19" fill="' + c + '"/>' +
      '<path d="M58 21L58 26M64 20L64 26" fill="none" stroke="' + d + '" stroke-width="3"/>' +
      eye(54, 36) + eye(71, 36) + '<path d="M60 42L65 42L62.5 45Z" fill="#FF7E9D" stroke-width="2"/>' +
      '<path d="M57 47Q60 50 62.5 46Q65 50 68 47" fill="none" stroke-width="2.2"/>' + cheek(49, 44) + cheek(76, 44) +
      '<path d="M78 42L92 40M78 46L92 48M46 42L33 40M46 46L33 48" fill="none" stroke-width="1.6"/>');
  };
  A.dog = function (o) {
    var c = '#F2C38B', e = '#9A5B2E';
    return wrap(o, tl('M28 80C14 76 12 62 18 52', c, 7) +
      '<path d="' + SIT + '" fill="' + c + '"/><ellipse cx="36" cy="68" rx="8" ry="7" fill="' + e + '" stroke="none"/>' +
      '<ellipse cx="42" cy="90" rx="8" ry="5" fill="' + c + '"/><ellipse cx="58" cy="90" rx="8" ry="5" fill="' + c + '"/>' +
      '<ellipse cx="60" cy="38" rx="21" ry="19" fill="' + c + '"/>' +
      '<ellipse cx="73" cy="47" rx="13" ry="9" fill="#FFF1DE"/><ellipse cx="84" cy="43" rx="5" ry="4" fill="' + K + '" stroke="none"/>' +
      '<path d="M74 52Q78 56 84 51" fill="none" stroke-width="2.2"/>' +
      '<path d="M44 24C34 24 32 46 38 56C46 56 50 40 50 28Z" fill="' + e + '"/>' +
      '<path d="M64 21C72 16 82 26 80 34C74 34 68 30 64 26Z" fill="' + e + '"/>' +
      eye(56, 34) + eye(69, 33) + cheek(54, 46));
  };
  A.rabbit = function (o) {
    var c = '#EEF1F6';
    return wrap(o, '<circle cx="24" cy="80" r="8" fill="#fff"/>' +
      '<path d="' + SIT + '" fill="' + c + '"/>' +
      '<ellipse cx="54" cy="18" rx="7" ry="17" transform="rotate(-12 54 18)" fill="' + c + '"/><ellipse cx="72" cy="17" rx="7" ry="17" transform="rotate(14 72 17)" fill="' + c + '"/>' +
      '<ellipse cx="54" cy="19" rx="3" ry="11" transform="rotate(-12 54 19)" fill="#FFB3C1" stroke="none"/><ellipse cx="72" cy="18" rx="3" ry="11" transform="rotate(14 72 18)" fill="#FFB3C1" stroke="none"/>' +
      '<ellipse cx="48" cy="91" rx="11" ry="5" fill="' + c + '"/><ellipse cx="62" cy="91" rx="10" ry="5" fill="' + c + '"/>' +
      '<circle cx="63" cy="46" r="19" fill="' + c + '"/>' +
      eye(56, 43) + eye(71, 43) + '<ellipse cx="64" cy="50" rx="3" ry="2.2" fill="#FF7E9D" stroke-width="1.8"/>' +
      '<path d="M61 54L67 54L67 59L61 59Z" fill="#fff" stroke-width="2"/><path d="M58 53Q61 56 64 53Q67 56 70 53" fill="none" stroke-width="2"/>' +
      cheek(51, 51) + cheek(77, 51));
  };
  A.duck = function (o) {
    var c = '#FFD43B';
    return wrap(o, '<path d="M38 84L36 92L44 92M54 84L52 92L60 92" fill="none" stroke="#FF8A1F" stroke-width="3.5"/>' +
      '<path d="M8 50L26 60C34 52 54 54 62 60L80 60C86 78 70 88 50 88C30 88 14 78 8 50Z" fill="' + c + '"/>' +
      '<path d="M84 36Q98 36 98 43Q92 49 82 46Z" fill="#FF8A1F"/>' +
      '<circle cx="70" cy="38" r="17" fill="' + c + '"/>' +
      '<path d="M30 64Q46 56 60 68Q46 80 30 64Z" fill="#F5B700"/>' + eye(74, 34) + cheek(72, 44) +
      '<path d="M66 22Q66 14 72 14" fill="none" stroke-width="2.5"/>');
  };
  A.chicken = function (o) {
    var c = '#F5B36A', d = '#D9772E';
    return wrap(o, '<path d="M44 84L42 94M58 84L56 94M38 94L46 94M52 94L60 94" fill="none" stroke="#FF8A1F" stroke-width="3.5"/>' +
      '<path d="M22 54L8 32L22 40L20 22L34 40Z" fill="' + d + '"/>' +
      '<path d="M66 24Q64 12 71 15Q73 7 79 13Q87 11 84 24Z" fill="#F2363D"/>' +
      '<path d="M84 36L95 40L84 45Z" fill="#FFC93C"/><path d="M82 46Q86 56 80 54Q77 50 80 46Z" fill="#F2363D"/>' +
      '<path d="M16 54C16 80 36 90 52 90C72 90 84 76 80 58C79 52 84 46 84 38C84 26 76 20 70 20C60 20 56 30 58 44C48 42 30 42 16 54Z" fill="' + c + '"/>' +
      '<path d="M32 62Q48 54 60 66Q46 80 32 62Z" fill="' + d + '"/>' + eye(73, 34) + cheek(74, 44));
  };
  A.fish = function (o) {
    var c = col(o, 'orange'), d = dk(c, 0.18), l = lt(c, 0.5);
    return wrap(o, '<path d="M28 50L6 30Q12 50 6 70Z" fill="' + d + '"/>' +
      '<path d="M44 30Q54 12 70 26Z" fill="' + d + '"/><path d="M50 72Q56 84 64 74Z" fill="' + d + '"/>' +
      '<path d="M22 50C34 22 76 20 94 50C76 80 34 78 22 50Z" fill="' + c + '"/>' +
      '<path d="M46 40Q52 48 46 56M56 38Q62 48 56 60" fill="none" stroke="' + l + '" stroke-width="3"/>' +
      '<circle cx="76" cy="44" r="7" fill="#fff" stroke-width="2.2"/>' + eye(78, 44, 3.6) + smile(86, 56, 7));
  };
  A.bird = function (o) {
    var c = '#4FA8EA', d = '#2E7CC4';
    return wrap(o, '<path d="M46 80L44 92M56 80L56 92" fill="none" stroke="#FF8A1F" stroke-width="3.5"/>' +
      '<path d="M26 58L6 48L12 70Z" fill="' + d + '"/>' +
      '<path d="M84 36L96 41L84 46Z" fill="#FF8A1F"/>' +
      '<path d="M18 60C18 78 34 86 50 86C68 86 80 74 80 58C80 52 86 46 86 38C86 26 78 20 68 20C56 20 52 30 52 38C40 36 18 42 18 60Z" fill="' + c + '"/>' +
      '<ellipse cx="58" cy="68" rx="16" ry="13" fill="#FFF3D6" stroke="none"/>' +
      '<path d="M26 56Q40 46 54 58Q40 74 26 56Z" fill="' + d + '"/>' + eye(72, 34) + cheek(72, 44));
  };
  A.butterfly = function (o) {
    var c = col(o, 'purple'), l = lt(c, 0.45);
    return wrap(o, '<path d="M48 26Q42 14 34 12M52 26Q58 14 66 12" fill="none" stroke-width="2.5"/><circle cx="34" cy="12" r="3" fill="' + K + '"/><circle cx="66" cy="12" r="3" fill="' + K + '"/>' +
      '<path d="M50 46C32 14 6 16 8 38C10 54 34 56 50 50Z" fill="' + c + '"/><path d="M50 46C68 14 94 16 92 38C90 54 66 56 50 50Z" fill="' + c + '"/>' +
      '<path d="M50 52C32 54 14 66 20 80C26 92 46 78 50 58Z" fill="' + l + '"/><path d="M50 52C68 54 86 66 80 80C74 92 54 78 50 58Z" fill="' + l + '"/>' +
      '<circle cx="26" cy="36" r="6" fill="#fff" stroke-width="2"/><circle cx="74" cy="36" r="6" fill="#fff" stroke-width="2"/><circle cx="32" cy="72" r="4" fill="#FFE066" stroke-width="2"/><circle cx="68" cy="72" r="4" fill="#FFE066" stroke-width="2"/>' +
      '<ellipse cx="50" cy="56" rx="5" ry="22" fill="' + K + '"/><circle cx="50" cy="30" r="7" fill="' + K + '"/>');
  };
  A.bee = function (o) {
    var cx = 46, cy = 60, rx = 30, ry = 21, st = '';
    function band(x1, x2) {
      function hy(x) { return ry * Math.sqrt(Math.max(0, 1 - Math.pow((x - cx) / rx, 2))); }
      var a = hy(x1), b = hy(x2);
      return '<path d="M' + x1 + ' ' + (cy - a).toFixed(1) + 'Q' + ((x1 + x2) / 2) + ' ' + (cy - (a + b) / 2 - 2).toFixed(1) + ' ' + x2 + ' ' + (cy - b).toFixed(1) +
        'L' + x2 + ' ' + (cy + b).toFixed(1) + 'Q' + ((x1 + x2) / 2) + ' ' + (cy + (a + b) / 2 + 2).toFixed(1) + ' ' + x1 + ' ' + (cy + a).toFixed(1) + 'Z" fill="' + K + '" stroke="none"/>';
    }
    st = band(28, 36) + band(46, 54);
    return wrap(o, '<ellipse cx="40" cy="30" rx="11" ry="17" transform="rotate(-25 40 30)" fill="#D7F1FF"/><ellipse cx="56" cy="28" rx="11" ry="17" transform="rotate(20 56 28)" fill="#D7F1FF"/>' +
      '<path d="M18 62L6 60L18 54" fill="' + K + '"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#FFD43B"/>' + st +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="none"/>' +
      '<path d="M76 46Q76 32 70 28M84 46Q88 32 94 30" fill="none" stroke-width="2.5"/><circle cx="70" cy="28" r="3" fill="' + K + '"/><circle cx="94" cy="30" r="3" fill="' + K + '"/>' +
      '<circle cx="78" cy="58" r="15" fill="#FFD43B"/>' + eye(83, 54) + smile(83, 64, 7) + cheek(76, 62));
  };
  A.hedgehog = function (o) {
    var p = [], cx = 46, cy = 78, n = 15;
    for (var i = 0; i <= n * 2; i++) {
      var a = Math.PI + (i / (n * 2)) * Math.PI * 0.86, r = i % 2 ? 30 : 40;
      p.push((cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * 0.95 * Math.sin(a)).toFixed(1));
    }
    return wrap(o, '<ellipse cx="34" cy="86" rx="8" ry="5" fill="#8B5E3C"/><ellipse cx="62" cy="86" rx="8" ry="5" fill="#8B5E3C"/>' +
      '<path d="M8 82L' + p.join('L') + 'L66 82Z" fill="#8B5E3C"/>' +
      '<path d="M58 44C74 46 88 62 94 70C88 80 72 84 56 84C50 70 50 54 58 44Z" fill="#F5D2A8"/>' +
      '<circle cx="94" cy="70" r="4.5" fill="' + K + '"/>' + eye(74, 60) + cheek(72, 70) +
      '<path d="M78 76Q83 79 88 76" fill="none" stroke-width="2.2"/><circle cx="62" cy="50" r="5" fill="#F5D2A8"/>');
  };
  A.bear = function (o) {
    var b = '#9B6235', l = '#E3B98A';
    return wrap(o, '<circle cx="9" cy="46" r="5" fill="' + b + '"/>' +
      '<ellipse cx="40" cy="54" rx="32" ry="22" fill="' + b + '"/>' +
      '<path d="M24 66L22 88L34 88L36 70Z" fill="' + b + '"/><path d="M58 68L60 88L72 88L72 64Z" fill="' + b + '"/>' +
      '<circle cx="64" cy="26" r="7" fill="' + b + '"/><circle cx="64" cy="26" r="3" fill="' + l + '" stroke="none"/>' +
      '<circle cx="73" cy="42" r="19" fill="' + b + '"/><ellipse cx="86" cy="49" rx="10" ry="8" fill="' + l + '"/>' +
      '<ellipse cx="93" cy="46" rx="4" ry="3.2" fill="' + K + '" stroke="none"/><path d="M84 54Q88 57 92 53" fill="none" stroke-width="2.2"/>' +
      eye(76, 38) + cheek(72, 50));
  };
  A.frog = function (o) {
    var g = '#5CC85C';
    return wrap(o, '<ellipse cx="18" cy="82" rx="14" ry="8" fill="' + g + '"/><ellipse cx="82" cy="82" rx="14" ry="8" fill="' + g + '"/>' +
      '<circle cx="32" cy="34" r="13" fill="' + g + '"/><circle cx="68" cy="34" r="13" fill="' + g + '"/>' +
      '<ellipse cx="50" cy="62" rx="33" ry="26" fill="' + g + '"/><ellipse cx="50" cy="72" rx="19" ry="13" fill="#C7F0A0" stroke="none"/>' +
      '<circle cx="32" cy="34" r="8" fill="#fff" stroke="none"/><circle cx="68" cy="34" r="8" fill="#fff" stroke="none"/>' + eye(33, 35, 4.2) + eye(69, 35, 4.2) +
      '<path d="M34 54Q50 66 66 54" fill="none"/>' + cheek(28, 52) + cheek(72, 52) +
      '<ellipse cx="38" cy="89" rx="7" ry="4" fill="' + g + '"/><ellipse cx="62" cy="89" rx="7" ry="4" fill="' + g + '"/>');
  };
  A.mouse = function (o) {
    var c = '#B9C0CC';
    return wrap(o, '<path d="M26 80C8 86 2 70 12 64C18 60 22 68 16 70" fill="none" stroke="#FF9BB0" stroke-width="3"/>' +
      '<ellipse cx="46" cy="88" rx="7" ry="4" fill="' + c + '"/><ellipse cx="64" cy="88" rx="7" ry="4" fill="' + c + '"/>' +
      '<ellipse cx="46" cy="72" rx="26" ry="16" fill="' + c + '"/>' +
      '<circle cx="62" cy="34" r="13" fill="' + c + '"/><circle cx="62" cy="34" r="7.5" fill="#FFB3C1" stroke="none"/>' +
      '<path d="M54 52C58 36 76 38 95 58C84 68 62 70 54 52Z" fill="' + c + '"/>' +
      '<circle cx="94" cy="58" r="4" fill="#FF7E9D" stroke-width="2"/>' + eye(76, 50) + cheek(74, 59) +
      '<path d="M86 60L96 66M84 62L92 70" fill="none" stroke-width="1.6"/>');
  };
  A.ladybug = function (o) {
    var r = '<path d="M30 30L22 18M46 24L46 12M30 76L22 88M46 82L46 94M62 28L70 18M62 78L70 88" fill="none" stroke-width="3.5"/>' +
      '<path d="M84 44Q90 32 96 30M84 60Q90 70 96 72" fill="none" stroke-width="2.5"/><circle cx="96" cy="30" r="3" fill="' + K + '"/><circle cx="96" cy="72" r="3" fill="' + K + '"/>' +
      '<circle cx="76" cy="52" r="15" fill="' + K + '"/>' +
      '<circle cx="44" cy="52" r="33" fill="#F2363D"/><path d="M77 52L11 52" fill="none"/>';
    [[30, 36, 6], [56, 36, 6], [28, 66, 6], [56, 68, 6], [44, 42, 4], [42, 63, 4]].forEach(function (p) { r += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="' + K + '" stroke="none"/>'; });
    r += '<circle cx="84" cy="45" r="4" fill="#fff" stroke="none"/><circle cx="84" cy="59" r="4" fill="#fff" stroke="none"/><circle cx="85.5" cy="45" r="2" fill="' + K + '" stroke="none"/><circle cx="85.5" cy="59" r="2" fill="' + K + '" stroke="none"/>' + shine(28, 30, 4, 7, 50);
    return wrap(o, r);
  };
  A.snail = function (o) {
    var b = '#FFD98A';
    return wrap(o, '<path d="M76 46L72 26M84 46L90 26" fill="none" stroke-width="3"/><circle cx="72" cy="26" r="4.5" fill="' + b + '"/><circle cx="90" cy="26" r="4.5" fill="' + b + '"/>' +
      '<circle cx="72" cy="26" r="2" fill="' + K + '" stroke="none"/><circle cx="90" cy="26" r="2" fill="' + K + '" stroke="none"/>' +
      '<path d="M8 88Q8 80 18 80L70 80L70 56C70 40 92 40 92 56L92 80C92 88 84 90 76 90L14 90Q8 90 8 88Z" fill="' + b + '"/>' +
      eye(82, 58, 3) + smile(84, 66, 7) + cheek(76, 66) +
      '<circle cx="42" cy="54" r="28" fill="#F28C38"/><path d="M42 54C42 48 50 48 50 54C50 62 36 62 36 54C36 42 56 42 56 54C56 68 30 70 28 54C26 36 54 32 62 46" fill="none" stroke="#B85A12" stroke-width="3"/>' +
      '<circle cx="42" cy="54" r="28" fill="none"/>');
  };
  A.turtle = function (o) {
    var s = '#A8D86A';
    return wrap(o, '<path d="M12 70L2 74L12 76Z" fill="' + s + '"/>' +
      '<ellipse cx="26" cy="80" rx="8" ry="10" fill="' + s + '"/><ellipse cx="64" cy="80" rx="8" ry="10" fill="' + s + '"/>' +
      '<path d="M72 64Q74 50 82 48" fill="none" stroke-width="16"/><path d="M72 64Q74 50 82 48" fill="none" stroke="' + s + '" stroke-width="10"/>' +
      '<circle cx="84" cy="46" r="12" fill="' + s + '"/>' + eye(87, 43, 3.2) + smile(88, 51, 6) + cheek(82, 52) +
      '<path d="M10 72C10 30 82 30 82 72Z" fill="#3BAA5C"/>' +
      '<path d="M36 48L46 42L56 48L54 60L38 60Z" fill="#7FD18F"/><path d="M18 64L28 52L36 60L32 70ZM74 64L64 52L56 60L60 70ZM40 64L52 64L54 72L38 72Z" fill="#7FD18F"/>' +
      '<rect x="6" y="68" width="80" height="8" rx="4" fill="#2E8C4A"/>');
  };

  /* ---------------- THINGS ---------------- */
  A.house = function (o) {
    return wrap(o, '<rect x="64" y="14" width="11" height="24" fill="#B5523B"/>' +
      '<rect x="18" y="46" width="64" height="46" fill="#FFD98A"/>' +
      '<path d="M6 50L50 12L94 50Z" fill="#F2453D"/>' +
      '<rect x="56" y="62" width="16" height="30" rx="2" fill="#9C6B3A"/><circle cx="68" cy="78" r="1.8" fill="' + K + '" stroke="none"/>' +
      '<rect x="27" y="58" width="20" height="18" fill="#9FD8FF"/><path d="M37 58L37 76M27 67L47 67" fill="none"/>' +
      '<circle cx="50" cy="36" r="6" fill="#9FD8FF"/>');
  };
  A.tree = function (o) {
    return wrap(o, '<path d="M44 92L46 56L54 56L56 92Q62 94 64 96L36 96Q38 94 44 92Z" fill="#9C6B3A"/>' +
      '<path d="M24 66A15 15 0 0 1 16 40A20 20 0 0 1 38 12A20 20 0 0 1 70 14A18 18 0 0 1 86 40A15 15 0 0 1 76 66Z" fill="#3DBE5E"/>' +
      '<circle cx="34" cy="32" r="6" fill="#7EDB8C" stroke="none"/><circle cx="62" cy="26" r="4" fill="#7EDB8C" stroke="none"/><circle cx="68" cy="50" r="5" fill="#7EDB8C" stroke="none"/><circle cx="40" cy="54" r="3.5" fill="#7EDB8C" stroke="none"/>');
  };
  A.flower = function (o) {
    var c = col(o, 'pink'), ctr = (o && o.color === 'yellow') ? '#FF8A3D' : '#FFD43B', p = '';
    for (var i = 0; i < 6; i++) {
      var a = i * Math.PI / 3 - Math.PI / 2;
      p += '<circle cx="' + (50 + 17 * Math.cos(a)).toFixed(1) + '" cy="' + (36 + 17 * Math.sin(a)).toFixed(1) + '" r="12" fill="' + c + '"/>';
    }
    return wrap(o, tl('M50 50Q47 74 50 96', '#3EA05A', 4) +
      leafG('M49 80Q30 62 22 72Q32 86 49 80Z') + leafG('M51 72Q70 56 78 66Q68 80 51 72Z') +
      p + '<circle cx="50" cy="36" r="11" fill="' + ctr + '"/>' + eye(46, 34, 2.2) + eye(54, 34, 2.2) + smile(50, 39, 5));
  };
  A.sun = function (o) {
    var r = '';
    for (var i = 0; i < 12; i++) {
      var a = i * Math.PI / 6, a1 = a - 0.17, a2 = a + 0.17;
      r += '<path d="M' + (50 + 31 * Math.cos(a1)).toFixed(1) + ' ' + (50 + 31 * Math.sin(a1)).toFixed(1) + 'L' + (50 + 46 * Math.cos(a)).toFixed(1) + ' ' + (50 + 46 * Math.sin(a)).toFixed(1) +
        'L' + (50 + 31 * Math.cos(a2)).toFixed(1) + ' ' + (50 + 31 * Math.sin(a2)).toFixed(1) + 'Z" fill="#FFB020"/>';
    }
    return wrap(o, r + '<circle cx="50" cy="50" r="30" fill="#FFD43B"/>' + eye(41, 45, 3.8) + eye(59, 45, 3.8) + cheek(36, 56) + cheek(64, 56) +
      '<path d="M40 56Q50 66 60 56" fill="none"/>');
  };
  A.star = function (o) {
    var c = col(o, 'yellow');
    return wrap(o, '<path d="' + starPath(50, 54, 46, 21) + '" fill="' + c + '"/>' + shine(38, 40, 3, 6, 30));
  };
  A.cup = function (o) {
    var c = col(o, 'blue');
    return wrap(o, '<ellipse cx="50" cy="86" rx="40" ry="8" fill="' + lt(c, 0.55) + '"/>' +
      tl('M74 44C92 42 92 72 70 72', c, 5) +
      '<path d="M20 32L80 32L74 78Q72 86 64 86L36 86Q28 86 26 78Z" fill="' + c + '"/>' +
      '<circle cx="38" cy="54" r="4" fill="#fff" stroke="none"/><circle cx="56" cy="64" r="4" fill="#fff" stroke="none"/><circle cx="62" cy="46" r="3" fill="#fff" stroke="none"/><circle cx="42" cy="72" r="3" fill="#fff" stroke="none"/>' +
      '<ellipse cx="50" cy="32" rx="30" ry="7" fill="' + lt(c, 0.5) + '"/><ellipse cx="50" cy="33" rx="24" ry="4.5" fill="#A4683A" stroke-width="2"/>' +
      '<path d="M42 22Q38 16 42 10M56 22Q52 16 56 10" fill="none" stroke="#AAB4C8" stroke-width="2.5"/>');
  };
  A.umbrella = function (o) {
    var c = col(o, 'purple'), l = lt(c, 0.4);
    return wrap(o, tl('M50 50L50 84Q50 94 41 94Q34 94 34 87', '#8B5A2B', 4) +
      '<path d="M8 52Q10 12 50 10Q90 12 92 52Q84 44 75 52Q67 44 58 52Q50 44 42 52Q34 44 25 52Q17 44 8 52Z" fill="' + c + '"/>' +
      '<path d="M50 10Q32 24 25 52Q34 44 42 52Q42 26 50 10Z" fill="' + l + '" stroke="none"/><path d="M50 10Q68 24 75 52Q84 44 92 52Q90 22 50 10Z" fill="' + l + '" stroke="none"/>' +
      '<path d="M8 52Q10 12 50 10Q90 12 92 52Q84 44 75 52Q67 44 58 52Q50 44 42 52Q34 44 25 52Q17 44 8 52Z" fill="none"/>' +
      '<path d="M50 10Q32 24 25 52M50 10Q42 26 42 52M50 10Q58 26 58 52M50 10Q68 24 75 52" fill="none" stroke-width="2.5"/>' +
      '<path d="M50 10L50 4" fill="none" stroke-width="4"/>');
  };
  A.hat = function (o) {
    var c = col(o, 'yellow'), band = (o && (o.color === 'red' || o.color === 'pink')) ? '#2F7DE1' : '#FF6B57';
    return wrap(o, '<ellipse cx="50" cy="70" rx="47" ry="17" fill="' + c + '"/>' +
      '<path d="M22 70C22 14 78 14 78 70Q50 80 22 70Z" fill="' + c + '"/>' +
      '<path d="M23 57Q50 66 77 57L78 70Q50 80 22 70Z" fill="' + band + '"/>' +
      '<circle cx="66" cy="64" r="6" fill="#fff"/><circle cx="66" cy="64" r="2.5" fill="#FFC93C" stroke="none"/>' + shine(36, 38, 3.5, 8, 20));
  };
  A.candy = function (o) {
    var c = col(o, 'red'), l = lt(c, 0.4);
    return wrap(o, '<path d="M30 50L6 30Q12 50 6 70Z" fill="' + l + '"/><path d="M70 50L94 30Q88 50 94 70Z" fill="' + l + '"/>' +
      '<path d="M14 40L22 50L14 60M86 40L78 50L86 60" fill="none" stroke-width="2"/>' +
      '<ellipse cx="50" cy="50" rx="24" ry="19" fill="' + c + '"/>' +
      '<path d="M36 36Q44 50 38 66M50 32Q58 50 52 69M63 34Q70 50 64 66" fill="none" stroke="#fff" stroke-width="3.5"/>' +
      '<ellipse cx="50" cy="50" rx="24" ry="19" fill="none"/>');
  };
  A.cake = function (o) {
    var d = 'M16 52L16 60';
    var xs = [16, 25, 34, 43, 52, 61, 70, 79, 84];
    for (var i = 1; i < xs.length; i++) d += 'Q' + ((xs[i - 1] + xs[i]) / 2) + ' ' + (i % 2 ? 70 : 66) + ' ' + xs[i] + ' ' + (i === xs.length - 1 ? 60 : 61);
    d += 'L84 52Z';
    return wrap(o, '<ellipse cx="50" cy="86" rx="44" ry="8" fill="#E8EEF6"/>' +
      '<path d="M16 52L16 80Q50 94 84 80L84 52" fill="#FFE6B3"/>' +
      '<path d="M16 72Q50 84 84 72" fill="none" stroke="#F2A65A" stroke-width="3"/>' +
      '<path d="' + d + '" fill="#FF9EC4"/><ellipse cx="50" cy="52" rx="34" ry="11" fill="#FF9EC4"/>' +
      '<circle cx="30" cy="50" r="4.5" fill="#F2363D"/><circle cx="70" cy="50" r="4.5" fill="#F2363D"/>' +
      '<rect x="46" y="24" width="8" height="26" rx="2" fill="#7FC8FF"/><path d="M46 32L54 28M46 40L54 36M46 48L54 44" fill="none" stroke="#fff" stroke-width="2"/>' +
      '<path d="M50 6Q58 16 50 22Q42 16 50 6Z" fill="#FFB020" stroke-width="2.5"/>');
  };
  A.leaf = function (o) {
    var c = col(o, 'green');
    return wrap(o, '<path d="M20 82L8 94" fill="none" stroke-width="4"/>' +
      '<path d="M20 82C12 44 44 12 90 10C90 54 60 88 20 82Z" fill="' + c + '"/>' +
      '<path d="M20 82Q50 52 82 18M40 60L36 40M52 48L50 28M42 60L62 62M54 48L74 48" fill="none" stroke="' + dk(c, 0.35) + '" stroke-width="2.5"/>');
  };
  A.sock = function (o) {
    var c = col(o, 'red'), l = lt(c, 0.5);
    return wrap(o, '<path d="M30 8L66 8L66 52L84 64C96 72 94 92 80 92C72 92 54 84 40 76C28 70 30 60 30 54Z" fill="' + c + '"/>' +
      '<path d="M76 60C88 64 96 78 86 89C82 92 76 92 70 89C76 80 78 70 76 60Z" fill="' + l + '" stroke="none"/>' +
      '<path d="M30 58C30 70 38 74 48 72C44 66 44 60 46 56Z" fill="' + l + '" stroke="none"/>' +
      '<path d="M30 8L66 8L66 52L84 64C96 72 94 92 80 92C72 92 54 84 40 76C28 70 30 60 30 54Z" fill="none"/>' +
      '<rect x="28" y="6" width="40" height="16" rx="3" fill="#fff"/><path d="M28 14L68 14" fill="none" stroke="' + c + '" stroke-width="3.5"/>' +
      '<path d="M30 34L66 34M30 42L66 42" fill="none" stroke="#fff" stroke-width="3.5"/>');
  };
  A.table = function (o) {
    var w = WOOD, t = '#E8B47A', d = '#A56D36';
    return wrap(o, '<rect x="82" y="36" width="7" height="46" rx="2" fill="' + d + '"/><rect x="26" y="38" width="7" height="40" rx="2" fill="' + d + '"/>' +
      '<rect x="12" y="44" width="9" height="48" rx="2" fill="' + w + '"/><rect x="66" y="44" width="9" height="48" rx="2" fill="' + w + '"/>' +
      '<path d="M6 38L26 24L94 24L76 38Z" fill="' + t + '"/><path d="M76 38L94 24L94 32L76 46Z" fill="' + d + '"/>' +
      '<rect x="6" y="38" width="70" height="8" fill="' + w + '"/>');
  };
  A.chair = function (o) {
    var w = WOOD, t = '#E8B47A', d = '#A56D36';
    return wrap(o, '<rect x="30" y="62" width="6" height="22" rx="2" fill="' + d + '"/><rect x="64" y="62" width="6" height="22" rx="2" fill="' + d + '"/>' +
      '<rect x="26" y="6" width="8" height="52" rx="2" fill="' + w + '"/><rect x="66" y="6" width="8" height="52" rx="2" fill="' + w + '"/>' +
      '<rect x="24" y="10" width="52" height="12" rx="4" fill="' + t + '"/><rect x="32" y="30" width="36" height="8" rx="3" fill="' + t + '"/>' +
      '<path d="M24 52L76 52L84 62L16 62Z" fill="' + t + '"/><rect x="16" y="62" width="68" height="7" fill="' + w + '"/>' +
      '<rect x="17" y="69" width="8" height="25" rx="2" fill="' + w + '"/><rect x="75" y="69" width="8" height="25" rx="2" fill="' + w + '"/>');
  };
  A.box = function (o) {
    var part = o && o.part;
    var back = '<path d="M28 32L32 8L92 8L90 32Z" fill="#F0BE80"/>' +
      '<path d="M10 44L28 32L14 14L0 26Z" fill="#F0BE80"/>' +
      '<path d="M10 44L28 32L90 32L72 44Z" fill="#8A5A2B"/>';
    var front = '<path d="M72 44L90 32L90 80L72 92Z" fill="#C88A44"/>' +
      '<path d="M72 44L90 32L99 50L82 60Z" fill="#F0BE80"/>' +
      '<rect x="10" y="44" width="62" height="48" fill="' + CARD + '"/>' +
      '<path d="M41 44L41 66" fill="none" stroke="#C88A44" stroke-width="5"/><path d="M20 82L34 82" fill="none" stroke="#C88A44" stroke-width="2.5"/>';
    if (part === 'back') return wrap(o, back);
    if (part === 'front') return wrap(o, front);
    return wrap(o, back + front);
  };
  A.basket = function (o) {
    var r = tl('M18 48C16 2 84 2 82 48', '#C98B4E', 5) +
      '<path d="M10 52L90 52L80 92L20 92Z" fill="#E2A964"/>';
    r += '<path d="M14 64L86 64M17 76L83 76" fill="none" stroke="#A56D36" stroke-width="2.5"/>';
    for (var x = 24; x <= 76; x += 13) r += '<path d="M' + x + ' 54L' + (x + (50 - x) * 0.12).toFixed(1) + ' 90" fill="none" stroke="#A56D36" stroke-width="2.5"/>';
    r += '<path d="M10 52L90 52L80 92L20 92Z" fill="none"/><rect x="6" y="44" width="88" height="11" rx="5.5" fill="#B57A3E"/>';
    return wrap(o, r);
  };

  /* ---------------- SHAPES ---------------- */
  A.shape = function (kind, color, filled) {
    if (filled === undefined) filled = true;
    var c = filled ? (COLORS[color] || color || COLORS.blue) : '#fff', s;
    var sw = ' stroke-width="3.5"';
    switch (kind) {
      case 'circle': s = '<circle cx="50" cy="50" r="40" fill="' + c + '"' + sw + '/>'; break;
      case 'square': s = '<rect x="13" y="13" width="74" height="74" rx="3" fill="' + c + '"' + sw + '/>'; break;
      case 'triangle': s = '<path d="M50 10L92 84L8 84Z" fill="' + c + '"' + sw + '/>'; break;
      case 'rect': s = '<rect x="6" y="24" width="88" height="52" rx="3" fill="' + c + '"' + sw + '/>'; break;
      case 'oval': s = '<ellipse cx="50" cy="50" rx="44" ry="29" fill="' + c + '"' + sw + '/>'; break;
      case 'star': s = '<path d="' + starPath(50, 54, 46, 20) + '" fill="' + c + '"' + sw + '/>'; break;
      case 'heart': s = '<path d="M50 88C16 66 4 46 10 30C16 14 40 10 50 28C60 10 84 14 90 30C96 46 84 66 50 88Z" fill="' + c + '"' + sw + '/>'; break;
      case 'diamond': s = '<path d="M50 6L88 50L50 94L12 50Z" fill="' + c + '"' + sw + '/>'; break;
      default: s = '';
    }
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="' + K + '" stroke-linejoin="round" stroke-linecap="round">' + s + '</g></svg>';
  };

  window.ART = A;
  window.ART_COLORS = COLORS;
  window.ART_LIST = {
    fruit: ['apple', 'pear', 'banana', 'orange', 'strawberry', 'cherry', 'carrot', 'mushroom', 'tomato', 'grapes'],
    toy: ['ball', 'car', 'teddy', 'balloon', 'kite', 'drum', 'pyramid', 'boat', 'block', 'doll'],
    animal: ['cat', 'dog', 'rabbit', 'duck', 'chicken', 'fish', 'bird', 'butterfly', 'bee', 'hedgehog', 'bear', 'frog', 'mouse', 'ladybug', 'snail', 'turtle'],
    thing: ['house', 'tree', 'flower', 'sun', 'star', 'cup', 'umbrella', 'hat', 'candy', 'cake', 'leaf', 'sock', 'table', 'chair', 'box', 'basket']
  };
  window.ART_NAME = {
    apple: 'quả táo', pear: 'quả lê', banana: 'quả chuối', orange: 'quả cam', strawberry: 'quả dâu tây', cherry: 'quả anh đào',
    carrot: 'củ cà rốt', mushroom: 'cây nấm', tomato: 'quả cà chua', grapes: 'chùm nho',
    ball: 'quả bóng', car: 'chiếc ô tô', teddy: 'con gấu bông', balloon: 'quả bóng bay', kite: 'con diều', drum: 'cái trống',
    pyramid: 'cái tháp vòng', boat: 'chiếc thuyền', block: 'khối gỗ', doll: 'con búp bê',
    cat: 'con mèo', dog: 'con chó', rabbit: 'con thỏ', duck: 'con vịt', chicken: 'con gà', fish: 'con cá', bird: 'con chim',
    butterfly: 'con bướm', bee: 'con ong', hedgehog: 'con nhím', bear: 'con gấu', frog: 'con ếch', mouse: 'con chuột',
    ladybug: 'con bọ rùa', snail: 'con ốc sên', turtle: 'con rùa',
    house: 'ngôi nhà', tree: 'cây xanh', flower: 'bông hoa', sun: 'ông mặt trời', star: 'ngôi sao', cup: 'cái cốc',
    umbrella: 'cái ô', hat: 'cái mũ', candy: 'cái kẹo', cake: 'chiếc bánh kem', leaf: 'chiếc lá', sock: 'chiếc tất',
    table: 'cái bàn', chair: 'cái ghế', box: 'cái hộp', basket: 'cái giỏ'
  };
  window.ART_UNIT = {};
  Object.keys(window.ART_NAME).forEach(function (k) { window.ART_UNIT[k] = window.ART_NAME[k].split(' ')[0]; });
})();
