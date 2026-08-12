import AddressHeader from "../components/AddressHeader";
import AddressCard from "../components/AddressCard";
import AddressSkeleton from "../components/AddressSkeleton";
import { useNavigate } from "react-router-dom";
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from "../hooks/useAddress";
import type { AddressResponse } from "../types/address.type";

const AddressPage = () => {
  const { data: addressesResponse = [], isLoading } = useAddresses();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  // Map từ AddressResponse sang AddressData cho component AddressCard
 

  const navigate = useNavigate();
  const handleAddClick = () => {
    navigate('/address/create')
  };

  const handleEdit = (id: number) => {
    console.log("Điều hướng sang trang sửa địa chỉ", id);
    // navigate(`/profile/address/${id}/edit`)
  };

  const handleDelete = (item: AddressResponse) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleSetDefault = (item: AddressResponse) => {
    setDefaultMutation.mutate(item.id);
  };

  return (
    <>
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
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 flex items-center justify-center min-h-70 text-center bg-gray-50 dark:bg-zinc-800/20 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 ">
            <p className="text-gray-500 dark:text-zinc-400">
              Bạn chưa có địa chỉ nào được lưu.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AddressPage;