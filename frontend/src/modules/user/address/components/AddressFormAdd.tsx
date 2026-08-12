import { useForm, Controller } from "react-hook-form";
import { InputField } from "@/components/common/InputField";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { TextAreaField } from "@/components/common/TextAreaField";
import { Button } from "@/components/common/Button";
import {
  useProvinces,
  useDistricts,
  useWards,
} from "@/modules/others/ghn/hooks/useGhn";
import type { ProvinceResponse, DistrictResponse, WardResponse } from "@/modules/others/ghn/types/ghn.type";

type AddressFormAddProps = {
  isPayment?: boolean;
};

type AddressFormData = {
  fullName: string;
  phoneNumber: string;
  provinceId: number | "";
  districtId: number | "";
  wardCode: string;
  fullAddress: string;
  isDefault: boolean;
};

const AddressFormAdd = ({ isPayment }: AddressFormAddProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      provinceId: "",
      districtId: "",
      wardCode: "",
      fullAddress: "",
      isDefault: false,
    },
  });

  const provinceId = watch("provinceId");
  const districtId = watch("districtId");

  const { data: provinces = [] } = useProvinces();
  const { data: districts = [] } = useDistricts(provinceId ? Number(provinceId) : null);
  const { data: wards = [] } = useWards(districtId ? Number(districtId) : null);

  // Map sang format của SearchableSelect
  const provinceOptions = Array.isArray(provinces) ? provinces.map((p: ProvinceResponse) => ({
    label: p.provinceName,
    value: p.provinceId,
  })) : [];
  
  const districtOptions = Array.isArray(districts) ? districts.map((d: DistrictResponse) => ({
    label: d.districtName,
    value: d.districtId,
  })) : [];
  
  const wardOptions = Array.isArray(wards) ? wards.map((w: WardResponse) => ({
    label: w.wardName,
    value: w.wardCode,
  })) : [];

  const onSubmit = (data: AddressFormData) => {
    console.log("Form Submitted:", data);
    // TODO: Handle submit logic
  };

  return (
    <div className={isPayment ? "card-custom" : ""}>
      <form
        className="grid grid-cols-1 md:grid-cols-12 gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Full Name & Phone - 6-6 layout on md, 12 on sm */}
        <div className="col-span-1 md:col-span-6">
          <InputField
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            required
            {...register("fullName", { required: "Vui lòng nhập họ và tên." })}
            error={errors.fullName?.message}
          />
        </div>
        <div className="col-span-1 md:col-span-6">
          <InputField
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            required
            {...register("phoneNumber", {
              required: "Vui lòng nhập số điện thoại.",
              pattern: {
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                message: "Số điện thoại không hợp lệ.",
              },
            })}
            error={errors.phoneNumber?.message}
          />
        </div>

        {/* Region Selectors - 4-4-4 layout on md, 12 on sm */}
        <div className="col-span-1 md:col-span-4">
          <Controller
            control={control}
            name="provinceId"
            rules={{ required: "Vui lòng chọn Tỉnh/Thành phố." }}
            render={({ field, fieldState: { error } }) => (
              <SearchableSelect
                label="Tỉnh/Thành phố"
                placeholder="Chọn Tỉnh/Thành phố"
                options={provinceOptions}
                required
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setValue("districtId", "");
                  setValue("wardCode", "");
                }}
                error={error?.message}
              />
            )}
          />
        </div>
        <div className="col-span-1 md:col-span-4">
          <Controller
            control={control}
            name="districtId"
            rules={{ required: "Vui lòng chọn Quận/Huyện." }}
            render={({ field, fieldState: { error } }) => (
              <SearchableSelect
                label="Quận/Huyện"
                placeholder="Chọn Quận/Huyện"
                options={districtOptions}
                disabled={!provinceId}
                required
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setValue("wardCode", "");
                }}
                error={error?.message}
              />
            )}
          />
        </div>
        <div className="col-span-1 md:col-span-4">
          <Controller
            control={control}
            name="wardCode"
            rules={{ required: "Vui lòng chọn Phường/Xã." }}
            render={({ field, fieldState: { error } }) => (
              <SearchableSelect
                label="Phường/Xã"
                placeholder="Chọn Phường/Xã"
                options={wardOptions}
                disabled={!districtId}
                required
                {...field}
                error={error?.message}
              />
            )}
          />
        </div>

        {/* Detail Address - 12 layout */}
        <div className="col-span-1 md:col-span-12">
          <TextAreaField
            label="Địa chỉ cụ thể"
            placeholder="Nhập số nhà, tên đường..."
            rows={3}
            required
            {...register("fullAddress", { required: "Vui lòng nhập địa chỉ cụ thể." })}
            error={errors.fullAddress?.message}
          />
        </div>

        {/* Set Default */}
        <div className="col-span-1 md:col-span-12 flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="isDefault"
            className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
            {...register("isDefault")}
          />
          <label
            htmlFor="isDefault"
            className="text-sm font-medium text-gray-700 dark:text-zinc-300 cursor-pointer select-none"
          >
            Đặt làm địa chỉ mặc định
          </label>
        </div>

        <div className="col-span-1 md:col-span-12 flex justify-end mt-2 gap-3">
          <Button variant="outline" type="button">
            Hủy
          </Button>
          <Button type="submit">Lưu địa chỉ</Button>
        </div>
      </form>
    </div>
  );
};

export default AddressFormAdd;

