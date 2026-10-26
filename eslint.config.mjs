// ESLint cho mã nguồn Lớp học ảo (P-14b, 26/10/2026): mỗi file JS là ES module, mọi tên dùng phải được khai báo/import.
//   npm run lint            (= eslint)
// Toàn cục cho phép: trình duyệt + ES2025 (gói globals), tên liệt kê ở src/lop-hoc-ao/tools/vite/toan-cuc.json (viết tay, có lý do)
// và toan-cuc-sinh.json (trạng thái dùng chung, sinh bởi chuyen-hooks.mjs). tim-import.mjs dùng cùng hai danh sách này.
import fs from 'node:fs';
import globals from 'globals';

const doc = f => JSON.parse(fs.readFileSync(new URL('./src/lop-hoc-ao/tools/vite/' + f, import.meta.url), 'utf8')).ten;
const toanCuc = Object.fromEntries([...Object.keys(doc('toan-cuc.json')), ...Object.keys(doc('toan-cuc-sinh.json'))].map(n => [n, 'writable']));

export default [
  {
    files: ['src/lop-hoc-ao/js/**/*.js', 'src/lop-hoc-ao/content/**/*.js'], // content/lop-*: nội dung theo khối (P-15a)
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...globals.browser, ...globals.es2025, ...toanCuc } },
    rules: {
      'no-undef': 'error',          // tên chưa khai báo (không còn toàn cục ngầm)
      'no-import-assign': 'error',  // không gán lại tên import (hàm đè phải qua hooks.de)
    },
  },
];
