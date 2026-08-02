"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/common/Modal";
import { InputField } from "@/components/common/InputField";
import { SelectBox } from "@/components/common/SelectBox";
import { Button } from "@/components/common/Button";
import type { PublisherRequest, PublisherResponse } from "../types/publisher.type";

interface PublisherModalProps {
  isOpen: boolean;
  publisher: PublisherResponse | null;
  onClose: () => void;
  onSave: (publisherData: PublisherRequest & { id?: number }) => void;
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
    formState: { errors, isSubmitting },
  } = useForm<PublisherRequest>({
    defaultValues: publisher || initPublisher,
  });

  const onSubmit = async (data: PublisherRequest) => {
    onSave({
      id: publisher?.id,
      ...data,
    });
  };

  const statusOptions = [
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Không hoạt động", value: "INACTIVE" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={publisher ? "Chỉnh sửa thông tin" : "Thêm mới"}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit" form="publisher-form" isLoading={isSubmitting}>
            {publisher ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      }
    >
      <form id="publisher-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-3">
        <InputField
          label="Tên"
          required
          placeholder="Nhập tên..."
          error={errors.name?.message}
          {...register("name", { required: "Vui lòng nhập tên" })}
        />
        {publisher && (
          <SelectBox
            label="Trạng thái"
            options={statusOptions}
            error={errors.status?.message}
            {...register("status")}
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
