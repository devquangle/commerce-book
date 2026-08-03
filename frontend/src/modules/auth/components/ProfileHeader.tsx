import React from "react";

export interface ProfileHeaderProps {
  title?: string;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  title = "Thông tin cá nhân",
  className,
}) => {
  return (
    <div className={`flex justify-between items-center ${className || ""}`}>
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
