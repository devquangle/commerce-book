import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { ProductHeader } from "../components/ProductHeader";
import { ProductBasicInfo } from "../components/ProductBasicInfo";
import ProductAttribute from "../components/ProductAttribute";
import MultipleImageUpload from "@/components/common/MultipleImageUpload";
import { ensureThumbnail } from "@/components/common/multiple-image-upload.utils";
import ProductDescription from "../components/ProductDescription";
import { INITIAL_FORM } from "../types/product-data.type";
import type { ProductRequest, ProductStatus } from "../types/product.type";
import { useBookFormData } from "../hooks/useBookFormData";
import type { ProductImageResponse } from "@/services/cloudinary/type/cloudinary.type";
import { useUploadImages } from "@/services/cloudinary/hooks/useCloudinary";
import {
  useProductShopDetail,
  useUpdateProductShop,
} from "../hooks/useProduct";
import Spinner from "@/components/common/Spinner";
import { AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { mapServerErrors } from "@/libs/utils/mapServerErrors";

const ShopProductUpdatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug") || "";

  const { data: productDetail, isLoading: isLoadingDetail } =
    useProductShopDetail(slug);
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProductShop(productDetail?.productId);
  const { mutateAsync: uploadImages, isPending: isUploading } =
    useUploadImages();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm<ProductRequest>({
    defaultValues: INITIAL_FORM,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (productDetail) {
      reset({
        name: productDetail.name || "",
        weight: productDetail.weight || 0,
        publishYear: productDetail.publishYear || "",
        pages: productDetail.pages || 0,
        language: productDetail.language || "vi",
        price: productDetail.price || 0,
        originalPrice: productDetail.originalPrice || 0,
        quantity: productDetail.quantity || 0,
        isbn: productDetail.isbn || "",
        authorIds: productDetail.authorIds || [],
        genreIds: productDetail.genreIds || [],
        publisherId: productDetail.publisherId || null,
        seriesId: productDetail.seriesId || null,
        coverImages: (productDetail.coverImages || []).map((img) => ({
          url: img.url,
          isThumbnail: img.isThumbnail === true,
        })),
        description: productDetail.description || "",
        status: productDetail.status || "PENDING_APPROVAL",
      });
    }
  }, [productDetail, reset]);

  const {
    genresDataOption,
    authorsDataOption,
    publishersDataOption,
    seriesDataOption,
  } = useBookFormData();

  const bookName = useWatch({ control, name: "name" });
  const coverImagesRaw = useWatch({ name: "coverImages", control });
  const coverImages = useMemo(
    () => ensureThumbnail(coverImagesRaw || []),
    [coverImagesRaw],
  );

  const onFormSubmit = async (data: ProductRequest) => {
    try {
      // Kiểm tra xem coverImages có file mới hoặc có sự thay đổi so với dữ liệu gốc hay không
      const hasNewFiles = coverImages.some(
        (img) =>
          Boolean(img.file) ||
          img.url?.startsWith("blob:") ||
          img.url?.startsWith("data:"),
      );

      const isImagesChanged =
        coverImages.length !== (productDetail?.coverImages?.length || 0) ||
        coverImages.some((img, idx) => {
          const original = productDetail?.coverImages?.[idx];
          return (
            !original ||
            original.url !== img.url ||
            Boolean(original.isThumbnail) !== Boolean(img.isThumbnail)
          );
        });

      const uploadedImages: ProductImageResponse[] =
        hasNewFiles || isImagesChanged
          ? coverImages.length > 0
            ? await uploadImages(coverImages)
            : []
          : coverImages.map(
              (img): ProductImageResponse => ({
                url: img.url || "",
                isThumbnail: Boolean(img.isThumbnail),
              }),
            );

      const payloadData: ProductRequest = {
        ...data,
        coverImages: uploadedImages,
      };
      await updateProduct(payloadData);

      handleBack();
    } catch (error: unknown) {
      mapServerErrors(error, setError);
    }
  };

  const onFormError = (formErrors: typeof errors) => {
    console.log("=== SUBMIT FORM VALIDATION ERRORS ===", formErrors);
  };

  const handleBack = () => {
    navigate("/shop/products");
  };

  const statusWatched = useWatch({ control, name: "status" });
  const currentStatus: ProductStatus =
    statusWatched || productDetail?.status || "PENDING_APPROVAL";

  const isReadOnly =
    currentStatus === "DELETED"  ||
    !["ACTIVE", "INACTIVE", "REJECTED"].includes(currentStatus);

  if (isLoadingDetail) {
    return (
      <Spinner
        message="Đang tải thông tin sản phẩm..."
        subMessage="Vui lòng chờ trong giây lát..."
      />
    );
  }

  if (isUploading || isUpdating) {
    return (
      <Spinner
        message="Đang xử lý tải hình ảnh và cập nhật sản phẩm..."
        subMessage="Vui lòng chờ trong giây lát..."
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit, onFormError)}
      className="grid grid-cols-12 gap-6 w-full min-h-full pb-6"
    >
      <ProductHeader
        mode="update"
        showSubmit={!isReadOnly}
        onSubmit={handleSubmit(onFormSubmit, onFormError)}
        onBack={handleBack}
        onReset={
          !isReadOnly
            ? () => {
                if (productDetail) {
                  reset({
                    name: productDetail.name || "",
                    weight: productDetail.weight || 0,
                    publishYear: productDetail.publishYear || "",
                    pages: productDetail.pages || 0,
                    language: productDetail.language || "vi",
                    price: productDetail.price || 0,
                    originalPrice: productDetail.originalPrice || 0,
                    quantity: productDetail.quantity || 0,
                    isbn: productDetail.isbn || "",
                    authorIds: productDetail.authorIds || [],
                    genreIds: productDetail.genreIds || [],
                    publisherId: productDetail.publisherId || null,
                    seriesId: productDetail.seriesId || null,
                    coverImages: (productDetail.coverImages || []).map((img) => ({
                      url: img.url,
                      isThumbnail: img.isThumbnail === true,
                    })),
                    description: productDetail.description || "",
                    status: productDetail.status || "PENDING_APPROVAL",
                  });
                } else {
                  reset();
                }
              }
            : undefined
        }
      />

      {/* Modern Premium Rejection Card */}
      {currentStatus === "REJECTED" && (
        <div className="col-span-12 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-950/40 dark:via-rose-900/10 dark:to-transparent border border-rose-200/80 dark:border-rose-800/60 p-5 shadow-xs flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20 mt-0.5">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Sản phẩm bị từ chối phê duyệt
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Vui lòng chỉnh sửa các thông tin chưa đạt yêu cầu dưới đây và nhấn nút <span className="font-semibold text-zinc-700 dark:text-zinc-300">"Cập nhật"</span> để gửi duyệt lại.
                </p>
              </div>
            </div>
          </div>

          {/* Reasons List */}
          <div className="space-y-2 pt-1 border-t border-rose-200/60 dark:border-rose-800/40">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block pt-1">
              Lý do từ chối từ Quản trị viên:
            </span>

            {productDetail?.reason ? (
              <div className="grid grid-cols-1 gap-2">
                {productDetail.reason
                  .split("\n")
                  .map((r) => r.trim())
                  .filter(Boolean)
                  .map((reasonLine, idx) => {
                    const cleanText = reasonLine.replace(/^•\s*/, "");
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-rose-100 dark:border-rose-900/40 text-sm text-zinc-800 dark:text-zinc-200 shadow-2xs transition-all hover:border-rose-300 dark:hover:border-rose-700"
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5 shadow-xs shadow-rose-500/50" />
                        <span className="leading-relaxed font-medium">{cleanText}</span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-xs text-rose-600 dark:text-rose-400 italic">
                Chưa có lý do chi tiết được cung cấp. Vui lòng kiểm tra lại thông tin sản phẩm.
              </p>
            )}
          </div>
        </div>
      )}

      {isReadOnly && (
        <div className="col-span-12 flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 shadow-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-sm font-medium">
            Sản phẩm đang ở trạng thái{" "}
            <span className="font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
              {currentStatus === "DELETED"
                ? "Đã xóa"
                : currentStatus === "PENDING_APPROVAL"
                  ? "Chờ duyệt"
                  : "Khóa (Banned)"}
            </span>
            . Bạn không thể chỉnh sửa thông tin hoặc thực hiện cập nhật sản phẩm.
          </div>
        </div>
      )}

      <ProductBasicInfo
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        getValues={getValues}
        showStatus={true}
        disabled={isReadOnly}
      />
      <ProductAttribute
        control={control}
        errors={errors}
        genreOptions={genresDataOption}
        authorOptions={authorsDataOption}
        publisherOptions={publishersDataOption}
        seriesOptions={seriesDataOption}
        disabled={isReadOnly}
      />
      <MultipleImageUpload control={control} disabled={isReadOnly} />
      <ProductDescription
        control={control}
        bookName={bookName}
        disabled={isReadOnly}
      />
    </form>
  );
};

export default ShopProductUpdatePage;
