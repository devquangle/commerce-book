export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "DELETED"
  | "PENDING_APPROVAL"
  | "REJECTED"
  | "BANNED";

export const getProductStatusInfo = (status: ProductStatus) => {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Đang bán",
        color: "success",
      };

    case "INACTIVE":
      return {
        label: "Tạm ngưng",
        color: "secondary",
      };

    case "PENDING_APPROVAL":
      return {
        label: "Chờ duyệt",
        color: "warning",
      };

    case "REJECTED":
      return {
        label: "Từ chối",
        color: "danger",
      };

    case "BANNED":
      return {
        label: "Bị khóa",
        color: "dark",
      };

    case "DELETED":
      return {
        label: "Đã xóa",
        color: "secondary",
      };

    default:
      return {
        label: status,
        color: "secondary",
      };
  }
};

export const PRODUCT_STATUS_LIST: ProductStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "PENDING_APPROVAL",
  "REJECTED",
  "BANNED",
  "DELETED",
];

export const getProductStatusValue = (status: ProductStatus) => {
  return getProductStatusInfo(status).label;
};
