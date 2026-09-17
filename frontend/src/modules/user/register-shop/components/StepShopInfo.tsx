import React, { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Store, Building2, CreditCard, UserCheck, Image as ImageIcon } from "lucide-react";
import { FormInput } from "@/components/common/FormInput";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { SelectBox } from "@/components/ui/SelectBox";
import type { SelectOption } from "@/components/ui/SelectBox";
import SingleImageUpload from "@/components/common/SingleImageUpload";
import { useBank } from "@/modules/others/bank/hooks/useBank";
import type { BankResponse } from "@/modules/others/bank/types/bank.type";
import type { RegisterShopRequest } from "../types/register-shop.type";

const BANK_OPTIONS: SelectOption[] = [
  { label: "Vietcombank", subLabel: "Ngân hàng TMCP Ngoại thương Việt Nam", value: "Vietcombank" },
  { label: "Techcombank", subLabel: "Ngân hàng TMCP Kỹ thương Việt Nam", value: "Techcombank" },
  { label: "MB Bank", subLabel: "Ngân hàng TMCP Quân đội", value: "MBBank" },
  { label: "BIDV", subLabel: "Ngân hàng Đầu tư và Phát triển Việt Nam", value: "BIDV" },
  { label: "VietinBank", subLabel: "Ngân hàng Công Thương Việt Nam", value: "VietinBank" },
  { label: "VPBank", subLabel: "Ngân hàng TMCP Việt Nam Thịnh Vượng", value: "VPBank" },
  { label: "ACB", subLabel: "Ngân hàng TMCP Á Châu", value: "ACB" },
  { label: "TPBank", subLabel: "Ngân hàng TMCP Tiên Phong", value: "TPBank" },
  { label: "Sacombank", subLabel: "Ngân hàng TMCP Sài Gòn Thương Tín", value: "Sacombank" },
  { label: "Agribank", subLabel: "Ngân hàng Nông nghiệp và PTNT", value: "Agribank" },
];

export const StepShopInfo: React.FC = () => {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegisterShopRequest>();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const { data: banks = [], isLoading: isLoadingBanks } = useBank();

  const bankOptions: SelectOption[] = useMemo(() => {
    if (!banks || banks.length === 0) {
      return BANK_OPTIONS;
    }
    return banks.map((bank: BankResponse) => ({
      label: bank.shortName || bank.name,
      subLabel: bank.shortName ? bank.name : undefined,
      value: bank.shortName || bank.name,
      image: bank.logo,
    }));
  }, [banks]);

  const logoUrl = watch("logo") || "";
  const bannerUrl = watch("banner") || "";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Bước 3: Thông tin Shop & Ngân hàng nhận thanh toán
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Thiết lập tên cửa hàng, hình ảnh thương hiệu và tài khoản ngân hàng để nhận doanh thu.
        </p>
      </div>

      {/* Shop Basic Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
          <Store className="w-4 h-4 text-blue-500" /> Thông tin gian hàng
        </h4>

        <FormInput
          name="shopName"
          control={control}
          label="Tên Cửa hàng (Shop Name)"
          placeholder="Ví dụ: Tiệm Sách Tri Thức, BookZone Store..."
          required
          icon={<Store className="w-4 h-4 text-zinc-400" />}
          rules={{
            required: "Vui lòng nhập tên Cửa hàng",
          }}
          helperText="Tên shop hiển thị công khai cho khách hàng mua sắm"
          className="body-text"
        />

        <TextAreaField
          label="Mô tả Cửa hàng"
          placeholder="Giới thiệu ngắn gọn về các loại sản phẩm, dịch vụ hoặc thông điệp của Shop..."
          rows={3}
          {...register("shopDescription")}
          error={errors.shopDescription?.message}
          className="body-text"
        />

        {/* Logo and Banner Upload */}
        <div className="flex flex-col md:flex-row gap-6 pt-2">
          <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-500" /> Logo Cửa hàng (Tùy chọn)
            </p>
            <SingleImageUpload
              file={logoFile}
              setFile={(f) => {
                setLogoFile(f);
                if (f) {
                  setValue("logo", URL.createObjectURL(f));
                }
              }}
              avatarUrl={logoUrl}
              setAvatarUrl={(url) => setValue("logo", url)}
            />
          </div>

          <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-500" /> Ảnh bìa / Banner Shop (Tùy chọn)
            </p>
            <SingleImageUpload
              file={bannerFile}
              setFile={(f) => {
                setBannerFile(f);
                if (f) {
                  setValue("banner", URL.createObjectURL(f));
                }
              }}
              avatarUrl={bannerUrl}
              setAvatarUrl={(url) => setValue("banner", url)}
            />
          </div>
        </div>
      </div>

      {/* Bank Account Information */}
      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-blue-500" /> Tài khoản ngân hàng thụ hưởng
        </h4>

        <SelectBox
          label="Ngân hàng"
          required
          searchable
          searchPlaceholder="Tìm kiếm tên hoặc mã ngân hàng..."
          options={bankOptions}
          placeholder={isLoadingBanks ? "Đang tải danh sách ngân hàng..." : "Chọn ngân hàng thụ hưởng"}
          {...register("bankName", {
            required: "Vui lòng chọn ngân hàng thụ hưởng",
          })}
          error={errors.bankName?.message}
          textClassName="body-text"
        />

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <FormInput
              name="bankNumber"
              control={control}
              label="Số tài khoản ngân hàng"
              placeholder="0123456789"
              required
              icon={<CreditCard className="w-4 h-4 text-zinc-400" />}
              rules={{
                required: "Vui lòng nhập số tài khoản ngân hàng",
              }}
              className="body-text"
            />
          </div>

          <div className="flex-1">
            <FormInput
              name="ownerName"
              control={control}
              label="Tên chủ tài khoản"
              placeholder="NGUYEN VAN A"
              required
              icon={<UserCheck className="w-4 h-4 text-zinc-400" />}
              rules={{
                required: "Vui lòng nhập tên chủ tài khoản ngân hàng",
              }}
              helperText="Tên tài khoản phải trùng với tên trên thẻ / giấy tờ"
              className="body-text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
