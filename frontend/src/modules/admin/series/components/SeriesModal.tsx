"use client";

import React from "react";
import { useForm, Controller, type UseFormSetError } from "react-hook-form";
import { Modal } from "@/components/common/Modal";
import { InputField } from "@/components/common/InputField";
import { SelectBox } from "@/components/common/SelectBox";
import { Button } from "@/components/common/Button";
import type { SeriesRequest, SeriesResponse } from "../types/series.type";

interface SeriesModalProps {
  isOpen: boolean;
  series: SeriesResponse | null;
  onClose: () => void;
  onSave: (seriesData: SeriesRequest & { id?: number },
      setError: UseFormSetError<SeriesRequest>,
    ) => void | Promise<void>;
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
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SeriesRequest>({
    defaultValues: series || initSeries,
  });

  const onSubmit = async (data: SeriesRequest) => {
    await onSave({
      id: series?.id,
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
      title={series ? "Cập nhật" : "Thêm mới"}
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
      <form id="series-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Tên series"
          required
          placeholder="Nhập tên series..."
          error={errors.name?.message}
          {...register("name", { required: "Vui lòng nhập tên series" })}
        />
        {series && (
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
