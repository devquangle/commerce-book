import { Store } from "lucide-react";
import { InputField } from "@/components/ui/InputField";

export const StoreInfo = () => {
  return (
    <div className="card-custom">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
          <Store size={17} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">Thông tin cửa hàng</h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            Thông tin cơ bản hiển thị cho khách hàng
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tên cửa hàng */}
        <InputField
          label="Tên cửa hàng"
          placeholder="VD: Sách Tuổi Thơ"
          defaultValue="Sách Tuổi Thơ"
          required
          icon={<Store size={15} />}
          containerClassName="sm:col-span-2"
        />

       
      </div>

      {/* URL preview */}
      <div className="mt-4 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-2.5 border border-zinc-200/60 dark:border-zinc-700/60">
        <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">URL:</span>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono truncate">
          bookstore.vn/shops/<span className="font-bold">sach-tuoi-tho</span>
        </span>
      </div>
    </div>
  );
};
