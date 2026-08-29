import React, { useState } from 'react';
import { Tag } from 'lucide-react';

import { formatMoney } from '@/libs/utils/formatMoney.utils';
import { Modal } from '../ui/Modal';

interface VoucherProps {
  onApply?: (discount: number) => void;
}

const Voucher: React.FC<VoucherProps> = ({ onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);

  // Placeholder voucher data
  const vouchers = [
    { id: 1, title: 'Giảm 20.000đ', discount: 20000, description: 'Đơn tối thiểu 100k' },
    { id: 2, title: 'Giảm 50.000đ', discount: 50000, description: 'Đơn tối thiểu 300k' },
  ];

  const handleApply = () => {
    if (selectedVoucherId) {
      const voucher = vouchers.find((v) => v.id === selectedVoucherId);
      if (voucher) {
        onApply?.(voucher.discount);
      }
    } else {
      onApply?.(0);
    }
    setIsOpen(false);
  };

  const selectedVoucher = vouchers.find(v => v.id === selectedVoucherId);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[120px] justify-center"
      >
        <Tag size={16} className={selectedVoucher ? "text-purple-600" : ""} />
        {selectedVoucher ? `Đã giảm ${formatMoney(selectedVoucher.discount)}` : 'Voucher'}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Chọn Voucher"
        size="md"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <button
              onClick={() => {
                setSelectedVoucherId(null);
                setIsOpen(false);
                onApply?.(0);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bỏ chọn
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              Áp dụng
            </button>
          </div>
        }
      >
        <div className="p-4 space-y-3">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              onClick={() => setSelectedVoucherId(voucher.id)}
              className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center transition-colors ${
                selectedVoucherId === voucher.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div>
                <p className="font-semibold text-gray-800">{voucher.title}</p>
                <p className="text-xs text-gray-500">{voucher.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedVoucherId === voucher.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {selectedVoucherId === voucher.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Voucher;