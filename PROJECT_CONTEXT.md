# PROJECT_CONTEXT.md - Commerce Book E-Commerce System

## 1. Tổng quan Dự án
- **Tên dự án:** Commerce Book
- **Mô hình:** Sàn thương mại điện tử chuyên biệt về sách đa người bán (**Multi-vendor E-Commerce Platform**).
- **Các phân hệ:**
  - **Khách hàng (User/Customer):** Tìm kiếm (Text/Voice), duyệt danh mục, giỏ hàng, đặt hàng, áp voucher/khuyến mãi, tính phí GHN, đánh giá sách.
  - **Người bán (Shop/Vendor):** Đăng ký mở shop kèm eKYC CCCD (Viettel AI), quản lý sách & tồn kho, sinh metadata qua Gemini AI, quản lý đơn hàng, khuyến mãi, chat realtime (Twilio).
  - **Quản trị viên (Super Admin):** Kiểm duyệt sách (Approve/Reject), quản lý cửa hàng, quản lý danh mục (Genre, Author, Publisher, Series), báo cáo vi phạm.

---

## 2. Tech Stack & Kiến trúc Kỹ thuật

### Backend:
- **Ngôn ngữ & Framework:** Java 21 (LTS), Spring Boot 4.1.x
- **Bảo mật:** Spring Security 6.x, JJWT 0.11.5 (Stateless Authentication, Access Token + HTTP-Only Cookie Refresh Token)
- **Cơ sở dữ liệu:** MySQL 8.x, Spring Data JPA, Hibernate ORM
- **Dịch vụ tích hợp:**
  - **Google Gemini AI (google-genai 1.53.0):** Tự động tạo metadata sách, tóm tắt nội dung.
  - **Viettel AI eKYC:** Nhận diện và đối soát CCCD + khuôn mặt selfie.
  - **Giao Hàng Nhanh (GHN):** API tính cước vận chuyển và đồng bộ địa giới hành chính.
  - **Cloudinary:** Lưu trữ và tối ưu hóa hình ảnh.
  - **Google Books & Wikipedia API:** Tra cứu thông tin ấn bản và tác giả.

### Frontend:
- **Framework & Build:** React 19, TypeScript, Vite 7
- **Styling:** Tailwind CSS v4, FlyonUI, Lucide React, Swiper
- **Quản lý dữ liệu:** TanStack React Query v5, Axios
- **Form & Rich Text:** React Hook Form, Tiptap Editor

---

## 3. Quy chuẩn & Kiến trúc Code Backend (Coding Conventions)

### A. Cấu trúc Package theo Module (`com.dev.backend.modules.*`)
```text
modules/{module_name}/
├── controller/     # @RestController, @RequestMapping("/api/v1/...")
├── service/        # Interface nghiệp vụ
│   └── impl/       # Implementation của Service (@Service, @Transactional)
├── repository/     # Spring Data JPA Repository (@Repository)
├── entity/         # JPA Entity kế thừa BaseEntity
├── dto/            # Request / Response DTOs với validation jakarta.validation
└── mapper/         # Mapper chuyển đổi giữa Entity và DTO
```

### B. Kế thừa Thực thể (`BaseEntity`)
Tất cả Entity kế thừa từ `com.dev.backend.common.entity.BaseEntity`:
- `id`: Long (Primary Key, Identity)
- `createdAt`: LocalDateTime (Tự động bởi `@CreatedDate`)
- `updatedAt`: LocalDateTime (Tự động bởi `@LastModifiedDate`)
- `createdBy`: String (Tự động bởi `@CreatedBy`)
- `updatedBy`: String (Tự động bởi `@LastModifiedBy`)

### C. Chuẩn hóa Response API (`ResponseData<T>` & `PageResponse<T>`)
- API thành công:
  ```java
  ResponseUtil.success("Thông điệp thành công", data);
  ResponseUtil.successMessage("Thông điệp thành công");
  ```
- Định dạng JSON trả về:
  ```json
  {
    "status": 200,
    "message": "Thông điệp thành công",
    "data": { ... }
  }
  ```
- Dữ liệu phân trang:
  ```java
  PageResponse<T> pageResponse = PageUtil.toPageResponse(pageData);
  ```

### D. Xử lý Ngoại lệ (Global Exception Handling)
Ném các Exception từ `com.dev.backend.common.exception`:
- `BadRequestException("Lý do...")` -> HTTP 400
- `UnauthorizedException("Lý do...")` -> HTTP 401
- `NotFoundException("Không tìm thấy...")` -> HTTP 404
- `DuplicateFieldException("Trường đã tồn tại...")` -> HTTP 409
- `AppException(ApiErrorCode.XXX)` -> Tùy biến mã lỗi nghiệp vụ

### E. Lấy thông tin phiên người dùng đăng nhập
Trong Controller:
```java
@AuthenticationPrincipal CustomUserDetails userDetails
// Lấy ID người dùng: userDetails.getUserId()
// Lấy ID Shop của người bán: userDetails.getShop().getId()
// Lấy Role/Email: userDetails.getUser().getEmail(), userDetails.getAuthorities()
```
