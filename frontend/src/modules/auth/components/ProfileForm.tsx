import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import type { UserRequest } from "@/modules/auth/types/user.type";
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

export interface ProfileFormProps {
  register: UseFormRegister<UserRequest>;
  errors: FieldErrors<UserRequest>;
  onSubmit: ReturnType<UseFormHandleSubmit<UserRequest>>;}

export const ProfileForm = ({
  register,
  errors,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <div className="flex-1">
      <form className="space-y-4" onSubmit={onSubmit}>
        <InputField
          label="Họ và tên"
          type="text"
          placeholder="Họ và tên"
          {...register("name", {
            required: "Họ và tên là bắt buộc",
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

        <Button type="submit" className="w-full lg:w-auto">
          Lưu thay đổi
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
