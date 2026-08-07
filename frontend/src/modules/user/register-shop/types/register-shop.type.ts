export interface ShopAccountInfo {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

/**
 * Thông tin định danh chủ sở hữu (eKYC - Step 2).
 *
 * Các trường văn bản (fullName, cccd, …) được lưu vào RHF và gửi lên backend.
 * Các trường File (cccdFront, cccdBack, faceMedia) chỉ dùng nội bộ trong
 * FormData khi gọi eKYC service — KHÔNG được tuần tự hóa vào JSON body.
 */
export interface OwnerIdentityInfo {
  /** Họ và tên đầy đủ (in hoa, không dấu, khớp CCCD) */
  fullName: string;
  /** Số CCCD / CMND (9–12 chữ số) */
  identityNumber: string;
  /** Ngày sinh dạng ISO yyyy-MM-dd */
  dateOfBirth: string;
  /** Giới tính: "Nam" | "Nữ" */
  gender: string;
  /** Quốc tịch: */
  nationality: string;
  /** Quê quán: */
  placeOfOrigin: string;
    /** Nơi thường trú: */
  placeOfResidence: string;
  /** Ngày cấp CCCD dạng ISO yyyy-MM-dd */
  issueDate: string;
  /** Ngày hết hạn CCCD dạng ISO yyyy-MM-dd (rỗng nếu không thời hạn) */
  expiryDate: string;
  personalIdentification: string;
  /** Địa chỉ thường trú trên CCCD */
  issuePlace: string;
}

export interface ShopInfo {
  shopName: string;
  shopDescription: string;
  logo?: string;
  banner?: string;
  bankName: string;
  bankNumber: string;
  ownerName: string;
}

export interface ShopAddressInfo {
  provinceId: number;
  districtId: number;
  wardCode: string;
  street: string;
}

export interface RegisterShopRequest
  extends ShopAccountInfo, OwnerIdentityInfo, ShopInfo, ShopAddressInfo {}
