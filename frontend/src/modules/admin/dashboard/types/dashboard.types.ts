import type { ReactNode } from "react";

export interface StatMetric {
  id: string;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: ReactNode;
}

export interface PendingItem {
  id: string;
  title: string;
  count: number;
  type: "warning" | "danger" | "info" | "success";
  path?: string;
}

export interface ActivityItem {
  id: string;
  time: string;
  text: string;
  type: "approve" | "lock" | "create" | "report" | "payment";
  iconSymbol: string;
}

export interface TopShopItem {
  rank: number;
  name: string;
  revenue?: string;
  salesCount?: string;
}
