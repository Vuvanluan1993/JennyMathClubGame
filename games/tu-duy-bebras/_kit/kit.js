/* Bộ khung chung cho các game "Tư duy Bebras".
   Một game chỉ cần gọi Kit.run({...}) với:
     key      : khoá lưu tiến độ (vd "bb-robot")
     title    : tên game
     intro    : 1 câu giới thiệu trên màn mở đầu
     rules    : mảng các dòng luật chơi (HTML ngắn)
     levels   : [{name:'Dễ', desc:'...'}, {name:'Vừa',...}, {name:'Khó',...}]
     rounds   : số màn mỗi ván (mặc định 10)
     make(level, round)  -> đề mới (đối tượng JSON, lưu được)
     mount(ctx)          -> vẽ đề vào ctx.play / ctx.controls, gọi ctx.win(sao, lời khen) khi xong
     hint(ctx)           -> (tuỳ chọn) đưa 1 gợi ý, trả về true nếu đã gợi ý
     onKey(e, ctx)       -> (tuỳ chọn) xử lý bàn phím
   Bộ khung lo: thanh trên, màn mở đầu / tạm dừng / kết thúc, đếm màn và sao, đồng hồ, gợi ý,
   âm thanh, pháo giấy, lưu tiến độ, Jenny nói chuyện và co giãn vừa 1 màn hình. */
(function () {
  'use strict';
  const HOME = '../../../';
  const LOGO = '../../../assets/jenny-logo.png';
  const HINTS = 3;
  const q = (s, r = document) => r.querySelector(s);
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  const JENNY = '<svg class="jsvg" viewBox="0 0 120 140" aria-hidden="true" stroke="#1D2B53" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M22 70 Q14 28 60 18 Q106 28 98 70 Q101 90 93 101 L84 97 Q88 82 86 66 L34 66 Q32 82 36 97 L27 101 Q19 90 22 70 Z" fill="#2B1E1A"/>'
    + '<ellipse cx="60" cy="63" rx="26" ry="29" fill="#FFDCC2"/>'
    + '<path d="M34 58 Q38 32 64 31 Q86 33 87 56 Q78 45 66 46 Q60 38 50 47 Q42 47 34 58 Z" fill="#2B1E1A"/>'
    + '<ellipse cx="50" cy="65" rx="3.2" ry="4.2" fill="#1D2B53"/><ellipse cx="70" cy="65" rx="3.2" ry="4.2" fill="#1D2B53"/>'
    + '<circle cx="51" cy="63.5" r="1" fill="#fff" stroke="none"/><circle cx="71" cy="63.5" r="1" fill="#fff" stroke="none"/>'
    + '<ellipse cx="42" cy="75" rx="4.5" ry="2.6" fill="#FF9E8C" stroke="none"/><ellipse cx="78" cy="75" rx="4.5" ry="2.6" fill="#FF9E8C" stroke="none"/>'
    + '<path class="m-norm" d="M52 78 q8 7 16 0" fill="none"/><path class="m-happy" d="M50 77 q10 13 20 0 z" fill="#B3261E"/><ellipse class="m-oops" cx="60" cy="81" rx="3.4" ry="4" fill="#B3261E"/>'
    + '<path d="M54 91 v7 M66 91 v7" fill="none"/>'
    + '<path d="M22 124 L34 104 Q44 99 54 98 Q60 103 66 98 Q76 99 86 104 L98 124 L88 128 L86 121 L86 139 L34 139 L34 121 L32 128 Z" fill="#8E6BD8"/>'
    + '<path d="M40 103 L82 131" stroke="#7A4B2A" stroke-width="3.4" fill="none"/><rect x="78" y="127" width="15" height="11" rx="3" fill="#D9A066"/></svg>';
  const ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
    snd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/></svg>',
    mus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    bulb: '<svg viewBox="0 0 24 26" fill="none" stroke="#1D2B53" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 17.5c0-2-3-3.6-3-7.5a7 7 0 0 1 14 0c0 3.9-3 5.5-3 7.5z" fill="#fff"/><path d="M9 21h6M10 24h4"/></svg>',
    star: (on = true) => `<svg viewBox="0 0 24 24" class="${on ? '' : 'dim'}" fill="currentColor" stroke="#1D2B53" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5l2.9 6.2 6.6.7-5 4.5 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z"/></svg>`,
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ---------- sound ---------- */
  let AC = null, sfxOn = true, musOn = false, musTimer = null;
  function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
  function tone(f, dur = .12, type = 'triangle', vol = .16, when = 0, glide = 0) {
    const a = ac(); if (!a || !sfxOn) return; const t = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  const sfx = {
    tap() { tone(880, .05, 'sine', .07); },
    move(i = 0) { tone(520 + (i % 8) * 40, .07, 'square', .04); },
    good() { [523, 659, 784].forEach((f, i) => tone(f, .14, 'triangle', .14, i * .07)); },
    bad() { tone(196, .16, 'sawtooth', .08); tone(147, .22, 'sawtooth', .08, .14); },
    hint() { tone(660, .35, 'sine', .11, 0, 1760); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, .18, 'triangle', .16, i * .09)); },
    finale() { [523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, .22, 'triangle', .16, i * .13)); [262, 330, 392].forEach(f => tone(f, 1.1, 'sine', .06, .9)); }
  };
  const MEL = [392, 440, 523, 587, 659, 587, 523, 440, 392, 523, 659, 784, 659, 523, 440, 392];
  function music(on) {
    musOn = on; document.querySelectorAll('.mus').forEach(b => b.classList.toggle('off', !on));
    clearInterval(musTimer); if (!on) return;
    let i = 0; musTimer = setInterval(() => { if (document.hidden || !sfxOn) return; tone(MEL[i % MEL.length], .32, 'sine', .03); if (i % 4 === 0) tone(MEL[i % MEL.length] / 2, .6, 'triangle', .025); i++; }, 360);
  }

  /* ---------- confetti ---------- */
  let fx, fctx, parts = [], fxRun = false;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sizeFx() { if (!fx) return; fx.width = innerWidth * devicePixelRatio; fx.height = innerHeight * devicePixelRatio; }
  function burst(x, y, n = 28, spread = 1) {
    if (RM || !fx) return; const cols = ['#FFC93C', '#FF6B57', '#2DBE8C', '#2F7DE1', '#8E6BD8'], d = devicePixelRatio;
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = (2 + Math.random() * 5) * spread;
      parts.push({ x: x * d, y: y * d, vx: Math.cos(a) * v * d, vy: (Math.sin(a) * v - 3) * d, s: (4 + Math.random() * 5) * d, c: cols[i % 5], r: Math.random() * 6, life: 60 + Math.random() * 40 }); }
    if (!fxRun) { fxRun = true; requestAnimationFrame(stepFx); }
  }
  function stepFx() {
    fctx.clearRect(0, 0, fx.width, fx.height); parts = parts.filter(p => p.life > 0);
    for (const p of parts) { p.x += p.vx; p.y += p.vy; p.vy += .18 * devicePixelRatio; p.vx *= .99; p.r += .15; p.life--;
      fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.r); fctx.fillStyle = p.c; fctx.globalAlpha = Math.min(1, p.life / 30); fctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .66); fctx.restore(); }
    if (parts.length) requestAnimationFrame(stepFx); else { fxRun = false; fctx.clearRect(0, 0, fx.width, fx.height); }
  }
  function burstAt(el, n, spread) { if (!el) return; const r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, n, spread); }
  function rain() { for (let i = 0; i < 8; i++) setTimeout(() => burst(Math.random() * innerWidth, -10, 30, 1.3), i * 170); }

  /* ---------- the game controller ---------- */
  function run(cfg) {
    const ROUNDS = cfg.rounds || 10;
    let S = null, paused = true, timer = null, ctx = null;

    /* DOM */
    document.title = cfg.title + ' – Học Toán cùng Jenny';
    const app = h('div', 'app');
    app.innerHTML = `
      <header class="bar">
        <a href="${HOME}" title="Về trang chủ" style="display:contents"><img class="logo" src="${LOGO}" alt="Học Toán cùng Jenny"></a>
        <div class="ttl">${cfg.title}<small id="kSub">Tư duy Bebras</small></div>
        <div class="spacer"></div>
        <div class="pill pround" title="Màn"><span class="lab">Màn</span><span class="val" id="kRound">1/${ROUNDS}</span></div>
        <div class="pill" title="Số sao" style="color:#FFC93C">${ICON.star()}<span class="val" id="kStars" style="color:#1D2B53">0</span></div>
        <div class="pill" title="Thời gian"><span class="lab">Giờ</span><span class="val" id="kTime">00:00</span></div>
        <span id="kBulbs" style="display:flex;gap:4px"></span>
        <a class="ib" href="${HOME}" aria-label="Về trang chủ" title="Về trang chủ">${ICON.home}</a>
        <button class="ib" id="kSnd" aria-label="Bật/tắt âm thanh">${ICON.snd}</button>
        <button class="ib mus off" id="kMus" aria-label="Bật/tắt nhạc nền">${ICON.mus}</button>
        <button class="ib" id="kPause" aria-label="Tạm dừng">${ICON.pause}</button>
      </header>
      <main class="stage">
        <section class="play" id="play" aria-label="Vùng chơi"></section>
        <section class="side">
          <div class="card" id="kCard">
            <div class="head" id="kTags"></div>
            <div class="mission" id="kMission"></div>
            <div class="say-line">${JENNY}<span id="kSay2"></span></div>
          </div>
          <div class="controls" id="controls"></div>
          <div class="jrow"><div class="bubble" id="kSay"></div>${JENNY}</div>
        </section>
      </main>`;
    document.body.appendChild(app);
    fx = h('canvas'); fx.id = 'fx'; document.body.appendChild(fx); fctx = fx.getContext('2d'); sizeFx(); addEventListener('resize', sizeFx);

    const lvBtns = cfg.levels.map((l, i) => `<button class="lvbtn l${i}" data-lv="${i}"><b>${l.name}</b><span>${l.desc}</span></button>`).join('');
    const ovStart = h('div', 'ov'); ovStart.id = 'kStart';
    ovStart.innerHTML = `<div class="panel">${JENNY}<h2>${cfg.title}</h2><p>${cfg.intro}</p><ul>${cfg.rules.map(r => `<li>${r}</li>`).join('')}</ul>
      <div class="levels">${lvBtns}</div>
      <div class="btnrow"><button class="big" id="kResume" hidden>Chơi tiếp ván cũ</button><a class="big alt" href="${HOME}">${ICON.home}Trang chủ</a></div></div>`;
    const ovPause = h('div', 'ov'); ovPause.id = 'kPauseOv'; ovPause.hidden = true;
    ovPause.innerHTML = `<div class="panel"><h2>Tạm dừng</h2><p>Đồng hồ đang dừng. Bấm tiếp tục khi em sẵn sàng.</p>
      <div class="btnrow"><button class="big" id="kGo">Tiếp tục</button><button class="big alt" id="kNew">Ván mới</button><a class="big alt" href="${HOME}">${ICON.home}Trang chủ</a></div></div>`;
    const ovRound = h('div', 'ov'); ovRound.id = 'kRoundOv'; ovRound.hidden = true;
    ovRound.innerHTML = `<div class="panel" style="max-width:440px"><h2 id="kRT">Giỏi quá!</h2><div class="stars" id="kRS"></div><p id="kRM"></p>
      <div class="btnrow"><button class="big" id="kNext">Màn tiếp ${ICON.next}</button></div></div>`;
    const ovEnd = h('div', 'ov'); ovEnd.id = 'kEnd'; ovEnd.hidden = true;
    document.body.append(ovStart, ovPause, ovRound, ovEnd);

    /* state */
    function fresh(lv) { return { kit: 1, lv, r: 0, stars: [], sec: 0, hints: HINTS, hintRound: 0, puzzle: null, rs: null, done: false }; }
    function save() { try { localStorage.setItem(cfg.key, JSON.stringify(S)); } catch (e) {} }
    function load() { try { const v = JSON.parse(localStorage.getItem(cfg.key)); return v && v.kit && cfg.levels[v.lv] ? v : null; } catch (e) { return null; } }
    const total = () => S.stars.reduce((a, b) => a + (b || 0), 0);
    const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

    /* Jenny */
    let moodT;
    function say(msg, mood) {
      q('#kSay').textContent = msg; q('#kSay2').textContent = msg;
      document.querySelectorAll('.app .jsvg').forEach(j => { j.classList.remove('happy', 'oops', 'bounce'); void j.offsetWidth; if (mood) j.classList.add(mood); if (mood === 'happy') j.classList.add('bounce'); });
      clearTimeout(moodT); moodT = setTimeout(() => document.querySelectorAll('.app .jsvg').forEach(j => j.classList.remove('happy', 'oops', 'bounce')), 2200);
      fit();
    }

    /* bar */
    function bar() {
      q('#kRound').textContent = Math.min(S.r + 1, ROUNDS) + '/' + ROUNDS;
      q('#kStars').textContent = total();
      q('#kTime').textContent = fmt(S.sec);
      q('#kSub').textContent = 'Mức ' + cfg.levels[S.lv].name + ' · ' + cfg.levels[S.lv].desc;
      const b = q('#kBulbs'); b.innerHTML = '';
      if (cfg.hint) {
        const btn = h('button', 'ib bulb' + (S.hints <= 0 ? ' used' : ''), ICON.bulb + `<i class="cnt">${S.hints}</i>`);
        btn.setAttribute('aria-label', 'Gợi ý của Jenny (còn ' + S.hints + ' lần)'); btn.title = 'Gợi ý (còn ' + S.hints + ' lần, mỗi lần bớt 1 sao)';
        btn.disabled = S.hints <= 0; btn.onclick = useHint; b.appendChild(btn);
      }
    }
    function useHint() {
      if (!S || S.done || paused || S.hints <= 0 || !cfg.hint) return;
      if (cfg.hint(ctx)) { S.hints--; S.hintRound++; sfx.hint(); bar(); save(); }
    }

    /* rounds */
    function newRound() {
      S.puzzle = cfg.make(S.lv, S.r); S.rs = null; S.hintRound = 0; save(); mountRound();
    }
    function mountRound() {
      const play = q('#play'), controls = q('#controls');
      play.innerHTML = ''; controls.innerHTML = ''; q('#kMission').innerHTML = '';
      const tags = q('#kTags'); tags.innerHTML = `<span class="tag lv">Mức ${cfg.levels[S.lv].name}</span><span class="tag">Màn ${S.r + 1}/${ROUNDS}</span>`;
      let solved = false;
      ctx = {
        puzzle: S.puzzle, level: S.lv, round: S.r, state: S.rs, play, controls,
        mission(html) { q('#kMission').innerHTML = html; fit(); },
        tag(html) { const t = h('span', 'tag', html); tags.appendChild(t); return t; },
        say, sfx, burst: burstAt, fit,
        save(st) { S.rs = st; save(); },
        hintsUsedThisRound: () => S.hintRound,
        win(stars, msg) {
          if (solved) return; solved = true;
          const st = Math.max(1, Math.min(3, stars) - S.hintRound);
          S.stars[S.r] = st; S.rs = null; save(); bar();
          sfx.win(); burstAt(play, 40, 1.1); say(msg || 'Giỏi quá!', 'happy');
          setTimeout(() => showRound(st, msg), 750);
        }
      };
      cfg.mount(ctx);
      bar(); fit();
    }
    function showRound(st, msg) {
      q('#kRT').textContent = st === 3 ? 'Tuyệt vời!' : st === 2 ? 'Giỏi lắm!' : 'Hoàn thành!';
      q('#kRS').innerHTML = [0, 1, 2].map(i => ICON.star(i < st)).join('');
      q('#kRM').textContent = msg || '';
      q('#kNext').innerHTML = (S.r + 1 >= ROUNDS ? 'Xem kết quả ' : 'Màn tiếp ') + ICON.next;
      paused = true; ovRound.hidden = false; q('#kNext').focus();
    }
    q('#kNext').onclick = () => {
      ovRound.hidden = true; sfx.tap();
      S.r++; if (S.r >= ROUNDS) { finish(); return; }
      paused = false; newRound();
    };
    function finish() {
      S.done = true; save(); paused = true;
      const t = total(), max = ROUNDS * 3, rate = t >= max * .8 ? 3 : t >= max * .5 ? 2 : 1;
      sfx.finale(); rain();
      ovEnd.innerHTML = `<div class="panel">${JENNY}<h2>Hoàn thành ván chơi!</h2><p>Em đã giải xong ${ROUNDS} màn ở mức <b>${cfg.levels[S.lv].name}</b>.</p>
        <div class="stars">${[0, 1, 2].map(i => ICON.star(i < rate)).join('')}</div>
        <div class="kpis"><div><b>${t}/${max}</b><span>Sao</span></div><div><b>${fmt(S.sec)}</b><span>Thời gian</span></div><div><b>${HINTS - S.hints}</b><span>Gợi ý đã dùng</span></div></div>
        <div class="btnrow"><button class="big" id="kAgain">Ván mới</button><button class="big alt" id="kLv">Đổi mức</button><a class="big alt" href="${HOME}">${ICON.home}Trang chủ</a></div>
        <p class="note">${rate === 3 ? 'Xuất sắc! Thử mức khó hơn nhé.' : 'Chơi lại để lấy thêm sao nhé!'}</p></div>`;
      ovEnd.hidden = false;
      q('#kAgain').onclick = () => { ovEnd.hidden = true; begin(fresh(S.lv)); };
      q('#kLv').onclick = () => { ovEnd.hidden = true; showStart(); };
    }

    /* start / pause */
    function begin(st) {
      S = st; ovStart.hidden = true; ac(); paused = false;
      if (S.puzzle) mountRound(); else newRound();
      say(S.r === 0 && !S.rs ? cfg.hello || 'Chào em! Cùng bắt đầu nhé.' : 'Chào mừng em quay lại! Chơi tiếp nhé.', 'happy');
      clearInterval(timer);
      timer = setInterval(() => { if (paused || !S || S.done) return; S.sec++; q('#kTime').textContent = fmt(S.sec); if (S.sec % 10 === 0) save(); }, 1000);
    }
    function showStart() {
      const sv = load(); q('#kResume').hidden = !(sv && !sv.done);
      ovStart.hidden = false; paused = true;
    }
    ovStart.querySelectorAll('.lvbtn').forEach(b => b.onclick = () => { sfx.tap(); begin(fresh(+b.dataset.lv)); });
    q('#kResume').onclick = () => { const sv = load(); if (sv) begin(sv); };
    q('#kPause').onclick = () => { if (!S || S.done) return; paused = true; ovPause.hidden = false; save(); };
    q('#kGo').onclick = () => { ovPause.hidden = true; paused = false; };
    q('#kNew').onclick = () => { ovPause.hidden = true; showStart(); };
    q('#kSnd').onclick = () => { sfxOn = !sfxOn; q('#kSnd').classList.toggle('off', !sfxOn); if (sfxOn) sfx.tap(); };
    q('#kMus').onclick = () => { ac(); music(!musOn); };
    addEventListener('keydown', e => {
      if (!ovStart.hidden || !ovPause.hidden || !ovEnd.hidden) return;
      if (!ovRound.hidden) { if (e.key === 'Enter') { q('#kNext').click(); e.preventDefault(); } return; }
      if (cfg.onKey && ctx) cfg.onKey(e, ctx);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && S) save(); });

    /* fit to one screen */
    const root = document.documentElement;
    function fitSide() {
      const side = q('.side'), play = q('#play'), mission = q('#kMission');
      root.classList.remove('tight'); mission.style.fontSize = '';
      const tall = innerWidth <= innerHeight;
      const ok = () => side.scrollHeight <= side.clientHeight + 1 && root.scrollHeight <= innerHeight + 1
        && play.clientHeight >= innerHeight * (tall ? .36 : .5);
      if (ok()) return;
      root.classList.add('tight');
      let fs = parseFloat(getComputedStyle(mission).fontSize);
      while (!ok() && fs > 11.5) { fs -= .5; mission.style.fontSize = fs + 'px'; }
    }
    function fitPanels() {
      document.querySelectorAll('.ov:not([hidden]) .panel').forEach(p => {
        p.style.transform = '';
        const r = p.getBoundingClientRect();
        const s = Math.min(1, (innerHeight - 20) / r.height, (innerWidth - 20) / r.width);
        if (s >= 1 && r.top >= 0) return;
        p.style.transformOrigin = 'top center';
        p.style.transform = `translateY(${((innerHeight - r.height * s) / 2 - r.top).toFixed(1)}px) scale(${s.toFixed(3)})`;
      });
    }
    let fitQueued = false;
    function fit() {
      if (fitQueued) return; fitQueued = true;
      requestAnimationFrame(() => { fitQueued = false; fitSide(); if (cfg.layout && ctx) cfg.layout(ctx); fitPanels(); });
    }
    addEventListener('resize', fit); addEventListener('orientationchange', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    document.querySelectorAll('.ov').forEach(o => new MutationObserver(fit).observe(o, { attributes: true, attributeFilter: ['hidden'], childList: true, subtree: true }));

    /* first paint: an easy round behind the start panel */
    S = fresh(0); S.puzzle = cfg.make(0, 0); mountRound(); S = null;
    say(cfg.hello || 'Chọn mức độ để bắt đầu nhé!');
    showStart(); fit();
    window.__kit = { get state() { return S; }, get ctx() { return ctx; }, finish: () => finish() };
  }

  window.Kit = { run, sfx, burst: burstAt, JENNY, ICON };
})();
