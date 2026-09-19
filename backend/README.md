# Commerce Book - Backend API Service

Dự án Backend cho nền tảng thương mại điện tử sách trực tuyến đa người bán (**Multi-vendor E-Commerce Book Platform**), được xây dựng trên nền tảng **Spring Boot 4**, **Java 21**, tích hợp bảo mật **Spring Security + JWT**, quản lý dữ liệu **MySQL / Spring Data JPA**, cùng các dịch vụ AI và đối tác vận chuyển / thanh toán hàng đầu.

---

## 📑 Mục lục
- [1. Tổng quan & Kiến trúc](#1-tổng-quan--kiến-trúc)
- [2. Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
- [3. Tính năng chính](#3-tính-năng-chính)
- [4. Cấu trúc thư mục](#4-cấu-trúc-thư-mục)
- [5. Tích hợp bên thứ ba (Third-party Services)](#5-tích-hợp-bên-thứ-ba-third-party-services)
- [6. Danh sách API Endpoints](#6-danh-sách-api-endpoints)
- [7. Cấu hình & Biến môi trường](#7-cấu-hình--biến-môi-trường)
- [8. Hướng dẫn cài đặt & Chạy ứng dụng](#8-hướng-dẫn-cài-đặt--chạy-ứng-dụng)
- [9. Quy chuẩn định dạng Response & Xử lý lỗi](#9-quy-chuẩn-định-dạng-response--xử-lý-lỗi)

---

## 1. Tổng quan & Kiến trúc

Hệ thống cung cấp toàn bộ RESTful API cho ứng dụng thương mại điện tử chuyên biệt về sách với mô hình đa đối tượng:
- **Khách hàng (User/Customer):** Tìm kiếm sách thông minh, xem chi tiết, giỏ hàng, đặt hàng, quản lý đơn hàng, địa chỉ giao hàng, áp dụng voucher/khuyến mãi, đánh giá sản phẩm.
- **Người bán (Shop/Vendor):** Đăng ký mở shop kèm xác thực danh tính căn cước công dân (**eKYC**), quản lý danh mục sách, giá bán, tồn kho, đơn hàng, khuyến mãi riêng của shop.
- **Quản trị viên (Super Admin):** Duyệt kiểm duyệt sách đăng bán, duyệt cửa hàng, quản trị tác giả, nhà xuất bản, thể loại, bộ sách, mã giảm giá toàn sàn, theo dõi báo cáo vi phạm.

---

## 2. Công nghệ sử dụng

| Phân loại | Công nghệ / Thư viện | Phiên bản |
| :--- | :--- | :--- |
| **Ngôn ngữ** | Java | 21 (LTS) |
| **Framework** | Spring Boot | 4.1.0 |
| **Bảo mật** | Spring Security, JJWT (io.jsonwebtoken) | 0.11.5 |
| **Cơ sở dữ liệu** | MySQL 8.x, Hibernate / Spring Data JPA | - |
| **Tiện ích code** | Project Lombok | - |
| **Tải & Quản lý file** | Cloudinary Java SDK | 1.33.0 |
| **Trí tuệ nhân tạo (AI)**| Google GenAI SDK (Gemini), OpenAI Java | 1.53.0 / 1.4.1 |
| **Xử lý tài liệu** | Apache POI (Excel import/export) | 5.2.5 |
| **Khác** | Slugify, Commons-Text, NV-i18n, Spring Mail | - |

---

## 3. Tính năng chính

1. **Xác thực & Phân quyền (Authentication & Authorization):**
   - Đăng ký, đăng nhập, cấp phát Access Token & Refresh Token (HTTP-Only Cookie / Bearer Token).
   - Xác thực email kích hoạt tài khoản.
   - Phân quyền chi tiết dựa trên Role (Super Admin, Shop Owner, Customer).
   - Tự động ghi vết kiểm toán (`AuditorAwareImpl` cho `createdAt`, `updatedAt`, `createdBy`, `updatedBy`).

2. **Quản lý sản phẩm sách (Book / Product Management):**
   - Quản lý thông tin chi tiết: Tên sách, mô tả, năm xuất bản, kích thước, số trang, loại bìa, ngôn ngữ, ISBN.
   - Liên kết đa chiều: Tác giả (`Author`), Thể loại (`Genre`), Nhà xuất bản (`Publisher`), Bộ sách (`Series`).
   - Quản lý hình ảnh sản phẩm đa phương tiện với Cloudinary.
   - Luồng phê duyệt sách: Shop tạo sách -> Chờ duyệt -> Admin duyệt/từ chối kèm lý do -> Mở bán.

3. **Tìm kiếm & Trợ lý thông minh:**
   - Tìm kiếm phân trang, lọc nâng cao theo khoảng giá, tác giả, NXB, thể loại, đánh giá sao.
   - Tự động trích xuất / sinh thông tin metadata cho sách với **Google Gemini AI**.
   - Tìm kiếm và đối soát thông tin với **Google Books API**, **Wikipedia API** và **Search API**.

4. **Kênh người bán & Định danh eKYC:**
   - Quy trình đăng ký mở Shop yêu cầu xác thực CCCD (Mặt trước, Mặt sau, Ảnh selfie) qua **Viettel AI eKYC**.
   - Quản lý cửa hàng, quản lý đơn hàng theo Shop, quản lý tồn kho sách.

5. **Giỏ hàng & Đơn hàng (Cart & Order System):**
   - Quản lý giỏ hàng trực tuyến theo từng khách hàng.
   - Kiểm tra tồn kho trước khi đặt hàng, cập nhật số lượng tự động.
   - Theo dõi trạng thái đơn: Chờ xác nhận, Đang xử lý, Đang giao, Hoàn thành, Đã hủy.

6. **Khuyến mãi & Mã giảm giá (Promotion & Voucher):**
   - Chương trình khuyến mãi (Promotion Campaign) theo đợt giảm giá trực tiếp trên sản phẩm.
   - Voucher giảm giá theo % hoặc số tiền cố định, giới hạn lượt dùng và giá trị đơn hàng tối thiểu.

7. **Vận chuyển & Thanh toán:**
   - Tích hợp **Giao Hàng Nhanh (GHN)**: Lấy dữ liệu Tỉnh/Thành, Quận/Huyện, Phường/Xã và tính phí vận chuyển theo thời gian thực.
   - Tích hợp thông tin chuyển khoản ngân hàng (VietQR / Napas).

---

## 4. Cấu trúc thư mục

```text
backend/
├── src/main/java/com/dev/backend/
│   ├── BackendApplication.java       # Main Application entry point
│   ├── ServletInitializer.java       # WAR deployment support
│   ├── common/                       # Các class dùng chung cho toàn hệ thống
│   │   ├── constant/                 # Hằng số (ApiErrorCode, ModuleConstants, OrderConstants...)
│   │   ├── converter/                # JPA Attribute Converters
│   │   ├── entity/BaseEntity.java    # Entity cha kế thừa audit (createdAt, updatedAt...)
│   │   ├── enums/                    # Enums trạng thái (OrderStatus, PaymentMethod, ShopStatus...)
│   │   ├── exception/                # GlobalExceptionHandler & custom exceptions
│   │   ├── response/                 # Chuẩn hoá ResponseData, PageResponse, PageUtil
│   │   └── utils/                    # CookieUtil, LogUtil, TextUtils...
│   ├── config/                       # Cấu hình Spring Boot
│   │   ├── SecurityConfig.java       # Cấu hình Spring Security, CORS, Filter chain
│   │   ├── LoadData.java             # CommandLineRunner nạp dữ liệu mẫu ban đầu
│   │   ├── CloudinaryConfig.java     # Cấu hình Cloudinary
│   │   ├── GeminiConfig.java         # Cấu hình Google Gemini AI
│   │   └── ghn/ / viettel/           # Cấu hình API đối tác vận chuyển / eKYC
│   ├── security/                     # Tầng bảo mật JWT
│   │   ├── jwt/                      # JwtAuthenticationFilter, JwtUtil
│   │   ├── custom/                   # CustomUserDetailsService, AccessDeniedHandler, AuthEntryPoint
│   │   └── audit/                    # AuditorAwareImpl
│   └── modules/                      # Các module nghiệp vụ chính
│       ├── address/                  # Quản lý địa chỉ giao hàng của người dùng
│       ├── auth/                     # Đăng ký, đăng nhập, refresh token, đổi mật khẩu
│       ├── author/ & author_product/ # Tác giả & liên kết tác giả - sách
│       ├── cart/                     # Giỏ hàng & chi tiết giỏ hàng
│       ├── cloudinary/               # API Upload ảnh
│       ├── gemini/                   # AI Service sinh metadata sách
│       ├── genre/ & genre_product/   # Thể loại sách
│       ├── googlebook/               # Tra cứu Google Books API
│       ├── image_product/            # Quản lý hình ảnh sách
│       ├── notification/             # Hệ thống thông báo
│       ├── order/                    # Quản lý đơn hàng & chi tiết đơn
│       ├── others/                   # Tích hợp GHN, Viettel eKYC, VietQR Bank
│       ├── payment/                  # Cổng thanh toán
│       ├── product/                  # Nghiệp vụ sách / sản phẩm (CRUD, Filter, Approve/Reject)
│       ├── promotion/                # Chiến dịch khuyến mãi
│       ├── publisher/                # Nhà xuất bản
│       ├── report_product/           # Báo cáo vi phạm sản phẩm
│       ├── report_shop/              # Báo cáo vi phạm cửa hàng
│       ├── review/                   # Đánh giá & nhận xét sách
│       ├── role/                     # Phân quyền người dùng
│       ├── search_api/               # Tra cứu thông tin mở rộng
│       ├── series/                   # Bộ sách / Tuyển tập
│       ├── shipping/                 # Quản lý giao nhận
│       ├── shop/                     # Quản lý cửa hàng / Vendor
│       ├── user/                     # Quản lý tài khoản người dùng
│       ├── voucher/                  # Mã giảm giá
│       └── wikipedia/                # Tra cứu thông tin từ Wikipedia
└── src/main/resources/
    ├── application.yaml              # Cấu hình chung của ứng dụng
    └── application-dev.yaml          # Cấu hình môi trường dev (Database, Mail, 3rd Keys)
```

---

## 5. Tích hợp bên thứ ba (Third-party Services)

1. **Google Gemini AI:** Tự động hóa quá trình nhập liệu sách bằng cách phân tích và tạo metadata (mô tả tóm tắt, từ khóa, thể loại liên quan).
2. **Viettel AI (eKYC Service):** So khớp và trích xuất OCR căn cước công dân + nhận diện khuôn mặt người đăng ký mở shop.
3. **Giao Hàng Nhanh (GHN):** Đồng bộ địa giới hành chính chuẩn và tính cước phí vận chuyển chính xác theo trọng lượng sách.
4. **Cloudinary:** Lưu trữ và tối ưu hóa hình ảnh sách, avatar người dùng trên CDN tốc độ cao.
5. **Google Books & Wikipedia:** Tìm kiếm và lấy thông tin đối chiếu cho sách, tác giả và nhà xuất bản.

---

## 6. Danh sách API Endpoints tiêu biểu

### 🔐 Xác thực (Authentication) - `/api/v1/auth`
- `POST /api/v1/auth/login` : Đăng nhập bằng email/mật khẩu, trả về JWT & Refresh Token
- `POST /api/v1/auth/refresh` : Cấp lại Access Token mới khi token cũ hết hạn
- `GET /api/v1/auth/me` : Lấy thông tin tài khoản đang đăng nhập
- `PUT /api/v1/auth/me` : Cập nhật thông tin tài khoản
- `PUT /api/v1/auth/change-password` : Đổi mật khẩu
- `POST /api/v1/auth/logout` : Đăng xuất & hủy phiên

### 📚 Quản lý Sách (Products) - `/api/v1`
- `GET /api/v1/products/filter` : Lọc và tìm kiếm danh sách sách cho khách hàng (Public)
- `GET /api/v1/product-detail?slug={slug}` : Lấy chi tiết sách theo đường dẫn thân thiện (Slug)
- `GET /api/v1/shop/products/filter` : Lấy danh sách sách thuộc quyền quản lý của Shop
- `POST /api/v1/shop/products` : Shop đăng bán sách mới (trạng thái chờ duyệt)
- `GET /api/v1/shop/products?slug={slug}` : Lấy chi tiết sản phẩm của Shop
- `PUT /api/v1/shop/products/{id}` : Cập nhật thông tin sách của Shop
- `DELETE /api/v1/shop/products/{id}` : Xóa sách khỏi cửa hàng
- `GET /api/v1/admin/products/filter` : Danh sách sách chờ kiểm duyệt (Dành cho Admin)
- `PUT /api/v1/admin/products/approve/{id}` : Admin duyệt phát hành sách
- `PUT /api/v1/admin/products/reject/{id}` : Admin từ chối kèm lý do

### 🤖 Dịch vụ AI & Tiện ích
- `GET /api/v1/gemini/book-meta` : Trích xuất metadata sách thông qua Gemini AI
- `GET /api/v1/google-books?query={query}` : Tra cứu sách qua Google Books
- `GET /api/v1/wikipedia/summary?title={title}` : Tra cứu thông tin tác giả/sách trên Wikipedia
- `POST /api/v1/ekyc/verify` : Xác thực CCCD và khuôn mặt bằng Viettel AI

### 🚚 Vận chuyển (GHN) & Ngân hàng
- `GET /api/v1/ghn/provinces` : Danh sách Tỉnh/Thành phố
- `POST /api/v1/ghn/districts` : Danh sách Quận/Huyện theo Tỉnh
- `POST /api/v1/ghn/wards` : Danh sách Phường/Xã theo Huyện
- `POST /api/v1/ghn/shipping-fee` : Tính toán phí vận chuyển thực tế
- `GET /api/v1/banks/list` : Danh sách ngân hàng hỗ trợ VietQR

---

## 7. Cấu hình & Biến môi trường

Ứng dụng tải cấu hình từ file `application-dev.yaml`. Bạn có thể cấu hình thông qua biến môi trường hệ thống:

| Biến môi trường | Ý nghĩa | Mặc định (nếu có) |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | Chuỗi kết nối MySQL JDBC | `jdbc:mysql://localhost:3306/ecom_store_book` |
| `SPRING_DATASOURCE_USERNAME` | Tên người dùng database | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Mật khẩu database | *(trống)* |
| `JWT_SECRET` | Khóa bí mật mã hóa JWT (HMAC-SHA) | Chuỗi 256-bit mặc định |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | Tài khoản gửi mail kích hoạt (Gmail SMTP) | - |
| `CLOUDINARY_CLOUD_NAME` | Cloud Name Cloudinary | - |
| `CLOUDINARY_API_KEY` | API Key Cloudinary | - |
| `CLOUDINARY_API_SECRET` | API Secret Cloudinary | - |
| `GEMINI_API_KEY` | Google Gemini AI API Key | - |
| `GHN_TOKEN` | Token xác thực API Giao Hàng Nhanh | - |
| `GHN_SHOP_ID` | Mã Shop đã đăng ký trên GHN | - |
| `VIETTEL_TOKEN` | Token kết nối Viettel AI eKYC | - |

---

## 8. Hướng dẫn cài đặt & Chạy ứng dụng

### Yêu cầu tiên quyết:
- **JDK 21** trở lên đã cài đặt và cấu hình `JAVA_HOME`.
- **MySQL 8.x** đang chạy tại cổng `3306`.
- **Apache Maven 3.9+** (hoặc sử dụng wrapper `mvnw` đi kèm).

### Các bước thực hiện:

1. **Khởi tạo Database:**
   Tạo cơ sở dữ liệu MySQL:
   ```sql
   CREATE DATABASE ecom_store_book CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Cấu hình môi trường:**
   Thiết lập các biến môi trường cần thiết hoặc cập nhật thông tin trong `src/main/resources/application-dev.yaml`.

3. **Build dự án:**
   ```bash
   # Dành cho Windows:
   .\mvnw.cmd clean install -DskipTests

   # Dành cho Linux/macOS:
   ./mvnw clean install -DskipTests
   ```

4. **Chạy ứng dụng:**
   ```bash
   # Dành cho Windows:
   .\mvnw.cmd spring-boot:run

   # Dành cho Linux/macOS:
   ./mvnw spring-boot:run
   ```

   Khi ứng dụng khởi động thành công:
   - Cổng mặc định: `http://localhost:8080`
   - Quá trình `LoadData` sẽ tự động khởi tạo các danh mục mẫu (Tác giả, Thể loại, Nhà xuất bản, Bộ sách, Voucher).

---

## 9. Quy chuẩn định dạng Response & Xử lý lỗi

Tất cả các API tuân theo cấu trúc trả về thống nhất qua `ResponseData<T>`:

```json
{
  "status": 200,
  "message": "Lấy danh sách sản phẩm thành công",
  "data": { ... }
}
```

Đối với các API phân trang (`PageResponse<T>`):
```json
{
  "status": 200,
  "message": "Thành công",
  "data": {
    "content": [ ... ],
    "pageNo": 0,
    "pageSize": 10,
    "totalElements": 100,
    "totalPages": 10,
    "last": false
  }
}
```

Khi phát sinh ngoại lệ, hệ thống tự động bắt qua `@RestControllerAdvice` (`GlobalExceptionHandler`) và trả về mã lỗi chuẩn cùng thông điệp chi tiết.
