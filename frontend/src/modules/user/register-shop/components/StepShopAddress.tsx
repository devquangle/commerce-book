import React, { useMemo } from "react";
import { MapPin, Navigation, Home } from "lucide-react";
import { InputField } from "@/components/common/InputField";
import { SelectBox } from "@/components/common/SelectBox";
import type { ShopAddressInfo } from "../types/register-shop.type";

export interface StepShopAddressProps {
  data: ShopAddressInfo;
  onChange: (fields: Partial<ShopAddressInfo>) => void;
  errors: Record<string, string>;
}

// Administrative address datasets
const PROVINCES = [
  { id: 1, name: "TP. Hồ Chí Minh" },
  { id: 2, name: "TP. Hà Nội" },
  { id: 3, name: "TP. Đà Nẵng" },
  { id: 4, name: "Tỉnh Bình Dương" },
  { id: 5, name: "TP. Cần Thơ" },
  { id: 6, name: "Tỉnh Đồng Nai" },
  { id: 7, name: "Tỉnh Hải Phòng" },
];

const DISTRICTS_MAP: Record<number, Array<{ id: number; name: string }>> = {
  1: [
    { id: 101, name: "Quận 1" },
    { id: 102, name: "Quận 3" },
    { id: 103, name: "Quận 7" },
    { id: 104, name: "Thành phố Thủ Đức" },
    { id: 105, name: "Quận Bình Thạnh" },
    { id: 106, name: "Quận Tân Bình" },
  ],
  2: [
    { id: 201, name: "Quận Ba Đình" },
    { id: 202, name: "Quận Hoàn Kiếm" },
    { id: 203, name: "Quận Cầu Giấy" },
    { id: 204, name: "Quận Đống Đa" },
    { id: 205, name: "Quận Hai Bà Trưng" },
  ],
  3: [
    { id: 301, name: "Quận Hải Châu" },
    { id: 302, name: "Quận Thanh Khê" },
    { id: 303, name: "Quận Sơn Trà" },
  ],
  4: [
    { id: 401, name: "TP. Thủ Dầu Một" },
    { id: 402, name: "TP. Thuận An" },
    { id: 403, name: "TP. Dĩ An" },
  ],
  5: [
    { id: 501, name: "Quận Ninh Kiều" },
    { id: 502, name: "Quận Bình Thủy" },
  ],
  6: [
    { id: 601, name: "TP. Biên Hòa" },
    { id: 602, name: "TP. Long Khánh" },
  ],
  7: [
    { id: 701, name: "Quận Hồng Bàng" },
    { id: 702, name: "Quận Ngô Quyền" },
  ],
};

const WARDS_MAP: Record<number, Array<{ code: string; name: string }>> = {
  101: [
    { code: "W10101", name: "Phường Bến Nghé" },
    { code: "W10102", name: "Phường Bến Thành" },
    { code: "W10103", name: "Phường Tân Định" },
    { code: "W10104", name: "Phường Phạm Ngũ Lão" },
  ],
  102: [
    { code: "W10201", name: "Phường Võ Thị Sáu" },
    { code: "W10202", name: "Phường 1" },
    { code: "W10203", name: "Phường 2" },
  ],
  103: [
    { code: "W10301", name: "Phường Tân Phong" },
    { code: "W10302", name: "Phường Tân Quy" },
  ],
  104: [
    { code: "W10401", name: "Phường Thảo Điền" },
    { code: "W10402", name: "Phường An Phú" },
    { code: "W10403", name: "Phường Linh Trung" },
  ],
  105: [
    { code: "W10501", name: "Phường 25" },
    { code: "W10502", name: "Phường 26" },
  ],
  201: [
    { code: "W20101", name: "Phường Điện Biên" },
    { code: "W20102", name: "Phường Kim Mã" },
  ],
  203: [
    { code: "W20301", name: "Phường Dịch Vọng" },
    { code: "W20302", name: "Phường Yên Hòa" },
  ],
};

export const StepShopAddress: React.FC<StepShopAddressProps> = ({
  data,
  onChange,
  errors,
}) => {
  // Convert provinces to select options
  const provinceOptions = useMemo(
    () => PROVINCES.map((p) => ({ label: p.name, value: p.id })),
    []
  );

  // Filter districts based on selected provinceId
  const districtOptions = useMemo(() => {
    if (!data.provinceId) return [];
    const list = DISTRICTS_MAP[data.provinceId] || [];
    return list.map((d) => ({ label: d.name, value: d.id }));
  }, [data.provinceId]);

  // Filter wards based on selected districtId
  const wardOptions = useMemo(() => {
    if (!data.districtId) return [];
    const list = WARDS_MAP[data.districtId] || [
      { code: `W${data.districtId}01`, name: "Phường Trung Tâm" },
      { code: `W${data.districtId}02`, name: "Phường Tân Tiến" },
    ];
    return list.map((w) => ({ label: w.name, value: w.code }));
  }, [data.districtId]);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Province */}
        <SelectBox
          label="Tỉnh / Thành phố"
          required
          options={provinceOptions}
          placeholder="Chọn Tỉnh / Thành phố"
          value={data.provinceId || ""}
          onChange={(e) => {
            const pid = Number(e.target.value);
            onChange({
              provinceId: pid,
              districtId: 0,
              wardCode: "",
            });
          }}
          error={errors.provinceId}
        />

        {/* District */}
        <SelectBox
          label="Quận / Huyện"
          required
          disabled={!data.provinceId}
          options={districtOptions}
          placeholder={data.provinceId ? "Chọn Quận / Huyện" : "Hãy chọn Tỉnh/Thành trước"}
          value={data.districtId || ""}
          onChange={(e) => {
            const did = Number(e.target.value);
            onChange({
              districtId: did,
              wardCode: "",
            });
          }}
          error={errors.districtId}
        />

        {/* Ward */}
        <SelectBox
          label="Phường / Xã"
          required
          disabled={!data.districtId}
          options={wardOptions}
          placeholder={data.districtId ? "Chọn Phường / Xã" : "Hãy chọn Quận/Huyện trước"}
          value={data.wardCode || ""}
          onChange={(e) => onChange({ wardCode: e.target.value })}
          error={errors.wardCode}
        />
      </div>

      {/* Street address */}
      <InputField
        label="Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà...)"
        placeholder="Ví dụ: Số 45 Đường Nguyễn Huệ, Tòa nhà Bitexco..."
        required
        icon={<Home className="w-4 h-4 text-zinc-400" />}
        value={data.street || ""}
        onChange={(e) => onChange({ street: e.target.value })}
        error={errors.street}
        helperText="Địa chỉ chính xác giúp shiper tìm vị trí kho lấy hàng dễ dàng hơn"
      />

      {/* Summary box of full address */}
      {data.provinceId && data.districtId && data.wardCode && data.street && (
        <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl flex items-start gap-2.5">
          <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
              Địa chỉ lấy hàng đầy đủ:
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mt-0.5">
              {data.street},{" "}
              {wardOptions.find((w) => w.value === data.wardCode)?.label},{" "}
              {districtOptions.find((d) => Number(d.value) === data.districtId)?.label},{" "}
              {provinceOptions.find((p) => Number(p.value) === data.provinceId)?.label}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
