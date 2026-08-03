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

export interface ShopSidebarMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  subItems?: ShopSidebarMenuItem[];
}

export const shopSidebarMenu: ShopSidebarMenuItem[] = [
  {
    label: "Bảng điều khiển",
    href: "/shop",
    icon: LayoutDashboard,
  },
  {
    label: "Thông tin cửa hàng",
    href: "/shop/stores",
    icon: Store,
  },
  {
    label: "Quản lý sản phẩm",
    href: "/shop/products",
    icon: Boxes,
  },
  {
    label: "Quản lý đơn hàng",
    href: "/shop/orders",
    icon: ClipboardList,
  },
  {
    label: "Đánh giá & phản hồi",
    href: "/shop/reviews",
    icon: MessageSquareReply,
  },
  {
    label: "Trò chuyện",
    href: "/shop/chats",
    icon: MessageCircle,
  },
  {
    label: "Khuyến mãi",
    icon: BadgePercent,
    subItems: [
      {
        label: "Sản phẩm",
        href: "/shop/promotions",
        icon: BadgePercent,
      },
      {
        label: "Đơn hàng",
        href: "/shop/vouchers",
        icon: TicketPercent,
      },
    ],
  },
  {
    label: "Báo cáo vi phạm",
    href: "/shop/reports",
    icon: TriangleAlert,
  },
  {
    label: "Thống kê",
    href: "/shop/analytics",
    icon: BarChart3,
  },
  {
    label: "Tài khoản",
    href: "/shop/profile",
    icon: User,
  },
];
