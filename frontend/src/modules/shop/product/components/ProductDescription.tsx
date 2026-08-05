import React from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ProductRequest } from "../types/shop-product.type";
import { FileText } from "lucide-react";
import ProductDescriptionEditor from "./ProductDescriptionEditor";

export interface ProductDescriptionProps {
  control?: Control<ProductRequest>;
  value?: string;
  onChange?: (val: string) => void;
  bookName?: string;
  authorNames?: string;
  disabled?: boolean;
}

const ProductDescription = ({
  control,
  value = "",
  onChange = () => {},
  bookName,
  authorNames,
  disabled = false,
}: ProductDescriptionProps) => {
  return (
    <div className="col-span-12 card-custom space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800">
        <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Mô tả chi tiết
        </h2>
      </div>

      {control ? (
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <ProductDescriptionEditor
              value={field.value || ""}
              onChange={field.onChange}
              bookName={bookName}
              authorNames={authorNames}
              disabled={disabled}
            />
          )}
        />
      ) : (
        <ProductDescriptionEditor
          value={value}
          onChange={onChange}
          bookName={bookName}
          authorNames={authorNames}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default ProductDescription;
