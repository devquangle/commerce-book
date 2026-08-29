export interface CartResponse {
  shopId: number;
  shopName: string;
  shopSlug: string;
  items: CartItemResponse[] | [];
  checked: boolean;
}
export interface CartItemResponse {
  cartItemId: number;
  quantity: number;
  checked: boolean;
  product: ProductResponse;
}
export interface PromotionResponse{
    discountPercent: number;
    quantity:number;
}
export interface ProductResponse {
  productId: number;
  productName: string;
  productSlug: string;
  price: number;
  quantity: number;
  promotion?:PromotionResponse
  weight: number;
  publishYear: string;
  pages: number;
  language?: string;
  publisherName: string;
  seriesName: string;
  genresName: string[] | [];
  authorsName: string[] | [];
  urlImageDefault: string;
}

export interface SelectedCartItem {
  cartItemId: number;
}
