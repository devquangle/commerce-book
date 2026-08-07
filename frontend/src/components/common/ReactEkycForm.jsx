/**
 * ReactEkycForm.jsx
 *
 * React component để upload ảnh CCCD và selfie, gọi eKYC API,
 * và hiển thị kết quả xác minh danh tính.
 *
 * Dependencies:
 *   npm install axios
 *
 * Dùng với React 18+ (hooks, functional components).
 */

import React, { useState, useRef, useCallback } from "react";
import axios from "axios";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------
const EKYC_API_URL = "http://localhost:8000/verify";
const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// ---------------------------------------------------------------------------
// HELPER HOOKS
// ---------------------------------------------------------------------------

/**
 * Custom hook để quản lý trạng thái của một file upload.
 */
function useFileUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleSelect = useCallback((e) => {
    const selected = e.target.files?.[0];
    setError(null);

    if (!selected) return;

    // Validate type
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError(`Chỉ chấp nhận: ${ACCEPTED_TYPES.join(", ")}`);
      return;
    }

    // Validate size
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File quá lớn. Tối đa ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setFile(selected);

    // Tạo preview URL
    const objectUrl = URL.createObjectURL(selected);
    setPreview(objectUrl);

    // Cleanup URL cũ khi unmount hoặc file thay đổi
    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return { file, preview, error, inputRef, handleSelect, reset };
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

/**
 * Upload zone cho một ảnh (drag & click).
 */
function ImageUploadZone({ label, preview, error, inputRef, onSelect }) {
  return (
    <div style={styles.uploadZone}>
      <label style={styles.uploadLabel}>{label}</label>

      <div
        style={{
          ...styles.dropArea,
          borderColor: error ? "#e53e3e" : preview ? "#48bb78" : "#a0aec0",
        }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt={label} style={styles.previewImage} />
        ) : (
          <div style={styles.dropPlaceholder}>
            <span style={styles.dropIcon}>📷</span>
            <span>Click để chọn ảnh</span>
            <span style={styles.dropHint}>JPEG, PNG, WEBP – tối đa {MAX_FILE_SIZE_MB}MB</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={onSelect}
        style={{ display: "none" }}
        aria-label={label}
      />

      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
}

/**
 * Hiển thị kết quả OCR từ CCCD.
 */
function OcrResultCard({ ocr }) {
  if (!ocr) return null;

  const fields = [
    { key: "identityNumber", label: "Số CCCD" },
    { key: "fullName", label: "Họ và tên" },
    { key: "dateOfBirth", label: "Ngày sinh" },
    { key: "gender", label: "Giới tính" },
    { key: "nationality", label: "Quốc tịch" },
    { key: "placeOfOrigin", label: "Quê quán" },
    { key: "placeOfResidence", label: "Nơi thường trú" },
    { key: "issueDate", label: "Ngày cấp" },
  ];

  return (
    <div style={styles.ocrCard}>
      <h3 style={styles.cardTitle}>📋 Thông tin CCCD</h3>
      <table style={styles.ocrTable}>
        <tbody>
          {fields.map(({ key, label }) => (
            <tr key={key} style={styles.ocrRow}>
              <td style={styles.ocrKey}>{label}</td>
              <td style={styles.ocrValue}>{ocr[key] ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Hiển thị kết quả face verification với similarity badge.
 */
function VerificationResult({ result }) {
  if (!result) return null;

  const { success, message, verified, similarity, threshold } = result;

  // Màu sắc theo kết quả
  const badgeColor = !success
    ? "#e53e3e"
    : verified
    ? "#38a169"
    : "#dd6b20";

  const badgeText = !success
    ? "❌ Lỗi"
    : verified
    ? "✅ Đã xác minh"
    : "⚠️ Không khớp";

  const percentage = similarity != null ? (similarity * 100).toFixed(1) : null;

  return (
    <div style={styles.resultCard}>
      <h3 style={styles.cardTitle}>🔍 Kết quả xác minh</h3>

      {/* Status badge */}
      <div style={{ ...styles.badge, backgroundColor: badgeColor }}>
        {badgeText}
      </div>

      <p style={styles.resultMessage}>{message}</p>

      {/* Similarity meter */}
      {similarity != null && (
        <div style={styles.meterContainer}>
          <div style={styles.meterLabel}>
            <span>Độ tương đồng khuôn mặt</span>
            <span style={{ fontWeight: 700, color: badgeColor }}>
              {percentage}%
            </span>
          </div>
          <div style={styles.meterBar}>
            {/* Threshold line */}
            <div
              style={{
                ...styles.meterThreshold,
                left: `${threshold * 100}%`,
              }}
              title={`Ngưỡng: ${(threshold * 100).toFixed(0)}%`}
            />
            {/* Fill */}
            <div
              style={{
                ...styles.meterFill,
                width: `${similarity * 100}%`,
                backgroundColor: badgeColor,
              }}
            />
          </div>
          <div style={styles.meterCaption}>
            Ngưỡng xác minh: {(threshold * 100).toFixed(0)}%
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

/**
 * Form eKYC chính.
 *
 * Sử dụng trong App:
 *   import EkycForm from './ReactEkycForm';
 *   <EkycForm />
 */
export default function EkycForm() {
  const idCard = useFileUpload();
  const selfie = useFileUpload();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  /**
   * Gửi request tới eKYC service.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setResult(null);

    // Validate
    if (!idCard.file) {
      setApiError("Vui lòng chọn ảnh CCCD.");
      return;
    }
    if (!selfie.file) {
      setApiError("Vui lòng chọn ảnh selfie.");
      return;
    }

    // Tạo FormData
    const formData = new FormData();
    formData.append("idCard", idCard.file, idCard.file.name);
    formData.append("selfie", selfie.file, selfie.file.name);

    setLoading(true);
    setProgress(0);

    try {
      const response = await axios.post(EKYC_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Theo dõi tiến trình upload
        onUploadProgress: (event) => {
          if (event.total) {
            const pct = Math.round((event.loaded / event.total) * 100);
            setProgress(pct);
          }
        },
        timeout: 60000, // 60 giây timeout (model inference có thể lâu)
      });

      setResult(response.data);
    } catch (err) {
      if (err.response) {
        // Lỗi từ server (4xx, 5xx)
        const msg =
          err.response.data?.message ||
          err.response.data?.detail ||
          `Lỗi ${err.response.status}: ${err.response.statusText}`;
        setApiError(msg);
      } else if (err.request) {
        // Không kết nối được server
        setApiError(
          "Không thể kết nối tới eKYC service. " +
          "Hãy đảm bảo service đang chạy tại http://localhost:8000"
        );
      } else {
        setApiError(`Lỗi: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  /**
   * Reset toàn bộ form.
   */
  const handleReset = () => {
    idCard.reset();
    selfie.reset();
    setResult(null);
    setApiError(null);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🪪 Xác minh eKYC</h1>
          <p style={styles.subtitle}>
            Upload ảnh CCCD và ảnh selfie để xác minh danh tính
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.uploadRow}>
            <ImageUploadZone
              label="Ảnh CCCD (mặt trước)"
              preview={idCard.preview}
              error={idCard.error}
              inputRef={idCard.inputRef}
              onSelect={idCard.handleSelect}
            />
            <ImageUploadZone
              label="Ảnh Selfie"
              preview={selfie.preview}
              error={selfie.error}
              inputRef={selfie.inputRef}
              onSelect={selfie.handleSelect}
            />
          </div>

          {/* API Error */}
          {apiError && (
            <div style={styles.apiErrorBox}>
              <strong>⚠️ Lỗi:</strong> {apiError}
            </div>
          )}

          {/* Progress bar */}
          {loading && progress > 0 && progress < 100 && (
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <p style={styles.loadingText}>
              ⏳ {progress < 100 ? `Đang upload... ${progress}%` : "Đang xử lý AI..."}
            </p>
          )}

          {/* Buttons */}
          <div style={styles.buttonRow}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btnPrimary,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Đang xử lý..." : "🔍 Xác minh danh tính"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              style={styles.btnSecondary}
            >
              🔄 Làm mới
            </button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div style={styles.results}>
            <hr style={styles.divider} />
            <VerificationResult result={result} />
            <OcrResultCard ocr={result.ocr} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// STYLES (Inline CSS – thay bằng Tailwind/CSS Module tùy ý)
// ---------------------------------------------------------------------------

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    padding: "40px",
    width: "100%",
    maxWidth: "800px",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#1a202c",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#718096",
    margin: 0,
    fontSize: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  uploadRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  uploadZone: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  uploadLabel: {
    fontWeight: 600,
    color: "#2d3748",
    fontSize: "14px",
  },
  dropArea: {
    border: "2px dashed",
    borderRadius: "12px",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
    transition: "border-color 0.2s",
    backgroundColor: "#f7fafc",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dropPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    color: "#a0aec0",
    fontSize: "14px",
    userSelect: "none",
  },
  dropIcon: {
    fontSize: "36px",
  },
  dropHint: {
    fontSize: "12px",
    color: "#cbd5e0",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: "13px",
    margin: 0,
  },
  apiErrorBox: {
    background: "#fff5f5",
    border: "1px solid #fc8181",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#c53030",
    fontSize: "14px",
  },
  progressBar: {
    height: "6px",
    background: "#e2e8f0",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  },
  loadingText: {
    textAlign: "center",
    color: "#718096",
    fontSize: "14px",
    margin: 0,
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "14px 32px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.1s",
  },
  btnSecondary: {
    background: "transparent",
    color: "#718096",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
  results: {
    marginTop: "16px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "24px 0",
  },
  resultCard: {
    background: "#f7fafc",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
  },
  ocrCard: {
    background: "#f7fafc",
    borderRadius: "12px",
    padding: "24px",
  },
  cardTitle: {
    margin: "0 0 16px",
    fontSize: "16px",
    fontWeight: 700,
    color: "#2d3748",
  },
  badge: {
    display: "inline-block",
    color: "#fff",
    borderRadius: "20px",
    padding: "6px 16px",
    fontWeight: 700,
    fontSize: "14px",
    marginBottom: "12px",
  },
  resultMessage: {
    color: "#4a5568",
    fontSize: "14px",
    margin: "0 0 16px",
  },
  meterContainer: {
    marginTop: "12px",
  },
  meterLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#718096",
    marginBottom: "6px",
  },
  meterBar: {
    position: "relative",
    height: "12px",
    background: "#e2e8f0",
    borderRadius: "6px",
    overflow: "visible",
  },
  meterFill: {
    height: "100%",
    borderRadius: "6px",
    transition: "width 0.5s ease",
  },
  meterThreshold: {
    position: "absolute",
    top: "-4px",
    bottom: "-4px",
    width: "2px",
    background: "#2d3748",
    zIndex: 1,
    borderRadius: "1px",
  },
  meterCaption: {
    fontSize: "12px",
    color: "#a0aec0",
    marginTop: "6px",
  },
  ocrTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  ocrRow: {
    borderBottom: "1px solid #e2e8f0",
  },
  ocrKey: {
    padding: "10px 12px 10px 0",
    fontWeight: 600,
    color: "#4a5568",
    fontSize: "13px",
    width: "40%",
    whiteSpace: "nowrap",
  },
  ocrValue: {
    padding: "10px 0",
    color: "#1a202c",
    fontSize: "13px",
  },
};
