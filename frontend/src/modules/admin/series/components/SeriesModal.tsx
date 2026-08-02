"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/common/Modal";
import { InputField } from "@/components/common/InputField";
import { SelectBox } from "@/components/common/SelectBox";
import { Button } from "@/components/common/Button";
import type { SeriesRequest, SeriesResponse } from "../types/series.type";

interface SeriesModalProps {
  isOpen: boolean;
  series: SeriesResponse | null;
  onClose: () => void;
  onSave: (seriesData: SeriesRequest & { id?: number }) => void;
}

const initSeries: SeriesRequest = {
  name: "",
  status: "ACTIVE",
};

const SeriesModalContent: React.FC<SeriesModalProps> = ({
  isOpen,
  series,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SeriesRequest>({
    defaultValues: series || initSeries,
  });

  const onSubmit = async (data: SeriesRequest) => {
    onSave({
      id: series?.id,
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
      title={series ? "Chỉnh sửa thông tin" : "Thêm mới"}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit" form="series-form" isLoading={isSubmitting}>
            {series ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      }
    >
      <form id="series-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-3">
        <InputField
          label="Tên"
          required
          placeholder="Nhập tên..."
          error={errors.name?.message}
          {...register("name", { required: "Vui lòng nhập tên" })}
        />
        {series && (
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

export const SeriesModal: React.FC<SeriesModalProps> = ({
  isOpen,
  series,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <SeriesModalContent
      key={series ? `edit-${series.id}` : "new-series"}
      isOpen={isOpen}
      series={series}
      onClose={onClose}
      onSave={onSave}
    />
  );
};
