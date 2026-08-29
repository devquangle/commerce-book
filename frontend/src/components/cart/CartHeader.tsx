
import React from 'react';
import { Trash2 } from 'lucide-react';

interface CartHeaderProps {
  isCheckedAll: boolean;
  onCheckAll: (checked: boolean) => void;
  onRemoveAll: () => void;
}

const CartHeader: React.FC<CartHeaderProps> = ({ isCheckedAll, onCheckAll, onRemoveAll }) => {
  return (
    <div className="card-custom p-4! mb-4 hidden md:flex items-center text-gray-500 text-sm font-medium">
      <div className="w-6 flex justify-center shrink-0">
        <input 
          type="checkbox" 
          className="checkbox checkbox-primary"
          checked={isCheckedAll}
          onChange={(e) => onCheckAll(e.target.checked)}
        />
      </div>
      <div className="grow pl-4 flex items-center gap-2">
        <span className="cursor-pointer" onClick={() => onCheckAll(!isCheckedAll)}>
          Tất cả sản phẩm
        </span>
      </div>
      <div className="w-32 text-center">Đơn giá</div>
      <div className="w-32 text-center">Số lượng</div>
      <div className="w-32 text-right pr-4">Thành tiền</div>
      <div className="w-12 text-center flex justify-center">
        <button 
          onClick={onRemoveAll}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Xóa tất cả sản phẩm đã chọn"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartHeader;
