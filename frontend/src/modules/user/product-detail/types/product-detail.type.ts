export interface ProductDetailResponse {
  productId: number;
  productName: string;
  productSlug: string;
  price: number;
  quantity: number;
  isbn?: string;
  weight: number;
  publishYear: string;
  pages: number;
  language?: string;
  description: string;
  soldCount?: number;

  productPublisher: ProductPublisherResponse;
  productSeries: ProductSeriesResponse | null;
  productGenres: ProductGenreResponse[] | [];
  productAuthors: ProductAuthorResponse[] | [];
  coverImages: ProductImageResponse[] | [];
}
export interface ProductGenreResponse {
  id: number;
  name: string;
  slug: string;
}
export interface ProductAuthorResponse {
  id: number;
  name: string;
  slug: string;
}
export interface ProductSeriesResponse {
  id: number;
  name: string;
  slug: string;
}
export interface ProductPublisherResponse {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImageResponse {
  url: string;
  isThumbnail: boolean;
}
