# Inklish — bản hoàn chỉnh tối ưu cho iPad

## Điểm mới
- Màn hình Hôm nay chỉ dẫn một lộ trình chính gồm 5 bước, tổng đúng 45 phút. Một nút “Tiếp tục bài hôm nay” đưa người học vào đúng bước chưa hoàn thành; đường học 570 buổi đi từ nền tảng đến giao tiếp độc lập hướng tới C1.
- **Mọi flashcard đều có hình động 3D.** Các từ như **cat, dog, bird, fish, car, flower** có chuyển động riêng; sách, cây, mặt trời, mặt trăng, nước, mưa, người và các nhóm còn lại cũng chuyển động theo hình gợi nhớ. Từ chưa có mô hình riêng dùng khối chữ 3D động. Tất cả chạy offline và tự dừng khi bật “Giảm chuyển động”.
- Thẻ có chiều sâu, hiệu ứng lật hai mặt, nghiêng nhẹ khi rê chuột và hỗ trợ vuốt ngang.
- Giữ chế độ viết từ bằng ô nhập/Apple Pencil và nghe phát âm của bản cũ.
- Thêm 29 truyện và hội thoại, chia mức A1, A2, B1; tập trung vào khám phá thế giới và giao tiếp thực chiến với cách nói Mỹ tự nhiên.
- Mỗi câu tiếng Anh có nút nghe riêng để luyện nghe, nhại giọng và phản xạ theo từng lượt thoại.
- Giữ nguyên 25 chương truyện gốc. Toàn bộ 13 chương B1 được tách lại theo từng câu: một câu tiếng Anh đầy đủ đi cùng nguyên câu tiếng Việt ngay bên dưới. Câu dài tự xuống nhiều dòng, không chia thành cụm dịch rời và không cắt mất chữ.
- Bổ sung hơn 35 từ và cụm giao tiếp từ các tình huống sân bay, tàu điện, khách sạn, hiệu thuốc, lái xe, ăn uống và khám phá địa phương.
- Bố cục dọc/ngang cho iPad, vùng chạm lớn, hỗ trợ Apple Pencil tại các ô viết và phần ghi chú.
- Lịch ôn SM-2 điều chỉnh: Quên 1 phút, Khó 6 phút, Tốt theo bước 10 phút rồi 1–6 ngày, Dễ 4 ngày ở thẻ mới. Lịch học lại được lưu trước khi chuyển thẻ.
- Tìm kiếm và quản lý hơn 1.500 mục từ; có thể thêm/sửa nghĩa, IPA, từ loại, ví dụ, gần nghĩa, trái nghĩa và hình riêng.
- Thống kê streak, mục tiêu ngày, phân bổ Mới / Đang học / Ôn dài hạn, biểu đồ 7 ngày và ảnh thành tích để tự chia sẻ.
- IndexedDB làm kho dữ liệu chính, localStorage làm bản dự phòng; sao lưu đầy đủ gồm lịch sử ôn và nét viết.

## Mở và sử dụng
Giải nén gói tải về rồi mở index.html để xem nhanh. Để cài ra màn hình chính và dùng bộ nhớ đệm offline, đưa toàn bộ nội dung thư mục lên hosting HTTPS như bản Netlify cũ. Sau lần tải online hoàn tất, tài nguyên giao diện và truyện mới được lưu offline. TTS phụ thuộc giọng có trên thiết bị.

Vào **Ôn** để thử thẻ. Nhập từ rồi nhấn Enter hoặc nút Kiểm tra để lật; chọn Quên / Khó / Tốt / Dễ. Thẻ nhớ nghĩa có thể lật bằng nút hoặc vuốt ngang.

Vào **Đọc → Truyện mới** để chọn truyện. Truyện A1/B1 gốc vẫn nằm ở các nút kế bên. Bản dịch luôn hiển thị theo nguyên câu.

Trên iPad, hãy mở bằng Safari qua địa chỉ HTTPS, sau đó chọn **Chia sẻ → Thêm vào Màn hình chính**. Tải giọng Anh–Mỹ hoặc Anh–Anh trong Cài đặt iPad để TTS dùng được khi offline.

## Tiến độ đang có
Giữ nguyên khóa lưu dữ liệu inklish:v1. Nếu cập nhật trên cùng địa chỉ web, dữ liệu vẫn dùng kho cũ. Nếu đổi địa chỉ hoặc trình duyệt, xuất bản sao lưu từ bản cũ rồi nhập trong Tiến độ của bản mới. Không có tiến độ cá nhân nào được nhúng trong gói này.

## Phạm vi
Đây là PWA nâng cấp từ Inklish, chưa phải ứng dụng Flutter/native. Widget thật trên màn hình khóa hoặc màn hình chính iPad cần một ứng dụng iOS và WidgetKit; trình duyệt không thể cung cấp phần mở rộng đó. App hiện có thẻ xem nhanh bên trong và lối cài ra màn hình chính. TTS và nét viết nên được kiểm tra lần cuối trên chính chiếc iPad của anh vì các phiên bản Safari/iPadOS có thể khác nhau.
