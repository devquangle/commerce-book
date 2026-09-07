import React from "react";
import { useFormContext } from "react-hook-form";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { FormInput } from "@/components/common/FormInput";
import { FormInputPassword } from "@/components/common/FormInputPassword";
import type { RegisterShopRequest } from "../types/register-shop.type";

export const StepAccountInfo: React.FC = () => {
  const {
    control,
    watch,
  } = useFormContext<RegisterShopRequest>();

  const passwordValue = watch("password");

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

      <div className="flex flex-col md:flex-row gap-4">
        {/* Email */}
        <div className="flex-1">
          <FormInput
            name="email"
            control={control}
            label="Email chủ sở hữu"
            type="email"
            placeholder="example@domain.com"
            required
            icon={<Mail className="w-4 h-4 text-zinc-400" />}
            rules={{
              required: "Vui lòng nhập email chủ sở hữu",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Định dạng email không hợp lệ",
              },
            }}
            className="body-text"
          />
        </div>

        {/* Phone */}
        <div className="flex-1">
          <FormInput
            name="phone"
            control={control}
            label="Số điện thoại liên hệ"
            type="tel"
            placeholder="0987654321"
            required
            icon={<Phone className="w-4 h-4 text-zinc-400" />}
            rules={{
              required: "Vui lòng nhập số điện thoại",
              pattern: {
                value: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                message: "Số điện thoại không đúng định dạng Việt Nam (10 chữ số)",
              },
            }}
            className="body-text"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 pt-2">
        {/* Password */}
        <div className="flex-1">
          <FormInputPassword
            name="password"
            control={control}
            label="Mật khẩu tài khoản Shop"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            required
            rules={{
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            }}
            className="body-text"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex-1">
          <FormInputPassword
            name="confirmPassword"
            control={control}
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu vừa đặt"
            required
            icon={<ShieldCheck className="w-4 h-4 text-zinc-400" />}
            rules={{
              required: "Vui lòng xác nhận mật khẩu",
              validate: (value) =>
                value === passwordValue || "Mật khẩu xác nhận không khớp",
            }}
            className="body-text"
          />
        </div>
      </div>
    </div>
  );
};
