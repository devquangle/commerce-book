import React from "react";
import { Mail, Phone, Lock, ShieldCheck } from "lucide-react";
import { InputField } from "@/components/common/InputField";
import type { ShopAccountInfo } from "../types/register-shop.type";

export interface StepAccountInfoProps {
  data: ShopAccountInfo;
  onChange: (fields: Partial<ShopAccountInfo>) => void;
  errors: Record<string, string>;
}

export const StepAccountInfo: React.FC<StepAccountInfoProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Bước 1: Thông tin tài khoản đăng ký
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Cung cấp email và số điện thoại liên hệ chính thức của chủ cửa hàng.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <InputField
          label="Email chủ sở hữu"
          type="email"
          placeholder="example@domain.com"
          required
          icon={<Mail className="w-4 h-4 text-zinc-400" />}
          value={data.email || ""}
          onChange={(e) => onChange({ email: e.target.value })}
          error={errors.email}
          helperText="Dùng để đăng nhập và nhận thông báo từ hệ thống"
        />

        {/* Phone */}
        <InputField
          label="Số điện thoại liên hệ"
          type="tel"
          placeholder="0987654321"
          required
          icon={<Phone className="w-4 h-4 text-zinc-400" />}
          value={data.phone || ""}
          onChange={(e) => onChange({ phone: e.target.value })}
          error={errors.phone}
          helperText="Số điện thoại nhận OTP xác thực chính chủ"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Password */}
        <InputField
          label="Mật khẩu tài khoản Shop"
          type="password"
          placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
          required
          icon={<Lock className="w-4 h-4 text-zinc-400" />}
          value={data.password || ""}
          onChange={(e) => onChange({ password: e.target.value })}
          error={errors.password}
        />

        {/* Confirm Password */}
        <InputField
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="Nhập lại mật khẩu vừa đặt"
          required
          icon={<ShieldCheck className="w-4 h-4 text-zinc-400" />}
          value={data.confirmPassword || ""}
          onChange={(e) => onChange({ confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />
      </div>
    </div>
  );
};
