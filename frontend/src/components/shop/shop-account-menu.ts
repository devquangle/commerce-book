import { User, type LucideIcon } from "lucide-react";
import { SHOP_PATH } from "@/libs/constant/shop-path";

export interface ShopAccountMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
}

export const shopAccountMenu: ShopAccountMenuItem[] = [
  {
    label: "Tài khoản",
    href: SHOP_PATH.MY_ACCOUNT_FULL,
    icon: User,
  },
];
