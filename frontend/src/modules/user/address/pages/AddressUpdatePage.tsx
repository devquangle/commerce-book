import { useParams } from "react-router-dom";
import AddressHeader from "../components/AddressHeader";
import AddressFormUpdate from "../components/AddressFormUpdate";

const AddressUpdatePage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-1">
      <AddressHeader title="Cập nhật địa chỉ" mode="edit" />
      <div className="mt-6">
        {id ? (
          <AddressFormUpdate addressId={Number(id)} />
        ) : (
          <div className="text-center py-10 text-gray-500">
            Không tìm thấy địa chỉ hợp lệ.
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressUpdatePage;