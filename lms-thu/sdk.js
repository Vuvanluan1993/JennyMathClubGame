// Phần dùng chung cho học sinh và game: gọi hàm trên Supabase, giữ phiên học sinh.
import { SUPA_URL, SUPA_KEY } from './config.js';

const TK = 'jl-token';
export function token() { try { return localStorage.getItem(TK); } catch (e) { return null; } }
export function setToken(t) { try { t ? localStorage.setItem(TK, t) : localStorage.removeItem(TK); } catch (e) {} }

// bản xem thử: ?demo=1 bật, ?demo=0 tắt; dữ liệu chạy ngay trong trình duyệt (demo.js)
try { const q = new URLSearchParams(location.search).get('demo'); if (q === '1') localStorage.setItem('jl-demo', '1'); if (q === '0') localStorage.removeItem('jl-demo'); } catch (e) {}
export function isDemo() { try { return localStorage.getItem('jl-demo') === '1'; } catch (e) { return false; } }

export async function rpc(fn, args) {
  if (isDemo()) return (await import('./demo.js')).rpc(fn, args, null);
  let r;
  try {
    r = await fetch(`${SUPA_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(args || {})
    });
  } catch (e) { throw new Error('Không kết nối được máy chủ. Kiểm tra mạng nhé.'); }
  const t = await r.text();
  let j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
  if (!r.ok) {
    const err = new Error((j && j.message) || 'Lỗi máy chủ (' + r.status + ')');
    err.code = j && j.code; throw err;
  }
  return j;
}

// game gọi hàm này khi học sinh làm xong bài được giao
export function submit(assignment, res) {
  const t = token();
  if (!t) return Promise.reject(new Error('con chưa đăng nhập lớp'));
  return rpc('s_submit', {
    p_token: t, p_assignment: assignment,
    p_stars: res.stars | 0, p_correct: res.correct | 0, p_total: res.total | 0, p_seconds: res.seconds | 0,
    p_answers: (res.answers || []).slice(0, 50)
  });
}

// danh mục game có thể giao (đường dẫn tính từ thư mục lms-thu/)
export const GAMES = {
  'mam-non': {
    name: 'Hành trình Mầm non',
    isles: ['Đảo Hình và Màu', 'Đảo Đếm Số', 'Đảo Cộng Trừ', 'Đảo Bài Toán', 'Đảo Thứ Tự và Giờ', 'Đảo Phương Hướng'],
    levels: 8,
    url: a => `../games/hanh-trinh-jenny/mam-non/index.html?lms=${a.id}&isle=${(a.config && a.config.isle) | 0}&lv=${(a.config && a.config.lv) | 0}`
  },
  'tham-tu': {
    name: 'Jenny Thám Tử Nhí',
    isles: ['Khu Mê Cung', 'Khu Dây Rối', 'Khu Mảnh Ghép', 'Khu Cái Bóng', 'Khu Chỗ Sai', 'Khu Đếm Hình', 'Khu Quy Luật', 'Khu Nối Điểm', 'Khu Đồng Hồ', 'Khu Toán Vui'],
    levels: 8,
    url: a => `../games/hanh-trinh-jenny/tham-tu/index.html?lms=${a.id}&isle=${(a.config && a.config.isle) | 0}&lv=${(a.config && a.config.lv) | 0}`
  }
};
export function gameLabel(game, config) {
  const g = GAMES[game]; if (!g) return game || 'Game';
  return `${g.isles[(config && config.isle) | 0] || ''} · Màn ${((config && config.lv) | 0) + 1}`;
}

// mã bí mật hình cho mầm non (a–f)
export const SHAPES = {
  a: ['Tròn', '#F25C54', '<circle cx="20" cy="20" r="15"/>'],
  b: ['Vuông', '#3A86FF', '<rect x="6" y="6" width="28" height="28" rx="4"/>'],
  c: ['Tam giác', '#F4B400', '<path d="M20 4 37 34H3z"/>'],
  d: ['Sao', '#FF8C42', '<path d="m20 3 5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"/>'],
  e: ['Tim', '#E85D9A', '<path d="M20 35S4 25 4 14a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 11-16 21-16 21z"/>'],
  f: ['Trăng', '#8E6CEF', '<path d="M27 4a16 16 0 1 0 9 26A14 14 0 0 1 27 4z"/>']
};
export function shapeSvg(k, size = 36) {
  const s = SHAPES[k]; if (!s) return '';
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" role="img" aria-label="${s[0]}"><g fill="${s[1]}" stroke="#2B2D42" stroke-width="2" stroke-linejoin="round">${s[2]}</g></svg>`;
}
export function pinHtml(pin, size = 28) {
  if (/^[a-f]+$/.test(pin)) return [...pin].map(k => shapeSvg(k, size)).join('');
  return `<b class="digits">${pin}</b>`;
}
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
