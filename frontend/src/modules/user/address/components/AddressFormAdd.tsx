import { useForm, Controller, useWatch } from "react-hook-form";
import { InputField } from "@/components/common/InputField";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { TextAreaField } from "@/components/common/TextAreaField";
import { Button } from "@/components/common/Button";
import {
  useProvinces,
  useDistricts,
  useWards,
} from "@/modules/others/ghn/hooks/useGhn";
import { useCreateAddress } from "../hooks/useAddress";
import { useNavigate } from "react-router-dom";
import type {
  ProvinceResponse,
  DistrictResponse,
  WardResponse,
} from "@/modules/others/ghn/types/ghn.type";
import type { AddressRequest } from "../types/address.type";
import { showErrorToast } from "@/libs/utils/toastUtil";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/libs/utils/api-response";

type AddressFormAddProps = {
  isPayment?: boolean;
};

const AddressFormAdd = ({ isPayment }: AddressFormAddProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddressRequest>({
    defaultValues: {
      fullName: "",
      phone: "",
      provinceId: null,
      districtId: null,
      wardCode: null,
      street: "",
      defaultAddress: false,
    },
  });

  const provinceId = useWatch({ control, name: "provinceId" });
  const districtId = useWatch({ control, name: "districtId" });

  const { data: provinces = [] } = useProvinces();
  const { data: districts = [] } = useDistricts(
    provinceId ? Number(provinceId) : null,
  );
  const { data: wards = [] } = useWards(districtId ? Number(districtId) : null);

  // Map sang format của SearchableSelect
  const provinceOptions = Array.isArray(provinces)
    ? provinces.map((p: ProvinceResponse) => ({
        label: p.provinceName,
        value: p.provinceId,
      }))
    : [];

  const districtOptions = Array.isArray(districts)
    ? districts.map((d: DistrictResponse) => ({
        label: d.districtName,
        value: d.districtId,
      }))
    : [];

  const wardOptions = Array.isArray(wards)
    ? wards.map((w: WardResponse) => ({
        label: w.wardName,
        value: w.wardCode,
      }))
    : [];

  const navigate = useNavigate();
  const createMutation = useCreateAddress();

  const onSubmit = (data: AddressRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        if (!isPayment) {
          navigate(-1); // Quay lại trang trước đó (danh sách địa chỉ)
        }
      },
      onError: (error) => {
        const axiosError = error as AxiosError<ApiResponse<unknown>>;
        const errorMessage =
          axiosError.response?.data?.message || (error as Error).message;
        showErrorToast(errorMessage || "Có lỗi xảy ra khi thêm.");
      },
    });
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
            {...register("phone", {
              required: "Vui lòng nhập số điện thoại.",
              pattern: {
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                message: "Số điện thoại không hợp lệ.",
              },
            })}
            error={errors.phone?.message}
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
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val ? Number(val) : null);
                  setValue("districtId", null);
                  setValue("wardCode", null);
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
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val ? Number(val) : null);
                  setValue("wardCode", null);
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
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(e.target.value || null);
                }}
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
            {...register("street", {
              required: "Vui lòng nhập địa chỉ cụ thể.",
            })}
            error={errors.street?.message}
          />
        </div>

        {/* Set Default */}
        <div className="col-span-1 md:col-span-12 flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="isDefault"
            className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
            {...register("defaultAddress")}
          />
          <label
            htmlFor="isDefault"
            className="text-sm font-medium text-gray-700 dark:text-zinc-300 cursor-pointer select-none"
          >
            Đặt làm địa chỉ mặc định
          </label>
        </div>

        <div className="col-span-1 md:col-span-12 flex justify-end mt-2 gap-3">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Hủy
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Đang lưu..." : "Lưu địa chỉ"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressFormAdd;
