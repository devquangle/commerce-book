import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

export interface CaptureResult {
  videoBlob: Blob | null;
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

// Types for liveness challenge
type ChallengeType = 'smile' | 'blink' | 'open_mouth' | 'turn_left' | 'turn_right' | 'look_up' | 'look_down';

interface ChallengeDef {
  type: ChallengeType;
  label: string;
  check: (scores: { smile: number; blink: number; open_mouth: number }, angles: { pitch: number; yaw: number; roll: number }) => boolean;
}

const ALL_CHALLENGES: ChallengeDef[] = [
  { type: 'smile', label: "Vui lòng mỉm cười", check: (scores) => scores.smile > 0.4 },
  { type: 'blink', label: "Vui lòng chớp mắt", check: (scores) => scores.blink > 0.4 },
  { type: 'open_mouth', label: "Vui lòng há miệng", check: (scores) => scores.open_mouth > 0.4 },
  { type: 'turn_left', label: "Vui lòng quay mặt sang TRÁI", check: (_, angles) => angles.yaw > 15 },
  { type: 'turn_right', label: "Vui lòng quay mặt sang PHẢI", check: (_, angles) => angles.yaw < -15 },
  { type: 'look_up', label: "Vui lòng ngẩng đầu lên", check: (_, angles) => angles.pitch > 10 },
  { type: 'look_down', label: "Vui lòng cúi đầu xuống", check: (_, angles) => angles.pitch < -10 },
];

function getEulerAngles(matrix: Float32Array | number[]) {
  const m00 = matrix[0], m10 = matrix[4], m20 = matrix[8];
  const m21 = matrix[9], m22 = matrix[10];
  const m11 = matrix[5], m12 = matrix[6];
  
  const sy = Math.sqrt(m00 * m00 + m10 * m10);
  const singular = sy < 1e-6;
  
  let pitch, yaw, roll;
  if (!singular) {
    pitch = Math.atan2(m21, m22);
    yaw = Math.atan2(-m20, sy);
    roll = Math.atan2(m10, m00);
  } else {
    pitch = Math.atan2(-m12, m11);
    yaw = Math.atan2(-m20, sy);
    roll = 0;
  }
  
  return {
    pitch: pitch * (180 / Math.PI),
    yaw: yaw * (180 / Math.PI),
    roll: roll * (180 / Math.PI),
  };
}

const getFixedChallenges = (): ChallengeDef[] => {
  return [
    ALL_CHALLENGES[1], // blink
    ALL_CHALLENGES[3], // turn_left
    ALL_CHALLENGES[4], // turn_right
    ALL_CHALLENGES[5], // look_up
    ALL_CHALLENGES[6], // look_down
  ];
};

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCaptureSuccess,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  // Capture State (video only)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // MediaPipe state
  const [isDetectorLoading, setIsDetectorLoading] = useState<boolean>(true);
  const [isFaceDetected, setIsFaceDetected] = useState<boolean>(false);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const requestRef = useRef<number | undefined>(undefined);

  // Liveness State
  const [challenges, setChallenges] = useState<ChallengeDef[]>([]);
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState<number>(0);
  const [livenessPassed, setLivenessPassed] = useState<boolean>(false);

  const handleDataAvailable = useCallback(({ data }: BlobEvent) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  }, []);

  const handleUserMedia = useCallback((stream: MediaStream) => {
    try {
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });
      mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.start();
    } catch (err) {
      console.warn("Could not start MediaRecorder", err);
    }
  }, [handleDataAvailable]);

  useEffect(() => {
    if (recordedChunks.length > 0 && livenessPassed) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      setVideoBlob(blob);
      setVideoPreviewUrl(URL.createObjectURL(blob));
    }
  }, [recordedChunks, livenessPassed]);

  useEffect(() => {
    if (!isOpen) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch (e) {}
        landmarkerRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setRecordedChunks([]);
      setVideoBlob(null);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
      setIsFaceDetected(false);
      setLivenessPassed(false);
      setCurrentChallengeIdx(0);
      setChallenges([]);
      return;
    }

    setChallenges(getFixedChallenges());
    setCurrentChallengeIdx(0);
    setLivenessPassed(false);

    let isCanceled = false;
    
    const initModel = async () => {
      setIsDetectorLoading(true);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });
        if (!isCanceled) {
          landmarkerRef.current = faceLandmarker;
          setIsDetectorLoading(false);
          detectFace();
        } else {
          faceLandmarker.close();
        }
      } catch (err) {
        console.error("Error loading mediapipe face landmarker:", err);
        if (!isCanceled) {
          setIsDetectorLoading(false);
          setIsFaceDetected(true);
          setLivenessPassed(true);
        }
      }
    };

    const detectFace = () => {
      if (!webcamRef.current?.video || webcamRef.current.video.readyState !== 4 || !landmarkerRef.current || isCanceled) {
        if (!isCanceled) requestRef.current = requestAnimationFrame(detectFace);
        return;
      }

      try {
        const video = webcamRef.current.video;
        const startTimeMs = performance.now();
        const results = landmarkerRef.current.detectForVideo(video, startTimeMs);
        
        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
          setIsFaceDetected(true);
          
          setChallenges((currentChallenges) => {
            setCurrentChallengeIdx((currentIdx) => {
              if (currentIdx >= currentChallenges.length) {
                setLivenessPassed(true);
                return currentIdx;
              }

              const getScore = (name: string) => results.faceBlendshapes[0].categories.find(c => c.categoryName === name)?.score || 0;
              const scores = {
                smile: (getScore('mouthSmileLeft') + getScore('mouthSmileRight')) / 2,
                blink: (getScore('eyeBlinkLeft') + getScore('eyeBlinkRight')) / 2,
                open_mouth: getScore('jawOpen'),
              };

              let angles = { pitch: 0, yaw: 0, roll: 0 };
              if (results.facialTransformationMatrixes && results.facialTransformationMatrixes.length > 0) {
                angles = getEulerAngles(results.facialTransformationMatrixes[0].data);
              }

              const currentChallenge = currentChallenges[currentIdx];
              if (currentChallenge.check(scores, angles)) {
                return currentIdx + 1;
              }

              return currentIdx;
            });
            return currentChallenges;
          });
        } else {
          setIsFaceDetected(false);
        }
      } catch (e) {
        console.error("Detection error:", e);
      }
      
      if (!isCanceled) {
        requestRef.current = requestAnimationFrame(detectFace);
      }
    };

    initModel();

    return () => {
      isCanceled = true;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch (e) {}
        landmarkerRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle Liveness Passed
  useEffect(() => {
    if (livenessPassed && !isDetectorLoading) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    }
  }, [livenessPassed, isDetectorLoading]);

  const handleRetake = () => {
    setRecordedChunks([]);
    setVideoBlob(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);
    setLivenessPassed(false);
    setCurrentChallengeIdx(0);
    setChallenges(getFixedChallenges());
  };

  const handleConfirm = () => {
    if (videoBlob && onCaptureSuccess) {
      onCaptureSuccess({
        videoBlob: videoBlob
      });
    }
    onClose();
  };

  const handleUserMediaError = useCallback(() => {
    setHasError(true);
  }, []);

  // (Đã chuyển sang dùng videoPreviewUrl thay vì previewImg)

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
        ) : livenessPassed && videoPreviewUrl ? (
          /* Preview of captured video */
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-black flex items-center justify-center">
            <video
              src={videoPreviewUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shadow-md">
              <CheckCircle className="w-3.5 h-3.5" /> Hoàn tất video ({((videoBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB)
            </div>
          </div>
        ) : (
          /* Live Webcam View */
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-black flex items-center justify-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={1}
              forceScreenshotSourceSize={true}
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              className="w-full h-full object-cover"
            />

            {/* AI Status Indicator */}
            {isDetectorLoading && (
              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 backdrop-blur-md">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải AI...
              </div>
            )}
            {!isDetectorLoading && isFaceDetected && !livenessPassed && (
              <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-xs px-2.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                <CheckCircle className="w-3.5 h-3.5" /> Đang quay video Liveness...
              </div>
            )}
            {!isDetectorLoading && !isFaceDetected && (
              <div className="absolute top-3 right-3 bg-rose-600/90 text-white text-xs px-2.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                <AlertCircle className="w-3.5 h-3.5" /> Không tìm thấy khuôn mặt
              </div>
            )}

            {/* Face Alignment Oval Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div 
                className={`w-48 h-60 border-4 border-dashed rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] flex items-center justify-center transition-colors duration-300 relative ${
                  livenessPassed ? "border-emerald-500/90" : isFaceDetected ? "border-blue-500/80" : "border-rose-500/80"
                }`}
              >
              </div>
            </div>

            {/* Liveness Challenge Prompts Overlay */}
            {!isDetectorLoading && isFaceDetected && !livenessPassed && challenges.length > 0 && (
              <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-center shadow-lg border border-white/10 max-w-[80%]">
                  <span className="text-white font-semibold text-sm tracking-tight">
                    {challenges[currentChallengeIdx]?.label}
                  </span>
                  <div className="flex items-center justify-center gap-1 mt-1.5">
                    {challenges.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx < currentChallengeIdx ? "w-6 bg-emerald-500" : idx === currentChallengeIdx ? "w-3 bg-blue-500" : "w-3 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Action Controls */}
        <div className="w-full flex items-center justify-end gap-3 pt-2">
          {livenessPassed ? (
            <>
              <Button
                type="button"
                variant="outline"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={handleRetake}
              >
                Thử lại
              </Button>
              <Button
                type="button"
                variant="primary"
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={handleConfirm}
              >
                Xác nhận video
              </Button>
            </>
          ) : (
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy bỏ
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
