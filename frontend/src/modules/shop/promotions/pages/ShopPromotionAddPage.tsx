import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { InputField } from "@/components/common/InputField";
import { TextAreaField } from "@/components/common/TextAreaField";
import { InputDate } from "@/components/common/InputDate";
import Spinner from "@/components/common/Spinner";
import { PromotionHeader } from "../components/PromotionHeader";
import { useCreatePromotionShop } from "../hooks/usePromotion";
import type { PromotionRequest } from "../types/promotion.type";

const INITIAL_FORM: PromotionRequest = {
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

const ShopPromotionAddPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createPromotion, isPending: isCreating } =
    useCreatePromotionShop();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PromotionRequest>({
    defaultValues: INITIAL_FORM,
    mode: "onChange",
  });

  const onFormSubmit = async (data: PromotionRequest) => {
    try {
      await createPromotion(data);
      navigate("/shop/promotions");
    } catch (error) {
      console.error("Lỗi khi tạo promotion:", error);
    }
  };

  const handleBack = () => {
    navigate("/shop/promotions");
  };

  if (isCreating) {
    return <Spinner message="Đang tạo promotion..." />;
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-6 w-full pb-6"
    >
      <PromotionHeader mode="add" onBack={handleBack} onReset={() => reset()} />

      <div className="card-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6">
            <InputField
              label="Tên chương trình/Promotion"
              placeholder="VD: Siêu Sale Tháng 10"
              required
              {...register("name", {
                required: "Tên promotion không được để trống",
              })}
              error={errors.name?.message}
            />
          </div>
          <div className="md:col-span-6">
            <InputField
              label="Mã Promotion"
              placeholder="VD: SALE10"
              required
              {...register("code", {
                required: "Mã promotion không được để trống",
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
            <Controller
              name="minOrderValue"
              control={control}
              rules={{ 
                required: "Vui lòng nhập giá trị tối thiểu",
                min: { value: 0, message: "Không được nhỏ hơn 0" }
              }}
              render={({ field }) => (
                <InputField
                  label="Giá trị đơn hàng tối thiểu"
                  type="text"
                  required
                  value={field.value !== undefined && field.value !== null ? new Intl.NumberFormat("vi-VN").format(field.value) : ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    field.onChange(rawValue ? Number(rawValue) : 0);
                  }}
                  error={errors.minOrderValue?.message}
                />
              )}
            />
          </div>

          <div className="md:col-span-6">
            <Controller
              name="maxDiscount"
              control={control}
              rules={{ 
                required: "Vui lòng nhập mức giảm tối đa",
                min: { value: 0, message: "Không được nhỏ hơn 0" }
              }}
              render={({ field }) => (
                <InputField
                  label="Mức giảm tối đa"
                  type="text"
                  required
                  value={field.value !== undefined && field.value !== null ? new Intl.NumberFormat("vi-VN").format(field.value) : ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    field.onChange(rawValue ? Number(rawValue) : 0);
                  }}
                  error={errors.maxDiscount?.message}
                />
              )}
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
            <Controller
              name="startDate"
              control={control}
              rules={{ required: "Vui lòng chọn thời gian bắt đầu" }}
              render={({ field }) => (
                <InputDate
                  label="Thời gian bắt đầu"
                  showTimeSelect
                  value={field.value}
                  onChange={(date) => {
                    if (date) {
                      const pad = (n: number) => n.toString().padStart(2, '0');
                      field.onChange(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`);
                    } else {
                      field.onChange("");
                    }
                  }}
                  error={errors.startDate?.message}
                />
              )}
            />
          </div>
          <div className="md:col-span-6">
            <Controller
              name="endDate"
              control={control}
              rules={{ required: "Vui lòng chọn thời gian kết thúc" }}
              render={({ field }) => (
                <InputDate
                  label="Thời gian kết thúc"
                  showTimeSelect
                  value={field.value}
                  onChange={(date) => {
                    if (date) {
                      const pad = (n: number) => n.toString().padStart(2, '0');
                      field.onChange(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`);
                    } else {
                      field.onChange("");
                    }
                  }}
                  error={errors.endDate?.message}
                />
              )}
            />
          </div>

          <div className="md:col-span-12">
            <TextAreaField
              label="Mô tả"
              placeholder="Nhập mô tả chi tiết về promotion..."
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

export default ShopPromotionAddPage;
