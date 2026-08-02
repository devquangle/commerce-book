import React from "react";
import { useForm, Controller, type UseFormSetError } from "react-hook-form";
import { Modal } from "@/components/common/Modal";
import { InputField } from "@/components/common/InputField";
import { SelectBox } from "@/components/common/SelectBox";
import { Button } from "@/components/common/Button";
import type {
  PublisherRequest,
  PublisherResponse,
} from "../types/publisher.type";

interface PublisherModalProps {
  isOpen: boolean;
  publisher: PublisherResponse | null;
  onClose: () => void;
  onSave: (
    publisherData: PublisherRequest & { id?: number },
    setError: UseFormSetError<PublisherRequest>,
  ) => void;
}

const initPublisher: PublisherRequest = {
  name: "",
  status: "ACTIVE",
};

const PublisherModalContent: React.FC<PublisherModalProps> = ({
  isOpen,
  publisher,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PublisherRequest>({
    defaultValues: publisher || initPublisher,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: PublisherRequest) => {
    await onSave(
      {
        id: publisher?.id,
        ...data,
      },
      setError,
    );
  };

  const statusOptions = [
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Ngừng hoạt động", value: "INACTIVE" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={publisher ? "Cập nhật nhà xuất bản" : "Thêm nhà xuất bản mới"}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit" form="publisher-form" disabled={isSubmitting}>
            {publisher ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      }
    >
      <form
        id="publisher-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 px-3"
      >
        <InputField
          label="Tên"
          required
          placeholder="Nhập tên..."
          error={errors.name?.message}
          {...register("name", {
            required: "Tên nhà xuất bản không được để trống.",
            minLength: {
              value: 2,
              message: "Tên nhà xuất bản phải có ít nhất 2 ký tự.",
            },
            maxLength: {
              value: 100,
              message: "Tên nhà xuất bản không được vượt quá 100 ký tự.",
            },
            pattern: {
              value: /^[A-Za-zÀ-ỹ\s]+$/u,
              message: "Tên nhà xuất bản chỉ được chứa chữ cái và khoảng trắng.",
            },
          })}
        />
        {publisher && (
          <Controller
            control={control}
            name="status"
            render={({ field: { value, onChange, onBlur, ref, name } }) => (
              <SelectBox
                label="Trạng thái"
                options={statusOptions}
                error={errors.status?.message}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                openDirection="up"
              />
            )}
          />
        )}
      </form>
    </Modal>
  );
};

export const PublisherModal: React.FC<PublisherModalProps> = ({
  isOpen,
  publisher,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <PublisherModalContent
      key={publisher ? `edit-${publisher.id}` : "new-publisher"}
      isOpen={isOpen}
      publisher={publisher}
      onClose={onClose}
      onSave={onSave}
    />
  );
};
