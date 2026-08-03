import type { ActivityItem, PendingItem, StatMetric, TopShopItem } from "../types/dashboard.types";

export const DASHBOARD_DATE = "03/08/2026";
export const SUPER_ADMIN_NAME = "Super Admin";

export const STAT_METRICS_DATA: StatMetric[] = [
  {
    id: "doanh-thu",
    title: "Doanh thu",
    value: "12.5 tỷ",
  },
  {
    id: "shop",
    title: "Shop",
    value: "1.248",
  },
  {
    id: "san-pham",
    title: "Sản phẩm",
    value: "54.281",
  },
  {
    id: "bao-cao",
    title: "Báo cáo",
    value: "18",
  },
];

export const PENDING_LEFT_DATA: PendingItem[] = [
  {
    id: "shop-cho-duyet",
    title: "Shop chờ duyệt",
    count: 12,
    type: "warning",
    path: "/admin/stores?status=PENDING",
  },
  {
    id: "shop-bi-khoa",
    title: "Shop bị khóa",
    count: 5,
    type: "danger",
    path: "/admin/stores?status=LOCKED",
  },
];

export const PENDING_RIGHT_DATA: PendingItem[] = [
  {
    id: "bao-cao-chua-xu-ly",
    title: "Báo cáo chưa xử lý",
    count: 18,
    type: "warning",
    path: "/admin/reports/stores",
  },
  {
    id: "san-pham-cho-duyet",
    title: "Sản phẩm chờ duyệt",
    count: 32,
    type: "info",
    path: "/admin/products?status=PENDING",
  },
];

export const RECENT_ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: "act-1",
    time: "09:32",
    text: 'Duyệt shop "ABC Book"',
    type: "approve",
    iconSymbol: "✔",
  },
  {
    id: "act-2",
    time: "09:18",
    text: 'Khóa sản phẩm "One Piece Vol.1"',
    type: "lock",
    iconSymbol: "🚫",
  },
  {
    id: "act-3",
    time: "08:55",
    text: "Thêm nhà xuất bản Kim Đồng",
    type: "create",
    iconSymbol: "✔",
  },
  {
    id: "act-4",
    time: "08:42",
    text: "Nhận báo cáo từ khách hàng",
    type: "report",
    iconSymbol: "📩",
  },
  {
    id: "act-5",
    time: "08:15",
    text: "Thanh toán cho Shop XYZ",
    type: "payment",
    iconSymbol: "💰",
  },
];

export const TOP_SHOPS_DATA: TopShopItem[] = [
  { rank: 1, name: "Fahasa" },
  { rank: 2, name: "Nhà sách Phương Nam" },
  { rank: 3, name: "ABC Book" },
  { rank: 4, name: "Minh Long Book" },
  { rank: 5, name: "Tiki Trading" },
];
