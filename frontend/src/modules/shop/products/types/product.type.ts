import type {
  ImageResponse,
  ProductImageRequest,
} from "@/services/cloudinary/type/cloudinary.type";
import type { ProductStatus } from "./product-status.type";
import type { ShopSimpleResponse } from "../../stores/types/store";

export * from "./product-status.type";
export interface ProductResponse {
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
  shop?: ShopSimpleResponse;
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
  coverImages: ProductImageRequest[];
  description: string;
  status: ProductStatus;
}

export interface ProductDetailResponse {
  productId: number;
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
  coverImages: ImageResponse[];
  description: string;
  reason:string;
  status: ProductStatus;
  shop: ShopSimpleResponse;
}
