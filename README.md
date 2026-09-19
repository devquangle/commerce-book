# 📚 COMMERCE-BOOK: Nền Tảng Thương Mại Điện Tử Sách Đa Người Bán (Multi-Vendor)

> **Commerce-Book** là giải pháp sàn thương mại điện tử chuyên biệt cho lĩnh vực sách báo & ấn phẩm, kết nối người mua (khách hàng), người bán (nhà sách/cá nhân) và ban quản trị hệ thống. Dự án tích hợp các công nghệ hiện đại như **Google Gemini AI**, **Viettel AI eKYC**, **Giao Hàng Nhanh (GHN)**, tìm kiếm bằng giọng nói và xử lý hình ảnh tiên tiến.

---

## 🌟 Điểm nổi bật & Tính năng chính

### 1. Phân hệ Khách hàng (Buyer / Customer)
- **Tìm kiếm sách thông minh đa phương thức:**
  - Tìm kiếm toàn văn theo từ khóa, tên tác giả, nhà xuất bản, thể loại, khoảng giá.
  - Tìm kiếm bằng giọng nói (**Web Speech Recognition**).
- **Trải nghiệm mua sắm mượt mà:**
  - Xem chi tiết sách, hình ảnh nhiều góc độ, thông số xuất bản, mô tả Rich Text và đối chiếu thông tin mở rộng.
  - Quản lý giỏ hàng trực tuyến, cập nhật số lượng tồn kho theo thời gian thực.
  - Đặt hàng nhiều sản phẩm từ nhiều shop khác nhau.
  - Áp dụng mã giảm giá (Voucher sàn & Voucher riêng của từng Shop).
  - Tự động tính phí vận chuyển theo địa chỉ giao hàng với **Giao Hàng Nhanh (GHN API)**.
- **Tài khoản & Cá nhân hóa:**
  - Đăng ký tài khoản kèm xác thực kích hoạt qua Email (SMTP).
  - Sổ địa chỉ nhận hàng nhiều cấp (Tỉnh/Thành -> Quận/Huyện -> Phường/Xã).
  - Theo dõi lịch sử đơn hàng, trạng thái vận chuyển và đánh giá sao / nhận xét sau khi nhận sách.

### 2. Phân hệ Kênh Người Bán (Shop / Vendor)
- **Đăng ký mở gian hàng an toàn với eKYC:**
  - Quy trình KYC tự động bằng **Viettel AI eKYC**: Tải ảnh CCCD 2 mặt và ảnh chân dung selfie để trích xuất OCR và đối soát khuôn mặt.
- **Quản lý danh mục sách & kho hàng:**
  - Đăng bán sách với sự trợ giúp của **Google Gemini AI** (tự động gợi ý metadata, tóm tắt nội dung, phân loại sách).
  - Tra cứu và điền nhanh thông tin từ **Google Books API** và **Wikipedia API**.
  - Quản lý kho, giá bán, giá niêm yết, số lượng tồn kho.
- **Quản lý bán hàng:**
  - Quản lý và xử lý trạng thái đơn hàng (Xác nhận đơn, Giao hàng, Hoàn thành, Hủy).
  - Tạo và quản lý chương trình khuyến mãi, giảm giá trực tiếp theo chiến dịch.
  - Phát hành Voucher độc quyền của Shop.
  - Báo cáo doanh thu & thống kê bán hàng.
  - Chat trực tuyến hỗ trợ khách hàng (**Twilio Conversations**).

### 3. Phân hệ Quản trị Sàn (Super Admin)
- **Kiểm duyệt sách (Book Censorship Workflow):** Duyệt hoặc từ chối kèm lý do các ấn phẩm sách do các Shop đăng ký bán.
- **Quản lý hệ thống:**
  - Quản lý toàn bộ thông tin Danh mục Thể loại (`Genres`), Tác giả (`Authors`), Nhà xuất bản (`Publishers`), Bộ sách (`Series`).
  - Quản lý và phê duyệt hồ sơ Shop, khóa/mở tài khoản vi phạm.
  - Xử lý các báo cáo vi phạm liên quan đến sản phẩm và cửa hàng.
  - Thống kê toàn sàn về số lượng sách, người dùng, giao dịch và đơn hàng.

---

## 🏗️ Kiến trúc Công nghệ (Tech Stack)

```
┌─────────────────────────────────────────────────────────────┐
│                      COMMERCE-BOOK                          │
├──────────────────────────────┬──────────────────────────────┤
│      Frontend (SPA)          │      Backend (REST API)      │
├──────────────────────────────┼──────────────────────────────┤
│ • React 19 + TypeScript      │ • Java 21 (LTS)              │
│ • Vite 7 + Tailwind CSS v4   │ • Spring Boot 4.1.x          │
│ • FlyonUI + Lucide Icons     │ • Spring Security + JJWT     │
│ • TanStack React Query v5    │ • Spring Data JPA + MySQL 8  │
│ • React Hook Form + Tiptap   │ • Cloudinary Java SDK        │
│ • Web Speech API + MediaPipe │ • Google GenAI (Gemini SDK)  │
│ • Twilio Conversations SDK   │ • GHN Express API            │
│ • Playwright + Vitest        │ • Viettel AI eKYC API        │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 📁 Cấu trúc Thư mục Toàn bộ Dự án

```text
commerce-book/
├── backend/                   # Ứng dụng Spring Boot Backend (Java 21)
│   ├── src/main/java/         # Mã nguồn Java (Controllers, Services, Repositories, Entities)
│   ├── src/main/resources/    # Cấu hình application.yaml, application-dev.yaml
│   ├── pom.xml                # Quản lý thư viện Maven
│   └── README.md              # Tài liệu chi tiết kỹ thuật Backend
│
├── frontend/                  # Ứng dụng Single Page Application (React 19 + Vite)
│   ├── src/
│   │   ├── modules/           # Module theo tính năng (user, shop, admin, auth, product, cart...)
│   │   ├── components/        # Component UI dùng chung
│   │   ├── layouts/           # Layout phân quyền (UserLayout, ShopLayout, AdminLayout)
│   │   ├── routes/            # Hệ thống định tuyến React Router v7
│   │   ├── services/ & hooks/ # Tầng gọi API Axios & TanStack Query hooks
│   │   └── types/             # TypeScript interfaces/types định nghĩa dữ liệu
│   ├── package.json           # Danh sách gói npm frontend
│   └── README.md              # Tài liệu chi tiết Frontend
│
└── README.md                  # Tài liệu tổng quan hệ sinh thái dự án (File này)
```

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy Nhanh

### 1. Yêu cầu hệ thống
- **Java Development Kit (JDK):** Phiên bản 21 trở lên.
- **Node.js:** Phiên bản 20.x hoặc 22.x LTS, kèm npm/yarn.
- **MySQL Server:** Phiên bản 8.0 trở lên (khuyến nghị chạy tại cổng mặc định `3306`).

---

### 2. Khởi chạy Backend (Spring Boot)

1. Mở MySQL Client hoặc phpMyAdmin và tạo database:
   ```sql
   CREATE DATABASE ecom_store_book CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```

3. Cấu hình các thông số kết nối cơ sở dữ liệu và API keys bên thứ 3 trong file:
   `src/main/resources/application-dev.yaml`

4. Chạy ứng dụng bằng Maven Wrapper:
   ```bash
   # Trên Windows
   .\mvnw.cmd spring-boot:run

   # Trên Linux/macOS
   ./mvnw spring-boot:run
   ```
   > Backend sẽ khởi chạy tại: `http://localhost:8080` (Tự động nạp dữ liệu mẫu ban đầu qua `LoadData.java`).

---

### 3. Khởi chạy Frontend (React + Vite)

1. Mở một terminal mới và di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```

2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```

3. Khởi động môi trường phát triển (Development Server):
   ```bash
   npm run dev
   ```
   > Ứng dụng web sẽ chạy tại: `http://localhost:5173`

---

## 🔒 Phân quyền & Vai trò trong Hệ thống

| Vai trò | Phạm vi truy cập | Chức năng chính |
| :--- | :--- | :--- |
| **Khách (Guest)** | Toàn bộ trang công khai | Xem sách, tìm kiếm, đọc đánh giá, đăng ký tài khoản, đăng nhập. |
| **Người mua (ROLE_USER)** | Kênh mua sắm cá nhân | Giỏ hàng, đặt đơn, địa chỉ nhận hàng, lịch sử mua sắm, đánh giá sách, gửi yêu cầu đăng ký mở shop. |
| **Người bán (ROLE_SHOP)** | Kênh `/shop/*` | Quản lý kho sách, tạo sản phẩm, xử lý đơn đặt của shop, tạo voucher & khuyến mãi, chat với khách. |
| **Quản trị (ROLE_ADMIN)** | Kênh `/admin/*` | Duyệt sản phẩm sách mới, quản lý danh mục (tác giả, NXB, thể loại, series), quản lý shop, xử lý khiếu nại. |

---

## 🧪 Kiểm thử (Testing)

- **Backend:** Kiểm thử tầng Data JPA và Web MVC thông qua `spring-boot-starter-test`.
  ```bash
  cd backend && .\mvnw.cmd test
  ```
- **Frontend Unit Tests:** Chạy Vitest kiểm thử component và utilities:
  ```bash
  cd frontend && npm run test:unit
  ```
- **Frontend E2E Tests:** Kiểm thử tự động toàn trình end-to-end với Playwright:
  ```bash
  cd frontend && npm run test:e2e
  ```

---

## 🤝 Đóng góp & Bản quyền
Dự án được xây dựng và duy trì nhằm cung cấp một giải pháp thương mại điện tử sách hiện đại, mở rộng và bảo mật cao.
