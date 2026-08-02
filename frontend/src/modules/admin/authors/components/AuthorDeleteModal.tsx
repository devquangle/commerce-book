import React from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import type { AuthorResponse } from "../types/author.type";

interface AuthorDeleteModalProps {
  isOpen: boolean;
  author: AuthorResponse | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const AuthorDeleteModal: React.FC<AuthorDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  author,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa tác giả"
      content={`Bạn có chắc chắn muốn xóa tác giả "${author && author?.name}"? Hành động này không thể hoàn tác.`}
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
