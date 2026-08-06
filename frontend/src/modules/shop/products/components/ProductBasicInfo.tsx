import { Controller } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import type { ProductRequest } from "../types/product.type";
import type { GoogleBookResponse } from "../types/googlebook";
import { useMemo, useState } from "react";
import { registerLocale, getNames } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";
import { useGoogleBookQuery } from "../hooks/useGoogleBook";
import { useGetBookMeta } from "../hooks/useGemini";
import { useGetUrlImages } from "../hooks/useSearchApi";
import { useDebounce } from "@/hooks/useDebounce";
import { showSuccessToast, showWarningToast } from "@/libs/utils/toastUtil";
import { INITIAL_FORM } from "../types/product-data.type";
import { InputField } from "@/components/common/InputField";
import { AlertTriangle, BookOpen, Sparkles } from "lucide-react";
import Spinner from "@/components/common/Spinner";
import { SearchInput } from "@/components/common/SearchInput";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { SelectBox } from "@/components/common/SelectBox";
import type { ProductImageRequest } from "@/services/cloudinary/type/cloudinary.type";

registerLocale(viLocale);

export interface ProductBasicInfoProps {
  register?: UseFormRegister<ProductRequest>;
  control?: Control<ProductRequest>;
  errors?: FieldErrors<ProductRequest>;
  watch?: UseFormWatch<ProductRequest>;
  setValue?: UseFormSetValue<ProductRequest>;
  getValues?: UseFormGetValues<ProductRequest>;
  bookOptions?: GoogleBookResponse[];
  displayKey?: string;
  isLoadingBookSearch?: boolean;
  onSelectBook?: (item: GoogleBookResponse) => void;
  showStatus?: boolean;
  disabled?: boolean;
}

const STATUS_OPTIONS = [
  { label: "Đang bán", value: "ACTIVE" },
  { label: "Tạm ngưng", value: "INACTIVE" },
];

const MAX_IMAGES = 6;

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  register,
  control,
  errors,
  watch,
  setValue,
  getValues,
  bookOptions,
  displayKey = "name",
  isLoadingBookSearch,
  onSelectBook,
  showStatus = false,
  disabled = false,
}) => {
  const watchedPrice = watch ? watch("price") : 0;
  const watchedOriginalPrice = watch ? watch("originalPrice") : 0;
  const watchedName = watch ? watch("name") : "";
  const watchedStatus = watch ? watch("status") : undefined;
  const isRejected = watchedStatus === "REJECTED";

  // Debounced search query for Google Books
  const debouncedName = useDebounce(watchedName || "", 1000);

  // Google Books search hook
  const { data: googleBooks = [], isLoading: isGoogleBooksLoading } =
    useGoogleBookQuery(debouncedName);

  // Gemini and Search API hooks
  const getBookMetaMutation = useGetBookMeta();
  const getUrlImagesMutation = useGetUrlImages();

  const [isFetchingAI, setIsFetchingAI] = useState(false);

  const dataOptionsToUse = bookOptions ?? googleBooks;
  const isLoadingToUse = isLoadingBookSearch ?? isGoogleBooksLoading;

  const handleSelectBookInternal = async (selectedItem: GoogleBookResponse) => {
    onSelectBook?.(selectedItem);

    if (!setValue || !getValues) return;

    // 1. Fill basic fields from Google Books
    setValue("name", selectedItem.name, { shouldDirty: true, shouldValidate: true });
    if (selectedItem.isbn)
      setValue("isbn", selectedItem.isbn, { shouldDirty: true });
    if (selectedItem.pageCount)
      setValue("pages", selectedItem.pageCount, { shouldDirty: true });
    if (selectedItem.language)
      setValue("language", selectedItem.language, { shouldDirty: true });

    // 2. Format publishYear
    let dateValue = INITIAL_FORM.publishYear;
    if (selectedItem.publishedDate) {
      dateValue = selectedItem.publishedDate;
      if (/^\d{4}$/.test(dateValue)) dateValue = `${dateValue}-01-01`;
      else if (/^\d{4}-\d{2}$/.test(dateValue)) dateValue = `${dateValue}-01`;
    }
    setValue("publishYear", dateValue, { shouldDirty: true });

    if (selectedItem.retailPrice || selectedItem.listPrice) {
      const price = selectedItem.retailPrice || selectedItem.listPrice || 0;
      setValue("price", price, { shouldDirty: true });
      setValue("originalPrice", selectedItem.listPrice || price, {
        shouldDirty: true,
      });
    }

    // 3. Update description with Google Books description
    let updatedDesc = getValues("description") || INITIAL_FORM.description;
    const bookDescription =
      selectedItem.description ||
      `Cuốn sách "${selectedItem.name}" của ${selectedItem.authors?.join(", ") || "tác giả"}.`;
    updatedDesc = updatedDesc.replace(
      /<p>\s*Tóm tắt cốt truyện hoặc chủ đề cuốn sách[\s\S]*?<\/p>/,
      `<p>${bookDescription}</p>`,
    );
    setValue("description", updatedDesc, { shouldDirty: true });

    // 4. Set thumbnail image from Google Books if available
    if (selectedItem.thumbnail && selectedItem.thumbnail.trim().length > 0) {
      const thumbnailImage: ProductImageRequest = {
        url: selectedItem.thumbnail,
        isThumbnail: true,
      };
      setValue("coverImages", [thumbnailImage], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    // 5. Call Gemini AI + SearchAPI concurrently using Promise.allSettled
    setIsFetchingAI(true);
    try {
      const [geminiResult, searchResult] = await Promise.allSettled([
        getBookMetaMutation.mutateAsync({
          name: selectedItem.name,
          authors: selectedItem.authors || [],
        }),
        getUrlImagesMutation.mutateAsync({ name: selectedItem.name }),
      ]);

      // Handle Gemini AI result — update description
      if (geminiResult.status === "fulfilled") {
        const metadata = geminiResult.value;
        let newDesc = getValues("description") || "";

        if (metadata.mainSummary) {
          newDesc = newDesc.replace(
            /(<h2[^>]*>\s*Nội dung chính\s*<\/h2>\s*)<p>[\s\S]*?<\/p>/,
            `$1<p>${metadata.mainSummary}</p>`,
          );
        }
        if (metadata.highlights?.length) {
          const highlightsHtml = `<ul>\n${metadata.highlights.map((h) => `      <li>${h}</li>`).join("\n")}\n    </ul>`;
          newDesc = newDesc.replace(
            /<ul>\s*<li>Nội dung sách hấp dẫn[\s\S]*?<\/ul>/,
            highlightsHtml,
          );
        }
        if (metadata.artisticValue?.length) {
          const artisticHtml = `<ul>\n${metadata.artisticValue.map((v) => `      <li>${v}</li>`).join("\n")}\n    </ul>`;
          newDesc = newDesc.replace(
            /<ul>\s*<li>Phong cách viết độc đáo[\s\S]*?<\/ul>/,
            artisticHtml,
          );
        }
        if (metadata.targetAudience?.length) {
          const audienceHtml = `<ul>\n${metadata.targetAudience.map((a) => `      <li>${a}</li>`).join("\n")}\n    </ul>`;
          newDesc = newDesc.replace(
            /<ul>\s*<li>Các bạn học sinh, sinh viên[\s\S]*?<\/ul>/,
            audienceHtml,
          );
        }
        if (metadata.authorsBookMetas?.length) {
          const authorDescriptions = metadata.authorsBookMetas
            .map((a) => `<strong>${a.name}:</strong> ${a.bio}`)
            .join("<br/>\n");
          const authorRegex =
            /(<h2[^>]*>\s*Về tác giả\s*<\/h2>\s*)<p>[\s\S]*?<\/p>/i;
          if (authorRegex.test(newDesc)) {
            newDesc = newDesc.replace(
              authorRegex,
              `$1<p>\n${authorDescriptions}\n</p>`,
            );
          }
        }

        setValue("description", newDesc, {
          shouldDirty: true,
        });
        showSuccessToast("Đã tự động tạo mô tả bằng AI thành công!");
      } else {
        console.error("Gemini error:", geminiResult.reason);
        showWarningToast("Không thể tạo mô tả bằng AI. Đang dùng mô tả gốc.");
      }

      // Handle SearchAPI result — update additional images safely
      if (searchResult.status === "fulfilled") {
        const rawData = searchResult.value as
          | string[]
          | { urlImage?: string[]; urlImages?: string[]; data?: string[] }
          | undefined;
        const allSearchUrls: string[] = Array.isArray(rawData)
          ? rawData
          : rawData?.urlImage || rawData?.urlImages || rawData?.data || [];

        const validUrls = allSearchUrls.filter(
          (url) => typeof url === "string" && url.trim().length > 0,
        );

        const currentImages: ProductImageRequest[] = (
          getValues("coverImages") || []
        ).filter((img) => img.url && img.url.trim().length > 0);

        const existingUrls = new Set(currentImages.map((img) => img.url));

        const searchImages: ProductImageRequest[] = validUrls
          .filter((url) => !existingUrls.has(url))
          .slice(0, 5)
          .map((imgUrl) => ({
            url: imgUrl,
            isThumbnail: false,
          }));

        const combined = [...currentImages, ...searchImages].slice(
          0,
          MAX_IMAGES,
        );

        if (combined.length > 0 && !combined.some((img) => img.isThumbnail)) {
          combined[0].isThumbnail = true;
        }

        if (combined.length > 0) {
          setValue("coverImages", combined, {
            shouldDirty: true,
            shouldValidate: true,
          });

          showSuccessToast(
            `Đã tải ${searchImages.length} ảnh bổ sung từ SearchAPI!`,
          );
        }
      } else {
        console.error("SearchAPI error:", searchResult.reason);
        showWarningToast("Không thể tải ảnh bổ sung từ SearchAPI.");
      }
    } finally {
      setIsFetchingAI(false);
    }
  };

  const languageOptions = useMemo(() => {
    const names = getNames("vi");
    return Object.entries(names)
      .map(([code, name]) => ({
        label: name.charAt(0).toUpperCase() + name.slice(1),
        value: code,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "vi"));
  }, []);

  const isPriceWarning =
    typeof watchedPrice === "number" &&
    typeof watchedOriginalPrice === "number" &&
    watchedPrice > 0 &&
    watchedOriginalPrice > 0 &&
    watchedPrice < watchedOriginalPrice;

  return (
    <div className="col-span-12 lg:col-span-7 space-y-6 lg:h-full">
      {isFetchingAI && (
        <Spinner
          message="Đang tự động đồng bộ dữ liệu..."
          subMessage="Vui lòng chờ Gemini AI tạo mô tả và SearchAPI tải ảnh bìa..."
        />
      )}

      <div className="card-custom space-y-5 lg:h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <BookOpen
              size={18}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Thông tin sách cơ bản
            </h2>
          </div>
          {isFetchingAI && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 animate-pulse">
              <Sparkles size={13} className="text-indigo-500 animate-spin" />
              <span>Đang tự động đồng bộ Gemini AI & Ảnh...</span>
            </div>
          )}
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            {register ? (
              <SearchInput<ProductRequest, GoogleBookResponse>
                label="Tên sách"
                required
                disabled={disabled}
                name="name"
                placeholder="Nhập tên sách..."
                register={register}
                rules={{ required: "Tên sách là bắt buộc." }}
                error={errors?.name}
                value={watch ? watch("name") : null}
                dataOptions={dataOptionsToUse}
                displayKey={displayKey as keyof GoogleBookResponse}
                isLoading={isLoadingToUse}
                onSelect={handleSelectBookInternal}
                renderItem={(book: GoogleBookResponse) => (
                  <div className="flex items-center gap-3 py-1">
                    {book.thumbnail && (
                      <img
                        src={book.thumbnail}
                        alt={book.name}
                        className="w-9 h-12 object-cover rounded shadow-xs shrink-0"
                      />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {book.name}
                      </span>
                      {book.authors && book.authors.length > 0 && (
                        <span className="text-xs text-slate-500 truncate">
                          Tác giả: {book.authors.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              />
            ) : (
              <InputField
                label="Tên sách"
                required
                type="text"
                placeholder="Nhập tên sách..."
                error={errors?.name?.message}
              />
            )}
          </div>

          <InputField
            label="Giá nhập (đ)"
            required
            disabled={disabled}
            type="number"
            placeholder="0"
            {...(register
              ? register("originalPrice", {
                  required: "Giá nhập là bắt buộc.",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Giá nhập phải lớn hơn hoặc bằng 0.",
                  },
                })
              : {})}
            error={errors?.originalPrice?.message}
          />

          <InputField
            label="Giá bán (đ)"
            required
            disabled={disabled}
            type="number"
            placeholder="0"
            {...(register
              ? register("price", {
                  required: "Giá bán là bắt buộc.",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Giá bán phải lớn hơn hoặc bằng 0.",
                  },
                })
              : {})}
            error={errors?.price?.message}
          />

          <InputField
            label="Số lượng"
            disabled={disabled}
            type="number"
            placeholder="0"
            {...(register
              ? register("quantity", {
                  required: "Số lượng là bắt buộc.",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Số lượng phải lớn hơn hoặc bằng 0.",
                  },
                })
              : {})}
            error={errors?.quantity?.message}
          />

          {/* Warning Banner when Selling Price < Original Price */}
          {isPriceWarning && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Giá bán đang thấp hơn giá nhập, bạn có chắc chắn muốn tiếp tục?
              </span>
            </div>
          )}

          <InputField
            label="Số trang"
            required
            disabled={disabled}
            type="number"
            placeholder="0"
            {...(register
              ? register("pages", {
                  required: "Số trang là bắt buộc.",
                  valueAsNumber: true,
                })
              : {})}
            error={errors?.pages?.message}
          />

          <InputField
            label="Trọng lượng (g)"
            required
            disabled={disabled}
            type="number"
            placeholder="0"
            {...(register
              ? register("weight", {
                  required: "Trọng lượng là bắt buộc.",
                  valueAsNumber: true,
                })
              : {})}
            error={errors?.weight?.message}
          />

          <InputField
            label="Ngày xuất bản"
            required
            disabled={disabled}
            type="date"
            {...(register
              ? register("publishYear", {
                  required: "Ngày xuất bản là bắt buộc.",
                })
              : {})}
            error={errors?.publishYear?.message}
          />

          <InputField
            label="Mã ISBN"
            disabled={disabled}
            type="text"
            placeholder="978-..."
            {...(register ? register("isbn") : {})}
            error={errors?.isbn?.message}
          />

          {control ? (
            <Controller
              name="language"
              control={control}
              rules={{
                required: "Vui lòng chọn ngôn ngữ.",
              }}
              render={({ field }) => (
                <SearchableSelect
                  label="Ngôn ngữ"
                  required
                  disabled={disabled}
                  placeholder="Chọn ngôn ngữ..."
                  options={languageOptions}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors?.language?.message}
                />
              )}
            />
          ) : (
            <SearchableSelect
              label="Ngôn ngữ"
              required
              disabled={disabled}
              placeholder="Chọn ngôn ngữ..."
              options={languageOptions}
              value="vi"
            />
          )}

          {showStatus &&
            !isRejected &&
            (control ? (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <SelectBox
                    label="Trạng thái"
                    required
                    disabled={disabled}
                    textClassName="body-text"
                    options={STATUS_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors?.status?.message}
                  />
                )}
              />
            ) : (
              <SelectBox
                label="Trạng thái"
                disabled={disabled}
                options={STATUS_OPTIONS}
                value="PENDING_APPROVAL"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfo;
