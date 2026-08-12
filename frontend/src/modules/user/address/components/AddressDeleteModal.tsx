import React from "react";
import { Modal } from "@/components/common/Modal";
import { useDeleteAddress } from "../hooks/useAddress";
import type { AddressResponse } from "../types/address.type";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/libs/utils/api-response";
import { showErrorToast } from "@/libs/utils/toastUtil";

interface AddressDeleteModalProps {
  isPayment?: boolean;
  isOpen: boolean;
  onClose: () => void;
  item: AddressResponse | null;
}

const AddressDeleteModal: React.FC<AddressDeleteModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const deleteMutation = useDeleteAddress();

  const handleConfirm = () => {
    if (item) {
      deleteMutation.mutate(item.id, {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          const axiosError = err as AxiosError<ApiResponse<unknown>>;
          const errorMessage =
            axiosError.response?.data?.message || (err as Error).message;
          showErrorToast(errorMessage || "Có lỗi xảy ra khi xoá.");
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Xóa địa chỉ"
      confirmText="Xác nhận"
      cancelText="Hủy"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác.
        </p>
        {item && (
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
            <p className="font-medium text-zinc-900 dark:text-white">
              {item.fullName} - {item.phone}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {item.streetFull || item.street}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddressDeleteModal;
