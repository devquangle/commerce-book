import React, { useMemo, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  MapPin,
  Navigation,
  Home,
  BookmarkCheck,
  CheckCircle2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import type { SelectOption } from "@/components/ui/SelectBox";
import {
  useAddresses,
  useProvinces,
  useDistricts,
  useWards,
  type ProvinceResponse,
  type DistrictResponse,
  type WardResponse,
} from "@/modules/user/address/hooks/useAddress";
import { useAuth } from "@/context/useAuth";
import type { AddressResponse } from "@/modules/user/address/types/address.type";
import type { RegisterShopRequest } from "../types/register-shop.type";

export const StepShopAddress: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    control,
    setValue,
    clearErrors,
    watch,
  } = useFormContext<RegisterShopRequest>();

  const provinceId = Number(watch("provinceId")) || 0;
  const districtId = Number(watch("districtId")) || 0;
  const wardCode = watch("wardCode") || "";
  const street = watch("street") || "";

  // 1. Fetch saved user addresses (CHỈ gọi khi người dùng đã đăng nhập)
  const { data: addresses = [], isLoading: isLoadingAddresses } = useAddresses(isAuthenticated);

  // 2. Fetch administrative regions from GHN
  const { data: provinces = [], isLoading: isLoadingProvinces } = useProvinces();
  const { data: districts = [], isLoading: isLoadingDistricts } = useDistricts(
    provinceId ? Number(provinceId) : null
  );
  const { data: wards = [], isLoading: isLoadingWards } = useWards(
    districtId ? Number(districtId) : null
  );

  // Auto-fill with default address on initial load if form fields are empty (CHỈ áp dụng cho người dùng ĐÃ ĐĂNG NHẬP)
  const isInitializedRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isInitializedRef.current && addresses && addresses.length > 0) {
      if (!provinceId && !street) {
        const defaultAddr = addresses.find((a) => a.defaultAddress) || addresses[0];
        if (defaultAddr && defaultAddr.provinceId) {
          setValue("provinceId", Number(defaultAddr.provinceId), { shouldValidate: true });
          setValue("districtId", Number(defaultAddr.districtId) || 0, { shouldValidate: true });
          setValue("wardCode", defaultAddr.wardCode || "", { shouldValidate: true });
          setValue("street", defaultAddr.street || "", { shouldValidate: true });
        }
      }
      isInitializedRef.current = true;
    }
  }, [isAuthenticated, addresses, provinceId, street, setValue]);

  // Convert regions to SelectBox options
  const provinceOptions: SelectOption[] = useMemo(
    () =>
      Array.isArray(provinces)
        ? provinces.map((p: ProvinceResponse) => ({
            label: p.provinceName,
            value: p.provinceId,
          }))
        : [],
    [provinces]
  );

  const districtOptions: SelectOption[] = useMemo(
    () =>
      Array.isArray(districts)
        ? districts.map((d: DistrictResponse) => ({
            label: d.districtName,
            value: d.districtId,
          }))
        : [],
    [districts]
  );

  const wardOptions: SelectOption[] = useMemo(
    () =>
      Array.isArray(wards)
        ? wards.map((w: WardResponse) => ({
            label: w.wardName,
            value: w.wardCode,
          }))
        : [],
    [wards]
  );

  // Handle selecting a saved address
  const handleSelectSavedAddress = (addr: AddressResponse) => {
    const pid = Number(addr.provinceId) || 0;
    const did = Number(addr.districtId) || 0;
    const wcode = addr.wardCode || "";
    const str = addr.street || "";

    setValue("provinceId", pid, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue("districtId", did, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue("wardCode", wcode, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue("street", str, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    clearErrors(["provinceId", "districtId", "wardCode", "street"]);
  };

  // Reset address to clear fields for manual input
  const handleResetAddress = () => {
    setValue("provinceId", 0, { shouldValidate: false });
    setValue("districtId", 0, { shouldValidate: false });
    setValue("wardCode", "", { shouldValidate: false });
    setValue("street", "", { shouldValidate: false });
    clearErrors(["provinceId", "districtId", "wardCode", "street"]);
  };

  // Full address labels
  const selectedProvinceName = useMemo(() => {
    return provinceOptions.find((p) => Number(p.value) === provinceId)?.label || "";
  }, [provinceOptions, provinceId]);

  const selectedDistrictName = useMemo(() => {
    return districtOptions.find((d) => Number(d.value) === districtId)?.label || "";
  }, [districtOptions, districtId]);

  const selectedWardName = useMemo(() => {
    return wardOptions.find((w) => String(w.value) === String(wardCode))?.label || "";
  }, [wardOptions, wardCode]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Bước 4: Địa chỉ lấy hàng / Kinh doanh của Shop
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Địa chỉ kho sẽ được sử dụng để đối soát vận chuyển và lấy hàng từ các đơn vị giao hàng.
        </p>
      </div>

      {/* Quick Select from Saved Addresses (Chỉ hiển thị khi đã đăng nhập) */}
      {isAuthenticated && (
        isLoadingAddresses ? (
          <div className="flex items-center gap-2 text-zinc-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span>Đang tải sổ địa chỉ của bạn...</span>
          </div>
        ) : addresses.length > 0 ? (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                  Chọn từ sổ địa chỉ của bạn ({addresses.length})
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetAddress}
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nhập địa chỉ mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {addresses.map((addr) => {
                const isSelected =
                  provinceId === Number(addr.provinceId) &&
                  districtId === Number(addr.districtId) &&
                  wardCode === addr.wardCode &&
                  street === addr.street;

                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleSelectSavedAddress(addr)}
                    className={`p-3 rounded-lg border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-500"
                        : "border-zinc-200 dark:border-zinc-700/80 hover:border-blue-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">
                            {addr.fullName}
                          </span>
                          <span className="text-xs text-zinc-400">|</span>
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">
                            {addr.phone}
                          </span>
                          {addr.defaultAddress && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2">
                          {addr.streetFull || addr.street}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Province */}
        <div className="flex-1">
          <FormSelect
            name="provinceId"
            control={control}
            label="Tỉnh / Thành phố"
            required
            searchable
            searchPlaceholder="Tìm Tỉnh / Thành..."
            options={provinceOptions}
            placeholder={
              isLoadingProvinces
                ? "Đang tải Tỉnh / Thành..."
                : "Chọn Tỉnh / Thành phố"
            }
            disabled={isLoadingProvinces}
            rules={{
              required: "Vui lòng chọn Tỉnh / Thành phố",
              validate: (v) => Number(v) > 0 || "Vui lòng chọn Tỉnh / Thành phố",
            }}
            onValueChange={(val) => {
              const pid = Number(val) || 0;
              setValue("provinceId", pid, { shouldValidate: true, shouldDirty: true });
              setValue("districtId", 0, { shouldValidate: false, shouldDirty: true });
              setValue("wardCode", "", { shouldValidate: false, shouldDirty: true });
              clearErrors(["provinceId", "districtId", "wardCode"]);
            }}
            textClassName="body-text"
          />
        </div>

        {/* District */}
        <div className="flex-1">
          <FormSelect
            name="districtId"
            control={control}
            label="Quận / Huyện"
            required
            searchable
            searchPlaceholder="Tìm Quận / Huyện..."
            disabled={!provinceId || isLoadingDistricts}
            options={districtOptions}
            placeholder={
              isLoadingDistricts
                ? "Đang tải Quận / Huyện..."
                : provinceId
                ? "Chọn Quận / Huyện"
                : "Hãy chọn Tỉnh/Thành trước"
            }
            rules={{
              required: "Vui lòng chọn Quận / Huyện",
              validate: (v) => Number(v) > 0 || "Vui lòng chọn Quận / Huyện",
            }}
            onValueChange={(val) => {
              const did = Number(val) || 0;
              setValue("districtId", did, { shouldValidate: true, shouldDirty: true });
              setValue("wardCode", "", { shouldValidate: false, shouldDirty: true });
              clearErrors(["districtId", "wardCode"]);
            }}
            textClassName="body-text"
          />
        </div>

        {/* Ward */}
        <div className="flex-1">
          <FormSelect
            name="wardCode"
            control={control}
            label="Phường / Xã"
            required
            searchable
            searchPlaceholder="Tìm Phường / Xã..."
            disabled={!districtId || isLoadingWards}
            options={wardOptions}
            placeholder={
              isLoadingWards
                ? "Đang tải Phường / Xã..."
                : districtId
                ? "Chọn Phường / Xã"
                : "Hãy chọn Quận/Huyện trước"
            }
            rules={{
              required: "Vui lòng chọn Phường / Xã",
              validate: (v) => Boolean(v && String(v).trim()) || "Vui lòng chọn Phường / Xã",
            }}
            onValueChange={(val) => {
              const wcode = String(val || "").trim();
              setValue("wardCode", wcode, { shouldValidate: true, shouldDirty: true });
              if (wcode) {
                clearErrors("wardCode");
              }
            }}
            textClassName="body-text"
          />
        </div>
      </div>

      {/* Street address */}
      <FormInput
        name="street"
        control={control}
        label="Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà...)"
        placeholder="Ví dụ: Số 45 Đường Nguyễn Huệ, Tòa nhà Bitexco..."
        required
        icon={<Home className="w-4 h-4 text-zinc-400" />}
        rules={{
          required: "Vui lòng nhập số nhà, tên đường chi tiết",
        }}
        helperText="Địa chỉ chính xác giúp shipper tìm vị trí kho lấy hàng dễ dàng hơn"
        className="body-text"
      />

      {/* Summary box of full address */}
      {provinceId > 0 && districtId > 0 && wardCode && street && (
        <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl flex items-start gap-2.5">
          <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
              Địa chỉ lấy hàng đầy đủ:
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mt-0.5">
              {street}
              {selectedWardName ? `, ${selectedWardName}` : ""}
              {selectedDistrictName ? `, ${selectedDistrictName}` : ""}
              {selectedProvinceName ? `, ${selectedProvinceName}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

