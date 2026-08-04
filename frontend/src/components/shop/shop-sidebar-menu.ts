import {
  BarChart3,
  BadgePercent,
  TicketPercent,
  Boxes,
  ClipboardList,
  MessageSquareReply,
  TriangleAlert,
  Store,
  User,
  LayoutDashboard,
  type LucideIcon,
  MessageCircle,
} from "lucide-react";
import { SHOP_PATH } from "@/libs/constant/shop-path";

export interface ShopSidebarMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  subItems?: ShopSidebarMenuItem[];
}

export const shopSidebarMenu: ShopSidebarMenuItem[] = [
  {
    label: "Bảng điều khiển",
    href: SHOP_PATH.ROOT,
    icon: LayoutDashboard,
  },
  {
    label: "Thông tin cửa hàng",
    href: SHOP_PATH.STORE_FULL,
    icon: Store,
  },
  {
    label: "Quản lý sản phẩm",
    href: SHOP_PATH.PRODUCTS_FULL,
    icon: Boxes,
  },
  {
    label: "Quản lý đơn hàng",
    href: SHOP_PATH.ORDERS_FULL,
    icon: ClipboardList,
  },
  {
    label: "Đánh giá & phản hồi",
    href: SHOP_PATH.REVIEWS_FULL,
    icon: MessageSquareReply,
  },
  {
    label: "Trò chuyện",
    href: SHOP_PATH.CHATS_FULL,
    icon: MessageCircle,
  },
  {
    label: "Khuyến mãi",
    icon: BadgePercent,
    subItems: [
      {
        label: "Sản phẩm",
        href: SHOP_PATH.PROMOTIONS_FULL,
        icon: BadgePercent,
      },
      {
        label: "Đơn hàng",
        href: SHOP_PATH.VOUCHERS_FULL,
        icon: TicketPercent,
      },
    ],
  },
  {
    label: "Báo cáo vi phạm",
    href: SHOP_PATH.REPORTS_FULL,
    icon: TriangleAlert,
  },
  {
    label: "Thống kê",
    href: SHOP_PATH.ANALYTICS_FULL,
    icon: BarChart3,
  },
  {
    label: "Tài khoản",
    href: SHOP_PATH.MY_ACCOUNT_FULL,
    icon: User,
  },
];
