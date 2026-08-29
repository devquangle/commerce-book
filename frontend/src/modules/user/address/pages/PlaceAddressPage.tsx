import { useState } from "react";
import { MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import AddressCard from "../components/AddressCard";
import AddressHeader from "../components/AddressHeader";
import AddressSkeleton from "../components/AddressSkeleton";
import AddressFormAdd from "../components/AddressFormAdd";
import AddressFormUpdate from "../components/AddressFormUpdate";
import AddressDeleteModal from "../components/AddressDeleteModal";
import AddressDefaultModal from "../components/AddressDefaultModal";
import { useAddresses } from "../hooks/useAddress";
import type { AddressResponse } from "../types/address.type";

type ViewMode = "list" | "add" | "edit";

const PlaceAddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect nếu được mở từ trang thanh toán
  const fromPayment = (location.state as { fromPayment?: boolean } | null)
    ?.fromPayment ?? false;
  const { data: addresses = [], isLoading } = useAddresses();

  const [mode, setMode] = useState<ViewMode>("list");
  const [editId, setEditId] = useState<number | null>(null);

  // Delete modal state
  const [deleteItem, setDeleteItem] = useState<AddressResponse | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Set default modal state
  const [defaultItem, setDefaultItem] = useState<AddressResponse | null>(null);
  const [isDefaultOpen, setIsDefaultOpen] = useState(false);

  const handleEdit = (id: number) => {
    setEditId(id);
    setMode("edit");
  };

  const handleDelete = (item: AddressResponse) => {
    setDeleteItem(item);
    setIsDeleteOpen(true);
  };

  const handleSetDefault = (item: AddressResponse) => {
    setDefaultItem(item);
    setIsDefaultOpen(true);
  };

  const handleSelectAddress = (address: AddressResponse) => {
    navigate("/checkout", { state: { selectedAddress: address } });
  };

  const handleBackToList = () => {
    setMode("list");
    setEditId(null);
  };

  const headerTitle =
    mode === "add"
      ? "Thêm địa chỉ mới"
      : mode === "edit"
      ? "Cập nhật địa chỉ"
      : fromPayment
      ? "Chọn địa chỉ giao hàng"
      : "Địa chỉ giao hàng";

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <AddressHeader
        title={headerTitle}
        mode={mode}
        onAddClick={() => setMode("add")}
        onBackClick={
          mode !== "list"
            ? handleBackToList
            : fromPayment
            ? () => navigate("/checkout")
            : undefined
        }
      />

      {/* ── LIST mode ── */}
      {mode === "list" && (
        <>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <AddressSkeleton key={i} />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <MapPin size={48} className="mb-3 opacity-30" />
              <p className="text-base font-medium">Chưa có địa chỉ nào</p>
              <p className="text-sm mt-1">
                Nhấn "Thêm mới" để thêm địa chỉ giao hàng.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  isPayment={fromPayment}
                  onSelect={fromPayment ? handleSelectAddress : undefined}
                  onEdit={fromPayment ? undefined : handleEdit}
                  onDelete={fromPayment ? undefined : handleDelete}
                  onSetDefault={fromPayment ? undefined : handleSetDefault}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── ADD mode ── */}
      {mode === "add" && (
        <div className="card-custom">
          <AddressFormAdd onSuccess={handleBackToList} />
        </div>
      )}

      {/* ── EDIT mode ── */}
      {mode === "edit" && editId !== null && (
        <div className="card-custom">
          <AddressFormUpdate addressId={editId} onSuccess={handleBackToList} />
        </div>
      )}

      {/* Modals */}
      <AddressDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteItem(null);
        }}
        item={deleteItem}
      />

      <AddressDefaultModal
        isOpen={isDefaultOpen}
        onClose={() => {
          setIsDefaultOpen(false);
          setDefaultItem(null);
        }}
        item={defaultItem}
      />
    </div>
  );
};

export default PlaceAddressPage;
