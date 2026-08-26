import { MapPin, Navigation } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { SelectBox } from "@/components/ui/SelectBox";

const MOCK_PROVINCES = [
  { value: 1, label: "Hà Nội" },
  { value: 2, label: "TP. Hồ Chí Minh" },
  { value: 3, label: "Đà Nẵng" },
  { value: 4, label: "Cần Thơ" },
];

const MOCK_DISTRICTS = [
  { value: 1, label: "Quận 1" },
  { value: 2, label: "Quận 3" },
  { value: 3, label: "Bình Thạnh" },
];

const MOCK_WARDS = [
  { value: "001", label: "Phường Bến Nghé" },
  { value: "002", label: "Phường Bến Thành" },
  { value: "003", label: "Phường Cầu Ông Lãnh" },
];

export const StoreAddress = () => {
  return (
    <div className="card-custom">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
          <MapPin size={17} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">Địa chỉ cửa hàng</h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            Địa chỉ sẽ được dùng để tính phí vận chuyển
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tỉnh / Thành phố */}
        <SelectBox searchable
          label="Tỉnh / Thành phố"
          options={MOCK_PROVINCES}
          value={2}
          placeholder="Chọn tỉnh / thành phố..."
          required
        />

        {/* Quận / Huyện */}
        <SelectBox searchable
          label="Quận / Huyện"
          options={MOCK_DISTRICTS}
          value={1}
          placeholder="Chọn quận / huyện..."
          required
        />

        {/* Phường / Xã */}
        <SelectBox searchable
          label="Phường / Xã"
          options={MOCK_WARDS}
          value="001"
          placeholder="Chọn phường / xã..."
          required
        />

        {/* Số nhà, tên đường */}
        <InputField
          label="Số nhà, tên đường"
          placeholder="VD: 123 Nguyễn Huệ"
          defaultValue="45 Lê Lợi"
          required
        />
      </div>

      {/* Full address preview */}
      <div className="mt-4 flex items-start gap-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-3 border border-zinc-200/60 dark:border-zinc-700/60">
        <Navigation size={13} className="shrink-0 mt-0.5 text-zinc-400" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Địa chỉ đầy đủ: </span>
          45 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
        </p>
      </div>
    </div>
  );
};
