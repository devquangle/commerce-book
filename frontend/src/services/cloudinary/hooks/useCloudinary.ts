import { useMutation } from "@tanstack/react-query";
import UploadImageService from "../services/cloudinary.service";
import type {
  ProductImageRequest,
  ProductImageResponse,
  UploadImageResponse,
} from "../type/cloudinary.type";

export const useUploadFile = () => {
  return useMutation<UploadImageResponse, Error, File>({
    mutationFn: (file: File) => UploadImageService.uploadFile(file),
  });
};

export const useUploadImageUrl = () => {
  return useMutation<UploadImageResponse, Error, string>({
    mutationFn: (url: string) => UploadImageService.uploadImageUrl(url),
  });
};

export const useUploadImages = () => {
  return useMutation<ProductImageResponse[], Error, ProductImageRequest[]>({
    mutationFn: (items: ProductImageRequest[]) => UploadImageService.uploadImages(items),
  });
};
