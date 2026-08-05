import type {
  ProductImageResponse,
} from "@/services/cloudinary/type/cloudinary.type";
import type { ProductStatus } from "./product-status.type";

export * from "./product-status.type";
export interface ProductResponse {
  id: number;
  productId: number;
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
  weight: number;
  publishYear: string;
  pages: number;
  language: string;
  price: number;
  originalPrice: number;
  quantity: number;
  isbn: string;
  authorIds: number[];
  genreIds: number[];
  publisherId: number | null;
  seriesId: number | null;
  coverImages: ProductImageResponse[];
  description: string;
  status: ProductStatus;
}
