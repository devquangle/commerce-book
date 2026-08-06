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
import { mapServerErrors } from "@/libs/utils/mapServerErrors";
import { AlertTriangle } from "lucide-react";

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

  const currentStatus: ProductStatus =
    watch("status") || productDetail?.status || "PENDING_APPROVAL";

  const isReadOnly =
    currentStatus === "DELETED" ||
    currentStatus === "DELETE" ||
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

      {isReadOnly && (
        <div className="col-span-12 flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 shadow-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-sm font-medium">
            Sản phẩm đang ở trạng thái{" "}
            <span className="font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
              {currentStatus === "DELETED" || currentStatus === "DELETE"
                ? "Đã xóa"
                : currentStatus === "PENDING_APPROVAL"
                  ? "Chờ duyệt"
                  : currentStatus === "REJECTED"
                    ? "Từ chối"
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
