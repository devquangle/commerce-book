import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export interface CaptureResult {
  imageFile: File | null;
  imageUrl: string | null;
  videoBlob?: Blob | null;
}

export interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureSuccess?: (result: CaptureResult) => void;
}

const videoConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: "user",
};

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCaptureSuccess,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCapturedImage(null);
      setHasError(false);
    }
  }, [isOpen]);

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, [webcamRef]);

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage && onCaptureSuccess) {
      // Chuyển base64 sang File
      const arr = capturedImage.split(",");
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], "selfie.jpg", { type: mime });

      onCaptureSuccess({
        imageFile: file,
        imageUrl: capturedImage,
        videoBlob: file, // Giữ tương thích nếu backend mong đợi Blob
      });
    }
    onClose();
  };

  const handleUserMediaError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chụp ảnh chân dung (Face Capture)"
      size="md"
    >
      <div className="flex flex-col items-center space-y-4">
        {hasError ? (
          <div className="w-full py-8 px-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-center space-y-2">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              Không thể truy cập Camera
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              Vui lòng cấp quyền truy cập webcam trên trình duyệt của bạn và thử lại.
            </p>
          </div>
        ) : capturedImage ? (
          /* Preview of captured photo */
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-black flex items-center justify-center">
            <img
              src={capturedImage}
              alt="Ảnh chân dung đã chụp"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shadow-md">
              <CheckCircle className="w-3.5 h-3.5" /> Đã chụp ảnh thành công
            </div>
          </div>
        ) : (
          /* Live Webcam View */
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-black flex items-center justify-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.95}
              forceScreenshotSourceSize={true}
              videoConstraints={videoConstraints}
              onUserMediaError={handleUserMediaError}
              className="w-full h-full object-cover"
            />

            {/* Face Alignment Oval Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-48 h-60 border-2 border-dashed border-white/80 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] flex items-center justify-center relative">
                <span className="text-[11px] text-white/90 bg-black/60 px-2 py-0.5 rounded-full font-medium">
                  Đặt khuôn mặt vào khung
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Controls */}
        <div className="w-full flex items-center justify-end gap-3 pt-2">
          {capturedImage ? (
            <>
              <Button
                type="button"
                variant="outline"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={handleRetake}
              >
                Chụp lại
              </Button>
              <Button
                type="button"
                variant="primary"
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={handleConfirm}
              >
                Sử dụng ảnh này
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="secondary" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button
                type="button"
                variant="primary"
                icon={<Camera className="w-4 h-4" />}
                onClick={handleCapture}
              >
                Chụp ảnh
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
