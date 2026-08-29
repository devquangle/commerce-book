import React from "react";
import { ShoppingBag, Tag, Truck, ChevronRight } from "lucide-react";
import { formatMoney } from "@/libs/utils/formatMoney.utils";
import type { CartResponse } from "@/modules/user/cart/types/cart.type";
import type { PaymentMethodType } from "./PaymentMethod";

interface PaymentTotalProps {
  carts: CartResponse[];
  paymentMethod: PaymentMethodType;
  onPlaceOrder: () => void;
  isLoading?: boolean;
  voucherDiscount?: number;
}

const SHIPPING_FEE = 30000;

const PaymentTotal: React.FC<PaymentTotalProps> = ({
  carts,
  onPlaceOrder,
  isLoading = false,
  voucherDiscount = 0,
}) => {
  // Calculate totals from all checked items
  let subtotal = 0;
  let totalItems = 0;
  let totalDiscount = 0;

  carts.forEach((cart) => {
    cart.items.forEach((item) => {
      if (item.checked) {
        const originalPrice = item.product.price * item.quantity;
        const discount = item.product.promotion
          ? (item.product.price *
              item.product.promotion.discountPercent *
              item.quantity) /
            100
          : 0;
        subtotal += originalPrice - discount;
        totalDiscount += discount;
        totalItems += item.quantity;
      }
    });
  });

  const shippingFee = totalItems > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + shippingFee - voucherDiscount;


  return (
    <div className="space-y-4">
      {/* Order Summary Card */}
      <div className="card-custom">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag size={18} className="text-blue-600 shrink-0" />
          <h2 className="font-semibold text-gray-800 text-base">
            Tóm tắt đơn hàng
          </h2>
        </div>

        <div className="space-y-3 text-sm">
          {/* Subtotal */}
          <div className="flex justify-between items-center text-gray-600">
            <span>
              Tạm tính ({totalItems} sản phẩm)
            </span>
            <span className="font-medium text-gray-800">
              {formatMoney(subtotal + totalDiscount)}
            </span>
          </div>

          {/* Discount */}
          {totalDiscount > 0 && (
            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center gap-1">
                <Tag size={13} className="text-green-600" />
                Giảm giá khuyến mãi
              </span>
              <span className="font-medium text-green-600">
                -{formatMoney(totalDiscount)}
              </span>
            </div>
          )}

          {/* Voucher Discount */}
          {voucherDiscount > 0 && (
            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center gap-1">
                <Tag size={13} className="text-purple-600" />
                Giảm giá voucher
              </span>
              <span className="font-medium text-purple-600">
                -{formatMoney(voucherDiscount)}
              </span>
            </div>
          )}

          {/* Shipping */}
          <div className="flex justify-between items-center text-gray-600">
            <span className="flex items-center gap-1">
              <Truck size={13} className="text-gray-500" />
              Phí vận chuyển
            </span>
            <span className="font-medium text-gray-800">
              {totalItems === 0 ? "-" : formatMoney(shippingFee)}
            </span>
          </div>

          <hr className="border-gray-100 my-1" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">
              Tổng thanh toán
            </span>
            <span className="text-xl font-bold text-red-600">
              {formatMoney(total)}
            </span>
          </div>

          {/* VAT notice */}
          <p className="text-xs text-gray-400 text-right">
            (Đã bao gồm VAT nếu có)
          </p>
        </div>
      </div>
      <button
        onClick={onPlaceOrder}
        disabled={totalItems === 0 || isLoading}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <>
            <span>Đặt hàng ({formatMoney(total)})</span>
            <ChevronRight size={18} />
          </>
        )}
      </button>

      {totalItems === 0 && (
        <p className="text-center text-xs text-gray-400">
          Vui lòng chọn ít nhất một sản phẩm để đặt hàng
        </p>
      )}
    </div>
  );
};

export default PaymentTotal;
