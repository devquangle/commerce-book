import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/useAuth";
import { getErrorMessage } from "@/libs/utils/error";
import { mapServerErrors } from "@/libs/utils/mapServerErrors";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import { AuthService } from "@/modules/auth/services/auth.service";
import type { UserRequest } from "@/modules/auth/types/user.type";
import UploadImageService from "@/services/upload-image.service";

import { ProfileHeader } from "./ProfileHeader";
import { ProfileForm } from "./ProfileForm";
import { ProfileAvatar } from "./ProfileAvatar";
import { ChangePassModal } from "./ChangePassModal";
import Spinner from "@/components/common/Spinner";

const Profile: React.FC = () => {
  const { userInfo, setUserInfo } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
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

  const onSubmit = async (data: UserRequest) => {
    try {
      setIsLoading(true);
      const updatedData = { ...data };
      if (avatarFile) {
        const imageUrl = await UploadImageService.uploadFile(avatarFile);
        updatedData.avatarUrl = imageUrl;
        setAvatar(imageUrl);
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
    return <Spinner message="Đang cập nhật thông tin..." />
  }

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      <ProfileHeader title="Thông tin cá nhân" className="card-custom" />

      <div className="card-custom flex flex-col lg:flex-row gap-6">
        <ProfileForm
          register={register}
          errors={errors}
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

export default Profile;
