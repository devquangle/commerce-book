import AddressHeader from "@/components/user/address/AddressHeader";
import AddressFormAdd from "@/components/user/address/AddressFormAdd";

const AddressCreatePage = () => {
  return (
    <div className="p-1">
      <AddressHeader title="Thêm địa chỉ mới" mode="add" />
      <div className="mt-6">
        <AddressFormAdd />
      </div>
    </div>
  );
};

export default AddressCreatePage;