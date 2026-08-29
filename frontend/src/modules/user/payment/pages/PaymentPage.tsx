import { useState } from "react";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SelectAddress from "../../../../components/payment/SelectAddress";
import PaymentMethod, {
  type PaymentMethodType,
} from "../../../../components/payment/PaymentMethod";
import PaymentTotal from "../../../../components/payment/PaymentTotal";
import CartItem from "../../../../components/cart/CartItem";

import type { CartResponse } from "../../cart/types/cart.type";
import type { AddressResponse } from "../../address/types/address.type";

// ── Mock data ────────────────────────────────────────────────────────────────

const mockAddresses: AddressResponse[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn An",
    phone: "0901234567",
    provinceId: 79,
    districtId: 760,
    wardCode: "26734",
    street: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh",
    streetFull: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh",
    defaultAddress: true,
  },
  {
    id: 2,
    fullName: "Nguyễn Văn An",
    phone: "0907654321",
    provinceId: 1,
    districtId: 1,
    wardCode: "00001",
    street: "45 Lê Đại Hành, Phường 13, Quận 11, TP. Hà Nội",
    streetFull: "45 Lê Đại Hành, Phường 13, Quận 11, TP. Hà Nội",
    defaultAddress: false,
  },
];

const mockCheckedCarts: CartResponse[] = [
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
        cartItemId: 105,
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
    ],
  },
  {
    shopId: 2,
    shopName: "Tiki Trading",
    shopSlug: "tiki-trading",
    checked: true,
    items: [
      {
        cartItemId: 103,
        quantity: 1,
        checked: true,
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

// ── Component ────────────────────────────────────────────────────────────────

const PaymentPage = () => {
  const navigate = useNavigate();

  const [carts] = useState<CartResponse[]>(mockCheckedCarts);
  const [addresses] = useState<AddressResponse[]>(mockAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    mockAddresses.find((a) => a.defaultAddress)?.id ?? null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const [note, setNote] = useState("");

  const handleSelectAddress = (address: AddressResponse) => {
    setSelectedAddressId(address.id);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ giao hàng trước khi đặt hàng.");
      return;
    }
    setIsPlacingOrder(true);
    // Simulating API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsPlacingOrder(false);
    console.log("Order placed!", { selectedAddressId, paymentMethod, note, voucherDiscount });
    // navigate("/order-success");
  };

  return (
    <div className="w-full my-4 p-4 lg:p-3 space-y-6">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag size={24} />
          Thanh Toán
        </h1>
      </div>

      {/* Main layout: left (products + note) | right (address + method + total) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
        {/* ── Left column: sản phẩm + ghi chú ─────────── */}
        <div className="space-y-6">
          {/* 1. Cart items (read-only, grouped by shop) */}
          <div className="flex flex-col gap-4">
            {carts.map((cart) => (
              <CartItem
                key={cart.shopId}
                item={cart}
                onCheck={() => {}}
                onQuantityChange={() => {}}
                onRemove={() => {}}
                showControls={false}
                onVoucherApply={setVoucherDiscount}
              />
            ))}
          </div>

          {/* 2. Order note */}
          <div className="card-custom">
            <label
              htmlFor="order-note"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Ghi chú đơn hàng{" "}
              <span className="font-normal text-gray-400">(tuỳ chọn)</span>
            </label>
            <textarea
              id="order-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Giao giờ hành chính, để đầu hẻm..."
              className="w-full resize-none rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 transition"
            />
          </div>
        </div>

        {/* ── Right sidebar (sticky): địa chỉ + thanh toán + tổng ── */}
        <div className="lg:sticky lg:top-4 space-y-4">
          {/* 3. Delivery Address */}
          <SelectAddress
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelect={handleSelectAddress}
          />

          {/* 4. Payment Method */}
          <PaymentMethod selected={paymentMethod} onChange={setPaymentMethod} />

          {/* 5. Order total + place order */}
          <PaymentTotal
            carts={carts}
            paymentMethod={paymentMethod}
            onPlaceOrder={handlePlaceOrder}
            isLoading={isPlacingOrder}
            voucherDiscount={voucherDiscount}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
