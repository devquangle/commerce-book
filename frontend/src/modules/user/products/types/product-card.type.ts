export interface ProductCardResponse {
  productId: number;
  productName: string;
  productSlug: string;
  discountPercent: number;
  price: number;
  salePrice: number;
  averageRating: number;
  soldCount: number;
  urlImageDefault: string;
  shopId: number;
  shopName: string;
  shopSlug: string;
  isFavorite: boolean;
}
