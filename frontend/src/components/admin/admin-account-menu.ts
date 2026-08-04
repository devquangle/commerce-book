import { User, type LucideIcon } from "lucide-react";
import { ADMIN_PATH } from "@/libs/constant/admin-path";

export interface AdminAccountMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
}

export const adminAccountMenu: AdminAccountMenuItem[] = [
  {
    label: "Tài khoản",
    href: ADMIN_PATH.PROFILE_FULL,
    icon: User,
  },
];
