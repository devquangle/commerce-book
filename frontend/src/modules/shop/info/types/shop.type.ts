export interface ShopInfo {
  shopId: number;
  shopName: string;
  shopSlug: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  urlImage?: string;
  urlBanner?: string;
  verify: boolean;
}
