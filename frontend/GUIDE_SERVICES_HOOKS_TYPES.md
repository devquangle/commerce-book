# HƯỚNG DẪN QUẢN LÝ TYPE - SERVICE - CUSTOM HOOKS
> **Dự án:** Commerce Book Frontend  
> **Công nghệ:** React 19, TypeScript (Strict, VerbatimModuleSyntax), Vite, TanStack Query v5, Axios

---

## 1. TỔNG QUAN KIẾN TRÚC & LUỒNG DỮ LIỆU

Dự án áp dụng mô hình **Feature-First (Modular Architecture)** kết hợp với **3-Tier Frontend Data Flow**:

```
┌────────────────────────────────────────────────────────┐
│ UI Component (VD: AuthorTable, ProductPage)            │
└─────────────────────────┬──────────────────────────────┘
                          │ 1. Gọi hook
                          ▼
┌────────────────────────────────────────────────────────┐
│ Custom Hook (React Query: useQuery, useMutation)       │  <--- Quản lý Cache, State, Toast, Invalidation
└─────────────────────────┬──────────────────────────────┘
                          │ 2. Gọi service function
                          ▼
┌────────────────────────────────────────────────────────┐
│ Service Layer (Axios: authAxios, publicAxios)          │  <--- Gọi API, bóc tách ApiResponse<T>, throw Error
└─────────────────────────┬──────────────────────────────┘
                          │ 3. HTTP Request / Response
                          ▼
┌────────────────────────────────────────────────────────┐
│ Backend API (/api/v1/...)                              │
└────────────────────────────────────────────────────────┘
```

### Quy tắc phân chia thư mục:
- **Theo từng Module/Feature (Ưu tiên số 1):** Đặt tại `src/modules/<domain>/<feature>/` (VD: `src/modules/admin/authors/`, `src/modules/shop/products/`).
  Mỗi feature gồm:
  ```
  src/modules/<domain>/<feature>/
  ├── types/
  │   └── <feature>.type.ts        # Định nghĩa kiểu dữ liệu của feature
  ├── services/
  │   └── <feature>.service.ts     # Gọi HTTP request (Axios)
  ├── hooks/
  │   └── use<Feature>.ts          # Tích hợp React Query
  ├── components/                  # UI components của riêng feature
  └── pages/                       # Page routing
  ```
- **Dùng chung toàn hệ thống (Shared/Global):**
  - `src/types/`: Kiểu dữ liệu dùng chung (VD: declaration `.d.ts`, global enums).
  - `src/libs/config/axios.config.ts`: Chứa `publicAxios` & `authAxios` (đã cấu hình Interceptors + Refresh Token).
  - `src/libs/utils/api-response.ts`: Chứa `ApiResponse<T>`.
  - `src/libs/utils/pagination.ts`: Chứa `Pagination<T>`.
  - `src/libs/utils/error.ts`: Chứa hàm `getErrorMessage(error)`.
  - `src/libs/utils/toastUtil.ts`: Chứa `showSuccessToast`, `showErrorToast`.
  - `src/hooks/`: Các UI hook dùng chung phi nghiệp vụ (VD: `useDebounce.ts`).

> [!IMPORTANT]
> **Lưu ý đặc thù của TypeScript cấu hình dự án (`verbatimModuleSyntax: true`):**
> Khi import kiểu dữ liệu, **bắt buộc** phải có từ khóa `type`:
> ```ts
> // ĐÚNG:
> import type { AuthorResponse, AuthorRequest } from "../types/author.type";
> // SAI (sẽ bị lỗi compile):
> import { AuthorResponse, AuthorRequest } from "../types/author.type";
> ```

---

## 2. QUY CHUẨN 1: QUẢN LÝ TYPE (`types/`)

### 2.1. Quy ước đặt tên (Naming Conventions)
| Hậu tố / Tiền tố | Mục đích | Ví dụ |
| :--- | :--- | :--- |
| `...Response` | Dữ liệu thực thể trả về từ server | `AuthorResponse`, `ProductDetailResponse` |
| `...Request` | Dữ liệu gửi lên server (Create / Update) | `AuthorRequest`, `CreateProductRequest` |
| `...FilterRequest` hoặc `...FilterParams` | Dữ liệu bộ lọc & phân trang (URL Params/Query Params) | `AuthorFilterRequest`, `ProductFilterParams` |
| `...Status` | Union type biểu diễn trạng thái | `type AuthorStatus = "ACTIVE" \| "INACTIVE" \| "DELETED"` |
| `getLabel...Status` | Hàm helper dịch trạng thái ra tiếng Việt | `getLabelAuthorStatus(status: AuthorStatus)` |

### 2.2. Tận dụng Types chung của hệ thống
- Phân trang: Sử dụng `Pagination<T>` từ `@/libs/utils/pagination`:
  ```ts
  export interface Pagination<T> {
    items: T[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  }
  ```
- Server Envelope: `ApiResponse<T>` từ `@/libs/utils/api-response`:
  ```ts
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    code?: number;
    error?: string;
    timestamp: string;
  }
  ```

### 2.3. Template chuẩn `types/<feature>.type.ts`
```ts
// 1. Trạng thái (Union Type) & Helper function
export type GenreStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export const getLabelGenreStatus = (status: GenreStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Ngừng hoạt động";
    case "DELETED":
      return "Đã xóa";
    default:
      return status;
  }
};

// 2. Response Type (Dữ liệu nhận từ Backend)
export interface GenreResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: GenreStatus;
  createdAt: string;
  updatedAt: string;
}

// 3. Request Type (Payload gửi lên Backend)
export interface GenreRequest {
  name: string;
  description?: string;
  status: GenreStatus;
}

// 4. Filter / Query Params Type
export interface GenreFilterRequest {
  keyword?: string;
  status?: GenreStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
```

---

## 3. QUY CHUẨN 2: QUẢN LÝ SERVICE LAYER (`services/`)

### 3.1. Nguyên tắc vàng
1. **Không chứa React state hay hooks**: Service là các hàm async Javascript/TypeScript thuần túy.
2. **Chọn đúng Axios instance**:
   - Dùng `authAxios` (từ `@/libs/config/axios.config`) cho API cần xác thực (Admin, Shop, Profile,...). Token sẽ được tự động gắn và auto-refresh khi hết hạn.
   - Dùng `publicAxios` cho API công khai (Login, Register, Trang chủ, Xem sách,...).
3. **Unwrap dữ liệu chuẩn**: Luôn bóc tách `res.data.data` và kiểm tra `res.data.success`. Nếu không thành công thì `throw new Error(res.data.message)`.
4. **Luôn định kiểu Promise trả về**: Giúp custom hooks tự động suy luận kiểu dữ liệu mà không cần ép kiểu thủ công.

### 3.2. Template chuẩn `services/<feature>.service.ts`
```ts
import { authAxios } from "@/libs/config/axios.config";
import type { ApiResponse } from "@/libs/utils/api-response";
import type { Pagination } from "@/libs/utils/pagination";
import type {
  GenreFilterRequest,
  GenreRequest,
  GenreResponse,
} from "../types/genre.type";

const BASE_ENDPOINT = "/api/v1/admin/genres";

const GenreService = {
  /**
   * Lấy danh sách phân trang và tìm kiếm
   */
  filter: async (params?: GenreFilterRequest): Promise<Pagination<GenreResponse>> => {
    const res = await authAxios.get<ApiResponse<Pagination<GenreResponse>>>(
      `${BASE_ENDPOINT}/filter`,
      { params }
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Không thể tải danh sách thể loại");
    }
    return res.data.data;
  },

  /**
   * Lấy chi tiết theo ID
   */
  getById: async (id: number): Promise<GenreResponse> => {
    const res = await authAxios.get<ApiResponse<GenreResponse>>(
      `${BASE_ENDPOINT}/${id}`
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Không tìm thấy thể loại");
    }
    return res.data.data;
  },

  /**
   * Tạo mới
   */
  create: async (payload: GenreRequest): Promise<GenreResponse> => {
    const res = await authAxios.post<ApiResponse<GenreResponse>>(
      BASE_ENDPOINT,
      payload
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Không thể tạo mới thể loại");
    }
    return res.data.data;
  },

  /**
   * Cập nhật
   */
  update: async (id: number, payload: GenreRequest): Promise<GenreResponse> => {
    const res = await authAxios.put<ApiResponse<GenreResponse>>(
      `${BASE_ENDPOINT}/${id}`,
      payload
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Không thể cập nhật thể loại");
    }
    return res.data.data;
  },

  /**
   * Xóa
   */
  delete: async (id: number): Promise<void> => {
    const res = await authAxios.delete<ApiResponse<void>>(`${BASE_ENDPOINT}/${id}`);
    if (!res.data.success) {
      throw new Error(res.data.message || "Không thể xóa thể loại");
    }
  },
};

export default GenreService;
```

---

## 4. QUY CHUẨN 3: QUẢN LÝ CUSTOM HOOKS (`hooks/`)

### 4.1. Quản lý Query Key với Query Key Factory Pattern
> [!TIP]
> **Vấn đề thường gặp:** Hardcode `queryKey: ["authors-filter", options]` rải rác dẫn đến gõ sai chính tả khi `invalidateQueries`, gây lỗi cache không tự làm mới.  
> **Giải pháp:** Sử dụng object Query Key Factory tập trung ngay đầu file hook.

```ts
export const genreKeys = {
  all: ["genres"] as const,
  lists: () => [...genreKeys.all, "list"] as const,
  list: (filter?: GenreFilterRequest) => [...genreKeys.lists(), filter] as const,
  details: () => [...genreKeys.all, "detail"] as const,
  detail: (id: number) => [...genreKeys.details(), id] as const,
};
```
Khi muốn invalidate toàn bộ dữ liệu của genres (khi create/update/delete):
```ts
queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
```

### 4.2. Xử lý lỗi tập trung với `getErrorMessage`
Thay vì viết lặp lại kiểm tra `axios.isAxiosError(error)` ở từng hook, hãy import hàm tiện ích có sẵn trong dự án:
```ts
import { getErrorMessage } from "@/libs/utils/error";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";

// Trong onError:
onError: (error: unknown) => {
  showErrorToast(getErrorMessage(error));
}
```

### 4.3. Template chuẩn `hooks/use<Feature>.ts`
```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GenreService from "../services/genre.service";
import type {
  GenreFilterRequest,
  GenreRequest,
  GenreResponse,
} from "../types/genre.type";
import type { Pagination } from "@/libs/utils/pagination";
import { getErrorMessage } from "@/libs/utils/error";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";

// 1. Query Key Factory
export const genreKeys = {
  all: ["genres"] as const,
  lists: () => [...genreKeys.all, "list"] as const,
  list: (filter?: GenreFilterRequest) => [...genreKeys.lists(), filter] as const,
  details: () => [...genreKeys.all, "detail"] as const,
  detail: (id: number) => [...genreKeys.details(), id] as const,
};

// 2. Query Hook: Lấy danh sách có phân trang/lọc
export const useFilterGenres = (params?: GenreFilterRequest) => {
  return useQuery<Pagination<GenreResponse>>({
    queryKey: genreKeys.list(params),
    queryFn: () => GenreService.filter(params),
    staleTime: 1000 * 60 * 2, // Cache 2 phút
  });
};

// 3. Query Hook: Lấy chi tiết theo ID
export const useGenreDetail = (id?: number) => {
  return useQuery<GenreResponse>({
    queryKey: genreKeys.detail(id!),
    queryFn: () => GenreService.getById(id!),
    enabled: typeof id === "number" && id > 0, // Chỉ fetch khi có ID hợp lệ
  });
};

// 4. Mutation Hook: Thêm mới
export const useCreateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenreRequest) => GenreService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
      showSuccessToast("Thêm thể loại mới thành công!");
    },
    onError: (error: unknown) => {
      showErrorToast(getErrorMessage(error));
    },
  });
};

// 5. Mutation Hook: Cập nhật
export const useUpdateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: GenreRequest }) =>
      GenreService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
      queryClient.invalidateQueries({ queryKey: genreKeys.detail(variables.id) });
      showSuccessToast("Cập nhật thể loại thành công!");
    },
    onError: (error: unknown) => {
      showErrorToast(getErrorMessage(error));
    },
  });
};

// 6. Mutation Hook: Xóa
export const useDeleteGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => GenreService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
      showSuccessToast("Xóa thể loại thành công!");
    },
    onError: (error: unknown) => {
      showErrorToast(getErrorMessage(error));
    },
  });
};
```

---

## 5. CÁCH SỬ DỤNG TRONG UI COMPONENT

UI component chỉ việc gọi hook, code cực kỳ gọn gàng và không dính dáng trực tiếp tới Axios hay xử lý chuỗi URL:

```tsx
import React, { useState } from "react";
import { useFilterGenres, useDeleteGenre } from "../hooks/useGenre";
import type { GenreFilterRequest } from "../types/genre.type";

export const GenreListPage: React.FC = () => {
  const [filter, setFilter] = useState<GenreFilterRequest>({ page: 1, size: 10 });

  // 1. Data Fetching
  const { data, isLoading, isError } = useFilterGenres(filter);

  // 2. Mutation
  const { mutate: deleteGenre, isPending: isDeleting } = useDeleteGenre();

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa thể loại này?")) {
      deleteGenre(id);
    }
  };

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (isError) return <div>Không thể tải dữ liệu!</div>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>
                <button
                  disabled={isDeleting}
                  onClick={() => handleDelete(item.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 6. CHECKLIST KIỂM TRA TRƯỚC KHI TẠO MODULE MỚI

Trước khi commit mã nguồn của một tính năng mới, hãy tự kiểm tra:

- [ ] **Type:**
  - [ ] Đã tách rõ `Response`, `Request`, `FilterRequest`?
  - [ ] Có dùng `import type { ... }` theo chuẩn `verbatimModuleSyntax`?
  - [ ] Đã tận dụng `Pagination<T>` và `ApiResponse<T>` từ `libs/utils`?
- [ ] **Service:**
  - [ ] Đã chọn đúng `authAxios` (cần token) hoặc `publicAxios` (công khai)?
  - [ ] Đã định kiểu trả về `Promise<T>` cho từng method?
  - [ ] Có bóc tách `res.data.data` và kiểm tra `res.data.success`?
- [ ] **Hook:**
  - [ ] Có định nghĩa `Query Key Factory` để quản lý key tập trung?
  - [ ] Các thao tác Mutation (`create`, `update`, `delete`) đã gọi `invalidateQueries` đúng key?
  - [ ] Đã dùng `getErrorMessage(error)` từ `@/libs/utils/error` thay vì viết logic bắt lỗi thủ công?
  - [ ] Đã gọi `showSuccessToast` / `showErrorToast` để phản hồi người dùng?
