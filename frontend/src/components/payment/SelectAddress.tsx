import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown, CheckCircle2, Plus, Loader2 } from "lucide-react";
import type { AddressResponse } from "@/modules/user/address/types/address.type";
import { Modal } from "@/components/ui/Modal";
import { useAddresses } from "@/modules/user/address/hooks/useAddress";

interface SelectAddressProps {
  onSelect: (address: AddressResponse) => void;
}

const SelectAddress: React.FC<SelectAddressProps> = ({ onSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const { data: addresses = [], isLoading } = useAddresses();

  // Tu dong chon dia chi mac dinh khi load xong
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const defaultAddress =
        addresses.find((a) => a.defaultAddress) ?? addresses[0];
      setSelectedAddressId(defaultAddress.id);
      onSelect(defaultAddress);
    }
  }, [addresses]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handleSelect = (address: AddressResponse) => {
    setSelectedAddressId(address.id);
    onSelect(address);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="card-custom">
        {/* Header: title + nut thay doi cung hang */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-blue-600 shrink-0" />
            <h2 className="font-semibold text-gray-800 text-base">
              Dia chi giao hang
            </h2>
          </div>
          {selectedAddress && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="shrink-0 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
            >
              Thay doi
              <ChevronDown size={14} />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-400 py-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Dang tai dia chi...</span>
          </div>
        ) : selectedAddress ? (
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-semibold text-gray-900">
                {selectedAddress.fullName}
              </span>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className="text-gray-600">{selectedAddress.phone}</span>
              {selectedAddress.defaultAddress && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <CheckCircle2 size={10} />
                  Mac dinh
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {selectedAddress.streetFull || selectedAddress.street}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Chon dia chi giao hang</span>
          </button>
        )}
      </div>

      {/* Address Selection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Chon dia chi giao hang"
        size="md"
      >
        <div className="space-y-3">
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MapPin size={40} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Ban chua co dia chi nao</p>
            </div>
          ) : (
            addresses.map((address) => {
              const isSelected = address.id === selectedAddressId;
              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => handleSelect(address)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">
                          {address.fullName}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {address.phone}
                        </span>
                        {address.defaultAddress && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Mac dinh
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {address.streetFull || address.street}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2
                        size={18}
                        className="text-blue-500 shrink-0 mt-0.5"
                      />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </Modal>
    </>
  );
};

export default SelectAddress;
