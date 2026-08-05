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
import type { ProductRequest } from "../types/shop-product.type";
import { useBookFormData } from "../hooks/useBookFormData";
import type { ProductImageResponse } from "@/services/cloudinary/type/cloudinary.type";
import { useUploadImages } from "@/services/cloudinary/hooks/useCloudinary";
import {
  useProductShopDetail,
  useUpdateProductShop,
} from "../hooks/useProductShop";
import Spinner from "@/components/common/Spinner";
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
      const uploadedImages: ProductImageResponse[] =
        coverImages.length > 0 ? await uploadImages(coverImages) : [];

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
        onSubmit={handleSubmit(onFormSubmit, onFormError)}
        onBack={handleBack}
        onReset={() => {
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
        }}
      />
      <ProductBasicInfo
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        getValues={getValues}
        showStatus={true}
      />
      <ProductAttribute
        control={control}
        errors={errors}
        genreOptions={genresDataOption}
        authorOptions={authorsDataOption}
        publisherOptions={publishersDataOption}
        seriesOptions={seriesDataOption}
      />
      <MultipleImageUpload control={control} />
      <ProductDescription control={control} bookName={bookName} />
    </form>
  );
};

export default ShopProductUpdatePage;
