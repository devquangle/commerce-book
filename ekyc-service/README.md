# eKYC Service

Microservice xác minh danh tính điện tử (eKYC) cho **CCCD Việt Nam** sử dụng:

- 🔍 **PaddleOCR** — Trích xuất thông tin từ ảnh CCCD
- 👤 **InsightFace** (buffalo_l) — So khớp khuôn mặt
- ⚡ **FastAPI** — REST API hiệu suất cao
- 🏗️ **Clean Architecture** — Dễ bảo trì và mở rộng

---

## Cấu trúc Project

```
ekyc-service/
│
├── app.py                      # Entry point – FastAPI + Lifespan
├── requirements.txt            # Python dependencies
├── README.md                   # Tài liệu này
│
├── api/
│   └── ekyc_controller.py      # HTTP layer: POST /verify, GET /health
│
├── services/
│   ├── ocr_service.py          # PaddleOCR singleton wrapper
│   ├── face_service.py         # InsightFace singleton wrapper
│   └── ekyc_service.py         # Business logic orchestrator
│
├── parsers/
│   └── cccd_parser.py          # CCCD text parser (regex-based)
│
├── models/
│   ├── ekyc_response.py        # Pydantic response models
│   └── ocr_response.py         # Pydantic OCR result model
│
├── utils/
│   ├── image_utils.py          # Image I/O utilities
│   └── regex_utils.py          # Regex patterns & extraction helpers
│
├── examples/
│   ├── SpringBootIntegration.java  # Spring Boot RestTemplate example
│   └── ReactEkycForm.jsx           # React upload form example
│
├── uploads/                    # (tự tạo) Lưu ảnh upload
└── temp/                       # (tự tạo) Lưu ảnh xử lý tạm
```

---

## API

### `POST /verify`

Xác minh danh tính bằng CCCD + selfie.

**Request:** `multipart/form-data`

| Field    | Type   | Mô tả                          |
|----------|--------|-------------------------------|
| `idCard` | File   | Ảnh mặt trước CCCD (JPG/PNG)  |
| `selfie` | File   | Ảnh selfie người dùng          |

**Response:**

```json
{
  "success": true,
  "message": "Verification completed",
  "verified": true,
  "similarity": 0.91,
  "threshold": 0.75,
  "ocr": {
    "identityNumber": "001234567890",
    "fullName": "NGUYỄN VĂN AN",
    "dateOfBirth": "15/08/1990",
    "gender": "Nam",
    "nationality": "Việt Nam",
    "placeOfOrigin": "Hà Nội",
    "placeOfResidence": "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
    "issueDate": "20/01/2022"
  }
}
```

**Lỗi face detection:**

```json
{
  "success": false,
  "message": "Face not found on ID card"
}
```

### `GET /health`

```json
{
  "status": "healthy",
  "services": {
    "ocr": "ready",
    "face": "ready"
  }
}
```

---

## Cài đặt & Chạy

### Yêu cầu hệ thống

| Yêu cầu | Phiên bản  |
|---------|-----------|
| Python  | 3.11+     |
| RAM     | ≥ 4GB (8GB khuyến nghị) |
| Disk    | ≥ 3GB (models + dependencies) |

---

### 🪟 Windows

#### Bước 1 — Tạo môi trường ảo

```powershell
# Mở PowerShell trong thư mục ekyc-service
cd ekyc-service

python -m venv venv
.\venv\Scripts\activate
```

#### Bước 2 — Cài PaddlePaddle (CPU)

```powershell
# Cài PaddlePaddle trước (tránh conflict với pip install -r)
pip install paddlepaddle==2.6.2 -f https://www.paddlepaddle.org.cn/whl/windows/cpu/stable.html
```

> ⚠️ **Lưu ý Windows**: Nếu gặp lỗi với paddlepaddle, thử:
> ```powershell
> pip install paddlepaddle==2.6.2
> ```

#### Bước 3 — Cài toàn bộ dependencies

```powershell
pip install -r requirements.txt
```

#### Bước 4 — Chạy service

```powershell
# Development (hot reload)
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Hoặc chạy trực tiếp qua Python
python app.py
```

> 📌 **Lần đầu chạy**: InsightFace sẽ tự tải model `buffalo_l` (~500MB) về `%USERPROFILE%\.insightface\models\buffalo_l\`. Cần có kết nối internet.

---

### 🐧 Ubuntu / Debian

#### Bước 1 — Chuẩn bị hệ thống

```bash
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip libgl1-mesa-glx libglib2.0-0
```

#### Bước 2 — Tạo môi trường ảo

```bash
cd ekyc-service
python3.11 -m venv venv
source venv/bin/activate
```

#### Bước 3 — Cài PaddlePaddle (CPU)

```bash
pip install paddlepaddle==2.6.2 -f https://www.paddlepaddle.org.cn/whl/linux/cpu/stable.html
```

#### Bước 4 — Cài dependencies

```bash
pip install -r requirements.txt
```

#### Bước 5 — Chạy service

```bash
# Development
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Production (nhiều workers)
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 2 --log-level info
```

#### (Tùy chọn) Chạy với systemd

```ini
# /etc/systemd/system/ekyc-service.service
[Unit]
Description=eKYC Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/ekyc-service
ExecStart=/home/ubuntu/ekyc-service/venv/bin/uvicorn app:app --host 0.0.0.0 --port 8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable ekyc-service
sudo systemctl start ekyc-service
sudo systemctl status ekyc-service
```

---

## Test với curl

```bash
# Health check
curl http://localhost:8000/health

# Verify (thay đường dẫn ảnh thực tế)
curl -X POST http://localhost:8000/verify \
  -F "idCard=@/path/to/cccd.jpg" \
  -F "selfie=@/path/to/selfie.jpg"
```

---

## Tích hợp

### Spring Boot

Xem [`examples/SpringBootIntegration.java`](examples/SpringBootIntegration.java)

```java
@Autowired
EkycIntegrationService ekycService;

// Trong controller
EkycResponse result = ekycService.verifyFromMultipart(idCardFile, selfieFile);
if (result.isSuccess() && result.getVerified()) {
    // Xác minh thành công
}
```

### React

Xem [`examples/ReactEkycForm.jsx`](examples/ReactEkycForm.jsx)

```jsx
import EkycForm from './ReactEkycForm';

function App() {
  return <EkycForm />;
}
```

---

## Cấu hình

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `threshold` | `0.75` | Ngưỡng cosine similarity |
| `MAX_FILE_SIZE_MB` | `10` | Kích thước file tối đa |
| `model_name` | `buffalo_l` | InsightFace model |
| `lang` | `vi` | PaddleOCR language |

Thay đổi trong `services/face_service.py` và `api/ekyc_controller.py`.

---

## Luồng xử lý

```
POST /verify
     │
     ▼
[1] Lưu file tạm (temp/)
     │
     ▼
[2] PaddleOCR → text lines → CCCDParser → OcrResult
     │
     ▼
[3] InsightFace detect face trên CCCD
   └─ Không tìm thấy → {success: false, "Face not found on ID card"}
     │
     ▼
[4] InsightFace detect face trên selfie
   └─ Không tìm thấy → {success: false, "Face not found on selfie"}
     │
     ▼
[5] Extract embedding → Cosine similarity
     │
     ├─ similarity >= 0.75 → verified = true
     └─ similarity <  0.75 → verified = false
     │
     ▼
[6] EkycResponse (success, verified, similarity, ocr)
     │
     ▼
[cleanup] Xóa file tạm
```

---

## Tài liệu API tương tác

Sau khi chạy service, truy cập:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Troubleshooting

### `ModuleNotFoundError: No module named 'paddle'`
```bash
pip install paddlepaddle==2.6.2
```

### `InsightFace download failed`
- Kiểm tra kết nối internet lần đầu chạy
- Model cache tại `~/.insightface/models/buffalo_l/`
- Thử tải thủ công: https://github.com/deepinsight/insightface/releases

### `libGL.so.1: cannot open shared object file` (Ubuntu)
```bash
sudo apt install libgl1-mesa-glx
```

### OCR kết quả kém
- Đảm bảo ảnh CCCD rõ nét, đủ sáng, không bị mờ
- Độ phân giải tối thiểu: 800x500 pixels
- Ảnh không bị nghiêng quá 30°

### Similarity thấp mặc dù cùng người
- Thử hạ threshold xuống `0.65` trong `services/face_service.py`
- Đảm bảo selfie chụp thẳng mặt, đủ sáng
- Ảnh CCCD phải rõ nét (không bị nhòe, phản sáng)
