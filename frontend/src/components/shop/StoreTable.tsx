import React, { useState } from "react";
import {
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { Tooltip } from "@/components/ui/Tooltip";
import type { AdminShopResponse } from "../../modules/admin/stores/types/store.type";
import { getShopStatusInfo } from "../../modules/admin/stores/types/store-status.type";

interface StoreTableProps {
  stores: AdminShopResponse[];
  page?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onView: (id: number) => void;
  onApprove: (store: AdminShopResponse) => void;
  onReject: (store: AdminShopResponse) => void;
}

const StoreReasonCollapse: React.FC<{ reason: string }> = ({ reason }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1 mt-1 max-w-xs">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 border border-rose-200/80 dark:border-rose-900/50 px-2 py-0.5 rounded-lg transition-all duration-200 cursor-pointer w-fit select-none active:scale-95"
      >
        <AlertCircle size={12} className="shrink-0 text-rose-500" />
        <span>{isOpen ? "Thu gọn lý do" : "Xem lý do từ chối"}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 mt-0.5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 px-2.5 py-1.5 rounded-lg leading-relaxed whitespace-pre-line">
            {reason}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StoreTable: React.FC<StoreTableProps> = ({
  stores,
  page = 1,
  pageSize = 10,
  totalElements = 0,
  totalPages,
  onPageChange,
  onView,
  onApprove,
  onReject,
}) => {
  const computedTotalPages = totalPages ?? Math.ceil(totalElements / pageSize);

  if (stores.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy gian hàng nào"
        description="Chưa có gian hàng nào phù hợp với điều kiện tìm kiếm hoặc bộ lọc hiện tại."
      />
    );
  }

  return (
    <div className="card-custom p-0 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-850/50 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Cửa hàng</th>
              <th className="py-3.5 px-4">Chủ sở hữu</th>
              <th className="py-3.5 px-4">Tài khoản thụ hưởng</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4">Ngày đăng ký</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
            {stores.map((store) => {
              const statusInfo = getShopStatusInfo(store.status);
              return (
                <tr
                  key={store.id}
                  className="hover:bg-zinc-50/70 dark:hover:bg-zinc-850/40 transition-colors"
                >
                  {/* Cột 1: Thông tin Cửa hàng */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center font-bold shrink-0">
                          {store.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-white block">
                          {store.name}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 block">
                          /{store.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Cột 2: Chủ sở hữu */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {store.ownerFullName || "Chưa cập nhật"}
                      </span>
                      {store.ownerPhone && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-zinc-400" />
                          {store.ownerPhone}
                        </span>
                      )}
                      {store.ownerEmail && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 truncate max-w-[180px]">
                          <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span className="truncate">{store.ownerEmail}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Cột 3: Ngân hàng */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">
                        {store.bankName || "Chưa cập nhật"}
                      </span>
                      <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                        {store.bankNumber || "•••• ••••"}
                      </span>
                      <span className="text-[11px] text-zinc-400 uppercase">
                        {store.ownerName}
                      </span>
                    </div>
                  </td>

                  {/* Cột 4: Trạng thái & Lý do */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col items-start gap-1">
                      <Badge title={statusInfo.label} variant={statusInfo.color} />
                      {store.status === "REJECTED" && store.reason && (
                        <StoreReasonCollapse reason={store.reason} />
                      )}
                    </div>
                  </td>

                  {/* Cột 5: Ngày tạo */}
                  <td className="py-3.5 px-4 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {store.createdAt
                      ? new Date(store.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </td>

                  {/* Cột 6: Thao tác */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Xem chi tiết */}
                      <Tooltip content="Xem hồ sơ eKYC">
                        <button
                          onClick={() => onView(store.id)}
                          className="p-1.5 text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Tooltip>

                      {/* Duyệt nhanh (nếu PENDING hoặc REJECTED) */}
                      {store.status !== "ACTIVE" && (
                        <Tooltip content="Phê duyệt gian hàng">
                          <button
                            onClick={() => onApprove(store)}
                            className="p-1.5 text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      )}

                      {/* Từ chối (nếu PENDING) */}
                      {store.status === "PENDING" && (
                        <Tooltip content="Từ chối duyệt">
                          <button
                            onClick={() => onReject(store)}
                            className="p-1.5 text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {computedTotalPages > 1 && (
        <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <Pagination
            currentPage={page}
            totalPages={computedTotalPages}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  );
};
