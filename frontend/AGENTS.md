# 🤖 AGENTS.md - Hướng Dẫn Kỹ Thuật Dành Cho AI Agent Trên Frontend

> **Tài liệu quy chuẩn kỹ thuật dành riêng cho các AI Coding Agent làm việc trong module `frontend/` của Commerce-Book.**  
> Tài liệu này phản ánh chính xác 100% kiến trúc, cấu trúc thư mục, luồng dữ liệu, naming convention và các quy tắc thực tế đang hoạt động trong codebase frontend. **Tuyệt đối không áp đặt architecture mới.**

---

## 📌 1. Tổng Quan Kỹ Thuật (Tech Stack & Runtime)

- **Framework & Core:** React 19 (`19.2.0`), TypeScript (`~5.9.3`), Vite 7 (`7.2.4`), Node.js (ESM - `"type": "module"`).
- **Routing:** React Router DOM v7 (`^7.11.0`) với Lazy loading & Route Guards (`ProtectedRoute`, `GuestRoute`).
- **Server State & Caching:** TanStack React Query v5 (`^5.100.5`).
- **HTTP Client:** Axios (`^1.13.6`) với 2 instances phân quyền (`publicAxios` & `authAxios`), tự động Refresh Token qua Queue Interceptor.
- **Form & Validation:** React Hook Form (`^7.71.2`) kết hợp các form controller components bọc ngoài (`FormInput`, `FormSelect`,...).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, `@tailwindcss/typography`, `@import "tailwindcss"`), FlyonUI (`^2.4.1`), Lucide React (`^0.561.0`).
- **Notification & UI Feedback:** React Toastify (`^11.0.5`).
- **Text Editor & Rich Content:** Tiptap Editor v3 (`@tiptap/react`, StarterKit, Table, Typography).
- **Tích Hợp Chuyên Sâu:**
  - Web Speech Recognition (`react-speech-recognition`): Tìm kiếm giọng nói.
  - MediaPipe Vision (`@mediapipe/tasks-vision`) & `react-webcam`: Xử lý hình ảnh eKYC.
  - Twilio Conversations (`@twilio/conversations`): Chat thời gian thực đa người bán.
  - Swiper (`swiper/react`): Carousel hiển thị sản phẩm, banner.

---

## 📂 2. Cấu Trúc Thư Mục Thực Tế (`frontend/src/`)

```text
frontend/
├── src/
│   ├── assets/              # Hình ảnh, icons tĩnh của ứng dụng
│   ├── components/          # Tầng UI Components dùng chung
│   │   ├── ui/              # Primitive components độc lập (Button, InputField, SelectBox, Modal,...)
│   │   ├── common/          # React Hook Form wrappers (FormInput, FormSelect) & Shared widgets (Upload, Search,...)
│   │   ├── admin/           # UI components dùng chung trong phân hệ Admin
│   │   ├── shop/            # UI components dùng chung trong phân hệ Shop
│   │   ├── user/            # Header, Footer, Sidebar của khách hàng
│   │   ├── auth/            # Form đăng nhập, đổi mật khẩu, ProfileForm
│   │   ├── product/         # Thẻ sản phẩm, slider, flash sale card
│   │   └── payment/         # Component thanh toán, giỏ hàng tóm tắt
│   ├── context/             # React Contexts (useAuth.ts,...)
│   ├── hooks/               # Custom hooks phi nghiệp vụ dùng chung (useDebounce.ts,...)
│   ├── layouts/             # Các khung giao diện chính:
│   │   ├── UserLayout.tsx   # Khung giao diện khách hàng (Header + Sidebar + Footer)
│   │   ├── ShopLayout.tsx   # Khung người bán (Shop Sidebar + Header)
│   │   ├── AdminLayout.tsx  # Khung quản trị viên (Admin Sidebar + Header)
│   │   └── ProfileLayout.tsx # Khung trang cá nhân khách hàng (Menu bên trái + Outlet)
│   ├── libs/                # Thư viện lõi & Cấu hình tập trung
│   │   ├── config/          # axios.config.ts (authAxios, publicAxios, Refresh Token logic)
│   │   ├── constant/        # admin-path.ts, shop-path.ts, role.type.ts, token.type.ts
│   │   └── utils/           # api-response.ts, pagination.ts, error.ts, toastUtil.ts, cookie.ts, formatMoney.utils.ts,...
│   ├── modules/             # Cấu trúc Module Feature-First (Domain-Driven)
│   │   ├── admin/           # Quản trị: authors, genres, publishers, series, products, stores, dashboard,...
│   │   ├── shop/            # Người bán: products, vouchers, promotions, stores, orders, chats, inventory,...
│   │   ├── user/            # Khách hàng: cart, address, login, register, payment, register-shop, product-detail,...
│   │   ├── auth/            # Xác thực người dùng: me, update profile, change password
│   │   ├── product/         # Nghiệp vụ sản phẩm công khai & tìm kiếm
│   │   └── others/          # Dịch vụ ngoài: bank (VietQR), ekyc (CCCD OCR), ghn (GHN shipping), twilio (Chat)
│   ├── providers/           # Providers bọc ứng dụng (AuthProvider.tsx)
│   ├── routes/              # Hệ thống định tuyến:
│   │   ├── AdminRoutes.tsx  # Định tuyến phân hệ Admin
│   │   ├── ShopRoutes.tsx   # Định tuyến phân hệ Shop
│   │   ├── UserRoutes.tsx   # Định tuyến khách hàng & trang công khai
│   │   ├── ProtectedRoute.tsx # Route Guard chặn phân quyền (Role-based)
│   │   └── GuestRoute.tsx   # Route Guard cho khách chưa đăng nhập (Login/Register)
│   ├── services/            # Services đa tính năng không thuộc riêng 1 domain (cloudinary/...)
│   ├── types/               # Kiểu dữ liệu toàn cục (.d.ts, image.type.ts)
│   ├── App.tsx              # Cấu hình Providers tree (QueryClient, Auth, Chat, Router, Toast)
│   ├── main.tsx             # Entry point ReactDOM root
│   └── index.css            # Tailwind v4 import, custom utilities (@utility card-custom,...)
├── tests/                   # Thư mục kiểm thử (unit, e2e, business)
├── package.json             # Scripts & npm dependencies
├── tsconfig.app.json        # TypeScript config (verbatimModuleSyntax: true)
└── vite.config.ts           # Vite + Tailwind + alias "@" -> "./src"
```

---

## 🏗️ 3. Luồng Dữ Liệu 3 Tầng Thực Tế (3-Tier Data Flow)

Trong mỗi tính năng tại `src/modules/<domain>/<feature>/`:

```
┌────────────────────────────────────────────────────────┐
│ UI Component (VD: AuthorTable, ShopProductPage)        │
└─────────────────────────┬──────────────────────────────┘
                          │ (1. Gọi hook)
                          ▼
┌────────────────────────────────────────────────────────┐
│ Custom Hook (React Query: useQuery, useMutation)       │  <--- Quản lý Cache, State, Toast, Invalidation
└─────────────────────────┬──────────────────────────────┘
                          │ (2. Gọi service function)
                          ▼
┌────────────────────────────────────────────────────────┐
│ Service Layer (Axios: authAxios, publicAxios)          │  <--- Bóc tách res.data.data, kiểm tra success, throw Error
└─────────────────────────┬──────────────────────────────┘
                          │ (3. HTTP Request / Response)
                          ▼
┌────────────────────────────────────────────────────────┐
│ Backend RESTful API (/api/v1/...)                      │
└────────────────────────────────────────────────────────┘
```

Mỗi feature khép kín bắt buộc có cấu trúc con:
```text
src/modules/<domain>/<feature>/
├── types/
│   └── <feature>.type.ts        # Định nghĩa Request, Response, Status, Filter
├── services/
│   └── <feature>.service.ts     # Object Service chứa các async API methods
├── hooks/
│   └── use<Feature>.ts          # TanStack Query hooks kèm Query Key Factory
├── components/                  # UI components độc quyền của feature
└── pages/                       # Page components được lazy-load vào routes
```

---

## 🏷️ 4. Quy Chuẩn TypeScript & Naming Conventions

### 4.1. QUY TẮC BẮT BUỘC: `verbatimModuleSyntax: true`
File `tsconfig.app.json` bật cờ `verbatimModuleSyntax: true` và `erasableSyntaxOnly: true`.  
> [!CAUTION]
> Khi import bất kỳ type hoặc interface nào, **BẮT BUỘC PHẢI DÙNG TỪ KHÓA `type`**. Không tuân thủ sẽ gây lỗi biên dịch `TS1484` ngay lập tức!
```ts
// ✅ ĐÚNG:
import type { AuthorResponse, AuthorRequest } from "../types/author.type";
import type { Pagination } from "@/libs/utils/pagination";
import type { ApiResponse } from "@/libs/utils/api-response";

// ❌ SAI (Gây lỗi compile):
import { AuthorResponse, AuthorRequest } from "../types/author.type";
```

### 4.2. Quy Ước Đặt Tên Kiểu Dữ Liệu (`types/`)
| Hậu tố / Tiền tố | Mục đích | Ví dụ |
| :--- | :--- | :--- |
| `...Response` | Dữ liệu trả về từ máy chủ | `AuthorResponse`, `ProductDetailResponse`, `UserResponse` |
| `...Request` | Dữ liệu gửi lên server (Create / Update) | `AuthorRequest`, `CreateBookRequest`, `LoginRequest` |
| `...FilterRequest` / `...FilterParams` | Tham số lọc & phân trang (URL / Query params) | `AuthorFilterRequest`, `ProductFilterParams` |
| `...Status` | Union type biểu diễn enum trạng thái | `type AuthorStatus = "ACTIVE" \| "INACTIVE" \| "DELETED"` |
| `getLabel...Status` | Helper function dịch trạng thái sang tiếng Việt | `getLabelAuthorStatus(status: AuthorStatus)` |

### 4.3. Kiểu Dữ Liệu Chuẩn Toàn Sàn (Shared Types)
- **Envelope Server Response:** `@/libs/utils/api-response.ts`
  ```ts
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    code?: number;
    error?: string;
    path?: string;
    timestamp: string;
  }
  ```
- **Phân Trang Chuẩn:** `@/libs/utils/pagination.ts`
  ```ts
  export interface Pagination<T> {
    items: T[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  }
  ```

---

## 🌐 5. Tầng Service & Cấu Hình Axios (`services/` & `libs/config/`)

### 5.1. Hai Instance Axios Riêng Biệt (`@/libs/config/axios.config.ts`)
1. **`publicAxios`**:
   - Dùng cho các endpoint không cần đăng nhập: `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/refresh`, xem danh mục sách công khai,...
   - Đã cấu hình `withCredentials: true` (để tự động gửi cookie `refreshToken` khi gọi refresh).
2. **`authAxios`**:
   - Dùng cho các endpoint cần xác thực (User Profile, Shop, Admin, Giỏ hàng, Đặt hàng,...).
   - Có Request Interceptor tự động gắn token từ cookie: `Authorization: Bearer <accessToken>`.
   - Có Response Interceptor 401 tự động đưa request vào `failedQueue`, gọi `AuthService.refreshToken()`, cập nhật `setAuthToken(accessToken)` và thử lại toàn bộ request chờ. Nếu refresh thất bại, xóa token và điều hướng về `/login`.

### 5.2. Chuẩn Viết Service Function
- **Không** sử dụng React hooks hay state trong tầng service (pure async functions).
- Luôn kiểm tra `res.data.success` và `res.data.data`. Ném lỗi có thông điệp rõ ràng khi thất bại.
- Luôn định kiểu trả về `Promise<T>` rõ ràng.
```ts
import { authAxios } from "@/libs/config/axios.config";
import type { ApiResponse } from "@/libs/utils/api-response";
import type { Pagination } from "@/libs/utils/pagination";
import type { AuthorFilterRequest, AuthorRequest, AuthorResponse } from "../types/author.type";

const BASE_ENDPOINT = "/api/v1/admin/authors";

export const AuthorService = {
  search: async (options?: AuthorFilterRequest): Promise<Pagination<AuthorResponse>> => {
    const response = await authAxios.get<ApiResponse<Pagination<AuthorResponse>>>(
      `${BASE_ENDPOINT}/filter`,
      { params: options }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Không thể tải danh sách tác giả");
    }
    return response.data.data;
  },

  create: async (request: AuthorRequest): Promise<AuthorResponse> => {
    const response = await authAxios.post<ApiResponse<AuthorResponse>>(
      BASE_ENDPOINT,
      request
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Thêm tác giả thất bại");
    }
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await authAxios.delete<ApiResponse<void>>(`${BASE_ENDPOINT}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Xóa tác giả thất bại");
    }
  },
};

export default AuthorService;
```

---

## ⚡ 6. Quản Lý Cache & Server State Với TanStack Query v5 (`hooks/`)

### 6.1. Quy Tắc Query Key Factory
Để tránh hardcode string rải rác dẫn đến lỗi gõ sai khi `invalidateQueries`, luôn khai báo object Query Key Factory ở đầu file hook:
```ts
export const authorKeys = {
  all: ["authors"] as const,
  lists: () => [...authorKeys.all, "list"] as const,
  list: (filter?: AuthorFilterRequest) => [...authorKeys.lists(), filter] as const,
  details: () => [...authorKeys.all, "detail"] as const,
  detail: (id: number) => [...authorKeys.details(), id] as const,
};
```

### 6.2. Viết Custom Hook (Query & Mutation)
- **Query Hook:** Sử dụng `queryKey`, `queryFn`, thiết lập `staleTime` (VD: 2 - 5 phút), điều kiện `enabled`.
- **Mutation Hook:** Sử dụng `useMutation`, tự động làm mới cache bằng `queryClient.invalidateQueries(...)`, hiển thị Toast qua `showSuccessToast` và `showErrorToast` kết hợp trích xuất lỗi qua `getErrorMessage(error)`.

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AuthorService from "../services/author.service";
import type { AuthorFilterRequest, AuthorRequest, AuthorResponse } from "../types/author.type";
import type { Pagination } from "@/libs/utils/pagination";
import { getErrorMessage } from "@/libs/utils/error";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";

export const useFilterAuthor = (options?: AuthorFilterRequest) => {
  return useQuery<Pagination<AuthorResponse>>({
    queryKey: authorKeys.list(options),
    queryFn: () => AuthorService.search(options),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: AuthorRequest) => AuthorService.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authorKeys.lists() });
      showSuccessToast("Thêm mới tác giả thành công!");
    },
    onError: (error: unknown) => {
      showErrorToast(getErrorMessage(error));
    },
  });
};
```

---

## 🔐 7. Xác Thực, Phân Quyền & Quản Lý Phiên (Auth & Session)

### 7.1. Cơ Chế Lưu Trữ Token
- Quản lý qua `@/libs/utils/cookie.ts` và `TokenType` (`@/libs/constant/token.type.ts`):
  - `TokenType.ACCESS_TOKEN`: Lưu trữ qua Cookie (`getAuthToken`, `setAuthToken`, `removeAuthToken`).
  - `TokenType.REFRESH_TOKEN`: Được Server quản lý thông qua HttpOnly Cookie.

### 7.2. Tầng Context & Khởi Tạo (`@/providers/AuthProvider.tsx`)
- `AuthProvider` kết hợp `useGetUserQuery()` (`/api/v1/auth/me`) với TanStack Query cache:
  - `isInitialized = !hasToken || !isLoading`: Cho biết ứng dụng đã kiểm tra xong phiên đăng nhập ban đầu hay chưa.
  - Cung cấp: `userInfo`, `setUserInfo`, `isAuthenticated`, `isInitialized`, `login`, `logout`, `hasRole`.

### 7.3. Bộ Chặn Định Tuyến (Route Guards)
1. **`ProtectedRoute` (`@/routes/ProtectedRoute.tsx`):**
   - Kiểm tra `isInitialized`: nếu đang load -> hiển thị `<Spinner />`.
   - Nếu `!isAuthenticated` -> điều hướng về `/login` kèm `state={{ from: location }}`.
   - Kiểm tra `allowedRoles` (`RoleType = "ADMIN" | "STAFF" | "SHOP" | "USER"`): nếu người dùng không khớp role -> điều hướng về `/`.
2. **`GuestRoute` (`@/routes/GuestRoute.tsx`):**
   - Chặn người dùng đã đăng nhập truy cập lại các trang `/login`, `/register`.
   - Tự động chuyển hướng về trang tương ứng theo role (`/admin`, `/shop`, `/home`) hoặc vị trí `from` trước đó.

---

## 🛣️ 8. Hệ Thống Định Tuyến (Routing Architecture)

Hệ thống định tuyến tại `src/App.tsx` chia thành 3 phân hệ chính:
1. **Admin Panel:** `/admin/*` bọc bởi `ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}` -> `<AdminRoutes />`.
2. **Shop Panel:** `/shop/*` (`SHOP_PATH.ROOT/*`) bọc bởi `ProtectedRoute allowedRoles={["SHOP", "ADMIN"]}` -> `<ShopRoutes />`.
3. **User Storefront:** `/*` -> `<UserRoutes />`.

### Quy Tắc Viết Trang Trong Routes:
- **Bắt buộc Lazy-loading:** Mọi Page component đều phải import qua `React.lazy()` và bọc trong `<Suspense fallback={<Spinner ... />}>`.
- **Hằng số đường dẫn (Paths Constant):**
  - Dùng `ADMIN_PATH` từ `@/libs/constant/admin-path` cho các route Admin.
  - Dùng `SHOP_PATH` từ `@/libs/constant/shop-path` cho các route Shop.

---

## 🎨 9. Giao Diện & UI Components Thực Tế

### 9.1. Phân Biệt `src/components/ui/` và `src/components/common/`
1. **`src/components/ui/` (Pure Primitives):**
   - Các components cơ bản, nhận props thuần túy, không phụ thuộc `react-hook-form`:
   - `Button`, `Badge`, `Modal`, `InputField`, `InputFieldPassword`, `InputDate`, `SelectBox`, `TextAreaField`, `Pagination`, `Spinner`, `Tooltip`, `SidebarToggle`, `Container`.
2. **`src/components/common/` (Integrated & Shared Controllers):**
   - Các controller components bọc quanh `ui/` bằng `useController` của `react-hook-form`:
   - `FormInput`, `FormInputPassword`, `FormDate`, `FormSelect`, `FormTextArea`.
   - Các widgets nghiệp vụ dùng chung: `SingleImageUpload`, `MultipleImageUpload`, `SearchInput`, `SearchableMultiSelect`, `ReactEkycForm`, `LogoutModal`, `ScrollToTop`, `Logo`.

### 9.2. Quy Chuẩn Spacing Giữa Các Trường Trong Form
- **Chuẩn thiết kế khoảng cách:** Giữ khoảng cách giữa đáy ô nhập liệu và label của trường tiếp theo ở mức **`16px` (`1rem`) đến `20px`** (sử dụng `space-y-4`, `gap-4` hoặc `gap-5`).
- **Quy tắc render Error / Helper Text trong Input Components:**
  - Container thông báo lỗi bên dưới input chỉ render khi có `(error || helperText)` và `!hideMessage`.
  - **Tuyệt đối không** render thẻ container cố định `min-h-[20px]` khi không có lỗi, nhằm tránh làm phình khoảng cách giao diện form lên ~32px – 42px.
```tsx
{!hideMessage && (error || helperText) && (
  <div className="mt-1.5">
    {error ? (
      <p id={errorId} className="text-xs text-red-500 font-medium">{error}</p>
    ) : helperText ? (
      <p id={helperId} className="text-xs text-zinc-500 dark:text-zinc-400">{helperText}</p>
    ) : null}
  </div>
)}
```

### 9.3. Utility Classes Trong `src/index.css`
- Sử dụng các utility định nghĩa sẵn:
  - `card-custom`: Thẻ bo tròn viền sáng/tối chuẩn dashboard (`rounded-xl border p-4 lg:p-6 shadow-sm`).
  - `heading-1`, `heading-2`: Tiêu đề tiêu chuẩn.
  - `body-text`, `caption-text`, `text-muted`: Cỡ chữ và sắc độ văn bản chuẩn.
  - Chế độ Dark Mode: Cấu hình theo variant `@custom-variant dark (&:is(.dark *));`.

---

## 🛠️ 10. Lệnh Thực Thi & Kiểm Thử (Commands)

Thực hiện từ thư mục `frontend/`:

| Tác vụ | Lệnh thực thi | Ghi chú |
| :--- | :--- | :--- |
| Khởi chạy Dev Server | `npm run dev` | Mặc định port 5173 |
| Kiểm tra kiểu TypeScript & Build | `npm run build` | Thực thi `tsc -b && vite build` |
| Kiểm tra Linter | `npm run lint` | ESLint 9 với typescript-eslint |
| Chạy Unit Test | `npm run test:unit` | Vitest test runner |
| Chạy E2E Test | `npm run test:e2e` | Playwright test engine |
| Xem trước bản Build | `npm run preview` | Vite preview production bundle |

---

## ✅ 11. Checklist Bắt Buộc Dành Cho AI Agent Trước Khi Hoàn Thành Task

Mỗi khi AI Agent thêm mới hoặc chỉnh sửa mã nguồn Frontend, hãy kiểm tra danh sách này:

- [ ] **TypeScript (`verbatimModuleSyntax`):** Mọi import kiểu dữ liệu đều dùng cú pháp `import type { ... }`.
- [ ] **Data Flow 3 tầng:** Logic gọi API nằm ở `services/`, quản lý cache & thông báo nằm ở `hooks/`, component chỉ việc gọi hook.
- [ ] **Axios Instances:** Dùng đúng `authAxios` cho API cần token và `publicAxios` cho API công khai; unwrap `res.data.data` và kiểm tra `res.data.success`.
- [ ] **Query Key Factory:** Đặt key tập trung dạng mảng `as const` ở đầu hook, không hardcode string rải rác.
- [ ] **Làm mới Cache & Toasts:** Mutation phải gọi `invalidateQueries` đúng key và xử lý lỗi qua `showErrorToast(getErrorMessage(error))`.
- [ ] **UI Spacing:** Sử dụng `space-y-4` hoặc `gap-4` (~16px) cho khoảng cách giữa các trường trong form; không chèn khối chiếm diện tích cố định khi không có lỗi.
- [ ] **Không phá vỡ cấu trúc có sẵn:** Không tự ý thay đổi thư viện cốt lõi, không hardcode API URL mà dùng `import.meta.env.VITE_API_URL` hoặc cấu hình tập trung.
