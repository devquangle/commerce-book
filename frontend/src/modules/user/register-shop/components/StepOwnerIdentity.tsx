import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { User, CreditCard, Calendar, MapPin, Camera, ShieldCheck, CheckCircle } from "lucide-react";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/common/Button";
import SingleImageUpload from "@/components/common/SingleImageUpload";
import { CameraModal } from "./CameraModal";
import type { RegisterShopRequest } from "../types/register-shop.type";

export const StepOwnerIdentity: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterShopRequest>();

  const [frontCccdFile, setFrontCccdFile] = useState<File | null>(null);
  const [frontCccdUrl, setFrontCccdUrl] = useState<string>("");

  const [backCccdFile, setBackCccdFile] = useState<File | null>(null);
  const [backCccdUrl, setBackCccdUrl] = useState<string>("");

  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [faceImage, setFaceImage] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Bước 2: Thông tin định danh chủ sở hữu
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Nhập đầy đủ và chính xác thông tin cá nhân ghi trên CCCD/CMND để xác thực.
        </p>
      </div>

      {/* 1. Div Col 6 6: Chọn ảnh CCCD mặt trước & mặt sau */}
      <div className="space-y-2">
        <label className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Hình ảnh Căn cước công dân (Mặt trước & Mặt sau) <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Col 6 Left: CCCD Mặt trước */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/60 space-y-2">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-500" /> Ảnh CCCD Mặt trước
            </p>
            <SingleImageUpload
              file={frontCccdFile}
              setFile={setFrontCccdFile}
              avatarUrl={frontCccdUrl}
              setAvatarUrl={setFrontCccdUrl}
            />
          </div>

          {/* Col 6 Right: CCCD Mặt sau */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/60 space-y-2">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-500" /> Ảnh CCCD Mặt sau
            </p>
            <SingleImageUpload
              file={backCccdFile}
              setFile={setBackCccdFile}
              avatarUrl={backCccdUrl}
              setAvatarUrl={setBackCccdUrl}
            />
          </div>
        </div>
      </div>

      {/* 2. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <Button
          type="button"
          variant={faceImage ? "outline" : "outline"}
          fullWidth
          icon={<Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          onClick={() => setIsCameraOpen(true)}
        >
          {faceImage ? "Chụp lại ảnh khuôn mặt (Camera)" : "Mở camera xác thực khuôn mặt"}
        </Button>

        <Button
          type="button"
          variant="primary"
          fullWidth
          icon={<ShieldCheck className="w-4 h-4" />}
          onClick={() => alert("Đang tự động trích xuất thông tin từ CCCD...")}
        >
          Xác thực Căn cước công dân
        </Button>
      </div>

      {/* Face Image Verification Badge */}
      {faceImage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={faceImage}
              alt="Khuôn mặt đã chụp"
              className="w-12 h-12 rounded-lg object-cover border border-emerald-300"
            />
            <div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Đã xác thực khuôn mặt bằng Camera
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Ảnh đã được lưu và sẵn sàng đối soát với CCCD.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-xs text-rose-600 hover:underline font-medium"
            onClick={() => setFaceImage(null)}
          >
            Xóa ảnh
          </button>
        </div>
      )}

      {/* 3. Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        {/* Full Name */}
        <InputField
          label="Họ và tên chủ sở hữu"
          placeholder="NGUYEN VAN A"
          required
          icon={<User className="w-4 h-4 text-zinc-400" />}
          {...register("fullName", {
            required: "Vui lòng nhập họ và tên chủ sở hữu",
          })}
          error={errors.fullName?.message}
          helperText="Ghi in hoa không dấu hoặc đúng với trên CCCD"
          className="body-text"
        />

        {/* CCCD */}
        <InputField
          label="Số CCCD / CMND"
          placeholder="012345678912"
          required
          icon={<CreditCard className="w-4 h-4 text-zinc-400" />}
          {...register("cccd", {
            required: "Vui lòng nhập số CCCD / CMND",
            pattern: {
              value: /^[0-9]{9,12}$/,
              message: "Số CCCD/CMND gồm từ 9 đến 12 chữ số",
            },
          })}
          error={errors.cccd?.message}
          helperText="Số Căn cước công dân gồm 12 chữ số"
          className="body-text"
        />

        {/* Date of Birth */}
        <InputField
          label="Ngày sinh"
          type="date"
          required
          icon={<Calendar className="w-4 h-4 text-zinc-400" />}
          {...register("dob", {
            required: "Vui lòng chọn ngày sinh",
          })}
          error={errors.dob?.message}
          className="body-text"
        />

        {/* Sex */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-6 py-2.5 px-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl h-[46px]">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              <input
                type="radio"
                value="Nam"
                {...register("sex", {
                  required: "Vui lòng chọn giới tính",
                })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              Nam
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              <input
                type="radio"
                value="Nữ"
                {...register("sex", {
                  required: "Vui lòng chọn giới tính",
                })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              Nữ
            </label>
          </div>
          {errors.sex?.message && (
            <p className="text-xs text-red-500 font-medium">{errors.sex.message}</p>
          )}
        </div>

        {/* Issue Date */}
        <InputField
          label="Ngày cấp CCCD"
          type="date"
          required
          icon={<Calendar className="w-4 h-4 text-zinc-400" />}
          {...register("issueDate", {
            required: "Vui lòng chọn ngày cấp CCCD",
          })}
          error={errors.issueDate?.message}
          className="body-text"
        />

        {/* Expiry Date */}
        <InputField
          label="Ngày hết hạn CCCD"
          type="date"
          icon={<Calendar className="w-4 h-4 text-zinc-400" />}
          {...register("expiryDate")}
          error={errors.expiryDate?.message}
          helperText="Bỏ trống nếu không thời hạn"
          className="body-text"
        />

        {/* Address: Full Width (col-12) */}
        <InputField
          label="Địa chỉ thường trú (trên CCCD)"
          placeholder="Số 123 Đường ABC, Phường X, Quận Y, Tỉnh Z"
          required
          icon={<MapPin className="w-4 h-4 text-zinc-400" />}
          {...register("address", {
            required: "Vui lòng nhập địa chỉ thường trú",
          })}
          error={errors.address?.message}
          containerClassName="col-span-1 md:col-span-2"
          className="body-text"
        />
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCaptureSuccess={(imgSrc) => {
          setFaceImage(imgSrc);
        }}
      />
    </div>
  );
};
