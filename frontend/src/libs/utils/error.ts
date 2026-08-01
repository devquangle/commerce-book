import axios from "axios";

/**
 * Lấy thông báo lỗi từ bất kỳ error nào
 * @param error Lỗi ném ra (AxiosError hoặc Error)
 * @returns message dạng string
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object" && "message" in data) {
      const msg = (data as { message?: unknown }).message;
      if (typeof msg === "string") {
        return msg;
      }
    }
    return error.response?.statusText || "Đã xảy ra lỗi từ server";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã xảy ra lỗi không xác định";
}