import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/Button";
import type { UserRequest } from "@/modules/auth/types/user.type";
import type { Control, UseFormHandleSubmit } from "react-hook-form";

export interface ProfileFormProps {
  control: Control<UserRequest>;
  onSubmit: ReturnType<UseFormHandleSubmit<UserRequest>>;
}

export const ProfileForm = ({
  control,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <div className="flex-1">
      <form className="space-y-1.5" onSubmit={onSubmit}>
        <FormInput
          name="name"
          control={control}
          label="Họ và tên"
          type="text"
          placeholder="Họ và tên"
          rules={{
            required: "Họ và tên là bắt buộc",
          }}
        />

        <FormInput
          name="email"
          control={control}
          label="Email"
          type="email"
          placeholder="you@gmail.com"
          rules={{
            required: "Email là bắt buộc",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email không hợp lệ",
            },
          }}
        />

        <FormInput
          name="phone"
          control={control}
          label="Số điện thoại"
          type="text"
          placeholder="0123456789"
          rules={{
            required: "Số điện thoại là bắt buộc",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Số điện thoại không hợp lệ",
            },
          }}
        />

        <FormInput
          name="street"
          control={control}
          label="Địa chỉ"
          type="text"
          placeholder="Địa chỉ"
          rules={{
            required: "Địa chỉ là bắt buộc",
          }}
        />

        <Button type="submit" className="w-full lg:w-auto">
          Lưu thay đổi
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
