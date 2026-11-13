/* Khôi phục mã sao lưu an toàn (P-19) — dùng chung cho mọi bản Hành trình của Jenny (lớp 6, tiểu học, mầm non, thám tử).
   khoiPhucAnToan(o, fresh): bắt đầu từ fresh() rồi chỉ chép các khoá có sẵn trong đó, đúng kiểu dữ liệu;
   bỏ __proto__ / constructor / prototype ở mọi tầng (trước đây Object.assign(fresh(), o) chép mọi khoá trong mã dán vào). */
(function () {
  'use strict';
  const CAM = new Set(['__proto__', 'constructor', 'prototype']);
  function sach(v, sau) {
    if (sau > 8) return null;
    if (Array.isArray(v)) return v.map(x => sach(x, sau + 1));
    if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) if (!CAM.has(k)) o[k] = sach(v[k], sau + 1); return o; }
    return v;
  }
  function cungKieu(mau, v) {
    if (mau === null) return true; /* cur, pending, g: nhận mọi giá trị JSON */
    if (Array.isArray(mau)) return Array.isArray(v);
    if (typeof mau === 'object') return !!v && typeof v === 'object' && !Array.isArray(v);
    if (typeof mau === 'number') return typeof v === 'number' && isFinite(v);
    return typeof v === typeof mau;
  }
  window.khoiPhucAnToan = function (o, fresh) {
    const S = fresh();
    if (!o || typeof o !== 'object' || Array.isArray(o)) return S;
    for (const k of Object.keys(S)) if (Object.prototype.hasOwnProperty.call(o, k) && cungKieu(S[k], o[k])) S[k] = sach(o[k], 0);
    return S;
  };
})();
