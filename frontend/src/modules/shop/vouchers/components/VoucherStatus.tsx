import React from "react";
import { type VoucherStatus } from "../types/voucher.type";
import { Badge } from "@/components/common/Badge";

export const getVoucherStatusBadge = (status: VoucherStatus) => {
  switch (status) {
    case "ACTIVE":
      return <Badge variant="success" title="Hoạt động" />;
    case "INACTIVE":
      return <Badge variant="warning" title="Tạm ngưng" />;
    case "DELETE":
      return <Badge variant="danger" title="Đã xóa" />;
    default:
      return <Badge variant="secondary" title="Không xác định" />;
  }
};

interface VoucherStatusProps {
  status: VoucherStatus;
}

export const VoucherStatusBadge: React.FC<VoucherStatusProps> = ({ status }) => {
  return getVoucherStatusBadge(status);
};
