import { useState } from "react";
import { Upload, Trash2, Edit, Eye, X } from "lucide-react";

type SingleImageUploadNoUrlProps = {
  file: File | null;
  setFile: (file: File | null) => void;
  currentImageUrl?: string | null;
  onClearImage?: () => void;
  label?: string;
};

export default function SingleImageUploadNoUrl({
  file,
  setFile,
  currentImageUrl,
  onClearImage,
  label = "Ảnh đại diện",
}: SingleImageUploadNoUrlProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Tính toán URL để hiển thị: ưu tiên file vừa chọn, nếu không có thì dùng ảnh hiện tại
  const currentDisplayImage = file
    ? URL.createObjectURL(file)
    : currentImageUrl;

  const handleClearImage = () => {
    setFile(null);
    if (onClearImage) {
      onClearImage();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>

      {/* Tải tệp lên (khi chưa có ảnh) */}
      {!currentDisplayImage && (
        <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 transition bg-slate-50/50">
          <Upload size={28} className="text-slate-400 mb-2" />
          <span className="text-sm text-slate-600">Chọn ảnh từ máy tính</span>
          <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
              }
              e.target.value = "";
            }}
          />
        </label>
      )}

      {/* VÙNG HIỂN THỊ PREVIEW KHI ĐÃ CÓ ẢNH */}
      {currentDisplayImage && (
        <div className="flex justify-center mt-2">
          <div className="relative group w-full h-40 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/30 shadow-sm">
            <img
              src={currentDisplayImage}
              alt="preview"
              className="w-full h-full object-contain"
            />
            {/* Lớp Overlay chứa 3 nút chức năng: Xem - Cập nhật - Xóa */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center gap-2.5">
              {/* Nút 1: Xem ảnh to */}
              <button
                type="button"
                title="Xem ảnh"
                onClick={() => setIsPreviewOpen(true)}
                className="bg-zinc-700/90 text-white p-2 rounded-xl hover:bg-zinc-800 transition shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <Eye size={16} />
              </button>

              {/* Nút 2: Đổi ảnh */}
              <button
                type="button"
                title="Đổi ảnh"
                onClick={() => {
                  document.getElementById("hidden-avatar-input-no-url")?.click();
                }}
                className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <Edit size={16} />
              </button>

              {/* Nút 3: Xóa ảnh */}
              <button
                type="button"
                title="Xóa ảnh"
                onClick={handleClearImage}
                className="bg-rose-500 text-white p-2 rounded-xl hover:bg-rose-600 transition shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <input
            id="hidden-avatar-input-no-url"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
              }
              e.target.value = "";
            }}
          />
        </div>
      )}

      {/* 👉 MODAL PHÓNG TO ẢNH (LIGHTBOX) */}
      {isPreviewOpen && currentDisplayImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* Nút đóng góc trên bên phải */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer transition"
            >
              <X size={18} />
            </button>
            
            {/* Hình ảnh phóng to chất lượng gốc */}
            <img
              src={currentDisplayImage}
              alt="Full preview"
              className="w-full h-full max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()} // Chặn tắt nhầm khi bấm vào thân ảnh
            />
          </div>
        </div>
      )}
    </div>
  );
}
