# Bộ tiêu chí làm game giáo dục – CLB Học Toán cùng Jenny

Dùng để kiểm tra mỗi game trước khi đưa lên trang. Tổng hợp từ:

- **4 trụ cột của ứng dụng giáo dục** (Hirsh-Pasek và cộng sự, 2015): học chủ động, tập trung, có ý nghĩa, có tương tác xã hội.
- **Nguyên tắc học đa phương tiện** của Mayer.
- **Nghiên cứu cảm ứng của trẻ em** (Anthony và cộng sự, 2013).
- **Chuẩn tiếp cận WCAG 2.2.**
- **Chương trình GDMN** (Thông tư 51/2020) và **GDPT 2018 môn Toán.**

## 1. Mục tiêu học tập
- [ ] Mỗi dạng bài dạy **một mục tiêu rõ ràng**, đúng chương trình theo lứa tuổi:
  - Mầm non 5–6 tuổi: số và đếm đến 10, so sánh, thêm – bớt, tách – gộp, hình, định hướng không gian.
  - Lớp 1 trở lên: phép tính với ký hiệu, xem giờ…
- [ ] Đi từ dễ đến khó (phạm vi số tăng dần) và có bước đệm: gợi ý, cho làm lại.
- [ ] Đề **luôn đúng**:
  - Có đúng 1 đáp án.
  - Đáp án đúng nằm trong các lựa chọn, các lựa chọn không trùng nhau.
  - Không ra số âm, không lộ đáp án.
  - Đề do máy tạo phải có **bộ kiểm tra tự động** chạy hàng nghìn đề.

## 2. Đề bài và ngôn ngữ
- [ ] Câu ngắn, từ quen thuộc, xưng hô thống nhất ("con" với mầm non, "em" với tiểu học).
- [ ] Trẻ chưa biết đọc: **đọc to yêu cầu**, chậm rãi. Có nút loa để nghe lại.
- [ ] Ký hiệu toán được đọc thành chữ (cộng, trừ, bằng…).

## 3. Hình ảnh
- [ ] Chỉ vẽ những gì phục vụ bài, không trang trí thừa làm rối mắt (nguyên tắc *gọn* của Mayer).
- [ ] Đồ vật nhận ra ngay khi nhỏ cỡ 50px. Số lượng cần đếm phải rõ ràng, không chồng lên nhau.
- [ ] Chỗ "khác nhau" phải **thấy được bằng mắt**. Kiểm tra bằng máy: hai hình phải khác nhau thật.
- [ ] Không dùng màu làm tín hiệu duy nhất (có thêm hình dạng, chữ, số). Chữ đủ tương phản.
- [ ] Hình không tràn khung, vừa 1 màn hình trên mọi thiết bị (`tools/check_fit.py`).

## 4. Tương tác (trẻ 5–6 tuổi)
- [ ] Nút chạm **to** (≥ 1,2 cm, khoảng 48–64px) và có khoảng cách. Trẻ càng nhỏ càng cần nút to.
- [ ] **Ưu tiên chạm.** Kéo thả là khó với trẻ nhỏ, nên mọi bài kéo thả đều có cách chạm thay thế. Thả **gần** ô cũng được tính.
- [ ] Bỏ qua cú chạm lặp ngay sau khi trả lời (tránh bấm loạn).
- [ ] Có công cụ hỗ trợ suy nghĩ, ví dụ chạm vào từng hình để đếm 1, 2, 3…

## 5. Phản hồi và hiệu ứng
- [ ] Phản hồi **ngay**, bằng tiếng và hình. Sai thì nhắc nhẹ nhàng, không phạt, không mất điểm nặng.
- [ ] Lựa chọn sai được làm mờ. Sai 2 lần thì **gợi ý cụ thể** (nói lý do + chỉ chỗ đúng). Câu sau dễ hơn một chút.
- [ ] Khen cả **sự cố gắng** ("Con đã cố gắng và làm đúng rồi!"), không chỉ khen đúng.
- [ ] Hiệu ứng ngắn. Không nhấp nháy quá 3 lần mỗi giây. Tôn trọng chế độ "giảm chuyển động" của máy. Có nút tắt tiếng.

## 6. Động lực
- [ ] Phần thưởng (sao, xu, vườn) gắn với **việc học**, không gắn với thời gian online hay quảng cáo.
- [ ] Không có quảng cáo, không mua bằng tiền thật, không có thông báo dụ quay lại.
- [ ] Nhắc **nghỉ mắt**: mầm non sau 15 phút, tiểu học sau 25 phút.

## 7. An toàn và riêng tư
- [ ] Không thu thập thông tin cá nhân. Tiến độ chỉ lưu trên máy.
- [ ] Khu vực người lớn (sao lưu, cài đặt) có **khoá người lớn**: nhấn giữ 2 giây.
- [ ] Nội dung có bản quyền thì khoá bằng mã CLB và không ghi nguồn trên trang.

## Cách kiểm tra trước khi đưa lên
1. `python tools/check_fit.py <tên game>`: vừa 1 màn hình trên 8 cỡ máy.
2. Chạy bộ kiểm tra đề tự động (với game tự tạo đề).
3. Cho máy tự giải hết mọi dạng bài: phải chấm đúng và chuyển câu đúng.
4. Cho 2–3 em đúng lứa tuổi chơi thử, ghi lại chỗ các em lúng túng.
