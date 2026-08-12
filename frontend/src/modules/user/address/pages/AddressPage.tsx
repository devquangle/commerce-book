import { useState } from "react";
import AddressHeader from "../components/AddressHeader";
import AddressCard, { type AddressData } from "../components/AddressCard";
import AddressSkeleton from "../components/AddressSkeleton";
import { useNavigate } from "react-router-dom";
import { useAddresses } from "../hooks/useAddress";
import type { AddressResponse } from "../types/address.type";
import AddressDeleteModal from "../components/AddressDeleteModal";
import AddressDefaultModal from "../components/AddressDefaultModal";

const AddressPage = () => {
  const { data: addressesResponse = [], isLoading } = useAddresses();
  
  // States cho Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [defaultModalOpen, setDefaultModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);

  // Map từ AddressResponse sang AddressData cho component AddressCard
  const addresses: AddressData[] = addressesResponse.map((addr) => ({
    id: addr.id,
    fullName: addr.fullName,
    phoneNumber: addr.phone,
    fullAddress: addr.streetFull || addr.street,
    isDefault: addr.defaultAddress,
  }));

  const navigate = useNavigate();
  const handleAddClick = () => {
    navigate('/address/create')
  };

  const handleEdit = (id: number) => {
    console.log("Điều hướng sang trang sửa địa chỉ", id);
    // navigate(`/profile/address/${id}/edit`)
  };

  const handleDelete = (item: AddressResponse) => {
    setSelectedAddress(item);
    setDeleteModalOpen(true);
  };

  const handleSetDefault = (item: AddressResponse) => {
    setSelectedAddress(item);
    setDefaultModalOpen(true);
  };

  return (
    <div className="p-1">
      <AddressHeader
        title="Địa chỉ của tôi"
        mode="list"
        onAddClick={handleAddClick}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {isLoading ? (
          <>
            <AddressSkeleton />
            <AddressSkeleton />
          </>
        ) : addressesResponse.length > 0 ? (
          addressesResponse.map((address) => (
            <AddressCard
              key={address.id}
              address={address as unknown as AddressData}
              onEdit={handleEdit}
              onDelete={() => handleDelete(address)}
              onSetDefault={() => handleSetDefault(address)}
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 flex items-center justify-center min-h-[200px] text-center bg-gray-50 dark:bg-zinc-800/20 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 h-full">
            <p className="text-gray-500 dark:text-zinc-400">
              Bạn chưa có địa chỉ nào được lưu.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddressDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedAddress(null);
        }}
        item={selectedAddress}
      />
      
      <AddressDefaultModal
        isOpen={defaultModalOpen}
        onClose={() => {
          setDefaultModalOpen(false);
          setSelectedAddress(null);
        }}
        item={selectedAddress}
      />
    </div>
  );
};

export default AddressPage;