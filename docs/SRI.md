# SRI (Subresource Integrity) cho script ngoài

Trang Lớp học ảo tải 3 file Firebase compat (4 khi bật App Check) từ `https://www.gstatic.com/firebasejs/<FB_VER>/…` trong
`src/lop-hoc-ao/js/core/62-may-chu.js` (hàm `fbNap`). Mỗi thẻ `<script>` có `integrity` + `crossorigin="anonymous"`:
trình duyệt chỉ chạy file khi hash khớp, tránh bị thay nội dung trên đường truyền hay ở CDN.

## FB_VER = 10.12.2 (tính ngày 25/10/2026)

| File | sha384 | Cỡ |
|---|---|---|
| `firebase-app-compat.js` | `sha384-AQ3POAMqIhwS81FrUH95ekxqBZHeP5tG2JfEL3+7GuTtfRLWnrRh32UxwzM+//A9` | 31 444 byte |
| `firebase-auth-compat.js` | `sha384-TnlRYaR4JYz/lpaGuaiU61PjNberSA4vjLjtF+oRC/IkohkJqnWxw5EmDSOt1vA1` | 139 582 byte |
| `firebase-firestore-compat.js` | `sha384-qn4Jh88HhJA8dplNQyGjOh9OGI4izVhrfj/qIFgaKcdgOE06pXqIKGlsCILZcLAC` | 341 174 byte |
| `firebase-app-check-compat.js` (chỉ tải khi `FB_CFG.appCheckKey` khác rỗng, P-05) | `sha384-E3vxFxXu8FhW5kvqdQJ5Yf8ugrV7iCJP8jgnItRH2Rk8Q08cJzJGTi/oMC3FEp3j` | 23376 byte |

## Khi đổi FB_VER
Hash đổi theo phiên bản. Tính lại rồi sửa bảng `SRI` trong `fbNap` và bảng trên:

```bash
for n in app auth firestore app-check; do curl -sSo /tmp/fb-$n.js "https://www.gstatic.com/firebasejs/10.12.2/firebase-$n-compat.js"; printf "%s sha384-%s\n" $n "$(openssl dgst -sha384 -binary /tmp/fb-$n.js | openssl base64 -A)"; done
```

Nếu hash sai, trình duyệt báo lỗi "Failed to find a valid digest" và app báo "Không tải được Firebase".

## Các nguồn ngoài khác
Không còn. Chữ (Baloo 2, Nunito, VT323, Be Vietnam Pro, Lexend) tự host ở `assets/fonts/`; giọng đọc dùng
`speechSynthesis` của máy. `tools/test/khong-goi-ngoai.mjs` kiểm tra mọi trang không gọi ra ngoài danh sách cho phép.
