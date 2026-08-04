import {
  BarChart,
  BookOpen,
  FileBarChart,
  FileSpreadsheet,
  FolderTree,
  Layers,
  Package,
  PieChart,
  Store,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ADMIN_PATH } from "@/libs/constant/admin-path";

export interface AdminSidebarMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  subItems?: AdminSidebarMenuItem[];
}

export const adminSidebarMenu: AdminSidebarMenuItem[] = [
  {
    label: "Bảng điều khiển",
    href: ADMIN_PATH.ROOT,
    icon: PieChart,
  },
  {
    label: "Quản lý sản phẩm",
    href: ADMIN_PATH.PRODUCTS_FULL,
    icon: Package,
  },
  {
    label: "Quản lý cửa hàng",
    href: ADMIN_PATH.STORES_FULL,
    icon: Store,
  },
  {
    label: "Danh mục sách",
    icon: FolderTree,
    subItems: [
      {
        label: "Quản lý bộ sách",
        href: ADMIN_PATH.SERIES_FULL,
        icon: Package,
      },
      {
        label: "Quản lý thể loại",
        href: ADMIN_PATH.GENRES_FULL,
        icon: Layers,
      },
      {
        label: "Quản lý tác giả",
        href: ADMIN_PATH.AUTHORS_FULL,
        icon: Users,
      },
      {
        label: "Quản lý NXB",
        href: ADMIN_PATH.PUBLISHERS_FULL,
        icon: BookOpen,
      },
    ],
  },
  {
    label: "Báo cáo",
    icon: PieChart,
    subItems: [
      {
        label: "Báo cáo sản phẩm",
        href: ADMIN_PATH.REPORTS_PRODUCTS_FULL,
        icon: FileSpreadsheet,
      },
      {
        label: "Báo cáo cửa hàng",
        href: ADMIN_PATH.REPORTS_STORES_FULL,
        icon: FileBarChart,
      },
    ],
  },
  {
    label: "Thống kê",
    icon: BarChart,
    href: ADMIN_PATH.ANALYTICS_FULL,
  },
  {
    label: "Tài khoản",
    href: ADMIN_PATH.PROFILE_FULL,
    icon: User,
  },
];
