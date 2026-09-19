# Commerce Book - Frontend Application

Giao diện người dùng nền tảng thương mại điện tử sách trực tuyến **Commerce-Book**, xây dựng trên nền tảng **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, kết hợp **TanStack Query** và các tính năng AI & đa phương tiện hiện đại.

---

## 🚀 Tính năng nổi bật

- **Kiến trúc Modular Clean Architecture:** Tách biệt rõ ràng theo từng phân hệ (`user`, `shop`, `admin`, `auth`, `product`, `cart`, v.v.).
- **Tìm kiếm thông minh:** Tìm kiếm thời gian thực, lọc đa tiêu chí, tìm kiếm bằng giọng nói (**Web Speech API**) và hỗ trợ quét ảnh (**MediaPipe**).
- **Soạn thảo & Hiển thị mô tả:** Trình soạn thảo văn bản phong phú **Tiptap Editor** hỗ trợ đầy đủ định dạng bảng, ảnh, màu sắc, font chữ.
- **Trải nghiệm Shop & Admin:** Bảng điều khiển (Dashboard) thống kê trực quan, quản lý đơn hàng, kho sách, duyệt sách, quản trị tác giả/NXB/thể loại/series.
- **Tương tác thời gian thực:** Tích hợp **Twilio Conversations** cho kênh chat trực tiếp giữa người mua và người bán.
- **UI/UX hiện đại:** Thiết kế responsive, hiệu ứng mượt mà với **Tailwind CSS v4**, **FlyonUI**, **Swiper**, **Lucide Icons**.

---

## 🛠️ Công nghệ sử dụng

| Phân loại | Thư viện / Công nghệ |
| :--- | :--- |
| **Core Framework** | React 19, TypeScript, Vite 7 |
| **State & Data Fetching** | TanStack React Query v5, Axios |
| **Styling & UI Components** | Tailwind CSS v4, FlyonUI, Lucide React, Swiper |
| **Form & Validation** | React Hook Form |
| **Rich Text Editor** | Tiptap (StarterKit, Bubble Menu, Image, Table, Underline...) |
| **Realtime Chat** | Twilio Conversations SDK |
| **Date Handling** | Date-fns, React Datepicker, Flowbite Datepicker |
| **Kiểm thử (Testing)** | Vitest (Unit test), Playwright (E2E testing) |

---

## 📂 Cấu trúc thư mục

```text
frontend/src/
├── assets/            # Hình ảnh tĩnh, icons, logos
├── components/        # UI components tái sử dụng (Button, Input, Modal, Spinner...)
├── context/           # React Context quản lý state toàn cục (Auth, Theme, Cart...)
├── hooks/             # Custom React hooks
├── layouts/           # Các khung giao diện chính (UserLayout, ShopLayout, AdminLayout, ProfileLayout)
├── libs/              # Hằng số, cấu hình axios, tiện ích định dạng dữ liệu
├── modules/           # Mã nguồn theo từng phân hệ nghiệp vụ:
│   ├── admin/         # Kênh quản trị sàn (Duyệt sách, quản lý shop, danh mục, báo cáo)
│   ├── auth/          # Quản lý phiên đăng nhập, hồ sơ cá nhân
│   ├── product/       # Tìm kiếm, danh sách sản phẩm, chi tiết sách
│   ├── shop/          # Kênh người bán (Dashboard, quản lý sách, kho, khuyến mãi, voucher)
│   └── user/          # Kênh khách hàng (Trang chủ, giỏ hàng, đặt hàng, sổ địa chỉ)
├── providers/         # Các Provider bọc ngoài (QueryClientProvider, ToastProvider...)
├── routes/            # Hệ thống route: UserRoutes, ShopRoutes, AdminRoutes, ProtectedRoute, GuestRoute
├── services/          # Các hàm gọi API tương ứng từng module backend
└── types/             # Định nghĩa Type/Interface TypeScript
```

---

## 💻 Cài đặt & Chạy ứng dụng

### Yêu cầu tiên quyết:
- **Node.js:** Phiên bản 20.x hoặc 22.x LTS.
- **npm** đi kèm.

### Các lệnh thực thi:

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy Development Server (cổng mặc định: http://localhost:5173)
npm run dev

# 3. Biên dịch dự án cho môi trường Production
npm run build

# 4. Xem trước bản build production
npm run preview

# 5. Chạy Unit Tests với Vitest
npm run test:unit

# 6. Chạy E2E Tests với Playwright
npm run test:e2e
```
