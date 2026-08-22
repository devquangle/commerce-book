import { useState } from "react";
import { Star, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import type { ProductFullResponse as ProductDetailResponse } from "../types/product-detail.type";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";

// Mock useAddToCart since it doesn't exist in codebase yet
const useAddToCart = () => {
  const [isPending, setIsPending] = useState(false);
  const mutate = ({ productId, quantity }: { productId: number, quantity: number }) => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      showSuccessToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    }, 500);
  };
  return { mutate, isPending };
};

interface ProductInfoProps {
  product: ProductDetailResponse;
  // Giả sử có thêm prop review, hoặc tạm thời set default
  review?: {
    rating: number;
    reviewCount: number;
  };
}

export default function ProductInfo({ product, review }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
 

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  const handleAddToCart = () => {
    const productId = product.productId;
    if (!productId) {
      showErrorToast("Không tìm thấy mã sản phẩm");
      return;
    }

    // addToCartMutation.mutate({ productId, quantity });
  };

  const originalPrice = product.price || 0;
  const discountPercent = 0; // Nếu ProductDetailResponse có discount thì thay vào
  const hasDiscount = discountPercent > 0 && discountPercent < 100;
  const finalPrice = hasDiscount
    ? Math.round(originalPrice - (originalPrice * discountPercent / 100))
    : originalPrice;

  const rating = review?.rating ?? 5.0;
  const reviewCount = review?.reviewCount ?? 0;
  const soldCount = product.soldCount ?? 0;

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div>
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-3 tracking-tight">
          {product.productName || "Chưa có tên sản phẩm"}
        </h1>

        {/* Rating & Sold Info */}
        <div className="flex items-center flex-wrap gap-3 text-sm mt-3 mb-6">
          <div className="flex items-center gap-1.5 font-medium">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-slate-700">{rating.toFixed(1)}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="hover:text-red-600 cursor-pointer transition-colors duration-200 font-medium">
            <span className="text-slate-700">{reviewCount}</span> đánh giá
          </div>
          <span className="text-slate-300">•</span>
          <div className="font-medium">
            Đã bán <span className="text-slate-700">{soldCount}</span> cuốn
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-3xl md:text-4xl font-bold text-red-600 tracking-tight">
            {finalPrice.toLocaleString()} ₫
          </span>
          {hasDiscount && (
            <div className="flex items-center gap-2">
              <span className="text-base text-slate-400 line-through font-medium">
                {originalPrice.toLocaleString()} ₫
              </span>
              <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Controls & Buttons */}
      <div className="flex flex-col gap-8 pt-6 mt-4 border-t border-slate-100">
        {/* Quantity and Subtotal */}
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-sm font-medium text-slate-600 min-w-17.5">Số lượng</span>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center border border-slate-200 rounded-lg h-10 w-28 bg-white overflow-hidden hover:border-slate-300 transition-colors">
              <button
                onClick={handleDecrease}
                className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={quantity}
                readOnly
                className="w-full h-full text-center text-sm font-semibold text-slate-800 focus:outline-none bg-transparent"
              />
              <button
                onClick={handleIncrease}
                className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
            {/* Subtotal */}
            <div className="text-sm text-slate-500 flex items-center gap-2">
              Tạm tính: <span className="text-lg font-bold text-red-600">{(finalPrice * quantity).toLocaleString()} ₫</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-4 w-full items-center">
          <button 
            onClick={handleAddToCart}
         
            className={`cursor-pointer h-12 flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 border border-red-100}`}
          >
            <ShoppingCart size={18} strokeWidth={2} />
            <span>{ "Thêm vào giỏ"}</span>
          </button>
          
          <button className="cursor-pointer h-12 flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
            Mua ngay
          </button>

          <button className="cursor-pointer h-12 w-12 flex items-center justify-center border border-slate-200 rounded-full text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shrink-0">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}