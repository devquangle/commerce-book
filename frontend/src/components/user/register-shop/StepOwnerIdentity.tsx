import React, { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import {
  User,
  CreditCard,
  Calendar,
  MapPin,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Globe,
  Camera,
} from "lucide-react";
import axios from "axios";
import { FormInput } from "@/components/common/FormInput";
import SingleImageUpload from "@/components/common/SingleImageUpload";
import { CameraModal } from "./CameraModal";
import type { RegisterShopRequest } from "@/modules/user/register-shop/types/register-shop.type";
import { useVerifyEkyc } from "@/modules/others/ekyc/hooks/useEkyc";
import UploadImageService from "@/services/cloudinary/services/cloudinary.service";

// ---- helpers ---------------------------------------------------------------

/** Chuyển "15/08/1990" hoặc "1990-08-15" → "1990-08-15" (yyyy-MM-dd cho input type=date) */
const toInputDate = (raw: string): string => {
  if (!raw) return "";
  const cleaned = raw.trim();
  // Nếu đã đúng chuẩn ISO yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }
  // Tách ngày tháng năm theo các dấu phân cách thông dụng / - .
  const parts = cleaned.split(/[/.-]/);
  if (parts.length === 3) {
    // TH1: yyyy/MM/dd hoặc yyyy-MM-dd
    if (parts[0].length === 4) {
      const [yyyy, mm, dd] = parts;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
    // TH2: dd/MM/yyyy hoặc dd-MM-yyyy
    if (parts[2].length === 4) {
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
  }
  return "";
};

/** Chuẩn hóa giới tính về "Nam" | "Nữ" */
const normalizeSex = (raw: string): "Nam" | "Nữ" => {
  if (!raw) return "Nam";
  const lower = raw.trim().toLowerCase();
  if (lower.includes("nữ") || lower.includes("nu") || lower === "female" || lower === "f") {
    return "Nữ";
  }
  return "Nam";
};


// ---- component --------------------------------------------------------------

export const StepOwnerIdentity: React.FC = () => {
  const ekycMutation = useVerifyEkyc();

  const {
    control,
    register,
    setValue,
    watch,
  } = useFormContext<RegisterShopRequest>();

  // CCCD ảnh mặt trước & mặt sau (chỉ dùng File, không dùng URL)
  const [frontCccdFile, setFrontCccdFile] = useState<File | null>(null);
  const [backCccdFile, setBackCccdFile] = useState<File | null>(null);

  // Xác thực khuôn mặt - chụp bằng Camera
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [faceVideoBlob, setFaceVideoBlob] = useState<Blob | null>(null);

  // Lấy trực tiếp từ ekycMutation
  const {
    isPending: isEkycLoading,
    isSuccess: isEkycSuccess,
    isError: isEkycError,
    data: ekycResult,
    error: ekycMutationError,
  } = ekycMutation;

  const ekycError = ekycMutationError
    ? (axios.isAxiosError(ekycMutationError)
        ? ekycMutationError.response?.data?.message || ekycMutationError.message
        : ekycMutationError.message) || "Đã xảy ra lỗi khi xác thực eKYC."
    : "";

  // Kiểm tra kết quả xác thực khuôn mặt từ eKYC: chỉ dùng verifyResult == true
  const isVerified = Boolean(
    isEkycSuccess &&
    ekycResult?.verification &&
    (ekycResult.verification.verifyResult == true || String(ekycResult.verification.verifyResult).toLowerCase() === "true")
  );

  // eKYC chạy thành công nhưng khuôn mặt không khớp (verifyResult !== true)
  const isVerifyFailed = Boolean(
    isEkycSuccess &&
    ekycResult?.verification &&
    !isVerified
  );

  // Chỉ hiển thị form thông tin giấy tờ khi xác thực thành công (hoặc đã có dữ liệu hợp lệ nếu quay lại bước này)
  const currentFullName = watch("fullName");
  const currentIdentityNumber = watch("identityNumber");
  const isFormVisible = isVerified || Boolean(!ekycResult && currentFullName && currentIdentityNumber);

  // ---------- main eKYC handler ----------------------------------------------
  const handleVerifyEkyc = useCallback(
    async (selfieFile?: File | Blob) => {
      const fileToVerify = selfieFile || faceVideoBlob;

      if (!frontCccdFile) {
        alert("Vui lòng upload ảnh CCCD mặt trước.");
        return;
      }
      if (!backCccdFile) {
        alert("Vui lòng upload ảnh CCCD mặt sau.");
        return;
      }
      if (!fileToVerify) {
        alert("Vui lòng chụp ảnh khuôn mặt để xác thực.");
        return;
      }

      try {
        const data = await ekycMutation.mutateAsync({
          imageFront: frontCccdFile,
          imageBack: backCccdFile,
          imageSelfie: fileToVerify,
        });

        // Chỉ điền dữ liệu vào form khi kết quả xác thực khuôn mặt verifyResult == true
        const isSuccess = Boolean(
          data?.verification &&
          (data.verification.verifyResult == true || String(data.verification.verifyResult).toLowerCase() === "true")
        );

        if (!isSuccess) {
          console.warn("Xác thực eKYC không thành công (verifyResult !== true):", data?.verification);
          return;
        }

        // Tải ảnh CCCD và Selfie lên Cloudinary để lưu link đối soát hồ sơ
        if (frontCccdFile) {
          UploadImageService.uploadFile(frontCccdFile)
            .then((res) => setValue("cccdFrontUrl", res.url))
            .catch((err) => console.error("Lỗi tải ảnh CCCD trước lên Cloudinary:", err));
        }
        if (backCccdFile) {
          UploadImageService.uploadFile(backCccdFile)
            .then((res) => setValue("cccdBackUrl", res.url))
            .catch((err) => console.error("Lỗi tải ảnh CCCD sau lên Cloudinary:", err));
        }
        if (fileToVerify) {
          const selfieFile = fileToVerify instanceof File
            ? fileToVerify
            : new File([fileToVerify], "selfie.jpg", { type: "image/jpeg" });
          UploadImageService.uploadFile(selfieFile)
            .then((res) => setValue("faceImageUrl", res.url))
            .catch((err) => console.error("Lỗi tải ảnh chân dung lên Cloudinary:", err));
        }

      // ---- Điền dữ liệu OCR vào form ------------------
      type InfoMap = Record<string, string | undefined>;
      const rawInfo = data?.information as unknown;

      const normalizeInfo = (value: unknown): InfoMap | undefined => {
        if (!value || typeof value !== "object") return undefined;

        if (Array.isArray(value)) {
          const first = value[0];
          return first && typeof first === "object" ? (first as InfoMap) : undefined;
        }

        const obj = value as Record<string, unknown>;
        if ("data" in obj && obj.data && typeof obj.data === "object") {
          if (Array.isArray(obj.data)) {
            const first = obj.data[0];
            return first && typeof first === "object" ? (first as InfoMap) : undefined;
          }
          return obj.data as InfoMap;
        }

        return obj as InfoMap;
      };

      const info = normalizeInfo(rawInfo);

      console.log("eKYC OCR info from server:", info);

      if (info) {
        const name = info.name || info.full_name || info.fullName || "";
        const id = info.id || info.id_number || info.identityNumber || info.id_card || "";
        const birthday = info.birthday || info.dob || info.date_of_birth || info.dateOfBirth || "";
        const sex = info.sex || info.gender || "";
        const nationality = info.nationality || info.nation || "Việt Nam";
        const address = info.address || info.place_of_residence || info.placeOfResidence || info.recent_location || "";
        const expiry = info.expiry || info.expiry_date || info.expiryDate || "";


        if (name) {
          setValue("fullName", name, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
        if (id) {
          setValue("identityNumber", id, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
        if (birthday) {
          setValue("dateOfBirth", toInputDate(birthday), {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
        if (sex) {
          setValue("gender", normalizeSex(sex), {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
        if (nationality) {
          setValue("nationality", nationality, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
        if (address) {
          setValue("address", address, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
        if (expiry) {
          setValue("expiryDate", toInputDate(expiry), {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
      }
    } catch (err: unknown) {
      console.error("eKYC verification failed:", err);
    }
  }, [
    frontCccdFile,
    backCccdFile,
    faceVideoBlob,
    ekycMutation,
    setValue,
  ]);

  const handleStartFaceVerification = () => {
    if (!frontCccdFile) {
      alert("Vui lòng upload ảnh CCCD mặt trước.");
      return;
    }
    if (!backCccdFile) {
      alert("Vui lòng upload ảnh CCCD mặt sau.");
      return;
    }
    setIsCameraOpen(true);
  };

  // ---------- render ----------------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Bước 2: Thông tin định danh chủ sở hữu
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Upload ảnh CCCD (2 mặt) và nhấn{" "}
          <strong>Xác thực khuôn mặt</strong> để chụp ảnh và tự động nhận diện thông tin.
        </p>
      </div>

      {/* ===== 1. Upload CCCD 2 mặt ===== */}
      <div className="space-y-2">
        <label className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Hình ảnh Căn cước công dân (Mặt trước &amp; Mặt sau){" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          {/* CCCD Mặt trước */}
          <div
            className={`flex-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border space-y-2 transition-colors ${
              frontCccdFile
                ? "border-emerald-400 dark:border-emerald-600"
                : "border-zinc-200 dark:border-zinc-700/60"
            }`}
          >
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-500" />
              Ảnh CCCD Mặt trước
              <span className="text-red-500">*</span>
              {frontCccdFile && (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
              )}
            </p>
            <SingleImageUpload
              file={frontCccdFile}
              setFile={(file) => {
                setFrontCccdFile(file);
                if (ekycMutation.isSuccess || ekycMutation.isError) {
                  ekycMutation.reset();
                }
              }}
              label=""
            />
          </div>

          {/* CCCD Mặt sau */}
          <div
            className={`flex-1 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border space-y-2 transition-colors ${
              backCccdFile
                ? "border-emerald-400 dark:border-emerald-600"
                : "border-zinc-200 dark:border-zinc-700/60"
            }`}
          >
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-500" />
              Ảnh CCCD Mặt sau
              <span className="text-red-500">*</span>
              {backCccdFile && (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
              )}
            </p>
            <SingleImageUpload
              file={backCccdFile}
              setFile={(file) => {
                setBackCccdFile(file);
                if (ekycMutation.isSuccess || ekycMutation.isError) {
                  ekycMutation.reset();
                }
              }}
              label=""
            />
          </div>
        </div>
      </div>

      {/* ===== 2. Xác thực khuôn mặt (Ẩn khi đã xác thực thành công) ===== */}
      {!isVerified && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-blue-500" />
            Xác thực khuôn mặt
            <span className="text-red-500">*</span>
          </p>

          {/* === Khối chụp Camera === */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/40 p-4 transition-colors">
            <div className="flex justify-center py-1 w-full">
              <button
                type="button"
                className="py-2.5 px-6 bg-[#50b875] hover:bg-[#44a365] text-white text-sm font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleStartFaceVerification}
                disabled={isEkycLoading}
              >
                {isEkycLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xác thực...</span>
                  </>
                ) : isVerifyFailed ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Xác thực lại khuôn mặt</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Xác thực khuôn mặt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 4. Nút xác thực (Đã được chuyển lên trên cạnh nút chụp) ===== */}

      {/* ===== 5. eKYC Result: Success ===== */}
      {isVerified && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 space-y-2 animate-in fade-in duration-200">
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            eKYC thành công — Thông tin giấy tờ đã được nhận diện tự động
          </p>
        </div>
      )}

      {/* ===== 5b. eKYC Result: Verify Failed (Face Mismatch) ===== */}
      {isVerifyFailed && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4 flex items-start gap-3 animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Khuôn mặt không khớp với giấy tờ CCCD
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Kết quả xác minh khuôn mặt không đạt yêu cầu (<code className="font-mono text-amber-800 dark:text-amber-200">verifyResult: false</code>). Vui lòng chụp lại ảnh khuôn mặt rõ nét và đảm bảo đúng chủ sở hữu CCCD.
            </p>
          </div>
        </div>
      )}

      {/* ===== 6. eKYC Result: Network / Server Error ===== */}
      {isEkycError && ekycError && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-4 flex items-start gap-3 animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              Xác thực eKYC thất bại
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              {ekycError}
            </p>
          </div>
        </div>
      )}

      {/* ===== Hướng dẫn khi chưa hoàn tất xác thực eKYC ===== */}
      {!isFormVisible && !isEkycLoading && (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-800/30 p-6 text-center animate-in fade-in duration-200">
          <div className="mx-auto w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center mb-2.5">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            Thông tin giấy tờ sẽ mở khóa sau khi xác thực eKYC thành công
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto leading-relaxed">
            Vui lòng tải lên ảnh 2 mặt CCCD và nhấn nút <strong>&quot;Xác thực khuôn mặt&quot;</strong>. Khi hệ thống xác minh kết quả hợp lệ (<code className="text-blue-600 dark:text-blue-400 font-mono font-semibold">verifyResult == true</code>), biểu mẫu thông tin giấy tờ sẽ tự động hiển thị để bạn kiểm tra.
          </p>
        </div>
      )}

      {/* ===== 7. Form Fields (Chỉ hiển thị khi verifyResult == true hoặc đã có dữ liệu hợp lệ) ===== */}
      {isFormVisible && (
        <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-300">
          <div className="w-full pb-1 flex items-center justify-between">
            <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Thông tin giấy tờ (Đã trích xuất từ eKYC)
            </h4>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full px-2.5 py-0.5">
              Đã khóa thông tin
            </span>
          </div>

        {/* 1. Full Name */}
        <div className="w-full md:w-[calc(50%-8px)]">
          <FormInput
            name="fullName"
            control={control}
            label="Họ và tên chủ sở hữu"
            placeholder="NGUYEN VAN A"
            required
            readOnly
            icon={<User className="w-4 h-4 text-zinc-400" />}
            className="body-text bg-zinc-100 dark:bg-zinc-800/70 cursor-not-allowed select-none text-zinc-600 dark:text-zinc-300"
          />
        </div>

        {/* 2. Identity Number (CCCD) */}
        <div className="w-full md:w-[calc(50%-8px)]">
          <FormInput
            name="identityNumber"
            control={control}
            label="Số CCCD / CMND"
            placeholder="012345678912"
            required
            readOnly
            icon={<CreditCard className="w-4 h-4 text-zinc-400" />}
            className="body-text bg-zinc-100 dark:bg-zinc-800/70 cursor-not-allowed select-none text-zinc-600 dark:text-zinc-300"
          />
        </div>

        {/* 3. Date of Birth */}
        <div className="w-full md:w-[calc(50%-8px)]">
          <FormInput
            name="dateOfBirth"
            control={control}
            label="Ngày sinh"
            type="date"
            required
            readOnly
            icon={<Calendar className="w-4 h-4 text-zinc-400" />}
            className="body-text bg-zinc-100 dark:bg-zinc-800/70 cursor-not-allowed select-none text-zinc-600 dark:text-zinc-300"
          />
        </div>

        {/* 4. Gender */}
        <div className="w-full md:w-[calc(50%-8px)] space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-6 py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/80 rounded-xl h-11.5 pointer-events-none cursor-not-allowed select-none opacity-85">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-not-allowed">
              <input
                type="radio"
                value="Nam"
                {...register("gender")}
                className="w-4 h-4 text-blue-600 cursor-not-allowed"
              />
              Nam
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-not-allowed">
              <input
                type="radio"
                value="Nữ"
                {...register("gender")}
                className="w-4 h-4 text-blue-600 cursor-not-allowed"
              />
              Nữ
            </label>
          </div>
        </div>

        {/* 5. Nationality */}
        <div className="w-full md:w-[calc(50%-8px)]">
          <FormInput
            name="nationality"
            control={control}
            label="Quốc tịch"
            placeholder="Việt Nam"
            required
            readOnly
            icon={<Globe className="w-4 h-4 text-zinc-400" />}
            className="body-text bg-zinc-100 dark:bg-zinc-800/70 cursor-not-allowed select-none text-zinc-600 dark:text-zinc-300"
          />
        </div>

        {/* 6. Expiry Date */}
        <div className="w-full md:w-[calc(50%-8px)]">
          <FormInput
            name="expiryDate"
            control={control}
            label="Ngày hết hạn CCCD"
            type="date"
            required
            readOnly
            icon={<Calendar className="w-4 h-4 text-zinc-400" />}
            className="body-text bg-zinc-100 dark:bg-zinc-800/70 cursor-not-allowed select-none text-zinc-600 dark:text-zinc-300"
          />
        </div>

        {/* 7. Address (col 12) */}
        <div className="w-full">
          <FormInput
            name="address"
            control={control}
            label="Địa chỉ thường trú"
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
            required
            readOnly
            icon={<MapPin className="w-4 h-4 text-zinc-400" />}
            className="body-text bg-zinc-100 dark:bg-zinc-800/70 cursor-not-allowed select-none text-zinc-600 dark:text-zinc-300"
          />
        </div>
      </div>
      )}

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCaptureSuccess={(result) => {
          const selfie = result.imageFile || result.videoBlob;
          if (selfie) {
            setFaceVideoBlob(selfie);
            handleVerifyEkyc(selfie);
          }
        }}
      />
    </div>
  );
};
