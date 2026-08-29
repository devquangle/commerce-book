import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/useAuth";
import { getErrorMessage } from "@/libs/utils/error";
import { mapServerErrors } from "@/libs/utils/mapServerErrors";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/libs/utils/toastUtil";
import { AuthService } from "@/modules/auth/services/auth.service";
import type { UserRequest } from "@/modules/auth/types/user.type";
import UploadImageService from "@/services/cloudinary/services/cloudinary.service";

import { ProfileHeader } from "./ProfileHeader";
import { ProfileForm } from "./ProfileForm";
import { ProfileAvatar } from "./ProfileAvatar";
import { ChangePassModal } from "./ChangePassModal";
import Spinner from "@/components/ui/Spinner";

const ProfilePage = () => {
  const { userInfo, setUserInfo } = useAuth();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setError,
  } = useForm<UserRequest>({
    defaultValues: {
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      phone: userInfo?.phone || "",
      street: userInfo?.street || "",
      avatarUrl: userInfo?.avatarUrl || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<string>(
    userInfo?.avatarUrl || "/images/default-avatar.png",
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const textContent =
    userInfo?.role == "USER"
      ? ""
      : "Cập nhật thông tin cá nhân, thay đổi mật khẩu và quản lý ảnh đại diện.";
  const classNameInfo = userInfo?.role == "USER" ? "" : "card-custom";

  const onSubmit = async (data: UserRequest) => {
    try {
      setIsLoading(true);
      const updatedData = { ...data };
      const changed =
        avatarFile !== null ||
        ["name", "email", "phone", "street", "avatarUrl"].some(
          (key) =>
            data[key as keyof UserRequest] !==
            userInfo?.[key as keyof typeof userInfo],
        );
      if (!changed) {
        showInfoToast("Không có thay đổi nào");
        return;
      }
      if (avatarFile) {
        const imageUrl = await UploadImageService.uploadFile(avatarFile);
        updatedData.avatarUrl = imageUrl.url;
        setAvatar(imageUrl.url);
      }

      const userRes = await AuthService.updateUser(updatedData);

      if (userRes) {
        showSuccessToast("Cập nhật thông tin thành công");
        setUserInfo(userRes);
        queryClient.setQueryData(["auth", "me"], userRes);
      }
    } catch (error: unknown) {
      mapServerErrors(error, setError);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <Spinner message="Đang cập nhật thông tin..." />;
  }

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      <ProfileHeader
        title="Thông tin cá nhân"
        subTitle={textContent}
        hasCard={classNameInfo === "card-custom"}
      />

      <div className={`flex flex-col lg:flex-row gap-6 ${classNameInfo}`}>
        <ProfileForm
          control={control}
          onSubmit={handleSubmit(onSubmit)}
        />

        <ProfileAvatar
          avatar={avatar}
          onAvatarChange={handleAvatarChange}
          onChangePasswordClick={() => setIsChangePassModalOpen(true)}
        />
      </div>

      <ChangePassModal
        isOpen={isChangePassModalOpen}
        onClose={() => setIsChangePassModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
