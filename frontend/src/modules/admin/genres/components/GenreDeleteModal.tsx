import React from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import type { GenreResponse } from "../types/genre.type";

interface GenreDeleteModalProps {
  isOpen: boolean;
  genre: GenreResponse | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const GenreDeleteModal: React.FC<GenreDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  genre,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa tác giả"
      content={`Bạn có chắc chắn muốn xóa tác giả "${genre && genre?.name}"? Hành động này không thể hoàn tác.`}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Xóa
          </Button>
        </div>
      }
    />
  );
};
