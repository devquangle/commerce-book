import { useState, useEffect } from "react";
import AddressHeader from "../components/AddressHeader";
import AddressCard, { type AddressData } from "../components/AddressCard";
import AddressSkeleton from "../components/AddressSkeleton";
import { useNavigate } from "react-router-dom";

// Dữ liệu mẫu (Mock Data)
const mockAddresses: AddressData[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    phoneNumber: "0901234567",
    fullAddress: "123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: 2,
    fullName: "Nguyễn Văn A",
    phoneNumber: "0901234567",
    fullAddress: "Tòa nhà Bitexco, 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    isDefault: false,
  },
];

const AddressPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<AddressData[]>([]);

  // Giả lập call API load dữ liệu
  useEffect(() => {
    const timer = setTimeout(() => {
      setAddresses(mockAddresses);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

   const navigate = useNavigate();
  const handleAddClick = () => {

    navigate('/address/create')
  };

  const handleEdit = (id: number) => {
    console.log("Điều hướng sang trang sửa địa chỉ", id);
    // navigate(`/profile/address/${id}/edit`)
  };

  const handleDelete = (item: AddressData) => {
    console.log("Xóa địa chỉ", item.id);
    setAddresses((prev) => prev.filter((addr) => addr.id !== item.id));
  };

  const handleSetDefault = (item: AddressData) => {
    console.log("Set địa chỉ mặc định", item.id);
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === item.id,
      }))
    );
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
        ) : addresses.length > 0 ? (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center py-10 bg-gray-50 dark:bg-zinc-800/20 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
            <p className="text-gray-500 dark:text-zinc-400 mb-4">
              Bạn chưa có địa chỉ nào được lưu.
            </p>
            <button
              onClick={handleAddClick}
              className="text-purple-600 hover:text-purple-700 font-medium dark:text-purple-400"
            >
              + Thêm địa chỉ ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;