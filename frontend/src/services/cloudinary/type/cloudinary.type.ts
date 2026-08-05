export interface UploadImageResponse {
  url: string;
  publicId: string;
}

export interface UploadImageRequest {
  imageRequests: ProductImageRequest[] | [];
}
export interface ProductImageRequest {
  file?: File | null;
  url?: string | null;
  isThumbnail: boolean;
}

export interface ProductImageResponse {
  url: string;
  publicId: string;
  isThumbnail: boolean;
}
