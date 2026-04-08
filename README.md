# MathGuide VN - Trình Tạo Đề Cương Toán Học

Ứng dụng tạo đề cương môn Toán THCS và THPT theo chương trình GDPT mới của Bộ Giáo dục Việt Nam.

## Tính năng chính
- **Phân chia chuyên đề chi tiết**: Đầy đủ các khối lớp từ 6 đến 12.
- **Cấu trúc đề cương chuẩn**: Lý thuyết, công thức, ví dụ mẫu và bài tập phân loại 4 mức độ.
- **Hiển thị toán học chuyên nghiệp**: Sử dụng KaTeX để render công thức LaTeX sắc nét.
- **Hình học trực quan**: Minh họa các hình khối, đồ thị bằng SVG.
- **AI Thông minh**: Sử dụng Gemini API để sinh thêm bài tập mới cho từng chuyên đề.
- **Xuất PDF**: Hỗ trợ xuất đề cương ra file PDF để in ấn.
- **Giao diện hiện đại**: Hỗ trợ Dark Mode và Responsive.

## Hướng dẫn chạy ứng dụng
1. **Cài đặt phụ thuộc**:
   ```bash
   npm install
   ```
2. **Cấu hình API Key**:
   - Đảm bảo bạn đã thiết lập `GEMINI_API_KEY` trong phần Secrets của AI Studio.
3. **Chạy ở chế độ phát triển**:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại `http://localhost:3000`.

## Công nghệ sử dụng
- **Frontend**: React 19, Tailwind CSS 4, Framer Motion, Lucide React.
- **Backend**: Express (Vite Middleware).
- **AI**: Google Gemini API (@google/genai).
- **Math**: KaTeX.
- **PDF**: jsPDF, html2canvas.
