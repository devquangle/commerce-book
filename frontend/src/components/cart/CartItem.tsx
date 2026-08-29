import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ChevronDown, ChevronUp, Store } from "lucide-react";
import type { CartResponse, CartItemResponse } from "@/modules/user/cart/types/cart.type";
import { formatMoney } from "@/libs/utils/formatMoney.utils";
import Voucher from "@/components/payment/Voucher";
import Note from "@/components/payment/Note";

interface CartItemProps {
  item: CartResponse;
  onCheck: (cartItemId: number, checked: boolean) => void;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
  showControls?: boolean;
  onShopCheck?: (checked: boolean) => void;
  onVoucherApply?: (discount: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item: cart,
  onCheck,
  onQuantityChange,
  onRemove,
  showControls = true,
  onShopCheck,
  onVoucherApply,
}) => {
  return (
    <div className="card-custom p-0! overflow-hidden text-gray-700">
      {/* Shop Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        {showControls && onShopCheck && (
          <div className="w-6 flex justify-center shrink-0">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={cart.checked}
              onChange={(e) => onShopCheck(e.target.checked)}
            />
          </div>
        )}
        <div className="flex items-center gap-2 pl-2 md:pl-4">
          <Store size={18} className="text-gray-600 shrink-0" />
          <Link
            to={`/shop/${cart.shopSlug}`}
            className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors"
          >
            {cart.shopName}
          </Link>
        </div>
      </div>

      {/* Items List */}
      <div className="flex flex-col">
        {cart.items.map((cartItem, index) => (
          <SingleItem
            key={cartItem.cartItemId}
            item={cartItem}
            onCheck={onCheck}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            showControls={showControls}
            isLast={index === cart.items.length - 1}
          />
        ))}
      </div>

      {/* Footer: Voucher & Note – only when controls are hidden */}
      {!showControls && (
        <div className="flex flex-col items-start gap-2 p-3 border-t border-gray-200 bg-gray-50">
          <Voucher onApply={onVoucherApply} />
          <Note />
        </div>
      )}
    </div>
  );
};

// Component con để render từng sản phẩm
const SingleItem: React.FC<{
  item: CartItemResponse;
  onCheck: (cartItemId: number, checked: boolean) => void;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
  showControls: boolean;
  isLast: boolean;
}> = ({ item, onCheck, onQuantityChange, onRemove, showControls, isLast }) => {
  const { product, quantity, checked, cartItemId } = item;
  const [isExpanded, setIsExpanded] = useState(false);

  const finalPrice = product.promotion
    ? product.price * (1 - product.promotion.discountPercent / 100)
    : product.price;

  return (
    <div className={`flex items-start md:items-center p-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
      {/* Checkbox Column */}
      {showControls && (
        <div className="w-6 flex justify-center shrink-0 mt-1 md:mt-0">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={checked}
            onChange={(e) => onCheck(cartItemId, e.target.checked)}
          />
        </div>
      )}

      {/* Column 1: Sản phẩm */}
      <div className="grow pl-4 flex items-start gap-4 min-w-0">
        <Link
          to={`/product/${product.productSlug}`}
          className="w-20 h-20 shrink-0 bg-gray-100 rounded-md overflow-hidden block"
        >
          <img
            src={product.urlImageDefault || "https://via.placeholder.com/150"}
            alt={product.productName}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </Link>

        <div className="flex flex-col min-w-0">
          <Link to={`/product/${product.productSlug}`} className="block">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
              {product.productName}
            </h3>
          </Link>

          <div className="mt-1 space-y-0.5 text-xs text-gray-500">
            {product.authorsName?.length > 0 && (
              <p>
                <span className="font-medium text-gray-600">Tác giả:</span>{" "}
                {product.authorsName.join(", ")}
              </p>
            )}
            {product.genresName?.length > 0 && (
              <p>
                <span className="font-medium text-gray-600">Thể loại:</span>{" "}
                {product.genresName.join(", ")}
              </p>
            )}
            {product.publisherName && (
              <p>
                <span className="font-medium text-gray-600">Nhà XB:</span>{" "}
                {product.publisherName}
              </p>
            )}
            {product.seriesName && (
              <p>
                <span className="font-medium text-gray-600">Series:</span>{" "}
                {product.seriesName}
              </p>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] text-blue-600 flex items-center gap-1 mt-1 hover:underline focus:outline-none w-fit"
          >
            {isExpanded ? "Thu gọn" : "Xem chi tiết"}
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out overflow-hidden text-xs text-gray-500 gap-y-1 ${
              isExpanded
                ? "grid-rows-[1fr] opacity-100 mt-2"
                : "grid-rows-[0fr] opacity-0 mt-0"
            }`}
          >
            <div className="overflow-hidden flex flex-wrap items-center gap-x-4 gap-y-1">
              {product.publishYear && (
                <p>
                  <span className="font-medium text-gray-600">Năm XB:</span>{" "}
                  {product.publishYear}
                </p>
              )}
              {product.pages > 0 && (
                <p>
                  <span className="font-medium text-gray-600">Số trang:</span>{" "}
                  {product.pages}
                </p>
              )}
              {product.weight > 0 && (
                <p>
                  <span className="font-medium text-gray-600">Trọng lượng:</span>{" "}
                  {product.weight}g
                </p>
              )}
              {product.language && (
                <p>
                  <span className="font-medium text-gray-600">Ngôn ngữ:</span>{" "}
                  {product.language}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Đơn giá */}
      <div className="w-32 hidden md:flex flex-col items-center">
        <span className="text-sm font-semibold text-red-600">
          {formatMoney(finalPrice)}
        </span>
        {product.promotion && (
          <span className="text-xs text-gray-400 line-through mt-0.5">
            {formatMoney(product.price)}
          </span>
        )}
      </div>

      {/* Column 3: Số lượng */}
      <div className="w-32 flex justify-center">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            className="p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            onClick={() => onQuantityChange(cartItemId, Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus size={14} />
          </button>
          <input
            type="number"
            className="w-10 text-center text-sm border-x border-gray-300 py-1 focus:outline-none"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 1) {
                onQuantityChange(cartItemId, val);
              }
            }}
          />
          <button
            className="p-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
            onClick={() => onQuantityChange(cartItemId, quantity + 1)}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Column 4: Số tiền */}
      <div className="w-32 hidden md:block text-right pr-4 text-sm font-semibold text-red-600">
        {formatMoney(finalPrice * quantity)}
      </div>

      {/* Column 5: Thao tác */}
      {showControls && (
        <div className="w-12 flex justify-center">
          <button
            className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            onClick={() => onRemove(cartItemId)}
            title="Xóa"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CartItem;
