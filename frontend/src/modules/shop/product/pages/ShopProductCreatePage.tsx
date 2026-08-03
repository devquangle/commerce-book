import ProductHeaderAdd from "../components/ProductHeaderAdd";
import { ProductBasicInfo } from "../components/ProductBasicInfo";
import ProductAttribute from "../components/ProductAttribute";
import MultipleImageUpload from "@/components/common/MultipleImageUpload";
import ProductDescription from "../components/ProductDescription";
import { INITIAL_FORM } from "../types/product-data.type";
import type { ProductRequest } from "../types/shop-product.type";
import { useForm, useWatch } from "react-hook-form";
import { useBookFormData } from "../hooks/useBookFormData";

const ShopProductCreatePage = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    trigger,
    watch,
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
    isLoading,
    isError,
  } = useBookFormData();

  const bookName = useWatch({ control, name: "name" });

  const onFormSubmit = (data: ProductRequest) => {
    console.log("=== SUBMIT PRODUCT FORM DATA ===", data);
  };

  const onFormError = (formErrors: typeof errors) => {
    console.log("=== SUBMIT FORM VALIDATION ERRORS ===", formErrors);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit, onFormError)}
      className="grid grid-cols-12 gap-6 w-full min-h-full pb-6"
    >
      <ProductHeaderAdd
        onSubmit={handleSubmit(onFormSubmit, onFormError)}
        onReset={() => reset()}
      />
      <ProductBasicInfo
        register={register}
        control={control}
        errors={errors}
        watch={watch}
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
