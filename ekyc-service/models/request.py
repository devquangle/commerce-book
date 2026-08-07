"""
Request models for the eKYC Service.
Note: Hầu hết các API sử dụng multipart/form-data để upload ảnh,
tuy nhiên định nghĩa ở đây dự phòng cho các API JSON tương lai.
"""
from pydantic import BaseModel

class BaseRequest(BaseModel):
    """
    Base model cho mọi request.
    """
    pass
