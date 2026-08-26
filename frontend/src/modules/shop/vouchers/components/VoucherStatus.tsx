import React from "react";
import { type VoucherStatus } from "../types/voucher.type";
import { Badge } from "@/components/ui/Badge";

interface VoucherStatusProps {
  status: VoucherStatus;
}

export const VoucherStatusBadge: React.FC<VoucherStatusProps> = ({ status }) => {
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
