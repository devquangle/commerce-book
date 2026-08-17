export interface ProductCardResponse{
    productId:number;
    productName:string;
    productSlug:string;
    discountPercent:number;
    salePrice:number;
    averageRating:number;
    soldCount:number;
    
    shopId:number;
    shopName:string;
    shopSlug:string;

    isFavorite:boolean;

}