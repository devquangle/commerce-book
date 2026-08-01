export type ProductStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export const getLabelProductStatus = (status: ProductStatus) => {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Không hoạt động";
    case "DELETED":
      return "Đã xóa";
    default:
      return status;
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
  genresName: string[] | [];
  authorsName: string[] | [];
  publisherName: string;
  seriesName: string;
  urlImageDefault: string;
  status: ProductStatus;
}


export interface ProductFilterRequest {
  keyword?: string;
  status?: ProductStatus;
  page?: number;
  size?: number;
}