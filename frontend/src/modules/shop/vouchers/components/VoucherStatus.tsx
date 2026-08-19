import React from "react";
import { type VoucherStatus } from "../types/voucher.type";
import { Badge } from "@/components/common/Badge";

export const getVoucherStatusBadge = (status: VoucherStatus) => {
  switch (status) {
    case "ACTIVE":
      return <Badge variant="success">Đang hoạt động</Badge>;
    case "INACTIVE":
      return <Badge variant="warning">Ngừng hoạt động</Badge>;
    case "DELETED":
      return <Badge variant="error">Đã xóa</Badge>;
    default:
      return <Badge variant="secondary">Không xác định</Badge>;
  }
};

interface VoucherStatusProps {
  status: VoucherStatus;
}

export const VoucherStatusBadge: React.FC<VoucherStatusProps> = ({ status }) => {
  return getVoucherStatusBadge(status);
};
