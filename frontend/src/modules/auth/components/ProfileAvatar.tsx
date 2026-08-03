import React from "react";
import { Button } from "@/components/common/Button";

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
  return (
    <div className="flex flex-col items-center lg:w-1/3 space-y-4">
      <div className="relative group w-32 h-32">
        <img
          src={avatar}
          alt="avatar"
          className="w-full h-full rounded-2xl border object-cover transition-transform duration-200 group-hover:scale-105"
        />

        <div className="absolute inset-0 rounded-2xl flex items-center justify-center gap-3">
          {/* VIEW */}
          <button
            type="button"
            onClick={() => window.open(avatar, "_blank")}
            className="p-2 bg-white shadow-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            title="Xem ảnh"
          >
            👁
          </button>

          {/* EDIT */}
          <label className="p-2 bg-white shadow-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer">
            ✏️
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
  );
};

export default ProfileAvatar;
