import React from "react";
import { type PromotionStatus } from "../types/promotion.type";
import { Badge } from "@/components/common/Badge";

interface PromotionStatusProps {
  status: PromotionStatus;
}

export const PromotionStatusBadge: React.FC<PromotionStatusProps> = ({ status }) => {
  switch (status) {
    case "ACTIVE":
      return <Badge variant="success" title="Hoạt động" />;
    case "INACTIVE":
      return <Badge variant="warning" title="Tạm ngưng" />;
    case "DELETED":
      return <Badge variant="danger" title="Đã xóa" />;
    default:
      return <Badge variant="secondary" title="Không xác định" />;
  }
};
