import React from "react";
import { useForm, Controller, type UseFormSetError } from "react-hook-form";
import { Modal } from "@/components/common/Modal";
import { InputField } from "@/components/common/InputField";
import { SelectBox } from "@/components/common/SelectBox";
import { Button } from "@/components/common/Button";
import type { GenreRequest, GenreResponse } from "../types/genre.type";

interface GenreModalProps {
  isOpen: boolean;
  genre: GenreResponse | null;
  onClose: () => void;
  onSave: (genreData: GenreRequest & { id?: number }, setError: UseFormSetError<GenreRequest>) => void | Promise<void>;
}

const initGenre: GenreRequest = {
  name: "",
  status: "ACTIVE",
};

const GenreModalContent: React.FC<GenreModalProps> = ({
  isOpen,
  genre,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GenreRequest>({
    defaultValues: genre || initGenre,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: GenreRequest) => {
    await onSave({
      id: genre?.id,
      ...data,
    }, setError);
  };

  const statusOptions = [
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Ngừng hoạt động", value: "INACTIVE" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={genre ? "Cập nhật" : "Thêm mới"}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit" form="genre-form" isLoading={isSubmitting}>
            {genre ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      }
    >
      <form
        id="genre-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <InputField
          label="Tên thể loại"
          required
          placeholder="Nhập tên thể loại..."
          error={errors.name?.message}
          {...register("name", {
            required: "Tên thể loại không được để trống.",
            minLength: {
              value: 2,
              message: "Tên thể loại phải có ít nhất 2 ký tự.",
            },
            maxLength: {
              value: 100,
              message: "Tên thể loại không được vượt quá 100 ký tự.",
            },
            pattern: {
              value: /^[A-Za-zÀ-ỹ\s]+$/u,
              message: "Tên thể loại chỉ được chứa chữ cái và khoảng trắng.",
            },
          })}
        />
        {genre && (
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

export const GenreModal: React.FC<GenreModalProps> = ({
  isOpen,
  genre,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <GenreModalContent
      key={genre ? `edit-${genre.id}` : "new-genre"}
      isOpen={isOpen}
      genre={genre}
      onClose={onClose}
      onSave={onSave}
    />
  );
};
