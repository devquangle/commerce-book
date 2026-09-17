import React, { useState } from "react";
import { X, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ProfileAvatarProps {
  avatar: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePasswordClick: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatar,
  onAvatarChange,
  onChangePasswordClick,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center lg:w-1/3 space-y-4">
        <div className="relative group w-48 h-48">
          <img
            src={avatar}
            alt="avatar"
            className="w-full h-full rounded-3xl border border-zinc-200 dark:border-zinc-700 object-cover shadow-sm"
          />

          <div className="absolute inset-0 rounded-3xl bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
            {/* VIEW */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="p-3 bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 shadow-md rounded-full transition-transform hover:scale-110 cursor-pointer"
              title="Xem phóng to ảnh"
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* EDIT */}
            <label
              className="p-3 bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 shadow-md rounded-full transition-transform hover:scale-110 cursor-pointer"
              title="Thay đổi ảnh"
            >
              <Edit3 className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
              />
            </label>
          </div>
        </div>

        {/* fallback text */}
        <label className="cursor-pointer text-blue-500 hover:underline text-sm font-medium">
          Thay đổi ảnh
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />
        </label>

        <Button
          type="button"
          variant="secondary"
          onClick={onChangePasswordClick}
          className="w-full lg:w-auto"
        >
          Đổi mật khẩu
        </Button>
      </div>

      {/* Image Zoom / Lightbox Modal */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-4">
              Ảnh
            </h3>

            <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-900/5 dark:bg-zinc-950/40">
              <img
                src={avatar}
                alt="Avatar Phóng To"
                className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileAvatar;
