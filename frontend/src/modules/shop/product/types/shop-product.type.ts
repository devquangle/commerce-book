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
