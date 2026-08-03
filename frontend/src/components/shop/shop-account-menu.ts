import { User, type LucideIcon } from "lucide-react";

export interface ShopAccountMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
}

export const shopAccountMenu: ShopAccountMenuItem[] = [
  {
    label: "Tài khoản",
    href: "/admin/profile",
    icon: User,
  },
];
