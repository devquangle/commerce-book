import React from "react";
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
}

const ProductAttribute: React.FC<ProductAttributeProps> = ({
  control,
  errors,
  genreOptions = [],
  authorOptions = [],
  publisherOptions = [],
  seriesOptions = [],
}) => {
  return (
    <div className="col-span-12 lg:col-span-5 space-y-6 lg:h-full">
      <div className="card-custom space-y-5 lg:h-full">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <SlidersHorizontal size={18} className="text-indigo-600 dark:text-indigo-400" />
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
                  (Array.isArray(val) && val.length > 0) || "Vui lòng chọn ít nhất 1 thể loại",
              }}
              render={({ field }) => (
                <SearchableMultiSelect
                  label="Thể loại"
                  required
                  placeholder="Chọn thể loại..."
                  options={genreOptions}
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
              placeholder="Chọn thể loại..."
              options={genreOptions}
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
                  (Array.isArray(val) && val.length > 0) || "Vui lòng chọn ít nhất 1 tác giả",
              }}
              render={({ field }) => (
                <SearchableMultiSelect
                  label="Tác giả"
                  required
                  placeholder="Chọn tác giả..."
                  options={authorOptions}
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
              placeholder="Chọn tác giả..."
              options={authorOptions}
              maxSelection={4}
            />
          )}

          {/* Nhà xuất bản (Bắt buộc) */}
          {control ? (
            <Controller
              name="publisherId"
              control={control}
              rules={{
                required: "Vui lòng chọn nhà xuất bản",
              }}
              render={({ field }) => (
                <SearchableSelect
                  label="Nhà xuất bản"
                  required
                  placeholder="Chọn nhà xuất bản..."
                  options={publisherOptions}
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
              placeholder="Chọn nhà xuất bản..."
              options={publisherOptions}
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
                  placeholder="Chọn bộ sách..."
                  options={seriesOptions}
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
              placeholder="Chọn bộ sách..."
              options={seriesOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAttribute;
