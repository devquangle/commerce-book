import { useState } from "react";
import {
  X,
  Store,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { AdminShopDetailResponse } from "../../modules/admin/stores/types/store.type";
import { getShopStatusInfo } from "../../modules/admin/stores/types/store-status.type";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface StoreDetailModalProps {
  isOpen: boolean;
  store: AdminShopDetailResponse | null;
  isLoading?: boolean;
  onClose: () => void;
  onApprove: (store: AdminShopDetailResponse) => void;
  onReject: (store: AdminShopDetailResponse) => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({
  isOpen,
  store,
  isLoading = false,
  onClose,
  onApprove,
  onReject,
}) => {
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);

  if (!isOpen) return null;

  const statusInfo = store ? getShopStatusInfo(store.status) : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50/50 dark:bg-zinc-850/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/50 dark:border-blue-900/50">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {store?.name || "Chi tiết hồ sơ gian hàng"}
                  </h2>
                  {statusInfo && <Badge title={statusInfo.label} variant={statusInfo.color} />}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Mã ID: #{store?.id} • Slug: /{store?.slug}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex flex-col gap-6">
            {isLoading || !store ? (
              <div className="py-20 text-center text-zinc-400">Đang tải thông tin hồ sơ...</div>
            ) : (
              <>
                {/* Rejection Alert if rejected */}
                {store.status === "REJECTED" && store.reason && (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                        Gian hàng này đã bị từ chối phê duyệt
                      </h4>
                      <p className="text-xs text-rose-700 dark:text-rose-300 whitespace-pre-line leading-relaxed">
                        {store.reason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Grid 2 Cột: Thông tin gian hàng & Tài khoản ngân hàng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Thông tin gian hàng */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-850/30 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
                      <Store className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Thông tin cửa hàng</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xl">
                          {store.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                          {store.name}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Năm thành lập: {store.year || "N/A"} • Đánh giá: {store.rating || 0} ⭐
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                          Ngày tạo: {store.createdAt ? new Date(store.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                        </p>
                      </div>
                    </div>

                    {store.description && (
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800 leading-relaxed">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">Mô tả:</span>{" "}
                        {store.description}
                      </div>
                    )}

                    {/* Địa chỉ kho hàng */}
                    <div className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          Kho hàng / Điểm lấy hàng GHN:
                        </span>
                        <p className="mt-0.5 leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {store.streetFull || store.street || "Chưa thiết lập địa chỉ lấy hàng"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Tài khoản thụ hưởng ngân hàng */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-850/30 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
                      <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Tài khoản ngân hàng thụ hưởng</span>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-4 text-white shadow-md flex flex-col justify-between h-40">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-emerald-100 uppercase tracking-wider">Ngân hàng thụ hưởng</p>
                          <h4 className="font-bold text-base mt-0.5">{store.bankName || "Chưa cập nhật"}</h4>
                        </div>
                        <CreditCard className="w-7 h-7 text-emerald-200/60" />
                      </div>

                      <div>
                        <p className="text-[10px] text-emerald-100 uppercase tracking-wider">Số tài khoản</p>
                        <p className="font-mono text-lg font-bold tracking-widest mt-0.5">
                          {store.bankNumber || "•••• •••• ••••"}
                        </p>
                      </div>

                      <div className="flex justify-between items-end border-t border-emerald-500/50 pt-1.5">
                        <div>
                          <p className="text-[9px] text-emerald-200 uppercase">Chủ tài khoản</p>
                          <p className="text-xs font-semibold uppercase">{store.ownerName || "N/A"}</p>
                        </div>
                        <span className="text-[10px] bg-emerald-800/60 px-2 py-0.5 rounded text-emerald-200">
                          Chính chủ
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-1">
                      ⚠️ Đối soát tên chủ tài khoản ngân hàng thụ hưởng với họ tên định danh trên CCCD của chủ gian hàng.
                    </div>
                  </div>
                </div>

                {/* Card 3: Hồ sơ Định danh Chủ sở hữu & eKYC */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-850/30 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Hồ sơ định danh chủ sở hữu (eKYC)</span>
                    </div>

                    {store.ekycVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Đã xác thực eKYC
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Chưa đối soát eKYC
                      </span>
                    )}
                  </div>

                  {/* Thông tin văn bản eKYC */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-400">Họ và tên:</span>
                      <p className="font-bold text-zinc-900 dark:text-white mt-0.5">
                        {store.fullName || "Chưa cập nhật"}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-400">Số CCCD / CMND:</span>
                      <p className="font-bold font-mono text-zinc-900 dark:text-white mt-0.5">
                        {store.identityNumber || "Chưa cập nhật"}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-400">Ngày sinh:</span>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                        {store.dateOfBirth || "N/A"}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-400">Giới tính & Quốc tịch:</span>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                        {store.gender || "N/A"} • {store.nationality || "Việt Nam"}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-400">Số điện thoại liên hệ:</span>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-zinc-400" />
                        {store.phone || "N/A"}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-400">Email tài khoản:</span>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate">{store.email || "N/A"}</span>
                      </p>
                    </div>

                    <div className="col-span-full bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-400">Địa chỉ thường trú (theo CCCD):</span>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                        {store.permanentAddress || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  {/* 3 Ảnh đối soát CCCD & Khuôn mặt */}
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Ảnh giấy tờ định danh & Khuôn mặt (Click vào ảnh để phóng to kiểm tra):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Ảnh mặt trước */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          1. CCCD Mặt trước
                        </span>
                        {store.cccdFrontUrl ? (
                          <div
                            onClick={() =>
                              setZoomImage({
                                url: store.cccdFrontUrl!,
                                title: "Ảnh mặt trước CCCD",
                              })
                            }
                            className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 cursor-pointer shadow-sm"
                          >
                            <img
                              src={store.cccdFrontUrl}
                              alt="CCCD Mặt trước"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-semibold">
                              <ZoomIn className="w-4 h-4" /> Phóng to
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 aspect-[16/10] flex items-center justify-center text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-800/30">
                            Chưa có ảnh mặt trước
                          </div>
                        )}
                      </div>

                      {/* Ảnh mặt sau */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          2. CCCD Mặt sau
                        </span>
                        {store.cccdBackUrl ? (
                          <div
                            onClick={() =>
                              setZoomImage({
                                url: store.cccdBackUrl!,
                                title: "Ảnh mặt sau CCCD",
                              })
                            }
                            className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 cursor-pointer shadow-sm"
                          >
                            <img
                              src={store.cccdBackUrl}
                              alt="CCCD Mặt sau"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-semibold">
                              <ZoomIn className="w-4 h-4" /> Phóng to
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 aspect-[16/10] flex items-center justify-center text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-800/30">
                            Chưa có ảnh mặt sau
                          </div>
                        )}
                      </div>

                      {/* Ảnh selfie khuôn mặt */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          3. Ảnh selfie chân dung
                        </span>
                        {store.faceImageUrl ? (
                          <div
                            onClick={() =>
                              setZoomImage({
                                url: store.faceImageUrl!,
                                title: "Ảnh selfie khuôn mặt đối soát",
                              })
                            }
                            className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 cursor-pointer shadow-sm"
                          >
                            <img
                              src={store.faceImageUrl}
                              alt="Ảnh Selfie Chân dung"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-semibold">
                              <ZoomIn className="w-4 h-4" /> Phóng to
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 aspect-[16/10] flex items-center justify-center text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-800/30">
                            Chưa có ảnh chân dung
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50/50 dark:bg-zinc-850/50">
            <Button variant="outline" onClick={onClose} className="cursor-pointer">
              Đóng
            </Button>

            <div className="flex items-center gap-3">
              {store && store.status === "PENDING" && (
                <Button
                  variant="outline"
                  onClick={() => onReject(store)}
                  icon={<XCircle className="w-4 h-4 text-rose-600" />}
                  className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40 cursor-pointer"
                >
                  Từ chối duyệt
                </Button>
              )}

              {store && store.status !== "ACTIVE" && (
                <Button
                  variant="primary"
                  onClick={() => onApprove(store)}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  Phê duyệt gian hàng
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Image Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-zinc-900 rounded-2xl overflow-hidden p-2 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between px-3 py-2 text-white text-sm font-semibold border-b border-zinc-800">
              <span>{zoomImage.title}</span>
              <button
                onClick={() => setZoomImage(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-full bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={zoomImage.url}
              alt={zoomImage.title}
              className="max-h-[80vh] w-auto object-contain rounded-lg mt-2"
            />
          </div>
        </div>
      )}
    </>
  );
};
