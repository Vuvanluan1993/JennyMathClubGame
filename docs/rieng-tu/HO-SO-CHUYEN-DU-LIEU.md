# HỒ SƠ ĐÁNH GIÁ TÁC ĐỘNG CHUYỂN DỮ LIỆU CÁ NHÂN RA NƯỚC NGOÀI

> **Bản nháp, chờ thầy duyệt** (25/10/2026). Khung hồ sơ theo Điều 25 Nghị định 13/2023/NĐ-CP (hồ sơ lập 1 bản, lưu tại Clb và gửi Bộ Công an — Cục A05 — trong 60 ngày kể từ ngày bắt đầu xử lý). Luật Bảo vệ dữ liệu cá nhân 2025 có thể đổi mẫu/thời hạn: thầy kiểm tra văn bản hướng dẫn mới nhất và nhờ người có chuyên môn pháp lý rà soát trước khi nộp. Chỗ `……` thầy điền.

## 1. Bên chuyển dữ liệu

| | |
|---|---|
| Tên | Clb Học Toán cùng Jenny |
| Người phụ trách | Vũ Văn Luân |
| Địa chỉ, điện thoại, email | …… |
| Người phụ trách bảo vệ dữ liệu | …… (có thể là thầy Luân) |

## 2. Bên nhận dữ liệu ở nước ngoài

| | |
|---|---|
| Tên | Google LLC / Google Asia Pacific Pte. Ltd. (dịch vụ Firebase: Firestore, Authentication) |
| Nơi đặt máy chủ | Firestore: vùng `asia-southeast1` (Singapore). Firebase Authentication: dịch vụ toàn cầu của Google, có thể xử lý ở Hoa Kỳ hoặc nước khác |
| Vai trò | Bên xử lý dữ liệu theo hợp đồng dịch vụ (Google Cloud Data Processing Addendum) |
| Liên hệ | Theo Điều khoản dịch vụ Firebase và DPA của Google Cloud (thầy lưu bản PDF kèm hồ sơ) |

## 3. Mục đích chuyển

Vận hành Lớp học ảo Jenny: tài khoản học sinh/phụ huynh/giáo viên, lưu tiến độ học, để cô giáo và phụ huynh theo dõi. Không có máy chủ trong nước phù hợp với quy mô (một câu lạc bộ nhỏ, gói miễn phí); Firebase không có vùng Việt Nam nên chọn Singapore, vùng gần nhất.

## 4. Loại dữ liệu chuyển và chủ thể

- Chủ thể: học sinh (6–15 tuổi, **dữ liệu trẻ em**), phụ huynh, giáo viên, quản lý trung tâm.
- Loại: dữ liệu cá nhân cơ bản (họ tên, giới tính, ngày/năm sinh, lớp, số điện thoại, Gmail phụ huynh, tên đăng nhập) và dữ liệu học tập (kết quả làm bài, nhận xét của cô). Không có dữ liệu nhạy cảm (không sức khoẻ, không sinh trắc, không định danh, không vị trí).
- Số lượng: …… học sinh, …… phụ huynh, …… giáo viên (cập nhật mỗi năm học).
- Chi tiết từng trường: `docs/rieng-tu/DANH-MUC-DU-LIEU.md`.

## 5. Cách chuyển và bảo vệ

- Chuyển qua HTTPS từ trình duyệt người dùng thẳng tới Firebase. Mật khẩu do Firebase Authentication băm; Clb không lưu mật khẩu.
- Quyền truy cập theo vai (quy tắc `firebase/firestore.rules`): học sinh chỉ dữ liệu mình, cô chỉ lớp mình, phụ huynh chỉ con mình, quản lý cả trung tâm; chỉ quản lý tạo tài khoản.
- Tài khoản quản trị Firebase (thầy Luân) bật xác thực 2 bước. Tắt Google Analytics và Gemini trong dự án Firebase.
- Sao lưu: …… (kế hoạch P-10: xuất định kỳ, mã hoá, lưu trong nước).

## 6. Đánh giá tác động và biện pháp giảm thiểu

| Rủi ro | Mức | Biện pháp |
|---|---|---|
| Lộ dữ liệu trẻ em do cấu hình sai quyền | Trung bình | Quy tắc Firestore theo vai; kiểm tra lại mỗi khi đổi; không có tài khoản thử trong bản thật |
| Mật khẩu yếu / dùng chung | Trung bình | Mật khẩu ngẫu nhiên khi tạo, bắt đổi lần đầu (kế hoạch P-05) |
| Mất dữ liệu (gói miễn phí không sao lưu) | Trung bình | Sao lưu định kỳ (P-10) |
| Google thay đổi vùng/điều khoản | Thấp | Theo dõi thông báo Firebase; có thể chuyển máy chủ khác |
| Dùng dữ liệu sai mục đích | Thấp | Không quảng cáo, không chia sẻ; nhật ký thao tác quản lý |

## 7. Sự đồng ý của chủ thể dữ liệu

Phụ huynh (và học sinh từ 7 tuổi) ký **Phiếu đồng ý** (`docs/rieng-tu/PHIEU-DONG-Y.md`) khi đăng ký, trong đó ghi rõ việc lưu tại Singapore. Phiếu giấy lưu tại Clb.

## 8. Thời hạn lưu và xoá

Trong thời gian học + tối đa 24 tháng sau khi nghỉ; xoá theo yêu cầu trong 72 giờ. Khi xoá trên Firestore, dữ liệu cũng bị xoá ở bản sao lưu trong kỳ sao lưu tiếp theo.

## 9. Văn bản ràng buộc với bên nhận

Điều khoản dịch vụ Firebase + Google Cloud Data Processing Addendum (chấp nhận khi tạo dự án `jenny-lop-hoc-ao`). Thầy in/lưu bản PDF ngày ……/……/2026 kèm hồ sơ.

## 10. Cam kết và chữ ký

Clb cam kết nội dung trên là đúng và sẽ cập nhật hồ sơ khi có thay đổi (loại dữ liệu, bên nhận, vùng máy chủ).

Ngày ……/……/2026 · Người phụ trách: Vũ Văn Luân (ký, ghi rõ họ tên)

---
**Việc thầy cần làm trước khi nộp:** điền `……`; tải DPA của Google; đếm số chủ thể; kiểm tra lại mẫu theo hướng dẫn mới nhất của Luật 2025; nhờ người có chuyên môn pháp lý xem.
