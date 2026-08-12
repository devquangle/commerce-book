import { User, type LucideIcon } from "lucide-react";
import { ADMIN_PATH } from "@/libs/constant/admin-path";

export interface AccountMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
}

export const accountMenu: AccountMenuItem[] = [
  {
    label: "Tài khoản",
    href: "/profile",
    icon: User,
  },
];
