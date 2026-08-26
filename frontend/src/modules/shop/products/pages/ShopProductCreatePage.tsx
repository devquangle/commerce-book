import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { ProductHeader } from "../components/ProductHeader";
import { ProductBasicInfo } from "../components/ProductBasicInfo";
import ProductAttribute from "../components/ProductAttribute";
import MultipleImageUpload from "@/components/common/MultipleImageUpload";
import { ensureThumbnail } from "@/components/common/multiple-image-upload.utils";
import ProductDescription from "../components/ProductDescription";
import { INITIAL_FORM } from "../types/product-data.type";
import type { ProductRequest } from "../types/product.type";
import { useBookFormData } from "../hooks/useBookFormData";
import type { ProductImageResponse } from "@/services/cloudinary/type/cloudinary.type";
import { useUploadImages } from "@/services/cloudinary/hooks/useCloudinary";
import { useCreateProductShop } from "../hooks/useProduct";
import Spinner from "@/components/ui/Spinner";
import { mapServerErrors } from "@/libs/utils/mapServerErrors";

const ShopProductCreatePage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProductShop();
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
      await createProduct(payloadData);

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

  if (isUploading || isCreating) {
    return (
      <Spinner
        message="Đang xử lý tải hình ảnh và tạo sản phẩm..."
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
        mode="add"
        onSubmit={handleSubmit(onFormSubmit, onFormError)}
        onBack={handleBack}
        onReset={() => reset()}
      />
      <ProductBasicInfo
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        getValues={getValues}
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

export default ShopProductCreatePage;
