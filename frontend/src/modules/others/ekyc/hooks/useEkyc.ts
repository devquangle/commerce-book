import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import EkycService from "../services/ekyc.service";
import type {
  EKYCResponse,
  EkycRequest,
  EkycVerifyPayload,
} from "../types/ekyc.type";

export type { EkycRequest, EkycVerifyPayload, EKYCResponse };


const appendField = (
  formData: FormData,
  key: string,
  fileOrBlob: File | Blob,
  defaultFileName: string
) => {
  if (fileOrBlob instanceof File) {
    formData.append(key, fileOrBlob, fileOrBlob.name);
  } else {
    formData.append(key, fileOrBlob, defaultFileName);
  }
};

const toFormData = (payload: EkycVerifyPayload): FormData => {
  if (payload instanceof FormData) {
    return payload;
  }

  const formData = new FormData();
  appendField(formData, "imageFront", payload.imageFront, "front.jpg");
  appendField(formData, "imageBack", payload.imageBack, "back.jpg");
  appendField(formData, "imageSelfie", payload.imageSelfie, "selfie.jpg");
  return formData;
};

/**
 * Hook mutation thực hiện xác thực eKYC
 * Hỗ trợ truyền vào FormData hoặc object { imageFront, imageBack, imageSelfie }
 */
export const useVerifyEkyc = (
  options?: UseMutationOptions<EKYCResponse, Error, EkycVerifyPayload>
) => {
  return useMutation<EKYCResponse, Error, EkycVerifyPayload>({
    mutationFn: (payload: EkycVerifyPayload) => {
      const formData = toFormData(payload);
      return EkycService.verify(formData);
    },
    ...options,
  });
};

export const useEkyc = useVerifyEkyc;
export default useVerifyEkyc;
