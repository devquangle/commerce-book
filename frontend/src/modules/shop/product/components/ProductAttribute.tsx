import React, { useMemo } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ProductRequest } from "../types/shop-product.type";
import { SlidersHorizontal } from "lucide-react";

import SearchableMultiSelect from "@/components/common/SearchableMultiSelect";
import { SearchableSelect } from "@/components/common/SearchableSelect";

export interface ProductAttributeProps {
  control?: Control<ProductRequest>;
  errors?: FieldErrors<ProductRequest>;
  genreOptions?: { label: string; value: number }[];
  authorOptions?: { label: string; value: number }[];
  publisherOptions?: { label: string; value: number }[];
  seriesOptions?: { label: string; value: number }[];
  disabled?: boolean;
}

const OTHER_OPTION = { label: "Khác", value: -1 };

const ProductAttribute: React.FC<ProductAttributeProps> = ({
  control,
  errors,
  genreOptions = [],
  authorOptions = [],
  publisherOptions = [],
  seriesOptions = [],
  disabled = false,
}) => {
  const genresWithOther = useMemo(() => {
    if (
      genreOptions.some(
        (opt) => opt.value === -1 || opt.label.toLowerCase() === "khác",
      )
    ) {
      return genreOptions;
    }
    return [...genreOptions, OTHER_OPTION];
  }, [genreOptions]);

  const authorsWithOther = useMemo(() => {
    if (
      authorOptions.some(
        (opt) => opt.value === -1 || opt.label.toLowerCase() === "khác",
      )
    ) {
      return authorOptions;
    }
    return [...authorOptions, OTHER_OPTION];
  }, [authorOptions]);

  const publishersWithOther = useMemo(() => {
    if (
      publisherOptions.some(
        (opt) => opt.value === -1 || opt.label.toLowerCase() === "khác",
      )
    ) {
      return publisherOptions;
    }
    return [...publisherOptions, OTHER_OPTION];
  }, [publisherOptions]);

  const seriesWithOther = useMemo(() => {
    if (
      seriesOptions.some(
        (opt) => opt.value === -1 || opt.label.toLowerCase() === "khác",
      )
    ) {
      return seriesOptions;
    }
    return [...seriesOptions, OTHER_OPTION];
  }, [seriesOptions]);

  return (
    <div className="col-span-12 lg:col-span-5 space-y-6 lg:h-full">
      <div className="card-custom space-y-5 lg:h-full">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <SlidersHorizontal
            size={18}
            className="text-indigo-600 dark:text-indigo-400"
          />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Thuộc tính
          </h2>
        </div>

        {/* Select Fields Grid */}
        <div className="space-y-4">
          {/* Thể loại (Bắt buộc) */}
          {control ? (
            <Controller
              name="genreIds"
              control={control}
              rules={{
                validate: (val) =>
                  (Array.isArray(val) && val.length > 0) ||
                  "Vui lòng chọn ít nhất 1 thể loại.",
              }}
              render={({ field }) => (
                <SearchableMultiSelect
                  label="Thể loại"
                  required
                  disabled={disabled}
                  placeholder="Chọn thể loại..."
                  options={genresWithOther}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  maxSelection={4}
                  error={errors?.genreIds?.message}
                />
              )}
            />
          ) : (
            <SearchableMultiSelect
              label="Thể loại"
              required
              disabled={disabled}
              placeholder="Chọn thể loại..."
              options={genresWithOther}
              maxSelection={4}
            />
          )}

          {/* Tác giả (Bắt buộc) */}
          {control ? (
            <Controller
              name="authorIds"
              control={control}
              rules={{
                validate: (val) =>
                  (Array.isArray(val) && val.length > 0) ||
                  "Vui lòng chọn ít nhất 1 tác giả.",
              }}
              render={({ field }) => (
                <SearchableMultiSelect
                  label="Tác giả"
                  required
                  disabled={disabled}
                  placeholder="Chọn tác giả..."
                  options={authorsWithOther}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  maxSelection={4}
                  error={errors?.authorIds?.message}
                />
              )}
            />
          ) : (
            <SearchableMultiSelect
              label="Tác giả"
              required
              disabled={disabled}
              placeholder="Chọn tác giả..."
              options={authorsWithOther}
              maxSelection={4}
            />
          )}

          {/* Nhà xuất bản (Bắt buộc) */}
          {control ? (
            <Controller
              name="publisherId"
              control={control}
              rules={{
                required: "Vui lòng chọn nhà xuất bản.",
              }}
              render={({ field }) => (
                <SearchableSelect
                  label="Nhà xuất bản"
                  required
                  disabled={disabled}
                  placeholder="Chọn nhà xuất bản..."
                  options={publishersWithOther}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    field.onChange(val || null);
                  }}
                  error={errors?.publisherId?.message}
                />
              )}
            />
          ) : (
            <SearchableSelect
              label="Nhà xuất bản"
              required
              disabled={disabled}
              placeholder="Chọn nhà xuất bản..."
              options={publishersWithOther}
            />
          )}

          {/* Bộ sách (Tùy chọn) */}
          {control ? (
            <Controller
              name="seriesId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="Bộ sách"
                  disabled={disabled}
                  placeholder="Chọn bộ sách..."
                  options={seriesWithOther}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    field.onChange(val || null);
                  }}
                  error={errors?.seriesId?.message}
                />
              )}
            />
          ) : (
            <SearchableSelect
              label="Bộ sách"
              disabled={disabled}
              placeholder="Chọn bộ sách..."
              options={seriesWithOther}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAttribute;
