"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  AuthorRequest,
  AuthorResponse,
} from "../types/author.type";
import {
  Modal,
  InputField,
  SelectBox,
  TextAreaField,
  Button,
} from "@/components/common";

interface AuthorModalProps {
  isOpen: boolean;
  author: AuthorResponse | null;
  onClose: () => void;
  onSave: (authorData: AuthorRequest & { id?: number }) => void;
}

interface AuthorModalContentProps {
  isOpen: boolean;
  author: AuthorResponse | null;
  onClose: () => void;
  onSave: (authorData: AuthorRequest & { id?: number }) => void;
}

const AuthorModalContent: React.FC<AuthorModalContentProps> = ({
  isOpen,
  author,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthorRequest>({
    defaultValues: {
      name: author?.name || "",
      urlImage: author?.urlImage || "",
      urlBio: author?.urlBio || "",
      extract: author?.description || "",
      status: author?.status || "ACTIVE",
    },
  });

  const onSubmit = (data: AuthorRequest) => {
    onSave({
      id: author?.id,
      ...data,
    });
  };

  const statusOptions = [
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Không hoạt động", value: "INACTIVE" },
    { label: "Đã xóa", value: "DELETED" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={author ? "Chỉnh sửa thông tin tác giả" : "Thêm tác giả mới"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Tên tác giả"
          required
          placeholder="VD: Nguyễn Nhật Ánh"
          error={errors.name?.message}
          {...register("name", { required: "Vui lòng nhập tên tác giả" })}
        />

        <SelectBox
          label="Trạng thái"
          options={statusOptions}
          error={errors.status?.message}
          {...register("status")}
        />

        <InputField
          label="URL Hình ảnh (Avatar)"
          type="url"
          placeholder="https://example.com/author.jpg"
          error={errors.urlImage?.message}
          {...register("urlImage")}
        />

        <InputField
          label="URL Tiểu sử (Bio Link)"
          type="url"
          placeholder="https://vi.wikipedia.org/wiki/..."
          error={errors.urlBio?.message}
          {...register("urlBio")}
        />

        <TextAreaField
          label="Tóm tắt / Extract"
          rows={3}
          placeholder="Nhập tóm tắt tiểu sử tác giả..."
          error={errors.extract?.message}
          {...register("extract")}
        />

        {/* Modal Actions */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {author ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const AuthorModal: React.FC<AuthorModalProps> = ({
  isOpen,
  author,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <AuthorModalContent
      key={author ? `edit-${author.id}` : "new-author"}
      isOpen={isOpen}
      author={author}
      onClose={onClose}
      onSave={onSave}
    />
  );
};
