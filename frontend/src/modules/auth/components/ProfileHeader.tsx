import React from "react";

export interface ProfileHeaderProps {
  title?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  title = "Thông tin cá nhân",
}) => {
  return (
    <div className="card-custom flex justify-between items-center gap-3 mb-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="body-text text-zinc-500 dark:text-zinc-400 mt-1">
          Cập nhật thông tin cá nhân, thay đổi mật khẩu và quản lý ảnh đại diện.
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
