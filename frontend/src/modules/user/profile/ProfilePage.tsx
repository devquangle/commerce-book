import { InputField } from "@/components/common/InputField";
import { useAuth } from "@/context/useAuth";

import { getErrorMessage } from "@/libs/utils/error";
import { mapServerErrors } from "@/libs/utils/mapServerErrors";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import { AuthService } from "@/modules/auth/services/auth.service";
import type { UserRequest } from "@/modules/auth/types/user.type";
import UploadImageService from "@/services/upload-image.service";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
const Profile = () => {
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
        const imageUrl = await UploadImageService.uploadImage(avatarFile);
        updatedData.avatarUrl = imageUrl;
      }

      const formData = new FormData();
      formData.append(
        "profile",
        new Blob([JSON.stringify(updatedData)], { type: "application/json" }),
      );

      console.log("Submitting form data:", updatedData); // Log the data being submitted

      const userRes = await AuthService.updateUser(formData);

      if (userRes) {
        showSuccessToast("Cập nhật thông tin thành công");
        setUserInfo(userRes);
        console.log(userInfo);
        
        queryClient.setQueryData(["auth", "me"], userRes);
      }
    } catch (error: unknown) {
      mapServerErrors(error, setError);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-2">
      <div className="flex justify-between items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Thông tin cá nhân
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Form thông tin */}
        <div className="flex-1">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Họ và tên"
              type="text"
              placeholder="Họ và tên"
              {...register("name", {
                required: "Họ và tên là bắt buộc",
                // pattern: {
                //     value: /^[a-zA-ZÀ-ỹ\s]+$/,
                // }
              })}
              error={errors?.name?.message}
            />

            <InputField
              label="Email"
              type="email"
              placeholder="you@gmail.com"
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
              error={errors?.email?.message}
            />

            <InputField
              label="Số điện thoại"
              type="text"
              placeholder="0123456789"
              {...register("phone", {
                required: "Số điện thoại là bắt buộc",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
              error={errors?.phone?.message}
            />

            <InputField
              label="Địa chỉ"
              type="text"
              placeholder="Địa chỉ"
              {...register("street", {
                required: "Địa chỉ là bắt buộc",
              })}
              error={errors?.street?.message}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full lg:w-auto  cursor-pointer px-4 py-2 rounded text-white ${
                isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center lg:w-1/3 space-y-4 p-4">
          <div className="relative group w-32 h-32">
            <img
              src={avatar}
              alt="avatar"
              className="
      w-full h-full rounded-2xl border object-cover
      transition-transform duration-200
      group-hover:scale-105
    "
            />

            <div
              className="
  absolute inset-0 rounded-2xl
  flex items-center justify-center gap-3
  "
            >
              {/* VIEW */}
              <button
                type="button"
                onClick={() => window.open(avatar, "_blank")}
                className="
      p-2 bg-white shadow-md rounded-full
  opacity-0 group-hover:opacity-100
  transition-all duration-200
    cursor-pointer
      "
              >
                👁
              </button>

              {/* EDIT */}
              <label
                className="
       p-2 bg-white shadow-md rounded-full
  opacity-0 group-hover:opacity-100
  transition-all duration-200
        cursor-pointer
    "
              >
                ✏️
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          {/* fallback text */}
          <label className="cursor-pointer text-blue-500 hover:underline">
            Thay đổi ảnh
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>

          <button className="w-full lg:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};
export default Profile;
