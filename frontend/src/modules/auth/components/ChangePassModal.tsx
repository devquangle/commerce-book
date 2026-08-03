import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/common/Modal";
import { InputField } from "@/components/common/InputField";
import { AuthService } from "@/modules/auth/services/auth.service";
import type { ChangePasswordRequest } from "@/modules/auth/types/user.type";
import { mapServerErrors } from "@/libs/utils/mapServerErrors";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";

interface ChangePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePassModal: React.FC<ChangePassModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    getValues,
    formState: { errors },
  } = useForm<ChangePasswordRequest>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ChangePasswordRequest) => {
    setIsLoading(true);
    try {
      await AuthService.changePassword(data);
      showSuccessToast("Đổi mật khẩu thành công");
      reset();
      onClose();
    } catch (error) {
      mapServerErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Đổi mật khẩu"
      onConfirm={handleSubmit(onSubmit)}
      confirmText="Lưu mật khẩu"
      isLoading={isLoading}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Mật khẩu hiện tại"
          type="password"
          placeholder="Nhập mật khẩu hiện tại"
          {...register("oldPassword", {
            required: "Mật khẩu hiện tại là bắt buộc.",
          })}
          error={errors.oldPassword?.message as string}
        />
        <InputField
          label="Mật khẩu mới"
          type="password"
          placeholder="Nhập mật khẩu mới"
          {...register("newPassword", {
            required: "Mật khẩu mới là bắt buộc.",
            minLength: {
              value: 6,
              message: "Mật khẩu mới phải có ít nhất 6 ký tự",
            },
          })}
          error={errors.newPassword?.message as string}
        />
        <InputField
          label="Xác nhận mật khẩu mới"
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          {...register("confirmPassword", {
            required: "Xác nhận mật khẩu mới là bắt buộc",
            validate: (value) =>
              value === getValues("newPassword") || "Mật khẩu xác nhận không khớp",
          })}
          error={errors.confirmPassword?.message as string}
        />
      </form>
    </Modal>
  );
};
