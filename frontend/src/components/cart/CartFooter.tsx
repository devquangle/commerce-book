import type { CartResponse } from '@/modules/user/cart/types/cart.type';
import React from 'react';
import { formatMoney } from '@/libs/utils/formatMoney.utils';

interface CartItemFooterProps {
  carts: CartResponse[];
  onCheckAll: (checked: boolean) => void;
  onCheckout: () => void;
}

const CartItemFooter: React.FC<CartItemFooterProps> = ({ carts, onCheckAll, onCheckout }) => {
  // Calculate totals
  let totalItems = 0;
  let totalPrice = 0;
  
  const allChecked = carts.length > 0 && carts.every(cart => cart.checked);

  carts.forEach(cart => {
    cart.items.forEach(item => {
      if (item.checked) {
        totalItems += item.quantity;
        const price = item.product.promotion 
          ? item.product.price * (1 - item.product.promotion.discountPercent / 100)
          : item.product.price;
        totalPrice += price * item.quantity;
      }
    });
  });

  return (
    <div className="card-custom sticky bottom-4 z-10 mt-6 p-4! ">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            className="checkbox checkbox-primary"
            checked={allChecked}
            onChange={(e) => onCheckAll(e.target.checked)}
          />
          <span className="text-gray-700 font-medium cursor-pointer" onClick={() => onCheckAll(!allChecked)}>
            Chọn tất cả
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-gray-600 mr-2">Tổng thanh toán ({totalItems} sản phẩm):</span>
            <span className="text-xl font-bold text-red-600">
              {formatMoney(totalPrice)}
            </span>
          </div>
          
          <button 
            className="btn btn-primary px-10 cursor-pointer"
            disabled={totalItems === 0}
            onClick={onCheckout}
          >
            Mua Hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemFooter;
