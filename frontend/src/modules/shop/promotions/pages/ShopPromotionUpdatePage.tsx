import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { InputDate } from "@/components/ui/InputDate";
import { SelectBox } from "@/components/ui/SelectBox";
import Spinner from "@/components/ui/Spinner";
import { PromotionHeader } from "../components/PromotionHeader";
import { useUpdatePromotionShop, usePromotionShopDetail } from "../hooks/usePromotion";
import type { PromotionRequest, PromotionCampaignType } from "../types/promotion.type";

// Import product hooks & components
import { useProductShop } from "@/modules/shop/products/hooks/useProduct";
import { PromotionProductTable } from "../components/PromotionProductTable";
import { PromotionProductFilter } from "../components/PromotionProductFilter";
import type { ProductResponse } from "@/modules/shop/products/types/product.type";

import { useProductShopFilter } from "@/modules/shop/products/hooks/useProductShopFilter";
import PromotionService from "../services/promotion.service";
import { showWarningToast } from "@/libs/utils/toastUtil";

const formatToDateTimeLocal = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const CAMPAIGN_TYPE_OPTIONS = [
  { label: "Flash Sale", value: "FLASH_SALE" },
  { label: "Giảm giá sản phẩm", value: "PRODUCT_DISCOUNT" },
  { label: "Khuyến mãi theo mùa", value: "SEASONAL" },
];

const ShopPromotionUpdatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const promotionId = Number(id);

  const { data: promotionDetail, isLoading: isFetching } = usePromotionShopDetail(promotionId);
  const { mutateAsync: updatePromotion, isPending: isUpdating } = useUpdatePromotionShop(promotionId);

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
    mode: "onChange",
  });

  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");

  useEffect(() => {
    if (promotionDetail) {
      reset({
        ...promotionDetail,
        startDate: formatToDateTimeLocal(promotionDetail.startDate),
        endDate: formatToDateTimeLocal(promotionDetail.endDate),
      });
      if (promotionDetail.products) {
        const ids = promotionDetail.products.map(p => p.productId);
        setSelectedProductIds(ids);
        const configs: Record<number, any> = {};
        promotionDetail.products.forEach(p => {
          configs[p.productId] = { discountPercent: p.discountPercent, maxQuantity: p.maxQuantity };
        });
        setProductConfigs(configs);
      }
    }
  }, [promotionDetail, reset]);

  const onFormSubmit = async (data: PromotionRequest) => {
    // Construct the products array from selectedProductIds and productConfigs
    const productsPayload = selectedProductIds.map((pid) => ({
      productId: pid,
      discountPercent: Number(productConfigs[pid]?.discountPercent ?? 10),
      maxQuantity: Number(productConfigs[pid]?.maxQuantity ?? 10),
    }));

    const finalPayload: PromotionRequest = {
      ...data,
      products: productsPayload,
    };

    console.log("PAYLOAD SUBMIT (Cập nhật):", finalPayload);

    try {
      await updatePromotion(finalPayload);
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

          <div className="md:col-span-6">
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
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.status?.message}
                />
              )}
            />
          </div>

        </div>
      </div>

      {/* Phía dưới: Danh sách Sản phẩm ACTIVE (Để áp dụng promotion) */}
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
            promotionId={Number(id)}
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

export default ShopPromotionUpdatePage;