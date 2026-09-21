export type ShopStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "REJECTED"
  | "SUSPENDED"
  | "BANNED";

export interface ShopStatusInfo {
  label: string;
  color: "warning" | "success" | "danger" | "secondary" | "primary";
}

export const getShopStatusInfo = (status: ShopStatus): ShopStatusInfo => {
  switch (status) {
    case "PENDING":
      return {
        label: "Chờ duyệt",
        color: "warning",
      };
    case "ACTIVE":
      return {
        label: "Đang hoạt động",
        color: "success",
      };
    case "REJECTED":
      return {
        label: "Bị từ chối",
        color: "danger",
      };
    case "INACTIVE":
      return {
        label: "Tạm ngưng",
        color: "secondary",
      };
    case "SUSPENDED":
      return {
        label: "Tạm đình chỉ",
        color: "warning",
      };
    case "BANNED":
      return {
        label: "Đã khóa / Cấm",
        color: "danger",
      };
    default:
      return {
        label: "Không xác định",
        color: "secondary",
      };
  }
};
