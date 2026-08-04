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
export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  originalPrice: number;
  price: number;
  quantity: number;
  weight: number;
  publishYear: string;
  pages: number;
  language?: string;
  publisherName: string;
  seriesName: string;
  genresName: string[] | [];
  authorsName: string[] | [];
  urlImageDefault: string;
  status: ProductStatus;
}

export interface ProductFilterRequest {
  keyword?: string;
  status?: ProductStatus;
  page?: number;
  size?: number;
}

export interface ProductRequest {
  name: string;
  authorIds: number[];
  publisherId: number | null;
  genreIds: number[];
  weight: number;
  publishYear: string;
  pages: number;
  language: string;
  price: number;
  originalPrice: number;
  quantity: number;
  status: ProductStatus;
  seriesId: number | null;
  isbn: string;
  coverImages: ProductImageRequest[];
  description: string;
}

export interface ProductImageRequest {
  file?: File | null;
  url?: string | null;
  isThumbnail: boolean;
}
