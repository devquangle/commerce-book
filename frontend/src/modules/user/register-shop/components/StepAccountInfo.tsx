import React from "react";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, UserCheck, LogOut, CheckCircle2, Info } from "lucide-react";
import { FormInput } from "@/components/common/FormInput";
import { FormInputPassword } from "@/components/common/FormInputPassword";
import { useAuth } from "@/context/useAuth";
import type { RegisterShopRequest } from "../types/register-shop.type";

export const StepAccountInfo: React.FC = () => {
  const { isAuthenticated, userInfo, logout } = useAuth();
  const {
    control,
    watch,
  } = useFormContext<RegisterShopRequest>();

  const passwordValue = watch("password");

  // Trường hợp 2: Người dùng ĐÃ ĐĂNG NHẬP
  if (isAuthenticated && userInfo) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Bước 1: Xác nhận tài khoản đăng ký Shop
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Bạn đang đăng ký mở gian hàng bằng tài khoản CommerceBook hiện tại.
          </p>
        </div>

        {/* User Profile Card */}
        <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {userInfo.avatarUrl ? (
              <img
                src={userInfo.avatarUrl}
                alt={userInfo.name}
                className="w-12 h-12 rounded-full object-cover border border-blue-200 dark:border-blue-800"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-base shadow-xs">
                {(userInfo.name || userInfo.email || "U").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {userInfo.name || userInfo.username}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 rounded-full px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Đã xác thực
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {userInfo.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium inline-flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Đổi tài khoản khác
          </button>
        </div>


        {/* Note regarding password */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p>
            Mật khẩu của tài khoản hiện tại sẽ được tiếp tục sử dụng để đăng nhập vào Kênh Người Bán. Bạn không cần phải tạo mật khẩu mới.
          </p>
        </div>
      </div>
    );
  }

  // Trường hợp 1: Người dùng CHƯA ĐĂNG NHẬP
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Bước 1: Thông tin tài khoản đăng ký
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Cung cấp email tài khoản và mật khẩu đăng nhập cho Kênh Người Bán.
        </p>
      </div>

      {/* Suggest Login Banner */}
      <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Bạn đã có tài khoản CommerceBook từ trước?</span>
        </div>
        <Link
          to="/login?redirect=/register-shop"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold underline shrink-0 cursor-pointer"
        >
          Đăng nhập ngay
        </Link>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <FormInput
          name="email"
          control={control}
          label="Email đăng ký chủ sở hữu"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <FormInputPassword
            name="password"
            control={control}
            label="Mật khẩu tài khoản"
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

          {/* Confirm Password */}
          <FormInputPassword
            name="confirmPassword"
            control={control}
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu vừa đặt"
            required
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
