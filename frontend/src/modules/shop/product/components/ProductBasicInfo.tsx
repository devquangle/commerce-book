import { Controller } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import type { ProductRequest } from "../types/shop-product.type";
import { BookOpen, AlertTriangle } from "lucide-react";
import { InputField } from "@/components/common/InputField";
import { SelectBox } from "@/components/common/SelectBox";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { useMemo } from "react";
import { registerLocale, getNames } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";

registerLocale(viLocale);

export interface ProductBasicInfoProps {
  register?: UseFormRegister<ProductRequest>;
  control?: Control<ProductRequest>;
  errors?: FieldErrors<ProductRequest>;
  watch?: UseFormWatch<ProductRequest>;
}

const STATUS_OPTIONS = [
  { label: "Hoạt động", value: "ACTIVE" },
  { label: "Không hoạt động", value: "INACTIVE" },
];

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  register,
  control,
  errors,
  watch,
}) => {
  const watchedPrice = watch ? watch("price") : 0;
  const watchedOriginalPrice = watch ? watch("originalPrice") : 0;

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
      <div className="card-custom space-y-5 lg:h-full">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <BookOpen
            size={18}
            className="text-indigo-600 dark:text-indigo-400"
          />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Thông tin sách cơ bản
          </h2>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <InputField
              label="Tên sách"
              required
              type="text"
              placeholder="Nhập tên sách..."
              {...(register
                ? register("name", { required: "Tên sách là bắt buộc." })
                : {})}
              error={errors?.name?.message}
            />
          </div>

          <InputField
            label="Giá nhập (đ)"
            required
            type="number"
            placeholder="0"
            {...(register
              ? register("originalPrice", {
                  required: "Giá nhập là bắt buộc",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Giá nhập phải lớn hơn hoặc bằng 0",
                  },
                })
              : {})}
            error={errors?.originalPrice?.message}
          />

          <InputField
            label="Giá bán (đ)"
            required
            type="number"
            placeholder="0"
            {...(register
              ? register("price", {
                  required: "Giá bán là bắt buộc",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Giá bán phải lớn hơn hoặc bằng 0",
                  },
                })
              : {})}
            error={errors?.price?.message}
          />

          <InputField
            label="Số lượng"
            type="number"
            placeholder="0"
            {...(register
              ? register("quantity", {
                  required: "Số lượng là bắt buộc",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Số lượng phải lớn hơn hoặc bằng 0",
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
            type="number"
            placeholder="0"
            {...(register
              ? register("pages", {
                  required: "Số trang là bắt buộc",
                  valueAsNumber: true,
                })
              : {})}
            error={errors?.pages?.message}
          />

          <InputField
            label="Trọng lượng (g)"
            required
            type="number"
            placeholder="0"
            {...(register
              ? register("weight", {
                  required: "Trọng lượng là bắt buộc",
                  valueAsNumber: true,
                })
              : {})}
            error={errors?.weight?.message}
          />

          <InputField
            label="Ngày xuất bản"
            required
            type="date"
            {...(register
              ? register("publishYear", {
                  required: "Ngày xuất bản là bắt buộc",
                })
              : {})}
            error={errors?.publishYear?.message}
          />

          <InputField
            label="Mã ISBN"
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
                required: "Vui lòng chọn ngôn ngữ",
              }}
              render={({ field }) => (
                <SearchableSelect
                  label="Ngôn ngữ"
                  required
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
              placeholder="Chọn ngôn ngữ..."
              options={languageOptions}
              value="vi"
            />
          )}

          {control ? (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SelectBox
                  label="Trạng thái"
                  required
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
              options={STATUS_OPTIONS}
              value="ACTIVE"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfo;
