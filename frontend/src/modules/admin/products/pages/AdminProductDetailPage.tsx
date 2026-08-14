import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { ProductHeader } from "../components/ProductHeader";
import { ProductBasicInfo } from "@/modules/shop/products/components/ProductBasicInfo";
import ProductAttribute from "@/modules/shop/products/components/ProductAttribute";
import MultipleImageUpload from "@/components/common/MultipleImageUpload";
import { ensureThumbnail } from "@/components/common/multiple-image-upload.utils";
import ProductDescription from "@/modules/shop/products/components/ProductDescription";
import { INITIAL_FORM } from "@/modules/shop/products/types/product-data.type";
import type { ProductRequest } from "@/modules/shop/products/types/product.type";
import { useBookFormData } from "@/modules/shop/products/hooks/useBookFormData";
import { useProductDetailForAdmin } from "@/modules/shop/products/hooks/useProduct";
import Spinner from "@/components/common/Spinner";
import { ProductApproveModal } from "../components/ProductApproveModal";
import { ProductRejectModal } from "../components/ProductRejectModal";
import ProductReason from "@/modules/shop/products/components/ProductReason";

const AdminProductDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug") || "";

  const { data: productDetail, isLoading: isLoadingDetail } =
    useProductDetailForAdmin(slug);

  // Modal trạng thái Phê duyệt & Từ chối
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const {
    register,
    reset,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm<ProductRequest>({
    defaultValues: INITIAL_FORM,
    mode: "onChange",
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
  useMemo(() => ensureThumbnail(coverImagesRaw || []), [coverImagesRaw]);

  const handleBack = () => {
    navigate("/admin/products");
  };

  const handleApproveSuccess = () => {
    setIsApproveModalOpen(false);
    handleBack();
  };

  const handleRejectSuccess = () => {
    setIsRejectModalOpen(false);
    handleBack();
  };

  if (isLoadingDetail) {
    return (
      <Spinner
        message="Đang tải thông tin sản phẩm..."
        subMessage="Vui lòng chờ trong giây lát..."
      />
    );
  }

  const isPendingApproval = productDetail?.status === "PENDING_APPROVAL";

  return (
    <div className="grid grid-cols-12 gap-6 w-full min-h-full pb-6">
      {/* Header với 2 nút Phê duyệt / Từ chối nếu ở trạng thái Chờ duyệt */}
      <ProductHeader
        mode="detail"
        showApproveReject={isPendingApproval}
        onBack={handleBack}
        onApprove={() => setIsApproveModalOpen(true)}
        onReject={() => setIsRejectModalOpen(true)}
      />
      <ProductReason
        mode="admin"
        status={productDetail?.status}
        showSubTitLe={true}
        reason={productDetail?.reason}
      />
      {/* Thông tin cơ bản - Readonly (disabled=true) */}
      <ProductBasicInfo
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        getValues={getValues}
        showStatus={true}
        disabled={true}
      />

      {/* Thuộc tính sách - Readonly (disabled=true) */}
      <ProductAttribute
        control={control}
        errors={errors}
        genreOptions={genresDataOption}
        authorOptions={authorsDataOption}
        publisherOptions={publishersDataOption}
        seriesOptions={seriesDataOption}
        disabled={true}
      />

      {/* Hình ảnh sản phẩm - Readonly (disabled=true) */}
      <MultipleImageUpload control={control} disabled={true} />

      {/* Mô tả chi tiết sản phẩm - Readonly (disabled=true, showTools=false) */}
      <ProductDescription
        control={control}
        bookName={bookName}
        disabled={true}
        showTools={false}
      />

      {/* Modal Phê duyệt */}
      <ProductApproveModal
        isOpen={isApproveModalOpen}
        item={productDetail || null}
        onClose={() => setIsApproveModalOpen(false)}
        onSuccess={handleApproveSuccess}
      />

      {/* Modal Từ chối */}
      <ProductRejectModal
        isOpen={isRejectModalOpen}
        item={productDetail || null}
        onClose={() => setIsRejectModalOpen(false)}
        onSuccess={handleRejectSuccess}
      />
    </div>
  );
};

export default AdminProductDetailPage;
