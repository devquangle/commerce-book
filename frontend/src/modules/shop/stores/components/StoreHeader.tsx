import { useState, useRef } from "react";
import { Camera, Store, ExternalLink, Save, Eye, Pencil, X } from "lucide-react";
import { Button } from "@/components/common/Button";

export const StoreHeader = () => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ title: string; url: string | null } | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerUrl(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="card-custom overflow-hidden p-0">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={bannerInputRef}
        onChange={handleBannerChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={logoInputRef}
        onChange={handleLogoChange}
        accept="image/*"
        className="hidden"
      />

      {/* Banner */}
      <div className="relative h-44 bg-linear-to-br from-indigo-500 via-violet-500 to-purple-600 group overflow-hidden">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt="Store Banner"
            className="w-full h-full object-cover"
          />
        ) : null}

        {/* Banner Action Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              setPreviewImage({
                title: "Ảnh bìa cửa hàng",
                url: bannerUrl,
              })
            }
            className="flex items-center gap-1.5 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow transition-transform hover:scale-105 cursor-pointer"
          >
            <Eye size={14} />
            Xem ảnh
          </button>
          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow transition-transform hover:scale-105 cursor-pointer"
          >
            <Pencil size={14} />
            Đổi ảnh bìa
          </button>
        </div>
      </div>

      {/* Avatar + Info row */}
      <div className="px-6 pb-5">
        <div className="flex items-end justify-between gap-4 -mt-10">
          {/* Logo avatar */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-lg overflow-hidden flex items-center justify-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Store Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store size={32} className="text-indigo-400" />
              )}
            </div>

            {/* Logo Hover Actions */}
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
              <button
                type="button"
                title="Xem logo"
                onClick={() =>
                  setPreviewImage({
                    title: "Logo cửa hàng",
                    url: logoUrl,
                  })
                }
                className="p-1.5 bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-900 rounded-lg shadow transition-transform hover:scale-110 cursor-pointer"
              >
                <Eye size={13} />
              </button>
              <button
                type="button"
                title="Đổi logo"
                onClick={() => logoInputRef.current?.click()}
                className="p-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow transition-transform hover:scale-110 cursor-pointer"
              >
                <Pencil size={13} />
              </button>
            </div>
          </div>

          {/* Name + slug */}
          <div className="flex-1 pt-11 min-w-0">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white truncate">
              Sách Tuổi Thơ
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              <ExternalLink size={11} />
              <span className="font-mono truncate">sach-tuoi-tho</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-11 shrink-0">
            <Button
              variant="primary"
              icon={<Save className="w-4 h-4" />}
              className="cursor-pointer"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>

      {/* Image Lightbox / Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                {previewImage.title}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="w-full max-h-[70vh] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              {previewImage.url ? (
                <img
                  src={previewImage.url}
                  alt={previewImage.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              ) : (
                <div className="py-16 text-center text-zinc-400 text-sm flex flex-col items-center gap-2">
                  <Camera size={36} className="text-zinc-300 dark:text-zinc-600" />
                  <span>Chưa có ảnh (sử dụng ảnh mặc định hệ thống)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};