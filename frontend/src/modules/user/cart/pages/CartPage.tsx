import { useState } from "react";
import { ShoppingCart } from "lucide-react";

import CartHeader from "../../../../components/cart/CartHeader";
import CartItem from "../../../../components/cart/CartItem";
import CartFooter from "../../../../components/cart/CartFooter";
import type { CartResponse } from "../types/cart.type";
import { useNavigate } from "react-router-dom";

// Mock data for initial UI rendering
const initialMockData: CartResponse[] = [
  {
    shopId: 1,
    shopName: "Nhà sách Fahasa",
    shopSlug: "nha-sach-fahasa",
    checked: true,
    items: [
      {
        cartItemId: 101,
        quantity: 2,
        checked: true,
        product: {
          productId: 1,
          productName: "Sách Clean Code - Mã Sạch",
          productSlug: "sach-clean-code",
          price: 250000,
          quantity: 10,
          weight: 500,
          publishYear: "2019",
          pages: 400,
          publisherName: "NXB Trẻ",
          seriesName: "",
          genresName: ["Công nghệ", "Lập trình"],
          authorsName: ["Robert C. Martin"],
          urlImageDefault: "https://via.placeholder.com/150",
          promotion: {
            discountPercent: 10,
            quantity: 100,
          },
        },
      },
      {
        cartItemId: 102,
        quantity: 1,
        checked: false,
        product: {
          productId: 2,
          productName: "Đắc Nhân Tâm",
          productSlug: "dac-nhan-tam",
          price: 100000,
          quantity: 50,
          weight: 300,
          publishYear: "2020",
          pages: 320,
          publisherName: "NXB Tổng Hợp",
          seriesName: "",
          genresName: ["Tâm lý", "Kỹ năng sống"],
          authorsName: ["Dale Carnegie"],
          urlImageDefault: "https://via.placeholder.com/150",
        },
      },
    ],
  },
  {
    shopId: 2,
    shopName: "Tiki Trading",
    shopSlug: "tiki-trading",
    checked: false,
    items: [
      {
        cartItemId: 103,
        quantity: 1,
        checked: false,
        product: {
          productId: 3,
          productName: "Harry Potter và Hòn Đá Phù Thủy",
          productSlug: "harry-potter-1",
          price: 150000,
          quantity: 20,
          weight: 400,
          publishYear: "2021",
          pages: 350,
          publisherName: "NXB Trẻ",
          seriesName: "Harry Potter",
          genresName: ["Fantasy", "Phiêu lưu"],
          authorsName: ["J.K. Rowling"],
          urlImageDefault: "https://via.placeholder.com/150",
          promotion: {
            discountPercent: 5,
            quantity: 50,
          },
        },
      },
    ],
  },
];

const CartPage = () => {
  const [carts, setCarts] = useState<CartResponse[]>(initialMockData);
  const navigate=useNavigate();
  const handleCheckShop = (shopId: number, checked: boolean) => {
    setCarts((prev) =>
      prev.map((cart) => {
        if (cart.shopId === shopId) {
          return {
            ...cart,
            checked,
            items: cart.items.map((item) => ({ ...item, checked })),
          };
        }
        return cart;
      }),
    );
  };

  const handleCheckItem = (cartItemId: number, checked: boolean) => {
    setCarts((prev) =>
      prev.map((cart) => {
        const updatedItems = cart.items.map((item) =>
          item.cartItemId === cartItemId ? { ...item, checked } : item,
        );

        // Update shop checkbox if all items are checked
        const allItemsChecked =
          updatedItems.length > 0 && updatedItems.every((i) => i.checked);

        return {
          ...cart,
          items: updatedItems,
          checked: allItemsChecked,
        };
      }),
    );
  };

  const handleQuantityChange = (cartItemId: number, quantity: number) => {
    setCarts((prev) =>
      prev.map((cart) => ({
        ...cart,
        items: cart.items.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item,
        ),
      })),
    );
  };

  const handleRemoveItem = (cartItemId: number) => {
    setCarts((prev) => {
      const newCarts = prev
        .map((cart) => ({
          ...cart,
          items: cart.items.filter((item) => item.cartItemId !== cartItemId),
        }))
        .filter((cart) => cart.items.length > 0);
      return newCarts;
    });
  };

  const handleCheckAll = (checked: boolean) => {
    setCarts((prev) =>
      prev.map((cart) => ({
        ...cart,
        checked,
        items: cart.items.map((item) => ({ ...item, checked })),
      })),
    );
  };

  const handleRemoveSelectedItems = () => {
    setCarts((prev) => {
      const newCarts = prev
        .map((cart) => ({
          ...cart,
          items: cart.items.filter((item) => !item.checked),
        }))
        .filter((cart) => cart.items.length > 0);
      return newCarts;
    });
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (carts.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingCart size={80} className="text-gray-300 mb-6" />
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

  // Calculate if all items are checked for the CartHeader
  const hasItems = carts.length > 0 && carts.some(cart => cart.items.length > 0);
  const isCheckedAll = hasItems && carts.every(cart => cart.items.every(item => item.checked));

  return (
    <div className="w-full space-y-16 my-4 p-4 lg:p-3">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingCart /> Giỏ Hàng
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
            onShopCheck={(checked) => handleCheckShop(cart.shopId, checked)}
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
