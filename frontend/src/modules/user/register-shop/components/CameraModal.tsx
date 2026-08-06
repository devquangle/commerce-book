import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";

export interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureSuccess?: (imageSrc: string) => void;
}

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCaptureSuccess,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImg, setCapturedImg] = useState<string | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImg(imageSrc);
      }
    }
  }, [webcamRef]);

  const handleRetake = () => {
    setCapturedImg(null);
  };

  const handleConfirm = () => {
    if (capturedImg && onCaptureSuccess) {
      onCaptureSuccess(capturedImg);
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
      title="Xác thực khuôn mặt (Face Verification)"
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
        ) : capturedImg ? (
          /* Preview of captured photo */
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-black flex items-center justify-center">
            <img
              src={capturedImg}
              alt="Khuôn mặt đã chụp"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shadow-md">
              <CheckCircle className="w-3.5 h-3.5" /> Đã chụp thành công
            </div>
          </div>
        ) : (
          /* Live Webcam View */
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-black flex items-center justify-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={handleUserMediaError}
              className="w-full h-full object-cover"
            />

            {/* Face Alignment Oval Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-60 border-2 border-dashed border-blue-500/80 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] flex items-center justify-center">
                <span className="text-[11px] text-white/90 bg-black/50 px-2 py-0.5 rounded-full font-medium">
                  Đặt khuôn mặt vào đây
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Controls */}
        <div className="w-full flex items-center justify-end gap-3 pt-2">
          {capturedImg ? (
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
                Xác nhận ảnh
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
                disabled={hasError}
                icon={<Camera className="w-4 h-4" />}
                onClick={capture}
              >
                Chụp ảnh khuôn mặt
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
