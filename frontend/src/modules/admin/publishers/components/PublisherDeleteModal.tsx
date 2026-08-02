import React from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import type { PublisherResponse } from "../types/publisher.type";

interface PublisherDeleteModalProps {
  isOpen: boolean;
  publisher: PublisherResponse | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const PublisherDeleteModal: React.FC<PublisherDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  publisher,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa tác giả"
      content={`Bạn có chắc chắn muốn xóa tác giả "${publisher && publisher?.name}"? Hành động này không thể hoàn tác.`}
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
