import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { InputDate } from "@/components/ui/InputDate";
import { SelectBox } from "@/components/ui/SelectBox";
import Spinner from "@/components/ui/Spinner";
import { PromotionHeader } from "../components/PromotionHeader";
import { useCreatePromotionShop } from "../hooks/usePromotion";
import type { PromotionRequest, PromotionCampaignType } from "../types/promotion.type";

// Import product hooks & components
import { useProductShop } from "@/modules/shop/products/hooks/useProduct";
import { PromotionProductTable } from "../components/PromotionProductTable";
import { PromotionProductFilter } from "../components/PromotionProductFilter";
import type { ProductResponse } from "@/modules/shop/products/types/product.type";

import { useProductShopFilter } from "@/modules/shop/products/hooks/useProductShopFilter";
import PromotionService from "../services/promotion.service";
import { showWarningToast } from "@/libs/utils/toastUtil";

const INITIAL_FORM: PromotionRequest = {
  name: "",
  startDate: "",
  endDate: "",
  promotionCampaignType: "FLASH_SALE",
  status: "ACTIVE",
  products: [],
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

  // State cho product table
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [productConfigs, setProductConfigs] = useState<Record<number, { discountPercent?: number | string; maxQuantity?: number | string }>>({});

  // Dùng hook filter thay vì useState
  const {
    keyword: productKeyword,
    filterParams,
    handleKeywordChange,
    handlePageChange,
    handlePageSizeChange,
    handleResetFilter
  } = useProductShopFilter();

  // Fetch products với status mặc định là ACTIVE
  const { data: productsData, isLoading: isLoadingProducts } = useProductShop({
    ...filterParams,
    status: "ACTIVE",
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<PromotionRequest>({
    defaultValues: INITIAL_FORM,
    mode: "onChange",
  });

  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");

  const onFormSubmit = async (data: PromotionRequest) => {
    // Construct the products array from selectedProductIds and productConfigs
    const productsPayload = selectedProductIds.map((id) => ({
      productId: id,
      discountPercent: Number(productConfigs[id]?.discountPercent ?? 10),
      maxQuantity: Number(productConfigs[id]?.maxQuantity ?? 10),
    }));

    const finalPayload: PromotionRequest = {
      ...data,
      products: productsPayload,
    };

    console.log("PAYLOAD SUBMIT (Tạo mới):", finalPayload);

    try {
      await createPromotion(finalPayload);
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

      {/* Phía dưới: Danh sách Sản phẩm ACTIVE (Để thêm vào promotion) */}
      <div className="flex flex-col gap-4 mt-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          Sản phẩm áp dụng
          {selectedProductIds.length > 0 && (
            <span className="text-sm font-medium bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 px-2 py-0.5 rounded-full">
              Đã chọn {selectedProductIds.length}
            </span>
          )}
        </h2>

        <PromotionProductFilter
          keyword={productKeyword}
          onKeywordChange={handleKeywordChange}
          onReset={handleResetFilter}
        />

        {isLoadingProducts ? (
          <Spinner message="Đang tải danh sách sản phẩm..." />
        ) : (
          <PromotionProductTable
            products={productsData?.items || []}
            page={filterParams.page}
            pageSize={filterParams.size}
            totalElements={productsData?.totalItems}
            totalPages={productsData?.totalPages}
            selectedProductIds={selectedProductIds}
            onSelectProduct={(productId, checked) => {
              setSelectedProductIds((prev) =>
                checked
                  ? [...prev, productId]
                  : prev.filter((id) => id !== productId)
              );
            }}
            onSelectAll={(checked, validProductIds) => {
              if (checked) {
                setSelectedProductIds((prev) => Array.from(new Set([...prev, ...validProductIds])));
              } else {
                setSelectedProductIds((prev) => prev.filter((id) => !validProductIds.includes(id)));
              }
            }}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            productConfigs={productConfigs}
            formStartDate={watchStartDate}
            formEndDate={watchEndDate}
            onUpdateProductConfig={(productId, field, value) => {
              setProductConfigs((prev) => ({
                ...prev,
                [productId]: {
                  ...prev[productId],
                  [field]: value,
                },
              }));
            }}
          />
        )}
      </div>
    </form>
  );
};

export default ShopPromotionAddPage;
