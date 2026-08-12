import { Home, BookOpen, Star, TrendingUp, Grid, Phone } from "lucide-react";

export interface UserSidebarMenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  subItems?: { label: string; href: string; icon: React.ElementType }[];
}

export const userSidebarMenu: UserSidebarMenuItem[] = [
  {
    label: "Trang Chủ",
    icon: Home,
    href: "/",
  },
  {
    label: "Danh Mục Sách",
    icon: Grid,
    subItems: [
      { label: "Văn Học", href: "/books?category=van-hoc", icon: BookOpen },
      { label: "Kỹ Năng Sống", href: "/books?category=ky-nang", icon: BookOpen },
      { label: "Thiếu Nhi", href: "/books?category=thieu-nhi", icon: BookOpen },
    ],
  },
  {
    label: "Sách Mới",
    icon: Star,
    href: "/books?sort=new",
  },
  {
    label: "Bán Chạy",
    icon: TrendingUp,
    href: "/books?sort=bestseller",
  },
  {
    label: "Liên Hệ",
    icon: Phone,
    href: "/contact",
  },
];
