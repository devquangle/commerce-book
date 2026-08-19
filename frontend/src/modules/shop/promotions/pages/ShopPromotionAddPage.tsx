import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { InputField } from "@/components/common/InputField";
import { InputDate } from "@/components/common/InputDate";
import { SelectBox } from "@/components/common/SelectBox";
import Spinner from "@/components/common/Spinner";
import { PromotionHeader } from "../components/PromotionHeader";
import { useCreatePromotionShop } from "../hooks/usePromotion";
import type { PromotionRequest, PromotionCampaignType } from "../types/promotion.type";

const INITIAL_FORM: PromotionRequest = {
  name: "",
  startDate: "",
  endDate: "",
  promotionCampaignType: "PRODUCT_DISCOUNT",
  status: "ACTIVE",
};

const CAMPAIGN_TYPE_OPTIONS = [
  { label: "Flash Sale", value: "FLASH_SALE" },
  { label: "Giảm giá sản phẩm", value: "PRODUCT_DISCOUNT" },
  { label: "Khuyến mãi theo mùa", value: "SEASONAL" },
];

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
              label="Tên chương trình khuyến mãi"
              placeholder="VD: Siêu Sale Tháng 10"
              required
              {...register("name", {
                required: "Tên chương trình không được để trống",
              })}
              error={errors.name?.message}
            />
          </div>
          
          <div className="md:col-span-6">
            <Controller
              name="promotionCampaignType"
              control={control}
              rules={{ required: "Vui lòng chọn loại chiến dịch" }}
              render={({ field }) => (
                <SelectBox
                  label="Loại chiến dịch"
                  options={CAMPAIGN_TYPE_OPTIONS}
                  required
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value as PromotionCampaignType)}
                  error={errors.promotionCampaignType?.message}
                />
              )}
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
                  required
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
                  required
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
        </div>
      </div>
    </form>
  );
};

export default ShopPromotionAddPage;
