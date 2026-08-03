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
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AdminSidebarMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  subItems?: AdminSidebarMenuItem[];
}

export const adminSidebarMenu: AdminSidebarMenuItem[] = [
  {
    label: "Trang chủ",
    href: "/admin",
    icon: PieChart,
  },
  {
    label: "Quản lý sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Quản lý cửa hàng",
    href: "/admin/stores",
    icon: Store,
  },
  {
    label: "Danh mục sách",
    icon: FolderTree,
    subItems: [
      {
        label: "Quản lý bộ sách",
        href: "/admin/series",
        icon: Package,
      },
      {
        label: "Quản lý thể loại",
        href: "/admin/genres",
        icon: Layers,
      },
      {
        label: "Quản lý tác giả",
        href: "/admin/authors",
        icon: Users,
      },
      {
        label: "Quản lý NXB",
        href: "/admin/publishers",
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
        href: "/admin/reports/products",
        icon: FileSpreadsheet,
      },
      {
        label: "Báo cáo cửa hàng",
        href: "/admin/reports/stores",
        icon: FileBarChart,
      },
    ],
  },
  {
    label: "Thống kê",
    icon: BarChart,
    href: "/admin/analytics",
  },
];
