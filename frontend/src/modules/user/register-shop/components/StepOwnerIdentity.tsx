import React from "react";
import { User, CreditCard, Calendar, MapPin } from "lucide-react";
import { InputField } from "@/components/common/InputField";
import { SelectBox } from "@/components/common/SelectBox";
import type { OwnerIdentityInfo } from "../types/register-shop.type";

export interface StepOwnerIdentityProps {
  data: OwnerIdentityInfo;
  onChange: (fields: Partial<OwnerIdentityInfo>) => void;
  errors: Record<string, string>;
}

const GENDER_OPTIONS = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
  { label: "Khác", value: "Khác" },
];

export const StepOwnerIdentity: React.FC<StepOwnerIdentityProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Bước 2: Thông tin định danh chủ sở hữu
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Nhập đầy đủ và chính xác thông tin cá nhân ghi trên CCCD/CMND để xác thực.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <InputField
          label="Họ và tên chủ sở hữu"
          placeholder="NGUYEN VAN A"
          required
          icon={<User className="w-4 h-4 text-zinc-400" />}
          value={data.fullName || ""}
          onChange={(e) => onChange({ fullName: e.target.value })}
          error={errors.fullName}
          helperText="Ghi in hoa không dấu hoặc đúng với trên CCCD"
        />

        {/* CCCD */}
        <InputField
          label="Số CCCD / CMND"
          placeholder="012345678912"
          required
          icon={<CreditCard className="w-4 h-4 text-zinc-400" />}
          value={data.cccd || ""}
          onChange={(e) => onChange({ cccd: e.target.value })}
          error={errors.cccd}
          helperText="Số Căn cước công dân gồm 12 chữ số"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date of Birth */}
        <InputField
          label="Ngày sinh"
          type="date"
          required
          icon={<Calendar className="w-4 h-4 text-zinc-400" />}
          value={data.dob || ""}
          onChange={(e) => onChange({ dob: e.target.value })}
          error={errors.dob}
        />

        {/* Sex */}
        <SelectBox
          label="Giới tính"
          required
          options={GENDER_OPTIONS}
          placeholder="Chọn giới tính"
          value={data.sex || ""}
          onChange={(e) => onChange({ sex: e.target.value })}
          error={errors.sex}
        />

        {/* Issue Date */}
        <InputField
          label="Ngày cấp CCCD"
          type="date"
          required
          icon={<Calendar className="w-4 h-4 text-zinc-400" />}
          value={data.issueDate || ""}
          onChange={(e) => onChange({ issueDate: e.target.value })}
          error={errors.issueDate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expiry Date */}
        <InputField
          label="Ngày hết hạn CCCD"
          type="date"
          icon={<Calendar className="w-4 h-4 text-zinc-400" />}
          value={data.expiryDate || ""}
          onChange={(e) => onChange({ expiryDate: e.target.value })}
          error={errors.expiryDate}
          helperText="Bỏ trống nếu không thời hạn"
        />

        {/* Address */}
        <InputField
          label="Địa chỉ thường trú (trên CCCD)"
          placeholder="Số 123 Đường ABC, Phường X, Quận Y, Tỉnh Z"
          required
          icon={<MapPin className="w-4 h-4 text-zinc-400" />}
          value={data.address || ""}
          onChange={(e) => onChange({ address: e.target.value })}
          error={errors.address}
        />
      </div>
    </div>
  );
};
