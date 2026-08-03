import React, { useState, useRef } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ProductRequest } from "@/modules/shop/product/types/shop-product.type";
import { ImageIcon, Upload, Plus, Eye, Pencil, Trash2, X } from "lucide-react";
import { showErrorToast } from "@/libs/utils/toastUtil";

export interface MultipleImageUploadProps {
  label?: string;
  maxFileSizeMB?: number;
  maxImages?: number;
  required?: boolean;
  initialImages?: { url: string; isThumbnail?: boolean }[];
  onChange?: (images: { url: string; isThumbnail?: boolean }[]) => void;
  control?: Control<ProductRequest>;
  error?: string;
}

const DEFAULT_SAMPLE_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
    isThumbnail: true,
  },
  {
    url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80",
    isThumbnail: false,
  },
];

const MultipleImageUploadContent: React.FC<
  MultipleImageUploadProps & {
    value?: { url: string; isThumbnail?: boolean }[];
    onValueChange?: (images: { url: string; isThumbnail?: boolean }[]) => void;
  }
> = ({
  label = "Hình ảnh sản phẩm",
  maxFileSizeMB = 5,
  maxImages = 6,
  required = true,
  initialImages,
  onChange,
  value,
  onValueChange,
  error,
}) => {
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");
  const [localImages, setLocalImages] = useState(initialImages || DEFAULT_SAMPLE_IMAGES);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const images = value !== undefined ? (value as any) : localImages;

  const notifyChange = (updated: { url: string; isThumbnail?: boolean }[]) => {
    setLocalImages(updated);
    onChange?.(updated);
    onValueChange?.(updated);
  };

  const handleSelectThumbnail = (index: number) => {
    const updated = images.map((img: any, idx: number) => ({
      ...img,
      isThumbnail: idx === index,
    }));
    notifyChange(updated);
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      showErrorToast("Phải giữ lại ít nhất 1 hình ảnh sản phẩm!");
      return;
    }
    const updated = images.filter((_: any, idx: number) => idx !== index);
    if (images[index]?.isThumbnail && updated.length > 0) {
      updated[0].isThumbnail = true;
    }
    notifyChange(updated);
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    if (images.length >= maxImages) {
      showErrorToast(`Chỉ được tải lên tối đa ${maxImages} hình ảnh!`);
      return;
    }
    const newImg = {
      url: imageUrl.trim(),
      isThumbnail: images.length === 0,
    };
    const updated = [...images, newImg];
    setImageUrl("");
    notifyChange(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      showErrorToast(`Chỉ được tải lên tối đa ${maxImages} hình ảnh!`);
      return;
    }

    const newImgs = Array.from(files).map((file, idx) => ({
      url: URL.createObjectURL(file),
      isThumbnail: images.length === 0 && idx === 0,
    }));

    const updated = [...images, ...newImgs];
    notifyChange(updated);
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceIndex === null) return;

    const updated = [...images];
    updated[replaceIndex] = {
      ...updated[replaceIndex],
      url: URL.createObjectURL(file),
    };
    setReplaceIndex(null);
    notifyChange(updated);
  };

  return (
    <div className="col-span-12 card-custom space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <ImageIcon size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {label} {required && <span className="text-red-500">*</span>}
          </h2>
        </div>
        <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
          {images.length}/{maxImages} ảnh (Ít nhất 1, tối đa {maxImages})
        </span>
      </div>

      {/* Mode Tabs */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1">
        <button
          type="button"
          onClick={() => setImageUploadMode("file")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            imageUploadMode === "file"
              ? "bg-white dark:bg-zinc-900 shadow-sm text-indigo-600 dark:text-indigo-400"
              : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
          }`}
        >
          Tải tệp ảnh
        </button>
        <button
          type="button"
          onClick={() => setImageUploadMode("url")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            imageUploadMode === "url"
              ? "bg-white dark:bg-zinc-900 shadow-sm text-indigo-600 dark:text-indigo-400"
              : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
          }`}
        >
          Nhập URL
        </button>
      </div>

      {/* Mode Content */}
      {imageUploadMode === "file" ? (
        <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all">
          <Upload size={24} className="text-slate-400 dark:text-zinc-500 mb-2" />
          <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
            Chọn ảnh từ máy tính
          </span>
          <span className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            PNG, JPG, WEBP (tối đa {maxFileSizeMB}MB, tối đa {maxImages} ảnh)
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={images.length >= maxImages}
          />
        </label>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImageUrl();
              }
            }}
            placeholder="https://example.com/image.jpg"
            className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none focus:border-indigo-500 dark:text-white"
            disabled={images.length >= maxImages}
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            disabled={images.length >= maxImages}
            className="px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus size={16} /> Thêm
          </button>
        </div>
      )}

      {/* Grid danh sách ảnh */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {images.map((image: any, index: number) => (
            <div
              key={index}
              className={`group relative aspect-[3/4] rounded-none overflow-hidden border-2 bg-slate-100/80 dark:bg-zinc-900/80 transition-all ${
                image.isThumbnail
                  ? "border-indigo-500 ring-2 ring-indigo-500/20"
                  : "border-slate-200 dark:border-zinc-800"
              }`}
            >
              <img
                src={image.url || ""}
                alt={`Ảnh ${index + 1}`}
                className="w-full h-full object-contain p-1 rounded-none"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

              {/* Nút chọn ảnh đại diện */}
              <button
                type="button"
                onClick={() => handleSelectThumbnail(index)}
                className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm transition-all cursor-pointer ${
                  image.isThumbnail
                    ? "bg-indigo-600 text-white"
                    : "bg-white/90 dark:bg-zinc-900/90 text-slate-700 dark:text-zinc-200 hover:bg-indigo-50"
                }`}
              >
                {image.isThumbnail ? "Đại diện" : "Chọn"}
              </button>

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="Xem ảnh"
                  onClick={() => setPreviewImage(image.url)}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
                >
                  <Eye size={12} />
                </button>
                <button
                  type="button"
                  title="Thay thế ảnh"
                  onClick={() => {
                    setReplaceIndex(index);
                    replaceFileInputRef.current?.click();
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Pencil size={12} />
                </button>
                {!image.isThumbnail && (
                  <button
                    type="button"
                    title="Xóa ảnh"
                    onClick={() => handleRemoveImage(index)}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                {index + 1}/{maxImages}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

      {/* Input thay thế ẩn */}
      <input
        type="file"
        ref={replaceFileInputRef}
        hidden
        accept="image/*"
        onChange={handleReplaceFileChange}
      />

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-2xl overflow-hidden flex flex-col items-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              onClick={() => setPreviewImage(null)}
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-3">
              Xem ảnh sản phẩm
            </h3>

            <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-900/5 dark:bg-zinc-950/40">
              <img
                src={previewImage}
                alt="Xem phóng to"
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = (props) => {
  if (props.control) {
    return (
      <Controller
        name="coverImages"
        control={props.control}
        rules={{
          validate: (val) => {
            const list = Array.isArray(val) ? val : [];
            if (list.length < 1) return "Vui lòng tải lên ít nhất 1 hình ảnh sản phẩm";
            if (list.length > 6) return "Chỉ được tải lên tối đa 6 hình ảnh sản phẩm";
            return true;
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <MultipleImageUploadContent
            {...props}
            value={field.value as any}
            onValueChange={field.onChange}
            error={error?.message}
          />
        )}
      />
    );
  }

  return <MultipleImageUploadContent {...props} />;
};

export default MultipleImageUpload;