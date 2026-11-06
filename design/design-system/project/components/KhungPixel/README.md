# Khung pixel

Khung là "thẻ" của Jenny: mọi nhóm nội dung nằm trong một khung, nền trắng trên nền trang.

- **Pixel**: viền 3px `px-frame` + bóng cứng `0 4px 0 0 px-frame`, góc vuông, đệm 20px. Biến thể `cut` (viền khuyết 4 góc bằng `frame-3`) cho ô bấm được; `cut2` (`frame-2`) cho ô nhập, nhãn nhỏ; `flat` bỏ bóng khi khung nằm trong khung.
- **Classroom**: viền 1px `lms-line`, bo `radius-lms` 8px, không bóng, đệm 16px; `note` = hộp vàng cảnh báo (`lms-warn-soft`, chữ #7A4300).
- **Cỡ**: rộng theo cột; tối thiểu 0 (`min-width:0`) để chữ dài xuống dòng, không đẩy trang rộng ra.
- **Nên**: một tiêu đề `px-h2`/`lms-h2` đầu khung; khung lồng khung thì khung trong `flat`. **Không**: bóng mềm, bo góc ở Pixel; nhiều hơn hai mức lồng nhau.
