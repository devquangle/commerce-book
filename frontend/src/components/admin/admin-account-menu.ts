import { User, type LucideIcon } from "lucide-react";

export interface AdminAccountMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
}

export const adminAccountMenu: AdminAccountMenuItem[] = [
  {
    label: "Tài khoản",
    href: "/admin/account",
    icon: User,
  },
];
