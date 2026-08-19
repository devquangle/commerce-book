import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputField } from "@/components/common/InputField";
import { TextAreaField } from "@/components/common/TextAreaField";
import Spinner from "@/components/common/Spinner";
import { VoucherHeader } from "../components/VoucherHeader";
import { useCreateVoucherShop } from "../hooks/useVoucher";
import type { VoucherRequest } from "../types/voucher.type";

const INITIAL_FORM: VoucherRequest = {
  name: "",
  code: "",
  description: "",
  discountPercent: 0,
  minOrderValue: 0,
  maxDiscount: 0,
  usageLimit: 0,
  usedCount: 0,
  startDate: "",
  endDate: "",
  status: "ACTIVE",
};

const ShopVoucherAddPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createVoucher, isPending: isCreating } =
    useCreateVoucherShop();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VoucherRequest>({
    defaultValues: INITIAL_FORM,
    mode: "onChange",
  });

  const onFormSubmit = async (data: VoucherRequest) => {
    try {
      await createVoucher(data);
      navigate("/shop/vouchers");
    } catch (error) {
      console.error("Lỗi khi tạo voucher:", error);
    }
  };

  const handleBack = () => {
    navigate("/shop/vouchers");
  };

  if (isCreating) {
    return <Spinner message="Đang tạo voucher..." />;
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-6 w-full pb-6"
    >
      <VoucherHeader mode="add" onBack={handleBack} onReset={() => reset()} />

      <div className="card-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6">
            <InputField
              label="Tên chương trình/Voucher"
              placeholder="VD: Siêu Sale Tháng 10"
              required
              {...register("name", {
                required: "Tên voucher không được để trống",
              })}
              error={errors.name?.message}
            />
          </div>
          <div className="md:col-span-6">
            <InputField
              label="Mã Voucher"
              placeholder="VD: SALE10"
              required
              {...register("code", {
                required: "Mã voucher không được để trống",
              })}
              error={errors.code?.message}
            />
          </div>

          <div className="md:col-span-6">
            <InputField
              label="Phần trăm giảm (%)"
              type="number"
              required
              {...register("discountPercent", {
                required: "Vui lòng nhập phần trăm giảm",
                min: { value: 0, message: "Không được nhỏ hơn 0" },
                max: { value: 100, message: "Không được vượt quá 100" },
              })}
              error={errors.discountPercent?.message}
            />
          </div>
          <div className="md:col-span-6">
            <InputField
              label="Giá trị đơn hàng tối thiểu"
              type="number"
              required
              {...register("minOrderValue", {
                required: "Vui lòng nhập giá trị tối thiểu",
                min: { value: 0, message: "Không được nhỏ hơn 0" },
              })}
              error={errors.minOrderValue?.message}
            />
          </div>

          <div className="md:col-span-6">
            <InputField
              label="Mức giảm tối đa"
              type="number"
              required
              {...register("maxDiscount", {
                required: "Vui lòng nhập mức giảm tối đa",
                min: { value: 0, message: "Không được nhỏ hơn 0" },
              })}
              error={errors.maxDiscount?.message}
            />
          </div>
          <div className="md:col-span-6">
            <InputField
              label="Số lượt sử dụng tối đa"
              type="number"
              required
              {...register("usageLimit", {
                required: "Vui lòng nhập giới hạn lượt dùng",
                min: { value: 1, message: "Ít nhất phải là 1" },
              })}
              error={errors.usageLimit?.message}
            />
          </div>

          <div className="md:col-span-6">
            <InputField
              label="Thời gian bắt đầu"
              type="datetime-local"
              required
              {...register("startDate", {
                required: "Vui lòng chọn thời gian bắt đầu",
              })}
              error={errors.startDate?.message}
            />
          </div>
          <div className="md:col-span-6">
            <InputField
              label="Thời gian kết thúc"
              type="datetime-local"
              required
              {...register("endDate", {
                required: "Vui lòng chọn thời gian kết thúc",
              })}
              error={errors.endDate?.message}
            />
          </div>

          <div className="md:col-span-12">
            <TextAreaField
              label="Mô tả"
              placeholder="Nhập mô tả chi tiết về voucher..."
              rows={4}
              {...register("description")}
              error={errors.description?.message}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ShopVoucherAddPage;
