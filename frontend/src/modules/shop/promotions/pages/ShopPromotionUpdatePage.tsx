import  { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { InputField } from "@/components/common/InputField";
import { TextAreaField } from "@/components/common/TextAreaField";
import { InputDate } from "@/components/common/InputDate";
import { SelectBox } from "@/components/common/SelectBox";
import Spinner from "@/components/common/Spinner";
import { PromotionHeader } from "../components/PromotionHeader";
import { useUpdatePromotionShop, usePromotionShopDetail } from "../hooks/usePromotion";
import type { PromotionRequest } from "../types/promotion.type";

const formatToDateTimeLocal = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const ShopPromotionUpdatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const promotionId = Number(id);

  const { data: promotionDetail, isLoading: isFetching } = usePromotionShopDetail(promotionId);
  const { mutateAsync: updatePromotion, isPending: isUpdating } = useUpdatePromotionShop(promotionId);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PromotionRequest>({
    mode: "onChange",
  });

  useEffect(() => {
    if (promotionDetail) {
      reset({
        ...promotionDetail,
        startDate: formatToDateTimeLocal(promotionDetail.startDate),
        endDate: formatToDateTimeLocal(promotionDetail.endDate),
      });
    }
  }, [promotionDetail, reset]);

  const onFormSubmit = async (data: PromotionRequest) => {
    try {
      await updatePromotion(data);
      navigate("/shop/promotions");
    } catch (error) {
      console.error("Lỗi khi cập nhật promotion:", error);
    }
  };

  const handleBack = () => {
    navigate("/shop/promotions");
  };

  if (isFetching || isUpdating) {
    return <Spinner message={isFetching ? "Đang tải dữ liệu..." : "Đang cập nhật..."} />;
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-6 w-full pb-6"
    >
      <PromotionHeader mode="update" onBack={handleBack} onReset={() => promotionDetail && reset({
        ...promotionDetail,
        startDate: formatToDateTimeLocal(promotionDetail.startDate),
        endDate: formatToDateTimeLocal(promotionDetail.endDate),
      })} />

      <div className="card-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
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
              disabled
              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
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
            <Controller
              name="status"
              control={control}
              rules={{ required: "Vui lòng chọn trạng thái" }}
              render={({ field }) => (
                <SelectBox
                  label="Trạng thái"
                  options={[
                    { label: "Hoạt động", value: "ACTIVE" },
                    { label: "Tạm ngưng", value: "INACTIVE" },
                  ]}
                  required
                  {...field}
                  error={errors.status?.message}
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

export default ShopPromotionUpdatePage;