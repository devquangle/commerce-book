import { Phone, Eye, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { AdminShopResponse } from "../../modules/admin/stores/types/store.type";
import { getShopStatusInfo } from "../../modules/admin/stores/types/store-status.type";

interface StoreMobileCardProps {
  store: AdminShopResponse;
  onView: (id: number) => void;
  onApprove: (store: AdminShopResponse) => void;
  onReject: (store: AdminShopResponse) => void;
}

export const StoreMobileCard: React.FC<StoreMobileCardProps> = ({
  store,
  onView,
  onApprove,
  onReject,
}) => {
  const statusInfo = getShopStatusInfo(store.status);

  return (
    <div className="card-custom p-4 flex flex-col gap-3">
      {/* Header card: Logo, Name, Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {store.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={store.name}
              className="w-12 h-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center font-bold text-lg shrink-0">
              {store.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base leading-tight">
              {store.name}
            </h3>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">/{store.slug}</span>
          </div>
        </div>

        <Badge title={statusInfo.label} variant={statusInfo.color} />
      </div>

      {/* Thông tin chủ sở hữu & ngân hàng */}
      <div className="bg-zinc-50 dark:bg-zinc-850/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 text-xs flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Chủ sở hữu:</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {store.ownerFullName || "Chưa cập nhật"}
          </span>
        </div>
        {store.ownerPhone && (
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Số điện thoại:</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {store.ownerPhone}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Ngân hàng:</span>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {store.bankName} - {store.bankNumber}
          </span>
        </div>
      </div>

      {/* Lý do từ chối nếu có */}
      {store.status === "REJECTED" && store.reason && (
        <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
          <span className="font-semibold">Lý do từ chối:</span> {store.reason}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => onView(store.id)}
          className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Hồ sơ eKYC</span>
        </button>

        {store.status === "PENDING" && (
          <button
            onClick={() => onReject(store)}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Từ chối</span>
          </button>
        )}

        {store.status !== "ACTIVE" && (
          <button
            onClick={() => onApprove(store)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Duyệt</span>
          </button>
        )}
      </div>
    </div>
  );
};
