import React from "react";
import { CreditCard, Banknote, Building2, CheckCircle2 } from "lucide-react";

export type PaymentMethodType = "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY";

interface PaymentMethodOption {
  id: PaymentMethodType;
  label: string;
  icon: React.ReactNode;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "COD",
    label: "Thanh toán khi nhận hàng",
    icon: <Banknote size={20} className="text-green-600" />,
  },
  {
    id: "BANK_TRANSFER",
    label: "Chuyển khoản ngân hàng",
    icon: <Building2 size={20} className="text-blue-600" />,
  },
  {
    id: "MOMO",
    label: "Ví MoMo",
    icon: (
      <span className="text-lg font-black text-pink-500 leading-none">M</span>
    ),
  },
  {
    id: "VNPAY",
    label: "VNPay",
    icon: <CreditCard size={20} className="text-blue-800" />,
  },
];

interface PaymentMethodProps {
  selected: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className="card-custom">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CreditCard size={18} className="text-blue-600 shrink-0" />
        <h2 className="font-semibold text-gray-800 text-base">
          Phương thức thanh toán
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selected === method.id;
          return (
            <button
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 ${
                  isSelected ? "bg-white shadow-sm" : "bg-gray-100"
                }`}
              >
                {method.icon}
              </div>

              {/* Label */}
              <p
                className={`flex-1 text-sm font-semibold ${
                  isSelected ? "text-blue-700" : "text-gray-800"
                }`}
              >
                {method.label}
              </p>

              {/* Check mark */}
              {isSelected && (
                <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethod;
