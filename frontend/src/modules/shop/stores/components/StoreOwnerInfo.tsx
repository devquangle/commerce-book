import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  ShieldCheck,
  ShieldX,
  Venus,
  Mars,
} from "lucide-react";
import { InputField } from "@/components/common/InputField";
import { SelectBox } from "@/components/common/SelectBox";

const SEX_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

export const StoreOwnerInfo = () => {
  return (
    <div className="card-custom">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center shrink-0">
          <User size={17} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">Thông tin chủ cửa hàng</h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            Thông tin định danh, không thể chỉnh sửa sau khi xác minh
          </p>
        </div>

        {/* Verification badge */}
        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20 shrink-0">
          <ShieldCheck size={14} />
          <span className="text-xs font-semibold">Đã xác minh</span>
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Họ tên */}
        <InputField
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          defaultValue="Lê Quang Huynh"
          icon={<User size={15} />}
          disabled
          containerClassName="sm:col-span-2"
        />

        {/* Email */}
        <InputField
          label="Email"
          type="email"
          placeholder="example@email.com"
          defaultValue="huynhquangle@email.com"
          icon={<Mail size={15} />}
          disabled
        />

        {/* Số điện thoại */}
        <InputField
          label="Số điện thoại"
          type="tel"
          placeholder="0912 345 678"
          defaultValue="0912 345 678"
          icon={<Phone size={15} />}
          disabled
        />

        {/* CCCD */}
        <InputField
          label="Số CCCD / CMND"
          placeholder="012 345 678 901"
          defaultValue="079 203 012 345"
          icon={<CreditCard size={15} />}
          disabled
        />

        {/* Ngày sinh */}
        <InputField
          label="Ngày sinh"
          type="date"
          defaultValue="2003-05-15"
          icon={<Calendar size={15} />}
          disabled
        />

        {/* Giới tính */}
        <SelectBox
          label="Giới tính"
          options={SEX_OPTIONS}
          value="MALE"
          disabled
        />
      </div>

      {/* Unverified warning */}
      <div className="mt-5 flex items-start gap-2.5 bg-rose-50 dark:bg-rose-500/10 rounded-xl px-4 py-3 border border-rose-100 dark:border-rose-500/20 hidden">
        <ShieldX size={13} className="shrink-0 mt-0.5 text-rose-500" />
        <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed">
          Tài khoản chưa được xác minh. Vui lòng cung cấp đầy đủ thông tin để kích hoạt cửa hàng.
        </p>
      </div>
    </div>
  );
};