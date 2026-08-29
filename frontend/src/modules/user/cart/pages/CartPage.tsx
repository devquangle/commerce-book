import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CartHeader from "../../../../components/cart/CartHeader";
import CartItem from "../../../../components/cart/CartItem";
import CartFooter from "../../../../components/cart/CartFooter";

import type { CartResponse } from "../types/cart.type";
import {
  useCart,
  getSelectedCartItemIds,
  setSelectedCartItemIds,
  toggleSelectedCartItem,
} from "../hooks/useCart";

const CartPage = () => {
  const { data: cartData, isPending, error } = useCart();

  const navigate = useNavigate();

  // Local state để quản lý checked / quantity / remove
  const [carts, setCarts] = useState<CartResponse[]>([]);
  const [prevCartData, setPrevCartData] = useState<CartResponse[] | undefined>(undefined);

  // Khởi tạo data từ React Query vào local state trong quá trình render (chuẩn React)
  if (cartData !== prevCartData) {
    setPrevCartData(cartData);
    if (cartData) {
      const selectedIds = getSelectedCartItemIds();
      setCarts(
        cartData.map((cart) => {
          const items = cart.items.map((item) => ({
            ...item,
            checked: selectedIds.includes(item.cartItemId),
          }));
          const allItemsChecked = items.length > 0 && items.every((item) => item.checked);
          return {
            ...cart,
            checked: allItemsChecked,
            items,
          };
        }),
      );
    } else {
      setCarts([]);
    }
  }

  if (isPending) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500">
          Đã xảy ra lỗi khi tải giỏ hàng.
        </p>
      </div>
    );
  }

  /**
   * Check / uncheck toàn bộ sản phẩm của shop
   */
  const handleCheckShop = (
    shopId: number,
    checked: boolean,
  ) => {
    const shopCart = carts.find((c) => c.shopId === shopId);
    if (shopCart) {
      shopCart.items.forEach((item) => {
        toggleSelectedCartItem(item.cartItemId, checked);
      });
    }

    setCarts((prev) =>
      prev.map((cart) => {
        if (cart.shopId !== shopId) {
          return cart;
        }

        return {
          ...cart,
          checked,
          items: cart.items.map((item) => ({
            ...item,
            checked,
          })),
        };
      }),
    );
  };

  /**
   * Check / uncheck một sản phẩm
   */
  const handleCheckItem = (
    cartItemId: number,
    checked: boolean,
  ) => {
    toggleSelectedCartItem(cartItemId, checked);

    setCarts((prev) =>
      prev.map((cart) => {
        const updatedItems = cart.items.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, checked }
            : item,
        );

        const allItemsChecked =
          updatedItems.length > 0 &&
          updatedItems.every((item) => item.checked);

        return {
          ...cart,
          items: updatedItems,
          checked: allItemsChecked,
        };
      }),
    );
  };

  /**
   * Thay đổi số lượng sản phẩm
   */
  const handleQuantityChange = (
    cartItemId: number,
    quantity: number,
  ) => {
    setCarts((prev) =>
      prev.map((cart) => ({
        ...cart,
        items: cart.items.map((item) =>
          item.cartItemId === cartItemId
            ? {
                ...item,
                quantity,
              }
            : item,
        ),
      })),
    );
  };

  /**
   * Xóa một sản phẩm
   */
  const handleRemoveItem = (
    cartItemId: number,
  ) => {
    toggleSelectedCartItem(cartItemId, false);

    setCarts((prev) =>
      prev
        .map((cart) => ({
          ...cart,
          items: cart.items.filter(
            (item) => item.cartItemId !== cartItemId,
          ),
        }))
        .filter((cart) => cart.items.length > 0),
    );
  };

  /**
   * Check / uncheck tất cả sản phẩm
   */
  const handleCheckAll = (
    checked: boolean,
  ) => {
    if (checked) {
      const allIds = carts.flatMap((c) => c.items.map((i) => i.cartItemId));
      setSelectedCartItemIds(allIds);
    } else {
      setSelectedCartItemIds([]);
    }

    setCarts((prev) =>
      prev.map((cart) => ({
        ...cart,
        checked,
        items: cart.items.map((item) => ({
          ...item,
          checked,
        })),
      })),
    );
  };

  /**
   * Xóa tất cả sản phẩm đang được chọn
   */
  const handleRemoveSelectedItems = () => {
    const currentSelected = getSelectedCartItemIds();
    if (currentSelected.length > 0) {
      setSelectedCartItemIds([]); // Clear them as they are being removed
    }

    setCarts((prev) =>
      prev
        .map((cart) => ({
          ...cart,
          items: cart.items.filter(
            (item) => !item.checked,
          ),
        }))
        .filter((cart) => cart.items.length > 0),
    );
  };

  /**
   * Checkout
   */
  const handleCheckout = () => {
    navigate("/checkout");
  };

  /**
   * Giỏ hàng rỗng
   */
  if (carts.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingCart
          size={80}
          className="text-gray-300 mb-6"
        />

        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Giỏ hàng của bạn đang trống
        </h2>

        <p className="text-gray-500 mb-6">
          Hãy chọn thêm sản phẩm để mua sắm nhé!
        </p>

        <button
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  /**
   * Kiểm tra có sản phẩm hay không
   */
  const hasItems = carts.some(
    (cart) => cart.items.length > 0,
  );

  /**
   * Kiểm tra tất cả sản phẩm đã được chọn
   */
  const isCheckedAll =
    hasItems &&
    carts.every(
      (cart) =>
        cart.items.length > 0 &&
        cart.items.every((item) => item.checked),
    );

  return (
    <div className="w-full space-y-16 my-4 p-4 lg:p-3">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingCart />
        Giỏ Hàng
      </h1>

      <CartHeader
        isCheckedAll={isCheckedAll}
        onCheckAll={handleCheckAll}
        onRemoveAll={handleRemoveSelectedItems}
      />

      <div className="flex flex-col gap-4">
        {carts.map((cart) => (
          <CartItem
            key={cart.shopId}
            item={cart}
            onCheck={handleCheckItem}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
            onShopCheck={(checked) =>
              handleCheckShop(
                cart.shopId,
                checked,
              )
            }
          />
        ))}
      </div>

      <CartFooter
        carts={carts}
        onCheckAll={handleCheckAll}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default CartPage;
