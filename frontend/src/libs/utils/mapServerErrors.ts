import axios from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { getErrorMessage } from "./error";


/**
 * Chuyển lỗi server thành lỗi form và set lên react-hook-form
 * Nếu server trả lỗi theo field, chỉ set error trên form, KHÔNG show toast
 * Nếu không có field-specific error, mới show toast
 */
export function mapServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  showErrorToast?: (msg: string) => void,
) {
  if (axios.isAxiosError(error)) {
    const serverData = error.response?.data;

    // Kiểm tra cấu trúc lỗi field từ server (Spring trả về Map lỗi nằm trong thuộc tính 'data')
    if (
      serverData &&
      typeof serverData === "object" &&
      "data" in serverData &&
      serverData.data &&
      typeof serverData.data === "object" &&
      Object.keys(serverData.data).length > 0
    ) {
      // 🌟 Chỉ set lỗi lên các ô input tương ứng trên Form
      Object.entries(serverData.data).forEach(([field, message]) => {
        setError(field as Path<T>, {
          type: "server",
          message: String(message),
        });
      });

      return; 
    }

    showErrorToast?.(serverData?.message ?? "Có lỗi xảy ra từ máy chủ");
  } else {
    showErrorToast?.(getErrorMessage(error));
  }
}