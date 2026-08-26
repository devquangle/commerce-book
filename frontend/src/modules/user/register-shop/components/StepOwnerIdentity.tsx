import React, { useState, useCallback, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  User,
  CreditCard,
  Calendar,
  MapPin,
  Camera,
  ShieldCheck,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Sparkles,
  Upload,
  Video,
  ImageIcon,
  X,
  RefreshCw,
  Globe,
  Building2,
  Fingerprint,
} from "lucide-react";
import axios from "axios";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import SingleImageUpload from "@/components/common/SingleImageUpload";
import { CameraModal } from "./CameraModal";
import type { RegisterShopRequest } from "../types/register-shop.type";

const EKYC_API_URL = "http://localhost:8000/api/v1/ekyc/verify-video";

// ---- helpers ---------------------------------------------------------------

/** Chuyển "15/08/1990" hoặc "15-08-1990" → "1990-08-15" (yyyy-MM-dd cho input type=date) */
const toInputDate = (raw: string): string => {
  if (!raw) return "";
  // Normalize dấu phân cách
  const normalized = raw.replace(/[\-.]/g, "/").trim();
  const parts = normalized.split("/");
  if (parts.length !== 3) return "";
  const [dd, mm, yyyy] = parts;
  // Kiểm tra độ dài hợp lệ
  if (!dd || !mm || !yyyy || yyyy.length !== 4) return "";
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
};

/** Chuẩn hóa giới tính về "Nam" | "Nữ" */
const normalizeSex = (raw: string): string => {
  if (!raw) return "";
  const lower = raw.trim().toLowerCase();
  if (lower === "nam" || lower === "male" || lower === "m") return "Nam";
  if (lower === "nữ" || lower === "nu" || lower === "female" || lower === "f")
    return "Nữ";
  if (lower.includes("nam")) return "Nam";
  if (lower.includes("nữ") || lower.includes("nu")) return "Nữ";
  return "";
};

const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
};

// ---- eKYC state types -------------------------------------------------------

type EkycStatus = "idle" | "loading" | "success" | "error";

interface EkycResult {
  face?: {
    matched?: boolean;
    bestSimilarity?: number;
  };
  liveness?: {
    isLive?: boolean;
    score?: number;
  };
  ocr?: {
    identityNumber?: string;
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    placeOfOrigin?: string;
    placeOfResidence?: string;
    issueDate?: string;
    expiryDate?: string;
    personalIdentification?: string;
    issuePlace?: string;
  };
  qr?: {
    detected?: boolean;
    parsed?: boolean;
  };
  validation?: {
    valid?: boolean;
    faceMatch?: boolean;
    livenessPass?: boolean;
  };
}

// ---- Face Media Input type --------------------------------------------------
type FaceInputMode = "camera" | "upload";

// ---- component --------------------------------------------------------------

export const StepOwnerIdentity: React.FC = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<RegisterShopRequest>();

  // CCCD ảnh mặt trước
  const [frontCccdFile, setFrontCccdFile] = useState<File | null>(null);
  const [frontCccdUrl, setFrontCccdUrl] = useState<string>("");

  // CCCD ảnh mặt sau
  const [backCccdFile, setBackCccdFile] = useState<File | null>(null);
  const [backCccdUrl, setBackCccdUrl] = useState<string>("");

  // Xác thực khuôn mặt - chế độ chụp camera
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [faceVideoBlob, setFaceVideoBlob] = useState<Blob | null>(null);

  // Xác thực khuôn mặt - chế độ upload file ảnh/video
  const [faceMediaFile, setFaceMediaFile] = useState<File | null>(null);
  const [faceMediaPreview, setFaceMediaPreview] = useState<string | null>(null);
  const [faceMediaType, setFaceMediaType] = useState<"image" | "video" | null>(
    null,
  );
  const faceUploadRef = useRef<HTMLInputElement>(null);

  // Chế độ nhập khuôn mặt
  const [faceInputMode, setFaceInputMode] = useState<FaceInputMode>("camera");

  // eKYC state
  const [ekycStatus, setEkycStatus] = useState<EkycStatus>("idle");
  const [ekycResult, setEkycResult] = useState<EkycResult | null>(null);
  const [ekycError, setEkycError] = useState<string>("");

  // ---------- handle face upload file ----------------------------------------
  const handleFaceFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        alert(
          "Chỉ chấp nhận file ảnh (jpg, png, webp) hoặc video (mp4, mov, webm).",
        );
        return;
      }

      setFaceMediaFile(file);
      setFaceMediaType(isImage ? "image" : "video");

      const url = URL.createObjectURL(file);
      setFaceMediaPreview(url);
    },
    [],
  );

  const clearFaceMedia = useCallback(() => {
    setFaceMediaFile(null);
    setFaceMediaPreview(null);
    setFaceMediaType(null);
    if (faceUploadRef.current) faceUploadRef.current.value = "";
  }, []);

  // ---------- derived: đã có dữ liệu khuôn mặt? ----------------------------
  const hasFaceData =
    faceInputMode === "camera" ? !!faceVideoBlob : !!faceMediaFile;

  // ---------- main eKYC handler ----------------------------------------------
  const handleVerifyEkyc = useCallback(async () => {
    if (!frontCccdFile) {
      setEkycError("Vui lòng upload ảnh CCCD mặt trước.");
      setEkycStatus("error");
      return;
    }
    if (!backCccdFile) {
      setEkycError("Vui lòng upload ảnh CCCD mặt sau.");
      setEkycStatus("error");
      return;
    }

    setEkycStatus("loading");
    setEkycError("");
    setEkycResult(null);

    try {
      const formData = new FormData();

      // CCCD mặt trước — dùng để OCR
      formData.append("frontImage", frontCccdFile, frontCccdFile.name);

      // CCCD mặt sau — gửi kèm để backend kiểm tra tính toàn vẹn
      formData.append("backImage", backCccdFile, backCccdFile.name);

      // Khuôn mặt: ảnh camera hoặc file upload
      if (faceInputMode === "camera" && faceVideoBlob) {
        formData.append("selfieVideo", faceVideoBlob, "liveness.webm");
      } else if (faceInputMode === "upload" && faceMediaFile) {
        formData.append("selfieVideo", faceMediaFile, faceMediaFile.name);
      }

      const response = await axios.post<any>(EKYC_API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120_000,
      });

      const rootData = response.data;
      const data = rootData.data || rootData;
      setEkycResult(data);
      setEkycStatus("success");

      // ---- Điền dữ liệu OCR vào form ------------------
      const ocr = data.ocr;
      console.log("OCR Data:", data);
      if (ocr) {
        if (ocr.fullName)
          setValue("fullName", ocr.fullName, { shouldValidate: true });
        if (ocr.identityNumber)
          setValue("identityNumber", ocr.identityNumber, {
            shouldValidate: true,
          });

        // Ngày sinh — cần chuyển đổi về định dạng yyyy-MM-dd cho thẻ input type="date"
        if (ocr.dateOfBirth)
          setValue("dateOfBirth", toInputDate(ocr.dateOfBirth), {
            shouldValidate: true,
          });

        // Giới tính: Chuẩn hoá về "Nam" hoặc "Nữ" để khớp giá trị radio input
        if (ocr.gender) {
          const sex = normalizeSex(ocr.gender);
          if (sex) setValue("gender", sex, { shouldValidate: true });
        }

        // Quốc tịch
        if (ocr.nationality)
          setValue("nationality", ocr.nationality, { shouldValidate: true });

        // Quê quán
        if (ocr.placeOfOrigin)
          setValue("placeOfOrigin", ocr.placeOfOrigin, {
            shouldValidate: true,
          });

        // Nơi thường trú
        if (ocr.placeOfResidence)
          setValue("placeOfResidence", ocr.placeOfResidence, {
            shouldValidate: true,
          });

        // Ngày cấp CCCD
        if (ocr.issueDate)
          setValue("issueDate", toInputDate(ocr.issueDate), {
            shouldValidate: true,
          });

        // Ngày hết hạn CCCD
        if (ocr.expiryDate)
          setValue("expiryDate", toInputDate(ocr.expiryDate), {
            shouldValidate: true,
          });

        // Đặc điểm nhận dạng
        if (ocr.personalIdentification)
          setValue("personalIdentification", ocr.personalIdentification, {
            shouldValidate: true,
          });

        // Nơi cấp
        if (ocr.issuePlace)
          setValue("issuePlace", ocr.issuePlace, { shouldValidate: true });
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message ??
          "Không thể kết nối tới eKYC service. Hãy đảm bảo service đang chạy tại http://localhost:8000")
        : "Đã xảy ra lỗi không xác định.";
      setEkycError(msg);
      setEkycStatus("error");
    }
  }, [
    frontCccdFile,
    backCccdFile,
    faceInputMode,
    faceVideoBlob,
    faceMediaFile,
    hasFaceData,
    setValue,
  ]);

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
          Upload ảnh CCCD (2 mặt) và xác thực khuôn mặt rồi nhấn{" "}
          <strong>Xác thực</strong> — hệ thống sẽ tự động đọc và điền thông tin.
        </p>
      </div>

      {/* ===== 1. Upload CCCD 2 mặt ===== */}
      <div className="space-y-2">
        <label className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Hình ảnh Căn cước công dân (Mặt trước &amp; Mặt sau){" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CCCD Mặt trước */}
          <div
            className={`bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border space-y-2 transition-colors ${
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
              setFile={setFrontCccdFile}
              avatarUrl={frontCccdUrl}
              onClearImage={() => setFrontCccdUrl("")}
              label=""
            />
          </div>

          {/* CCCD Mặt sau */}
          <div
            className={`bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border space-y-2 transition-colors ${
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
              setFile={setBackCccdFile}
              avatarUrl={backCccdUrl}
              onClearImage={() => setBackCccdUrl("")}
              label=""
            />
          </div>
        </div>
      </div>

      {/* ===== 2. Xác thực khuôn mặt ===== */}
      <div className="space-y-3">
        {/* === Chế độ CAMERA === */}
        {faceInputMode === "camera" && (
          <div
            className={`rounded-xl border p-4 transition-colors ${
              faceVideoBlob
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700"
                : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/60"
            }`}
          >
            {faceVideoBlob ? (
              <div className="py-2 w-full">
                <div className="flex gap-2 justify-center mb-4">
                  <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Đã lưu video Liveness (
                    {((faceVideoBlob.size || 0) / 1024 / 1024).toFixed(2)} MB)
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 bg-[#50b875] hover:bg-[#44a365] text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.preventDefault();
                      handleVerifyEkyc();
                    }}
                    disabled={
                      !frontCccdFile ||
                      !backCccdFile ||
                      ekycStatus === "loading"
                    }
                  >
                    {ekycStatus === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Nhận diện giấy tờ
                  </button>
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 bg-[#8e94a4] hover:bg-[#7b8191] text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                    onClick={() => {
                      setFaceVideoBlob(null);
                    }}
                  >
                    <RefreshCw className="w-4 h-4" /> Quay lại video
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2 w-full">
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 bg-[#50b875] hover:bg-[#44a365] text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.preventDefault();
                      handleVerifyEkyc();
                    }}
                    disabled={
                      !frontCccdFile ||
                      !backCccdFile ||
                      ekycStatus === "loading"
                    }
                  >
                    {ekycStatus === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Nhận diện giấy tờ
                  </button>
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 bg-[#8e94a4] hover:bg-[#7b8191] text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                    onClick={() => setIsCameraOpen(true)}
                  >
                    Xác thực khuôn mặt
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === Chế độ UPLOAD ảnh/video === */}
        {faceInputMode === "upload" && (
          <div
            className={`rounded-xl border transition-colors ${
              faceMediaFile
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700"
                : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/60"
            }`}
          >
            {faceMediaFile && faceMediaPreview ? (
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-400 bg-black shrink-0">
                    {faceMediaType === "image" ? (
                      <img
                        src={faceMediaPreview}
                        alt="Ảnh khuôn mặt"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={faceMediaPreview}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      {faceMediaType === "image"
                        ? "Đã upload ảnh khuôn mặt"
                        : "Đã upload video khuôn mặt"}
                    </p>
                    <p
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 truncate"
                      title={faceMediaFile.name}
                    >
                      {faceMediaFile.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {(faceMediaFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                      {faceMediaType === "video" ? (
                        <span className="inline-flex items-center gap-0.5">
                          <Video className="w-3 h-3" /> Video
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5">
                          <ImageIcon className="w-3 h-3" /> Ảnh
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 bg-[#50b875] hover:bg-[#44a365] text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.preventDefault();
                        handleVerifyEkyc();
                      }}
                      disabled={
                        !frontCccdFile ||
                        !backCccdFile ||
                        ekycStatus === "loading"
                      }
                    >
                      {ekycStatus === "loading" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : null}
                      Nhận diện giấy tờ
                    </button>
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                      onClick={clearFaceMedia}
                    >
                      <X className="w-4 h-4" /> Xóa ảnh / video này
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                /* Drop zone */
                <label
                  htmlFor="face-media-upload"
                  className="flex flex-col items-center gap-3 py-8 px-4 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Nhấn để chọn ảnh hoặc video khuôn mặt
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Hỗ trợ: JPG, PNG, WEBP, MP4, MOV, WEBM • Tối đa 50 MB
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full">
                        <ImageIcon className="w-3 h-3" /> Ảnh selfie
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full">
                        <Video className="w-3 h-3" /> Video khuôn mặt
                      </span>
                    </div>
                  </div>
                </label>
                <div className="flex flex-col items-center gap-3 pb-4 w-full">
                  <button
                    type="button"
                    className="w-full max-w-[280px] py-2.5 px-4 bg-[#50b875] hover:bg-[#44a365] text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.preventDefault();
                      handleVerifyEkyc();
                    }}
                    disabled={
                      !frontCccdFile ||
                      !backCccdFile ||
                      ekycStatus === "loading"
                    }
                  >
                    {ekycStatus === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Nhận diện giấy tờ
                  </button>
                </div>
              </>
            )}

            {/* Hidden file input */}
            <input
              id="face-media-upload"
              ref={faceUploadRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={handleFaceFileChange}
            />
          </div>
        )}
      </div>

      {/* ===== 4. Nút xác thực (Đã được chuyển lên trên cạnh nút chụp) ===== */}

      {/* ===== 5. eKYC Result: Success ===== */}
      {ekycStatus === "success" && ekycResult && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 space-y-2">
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            eKYC thành công — Thông tin đã được điền tự động
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-emerald-700 dark:text-emerald-400">
            {ekycResult.face?.matched && (
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Khuôn mặt khớp
                {ekycResult.face.bestSimilarity != null && (
                  <span className="font-semibold ml-0.5">
                    ({(ekycResult.face.bestSimilarity * 100).toFixed(1)}%)
                  </span>
                )}
              </span>
            )}
            {!ekycResult.face?.matched && hasFaceData && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                Khuôn mặt chưa khớp — vui lòng thử lại với ảnh/video rõ hơn
              </span>
            )}
            <span>Thông tin OCR đã điền vào form bên dưới</span>
          </div>
        </div>
      )}

      {/* ===== 6. eKYC Result: Error ===== */}
      {ekycStatus === "error" && ekycError && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-4 flex items-start gap-3">
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

      {/* ===== 7. Form Fields (Đầy đủ 11 input theo OwnerIdentityInfo) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="col-span-1 md:col-span-2 pb-1">
          <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            Thông tin giấy tờ
          </h4>
        </div>

        {/* 1. Full Name */}
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

        {/* 2. Identity Number (CCCD) */}
        <InputField
          label="Số CCCD / CMND"
          placeholder="012345678912"
          required
          icon={<CreditCard className="w-4 h-4 text-zinc-400" />}
          {...register("identityNumber", {
            required: "Vui lòng nhập số CCCD / CMND",
            pattern: {
              value: /^[0-9]{9,12}$/,
              message: "Số CCCD/CMND gồm từ 9 đến 12 chữ số",
            },
          })}
          error={errors.identityNumber?.message}
          helperText="Số Căn cước công dân gồm 9–12 chữ số"
          className="body-text"
        />

        {/* 3. Date of Birth */}
        <InputField
          label="Ngày sinh"
          type="date"
          required
          icon={<Calendar className="w-4 h-4 text-zinc-400" />}
          {...register("dateOfBirth", {
            required: "Vui lòng chọn ngày sinh",
          })}
          error={errors.dateOfBirth?.message}
          className="body-text"
        />

        {/* 4. Gender */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-6 py-2.5 px-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl h-[46px]">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              <input
                type="radio"
                value="Nam"
                {...register("gender", {
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
                {...register("gender", {
                  required: "Vui lòng chọn giới tính",
                })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              Nữ
            </label>
          </div>
          {errors.gender?.message && (
            <p className="text-xs text-red-500 font-medium">
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* 5. Nationality */}
        <InputField
          label="Quốc tịch"
          placeholder="Việt Nam"
          required
          icon={<Globe className="w-4 h-4 text-zinc-400" />}
          {...register("nationality", {
            required: "Vui lòng nhập quốc tịch",
          })}
          error={errors.nationality?.message}
          className="body-text"
        />

        {/* 7. Issue Date */}
        <InputField
          label="Ngày cấp CCCD"
          type="date"
          icon={<Calendar className="w-4 h-4 text-zinc-400" />}
          {...register("issueDate")}
          error={errors.issueDate?.message}
          className="body-text"
        />

        {/* 8. Expiry Date */}
        <InputField
          label="Ngày hết hạn CCCD"
          type="date"
          required
          icon={<Calendar className="w-4 h-4 text-zinc-400" />}
          {...register("expiryDate", {
            required: "Vui lòng chọn ngày hết hạn CCCD",
          })}
          error={errors.expiryDate?.message}
          className="body-text"
        />

        {/* 10. Place of Origin */}
        <InputField
          label="Quê quán"
          placeholder="Phường X, Quận Y, Tỉnh Z"
          required
          icon={<MapPin className="w-4 h-4 text-zinc-400" />}
          {...register("placeOfOrigin", {
            required: "Vui lòng nhập quê quán",
          })}
          error={errors.placeOfOrigin?.message}
          className="body-text"
        />
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCaptureSuccess={(result) => {
          setFaceVideoBlob(result.videoBlob);
        }}
      />
    </div>
  );
};
