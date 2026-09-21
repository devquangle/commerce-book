# 🤖 AGENTS.md - Hướng Dẫn Dành Cho AI Coding Agents

> **Tài liệu quy chuẩn dành cho các AI Agent (Gemini, Claude, Cursor, Copilot, Windsurf,...) khi làm việc trong kho mã nguồn Commerce-Book.**  
> Hãy đọc kỹ tài liệu này trước khi phân tích, viết mã, sửa lỗi hoặc tái cấu trúc bất kỳ phần nào của hệ thống.

---

## 📌 1. Tổng Quan Dự Án & Nghiệp Vụ (Project Overview)

- **Tên dự án:** Commerce Book
- **Loại hình:** Nền tảng Thương mại Điện tử chuyên biệt về sách đa người bán (**Multi-vendor E-Commerce Platform**).
- **Mô hình kiến trúc:** Tách biệt hoàn toàn Frontend SPA và Backend RESTful API:
  - `backend/`: Ứng dụng Spring Boot 4.1.x, Java 21, Hibernate/JPA, MySQL 8.
  - `frontend/`: Ứng dụng Single Page Application (SPA) React 19, TypeScript, Vite 7, Tailwind CSS v4.
- **3 Phân hệ đối tượng chính:**
  1. **Khách hàng (User/Customer):** Tìm kiếm sách đa phương thức (Text, Filter, Voice Recognition), giỏ hàng thời gian thực, đặt hàng đa shop, áp dụng voucher sàn & shop, tính phí vận chuyển GHN tự động, đánh giá/bình luận sách.
  2. **Người bán (Shop/Vendor):** Quy trình đăng ký mở shop xác thực eKYC CCCD (Viettel AI), quản lý kho & đăng bán sách có hỗ trợ sinh metadata tự động từ Google Gemini AI, quản lý đơn hàng theo shop, tạo khuyến mãi & voucher riêng, chat trực tiếp với khách qua Twilio Conversations.
  3. **Quản trị viên (Super Admin):** Kiểm duyệt sách (Approve/Reject kèm lý do), quản lý và duyệt hồ sơ Shop, quản lý danh mục toàn sàn (Genres, Authors, Publishers, Series), xử lý báo cáo vi phạm, theo dõi thống kê doanh thu toàn sàn.

---

## 📂 2. Cấu Trúc Tổng Thể Thư Mục (Repository Structure)

```text
commerce-book/
├── backend/                   # Spring Boot 4 Application (Java 21)
│   ├── src/main/java/com/dev/backend/
│   │   ├── BackendApplication.java
│   │   ├── common/            # BaseEntity, constants, exceptions, responses, utils
│   │   ├── config/            # Security, Cloudinary, Gemini, GHN, Viettel configs
│   │   ├── security/          # JWT filter, CustomUserDetailsService, audit
│   │   └── modules/           # Các module nghiệp vụ độc lập (product, order, shop,...)
│   ├── src/main/resources/    # application.yaml, application-dev.yaml
│   ├── pom.xml                # Maven dependencies & build configurations
│   └── README.md
│
├── frontend/                  # React 19 + TypeScript + Vite 7 Application
│   ├── src/
│   │   ├── components/        # Reusable UI components (Button, Input, Modal,...)
│   │   ├── context/           # React Context (AuthContext, CartContext,...)
│   │   ├── hooks/             # Generic hooks dùng chung (useDebounce,...)
│   │   ├── layouts/           # App layouts (UserLayout, ShopLayout, AdminLayout)
│   │   ├── libs/              # Axios instance, formatting utils, toast utils
│   │   ├── modules/           # Feature-first modules (admin, auth, product, shop, user)
│   │   ├── providers/         # Providers bọc quanh ứng dụng (React Query, Toast,...)
│   │   ├── routes/            # Hệ thống routes & route guards
│   │   ├── services/          # Các tầng service gọi API (Axios)
│   │   └── types/             # Kiểu dữ liệu TypeScript dùng chung
│   ├── package.json           # npm scripts & dependencies
│   ├── tsconfig.app.json      # Cấu hình TypeScript (chú ý: verbatimModuleSyntax)
│   └── README.md
│
├── .graphify/                 # Codebase Knowledge Graph (nếu được kích hoạt)
├── CLAUDE.md                  # Hướng dẫn graphify & Claude agent
├── PROJECT_CONTEXT.md         # Ngữ cảnh dự án & quy chuẩn backend
└── README.md                  # Tài liệu tổng quan toàn bộ dự án
```

---

## ☕ 3. Quy Chuẩn Backend (Spring Boot 4 / Java 21)

### 3.1. Tech Stack Backend
- **Core:** Java 21 (LTS), Spring Boot 4.1.x, Spring MVC, Spring Data JPA.
- **Bảo mật:** Spring Security 6.x, JJWT 0.11.5 (Stateless Authentication, Bearer Token & HTTP-Only Cookie Refresh Token).
- **Cơ sở dữ liệu:** MySQL 8.x, Hibernate ORM.
- **Tích hợp bên thứ ba:**
  - **Google Gemini AI (`com.google.genai:google-genai:1.53.0`):** Sinh metadata, tóm tắt và phân loại sách tự động.
  - **Viettel AI eKYC:** OCR thẻ CCCD 2 mặt và đối soát khuôn mặt chân dung.
  - **Giao Hàng Nhanh (GHN Express):** Đồng bộ địa giới hành chính và tính phí ship thời gian thực.
  - **Cloudinary (`com.cloudinary:cloudinary-http44:1.33.0`):** Upload và quản lý ảnh tối ưu CDN.
  - **Google Books & Wikipedia API:** Tra cứu bổ trợ thông tin tác giả, NXB, sách.
  - **Tiện ích:** Lombok, Apache POI (Excel), Slugify, Commons-Text, NV-i18n.

### 3.2. Cấu Trúc Module (`com.dev.backend.modules.*`)
Mỗi module nghiệp vụ **phải** được đóng gói theo mô hình phân tầng chuẩn sau:
```text
modules/{module_name}/
├── controller/     # @RestController, @RequestMapping("/api/v1/{module}")
├── service/        # Interface khai báo phương thức nghiệp vụ
│   └── impl/       # Implementation của Service (@Service, @Transactional)
├── repository/     # Spring Data JPA Repository (@Repository)
├── entity/         # JPA Entity kế thừa BaseEntity (@Entity, @Table)
├── dto/            # Request / Response DTOs kèm validation (jakarta.validation.constraints)
└── mapper/         # Component hoặc Helper chuyển đổi Entity <-> DTO
```

### 3.3. Các Quy Tắc Bắt Buộc Khi Viết Code Backend

1. **Kế thừa Entity từ `BaseEntity`:**
   Mọi Entity JPA đều phải kế thừa `com.dev.backend.common.entity.BaseEntity` để tự động hóa quản lý audit fields:
   - `id`: `Long` (Primary Key, `@GeneratedValue(strategy = GenerationType.IDENTITY)`)
   - `createdAt`: `LocalDateTime` (`@CreatedDate`)
   - `updatedAt`: `LocalDateTime` (`@LastModifiedDate`)
   - `createdBy`: `String` (`@CreatedBy`)
   - `updatedBy`: `String` (`@LastModifiedBy`)

2. **Chuẩn hóa API Response:**
   Tuyệt đối **không** trả về raw Entity hoặc cấu trúc JSON tùy tiện. Luôn bao bọc qua `ResponseData<T>` hoặc `PageResponse<T>` từ `com.dev.backend.common.response`:
   ```java
   // Trả về dữ liệu thành công kèm payload
   return ResponseUtil.success("Lấy thông tin sách thành công", bookDto);

   // Trả về thông điệp thành công không có payload
   return ResponseUtil.successMessage("Xóa sản phẩm thành công");

   // Trả về dữ liệu phân trang
   Page<BookResponse> pageData = bookService.getBooks(filterRequest, pageable);
   return ResponseUtil.success("Lấy danh sách thành công", PageUtil.toPageResponse(pageData));
   ```

3. **Cấu trúc JSON Response tiêu chuẩn:**
   ```json
   {
     "status": 200,
     "message": "Thông điệp thành công",
     "data": { ... }
   }
   ```

4. **Xử lý Ngoại lệ (Global Exception Handling):**
   Ném các custom exception từ `com.dev.backend.common.exception` thay vì bắt nuốt lỗi (catch & suppress):
   - `BadRequestException("Dữ liệu không hợp lệ")` -> Trả về HTTP 400
   - `UnauthorizedException("Chưa đăng nhập hoặc token hết hạn")` -> Trả về HTTP 401
   - `ForbiddenException("Không có quyền thực hiện thao tác")` -> Trả về HTTP 403
   - `NotFoundException("Không tìm thấy tài nguyên")` -> Trả về HTTP 404
   - `DuplicateFieldException("Mã ISBN hoặc email đã tồn tại")` -> Trả về HTTP 409
   - `AppException(ApiErrorCode.XXX)` -> Sử dụng với mã lỗi nghiệp vụ định sẵn.

5. **Lấy Thông Tin Người Dùng Đăng Nhập:**
   Sử dụng `@AuthenticationPrincipal CustomUserDetails userDetails` trong Controller:
   ```java
   @GetMapping("/my-shop")
   public ResponseEntity<ResponseData<ShopResponse>> getMyShop(
           @AuthenticationPrincipal CustomUserDetails userDetails) {
       Long userId = userDetails.getUserId();
       Long shopId = userDetails.getShop().getId();
       // ...
   }
   ```

6. **Transaction & Performance:**
   - Đánh dấu `@Transactional(readOnly = true)` trên các phương thức chỉ đọc của Service.
   - Đánh dấu `@Transactional` trên các phương thức Create/Update/Delete.
   - Luôn sử dụng eager/lazy loading hợp lý, dùng `JOIN FETCH` hoặc EntityGraph để tránh lỗi N+1 Query.

---

## ⚛️ 4. Quy Chuẩn Frontend (React 19 / TypeScript / Vite 7)

### 4.1. Tech Stack Frontend
- **Framework & Runtime:** React 19, TypeScript (~5.9), Vite 7.
- **Styling & UI:** Tailwind CSS v4 (`@tailwindcss/vite`), FlyonUI, Lucide React, Swiper.
- **State & Server Cache:** TanStack React Query v5.
- **HTTP Client:** Axios với interceptors tự động làm mới access token (`authAxios` & `publicAxios`).
- **Form & Validation:** React Hook Form.
- **Trình soạn thảo văn bản:** Tiptap Editor (Rich Text).
- **Tính năng đặc thù:** Web Speech Recognition (tìm giọng nói), Twilio Conversations (realtime chat), MediaPipe (xử lý hình ảnh).

### 4.2. Kiến Trúc Dữ Liệu 3 Tầng (3-Tier Data Flow)
```
UI Component (View)
   │ (1. Gọi hook)
   ▼
Custom Hook (TanStack React Query: useQuery, useMutation)
   │ (2. Gọi service)
   ▼
Service Layer (Axios instance: authAxios / publicAxios)
   │ (3. HTTP Request/Response bóc tách Envelope)
   ▼
Backend REST API (/api/v1/...)
```

### 4.3. Cấu Trúc Module Tính Năng (`src/modules/<domain>/<feature>/`)
Mỗi tính năng được tổ chức khép kín:
```text
src/modules/<domain>/<feature>/
├── types/
│   └── <feature>.type.ts        # Định nghĩa kiểu TypeScript
├── services/
│   └── <feature>.service.ts     # Các hàm gọi API HTTP (Axios)
├── hooks/
│   └── use<Feature>.ts          # Tích hợp TanStack Query
├── components/                  # UI Components riêng của feature
└── pages/                       # Page routes
```

### 4.4. Các Quy Tắc Bắt Buộc Khi Viết Code Frontend

1. **QUY TẮC TYPE IMPORT (`verbatimModuleSyntax: true`):**
   > [!IMPORTANT]
   > Cấu hình `tsconfig.app.json` bật `verbatimModuleSyntax: true`. Khi import bất kỳ type hoặc interface nào, **BẮT BUỘC PHẢI DÙNG TỪ KHÓA `type`**. Vi phạm sẽ gây lỗi biên dịch ngay lập tức!
   ```ts
   // ✅ ĐÚNG:
   import type { ProductResponse, ProductFilterParams } from "../types/product.type";
   import type { Pagination } from "@/libs/utils/pagination";

   // ❌ SAI (Compile Error):
   import { ProductResponse, ProductFilterParams } from "../types/product.type";
   ```

2. **Quy Ước Đặt Tên Type (`types/`):**
   - Entity từ server: `...Response` (VD: `BookResponse`, `ShopDetailResponse`).
   - Dữ liệu gửi lên server: `...Request` (VD: `CreateBookRequest`, `UpdateProfileRequest`).
   - Bộ lọc và phân trang: `...FilterRequest` hoặc `...FilterParams` (VD: `BookFilterParams`).
   - Trạng thái / Enum: `...Status` (VD: `type BookStatus = "PENDING" | "APPROVED" | "REJECTED"`).
   - Hàm hiển thị label: `getLabel...Status(status: BookStatus): string`.

3. **Sử Dụng Tầng Service & Bóc Tách Envelope:**
   - Dùng `publicAxios` cho các API công khai không cần đăng nhập.
   - Dùng `authAxios` cho các API yêu cầu đăng nhập (tự động gắn `Authorization: Bearer <token>` và làm mới token khi nhận 401).
   - Service function bóc tách `res.data.data` và trả về trực tiếp dữ liệu cần dùng.
   ```ts
   // Ví dụ trong <feature>.service.ts
   import authAxios from "@/libs/config/axios.config";
   import type { ApiResponse } from "@/libs/utils/api-response";
   import type { ProductResponse } from "../types/product.type";

   export const getProductDetail = async (slug: string): Promise<ProductResponse> => {
     const response = await authAxios.get<ApiResponse<ProductResponse>>(`/products/${slug}`);
     if (!response.data.data) {
       throw new Error("Không có dữ liệu sản phẩm");
     }
     return response.data.data;
   };
   ```

4. **Sử Dụng TanStack React Query Hooks:**
   - Định nghĩa Query Key nhất quán dưới dạng mảng: `["products", "detail", slug]`.
   - Sử dụng `useMutation` kèm `onSuccess` để tự động invalidate queries:
     ```ts
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: updateProduct,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["products"] });
         showSuccessToast("Cập nhật sách thành công!");
       },
       onError: (error) => {
         showErrorToast(getErrorMessage(error));
       },
     });
     ```

5. **Xử Lý Toast & Error Tiêu Chuẩn:**
   - Hiển thị Toast thông báo: Sử dụng `showSuccessToast` và `showErrorToast` từ `@/libs/utils/toastUtil`.
   - Trích xuất thông báo lỗi: Sử dụng `getErrorMessage(error)` từ `@/libs/utils/error`.

---

## 🛠️ 5. Lệnh Phát Triển, Kiểm Thử & Biên Dịch (Commands & Workflows)

### 5.1. Backend (Spring Boot / Maven)
Thực hiện từ thư mục `backend/`:

| Tác vụ | Lệnh thực thi |
| :--- | :--- |
| Chạy môi trường Dev (Windows) | `.\mvnw.cmd spring-boot:run` |
| Chạy môi trường Dev (Linux/macOS) | `./mvnw spring-boot:run` |
| Build đóng gói bỏ qua kiểm thử | `.\mvnw.cmd clean install -DskipTests` |
| Chạy toàn bộ Unit & Integration Tests | `.\mvnw.cmd test` |
| Kiểm tra cú pháp & biên dịch | `.\mvnw.cmd compile` |

> Mặc định backend chạy tại: `http://localhost:8080`.  
> Cơ sở dữ liệu MySQL cấu hình tại: `jdbc:mysql://localhost:3306/ecom_store_book`.

### 5.2. Frontend (React / Vite / npm)
Thực hiện từ thư mục `frontend/`:

| Tác vụ | Lệnh thực thi |
| :--- | :--- |
| Cài đặt dependencies | `npm install` |
| Chạy Development Server | `npm run dev` (mặc định tại `http://localhost:5173`) |
| Kiểm tra kiểu TypeScript & Build | `npm run build` (`tsc -b && vite build`) |
| Kiểm tra linter | `npm run lint` |
| Chạy Unit Tests với Vitest | `npm run test:unit` |
| Chạy E2E Tests với Playwright | `npm run test:e2e` |
| Xem trước bản build Production | `npm run preview` |

---

## 🚀 6. Hướng Dẫn Quy Trình Thêm Tính Năng Mới Cho AI Agent

Khi nhận yêu cầu tạo mới hoặc sửa đổi một tính năng end-to-end, AI Agent cần tuân theo trình tự sau:

### Bước 1: Phân tích & Thiết kế
1. Xác định phân hệ liên quan (`Customer`, `Shop`, `Admin`, hoặc dùng chung).
2. Kiểm tra các module hiện có để tái sử dụng entity/DTO/service nếu có.

### Bước 2: Triển khai Backend
1. **Entity:** Tạo thực thể kế thừa `BaseEntity`, cấu hình mapping quan hệ (`@ManyToOne`, `@OneToMany`,...).
2. **Repository:** Tạo interface kế thừa `JpaRepository` hoặc `JpaSpecificationExecutor`.
3. **DTOs:** Tạo `<Feature>Request`, `<Feature>Response`, `<Feature>FilterRequest` kèm validation annotations.
4. **Mapper:** Tạo mapper chuyển đổi giữa DTO và Entity.
5. **Service & ServiceImpl:** Viết logic xử lý, kiểm tra quyền và ném custom exceptions tương ứng.
6. **Controller:** Tạo `@RestController`, đánh dấu `@RequestMapping("/api/v1/...")`, bọc kết quả trong `ResponseData<T>` hoặc `PageResponse<T>`.
7. **SecurityConfig:** Cập nhật phân quyền endpoint trong `SecurityConfig.java` nếu cần thiết (`ROLE_ADMIN`, `ROLE_SHOP`, `ROLE_USER`, hoặc permitAll).

### Bước 3: Triển khai Frontend
1. **Types:** Tạo `types/<feature>.type.ts` với đầy đủ Response, Request, Status và nhớ dùng `import type` cho các kiểu phụ thuộc.
2. **Services:** Tạo `services/<feature>.service.ts`, sử dụng `publicAxios` hoặc `authAxios`, bóc tách response data.
3. **Hooks:** Tạo `hooks/use<Feature>.ts` sử dụng `useQuery` và `useMutation` từ TanStack Query, gọi `showSuccessToast` và `showErrorToast`.
4. **Components & Pages:** Viết giao diện với Tailwind CSS v4, FlyonUI và Lucide Icons, kết nối form qua React Hook Form.
5. **Routing:** Khai báo route trong `routes/` với Guard tương ứng (`UserRoutes`, `ShopRoutes`, `AdminRoutes`, hoặc `ProtectedRoute`).

### Bước 4: Kiểm Tra & Xác Minh (Verification)
1. **Frontend:** Luôn chạy `npm run build` trong thư mục `frontend` để đảm bảo không vi phạm TypeScript và `verbatimModuleSyntax`.
2. **Backend:** Chạy `.\mvnw.cmd compile` hoặc chạy tests liên quan để đảm bảo không lỗi cú pháp hoặc mapping Hibernate.

---

## 🛡️ 7. Các Nguyên Tắc An Toàn & Lưu Ý Quan Trọng (Safety & Agent Guidelines)

1. **Bảo mật & Secrets:**
   - **Tuyệt đối không** hardcode mật khẩu, JWT Secret, Mail password, API Key (Gemini, Viettel, GHN, Cloudinary) vào mã nguồn.
   - Luôn sử dụng biến môi trường hoặc file `application-dev.yaml` / `.env`.
2. **Giữ gìn tính toàn vẹn của mã:**
   - Không xóa bừa các chú thích (comments), docstring hoặc cấu hình có sẵn trừ khi được yêu cầu rõ ràng.
   - Giữ nguyên convention format mã nguồn của từng ngôn ngữ (Java CamelCase/PascalCase, TypeScript PascalCase cho Component/Type, camelCase cho biến/hàm).
3. **Thao tác Git & File hệ thống:**
   - Không tự ý commit hoặc sửa đổi các file tạm, thư mục `.graphify/cache`, file nhị phân lớn.
   - Tránh thay đổi cấu trúc thư mục cốt lõi nếu không có chỉ định từ lập trình viên.
4. **Knowledge Graph & Graphify:**
   - Nếu dự án có kích hoạt Graphify, hãy tra cứu thông tin kiến trúc qua `graphify query` hoặc tham khảo `CLAUDE.md`. Sau khi sửa đổi các file quan trọng, cân nhắc cập nhật lại đồ thị kiến trúc nếu công cụ sẵn sàng.
