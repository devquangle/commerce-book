# 🤖 AGENTS.md — Backend Guidelines (Spring Boot 4 / Java 21)

> **Tài liệu quy chuẩn dành riêng cho AI Coding Agents khi phát triển và bảo trì mã nguồn trong thư mục `backend/`.**  
> Mọi thay đổi trong phần Backend PHẢI tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## 📌 NGUYÊN TẮC CỐT LÕI (Core Principle)

> **"Existing codebase is the source of truth."**  
> Mã nguồn thực tế đang chạy là chân lý tối thượng, luôn được ưu tiên cao hơn mọi giả định lý thuyết hay "best practice" bên ngoài:
> 1. **Code thực tế đang tồn tại** trong thư mục `backend/`
> 2. **API Contract thực tế** đã đồng bộ với `frontend/`
> 3. **Database Schema & Entity Mapping thực tế** trong MySQL / JPA
> 4. **Kiến trúc phân tầng thực tế** của dự án
> 5. **Yêu cầu cụ thể từ User**

---

## ☕ 1. Backend Stack & Công Nghệ Thực Tế

Được xác định trực tiếp từ `backend/pom.xml` và cấu hình ứng dụng:

- **Ngôn ngữ:** Java 21 (LTS)
- **Framework nền tảng:** Spring Boot 4.1.0 (`spring-boot-starter-parent: 4.1.0`), đóng gói dạng WAR (`<packaging>war</packaging>`)
- **Web & MVC:** Spring Boot Starter WebMVC, Tomcat (provided)
- **Bảo mật (Security):**
  - Spring Boot Starter Security (Spring Security 6.x)
  - JJWT 0.11.5 (`io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
  - Stateless Authentication qua Bearer Token (Header) & Refresh Token (HTTP-Only Cookie)
- **Truy cập dữ liệu & ORM:**
  - Spring Boot Starter Data JPA (Hibernate ORM)
  - MySQL Connector J (`com.mysql:mysql-connector-j:9.x`)
  - Cấu hình Hibernate: `ddl-auto: update`, `default_batch_fetch_size: 50`
- **Validation:** Spring Boot Starter Validation (`jakarta.validation.*`)
- **Tích hợp bên thứ ba:**
  - Cloudinary HTTP44 (`com.cloudinary:cloudinary-http44:1.33.0`)
  - Google GenAI SDK (`com.google.genai:google-genai:1.53.0`)
  - OpenAI Java SDK (`com.openai:openai-java:1.4.1`)
  - Giao Hàng Nhanh (GHN) API qua RestTemplate/Http
  - Viettel AI eKYC API
  - Apache POI OOXML (`org.apache.poi:poi-ooxml:5.2.5`)
  - JavaMailSender (`spring-boot-starter-mail`)
- **Thư viện tiện ích:**
  - Project Lombok (`@Getter`, `@Setter`, `@RequiredArgsConstructor`, `@Builder`,...)
  - Jackson Databind (`com.fasterxml.jackson.core`)
  - NV-i18n (`com.neovisionaries:nv-i18n:1.29`)
  - Apache Commons Text (`org.apache.commons:commons-text:1.14.0`)
  - Slugify (`com.github.slugify:slugify:3.0.7`)

---

## 📂 2. Cấu Trúc Gói Thực Tế (Package Structure)

Toàn bộ mã nguồn nằm dưới package gốc: `com.dev.backend`

```text
backend/src/main/java/com/dev/backend/
├── BackendApplication.java       # Main entry point của ứng dụng Spring Boot
├── ServletInitializer.java          # Hỗ trợ chạy deploy WAR server
├── common/                          # Tài nguyên dùng chung cho mọi module
│   ├── constant/                    # Hằng số hệ thống (ApiErrorCode, AppConstants, UserConstants,...)
│   ├── converter/                   # JPA Attribute Converters
│   ├── entity/                      # BaseEntity (chứa id, createdAt, updatedAt, createdBy, updatedBy)
│   ├── enums/                       # Toàn bộ Enums nghiệp vụ (ProductStatus, ShopStatus, OrderStatus,...)
│   ├── exception/                   # Custom Exceptions & GlobalExceptionHandler
│   ├── response/                    # ResponseData<T>, PageResponse<T>, ResponseUtil, PageUtil
│   └── utils/                       # Utility classes (TextUtils, UsernameUtils, CookieUtil, LogUtil)
├── config/                          # Cấu hình Spring Beans, CORS, SecurityConfig, Third-party SDKs
│   ├── cloudinary/                  # Cloudinary Beans
│   ├── ghn/                         # Cấu hình kết nối GHN
│   ├── jwt/                         # JwtConfig
│   └── viettel/                     # Cấu hình Viettel eKYC
├── security/                        # Thành phần an ninh Spring Security
│   ├── audit/                       # AuditorAwareImpl (AuditorAware<Long> - lấy userId của người dùng hiện tại)
│   ├── custom/                      # CustomUserDetails, CustomUserDetailsService, CustomAccessDeniedHandler, CustomAuthenticationEntryPoint
│   └── jwt/                         # JwtAuthenticationFilter, JwtUtil
└── modules/                         # 31 module nghiệp vụ khép kín theo Domain-Driven Feature
    ├── address/                     # Quản lý địa chỉ giao hàng
    ├── auth/                        # Đăng nhập, đăng ký, refresh token, đổi mật khẩu, xác thực OTP/email
    ├── author/                      # Quản lý tác giả (Admin/Public)
    ├── author_product/              # Quan hệ N-N giữa Author và Product
    ├── cart/                        # Giỏ hàng người dùng
    ├── cloudinary/                  # Upload & xử lý ảnh
    ├── favorite/                    # Sách yêu thích
    ├── gemini/                      # AI tóm tắt, sinh metadata sách tự động
    ├── genre/                       # Thể loại sách
    ├── genre_product/               # Quan hệ N-N giữa Genre và Product
    ├── googlebook/                  # Tra cứu thông tin từ Google Books
    ├── image_product/               # Ảnh sách (thumbnail & gallery)
    ├── notification/                # Thông báo hệ thống
    ├── order/                       # Quản lý đơn đặt hàng
    ├── others/                      # Sub-modules: banks, email, ghn, viettel
    ├── payment/                     # Tích hợp thanh toán
    ├── product/                     # Quản lý sản phẩm sách (Shop, Admin, User)
    ├── promotion/                   # Chương trình khuyến mãi của sàn/shop
    ├── promotion_product/           # Sản phẩm áp dụng khuyến mãi
    ├── publisher/                   # Nhà xuất bản
    ├── report_product/              # Báo cáo vi phạm sản phẩm
    ├── report_shop/                 # Báo cáo vi phạm cửa hàng
    ├── review/                      # Đánh giá & nhận xét sách
    ├── role/                        # Phân quyền vai trò người dùng
    ├── search_api/                  # Tìm kiếm thông tin mở rộng
    ├── series/                      # Bộ sách / Series
    ├── shipping/                    # Cấu hình & biểu phí vận chuyển
    ├── shop/                        # Quản lý cửa hàng / Vendor
    ├── user/                        # Quản lý hồ sơ người dùng
    ├── voucher/                     # Mã giảm giá
    └── wikipedia/                   # Tra cứu tiểu sử tác giả từ Wikipedia API
```

---

## 🏗️ 3. Kiến Trúc Phân Tầng & Luồng Phụ Thuộc (Architecture Flow)

Dự án áp dụng chặt chẽ kiến trúc phân tầng 7 lớp (chỉ dùng những layer thực sự tồn tại):

```
HTTP Request
     │
     ▼
[ Controller ]          (@RestController, @RequestMapping("/api/v1/..."))
     │
     ▼ (Nhận/Trả DTO)
[ DTO ]                 (Request / Filter / Response DTOs với validation)
     │
     ▼ (Gọi Service Interface)
[ Service ]             (Interface định nghĩa contract nghiệp vụ)
     │
     ▼ (Triển khai nghiệp vụ)
[ ServiceImpl ]         (@Service, @Transactional, logic kiểm tra và xử lý)
     │
     ├──► [ Mapper ]    (@Component, chuyển đổi tường minh Entity <-> DTO)
     │
     ▼ (Truy vấn dữ liệu)
[ Repository ]          (@Repository, Spring Data JpaRepository + Custom / Impl nếu cần)
     │
     ▼ (Ánh xạ Database)
[ Entity ]              (@Entity, extends BaseEntity, ánh xạ bảng MySQL)
```

**Nguyên tắc luồng dữ liệu:**
1. `Controller` **CHỈ** được gọi `Service` (không gọi trực tiếp `Repository`, không chứa logic nghiệp vụ).
2. `ServiceImpl` là nơi tập trung toàn bộ business logic, phối hợp giữa `Mapper`, `Repository`, và các `Service` phụ trợ khác.
3. `Mapper` là Spring `@Component` chịu trách nhiệm chuyển đổi giữa `Entity` và `DTO`. Không viết logic nghiệp vụ phức tạp trong Mapper.
4. `Repository` chỉ làm việc với `Entity` hoặc các Projection cụ thể.

---

## 🎮 4. Quy Tắc Dành Cho Controller (Controller Rules)

1. **Chỉ xử lý tầng HTTP:**
   - Tiếp nhận request (`@PathVariable`, `@RequestParam`, `@ModelAttribute`, `@RequestBody`).
   - Validate đầu vào bằng `@Valid`.
   - Gọi Service method tương ứng.
   - Trả về HTTP status và bọc dữ liệu trong `ResponseData<T>` qua `ResponseUtil`.
2. **Tuyệt đối không chứa Business Logic:**
   - Không kiểm tra logic nghiệp vụ phức tạp, không tính toán tiền nong, không query cơ sở dữ liệu trực tiếp trong Controller.
3. **Tuyệt đối không inject Repository vào Controller:**
   - Mọi thao tác đều phải đi qua tầng `Service`.
4. **Chuẩn hóa API Response (`ResponseUtil`):**
   - Trả về kèm data: `ResponseUtil.success("Thông điệp", data)`
   - Trả về thông điệp không có data: `ResponseUtil.successMessage("Thông điệp")`
   - Phân trang: `ResponseUtil.success("Thông điệp", pageResponse)`
5. **Lấy thông tin người dùng đang đăng nhập:**
   - Luôn sử dụng `@AuthenticationPrincipal CustomUserDetails userDetails` trong method controller:
   ```java
   @PostMapping("/shop/products")
   public ResponseEntity<ResponseData<ProductResponse>> create(
           @RequestBody @Valid ProductRequest request,
           @AuthenticationPrincipal CustomUserDetails userDetails) {
       ProductResponse response = productService.create(request, userDetails.getShop());
       return ResponseUtil.success("Thêm sản phẩm thành công", response);
   }
   ```
6. **Đường dẫn endpoint chuẩn RESTful:**
   - Tiền tố API luôn bắt đầu bằng `/api/v1/`.
   - Phân định rõ phạm vi:
     - Khách vãng lai / Người dùng: `/api/v1/products/**`, `/api/v1/auth/**`, `/api/v1/cart/**`
     - Kênh người bán: `/api/v1/shop/**`
     - Quản trị viên: `/api/v1/admin/**`

---

## 📦 5. Quy Tắc Dành Cho DTO (DTO Rules)

1. **Không tạo DTO trùng lặp chức năng:**
   - Trước khi tạo file DTO mới, PHẢI kiểm tra thư mục `dto/` của module xem DTO tương tự đã tồn tại hay chưa.
2. **Tổ chức DTO trong module:**
   - Với module lớn (như `product`): chia thành `dto/request/` và `dto/response/`.
   - Với module gọn (như `author`, `cart`): đặt trực tiếp trong `modules/{module}/dto/`.
3. **Quy tắc đặt tên DTO:**
   - Request tạo/cập nhật: `<Entity>Request.java` (VD: `ProductRequest`, `AuthorRequest`)
   - Request lọc/phân trang: `<Entity>FilterRequest.java` hoặc `<Scope><Entity>FilterRequest.java` (VD: `ShopProductFilterRequest`, `UserFilterRequest`)
   - Response chi tiết / danh sách: `<Entity>Response.java`, `<Entity>DetailResponse.java`, `<Entity>CardResponse.java`
4. **Validation bắt buộc trên Request DTO:**
   - Sử dụng các annotation chuẩn từ `jakarta.validation.constraints`: `@NotBlank`, `@NotNull`, `@Min`, `@Size`, `@NotEmpty`.
   - Luôn có thuộc tính `message` tiếng Việt rõ ràng:
     ```java
     @NotBlank(message = "Tên sản phẩm không được để trống")
     private String name;

     @NotNull(message = "Giá bán không được để trống")
     @Min(value = 0, message = "Giá bán không được âm")
     private Integer price;
     ```
5. **Không đổi tên field của DTO nếu chưa kiểm tra toàn bộ nơi sử dụng:**
   - Field DTO ánh xạ trực tiếp với JSON gửi lên hoặc nhận về từ Frontend. Đổi tên field sẽ làm gãy Frontend ngay lập tức!

---

## ⚙️ 6. Quy Tắc Dành Cho Service & ServiceImpl (Service Rules)

1. **Tách biệt rõ Interface và Implementation:**
   - `modules/{module}/service/{Feature}Service.java` (Interface)
   - `modules/{module}/service/impl/{Feature}ServiceImpl.java` (Implementation)
2. **Đồng bộ tuyệt đối giữa Service và ServiceImpl:**
   - Khi thêm, sửa hoặc xóa phương thức trong Service interface, PHẢI cập nhật ngay lập tức `ServiceImpl` tương ứng và mọi nơi gọi phương thức đó.
3. **Xử lý toàn bộ logic nghiệp vụ tại ServiceImpl:**
   - Kiểm tra tồn tại / trùng lặp (Uniqueness).
   - Kiểm tra quyền sở hữu (Ownership check): Ví dụ Shop chỉ được sửa sản phẩm của chính shop mình (`shopId`).
   - Tạo slug duy nhất (slugify / unique slug generation).
   - Gọi các service liên kết (như gắn `AuthorProduct`, `GenreProduct`, upload ảnh `ImageProduct`).
4. **Không ném ngoại lệ tùy tiện — sử dụng Custom Exceptions:**
   - Không tìm thấy dữ liệu: ném `new NotFoundException("...")`
   - Dữ liệu không hợp lệ / trạng thái sai: ném `new BadRequestException("...")`
   - Trùng lặp trường duy nhất: ném `new DuplicateFieldException(field, message)` hoặc `DuplicateFieldException(errorsMap)`

---

## 🗄️ 7. Quy Tắc Dành Cho Repository (Repository Rules)

1. **Kiểm tra Entity thực tế trước khi viết query:**
   - **CẢNH BÁO LỖI PHỔ BIẾN:** Tuyệt đối không tự suy diễn tên field dựa trên tên cột DB!
   - *Ví dụ thực tế trong dự án:* Entity `Product` khai báo:
     ```java
     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "shop_id", nullable = false)
     private Shop shop;
     ```
     => Trong entity **KHÔNG CÓ field `shopId`**.
     => JPQL query PHẢI viết: `WHERE item.shop.id = :shopId` (hoặc `findByShopId(Long shopId)`).
     => Viết `WHERE item.shopId = :shopId` sẽ gây lỗi QuerySyntaxException khi khởi động!
2. **Tránh lỗi N+1 Query:**
   - Với các quan hệ `@ManyToOne` cần hiển thị cùng lúc, sử dụng `@EntityGraph(attributePaths = {"shop", "publisher", "series"})` hoặc `JOIN FETCH` trong câu `@Query`.
3. **Truy vấn phân trang & lọc động:**
   - Với câu truy vấn cơ bản: sử dụng `@Query` kèm `Pageable` và kiểm tra null:
     ```java
     @Query("""
         SELECT p FROM Product p
         WHERE (:shopId IS NULL OR p.shop.id = :shopId)
           AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
     """)
     Page<Product> searchProducts(@Param("shopId") Long shopId, @Param("keyword") String keyword, Pageable pageable);
     ```
   - Với truy vấn động phức tạp có nhiều điều kiện hoặc subquery: Tạo Custom Repository interface (`ProductRepositoryCustom`) và file triển khai (`ProductRepositoryImpl`) sử dụng `EntityManager` và `CriteriaBuilder`.

---

## 🏛️ 8. Quy Tắc Dành Cho Entity (Entity Rules)

1. **Mọi Entity chính đều phải kế thừa `BaseEntity`:**
   - Kế thừa `com.dev.backend.common.entity.BaseEntity`:
     - `id`: `Long` (Primary Key, Identity)
     - `createdAt`: `LocalDateTime` (`@CreationTimestamp`, updatable = false)
     - `updatedAt`: `LocalDateTime` (`@UpdateTimestamp`)
     - `createdBy`: `Long` (ID của người dùng tạo, kiểu `Long`, không phải String!)
     - `updatedBy`: `Long` (ID của người dùng sửa cuối cùng, kiểu `Long`)
2. **Không tự ý thay đổi cấu trúc bảng đang có:**
   - KHÔNG đổi tên cột (`@Column(name = "...")`), kiểu dữ liệu cột, quan hệ khóa ngoại trừ khi có yêu cầu cụ thể từ User.
   - KHÔNG tự tiện xóa field, đổi `cascade = CascadeType.ALL` hay đổi `FetchType`.
3. **Quy tắc FetchType:**
   - Mọi quan hệ `@ManyToOne` và `@OneToOne` **BẮT BUỘC** dùng `fetch = FetchType.LAZY` để tránh hiệu ứng chuỗi truy vấn eager (Over-fetching).
4. **Cascade và quan hệ 1-N / N-N:**
   - Với bảng liên kết phụ thuộc hoàn toàn vào entity cha (ví dụ `Product` chứa `images`, `authorProducts`, `genreProducts`): sử dụng `cascade = CascadeType.ALL, orphanRemoval = true`.
   - Với bảng độc lập (như `orders`, `reviews` trong Product): dùng `@OneToMany(mappedBy = "product")` không có cascade ALL.

---

## 🔄 9. Quy Tắc Dành Cho Mapper (Mapper Rules)

1. **Sử dụng Mapper dạng Spring `@Component`:**
   - Mọi Mapper trong dự án là class thông thường được đánh dấu `@Component` (ví dụ `ProductMapper`, `AuthorMapper`, `ShopMapper`).
   - Không tự ý đưa MapStruct hay ModelMapper vào nếu dự án chưa tích hợp.
2. **Phương thức mapping chuẩn:**
   - Chuyển Request sang Entity: `public Entity toEntity(Entity entity, Request request)` hoặc `public Entity toEntity(Request request)`
   - Chuyển Entity sang Response DTO: `public Response toDTO(Entity entity)` hoặc `public Response toResponse(Entity entity)`
3. **Không lặp lại logic mapping trong ServiceImpl:**
   - Nếu module đã có `{Feature}Mapper`, trong `ServiceImpl` PHẢI inject và gọi mapper thay vì tự `new DTO()` và `set...()` rải rác.
4. **Tái sử dụng Utility formatting:**
   - Dùng `TextUtils.capitalizeFully(...)` để chuẩn hóa họ tên / tiêu đề.
   - Dùng `TextUtils.toSlug(...)` để tạo slug URL thân thiện.

---

## 🚨 10. Quy Tắc Xử Lý Ngoại Lệ (Exception Rules)

1. **Sử dụng hệ thống Exception sẵn có tại `com.dev.backend.common.exception`:**
   - `NotFoundException(String message)`: Trả về HTTP 404.
   - `BadRequestException(String message)`: Trả về HTTP 400.
   - `UnauthorizedException(String message)`: Trả về HTTP 401.
   - `DuplicateFieldException(String field, String message)`: Trả về HTTP 409 kèm Map lỗi validation trường.
   - `DuplicateFieldException(Map<String, String> errors)`: Trả về HTTP 409 kèm tập hợp các trường bị trùng.
   - `AppException(int code, String message)`: Trả về HTTP status tùy chỉnh theo code.
   - Từ chối truy cập: Ném `org.springframework.security.access.AccessDeniedException` (trả về HTTP 403).
2. **Tuyệt đối không tự tạo class Exception mới nếu đã có class tương ứng:**
   - *LƯU Ý ĐẶC BIỆT:* Dự án KHÔNG có class `ForbiddenException`. Khi muốn cấm quyền 403, dùng `AccessDeniedException` hoặc `new AppException(403, "...")`.
3. **Cấu trúc JSON phản hồi khi xảy ra lỗi:**
   Được `GlobalExceptionHandler` format chuẩn theo `ResponseData<Object>`:
   ```json
   {
     "success": false,
     "message": "Dữ liệu không hợp lệ!",
     "data": {
       "name": "Tên tác giả đã tồn tại."
     },
     "code": 409,
     "error": "CONFLICT",
     "path": "/api/v1/admin/authors",
     "timestamp": "2026-09-21"
   }
   ```

---

## 🔒 11. Quy Tắc Bảo Mật & Xác Thực (Security Rules)

1. **Cơ chế xác thực:**
   - JWT Access Token nằm trong request header: `Authorization: Bearer <token>`.
   - Refresh Token lưu an toàn trong HTTP-only Cookie.
2. **Cấu hình Endpoint trong `SecurityConfig.java`:**
   - Danh sách URL công khai nằm tại `SecurityConfig.PUBLIC_URLS`.
   - Nếu bạn tạo endpoint công khai mới (không cần đăng nhập), **bắt buộc** phải khai báo pattern trong mảng `PUBLIC_URLS`.
   - Mọi URL khác mặc định yêu cầu authenticated (`.anyRequest().authenticated()`).
3. **Lấy thông tin Context Người Dùng:**
   - Trong Controller: Tiêm `@AuthenticationPrincipal CustomUserDetails userDetails`.
   - Kiểm tra an toàn `userDetails != null` đối với các API hỗ trợ cả khách lẫn người dùng đăng nhập (như xem chi tiết sản phẩm / lọc sản phẩm).
   - Lấy `userId`: `userDetails.getUserId()`.
   - Lấy `shop`: `userDetails.getShop()` (tự động ném `BadRequestException` nếu user chưa có Shop).
4. **Kiểm tra quyền sở hữu (Ownership Guard):**
   - Khi Shop thực hiện Create/Update/Delete bất kỳ tài nguyên nào (sản phẩm, voucher, khuyến mãi), PHẢI luôn truyền `shopId = userDetails.getShop().getId()` xuống Service để đảm bảo không can thiệp vào tài nguyên của Shop khác.

---

## 💾 12. Quy Tắc Transaction (`@Transactional`)

1. **Đánh dấu rõ ràng trên ServiceImpl:**
   - Đặt `@Transactional` ở mức class level trên `ServiceImpl` cho các nghiệp vụ ghi dữ liệu (Create, Update, Delete).
   - Các phương thức chỉ đọc (Get, Search, Detail) **BẮT BUỘC** đánh dấu `@Transactional(readOnly = true)`.
2. **Thao tác ghi nhiều bảng (Multi-table mutation):**
   - Các logic tạo sản phẩm kèm theo danh sách tác giả, thể loại, ảnh... PHẢI nằm gọn trong một Transaction để đảm bảo tính toàn vẹn (ACID), tự động rollback nếu xảy ra lỗi giữa chừng.
3. **Không đặt `@Transactional` trong Controller:**
   - Quản lý transaction là trách nhiệm của tầng Service, không bao giờ đặt `@Transactional` trên Controller method.

---

## 📄 13. Quy Chuẩn Phân Trang (Pagination Pattern)

1. **Cấu trúc request phân trang:**
   - Frontend gửi `page` (thường là 1-indexed, bắt đầu từ 1) và `size`.
   - Trong ServiceImpl, khởi tạo `Pageable` với chỉ số 0-indexed:
     ```java
     Pageable pageable = PageRequest.of(
             Math.max(0, Optional.ofNullable(request.getPage()).orElse(1) - 1),
             Optional.ofNullable(request.getSize()).filter(s -> s > 0).orElse(10),
             Sort.by(Sort.Direction.DESC, "id")
     );
     ```
2. **Cấu trúc response phân trang (`PageResponse<T>`):**
   - Định dạng trả về của `PageResponse<T>`:
     - `items`: Danh sách dữ liệu (`List<T>`)
     - `page`: Trang hiện tại (`int`)
     - `size`: Kích thước trang (`int`)
     - `totalItems`: Tổng số phần tử (`long`)
     - `totalPages`: Tổng số trang (`int`)
   - Chuyển đổi từ `org.springframework.data.domain.Page`:
     ```java
     Page<Product> page = productRepository.search(...);
     return PageUtil.from(page.map(productMapper::toDTO));
     // hoặc:
     return new PageResponse<>(items, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
     ```
   - Chuẩn này khớp chính xác 100% với interface `Pagination<T>` tại `frontend/src/libs/utils/pagination.ts`.

---

## 🤝 14. Đồng Bộ API Contract Giữa Backend & Frontend

Khi sửa đổi hoặc thêm mới endpoint Backend, PHẢI đối chiếu với tầng Service của Frontend (`frontend/src/modules/**/services/*.service.ts`):

| Thành phần Contract | Yêu cầu kiểm tra đối soát |
| :--- | :--- |
| **HTTP Method** | Khớp chính xác `GET`, `POST`, `PUT`, `DELETE`. |
| **URL Path** | Khớp chính xác route, ví dụ `/api/v1/shop/products/filter`. |
| **Path Variable** | Tên placeholder (`{id}`, `{slug}`) phải nhất quán giữa `@PathVariable` và frontend request. |
| **Query Parameter** | Đối với `@RequestParam` và `@ModelAttribute`, tên param phải khớp với Object query của frontend. |
| **Request Body** | JSON field name, kiểu dữ liệu, các trường bắt buộc vs nullable. |
| **Multipart Upload** | Tên field file (ví dụ `file`, `images`) phải trùng với `FormData.append(...)` ở frontend. |
| **Response Wrapper** | Backend trả về `ResponseData<T>` khớp với `ApiResponse<T>` của frontend (`success`, `message`, `data`). |
| **Enums** | Các giá trị hằng số Enum (VD: `PENDING_APPROVAL`, `ACTIVE`, `REJECTED`) phải khớp với Type Enum ở frontend. |

---

## 🎯 15. Quy Tắc Thay Đổi Tối Thiểu (Minimal Change)

1. **Chỉ sửa đúng những gì được yêu cầu:**
   - Không tự ý format lại toàn bộ file hoặc toàn project.
   - Không tự ý đổi tên (rename) class, method, biến đang hoạt động ổn định.
   - Không tự ý tái cấu trúc (refactor) kiến trúc codebase nếu không có chỉ định từ User.
2. **Bảo tồn comments & docstrings:**
   - Giữ nguyên các comment giải thích nghiệp vụ hiện có trong code.

---

## 🔍 16. Tìm Kiếm Trước Khi Tạo Mới (Search Before Create)

Trước khi tạo bất kỳ file hoặc method mới:
1. **Tìm kiếm Class:** Tìm xem DTO, Entity, Service, Mapper tương tự đã tồn tại chưa (`find_by_name` hoặc `grep_search`).
2. **Tìm kiếm Method:** Kiểm tra xem Repository method hay Service method phục vụ cho mục đích đó đã có sẵn chưa.
3. **Tìm kiếm Endpoint:** Kiểm tra Controller để tránh tạo trùng route URL hoặc xung đột request mapping.

---

## 🔗 17. Đồng Bộ Phụ Thuộc (Dependency Synchronization)

Khi bạn thay đổi chữ ký của một method (signature):
1. **Tìm kiếm toàn bộ vị trí gọi (Callers):**
   - Tìm kiếm tên method trong toàn bộ thư mục `backend/src/main/java`.
2. **Cập nhật đồng thời:**
   - Sửa Interface -> Sửa ServiceImpl.
   - Sửa Service method -> Sửa Controller và các Service liên quan đang gọi nó.
   - Sửa DTO -> Sửa Mapper và Controller/Frontend liên quan.
   - Tuyệt đối không để lại compile errors ở các class phụ thuộc!

---

## 🧪 18. Xác Minh Biên Dịch (Compile Verification)

Sau khi tạo mới hoặc chỉnh sửa bất kỳ file Java nào:
1. **Bắt buộc chạy lệnh biên dịch:**
   - Trên Windows: `.\mvnw.cmd compile`
   - Trên Linux / macOS: `./mvnw compile`
2. **Quy tắc trung thực:**
   - Tuyệt đối **KHÔNG ĐƯỢC** thông báo với User rằng "code đã biên dịch thành công" nếu bạn chưa thực sự chạy lệnh và thấy kết quả `BUILD SUCCESS` trong output terminal!
3. **Xử lý lỗi biên dịch:**
   - Nếu có lỗi biên dịch, đọc kỹ log compiler, sửa triệt để các lỗi type/import/syntax và biên dịch lại cho đến khi pass.

---

## 🛡️ 19. An Toàn Git & File Hệ Thống (Git Safety)

Tuyệt đối **KHÔNG ĐƯỢC** thực hiện các hành động sau trừ khi được User yêu cầu rõ ràng:
- `git reset --hard`
- `git checkout .` / `git restore .`
- Xóa file ngoài phạm vi task
- Ghi đè cưỡng bức (force overwrite) các file chứa thay đổi chưa commit của User.
