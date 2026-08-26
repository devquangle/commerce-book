import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AddressResponse } from "../types/address.type";

interface AddressCardProps {
  address: AddressResponse;
  onEdit?: (id: number) => void;
  onDelete?: (item: AddressResponse) => void;
  onSetDefault?: (id: AddressResponse) => void;
  isPayment?: boolean;
  onSelect?: (item: AddressResponse) => void;
}

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isPayment,
  onSelect,
}: AddressCardProps) => {
  return (
    <div
      className={
        isPayment
          ? "p-4 transition-all"
          : `card-custom p-4 transition-all ${
              address.defaultAddress
                ? "border-purple-200 bg-purple-50/50 dark:border-purple-900/30 dark:bg-purple-900/10"
                : "hover:border-gray-300 dark:hover:border-zinc-700"
            }`
      }
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            {address.fullName}
          </h3>
          <span className="text-gray-400 dark:text-gray-500">|</span>
          <span className="text-gray-600 dark:text-gray-400">
            {address.phone}
          </span>
        </div>
        {address.defaultAddress && (
          <span className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
            Mặc định
          </span>
        )}
      </div>

      <div className="text-gray-600 dark:text-gray-400 mb-4">
        <p className="text-sm leading-relaxed">{address.streetFull}</p>
      </div>

      {isPayment ? (
        <div className="flex justify-end mt-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onSelect?.(address)}>
            Chọn địa chỉ này
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800/50">
          <div>
            {!address.defaultAddress && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetDefault?.(address)}
                className="text-purple-600! hover:text-purple-700! dark:text-purple-400! px-2"
              >
                Thiết lập mặc định
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(address.id)}
              icon={<Edit className="w-4 h-4" />}
              title="Chỉnh sửa"
              className="px-2"
            />
            {!address.defaultAddress && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(address)}
                icon={<Trash2 className="w-4 h-4" />}
                title="Xóa"
                className="px-2 text-red-500! hover:text-red-600! hover:bg-red-50 dark:hover:bg-red-900/20"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
