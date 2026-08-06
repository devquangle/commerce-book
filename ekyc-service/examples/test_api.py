"""
Ví dụ script test nhanh eKYC service bằng Python thuần.

Chạy:
    python examples/test_api.py

Đảm bảo service đang chạy tại http://localhost:8000
và có ảnh CCCD + selfie sẵn sàng.
"""

import sys
import requests


EKYC_URL = "http://localhost:8000/verify"
HEALTH_URL = "http://localhost:8000/health"


def test_health():
    """Kiểm tra service có đang chạy không."""
    try:
        resp = requests.get(HEALTH_URL, timeout=5)
        data = resp.json()
        print("✅ Health check:", data)
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Không kết nối được service. Hãy chắc service đang chạy:")
        print("   uvicorn app:app --host 0.0.0.0 --port 8000 --reload")
        return False


def test_verify(id_card_path: str, selfie_path: str):
    """Gọi POST /verify với ảnh thực tế."""
    print(f"\n📤 Gửi request tới {EKYC_URL}...")
    print(f"   idCard : {id_card_path}")
    print(f"   selfie : {selfie_path}")

    with open(id_card_path, "rb") as id_file, open(selfie_path, "rb") as selfie_file:
        files = {
            "idCard": (id_card_path, id_file, "image/jpeg"),
            "selfie": (selfie_path, selfie_file, "image/jpeg"),
        }
        try:
            resp = requests.post(EKYC_URL, files=files, timeout=120)
        except requests.exceptions.Timeout:
            print("❌ Timeout! Model đang load lần đầu, thử lại sau vài giây.")
            return

    print(f"\n📥 Status code: {resp.status_code}")

    try:
        data = resp.json()
    except Exception:
        print("❌ Response không phải JSON:", resp.text)
        return

    print("\n🔍 Kết quả eKYC:")
    print(f"  success   : {data.get('success')}")
    print(f"  message   : {data.get('message')}")
    print(f"  verified  : {data.get('verified')}")
    print(f"  similarity: {data.get('similarity')}")
    print(f"  threshold : {data.get('threshold')}")

    ocr = data.get("ocr")
    if ocr:
        print("\n📋 Thông tin OCR:")
        for key, value in ocr.items():
            print(f"  {key:20s}: {value}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Cách dùng: python examples/test_api.py <path_to_cccd.jpg> <path_to_selfie.jpg>")
        print("Ví dụ   : python examples/test_api.py cccd.jpg selfie.jpg")
        sys.exit(1)

    id_path = sys.argv[1]
    selfie_path = sys.argv[2]

    print("=" * 60)
    print("  eKYC Service – API Test Script")
    print("=" * 60)

    if test_health():
        test_verify(id_path, selfie_path)
